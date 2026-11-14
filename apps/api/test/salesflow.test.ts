import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const flow = (kind: string, docId: string) => get(`/sales/flow?kind=${kind}&id=${docId}`);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("salesflow", { gstin: "27AAPFU0939F1ZV" })).cookie as string;
  const groups = (await get("/accounts/groups")) as { id: string; key: string }[];
  id.shop = (await post("/accounts", { name: "Flow Shop", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  const accounts = (await get("/accounts")) as { id: string; key: string }[];
  id.cash = accounts.find((a) => a.key === "cash")!.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.shirt = (await post("/items", { name: "Flow Shirt", hsn: "6205", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, saleRate: "500" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "100", rate: "300" }] });
});
afterAll(() => t.close());

describe("the trail of one sale", () => {
  it("links quotation, order, delivery order, challan, invoice, receipt and credit note, from any document", async () => {
    const lines = [{ itemId: id.shirt, qty: "10", rate: "500" }];
    const quote = await post("/quotations", { customerId: id.shop, date: today, lines });
    expect(quote.status, JSON.stringify(quote.body)).toBe(201);
    const order = await post("/sales-orders", { customerId: id.shop, quotationId: quote.body.id, date: today, lines });
    expect(order.status, JSON.stringify(order.body)).toBe(201);
    const orderLine = (await get(`/sales-orders/${order.body.id}`)).lines[0].id;
    const dOrder = await post("/delivery-orders", { customerId: id.shop, orderId: order.body.id, date: today, lines: [{ itemId: id.shirt, qty: "10", orderLineId: orderLine }] });
    expect(dOrder.status, JSON.stringify(dOrder.body)).toBe(201);
    const doLine = (await get(`/delivery-orders/${dOrder.body.id}`)).lines[0].id;
    const challan = await post("/delivery-notes", { customerId: id.shop, date: today, warehouseId: id.main, lines: [{ itemId: id.shirt, qty: "10", deliveryOrderLineId: doLine }] });
    expect(challan.status, JSON.stringify(challan.body)).toBe(201);
    const challanLine = (await get(`/delivery-notes/${challan.body.id}`)).lines[0].id;
    const invoice = await post("/sales-invoices", { customerId: id.shop, date: today, lines: [{ itemId: id.shirt, qty: "10", rate: "500", deliveryLineId: challanLine }] });
    expect(invoice.status, JSON.stringify(invoice.body)).toBe(201);
    const invoiceDoc = await get(`/sales-invoices/${invoice.body.id}`);

    // From the invoice: the whole trail, nothing received yet.
    const fromInvoice = await flow("invoice", invoice.body.id);
    expect(fromInvoice.current).toBe("invoice");
    expect(fromInvoice.steps.quotation.map((d: { id: string }) => d.id)).toEqual([quote.body.id]);
    expect(fromInvoice.steps.order.map((d: { id: string }) => d.id)).toEqual([order.body.id]);
    expect(fromInvoice.steps.deliveryOrder.map((d: { id: string }) => d.id)).toEqual([dOrder.body.id]);
    expect(fromInvoice.steps.challan.map((d: { id: string }) => d.id)).toEqual([challan.body.id]);
    expect(fromInvoice.steps.invoice.map((d: { id: string }) => d.id)).toEqual([invoice.body.id]);
    expect(fromInvoice.steps.receipt).toEqual([]);
    expect(fromInvoice.money).toMatchObject({ received: "0.00", status: "unpaid" });
    expect(Number(fromInvoice.money.billed)).toBeGreaterThan(0);
    expect(fromInvoice.steps.invoice[0].href).toBe(`/sales/invoices/${invoice.body.id}`);

    // The same trail is found from every other document in it.
    for (const [kind, docId] of [["quotation", quote.body.id], ["order", order.body.id], ["deliveryOrder", dOrder.body.id], ["challan", challan.body.id]] as const) {
      const f = await flow(kind, docId);
      expect(f.steps.invoice.map((d: { id: string }) => d.id), kind).toEqual([invoice.body.id]);
      expect(f.steps.order.map((d: { id: string }) => d.id), kind).toEqual([order.body.id]);
    }

    // A part payment, then the rest: the receipts and the status follow.
    const billed = Number(fromInvoice.money.billed);
    const part = await post("/bill-receipts", { kind: "receivable", partyId: id.shop, accountId: id.cash, date: today, amount: "1000", allocations: [{ billVoucherId: invoiceDoc.voucherId, amount: "1000" }] });
    expect(part.status, JSON.stringify(part.body)).toBe(201);
    const afterPart = await flow("invoice", invoice.body.id);
    expect(afterPart.steps.receipt).toHaveLength(1);
    expect(afterPart.money).toMatchObject({ received: "1000.00", status: "part" });
    expect(Number(afterPart.money.outstanding)).toBeCloseTo(billed - 1000, 2);
    const rest = await post("/bill-receipts", { kind: "receivable", partyId: id.shop, accountId: id.cash, date: today, amount: String(billed - 1000), allocations: [{ billVoucherId: invoiceDoc.voucherId, amount: String(billed - 1000) }] });
    expect(rest.status, JSON.stringify(rest.body)).toBe(201);
    expect((await flow("invoice", invoice.body.id)).money).toMatchObject({ outstanding: "0.00", status: "paid" });

    // A credit note belongs to the same trail and is found from itself.
    const invLine = invoiceDoc.lines[0].id;
    const cn = await post("/credit-notes", { invoiceId: invoice.body.id, date: today, reason: "Two returned", lines: [{ invoiceLineId: invLine, qty: "2" }] });
    expect(cn.status, JSON.stringify(cn.body)).toBe(201);
    const fromNote = await flow("creditNote", cn.body.id);
    expect(fromNote.current).toBe("creditNote");
    expect(fromNote.steps.invoice.map((d: { id: string }) => d.id)).toEqual([invoice.body.id]);
    expect(fromNote.creditNotes.map((d: { id: string }) => d.id)).toEqual([cn.body.id]);
    expect(Number(fromNote.money.credited)).toBeGreaterThan(0);
  });

  it("shows an invoice made straight from nothing as a trail of one, and keeps businesses apart", async () => {
    const inv = await post("/sales-invoices", { customerId: id.shop, date: today, lines: [{ itemId: id.shirt, qty: "1", rate: "500" }] });
    expect(inv.status).toBe(201);
    const f = await flow("invoice", inv.body.id);
    expect(f.steps.order).toEqual([]);
    expect(f.steps.challan).toEqual([]);
    expect(f.steps.invoice).toHaveLength(1);
    expect(f.money.status).toBe("unpaid");
    const other = (await t.signup("salesflow-other")).cookie;
    expect((await t.call(other, "GET", `/sales/flow?kind=invoice&id=${inv.body.id}`)).status).toBe(404);
    expect((await t.call(c, "GET", "/sales/flow?kind=bogus&id=" + inv.body.id)).status).toBe(400);
  });
});
