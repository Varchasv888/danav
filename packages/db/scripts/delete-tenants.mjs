// Permanently deletes whole businesses (tenants) and all their data, plus the logins that belonged only
// to them. For removing demo data; there is no undo.
//   node packages/db/scripts/delete-tenants.mjs <tenant-id> [...]           (dry run: counts only)
//   node packages/db/scripts/delete-tenants.mjs <tenant-id> [...] --yes     (deletes)
// Uses DATABASE_OWNER_URL.
import postgres from "postgres";

const url = process.env.DATABASE_OWNER_URL;
if (!url) throw new Error("set DATABASE_OWNER_URL");
const ids = process.argv.slice(2).filter((a) => /^[0-9a-f-]{36}$/.test(a));
const yes = process.argv.includes("--yes");
if (!ids.length) throw new Error("pass tenant ids");
const sql = postgres(url, { max: 1, onnotice: () => {} });
try {
  await sql.begin(async (tx) => {
    const tenants = await tx`select id, name from tenants where id in ${tx(ids)}`;
    if (tenants.length !== ids.length) throw new Error(`only ${tenants.length} of ${ids.length} tenants found`);
    // Logins that belong to these businesses and to no other one.
    const users = await tx`
      select u.id from users u where exists (select 1 from memberships m where m.user_id = u.id and m.tenant_id in ${tx(ids)})
        and not exists (select 1 from memberships m where m.user_id = u.id and m.tenant_id not in ${tx(ids)})`;
    console.log(`${tenants.length} businesses (${[...new Set(tenants.map((t) => t.name))].join(", ")}), ${users.length} logins only in them`);
    if (!yes) { console.log("dry run: nothing deleted (add --yes)"); return; }
    await tx`delete from tenants where id in ${tx(ids)}`;
    if (users.length) await tx`delete from users where id in ${tx(users.map((u) => u.id))}`;
    console.log("deleted");
  });
} finally {
  await sql.end();
}
