"use client";

import clsx from "clsx";
import { ChevronDown, LogOut, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { MODULE_TABS, type ModItem } from "@/lib/modules-nav";
import { menuLabelText } from "@/lib/menu";

/**
 * The module tabs of the header and their mega-menus. A mouse hovering a tab previews its menu and a click
 * pins it open; keyboard focus on a tab opens it too (arrows move between tabs, Down enters the menu, arrows
 * move between entries, Esc closes and returns to the tab). On touch the tap does the opening, so nothing
 * depends on hover. Entries the person may not use are left out, and entries with no screen yet are shown
 * greyed and labelled, never as if they worked. Alt plus a tab's letter opens it.
 */
export function MegaMenu({ permissions, onExit, right }: { permissions: string[]; onExit: () => void; right?: React.ReactNode }) {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const [q, setQ] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const filter = useRef<HTMLInputElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const allowed = (p?: string) => !p || permissions.includes(p);

  const tabs = useMemo(() => MODULE_TABS.map((tab) => ({
    ...tab,
    columns: tab.columns
      .map((c) => ({ ...c, items: c.items.filter((i) => allowed(i.permission)) }))
      .filter((c) => c.items.length),
  })).filter((tab) => tab.columns.length),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [permissions]);

  const close = (focusTab = false) => {
    clearTimeout(timer.current);
    const was = open;
    setOpen(null);
    setPinned(false);
    if (focusTab && was) tabRefs.current[was]?.focus();
  };
  useEffect(() => { close(); /* a new screen closes the menu */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  useEffect(() => { setQ(""); }, [open]);
  useEffect(() => {
    if (!open || !pinned) return;
    const outside = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) close(); };
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pinned]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) { e.preventDefault(); close(true); return; }
      if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const tab = tabs.find((x) => x.letter.toLowerCase() === e.key.toLowerCase());
      if (tab) { e.preventDefault(); setOpen(tab.key); setPinned(true); requestAnimationFrame(() => filter.current?.focus()); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tabs]);

  const hoverOpen = (key: string, e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || pinned) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(key), open ? 0 : 150);
  };
  const hoverClose = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || pinned) return;
    clearTimeout(timer.current);
    // A short grace period so the pointer can cross the gap between a tab and its menu without it closing.
    timer.current = setTimeout(() => setOpen(null), 320);
  };
  const keepOpen = () => clearTimeout(timer.current);

  const click = (key: string) => {
    clearTimeout(timer.current);
    if (open === key && pinned) { close(); return; }
    setOpen(key);
    setPinned(true);
  };
  const focusFirst = () => requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>("[data-mi]")?.focus());

  const onTabKey = (e: React.KeyboardEvent, key: string, index: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const next = tabs[(index + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length]!;
      tabRefs.current[next.key]?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(key);
      setPinned(true);
      focusFirst();
    }
  };

  /** Arrow keys inside the menu go to the nearest entry in that direction; Up from the first row returns to the tab. */
  const onPanelKey = (e: React.KeyboardEvent) => {
    const dir = { ArrowDown: [0, 1], ArrowUp: [0, -1], ArrowRight: [1, 0], ArrowLeft: [-1, 0] }[e.key];
    const cur = document.activeElement as HTMLElement | null;
    if (!dir || !panel.current || !cur?.hasAttribute("data-mi")) return;
    e.preventDefault();
    const items = [...panel.current.querySelectorAll<HTMLElement>("[data-mi]")];
    const c = cur.getBoundingClientRect();
    const cx = c.left + c.width / 2, cy = c.top + c.height / 2;
    let best: HTMLElement | null = null, bestScore = Infinity;
    for (const el of items) {
      if (el === cur) continue;
      const r = el.getBoundingClientRect();
      const dx = r.left + r.width / 2 - cx, dy = r.top + r.height / 2 - cy;
      const along = dx * dir[0]! + dy * dir[1]!;
      if (along <= 2) continue;
      const across = Math.abs(dx * dir[1]! + dy * dir[0]!);
      const score = along + across * 3;
      if (score < bestScore) { best = el; bestScore = score; }
    }
    if (best) best.focus();
    else if (e.key === "ArrowUp" && open) tabRefs.current[open]?.focus();
  };

  const current = tabs.find((x) => x.key === open);
  const s = q.trim().toLowerCase();
  const columns = current?.columns
    .map((c) => ({ ...c, items: c.items.filter((i) => !s || menuLabelText(i.label, t).toLowerCase().includes(s)) }))
    .filter((c) => c.items.length) ?? [];
  const firstLink = columns.flatMap((c) => c.items).find((i) => i.href);

  const entry = (i: ModItem) => {
    const body = (
      <>
        <i.icon className="size-4 shrink-0 text-muted" aria-hidden />
        <span className="flex-1 truncate">{menuLabelText(i.label, t)}</span>
        {i.key ? <kbd>{i.key}</kbd> : null}
        {i.soon ? <span className="rounded-[3px] bg-surface-2 px-1 text-[0.6429rem] font-bold text-faint uppercase">{t("menu.soon")}</span> : null}
      </>
    );
    const cls = "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[0.9286rem]";
    return i.href && !i.soon ? (
      <Link data-mi href={i.href} role="menuitem" onClick={() => close()} aria-current={pathname === i.href ? "page" : undefined}
        className={clsx(cls, "text-text hover:bg-primary-soft focus-visible:bg-primary-soft", pathname === i.href && "bg-primary-soft font-medium")}>{body}</Link>
    ) : (
      <span role="menuitem" aria-disabled="true" title={t("menu.notBuilt")} className={clsx(cls, "cursor-default text-faint")}>{body}</span>
    );
  };

  return (
    <div ref={root} className="relative border-b border-border bg-surface print:hidden" onPointerLeave={hoverClose}
      onBlur={(e) => { if (!pinned && open && !root.current?.contains(e.relatedTarget as Node)) setOpen(null); }}>
      <nav aria-label={t("mega.modules")} className="flex items-center gap-0.5 overflow-x-auto px-2 [scrollbar-width:none] md:flex-wrap md:overflow-visible">
        {tabs.map((tab, idx) => {
          const active = open === tab.key;
          return (
            <button key={tab.key} ref={(el) => { tabRefs.current[tab.key] = el; }} type="button" aria-expanded={active} aria-haspopup="menu" aria-controls={active ? "mega-panel" : undefined}
              title={`${t(`mega.tab.${tab.key}`)} (Alt+${tab.letter})`}
              onPointerEnter={(e) => hoverOpen(tab.key, e)} onClick={() => click(tab.key)} onKeyDown={(e) => onTabKey(e, tab.key, idx)}
              onFocus={(e) => { if (!pinned && e.currentTarget.matches(":focus-visible")) setOpen(tab.key); }}
              className={clsx("relative flex shrink-0 items-center gap-1.5 px-2.5 py-2.5 text-[0.9286rem] font-medium whitespace-nowrap transition-colors",
                active ? "text-primary" : "text-text/85 hover:text-text")}>
              <tab.icon className={clsx("size-4", active ? "text-primary" : "text-muted")} aria-hidden />
              {t(`mega.tab.${tab.key}`)}
              <ChevronDown className={clsx("size-3.5 text-faint transition-transform", active && "rotate-180")} aria-hidden />
              <span aria-hidden className={clsx("absolute inset-x-2 bottom-0 h-0.5 rounded-full", active ? "bg-primary" : "bg-transparent")} />
            </button>
          );
        })}
        <button type="button" onClick={onExit} className="flex shrink-0 items-center gap-1.5 px-2.5 py-2.5 text-[0.9286rem] font-medium text-text/85 hover:text-text">
          <LogOut className="size-4 text-muted" aria-hidden />{t("menu.h.exit")}
        </button>
        {right ? <div className="ml-auto hidden shrink-0 items-center gap-2 pl-2 md:flex">{right}</div> : null}
      </nav>

      {current ? (
        <div id="mega-panel" ref={panel} role="menu" aria-label={t(`mega.tab.${current.key}`)} onPointerEnter={keepOpen} onKeyDown={onPanelKey}
          className="absolute inset-x-0 top-full z-40 max-h-[calc(100dvh-9rem)] overflow-y-auto border-b border-border-strong bg-glass shadow-overlay backdrop-blur-xl motion-safe:animate-[rise_120ms_ease-out]">
          <div className="mx-auto max-w-[1440px] px-4 pt-3 pb-2">
            <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {columns.map((c) => (
                <section key={c.key} aria-label={t(`mega.col.${current.key}.${c.key}`)} className={clsx(c.items.length > 14 && "xl:col-span-2")}>
                  <h2 className="mb-1 border-b border-border px-2 pb-1 text-[0.8571rem] font-semibold text-muted">{t(`mega.col.${current.key}.${c.key}`)}</h2>
                  <ul className={clsx("grid gap-px", c.items.length > 14 && "xl:grid-cols-2")} role="none">
                    {c.items.map((i) => <li key={`${i.href ?? i.label}`} role="none">{entry(i)}</li>)}
                  </ul>
                </section>
              ))}
            </div>
            {!columns.length ? <p className="py-6 text-[0.9286rem] text-muted">{t("launcher.noMatch")}</p> : null}
          </div>
          <form className="sticky bottom-0 flex items-center gap-2 border-t border-border bg-surface-2/80 px-4 py-1.5 backdrop-blur"
            onSubmit={(e) => { e.preventDefault(); if (firstLink?.href) { close(); window.location.assign(firstLink.href); } }}>
            <label htmlFor="mega-filter" className="flex items-center gap-1.5 text-[0.8571rem] font-semibold text-muted"><Search className="size-3.5" aria-hidden />{t("menu.filter")}</label>
            <input ref={filter} id="mega-filter" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off"
              className="h-8 w-56 rounded-md border border-border-strong bg-surface px-2 text-[0.9286rem] text-text focus:border-primary focus:outline-none" />
            <p className="ml-auto hidden text-[0.8571rem] text-muted md:block">{t("mega.hint")}</p>
          </form>
        </div>
      ) : null}
    </div>
  );
}
