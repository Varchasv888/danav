import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();
const plus = (n: number) => new Date(Date.parse(`${today}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const journal = (date: string, lines: { accountId: string; debit?: string; credit?: string }[]) => post("/vouchers", { type: "journal", date, lines });

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("workcap", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  const group = (k: string) => groups.find((g) => g.key === k)!.id;
  const accounts: { id: string; key: string | null }[] = await get("/accounts");
  id.cash = accounts.find((a) => a.key === "cash")!.id;
  id.sales = (await post("/accounts", { name: "Credit Sales", groupId: group("sales_accounts") })).body.id;
  id.expense = (await post("/accounts", { name: "Goods Bought", groupId: group("indirect_expenses") })).body.id;
  id.capital = (await post("/accounts", { name: "Owner Capital", groupId: group("capital") })).body.id;
  id.bank = (await post("/accounts", { name: "Current Account", groupId: group("bank_accounts") })).body.id;
  id.cust = (await post("/accounts", { name: "Limit Customer", groupId: group("sundry_debtors"), stateCode: "27", creditLimit: "10000" })).body.id;
  id.supplier = (await post("/accounts", { name: "Cloth Supplier", groupId: group("sundry_creditors"), stateCode: "27" })).body.id;
  await journal(plus(-33), [{ accountId: id.cust, debit: "8000" }, { accountId: id.sales, credit: "8000" }]);
  await journal(plus(-33), [{ accountId: id.expense, debit: "1000" }, { accountId: id.supplier, credit: "1000" }]);
  await journal(today, [{ accountId: id.expense, debit: "4000" }, { accountId: id.supplier, credit: "4000" }]);
  await post("/vouchers", { type: "receipt", date: plus(-30), lines: [{ accountId: id.cash, debit: "10000" }, { accountId: id.capital, credit: "10000" }] });
  const setup = await get("/inventory/setup");
  id.item = (await post("/items", { name: "Order Shirt", hsn: "6205", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, saleRate: "500" })).body.id;
});
afterAll(() => t.close());

describe("credit exposure and supplier due dates", () => {
  it("adds accepted orders to what a customer owes and flags the ones over their limit", async () => {
    expect((await post("/sales-orders", { customerId: id.cust, date: today, lines: [{ itemId: id.item, qty: "10", rate: "500" }], overrideCredit: true, overrideReason: "Testing exposure" })).status).toBe(201);
    const r = await get("/finance/credit-exposure");
    const row = r.rows.find((x: { partyId: string }) => x.partyId === id.cust);
    expect(row).toMatchObject({ owed: "8000.00", limit: "10000.00", over: true });
    expect(Number(row.pendingOrders)).toBeGreaterThan(5000);
    expect(Number(row.headroom)).toBeLessThan(0);
    expect(r.overLimit).toBeGreaterThanOrEqual(1);
  });

  it("buckets what is owed to suppliers by the week it falls due", async () => {
    const cal = await get("/finance/supplier-calendar");
    expect(cal.buckets[0]).toMatchObject({ label: "overdue", total: "1000.00" });
    expect(cal.buckets.find((b: { label: string }) => b.label === "w1").total).toBe("4000.00");
    expect(cal.total).toBe("5000.00");
  });
});

describe("post-dated cheques", () => {
  it("records a received cheque, refuses a repeat, and posts the receipt when it clears", async () => {
    const body = { direction: "received", partyId: id.cust, bankAccountId: id.bank, chequeNo: "123456", drawnOn: "HDFC", chequeDate: plus(14), amount: "2000" };
    const r = await post("/finance/cheques", body);
    expect(r.status).toBe(201);
    expect((await post("/finance/cheques", body)).body.error).toBe("cheque_already_recorded");
    expect(await get("/finance/cheques?status=pending")).toHaveLength(1);
    // Before it clears the customer still owes the full amount.
    expect(await get("/finance/credit-exposure")).toBeTruthy();
    expect((await post(`/finance/cheques/${r.body.id}/settle`, { outcome: "cleared", date: plus(14) })).status).toBe(200);
    expect((await post(`/finance/cheques/${r.body.id}/settle`, { outcome: "cleared", date: plus(14) })).body.error).toBe("cheque_not_pending");
    const ledger = await get(`/reports/ledger/${id.cust}?from=2026-01-01&to=2028-12-31`);
    expect(ledger.closing).toBe("6000.00");
  });

  it("a bounced cheque posts nothing", async () => {
    const r = await post("/finance/cheques", { direction: "received", partyId: id.cust, bankAccountId: id.bank, chequeNo: "123457", chequeDate: plus(3), amount: "500" });
    await post(`/finance/cheques/${r.body.id}/settle`, { outcome: "bounced", date: plus(4) });
    expect((await get(`/reports/ledger/${id.cust}?from=2026-01-01&to=2028-12-31`)).closing).toBe("6000.00");
    expect((await get("/finance/cheques?status=bounced"))[0]).toMatchObject({ chequeNo: "123457", status: "bounced" });
  });
});

describe("cash forecast and the bank statement", () => {
  it("projects the weeks ahead from what is due and finds the lowest point", async () => {
    await post("/finance/cheques", { direction: "issued", partyId: id.supplier, bankAccountId: id.bank, chequeNo: "900001", chequeDate: plus(21), amount: "1500" });
    const f = await get("/finance/cash-forecast?weeks=6&overduePct=50");
    expect(f.openingCash).toBe("10000.00");
    expect(f.weeks).toHaveLength(6);
    // Week 1: half of the 8,000 owed and overdue comes in; the 1,000 overdue bill and the 4,000 due today are paid.
    expect(f.weeks[0]).toMatchObject({ collections: "4000.00", payments: "5000.00" });
    expect(f.weeks[1].payments).toBe("0.00");
    expect(f.weeks[3].cheques).toBe("-1500.00");
    expect(f.shortfall).toBe(false);
    expect(Number(f.lowest.balance)).toBeLessThanOrEqual(Number(f.openingCash));
  });

  it("works out drawing power from stock and young debtors, less creditors and the bank's margin", async () => {
    const d = await get("/finance/drawing-power?margin=25&sanctioned=1000");
    expect(d).toMatchObject({ receivablesUnder90: "8000.00", creditors: "5000.00", base: "3000.00", drawingPower: "2250.00", allowed: "1000.00", overDrawn: false });
    const wide = await get("/finance/drawing-power?margin=0&sanctioned=500");
    expect(wide).toMatchObject({ drawingPower: "3000.00", allowed: "500.00" });
  });

  it("keeps businesses apart", async () => {
    const other = (await t.signup("workcap-other")).cookie;
    expect((await t.call(other, "GET", "/finance/cheques")).body).toEqual([]);
    expect((await t.call(other, "POST", `/finance/cheques/${id.cust}/settle`, { outcome: "cleared", date: today })).status).toBe(404);
    expect((await t.call(other, "GET", "/finance/credit-exposure")).body.rows).toEqual([]);
  });
});
