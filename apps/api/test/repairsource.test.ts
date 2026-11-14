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
  c = (await t.signup("repairsource", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.cust = (await post("/accounts", { name: "Anita Rao", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27", phone: "9822211100" })).body.id;
  const setup = await get("/inventory/setup");
  id.watch = (await post("/items", { name: "Steel Watch", uomId: setup.uoms[0].id, gstRate: "18", saleRate: "2500", purchaseRate: "1500", mrp: "2500" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.watch, warehouseId: setup.warehouses[0].id, qty: "10", rate: "1500" }] });
  id.invoice = (await post("/sales-invoices", { customerId: id.cust, date: today, lines: [{ itemId: id.watch, qty: "1", rate: "2500" }] })).body;
  id.order = (await post("/sales-orders", { customerId: id.cust, date: today, lines: [{ itemId: id.watch, qty: "2", rate: "2500" }] })).body;
});
afterAll(() => t.close());

describe("a repair that starts from a sale", () => {
  it("finds the sale by its number and gives back the customer and the goods", async () => {
    const inv = await get(`/sales-invoices/${(id.invoice as unknown as { id: string }).id}`);
    const found = await get(`/repairs/from-sale?number=${encodeURIComponent(inv.number)}`);
    expect(found).toMatchObject({ kind: "invoice", number: inv.number, customerName: "Anita Rao", customerPhone: "9822211100", items: ["Steel Watch"] });
    const ord = await get(`/sales-orders/${(id.order as unknown as { id: string }).id}`);
    expect((await get(`/repairs/from-sale?number=${encodeURIComponent(ord.number)}`)).kind).toBe("order");
    expect((await t.call(c, "GET", "/repairs/from-sale?number=NOPE/1")).status).toBe(404);
  });

  it("links the repair to the sale and lists a sale's repairs", async () => {
    const invId = (id.invoice as unknown as { id: string }).id;
    const r = await post("/repairs", { receivedOn: today, customerName: "Anita Rao", customerPhone: "9822211100", itemDescription: "Steel Watch, strap broken", source: { kind: "invoice", id: invId } });
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({ sourceKind: "invoice", sourceId: invId });
    expect(r.body.sourceNumber).toMatch(/\S/);
    await post("/repairs", { receivedOn: today, customerName: "Someone Else", itemDescription: "Other thing" });
    const mine = await get(`/repairs?sourceId=${invId}`);
    expect(mine).toHaveLength(1);
    expect(mine[0].id).toBe(r.body.id);
    expect((await post("/repairs", { receivedOn: today, customerName: "X", itemDescription: "Y", source: { kind: "invoice", id: "00000000-0000-4000-8000-000000000000" } })).status).toBe(404);
  });
});
