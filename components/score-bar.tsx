"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Avatar } from "@/components/clay";
import type { PlayerNumber } from "@/lib/types";

type Props = {
  scores: Record<PlayerNumber, number>;
  avatars: Record<PlayerNumber, string>;
  me: PlayerNumber;
  describer: PlayerNumber | null;
  /** A word currently flying into the describer's counter (shared layoutId with the card). */
  flying: { id: string; text: string } | null;
};

export function ScoreBar({ scores, avatars, me, describer, flying }: Props) {
  return (
    <header className="flex gap-3">
      {([1, 2] as const).map((player) => (
        <div key={player} className="relative flex flex-1 items-center gap-2.5 rounded-3xl bg-clay-surface p-2.5 shadow-clay-sm">
          <Avatar player={player} emoji={avatars[player]} />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-xs font-medium text-clay-muted">
              {player === me ? "tú" : `jugador ${player}`}
              {describer === player && " · describe"}
            </div>
            <motion.div
              key={scores[player]}
              initial={{ scale: 1.35 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
              className="origin-left text-2xl font-semibold tabular-nums"
            >
              {scores[player]}
            </motion.div>
          </div>
          <AnimatePresence>
            {flying && describer === player && (
              <motion.span
                layoutId={`word-${flying.id}`}
                className="pointer-events-none absolute inset-x-0 top-1/2 -mt-2 whitespace-nowrap text-center text-xs font-semibold"
                exit={{ opacity: 0, scale: 0.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                {flying.text}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      ))}
    </header>
  );
}
