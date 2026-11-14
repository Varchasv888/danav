import { getTranslations } from "next-intl/server";
import { dec } from "@varchasv/domain";
import type { Doc } from "@/components/purchase/DocDetail";
import { PurchaseForm, type DraftLine } from "@/components/purchase/PurchaseForm";
import { FitScreen, PageHeader } from "@/components/ui";
import { homeState, inventorySetup, items, suppliers } from "@/lib/masters";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("purchase.bills"))("new") };
}

/** An order line's discount covers its whole quantity; billing part of it takes the same share of the discount. */
function proRata(discount: string | undefined, qty: string, orderedQty: string) {
  if (!discount || dec(discount).isZero()) return undefined;
  return dec(discount).times(qty).div(orderedQty).toDecimalPlaces(2).toString();
}

type Linked =Doc & { supplierId: string; orderId?: string | null; lines: (Doc["lines"][number] & { itemId: string; orderLineId?: string | null })[] };

export default async function NewBillPage({ searchParams }: { searchParams: Promise<{ orderId?: string; receiptId?: string }> }) {
  const { orderId, receiptId } = await searchParams;
  const t = await getTranslations("purchase.bills");
  const [s, i, setup, home] = await Promise.all([suppliers(), items(), inventorySetup(), homeState()]);

  let initial: { supplierId: string; orderId?: string; lines: DraftLine[] } | undefined;
  if (receiptId) {
    // Bill what was received and not yet billed, at the order's price and GST rate when there was an order.
    const receipt = await serverApi<Linked>(`/goods-receipts/${receiptId}`);
    const order = receipt.orderId ? await serverApi<Linked>(`/purchase-orders/${receipt.orderId}`) : null;
    initial = {
      supplierId: receipt.supplierId,
      ...(receipt.orderId ? { orderId: receipt.orderId } : {}),
      lines: receipt.lines.filter((l) => dec(l.qty).gt(l.billedQty ?? "0")).map((l) => {
        const ol = order?.lines.find((o) => o.id === l.orderLineId);
        const qty = dec(l.qty).minus(l.billedQty ?? "0").toString();
        const discount = ol ? proRata(ol.discount, qty, ol.qty) : undefined;
        return {
          itemId: l.itemId, qty, receiptLineId: l.id, locked: true,
          rate: ol ? String(Number(ol.rate)) : String(Number(l.rate)), ...(discount ? { discount } : {}),
          ...(ol?.gstRate ? { gstRate: String(Number(ol.gstRate)) } : {}),
        };
      }),
    };
  } else if (orderId) {
    // Bill ordered goods directly (no goods receipt): stock comes in with the bill.
    const order = await serverApi<Linked>(`/purchase-orders/${orderId}`);
    initial = {
      supplierId: order.supplierId, orderId,
      lines: order.lines.filter((l) => dec(l.qty).gt(l.billedQty ?? "0") && dec(l.receivedQty ?? "0").lte(l.billedQty ?? "0")).map((l) => {
        const qty = dec(l.qty).minus(l.billedQty ?? "0").toString();
        const discount = proRata(l.discount, qty, l.qty);
        return { itemId: l.itemId, qty, orderLineId: l.id, locked: true, rate: String(Number(l.rate)), gstRate: String(Number(l.gstRate)), ...(discount ? { discount } : {}) };
      }),
    };
  }
  return (
    <FitScreen>
      <PageHeader title={t("new")} />
      <PurchaseForm mode="bill" suppliers={s} items={i} warehouses={setup.warehouses.filter((w) => !w.archived)} homeState={home} {...(initial ? { initial } : {})} />
    </FitScreen>
  );
}
