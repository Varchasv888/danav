"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { compactRupees, rupees } from "@/lib/format";
import { Button, Card, Input } from "../ui";

type Ranked = { name: string; amount: string; qty: string };
type Head = { sales: string; pieces: string; bills: number; avgBill: string; avgRate: string; grossProfit: string; profitPct: string | null; purchases: string; purchasedPieces: string };
export interface InsightsData {
  from: string; to: string; lastYear: { from: string; to: string };
  kpis: Head & { stockValue: string; stockPieces: string; receivable: string; payable: string };
  previous: Head;
  trend: { by: "day" | "month"; points: { period: string; amount: string }[] };
  weekday: { day: number; amount: string; qty: string }[];
  hourly: { hour: number; amount: string; bills: number }[];
  salesmen: Ranked[]; designs: Ranked[]; brands: Ranked[]; customers: Ranked[];
  tenders: { mode: string; amount: string }[];
  ageing: { key: string; amount: string; qty: string }[];
}

export { compactRupees };
const pct = (part: number, whole: number) => (whole > 0 ? `${((part / whole) * 100).toFixed(1)}%` : "");

/** Change against last year, with an arrow and a word, never colour alone. */
function Delta({ now, before, points = false, upIsGood = true }: { now: number; before: number; points?: boolean; upIsGood?: boolean }) {
  const t = useTranslations("insights");
  if (!before && !points) return <span className="text-xs text-muted">{t("noLastYear")}</span>;
  const change = points ? now - before : ((now - before) / Math.abs(before)) * 100;
  if (!Number.isFinite(change)) return null;
  const up = change >= 0;
  const good = up === upIsGood;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${good ? "text-success" : "text-danger"}`}>
      <Icon className="size-3.5" aria-hidden />{Math.abs(change).toFixed(1)}{points ? ` ${t("pts")}` : "%"} <span className="font-normal text-muted">{t("vsLastYear")}</span>
    </span>
  );
}

function Tile({ label, value, sub, children }: { label: string; value: string; sub?: string | undefined; children?: React.ReactNode }) {
  return (
    <Card className="flex flex-col gap-1">
      <span className="text-sm text-muted">{label}</span>
      <span className="num text-2xl font-semibold">{value}</span>
      {sub ? <span className="text-xs text-muted">{sub}</span> : null}
      {children}
    </Card>
  );
}

/** Columns for one measure over a sequence (days, months, weekdays): one hue, a hover tooltip, the peak labelled. */
function Columns({ points, label, height = 160, drill }: { points: { key: string; label: string; amount: number; tip: string }[]; label: string; height?: number; drill?: (key: string) => string }) {
  const t = useTranslations("insights");
  const [hover, setHover] = useState<number | null>(null);
  const [table, setTable] = useState(false);
  const [kind, setKind] = useState<"bars" | "line">("bars");
  const max = Math.max(...points.map((p) => p.amount), 1);
  const peak = points.findIndex((p) => p.amount === max);
  if (!points.length) return <p className="py-8 text-center text-sm text-muted">{t("noSales")}</p>;
  return (
    <div className="flex flex-col gap-2">
      <div className="relative flex items-end gap-0.5 border-b border-border" style={{ height }} role="img" aria-label={label} onMouseLeave={() => setHover(null)}>
        {points.map((p, i) => (
          <div key={p.key} className="relative flex h-full flex-1 cursor-default items-end justify-center" onMouseEnter={() => setHover(i)}>
            {kind === "bars" ? (drill
              ? <a href={drill(p.key)} aria-label={`${p.label}: ${p.tip}`} className={`block w-full max-w-6 rounded-t-[4px] ${hover === i ? "bg-primary-hover" : "bg-primary"}`} style={{ height: `${Math.max((p.amount / max) * 100, p.amount > 0 ? 1 : 0)}%` }} />
              : <div className={`w-full max-w-6 rounded-t-[4px] ${hover === i ? "bg-primary-hover" : "bg-primary"}`} style={{ height: `${Math.max((p.amount / max) * 100, p.amount > 0 ? 1 : 0)}%` }} />) : (
              <span className="absolute inset-x-0 flex justify-center" style={{ bottom: `${(p.amount / max) * 100}%` }}>{drill ? <a href={drill(p.key)} aria-label={`${p.label}: ${p.tip}`} className={`size-2.5 rounded-full ${hover === i ? "bg-primary-hover" : "bg-primary"}`} /> : <span className={`size-2.5 rounded-full ${hover === i ? "bg-primary-hover" : "bg-primary"}`} />}</span>
            )}
            {i === peak && hover === null ? <span className="num absolute -top-5 text-xs whitespace-nowrap text-muted">{compactRupees(p.amount)}</span> : null}
            {hover === i ? (
              <span className="num absolute -top-12 z-10 rounded-md border border-border bg-surface px-2 py-1 text-xs whitespace-nowrap shadow-sm">
                <b className="block">{p.label}</b>{p.tip}
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted"><span>{points[0]!.label}</span><span>{points[points.length - 1]!.label}</span></div>
      <div className="flex gap-4">
        <button type="button" onClick={() => setTable(!table)} className="text-xs text-primary hover:underline">{table ? t("hideTable") : t("showTable")}</button>
        <button type="button" onClick={() => setKind(kind === "bars" ? "line" : "bars")} className="text-xs text-primary hover:underline">{kind === "bars" ? t("asDots") : t("asBars")}</button>
      </div>
      {table ? (
        <table className="text-sm">
          <tbody>{points.map((p) => <tr key={p.key} className="border-b border-border last:border-0"><td className="py-1 pr-4">{p.label}</td><td className="num py-1 text-right">{rupees(p.amount)}</td></tr>)}</tbody>
        </table>
      ) : null}
    </div>
  );
}

/** A ranked list: one bar per name, the value at the bar's end and its share of the total. */
function BarList({ rows, total, empty }: { rows: { name: string; amount: number; extra?: string | undefined }[]; total: number; empty: string }) {
  const max = Math.max(...rows.map((r) => r.amount), 1);
  if (!rows.length) return <p className="py-6 text-center text-sm text-muted">{empty}</p>;
  return (
    <ul className="flex flex-col gap-2.5 text-sm">
      {rows.map((r) => (
        <li key={r.name} className="flex flex-col gap-1" title={`${r.name}: ${rupees(r.amount)}${r.extra ? ` · ${r.extra}` : ""}`}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="truncate">{r.name}</span>
            <span className="num shrink-0 text-muted">{compactRupees(r.amount)} <span className="text-xs">{pct(r.amount, total)}</span></span>
          </div>
          <div className="h-2 rounded-full bg-surface-2"><div className="h-2 rounded-full bg-primary" style={{ width: `${(r.amount / max) * 100}%` }} /></div>
        </li>
      ))}
    </ul>
  );
}

function Panel({ title, sub, children, className = "" }: { title: string; sub?: string; children: React.ReactNode; className?: string }) {
  return (
    <Card className={`flex flex-col gap-4 ${className}`}>
      <div><h2 className="font-semibold">{title}</h2>{sub ? <p className="text-xs text-muted">{sub}</p> : null}</div>
      {children}
    </Card>
  );
}

const iso = (d: Date) => d.toISOString().slice(0, 10);
function presets(today: string) {
  const y = Number(today.slice(0, 4));
  const m = Number(today.slice(5, 7));
  const fy = m >= 4 ? y : y - 1;
  const monthStart = `${today.slice(0, 7)}-01`;
  const lastMonthEnd = iso(new Date(Date.UTC(y, m - 1, 0)));
  const lastMonthStart = `${lastMonthEnd.slice(0, 7)}-01`;
  const yearAgo = iso(new Date(Date.UTC(y - 1, m - 1, Number(today.slice(8)) + 1)));
  return {
    thisMonth: { from: monthStart, to: today }, lastMonth: { from: lastMonthStart, to: lastMonthEnd },
    thisFy: { from: `${fy}-04-01`, to: today }, lastFy: { from: `${fy - 1}-04-01`, to: `${fy}-03-31` }, last12: { from: yearAgo, to: today },
  };
}

export function Insights({ data, today }: { data: InsightsData; today: string }) {
  const t = useTranslations("insights");
  const format = useFormatter();
  const router = useRouter();
  const path = usePathname();
  const [from, setFrom] = useState(data.from);
  const [to, setTo] = useState(data.to);
  const go = (f: string, tt: string) => router.push(`${path}?from=${f}&to=${tt}`);
  const p = presets(today);
  const k = data.kpis;
  const prev = data.previous;
  const n = Number;
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { day: "numeric", month: "short" });
  const month = (ym: string) => format.dateTime(new Date(`${ym}-01T00:00:00`), { month: "short", year: "2-digit" });
  const salesTotal = n(k.sales);
  const tenderTotal = data.tenders.reduce((s, x) => s + n(x.amount), 0);
  const ageTotal = data.ageing.reduce((s, x) => s + n(x.amount), 0);
  const ageMax = Math.max(...data.ageing.map((x) => n(x.amount)), 1);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-2">
        {(Object.keys(p) as (keyof typeof p)[]).map((key) => {
          const on = p[key].from === data.from && p[key].to === data.to;
          return <Button key={key} variant={on ? "primary" : "outline"} className="h-8 text-xs" onClick={() => go(p[key].from, p[key].to)}>{t(`presets.${key}`)}</Button>;
        })}
        <form onSubmit={(e) => { e.preventDefault(); if (from && to) go(from, to); }} className="flex items-center gap-2">
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-8 w-40 text-xs" aria-label={t("from")} />
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-8 w-40 text-xs" aria-label={t("to")} />
          <Button type="submit" variant="ghost" className="h-8 text-xs">{t("apply")}</Button>
        </form>
      </div>
      <p className="-mt-3 text-xs text-muted">{t("compared", { from: format.dateTime(new Date(`${data.lastYear.from}T00:00:00`), { dateStyle: "medium" }), to: format.dateTime(new Date(`${data.lastYear.to}T00:00:00`), { dateStyle: "medium" }) })}</p>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile label={t("kpi.sales")} value={compactRupees(k.sales)} sub={t("beforeTax")}><Delta now={n(k.sales)} before={n(prev.sales)} /></Tile>
        <Tile label={t("kpi.pieces")} value={n(k.pieces).toLocaleString("en-IN")} sub={t("billsCount", { n: k.bills })}><Delta now={n(k.pieces)} before={n(prev.pieces)} /></Tile>
        <Tile label={t("kpi.avgBill")} value={compactRupees(k.avgBill)} sub={t("avgRate", { v: compactRupees(k.avgRate) })}><Delta now={n(k.avgBill)} before={n(prev.avgBill)} /></Tile>
        <Tile label={t("kpi.profit")} value={k.profitPct === null ? "-" : `${k.profitPct}%`} sub={t("onCost", { v: compactRupees(k.grossProfit) })}>
          {k.profitPct !== null && prev.profitPct !== null ? <Delta now={n(k.profitPct)} before={n(prev.profitPct)} points /> : null}
        </Tile>
        <Tile label={t("kpi.purchases")} value={compactRupees(k.purchases)} sub={t("piecesCount", { n: n(k.purchasedPieces).toLocaleString("en-IN") })}><Delta now={n(k.purchases)} before={n(prev.purchases)} upIsGood={false} /></Tile>
        <Tile label={t("kpi.stock")} value={compactRupees(k.stockValue)} sub={t("piecesCount", { n: n(k.stockPieces).toLocaleString("en-IN") })} />
        <Tile label={t("kpi.receivable")} value={compactRupees(k.receivable)} sub={t("owedToUs")} />
        <Tile label={t("kpi.payable")} value={compactRupees(k.payable)} sub={t("weOwe")} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title={t("trend")} sub={t(data.trend.by === "month" ? "byMonth" : "byDay")} className="xl:col-span-2">
          <Columns label={t("trend")} drill={(key) => (data.trend.by === "month" ? `/reports/sales-register?from=${key}-01&to=${key}-${String(new Date(Date.UTC(Number(key.slice(0, 4)), Number(key.slice(5, 7)), 0)).getUTCDate()).padStart(2, "0")}` : `/reports/sales-register?from=${key}&to=${key}`)} points={data.trend.points.map((x) => ({ key: x.period, label: data.trend.by === "month" ? month(x.period) : day(x.period), amount: n(x.amount), tip: rupees(x.amount) }))} />
        </Panel>
        <Panel title={t("weekday")} sub={t("weekdaySub")}>
          <Columns label={t("weekday")} height={140} points={data.weekday.map((w) => ({ key: String(w.day), label: t(`days.d${w.day}`), amount: n(w.amount), tip: `${rupees(w.amount)} · ${t("piecesCount", { n: w.qty })}` }))} />
        </Panel>
      </div>

      {data.hourly.some((h) => h.bills > 0) ? (
        <Panel title={t("hourly")} sub={t("hourlySub")}>
          <Columns label={t("hourly")} height={140} points={data.hourly.filter((h) => h.hour >= 7 && h.hour <= 23).map((h) => ({ key: String(h.hour), label: String(h.hour), amount: n(h.amount), tip: `${rupees(h.amount)} · ${t("billsCount", { n: h.bills })}` }))} />
        </Panel>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Panel title={t("designs")} sub={t("byValue")}><BarList rows={data.designs.map((r) => ({ name: r.name, amount: n(r.amount), extra: t("piecesCount", { n: r.qty }) }))} total={salesTotal} empty={t("noSales")} /></Panel>
        <Panel title={t("salesmen")} sub={t("salesmenSub")}><BarList rows={data.salesmen.map((r) => ({ name: r.name, amount: n(r.amount), extra: t("piecesCount", { n: r.qty }) }))} total={salesTotal} empty={t("noSalesmen")} /></Panel>
        <Panel title={t("customers")} sub={t("customersSub")}><BarList rows={data.customers.map((r) => ({ name: r.name, amount: n(r.amount) }))} total={salesTotal} empty={t("noSales")} /></Panel>
        <Panel title={t("brands")} sub={t("byValue")}><BarList rows={data.brands.map((r) => ({ name: r.name, amount: n(r.amount), extra: t("piecesCount", { n: r.qty }) }))} total={salesTotal} empty={t("noSales")} /></Panel>
        <Panel title={t("tenders")} sub={t("tendersSub")}><BarList rows={data.tenders.map((r) => ({ name: t.has(`modes.${r.mode}`) ? t(`modes.${r.mode}`) : r.mode, amount: n(r.amount) }))} total={tenderTotal} empty={t("noSales")} /></Panel>
        <Panel title={t("ageing")} sub={t("ageingSub")}>
          <table className="text-sm">
            <thead><tr className="text-left text-xs text-muted"><th className="pb-1 font-medium">{t("age")}</th><th className="pb-1 text-right font-medium">{t("pieces")}</th><th className="pb-1 text-right font-medium">{t("value")}</th><th className="w-24 pb-1" /></tr></thead>
            <tbody>
              {data.ageing.map((b) => (
                <tr key={b.key} className="border-t border-border">
                  <td className="py-1.5 pr-3">{t(`ages.${b.key}`)}</td>
                  <td className="num py-1.5 text-right">{n(b.qty).toLocaleString("en-IN")}</td>
                  <td className="num py-1.5 pl-3 text-right">{compactRupees(b.amount)} <span className="text-xs text-muted">{pct(n(b.amount), ageTotal)}</span></td>
                  <td className="py-1.5 pl-3"><div className="h-2 rounded-full bg-surface-2"><div className="h-2 rounded-full bg-primary" style={{ width: `${(n(b.amount) / ageMax) * 100}%` }} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
