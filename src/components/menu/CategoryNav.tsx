"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Category, Lang } from "@/lib/types";

export const sectionId = (id: string) => `cat-${id}`;

export function CategoryNav({ categories, lang }: { categories: Category[]; lang: Lang }) {
  const [active, setActive] = useState(categories[0]?.id);
  const [stuck, setStuck] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const locked = useRef(false);
  const lockTimer = useRef(0);

  useEffect(() => {
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = e.target.id.replace(/^cat-/, "");
          if (e.isIntersecting) visible.set(id, e.boundingClientRect.top);
          else visible.delete(id);
        }
        if (locked.current || visible.size === 0) return;
        const first = categories.find((c) => visible.has(c.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-90px 0px -55% 0px" },
    );
    for (const c of categories) {
      const el = document.getElementById(sectionId(c.id));
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [categories]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const box = scroller.current;
    const chip = box?.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    if (!box || !chip) return;
    const left = chip.offsetLeft - box.clientWidth / 2 + chip.clientWidth / 2;
    box.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  const go = (id: string) => {
    setActive(id);
    locked.current = true;
    window.clearTimeout(lockTimer.current);
    lockTimer.current = window.setTimeout(() => (locked.current = false), 900);
    document.getElementById(sectionId(id))?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div ref={sentinel} aria-hidden className="h-px" />
      <motion.nav
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
        aria-label="Menu categories"
        className={`sticky top-0 z-30 transition-[background,box-shadow,backdrop-filter] duration-500 ${
          stuck
            ? "bg-espresso-950/70 shadow-[0_12px_30px_-18px_rgb(0_0_0/0.9)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div
          ref={scroller}
          className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3 [mask-image:linear-gradient(90deg,transparent,black_16px,black_calc(100%-16px),transparent)]"
        >
          {categories.map((c) => {
            const on = c.id === active;
            return (
              <button
                key={c.id}
                data-chip={c.id}
                onClick={() => go(c.id)}
                aria-current={on ? "true" : undefined}
                className={`relative isolate shrink-0 whitespace-nowrap rounded-full px-4 py-2 font-sans text-[13px] font-semibold tracking-[0.02em] transition-colors duration-300 ${
                  on ? "text-espresso-950" : "text-crema-200/85 hover:text-crema-50"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-gradient-to-b from-caramel-300 to-caramel-400 shadow-[0_6px_18px_-6px_rgb(201_148_96/0.75)]"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                {!on && <span className="absolute inset-0 -z-10 rounded-full border border-[var(--line)] bg-espresso-900/55" />}
                {c.name[lang]}
              </button>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
}
