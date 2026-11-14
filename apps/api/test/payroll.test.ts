import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const put = (url: string, body: unknown) => t.call(c, "PUT", url, body);
const tb = async (key: string) => ((await get("/reports/trial-balance?asOf=2026-10-31")).rows as { accountId: string; dr: string; cr: string }[]).find((r) => r.accountId === id[key]) ?? { dr: "0.00", cr: "0.00" };

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("payroll", { gstin: "27AAPFU0939F1ZV" })).cookie;
});
afterAll(() => t.close());

describe("employees", () => {
  it("adds employees with their salary structure", async () => {
    const a = await post("/employees", {
      name: "Ravi Kulkarni", gender: "male", dob: "1990-05-10", joinedOn: "2026-04-01", workState: "27", pan: "abcpk1234f", uan: "100200300400",
      bankName: "HDFC Bank", bankIfsc: "hdfc0001234", bankAccount: "50100012345678", designation: "Accountant",
      components: [
        { code: "basic", name: "Basic", monthly: "15000", pfWage: true },
        { code: "HRA", name: "HRA", monthly: "7500", hra: true },
        { code: "SPECIAL", name: "Special allowance", monthly: "7500" },
      ],
    });
    expect(a.status).toBe(201);
    expect(a.body).toMatchObject({ code: "E0001", pan: "ABCPK1234F", bankAccountLast4: "5678" });
    id.ravi = a.body.id;
    id.meera = (await post("/employees", {
      name: "Meera Patil", gender: "female", joinedOn: "2026-09-10", workState: "27", esiNumber: "1234567890", paymentMode: "cash",
      components: [{ code: "BASIC", name: "Basic", monthly: "9000", pfWage: true }, { code: "HRA", name: "HRA", monthly: "3000", hra: true }, { code: "CONV", name: "Conveyance", monthly: "1600" }],
    })).body.id;
    id.arjun = (await post("/employees", {
      name: "Arjun Mehta", gender: "male", dob: "1985-01-20", joinedOn: "2026-09-01", workState: "27", taxRegime: "new",
      components: [{ code: "BASIC", name: "Basic", monthly: "100000", pfWage: true }, { code: "HRA", name: "HRA", monthly: "40000", hra: true }, { code: "SPECIAL", name: "Special", monthly: "60000" }],
    })).body.id;
    const list = await get("/employees");
    expect(list.map((e: { code: string; monthlyGross: string }) => `${e.code}:${e.monthlyGross}`)).toEqual(["E0001:30000.00", "E0002:13600.00", "E0003:200000.00"]);
    expect(list[0].bankAccountEnc).toBeUndefined();
  });

  it("checks PAN, IFSC and a basic component", async () => {
    const base = { name: "Bad Data", gender: "male", joinedOn: "2026-04-01", workState: "27" };
    expect((await post("/employees", { ...base, pan: "ABCDE12345" })).body.error).toBe("invalid_pan");
    expect((await post("/employees", { ...base, bankIfsc: "HDFC1234567" })).body.error).toBe("invalid_ifsc");
    expect((await post("/employees", { ...base, components: [{ code: "HRA", name: "HRA", monthly: "5000" }] })).body.error).toBe("basic_required");
    expect((await post("/employees", { ...base, code: "E0001" })).body.error).toBe("employee_code_taken");
  });
});

describe("leave and attendance", () => {
  it("counts only working days, keeps balances, and refuses overlaps", async () => {
    await post("/holidays", { date: "2026-09-16", name: "Ganesh Chaturthi" });
    const types: { id: string; code: string }[] = await get("/leave-types");
    for (const ty of types) id[ty.code] = ty.id;
    const cl = await post("/leave-requests", { employeeId: id.ravi, leaveTypeId: id.CL, fromDate: "2026-09-14", toDate: "2026-09-16", reason: "Family function" });
    expect(cl.body.days).toBe("2.0"); // the 16th is a holiday
    expect((await post("/leave-requests", { employeeId: id.ravi, leaveTypeId: id.SL, fromDate: "2026-09-15", toDate: "2026-09-15" })).body.error).toBe("leave_overlap");
    expect((await post(`/leave-requests/${cl.body.id}/approve`, {})).status).toBe(200);
    const lop = await post("/leave-requests", { employeeId: id.ravi, leaveTypeId: id.LOP, fromDate: "2026-09-21", toDate: "2026-09-21" });
    await post(`/leave-requests/${lop.body.id}/approve`, {});
    expect((await post("/leave-requests", { employeeId: id.ravi, leaveTypeId: id.EL, fromDate: "2026-10-01", toDate: "2026-10-31" })).body.error).toBe("insufficient_leave_balance");

    const bal = await get(`/employees/${id.ravi}/leave-balances?fy=2026-27`);
    expect(bal.types.find((x: { code: string }) => x.code === "CL")).toMatchObject({ quota: "12", taken: "2", balance: "10" });
    const meera = await get(`/employees/${id.meera}/leave-balances?fy=2026-27`);
    expect(meera.types.find((x: { code: string }) => x.code === "CL").quota).toBe("7"); // joined in September: 7 of 12 months
  });

  it("marks absences and half days; loss of pay adds unpaid leave and days before joining", async () => {
    await put("/attendance", { entries: [{ employeeId: id.ravi, date: "2026-09-22", status: "absent" }, { employeeId: id.ravi, date: "2026-09-23", status: "half_day" }] });
    expect((await put("/attendance", { entries: [{ employeeId: id.ravi, date: "2026-09-14", status: "absent" }] })).body.error).toBe("day_on_leave");
    expect((await put("/attendance", { entries: [{ employeeId: id.meera, date: "2026-09-05", status: "absent" }] })).body.error).toBe("not_employed_on_date");
    const month = await get("/attendance?period=2026-09");
    const lop = Object.fromEntries(month.employees.map((e: { code: string; lopDays: number }) => [e.code, e.lopDays]));
    expect(lop).toEqual({ E0001: 2.5, E0002: 9, E0003: 0 });
    expect(month.employees[0].days["2026-09-14"]).toMatchObject({ status: "leave", leave: "CL" });
  });
});

describe("payroll run", () => {
  let runId = "";

  it("builds September's payslips with PF, ESI, PT and TDS", async () => {
    const r = await post("/payroll-runs", { period: "2026-09" });
    expect(r.status).toBe(201);
    runId = r.body.id;
    const run = await get(`/payroll-runs/${runId}`);
    const slip = (code: string) => run.payslips.find((p: { code: string }) => p.code === code);
    // Ravi: 2.5 days' loss of pay; PF on basic (exactly half of gross).
    expect(slip("E0001")).toMatchObject({ paidDays: "27.5", gross: "27500.00", pfWages: "13750.00", pfEmployee: "1650.00", esiEmployee: "0.00", pt: "200.00", tds: "0.00", netPay: "25650.00" });
    // Meera: joined on the 10th, ESI-covered, no PT for a woman under ₹25,000 in Maharashtra.
    expect(slip("E0002")).toMatchObject({ paidDays: "21.0", gross: "9520.00", pfEmployee: "756.00", esiEmployee: "72.00", pt: "0.00", netPay: "8692.00" });
    // Arjun: ₹14 lakh projected, new regime → ₹81,900 for the year, spread over 7 months.
    expect(slip("E0003")).toMatchObject({ gross: "200000.00", pfEmployee: "1800.00", tds: "11700.00", netPay: "186300.00" });
    expect(run).toMatchObject({ status: "draft", gross: "237020.00", netPay: "220642.00", employerContributions: "4868.00" });
    // Ravi joined in April but payroll starts here in September: April–August are estimated for his tax.
    const raviTax = (await get(`/payslips/${slip("E0001").id}`)).detail.tax;
    expect(raviTax).toMatchObject({ estimatedMonths: 5, annualSalary: "357500.00" }); // 5 × 30,000 + 27,500 + 6 × 30,000
    expect((await post("/payroll-runs", { period: "2026-09" })).body.error).toBe("run_exists");
  });

  it("adjusts a draft payslip: an advance recovered", async () => {
    const run = await get(`/payroll-runs/${runId}`);
    const ravi = run.payslips.find((p: { code: string }) => p.code === "E0001");
    await t.call(c, "PATCH", `/payroll-runs/${runId}/payslips/${ravi.id}`, { otherDeductions: [{ name: "Salary advance", amount: "1000" }] });
    const after = await get(`/payroll-runs/${runId}`);
    expect(after.payslips.find((p: { code: string }) => p.code === "E0001").netPay).toBe("24650.00");
    expect(after.netPay).toBe("219642.00");
    // A refresh from attendance keeps the typed-in deduction.
    await post(`/payroll-runs/${runId}/refresh`, {});
    expect((await get(`/payroll-runs/${runId}`)).netPay).toBe("219642.00");
  });

  it("finalizes: posts salary and statutory dues, and locks the month's attendance", async () => {
    for (const a of await get("/accounts") as { id: string; key: string | null }[]) if (a.key) id[a.key] = a.id;
    const f = await post(`/payroll-runs/${runId}/finalize`, {});
    expect(f.body.status).toBe("finalized");
    expect((await tb("salaries")).dr).toBe("237020.00");
    expect((await tb("employer_contributions")).dr).toBe("4868.00");
    expect((await tb("salary_payable")).cr).toBe("219642.00");
    expect((await tb("pf_payable")).cr).toBe("8764.00");
    expect((await tb("esi_payable")).cr).toBe("382.00");
    expect((await tb("pt_payable")).cr).toBe("400.00");
    expect((await tb("tds_payable")).cr).toBe("11700.00");
    expect((await tb("salary_advances")).cr).toBe("1000.00");
    expect((await put("/attendance", { entries: [{ employeeId: id.ravi, date: "2026-09-24", status: "absent" }] })).body.error).toBe("payroll_finalized");
  });

  it("produces the EPF ECR, ESI and bank files", async () => {
    const ecr = await get(`/payroll-runs/${runId}/ecr`);
    expect(ecr.content).toBe("100200300400#~#RAVI KULKARNI#~#27500#~#13750#~#13750#~#13750#~#1650#~#1145#~#505#~#3#~#0");
    expect(ecr.missing).toEqual(["E0002", "E0003"]); // no UAN yet
    const esi = await get(`/payroll-runs/${runId}/esi`);
    expect(esi.content.split("\n")[1]).toBe("1234567890,Meera Patil,21,9520,0,");
    const bank = await get(`/payroll-runs/${runId}/bank`);
    expect(bank.content.split("\n")[1]).toBe("E0001,Ravi Kulkarni,50100012345678,HDFC0001234,HDFC Bank,24650.00,Salary September 2026");
    expect(bank.missing).toEqual(["E0003"]); // Meera is paid in cash
  });

  it("pays net salary and carries TDS into October", async () => {
    const paid = await post(`/payroll-runs/${runId}/pay`, { accountId: id.cash, date: "2026-09-30" });
    expect(paid.body.status).toBe("paid");
    expect(await tb("salary_payable")).toMatchObject({ dr: "0.00", cr: "0.00" }); // posted and paid
    const oct = await post("/payroll-runs", { period: "2026-10" });
    const arjun = (await get(`/payroll-runs/${oct.body.id}`)).payslips.find((p: { code: string }) => p.code === "E0003");
    expect(arjun.tds).toBe("11700.00"); // (81,900 − 11,700) ÷ 6
    expect((await post("/payroll-runs", { period: "2026-11" })).body.error).toBe("earlier_run_open");
    expect((await post(`/payroll-runs/${oct.body.id}/cancel`, { reason: "Redo after settlement" })).status).toBe(200);
  });
});

describe("full and final settlement", () => {
  it("pays leave encashment (no gratuity under five years) and prorates the last month", async () => {
    const preview = await get(`/employees/${id.ravi}/settlement?leftOn=2026-10-15`);
    expect(preview).toMatchObject({ wages: "15000.00", serviceYears: 1, gratuity: { eligible: false, amount: "0.00" }, leaveDays: "15", leaveEncashment: "7500.00" });
    const s = await post(`/employees/${id.ravi}/settle`, { leftOn: "2026-10-15", remarks: "Resigned" });
    expect(s.body).toMatchObject({ total: "7500.00", leaveEncashment: "7500.00" });
    expect((await tb("gratuity_leave")).dr).toBe("7500.00");
    expect((await post(`/employees/${id.ravi}/settle`, { leftOn: "2026-10-15" })).body.error).toBe("already_left");
    const oct = await post("/payroll-runs", { period: "2026-10" });
    const ravi = (await get(`/payroll-runs/${oct.body.id}`)).payslips.find((p: { code: string }) => p.code === "E0001");
    expect(ravi.paidDays).toBe("15.0");
  });
});
