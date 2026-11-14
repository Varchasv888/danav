"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { todayIso } from "@/lib/format";
import { read2bWorkbook, type Read2b } from "@/lib/gstr2b-xlsx";
import { Alert, Badge, Button, Card, Field, Select } from "../ui";

interface Heads4 { igst: string; cgst: string; sgst: string; cess: string }
interface Loaded { period: string; creditRead: Heads4; creditReportedByPortal: Heads4 | null; agreesWithPortalTotal: boolean | null; importsOfGoods: { count: number; igst: string; cess: string } }
export interface Calendar { qrmp: boolean; overdue: number; items: { returnType: string; period: string; label: string; dueOn: string; status: "filed" | "uploaded" | "overdue" | "due" | "upcoming"; arn: string | null; daysLeft: number }[] }
export type Imports = { id: string; period: string; rows: number; importedAt: string }[];
export interface EInvoiceAlerts { enabled: boolean; expired: number; items: { number: string; date: string; customer: string; status: string; daysLeft: number; total: string }[] }
export interface Rule37 { reverseTotal: string; items: { number: string; supplier: string; invoiceDate: string; ageDays: number; unpaid: string; creditAtStake: string; state: "reverse" | "warning" }[] }
interface Row { id: string; ctin: string; supplier: string | null; kind: string; docNo: string; docDate: string; taxable: string; tax: string; reason: string | null; match: string; diff: Record<string, string> | null; decision: string | null; decisionNote: string | null }
interface Recon {
  period: string;
  totals: { statementRows: number; matched: number; amountDiff: number; notBooked: number; notInStatement: number; creditClaimable: string; creditNotAvailable: string; creditAtRisk: string };
  exceptions: Row[]; ineligible: Row[];
  notInStatement: { billId: string; number: string; supplier: string; gstin: string; invoiceNo: string; date: string; tax: string }[];
}

const TABS = ["calendar", "recon", "einvoice", "rule37"] as const;
type Tab = (typeof TABS)[number];
const NS = ["gstwork.errors", "hr.errors"];
const TONE = { filed: "success", uploaded: "neutral", overdue: "danger", due: "warning", upcoming: "neutral" } as const;

/** What to file and when, the supplier statement against the books, invoices waiting for an e-invoice, and credit to reverse. */
export function GstWorkspace({ calendar, imports, alerts, rule, canSubmit }: { calendar: Calendar; imports: Imports; alerts: EInvoiceAlerts | null; rule: Rule37; canSubmit: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("calendar");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [period, setPeriod] = useState(imports[0]?.period ?? "");
  const [recon, setRecon] = useState<Recon | null>(null);
  const [preview, setPreview] = useState<{ name: string; read: Read2b; period: string } | null>(null);
  const periodOptions = useMemo(() => {
    const out: { fp: string; label: string }[] = [];
    let y = Number(todayIso().slice(0, 4)), m = Number(todayIso().slice(5, 7));
    for (let i = 0; i < 13; i++) {
      out.push({ fp: `${String(m).padStart(2, "0")}${y}`, label: `${String(m).padStart(2, "0")}/${y}` });
      if (--m === 0) { m = 12; y -= 1; }
    }
    return out;
  }, []);
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });
  const call = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try { await fn(); router.refresh(); } catch (err) { setError(errorText(t, err, NS)); } finally { setBusy(false); }
  };
  const load = useCallback(() => {
    if (!period) { setRecon(null); return; }
    api<Recon>(`/gst/work/2b/${period}`).then(setRecon).catch((err) => setError(errorText(t, err, NS)));
  }, [period, t]);
  useEffect(() => { load(); }, [load, imports]);

  const [loaded, setLoaded] = useState<Loaded | null>(null);
  async function onFile(file: File) {
    setError(null);
    if (/\.xlsx$/i.test(file.name)) {
      // The portal's Excel is read here into the JSON shape and shown first: the period is not in the sheet, so it is confirmed before importing.
      try {
        const read = await read2bWorkbook(file);
        setPreview({ name: file.name, read, period: read.period ?? periodOptions[0]!.fp });
      } catch (err) { setError(t(err instanceof Error && err.message === "empty" ? "gstwork.recon.xlsxEmpty" : "gstwork.recon.xlsxLayout")); }
      return;
    }
    let json: unknown;
    try { json = JSON.parse(await file.text()); } catch { setError(t("gstwork.errors.not_json")); return; }
    await call(async () => {
      const r = await api<Loaded>("/gst/work/2b", { body: { json } });
      setPeriod(r.period); setLoaded(r);
    });
  }
  async function importPreview() {
    if (!preview) return;
    await call(async () => {
      const r = await api<Loaded>("/gst/work/2b", { body: { json: preview.read.json, period: preview.period } });
      setPeriod(r.period); setLoaded(r);
      setPreview(null);
    });
  }
  const decide = (row: Row, decision: "accepted" | "queried") => {
    const note = window.prompt(t("gstwork.notePrompt"));
    if (note && note.trim().length >= 3) void call(async () => { await api(`/gst/work/2b/rows/${row.id}/decide`, { body: { decision, note: note.trim() } }); load(); });
  };
  const periodLabel = (p: string) => `${p.slice(0, 2)}/${p.slice(2)}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2" role="tablist">
        {TABS.map((k) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
            className={`rounded-lg border px-3 py-1.5 text-sm ${tab === k ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-surface-2"}`}>{t(`gstwork.tabs.${k}`)}</button>
        ))}
      </div>
      {error ? <Alert>{error}</Alert> : null}
      {loaded ? (
        <Card className="flex flex-col gap-1 p-4 text-sm">
          <p>{t("gstwork.loaded.read", { igst: money(loaded.creditRead.igst), cgst: money(loaded.creditRead.cgst), sgst: money(loaded.creditRead.sgst) })}</p>
          {loaded.agreesWithPortalTotal === true ? <p className="text-success">{t("gstwork.loaded.agrees")}</p> : null}
          {loaded.agreesWithPortalTotal === false && loaded.creditReportedByPortal ? <p className="text-danger">{t("gstwork.loaded.differs", { igst: money(loaded.creditReportedByPortal.igst), cgst: money(loaded.creditReportedByPortal.cgst), sgst: money(loaded.creditReportedByPortal.sgst) })}</p> : null}
          {loaded.importsOfGoods.count ? <p className="text-muted">{t("gstwork.loaded.imports", { count: loaded.importsOfGoods.count, igst: money(loaded.importsOfGoods.igst) })}</p> : null}
        </Card>
      ) : null}

      {tab === "calendar" ? (
        <Card className="p-0">
          <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-2">
            <h2 className="text-sm font-semibold">{t("gstwork.calendar.title")}</h2>
            {canSubmit ? <label className="ml-auto flex items-center gap-2 text-sm"><input type="checkbox" checked={calendar.qrmp} disabled={busy} onChange={(e) => call(() => api("/gst/work/settings", { method: "PUT", body: { qrmp: e.target.checked } }))} />{t("gstwork.calendar.qrmp")}</label> : null}
          </div>
          <ul>{calendar.items.map((i) => (
            <li key={`${i.returnType}${i.period}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-rule px-4 py-2.5 text-sm last:border-0">
              <span className="w-40 font-medium">{i.label}</span>
              <span className="text-muted">{t("gstwork.calendar.for", { period: i.returnType === "GSTR9" ? i.period.slice(0, 4) : `${i.period.slice(5)}/${i.period.slice(0, 4)}` })}</span>
              <span className="whitespace-nowrap">{t("gstwork.calendar.due", { date: i.dueOn })}</span>
              <Badge tone={TONE[i.status]}>{t(`gstwork.status.${i.status}`)}</Badge>
              {i.arn ? <span className="font-mono text-xs text-muted">{i.arn}</span> : i.status === "overdue" ? <span className="text-xs text-danger">{t("gstwork.calendar.daysLate", { n: -i.daysLeft })}</span> : i.status !== "filed" ? <span className="text-xs text-muted">{t("gstwork.calendar.daysLeft", { n: i.daysLeft })}</span> : null}
            </li>
          ))}</ul>
        </Card>
      ) : null}

      {tab === "recon" ? (
        <>
          <Card>
            <p className="mb-3 text-sm text-muted">{t("gstwork.recon.help")}</p>
            <div className="flex flex-wrap items-end gap-4">
              {canSubmit ? <Field label={t("gstwork.recon.load")} htmlFor="g2b-file"><input id="g2b-file" type="file" accept="application/json,.json,.xlsx" onChange={(e) => { const f = e.target.files?.[0]; if (f) void onFile(f); e.target.value = ""; }} className="text-sm" /></Field> : null}
              {imports.length ? <Field label={t("gstwork.recon.period")} htmlFor="g2b-p"><Select id="g2b-p" value={period} onChange={(e) => setPeriod(e.target.value)} className="w-36">{imports.map((i) => <option key={i.id} value={i.period}>{periodLabel(i.period)}</option>)}</Select></Field> : null}
            </div>
          </Card>
          {preview ? (
            <Card>
              <h3 className="text-sm font-semibold">{t("gstwork.recon.previewTitle", { name: preview.name })}</h3>
              <p className="mt-1 text-sm">{t("gstwork.recon.found", { invoices: preview.read.invoices, notes: preview.read.notes })}</p>
              {preview.read.notAvailable ? <p className="mt-1 text-sm text-muted">{t("gstwork.recon.foundNoItc", { n: preview.read.notAvailable })}</p> : null}
              {preview.read.debitNotes ? <p className="mt-1 text-sm text-warning">{t("gstwork.recon.debitSkipped", { n: preview.read.debitNotes })}</p> : null}
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <Field label={t("gstwork.recon.period")} htmlFor="g2b-prev-p" hint={preview.read.period ? t("gstwork.recon.periodFromName") : t("gstwork.recon.periodPick")}>
                  <Select id="g2b-prev-p" value={preview.period} onChange={(e) => setPreview({ ...preview, period: e.target.value })} className="w-36">{periodOptions.map((o) => <option key={o.fp} value={o.fp}>{o.label}</option>)}</Select>
                </Field>
                <Button disabled={busy} onClick={() => void importPreview()}>{t("gstwork.recon.importNow")}</Button>
                <Button variant="ghost" disabled={busy} onClick={() => setPreview(null)}>{t("common.cancel")}</Button>
              </div>
            </Card>
          ) : null}
          {recon ? (
            <>
              <div className="grid gap-3 sm:grid-cols-4">
                <Card><p className="text-xs text-muted">{t("gstwork.recon.matched")}</p><p className="num text-xl font-semibold">{recon.totals.matched} / {recon.totals.statementRows}</p></Card>
                <Card><p className="text-xs text-muted">{t("gstwork.recon.claimable")}</p><p className="num text-xl font-semibold">{money(recon.totals.creditClaimable)}</p></Card>
                <Card><p className="text-xs text-muted">{t("gstwork.recon.atRisk")}</p><p className={`num text-xl font-semibold ${Number(recon.totals.creditAtRisk) ? "text-warning" : ""}`}>{money(recon.totals.creditAtRisk)}</p></Card>
                <Card><p className="text-xs text-muted">{t("gstwork.recon.notAvailable")}</p><p className="num text-xl font-semibold">{money(recon.totals.creditNotAvailable)}</p></Card>
              </div>
              <Card className="p-0">
                <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("gstwork.recon.exceptions")}</h2>
                {recon.exceptions.length ? <ul>{recon.exceptions.map((r) => (
                  <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-rule px-4 py-2 text-sm last:border-0">
                    <span className="font-medium">{r.supplier ?? r.ctin}</span><span className="font-mono text-xs">{r.docNo}</span><span className="text-muted">{r.docDate}</span><span className="num">{money(r.tax)}</span>
                    <Badge tone={r.match === "amount_diff" ? "warning" : "danger"}>{t(`gstwork.recon.${r.match}`)}</Badge>
                    {r.diff ? <span className="text-xs text-muted">{Object.entries(r.diff).map(([k, v]) => `${k} ${money(v)}`).join(", ")}</span> : null}
                    {r.decision ? <span className="text-xs text-muted">{t(`gstwork.recon.${r.decision}`)}: {r.decisionNote}</span> : canSubmit ? (
                      <span className="ml-auto flex gap-3">
                        <button type="button" disabled={busy} onClick={() => decide(r, "accepted")} className="text-primary hover:underline">{t("gstwork.recon.accept")}</button>
                        <button type="button" disabled={busy} onClick={() => decide(r, "queried")} className="text-primary hover:underline">{t("gstwork.recon.query")}</button>
                      </span>
                    ) : null}
                  </li>
                ))}</ul> : <p className="px-4 py-6 text-center text-muted">{t("gstwork.recon.noneException")}</p>}
              </Card>
              {recon.notInStatement.length ? (
                <Card className="p-0">
                  <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("gstwork.recon.notInStatement")}</h2>
                  <ul>{recon.notInStatement.map((b) => <li key={b.billId} className="flex flex-wrap items-center gap-x-4 border-b border-rule px-4 py-2 text-sm last:border-0"><span className="font-medium">{b.supplier}</span><span className="font-mono text-xs">{b.invoiceNo}</span><span className="text-muted">{b.date}</span><span className="num ml-auto">{money(b.tax)}</span></li>)}</ul>
                </Card>
              ) : null}
              {recon.ineligible.length ? (
                <Card className="p-0">
                  <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("gstwork.recon.ineligible")}</h2>
                  <ul>{recon.ineligible.map((r) => <li key={r.id} className="flex flex-wrap items-center gap-x-4 border-b border-rule px-4 py-2 text-sm last:border-0"><span className="font-medium">{r.supplier ?? r.ctin}</span><span className="font-mono text-xs">{r.docNo}</span><span className="num">{money(r.tax)}</span><span className="text-muted">{r.reason}</span></li>)}</ul>
                </Card>
              ) : null}
            </>
          ) : <p className="text-sm text-muted">{t("gstwork.recon.none")}</p>}
        </>
      ) : null}

      {tab === "einvoice" ? (
        <Card className="p-0">
          <p className="px-4 py-2 text-sm text-muted">{t("gstwork.einvoice.help")}</p>
          {!alerts ? <p role="alert" className="px-4 py-6 text-center text-danger">E-invoice alerts could not be loaded. Try again later.</p> : !alerts.enabled ? <p className="px-4 py-6 text-center text-muted">{t("gstwork.einvoice.off")}</p> : alerts.items.length ? (
            <ul>{alerts.items.map((i) => (
              <li key={i.number} className="flex flex-wrap items-center gap-x-4 border-b border-rule px-4 py-2 text-sm last:border-0">
                <span className="font-mono text-xs">{i.number}</span><span className="font-medium">{i.customer}</span><span className="text-muted">{i.date}</span><span className="num">{money(i.total)}</span>
                <Badge tone={i.daysLeft < 0 ? "danger" : i.daysLeft <= 7 ? "warning" : "neutral"}>{i.daysLeft < 0 ? t("gstwork.einvoice.expired") : t("gstwork.einvoice.left", { n: i.daysLeft })}</Badge>
              </li>
            ))}</ul>
          ) : <p className="px-4 py-6 text-center text-muted">{t("gstwork.einvoice.none")}</p>}
        </Card>
      ) : null}

      {tab === "rule37" ? (
        <Card className="p-0">
          <p className="px-4 py-2 text-sm text-muted">{t("gstwork.rule37.help")}</p>
          {rule.items.length ? (
            <>
              <ul>{rule.items.map((i) => (
                <li key={i.number} className="flex flex-wrap items-center gap-x-4 border-b border-rule px-4 py-2 text-sm">
                  <span className="font-mono text-xs">{i.number}</span><span className="font-medium">{i.supplier}</span><span className="text-muted">{i.invoiceDate}</span><span className="text-muted">{t("gstwork.rule37.age", { n: i.ageDays })}</span>
                  <span className="num">{money(i.unpaid)}</span><span className="num font-medium">{money(i.creditAtStake)}</span>
                  <Badge tone={i.state === "reverse" ? "danger" : "warning"}>{t(`gstwork.rule37.${i.state}`)}</Badge>
                </li>
              ))}</ul>
              <p className="px-4 py-2 text-sm">{t("gstwork.rule37.total")}: <span className="num font-semibold">{money(rule.reverseTotal)}</span></p>
            </>
          ) : <p className="px-4 py-6 text-center text-muted">{t("gstwork.rule37.none")}</p>}
        </Card>
      ) : null}
    </div>
  );
}
