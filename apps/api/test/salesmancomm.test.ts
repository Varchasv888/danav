import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const month = businessDate().slice(0, 7);

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const rule = (over: Record<string, unknown>) => post("/salesman-commission/rules", { name: "R", kind: "all", ratePct: "1", ...over });
const report = async () => (await get(`/salesman-commission/report?month=${month}`)) as {
  totalCommission: string; salesmen: { name: string; sales: string; commission: string; uncovered: string; rules: { name: string; sales: string; commission: string }[] }[];
};
const sell = (salesmanId: string, itemId: string, qty: string, price: string) => post("/pos/bills", {
  terminalId: id.t1, lines: [{ itemId, qty, salesmanId }], payments: [{ mode: "cash", amount: String(Number(price) * Number(qty)) }],
});

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("salescomm", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.red = (await post("/colors", { name: "Red" })).body.id;
  const style = async (code: string, brand: string, saleRate: string, mrp: string) => {
    const s = (await post("/styles", { code, name: `Style ${code}`, uomId: pcs, colorIds: [id.red], sizes: ["M", "L"], saleRate, mrp, brand, gstRate: "5" })).body;
    return ((await get(`/styles/${s.id}`)).variants as { id: string; size: string }[]);
  };
  const varsha = await style("SC-V", "Varsha", "1000", "1000");
  const other = await style("SC-O", "Other", "500", "500");
  id.vM = varsha.find((v) => v.size === "M")!.id;
  id.vL = varsha.find((v) => v.size === "L")!.id;
  id.oM = other[0]!.id;
  await post("/stock-journals", { kind: "opening", lines: [id.vM, id.vL, id.oM].map((itemId) => ({ itemId, warehouseId: id.main, qty: "50", rate: "300" })) });
  await t.call(c, "PUT", "/pos/settings", { pricesIncludeTax: true });
  id.t1 = (await post("/pos/terminals", { name: "Counter" })).body.id;
  await post("/pos/sessions", { terminalId: id.t1, openingCash: "0" });
  id.meera = (await post("/employees", { name: "Meera S", gender: "female", joinedOn: "2026-01-01", workState: "27", components: [{ code: "BASIC", name: "Basic", monthly: "15000", pfWage: true }] })).body.id;
  id.ravi = (await post("/employees", { name: "Ravi K", gender: "male", joinedOn: "2026-01-01", workState: "27", components: [{ code: "BASIC", name: "Basic", monthly: "15000", pfWage: true }] })).body.id;
});
afterAll(() => t.close());

describe("salesman commission rules", () => {
  it("validates rules", async () => {
    expect((await rule({ ratePct: "150" })).body.error).toBe("invalid_rate");
    expect((await rule({ kind: "brand" })).body.error).toBe("match_required");
    expect((await rule({ kind: "item" })).body.error).toBe("item_required");
    expect((await rule({ kind: "mrp_range" })).body.error).toBe("range_required");
    expect((await rule({ kind: "mrp_range", mrpFrom: "600", mrpTo: "400" })).body.error).toBe("range_reversed");
  });

  it("pays the most specific rule: item, then brand, then category, then MRP range, then everything", async () => {
    await rule({ name: "Everything", kind: "all", ratePct: "1" });
    await rule({ name: "Mid MRP", kind: "mrp_range", mrpFrom: "400", mrpTo: "600", ratePct: "5" });
    await rule({ name: "Varsha brand", kind: "brand", match: "Varsha", ratePct: "3" });
    await rule({ name: "Varsha L special", kind: "item", itemId: id.vL, ratePct: "10" });
    await sell(id.meera, id.vM, "2", "1000");
    await sell(id.meera, id.vL, "1", "1000");
    await sell(id.ravi, id.oM, "2", "500");
    const r = await report();
    const meera = r.salesmen.find((s) => s.name === "Meera S")!;
    const ravi = r.salesmen.find((s) => s.name === "Ravi K")!;
    const by = (s: typeof meera, name: string) => s.rules.find((x) => x.name === name)!;
    expect(by(meera, "Varsha brand").commission).toBe((Number(by(meera, "Varsha brand").sales) * 0.03).toFixed(2));
    expect(by(meera, "Varsha L special").commission).toBe((Number(by(meera, "Varsha L special").sales) * 0.1).toFixed(2));
    expect(ravi.rules.map((x) => x.name)).toEqual(["Mid MRP"]);
    expect(ravi.commission).toBe((Number(ravi.sales) * 0.05).toFixed(2));
    expect(Number(r.totalCommission)).toBeCloseTo(Number(meera.commission) + Number(ravi.commission), 2);
    expect(meera.uncovered).toBe("0.00");
  });

  it("takes returns off the sales that earn commission", async () => {
    const before = (await report()).salesmen.find((s) => s.name === "Ravi K")!;
    const bill = (await sell(id.ravi, id.oM, "1", "500")).body;
    const mid = (await report()).salesmen.find((s) => s.name === "Ravi K")!;
    expect(Number(mid.sales)).toBeGreaterThan(Number(before.sales));
    const line = (await get(`/pos/bills/${bill.id}`)).lines[0];
    await post("/pos/returns", { billId: bill.id, terminalId: id.t1, refundMode: "cash", lines: [{ lineId: line.id, qty: "1", reason: "size", grade: "A" }] });
    const after = (await report()).salesmen.find((s) => s.name === "Ravi K")!;
    expect(after.sales).toBe(before.sales);
  });

  it("an inactive rule stops applying, a deleted one is gone, and businesses stay apart", async () => {
    const rules = (await get("/salesman-commission/rules")) as { id: string; name: string }[];
    const special = rules.find((x) => x.name === "Varsha L special")!;
    expect((await t.call(c, "PUT", `/salesman-commission/rules/${special.id}`, { name: "Varsha L special", kind: "item", itemId: id.vL, ratePct: "10", active: false })).status).toBe(200);
    const meera = (await report()).salesmen.find((s) => s.name === "Meera S")!;
    expect(meera.rules.map((x) => x.name)).toEqual(["Varsha brand"]);
    expect((await t.call(c, "DELETE", `/salesman-commission/rules/${special.id}`)).status).toBe(200);
    expect((await get("/salesman-commission/rules")).length).toBe(3);
    const other = (await t.signup("salescomm-other")).cookie;
    expect((await t.call(other, "GET", "/salesman-commission/rules")).body).toEqual([]);
    expect((await t.call(other, "DELETE", `/salesman-commission/rules/${special.id}`)).status).toBe(404);
  });
});
