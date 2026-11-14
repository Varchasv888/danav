import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import { withTenant } from "@varchasv/db";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string; // owner cookie
let tenantId: string;
const acct: Record<string, string> = {};

const post = (body: Record<string, unknown>) => t.call(c, "POST", "/vouchers", body);
const dr = (accountId: string, amount: string) => ({ accountId, debit: amount });
const cr = (accountId: string, amount: string) => ({ accountId, credit: amount });

beforeAll(async () => {
  t = await testApp();
  const s = await t.signup("books");
  c = s.cookie;
  tenantId = s.body.tenantId;
  const accounts: { id: string; key: string | null }[] = (await t.call(c, "GET", "/accounts")).body;
  for (const a of accounts) if (a.key) acct[a.key] = a.id;
  const groups: { id: string; key: string }[] = (await t.call(c, "GET", "/accounts/groups")).body;
  const group = (key: string) => groups.find((g) => g.key === key)!.id;
  acct.hdfc = (await t.call(c, "POST", "/accounts", { name: "HDFC Bank", groupId: group("bank_accounts"), bank: { ifsc: "HDFC0000123" } })).body.id;
  acct.ramesh = (await t.call(c, "POST", "/accounts", { name: "Ramesh Stores", groupId: group("sundry_debtors"), gstin: "27AAPFU0939F1ZV" })).body.id;
});
afterAll(() => t.close());

describe("chart of accounts", () => {
  it("is seeded at signup with the Indian template", () => {
    for (const key of ["cash", "sales", "purchases", "output_cgst", "input_igst", "round_off", "owners_capital"]) expect(acct[key], key).toBeTruthy();
  });

  it("takes the party's state and PAN from its GSTIN and refuses duplicate names", async () => {
    const accounts = (await t.call(c, "GET", "/accounts")).body;
    expect(accounts.find((a: { id: string }) => a.id === acct.ramesh)).toMatchObject({ stateCode: "27", pan: "AAPFU0939F" });
    const groups = (await t.call(c, "GET", "/accounts/groups")).body;
    const dup = await t.call(c, "POST", "/accounts", { name: "hdfc bank", groupId: groups[0].id });
    expect(dup.body.error).toBe("account_name_taken");
  });
});

describe("vouchers and reports", () => {
  it("posts a month of typical entries and the books balance", async () => {
    const capital = await post({ type: "receipt", date: "2026-06-01", narration: "Capital introduced", lines: [dr(acct.cash!, "100000"), cr(acct.owners_capital!, "100000")] });
    expect(capital.status).toBe(201);
    expect(capital.body.number).toBe("RCT/26-27/00001");
    expect((await post({ type: "contra", date: "2026-06-02", lines: [dr(acct.hdfc!, "60000"), cr(acct.cash!, "60000")] })).body.number).toBe("CV/26-27/00001");
    await post({ type: "journal", date: "2026-06-05", narration: "Credit sale", lines: [dr(acct.ramesh!, "11800"), cr(acct.sales!, "10000"), cr(acct.output_cgst!, "900"), cr(acct.output_sgst!, "900")] });
    await post({ type: "receipt", date: "2026-06-20", lines: [dr(acct.hdfc!, "5900"), cr(acct.ramesh!, "5900")] });
    const rent = await post({ type: "payment", date: "2026-06-30", narration: "June rent", lines: [dr(acct.rent!, "15000"), cr(acct.hdfc!, "15000")] });
    expect(rent.body.number).toBe("PAY/26-27/00001");

    const tb = (await t.call(c, "GET", "/reports/trial-balance?asOf=2026-06-30")).body;
    expect(tb.totalDebit).toBe(tb.totalCredit);
    expect(tb.totalDebit).toBe("111800.00"); // Dr: cash 40,000 + bank 50,900 + Ramesh 5,900 + rent 15,000

    const pl = (await t.call(c, "GET", "/reports/profit-loss?from=2026-04-01&to=2026-06-30")).body;
    expect(pl.grossProfit).toBe("10000.00");
    expect(pl.netProfit).toBe("-5000.00");

    const bs = (await t.call(c, "GET", "/reports/balance-sheet?asOf=2026-06-30")).body;
    expect(bs.difference).toBe("0.00");
    expect(bs.totalAssets).toBe("96800.00"); // cash 40,000 + bank 50,900 + Ramesh 5,900

    const ledger = (await t.call(c, "GET", `/reports/ledger/${acct.hdfc}?from=2026-06-01&to=2026-06-30`)).body;
    expect(ledger.rows.map((r: { balance: string }) => r.balance)).toEqual(["60000.00", "65900.00", "50900.00"]);
  });

  it("rejects vouchers that break the rules", async () => {
    expect((await post({ type: "payment", date: "2026-07-01", lines: [dr(acct.rent!, "100"), cr(acct.owners_capital!, "100")] })).body.error).toBe("payment_needs_cash_bank_credit");
    expect((await post({ type: "journal", date: "2026-07-01", lines: [dr(acct.rent!, "100"), cr(acct.cash!, "99.99")] })).body.error).toBe("unbalanced");
    expect((await post({ type: "journal", date: "2026-03-31", lines: [dr(acct.rent!, "100"), cr(acct.cash!, "100")] })).body.error).toBe("before_books_begin");
  });

  it("is idempotent on clientId, so an offline device can retry a sync", async () => {
    const clientId = crypto.randomUUID();
    const body = { type: "journal", date: "2026-07-02", clientId, lines: [dr(acct.electricity!, "2300"), cr(acct.cash!, "2300")] };
    const first = await post(body);
    const again = await post(body);
    expect(first.status).toBe(201);
    expect(again.status).toBe(200);
    expect(again.body.id).toBe(first.body.id);
  });

  it("cancels by posting a reversal, never by deleting", async () => {
    const v = await post({ type: "journal", date: "2026-07-03", lines: [dr(acct.salaries!, "8000"), cr(acct.cash!, "8000")] });
    const before = (await t.call(c, "GET", "/reports/trial-balance?asOf=2026-07-31")).body;
    expect((await t.call(c, "POST", `/vouchers/${v.body.id}/cancel`, { reason: "Entered twice" })).status).toBe(200);
    const after = (await t.call(c, "GET", "/reports/trial-balance?asOf=2026-07-31")).body;
    const salary = (tb: { rows: { accountId: string; dr: string }[] }) => tb.rows.find((r) => r.accountId === acct.salaries)?.dr ?? "0.00";
    expect(salary(before)).toBe("8000.00");
    expect(salary(after)).toBe("0.00");
    expect((await t.call(c, "POST", `/vouchers/${v.body.id}/cancel`, { reason: "again" })).body.error).toBe("already_cancelled");
  });

  it("opens the next financial year on the first entry dated in it", async () => {
    const v = await post({ type: "journal", date: "2027-04-02", lines: [dr(acct.rent!, "100"), cr(acct.cash!, "100")] });
    expect(v.body.number).toBe("JV/27-28/00001");
  });

  it("locks a period: no new entries or cancellations on or before the lock date", async () => {
    const fys = (await t.call(c, "GET", "/fiscal-years")).body;
    const fy = fys.find((f: { label: string }) => f.label === "2026-27");
    const old = (await t.call(c, "GET", "/vouchers?from=2026-06-01&to=2026-06-30")).body[0];
    expect((await t.call(c, "PATCH", `/fiscal-years/${fy.id}`, { lockedUpTo: "2026-06-30" })).status).toBe(200);
    expect((await post({ type: "journal", date: "2026-06-15", lines: [dr(acct.rent!, "1"), cr(acct.cash!, "1")] })).body.error).toBe("period_locked");
    expect((await t.call(c, "POST", `/vouchers/${old.id}/cancel`, { reason: "too late" })).body.error).toBe("period_locked");
    expect((await post({ type: "journal", date: "2026-07-15", lines: [dr(acct.rent!, "1"), cr(acct.cash!, "1")] })).status).toBe(201);
  });
});

describe("ledger integrity in the database itself", () => {
  it("refuses to edit posted ledger rows", async () => {
    await expect(t.ownerDb.db.execute(sql`update gl_entries set debit = debit + 1`)).rejects.toMatchObject({ cause: { message: expect.stringMatching(/append-only/) } });
  });

  it("refuses an unbalanced set of ledger rows at commit", async () => {
    const [v] = await withTenant(t.appDb.db, tenantId, (tx) => tx.execute<{ id: string; company_id: string }>(sql`select id, company_id from vouchers limit 1`));
    await expect(withTenant(t.appDb.db, tenantId, (tx) =>
      tx.execute(sql`insert into gl_entries (tenant_id, company_id, voucher_id, account_id, date, debit) values (${tenantId}, ${v!.company_id}, ${v!.id}, ${acct.cash}, '2026-08-01', 1)`),
    )).rejects.toThrow();
  });
});
