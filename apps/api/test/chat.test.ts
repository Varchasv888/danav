import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let owner: string;
let meena: string;
let rahul: string;
const id: Record<string, string> = {};

const get = async (cookie: string, url: string) => (await t.call(cookie, "GET", url)).body;
const join = async (name: string, key: string) => {
  const roles = (await t.call(owner, "GET", "/roles")).body as { id: string; key: string }[];
  const email = `${name.toLowerCase()}-${t.run}@test.varchasv.in`;
  const inv = await t.call(owner, "POST", "/invitations", { email, roleId: roles.find((r) => r.key === key)!.id });
  const token = inv.body.inviteUrl.split("/invite/")[1];
  return (await t.call("", "POST", "/invitations/accept", { token, name, password: "ledger-balanced-1" })).cookie as string;
};

beforeAll(async () => {
  t = await testApp();
  owner = (await t.signup("chatowner")).cookie;
  meena = await join("Meena", "accountant");
  rahul = await join("Rahul", "accountant");
  id.owner = (await get(owner, "/auth/me")).user.id;
  id.meena = (await get(meena, "/auth/me")).user.id;
  id.rahul = (await get(rahul, "/auth/me")).user.id;
});
afterAll(() => t.close());

describe("chat between users of a business", () => {
  it("sends a message, counts it as unread for the other person, and marks it read when they open it", async () => {
    const sent = await t.call(owner, "POST", `/chat/${id.meena}`, { body: "  Please close the day book  " });
    expect(sent.status).toBe(201);
    expect(sent.body).toMatchObject({ mine: true, body: "Please close the day book" });
    expect(await get(meena, "/chat/unread")).toEqual({ unread: 1 });
    const people = await get(meena, "/chat/people");
    expect(people.find((p: { userId: string }) => p.userId === id.owner)).toMatchObject({ unread: 1 });
    const th = await get(meena, `/chat/${id.owner}`);
    expect(th).toHaveLength(1);
    expect(th[0]).toMatchObject({ mine: false, body: "Please close the day book" });
    expect(await get(meena, "/chat/unread")).toEqual({ unread: 0 });
  });

  it("keeps the thread in order, and a reply shows on both sides", async () => {
    await t.call(meena, "POST", `/chat/${id.owner}`, { body: "Done" });
    const th = await get(owner, `/chat/${id.meena}`);
    expect(th.map((m: { mine: boolean; body: string }) => [m.mine, m.body])).toEqual([[true, "Please close the day book"], [false, "Done"]]);
    const newer = await get(owner, `/chat/${id.meena}?after=${encodeURIComponent(th[0].at)}`);
    expect(newer.map((m: { body: string }) => m.body)).toEqual(["Done"]);
  });

  it("is private to the two people", async () => {
    expect(await get(rahul, `/chat/${id.meena}`)).toEqual([]);
    expect(await get(rahul, "/chat/unread")).toEqual({ unread: 0 });
  });

  it("refuses an empty message, a message to yourself, and someone outside the business", async () => {
    expect((await t.call(owner, "POST", `/chat/${id.meena}`, { body: "   " })).body.error).toBe("empty_message");
    expect((await t.call(owner, "POST", `/chat/${id.owner}`, { body: "hi" })).body.error).toBe("cannot_message_self");
    const other = (await t.signup("chatother")).cookie;
    const stranger = (await get(other, "/auth/me")).user.id;
    expect((await t.call(owner, "POST", `/chat/${stranger}`, { body: "hello" })).status).toBe(404);
    expect((await get(other, "/chat/people"))).toEqual([]);
  });
});
