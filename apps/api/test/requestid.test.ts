import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;

const inject = (method: "GET" | "POST", url: string, headers: Record<string, string> = {}, payload?: unknown) =>
  t.app.inject({ method, url, headers: { cookie: c, ...headers }, ...(payload ? { payload } : {}) } as never);
const auditRows = async () => (await t.call(c, "GET", "/audit-log?limit=20")).body as { entity: string; requestId: string | null }[];

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("reqid")).cookie;
});
afterAll(() => t.close());

describe("request ids", () => {
  it("answers every request with an id, a new one each time", async () => {
    const a = await inject("GET", "/auth/me");
    const b = await inject("GET", "/auth/me");
    expect(String(a.headers["x-request-id"])).toMatch(/^[0-9a-f-]{36}$/);
    expect(a.headers["x-request-id"]).not.toBe(b.headers["x-request-id"]);
  });

  it("keeps the caller's id when it is a sensible token, and replaces one that is not", async () => {
    expect((await inject("GET", "/auth/me", { "x-request-id": "shop-counter-0042" })).headers["x-request-id"]).toBe("shop-counter-0042");
    const odd = await inject("GET", "/auth/me", { "x-request-id": "bad id with spaces <script>" });
    expect(String(odd.headers["x-request-id"])).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("writes the id on the audit entries a request makes, so a change can be traced to its request", async () => {
    const res = await inject("POST", "/warehouses", { "x-request-id": "trace-this-change-1", "content-type": "application/json" }, { name: "Traced store" });
    expect(res.statusCode).toBe(201);
    const row = (await auditRows()).find((r) => r.requestId === "trace-this-change-1");
    expect(row).toBeTruthy();
  });
});
