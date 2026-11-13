"use server";

import { randomUUID } from "node:crypto";
import { updateTag } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  adminCredentials,
  clearFailures,
  loginBlocked,
  recordFailure,
  requireAdmin,
  safeEqual,
} from "@/lib/admin-auth";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";
import { loadDoc, MENU_TAG, saveDoc } from "@/lib/menu";
import { syncI18n, translateToAll, type TranslateKind } from "@/lib/translate";
import type { CategoryIcon, I18n, MenuDoc } from "@/lib/types";

/* ------------------------------------ auth ----------------------------------- */

export type LoginState = { error?: string; login?: string };

export async function loginAction(_prev: LoginState, form: FormData): Promise<LoginState> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (loginBlocked(ip)) return { error: "Juda ko‘p urinish. 10 daqiqadan so‘ng qayta urinib ko‘ring." };

  const creds = adminCredentials();
  if (!creds) return { error: "Server sozlanmagan: ADMIN_LOGIN va ADMIN_PASSWORD kiritilmagan." };

  const login = String(form.get("login") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const ok = safeEqual(login, creds.login) && safeEqual(password, creds.password);
  if (!ok) {
    recordFailure(ip);
    await new Promise((r) => setTimeout(r, 600));
    return { error: "Login yoki parol noto‘g‘ri.", login };
  }

  clearFailures(ip);
  (await cookies()).set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/* --------------------------------- translation -------------------------------- */

export async function translateAction(text: string, kind: TranslateKind): Promise<I18n> {
  await requireAdmin();
  return translateToAll(z.string().max(2000).parse(text), kind);
}

/* ---------------------------------- mutations --------------------------------- */

const i18nSchema = z.object({
  uz: z.string().max(2000),
  ru: z.string().max(2000),
  en: z.string().max(2000),
});

const trimI18n = (v: I18n): I18n => ({ uz: v.uz.trim(), ru: v.ru.trim(), en: v.en.trim() });

async function mutate(fn: (doc: MenuDoc) => void | Promise<void>) {
  await requireAdmin();
  const doc = await loadDoc();
  await fn(doc);
  const saved = await saveDoc(doc);
  updateTag(MENU_TAG);
  return saved;
}

const itemSchema = z.object({
  id: z.string().optional(),
  categoryId: z.string().min(1),
  name: i18nSchema,
  description: i18nSchema,
  price: z.number().int().min(0).max(100_000_000),
  priceMax: z.number().int().min(0).max(100_000_000).nullable(),
  seasonal: z.boolean(),
  addon: z.boolean(),
  available: z.boolean(),
});

export type ItemInput = z.infer<typeof itemSchema>;

export async function saveItemAction(input: ItemInput) {
  await requireAdmin();
  const data = itemSchema.parse(input);
  const name = trimI18n(data.name);
  if (!name.uz && !name.ru && !name.en) throw new Error("Mahsulot nomi kiritilmagan");
  const prev = data.id ? (await loadDoc()).items.find((i) => i.id === data.id) : undefined;
  const [fullName, fullDesc] = await Promise.all([
    syncI18n(prev?.name, name, "name"),
    syncI18n(prev?.description, trimI18n(data.description), "description"),
  ]);

  return mutate((doc) => {
    if (!doc.categories.some((c) => c.id === data.categoryId)) throw new Error("Kategoriya topilmadi");
    const item = {
      id: data.id ?? randomUUID(),
      categoryId: data.categoryId,
      name: fullName,
      description: fullDesc,
      price: data.price,
      priceMax: data.priceMax && data.priceMax > data.price ? data.priceMax : null,
      seasonal: data.seasonal,
      addon: data.addon,
      available: data.available,
    };
    const idx = doc.items.findIndex((i) => i.id === item.id);
    if (idx === -1) {
      doc.items.push(item);
    } else if (doc.items[idx].categoryId !== item.categoryId) {
      doc.items.splice(idx, 1);
      doc.items.push(item);
    } else {
      doc.items[idx] = item;
    }
  });
}

export async function deleteItemAction(id: string) {
  return mutate((doc) => {
    doc.items = doc.items.filter((i) => i.id !== id);
  });
}

export async function setItemAvailableAction(id: string, available: boolean) {
  return mutate((doc) => {
    const item = doc.items.find((i) => i.id === id);
    if (item) item.available = available;
  });
}

export async function moveItemAction(id: string, dir: -1 | 1) {
  return mutate((doc) => {
    const idx = doc.items.findIndex((i) => i.id === id);
    if (idx === -1) return;
    const cat = doc.items[idx].categoryId;
    let j = idx + dir;
    while (j >= 0 && j < doc.items.length && doc.items[j].categoryId !== cat) j += dir;
    if (j < 0 || j >= doc.items.length) return;
    [doc.items[idx], doc.items[j]] = [doc.items[j], doc.items[idx]];
  });
}

const ICONS = [
  "coffee", "iced", "noncoffee", "tea", "lemonade", "mojito", "milkshake", "smoothie", "juice", "croissant", "toast", "sparkle",
] as const satisfies readonly CategoryIcon[];

const categorySchema = z.object({
  id: z.string().optional(),
  name: i18nSchema,
  icon: z.enum(ICONS),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export async function saveCategoryAction(input: CategoryInput) {
  await requireAdmin();
  const data = categorySchema.parse(input);
  const name = trimI18n(data.name);
  if (!name.uz && !name.ru && !name.en) throw new Error("Kategoriya nomi kiritilmagan");
  const prev = data.id ? (await loadDoc()).categories.find((c) => c.id === data.id) : undefined;
  const full = await syncI18n(prev?.name, name, "name");
  return mutate((doc) => {
    const existing = data.id ? doc.categories.find((c) => c.id === data.id) : undefined;
    if (existing) {
      existing.name = full;
      existing.icon = data.icon;
    } else {
      doc.categories.push({ id: randomUUID().slice(0, 8), name: full, icon: data.icon });
    }
  });
}

export async function deleteCategoryAction(id: string) {
  return mutate((doc) => {
    doc.categories = doc.categories.filter((c) => c.id !== id);
    doc.items = doc.items.filter((i) => i.categoryId !== id);
  });
}

export async function moveCategoryAction(id: string, dir: -1 | 1) {
  return mutate((doc) => {
    const idx = doc.categories.findIndex((c) => c.id === id);
    const j = idx + dir;
    if (idx === -1 || j < 0 || j >= doc.categories.length) return;
    [doc.categories[idx], doc.categories[j]] = [doc.categories[j], doc.categories[idx]];
  });
}

const hhmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);

const settingsSchema = z.object({
  phone: z.string().trim().min(5).max(40),
  instagram: z.string().trim().max(200),
  hours: z.object({
    weekdays: z.object({ open: hhmm, close: hhmm }),
    sunday: z.object({ open: hhmm, close: hhmm }),
  }),
  seasonMode: z.enum(["auto", "winter", "spring", "summer", "autumn"]),
  weatherEffects: z.boolean(),
});

export async function saveSettingsAction(input: z.infer<typeof settingsSchema>) {
  const data = settingsSchema.parse(input);
  return mutate((doc) => {
    doc.settings = data;
  });
}
