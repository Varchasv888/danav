import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { OWNER_URL, testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
let owner: ReturnType<typeof postgres>;
let tenantId: string;

const verify = async (anchor?: { seq: number; hash: string }) =>
  (await t.call(c, "POST", "/audit-log/verify", anchor ? { anchor } : {})).body as { ok: boolean; checked: number; broken?: { reason: string; seq: number } };
const anchor = async () => (await t.call(c, "GET", "/audit-log/anchor")).body as { seq: number; hash: string } | null;

beforeAll(async () => {
  t = await testApp();
  const s = await t.signup("anchor");
  c = s.cookie;
  tenantId = (await t.call(c, "GET", "/auth/me")).body.tenantId;
  owner = postgres(OWNER_URL, { max: 1 });
});
afterAll(async () => {
  await owner.end();
  await t.close();
});

describe("outside copy of the audit trail's latest hash", () => {
  it("a kept anchor stays valid as the trail grows", async () => {
    const a = (await anchor())!;
    expect(a.seq).toBeGreaterThan(0);
    expect(a.hash).toMatch(/^[0-9a-f]{64}$/);
    expect(await verify(a)).toMatchObject({ ok: true });
    await t.call(c, "POST", "/warehouses", { name: "After the anchor" });
    expect(await verify(a)).toMatchObject({ ok: true });
  });

  it("a deleted last entry, which the chain alone cannot see, is caught by the kept anchor", async () => {
    const kept = (await anchor())!;
    expect(await verify()).toMatchObject({ ok: true });
    await owner.begin(async (sql) => {
      await sql`alter table audit_log disable trigger audit_log_no_change`;
      await sql`delete from audit_log where tenant_id = ${tenantId} and chain_seq >= ${kept.seq}`;
      await sql`alter table audit_log enable trigger audit_log_no_change`;
    });
    // The remaining chain is intact...
    expect(await verify()).toMatchObject({ ok: true });
    // ...but the entry the saved copy points at is gone.
    const check = await verify(kept);
    expect(check.ok).toBe(false);
    expect(check.broken).toMatchObject({ reason: "anchor", seq: kept.seq });
  });

  it("a made-up anchor is refused", async () => {
    expect((await verify({ seq: 1, hash: "0".repeat(64) })).ok).toBe(false);
    expect((await t.call(c, "POST", "/audit-log/verify", { anchor: { seq: 1, hash: "nope" } })).status).toBe(400);
  });
});
