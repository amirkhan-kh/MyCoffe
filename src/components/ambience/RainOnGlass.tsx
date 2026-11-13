"use client";

import { useEffect, useRef } from "react";

interface Bead {
  x: number;
  y: number;
  r: number;
}

interface Runner extends Bead {
  vy: number;
  wobble: number;
  phase: number;
  trailAt: number;
  path: [number, number][];
}

const R = (a: number, b: number) => a + Math.random() * (b - a);

/** A refracting water bead: dark rim, bright lower crescent, specular dot. */
function dropSprite() {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const m = size / 2;
  const body = g.createRadialGradient(m, m * 1.15, 2, m, m, m - 2);
  body.addColorStop(0, "rgba(255,250,240,0.04)");
  body.addColorStop(0.62, "rgba(220,230,240,0.10)");
  body.addColorStop(0.86, "rgba(255,255,255,0.22)");
  body.addColorStop(1, "rgba(10,12,16,0.0)");
  g.fillStyle = body;
  g.beginPath();
  g.arc(m, m, m - 2, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(8,10,14,0.38)";
  g.lineWidth = 2.4;
  g.beginPath();
  g.arc(m, m, m - 4, Math.PI * 1.05, Math.PI * 1.95);
  g.stroke();
  g.strokeStyle = "rgba(255,244,226,0.45)";
  g.lineWidth = 3;
  g.beginPath();
  g.arc(m, m, m - 8, Math.PI * 0.2, Math.PI * 0.8);
  g.stroke();
  g.fillStyle = "rgba(255,255,255,0.85)";
  g.beginPath();
  g.ellipse(m - m * 0.32, m - m * 0.38, m * 0.13, m * 0.09, -0.6, 0, Math.PI * 2);
  g.fill();
  return c;
}

/**
 * Rain seen from inside the café: beads collect on the pane, and the heavy ones
 * break loose and run down, swallowing smaller beads and leaving a wet trail.
 */
export function RainOnGlass({ intensity, windX }: { intensity: number; windX: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const cfg = useRef({ intensity, windX });

  useEffect(() => {
    cfg.current = { intensity, windX };
  }, [intensity, windX]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const g = canvas.getContext("2d")!;
    const sprite = dropSprite();
    let w = 0;
    let h = 0;
    let dpr = 1;
    let beads: Bead[] = [];
    let runners: Runner[] = [];
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let t = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();

    const area = () => Math.max(0.6, Math.min(2.2, (w * h) / (390 * 844)));
    const maxBeads = () => Math.round((70 + 260 * cfg.current.intensity) * area());

    for (let i = 0; i < maxBeads() * 0.6; i++) beads.push({ x: R(0, w), y: R(0, h), r: R(0.8, 3.2) });

    const step = (dt: number) => {
      t += dt;
      const { intensity: k, windX: wx } = cfg.current;
      const cap = maxBeads();
      const spawn = (12 + 80 * k) * area() * dt;
      for (let i = 0; i < spawn; i++) {
        if (beads.length >= cap) beads.splice((Math.random() * beads.length) | 0, 1);
        beads.push({ x: R(0, w), y: R(0, h), r: Math.random() < 0.9 ? R(0.7, 2.6) : R(3, 5.2) });
      }
      if (runners.length < 3 + 9 * k && Math.random() < (0.6 + 2.4 * k) * dt) {
        runners.push({ x: R(0, w), y: R(-20, h * 0.5), r: R(3.6, 6.4), vy: 0, wobble: R(0.6, 1.8), phase: R(0, 6), trailAt: 0, path: [] });
      }
      for (let i = runners.length - 1; i >= 0; i--) {
        const d = runners[i];
        d.vy = Math.min(d.vy + 520 * dt * (d.r / 6), 90 + d.r * 34);
        const stick = Math.sin(t * 2.3 + d.phase) > 0.82 ? 0.15 : 1;
        d.y += d.vy * dt * stick;
        d.x += (Math.sin(t * d.wobble * 3 + d.phase) * 10 + wx * 26) * dt;
        d.path.push([d.x, d.y]);
        if (d.path.length > 42) d.path.shift();
        if (d.y - d.trailAt > R(14, 34)) {
          d.trailAt = d.y;
          beads.push({ x: d.x + R(-1.5, 1.5), y: d.y - d.r * 1.6, r: R(0.8, 1.8) });
          d.r = Math.max(2.6, d.r - 0.12);
        }
        for (let j = beads.length - 1; j >= 0; j--) {
          const b = beads[j];
          const dx = b.x - d.x;
          const dy = b.y - d.y;
          if (dx * dx + dy * dy < (d.r + b.r) ** 2) {
            d.r = Math.min(8, Math.sqrt(d.r * d.r + b.r * b.r * 0.5));
            beads.splice(j, 1);
          }
        }
        if (d.y > h + 30) runners.splice(i, 1);
      }
    };

    const draw = () => {
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, canvas.width, canvas.height);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.lineCap = "round";
      for (const d of runners) {
        if (d.path.length < 2) continue;
        g.beginPath();
        g.moveTo(d.path[0][0], d.path[0][1]);
        for (const [x, y] of d.path) g.lineTo(x, y);
        g.strokeStyle = "rgba(210,222,236,0.07)";
        g.lineWidth = d.r * 1.3;
        g.stroke();
      }
      for (const b of beads) g.drawImage(sprite, b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
      for (const d of runners) g.drawImage(sprite, d.x - d.r, d.y - d.r * 1.2, d.r * 2, d.r * 2.4);
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      acc += dt;
      if (acc >= 1 / 40) {
        step(acc);
        draw();
        acc = 0;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      beads = [];
      runners = [];
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}
