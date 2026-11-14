import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("purchasereports")).cookie as string;
  const groups = (await get("/accounts/groups")) as { id: string; key: string }[];
  id.supplier = (await post("/accounts", { name: "Match Supplier", groupId: groups.find((g) => g.key === "sundry_creditors")!.id, gstin: "29AAGCB7383J1Z4" })).body.id;
  const setup = await get("/inventory/setup");
  id.shirt = (await post("/items", { name: "Match Shirt", hsn: "6205", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, purchaseRate: "300" })).body.id;
});
afterAll(() => t.close());

describe("ordered, received and billed", () => {
  it("flags a bill above the order rate, an under-delivery and goods not yet billed", async () => {
    const order = await post("/purchase-orders", { supplierId: id.supplier, date: "2026-06-01", expectedOn: "2026-06-05", lines: [{ itemId: id.shirt, qty: "100", rate: "300" }] });
    expect(order.status, JSON.stringify(order.body)).toBe(201);
    const line = (await get(`/purchase-orders/${order.body.id}`)).lines[0].id;
    const grn = await post("/goods-receipts", { supplierId: id.supplier, orderId: order.body.id, date: "2026-06-08", lines: [{ itemId: id.shirt, qty: "80", orderLineId: line }] });
    expect(grn.status, JSON.stringify(grn.body)).toBe(201);
    const open = await get(`/purchase/match?orderId=${order.body.id}`);
    expect(open.lines[0].flags).toEqual(expect.arrayContaining(["received_not_billed", "not_yet_received"]));
    const receiptLine = (await get(`/goods-receipts/${grn.body.id}`)).lines[0].id;
    const bill = await post("/purchase-bills", { supplierId: id.supplier, date: "2026-06-09", supplierInvoiceNo: "M/1", supplierInvoiceDate: "2026-06-08", lines: [{ itemId: id.shirt, qty: "80", rate: "310", receiptLineId: receiptLine, orderLineId: line }] });
    expect(bill.status, JSON.stringify(bill.body)).toBe(201);
    const m = await get(`/purchase/match?orderId=${order.body.id}`);
    expect(m.status).toBe("exception");
    expect(m.lines[0]).toMatchObject({ billedRate: "310.0000", rateDifference: "10.00", rateCost: "800.00" });
    expect(m.lines[0].flags).toContain("rate_differs");
    expect(m.rateCost).toBe("800.00");
  });

  it("reports on time, in full and billed rate gap per supplier", async () => {
    const s = await get("/purchase/supplier-scorecard?from=2026-04-01&to=2026-12-31");
    const row = s.suppliers.find((x: { supplier: string }) => x.supplier === "Match Supplier");
    expect(row).toMatchObject({ orders: 1, receipts: 1, onTimePct: "0.0", inFullPct: "80.0", leadDaysAvg: "7.0", leadDaysMax: 7 });
    expect(Number(row.billedRateGapPct)).toBeCloseTo(3.33, 1);
  });

  it("refuses a backwards date range and keeps other businesses out", async () => {
    expect((await t.call(c, "GET", "/purchase/supplier-scorecard?from=2026-12-31&to=2026-04-01")).status).toBe(400);
    const other = (await t.signup("purchasereports-other")).cookie;
    const orders = (await get("/purchase-orders")) as { id: string }[];
    expect((await t.call(other, "GET", `/purchase/match?orderId=${orders[0]!.id}`)).status).toBe(404);
  });
});

describe("debit note for a shortage", () => {
  it("debits goods billed but never received, without moving stock, and no more than the shortage", async () => {
    const stockQty = async () => ((await get("/reports/stock-summary?asOf=2026-12-31")).rows as { itemId: string; qty: string }[]).find((r) => r.itemId === id.shirt)!.qty;
    const before = await stockQty();
    const grn = await post("/goods-receipts", { supplierId: id.supplier, date: "2026-07-01", lines: [{ itemId: id.shirt, qty: "90", challanQty: "100", short: "10", rate: "300" }] });
    expect(grn.status, JSON.stringify(grn.body)).toBe(201);
    const receiptLine = (await get(`/goods-receipts/${grn.body.id}`)).lines[0].id;
    const bill = await post("/purchase-bills", { supplierId: id.supplier, date: "2026-07-02", supplierInvoiceNo: "S/1", supplierInvoiceDate: "2026-07-01", lines: [{ itemId: id.shirt, qty: "100", rate: "300", receiptLineId: receiptLine }] });
    expect(bill.status, JSON.stringify(bill.body)).toBe(201);
    const billLine = (await get(`/purchase-bills/${bill.body.id}`)).lines[0].id;
    const afterBill = await stockQty();
    expect((await get(`/purchase-bills/${bill.body.id}/shortages`))).toEqual([expect.objectContaining({ billLineId: billLine, available: "10.0000" })]);
    expect((await post("/purchase-returns", { billId: bill.body.id, date: "2026-07-03", reason: "Ten short", shortage: true, lines: [{ billLineId: billLine, qty: "11" }] })).body.error).toBe("over_shortage");
    const note = await post("/purchase-returns", { billId: bill.body.id, date: "2026-07-03", reason: "Ten short", shortage: true, lines: [{ billLineId: billLine, qty: "10" }] });
    expect(note.status, JSON.stringify(note.body)).toBe(201);
    expect(note.body.kind).toBe("shortage");
    expect(await stockQty()).toBe(afterBill); // no stock went out: the goods never came in
    expect(Number(afterBill) - Number(before)).toBe(90);
    expect(await get(`/purchase-bills/${bill.body.id}/shortages`)).toEqual([]);
  });
});

describe("supplier quote comparison", () => {
  it("ranks live quotes by landed cost, ignores expired ones, and compares with the last price paid", async () => {
    const groups = (await get("/accounts/groups")) as { id: string; key: string }[];
    const other = (await post("/accounts", { name: "Quote Supplier B", groupId: groups.find((g) => g.key === "sundry_creditors")!.id, stateCode: "27" })).body.id;
    const base = { itemId: id.shirt, quotedOn: "2026-11-01" };
    expect((await post("/purchase/quotes", { ...base, supplierId: id.supplier, rate: "290", extraCost: "30" })).status).toBe(201);
    expect((await post("/purchase/quotes", { ...base, supplierId: other, rate: "310", extraCost: "0", leadDays: 5 })).status).toBe(201);
    expect((await post("/purchase/quotes", { ...base, supplierId: other, rate: "100", validUntil: "2026-10-01" })).body.error).toBe("valid_before_quoted");
    expect((await post("/purchase/quotes", { ...base, quotedOn: "2026-09-01", supplierId: other, rate: "100", validUntil: "2026-10-01" })).status).toBe(201);
    const c = await get(`/purchase/quotes?itemId=${id.shirt}`);
    expect(c.quotes.map((q: { landed: string }) => q.landed)).toEqual(["310.00", "320.00", "100.00"]);
    expect(c.quotes[0]).toMatchObject({ cheapest: true, expired: false });
    expect(c.quotes[2]).toMatchObject({ expired: true, cheapest: false });
    expect(Number(c.lastPaid.rate)).toBeGreaterThan(0); // the latest bill for the item in the earlier tests
  });
});

describe("fault codes on damaged goods", () => {
  it("keeps the fault of damaged pieces, shows it on the supplier claim, and refuses a code with no damage", async () => {
    const ok = await post("/goods-receipts", { supplierId: id.supplier, date: "2026-08-01", lines: [{ itemId: id.shirt, qty: "8", challanQty: "10", damaged: "2", defectCode: "stitching", rate: "300" }] });
    expect(ok.status, JSON.stringify(ok.body)).toBe(201);
    const claims = await get("/reports/supplier-claims?from=2026-08-01&to=2026-08-31");
    expect(claims.suppliers[0].lines[0]).toMatchObject({ damaged: "2", defectCode: "stitching" });
    expect((await post("/goods-receipts", { supplierId: id.supplier, date: "2026-08-02", lines: [{ itemId: id.shirt, qty: "5", defectCode: "fabric", rate: "300" }] })).body.error).toBe("defect_code_without_damage");
    expect((await post("/goods-receipts", { supplierId: id.supplier, date: "2026-08-02", lines: [{ itemId: id.shirt, qty: "5", challanQty: "6", damaged: "1", defectCode: "tears", rate: "300" }] })).status).toBe(400);
  });
});

