import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("gstamend", { gstin: "27AAPFU0939F1ZV" })).cookie as string;
});
afterAll(() => t.close());

const line = { rate: "5", taxable: "10000.00", igst: "500.00" };
const b2b = {
  kind: "b2b", period: "102026", ctin: "29AAGCB7383J1Z4", originalNumber: "INV/26-27/00012", originalDate: "2026-08-14", number: "INV/26-27/00012", docDate: "2026-08-14",
  pos: "29", intra: false, lines: [line], reason: "Rate was entered wrong",
};

describe("GSTR-1 amendments", () => {
  it("records a correction of an earlier month's invoice and reports it in B2BA of the later return", async () => {
    const r = await t.call(c, "POST", "/gst/amendments", b2b);
    expect(r.status, JSON.stringify(r.body)).toBe(201);
    const g1 = await t.call(c, "GET", "/gst/gstr1?period=102026");
    expect(g1.status, JSON.stringify(g1.body)).toBe(200);
    expect(g1.body.summary.amendments).toBe(1);
    expect(g1.body.json.b2ba).toEqual([expect.objectContaining({ ctin: "29AAGCB7383J1Z4" })]);
    expect(g1.body.json.b2ba[0].inv[0]).toMatchObject({ oinum: "INV/26-27/00012", oidt: "14-08-2026", val: 10500 });
    // The earlier month's own return does not show it.
    expect((await t.call(c, "GET", "/gst/gstr1?period=092026")).body.json.b2ba).toBeUndefined();
  });

  it("refuses an invoice from the same month, tax that does not follow the rate, and a bad GSTIN", async () => {
    expect((await t.call(c, "POST", "/gst/amendments", { ...b2b, originalDate: "2026-10-02" })).body.error).toBe("original_not_earlier");
    expect((await t.call(c, "POST", "/gst/amendments", { ...b2b, lines: [{ ...line, igst: "900.00" }] })).body.error).toBe("tax_does_not_match_rate");
    expect((await t.call(c, "POST", "/gst/amendments", { ...b2b, ctin: "29AAGCB7383J1Z0" })).body.error).toBe("invalid_gstin");
  });

  it("lists and removes amendments", async () => {
    const list = (await t.call(c, "GET", "/gst/amendments?period=102026")).body as { id: string }[];
    expect(list).toHaveLength(1);
    expect((await t.call(c, "DELETE", `/gst/amendments/${list[0]!.id}`)).status).toBe(204);
    expect((await t.call(c, "GET", "/gst/amendments?period=102026")).body).toEqual([]);
  });
});

describe("GSTR-3B side by side", () => {
  it("keeps the portal and final figures apart from the workpaper and shows the differences", async () => {
    const empty = await t.call(c, "GET", "/gst/gstr3b/compare?period=092026");
    expect(empty.status, JSON.stringify(empty.body)).toBe(200);
    expect(empty.body.rows.every((r: { status: string }) => r.status === "waiting")).toBe(true);
    const put = await t.call(c, "PUT", "/gst/gstr3b/compare", { period: "092026", portal: { itcNet: { igst: "10.00" } }, final: { itcNet: { igst: "0.00" } } });
    expect(put.status, JSON.stringify(put.body)).toBe(200);
    const net = put.body.rows.find((r: { line: string }) => r.line === "itcNet");
    expect(net.status).toBe("differs");
    expect(net.heads.igst).toMatchObject({ erp: "0.00", portal: "10.00", diffPortal: "10.00", final: "0.00", diffFinal: "0.00" });
    // Recording these never touches the review status of the return.
    const wp = await t.call(c, "GET", "/gst/workpaper?returnType=GSTR3B&period=092026");
    expect(wp.body.status).toBe("prepared");
  });
});
