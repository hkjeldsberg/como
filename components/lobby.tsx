"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { Glass, PrimaryButton } from "@/components/glass";
import { AVATARS, type Theme } from "@/hooks/use-prefs";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import type { PlayerNumber } from "@/lib/types";

type Props = {
  me: PlayerNumber;
  avatars: Record<PlayerNumber, string>;
  connected: Record<PlayerNumber, boolean>;
  avatar: string;
  onAvatar: (avatar: string) => void;
  theme: Theme;
  onTheme: (theme: Theme) => void;
  onStart: () => void;
  starting: boolean;
};

export function Lobby({ me, avatars, connected, avatar, onAvatar, theme, onTheme, onStart, starting }: Props) {
  const bothConnected = connected[1] && connected[2];

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Como</h1>
        <button
          aria-label="Toggle dark mode"
          onClick={() => onTheme(theme === "dark" ? "light" : "dark")}
          className="grid size-11 place-items-center rounded-full border border-white/40 bg-white/40 backdrop-blur-xl dark:border-white/10 dark:bg-white/10"
        >
          {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {([1, 2] as const).map((player) => (
          <Glass key={player} className="flex flex-col items-center gap-3 py-6">
            <motion.span
              className="grid size-20 place-items-center rounded-full bg-white/60 text-5xl dark:bg-white/15"
              animate={connected[player] ? { scale: [1, 1.05, 1] } : { scale: 1, opacity: 0.4 }}
              transition={{ duration: 2, repeat: connected[player] ? Infinity : 0 }}
            >
              {avatars[player]}
            </motion.span>
            <div className="text-center">
              <div className="font-semibold">
                Player {player}
                {player === me && " (tú)"}
              </div>
              <div
                className={cn(
                  "mt-1 inline-flex items-center gap-1.5 text-sm",
                  connected[player] ? "text-emerald-600 dark:text-emerald-400" : "text-foreground/45",
                )}
              >
                <span className={cn("size-2 rounded-full", connected[player] ? "bg-emerald-500" : "bg-foreground/30")} />
                {connected[player] ? "Connected" : "Waiting…"}
              </div>
            </div>
          </Glass>
        ))}
      </div>

      <Glass className="p-5">
        <p className="text-sm font-medium text-foreground/60">Tu avatar</p>
        <div className="mt-3 grid grid-cols-6 gap-2">
          {AVATARS.map((a) => (
            <motion.button
              key={a}
              whileTap={{ scale: 0.85 }}
              onClick={() => onAvatar(a)}
              className={cn(
                "grid aspect-square place-items-center rounded-2xl text-2xl transition",
                a === avatar ? "bg-foreground/15 ring-2 ring-foreground/40" : "bg-white/30 dark:bg-white/5",
              )}
            >
              {a}
            </motion.button>
          ))}
        </div>
      </Glass>

      <div className="mt-auto flex flex-col gap-3">
        <PrimaryButton onClick={onStart} disabled={!bothConnected || starting}>
          {bothConnected ? "Start Round" : "Esperando al otro jugador…"}
        </PrimaryButton>
        <button onClick={() => supabase.auth.signOut()} className="py-2 text-sm text-foreground/50">
          Cambiar de jugador
        </button>
      </div>
    </main>
  );
}
