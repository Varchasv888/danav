import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let owner: string;
const id: Record<string, string> = {};
const today = new Date().toISOString().slice(0, 10);

beforeAll(async () => {
  t = await testApp();
  owner = (await t.signup("scen")).cookie;
  const groups: { id: string; key: string }[] = (await t.call(owner, "GET", "/accounts/groups")).body;
  const group = (k: string) => groups.find((g) => g.key === k)!.id;
  id.sales = (await t.call(owner, "POST", "/accounts", { name: "Shop Sales", groupId: group("sales_accounts") })).body.id;
  id.rent = (await t.call(owner, "POST", "/accounts", { name: "Shop Rent", groupId: group("indirect_expenses") })).body.id;
  id.cash = ((await t.call(owner, "GET", "/accounts")).body as { id: string; key: string | null }[]).find((a) => a.key === "cash")!.id;
  await t.call(owner, "POST", "/vouchers", { type: "journal", date: today, lines: [{ accountId: id.cash, debit: "100000" }, { accountId: id.sales, credit: "100000" }] });
  await t.call(owner, "POST", "/vouchers", { type: "journal", date: today, lines: [{ accountId: id.rent, debit: "20000" }, { accountId: id.cash, credit: "20000" }] });
});
afterAll(() => t.close());

describe("scenarios", () => {
  it("takes the baseline from the books", async () => {
    const b = (await t.call(owner, "GET", "/scenarios/baseline")).body;
    expect(Number(b.sales)).toBe(100000);
    expect(Number(b.operatingCost)).toBe(20000);
    expect(Number(b.cash)).toBe(80000);
  });

  it("works out worst, expected and best cases", async () => {
    const res = await t.call(owner, "POST", "/scenarios/preview", { adjustments: [{ kind: "demand", salesChangePct: [-10, 10, 30] }] });
    expect(res.status).toBe(200);
    const { cases } = res.body;
    expect(Number(cases.worst.sales)).toBe(90000);
    expect(Number(cases.expected.sales)).toBe(110000);
    expect(Number(cases.best.sales)).toBe(130000);
    expect(Number(cases.best.profit)).toBeGreaterThan(Number(cases.worst.profit));
  });

  it("rejects unknown kinds and empty lists", async () => {
    expect((await t.call(owner, "POST", "/scenarios/preview", { adjustments: [{ kind: "magic" }] })).status).toBe(400);
    expect((await t.call(owner, "POST", "/scenarios/preview", { adjustments: [] })).status).toBe(400);
  });

  it("saves, lists and deletes a scenario, keeping the baseline it was made against", async () => {
    const body = { name: "Open second shop", adjustments: [{ kind: "store", capex: 500000, monthlyRent: 20000, monthlyStaff: 30000, monthlySales: [40000, 80000, 120000], rampMonths: 3, startMonth: 4 }] };
    const saved = await t.call(owner, "POST", "/scenarios", body);
    expect(saved.status).toBe(201);
    expect((await t.call(owner, "POST", "/scenarios", body)).status).toBe(409);
    const list = (await t.call(owner, "GET", "/scenarios")).body;
    expect(list).toHaveLength(1);
    expect(Number(list[0].result.cases.expected.capex)).toBe(500000);
    expect(Number(list[0].result.cases.expected.closingCash)).toBeLessThan(Number(list[0].result.baseline.closingCash));
    expect((await t.call(owner, "DELETE", `/scenarios/${saved.body.id}`)).status).toBe(200);
    expect((await t.call(owner, "GET", "/scenarios")).body).toHaveLength(0);
  });
});
