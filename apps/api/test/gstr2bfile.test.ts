import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { parse2B } from "../src/services/gstwork.js";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);

// The layout of a GSTR-2B JSON as the portal publishes it: amounts per rate in `items`, credit and debit notes under cdnr, bills of entry under impg.
const portalFile = {
  data: {
    gstin: "27AAPFU0939F1ZV", rtnprd: "112026", version: "1.0", gendt: "14-12-2026",
    docdata: {
      b2b: [{
        ctin: "29AAGCB7383J1Z4", trdnm: "Bengaluru Mills", supfildt: "09-12-2026", supprd: "112026",
        inv: [
          { inum: "BM/2026/0001", typ: "R", dt: "05-11-2026", val: 21000, pos: "27", rev: "N", itcavl: "Y", diffprcnt: 1,
            items: [{ num: 1, rt: 5, txval: 10000, igst: 500, cgst: 0, sgst: 0, cess: 0 }, { num: 2, rt: 12, txval: 8000, igst: 960, cgst: 0, sgst: 0, cess: 0 }] },
          { inum: "BM/2026/0002", typ: "R", dt: "07-11-2026", val: 1050, pos: "27", rev: "N", itcavl: "N", rsn: "POS", items: [{ num: 1, rt: 5, txval: 1000, igst: 50, cgst: 0, sgst: 0, cess: 0 }] },
        ],
      }],
      b2ba: [{ ctin: "29AAGCB7383J1Z4", inv: [{ oinum: "BM/2026/0000", oidt: "01-10-2026", inum: "BM/2026/0000A", dt: "01-10-2026", itcavl: "Y", items: [{ num: 1, rt: 5, txval: 2000, igst: 100, cgst: 0, sgst: 0, cess: 0 }] }] }],
      cdnr: [{
        ctin: "29AAGCB7383J1Z4", trdnm: "Bengaluru Mills",
        nt: [
          { ntnum: "CN/1", typ: "C", dt: "20-11-2026", itcavl: "Y", items: [{ num: 1, rt: 5, txval: 2000, igst: 100, cgst: 0, sgst: 0, cess: 0 }] },
          { ntnum: "DN/1", typ: "D", dt: "21-11-2026", itcavl: "Y", items: [{ num: 1, rt: 5, txval: 400, igst: 20, cgst: 0, sgst: 0, cess: 0 }] },
        ],
      }],
      isd: [{ ctin: "27AAAAA0000A1Z5", trdnm: "Head Office", doclist: [{ docnum: "ISD/9", docdt: "30-11-2026", doctyp: "INV", itcelg: "Y", igst: 0, cgst: 45, sgst: 45, cess: 0 }] }],
      impg: [{ refdt: "28-11-2026", recdt: "29-11-2026", portcode: "INMAA1", boenum: "1234567", boedt: "27-11-2026", txval: 50000, iamt: 9000, csamt: 0 }],
    },
    // credit available excluding reverse supplies: invoices 500+960+100 (amended), notes -100, debit note +20, ISD 45+45 -> IGST 1480, CGST 45, SGST 45
    itcsumm: { itcavl: { nonrevsup: { igst: 1480, cgst: 45, sgst: 45, cess: 0 } } },
  },
};

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("gstr2bfile", { gstin: "27AAPFU0939F1ZV" })).cookie;
});
afterAll(() => t.close());

describe("reading a GSTR-2B file the way the portal lays it out", () => {
  const r = parse2B(portalFile);

  it("adds the rates of one invoice up, and reads amendments, notes and ISD credit", () => {
    const by = (no: string) => r.docs.find((d) => d.docNo === no)!;
    expect(by("BM/2026/0001")).toMatchObject({ kind: "invoice", taxable: "18000.00", igst: "1460.00", itc: true });
    expect(by("BM/2026/0002")).toMatchObject({ itc: false, reason: "POS" });
    expect(by("BM/2026/0000A")).toMatchObject({ kind: "invoice", reason: "Amended document" });
    expect(by("CN/1").kind).toBe("note");
    expect(by("DN/1")).toMatchObject({ kind: "invoice", reason: "Debit note", igst: "20.00" }); // a debit note adds credit
    expect(by("ISD/9")).toMatchObject({ kind: "invoice", cgst: "45.00", sgst: "45.00" });
  });

  it("counts bills of entry for imports apart, since they have no supplier GSTIN", () => {
    expect(r.imports).toEqual({ count: 1, igst: "9000.00", cess: "0.00" });
    expect(r.docs.some((d) => d.docNo === "1234567")).toBe(false);
  });

  it("still reads the older files with amounts on the document", () => {
    const old = parse2B({ data: { rtnprd: "102026", docdata: { b2b: [{ ctin: "29AAGCB7383J1Z4", inv: [{ inum: "X/1", dt: "05-10-2026", txval: 100, igst: 5 }] }] } } });
    expect(old.docs[0]).toMatchObject({ taxable: "100.00", igst: "5.00" });
    expect(old.period).toBe("102026");
  });

  it("refuses a file that is not a 2B statement", () => {
    expect(() => parse2B({ hello: "world" })).toThrow();
  });
});

describe("importing it", () => {
  it("checks what was read against the portal's own credit total", async () => {
    // Items 1460 + 50 (not available, left out) ... the portal total in the sample is for the available rows only.
    const res = await post("/gst/work/2b", { json: portalFile });
    expect(res.status, JSON.stringify(res.body)).toBe(201);
    expect(res.body.period).toBe("112026");
    expect(res.body.importsOfGoods).toMatchObject({ count: 1, igst: "9000.00" });
    expect(res.body.creditRead).toEqual({ igst: "1480.00", cgst: "45.00", sgst: "45.00", cess: "0.00" });
    expect(res.body.agreesWithPortalTotal).toBe(true);
  });
});
