import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const stock = async (itemId: string) => ((await get("/reports/stock-summary?asOf=2026-12-31")).rows as { itemId: string; qty: string; value: string }[]).find((r) => r.itemId === itemId);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("maker", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  const uom = (code: string) => setup.uoms.find((u: { code: string }) => u.code === code).id;
  id.main = setup.warehouses[0].id;
  const item = async (name: string, u: string, rate: string, extra: object = {}) => (await post("/items", { name, uomId: uom(u), purchaseRate: rate, gstRate: "5", hsn: "1905", ...extra })).body.id;
  id.flour = await item("Flour", "KGS", "40");
  id.sugar = await item("Sugar", "KGS", "45");
  id.milk = await item("Milk", "LTR", "60", { reorderLevel: "20" });
  id.cream = await item("Cream", "KGS", "0");
  id.cake = await item("Cake", "PCS", "0", { saleRate: "150" });
  await post("/stock-journals", { kind: "opening", lines: [
    { itemId: id.flour, warehouseId: id.main, qty: "100", rate: "40" }, { itemId: id.sugar, warehouseId: id.main, qty: "50", rate: "45" },
    { itemId: id.milk, warehouseId: id.main, qty: "20", rate: "60" },
  ] });
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.supplier = (await post("/accounts", { name: "Anand Dairy", groupId: groups.find((g) => g.key === "sundry_creditors")!.id, stateCode: "27" })).body.id;
  id.debtor = (await post("/accounts", { name: "Cafe Corner", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
});
afterAll(() => t.close());

describe("BOMs", () => {
  it("costs a cake through its cream sub-assembly, oven time and overhead", async () => {
    id.oven = (await post("/work-centres", { name: "Oven", costPerHour: "300" })).body.id;
    id.creamBom = (await post("/boms", { itemId: id.cream, outputQty: "2", lines: [{ itemId: id.milk, qty: "3", wastagePct: "10" }, { itemId: id.sugar, qty: "0.5" }] })).body.id;
    const cake = await post("/boms", {
      itemId: id.cake, outputQty: "10", overhead: "100",
      lines: [{ itemId: id.flour, qty: "2", wastagePct: "5" }, { itemId: id.sugar, qty: "1.5" }, { itemId: id.cream, qty: "1" }],
      operations: [{ name: "Bake", workCentreId: id.oven, minutes: "60" }],
    });
    expect(cake.body).toMatchObject({ version: 1, isDefault: true });
    id.cakeBom = cake.body.id;
    const b = await get(`/boms/${id.cakeBom}`);
    // 0.21 kg flour × 40 + 0.15 kg sugar × 45 + 0.1 kg cream × 110.25 + (100 + 300 oven) ÷ 10
    expect(b).toMatchObject({ overheadPerBatch: "400.00", cost: { unitCost: "66.1750", overheadPerUnit: "40.00" } });
    expect(b.cost.lines.find((l: { itemId: string }) => l.itemId === id.cream)).toMatchObject({ rate: "110.2500" });
  });

  it("refuses a bill of materials that would loop", async () => {
    const r = await post("/boms", { itemId: id.cream, outputQty: "1", lines: [{ itemId: id.cake, qty: "1" }] });
    expect(r.body.error).toBe("bom_cycle");
    expect((await post("/boms", { itemId: id.cake, outputQty: "1", lines: [{ itemId: id.cake, qty: "1" }] })).body.error).toBe("bom_cycle");
  });
});

describe("production", () => {
  it("makes cream: materials out at cost, cream in at their cost", async () => {
    const o = (await post("/production-orders", { itemId: id.cream, qty: "4", date: "2026-10-01" })).body;
    expect(o).toMatchObject({ number: "PRD/26-27/00001", status: "planned" });
    expect((await post(`/production-orders/${o.id}/complete`, { date: "2026-10-01", goodQty: "4" })).body.error).toBe("order_not_released");
    await post(`/production-orders/${o.id}/release`, {});
    const done = await post(`/production-orders/${o.id}/complete`, { date: "2026-10-01", goodQty: "4" });
    expect(done.body.unitCost).toBe("110.2500"); // 6.6 L milk × 60 + 1 kg sugar × 45 = 441 ÷ 4
    expect((await get(`/production-orders/${o.id}`)).status).toBe("completed");
    expect(await stock(id.cream)).toMatchObject({ qty: "4.0000", value: "441.00" });
    expect((await stock(id.milk))!.qty).toBe("13.4000");
  });

  it("makes cakes with an extra issue and rejects: the good ones carry the full cost", async () => {
    const o = (await post("/production-orders", { itemId: id.cake, qty: "20", date: "2026-10-02", release: true })).body;
    await post(`/production-orders/${o.id}/issue`, { date: "2026-10-02", lines: [{ itemId: id.flour, qty: "0.5" }] });
    const done = await post(`/production-orders/${o.id}/complete`, { date: "2026-10-02", goodQty: "18", rejectedQty: "2" });
    // Materials for 20: 4.2 kg flour 168 + 3 kg sugar 135 + 2 kg cream 220.50; oven and overhead 800; extra flour 20 → 1,343.50 ÷ 18
    expect(done.body.unitCost).toBe("74.6389");
    const detail = await get(`/production-orders/${o.id}`);
    expect(detail).toMatchObject({ status: "completed", producedQty: "18.0000", rejectedQty: "2.0000", materialCost: "543.50", overheadCost: "800.00" });
    expect((await stock(id.cake))!.qty).toBe("18.0000");
    expect((await stock(id.flour))!.qty).toBe("95.3000");
    expect((await stock(id.cream))!.qty).toBe("2.0000");
  });

  it("cancelling an order reverses its stock", async () => {
    const o = (await post("/production-orders", { itemId: id.cream, qty: "1", date: "2026-10-03", release: true })).body;
    await post(`/production-orders/${o.id}/complete`, { date: "2026-10-03", goodQty: "1" });
    expect((await stock(id.cream))!.qty).toBe("3.0000");
    await post(`/production-orders/${o.id}/cancel`, { reason: "Wrong batch" });
    expect((await stock(id.cream))!.qty).toBe("2.0000");
    expect((await stock(id.milk))!.qty).toBe("13.4000");
  });
});

describe("MRP", () => {
  it("plans cakes for an order and milk below its reorder level, then raises the orders", async () => {
    await post("/sales-orders", { customerId: id.debtor, date: "2026-10-01", deliverBy: "2026-10-20", lines: [{ itemId: id.cake, qty: "30", rate: "150" }] });
    const plan = await get("/mrp?date=2026-10-05");
    const byItem = Object.fromEntries(plan.map((p: { itemId: string }) => [p.itemId, p]));
    expect(byItem[id.cake]).toMatchObject({ action: "make", qty: "12.0000", needBy: "2026-10-20" });
    expect(byItem[id.milk]).toMatchObject({ action: "buy", qty: "6.6000", supplierId: null }); // reorder level 20, 13.4 on hand
    expect(byItem[id.cream]).toBeUndefined(); // 2 kg on hand covers the 1.2 kg the cakes need
    expect((await post("/mrp/convert", { date: "2026-10-05", lines: [{ itemId: id.milk, qty: "6.6", action: "buy" }] })).body.error).toBe("supplier_required");
    const made = await post("/mrp/convert", { date: "2026-10-05", lines: [
      { itemId: id.cake, qty: "12", action: "make" }, { itemId: id.milk, qty: "6.6", action: "buy", supplierId: id.supplier, needBy: "2026-10-08" },
    ] });
    expect(made.body).toEqual({ productionOrders: ["PRD/26-27/00004"], purchaseOrders: ["PO/26-27/00001"] });
    const again = await get("/mrp?date=2026-10-05");
    expect(again.find((p: { itemId: string }) => p.itemId === id.cake)).toBeUndefined(); // now on order
  });
});

describe("job work", () => {
  it("sends milk out, gets cream back at cost plus charges, and reports ITC-04", async () => {
    const sent = await post("/job-work/send", { date: "2026-10-06", jobWorkerId: id.supplier, process: "Churning", lines: [{ itemId: id.milk, qty: "5" }] });
    expect(sent.body.challan).toMatchObject({ number: "JWO/26-27/00001" });
    expect((await stock(id.milk))!.qty).toBe("13.4000"); // still ours, now at the job worker
    expect((await post("/job-work/receive", { date: "2026-10-09", sentChallanId: sent.body.challan.id, received: [{ itemId: id.cream, qty: "2" }], consumed: [{ itemId: id.milk, qty: "6" }] })).body.error).toBe("more_than_sent");
    const back = await post("/job-work/receive", { date: "2026-10-09", sentChallanId: sent.body.challan.id, charges: "50", received: [{ itemId: id.cream, qty: "2" }], consumed: [{ itemId: id.milk, qty: "5" }] });
    expect(back.body.rate).toBe("175.0000"); // (5 × 60 + 50) ÷ 2
    expect((await stock(id.milk))!.qty).toBe("8.4000");
    const flour = await post("/job-work/send", { date: "2026-10-10", jobWorkerId: id.supplier, process: "Milling", lines: [{ itemId: id.flour, qty: "10" }] });
    const r = await get("/job-work/itc04?from=2026-10-01&to=2027-03-31");
    expect(r.sent.map((s: { challan: string; qty: string; value: string }) => `${s.challan}:${s.qty}:${s.value}`)).toEqual(["JWO/26-27/00001:5.0000:300.00", "JWO/26-27/00002:10.0000:400.00"]);
    expect(r.received).toEqual([expect.objectContaining({ challan: "JWI/26-27/00001", originalChallan: "JWO/26-27/00001", qty: "2.0000" })]);
    expect(r.pending).toEqual([expect.objectContaining({ challan: "JWO/26-27/00002", qty: "10.0000", returnBy: "2027-10-10", overdue: false })]);
    expect((await post(`/job-work/${sent.body.challan.id}/cancel`, { reason: "x".repeat(3) })).body.error).toBe("challan_has_receipts");
    await post(`/job-work/${flour.body.challan.id}/cancel`, { reason: "Not sent" });
    expect((await stock(id.flour))!.qty).toBe("95.3000");
  });
});
