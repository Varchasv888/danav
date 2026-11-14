"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { todayIso } from "@/lib/format";
import { Alert, Badge, Button, Card, Field, Input, Select } from "../ui";

export interface Inquiry { id: string; date: string; customerName: string; customerPhone: string | null; kind: string; note: string; followUpOn: string | null; status: string; outcome: string | null; due: boolean }
const KINDS = ["repair", "tailoring", "product", "order", "other"] as const;
const NS = ["inquiries.errors"];

/** Walk-in questions with a day to follow up; the ones whose day has come are at the top. */
export function Inquiries({ rows, canEdit }: { rows: Inquiry[]; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [f, setF] = useState({ customerName: "", customerPhone: "", kind: "other", note: "", followUpOn: "" });
  const [closing, setClosing] = useState<string | null>(null);
  const [outcome, setOutcome] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const call = async (fn: () => Promise<unknown>, after?: () => void) => { setBusy(true); setError(null); try { await fn(); after?.(); router.refresh(); } catch (err) { setError(errorText(t, err, NS)); } finally { setBusy(false); } };

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      {canEdit ? (
        <Card className="p-4">
          <form className="grid gap-3 sm:grid-cols-3" onSubmit={(e) => { e.preventDefault(); void call(() => api("/inquiries", { body: { date: todayIso(), customerName: f.customerName, customerPhone: f.customerPhone || undefined, kind: f.kind, note: f.note, followUpOn: f.followUpOn || undefined } }), () => setF({ customerName: "", customerPhone: "", kind: "other", note: "", followUpOn: "" })); }}>
            <Field label={t("inquiries.name")}><Input value={f.customerName} onChange={(e) => setF({ ...f, customerName: e.target.value })} maxLength={80} required /></Field>
            <Field label={t("inquiries.phone")}><Input value={f.customerPhone} onChange={(e) => setF({ ...f, customerPhone: e.target.value.replace(/\D/g, "") })} inputMode="numeric" maxLength={10} /></Field>
            <Field label={t("inquiries.kind")}><Select value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })}>{KINDS.map((k) => <option key={k} value={k}>{t(`inquiries.kinds.${k}`)}</option>)}</Select></Field>
            <div className="sm:col-span-2"><Field label={t("inquiries.note")}><Input value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} maxLength={500} required /></Field></div>
            <Field label={t("inquiries.followUp")}><Input type="date" value={f.followUpOn} onChange={(e) => setF({ ...f, followUpOn: e.target.value })} /></Field>
            <div className="sm:col-span-3"><Button type="submit" disabled={busy}>{t("inquiries.add")}</Button></div>
          </form>
        </Card>
      ) : null}
      <Card className="p-0">
        {rows.length === 0 ? <p className="p-4 text-sm text-muted">{t("inquiries.empty")}</p> : (
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted"><tr className="border-b border-rule"><th className="px-4 py-1.5 font-medium">{t("inquiries.name")}</th><th className="px-4 py-1.5 font-medium">{t("inquiries.note")}</th><th className="px-4 py-1.5 font-medium">{t("inquiries.followUp")}</th><th className="px-4 py-1.5 font-medium">{t("inquiries.status")}</th><th /></tr></thead>
            <tbody>{rows.map((r) => (
              <tr key={r.id} className="border-b border-rule align-top last:border-0">
                <td className="px-4 py-1.5">{r.customerName}<div className="text-xs text-muted">{r.customerPhone ?? ""} · {t(`inquiries.kinds.${r.kind}`)} · {r.date}</div></td>
                <td className="px-4 py-1.5">{r.note}{r.outcome ? <div className="text-xs text-muted">{r.outcome}</div> : null}</td>
                <td className="px-4 py-1.5">{r.followUpOn ?? ""}{r.due ? <Badge tone="danger">{t("inquiries.due")}</Badge> : null}</td>
                <td className="px-4 py-1.5"><Badge tone={r.status === "open" ? "warning" : "neutral"}>{t(`inquiries.statuses.${r.status}`)}</Badge></td>
                <td className="px-4 py-1.5 text-right">
                  {canEdit && r.status === "open" ? (closing === r.id ? (
                    <span className="flex items-end justify-end gap-2"><Input value={outcome} onChange={(e) => setOutcome(e.target.value)} maxLength={300} placeholder={t("inquiries.outcome")} className="w-56" /><Button type="button" disabled={busy || !outcome.trim()} onClick={() => call(() => api(`/inquiries/${r.id}/close`, { body: { status: "closed", outcome } }), () => { setClosing(null); setOutcome(""); })}>{t("inquiries.close")}</Button></span>
                  ) : <button type="button" className="text-xs text-primary" onClick={() => { setClosing(r.id); setOutcome(""); }}>{t("inquiries.close")}</button>) : null}
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
