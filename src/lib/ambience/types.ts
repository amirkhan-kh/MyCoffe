import type { Season } from "../types";

export type Condition =
  | "clear"
  | "partly"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "storm"
  | "sleet"
  | "snow";

export const CONDITIONS: Condition[] = [
  "clear",
  "partly",
  "cloudy",
  "fog",
  "drizzle",
  "rain",
  "storm",
  "sleet",
  "snow",
];

export interface WeatherNow {
  condition: Condition;
  /** 0..1 — light / moderate / heavy precipitation */
  intensity: number;
  temp: number;
  /** metres per second */
  windSpeed: number;
  /** meteorological degrees: the direction the wind blows FROM */
  windFrom: number;
  /** 0..1 */
  cloud: number;
  source: "met.no" | "open-meteo";
}

export type Phase = "night" | "dawn" | "sunrise" | "morning" | "day" | "golden" | "sunset" | "dusk";

export interface Ambience {
  season: Season;
  weather: WeatherNow | null;
  /** solar elevation in degrees */
  elevation: number;
  /** true before solar noon */
  morning: boolean;
  /** -1 (sunrise side) .. 1 (sunset side): horizontal position of the sun */
  sunTrack: number;
  phase: Phase;
  /** Hour in Andijan (Asia/Tashkent), 0..23 */
  localHour: number;
}
