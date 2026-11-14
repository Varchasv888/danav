import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const report = async (asOf: string) => (await get(`/reports/msme?asOf=${asOf}`)) as { limitDays: number; totalOwed: string; totalPastLimit: string; rows: { name: string; msmeClass: string; underRule: boolean; total: string; pastLimit: string; bills: { ageDays: number; dueBy: string; pastLimit: boolean }[] }[] };

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("msme", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  const creditors = groups.find((g) => g.key === "sundry_creditors")!.id;
  const party = async (name: string, extra: Record<string, unknown> = {}) => (await post("/accounts", { name, groupId: creditors, stateCode: "27", ...extra })).body.id as string;
  id.micro = await party("Micro Mills", { msmeClass: "micro", udyamNumber: "UDYAM-MH-12-0001234" });
  id.medium = await party("Medium Mills", { msmeClass: "medium", udyamNumber: "UDYAM-MH-12-0005678" });
  id.plain = await party("Plain Traders");
  const setup = await get("/inventory/setup");
  id.item = (await post("/items", { name: "Cloth", hsn: "5208", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "MTR")?.id ?? setup.uoms[0].id, purchaseRate: "100" })).body.id;
  const bill = (supplierId: string, date: string, ref: string) => post("/purchase-bills", { supplierId, date, supplierInvoiceNo: ref, supplierInvoiceDate: date, lines: [{ itemId: id.item, qty: "10", rate: "100" }] });
  await bill(id.micro, "2026-08-01", "M-1");
  await bill(id.micro, "2026-10-15", "M-2");
  await bill(id.medium, "2026-08-01", "D-1");
  await bill(id.plain, "2026-08-01", "P-1");
});
afterAll(() => t.close());

describe("MSME payments report", () => {
  it("validates the Udyam number and class", async () => {
    const groups: { id: string; key: string }[] = await get("/accounts/groups");
    const creditors = groups.find((g) => g.key === "sundry_creditors")!.id;
    expect((await post("/accounts", { name: "Bad Udyam", groupId: creditors, stateCode: "27", udyamNumber: "12345" })).status).toBe(400);
    expect((await post("/accounts", { name: "Bad Class", groupId: creditors, stateCode: "27", msmeClass: "huge" })).status).toBe(400);
  });

  it("lists only MSME suppliers, and flags a bill older than 45 days", async () => {
    const r = await report("2026-11-03");
    expect(r.limitDays).toBe(45);
    expect(r.rows.map((x) => x.name).sort()).toEqual(["Medium Mills", "Micro Mills"]);
    const micro = r.rows.find((x) => x.name === "Micro Mills")!;
    expect(micro.bills).toHaveLength(2);
    const old = micro.bills.find((b) => b.ageDays > 45)!;
    expect(old).toMatchObject({ pastLimit: true, dueBy: "2026-09-15" });
    expect(micro.bills.find((b) => b.ageDays <= 45)!.pastLimit).toBe(false);
    expect(Number(micro.pastLimit)).toBeGreaterThan(0);
    expect(Number(micro.pastLimit)).toBeLessThan(Number(micro.total));
  });

  it("a medium enterprise is shown but not held to the 45 day rule", async () => {
    const medium = (await report("2026-11-03")).rows.find((x) => x.name === "Medium Mills")!;
    expect(medium).toMatchObject({ underRule: false, pastLimit: "0.00" });
    expect(medium.bills[0]!.pastLimit).toBe(false);
  });

  it("paying the old bill takes it off the past-limit figure", async () => {
    const groups = (await get("/accounts")) as { id: string; key: string | null }[];
    const cash = groups.find((a) => a.key === "cash")!.id;
    const before = Number((await report("2026-11-03")).totalPastLimit);
    await post("/vouchers", { type: "payment", date: "2026-11-01", lines: [{ accountId: id.micro, debit: "1050" }, { accountId: cash, credit: "1050" }] });
    expect(Number((await report("2026-11-03")).totalPastLimit)).toBeLessThan(before);
    expect(await get("/reports/msme?asOf=bad")).toMatchObject({ error: "validation" });
  });

  it("shows what to add back to profit for tax and the interest running on it, at three times the bank rate", async () => {
    const r = (await get("/reports/msme?asOf=2026-11-03&bankRate=10")) as { bankRatePct: number; disallowance: string; totalPastLimit: string; totalInterest: string; rows: { bills: { interest: string; ageDays: number; pastLimit: boolean; amount: string }[] }[] };
    expect(r.bankRatePct).toBe(10);
    expect(r.disallowance).toBe(r.totalPastLimit);
    const late = r.rows.flatMap((x) => x.bills).filter((b) => b.pastLimit);
    const expected = late.reduce((t, b) => t + (Number(b.amount) * 30 / 100 * (b.ageDays - 45)) / 365, 0);
    expect(Number(r.totalInterest)).toBeCloseTo(expected, 0);
    expect(Number(r.totalInterest)).toBeGreaterThanOrEqual(0);
  });

  it("keeps businesses apart", async () => {
    const other = (await t.signup("msme-other")).cookie;
    expect((await t.call(other, "GET", "/reports/msme?asOf=2026-11-03")).body.rows).toEqual([]);
  });
});
