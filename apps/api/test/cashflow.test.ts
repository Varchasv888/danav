import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const voucher = (type: string, date: string, lines: { accountId: string; debit?: string; credit?: string }[]) => t.call(c, "POST", "/vouchers", { type, date, lines });
const flow = async () => get("/reports/cash-flow-statement?from=2026-04-01&to=2027-03-31");

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("cashflow")).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  const group = (k: string) => groups.find((g) => g.key === k)!.id;
  const accounts: { id: string; key: string | null }[] = await get("/accounts");
  id.cash = accounts.find((a) => a.key === "cash")!.id;
  id.capital = (await t.call(c, "POST", "/accounts", { name: "Owner Capital", groupId: group("capital") })).body.id;
  id.rent = accounts.find((a) => a.key === "rent")?.id ?? (await t.call(c, "POST", "/accounts", { name: "Shop Rent", groupId: group("indirect_expenses") })).body.id;
  id.sales = accounts.find((a) => a.key === "sales")?.id ?? (await t.call(c, "POST", "/accounts", { name: "Cash Sales", groupId: group("sales_accounts") })).body.id;
  id.loan = (await t.call(c, "POST", "/accounts", { name: "Term Loan", groupId: group("secured_loans") })).body.id;
  id.machine = (await t.call(c, "POST", "/accounts", { name: "Sewing Machine", groupId: group("fixed_assets") })).body.id;
  id.shop = (await t.call(c, "POST", "/accounts", { name: "Credit Customer", groupId: group("sundry_debtors"), stateCode: "27" })).body.id;
});
afterAll(() => t.close());

describe("cash flow", () => {
  it("is empty and balanced before anything happens", async () => {
    const f = await flow();
    expect(f).toMatchObject({ openingCash: "0.00", closingCash: "0.00", net: "0.00", difference: "0.00" });
  });

  it("sorts what happened into operating, investing and financing, and adds up to the change in cash", async () => {
    // Owner puts in 100,000; a 50,000 loan; buys a machine for 30,000; pays 5,000 rent; sells 20,000 on credit and 8,000 for cash.
    expect((await voucher("receipt", "2026-05-01", [{ accountId: id.cash, debit: "100000" }, { accountId: id.capital, credit: "100000" }])).status).toBe(201);
    expect((await voucher("receipt", "2026-05-02", [{ accountId: id.cash, debit: "50000" }, { accountId: id.loan, credit: "50000" }])).status).toBe(201);
    expect((await voucher("payment", "2026-05-03", [{ accountId: id.machine, debit: "30000" }, { accountId: id.cash, credit: "30000" }])).status).toBe(201);
    expect((await voucher("payment", "2026-05-04", [{ accountId: id.rent, debit: "5000" }, { accountId: id.cash, credit: "5000" }])).status).toBe(201);
    expect((await voucher("journal", "2026-05-05", [{ accountId: id.shop, debit: "20000" }, { accountId: id.sales, credit: "20000" }])).status).toBe(201);
    expect((await voucher("receipt", "2026-05-06", [{ accountId: id.cash, debit: "8000" }, { accountId: id.sales, credit: "8000" }])).status).toBe(201);
    const f = await flow();
    // Profit 28,000 - 5,000 = 23,000; debtors up 20,000 used cash: operating 3,000.
    expect(f.operating.total).toBe("3000.00");
    expect(f.investing.total).toBe("-30000.00");
    expect(f.financing.total).toBe("150000.00");
    expect(f.net).toBe("123000.00");
    expect(f.closingCash).toBe("123000.00");
    expect(f.change).toBe("123000.00");
    expect(f.difference).toBe("0.00");
    expect(f.operating.lines.map((l: { name: string }) => l.name)).toEqual(expect.arrayContaining(["Net profit", "Credit Customer"]));
    expect(f.financing.lines.map((l: { name: string }) => l.name)).toEqual(expect.arrayContaining(["Term Loan"]));
  });

  it("starts from the cash held at the start of a later period", async () => {
    const f = await get("/reports/cash-flow-statement?from=2026-05-05&to=2027-03-31");
    expect(f.openingCash).toBe("115000.00");
    expect(f.difference).toBe("0.00");
  });

  it("is private to the business", async () => {
    const other = (await t.signup("cashflow-other")).cookie;
    const f = (await t.call(other, "GET", "/reports/cash-flow-statement?from=2026-04-01&to=2027-03-31")).body;
    expect(f.closingCash).toBe("0.00");
  });
});
