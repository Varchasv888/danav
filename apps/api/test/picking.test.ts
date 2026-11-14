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
  c = (await t.signup("picking", { gstin: "27AAPFU0939F1ZV" })).cookie as string;
  const groups = (await get("/accounts/groups")) as { id: string; key: string }[];
  id.shop = (await post("/accounts", { name: "Pick Shop", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  const uomId = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.shirt = (await post("/items", { name: "Pick Shirt", hsn: "6205", gstRate: "5", uomId, saleRate: "500", barcode: "8900000000011" })).body.id;
  id.other = (await post("/items", { name: "Pick Other", hsn: "6205", gstRate: "5", uomId, saleRate: "500", barcode: "8900000000028" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "20", rate: "300" }, { itemId: id.other, warehouseId: id.main, qty: "5", rate: "300" }] });
});
afterAll(() => t.close());

describe("bins", () => {
  it("makes bins, puts stock away only up to what is unplaced, and flags the rest", async () => {
    id.a = (await post("/bins", { warehouseId: id.main, code: "a-01" })).body.id;
    id.b = (await post("/bins", { warehouseId: id.main, code: "A-02" })).body.id;
    expect((await post("/bins", { warehouseId: id.main, code: "A-01" })).body.error).toBe("bin_exists");
    expect((await post("/bins/put-away", { binId: id.a, itemId: id.shirt, qty: "21" })).body.error).toBe("more_than_unplaced");
    expect((await post("/bins/put-away", { binId: id.a, itemId: id.shirt, qty: "12" })).status).toBe(200);
    expect((await post("/bins/put-away", { binId: id.b, itemId: id.shirt, qty: "8" })).status).toBe(200);
    const o = await get(`/warehouses/${id.main}/bins`);
    expect(o.bins.map((b: { code: string }) => b.code)).toEqual(["A-01", "A-02"]);
    expect(o.unplaced).toEqual([expect.objectContaining({ itemId: id.other, qty: "5.0000" })]);
    expect(o.drift).toEqual([]);
    expect((await post("/bins/move", { fromBinId: id.a, toBinId: id.b, itemId: id.shirt, qty: "2" })).status).toBe(200);
    expect((await post(`/bins/${id.a}/archive`, {})).body.error).toBe("bin_not_empty");
  });
});

describe("pick lists", () => {
  it("is made from stock set aside, takes from the fullest bin, and checks what is scanned", async () => {
    const order = await post("/sales-orders", { customerId: id.shop, date: today, lines: [{ itemId: id.shirt, qty: "15", rate: "500" }] });
    expect(order.status, JSON.stringify(order.body)).toBe(201);
    expect((await post("/pick-lists", { orderId: order.body.id, warehouseId: id.main })).body.error).toBe("nothing_to_pick");
    expect((await post(`/sales-orders/${order.body.id}/reserve`, {})).status).toBe(200);
    const made = await post("/pick-lists", { orderId: order.body.id, warehouseId: id.main });
    expect(made.status, JSON.stringify(made.body)).toBe(201);
    expect(made.body.number).toMatch(/^PK\//);
    // A-02 now holds 10 and A-01 holds 10: the 15 comes from both, no more than each holds.
    expect(made.body.lines.map((l: { toPick: string }) => l.toPick).sort()).toEqual(["10.0000", "5.0000"]);
    // The same stock is not listed twice.
    expect((await post("/pick-lists", { orderId: order.body.id, warehouseId: id.main })).body.error).toBe("nothing_to_pick");
    const listId = made.body.id;
    expect((await post(`/pick-lists/${listId}/scan`, { code: "8900000000011", qty: 14 })).body.result).toBe("ok");
    expect((await post(`/pick-lists/${listId}/scan`, { code: "8900000000028" })).body.result).toBe("wrong");
    expect((await post(`/pick-lists/${listId}/scan`, { code: "NOSUCHCODE" })).body.result).toBe("wrong");
    expect((await post(`/pick-lists/${listId}/complete`, {})).body.error).toBe("lines_missing");
    expect((await post(`/pick-lists/${listId}/scan`, { code: "8900000000011" })).body.result).toBe("ok");
    expect((await post(`/pick-lists/${listId}/scan`, { code: "8900000000011" })).body.result).toBe("extra");
    const done = await post(`/pick-lists/${listId}/complete`, {});
    expect(done.status, JSON.stringify(done.body)).toBe(200);
    expect(done.body).toMatchObject({ status: "done", missing: [] });
    expect(done.body.exceptions.map((e: { kind: string }) => e.kind)).toEqual(["wrong", "wrong", "extra"]);
    // Picked pieces left their bins.
    const o = await get(`/warehouses/${id.main}/bins`);
    expect(o.bins.flatMap((b: { items: unknown[] }) => b.items)).toEqual([expect.objectContaining({ itemId: id.shirt, qty: "5.0000" })]);
  });

  it("keeps other businesses out", async () => {
    const other = (await t.signup("picking-other")).cookie;
    const lists = (await get("/pick-lists")) as { id: string }[];
    expect((await t.call(other, "GET", `/pick-lists/${lists[0]!.id}`)).status).toBe(404);
  });
});
