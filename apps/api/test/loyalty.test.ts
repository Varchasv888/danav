import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const patch = (url: string, body: unknown) => t.call(c, "PATCH", url, body);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("loyal", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.shirt = (await post("/items", { name: "Loyal Shirt", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, gstRate: "5", hsn: "6205", saleRate: "1000" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "20", rate: "500" }] });
  await t.call(c, "PUT", "/pos/settings", { pricesIncludeTax: true, loyaltyEnabled: true, loyaltyPointsPer100: 2, loyaltyPointValue: "0.5", loyaltyMaxRedeemPct: "20" });
  id.t1 = (await post("/pos/terminals", { name: "Counter" })).body.id;
  await post("/pos/sessions", { terminalId: id.t1, openingCash: "0" });
  await post("/pos/bills", { terminalId: id.t1, customerPhone: "9822233344", customerName: "Anita Joshi", lines: [{ itemId: id.shirt, qty: "1" }], payments: [{ mode: "cash", amount: "1000" }] });
  await post("/pos/bills", { terminalId: id.t1, customerPhone: "9811100022", lines: [{ itemId: id.shirt, qty: "2" }], payments: [{ mode: "cash", amount: "2000" }] });
});
afterAll(() => t.close());

describe("loyalty members", () => {
  it("lists members, biggest spender first, and searches by name or phone", async () => {
    const all = await get("/loyalty/members");
    expect(all.map((m: { phone: string }) => m.phone)).toEqual(["9811100022", "9822233344"]);
    expect((await get("/loyalty/members?search=anita")).map((m: { phone: string }) => m.phone)).toEqual(["9822233344"]);
    expect((await get("/loyalty/members?search=98111")).map((m: { phone: string }) => m.phone)).toEqual(["9811100022"]);
  });

  it("keeps a birthday and anniversary, and clears them", async () => {
    const r = await patch("/loyalty/members/9822233344", { birthday: "1990-11-10", anniversary: "2015-12-01" });
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ birthday: "1990-11-10", anniversary: "2015-12-01" });
    expect((await patch("/loyalty/members/9822233344", { anniversary: null })).body.anniversary).toBeNull();
    expect((await patch("/loyalty/members/9000000000", { name: "Nobody" })).status).toBe(404);
    expect((await patch("/loyalty/members/123", { name: "Bad" })).status).toBe(400);
  });

  it("lists birthdays coming up this year or next, soonest first, whatever the birth year", async () => {
    await patch("/loyalty/members/9811100022", { name: "Ravi", birthday: "1985-11-03", anniversary: "2010-12-25" });
    const soon = await get("/loyalty/upcoming?days=30&today=2026-11-03");
    expect(soon.map((x: { phone: string; kind: string; inDays: number }) => [x.phone, x.kind, x.inDays])).toEqual([["9811100022", "birthday", 0], ["9822233344", "birthday", 7]]);
    expect((await get("/loyalty/upcoming?days=60&today=2026-11-03")).map((x: { kind: string; inDays: number }) => x.inDays)).toEqual([0, 7, 52]);
    // After the date has passed this year, the next one is next year.
    const late = await get("/loyalty/upcoming?days=365&today=2026-11-04");
    expect(late.find((x: { phone: string; kind: string }) => x.phone === "9811100022" && x.kind === "birthday").on).toBe("2027-11-03");
  });

  it("reports members, points held and what the shop owes, and the period's flow", async () => {
    const r = await get(`/loyalty/report?from=${today}&to=${today}`);
    expect(r).toMatchObject({ enabled: true, members: 2, pointValue: "0.50" });
    expect(r.pointsHeld).toBe(r.earned - r.redeemed);
    expect(r.liability).toBe((r.pointsHeld * 0.5).toFixed(2));
    expect(r.memberBills).toBe(2);
    expect(r.top[0].phone).toBe("9811100022");
  });

  it("keeps businesses apart", async () => {
    const other = (await t.signup("loyal-other")).cookie;
    expect((await t.call(other, "GET", "/loyalty/members")).body).toEqual([]);
    expect((await t.call(other, "PATCH", "/loyalty/members/9822233344", { name: "x" })).status).toBe(404);
  });
});

describe("loyalty slabs and minimum", () => {
  it("saves richer-bill slabs and a minimum to redeem, and refuses a malformed slab", async () => {
    const saved = await t.call(c, "PUT", "/pos/settings", { loyaltySlabs: [{ from: "5000", per100: 3 }], loyaltyMinRedeem: 25 });
    expect(saved.status).toBe(200);
    const s = (await t.call(c, "GET", "/pos/settings")).body;
    expect(s).toMatchObject({ loyaltySlabs: [{ from: "5000", per100: 3 }], loyaltyMinRedeem: 25 });
    expect((await t.call(c, "PUT", "/pos/settings", { loyaltySlabs: [{ from: "abc", per100: 3 }] })).status).toBe(400);
    await t.call(c, "PUT", "/pos/settings", { loyaltySlabs: null, loyaltyMinRedeem: 0 });
  });
});
