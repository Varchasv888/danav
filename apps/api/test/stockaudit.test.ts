import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const stock = async (itemId: string) => Number(((await get(`/reports/stock-summary?asOf=${today}`)).rows as { itemId: string; qty: string }[]).find((r) => r.itemId === itemId)?.qty ?? 0);
const countAll = async (name: string, counts: Record<string, string>, extra: Record<string, unknown> = {}) => {
  const created = await post("/stock-counts", { warehouseId: id.main, name, blind: false, ...extra });
  expect(created.status).toBe(201);
  const countId = created.body.id as string;
  for (const [k, qty] of Object.entries(counts)) await post(`/stock-counts/${countId}/scan`, { code: id[`${k}Code`], qty, set: true });
  expect((await post(`/stock-counts/${countId}/submit`, {})).status).toBe(200);
  return countId;
};

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("audit")).cookie;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  const lines = [];
  for (const [key, name, code] of [["a", "Audit Shirt A", "8900000011"], ["b", "Audit Shirt B", "8900000012"], ["c", "Audit Shirt C", "8900000013"]] as const) {
    const r = (await post("/items", { name, uomId: pcs, saleRate: "500", barcode: code })).body;
    id[key] = r.id; id[`${key}Code`] = code;
    lines.push({ itemId: r.id, warehouseId: id.main, qty: "10", rate: "300" });
  }
  await post("/stock-journals", { kind: "opening", lines });
});
afterAll(() => t.close());

describe("spot checks and the stock audit", () => {
  it("counts a chosen list of items only, and leaves the books alone when it is a spot check", async () => {
    const spot = await countAll("Spot check", { a: "8", b: "10" }, { verifyOnly: true, scope: { itemIds: [id.a, id.b] } });
    const detail = await get(`/stock-counts/${spot}`);
    expect(detail.lines).toHaveLength(2);
    expect((await post(`/stock-counts/${spot}/approve`, { reason: "Checked" })).body.journalId).toBeNull();
    expect(await stock(id.a)).toBe(10); // short by 2, but a spot check does not adjust
  });

  it("an ordinary count adjusts stock when approved", async () => {
    const full = await countAll("Full count", { a: "9", b: "10", c: "12" });
    const approval = await post(`/stock-counts/${full}/approve`, { reason: "Count" });
    expect(approval.status).toBe(200);
    expect(approval.body.journalId).toBeTruthy();
    const savedCount = await get(`/stock-counts/${full}`);
    expect(savedCount.journalId).toBe(approval.body.journalId);
    const adjustment = await get(`/stock-journals/${approval.body.journalId}`);
    expect(adjustment).toMatchObject({ kind: "adjustment", narration: expect.stringContaining("Stock count") });
    expect(adjustment.lines).toEqual(expect.arrayContaining([
      expect.objectContaining({ itemId: id.a, qtyOut: "1.0000" }),
      expect.objectContaining({ itemId: id.c, qtyIn: "2.0000" }),
    ]));
    expect(await stock(id.a)).toBe(9);
    expect(await stock(id.c)).toBe(12);
  });

  it("reports how accurate the books were, and what is short again and again", async () => {
    // A third count finds A short once more.
    const again = await countAll("Second count", { a: "7", b: "10", c: "12" });
    await post(`/stock-counts/${again}/approve`, { reason: "Count" });
    const r = await get(`/reports/stock-audit?from=${today}&to=${today}`);
    expect(r.counts).toHaveLength(3);
    const spot = r.counts.find((x: { name: string }) => x.name === "Spot check");
    expect(spot).toMatchObject({ spotCheck: true, shortPieces: "2", shortValue: "600.00" });
    const full = r.counts.find((x: { name: string }) => x.name === "Full count");
    expect(full).toMatchObject({ shortPieces: "1", excessPieces: "2", shortValue: "300.00", excessValue: "600.00", netValue: "300.00" });
    expect(Number(full.accuracyPct)).toBeCloseTo(90, 0);
    expect(r.repeatedShortages.map((x: { item: string }) => x.item)).toEqual(["Audit Shirt A"]);
    expect(r.repeatedShortages[0].counts).toBe(3);
  });
});
