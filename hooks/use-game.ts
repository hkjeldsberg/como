"use client";

import type { Session } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";
import { claimPlayerSlot } from "@/lib/game";
import { GAME_ID, PLAYER_EMAILS, supabase } from "@/lib/supabase";
import type { GameState, PlayerNumber, PresencePayload, RoundCard, Word } from "@/lib/types";

export function playerFromEmail(email: string | undefined): PlayerNumber | null {
  if (email === PLAYER_EMAILS[1]) return 1;
  if (email === PLAYER_EMAILS[2]) return 2;
  return null;
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  return { session, loading };
}

/** Subscribes to the single game_state row, the current round's cards and lobby presence. */
export function useGame(session: Session, avatar: string) {
  const userId = session.user.id;
  const me = playerFromEmail(session.user.email)!;

  const [state, setState] = useState<GameState | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [roundCards, setRoundCards] = useState<RoundCard[]>([]);
  const [lastCard, setLastCard] = useState<RoundCard | null>(null);
  const [online, setOnline] = useState<Partial<Record<PlayerNumber, PresencePayload>>>({});
  const [error, setError] = useState<string | null>(null);

  // Initial load + claim this player's slot.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await claimPlayerSlot(me, userId);
        const [{ data: game, error: gameError }, { data: allWords, error: wordsError }] = await Promise.all([
          supabase.from("game_state").select("*").eq("id", GAME_ID).single(),
          supabase.from("words").select("*"),
        ]);
        if (gameError) throw gameError;
        if (wordsError) throw wordsError;
        if (cancelled) return;
        setState(game as GameState);
        setWords(allWords as Word[]);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [me, userId]);

  // Realtime: game_state updates and round_cards inserts.
  useEffect(() => {
    const channel = supabase
      .channel("como-db")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "como", table: "game_state", filter: `id=eq.${GAME_ID}` },
        (payload) => setState(payload.new as GameState),
      )
      .on("postgres_changes", { event: "INSERT", schema: "como", table: "round_cards" }, (payload) => {
        const card = payload.new as RoundCard;
        setRoundCards((cards) => (cards.some((c) => c.id === card.id) ? cards : [...cards, card]));
        setLastCard(card);
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Load the cards of the current round when it changes, and again when it ends (complete summary).
  const roundId = state?.current_round_id ?? null;
  const status = state?.status;
  useEffect(() => {
    if (!roundId) return;
    let cancelled = false;
    supabase
      .from("round_cards")
      .select("*")
      .eq("round_id", roundId)
      .order("played_at")
      .then(({ data }) => {
        if (cancelled || !data) return;
        // Merge rather than replace: a realtime insert may land while this request is in flight.
        setRoundCards((cards) => {
          const byId = new Map(cards.map((c) => [c.id, c]));
          for (const card of data as RoundCard[]) byId.set(card.id, card);
          return [...byId.values()].sort((a, b) => a.played_at.localeCompare(b.played_at));
        });
      });
    return () => {
      cancelled = true;
    };
  }, [roundId, status]);

  // Presence: who is connected, plus their avatar.
  useEffect(() => {
    const channel = supabase.channel("como-presence", { config: { presence: { key: String(me) } } });
    channel
      .on("presence", { event: "sync" }, () => {
        const next: Partial<Record<PlayerNumber, PresencePayload>> = {};
        for (const entries of Object.values(channel.presenceState<PresencePayload>())) {
          for (const entry of entries) next[entry.player] = { player: entry.player, avatar: entry.avatar };
        }
        setOnline(next);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") channel.track({ player: me, avatar } satisfies PresencePayload);
      });
    return () => {
      supabase.removeChannel(channel);
    };
  }, [me, avatar]);

  const wordsById = useMemo(() => new Map(words.map((w) => [w.id, w])), [words]);
  const currentRoundCards = useMemo(
    () => roundCards.filter((c) => c.round_id === roundId),
    [roundCards, roundId],
  );

  return {
    me,
    userId,
    state,
    setState,
    words,
    wordsById,
    roundCards: currentRoundCards,
    lastCard,
    online,
    error,
  };
}
