import { getFormatter, getTranslations } from "next-intl/server";
import { Card, PageHeader } from "@/components/ui";
import { todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

const DIMS = ["month", "date", "consignee", "brand", "category", "item", "discount"] as const;
interface Data { rows: { name: string; pieces: string; value: string; returned: string }[]; totals: { pieces: string; value: string; returned: string } }

export async function generateMetadata() {
  return { title: (await getTranslations("consignmentSales"))("title") };
}

/** Goods billed from consignment stock (shop-in-shop) in a period, grouped by month, day, consignee, brand, category, item or discount band. */
export default async function ConsignmentSalesPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string; by?: string }> }) {
  const q = await searchParams;
  const to = q.to && /^\d{4}-\d{2}-\d{2}$/.test(q.to) ? q.to : todayIso();
  const from = q.from && /^\d{4}-\d{2}-\d{2}$/.test(q.from) ? q.from : `${to.slice(0, 4)}-01-01`;
  const by = (DIMS as readonly string[]).includes(q.by ?? "") ? q.by! : "month";
  const t = await getTranslations("consignmentSales");
  const format = await getFormatter();
  const d = await serverApi<Data>(`/reports/consignment-sales?from=${from}&to=${to}&by=${by}`);
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <form method="get" className="mb-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">{t("from")}<input type="date" name="from" defaultValue={from} className="h-9 rounded-md border border-border bg-surface px-2" /></label>
        <label className="flex flex-col gap-1 text-sm">{t("to")}<input type="date" name="to" defaultValue={to} className="h-9 rounded-md border border-border bg-surface px-2" /></label>
        <label className="flex flex-col gap-1 text-sm">{t("by")}<select name="by" defaultValue={by} className="h-9 rounded-md border border-border bg-surface px-2">{DIMS.map((x) => <option key={x} value={x}>{t(`dims.${x}`)}</option>)}</select></label>
        <button type="submit" className="h-9 rounded-md border border-border px-3 text-sm hover:bg-surface-2">{t("show")}</button>
      </form>
      <Card className="p-0">
        {d.rows.length === 0 ? <p className="p-4 text-sm text-muted">{t("empty")}</p> : (
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted"><tr className="border-b border-rule"><th className="px-4 py-1.5 font-medium">{t(`dims.${by}`)}</th><th className="px-4 py-1.5 text-right font-medium">{t("pieces")}</th><th className="px-4 py-1.5 text-right font-medium">{t("value")}</th><th className="px-4 py-1.5 text-right font-medium">{t("returned")}</th></tr></thead>
            <tbody>{d.rows.map((r) => <tr key={r.name} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{r.name}</td><td className="num px-4 py-1.5 text-right">{r.pieces}</td><td className="num px-4 py-1.5 text-right">{money(r.value)}</td><td className="num px-4 py-1.5 text-right text-muted">{Number(r.returned) ? r.returned : ""}</td></tr>)}</tbody>
            <tfoot><tr className="border-t border-rule font-medium"><td className="px-4 py-1.5">{t("total")}</td><td className="num px-4 py-1.5 text-right">{d.totals.pieces}</td><td className="num px-4 py-1.5 text-right">{money(d.totals.value)}</td><td className="num px-4 py-1.5 text-right">{d.totals.returned}</td></tr></tfoot>
          </table>
        )}
      </Card>
    </>
  );
}
