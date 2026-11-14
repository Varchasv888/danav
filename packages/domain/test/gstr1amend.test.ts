import { describe, expect, it } from "vitest";
import { amendmentProblems, amendmentSections, type AmendmentInput, type AmendmentRow } from "../src/index.js";

const line = { rate: "5", taxable: "10000.00", igst: "500.00", cgst: "0.00", sgst: "0.00", cess: "0.00" };
const b2b: AmendmentInput = {
  kind: "b2b", period: "102026", ctin: "27AAPFU0939F1ZV", originalNumber: "INV/26-27/00012", originalDate: "2026-08-14",
  number: "INV/26-27/00012", docDate: "2026-08-14", pos: "27", intra: false, value: "10500.00", lines: [line],
};

describe("amendment checks", () => {
  it("accepts a correction of an earlier month's invoice", () => {
    expect(amendmentProblems(b2b)).toEqual([]);
  });

  it("refuses an amendment of an invoice from the same or a later month, a bad GSTIN, and missing originals", () => {
    expect(amendmentProblems({ ...b2b, originalDate: "2026-10-03" })).toContain("original_not_earlier");
    expect(amendmentProblems({ ...b2b, ctin: "27AAPFU0939F1Z0" })).toContain("invalid_gstin");
    expect(amendmentProblems({ ...b2b, originalNumber: "" })).toContain("original_required");
    expect(amendmentProblems({ ...b2b, lines: [] })).toContain("no_lines");
  });

  it("checks that tax follows the rate and the right heads are used", () => {
    expect(amendmentProblems({ ...b2b, lines: [{ ...line, igst: "900.00" }] })).toContain("tax_does_not_match_rate");
    expect(amendmentProblems({ ...b2b, intra: true, lines: [line] })).toContain("igst_on_intra");
    expect(amendmentProblems({ ...b2b, lines: [{ ...line, igst: "0.00", cgst: "250.00", sgst: "250.00" }] })).toContain("cgst_sgst_on_inter");
    expect(amendmentProblems({ ...b2b, lines: [{ ...line, rate: "13" }] })).toContain("invalid_rate");
  });

  it("a credit note amendment needs its type, and a B2C summary amendment needs the earlier month", () => {
    expect(amendmentProblems({ ...b2b, kind: "cdn" })).toContain("note_type_required");
    const cs: AmendmentInput = { kind: "b2cs", period: "102026", originalPeriod: "082026", pos: "18", intra: true, lines: [{ rate: "5", taxable: "1000.00", igst: "0.00", cgst: "25.00", sgst: "25.00", cess: "0.00" }] };
    expect(amendmentProblems(cs)).toEqual([]);
    expect(amendmentProblems({ ...cs, originalPeriod: "102026" })).toContain("original_not_earlier");
    expect(amendmentProblems({ ...cs, originalPeriod: undefined })).toContain("original_period_required");
  });
});

describe("amendment tables", () => {
  const rows: AmendmentRow[] = [
    { ...b2b, value: "10500.00" },
    { ...b2b, kind: "cdn", noteType: "C", originalNumber: "CN/1", number: "CN/1", value: "525.00", lines: [{ ...line, taxable: "500.00", igst: "25.00" }] },
    { kind: "b2cs", period: "102026", originalPeriod: "082026", pos: "18", intra: true, value: "0", lines: [{ rate: "5", taxable: "1000.00", igst: "0.00", cgst: "25.00", sgst: "25.00", cess: "0.00" }] },
  ];

  it("groups invoices and notes by buyer GSTIN and writes dates and heads the way the offline tool expects", () => {
    const s = amendmentSections(rows);
    expect(s.b2ba).toEqual([{ ctin: "27AAPFU0939F1ZV", inv: [{
      oinum: "INV/26-27/00012", oidt: "14-08-2026", inum: "INV/26-27/00012", idt: "14-08-2026", val: 10500, pos: "27", rchrg: "N", inv_typ: "R",
      itms: [{ num: 1, itm_det: { txval: 10000, rt: 5, iamt: 500, csamt: 0 } }],
    }] }]);
    expect(s.cdnra?.[0]?.nt[0]).toMatchObject({ ont_num: "CN/1", ntty: "C", val: 525 });
    expect(s.b2csa).toEqual([{ omon: "082026", sply_ty: "INTRA", pos: "18", typ: "OE", rt: 5, txval: 1000, camt: 25, samt: 25, csamt: 0 }]);
  });

  it("leaves out tables with no rows", () => {
    expect(amendmentSections([])).toEqual({});
  });
});
