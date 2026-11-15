"use client";

import clsx from "clsx";
import { ChevronRight, LogOut, Menu, Plus, Search, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { BusinessSwitcher } from "./BusinessSwitcher";
import { GoTo, type GoToItem } from "./GoTo";
import { LanguageSwitch } from "./LanguageSwitch";
import { LockScreen } from "./LockScreen";
import { PasscodeDialog } from "./PasscodeDialog";
import { StepUpDialog } from "./StepUpDialog";
import { WorkingDateControl } from "./WorkingDate";
import { ThemeSwitch } from "./ThemeSwitch";
import { MobileNav } from "./MobileNav";
import { PhoneTables } from "./PhoneTables";
import { TabStrip } from "./TabStrip";
import { noteVisit } from "./launcher/recent";
import { MENU_LINKS, menuLabelText } from "@/lib/menu";
import { ALL_HREFS, CREATE, SECTIONS } from "@/lib/nav";
import { MODULE_TABS, REPORT_GROUP, groupLabel, moduleTitle, tidyLabel } from "@/lib/modules-nav";
import { ModuleFlyout } from "./nav/ModuleFlyout";
import { ModuleRail } from "./nav/ModuleRail";
import { usePins } from "./nav/usePins";

/** Indian financial year (April to March) for a date, e.g. "2026-27". */
const fiscalYear = (d: Date) => {
  const y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  return `${y}-${String((y + 1) % 100).padStart(2, "0")}`;
};

export interface ShellProps {
  userName: string;
  tenantId: string | null;
  tenants: { tenantId: string; name: string; role: string }[];
  permissions: string[];
  children: React.ReactNode;
}

/**
 * The application frame: a compact light action bar, a persistent dark feature rail, and a light work area.
 * Navigation stays permission-filtered; the rail folds on desktop and the thumb navigation remains on phones.
 */
export function Shell({ userName, tenantId, tenants, permissions, children }: ShellProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const [drawer, setDrawer] = useState(false);
  const [goTo, setGoTo] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedModule, setSelectedModule] = useState("workspace");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [menuFocus, setMenuFocus] = useState<string | undefined>(undefined);
  const railButtons = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pinsWanted, setPinsWanted] = useState(false);
  const pins = usePins(pinsWanted);
  const [today, setToday] = useState<Date | null>(null);
  const createRef = useRef<HTMLDivElement>(null);
  const allowed = (i: { permission?: string }) => !i.permission || permissions.includes(i.permission);

  // The date is read on the client so it is the user's own day.
  useEffect(() => {
    setToday(new Date());
  }, []);

  useEffect(() => {
    if (!creating) return;
    const close = (e: MouseEvent) => { if (!createRef.current?.contains(e.target as Node)) setCreating(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setCreating(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [creating]);
  // F2 opens search too (the design's omni-search key), outside text fields.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = !!el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));
      if (e.key === "F2" && !typing && !e.defaultPrevented) { e.preventDefault(); setGoTo(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The section panel closes on Esc (focus goes back to its rail button) and whenever the page changes.
  const closeMenu = (restoreFocus = false) => {
    const was = menuOpen;
    setMenuOpen(null);
    setMenuFocus(undefined);
    if (restoreFocus && was) requestAnimationFrame(() => railButtons.current[was]?.focus());
  };
  useEffect(() => {
    if (!menuOpen) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { e.preventDefault(); closeMenu(true); } };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);
  useEffect(() => { setMenuOpen(null); setMenuFocus(undefined); }, [pathname]);

  // Remember the page for My Menu's "recently opened", once its title is set.
  useEffect(() => {
    const id = setTimeout(() => noteVisit(pathname, document.title.replace(/ · Varchasv.*$/, "").trim()), 600);
    return () => clearTimeout(id);
  }, [pathname]);

  const creatable = CREATE.filter(allowed);

  const goToItems = useMemo<GoToItem[]>(() => [
    ...MENU_LINKS.filter((x) => allowed(x) && !ALL_HREFS.includes(x.href!) && !CREATE.some((c) => c.href === x.href)).map((x) => ({
      href: x.href!, label: menuLabelText(x.label, t), group: t(`menu.h.${x.heading}`), icon: x.icon,
    })),
    ...creatable.map((c) => ({ href: c.href, label: c.label(t), group: t("shell.entries"), icon: c.icon, key: c.key })),
    ...SECTIONS.flatMap((s) => s.items.filter((i) => allowed(i) && !i.phase).map((i) => ({
      href: i.href, label: t(`nav.${i.key}`), group: t(`nav.${s.title}`), icon: i.icon,
    }))),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [permissions, t]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const columnTitle = (tab: string, column: string) => groupLabel(t, tab, column);
  const activeModule = (tab: typeof MODULE_TABS[number]) => tab.columns.some((column) => column.items.some((item) => {
    if (!item.href) return false;
    const route = item.href.split("?")[0]!;
    return pathname === route || pathname.startsWith(`${route}/`);
  }));

  const routeModule = MODULE_TABS.find(activeModule)?.key ?? "workspace";
  useEffect(() => setSelectedModule(routeModule), [routeModule]);
  const chosenModule = MODULE_TABS.find((tab) => tab.key === selectedModule) ?? MODULE_TABS[0]!;
  const visibleModules = MODULE_TABS.filter((tab) => tab.columns.some((column) => column.items.some(allowed)));
  const primaryNav = (
    <nav aria-label={t("shell.menu")} className="flex h-full min-h-0 flex-col bg-rail text-rail-text">
      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        {visibleModules.map((tab) => {
          const selected = selectedModule === tab.key;
          const current = activeModule(tab);
          const choose = () => {
            setSelectedModule(tab.key);
            if (tab.key === "workspace") router.push("/dashboard");
          };
          return <button key={tab.key} type="button" onClick={choose} aria-current={current ? "page" : undefined}
            className={clsx("mb-1 flex w-full items-center gap-3 rounded-md border-l-[3px] px-3 py-2.5 text-left text-[0.9rem] transition-colors", selected ? "border-primary bg-rail-active font-semibold text-rail-text" : "border-transparent text-rail-text/90 hover:bg-rail-hover")}>
            <tab.icon className={clsx("size-[1.15rem] shrink-0", selected ? "text-rail-text" : "text-rail-muted")} aria-hidden />
            <span className="min-w-0 flex-1 truncate">{moduleTitle(tab.key)}</span>
            <ChevronRight className="size-3.5 shrink-0 text-rail-muted" aria-hidden />
          </button>;
        })}
      </div>
      <div className="flex flex-col gap-1.5 border-t border-white/10 px-3 py-2.5"><LanguageSwitch signedIn variant="rail" /><ThemeSwitch variant="rail" /></div>
    </nav>
  );
  const featureNav = (
    <nav aria-label={`${moduleTitle(chosenModule.key)} features`} className="h-full min-h-0 overflow-y-auto border-r border-border bg-[#f8f8fa] text-[#182238]">
      <div className="flex min-h-14 items-center border-b border-border bg-[#edf7f6] px-3 text-[0.82rem] font-medium text-[#637082]">{moduleTitle(chosenModule.key)}</div>
      <div className="pb-6">
        {chosenModule.columns.map((column) => {
          const items = column.items.filter(allowed);
          if (!items.length) return null;
          return <section key={column.key}>
            <h2 className="sticky top-0 z-10 border-b border-white/60 bg-[#edf7f6] px-3 py-3 text-[0.8rem] font-medium text-[#637082]">{columnTitle(chosenModule.key, column.key)}</h2>
            <ul>{items.map((item) => {
              const label = tidyLabel(menuLabelText(item.label, t));
              const active = item.href ? pathname === item.href.split("?")[0] : false;
              const className = clsx("flex min-h-10 items-center gap-2 border-l-[3px] px-3 py-2 text-[0.84rem] leading-5 transition-colors", active ? "border-sky-600 bg-[#e4e5e9] font-semibold text-[#15233a]" : item.soon ? "border-transparent text-[#8d96a4]" : "border-transparent text-[#172640] hover:bg-[#eceef2]");
              return <li key={`${item.href ?? "soon"}-${item.label}`}>
                {item.href && !item.soon ? <Link href={item.href} onClick={() => setDrawer(false)} aria-current={active ? "page" : undefined} className={className}><span className="min-w-0 flex-1">{label}</span></Link>
                  : <span aria-disabled="true" title={`${label} · ${t("menu.soon")}`} className={className}><span className="min-w-0 flex-1">{label}</span><span className="text-[0.62rem] font-bold uppercase tracking-wide text-[#8791a1]">{t("menu.soon")}</span></span>}
              </li>;
            })}</ul>
          </section>;
        })}
      </div>
    </nav>
  );

  const shellButton = "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-[0.9rem] text-muted hover:bg-surface-2 hover:text-text";

  return (
    <div className="min-h-dvh bg-bg text-text">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-surface/95 px-3 shadow-raised backdrop-blur-xl sm:gap-3 sm:px-4 print:hidden">
        <button onClick={() => setDrawer(true)} className="rounded-md p-1.5 text-muted hover:bg-surface-2 lg:hidden" aria-label={t("shell.menu")}>
          <Menu className="size-5" />
        </button>
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2.5 pr-1">
          <span aria-hidden className="grid size-8 place-items-center rounded-lg bg-primary text-[1rem] font-bold text-on-primary shadow-raised">V</span>
          <span className="hidden leading-tight xl:block">
            <span className="block text-[0.9286rem] font-bold text-text">{t("brand.full")}</span>
          </span>
        </Link>
        <div className="hidden h-7 w-px bg-border md:block" />
        <div className="min-w-0 max-w-[9.5rem] flex-1 md:w-44 md:max-w-none md:flex-none lg:w-44 xl:w-56"><BusinessSwitcher current={tenantId} tenants={tenants} /></div>
        {today ? <span className="hidden shrink-0 rounded-md bg-surface-2 px-2.5 py-1.5 text-[0.82rem] font-semibold text-muted 2xl:inline">{t("shell.fy", { years: fiscalYear(today) })}</span> : null}
        <button type="button" onClick={() => setGoTo(true)}
          className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-border-input bg-surface text-[0.9rem] text-muted shadow-inset hover:border-primary/45 sm:h-9 sm:min-w-0 sm:flex-1 sm:max-w-80 sm:justify-start sm:px-2.5 lg:ml-2 lg:w-[16rem] lg:max-w-none lg:flex-none xl:w-[17rem] 2xl:w-[26rem]">
          <Search className="size-4 shrink-0" aria-hidden />
          <span className="sr-only truncate sm:not-sr-only sm:flex-1 sm:text-left">{t("shell.goTo")}</span>
          <span className="hidden shrink-0 gap-1 sm:flex"><kbd>Ctrl K</kbd><kbd>F2</kbd></span>
        </button>
        <div className="flex-1 max-lg:hidden" />
        {creatable.length ? (
          <div ref={createRef} className="relative shrink-0">
            <button type="button" onClick={() => setCreating((c) => !c)} aria-expanded={creating} aria-haspopup="menu"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-[0.9rem] font-semibold text-on-primary shadow-raised hover:bg-primary-hover">
              <Plus className="size-4" aria-hidden /><span>{t("shell.create")}</span>
            </button>
            {creating ? (
              <ul role="menu" className="absolute right-0 top-full z-40 mt-1.5 w-72 rounded-lg border border-border-strong bg-surface p-1 text-text shadow-card motion-safe:animate-[rise_120ms_ease-out]">
                {creatable.map((c) => (
                  <li key={c.href} role="none">
                    <Link role="menuitem" href={c.href} onClick={() => setCreating(false)} className="flex items-center gap-3 rounded-md px-2.5 py-2 text-[0.9286rem] hover:bg-surface-2">
                      <c.icon className="size-4 text-muted" aria-hidden />
                      <span className="flex-1">{c.label(t)}</span>
                      {c.key ? <kbd>{c.key}</kbd> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
        <div className="flex items-center gap-1 max-lg:hidden"><LanguageSwitch signedIn /><ThemeSwitch /></div>
        <Link href="/assistant" className={clsx(shellButton, "max-sm:hidden")} title={t("nav.assistant")}>
          <Sparkles className="size-4" aria-hidden /><span className="hidden xl:inline">{t("nav.assistant")}</span>
        </Link>
        <Link href="/account" title={t("account.title")} className={clsx(shellButton, "pl-1.5")}>
          <span className="grid size-7 place-items-center rounded-full bg-primary-soft text-[0.8571rem] font-bold text-primary">{userName.charAt(0).toUpperCase()}</span>
          <span className="hidden max-w-36 truncate xl:inline">{userName}</span>
        </Link>
        <StepUpDialog />
        <PasscodeDialog />
        <WorkingDateControl className={clsx(shellButton, "px-2 max-lg:hidden")} />
        <LockScreen className={clsx(shellButton, "px-2 max-lg:hidden")} onSignOut={logout} />
        <button onClick={logout} title={t("auth.logout")} className={clsx(shellButton, "px-2 max-md:hidden")}>
          <LogOut className="size-4" aria-hidden /><span className="sr-only">{t("auth.logout")}</span>
        </button>
      </header>

      <div className="flex min-h-[calc(100dvh-3.5rem)]">

        {drawer ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-[rgb(11_22_38/0.5)]" onClick={() => setDrawer(false)} />
            <aside className="absolute inset-y-0 left-0 flex w-[min(92vw,38rem)] max-w-[92vw] flex-col overflow-hidden bg-surface shadow-overlay">
              <div className="flex items-center gap-2 border-b border-white/10 p-3">
                <div className="min-w-0 flex-1"><BusinessSwitcher current={tenantId} tenants={tenants} tone="shell" /></div>
                <button onClick={() => setDrawer(false)} className="rounded-md p-1.5 text-rail-muted hover:bg-rail-hover" aria-label={t("common.close")}>
                  <X className="size-5" />
                </button>
              </div>
              <div className="grid min-h-0 flex-1 grid-cols-[42%_58%]">
                <div className="min-h-0">{primaryNav}</div>
                <div className="min-h-0">{featureNav}</div>
              </div>
            </aside>
          </div>
        ) : null}

        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-[5.5rem] shrink-0 self-start print:hidden lg:block">
          <ModuleRail tabs={visibleModules} openKey={menuOpen} currentKey={routeModule} registerButton={(key, el) => { railButtons.current[key] = el; }}
            onPress={(key) => { setPinsWanted(true); if (key === "workspace") { closeMenu(); router.push("/dashboard"); } else if (menuOpen === key) closeMenu(true); else { setMenuFocus(undefined); setMenuOpen(key); } }}
            onHover={(key) => { setMenuFocus(undefined); setMenuOpen(key); }} />
        </aside>
        {menuOpen ? (() => {
          const tab = MODULE_TABS.find((x) => x.key === menuOpen);
          return tab ? <ModuleFlyout key={tab.key} tab={tab} pathname={pathname} permissions={permissions} pins={pins} focusGroup={menuFocus} onClose={() => closeMenu(true)}
            onSearchEverywhere={() => setGoTo(true)} onOpenReports={() => { setMenuFocus(REPORT_GROUP[tab.key]); setMenuOpen("reports"); }} /> : null;
        })() : null}
        <div className="min-w-0 flex-1">
          <div className="sticky top-14 z-20 w-full max-w-full overflow-x-clip border-b border-border bg-surface/90 backdrop-blur-xl lg:hidden print:hidden">
            <Suspense fallback={null}><TabStrip scope={tenantId ?? "default"} /></Suspense>
          </div>
          <div className="sticky top-14 z-20 hidden w-full max-w-full overflow-x-clip border-b border-border bg-surface/90 backdrop-blur-xl print:hidden lg:block">
            <Suspense fallback={null}><TabStrip scope={tenantId ?? "default"} /></Suspense>
          </div>
          <main className="mx-auto w-full max-w-[1680px] min-w-0 px-3 py-4 max-lg:pb-[calc(5rem+env(safe-area-inset-bottom))] sm:px-5 lg:px-6 lg:py-5">{children}</main>
        </div>
        <PhoneTables />
        <MobileNav permissions={permissions} onExit={logout} userName={userName} />
      </div>
      <GoTo items={goToItems} open={goTo} onOpenChange={setGoTo} />
    </div>
  );
}
