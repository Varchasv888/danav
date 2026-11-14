import { getTranslations } from "next-intl/server";
import { FlowTrail } from "@/components/flow/FlowTrail";
import { SavedBanner, type SavedAction } from "@/components/sales/SavedBanner";
import { rupees } from "@/lib/format";
import { paySupplierHref, purchaseStepStates, type PurchaseFlow, type PurchaseKind } from "@/lib/purchase-flow";
import { serverApi } from "@/lib/server-api";

/** The trail for one purchase document. A failure here must never stop the document itself from opening, so it returns null. */
export async function loadPurchaseFlow(kind: PurchaseKind, id: string): Promise<PurchaseFlow | null> {
  try { return await serverApi<PurchaseFlow>(`/purchase/flow?kind=${kind}&id=${id}`); } catch (e) {
    if (typeof (e as { digest?: unknown })?.digest === "string" && (e as { digest: string }).digest.startsWith("NEXT_")) throw e;
    return null;
  }
}

/**
 * Where this document sits in the purchase: Purchase order, Goods receipt, Supplier bill, Payment. Every document is a link,
 * steps left out say so, and one line says what this document does to stock and accounts. Right after saving, a note says
 * what happened and offers the next step.
 */
export async function PurchaseFlowBar({ flow, kind, docId, permissions }: { flow: PurchaseFlow | null; kind: PurchaseKind; docId: string; permissions?: string[] }) {
  if (!flow) return null;
  const t = await getTranslations("purchaseFlow");
  const money = flow.money;
  const here = flow.current === "return" ? flow.returns.find((d) => d.id === docId) : flow.steps[flow.current].find((d) => d.id === docId);
  const can = (p: string) => !!permissions?.includes(p);
  const saved: SavedAction[] = [];
  if (here && permissions) {
    if (kind === "order") {
      if (can("purchase.create")) saved.push({ href: `/purchase/receipts/new?orderId=${docId}`, label: t("action.receive"), primary: true });
      if (can("purchase.create")) saved.push({ href: "/purchase/orders/new", label: t("action.createAnother") });
    } else if (kind === "receipt") {
      if (can("purchase.create")) saved.push({ href: `/purchase/bills/new?receiptId=${docId}`, label: t("action.bill"), primary: true });
      saved.push({ href: `/inventory/labels?receipt=${docId}`, label: t("action.labels") });
    } else if (kind === "bill") {
      const pay = paySupplierHref(flow);
      if (pay && can("accounts.create")) saved.push({ href: pay, label: t("action.paySupplier"), primary: true });
      saved.push({ href: `/inventory/labels?bill=${docId}`, label: t("action.labels") });
      if (can("purchase.create")) saved.push({ href: "/purchase/bills/new", label: t("action.createAnother") });
    }
  }
  return (
    <>
      {here && permissions && kind !== "return" ? (
        <SavedBanner title={t(`saved.${kind}`, { number: here.number })} effect={t(`savedEffect.${kind}`, { total: rupees(here.amount ?? "0") })} nextLabel={t("whatNext")} actions={saved} dismissLabel={t("dismiss")} />
      ) : null}
      <FlowTrail label={t("trail")} docId={docId} does={t(`does.${kind}`)} sideLabel={t("returns")} sideDocs={flow.returns}
        steps={purchaseStepStates(flow).map(({ step, docs, state }) => ({ key: step, label: t(`step.${step}`), docs, state }))}
        money={money.status === "none" ? null : { paid: money.status === "paid", text: money.status === "paid" ? t("money.paid") : t(`money.${money.status}`, { due: rupees(money.outstanding), billed: rupees(money.billed) }) }} />
    </>
  );
}
