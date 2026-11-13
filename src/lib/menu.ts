import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createSeedDoc } from "./seed";
import { getStore } from "./store";
import type { MenuDoc } from "./types";

export const MENU_TAG = "menu";

export async function loadDoc(): Promise<MenuDoc> {
  const store = getStore();
  const doc = await store.read();
  if (doc) return doc;
  const seed = createSeedDoc();
  await store.write(seed);
  return seed;
}

let live: { version: string; doc: MenuDoc } | null = null;

/** Fresh read for the live feed: only downloads the document when its version has moved. */
export async function loadLiveDoc(): Promise<MenuDoc> {
  const store = getStore();
  if (!store.version) return loadDoc();
  const version = await store.version();
  if (version && live?.version === version) return live.doc;
  const doc = await loadDoc();
  live = version ? { version, doc } : null;
  return doc;
}

export async function getMenu(): Promise<MenuDoc> {
  "use cache";
  cacheTag(MENU_TAG);
  cacheLife("hours");
  return loadDoc();
}

export async function saveDoc(doc: MenuDoc): Promise<MenuDoc> {
  const next = { ...doc, updatedAt: new Date().toISOString() };
  await getStore().write(next);
  return next;
}
