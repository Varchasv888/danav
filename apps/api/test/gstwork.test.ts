import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const bill = (no: string, date: string, rate: string) => post("/purchase-bills", { supplierId: id.mill, date, supplierInvoiceNo: no, supplierInvoiceDate: date, lines: [{ itemId: id.cloth, qty: "10", rate }] });

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("gstwork", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.mill = (await post("/accounts", { name: "Bengaluru Mills", groupId: groups.find((g) => g.key === "sundry_creditors")!.id, gstin: "29AAGCB7383J1Z4", stateCode: "29" })).body.id;
  const setup = await get("/inventory/setup");
  id.cloth = (await post("/items", { name: "Poplin", hsn: "5208", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "MTR")?.id ?? setup.uoms[0].id, saleRate: "300" })).body.id;
});
afterAll(() => t.close());

const statement = (docs: { no: string; dt: string; txval: number; igst: number; itc?: string; rsn?: string }[]) => ({
  data: { gstin: "27AAPFU0939F1ZV", rtnprd: "102026", docdata: { b2b: [{ ctin: "29AAGCB7383J1Z4", trdnm: "Bengaluru Mills", inv: docs.map((d) => ({ inum: d.no, dt: d.dt, val: d.txval + d.igst, txval: d.txval, igst: d.igst, itcavl: d.itc ?? "Y", ...(d.rsn ? { rsn: d.rsn } : {}) })) }] } },
});

describe("GSTR-2B reconciliation", () => {
  it("matches the statement to the books by supplier and invoice number, and lists what does not agree", async () => {
    expect((await bill("SG/101", "2026-10-05", "1000")).status).toBe(201); // 10,000 + 500 IGST
    expect((await bill("SG/102", "2026-10-06", "2000")).status).toBe(201); // 20,000 + 1,000
    expect((await bill("SG/103", "2026-10-07", "500")).status).toBe(201); // 5,000 + 250: not in the statement
    const r = await post("/gst/work/2b", { json: statement([
      { no: "sg-101", dt: "05-10-2026", txval: 10000, igst: 500 },
      { no: "SG/102", dt: "06-10-2026", txval: 21000, igst: 1050 },
      { no: "SG/777", dt: "08-10-2026", txval: 4000, igst: 200 },
      { no: "SG/888", dt: "09-10-2026", txval: 3000, igst: 150, itc: "N", rsn: "Supplier filed late" },
    ]) });
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({ period: "102026", matched: 1, amountDiff: 1, unmatched: 2 });
    const rec = await get("/gst/work/2b/102026");
    expect(rec.totals).toMatchObject({ statementRows: 4, matched: 1, amountDiff: 1, notBooked: 2, notInStatement: 1, creditClaimable: "500.00", creditNotAvailable: "150.00", creditAtRisk: "250.00" });
    expect(rec.exceptions.find((e: { docNo: string }) => e.docNo === "SG/102").diff).toMatchObject({ taxable: "1000.00", igst: "50.00" });
    expect(rec.notInStatement[0]).toMatchObject({ invoiceNo: "SG/103", tax: "250.00" });
    expect(rec.ineligible[0]).toMatchObject({ docNo: "SG/888", reason: "Supplier filed late" });
  });

  it("records a decision on an exception with a note, and loading again replaces the statement", async () => {
    const rec = await get("/gst/work/2b/102026");
    const row = rec.exceptions[0];
    expect((await post(`/gst/work/2b/rows/${row.id}/decide`, { decision: "queried", note: "x" })).status).toBe(400);
    expect((await post(`/gst/work/2b/rows/${row.id}/decide`, { decision: "queried", note: "Asked supplier to correct" })).status).toBe(200);
    expect((await get("/gst/work/2b/102026")).exceptions.find((e: { id: string }) => e.id === row.id)).toMatchObject({ decision: "queried", decisionNote: "Asked supplier to correct" });
    const again = await post("/gst/work/2b", { json: statement([{ no: "SG/101", dt: "05-10-2026", txval: 10000, igst: 500 }]) });
    expect(again.body).toMatchObject({ matched: 1, amountDiff: 0, unmatched: 0 });
    expect(await get("/gst/work/2b")).toHaveLength(1);
    expect((await post("/gst/work/2b", { json: { nothing: true }, period: "102026" })).status).toBe(400);
    expect((await t.call(c, "GET", "/gst/work/2b/092026")).status).toBe(404);
  });
});

describe("filing calendar, e-invoice window and Rule 37", () => {
  it("shows the coming returns, with old unfiled ones overdue, and moves the dates for the quarterly scheme", async () => {
    const cal = await get("/gst/work/calendar");
    expect(cal.items.some((i: { returnType: string }) => i.returnType === "GSTR3B")).toBe(true);
    expect(cal.items.find((i: { returnType: string; dueOn: string }) => i.returnType === "GSTR3B" && i.dueOn.endsWith("-20"))).toBeTruthy();
    expect(cal.overdue).toBeGreaterThan(0);
    expect((await t.call(c, "PUT", "/gst/work/settings", { qrmp: true })).status).toBe(200);
    const q = await get("/gst/work/calendar");
    expect(q.qrmp).toBe(true);
    expect(q.items.find((i: { returnType: string }) => i.returnType === "GSTR3B").dueOn.endsWith("-22")).toBe(true);
    expect(q.items.filter((i: { returnType: string }) => i.returnType === "GSTR1").every((i: { dueOn: string }) => i.dueOn.endsWith("-13"))).toBe(true);
    await t.call(c, "PUT", "/gst/work/settings", { qrmp: false });
  });

  it("says nothing about e-invoices until they are switched on", async () => {
    expect(await get("/gst/work/einvoice-alerts")).toMatchObject({ enabled: false, items: [] });
  });

  it("lists bills unpaid past 180 days as credit to reverse", async () => {
    expect((await bill("OLD/1", "2026-04-10", "1000")).status).toBe(201);
    const r = await get("/gst/work/rule37");
    const old = r.items.find((x: { number: string; state: string }) => x.state === "reverse");
    expect(old).toBeTruthy();
    expect(old.ageDays).toBeGreaterThan(180);
    expect(Number(r.reverseTotal)).toBeGreaterThan(0);
  });

  it("keeps businesses apart", async () => {
    const other = (await t.signup("gstwork-other")).cookie;
    expect((await t.call(other, "GET", "/gst/work/2b")).body).toEqual([]);
    expect((await t.call(other, "GET", "/gst/work/2b/102026")).status).toBe(404);
  });
});
