import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { withTenant } from "@varchasv/db";
import { ask, type ClaudeCall } from "../src/services/assistant.js";
import { runDueReports } from "../src/services/reportbuilder.js";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
let tenantId: string;
let userId: string;
const id: Record<string, string> = {};
const PNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const put = (url: string, body: unknown) => t.call(c, "PUT", url, body);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("insight", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const me = await get("/auth/me");
  tenantId = me.tenantId;
  userId = me.user.id;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  const group = (k: string) => groups.find((g) => g.key === k)!.id;
  id.sharma = (await post("/accounts", { name: "Sharma Traders", groupId: group("sundry_debtors"), stateCode: "27", phone: "9876543210" })).body.id;
  id.gupta = (await post("/accounts", { name: "Gupta Stores", groupId: group("sundry_debtors"), stateCode: "27", phone: "9812345678" })).body.id;
  id.anand = (await post("/accounts", { name: "Anand Dairy", groupId: group("sundry_creditors"), stateCode: "27" })).body.id;
  for (const a of await get("/accounts") as { id: string; key: string | null }[]) if (a.key) id[a.key] = a.id;
  const setup = await get("/inventory/setup");
  id.rice = (await post("/items", { name: "Basmati rice", uomId: setup.uoms.find((u: { code: string }) => u.code === "KGS").id, gstRate: "5", hsn: "1006", purchaseRate: "80", saleRate: "100" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.rice, warehouseId: setup.warehouses[0].id, qty: "50", rate: "80" }] });
  await post("/sales-invoices", { customerId: id.sharma, date: "2026-10-10", lines: [{ itemId: id.rice, qty: "10", rate: "100" }] });
  await post("/sales-invoices", { customerId: id.sharma, date: "2026-10-15", lines: [{ itemId: id.rice, qty: "5", rate: "70" }] }); // below cost
  await post("/sales-invoices", { customerId: id.gupta, date: "2026-10-12", lines: [{ itemId: id.rice, qty: "2", rate: "100" }] });
  for (const [no, date] of [["A-101", "2026-10-05"], ["A-102", "2026-10-08"]] as const) {
    await post("/purchase-bills", { supplierId: id.anand, date, supplierInvoiceNo: no, supplierInvoiceDate: date, lines: [{ itemId: id.rice, qty: "5", rate: "80" }] });
  }
  await post("/vouchers", { type: "receipt", date: "2026-10-07", lines: [{ accountId: id.cash, debit: "250000" }, { accountId: id.sharma, credit: "250000" }] });
  await post("/vouchers", { type: "payment", date: "2026-10-09", lines: [{ accountId: id.anand, debit: "12000" }, { accountId: id.cash, credit: "12000" }] });
});
afterAll(() => t.close());

describe("dashboard and checks", () => {
  it("shows the day's numbers and what needs doing", async () => {
    const d = await get("/analytics/dashboard?date=2026-10-15");
    expect(d.sales).toMatchObject({ today: "350.00", mtd: "1550.00", topCustomers: [{ name: "Sharma Traders", amount: "1350.00" }, { name: "Gupta Stores", amount: "200.00" }] });
    expect(d.sales.daily).toHaveLength(30);
    expect(d.money.cashBank.find((x: { id: string }) => x.id === id.cash)).toMatchObject({ balance: "238000.00", kind: "cash_in_hand" });    expect(d.stock.value).toBe("3440.00"); // 50 + 10 bought − 17 sold = 43 kg at 80
    // GSTR-1 for September was due on the 11th; GSTR-3B is due on the 20th.
    expect(d.alerts).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: "gstOverdue", params: expect.objectContaining({ form: "GSTR1", days: 4 }) }),
      expect.objectContaining({ key: "gstDue", params: expect.objectContaining({ form: "GSTR3B", days: 5 }) }),
    ]));
  });

  it("flags cash over the income-tax limits, a possible duplicate bill and a sale below cost", async () => {
    const r = await get("/analytics/checks?from=2026-04-01&to=2026-10-31");
    expect(r.rows.map((x: { key: string; params: Record<string, string> }) => `${x.key}:${Object.values(x.params).join("|")}`)).toEqual([
      "cash269ST:Sharma Traders|250000.00",
      "duplicateBill:Anand Dairy|420.00|A-101|A-102",
      "cash40A3:Anand Dairy|12000.00",
      "belowCost:INV/26-27/00002|Basmati rice|70.00|80.00",
    ]);
  });
});

describe("report builder", () => {
  const config = { dataset: "sales", groupBy: ["customer"], measures: ["taxable", "total", "documents"], period: { preset: "custom", from: "2026-10-01", to: "2026-10-31" } };

  it("groups and totals, and exports CSV", async () => {
    const r = await post("/reports/builder/run", config);
    expect(r.body).toMatchObject({ columns: ["customer", "taxable", "total", "documents"], rows: [["Gupta Stores", "200.00", "210.00", "2"].slice(0, 3).concat("1"), ["Sharma Traders", "1350.00", "1417.50", "2"]], totals: ["1550.00", "1627.50", null] });
    expect((await post("/reports/builder/run", { ...config, measures: ["salary"] })).body.error).toBe("unknown_measure");
    expect((await post("/reports/builder/run", { ...config, filters: { customer: id.gupta } })).body.rows).toEqual([["Gupta Stores", "200.00", "210.00", "1"]]);
    const csv = await t.app.inject({ method: "POST", url: "/reports/builder/csv", headers: { cookie: c }, payload: { ...config, name: "October sales" } });
    expect(csv.headers["content-type"]).toContain("text/csv");
    expect(csv.body).toContain("Sharma Traders,1350.00,1417.50,2");
  });

  it("emails a scheduled report as CSV when it falls due, then moves to the next run", async () => {
    const name = `Daily sales ${t.run}`;
    const saved = await post("/reports/saved", { name, config, schedule: { frequency: "daily", hour: 9, recipients: ["owner@example.test"] } });
    expect(saved.status).toBe(201);
    expect((await post("/reports/saved", { name: "Bad", config, schedule: { frequency: "monthly", hour: 9, day: 31, recipients: ["a@b.in"] } })).body.error).toBe("invalid_day");
    const due = new Date(new Date(saved.body.nextRunAt).getTime() + 60_000);
    await runDueReports(t.appDb.db, t.mailer, due);
    const mail = t.mailer.sent.find((m) => m.subject.startsWith(name));
    expect(mail).toMatchObject({ to: "owner@example.test", attachments: [expect.objectContaining({ contentType: "text/csv" })] });
    const after = (await get("/reports/saved")).find((r: { id: string }) => r.id === saved.body.id);
    expect(new Date(after.nextRunAt).getTime() - new Date(saved.body.nextRunAt).getTime()).toBe(86_400_000);
    expect(after.lastError).toBeNull();
  }, 30_000);
});

describe("assistant", () => {
  it("answers common questions without an AI key", async () => {
    const r = await post("/assistant/ask", { messages: [{ role: "user", content: "What can you do?" }] });
    expect(r.body).toMatchObject({ mode: "demo", tools: [] });
    const perms = new Set(["reports.view", "sales.view", "inventory.view"]);
    const q = (content: string) => withTenant(t.appDb.db, tenantId, (tx) => ask(tx, { tenantId, userId }, perms, [{ role: "user", content }], { today: "2026-10-15", locale: "en", call: null }));
    expect((await q("Who owes us the most?")).answer).toBe("Total: ₹210.00\n• Gupta Stores: ₹210.00");
    expect((await q("इस महीने की बिक्री?")).answer).toContain("₹1,550.00 before tax");
    expect((await q("any unusual entries to check?")).answer).toContain("4 entries to look at");
  });

  it("lets Claude call read-only tools, only those the user may use", async () => {
    const seen: unknown[] = [];
    const fake = (calls: object[]): ClaudeCall => async (body) => { seen.push(body); return calls.shift() as never; };
    const reply = await withTenant(t.appDb.db, tenantId, (tx) => ask(tx, { tenantId, userId }, new Set(["reports.view", "sales.view"]), [{ role: "user", content: "Who owes us money?" }], {
      today: "2026-10-15", locale: "en",
      call: fake([
        { stop_reason: "tool_use", content: [{ type: "tool_use", id: "t1", name: "outstanding", input: { kind: "receivable" } }, { type: "tool_use", id: "t2", name: "find_party", input: { query: "Sharma" } }] },
        { stop_reason: "end_turn", content: [{ type: "text", text: "Gupta Stores owes ₹210.00." }] },
      ]),
    }));
    expect(reply).toEqual({ mode: "claude", answer: "Gupta Stores owes ₹210.00.", tools: ["outstanding", "find_party"] });
    const second = seen[1] as { messages: { content: { type: string; content?: string }[] }[]; tools: { name: string }[] };
    const results = second.messages[2]!.content;
    expect(results[0]!.content).toContain("Gupta Stores");
    expect(results[1]!.content).toBe(JSON.stringify({ error: "not allowed" })); // find_party needs accounts.view
    expect(second.tools.map((x) => x.name)).not.toContain("find_party");
  });
});

describe("CRM", () => {
  it("runs a lead through the pipeline, messages it, and converts it to a customer", async () => {
    expect((await post("/crm/leads", { name: "Ritu Jain", phone: "12345" })).body.error).toBe("invalid_phone");
    const lead = (await post("/crm/leads", { name: "Ritu Jain", organisation: "Jain Caterers", phone: "+91 99887 76655", source: "indiamart", stage: "qualified", value: "50000", city: "Pune" })).body;
    expect(lead).toMatchObject({ code: "LD-0001", stage: "qualified" });
    await post("/crm/leads", { name: "Amit Shah", value: "20000" });
    expect((await get("/crm/pipeline")).filter((s: { count: number }) => s.count)).toEqual([
      { stage: "new", count: 1, value: "20000.00", weighted: "2000.00" }, { stage: "qualified", count: 1, value: "50000.00", weighted: "20000.00" },
    ]);
    await post("/crm/activities", { leadId: lead.id, kind: "call", subject: "Call back about menu pricing", dueAt: new Date(Date.now() - 86_400_000).toISOString() });
    const d = await get("/analytics/dashboard?date=2026-10-15");
    expect(d.crm).toMatchObject({ openLeads: 2, pipeline: "70000.00", weighted: "22000.00" });
    expect(d.alerts).toEqual(expect.arrayContaining([expect.objectContaining({ key: "followUpsLate", params: { count: 1 } })]));

    const templates: { id: string; name: string; params: number[] }[] = await get("/crm/templates");
    const followUp = templates.find((x) => x.name === "follow_up")!;
    expect(followUp.params).toEqual([1, 2]);
    expect((await post("/crm/messages", { templateId: followUp.id, leadId: lead.id, params: ["Ritu"] })).body.error).toBe("missing_param");
    const msg = await post("/crm/messages", { templateId: followUp.id, leadId: lead.id, params: ["Ritu", "our catering supplies"] });
    expect(msg.body).toMatchObject({ to: "919988776655", status: "sent", provider: "demo", body: "Hello Ritu, thank you for your interest in our catering supplies. May we call you to discuss your requirement?" });
    const detail = await get(`/crm/leads/${lead.id}`);
    expect(detail.activities.map((a: { kind: string }) => a.kind)).toEqual(["whatsapp", "call"]);

    expect((await post(`/crm/leads/${lead.id}/stage`, { stage: "won" })).body.error).toBe("convert_to_win");
    const conv = await post(`/crm/leads/${lead.id}/convert`, {});
    const customer = (await get("/accounts")).find((a: { id: string }) => a.id === conv.body.customerId);
    expect(customer).toMatchObject({ name: "Jain Caterers", phone: "+91 99887 76655" });
    expect((await post(`/crm/leads/${lead.id}/convert`, {})).body.error).toBe("already_converted");
    expect((await get(`/crm/leads/${lead.id}`)).stage).toBe("won");
    const other = (await get("/crm/leads?stage=new"))[0];
    expect((await post(`/crm/leads/${other.id}/stage`, { stage: "lost" })).body.error).toBe("lost_reason_required");
    await post(`/crm/leads/${other.id}/stage`, { stage: "lost", lostReason: "Went with a local supplier" });
  });

  it("shows a customer's whole picture and sends a payment reminder with the amount", async () => {
    const view = await get(`/crm/customers/${id.gupta}?date=2026-10-15`);
    expect(view).toMatchObject({ balance: "210.00", salesThisYear: "200.00", invoices: [expect.objectContaining({ total: "210.00" })] });
    const r = await post(`/crm/customers/${id.gupta}/remind?date=2026-10-15`, {});
    expect(r.body).toMatchObject({ to: "919812345678", status: "sent" });
    expect(r.body.body).toContain("₹210.00 is outstanding on your account with");
    expect((await post(`/crm/customers/${id.sharma}/remind?date=2026-10-15`, {})).body.error).toBe("nothing_outstanding"); // paid in advance
    expect((await get(`/crm/customers/${id.gupta}?date=2026-10-15`)).activities[0]).toMatchObject({ kind: "whatsapp", subject: "payment reminder" });
  });
});

describe("reading a supplier's bill", () => {
  it("suggests nothing without an AI key, and never posts", async () => {
    const f = await post("/files", { name: "bill.png", contentType: "image/png", base64: PNG });
    expect(f.status).toBe(201);
    expect((await post("/purchase-bills/read", { fileId: f.body.id })).body).toEqual({ reader: "demo", fields: null, supplierId: null, lines: [] });
  });
});

describe("report layouts and sending now", () => {
  const config = { dataset: "sales", groupBy: ["customer"], measures: ["taxable", "total", "documents"], period: { preset: "custom", from: "2026-10-01", to: "2026-10-31" } };

  it("a saved layout picks and orders the columns, and the totals follow them", async () => {
    const full = (await post("/reports/builder/run", config)).body;
    const r = await post("/reports/builder/run", { ...config, layout: { columns: ["total", "customer"] } });
    expect(r.status).toBe(200);
    expect(r.body.columns).toEqual(["total", "customer"]);
    expect(r.body.rows[0]).toEqual([full.rows[0][2], full.rows[0][0]]);
    expect(r.body.totals).toEqual([full.totals[1], null]);
    expect((await post("/reports/builder/run", { ...config, layout: { columns: ["total", "total"] } })).body.error).toBe("invalid_layout");
    expect((await post("/reports/builder/run", { ...config, layout: { columns: ["salary"] } })).body.error).toBe("invalid_layout");
  });

  it("emails a report as a CSV straight away to up to five people, in the chosen layout", async () => {
    const before = t.mailer.sent.length;
    const r = await post("/reports/builder/email", { name: "October by customer", config: { ...config, layout: { columns: ["customer", "total"] } }, to: ["boss@example.test", "accounts@example.test"] });
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ sent: 2 });
    const mails = t.mailer.sent.slice(before);
    expect(mails.map((m) => m.to)).toEqual(["boss@example.test", "accounts@example.test"]);
    expect(mails[0]!.attachments![0]!.content).toContain("customer,total");
    expect((await post("/reports/builder/email", { name: "x", config, to: [] })).status).toBe(400);
  });
});
