"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { isRainy, pickScene, type Practical, type Pt, type Scene } from "@/lib/ambience/scenes";
import type { Ambience } from "@/lib/ambience/types";
import { useAmbience } from "./AmbienceProvider";
import { RainOnGlass } from "./RainOnGlass";
import { SkyBackdrop } from "./SkyBackdrop";

type Via = "future" | "iris" | "glass" | "surreal";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Each kind of change gets its own visual language. */
function transitionFor(prev: Scene | null, next: Scene): Via {
  if (!prev) return "future";
  if (prev.season !== next.season) return "surreal";
  if (prev.slot === "weather" || next.slot === "weather") return "glass";
  return "iris";
}

const DRIP_MASK = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 300' preserveAspectRatio='none'><path d='M0 0H100V118C96 118 95 150 92 150S89 122 84 122 80 170 76 170 72 126 66 126 62 140 58 140 55 120 50 120 46 182 41 182 37 124 31 124 28 148 24 148 21 121 16 121 12 160 8 160 4 119 0 119Z' fill='black'/></svg>`,
)}")`;

const ENTER: Record<Via, { initial: Record<string, string | number>; animate: Record<string, string | number>; duration: number }> = {
  future: {
    initial: { clipPath: "inset(0% 0% 100% 0%)", filter: "brightness(1.7) saturate(0.3) hue-rotate(-25deg)" },
    animate: { clipPath: "inset(0% 0% 0% 0%)", filter: "brightness(1) saturate(1) hue-rotate(0deg)" },
    duration: 1.9,
  },
  iris: { initial: {}, animate: {}, duration: 2.6 },
  glass: {
    initial: { opacity: 0, filter: "blur(26px) saturate(1.5)", scale: 1.08 },
    animate: { opacity: 1, filter: "blur(0px) saturate(1)", scale: 1 },
    duration: 2.4,
  },
  surreal: {
    initial: { maskPosition: "0% 100%", WebkitMaskPosition: "0% 100%", filter: "hue-rotate(70deg) saturate(1.7)", scale: 1.18, rotate: -3 },
    animate: { maskPosition: "0% 0%", WebkitMaskPosition: "0% 0%", filter: "hue-rotate(0deg) saturate(1)", scale: 1, rotate: 0 },
    duration: 3,
  },
};

function enterFor(via: Via, focus: Pt) {
  if (via !== "iris") return ENTER[via];
  return {
    initial: { clipPath: `circle(0% at ${focus[0]}% ${focus[1]}%)` },
    animate: { clipPath: `circle(150% at ${focus[0]}% ${focus[1]}%)` },
    duration: ENTER.iris.duration,
  };
}

/* ------------------------------------ grading ----------------------------------- */

interface Grade {
  tint: string;
  tintA: number;
  sat: number;
  bri: number;
  /** 0..1 how visible the sun is through the weather */
  sun: number;
}

function gradeFor(a: Ambience): Grade {
  const g: Grade = { tint: "255 170 90", tintA: 0, sat: 1, bri: 1, sun: 1 };
  switch (a.phase) {
    case "dawn":
      Object.assign(g, { tint: "90 110 190", tintA: 0.34, bri: 0.78 });
      break;
    case "sunrise":
      Object.assign(g, { tint: "255 150 110", tintA: 0.2, bri: 0.92 });
      break;
    case "golden":
      Object.assign(g, { tint: "255 176 96", tintA: 0.12 });
      break;
    case "dusk":
      Object.assign(g, { tint: "120 96 180", tintA: 0.22, bri: 0.95 });
      break;
  }
  const w = a.weather;
  if (w) {
    if (w.condition === "partly") g.sun = 0.6;
    if (w.condition === "cloudy") Object.assign(g, { sun: 0.15, sat: 0.84, bri: g.bri * 0.94, tint: "130 140 152", tintA: Math.max(g.tintA, 0.24) });
    if (w.condition === "fog") Object.assign(g, { sun: 0.05, sat: 0.72, bri: g.bri * 1.02, tint: "200 204 210", tintA: 0.26 });
    if (isRainy(w.condition) || w.condition === "snow") g.sun = 0;
    if (w.condition === "storm") Object.assign(g, { sat: 0.86, bri: g.bri * 0.9 });
    if (w.temp >= 32 && g.sun > 0.5 && a.elevation > 10) Object.assign(g, { tint: "255 214 130", tintA: 0.16, sat: 1.08 });
    if (w.temp <= -4) Object.assign(g, { tint: "160 196 255", tintA: Math.max(g.tintA, 0.14) });
  }
  return g;
}

/* --------------------------------- light rig ---------------------------------- */

function rayGradient(seed: number, from: number) {
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const stops: string[] = [];
  let a = 0;
  while (a < 84) {
    const gap = 2 + r() * 6;
    const beam = 1 + r() * 4.5;
    const alpha = (0.06 + r() * 0.16).toFixed(3);
    stops.push(`transparent ${a.toFixed(1)}deg`, `rgb(255 232 190 / ${alpha}) ${(a + gap).toFixed(1)}deg`, `transparent ${(a + gap + beam).toFixed(1)}deg`);
    a += gap + beam;
  }
  return `conic-gradient(from ${from.toFixed(1)}deg at 50% 50%, ${stops.join(", ")}, transparent 360deg)`;
}

function GodRays({ scene, strength }: { scene: Scene; strength: number }) {
  const [lx, ly] = scene.light!;
  const [fx, fy] = scene.focus;
  const angle = (Math.atan2(fx - lx, -(fy - ly) * 16 / 9) * 180) / Math.PI;
  const background = useMemo(() => rayGradient(scene.id.length * 977 + 13, angle - 42), [scene.id, angle]);
  return (
    <div className="absolute inset-0 transition-opacity duration-[3s]" style={{ opacity: strength, mixBlendMode: "screen" }}>
      <div className="god-rays absolute aspect-square w-[190%] -translate-x-1/2 -translate-y-1/2" style={{ left: `${lx}%`, top: `${ly}%`, background }} />
    </div>
  );
}

function Flare({ scene, strength }: { scene: Scene; strength: number }) {
  const [lx, ly] = scene.light!;
  const ghosts = [0.45, 0.8, 1.25].map((k) => ({ x: lx + (50 - lx) * k * 1.4, y: ly + (55 - ly) * k * 1.4, k }));
  return (
    <div className="pointer-events-none absolute inset-0" style={{ opacity: strength, mixBlendMode: "screen" }}>
      <div className="flare-core absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${lx}%`, top: `${ly}%` }} />
      <div className="flare-streak absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${lx}%`, top: `${ly}%` }} />
      {ghosts.map((g, i) => (
        <span
          key={i}
          className="flare-ghost absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ left: `${g.x}%`, top: `${g.y}%`, width: `${6 + i * 7}cqw`, height: `${6 + i * 7}cqw`, animationDelay: `${-i * 1.7}s` }}
        />
      ))}
    </div>
  );
}

function PracticalGlow({ p, i }: { p: Practical; i: number }) {
  return (
    <span
      className={`practical practical-${p.flicker} absolute -translate-x-1/2 -translate-y-1/2 rounded-full`}
      style={{
        left: `${p.at[0]}%`,
        top: `${p.at[1]}%`,
        width: `${p.size}cqw`,
        height: `${p.size}cqw`,
        background: `radial-gradient(circle, rgb(${p.color} / 0.55) 0%, rgb(${p.color} / 0.18) 38%, transparent 70%)`,
        animationDelay: `${-i * 0.83}s`,
      }}
    />
  );
}

function Steam({ at, i }: { at: Pt; i: number }) {
  return (
    <div className="absolute" style={{ left: `${at[0]}%`, top: `${at[1]}%` }}>
      {[0, 1, 2, 3].map((k) => (
        <span key={k} className="steam-wisp" style={{ animationDelay: `${-(k * 1.35 + i * 0.6)}s`, animationDuration: `${5 + (k % 2) * 1.2}s` }} />
      ))}
    </div>
  );
}

const MOTES = Array.from({ length: 14 }, (_, i) => ({
  x: (i * 37) % 100,
  y: 10 + ((i * 53) % 60),
  d: 9 + (i % 5) * 3,
  delay: -i * 1.9,
  s: 0.25 + (i % 3) * 0.15,
}));

/* ---------------------------------- scene layer --------------------------------- */

function SceneLayer({ scene, via, ambience, defocus }: { scene: Scene; via: Via; ambience: Ambience; defocus: MotionValue<number> | number }) {
  const enter = enterFor(via, scene.focus);
  const grade = gradeFor(ambience);
  const sunny = grade.sun;
  const raysOn = !!scene.rays && !!scene.light && sunny > 0.1;
  const flareOn = !!scene.flare && !!scene.light && sunny > 0.3;
  const masked = via === "surreal";

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      initial={enter.initial}
      animate={enter.animate}
      exit={{ opacity: 0, transition: { duration: 0.8, delay: enter.duration * 0.85 } }}
      transition={{ duration: enter.duration, ease: EASE }}
      style={
        masked
          ? { maskImage: DRIP_MASK, WebkitMaskImage: DRIP_MASK, maskSize: "100% 300%", WebkitMaskSize: "100% 300%", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat" }
          : undefined
      }
    >
      <div className="scene-fill absolute inset-0">
        <Image src={scene.src} alt="" fill unoptimized loading="eager" sizes="100vw" className="scale-125 object-cover blur-3xl brightness-[0.45] saturate-150" />
      </div>
      <div className="scene-frame">
        <div className="kenburns absolute inset-0" style={{ transformOrigin: `${scene.focus[0]}% ${scene.focus[1]}%` }}>
          <Image src={scene.src} alt="" fill unoptimized loading="eager" fetchPriority="high" sizes="(max-width: 640px) 100vw, 560px" className="object-cover" />
          <motion.div className="absolute inset-0" style={{ opacity: defocus }}>
            <Image src={scene.src} alt="" fill unoptimized loading="eager" sizes="(max-width: 640px) 100vw, 560px" className="scale-105 object-cover blur-[9px] brightness-90" />
          </motion.div>
          {scene.practicals?.map((p, i) => <PracticalGlow key={i} p={p} i={i} />)}
          {scene.steam?.map((s, i) => <Steam key={i} at={s} i={i} />)}
          {raysOn && <GodRays scene={scene} strength={0.9 * sunny} />}
          {raysOn && (
            <div className="absolute inset-0" style={{ opacity: sunny }}>
              {MOTES.map((m, i) => (
                <span
                  key={i}
                  className="dust-mote absolute rounded-full"
                  style={{ left: `${m.x}%`, top: `${m.y}%`, width: `${m.s}cqw`, height: `${m.s}cqw`, animationDuration: `${m.d}s`, animationDelay: `${m.delay}s` }}
                />
              ))}
            </div>
          )}
          {flareOn && <Flare scene={scene} strength={sunny} />}
        </div>
      </div>

      {via === "future" && (
        <>
          <motion.div
            className="holo-grid pointer-events-none absolute inset-0"
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 2.2, ease: "easeOut", delay: 0.6 }}
          />
          <motion.div
            className="scan-bar pointer-events-none absolute inset-x-0 h-[3px]"
            initial={{ top: "0%", opacity: 1 }}
            animate={{ top: "100%", opacity: [1, 1, 0] }}
            transition={{ duration: enter.duration, ease: EASE }}
          />
        </>
      )}
      {via === "glass" && (
        <motion.div
          className="pointer-events-none absolute -inset-y-10 w-[60%] -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent mix-blend-overlay"
          initial={{ left: "-70%" }}
          animate={{ left: "120%" }}
          transition={{ duration: 1.8, ease: EASE, delay: 0.3 }}
        />
      )}
    </motion.div>
  );
}

/* ----------------------------------- overlays ----------------------------------- */

function FogBanks({ amount }: { amount: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 transition-opacity duration-[3s]" style={{ opacity: amount }}>
      <div
        className="absolute -inset-x-1/4 top-[14svh] h-[34svh] blur-2xl"
        style={{ background: "linear-gradient(180deg, transparent, rgb(214 210 204 / 0.5) 45%, transparent)", animation: "drift 60s ease-in-out infinite alternate" }}
      />
      <div
        className="absolute -inset-x-1/4 top-[42svh] h-[40svh] blur-3xl"
        style={{ background: "linear-gradient(180deg, transparent, rgb(190 186 182 / 0.42) 50%, transparent)", animation: "drift 80s ease-in-out -20s infinite alternate-reverse" }}
      />
    </div>
  );
}

export function CinematicStage() {
  const { ambience, weatherReady } = useAmbience();
  const reduce = useReducedMotion();
  const target = useMemo(() => (ambience && weatherReady ? pickScene(ambience) : null), [ambience, weatherReady]);
  const [shown, setShown] = useState<{ scene: Scene; via: Via } | null>(null);
  const [baseGone, setBaseGone] = useState(false);
  const shownId = shown?.scene.id;

  useEffect(() => {
    if (!target || target.id === shownId) return;
    let cancelled = false;
    const img = new window.Image();
    img.src = target.src;
    img
      .decode()
      .catch(() => undefined)
      .then(() => {
        if (!cancelled) setShown((prev) => ({ scene: target, via: transitionFor(prev?.scene ?? null, target) }));
      });
    return () => {
      cancelled = true;
    };
  }, [target, shownId]);

  useEffect(() => {
    if (!shownId || baseGone) return;
    const id = window.setTimeout(() => setBaseGone(true), 3500);
    return () => window.clearTimeout(id);
  }, [shownId, baseGone]);

  const { scrollY } = useScroll();
  const dolly = useTransform(scrollY, [0, 1600], [1, 1.14]);
  const drift = useTransform(scrollY, [0, 1600], ["0%", "-5%"]);
  const tilt = useTransform(scrollY, [0, 1600], [0, 5]);
  const defocus = useTransform(scrollY, [0, 620], [0, 1]);
  const shade = useTransform(scrollY, [0, 900], [0.05, 0.42]);

  const grade = ambience ? gradeFor(ambience) : null;
  const w = ambience?.weather;
  const rainy = isRainy(w?.condition);
  const frosty = ambience?.season === "winter" && (!!w && (w.temp <= 0 || w.condition === "snow" || w.condition === "sleet"));
  const fog = w?.condition === "fog" ? 0.85 : w?.condition === "cloudy" ? 0.2 : 0;
  const windX = w ? Math.sin(((w.windFrom + 180) * Math.PI) / 180) * Math.min(1.6, w.windSpeed / 6) : 0;
  const imageFilter =
    grade && (grade.sat !== 1 || grade.bri !== 1) ? `saturate(${grade.sat}) brightness(${grade.bri})` : "none";

  return (
    <>
      {!baseGone && <SkyBackdrop />}
      <div aria-hidden className="grain pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={
            reduce
              ? { filter: imageFilter, transition: "filter 3s" }
              : { scale: dolly, y: drift, rotateX: tilt, transformPerspective: 1200, filter: imageFilter, transition: "filter 3s" }
          }
        >
          <AnimatePresence>
            {shown && ambience && (
              <SceneLayer key={shown.scene.id} scene={shown.scene} via={reduce ? "glass" : shown.via} ambience={ambience} defocus={reduce ? 0.6 : defocus} />
            )}
          </AnimatePresence>
        </motion.div>

        {grade && (
          <div
            className="absolute inset-0 transition-[background-color,opacity] duration-[3s]"
            style={{ backgroundColor: `rgb(${grade.tint})`, opacity: grade.tintA, mixBlendMode: "soft-light" }}
          />
        )}
        <FogBanks amount={fog} />
        {frosty && <div className="frost absolute inset-0" />}
        {rainy && w && <RainOnGlass intensity={w.condition === "drizzle" ? 0.25 : w.condition === "storm" ? 1 : 0.4 + w.intensity * 0.5} windX={windX} />}

        <motion.div className="absolute inset-0 bg-espresso-950" style={{ opacity: reduce ? 0.3 : shade }} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgb(14 9 7 / 0.55) 0%, rgb(14 9 7 / 0.08) 22%, transparent 38%, rgb(14 9 7 / 0.35) 70%, rgb(14 9 7 / 0.85) 100%)",
          }}
        />
        <div className="absolute inset-0" style={{ background: "radial-gradient(130% 95% at 50% 35%, transparent 50%, rgb(0 0 0 / 0.6) 100%)" }} />
      </div>
    </>
  );
}
