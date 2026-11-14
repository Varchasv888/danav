import { getTranslations } from "next-intl/server";
import { CancelDocument } from "@/components/CancelDocument";
import { DocDetail, type Doc } from "@/components/purchase/DocDetail";
import { loadPurchaseFlow, PurchaseFlowBar } from "@/components/purchase/PurchaseFlowBar";
import { serverApi, type Me } from "@/lib/server-api";

export default async function ReturnPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();
  const [doc, me, flow] = await Promise.all([serverApi<Doc & { reason: string }>(`/purchase-returns/${id}`), serverApi<Me>("/auth/me"), loadPurchaseFlow("return", id)]);
  return (
    <DocDetail doc={{ ...doc, narration: doc.reason }} kind="returns" back="/purchase/returns" flow={<PurchaseFlowBar flow={flow} kind="return" docId={doc.id} />}>
      {doc.status === "posted" && me.permissions.includes("purchase.cancel") ? <CancelDocument path={`/purchase-returns/${doc.id}/cancel`} label={t("common.cancel")} /> : null}
    </DocDetail>
  );
}
