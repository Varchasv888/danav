import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { applyHeaderDiscounts } from "../src/services/sales.js";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const plus = (iso: string, n: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

describe("bill-wide discounts", () => {
  it("takes the special discount first, then the cash discount on what is left, spread over the lines", () => {
    const lines = [{ rate: "1000", qty: "2", discount: "0" }, { rate: "500", qty: "1", discount: "0" }];
    const r = applyHeaderDiscounts(lines, { special: "10", cash: "2" });
    // 2500 less 10% = 2250, less 2% of that = 2205.
    expect(r.summary).toEqual([{ kind: "special", pct: "10.00", amount: "250.00" }, { kind: "cash", pct: "2.00", amount: "45.00" }]);
    expect(lines.map((l) => l.discount)).toEqual(["236.00", "59.00"]);
    expect(r.shares).toEqual(["236.00", "59.00"]);
    expect(applyHeaderDiscounts([{ rate: "100", qty: "1", discount: "0" }], undefined).summary).toEqual([]);
    expect(() => applyHeaderDiscounts([{ rate: "100", qty: "1", discount: "0" }], { cash: "150" })).toThrow();
  });
});

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("invdisc", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.cust = (await post("/accounts", { name: "Wholesale Buyer", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  const setup = await get("/inventory/setup");
  id.shirt = (await post("/items", { name: "Bulk Shirt", uomId: setup.uoms[0].id, gstRate: "5", saleRate: "1000", purchaseRate: "400", mrp: "1000" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: setup.warehouses[0].id, qty: "100", rate: "400" }] });
});
afterAll(() => t.close());

describe("an invoice with separate discount lines", () => {
  it("works the tax on the reduced value and keeps the discounts as their own lines", async () => {
    const r = await post("/sales-invoices", { customerId: id.cust, date: today, lines: [{ itemId: id.shirt, qty: "10", rate: "1000" }], discounts: { special: "10", cash: "2" }, earlyPay: { pct: "1", days: 10 } });
    expect(r.status).toBe(201);
    const inv = await get(`/sales-invoices/${r.body.id}`);
    // 10,000 less 10% (1,000) less 2% of 9,000 (180) = 8,820 taxable; 5% tax = 441.
    expect(inv).toMatchObject({ taxable: "8820.00", total: "9261.00", earlyPayPct: "1.00", earlyPayDays: 10 });
    expect(inv.headerDiscounts).toEqual([{ kind: "special", pct: "10.00", amount: "1000.00" }, { kind: "cash", pct: "2.00", amount: "180.00" }]);
    expect(inv.lines[0]).toMatchObject({ discount: "1180.00", headerDiscount: "1180.00" });
    id.invoice = r.body.id;
  });

  it("refuses silly percentages", async () => {
    expect((await post("/sales-invoices", { customerId: id.cust, date: today, lines: [{ itemId: id.shirt, qty: "1", rate: "1000" }], discounts: { cash: "120" } })).status).toBe(400);
    expect((await post("/sales-invoices", { customerId: id.cust, date: today, lines: [{ itemId: id.shirt, qty: "1", rate: "1000" }], earlyPay: { pct: "0", days: 10 } })).body.error).toBe("invalid_early_pay");
  });

  it("says how much the early-payment discount is while the window is open, and nothing after", async () => {
    const open = await get(`/sales-invoices/${id.invoice}/early-discount?date=${plus(today, 10)}`);
    expect(open).toMatchObject({ eligible: true, pct: "1.00", until: plus(today, 10), amount: "88.20" });
    expect(await get(`/sales-invoices/${id.invoice}/early-discount?date=${plus(today, 11)}`)).toMatchObject({ eligible: false, amount: "0.00" });
  });
});
