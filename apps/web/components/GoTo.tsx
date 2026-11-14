"use client";

import clsx from "clsx";
import { CornerDownLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

export interface GoToItem {
  href: string;
  label: string;
  group: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Tally's key for this entry, shown beside it and bound globally (F4–F9). */
  key?: string;
}

/** Ranks by how early and how wholly the query matches; also matches word initials ("pb" → Purchase bills). */
function score(label: string, q: string) {
  const l = label.toLowerCase();
  if (!q) return 1;
  if (l.startsWith(q)) return 4;
  if (l.split(/\s+/).some((w) => w.startsWith(q))) return 3;
  if (l.includes(q)) return 2;
  const initials = l.split(/\s+/).map((w) => w[0]).join("");
  return initials.startsWith(q) ? 1.5 : initials.includes(q) ? 1 : 0;
}

const typing = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

/**
 * Tally's "Go To" for the web: Ctrl+K (or Alt+G) opens it from anywhere. Tally's voucher keys work
 * outside text fields: F4 contra, F5 payment, F6 receipt, F7 journal, F8 sales, F9 purchase.
 */
export function GoTo({ items, open, onOpenChange }: { items: GoToItem[]; open: boolean; onOpenChange: (o: boolean) => void }) {
  const t = useTranslations("shell");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .map((it, i) => ({ it, i, s: Math.max(score(it.label, q), q ? score(it.group, q) * 0.5 : 0) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s || a.i - b.i)
      .map((r) => r.it);
  }, [items, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "g" && e.altKey)) {
        e.preventDefault();
        onOpenChange(!open);
        return;
      }
      // A screen with its own function keys (the billing counter) claims them first.
      if (e.defaultPrevented || open || typing(e.target) || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      const hit = items.find((it) => it.key === e.key);
      if (hit) {
        e.preventDefault();
        router.push(hit.href);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items, open, onOpenChange, router]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    requestAnimationFrame(() => input.current?.focus());
  }, [open]);

  useEffect(() => {
    list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;
  const go = (it: GoToItem | undefined) => {
    if (!it) return;
    onOpenChange(false);
    router.push(it.href);
  };

  let lastGroup = "";
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-[rgb(10_13_27/0.45)] px-4 pt-[12vh]" onMouseDown={() => onOpenChange(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("goTo")}
        onMouseDown={(e) => e.stopPropagation()}
        className="flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card motion-safe:animate-[rise_160ms_ease-out]"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-4 shrink-0 text-muted" aria-hidden />
          <input
            ref={input}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
              else if (e.key === "Enter") { e.preventDefault(); go(results[active]); }
              else if (e.key === "Escape") onOpenChange(false);
            }}
            placeholder={t("goToPlaceholder")}
            aria-label={t("goTo")}
            role="combobox"
            aria-expanded="true"
            aria-controls="goto-list"
            aria-activedescendant={results[active] ? `goto-${active}` : undefined}
            className="h-13 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
          />
          <kbd className="rounded border border-border px-1.5 text-xs text-muted">Esc</kbd>
        </div>
        <ul ref={list} id="goto-list" role="listbox" className="overflow-y-auto p-2">
          {results.length ? results.map((it, i) => {
            const header = it.group !== lastGroup ? it.group : null;
            lastGroup = it.group;
            return (
              <li key={it.href} role="presentation">
                {header && !query ? <div className="px-2 pt-3 pb-1 text-xs font-medium text-muted first:pt-1">{header}</div> : null}
                <button
                  type="button"
                  id={`goto-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={i === active}
                  onMouseMove={() => setActive(i)}
                  onClick={() => go(it)}
                  className={clsx("flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm", i === active ? "bg-primary-soft text-primary" : "text-text")}
                >
                  <it.icon className="size-4 shrink-0 opacity-70" aria-hidden />
                  <span className="flex-1 truncate">{it.label}</span>
                  {query ? <span className="truncate text-xs text-muted">{it.group}</span> : null}
                  {it.key ? <kbd className="rounded border border-border px-1.5 text-xs text-muted">{it.key}</kbd> : null}
                  {i === active ? <CornerDownLeft className="size-3.5 text-muted" aria-hidden /> : null}
                </button>
              </li>
            );
          }) : <li className="px-3 py-8 text-center text-sm text-muted">{t("noMatch", { query })}</li>}
        </ul>
        <p className="border-t border-border px-4 py-2.5 text-xs text-muted">{t("tallyKeys")}</p>
      </div>
    </div>
  );
}
