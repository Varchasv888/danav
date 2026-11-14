"use client";

import clsx from "clsx";
import { DATED_LOOKUPS, type LookupKind } from "@varchasv/domain";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Badge, Button, Input } from "../ui";

export interface LookupRow { id: string; name: string; code: string | null; note: string | null; startsOn: string | null; endsOn: string | null; archived: boolean }

/**
 * A small master as a dense register: add on the top line, edit a row in place, archive instead of
 * delete (old documents keep their value). The rail on the left jumps between the Masters lists.
 */
export function LookupList({ kind, rows, counts, rail, canCreate, canEdit }: {
  kind: LookupKind; rows: LookupRow[]; counts: Record<string, number>; rail: { key: string; lists: string[] }[]; canCreate: boolean; canEdit: boolean;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const day = (iso: string | null) => (iso ? format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" }) : "");
  const router = useRouter();
  const dated = DATED_LOOKUPS.includes(kind);
  const [q, setQ] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter((r) => (showArchived || !r.archived) && (!s || r.name.toLowerCase().includes(s) || (r.code ?? "").toLowerCase().includes(s) || (r.note ?? "").toLowerCase().includes(s)));
  }, [rows, q, showArchived]);
  const archivedCount = rows.filter((r) => r.archived).length;

  async function send(path: string, method: "POST" | "PATCH", body: Record<string, unknown>) {
    setError(null);
    setBusy(true);
    try { await api(path, { method, body }); router.refresh(); return true; } catch (err) { setError(errorText(t, err, ["lists.errors"])); return false; } finally { setBusy(false); }
  }
  const fields = (f: FormData) => ({
    name: String(f.get("name") ?? ""), code: String(f.get("code") ?? "") || null, note: String(f.get("note") ?? "") || null,
    ...(dated ? { startsOn: String(f.get("startsOn") ?? "") || null, endsOn: String(f.get("endsOn") ?? "") || null } : {}),
  });
  const cols = dated ? "sm:grid-cols-[minmax(10rem,1.4fr)_6rem_8.5rem_8.5rem_minmax(8rem,1fr)_auto]" : "sm:grid-cols-[minmax(10rem,1.4fr)_6rem_minmax(8rem,1.6fr)_auto]";

  return (
    <div className="grid gap-5 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <nav aria-label={t("lists.otherLists")} className="hidden self-start rounded-md border border-border bg-surface lg:block">
        {rail.map((g) => (
          <section key={g.key}>
            <h2 className="border-b border-border bg-surface-2 px-3 py-1 text-[0.8571rem] font-semibold text-muted first:rounded-t-md">{t(`menu.g.${g.key}`)}</h2>
            <ul className="py-1">
              {g.lists.map((k) => (
                <li key={k}>
                  <Link href={`/masters/lists/${k}`} aria-current={k === kind ? "page" : undefined}
                    className={clsx("flex items-center justify-between gap-2 px-3 py-1 text-[0.9286rem]", k === kind ? "bg-primary-soft font-semibold text-primary" : "text-text hover:bg-surface-2")}>
                    <span className="truncate">{t(`menu.i.${k}`)}</span>
                    <span className="num text-xs text-faint">{counts[k] ?? 0}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>

      <div className="min-w-0 rounded-md border border-border bg-surface">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-3 py-2">
          <label className="relative min-w-48 flex-1 sm:max-w-72">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-faint" aria-hidden />
            <span className="sr-only">{t("common.search")}</span>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("common.search")} className="h-8 pl-8" />
          </label>
          {archivedCount ? (
            <label className="flex items-center gap-1.5 text-[0.9286rem] text-muted">
              <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} className="size-3.5" />
              {t("lists.showArchived", { n: archivedCount })}
            </label>
          ) : null}
          <span className="ml-auto text-[0.9286rem] text-muted">{t("lists.entries", { n: rows.length - archivedCount })}</span>
        </div>

        {error ? <div className="px-3 pt-3"><Alert>{error}</Alert></div> : null}

        <div role="table" className="text-[0.9286rem]">
          <div role="row" className={clsx("hidden gap-2 border-b border-border bg-surface-2 px-3 py-1.5 text-xs font-semibold text-muted sm:grid", cols)}>
            <span role="columnheader">{t("lists.name")}</span>
            <span role="columnheader">{t("lists.code")}</span>
            {dated ? <><span role="columnheader">{t("common.from")}</span><span role="columnheader">{t("common.to")}</span></> : null}
            <span role="columnheader">{t("lists.note")}</span>
            <span role="columnheader" className="sr-only">{t("common.actions")}</span>
          </div>

          {canCreate ? (
            <form role="row" className={clsx("grid grid-cols-1 gap-2 border-b border-border bg-primary-soft/40 px-3 py-2", cols)}
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                // Stay on the name box after adding, so a list can be typed in one go.
                if (await send(`/lookups/${kind}`, "POST", fields(new FormData(form)))) { form.reset(); (form.elements.namedItem("name") as HTMLInputElement | null)?.focus(); }
              }}>
              <Input name="name" required maxLength={80} placeholder={t("lists.newEntry")} aria-label={t("lists.name")} className="h-8" />
              <Input name="code" maxLength={12} placeholder={t("lists.code")} aria-label={t("lists.code")} className="h-8 font-mono uppercase" />
              {dated ? <><Input name="startsOn" type="date" aria-label={t("common.from")} className="h-8" /><Input name="endsOn" type="date" aria-label={t("common.to")} className="h-8" /></> : null}
              <Input name="note" maxLength={300} placeholder={t("lists.note")} aria-label={t("lists.note")} className="h-8" />
              <Button type="submit" disabled={busy} className="h-8"><Plus className="size-4" aria-hidden />{t("common.add")}</Button>
            </form>
          ) : null}

          {shown.map((r) => editing === r.id ? (
            <form key={r.id} role="row" className={clsx("grid grid-cols-1 gap-2 border-b border-rule bg-accent-soft/40 px-3 py-2", cols)}
              onSubmit={async (e) => { e.preventDefault(); if (await send(`/lookups/${kind}/${r.id}`, "PATCH", fields(new FormData(e.currentTarget)))) setEditing(null); }}
              onKeyDown={(e) => { if (e.key === "Escape") setEditing(null); }}>
              <Input name="name" required maxLength={80} defaultValue={r.name} aria-label={t("lists.name")} className="h-8" autoFocus />
              <Input name="code" maxLength={12} defaultValue={r.code ?? ""} aria-label={t("lists.code")} className="h-8 font-mono uppercase" />
              {dated ? <><Input name="startsOn" type="date" defaultValue={r.startsOn ?? ""} aria-label={t("common.from")} className="h-8" /><Input name="endsOn" type="date" defaultValue={r.endsOn ?? ""} aria-label={t("common.to")} className="h-8" /></> : null}
              <Input name="note" maxLength={300} defaultValue={r.note ?? ""} aria-label={t("lists.note")} className="h-8" />
              <div className="flex gap-1.5">
                <Button type="submit" disabled={busy} className="h-8">{t("common.save")}</Button>
                <Button type="button" variant="outline" className="h-8" onClick={() => setEditing(null)}>{t("common.cancel")}</Button>
              </div>
            </form>
          ) : (
            <div key={r.id} role="row" className={clsx("grid grid-cols-1 items-center gap-x-2 gap-y-0.5 border-b border-rule px-3 py-2 last:border-0 hover:bg-surface-2/60", cols, r.archived && "text-faint")}>
              <span role="cell" className="flex items-center gap-2 font-medium">{r.name}{r.archived ? <Badge>{t("common.archived")}</Badge> : null}</span>
              <span role="cell" className="font-mono text-xs text-muted">{r.code}</span>
              {dated ? <><span role="cell" className="num text-muted">{day(r.startsOn)}</span><span role="cell" className="num text-muted">{day(r.endsOn)}</span></> : null}
              <span role="cell" className="truncate text-muted" title={r.note ?? undefined}>{r.note}</span>
              <span role="cell" className="flex gap-1 sm:justify-end">
                {canEdit ? (
                  <>
                    {!r.archived ? <button type="button" onClick={() => setEditing(r.id)} className="rounded px-2 py-1 text-xs font-semibold text-primary hover:bg-primary-soft">{t("common.edit")}</button> : null}
                    <button type="button" disabled={busy} onClick={() => void send(`/lookups/${kind}/${r.id}`, "PATCH", { name: r.name, archived: !r.archived })}
                      className="rounded px-2 py-1 text-xs text-muted hover:bg-surface-2 hover:text-text">{r.archived ? t("lists.restore") : t("lists.archive")}</button>
                  </>
                ) : null}
              </span>
            </div>
          ))}

          {!shown.length ? <p className="px-3 py-8 text-center text-muted">{rows.length ? t("lists.noMatch") : t(canCreate ? "lists.empty" : "lists.emptyReadOnly")}</p> : null}
        </div>
      </div>
    </div>
  );
}
