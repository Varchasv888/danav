// Lists every business (tenant) with its companies, owner logins and size, to pick demo data to remove.
//   node packages/db/scripts/list-tenants.mjs            (uses DATABASE_OWNER_URL)
import postgres from "postgres";

const url = process.env.DATABASE_OWNER_URL;
if (!url) throw new Error("set DATABASE_OWNER_URL");
const sql = postgres(url, { max: 1, onnotice: () => {} });
const rows = await sql`
  select t.id, t.name, t.industry, t.created_at,
    (select string_agg(c.name, ', ') from companies c where c.tenant_id = t.id) as companies,
    (select string_agg(u.email, ', ') from memberships m join users u on u.id = m.user_id where m.tenant_id = t.id) as logins,
    (select count(*)::int from items i where i.tenant_id = t.id) as items,
    (select count(*)::int from vouchers v where v.tenant_id = t.id) as vouchers
  from tenants t order by t.created_at`;
for (const r of rows) console.log(JSON.stringify({ id: r.id, name: r.name, industry: r.industry, created: r.created_at, companies: r.companies, items: r.items, vouchers: r.vouchers, logins: (r.logins ?? "").split(", ").length }));
await sql.end();
