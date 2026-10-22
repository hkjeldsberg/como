"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { RoundCard } from "@/lib/types";

const PARTICLES = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2;
  return { x: Math.cos(angle), y: Math.sin(angle), size: 6 + (i % 3) * 4 };
});

type Props = {
  describerAvatar: string;
  /** The most recent swipe by the describer; drives the flash. */
  flash: RoundCard | null;
};

export function GuesserView({ describerAvatar, flash }: Props) {
  const correct = flash?.result === "correct";

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-10 px-6">
      <AnimatePresence>
        {flash && (
          <motion.div
            key={flash.id}
            className="pointer-events-none fixed inset-0 z-20"
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{
              background: correct
                ? "radial-gradient(circle at 50% 45%, rgba(16,185,129,0.75), rgba(16,185,129,0.15) 70%)"
                : "radial-gradient(circle at 50% 45%, rgba(113,113,122,0.6), rgba(113,113,122,0.1) 70%)",
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative grid place-items-center">
        {[0, 1, 2].map((ring) => (
          <motion.span
            key={ring}
            className="absolute size-40 rounded-full border border-foreground/20 bg-foreground/5"
            animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: ring * 0.8, ease: "easeOut" }}
          />
        ))}
        <motion.div
          className="relative grid size-40 place-items-center rounded-full border border-white/50 bg-white/50 text-7xl shadow-2xl backdrop-blur-xl dark:border-white/15 dark:bg-white/15"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          {describerAvatar}
        </motion.div>

        <AnimatePresence>
          {flash &&
            correct &&
            PARTICLES.map((p, i) => (
              <motion.span
                key={`${flash.id}-${i}`}
                className="absolute rounded-full bg-emerald-400"
                style={{ width: p.size, height: p.size }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.x * 160, y: p.y * 160, opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
        </AnimatePresence>

        <AnimatePresence>
          {flash && (
            <motion.span
              key={`label-${flash.id}`}
              className="absolute -top-14 text-3xl font-extrabold"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: -10, scale: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {correct ? `+${flash.points}` : "Saltada"}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center">
        <p className="text-2xl font-semibold">Escucha y adivina</p>
        <p className="mt-1 text-foreground/55">Grita la palabra cuando la sepas</p>
      </div>
    </div>
  );
}
