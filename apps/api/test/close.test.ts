import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let owner: string;
let admin: string;
const id: Record<string, string> = {};
const PERIOD = "2026-10";

const get = async (cookie: string, url: string) => (await t.call(cookie, "GET", url)).body;
const checklist = async () => get(owner, `/close/checklist?period=${PERIOD}`) as Promise<{ ready: boolean; open: number; closed: unknown; items: { key: string; count: number; clear: boolean; signed: unknown }[] }>;
const item = async (key: string) => (await checklist()).items.find((i) => i.key === key)!;

beforeAll(async () => {
  t = await testApp();
  owner = (await t.signup("close")).cookie;
  const roles = (await t.call(owner, "GET", "/roles")).body as { id: string; key: string }[];
  const inv = await t.call(owner, "POST", "/invitations", { email: `admin-${t.run}@test.varchasv.in`, roleId: roles.find((r) => r.key === "admin")!.id });
  admin = (await t.call("", "POST", "/invitations/accept", { token: inv.body.inviteUrl.split("/invite/")[1], name: "Second Admin", password: "ledger-balanced-1" })).cookie;
  const groups: { id: string; key: string }[] = await get(owner, "/accounts/groups");
  id.suspense = (await t.call(owner, "POST", "/accounts", { name: "Unknown Receipts", groupId: groups.find((g) => g.key === "suspense")!.id })).body.id;
  id.cash = ((await get(owner, "/accounts")) as { id: string; key: string | null }[]).find((a) => a.key === "cash")!.id;
});
afterAll(() => t.close());

describe("month-end close", () => {
  it("starts clear for a business with nothing outstanding", async () => {
    const c = await checklist();
    expect(c.ready).toBe(true);
    expect(c.items.map((i) => i.key)).toEqual(expect.arrayContaining(["draftPayroll", "unmatchedBank", "suspense", "cashVariance", "goodsInTransit", "receivedNotBilled", "dispatchedNotBilled", "negativeStock", "integrity"]));
  });

  it("flags money parked in suspense, refuses to close, and accepts a signed-off note", async () => {
    await t.call(owner, "POST", "/vouchers", { type: "receipt", date: "2026-10-12", lines: [{ accountId: id.cash, debit: "700" }, { accountId: id.suspense, credit: "700" }] });
    expect(await item("suspense")).toMatchObject({ count: 1, clear: false });
    expect((await t.call(owner, "POST", "/close/month", { period: PERIOD })).body.error).toBe("checklist_open");
    expect((await t.call(owner, "POST", "/close/signoff", { period: PERIOD, key: "suspense", note: "x" })).status).toBe(400);
    expect((await t.call(owner, "POST", "/close/signoff", { period: PERIOD, key: "negativeStock", note: "Nothing there" })).body.error).toBe("nothing_to_sign");
    expect((await t.call(owner, "POST", "/close/signoff", { period: PERIOD, key: "suspense", note: "Customer to identify next week" })).status).toBe(200);
    expect(await item("suspense")).toMatchObject({ clear: true, signed: { note: "Customer to identify next week" } });
    expect((await checklist()).ready).toBe(true);
  });

  it("closes the month and saves the reports; closing again is refused", async () => {
    const r = await t.call(owner, "POST", "/close/month", { period: PERIOD });
    expect(r.status).toBe(200);
    expect(r.body.snapshots).toHaveLength(3);
    expect((await checklist()).closed).toMatchObject({ reopened: false });
    expect((await t.call(owner, "POST", "/close/month", { period: PERIOD })).body.error).toBe("already_closed");
    const s = await get(owner, `/close/snapshots?period=${PERIOD}`);
    expect(s.snapshots.map((x: { kind: string; version: number }) => `${x.kind}:${x.version}`).sort()).toEqual(["balance_sheet:1", "profit_loss:1", "trial_balance:1"]);
    expect(s.restatements).toEqual([]);
  });

  it("a reopened month closed again keeps both versions and shows what changed", async () => {
    expect((await t.call(owner, "POST", "/close/reopen", { period: PERIOD, reason: "x" })).status).toBe(400);
    // Reopening is a high-risk action: it needs the password typed again.
    expect((await t.call(owner, "POST", "/close/reopen", { period: PERIOD, reason: "Late expense found" })).body.error).toBe("step_up_required");
    expect((await t.call(owner, "POST", "/auth/step-up", { password: "wrong password here" })).body.error).toBe("wrong_password");
    expect((await t.call(owner, "POST", "/auth/step-up", { password: "correct horse battery" })).status).toBe(200);
    expect((await t.call(owner, "POST", "/close/reopen", { period: PERIOD, reason: "Late expense found" })).status).toBe(200);
    expect((await checklist()).closed).toMatchObject({ reopened: true });
    // A late expense changes the month's profit.
    const rent = (await t.call(owner, "POST", "/accounts", { name: "Late Rent", groupId: ((await get(owner, "/accounts/groups")) as { id: string; key: string }[]).find((g) => g.key === "indirect_expenses")!.id })).body.id;
    await t.call(owner, "POST", "/vouchers", { type: "payment", date: "2026-10-20", lines: [{ accountId: rent, debit: "300" }, { accountId: id.cash, credit: "300" }] });
    expect((await t.call(owner, "POST", "/close/month", { period: PERIOD })).status).toBe(200);
    const s = await get(owner, `/close/snapshots?period=${PERIOD}`);
    expect(s.snapshots.filter((x: { kind: string }) => x.kind === "profit_loss")).toHaveLength(2);
    const pl = s.restatements.find((x: { kind: string }) => x.kind === "profit_loss");
    expect(pl.changes.find((c: { field: string }) => c.field === "netProfit")).toMatchObject({ was: "0.00", now: "-300.00" });
    const first = s.snapshots.find((x: { kind: string; version: number }) => x.kind === "profit_loss" && x.version === 1);
    expect((await get(owner, `/close/snapshots/${first.id}`)).data.netProfit).toBe("0.00");
  });
});

describe("daily point-of-sale close", () => {
  it("makes a cash difference wait for a second person's sign-off", async () => {
    const terminal = (await t.call(owner, "POST", "/pos/terminals", { name: "Front counter" })).body.id;
    const session = (await t.call(owner, "POST", "/pos/sessions", { terminalId: terminal, openingCash: "0" })).body.id;
    expect((await t.call(owner, "POST", `/pos/sessions/${session}/close`, { countedCash: "150" })).status).toBe(200);
    const today = new Date(Date.now() + 330 * 60_000).toISOString().slice(0, 10);
    const day = await get(owner, `/pos/day-close?date=${today}`);
    expect(day).toMatchObject({ needSignOff: 1, open: 0, totalDifference: "150.00" });
    expect(day.sessions[0]).toMatchObject({ difference: "150.00", needsSignOff: true });
    expect((await t.call(owner, "POST", `/pos/sessions/${session}/sign-variance`, { note: "Counted twice, tip jar" })).body.error).toBe("cannot_sign_own_shift");
    expect((await t.call(admin, "POST", `/pos/sessions/${session}/sign-variance`, { note: "Tip jar money, accepted" })).status).toBe(200);
    expect((await get(owner, `/pos/day-close?date=${today}`)).needSignOff).toBe(0);
    expect((await t.call(admin, "POST", `/pos/sessions/${session}/sign-variance`, { note: "Again" })).body.error).toBe("already_signed");
  });

  it("an unsigned difference also holds up the month-end", async () => {
    const terminal = (await t.call(owner, "POST", "/pos/terminals", { name: "Back counter" })).body.id;
    const session = (await t.call(owner, "POST", "/pos/sessions", { terminalId: terminal, openingCash: "0" })).body.id;
    await t.call(owner, "POST", `/pos/sessions/${session}/close`, { countedCash: "20" });
    const thisMonth = new Date(Date.now() + 330 * 60_000).toISOString().slice(0, 7);
    const c = (await get(owner, `/close/checklist?period=${thisMonth}`)) as { items: { key: string; count: number }[] };
    expect(c.items.find((i) => i.key === "cashVariance")!.count).toBe(1);
  });

  it("keeps businesses apart", async () => {
    const other = (await t.signup("close-other")).cookie;
    expect((await get(other, `/close/checklist?period=${PERIOD}`)).items.find((i: { key: string }) => i.key === "suspense").count).toBe(0);
    expect((await get(other, `/close/snapshots?period=${PERIOD}`)).snapshots).toEqual([]);
  });
});
