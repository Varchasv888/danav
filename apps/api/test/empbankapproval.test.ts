import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let owner: string;
let hr: string;
const id: Record<string, string> = {};

const get = async (cookie: string, url: string) => (await t.call(cookie, "GET", url)).body;
const employee = async () => (await get(owner, `/employees/${id.emp}`)) as { bankName: string | null; bankIfsc: string | null; bankAccountLast4: string | null };
const patch = (cookie: string, body: Record<string, unknown>) => t.call(cookie, "PATCH", `/employees/${id.emp}`, body);

beforeAll(async () => {
  t = await testApp();
  owner = (await t.signup("empbank")).cookie;
  const roles = (await t.call(owner, "GET", "/roles")).body as { id: string; key: string }[];
  const inv = await t.call(owner, "POST", "/invitations", { email: `hr-${t.run}@test.varchasv.in`, roleId: roles.find((r) => r.key === "hr")!.id });
  hr = (await t.call("", "POST", "/invitations/accept", { token: inv.body.inviteUrl.split("/invite/")[1], name: "HR Clerk", password: "ledger-balanced-1" })).cookie;
  id.emp = (await t.call(owner, "POST", "/employees", {
    name: "Salary Person", gender: "female", joinedOn: "2026-01-01", workState: "27", bankName: "HDFC", bankIfsc: "HDFC0001234", bankAccount: "1111222233",
    components: [{ code: "BASIC", name: "Basic", monthly: "15000", pfWage: true }],
  })).body.id;
});
afterAll(() => t.close());

describe("maker-checker on employee bank details", () => {
  it("applies straight away while the switch is off", async () => {
    expect((await patch(hr, { bankAccount: "2222333344" })).body.pendingApproval).toBeUndefined();
    expect((await employee()).bankAccountLast4).toBe("3344");
  });

  it("holds an HR clerk's change when switched on, and lets the rest of the edit through", async () => {
    await t.call(owner, "PUT", "/settings/approvals", { bankChange: true });
    const r = await patch(hr, { bankAccount: "5555666677", bankIfsc: "ICIC0004321", phone: "9811122233" });
    expect(r.status).toBe(200);
    expect(r.body.pendingApproval).toBeTruthy();
    expect(r.body.phone).toBe("9811122233");
    expect(await employee()).toMatchObject({ bankAccountLast4: "3344", bankIfsc: "HDFC0001234" });
    id.req = r.body.pendingApproval;
    const pending = (await get(owner, "/change-requests?status=pending")) as { id: string; kind: string; entityName: string; after: Record<string, unknown> }[];
    expect(pending).toHaveLength(1);
    expect(pending[0]).toMatchObject({ kind: "employee_bank", entityName: "Salary Person", after: { accountNumber: "6677", ifsc: "ICIC0004321" } });
    // Only the last four digits ever leave the server; the sealed number does not.
    expect(JSON.stringify(pending[0])).not.toContain("_apply");
    expect(JSON.stringify(pending[0])).not.toContain("5555666677");
  });

  it("the requester cannot approve; another person with the right can, and then the bank changes", async () => {
    expect((await t.call(hr, "POST", `/change-requests/${id.req}/decide`, { decision: "approve" })).status).toBe(403);
    const ok = await t.call(owner, "POST", `/change-requests/${id.req}/decide`, { decision: "approve" });
    expect(ok.body).toMatchObject({ status: "approved" });
    expect(await employee()).toMatchObject({ bankAccountLast4: "6677", bankIfsc: "ICIC0004321", bankName: "HDFC" });
  });

  it("a rejection leaves things as they were, and an unchanged value is not held", async () => {
    const r = await patch(hr, { bankAccount: "9999888877" });
    await t.call(owner, "POST", `/change-requests/${r.body.pendingApproval}/decide`, { decision: "reject", note: "Not verified" });
    expect((await employee()).bankAccountLast4).toBe("6677");
    expect((await patch(hr, { bankAccount: "5555666677" })).body.pendingApproval).toBeUndefined();
    expect((await patch(owner, { bankAccount: "1212121212" })).body.pendingApproval).toBeUndefined();
    expect((await employee()).bankAccountLast4).toBe("1212");
  });
});
