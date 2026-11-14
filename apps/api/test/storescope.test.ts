import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let owner: string;
let clerk: string;
const id: Record<string, string> = {};
const today = businessDate();

const get = async (cookie: string, url: string) => (await t.call(cookie, "GET", url)).body;
const post = (cookie: string, url: string, body: unknown) => t.call(cookie, "POST", url, body);

beforeAll(async () => {
  t = await testApp();
  owner = (await t.signup("storescope", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get(owner, "/inventory/setup");
  id.a = (await post(owner, "/warehouses", { name: "Store A" })).body.id;
  id.b = (await post(owner, "/warehouses", { name: "Store B" })).body.id;
  id.shirt = (await post(owner, "/items", { name: "Scope Shirt", uomId: setup.uoms[0].id, gstRate: "5", saleRate: "1000", purchaseRate: "400", mrp: "1000" })).body.id;
  await post(owner, "/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.a, qty: "10", rate: "400" }, { itemId: id.shirt, warehouseId: id.b, qty: "10", rate: "400" }] });
  for (const k of ["a", "b"]) {
    id[`t${k}`] = (await post(owner, "/pos/terminals", { name: `Counter ${k}`, warehouseId: id[k] })).body.id;
    await post(owner, "/pos/sessions", { terminalId: id[`t${k}`], openingCash: "0" });
  }
  const role = (await post(owner, "/roles", { name: "Store staff", permissions: ["sales.view", "sales.create", "sales.edit", "inventory.view", "inventory.create"] })).body.id as string;
  const inv = await post(owner, "/invitations", { email: `staff-${t.run}@test.varchasv.in`, roleId: role });
  clerk = (await t.call("", "POST", "/invitations/accept", { token: inv.body.inviteUrl.split("/invite/")[1], name: "Store Clerk", password: "ledger-balanced-1" })).cookie as string;
  id.member = ((await get(owner, "/members")) as { id: string; name: string }[]).find((m) => m.name === "Store Clerk")!.id;
});
afterAll(() => t.close());

describe("people limited to some stores", () => {
  it("see every store until limited, then only theirs", async () => {
    expect((await get(clerk, "/inventory/setup")).warehouses.length).toBeGreaterThanOrEqual(3);
    expect((await t.call(owner, "PATCH", `/members/${id.member}`, { warehouseScope: [id.a] })).status).toBe(200);
    // The scope is read on each request, so it takes effect at once.
    const stores = (await get(clerk, "/inventory/setup")).warehouses as { id: string }[];
    expect(stores.map((w) => w.id)).toEqual([id.a]);
    expect(((await get(clerk, "/pos/terminals")) as { id: string }[]).map((x) => x.id)).toEqual([id.ta]);
    expect(((await get(owner, "/members")) as { id: string; warehouseScope: string[] | null }[]).find((m) => m.id === id.member)!.warehouseScope).toEqual([id.a]);
  });

  it("can bill and read stock in their store, and are refused any other", async () => {
    expect((await post(clerk, "/pos/bills", { terminalId: id.ta, lines: [{ itemId: id.shirt, qty: "1" }], payments: [{ mode: "cash", amount: "1000" }] })).status).toBe(201);
    const other = await post(clerk, "/pos/bills", { terminalId: id.tb, lines: [{ itemId: id.shirt, qty: "1" }], payments: [{ mode: "cash", amount: "1000" }] });
    expect(other.status).toBe(403);
    expect(other.body.error).toBe("outside_store_scope");
    expect((await t.call(clerk, "GET", `/reports/stock-summary?asOf=${today}`)).body.error).toBe("choose_store");
    expect((await t.call(clerk, "GET", `/reports/stock-summary?asOf=${today}&warehouseId=${id.a}`)).status).toBe(200);
    expect((await t.call(clerk, "GET", `/reports/stock-summary?asOf=${today}&warehouseId=${id.b}`)).status).toBe(403);
    // A transfer into another store is refused too, wherever the store is named.
    expect((await post(clerk, "/stock-transfers", { fromWarehouseId: id.a, toWarehouseId: id.b, date: today, lines: [{ itemId: id.shirt, qty: "1" }] })).body.error).toBe("outside_store_scope");
    // The owner is never limited.
    expect((await t.call(owner, "GET", `/reports/stock-summary?asOf=${today}`)).status).toBe(200);
  });

  it("checks the stores named, keeps owners free of limits, and lifts the limit when emptied", async () => {
    expect((await t.call(owner, "PATCH", `/members/${id.member}`, { warehouseScope: ["00000000-0000-4000-8000-000000000000"] })).body.error).toBe("unknown_warehouse");
    expect((await t.call(owner, "PATCH", `/members/${id.member}`, { warehouseScope: [id.a, id.b] })).status).toBe(200);
    expect((await get(clerk, "/inventory/setup")).warehouses.map((w: { id: string }) => w.id).sort()).toEqual([id.a, id.b].sort());
    expect((await t.call(owner, "PATCH", `/members/${id.member}`, { warehouseScope: [] })).status).toBe(200);
    expect((await get(clerk, "/inventory/setup")).warehouses.length).toBeGreaterThanOrEqual(3);
    expect(((await get(owner, "/members")) as { id: string; warehouseScope: string[] | null }[]).find((m) => m.id === id.member)!.warehouseScope).toBeNull();
  });
});
