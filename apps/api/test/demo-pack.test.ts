import { businessDate } from "@varchasv/domain";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const put = (url: string, body: unknown) => t.call(c, "PUT", url, body);
const today = businessDate();
const stock = async (itemId: string) => ((await get(`/reports/stock-summary?asOf=${today}`)).rows as { itemId: string; qty: string }[]).find((r) => r.itemId === itemId)?.qty;

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("demopack", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.main = setup.warehouses[0].id;
  id.shirt = (await post("/items", { name: "Cotton shirt", uomId: pcs, gstRate: "5", hsn: "6205", saleRate: "800", purchaseRate: "450", barcode: "2000000000011" })).body.id;
  id.trouser = (await post("/items", { name: "Formal trouser", uomId: pcs, gstRate: "5", hsn: "6203", saleRate: "1000", purchaseRate: "550", barcode: "2000000000028" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "10", rate: "450" }, { itemId: id.trouser, warehouseId: id.main, qty: "6", rate: "550" }] });
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.supplier = (await post("/accounts", { name: "Arvind Fabrics", groupId: groups.find((g) => g.key === "sundry_creditors")!.id, stateCode: "27" })).body.id;
});
afterAll(() => t.close());

describe("My Menu", () => {
  it("starts empty (the default set), keeps the user's order and drops repeats", async () => {
    expect(await get("/me/menu")).toEqual({ items: null });
    expect((await put("/me/menu", { items: ["/pos/billing", "/inventory/counts", "/pos/billing"] })).body).toEqual({ items: ["/pos/billing", "/inventory/counts"] });
    expect(await get("/me/menu")).toEqual({ items: ["/pos/billing", "/inventory/counts"] });
    expect((await put("/me/menu", { items: ["https://evil.example"] })).status).toBe(400);
    expect((await put("/me/menu", { items: null })).body).toEqual({ items: null });
    expect((await t.call("", "GET", "/me/menu")).status).toBe(401);
  });
});

describe("exchange on one bill", () => {
  it("takes a shirt back and bills trousers, the customer paying only the difference", async () => {
    id.t1 = (await post("/pos/terminals", { name: "Front counter" })).body.id;
    await post("/pos/sessions", { terminalId: id.t1, openingCash: "500" });
    const first = (await post("/pos/bills", { terminalId: id.t1, lines: [{ itemId: id.shirt, qty: "1" }], payments: [{ mode: "cash", amount: "800" }] })).body;
    const line = (await get(`/pos/bills/${first.id}`)).lines[0];
    const r = await post("/pos/bills", {
      terminalId: id.t1, lines: [{ itemId: id.trouser, qty: "1" }], payments: [{ mode: "upi", amount: "200" }],
      exchange: { billId: first.id, lines: [{ lineId: line.id, qty: "1", reason: "size", grade: "A" }] },
    });
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({ total: "1000.00", exchange: { credit: "800.00", used: "800.00", left: "0.00" } });
    const bill = await get(`/pos/bills/${r.body.id}`);
    expect(bill.exchange).toMatchObject({ against: first.number, total: "800.00", lines: [{ name: "Cotton shirt", reason: "size" }], creditCode: null });
    expect(await stock(id.shirt)).toBe("10.0000"); // sold one, got it back
    expect(await stock(id.trouser)).toBe("5.0000");
    // The same line cannot come back twice.
    const again = await post("/pos/bills", { terminalId: id.t1, lines: [{ itemId: id.shirt, qty: "1" }], payments: [{ mode: "cash", amount: "800" }], exchange: { billId: first.id, lines: [{ lineId: line.id, qty: "1", reason: "size", grade: "A" }] } });
    expect(again.body.error).toBe("over_return");
  });

  it("keeps credit left over as store credit when the return is worth more", async () => {
    const first = (await post("/pos/bills", { terminalId: id.t1, lines: [{ itemId: id.trouser, qty: "1" }], payments: [{ mode: "cash", amount: "1000" }] })).body;
    const line = (await get(`/pos/bills/${first.id}`)).lines[0];
    const r = await post("/pos/bills", {
      terminalId: id.t1, lines: [{ itemId: id.shirt, qty: "1" }], payments: [],
      exchange: { billId: first.id, lines: [{ lineId: line.id, qty: "1", reason: "not_liked", grade: "A" }] },
    });
    expect(r.body.exchange).toMatchObject({ credit: "1000.00", used: "800.00", left: "200.00" });
    expect(r.body.exchange.voucherCode).toBeTruthy();
    expect((await get(`/pos/bills/${r.body.id}`)).exchange).toMatchObject({ creditCode: r.body.exchange.voucherCode, creditLeft: "200.00" });
  });
});

describe("inward challan", () => {
  it("records transport, sets MRPs and shows the last purchase rates", async () => {
    const r = await post("/goods-receipts", {
      supplierId: id.supplier, date: "2026-10-20", supplierChallan: "AF-118", transporter: "VRL Logistics", lrNumber: "LR 55021", lrDate: "2026-10-18",
      lines: [{ itemId: id.shirt, qty: "12", rate: "460", mrp: "1299" }, { itemId: id.trouser, qty: "6", rate: "560" }],
    });
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({ transporter: "VRL Logistics", lrNumber: "LR 55021", lrDate: "2026-10-18" });
    const items = await get("/items");
    expect(items.find((i: { id: string }) => i.id === id.shirt).mrp).toBe("1299.00");
    expect(items.find((i: { id: string }) => i.id === id.trouser).mrp).toBeNull();
    await post("/goods-receipts", { supplierId: id.supplier, date: "2026-10-25", lines: [{ itemId: id.shirt, qty: "6", rate: "470", mrp: "1349" }] });
    const h = await get(`/items/${id.shirt}/purchase-history`);
    expect(h.map((x: { date: string; rate: string; mrp: string | null; supplier: string }) => [x.date, x.rate, x.mrp, x.supplier])).toEqual([
      ["2026-10-25", "470.00", "1349.00", "Arvind Fabrics"], ["2026-10-20", "460.00", "1299.00", "Arvind Fabrics"],
    ]);
  });
});

describe("stock count by scanning", () => {
  it("counts by barcode, shows the differences and adjusts the books on approval", async () => {
    const before = { shirt: Number(await stock(id.shirt)), trouser: Number(await stock(id.trouser)) };
    const sc = await post("/stock-counts", { warehouseId: id.main, name: "Whole store" });
    expect(sc.status).toBe(201);
    id.count = sc.body.id;
    for (let i = 0; i < before.shirt - 2; i++) await post(`/stock-counts/${id.count}/scan`, { code: "2000000000011" });
    expect((await post(`/stock-counts/${id.count}/scan`, { code: "9999999999999" })).body.error).toBe("unknown_barcode");
    expect((await put(`/stock-counts/${id.count}/lines`, { lines: [{ itemId: id.trouser, counted: String(before.trouser + 1) }] })).status).toBe(200);
    const view = await get(`/stock-counts/${id.count}`);
    expect(view.totals).toMatchObject({ items: 2, differences: 2 });
    expect(view.lines.find((l: { itemId: string }) => l.itemId === id.shirt)).toMatchObject({ diff: "-2.0000" });

    expect((await post(`/stock-counts/${id.count}/approve`, { reason: "x" })).body.error).toBe("count_not_submitted");
    await post(`/stock-counts/${id.count}/submit`, {});
    expect((await post(`/stock-counts/${id.count}/scan`, { code: "2000000000011" })).body.error).toBe("count_closed");
    expect((await post(`/stock-counts/${id.count}/approve`, {})).body.error).toBe("reason_required");
    const ok = await post(`/stock-counts/${id.count}/approve`, { reason: "Two shirts missing; one trouser not entered on the challan" });
    expect(ok.body).toMatchObject({ differences: 2 });
    expect(Number(await stock(id.shirt))).toBe(before.shirt - 2);
    expect(Number(await stock(id.trouser))).toBe(before.trouser + 1);
    expect((await get("/stock-counts"))[0]).toMatchObject({ status: "approved", store: expect.any(String) });
  });
});
