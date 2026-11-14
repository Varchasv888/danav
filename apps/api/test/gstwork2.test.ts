import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { SIMULATOR_OTP } from "../src/integrations/gsp.js";
import { parse2A } from "../src/services/gstwork.js";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
let approver: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown, cookie = c) => t.call(cookie, "POST", url, body);
const bill = (supplier: string, no: string, date: string, rate: string) => post("/purchase-bills", { supplierId: supplier, date, supplierInvoiceNo: no, supplierInvoiceDate: date, lines: [{ itemId: id.cloth, qty: "10", rate }] });

const stmt2a = (period: string, suppliers: { ctin: string; filed3b: string; inv: { no: string; dt: string; txval: number; igst: number }[] }[]) => ({
  gstin: "27AAPFU0939F1ZV", fp: period,
  b2b: suppliers.map((s) => ({ ctin: s.ctin, trdnm: s.ctin, cfs: "Y", cfs3b: s.filed3b, inv: s.inv.map((d) => ({ inum: d.no, idt: d.dt, val: d.txval + d.igst, itms: [{ num: 1, itm_det: { rt: 5, txval: d.txval, iamt: d.igst, camt: 0, samt: 0, csamt: 0 } }] })) })),
});

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("gstwork2", { gstin: "27AAPFU0939F1ZV", booksFrom: "2025-04-01" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  const g = (k: string) => groups.find((x) => x.key === k)!.id;
  id.a = (await post("/accounts", { name: "Filing Supplier", groupId: g("sundry_creditors"), gstin: "29AAGCB7383J1Z4", stateCode: "29" })).body.id;
  id.b = (await post("/accounts", { name: "Defaulting Supplier", groupId: g("sundry_creditors"), gstin: "24AAACC1206D1ZM", stateCode: "24" })).body.id;
  id.c = (await post("/accounts", { name: "Silent Supplier", groupId: g("sundry_creditors"), gstin: "07AAACR5055K1Z9", stateCode: "07" })).body.id;
  id.walkin = (await post("/accounts", { name: "Local Customer", groupId: g("sundry_debtors"), stateCode: "27" })).body.id;
  id.loss = (await post("/accounts", { name: "ITC Reversed", groupId: g("indirect_expenses") })).body.id;
  const setup = await get("/inventory/setup");
  id.cloth = (await post("/items", { name: "Poplin", hsn: "5208", gstRate: "5", uomId: setup.uoms[0].id, saleRate: "300" })).body.id;
  const roles = (await t.call(c, "GET", "/roles")).body as { id: string; key: string }[];
  const inv = await t.call(c, "POST", "/invitations", { email: `approver-${t.run}@test.varchasv.in`, roleId: roles.find((r) => r.key === "accountant")!.id });
  const accepted = await t.call("", "POST", "/invitations/accept", { token: inv.body.inviteUrl.split("/invite/")[1], name: "GST Approver", password: "ledger-balanced-1" });
  approver = accepted.cookie as string;
});
afterAll(() => t.close());

describe("reading a GSTR-2A", () => {
  it("sums the items and keeps whether the supplier has filed GSTR-1 and GSTR-3B", () => {
    const p = parse2A(stmt2a("102026", [{ ctin: "29AAGCB7383J1Z4", filed3b: "N", inv: [{ no: "A/1", dt: "05-10-2026", txval: 10000, igst: 500 }] }]));
    expect(p.period).toBe("102026");
    expect(p.docs[0]).toMatchObject({ docNo: "A/1", docDate: "2026-10-05", taxable: "10000.00", igst: "500.00", filed1: true, filed3b: false });
  });
});

describe("GSTR-2A beside the books and 2B", () => {
  it("matches 2A to bills, and shows what 2B lacks and which suppliers have not filed", async () => {
    expect((await bill(id.a, "FS/1", "2026-10-05", "1000")).status).toBe(201);
    expect((await bill(id.b, "DS/1", "2026-10-06", "2000")).status).toBe(201);
    const r2a = await post("/gst/work/2a", { json: stmt2a("102026", [
      { ctin: "29AAGCB7383J1Z4", filed3b: "Y", inv: [{ no: "FS/1", dt: "05-10-2026", txval: 10000, igst: 500 }] },
      { ctin: "24AAACC1206D1ZM", filed3b: "N", inv: [{ no: "DS/1", dt: "06-10-2026", txval: 20000, igst: 1000 }] },
    ]) });
    expect(r2a.status).toBe(201);
    expect(r2a.body).toMatchObject({ matched: 2, amountDiff: 0, unmatched: 0 });
    // 2B shows only the first supplier's bill.
    await post("/gst/work/2b", { json: { data: { gstin: "27AAPFU0939F1ZV", rtnprd: "102026", docdata: { b2b: [{ ctin: "29AAGCB7383J1Z4", inv: [{ inum: "FS/1", dt: "05-10-2026", val: 10500, txval: 10000, igst: 500, itcavl: "Y" }] }] } } } });
    const cmp = await get("/gst/work/2a/102026/vs-2b");
    expect(cmp.totals).toMatchObject({ in2A: 2, in2B: 1, onlyIn2A: 1, onlyIn2B: 0, amountDiff: 0, suppliersNotFiled3b: 1 });
    expect(cmp.onlyIn2A[0]).toMatchObject({ docNo: "DS/1", tax: "1000.00" });
    expect(cmp.suppliersNotFiled3b[0]).toMatchObject({ ctin: "24AAACC1206D1ZM", docs: 1, tax: "1000.00" });
    // 2A and 2B are kept side by side for the same month.
    expect(await get("/gst/work/2a")).toHaveLength(1);
    expect(await get("/gst/work/2b")).toHaveLength(1);
    expect((await t.call(c, "GET", "/gst/work/2a/092026/vs-2b")).status).toBe(404);
  });
});

describe("Rule 37A", () => {
  it("lists bills whose supplier has not paid the tax, reverses the credit once, and claims it again", async () => {
    // Bills of FY 2025-26: one supplier filed, one did not, one never shows in 2A.
    expect((await bill(id.a, "FS/2", "2026-02-10", "1000")).status).toBe(201);
    expect((await bill(id.b, "DS/2", "2026-02-11", "1000")).status).toBe(201);
    expect((await bill(id.c, "SS/2", "2026-02-12", "1000")).status).toBe(201);
    await post("/gst/work/2a", { json: stmt2a("022026", [
      { ctin: "29AAGCB7383J1Z4", filed3b: "Y", inv: [{ no: "FS/2", dt: "10-02-2026", txval: 10000, igst: 500 }] },
      { ctin: "24AAACC1206D1ZM", filed3b: "N", inv: [{ no: "DS/2", dt: "11-02-2026", txval: 10000, igst: 500 }] },
    ]) });
    const r = await get("/gst/work/rule37a?fy=2025");
    expect(r).toMatchObject({ fy: "2025-26", cutoff: "2026-09-30", due: true });
    const byNo = Object.fromEntries(r.items.map((i: { invoiceNo: string }) => [i.invoiceNo, i]));
    expect(byNo["FS/2"]).toBeUndefined();
    expect(byNo["DS/2"]).toMatchObject({ supplierStatus: "not_filed", tax: "500.00" });
    expect(byNo["SS/2"]).toMatchObject({ supplierStatus: "not_in_2a", tax: "500.00" });
    expect(r.totals.atRisk).toBe("1000.00");

    const rev = await post("/gst/work/itc-reversals", { rule: "37A", billId: byNo["DS/2"].billId, date: "2026-10-01", counterAccountId: id.loss });
    expect(rev.status).toBe(201);
    expect((await post("/gst/work/itc-reversals", { rule: "37A", billId: byNo["DS/2"].billId, date: "2026-10-01", counterAccountId: id.loss })).body.error).toBe("already_reversed");
    const after = await get("/gst/work/rule37a?fy=2025");
    expect(after.items.find((i: { invoiceNo: string }) => i.invoiceNo === "DS/2").reversed).toMatchObject({ on: "2026-10-01", reclaimedOn: null });
    expect(after.totals).toMatchObject({ atRisk: "500.00", reversed: "500.00" });

    expect((await post(`/gst/work/itc-reversals/${rev.body.id}/reclaim`, { date: "2026-12-01", counterAccountId: id.loss })).status).toBe(200);
    expect((await post(`/gst/work/itc-reversals/${rev.body.id}/reclaim`, { date: "2026-12-01", counterAccountId: id.loss })).body.error).toBe("already_reclaimed");
    expect((await get("/gst/work/itc-reversals"))[0]).toMatchObject({ billNumber: expect.any(String), reclaimedOn: "2026-12-01" });
    expect((await get("/gst/work/rule37a?fy=2025")).totals.reversed).toBe("0.00");
  });

  it("is only a watch list before the cut-off date", async () => {
    const early = await get("/gst/work/rule37a?fy=2026");
    expect(early.due).toBe(false);
  });
});

describe("GSTR-9C working and the composition summary", () => {
  it("sets books turnover against the tax documents, and works out tax at the composition rate", async () => {
    expect((await post("/sales-invoices", { customerId: id.walkin, date: "2025-08-10", lines: [{ itemId: id.cloth, qty: "10", rate: "1000" }] })).status).toBe(201);
    const w = await get("/gst/work/gstr9c?fy=2025");
    expect(w.fy).toBe("2025-26");
    const turnover = w.rows.find((r: { key: string }) => r.key === "turnover");
    expect(turnover).toMatchObject({ books: "10000.00", returns: "10000.00", difference: "0.00", ok: true });
    expect(w.rows.find((r: { key: string }) => r.key === "outputTax")).toMatchObject({ books: "500.00", returns: "500.00", ok: true });
    // The earlier purchases are credit in the books and on the bills alike.
    expect(w.rows.find((r: { key: string }) => r.key === "inputCredit").ok).toBe(true);

    const f = await get("/gst/work/gstr4?fy=2025&rate=1");
    expect(f.quarters[1]).toMatchObject({ quarter: 2, turnover: "10000.00", tax: "100.00" });
    expect(f.totals).toMatchObject({ turnover: "10000.00", tax: "100.00" });
    expect(f.inward.find((x: { kind: string }) => x.kind === "registered").bills).toBeGreaterThan(0);
    expect((await t.call(c, "GET", "/gst/work/gstr4?fy=2025&rate=9")).status).toBe(400);
  });
});

describe("approval before a return is uploaded", () => {
  it("lets the switch be turned on, needs a second person to approve, and asks again when the books change", async () => {
    const gstr1 = { returnType: "GSTR1", period: "092026" };
    await post("/gst/portal/otp", { username: "seller.gst" });
    await post("/gst/portal/connect", { username: "seller.gst", otp: SIMULATOR_OTP });
    expect((await t.call(c, "PUT", "/gst/work/settings", { approvalRequired: true })).status).toBe(200);
    expect((await get("/gst/work/settings")).approvalRequired).toBe(true);

    expect((await post("/gst/filings/upload", gstr1)).body.error).toBe("approval_required");
    const req = await post("/gst/work/approvals", gstr1);
    expect(req.status).toBe(201);
    expect((await post(`/gst/work/approvals/${req.body.id}/decide`, { decision: "approve" })).body.error).toBe("cannot_approve_own_return");
    expect((await post("/gst/filings/upload", gstr1)).body.error).toBe("approval_required");

    expect((await post(`/gst/work/approvals/${req.body.id}/decide`, { decision: "approve" }, approver)).status).toBe(200);
    expect((await post(`/gst/work/approvals/${req.body.id}/decide`, { decision: "approve" }, approver)).body.error).toBe("already_decided");
    expect((await post("/gst/filings/upload", gstr1)).body).toMatchObject({ status: "uploaded" });

    // A change after the sign-off needs a new one.
    expect((await post("/sales-invoices", { customerId: id.walkin, date: "2026-09-20", lines: [{ itemId: id.cloth, qty: "1", rate: "100" }] })).status).toBe(201);
    expect((await post("/gst/filings/upload", gstr1)).body.error).toBe("books_changed_since_approval");
    const again = await post("/gst/work/approvals", gstr1);
    expect((await post(`/gst/work/approvals/${again.body.id}/decide`, { decision: "reject", note: "" }, approver)).body.error).toBe("note_required");
    expect((await post(`/gst/work/approvals/${again.body.id}/decide`, { decision: "reject", note: "Check the credit notes" }, approver)).status).toBe(200);
    expect((await get("/gst/work/approvals"))[0]).toMatchObject({ status: "rejected", note: "Check the credit notes" });
  });
});
