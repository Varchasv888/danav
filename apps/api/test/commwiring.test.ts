import { createHmac } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();
const plus = (n: number) => new Date(Date.parse(`${today}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const outbox = async (event?: string) => ((await get("/comms/outbox?limit=500")) as { event: string; channel: string; to: string; status: string; providerId: string | null; body: string }[]).filter((m) => !event || m.event === event);

beforeAll(async () => {
  process.env.WHATSAPP_APP_SECRET = "test-app-secret";
  process.env.WHATSAPP_VERIFY_TOKEN = "verify-me";
  process.env.SMS_WEBHOOK_SECRET = "sms-secret";
  t = await testApp();
  c = (await t.signup("commwire", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.cust = (await post("/accounts", { name: "Asha Stores", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27", phone: "9876543210" })).body.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.shirt = (await post("/items", { name: "Wire Shirt", uomId: setup.uoms[0].id, gstRate: "5", saleRate: "1000", purchaseRate: "400", mrp: "1000" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "50", rate: "400" }] });
  id.cash = ((await get("/accounts")) as { id: string; key: string | null }[]).find((a) => a.key === "cash")!.id;
});
afterAll(() => { delete process.env.WHATSAPP_APP_SECRET; delete process.env.WHATSAPP_VERIFY_TOKEN; delete process.env.SMS_WEBHOOK_SECRET; return t.close(); });

describe("flows that message by themselves", () => {
  it("send nothing until switched on, then queue a message when the document is made", async () => {
    const inv = await post("/sales-invoices", { customerId: id.cust, date: plus(-40), lines: [{ itemId: id.shirt, qty: "1", rate: "1000" }] });
    expect(inv.status).toBe(201);
    expect(await outbox("bill_sent")).toHaveLength(0);
    expect((await t.call(c, "PUT", "/comms/settings", { autoEvents: ["invoice_issued", "payment_received", "order_dispatched", "payment_reminders"] })).status).toBe(200);
    expect((await t.call(c, "PUT", "/comms/settings", { autoEvents: ["nope"] })).status).toBe(400);

    const second = await post("/sales-invoices", { customerId: id.cust, date: today, lines: [{ itemId: id.shirt, qty: "1", rate: "1000" }] });
    expect(second.status).toBe(201);
    const sent = await outbox("bill_sent");
    expect(sent.map((m) => m.channel).sort()).toEqual(["sms", "whatsapp"]);
    expect(sent.find((m) => m.channel === "whatsapp")!.body).toContain("Asha Stores");

    const note = await post("/delivery-notes", { customerId: id.cust, date: today, vehicleNo: "MH12AB1234", lines: [{ itemId: id.shirt, qty: "1" }] });
    expect(note.status).toBe(201);
    expect((await outbox("delivery")).some((m) => m.body.includes("MH12AB1234"))).toBe(true);

    expect((await post("/bill-receipts", { kind: "receivable", partyId: id.cust, accountId: id.cash, date: today, amount: "500", allocations: [] })).status).toBe(201);
    expect((await outbox("payment_received"))[0]!.body).toContain("500.00");
  });

  it("remind about overdue bills once a week, and about goods on approval past their date", async () => {
    const r = await post("/comms/reminders", {});
    expect(r.body).toMatchObject({ paymentReminders: 1, approvalReminders: 0 });
    const first = (await outbox("payment_reminder")).length;
    expect(first).toBe(2);
    await post("/comms/reminders", {});
    expect((await outbox("payment_reminder")).length).toBe(first); // the same week: nothing again

    await t.call(c, "PUT", "/comms/settings", { autoEvents: ["payment_reminders", "approval_due"] });
    const memo = await post("/approval-memos", { warehouseId: id.main, date: plus(-5), customerName: "Meena", customerPhone: "9822211100", dueBack: plus(-1), lines: [{ itemId: id.shirt, qty: "1" }] });
    expect(memo.status).toBe(201);
    expect((await post("/comms/reminders", {})).body.approvalReminders).toBe(1);
    expect((await outbox("approval_due")).map((m) => m.to).sort()).toEqual(["919822211100", "919822211100"]);
  });
});

const sign = (secret: string, raw: string) => `sha256=${createHmac("sha256", secret).update(raw).digest("hex")}`;
const wa = (body: unknown, secret = "test-app-secret") => { const raw = JSON.stringify(body); return t.app.inject({ method: "POST", url: "/webhooks/whatsapp", headers: { "content-type": "application/json", "x-hub-signature-256": sign(secret, raw) }, payload: raw }); };

describe("provider callbacks", () => {
  it("answers the registration handshake only with the right token", async () => {
    const ok = await t.app.inject({ method: "GET", url: "/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=verify-me&hub.challenge=1234" });
    expect(ok.statusCode).toBe(200);
    expect(ok.body).toBe("1234");
    expect((await t.app.inject({ method: "GET", url: "/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=1234" })).statusCode).toBe(403);
  });

  it("refuses an unsigned or wrongly signed call, and changes nothing", async () => {
    const raw = JSON.stringify({ entry: [] });
    expect((await t.app.inject({ method: "POST", url: "/webhooks/whatsapp", headers: { "content-type": "application/json" }, payload: raw })).statusCode).toBe(401);
    expect((await wa({ entry: [] }, "other-secret")).statusCode).toBe(401);
  });

  it("marks a sent message delivered or failed by its provider id, and ignores ids it does not know", async () => {
    await post("/comms/process", {});
    const sent = (await outbox("bill_sent")).filter((m) => m.status === "sent");
    expect(sent.length).toBeGreaterThan(0);
    const wid = sent.find((m) => m.channel === "whatsapp")!.providerId!;
    const sid = sent.find((m) => m.channel === "sms")!.providerId!;
    const r = await wa({ entry: [{ changes: [{ value: { statuses: [{ id: wid, status: "delivered" }, { id: "wamid.unknown", status: "delivered" }, { id: sid, status: "failed", errors: [{ title: "Number not reachable" }] }] } }] }] });
    expect(r.json()).toMatchObject({ delivered: 1, ignored: 1 });
    const after = await outbox("bill_sent");
    expect(after.find((m) => m.providerId === wid)!.status).toBe("delivered");
  });

  it("takes a STOP reply as an opt-out, and a gateway's receipt in the plain shape", async () => {
    const r = await wa({ entry: [{ changes: [{ value: { messages: [{ from: "919876543210", type: "text", text: { body: "STOP" } }, { from: "919876543210", type: "text", text: { body: "hello" } }] } }] }] });
    // The reply names no business, so the number is opted out wherever it has been messaged.
    expect(r.json().optedOut).toBeGreaterThanOrEqual(1);
    const consents = (await get("/comms/consents")) as { contact: string; optedOut: boolean }[];
    expect(consents.some((x) => x.contact === "919876543210" && x.optedOut)).toBe(true);

    const raw = JSON.stringify({ id: "sms-not-ours", status: "delivered" });
    const sms = await t.app.inject({ method: "POST", url: "/webhooks/sms", headers: { "content-type": "application/json", "x-signature": createHmac("sha256", "sms-secret").update(raw).digest("hex") }, payload: raw });
    expect(sms.statusCode).toBe(200);
    expect(sms.json()).toMatchObject({ ignored: 1 });
    expect((await t.app.inject({ method: "POST", url: "/webhooks/sms", headers: { "content-type": "application/json", "x-signature": "bad" }, payload: raw })).statusCode).toBe(401);
  });

  it("refuses everything while no secret is set", async () => {
    delete process.env.SMS_WEBHOOK_SECRET;
    const raw = "{}";
    expect((await t.app.inject({ method: "POST", url: "/webhooks/sms", headers: { "content-type": "application/json", "x-signature": "x" }, payload: raw })).statusCode).toBe(503);
  });
});
