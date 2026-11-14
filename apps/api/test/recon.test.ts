import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let owner: string;
let admin: string;
let adminId = "";
const id: Record<string, string> = {};
const year = new Date().getUTCFullYear();
const d = (md: string) => `${year}-${md}`;

const get = async (cookie: string, url: string) => (await t.call(cookie, "GET", url)).body;
const journal = (date: string, lines: { accountId: string; debit?: string; credit?: string }[]) => t.call(owner, "POST", "/vouchers", { type: "journal", date, lines });

beforeAll(async () => {
  t = await testApp();
  owner = (await t.signup("recon")).cookie;
  const roles = (await t.call(owner, "GET", "/roles")).body as { id: string; key: string }[];
  const inv = await t.call(owner, "POST", "/invitations", { email: `rec-${t.run}@test.varchasv.in`, roleId: roles.find((r) => r.key === "admin")!.id });
  const accepted = await t.call("", "POST", "/invitations/accept", { token: inv.body.inviteUrl.split("/invite/")[1], name: "Reviewer", password: "ledger-balanced-1" });
  admin = accepted.cookie;
  adminId = (await get(admin, "/auth/me")).user.id;
  const groups: { id: string; key: string }[] = await get(owner, "/accounts/groups");
  const group = (k: string) => groups.find((g) => g.key === k)!.id;
  id.cust = (await t.call(owner, "POST", "/accounts", { name: "Statement Customer", groupId: group("sundry_debtors"), stateCode: "27" })).body.id;
  id.sales = (await t.call(owner, "POST", "/accounts", { name: "Credit Sales", groupId: group("sales_accounts") })).body.id;
  id.cash = ((await get(owner, "/accounts")) as { id: string; key: string | null }[]).find((a) => a.key === "cash")!.id;
  await journal(d("10-01"), [{ accountId: id.cust, debit: "5000" }, { accountId: id.sales, credit: "5000" }]);
  await journal(d("10-05"), [{ accountId: id.cust, debit: "3000" }, { accountId: id.sales, credit: "3000" }]);
  await journal(d("10-08"), [{ accountId: id.cust, debit: "2000" }, { accountId: id.sales, credit: "2000" }]);
  await t.call(owner, "POST", "/vouchers", { type: "receipt", date: d("10-10"), lines: [{ accountId: id.cash, debit: "4000" }, { accountId: id.cust, credit: "4000" }] });
  await journal(d("10-12"), [{ accountId: id.cust, debit: "700" }, { accountId: id.sales, credit: "700" }]);
});
afterAll(() => t.close());

const theirs = [
  { ref: "", date: d("10-02"), amount: "5000", description: "Goods" },
  { ref: "", date: d("10-06"), amount: "5000", description: "Goods, two lots" },
  { ref: "", date: d("10-11"), amount: "-4000", description: "Payment" },
  { ref: "", date: d("10-15"), amount: "150", description: "Freight charged to us" },
];

describe("reconciliation workbench", () => {
  it("pairs a customer's statement with our ledger, including one against several, and leaves the rest as exceptions", async () => {
    const r = await t.call(owner, "POST", "/recon/runs", { kind: "customer_statement", partyId: id.cust, from: d("10-01"), to: d("10-31"), theirs });
    expect(r.status).toBe(201);
    id.run = r.body.id;
    expect(r.body.totals).toMatchObject({ ours: "6700.00", theirs: "6150.00", difference: "550.00", exceptions: 2 });
    const matched = r.body.items.filter((i: { status: string }) => i.status === "matched");
    expect(matched).toHaveLength(7);
    expect(new Set(matched.map((i: { rule: string }) => i.rule))).toEqual(new Set(["amount_date", "one_to_many"]));
    const open = r.body.items.filter((i: { status: string }) => i.status === "unmatched");
    expect(open.map((i: { side: string; amount: string }) => `${i.side}:${i.amount}`).sort()).toEqual(["ours:700.00", "theirs:150.00"]);
    id.ours700 = open.find((i: { side: string }) => i.side === "ours").id;
    id.theirs150 = open.find((i: { side: string }) => i.side === "theirs").id;
    expect(r.body.events[0].action).toBe("started");
  });

  it("can be matched and unmatched by hand, and the history keeps both", async () => {
    const m = await t.call(owner, "POST", `/recon/runs/${id.run}/match`, { itemIds: [id.ours700, id.theirs150] });
    expect(m.body.difference).toBe("550.00");
    expect((await t.call(owner, "POST", `/recon/runs/${id.run}/match`, { itemIds: [id.ours700, id.theirs150] })).body.error).toBe("items_not_open");
    await t.call(owner, "POST", `/recon/runs/${id.run}/unmatch`, { groupId: m.body.group });
    const run = await get(owner, `/recon/runs/${id.run}`);
    expect(run.totals.exceptions).toBe(2);
    expect(run.events.map((e: { action: string }) => e.action)).toEqual(expect.arrayContaining(["matched", "unmatched"]));
  });

  it("will not close with exceptions that have no reason and owner, then writes the difference off with a second person's approval", async () => {
    expect((await t.call(admin, "POST", `/recon/runs/${id.run}/close`, {})).body.error).toBe("exceptions_need_owner");
    expect((await t.call(owner, "PATCH", `/recon/items/${id.ours700}`, { reasonCode: "mystery" })).status).toBe(400);
    for (const item of [id.ours700, id.theirs150]) await t.call(owner, "PATCH", `/recon/items/${item}`, { reasonCode: "missing_document", ownerId: adminId, note: "Ask the customer for the freight bill" });
    const w = await t.call(owner, "POST", `/recon/runs/${id.run}/writeoffs`, { itemIds: [id.ours700, id.theirs150], reasonCode: "missing_document", note: "Small, accepted by the owner" });
    expect(w.status).toBe(201);
    expect(w.body.amount).toBe("550.00");
    expect((await t.call(owner, "POST", `/recon/writeoffs/${w.body.id}/decide`, { decision: "approve" })).body.error).toBe("cannot_approve_own_writeoff");
    expect((await t.call(admin, "POST", `/recon/writeoffs/${w.body.id}/decide`, { decision: "approve" })).status).toBe(200);
    // Our ledger now agrees with their statement.
    expect((await get(owner, `/reports/ledger/${id.cust}?from=${year}-01-01&to=${year}-12-31`)).closing).toBe("6150.00");
    const run = await get(owner, `/recon/runs/${id.run}`);
    expect(run.items.filter((i: { status: string }) => i.status === "written_off")).toHaveLength(2);
    expect(run.events.map((e: { action: string }) => e.action)).toEqual(expect.arrayContaining(["writeoff_requested", "writeoff_approved"]));
    expect((await t.call(admin, "POST", `/recon/runs/${id.run}/close`, {})).status).toBe(200);
    expect((await t.call(owner, "POST", `/recon/runs/${id.run}/match`, { itemIds: [id.ours700, id.theirs150] })).body.error).toBe("run_closed");
  });

  it("lists runs and keeps businesses apart", async () => {
    expect((await get(owner, "/recon/runs"))[0]).toMatchObject({ party: "Statement Customer", status: "closed", exceptions: 0 });
    const other = (await t.signup("recon-other")).cookie;
    expect((await get(other, "/recon/runs"))).toEqual([]);
    expect((await t.call(other, "GET", `/recon/runs/${id.run}`)).status).toBe(404);
  });
});
