import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let owner: string;
const id: Record<string, string> = {};

const day = (offset: number) => businessDate(new Date(Date.now() + offset * 86_400_000));

/** A person with the given permissions: a custom role, an invitation, and their own session. */
async function person(tag: string, permissions: string[]) {
  const role = (await t.call(owner, "POST", "/roles", { name: `Role ${tag}`, permissions })).body;
  const inv = await t.call(owner, "POST", "/invitations", { email: `${tag}-${t.run}@test.varchasv.in`, roleId: role.id });
  const token = inv.body.inviteUrl.split("/invite/")[1];
  return (await t.call("", "POST", "/invitations/accept", { token, name: `Person ${tag}`, password: "ledger-balanced-1" })).cookie as string;
}

beforeAll(async () => {
  t = await testApp();
  owner = (await t.signup("rights", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = (await t.call(owner, "GET", "/accounts/groups")).body;
  id.shop = (await t.call(owner, "POST", "/accounts", { name: "Rights Shop", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  const setup = (await t.call(owner, "GET", "/inventory/setup")).body;
  id.main = setup.warehouses[0].id;
  id.shirt = (await t.call(owner, "POST", "/items", { name: "Rights Shirt", hsn: "6205", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, purchaseRate: "400", saleRate: "700" })).body.id;
  await t.call(owner, "POST", "/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "100", rate: "400" }] });
});
afterAll(() => t.close());

const invoice = (who: string, date: string, rate = "700") => t.call(who, "POST", "/sales-invoices", { customerId: id.shop, date, lines: [{ itemId: id.shirt, qty: "1", rate }] });

describe("special rights", () => {
  it("lets someone enter today's documents, but not back-date or future-date them without the right", async () => {
    const clerk = await person("clerk", ["sales.view", "sales.create", "inventory.view", "accounts.view"]);
    expect((await invoice(clerk, day(0))).status).toBe(201);
    const back = await invoice(clerk, day(-3));
    expect([back.status, back.body.error]).toEqual([403, "needs_change_date"]);
    const fwd = await invoice(clerk, day(3));
    expect([fwd.status, fwd.body.error]).toEqual([403, "needs_future_date"]);
  });

  it("allows back-dating once the role has the right, and the owner always may", async () => {
    const senior = await person("senior", ["sales.view", "sales.create", "inventory.view", "special.changeDate"]);
    expect((await invoice(senior, day(-3))).status).toBe(201);
    expect((await invoice(senior, day(3))).body.error).toBe("needs_future_date");
    expect((await invoice(owner, day(-30))).status).toBe(201);
  });

  it("stops a sale below cost unless the role may", async () => {
    const clerk = await person("clerk2", ["sales.view", "sales.create", "inventory.view"]);
    expect((await invoice(clerk, day(0), "350")).body.error).toBe("needs_sell_below_cost");
    expect((await invoice(clerk, day(0), "450")).status).toBe(201);
    const trusted = await person("trusted", ["sales.view", "sales.create", "inventory.view", "special.sellBelowCost"]);
    expect((await invoice(trusted, day(0), "350")).status).toBe(201);
  });

  it("keeps agent commission and imports behind their own rights", async () => {
    const viewer = await person("viewer2", ["sales.view", "accounts.create", "reports.view"]);
    expect((await t.call(viewer, "GET", "/reports/agent-commission")).status).toBe(403);
    expect((await t.call(viewer, "POST", "/import/parties", { dryRun: true, rows: [] })).status).toBe(403);
    expect((await t.call(owner, "GET", "/reports/agent-commission")).status).toBe(200);
  });

  it("cannot be handed out by someone who does not hold the right", async () => {
    const lead = await person("lead", ["users.view", "users.edit", "sales.view"]);
    const r = await t.call(lead, "POST", "/roles", { name: "Sneaky", permissions: ["special.sellBelowCost"] });
    expect(r.status).toBe(403);
  });
});
