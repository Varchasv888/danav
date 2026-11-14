import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("receivingscan")).cookie as string;
  const groups = (await get("/accounts/groups")) as { id: string; key: string }[];
  id.supplier = (await post("/accounts", { name: "Scan Supplier", groupId: groups.find((g) => g.key === "sundry_creditors")!.id, gstin: "29AAGCB7383J1Z4" })).body.id;
  const setup = await get("/inventory/setup");
  const uom = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.m = (await post("/items", { name: "Scan Shirt M", hsn: "6205", gstRate: "5", uomId: uom, purchaseRate: "300", barcode: "8900000000011" })).body.id;
  id.l = (await post("/items", { name: "Scan Shirt L", hsn: "6205", gstRate: "5", uomId: uom, purchaseRate: "310", barcode: "8900000000028" })).body.id;
  id.belt = (await post("/items", { name: "Scan Belt", hsn: "6217", gstRate: "12", uomId: uom, purchaseRate: "100", barcode: "8900000000035" })).body.id;
});
afterAll(() => t.close());

describe("receiving counted against the order", () => {
  it("counts against what is still to come, and flags short, over, not-on-order and unknown codes", async () => {
    const order = await post("/purchase-orders", { supplierId: id.supplier, date: "2026-06-01", lines: [{ itemId: id.m, qty: "50", rate: "300" }, { itemId: id.l, qty: "30", rate: "310" }] });
    expect(order.status, JSON.stringify(order.body)).toBe(201);
    const lines = (await get(`/purchase-orders/${order.body.id}`)).lines as { id: string; itemId: string }[];
    // 20 of M have already come in.
    expect((await post("/goods-receipts", { supplierId: id.supplier, orderId: order.body.id, date: "2026-06-03", lines: [{ itemId: id.m, qty: "20", orderLineId: lines.find((l) => l.itemId === id.m)!.id }] })).status).toBe(201);

    const r = await post(`/purchase-orders/${order.body.id}/receiving-check`, { scans: [
      { code: "8900000000011", qty: 25 }, { code: "8900000000028", qty: 34 }, { code: "8900000000035", qty: 2 }, { code: "123", qty: 1 },
    ] });
    expect(r.status, JSON.stringify(r.body)).toBe(200);
    const m = r.body.rows.find((x: { itemId: string }) => x.itemId === id.m);
    const l = r.body.rows.find((x: { itemId: string }) => x.itemId === id.l);
    expect(m).toMatchObject({ open: "30.0000", counted: "25.0000", state: "short", difference: "-5.0000" });
    expect(l).toMatchObject({ open: "30.0000", counted: "34.0000", state: "over" });
    expect(r.body.notOnOrder).toEqual([expect.objectContaining({ itemId: id.belt, qty: "2.0000", item: "Scan Belt" })]);
    expect(r.body.unknown).toEqual([{ code: "123", qty: "1" }]);
    expect(r.body.allIn).toBe(false);

    const exact = await post(`/purchase-orders/${order.body.id}/receiving-check`, { scans: [{ code: "8900000000011", qty: 30 }, { code: "8900000000028", qty: 30 }] });
    expect(exact.body.allIn).toBe(true);
  });

  it("refuses an order that is cancelled and one from another business", async () => {
    const order = await post("/purchase-orders", { supplierId: id.supplier, date: "2026-06-01", lines: [{ itemId: id.m, qty: "5", rate: "300" }] });
    const other = (await t.signup("receivingscan-other")).cookie as string;
    expect((await t.call(other, "POST", `/purchase-orders/${order.body.id}/receiving-check`, { scans: [] })).status).toBe(404);
    expect((await post(`/purchase-orders/${order.body.id}/cancel`, {})).status).toBe(200);
    const after = await post(`/purchase-orders/${order.body.id}/receiving-check`, { scans: [] });
    expect(after.body.error).toBe("order_not_open");
  });
});
