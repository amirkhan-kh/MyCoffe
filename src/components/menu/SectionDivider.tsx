"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const SCROLL_L = "M118 20 C96 20 84 10 66 12 C52 14 50 26 60 28 C68 30 70 20 62 18 M66 12 C46 8 30 22 4 20";

export function SectionDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const draw = useTransform(scrollYProgress, [0.08, 0.45], [0, 1]);
  const spin = useTransform(scrollYProgress, [0, 1], [-200, 200]);
  const lift = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 0.8]);

  return (
    <div ref={ref} aria-hidden className="relative mx-auto flex h-12 w-full max-w-[330px] items-center justify-center" style={{ perspective: 600 }}>
      <svg viewBox="0 0 120 40" className="h-8 flex-1">
        <motion.path d={SCROLL_L} fill="none" stroke="rgb(207 174 116 / 0.6)" strokeWidth="0.9" strokeLinecap="round" style={{ pathLength: reduce ? 1 : draw }} />
      </svg>
      <motion.div
        className="relative mx-1 grid h-9 w-9 shrink-0 place-items-center rounded-full"
        style={reduce ? undefined : { rotateY: spin, scale: lift, transformStyle: "preserve-3d" }}
      >
        <span className="absolute inset-0 rounded-full border border-gold/50 bg-[radial-gradient(circle_at_35%_30%,rgb(255_236_200/0.22),rgb(20_13_10/0.75)_70%)] shadow-[0_6px_18px_-6px_rgb(0_0_0/0.8),inset_0_1px_0_rgb(255_240_210/0.25)] backdrop-blur-md" />
        <svg viewBox="0 0 20 26" className="relative h-4 w-3.5">
          <ellipse cx="10" cy="13" rx="8.5" ry="11.5" fill="rgb(207 174 116 / 0.9)" />
          <path d="M10 2.5 C6.5 8 13.5 17 10 23.5" stroke="#2a170c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </motion.div>
      <svg viewBox="0 0 120 40" className="h-8 flex-1 -scale-x-100">
        <motion.path d={SCROLL_L} fill="none" stroke="rgb(207 174 116 / 0.6)" strokeWidth="0.9" strokeLinecap="round" style={{ pathLength: reduce ? 1 : draw }} />
      </svg>
    </div>
  );
}
