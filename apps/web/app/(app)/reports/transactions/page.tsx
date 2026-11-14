import { getTranslations } from "next-intl/server";
import { ReportList } from "@/components/reports/ReportList";
import { PageHeader } from "@/components/ui";
import { rupees, todayIso } from "@/lib/format";
import { periodRange } from "@/lib/report-periods";
import { serverApi } from "@/lib/server-api";

interface Row { id: string; date: string; number: string; party: string | null; type: string; total: string; moneyIn: string; moneyOut: string; href: string }
interface Data { rows: Row[]; totals: { total: string; moneyIn: string; moneyOut: string } }
const TYPES = ["sale", "purchase", "saleReturn", "purchaseReturn", "counterSale", "paymentIn", "paymentOut"];

export async function generateMetadata() {
  return { title: (await getTranslations("reportLists"))("transactions") };
}

/** Every document of the period in one list, with a type filter. */
export default async function TransactionsReport({ searchParams }: { searchParams: Promise<{ from?: string; to?: string; type?: string }> }) {
  const sp = await searchParams;
  const t = await getTranslations("reportLists");
  const today = todayIso();
  const range = periodRange("thisMonth", today)!;
  const from = sp.from ?? range.from, to = sp.to ?? range.to;
  const type = TYPES.includes(sp.type ?? "") ? sp.type! : "";
  const data = await serverApi<Data>(`/reports/transactions?from=${from}&to=${to}${type ? `&type=${type}` : ""}`);
  return (
    <>
      <PageHeader title={t("transactions")} subtitle={t("transactionsHint")} />
      <ReportList
        title={t("transactions")} from={from} to={to} today={today} fileName="transactions" empty={t("none")}
        filters={[{ name: "type", label: t("type"), value: type, options: [{ value: "", label: t("allTypes") }, ...TYPES.map((k) => ({ value: k, label: t(`types.${k}`) }))] }]}
        columns={[
          { key: "date", label: t("c.date"), kind: "date" }, { key: "number", label: t("c.ref"), link: true }, { key: "party", label: t("c.party") },
          { key: "typeLabel", label: t("c.type"), kind: "tag" }, { key: "total", label: t("c.total"), kind: "money" },
          { key: "moneyIn", label: t("c.moneyIn"), kind: "money" }, { key: "moneyOut", label: t("c.moneyOut"), kind: "money" },
        ]}
        rows={data.rows.map((r) => ({ ...r, typeLabel: t(`types.${r.type}`) }))}
        footer={[{ label: t("f.total"), value: rupees(data.totals.total) }, { label: t("f.moneyIn"), value: rupees(data.totals.moneyIn), tone: "in" }, { label: t("f.moneyOut"), value: rupees(data.totals.moneyOut), tone: "out" }]}
      />
    </>
  );
}
