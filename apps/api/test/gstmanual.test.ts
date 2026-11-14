import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
let reviewer: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown, cookie = c) => t.call(cookie, "POST", url, body);
const put = (url: string, body: unknown, cookie = c) => t.call(cookie, "PUT", url, body);
const bill = (supplier: string, no: string, date: string, rate: string) => post("/purchase-bills", { supplierId: supplier, date, supplierInvoiceNo: no, supplierInvoiceDate: date, lines: [{ itemId: id.cloth, qty: "10", rate }] });
const WP = "returnType=GSTR3B&period=102026";

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("gstmanual", { gstin: "27AAPFU0939F1ZV", booksFrom: "2025-04-01" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  const g = (k: string) => groups.find((x) => x.key === k)!.id;
  id.a = (await post("/accounts", { name: "Filing Supplier", groupId: g("sundry_creditors"), gstin: "29AAGCB7383J1Z4", stateCode: "29" })).body.id;
  id.b = (await post("/accounts", { name: "Missing From 2B", groupId: g("sundry_creditors"), gstin: "24AAACC1206D1ZM", stateCode: "24" })).body.id;
  id.delhi = (await post("/accounts", { name: "Delhi Walk-in", groupId: g("sundry_debtors"), stateCode: "07" })).body.id;
  id.loss = (await post("/accounts", { name: "ITC Reversed", groupId: g("indirect_expenses") })).body.id;
  const setup = await get("/inventory/setup");
  id.cloth = (await post("/items", { name: "Poplin", hsn: "5208", gstRate: "5", uomId: setup.uoms[0].id, saleRate: "300" })).body.id;
  const roles = (await t.call(c, "GET", "/roles")).body as { id: string; key: string }[];
  const inv = await t.call(c, "POST", "/invitations", { email: `reviewer-${t.run}@test.varchasv.in`, roleId: roles.find((r) => r.key === "accountant")!.id });
  reviewer = (await t.call("", "POST", "/invitations/accept", { token: inv.body.inviteUrl.split("/invite/")[1], name: "GST Reviewer", password: "ledger-balanced-1" })).cookie as string;

  expect((await bill(id.a, "FS/1", "2026-10-05", "1000")).status).toBe(201); // 10000 taxable, IGST 500
  expect((await bill(id.b, "MS/1", "2026-10-06", "2000")).status).toBe(201); // 20000 taxable, IGST 1000
  expect((await post("/sales-invoices", { customerId: id.delhi, date: "2026-10-10", lines: [{ itemId: id.cloth, qty: "10", rate: "300" }] })).status).toBe(201); // 3000 taxable, IGST 150
});
afterAll(() => t.close());

describe("GSTR-3B workpaper figures", () => {
  it("shows inter-state supplies to unregistered buyers by place of supply (3.2) and ITC from the books", async () => {
    const r = await get("/gst/gstr3b?period=102026");
    expect(r["3.2"].unregistered).toEqual([{ pos: "07", taxable: "3000.00", igst: "150.00" }]);
    expect(r["4"].a5_allOther).toMatchObject({ igst: "1500.00" });
    expect(r["4"].netItc).toMatchObject({ igst: "1500.00" });
    expect(r["4"].reversed).toMatchObject({ igst: "0.00" });
    expect(r.comparison).toEqual({ imported: false });
  });

  it("takes typed figures into the return: imports, reversal under rules, interest and late fee", async () => {
    const saved = await put("/gst/workpaper", { returnType: "GSTR3B", period: "102026", manual: {
      importGoods: { igst: "200.00" }, reversalRules: { igst: "100.00" }, nonGstOutward: "500", exemptInwardIntra: "1200.50",
      interest: { igst: "12.00" }, lateFee: { cgst: "25.00", sgst: "25.00" }, junk: "dropped", isd: { igst: "abc" },
    }, notes: "Rule 42 reversal worked out on the sheet" });
    expect(saved.status).toBe(200);
    expect(saved.body.manual).toEqual({ importGoods: { igst: "200.00" }, reversalRules: { igst: "100.00" }, nonGstOutward: "500", exemptInwardIntra: "1200.50", interest: { igst: "12.00" }, lateFee: { cgst: "25.00", sgst: "25.00" } });
    const r = await get("/gst/gstr3b?period=102026");
    expect(r["4"].available).toMatchObject({ igst: "1700.00" });
    expect(r["4"].netItc).toMatchObject({ igst: "1600.00" });
    expect(r["5"]).toMatchObject({ exemptIntra: "1200.50" });
    expect(r["5.1"].lateFee).toMatchObject({ cgst: "25.00", sgst: "25.00" });
    expect(r.json.itc_elg.itc_avl.find((x: { ty: string }) => x.ty === "IMPG")).toMatchObject({ iamt: 200 });
    expect(r.json.itc_elg.itc_rev.find((x: { ty: string }) => x.ty === "RUL")).toMatchObject({ iamt: 100 });
    expect(r.json.sup_details.osup_nongst.txval).toBe(500);
  });

  it("subtracts ITC reversed under rules 37 and 37A and adds it back when reclaimed", async () => {
    const wp = await get("/gst/work/itc-reversals");
    expect(wp).toEqual([]);
    const rev = await post("/gst/work/itc-reversals", { rule: "37A", billId: await billId("MS/1"), date: "2026-10-20", counterAccountId: id.loss });
    expect(rev.status).toBe(201);
    const r = await get("/gst/gstr3b?period=102026");
    expect(r["4"].b2_reversedOthers).toMatchObject({ igst: "1000.00" });
    expect(r["4"].netItc).toMatchObject({ igst: "600.00" });
    expect((await post(`/gst/work/itc-reversals/${rev.body.id}/reclaim`, { date: "2026-10-28", counterAccountId: id.loss })).status).toBe(200);
    const after = await get("/gst/gstr3b?period=102026");
    expect(after["4"].a5_reclaimed).toMatchObject({ igst: "1000.00" });
    expect(after["4"].netItc).toMatchObject({ igst: "1600.00" });
  });

  it("compares ITC per books with the imported GSTR-2B", async () => {
    await post("/gst/work/2b", { json: { data: { gstin: "27AAPFU0939F1ZV", rtnprd: "102026", docdata: { b2b: [{ ctin: "29AAGCB7383J1Z4", inv: [{ inum: "FS/1", dt: "05-10-2026", val: 10500, txval: 10000, igst: 500, itcavl: "Y" }] }] } } } });
    const r = await get("/gst/gstr3b?period=102026");
    expect(r.comparison).toMatchObject({ imported: true, rows: 1, itcPer2b: { igst: "500.00" }, itcPerBooks: { igst: "1500.00" }, inBooksNotIn2b: { count: 1, tax: { igst: "1000.00" } }, in2bNotInBooks: 0 });
  });
});

describe("manual filing record", () => {
  it("starts as prepared and cannot be marked filed before review", async () => {
    const wp = await get(`/gst/workpaper?${WP}`);
    expect(wp).toMatchObject({ status: "prepared", arn: null, changedSinceReview: false });
    const early = await post("/gst/workpaper/status", { returnType: "GSTR3B", period: "102026", to: "filed", arn: "AA271026123456Z", filedOn: "2026-11-05" });
    expect(early.status).toBe(409);
    expect(early.body.error).toBe("review_first");
  });

  it("reviews, then records the ARN and filing date with checks", async () => {
    const reviewed = await post("/gst/workpaper/status", { returnType: "GSTR3B", period: "102026", to: "reviewed" }, reviewer);
    expect(reviewed.status).toBe(200);
    expect(reviewed.body).toMatchObject({ status: "reviewed", changedSinceReview: false });
    const bad = (extra: object) => post("/gst/workpaper/status", { returnType: "GSTR3B", period: "102026", to: "filed", arn: "AA271026123456Z", filedOn: "2026-11-05", ...extra }, reviewer);
    expect((await bad({ arn: "short" })).body.error).toBe("invalid_arn");
    expect((await bad({ filedOn: "2026-10-25" })).body.error).toBe("filed_on_before_period_end");
    expect((await bad({ filedOn: "2999-01-01" })).body.error).toBe("filed_on_in_future");
    expect((await bad({ evidenceFileIds: ["00000000-0000-4000-8000-000000000000"] })).body.error).toBe("evidence_file_not_found");
    const filed = await bad({ arn: "aa271026123456z" });
    expect(filed.status).toBe(200);
    expect(filed.body).toMatchObject({ status: "filed", arn: "AA271026123456Z", filedOn: "2026-11-05" });
  });

  it("locks the figures once filed, and reopening needs a reason", async () => {
    expect((await put("/gst/workpaper", { returnType: "GSTR3B", period: "102026", manual: {} })).body.error).toBe("workpaper_filed_reopen_first");
    expect((await post("/gst/workpaper/status", { returnType: "GSTR3B", period: "102026", to: "prepared" }, reviewer)).body.error).toBe("reason_required");
    const reopened = await post("/gst/workpaper/status", { returnType: "GSTR3B", period: "102026", to: "prepared", reason: "Amended after supplier credit note" }, reviewer);
    expect(reopened.body).toMatchObject({ status: "prepared", arn: null, filedOn: null });
  });

  it("flags figures that changed after the review and refuses to file them", async () => {
    await post("/gst/workpaper/status", { returnType: "GSTR3B", period: "102026", to: "reviewed" }, reviewer);
    expect((await bill(id.a, "FS/2", "2026-10-25", "1000")).status).toBe(201);
    expect((await get(`/gst/workpaper?${WP}`)).changedSinceReview).toBe(true);
    const refused = await post("/gst/workpaper/status", { returnType: "GSTR3B", period: "102026", to: "filed", arn: "AA271026123456Z", filedOn: "2026-11-05" }, reviewer);
    expect(refused.status).toBe(409);
    expect(refused.body.error).toBe("books_changed_since_review");
  });

  it("sends a reviewed workpaper back to prepared when the typed figures change, and is tenant-private", async () => {
    await post("/gst/workpaper/status", { returnType: "GSTR3B", period: "102026", to: "reviewed" }, reviewer);
    const saved = await put("/gst/workpaper", { returnType: "GSTR3B", period: "102026", manual: { lateFee: { cgst: "50.00" } } });
    expect(saved.body.status).toBe("prepared");
    const other = (await t.signup("gstmanual-other")).cookie;
    expect((await t.call(other, "GET", `/gst/workpaper?${WP}`)).body).toMatchObject({ status: "prepared", manual: {} });
  });

  it("records a GSTR-1 workpaper the same way", async () => {
    const r = await post("/gst/workpaper/status", { returnType: "GSTR1", period: "102026", to: "reviewed" }, reviewer);
    expect(r.body).toMatchObject({ returnType: "GSTR1", status: "reviewed" });
  });
});

describe("GST filing method", () => {
  it("defaults to manual, allows the simulator mode explicitly, and rejects unknown methods", async () => {
    expect(await get("/gst/settings")).toMatchObject({ filingMethod: "manual" });

    const provider = await put("/gst/settings", { einvoiceEnabled: false, bilingualPrint: true, filingMethod: "provider" });
    expect(provider.status).toBe(200);
    expect(provider.body.filingMethod).toBe("provider");
    expect(await get("/gst/settings")).toMatchObject({ filingMethod: "provider" });

    const invalid = await put("/gst/settings", { einvoiceEnabled: false, bilingualPrint: true, filingMethod: "live_gstn" });
    expect(invalid.status).toBe(400);
    expect(await get("/gst/settings")).toMatchObject({ filingMethod: "provider" });
  });
});

async function billId(no: string): Promise<string> {
  const list = (await get("/purchase-bills")) as { id: string; supplierInvoiceNo?: string; supplier_invoice_no?: string }[] | { items: { id: string; supplierInvoiceNo?: string }[] };
  const rows = Array.isArray(list) ? list : list.items;
  return rows.find((b) => b.supplierInvoiceNo === no)!.id;
}
