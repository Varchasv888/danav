"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { todayIso } from "@/lib/format";
import { Alert, Card, Field, Input, Select } from "../ui";

type Row = Record<string, string | number | null>;
interface Col { key: string; money?: boolean; num?: boolean; pct?: boolean }
interface View { rows: Row[]; cols: Col[]; foot?: Row }

const TABS = ["sales", "purchases", "stock", "years", "versus", "profit", "ratios", "vendors", "backlog"] as const;
type Tab = (typeof TABS)[number];
const DIMS = ["design", "item", "brand", "category", "party"] as const;
const NS = ["ownerreg.errors"];

/** The owner's registers and ratios, one tab each; every figure comes from the books, none is typed in. */
export function OwnerRegisters() {
  const t = useTranslations();
  const format = useFormatter();
  const [tab, setTab] = useState<Tab>("sales");
  const [grain, setGrain] = useState("month");
  const [dim, setDim] = useState<(typeof DIMS)[number]>("design");
  const [days, setDays] = useState("30");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [view, setView] = useState<View | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { const d = todayIso(); setTo(d); setFrom(`${d.slice(0, 4)}-01-01`); }, []);

  const fail = useCallback((err: unknown) => setError(errorText(t, err, NS)), [t]);
  const load = useCallback(() => {
    if (!from || !to) return;
    setError(null);
    const q = `from=${from}&to=${to}`;
    const set = (v: View) => setView(v);
    if (tab === "sales" || tab === "purchases") api<{ rows: Row[]; total: string; totalPieces: string }>(`/reports/register?kind=${tab}&grain=${grain}&${q}`).then((r) => set({ rows: r.rows, cols: [{ key: "period" }, { key: "pieces", num: true }, { key: "amount", money: true }], foot: { period: t("ownerreg.total"), pieces: r.totalPieces, amount: r.total } })).catch(fail);
    if (tab === "stock") api<{ rows: Row[]; opening: string; closing: string }>(`/reports/register?kind=stock&grain=${grain}&${q}`).then((r) => set({ rows: [{ period: t("ownerreg.opening"), pieceIn: null, pieceOut: null, balance: r.opening }, ...r.rows], cols: [{ key: "period" }, { key: "pieceIn", num: true }, { key: "pieceOut", num: true }, { key: "balance", num: true }] })).catch(fail);
    if (tab === "years") api<{ rows: Row[]; totals: Row }>(`/reports/year-comparison?year=${to.slice(0, 4)}`).then((r) => set({ rows: r.rows, cols: [{ key: "month", num: true }, { key: "sales", money: true }, { key: "salesLastYear", money: true }, { key: "salesGrowthPct", pct: true }, { key: "purchases", money: true }, { key: "purchasesLastYear", money: true }, { key: "purchasesGrowthPct", pct: true }], foot: { month: t("ownerreg.total"), ...r.totals } })).catch(fail);
    if (tab === "versus") api<{ rows: Row[]; totals: Row }>(`/reports/sales-vs-purchases?${q}`).then((r) => set({ rows: r.rows, cols: [{ key: "month" }, { key: "sales", money: true }, { key: "purchases", money: true }, { key: "difference", money: true }, { key: "purchasePctOfSales", pct: true }], foot: { month: t("ownerreg.total"), ...r.totals } })).catch(fail);
    if (tab === "profit") api<{ rows: Row[]; totals: Row }>(`/reports/profit-by?dim=${dim}&${q}`).then((r) => set({ rows: r.rows, cols: [{ key: "name" }, { key: "pieces", num: true }, { key: "sales", money: true }, { key: "cost", money: true }, { key: "margin", money: true }, { key: "marginPct", pct: true }], foot: { name: t("ownerreg.total"), ...r.totals } })).catch(fail);
    if (tab === "ratios") api<{ rows: Row[] }>(`/reports/stock-ratios?asOf=${to}&days=${days}`).then((r) => set({ rows: r.rows, cols: [{ key: "design" }, { key: "brand" }, { key: "stock", num: true }, { key: "sold", num: true }, { key: "coverDays", num: true }, { key: "sellThroughPct", pct: true }, { key: "sizeAvailabilityPct", pct: true }, { key: "flag" }] })).catch(fail);
    if (tab === "vendors") api<{ rows: Row[] }>(`/reports/vendor-analysis?${q}`).then((r) => set({ rows: r.rows, cols: [{ key: "supplier" }, { key: "bought", money: true }, { key: "ratePerPiece", money: true }, { key: "promisedDays", num: true }, { key: "actualDays", num: true }, { key: "fillRatePct", pct: true }, { key: "lateOrders", num: true }, { key: "returnedPct", pct: true }] })).catch(fail);
    if (tab === "backlog") api<{ rows: Row[]; pendingValue: string }>(`/reports/purchase-backlog?asOf=${to}`).then((r) => set({ rows: r.rows, cols: [{ key: "number" }, { key: "supplier" }, { key: "expectedOn" }, { key: "pendingQty", num: true }, { key: "pendingValue", money: true }, { key: "daysLate", num: true }], foot: { number: t("ownerreg.total"), pendingValue: r.pendingValue } })).catch(fail);
  }, [tab, grain, dim, days, from, to, t, fail]);
  useEffect(() => { setView(null); load(); }, [load]);

  const cell = (c: Col, v: string | number | null) => {
    if (v === null || v === undefined || v === "") return "";
    if (c.money) return format.number(Number(v), { style: "currency", currency: "INR" });
    if (c.pct) return `${v}%`;
    if (c.key === "flag") return t(`ownerreg.flags.${v}`);
    return String(v);
  };
  const showGrain = tab === "sales" || tab === "purchases" || tab === "stock";
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="tablist">
        {TABS.map((k) => <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-lg border px-3 py-1.5 text-sm ${tab === k ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-surface-2"}`}>{t(`ownerreg.tabs.${k}`)}</button>)}
      </div>
      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-3">
          {tab !== "ratios" && tab !== "backlog" && tab !== "years" ? <Field label={t("ownerreg.from")}><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></Field> : null}
          <Field label={tab === "ratios" || tab === "backlog" ? t("ownerreg.asOf") : tab === "years" ? t("ownerreg.year") : t("ownerreg.to")}><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></Field>
          {showGrain ? <Field label={t("ownerreg.grain")}><Select value={grain} onChange={(e) => setGrain(e.target.value)}><option value="day">{t("ownerreg.day")}</option><option value="month">{t("ownerreg.month")}</option></Select></Field> : null}
          {tab === "profit" ? <Field label={t("ownerreg.group")}><Select value={dim} onChange={(e) => setDim(e.target.value as (typeof DIMS)[number])}>{DIMS.map((d) => <option key={d} value={d}>{t(`ownerreg.dims.${d}`)}</option>)}</Select></Field> : null}
          {tab === "ratios" ? <Field label={t("ownerreg.days")}><Input inputMode="numeric" value={days} onChange={(e) => setDays(e.target.value)} /></Field> : null}
        </div>
        <p className="mt-2 text-sm text-muted">{t(`ownerreg.help.${tab}`)}</p>
      </Card>
      {error ? <Alert>{error}</Alert> : null}
      {view ? (
        <Card className="overflow-x-auto p-0">
          {view.rows.length === 0 ? <p className="p-4 text-sm text-muted">{t("ownerreg.empty")}</p> : (
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted"><tr className="border-y border-rule">{view.cols.map((c) => <th key={c.key} className={`px-4 py-1.5 font-medium ${c.money || c.num || c.pct ? "text-right" : ""}`}>{t(`ownerreg.cols.${c.key}`)}</th>)}</tr></thead>
              <tbody>{view.rows.map((r, i) => <tr key={i} className="border-b border-rule last:border-0">{view.cols.map((c) => <td key={c.key} className={`px-4 py-1.5 ${c.money || c.num || c.pct ? "num text-right" : ""}`}>{cell(c, r[c.key] ?? null)}</td>)}</tr>)}</tbody>
              {view.foot ? <tfoot><tr className="border-t border-rule font-medium">{view.cols.map((c) => <td key={c.key} className={`px-4 py-1.5 ${c.money || c.num || c.pct ? "num text-right" : ""}`}>{cell(c, view.foot![c.key] ?? null)}</td>)}</tr></tfoot> : null}
            </table>
          )}
        </Card>
      ) : null}
    </div>
  );
}
