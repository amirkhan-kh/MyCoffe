"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useAmbience } from "@/components/ambience/AmbienceProvider";
import { DICT } from "@/lib/i18n";
import type { Lang, Settings } from "@/lib/types";

export function Footer({ lang, settings }: { lang: Lang; settings: Settings }) {
  const d = DICT[lang];
  const { liveWeather } = useAmbience();
  const tel = settings.phone.replace(/[^\d+]/g, "");

  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mt-12 flex flex-col items-center px-5 pb-[calc(env(safe-area-inset-bottom)+32px)] text-center"
    >
      <div aria-hidden className="mb-8 flex items-center gap-2">
        <span className="h-px w-16 bg-gradient-to-l from-gold/60 to-transparent" />
        <span className="h-1.5 w-1.5 rotate-45 border border-gold/70" />
        <span className="h-px w-16 bg-gradient-to-r from-gold/60 to-transparent" />
      </div>

      <div className="relative w-[250px] overflow-hidden rounded-2xl shadow-[0_20px_50px_-20px_rgb(0_0_0/0.9),0_0_0_1px_rgb(243_231_209/0.1)]">
        <Image src="/brand/logo-wide.jpg" alt="MY COFFEE by Dilim" width={640} height={250} className="h-auto w-full" />
      </div>

      <div className="glass-card mt-8 w-full max-w-sm rounded-3xl px-6 py-5">
        <p className="font-display text-[22px] font-semibold text-crema-50">{d.hoursTitle}</p>
        <dl className="mt-3 space-y-2 text-[14px]">
          <div className="flex items-baseline">
            <dt className="text-crema-200/85">{d.weekdays}</dt>
            <span className="leader" />
            <dd className="font-serif tabular-nums text-caramel-300">
              {settings.hours.weekdays.open} – {settings.hours.weekdays.close}
            </dd>
          </div>
          <div className="flex items-baseline">
            <dt className="text-crema-200/85">{d.sunday}</dt>
            <span className="leader" />
            <dd className="font-serif tabular-nums text-caramel-300">
              {settings.hours.sunday.open} – {settings.hours.sunday.close}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-5 flex w-full max-w-sm flex-col gap-3">
        <a
          href={`tel:${tel}`}
          className="group flex items-center justify-center gap-3 rounded-full bg-gradient-to-b from-caramel-300 to-caramel-400 px-6 py-3.5 font-sans text-[14px] font-bold text-espresso-950 shadow-[0_14px_30px_-12px_rgb(201_148_96/0.8)] transition-transform duration-150 active:scale-[0.98]"
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M5 4h3.5l1.6 4.2-2.2 1.4a11 11 0 0 0 6.5 6.5l1.4-2.2L20 15.5V19a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
          </svg>
          <span>{d.call}</span>
          <span className="font-serif font-semibold tabular-nums opacity-80">{settings.phone}</span>
        </a>
        {settings.instagram && (
          <a
            href={settings.instagram}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2.5 rounded-full border border-[var(--line-strong)] bg-espresso-950/40 px-6 py-3.5 font-sans text-[14px] font-semibold text-crema-100 backdrop-blur-md transition-colors hover:bg-espresso-900/60"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
            </svg>
            {d.instagram}
          </a>
        )}
      </div>

      <p className="mt-8 font-sans text-[11px] tracking-[0.08em] text-crema-300/55">
        {d.pricesNote}
        {liveWeather && (
          <>
            {" · "}
            {d.weatherCredit}: {liveWeather.source === "met.no" ? "MET Norway" : "Open-Meteo"}
          </>
        )}
      </p>
      <p className="mt-1.5 font-display text-[13px] italic text-crema-300/45">© MY COFFEE by Dilim</p>
    </motion.footer>
  );
}
