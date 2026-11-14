import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { DateFilter } from "@/components/DateFilter";
import { Card, PageHeader } from "@/components/ui";
import { fyStart, localName, rupees, todayIso } from "@/lib/format";
import { inventorySetup } from "@/lib/masters";
import { serverApi } from "@/lib/server-api";

interface Item { id: string; name: string; nameHi: string | null; uom: string; hsn: string | null; gstRate: string; stock: { warehouse: string; qty: string; value: string }[] }
interface Ledger {
  opening: { qty: string; value: string }; closing: { qty: string; value: string };
  entries: { id: number; date: string; warehouseId: string; qtyIn: string; qtyOut: string; valueChange: string; sourceType: string; batchNo: string | null; balanceQty: string; balanceValue: string }[];
}

const n = (v: string) => Number(v).toLocaleString("en-IN", { maximumFractionDigits: 3 });

export default async function ItemLedgerPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ from?: string; to?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const to = sp.to ?? todayIso();
  const from = sp.from ?? fyStart(to);
  const t = await getTranslations();
  const locale = await getLocale();
  const format = await getFormatter();
  const [item, ledger, setup] = await Promise.all([
    serverApi<Item>(`/items/${id}`), serverApi<Ledger>(`/reports/item-ledger/${id}?from=${from}&to=${to}`), inventorySetup(),
  ]);
  const wh = (wid: string) => setup.warehouses.find((w) => w.id === wid)?.name ?? "";
  const date = (d: string) => format.dateTime(new Date(`${d}T00:00:00`), { dateStyle: "medium" });

  return (
    <>
      <PageHeader
        title={t("stock.ledgerTitle", { item: localName(item, locale) })}
        subtitle={[item.hsn ? `HSN ${item.hsn}` : null, `GST ${Number(item.gstRate)}%`, item.stock.map((s) => `${s.warehouse}: ${n(s.qty)} ${item.uom}`).join(" · ")].filter(Boolean).join(" · ")}
        actions={<DateFilter from={from} to={to} />}
      />
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("common.date")}</th>
                <th className="px-5 py-3 font-medium">{t("reports.particulars")}</th>
                <th className="px-5 py-3 font-medium">{t("stock.warehouse")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("stock.in")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("stock.out")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("stock.qty")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("stock.value")}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border bg-surface-2/60 font-medium">
                <td className="px-5 py-2">{date(from)}</td>
                <td className="px-5 py-2" colSpan={4}>{t("reports.opening")}</td>
                <td className="num px-5 py-2 text-right">{n(ledger.opening.qty)}</td>
                <td className="num px-5 py-2 text-right">{rupees(ledger.opening.value)}</td>
              </tr>
              {ledger.entries.map((e) => (
                <tr key={e.id} className="border-b border-border">
                  <td className="px-5 py-2 whitespace-nowrap">{date(e.date)}</td>
                  <td className="px-5 py-2">{t.has(`stock.source.${e.sourceType}`) ? t(`stock.source.${e.sourceType}`) : e.sourceType}{e.batchNo ? <span className="ml-2 font-mono text-xs text-muted">{e.batchNo}</span> : null}</td>
                  <td className="px-5 py-2 text-muted">{wh(e.warehouseId)}</td>
                  <td className="num px-5 py-2 text-right">{Number(e.qtyIn) ? n(e.qtyIn) : ""}</td>
                  <td className="num px-5 py-2 text-right">{Number(e.qtyOut) ? n(e.qtyOut) : ""}</td>
                  <td className={`num px-5 py-2 text-right ${Number(e.balanceQty) < 0 ? "text-danger" : ""}`}>{n(e.balanceQty)}</td>
                  <td className="num px-5 py-2 text-right">{rupees(e.balanceValue)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border font-semibold">
                <td className="px-5 py-3">{date(to)}</td>
                <td className="px-5 py-3" colSpan={4}>{t("reports.closing")}</td>
                <td className="num px-5 py-3 text-right">{n(ledger.closing.qty)} {item.uom}</td>
                <td className="num px-5 py-3 text-right">{rupees(ledger.closing.value)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </>
  );
}
