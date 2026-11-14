"use client";

import clsx from "clsx";
import { Search, Star } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { menuLabelText } from "@/lib/menu";
import { groupTitleKey, MODULE_TABS, moduleTitle, tidyLabel } from "@/lib/modules-nav";
import { usePins } from "./usePins";

/**
 * A whole section as one page: its screens in named groups with a search box, a short index to jump between groups and a
 * star on every row to pin it to Home. Built from the same data as the menu panel, so a new report or utility appears in
 * both. Used for Reports and Utilities.
 */
export function ModuleWindow({ tabKey, permissions, findLabel }: { tabKey: string; permissions: string[]; findLabel: string }) {
  const t = useTranslations();
  const pins = usePins(true);
  const [query, setQuery] = useState("");
  const tab = MODULE_TABS.find((x) => x.key === tabKey);
  const q = query.trim().toLowerCase();
  const heading = (column: string) => t.has(groupTitleKey(tabKey, column)) ? t(groupTitleKey(tabKey, column)) : column.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (x) => x.toUpperCase());

  const groups = useMemo(() => (tab?.columns ?? []).map((column) => ({
    key: column.key,
    items: column.items.filter((i) => i.href && (!i.permission || permissions.includes(i.permission))).map((i) => ({ ...i, text: tidyLabel(menuLabelText(i.label, t)) })).filter((i) => !q || i.text.toLowerCase().includes(q)),
  })).filter((g) => g.items.length),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [tab, q, permissions, t]);
  if (!tab) return null;
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[13rem_minmax(0,1fr)]" style={{ "--tone": `var(--mod-${tabKey})` } as React.CSSProperties}>
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <label className="flex h-10 items-center gap-2 rounded-lg border border-border-input bg-surface px-3 text-[0.9286rem] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25">
          <Search className="size-4 shrink-0 text-muted" aria-hidden />
          <span className="sr-only">{findLabel}</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={findLabel} type="search" autoComplete="off" spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-text outline-none placeholder:text-faint" />
        </label>
        <nav aria-label={t("navmenu.groups")} className="mt-3 flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0">
          {groups.map((g) => (
            <a key={g.key} href={`#win-${g.key}`} className="flex shrink-0 items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-[0.9286rem] text-muted hover:bg-surface-2 hover:text-text focus-visible:outline-2 focus-visible:outline-primary">
              <span>{heading(g.key)}</span><span className="num text-[0.8571rem] text-faint">{g.items.length}</span>
            </a>
          ))}
        </nav>
      </aside>

      <div className="min-w-0">
        {groups.map((g) => (
          <section key={g.key} id={`win-${g.key}`} aria-labelledby={`win-h-${g.key}`} className="mb-7 scroll-mt-20">
            <h2 id={`win-h-${g.key}`} className="mb-2 text-[1rem] font-semibold">{heading(g.key)}</h2>
            <ul className="grid gap-x-4 sm:grid-cols-2 2xl:grid-cols-3">
              {g.items.map((item) => {
                const pinned = pins.isPinned(item.href!);
                return (
                  <li key={item.href} className="group/row relative border-b border-rule">
                    <Link href={item.href!} className="flex min-h-11 items-center gap-2.5 rounded-md py-2 pr-10 pl-1 text-[0.9286rem] hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-primary">
                      <item.icon className="size-4 shrink-0 text-[var(--tone)]" aria-hidden />
                      <span className="min-w-0 flex-1">{item.text}</span>
                    </Link>
                    <button type="button" disabled={!pins.ready} onClick={() => void pins.toggle(item.href!)} aria-pressed={pinned}
                      aria-label={t(pinned ? "navmenu.unpin" : "navmenu.pin", { label: item.text })} title={t(pinned ? "navmenu.unpin" : "navmenu.pin", { label: item.text })}
                      className={clsx("absolute top-1/2 right-1 grid size-8 -translate-y-1/2 place-items-center rounded-md text-faint hover:bg-surface-2 hover:text-text focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-primary pointer-coarse:size-10",
                        pinned ? "text-accent opacity-100" : "[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within/row:opacity-100 [@media(hover:hover)]:group-hover/row:opacity-100")}>
                      <Star className="size-4" fill={pinned ? "currentColor" : "none"} aria-hidden />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        {!total ? <p className="py-10 text-center text-[0.9286rem] text-muted">{t("navmenu.noMatch", { module: moduleTitle(tabKey), query })}</p> : null}
        {pins.failed ? <p role="alert" className="text-[0.8571rem] text-danger">{t("navmenu.pinFailed")}</p> : null}
      </div>
    </div>
  );
}
