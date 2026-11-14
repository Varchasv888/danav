import { Tags } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CancelDocument } from "@/components/CancelDocument";
import { DocDetail, type Doc } from "@/components/purchase/DocDetail";
import { loadPurchaseFlow, PurchaseFlowBar } from "@/components/purchase/PurchaseFlowBar";
import { serverApi, type Me } from "@/lib/server-api";

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();
  const [doc, me, flow] = await Promise.all([serverApi<Doc & { supplierChallan: string | null; transporter: string | null; lrNumber: string | null; lrDate: string | null }>(`/goods-receipts/${id}`), serverApi<Me>("/auth/me"), loadPurchaseFlow("receipt", id)]);
  const unbilled = doc.lines.some((l) => Number(l.billedQty) < Number(l.qty));
  const noneBilled = doc.lines.every((l) => Number(l.billedQty) === 0);
  return (
    <DocDetail doc={doc} kind="receipts" back="/purchase/receipts" extraColumns={["billedQty"]} flow={<PurchaseFlowBar flow={flow} kind="receipt" docId={doc.id} permissions={me.permissions} />} subtitle={[
      doc.supplierChallan ? `${t("purchase.receipts.challan")} ${doc.supplierChallan}` : null, doc.transporter,
      doc.lrNumber ? `${t("inward.lrNumber")} ${doc.lrNumber}${doc.lrDate ? ` (${doc.lrDate})` : ""}` : null,
    ].filter(Boolean).join(" · ") || undefined}>
      {doc.status !== "cancelled" ? (
        <div className="mt-4">
          <Link href={`/inventory/labels?receipt=${doc.id}`} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium hover:bg-surface-2"><Tags className="size-4" aria-hidden />{t("inward.printLabels")}</Link>
        </div>
      ) : null}
      {doc.status !== "cancelled" && unbilled && me.permissions.includes("purchase.create") ? (
        <div className="mt-4">
          <Link href={`/purchase/bills/new?receiptId=${doc.id}`} className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover">{t("purchase.receipts.bill")}</Link>
        </div>
      ) : null}
      {doc.status === "posted" && noneBilled && me.permissions.includes("purchase.cancel") ? <CancelDocument path={`/goods-receipts/${doc.id}/cancel`} label={t("common.cancel")} /> : null}
    </DocDetail>
  );
}
