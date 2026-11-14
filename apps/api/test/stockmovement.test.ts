import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const day = (offset: number) => businessDate(new Date(Date.now() + offset * 86_400_000));

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const sale = (itemId: string, qty: string, date: string) => post("/sales-invoices", { customerId: id.shop, date, lines: [{ itemId, qty, rate: "700" }] });
type Row = { name: string; class: string; soldQty: string; stockQty: string; lastSold: string | null; daysSinceSale: number | null };
const movement = async (qs = "") => get(`/reports/stock-movement?all=1${qs}`) as Promise<{ summary: { class: string; items: number; pieces: string }[]; rows: Row[] }>;

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("movement", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.shop = (await post("/accounts", { name: "Movement Shop", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  const uom = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  const lines: { itemId: string; warehouseId: string; qty: string; rate: string }[] = [];
  for (const [key, name] of [["fast", "Fast Kurta"], ["slow", "Slow Kurta"], ["none", "Never Sold Kurta"], ["old", "Old Sale Kurta"]] as const) {
    id[key] = (await post("/items", { name, hsn: "6204", gstRate: "5", uomId: uom, saleRate: "700" })).body.id;
    lines.push({ itemId: id[key]!, warehouseId: id.main, qty: "50", rate: "400" });
  }
  await post("/stock-journals", { kind: "opening", lines });
  await sale(id.fast, "12", day(-5));
  await sale(id.slow, "3", day(-20));
  await sale(id.old, "5", day(-150));
});
afterAll(() => t.close());

describe("fast, slow and non-moving stock", () => {
  it("classes each item by what it sold in the window and puts what does not move first", async () => {
    const r = await movement();
    const by = Object.fromEntries(r.rows.map((x) => [x.name, x]));
    expect(by["Fast Kurta"]).toMatchObject({ class: "fast", soldQty: "12", stockQty: "38" });
    expect(by["Slow Kurta"]).toMatchObject({ class: "slow", soldQty: "3" });
    expect(by["Never Sold Kurta"]).toMatchObject({ class: "none", soldQty: "0", lastSold: null, daysSinceSale: null });
    expect(by["Old Sale Kurta"]).toMatchObject({ class: "none", soldQty: "0", daysSinceSale: 150 });
    expect(r.rows.map((x) => x.class)).toEqual(["none", "none", "slow", "fast"]);
    expect(r.summary.map((s) => [s.class, s.items])).toEqual([["fast", 1], ["slow", 1], ["none", 2]]);
  });

  it("moves the line when the bands change", async () => {
    const wide = await movement("&days=180&fastMin=5");
    expect(Object.fromEntries(wide.rows.map((x) => [x.name, x.class]))).toMatchObject({ "Fast Kurta": "fast", "Slow Kurta": "slow", "Old Sale Kurta": "fast" });
    const strict = await movement("&fastMin=20");
    expect(strict.rows.find((x) => x.name === "Fast Kurta")!.class).toBe("slow");
  });

  it("refuses silly bands and keeps businesses apart", async () => {
    expect((await t.call(c, "GET", "/reports/stock-movement?days=2")).status).toBe(400);
    const other = (await t.signup("movement-other")).cookie;
    expect(((await t.call(other, "GET", "/reports/stock-movement?all=1")).body as { rows: unknown[] }).rows).toEqual([]);
  });
});
