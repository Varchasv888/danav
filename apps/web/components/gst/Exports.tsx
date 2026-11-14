"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { todayIso } from "@/lib/format";
import { Alert, Badge, Button, Card, Field, Input, Select } from "../ui";

interface Shipment { invoiceId: string; number: string; date: string; customer: string; invoiceValue: string; shippingBillNo: string | null; shippingBillDate: string | null; portCode: string | null; brcNo: string | null; brcDate: string | null; realised: string; pending: string; dueBy: string; daysLeft: number | null; status: string }
interface Rate { id: string; scheme: string; hsnPrefix: string; ratePct: string; effectiveFrom: string; effectiveTo: string | null }
interface Incentive { scheme: string; total: string; uncovered: number; rows: { invoiceId: string; number: string; shippedOn: string; value: string; earned: string; missingRate: string[] }[] }
interface Scrips { usable: string; lapsed: string; scrips: { id: string; scheme: string; number: string; issuedOn: string; validUntil: string | null; amount: string; used: string; balance: string; expired: boolean }[] }
interface Refund { invertedTurnover: string; adjustedTurnover: string; netItc: string; inputsBought: string; itcShare: string; taxPayableOnInverted: string; refund: string }

const TABS = ["shipments", "incentive", "scrips", "inverted"] as const;
type Tab = (typeof TABS)[number];
const NS = ["exports.errors"];
const TONE: Record<string, "success" | "warning" | "danger" | "neutral"> = { realised: "success", open: "neutral", due_soon: "warning", overdue: "danger" };

/** Export follow-up: shipping bills and bank realisation, incentive rates and scrips, and the inverted duty refund working. */
export function Exports({ canEdit }: { canEdit: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const [tab, setTab] = useState<Tab>("shipments");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState<Shipment[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [sb, setSb] = useState({ shippingBillNo: "", shippingBillDate: "", portCode: "", brcNo: "", brcDate: "", realisedAmount: "0" });
  const [scheme, setScheme] = useState("rodtep");
  const [rates, setRates] = useState<Rate[]>([]);
  const [incentive, setIncentive] = useState<Incentive | null>(null);
  const [rate, setRate] = useState({ hsnPrefix: "", ratePct: "", effectiveFrom: "", effectiveTo: "" });
  const [scrips, setScrips] = useState<Scrips | null>(null);
  const [scrip, setScrip] = useState({ number: "", issuedOn: "", validUntil: "", amount: "" });
  const [use, setUse] = useState<{ id: string; usedOn: string; amount: string; purpose: string } | null>(null);
  const [period, setPeriod] = useState({ from: "", to: "", outputRate: "5" });
  const [refund, setRefund] = useState<Refund | null>(null);
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });
  useEffect(() => { const d = todayIso(); setRate((x) => ({ ...x, effectiveFrom: d })); setScrip((x) => ({ ...x, issuedOn: d })); setPeriod((x) => ({ ...x, from: `${d.slice(0, 7)}-01`, to: d })); }, []);

  const fail = useCallback((err: unknown) => setError(errorText(t, err, NS)), [t]);
  const load = useCallback(() => {
    setError(null);
    if (tab === "shipments") api<Shipment[]>("/exports/shipments").then(setRows).catch(fail);
    if (tab === "incentive") { api<Rate[]>("/exports/rates").then(setRates).catch(fail); api<Incentive>(`/exports/incentive?scheme=${scheme}`).then(setIncentive).catch(fail); }
    if (tab === "scrips") api<Scrips>("/exports/scrips").then(setScrips).catch(fail);
  }, [tab, scheme, fail]);
  useEffect(() => { load(); }, [load]);
  const act = async (fn: () => Promise<unknown>) => { setBusy(true); setError(null); try { await fn(); load(); } catch (err) { fail(err); } finally { setBusy(false); } };
  const startEdit = (r: Shipment) => { setEditing(r.invoiceId); setSb({ shippingBillNo: r.shippingBillNo ?? "", shippingBillDate: r.shippingBillDate ?? r.date, portCode: r.portCode ?? "", brcNo: r.brcNo ?? "", brcDate: r.brcDate ?? "", realisedAmount: r.realised }); };
  const nul = (v: string) => (v.trim() ? v.trim() : null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="tablist">
        {TABS.map((k) => <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-lg border px-3 py-1.5 text-sm ${tab === k ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-surface-2"}`}>{t(`exports.tabs.${k}`)}</button>)}
      </div>
      {error ? <Alert>{error}</Alert> : null}

      {tab === "shipments" ? (
        <Card className="p-0">
          <p className="px-4 py-2 text-sm text-muted">{t("exports.shipments.help")}</p>
          {rows.length === 0 ? <p className="px-4 pb-4 text-sm text-muted">{t("exports.shipments.empty")}</p> : (
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted"><tr className="border-y border-rule"><th className="px-4 py-1.5 font-medium">{t("exports.invoice")}</th><th className="px-4 py-1.5 font-medium">{t("exports.shippingBill")}</th><th className="px-4 py-1.5 text-right font-medium">{t("exports.invoiceValue")}</th><th className="px-4 py-1.5 text-right font-medium">{t("exports.realised")}</th><th className="px-4 py-1.5 font-medium">{t("exports.dueBy")}</th><th className="px-4 py-1.5 font-medium">{t("exports.status")}</th><th /></tr></thead>
              <tbody>{rows.map((r) => (
                <tr key={r.invoiceId} className="border-b border-rule align-top last:border-0">
                  <td className="px-4 py-1.5">{r.number}<div className="text-xs text-muted">{r.customer}</div></td>
                  <td className="px-4 py-1.5">{r.shippingBillNo ?? <span className="text-muted">-</span>}{r.brcNo ? <div className="text-xs text-muted">{t("exports.brc")}: {r.brcNo}</div> : null}</td>
                  <td className="num px-4 py-1.5 text-right">{money(r.invoiceValue)}</td>
                  <td className="num px-4 py-1.5 text-right">{money(r.realised)}{Number(r.pending) ? <div className="text-xs text-muted">{t("exports.pending", { amount: money(r.pending) })}</div> : null}</td>
                  <td className="px-4 py-1.5">{r.dueBy}{r.daysLeft !== null ? <div className="text-xs text-muted">{r.daysLeft < 0 ? t("exports.daysLate", { n: -r.daysLeft }) : t("exports.daysLeft", { n: r.daysLeft })}</div> : null}</td>
                  <td className="px-4 py-1.5"><Badge tone={TONE[r.status] ?? "neutral"}>{t(`exports.statuses.${r.status}`)}</Badge></td>
                  <td className="px-4 py-1.5 text-right">{canEdit ? <button type="button" className="text-xs text-primary" onClick={() => startEdit(r)}>{t("exports.edit")}</button> : null}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
          {editing ? (
            <form className="grid gap-3 border-t border-rule p-4 sm:grid-cols-3" onSubmit={(e) => { e.preventDefault(); act(async () => { await api(`/exports/shipments/${editing}`, { method: "PUT", body: { shippingBillNo: nul(sb.shippingBillNo), shippingBillDate: nul(sb.shippingBillDate), portCode: nul(sb.portCode), brcNo: nul(sb.brcNo), brcDate: nul(sb.brcDate), realisedAmount: sb.realisedAmount || "0" } }); setEditing(null); }); }}>
              <Field label={t("exports.shippingBillNo")}><Input value={sb.shippingBillNo} onChange={(e) => setSb({ ...sb, shippingBillNo: e.target.value })} maxLength={20} /></Field>
              <Field label={t("exports.shippingBillDate")}><Input type="date" value={sb.shippingBillDate} onChange={(e) => setSb({ ...sb, shippingBillDate: e.target.value })} /></Field>
              <Field label={t("exports.portCode")}><Input value={sb.portCode} onChange={(e) => setSb({ ...sb, portCode: e.target.value })} maxLength={8} /></Field>
              <Field label={t("exports.brcNo")}><Input value={sb.brcNo} onChange={(e) => setSb({ ...sb, brcNo: e.target.value })} maxLength={30} /></Field>
              <Field label={t("exports.brcDate")}><Input type="date" value={sb.brcDate} onChange={(e) => setSb({ ...sb, brcDate: e.target.value })} /></Field>
              <Field label={t("exports.realisedAmount")}><Input inputMode="decimal" value={sb.realisedAmount} onChange={(e) => setSb({ ...sb, realisedAmount: e.target.value })} /></Field>
              <div className="flex gap-2 sm:col-span-3"><Button type="submit" disabled={busy}>{t("exports.save")}</Button><Button type="button" variant="outline" onClick={() => setEditing(null)}>{t("exports.cancel")}</Button></div>
            </form>
          ) : null}
        </Card>
      ) : null}

      {tab === "incentive" ? (
        <>
          <Card className="p-4">
            <div className="flex flex-wrap items-end gap-3">
              <Field label={t("exports.scheme")}><Select value={scheme} onChange={(e) => setScheme(e.target.value)}><option value="rodtep">RoDTEP</option><option value="rosctl">RoSCTL</option></Select></Field>
              {incentive ? <p className="text-sm">{t("exports.earned")}: <span className="num font-medium">{money(incentive.total)}</span>{incentive.uncovered ? <span className="ml-2 text-danger">{t("exports.uncovered", { n: incentive.uncovered })}</span> : null}</p> : null}
            </div>
            <p className="mt-2 text-sm text-muted">{t("exports.rates.help")}</p>
          </Card>
          {incentive && incentive.rows.length ? (
            <Card className="p-0"><table className="w-full text-sm"><thead className="text-left text-xs text-muted"><tr className="border-y border-rule"><th className="px-4 py-1.5 font-medium">{t("exports.invoice")}</th><th className="px-4 py-1.5 font-medium">{t("exports.shippedOn")}</th><th className="px-4 py-1.5 text-right font-medium">{t("exports.value")}</th><th className="px-4 py-1.5 text-right font-medium">{t("exports.earned")}</th><th className="px-4 py-1.5 font-medium">{t("exports.missing")}</th></tr></thead>
              <tbody>{incentive.rows.map((r) => <tr key={r.invoiceId} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{r.number}</td><td className="px-4 py-1.5">{r.shippedOn}</td><td className="num px-4 py-1.5 text-right">{money(r.value)}</td><td className="num px-4 py-1.5 text-right">{money(r.earned)}</td><td className="px-4 py-1.5 text-xs text-danger">{r.missingRate.join(", ")}</td></tr>)}</tbody></table></Card>
          ) : null}
          <Card className="p-0">
            <p className="px-4 py-2 text-sm font-medium">{t("exports.rates.title")}</p>
            <table className="w-full text-sm"><thead className="text-left text-xs text-muted"><tr className="border-y border-rule"><th className="px-4 py-1.5 font-medium">{t("exports.scheme")}</th><th className="px-4 py-1.5 font-medium">{t("exports.hsnPrefix")}</th><th className="px-4 py-1.5 text-right font-medium">{t("exports.ratePct")}</th><th className="px-4 py-1.5 font-medium">{t("exports.from")}</th><th className="px-4 py-1.5 font-medium">{t("exports.to")}</th><th /></tr></thead>
              <tbody>{rates.filter((r) => r.scheme === scheme).map((r) => <tr key={r.id} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{r.scheme.toUpperCase()}</td><td className="px-4 py-1.5">{r.hsnPrefix}</td><td className="num px-4 py-1.5 text-right">{Number(r.ratePct)}%</td><td className="px-4 py-1.5">{r.effectiveFrom}</td><td className="px-4 py-1.5">{r.effectiveTo ?? ""}</td><td className="px-4 py-1.5 text-right">{canEdit ? <button type="button" className="text-xs text-danger" onClick={() => act(() => api(`/exports/rates/${r.id}`, { method: "DELETE" }))}>{t("exports.delete")}</button> : null}</td></tr>)}</tbody></table>
            {canEdit ? (
              <form className="grid gap-3 border-t border-rule p-4 sm:grid-cols-5" onSubmit={(e) => { e.preventDefault(); act(async () => { await api("/exports/rates", { method: "POST", body: { scheme, hsnPrefix: rate.hsnPrefix, ratePct: rate.ratePct, effectiveFrom: rate.effectiveFrom, effectiveTo: nul(rate.effectiveTo) } }); setRate({ ...rate, hsnPrefix: "", ratePct: "", effectiveTo: "" }); }); }}>
                <Field label={t("exports.hsnPrefix")}><Input value={rate.hsnPrefix} onChange={(e) => setRate({ ...rate, hsnPrefix: e.target.value })} inputMode="numeric" maxLength={8} required /></Field>
                <Field label={t("exports.ratePct")}><Input value={rate.ratePct} onChange={(e) => setRate({ ...rate, ratePct: e.target.value })} inputMode="decimal" required /></Field>
                <Field label={t("exports.from")}><Input type="date" value={rate.effectiveFrom} onChange={(e) => setRate({ ...rate, effectiveFrom: e.target.value })} required /></Field>
                <Field label={t("exports.to")}><Input type="date" value={rate.effectiveTo} onChange={(e) => setRate({ ...rate, effectiveTo: e.target.value })} /></Field>
                <div className="flex items-end"><Button type="submit" disabled={busy}>{t("exports.addRate")}</Button></div>
              </form>
            ) : null}
          </Card>
        </>
      ) : null}

      {tab === "scrips" && scrips ? (
        <>
          <Card className="p-4"><p className="text-sm">{t("exports.usable")}: <span className="num font-medium">{money(scrips.usable)}</span>{Number(scrips.lapsed) ? <span className="ml-3 text-danger">{t("exports.lapsed", { amount: money(scrips.lapsed) })}</span> : null}</p></Card>
          <Card className="p-0">
            <table className="w-full text-sm"><thead className="text-left text-xs text-muted"><tr className="border-y border-rule"><th className="px-4 py-1.5 font-medium">{t("exports.scrip")}</th><th className="px-4 py-1.5 font-medium">{t("exports.validUntil")}</th><th className="px-4 py-1.5 text-right font-medium">{t("exports.amount")}</th><th className="px-4 py-1.5 text-right font-medium">{t("exports.used")}</th><th className="px-4 py-1.5 text-right font-medium">{t("exports.balance")}</th><th /></tr></thead>
              <tbody>{scrips.scrips.map((s) => <tr key={s.id} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{s.scheme.toUpperCase()} {s.number}</td><td className="px-4 py-1.5">{s.validUntil ?? ""}{s.expired ? <Badge tone="danger">{t("exports.expired")}</Badge> : null}</td><td className="num px-4 py-1.5 text-right">{money(s.amount)}</td><td className="num px-4 py-1.5 text-right">{money(s.used)}</td><td className="num px-4 py-1.5 text-right font-medium">{money(s.balance)}</td><td className="px-4 py-1.5 text-right">{canEdit && !s.expired && Number(s.balance) > 0 ? <button type="button" className="text-xs text-primary" onClick={() => setUse({ id: s.id, usedOn: todayIso(), amount: "", purpose: "" })}>{t("exports.useScrip")}</button> : null}</td></tr>)}</tbody></table>
            {use ? (
              <form className="grid gap-3 border-t border-rule p-4 sm:grid-cols-4" onSubmit={(e) => { e.preventDefault(); act(async () => { await api(`/exports/scrips/${use.id}/use`, { method: "POST", body: { usedOn: use.usedOn, amount: use.amount, purpose: nul(use.purpose) } }); setUse(null); }); }}>
                <Field label={t("exports.usedOn")}><Input type="date" value={use.usedOn} onChange={(e) => setUse({ ...use, usedOn: e.target.value })} required /></Field>
                <Field label={t("exports.amount")}><Input inputMode="decimal" value={use.amount} onChange={(e) => setUse({ ...use, amount: e.target.value })} required /></Field>
                <Field label={t("exports.purpose")}><Input value={use.purpose} onChange={(e) => setUse({ ...use, purpose: e.target.value })} maxLength={120} /></Field>
                <div className="flex items-end gap-2"><Button type="submit" disabled={busy}>{t("exports.save")}</Button><Button type="button" variant="outline" onClick={() => setUse(null)}>{t("exports.cancel")}</Button></div>
              </form>
            ) : null}
            {canEdit ? (
              <form className="grid gap-3 border-t border-rule p-4 sm:grid-cols-5" onSubmit={(e) => { e.preventDefault(); act(async () => { await api("/exports/scrips", { method: "POST", body: { scheme, number: scrip.number, issuedOn: scrip.issuedOn, validUntil: nul(scrip.validUntil), amount: scrip.amount } }); setScrip({ ...scrip, number: "", validUntil: "", amount: "" }); }); }}>
                <Field label={t("exports.scheme")}><Select value={scheme} onChange={(e) => setScheme(e.target.value)}><option value="rodtep">RoDTEP</option><option value="rosctl">RoSCTL</option></Select></Field>
                <Field label={t("exports.scripNo")}><Input value={scrip.number} onChange={(e) => setScrip({ ...scrip, number: e.target.value })} maxLength={30} required /></Field>
                <Field label={t("exports.issuedOn")}><Input type="date" value={scrip.issuedOn} onChange={(e) => setScrip({ ...scrip, issuedOn: e.target.value })} required /></Field>
                <Field label={t("exports.validUntil")}><Input type="date" value={scrip.validUntil} onChange={(e) => setScrip({ ...scrip, validUntil: e.target.value })} /></Field>
                <Field label={t("exports.amount")}><Input inputMode="decimal" value={scrip.amount} onChange={(e) => setScrip({ ...scrip, amount: e.target.value })} required /></Field>
                <div className="sm:col-span-5"><Button type="submit" disabled={busy}>{t("exports.addScrip")}</Button></div>
              </form>
            ) : null}
          </Card>
        </>
      ) : null}

      {tab === "inverted" ? (
        <Card className="p-4">
          <p className="text-sm text-muted">{t("exports.inverted.help")}</p>
          <form className="mt-3 flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); setError(null); api<Refund>(`/exports/inverted-duty?from=${period.from}&to=${period.to}&outputRate=${period.outputRate}`).then(setRefund).catch(fail); }}>
            <Field label={t("exports.from")}><Input type="date" value={period.from} onChange={(e) => setPeriod({ ...period, from: e.target.value })} required /></Field>
            <Field label={t("exports.to")}><Input type="date" value={period.to} onChange={(e) => setPeriod({ ...period, to: e.target.value })} required /></Field>
            <Field label={t("exports.outputRate")}><Input inputMode="decimal" value={period.outputRate} onChange={(e) => setPeriod({ ...period, outputRate: e.target.value })} required /></Field>
            <Button type="submit">{t("exports.work")}</Button>
          </form>
          {refund ? (
            <dl className="mt-4 grid max-w-xl grid-cols-[1fr_auto] gap-x-6 gap-y-1 text-sm">
              {([["invertedTurnover", refund.invertedTurnover], ["adjustedTurnover", refund.adjustedTurnover], ["inputsBought", refund.inputsBought], ["netItc", refund.netItc], ["itcShare", refund.itcShare], ["taxPayableOnInverted", refund.taxPayableOnInverted]] as const).map(([k, v]) => <div key={k} className="contents"><dt>{t(`exports.inverted.${k}`)}</dt><dd className="num text-right">{money(v)}</dd></div>)}
              <dt className="border-t border-rule pt-1 font-medium">{t("exports.inverted.refund")}</dt><dd className="num border-t border-rule pt-1 text-right font-medium">{money(refund.refund)}</dd>
            </dl>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
}
