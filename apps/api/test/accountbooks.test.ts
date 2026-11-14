import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
let groups: { id: string; key: string }[];

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const range = "from=2026-09-01&to=2026-10-31";

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("books")).cookie;
  groups = await get("/accounts/groups");
  const group = (k: string) => groups.find((g) => g.key === k)!.id;
  id.shop = (await post("/accounts", { name: "Books Shop", groupId: group("sundry_debtors"), stateCode: "27" })).body.id;
  id.shopRent = (await post("/accounts", { name: "Shop Rent", groupId: group("indirect_expenses") })).body.id;
  id.bank = (await post("/accounts", { name: "HDFC Bank", groupId: group("bank_accounts") })).body.id;
  for (const a of await get("/accounts") as { id: string; key: string | null }[]) if (a.key) id[a.key] = a.id;

  await post("/vouchers", { type: "receipt", date: "2026-09-02", lines: [{ accountId: id.cash, debit: "1000" }, { accountId: id.shop, credit: "1000" }] });
  await post("/vouchers", { type: "payment", date: "2026-09-03", lines: [{ accountId: id.shopRent, debit: "300" }, { accountId: id.cash, credit: "300" }] });
  await post("/vouchers", { type: "contra", date: "2026-09-05", lines: [{ accountId: id.bank, debit: "200" }, { accountId: id.cash, credit: "200" }] });
  await post("/vouchers", { type: "payment", date: "2026-10-04", lines: [{ accountId: id.shopRent, debit: "100" }, { accountId: id.bank, credit: "100" }] });
  // A payment that is cancelled must leave no trace in any book.
  const wrong = await post("/vouchers", { type: "payment", date: "2026-09-06", lines: [{ accountId: id.shopRent, debit: "50" }, { accountId: id.cash, credit: "50" }] });
  await post(`/vouchers/${wrong.body.voucher?.id ?? wrong.body.id}/cancel`, { reason: "entered twice" });
});
afterAll(() => t.close());

describe("account books", () => {
  it("cash book: opening, receipts, payments and a running balance by day", async () => {
    const b = await get(`/reports/cash-book?kind=cash&${range}`);
    expect([b.opening, b.receipts, b.payments, b.closing]).toEqual(["0.00", "1000.00", "500.00", "500.00"]);
    expect(b.days.map((d: { date: string; closing: string }) => [d.date, d.closing])).toEqual([["2026-09-02", "1000.00"], ["2026-09-03", "700.00"], ["2026-09-05", "500.00"]]);
    expect(b.accounts).toHaveLength(1);
  });

  it("bank book starts from the balance before the period", async () => {
    const b = await get(`/reports/cash-book?kind=bank&from=2026-10-01&to=2026-10-31`);
    expect([b.opening, b.receipts, b.payments, b.closing]).toEqual(["200.00", "0.00", "100.00", "100.00"]);
  });

  it("group month summary runs month by month with a closing balance", async () => {
    const cashGroup = groups.find((g) => g.key === "cash_in_hand")!.id;
    const r = await get(`/reports/group-month?groupId=${cashGroup}&${range}`);
    expect(r.months).toEqual([
      { month: "2026-09", debit: "1000.00", credit: "500.00", closing: "500.00" },
      { month: "2026-10", debit: "0.00", credit: "0.00", closing: "500.00" },
    ]);
  });

  it("cash and bank expense totals what was paid out on expense accounts", async () => {
    const r = await get(`/reports/cash-bank-expense?${range}`);
    expect(r.rows).toEqual([expect.objectContaining({ name: "Shop Rent", amount: "400.00", vouchers: 2 })]);
    expect(r.total).toBe("400.00");
  });

  it("cash flow groups the other side of every cash and bank voucher, and ignores moves between them", async () => {
    const r = await get(`/reports/cash-flow?${range}`);
    expect(r.rows.map((x: { group: string; moneyIn: string; moneyOut: string }) => [x.group, x.moneyIn, x.moneyOut])).toEqual(
      expect.arrayContaining([["Sundry Debtors", "1000.00", "0.00"], ["Indirect Expenses", "0.00", "400.00"]]));
    expect([r.moneyIn, r.moneyOut, r.net]).toEqual(["1000.00", "400.00", "600.00"]);
  });

  it("refuses a backwards range and keeps businesses apart", async () => {
    expect((await t.call(c, "GET", "/reports/cash-flow?from=2026-10-31&to=2026-09-01")).status).toBe(400);
    const other = (await t.signup("books-other")).cookie;
    const b = (await t.call(other, "GET", `/reports/cash-book?kind=cash&${range}`)).body;
    expect(b.receipts).toBe("0.00");
  });
});
