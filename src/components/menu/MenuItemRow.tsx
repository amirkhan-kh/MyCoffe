"use client";

import { AnimatePresence, motion } from "motion/react";
import { formatPriceRange } from "@/lib/format";
import { DICT } from "@/lib/i18n";
import type { Lang, MenuItem } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

export function MenuItemRow({
  item,
  lang,
  open,
  onToggle,
}: {
  item: MenuItem;
  lang: Lang;
  open: boolean;
  onToggle: () => void;
}) {
  const description = item.description[lang] || item.description.ru || item.description.uz;
  const panelId = `desc-${item.id}`;

  return (
    <li className="relative border-t border-[var(--line)] first:border-t-0">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-x-3 inset-y-0 rounded-2xl bg-gradient-to-r from-caramel-400/0 via-caramel-400/[0.09] to-caramel-400/0"
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        disabled={!description}
        className="relative flex w-full items-baseline py-[13px] text-left disabled:cursor-default"
      >
        <span className="min-w-0 font-serif text-[16.5px] font-medium leading-snug text-crema-50">
          {item.name[lang]}
          {item.seasonal && (
            <span className="ml-2 inline-flex translate-y-[-2px] items-center gap-1 rounded-full border border-[color-mix(in_oklab,var(--season-accent)_55%,transparent)] px-2 py-[1px] align-middle font-sans text-[9.5px] font-bold uppercase tracking-[0.14em] text-[color:var(--season-accent)]">
              <svg viewBox="0 0 10 10" className="h-2 w-2" aria-hidden>
                <path d="M5 0c.3 2.2 1.3 3.2 3.5 3.5C6.3 3.8 5.3 4.8 5 7c-.3-2.2-1.3-3.2-3.5-3.5C3.7 3.2 4.7 2.2 5 0Z" fill="currentColor" />
              </svg>
              {DICT[lang].seasonal}
            </span>
          )}
        </span>
        <span className="leader" />
        <span className="whitespace-nowrap font-serif text-[15.5px] font-semibold tabular-nums tracking-[0.01em] text-caramel-300">
          {formatPriceRange(item.price, item.priceMax)}
        </span>
        {description && (
          <span aria-hidden className="relative ml-2.5 grid h-4 w-4 shrink-0 translate-y-[2px] place-items-center self-center">
            <span className="absolute h-px w-2.5 bg-crema-200/60" />
            <motion.span
              className="absolute h-2.5 w-px bg-crema-200/60"
              initial={false}
              animate={{ rotate: open ? 90 : 0, opacity: open ? 0 : 1 }}
              transition={{ duration: 0.3, ease: EASE }}
            />
          </span>
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && description && (
          <motion.div
            id={panelId}
            key="desc"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: { duration: 0.45, ease: EASE }, opacity: { duration: 0.3 } }}
            className="relative overflow-hidden"
          >
            <motion.p
              initial={{ y: -6 }}
              animate={{ y: 0 }}
              exit={{ y: -4 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="pb-4 pr-7 font-display text-[18px] italic leading-[1.42] text-crema-200/90"
            >
              {description}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
