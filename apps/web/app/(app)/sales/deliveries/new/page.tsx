import { getTranslations } from "next-intl/server";
import { dec } from "@varchasv/domain";
import type { Doc } from "@/components/purchase/DocDetail";
import { DeliveryForm } from "@/components/sales/DeliveryForm";
import { FitScreen, PageHeader } from "@/components/ui";
import { customers, inventorySetup, items } from "@/lib/masters";
import { serverApi } from "@/lib/server-api";

interface DeliveryOrderDoc { id: string; number: string; customerId: string; orderId: string | null; lines: { id: string; itemId: string; orderLineId: string | null; toDispatch: string }[] }

export async function generateMetadata() {
  return { title: (await getTranslations("sales.deliveries"))("new") };
}

export default async function NewDeliveryPage({ searchParams }: { searchParams: Promise<{ orderId?: string; reason?: string; deliveryOrderId?: string }> }) {
  const { orderId, reason, deliveryOrderId } = await searchParams;
  const t = await getTranslations("sales.deliveries");
  const [c, i, setup, order, dOrder] = await Promise.all([
    customers(), items(), inventorySetup(), orderId ? serverApi<Doc & { customerId: string }>(`/sales-orders/${orderId}`) : Promise.resolve(null),
    deliveryOrderId ? serverApi<DeliveryOrderDoc>(`/delivery-orders/${deliveryOrderId}`) : Promise.resolve(null),
  ]);
  // From an order: goods lines still to go out.
  const initial = dOrder ? {
    customerId: dOrder.customerId, ...(dOrder.orderId ? { orderId: dOrder.orderId } : {}), orderNumber: dOrder.number, fromDeliveryOrder: true,
    lines: dOrder.lines.filter((l) => Number(l.toDispatch) > 0)
      .map((l) => ({ itemId: l.itemId, qty: String(Number(l.toDispatch)), maxQty: String(Number(l.toDispatch)), deliveryOrderLineId: l.id, ...(l.orderLineId ? { orderLineId: l.orderLineId } : {}) })),
  } : order ? {
    customerId: order.customerId, orderId: order.id, orderNumber: order.number,
    lines: order.lines
      .filter((l) => (l as { kind?: string }).kind !== "service")
      .map((l) => ({ l, due: dec(l.qty).minus(l.deliveredQty ?? "0") }))
      .filter(({ due }) => due.gt(0))
      .map(({ l, due }) => ({ itemId: l.itemId, qty: due.toString(), maxQty: due.toString(), orderLineId: l.id })),
  } : undefined;
  return (
    <FitScreen>
      <PageHeader title={reason === "approval" ? t("newApproval") : t("new")} />
      <DeliveryForm customers={c} items={i} warehouses={setup.warehouses.filter((w) => !w.archived)} {...(initial ? { initial } : {})} reason={reason} />
    </FitScreen>
  );
}
