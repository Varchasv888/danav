import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { withTenant, tables } from "@varchasv/db";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let token = "";
let cookie = "";
let tenantId = "";
let deviceId = "";
let companyId = "";
let cursor = "";
const acct: Record<string, string> = {};
const groups: Record<string, string> = {};

/** Requests the way the Flutter app makes them: bearer token, no cookies. */
async function app(method: string, url: string, payload?: unknown) {
  const res = await t.app.inject({ method: method as "GET", url, headers: { authorization: `Bearer ${token}` }, payload: payload as object });
  return { status: res.statusCode, body: res.json() };
}
const uuid = () => crypto.randomUUID();
const push = (ops: unknown[]) => app("POST", "/sync/push", { deviceId, ops });

beforeAll(async () => {
  t = await testApp();
  const s = await t.signup("syncer");
  cookie = s.cookie;
  tenantId = s.body.tenantId;
  const login = await t.call("", "POST", "/auth/login", { email: s.email, password: "correct horse battery", client: "app" });
  token = login.body.token;
});
afterAll(() => t.close());

describe("device registration", () => {
  it("logs in with a bearer token and registers a device with its own number series", async () => {
    expect(token).toMatch(/^[\w-]{40,}$/);
    const d = await app("POST", "/devices", { name: "Counter PC", platform: "windows" });
    expect(d.status).toBe(201);
    expect(d.body.code).toBe("A1");
    deviceId = d.body.id;
    const second = await app("POST", "/devices", { name: "Owner phone", platform: "android" });
    expect(second.body.code).toBe("B1");
  });
});

describe("pull", () => {
  it("first pull is a full snapshot with the chart of accounts and this device's series", async () => {
    const p = await app("GET", `/sync/pull?deviceId=${deviceId}`);
    expect(p.status).toBe(200);
    expect(p.body.full).toBe(true);
    companyId = p.body.companies[0].id;
    for (const a of p.body.accounts) if (a.key) acct[a.key] = a.id;
    for (const g of p.body.accountGroups) if (g.key) groups[g.key] = g.id;
    expect(acct.cash).toBeTruthy();
    expect(p.body.numberSeries.map((s: { pattern: string }) => s.pattern).sort()).toEqual(["C{DEV}/{FY}/{SEQ:5}", "J{DEV}/{FY}/{SEQ:5}", "P{DEV}/{FY}/{SEQ:5}", "R{DEV}/{FY}/{SEQ:5}"]);
    cursor = p.body.cursor;
  });
});

describe("push", () => {
  const partyId = uuid();
  const receiptId = uuid();
  const ops = () => [
    { opId: "11111111-1111-4111-8111-111111111111", kind: "account.upsert", payload: { id: partyId, companyId, groupId: groups.sundry_debtors, name: "Offline Customer", gstin: "27AAPFU0939F1ZV" } },
    { opId: "22222222-2222-4222-8222-222222222222", kind: "voucher.create", payload: {
      id: receiptId, companyId, type: "receipt", date: "2026-09-15", number: "RA1/26-27/00001", seq: 1, narration: "Cash received at counter",
      lines: [{ accountId: acct.cash, debit: "2500" }, { accountId: partyId, credit: "2500" }],
    } },
  ];

  it("applies offline operations: an account created offline, then a voucher that uses it", async () => {
    const r = await push(ops());
    expect(r.body.results.map((x: { ok: boolean }) => x.ok)).toEqual([true, true]);
    expect(r.body.results[1].result.number).toBe("RA1/26-27/00001");
    const tb = (await t.call(cookie, "GET", "/reports/trial-balance?asOf=2026-09-30")).body;
    expect(tb.totalDebit).toBe("2500.00");
  });

  it("is safe to retry: the same ops again change nothing", async () => {
    const r = await push(ops());
    expect(r.body.results.every((x: { ok: boolean }) => x.ok)).toBe(true);
    expect(r.body.results[1].result.replayed).toBe(true);
    const tb = (await t.call(cookie, "GET", "/reports/trial-balance?asOf=2026-09-30")).body;
    expect(tb.totalDebit).toBe("2500.00");
  });

  it("reports each failure without blocking the rest", async () => {
    const r = await push([
      { opId: uuid(), kind: "voucher.create", payload: { id: uuid(), companyId, type: "receipt", date: "2026-09-16", number: "RA1/26-27/00001", seq: 1, lines: [{ accountId: acct.cash, debit: "10" }, { accountId: acct.sales, credit: "10" }] } },
      { opId: uuid(), kind: "voucher.create", payload: { id: uuid(), companyId, type: "journal", date: "2026-09-16", number: "JA1/26-27/00001", seq: 1, lines: [{ accountId: acct.rent, debit: "10" }, { accountId: acct.cash, credit: "9" }] } },
      { opId: uuid(), kind: "voucher.create", payload: { id: uuid(), companyId, type: "payment", date: "2026-09-16", number: "PA1/26-27/00001", seq: 1, lines: [{ accountId: acct.rent, debit: "500" }, { accountId: acct.cash, credit: "500" }] } },
      { opId: uuid(), kind: "nonsense" },
    ]);
    expect(r.body.results.map((x: { error?: string }) => x.error ?? "ok")).toEqual(["duplicate_number", "unbalanced", "ok", "validation"]);
  });

  it("keeps the server copy of the device series ahead of the numbers used", async () => {
    const p = await app("GET", `/sync/pull?deviceId=${deviceId}&cursor=${cursor}`);
    const receipt = p.body.numberSeries.find((s: { docType: string }) => s.docType === "receipt");
    expect(receipt.nextSeq).toBe(2);
  });

  it("cancels offline, idempotently", async () => {
    const cancel = { opId: uuid(), kind: "voucher.cancel", payload: { id: receiptId, reason: "Wrong customer" } };
    expect((await push([cancel])).body.results[0].ok).toBe(true);
    expect((await push([cancel])).body.results[0].result.replayed).toBe(true);
  });
});

describe("incremental pull", () => {
  it("returns what changed since the cursor, including entries made on the web", async () => {
    const web = await t.call(cookie, "POST", "/vouchers", { type: "journal", date: "2026-09-20", lines: [{ accountId: acct.salaries, debit: "700" }, { accountId: acct.cash, credit: "700" }] });
    // Pull as a device would, round after round, keeping the latest copy of each row. Other test files
    // share this database; an open transaction of theirs rightly holds the horizon back for a moment,
    // so a change may arrive one round later — never lost.
    const vouchers = new Map<string, { id: string; number: string; status: string }>();
    const accounts = new Map<string, { id: string; name: string }>();
    for (let round = 0; round < 20 && !vouchers.has(web.body.id); round++) {
      const p = await app("GET", `/sync/pull?deviceId=${deviceId}&cursor=${cursor}`);
      expect(p.body.full).toBe(false);
      for (const v of p.body.vouchers) vouchers.set(v.id, v);
      for (const a of p.body.accounts) accounts.set(a.id, a);
      cursor = p.body.cursor;
      if (!vouchers.has(web.body.id)) await new Promise((r) => setTimeout(r, 100));
    }
    expect(vouchers.has(web.body.id)).toBe(true);
    const cancelled = [...vouchers.values()].find((v) => v.number === "RA1/26-27/00001");
    expect(cancelled?.status).toBe("cancelled");
    expect([...accounts.values()].map((a) => a.name)).toContain("Offline Customer");
    // Nothing unrelated: the template accounts didn't change.
    expect(accounts.size).toBeLessThan(5);
  });

  it("never skips a change whose transaction was still running during a pull", async () => {
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    let inserted!: () => void;
    const didInsert = new Promise<void>((r) => (inserted = r));
    const slowId = uuid();
    // A slow save: inserted, but not committed until we say so.
    const slow = withTenant(t.appDb.db, tenantId, async (tx) => {
      await tx.insert(tables.accounts).values({ id: slowId, tenantId, companyId, groupId: groups.sundry_creditors!, name: "Slow Supplier" });
      inserted();
      await gate;
    });
    await didInsert;
    // A fast save that commits while the slow one is still open.
    await t.call(cookie, "POST", "/vouchers", { type: "journal", date: "2026-09-21", lines: [{ accountId: acct.rent, debit: "1" }, { accountId: acct.cash, credit: "1" }] });
    const during = await app("GET", `/sync/pull?deviceId=${deviceId}&cursor=${cursor}`);
    expect(during.body.accounts.map((a: { id: string }) => a.id)).not.toContain(slowId);
    release();
    await slow;
    // It must arrive on a later pull. (Other test files share the database and may briefly hold an
    // older transaction open, which rightly keeps the horizon back, so allow a few sync rounds.)
    let cur = during.body.cursor as string;
    let seen = false;
    for (let round = 0; round < 20 && !seen; round++) {
      const after = await app("GET", `/sync/pull?deviceId=${deviceId}&cursor=${cur}`);
      seen = after.body.accounts.some((a: { id: string }) => a.id === slowId);
      cur = after.body.cursor;
      if (!seen) await new Promise((r) => setTimeout(r, 100));
    }
    expect(seen).toBe(true);
  });
});

describe("revoked devices", () => {
  it("can no longer push or pull", async () => {
    await t.call(cookie, "POST", "/auth/step-up", { password: "correct horse battery" });
    await t.call(cookie, "POST", `/devices/${deviceId}/revoke`, {});
    expect((await push([])).status).toBe(403);
    expect((await app("GET", `/sync/pull?deviceId=${deviceId}`)).status).toBe(403);
  });
});
