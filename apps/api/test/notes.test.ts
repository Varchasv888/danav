import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let owner: string;
let colleague: string;
const id: Record<string, string> = {};

const notes = async (cookie: string, qs = "") => (await t.call(cookie, "GET", `/notes${qs}`)).body as { id: string; body: string; dueOn: string | null; doneAt: string | null }[];

beforeAll(async () => {
  t = await testApp();
  owner = (await t.signup("notes")).cookie;
  const roles = (await t.call(owner, "GET", "/roles")).body as { id: string; key: string }[];
  const inv = await t.call(owner, "POST", "/invitations", { email: `mate-${t.run}@test.varchasv.in`, roleId: roles.find((r) => r.key === "viewer")!.id });
  colleague = (await t.call("", "POST", "/invitations/accept", { token: inv.body.inviteUrl.split("/invite/")[1], name: "Colleague", password: "ledger-balanced-1" })).cookie;
});
afterAll(() => t.close());

describe("personal notes", () => {
  it("keeps notes with an optional date, dated ones first, and lets the person tick one off", async () => {
    await t.call(owner, "POST", "/notes", { body: "Call the transporter" });
    const dated = await t.call(owner, "POST", "/notes", { body: "Send GST papers to CA", dueOn: "2026-11-10" });
    expect(dated.status).toBe(201);
    id.gst = dated.body.id;
    expect((await notes(owner)).map((n) => n.body)).toEqual(["Send GST papers to CA", "Call the transporter"]);
    const done = await t.call(owner, "PATCH", `/notes/${id.gst}`, { done: true });
    expect(done.body.doneAt).not.toBeNull();
    expect((await notes(owner)).map((n) => n.body)).toEqual(["Call the transporter"]);
    expect((await notes(owner, "?done=1")).length).toBe(2);
    expect((await t.call(owner, "PATCH", `/notes/${id.gst}`, { done: false })).body.doneAt).toBeNull();
  });

  it("is private: a colleague in the same business sees none of it and cannot change it", async () => {
    expect(await notes(colleague)).toEqual([]);
    expect((await t.call(colleague, "PATCH", `/notes/${id.gst}`, { body: "Hijack" })).status).toBe(404);
    expect((await t.call(colleague, "DELETE", `/notes/${id.gst}`)).status).toBe(404);
    expect((await t.call(colleague, "POST", "/notes", { body: "Mine" })).status).toBe(201);
    expect((await notes(owner)).some((n) => n.body === "Mine")).toBe(false);
  });

  it("edits, deletes, and refuses an empty note", async () => {
    expect((await t.call(owner, "PATCH", `/notes/${id.gst}`, { body: "Send GST papers", dueOn: null })).body).toMatchObject({ body: "Send GST papers", dueOn: null });
    expect((await t.call(owner, "DELETE", `/notes/${id.gst}`)).status).toBe(200);
    expect((await t.call(owner, "POST", "/notes", { body: "   " })).status).toBe(400);
    expect((await t.call("", "GET", "/notes")).status).toBe(401);
  });
});
