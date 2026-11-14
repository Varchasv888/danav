"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Badge, Button, Input, Select } from "../ui";

export interface HsnRow { id: string; code: string; description: string; kind: "goods" | "service"; gstRate: string | null; archived: boolean }

/** The list of HSN and SAC codes: add on the top line, edit a row in place, archive instead of delete. */
export function HsnMaster({ rows, canCreate, canEdit }: { rows: HsnRow[]; canCreate: boolean; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter((r) => (showArchived || !r.archived) && (!s || r.code.includes(s) || r.description.toLowerCase().includes(s)));
  }, [rows, q, showArchived]);

  async function send(path: string, body: Record<string, unknown>, method: "POST" | "PATCH" = "POST") {
    setError(null);
    setNote(null);
    setBusy(true);
    try { const r = await api<{ added?: number }>(path, { method, body }); router.refresh(); return r; } catch (err) { setError(errorText(t, err, ["hsn.errors", "items.errors"])); return null; } finally { setBusy(false); }
  }
  const fields = (f: FormData) => ({ code: String(f.get("code") ?? "").trim(), description: String(f.get("description") ?? "").trim(), kind: String(f.get("kind") ?? "goods"), gstRate: String(f.get("gstRate") ?? "").trim() || null });
  const cols = "sm:grid-cols-[6rem_minmax(12rem,2fr)_7rem_6rem_auto]";

  return (
    <div className="rounded-md border border-border bg-surface">
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-3 py-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("common.search")} aria-label={t("common.search")} className="h-8 max-w-64" />
        <label className="flex items-center gap-1.5 text-[0.9286rem] text-muted"><input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} className="size-3.5" />{t("hsn.showArchived")}</label>
        {canCreate ? (
          <Button type="button" variant="outline" className="ml-auto h-8" disabled={busy} onClick={async () => { const r = await send("/hsn/seed-standard", {}); if (r) setNote(t("hsn.standardAdded", { n: r.added ?? 0 })); }}>{t("hsn.addStandard")}</Button>
        ) : null}
      </div>
      {error ? <div className="px-3 pt-3"><Alert>{error}</Alert></div> : null}
      {note ? <p role="status" className="px-3 pt-3 text-[0.9286rem] text-success">{note}</p> : null}

      <div role="table" className="text-[0.9286rem]">
        <div role="row" className={`hidden gap-2 border-b border-border bg-surface-2 px-3 py-1.5 text-xs font-semibold text-muted sm:grid ${cols}`}>
          <span role="columnheader">{t("hsn.code")}</span><span role="columnheader">{t("hsn.description")}</span><span role="columnheader">{t("hsn.kind")}</span><span role="columnheader">{t("hsn.rate")}</span><span role="columnheader" className="sr-only">{t("common.actions")}</span>
        </div>
        {canCreate ? (
          <form role="row" className={`grid grid-cols-1 gap-2 border-b border-border bg-primary-soft/40 px-3 py-2 ${cols}`}
            onSubmit={async (e) => { e.preventDefault(); const form = e.currentTarget; if (await send("/hsn", fields(new FormData(form)))) { form.reset(); (form.elements.namedItem("code") as HTMLInputElement | null)?.focus(); } }}>
            <Input name="code" required maxLength={8} inputMode="numeric" placeholder={t("hsn.code")} aria-label={t("hsn.code")} className="h-8 font-mono" />
            <Input name="description" required maxLength={200} placeholder={t("hsn.description")} aria-label={t("hsn.description")} className="h-8" />
            <Select name="kind" defaultValue="goods" aria-label={t("hsn.kind")} className="h-8"><option value="goods">{t("hsn.goods")}</option><option value="service">{t("hsn.service")}</option></Select>
            <Input name="gstRate" inputMode="decimal" placeholder="%" aria-label={t("hsn.rate")} className="num h-8 text-right" />
            <Button type="submit" disabled={busy} className="h-8"><Plus className="size-4" aria-hidden />{t("common.add")}</Button>
          </form>
        ) : null}
        {shown.map((r) => editing === r.id ? (
          <form key={r.id} role="row" className={`grid grid-cols-1 gap-2 border-b border-rule bg-accent-soft/40 px-3 py-2 ${cols}`}
            onSubmit={async (e) => { e.preventDefault(); if (await send(`/hsn/${r.id}`, fields(new FormData(e.currentTarget)), "PATCH")) setEditing(null); }}>
            <Input name="code" required maxLength={8} defaultValue={r.code} aria-label={t("hsn.code")} className="h-8 font-mono" />
            <Input name="description" required maxLength={200} defaultValue={r.description} aria-label={t("hsn.description")} className="h-8" autoFocus />
            <Select name="kind" defaultValue={r.kind} aria-label={t("hsn.kind")} className="h-8"><option value="goods">{t("hsn.goods")}</option><option value="service">{t("hsn.service")}</option></Select>
            <Input name="gstRate" inputMode="decimal" defaultValue={r.gstRate ? Number(r.gstRate) : ""} aria-label={t("hsn.rate")} className="num h-8 text-right" />
            <div className="flex gap-1.5"><Button type="submit" disabled={busy} className="h-8">{t("common.save")}</Button><Button type="button" variant="outline" className="h-8" onClick={() => setEditing(null)}>{t("common.cancel")}</Button></div>
          </form>
        ) : (
          <div key={r.id} role="row" className={`grid grid-cols-1 items-center gap-x-2 gap-y-0.5 border-b border-rule px-3 py-2 last:border-0 hover:bg-surface-2/60 ${cols} ${r.archived ? "text-faint" : ""}`}>
            <span role="cell" className="font-mono font-medium">{r.code}</span>
            <span role="cell">{r.description}{r.archived ? <Badge className="ml-2">{t("common.archived")}</Badge> : null}</span>
            <span role="cell" className="text-muted">{t(`hsn.${r.kind}`)}</span>
            <span role="cell" className="num text-right text-muted">{r.gstRate ? `${Number(r.gstRate)}%` : ""}</span>
            <span role="cell" className="flex gap-1 sm:justify-end">
              {canEdit ? (
                <>
                  {!r.archived ? <button type="button" onClick={() => setEditing(r.id)} className="rounded px-2 py-1 text-xs font-semibold text-primary hover:bg-primary-soft">{t("common.edit")}</button> : null}
                  <button type="button" disabled={busy} onClick={() => void send(`/hsn/${r.id}`, { code: r.code, description: r.description, kind: r.kind, gstRate: r.gstRate, archived: !r.archived }, "PATCH")} className="rounded px-2 py-1 text-xs text-muted hover:bg-surface-2 hover:text-text">{r.archived ? t("lists.restore") : t("lists.archive")}</button>
                </>
              ) : null}
            </span>
          </div>
        ))}
        {!shown.length ? <p className="px-3 py-8 text-center text-muted">{rows.length ? t("lists.noMatch") : t("hsn.empty")}</p> : null}
      </div>
    </div>
  );
}
