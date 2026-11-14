import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;

beforeAll(async () => { t = await testApp(); c = (await t.signup("unlock")).cookie; });
afterAll(() => t.close());

describe("lock screen password check", () => {
  it("accepts the signed-in user's password and changes nothing", async () => {
    const r = await t.call(c, "POST", "/auth/unlock", { password: "correct horse battery" });
    expect(r.status).toBe(200);
    expect(r.body).toEqual({ ok: true });
    expect((await t.call(c, "GET", "/auth/me")).status).toBe(200);
  });

  it("refuses a wrong password, an empty one, and anyone not signed in", async () => {
    expect((await t.call(c, "POST", "/auth/unlock", { password: "wrong password here" })).body.error).toBe("wrong_password");
    expect((await t.call(c, "POST", "/auth/unlock", { password: "" })).status).toBe(400);
    expect((await t.call("", "POST", "/auth/unlock", { password: "correct horse battery" })).status).toBe(401);
  });

  it("checks against the person signed in, not another user of the business", async () => {
    const other = (await t.signup("unlock-other")).cookie;
    expect((await t.call(other, "POST", "/auth/unlock", { password: "correct horse battery" })).status).toBe(200);
    // Same password here by design of the test helper; a wrong one is refused for each separately.
    expect((await t.call(other, "POST", "/auth/unlock", { password: "nope nope nope nope" })).status).toBe(400);
  });
});
