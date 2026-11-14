import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { HSN_STANDARD } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const list = async (qs = "") => (await t.call(c, "GET", `/hsn${qs}`)).body as { id: string; code: string; description: string; gstRate: string | null; archived: boolean; kind: string }[];

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("hsn")).cookie;
});
afterAll(() => t.close());

describe("HSN code master", () => {
  it("adds a code with a description and an optional rate, and refuses a malformed or repeated one", async () => {
    const r = await t.call(c, "POST", "/hsn", { code: "6205", description: "Men's shirts, woven", gstRate: "5" });
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({ code: "6205", gstRate: "5.00", kind: "goods" });
    id.shirts = r.body.id;
    expect((await t.call(c, "POST", "/hsn", { code: "6205", description: "Again" })).body.error).toBe("hsn_taken");
    expect((await t.call(c, "POST", "/hsn", { code: "62X5", description: "Bad" })).body.error).toBe("invalid_hsn");
  });

  it("adds the standard apparel codes without touching what is there, and can be run again safely", async () => {
    await t.call(c, "PATCH", `/hsn/${id.shirts}`, { code: "6205", description: "My own words", gstRate: "12" });
    const first = await t.call(c, "POST", "/hsn/seed-standard", {});
    expect(first.body).toEqual({ added: HSN_STANDARD.length - 1, total: HSN_STANDARD.length });
    expect((await list("?search=6205"))[0]).toMatchObject({ description: "My own words", gstRate: "12.00" });
    expect((await t.call(c, "POST", "/hsn/seed-standard", {})).body.added).toBe(0);
    expect((await list()).length).toBe(HSN_STANDARD.length);
  });

  it("searches by number or words, hides archived codes unless asked, and holds service codes", async () => {
    expect((await list("?search=footwear")).every((x) => /footwear/i.test(x.description))).toBe(true);
    expect((await list("?search=6403")).map((x) => x.code)).toEqual(["6403"]);
    await t.call(c, "PATCH", `/hsn/${id.shirts}`, { code: "6205", description: "My own words", archived: true });
    expect((await list()).some((x) => x.code === "6205")).toBe(false);
    expect((await list("?all=1")).some((x) => x.code === "6205" && x.archived)).toBe(true);
    expect((await list("?search=998821"))[0]).toMatchObject({ kind: "service" });
  });

  it("keeps businesses apart", async () => {
    const other = (await t.signup("hsn-other")).cookie;
    expect((await t.call(other, "GET", "/hsn")).body).toEqual([]);
    expect((await t.call(other, "PATCH", `/hsn/${id.shirts}`, { code: "6205", description: "Hijack" })).status).toBe(404);
  });
});
