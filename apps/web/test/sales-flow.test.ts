import { describe, expect, it } from "vitest";
import { receivePaymentHref, stepStates, type Flow, type FlowDoc } from "../lib/sales-flow";

const doc = (id: string): FlowDoc => ({ id, number: id.toUpperCase(), date: "2026-11-01", status: "posted", href: `/x/${id}` });
const flow = (over: Partial<Flow["steps"]>, current: Flow["current"], status: Flow["money"]["status"] = "unpaid"): Flow => ({
  current, customerId: "cust-1", creditNotes: [],
  steps: { quotation: [], order: [], deliveryOrder: [], challan: [], invoice: [], receipt: [], ...over },
  money: { billed: "1000.00", received: "0.00", credited: "0.00", outstanding: "1000.00", status },
});
const states = (f: Flow) => Object.fromEntries(stepStates(f).map((s) => [s.step, s.state]));

describe("sales trail steps", () => {
  it("marks the step being viewed, the ones done, the ones left out, and the ones not reached", () => {
    const f = flow({ order: [doc("o1")], challan: [doc("c1")], invoice: [doc("i1")] }, "invoice");
    expect(states(f)).toEqual({ quotation: "skipped", order: "done", deliveryOrder: "skipped", challan: "done", invoice: "current", receipt: "todo" });
  });

  it("does not call a later step skipped while nothing after it exists yet", () => {
    const f = flow({ order: [doc("o1")] }, "order");
    expect(states(f)).toEqual({ quotation: "skipped", order: "current", deliveryOrder: "todo", challan: "todo", invoice: "todo", receipt: "todo" });
  });

  it("an invoice made straight from nothing shows every earlier step as skipped, and payment as not yet", () => {
    const straight = flow({ invoice: [doc("i1")] }, "invoice");
    expect(states(straight)).toEqual({ quotation: "skipped", order: "skipped", deliveryOrder: "skipped", challan: "skipped", invoice: "current", receipt: "todo" });
    const paid = flow({ invoice: [doc("i1")], receipt: [doc("r1")] }, "invoice", "paid");
    expect(states(paid).receipt).toBe("done");
  });
});

describe("receive payment link", () => {
  it("is offered only while money is still owed, and goes to that customer", () => {
    expect(receivePaymentHref(flow({ invoice: [doc("i1")] }, "invoice", "unpaid"))).toBe("/accounts/bill-receipt?party=cust-1");
    expect(receivePaymentHref(flow({ invoice: [doc("i1")] }, "invoice", "part"))).toBe("/accounts/bill-receipt?party=cust-1");
    expect(receivePaymentHref(flow({ invoice: [doc("i1")] }, "invoice", "paid"))).toBeNull();
    expect(receivePaymentHref(flow({ order: [doc("o1")] }, "order", "none"))).toBeNull();
  });
});
