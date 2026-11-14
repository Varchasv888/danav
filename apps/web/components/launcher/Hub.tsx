"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { TileIcon, useActions } from "./actions";

/**
 * A hub: the screens of one area (reports, masters) in labelled groups of tiles. Every tile opens an
 * existing screen; the user sees only what their role allows.
 */
export function Hub({ permissions, groups }: { permissions: string[]; groups: { key: string; hrefs: string[] }[] }) {
  const t = useTranslations("hub");
  const actions = useActions(permissions);
  const shown = groups.map((g) => ({ ...g, items: g.hrefs.map((h) => actions.find((a) => a.href === h)).filter((a): a is NonNullable<typeof a> => !!a) })).filter((g) => g.items.length);
  return (
    <div className="flex flex-col gap-6">
      {shown.map((g) => (
        <section key={g.key} aria-labelledby={`hub-${g.key}`}>
          <div className="mb-2.5 flex items-baseline gap-3">
            <h2 id={`hub-${g.key}`} className="text-[1rem] font-semibold">{t(`groups.${g.key}`)}</h2>
            <p className="text-[0.8571rem] text-muted">{t(`about.${g.key}`)}</p>
          </div>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {g.items.map((a) => (
              <li key={a.href}>
                <Link href={a.href} className="flex h-full items-center gap-3 rounded-lg border border-border bg-surface p-3 hover:border-primary/50 hover:bg-surface-3">
                  <TileIcon action={a} size="sm" />
                  <span className="min-w-0 flex-1 text-[0.9286rem] leading-snug font-medium">{a.label}</span>
                  {a.shortcut ? <kbd>{a.shortcut}</kbd> : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
