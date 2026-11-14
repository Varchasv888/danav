import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const open = async () => (await get(`/bill-receipts/open?kind=receivable&partyId=${id.shop}&asOf=2026-09-30`)) as { advance: string; bills: { voucherId: string; number: string; amount: string }[] };

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("billwise", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.shop = (await post("/accounts", { name: "Bill Wise Shop", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  for (const a of await get("/accounts") as { id: string; key: string | null }[]) if (a.key) id[a.key] = a.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.rice = (await post("/items", { name: "Rice 25kg", hsn: "1006", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "BAG").id, saleRate: "500" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.rice, warehouseId: id.main, qty: "100", rate: "400" }] });
  await post("/sales-invoices", { customerId: id.shop, date: "2026-09-01", lines: [{ itemId: id.rice, qty: "2", rate: "500" }] }); // 1,050 with GST
  await post("/sales-invoices", { customerId: id.shop, date: "2026-09-10", lines: [{ itemId: id.rice, qty: "4", rate: "500" }] }); // 2,100 with GST
});
afterAll(() => t.close());

describe("bill-wise receipt", () => {
  it("settles the bill it names, not the oldest one", async () => {
    const before = await open();
    expect(before.bills.map((b) => b.amount)).toEqual(["1050.00", "2100.00"]);
    const newer = before.bills[1]!;
    const r = await post("/bill-receipts", {
      kind: "receivable", partyId: id.shop, accountId: id.cash, date: "2026-09-15", amount: "2100",
      allocations: [{ billVoucherId: newer.voucherId, amount: "2100" }],
    });
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({ allocated: "2100.00", onAccount: "0.00" });
    const after = await open();
    expect(after.bills.map((b) => [b.number, b.amount])).toEqual([[before.bills[0]!.number, "1050.00"]]);
  });

  it("lets part of a receipt go to a bill and the rest settle oldest first", async () => {
    const [bill] = (await open()).bills;
    // 1,000 on a bill of 1,050 leaves 50 on it; a further 50 on account then clears it oldest first.
    await post("/bill-receipts", { kind: "receivable", partyId: id.shop, accountId: id.cash, date: "2026-09-20", amount: "1000", allocations: [{ billVoucherId: bill!.voucherId, amount: "1000" }] });
    expect((await open()).bills[0]!.amount).toBe("50.00");
    const r = await post("/bill-receipts", { kind: "receivable", partyId: id.shop, accountId: id.cash, date: "2026-09-21", amount: "50", allocations: [] });
    expect(r.body.onAccount).toBe("50.00");
    expect((await open()).bills).toEqual([]);
  });

  it("refuses over-allocation, a bill that is not open, and the same bill twice", async () => {
    const base = { kind: "receivable", partyId: id.shop, accountId: id.cash, date: "2026-09-22" };
    const gone = "00000000-0000-4000-8000-000000000000";
    expect((await post("/bill-receipts", { ...base, amount: "10", allocations: [{ billVoucherId: gone, amount: "10" }] })).body.error).toBe("bill_not_open");
    expect((await post("/bill-receipts", { ...base, amount: "10", allocations: [{ billVoucherId: gone, amount: "6" }, { billVoucherId: gone, amount: "6" }] })).body.error).toBe("over_allocated");
    expect((await post("/bill-receipts", { ...base, amount: "0", allocations: [] })).body.error).toBe("amount_required");
  });

  it("does not let a receipt reach another business's bills", async () => {
    const other = (await t.signup("billwise-other")).cookie;
    const r = await t.call(other, "GET", `/bill-receipts/open?kind=receivable&partyId=${id.shop}`);
    expect(r.body.bills ?? []).toEqual([]);
  });
});

describe("reports from bill-wise settlement and reverse charge", () => {
  it("lists which bills each receipt settled", async () => {
    const r = await get("/reports/bill-adjustments?from=2026-09-01&to=2026-09-30");
    expect(r.rows.map((x: { amount: string; party: string }) => [x.party, x.amount])).toEqual([["Bill Wise Shop", "1000.00"], ["Bill Wise Shop", "2100.00"]]);
    expect(r.total).toBe("3100.00");
  });

  it("lists purchases made under reverse charge, and only those", async () => {
    const groups: { id: string; key: string }[] = await get("/accounts/groups");
    const supplier = (await post("/accounts", { name: "Cartage Supplier", groupId: groups.find((g) => g.key === "sundry_creditors")!.id, stateCode: "27" })).body.id;
    const bill = (reverseCharge: boolean, no: string) => post("/purchase-bills", {
      supplierId: supplier, date: "2026-09-12", supplierInvoiceNo: no, supplierInvoiceDate: "2026-09-10", reverseCharge,
      lines: [{ itemId: id.rice, qty: "10", rate: "500" }],
    });
    expect((await bill(true, "CS/1")).status).toBe(201);
    expect((await bill(false, "CS/2")).status).toBe(201);
    const r = await get("/reports/rcm-register?from=2026-09-01&to=2026-09-30");
    expect(r.rows).toHaveLength(1);
    expect(r.rows[0]).toMatchObject({ supplier: "Cartage Supplier", invoiceNo: "CS/1", taxable: "5000.00" });
    expect(Number(r.totals.cgst) + Number(r.totals.sgst) + Number(r.totals.igst)).toBeGreaterThan(0);
  });
});
