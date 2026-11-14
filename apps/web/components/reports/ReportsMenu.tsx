"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { activeEntry, REPORTS_MENU } from "@/lib/reports-menu";

/** The report list on the left of every Reports screen: grey group headings, the open report marked with a bar. */
export function ReportsMenu({ allowed }: { allowed: string[] }) {
  const t = useTranslations("reportsMenu");
  const path = usePathname();
  const params = useSearchParams();
  const open = activeEntry(path, params);
  const ok = new Set(allowed);

  return (
    <nav aria-label={t("title")} className="print:hidden lg:sticky lg:top-16 lg:max-h-[calc(100dvh-5rem)] lg:overflow-y-auto">
      {REPORTS_MENU.map((g) => {
        const items = g.items.filter((e) => ok.has(e.href));
        if (!items.length) return null;
        return (
          <section key={g.key} className="mb-1">
            <h2 className="bg-surface-2 px-3 py-2 text-[0.8125rem] text-muted">{t(`g.${g.key}`)}</h2>
            <ul>
              {items.map((e) => {
                const current = open === e;
                return (
                  <li key={e.href}>
                    <Link href={e.href} aria-current={current ? "page" : undefined}
                      className={clsx("block border-l-[3px] px-3 py-2 text-sm hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-primary", current ? "border-primary bg-surface-2 font-medium text-text" : "border-transparent text-text/90")}>
                      {t(`i.${e.key}`)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </nav>
  );
}
