import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { OWNER_URL, testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
let owner: ReturnType<typeof postgres>;
const id: Record<string, string> = {};

const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const integrity = async () => (await t.call(c, "GET", "/reports/integrity")).body as { ok: boolean; checks: { key: string; ok: boolean; difference: string | null; items: { ref: string }[] }[] };
const check = async (key: string) => (await integrity()).checks.find((x) => x.key === key)!;

beforeAll(async () => {
  t = await testApp();
  owner = postgres(OWNER_URL, { max: 1 });
  c = (await t.signup("integrity", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = (await t.call(c, "GET", "/accounts/groups")).body;
  id.shop = (await post("/accounts", { name: "Integrity Shop", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  for (const a of (await t.call(c, "GET", "/accounts")).body as { id: string; key: string | null }[]) if (a.key) id[a.key] = a.id;
  const setup = (await t.call(c, "GET", "/inventory/setup")).body;
  id.main = setup.warehouses[0].id;
  id.rice = (await post("/items", { name: "Rice 25kg", hsn: "1006", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "BAG").id, saleRate: "500" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.rice, warehouseId: id.main, qty: "10", rate: "400" }] });
  id.invoice = (await post("/sales-invoices", { customerId: id.shop, date: "2026-09-01", lines: [{ itemId: id.rice, qty: "2", rate: "500" }] })).body.id;
  await post("/vouchers", { type: "receipt", date: "2026-09-05", lines: [{ accountId: id.cash, debit: "300" }, { accountId: id.shop, credit: "300" }] });
});
afterAll(async () => {
  await owner.end();
  await t.close();
});

describe("integrity checks", () => {
  it("find nothing wrong in books made by the app", async () => {
    const r = await integrity();
    expect(r.ok).toBe(true);
    expect(r.checks.map((x) => x.key)).toEqual(expect.arrayContaining(["vouchersBalance", "trialBalance", "gstMatchesInvoices", "payrollMatchesLedger", "invoicesMatchLedger", "billsMatchLedger", "documentsPosted", "cancelledReversed", "receivablesMatch", "payablesMatch", "giftVoucherLiability", "negativeStock"]));
    expect(r.checks.filter((x) => !x.ok)).toEqual([]);
  });

  it("flag an invoice whose ledger entry was altered, and name the invoice", async () => {
    await owner.begin(async (sql) => {
      await sql`alter table gl_entries disable trigger gl_entries_no_change`;
      await sql`update gl_entries set debit = debit + 7 where voucher_id = (select voucher_id from sales_invoices where id = ${id.invoice}) and account_id = ${id.shop}`;
      await sql`alter table gl_entries enable trigger gl_entries_no_change`;
    });
    const r = await integrity();
    expect(r.ok).toBe(false);
    const inv = r.checks.find((x) => x.key === "invoicesMatchLedger")!;
    expect(inv.ok).toBe(false);
    expect(inv.items[0]!.ref).toMatch(/^INV\//);
    expect(r.checks.find((x) => x.key === "vouchersBalance")!.ok).toBe(false);
    expect(r.checks.find((x) => x.key === "trialBalance")!.difference).toBe("7.00");
  });

  it("flag opening balances that do not balance, and stock below zero as a warning", async () => {
    await owner`update accounts set opening_balance = 100 where id = ${id.cash}`;
    expect((await check("trialBalance")).difference).toBe("107.00");
    await owner`insert into stock_ledger (tenant_id, company_id, item_id, warehouse_id, date, qty_in, qty_out, rate, source_type, source_id)
      select tenant_id, company_id, item_id, warehouse_id, date, 0, 50, 0, 'stock_journal', gen_random_uuid() from stock_ledger where item_id = ${id.rice} limit 1`;
    const neg = await check("negativeStock");
    expect(neg.ok).toBe(false);
    expect(neg.items[0]!.ref).toBe("Rice 25kg");
  });

  it("keep businesses apart", async () => {
    const other = (await t.signup("integrity-other")).cookie;
    const r = (await t.call(other, "GET", "/reports/integrity")).body as { ok: boolean };
    expect(r.ok).toBe(true);
  });
});
