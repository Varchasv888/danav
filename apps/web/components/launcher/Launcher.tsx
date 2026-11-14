"use client";

import { LayoutGrid, List, Search, Star } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/client-api";
import { BANDS } from "@/lib/nav";
import { Input } from "../ui";
import { DEFAULT_MENU, GROUPS, TileIcon, useActions } from "./actions";

const VIEW_KEY = "varchasv.launcher.view";

/**
 * Every screen and entry the user may open, as cards in labelled groups (or a compact list), with a
 * search box and tabs by area. The star pins a card to My Menu.
 */
export function Launcher({ permissions, menu: initialMenu }: { permissions: string[]; menu: string[] | null }) {
  const t = useTranslations();
  const actions = useActions(permissions);
  const [q, setQ] = useState("");
  const [band, setBand] = useState<string>("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  useEffect(() => { try { if (localStorage.getItem(VIEW_KEY) === "list") setView("list"); } catch { /* storage unavailable */ } }, []);
  const [menu, setMenu] = useState<string[]>(initialMenu ?? DEFAULT_MENU.filter((h) => actions.some((a) => a.href === h)));
  const [error, setError] = useState(false);

  const inBand = (key: string) => band === "all" || (key === "entries" ? band === "entries" : BANDS.find((b) => b.key === band)?.sections.includes(key));
  const s = q.trim().toLowerCase();
  // Card names first; a group's name only when no card matches ("purchase" lists the purchase group).
  const pool = actions.filter((a) => inBand(a.groupKey));
  const byLabel = s ? pool.filter((a) => a.label.toLowerCase().includes(s)) : pool;
  const shown = s && !byLabel.length ? pool.filter((a) => a.group.toLowerCase().includes(s)) : byLabel;
  const groups = useMemo(() => GROUPS.map((g) => ({ key: g, items: shown.filter((a) => a.groupKey === g) })).filter((g) => g.items.length), [shown]);
  const tabs = [{ key: "all", label: t("launcher.allTab"), n: actions.length }, { key: "entries", label: t("launcher.groups.entries"), n: actions.filter((a) => a.groupKey === "entries").length },
    ...BANDS.filter((b) => b.key !== "workspace").map((b) => ({ key: b.key, label: t(`nav.band.${b.key}`), n: actions.filter((a) => b.sections.includes(a.groupKey)).length }))].filter((x) => x.n);

  const pin = async (href: string) => {
    const next = menu.includes(href) ? menu.filter((h) => h !== href) : [...menu, href];
    const before = menu;
    setMenu(next);
    setError(false);
    try { await api("/me/menu", { method: "PUT", body: { items: next } }); } catch { setMenu(before); setError(true); }
  };
  const setMode = (v: "grid" | "list") => { setView(v); try { localStorage.setItem(VIEW_KEY, v); } catch { /* storage unavailable */ } };
  const star = (href: string, pinned: boolean) => (
    <button type="button" onClick={() => pin(href)} aria-pressed={pinned} title={pinned ? t("launcher.unpin") : t("launcher.pin")}
      className={`rounded-md p-1 ${pinned ? "text-[#f59e0b]" : "text-faint hover:text-text"}`}>
      <Star className="size-4" fill={pinned ? "currentColor" : "none"} aria-hidden /><span className="sr-only">{pinned ? t("launcher.unpin") : t("launcher.pin")}</span>
    </button>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-border bg-surface p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted" aria-hidden />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("launcher.filter")} aria-label={t("launcher.filter")} className="h-10 pl-9 text-[1rem]" autoFocus />
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {tabs.map((x) => (
            <button key={x.key} type="button" onClick={() => setBand(x.key)} aria-pressed={band === x.key}
              className={`inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-[0.8571rem] font-semibold ${band === x.key ? "border-navy bg-navy text-white" : "border-border bg-surface text-text hover:bg-surface-3"}`}>
              {x.label}<span className={`rounded-[3px] px-1 text-[0.7143rem] ${band === x.key ? "bg-white/20" : "bg-surface-2 text-muted"}`}>{x.n}</span>
            </button>
          ))}
          <div className="ml-auto flex rounded-md border border-border p-0.5">
            <button type="button" onClick={() => setMode("grid")} aria-pressed={view === "grid"} title={t("launcher.gridView")} className={`rounded p-1 ${view === "grid" ? "bg-surface-2 text-text" : "text-muted"}`}><LayoutGrid className="size-4" aria-hidden /><span className="sr-only">{t("launcher.gridView")}</span></button>
            <button type="button" onClick={() => setMode("list")} aria-pressed={view === "list"} title={t("launcher.listView")} className={`rounded p-1 ${view === "list" ? "bg-surface-2 text-text" : "text-muted"}`}><List className="size-4" aria-hidden /><span className="sr-only">{t("launcher.listView")}</span></button>
          </div>
        </div>
      </div>
      {error ? <p className="text-sm text-danger">{t("launcher.saveFailed")}</p> : null}
      {groups.map((g, gi) => (
        <section key={g.key} aria-labelledby={`lg-${g.key}`}>
          <div className="mb-2 flex items-center gap-2.5 border-b border-border-strong pb-1.5">
            <span className="grid h-5 min-w-5 place-items-center rounded-[3px] bg-navy px-1 text-[0.7143rem] font-bold text-white">{String(gi + 1).padStart(2, "0")}</span>
            <h2 id={`lg-${g.key}`} className="text-[1rem] font-semibold">{g.items[0]!.group}</h2>
            <span className="rounded-[3px] bg-surface-2 px-1.5 text-[0.7857rem] font-semibold text-muted">{g.items.length}</span>
          </div>
          {view === "grid" ? (
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {g.items.map((a) => {
                const pinned = menu.includes(a.href);
                return (
                  <li key={`${g.key}${a.href}`} className="flex flex-col rounded-lg border border-border bg-surface p-3 hover:border-primary/50">
                    <div className="flex items-start gap-3">
                      <TileIcon action={a} size="sm" />
                      <Link href={a.href} className="min-w-0 flex-1 pt-0.5 text-[0.9286rem] leading-snug font-semibold hover:text-primary">
                        {a.label}{a.shortcut ? <kbd className="ml-1.5 align-[1px]">{a.shortcut}</kbd> : null}
                      </Link>
                      {star(a.href, pinned)}
                    </div>
                    <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-rule pt-2">
                      <span className="truncate text-[0.8571rem] text-muted">{a.group}</span>
                      <Link href={a.href} className="shrink-0 rounded-[3px] border border-border bg-surface-3 px-2 py-0.5 text-[0.8571rem] font-semibold text-primary hover:border-primary/50">{t("launcher.open")}</Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul className="divide-y divide-rule rounded-lg border border-border bg-surface">
              {g.items.map((a) => {
                const pinned = menu.includes(a.href);
                return (
                  <li key={`${g.key}${a.href}`} className="flex items-center gap-3 px-3 py-1.5 hover:bg-surface-3">
                    <a.icon className="size-4 shrink-0 text-muted" aria-hidden />
                    <Link href={a.href} className="min-w-0 flex-1 truncate text-[0.9286rem] font-medium hover:text-primary">{a.label}</Link>
                    {a.shortcut ? <kbd>{a.shortcut}</kbd> : null}
                    {star(a.href, pinned)}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ))}
      {!groups.length ? <p className="text-sm text-muted">{t("launcher.noMatch")}</p> : null}
    </div>
  );
}
