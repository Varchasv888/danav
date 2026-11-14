import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
let landedReceiptId = "";
let landedLineId = "";
let landedItemId = "";

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const stock = async (itemId: string, warehouseId?: string) => {
  const rows = ((await get("/reports/stock-summary?asOf=2026-12-31" + (warehouseId ? `&warehouseId=${warehouseId}` : ""))).rows as { itemId: string; qty: string }[]);
  return Number(rows.find((r) => r.itemId === itemId)?.qty ?? 0);
};

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("receiving", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.mill = (await post("/accounts", { name: "Surat Mills", groupId: groups.find((g) => g.key === "sundry_creditors")!.id, gstin: "24AAACC1206D1ZM", stateCode: "24" })).body.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.cloth = (await post("/items", { name: "Dyed cloth", uomId: setup.uoms.find((u: { code: string }) => u.code === "MTR")?.id ?? setup.uoms[0].id, gstRate: "5", hsn: "5208", purchaseRate: "100" })).body.id;
  const po = await post("/purchase-orders", { supplierId: id.mill, date: "2026-07-01", lines: [{ itemId: id.cloth, qty: "100", rate: "100" }] });
  id.po = po.body.id;
  id.poLine = (await get(`/purchase-orders/${id.po}`)).lines[0].id;
});
afterAll(() => t.close());

describe("receiving with exceptions", () => {
  let grn: { id: string };
  let line: { id: string; qty: string; holdQty: string; shortQty: string; damagedQty: string; challanQty: string };

  it("records what the challan said, what came short or damaged, and what goes on hold, and stocks only what was accepted", async () => {
    expect((await post("/goods-receipts", { supplierId: id.mill, orderId: id.po, date: "2026-07-10", lines: [{ itemId: id.cloth, orderLineId: id.poLine, qty: "50", challanQty: "100", short: "10", damaged: "5", hold: "20" }] })).body.error).toBe("challan_mismatch");
    const r = await post("/goods-receipts", { supplierId: id.mill, orderId: id.po, date: "2026-07-10", lines: [{ itemId: id.cloth, orderLineId: id.poLine, qty: "60", challanQty: "100", short: "10", damaged: "5", hold: "25" }] });
    expect(r.status).toBe(201);
    grn = r.body;
    line = (await get(`/goods-receipts/${grn.id}`)).lines[0];
    expect(line).toMatchObject({ qty: "60.0000", challanQty: "100.0000", shortQty: "10.0000", damagedQty: "5.0000", holdQty: "25.0000" });
    expect(await stock(id.cloth, id.main)).toBe(60);
    expect(await stock(id.cloth)).toBe(85); // 25 more sit on quality hold
    const valued = ((await get("/reports/stock-summary?asOf=2026-12-31")).rows as { itemId: string; value: string; rate: string }[]).find((row) => row.itemId === id.cloth);
    expect(valued).toMatchObject({ value: "8500.00", rate: "100.00" });
  });

  it("adds documented non-recoverable inward cost to the received stock valuation", async () => {
    const item = (await post("/items", { name: "Landed-cost shirt", uomId: (await get("/inventory/setup")).uoms.find((u: { code: string }) => u.code === "PCS").id, purchaseRate: "100" })).body.id;
    landedItemId = item;
    const unsupported = await post("/goods-receipts", {
      supplierId: id.mill, date: "2026-07-15",
      lines: [{ itemId: item, qty: "5", rate: "100", landedCostPerUnit: "12.50" }],
    });
    expect(unsupported.status).toBe(400);
    expect(unsupported.body.error).toBe("landed_cost_source_required");
    const receipt = await post("/goods-receipts", {
      supplierId: id.mill, date: "2026-07-15", supplierChallan: "CH-LANDED-1",
      lines: [{ itemId: item, qty: "5", hold: "2", challanQty: "7", rate: "100", landedCostPerUnit: "12.50", landedCostNote: "Allocated inward freight, invoice LR-77" }],
    });
    expect(receipt.status).toBe(201);
    landedReceiptId = receipt.body.id;
    const lines = (await get(`/goods-receipts/${receipt.body.id}`)).lines;
    landedLineId = lines[0].id;
    expect(lines[0]).toMatchObject({ rate: "100.0000", landedCostPerUnit: "12.5000", landedCostNote: "Allocated inward freight, invoice LR-77" });
    const valued = ((await get("/reports/stock-summary?asOf=2026-12-31")).rows as { itemId: string; value: string; rate: string }[]).find((row) => row.itemId === item);
    expect(valued).toMatchObject({ qty: "7.0000", value: "787.50", rate: "112.50" });
    const stockSummary = await get("/reports/stock-summary?asOf=2026-12-31");
    const tieout = await get("/reports/stock-ledger-reconciliation?asOf=2026-12-31");
    expect(tieout).toMatchObject({ accountingMethod: "periodic", stockSubledgerValue: stockSummary.totalValue, stockInHandLedgerValue: "0.00", difference: stockSummary.totalValue, status: "review_required" });
  });

  it("allocates a shared landed charge across receipt lines and excludes recoverable GST", async () => {
    const pcs = (await get("/inventory/setup")).uoms.find((u: { code: string }) => u.code === "PCS").id;
    const shirt = (await post("/items", { name: "Freight allocation shirt", uomId: pcs, purchaseRate: "100" })).body.id;
    const trouser = (await post("/items", { name: "Freight allocation trouser", uomId: pcs, purchaseRate: "300" })).body.id;
    const mismatch = await post("/goods-receipts", {
      supplierId: id.mill, date: "2026-07-17",
      lines: [{ itemId: shirt, qty: "2", rate: "100" }, { itemId: trouser, qty: "1", rate: "300" }],
      landedCharges: [{
        description: "Inbound freight", sourceDocument: "FRT-INV-42", grossAmount: "60", recoverableGst: "10",
        allocationBasis: "net_value", allocations: [{ lineIndex: 0, amount: "19" }, { lineIndex: 1, amount: "30" }],
      }],
    });
    expect(mismatch.status).toBe(400);
    expect(mismatch.body.error).toBe("landed_cost_allocation_mismatch");
    const receipt = await post("/goods-receipts", {
      supplierId: id.mill, date: "2026-07-17",
      lines: [{ itemId: shirt, qty: "2", rate: "100" }, { itemId: trouser, qty: "1", rate: "300" }],
      landedCharges: [{
        description: "Inbound freight", sourceDocument: "FRT-INV-42", grossAmount: "60", recoverableGst: "10",
        allocationBasis: "net_value", allocations: [{ lineIndex: 0, amount: "20" }, { lineIndex: 1, amount: "30" }],
      }],
    });
    expect(receipt.status).toBe(201);
    const saved = await get(`/goods-receipts/${receipt.body.id}`);
    expect(saved.landedCharges).toMatchObject([{ description: "Inbound freight", sourceDocument: "FRT-INV-42", grossAmount: "60.00", recoverableGst: "10.00", netAmount: "50.00", allocationBasis: "net_value" }]);
    expect(saved.landedCharges[0].allocations).toMatchObject([{ allocatedAmount: "20.00" }, { allocatedAmount: "30.00" }]);
    const receiptAudit = (await get("/audit-log?limit=50")).find((entry: { entity: string; entityId: string }) => entry.entity === "goods_receipt" && entry.entityId === receipt.body.id);
    expect(receiptAudit.after.landedCharges[0]).toMatchObject({ sourceDocument: "FRT-INV-42", recoverableGst: "10.00", netAmount: "50.00", allocationBasis: "net_value" });
    expect(saved.lines.map((line: { landedCostPerUnit: string }) => line.landedCostPerUnit)).toEqual(["10.0000", "30.0000"]);
    const stockRows = (await get("/reports/stock-summary?asOf=2026-12-31")).rows as { itemId: string; rate: string }[];
    expect(stockRows.find((row) => row.itemId === shirt)?.rate).toBe("110.00");
    expect(stockRows.find((row) => row.itemId === trouser)?.rate).toBe("330.00");
  });

  it("counts held goods against the order, but not the short or damaged ones", async () => {
    const o = await get(`/purchase-orders/${id.po}`);
    expect(o.lines[0].receivedQty).toBe("85.0000");
    expect(o.status).toBe("partial");
  });

  it("lists goods waiting for inspection", async () => {
    const holds = await get("/goods-receipts/holds");
    expect(holds).toHaveLength(2);
    expect(holds[0]).toMatchObject({ item: "Dyed cloth", hold: "25.0000", supplier: "Surat Mills" });
    expect(holds.find((row: { item: string }) => row.item === "Landed-cost shirt")).toMatchObject({ hold: "2.0000", rate: "112.5000" });
  });

  it("passes some and rejects some, moving the passed goods into stock and sending the rest back", async () => {
    expect((await post(`/goods-receipts/${grn.id}/release-hold`, { date: "2026-07-12", lines: [{ lineId: line.id, accept: "20", reject: "10" }] })).body.error).toBe("more_than_on_hold");
    const r = await post(`/goods-receipts/${grn.id}/release-hold`, { date: "2026-07-12", lines: [{ lineId: line.id, accept: "15", reject: "5" }] });
    expect(r.status).toBe(200);
    const l = (await get(`/goods-receipts/${grn.id}`)).lines[0];
    expect(l).toMatchObject({ qty: "75.0000", holdQty: "5.0000", returnedQty: "5.0000" });
    expect(await stock(id.cloth, id.main)).toBe(75);
    expect(await stock(id.cloth)).toBe(80);
    expect((await get(`/purchase-orders/${id.po}`)).lines[0].receivedQty).toBe("80.0000"); // the 5 rejected are owed again

    expect((await post(`/goods-receipts/${landedReceiptId}/release-hold`, { date: "2026-07-16", lines: [{ lineId: landedLineId, accept: "1", reject: "0" }] })).status).toBe(200);
    const landedPosition = ((await get("/reports/stock-summary?asOf=2026-12-31")).rows as { itemId: string; qty: string; value: string; rate: string }[]).find((row) => row.itemId === landedItemId);
    expect(landedPosition).toMatchObject({ qty: "7.0000", value: "787.50", rate: "112.50" });
  });

  it("sends accepted goods back before they are billed, but not more than is unbilled", async () => {
    expect((await post(`/goods-receipts/${grn.id}/return`, { date: "2026-07-14", reason: "Wrong shade", lines: [{ lineId: line.id, qty: "80" }] })).body.error).toBe("more_than_unbilled");
    expect((await post(`/goods-receipts/${grn.id}/return`, { date: "2026-07-14", reason: "Wrong shade", lines: [{ lineId: line.id, qty: "10" }] })).status).toBe(200);
    expect(await stock(id.cloth, id.main)).toBe(65);
    const l = (await get(`/goods-receipts/${grn.id}`)).lines[0];
    expect(l).toMatchObject({ qty: "65.0000", returnedQty: "15.0000" });
  });

  it("totals what each supplier owes in credit or replacement", async () => {
    const r = await get("/reports/supplier-claims?from=2026-07-01&to=2026-07-31");
    // 10 short + 5 damaged + 15 sent back, 30 pieces at 100
    expect(r.suppliers[0]).toMatchObject({ supplier: "Surat Mills", value: "3000.00" });
    expect(r.suppliers[0].lines[0]).toMatchObject({ short: "10", damaged: "5", returned: "15" });
  });

  it("will not cancel a receipt that has had goods sent back", async () => {
    expect((await post(`/goods-receipts/${grn.id}/cancel`, { reason: "entered twice" })).body.error).toBe("receipt_has_returns");
  });
});
