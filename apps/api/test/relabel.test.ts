import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("relabel", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.a = (await post("/items", { name: "Old Blue Shirt", uomId: pcs, gstRate: "5", saleRate: "800", mrp: "999", barcode: "8902222222222" })).body.id;
  id.b = (await post("/items", { name: "Plain Kurta", uomId: pcs, gstRate: "5", saleRate: "600", mrp: "799" })).body.id;
});
afterAll(() => t.close());

describe("re-labelling", () => {
  it("changes names, colours, sizes and prices on one numbered voucher that keeps the old values, and leaves the barcode alone", async () => {
    const r = await post("/relabels", { date: "2026-10-12", reason: "Reclassified after the season", changes: [{ itemId: id.a, name: "Navy Shirt", color: "Navy", mrp: "1199", saleRate: "899" }, { itemId: id.b, size: "L" }] });
    expect(r.status).toBe(201);
    expect(r.body.number).toMatch(/^RL\//);
    const detail = await get(`/relabels/${r.body.id}`);
    expect(detail.changes.find((x: { itemId: string }) => x.itemId === id.a)).toMatchObject({
      before: { name: "Old Blue Shirt", color: null, mrp: "999.00", saleRate: "800.00" }, after: { name: "Navy Shirt", color: "Navy", mrp: "1199.00", saleRate: "899.00" }, barcode: "8902222222222",
    });
    const it = await get(`/items/${id.a}`);
    expect(it).toMatchObject({ name: "Navy Shirt", color: "Navy", barcode: "8902222222222", size: null, mrp: "1199.00" });
    expect((await get("/relabels"))).toHaveLength(1);
  });

  it("refuses an empty change, a name already used, and a voucher with nothing different", async () => {
    expect((await post("/relabels", { date: "2026-10-13", reason: "Nothing", changes: [{ itemId: id.a, color: "Navy" }] })).body.error).toBe("nothing_changed");
    expect((await post("/relabels", { date: "2026-10-13", reason: "Clash", changes: [{ itemId: id.b, name: "Navy Shirt" }] })).body.error).toBe("item_name_taken");
    expect((await post("/relabels", { date: "2026-10-13", reason: "Twice", changes: [{ itemId: id.a, size: "L" }, { itemId: id.a, size: "XL" }] })).body.error).toBe("item_twice");
    expect((await post("/relabels", { date: "2026-10-13", reason: "ab", changes: [{ itemId: id.a, size: "L" }] })).status).toBe(400);
  });
});
