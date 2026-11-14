"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { todayIso } from "@/lib/format";
import { Alert, Badge, Button, Card, Field, Input, Select } from "../ui";

interface Option { id: string; name: string }
interface Exposure { totalExposure: string; overLimit: number; rows: { partyId: string; name: string; owed: string; overdue: string; unappliedReceipts: string; pendingOrders: string; exposure: string; limit: string | null; headroom: string | null; over: boolean }[] }
interface Calendar { total: string; buckets: { label: string; from: string | null; to: string | null; total: string; bills: { supplier: string; number: string; dueOn: string; amount: string }[] }[] }
interface Cheque { id: string; direction: string; party: string; chequeNo: string; chequeDate: string; amount: string; status: string; drawnOn: string | null }
interface Forecast { openingCash: string; shortfall: boolean; lowest: { week: number; balance: string }; weeks: { week: number; from: string; to: string; collections: string; payments: string; cheques: string; payroll: string; commitments: string; net: string; closing: string }[] }
interface Commitment { id: string; kind: string; direction: string; name: string; amount: string; firstDate: string; repeat: string; until: string | null; active: boolean }
interface Power { stock: string; receivablesUnder90: string; receivablesOver90: string; creditors: string; base: string; drawingPower: string; allowed: string; drawn: string; available: string; overDrawn: boolean }

const TABS = ["exposure", "suppliers", "cheques", "forecast", "commitments", "power"] as const;
type Tab = (typeof TABS)[number];
const NS = ["workcap.errors", "hr.errors"];

/** Credit exposure, supplier due dates, post-dated cheques, the cash forecast and the bank stock statement. */
export function WorkingCapital({ banks, parties, canEdit }: { banks: Option[]; parties: Option[]; canEdit: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const [tab, setTab] = useState<Tab>("exposure");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [exposure, setExposure] = useState<Exposure | null>(null);
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [cheques, setCheques] = useState<Cheque[]>([]);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [power, setPower] = useState<Power | null>(null);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [c, setC] = useState({ kind: "loan", direction: "out", name: "", amount: "", firstDate: "", repeat: "monthly", until: "" });
  const [pct, setPct] = useState("50");
  const [margin, setMargin] = useState("25");
  const [sanctioned, setSanctioned] = useState("0");
  const [f, setF] = useState({ direction: "received", partyId: "", bankAccountId: "", chequeNo: "", chequeDate: "", amount: "" });
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });
  useEffect(() => { setF((x) => ({ ...x, chequeDate: todayIso() })); setC((x) => ({ ...x, firstDate: todayIso() })); }, []);

  const fail = useCallback((err: unknown) => setError(errorText(t, err, NS)), [t]);
  const load = useCallback(() => {
    setError(null);
    if (tab === "exposure") api<Exposure>("/finance/credit-exposure").then(setExposure).catch(fail);
    if (tab === "suppliers") api<Calendar>("/finance/supplier-calendar").then(setCalendar).catch(fail);
    if (tab === "cheques") api<Cheque[]>("/finance/cheques").then(setCheques).catch(fail);
    if (tab === "forecast") api<Forecast>(`/finance/cash-forecast?weeks=8&overduePct=${pct}`).then(setForecast).catch(fail);
    if (tab === "commitments") api<Commitment[]>("/finance/commitments").then(setCommitments).catch(fail);
    if (tab === "power") api<Power>(`/finance/drawing-power?margin=${margin}&sanctioned=${sanctioned}`).then(setPower).catch(fail);
  }, [tab, pct, margin, sanctioned, fail]);
  useEffect(() => { load(); }, [load]);
  const act = async (fn: () => Promise<unknown>) => { setBusy(true); setError(null); try { await fn(); load(); } catch (err) { fail(err); } finally { setBusy(false); } };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="tablist">
        {TABS.map((k) => <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-lg border px-3 py-1.5 text-sm ${tab === k ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-surface-2"}`}>{t(`workcap.tabs.${k}`)}</button>)}
      </div>
      {error ? <Alert>{error}</Alert> : null}

      {tab === "exposure" && exposure ? (
        <Card className="p-0">
          <p className="px-4 py-2 text-sm text-muted">{t("workcap.exposure.help")}</p>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted"><tr className="border-y border-rule"><th className="px-4 py-1.5 font-medium">{t("workcap.customer")}</th><th className="px-4 py-1.5 text-right font-medium">{t("workcap.exposure.owed")}</th><th className="px-4 py-1.5 text-right font-medium">{t("workcap.exposure.overdue")}</th><th className="px-4 py-1.5 text-right font-medium">{t("workcap.exposure.receipts")}</th><th className="px-4 py-1.5 text-right font-medium">{t("workcap.exposure.orders")}</th><th className="px-4 py-1.5 text-right font-medium">{t("workcap.exposure.total")}</th><th className="px-4 py-1.5 text-right font-medium">{t("workcap.exposure.limit")}</th></tr></thead>
            <tbody>{exposure.rows.map((r) => (
              <tr key={r.partyId} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{r.name}</td><td className="num px-4 py-1.5 text-right">{money(r.owed)}</td><td className="num px-4 py-1.5 text-right">{Number(r.overdue) ? money(r.overdue) : ""}</td><td className="num px-4 py-1.5 text-right">{Number(r.unappliedReceipts) ? money(r.unappliedReceipts) : ""}</td><td className="num px-4 py-1.5 text-right">{Number(r.pendingOrders) ? money(r.pendingOrders) : ""}</td><td className="num px-4 py-1.5 text-right font-medium">{money(r.exposure)}</td>
                <td className="px-4 py-1.5 text-right">{r.limit ? <span className={r.over ? "font-semibold text-danger" : ""}>{money(r.limit)}{r.over ? ` (${t("workcap.exposure.over", { amount: money(String(-Number(r.headroom))) })})` : ""}</span> : <span className="text-muted">-</span>}</td></tr>
            ))}</tbody>
          </table>
        </Card>
      ) : null}

      {tab === "suppliers" && calendar ? (
        <Card className="p-0">
          <p className="px-4 py-2 text-sm text-muted">{t("workcap.suppliers.help")}</p>
          {calendar.buckets.filter((b) => Number(b.total) > 0).map((b) => (
            <div key={b.label} className="border-t border-border px-4 py-2 text-sm">
              <div className="flex items-center gap-3"><strong>{b.label === "overdue" ? t("workcap.suppliers.overdue") : b.label === "later" ? t("workcap.suppliers.later") : `${b.from} – ${b.to}`}</strong>{b.label === "overdue" ? <Badge tone="danger">{t("workcap.suppliers.late")}</Badge> : null}<span className="num ml-auto font-semibold">{money(b.total)}</span></div>
              <ul className="mt-1 text-xs text-muted">{b.bills.map((x, i) => <li key={i}>{x.dueOn} · {x.supplier} · {x.number} · {money(x.amount)}</li>)}</ul>
            </div>
          ))}
          {Number(calendar.total) === 0 ? <p className="px-4 py-6 text-center text-muted">{t("workcap.none")}</p> : null}
        </Card>
      ) : null}

      {tab === "cheques" ? (
        <>
          {canEdit ? (
            <Card>
              <form method="post" className="flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); void act(() => api("/finance/cheques", { body: f })); }}>
                <Field label={t("workcap.cheques.direction")} htmlFor="pc-dir"><Select id="pc-dir" value={f.direction} onChange={(e) => setF({ ...f, direction: e.target.value })} className="w-36"><option value="received">{t("workcap.cheques.received")}</option><option value="issued">{t("workcap.cheques.issued")}</option></Select></Field>
                <Field label={t("workcap.party")} htmlFor="pc-party"><Select id="pc-party" value={f.partyId} onChange={(e) => setF({ ...f, partyId: e.target.value })} required className="w-56"><option value="" />{parties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select></Field>
                <Field label={t("workcap.cheques.bank")} htmlFor="pc-bank"><Select id="pc-bank" value={f.bankAccountId} onChange={(e) => setF({ ...f, bankAccountId: e.target.value })} required className="w-48"><option value="" />{banks.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</Select></Field>
                <Field label={t("workcap.cheques.no")} htmlFor="pc-no"><Input id="pc-no" value={f.chequeNo} onChange={(e) => setF({ ...f, chequeNo: e.target.value })} maxLength={12} className="num w-28" required /></Field>
                <Field label={t("workcap.cheques.date")} htmlFor="pc-date"><Input id="pc-date" type="date" value={f.chequeDate} onChange={(e) => setF({ ...f, chequeDate: e.target.value })} required /></Field>
                <Field label={t("workcap.cheques.amount")} htmlFor="pc-amt"><Input id="pc-amt" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} inputMode="decimal" className="num w-32" required /></Field>
                <Button type="submit" disabled={busy || !f.partyId || !f.bankAccountId}>{t("workcap.cheques.add")}</Button>
              </form>
            </Card>
          ) : null}
          <Card className="p-0">
            {cheques.length ? <ul>{cheques.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-rule px-4 py-2 text-sm last:border-0">
                <Badge tone={c.direction === "received" ? "success" : "neutral"}>{t(`workcap.cheques.${c.direction}`)}</Badge><span className="font-medium">{c.party}</span><span className="font-mono text-xs">{c.chequeNo}</span><span className="text-muted">{c.chequeDate}</span><span className="num">{money(c.amount)}</span>
                <Badge tone={c.status === "pending" ? "warning" : c.status === "cleared" ? "success" : "neutral"}>{t(`workcap.cheques.status.${c.status}`)}</Badge>
                {canEdit && c.status === "pending" ? <span className="ml-auto flex gap-3">{(["cleared", "bounced", "cancelled"] as const).map((o) => <button key={o} type="button" disabled={busy} onClick={() => act(() => api(`/finance/cheques/${c.id}/settle`, { body: { outcome: o, date: todayIso() } }))} className="text-primary hover:underline">{t(`workcap.cheques.mark.${o}`)}</button>)}</span> : null}
              </li>
            ))}</ul> : <p className="px-4 py-6 text-center text-muted">{t("workcap.none")}</p>}
          </Card>
        </>
      ) : null}

      {tab === "forecast" && forecast ? (
        <Card className="p-0">
          <div className="flex flex-wrap items-end gap-4 border-b border-border px-4 py-3">
            <Field label={t("workcap.forecast.overdue")} htmlFor="fc-pct" hint={t("workcap.forecast.overdueHint")}><Input id="fc-pct" value={pct} onChange={(e) => setPct(e.target.value.replace(/\D/g, "").slice(0, 3))} className="num w-20" /></Field>
            <span className="pb-2 text-sm">{t("workcap.forecast.opening")}: <span className="num font-medium">{money(forecast.openingCash)}</span></span>
            {forecast.shortfall ? <Badge tone="danger">{t("workcap.forecast.short", { week: forecast.lowest.week, amount: money(forecast.lowest.balance) })}</Badge> : <Badge tone="success">{t("workcap.forecast.ok")}</Badge>}
          </div>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted"><tr className="border-b border-rule"><th className="px-4 py-1.5 font-medium">{t("workcap.forecast.week")}</th><th className="px-4 py-1.5 text-right font-medium">{t("workcap.forecast.in")}</th><th className="px-4 py-1.5 text-right font-medium">{t("workcap.forecast.out")}</th><th className="px-4 py-1.5 text-right font-medium">{t("workcap.forecast.cheques")}</th><th className="px-4 py-1.5 text-right font-medium">{t("workcap.forecast.payroll")}</th><th className="px-4 py-1.5 text-right font-medium">{t("workcap.forecast.commitments")}</th><th className="px-4 py-1.5 text-right font-medium">{t("workcap.forecast.closing")}</th></tr></thead>
            <tbody>{forecast.weeks.map((w) => (
              <tr key={w.week} className="border-b border-rule last:border-0"><td className="px-4 py-1.5 whitespace-nowrap">{w.from}</td><td className="num px-4 py-1.5 text-right">{money(w.collections)}</td><td className="num px-4 py-1.5 text-right">{money(w.payments)}</td><td className="num px-4 py-1.5 text-right">{money(w.cheques)}</td><td className="num px-4 py-1.5 text-right">{money(w.payroll)}</td><td className="num px-4 py-1.5 text-right">{money(w.commitments)}</td><td className={`num px-4 py-1.5 text-right font-medium ${Number(w.closing) < 0 ? "text-danger" : ""}`}>{money(w.closing)}</td></tr>
            ))}</tbody>
          </table>
        </Card>
      ) : null}

      {tab === "commitments" ? (
        <>
          {canEdit ? (
            <Card className="p-4">
              <p className="mb-3 text-sm text-muted">{t("workcap.commit.help")}</p>
              <form className="grid gap-3 sm:grid-cols-3" onSubmit={(e) => { e.preventDefault(); void act(async () => { await api("/finance/commitments", { body: { kind: c.kind, direction: c.direction, name: c.name, amount: c.amount, firstDate: c.firstDate, repeat: c.repeat, ...(c.until ? { until: c.until } : {}) } }); setC((x) => ({ ...x, name: "", amount: "", until: "" })); }); }}>
                <Field label={t("workcap.commit.kind")}><Select value={c.kind} onChange={(e) => setC({ ...c, kind: e.target.value })}><option value="loan">{t("workcap.commit.loan")}</option><option value="capex">{t("workcap.commit.capex")}</option><option value="other">{t("workcap.commit.other")}</option></Select></Field>
                <Field label={t("workcap.commit.direction")}><Select value={c.direction} onChange={(e) => setC({ ...c, direction: e.target.value })}><option value="out">{t("workcap.commit.out")}</option><option value="in">{t("workcap.commit.in")}</option></Select></Field>
                <Field label={t("workcap.commit.name")}><Input value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} minLength={2} maxLength={80} required /></Field>
                <Field label={t("workcap.commit.amount")}><Input value={c.amount} onChange={(e) => setC({ ...c, amount: e.target.value })} inputMode="decimal" className="num" required /></Field>
                <Field label={t("workcap.commit.first")}><Input type="date" value={c.firstDate} onChange={(e) => setC({ ...c, firstDate: e.target.value })} required /></Field>
                <Field label={t("workcap.commit.repeat")}><Select value={c.repeat} onChange={(e) => setC({ ...c, repeat: e.target.value })}><option value="once">{t("workcap.commit.once")}</option><option value="monthly">{t("workcap.commit.monthly")}</option></Select></Field>
                {c.repeat === "monthly" ? <Field label={t("workcap.commit.until")}><Input type="date" value={c.until} onChange={(e) => setC({ ...c, until: e.target.value })} /></Field> : null}
                <div className="sm:col-span-3"><Button type="submit" disabled={busy}>{t("workcap.commit.add")}</Button></div>
              </form>
            </Card>
          ) : null}
          <Card className="p-0">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted"><tr className="border-b border-rule"><th className="px-4 py-1.5 font-medium">{t("workcap.commit.name")}</th><th className="px-4 py-1.5 font-medium">{t("workcap.commit.kind")}</th><th className="px-4 py-1.5 font-medium">{t("workcap.commit.first")}</th><th className="px-4 py-1.5 font-medium">{t("workcap.commit.repeat")}</th><th className="px-4 py-1.5 text-right font-medium">{t("workcap.commit.amount")}</th><th className="px-4 py-1.5" /></tr></thead>
              <tbody>{commitments.filter((x) => x.active).map((x) => (
                <tr key={x.id} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{x.name}</td><td className="px-4 py-1.5">{t(`workcap.commit.${x.kind}`)}{x.direction === "in" ? ` (${t("workcap.commit.in")})` : ""}</td><td className="px-4 py-1.5">{x.firstDate}</td><td className="px-4 py-1.5">{t(`workcap.commit.${x.repeat}`)}{x.until ? ` ${x.until}` : ""}</td><td className="num px-4 py-1.5 text-right">{money(x.amount)}</td><td className="px-4 py-1.5 text-right">{canEdit ? <Button variant="ghost" disabled={busy} onClick={() => act(() => api(`/finance/commitments/${x.id}/stop`, { body: {} }))}>{t("workcap.commit.stop")}</Button> : null}</td></tr>
              ))}</tbody>
            </table>
            {commitments.some((x) => x.active) ? null : <p className="px-4 py-3 text-sm text-muted">{t("workcap.commit.none")}</p>}
          </Card>
        </>
      ) : null}

      {tab === "power" && power ? (
        <Card>
          <div className="mb-4 flex flex-wrap items-end gap-4">
            <Field label={t("workcap.power.margin")} htmlFor="dp-m"><Input id="dp-m" value={margin} onChange={(e) => setMargin(e.target.value)} inputMode="decimal" className="num w-24" /></Field>
            <Field label={t("workcap.power.sanctioned")} htmlFor="dp-s"><Input id="dp-s" value={sanctioned} onChange={(e) => setSanctioned(e.target.value)} inputMode="decimal" className="num w-36" /></Field>
          </div>
          <table className="w-full max-w-xl text-sm"><tbody>
            {([["stock", power.stock], ["receivablesUnder90", power.receivablesUnder90], ["creditors", `-${power.creditors}`], ["base", power.base], ["drawingPower", power.drawingPower], ["allowed", power.allowed], ["drawn", power.drawn], ["available", power.available]] as const).map(([k, v]) => (
              <tr key={k} className="border-b border-rule"><td className="py-1.5">{t(`workcap.power.${k}`)}</td><td className="num py-1.5 text-right font-medium">{money(v)}</td></tr>
            ))}
          </tbody></table>
          {power.overDrawn ? <p className="mt-2 text-sm text-danger">{t("workcap.power.overdrawn")}</p> : null}
          <p className="mt-3 text-xs text-muted">{t("workcap.power.note", { over: money(power.receivablesOver90) })}</p>
        </Card>
      ) : null}
    </div>
  );
}
