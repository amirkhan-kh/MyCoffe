"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useAmbience } from "@/components/ambience/AmbienceProvider";
import { SeasonBranch } from "@/components/ambience/SeasonBranch";
import { DICT, greetingKey } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { LanguageSwitch } from "./LanguageSwitch";

const EASE = [0.22, 1, 0.36, 1] as const;

const RING_DOTS = Array.from({ length: 48 }, (_, i) => ({
  cx: (74 + 66 * Math.cos((i / 48) * Math.PI * 2)).toFixed(2),
  cy: (74 + 66 * Math.sin((i / 48) * Math.PI * 2)).toFixed(2),
  r: i % 4 === 0 ? 1.1 : 0.55,
}));

export function Header({ lang, onLang }: { lang: Lang; onLang: (l: Lang) => void }) {
  const { ambience, liveWeather } = useAmbience();
  const d = DICT[lang];
  const season = ambience?.season;
  const greeting = ambience ? d.greeting[greetingKey(ambience.localHour)] : "\u00A0";
  const nightDim = { filter: "brightness(calc(0.62 + var(--sun-a) * 0.38)) saturate(calc(0.8 + var(--sun-a) * 0.2))" };

  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 420], [0, 120]);
  const heroTilt = useTransform(scrollY, [0, 420], [0, 38]);
  const heroScale = useTransform(scrollY, [0, 420], [1, 0.82]);
  const heroFade = useTransform(scrollY, [0, 380], [1, 0.15]);
  const branchL = useTransform(scrollY, [0, 500], [0, -90]);
  const branchR = useTransform(scrollY, [0, 500], [0, -40]);
  const branchSpin = useTransform(scrollY, [0, 500], [0, -10]);

  return (
    <header className="relative overflow-x-clip pt-[env(safe-area-inset-top)]">
      {season && (
        <motion.div
          key={season}
          initial={{ opacity: 0, x: -14, y: -10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
          className="pointer-events-none absolute -left-4 -top-3 w-[62vw] max-w-[310px]"
        >
          <motion.div style={reduce ? undefined : { y: branchL, rotate: branchSpin }}>
            <SeasonBranch season={season} className="w-full drop-shadow-[0_10px_14px_rgb(0_0_0/0.45)]" style={nightDim} />
          </motion.div>
        </motion.div>
      )}
      {season && (
        <motion.div
          key={`${season}-r`}
          initial={{ opacity: 0, x: 14, y: -10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.35 }}
          className="pointer-events-none absolute -right-6 top-10 w-[40vw] max-w-[210px] -scale-x-100"
        >
          <motion.div style={reduce ? undefined : { y: branchR }}>
            <SeasonBranch season={season} className="w-full rotate-[8deg] blur-[0.6px] drop-shadow-[0_10px_14px_rgb(0_0_0/0.45)]" style={nightDim} />
          </motion.div>
        </motion.div>
      )}

      <div className="relative z-10 flex items-center justify-end px-4 pt-3">
        <LanguageSwitch lang={lang} onChange={onLang} />
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center px-6 pb-7 pt-1"
        style={reduce ? undefined : { y: heroY, rotateX: heroTilt, scale: heroScale, opacity: heroFade, transformPerspective: 900, transformOrigin: "50% 0%" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative grid h-[148px] w-[148px] place-items-center"
        >
          <span aria-hidden className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgb(14_9_7/0.55),transparent_68%)]" />
          <svg viewBox="0 0 148 148" className="absolute inset-0 h-full w-full" aria-hidden>
            <motion.circle
              cx="74"
              cy="74"
              r="71"
              fill="none"
              stroke="rgb(207 174 116 / 0.55)"
              strokeWidth="0.8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease: EASE, delay: 0.15 }}
            />
            <g style={{ transformOrigin: "74px 74px", animation: "ring-spin 90s linear infinite" }}>
              {RING_DOTS.map((dot, i) => (
                <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill="rgb(226 180 127 / 0.6)" />
              ))}
            </g>
          </svg>
          <div className="relative h-[120px] w-[120px] overflow-hidden rounded-full shadow-[0_18px_50px_-12px_rgb(0_0_0/0.8),0_0_0_1px_rgb(243_231_209/0.12)]">
            <Image src="/brand/logo-round.png" alt="MY COFFEE by Dilim" fill sizes="120px" preload className="object-cover" />
          </div>
        </motion.div>

        <motion.p
          key={`${lang}-${greeting}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
          className="mt-4 font-script text-[34px] leading-none text-crema-50 drop-shadow-[0_2px_12px_rgb(0_0_0/0.45)]"
        >
          {greeting}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
          className="mt-3 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-crema-100/85 [text-shadow:0_1px_8px_rgb(0_0_0/0.55)]"
        >
          <span>{d.city}</span>
          {liveWeather && (
            <>
              <span className="h-1 w-1 rounded-full bg-gold/70" />
              <span className="tabular-nums">{Math.round(liveWeather.temp)}°</span>
              <span className="h-1 w-1 rounded-full bg-gold/70" />
              <span>{d.conditions[liveWeather.condition]}</span>
            </>
          )}
        </motion.div>
      </motion.div>
    </header>
  );
}
