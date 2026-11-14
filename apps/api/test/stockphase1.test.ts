import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

process.env.ENABLE_STOCK_CLOSE_JOURNAL = "true";

let t: Awaited<ReturnType<typeof testApp>>;
let owner: string;
let supplierId: string;
let itemId: string;
let freightId: string;
const today = businessDate();

const get = (url: string) => t.call(owner, "GET", url);
const post = (url: string, body: unknown) => t.call(owner, "POST", url, body);

beforeAll(async () => {
  t = await testApp();
  owner = (await t.signup("stockphase1")).cookie;
  const groups = await get("/accounts/groups");
  const supplierGroup = groups.body.find((g: { key: string }) => g.key === "sundry_creditors");
  supplierId = (await post("/accounts", { name: "Inward Cost Supplier", groupId: supplierGroup.id })).body.id;
  const account = (await get("/accounts")).body.find((a: { key: string }) => a.key === "freight_inward");
  freightId = account.id;
  const setup = (await get("/inventory/setup")).body;
  itemId = (await post("/items", { name: "Phase 1 landed-cost item", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, purchaseRate: "100" })).body.id;
});

afterAll(() => t.close());

describe("Phase 1 purchase and stock close acceptance", () => {
  it("receives and costs goods, posts the purchase and freight bills, then reconciles stock to the ledger", async () => {
    const receipt = await post("/goods-receipts", {
      supplierId, date: today, supplierChallan: "CH-PH1-1",
      lines: [{ itemId, qty: "5", rate: "100", landedCostPerUnit: "12.50", landedCostNote: "Inward freight invoice AF-2026-01" }],
    });
    expect(receipt.status, JSON.stringify(receipt.body)).toBe(201);
    const receiptLineId = (await get(`/goods-receipts/${receipt.body.id}`)).body.lines[0].id;

    const bill = await post("/purchase-bills", {
      supplierId, date: today, supplierInvoiceNo: "PH1-001", supplierInvoiceDate: today,
      lines: [{ itemId, qty: "5", rate: "100", gstRate: "0", receiptLineId }],
    });
    expect(bill.status, JSON.stringify(bill.body)).toBe(201);

    const freightVoucher = await post("/vouchers", {
      type: "journal", date: today, narration: "Inward freight invoice AF-2026-01",
      lines: [{ accountId: freightId, debit: "62.50" }, { accountId: supplierId, credit: "62.50" }],
    });
    expect(freightVoucher.status, JSON.stringify(freightVoucher.body)).toBe(201);

    const stock = await get(`/reports/stock-summary?asOf=${today}`);
    expect(stock.body.rows.find((row: { itemId: string }) => row.itemId === itemId)).toMatchObject({ qty: "5.0000", rate: "112.50", value: "562.50" });
    const beforeClose = await get(`/reports/stock-ledger-reconciliation?asOf=${today}`);
    expect(beforeClose.body).toMatchObject({ stockSubledgerValue: "562.50", stockInHandLedgerValue: "0.00", difference: "562.50", status: "review_required" });

    const close = await post("/inventory/stock-ledger-reconciliations", { asOf: today, reason: "Reviewed receipt and inward freight source invoices", landedCostsBooked: true });
    expect(close.status, JSON.stringify(close.body)).toBe(200);
    const afterClose = await get(`/reports/stock-ledger-reconciliation?asOf=${today}`);
    expect(afterClose.body).toMatchObject({ stockSubledgerValue: "562.50", stockInHandLedgerValue: "562.50", difference: "0.00", status: "reconciled" });
  });
});
