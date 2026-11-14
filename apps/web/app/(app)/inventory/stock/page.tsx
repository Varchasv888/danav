import { AlertTriangle, Warehouse } from "lucide-react";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { formatIndian } from "@varchasv/domain";
import { Button, Card, Input, PageHeader, Select } from "@/components/ui";
import { fyStart, localName, rupees, todayIso } from "@/lib/format";
import { inventorySetup } from "@/lib/masters";
import { serverApi } from "@/lib/server-api";

interface Row {
  itemId: string; name: string; nameHi: string | null; sku: string | null; uom: string; archived: boolean;
  qty: string; value: string; rate: string; reorderLevel: string | null; belowReorder: boolean; openOrderCommitmentQty?: string;
  heldQty?: string; reservedQty?: string; freeToReserveQty?: string; incomingQty?: string; availableQty?: string; oversold?: boolean;
}
interface Summary { method: string; rows: Row[]; totalValue: string }
interface ReorderRow extends Row { suggestedQty: string; purchaseRate: string }

export async function generateMetadata() {
  return { title: (await getTranslations("stock"))("title") };
}

const qty = (v: string, uom: string) => `${Number(v).toLocaleString("en-IN", { maximumFractionDigits: 3 })} ${uom}`;

export default async function StockPage({ searchParams }: { searchParams: Promise<{ asOf?: string; warehouseId?: string }> }) {
  const sp = await searchParams;
  const asOf = sp.asOf ?? todayIso();
  const t = await getTranslations();
  const locale = await getLocale();
  const showCommitments = asOf === todayIso() && !sp.warehouseId;
  const qs = new URLSearchParams({ asOf, ...(sp.warehouseId ? { warehouseId: sp.warehouseId } : {}), ...(showCommitments ? { includeCommitments: "true" } : {}) });
  const [summary, reorder, setup] = await Promise.all([
    serverApi<Summary>(`/reports/stock-summary?${qs}`), serverApi<ReorderRow[]>("/reports/reorder"), inventorySetup(),
  ]);
  const rows = summary.rows.filter((r) => !r.archived || Number(r.qty) !== 0);
  const method = summary.method === "fifo" ? t("stock.methodFifo") : t("stock.methodAverage");

  return (
    <>
      <PageHeader icon={Warehouse} print title={t("stock.title")} subtitle={t("stock.subtitle", { method })} />
      {reorder.length ? (
        <Card id="reorder" className="mb-6 scroll-mt-6 border-accent/40 bg-accent-soft">
          <h2 className="flex items-center gap-2 font-semibold"><AlertTriangle className="size-4 text-accent" aria-hidden />{t("stock.reorderTitle")}</h2>
          <ul className="mt-2 grid gap-1 text-sm md:grid-cols-2 2xl:grid-cols-3">
            {reorder.map((r) => (
              <li key={r.itemId} className="flex justify-between gap-4">
                <Link href={`/inventory/items/${r.itemId}`} className="hover:underline">{localName(r, locale)}</Link>
                <span className="num text-muted">{qty(r.qty, r.uom)} → {t("stock.suggested")} {qty(r.suggestedQty, r.uom)}</span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
      <form className="mb-4 flex flex-wrap items-end gap-3 print:hidden">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">{t("common.asOf")}</span>
          <Input type="date" name="asOf" defaultValue={asOf} className="w-44" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">{t("stock.warehouse")}</span>
          <Select name="warehouseId" defaultValue={sp.warehouseId ?? ""} className="w-56">
            <option value="">{t("stock.allWarehouses")}</option>
            {setup.warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </Select>
        </label>
        <Button type="submit" variant="outline">{t("common.apply")}</Button>
      </form>
      <Card className="p-0">
        {showCommitments ? <p className="px-5 pt-4 text-sm text-muted">{t("stock.availabilityNote")}</p> : null}
        <div className="overflow-x-auto">
          <table className={`w-full ${showCommitments ? "min-w-[1080px]" : "min-w-[640px]"} text-sm`}>
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("items.name")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("stock.qty")}</th>
                {showCommitments ? (
                  <>
                    <th className="px-5 py-3 text-right font-medium">{t("stock.held")}</th>
                    <th className="px-5 py-3 text-right font-medium">{t("stock.promised")}</th>
                    <th className="px-5 py-3 text-right font-medium">{t("stock.reserved")}</th>
                    <th className="px-5 py-3 text-right font-medium">{t("stock.available")}</th>
                    <th className="px-5 py-3 text-right font-medium">{t("stock.incoming")}</th>
                  </>
                ) : null}
                <th className="px-5 py-3 text-right font-medium">{t("stock.rate")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("stock.value")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.itemId} className="border-b border-border last:border-0 hover:bg-surface-2/60">
                  <td className="px-5 py-2.5">
                    <Link href={`/inventory/items/${r.itemId}?from=${fyStart(asOf)}&to=${asOf}`} className="font-medium hover:text-primary hover:underline">{localName(r, locale)}</Link>
                    {r.belowReorder ? <span className="ml-2 rounded bg-accent-soft px-1.5 text-xs text-accent">{t("stock.belowReorder")}</span> : null}
                  </td>
                  <td className={`num px-5 py-2.5 text-right ${Number(r.qty) < 0 ? "text-danger" : ""}`}>{qty(r.qty, r.uom)}</td>
                  {showCommitments ? (
                    <>
                      <td className="num px-5 py-2.5 text-right text-muted">{Number(r.heldQty) ? qty(r.heldQty ?? "0", r.uom) : "-"}</td>
                      <td className="num px-5 py-2.5 text-right text-muted">{Number(r.openOrderCommitmentQty) ? qty(r.openOrderCommitmentQty ?? "0", r.uom) : "-"}</td>
                      <td className="num px-5 py-2.5 text-right text-muted">{Number(r.reservedQty) ? qty(r.reservedQty ?? "0", r.uom) : "-"}</td>
                      <td className={`num px-5 py-2.5 text-right font-medium ${r.oversold ? "text-danger" : ""}`}>
                        {qty(r.availableQty ?? "0", r.uom)}{r.oversold ? <span className="ml-2 rounded bg-danger-soft px-1.5 text-xs font-normal">{t("stock.oversold")}</span> : null}
                      </td>
                      <td className="num px-5 py-2.5 text-right text-muted">{Number(r.incomingQty) ? qty(r.incomingQty ?? "0", r.uom) : "-"}</td>
                    </>
                  ) : null}
                  <td className="num px-5 py-2.5 text-right">₹ {formatIndian(r.rate)}</td>
                  <td className="num px-5 py-2.5 text-right">{rupees(r.value)}</td>
                </tr>
              ))}
              {!rows.length ? <tr><td colSpan={showCommitments ? 10 : 4} className="px-5 py-8 text-center text-muted">{t("items.empty")}</td></tr> : null}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border font-semibold">
                <td className="px-5 py-3" colSpan={showCommitments ? 9 : 3}>{t("stock.totalValue")}</td>
                <td className="num px-5 py-3 text-right">{rupees(summary.totalValue)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </>
  );
}
