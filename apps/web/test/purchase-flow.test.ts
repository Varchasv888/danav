import { describe, expect, it } from "vitest";
import { paySupplierHref, purchaseStepStates, type PurchaseDoc, type PurchaseFlow } from "../lib/purchase-flow";

const doc = (id: string): PurchaseDoc => ({ id, number: id.toUpperCase(), date: "2026-11-01", status: "posted", href: `/x/${id}` });
const flow = (over: Partial<PurchaseFlow["steps"]>, current: PurchaseFlow["current"], status: PurchaseFlow["money"]["status"] = "unpaid"): PurchaseFlow => ({
  current, supplierId: "sup-1", returns: [],
  steps: { order: [], receipt: [], bill: [], payment: [], ...over },
  money: { billed: "1000.00", paid: "0.00", returned: "0.00", outstanding: "1000.00", status },
});
const states = (f: PurchaseFlow) => Object.fromEntries(purchaseStepStates(f).map((s) => [s.step, s.state]));

describe("purchase trail steps", () => {
  it("marks the step being viewed, those done, those left out and those not reached", () => {
    expect(states(flow({ order: [doc("o1")], bill: [doc("b1")] }, "bill"))).toEqual({ order: "done", receipt: "skipped", bill: "current", payment: "todo" });
  });

  it("a bill made straight from nothing shows order and receipt as skipped, payment as not yet", () => {
    expect(states(flow({ bill: [doc("b1")] }, "bill"))).toEqual({ order: "skipped", receipt: "skipped", bill: "current", payment: "todo" });
  });

  it("an order with nothing after it leaves the later steps not reached", () => {
    expect(states(flow({ order: [doc("o1")] }, "order"))).toEqual({ order: "current", receipt: "todo", bill: "todo", payment: "todo" });
  });
});

describe("pay supplier link", () => {
  it("is offered only while money is still owed, and goes to that supplier", () => {
    expect(paySupplierHref(flow({ bill: [doc("b1")] }, "bill", "unpaid"))).toBe("/accounts/bill-receipt?kind=payable&party=sup-1");
    expect(paySupplierHref(flow({ bill: [doc("b1")] }, "bill", "part"))).toBe("/accounts/bill-receipt?kind=payable&party=sup-1");
    expect(paySupplierHref(flow({ bill: [doc("b1")] }, "bill", "paid"))).toBeNull();
    expect(paySupplierHref(flow({ order: [doc("o1")] }, "order", "none"))).toBeNull();
  });
});
