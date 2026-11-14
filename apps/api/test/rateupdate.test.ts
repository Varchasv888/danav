import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const update = (over: Record<string, unknown> = {}) => post("/inventory/rate-update", {
  scope: { brand: "Varsha" }, field: "saleRate", mode: "percent", value: "10", round: "none", preview: false, ...over,
});
const rate = async (itemId: string, field = "saleRate") => (await t.call(c, "GET", `/items/${itemId}`)).body[field] as string;
const styleRate = async (styleId: string) => (await t.call(c, "GET", `/styles/${styleId}`)).body.saleRate as string;

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("rates")).cookie;
  id.pcs = ((await t.call(c, "GET", "/inventory/setup")).body.uoms as { id: string; code: string }[]).find((u) => u.code === "PCS")!.id;
  id.red = (await post("/colors", { name: "Red" })).body.id;
  const make = async (code: string, brand: string, saleRate: string, mrp?: string) => {
    const s = (await post("/styles", { code, name: `Style ${code}`, uomId: id.pcs, colorIds: [id.red], sizes: ["M", "L"], saleRate, brand, ...(mrp ? { mrp } : {}) })).body;
    return s;
  };
  id.a = (await make("RU-A", "Varsha", "1000", "1500")).id;
  id.b = (await make("RU-B", "Varsha", "999")).id;
  id.c = (await make("RU-C", "Other", "500")).id;
  const items = async (styleId: string) => ((await t.call(c, "GET", `/styles/${styleId}`)).body.variants ?? []) as { id: string }[];
  id.aItem = (await items(id.a))[0]!.id;
  id.bItem = (await items(id.b))[0]!.id;
  id.cItem = (await items(id.c))[0]!.id;
});
afterAll(() => t.close());

describe("rate updation", () => {
  it("previews without changing anything", async () => {
    const r = await update({ preview: true });
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ applied: false, matched: 4, changed: 4 });
    expect(r.body.rows.find((x: { itemId: string }) => x.itemId === id.aItem)).toMatchObject({ old: "1000.00", new: "1100.00" });
    expect(await rate(id.aItem)).toBe("1000.0000");
  });

  it("raises a brand by a percent and moves the style rate the same way, leaving other brands alone", async () => {
    const r = await update({ round: "ends9" });
    expect(r.body).toMatchObject({ applied: true, changed: 4 });
    expect(await rate(id.aItem)).toBe("1099.0000"); // 1100 rounded up to the next 9
    expect(await rate(id.bItem)).toBe("1099.0000"); // 1098.90 rounds up to 1099
    expect(await styleRate(id.a)).toBe("1099.0000");
    expect(await rate(id.cItem)).toBe("500.0000");
  });

  it("changes by an amount or to a set rate, with rounding", async () => {
    await update({ scope: { styleId: id.c }, mode: "amount", value: "-23", round: "5" });
    expect(await rate(id.cItem)).toBe("475.0000");
    await update({ scope: { styleId: id.c }, mode: "set", value: "450", round: "none" });
    expect(await rate(id.cItem)).toBe("450.0000");
  });

  it("will not take a sale rate above the MRP, but MRP itself can rise", async () => {
    const over = await update({ scope: { styleId: id.a }, mode: "percent", value: "50", round: "none" });
    expect(over.body.error).toBe("above_mrp");
    expect(await rate(id.aItem)).toBe("1099.0000");
    expect((await update({ scope: { styleId: id.a }, field: "mrp", mode: "percent", value: "50" })).status).toBe(200);
    expect(await rate(id.aItem, "mrp")).toBe("2250.00");
    expect((await update({ scope: { styleId: id.a }, mode: "percent", value: "50" })).status).toBe(200);
  });

  it("needs a scope and a sensible value, and keeps businesses apart", async () => {
    expect((await update({ scope: {} })).body.error).toBe("scope_required");
    expect((await update({ mode: "set", value: "0" })).body.error).toBe("invalid_value");
    expect((await update({ mode: "percent", value: "-150" })).body.error).toBe("invalid_value");
    const other = (await t.signup("rates-other")).cookie;
    const r = await t.call(other, "POST", "/inventory/rate-update", { scope: { all: true }, field: "saleRate", mode: "percent", value: "10", round: "none", preview: false });
    expect(r.body).toMatchObject({ matched: 0, changed: 0 });
  });
});
