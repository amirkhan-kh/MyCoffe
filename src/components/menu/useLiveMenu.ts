"use client";

import { useEffect, useRef, useState } from "react";
import { MENU_CHANNEL } from "@/lib/live";
import type { MenuDoc } from "@/lib/types";

const POLL_MS = 15_000;

/**
 * Keeps an open menu in sync with the admin panel without a reload: polls while the tab is
 * visible, checks again the moment it comes back, and reacts instantly to saves made in
 * another tab of the same browser.
 */
export function useLiveMenu(initial: MenuDoc) {
  const [doc, setDoc] = useState(initial);
  const version = useRef(initial.updatedAt);

  useEffect(() => {
    let timer = 0;
    let inflight = false;
    let stopped = false;

    // A version in the URL skips the few-second edge cache right after a known save.
    const check = async (bust?: unknown) => {
      if (inflight || stopped) return;
      inflight = true;
      try {
        const url = typeof bust === "string" ? `/api/menu?v=${encodeURIComponent(bust)}` : "/api/menu";
        const res = await fetch(url, { cache: "no-cache" });
        if (res.ok && res.status !== 304) {
          const next = (await res.json()) as MenuDoc;
          // Older answers can still arrive from the edge cache after a newer one; never step back.
          if (!stopped && next.updatedAt > version.current) {
            version.current = next.updatedAt;
            setDoc(next);
          }
        }
      } catch {
        /* offline for a moment: the next tick tries again */
      } finally {
        inflight = false;
      }
    };

    const schedule = () => {
      window.clearInterval(timer);
      if (!document.hidden) timer = window.setInterval(() => check(), POLL_MS);
    };
    const onVisible = () => {
      schedule();
      if (!document.hidden) check();
    };
    const onOnline = () => check();

    const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(MENU_CHANNEL) : null;
    if (channel) channel.onmessage = (e: MessageEvent) => check(String(e.data));

    schedule();
    check();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    window.addEventListener("online", onOnline);
    return () => {
      stopped = true;
      window.clearInterval(timer);
      channel?.close();
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  return doc;
}
