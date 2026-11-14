"use client";

import clsx from "clsx";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { SETTINGS_TABS, tabOfPath } from "@/lib/settings-tabs";

export interface RailHit { href: string; label: string; tab: string }

/** The tabs of the Settings screen down the left, a search box above them, and the open tab as a pill that runs into the page. */
export function SettingsRail({ hits }: { hits: RailHit[] }) {
  const t = useTranslations("settingsUi");
  const path = usePathname();
  const open = tabOfPath(path);
  const [q, setQ] = useState("");
  const found = q.trim() ? hits.filter((h) => h.label.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 12) : [];

  return (
    <nav aria-label={t("title")} className="rounded-lg bg-[#1b2440] py-3 text-white print:hidden lg:sticky lg:top-16">
      <div className="flex items-center justify-between px-4 pb-3">
        <h2 className="text-[1.25rem] font-semibold">{t("title")}</h2>
      </div>
      <label className="mx-3 mb-3 flex h-9 items-center gap-2 rounded-md bg-white/10 px-2.5 text-sm focus-within:bg-white/15">
        <Search className="size-4 shrink-0 text-white/70" aria-hidden />
        <span className="sr-only">{t("search")}</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder={t("search")} autoComplete="off" className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/50" />
      </label>
      {q.trim() ? (
        <ul className="px-2 pb-1">
          {found.map((h) => (
            <li key={`${h.tab}-${h.href}`}>
              <Link href={h.href} className="block rounded px-3 py-2 text-sm hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white">
                {h.label}<span className="block text-xs text-white/60">{t(`tab.${h.tab}`)}</span>
              </Link>
            </li>
          ))}
          {!found.length ? <li className="px-3 py-2 text-sm text-white/70">{t("noMatch")}</li> : null}
        </ul>
      ) : (
        <ul>
          {SETTINGS_TABS.map((tab) => {
            const current = open === tab.key;
            return (
              <li key={tab.key}>
                <Link href={`/settings/${tab.key}`} aria-current={current ? "page" : undefined}
                  className={clsx("block py-3 pr-3 pl-4 text-[0.8571rem] font-bold tracking-wide uppercase focus-visible:outline-2 focus-visible:outline-white", current ? "ml-1.5 rounded-l-md bg-surface text-text" : "text-white/90 hover:bg-white/10")}>
                  {t(`tab.${tab.key}`)}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}
