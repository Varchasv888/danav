import { sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PUBLIC_ROUTES as PUBLIC } from "../src/lib/public-routes.js";
import { testApp } from "./helpers.js";

// Sweeps every registered route: nothing tenant-scoped answers an anonymous caller, and a read-only
// member is refused everything their role doesn't grant.
let t: Awaited<ReturnType<typeof testApp>>;
let owner = "";
let viewer = "";
let viewerPerms = new Set<string>();

const DUMMY = "00000000-0000-4000-8000-000000000000";
const fill = (url: string) => url.replace(/:\w+/g, DUMMY);
const routes = () => t.app.routeTable.filter((r) => r.method !== "OPTIONS");

beforeAll(async () => {
  t = await testApp();
  owner = (await t.signup("secowner")).cookie;
  const roles = (await t.call(owner, "GET", "/roles")).body as { id: string; key: string }[];
  const inv = await t.call(owner, "POST", "/invitations", { email: `viewer-${t.run}@test.varchasv.in`, roleId: roles.find((r) => r.key === "viewer")!.id });
  const token = inv.body.inviteUrl.split("/invite/")[1];
  viewer = (await t.call("", "POST", "/invitations/accept", { token, name: "Read Only", password: "only-looking-123" })).cookie;
  viewerPerms = new Set((await t.call(viewer, "GET", "/auth/me")).body.permissions);
});
afterAll(() => t.close());

const MARK = "Zircon"; // appears only in business A's data
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const uuids = (v: unknown, out = new Set<string>()): Set<string> => {
  if (typeof v === "string" && UUID.test(v)) out.add(v);
  else if (Array.isArray(v)) v.forEach((x) => uuids(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => uuids(x, out));
  return out;
};

describe("route sweep", () => {
  it("knows every route", () => {
    expect(routes().length).toBeGreaterThan(250);
  });

  it("refuses anonymous callers on every non-public route", async () => {
    const leaks: string[] = [];
    for (const r of routes()) {
      if (PUBLIC.has(`${r.method} ${r.url}`)) continue;
      const res = await t.call("", r.method, fill(r.url), r.method === "GET" || r.method === "DELETE" ? undefined : {});
      if (res.status !== 401) leaks.push(`${r.method} ${r.url} → ${res.status}`);
    }
    expect(leaks).toEqual([]);
  }, 60_000);

  it("refuses a forged or expired session token", async () => {
    expect((await t.call("vsid=not-a-real-session", "GET", "/auth/me")).status).toBe(401);
    const res = await t.app.inject({ method: "GET", url: "/auth/me", headers: { authorization: "Bearer forged-token" } });
    expect(res.statusCode).toBe(401);
  });

  it("refuses a read-only member everything their role doesn't grant", async () => {
    expect(viewerPerms.size).toBeGreaterThan(0);
    const wrong: string[] = [];
    let checked = 0;
    for (const r of routes()) {
      if (r.permissions.length === 0 || r.permissions.some((p) => viewerPerms.has(p))) continue;
      checked++;
      const res = await t.call(viewer, r.method, fill(r.url), r.method === "GET" || r.method === "DELETE" ? undefined : {});
      if (res.status !== 403) wrong.push(`${r.method} ${r.url} → ${res.status}`);
    }
    expect(wrong).toEqual([]);
    expect(checked).toBeGreaterThan(100);
  }, 60_000);

  it("gives a read-only member no write permission at all", () => {
    const writes = [...viewerPerms].filter((p) => !p.endsWith(".view"));
    expect(writes).toEqual([]);
  });
});

describe("passwords", () => {
  it("changes a password and signs out the user's other sessions", async () => {
    const s = await t.signup("pwchange");
    const other = (await t.call("", "POST", "/auth/login", { email: s.email, password: "correct horse battery" })).cookie;
    expect((await t.call(s.cookie, "POST", "/auth/password", { current: "wrong", next: "new password 123" })).body.error).toBe("wrong_password");
    expect((await t.call(s.cookie, "POST", "/auth/password", { current: "correct horse battery", next: "new password 123" })).status).toBe(200);
    expect((await t.call(s.cookie, "GET", "/auth/me")).status).toBe(200);
    expect((await t.call(other, "GET", "/auth/me")).status).toBe(401);
    expect((await t.call("", "POST", "/auth/login", { email: s.email, password: "new password 123" })).status).toBe(200);
  });

  it("resets a forgotten password with a one-time emailed link", async () => {
    const s = await t.signup("pwforgot");
    const sent = t.mailer.sent.length;
    expect((await t.call("", "POST", "/auth/password/forgot", { email: `nobody-${t.run}@test.varchasv.in` })).body).toEqual({ ok: true });
    expect(t.mailer.sent.length).toBe(sent); // no mail, same answer
    await t.call("", "POST", "/auth/password/forgot", { email: s.email.toUpperCase() });
    const mail = t.mailer.sent.at(-1)!;
    expect(mail.to).toBe(s.email);
    const token = mail.text.match(/reset-password\/(\S+)/)![1];
    expect((await t.call("", "POST", "/auth/password/reset", { token, password: "short" })).status).toBe(400);
    expect((await t.call("", "POST", "/auth/password/reset", { token, password: "a fresh password" })).status).toBe(200);
    expect((await t.call("", "POST", "/auth/password/reset", { token, password: "again and again" })).body.error).toBe("invalid_or_expired_link");
    expect((await t.call(s.cookie, "GET", "/auth/me")).status).toBe(401); // signed out everywhere
    expect((await t.call("", "POST", "/auth/login", { email: s.email, password: "correct horse battery" })).status).toBe(401);
    expect((await t.call("", "POST", "/auth/login", { email: s.email, password: "a fresh password" })).status).toBe(200);
  });
});

describe("one business can't reach another's records by id", () => {
  const a: Record<string, string> = {};
  let b = "";

  beforeAll(async () => {
    const post = async (url: string, body: unknown) => (await t.call(owner, "POST", url, body)).body;
    const groups: { id: string; key: string }[] = (await t.call(owner, "GET", "/accounts/groups")).body;
    a.customer = (await post("/accounts", { name: `${MARK} Customer`, groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).id;
    const setup = (await t.call(owner, "GET", "/inventory/setup")).body;
    a.item = (await post("/items", { name: `${MARK} Rice`, hsn: "1006", gstRate: "5", uomId: setup.uoms[0].id, saleRate: "100" })).id;
    await post("/stock-journals", { kind: "opening", lines: [{ itemId: a.item, warehouseId: setup.warehouses[0].id, qty: "10", rate: "80" }] });
    a.invoice = (await post("/sales-invoices", { customerId: a.customer, date: "2026-09-10", lines: [{ itemId: a.item, qty: "2", rate: "100" }] })).id;
    a.employee = (await post("/employees", {
      name: `${MARK} Employee`, gender: "female", joinedOn: "2026-04-01", workState: "27",
      components: [{ code: "BASIC", name: "Basic", monthly: "15000", pfWage: true }],
    })).id;
    for (const v of Object.values(a)) expect(v).toMatch(UUID);
    b = (await t.signup("secother")).cookie;
  });

  it("reads: every GET route with an id from business A returns nothing of A's", async () => {
    // Every id A can see (accounts, items, invoices, employees, lines...), gathered from A's own list routes.
    const ids = new Set(Object.values(a));
    for (const r of routes()) {
      if (r.method !== "GET" || r.url.includes(":")) continue;
      const res = await t.call(owner, "GET", r.url);
      if (res.status === 200) uuids(res.body, ids);
    }
    expect(ids.size).toBeGreaterThan(20);
    const leaks: string[] = [];
    const idRoutes = routes().filter((r) => r.method === "GET" && /:\w+/.test(r.url));
    // The same request as A does show A's data, so a leak would be caught.
    expect(JSON.stringify((await t.call(owner, "GET", `/employees/${a.employee}`)).body)).toContain(MARK);
    // A few requests at a time, so the sweep doesn't starve the test files running beside it.
    const all = [...ids];
    for (const r of idRoutes) {
      for (let i = 0; i < all.length; i += 4) {
        await Promise.all(all.slice(i, i + 4).map(async (id) => {
          const res = await t.app.inject({ method: "GET", url: r.url.replace(/:\w+/g, id), headers: { cookie: b } });
          if (res.statusCode === 200 && res.body.includes(MARK)) leaks.push(`${r.url} with ${id}`);
          if (res.statusCode >= 500) leaks.push(`${r.url} with ${id} → ${res.statusCode}`);
        }));
      }
    }
    expect(leaks).toEqual([]);
  }, 300_000);

  it("writes: editing or cancelling A's records from B changes nothing", async () => {
    expect((await t.call(b, "PATCH", `/accounts/${a.customer}`, { name: "Hijacked" })).status).toBe(404);
    expect((await t.call(b, "PATCH", `/items/${a.item}`, { name: "Hijacked" })).status).toBe(404);
    expect((await t.call(b, "PATCH", `/employees/${a.employee}`, { name: "Hijacked" })).status).toBe(404);
    expect((await t.call(b, "POST", `/sales-invoices/${a.invoice}/cancel`, { reason: "Hijacked" })).status).toBe(404);
    const invoice = (await t.call(owner, "GET", `/sales-invoices/${a.invoice}`)).body;
    expect(invoice.status).not.toBe("cancelled");
    expect((await t.call(owner, "GET", `/employees/${a.employee}`)).body.name).toBe(`${MARK} Employee`);
  });

  it("can't reference A's records inside its own documents", async () => {
    const r = await t.call(b, "POST", "/sales-invoices", { customerId: a.customer, date: "2026-09-10", lines: [{ itemId: a.item, qty: "1", rate: "100" }] });
    expect(r.status).toBeGreaterThanOrEqual(400);
    expect(r.status).toBeLessThan(500);
  });
});

describe("row-level security coverage", () => {
  it("every table holding tenant data has row-level security switched on", async () => {
    const rows = await t.ownerDb.db.execute<{ table_name: string }>(sql`
      select c.table_name from information_schema.columns c
      join pg_tables p on p.tablename = c.table_name and p.schemaname = 'public'
      where c.table_schema = 'public' and c.column_name = 'tenant_id' and not p.rowsecurity
      order by 1`);
    // sessions is read while signing in, before any business is chosen; its tenant_id only records
    // which business the session is working in.
    expect([...rows].map((r) => r.table_name).filter((n) => n !== "sessions")).toEqual([]);
  });
});
