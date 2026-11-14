import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { fiscalYearOf, businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
let s: Awaited<ReturnType<Awaited<ReturnType<typeof testApp>>["signup"]>>;
const id: Record<string, string> = {};
const today = businessDate();
const fy = fiscalYearOf(today);

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const put = (url: string, body: unknown) => t.call(c, "PUT", url, body);
const stock = async (itemId: string) => ((await get(`/reports/stock-summary?asOf=${today}`)).rows as { itemId: string; qty: string }[]).find((r) => r.itemId === itemId)?.qty;
const tb = async (key: string) => ((await get(`/reports/trial-balance?asOf=${today}`)).rows as { accountId: string; dr: string; cr: string }[]).find((r) => r.accountId === id[key]) ?? { dr: "0.00", cr: "0.00" };

beforeAll(async () => {
  t = await testApp();
  s = await t.signup("store", { gstin: "27AAPFU0939F1ZV" });
  c = s.cookie;
  const setup = await get("/inventory/setup");
  const uom = (code: string) => setup.uoms.find((u: { code: string }) => u.code === code).id;
  id.main = setup.warehouses[0].id;
  id.dosa = (await post("/items", { name: "Cotton handkerchief pack", uomId: uom("PCS"), gstRate: "5", hsn: "6213", saleRate: "110", purchaseRate: "60" })).body.id;
  id.coke = (await post("/items", { name: "Cola 300ml", uomId: uom("PCS"), gstRate: "18", cessRate: "0", hsn: "2202", saleRate: "40", barcode: "8901234567890" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.dosa, warehouseId: id.main, qty: "10", rate: "60" }, { itemId: id.coke, warehouseId: id.main, qty: "24", rate: "25" }] });
  await put("/pos/settings", { pricesIncludeTax: true, loyaltyEnabled: true, loyaltyPointsPer100: 2, loyaltyPointValue: "0.5", loyaltyMaxRedeemPct: "20" });
  id.t1 = (await post("/pos/terminals", { name: "Front counter" })).body.id;
});
afterAll(() => t.close());

describe("counter billing", () => {
  let session = "";
  let first = "";

  it("needs an open shift", async () => {
    expect((await post("/pos/bills", { terminalId: id.t1, lines: [{ itemId: id.coke, qty: "1" }], payments: [{ mode: "cash", amount: "40" }] })).body.error).toBe("session_not_open");
    session = (await post("/pos/sessions", { terminalId: id.t1, openingCash: "500" })).body.id;
    expect((await post("/pos/sessions", { terminalId: id.t1 })).body.error).toBe("session_already_open");
  });

  it("bills at MRP with GST inside, gives change and earns points", async () => {
    const r = await post("/pos/bills", {
      terminalId: id.t1, customerPhone: "9876543210", customerName: "Asha",
      lines: [{ itemId: id.dosa, qty: "2" }, { itemId: id.coke, qty: "1" }], payments: [{ mode: "cash", amount: "300" }],
    });
    expect(r.status).toBe(201);
    first = r.body.id;
    // Handkerchiefs 220 → 209.52 + 5.24 + 5.24; cola 40 → 33.90 + 3.05 + 3.05
    expect(r.body).toMatchObject({ number: `T1/${fy.short}/00001`, taxable: "243.42", cgst: "8.29", sgst: "8.29", total: "260.00", change: "40.00", loyaltyEarned: 4 });
    expect(await stock(id.coke)).toBe("23.0000");
    expect(await stock(id.dosa)).toBe("8.0000");
    for (const a of await get("/accounts") as { id: string; key: string | null }[]) if (a.key) id[a.key] = a.id;
    expect((await tb("cash")).dr).toBe("260.00");
    expect((await tb("sales")).cr).toBe("243.42");
    expect((await tb("output_cgst")).cr).toBe("8.29");
  });

  it("redeems points as a discount, within the limit", async () => {
    expect((await post("/pos/bills", { terminalId: id.t1, customerPhone: "9876543210", redeemPoints: 5, lines: [{ itemId: id.dosa, qty: "1" }], payments: [{ mode: "upi", amount: "108" }] })).body.error).toBe("too_many_points");
    const r = await post("/pos/bills", { terminalId: id.t1, customerPhone: "9876543210", redeemPoints: 4, lines: [{ itemId: id.dosa, qty: "1" }], payments: [{ mode: "upi", amount: "108", reference: "UPI123" }] });
    expect(r.body).toMatchObject({ total: "108.00", discount: "2.00", taxable: "102.86", loyaltyRedeemed: 4, loyaltyEarned: 2 });
    expect((await get("/pos/loyalty/9876543210")).points).toBe(2);
    expect((await tb("upi_clearing")).dr).toBe("108.00");
    expect((await post("/pos/bills", { terminalId: id.t1, lines: [{ itemId: id.coke, qty: "1" }], payments: [{ mode: "card", amount: "50" }] })).body.error).toBe("overpaid_non_cash");
  });

  it("closes the shift: 5 short of the 760 expected", async () => {
    const closed = await post(`/pos/sessions/${session}/close`, { countedCash: "755" });
    expect(closed.body).toMatchObject({ expectedCash: "760.00", countedCash: "755.00", difference: "-5.00", totals: { bills: "2", cash: "260.00", upi: "108.00" } });
    expect((await tb("cash_short_excess")).dr).toBe("5.00");
    expect((await post(`/pos/bills/${first}/void`, { reason: "Wrong table" })).body.error).toBe("session_closed");
  });

  it("voids a bill in an open shift, putting back stock and points", async () => {
    await post("/pos/sessions", { terminalId: id.t1, openingCash: "0" });
    const r = await post("/pos/bills", { terminalId: id.t1, customerPhone: "9876543210", lines: [{ itemId: id.coke, qty: "3" }], payments: [{ mode: "cash", amount: "120" }] });
    expect(await stock(id.coke)).toBe("20.0000"); // ₹120 earns 2 points
    expect((await get("/pos/loyalty/9876543210")).points).toBe(4);
    await post(`/pos/bills/${r.body.id}/void`, { reason: "Customer changed mind" });
    expect(await stock(id.coke)).toBe("23.0000");
    expect((await get("/pos/loyalty/9876543210")).points).toBe(2);
    const summary = await get(`/pos/summary?date=${today}`);
    expect(summary).toMatchObject({ bills: 2, voided: 1, total: "368.00", cash: "260.00", upi: "108.00" });
    expect(summary.topItems[0]).toMatchObject({ name: "Cotton handkerchief pack", qty: "3", amount: "328.00" });
  });
});

describe("GST", () => {
  it("puts POS sales in GSTR-1 as B2C small, with each terminal's series in the document summary", async () => {
    const fp = `${today.slice(5, 7)}${today.slice(0, 4)}`;
    const r = await get(`/gst/gstr1?period=${fp}`);
    expect(r.summary.POS).toMatchObject({ count: 2, taxable: "346.28" }); // the voided bill is left out
    const b2cs = Object.fromEntries(r.json.b2cs.map((x: { rt: number; txval: number }) => [x.rt, x.txval]));
    expect(b2cs).toEqual({ 5: 312.38, 18: 33.9 }); // 209.52 + 102.86; cola 33.90
    expect(r.json.doc_issue.doc_det[0].docs).toEqual([expect.objectContaining({ from: `T1/${fy.short}/00001`, to: `T1/${fy.short}/00003`, totnum: 3, cancel: 1, net_issue: 2 })]);
  });
});

describe("offline POS device", () => {
  it("numbers its own bills; the server checks the total and flags a difference", async () => {
    const token = (await t.call("", "POST", "/auth/login", { email: s.email, password: "correct horse battery", client: "app" })).body.token;
    const device = async (method: string, url: string, payload?: unknown) => {
      const res = await t.app.inject({ method: method as "GET", url, headers: { authorization: `Bearer ${token}` }, payload: payload as object });
      return res.json();
    };
    const dev = await device("POST", "/devices", { name: "Tablet", platform: "android" });
    const term = (await post("/pos/terminals", { name: "Tablet counter", deviceId: dev.id })).body;
    const pull = await device("GET", `/sync/pull?deviceId=${dev.id}`);
    expect(pull.posTerminals).toEqual([expect.objectContaining({ id: term.id, code: "T2", lastNumber: null })]);
    expect(pull.items.find((i: { id: string }) => i.id === id.coke)).toMatchObject({ barcode: "8901234567890", saleRate: "40.0000", uom: "PCS" });
    expect(pull.posSettings).toMatchObject({ pricesIncludeTax: true });
    const bill = (n: number, total: string) => ({
      opId: crypto.randomUUID(), kind: "pos.bill",
      payload: { id: crypto.randomUUID(), terminalId: term.id, number: `T2/${fy.short}/0000${n}`, date: today, total, lines: [{ itemId: id.coke, qty: "2", price: "40" }], payments: [{ mode: "cash", amount: "80" }] },
    });
    const ops = [bill(1, "80.00"), bill(2, "79.00")];
    const r = await device("POST", "/sync/push", { deviceId: dev.id, ops });
    expect(r.results.map((x: { ok: boolean; result: { mismatch: unknown } }) => [x.ok, x.result.mismatch])).toEqual([[true, null], [true, { deviceTotal: "79.00", serverTotal: "80.00" }]]);
    const again = await device("POST", "/sync/push", { deviceId: dev.id, ops: [ops[0]] });
    expect(again.results[0].result.replayed).toBe(true);
    expect((await device("POST", "/sync/push", { deviceId: dev.id, ops: [{ ...bill(1, "80.00"), opId: crypto.randomUUID(), payload: { ...bill(1, "80.00").payload } }] })).results[0].error).toBe("bill_number_taken");
    expect((await post("/pos/bills", { terminalId: term.id, lines: [{ itemId: id.coke, qty: "1" }], payments: [{ mode: "cash", amount: "40" }] })).body.error).toBe("terminal_on_other_device");
  });
});

describe("counter controls, salesmen, held bills and customer history", () => {
  it("locks rates and big discounts unless an approver gives a reason, and records who sold each line", async () => {
    const t2 = (await post("/pos/terminals", { name: "Ladies counter" })).body.id;
    await post("/pos/sessions", { terminalId: t2, openingCash: "1000" });
    await put("/pos/settings", { pricesIncludeTax: true, allowRateChange: false, maxLineDiscountPct: "10", maxBillDiscountPct: "5", requireSalesman: true });
    const emp = (await post("/employees", {
      name: "Pooja Sawant", gender: "female", joinedOn: "2026-04-01", workState: "27", department: "Showroom",
      components: [{ code: "BASIC", name: "Basic", monthly: "12000", pfWage: true }],
    })).body.id;
    expect((await get("/pos/salesmen")).map((x: { name: string }) => x.name)).toContain("Pooja Sawant");
    const pay = (amount: string) => [{ mode: "cash", amount }];
    expect((await post("/pos/bills", { terminalId: t2, lines: [{ itemId: id.dosa, qty: "1" }], payments: pay("110") })).body.error).toBe("salesman_required");
    expect((await post("/pos/bills", { terminalId: t2, salesmanId: emp, lines: [{ itemId: id.dosa, qty: "1", price: "100" }], payments: pay("100") })).body.error).toBe("rate_locked");
    expect((await post("/pos/bills", { terminalId: t2, salesmanId: emp, lines: [{ itemId: id.dosa, qty: "2", discount: "40" }], payments: pay("180") })).body.error).toBe("discount_over_limit");
    expect((await post("/pos/bills", { terminalId: t2, salesmanId: emp, lines: [{ itemId: id.dosa, qty: "2" }], billDiscount: "20", payments: pay("200") })).body.error).toBe("bill_discount_over_limit");
    // The owner may approve sales: with a reason, the bill goes through and the override is kept.
    const ok = await post("/pos/bills", { terminalId: t2, salesmanId: emp, customerPhone: "9811122233", customerName: "Kavya Nair", lines: [{ itemId: id.dosa, qty: "1", price: "100" }], overrideReason: "Old stock, owner agreed", payments: pay("100") });
    expect(ok.status).toBe(201);
    expect(ok.body.overrides).toEqual([{ kind: "rate", lineNo: 1, reason: "Old stock, owner agreed" }]);
    expect((await get(`/pos/bills/${ok.body.id}`)).lines[0].salesmanId).toBe(emp);
    expect((await post("/pos/bills", { terminalId: t2, lines: [{ itemId: id.dosa, qty: "1", salesmanId: "00000000-0000-4000-8000-000000000000" }], payments: pay("110") })).body.error).toBe("unknown_salesman");

    // Held bills: parked on one counter, picked up once.
    const held = await post("/pos/held", { terminalId: t2, label: "Lady in red saree", customerPhone: "9811122233", lines: [{ itemId: id.dosa, qty: "3", salesmanId: emp }] });
    expect(held.status).toBe(201);
    expect((await get("/pos/held")).find((h: { id: string }) => h.id === held.body.id)).toMatchObject({ pieces: 3, label: "Lady in red saree" });
    expect((await post(`/pos/held/${held.body.id}/resume`, {})).body.lines).toEqual([{ itemId: id.dosa, qty: "3", salesmanId: emp }]);
    expect((await post(`/pos/held/${held.body.id}/resume`, {})).body.error).toBe("held_bill_gone");

    const h = await get("/pos/customers/9811122233");
    expect(h).toMatchObject({ name: "Kavya Nair", visits: 1, spent: "100.00", lastVisit: today, top: [{ name: "Cotton handkerchief pack", qty: "1" }] });
    expect((await get("/pos/customers/9999988888")).visits).toBe(0);
    await put("/pos/settings", { allowRateChange: true, maxLineDiscountPct: null, maxBillDiscountPct: null, requireSalesman: false });
  });
});
