import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { commitmentDates } from "../src/services/workingcap.js";
import { spreadMoney } from "../src/services/expensealloc.js";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();
const plus = (n: number) => new Date(Date.parse(`${today}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);

describe("when a commitment falls due", () => {
  it("repeats on the same day each month, shortening for short months, until its end date", () => {
    expect(commitmentDates({ firstDate: "2026-01-31", repeat: "monthly", until: "2026-04-30" }, "2026-01-01", "2026-12-31")).toEqual(["2026-01-31", "2026-02-28", "2026-03-31", "2026-04-30"]);
    expect(commitmentDates({ firstDate: "2026-03-10", repeat: "once", until: null }, "2026-03-01", "2026-03-31")).toEqual(["2026-03-10"]);
    expect(commitmentDates({ firstDate: "2026-03-10", repeat: "once", until: null }, "2026-04-01", "2026-04-30")).toEqual([]);
    expect(commitmentDates({ firstDate: "2026-01-05", repeat: "monthly", until: null }, "2026-03-01", "2026-04-30")).toEqual(["2026-03-05", "2026-04-05"]);
  });
  it("spreads money to the paisa and always adds up", () => {
    expect(spreadMoney("100.00", ["1", "1", "1"])).toEqual(["33.34", "33.33", "33.33"]);
    expect(spreadMoney("100.00", ["0", "0"])).toEqual(["50.00", "50.00"]);
    expect(spreadMoney("1000.00", ["75", "25"])).toEqual(["750.00", "250.00"]);
  });
});

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("commit", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.rent = (await post("/accounts", { name: "Shop Rent", groupId: groups.find((g) => g.key === "indirect_expenses")!.id })).body.id;
  id.cap = (await post("/accounts", { name: "Owner Capital", groupId: groups.find((g) => g.key === "capital")!.id })).body.id;
});
afterAll(() => t.close());

describe("loans and capital purchases in the cash forecast", () => {
  it("counts a monthly instalment and a one-off purchase on their dates, and lets one be stopped", async () => {
    const before = await get("/finance/cash-forecast?weeks=8");
    const loan = await post("/finance/commitments", { kind: "loan", name: "Term loan EMI", amount: "5000", firstDate: plus(2), repeat: "monthly" });
    expect(loan.status).toBe(201);
    expect((await post("/finance/commitments", { kind: "capex", name: "New racks", amount: "20000", firstDate: plus(10) })).status).toBe(201);
    expect((await post("/finance/commitments", { kind: "loan", name: "Bad", amount: "100", firstDate: plus(2), repeat: "once", until: plus(9) })).body.error).toBe("until_needs_repeat");
    const r = await get("/finance/cash-forecast?weeks=8");
    const total = (k: string) => r.weeks.reduce((s: number, w: Record<string, string>) => s + Number(w[k]), 0);
    // EMIs fall in 2 months within eight weeks at most (day-of-month repeat), so 5000 to 10000, plus the 20000 racks.
    expect(total("commitments")).toBeLessThanOrEqual(-25000);
    expect(total("commitments")).toBeGreaterThanOrEqual(-30000);
    expect(Number(r.weeks[1].commitments)).toBeLessThanOrEqual(-20000); // week 2 holds the racks
    expect(Number(r.weeks[1].closing)).toBeLessThan(Number(before.weeks[1].closing));
    await post(`/finance/commitments/${loan.body.id}/stop`, {});
    const after = await get("/finance/cash-forecast?weeks=8");
    expect(after.weeks.reduce((s: number, w: Record<string, string>) => s + Number(w.commitments), 0)).toBe(-20000);
    expect((await get("/finance/commitments")).filter((x: { active: boolean }) => x.active)).toHaveLength(1);
  });
});

describe("expenses spread over the stores", () => {
  it("shares an expense by sales, by typed percentages, and lists the unallocated", async () => {
    const setup = await get("/inventory/setup");
    const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
    id.main = setup.warehouses[0].id;
    id.a = (await post("/warehouses", { name: "Store A" })).body.id;
    id.b = (await post("/warehouses", { name: "Store B" })).body.id;
    id.shirt = (await post("/items", { name: "Alloc Shirt", uomId: pcs, gstRate: "5", saleRate: "1000", purchaseRate: "400", mrp: "1000" })).body.id;
    await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.a, qty: "20", rate: "400" }, { itemId: id.shirt, warehouseId: id.b, qty: "20", rate: "400" }] });
    await t.call(c, "PUT", "/pos/settings", { pricesIncludeTax: true });
    for (const k of ["a", "b"]) {
      id[`t${k}`] = (await post("/pos/terminals", { name: `Counter ${k}`, warehouseId: id[k] })).body.id;
      await post("/pos/sessions", { terminalId: id[`t${k}`], openingCash: "0" });
    }
    const sell = (k: string, qty: number) => post("/pos/bills", { terminalId: id[`t${k}`], lines: [{ itemId: id.shirt, qty: String(qty) }], payments: [{ mode: "cash", amount: String(qty * 1000) }] });
    expect((await sell("a", 3)).status).toBe(201);
    expect((await sell("b", 1)).status).toBe(201);
    await post("/vouchers", { type: "journal", date: today, lines: [{ accountId: id.rent, debit: "4000" }, { accountId: id.cap, credit: "4000" }] });

    let r = await get(`/finance/store-results?from=${today}&to=${today}`);
    expect(r.unallocated).toEqual([{ account: "Shop Rent", amount: "4000.00" }]);

    expect((await t.call(c, "PUT", `/finance/allocation-rules/${id.rent}`, { basis: "sales" })).status).toBe(200);
    r = await get(`/finance/store-results?from=${today}&to=${today}`);
    const a = r.rows.find((x: { store: string }) => x.store === "Store A"), b = r.rows.find((x: { store: string }) => x.store === "Store B");
    expect(a.expenses).toBe("3000.00");
    expect(b.expenses).toBe("1000.00");
    expect(r.unallocated).toEqual([]);

    expect((await t.call(c, "PUT", `/finance/allocation-rules/${id.rent}`, { basis: "fixed", shares: { [id.a]: "60", [id.b]: "30" } })).body.error).toBe("shares_must_total_100");
    expect((await t.call(c, "PUT", `/finance/allocation-rules/${id.rent}`, { basis: "fixed", shares: { [id.a]: "60", [id.b]: "40" } })).status).toBe(200);
    r = await get(`/finance/store-results?from=${today}&to=${today}`);
    expect(r.rows.find((x: { store: string }) => x.store === "Store A").expenses).toBe("2400.00");
    expect(r.rows.find((x: { store: string }) => x.store === "Store B").lines).toEqual([{ account: "Shop Rent", amount: "1600.00" }]);
    // A gross margin is carried beside the expenses, so the store's result is margin less its share.
    expect(a.grossMargin).not.toBeNull();
  });
});
