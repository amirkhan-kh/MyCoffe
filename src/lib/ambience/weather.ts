import "server-only";
import { cacheLife } from "next/cache";
import { ANDIJAN } from "./location";
import type { Condition, WeatherNow } from "./types";

function fromMetSymbol(symbol: string): { condition: Condition; intensity: number } {
  const intensity = symbol.startsWith("heavy") ? 1 : symbol.startsWith("light") ? 0.35 : 0.65;
  if (symbol.includes("thunder")) return { condition: "storm", intensity };
  if (symbol.includes("sleet")) return { condition: "sleet", intensity };
  if (symbol.includes("snow")) return { condition: "snow", intensity };
  if (symbol.includes("rain")) {
    return symbol.startsWith("light") ? { condition: "drizzle", intensity } : { condition: "rain", intensity };
  }
  if (symbol.includes("fog")) return { condition: "fog", intensity: 0.7 };
  if (symbol.startsWith("cloudy")) return { condition: "cloudy", intensity: 0.5 };
  if (symbol.startsWith("partlycloudy") || symbol.startsWith("fair")) return { condition: "partly", intensity: 0.3 };
  return { condition: "clear", intensity: 0 };
}

async function fromMetNorway(): Promise<WeatherNow> {
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${ANDIJAN.lat.toFixed(4)}&lon=${ANDIJAN.lon.toFixed(4)}`;
  const contact = process.env.WEATHER_CONTACT ?? "mycoffee-menu (https://github.com)";
  const res = await fetch(url, {
    headers: { "User-Agent": `MyCoffeeMenu/1.0 ${contact}` },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`met.no ${res.status}`);
  const data = await res.json();
  const now = data.properties.timeseries[0].data;
  const d = now.instant.details;
  const symbol: string =
    now.next_1_hours?.summary?.symbol_code ?? now.next_6_hours?.summary?.symbol_code ?? "clearsky_day";
  const { condition, intensity } = fromMetSymbol(symbol);
  return {
    condition,
    intensity,
    temp: d.air_temperature,
    windSpeed: d.wind_speed ?? 0,
    windFrom: d.wind_from_direction ?? 270,
    cloud: (d.cloud_area_fraction ?? 0) / 100,
    source: "met.no",
  };
}

function fromWmoCode(code: number): { condition: Condition; intensity: number } {
  if (code === 0) return { condition: "clear", intensity: 0 };
  if (code <= 2) return { condition: "partly", intensity: 0.3 };
  if (code === 3) return { condition: "cloudy", intensity: 0.5 };
  if (code === 45 || code === 48) return { condition: "fog", intensity: 0.7 };
  if (code === 56 || code === 57 || code === 66 || code === 67) return { condition: "sleet", intensity: 0.6 };
  if (code >= 51 && code <= 55) return { condition: "drizzle", intensity: 0.35 };
  if (code === 61 || code === 80) return { condition: "rain", intensity: 0.45 };
  if (code === 63 || code === 81) return { condition: "rain", intensity: 0.7 };
  if (code === 65 || code === 82) return { condition: "rain", intensity: 1 };
  if (code === 71 || code === 77 || code === 85) return { condition: "snow", intensity: 0.4 };
  if (code === 73) return { condition: "snow", intensity: 0.7 };
  if (code === 75 || code === 86) return { condition: "snow", intensity: 1 };
  if (code >= 95) return { condition: "storm", intensity: 0.9 };
  return { condition: "cloudy", intensity: 0.5 };
}

async function fromOpenMeteo(): Promise<WeatherNow> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(ANDIJAN.lat));
  url.searchParams.set("longitude", String(ANDIJAN.lon));
  url.searchParams.set(
    "current",
    "temperature_2m,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m",
  );
  url.searchParams.set("wind_speed_unit", "ms");
  url.searchParams.set("timezone", ANDIJAN.timeZone);
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`open-meteo ${res.status}`);
  const c = (await res.json()).current;
  const { condition, intensity } = fromWmoCode(c.weather_code);
  return {
    condition,
    intensity,
    temp: c.temperature_2m,
    windSpeed: c.wind_speed_10m ?? 0,
    windFrom: c.wind_direction_10m ?? 270,
    cloud: (c.cloud_cover ?? 0) / 100,
    source: "open-meteo",
  };
}

export async function getWeather(): Promise<WeatherNow | null> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 900, expire: 3600 });
  try {
    return await fromMetNorway();
  } catch (err) {
    console.warn("[weather] met.no failed, trying Open-Meteo:", err);
  }
  try {
    return await fromOpenMeteo();
  } catch (err) {
    console.warn("[weather] Open-Meteo failed:", err);
    return null;
  }
}
