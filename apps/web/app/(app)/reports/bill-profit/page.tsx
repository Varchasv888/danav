import { getTranslations } from "next-intl/server";
import { ReportList } from "@/components/reports/ReportList";
import { PageHeader } from "@/components/ui";
import { rupees, todayIso } from "@/lib/format";
import { periodRange } from "@/lib/report-periods";
import { serverApi } from "@/lib/server-api";

interface Row { id: string; date: string; number: string; party: string | null; sale: string; cost: string; profit: string; costEstimated: boolean; href: string }
interface Data { rows: Row[]; totals: { sale: string; profit: string } }

export async function generateMetadata() {
  return { title: (await getTranslations("reportLists"))("billProfit") };
}

/** Profit on each sale invoice: what it brought in less what the goods cost. */
export default async function BillProfitReport({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const sp = await searchParams;
  const t = await getTranslations("reportLists");
  const today = todayIso();
  const range = periodRange("thisMonth", today)!;
  const from = sp.from ?? range.from, to = sp.to ?? range.to;
  const data = await serverApi<Data>(`/reports/bill-profit?from=${from}&to=${to}`);
  return (
    <>
      <PageHeader title={t("billProfit")} subtitle={t("billProfitHint")} />
      <ReportList
        title={t("billProfit")} from={from} to={to} today={today} fileName="bill-wise-profit" empty={t("none")}
        columns={[
          { key: "date", label: t("c.date"), kind: "date" }, { key: "number", label: t("c.invoice"), link: true }, { key: "party", label: t("c.party") },
          { key: "sale", label: t("c.saleAmount"), kind: "money" }, { key: "cost", label: t("c.cost"), kind: "money" }, { key: "profit", label: t("c.profit"), kind: "money" }, { key: "basis", label: t("c.basis"), kind: "tag" },
        ]}
        rows={data.rows.map((r) => ({ ...r, basis: r.costEstimated ? t("estimated") : t("actual") }))}
        footer={[{ label: t("f.sale"), value: rupees(data.totals.sale) }, { label: t("f.profit"), value: rupees(data.totals.profit), tone: Number(data.totals.profit) < 0 ? "out" : "in" }]}
      />
      <p className="mt-2 text-xs text-muted">{t("billProfitNote")}</p>
    </>
  );
}
