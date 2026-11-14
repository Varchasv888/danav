import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import postgres from "postgres";
import { testApp } from "./helpers.js";

const OWNER_URL = process.env.DATABASE_OWNER_URL ?? "postgres://varchasv_owner:varchasv_owner_dev@localhost:5433/varchasv";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
let owner: ReturnType<typeof postgres>;
const id: Record<string, string> = {};
const today = businessDate();
const phone = () => `9${String(Math.floor(Math.random() * 1e9)).padStart(9, "0")}`;
/** Counter bills are always dated today, so to test lapsing the member's points are aged in the database. */
const age = (who: string, days: number) => owner`update loyalty_lots set earned_on = earned_on - ${days}::int, expires_on = expires_on - ${days}::int where member_id in (select id from loyalty_members where phone = ${who})`;

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const put = (url: string, body: unknown) => t.call(c, "PUT", url, body);
const bill = (who: string, lines: unknown[], total: string) =>
  post("/pos/bills", { terminalId: id.t1, customerPhone: who, lines, payments: [{ mode: "cash", amount: total }] });

beforeAll(async () => {
  owner = postgres(OWNER_URL, { max: 1 });
  t = await testApp();
  c = (await t.signup("loyval", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.a = (await post("/items", { name: "Plain sock", uomId: pcs, gstRate: "5", hsn: "6115", saleRate: "100", purchaseRate: "40" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.a, warehouseId: id.main, qty: "100", rate: "40" }] });
  await put("/pos/settings", { pricesIncludeTax: true, loyaltyEnabled: true, loyaltyPointsPer100: 1, loyaltyPointValue: "1", loyaltyMaxRedeemPct: "50", loyaltyValidityDays: 30 });
  id.t1 = (await post("/pos/terminals", { name: "Counter" })).body.id;
  await post("/pos/sessions", { terminalId: id.t1, openingCash: "0" });
});
afterAll(async () => { await t.close(); await owner.end(); });

describe("point validity", () => {
  it("lets points lapse after the validity days, and takes them off at the next bill", async () => {
    const p = phone();
    expect((await bill(p, [{ itemId: id.a, qty: "5" }], "500")).body.loyaltyEarned).toBe(5);
    expect((await get(`/pos/loyalty/${p}`)).points).toBe(5);
    await age(p, 31);
    expect((await get(`/pos/loyalty/${p}`)).points).toBe(0);
    expect((await bill(p, [{ itemId: id.a, qty: "3" }], "300")).body.loyaltyEarned).toBe(3);
    const members = (await get("/loyalty/members")) as { phone: string; points: number }[];
    expect(members.find((m) => m.phone === p)!.points).toBe(3);
  });

  it("will not let a lapsed point be redeemed", async () => {
    const p = phone();
    await bill(p, [{ itemId: id.a, qty: "10" }], "1000");
    await age(p, 45);
    const r = await post("/pos/bills", { terminalId: id.t1, customerPhone: p, redeemPoints: 5, lines: [{ itemId: id.a, qty: "2" }], payments: [{ mode: "cash", amount: "195" }] });
    expect(r.body.error).toBe("too_many_points");
  });

  it("spends the points closest to lapsing first and reports what is about to lapse", async () => {
    const p = phone();
    await bill(p, [{ itemId: id.a, qty: "10" }], "1000"); // 10 points
    await age(p, 25); // lapse in 5 days
    await bill(p, [{ itemId: id.a, qty: "10" }], "1000"); // 10 points, lapse in 30 days
    const [older] = await owner`select "left" from loyalty_lots where member_id in (select id from loyalty_members where phone = ${p}) order by expires_on asc limit 1`;
    expect(older!.left).toBe(10);
    const r = await post("/pos/bills", { terminalId: id.t1, customerPhone: p, redeemPoints: 10, lines: [{ itemId: id.a, qty: "30" }], payments: [{ mode: "cash", amount: "2990" }] });
    expect(r.status).toBe(201);
    const lots = await owner`select "left", earned from loyalty_lots where member_id in (select id from loyalty_members where phone = ${p}) order by expires_on asc`;
    expect(lots.map((l) => l.left)).toEqual([0, 10, 29]); // the older lot went first
    const report = await get(`/loyalty/report?from=${today}&to=${today}`);
    expect(report.validityDays).toBe(30);
    expect(report.expiringSoon).toBeGreaterThanOrEqual(0);
  });
});

describe("exclusions", () => {
  it("leaves discounted lines out of the points when asked", async () => {
    await put("/pos/settings", { loyaltyExcludeDiscountedItems: true });
    const r = await bill(phone(), [{ itemId: id.a, qty: "2", discount: "50" }, { itemId: id.a, qty: "2" }], "350");
    expect(r.body.loyaltyEarned).toBe(2); // 350 paid, 200 of it on the undiscounted line
  });

  it("gives no points on a bill with any discount when the whole bill is excluded", async () => {
    await put("/pos/settings", { loyaltyExcludeDiscountedItems: false, loyaltyExcludeDiscountedBills: true });
    const p = phone();
    expect((await bill(p, [{ itemId: id.a, qty: "2", discount: "50" }, { itemId: id.a, qty: "2" }], "350")).body.loyaltyEarned).toBe(0);
    expect((await bill(p, [{ itemId: id.a, qty: "4" }], "400")).body.loyaltyEarned).toBe(4);
  });

  it("voids a bill and takes its points back out of the lots", async () => {
    const p = phone();
    const r = await bill(p, [{ itemId: id.a, qty: "4" }], "400");
    expect(r.body.loyaltyEarned).toBe(4);
    expect((await post(`/pos/bills/${r.body.id}/void`, { reason: "wrong bill" })).status).toBe(200);
    expect((await get(`/pos/loyalty/${p}`)).points).toBe(0);
  });
});

describe("duplicate submit", () => {
  it("gives back the same bill when the same id is sent twice, and takes stock only once", async () => {
    const billId = crypto.randomUUID();
    const body = { id: billId, terminalId: id.t1, lines: [{ itemId: id.a, qty: "1" }], payments: [{ mode: "cash", amount: "100" }] };
    const first = await post("/pos/bills", body);
    const second = await post("/pos/bills", body);
    expect(first.status).toBe(201);
    expect(second.body.id).toBe(billId);
    expect(second.body.number).toBe(first.body.number);
    const bills = (await get(`/pos/bills?date=${today}`)) as { id: string }[];
    expect(bills.filter((b) => b.id === billId)).toHaveLength(1);
  });
});
