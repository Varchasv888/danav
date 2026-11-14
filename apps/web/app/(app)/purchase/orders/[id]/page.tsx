import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CancelDocument } from "@/components/CancelDocument";
import { CloseOrder } from "@/components/purchase/CloseOrder";
import { DocDetail, type Doc } from "@/components/purchase/DocDetail";
import { OrderApproval } from "@/components/purchase/OrderApproval";
import { OrderMatch } from "@/components/purchase/OrderMatch";
import { loadPurchaseFlow, PurchaseFlowBar } from "@/components/purchase/PurchaseFlowBar";
import { ActionMenu } from "@/components/sales/ActionMenu";
import { serverApi, type Me } from "@/lib/server-api";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();
  const [doc, me, flow] = await Promise.all([serverApi<Doc & { approvalStatus: string; approvalNote: string | null }>(`/purchase-orders/${id}`), serverApi<Me>("/auth/me"), loadPurchaseFlow("order", id)]);
  const waiting = doc.approvalStatus === "pending" || doc.approvalStatus === "rejected";
  const open = (doc.status === "open" || doc.status === "partial") && !waiting;
  const anyReceived = doc.lines.some((l) => Number(l.receivedQty) > 0);
  const canCreate = me.permissions.includes("purchase.create");
  // One main next step; booking a bill without a receipt stays one click away under "More".
  const more = canCreate ? [{ href: `/purchase/orders/${doc.id}/receive`, label: t("scanReceive.action") }, { href: `/purchase/bills/new?orderId=${doc.id}`, label: t("purchaseFlow.action.billNoReceipt") }] : [];
  return (
    <DocDetail doc={doc} kind="orders" back="/purchase/orders" extraColumns={["receivedQty", "billedQty"]} flow={<PurchaseFlowBar flow={flow} kind="order" docId={doc.id} permissions={me.permissions} />}>
      {waiting ? <OrderApproval orderId={doc.id} status={doc.approvalStatus as "pending" | "rejected"} note={doc.approvalNote} canDecide={me.permissions.includes("purchase.approve")} /> : null}
      {open ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {canCreate ? <Link href={`/purchase/receipts/new?orderId=${doc.id}`} className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover">{t("purchaseFlow.action.receive")}</Link> : null}
          <ActionMenu label={t("salesFlow.more")} items={more} />
          {me.permissions.includes("purchase.edit") ? <CloseOrder id={doc.id} /> : null}
        </div>
      ) : null}
      <OrderMatch orderId={doc.id} />
      {open && !anyReceived && me.permissions.includes("purchase.cancel") ? <CancelDocument path={`/purchase-orders/${doc.id}/cancel`} label={t("common.cancel")} /> : null}
    </DocDetail>
  );
}
