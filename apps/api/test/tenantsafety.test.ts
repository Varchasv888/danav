import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { OWNER_URL } from "./helpers.js";

let owner: ReturnType<typeof postgres>;

beforeAll(() => { owner = postgres(OWNER_URL, { max: 1 }); });
afterAll(async () => { await owner.end(); });

/** Tables that hold a tenant's data must keep other tenants out at the database, whatever the application does. */
describe("tenant isolation in the database", () => {
  it("every table with a tenant_id has row level security on and a tenant policy", async () => {
    const rows = await owner<{ table: string; rls: boolean; policies: number }[]>`
      select c.relname as table, c.relrowsecurity as rls,
        (select count(*)::int from pg_policy p where p.polrelid = c.oid) as policies
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace and n.nspname = 'public'
      where c.relkind = 'r' and exists (select 1 from information_schema.columns k where k.table_schema = 'public' and k.table_name = c.relname and k.column_name = 'tenant_id')
      order by c.relname`;
    expect(rows.length).toBeGreaterThan(100);
    // sessions is looked up by token before anyone's business is known, so it cannot be tenant-scoped.
    const open = rows.filter((r) => (!r.rls || r.policies === 0) && r.table !== "sessions").map((r) => r.table);
    expect(open).toEqual([]);
  });

  it("the policy compares tenant_id with the session's tenant", async () => {
    const rows = await owner<{ table: string; qual: string | null }[]>`
      select c.relname as table, pg_get_expr(p.polqual, p.polrelid) as qual
      from pg_policy p join pg_class c on c.oid = p.polrelid
      where exists (select 1 from information_schema.columns k where k.table_schema = 'public' and k.table_name = c.relname and k.column_name = 'tenant_id')`;
    const wrong = rows.filter((r) => !(r.qual ?? "").includes("app_tenant()") && !(r.qual ?? "").includes("user_tenants")).map((r) => r.table);
    expect(wrong).toEqual([]);
  });

  it("the application role cannot change or remove the append-only records", async () => {
    const rows = await owner<{ table: string; priv: string }[]>`
      select t.table_name as table, p.privilege_type as priv
      from information_schema.tables t
      join information_schema.role_table_grants p on p.table_name = t.table_name and p.table_schema = 'public' and p.grantee = 'varchasv_app'
      where t.table_schema = 'public' and t.table_name in ('gl_entries', 'stock_ledger', 'audit_log') and p.privilege_type in ('UPDATE', 'DELETE')`;
    // audit_log is updated only through the sealing function, never by a direct grant.
    expect(rows).toEqual([]);
  });
});
