import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
let other: string;

const get = async (cookie: string, url: string) => (await t.call(cookie, "GET", url)).body;

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("lists")).cookie;
  other = (await t.signup("lists-other")).cookie;
});
afterAll(() => t.close());

describe("small masters (brand, fabric, season...)", () => {
  it("adds, edits, archives and counts entries per list", async () => {
    const a = await t.call(c, "POST", "/lookups/brandMaster", { name: "Raymond", code: "rym" });
    expect(a.status).toBe(201);
    expect(a.body.code).toBe("RYM");
    await t.call(c, "POST", "/lookups/brandMaster", { name: "Peter England" });
    await t.call(c, "POST", "/lookups/fabric", { name: "Cotton" });

    const dup = await t.call(c, "POST", "/lookups/brandMaster", { name: "raymond" });
    expect(dup.status).toBe(400);
    expect(dup.body.error).toBe("lookup_taken");
    // The same name in another list is fine.
    expect((await t.call(c, "POST", "/lookups/fabric", { name: "Raymond" })).status).toBe(201);

    const edited = await t.call(c, "PATCH", `/lookups/brandMaster/${a.body.id}`, { name: "Raymond Ltd", note: "Suiting" });
    expect(edited.body).toMatchObject({ name: "Raymond Ltd", note: "Suiting", code: "RYM" });
    await t.call(c, "PATCH", `/lookups/brandMaster/${a.body.id}`, { name: "Raymond Ltd", archived: true });

    expect((await get(c, "/lookups/brandMaster")).map((r: { name: string }) => r.name)).toEqual(["Peter England"]);
    expect(await get(c, "/lookups/brandMaster?all=1")).toHaveLength(2);
    expect(await get(c, "/lookups")).toMatchObject({ brandMaster: 1, fabric: 2 });
  });

  it("keeps dates only on dated lists and checks their order", async () => {
    const bad = await t.call(c, "POST", "/lookups/seasonMaster", { name: "Diwali 2026", startsOn: "2026-11-15", endsOn: "2026-10-01" });
    expect(bad.body.error).toBe("end_before_start");
    const ok = await t.call(c, "POST", "/lookups/seasonMaster", { name: "Diwali 2026", startsOn: "2026-10-01", endsOn: "2026-11-15" });
    expect(ok.body).toMatchObject({ startsOn: "2026-10-01", endsOn: "2026-11-15" });
    const plain = await t.call(c, "POST", "/lookups/season", { name: "Summer", startsOn: "2026-04-01" });
    expect(plain.body.startsOn).toBeNull();
  });

  it("rejects unknown lists and keeps each business's lists apart", async () => {
    expect((await t.call(c, "GET", "/lookups/salary")).status).toBe(400);
    expect(await get(other, "/lookups/brandMaster?all=1")).toEqual([]);
    const mine = (await get(c, "/lookups/fabric"))[0];
    expect((await t.call(other, "PATCH", `/lookups/fabric/${mine.id}`, { name: "Hijacked" })).status).toBe(404);
  });

  it("keeps staff lists under the HR module", async () => {
    expect((await t.call(c, "POST", "/lookups/designation", { name: "Cutting Master" })).status).toBe(201);
    expect((await t.call(c, "POST", "/lookups/employeeDepartment", { name: "Stitching" })).status).toBe(201);
    expect(await get(c, "/lookups")).toMatchObject({ designation: 1, employeeDepartment: 1 });
  });
});
