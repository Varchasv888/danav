import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CancelDocument } from "@/components/CancelDocument";
import { DocDetail, type Doc } from "@/components/purchase/DocDetail";
import { EinvoicePanel, type EinvoiceState } from "@/components/sales/EinvoicePanel";
import { loadFlow, SalesFlowBar } from "@/components/sales/SalesFlowBar";
import { serverApi, type Me } from "@/lib/server-api";

type CreditNote = Doc & EinvoiceState & { reason: string; invoiceId: string; goodsReturned: boolean };

export default async function CreditNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();
  const [doc, me, flow] = await Promise.all([serverApi<CreditNote>(`/credit-notes/${id}`), serverApi<Me>("/auth/me"), loadFlow("creditNote", id)]);
  return (
    <DocDetail doc={{ ...doc, narration: doc.reason }} title={t("sales.creditNotes.title")} back="/sales/credit-notes" flow={<SalesFlowBar flow={flow} kind="creditNote" docId={doc.id} />}
      subtitle={doc.goodsReturned ? t("sales.creditNotes.goodsReturned") : t("sales.creditNotes.priceReduction")}>
      <p className="mt-3 text-sm"><Link href={`/sales/invoices/${doc.invoiceId}`} className="text-primary hover:underline">{t("sales.invoices.title")} →</Link></p>
      {/* A credit note to a registered buyer needs its own IRN; e-way bills don't apply to it here. */}
      <EinvoicePanel invoice={doc} path="/credit-notes" hasGoods={false} canSubmit={me.permissions.includes("gst.submit")} canCancel={me.permissions.includes("gst.cancel")} />
      {doc.status === "posted" && doc.einvoiceStatus !== "generated" && me.permissions.includes("sales.cancel") ? <CancelDocument path={`/credit-notes/${doc.id}/cancel`} label={t("common.cancel")} /> : null}
    </DocDetail>
  );
}
