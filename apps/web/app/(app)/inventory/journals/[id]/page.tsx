import Link from "next/link";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { CancelDocument } from "@/components/CancelDocument";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, PageHeader } from "@/components/ui";
import { localName, rupees } from "@/lib/format";
import { inventorySetup } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

interface Journal {
  id: string; number: string; date: string; kind: string; narration: string | null; status: string;
  lines: { id: string; itemName: string; itemNameHi: string | null; warehouseId: string; toWarehouseId: string | null; qtyIn: string; qtyOut: string; rate: string; batchNo: string | null }[];
}

export default async function StockJournalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();
  const locale = await getLocale();
  const format = await getFormatter();
  const [j, setup, me] = await Promise.all([serverApi<Journal>(`/stock-journals/${id}`), inventorySetup(), serverApi<Me>("/auth/me")]);
  const wh = (wid: string | null) => setup.warehouses.find((w) => w.id === wid)?.name ?? "";
  return (
    <>
      <PageHeader
        title={<span className="font-mono">{j.number}</span>}
        subtitle={`${t(`sj.kinds.${j.kind}`)} · ${format.dateTime(new Date(`${j.date}T00:00:00`), { dateStyle: "long" })}`}
        actions={<Link href="/inventory/journals" className="text-sm text-primary hover:underline">← {t("common.back")}</Link>}
      />
      <Card>
        <div className="mb-4"><StatusBadge status={j.status} label={t(`purchase.statuses.${j.status}`)} /></div>
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr className="border-b border-border">
              <th className="py-2 pr-4 font-medium">{t("purchase.item")}</th>
              <th className="py-2 pr-4 font-medium">{t("stock.warehouse")}</th>
              <th className="py-2 pr-4 text-right font-medium">{t("stock.in")}</th>
              <th className="py-2 pr-4 text-right font-medium">{t("stock.out")}</th>
              <th className="py-2 text-right font-medium">{t("stock.rate")}</th>
            </tr>
          </thead>
          <tbody>
            {j.lines.map((l) => (
              <tr key={l.id} className="border-b border-border">
                <td className="py-2.5 pr-4">{localName({ name: l.itemName, nameHi: l.itemNameHi }, locale)}{l.batchNo ? <span className="ml-2 font-mono text-xs text-muted">{l.batchNo}</span> : null}</td>
                <td className="py-2.5 pr-4">{wh(l.warehouseId)}{l.toWarehouseId ? ` → ${wh(l.toWarehouseId)}` : ""}</td>
                <td className="num py-2.5 pr-4 text-right">{Number(l.qtyIn) ? Number(l.qtyIn).toLocaleString("en-IN") : ""}</td>
                <td className="num py-2.5 pr-4 text-right">{Number(l.qtyOut) ? Number(l.qtyOut).toLocaleString("en-IN") : ""}</td>
                <td className="num py-2.5 text-right">{Number(l.rate) ? rupees(l.rate) : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {j.narration ? <p className="mt-4 text-sm"><span className="text-muted">{t("common.narration")}:</span> {j.narration}</p> : null}
      </Card>
      {j.status === "posted" && me.permissions.includes("inventory.cancel") ? <CancelDocument path={`/stock-journals/${j.id}/cancel`} label={t("vouchers.cancel")} /> : null}
    </>
  );
}
