import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import { createDb, tables, withTenant } from "@varchasv/db";
import { buildApp } from "../src/app.js";

// Needs the dev Postgres from docker-compose (npm run db:up && npm run db:migrate).
const APP_URL = process.env.DATABASE_URL ?? "postgres://varchasv_app:varchasv_app_dev@localhost:5433/varchasv";
const OWNER_URL = process.env.DATABASE_OWNER_URL ?? "postgres://varchasv_owner:varchasv_owner_dev@localhost:5433/varchasv";

const appDb = createDb(APP_URL, { max: 4 });
const ownerDb = createDb(OWNER_URL, { max: 1 });
let app: Awaited<ReturnType<typeof buildApp>>;
const run = Date.now().toString(36);

async function signup(tag: string, extra: Record<string, unknown> = {}) {
  const res = await app.inject({
    method: "POST",
    url: "/auth/signup",
    payload: { name: `Owner ${tag}`, email: `${tag}-${run}@test.varchasv.in`, password: "correct horse battery", businessName: `${tag} Traders`, stateCode: "27", ...extra },
  });
  const cookie = res.cookies.find((c) => c.name === "vsid");
  return { res, body: res.json(), cookie: cookie ? `vsid=${cookie.value}` : "" };
}

let a: Awaited<ReturnType<typeof signup>>;
let b: Awaited<ReturnType<typeof signup>>;

beforeAll(async () => {
  app = await buildApp({ db: appDb.db, logger: false, rateLimits: false });
  a = await signup("alpha", { gstin: "27AAPFU0939F1ZV" });
  b = await signup("beta");
});
afterAll(async () => {
  await app.close();
  await appDb.close();
  await ownerDb.close();
});

describe("signup and session", () => {
  it("creates a ready-to-use business and signs the owner in", async () => {
    expect(a.res.statusCode).toBe(201);
    const me = (await app.inject({ url: "/auth/me", headers: { cookie: a.cookie } })).json();
    expect(me.role).toBe("owner");
    expect(me.permissions).toContain("company.delete");
    expect(me.tenants).toHaveLength(1);

    const companies = (await app.inject({ url: "/companies", headers: { cookie: a.cookie } })).json();
    expect(companies).toHaveLength(1);
    expect(companies[0].pan).toBe("AAPFU0939F");
    expect(companies[0].branches[0]).toMatchObject({ gstin: "27AAPFU0939F1ZV", stateCode: "27", isHeadOffice: true });

    const series = (await app.inject({ url: "/number-series", headers: { cookie: a.cookie } })).json();
    const inv = series.find((s: { docType: string }) => s.docType === "sales_invoice");
    expect(inv.nextNumber).toMatch(/^INV\/\d{2}-\d{2}\/00001$/);
  });

  it("rejects a duplicate email, a GSTIN from another state and a wrong password", async () => {
    const dup = await app.inject({ method: "POST", url: "/auth/signup", payload: { name: "X Y", email: `ALPHA-${run}@test.varchasv.in`, password: "another password", businessName: "Dup", stateCode: "27" } });
    expect(dup.statusCode).toBe(409);
    const mismatch = await signup("gamma", { gstin: "29AAGCB7383J1Z4" });
    expect(mismatch.res.statusCode).toBe(400);
    expect(mismatch.body.error).toBe("gstin_state_mismatch");
    const bad = await app.inject({ method: "POST", url: "/auth/login", payload: { email: `alpha-${run}@test.varchasv.in`, password: "wrong password" } });
    expect(bad.statusCode).toBe(401);
    const good = await app.inject({ method: "POST", url: "/auth/login", payload: { email: `Alpha-${run}@test.varchasv.in`, password: "correct horse battery" } });
    expect(good.statusCode).toBe(200);
  });

  it("lets a business bring in earlier years by starting its books on a past date", async () => {
    const early = await signup("books", { booksFrom: "2024-04-01" });
    expect(early.res.statusCode).toBe(201);
    const [company] = (await app.inject({ url: "/companies", headers: { cookie: early.cookie } })).json();
    expect(company.booksBeginOn).toBe("2024-04-01");
    const years = (await app.inject({ url: "/fiscal-years", headers: { cookie: early.cookie } })).json();
    expect(years.map((y: { label: string }) => y.label)).toEqual(["2024-25"]);
    expect((await signup("future", { booksFrom: "2099-04-01" })).body.error).toBe("invalid_books_from");
    expect((await signup("older", { booksFrom: "2023-04-01" })).body.error).toBe("invalid_books_from");
  });

  it("refuses tenant routes without a session", async () => {
    expect((await app.inject({ url: "/companies" })).statusCode).toBe(401);
  });
});

describe("tenant isolation", () => {
  it("one business cannot see or change another's company through the API", async () => {
    const aCompanies = (await app.inject({ url: "/companies", headers: { cookie: a.cookie } })).json();
    const bCompanies = (await app.inject({ url: "/companies", headers: { cookie: b.cookie } })).json();
    expect(bCompanies.map((c: { id: string }) => c.id)).not.toContain(aCompanies[0].id);
    const hijack = await app.inject({ method: "PATCH", url: `/companies/${aCompanies[0].id}`, headers: { cookie: b.cookie }, payload: { name: "Hijacked" } });
    expect(hijack.statusCode).toBe(404);
  });

  it("row-level security hides every row when no tenant is set, and other tenants' rows when one is", async () => {
    const none = await appDb.db.select().from(tables.companies);
    expect(none).toHaveLength(0);
    const onlyA = await withTenant(appDb.db, a.body.tenantId, (tx) => tx.select().from(tables.companies));
    expect(onlyA.every((c) => c.tenantId === a.body.tenantId)).toBe(true);
    expect(onlyA).toHaveLength(1);
    // Writing a row for another tenant is rejected by the policy's WITH CHECK.
    await expect(withTenant(appDb.db, a.body.tenantId, (tx) =>
      tx.insert(tables.companies).values({ tenantId: b.body.tenantId, name: "Sneaky", booksBeginOn: "2026-04-01" }),
    )).rejects.toThrow();
  });
});

describe("audit trail", () => {
  it("records changes with before/after values", async () => {
    const [company] = (await app.inject({ url: "/companies", headers: { cookie: a.cookie } })).json();
    await app.inject({ method: "PATCH", url: `/companies/${company.id}`, headers: { cookie: a.cookie }, payload: { legalName: "Alpha Traders LLP" } });
    const log = (await app.inject({ url: "/audit-log", headers: { cookie: a.cookie } })).json();
    expect(log[0]).toMatchObject({ action: "update", entity: "company", after: { legalName: "Alpha Traders LLP" }, userName: `Owner alpha` });
  });

  it("cannot be edited or deleted, even by the database owner", async () => {
    await expect(withTenant(appDb.db, a.body.tenantId, (tx) => tx.execute(sql`delete from audit_log`))).rejects.toThrow();
    await expect(ownerDb.db.execute(sql`update audit_log set action = 'tampered'`)).rejects.toMatchObject({ cause: { message: expect.stringMatching(/append-only/) } });
  });
});

describe("number series", () => {
  it("rejects patterns longer than GST allows and never goes backwards", async () => {
    const series = (await app.inject({ url: "/number-series", headers: { cookie: a.cookie } })).json();
    const inv = series.find((s: { docType: string }) => s.docType === "sales_invoice");
    const tooLong = await app.inject({ method: "PATCH", url: `/number-series/${inv.id}`, headers: { cookie: a.cookie }, payload: { pattern: "INVOICE/{FYL}/{SEQ:5}" } });
    expect(tooLong.json().error).toBe("series_too_long");
    const forward = await app.inject({ method: "PATCH", url: `/number-series/${inv.id}`, headers: { cookie: a.cookie }, payload: { nextSeq: 101 } });
    expect(forward.statusCode).toBe(200);
    const back = await app.inject({ method: "PATCH", url: `/number-series/${inv.id}`, headers: { cookie: a.cookie }, payload: { nextSeq: 5 } });
    expect(back.json().error).toBe("series_cannot_go_back");
  });
});

describe("tools", () => {
  it("computes an invoice with the amount in Hindi words", async () => {
    const res = await app.inject({ method: "POST", url: "/tools/gst", payload: { ctx: { supplierState: "27", placeOfSupply: "27" }, lines: [{ qty: "2", rate: "500", gstRate: "18" }], lang: "hi" } });
    expect(res.json()).toMatchObject({ grandTotal: "1180.00", cgst: "90.00", inWords: "एक हज़ार एक सौ अस्सी रुपये मात्र" });
  });
});
