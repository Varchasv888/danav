import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { OFFLINE_ACTIONS } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;

beforeAll(async () => { t = await testApp(); c = (await t.signup("offrules")).cookie; });
afterAll(() => t.close());

describe("offline rules per action", () => {
  it("declares every action the sync endpoint accepts as allowed, and nothing allowed that it does not accept", () => {
    const source = readFileSync(new URL("../src/routes/sync.ts", import.meta.url), "utf8");
    const accepted = [...source.matchAll(/kind: z\.literal\("([^"]+)"\)/g)].map((m) => m[1]!).sort();
    const allowed = Object.entries(OFFLINE_ACTIONS).filter(([, v]) => v.mode === "allowed").map(([k]) => k).sort();
    expect(accepted.length).toBeGreaterThan(5);
    expect(allowed).toEqual(accepted);
  });

  it("every action has a mode and a plain-language note", () => {
    for (const [action, v] of Object.entries(OFFLINE_ACTIONS)) {
      expect(["allowed", "read_only", "online_only"], action).toContain(v.mode);
      expect(v.note.length, action).toBeGreaterThan(10);
    }
  });

  it("is served to signed-in users and not to anonymous ones", async () => {
    const rules = (await t.call(c, "GET", "/sync/offline-rules")).body as { action: string; mode: string }[];
    expect(rules.find((r) => r.action === "pos.bill")?.mode).toBe("allowed");
    expect(rules.find((r) => r.action === "gst.einvoice")?.mode).toBe("online_only");
    expect((await t.call("", "GET", "/sync/offline-rules")).status).toBe(401);
  });
});
