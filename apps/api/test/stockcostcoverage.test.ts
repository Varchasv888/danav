import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

process.env.ENABLE_STOCK_CLOSE_JOURNAL = "true";

let t: Awaited<ReturnType<typeof testApp>>;
let owner: string;
const ids: Record<string, string> = {};
const today = businessDate();

const get = (url: string) => t.call(owner, "GET", url);
const post = (url: string, body: unknown) => t.call(owner, "POST", url, body);

beforeAll(async () => {
  t = await testApp();
  const signup = await t.signup("stockcostcoverage", { gstin: "27AAPFU0939F1ZV" });
  expect(signup.status, JSON.stringify(signup.body)).toBe(201);
  owner = signup.cookie;
  const setupResponse = await get("/inventory/setup");
  expect(setupResponse.status).toBe(200);
  const setup = setupResponse.body;
  expect(setup.valuationMethodLocked).toBe(false);
  ids.warehouse = setup.warehouses[0].id;
  ids.covered = (await post("/items", { name: "Costed stock", uomId: setup.uoms[0].id, purchaseRate: "12" })).body.id;
  ids.uncovered = (await post("/items", { name: "Zero value stock", uomId: setup.uoms[0].id, purchaseRate: "12" })).body.id;
  ids.soldOut = (await post("/items", { name: "Sold out stock", uomId: setup.uoms[0].id })).body.id;
  await t.call(owner, "PATCH", "/inventory/valuation-method", { method: "fifo" });
  await post("/stock-journals", { kind: "opening", lines: [
    { itemId: ids.covered, warehouseId: ids.warehouse, qty: "5", rate: "12" },
    { itemId: ids.uncovered, warehouseId: ids.warehouse, qty: "3", rate: "0" },
  ] });
});

afterAll(() => t.close());

describe("stock cost coverage report", () => {
  it("lists positive stock positions and flags those with no carrying value using the active valuation method", async () => {
    const response = await get(`/reports/stock-cost-coverage?asOf=${today}`);

    expect(response.status).toBe(200);
    expect(response.body.method).toBe("fifo");
    expect(response.body.asOf).toBe(today);
    expect(response.body.summary).toMatchObject({
      positivePositions: 2,
      positionsWithZeroValue: 1,
      zeroValueQty: "3.0000",
      positivePositionValue: "60.00",
    });
    expect(response.body.rows).toEqual(expect.arrayContaining([
      expect.objectContaining({ itemId: ids.covered, qty: "5.0000", value: "60.00", hasPositiveCarryingValue: true }),
      expect.objectContaining({ itemId: ids.uncovered, qty: "3.0000", value: "0.00", hasPositiveCarryingValue: false }),
    ]));
    expect(response.body.rows).not.toEqual(expect.arrayContaining([expect.objectContaining({ itemId: ids.soldOut })]));
  });

  it("supports a single warehouse filter", async () => {
    const scoped = await get(`/reports/stock-cost-coverage?asOf=${today}&warehouseId=${ids.warehouse}`);
    expect(scoped.status).toBe(200);
    expect(scoped.body.rows.every((row: { warehouseId: string }) => row.warehouseId === ids.warehouse)).toBe(true);
  });

  it("shows the periodic stock-register value beside the actual Stock-in-Hand ledger balance", async () => {
    const response = await get(`/reports/stock-ledger-reconciliation?asOf=${today}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      accountingMethod: "periodic", valuationMethod: "fifo", stockSubledgerValue: "60.00",
      stockInHandLedgerValue: "0.00", difference: "60.00", status: "review_required",
    });
    expect(response.body.stockInHandAccounts).toEqual([expect.objectContaining({ name: "Closing Stock", balance: "0.00" })]);
  });

  it("posts a reviewed closing-stock journal and makes an unchanged repeat idempotent", async () => {
    const initialTieout = await get(`/reports/stock-ledger-reconciliation?asOf=${today}`);
    const unbalancedOpening = await post("/inventory/stock-ledger-reconciliations", { asOf: today, reason: "Opening mismatch check", landedCostsBooked: true });
    expect(unbalancedOpening.status).toBe(409);
    expect(unbalancedOpening.body.error).toBe("opening_stock_balance_mismatch");
    const accountsResponse = await t.call(owner, "GET", "/accounts");
    expect(accountsResponse.status, JSON.stringify(accountsResponse.body)).toBe(200);
    const accounts = accountsResponse.body as { id: string; key: string | null }[];
    const stockLedger = accounts.find((account: { key: string }) => account.key === "closing_stock");
    const capitalLedger = accounts.find((account: { key: string }) => account.key === "owners_capital");
    expect(stockLedger).toBeTruthy();
    expect(capitalLedger).toBeTruthy();
    await t.call(owner, "PATCH", `/accounts/${stockLedger.id}`, { openingBalance: "60.00" });
    await t.call(owner, "PATCH", `/accounts/${capitalLedger.id}`, { openingBalance: "-60.00" });
    const movement = await post("/stock-journals", { kind: "adjustment", date: today, lines: [{ itemId: ids.covered, warehouseId: ids.warehouse, qty: "1", direction: "in", rate: "12" }] });
    expect(movement.status).toBe(201);
    expect(initialTieout.body.stockSubledgerValue).toBe("60.00");
    const unconfirmed = await post("/inventory/stock-ledger-reconciliations", { asOf: today, reason: "Month-end stock count reviewed", landedCostsBooked: false });
    expect(unconfirmed.status).toBe(400);
    expect(unconfirmed.body.error).toBe("landed_costs_not_booked");
    const posted = await post("/inventory/stock-ledger-reconciliations", { asOf: today, reason: "Month-end stock count reviewed", landedCostsBooked: true });
    expect(posted.status, JSON.stringify(posted.body)).toBe(200);
    expect(posted.body).toMatchObject({ difference: "12.00", ledgerValueBefore: "60.00", ledgerValueAfter: "72.00" });
    expect(posted.body.voucherId).toBeTruthy();
    const tieout = await get(`/reports/stock-ledger-reconciliation?asOf=${today}`);
    expect(tieout.body).toMatchObject({ stockSubledgerValue: "72.00", stockInHandLedgerValue: "72.00", difference: "0.00", status: "reconciled" });
    const books = await get(`/reports/profit-loss?from=2026-04-01&to=${today}`);
    expect(books.body).toMatchObject({ grossProfit: "12.00", netProfit: "12.00", openingStock: "60.00", closingStock: "0.00" });
    const balanceSheet = await get(`/reports/balance-sheet?asOf=${today}`);
    expect(balanceSheet.body).toMatchObject({ closingStock: "0.00", totalAssets: "72.00", totalLiabilities: "72.00", difference: "0.00" });
    const trialBalance = await get(`/reports/trial-balance?asOf=${today}`);
    expect(trialBalance.body.totalDebit).toBe(trialBalance.body.totalCredit);

    const repeated = await post("/inventory/stock-ledger-reconciliations", { asOf: today, reason: "No change since prior review", landedCostsBooked: true });
    expect(repeated.status).toBe(200);
    expect(repeated.body).toMatchObject({ noChange: true, voucherId: null, difference: "0.00" });

    const cancelled = await post(`/vouchers/${posted.body.voucherId}/cancel`, { reason: "Closing journal entered in the wrong period" });
    expect(cancelled.status).toBe(200);
    const reopenedPl = await get(`/reports/profit-loss?from=2026-04-01&to=${today}`);
    expect(reopenedPl.body.grossProfit).toBe("12.00");
  });

  it("retains synthetic opening stock in trial balance when inventory was sold out without a close journal", async () => {
    const emptied = await post("/stock-journals", { kind: "issue", date: today, lines: [{ itemId: ids.covered, warehouseId: ids.warehouse, qty: "6" }] });
    expect(emptied.status).toBe(201);
    const trialBalance = await get(`/reports/trial-balance?asOf=${today}`);
    expect(trialBalance.body.openingStock).toBe("60.00");
  });

  it("prevents changing the cost formula after stock transactions exist", async () => {
    expect((await get("/inventory/setup")).body.valuationMethodLocked).toBe(true);
    const response = await t.call(owner, "PATCH", "/inventory/valuation-method", { method: "average" });
    expect(response.status).toBe(409);
    expect(response.body.error).toBe("valuation_method_locked");
  });
});
