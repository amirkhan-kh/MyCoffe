"use client";

import { motion } from "motion/react";
import { LANGS, type Lang } from "@/lib/types";

export function LanguageSwitch({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className="relative flex rounded-full border border-[var(--line-strong)] bg-espresso-950/45 p-1 backdrop-blur-md"
    >
      {LANGS.map((l) => {
        const active = l === lang;
        return (
          <button
            key={l}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(l)}
            className={`relative z-10 h-8 w-11 rounded-full font-sans text-[12px] font-bold tracking-[0.14em] transition-colors duration-300 ${
              active ? "text-espresso-950" : "text-crema-200/75 hover:text-crema-50"
            }`}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-b from-caramel-300 to-caramel-400 shadow-[0_4px_14px_-4px_rgb(201_148_96/0.7)]"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            {l.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
