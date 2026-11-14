import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let owner: string;
let admin: string;
const id: Record<string, string> = {};
const today = businessDate();

const get = async (cookie: string, url: string) => (await t.call(cookie, "GET", url)).body;

beforeAll(async () => {
  t = await testApp();
  owner = (await t.signup("stockfin")).cookie;
  const roles = (await t.call(owner, "GET", "/roles")).body as { id: string; key: string }[];
  const inv = await t.call(owner, "POST", "/invitations", { email: `fin-${t.run}@test.varchasv.in`, roleId: roles.find((r) => r.key === "admin")!.id });
  admin = (await t.call("", "POST", "/invitations/accept", { token: inv.body.inviteUrl.split("/invite/")[1], name: "Finance Admin", password: "ledger-balanced-1" })).cookie;
  const setup = await get(owner, "/inventory/setup");
  id.main = setup.warehouses[0].id;
  const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  const item = async (name: string, saleRate: string) => (await t.call(owner, "POST", "/items", { name, hsn: "6205", gstRate: "5", uomId: pcs, saleRate })).body.id as string;
  id.cheap = await item("Below Cost Shirt", "300");
  id.slow = await item("Slow Shirt", "1000");
  await t.call(owner, "POST", "/stock-journals", { kind: "opening", lines: [id.cheap, id.slow].map((itemId) => ({ itemId, warehouseId: id.main, qty: "10", rate: "500" })) });
});
afterAll(() => t.close());

describe("stock write-down", () => {
  it("takes the larger of the age provision and the shortfall against net realisable value", async () => {
    const r = await get(owner, `/finance/stock-review?asOf=${today}`);
    const byName = Object.fromEntries(r.lines.map((l: { name: string }) => [l.name, l]));
    // Opening stock is over six months old: 25% of 5,000 = 1,250. The cheap shirt sells for 270 net of selling costs, so it is 2,300 short.
    expect(byName["Slow Shirt"]).toMatchObject({ ageProvision: "1250.00", nrvShortfall: "0.00", writedown: "1250.00" });
    expect(byName["Below Cost Shirt"]).toMatchObject({ ageProvision: "1250.00", nrvShortfall: "2300.00", writedown: "2300.00" });
    expect(r.required).toBe("3550.00");
  });

  it("holds a proposal until someone else approves, then books only the change in provision", async () => {
    const p = await t.call(owner, "POST", "/finance/writedowns", { asOf: today });
    expect(p.status).toBe(201);
    expect(p.body).toMatchObject({ status: "pending", required: "3550.00", held: "0.00", change: "3550.00" });
    await t.call(owner, "POST", "/auth/step-up", { password: "correct horse battery" });
    expect((await t.call(owner, "POST", `/finance/writedowns/${p.body.id}/decide`, { decision: "approve" })).body.error).toBe("cannot_approve_own_writedown");
    expect((await t.call(admin, "POST", `/finance/writedowns/${p.body.id}/decide`, { decision: "approve" })).body.error).toBe("step_up_required");
    await t.call(admin, "POST", "/auth/step-up", { password: "ledger-balanced-1" });
    const ok = await t.call(admin, "POST", `/finance/writedowns/${p.body.id}/decide`, { decision: "approve" });
    expect(ok.body).toMatchObject({ status: "approved" });
    expect(ok.body.voucherId).toBeTruthy();
    const accounts = (await get(owner, "/accounts")) as { key: string | null; balance: string }[];
    expect(accounts.find((a) => a.key === "stock_provision")!.balance).toBe("-3550.00");
    expect(accounts.find((a) => a.key === "stock_writedown")!.balance).toBe("3550.00");
    expect((await t.call(admin, "POST", `/finance/writedowns/${p.body.id}/decide`, { decision: "approve" })).body.error).toBe("writedown_already_decided");
    // Reviewed again with nothing changed, there is nothing more to book.
    const again = await t.call(owner, "POST", "/finance/writedowns", { asOf: today });
    expect(again.body).toMatchObject({ held: "3550.00", change: "0.00" });
  });

  it("releases provision when the need falls, and a rejection books nothing", async () => {
    const lower = await t.call(owner, "POST", "/finance/writedowns", { asOf: today, bands: { d181_365: 10 }, sellingCostPct: "0" });
    // 10% of 5,000 per item = 500 each; the cheap shirt sells at 300 (no selling cost): 2,000 short. Total 2,500; 3,550 held; release 1,050.
    expect(lower.body).toMatchObject({ required: "2500.00", change: "-1050.00" });
    const no = await t.call(admin, "POST", `/finance/writedowns/${lower.body.id}/decide`, { decision: "reject" });
    expect(no.body.status).toBe("rejected");
    const accounts = (await get(owner, "/accounts")) as { key: string | null; balance: string }[];
    expect(accounts.find((a) => a.key === "stock_provision")!.balance).toBe("-3550.00");
    expect(((await get(owner, "/finance/writedowns")) as unknown[]).length).toBeGreaterThanOrEqual(3);
  });

  it("shows the stock by store and the sales by channel and GSTIN", async () => {
    const c = await get(owner, `/finance/cost-centres?from=2026-04-01&to=${today}`);
    expect(c.stores[0]).toMatchObject({ qty: "20", value: "10000.00" });
    expect(Array.isArray(c.sales)).toBe(true);
    expect(c.byGstin.length).toBeGreaterThanOrEqual(1);
  });

  it("keeps businesses apart", async () => {
    const other = (await t.signup("stockfin-other")).cookie;
    expect((await t.call(other, "GET", "/finance/writedowns")).body).toEqual([]);
    await t.call(other, "POST", "/auth/step-up", { password: "correct horse battery" });
    expect((await t.call(other, "POST", `/finance/writedowns/${"00000000-0000-4000-8000-000000000000"}/decide`, { decision: "approve" })).status).toBe(404);
  });
});
