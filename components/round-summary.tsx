"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LevelDots, PrimaryButton } from "@/components/glass";
import { WordSheet } from "@/components/word-sheet";
import { cn } from "@/lib/utils";
import type { RoundCard, Word } from "@/lib/types";

type Props = {
  cards: RoundCard[];
  wordsById: Map<string, Word>;
  describerLabel: string;
  nextDescriberLabel: string;
  onNextRound: () => void;
  starting: boolean;
};

export function RoundSummary({ cards, wordsById, describerLabel, nextDescriberLabel, onNextRound, starting }: Props) {
  const [selected, setSelected] = useState<Word | null>(null);
  const points = cards.reduce((sum, c) => sum + c.points, 0);
  const correct = cards.filter((c) => c.result === "correct").length;

  return (
    <>
      <motion.div
        className="fixed inset-x-0 bottom-0 z-30 mx-auto flex max-h-[88dvh] max-w-lg flex-col rounded-t-[2.25rem] border border-white/40 bg-white/70 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/75"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
      >
        <div className="px-6 pt-6 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-foreground/50">Fin de la ronda · {describerLabel}</p>
          <motion.p
            className="mt-1 text-6xl font-bold tabular-nums"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.15 }}
          >
            +{points}
          </motion.p>
          <p className="text-foreground/60">
            {correct} de {cards.length} adivinadas
          </p>
        </div>

        <ul className="mt-5 flex-1 space-y-2 overflow-y-auto px-4">
          {cards.map((card, i) => {
            const word = wordsById.get(card.word_id);
            if (!word) return null;
            return (
              <motion.li
                key={card.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.04 }}
              >
                <button
                  onClick={() => setSelected(word)}
                  className="flex w-full items-center gap-3 rounded-2xl bg-white/50 px-4 py-3 text-left transition active:scale-[0.98] dark:bg-white/8"
                >
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full text-sm font-bold text-white",
                      card.result === "correct" ? "bg-emerald-500" : "bg-zinc-400 dark:bg-zinc-600",
                    )}
                  >
                    {card.result === "correct" ? "✓" : "–"}
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold">{word.spanish_word}</span>
                    <span className="block text-sm text-foreground/55">{word.english}</span>
                  </span>
                  <LevelDots level={word.level} className="text-foreground/50" />
                </button>
              </motion.li>
            );
          })}
        </ul>

        <div className="px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
          <PrimaryButton onClick={onNextRound} disabled={starting}>
            Siguiente ronda · describe {nextDescriberLabel}
          </PrimaryButton>
        </div>
      </motion.div>
      <WordSheet word={selected} onClose={() => setSelected(null)} />
    </>
  );
}
