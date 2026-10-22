"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { PlayerNumber } from "@/lib/types";

type Props = {
  scores: Record<PlayerNumber, number>;
  avatars: Record<PlayerNumber, string>;
  me: PlayerNumber;
  describer: PlayerNumber | null;
  /** A word currently flying into the describer's counter (shared layoutId with the card). */
  flying: { id: string; text: string } | null;
  progress?: { played: number; total: number };
};

export function ScoreBar({ scores, avatars, me, describer, flying, progress }: Props) {
  return (
    <header className="flex items-center justify-between gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))]">
      {([1, 2] as const).map((player) => (
        <div
          key={player}
          className={cn(
            "relative flex items-center gap-2 rounded-full border border-white/40 bg-white/40 py-1.5 pl-1.5 pr-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/10",
            player === 2 && "order-3 flex-row-reverse pl-4 pr-1.5",
          )}
        >
          <span className="grid size-9 place-items-center rounded-full bg-white/60 text-xl dark:bg-white/15">
            {avatars[player]}
          </span>
          <div className={cn("leading-tight", player === 2 && "text-right")}>
            <div className="text-[11px] font-medium uppercase tracking-wide text-foreground/50">
              {player === me ? "Tú" : `P${player}`}
              {describer === player && " · 🎙️"}
            </div>
            <motion.div
              key={scores[player]}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
              className="text-lg font-bold tabular-nums"
            >
              {scores[player]}
            </motion.div>
          </div>
          <AnimatePresence>
            {flying && describer === player && (
              <motion.span
                layoutId={`word-${flying.id}`}
                className="pointer-events-none absolute inset-x-0 top-1/2 -mt-2 whitespace-nowrap text-center text-xs font-bold"
                exit={{ opacity: 0, scale: 0.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                {flying.text}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      ))}
      {progress && (
        <div className="order-2 text-sm font-semibold tabular-nums text-foreground/60">
          {Math.min(progress.played + 1, progress.total)}/{progress.total}
        </div>
      )}
    </header>
  );
}
