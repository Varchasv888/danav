import { ClipboardList } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { dec } from "@varchasv/domain";
import type { Doc } from "@/components/purchase/DocDetail";
import { DeliveryOrderForm } from "@/components/sales/DeliveryOrderForm";
import { FitScreen, PageHeader } from "@/components/ui";
import { customers, items } from "@/lib/masters";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("deliveryOrders"))("new") };
}

export default async function NewDeliveryOrderPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const { orderId } = await searchParams;
  const t = await getTranslations("deliveryOrders");
  const [c, i, order] = await Promise.all([customers(), items(), orderId ? serverApi<Doc & { customerId: string }>(`/sales-orders/${orderId}`) : Promise.resolve(null)]);
  // From a sales order: the goods lines still to go out, which the delivery order may not exceed.
  const initial = order ? {
    customerId: order.customerId, orderId: order.id, orderNumber: order.number,
    lines: order.lines
      .filter((l) => (l as { kind?: string }).kind !== "service")
      .map((l) => ({ l, due: dec(l.qty).minus(l.deliveredQty ?? "0") }))
      .filter(({ due }) => due.gt(0))
      .map(({ l, due }) => ({ itemId: l.itemId, qty: due.toString(), maxQty: due.toString(), orderLineId: l.id })),
  } : undefined;
  return (
    <FitScreen>
      <PageHeader icon={ClipboardList} title={t("new")} />
      <DeliveryOrderForm customers={c} items={i} {...(initial ? { initial } : {})} />
    </FitScreen>
  );
}
