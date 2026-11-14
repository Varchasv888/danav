import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown = {}) => t.call(c, "POST", url, body);
const check = async () => (await get("/reports/year-end?fy=2026-27")) as { from: string; to: string; netProfit: string; ready: boolean; integrityOk: boolean; pending: { key: string; count: number }[] };
const pending = async (key: string) => (await check()).pending.find((p) => p.key === key)!.count;

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("yearend", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.shirt = (await post("/items", { name: "Year Shirt", hsn: "6205", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, saleRate: "500" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "50", rate: "300" }] });
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.cust = (await post("/accounts", { name: "Year Customer", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
});
afterAll(() => t.close());

describe("year-end check", () => {
  it("covers the financial year and starts clean", async () => {
    const r = await check();
    expect(r).toMatchObject({ from: "2026-04-01", to: "2027-03-31", integrityOk: true });
    expect(r.pending.every((p) => p.count === 0)).toBe(true);
    expect(r.ready).toBe(true);
  });

  it("counts half-done documents inside the year, and clears as they are finished", async () => {
    const order = (await post("/sales-orders", { customerId: id.cust, date: "2026-10-01", lines: [{ itemId: id.shirt, qty: "5", rate: "500" }] })).body.id;
    expect(await pending("salesOrdersOpen")).toBe(1);
    const count = (await post("/stock-counts", { warehouseId: id.main, name: "Open count" })).body;
    expect(await pending("stockCounts")).toBe(1);
    const dorder = (await post("/delivery-orders", { customerId: id.cust, date: "2026-10-02", lines: [{ itemId: id.shirt, qty: "1" }] })).body.id;
    expect(await pending("deliveryOrdersOpen")).toBe(1);
    expect((await check()).ready).toBe(false);
    await post(`/sales-orders/${order}/cancel`);
    await post(`/stock-counts/${count.id}/cancel`, { reason: "Not needed" });
    await post(`/delivery-orders/${dorder}/cancel`);
    expect((await check()).ready).toBe(true);
  });

  it("ignores documents of other years, refuses a bad year, and keeps businesses apart", async () => {
    await post("/sales-orders", { customerId: id.cust, date: "2026-02-01", lines: [{ itemId: id.shirt, qty: "1", rate: "500" }] });
    expect(await pending("salesOrdersOpen")).toBe(0);
    expect((await t.call(c, "GET", "/reports/year-end?fy=2026-29")).status).toBe(400);
    expect((await t.call(c, "GET", "/reports/year-end?fy=bad")).status).toBe(400);
    const other = (await t.signup("yearend-other")).cookie;
    const o = (await t.call(other, "GET", "/reports/year-end?fy=2026-27")).body;
    expect(o.pending.every((p: { count: number }) => p.count === 0)).toBe(true);
  });
});

describe("carry-forward check", () => {
  it("lists what becomes opening balances next year, with the year's profit and open bills", async () => {
    await post("/sales-invoices", { customerId: id.cust, date: "2026-10-05", lines: [{ itemId: id.shirt, qty: "10", rate: "500" }] });
    const r = await get("/reports/carry-forward?fy=2026-27");
    expect(r).toMatchObject({ fy: "2026-27", from: "2026-04-01", to: "2027-03-31" });
    // This business has opening stock but no capital entered, so the sheet shows the gap rather than hiding it.
    expect(r.balanced).toBe(Math.abs(Number(r.totalAssets) - Number(r.totalLiabilities)) < 0.01);
    expect(Number(r.difference)).toBeCloseTo(Number(r.totalAssets) - Number(r.totalLiabilities), 1);
    expect(r.assets.some((g: { group: string }) => g.group.length > 0)).toBe(true);
    expect(r.openBills.receivable).toMatchObject({ parties: 1 });
    expect(Number(r.openBills.receivable.total)).toBeGreaterThan(0);
    expect(Number(r.profitCarriedForward)).toBeCloseTo(Number(r.profitThisYear) + Number(r.profitCarriedFromEarlier), 1);
    expect((await t.call(c, "GET", "/reports/carry-forward?fy=2026-99")).status).toBe(400);
  });
});
