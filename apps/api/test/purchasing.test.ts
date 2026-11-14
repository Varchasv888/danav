import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
let setup: { uoms: { id: string; code: string }[]; warehouses: { id: string; name: string }[] };

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const balanceOf = async (accountId: string, asOf = "2026-09-30") =>
  ((await get(`/reports/trial-balance?asOf=${asOf}`)).rows as { accountId: string; dr: string; cr: string }[]).find((r) => r.accountId === accountId) ?? { dr: "0.00", cr: "0.00" };
const stock = async (asOf = "2026-09-30") => get(`/reports/stock-summary?asOf=${asOf}`);
const itemRow = (s: { rows: { itemId: string }[] }, itemId: string) => s.rows.find((r) => r.itemId === itemId) as { qty: string; value: string; warehouses: { name: string; qty: string }[] };

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("stockist")).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  const creditors = groups.find((g) => g.key === "sundry_creditors")!.id;
  id.karnataka = (await post("/accounts", { name: "Karnataka Wholesale", groupId: creditors, gstin: "29AAGCB7383J1Z4" })).body.id;
  id.local = (await post("/accounts", { name: "Pune Traders", groupId: creditors, stateCode: "27" })).body.id;
  const debtors = groups.find((g) => g.key === "sundry_debtors")!.id;
  id.customer = (await post("/accounts", { name: "A Customer", groupId: debtors })).body.id;
  const accounts: { id: string; key: string | null }[] = await get("/accounts");
  for (const a of accounts) if (a.key) id[a.key] = a.id;

  setup = await get("/inventory/setup");
  const uom = (code: string) => setup.uoms.find((u) => u.code === code)!.id;
  id.main = setup.warehouses[0]!.id;
  id.godown = (await post("/warehouses", { name: "Godown 2" })).body.id;
  id.rice = (await post("/items", { name: "Basmati Rice 5kg", hsn: "1006", gstRate: "5", uomId: uom("BAG"), purchaseRate: "420", saleRate: "520" })).body.id;
  id.sugar = (await post("/items", { name: "Sugar", hsn: "1701", gstRate: "5", uomId: uom("KGS"), purchaseRate: "40" })).body.id;
  id.freight = (await post("/items", { name: "Freight", kind: "service", hsn: "996511", gstRate: "18", uomId: uom("OTH") })).body.id;
});
afterAll(() => t.close());

describe("items", () => {
  it("validates HSN/SAC and GST rates", async () => {
    const uom = setup.uoms[0]!.id;
    expect((await post("/items", { name: "Bad HSN", hsn: "12", uomId: uom })).body.error).toBe("invalid_hsn");
    expect((await post("/items", { name: "Bad SAC", kind: "service", hsn: "123456", uomId: uom })).body.error).toBe("invalid_sac");
    expect((await post("/items", { name: "Bad rate", gstRate: "13", uomId: uom })).status).toBe(400);
    expect((await post("/items", { name: "basmati rice 5KG", uomId: uom })).body.error).toBe("item_name_taken");
  });
});

describe("a purchase cycle", () => {
  let order: { id: string; number: string; total: string };
  let orderLines: { id: string; itemId: string }[];
  let bill: { id: string };

  it("opening stock is dated the day before books begin and shows in the trial balance", async () => {
    const r = await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.rice, warehouseId: id.main, qty: "10", rate: "400" }] });
    expect(r.status).toBe(201);
    expect(r.body.date).toBe("2026-03-31");
    const tb = await get("/reports/trial-balance?asOf=2026-09-30");
    expect(tb.openingStock).toBe("4000.00");
    expect(tb.openingDifference).toBe("4000.00"); // nothing on the capital side yet, exactly as Tally would show
    expect((await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.freight, warehouseId: id.main, qty: "1", rate: "1" }] })).body.error).toBe("service_has_no_stock");
  });

  it("raises a purchase order to an inter-state supplier (IGST)", async () => {
    const r = await post("/purchase-orders", { supplierId: id.karnataka, date: "2026-06-01", lines: [
      { itemId: id.rice, qty: "100", rate: "420" }, { itemId: id.sugar, qty: "50", rate: "40" },
    ] });
    expect(r.status).toBe(201);
    order = r.body;
    expect(order.number).toBe("PO/26-27/00001");
    expect(r.body).toMatchObject({ supplyKind: "inter", taxable: "44000.00", igst: "2200.00", total: "46200.00" });
    orderLines = (await get(`/purchase-orders/${order.id}`)).lines;
  });

  let receiptLineId = "";
  it("receives part of the order into stock, and refuses to over-receive", async () => {
    const riceLine = orderLines.find((l) => l.itemId === id.rice)!;
    const r = await post("/goods-receipts", { supplierId: id.karnataka, orderId: order.id, date: "2026-06-05", lines: [{ itemId: id.rice, qty: "60", orderLineId: riceLine.id }] });
    expect(r.status).toBe(201);
    expect(r.body.number).toBe("GRN/26-27/00001");
    receiptLineId = (await get(`/goods-receipts/${r.body.id}`)).lines[0].id;
    expect((await get(`/purchase-orders/${order.id}`)).status).toBe("partial");
    const over = await post("/goods-receipts", { supplierId: id.karnataka, orderId: order.id, date: "2026-06-06", lines: [{ itemId: id.rice, qty: "41", orderLineId: riceLine.id }] });
    expect(over.body.error).toBe("over_receipt");
    const s = itemRow(await stock(), id.rice);
    expect(s).toMatchObject({ qty: "70.0000", value: "29200.00" }); // 10 × 400 + 60 × 420
  });

  it("books the supplier's bill against the receipt, plus freight, and posts GST to the ledger", async () => {
    const r = await post("/purchase-bills", {
      supplierId: id.karnataka, date: "2026-06-08", supplierInvoiceNo: "KW/1234", supplierInvoiceDate: "2026-06-05",
      lines: [{ itemId: id.rice, qty: "60", rate: "420", receiptLineId }, { itemId: id.freight, qty: "1", rate: "500" }],
    });
    expect(r.status).toBe(201);
    bill = r.body;
    expect(r.body).toMatchObject({ number: "PB/26-27/00001", supplyKind: "inter", taxable: "25700.00", igst: "1350.00", total: "27050.00", warnings: [] });
    expect((await balanceOf(id.karnataka)).cr).toBe("27050.00");
    expect((await balanceOf(id.input_igst)).dr).toBe("1350.00");
    expect((await balanceOf(id.purchases)).dr).toBe("25700.00");
    // The freight is a service, so it didn't touch stock; the rice was already in via the GRN.
    expect(itemRow(await stock(), id.rice).qty).toBe("70.0000");
    expect((await get(`/purchase-orders/${order.id}`)).lines.find((l: { itemId: string }) => l.itemId === id.rice).billedQty).toBe("60.0000");
  });

  it("won't book the same supplier invoice twice, or bill more than was received", async () => {
    const dup = await post("/purchase-bills", {
      supplierId: id.karnataka, date: "2026-06-09", supplierInvoiceNo: "KW/1234", supplierInvoiceDate: "2026-06-05",
      lines: [{ itemId: id.freight, qty: "1", rate: "10" }],
    });
    expect(dup.body.error).toBe("duplicate_supplier_invoice");
    const over = await post("/purchase-bills", {
      supplierId: id.karnataka, date: "2026-06-09", supplierInvoiceNo: "KW/1235", supplierInvoiceDate: "2026-06-09",
      lines: [{ itemId: id.rice, qty: "1", rate: "420", receiptLineId }],
    });
    expect(over.body.error).toBe("over_billing");
    expect((await post("/purchase-bills", {
      supplierId: id.customer, date: "2026-06-09", supplierInvoiceNo: "X1", supplierInvoiceDate: "2026-06-09", lines: [{ itemId: id.sugar, qty: "1", rate: "1" }],
    })).body.error).toBe("not_a_supplier");
  });

  it("books a local (CGST + SGST) bill straight into a second warehouse", async () => {
    const r = await post("/purchase-bills", {
      supplierId: id.local, date: "2026-06-10", supplierInvoiceNo: "PT-77", supplierInvoiceDate: "2026-06-10",
      lines: [{ itemId: id.sugar, qty: "20", rate: "42", warehouseId: id.godown }],
    });
    expect(r.body).toMatchObject({ supplyKind: "intra", taxable: "840.00", cgst: "21.00", sgst: "21.00", total: "882.00" });
    const s = itemRow(await stock(), id.sugar);
    expect(s).toMatchObject({ qty: "20.0000", value: "840.00" });
    expect(s.warehouses[0]).toMatchObject({ name: "Godown 2", qty: "20.0000" });
  });

  it("carries stock into the P&L and balance sheet (periodic, like Tally)", async () => {
    const pl = await get("/reports/profit-loss?from=2026-04-01&to=2026-09-30");
    expect(pl.openingStock).toBe("4000.00");
    expect(pl.closingStock).toBe("30040.00"); // rice 29,200 + sugar 840
    expect(pl.grossProfit).toBe("-500.00"); // only the freight is a real cost so far
    const bs = await get("/reports/balance-sheet?asOf=2026-09-30");
    expect(bs.closingStock).toBe("30040.00");
    expect(bs.difference).toBe("4000.00"); // the unbalanced opening stock, same as the trial balance
  });

  it("transfers keep total value; adjustments and issues reduce it", async () => {
    const tr = await post("/stock-journals", { kind: "transfer", date: "2026-06-12", lines: [{ itemId: id.rice, warehouseId: id.main, toWarehouseId: id.godown, qty: "5" }] });
    expect(tr.status).toBe(201);
    let s = await stock();
    expect(s.totalValue).toBe("30040.00");
    expect(itemRow(s, id.rice).warehouses.map((w) => [w.name, w.qty]).sort()).toEqual([["Godown 2", "5.0000"], ["Main store", "65.0000"]]);
    const adj = await post("/stock-journals", { kind: "adjustment", date: "2026-06-13", narration: "Physical count shortage", lines: [{ itemId: id.sugar, warehouseId: id.godown, qty: "2", direction: "out" }] });
    expect(adj.status).toBe(201);
    s = await stock();
    expect(itemRow(s, id.sugar)).toMatchObject({ qty: "18.0000", value: "756.00" });
  });

  let returnId = "";
  it("returns goods to the supplier with a debit note", async () => {
    const lines = (await get(`/purchase-bills/${bill.id}`)).lines as { id: string; itemId: string }[];
    const riceLine = lines.find((l) => l.itemId === id.rice)!;
    expect((await post("/purchase-returns", { billId: bill.id, date: "2026-06-15", reason: "Damaged bags", lines: [{ billLineId: riceLine.id, qty: "61" }] })).body.error).toBe("over_return");
    const r = await post("/purchase-returns", { billId: bill.id, date: "2026-06-15", reason: "Damaged bags", lines: [{ billLineId: riceLine.id, qty: "10" }] });
    expect(r.status).toBe(201);
    returnId = r.body.id;
    expect(r.body).toMatchObject({ number: "DN/26-27/00001", taxable: "4200.00", igst: "210.00", total: "4410.00" });
    expect((await balanceOf(id.karnataka)).cr).toBe("22640.00");
    expect(itemRow(await stock(), id.rice).qty).toBe("60.0000");
  });

  it("cancels in the right order: a bill with returns stays; after the return is cancelled, the bill can go", async () => {
    expect((await post(`/purchase-bills/${bill.id}/cancel`, { reason: "Wrong supplier" })).body.error).toBe("bill_has_returns");
    expect((await post(`/purchase-returns/${returnId}/cancel`, { reason: "Entered by mistake" })).status).toBe(200);
    expect((await post(`/purchase-bills/${bill.id}/cancel`, { reason: "Wrong supplier" })).status).toBe(200);
    expect((await balanceOf(id.karnataka)).cr).toBe("0.00");
    // The GRN's stock stays until the GRN itself is cancelled.
    expect(itemRow(await stock(), id.rice).qty).toBe("70.0000");
    const grns = await get("/goods-receipts");
    expect(grns[0].status).toBe("posted");
    expect((await post(`/goods-receipts/${grns[0].id}/cancel`, { reason: "Returned whole lot" })).status).toBe(200);
    expect(itemRow(await stock(), id.rice).qty).toBe("10.0000");
    expect((await get(`/purchase-orders/${order.id}`)).status).toBe("open");
  });

  it("lists items below their reorder level", async () => {
    await t.call(c, "PATCH", `/items/${id.sugar}`, { reorderLevel: "50", reorderQty: "100" });
    const r = await get("/reports/reorder");
    expect(r.map((x: { itemId: string }) => x.itemId)).toContain(id.sugar);
    expect(r.find((x: { itemId: string }) => x.itemId === id.sugar).suggestedQty).toBe("100.0000");
  });

  it("respects period locks", async () => {
    const fys: { id: string; label: string }[] = await get("/fiscal-years");
    await t.call(c, "PATCH", `/fiscal-years/${fys.find((f) => f.label === "2026-27")!.id}`, { lockedUpTo: "2026-06-30" });
    const r = await post("/goods-receipts", { supplierId: id.local, date: "2026-06-20", lines: [{ itemId: id.sugar, qty: "1", rate: "40" }] });
    expect(r.body.error).toBe("period_locked");
  });

  it("keeps the stock ledger append-only", async () => {
    await expect(t.ownerDb.db.execute(sql`update stock_ledger set qty_in = qty_in + 1`)).rejects.toMatchObject({ cause: { message: expect.stringMatching(/append-only/) } });
  });
});
