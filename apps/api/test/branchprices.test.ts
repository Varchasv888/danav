import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();
const plus = (n: number) => new Date(Date.parse(`${today}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const sell = (terminalId: string, extra: Record<string, unknown> = {}) => post("/pos/bills", { terminalId, lines: [{ itemId: id.shirt, qty: "1", ...extra }], payments: [{ mode: "cash", amount: "2000" }] });

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("branchprices", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.a = (await post("/warehouses", { name: "Store A" })).body.id;
  id.b = (await post("/warehouses", { name: "Store B" })).body.id;
  id.shirt = (await post("/items", { name: "Branch Shirt", sku: "BS-1", uomId: pcs, gstRate: "5", saleRate: "1000", purchaseRate: "400", mrp: "1000" })).body.id;
  id.tie = (await post("/items", { name: "Branch Tie", sku: "BT-1", uomId: pcs, gstRate: "5", saleRate: "300", purchaseRate: "100", mrp: "300" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.a, qty: "20", rate: "400" }, { itemId: id.shirt, warehouseId: id.b, qty: "20", rate: "400" }] });
  await t.call(c, "PUT", "/pos/settings", { pricesIncludeTax: true, allowRateChange: false });
  for (const k of ["a", "b"]) {
    id[`t${k}`] = (await post("/pos/terminals", { name: `Counter ${k}`, warehouseId: id[k] })).body.id;
    await post("/pos/sessions", { terminalId: id[`t${k}`], openingCash: "0" });
  }
});
afterAll(() => t.close());

describe("a store's own rates", () => {
  it("charges the store's rate at its counter and the usual rate elsewhere, and shows the till what to charge", async () => {
    expect((await post("/branch-prices", { warehouseId: id.a, entries: [{ itemId: id.shirt, saleRate: "800" }] })).status).toBe(201);
    expect((await get(`/pos/branch-prices?warehouseId=${id.a}`)).rates).toEqual({ [id.shirt]: "800.00" });
    expect((await get(`/pos/branch-prices?warehouseId=${id.b}`)).rates).toEqual({});
    const a = await sell(id.ta);
    expect(a.status).toBe(201);
    expect((await get(`/pos/bills/${a.body.id}`)).lines[0].price).toBe("800.00");
    const b = await sell(id.tb);
    expect((await get(`/pos/bills/${b.body.id}`)).lines[0].price).toBe("1000.00");
    // The store rate is the base for the rate lock: charging it needs no override, charging something else does.
    expect((await sell(id.ta, { price: "800" })).status).toBe(201);
    expect((await sell(id.ta, { price: "700" })).status).not.toBe(201);
  });

  it("honours dates: a rate not started yet or already ended is ignored, and the latest entry that applies wins", async () => {
    await post("/branch-prices", { warehouseId: id.a, entries: [{ itemId: id.shirt, saleRate: "500", startsOn: plus(5) }, { itemId: id.shirt, saleRate: "450", endsOn: plus(-3) }] });
    expect((await get(`/pos/branch-prices?warehouseId=${id.a}`)).rates[id.shirt]).toBe("800.00");
    await post("/branch-prices", { warehouseId: id.a, entries: [{ itemId: id.shirt, saleRate: "750", startsOn: plus(-1), endsOn: plus(1), note: "Weekend sale" }] });
    expect((await get(`/pos/branch-prices?warehouseId=${id.a}`)).rates[id.shirt]).toBe("750.00");
    const list = await get(`/branch-prices?warehouseId=${id.a}`);
    expect(list).toHaveLength(4);
    expect(list.find((r: { note: string | null }) => r.note === "Weekend sale")).toMatchObject({ item: "Branch Shirt", usualRate: "1000.00", saleRate: "750.00" });
    expect((await post("/branch-prices", { warehouseId: id.a, entries: [{ itemId: id.shirt, saleRate: "500", startsOn: plus(3), endsOn: plus(1) }] })).body.error).toBe("range_reversed");
    expect((await post("/branch-prices", { warehouseId: id.a, entries: [{ itemId: id.shirt, saleRate: "500", fromTime: "10:00" }] })).body.error).toBe("both_times_needed");
  });

  it("imports pasted lines by code, copies a store's list to another, and removes an entry", async () => {
    expect((await post("/branch-prices/import", { warehouseId: id.b, text: "BT-1;250\nBS-1,900" })).body).toMatchObject({ added: 2 });
    expect((await post("/branch-prices/import", { warehouseId: id.b, text: "NOPE;1" })).body.error).toBe("unknown_codes");
    expect((await post("/branch-prices/import", { warehouseId: id.b, text: "BT-1;abc" })).body.error).toBe("invalid_amount");
    expect((await get(`/pos/branch-prices?warehouseId=${id.b}`)).rates).toEqual({ [id.tie]: "250.00", [id.shirt]: "900.00" });

    const c2 = await post("/warehouses", { name: "Store C" });
    const copied = await post("/branch-prices/copy", { fromWarehouseId: id.b, toWarehouseId: c2.body.id });
    expect(copied.body).toMatchObject({ copied: 2 });
    expect((await get(`/pos/branch-prices?warehouseId=${c2.body.id}`)).rates[id.tie]).toBe("250.00");
    expect((await post("/branch-prices/copy", { fromWarehouseId: id.b, toWarehouseId: id.b })).body.error).toBe("same_store");

    const first = (await get(`/branch-prices?warehouseId=${c2.body.id}`))[0];
    expect((await t.call(c, "DELETE", `/branch-prices/${first.id}`)).status).toBe(200);
    expect(await get(`/branch-prices?warehouseId=${c2.body.id}`)).toHaveLength(1);
  });
});
