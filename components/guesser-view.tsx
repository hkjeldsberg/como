"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Avatar } from "@/components/clay";
import type { PlayerNumber, RoundCard } from "@/lib/types";

type Props = {
  describer: PlayerNumber;
  describerAvatar: string;
  /** The most recent swipe by the describer; drives the flash. */
  flash: RoundCard | null;
};

export function GuesserView({ describer, describerAvatar, flash }: Props) {
  const correct = flash?.result === "correct";

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-10">
      <AnimatePresence>
        {flash && (
          <motion.div
            key={flash.id}
            className={`pointer-events-none fixed inset-0 z-20 ${correct ? "bg-clay-p2" : "bg-clay-track"}`}
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      <div className="relative grid size-56 place-items-center rounded-full bg-clay-card shadow-clay-lg">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Avatar player={describer} emoji={describerAvatar} className="size-36 text-7xl" />
        </motion.div>

        <AnimatePresence>
          {flash && (
            <motion.span
              key={`label-${flash.id}`}
              className={`absolute -top-6 z-30 rounded-full px-4 py-1.5 text-xl font-semibold shadow-clay-sm ${
                correct ? "bg-clay-p2 text-clay-correctInk" : "bg-clay-surface text-clay-muted"
              }`}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: -10, scale: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {correct ? `¡sí! +${flash.points}` : "paso"}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center">
        <p className="text-2xl font-semibold">escucha y adivina</p>
        <p className="mt-1 font-medium text-clay-muted">di la palabra cuando la sepas</p>
      </div>
    </div>
  );
}
