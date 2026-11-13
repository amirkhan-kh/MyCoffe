import type { Season } from "../types";
import { ANDIJAN } from "./location";
import type { Ambience, Phase, WeatherNow } from "./types";

const RAD = Math.PI / 180;

/** Low-precision solar position (≈0.1°), good enough to paint the sky. */
export function solarPosition(date: Date, lat = ANDIJAN.lat, lon = ANDIJAN.lon) {
  const d = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / 86400000;
  const g = (357.529 + 0.98560028 * d) * RAD;
  const q = 280.459 + 0.98564736 * d;
  const L = (q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * RAD;
  const e = (23.439 - 0.00000036 * d) * RAD;
  const ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L)) / RAD;
  const dec = Math.asin(Math.sin(e) * Math.sin(L));
  const gmst = (((18.697374558 + 24.06570982441908 * d) % 24) + 24) % 24;
  let H = gmst * 15 + lon - ra;
  H = ((((H + 180) % 360) + 360) % 360) - 180;
  const elevation =
    Math.asin(
      Math.sin(lat * RAD) * Math.sin(dec) + Math.cos(lat * RAD) * Math.cos(dec) * Math.cos(H * RAD),
    ) / RAD;
  return { elevation, hourAngle: H };
}

export function localParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: ANDIJAN.timeZone,
    month: "numeric",
    hour: "numeric",
    minute: "numeric",
    weekday: "short",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  return {
    month: Number(get("month")),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
    weekday: get("weekday"),
  };
}

export function seasonForMonth(month: number): Season {
  if (month === 12 || month <= 2) return "winter";
  if (month <= 5) return "spring";
  if (month <= 8) return "summer";
  return "autumn";
}

export function phaseFor(elevation: number, morning: boolean): Phase {
  if (elevation < -12) return "night";
  if (elevation < -3) return morning ? "dawn" : "dusk";
  if (elevation < 4) return morning ? "sunrise" : "sunset";
  if (elevation < 16) return morning ? "morning" : "golden";
  return "day";
}

export function computeAmbience(date: Date, season: Season, weather: WeatherNow | null): Ambience {
  const { elevation, hourAngle } = solarPosition(date);
  const morning = hourAngle < 0;
  return {
    season,
    weather,
    elevation,
    morning,
    sunTrack: Math.max(-1, Math.min(1, hourAngle / 100)),
    phase: phaseFor(elevation, morning),
    localHour: localParts(date).hour,
  };
}

/* ---------------------------------- palette --------------------------------- */

type RGB = [number, number, number];

const hex = (h: string): RGB => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const css = (c: RGB) => `rgb(${c.map((v) => Math.round(Math.max(0, Math.min(255, v)))).join(" ")})`;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

interface SkyKey {
  el: number;
  top: string;
  mid: string;
  low: string;
  glow: string;
  glowA: number;
  stars: number;
}

const NIGHT: SkyKey = { el: -18, top: "#05060d", mid: "#0b0e1c", low: "#17121b", glow: "#3a2c4c", glowA: 0.22, stars: 1 };
const NOON: SkyKey = { el: 55, top: "#4f6f95", mid: "#9aa7ad", low: "#dccdb0", glow: "#fff0cf", glowA: 0.42, stars: 0 };

const EVENING: SkyKey[] = [
  NIGHT,
  { el: -9, top: "#0b1022", mid: "#242a47", low: "#45304a", glow: "#94607e", glowA: 0.36, stars: 0.55 },
  { el: -3, top: "#171a37", mid: "#4f2f4f", low: "#a54d3d", glow: "#e5733b", glowA: 0.62, stars: 0.15 },
  { el: 1, top: "#232849", mid: "#8c4652", low: "#e88b47", glow: "#ffa04e", glowA: 0.85, stars: 0 },
  { el: 8, top: "#34446b", mid: "#a9705a", low: "#ecb46c", glow: "#ffc372", glowA: 0.66, stars: 0 },
  { el: 22, top: "#46628b", mid: "#a29a8d", low: "#dcc29a", glow: "#ffe2a6", glowA: 0.48, stars: 0 },
  NOON,
];

const MORNING: SkyKey[] = [
  NIGHT,
  { el: -9, top: "#0d1227", mid: "#2b3053", low: "#4c3e5d", glow: "#9c7caa", glowA: 0.32, stars: 0.5 },
  { el: -3, top: "#1b2244", mid: "#5d4b70", low: "#d98d7b", glow: "#f6a98b", glowA: 0.56, stars: 0.12 },
  { el: 1, top: "#2b3661", mid: "#9b7189", low: "#f3b18b", glow: "#ffc9a1", glowA: 0.78, stars: 0 },
  { el: 8, top: "#3f5a87", mid: "#a69ba7", low: "#f1d1b1", glow: "#ffe1c1", glowA: 0.56, stars: 0 },
  { el: 22, top: "#4a6a95", mid: "#9faab3", low: "#e7d7bf", glow: "#fff0d8", glowA: 0.46, stars: 0 },
  NOON,
];

function sampleSky(elevation: number, morning: boolean) {
  const keys = morning ? MORNING : EVENING;
  const el = Math.max(keys[0].el, Math.min(keys[keys.length - 1].el, elevation));
  let i = 0;
  while (i < keys.length - 2 && el > keys[i + 1].el) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const t = clamp01((el - a.el) / (b.el - a.el));
  return {
    top: mix(hex(a.top), hex(b.top), t),
    mid: mix(hex(a.mid), hex(b.mid), t),
    low: mix(hex(a.low), hex(b.low), t),
    glow: mix(hex(a.glow), hex(b.glow), t),
    glowA: lerp(a.glowA, b.glowA, t),
    stars: lerp(a.stars, b.stars, t),
  };
}

const SEASON_TINT: Record<Season, { tint: string; amount: number; accent: string; accentSoft: string }> = {
  winter: { tint: "#9fb3cc", amount: 0.2, accent: "#cfe0f2", accentSoft: "#8fa9c7" },
  spring: { tint: "#e7b3c6", amount: 0.1, accent: "#f3b7c9", accentSoft: "#c98aa0" },
  summer: { tint: "#f1c46a", amount: 0.08, accent: "#f5c76a", accentSoft: "#5fb3c4" },
  autumn: { tint: "#c47a3a", amount: 0.13, accent: "#dc8a3e", accentSoft: "#a8502c" },
};

export type SkyVars = Record<`--${string}`, string>;

export function skyVars(a: Ambience): SkyVars {
  const s = sampleSky(a.elevation, a.morning);
  const season = SEASON_TINT[a.season];
  const tint = hex(season.tint);
  let { top, mid, low, glow } = s;
  let glowA = s.glowA;
  let stars = s.stars;
  const daylight = clamp01((a.elevation + 6) / 20);

  top = mix(top, tint, season.amount * 0.6 * daylight);
  mid = mix(mid, tint, season.amount * daylight);
  low = mix(low, tint, season.amount * 0.8);

  let haze = 0;
  let dim = 0;
  const w = a.weather;
  if (w) {
    const grey = hex("#7d8088");
    const overcast =
      w.condition === "cloudy" ? 0.45 : w.condition === "partly" ? 0.15 : ["rain", "drizzle", "sleet", "snow", "storm", "fog"].includes(w.condition) ? 0.55 : 0;
    top = mix(top, grey, overcast * 0.7 * daylight);
    mid = mix(mid, grey, overcast * daylight);
    low = mix(low, grey, overcast * 0.8 * daylight);
    glowA *= 1 - overcast * 0.75;
    stars *= 1 - Math.max(overcast, w.cloud) * 0.9;

    if (w.condition === "rain" || w.condition === "storm" || w.condition === "drizzle" || w.condition === "sleet") {
      const storm = hex("#2c3440");
      const k = w.condition === "storm" ? 0.55 : w.condition === "drizzle" ? 0.25 : 0.4;
      top = mix(top, storm, k);
      mid = mix(mid, storm, k * 0.8);
      dim = k * 0.6;
    }
    if (w.condition === "snow") {
      const snow = hex("#c3cbd6");
      top = mix(top, snow, 0.25 * daylight);
      mid = mix(mid, snow, 0.3 * daylight);
    }
    if (w.condition === "fog") haze = 0.75;
    else if (w.condition === "cloudy") haze = 0.18;

    if (w.temp >= 32 && daylight > 0.6 && (w.condition === "clear" || w.condition === "partly")) {
      glow = mix(glow, hex("#fff3c4"), 0.4);
      glowA = Math.min(1, glowA + 0.25);
      low = mix(low, hex("#f6dca0"), 0.25);
    }
  }

  const sunY = 78 - clamp01((a.elevation + 8) / 60) * 66;
  const sunX = 50 + a.sunTrack * 38;

  return {
    "--sky-top": css(top),
    "--sky-mid": css(mid),
    "--sky-low": css(low),
    "--sky-glow": css(glow),
    "--sky-glow-a": glowA.toFixed(3),
    "--sky-stars": stars.toFixed(3),
    "--sky-haze": haze.toFixed(3),
    "--sky-dim": dim.toFixed(3),
    "--sun-x": `${sunX.toFixed(1)}%`,
    "--sun-y": `${sunY.toFixed(1)}%`,
    "--sun-a": clamp01((a.elevation + 4) / 8).toFixed(3),
    "--moon-a": clamp01((-a.elevation - 4) / 8).toFixed(3),
    "--season-accent": season.accent,
    "--season-accent-soft": season.accentSoft,
  };
}

/* ------------------------------ preview overrides ----------------------------- */

const PHASE_PRESETS: Record<string, { elevation: number; morning: boolean; localHour: number }> = {
  night: { elevation: -25, morning: false, localHour: 23 },
  dawn: { elevation: -7, morning: true, localHour: 6 },
  sunrise: { elevation: 1, morning: true, localHour: 7 },
  morning: { elevation: 12, morning: true, localHour: 9 },
  day: { elevation: 50, morning: true, localHour: 13 },
  noon: { elevation: 55, morning: false, localHour: 13 },
  golden: { elevation: 8, morning: false, localHour: 17 },
  sunset: { elevation: 0, morning: false, localHour: 18 },
  dusk: { elevation: -7, morning: false, localHour: 19 },
};

export function applyTimeOverride(base: Ambience, time: string | null): Ambience {
  if (!time) return base;
  const preset = PHASE_PRESETS[time];
  if (preset) {
    const sunTrack = preset.morning ? -0.8 + preset.elevation / 100 : 0.8 - preset.elevation / 100;
    return {
      ...base,
      ...preset,
      sunTrack: preset.elevation > 40 ? 0 : sunTrack,
      phase: phaseFor(preset.elevation, preset.morning),
    };
  }
  const m = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!m) return base;
  const now = new Date();
  const local = localParts(now);
  const diffMin = Number(m[1]) * 60 + Number(m[2]) - (local.hour * 60 + local.minute);
  const shifted = new Date(now.getTime() + diffMin * 60000);
  return computeAmbience(shifted, base.season, base.weather);
}
