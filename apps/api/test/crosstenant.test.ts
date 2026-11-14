import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { withTenant } from "@varchasv/db";
import { runDueReports } from "../src/services/reportbuilder.js";
import { runDueComms, type Senders } from "../src/services/comms.js";
import { DemoSender } from "../src/integrations/channels.js";
import { DemoMessenger } from "../src/integrations/messaging.js";
import { LogMailer } from "../src/lib/mailer.js";
import { testApp } from "./helpers.js";

/** What one business creates must be invisible and untouchable to another: files, exports, saved and scheduled reports, messages, scenarios, jobs. */
let t: Awaited<ReturnType<typeof testApp>>;
let a: string;
let b: string;
let aTenant = "";
let bTenant = "";
const PNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const id: Record<string, string> = {};

const call = (cookie: string, method: string, url: string, body?: unknown) => t.call(cookie, method, url, body);

beforeAll(async () => {
  t = await testApp();
  const sa = await t.signup("xtenant-a");
  const sb = await t.signup("xtenant-b");
  a = sa.cookie; b = sb.cookie; aTenant = sa.body.tenantId; bTenant = sb.body.tenantId;
  id.file = (await call(a, "POST", "/files", { name: "secret.png", contentType: "image/png", base64: PNG })).body.id;
  id.scenario = (await call(a, "POST", "/scenarios", { name: "A only", adjustments: [{ kind: "demand", salesChangePct: [-5, 5, 10] }] })).body.id;
  await call(a, "POST", "/comms/queue", { event: "token", channel: "sms", to: "9876543210", params: { token: "7" } });
  id.report = (await call(a, "POST", "/reports/saved", {
    name: "A report", config: { dataset: "sales", groupBy: ["customer"], measures: ["taxable", "total", "documents"], period: { preset: "custom", from: "2026-10-01", to: "2026-10-31" } }, schedule: { frequency: "daily", hour: 9, recipients: ["a-owner@example.test"] },
  })).body.id;
});
afterAll(() => t.close());

describe("files", () => {
  it("another business cannot read a file by its id", async () => {
    expect((await call(a, "GET", `/files/${id.file}`)).status).toBe(200);
    expect((await call(b, "GET", `/files/${id.file}`)).status).toBe(404);
  });
});

describe("exports", () => {
  it("a business export holds only its own rows", async () => {
    const res = await t.app.inject({ method: "GET", url: "/export/business.zip", headers: { cookie: b } });
    expect(res.statusCode).toBe(200);
    const text = res.rawPayload.toString("latin1");
    expect(text).not.toContain("secret.png");
    expect(text).not.toContain("A only");
  });
});

describe("scenarios, messages and reports", () => {
  it("another business sees none of them and cannot delete them", async () => {
    expect((await call(b, "GET", "/scenarios")).body).toEqual([]);
    expect((await call(b, "DELETE", `/scenarios/${id.scenario}`)).status).toBe(404);
    expect((await call(a, "GET", "/scenarios")).body).toHaveLength(1);
    expect((await call(b, "GET", "/comms/outbox")).body).toEqual([]);
    expect((await call(a, "GET", "/comms/outbox")).body).toHaveLength(1);
    expect((await call(b, "GET", "/reports/saved")).body).toEqual([]);
    // Deleting another business's report may answer ok (nothing visible to delete) or not found, but it must never remove it.
    await call(b, "DELETE", `/reports/saved/${id.report}`);
    expect(((await call(a, "GET", "/reports/saved")).body as { id: string }[]).some((r) => r.id === id.report)).toBe(true);
  });
});

describe("background jobs", () => {
  it("the message sender works one business at a time and leaves the other's queue alone", async () => {
    await call(b, "POST", "/comms/queue", { event: "token", channel: "sms", to: "9123456780", params: { token: "9" } });
    const sms = new DemoSender("s");
    const senders: Senders = { whatsapp: new DemoMessenger(), sms, push: new DemoSender("p"), email: new LogMailer(() => {}) };
    // The shared local test database can contain more due businesses than the scheduler's per-run cap.
    // Keep running the bounded scheduler until these two new businesses are reached.
    for (let pass = 0; pass < 20; pass++) {
      const sentTo = new Set(sms.sent.map((m) => m.to));
      if (sentTo.has("919876543210") && sentTo.has("919123456780")) break;
      await runDueComms(t.appDb.db, senders);
    }
    expect(sms.sent.map((m) => m.to)).toEqual(expect.arrayContaining(["919876543210", "919123456780"]));
    const aSent = await withTenant(t.appDb.db, aTenant, (tx) => tx.execute<{ to: string }>(`select "to" from comm_outbox` as never));
    expect(JSON.stringify(aSent)).not.toContain("9123456780");
    const bSent = await withTenant(t.appDb.db, bTenant, (tx) => tx.execute<{ to: string }>(`select "to" from comm_outbox` as never));
    expect(JSON.stringify(bSent)).not.toContain("9876543210");
  });

  it("the report scheduler emails each business only its own report", async () => {
    const saved = (await call(a, "GET", "/reports/saved")).body.find((r: { id: string }) => r.id === id.report);
    const due = new Date(new Date(saved.nextRunAt).getTime() + 60_000);
    // The shared test database holds many other due reports, and one pass handles a limited number, so pass until ours has gone.
    for (let i = 0; i < 20 && !t.mailer.sent.some((m) => m.to === "a-owner@example.test"); i++) await runDueReports(t.appDb.db, t.mailer, due);
    const mine = t.mailer.sent.filter((m) => m.to === "a-owner@example.test");
    expect(mine.length).toBeGreaterThanOrEqual(1);
    expect(t.mailer.sent.filter((m) => m.to !== "a-owner@example.test" && m.subject.startsWith("A report"))).toHaveLength(0);
  });
});
