import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let cookie = "";
let token = "";
let deviceId = "";
const bad = crypto.randomUUID();

const app = async (method: string, url: string, payload?: unknown) => {
  const res = await t.app.inject({ method: method as "GET", url, headers: { authorization: `Bearer ${token}` }, payload: payload as object });
  return { status: res.statusCode, body: res.json() };
};
const owner = async (method: string, url: string, payload?: unknown) => t.call(cookie, method, url, payload);

beforeAll(async () => {
  t = await testApp();
  const s = await t.signup("syncq");
  cookie = s.cookie;
  token = (await t.call("", "POST", "/auth/login", { email: s.email, password: "correct horse battery", client: "app" })).body.token;
  deviceId = (await app("POST", "/devices", { name: "Counter 2", platform: "android" })).body.id;
});
afterAll(() => t.close());

describe("device status and the queue of refused operations", () => {
  it("starts with no refusals", async () => {
    const list = (await owner("GET", "/sync/status")).body;
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ name: "Counter 2", code: "A1", openRejections: 0, revokedAt: null });
    expect((await owner("GET", "/sync/rejections")).body).toEqual([]);
  });

  it("writes down what the server refused, once however often the device retries", async () => {
    const op = { opId: bad, kind: "voucher.create", payload: { nonsense: true } };
    expect((await app("POST", "/sync/push", { deviceId, ops: [op] })).body.results[0]).toMatchObject({ ok: false, error: "validation" });
    await app("POST", "/sync/push", { deviceId, ops: [op] });
    const queue = (await owner("GET", "/sync/rejections?status=open")).body;
    expect(queue).toHaveLength(1);
    expect(queue[0]).toMatchObject({ opId: bad, kind: "voucher.create", error: "validation", device: "Counter 2", deviceCode: "A1", status: "open" });
    expect((await owner("GET", "/sync/status")).body[0].openRejections).toBe(1);
  });

  it("settles a refusal with a note, and that is on the audit trail", async () => {
    const id = (await owner("GET", "/sync/rejections?status=open")).body[0].id;
    expect((await owner("POST", `/sync/rejections/${id}/resolve`, { note: "Re-entered by hand" })).status).toBe(200);
    expect((await owner("POST", `/sync/rejections/${id}/resolve`, {})).status).toBe(404);
    expect((await owner("GET", "/sync/rejections?status=open")).body).toEqual([]);
    expect((await owner("GET", "/sync/rejections?status=resolved")).body[0]).toMatchObject({ note: "Re-entered by hand" });
    expect((await owner("GET", "/sync/status")).body[0].openRejections).toBe(0);
    const trail = (await owner("GET", "/audit-log?limit=30")).body as { entity: string }[];
    expect(trail.some((a) => a.entity === "sync_rejection")).toBe(true);
  });

  it("a revoked device is shut out, and shows as revoked", async () => {
    expect((await owner("POST", `/devices/${deviceId}/revoke`, {})).body.error).toBe("step_up_required");
    await owner("POST", "/auth/step-up", { password: "correct horse battery" });
    expect((await owner("POST", `/devices/${deviceId}/revoke`, {})).status).toBe(200);
    expect((await app("POST", "/sync/push", { deviceId, ops: [] })).status).toBe(403);
    expect((await app("GET", `/sync/pull?deviceId=${deviceId}`)).status).toBe(403);
    expect((await owner("GET", "/sync/status")).body[0].revokedAt).toBeTruthy();
  });

  it("is private to the business", async () => {
    const other = (await t.signup("syncq-other")).cookie;
    expect((await t.call(other, "GET", "/sync/status")).body).toEqual([]);
    expect((await t.call(other, "GET", "/sync/rejections")).body).toEqual([]);
  });
});
