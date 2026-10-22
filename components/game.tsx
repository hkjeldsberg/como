"use client";

import type { Session } from "@supabase/supabase-js";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { GuesserView } from "@/components/guesser-view";
import { Lobby } from "@/components/lobby";
import { RoundSummary } from "@/components/round-summary";
import { ScoreBar } from "@/components/score-bar";
import { SwipeCard } from "@/components/swipe-card";
import { playerFromEmail, useGame } from "@/hooks/use-game";
import { usePrefs } from "@/hooks/use-prefs";
import { playerNumberOf, recordSwipe, startRound } from "@/lib/game";
import { haptics } from "@/lib/haptics";
import type { CardResult, PlayerNumber } from "@/lib/types";

const DEFAULT_AVATARS: Record<PlayerNumber, string> = { 1: "🦊", 2: "🐙" };

export function Game({ session }: { session: Session }) {
  const me = playerFromEmail(session.user.email) ?? 1;
  const prefs = usePrefs(DEFAULT_AVATARS[me]);
  const game = useGame(session, prefs.avatar);
  const { state, words, wordsById, roundCards, online } = game;

  const [busy, setBusy] = useState(false);
  const [lastResult, setLastResult] = useState<CardResult>("correct");
  const [flying, setFlying] = useState<{ id: string; text: string } | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Double vibration when a round ends, on both devices.
  const prevStatus = useRef(state?.status);
  useEffect(() => {
    if (prevStatus.current === "playing" && state?.status === "round_summary") haptics.roundEnd();
    prevStatus.current = state?.status;
  }, [state?.status]);

  if (game.error) {
    return (
      <Centered>
        <p className="font-semibold">No se pudo conectar</p>
        <p className="mt-2 text-sm text-foreground/60">{game.error}</p>
      </Centered>
    );
  }
  if (!state || !words.length) return <Centered>Cargando…</Centered>;

  const avatars: Record<PlayerNumber, string> = {
    1: me === 1 ? prefs.avatar : (online[1]?.avatar ?? DEFAULT_AVATARS[1]),
    2: me === 2 ? prefs.avatar : (online[2]?.avatar ?? DEFAULT_AVATARS[2]),
  };
  const describer = playerNumberOf(state, state.active_describer_id);
  const isDescriber = state.active_describer_id === session.user.id;
  const scores = { 1: state.player_1_score, 2: state.player_2_score };

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    setActionError(null);
    try {
      await action();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  const handleStart = () => run(() => startRound(state, words));

  function handleSwipe(result: CardResult) {
    const word = state && state.current_word_id ? wordsById.get(state.current_word_id) : undefined;
    if (!state || !word || busy) return;
    setLastResult(result);
    if (result === "correct") {
      setFlying({ id: word.id, text: word.spanish_word });
      setTimeout(() => setFlying(null), 650);
    }
    const playedIds = new Set(roundCards.map((c) => c.word_id));
    run(async () => {
      const next = await recordSwipe(state, word, result, words, playedIds);
      if (next) game.setState(next);
    });
  }

  if (state.status === "waiting") {
    return (
      <Lobby
        me={me}
        avatars={avatars}
        connected={{ 1: !!online[1], 2: !!online[2] }}
        avatar={prefs.avatar}
        onAvatar={prefs.setAvatar}
        theme={prefs.theme}
        onTheme={prefs.setTheme}
        onStart={handleStart}
        starting={busy}
      />
    );
  }

  const currentWord = state.current_word_id ? wordsById.get(state.current_word_id) : undefined;
  const playing = state.status === "playing";
  const nextDescriber: PlayerNumber = describer === 1 ? 2 : 1;
  const label = (p: PlayerNumber | null) => (p === me ? "tú" : `Player ${p}`);
  const guesserFlash =
    game.lastCard && game.lastCard.round_id === state.current_round_id ? game.lastCard : null;

  return (
    <LayoutGroup>
      <main className="flex min-h-dvh flex-col">
        <ScoreBar
          scores={scores}
          avatars={avatars}
          me={me}
          describer={describer}
          flying={flying}
          progress={playing ? { played: state.cards_played, total: state.cards_per_round } : undefined}
        />

        {isDescriber ? (
          <div className="flex flex-1 flex-col px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
            <div className="relative mx-auto w-full max-w-sm flex-1 max-h-[60dvh]">
              <AnimatePresence custom={lastResult} mode="popLayout">
                {playing && currentWord && (
                  <SwipeCard key={`${state.cards_played}-${currentWord.id}`} word={currentWord} disabled={busy} onSwipe={handleSwipe} />
                )}
              </AnimatePresence>
            </div>
            <div className="mt-6 flex justify-between text-sm font-medium text-foreground/50">
              <span>← Saltar</span>
              <span>Describe en español</span>
              <span>Correcto →</span>
            </div>
          </div>
        ) : (
          <GuesserView describerAvatar={avatars[describer ?? 1]} flash={guesserFlash} />
        )}

        {actionError && <p className="px-6 pb-4 text-center text-sm text-red-500">{actionError}</p>}
      </main>

      <AnimatePresence>
        {state.status === "round_summary" && (
          <RoundSummary
            cards={roundCards}
            wordsById={wordsById}
            describerLabel={label(describer)}
            nextDescriberLabel={label(nextDescriber)}
            onNextRound={handleStart}
            starting={busy}
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <main className="grid min-h-dvh place-items-center px-8 text-center text-foreground/70">{children}</main>;
}
