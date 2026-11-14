"use client";

import { ArrowLeft, ArrowRight, Check, History, Pencil, Plus, RotateCcw, X, Zap } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import { Button } from "../ui";
import { DEFAULT_MENU, TileIcon, useActions } from "./actions";
import { readRecent, type RecentPage } from "./recent";

/**
 * Each user's launchpad: compact cards with the screen's name, its section and its function key, in the
 * order the user chose. Edit mode removes and reorders them; the launcher adds more. Under it, the pages
 * this user opened lately on this device.
 */
export function MyMenu({ permissions, menu }: { permissions: string[]; menu: string[] | null }) {
  const t = useTranslations("launcher");
  const actions = useActions(permissions);
  const [items, setItems] = useState<string[]>(menu ?? DEFAULT_MENU);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(false);
  const [recent, setRecent] = useState<RecentPage[]>([]);
  useEffect(() => { setRecent(readRecent()); }, []);
  const tiles = items.map((h) => actions.find((a) => a.href === h)).filter((a): a is NonNullable<typeof a> => !!a);

  const save = async (next: string[] | null) => {
    const before = items;
    setItems(next ?? DEFAULT_MENU);
    setError(false);
    try { await api("/me/menu", { method: "PUT", body: { items: next } }); } catch { setItems(before); setError(true); }
  };
  const move = (href: string, by: number) => {
    const i = items.indexOf(href);
    const j = i + by;
    if (i < 0 || j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j]!, next[i]!];
    void save(next);
  };

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-lg border border-border bg-surface p-4" aria-labelledby="mm-launch">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2 id="mm-launch" className="flex items-center gap-2 text-[1rem] font-semibold"><Zap className="size-4 text-primary" aria-hidden />{t("launchpad")}</h2>
          <span className="text-[0.8571rem] text-muted">{t("pinned", { n: tiles.length })}</span>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {error ? <span className="text-sm text-danger">{t("saveFailed")}</span> : null}
            {editing ? <Button variant="ghost" onClick={() => save(null)} className="h-8"><RotateCcw className="size-4" aria-hidden />{t("reset")}</Button> : null}
            <Link href="/launcher" className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-[0.9286rem] font-semibold hover:bg-surface-3"><Plus className="size-4" aria-hidden />{t("addTiles")}</Link>
            <Button variant={editing ? "primary" : "outline"} onClick={() => setEditing(!editing)} className="h-8">
              {editing ? <><Check className="size-4" aria-hidden />{t("done")}</> : <><Pencil className="size-4" aria-hidden />{t("edit")}</>}
            </Button>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
          {tiles.map((a, i) => {
            const body = (
              <>
                <div className="flex items-start justify-between gap-2">
                  <TileIcon action={a} />
                  {a.shortcut ? <kbd>{a.shortcut}</kbd> : null}
                </div>
                <span className="mt-3 block text-[1rem] leading-snug font-semibold">{a.label}</span>
                <span className="mt-0.5 block truncate text-[0.8571rem] text-muted">{a.group}</span>
              </>
            );
            return (
              <li key={a.href}>
                {editing ? (
                  <div className="relative h-full rounded-lg border border-dashed border-primary/60 bg-surface-3 p-3">
                    {body}
                    <div className="absolute right-2 bottom-2 flex gap-1">
                      <button type="button" onClick={() => move(a.href, -1)} disabled={i === 0} className="rounded-md border border-border bg-surface p-1 text-muted hover:text-text disabled:opacity-30" title={t("moveLeft")}><ArrowLeft className="size-3.5" aria-hidden /><span className="sr-only">{t("moveLeft")}</span></button>
                      <button type="button" onClick={() => move(a.href, 1)} disabled={i === tiles.length - 1} className="rounded-md border border-border bg-surface p-1 text-muted hover:text-text disabled:opacity-30" title={t("moveRight")}><ArrowRight className="size-3.5" aria-hidden /><span className="sr-only">{t("moveRight")}</span></button>
                      <button type="button" onClick={() => save(items.filter((h) => h !== a.href))} className="rounded-md border border-border bg-surface p-1 text-muted hover:text-danger" title={t("unpin")}><X className="size-3.5" aria-hidden /><span className="sr-only">{t("unpin")}</span></button>
                    </div>
                  </div>
                ) : (
                  <Link href={a.href} className="block h-full rounded-lg border border-border bg-surface-3 p-3 hover:border-primary/50 hover:bg-primary-soft">
                    {body}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        {!tiles.length ? <p className="text-sm text-muted">{t("empty")}</p> : null}
      </section>

      {recent.length ? (
        <section className="rounded-lg border border-border bg-surface p-4" aria-labelledby="mm-recent">
          <h2 id="mm-recent" className="mb-2.5 flex items-center gap-2 text-[1rem] font-semibold"><History className="size-4 text-primary" aria-hidden />{t("recent")}</h2>
          <ul className="flex flex-wrap gap-2">
            {recent.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="inline-flex max-w-80 items-center gap-2 rounded-md border border-border bg-surface-3 px-2.5 py-1.5 text-[0.9286rem] hover:border-primary/50 hover:bg-primary-soft">
                  <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span className="truncate">{r.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
