"use client";

import { motion } from "framer-motion";
import { Avatar, ClayButton } from "@/components/clay";
import { AVATARS } from "@/hooks/use-prefs";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import type { PlayerNumber } from "@/lib/types";

type Props = {
  me: PlayerNumber;
  avatars: Record<PlayerNumber, string>;
  connected: Record<PlayerNumber, boolean>;
  avatar: string;
  onAvatar: (avatar: string) => void;
  onStart: () => void;
  starting: boolean;
};

export function Lobby({ me, avatars, connected, avatar, onAvatar, onStart, starting }: Props) {
  const bothConnected = connected[1] && connected[2];

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-[18px] px-[22px] pb-[max(34px,env(safe-area-inset-bottom))] pt-[max(62px,env(safe-area-inset-top))]">
      <h1 className="text-4xl font-semibold">Como</h1>

      <div className="grid grid-cols-2 gap-3">
        {([1, 2] as const).map((player) => (
          <div key={player} className="flex flex-col items-center gap-3 rounded-[32px] bg-clay-card py-6 shadow-clay-lg">
            <motion.div
              animate={connected[player] ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={{ duration: 2.4, repeat: connected[player] ? Infinity : 0, ease: "easeInOut" }}
              className={cn(!connected[player] && "opacity-40")}
            >
              <Avatar player={player} emoji={avatars[player]} className="size-20 text-5xl" />
            </motion.div>
            <div className="text-center">
              <div className="font-semibold">
                Jugador {player}
                {player === me && " (tú)"}
              </div>
              <div className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-clay-muted">
                <span className={cn("size-2.5 rounded-full", connected[player] ? "bg-clay-p2" : "bg-clay-track")} />
                {connected[player] ? "Conectado" : "Esperando…"}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[32px] bg-clay-card p-5 shadow-clay-lg">
        <p className="text-sm font-medium text-clay-muted">Tu avatar</p>
        <div className="mt-3 grid grid-cols-6 gap-2.5">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => onAvatar(a)}
              className={cn(
                "grid aspect-square place-items-center rounded-full text-2xl transition-shadow",
                a === avatar ? "shadow-clay-pressed bg-clay-surface" : "bg-clay-surface shadow-clay-sm active:shadow-clay-pressed",
              )}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <ClayButton onClick={onStart} disabled={!bothConnected || starting}>
          {bothConnected ? "Empezar ronda" : "Esperando al otro jugador…"}
        </ClayButton>
        <button onClick={() => supabase.auth.signOut()} className="py-2 text-sm font-medium text-clay-muted">
          Cambiar de jugador
        </button>
      </div>
    </main>
  );
}
