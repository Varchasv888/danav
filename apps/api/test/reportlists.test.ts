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
  c = (await t.signup("reportlists", { gstin: "27AAPFU0939F1ZV" })).cookie as string;
  const groups = (await get("/accounts/groups")) as { id: string; key: string }[];
  id.shop = (await post("/accounts", { name: "List Shop", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  id.mill = (await post("/accounts", { name: "List Mill", groupId: groups.find((g) => g.key === "sundry_creditors")!.id, gstin: "29AAGCB7383J1Z4", stateCode: "29" })).body.id;
  const accounts = (await get("/accounts")) as { id: string; key: string | null }[];
  id.cash = accounts.find((a) => a.key === "cash")!.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.shirt = (await post("/items", { name: "List Shirt", hsn: "6205", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, saleRate: "500", purchaseRate: "200" })).body.id;
});
afterAll(() => t.close());

describe("report lists", () => {
  it("lists every document of the period with a link to each, and narrows to one kind", async () => {
    expect((await post("/purchase-bills", { supplierId: id.mill, date: today, supplierInvoiceNo: "L/1", supplierInvoiceDate: today, lines: [{ itemId: id.shirt, qty: "20", rate: "300" }] })).status).toBe(201);
    const sale = await post("/sales-invoices", { customerId: id.shop, date: today, lines: [{ itemId: id.shirt, qty: "10", rate: "500" }] });
    expect(sale.status, JSON.stringify(sale.body)).toBe(201);
    const receipt = await post("/vouchers", { type: "receipt", date: today, lines: [{ accountId: id.cash, debit: "1000" }, { accountId: id.shop, credit: "1000" }] });
    expect(receipt.status, JSON.stringify(receipt.body)).toBe(201);

    const all = await get(`/reports/transactions?from=${today}&to=${today}`);
    const kinds = all.rows.map((r: { type: string }) => r.type).sort();
    expect(kinds).toEqual(["paymentIn", "purchase", "sale"]);
    const row = all.rows.find((r: { type: string }) => r.type === "sale");
    expect(row).toMatchObject({ party: "List Shop", href: `/sales/invoices/${sale.body.id}` });
    expect(all.totals.moneyIn).toBe("1000.00");
    const only = await get(`/reports/transactions?from=${today}&to=${today}&type=purchase`);
    expect(only.rows).toHaveLength(1);
    expect((await t.call(c, "GET", `/reports/transactions?from=${today}&to=2000-01-01`)).status).toBe(400);
    expect((await t.call(c, "GET", `/reports/transactions?from=${today}&to=${today}&type=nonsense`)).status).toBe(400);
  });

  it("shows what each sale invoice made after what the goods cost", async () => {
    const r = await get(`/reports/bill-profit?from=${today}&to=${today}`);
    expect(r.rows).toHaveLength(1);
    // 10 pieces sold at 500 each, bought in at 300 each.
    expect(r.rows[0]).toMatchObject({ sale: "5000.00", cost: "3000.00", profit: "2000.00", party: "List Shop" });
    expect(r.totals).toEqual({ sale: "5000.00", profit: "2000.00" });
    expect((await get(`/reports/bill-profit?from=${today}&to=${today}&party=nobody`)).rows).toEqual([]);
  });

  it("totals tax by rate, on sales and on purchases", async () => {
    const r = await get(`/reports/gst-rate?from=${today}&to=${today}`);
    const five = r.rows.find((x: { rate: string }) => x.rate === "5");
    expect(five).toMatchObject({ saleTaxable: "5000.00", taxOut: "250.00", purchaseTaxable: "6000.00", taxIn: "300.00" });
    expect(r.totals).toEqual({ taxIn: "300.00", taxOut: "250.00" });
  });

  it("keeps another business out", async () => {
    const other = (await t.signup("reportlists-other")).cookie as string;
    const r = (await t.call(other, "GET", `/reports/transactions?from=${today}&to=${today}`)).body;
    expect(r.rows).toEqual([]);
  });
});
