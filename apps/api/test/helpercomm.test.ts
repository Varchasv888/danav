import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const month = businessDate().slice(0, 7);

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const rule = (over: Record<string, unknown>) => post("/salesman-commission/rules", { name: "R", kind: "all", ratePct: "1", ...over });

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("helpercomm", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.red = (await post("/colors", { name: "Red" })).body.id;
  const style = async (code: string, saleRate: string, purchaseRate: string) => {
    const s = (await post("/styles", { code, name: `Style ${code}`, uomId: pcs, colorIds: [id.red], sizes: ["M"], saleRate, purchaseRate, mrp: saleRate, gstRate: "5" })).body;
    return ((await get(`/styles/${s.id}`)).variants as { id: string }[])[0]!.id;
  };
  id.fresh = await style("HC-F", "1000", "400"); // 60% margin, came in today
  id.old = await style("HC-O", "500", "450"); // about 10% margin, came in months ago
  await post("/stock-journals", { kind: "adjustment", date: businessDate(), lines: [{ itemId: id.fresh, warehouseId: id.main, qty: "50", rate: "400", direction: "in" }] });
  await post("/stock-journals", { kind: "adjustment", date: "2026-06-30", lines: [{ itemId: id.old, warehouseId: id.main, qty: "50", rate: "450", direction: "in" }] });
  await t.call(c, "PUT", "/pos/settings", { pricesIncludeTax: true });
  id.t1 = (await post("/pos/terminals", { name: "Counter" })).body.id;
  await post("/pos/sessions", { terminalId: id.t1, openingCash: "0" });
  const emp = async (name: string) => (await post("/employees", { name, gender: "female", joinedOn: "2026-01-01", workState: "27", components: [{ code: "BASIC", name: "Basic", monthly: "15000", pfWage: true }] })).body.id;
  id.meera = await emp("Meera S");
  id.ravi = await emp("Ravi K");
  await rule({ name: "Base", ratePct: "2" });
  await rule({ name: "High margin", kind: "margin", bandFrom: "50", ratePct: "5" });
  await rule({ name: "Old stock", kind: "age", bandFrom: "90", ratePct: "8" });
});
afterAll(() => t.close());

describe("margin and age bands", () => {
  it("validates the bands", async () => {
    expect((await rule({ kind: "margin" })).body.error).toBe("range_required");
    expect((await rule({ kind: "age", bandFrom: "90", bandTo: "30" })).body.error).toBe("range_reversed");
  });

  it("pays the margin rule on high-margin goods and the age rule on old stock", async () => {
    const sell = (itemId: string, extra: Record<string, unknown> = {}) => post("/pos/bills", { terminalId: id.t1, lines: [{ itemId, qty: "1", salesmanId: id.meera, ...extra }], payments: [{ mode: "cash", amount: itemId === id.fresh ? "1000" : "500" }] });
    expect((await sell(id.fresh)).status).toBe(201);
    expect((await sell(id.old)).status).toBe(201);
    const r = await get(`/salesman-commission/report?month=${month}`);
    const rules = r.salesmen[0].rules as { name: string; commission: string }[];
    expect(rules.find((x) => x.name === "High margin")!.commission).toBe("47.62"); // 952.38 taxable at 5%
    expect(rules.find((x) => x.name === "Old stock")!.commission).toBe("38.10"); // 476.19 at 8%
    expect(rules.some((x) => x.name === "Base")).toBe(false);
  });
});

describe("helpers", () => {
  it("splits the commission of a line with a helper without paying more than the rule gives", async () => {
    const before = await get(`/salesman-commission/report?month=${month}`);
    const r = await post("/pos/bills", { terminalId: id.t1, lines: [{ itemId: id.old, qty: "1", salesmanId: id.meera, helperId: id.ravi }], payments: [{ mode: "cash", amount: "500" }] });
    expect(r.status).toBe(201);
    const after = await get(`/salesman-commission/report?month=${month}`);
    expect(after.helperSharePct).toBe("30.00");
    // 38.10 commission on the line: 30% (11.43) to the helper, the rest to the salesman.
    expect(after.helpers).toHaveLength(1);
    expect(after.helpers[0]).toMatchObject({ name: "Ravi K", commission: "11.43", sales: "476.20" });
    expect(after.helpers[0].workingDays).toBeGreaterThan(0);
    expect(after.helpers[0].daysWorked).toBeLessThanOrEqual(after.helpers[0].workingDays);
    expect(after.salesmen[0].sharedWithHelpers).toBe("11.43");
    expect(Number(after.totalCommission) - Number(before.totalCommission)).toBeCloseTo(38.1, 1);
  });

  it("takes the helper's share back when the goods come back", async () => {
    const bills = (await get(`/pos/bills?date=${businessDate()}`)) as { id: string; number: string }[];
    const withHelper = bills[0]!; // the latest bill is the one with the helper
    const lookup = await get(`/pos/bills/lookup?number=${encodeURIComponent(withHelper.number)}`);
    const back = await post("/pos/returns", { billId: withHelper.id, terminalId: id.t1, refundMode: "cash", lines: [{ lineId: lookup.lines[0].id, qty: "1", reason: "size", grade: "A" }] });
    expect(back.status).toBe(201);
    const r = await get(`/salesman-commission/report?month=${month}`);
    expect(r.helpers[0].commission).toBe("0.00");
  });

  it("will not name the salesman as their own helper", async () => {
    const r = await post("/pos/bills", { terminalId: id.t1, lines: [{ itemId: id.fresh, qty: "1", salesmanId: id.meera, helperId: id.meera }], payments: [{ mode: "cash", amount: "1000" }] });
    expect(r.body.error).toBe("helper_is_salesman");
  });
});

describe("yearly view", () => {
  it("adds up the twelve months against the targets", async () => {
    expect((await t.call(c, "PUT", `/sales-targets/${month}`, { targets: [{ employeeId: id.meera, target: "5000", slabs: [{ from: "0", rate: "1" }] }] })).status).toBe(200);
    const y = await get(`/reports/salesman-year?year=${month.slice(0, 4)}`);
    const meera = y.rows.find((r: { name: string }) => r.name === "Meera S");
    expect(meera.months).toHaveLength(12);
    expect(meera.target).toBe("5000.00");
    expect(Number(meera.achieved)).toBeGreaterThan(0);
    expect(meera.achievedPct).not.toBeNull();
  });
});
