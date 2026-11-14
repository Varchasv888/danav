import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { OWNER_URL, testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
let owner: ReturnType<typeof postgres>;

const verify = async (cookie = c) => (await t.call(cookie, "POST", "/audit-log/verify")).body as { ok: boolean; checked: number; sealedNow: number; broken?: { reason: string } };

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("chain")).cookie;
  owner = postgres(OWNER_URL, { max: 1 });
});
afterAll(async () => {
  await owner.end();
  await t.close();
});

describe("tamper-evident audit trail", () => {
  it("seals new entries into a chain and verifies it", async () => {
    const first = await verify();
    expect(first.ok).toBe(true);
    expect(first.sealedNow).toBeGreaterThan(0);
    expect(first.checked).toBe(first.sealedNow);

    const groups: { id: string; key: string }[] = (await t.call(c, "GET", "/accounts/groups")).body;
    const debtors = groups.find((g) => g.key === "sundry_debtors")!.id;
    await t.call(c, "POST", "/accounts", { name: "Chain Probe Account", groupId: debtors, stateCode: "27" });
    // More than ten entries, so a sort on the number as text (1, 10, 11, 2...) would show up.
    for (let i = 0; i < 14; i++) await t.call(c, "POST", "/accounts", { name: `Chain Filler ${i}`, groupId: debtors, stateCode: "27" });
    const second = await verify();
    expect(second).toMatchObject({ ok: true, checked: first.checked + second.sealedNow });
    expect(second.sealedNow).toBeGreaterThan(0);
    expect((await verify()).sealedNow).toBe(0);
  });

  it("does not let the app change an entry once written", async () => {
    const app = postgres(process.env.DATABASE_URL ?? "postgres://varchasv_app:varchasv_app_dev@localhost:5433/varchasv", { max: 1 });
    await expect(app`update audit_log set action = 'forged' where entity = 'account'`).rejects.toThrow();
    await app.end();
  });

  const asOwner = async (fn: (sql: postgres.TransactionSql) => Promise<unknown>) => {
    // Only the database owner can do this, and only by switching the guard off: exactly what the chain is for.
    await owner.begin(async (sql) => {
      await sql`alter table audit_log disable trigger audit_log_no_change`;
      await fn(sql);
      await sql`alter table audit_log enable trigger audit_log_no_change`;
    });
  };

  it("catches an edited entry", async () => {
    await asOwner(async (sql) => { await sql`update audit_log set after = '{"name":"Someone Else"}'::jsonb where entity = 'account' and after::text like '%Chain Probe Account%'`; });
    const edited = await verify();
    expect(edited.ok).toBe(false);
    expect(edited.broken?.reason).toBe("content");
  });

  it("catches a removed entry", async () => {
    const two = await t.signup("chain-two");
    const groups: { id: string; key: string }[] = (await t.call(two.cookie, "GET", "/accounts/groups")).body;
    for (const name of ["Entry One", "Entry Two", "Entry Three"]) await t.call(two.cookie, "POST", "/accounts", { name, groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" });
    const sealed = await verify(two.cookie);
    expect(sealed.ok).toBe(true);
    expect(sealed.checked).toBeGreaterThan(3);
    const [m] = await owner`select m.tenant_id from memberships m join users u on u.id = m.user_id where u.email = ${two.email}`;
    await asOwner(async (sql) => { await sql`delete from audit_log where tenant_id = ${m!.tenant_id} and chain_seq = 2`; });
    const result = await verify(two.cookie);
    expect(result.ok).toBe(false);
    expect(result.broken?.reason).toBe("gap");
  });
});
