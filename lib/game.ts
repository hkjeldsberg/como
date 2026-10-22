import { GAME_ID, supabase } from "./supabase";
import type { CardResult, GameState, Level, PlayerNumber, Word } from "./types";

/** Random level (equal odds), then a random word of that level not yet played this round. */
export function pickWord(words: Word[], playedIds: Set<string>): Word | null {
  const levels: Level[] = [1, 2, 3];
  for (let i = levels.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [levels[i], levels[j]] = [levels[j], levels[i]];
  }
  for (const level of levels) {
    const pool = words.filter((w) => w.level === level && !playedIds.has(w.id));
    if (pool.length) return pool[Math.floor(Math.random() * pool.length)];
  }
  return null;
}

export function playerNumberOf(state: GameState, userId: string | null | undefined): PlayerNumber | null {
  if (!userId) return null;
  if (state.player_1_id === userId) return 1;
  if (state.player_2_id === userId) return 2;
  return null;
}

/** Registers the logged-in user's auth id in its player slot. */
export async function claimPlayerSlot(player: PlayerNumber, userId: string) {
  const { error } = await supabase
    .from("game_state")
    .update({ [`player_${player}_id`]: userId })
    .eq("id", GAME_ID);
  if (error) throw error;
}

/**
 * Starts a new round. From the lobby Player 1 describes first; after a round summary the roles swap.
 * Guarded on the current status so two simultaneous taps only start one round.
 */
export async function startRound(state: GameState, words: Word[]) {
  if (!state.player_1_id || !state.player_2_id) return;

  const describer =
    state.status === "round_summary"
      ? state.active_describer_id === state.player_1_id
        ? state.player_2_id
        : state.player_1_id
      : (state.active_describer_id ?? state.player_1_id);

  const word = pickWord(words, new Set());
  if (!word) return;

  const { error } = await supabase
    .from("game_state")
    .update({
      status: "playing",
      active_describer_id: describer,
      current_round_id: crypto.randomUUID(),
      current_word_id: word.id,
      cards_played: 0,
    })
    .eq("id", GAME_ID)
    .eq("status", state.status);
  if (error) throw error;
}

/**
 * Records the describer's swipe and advances to the next card, or ends the round after the last one.
 * Guarded on cards_played so a double swipe cannot count twice.
 */
export async function recordSwipe(
  state: GameState,
  word: Word,
  result: CardResult,
  words: Word[],
  playedIds: Set<string>,
) {
  if (!state.current_round_id || !state.active_describer_id) return;

  const points = result === "correct" ? word.level : 0;
  const cardsPlayed = state.cards_played + 1;
  const roundOver = cardsPlayed >= state.cards_per_round;
  const next = roundOver ? null : pickWord(words, new Set([...playedIds, word.id]));
  const scoreColumn = state.active_describer_id === state.player_1_id ? "player_1_score" : "player_2_score";

  const { data, error } = await supabase
    .from("game_state")
    .update({
      cards_played: cardsPlayed,
      [scoreColumn]: state[scoreColumn] + points,
      current_word_id: next?.id ?? state.current_word_id,
      status: roundOver || !next ? "round_summary" : "playing",
    })
    .eq("id", GAME_ID)
    .eq("cards_played", state.cards_played)
    .select()
    .maybeSingle();
  if (error) throw error;
  if (!data) return;

  const { error: insertError } = await supabase.from("round_cards").insert({
    round_id: state.current_round_id,
    describer_id: state.active_describer_id,
    word_id: word.id,
    result,
    points,
  });
  if (insertError) throw insertError;

  return data as GameState;
}
