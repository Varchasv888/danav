import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { createDb } from "./index.js";

// Migrations run as the database owner; the app itself connects as varchasv_app (RLS enforced).
const url = process.env.DATABASE_OWNER_URL ?? "postgres://varchasv_owner:varchasv_owner_dev@localhost:5433/varchasv";
const { db, close } = createDb(url, { max: 1 });
await migrate(db, { migrationsFolder: fileURLToPath(new URL("../migrations", import.meta.url)) });
await close();
console.log("migrations applied");
