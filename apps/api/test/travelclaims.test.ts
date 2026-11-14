import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const put = (url: string, body: unknown) => t.call(c, "PUT", url, body);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("travel", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const accounts = (await get("/accounts")) as { id: string; name: string }[];
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.exp = (await post("/accounts", { name: "Travel expense", groupId: groups.find((g) => g.key === "indirect_expenses")!.id })).body.id;
  void accounts;
  id.bike = (await post("/expenses/categories", { name: "Travel by own vehicle", accountId: id.exp, perKmRate: "8", dailyAllowance: "300" })).body.id;
  id.taxi = (await post("/expenses/categories", { name: "Taxi", accountId: id.exp })).body.id;
  id.ravi = (await post("/employees", { name: "Ravi Sales", gender: "male", joinedOn: "2026-04-01", workState: "27", costPerHour: "200" })).body.id;
});
afterAll(() => t.close());

describe("travel claims", () => {
  it("pays a trip by the policy: kilometres at the per-km rate and days away at the daily allowance", async () => {
    const r = await post("/expenses/claims", { employeeId: id.ravi, date: "2026-10-12", title: "Pune dealer visit", lines: [
      { date: "2026-10-10", categoryId: id.bike, travel: { from: "Mumbai", to: "Pune", km: "150", days: 2 } },
      { date: "2026-10-11", categoryId: id.taxi, amount: "650", travel: { from: "Pune", to: "Pune station" } },
    ] });
    expect(r.status).toBe(201);
    const claim = await get(`/expenses/claims/${r.body.id}`);
    expect(claim.lines[0]).toMatchObject({ amount: "1800.00", travel: { from: "Mumbai", to: "Pune", km: "150.0", days: 2 } }); // 150 x 8 + 2 x 300
    expect(claim.lines[1].amount).toBe("650.00");
    expect(Number(claim.claim?.total ?? claim.total)).toBe(2450);
  });

  it("refuses an amount that differs from the policy, and a trip with no kilometres or days", async () => {
    const line = (over: Record<string, unknown>) => post("/expenses/claims", { employeeId: id.ravi, date: "2026-10-12", title: "Another trip", lines: [{ date: "2026-10-10", categoryId: id.bike, ...over }] });
    expect((await line({ travel: { from: "Mumbai", to: "Thane", km: "20" }, amount: "999" })).body.error).toBe("travel_amount_mismatch");
    expect((await line({ travel: { from: "Mumbai", to: "Thane" } })).status).toBe(400);
    expect((await line({ amount: "100" })).status).toBe(201); // no trip given: an ordinary line at the amount typed
  });

  it("lists trips by person, with distance and what was paid, leaving out cancelled and rejected claims", async () => {
    const r = await get("/reports/travel-claims?from=2026-10-01&to=2026-10-31");
    expect(r.people).toHaveLength(1);
    expect(r.people[0]).toMatchObject({ name: "Ravi Sales", trips: 2, km: "150.0", amount: "2450.00" });
    const other = await post("/expenses/claims", { employeeId: id.ravi, date: "2026-10-20", title: "Cancelled trip", lines: [{ date: "2026-10-19", categoryId: id.bike, travel: { from: "A", to: "B", km: "40" } }] });
    expect((await post(`/expenses/claims/${other.body.id}/cancel`, { reason: "Not going" })).status).toBe(200);
    expect((await get("/reports/travel-claims?from=2026-10-01&to=2026-10-31")).people[0].trips).toBe(2);
    void put;
  });
});
