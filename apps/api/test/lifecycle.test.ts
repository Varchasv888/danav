import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { LIFECYCLES, businessDate, canMove, type LifecycleName } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown = {}) => t.call(c, "POST", url, body);

/** Records the state after each step and checks every state is declared and every move allowed. */
async function trace(machine: LifecycleName, read: () => Promise<string>, steps: (() => Promise<unknown>)[]) {
  const seen = [await read()];
  for (const step of steps) { await step(); seen.push(await read()); }
  for (const s of seen) expect(Object.keys(LIFECYCLES[machine]), `${machine}: undeclared state ${s}`).toContain(s);
  for (let i = 1; i < seen.length; i++) expect(canMove(machine, seen[i - 1]!, seen[i]!), `${machine}: ${seen[i - 1]} to ${seen[i]}`).toBe(true);
  return seen;
}

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("lifecycle", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.shop2 = (await post("/warehouses", { name: "Second" })).body.id;
  id.shirt = (await post("/items", { name: "Life Shirt", hsn: "6205", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, saleRate: "500" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "100", rate: "300" }] });
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.cust = (await post("/accounts", { name: "Life Customer", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  id.emp = (await post("/employees", { name: "Life Person", gender: "male", joinedOn: "2026-01-01", workState: "27", components: [{ code: "BASIC", name: "Basic", monthly: "15000", pfWage: true }] })).body.id;
  for (const a of await get("/accounts") as { id: string; key: string | null }[]) if (a.key) id[a.key] = a.id;
});
afterAll(() => t.close());

describe("written lifecycles", () => {
  it("every machine only moves to states it declares", () => {
    for (const [name, m] of Object.entries(LIFECYCLES)) for (const [from, to] of Object.entries(m)) for (const s of to) expect(Object.keys(m), `${name}: ${from} to ${s}`).toContain(s);
  });

  it("stock transfer: in transit, then received or called back", async () => {
    const send = async () => (await post("/stock-transfers", { fromWarehouseId: id.main, toWarehouseId: id.shop2, date: "2026-10-10", lines: [{ itemId: id.shirt, qty: "5" }] })).body.id as string;
    const a = await send();
    const line = (await get(`/stock-transfers/${a}`)).lines[0].id;
    expect(await trace("stockTransfer", async () => (await get(`/stock-transfers/${a}`)).status, [() => post(`/stock-transfers/${a}/receive`, { date: "2026-10-12", lines: [{ lineId: line, received: "5" }] })])).toEqual(["in_transit", "received"]);
    const b = await send();
    expect(await trace("stockTransfer", async () => (await get(`/stock-transfers/${b}`)).status, [() => post(`/stock-transfers/${b}/cancel`, { reason: "Sent in error" })])).toEqual(["in_transit", "cancelled"]);
  });

  it("delivery order: open, then closed or cancelled", async () => {
    const make = async () => (await post("/delivery-orders", { customerId: id.cust, date: "2026-10-02", lines: [{ itemId: id.shirt, qty: "2" }] })).body.id as string;
    const a = await make();
    expect(await trace("deliveryOrder", async () => (await get(`/delivery-orders/${a}`)).status, [() => post(`/delivery-orders/${a}/close`)])).toEqual(["open", "closed"]);
    const b = await make();
    expect(await trace("deliveryOrder", async () => (await get(`/delivery-orders/${b}`)).status, [() => post(`/delivery-orders/${b}/cancel`)])).toEqual(["open", "cancelled"]);
  });

  it("sales order: open, partly delivered, delivered; or cancelled", async () => {
    const order = (await post("/sales-orders", { customerId: id.cust, date: "2026-10-01", lines: [{ itemId: id.shirt, qty: "10", rate: "500" }] })).body.id as string;
    const orderLine = (await get(`/sales-orders/${order}`)).lines[0].id;
    const deliver = (qty: string) => () => post("/delivery-notes", { customerId: id.cust, orderId: order, date: "2026-10-05", warehouseId: id.main, lines: [{ itemId: id.shirt, qty, orderLineId: orderLine }] });
    expect(await trace("salesOrder", async () => (await get(`/sales-orders/${order}`)).status, [deliver("4"), deliver("6")])).toEqual(["open", "partial", "delivered"]);
    const other = (await post("/sales-orders", { customerId: id.cust, date: "2026-10-01", lines: [{ itemId: id.shirt, qty: "1", rate: "500" }] })).body.id as string;
    expect(await trace("salesOrder", async () => (await get(`/sales-orders/${other}`)).status, [() => post(`/sales-orders/${other}/cancel`)])).toEqual(["open", "cancelled"]);
  });

  it("delivery note: posted, then cancelled; a reversal is a state, not a delete", async () => {
    const note = (await post("/delivery-notes", { customerId: id.cust, date: "2026-10-06", warehouseId: id.main, lines: [{ itemId: id.shirt, qty: "1" }] })).body.id as string;
    expect(await trace("deliveryNote", async () => (await get(`/delivery-notes/${note}`)).status, [() => post(`/delivery-notes/${note}/cancel`, { reason: "Wrong party" })])).toEqual(["posted", "cancelled"]);
  });

  it("stock count: counting, submitted, back to counting, submitted, approved; or cancelled", async () => {
    const make = async (name: string) => (await post("/stock-counts", { warehouseId: id.main, name })).body.id as string;
    const a = await make("Life count");
    const state = (x: string) => async () => (await get(`/stock-counts/${x}`)).status as string;
    expect(await trace("stockCount", state(a), [
      () => post(`/stock-counts/${a}/submit`), () => post(`/stock-counts/${a}/reopen`), () => post(`/stock-counts/${a}/submit`),
      () => post(`/stock-counts/${a}/approve`, { reason: "Counted again and agreed" }),
    ])).toEqual(["counting", "submitted", "counting", "submitted", "approved"]);
    const b = await make("Life count two");
    expect(await trace("stockCount", state(b), [() => post(`/stock-counts/${b}/cancel`, { reason: "Not needed" })])).toEqual(["counting", "cancelled"]);
  });

  it("loan request: pending, then approved or rejected", async () => {
    const ask = async () => (await post(`/employees/${id.emp}/loan-requests`, { kind: "advance", amount: "1000", instalment: "500" })).body.id as string;
    const state = (x: string) => async () => ((await get("/loan-requests")) as { id: string; status: string }[]).find((r) => r.id === x)!.status;
    const a = await ask();
    expect(await trace("loanRequest", state(a), [() => post(`/loan-requests/${a}/decide`, { decision: "approve", date: "2026-10-05", accountId: id.cash })])).toEqual(["pending", "approved"]);
    const b = await ask();
    expect(await trace("loanRequest", state(b), [() => post(`/loan-requests/${b}/decide`, { decision: "reject" })])).toEqual(["pending", "rejected"]);
  });

  it("stipend: posted, then cancelled", async () => {
    const s = (await post(`/employees/${id.emp}/stipends`, { period: "2026-10", amount: "500", date: "2026-10-31", accountId: id.cash })).body.id as string;
    const state = async () => ((await get("/stipends")) as { id: string; status: string }[]).find((r) => r.id === s)!.status;
    expect(await trace("stipendPayment", state, [() => post(`/stipends/${s}/cancel`, { reason: "Paid twice" })])).toEqual(["posted", "cancelled"]);
  });

  it("sales invoice, purchase bill, counter bill and voucher: posted, then cancelled or voided, never deleted", async () => {
    const groups: { id: string; key: string }[] = await get("/accounts/groups");
    const sup = (await post("/accounts", { name: "Life Supplier", groupId: groups.find((g) => g.key === "sundry_creditors")!.id, stateCode: "27" })).body.id as string;
    const inv = (await post("/sales-invoices", { customerId: id.cust, date: "2026-10-07", lines: [{ itemId: id.shirt, qty: "1", rate: "500" }] })).body.id as string;
    expect(await trace("salesInvoice", async () => ((await get(`/sales-invoices/${inv}`)).status as string), [() => post(`/sales-invoices/${inv}/cancel`, { reason: "Wrong party" })])).toEqual(["posted", "cancelled"]);
    const bill = (await post("/purchase-bills", { supplierId: sup, date: "2026-10-07", supplierInvoiceNo: "LC/1", supplierInvoiceDate: "2026-10-07", lines: [{ itemId: id.shirt, qty: "1", rate: "300" }] })).body.id as string;
    expect(await trace("purchaseBill", async () => ((await get(`/purchase-bills/${bill}`)).status as string), [() => post(`/purchase-bills/${bill}/cancel`, { reason: "Wrong supplier" })])).toEqual(["posted", "cancelled"]);
    const v = (await post("/vouchers", { type: "journal", date: "2026-10-07", lines: [{ accountId: id.cash, debit: "100" }, { accountId: id.cust, credit: "100" }] })).body.id as string;
    expect(await trace("voucher", async () => ((await get(`/vouchers/${v}`)).status as string), [() => post(`/vouchers/${v}/cancel`, { reason: "Typing error" })])).toEqual(["posted", "cancelled"]);
    const term = (await post("/pos/terminals", { name: "Life counter" })).body.id as string;
    await post("/pos/sessions", { terminalId: term, openingCash: "0" });
    const pos = (await post("/pos/bills", { terminalId: term, lines: [{ itemId: id.shirt, qty: "1" }], payments: [{ mode: "cash", amount: "500" }] })).body.id as string;
    const posState = async () => ((await get("/pos/bills?date=" + businessDate())) as { id: string; status: string }[]).find((b) => b.id === pos)!.status;
    expect(await trace("posBill", posState, [() => post(`/pos/bills/${pos}/void`, { reason: "Customer left" })])).toEqual(["paid", "void"]);
  });

  it("goods receipt: posted, then cancelled", async () => {
    const groups: { id: string; key: string }[] = await get("/accounts/groups");
    const sup = (await post("/accounts", { name: "Life Mill", groupId: groups.find((g) => g.key === "sundry_creditors")!.id, stateCode: "27" })).body.id as string;
    const grn = (await post("/goods-receipts", { supplierId: sup, date: "2026-10-08", lines: [{ itemId: id.shirt, qty: "2", rate: "300" }] })).body.id as string;
    expect(await trace("goodsReceipt", async () => ((await get(`/goods-receipts/${grn}`)).status as string), [() => post(`/goods-receipts/${grn}/cancel`, { reason: "Entered twice" })])).toEqual(["posted", "cancelled"]);
  });
});
