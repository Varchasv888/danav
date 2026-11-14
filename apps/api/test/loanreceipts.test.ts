import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const loan = async () => ((await get(`/employees/${id.emp}/loans`)) as { id: string; recovered: string; status: string }[])[0]!;
const advancesBalance = async () => {
  const rows = (await get("/reports/trial-balance?asOf=2026-12-31")).rows as { accountId: string; dr: string; cr: string }[];
  const r = rows.find((x) => x.accountId === id.salary_advances);
  return Number(r?.dr ?? 0) - Number(r?.cr ?? 0);
};

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("loanrec", { gstin: "27AAPFU0939F1ZV" })).cookie;
  id.emp = (await post("/employees", {
    name: "Loan Taker", gender: "male", joinedOn: "2026-09-01", workState: "27",
    components: [{ code: "BASIC", name: "Basic", monthly: "20000", pfWage: true }],
  })).body.id;
  for (const a of await get("/accounts") as { id: string; key: string | null }[]) if (a.key) id[a.key] = a.id;
  await post(`/employees/${id.emp}/loans`, { kind: "loan", date: "2026-09-05", amount: "10000", instalment: "2000", accountId: id.cash });
});
afterAll(() => t.close());

describe("loan receipts", () => {
  it("takes part of a loan back in cash, clears it from advances, and closes the loan when all is back", async () => {
    expect(await advancesBalance()).toBe(10000);
    const l = await loan();
    const r1 = await post(`/loans/${l.id}/receipts`, { date: "2026-09-20", amount: "4000", accountId: id.cash });
    expect(r1.status).toBe(201);
    expect(r1.body).toMatchObject({ recovered: "4000.00", left: "6000.00" });
    expect(await advancesBalance()).toBe(6000);
    expect(await loan()).toMatchObject({ recovered: "4000.00", status: "active" });
    await post(`/loans/${l.id}/receipts`, { date: "2026-09-25", amount: "6000", accountId: id.cash });
    expect(await loan()).toMatchObject({ recovered: "10000.00", status: "closed" });
    expect(await advancesBalance()).toBe(0);
    expect(((await get(`/loans/${l.id}/receipts`)) as unknown[]).length).toBe(2);
  });

  it("refuses more than what is owed, a closed loan, and a date before the loan", async () => {
    const l = await loan();
    expect((await post(`/loans/${l.id}/receipts`, { date: "2026-09-26", amount: "1", accountId: id.cash })).body.error).toBe("loan_not_active");
    const r = await post(`/employees/${id.emp}/loans`, { kind: "advance", date: "2026-10-01", amount: "3000", instalment: "1000", accountId: id.cash });
    expect((await post(`/loans/${r.body.id}/receipts`, { date: "2026-10-02", amount: "3500", accountId: id.cash })).body.error).toBe("over_recovery");
    expect((await post(`/loans/${r.body.id}/receipts`, { date: "2026-09-01", amount: "100", accountId: id.cash })).body.error).toBe("receipt_before_loan");
    id.advance = r.body.id;
  });

  it("puts the money back on the loan when a receipt is cancelled", async () => {
    await post(`/loans/${id.advance}/receipts`, { date: "2026-10-05", amount: "1000", accountId: id.cash });
    const [rec] = (await get(`/loans/${id.advance}/receipts`)) as { id: string }[];
    expect((await post(`/loan-receipts/${rec!.id}/cancel`, { reason: "entered twice" })).status).toBe(200);
    const after = ((await get(`/employees/${id.emp}/loans`)) as { id: string; recovered: string }[]).find((x) => x.id === id.advance)!;
    expect(after.recovered).toBe("0.00");
    expect((await post(`/loan-receipts/${rec!.id}/cancel`, { reason: "again" })).status).toBe(409);
    expect(await advancesBalance()).toBe(3000);
  });
});
