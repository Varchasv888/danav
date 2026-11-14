import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();
const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const range = `from=${today}&to=${today}`;

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("reportlists2", { gstin: "27AAPFU0939F1ZV" })).cookie as string;
  const groups = (await get("/accounts/groups")) as { id: string; key: string }[];
  const g = (k: string) => groups.find((x) => x.key === k)!.id;
  id.shop = (await post("/accounts", { name: "Rep Shop", groupId: g("sundry_debtors"), stateCode: "27", phone: "9811100011", creditLimit: "50000" })).body.id;
  id.mill = (await post("/accounts", { name: "Rep Mill", groupId: g("sundry_creditors"), gstin: "29AAGCB7383J1Z4", stateCode: "29" })).body.id;
  id.loan = (await post("/accounts", { name: "Bank Term Loan", groupId: g("secured_loans"), openingBalance: "0" })).body?.id;
  id.rent = (await post("/accounts", { name: "Shop Rent", groupId: g("indirect_expenses") })).body.id;
  const accounts = (await get("/accounts")) as { id: string; key: string | null }[];
  id.cash = accounts.find((a) => a.key === "cash")!.id;
  const setup = await get("/inventory/setup");
  id.shirt = (await post("/items", { name: "Rep Shirt", hsn: "6205", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, saleRate: "500", purchaseRate: "200", reorderLevel: "50" })).body.id;
  expect((await post("/purchase-bills", { supplierId: id.mill, date: today, supplierInvoiceNo: "R/1", supplierInvoiceDate: today, lines: [{ itemId: id.shirt, qty: "20", rate: "300" }] })).status).toBe(201);
  expect((await post("/sales-invoices", { customerId: id.shop, date: today, lines: [{ itemId: id.shirt, qty: "10", rate: "500", discount: "250" }] })).status).toBe(201);
  expect((await post("/vouchers", { type: "payment", date: today, lines: [{ accountId: id.rent, debit: "1200" }, { accountId: id.cash, credit: "1200" }] })).status).toBe(201);
  expect((await post("/vouchers", { type: "receipt", date: today, lines: [{ accountId: id.cash, debit: "5000" }, { accountId: id.loan, credit: "5000" }] })).status).toBe(201);
});
afterAll(() => t.close());

describe("more report lists", () => {
  it("lists parties with what they owe, contact details and credit limit", async () => {
    const r = await get(`/reports/all-parties?asOf=${today}`);
    const shop = r.rows.find((x: { name: string }) => x.name === "Rep Shop");
    expect(shop).toMatchObject({ kind: "customer", phone: "9811100011", creditLimit: "50000.00" });
    expect(Number(shop.receivable)).toBeGreaterThan(0);
    const mill = r.rows.find((x: { name: string }) => x.name === "Rep Mill");
    expect(mill).toMatchObject({ kind: "supplier" });
    expect(Number(mill.payable)).toBeGreaterThan(0);
    expect((await get(`/reports/all-parties?asOf=${today}&kind=suppliers`)).rows.every((x: { kind: string }) => x.kind === "supplier")).toBe(true);
  });

  it("shows what each party bought and sold for an item, and sales and purchases by party and by group", async () => {
    const byItem = await get(`/reports/party-by-item?${range}&itemId=${id.shirt}`);
    expect(byItem.rows.find((x: { party: string }) => x.party === "Rep Shop")).toMatchObject({ saleQty: "10", purchaseQty: "0" });
    expect(byItem.rows.find((x: { party: string }) => x.party === "Rep Mill")).toMatchObject({ purchaseQty: "20" });
    const byParty = await get(`/reports/sale-by-party?${range}`);
    expect(Number(byParty.rows.find((x: { name: string }) => x.name === "Rep Shop").sale)).toBeGreaterThan(0);
    const byGroup = await get(`/reports/sale-by-party?${range}&by=group`);
    expect(byGroup.rows.map((x: { name: string }) => x.name)).toEqual(expect.arrayContaining(["Sundry Debtors", "Sundry Creditors"]));
  });

  it("summarises sales by HSN, and has no SAC rows when no service was sold", async () => {
    const hr = await t.call(c, "GET", `/reports/hsn-summary?${range}`);
    expect(hr.status, JSON.stringify(hr.body)).toBe(200);
    const h = hr.body;
    expect(h.rows).toHaveLength(1);
    expect(h.rows[0]).toMatchObject({ code: "6205", taxable: "4750.00" });
    expect((await get(`/reports/hsn-summary?${range}&kind=sac`)).rows).toEqual([]);
  });

  it("finds items at or below their minimum, and the stock movement of each item and day", async () => {
    const low = await get(`/reports/low-stock?asOf=${today}`);
    expect(low.rows.find((x: { name: string }) => x.name === "Rep Shirt")).toMatchObject({ minimum: "50", stock: "10" });
    const detail = await get(`/reports/stock-detail?${range}`);
    expect(detail.rows.find((x: { name: string }) => x.name === "Rep Shirt")).toMatchObject({ opening: "0", qtyIn: "20", qtyOut: "10", closing: "10" });
    const day = await get(`/reports/item-detail?${range}&itemId=${id.shirt}`);
    expect(day.rows).toEqual([{ date: today, sale: "10", purchase: "20", adjustment: "0", closing: "10" }]);
  });

  it("totals discount by item with the average percentage", async () => {
    const r = await get(`/reports/item-discount?${range}`);
    expect(r.rows[0]).toMatchObject({ name: "Rep Shirt", qty: "10", discount: "250.00", avgPct: "5" });
  });

  it("reports expenses by category and by ledger, and loans with what was drawn", async () => {
    const cat = await get(`/reports/expense-report?${range}`);
    expect(Number(cat.rows.find((x: { name: string }) => x.name === "Indirect Expenses").amount)).toBeGreaterThan(1199); // the sale invoice round off sits in the same group
    const item = await get(`/reports/expense-report?${range}&by=item`);
    expect(item.rows.find((x: { name: string }) => x.name === "Shop Rent")).toMatchObject({ amount: "1200.00" });
    const loan = await get(`/reports/loan-statement?${range}`);
    expect(loan.rows.find((x: { name: string }) => x.name === "Bank Term Loan")).toMatchObject({ drawn: "5000.00", balance: "5000.00" });
  });

  it("lists sale order items and refuses a backwards range", async () => {
    const order = await post("/sales-orders", { customerId: id.shop, date: today, lines: [{ itemId: id.shirt, qty: "4", rate: "500" }] });
    expect(order.status, JSON.stringify(order.body)).toBe(201);
    const r = await get(`/reports/sale-order-items?${range}`);
    expect(r.rows[0]).toMatchObject({ name: "Rep Shirt", qty: "4", amount: "2000.00" });
    expect((await t.call(c, "GET", `/reports/stock-detail?from=${today}&to=2000-01-01`)).status).toBe(400);
  });

  it("classes items by what they sold for, and finds customers due to order again", async () => {
    const abc = await get(`/reports/abc?asOf=${today}`);
    expect(abc.rows[0]).toMatchObject({ name: "Rep Shirt", class: "A", countEveryDays: 30 });
    const ago = (n: number) => new Date(Date.parse(`${today}T00:00:00Z`) - n * 86_400_000).toISOString().slice(0, 10);
    for (const n of [90, 60, 30]) expect((await post("/sales-invoices", { customerId: id.shop, date: ago(n), lines: [{ itemId: id.shirt, qty: "1", rate: "500" }] })).status).toBe(201);
    // The shop ordered on today and 30, 60 and 90 days before: a usual gap of 30 days. Thirty-five days on it is five days late.
    const later = new Date(Date.parse(`${today}T00:00:00Z`) + 35 * 86_400_000).toISOString().slice(0, 10);
    expect((await get(`/reports/likely-due?asOf=${today}`)).rows.find((x: { party: string }) => x.party === "Rep Shop")).toBeUndefined(); // ordered today: not due
    const due = await get(`/reports/likely-due?asOf=${later}`);
    const row = due.rows.find((x: { party: string }) => x.party === "Rep Shop");
    expect(row).toBeTruthy();
    expect(row).toMatchObject({ usualGapDays: 30, daysSince: 35, daysPast: 5 });
  });

  it("totals by item category, discounts by party and the lines of a bank account", async () => {
    expect((await get(`/reports/sale-by-category?${range}`)).rows.length).toBeGreaterThan(0);
    const stock = await get(`/reports/stock-by-category?asOf=${today}`);
    expect(Number(stock.totals.value)).toBeGreaterThan(0);
    const disc = await get(`/reports/discount-report?${range}`);
    expect(disc.rows.find((x: { party: string }) => x.party === "Rep Shop")).toMatchObject({ sale: "250.00" });
    const bank = (await post("/accounts", { name: "Rep Bank", groupId: ((await get("/accounts/groups")) as { id: string; key: string }[]).find((g) => g.key === "bank_accounts")!.id })).body.id;
    const csv = ["Date,Narration,Withdrawal Amt.,Deposit Amt.,Closing Balance", `${today.slice(8)}/${today.slice(5, 7)}/${today.slice(2, 4)},NEFT FROM SHOP,,1000.00,1000.00`].join(String.fromCharCode(10));
    expect((await post(`/banking/accounts/${bank}/statements`, { csv })).status).toBe(201);
    const stmt = await get(`/reports/bank-statement?${range}&accountId=${bank}`);
    expect(stmt.rows).toHaveLength(1);
    expect(stmt.totals).toMatchObject({ deposit: "1000.00", balance: "1000.00" });
  });
});

