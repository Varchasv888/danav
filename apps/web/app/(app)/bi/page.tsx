import clsx from "clsx";
import { ArrowDownRight, ArrowUpRight, BarChart3 } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { businessDate } from "@varchasv/domain";
import type { InsightsData } from "@/components/insights/Insights";
import { Badge, Card, PageHeader } from "@/components/ui";
import { BarList, TrendChart } from "@/components/charts/Charts";
import { BI_SECTIONS } from "@/lib/bi-catalogue";
import { labelOf } from "@/lib/modules-nav";
import { compactRupees } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("bi"))("title") };
}

/** Change against the same days last year, with an arrow and the figure, never colour alone. */
function Change({ now, before, points = false }: { now: number; before: number; points?: boolean }) {
  if (!before && !points) return null;
  const change = points ? now - before : ((now - before) / Math.abs(before)) * 100;
  if (!Number.isFinite(change)) return null;
  const up = change >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={clsx("inline-flex items-center gap-0.5 text-xs font-medium", up ? "text-success" : "text-danger")}>
      <Icon className="size-3.5" aria-hidden />{up ? "+" : "-"}{Math.abs(change).toFixed(1)}{points ? " pts" : "%"}
    </span>
  );
}

/**
 * The Business Intelligence home: a strip of the headline figures from the live books for the month so far
 * (each one linked to its definition), then the fifteen sections of the workspace with an honest statement of
 * how much of each exists. Nothing on this page is typed in; every number comes from the insights service.
 */
export default async function BiHome({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const t = await getTranslations("bi");
  const root = await getTranslations();
  const today = businessDate();
  const q = await searchParams;
  const ok = (v?: string) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : undefined);
  const y = Number(today.slice(0, 4)), m = Number(today.slice(5, 7));
  const fy = m >= 4 ? y : y - 1;
  const lastEnd = new Date(Date.UTC(y, m - 1, 0)).toISOString().slice(0, 10);
  const presets = [
    { key: "thisMonth", from: `${today.slice(0, 7)}-01`, to: today },
    { key: "lastMonth", from: `${lastEnd.slice(0, 7)}-01`, to: lastEnd },
    { key: "thisFy", from: `${fy}-04-01`, to: today },
    { key: "lastFy", from: `${fy - 1}-04-01`, to: `${fy}-03-31` },
  ];
  const from = ok(q.from) ?? presets[0]!.from;
  const to = ok(q.to) ?? presets[0]!.to;
  const d = await serverApi<InsightsData>(`/analytics/insights?from=${from}&to=${to}`);
  const k = d.kpis, p = d.previous, n = Number;
  const tiles = [
    { id: "sales", value: compactRupees(k.sales), change: <Change now={n(k.sales)} before={n(p.sales)} /> },
    { id: "profitPct", value: k.profitPct === null ? "-" : `${k.profitPct}%`, change: k.profitPct !== null && p.profitPct !== null ? <Change now={n(k.profitPct)} before={n(p.profitPct)} points /> : null },
    { id: "bills", value: n(k.bills).toLocaleString("en-IN"), change: <Change now={n(k.bills)} before={n(p.bills)} /> },
    { id: "avgBill", value: compactRupees(k.avgBill), change: <Change now={n(k.avgBill)} before={n(p.avgBill)} /> },
    { id: "purchases", value: compactRupees(k.purchases), change: <Change now={n(k.purchases)} before={n(p.purchases)} /> },
    { id: "stockValue", value: compactRupees(k.stockValue), change: null },
    { id: "receivable", value: compactRupees(k.receivable), change: null },
    { id: "payable", value: compactRupees(k.payable), change: null },
  ];
  const label = (p: string) => (d.trend.by === "month" ? new Date(`${p}-01T00:00:00Z`).toLocaleDateString("en-IN", { month: "short", year: "2-digit", timeZone: "UTC" }) : new Date(`${p}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" }));
  const trend = [{ name: t("panels.salesName"), points: d.trend.points.map((x) => ({ label: label(x.period), value: n(x.amount) })) }];
  const tone = { live: "success", partial: "warning", planned: "neutral" } as const;

  return (
    <>
      <PageHeader icon={BarChart3} title={t("title")} subtitle={t("subtitle")} actions={
        <Link href="/insights" className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-[0.9286rem] font-semibold text-on-primary hover:bg-primary-hover">{t("openInsights")}</Link>
      } />
      <section aria-labelledby="bi-headline" className="mb-6">
        <h2 id="bi-headline" className="text-[0.9286rem] font-semibold">{t("headline")}</h2>
        <nav aria-label={t("period")} className="my-2 flex flex-wrap gap-1.5">
          {presets.map((x) => {
            const on = x.from === from && x.to === to;
            return <Link key={x.key} href={`/bi?from=${x.from}&to=${x.to}`} aria-current={on ? "true" : undefined} className={clsx("inline-flex h-8 items-center rounded-md border px-3 text-[0.8571rem] font-medium", on ? "border-primary bg-primary-soft text-primary" : "border-border-input text-text hover:bg-surface-2")}>{t(`presets.${x.key}`)}</Link>;
          })}
          <span className="ml-1 inline-flex h-8 items-center text-[0.8571rem] text-muted">{from} to {to}</span>
        </nav>
        <p className="mb-3 text-xs text-muted">{t("headlineNote")} <Link href="/bi/kpis" className="text-primary hover:underline">{t("definitions")}</Link></p>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {tiles.map((x) => (
            <Card key={x.id} className="flex flex-col gap-1">
              <Link href={`/bi/kpis#${x.id}`} className="text-sm text-muted hover:text-primary hover:underline">{t(`kpi.${x.id}.name`)}</Link>
              <span className="num text-2xl font-semibold">{x.value}</span>
              {x.change}
            </Card>
          ))}
        </div>
      </section>
      <section aria-labelledby="bi-trend" className="mb-6 grid gap-3 xl:grid-cols-3">
        <Card className="min-w-0 xl:col-span-2">
          <h2 id="bi-trend" className="font-semibold">{t("panels.trend")}</h2>
          <p className="mb-3 text-xs text-muted">{t(d.trend.by === "month" ? "panels.byMonth" : "panels.byDay")}</p>
          <TrendChart title={t("panels.trend")} series={trend} unit="rupees" />
        </Card>
        <Card className="min-w-0">
          <h2 className="font-semibold">{t("panels.brands")}</h2>
          <p className="mb-3 text-xs text-muted">{t("panels.byValue")}</p>
          <BarList rows={d.brands.slice(0, 6).map((r) => ({ name: r.name, value: n(r.amount), note: `${r.qty} pcs` }))} unit="rupees" empty={t("panels.noSales")} />
        </Card>
      </section>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {BI_SECTIONS.map((s) => (
          <Card key={s.id} className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold">{t(`sections.${s.id}.name`)}</h2>
              <Badge tone={tone[s.status]}>{t(`status.${s.status}`)}</Badge>
            </div>
            <p className="text-sm text-muted">{t(`sections.${s.id}.desc`)}</p>
            {s.links.length ? (
              <ul className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-1 text-sm">
                {s.links.map((h) => {
                  const key = labelOf(h);
                  return <li key={h}><Link href={h} className="text-primary hover:underline">{key ? root(key) : h}</Link></li>;
                })}
              </ul>
            ) : <p className="mt-auto pt-1 text-xs text-faint">{t("nothingYet")}</p>}
          </Card>
        ))}
      </div>
    </>
  );
}
