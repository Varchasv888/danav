import { createDb } from "@varchasv/db";
import { buildApp } from "../src/app.js";
import { LogMailer } from "../src/lib/mailer.js";

// Needs the dev Postgres from docker-compose (npm run db:up && npm run db:migrate).
export const APP_URL = process.env.DATABASE_URL ?? "postgres://varchasv_app:varchasv_app_dev@localhost:5433/varchasv";
export const OWNER_URL = process.env.DATABASE_OWNER_URL ?? "postgres://varchasv_owner:varchasv_owner_dev@localhost:5433/varchasv";

export async function testApp() {
  const appDb = createDb(APP_URL, { max: 4 });
  const ownerDb = createDb(OWNER_URL, { max: 1 });
  const mailer = new LogMailer(() => {});
  const app = await buildApp({ db: appDb.db, logger: process.env.TEST_LOG ? { level: "error" } : false, rateLimits: false, mailer });
  const run = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

  type Inject = Parameters<typeof app.inject>[0];
  /** JSON request as a signed-in user (cookie string from signup/login). */
  const call = async (cookie: string, method: string, url: string, payload?: unknown) => {
    const res = await app.inject({ method, url, headers: cookie ? { cookie } : {}, payload } as Inject);
    return { status: res.statusCode, body: res.body ? (/json/.test(String(res.headers["content-type"] ?? "")) ? res.json() : res.body) : undefined, cookie: sessionCookie(res.cookies) };
  };
  const sessionCookie = (cookies: { name: string; value: string }[]) => {
    const c = cookies.find((x) => x.name === "vsid");
    return c ? `vsid=${c.value}` : "";
  };
  const signup = async (tag: string, extra: Record<string, unknown> = {}) => {
    const r = await call("", "POST", "/auth/signup", {
      name: `Owner ${tag}`, email: `${tag}-${run}@test.varchasv.in`, password: "correct horse battery", businessName: `${tag} Traders`, stateCode: "27", ...extra,
    });
    return { ...r, email: `${tag}-${run}@test.varchasv.in` };
  };
  const close = async () => {
    await app.close();
    await appDb.close();
    await ownerDb.close();
  };
  return { app, appDb, ownerDb, mailer, run, call, signup, close };
}
