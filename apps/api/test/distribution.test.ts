import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { splitPieces } from "../src/services/distribution.js";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const stock = async (itemId: string, warehouseId: string) => Number(((await get(`/reports/stock-summary?asOf=${today}&warehouseId=${warehouseId}`)).rows as { itemId: string; qty: string }[]).find((r) => r.itemId === itemId)?.qty ?? 0);

describe("splitPieces", () => {
  it("shares whole pieces by weight and always adds up", () => {
    expect(splitPieces(10, [6, 3])).toEqual([7, 3]);
    expect(splitPieces(10, [1, 1, 1])).toEqual([4, 3, 3]);
    expect(splitPieces(5, [0, 0])).toEqual([0, 0]);
    expect(splitPieces(0, [1, 2])).toEqual([0, 0]);
    expect(splitPieces(7, [5, 0, 2]).reduce((a, b) => a + b, 0)).toBe(7);
  });
});

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("distrib", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.a = (await post("/warehouses", { name: "Store A" })).body.id;
  id.b = (await post("/warehouses", { name: "Store B" })).body.id;
  id.shirt = (await post("/items", { name: "Allocation Shirt", uomId: pcs, gstRate: "5", saleRate: "1000", purchaseRate: "400", mrp: "1000" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "100", rate: "400" }, { itemId: id.shirt, warehouseId: id.a, qty: "20", rate: "400" }, { itemId: id.shirt, warehouseId: id.b, qty: "20", rate: "400" }] });
  await t.call(c, "PUT", "/pos/settings", { pricesIncludeTax: true });
  for (const k of ["a", "b"]) {
    id[`t${k}`] = (await post("/pos/terminals", { name: `Counter ${k}`, warehouseId: id[k] })).body.id;
    await post("/pos/sessions", { terminalId: id[`t${k}`], openingCash: "0" });
  }
  const sell = (k: string, qty: number) => post("/pos/bills", { terminalId: id[`t${k}`], lines: [{ itemId: id.shirt, qty: String(qty) }], payments: [{ mode: "cash", amount: String(qty * 1000) }] });
  expect((await sell("a", 6)).status).toBe(201);
  expect((await sell("b", 3)).status).toBe(201);
});
afterAll(() => t.close());

describe("branch comparison", () => {
  it("sets the stores side by side with their share of sales and stock", async () => {
    const r = await get(`/reports/branch-comparison?from=${today}&to=${today}`);
    const a = r.rows.find((x: { store: string }) => x.store === "Store A");
    const b = r.rows.find((x: { store: string }) => x.store === "Store B");
    expect(a).toMatchObject({ pieces: "6", bills: 1, stockPieces: "14" });
    expect(b).toMatchObject({ pieces: "3", bills: 1, stockPieces: "17" });
    expect(Number(a.salesSharePct)).toBeCloseTo(66.7, 1);
    expect(r.totals.pieces).toBe("9");
    expect(r.rows[0].store).toBe("Store A"); // the best seller first
  });
});

describe("allocation", () => {
  it("proposes a share by recent demand", async () => {
    const r = await post("/allocations/propose", { fromWarehouseId: id.main, mode: "demand", items: [{ itemId: id.shirt, qty: "10" }] });
    expect(r.status).toBe(200);
    const per = r.body.proposal[0].perStore as { store: string; qty: number }[];
    expect(per.find((x) => x.store === "Store A")!.qty).toBe(7);
    expect(per.find((x) => x.store === "Store B")!.qty).toBe(3);
  });

  it("shares by a ratio you set, and leaves out a store when asked", async () => {
    const r = await post("/allocations/propose", { fromWarehouseId: id.main, mode: "ratio", items: [{ itemId: id.shirt, qty: "10" }], weights: [{ warehouseId: id.a, weight: "1" }, { warehouseId: id.b, weight: "1" }] });
    expect((r.body.proposal[0].perStore as { qty: number }[]).map((x) => x.qty).sort()).toEqual([5, 5]);
    const only = await post("/allocations/propose", { fromWarehouseId: id.main, mode: "ratio", items: [{ itemId: id.shirt, qty: "10" }], weights: [{ warehouseId: id.a, weight: "1" }], exclude: [id.b] });
    expect(only.body.proposal[0].perStore).toHaveLength(1);
    expect(only.body.proposal[0].perStore[0].qty).toBe(10);
  });

  it("dispatches the accepted proposal as transfers in transit", async () => {
    const r = await post("/allocations/dispatch", { fromWarehouseId: id.main, mode: "demand", date: today, items: [{ itemId: id.shirt, qty: "10" }] });
    expect(r.status).toBe(201);
    expect(r.body.transfers).toHaveLength(2);
    expect(await stock(id.shirt, id.main)).toBe(90);
    const transit = await get("/stock-transfers/in-transit");
    expect(JSON.stringify(transit)).toContain("Allocation Shirt");
  });
});
