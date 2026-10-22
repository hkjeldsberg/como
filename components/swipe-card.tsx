"use client";

import { motion, useMotionValue, useMotionValueEvent, useTransform, type PanInfo } from "framer-motion";
import { useRef } from "react";
import { LevelDots } from "@/components/glass";
import { haptics } from "@/lib/haptics";
import type { CardResult, Word } from "@/lib/types";

const SWIPE_THRESHOLD = 110;
const SWIPE_VELOCITY = 600;
const SPRING = { type: "spring", stiffness: 400, damping: 25 } as const;

const LEVEL_LABEL = { 1: "Fácil · 1 pt", 2: "Media · 2 pts", 3: "Difícil · 3 pts" } as const;

type Props = {
  word: Word;
  disabled: boolean;
  onSwipe: (result: CardResult) => void;
};

export function SwipeCard({ word, disabled, onSwipe }: Props) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-10, 10]);
  const correctOpacity = useTransform(x, [20, SWIPE_THRESHOLD], [0, 1]);
  const skipOpacity = useTransform(x, [-SWIPE_THRESHOLD, -20], [1, 0]);
  const pastThreshold = useRef(false);

  useMotionValueEvent(x, "change", (value) => {
    const past = Math.abs(value) >= SWIPE_THRESHOLD;
    if (past && !pastThreshold.current) haptics.threshold();
    pastThreshold.current = past;
  });

  function handleDragEnd(_: unknown, info: PanInfo) {
    const { offset, velocity } = info;
    if (offset.x > SWIPE_THRESHOLD || velocity.x > SWIPE_VELOCITY) onSwipe("correct");
    else if (offset.x < -SWIPE_THRESHOLD || velocity.x < -SWIPE_VELOCITY) onSwipe("skipped");
  }

  const isSpecial = ["movie", "book", "person"].includes(word.category);

  return (
    <motion.div
      className="absolute inset-0 touch-none select-none"
      style={{ x, rotate }}
      drag={disabled ? false : "x"}
      dragSnapToOrigin
      dragElastic={0.9}
      dragTransition={{ bounceStiffness: SPRING.stiffness, bounceDamping: SPRING.damping }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.85, opacity: 0, y: 40 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit="exit"
      variants={{
        exit: (result: CardResult) =>
          result === "skipped"
            ? { x: -600, rotate: -20, opacity: 0, transition: { duration: 0.35 } }
            : { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
      }}
      transition={SPRING}
      whileTap={disabled ? undefined : { scale: 1.02 }}
    >
      <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-white/50 bg-white/55 p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] backdrop-blur-2xl dark:border-white/15 dark:bg-white/12">
        <motion.div
          style={{ opacity: correctOpacity }}
          className="absolute inset-0 grid place-items-start rounded-[2.5rem] bg-emerald-500/85 p-7"
        >
          <span className="rounded-xl border-2 border-white px-3 py-1 text-xl font-extrabold uppercase tracking-wider text-white">
            ¡Correcto!
          </span>
        </motion.div>
        <motion.div
          style={{ opacity: skipOpacity }}
          className="absolute inset-0 grid place-items-start justify-end rounded-[2.5rem] bg-zinc-500/85 p-7"
        >
          <span className="rounded-xl border-2 border-white px-3 py-1 text-xl font-extrabold uppercase tracking-wider text-white">
            Saltar
          </span>
        </motion.div>

        <div className="relative flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground/55">
            <LevelDots level={word.level} />
            {LEVEL_LABEL[word.level]}
          </div>
          <motion.span
            layoutId={`word-${word.id}`}
            className="text-[clamp(2.25rem,11vw,3.75rem)] font-bold leading-[1.05] tracking-tight"
          >
            {word.spanish_word}
          </motion.span>
          {isSpecial && (
            <span className="rounded-full bg-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground/60">
              {{ movie: "Película", book: "Libro", person: "Persona" }[word.category]}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
