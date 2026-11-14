import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const put = (url: string, body: unknown) => t.call(c, "PUT", url, body);
const tokenOf = (body: string) => /\/b\/([A-Za-z0-9_-]+)/.exec(body)?.[1] ?? "";
const open = (token: string) => t.call("", "GET", `/public/documents/${token}`);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("wa", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  const debtors = groups.find((g) => g.key === "sundry_debtors")!.id;
  id.gupta = (await post("/accounts", { name: "Gupta Stores", groupId: debtors, stateCode: "27", phone: "9812345678" })).body.id;
  id.mehta = (await post("/accounts", { name: "Mehta Garments", groupId: debtors, stateCode: "27" })).body.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.shirt = (await post("/items", { name: "Cotton shirt", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, gstRate: "5", hsn: "6205", saleRate: "800", purchaseRate: "450" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "50", rate: "450" }] });
  id.t1 = (await post("/pos/terminals", { name: "Front counter" })).body.id;
  await post("/pos/sessions", { terminalId: id.t1, openingCash: "500" });
});
afterAll(() => t.close());

describe("bills on WhatsApp", () => {
  it("sends the counter bill by itself when switched on, with a link that opens without signing in", async () => {
    await put("/pos/settings", { autoSendBill: true });
    const r = await post("/pos/bills", { terminalId: id.t1, customerPhone: "9876543210", customerName: "Asha", lines: [{ itemId: id.shirt, qty: "1" }], payments: [{ mode: "cash", amount: "800" }] });
    expect(r.status).toBe(201);
    expect(r.body.autoSent).toBe("sent");
    const log = await get("/messages");
    expect(log.counts.sent).toBe(1);
    expect(log.messages[0]).toMatchObject({ to: "919876543210", template: "bill_share", status: "sent" });
    expect(log.messages[0].body).toContain(`Your bill ${r.body.number} for ₹800.00 is here:`);
    const doc = await open(tokenOf(log.messages[0].body));
    expect(doc.status).toBe(200);
    expect(doc.body).toMatchObject({ kind: "pos_bill", bill: { number: r.body.number, total: "800.00", customerName: "Asha" } });
    expect(doc.body.bill.overrides).toBeUndefined();
    expect(doc.body.bill.lines[0].salesmanId).toBeUndefined();
  });

  it("leaves a bill without a mobile alone, and sends one when asked", async () => {
    const r = await post("/pos/bills", { terminalId: id.t1, lines: [{ itemId: id.shirt, qty: "1" }], payments: [{ mode: "upi", amount: "800" }] });
    expect(r.body.autoSent).toBeNull();
    expect((await post(`/pos/bills/${r.body.id}/send`, {})).body.error).toBe("invalid_phone");
    const sent = await post(`/pos/bills/${r.body.id}/send`, { phone: "9123456780" });
    expect(sent.status).toBe(201);
    expect(sent.body).toMatchObject({ to: "919123456780", status: "sent" });
    expect(sent.body.body).toContain("Dear Customer, thank you for shopping at");
  });

  it("sends a tax invoice to the customer's mobile", async () => {
    id.inv = (await post("/sales-invoices", { customerId: id.gupta, date: "2026-09-10", lines: [{ itemId: id.shirt, qty: "5", rate: "800" }] })).body.id;
    const r = await post(`/sales-invoices/${id.inv}/send`, {});
    expect(r.status).toBe(201);
    expect(r.body.body).toMatch(/^Dear Gupta Stores, invoice INV\/\S+ dated 2026-09-10 for ₹4,200\.00 from /);
    const doc = await open(tokenOf(r.body.body));
    expect(doc.body).toMatchObject({ kind: "invoice", invoice: { id: id.inv, customerName: "Gupta Stores", total: "4200.00" } });
    expect(doc.body.invoice.lines).toHaveLength(1);
    expect((await get(`/crm/customers/${id.gupta}`)).messages[0]).toMatchObject({ status: "sent" });
  });
});

describe("payment reminders", () => {
  it("reminds every customer with overdue bills, with a statement link, and lists who has no mobile", async () => {
    await post("/sales-invoices", { customerId: id.mehta, date: "2026-09-12", lines: [{ itemId: id.shirt, qty: "2", rate: "800" }] });
    const r = await post("/reminders/payments", { overdueOnly: true, date: "2026-10-20" });
    expect(r.status).toBe(201);
    expect(r.body.sent).toEqual([expect.objectContaining({ partyId: id.gupta, status: "sent" })]);
    expect(r.body.skipped).toEqual([{ partyId: id.mehta, name: "Mehta Garments", reason: "no_phone" }]);
    const msg = (await get(`/messages?accountId=${id.gupta}`)).messages[0];
    expect(msg.template).toBe("payment_reminder_link");
    expect(msg.body).toContain("₹4,200.00 is outstanding on your account with");
    expect(msg.body).toContain("of which ₹4,200.00 is overdue");
    const doc = await open(tokenOf(msg.body));
    expect(doc.body).toMatchObject({ kind: "statement", statement: { customer: { name: "Gupta Stores" }, balance: "4200.00" } });
    expect(doc.body.statement.openItems).toEqual([expect.objectContaining({ amount: "4200.00", date: "2026-09-10" })]);
  });

  it("skips a customer asked for who owes nothing", async () => {
    await post("/vouchers", { type: "receipt", date: "2026-10-21", lines: [{ accountId: (await get("/accounts")).find((a: { key: string | null }) => a.key === "cash").id, debit: "4200" }, { accountId: id.gupta, credit: "4200" }] });
    const r = await post("/reminders/payments", { accountIds: [id.gupta], date: "2026-10-22" });
    expect(r.body).toEqual({ sent: [], skipped: [{ partyId: id.gupta, name: "", reason: "nothing_outstanding" }] });
  });
});

describe("shared links", () => {
  it("answers an unknown link as expired, and keeps the log private", async () => {
    expect((await open("A".repeat(32))).body.error).toBe("link_expired");
    expect((await open("short")).status).toBe(400);
    expect((await t.call("", "GET", "/messages")).status).toBe(401);
  });
});
