"use client";

import { motion, useMotionValue, useMotionValueEvent, useTransform, type PanInfo } from "framer-motion";
import { useRef } from "react";
import { LevelDots } from "@/components/clay";
import { categoryLabel } from "@/lib/categories";
import { haptics } from "@/lib/haptics";
import type { CardResult, Word } from "@/lib/types";

const SWIPE_THRESHOLD = 110;
const SWIPE_VELOCITY = 600;
const SPRING = { type: "spring", stiffness: 400, damping: 25 } as const;

/** Shrinks long words so the longest single token fits the 280px card. */
function wordFontSize(text: string) {
  const longest = Math.max(...text.split(/\s+/).map((t) => t.length));
  return Math.min(46, Math.floor(232 / (longest * 0.58)));
}

type Props = {
  word: Word;
  /** Tailwind bg class of the describer's color, used for the level dots. */
  accent: string;
  disabled: boolean;
  onSwipe: (result: CardResult) => void;
};

export function SwipeCard({ word, accent, disabled, onSwipe }: Props) {
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

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -ml-[140px] -mt-[170px] h-[340px] w-[280px] touch-none select-none"
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
    >
      <div className="relative flex h-full flex-col items-center justify-center gap-5 overflow-hidden rounded-[44px] bg-clay-card px-6 shadow-clay-lg">
        <motion.div style={{ opacity: correctOpacity }} className="pointer-events-none absolute inset-0 bg-clay-p2/45">
          <span className="absolute right-5 top-5 rounded-full bg-clay-p2 px-3.5 py-1 text-sm font-semibold text-clay-correctInk">
            ¡sí! +{word.level}
          </span>
        </motion.div>
        <motion.div style={{ opacity: skipOpacity }} className="pointer-events-none absolute inset-0 bg-clay-track/80">
          <span className="absolute left-5 top-5 rounded-full bg-clay-surface px-3.5 py-1 text-sm font-semibold text-clay-muted">
            paso
          </span>
        </motion.div>

        <span className="relative rounded-full bg-clay-tagBg px-3.5 py-1 text-sm font-medium text-clay-tagInk">
          {categoryLabel(word.category)}
        </span>
        <motion.span
          layoutId={`word-${word.id}`}
          className="relative text-center font-semibold leading-[1.05] text-clay-ink"
          style={{ fontSize: wordFontSize(word.spanish_word) }}
        >
          {word.spanish_word}
        </motion.span>
        <LevelDots level={word.level} fill={accent} className="relative" />
      </div>
    </motion.div>
  );
}
