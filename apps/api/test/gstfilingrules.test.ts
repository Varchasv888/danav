import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("gstrules", { gstin: "27AAPFU0939F1ZV" })).cookie as string;
});
afterAll(() => t.close());

describe("the three-year filing window", () => {
  it("shows the due date and the last day on GSTR-1 and GSTR-3B, and marks an old period as barred", async () => {
    const recent = await t.call(c, "GET", "/gst/gstr1?period=092026");
    expect(recent.status, JSON.stringify(recent.body)).toBe(200);
    expect(recent.body.timeBar).toEqual({ dueDate: "2026-10-11", lastDay: "2029-10-11", barred: false });
    const b3 = await t.call(c, "GET", "/gst/gstr3b?period=092026");
    expect(b3.body.timeBar).toEqual({ dueDate: "2026-10-20", lastDay: "2029-10-20", barred: false });
    const old = await t.call(c, "GET", "/gst/gstr3b?period=012020");
    expect(old.body.timeBar).toMatchObject({ dueDate: "2020-02-20", lastDay: "2023-02-20", barred: true });
  });

  it("refuses to upload or file a return for a period that is out of time", async () => {
    const up = await t.call(c, "POST", "/gst/filings/upload", { returnType: "GSTR3B", period: "012020" });
    expect(up.status).toBe(409);
    expect(up.body.error).toBe("return_time_barred");
    const wp = await t.call(c, "POST", "/gst/workpaper/status", { returnType: "GSTR1", period: "012020", to: "filed", arn: "AA270000000000A", filedOn: "2020-02-11" });
    expect(wp.status).toBe(409);
  });
});

describe("input credit on the GSTR-2B basis", () => {
  it("falls back to the books and says so when no statement has been imported", async () => {
    const r = await t.call(c, "GET", "/gst/gstr3b?period=092026&basis=2b");
    expect(r.status, JSON.stringify(r.body)).toBe(200);
    expect(r.body["4"]).toMatchObject({ itcBasis: "books", itcBasisNote: "no_2b_import", fromStatement: null });
    const books = await t.call(c, "GET", "/gst/gstr3b?period=092026");
    expect(books.body["4"]).toMatchObject({ itcBasis: "books", itcBasisNote: null });
  });
});
