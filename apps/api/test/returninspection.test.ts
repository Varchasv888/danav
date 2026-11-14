import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();
const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const stockIn = async (itemId: string, godown: string) =>
  ((await get(`/reports/stock-summary?asOf=${today}`)).rows as { itemId: string; warehouses: { warehouseId: string; qty: string }[] }[]).find((r) => r.itemId === itemId)?.warehouses.find((w) => w.warehouseId === godown)?.qty ?? "0";

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("returninspect", { gstin: "27AAPFU0939F1ZV" })).cookie as string;
  const groups = (await get("/accounts/groups")) as { id: string; key: string }[];
  id.shop = (await post("/accounts", { name: "Return Shop", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.shirt = (await post("/items", { name: "Return Shirt", hsn: "6205", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, saleRate: "500" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "50", rate: "300" }] });
});
afterAll(() => t.close());

describe("return inspection", () => {
  it("goods returned with inspect first wait in quality hold, then are restocked or written off", async () => {
    const inv = await post("/sales-invoices", { customerId: id.shop, date: today, lines: [{ itemId: id.shirt, qty: "10", rate: "500" }] });
    expect(inv.status, JSON.stringify(inv.body)).toBe(201);
    const line = (await get(`/sales-invoices/${inv.body.id}`)).lines[0].id;
    const cn = await post("/credit-notes", { invoiceId: inv.body.id, date: today, reason: "Six came back", goodsReturned: true, inspect: true, lines: [{ invoiceLineId: line, qty: "6" }] });
    expect(cn.status, JSON.stringify(cn.body)).toBe(201);
    // Stock is 40 on the shelf; the six sit in quality hold, not on the shelf.
    expect(await stockIn(id.shirt, id.main)).toBe("40.0000");
    const waiting = (await get("/return-inspections?status=pending")) as { id: string; qty: string; remaining: string; godown: string }[];
    expect(waiting).toHaveLength(1);
    expect(waiting[0]).toMatchObject({ qty: "6.0000", remaining: "6.0000", godown: "Quality hold" });
    const rid = waiting[0]!.id;
    expect((await post(`/return-inspections/${rid}/decide`, {})).body.error).toBe("nothing_decided");
    expect((await post(`/return-inspections/${rid}/decide`, { restock: "5", writeOff: "2" })).body.error).toBe("more_than_remaining");
    const half = await post(`/return-inspections/${rid}/decide`, { restock: "4" });
    expect(half.status, JSON.stringify(half.body)).toBe(200);
    expect(half.body).toMatchObject({ restocked: "4.0000", remaining: "2.0000", status: "pending" });
    expect(await stockIn(id.shirt, id.main)).toBe("44.0000");
    const rest = await post(`/return-inspections/${rid}/decide`, { writeOff: "2", reason: "damaged" });
    expect(rest.status, JSON.stringify(rest.body)).toBe(200);
    expect(rest.body).toMatchObject({ writtenOff: "2.0000", remaining: "0.0000", status: "done" });
    expect((await get("/return-inspections?status=pending"))).toEqual([]);
    expect((await post(`/return-inspections/${rid}/decide`, { restock: "1" })).body.error).toBe("inspection_done");
  });

  it("a return without the inspect option goes straight back on the shelf and is not queued", async () => {
    const inv = await post("/sales-invoices", { customerId: id.shop, date: today, lines: [{ itemId: id.shirt, qty: "3", rate: "500" }] });
    const line = (await get(`/sales-invoices/${inv.body.id}`)).lines[0].id;
    const before = await stockIn(id.shirt, id.main);
    expect((await post("/credit-notes", { invoiceId: inv.body.id, date: today, reason: "One back", goodsReturned: true, lines: [{ invoiceLineId: line, qty: "1" }] })).status).toBe(201);
    expect(Number(await stockIn(id.shirt, id.main))).toBe(Number(before) + 1);
    expect((await get("/return-inspections?status=pending"))).toEqual([]);
  });
});
