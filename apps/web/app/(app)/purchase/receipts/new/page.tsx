import { getTranslations } from "next-intl/server";
import { dec } from "@varchasv/domain";
import type { Doc } from "@/components/purchase/DocDetail";
import { ReceiptForm } from "@/components/purchase/ReceiptForm";
import { FitScreen, PageHeader } from "@/components/ui";
import { inventorySetup, items, suppliers } from "@/lib/masters";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("purchase.receipts"))("new") };
}

type OrderDoc = Doc & { supplierId: string; lines: (Doc["lines"][number] & { itemId: string })[] };

export default async function NewReceiptPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const { orderId } = await searchParams;
  const t = await getTranslations("purchase.receipts");
  const [s, i, setup, order] = await Promise.all([
    suppliers(), items(), inventorySetup(), orderId ? serverApi<OrderDoc>(`/purchase-orders/${orderId}`) : Promise.resolve(null),
  ]);
  // From an order: every line still due, at its net cost (rate after discount).
  const initial = order ? {
    supplierId: order.supplierId, orderId: order.id, orderNumber: order.number,
    lines: order.lines
      .map((l) => ({ l, due: dec(l.qty).minus(l.receivedQty ?? "0") }))
      .filter(({ due }) => due.gt(0))
      .map(({ l, due }) => ({ itemId: l.itemId, qty: due.toString(), maxQty: due.toString(), orderLineId: l.id, rate: dec(l.taxable ?? "0").div(l.qty).toDecimalPlaces(4).toString() })),
  } : undefined;
  return (
    <FitScreen>
      <PageHeader title={t("new")} />
      <ReceiptForm bands={await serverApi<{ fromRate: string; markupPct: string; markdown1Pct: string; markdown2Pct: string }[]>("/margin-bands")} suppliers={s} items={i} warehouses={setup.warehouses.filter((w) => !w.archived)} {...(initial ? { initial } : {})} />
    </FitScreen>
  );
}
