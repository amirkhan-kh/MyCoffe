export const LANGS = ["uz", "ru", "en"] as const;
export type Lang = (typeof LANGS)[number];
export type I18n = Record<Lang, string>;

export type CategoryIcon =
  | "coffee"
  | "iced"
  | "noncoffee"
  | "tea"
  | "lemonade"
  | "mojito"
  | "milkshake"
  | "smoothie"
  | "juice"
  | "croissant"
  | "toast"
  | "sparkle";

export interface Category {
  id: string;
  name: I18n;
  icon: CategoryIcon;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: I18n;
  description: I18n;
  price: number;
  priceMax: number | null;
  seasonal: boolean;
  addon: boolean;
  available: boolean;
}

export type Season = "winter" | "spring" | "summer" | "autumn";
export type SeasonMode = "auto" | Season;

export interface OpeningHours {
  open: string;
  close: string;
}

export interface Settings {
  phone: string;
  instagram: string;
  hours: {
    weekdays: OpeningHours;
    sunday: OpeningHours;
  };
  seasonMode: SeasonMode;
  weatherEffects: boolean;
}

export interface MenuDoc {
  version: 1;
  categories: Category[];
  items: MenuItem[];
  settings: Settings;
  updatedAt: string;
}
