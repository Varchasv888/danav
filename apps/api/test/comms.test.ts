import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { withTenant } from "@varchasv/db";
import { DemoSender } from "../src/integrations/channels.js";
import { processOutbox, runDueComms, type Senders } from "../src/services/comms.js";
import { LogMailer } from "../src/lib/mailer.js";
import { DemoMessenger } from "../src/integrations/messaging.js";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
let tenantId = "";
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const put = (url: string, body: unknown) => t.call(c, "PUT", url, body);
const outbox = async (q = "") => (await get(`/comms/outbox${q}`)) as { id: string; channel: string; status: string; body: string; error: string | null; cost: string; language: string; attempts: number; providerId: string | null; to: string }[];

beforeAll(async () => {
  t = await testApp();
  const s = await t.signup("comms", { gstin: "27AAPFU0939F1ZV" });
  c = s.cookie;
  tenantId = s.body.tenantId;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.asha = (await post("/accounts", { name: "Asha Stores", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27", phone: "9876543210", email: "asha@example.com" })).body.id;
  id.ravi = (await post("/accounts", { name: "Ravi Traders", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27", phone: "9123456780" })).body.id;
  await put("/comms/settings", { costSms: "0.25", costWhatsappUtility: "0.40", costWhatsappMarketing: "0.90", ownerPhone: "9000000001", ownerEmail: "owner@example.com" });
});
afterAll(() => t.close());

describe("templates and language", () => {
  it("starts with English wording for the events, and takes another language for the same event", async () => {
    const list = await get("/comms/templates");
    expect(list.filter((x: { event: string }) => x.event === "payment_reminder").length).toBeGreaterThanOrEqual(3);
    expect((await put("/comms/templates", { event: "payment_reminder", channel: "whatsapp", language: "hi", body: "{name}, {shop} ke Rs {amount} baaki hain." })).status).toBe(200);
    const hi = await post("/comms/queue", { event: "payment_reminder", channel: "whatsapp", to: "9876543210", language: "hi", params: { name: "Asha", amount: "5,000" } });
    expect(hi.body.language).toBe("hi");
    expect(hi.body.body).toContain("baaki");
    const fallback = await post("/comms/queue", { event: "payment_reminder", channel: "sms", to: "9876543210", language: "hi", params: { name: "Asha", amount: "5,000" } });
    expect(fallback.body.language).toBe("en");
  });

  it("will not send with a hole in the wording", async () => {
    expect((await post("/comms/queue", { event: "payment_reminder", channel: "sms", to: "9876543210", params: { name: "Asha" } })).body.error).toBe("missing_param");
  });
});

describe("events, dedupe and the log", () => {
  it("raises an event on every channel that has wording and the customer has a contact for", async () => {
    const r = await post("/comms/send", { event: "payment_reminder", accountId: id.asha, params: { name: "Asha", amount: "9,000" }, dedupeKey: "rem:asha:1" });
    expect(r.status).toBe(201);
    expect((r.body as { channel: string }[]).map((m) => m.channel).sort()).toEqual(["email", "sms", "whatsapp"]);
    const noEmail = await post("/comms/send", { event: "payment_reminder", accountId: id.ravi, params: { name: "Ravi", amount: "100" } });
    expect((noEmail.body as { channel: string }[]).map((m) => m.channel).sort()).toEqual(["sms", "whatsapp"]);
  });

  it("never queues the same dedupe key twice", async () => {
    const before = (await outbox("?channel=sms")).length;
    const again = await post("/comms/send", { event: "payment_reminder", accountId: id.asha, params: { name: "Asha", amount: "9,000" }, dedupeKey: "rem:asha:1" });
    expect((again.body as { duplicate: boolean }[]).every((m) => m.duplicate)).toBe(true);
    expect((await outbox("?channel=sms")).length).toBe(before);
  });

  it("sends owner events to the owner's contacts from the settings", async () => {
    const r = await post("/comms/send", { event: "daily_sales_owner", params: { date: "2026-11-03", sales: "52,000", bills: "41" } });
    expect((r.body as { to: string }[]).map((m) => m.to).sort()).toEqual(["919000000001", "owner@example.com"]);
  });
});

describe("sending, cost and delivery", () => {
  it("sends what is queued, records the provider id and the cost, and then takes delivery receipts", async () => {
    const done = await post("/comms/process", {});
    expect(done.body.sent).toBeGreaterThan(0);
    const sent = (await outbox("?status=sent")) as { channel: string; cost: string; providerId: string }[];
    expect(sent.find((m) => m.channel === "sms")!.cost).toBe("0.25");
    expect(sent.find((m) => m.channel === "whatsapp")!.cost).toBe("0.40");
    const providerId = sent.find((m) => m.channel === "sms")!.providerId;
    expect((await post("/comms/receipts", { providerId, status: "delivered" })).status).toBe(200);
    const report = await get(`/comms/report`);
    const sms = report.channels.find((x: { channel: string }) => x.channel === "sms");
    expect(sms.delivered).toBe(1);
    expect(Number(report.totalCost)).toBeGreaterThan(0);
    expect((await post("/comms/receipts", { providerId: "nope-nope", status: "delivered" })).status).toBe(404);
  });

  it("retries a failed send later, a limited number of times, and never sends twice", async () => {
    const q = await post("/comms/queue", { event: "token", channel: "sms", to: "9876543210", params: { token: "42" }, dedupeKey: "token:42" });
    const flaky = new DemoSender("flaky");
    let calls = 0;
    flaky.send = async (m) => { calls++; if (calls < 3) throw new Error("gateway down"); return DemoSender.prototype.send.call(flaky, m); };
    const senders: Senders = { whatsapp: new DemoMessenger(), sms: flaky, push: new DemoSender("p"), email: new LogMailer(() => {}) };
    const now = new Date();
    const run = (at: Date) => withTenant(t.appDb.db, tenantId, (tx) => processOutbox(tx, senders, at));
    expect(await run(now)).toMatchObject({ sent: 0, retried: 1 });
    expect(await run(now)).toMatchObject({ retried: 0 }); // not yet due: waits 5 minutes
    expect(await run(new Date(now.getTime() + 6 * 60_000))).toMatchObject({ retried: 1 });
    expect(await run(new Date(now.getTime() + 60 * 60_000))).toMatchObject({ sent: 1 });
    expect(await run(new Date(now.getTime() + 24 * 3600_000))).toMatchObject({ sent: 0 });
    expect(calls).toBe(3);
    const row = (await outbox("?channel=sms")).find((m) => m.id === q.body.id)!;
    expect(row).toMatchObject({ status: "sent", attempts: 3 });
  });

  it("gives up after the allowed attempts and says why", async () => {
    await put("/comms/settings", { maxAttempts: 2 });
    const q = await post("/comms/queue", { event: "token", channel: "sms", to: "9123456780", params: { token: "43" } });
    const dead = new DemoSender("dead");
    dead.send = async () => { throw new Error("gateway down"); };
    const senders: Senders = { whatsapp: new DemoMessenger(), sms: dead, push: new DemoSender("p"), email: new LogMailer(() => {}) };
    const now = new Date();
    await withTenant(t.appDb.db, tenantId, (tx) => processOutbox(tx, senders, now));
    await withTenant(t.appDb.db, tenantId, (tx) => processOutbox(tx, senders, new Date(now.getTime() + 10 * 60_000)));
    const row = (await outbox("?status=failed")).find((m) => m.id === q.body.id)!;
    expect(row).toMatchObject({ status: "failed", attempts: 2, error: "gateway down" });
  });

  it("is picked up by the scheduler for every business with something due", async () => {
    await post("/comms/queue", { event: "token", channel: "sms", to: "9876543210", params: { token: "44" } });
    const senders: Senders = { whatsapp: new DemoMessenger(), sms: new DemoSender("s"), push: new DemoSender("p"), email: new LogMailer(() => {}) };
    expect(await runDueComms(t.appDb.db, senders)).toBeGreaterThanOrEqual(1);
  });
});

describe("consent and opt-out", () => {
  it("sends a campaign only to those who said yes to marketing, and keeps the others out", async () => {
    await put("/comms/consents", { contact: "9876543210", channel: "whatsapp", marketingOptIn: true, source: "counter" });
    const r = await post("/comms/broadcast", { channel: "whatsapp", campaign: "diwali", params: { offer: "flat 20% off" }, accountIds: [id.asha, id.ravi] });
    expect(r.body).toMatchObject({ queued: 1, skippedNoConsent: 1, noContact: 0 });
    const skipped = (await outbox("?status=skipped")).filter((m) => m.error === "no_marketing_consent");
    expect(skipped).toHaveLength(1);
    // The same campaign again does not go twice.
    expect((await post("/comms/broadcast", { channel: "whatsapp", campaign: "diwali", params: { offer: "flat 20% off" }, accountIds: [id.asha, id.ravi] })).body.queued).toBe(0);
  });

  it("stops everything once someone opts out, except security codes", async () => {
    expect((await post("/comms/opt-out", { contact: "9876543210" })).status).toBe(200);
    const util = await post("/comms/queue", { event: "bill_sent", channel: "whatsapp", to: "9876543210", params: { name: "Asha", number: "B1", amount: "100", link: "x" } });
    expect(util.body).toMatchObject({ status: "skipped", error: "opted_out" });
    const otp = await post("/comms/queue", { event: "otp_login", channel: "sms", to: "9876543210", params: { code: "123456" } });
    expect(otp.body.status).toBe("queued");
    expect((await get("/comms/consents")).some((x: { optedOut: boolean; channel: string }) => x.optedOut && x.channel === "sms")).toBe(true);
  });

  it("checks consent again when the message goes out", async () => {
    await put("/comms/consents", { contact: "9123456780", channel: "sms", optedOut: false });
    const q = await post("/comms/queue", { event: "bill_sent", channel: "sms", to: "9123456780", params: { number: "B2", amount: "50", link: "x" } });
    expect(q.body.status).toBe("queued");
    await put("/comms/consents", { contact: "9123456780", channel: "sms", optedOut: true });
    await post("/comms/process", {});
    expect((await outbox("?status=skipped")).find((m) => m.id === q.body.id)!.error).toBe("opted_out");
  });
});
