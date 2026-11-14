import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const byCode = async (code: string) => t.call(c, "GET", `/items/by-code?code=${encodeURIComponent(code)}`);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("barcodes")).cookie;
  const setup = await get("/inventory/setup");
  const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  const item = async (name: string, extra: Record<string, unknown> = {}) => (await post("/items", { name, hsn: "6205", gstRate: "5", uomId: pcs, saleRate: "500", ...extra })).body.id as string;
  id.shirt = await item("Linen Shirt", { barcode: "1001", sku: "LS-1" });
  id.other = await item("Other Shirt", { barcode: "2002" });
  id.dup = await item("Linen Shirt Old", { barcode: "3003" });
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.supplier = (await post("/accounts", { name: "Surat Mills", groupId: groups.find((g) => g.key === "sundry_creditors")!.id, stateCode: "24" })).body.id;
});
afterAll(() => t.close());

describe("other barcodes", () => {
  it("lets an item answer to a supplier's code as well as its own", async () => {
    const r = await post(`/items/${id.shirt}/barcodes`, { code: "SM-77-L", kind: "supplier", supplierId: id.supplier });
    expect(r.status).toBe(201);
    expect((await byCode("SM-77-L")).body.itemId).toBe(id.shirt);
    expect((await byCode("1001")).body.itemId).toBe(id.shirt);
    expect((await byCode("ls-1")).body.itemId).toBe(id.shirt);
    expect((await byCode("nothing")).status).toBe(404);
    const list = await get(`/items/${id.shirt}/barcodes`);
    expect(list).toEqual([expect.objectContaining({ code: "SM-77-L", kind: "supplier", supplier: "Surat Mills" })]);
    expect(((await get("/items")) as { id: string; aliases: string[] }[]).find((i) => i.id === id.shirt)!.aliases).toEqual(["SM-77-L"]);
  });

  it("refuses a code that already belongs to something else", async () => {
    expect((await post(`/items/${id.other}/barcodes`, { code: "SM-77-L" })).body.error).toBe("code_in_use");
    expect((await post(`/items/${id.other}/barcodes`, { code: "1001" })).body.error).toBe("code_in_use");
    expect((await post(`/items/${id.shirt}/barcodes`, { code: "SM-77-L" })).body.error).toBe("code_already_on_item");
    expect((await post(`/items/${id.shirt}/barcodes`, { code: "has space" })).body.error).toBe("invalid_code");
  });

  it("keeps a merged duplicate's barcode working as an alias of the item kept", async () => {
    await post(`/items/${id.dup}/barcodes`, { code: "OLD-LABEL" });
    const m = await post(`/items/${id.dup}/merge`, { intoId: id.shirt });
    expect(m.status).toBe(200);
    expect((await byCode("3003")).body.itemId).toBe(id.shirt);
    expect((await byCode("OLD-LABEL")).body.itemId).toBe(id.shirt);
    expect((await get(`/items/${id.shirt}/barcodes`)).map((a: { kind: string }) => a.kind).sort()).toEqual(["alternate", "merged", "supplier"]);
  });

  it("can drop a code, and keeps businesses apart", async () => {
    const list = await get(`/items/${id.shirt}/barcodes`);
    const mine = list.find((a: { code: string }) => a.code === "OLD-LABEL");
    expect((await t.call(c, "DELETE", `/items/barcodes/${mine.id}`)).status).toBe(200);
    expect((await byCode("OLD-LABEL")).status).toBe(404);
    const other = (await t.signup("barcodes-other")).cookie;
    expect((await t.call(other, "GET", "/items/by-code?code=SM-77-L")).status).toBe(404);
    expect((await t.call(other, "DELETE", `/items/barcodes/${list[0].id}`)).status).toBe(404);
  });
});
