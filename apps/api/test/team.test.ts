import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let owner: string;
let roles: { id: string; key: string }[];

beforeAll(async () => {
  t = await testApp();
  owner = (await t.signup("teamowner")).cookie;
  roles = (await t.call(owner, "GET", "/roles")).body;
});
afterAll(() => t.close());

const roleId = (key: string) => roles.find((r) => r.key === key)!.id;

describe("invitations", () => {
  let accountant = "";

  it("invites a new person, who joins with the invited role", async () => {
    const email = `acct-${t.run}@test.varchasv.in`;
    const inv = await t.call(owner, "POST", "/invitations", { email, roleId: roleId("accountant") });
    expect(inv.status).toBe(201);
    expect(t.mailer.sent.at(-1)?.to).toBe(email);
    const token = inv.body.inviteUrl.split("/invite/")[1];

    const lookup = await t.call("", "GET", `/invitations/lookup/${token}`);
    expect(lookup.body).toMatchObject({ email, roleName: "Accountant", hasAccount: false });

    const accept = await t.call("", "POST", "/invitations/accept", { token, name: "Meena Accountant", password: "ledger-balanced-1" });
    expect(accept.status).toBe(200);
    accountant = accept.cookie;
    const me = (await t.call(accountant, "GET", "/auth/me")).body;
    expect(me.role).toBe("accountant");
    expect(me.permissions).toContain("accounts.create");
    expect(me.permissions).not.toContain("company.edit");

    // The link works once.
    expect((await t.call("", "POST", "/invitations/accept", { token, name: "Again", password: "whatever-123" })).status).toBe(404);
  });

  it("enforces what each role may do", async () => {
    const companies = (await t.call(accountant, "GET", "/companies")).body;
    expect((await t.call(accountant, "PATCH", `/companies/${companies[0].id}`, { name: "Renamed" })).status).toBe(403);
    expect((await t.call(accountant, "POST", "/invitations", { email: `x-${t.run}@test.varchasv.in`, roleId: roleId("owner") })).status).toBe(403);
  });

  it("lists members and protects the owner", async () => {
    const members = (await t.call(owner, "GET", "/members")).body;
    expect(members).toHaveLength(2);
    const me = members.find((m: { isYou: boolean }) => m.isYou);
    expect((await t.call(owner, "PATCH", `/members/${me.id}`, { status: "suspended" })).body.error).toBe("cannot_change_self");
  });

  it("suspending a member signs them out of this business", async () => {
    const members = (await t.call(owner, "GET", "/members")).body;
    const meena = members.find((m: { name: string }) => m.name === "Meena Accountant");
    expect((await t.call(owner, "PATCH", `/members/${meena.id}`, { status: "suspended" })).status).toBe(200);
    expect((await t.call(accountant, "GET", "/companies")).status).toBe(401);
  });

  it("revoked invitations can't be used", async () => {
    const inv = await t.call(owner, "POST", "/invitations", { email: `rev-${t.run}@test.varchasv.in`, roleId: roleId("viewer") });
    await t.call(owner, "DELETE", `/invitations/${inv.body.id}`);
    const token = inv.body.inviteUrl.split("/invite/")[1];
    expect((await t.call("", "GET", `/invitations/lookup/${token}`)).status).toBe(404);
  });
});

describe("custom roles", () => {
  it("creates a role but refuses unknown permissions and edits to system roles", async () => {
    const counts = (await t.call(owner, "GET", "/roles")).body as { key: string; members: number }[];
    expect(counts.find((r) => r.key === "owner")?.members).toBe(1);
    expect(counts.find((r) => r.key === "accountant")?.members).toBe(1);
    const r = await t.call(owner, "POST", "/roles", { name: "Billing clerk", permissions: ["sales.view", "sales.create"] });
    expect(r.status).toBe(201);
    expect((await t.call(owner, "POST", "/roles", { name: "Bad", permissions: ["sales.fly"] })).status).toBe(400);
    expect((await t.call(owner, "PATCH", `/roles/${roleId("viewer")}`, { name: "Renamed" })).body.error).toBe("system_role");
    expect((await t.call(owner, "DELETE", `/roles/${r.body.id}`)).status).toBe(200);
  });
});

describe("several businesses on one login", () => {
  it("creates a second business and switches between them", async () => {
    const created = await t.call(owner, "POST", "/tenants", { businessName: "Second Shop", stateCode: "09" });
    expect(created.status).toBe(201);
    const me = (await t.call(owner, "GET", "/auth/me")).body;
    expect(me.tenants).toHaveLength(2);
    expect(me.tenantId).toBe(created.body.tenantId);
    const other = me.tenants.find((x: { tenantId: string }) => x.tenantId !== created.body.tenantId);
    expect((await t.call(owner, "POST", "/auth/switch", { tenantId: other.tenantId })).status).toBe(200);
    expect((await t.call(owner, "GET", "/auth/me")).body.tenantId).toBe(other.tenantId);
  });
});
