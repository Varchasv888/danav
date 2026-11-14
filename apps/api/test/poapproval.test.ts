import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let owner: string;
let buyer: string;
const id: Record<string, string> = {};
const lines = (qty: string) => [{ itemId: id.shirt, qty, rate: "300" }];

beforeAll(async () => {
  t = await testApp();
  owner = (await t.signup("poapproval")).cookie as string;
  const groups = (await t.call(owner, "GET", "/accounts/groups")).body as { id: string; key: string }[];
  id.supplier = (await t.call(owner, "POST", "/accounts", { name: "Approval Supplier", groupId: groups.find((g) => g.key === "sundry_creditors")!.id, gstin: "29AAGCB7383J1Z4" })).body.id;
  const setup = (await t.call(owner, "GET", "/inventory/setup")).body;
  id.shirt = (await t.call(owner, "POST", "/items", { name: "Approval Shirt", hsn: "6205", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, purchaseRate: "300" })).body.id;
  const roles = (await t.call(owner, "GET", "/roles")).body as { id: string; key: string }[];
  const inv = await t.call(owner, "POST", "/invitations", { email: `buyer-${t.run}@test.varchasv.in`, roleId: roles.find((r) => r.key === "purchase")!.id });
  buyer = (await t.call("", "POST", "/invitations/accept", { token: inv.body.inviteUrl.split("/invite/")[1], name: "Buyer", password: "ledger-balanced-1" })).cookie as string;
});
afterAll(() => t.close());

describe("purchase order approval limit", () => {
  it("with no limit every order goes straight through", async () => {
    const r = await t.call(buyer, "POST", "/purchase-orders", { supplierId: id.supplier, date: "2026-06-01", lines: lines("500") });
    expect(r.status, JSON.stringify(r.body)).toBe(201);
    expect(r.body.approvalStatus).toBe("approved");
  });

  it("an order above the limit raised by a buyer waits, and goods cannot be received or billed on it", async () => {
    expect((await t.call(owner, "PUT", "/settings/purchase-approval", { limit: "20000" })).body.limit).toBe("20000.00");
    const small = await t.call(buyer, "POST", "/purchase-orders", { supplierId: id.supplier, date: "2026-06-02", lines: lines("10") });
    expect(small.body.approvalStatus).toBe("approved");
    const big = await t.call(buyer, "POST", "/purchase-orders", { supplierId: id.supplier, date: "2026-06-02", lines: lines("500") });
    expect(big.body.approvalStatus).toBe("pending");
    const line = (await t.call(buyer, "GET", `/purchase-orders/${big.body.id}`)).body.lines[0].id;
    const grn = await t.call(buyer, "POST", "/goods-receipts", { supplierId: id.supplier, orderId: big.body.id, date: "2026-06-05", lines: [{ itemId: id.shirt, qty: "500", orderLineId: line }] });
    expect(grn.status).toBe(409);
    expect(grn.body.error).toBe("order_not_approved");
    const bill = await t.call(buyer, "POST", "/purchase-bills", { supplierId: id.supplier, orderId: big.body.id, date: "2026-06-06", supplierInvoiceNo: "A/1", supplierInvoiceDate: "2026-06-05", lines: [{ itemId: id.shirt, qty: "500", rate: "300", orderLineId: line }] });
    expect(bill.body.error).toBe("order_not_approved");
    // The buyer cannot approve their own order.
    expect((await t.call(buyer, "POST", `/purchase-orders/${big.body.id}/decide`, { decision: "approve" })).status).toBe(403);
    // The owner approves and goods can then be received.
    expect((await t.call(owner, "POST", `/purchase-orders/${big.body.id}/decide`, { decision: "approve" })).status).toBe(200);
    expect((await t.call(owner, "GET", `/purchase-orders/${big.body.id}`)).body.approvalStatus).toBe("approved");
    const ok = await t.call(buyer, "POST", "/goods-receipts", { supplierId: id.supplier, orderId: big.body.id, date: "2026-06-05", lines: [{ itemId: id.shirt, qty: "500", orderLineId: line }] });
    expect(ok.status, JSON.stringify(ok.body)).toBe(201);
  });

  it("a person with the approve right is never held up, and a rejection needs a reason and cancels the order", async () => {
    const mine = await t.call(owner, "POST", "/purchase-orders", { supplierId: id.supplier, date: "2026-06-03", lines: lines("900") });
    expect(mine.body.approvalStatus).toBe("approved");
    const big = await t.call(buyer, "POST", "/purchase-orders", { supplierId: id.supplier, date: "2026-06-03", lines: lines("600") });
    expect((await t.call(owner, "POST", `/purchase-orders/${big.body.id}/decide`, { decision: "reject" })).status).toBe(400);
    expect((await t.call(owner, "POST", `/purchase-orders/${big.body.id}/decide`, { decision: "reject", note: "Too much stock" })).status).toBe(200);
    const after = (await t.call(owner, "GET", `/purchase-orders/${big.body.id}`)).body;
    expect(after).toMatchObject({ approvalStatus: "rejected", status: "cancelled", approvalNote: "Too much stock" });
    expect((await t.call(owner, "POST", `/purchase-orders/${big.body.id}/decide`, { decision: "approve" })).status).toBe(409);
  });

  it("removing the limit lets large orders through again", async () => {
    expect((await t.call(owner, "PUT", "/settings/purchase-approval", { limit: null })).body.limit).toBeNull();
    const r = await t.call(buyer, "POST", "/purchase-orders", { supplierId: id.supplier, date: "2026-06-04", lines: lines("900") });
    expect(r.body.approvalStatus).toBe("approved");
  });
});
