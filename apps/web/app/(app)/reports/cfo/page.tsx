import clsx from "clsx";
import { Gauge } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { Button, Card, Field, Input, PageHeader } from "@/components/ui";
import { fyStart, rupeesIn, todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Metrics { revenue: string; costOfGoods: string; grossProfit: string; grossMarginPct: string | null; operatingExpenses: string; otherIncome: string; depreciation: string; ebitda: string; netProfit: string }
interface Cfo { from: string; to: string; previous: { from: string; to: string }; current: Metrics; last: Metrics; growth: Record<string, string | null>; months: { month: string; revenue: string; grossProfit: string; grossMarginPct: string | null }[] }
type Props = { searchParams: Promise<{ from?: string; to?: string; unit?: string }> };

export async function generateMetadata() {
  return { title: (await getTranslations("cfo"))("title") };
}

const ROWS = ["revenue", "costOfGoods", "grossProfit", "operatingExpenses", "otherIncome", "depreciation", "ebitda", "netProfit"] as const;
const STRONG = new Set(["grossProfit", "ebitda", "netProfit"]);

/** Revenue to net profit for the period against last year, and the gross margin month by month. */
export default async function CfoPage({ searchParams }: Props) {
  const sp = await searchParams;
  const valid = (d?: string) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : undefined);
  const to = valid(sp.to) ?? todayIso();
  const from = valid(sp.from) ?? fyStart(to);
  const unit = sp.unit === "lakh" ? "lakh" : "rupees";
  const rupees = (v: string | number) => rupeesIn(v, unit);
  const t = await getTranslations("cfo");
  const tc = await getTranslations("common");
  const tb = await getTranslations("books");
  const td = await getTranslations("dailySales");
  const format = await getFormatter();
  const r = await serverApi<Cfo>(`/reports/cfo?from=${from}&to=${to}`);
  const month = (ym: string) => format.dateTime(new Date(`${ym}-01T00:00:00`), { month: "short", year: "numeric" });
  const peak = Math.max(1, ...r.months.map((m) => Math.abs(Number(m.grossMarginPct ?? 0))));
  const growth = (k: string) => {
    const g = r.growth[k];
    if (g === null || g === undefined) return <span className="text-faint">-</span>;
    const n = Number(g);
    return <span className={clsx("num", n > 0 ? "text-success" : n < 0 ? "text-danger" : "text-muted")}>{n > 0 ? "+" : ""}{g}%</span>;
  };
  return (
    <>
      <PageHeader icon={Gauge} title={t("title")} subtitle={t("subtitle")} print />
      <form method="get" className="mb-4 flex flex-wrap items-end gap-3 print:hidden">
        <Field label={tc("from")} htmlFor="cf-from"><Input id="cf-from" type="date" name="from" defaultValue={from} /></Field>
        <Field label={tc("to")} htmlFor="cf-to"><Input id="cf-to" type="date" name="to" defaultValue={to} /></Field>
        <Field label={td("unit")} htmlFor="cf-unit"><select id="cf-unit" name="unit" defaultValue={unit} className="h-9 rounded-md border border-border bg-surface px-2 text-sm"><option value="rupees">{td("inRupees")}</option><option value="lakh">{td("inLakhs")}</option></select></Field>
        <Button type="submit" variant="outline">{tb("show")}</Button>
      </form>
      <Card className="mb-4 p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-[0.9286rem]">
            <thead>
              <tr className="border-b border-border bg-surface-2 text-left text-xs font-semibold text-muted">
                <th className="px-4 py-1.5" />
                <th className="px-4 py-1.5 text-right">{t("thisPeriod")}<div className="font-normal">{r.from} to {r.to}</div></th>
                <th className="px-4 py-1.5 text-right">{t("lastYear")}<div className="font-normal">{r.previous.from} to {r.previous.to}</div></th>
                <th className="px-4 py-1.5 text-right">{t("growth")}</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((k) => (
                <tr key={k} className={clsx("border-b border-rule last:border-0", STRONG.has(k) && "bg-surface-2/60 font-semibold")}>
                  <td className="px-4 py-2">{t(k)}{k === "grossProfit" && r.current.grossMarginPct ? <span className="ml-2 text-xs font-normal text-muted">{t("grossMargin")} {r.current.grossMarginPct}%</span> : null}</td>
                  <td className="num px-4 py-2 text-right">{rupees(r.current[k])}</td>
                  <td className="num px-4 py-2 text-right text-muted">{rupees(r.last[k])}</td>
                  <td className="px-4 py-2 text-right">{growth(k)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card className="p-0">
        <h2 className="border-b border-border px-4 py-2 font-semibold">{t("monthly")}</h2>
        <ul>
          {r.months.map((m) => (
            <li key={m.month} className="grid grid-cols-[6rem_1fr_5rem] items-center gap-3 border-b border-rule px-4 py-2 text-[0.9286rem] last:border-0 sm:grid-cols-[7rem_1fr_6rem_9rem]">
              <span>{month(m.month)}</span>
              <span className="h-2.5 rounded-sm bg-surface-2" aria-hidden><span className={clsx("block h-full rounded-sm", Number(m.grossMarginPct ?? 0) < 0 ? "bg-danger" : "bg-primary")} style={{ width: `${m.grossMarginPct === null ? 0 : Math.min(100, (Math.abs(Number(m.grossMarginPct)) / peak) * 100)}%` }} /></span>
              <span className="num text-right font-semibold">{m.grossMarginPct === null ? "-" : `${m.grossMarginPct}%`}</span>
              <span className="num hidden text-right text-muted sm:block">{rupees(m.revenue)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
