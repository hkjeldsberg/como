import { createClient } from "@supabase/supabase-js";

export const GAME_ID = "00000000-0000-0000-0000-000000000001";

export const PLAYER_EMAILS = {
  1: "player1@dummy.local",
  2: "player2@dummy.local",
} as const;

export const DUMMY_PASSWORD = process.env.NEXT_PUBLIC_DUMMY_PASSWORD!;

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { db: { schema: "como" } },
);
