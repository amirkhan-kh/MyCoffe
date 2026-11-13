"use client";

import { motion, type MotionValue } from "motion/react";

export type CardStyle = "victorian" | "glass" | "clay" | "future" | "surreal";

/** A fixed rhythm keeps neighbours different while the menu still reads as one family. */
export const CARD_STYLES: CardStyle[] = ["victorian", "glass", "clay", "future", "surreal"];

const FILIGREE =
  "M2 30 C2 14 14 2 30 2 M2 30 C6 22 10 18 18 16 C14 20 13 24 15 27 C17 23 21 21 25 22 C21 24 20 28 22 31 M30 2 C22 6 18 10 16 18 C20 14 24 13 27 15 C23 17 21 21 22 25 C24 21 28 20 31 22 M9 9 m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0";

function VictorianCorners() {
  const corners = [
    "left-2.5 top-2.5",
    "right-2.5 top-2.5 -scale-x-100",
    "left-2.5 bottom-2.5 -scale-y-100",
    "right-2.5 bottom-2.5 -scale-100",
  ];
  return (
    <>
      {corners.map((c) => (
        <svg key={c} viewBox="0 0 34 34" className={`pointer-events-none absolute h-8 w-8 ${c}`} aria-hidden>
          <path d={FILIGREE} fill="none" stroke="rgb(207 174 116 / 0.55)" strokeWidth="0.9" strokeLinecap="round" />
        </svg>
      ))}
    </>
  );
}

function FutureHud({ index, total }: { index: number; total: number }) {
  const bracket = "pointer-events-none absolute h-4 w-4 border-[rgb(140_230_255/0.55)]";
  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <div className="hud-scan absolute inset-x-0 -top-1/2 h-[200%]" />
      </div>
      <span className={`${bracket} left-3 top-3 border-l border-t`} />
      <span className={`${bracket} right-3 top-3 border-r border-t`} />
      <span className={`${bracket} bottom-3 left-3 border-b border-l`} />
      <span className={`${bracket} bottom-3 right-3 border-b border-r`} />
      <span className="pointer-events-none absolute bottom-3.5 right-9 font-mono text-[8.5px] tracking-[0.3em] text-[rgb(160_230_255/0.55)]">
        {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
      </span>
    </>
  );
}

function Bean({ className, delay }: { className: string; delay: string }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden>
      <div className="levitate" style={{ animationDelay: delay }}>
        <svg viewBox="0 0 20 26" className="h-full w-full drop-shadow-[0_4px_6px_rgb(0_0_0/0.5)]">
          <defs>
            <radialGradient id="bean" cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stopColor="#8a5530" />
              <stop offset="0.6" stopColor="#4a2814" />
              <stop offset="1" stopColor="#24120a" />
            </radialGradient>
          </defs>
          <ellipse cx="10" cy="13" rx="9" ry="12" fill="url(#bean)" />
          <path d="M10 2 C6 8 14 17 10 24" stroke="#1a0c06" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <ellipse cx="6.5" cy="8" rx="2" ry="3.5" fill="#fff" opacity="0.12" />
        </svg>
      </div>
      <div className="levitate-shadow mx-auto mt-3 h-1 w-3/4 rounded-full bg-black/60 blur-[2px]" style={{ animationDelay: delay }} />
    </div>
  );
}

function SurrealLayer() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <div className="surreal-blob absolute -right-10 -top-14 h-48 w-48 opacity-30" />
        <div className="surreal-blob absolute -bottom-20 -left-16 h-40 w-40 opacity-20" style={{ animationDelay: "-7s" }} />
      </div>
      <Bean className="-top-9 left-[44%] h-5 w-4" delay="0s" />
      <Bean className="-top-5 left-[55%] h-3.5 w-3" delay="-2.4s" />
    </>
  );
}

function GlassSheen({ sweep }: { sweep: MotionValue<string> }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <motion.div
        className="absolute -inset-y-1/4 w-1/2 -skew-x-[18deg] bg-gradient-to-r from-transparent via-[rgb(255_244_224/0.09)] to-transparent"
        style={{ left: sweep }}
      />
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-crema-50/40 to-transparent" />
    </div>
  );
}

export function CardStyleLayer({ style, index, total, sweep }: { style: CardStyle; index: number; total: number; sweep: MotionValue<string> }) {
  if (style === "victorian") return <VictorianCorners />;
  if (style === "future") return <FutureHud index={index} total={total} />;
  if (style === "surreal") return <SurrealLayer />;
  if (style === "glass") return <GlassSheen sweep={sweep} />;
  return null;
}
