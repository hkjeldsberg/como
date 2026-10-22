"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Avatar } from "@/components/clay";
import { DUMMY_PASSWORD, PLAYER_EMAILS, supabase } from "@/lib/supabase";
import type { PlayerNumber } from "@/lib/types";

const DEFAULT_AVATARS: Record<PlayerNumber, string> = { 1: "🦊", 2: "🐙" };

export function Login() {
  const [pending, setPending] = useState<PlayerNumber | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signIn(player: PlayerNumber) {
    setPending(player);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: PLAYER_EMAILS[player],
      password: DUMMY_PASSWORD,
    });
    if (error) setError(error.message);
    setPending(null);
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between px-[22px] pb-[max(34px,env(safe-area-inset-bottom))] pt-[18vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        className="text-center"
      >
        <h1 className="text-7xl font-semibold text-clay-ink">Como</h1>
        <p className="mt-3 text-lg font-medium text-clay-muted">es como… ¿qué palabra es?</p>
      </motion.div>

      <div className="flex flex-col gap-5">
        {([1, 2] as const).map((player, i) => (
          <motion.button
            key={player}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.1 + i * 0.08 }}
            whileTap={{ scale: 0.97 }}
            disabled={pending !== null}
            onClick={() => signIn(player)}
            className="flex h-24 items-center gap-4 rounded-[32px] bg-clay-card px-5 text-left text-xl font-semibold text-clay-ink shadow-clay-lg active:shadow-clay-pressed disabled:opacity-70"
          >
            <Avatar player={player} emoji={DEFAULT_AVATARS[player]} className="size-14 text-3xl" />
            {pending === player ? "Entrando…" : `Jugar como Jugador ${player}`}
          </motion.button>
        ))}
        {error && <p className="text-center text-sm text-clay-tagInk">{error}</p>}
      </div>
    </main>
  );
}
