import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./migrations",
  dbCredentials: {
    url: process.env.DATABASE_OWNER_URL ?? "postgres://varchasv_owner:varchasv_owner_dev@localhost:5433/varchasv",
  },
});
