export type Level = 1 | 2 | 3;

export type Word = {
  id: string;
  spanish_word: string;
  category: string;
  level: Level;
  english: string;
  example_sentence: string | null;
  grammar_note: string | null;
  description: string | null;
};

export type GameStatus = "waiting" | "playing" | "round_summary";

export type GameState = {
  id: string;
  player_1_id: string | null;
  player_2_id: string | null;
  active_describer_id: string | null;
  current_round_id: string | null;
  current_word_id: string | null;
  cards_per_round: number;
  cards_played: number;
  player_1_score: number;
  player_2_score: number;
  status: GameStatus;
};

export type CardResult = "correct" | "skipped";

export type RoundCard = {
  id: string;
  round_id: string;
  describer_id: string;
  word_id: string;
  result: CardResult;
  points: number;
  played_at: string;
};

export type PlayerNumber = 1 | 2;

export type PresencePayload = {
  player: PlayerNumber;
  avatar: string;
};
