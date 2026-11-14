import { getTranslations } from "next-intl/server";
import { ReportList } from "@/components/reports/ReportList";
import { PageHeader } from "@/components/ui";
import { rupees, todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Row { id: string; date: string; number: string; party: string | null; type: string; total: string; moneyIn: string; moneyOut: string; href: string }
interface Data { rows: Row[]; totals: { total: string; moneyIn: string; moneyOut: string } }

export async function generateMetadata() {
  return { title: (await getTranslations("reportLists"))("dayBook") };
}

/** One day of documents with the money that came in and went out, and the net for the day. */
export default async function DayBookReport({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const sp = await searchParams;
  const t = await getTranslations("reportLists");
  const today = todayIso();
  const day = sp.from ?? today;
  const data = await serverApi<Data>(`/reports/transactions?from=${day}&to=${day}`);
  const net = (Number(data.totals.moneyIn) - Number(data.totals.moneyOut)).toFixed(2);
  return (
    <>
      <PageHeader title={t("dayBook")} subtitle={t("dayBookHint")} />
      <ReportList
        title={t("dayBook")} from={day} to={day} today={today} singleDate fileName="day-book" empty={t("none")}
        columns={[
          { key: "party", label: t("c.name") }, { key: "number", label: t("c.ref"), link: true }, { key: "typeLabel", label: t("c.type"), kind: "tag" },
          { key: "total", label: t("c.total"), kind: "money" }, { key: "moneyIn", label: t("c.moneyIn"), kind: "money" }, { key: "moneyOut", label: t("c.moneyOut"), kind: "money" },
        ]}
        rows={data.rows.map((r) => ({ ...r, typeLabel: t(`types.${r.type}`) }))}
        footer={[{ label: t("f.moneyIn"), value: rupees(data.totals.moneyIn), tone: "in" }, { label: t("f.moneyOut"), value: rupees(data.totals.moneyOut), tone: "out" }, { label: t("f.net"), value: rupees(net) }]}
      />
    </>
  );
}
