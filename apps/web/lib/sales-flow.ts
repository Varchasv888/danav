/** The trail of one sale as the API returns it from GET /sales/flow, and the small rules the screens share. */
export type FlowKind = "quotation" | "order" | "deliveryOrder" | "challan" | "invoice" | "creditNote";
export type FlowStep = "quotation" | "order" | "deliveryOrder" | "challan" | "invoice" | "receipt";
export interface FlowDoc { id: string; number: string; date: string; status: string; href: string; amount?: string }
export interface Flow {
  current: FlowStep | "creditNote";
  steps: Record<FlowStep, FlowDoc[]>;
  creditNotes: FlowDoc[];
  customerId: string | null;
  money: { billed: string; received: string; credited: string; outstanding: string; status: "none" | "unpaid" | "part" | "paid" };
}

export const STEP_ORDER: FlowStep[] = ["quotation", "order", "deliveryOrder", "challan", "invoice", "receipt"];

/** done: this step has documents; current: the one being looked at; skipped: left out, later steps exist; todo: not reached yet. */
export type StepState = "done" | "current" | "skipped" | "todo";

export function stepStates(flow: Flow): { step: FlowStep; docs: FlowDoc[]; state: StepState }[] {
  return STEP_ORDER.map((step, i) => {
    const docs = flow.steps[step];
    const laterHasDocs = STEP_ORDER.slice(i + 1).some((s) => flow.steps[s].length > 0);
    const state: StepState = flow.current === step ? "current" : docs.length ? "done" : step !== "invoice" && step !== "receipt" && laterHasDocs ? "skipped" : "todo";
    return { step, docs, state };
  });
}

/** Where the money stands, in the words the screen uses. */
export function moneyLine(flow: Flow): "none" | "unpaid" | "part" | "paid" {
  return flow.money.status;
}

/** Receive payment is offered only while something is still owed on a posted invoice of this trail. */
export function receivePaymentHref(flow: Flow): string | null {
  if (!flow.customerId) return null;
  if (flow.money.status !== "unpaid" && flow.money.status !== "part") return null;
  return `/accounts/bill-receipt?party=${flow.customerId}`;
}
