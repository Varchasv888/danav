"use client";

import clsx from "clsx";
import { ChevronDown, Home, LayoutGrid, LogOut, MoreHorizontal, Search, Store, Wallet, Warehouse, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { MODULE_TABS, groupLabel, moduleTitle, tidyLabel, type ModItem } from "@/lib/modules-nav";
import { menuLabelText } from "@/lib/menu";
import { LanguageSwitch } from "./LanguageSwitch";
import { ThemeSwitch } from "./ThemeSwitch";

/**
 * The phone's navigation: a bar of five at the thumb (Home, Sell, Stock, Money, More) in place of the module row and
 * workspace tabs, which need a wide screen. Each of the three modules opens a sheet of its screens in groups; More opens
 * every other module, the account controls and sign out. Every row is 44px tall and a link, so nothing depends on hover.
 */
const BAR: { key: string; tab?: string; icon: typeof Home }[] = [
  { key: "home", icon: Home }, { key: "sell", tab: "sales", icon: Store }, { key: "stock", tab: "inventory", icon: Warehouse }, { key: "money", tab: "accounting", icon: Wallet },
];

export function MobileNav({ permissions, onExit, userName }: { permissions: string[]; onExit: () => void; userName: string }) {
  const t = useTranslations();
  const pathname = usePathname();
  const [sheet, setSheet] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [openMod, setOpenMod] = useState<string | null>(null);
  const allowed = (p?: string) => !p || permissions.includes(p);

  const tabs = useMemo(() => MODULE_TABS.map((tab) => ({ ...tab, columns: tab.columns.map((c) => ({ ...c, items: c.items.filter((i) => allowed(i.permission)) })).filter((c) => c.items.length) })).filter((tab) => tab.columns.length),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [permissions]);
  useEffect(() => { setSheet(null); setQ(""); }, [pathname]);
  useEffect(() => {
    if (!sheet) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setSheet(null); };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [sheet]);

  const active = (tab?: string) => (tab ? tabs.find((x) => x.key === tab)?.columns.some((c) => c.items.some((i) => i.href && (pathname === i.href || pathname.startsWith(`${i.href}/`)))) : pathname === "/dashboard");
  const s = q.trim().toLowerCase();
  const row = (i: ModItem) => {
    const body = (
      <>
        <i.icon className="size-[1.15rem] shrink-0 text-muted" aria-hidden />
        <span className="flex-1 truncate">{tidyLabel(menuLabelText(i.label, t))}</span>
        {i.soon ? <span className="rounded-[3px] bg-surface-2 px-1 text-[0.6429rem] font-bold text-faint uppercase">{t("menu.soon")}</span> : null}
      </>
    );
    const cls = "flex min-h-11 items-center gap-3 rounded-md px-3 text-[1rem]";
    return i.href && !i.soon
      ? <Link key={i.href + i.label} href={i.href} title={tidyLabel(menuLabelText(i.label, t))} aria-current={pathname === i.href ? "page" : undefined} className={clsx(cls, "text-text active:bg-primary-soft", pathname === i.href && "bg-primary-soft font-medium")}>{body}</Link>
      : <span key={i.label} title={`${tidyLabel(menuLabelText(i.label, t))} · ${t("menu.soon")}`} aria-disabled="true" className={clsx(cls, "text-faint")}>{body}</span>;
  };
  const groups = (key: string) => (tabs.find((x) => x.key === key)?.columns ?? [])
    .map((c) => ({ ...c, items: c.items.filter((i) => !s || tidyLabel(menuLabelText(i.label, t)).toLowerCase().includes(s)) })).filter((c) => c.items.length);
  const bar = BAR.filter((b) => !b.tab || tabs.some((x) => x.key === b.tab));
  const others = tabs.filter((x) => !BAR.some((b) => b.tab === x.key));
  const title = sheet === "more" ? t("mobile.more") : sheet ? moduleTitle(sheet) : "";
  const columnTitle = (tab: string, column: string) => groupLabel(t, tab, column);
  const barBtn = "flex h-14 flex-col items-center justify-center gap-0.5 text-[0.7857rem] font-medium";

  return (
    <div className="lg:hidden print:hidden">
      <nav aria-label={t("mobile.nav")} className="fixed inset-x-0 bottom-0 z-40 grid border-t border-border-strong bg-surface pb-[env(safe-area-inset-bottom)]" style={{ gridTemplateColumns: `repeat(${bar.length + 1}, minmax(0, 1fr))` }}>
        {bar.map((b) => b.tab ? (
          <button key={b.key} type="button" aria-expanded={sheet === b.tab} onClick={() => { setSheet(sheet === b.tab ? null : b.tab!); setQ(""); }}
            className={clsx(barBtn, active(b.tab) || sheet === b.tab ? "text-primary" : "text-muted")}>
            <b.icon className="size-[1.3rem]" aria-hidden />{t(`mobile.${b.key}`)}
          </button>
        ) : (
          <Link key={b.key} href="/dashboard" aria-current={active() ? "page" : undefined} className={clsx(barBtn, active() ? "text-primary" : "text-muted")}>
            <b.icon className="size-[1.3rem]" aria-hidden />{t(`mobile.${b.key}`)}
          </Link>
        ))}
        <button type="button" aria-expanded={sheet === "more"} onClick={() => { setSheet(sheet === "more" ? null : "more"); setQ(""); }} className={clsx(barBtn, sheet === "more" ? "text-primary" : "text-muted")}>
          <MoreHorizontal className="size-[1.3rem]" aria-hidden />{t("mobile.more")}
        </button>
      </nav>

      {sheet ? (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label={title}>
          <button type="button" aria-label={t("common.close")} className="absolute inset-0 bg-[rgb(11_22_38/0.5)]" onClick={() => setSheet(null)} />
          <div className="relative flex max-h-[88dvh] flex-col rounded-t-xl border-t border-border-strong bg-surface shadow-overlay">
            <div className="flex items-center gap-2 border-b border-border px-4 py-1.5">
              <h2 className="flex-1 text-[1.0714rem] font-semibold">{title}</h2>
              <button type="button" onClick={() => setSheet(null)} className="grid size-11 place-items-center rounded-md text-muted active:bg-surface-2" aria-label={t("common.close")}><X className="size-5" aria-hidden /></button>
            </div>
            {sheet !== "more" ? (
              <label className="relative mx-4 mt-3 block">
                <span className="sr-only">{t("menu.filter")}</span>
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" aria-hidden />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("menu.filter")} type="search" className="h-11 w-full rounded-md border border-border-input bg-surface pr-3 pl-9 text-[1rem] text-text placeholder:text-faint focus:border-ring focus:outline-none" />
              </label>
            ) : null}
            <div className="min-h-0 flex-1 overflow-y-auto px-2 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {sheet !== "more" ? (
                <>
                  {groups(sheet).map((g) => (
                    <section key={g.key} aria-label={columnTitle(sheet, g.key)} className="mb-2">
                      <h3 className="px-3 pt-2 pb-1 text-[0.8571rem] font-semibold text-muted">{columnTitle(sheet, g.key)}</h3>
                      {g.items.map(row)}
                    </section>
                  ))}
                  {!groups(sheet).length ? <p className="px-3 py-6 text-[0.9286rem] text-muted">{t("launcher.noMatch")}</p> : null}
                </>
              ) : (
                <>
                  <Link href="/launcher" className="flex min-h-11 items-center gap-3 rounded-md px-3 text-[1rem] text-text active:bg-primary-soft"><LayoutGrid className="size-[1.15rem] text-muted" aria-hidden />{t("nav.allActions")}</Link>
                  {others.map((m) => (
                    <section key={m.key}>
                      <button type="button" aria-expanded={openMod === m.key} onClick={() => setOpenMod(openMod === m.key ? null : m.key)} className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left text-[1rem] text-text active:bg-surface-2">
                        <m.icon className="size-[1.15rem] text-muted" aria-hidden /><span className="flex-1">{moduleTitle(m.key)}</span>
                        <ChevronDown className={clsx("size-4 text-faint transition-transform", openMod === m.key && "rotate-180")} aria-hidden />
                      </button>
                      {openMod === m.key ? <div className="mb-1 ml-3 border-l border-border pl-1">{m.columns.flatMap((c) => c.items).map(row)}</div> : null}
                    </section>
                  ))}
                  <div className="mt-3 border-t border-border px-3 pt-3">
                    <p className="mb-2 text-[0.8571rem] text-muted">{userName}</p>
                    <div className="flex items-center gap-3"><ThemeSwitch /><LanguageSwitch signedIn /></div>
                    <Link href="/account" className="mt-2 flex min-h-11 items-center rounded-md text-[1rem] text-text">{t("account.title")}</Link>
                    <button type="button" onClick={onExit} className="flex min-h-11 w-full items-center gap-3 rounded-md text-left text-[1rem] text-text"><LogOut className="size-[1.15rem] text-muted" aria-hidden />{t("auth.logout")}</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
