import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./auth";

const DEV_LOGIN = "admin";
const DEV_PASSWORD = "mycoffee2026";

export function adminCredentials() {
  const login = process.env.ADMIN_LOGIN;
  const password = process.env.ADMIN_PASSWORD;
  if (login && password) return { login, password };
  if (process.env.NODE_ENV === "production") return null;
  return { login: DEV_LOGIN, password: DEV_PASSWORD };
}

const digest = (v: string) => createHash("sha256").update(v).digest();

export function safeEqual(a: string, b: string) {
  return timingSafeEqual(digest(a), digest(b));
}

export async function isAdmin() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}

const attempts = new Map<string, { count: number; until: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export function loginBlocked(key: string) {
  const a = attempts.get(key);
  return !!a && a.count >= MAX_ATTEMPTS && a.until > Date.now();
}

export function recordFailure(key: string) {
  const a = attempts.get(key);
  if (!a || a.until < Date.now()) attempts.set(key, { count: 1, until: Date.now() + WINDOW_MS });
  else a.count++;
}

export function clearFailures(key: string) {
  attempts.delete(key);
}
