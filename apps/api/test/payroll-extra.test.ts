import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const put = (url: string, body: unknown) => t.call(c, "PUT", url, body);
const patch = (url: string, body: unknown) => t.call(c, "PATCH", url, body);
const slipOf = async (runId: string, code: string) => (await get(`/payroll-runs/${runId}`)).payslips.find((p: { code: string }) => p.code === code);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("payroll2", { gstin: "27AAPFU0939F1ZV" })).cookie;
  for (const a of await get("/accounts") as { id: string; key: string | null }[]) if (a.key) id[a.key] = a.id;
  id.ravi = (await post("/employees", {
    name: "Ravi Kulkarni", gender: "male", joinedOn: "2026-09-01", workState: "27", email: "ravi@example.test", pan: "ABCPK1234F", uan: "100200300400",
    components: [{ code: "BASIC", name: "Basic", monthly: "15000", pfWage: true }, { code: "HRA", name: "HRA", monthly: "7500", hra: true }, { code: "SPECIAL", name: "Special", monthly: "7500" }],
  })).body.id;
  id.arjun = (await post("/employees", {
    name: "Arjun Mehta", gender: "male", joinedOn: "2026-09-01", workState: "27", pan: "AMZPM4321Q",
    components: [{ code: "BASIC", name: "Basic", monthly: "100000", pfWage: true }, { code: "HRA", name: "HRA", monthly: "40000", hra: true }, { code: "SPECIAL", name: "Special", monthly: "60000" }],
  })).body.id;
  for (const a of await get("/accounts") as { id: string; key: string | null }[]) if (a.key) id[a.key] = a.id; // payroll ledgers now exist
  await put("/payroll/settings", { tan: "MUMA12345B" });
});
afterAll(() => t.close());

describe("shifts and biometric punches", () => {
  it("reads punches against the shift: full day, late half day, absent", async () => {
    expect((await post("/shifts", { name: "Day", startTime: "09:00", endTime: "18:00", graceMinutes: 10, fullDayMinutes: 480, halfDayMinutes: 240, isDefault: true })).status).toBe(201);
    const rows = [
      { code: "E0001", date: "2026-09-01", in: "09:05", out: "18:10" },
      { code: "e0001", date: "2026-09-02", in: "09:30", out: "14:00" },
      { code: "E0001", date: "2026-09-03", in: "10:00", out: "12:00" },
      { code: "E9999", date: "2026-09-03", in: "09:00", out: "18:00" },
      { code: "E0002", date: "2026-09-03", in: "9am", out: "18:00" },
    ];
    const dry = await post("/attendance/import", { rows, dryRun: true });
    expect(dry.body.results.map((r: { status?: string; late?: boolean; error?: string }) => r.error ?? `${r.status}${r.late ? "+late" : ""}`))
      .toEqual(["present", "half_day+late", "absent+late", "unknown_employee", "invalid_time"]);
    expect(dry.body.imported).toBe(0);
    expect((await post("/attendance/import", { rows, dryRun: false })).body.imported).toBe(3);
    const month = await get("/attendance?period=2026-09");
    const ravi = month.employees.find((e: { code: string }) => e.code === "E0001");
    expect(ravi).toMatchObject({ lopDays: 1.5, lateDays: 2 });
    expect(ravi.days["2026-09-01"]).toMatchObject({ status: "present", in: "09:05", out: "18:10", late: false });
  });
});

describe("advances, overtime and arrears", () => {
  let sep = "";
  let loanId = "";

  it("pays an advance out of cash and recovers it in instalments", async () => {
    const loan = await post(`/employees/${id.ravi}/loans`, { kind: "advance", date: "2026-09-05", amount: "6000", instalment: "2000", accountId: id.cash });
    expect(loan.status).toBe(201);
    loanId = loan.body.id;
    expect((await post(`/employees/${id.ravi}/loans`, { kind: "advance", date: "2026-09-05", amount: "1000", instalment: "2000", accountId: id.cash })).body.error).toBe("invalid_instalment");
    sep = (await post("/payroll-runs", { period: "2026-09" })).body.id;
    const r = await slipOf(sep, "E0001");
    expect(r.loanRecoveries).toEqual([{ loanId, name: "Advance recovery", amount: "2000.00" }]);
    expect(r.netPay).toBe("24590.00"); // 28,500 − 1,710 PF (12% of 14,250 basic) − 200 PT − 2,000 advance
  });

  it("adds overtime, and can skip an instalment for a month", async () => {
    const r = await slipOf(sep, "E0001");
    await patch(`/payroll-runs/${sep}/payslips/${r.id}`, { extraEarnings: [{ code: "OT", name: "Overtime", amount: "1500" }], loanRecoveries: [{ loanId, amount: "0" }] });
    const skipped = await slipOf(sep, "E0001");
    // 28.5 paid days: 14,250 + 7,125 + 7,125 + 1,500 overtime = 30,000; PF on half of gross (15,000).
    expect(skipped).toMatchObject({ gross: "30000.00", pfWages: "15000.00", pfEmployee: "1800.00", pt: "200.00", netPay: "28000.00" });
    expect(skipped.loanRecoveries).toEqual([{ loanId, name: "Advance recovery", amount: "0.00", overridden: true }]);
    await patch(`/payroll-runs/${sep}/payslips/${r.id}`, { loanRecoveries: [{ loanId, amount: null }] });
    expect((await slipOf(sep, "E0001")).netPay).toBe("26000.00");
    expect((await patch(`/payroll-runs/${sep}/payslips/${r.id}`, { extraEarnings: [{ code: "ARREARS", name: "Fake", amount: "1" }] })).body.error).toBe("reserved_code");
  });

  it("finalizing records the instalment on the advance", async () => {
    await post(`/payroll-runs/${sep}/finalize`, {});
    const loans = await get(`/employees/${id.ravi}/loans`);
    expect(loans[0]).toMatchObject({ recovered: "2000.00", status: "active" });
    expect((await post(`/loans/${loanId}/cancel`, { reason: "Mistake" })).body.error).toBe("loan_partly_recovered");
  });

  it("pays arrears once when a raise is back-dated into a paid month", async () => {
    await post(`/employees/${id.ravi}/salary`, {
      effectiveFrom: "2026-09-01", components: [{ code: "BASIC", name: "Basic", monthly: "18000", pfWage: true }, { code: "HRA", name: "HRA", monthly: "9000", hra: true }, { code: "SPECIAL", name: "Special", monthly: "9000" }],
    });
    const oct = (await post("/payroll-runs", { period: "2026-10" })).body.id;
    const r = await get(`/payslips/${(await slipOf(oct, "E0001")).id}`);
    // September had 28.5 paid days: 6,000 × 28.5 / 30 = 5,700, of which 2,850 is basic.
    expect(r.detail.earnings.filter((e: { extra: boolean }) => e.extra).map((e: { code: string; earned: string }) => `${e.code}:${e.earned}`)).toEqual(["ARREARS_PF:2850.00", "ARREARS:2850.00"]);
    expect(r.gross).toBe("41700.00");
    await post(`/payroll-runs/${oct}/finalize`, {});
    const nov = (await post("/payroll-runs", { period: "2026-11" })).body.id;
    const n = await slipOf(nov, "E0001");
    expect(n.gross).toBe("36000.00"); // already settled: no arrears again
    expect((await get(`/employees/${id.ravi}/loans`))[0].recovered).toBe("4000.00");
    await post(`/payroll-runs/${nov}/cancel`, { reason: "Not needed yet" });
  });
});

describe("statutory payments and returns", () => {
  it("shows the month's dues and clears them with challans", async () => {
    const dues = await get("/statutory/dues?fy=2026-27");
    const sep = (kind: string) => dues.rows.find((r: { period: string; kind: string }) => r.period === "2026-09" && r.kind === kind);
    expect(sep("pf")).toMatchObject({ due: "7500.00", paid: "0.00", dueDate: "2026-10-15" }); // 3,750 each
    expect(sep("tds")).toMatchObject({ due: "11700.00", dueDate: "2026-10-07" });
    expect((await post("/statutory/payments", { kind: "tds", period: "2026-09", amount: "11700", paidOn: "2026-10-06", accountId: id.cash })).body.error).toBe("challan_details_required");
    await post("/statutory/payments", { kind: "pf", period: "2026-09", amount: "7500", paidOn: "2026-10-10", accountId: id.cash, reference: "TRRN1234567890" });
    await post("/statutory/payments", { kind: "tds", period: "2026-09", amount: "11700", paidOn: "2026-10-06", accountId: id.cash, bsrCode: "0510032", challanSerial: "00045" });
    const after = await get("/statutory/dues?fy=2026-27");
    expect(after.rows.filter((r: { period: string }) => r.period === "2026-09").map((r: { kind: string; balance: string }) => `${r.kind}:${r.balance}`)).toEqual(["pf:0.00", "pt:400.00", "tds:0.00"]);
  });

  it("builds Form 24Q for the quarter and Form 16 Part B", async () => {
    const q2 = await get("/tds/24q?fy=2026-27&quarter=2");
    expect(q2).toMatchObject({ tan: "MUMA12345B", warnings: [] });
    expect(q2.deductees).toEqual([expect.objectContaining({ employeeCode: "E0002", pan: "AMZPM4321Q", section: "192", period: "2026-09", amountPaid: "200000.00", tds: "11700.00", bsrCode: "0510032", challanSerial: "00045" })]);
    expect(q2.files.annexureI.content.split("\n")[1]).toContain("E0002,Arjun Mehta,AMZPM4321Q,192,2026-09");
    const f16 = await get(`/employees/${id.arjun}/form16?fy=2026-27`);
    expect(f16).toMatchObject({ assessmentYear: "2027-28", months: 2, gross: "400000.00", employer: { tan: "MUMA12345B" } });
    expect(f16.quarters[1]).toMatchObject({ quarter: 2, tds: "11700.00", challans: [expect.objectContaining({ bsrCode: "0510032" })] });
  });

  it("exports the salary register and emails payslips", async () => {
    const runs = await get("/payroll-runs");
    const sep = runs.find((r: { period: string }) => r.period === "2026-09").id;
    const reg = await get(`/payroll-runs/${sep}/register`);
    const [header, ravi] = reg.content.split("\n");
    expect(header).toContain("Overtime");
    expect(ravi).toContain("E0001,Ravi Kulkarni");
    expect(ravi).toContain("1500.00");
    const mail = await post(`/payroll-runs/${sep}/email`, {});
    expect(mail.body).toEqual({ sent: 1, skipped: ["E0002"] });
    const last = t.mailer.sent.at(-1)!;
    expect(last.to).toBe("ravi@example.test");
    expect(last.text).toContain("Net pay: ₹26,000.00");
  });
});
