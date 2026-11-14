import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let owner: string;
let clerk: string;
const today = businessDate();

const report = async (query = "") => (await t.call(owner, "GET", `/reports/user-activity${query}`)).body as {
  tiles: Record<string, number>; people: { name: string; logins: number; created: number; vouchersCreated: number; vouchersCancelled: number; cancelled: number }[];
};

beforeAll(async () => {
  t = await testApp();
  owner = (await t.signup("activity")).cookie;
  const roles = (await t.call(owner, "GET", "/roles")).body as { id: string; key: string }[];
  const email = `clerk-${t.run}@test.varchasv.in`;
  const inv = await t.call(owner, "POST", "/invitations", { email, roleId: roles.find((r) => r.key === "accountant")!.id });
  clerk = (await t.call("", "POST", "/invitations/accept", { token: inv.body.inviteUrl.split("/invite/")[1], name: "Active Clerk", password: "ledger-balanced-1" })).cookie;
  const accounts = (await t.call(clerk, "GET", "/accounts")).body as { id: string; key: string | null }[];
  const cash = accounts.find((a) => a.key === "cash")!.id;
  const capital = accounts.find((a) => a.key === "owners_capital")!.id;
  const v = await t.call(clerk, "POST", "/vouchers", { type: "journal", date: today, lines: [{ accountId: cash, debit: "100" }, { accountId: capital, credit: "100" }] });
  await t.call(clerk, "POST", `/vouchers/${v.body.id}/cancel`, { reason: "Test" });
});
afterAll(() => t.close());

describe("user activity report", () => {
  it("counts what each person did in the period, and totals them as tiles", async () => {
    const r = await report();
    const clerkRow = r.people.find((p) => p.name === "Active Clerk")!;
    expect(clerkRow).toMatchObject({ vouchersCreated: 1, vouchersCancelled: 1 });
    expect(clerkRow.created).toBeGreaterThanOrEqual(1);
    expect(clerkRow.cancelled).toBeGreaterThanOrEqual(1);
    expect(r.tiles.activeUsers).toBe(r.people.length);
    expect(r.tiles.vouchersCreated).toBe(1);
    expect(r.tiles.cancellations).toBeGreaterThanOrEqual(1);
  });

  it("lists only people active in the period", async () => {
    expect((await report("?from=2020-01-01&to=2020-01-31")).people).toEqual([]);
    expect((await t.call(owner, "GET", "/reports/user-activity?from=bad")).status).toBe(400);
  });

  it("keeps businesses apart", async () => {
    const other = (await t.signup("activity-other")).cookie;
    const r = (await t.call(other, "GET", "/reports/user-activity")).body;
    expect(r.people.map((p: { name: string }) => p.name)).not.toContain("Active Clerk");
  });
});
