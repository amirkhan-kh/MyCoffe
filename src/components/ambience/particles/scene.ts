import type { Ambience } from "@/lib/ambience/types";

export interface Scene {
  leaves: number;
  petals: number;
  snow: number;
  /** 0..1 — how blizzard-like the snow behaves */
  blizzard: number;
  rain: number;
  storm: boolean;
  motes: number;
  swallows: boolean;
  gulls: boolean;
  /** signed horizontal wind, roughly -2..2 */
  windX: number;
  /** 0..1 */
  gustiness: number;
}

export function sceneFrom(a: Ambience): Scene {
  const day = a.elevation > 2;
  const s: Scene = {
    leaves: 0,
    petals: 0,
    snow: 0,
    blizzard: 0,
    rain: 0,
    storm: false,
    motes: 0,
    swallows: false,
    gulls: false,
    windX: 0.45,
    gustiness: 0.35,
  };

  switch (a.season) {
    case "autumn":
      s.leaves = 24;
      break;
    case "spring":
      s.petals = 30;
      s.swallows = day;
      break;
    case "winter":
      s.snow = 70;
      s.blizzard = 0.15;
      break;
    case "summer":
      s.motes = day ? 26 : 14;
      s.gulls = day;
      break;
  }

  const w = a.weather;
  if (!w) return s;

  const toDir = ((w.windFrom + 180) * Math.PI) / 180;
  const strength = Math.max(0.2, Math.min(1.8, w.windSpeed / 6));
  s.windX = Math.sin(toDir) * strength || 0.3;
  if (Math.abs(s.windX) < 0.18) s.windX = 0.18 * Math.sign(s.windX || 1);
  s.gustiness = Math.min(1, 0.25 + w.windSpeed / 12);

  switch (w.condition) {
    case "drizzle":
    case "rain":
    case "storm": {
      s.rain = w.condition === "drizzle" ? 110 : w.condition === "storm" ? 380 : 150 + 200 * w.intensity;
      s.storm = w.condition === "storm";
      s.leaves *= 0.45;
      s.petals *= 0.3;
      s.snow = 0;
      s.motes = 0;
      s.swallows = false;
      s.gulls = false;
      if (s.storm) s.gustiness = 1;
      break;
    }
    case "sleet":
      s.rain = 120;
      s.snow = 70;
      s.leaves *= 0.4;
      s.petals = 0;
      s.motes = 0;
      s.swallows = s.gulls = false;
      break;
    case "snow":
      s.snow = 120 + 220 * w.intensity;
      s.blizzard = Math.min(1, w.intensity * (w.windSpeed > 5 ? 1 : 0.65) + 0.15);
      s.leaves *= 0.3;
      s.petals = 0;
      s.motes = 0;
      s.swallows = s.gulls = false;
      s.gustiness = Math.max(s.gustiness, 0.55);
      break;
    case "fog":
      s.leaves *= 0.6;
      s.petals *= 0.6;
      s.snow *= 0.6;
      s.motes *= 0.4;
      s.swallows = s.gulls = false;
      break;
    case "cloudy":
      s.motes *= 0.4;
      break;
    case "clear":
      if (w.temp >= 30 && day) s.motes = Math.max(s.motes, 40);
      break;
  }
  return s;
}
