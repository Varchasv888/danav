import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

/**
 * Load: many invoices saved at the same moment by several people, mixed with reads. The point is not speed alone but that nothing breaks under it:
 * every request is answered, no number is used twice, and stock and the customer's balance agree exactly with what was saved.
 */
let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);

const pct = (xs: number[], q: number) => [...xs].sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor(q * xs.length))]!;
const report = (what: string, xs: number[]) => console.log(`${what}: n=${xs.length} p50=${pct(xs, 0.5).toFixed(1)}ms p95=${pct(xs, 0.95).toFixed(1)}ms p99=${pct(xs, 0.99).toFixed(1)}ms max=${Math.max(...xs).toFixed(1)}ms`);

async function timed<T>(fn: () => Promise<T>): Promise<{ r: T; ms: number }> {
  const s = performance.now();
  const r = await fn();
  return { r, ms: performance.now() - s };
}

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("stress", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.shirt = (await post("/items", { name: "Stress Shirt", hsn: "6205", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, saleRate: "500" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "100000", rate: "300" }] });
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.cust = (await post("/accounts", { name: "Stress Customer", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
}, 60000);
afterAll(() => t.close());

describe("invoices saved at the same time", () => {
  it("200 at once: all accepted, numbers all different and in one run, stock and balance exact", async () => {
    const N = 200;
    const before = (await get("/items")).find((i: { id: string }) => i.id === id.shirt);
    const body = (n: number) => ({ customerId: id.cust, date: "2026-10-05", lines: [{ itemId: id.shirt, qty: String(1 + (n % 7)), rate: "500" }] });
    const started = performance.now();
    const results = await Promise.all(Array.from({ length: N }, (_, n) => timed(() => post("/sales-invoices", body(n)))));
    const wall = performance.now() - started;
    report("200 concurrent saves", results.map((x) => x.ms));
    console.log(`200 concurrent saves finished in ${wall.toFixed(0)} ms (${((N / wall) * 1000).toFixed(1)} per second)`);

    const statuses = results.map((x) => x.r.status);
    const bad = results.filter((x) => x.r.status !== 201).map((x) => `${x.r.status} ${JSON.stringify(x.r.body).slice(0, 160)}`);
    expect(bad.slice(0, 5), "requests that were not accepted").toEqual([]);
    expect(statuses.every((s) => s === 201)).toBe(true);

    const numbers = results.map((x) => x.r.body.number as string);
    expect(new Set(numbers).size, "no invoice number used twice").toBe(N);
    const serials = numbers.map((n) => Number(n.split("/").pop())).sort((a, b) => a - b);
    expect(serials[serials.length - 1]! - serials[0]! + 1, "numbers have no gaps").toBe(N);

    const sold = results.reduce((s, _x, n) => s + (1 + (n % 7)), 0);
    const after = (await get("/items")).find((i: { id: string }) => i.id === id.shirt);
    expect(Number(before.stockQty) - Number(after.stockQty), "stock fell by exactly what was sold").toBe(sold);

    const total = results.reduce((s, x) => s + Math.round(Number(x.r.body.grandTotal ?? x.r.body.total) * 100), 0);
    const bal = await get(`/customers/${id.cust}/balance`);
    expect(Math.round(Number(bal.balance) * 100), "the customer owes exactly the sum of the invoices").toBe(total);
  }, 120000);

  it("mixed load: saves and reads together, nothing fails", async () => {
    const jobs: Promise<{ r: { status: number }; ms: number; kind: string }>[] = [];
    for (let i = 0; i < 60; i++) {
      jobs.push(timed(() => post("/sales-invoices", { customerId: id.cust, date: "2026-10-05", lines: [{ itemId: id.shirt, qty: "1", rate: "500" }] })).then((x) => ({ ...x, kind: "save" })));
      jobs.push(timed(() => t.call(c, "GET", "/items")).then((x) => ({ ...x, kind: "items" })));
      jobs.push(timed(() => t.call(c, "GET", `/customers/${id.cust}/balance`)).then((x) => ({ ...x, kind: "balance" })));
      jobs.push(timed(() => t.call(c, "GET", "/sales-invoices/form-info?date=2026-10-05")).then((x) => ({ ...x, kind: "form-info" })));
    }
    const out = await Promise.all(jobs);
    for (const kind of ["save", "items", "balance", "form-info"]) report(`mixed ${kind}`, out.filter((x) => x.kind === kind).map((x) => x.ms));
    const failed = out.filter((x) => x.r.status >= 400);
    expect(failed.length, `failed: ${failed.slice(0, 3).map((f) => `${f.kind} ${f.r.status}`).join(", ")}`).toBe(0);
  }, 120000);

  it("one person at a time, and ten at a time: what a user actually waits for (the test database pool holds 4 connections)", async () => {
    const one = async () => timed(() => post("/sales-invoices", { customerId: id.cust, date: "2026-10-05", lines: [{ itemId: id.shirt, qty: "1", rate: "500" }] }));
    const seq: number[] = [];
    for (let i = 0; i < 30; i++) { const x = await one(); expect(x.r.status).toBe(201); seq.push(x.ms); }
    report("30 saves one after another", seq);
    const reads: number[] = [];
    for (let i = 0; i < 30; i++) reads.push((await timed(() => t.call(c, "GET", "/items"))).ms);
    report("30 item list reads one after another", reads);
    const ten: number[] = [];
    for (let round = 0; round < 5; round++) {
      const batch = await Promise.all(Array.from({ length: 10 }, one));
      for (const x of batch) { expect(x.r.status).toBe(201); ten.push(x.ms); }
    }
    report("50 saves, ten at a time", ten);
  }, 120000);

  it("a burst of bad requests is refused cleanly and does not disturb the good ones", async () => {
    const bad = Array.from({ length: 80 }, (_, n) => post("/sales-invoices", n % 2 ? { customerId: id.cust, date: "nonsense", lines: [] } : { customerId: "00000000-0000-0000-0000-000000000000", date: "2026-10-05", lines: [{ itemId: id.shirt, qty: "1", rate: "500" }] }));
    const good = Array.from({ length: 20 }, () => post("/sales-invoices", { customerId: id.cust, date: "2026-10-05", lines: [{ itemId: id.shirt, qty: "1", rate: "500" }] }));
    const [b, g] = await Promise.all([Promise.all(bad), Promise.all(good)]);
    expect(b.every((x) => x.status >= 400 && x.status < 500), `statuses ${[...new Set(b.map((x) => x.status))]}`).toBe(true);
    expect(g.every((x) => x.status === 201)).toBe(true);
  }, 120000);

  it("a very large invoice (300 lines) is saved correctly", async () => {
    const lines = Array.from({ length: 300 }, (_, n) => ({ itemId: id.shirt, qty: String(1 + (n % 3)), rate: String(100 + n) }));
    const { r, ms } = await timed(() => post("/sales-invoices", { customerId: id.cust, date: "2026-10-05", lines }));
    console.log(`300 line invoice saved in ${ms.toFixed(0)} ms`);
    expect(r.status, JSON.stringify(r.body).slice(0, 200)).toBe(201);
    expect(r.body.lines?.length ?? 300).toBe(300);
  }, 120000);
});
