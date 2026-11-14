"use client";

import { History, Settings2, Star } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { DEFAULT_MENU, TileIcon, useActions } from "./actions";
import { readRecent, type RecentPage } from "./recent";

/**
 * The top of Home: the screens this person pinned (a star in any menu panel pins one) and the pages they opened lately
 * on this device. Everything here is one click from a screen they already use.
 */
export function HomeShortcuts({ permissions, menu }: { permissions: string[]; menu: string[] | null }) {
  const t = useTranslations("home");
  const actions = useActions(permissions);
  const [recent, setRecent] = useState<RecentPage[]>([]);
  useEffect(() => { setRecent(readRecent()); }, []);
  const tiles = (menu ?? DEFAULT_MENU).map((h) => actions.find((a) => a.href === h)).filter((a): a is NonNullable<typeof a> => !!a);

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <section aria-labelledby="home-shortcuts" className="rounded-xl border border-border/80 bg-surface p-4">
        <div className="mb-3 flex items-center gap-2">
          <h2 id="home-shortcuts" className="flex items-center gap-2 text-[0.9375rem] font-semibold"><Star className="size-4 text-accent" aria-hidden />{t("shortcuts")}</h2>
          <Link href="/my-menu" className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-[0.8571rem] font-medium text-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-primary">
            <Settings2 className="size-3.5" aria-hidden />{t("manage")}
          </Link>
        </div>
        {tiles.length ? (
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 2xl:grid-cols-4">
            {tiles.slice(0, 12).map((a) => (
              <li key={a.href}>
                <Link href={a.href} className="flex h-full min-h-14 items-center gap-2.5 rounded-lg border border-border bg-surface-3 px-2.5 py-2 hover:border-primary/50 hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-primary">
                  <TileIcon action={a} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.9286rem] leading-tight font-medium">{a.label}</span>
                    <span className="block truncate text-[0.8571rem] text-muted">{a.group}</span>
                  </span>
                  {a.shortcut ? <kbd>{a.shortcut}</kbd> : null}
                </Link>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted">{t("noShortcuts")}</p>}
      </section>

      <section aria-labelledby="home-recent" className="rounded-xl border border-border/80 bg-surface p-4">
        <h2 id="home-recent" className="mb-3 flex items-center gap-2 text-[0.9375rem] font-semibold"><History className="size-4 text-primary" aria-hidden />{t("continue")}</h2>
        {recent.length ? (
          <ul className="flex flex-col">
            {recent.slice(0, 6).map((r) => (
              <li key={r.href} className="border-b border-rule last:border-0">
                <Link href={r.href} className="-mx-2 block truncate rounded-md px-2 py-2 text-[0.9286rem] hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-primary">{r.title}</Link>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted">{t("noRecent")}</p>}
      </section>
    </div>
  );
}
