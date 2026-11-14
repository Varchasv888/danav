import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let cookie = "";
let token = "";
let deviceId = "";
const id: Record<string, string> = {};

const device = async (method: string, url: string, payload?: unknown) => {
  const res = await t.app.inject({ method: method as "GET", url, headers: { authorization: `Bearer ${token}` }, payload: payload as object });
  return { status: res.statusCode, body: res.json() };
};
const owner = (method: string, url: string, payload?: unknown) => t.call(cookie, method, url, payload);

beforeAll(async () => {
  t = await testApp();
  const s = await t.signup("syncstock", { gstin: "27AAPFU0939F1ZV" });
  cookie = s.cookie;
  token = (await t.call("", "POST", "/auth/login", { email: s.email, password: "correct horse battery", client: "app" })).body.token;
  deviceId = (await device("POST", "/devices", { name: "Stock phone", platform: "android" })).body.id;
  const setup = (await owner("GET", "/inventory/setup")).body;
  id.main = setup.warehouses[0].id;
  id.a = (await owner("POST", "/items", { name: "Audit Shirt A", sku: "AU-A", uomId: setup.uoms[0].id, gstRate: "5", saleRate: "100", purchaseRate: "40" })).body.id;
  id.b = (await owner("POST", "/items", { name: "Audit Shirt B", sku: "AU-B", uomId: setup.uoms[0].id, gstRate: "5", saleRate: "100", purchaseRate: "40" })).body.id;
  await owner("POST", "/stock-journals", { kind: "opening", lines: [{ itemId: id.a, warehouseId: id.main, qty: "10", rate: "40" }, { itemId: id.b, warehouseId: id.main, qty: "10", rate: "40" }] });
});
afterAll(() => t.close());

describe("a spot check counted by scanning on a device", () => {
  const op = (countId: string, lines: { itemId: string; counted: string }[]) => ({ opId: crypto.randomUUID(), kind: "stock.count", payload: { id: countId, warehouseId: id.main, name: "Shelf 3 spot check", lines } });

  it("arrives as a submitted verify-only count of just the items scanned, and changes no stock", async () => {
    const countId = crypto.randomUUID();
    const r = await device("POST", "/sync/push", { deviceId, ops: [op(countId, [{ itemId: id.a, counted: "8" }])] });
    expect(r.body.results[0]).toMatchObject({ ok: true, result: { id: countId, status: "submitted" } });
    const count = (await owner("GET", `/stock-counts/${countId}`)).body;
    expect(count).toMatchObject({ status: "submitted", verifyOnly: true });
    expect(count.lines).toHaveLength(1);
    expect(count.lines[0]).toMatchObject({ itemId: id.a, counted: "8.0000", expected: "10.0000" });
    const stock = ((await owner("GET", `/reports/stock-summary?asOf=${businessDate()}`)).body.rows as { itemId: string; qty: string }[]).find((x) => x.itemId === id.a)!;
    expect(Number(stock.qty)).toBe(10);
  });

  it("sent again after a lost reply, makes no second count", async () => {
    const countId = crypto.randomUUID();
    const body = { deviceId, ops: [op(countId, [{ itemId: id.b, counted: "9" }])] };
    expect((await device("POST", "/sync/push", body)).body.results[0].ok).toBe(true);
    const again = await device("POST", "/sync/push", body);
    expect(again.body.results[0]).toMatchObject({ ok: true, result: { replayed: true } });
    expect(((await owner("GET", "/stock-counts")).body as { id: string }[]).filter((x) => x.id === countId)).toHaveLength(1);
  });

  it("refuses an item that is not in the business", async () => {
    const r = await device("POST", "/sync/push", { deviceId, ops: [op(crypto.randomUUID(), [{ itemId: crypto.randomUUID(), counted: "1" }])] });
    expect(r.body.results[0].ok).toBe(false);
  });
});
