import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const stock = async (itemId: string, warehouseId: string) => {
  const rows = (await get("/reports/stock-summary?asOf=2026-12-31")).rows as { itemId: string; warehouses: { warehouseId: string; qty: string }[] }[];
  return Number(rows.find((r) => r.itemId === itemId)?.warehouses.find((w) => w.warehouseId === warehouseId)?.qty ?? 0);
};
const send = (qty: string, over: Record<string, unknown> = {}) => post("/stock-transfers", {
  fromWarehouseId: id.main, toWarehouseId: id.shop, date: "2026-10-10", transporter: "VRL", lines: [{ itemId: id.shirt, qty }], ...over,
});

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("transfers")).cookie;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.shop = (await post("/warehouses", { name: "Shop 2" })).body.id;
  id.shirt = (await post("/items", { name: "Transfer Shirt", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, saleRate: "500" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "50", rate: "300" }] });
});
afterAll(() => t.close());

describe("stock transfer with in-transit stage", () => {
  it("takes the stock out of the source and holds it in transit", async () => {
    const r = await send("20");
    expect(r.status).toBe(201);
    expect(r.body.number).toMatch(/^TR\//);
    id.tr1 = r.body.id;
    expect(await stock(id.shirt, id.main)).toBe(30);
    expect(await stock(id.shirt, id.shop)).toBe(0);
    const transit = (await get("/inventory/setup")).warehouses.find((w: { name: string }) => w.name === "In transit");
    expect(transit).toBeTruthy();
    expect(await stock(id.shirt, transit.id)).toBe(20);
    id.transit = transit.id;
    expect(await get("/stock-transfers/in-transit")).toHaveLength(1);
  });

  it("receiving moves what arrived to the destination and records the shortage", async () => {
    const line = (await get(`/stock-transfers/${id.tr1}`)).lines[0];
    expect((await post(`/stock-transfers/${id.tr1}/receive`, { date: "2026-10-12", lines: [{ lineId: line.id, received: "25" }] })).body.error).toBe("received_more_than_sent");
    const r = await post(`/stock-transfers/${id.tr1}/receive`, { date: "2026-10-12", lines: [{ lineId: line.id, received: "18" }] });
    expect(r.body).toMatchObject({ short: "2.0000" });
    expect(await stock(id.shirt, id.shop)).toBe(18);
    expect(await stock(id.shirt, id.transit)).toBe(0);
    expect((await get(`/stock-transfers/${id.tr1}`)).lines[0]).toMatchObject({ receivedQty: "18.0000", shortQty: "2.0000" });
    expect((await get("/stock-transfers"))[0]).toMatchObject({ status: "received", pieces: "20.0000", received: "18.0000", short: "2.0000" });
    expect(await get("/stock-transfers/in-transit")).toEqual([]);
  });

  it("is received once, and cannot be called back afterwards", async () => {
    const line = (await get(`/stock-transfers/${id.tr1}`)).lines[0];
    expect((await post(`/stock-transfers/${id.tr1}/receive`, { date: "2026-10-13", lines: [{ lineId: line.id, received: "1" }] })).body.error).toBe("transfer_not_in_transit");
    expect((await post(`/stock-transfers/${id.tr1}/cancel`, { reason: "Too late" })).body.error).toBe("transfer_already_received");
  });

  it("calling back an unreceived transfer returns the stock to the source", async () => {
    const r = await send("5");
    expect(await stock(id.shirt, id.main)).toBe(25);
    expect((await post(`/stock-transfers/${r.body.id}/cancel`, { reason: "Sent by mistake" })).status).toBe(200);
    expect(await stock(id.shirt, id.main)).toBe(30);
    expect(await stock(id.shirt, id.transit)).toBe(0);
  });

  it("refuses the same warehouse twice, a repeated item and a transit warehouse as an end", async () => {
    expect((await send("1", { toWarehouseId: id.main })).body.error).toBe("transfer_needs_two_warehouses");
    expect((await send("1", { lines: [{ itemId: id.shirt, qty: "1" }, { itemId: id.shirt, qty: "2" }] })).body.error).toBe("item_twice");
    expect((await send("1", { toWarehouseId: id.transit })).body.error).toBe("unknown_warehouse");
  });

  it("keeps businesses apart", async () => {
    const other = (await t.signup("transfers-other")).cookie;
    expect((await t.call(other, "GET", "/stock-transfers")).body).toEqual([]);
    expect((await t.call(other, "GET", `/stock-transfers/${id.tr1}`)).status).toBe(404);
  });
});
