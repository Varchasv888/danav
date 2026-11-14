import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const day = async (top = 10) => (await get(`/reports/daily-sales?date=${today}&top=${top}`)) as {
  sales: string; pieces: string; bills: number; averageBill: string; cash: { received: string; paid: string; net: string }; bank: { received: string }; top: { name: string; qty: string; amount: string }[];
};

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("dailysales", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  for (const [key, name, rate] of [["a", "Daily Shirt", "1000"], ["b", "Daily Belt", "400"], ["c", "Daily Socks", "100"]] as const) {
    id[key] = (await post("/items", { name, uomId: pcs, gstRate: "5", hsn: "6205", saleRate: rate })).body.id;
  }
  await post("/stock-journals", { kind: "opening", lines: [id.a, id.b, id.c].map((itemId) => ({ itemId, warehouseId: id.main, qty: "50", rate: "50" })) });
  await t.call(c, "PUT", "/pos/settings", { pricesIncludeTax: true });
  id.t1 = (await post("/pos/terminals", { name: "Counter" })).body.id;
  await post("/pos/sessions", { terminalId: id.t1, openingCash: "0" });
  await post("/pos/bills", { terminalId: id.t1, lines: [{ itemId: id.a, qty: "2" }], payments: [{ mode: "cash", amount: "2000" }] });
  await post("/pos/bills", { terminalId: id.t1, lines: [{ itemId: id.b, qty: "1" }, { itemId: id.c, qty: "3" }], payments: [{ mode: "upi", amount: "700" }] });
});
afterAll(() => t.close());

describe("daily sales", () => {
  it("totals the day's sales, bills and pieces", async () => {
    const r = await day();
    expect(r.bills).toBe(2);
    expect(r.pieces).toBe("6");
    // Prices include 5% tax, so the taxable sales are 2700 less the tax in them.
    expect(Number(r.sales)).toBeCloseTo(2700 / 1.05, 1);
    expect(Number(r.averageBill)).toBeCloseTo(Number(r.sales) / 2, 1);
  });

  it("shows what moved through cash and the bank, from the books", async () => {
    const r = await day();
    expect(Number(r.cash.received)).toBeGreaterThanOrEqual(2000);
    expect(Number(r.bank.received)).toBe(0); // counter UPI settles to a clearing account, not the bank, until the gateway pays
  });

  it("lists the best sellers by value, and the reader chooses how many", async () => {
    const r = await day(2);
    expect(r.top.map((x) => x.name)).toEqual(["Daily Shirt", "Daily Belt"]);
    expect(r.top[0]).toMatchObject({ qty: "2" });
    expect((await day(1)).top).toHaveLength(1);
  });

  it("a day with no sales is empty, and bad input is refused", async () => {
    const empty = (await get("/reports/daily-sales?date=2020-01-01")) as { sales: string; bills: number; top: unknown[] };
    expect(empty).toMatchObject({ sales: "0.00", bills: 0, top: [] });
    expect((await t.call(c, "GET", "/reports/daily-sales?top=500")).status).toBe(400);
    expect((await t.call(c, "GET", "/reports/daily-sales?date=bad")).status).toBe(400);
  });

  it("keeps businesses apart", async () => {
    const other = (await t.signup("dailysales-other")).cookie;
    expect((await t.call(other, "GET", `/reports/daily-sales?date=${today}`)).body).toMatchObject({ sales: "0.00", bills: 0, top: [] });
  });
});

describe("sales ageing on the daily view", () => {
  it("shows how old the goods were when they sold, in bands that run to over five years", async () => {
    const d = (await get(`/reports/daily-sales?date=${today}&top=5`)) as { ageing: { key: string; qty: string; amount: string }[] };
    expect(d.ageing.map((a) => a.key)).toEqual(["d0_30", "d31_60", "d61_90", "d91_180", "d181_365", "y1_2", "y2_3", "y3_4", "y4_5", "y5plus"]);
    const sold = d.ageing.reduce((t2, a) => t2 + Number(a.qty), 0);
    expect(sold).toBe(6); // 2 shirts, 1 belt and 3 socks, however old
  });
});
