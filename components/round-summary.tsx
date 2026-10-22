"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ClayButton, LevelDots } from "@/components/clay";
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
        className="fixed inset-0 z-20 bg-clay-ink/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        className="fixed inset-x-0 bottom-0 z-30 mx-auto flex max-h-[88dvh] max-w-lg flex-col rounded-t-[32px] bg-clay-bg shadow-clay-lg"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
      >
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-clay-muted" />
        <div className="px-[22px] pt-4 text-center">
          <p className="text-sm font-medium text-clay-muted">fin de la ronda · {describerLabel}</p>
          <motion.p
            className="mt-1 text-6xl font-semibold tabular-nums"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.15 }}
          >
            +{points}
          </motion.p>
          <p className="font-medium text-clay-muted">
            {correct} de {cards.length} adivinadas
          </p>
        </div>

        <ul className="mt-5 flex-1 space-y-3 overflow-y-auto px-[22px] py-2">
          {cards.map((card, i) => {
            const word = wordsById.get(card.word_id);
            if (!word) return null;
            const ok = card.result === "correct";
            return (
              <motion.li
                key={card.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.04 }}
              >
                <button
                  onClick={() => setSelected(word)}
                  className="flex w-full items-center gap-3 rounded-3xl bg-clay-surface px-4 py-3 text-left shadow-clay-sm transition-shadow active:shadow-clay-pressed"
                >
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold",
                      ok ? "bg-clay-p2 text-clay-correctInk" : "bg-clay-track text-clay-muted",
                    )}
                  >
                    {ok ? `+${card.points}` : "–"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{word.spanish_word}</span>
                    <span className="block truncate text-sm font-medium text-clay-muted">{word.english}</span>
                  </span>
                  <LevelDots level={word.level} className="scale-75" />
                </button>
              </motion.li>
            );
          })}
        </ul>

        <div className="px-[22px] pb-[max(34px,env(safe-area-inset-bottom))] pt-4">
          <ClayButton onClick={onNextRound} disabled={starting}>
            siguiente ronda · describe {nextDescriberLabel}
          </ClayButton>
        </div>
      </motion.div>
      <WordSheet word={selected} onClose={() => setSelected(null)} />
    </>
  );
}
