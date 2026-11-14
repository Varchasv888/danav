import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let owner: string;
let clerk: string;
const id: Record<string, string> = {};

const get = async (cookie: string, url: string) => (await t.call(cookie, "GET", url)).body;
const bankOf = async () => (await get(owner, "/accounts") as { id: string; bank: { accountNumber?: string } | null }[]).find((a) => a.id === id.supplier)!.bank;
const patchBank = (cookie: string, accountNumber: string, extra: Record<string, unknown> = {}) =>
  t.call(cookie, "PATCH", `/accounts/${id.supplier}`, { bank: { accountNumber, ifsc: "HDFC0001234" }, ...extra });

beforeAll(async () => {
  t = await testApp();
  owner = (await t.signup("bankapproval")).cookie;
  const roles = (await t.call(owner, "GET", "/roles")).body as { id: string; key: string }[];
  const email = `clerk-${t.run}@test.varchasv.in`;
  const inv = await t.call(owner, "POST", "/invitations", { email, roleId: roles.find((r) => r.key === "accountant")!.id });
  clerk = (await t.call("", "POST", "/invitations/accept", { token: inv.body.inviteUrl.split("/invite/")[1], name: "Clerk", password: "ledger-balanced-1" })).cookie;
  const groups: { id: string; key: string }[] = await get(owner, "/accounts/groups");
  id.supplier = (await t.call(owner, "POST", "/accounts", { name: "Approval Supplier", groupId: groups.find((g) => g.key === "sundry_creditors")!.id, stateCode: "27", bank: { accountNumber: "1111222233", ifsc: "HDFC0001234" } })).body.id;
});
afterAll(() => t.close());

describe("maker-checker on bank details", () => {
  it("is off to begin with: a change applies straight away", async () => {
    expect(await get(owner, "/settings/approvals")).toEqual({ bankChange: false });
    expect((await patchBank(clerk, "2222333344")).body.pendingApproval).toBeUndefined();
    expect((await bankOf())!.accountNumber).toBe("2222333344");
  });

  it("holds a clerk's change when switched on, while the rest of the edit goes through", async () => {
    expect((await t.call(owner, "PUT", "/settings/approvals", { bankChange: true })).body).toEqual({ bankChange: true });
    const r = await patchBank(clerk, "3333444455", { phone: "9811122233" });
    expect(r.status).toBe(200);
    expect(r.body.pendingApproval).toBeTruthy();
    expect(r.body.phone).toBe("9811122233");
    expect((await bankOf())!.accountNumber).toBe("2222333344");
    id.req = r.body.pendingApproval;
    const pending = (await get(owner, "/change-requests?status=pending")) as { id: string; entityName: string; requestedByName: string }[];
    expect(pending).toHaveLength(1);
    expect(pending[0]).toMatchObject({ entityName: "Approval Supplier", requestedByName: "Clerk" });
  });

  it("a clerk cannot approve; a person with the right can, and then the bank changes", async () => {
    expect((await t.call(clerk, "POST", `/change-requests/${id.req}/decide`, { decision: "approve" })).status).toBe(403);
    expect((await bankOf())!.accountNumber).toBe("2222333344");
    const ok = await t.call(owner, "POST", `/change-requests/${id.req}/decide`, { decision: "approve" });
    expect(ok.body).toMatchObject({ status: "approved" });
    expect((await bankOf())!.accountNumber).toBe("3333444455");
    expect((await t.call(owner, "POST", `/change-requests/${id.req}/decide`, { decision: "approve" })).body.error).toBe("request_already_decided");
  });

  it("a rejection leaves the bank details as they were", async () => {
    const r = await patchBank(clerk, "9999888877");
    const no = await t.call(owner, "POST", `/change-requests/${r.body.pendingApproval}/decide`, { decision: "reject", note: "Not verified" });
    expect(no.body).toMatchObject({ status: "rejected", decisionNote: "Not verified" });
    expect((await bankOf())!.accountNumber).toBe("3333444455");
  });

  it("someone holding the right changes it directly, and an unchanged value is not held", async () => {
    expect((await patchBank(owner, "5555666677")).body.pendingApproval).toBeUndefined();
    expect((await bankOf())!.accountNumber).toBe("5555666677");
    const same = await patchBank(clerk, "5555666677");
    expect(same.body.pendingApproval).toBeUndefined();
    expect((await get(owner, "/change-requests?status=pending"))).toEqual([]);
  });

  it("applies the approver and the requester to the audit trail, and keeps businesses apart", async () => {
    const trail = (await get(owner, "/audit-log?limit=50")) as { entity: string; after: { approvedRequest?: string } | null }[];
    expect(trail.some((a) => a.entity === "account" && a.after?.approvedRequest === id.req)).toBe(true);
    const other = (await t.signup("bankapproval-other")).cookie;
    expect((await get(other, "/change-requests"))).toEqual([]);
    expect((await t.call(other, "POST", `/change-requests/${id.req}/decide`, { decision: "approve" })).status).toBe(404);
  });
});
