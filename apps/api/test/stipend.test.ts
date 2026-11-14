import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const pay = (body: Record<string, unknown> = {}) => post(`/employees/${id.emp}/stipends`, { period: "2026-10", amount: "6000", date: "2026-10-31", accountId: id.cash, ...body });
const stipendBalance = async () => {
  const rows = (await get("/reports/trial-balance?asOf=2026-12-31")).rows as { accountId: string; dr: string; cr: string }[];
  const r = rows.find((x) => x.accountId === id.stipend);
  return Number(r?.dr ?? 0) - Number(r?.cr ?? 0);
};

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("stipend", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const made = await post("/employees", {
    name: "Trainee Tailor", gender: "male", joinedOn: "2026-09-01", workState: "27",
    components: [{ code: "BASIC", name: "Basic", monthly: "6000", pfWage: true }],
  });
  id.emp = made.body.id;
  // The Stipend ledger is made on first use, so the accounts list has it only after the first payment.
  for (const a of await get("/accounts") as { id: string; key: string | null }[]) if (a.key) id[a.key] = a.id;
});
afterAll(() => t.close());

describe("stipend", () => {
  it("pays a month's stipend: Dr Stipend, Cr cash", async () => {
    const r = await pay();
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({ status: "posted", period: "2026-10", amount: "6000.00" });
    id.pay = r.body.id;
    for (const a of await get("/accounts") as { id: string; key: string | null }[]) if (a.key) id[a.key] = a.id;
    expect(await stipendBalance()).toBe(6000);
  });

  it("allows one payment per employee per month, but another month is fine", async () => {
    expect((await pay()).body.error).toBe("stipend_already_paid");
    expect((await pay({ period: "2026-11", date: "2026-11-30" })).status).toBe(201);
    expect((await get("/stipends?period=2026-10")).map((s: { period: string }) => s.period)).toEqual(["2026-10"]);
    expect((await get("/stipends")).length).toBe(2);
  });

  it("refuses a bad amount or month", async () => {
    expect((await pay({ period: "2026-12", amount: "0" })).body.error).toBe("invalid_amount");
    expect((await pay({ period: "2026-13" })).status).toBe(400);
  });

  it("cancelling reverses it and frees the month", async () => {
    expect((await post(`/stipends/${id.pay}/cancel`, { reason: "Paid twice by mistake" })).status).toBe(200);
    expect(await stipendBalance()).toBe(6000); // only November is left
    expect((await post(`/stipends/${id.pay}/cancel`, { reason: "Again" })).body.error).toBe("already_cancelled");
    expect((await pay()).status).toBe(201);
  });

  it("keeps businesses apart", async () => {
    const other = (await t.signup("stipend-other")).cookie;
    expect((await t.call(other, "GET", "/stipends")).body).toEqual([]);
    expect((await t.call(other, "POST", `/stipends/${id.pay}/cancel`, { reason: "Not mine" })).status).toBe(404);
  });
});
