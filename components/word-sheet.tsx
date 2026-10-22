"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { LevelDots } from "@/components/clay";
import { categoryLabel } from "@/lib/categories";
import type { Word } from "@/lib/types";

/** Bottom sheet with translation, example and grammar; drag down to dismiss. */
export function WordSheet({ word, onClose }: { word: Word | null; onClose: () => void }) {
  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.y > 100 || info.velocity.y > 500) onClose();
  }

  return (
    <AnimatePresence>
      {word && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-clay-ink/25"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg touch-none rounded-t-[32px] bg-clay-card px-[22px] pb-[max(34px,env(safe-area-inset-bottom))] pt-3 shadow-clay-lg"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 36 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.8 }}
            onDragEnd={handleDragEnd}
          >
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-clay-muted" />
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-clay-tagBg px-3.5 py-1 text-sm font-medium text-clay-tagInk">
                {categoryLabel(word.category)}
              </span>
              <LevelDots level={word.level} />
            </div>
            <h2 className="mt-3 text-3xl font-semibold">{word.spanish_word}</h2>
            <p className="mt-1 text-xl font-medium text-clay-muted">{word.english}</p>

            {word.description && <p className="mt-5 leading-relaxed">{word.description}</p>}
            {word.example_sentence && (
              <section className="mt-5">
                <h3 className="text-sm font-medium text-clay-muted">ejemplo</h3>
                <p className="mt-1 text-lg leading-snug">“{word.example_sentence}”</p>
              </section>
            )}
            {word.grammar_note && (
              <section className="mt-5">
                <h3 className="text-sm font-medium text-clay-muted">gramática</h3>
                <p className="mt-1 leading-relaxed">{word.grammar_note}</p>
              </section>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
