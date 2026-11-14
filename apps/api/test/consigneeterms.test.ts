import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const put = (url: string, body: unknown) => t.call(c, "PUT", url, body);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("consterms", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.item = (await post("/items", { name: "Counter Dupatta", hsn: "6214", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, saleRate: "1000" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.item, warehouseId: id.main, qty: "50", rate: "400" }] });
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.store = (await post("/accounts", { name: "Mall Counter", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  id.mill = (await post("/accounts", { name: "Some Mill", groupId: groups.find((g) => g.key === "sundry_creditors")!.id, stateCode: "27" })).body.id;
  await post("/consignment/send", { customerId: id.store, date: "2026-09-01", lines: [{ itemId: id.item, qty: "10", rate: "1000" }] });
});
afterAll(() => t.close());

describe("consignee settlement terms", () => {
  it("starts at 30 days with no owner", async () => {
    expect(await get(`/consignees/${id.store}/terms`)).toMatchObject({ settlementDays: 30, discrepancyOwner: null });
  });

  it("saves the days and who follows up differences", async () => {
    const r = await put(`/consignees/${id.store}/terms`, { settlementDays: 45, discrepancyOwner: "  Meera (accounts)  " });
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ settlementDays: 45, discrepancyOwner: "Meera (accounts)" });
    expect(await get(`/consignees/${id.store}/terms`)).toMatchObject({ settlementDays: 45 });
  });

  it("works out when settlement is due from the oldest goods still out, and when it is late", async () => {
    const r = await get(`/consignees/${id.store}?asOf=2026-11-03`);
    expect(r).toMatchObject({ settlementDue: "2026-10-16", settlementOverdue: true, terms: { settlementDays: 45, discrepancyOwner: "Meera (accounts)" } });
    const early = await get(`/consignees/${id.store}?asOf=2026-10-01`);
    expect(early).toMatchObject({ settlementDue: "2026-10-16", settlementOverdue: false });
    const list = (await get("/consignees?asOf=2026-11-03")).find((x: { customerId: string }) => x.customerId === id.store);
    expect(list).toMatchObject({ owner: "Meera (accounts)", settlementDue: "2026-10-16", settlementOverdue: true });
  });

  it("counts items whose stock at the counter does not match what was sent and sold", async () => {
    // Stock sent is 10 and nothing sold or returned, so nothing differs yet.
    expect((await get(`/consignees/${id.store}?asOf=2026-11-03`)).discrepancies).toBe(0);
  });

  it("refuses days outside 1 to 365, a supplier, and keeps businesses apart", async () => {
    expect((await put(`/consignees/${id.store}/terms`, { settlementDays: 0 })).status).toBe(400);
    expect((await put(`/consignees/${id.mill}/terms`, { settlementDays: 30 })).body.error).toBe("not_a_customer");
    const other = (await t.signup("consterms-other")).cookie;
    expect((await t.call(other, "PUT", `/consignees/${id.store}/terms`, { settlementDays: 10 })).status).toBe(400);
  });
});
