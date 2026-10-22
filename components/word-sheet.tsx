"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { LevelDots } from "@/components/glass";
import type { Word } from "@/lib/types";

const SPECIAL_LABEL: Record<string, string> = { movie: "Película", book: "Libro", person: "Persona" };

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
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg touch-none rounded-t-[2rem] border border-white/40 bg-white/80 px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/85"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 36 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.8 }}
            onDragEnd={handleDragEnd}
          >
            <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-foreground/20" />
            <div className="flex items-center gap-2 text-sm text-foreground/55">
              <LevelDots level={word.level} />
              <span className="capitalize">{SPECIAL_LABEL[word.category] ?? word.category}</span>
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">{word.spanish_word}</h2>
            <p className="mt-1 text-xl text-foreground/70">{word.english}</p>

            {word.description && <p className="mt-5 leading-relaxed">{word.description}</p>}
            {word.example_sentence && (
              <section className="mt-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground/50">Ejemplo</h3>
                <p className="mt-1 text-lg italic leading-snug">“{word.example_sentence}”</p>
              </section>
            )}
            {word.grammar_note && (
              <section className="mt-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground/50">Gramática</h3>
                <p className="mt-1 leading-relaxed text-foreground/80">{word.grammar_note}</p>
              </section>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
