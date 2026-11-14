import { TrendingUp } from "lucide-react";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { DateFilter } from "@/components/DateFilter";
import { Card, PageHeader } from "@/components/ui";
import { localName, rupees, fyStart, todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Line { accountId: string; name: string; nameHi: string | null; amount: string }
interface PL { tradingIncome: Line[]; tradingExpense: Line[]; otherIncome: Line[]; otherExpense: Line[]; openingStock: string; closingStock: string; grossProfit: string; netProfit: string }
type Section = "tradingIncome" | "tradingExpense" | "otherIncome" | "otherExpense";

export async function generateMetadata() {
  return { title: (await getTranslations("nav"))("profitLoss") };
}

const lastYear = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCFullYear(d.getUTCFullYear() - 1);
  return d.toISOString().slice(0, 10);
};

export default async function ProfitLossPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string; compare?: string; pct?: string }> }) {
  const sp = await searchParams;
  const to = sp.to ?? todayIso();
  const from = sp.from ?? fyStart(to);
  const compare = sp.compare === "1";
  const showPct = sp.pct === "1";
  const t = await getTranslations();
  const locale = await getLocale();
  const [pl, prev] = await Promise.all([
    serverApi<PL>(`/reports/profit-loss?from=${from}&to=${to}`),
    compare ? serverApi<PL>(`/reports/profit-loss?from=${lastYear(from)}&to=${lastYear(to)}`) : Promise.resolve(null),
  ]);
  const cols = (compare ? 4 : 2) + (showPct ? 1 : 0);
  // Each line as a share of sales, the way an owner reads margins.
  const salesTotal = pl.tradingIncome.reduce((sum, l) => sum + Number(l.amount), 0);
  const pctCell = (v: string, cls = "px-5 py-2") => (showPct ? <td className={`num ${cls} text-right text-xs text-muted`}>{salesTotal ? `${((Number(v) / salesTotal) * 100).toFixed(1)}%` : "-"}</td> : null);
  const change = (now: string, before: string | undefined) => {
    const a = Number(now);
    const b = Number(before ?? 0);
    if (!b) return <span className="text-muted">-</span>;
    const c = ((a - b) / Math.abs(b)) * 100;
    return <span className={c >= 0 ? "text-success" : "text-danger"}>{c >= 0 ? "▲" : "▼"} {Math.abs(c).toFixed(1)}%</span>;
  };
  const amountCells = (now: string, before?: string) => (
    <>
      <td className="num px-5 py-2 text-right">{rupees(now)}</td>
      {pctCell(now)}
      {compare ? <><td className="num px-5 py-2 text-right text-muted">{before === undefined ? "-" : rupees(before)}</td><td className="num px-5 py-2 text-right text-xs">{change(now, before)}</td></> : null}
    </>
  );

  // Accounts in either year, so a ledger used only last year still shows with its figure.
  const section = (title: string, key: Section) => {
    const now = pl[key];
    const before = prev?.[key] ?? [];
    const ids = [...new Set([...now.map((l) => l.accountId), ...before.map((l) => l.accountId)])];
    return (
      <tbody>
        <tr className="bg-surface-2/60"><td colSpan={cols} className="px-5 py-2 text-xs font-semibold tracking-wide text-muted uppercase">{title}</td></tr>
        {ids.map((id) => {
          const a = now.find((l) => l.accountId === id);
          const b = before.find((l) => l.accountId === id);
          return (
            <tr key={id} className="border-b border-border">
              <td className="px-5 py-2">{localName((a ?? b)!, locale)}</td>
              {amountCells(a?.amount ?? "0", compare ? (b?.amount ?? "0") : undefined)}
            </tr>
          );
        })}
        {!ids.length ? <tr className="border-b border-border"><td colSpan={cols} className="px-5 py-2 text-muted">-</td></tr> : null}
      </tbody>
    );
  };
  const resultRow = (label: string, value: string, before?: string, strong = false) => (
    <tbody>
      <tr className={`border-b border-border ${strong ? "text-base font-semibold" : "font-medium"}`}>
        <td className="px-5 py-3">{label}</td>
        <td className={`num px-5 py-3 text-right ${Number(value) < 0 ? "text-danger" : "text-success"}`}>{rupees(String(Math.abs(Number(value))))}</td>
        {pctCell(value, "px-5 py-3")}
        {compare ? <><td className="num px-5 py-3 text-right text-muted">{before === undefined ? "-" : rupees(before)}</td><td className="num px-5 py-3 text-right text-xs">{change(value, before)}</td></> : null}
      </tr>
    </tbody>
  );
  const net = Number(pl.netProfit);
  // Periodic inventory: closing stock adds to gross profit, opening stock reduces it.
  const stockRow = (label: string, value: string, before?: string) =>
    Number(value) || Number(before ?? 0) ? (
      <tbody>
        <tr className="border-b border-border">
          <td className="px-5 py-2"><Link href="/inventory/stock" className="hover:text-primary hover:underline">{label}</Link></td>
          {amountCells(value, before)}
        </tr>
      </tbody>
    ) : null;
  const toggle = `/reports/profit-loss?from=${from}&to=${to}${compare ? "" : "&compare=1"}${showPct ? "&pct=1" : ""}`;
  const pctToggle = `/reports/profit-loss?from=${from}&to=${to}${compare ? "&compare=1" : ""}${showPct ? "" : "&pct=1"}`;

  return (
    <>
      <PageHeader icon={TrendingUp} print title={t("nav.profitLoss")} actions={
        <div className="flex flex-wrap items-end gap-3">
          <DateFilter from={from} to={to} extra={{ ...(compare ? { compare: "1" } : {}), ...(showPct ? { pct: "1" } : {}) }} />
          <Link href={pctToggle} className={`inline-flex h-9 items-center rounded-lg border px-3.5 text-sm font-medium ${showPct ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-surface-2"}`}>{t("ownerReports.percentOfSales")}</Link>
          <Link href={toggle} className={`inline-flex h-9 items-center rounded-lg border px-3.5 text-sm font-medium ${compare ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-surface-2"}`}>{t("ownerReports.compareLastYear")}</Link>
        </div>
      } />
      <Card className={`${compare ? "max-w-5xl" : "max-w-3xl"} p-0`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {compare ? (
              <thead>
                <tr className="border-b border-border text-xs text-muted">
                  <th className="px-5 py-2 text-left font-medium" />
                  <th className="px-5 py-2 text-right font-medium">{t("ownerReports.thisPeriod")}</th>
                  <th className="px-5 py-2 text-right font-medium">{t("ownerReports.sameLastYear")}</th>
                  <th className="px-5 py-2 text-right font-medium">{t("ownerReports.change")}</th>
                </tr>
              </thead>
            ) : null}
            {section(t("reports.tradingIncome"), "tradingIncome")}
            {stockRow(`${t("reports.closingStock")} (+)`, pl.closingStock, prev?.closingStock)}
            {section(t("reports.tradingExpense"), "tradingExpense")}
            {stockRow(`${t("reports.openingStock")} (−)`, pl.openingStock, prev?.openingStock)}
            {resultRow(Number(pl.grossProfit) < 0 ? `${t("reports.grossProfit")} (−)` : t("reports.grossProfit"), pl.grossProfit, prev?.grossProfit)}
            {section(t("reports.otherIncome"), "otherIncome")}
            {section(t("reports.otherExpense"), "otherExpense")}
            {resultRow(net < 0 ? t("reports.netLoss") : t("reports.netProfit"), pl.netProfit, prev?.netProfit, true)}
          </table>
        </div>
      </Card>
    </>
  );
}
