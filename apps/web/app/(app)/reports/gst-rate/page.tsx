import { getTranslations } from "next-intl/server";
import { ReportList } from "@/components/reports/ReportList";
import { PageHeader } from "@/components/ui";
import { rupees, todayIso } from "@/lib/format";
import { periodRange } from "@/lib/report-periods";
import { serverApi } from "@/lib/server-api";

interface Row { rate: string; saleTaxable: string; taxOut: string; purchaseTaxable: string; taxIn: string }
interface Data { rows: Row[]; totals: { taxIn: string; taxOut: string } }

export async function generateMetadata() {
  return { title: (await getTranslations("reportLists"))("gstRate") };
}

/** Tax by rate: what was charged on sales and what was paid on purchases, for each GST rate. */
export default async function GstRateReport({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const sp = await searchParams;
  const t = await getTranslations("reportLists");
  const today = todayIso();
  const range = periodRange("thisMonth", today)!;
  const from = sp.from ?? range.from, to = sp.to ?? range.to;
  const data = await serverApi<Data>(`/reports/gst-rate?from=${from}&to=${to}`);
  return (
    <>
      <PageHeader title={t("gstRate")} subtitle={t("gstRateHint")} />
      <ReportList
        title={t("gstRate")} from={from} to={to} today={today} fileName="gst-rate" empty={t("none")}
        columns={[
          { key: "rateLabel", label: t("c.rate") }, { key: "saleTaxable", label: t("c.taxableSale"), kind: "money" }, { key: "taxOut", label: t("c.taxOut"), kind: "money" },
          { key: "purchaseTaxable", label: t("c.taxablePurchase"), kind: "money" }, { key: "taxIn", label: t("c.taxIn"), kind: "money" },
        ]}
        rows={data.rows.map((r) => ({ ...r, id: r.rate, rateLabel: `${r.rate}%` }))}
        footer={[{ label: t("f.taxIn"), value: rupees(data.totals.taxIn), tone: "in" }, { label: t("f.taxOut"), value: rupees(data.totals.taxOut), tone: "out" }]}
      />
    </>
  );
}
