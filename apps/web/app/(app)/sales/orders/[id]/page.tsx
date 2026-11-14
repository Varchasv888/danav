import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CancelDocument } from "@/components/CancelDocument";
import { CloseOrder } from "@/components/purchase/CloseOrder";
import { DocDetail, type Doc } from "@/components/purchase/DocDetail";
import { ActionMenu } from "@/components/sales/ActionMenu";
import { OrderReservations, type ReservationData } from "@/components/sales/OrderReservations";
import { loadFlow, SalesFlowBar } from "@/components/sales/SalesFlowBar";
import { inventorySetup } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export default async function SalesOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();
  const [doc, me, flow] = await Promise.all([serverApi<Doc & { customerReference: string | null }>(`/sales-orders/${id}`), serverApi<Me>("/auth/me"), loadFlow("order", id)]);
  const open = doc.status === "open" || doc.status === "partial";
  const reservations = open ? await serverApi<ReservationData>(`/sales-orders/${id}/reservations`).catch(() => null) : null;
  const godowns = reservations ? (await inventorySetup()).warehouses.filter((w) => !w.qualityHold && !w.archived) : [];
  const anyOut = doc.lines.some((l) => Number(l.deliveredQty) > 0 || Number(l.invoicedQty) > 0);
  const canCreate = me.permissions.includes("sales.create");
  // One main next step; the other routes stay one click away under "More".
  const more = canCreate ? [
    { href: `/sales/delivery-orders/new?orderId=${doc.id}`, label: t("salesFlow.action.deliveryOrder") },
    { href: `/sales/invoices/new?orderId=${doc.id}`, label: t("salesFlow.action.invoiceNoDelivery") },
  ] : [];
  return (
    <DocDetail doc={doc} title={t("sales.orders.title")} back="/sales/orders" extraColumns={["deliveredQty", "invoicedQty"]}
      flow={<SalesFlowBar flow={flow} kind="order" docId={doc.id} permissions={me.permissions} />}
      subtitle={doc.customerReference ? `${t("sales.orders.customerRef")} ${doc.customerReference}` : undefined}>
      {open ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {canCreate ? <Link href={`/sales/deliveries/new?orderId=${doc.id}`} className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover">{t("salesFlow.action.challan")}</Link> : null}
          <ActionMenu label={t("salesFlow.more")} items={more} />
          {me.permissions.includes("sales.edit") ? <CloseOrder id={doc.id} path="/sales-orders" label={t("sales.orders.close")} /> : null}
        </div>
      ) : null}
      {reservations ? <OrderReservations data={reservations} canEdit={me.permissions.includes("sales.create")} canPick={me.permissions.includes("inventory.create")} warehouses={godowns.map((w) => ({ id: w.id, name: w.name }))} /> : null}
      {open && !anyOut && me.permissions.includes("sales.cancel") ? <CancelDocument path={`/sales-orders/${doc.id}/cancel`} label={t("common.cancel")} /> : null}
    </DocDetail>
  );
}
