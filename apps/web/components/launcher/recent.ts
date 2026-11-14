"use client";

/** Pages this user opened lately on this device, newest first (My Menu shows them). */
export interface RecentPage { href: string; title: string; at: number }

const KEY = "varchasv.recent";
const SKIP = ["/my-menu", "/launcher", "/dashboard"];

export function readRecent(): RecentPage[] {
  try { return (JSON.parse(localStorage.getItem(KEY) ?? "[]") as RecentPage[]).slice(0, 8); } catch { return []; }
}

/** Records a visit once the page has its title; list pages and documents alike. */
export function noteVisit(href: string, title: string) {
  if (SKIP.includes(href) || !title) return;
  try {
    const list = readRecent().filter((r) => r.href !== href);
    localStorage.setItem(KEY, JSON.stringify([{ href, title, at: Date.now() }, ...list].slice(0, 8)));
  } catch { /* storage unavailable */ }
}
