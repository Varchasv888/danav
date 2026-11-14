import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const put = (url: string, body: unknown) => t.call(c, "PUT", url, body);
const patch = (url: string, body: unknown) => t.call(c, "PATCH", url, body);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("itemcodes", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  id.pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.sup = (await post("/accounts", { name: "Band Supplier", groupId: ((await get("/accounts/groups")) as { id: string; key: string }[]).find((g) => g.key === "sundry_creditors")!.id, stateCode: "27" })).body.id;
});
afterAll(() => t.close());

describe("default quantity and short code", () => {
  it("keeps a default quantity and a short code on the item, and finds the item by the short code", async () => {
    const r = await post("/items", { name: "Sock six pack", uomId: id.pcs, gstRate: "5", saleRate: "300", barcode: "8901111111111", defaultQty: "6", shortCode: "ss6" });
    expect(r.status).toBe(201);
    id.sock = r.body.id;
    expect(r.body).toMatchObject({ defaultQty: "6.0000", shortCode: "ss6" });
    const found = await get("/items/by-code?code=SS6");
    expect(found.itemId).toBe(id.sock);
  });

  it("will not give two items the same short code, or a code with odd characters", async () => {
    expect((await post("/items", { name: "Another sock", uomId: id.pcs, gstRate: "5", saleRate: "100", shortCode: "SS6" })).body.error).toBe("short_code_taken");
    expect((await post("/items", { name: "Odd code", uomId: id.pcs, gstRate: "5", saleRate: "100", shortCode: "no spaces!" })).status).toBe(400);
    expect((await patch(`/items/${id.sock}`, { shortCode: null })).status).toBeLessThan(400);
  });
});

describe("margin bands", () => {
  it("saves a table of bands and prices a cost from the band it falls in", async () => {
    const bands = [
      { fromRate: "0", markupPct: "100", markdown1Pct: "10", markdown2Pct: "20" },
      { fromRate: "500", markupPct: "80", markdown1Pct: "10", markdown2Pct: "25" },
    ];
    expect((await put("/margin-bands", { bands })).body).toHaveLength(2);
    expect(await get("/margin-bands/price?cost=600")).toMatchObject({ mrp: "1089.00", sale1: "980.00", sale2: "817.00", band: { markupPct: "80.00" } });
    expect(await get("/margin-bands/price?cost=200")).toMatchObject({ mrp: "409.00" }); // 200 + 100% = 400, up to 409
  });

  it("refuses bands that repeat a start or whose second mark-down is smaller than the first", async () => {
    expect((await put("/margin-bands", { bands: [{ fromRate: "0", markupPct: "50", markdown1Pct: "10", markdown2Pct: "5" }] })).body.error).toBe("second_markdown_smaller");
    expect((await put("/margin-bands", { bands: [{ fromRate: "0", markupPct: "50", markdown1Pct: "0", markdown2Pct: "0" }, { fromRate: "0", markupPct: "60", markdown1Pct: "0", markdown2Pct: "0" }] })).body.error).toBe("duplicate_band");
  });

  it("a receipt line can set the MRP and the sale rate on the item, which stays in the audit trail", async () => {
    const item = (await post("/items", { name: "Band shirt", uomId: id.pcs, gstRate: "5", saleRate: "500", purchaseRate: "600" })).body.id as string;
    const r = await post("/goods-receipts", { supplierId: id.sup, date: "2026-10-10", lines: [{ itemId: item, qty: "10", rate: "600", mrp: "1089", saleRate: "980" }] });
    expect(r.status).toBe(201);
    const it = await get(`/items/${item}`);
    expect(it).toMatchObject({ mrp: "1089.00", saleRate: "980.0000" });
  });
});

describe("generating barcodes for items that have none", () => {
  it("gives in-store EAN-13 codes in order to goods without one, and never changes one that exists", async () => {
    const a = (await post("/items", { name: "No code A", uomId: id.pcs, gstRate: "5", saleRate: "100" })).body.id as string;
    const b = (await post("/items", { name: "No code B", uomId: id.pcs, gstRate: "5", saleRate: "100" })).body.id as string;
    const keep = (await post("/items", { name: "Has code", uomId: id.pcs, gstRate: "5", saleRate: "100", barcode: "8903333333333" })).body.id as string;
    const r = await post("/items/barcodes/generate", { itemIds: [a, b, keep] });
    expect(r.status).toBe(200);
    expect(r.body.assigned).toBe(2);
    const ca = (await get(`/items/${a}`)).barcode as string;
    const cb = (await get(`/items/${b}`)).barcode as string;
    expect(ca).toMatch(/^2\d{12}$/);
    expect(Number(cb.slice(1, 12))).toBe(Number(ca.slice(1, 12)) + 1);
    expect((await get(`/items/${keep}`)).barcode).toBe("8903333333333");
    expect((await post("/items/barcodes/generate", { itemIds: [a, b] })).body.assigned).toBe(0);
  });
});
