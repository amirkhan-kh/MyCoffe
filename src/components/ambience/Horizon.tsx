"use client";

import { memo } from "react";
import type { Season } from "@/lib/types";

const W = 1200;
const H = 240;

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Smooth ridge line from seeded control points. */
function ridge(seed: number, base: number, amp: number, step: number) {
  const r = rng(seed);
  const pts: [number, number][] = [];
  for (let x = -step; x <= W + step; x += step * (0.6 + r() * 0.8)) {
    pts.push([x, base - r() * amp - (r() < 0.25 ? amp * 0.6 : 0)]);
  }
  let d = `M${pts[0][0]},${H} L${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    d += ` Q${px + (x - px) / 2},${Math.min(py, y) - amp * 0.12} ${x},${y}`;
  }
  return `${d} L${pts[pts.length - 1][0]},${H} Z`;
}

function poplars(seed: number, base: number, count: number, minH: number, maxH: number) {
  const r = rng(seed);
  let d = "";
  for (let i = 0; i < count; i++) {
    const x = (i / count) * W + r() * (W / count) * 0.8;
    const h = minH + r() * (maxH - minH);
    const w = h * (0.1 + r() * 0.05);
    d += `M${x},${base} C${x - w},${base - h * 0.35} ${x - w * 0.7},${base - h * 0.8} ${x},${base - h} C${x + w * 0.7},${base - h * 0.8} ${x + w},${base - h * 0.35} ${x},${base} Z `;
  }
  return d;
}

function roundTrees(seed: number, base: number, count: number) {
  const r = rng(seed);
  return Array.from({ length: count }, (_, i) => {
    const x = (i / count) * W + r() * (W / count);
    const s = 18 + r() * 16;
    return { x, y: base - s * 0.9, s };
  });
}

const FAR = ridge(7, 150, 70, 90);
const NEAR = ridge(19, 192, 40, 70);
const POPLARS = poplars(3, 214, 26, 46, 92);
const BLOSSOM = roundTrees(11, 222, 14);

function Mountains({ snow }: { snow: boolean }) {
  return (
    <>
      <defs>
        <clipPath id="hz-far">
          <path d={FAR} />
        </clipPath>
        <linearGradient id="hz-snow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.25" stopColor="#f6f8fb" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#dfe6ef" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={FAR} style={{ fill: "color-mix(in oklab, var(--sky-low) 62%, var(--sky-top))" }} opacity="0.9" />
      <rect
        x="0"
        y="40"
        width={W}
        height="140"
        fill="url(#hz-snow)"
        clipPath="url(#hz-far)"
        opacity={snow ? 0.9 : 0.16}
        style={{ mixBlendMode: "soft-light" }}
      />
      {snow && <rect x="0" y="40" width={W} height="140" fill="url(#hz-snow)" clipPath="url(#hz-far)" opacity="0.55" />}
      <path d={NEAR} style={{ fill: "color-mix(in oklab, var(--sky-low) 30%, #120c0a)" }} />
    </>
  );
}

function AutumnLayer() {
  return (
    <>
      <defs>
        <linearGradient id="hz-poplar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "color-mix(in oklab, var(--season-accent) 75%, #2a1508)" }} />
          <stop offset="1" stopColor="#1a0f0a" />
        </linearGradient>
      </defs>
      <path d={POPLARS} fill="url(#hz-poplar)" opacity="0.92" />
    </>
  );
}

function SpringLayer() {
  return (
    <>
      <path d={POPLARS} style={{ fill: "color-mix(in oklab, #4c6b3c 45%, #120d0a)" }} opacity="0.95" />
      {BLOSSOM.map((t, i) => (
        <g key={i}>
          <path d={`M${t.x},${t.y + t.s} L${t.x},${t.y} M${t.x},${t.y + t.s * 0.3} L${t.x - t.s * 0.4},${t.y - t.s * 0.2} M${t.x},${t.y + t.s * 0.2} L${t.x + t.s * 0.45},${t.y - t.s * 0.25}`} stroke="#1d130e" strokeWidth="2.2" />
          {[
            [-0.45, 0.05, 0.62],
            [0.42, 0, 0.6],
            [0, -0.35, 0.68],
            [-0.15, 0.25, 0.55],
            [0.25, 0.3, 0.5],
          ].map(([dx, dy, k], j) => (
            <circle
              key={j}
              cx={t.x + dx * t.s}
              cy={t.y + dy * t.s}
              r={t.s * k}
              style={{ fill: j % 2 ? "color-mix(in oklab, var(--season-accent) 62%, #3b2230)" : "color-mix(in oklab, var(--season-accent) 78%, #4a2a36)" }}
              opacity="0.9"
            />
          ))}
          {[0, 1, 2, 3, 4, 5].map((j) => (
            <circle key={`d${j}`} cx={(t.x + Math.cos(j * 2.1 + i) * t.s * 0.6).toFixed(1)} cy={(t.y + Math.sin(j * 1.7 + i) * t.s * 0.45).toFixed(1)} r="1.4" fill="#fff1f5" opacity="0.55" />
          ))}
        </g>
      ))}
    </>
  );
}

function WinterLayer() {
  return (
    <>
      <path d={POPLARS} style={{ fill: "color-mix(in oklab, var(--sky-low) 18%, #0f0c0d)" }} opacity="0.95" />
      <rect x="0" y="210" width={W} height="30" fill="#e9eef5" opacity="0.18" />
    </>
  );
}

const WAVE = (amp: number, len: number, y: number) => {
  let d = `M0,${y}`;
  for (let x = 0; x < W * 2; x += len) {
    d += ` q${len / 4},${-amp} ${len / 2},0 t${len / 2},0`;
  }
  return `${d} V${H} H0 Z`;
};

function SummerSea() {
  return (
    <>
      <defs>
        <linearGradient id="hz-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "color-mix(in oklab, var(--season-accent-soft) 60%, var(--sky-low))" }} />
          <stop offset="1" style={{ stopColor: "color-mix(in oklab, var(--season-accent-soft) 35%, #071114)" }} />
        </linearGradient>
      </defs>
      <rect x="0" y="150" width={W} height="90" fill="url(#hz-sea)" />
      <rect x="0" y="149" width={W} height="2" style={{ fill: "var(--sky-glow)" }} opacity="0.55" />
      <g style={{ animation: "wave 22s linear infinite" }}>
        <path d={WAVE(3, 60, 168)} fill="#ffffff" opacity="0.06" />
      </g>
      <g style={{ animation: "wave 15s linear infinite" }}>
        <path d={WAVE(5, 90, 190)} fill="#06181c" opacity="0.35" />
      </g>
      <g style={{ animation: "wave 10s linear infinite" }}>
        <path d={WAVE(7, 130, 214)} fill="#041013" opacity="0.5" />
      </g>
      {Array.from({ length: 18 }, (_, i) => (
        <rect
          key={i}
          x={(i * 211) % W}
          y={156 + ((i * 37) % 40)}
          width={10 + (i % 4) * 6}
          height="1.5"
          rx="1"
          fill="#fff6dc"
          style={{ animation: `glint ${2.4 + (i % 5) * 0.7}s ease-in-out ${-(i * 0.43)}s infinite` }}
        />
      ))}
      <g style={{ animation: "drift 90s ease-in-out infinite alternate" }} opacity="0.75">
        <path d="M820,150 l14,0 l-3,5 l-9,0 z M827,149 l0,-20 l9,18 z M826,149 l0,-15 l-7,14 z" fill="#1b2326" />
      </g>
    </>
  );
}

export const Horizon = memo(function Horizon({ season }: { season: Season }) {
  return (
    <svg
      className="absolute inset-x-0 top-[24svh] h-[26svh] w-full"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <linearGradient id="hz-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.5" stopColor="#0e0907" stopOpacity="0" />
          <stop offset="0.97" stopColor="#0e0907" stopOpacity="1" />
        </linearGradient>
      </defs>
      {season === "summer" ? (
        <SummerSea />
      ) : (
        <>
          <Mountains snow={season === "winter"} />
          {season === "autumn" && <AutumnLayer />}
          {season === "spring" && <SpringLayer />}
          {season === "winter" && <WinterLayer />}
        </>
      )}
      <rect x="0" y="0" width={W} height={H} fill="url(#hz-fade)" />
    </svg>
  );
});
