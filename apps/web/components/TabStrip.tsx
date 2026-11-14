"use client";

import clsx from "clsx";
import { Home, Pin, PinOff, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { DIRTY_EVENT } from "@/lib/workspace-dirty";

interface Tab { href: string; title: string; pinned?: boolean }
const HOME = "/dashboard";
const MAX = 14;
const MAX_CLOSED = 10;

const load = <T,>(key: string, fallback: T): T => { try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; } };
const save = (key: string, v: unknown) => { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage unavailable */ } };
const pathOf = (href: string) => href.split("?")[0]!;

/**
 * The workspace tabs: every screen a person opens becomes a tab (Home stays first) and keeps its place and its
 * filters until closed. Tabs can be pinned (they stay at the left and are not closed by "close others"), closed
 * singly, all but pinned, or all but one, and the last ten closed can be reopened. The set is remembered per
 * business on this device, so the next session starts where the last one stopped. A screen holding unsaved work
 * shows a dot and asks before its tab closes. One screen has one tab; a new document and the saved document are
 * different screens and so different tabs.
 * Keys: Ctrl+Alt+Right / Left switch tabs, Ctrl+Alt+W closes the current one, Ctrl+Alt+T reopens the last closed
 * (the browser keeps Ctrl+Tab, Ctrl+W and Ctrl+Shift+T for itself).
 */
export function TabStrip({ scope = "default" }: { scope?: string }) {
  const t = useTranslations();
  const pathname = usePathname();
  const search = useSearchParams();
  const router = useRouter();
  const KEY = `varchasv.tabs.${scope}`;
  const CLOSED = `varchasv.tabs.closed.${scope}`;
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [closed, setClosed] = useState<Tab[]>([]);
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const [menu, setMenu] = useState<{ href: string; x: number; y: number } | null>(null);
  const strip = useRef<HTMLDivElement>(null);
  const menuEl = useRef<HTMLUListElement>(null);
  const here = `${pathname}${search.toString() ? `?${search.toString()}` : ""}`;

  useEffect(() => {
    // Tabs saved before tabs were kept per business are adopted once.
    setTabs(load<Tab[]>(KEY, load<Tab[]>("varchasv.tabs", [])));
    setClosed(load<Tab[]>(CLOSED, []));
  }, [KEY, CLOSED]);

  const commit = (next: Tab[]) => {
    // Pinned tabs always sit first, in the order they were pinned.
    const ordered = [...next.filter((x) => x.pinned), ...next.filter((x) => !x.pinned)];
    setTabs(ordered);
    save(KEY, ordered);
  };
  const remember = (gone: Tab[]) => {
    const next = [...gone, ...closed.filter((c) => !gone.some((g) => pathOf(g.href) === pathOf(c.href)))].slice(0, MAX_CLOSED);
    setClosed(next);
    save(CLOSED, next);
  };

  // The screen now showing joins the strip once it has its title (a tab per screen, not per filter).
  useEffect(() => {
    if (pathname === HOME) return;
    const id = setTimeout(() => {
      const title = document.title.replace(/ · Varchasv.*$/, "").trim() || pathname;
      setTabs((prev) => {
        const i = prev.findIndex((x) => pathOf(x.href) === pathname);
        const next = i >= 0 ? prev.map((x, j) => (j === i ? { ...x, href: here, title } : x)) : [...prev, { href: here, title }];
        // The oldest unpinned tab makes room once the strip is full.
        while (next.length > MAX && next.some((x) => !x.pinned)) next.splice(next.findIndex((x) => !x.pinned && pathOf(x.href) !== pathname), 1);
        const ordered = [...next.filter((x) => x.pinned), ...next.filter((x) => !x.pinned)];
        save(KEY, ordered);
        return ordered;
      });
    }, 500);
    return () => clearTimeout(id);
  }, [pathname, here, KEY]);

  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ path: string; dirty: boolean }>).detail;
      setDirty((prev) => (prev[d.path] === d.dirty ? prev : { ...prev, [d.path]: d.dirty }));
    };
    window.addEventListener(DIRTY_EVENT, on);
    return () => window.removeEventListener(DIRTY_EVENT, on);
  }, []);

  useEffect(() => { strip.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest", inline: "nearest" }); }, [tabs, pathname]);
  useEffect(() => {
    if (!menu) return;
    // A press inside the menu is for one of its items, so only a press elsewhere closes it.
    const off = (e?: Event) => { if (e && menuEl.current?.contains(e.target as Node)) return; setMenu(null); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") off(); };
    document.addEventListener("mousedown", off);
    document.addEventListener("keydown", esc);
    const closeOnScroll = () => setMenu(null);
    window.addEventListener("scroll", closeOnScroll, true);
    return () => { document.removeEventListener("mousedown", off); document.removeEventListener("keydown", esc); window.removeEventListener("scroll", closeOnScroll, true); };
  }, [menu]);

  const isActive = (href: string) => pathOf(href) === pathname;
  const sure = (list: Tab[]) => !list.some((x) => dirty[pathOf(x.href)]) || window.confirm(t("ws.confirmClose"));

  const closeSet = (gone: Tab[]) => {
    if (!gone.length || !sure(gone)) return;
    const goneHrefs = new Set(gone.map((x) => x.href));
    const next = tabs.filter((x) => !goneHrefs.has(x.href));
    remember(gone);
    commit(next);
    if (gone.some((x) => isActive(x.href))) {
      const i = tabs.findIndex((x) => isActive(x.href));
      router.push(next[Math.min(i, next.length - 1)]?.href ?? HOME);
    }
  };
  const close = (href: string) => closeSet(tabs.filter((x) => x.href === href));
  const togglePin = (href: string) => commit(tabs.map((x) => (x.href === href ? { ...x, pinned: !x.pinned } : x)));
  const reopen = () => {
    const [last, ...rest] = closed;
    if (!last) return;
    setClosed(rest);
    save(CLOSED, rest);
    commit([...tabs.filter((x) => pathOf(x.href) !== pathOf(last.href)), last]);
    router.push(last.href);
  };

  const order = useMemo(() => [HOME, ...tabs.map((x) => x.href)], [tabs]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.ctrlKey || !e.altKey || e.metaKey) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const i = Math.max(0, order.findIndex((h) => pathOf(h) === pathname));
        router.push(order[(i + (e.key === "ArrowRight" ? 1 : -1) + order.length) % order.length]!);
      } else if (e.key.toLowerCase() === "w") {
        const cur = tabs.find((x) => isActive(x.href));
        if (cur && !cur.pinned) { e.preventDefault(); closeSet([cur]); }
      } else if (e.key.toLowerCase() === "t") { e.preventDefault(); reopen(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, pathname, tabs, closed, dirty]);

  const target = menu ? tabs.find((x) => x.href === menu.href) : undefined;
  const itemCls = "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[0.9286rem] hover:bg-surface-2 disabled:text-faint disabled:hover:bg-transparent";

  return (
    <div ref={strip} className="relative flex w-full max-w-full min-w-0 items-end gap-0.5 overflow-x-auto border-b border-border-strong bg-surface-2 px-2 pt-1.5 print:hidden" role="tablist" aria-label={t("menu.openScreens")} title={t("ws.nextPrev")}>
      <Link href={HOME} role="tab" aria-selected={pathname === HOME}
        className={clsx("flex shrink-0 items-center gap-1.5 rounded-t-md border border-b-0 px-3 py-1.5 text-[0.9286rem] font-semibold", pathname === HOME ? "border-border-strong bg-bg text-text" : "border-transparent text-muted hover:bg-surface hover:text-text")}>
        <Home className="size-4 text-[#ea580c]" aria-hidden />{t("menu.home")}
      </Link>
      {tabs.map((x) => {
        const unsaved = dirty[pathOf(x.href)];
        return (
          <div key={x.href} role="tab" aria-selected={isActive(x.href)}
            onContextMenu={(e) => { e.preventDefault(); setMenu({ href: x.href, x: e.clientX, y: e.clientY }); }}
            className={clsx("group flex max-w-60 shrink-0 items-center gap-1 rounded-t-md border border-b-0 pr-1 pl-2.5 text-[0.9286rem]",
              isActive(x.href) ? "border-border-strong bg-bg font-semibold text-text" : "border-transparent text-muted hover:bg-surface hover:text-text")}>
            {x.pinned ? <Pin className="size-3 shrink-0 text-primary" aria-label={t("ws.pinned")} /> : null}
            <Link href={x.href} className="truncate py-1.5" title={x.title}
              onKeyDown={(e) => { if (e.key === "ContextMenu" || (e.shiftKey && e.key === "F10")) { e.preventDefault(); const r = e.currentTarget.getBoundingClientRect(); setMenu({ href: x.href, x: r.left, y: r.bottom }); } }}>
              {x.title}
            </Link>
            {unsaved ? <span className="size-2 shrink-0 rounded-full bg-accent" role="img" aria-label={t("ws.unsaved")} title={t("ws.unsaved")} /> : null}
            <button type="button" onClick={() => togglePin(x.href)} title={x.pinned ? t("ws.unpin") : t("ws.pin")}
              className={clsx("rounded p-0.5 text-faint hover:bg-surface-2 hover:text-text focus-visible:opacity-100", x.pinned ? "hidden" : "opacity-0 group-hover:opacity-100")}>
              <Pin className="size-3" aria-hidden /><span className="sr-only">{t("ws.pin")}</span>
            </button>
            {x.pinned ? null : (
              <button type="button" onClick={() => close(x.href)} className="rounded p-0.5 text-faint hover:bg-surface-2 hover:text-danger" title={t("ws.close")}>
                <X className="size-3.5" aria-hidden /><span className="sr-only">{t("ws.close")}</span>
              </button>
            )}
          </div>
        );
      })}
      {menu && target ? (
        <ul ref={menuEl} role="menu" aria-label={t("ws.actions")} style={{ left: Math.min(menu.x, window.innerWidth - 240), top: menu.y + 4 }}
          className="fixed z-50 w-56 rounded-lg border border-border-strong bg-surface p-1 shadow-card" onMouseDown={(e) => e.stopPropagation()}>
          <li role="none"><button role="menuitem" className={itemCls} onClick={() => { togglePin(target.href); setMenu(null); }}>
            {target.pinned ? <PinOff className="size-4 text-muted" aria-hidden /> : <Pin className="size-4 text-muted" aria-hidden />}{target.pinned ? t("ws.unpin") : t("ws.pin")}</button></li>
          <li role="none"><button role="menuitem" className={itemCls} disabled={target.pinned} onClick={() => { close(target.href); setMenu(null); }}><X className="size-4 text-muted" aria-hidden />{t("ws.close")}</button></li>
          <li role="none"><button role="menuitem" className={itemCls} disabled={tabs.filter((x) => x.href !== target.href && !x.pinned).length === 0}
            onClick={() => { closeSet(tabs.filter((x) => x.href !== target.href && !x.pinned)); setMenu(null); }}>{t("ws.closeOthers")}</button></li>
          <li role="none"><button role="menuitem" className={itemCls} disabled={tabs.every((x) => x.pinned)} onClick={() => { closeSet(tabs.filter((x) => !x.pinned)); setMenu(null); }}>{t("ws.closeUnpinned")}</button></li>
          <li role="none" className="mt-1 border-t border-border pt-1"><button role="menuitem" className={itemCls} disabled={!closed.length} onClick={() => { reopen(); setMenu(null); }}>{closed.length ? t("ws.reopen") : t("ws.none")}</button></li>
        </ul>
      ) : null}
    </div>
  );
}
