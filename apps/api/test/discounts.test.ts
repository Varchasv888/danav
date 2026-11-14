import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const register = async (from = today, to = today) => (await get(`/reports/discounts?from=${from}&to=${to}`)) as {
  count: number; totalGross: string; totalDiscount: string; averagePct: string;
  lines: { number: string; channel: string; item: string; gross: string; discount: string; pct: string }[]; byItem: { item: string; discount: string; pct: string }[];
};

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("discounts", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.a = (await post("/items", { name: "Disc Shirt", uomId: pcs, gstRate: "5", hsn: "6205", saleRate: "1000" })).body.id;
  id.b = (await post("/items", { name: "Disc Belt", uomId: pcs, gstRate: "5", hsn: "6217", saleRate: "500" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [id.a, id.b].map((itemId) => ({ itemId, warehouseId: id.main, qty: "50", rate: "100" })) });
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.cust = (await post("/accounts", { name: "Disc Customer", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  await post("/sales-invoices", { customerId: id.cust, date: today, lines: [{ itemId: id.a, qty: "2", rate: "1000", discount: "200" }, { itemId: id.b, qty: "1", rate: "500" }] });
  await t.call(c, "PUT", "/pos/settings", { pricesIncludeTax: true, allowRateChange: true });
  id.t1 = (await post("/pos/terminals", { name: "Counter" })).body.id;
  await post("/pos/sessions", { terminalId: id.t1, openingCash: "0" });
  await post("/pos/bills", { terminalId: id.t1, lines: [{ itemId: id.b, qty: "2", discount: "100" }], payments: [{ mode: "cash", amount: "900" }] });
});
afterAll(() => t.close());

describe("discount register", () => {
  it("lists only discounted lines, from invoices and the counter, with the percentage offered", async () => {
    const r = await register();
    expect(r.count).toBe(2);
    const inv = r.lines.find((l) => l.channel === "invoice")!;
    expect(inv).toMatchObject({ item: "Disc Shirt", gross: "2000.00", discount: "200.00", pct: "10.0" });
    const pos = r.lines.find((l) => l.channel === "counter")!;
    expect(pos).toMatchObject({ item: "Disc Belt", discount: "100.00" });
    expect(r.lines.some((l) => l.item === "Disc Belt" && l.channel === "invoice")).toBe(false);
  });

  it("totals the period and ranks items by discount given", async () => {
    const r = await register();
    expect(r.totalDiscount).toBe("300.00");
    expect(Number(r.averagePct)).toBeGreaterThan(0);
    expect(r.byItem.map((x) => x.item)).toEqual(["Disc Shirt", "Disc Belt"]);
  });

  it("leaves out other periods and other businesses, and refuses bad dates", async () => {
    expect((await register("2020-01-01", "2020-01-31")).count).toBe(0);
    expect((await t.call(c, "GET", "/reports/discounts?from=bad")).status).toBe(400);
    const other = (await t.signup("discounts-other")).cookie;
    expect((await t.call(other, "GET", `/reports/discounts?from=${today}&to=${today}`)).body.count).toBe(0);
  });
});
