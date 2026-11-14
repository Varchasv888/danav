import { TrendingUp } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { DateFilter } from "@/components/DateFilter";
import { Badge, Card, PageHeader } from "@/components/ui";
import { fyStart, rupees, todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Fig { grossSales: string; discounts: string; returns: string; netSales: string; costOfGoods: string; grossMargin: string; commission: string; contribution: string; overhead: string; operatingProfit: string; marginPct: string | null }
interface Report { from: string; to: string; by: string; costing: "standard" | "actual"; costCoverage: number | null; basis: Record<string, "direct" | "estimated" | "allocated">; total: Fig; notCaptured: string[]; loyaltyFunded?: string; rows: (Fig & { name: string; qty: string })[] }

const BY = ["style", "brand", "item", "size", "customer", "store", "channel"] as const;
const LINES = ["grossSales", "discounts", "returns", "netSales", "costOfGoods", "grossMargin", "commission", "contribution", "overhead", "operatingProfit"] as const;

export async function generateMetadata() {
  return { title: (await getTranslations("profit"))("title") };
}

/** Gross sales down to operating profit, each figure marked as booked, estimated or allocated, by the cut the owner picks. */
export default async function ProfitabilityPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string; by?: string; costing?: string }> }) {
  const sp = await searchParams;
  const to = sp.to ?? todayIso();
  const from = sp.from ?? fyStart(to);
  const by = (BY as readonly string[]).includes(sp.by ?? "") ? sp.by! : "style";
  const costing = sp.costing === "actual" ? "actual" : "standard";
  const t = await getTranslations("profit");
  const r = await serverApi<Report>(`/reports/profitability?from=${from}&to=${to}&by=${by}&costing=${costing}`);
  const tone = { direct: "success", estimated: "warning", allocated: "neutral" } as const;
  return (
    <>
      <PageHeader icon={TrendingUp} title={t("title")} subtitle={t("subtitle")} actions={<DateFilter from={from} to={to} />} print />
      <div className="mb-3 flex flex-wrap gap-2">
        {BY.map((k) => <Link key={k} href={`/reports/profitability?from=${from}&to=${to}&by=${k}&costing=${costing}`} className={`rounded-lg border px-3 py-1.5 text-sm ${by === k ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-surface-2"}`}>{t(`by.${k}`)}</Link>)}
      </div>
      <div role="group" aria-label={t("costing.title")} className="mb-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted">{t("costing.title")}</span>
        {(["standard", "actual"] as const).map((k) => <Link key={k} href={`/reports/profitability?from=${from}&to=${to}&by=${by}&costing=${k}`} aria-current={costing === k ? "true" : undefined} className={`rounded-lg border px-3 py-1.5 ${costing === k ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-surface-2"}`}>{t(`costing.${k}`)}</Link>)}
        {costing === "actual" && r.costCoverage !== null ? <span className="text-muted">{t("costing.coverage", { pct: r.costCoverage })}</span> : null}
      </div>
      <Card className="mb-4 p-0">
        <table className="w-full max-w-2xl text-sm"><tbody>
          {LINES.map((k) => (
            <tr key={k} className={`border-b border-rule ${["netSales", "grossMargin", "contribution", "operatingProfit"].includes(k) ? "bg-surface-2/60 font-semibold" : ""}`}>
              <td className="px-5 py-2">{t(`lines.${k}`)}</td><td className="px-3"><Badge tone={tone[r.basis[k] ?? "direct"]}>{t(`basis.${r.basis[k] ?? "direct"}`)}</Badge></td>
              <td className="num px-5 py-2 text-right">{rupees(r.total[k])}</td>
            </tr>
          ))}
        </tbody></table>
        {Number(r.loyaltyFunded) ? <p className="px-5 py-2 text-xs text-muted">{t("loyaltyFunded", { amount: rupees(r.loyaltyFunded!) })}</p> : null}
        <p className="px-5 py-2 text-xs text-muted">{t("note", { missing: r.notCaptured.map((k) => t(`missing.${k}`)).join(", ") })}</p>
      </Card>
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="text-left text-xs text-muted"><tr className="border-b border-border"><th className="px-4 py-2 font-medium">{t(`by.${by}`)}</th><th className="px-3 py-2 text-right font-medium">{t("pieces")}</th>{(["netSales", "costOfGoods", "grossMargin", "commission", "overhead", "operatingProfit"] as const).map((k) => <th key={k} className="px-3 py-2 text-right font-medium">{t(`lines.${k}`)}</th>)}<th className="px-3 py-2 text-right font-medium">{t("marginPct")}</th></tr></thead>
            <tbody>{r.rows.map((x) => (
              <tr key={x.name} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{x.name}</td><td className="num px-3 py-1.5 text-right">{x.qty}</td>
                {(["netSales", "costOfGoods", "grossMargin", "commission", "overhead", "operatingProfit"] as const).map((k) => <td key={k} className={`num px-3 py-1.5 text-right ${k === "operatingProfit" && Number(x[k]) < 0 ? "text-danger" : ""}`}>{rupees(x[k])}</td>)}
                <td className="num px-3 py-1.5 text-right">{x.marginPct ? `${x.marginPct}%` : ""}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
