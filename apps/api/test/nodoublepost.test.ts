import { afterAll, beforeAll, describe, expect, it } from "vitest";
import postgres from "postgres";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

const OWNER_URL = process.env.DATABASE_OWNER_URL ?? "postgres://varchasv_owner:varchasv_owner_dev@localhost:5433/varchasv";
let t: Awaited<ReturnType<typeof testApp>>;
let owner: ReturnType<typeof postgres>;
let c: string;
let tenantId = "";
const id: Record<string, string> = {};
const today = businessDate();

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown = {}) => t.call(c, "POST", url, body);

beforeAll(async () => {
  owner = postgres(OWNER_URL, { max: 1 });
  t = await testApp();
  const s = await t.signup("nodouble", { gstin: "27AAPFU0939F1ZV" });
  c = s.cookie; tenantId = s.body.tenantId;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  const group = (k: string) => groups.find((g) => g.key === k)!.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.cust = (await post("/accounts", { name: "Double Customer", groupId: group("sundry_debtors"), stateCode: "27" })).body.id;
  id.sup = (await post("/accounts", { name: "Double Supplier", groupId: group("sundry_creditors"), stateCode: "27" })).body.id;
  id.item = (await post("/items", { name: "Double Item", uomId: pcs, gstRate: "5", hsn: "6205", saleRate: "1000", purchaseRate: "400" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.item, warehouseId: id.main, qty: "100", rate: "400" }] });
  id.term = (await post("/pos/terminals", { name: "Counter" })).body.id;
  await post("/pos/sessions", { terminalId: id.term, openingCash: "0" });
});
afterAll(async () => { await t.close(); await owner.end(); });

describe("no flow posts twice", () => {
  it("cancelling an invoice, a bill or a counter bill a second time is refused and reverses nothing more", async () => {
    const inv = await post("/sales-invoices", { customerId: id.cust, date: today, lines: [{ itemId: id.item, qty: "2", rate: "1000" }] });
    expect(inv.status).toBe(201);
    expect((await post(`/sales-invoices/${inv.body.id}/cancel`, { reason: "entered wrongly" })).status).toBe(200);
    expect((await post(`/sales-invoices/${inv.body.id}/cancel`, { reason: "entered wrongly" })).status).toBeGreaterThanOrEqual(400);

    const bill = await post("/purchase-bills", { supplierId: id.sup, date: today, supplierInvoiceNo: "ND/1", supplierInvoiceDate: today, lines: [{ itemId: id.item, qty: "5", rate: "400" }] });
    expect(bill.status).toBe(201);
    expect((await post(`/purchase-bills/${bill.body.id}/cancel`, { reason: "wrong supplier" })).status).toBe(200);
    expect((await post(`/purchase-bills/${bill.body.id}/cancel`, { reason: "wrong supplier" })).status).toBeGreaterThanOrEqual(400);

    const pos = await post("/pos/bills", { terminalId: id.term, lines: [{ itemId: id.item, qty: "1" }], payments: [{ mode: "cash", amount: "1000" }] });
    expect(pos.status).toBe(201);
    expect((await post(`/pos/bills/${pos.body.id}/void`, { reason: "customer left" })).status).toBe(200);
    expect((await post(`/pos/bills/${pos.body.id}/void`, { reason: "customer left" })).status).toBeGreaterThanOrEqual(400);
  });

  it("sending the same counter bill twice makes one bill, one voucher and one stock movement", async () => {
    const billId = crypto.randomUUID();
    const body = { id: billId, terminalId: id.term, lines: [{ itemId: id.item, qty: "3" }], payments: [{ mode: "cash", amount: "3000" }] };
    await post("/pos/bills", body);
    await post("/pos/bills", body);
    const [bills] = await owner`select count(*)::int as n from pos_bills where id = ${billId}`;
    expect(bills!.n).toBe(1);
    const [moves] = await owner`select count(*)::int as n, coalesce(sum(qty_out), 0)::int as out from stock_ledger where source_type = 'pos_bill' and source_id = ${billId}`;
    expect(moves).toMatchObject({ n: 1, out: 3 });
    const [v] = await owner`select count(*)::int as n from vouchers v join pos_bills b on b.voucher_id = v.id where b.id = ${billId}`;
    expect(v!.n).toBe(1);
  });

  it("every voucher balances, every ledger row has its voucher, and no document owns two live vouchers", async () => {
    const unbalanced = await owner`select voucher_id, sum(debit - credit) as diff from gl_entries where tenant_id = ${tenantId} group by voucher_id having sum(debit - credit) <> 0`;
    expect(unbalanced).toHaveLength(0);
    const orphans = await owner`select count(*)::int as n from gl_entries e left join vouchers v on v.id = e.voucher_id where e.tenant_id = ${tenantId} and v.id is null`;
    expect(orphans[0]!.n).toBe(0);
    for (const [table, col] of [["sales_invoices", "voucher_id"], ["purchase_bills", "voucher_id"], ["pos_bills", "voucher_id"]] as const) {
      const dup = await owner.unsafe(`select ${col}, count(*)::int as n from ${table} where tenant_id = $1 and ${col} is not null group by ${col} having count(*) > 1`, [tenantId]);
      expect(dup, table).toHaveLength(0);
    }
  });

  it("a cancelled document's ledger entries net to zero", async () => {
    const rows = await owner`
      select v.id, sum(e.debit - e.credit) as net, sum(e.debit) as dr from vouchers v join gl_entries e on e.voucher_id = v.id
      where v.tenant_id = ${tenantId} and v.status = 'cancelled' group by v.id`;
    expect(rows.length).toBeGreaterThan(0);
    for (const r of rows) expect(Number(r.net)).toBe(0);
    // Cancelled once means reversed once: the reversal rows equal the original rows in total.
    const [{ orig, rev }] = (await owner`
      select coalesce(sum(case when not e.is_reversal then e.debit end), 0)::numeric as orig, coalesce(sum(case when e.is_reversal then e.debit end), 0)::numeric as rev
      from vouchers v join gl_entries e on e.voucher_id = v.id where v.tenant_id = ${tenantId} and v.status = 'cancelled'`) as unknown as { orig: string; rev: string }[];
    expect(Number(rev)).toBe(Number(orig));
  });
});
