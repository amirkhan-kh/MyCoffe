"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { LANGS, type Lang } from "@/lib/types";

const KEY = "mc-lang";

function detect(): Lang {
  try {
    const stored = localStorage.getItem(KEY) as Lang | null;
    if (stored && LANGS.includes(stored)) return stored;
  } catch {}
  const nav = (navigator.language || "").slice(0, 2);
  return nav === "ru" || nav === "en" ? nav : "uz";
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useLang() {
  const [lang, setLangState] = useState<Lang>("uz");

  useIsoLayoutEffect(() => {
    setLangState(detect());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.classList.remove("lang-pending");
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {}
  }, []);

  return [lang, setLang] as const;
}
