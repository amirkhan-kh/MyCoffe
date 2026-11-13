import { localParts } from "./ambience/sky";
import type { Settings } from "./types";

const NNBSP = "\u202F";

export function formatPrice(value: number) {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP);
}

export function formatPriceRange(price: number, priceMax: number | null) {
  return priceMax && priceMax > price ? `${formatPrice(price)} – ${formatPrice(priceMax)}` : formatPrice(price);
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Handles closing at/after midnight ("00:00", "01:30"). */
export function openStatus(settings: Settings, date: Date) {
  const { hour, minute, weekday } = localParts(date);
  const now = hour * 60 + minute;
  const today = weekday === "Sun" ? settings.hours.sunday : settings.hours.weekdays;
  const yesterday = weekday === "Mon" ? settings.hours.sunday : settings.hours.weekdays;

  const isOpenIn = (h: { open: string; close: string }, minutes: number) => {
    const o = toMinutes(h.open);
    let c = toMinutes(h.close);
    if (c <= o) c += 24 * 60;
    return minutes >= o && minutes < c;
  };

  if (isOpenIn(today, now)) return { open: true, until: today.close };
  if (isOpenIn(yesterday, now + 24 * 60)) return { open: true, until: yesterday.close };

  const tomorrowIsSunday = weekday === "Sat";
  const next = now < toMinutes(today.open) ? today : tomorrowIsSunday ? settings.hours.sunday : settings.hours.weekdays;
  return { open: false, opensAt: next.open };
}
