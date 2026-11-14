import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const request = (body: Record<string, unknown>) => post(`/employees/${id.emp}/loan-requests`, { kind: "advance", amount: "5000", instalment: "1000", reason: "Medical", ...body });

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("loanreq", { gstin: "27AAPFU0939F1ZV" })).cookie;
  id.emp = (await post("/employees", {
    name: "Asks Advance", gender: "female", joinedOn: "2026-09-01", workState: "27",
    components: [{ code: "BASIC", name: "Basic", monthly: "20000", pfWage: true }],
  })).body.id;
  for (const a of await get("/accounts") as { id: string; key: string | null }[]) if (a.key) id[a.key] = a.id;
});
afterAll(() => t.close());

describe("advance and loan requests", () => {
  it("waits for a decision and pays nothing until approved", async () => {
    const r = await request({});
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({ status: "pending", amount: "5000.00", loanId: null });
    id.req = r.body.id;
    expect(await get(`/employees/${id.emp}/loans`)).toEqual([]);
    const list = await get("/loan-requests?status=pending");
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ employeeName: "Asks Advance", kind: "advance" });
  });

  it("refuses an instalment bigger than the amount and a request for nobody", async () => {
    expect((await request({ instalment: "6000" })).body.error).toBe("invalid_instalment");
    expect((await request({ amount: "0" })).body.error).toBe("invalid_amount");
    expect((await t.call(c, "POST", `/employees/${crypto.randomUUID()}/loan-requests`, { kind: "loan", amount: "100", instalment: "10" })).status).toBe(404);
  });

  it("approving needs payment details, then pays it out as an ordinary advance", async () => {
    expect((await post(`/loan-requests/${id.req}/decide`, { decision: "approve" })).body.error).toBe("payment_details_required");
    const ok = await post(`/loan-requests/${id.req}/decide`, { decision: "approve", date: "2026-10-05", accountId: id.cash, instalment: "2500" });
    expect(ok.status).toBe(200);
    expect(ok.body).toMatchObject({ status: "approved" });
    const loans = await get(`/employees/${id.emp}/loans`);
    expect(loans).toHaveLength(1);
    expect(loans[0]).toMatchObject({ id: ok.body.loanId, kind: "advance", amount: "5000.00", instalment: "2500.00", status: "active", remarks: "Medical" });
  });

  it("is decided once, and a rejection records why without paying", async () => {
    expect((await post(`/loan-requests/${id.req}/decide`, { decision: "reject" })).body.error).toBe("request_already_decided");
    const second = (await request({ kind: "loan", amount: "20000", instalment: "2000" })).body.id;
    const no = await post(`/loan-requests/${second}/decide`, { decision: "reject", note: "Too soon after the last one" });
    expect(no.body).toMatchObject({ status: "rejected", decisionNote: "Too soon after the last one", loanId: null });
    expect(await get(`/employees/${id.emp}/loans`)).toHaveLength(1);
    expect((await get("/loan-requests?status=pending"))).toEqual([]);
  });

  it("keeps businesses apart", async () => {
    const other = (await t.signup("loanreq-other")).cookie;
    expect((await t.call(other, "GET", "/loan-requests")).body).toEqual([]);
    expect((await t.call(other, "POST", `/loan-requests/${id.req}/decide`, { decision: "reject" })).status).toBe(404);
  });
});
