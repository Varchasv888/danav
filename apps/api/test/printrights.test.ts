import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let owner: string;
const id: Record<string, string> = {};

const get = async (cookie: string, url: string) => t.call(cookie, "GET", url);
const post = (cookie: string, url: string, body: unknown = {}) => t.call(cookie, "POST", url, body);

/** Makes a person with exactly these permissions and returns their session. */
async function person(name: string, permissions: string[]) {
  const role = await post(owner, "/roles", { name: `Role ${name}`, permissions });
  expect(role.status).toBe(201);
  const inv = await post(owner, "/invitations", { email: `${name}-${t.run}@test.varchasv.in`, roleId: role.body.id });
  const ok = await t.call("", "POST", "/invitations/accept", { token: inv.body.inviteUrl.split("/invite/")[1], name, password: "ledger-balanced-1" });
  return ok.cookie;
}

beforeAll(async () => {
  t = await testApp();
  owner = (await t.signup("printrights", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = (await get(owner, "/inventory/setup")).body;
  id.main = setup.warehouses[0].id;
  const groups: { id: string; key: string }[] = (await get(owner, "/accounts/groups")).body;
  id.cust = (await post(owner, "/accounts", { name: "Print Customer", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  id.item = (await post(owner, "/items", { name: "Print Shirt", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, gstRate: "5", saleRate: "1000", purchaseRate: "400" })).body.id;
  await post(owner, "/stock-journals", { kind: "opening", lines: [{ itemId: id.item, warehouseId: id.main, qty: "50", rate: "400" }] });
  id.inv = (await post(owner, "/sales-invoices", { customerId: id.cust, date: new Date().toISOString().slice(0, 10), lines: [{ itemId: id.item, qty: "1", rate: "1000" }] })).body.id;
});
afterAll(() => t.close());

describe("print and reprint rights", () => {
  it("a person who may print, but not reprint, can print a document once", async () => {
    const clerk = await person("clerk", ["sales.view", "sales.print"]);
    expect((await get(clerk, `/sales-invoices/${id.inv}/print?count=1`)).status).toBe(200);
    const again = await get(clerk, `/sales-invoices/${id.inv}/print?count=1`);
    expect(again.status).toBe(403);
    expect(again.body.error).toBe("needs_reprint_right");
    // Looking at the data without printing (the packing slip, a preview) is not a print.
    expect((await get(clerk, `/sales-invoices/${id.inv}/print`)).status).toBe(200);
  });

  it("a person without the print right cannot print at all, and one with reprint can print again", async () => {
    const viewer = await person("viewer", ["sales.view"]);
    const fresh = (await post(owner, "/sales-invoices", { customerId: id.cust, date: new Date().toISOString().slice(0, 10), lines: [{ itemId: id.item, qty: "1", rate: "1000" }] })).body.id as string;
    const refused = await get(viewer, `/sales-invoices/${fresh}/print?count=1`);
    expect(refused.status).toBe(403);
    expect(refused.body.error).toBe("needs_print_right");
    // The same document, already printed once, now needs the reprint right.
    const asker = await person("asker", ["sales.view", "sales.print"]);
    expect((await get(asker, `/sales-invoices/${fresh}/print?count=1`)).status).toBe(200);
    expect((await get(viewer, `/sales-invoices/${fresh}/print?count=1`)).body.error).toBe("needs_reprint_right");
    const manager = await person("manager", ["sales.view", "sales.print", "sales.reprint"]);
    expect((await get(manager, `/sales-invoices/${fresh}/print?count=1`)).status).toBe(200);
  });

  it("the owner can always print and reprint", async () => {
    expect((await get(owner, `/sales-invoices/${id.inv}/print?count=1`)).status).toBe(200);
  });
});

describe("changing a sale rate at the counter", () => {
  it("needs the right: without it only an approver with a reason can change a rate", async () => {
    await t.call(owner, "PUT", "/pos/settings", { allowRateChange: true });
    const term = (await post(owner, "/pos/terminals", { name: "Counter" })).body.id;
    await post(owner, "/pos/sessions", { terminalId: term, openingCash: "0" });
    const cashier = await person("cashier", ["sales.view", "sales.create"]);
    const bill = (cookie: string) => post(cookie, "/pos/bills", { terminalId: term, lines: [{ itemId: id.item, qty: "1", price: "900" }], payments: [{ mode: "cash", amount: "900" }] });
    expect((await bill(cashier)).body.error).toBe("rate_locked");
    const withRight = await person("pricer", ["sales.view", "sales.create", "special.changeSaleRate"]);
    expect((await bill(withRight)).status).toBe(201);
  });
});
