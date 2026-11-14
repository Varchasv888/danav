/** The trail of one purchase as the API returns it from GET /purchase/flow, and the small rules the screens share. */
export type PurchaseKind = "order" | "receipt" | "bill" | "return";
export type PurchaseStep = "order" | "receipt" | "bill" | "payment";
export interface PurchaseDoc { id: string; number: string; date: string; status: string; href: string; amount?: string }
export interface PurchaseFlow {
  current: PurchaseStep | "return";
  steps: Record<PurchaseStep, PurchaseDoc[]>;
  returns: PurchaseDoc[];
  supplierId: string | null;
  money: { billed: string; paid: string; returned: string; outstanding: string; status: "none" | "unpaid" | "part" | "paid" };
}

export const PURCHASE_STEPS: PurchaseStep[] = ["order", "receipt", "bill", "payment"];

/** done: has documents; current: the one being looked at; skipped: left out although later steps exist (order and receipt only); todo: not reached. */
export function purchaseStepStates(flow: PurchaseFlow): { step: PurchaseStep; docs: PurchaseDoc[]; state: "done" | "current" | "skipped" | "todo" }[] {
  return PURCHASE_STEPS.map((step, i) => {
    const docs = flow.steps[step];
    const laterHasDocs = PURCHASE_STEPS.slice(i + 1).some((s) => flow.steps[s].length > 0);
    const state = flow.current === step ? "current" : docs.length ? "done" : (step === "order" || step === "receipt") && laterHasDocs ? "skipped" : "todo";
    return { step, docs, state };
  });
}

/** Pay supplier is offered only while something is still owed on a posted bill of this trail. */
export function paySupplierHref(flow: PurchaseFlow): string | null {
  if (!flow.supplierId) return null;
  if (flow.money.status !== "unpaid" && flow.money.status !== "part") return null;
  return `/accounts/bill-receipt?kind=payable&party=${flow.supplierId}`;
}
