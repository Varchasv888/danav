import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
let other: string;
const id: Record<string, string> = {};

const get = async (cookie: string, url: string) => (await t.call(cookie, "GET", url)).body;

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("limits")).cookie;
  other = (await t.signup("limits-other")).cookie;
  const setup = await get(c, "/inventory/setup");
  const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.main = setup.warehouses[0].id;
  id.shirt = (await t.call(c, "POST", "/items", { name: "Limit Shirt", uomId: pcs, saleRate: "500" })).body.id;
  id.belt = (await t.call(c, "POST", "/items", { name: "Limit Belt", uomId: pcs, saleRate: "300" })).body.id;
  await t.call(c, "POST", "/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "4", rate: "200" }] });
});
afterAll(() => t.close());

describe("minimum and maximum stock per warehouse", () => {
  it("lists every item with its stock and flags the ones under their minimum", async () => {
    const put = await t.call(c, "PUT", `/stock-limits/${id.main}`, { rows: [{ itemId: id.shirt, minQty: "10", maxQty: "40" }, { itemId: id.belt, minQty: "0", maxQty: "0" }] });
    expect(put.body.saved).toBe(2);
    const rows: { id: string; qty: string; minQty: string; maxQty: string; below: boolean }[] = await get(c, `/stock-limits?warehouseId=${id.main}`);
    const shirt = rows.find((r) => r.id === id.shirt)!;
    expect(Number(shirt.qty)).toBe(4);
    expect([Number(shirt.minQty), Number(shirt.maxQty), shirt.below]).toEqual([10, 40, true]);
    expect(rows.find((r) => r.id === id.belt)!.below).toBe(false);
  });

  it("stops being flagged when stock reaches the minimum, and clears a row set back to zero", async () => {
    await t.call(c, "PUT", `/stock-limits/${id.main}`, { rows: [{ itemId: id.shirt, minQty: "3", maxQty: "40" }] });
    expect((await get(c, `/stock-limits?warehouseId=${id.main}`)).find((r: { id: string }) => r.id === id.shirt).below).toBe(false);
    await t.call(c, "PUT", `/stock-limits/${id.main}`, { rows: [{ itemId: id.shirt, minQty: "0", maxQty: "0" }] });
    const row = (await get(c, `/stock-limits?warehouseId=${id.main}`)).find((r: { id: string }) => r.id === id.shirt);
    expect([Number(row.minQty), Number(row.maxQty)]).toEqual([0, 0]);
  });

  it("refuses a maximum under the minimum and another business's warehouse or items", async () => {
    const bad = await t.call(c, "PUT", `/stock-limits/${id.main}`, { rows: [{ itemId: id.shirt, minQty: "10", maxQty: "5" }] });
    expect(bad.body.error).toBe("max_below_min");
    expect((await t.call(other, "GET", `/stock-limits?warehouseId=${id.main}`)).status).toBe(404);
    expect((await t.call(other, "PUT", `/stock-limits/${id.main}`, { rows: [{ itemId: id.shirt, minQty: "1", maxQty: "2" }] })).status).toBe(404);
  });
});
