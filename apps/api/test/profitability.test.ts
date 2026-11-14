import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("profit", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  const group = (k: string) => groups.find((g) => g.key === k)!.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.cust = (await post("/accounts", { name: "Retail Chain", groupId: group("sundry_debtors"), stateCode: "27" })).body.id;
  id.rent = (await post("/accounts", { name: "Shop Rent", groupId: group("indirect_expenses") })).body.id;
  id.cash = ((await get("/accounts")) as { id: string; key: string | null }[]).find((a) => a.key === "cash")!.id;
  const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.shirt = (await post("/items", { name: "Profit Shirt", hsn: "6205", gstRate: "5", uomId: pcs, saleRate: "1000", purchaseRate: "600" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "50", rate: "600" }] });
});
afterAll(() => t.close());

describe("profitability waterfall", () => {
  it("runs from gross sales to operating profit, marking what is booked and what is estimated", async () => {
    const inv = await post("/sales-invoices", { customerId: id.cust, date: today, lines: [{ itemId: id.shirt, qty: "10", rate: "1000", discount: "500" }] });
    expect(inv.status).toBe(201);
    await post("/vouchers", { type: "payment", date: today, lines: [{ accountId: id.rent, debit: "950" }, { accountId: id.cash, credit: "950" }] });
    const r = await get(`/reports/profitability?from=${today.slice(0, 4)}-01-01&to=${today}&by=style`);
    expect(r.total).toMatchObject({ grossSales: "10000.00", discounts: "500.00", returns: "0.00", netSales: "9500.00", costOfGoods: "6000.00", grossMargin: "3500.00", commission: "0.00", contribution: "3500.00", overhead: "950.00", operatingProfit: "2550.00", marginPct: "36.8" });
    expect(r.basis).toMatchObject({ grossSales: "direct", costOfGoods: "estimated", overhead: "allocated" });
    expect(r.notCaptured).toContain("freight");
  });

  it("splits the same figures by customer, channel and item, adding back to the total", async () => {
    for (const by of ["customer", "channel", "item", "brand", "size", "store"]) {
      const r = await get(`/reports/profitability?from=${today.slice(0, 4)}-01-01&to=${today}&by=${by}`);
      const net = r.rows.reduce((s: number, x: { netSales: string }) => s + Number(x.netSales), 0);
      const profit = r.rows.reduce((s: number, x: { operatingProfit: string }) => s + Number(x.operatingProfit), 0);
      expect(net).toBeCloseTo(9500, 2);
      expect(profit).toBeCloseTo(2550, 2);
    }
    const byCustomer = await get(`/reports/profitability?from=${today.slice(0, 4)}-01-01&to=${today}&by=customer`);
    expect(byCustomer.rows[0].name).toBeTruthy();
    expect((await t.call(c, "GET", `/reports/profitability?from=${today}&to=${today}&by=colour`)).status).toBe(400);
  });

  it("keeps businesses apart", async () => {
    const other = (await t.signup("profit-other")).cookie;
    expect((await t.call(other, "GET", `/reports/profitability?from=${today.slice(0, 4)}-01-01&to=${today}`)).body.total.netSales).toBe("0.00");
  });
});

describe("loyalty-funded offers", () => {
  it("shows apart how much of the discounts customers paid for with points", async () => {
    await t.call(c, "POST", "/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "50", rate: "600" }] });
    await t.call(c, "PUT", "/pos/settings", { pricesIncludeTax: true });
    id.t = (await post("/pos/terminals", { name: "Counter" })).body.id;
    await post("/pos/sessions", { terminalId: id.t, openingCash: "0" });
    await t.call(c, "PUT", "/pos/settings", { loyaltyEnabled: true, loyaltyPointsPer100: 10, loyaltyPointValue: "1", loyaltyMaxRedeemPct: "50" });
    const first = await post("/pos/bills", { terminalId: id.t, customerPhone: "9811100022", lines: [{ itemId: id.shirt, qty: "1" }], payments: [{ mode: "cash", amount: "1000" }] });
    expect(first.status).toBe(201);
    const earned = first.body.loyaltyEarned as number;
    expect(earned).toBeGreaterThan(0);
    const second = await post("/pos/bills", { terminalId: id.t, customerPhone: "9811100022", redeemPoints: earned, lines: [{ itemId: id.shirt, qty: "1" }], payments: [{ mode: "cash", amount: String(1000 - earned) }] });
    expect(second.status).toBe(201);
    const r = await get(`/reports/profitability?from=${today}&to=${today}&by=brand`);
    expect(r.loyaltyFunded).toBe(`${earned}.00`.replace(/^(\d+)\.00$/, "$1.00"));
    expect(Number(r.total.discounts)).toBeGreaterThanOrEqual(earned);
  });
});

describe("cost of goods from the stock ledger", () => {
  it("costing=actual uses what the goods really cost, where the standard cost is out of date, and says how much of the sales it covers", async () => {
    const setup = await get("/inventory/setup");
    const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
    // Standard cost says 100 a piece, but the stock actually came in at 400.
    const coat = (await post("/items", { name: "Costly Coat", hsn: "6201", gstRate: "5", uomId: pcs, saleRate: "900", purchaseRate: "100" })).body.id;
    await post("/stock-journals", { kind: "opening", lines: [{ itemId: coat, warehouseId: id.main, qty: "20", rate: "400" }] });
    const inv = await post("/sales-invoices", { customerId: id.cust, date: today, lines: [{ itemId: coat, qty: "5", rate: "900" }] });
    expect(inv.status, JSON.stringify(inv.body)).toBe(201);
    const q = `from=${today.slice(0, 4)}-01-01&to=${today}&by=item`;
    const std = await get(`/reports/profitability?${q}`);
    const act = await get(`/reports/profitability?${q}&costing=actual`);
    const rowOf = (r: { rows: { name: string; costOfGoods: string; costCoverage: number | null }[] }) => r.rows.find((x) => x.name === "Costly Coat")!;
    expect(rowOf(std).costOfGoods).toBe("500.00");
    expect(rowOf(act).costOfGoods).toBe("2000.00");
    expect(rowOf(act).costCoverage).toBe(100);
    expect(act.costing).toBe("actual");
    expect(std.costCoverage).toBeNull();
  });
});
