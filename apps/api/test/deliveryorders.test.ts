import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const doc = () => get(`/delivery-orders/${id.do1}`);
const challan = (qty: string, extra: Record<string, unknown> = {}) => post("/delivery-notes", { customerId: id.shop, date: "2026-10-05", warehouseId: id.main, lines: [{ itemId: id.shirt, qty, deliveryOrderLineId: id.doLine, ...extra }] });

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("deliveryorder", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.shop = (await post("/accounts", { name: "DO Shop", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.shirt = (await post("/items", { name: "DO Shirt", hsn: "6205", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, saleRate: "500" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "100", rate: "300" }] });
  const order = (await post("/sales-orders", { customerId: id.shop, date: "2026-10-01", lines: [{ itemId: id.shirt, qty: "10", rate: "500" }] })).body;
  id.order = order.id;
  id.orderLine = (await get(`/sales-orders/${order.id}`)).lines[0].id;
  const d = await post("/delivery-orders", { customerId: id.shop, orderId: id.order, date: "2026-10-02", transporter: "VRL", lines: [{ itemId: id.shirt, qty: "8", orderLineId: id.orderLine }] });
  id.do1 = d.body.id;
  id.doLine = (await doc()).lines[0].id;
});
afterAll(() => t.close());

describe("delivery order", () => {
  it("numbers itself and starts with everything still to dispatch", async () => {
    const d = await doc();
    expect(d.number).toMatch(/^DO\//);
    expect(d.status).toBe("open");
    expect(d.lines[0]).toMatchObject({ qty: "8.0000", dispatched: "0.0000", toDispatch: "8.0000", billed: "0.0000", difference: "8.0000" });
  });

  it("refuses more than the order still has to deliver", async () => {
    const r = await post("/delivery-orders", { customerId: id.shop, orderId: id.order, date: "2026-10-02", lines: [{ itemId: id.shirt, qty: "11", orderLineId: id.orderLine }] });
    expect(r.body.error).toBe("over_delivery");
  });

  it("challans against it add up and cannot pass what the order says to send", async () => {
    expect((await challan("5")).status).toBe(201);
    expect((await challan("4")).body.error).toBe("over_dispatch");
    expect((await challan("3")).status).toBe(201);
    expect((await doc()).lines[0]).toMatchObject({ dispatched: "8.0000", toDispatch: "0.0000" });
    expect((await doc()).challans).toHaveLength(2);
  });

  it("shows the difference against the bill once part is invoiced", async () => {
    // Both challans carry the same date, so pick the one that sent five pieces rather than relying on list order.
    let lineId = "";
    for (const note of (await doc()).challans as { id: string }[]) {
      const line = (await get(`/delivery-notes/${note.id}`)).lines[0];
      if (Number(line.qty) === 5) lineId = line.id;
    }
    const inv = await post("/sales-invoices", { customerId: id.shop, date: "2026-10-06", lines: [{ itemId: id.shirt, qty: "5", rate: "500", deliveryLineId: lineId }] });
    expect(inv.status).toBe(201);
    expect((await doc()).lines[0]).toMatchObject({ billed: "5.0000", difference: "3.0000" });
    const list = (await get("/delivery-orders")) as { id: string; pieces: string; dispatched: string; billed: string }[];
    expect(list.find((x) => x.id === id.do1)).toMatchObject({ pieces: "8.0000", dispatched: "8.0000", billed: "5.0000" });
  });

  it("cannot be cancelled once goods went out; closing stops further challans", async () => {
    expect((await post(`/delivery-orders/${id.do1}/cancel`, {})).body.error).toBe("delivery_order_has_dispatch");
    expect((await post(`/delivery-orders/${id.do1}/close`, {})).status).toBe(200);
    expect((await challan("1")).body.error).toBe("delivery_order_not_open");
    expect((await post(`/delivery-orders/${id.do1}/close`, {})).body.error).toBe("delivery_order_not_open");
  });

  it("cancels an order nothing was sent against, and keeps businesses apart", async () => {
    const d2 = (await post("/delivery-orders", { customerId: id.shop, date: "2026-10-03", lines: [{ itemId: id.shirt, qty: "2" }] })).body.id;
    expect((await post(`/delivery-orders/${d2}/cancel`, {})).status).toBe(200);
    expect((await get(`/delivery-orders/${d2}`)).status).toBe("cancelled");
    const other = (await t.signup("deliveryorder-other")).cookie;
    expect((await t.call(other, "GET", `/delivery-orders/${id.do1}`)).status).toBe(404);
    expect((await t.call(other, "GET", "/delivery-orders")).body).toEqual([]);
  });
});
