import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const flow = (kind: string, docId: string) => get(`/purchase/flow?kind=${kind}&id=${docId}`);
const ids = (docs: { id: string }[]) => docs.map((d) => d.id);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("purchaseflow")).cookie as string;
  const groups = (await get("/accounts/groups")) as { id: string; key: string }[];
  id.supplier = (await post("/accounts", { name: "Flow Supplier", groupId: groups.find((g) => g.key === "sundry_creditors")!.id, gstin: "29AAGCB7383J1Z4" })).body.id;
  const accounts = (await get("/accounts")) as { id: string; key: string | null }[];
  id.cash = accounts.find((a) => a.key === "cash")!.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.shirt = (await post("/items", { name: "Flow Shirt", hsn: "6205", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, purchaseRate: "300" })).body.id;
});
afterAll(() => t.close());

describe("the trail of one purchase", () => {
  it("links order, receipt, bill, payments and a return, from any document", async () => {
    const order = await post("/purchase-orders", { supplierId: id.supplier, date: "2026-06-01", lines: [{ itemId: id.shirt, qty: "100", rate: "300" }] });
    expect(order.status, JSON.stringify(order.body)).toBe(201);
    const orderLine = (await get(`/purchase-orders/${order.body.id}`)).lines[0].id;
    const receipt = await post("/goods-receipts", { supplierId: id.supplier, orderId: order.body.id, date: "2026-06-05", lines: [{ itemId: id.shirt, qty: "100", orderLineId: orderLine }] });
    expect(receipt.status, JSON.stringify(receipt.body)).toBe(201);
    const receiptLine = (await get(`/goods-receipts/${receipt.body.id}`)).lines[0].id;
    const bill = await post("/purchase-bills", { supplierId: id.supplier, date: "2026-06-08", supplierInvoiceNo: "FLOW/1", supplierInvoiceDate: "2026-06-05", lines: [{ itemId: id.shirt, qty: "100", rate: "300", receiptLineId: receiptLine }] });
    expect(bill.status, JSON.stringify(bill.body)).toBe(201);
    const billDoc = await get(`/purchase-bills/${bill.body.id}`);

    // From the bill: the whole trail, nothing paid yet.
    const fromBill = await flow("bill", bill.body.id);
    expect(fromBill.current).toBe("bill");
    expect(ids(fromBill.steps.order)).toEqual([order.body.id]);
    expect(ids(fromBill.steps.receipt)).toEqual([receipt.body.id]);
    expect(ids(fromBill.steps.bill)).toEqual([bill.body.id]);
    expect(fromBill.steps.payment).toEqual([]);
    expect(fromBill.money).toMatchObject({ paid: "0.00", status: "unpaid" });
    expect(fromBill.steps.bill[0].href).toBe(`/purchase/bills/${bill.body.id}`);
    expect(fromBill.supplierId).toBe(id.supplier);

    // The same trail from the order and from the receipt.
    for (const [kind, docId] of [["order", order.body.id], ["receipt", receipt.body.id]] as const) {
      const f = await flow(kind, docId);
      expect(ids(f.steps.bill), kind).toEqual([bill.body.id]);
      expect(ids(f.steps.receipt), kind).toEqual([receipt.body.id]);
      expect(ids(f.steps.order), kind).toEqual([order.body.id]);
    }

    // A part payment, then the rest.
    const billed = Number(fromBill.money.billed);
    expect(billed).toBeGreaterThan(1000);
    const part = await post("/bill-receipts", { kind: "payable", partyId: id.supplier, accountId: id.cash, date: "2026-06-10", amount: "1000", allocations: [{ billVoucherId: billDoc.voucherId, amount: "1000" }] });
    expect(part.status, JSON.stringify(part.body)).toBe(201);
    const afterPart = await flow("bill", bill.body.id);
    expect(afterPart.steps.payment).toHaveLength(1);
    expect(afterPart.money).toMatchObject({ paid: "1000.00", status: "part" });
    expect(Number(afterPart.money.outstanding)).toBeCloseTo(billed - 1000, 2);

    // A return to the supplier lowers what is owed and is found from itself.
    const ret = await post("/purchase-returns", { billId: bill.body.id, date: "2026-06-12", reason: "Ten damaged", lines: [{ billLineId: billDoc.lines[0].id, qty: "10" }] });
    expect(ret.status, JSON.stringify(ret.body)).toBe(201);
    const fromReturn = await flow("return", ret.body.id);
    expect(fromReturn.current).toBe("return");
    expect(ids(fromReturn.steps.bill)).toEqual([bill.body.id]);
    expect(ids(fromReturn.returns)).toEqual([ret.body.id]);
    expect(Number(fromReturn.money.returned)).toBeGreaterThan(0);
    const rest = Number(fromReturn.money.outstanding);
    const settle = await post("/bill-receipts", { kind: "payable", partyId: id.supplier, accountId: id.cash, date: "2026-06-14", amount: String(rest), allocations: [{ billVoucherId: billDoc.voucherId, amount: String(rest) }] });
    expect(settle.status, JSON.stringify(settle.body)).toBe(201);
    expect((await flow("bill", bill.body.id)).money).toMatchObject({ outstanding: "0.00", status: "paid" });
  });

  it("shows a bill with no order or receipt as a trail of one, and keeps businesses apart", async () => {
    const bill = await post("/purchase-bills", { supplierId: id.supplier, date: "2026-06-20", supplierInvoiceNo: "FLOW/2", supplierInvoiceDate: "2026-06-20", lines: [{ itemId: id.shirt, qty: "1", rate: "300", warehouseId: id.main }] });
    expect(bill.status, JSON.stringify(bill.body)).toBe(201);
    const f = await flow("bill", bill.body.id);
    expect(f.steps.order).toEqual([]);
    expect(f.steps.receipt).toEqual([]);
    expect(f.steps.bill).toHaveLength(1);
    expect(f.money.status).toBe("unpaid");
    const other = (await t.signup("purchaseflow-other")).cookie;
    expect((await t.call(other, "GET", `/purchase/flow?kind=bill&id=${bill.body.id}`)).status).toBe(404);
    expect((await t.call(c, "GET", `/purchase/flow?kind=bogus&id=${bill.body.id}`)).status).toBe(400);
  });
});
