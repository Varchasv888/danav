import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();
const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("reservations", { gstin: "27AAPFU0939F1ZV" })).cookie as string;
  const groups = (await get("/accounts/groups")) as { id: string; key: string }[];
  const debtors = groups.find((g) => g.key === "sundry_debtors")!.id;
  id.shopA = (await post("/accounts", { name: "Shop A", groupId: debtors, stateCode: "27" })).body.id;
  id.shopB = (await post("/accounts", { name: "Shop B", groupId: debtors, stateCode: "27" })).body.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  const uomId = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  // One style in two colours, one size, so the two variants are substitutes for each other.
  const blueId = (await post("/colors", { name: "Blue" })).body.id, redId = (await post("/colors", { name: "Red" })).body.id;
  const style = await post("/styles", { code: "RS1", name: "Res Shirt", uomId, hsn: "6205", gstRate: "5", saleRate: "500", purchaseRate: "300", colorIds: [blueId, redId], sizes: ["M"] });
  expect(style.status, JSON.stringify(style.body)).toBe(201);
  const variants = ((await get("/items")) as { id: string; styleId?: string; color?: string }[]).filter((i) => i.styleId === style.body.id);
  id.blue = variants.find((v) => v.color === "Blue")!.id;
  id.red = variants.find((v) => v.color === "Red")!.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.blue, warehouseId: id.main, qty: "100", rate: "300" }, { itemId: id.red, warehouseId: id.main, qty: "40", rate: "300" }] });
});
afterAll(() => t.close());

const order = async (customerId: string, itemId: string, qty: string) => {
  const r = await post("/sales-orders", { customerId, date: today, lines: [{ itemId, qty, rate: "500" }] });
  expect(r.status, JSON.stringify(r.body)).toBe(201);
  return r.body.id as string;
};

describe("stock set aside for orders", () => {
  it("reserves what is free, and the next order can only reserve what is left", async () => {
    const a = await order(id.shopA, id.blue, "70");
    const ra = await post(`/sales-orders/${a}/reserve`, {});
    expect(ra.status, JSON.stringify(ra.body)).toBe(200);
    expect(ra.body.lines[0]).toMatchObject({ held: "70.0000", toGet: "0.0000" });
    const b = await order(id.shopB, id.blue, "50");
    const rb = await post(`/sales-orders/${b}/reserve`, {});
    expect(rb.body.lines[0]).toMatchObject({ held: "30.0000", toGet: "20.0000", freeNow: "0.0000" });
  });

  it("offers same-style items that have stock when a line falls short", async () => {
    const b = (await get("/sales-orders")) as { id: string; customerName: string }[];
    const shopB = b.find((o) => o.customerName === "Shop B")!;
    const r = await get(`/sales-orders/${shopB.id}/reservations`);
    const subs = r.lines[0].substitutes as { itemId: string; covers: boolean }[];
    expect(subs.map((s) => s.itemId)).toEqual([id.red]);
    expect(subs[0]!.covers).toBe(true); // 40 red in stock against 20 short
  });

  it("lists the shortage as a backorder, then delivering releases the hold by itself", async () => {
    const back = await get("/reports/backorders");
    expect(back.items.find((x: { itemId: string }) => x.itemId === id.blue)).toMatchObject({ wanted: "20.0000", freeNow: "0.0000" });
    const stock = await get(`/reports/stock-summary?asOf=${today}&includeCommitments=true`);
    expect(stock.rows.find((r: { itemId: string }) => r.itemId === id.blue)).toMatchObject({ reservedQty: "100.0000", freeToReserveQty: "0.0000" });
    const orders = (await get("/sales-orders")) as { id: string; customerName: string }[];
    const shopA = orders.find((o) => o.customerName === "Shop A")!;
    const line = (await get(`/sales-orders/${shopA.id}`)).lines[0].id;
    const dc = await post("/delivery-notes", { customerId: id.shopA, orderId: shopA.id, date: today, lines: [{ itemId: id.blue, qty: "70", orderLineId: line }] });
    expect(dc.status, JSON.stringify(dc.body)).toBe(201);
    const after = await get(`/sales-orders/${shopA.id}/reservations`);
    expect(after.lines[0].held).toBe("0.0000");
    const stock2 = await get(`/reports/stock-summary?asOf=${today}&includeCommitments=true`);
    expect(stock2.rows.find((r: { itemId: string }) => r.itemId === id.blue).reservedQty).toBe("30.0000");
  });

  it("releasing frees the stock for another order, and a cancelled or closed order holds nothing", async () => {
    const orders = (await get("/sales-orders")) as { id: string; customerName: string }[];
    const shopB = orders.find((o) => o.customerName === "Shop B")!;
    const rel = await post(`/sales-orders/${shopB.id}/release`, {});
    expect(rel.status).toBe(200);
    expect(rel.body.lines[0].held).toBe("0.0000");
    const c2 = await order(id.shopA, id.blue, "10");
    expect((await post(`/sales-orders/${c2}/reserve`, {})).body.lines[0].held).toBe("10.0000");
    expect((await post(`/sales-orders/${c2}/cancel`, {})).status).toBeLessThan(300);
    expect((await get(`/sales-orders/${c2}/reservations`)).lines[0].held).toBe("0.0000");
  });

  it("keeps other businesses out", async () => {
    const other = (await t.signup("reservations-other")).cookie;
    const orders = (await get("/sales-orders")) as { id: string }[];
    expect((await t.call(other, "GET", `/sales-orders/${orders[0]!.id}/reservations`)).status).toBe(404);
  });
});
