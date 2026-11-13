import type { Season } from "../types";
import type { Ambience, Condition } from "./types";

export type Slot = "morning" | "day" | "evening" | "night" | "weather";

/** Position inside the 9:16 frame, in percent. */
export type Pt = [x: number, y: number];

export interface Practical {
  at: Pt;
  color: string;
  /** glow diameter in % of frame width */
  size: number;
  flicker: "candle" | "lamp" | "fire";
}

export interface Scene {
  id: string;
  src: string;
  season: Season;
  slot: Slot;
  /** where the eye lands: Ken Burns origin and iris-transition centre */
  focus: Pt;
  /** key light (sun or window) */
  light?: Pt;
  flare?: boolean;
  rays?: boolean;
  steam?: Pt[];
  practicals?: Practical[];
}

const WARM = "255 178 92";
const AMBER = "255 150 60";
const CANDLE = "255 196 120";
const FIRE = "255 120 40";

const S = (season: Season, slot: Slot, rest: Omit<Scene, "id" | "src" | "season" | "slot">): Scene => {
  const name = slot === "weather" ? ({ autumn: "rain", spring: "rain", summer: "storm", winter: "snow" } as const)[season] : slot;
  return { id: `${season}-${name}`, src: `/scenes/${season}-${name}.webp`, season, slot, ...rest };
};

export const SCENES: Scene[] = [
  S("autumn", "morning", { focus: [50, 48], light: [86, 14], rays: true, steam: [[50, 46]] }),
  S("autumn", "day", { focus: [55, 52], light: [82, 4], steam: [[62, 49]] }),
  S("autumn", "evening", { focus: [50, 46], light: [44, 37], flare: true, rays: true, steam: [[54, 47]] }),
  S("autumn", "night", {
    focus: [45, 45],
    steam: [[43, 33], [53, 61]],
    practicals: [
      { at: [11, 18], color: WARM, size: 26, flicker: "lamp" },
      { at: [38, 9], color: WARM, size: 18, flicker: "lamp" },
      { at: [81, 34], color: AMBER, size: 20, flicker: "candle" },
    ],
  }),
  S("autumn", "weather", {
    focus: [40, 50],
    steam: [[37, 47]],
    practicals: [
      { at: [34, 21], color: AMBER, size: 24, flicker: "lamp" },
      { at: [77, 30], color: AMBER, size: 12, flicker: "lamp" },
    ],
  }),

  S("winter", "morning", { focus: [56, 50], light: [70, 26], rays: true, steam: [[58, 49]] }),
  S("winter", "day", { focus: [40, 45], light: [80, 8], steam: [[36, 37]] }),
  S("winter", "evening", {
    focus: [50, 48],
    steam: [[39, 45]],
    practicals: [
      { at: [67, 52], color: CANDLE, size: 22, flicker: "candle" },
      { at: [47, 26], color: AMBER, size: 16, flicker: "lamp" },
    ],
  }),
  S("winter", "night", {
    focus: [55, 50],
    steam: [[61, 51]],
    practicals: [
      { at: [6, 58], color: FIRE, size: 60, flicker: "fire" },
      { at: [93, 34], color: AMBER, size: 14, flicker: "lamp" },
    ],
  }),
  S("winter", "weather", {
    focus: [60, 48],
    steam: [[62, 45]],
    practicals: [
      { at: [89, 48], color: CANDLE, size: 22, flicker: "candle" },
      { at: [26, 22], color: AMBER, size: 16, flicker: "lamp" },
      { at: [48, 26], color: AMBER, size: 12, flicker: "lamp" },
    ],
  }),

  S("spring", "morning", { focus: [50, 46], light: [30, 4], rays: true, steam: [[53, 46]] }),
  S("spring", "day", { focus: [45, 45], light: [62, 0], rays: true }),
  S("spring", "evening", { focus: [50, 45], light: [40, 28], flare: true, rays: true, steam: [[42, 47]] }),
  S("spring", "night", {
    focus: [50, 45],
    steam: [[52, 40]],
    practicals: [{ at: [75, 45], color: CANDLE, size: 22, flicker: "candle" }],
  }),
  S("spring", "weather", {
    focus: [45, 50],
    steam: [[39, 53]],
    practicals: [{ at: [8, 36], color: WARM, size: 46, flicker: "lamp" }],
  }),

  S("summer", "morning", { focus: [50, 55], light: [28, 16], rays: true, steam: [[65, 57]] }),
  S("summer", "day", { focus: [50, 45], light: [60, 0], rays: true }),
  S("summer", "evening", { focus: [50, 48], light: [73, 36], flare: true, rays: true }),
  S("summer", "night", {
    focus: [50, 50],
    steam: [[50, 52]],
    practicals: [
      { at: [75, 21], color: WARM, size: 26, flicker: "lamp" },
      { at: [65, 60], color: CANDLE, size: 16, flicker: "candle" },
    ],
  }),
  S("summer", "weather", {
    focus: [50, 46],
    steam: [[66, 50]],
    practicals: [{ at: [92, 32], color: WARM, size: 34, flicker: "lamp" }],
  }),
];

const RAINY: Condition[] = ["drizzle", "rain", "storm"];
const SNOWY: Condition[] = ["snow", "sleet"];

export function isRainy(c: Condition | undefined) {
  return !!c && (RAINY.includes(c) || c === "sleet");
}

function slotForPhase(a: Ambience): Exclude<Slot, "weather"> {
  switch (a.phase) {
    case "night":
    case "dusk":
      return "night";
    case "dawn":
    case "sunrise":
    case "morning":
      return "morning";
    case "day":
      return "day";
    default:
      return "evening";
  }
}

const find = (season: Season, slot: Slot) => SCENES.find((s) => s.season === season && s.slot === slot)!;

/**
 * Season picks the set, the sun picks the hour, and precipitation overrides both:
 * snow always looks like snow, and rain gets the season's rainy window (winter rain keeps
 * its hour and relies on the droplets on the glass).
 */
export function pickScene(a: Ambience): Scene {
  const c = a.weather?.condition;
  if (c && SNOWY.includes(c)) return find("winter", "weather");
  if (c && RAINY.includes(c) && a.season !== "winter") return find(a.season, "weather");
  return find(a.season, slotForPhase(a));
}
