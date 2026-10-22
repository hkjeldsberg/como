"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { DUMMY_PASSWORD, PLAYER_EMAILS, supabase } from "@/lib/supabase";
import type { PlayerNumber } from "@/lib/types";

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
    <main className="flex min-h-dvh flex-col items-center justify-between px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[18vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        className="text-center"
      >
        <h1 className="text-7xl font-bold tracking-tight">Como</h1>
        <p className="mt-3 text-lg text-foreground/60">Es como… ¿qué palabra es?</p>
      </motion.div>

      <div className="flex w-full max-w-sm flex-col gap-3">
        {([1, 2] as const).map((player, i) => (
          <motion.button
            key={player}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.1 + i * 0.08 }}
            whileTap={{ scale: 0.96 }}
            disabled={pending !== null}
            onClick={() => signIn(player)}
            className="h-20 rounded-3xl border border-white/40 bg-white/40 text-xl font-semibold shadow-lg backdrop-blur-xl disabled:opacity-60 dark:border-white/10 dark:bg-white/10"
          >
            {pending === player ? "Entrando…" : `Play as Player ${player}`}
          </motion.button>
        ))}
        {error && <p className="text-center text-sm text-red-500">{error}</p>}
      </div>
    </main>
  );
}
