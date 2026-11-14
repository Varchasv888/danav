import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const stock = async (warehouseId: string) => Number(((await get(`/reports/stock-summary?asOf=${today}&warehouseId=${warehouseId}`)).rows as { itemId: string; qty: string }[]).find((r) => r.itemId === id.shirt)?.qty ?? 0);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("memos", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  id.a = (await post("/warehouses", { name: "Store A" })).body.id;
  id.b = (await post("/warehouses", { name: "Store B" })).body.id;
  id.shirt = (await post("/items", { name: "Memo Shirt", uomId: setup.uoms[0].id, gstRate: "5", saleRate: "1000", purchaseRate: "400", mrp: "1000" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.a, qty: "20", rate: "400" }, { itemId: id.shirt, warehouseId: id.b, qty: "20", rate: "400" }] });
  await t.call(c, "PUT", "/pos/settings", { pricesIncludeTax: true });
  for (const k of ["a", "b"]) {
    id[`t${k}`] = (await post("/pos/terminals", { name: `Counter ${k}`, warehouseId: id[k] })).body.id;
    await post("/pos/sessions", { terminalId: id[`t${k}`], openingCash: "0" });
  }
});
afterAll(() => t.close());

describe("goods on approval", () => {
  it("takes pieces out of the store into the holding place, quoting the rate", async () => {
    const r = await post("/approval-memos", { warehouseId: id.a, date: today, customerName: "Kavita Shah", customerPhone: "9822211100", dueBack: today, lines: [{ itemId: id.shirt, qty: "5" }] });
    expect(r.status).toBe(201);
    id.memo = r.body.memo.id;
    id.number = r.body.memo.number;
    expect(await stock(id.a)).toBe(15);
    const m = await get(`/approval-memos/${id.memo}`);
    expect(m).toMatchObject({ status: "open", customerName: "Kavita Shah", store: "Store A" });
    expect(m.lines[0]).toMatchObject({ qty: "5.0000", rate: "1000.00", outQty: "5.0000" });
    const list = await get("/approval-memos?status=open");
    expect(list[0]).toMatchObject({ number: id.number, piecesOut: "5", valueOut: "5000.00", overdue: false });
    expect((await get(`/approval-memos/by-number?number=${encodeURIComponent(id.number)}`)).id).toBe(id.memo);
    expect((await post("/approval-memos", { warehouseId: id.a, date: today, customerName: "X", dueBack: "2000-01-01", lines: [{ itemId: id.shirt, qty: "1" }] })).body.error).toBe("due_before_date");
  });

  it("brings returned pieces back to the store, and refuses more than are out", async () => {
    const line = (await get(`/approval-memos/${id.memo}`)).lines[0].id;
    expect((await post(`/approval-memos/${id.memo}/return`, { date: today, lines: [{ lineId: line, qty: "9" }] })).body.error).toBe("more_than_out");
    expect((await post(`/approval-memos/${id.memo}/return`, { date: today, lines: [{ lineId: line, qty: "1" }] })).status).toBe(200);
    expect(await stock(id.a)).toBe(16);
  });

  it("bills the pieces the customer keeps from the counter, and closes the memo once nothing is left out", async () => {
    // Billing at another store is refused.
    expect((await post("/pos/bills", { terminalId: id.tb, memoId: id.memo, lines: [{ itemId: id.shirt, qty: "2" }], payments: [{ mode: "cash", amount: "2000" }] })).body.error).toBe("memo_other_store");
    const bill = await post("/pos/bills", { terminalId: id.ta, memoId: id.memo, lines: [{ itemId: id.shirt, qty: "3" }], payments: [{ mode: "cash", amount: "3000" }] });
    expect(bill.status).toBe(201);
    // 3 pieces came off the memo and were sold: the store ends with 16 + 3 - 3.
    expect(await stock(id.a)).toBe(16);
    const m = await get(`/approval-memos/${id.memo}`);
    expect(m.lines[0]).toMatchObject({ returnedQty: "1.0000", billedQty: "3.0000", outQty: "1.0000" });
    expect(m.status).toBe("open");
    expect((await post(`/approval-memos/${id.memo}/return`, { date: today, lines: [{ lineId: m.lines[0].id, qty: "1" }] })).status).toBe(200);
    expect((await get(`/approval-memos/${id.memo}`)).status).toBe("closed");
    expect(await stock(id.a)).toBe(17);
    expect((await post("/pos/bills", { terminalId: id.ta, memoId: id.memo, lines: [{ itemId: id.shirt, qty: "1" }], payments: [{ mode: "cash", amount: "1000" }] })).body.error).toBe("memo_closed");
    expect(await get("/approval-memos?status=open")).toEqual([]);
  });

  it("does not disturb the in-transit warehouse used by stock transfers", async () => {
    const r = await post("/stock-transfers", { fromWarehouseId: id.a, toWarehouseId: id.b, date: today, lines: [{ itemId: id.shirt, qty: "2" }] });
    expect(r.status).toBe(201);
    expect(await stock(id.a)).toBe(15);
  });
});
