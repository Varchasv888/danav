import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const bill = (items: string[], extra: Record<string, unknown> = {}, pay?: string) =>
  post("/pos/bills", { terminalId: id.t1, lines: items.map((i) => ({ itemId: id[i], qty: "1" })), payments: [{ mode: "cash", amount: pay ?? "5000" }], ...extra });
const scheme = (name: string, extra: Record<string, unknown>) => post("/schemes", { name, kind: "percent", pct: "10", ...extra });

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("schemelists", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.red = (await post("/colors", { name: "Red" })).body.id;
  const style = async (code: string, brand: string, category: string, fabric: string) => {
    const s = (await post("/styles", { code, name: `Style ${code}`, uomId: pcs, colorIds: [id.red], sizes: ["M"], saleRate: "1000", brand, category, attributes: { fabric } })).body;
    return ((await get(`/styles/${s.id}`)).variants as { id: string }[])[0]!.id;
  };
  id.cottonA = await style("SL-1", "Varsha", "Shirts", "Cotton");
  id.linenA = await style("SL-2", "Varsha", "Shirts", "Linen");
  id.cottonB = await style("SL-3", "Other", "Trousers", "Cotton");
  await post("/stock-journals", { kind: "opening", lines: ["cottonA", "linenA", "cottonB"].map((k) => ({ itemId: id[k], warehouseId: id.main, qty: "50", rate: "400" })) });
  id.t1 = (await post("/pos/terminals", { name: "Counter" })).body.id;
  await post("/pos/sessions", { terminalId: id.t1, openingCash: "0" });
});
afterAll(() => t.close());

const covered = async (name: string) => ((await get("/pos/schemes")) as { name: string; itemIds: string[] | null }[]).find((s) => s.name === name)!.itemIds;

describe("include and exclude lists", () => {
  it("covers styles by a style attribute such as fabric", async () => {
    expect((await scheme("Cotton week", { scope: { attrs: { fabric: ["cotton"] } } })).status).toBe(201);
    expect((await covered("Cotton week"))!.sort()).toEqual([id.cottonA, id.cottonB].sort());
  });

  it("leaves out brands, categories and attributes from what it covers", async () => {
    await scheme("Varsha less linen", { scope: { brands: ["Varsha"], exclude: { attrs: { fabric: ["Linen"] } } } });
    expect(await covered("Varsha less linen")).toEqual([id.cottonA]);
    await scheme("Shirts not Varsha", { scope: { categories: ["Shirts"], exclude: { brands: ["varsha"] } } });
    expect(await covered("Shirts not Varsha")).toEqual([]);
  });

  it("with only exclusions covers everything else", async () => {
    await scheme("All but trousers", { scope: { exclude: { categories: ["Trousers"] } } });
    expect((await covered("All but trousers"))!.sort()).toEqual([id.cottonA, id.linenA].sort());
  });
});

describe("offer flags at the counter", () => {
  it("applies an offer only when the cashier says yes, if it asks first", async () => {
    await scheme("Ask me", { pct: "30", scope: { itemIds: [id.cottonA] }, confirmBeforeApply: true });
    const schemeId = ((await get("/pos/schemes")) as { id: string; name: string }[]).find((s) => s.name === "Ask me")!.id;
    const without = await bill(["cottonA"], {}, "1000");
    expect(without.body.discount ?? "0.00").toBe("0.00");
    expect(without.body.schemes.some((s: { name: string }) => s.name === "Ask me")).toBe(false);
    const withYes = await bill(["cottonA"], { confirmedSchemes: [schemeId] }, "700");
    expect(withYes.body.schemes.some((s: { name: string }) => s.name === "Ask me")).toBe(true);
  });

  it("keeps an offer off bills that use a discount card or coupon when it does not allow them", async () => {
    await scheme("No stacking", { pct: "30", scope: { itemIds: [id.linenA] }, allowWithCustomerDiscount: false });
    const coupon = await post("/coupons", { code: "WELCOME5", kind: "amount", value: "5", startsOn: "2020-01-01", endsOn: "2099-12-31" });
    expect(coupon.status).toBe(201);
    const r = await bill(["linenA"], { couponCode: "WELCOME5" }, "995");
    expect(r.status).toBe(201);
    expect(r.body.schemes.some((s: { name: string }) => s.name === "No stacking")).toBe(false);
    const plain = await bill(["linenA"], {}, "700");
    expect(plain.body.schemes.some((s: { name: string }) => s.name === "No stacking")).toBe(true);
  });

  it("refuses to return goods bought on an offer that does not allow returns", async () => {
    await scheme("Final sale", { pct: "30", scope: { itemIds: [id.cottonB] }, allowReturns: false });
    const r = await bill(["cottonB"], {}, "700");
    expect(r.status).toBe(201);
    const lineId = ((await get(`/pos/bills/lookup?number=${encodeURIComponent(r.body.number)}`)).lines as { id: string }[])[0]!.id;
    const back = await post("/pos/returns", { billId: r.body.id, terminalId: id.t1, refundMode: "cash", lines: [{ lineId, qty: "1", reason: "size", grade: "A" }] });
    expect(back.body.error).toBe("offer_no_return");
  });
});
