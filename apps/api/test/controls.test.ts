import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let owner: string;
const id: Record<string, string> = {};
const today = businessDate();
const year = today.slice(0, 4);

const get = async (cookie: string, url: string) => (await t.call(cookie, "GET", url)).body;

beforeAll(async () => {
  t = await testApp();
  owner = (await t.signup("controls")).cookie;
  const roles = (await t.call(owner, "GET", "/roles")).body as { id: string; key: string }[];
  const inv = await t.call(owner, "POST", "/invitations", { email: `clerk-${t.run}@test.varchasv.in`, roleId: roles.find((r) => r.key === "accountant")!.id });
  await t.call("", "POST", "/invitations/accept", { token: inv.body.inviteUrl.split("/invite/")[1], name: "Account Clerk", password: "ledger-balanced-1" });
  const groups: { id: string; key: string }[] = await get(owner, "/accounts/groups");
  const group = (k: string) => groups.find((g) => g.key === k)!.id;
  id.cash = ((await get(owner, "/accounts")) as { id: string; key: string | null }[]).find((a) => a.key === "cash")!.id;
  id.exp = (await t.call(owner, "POST", "/accounts", { name: "Misc Expense", groupId: group("indirect_expenses") })).body.id;
  id.cap = (await t.call(owner, "POST", "/accounts", { name: "Misc Capital", groupId: group("capital") })).body.id;
  id.director = (await t.call(owner, "POST", "/accounts", { name: "Director Loan", groupId: group("unsecured_loans") })).body.id;
  // A round-sum journal on a Sunday, touching cash, entered twice.
  let d = new Date(`${year}-06-01T00:00:00Z`);
  while (d.getUTCDay() !== 0) d = new Date(d.getTime() + 86_400_000);
  const sunday = d.toISOString().slice(0, 10);
  for (let i = 0; i < 2; i++) await t.call(owner, "POST", "/vouchers", { type: "journal", date: sunday, lines: [{ accountId: id.cash, debit: "20000" }, { accountId: id.cap, credit: "20000" }] });
  await t.call(owner, "POST", "/vouchers", { type: "journal", date: today, lines: [{ accountId: id.exp, debit: "137.50" }, { accountId: id.cap, credit: "137.50" }] });
});
afterAll(() => t.close());

describe("segregation of duties", () => {
  it("lists people who hold both halves of a pair, owners included", async () => {
    const r = await get(owner, "/controls/sod");
    expect(r.checked).toBeGreaterThanOrEqual(2);
    const me = r.people.find((p: { role: string }) => p.role === "owner");
    expect(me.conflicts).toEqual(expect.arrayContaining(["books", "sales"]));
  });
});

describe("journal checks and related parties", () => {
  it("flags round, Sunday, cash and repeated journals, and leaves a plain one alone", async () => {
    const r = await get(owner, `/controls/journals?from=${year}-01-01&to=${year}-12-31`);
    const big = r.items.filter((i: { total: string }) => i.total === "20000.00");
    expect(big).toHaveLength(2);
    expect(big[0].flags).toEqual(expect.arrayContaining(["round", "weekend", "cashOrBank", "duplicate"]));
    // A plain journal is only ever flagged for being entered at night, which depends on when the suite runs.
    expect(r.items.filter((i: { total: string }) => i.total === "137.50").every((i: { flags: string[] }) => i.flags.join() === "afterHours")).toBe(true);
    expect(r.counts.round).toBe(2);
    expect(r.checked).toBeGreaterThanOrEqual(3);
  });

  it("shows what was booked against accounts marked as related parties", async () => {
    expect((await t.call(owner, "PUT", `/accounts/${id.director}/related-party`, { value: true })).status).toBe(200);
    await t.call(owner, "POST", "/vouchers", { type: "receipt", date: today, lines: [{ accountId: id.cash, debit: "5000" }, { accountId: id.director, credit: "5000" }] });
    const r = await get(owner, `/controls/related-parties?from=${year}-01-01&to=${year}-12-31`);
    expect(r.parties).toEqual([{ id: id.director, name: "Director Loan", debit: "0.00", credit: "5000.00", vouchers: 1 }]);
    expect(r.totalCredit).toBe("5000.00");
  });
});

describe("access reviews", () => {
  it("snapshots the members, wants a decision on each, and records the review", async () => {
    expect((await get(owner, "/controls/access-reviews")).overdue).toBe(true);
    const start = await t.call(owner, "POST", "/controls/access-reviews", {});
    expect(start.status).toBe(201);
    expect((await t.call(owner, "POST", "/controls/access-reviews", {})).body.error).toBe("review_open");
    const reviewId = start.body.id;
    expect((await t.call(owner, "POST", `/controls/access-reviews/${reviewId}/complete`, {})).body.error).toBe("review_incomplete");
    const members = start.body.members as { userId: string; name: string }[];
    expect(members.length).toBe(2);
    expect((await t.call(owner, "POST", `/controls/access-reviews/${reviewId}/decide`, { userId: members[0]!.userId, decision: "remove" })).body.error).toBe("note_required");
    for (const m of members) {
      const clerk = m.name === "Account Clerk";
      await t.call(owner, "POST", `/controls/access-reviews/${reviewId}/decide`, { userId: m.userId, decision: clerk ? "change" : "keep", ...(clerk ? { note: "Should not approve" } : {}) });
    }
    expect((await t.call(owner, "POST", `/controls/access-reviews/${reviewId}/complete`, {})).status).toBe(200);
    const after = await get(owner, "/controls/access-reviews");
    expect(after).toMatchObject({ overdue: false });
    expect(after.reviews[0].members.find((m: { name: string }) => m.name === "Account Clerk")).toMatchObject({ decision: "change", note: "Should not approve" });
  });

  it("is private to the business", async () => {
    const other = (await t.signup("controls-other")).cookie;
    expect((await get(other, "/controls/access-reviews")).reviews).toEqual([]);
    expect((await get(other, `/controls/related-parties?from=${year}-01-01&to=${year}-12-31`)).parties).toEqual([]);
  });
});
