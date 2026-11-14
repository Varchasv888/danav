import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("cfo", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.shop = (await post("/accounts", { name: "CFO Shop", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  for (const a of await get("/accounts") as { id: string; key: string | null }[]) if (a.key) id[a.key] = a.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.shirt = (await post("/items", { name: "CFO Shirt", hsn: "6205", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, saleRate: "700" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "50", rate: "400" }] });
  await post("/sales-invoices", { customerId: id.shop, date: "2026-09-10", lines: [{ itemId: id.shirt, qty: "2", rate: "700" }] });
  await post("/vouchers", { type: "payment", date: "2026-10-05", lines: [{ accountId: id.rent, debit: "300" }, { accountId: id.cash, credit: "300" }] });
});
afterAll(() => t.close());

describe("CFO view", () => {
  it("gives revenue, expenses and profit for the period, with the margin month by month", async () => {
    const r = await get("/reports/cfo?from=2026-09-01&to=2026-10-31");
    expect(r.current).toMatchObject({ revenue: "1400.00", operatingExpenses: "300.00", depreciation: "0.00" });
    expect(Number(r.current.netProfit)).toBeCloseTo(Number(r.current.grossProfit) + Number(r.current.otherIncome) - 300, 2);
    expect(r.current.ebitda).toBe(r.current.netProfit);
    expect(r.months.map((m: { month: string }) => m.month)).toEqual(["2026-09", "2026-10"]);
    expect(r.months[0].revenue).toBe("1400.00");
    expect(r.months[1].revenue).toBe("0.00");
    expect(r.months[1].grossMarginPct).toBeNull();
  });

  it("compares with the same period a year earlier, and leaves growth empty when there was nothing", async () => {
    const r = await get("/reports/cfo?from=2026-09-01&to=2026-10-31");
    expect(r.previous).toEqual({ from: "2025-09-01", to: "2025-10-31" });
    expect(r.last.revenue).toBe("0.00");
    expect(r.growth.revenue).toBeNull();
  });

  it("refuses a backwards range", async () => {
    expect((await t.call(c, "GET", "/reports/cfo?from=2026-10-31&to=2026-09-01")).status).toBe(400);
  });
});
