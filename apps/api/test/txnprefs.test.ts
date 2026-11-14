import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();
const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const put = (body: unknown) => t.call(c, "PUT", "/settings/preferences", body);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("txnprefs", { gstin: "27AAPFU0939F1ZV" })).cookie as string;
  const groups = (await get("/accounts/groups")) as { id: string; key: string }[];
  id.shop = (await post("/accounts", { name: "Pref Shop", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.shirt = (await post("/items", { name: "Pref Shirt", hsn: "6205", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, saleRate: "99.99", purchaseRate: "50" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "10", rate: "50" }] });
});
afterAll(() => t.close());

const sell = (qty: string) => post("/sales-invoices", { customerId: id.shop, date: today, lines: [{ itemId: id.shirt, qty, rate: "99.99" }] });

describe("stop sale on negative stock", () => {
  it("lets a sale go below zero by default, with a warning", async () => {
    const r = await sell("15");
    expect(r.status, JSON.stringify(r.body)).toBe(201);
  });

  it("refuses the sale and saves nothing when the setting is on, and allows a sale that fits", async () => {
    expect((await put({ "txn.blockNegativeStock": true })).status).toBe(200);
    const before = ((await get("/sales-invoices")) as unknown[]).length;
    const refused = await sell("5"); // stock is already below zero after the first sale
    expect(refused.status).toBe(400);
    expect(refused.body.error).toBe("insufficient_stock");
    expect(((await get("/sales-invoices")) as unknown[]).length).toBe(before);
    await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "20", rate: "50" }] });
    expect((await sell("2")).status).toBe(201);
    expect((await sell("1000")).body.error).toBe("insufficient_stock");
  });
});

describe("round off total", () => {
  it("rounds the invoice to the rupee by default and keeps the paise when turned off", async () => {
    await put({ "txn.blockNegativeStock": false });
    const on = await sell("1");
    expect(on.status).toBe(201);
    expect(Number(on.body.roundOff)).not.toBe(0);
    expect(Number(on.body.total) % 1).toBe(0);
    expect((await put({ "txn.roundOff": false })).status).toBe(200);
    const off = await sell("1");
    expect(off.body.roundOff).toBe("0.00");
    expect(Number(off.body.total) % 1).not.toBe(0);
  });
});
