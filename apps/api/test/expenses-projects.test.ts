import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const put = (url: string, body: unknown) => t.call(c, "PUT", url, body);
const tb = async (accountId: string) => ((await get("/reports/trial-balance?asOf=2027-03-31")).rows as { accountId: string; dr: string; cr: string }[]).find((r) => r.accountId === accountId) ?? { dr: "0.00", cr: "0.00" };
const keys = async () => { for (const a of await get("/accounts") as { id: string; key: string | null }[]) if (a.key) id[a.key] = a.id; };
// A 1×1 PNG, as a phone camera upload stands in.
const PNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("projects", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  const group = (k: string) => groups.find((g) => g.key === k)!.id;
  id.bank = (await post("/accounts", { name: "HDFC Current", groupId: group("bank_accounts"), openingBalance: "500000" })).body.id;
  id.client = (await post("/accounts", { name: "Nirmal Builders", groupId: group("sundry_debtors"), stateCode: "27", gstin: "27AAPFU0939F1ZV" })).body.id;
  // Meera: gross 41,600 a month → ₹200 an hour; Arjun has a set cost of ₹350 an hour.
  id.meera = (await post("/employees", {
    name: "Meera Patil", gender: "female", joinedOn: "2026-04-01", workState: "27",
    components: [{ code: "BASIC", name: "Basic", monthly: "20800", pfWage: true }, { code: "SPECIAL", name: "Special", monthly: "20800" }],
  })).body.id;
  id.arjun = (await post("/employees", { name: "Arjun Rao", gender: "male", joinedOn: "2026-04-01", workState: "27", costPerHour: "350" })).body.id;
  const setup = await get("/inventory/setup");
  id.consulting = (await post("/items", { name: "Consulting services", kind: "service", uomId: setup.uoms.find((u: { code: string }) => u.code === "OTH").id, gstRate: "18", hsn: "998311" })).body.id;
});
afterAll(() => t.close());

describe("expense claims", () => {
  it("claims a hotel with a GST invoice (credit taken) and a meal (blocked credit), then approves and pays", async () => {
    const cats: { id: string; name: string; blockedCredit: boolean }[] = await get("/expenses/categories");
    expect(cats.find((x) => x.name === "Meals & refreshments")!.blockedCredit).toBe(true);
    id.hotel = cats.find((x) => x.name === "Hotel stay")!.id;
    id.meals = cats.find((x) => x.name === "Meals & refreshments")!.id;
    const file = await post("/files", { name: "hotel.png", contentType: "image/png", base64: PNG });
    expect(file.status).toBe(201);
    expect((await post("/files", { name: "x.png", contentType: "image/png", base64: Buffer.from("not a png").toString("base64") })).body.error).toBe("file_type");
    expect((await post(`/files/${file.body.id}/read`, {})).body).toMatchObject({ reader: "demo", fields: null });
    const claim = await post("/expenses/claims", {
      employeeId: id.meera, date: "2026-10-10", title: "Client visit, Nashik", submit: true,
      lines: [
        { date: "2026-10-08", categoryId: id.hotel, amount: "5600", gstRate: "12", vendorName: "Hotel Panchavati", vendorGstin: "27AAPFU0939F1ZV", invoiceNo: "HP/1123", fileId: file.body.id },
        { date: "2026-10-08", categoryId: id.meals, amount: "840", gstRate: "5", vendorName: "Sadhana Restaurant", vendorGstin: "27AAPFU0939F1ZV", invoiceNo: "S-88" },
      ],
    });
    expect(claim.body).toMatchObject({ number: "EXP/26-27/00001", status: "submitted", total: "6440.00", itc: "600.00" }); // 5,600 = 5,000 + 12%
    id.claim = claim.body.id;
    await post(`/expenses/claims/${id.claim}/approve`, {});
    await keys();
    expect((await tb(id.lodging!)).dr).toBe("5000.00");
    expect((await tb(id.staff_welfare!)).dr).toBe("840.00");
    expect((await tb(id.input_cgst!)).dr).toBe("300.00");
    expect((await tb(id.reimbursements_payable!)).cr).toBe("6440.00");
    const pay = await post(`/expenses/claims/${id.claim}/pay`, { date: "2026-10-15", accountId: id.bank });
    expect(pay.body.number).toMatch(/^PAY\//);
    expect((await tb(id.reimbursements_payable!)).cr).toBe("0.00");
    expect((await post(`/expenses/claims/${id.claim}/cancel`, { reason: "Duplicate" })).body.error).toBe("claim_paid");
    const detail = await get(`/expenses/claims/${id.claim}`);
    expect(detail).toMatchObject({ status: "paid", voucher: "EXP/26-27/00001", lines: [expect.objectContaining({ taxable: "5000.00", cgst: "300.00", fileName: "hotel.png" }), expect.objectContaining({ taxable: "840.00", cgst: "0.00" })] });
  });

  it("enforces category limits and receipts, and rejection sends a claim back", async () => {
    await put(`/expenses/categories/${id.meals}`, { name: "Meals & refreshments", accountId: id.staff_welfare, blockedCredit: true, limitPerClaim: "1000", receiptRequiredAbove: "500" });
    const base = { employeeId: id.arjun, date: "2026-10-20", title: "Team lunch" };
    expect((await post("/expenses/claims", { ...base, lines: [{ date: "2026-10-20", categoryId: id.meals, amount: "600" }] })).body.error).toBe("receipt_required");
    expect((await post("/expenses/claims", { ...base, lines: [{ date: "2026-10-20", categoryId: id.meals, amount: "450" }, { date: "2026-10-21", categoryId: id.meals, amount: "450" }, { date: "2026-10-22", categoryId: id.meals, amount: "450" }] })).body.error).toBe("over_limit");
    const r = await post("/expenses/claims", { ...base, submit: true, lines: [{ date: "2026-10-20", categoryId: id.meals, amount: "450" }] });
    await post(`/expenses/claims/${r.body.id}/reject`, { reason: "Not a business meal" });
    expect((await get(`/expenses/claims/${r.body.id}`)).status).toBe("rejected");
    const again = await put(`/expenses/claims/${r.body.id}`, { ...base, title: "Client lunch", submit: true, lines: [{ date: "2026-10-20", categoryId: id.meals, amount: "450" }] });
    expect(again.body).toMatchObject({ status: "submitted", title: "Client lunch" });
    expect(await get("/expenses/totals")).toMatchObject({ submitted: { count: 1, total: "450.00" }, paid: { count: 1, total: "6440.00" } });
  });
});

describe("projects", () => {
  it("costs a time-and-material project from timesheets and a claim, and bills approved hours", async () => {
    const p = await post("/projects", {
      name: "Warehouse ERP rollout", customerId: id.client, billing: "time_material", billRate: "1500", budgetCost: "100000", budgetHours: "120", billingItemId: id.consulting,
    });
    expect(p.body).toMatchObject({ code: "PRJ-0001", status: "active" });
    id.project = p.body.id;
    await put(`/projects/${id.project}/members`, { employeeId: id.arjun, billRate: "2500" });
    id.task = (await post(`/projects/${id.project}/tasks`, { name: "Data migration", assigneeId: id.meera, estimatedHours: "40" })).body.id;
    const log = (employeeId: string, date: string, hours: string, extra: object = {}) => post("/timesheets", { projectId: id.project, employeeId, date, hours, ...extra });
    const m1 = await log(id.meera!, "2026-10-12", "8", { taskId: id.task });
    expect(m1.body).toMatchObject({ costRate: "200.00", billRate: "1500.00", billable: true });
    const m2 = await log(id.meera!, "2026-10-13", "6");
    const a1 = await log(id.arjun!, "2026-10-12", "4");
    expect(a1.body).toMatchObject({ costRate: "350.00", billRate: "2500.00" });
    const internal = await log(id.arjun!, "2026-10-14", "2", { billable: false, note: "Internal review" });
    expect((await log(id.meera!, "2026-10-12", "17")).body.error).toBe("too_many_hours");
    // Arjun's expense for the site visit is charged to the project.
    const cats: { id: string; name: string }[] = await get("/expenses/categories");
    const claim = await post("/expenses/claims", { employeeId: id.arjun, date: "2026-10-14", title: "Site visit cab", projectId: id.project, submit: true, lines: [{ date: "2026-10-14", categoryId: cats.find((x) => x.name === "Local conveyance")!.id, amount: "1200" }] });
    await post(`/expenses/claims/${claim.body.id}/approve`, {});
    expect((await post("/timesheets/decide", { ids: [m1.body.id, m2.body.id, a1.body.id, internal.body.id], decision: "approved" })).status).toBe(200);
    const bill = await post(`/projects/${id.project}/bill-time`, { date: "2026-10-31", upTo: "2026-10-31" });
    // Meera 14 h × 1,500 + Arjun 4 h × 2,500 = 31,000 + 18% GST
    expect(bill.body).toMatchObject({ total: "36580.00" });
    expect((await post(`/projects/${id.project}/bill-time`, { date: "2026-10-31" })).body.error).toBe("nothing_to_bill");
    const s = (await get(`/projects/${id.project}`)).summary;
    // Labour: 14 h × 200 + 6 h × 350 = 4,900; expenses 1,200
    expect(s).toMatchObject({ revenue: "31000.00", labour: "4900.00", expenses: "1200.00", purchases: "0.00", cost: "6100.00", margin: "24900.00", hours: "20.00", billableHours: "18.00", unbilled: "0.00", budgetUsedPct: "6.1" });
    const detail = await get(`/projects/${id.project}`);
    expect(detail.tasks[0]).toMatchObject({ name: "Data migration", logged: "8.00", assignee: "Meera Patil" });
    expect(detail.invoices).toHaveLength(1);
  });

  it("bills a fixed-price milestone, and cancelling the invoice frees it again", async () => {
    const p = (await post("/projects", { name: "Website redesign", customerId: id.client, billing: "fixed", contractValue: "200000", billingItemId: id.consulting })).body;
    const m = (await post(`/projects/${p.id}/milestones`, { name: "Design sign-off", amount: "80000", dueOn: "2026-11-15" })).body;
    const inv = await post(`/projects/${p.id}/milestones/${m.id}/bill`, { date: "2026-11-15" });
    expect(inv.body).toMatchObject({ total: "94400.00" });
    expect((await post(`/projects/${p.id}/milestones/${m.id}/bill`, { date: "2026-11-15" })).body.error).toBe("milestone_billed");
    const t1 = (await post("/timesheets", { projectId: p.id, employeeId: id.meera, date: "2026-11-02", hours: "5" })).body;
    expect(t1).toMatchObject({ billable: false, billRate: "0.00" }); // fixed price: time is cost only
    await post(`/sales-invoices/${inv.body.id}/cancel`, { reason: "Wrong GSTIN" });
    const d = await get(`/projects/${p.id}`);
    expect(d.milestones[0]).toMatchObject({ status: "pending", invoiceId: null });
    expect(d.summary).toMatchObject({ revenue: "0.00", labour: "1000.00" });
    expect((await post(`/projects/${p.id}/bill-time`, {})).body.error).toBe("not_time_and_material");
    await put(`/projects/${p.id}`, { name: "Website redesign", customerId: id.client, billing: "fixed", status: "on_hold" });
    expect((await post("/timesheets", { projectId: p.id, employeeId: id.meera, date: "2026-11-03", hours: "1" })).body.error).toBe("project_not_active");
    expect((await get("/projects")).map((x: { code: string }) => x.code)).toEqual(["PRJ-0002", "PRJ-0001"]);
  });
});
