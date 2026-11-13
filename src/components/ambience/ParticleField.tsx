"use client";

import { useEffect, useMemo, useRef } from "react";
import { useAmbience } from "./AmbienceProvider";
import { ParticleEngine } from "./particles/engine";
import { sceneFrom } from "./particles/scene";

export function ParticleField() {
  const { ambience } = useAmbience();
  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ParticleEngine | null>(null);

  const scene = useMemo(() => (ambience ? sceneFrom(ambience) : null), [ambience]);
  const sceneKey = scene ? JSON.stringify(scene) : "";

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || !backRef.current || !frontRef.current) return;

    const engine = new ParticleEngine(backRef.current, frontRef.current);
    engineRef.current = engine;

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => engine.resize(), 150);
    };
    const onVisibility = () => (document.hidden ? engine.stop() : engine.start());

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || !scene) return;
    engine.configure(scene);
    if (!document.hidden) engine.start();
    // sceneKey keeps reconfiguration to real changes, not every clock tick
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneKey]);

  return (
    <>
      <canvas ref={backRef} aria-hidden className="pointer-events-none fixed inset-0 z-[1] h-full w-full" />
      <canvas ref={frontRef} aria-hidden className="pointer-events-none fixed inset-0 z-40 h-full w-full" />
    </>
  );
}
