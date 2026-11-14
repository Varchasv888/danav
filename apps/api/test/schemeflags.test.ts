import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const month = businessDate().slice(0, 7);

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const scheme = (over: Record<string, unknown>) => post("/schemes", { name: "S", kind: "percent", pct: "10", ...over });
const bill = (lines: Record<string, unknown>[], pay: string) => post("/pos/bills", { terminalId: id.t1, lines, payments: [{ mode: "cash", amount: pay }] });
// There is no delete: an old offer is switched off, keeping its name and rules.
const clearSchemes = async () => {
  for (const s of (await get("/schemes")) as { id: string; name: string; kind: string; pct: string | null; minValue: string | null; active: boolean }[]) {
    if (s.active) await t.call(c, "PUT", `/schemes/${s.id}`, { name: s.name, kind: s.kind, pct: s.pct ?? undefined, minValue: s.minValue ?? undefined, active: false });
  }
};

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("schemeflags", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.red = (await post("/colors", { name: "Red" })).body.id;
  const s = (await post("/styles", { code: "SF-1", name: "Flag Shirt", uomId: pcs, colorIds: [id.red], sizes: ["M"], saleRate: "1000", purchaseRate: "400", mrp: "1000", gstRate: "5" })).body;
  id.shirt = ((await get(`/styles/${s.id}`)).variants as { id: string }[])[0]!.id;
  await post("/stock-journals", { kind: "adjustment", date: businessDate(), lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "100", rate: "400", direction: "in" }] });
  await t.call(c, "PUT", "/pos/settings", { pricesIncludeTax: true, allowLineDiscount: true });
  id.t1 = (await post("/pos/terminals", { name: "Counter" })).body.id;
  await post("/pos/sessions", { terminalId: id.t1, openingCash: "0" });
  id.meera = (await post("/employees", { name: "Meera S", gender: "female", joinedOn: "2026-01-01", workState: "27", components: [{ code: "BASIC", name: "Basic", monthly: "15000", pfWage: true }] })).body.id;
  await post("/salesman-commission/rules", { name: "Flat", kind: "all", ratePct: "10" });
});
afterAll(() => t.close());

describe("apply on items already discounted", () => {
  it("leaves a discounted line alone by default, and adds to its discount when the offer says so", async () => {
    await clearSchemes();
    expect((await scheme({ name: "Plain 10%" })).status).toBe(201);
    let r = await bill([{ itemId: id.shirt, qty: "1", discount: "100" }], "900");
    expect(r.status).toBe(201);
    expect((await get(`/pos/bills/${r.body.id}`)).lines[0].discount).toBe("100.00");

    await clearSchemes();
    expect((await scheme({ name: "Also on discounted", applyOnDiscounted: true })).status).toBe(201);
    r = await bill([{ itemId: id.shirt, qty: "1", discount: "100" }], "810");
    expect(r.status).toBe(201);
    // 10% of what is left after the 100 discount, added to it.
    expect((await get(`/pos/bills/${r.body.id}`)).lines[0].discount).toBe("190.00");
  });
});

describe("offers stated with tax", () => {
  it("counts the tax toward the minimum when prices are entered without tax", async () => {
    await clearSchemes();
    await t.call(c, "PUT", "/pos/settings", { pricesIncludeTax: false });
    // 900 plus 5% is 945: a 1000 minimum is not reached, either way.
    expect((await scheme({ name: "Min 1000", minValue: "1000", inclusiveOfTax: true })).status).toBe(201);
    let r = await bill([{ itemId: id.shirt, qty: "1", price: "900" }], "945");
    expect((await get(`/pos/bills/${r.body.id}`)).lines[0].discount).toBe("0.00");
    // 1000 plus 5% is 1050: reaches it as a tax-inclusive minimum, though 1000 alone only just does; use 960 to separate the two readings.
    await clearSchemes();
    expect((await scheme({ name: "Min 1000 with tax", minValue: "1000", inclusiveOfTax: true })).status).toBe(201);
    r = await bill([{ itemId: id.shirt, qty: "1", price: "960" }], "907.2");
    expect((await get(`/pos/bills/${r.body.id}`)).lines[0].discount).toBe("96.00"); // 960 plus 5% is 1008
    await clearSchemes();
    expect((await scheme({ name: "Min 1000 before tax", minValue: "1000" })).status).toBe(201);
    r = await bill([{ itemId: id.shirt, qty: "1", price: "960" }], "1008");
    expect((await get(`/pos/bills/${r.body.id}`)).lines[0].discount).toBe("0.00");
    await t.call(c, "PUT", "/pos/settings", { pricesIncludeTax: true });
  });
});

describe("commission basis", () => {
  it("works commission on the price paid, the price before the offer, or nothing", async () => {
    const commission = async () => Number(((await get(`/salesman-commission/report?month=${month}`)).salesmen[0]?.commission) ?? 0);
    await clearSchemes();
    const before = await commission();
    expect((await scheme({ name: "Net", pct: "20" })).status).toBe(201);
    expect((await bill([{ itemId: id.shirt, qty: "1", salesmanId: id.meera }], "800")).status).toBe(201);
    const afterNet = await commission();
    // 800 paid, 761.90 taxable, 10% commission.
    expect(afterNet - before).toBeCloseTo(76.19, 2);

    await clearSchemes();
    expect((await scheme({ name: "List", pct: "20", commissionBasis: "list" })).status).toBe(201);
    expect((await bill([{ itemId: id.shirt, qty: "1", salesmanId: id.meera }], "800")).status).toBe(201);
    const afterList = await commission();
    // Commission on the price before the offer: 1000, 952.38 taxable, 10%.
    expect(afterList - afterNet).toBeCloseTo(95.24, 2);

    await clearSchemes();
    expect((await scheme({ name: "None", pct: "20", commissionBasis: "none" })).status).toBe(201);
    expect((await bill([{ itemId: id.shirt, qty: "1", salesmanId: id.meera }], "800")).status).toBe(201);
    expect(await commission()).toBeCloseTo(afterList, 2);
    expect((await scheme({ name: "Bad", commissionBasis: "other" })).status).toBe(400);
  });
});
