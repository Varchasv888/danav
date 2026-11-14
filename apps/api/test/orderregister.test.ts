import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const register = async (asOf = "2026-11-03") => (await get(`/reports/sales-order-register?asOf=${asOf}`)) as {
  count: number; overdue: number; pendingPieces: number; pendingValue: string; orders: { id: string; number: string; ordered: string; served: string; pending: string; pendingValue: string; overdue: boolean; customer: string }[];
};

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("orderreg", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.shirt = (await post("/items", { name: "Order Shirt", hsn: "6205", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, saleRate: "500" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "100", rate: "300" }] });
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.cust = (await post("/accounts", { name: "Register Customer", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  id.late = (await post("/sales-orders", { customerId: id.cust, date: "2026-10-01", deliverBy: "2026-10-20", lines: [{ itemId: id.shirt, qty: "10", rate: "500" }] })).body.id;
  id.soon = (await post("/sales-orders", { customerId: id.cust, date: "2026-10-25", deliverBy: "2026-11-20", lines: [{ itemId: id.shirt, qty: "4", rate: "500" }] })).body.id;
});
afterAll(() => t.close());

describe("sales order register", () => {
  it("lists open orders by promised date with what is pending and its value", async () => {
    const r = await register();
    expect(r.orders.map((o) => o.id)).toEqual([id.late, id.soon]);
    expect(r.orders[0]).toMatchObject({ ordered: "10", served: "0", pending: "10", pendingValue: "5000.00", overdue: true, customer: "Register Customer" });
    expect(r.orders[1]!.overdue).toBe(false);
    expect(r).toMatchObject({ count: 2, overdue: 1, pendingPieces: 14, pendingValue: "7000.00" });
  });

  it("shrinks as an order is delivered, and drops off when it is complete", async () => {
    const line = (await get(`/sales-orders/${id.late}`)).lines[0].id;
    await post("/delivery-notes", { customerId: id.cust, orderId: id.late, date: "2026-10-05", warehouseId: id.main, lines: [{ itemId: id.shirt, qty: "6", orderLineId: line }] });
    expect((await register()).orders[0]).toMatchObject({ served: "6", pending: "4", pendingValue: "2000.00" });
    await post("/delivery-notes", { customerId: id.cust, orderId: id.late, date: "2026-10-06", warehouseId: id.main, lines: [{ itemId: id.shirt, qty: "4", orderLineId: line }] });
    expect((await register()).orders.map((o) => o.id)).toEqual([id.soon]);
  });

  it("leaves out cancelled orders and orders after the date, and keeps businesses apart", async () => {
    await post(`/sales-orders/${id.soon}/cancel`, {});
    expect((await register()).count).toBe(0);
    expect((await register("2020-01-01")).count).toBe(0);
    expect((await t.call(c, "GET", "/reports/sales-order-register?asOf=bad")).status).toBe(400);
    const other = (await t.signup("orderreg-other")).cookie;
    expect((await t.call(other, "GET", "/reports/sales-order-register?asOf=2026-11-03")).body.count).toBe(0);
  });
});
