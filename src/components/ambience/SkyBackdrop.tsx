"use client";

import { useMemo } from "react";
import type { Season } from "@/lib/types";
import { useAmbience } from "./AmbienceProvider";
import { Horizon } from "./Horizon";

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const STARS = (() => {
  const rnd = seeded(42);
  return Array.from({ length: 54 }, () => ({
    x: rnd() * 100,
    y: rnd() * 46,
    r: rnd() < 0.85 ? 0.6 + rnd() * 0.8 : 1.4 + rnd() * 0.6,
    d: 2.5 + rnd() * 5,
    delay: rnd() * -8,
  }));
})();

const CLOUDS = [
  { top: "6svh", left: "-20%", w: "80%", h: "16svh", dur: 140, delay: -30 },
  { top: "17svh", left: "35%", w: "90%", h: "13svh", dur: 180, delay: -90 },
  { top: "26svh", left: "-10%", w: "70%", h: "11svh", dur: 120, delay: -10 },
  { top: "2svh", left: "50%", w: "60%", h: "12svh", dur: 200, delay: -140 },
];

export function SkyBackdrop() {
  const { ambience } = useAmbience();
  const season: Season = ambience?.season ?? "autumn";
  const w = ambience?.weather;
  const cloudiness = w ? Math.max(w.cloud, w.condition === "partly" ? 0.35 : 0) : 0.12;
  const sunny = !w || w.condition === "clear" || w.condition === "partly";
  const hot = !!w && w.temp >= 30 && sunny;
  const rays = sunny ? (season === "summer" || hot ? 0.55 : 0.22) : 0;

  const stars = useMemo(
    () =>
      STARS.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-crema-50"
          style={{
            left: `${s.x}%`,
            top: `${s.y}svh`,
            width: s.r * 2,
            height: s.r * 2,
            boxShadow: s.r > 1.2 ? "0 0 6px 1px rgb(255 245 220 / 0.6)" : undefined,
            animation: `twinkle ${s.d}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      )),
    [],
  );

  return (
    <div aria-hidden className="grain pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, var(--sky-top) 0%, var(--sky-mid) 24svh, var(--sky-low) 44svh, color-mix(in oklab, var(--sky-low) 35%, #0e0907) 58svh, #0e0907 78svh)",
        }}
      />

      <div className="absolute inset-x-0 top-0 h-[50svh]" style={{ opacity: "var(--sky-stars)" }}>
        {stars}
      </div>

      {/* sun: halo, rays and disc share the same anchor */}
      <div className="absolute inset-x-0 top-0 h-[56svh]">
        <div
          className="absolute h-[150vmax] w-[150vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: "var(--sun-x)",
            top: "var(--sun-y)",
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--sky-glow) calc(var(--sky-glow-a) * 100%), transparent) 0%, transparent 34%)",
          }}
        />
        <div
          className="absolute h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2"
          style={{
            left: "var(--sun-x)",
            top: "var(--sun-y)",
            opacity: `calc(var(--sun-a) * ${rays})`,
            background:
              "repeating-conic-gradient(from 0deg, rgb(255 236 190 / 0.16) 0deg 2.5deg, transparent 2.5deg 11deg)",
            maskImage: "radial-gradient(circle, black 0%, transparent 42%)",
            WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 42%)",
            animation: "ring-spin 240s linear infinite",
          }}
        />
        <div
          className="absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: "var(--sun-x)",
            top: "var(--sun-y)",
            opacity: `calc(var(--sun-a) * (1 - var(--sky-haze)) * ${sunny ? 1 : 0.18})`,
            background: "radial-gradient(circle, #fffaf0 0%, #fff1cf 45%, color-mix(in srgb, var(--sky-glow) 70%, transparent) 70%, transparent 72%)",
            boxShadow: "0 0 60px 18px color-mix(in srgb, var(--sky-glow) 55%, transparent)",
          }}
        />
      </div>

      {/* moon */}
      <div
        className="absolute right-[16%] top-[9svh] h-11 w-11 rounded-full"
        style={{
          opacity: `calc(var(--moon-a) * ${1 - cloudiness * 0.7})`,
          boxShadow: "inset -9px 4px 0 0 #f4ead6, 0 0 40px 2px rgb(244 234 214 / 0.18)",
        }}
      />

      {/* clouds */}
      <div className="absolute inset-x-0 top-0 h-[48svh]" style={{ opacity: cloudiness, transition: "opacity 3s" }}>
        {CLOUDS.map((c, i) => (
          <div
            key={i}
            className="absolute rounded-[50%] blur-2xl"
            style={{
              top: c.top,
              left: c.left,
              width: c.w,
              height: c.h,
              background:
                "radial-gradient(ellipse at 50% 60%, color-mix(in oklab, var(--sky-mid) 55%, #f3ece2 45%) 0%, transparent 70%)",
              animation: `drift ${c.dur}s ease-in-out ${c.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <Horizon season={season} />
      <div
        className="absolute inset-x-0 bottom-0 top-[calc(50svh-1px)]"
        style={{
          background:
            "radial-gradient(90% 55% at 50% 100%, rgb(96 56 32 / 0.22), transparent 70%), linear-gradient(180deg, #0e0907, #120b08)",
        }}
      />

      {/* fog banks */}
      <div className="absolute inset-0" style={{ opacity: "var(--sky-haze)" }}>
        <div
          className="absolute -inset-x-1/4 top-[22svh] h-[30svh] blur-xl"
          style={{
            background: "linear-gradient(180deg, transparent, rgb(214 210 204 / 0.55) 45%, transparent)",
            animation: "drift 60s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute -inset-x-1/4 top-[40svh] h-[36svh] blur-2xl"
          style={{
            background: "linear-gradient(180deg, transparent, rgb(190 186 182 / 0.45) 50%, transparent)",
            animation: "drift 80s ease-in-out -20s infinite alternate-reverse",
          }}
        />
      </div>

      <div className="absolute inset-0 bg-black" style={{ opacity: "var(--sky-dim)" }} />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 90% at 50% 20%, transparent 55%, rgb(0 0 0 / 0.55) 100%)" }}
      />
    </div>
  );
}
