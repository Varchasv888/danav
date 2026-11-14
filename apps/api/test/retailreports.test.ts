import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("retailrep", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  const group = (k: string) => groups.find((g) => g.key === k)!.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.cust = (await post("/accounts", { name: "Walk-in Retailer", groupId: group("sundry_debtors"), stateCode: "27" })).body.id;
  id.vendor = (await post("/accounts", { name: "Vendor A", groupId: group("sundry_creditors"), stateCode: "27" })).body.id;
  id.red = (await post("/colors", { name: "Red" })).body.id;
  const style = (await post("/styles", { code: "RR-1", name: "Report Shirt", uomId: id.pcs, colorIds: [id.red], sizes: ["M", "L"], saleRate: "1000", purchaseRate: "400", brand: "Varsha" })).body;
  const variants = ((await get(`/styles/${style.id}`)).variants ?? []) as { id: string; size: string }[];
  id.m = variants.find((v) => v.size === "M")!.id;
  id.l = variants.find((v) => v.size === "L")!.id;
  await post("/stock-journals", { kind: "opening", date: "2026-06-30", lines: [{ itemId: id.m, warehouseId: id.main, qty: "20", rate: "400" }, { itemId: id.l, warehouseId: id.main, qty: "20", rate: "400" }] });
  const po = await post("/purchase-orders", { supplierId: id.vendor, date: "2026-07-01", expectedOn: "2026-07-10", lines: [{ itemId: id.m, qty: "10", rate: "400" }] });
  const poLine = (await get(`/purchase-orders/${po.body.id}`)).lines[0].id;
  await post("/goods-receipts", { supplierId: id.vendor, orderId: po.body.id, date: "2026-07-15", lines: [{ itemId: id.m, qty: "6", orderLineId: poLine }] });
  await post("/purchase-bills", { supplierId: id.vendor, date: "2026-07-20", supplierInvoiceNo: "VA/1", supplierInvoiceDate: "2026-07-20", lines: [{ itemId: id.m, qty: "10", rate: "420" }] });
  await post("/sales-invoices", { customerId: id.cust, date: "2026-08-05", lines: [{ itemId: id.m, qty: "5", rate: "1000" }] });
  await post("/sales-invoices", { customerId: id.cust, date: "2026-08-20", lines: [{ itemId: id.l, qty: "3", rate: "1000" }] });
});
afterAll(() => t.close());

describe("registers", () => {
  it("shows sales by month and by day", async () => {
    const m = await get("/reports/register?kind=sales&grain=month&from=2026-07-01&to=2026-09-30");
    expect(m.rows).toEqual([{ period: "2026-08-01", pieces: "8", amount: "8000.00" }]);
    const d = await get("/reports/register?kind=sales&grain=day&from=2026-08-01&to=2026-08-31");
    expect(d.rows.map((r: { period: string }) => r.period)).toEqual(["2026-08-05", "2026-08-20"]);
    expect(d.total).toBe("8000.00");
  });

  it("shows purchases and a running stock balance", async () => {
    const p = await get("/reports/register?kind=purchases&grain=month&from=2026-07-01&to=2026-08-31");
    expect(p.total).toBe("4200.00");
    const s = await get("/reports/register?kind=stock&grain=month&from=2026-07-01&to=2026-08-31");
    expect(s.opening).toBe("40");
    expect(s.rows).toEqual([{ period: "2026-07-01", pieceIn: "16", pieceOut: "0", balance: "56" }, { period: "2026-08-01", pieceIn: "0", pieceOut: "8", balance: "48" }]);
    expect(s.closing).toBe("48");
    expect((await t.call(c, "GET", "/reports/register?kind=sales&from=2026-09-01&to=2026-08-01")).status).toBe(400);
  });
});

describe("comparisons and profit", () => {
  it("compares the year with the year before, month by month", async () => {
    const y = await get("/reports/year-comparison?year=2026");
    expect(y.rows).toHaveLength(12);
    expect(y.rows[7]).toMatchObject({ month: 8, sales: "8000.00", salesLastYear: "0.00", salesGrowthPct: null });
    expect(y.rows[6]).toMatchObject({ purchases: "4200.00" });
    expect(y.totals.sales).toBe("8000.00");
  });

  it("sets sales against purchases by month", async () => {
    const r = await get("/reports/sales-vs-purchases?from=2026-07-01&to=2026-09-30");
    expect(r.rows.map((x: { month: string }) => x.month)).toEqual(["2026-07", "2026-08"]);
    expect(r.totals).toMatchObject({ sales: "8000.00", purchases: "4200.00", difference: "3800.00" });
  });

  it("works out margin by design, brand and party", async () => {
    const design = await get("/reports/profit-by?dim=design&from=2026-08-01&to=2026-08-31");
    expect(design.rows[0]).toMatchObject({ name: "Report Shirt", pieces: "8", sales: "8000.00" });
    expect(Number(design.rows[0].margin)).toBeGreaterThan(0);
    expect((await get("/reports/profit-by?dim=brand&from=2026-08-01&to=2026-08-31")).rows[0].name).toBe("Varsha");
    expect((await get("/reports/profit-by?dim=party&from=2026-08-01&to=2026-08-31")).rows[0].name).toBe("Walk-in Retailer");
  });
});

describe("stock ratios, vendors and backlog", () => {
  it("gives cover, sell-through and size availability per design", async () => {
    const r = await get("/reports/stock-ratios?asOf=2026-09-01&days=30");
    expect(r.rows[0]).toMatchObject({ design: "Report Shirt", stock: "48", sold: "8", coverDays: "180", sellThroughPct: "14.3", sizes: 2, sizesInStock: 2, flag: "ok" });
    expect((await t.call(c, "GET", "/reports/stock-ratios?days=2")).status).toBe(400);
  });

  it("rates a supplier on lead time, fill rate and returns", async () => {
    const r = await get("/reports/vendor-analysis?from=2026-07-01&to=2026-09-30");
    expect(r.rows[0]).toMatchObject({ supplier: "Vendor A", bought: "4200.00", pieces: "10", ratePerPiece: "420.00", orders: 1, promisedDays: 9, actualDays: 14, fillRatePct: "60.0", lateOrders: 1, returned: "0.00" });
  });

  it("lists what is still to come on purchase orders, with days late", async () => {
    const r = await get("/reports/purchase-backlog?asOf=2026-07-20");
    expect(r).toMatchObject({ orders: 1, late: 1, pendingValue: "1600.00" });
    expect(r.rows[0]).toMatchObject({ pendingQty: "4", daysLate: 10, supplier: "Vendor A" });
  });
});
