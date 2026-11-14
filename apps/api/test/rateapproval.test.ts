import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let owner: string;
let clerk: string;
const id: Record<string, string> = {};

const call = (cookie: string, method: string, url: string, body?: unknown) => t.call(cookie, method, url, body);
const body = (over: Record<string, unknown> = {}) => ({ scope: { brand: "Varsha" }, field: "saleRate", mode: "percent", value: "10", round: "none", ...over });

beforeAll(async () => {
  t = await testApp();
  owner = (await t.signup("rateappr")).cookie;
  const setup = (await call(owner, "GET", "/inventory/setup")).body;
  id.main = setup.warehouses[0].id;
  id.pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.red = (await call(owner, "POST", "/colors", { name: "Red" })).body.id;
  const s = (await call(owner, "POST", "/styles", { code: "RA-1", name: "Rate Style", uomId: id.pcs, colorIds: [id.red], sizes: ["M"], saleRate: "1000", mrp: "2000", brand: "Varsha" })).body;
  id.item = ((await call(owner, "GET", `/styles/${s.id}`)).body.variants as { id: string }[])[0]!.id;
  await call(owner, "POST", "/stock-journals", { kind: "opening", lines: [{ itemId: id.item, warehouseId: id.main, qty: "20", rate: "400" }] });
  const role = await call(owner, "POST", "/roles", { name: "Rate clerk", permissions: ["inventory.view", "inventory.edit"] });
  const inv = await call(owner, "POST", "/invitations", { email: `rclerk-${t.run}@test.varchasv.in`, roleId: role.body.id });
  clerk = (await t.call("", "POST", "/invitations/accept", { token: inv.body.inviteUrl.split("/invite/")[1], name: "Clerk", password: "ledger-balanced-1" })).cookie;
});
afterAll(() => t.close());

describe("bulk rate updates need approval", () => {
  it("the preview shows what the change does to the value of stock in hand", async () => {
    const r = await call(owner, "POST", "/inventory/rate-update", { ...body(), preview: true });
    expect(r.body.valuation).toEqual({ before: "20000.00", after: "22000.00", change: "2000.00" });
    expect(r.body.rows[0]).toMatchObject({ stockQty: "20", valueBefore: "20000.00", valueAfter: "22000.00" });
  });

  it("a person without the approve right can preview and ask, but not apply", async () => {
    expect((await call(clerk, "POST", "/inventory/rate-update", { ...body(), preview: true })).status).toBe(200);
    const applied = await call(clerk, "POST", "/inventory/rate-update", { ...body(), preview: false });
    expect(applied.status).toBe(403);
    expect(applied.body.error).toBe("needs_approval");
  });

  it("applies only when someone else approves, and never lets a person approve their own request", async () => {
    const asked = await call(clerk, "POST", "/inventory/rate-update/request", body());
    expect(asked.status).toBe(201);
    expect(asked.body.summary).toMatchObject({ changed: 1, valuation: { change: "2000.00" } });
    expect((await call(owner, "GET", `/items/${id.item}`)).body.saleRate).toBe("1000.0000");
    expect((await call(clerk, "POST", `/inventory/rate-update/requests/${asked.body.id}/decide`, { decision: "approve" })).status).toBe(403);
    expect((await call(owner, "POST", `/inventory/rate-update/requests/${asked.body.id}/decide`, { decision: "reject" })).body.error).toBe("note_required");
    const done = await call(owner, "POST", `/inventory/rate-update/requests/${asked.body.id}/decide`, { decision: "approve" });
    expect(done.status).toBe(200);
    expect(done.body.status).toBe("approved");
    expect((await call(owner, "GET", `/items/${id.item}`)).body.saleRate).toBe("1100.0000");
    expect((await call(owner, "POST", `/inventory/rate-update/requests/${asked.body.id}/decide`, { decision: "approve" })).body.error).toBe("already_decided");
  });

  it("a rejected request changes nothing, and the owner's own request cannot be approved by the owner", async () => {
    const asked = await call(clerk, "POST", "/inventory/rate-update/request", body({ value: "5" }));
    expect((await call(owner, "POST", `/inventory/rate-update/requests/${asked.body.id}/decide`, { decision: "reject", note: "Not before the sale" })).body.status).toBe("rejected");
    expect((await call(owner, "GET", `/items/${id.item}`)).body.saleRate).toBe("1100.0000");
    const mine = await call(owner, "POST", "/inventory/rate-update/request", body({ value: "5" }));
    expect((await call(owner, "POST", `/inventory/rate-update/requests/${mine.body.id}/decide`, { decision: "approve" })).body.error).toBe("cannot_approve_own");
  });

  it("refuses to ask for a change that does nothing or pushes a rate over the MRP", async () => {
    expect((await call(owner, "POST", "/inventory/rate-update/request", body({ value: "200" }))).body.error).toBe("above_mrp");
    expect((await call(owner, "POST", "/inventory/rate-update/request", body({ scope: { brand: "Nobody" } }))).body.error).toBe("nothing_changed");
  });
});
