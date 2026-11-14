"use client";

import clsx from "clsx";
import { ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { MENU, menuLabelText, type MenuHeading } from "@/lib/menu";

/**
 * The menu bar: Masters, Transaction, Reports, Account Reports, Payroll, Utility, Chat and Exit. Each
 * heading opens a panel of grey-titled groups with icon tiles and a filter box at the foot, the way the
 * user's G-Retail lays them out. Alt and the heading's letter opens it from the keyboard.
 */
export function MenuBar({ permissions, onExit, right }: { permissions: string[]; onExit: () => void; right?: React.ReactNode }) {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const filter = useRef<HTMLInputElement>(null);
  const allowed = (p?: string) => !p || permissions.includes(p);

  useEffect(() => { setOpen(null); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    setQ("");
    requestAnimationFrame(() => filter.current?.focus());
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(null); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(null); return; }
      if (!e.altKey || e.ctrlKey || e.metaKey) return;
      const h = MENU.find((x) => x.letter.toLowerCase() === e.key.toLowerCase());
      if (h) { e.preventDefault(); setOpen((o) => (o === h.key ? null : h.key)); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const heading = MENU.find((h) => h.key === open);
  return (
    <div ref={ref} className="relative border-b border-border bg-surface print:hidden">
      <nav aria-label={t("shell.menu")} className="flex items-center gap-0.5 overflow-x-auto px-2 py-1 [scrollbar-width:none] md:flex-wrap md:overflow-visible">
        {MENU.map((h) => (
          <button key={h.key} type="button" onClick={() => setOpen(open === h.key ? null : h.key)} aria-expanded={open === h.key} aria-haspopup="menu"
            className={clsx("flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.9286rem] font-semibold whitespace-nowrap", open === h.key ? "bg-primary-soft text-primary ring-1 ring-primary/40" : "text-text hover:bg-surface-2")}>
            <span className="grid size-5 place-items-center rounded-full text-[0.7143rem] font-bold text-white" style={{ background: h.tone }}>{h.letter}</span>
            {t(`menu.h.${h.key}`)}
            <ChevronDown className="size-3.5 text-faint" aria-hidden />
          </button>
        ))}
        <button type="button" onClick={onExit} className="flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.9286rem] font-semibold text-text hover:bg-surface-2">
          <span className="grid size-5 place-items-center rounded-full bg-[#16a34a] text-white"><LogOut className="size-3" aria-hidden /></span>{t("menu.h.exit")}
        </button>
        {right ? <div className="ml-auto hidden shrink-0 items-center gap-2 pl-2 md:flex">{right}</div> : null}
      </nav>
      {heading ? <Panel heading={heading} q={q} setQ={setQ} filter={filter} allowed={allowed} onPick={() => setOpen(null)} /> : null}
    </div>
  );
}

function Panel({ heading, q, setQ, filter, allowed, onPick }: {
  heading: MenuHeading; q: string; setQ: (v: string) => void; filter: React.RefObject<HTMLInputElement | null>; allowed: (p?: string) => boolean; onPick: () => void;
}) {
  const t = useTranslations();
  const s = q.trim().toLowerCase();
  const groups = heading.groups
    .map((g) => ({ ...g, items: g.items.filter((x) => allowed(x.permission) && (!s || menuLabelText(x.label, t).toLowerCase().includes(s))) }))
    .filter((g) => g.items.length);
  const first = groups[0]?.items.find((x) => x.href);
  return (
    <div role="menu" className="absolute inset-x-0 top-full z-40 max-h-[calc(100dvh-8rem)] overflow-hidden border-b border-border-strong bg-surface shadow-card motion-safe:animate-[rise_120ms_ease-out]">
      <div className="max-h-[calc(100dvh-11rem)] overflow-y-auto">
        {groups.map((g) => (
          <section key={g.key}>
            <h2 className="border-y border-border bg-surface-2 px-3 py-1 text-[0.8571rem] font-semibold text-muted">{t(`menu.g.${g.key}`)}</h2>
            <ul className="grid grid-cols-2 gap-1 p-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
              {g.items.map((x) => {
                const body = (
                  <>
                    <x.icon className="size-7" style={{ color: x.href ? heading.tone : undefined }} aria-hidden />
                    <span className="text-center text-[0.9286rem] leading-tight">{menuLabelText(x.label, t)}</span>
                    {x.key ? <kbd className="absolute top-1.5 right-1.5">{x.key}</kbd> : null}
                    {!x.href ? <span className="absolute top-1.5 right-1.5 rounded-[3px] bg-surface-2 px-1 text-[0.6429rem] font-bold text-faint uppercase">{t("menu.soon")}</span> : null}
                  </>
                );
                return (
                  <li key={x.label + (x.href ?? "")}>
                    {x.href ? (
                      <Link role="menuitem" href={x.href} onClick={onPick} className="relative flex h-full min-h-[5.5rem] flex-col items-center justify-center gap-1.5 rounded-md px-2 py-2.5 hover:bg-primary-soft focus-visible:bg-primary-soft">{body}</Link>
                    ) : (
                      <span role="menuitem" aria-disabled title={t("menu.notBuilt")} className="relative flex h-full min-h-[5.5rem] cursor-default flex-col items-center justify-center gap-1.5 rounded-md px-2 py-2.5 text-faint opacity-70">{body}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        {!groups.length ? <p className="px-4 py-6 text-[0.9286rem] text-muted">{t("launcher.noMatch")}</p> : null}
      </div>
      <form className="flex items-center gap-2 border-t border-border bg-accent-soft/60 px-3 py-1.5" onSubmit={(e) => { e.preventDefault(); if (first?.href) { onPick(); window.location.assign(first.href); } }}>
        <label htmlFor="menu-filter" className="text-[0.8571rem] font-semibold text-text">{t("menu.filter")}</label>
        <input ref={filter} id="menu-filter" value={q} onChange={(e) => setQ(e.target.value)} className="h-8 flex-1 rounded-md border-2 border-text/70 bg-surface px-2 text-[0.9286rem] text-text focus:border-primary focus:outline-none" autoComplete="off" />
      </form>
    </div>
  );
}
