import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (body: unknown) => t.call(c, "POST", "/gst-jv", body);
const position = async (cookie = c) => { const r = await t.call(cookie, "GET", "/gst-jv/position"); if (!Array.isArray(r.body)) throw new Error(JSON.stringify(r.body)); return Object.fromEntries((r.body as { head: string; credit: string; liability: string }[]).map((x) => [x.head, x])); };

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("gstjv")).cookie;
  for (const a of await get("/accounts") as { id: string; key: string | null }[]) if (a.key) id[a.key] = a.id;
});
afterAll(() => t.close());

describe("GST journal voucher", () => {
  it("raises liability and claims credit, and the position follows", async () => {
    expect((await post({ kind: "liability_add", date: "2026-09-30", amounts: { igst: "500", cgst: "100" }, counterAccountId: id.round_off })).status).toBe(201);
    expect((await post({ kind: "itc_claim", date: "2026-09-30", amounts: { igst: "300" }, counterAccountId: id.round_off })).status).toBe(201);
    const p = await position();
    expect(p.igst).toMatchObject({ liability: "500.00", credit: "300.00" });
    expect(p.cgst).toMatchObject({ liability: "100.00", credit: "0.00" });
  });

  it("pays liability out of credit and reverses credit", async () => {
    const v = (await post({ kind: "setoff", date: "2026-09-30", pairs: [{ liability: "igst", credit: "igst", amount: "200" }] })).body;
    expect(v.type).toBe("journal");
    expect(v.reference).toBe("GST JV");
    expect((await position()).igst).toMatchObject({ liability: "300.00", credit: "100.00" });
    await post({ kind: "itc_reverse", date: "2026-09-30", amounts: { igst: "40" }, counterAccountId: id.round_off });
    expect((await position()).igst.credit).toBe("60.00");
  });

  it("refuses a credit the law does not let pay that head, and incomplete entries", async () => {
    expect((await post({ kind: "setoff", date: "2026-09-30", pairs: [{ liability: "cgst", credit: "sgst", amount: "10" }] })).body.error).toBe("setoff_not_allowed");
    expect((await post({ kind: "setoff", date: "2026-09-30", pairs: [{ liability: "cess", credit: "igst", amount: "10" }] })).body.error).toBe("setoff_not_allowed");
    expect((await post({ kind: "itc_claim", date: "2026-09-30", amounts: { igst: "0" }, counterAccountId: id.round_off })).body.error).toBe("amount_required");
    expect((await post({ kind: "itc_claim", date: "2026-09-30", amounts: { igst: "5" } })).body.error).toBe("counter_account_required");
  });

  it("a retry with the same client id posts once, and businesses stay apart", async () => {
    const clientId = crypto.randomUUID();
    const a = await post({ kind: "liability_cut", date: "2026-09-30", amounts: { cgst: "10" }, counterAccountId: id.round_off, clientId });
    const b = await post({ kind: "liability_cut", date: "2026-09-30", amounts: { cgst: "10" }, counterAccountId: id.round_off, clientId });
    expect([a.status, b.status]).toEqual([201, 200]);
    expect((await position()).cgst.liability).toBe("90.00");
    const other = (await t.signup("gstjv-other")).cookie;
    expect((await position(other)).igst).toMatchObject({ liability: "0.00", credit: "0.00" });
  });
});
