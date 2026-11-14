"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Badge, Button, Card, Field, Input, Select } from "../ui";
import { Gstr9Panel } from "./Gstr9Panel";

interface Option { id: string; name: string }
interface Imports { id: string; period: string; rows: number }
interface Compare {
  totals: { in2A: number; in2B: number; onlyIn2A: number; onlyIn2B: number; amountDiff: number; suppliersNotFiled3b: number };
  onlyIn2A: { ctin: string; supplier: string | null; docNo: string; docDate: string; tax: string }[];
  onlyIn2B: { ctin: string; supplier: string | null; docNo: string; docDate: string; tax: string }[];
  amountDiff: { docNo: string; supplier: string | null; tax: string; tax2B: string }[];
  suppliersNotFiled3b: { ctin: string; supplier: string | null; docs: number; tax: string }[];
}
interface R37a {
  fy: string; cutoff: string; due: boolean; totals: { atRisk: string; reversed: string };
  items: { billId: string; number: string; supplier: string; invoiceNo: string; date: string; tax: string; supplierStatus: string; reversed: { id: string; on: string; reclaimedOn: string | null } | null }[];
}
interface Working { fy: string; allAgree: boolean; rows: { key: string; books: string; returns: string; difference: string; ok: boolean; reasons: string[] }[]; reverseChargeCredit: string }
interface Gstr4 { fy: string; ratePct: string; quarters: { quarter: number; turnover: string; tax: string }[]; totals: { turnover: string; tax: string }; inward: { kind: string; bills: number; taxable: string; tax: string }[] }
interface Approval { id: string; returnType: string; period: string; status: string; note: string | null; requestedAt: string }

const TABS = ["twoA", "rule37a", "annual", "approvals"] as const;
type Tab = (typeof TABS)[number];
const NS = ["gstwork.errors", "gstCompliance.errors"];

/** GSTR-2A against 2B, credit to give back under Rule 37A, the annual working and the sign-off before a return is uploaded. */
export function GstCompliance({ imports2a, accounts, canSubmit, canApprove, approvalRequired, defaultFy }: { imports2a: Imports[]; accounts: Option[]; canSubmit: boolean; canApprove: boolean; approvalRequired: boolean; defaultFy: number }) {
  const t = useTranslations();
  const format = useFormatter();
  const [tab, setTab] = useState<Tab>("twoA");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [period, setPeriod] = useState(imports2a[0]?.period ?? "");
  const [periods, setPeriods] = useState(imports2a);
  const [cmp, setCmp] = useState<Compare | null>(null);
  const [fy, setFy] = useState(String(defaultFy));
  const [rate, setRate] = useState("1");
  const [r37, setR37] = useState<R37a | null>(null);
  const [working, setWorking] = useState<Working | null>(null);
  const [g4, setG4] = useState<Gstr4 | null>(null);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [required, setRequired] = useState(approvalRequired);
  const [counter, setCounter] = useState(accounts[0]?.id ?? "");
  const [ret, setRet] = useState({ returnType: "GSTR1", period: "" });
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });
  const fail = useCallback((err: unknown) => setError(errorText(t, err, NS)), [t]);

  const load = useCallback(() => {
    setError(null);
    if (tab === "twoA" && period) api<Compare>(`/gst/work/2a/${period}/vs-2b`).then(setCmp).catch(() => setCmp(null));
    if (tab === "rule37a") api<R37a>(`/gst/work/rule37a?fy=${fy}`).then(setR37).catch(fail);
    if (tab === "annual") {
      api<Working>(`/gst/work/gstr9c?fy=${fy}`).then(setWorking).catch(fail);
      api<Gstr4>(`/gst/work/gstr4?fy=${fy}&rate=${rate}`).then(setG4).catch(fail);
    }
    if (tab === "approvals") api<Approval[]>("/gst/work/approvals").then(setApprovals).catch(fail);
  }, [tab, period, fy, rate, fail]);
  useEffect(() => { load(); }, [load]);
  const act = async (fn: () => Promise<unknown>) => { setBusy(true); setError(null); try { await fn(); load(); } catch (err) { fail(err); } finally { setBusy(false); } };

  async function onFile(file: File) {
    let json: unknown;
    try { json = JSON.parse(await file.text()); } catch { setError(t("gstwork.errors.not_json")); return; }
    await act(async () => {
      const r = await api<{ period: string; importId: string }>("/gst/work/2a", { body: { json } });
      const list = await api<Imports[]>("/gst/work/2a");
      setPeriods(list);
      setPeriod(r.period);
    });
  }
  const label = (p: string) => `${p.slice(0, 2)}/${p.slice(2)}`;
  const reverse = (item: R37a["items"][number]) => act(() => api("/gst/work/itc-reversals", { body: { rule: "37A", billId: item.billId, date: new Date().toISOString().slice(0, 10), counterAccountId: counter } }));
  const reclaim = (id: string) => act(() => api(`/gst/work/itc-reversals/${id}/reclaim`, { body: { date: new Date().toISOString().slice(0, 10), counterAccountId: counter } }));

  const head = (cols: string[]) => <thead className="text-left text-xs text-muted"><tr className="border-b border-rule">{cols.map((c, i) => <th key={c} className={`px-4 py-1.5 font-medium ${i >= cols.length - 1 ? "text-right" : ""}`}>{c}</th>)}</tr></thead>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="tablist">
        {TABS.map((k) => <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-lg border px-3 py-1.5 text-sm ${tab === k ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-surface-2"}`}>{t(`gstCompliance.tabs.${k}`)}</button>)}
      </div>
      {error ? <Alert>{error}</Alert> : null}

      {tab === "twoA" ? (
        <>
          <Card className="flex flex-wrap items-end gap-4 p-4">
            {canSubmit ? <Field label={t("gstCompliance.twoA.load")} htmlFor="g2a-file" hint={t("gstCompliance.twoA.hint")}><input id="g2a-file" type="file" accept="application/json,.json" onChange={(e) => { const f = e.target.files?.[0]; if (f) void onFile(f); e.target.value = ""; }} className="text-sm" /></Field> : null}
            {periods.length ? <Field label={t("gstCompliance.twoA.period")} htmlFor="g2a-p"><Select id="g2a-p" value={period} onChange={(e) => setPeriod(e.target.value)} className="w-36">{periods.map((i) => <option key={i.id} value={i.period}>{label(i.period)}</option>)}</Select></Field> : null}
          </Card>
          {cmp ? (
            <>
              <Card className="p-4 text-sm">{t("gstCompliance.twoA.summary", { a: cmp.totals.in2A, b: cmp.totals.in2B, only: cmp.totals.onlyIn2A, diff: cmp.totals.amountDiff, nf: cmp.totals.suppliersNotFiled3b })}</Card>
              {cmp.suppliersNotFiled3b.length ? (
                <Card className="p-0"><h2 className="px-4 pt-3 text-sm font-medium">{t("gstCompliance.twoA.notFiled")}</h2><table className="w-full text-sm">{head([t("gstCompliance.supplier"), t("gstCompliance.docs"), t("gstCompliance.tax")])}<tbody>{cmp.suppliersNotFiled3b.map((s) => <tr key={s.ctin} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{s.supplier ?? s.ctin}<span className="ml-2 text-xs text-muted">{s.ctin}</span></td><td className="px-4 py-1.5">{s.docs}</td><td className="num px-4 py-1.5 text-right">{money(s.tax)}</td></tr>)}</tbody></table></Card>
              ) : null}
              {cmp.onlyIn2A.length ? (
                <Card className="p-0"><h2 className="px-4 pt-3 text-sm font-medium">{t("gstCompliance.twoA.only2A")}</h2><table className="w-full text-sm">{head([t("gstCompliance.supplier"), t("gstCompliance.doc"), t("gstCompliance.tax")])}<tbody>{cmp.onlyIn2A.map((s) => <tr key={`${s.ctin}${s.docNo}`} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{s.supplier ?? s.ctin}</td><td className="px-4 py-1.5">{s.docNo}<span className="ml-2 text-xs text-muted">{s.docDate}</span></td><td className="num px-4 py-1.5 text-right">{money(s.tax)}</td></tr>)}</tbody></table></Card>
              ) : null}
              {cmp.onlyIn2B.length || cmp.amountDiff.length ? (
                <Card className="p-4 text-sm">{cmp.onlyIn2B.length ? <p>{t("gstCompliance.twoA.only2B", { n: cmp.onlyIn2B.length })}</p> : null}{cmp.amountDiff.length ? <p>{t("gstCompliance.twoA.differ", { n: cmp.amountDiff.length })}</p> : null}</Card>
              ) : null}
            </>
          ) : <p className="text-sm text-muted">{t("gstCompliance.twoA.need")}</p>}
        </>
      ) : null}

      {tab === "rule37a" ? (
        <>
          <Card className="flex flex-wrap items-end gap-4 p-4">
            <Field label={t("gstCompliance.fy")} htmlFor="fy37"><Input id="fy37" value={fy} onChange={(e) => setFy(e.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" className="num w-24" /></Field>
            {canSubmit ? <Field label={t("gstCompliance.r37.account")} htmlFor="r37-acc"><Select id="r37-acc" value={counter} onChange={(e) => setCounter(e.target.value)}>{accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</Select></Field> : null}
          </Card>
          {r37 ? (
            <>
              <Card className="p-4 text-sm">{r37.due ? <Badge tone="danger">{t("gstCompliance.r37.due", { date: r37.cutoff })}</Badge> : <Badge tone="neutral">{t("gstCompliance.r37.watch", { date: r37.cutoff })}</Badge>} <span className="ml-2">{t("gstCompliance.r37.totals", { risk: money(r37.totals.atRisk), rev: money(r37.totals.reversed) })}</span></Card>
              <Card className="p-0">
                <table className="w-full text-sm">{head([t("gstCompliance.supplier"), t("gstCompliance.doc"), t("gstCompliance.r37.status"), t("gstCompliance.tax"), ""])}
                  <tbody>{r37.items.map((i) => (
                    <tr key={i.billId} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{i.supplier}</td><td className="px-4 py-1.5">{i.invoiceNo}<span className="ml-2 text-xs text-muted">{i.date}</span></td><td className="px-4 py-1.5">{t(`gstCompliance.r37.s.${i.supplierStatus}`)}</td><td className="num px-4 py-1.5 text-right">{money(i.tax)}</td>
                      <td className="px-4 py-1.5 text-right">{canSubmit ? (i.reversed ? (i.reversed.reclaimedOn ? <Badge tone="success">{t("gstCompliance.r37.reclaimed")}</Badge> : <Button variant="outline" disabled={busy} onClick={() => reclaim(i.reversed!.id)}>{t("gstCompliance.r37.reclaim")}</Button>) : <Button variant="outline" disabled={busy || !counter} onClick={() => reverse(i)}>{t("gstCompliance.r37.reverse")}</Button>) : null}</td></tr>
                  ))}</tbody>
                </table>
                {r37.items.length ? null : <p className="px-4 py-3 text-sm text-muted">{t("gstCompliance.r37.none")}</p>}
              </Card>
            </>
          ) : null}
        </>
      ) : null}

      {tab === "annual" ? (
        <>
          <Card className="flex flex-wrap items-end gap-4 p-4">
            <Field label={t("gstCompliance.fy")} htmlFor="fya"><Input id="fya" value={fy} onChange={(e) => setFy(e.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" className="num w-24" /></Field>
            <Field label={t("gstCompliance.annual.rate")} htmlFor="rate"><Input id="rate" value={rate} onChange={(e) => setRate(e.target.value)} inputMode="decimal" className="num w-20" /></Field>
          </Card>
          <Gstr9Panel fy={fy} />
          {working ? (
            <Card className="p-0">
              <h2 className="px-4 pt-3 text-sm font-medium">{t("gstCompliance.annual.nineC", { fy: working.fy })}</h2>
              <table className="w-full text-sm">{head([t("gstCompliance.annual.line"), t("gstCompliance.annual.books"), t("gstCompliance.annual.returns"), t("gstCompliance.annual.diff")])}
                <tbody>{working.rows.map((r) => (
                  <tr key={r.key} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{t(`gstCompliance.annual.k.${r.key}`)}{r.ok ? null : <span className="ml-2 text-xs text-muted">{r.reasons.map((x) => t(`gstCompliance.annual.why.${x}`)).join(", ")}</span>}</td><td className="num px-4 py-1.5 text-right">{money(r.books)}</td><td className="num px-4 py-1.5 text-right">{money(r.returns)}</td><td className={`num px-4 py-1.5 text-right ${r.ok ? "" : "text-danger"}`}>{money(r.difference)}</td></tr>
                ))}</tbody>
              </table>
            </Card>
          ) : null}
          {g4 ? (
            <Card className="p-0">
              <h2 className="px-4 pt-3 text-sm font-medium">{t("gstCompliance.annual.gstr4", { fy: g4.fy, rate: g4.ratePct })}</h2>
              <table className="w-full text-sm">{head([t("gstCompliance.annual.quarter"), t("gstCompliance.annual.turnover"), t("gstCompliance.tax")])}
                <tbody>{g4.quarters.map((q) => <tr key={q.quarter} className="border-b border-rule"><td className="px-4 py-1.5">Q{q.quarter}</td><td className="num px-4 py-1.5">{money(q.turnover)}</td><td className="num px-4 py-1.5 text-right">{money(q.tax)}</td></tr>)}
                  <tr className="font-medium"><td className="px-4 py-1.5">{t("gstCompliance.annual.total")}</td><td className="num px-4 py-1.5">{money(g4.totals.turnover)}</td><td className="num px-4 py-1.5 text-right">{money(g4.totals.tax)}</td></tr></tbody>
              </table>
              <table className="mt-2 w-full text-sm">{head([t("gstCompliance.annual.inward"), t("gstCompliance.annual.bills"), t("gstCompliance.annual.taxable"), t("gstCompliance.tax")])}
                <tbody>{g4.inward.map((i) => <tr key={i.kind} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{t(`gstCompliance.annual.in.${i.kind}`)}</td><td className="px-4 py-1.5">{i.bills}</td><td className="num px-4 py-1.5">{money(i.taxable)}</td><td className="num px-4 py-1.5 text-right">{money(i.tax)}</td></tr>)}</tbody>
              </table>
            </Card>
          ) : null}
        </>
      ) : null}

      {tab === "approvals" ? (
        <>
          <Card className="flex flex-wrap items-end gap-4 p-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={required} disabled={!canSubmit || busy} onChange={(e) => { const v = e.target.checked; void act(async () => { await api("/gst/work/settings", { method: "PUT", body: { approvalRequired: v } }); setRequired(v); }); }} />{t("gstCompliance.appr.required")}</label>
          </Card>
          {canSubmit ? (
            <Card className="flex flex-wrap items-end gap-4 p-4">
              <Field label={t("gstCompliance.appr.return")} htmlFor="ar-t"><Select id="ar-t" value={ret.returnType} onChange={(e) => setRet({ ...ret, returnType: e.target.value })}><option value="GSTR1">GSTR-1</option><option value="GSTR3B">GSTR-3B</option></Select></Field>
              <Field label={t("gstCompliance.appr.period")} htmlFor="ar-p" hint="MMYYYY"><Input id="ar-p" value={ret.period} onChange={(e) => setRet({ ...ret, period: e.target.value.replace(/\D/g, "").slice(0, 6) })} inputMode="numeric" className="num w-28" /></Field>
              <Button disabled={busy || ret.period.length !== 6} onClick={() => act(() => api("/gst/work/approvals", { body: ret }))}>{t("gstCompliance.appr.ask")}</Button>
            </Card>
          ) : null}
          <Card className="p-0">
            <table className="w-full text-sm">{head([t("gstCompliance.appr.return"), t("gstCompliance.appr.period"), t("gstCompliance.appr.status"), ""])}
              <tbody>{approvals.map((a) => (
                <tr key={a.id} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{a.returnType}</td><td className="px-4 py-1.5">{label(a.period)}</td><td className="px-4 py-1.5"><Badge tone={a.status === "approved" ? "success" : a.status === "rejected" ? "danger" : "neutral"}>{t(`gstCompliance.appr.s.${a.status}`)}</Badge>{a.note ? <span className="ml-2 text-xs text-muted">{a.note}</span> : null}</td>
                  <td className="px-4 py-1.5 text-right">{canApprove && a.status === "requested" ? (<span className="flex justify-end gap-2"><Button variant="outline" disabled={busy} onClick={() => act(() => api(`/gst/work/approvals/${a.id}/decide`, { body: { decision: "approve" } }))}>{t("gstCompliance.appr.approve")}</Button><Button variant="ghost" disabled={busy} onClick={() => { const note = window.prompt(t("gstCompliance.appr.why")); if (note) void act(() => api(`/gst/work/approvals/${a.id}/decide`, { body: { decision: "reject", note } })); }}>{t("gstCompliance.appr.reject")}</Button></span>) : null}</td></tr>
              ))}</tbody>
            </table>
            {approvals.length ? null : <p className="px-4 py-3 text-sm text-muted">{t("gstCompliance.appr.none")}</p>}
          </Card>
        </>
      ) : null}
    </div>
  );
}
