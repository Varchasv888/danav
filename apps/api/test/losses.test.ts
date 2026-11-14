import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let owner: string;
let keeper: string;
const id: Record<string, string> = {};

const get = async (cookie: string, url: string) => (await t.call(cookie, "GET", url)).body;
const loss = (cookie: string, body: Record<string, unknown>) => t.call(cookie, "POST", "/stock-losses", { itemId: id.shirt, warehouseId: id.main, reason: "damaged", ...body });
const stock = async () => Number(((await get(owner, "/reports/stock-summary")).rows as { itemId: string; qty: string }[]).find((r) => r.itemId === id.shirt)!.qty);

beforeAll(async () => {
  t = await testApp();
  owner = (await t.signup("losses")).cookie;
  const roles = (await t.call(owner, "GET", "/roles")).body as { id: string; key: string }[];
  const inv = await t.call(owner, "POST", "/invitations", { email: `keeper-${t.run}@test.varchasv.in`, roleId: roles.find((r) => r.key === "storekeeper")!.id });
  keeper = (await t.call("", "POST", "/invitations/accept", { token: inv.body.inviteUrl.split("/invite/")[1], name: "Keeper", password: "ledger-balanced-1" })).cookie;
  const setup = await get(owner, "/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.shirt = (await t.call(owner, "POST", "/items", { name: "Loss Shirt", hsn: "6205", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, saleRate: "1000" })).body.id;
  await t.call(owner, "POST", "/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "100", rate: "500" }] });
});
afterAll(() => t.close());

describe("stock losses and damage", () => {
  it("takes a small loss out of stock straight away, at cost, with a reason", async () => {
    const r = await loss(keeper, { qty: "2", reason: "damaged", note: "Torn in the godown" });
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({ status: "approved", value: "1000.00", reason: "damaged" });
    expect(r.body.number).toMatch(/^SL\//);
    expect(await stock()).toBe(98);
  });

  it("holds a loss above the limit until someone else approves it", async () => {
    const r = await loss(keeper, { qty: "10", reason: "theft" });
    expect(r.body).toMatchObject({ status: "pending", value: "5000.00" });
    expect(await stock()).toBe(98);
    expect((await t.call(keeper, "POST", `/stock-losses/${r.body.id}/decide`, { decision: "approve" })).status).toBe(403);
    const ok = await t.call(owner, "POST", `/stock-losses/${r.body.id}/decide`, { decision: "approve", note: "Police report seen" });
    expect(ok.body).toMatchObject({ status: "approved", decisionNote: "Police report seen" });
    expect(await stock()).toBe(88);
    expect((await t.call(owner, "POST", `/stock-losses/${r.body.id}/decide`, { decision: "approve" })).body.error).toBe("loss_already_decided");
  });

  it("a rejection leaves stock alone, and a request is not decided by its maker", async () => {
    const r = await loss(keeper, { qty: "10", reason: "lost" });
    const no = await t.call(owner, "POST", `/stock-losses/${r.body.id}/decide`, { decision: "reject", note: "Count again" });
    expect(no.body.status).toBe("rejected");
    expect(await stock()).toBe(88);
    // The owner may approve inventory, so the owner's own loss goes straight through.
    const own = await loss(owner, { qty: "20", reason: "expired" });
    expect(own.body.status).toBe("approved");
    expect(await stock()).toBe(68);
  });

  it("the limit can be changed, and the report adds up what was written off", async () => {
    expect((await t.call(keeper, "PUT", "/stock-losses/settings", { approvalLimit: "100000" })).status).toBe(403);
    expect((await t.call(owner, "PUT", "/stock-losses/settings", { approvalLimit: "100000" })).body.approvalLimit).toBe("100000.00");
    expect((await loss(keeper, { qty: "10", reason: "sample" })).body.status).toBe("approved");
    const r = await get(owner, "/reports/stock-losses?from=2026-01-01&to=2027-12-31");
    expect(r.total).toBe("21000.00");
    expect(r.byReason.map((x: { reason: string; value: string }) => `${x.reason}:${x.value}`).sort()).toEqual(["damaged:1000.00", "expired:10000.00", "sample:5000.00", "theft:5000.00"]);
    expect(r.byReason[0].reason).toBe("expired");
    expect(r.pending.count).toBe(0);
  });

  it("refuses nonsense and keeps businesses apart", async () => {
    expect((await loss(owner, { qty: "0" })).status).toBe(400);
    expect((await loss(owner, { qty: "1", reason: "mystery" })).status).toBe(400);
    const other = (await t.signup("losses-other")).cookie;
    expect((await t.call(other, "GET", "/stock-losses")).body).toEqual([]);
    expect((await loss(other, { qty: "1" })).status).toBe(400);
  });
});
