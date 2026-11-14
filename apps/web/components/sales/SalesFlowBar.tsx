import { getTranslations } from "next-intl/server";
import { FlowTrail } from "@/components/flow/FlowTrail";
import { rupees } from "@/lib/format";
import { receivePaymentHref, stepStates, type Flow, type FlowKind } from "@/lib/sales-flow";
import { SavedBanner, type SavedAction } from "./SavedBanner";
import { serverApi } from "@/lib/server-api";

/** The trail for one document. A failure here must never stop the document itself from opening, so it returns null. */
export async function loadFlow(kind: FlowKind, id: string): Promise<Flow | null> {
  try { return await serverApi<Flow>(`/sales/flow?kind=${kind}&id=${id}`); } catch (e) {
    if (typeof (e as { digest?: unknown })?.digest === "string" && (e as { digest: string }).digest.startsWith("NEXT_")) throw e;
    return null;
  }
}

/**
 * Where this document sits in the sale: Quotation, Sales order, Delivery order, Delivery challan, Sales invoice, Payment.
 * Every document in the trail is a link, steps that were left out say so, and one line says what this document does.
 */
export async function SalesFlowBar({ flow, kind, docId, permissions }: { flow: Flow | null; kind: FlowKind; docId: string; permissions?: string[] }) {
  if (!flow) return null;
  const t = await getTranslations("salesFlow");
  const steps = stepStates(flow);
  const money = flow.money;
  const here = flow.current === "creditNote" ? flow.creditNotes.find((d) => d.id === docId) : flow.steps[flow.current].find((d) => d.id === docId);
  const can = (p: string) => !!permissions?.includes(p);
  // Just saved: what it did, and the few things people do next.
  const saved: SavedAction[] = [];
  if (here && permissions) {
    if (kind === "quotation") {
      if (can("sales.create")) saved.push({ href: `/sales/orders/new?quotationId=${docId}`, label: t("action.toOrder"), primary: true });
      saved.push({ href: `/print/quotation/${docId}`, label: t("action.printQuotation"), newTab: true });
    } else if (kind === "order") {
      if (can("sales.create")) saved.push({ href: `/sales/deliveries/new?orderId=${docId}`, label: t("action.challan"), primary: true });
      if (can("sales.create")) saved.push({ href: "/sales/orders/new", label: t("action.createAnother") });
    } else if (kind === "invoice") {
      const pay = receivePaymentHref(flow);
      if (pay && can("accounts.create")) saved.push({ href: pay, label: t("action.receivePayment"), primary: true });
      saved.push({ href: `/print/invoice/${docId}`, label: t("action.printInvoice"), newTab: true });
      if (can("sales.create")) saved.push({ href: "/sales/invoices/new", label: t("action.createAnother") });
    }
  }
  return (
    <>
      {here && permissions && (kind === "quotation" || kind === "order" || kind === "invoice") ? (
        <SavedBanner title={t(`saved.${kind}`, { number: here.number })} effect={t(`savedEffect.${kind}`, { total: rupees(here.amount ?? "0") })} nextLabel={t("whatNext")} actions={saved} dismissLabel={t("dismiss")} />
      ) : null}
      <FlowTrail label={t("trail")} docId={docId} does={t(`does.${kind}`)} sideLabel={t("creditNotes")} sideDocs={flow.creditNotes}
        steps={steps.map(({ step, docs, state }) => ({ key: step, label: t(`step.${step}`), docs, state }))}
        money={money.status === "none" ? null : { paid: money.status === "paid", text: money.status === "paid" ? t("money.paid") : t(`money.${money.status}`, { due: rupees(money.outstanding), billed: rupees(money.billed) }) }} />
    </>
  );
}
