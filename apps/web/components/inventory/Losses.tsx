"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Badge, Button, Card, Field, Input, Select } from "../ui";

export interface Loss { id: string; number: string; date: string; item: string; warehouse: string; qty: string; value: string; reason: string; note: string | null; fileId: string | null; status: "pending" | "approved" | "rejected"; requestedBy: string | null; requestedByName: string | null; decisionNote: string | null }
export interface LossReport { total: string; byReason: { reason: string; count: number; qty: string; value: string }[]; byMonth: { month: string; value: string }[]; pending: { count: number; value: string } }
interface Option { id: string; name: string }

const REASONS = ["damaged", "lost", "theft", "expired", "sample", "other"] as const;
const NS = ["losses.errors", "stock.errors"];
const TONE = { pending: "warning", approved: "success", rejected: "neutral" } as const;
const toBase64 = (f: File) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1] ?? ""); r.onerror = rej; r.readAsDataURL(f); });

/** Damaged, lost, stolen or expired stock: record it with a reason and a photo, get a second person's approval above the limit, and see the totals. */
export function Losses({ losses, report, limit, userId, items, warehouses, canCreate, canApprove }: { losses: Loss[]; report: LossReport; limit: string; userId: string; items: Option[]; warehouses: Option[]; canCreate: boolean; canApprove: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [itemId, setItemId] = useState("");
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id ?? "");
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState<(typeof REASONS)[number]>("damaged");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [newLimit, setNewLimit] = useState(String(Number(limit)));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });
  const call = async (fn: () => Promise<unknown>, done?: () => void) => {
    setBusy(true);
    setError(null);
    try { await fn(); done?.(); router.refresh(); } catch (err) { setError(errorText(t, err, NS)); } finally { setBusy(false); }
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void call(async () => {
      let fileId: string | null = null;
      if (file) {
        if (file.size > 6 * 1024 * 1024) throw new Error("photo_too_big");
        fileId = (await api<{ id: string }>("/files", { body: { name: file.name, contentType: file.type, base64: await toBase64(file) } })).id;
      }
      await api("/stock-losses", { body: { itemId, warehouseId, qty, reason, note: note.trim() || null, fileId } });
    }, () => { setQty(""); setNote(""); setFile(null); });
  };
  const decide = (id: string, decision: "approve" | "reject") => {
    const note = decision === "reject" ? window.prompt(t("losses.rejectNote")) : "";
    if (note === null) return;
    void call(() => api(`/stock-losses/${id}/decide`, { body: { decision, ...(note ? { note } : {}) } }));
  };

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card><p className="text-xs text-muted">{t("losses.writtenOff")}</p><p className="num text-xl font-semibold">{money(report.total)}</p></Card>
        <Card><p className="text-xs text-muted">{t("losses.waiting")}</p><p className="num text-xl font-semibold">{report.pending.count} · {money(report.pending.value)}</p></Card>
        <Card><p className="text-xs text-muted">{t("losses.limit")}</p><p className="num text-xl font-semibold">{money(limit)}</p></Card>
      </div>

      {canCreate ? (
        <Card>
          <form onSubmit={submit} method="post" className="flex flex-wrap items-end gap-4">
            <Field label={t("losses.item")} htmlFor="ls-item"><Select id="ls-item" value={itemId} onChange={(e) => setItemId(e.target.value)} required className="w-64"><option value="" />{items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}</Select></Field>
            <Field label={t("losses.store")} htmlFor="ls-wh"><Select id="ls-wh" value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} required className="w-44">{warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</Select></Field>
            <Field label={t("losses.qty")} htmlFor="ls-qty"><Input id="ls-qty" value={qty} onChange={(e) => setQty(e.target.value)} inputMode="decimal" className="num w-24" required /></Field>
            <Field label={t("losses.reason")} htmlFor="ls-reason"><Select id="ls-reason" value={reason} onChange={(e) => setReason(e.target.value as (typeof REASONS)[number])} className="w-40">{REASONS.map((r) => <option key={r} value={r}>{t(`losses.reasons.${r}`)}</option>)}</Select></Field>
            <Field label={t("losses.note")} htmlFor="ls-note"><Input id="ls-note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} className="w-56" /></Field>
            <Field label={t("losses.photo")} htmlFor="ls-file"><input id="ls-file" type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm" /></Field>
            <Button type="submit" disabled={busy || !itemId || !qty}>{t("losses.record")}</Button>
          </form>
        </Card>
      ) : null}

      {canApprove ? (
        <Card>
          <form onSubmit={(e) => { e.preventDefault(); void call(() => api("/stock-losses/settings", { method: "PUT", body: { approvalLimit: newLimit } })); }} className="flex flex-wrap items-end gap-3">
            <Field label={t("losses.limitLabel")} htmlFor="ls-limit" hint={t("losses.limitHint")}><Input id="ls-limit" value={newLimit} onChange={(e) => setNewLimit(e.target.value)} inputMode="decimal" className="num w-32" /></Field>
            <Button type="submit" variant="outline" disabled={busy}>{t("losses.saveLimit")}</Button>
          </form>
        </Card>
      ) : null}

      {report.byReason.length ? (
        <Card className="p-0">
          <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("losses.byReason")}</h2>
          <ul>{report.byReason.map((r) => (
            <li key={r.reason} className="flex items-center gap-4 border-b border-rule px-4 py-2 text-sm last:border-0"><span className="w-28">{t(`losses.reasons.${r.reason}`)}</span><span className="text-muted">{r.count}</span><span className="num ml-auto font-medium">{money(r.value)}</span></li>
          ))}</ul>
        </Card>
      ) : null}

      <Card className="p-0">
        <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("losses.list")}</h2>
        {losses.length ? (
          <ul>{losses.map((l) => (
            <li key={l.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-rule px-4 py-2.5 text-sm last:border-0">
              <span className="font-mono text-xs">{l.number}</span><span className="whitespace-nowrap text-muted">{l.date}</span>
              <span className="font-medium">{l.item}</span><span className="num">{Number(l.qty)}</span><span className="text-muted">{l.warehouse}</span>
              <span>{t(`losses.reasons.${l.reason}`)}</span><span className="num font-medium">{money(l.value)}</span>
              <Badge tone={TONE[l.status]}>{t(`losses.status.${l.status}`)}</Badge>
              {l.fileId ? <a href={`/api/files/${l.fileId}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">{t("losses.viewPhoto")}</a> : null}
              {l.note ? <span className="text-muted">{l.note}</span> : null}
              {l.decisionNote ? <span className="text-muted">({l.decisionNote})</span> : null}
              {l.status === "pending" && canApprove ? (
                l.requestedBy === userId ? <span className="ml-auto text-xs text-muted">{t("losses.ownRequest")}</span> : (
                  <span className="ml-auto flex gap-2">
                    <Button type="button" disabled={busy} onClick={() => decide(l.id, "approve")}>{t("losses.approve")}</Button>
                    <Button type="button" variant="outline" disabled={busy} onClick={() => decide(l.id, "reject")}>{t("losses.reject")}</Button>
                  </span>
                )
              ) : null}
            </li>
          ))}</ul>
        ) : <p className="px-4 py-6 text-center text-muted">{t("losses.none")}</p>}
      </Card>
    </div>
  );
}
