import type { Condition, Phase } from "./ambience/types";
import type { Lang, Season } from "./types";

type Dict = {
  seasonal: string;
  extras: string;
  currency: string;
  tapHint: string;
  greeting: Record<"morning" | "day" | "evening" | "night", string>;
  city: string;
  openNow: string;
  closedNow: string;
  until: (time: string) => string;
  opensAt: (time: string) => string;
  hoursTitle: string;
  weekdays: string;
  sunday: string;
  call: string;
  instagram: string;
  pricesNote: string;
  weatherCredit: string;
  conditions: Record<Condition, string>;
  phases: Record<Phase, string>;
  seasons: Record<Season, string>;
  menu: string;
};

export const DICT: Record<Lang, Dict> = {
  uz: {
    seasonal: "mavsumiy",
    extras: "Qo‘shimchalar",
    currency: "so‘m",
    tapHint: "Tarkibini ko‘rish uchun nomini bosing",
    greeting: { morning: "Xayrli tong", day: "Xayrli kun", evening: "Xayrli kech", night: "Xayrli tun" },
    city: "Andijon",
    openNow: "Hozir ochiq",
    closedNow: "Hozir yopiq",
    until: (t) => `${t} gacha`,
    opensAt: (t) => `${t} da ochiladi`,
    hoursTitle: "Ish vaqti",
    weekdays: "Dushanba — Shanba",
    sunday: "Yakshanba",
    call: "Qo‘ng‘iroq qilish",
    instagram: "Instagram",
    pricesNote: "Narxlar so‘mda ko‘rsatilgan",
    weatherCredit: "Ob-havo",
    conditions: {
      clear: "Ochiq osmon",
      partly: "Qisman bulutli",
      cloudy: "Bulutli",
      fog: "Tuman",
      drizzle: "Mayda yomg‘ir",
      rain: "Yomg‘ir",
      storm: "Momaqaldiroq",
      sleet: "Qor aralash yomg‘ir",
      snow: "Qor",
    },
    phases: {
      night: "tun",
      dawn: "tong oldi",
      sunrise: "quyosh chiqishi",
      morning: "tong",
      day: "kun",
      golden: "oltin soat",
      sunset: "quyosh botishi",
      dusk: "shom",
    },
    seasons: { winter: "Qish", spring: "Bahor", summer: "Yoz", autumn: "Kuz" },
    menu: "Menyu",
  },
  ru: {
    seasonal: "сезонное",
    extras: "Добавки",
    currency: "сум",
    tapHint: "Нажмите на название, чтобы увидеть состав",
    greeting: { morning: "Доброе утро", day: "Добрый день", evening: "Добрый вечер", night: "Доброй ночи" },
    city: "Андижан",
    openNow: "Сейчас открыто",
    closedNow: "Сейчас закрыто",
    until: (t) => `до ${t}`,
    opensAt: (t) => `откроемся в ${t}`,
    hoursTitle: "Часы работы",
    weekdays: "Понедельник — Суббота",
    sunday: "Воскресенье",
    call: "Позвонить",
    instagram: "Instagram",
    pricesNote: "Цены указаны в сумах",
    weatherCredit: "Погода",
    conditions: {
      clear: "Ясно",
      partly: "Переменная облачность",
      cloudy: "Облачно",
      fog: "Туман",
      drizzle: "Морось",
      rain: "Дождь",
      storm: "Гроза",
      sleet: "Мокрый снег",
      snow: "Снег",
    },
    phases: {
      night: "ночь",
      dawn: "предрассветный час",
      sunrise: "восход",
      morning: "утро",
      day: "день",
      golden: "золотой час",
      sunset: "закат",
      dusk: "сумерки",
    },
    seasons: { winter: "Зима", spring: "Весна", summer: "Лето", autumn: "Осень" },
    menu: "Меню",
  },
  en: {
    seasonal: "seasonal",
    extras: "Extras",
    currency: "UZS",
    tapHint: "Tap a name to see what’s inside",
    greeting: { morning: "Good morning", day: "Good afternoon", evening: "Good evening", night: "Good night" },
    city: "Andijan",
    openNow: "Open now",
    closedNow: "Closed now",
    until: (t) => `until ${t}`,
    opensAt: (t) => `opens at ${t}`,
    hoursTitle: "Opening hours",
    weekdays: "Monday — Saturday",
    sunday: "Sunday",
    call: "Call us",
    instagram: "Instagram",
    pricesNote: "Prices are in Uzbek som",
    weatherCredit: "Weather",
    conditions: {
      clear: "Clear sky",
      partly: "Partly cloudy",
      cloudy: "Cloudy",
      fog: "Fog",
      drizzle: "Drizzle",
      rain: "Rain",
      storm: "Thunderstorm",
      sleet: "Sleet",
      snow: "Snow",
    },
    phases: {
      night: "night",
      dawn: "before dawn",
      sunrise: "sunrise",
      morning: "morning",
      day: "day",
      golden: "golden hour",
      sunset: "sunset",
      dusk: "dusk",
    },
    seasons: { winter: "Winter", spring: "Spring", summer: "Summer", autumn: "Autumn" },
    menu: "Menu",
  },
};

export function greetingKey(hour: number): keyof Dict["greeting"] {
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "day";
  if (hour >= 17 && hour < 23) return "evening";
  return "night";
}
