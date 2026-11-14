"use client";

import clsx from "clsx";
import { Search, Star, X } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { menuLabelText } from "@/lib/menu";
import { groupTitleKey, hintKey, moduleTitle, tidyLabel, type ModTab } from "@/lib/modules-nav";
import type { usePins } from "./usePins";

const ALL = "__all";
const CREATE = "__create";

/** The text with every match of the search shown in bold, so the person sees why a row is listed. */
function Marked({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const at = text.toLowerCase().indexOf(query.toLowerCase());
  if (at < 0) return <>{text}</>;
  return <>{text.slice(0, at)}<mark className="rounded-[2px] bg-transparent font-semibold text-primary underline decoration-primary/50 underline-offset-2">{text.slice(at, at + query.length)}</mark>{text.slice(at + query.length)}</>;
}

/**
 * The panel a section opens, in two panes. Left: the section's groups with their counts, "All" first. Right: every screen of the chosen group, one per row with its
 * shortcut key and a star that pins it to Home; "Create new" stays at the top as compact buttons. Nothing is hidden behind a "Show all" link. Typing in the search box
 * switches to All and filters across every group. Up and Down walk the screens, Left and Right change panes, Enter opens, Esc clears the search and then closes the panel.
 * Screens the person may not use are left out.
 */
export function ModuleFlyout({ tab, pathname, permissions, pins, onClose, onSearchEverywhere, onOpenReports, focusGroup }: {
  tab: ModTab; pathname: string; permissions: string[]; pins: ReturnType<typeof usePins>; onClose: () => void; onSearchEverywhere: () => void; onOpenReports: () => void; focusGroup?: string | undefined;
}) {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const [chosen, setChosen] = useState<string>(focusGroup && tab.columns.some((c) => c.key === focusGroup) ? focusGroup : ALL);
  const search = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const allowed = (p?: string) => !p || permissions.includes(p);
  const title = moduleTitle(tab.key);
  const text = (label: string) => tidyLabel(menuLabelText(label, t));
  const heading = (column: string) => t.has(groupTitleKey(tab.key, column)) ? t(groupTitleKey(tab.key, column)) : column.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (x) => x.toUpperCase());

  useEffect(() => { search.current?.focus({ preventScroll: true }); }, []);

  const q = query.trim();
  const create = useMemo(() => tab.create.filter((c) => allowed(c.permission)).map((c) => ({ ...c, text: t(c.label) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tab, permissions, t]);
  const groups = useMemo(() => tab.columns.map((column) => ({
    key: column.key,
    items: column.items.filter((i) => allowed(i.permission) && i.href).map((i) => ({ ...i, text: text(i.label) })),
  })).filter((g) => g.items.length),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [tab, permissions, t]);
  const match = (s: string) => !q || s.toLowerCase().includes(q.toLowerCase());
  // A screen that sits in two groups is listed once under All.
  const everyItem = useMemo(() => {
    const seen = new Set<string>();
    return groups.flatMap((g) => g.items.map((i) => ({ ...i, group: g.key }))).filter((i) => (seen.has(i.href!) ? false : (seen.add(i.href!), true)));
  }, [groups]);
  const total = create.length + everyItem.length;
  const active = q ? ALL : chosen;
  const shownCreate = create.filter((c) => match(c.text));
  const rows = active === ALL ? groups.map((g) => ({ key: g.key, items: g.items.filter((i) => match(i.text)) })).filter((g) => g.items.length)
    : active === CREATE ? []
    : groups.filter((g) => g.key === active).map((g) => ({ key: g.key, items: g.items }));
  const nothing = !shownCreate.length && !rows.length;
  const hasReports = !["reports", "workspace", "utilities", "crm", "masters", "admin"].includes(tab.key);

  const entries = () => [...(panel.current?.querySelectorAll<HTMLElement>("[data-entry]") ?? [])];
  const groupButtons = () => [...(panel.current?.querySelectorAll<HTMLElement>("[data-grp]") ?? [])];
  const focusGroupButton = () => (groupButtons().find((b) => b.getAttribute("aria-selected") === "true") ?? groupButtons()[0])?.focus();

  function onKeyDown(e: React.KeyboardEvent) {
    const el = document.activeElement as HTMLElement | null;
    const inSearch = el === search.current;
    if (e.key === "Escape" && q) { e.preventDefault(); e.stopPropagation(); setQuery(""); search.current?.focus(); return; }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const down = e.key === "ArrowDown";
      if (el?.hasAttribute("data-grp")) {
        e.preventDefault();
        const g = groupButtons();
        const to = g[Math.min(g.length - 1, Math.max(0, g.indexOf(el) + (down ? 1 : -1)))];
        if (to !== el) { to?.focus(); setChosen(to?.dataset.grp ?? ALL); } else if (!down) search.current?.focus();
        return;
      }
      const list = entries();
      const here = el ? list.indexOf(el) : -1;
      if (inSearch || here >= 0) {
        e.preventDefault();
        if (here <= 0 && !down) { search.current?.focus(); return; }
        list[Math.min(list.length - 1, Math.max(0, here + (down ? 1 : -1)))]?.focus();
      }
    } else if (e.key === "ArrowLeft" && el?.hasAttribute("data-entry")) { e.preventDefault(); focusGroupButton(); }
    else if (e.key === "ArrowRight" && el?.hasAttribute("data-grp")) { e.preventDefault(); entries()[0]?.focus(); }
    else if (e.key === "Tab") {
      const nodes = [...(panel.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled]):not([data-skip]), input") ?? [])];
      const i = el ? nodes.indexOf(el) : -1;
      if (e.shiftKey && i <= 0) { e.preventDefault(); nodes[nodes.length - 1]?.focus(); }
      else if (!e.shiftKey && i === nodes.length - 1) { e.preventDefault(); nodes[0]?.focus(); }
    }
  }

  const pinStar = (href: string, label: string) => {
    const pinned = pins.isPinned(href);
    return (
      <button type="button" data-skip disabled={!pins.ready} onClick={() => void pins.toggle(href)} aria-pressed={pinned} aria-label={t(pinned ? "navmenu.unpin" : "navmenu.pin", { label })} title={t(pinned ? "navmenu.unpin" : "navmenu.pin", { label })}
        className={clsx("absolute top-1/2 right-1 grid size-7 -translate-y-1/2 place-items-center rounded-md text-faint hover:bg-surface-2 hover:text-text focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-primary pointer-coarse:size-9",
          pinned ? "text-accent opacity-100" : "[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within/row:opacity-100 [@media(hover:hover)]:group-hover/row:opacity-100")}>
        <Star className="size-3.5" fill={pinned ? "currentColor" : "none"} aria-hidden />
      </button>
    );
  };

  const groupList: { key: string; label: string; count: number }[] = [
    { key: ALL, label: t("navmenu.all"), count: total },
    ...(create.length ? [{ key: CREATE, label: t("navmenu.createNew"), count: create.length }] : []),
    ...groups.map((g) => ({ key: g.key, label: heading(g.key), count: g.items.length })),
  ];

  return (
    <>
      <button type="button" tabIndex={-1} aria-hidden onClick={onClose} className="fixed top-14 right-0 bottom-0 left-[5.5rem] z-30 cursor-default bg-[rgb(15_23_42/0.45)] backdrop-blur-[2px] print:hidden" />
      <div ref={panel} role="dialog" aria-label={t("navmenu.panel", { module: title })} onKeyDown={onKeyDown}
        style={{ "--tone": `var(--mod-${tab.key})` } as React.CSSProperties}
        className="fixed top-14 bottom-0 left-[5.5rem] z-40 flex w-[min(40rem,calc(100vw-5.5rem))] flex-col rounded-r-xl border-r border-border bg-surface text-text shadow-flyout motion-safe:animate-pop-in origin-left print:hidden">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-lg text-[var(--tone)]" style={{ background: "color-mix(in srgb, var(--tone) 14%, transparent)" }}>
            <tab.icon className="size-[1.15rem]" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base leading-6 font-semibold">{title}</h2>
            <p className="truncate text-[13px] leading-[18px] text-muted">{t(hintKey(tab.key))}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t("navmenu.close")} className="grid size-9 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-text">
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div className="px-4 pt-3 pb-3">
          <label className="flex h-10 items-center gap-2 rounded-lg border border-border-input bg-surface px-3 text-[15px] transition-[border-color,box-shadow] duration-[120ms] focus-within:border-ring focus-within:shadow-focus">
            <Search className="size-4 shrink-0 text-muted" aria-hidden />
            <span className="sr-only">{t("navmenu.find", { module: title })}</span>
            <input ref={search} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("navmenu.find", { module: title })} autoComplete="off" spellCheck={false}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); entries()[0]?.click(); } }}
              className="min-w-0 flex-1 bg-transparent text-text outline-none placeholder:text-muted" />
            <kbd>{t("navmenu.esc")}</kbd>
          </label>
        </div>

        <div className="flex min-h-0 flex-1 border-t border-border">
          <div role="tablist" aria-orientation="vertical" aria-label={t("navmenu.groups")} className="w-[12.5rem] shrink-0 overflow-y-auto border-r border-border bg-surface-3 p-2">
            {groupList.map((g) => {
              const on = active === g.key;
              return (
                <button key={g.key} type="button" role="tab" data-grp={g.key} aria-selected={on} tabIndex={on ? 0 : -1} onClick={() => { setChosen(g.key); setQuery(""); }}
                  className={clsx("flex min-h-9 w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-left text-sm leading-5 transition-colors duration-[120ms]",
                    on ? "bg-surface font-semibold text-[var(--tone)] shadow-[inset_3px_0_0_var(--tone)]" : "text-text-secondary hover:bg-surface-2 hover:text-text")}>
                  <span className="min-w-0 flex-1 truncate">{g.label}</span>
                  <span className={clsx("shrink-0 text-xs tabular-nums", on ? "text-[var(--tone)]" : "text-muted")}>{g.count}</span>
                </button>
              );
            })}
          </div>

          <div role="tabpanel" className="min-w-0 flex-1 overflow-y-auto px-3 py-3">
            {shownCreate.length ? (
              <section aria-label={t("navmenu.createNew")} className="mb-3">
                <div className="flex flex-wrap gap-1.5">
                  {shownCreate.map((c) => (
                    <Link key={c.href} href={c.href} data-entry onClick={onClose}
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border-input bg-surface px-2.5 text-sm font-medium transition-colors duration-[120ms] hover:border-border-input-hover hover:bg-surface-2 pointer-coarse:h-10">
                      <c.icon className="size-3.5 shrink-0 text-[var(--tone)]" aria-hidden />
                      <span><Marked text={c.text} query={q} /></span>
                      {c.key ? <kbd>{c.key}</kbd> : null}
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {rows.map((g) => (
              <section key={g.key} data-group={g.key} aria-label={heading(g.key)} className="mb-3">
                {active === ALL ? <h3 className="mb-0.5 px-2 text-xs leading-[18px] font-semibold tracking-wider text-muted uppercase">{heading(g.key)}</h3> : null}
                <ul>
                  {g.items.map((item) => {
                    const route = (item.href ?? "").split("?")[0]!;
                    const current = pathname === route || pathname.startsWith(`${route}/`);
                    return (
                      <li key={`${g.key}${item.href}`} className="group/row relative">
                        <Link href={item.href!} data-entry onClick={onClose} aria-current={current ? "page" : undefined}
                          className={clsx("flex min-h-9 items-center gap-2 rounded-md py-1.5 pr-10 pl-2 text-[15px] leading-5 transition-colors duration-[120ms] pointer-coarse:min-h-11",
                            current ? "bg-primary-soft font-medium text-primary" : "text-text hover:bg-surface-2")}>
                          <item.icon className="size-4 shrink-0 text-muted" aria-hidden />
                          <span className="min-w-0 flex-1"><Marked text={item.text} query={q} /></span>
                          {item.key ? <kbd>{item.key}</kbd> : null}
                        </Link>
                        {pinStar(item.href!, item.text)}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}

            {nothing ? (
              <div className="py-10 text-center text-[15px]">
                <p className="text-muted">{t("navmenu.noMatch", { module: title, query })}</p>
                <button type="button" onClick={() => { onClose(); onSearchEverywhere(); }} className="mt-3 inline-flex h-9 items-center rounded-lg border border-border-input px-3 font-medium hover:bg-surface-2">{t("navmenu.searchEverywhere")}</button>
              </div>
            ) : null}
            {pins.failed ? <p role="alert" className="mt-2 text-[13px] text-danger">{t("navmenu.pinFailed")}</p> : null}
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-border bg-surface-3 px-4 py-2 text-[13px] leading-[18px] text-muted">
          <span className="min-w-0 flex-1 truncate">{t("navmenu.pinHint")}</span>
          {tab.key === "reports" || tab.key === "utilities" ? <Link href={`/${tab.key}`} onClick={onClose} className="shrink-0 rounded-md px-2 py-1 font-medium text-primary hover:bg-primary-soft">{t("navmenu.openPage")}</Link> : null}
          {hasReports ? <button type="button" onClick={onOpenReports} className="shrink-0 rounded-md px-2 py-1 font-medium text-primary hover:bg-primary-soft">{t("navmenu.seeReports")}</button> : null}
        </div>
      </div>
    </>
  );
}
