import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { cleanPreferences, resolvePreferences } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("preferences")).cookie as string;
});
afterAll(() => t.close());

describe("preference registry", () => {
  it("keeps only known keys with valid values and fills defaults", () => {
    expect(cleanPreferences({ "print.paper": "A5", "print.showBank": false, "print.paper2": "x", "print.orientation": "diagonal", "print.showPan": "yes" })).toEqual({ "print.paper": "A5", "print.showBank": false });
    const all = resolvePreferences({ "print.accent": "teal" });
    expect(all["print.accent"]).toBe("teal");
    expect(all["print.paper"]).toBe("A4");
    expect(all["print.showWords"]).toBe(true);
  });
});

describe("preferences on the server", () => {
  it("starts with defaults, saves a change, and keeps the rest", async () => {
    const first = await t.call(c, "GET", "/settings/preferences");
    expect(first.status).toBe(200);
    expect(first.body).toMatchObject({ "print.paper": "A4", "print.showBank": true, "print.accent": "none" });
    const saved = await t.call(c, "PUT", "/settings/preferences", { "print.showBank": false, "print.accent": "navy" });
    expect(saved.status, JSON.stringify(saved.body)).toBe(200);
    expect(saved.body).toMatchObject({ "print.showBank": false, "print.accent": "navy", "print.paper": "A4" });
    const more = await t.call(c, "PUT", "/settings/preferences", { "print.paper": "A5" });
    expect(more.body).toMatchObject({ "print.showBank": false, "print.accent": "navy", "print.paper": "A5" });
    expect((await t.call(c, "GET", "/settings/preferences")).body).toMatchObject({ "print.paper": "A5", "print.showBank": false });
  });

  it("refuses an unknown key, an invalid value and an empty request", async () => {
    expect((await t.call(c, "PUT", "/settings/preferences", { "print.nothing": true })).body.error).toBe("invalid_preferences");
    expect((await t.call(c, "PUT", "/settings/preferences", { "print.paper": "A9" })).status).toBe(400);
    expect((await t.call(c, "PUT", "/settings/preferences", {})).status).toBe(400);
  });

  it("keeps one business's preferences from another", async () => {
    const other = (await t.signup("preferences-other")).cookie as string;
    expect((await t.call(other, "GET", "/settings/preferences")).body).toMatchObject({ "print.paper": "A4", "print.showBank": true });
  });
});
