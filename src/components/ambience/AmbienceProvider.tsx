"use client";

import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { applyTimeOverride, computeAmbience, localParts, seasonForMonth, skyVars } from "@/lib/ambience/sky";
import { CONDITIONS, type Ambience, type Condition, type WeatherNow } from "@/lib/ambience/types";
import type { Season, Settings } from "@/lib/types";

const SEASONS: Season[] = ["winter", "spring", "summer", "autumn"];
const WEATHER_REFRESH_MS = 15 * 60 * 1000;
const CLOCK_TICK_MS = 60 * 1000;

interface Overrides {
  season: Season | null;
  weather: Condition | null;
  time: string | null;
  temp: number | null;
}

function parseOverrides(search: string): Overrides {
  const q = new URLSearchParams(search);
  const season = q.get("season");
  const weather = q.get("weather");
  const temp = q.get("temp");
  return {
    season: SEASONS.includes(season as Season) ? (season as Season) : null,
    weather: CONDITIONS.includes(weather as Condition) ? (weather as Condition) : null,
    time: q.get("time"),
    temp: temp && !Number.isNaN(Number(temp)) ? Number(temp) : null,
  };
}

function syntheticWeather(condition: Condition, base: WeatherNow | null, temp: number | null): WeatherNow {
  const intensity = { clear: 0, partly: 0.3, cloudy: 0.5, fog: 0.7, drizzle: 0.35, rain: 0.75, storm: 0.95, sleet: 0.6, snow: 0.8 }[condition];
  return {
    condition,
    intensity,
    temp: temp ?? base?.temp ?? 12,
    windSpeed: base?.windSpeed ?? (condition === "storm" ? 9 : 3.5),
    windFrom: base?.windFrom ?? 260,
    cloud: { clear: 0, partly: 0.35, cloudy: 0.85, fog: 0.9, drizzle: 0.9, rain: 1, storm: 1, sleet: 1, snow: 1 }[condition],
    source: base?.source ?? "met.no",
  };
}

interface AmbienceState {
  ambience: Ambience | null;
  now: Date | null;
  /** Live weather (unaffected by the visual-effects switch), for the header line. */
  liveWeather: WeatherNow | null;
  effects: boolean;
  /** The first weather lookup has settled (or isn't needed), so the scene won't swap right after load. */
  weatherReady: boolean;
}

const Ctx = createContext<AmbienceState>({ ambience: null, now: null, liveWeather: null, effects: true, weatherReady: false });

export const useAmbience = () => useContext(Ctx);

const subscribeClock = (onChange: () => void) => {
  const id = window.setInterval(onChange, CLOCK_TICK_MS / 4);
  document.addEventListener("visibilitychange", onChange);
  return () => {
    window.clearInterval(id);
    document.removeEventListener("visibilitychange", onChange);
  };
};
const currentMinute = () => Math.floor(Date.now() / CLOCK_TICK_MS);
const noSubscribe = () => () => {};

export function AmbienceProvider({ settings, children }: { settings: Settings; children: React.ReactNode }) {
  const minute = useSyncExternalStore(subscribeClock, currentMinute, () => null);
  const search = useSyncExternalStore(noSubscribe, () => window.location.search, () => null);
  const [weather, setWeather] = useState<WeatherNow | null>(null);
  const [fetched, setFetched] = useState(false);

  const now = useMemo(() => (minute === null ? null : new Date(minute * CLOCK_TICK_MS)), [minute]);
  const overrides = useMemo(() => (search === null ? null : parseOverrides(search)), [search]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/ambience", { cache: "no-store" });
        const data = (await res.json()) as { weather: WeatherNow | null };
        if (!cancelled) setWeather(data.weather);
      } catch {
        /* the sky still follows the sun without weather */
      } finally {
        if (!cancelled) setFetched(true);
      }
    };
    load();
    const id = window.setInterval(load, WEATHER_REFRESH_MS);
    const fallback = window.setTimeout(() => !cancelled && setFetched(true), 2500);
    return () => {
      cancelled = true;
      window.clearInterval(id);
      window.clearTimeout(fallback);
    };
  }, []);

  const ambience = useMemo<Ambience | null>(() => {
    if (!now || !overrides) return null;
    const season =
      overrides.season ?? (settings.seasonMode === "auto" ? seasonForMonth(localParts(now).month) : settings.seasonMode);
    let w: WeatherNow | null = settings.weatherEffects ? weather : null;
    if (overrides.weather) w = syntheticWeather(overrides.weather, weather, overrides.temp);
    else if (w && overrides.temp !== null) w = { ...w, temp: overrides.temp };
    return applyTimeOverride(computeAmbience(now, season, w), overrides.time);
  }, [now, overrides, weather, settings.seasonMode, settings.weatherEffects]);

  useEffect(() => {
    if (!ambience) return;
    const root = document.documentElement;
    for (const [k, v] of Object.entries(skyVars(ambience))) root.style.setProperty(k, v);
    root.dataset.season = ambience.season;
    root.dataset.phase = ambience.phase;
    root.dataset.weather = ambience.weather?.condition ?? "none";
  }, [ambience]);

  const value = useMemo(
    () => ({
      ambience,
      now,
      liveWeather: overrides?.weather ? (ambience?.weather ?? null) : weather,
      effects: settings.weatherEffects,
      weatherReady: fetched || !settings.weatherEffects || !!overrides?.weather,
    }),
    [ambience, now, weather, overrides, settings.weatherEffects, fetched],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
