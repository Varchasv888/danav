import { and, asc, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { amendmentSections, b2bInvoiceType, dec, gstSetOff, gstr1Section, itcFrom2b, money, taxPeriod, type Dec } from "@varchasv/domain";
import { badRequest } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";

/**
 * GSTR-1 in the GSTN offline-tool / portal JSON format, and a GSTR-3B summary with the ITC set-off.
 * Dates in GSTR-1 JSON are dd-mm-yyyy; amounts are numbers with 2 decimals.
 */
const n = (v: Dec | string) => Number(money(v));
const idt = (iso: string) => `${iso.slice(8, 10)}-${iso.slice(5, 7)}-${iso.slice(0, 4)}`;

interface TaxRow { taxable: string; cgst: string; sgst: string; utgst: string; igst: string; cess: string; gstRate: string }

/** GSTR-1 item rows: one per tax rate. */
function itemsByRate(lines: TaxRow[]) {
  const byRate = new Map<string, { txval: Dec; iamt: Dec; camt: Dec; samt: Dec; csamt: Dec }>();
  for (const l of lines) {
    const r = String(Number(l.gstRate));
    const cur = byRate.get(r) ?? { txval: dec(0), iamt: dec(0), camt: dec(0), samt: dec(0), csamt: dec(0) };
    cur.txval = cur.txval.plus(l.taxable);
    cur.iamt = cur.iamt.plus(l.igst);
    cur.camt = cur.camt.plus(l.cgst);
    cur.samt = cur.samt.plus(l.sgst).plus(l.utgst);
    cur.csamt = cur.csamt.plus(l.cess);
    byRate.set(r, cur);
  }
  return [...byRate.entries()].sort((a, b) => Number(a[0]) - Number(b[0])).map(([rt, v], i) => ({
    num: i + 1,
    itm_det: { txval: n(v.txval), rt: Number(rt), ...(v.iamt.isZero() ? { camt: n(v.camt), samt: n(v.samt) } : { iamt: n(v.iamt) }), csamt: n(v.csamt) },
  }));
}

export async function gstr1(tx: Tx, companyId: string | undefined, fp: string) {
  const { from, to } = taxPeriod(fp);
  const company = await resolveCompany(tx, companyId);
  const [branch] = await tx.select().from(tables.branches).where(and(eq(tables.branches.companyId, company.id), eq(tables.branches.isHeadOffice, true)));
  if (!branch?.gstin) throw badRequest("branch_gstin_required");

  const invoices = await tx.select().from(tables.salesInvoices)
    .where(and(eq(tables.salesInvoices.companyId, company.id), gte(tables.salesInvoices.date, from), lte(tables.salesInvoices.date, to)))
    .orderBy(asc(tables.salesInvoices.number));
  const lines = invoices.length ? await tx.select({ line: tables.salesInvoiceLines, hsn: tables.items.hsn, uom: tables.uoms.code, kind: tables.items.kind, name: tables.items.name })
    .from(tables.salesInvoiceLines).innerJoin(tables.items, eq(tables.items.id, tables.salesInvoiceLines.itemId)).innerJoin(tables.uoms, eq(tables.uoms.id, tables.items.uomId))
    .where(sql`${tables.salesInvoiceLines.invoiceId} in (select id from sales_invoices where company_id = ${company.id} and date between ${from}::date and ${to}::date and status = 'posted')`) : [];
  const notes = await tx.select({ note: tables.creditNotes, inv: tables.salesInvoices }).from(tables.creditNotes)
    .innerJoin(tables.salesInvoices, eq(tables.salesInvoices.id, tables.creditNotes.invoiceId))
    .where(and(eq(tables.creditNotes.companyId, company.id), gte(tables.creditNotes.date, from), lte(tables.creditNotes.date, to)));
  const noteLines = notes.length ? await tx.select({ line: tables.creditNoteLines, hsn: tables.items.hsn, uom: tables.uoms.code, kind: tables.items.kind })
    .from(tables.creditNoteLines).innerJoin(tables.items, eq(tables.items.id, tables.creditNoteLines.itemId)).innerJoin(tables.uoms, eq(tables.uoms.id, tables.items.uomId))
    .where(sql`${tables.creditNoteLines.noteId} in (select id from credit_notes where company_id = ${company.id} and date between ${from}::date and ${to}::date and status = 'posted')`) : [];

  const posted = invoices.filter((i) => i.status === "posted");
  const linesOf = (id: string) => lines.filter((l) => l.line.invoiceId === id).map((l) => l.line);
  const b2b = new Map<string, unknown[]>();
  const b2cl = new Map<string, unknown[]>();
  const b2cs = new Map<string, { sply_ty: string; pos: string; rt: number; typ: "OE"; txval: Dec; iamt: Dec; camt: Dec; samt: Dec; csamt: Dec }>();
  const exp: unknown[] = [];
  const sectionOf = new Map<string, string>();

  const addB2cs = (pos: string, intra: boolean, ls: TaxRow[], sign: 1 | -1) => {
    for (const l of ls) {
      const rt = Number(l.gstRate);
      const key = `${pos}|${rt}|${intra}`;
      const cur = b2cs.get(key) ?? { sply_ty: intra ? "INTRA" : "INTER", pos, rt, typ: "OE" as const, txval: dec(0), iamt: dec(0), camt: dec(0), samt: dec(0), csamt: dec(0) };
      cur.txval = cur.txval.plus(dec(l.taxable).times(sign));
      cur.iamt = cur.iamt.plus(dec(l.igst).times(sign));
      cur.camt = cur.camt.plus(dec(l.cgst).times(sign));
      cur.samt = cur.samt.plus(dec(l.sgst).plus(l.utgst).times(sign));
      cur.csamt = cur.csamt.plus(dec(l.cess).times(sign));
      b2cs.set(key, cur);
    }
  };

  for (const inv of posted) {
    const section = gstr1Section({ customerGstin: inv.customerGstin, supplyKind: inv.supplyKind as "intra", invoiceValue: inv.total });
    sectionOf.set(inv.id, section);
    const ls = linesOf(inv.id);
    const row = { inum: inv.number, idt: idt(inv.date), val: n(inv.total), itms: itemsByRate(ls) };
    if (section === "B2B") {
      const list = b2b.get(inv.customerGstin!) ?? [];
      list.push({ ...row, pos: inv.placeOfSupply, rchrg: inv.reverseCharge ? "Y" : "N", inv_typ: b2bInvoiceType(inv.supplyKind, inv.lut) });
      b2b.set(inv.customerGstin!, list);
    } else if (section === "B2CL") {
      const list = b2cl.get(inv.placeOfSupply) ?? [];
      list.push(row);
      b2cl.set(inv.placeOfSupply, list);
    } else if (section === "EXP") {
      exp.push({ exp_typ: inv.lut ? "WOPAY" : "WPAY", ...row, itms: row.itms.map((i) => ({ txval: i.itm_det.txval, rt: i.itm_det.rt, iamt: "iamt" in i.itm_det ? i.itm_det.iamt : 0, csamt: i.itm_det.csamt })) });
    } else {
      addB2cs(inv.placeOfSupply, inv.supplyKind === "intra", ls, 1);
    }
  }

  // Credit notes: registered → CDNR; unregistered B2CL invoices → CDNUR; B2CS ones reduce the B2CS totals.
  const cdnr = new Map<string, unknown[]>();
  const cdnur: unknown[] = [];
  for (const { note, inv } of notes.filter((x) => x.note.status === "posted")) {
    const nls = noteLines.filter((l) => l.line.noteId === note.id).map((l) => l.line);
    const section = gstr1Section({ customerGstin: inv.customerGstin, supplyKind: inv.supplyKind as "intra", invoiceValue: inv.total });
    const row = { ntty: "C", nt_num: note.number, nt_dt: idt(note.date), val: n(note.total), itms: itemsByRate(nls) };
    if (section === "B2B") {
      const list = cdnr.get(inv.customerGstin!) ?? [];
      list.push({ ...row, pos: note.placeOfSupply, rchrg: "N", inv_typ: b2bInvoiceType(inv.supplyKind, inv.lut) });
      cdnr.set(inv.customerGstin!, list);
    } else if (section === "B2CL" || section === "EXP") {
      cdnur.push({ ...row, typ: section === "EXP" ? (inv.lut ? "EXPWOP" : "EXPWP") : "B2CL", pos: note.placeOfSupply });
    } else {
      addB2cs(note.placeOfSupply, note.supplyKind === "intra", nls, -1);
    }
  }

  // POS bills are B2C sales in our own state: B2CS by rate, and their lines in the B2C HSN summary.
  const posBills = await tx.select().from(tables.posBills)
    .where(and(eq(tables.posBills.companyId, company.id), gte(tables.posBills.date, from), lte(tables.posBills.date, to)));
  const paidPos = posBills.filter((b) => b.status === "paid");
  const posLines = paidPos.length ? await tx.select({ line: tables.posBillLines, uom: tables.uoms.code, kind: tables.items.kind }).from(tables.posBillLines)
    .innerJoin(tables.items, eq(tables.items.id, tables.posBillLines.itemId)).innerJoin(tables.uoms, eq(tables.uoms.id, tables.items.uomId))
    .where(sql`${tables.posBillLines.billId} in (select id from pos_bills where company_id = ${company.id} and date between ${from}::date and ${to}::date and status = 'paid')`) : [];
  for (const b of paidPos) {
    addB2cs(branch.stateCode, true, b.taxByRate.map((r) => ({ taxable: r.taxable, cgst: r.cgst, sgst: r.sgst, utgst: "0", igst: "0", cess: r.cess, gstRate: r.rate })), 1);
  }
  // Goods returned at the counter come off B2CS (and the B2C HSN summary) in the month of the return.
  const posRets = await tx.select().from(tables.posReturns)
    .where(and(eq(tables.posReturns.companyId, company.id), gte(tables.posReturns.date, from), lte(tables.posReturns.date, to)));
  for (const r of posRets) addB2cs(branch.stateCode, true, r.lines.map((l) => ({ ...l, utgst: "0", igst: "0" })), -1);
  const retItems = posRets.length ? await tx.select({ id: tables.items.id, uom: tables.uoms.code, kind: tables.items.kind }).from(tables.items)
    .innerJoin(tables.uoms, eq(tables.uoms.id, tables.items.uomId)).where(inArray(tables.items.id, [...new Set(posRets.flatMap((r) => r.lines.map((l) => l.itemId)))])) : [];

  // HSN summary (net of credit notes), split B2B / B2C as the portal now requires.
  const hsnRows = new Map<string, { hsn_sc: string; uqc: string; rt: number; b2b: boolean; qty: Dec; txval: Dec; iamt: Dec; camt: Dec; samt: Dec; csamt: Dec }>();
  const addHsn = (hsn: string | null, uqc: string, l: TaxRow & { qty: string }, isB2b: boolean, sign: 1 | -1) => {
    const key = `${hsn}|${uqc}|${Number(l.gstRate)}|${isB2b}`;
    const cur = hsnRows.get(key) ?? { hsn_sc: hsn ?? "", uqc, rt: Number(l.gstRate), b2b: isB2b, qty: dec(0), txval: dec(0), iamt: dec(0), camt: dec(0), samt: dec(0), csamt: dec(0) };
    cur.qty = cur.qty.plus(dec(l.qty).times(sign));
    cur.txval = cur.txval.plus(dec(l.taxable).times(sign));
    cur.iamt = cur.iamt.plus(dec(l.igst).times(sign));
    cur.camt = cur.camt.plus(dec(l.cgst).times(sign));
    cur.samt = cur.samt.plus(dec(l.sgst).plus(l.utgst).times(sign));
    cur.csamt = cur.csamt.plus(dec(l.cess).times(sign));
    hsnRows.set(key, cur);
  };
  for (const l of lines) addHsn(l.hsn, l.kind === "service" ? "NA" : l.uom, l.line, sectionOf.get(l.line.invoiceId) === "B2B", 1);
  for (const l of noteLines) {
    const inv = notes.find((x) => x.note.id === l.line.noteId)!.inv;
    addHsn(l.hsn, l.kind === "service" ? "NA" : l.uom, l.line, !!inv.customerGstin, -1);
  }
  for (const l of posLines) addHsn(l.line.hsn, l.kind === "service" ? "NA" : l.uom, { ...l.line, utgst: "0", igst: "0" }, false, 1);
  for (const r of posRets) for (const l of r.lines) {
    const it = retItems.find((i) => i.id === l.itemId);
    addHsn(l.hsn, it?.kind === "service" ? "NA" : it?.uom ?? "OTH", { ...l, utgst: "0", igst: "0" }, false, -1);
  }
  const hsnData = (b2bRows: boolean) => [...hsnRows.values()].filter((h) => h.b2b === b2bRows).map((h, i) => ({
    num: i + 1, hsn_sc: h.hsn_sc, uqc: h.uqc, qty: Number(h.qty.toFixed(2)), rt: h.rt, txval: n(h.txval), iamt: n(h.iamt), camt: n(h.camt), samt: n(h.samt), csamt: n(h.csamt),
  }));

  // Documents issued: invoice and credit-note number ranges, with cancelled counts.
  const range = (docs: { number: string; status: string }[], docNum: number) => {
    if (!docs.length) return null;
    const sorted = [...docs].sort((a, b) => a.number.localeCompare(b.number));
    const cancelled = sorted.filter((d) => d.status === "cancelled").length;
    return { doc_num: docNum, docs: [{ num: 1, from: sorted[0]!.number, to: sorted.at(-1)!.number, totnum: sorted.length, cancel: cancelled, net_issue: sorted.length - cancelled }] };
  };

  // Invoices issued: the invoice series and each POS terminal's own series, numbered one after another.
  const docDetails = () => {
    const invoiceRanges = [range(invoices, 1), ...[...new Set(posBills.map((b) => b.number.split("/")[0]))].sort()
      .map((prefix) => range(posBills.filter((b) => b.number.split("/")[0] === prefix).map((b) => ({ number: b.number, status: b.status === "void" ? "cancelled" : "posted" })), 1))]
      .filter((r): r is NonNullable<typeof r> => !!r);
    const merged = invoiceRanges.length ? [{ doc_num: 1, docs: invoiceRanges.flatMap((r) => r.docs).map((d, i) => ({ ...d, num: i + 1 })) }] : [];
    // Credit notes: the credit-note series and each counter's returns series.
    const noteRanges = [range(notes.map((x) => x.note), 5), ...[...new Set(posRets.map((r) => r.number.split("/")[0]))].sort()
      .map((prefix) => range(posRets.filter((r) => r.number.split("/")[0] === prefix).map((r) => ({ number: r.number, status: "posted" })), 5))]
      .filter((r): r is NonNullable<typeof r> => !!r);
    const notesMerged = noteRanges.length ? [{ doc_num: 5, docs: noteRanges.flatMap((r) => r.docs).map((d, i) => ({ ...d, num: i + 1 })) }] : [];
    return [...merged, ...notesMerged];
  };

  const amendments = await tx.select().from(tables.gstr1Amendments)
    .where(and(eq(tables.gstr1Amendments.companyId, company.id), eq(tables.gstr1Amendments.period, fp))).orderBy(asc(tables.gstr1Amendments.createdAt));
  const json = {
    gstin: branch.gstin,
    fp,
    b2b: [...b2b.entries()].map(([ctin, inv]) => ({ ctin, inv })),
    b2cl: [...b2cl.entries()].map(([pos, inv]) => ({ pos, inv })),
    b2cs: [...b2cs.values()].map((r) => ({ sply_ty: r.sply_ty, pos: r.pos, typ: r.typ, rt: r.rt, txval: n(r.txval), ...(r.sply_ty === "INTER" ? { iamt: n(r.iamt) } : { camt: n(r.camt), samt: n(r.samt) }), csamt: n(r.csamt) })),
    exp: exp.length ? [{ exp_typ: "WPAY", inv: exp.filter((e) => (e as { exp_typ: string }).exp_typ === "WPAY") }, { exp_typ: "WOPAY", inv: exp.filter((e) => (e as { exp_typ: string }).exp_typ === "WOPAY") }].filter((x) => x.inv.length) : [],
    cdnr: [...cdnr.entries()].map(([ctin, nt]) => ({ ctin, nt })),
    cdnur,
    hsn: { hsn_b2b: hsnData(true), hsn_b2c: hsnData(false) },
    doc_issue: { doc_det: docDetails() },
    // Corrections to earlier months' supplies recorded for this return: B2BA, CDNRA and B2CSA.
    ...amendmentSections(amendments.map((a) => ({
      kind: a.kind as "b2b" | "cdn" | "b2cs", period: a.period, ctin: a.ctin, originalNumber: a.originalNumber, originalDate: a.originalDate, originalPeriod: a.originalPeriod,
      number: a.number, docDate: a.docDate, noteType: a.noteType, pos: a.pos, intra: a.intra, reverseCharge: a.reverseCharge, invoiceType: a.invoiceType, value: a.value, lines: a.lines,
    }))),
  };

  const sum = (xs: { taxable: string; cgst: string; sgst: string; utgst: string; igst: string; cess: string; total: string }[]) => ({
    count: xs.length,
    taxable: money(xs.reduce((s, x) => s.plus(x.taxable), dec(0))),
    tax: money(xs.reduce((s, x) => s.plus(x.cgst).plus(x.sgst).plus(x.utgst).plus(x.igst).plus(x.cess), dec(0))),
    total: money(xs.reduce((s, x) => s.plus(x.total), dec(0))),
  });
  const summary = {
    B2B: sum(posted.filter((i) => sectionOf.get(i.id) === "B2B")),
    B2CL: sum(posted.filter((i) => sectionOf.get(i.id) === "B2CL")),
    B2CS: sum(posted.filter((i) => sectionOf.get(i.id) === "B2CS")),
    EXP: sum(posted.filter((i) => sectionOf.get(i.id) === "EXP")),
    creditNotes: sum(notes.filter((x) => x.note.status === "posted").map((x) => x.note)),
    POS: sum(paidPos.map((b) => ({ ...b, utgst: "0", igst: "0" }))),
    posReturns: sum(posRets.map((r) => ({ ...r, utgst: "0", igst: "0" }))),
    cancelledInvoices: invoices.length - posted.length,
    amendments: amendments.length,
  };
  return { period: { fp, from, to }, summary, json };
}

/** Rupee amounts per tax head, as strings. */
export interface TaxHeadsIn { igst?: string | undefined; cgst?: string | undefined; sgst?: string | undefined; cess?: string | undefined }
/** Figures an accountant types for the return because the books cannot know them (kept in `gst_workpapers.manual`). */
export interface Manual3b {
  importGoods?: TaxHeadsIn | undefined; importServices?: TaxHeadsIn | undefined; isd?: TaxHeadsIn | undefined;
  /** 4(B)(1): ITC reversed under rules 38, 42, 43 and section 17(5). */
  reversalRules?: TaxHeadsIn | undefined;
  /** 4(D): ineligible ITC under section 17(5) and other. */
  ineligibleRule?: TaxHeadsIn | undefined; ineligibleOther?: TaxHeadsIn | undefined;
  /** 3.1(e): outward supplies that are not GST. */
  nonGstOutward?: string | undefined;
  /** 5: exempt, nil-rated and non-GST inward supplies. */
  exemptInwardInter?: string | undefined; exemptInwardIntra?: string | undefined; nonGstInwardInter?: string | undefined; nonGstInwardIntra?: string | undefined;
  /** 5.1: interest and late fee by head. */
  interest?: TaxHeadsIn | undefined; lateFee?: TaxHeadsIn | undefined;
}

/**
 * GSTR-3B: outward tax (3.1), inter-state supplies to unregistered buyers (3.2), ITC with reversals (4), inward exempt
 * supplies (5), interest and late fee (5.1) and how credit pays the tax (6.1). `manualIn` carries what only the accountant knows.
 */
export async function gstr3b(tx: Tx, companyId: string | undefined, fp: string, manualIn?: Manual3b, itcBasis: "books" | "2b" = "books") {
  const manual = manualIn ?? {};
  const { from, to } = taxPeriod(fp);
  const company = await resolveCompany(tx, companyId);
  const totals = async (table: "sales_invoices" | "credit_notes" | "purchase_bills" | "purchase_returns", where: ReturnType<typeof sql>) => {
    const [r] = await tx.execute<{ taxable: string; igst: string; cgst: string; sgst: string; cess: string }>(sql`
      select coalesce(sum(taxable),0) as taxable, coalesce(sum(igst),0) as igst, coalesce(sum(cgst),0) as cgst,
             coalesce(sum(sgst + utgst),0) as sgst, coalesce(sum(cess),0) as cess
      from ${sql.raw(table)} where company_id = ${company.id} and status = 'posted' and date between ${from}::date and ${to}::date and ${where}`);
    return r!;
  };
  const minus = (a: Record<string, string>, b: Record<string, string>) =>
    Object.fromEntries(["taxable", "igst", "cgst", "sgst", "cess"].map((k) => [k, money(dec(a[k]!).minus(b[k]!))])) as Record<"taxable" | "igst" | "cgst" | "sgst" | "cess", string>;

  const [pos] = await tx.execute<{ taxable: string; igst: string; cgst: string; sgst: string; cess: string }>(sql`
    select coalesce(sum(taxable),0) as taxable, 0 as igst, coalesce(sum(cgst),0) as cgst, coalesce(sum(sgst),0) as sgst, coalesce(sum(cess),0) as cess
    from pos_bills where company_id = ${company.id} and status = 'paid' and date between ${from}::date and ${to}::date and (cgst + sgst) > 0`);
  const [posRet] = await tx.execute<{ taxable: string; igst: string; cgst: string; sgst: string; cess: string }>(sql`
    select coalesce(sum(taxable),0) as taxable, 0 as igst, coalesce(sum(cgst),0) as cgst, coalesce(sum(sgst),0) as sgst, coalesce(sum(cess),0) as cess
    from pos_returns where company_id = ${company.id} and date between ${from}::date and ${to}::date and (cgst + sgst) > 0`);
  const invoicesOut = minus(await totals("sales_invoices", sql`supply_kind in ('intra','inter') and (igst + cgst + sgst + utgst) > 0`),
    await totals("credit_notes", sql`supply_kind in ('intra','inter') and (igst + cgst + sgst + utgst) > 0`));
  const taxableOut = Object.fromEntries((["taxable", "igst", "cgst", "sgst", "cess"] as const).map((k) => [k, money(dec(invoicesOut[k]).plus(pos![k]).minus(posRet![k]))])) as typeof invoicesOut;
  const zeroRated = minus(await totals("sales_invoices", sql`supply_kind in ('export','sez')`), await totals("credit_notes", sql`supply_kind in ('export','sez')`));
  const nilRated = minus(await totals("sales_invoices", sql`supply_kind in ('intra','inter') and (igst + cgst + sgst + utgst) = 0`),
    await totals("credit_notes", sql`supply_kind in ('intra','inter') and (igst + cgst + sgst + utgst) = 0`));
  const rcmInward = await totals("purchase_bills", sql`reverse_charge`);
  const itcPerBooks = minus(await totals("purchase_bills", sql`not reverse_charge`), await totals("purchase_returns", sql`true`));

  // The latest GSTR-2B statement imported for the period, if any.
  const [imp] = await tx.select().from(tables.gstr2bImports)
    .where(and(eq(tables.gstr2bImports.companyId, company.id), eq(tables.gstr2bImports.period, fp), eq(tables.gstr2bImports.source, "2b")))
    .orderBy(desc(tables.gstr2bImports.importedAt)).limit(1);
  const stmtRows = imp ? await tx.select().from(tables.gstr2bRows).where(eq(tables.gstr2bRows.importId, imp.id)) : [];
  // Credit driven by the statement: only as far as GSTR-2B shows it (Rule 36(4)), with what is held back and why.
  const bills = await tx.execute<{ id: string; igst: string; cgst: string; sgst: string; utgst: string; cess: string }>(sql`
    select id, igst, cgst, sgst, utgst, cess from purchase_bills where company_id = ${company.id} and status = 'posted' and not reverse_charge and date between ${from}::date and ${to}::date`);
  const fromStatement = imp ? itcFrom2b(
    stmtRows.map((r) => ({ kind: r.kind === "invoice" ? "invoice" as const : "note" as const, itcAvailable: r.itcAvailable, decision: r.decision, billId: r.billId, igst: r.igst, cgst: r.cgst, sgst: r.sgst, cess: r.cess })),
    new Map([...bills].map((b) => [b.id, { igst: money(b.igst), cgst: money(b.cgst), sgst: money(dec(b.sgst).plus(b.utgst)), cess: money(b.cess) }])),
  ) : null;
  const useStatement = itcBasis === "2b" && !!fromStatement;
  const itcAll = useStatement ? { taxable: itcPerBooks.taxable, ...fromStatement!.claim } : itcPerBooks;

  type H4 = { igst: string; cgst: string; sgst: string; cess: string };
  const heads = (x: H4) => ({ igst: x.igst, cgst: x.cgst, sgst: x.sgst, cess: x.cess });
  const add = (a: H4, b: H4): H4 => ({ igst: money(dec(a.igst).plus(b.igst)), cgst: money(dec(a.cgst).plus(b.cgst)), sgst: money(dec(a.sgst).plus(b.sgst)), cess: money(dec(a.cess).plus(b.cess)) });
  const h4 = (x?: TaxHeadsIn): H4 => ({ igst: money(x?.igst || "0"), cgst: money(x?.cgst || "0"), sgst: money(x?.sgst || "0"), cess: money(x?.cess || "0") });

  // Reversals under rules 37 and 37A (4(B)(2)) and credit taken again once the supplier is paid (4(A)(5)), by the date each happened.
  const sumReversals = async (col: "reversed_on" | "reclaimed_on"): Promise<H4> => {
    const [r] = await tx.execute<H4>(sql`select coalesce(sum(igst),0) as igst, coalesce(sum(cgst),0) as cgst, coalesce(sum(sgst),0) as sgst, coalesce(sum(cess),0) as cess
      from itc_reversals where company_id = ${company.id} and ${sql.raw(col)} between ${from}::date and ${to}::date`);
    return h4(r);
  };
  const reversedOthers = await sumReversals("reversed_on"), reclaimed = await sumReversals("reclaimed_on");
  const importGoods = h4(manual.importGoods), importServices = h4(manual.importServices), isdItc = h4(manual.isd);
  const itcAvailable = [importGoods, importServices, rcmInward as H4, isdItc, itcAll as H4, reclaimed].reduce(add);
  const reversalRules = h4(manual.reversalRules);
  const itcReversed = add(reversalRules, reversedOthers);
  // Net ITC cannot pay tax below zero: a head where reversals exceed credit is shown as a shortfall to settle in cash.
  const net = (k: keyof H4) => dec(itcAvailable[k]).minus(itcReversed[k]);
  const credit: H4 = { igst: money(net("igst").lt(0) ? 0 : net("igst")), cgst: money(net("cgst").lt(0) ? 0 : net("cgst")), sgst: money(net("sgst").lt(0) ? 0 : net("sgst")), cess: money(net("cess").lt(0) ? 0 : net("cess")) };
  const shortfall: H4 = { igst: money(net("igst").lt(0) ? net("igst").neg() : 0), cgst: money(net("cgst").lt(0) ? net("cgst").neg() : 0), sgst: money(net("sgst").lt(0) ? net("sgst").neg() : 0), cess: money(net("cess").lt(0) ? net("cess").neg() : 0) };
  const ineligible = { rules: h4(manual.ineligibleRule), others: h4(manual.ineligibleOther) };

  // 3.2: inter-state supplies to unregistered buyers by place of supply (invoices less credit notes against them).
  type PosRow = { pos: string; taxable: string; igst: string };
  const unregInv = await tx.execute<PosRow>(sql`
    select place_of_supply as pos, coalesce(sum(taxable),0) as taxable, coalesce(sum(igst),0) as igst from sales_invoices
    where company_id = ${company.id} and status = 'posted' and supply_kind = 'inter' and igst > 0 and coalesce(customer_gstin, '') = '' and date between ${from}::date and ${to}::date group by 1`);
  const unregNotes = await tx.execute<PosRow>(sql`
    select s.place_of_supply as pos, coalesce(sum(c.taxable),0) as taxable, coalesce(sum(c.igst),0) as igst from credit_notes c join sales_invoices s on s.id = c.invoice_id
    where c.company_id = ${company.id} and c.status = 'posted' and s.supply_kind = 'inter' and c.igst > 0 and coalesce(s.customer_gstin, '') = '' and c.date between ${from}::date and ${to}::date group by 1`);
  const unregMap = new Map<string, { taxable: Dec; igst: Dec }>();
  for (const [rows, sign] of [[unregInv, 1], [unregNotes, -1]] as const) {
    for (const r of rows) {
      const cur = unregMap.get(r.pos) ?? { taxable: dec(0), igst: dec(0) };
      unregMap.set(r.pos, { taxable: cur.taxable.plus(dec(r.taxable).times(sign)), igst: cur.igst.plus(dec(r.igst).times(sign)) });
    }
  }
  const unregistered = [...unregMap.entries()].filter(([, v]) => !v.taxable.isZero() || !v.igst.isZero())
    .sort(([a], [b]) => a.localeCompare(b)).map(([pos, v]) => ({ pos, taxable: money(v.taxable), igst: money(v.igst) }));

  // ITC per books against the imported GSTR-2B for the period: what the portal says is available, and what the books hold that it does not.
  let comparison: Record<string, unknown> = { imported: false };
  if (imp) {
    const rows = stmtRows;
    const signed = rows.filter((r) => r.itcAvailable).map((r): H4 => {
      const sg = r.kind === "invoice" ? 1 : -1;
      return { igst: money(dec(r.igst).times(sg)), cgst: money(dec(r.cgst).times(sg)), sgst: money(dec(r.sgst).times(sg)), cess: money(dec(r.cess).times(sg)) };
    });
    const matched = new Set(rows.map((r) => r.billId).filter((x): x is string => !!x));
    const books = await tx.execute<H4 & { id: string }>(sql`
      select id, igst, cgst, sgst, cess from purchase_bills where company_id = ${company.id} and status = 'posted' and not reverse_charge and date between ${from}::date and ${to}::date`);
    const missing = [...books].filter((b) => !matched.has(b.id));
    const zero4: H4 = { igst: "0.00", cgst: "0.00", sgst: "0.00", cess: "0.00" };
    comparison = {
      imported: true, importedAt: imp.importedAt, rows: rows.length,
      itcPer2b: signed.reduce(add, zero4), itcPerBooks: heads(itcPerBooks),
      inBooksNotIn2b: { count: missing.length, tax: missing.map((b) => h4(b)).reduce(add, zero4) },
      in2bNotInBooks: rows.filter((r) => !r.billId).length,
      queried: rows.filter((r) => r.decision === "queried").length, accepted: rows.filter((r) => r.decision === "accepted").length,
      notAvailableIn2b: rows.filter((r) => !r.itcAvailable).length,
    };
  }

  // Tax to pay: outward tax + tax under reverse charge. Credit: net ITC after reversals.
  const liability = add(add(heads(taxableOut), heads(zeroRated)), heads(rcmInward));
  // Reverse-charge tax must be paid in cash, so only the forward-charge liability is set off against credit.
  const setOff = gstSetOff(add(heads(taxableOut), heads(zeroRated)), credit);
  const interest = h4(manual.interest), lateFee = h4(manual.lateFee);
  const inward = {
    exemptInter: money(manual.exemptInwardInter || "0"), exemptIntra: money(manual.exemptInwardIntra || "0"),
    nonGstInter: money(manual.nonGstInwardInter || "0"), nonGstIntra: money(manual.nonGstInwardIntra || "0"),
  };

  // The portal's GSTR-3B JSON (tables 3.1, 3.2, 4, 5 and 5.1). Lines the books cannot know come from the manual entries.
  const [branch] = await tx.select().from(tables.branches).where(and(eq(tables.branches.companyId, company.id), eq(tables.branches.isHeadOffice, true)));
  const amt = (x: { igst: string; cgst: string; sgst: string; cess: string }) => ({ iamt: n(x.igst), camt: n(x.cgst), samt: n(x.sgst), csamt: n(x.cess) });
  const zero = { iamt: 0, camt: 0, samt: 0, csamt: 0 };
  const json = {
    gstin: branch?.gstin ?? null, ret_period: fp,
    sup_details: {
      osup_det: { txval: n(taxableOut.taxable), ...amt(taxableOut) },
      osup_zero: { txval: n(zeroRated.taxable), iamt: n(zeroRated.igst), csamt: n(zeroRated.cess) },
      osup_nil_exmp: { txval: n(nilRated.taxable) },
      isup_rev: { txval: n(rcmInward.taxable), ...amt(rcmInward) },
      osup_nongst: { txval: n(manual.nonGstOutward || "0") },
    },
    // Not yet checked against the current portal schema: 3.2, 5 and 5.1 keys follow the published GSTR-3B JSON names.
    inter_sup: { unreg_details: unregistered.map((u) => ({ pos: u.pos, txval: n(u.taxable), iamt: n(u.igst) })) },
    itc_elg: {
      itc_avl: [
        { ty: "IMPG", ...amt(importGoods) }, { ty: "IMPS", ...amt(importServices) }, { ty: "ISRC", ...amt(rcmInward) }, { ty: "ISD", ...amt(isdItc) }, { ty: "OTH", ...amt(add(itcAll, reclaimed)) },
      ],
      itc_rev: [{ ty: "RUL", ...amt(reversalRules) }, { ty: "OTH", ...amt(reversedOthers) }],
      itc_net: amt(credit),
      itc_inelg: [{ ty: "RUL", ...amt(ineligible.rules) }, { ty: "OTH", ...amt(ineligible.others) }],
    },
    inward_sup: {
      isup_details: [
        { ty: "GST", inter: n(inward.exemptInter), intra: n(inward.exemptIntra) },
        { ty: "NONGST", inter: n(inward.nonGstInter), intra: n(inward.nonGstIntra) },
      ],
    },
    intr_ltfee: { intr_details: amt(interest), ltfee_details: { camt: n(lateFee.cgst), samt: n(lateFee.sgst) } },
  };
  return {
    period: { fp, from, to },
    json,
    "3.1": { a_taxable: taxableOut, b_zeroRated: zeroRated, c_nilExempt: nilRated, d_inwardReverseCharge: rcmInward, e_nonGst: money(manual.nonGstOutward || "0") },
    "3.2": { unregistered },
    "4": {
      a1_importGoods: importGoods, a2_importServices: importServices, a3_reverseCharge: heads(rcmInward), a4_isd: isdItc,
      a5_allOther: heads(itcAll), a5_reclaimed: reclaimed,
      itcBasis: useStatement ? "2b" : "books", itcBasisNote: itcBasis === "2b" && !fromStatement ? "no_2b_import" : null,
      fromStatement: fromStatement ? { claim: fromStatement.claim, heldBack: fromStatement.heldBack, counts: fromStatement.counts } : null,
      available: itcAvailable, b1_reversedRules: reversalRules, b2_reversedOthers: reversedOthers, reversed: itcReversed,
      d_ineligible: ineligible, netItc: credit, shortfall,
    },
    "5": inward,
    "5.1": { interest, lateFee },
    comparison,
    liability,
    setOff: { ...setOff, reverseChargeCash: heads(rcmInward) },
  };
}

// ---- receivables and payables -------------------------------------------------------------------

/**
 * Outstanding by party with ageing. Payments and credit notes settle the oldest bills first (FIFO),
 * which is how most small businesses (and Tally's "on account") work without bill-by-bill matching.
 */
export async function outstanding(tx: Tx, companyId: string | undefined, kind: "receivable" | "payable", asOf: string, partyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const groupKey = kind === "receivable" ? "sundry_debtors" : "sundry_creditors";
  const sign = kind === "receivable" ? 1 : -1; // receivables are debit balances, payables credit
  const parties = await tx.execute<{ id: string; name: string; opening: string; phone: string | null }>(sql`
    select a.id, a.name, a.opening_balance as opening, a.phone from accounts a
    join account_groups g on g.id = a.group_id
    left join account_groups p on p.id = g.parent_id
    where a.company_id = ${company.id} and (g.key = ${groupKey} or p.key = ${groupKey})${partyId ? sql` and a.id = ${partyId}` : sql``}`);
  if (!parties.length) return { asOf, kind, rows: [], total: money(0) };
  const ids = sql.join([...parties].map((p) => sql`${p.id}::uuid`), sql`, `);
  const entries = await tx.execute<{ account_id: string; date: string; amount: string; number: string; due_on: string | null; voucher_id: string }>(sql`
    select e.account_id, e.date, (e.debit - e.credit) as amount, v.number, v.id as voucher_id,
           coalesce(si.due_on, pb.due_on) as due_on
    from gl_entries e
    join vouchers v on v.id = e.voucher_id and v.status = 'posted'
    left join sales_invoices si on si.voucher_id = v.id
    left join purchase_bills pb on pb.voucher_id = v.id
    where e.account_id in (${ids}) and not e.is_reversal and e.date <= ${asOf}::date
    order by e.date, e.id`);
  // Receipts and payments that name the bills they pay (bill-wise), by the voucher that made them.
  const allocRows = await tx.select({ voucherId: tables.billAllocations.voucherId, billVoucherId: tables.billAllocations.billVoucherId, amount: tables.billAllocations.amount })
    .from(tables.billAllocations).where(eq(tables.billAllocations.companyId, company.id));
  const allocs = new Map<string, { billVoucherId: string; amount: string }[]>();
  for (const a of allocRows) {
    const list = allocs.get(a.voucherId);
    if (list) list.push(a);
    else allocs.set(a.voucherId, [a]);
  }
  const byParty = new Map<string, typeof entries[number][]>();
  for (const e of entries) {
    const list = byParty.get(e.account_id);
    if (list) list.push(e);
    else byParty.set(e.account_id, [e]);
  }
  const day = (iso: string) => Date.parse(`${iso}T00:00:00Z`) / 86_400_000;
  const rows = [];
  for (const p of parties) {
    // Open items: bills (in the party's normal direction) queue up; settlements eat the oldest first.
    const open: { number: string; date: string; dueOn: string; amount: Dec; voucherId: string | null }[] = [];
    let unapplied = dec(0);
    const push = (number: string, date: string, dueOn: string, amt: Dec, voucherId: string | null = null) => {
      if (amt.gt(0)) {
        if (unapplied.gt(0)) {
          const used = unapplied.lt(amt) ? unapplied : amt;
          unapplied = unapplied.minus(used);
          amt = amt.minus(used);
        }
        if (amt.gt(0)) open.push({ number, date, dueOn, amount: amt, voucherId });
      } else {
        let credit = amt.neg();
        // Bill-wise first: the bills this voucher names take their share, the rest settles oldest first.
        for (const a of (voucherId ? allocs.get(voucherId) : undefined) ?? []) {
          const bill = open.find((o) => o.voucherId === a.billVoucherId);
          if (!bill) continue;
          const used = [dec(a.amount), bill.amount, credit].reduce((m, x) => (x.lt(m) ? x : m));
          bill.amount = bill.amount.minus(used);
          credit = credit.minus(used);
          if (bill.amount.isZero()) open.splice(open.indexOf(bill), 1);
        }
        while (credit.gt(0) && open.length) {
          const first = open[0]!;
          const used = first.amount.lt(credit) ? first.amount : credit;
          first.amount = first.amount.minus(used);
          credit = credit.minus(used);
          if (first.amount.isZero()) open.shift();
        }
        unapplied = unapplied.plus(credit);
      }
    };
    push("Opening", company.booksBeginOn, company.booksBeginOn, dec(p.opening).times(sign));
    for (const e of byParty.get(p.id) ?? []) push(e.number, String(e.date), String(e.due_on ?? e.date), dec(e.amount).times(sign), e.voucher_id);
    const balance = open.reduce((s, o) => s.plus(o.amount), dec(0)).minus(unapplied);
    if (balance.isZero()) continue;
    const buckets = { notDue: dec(0), d0_30: dec(0), d31_60: dec(0), d61_90: dec(0), d91_180: dec(0), d180plus: dec(0) };
    for (const o of open) {
      const overdue = day(asOf) - day(o.dueOn);
      const b = overdue <= 0 ? "notDue" : overdue <= 30 ? "d0_30" : overdue <= 60 ? "d31_60" : overdue <= 90 ? "d61_90" : overdue <= 180 ? "d91_180" : "d180plus";
      buckets[b] = buckets[b].plus(o.amount);
    }
    rows.push({
      partyId: p.id, name: p.name, phone: p.phone, balance: money(balance), advance: money(unapplied),
      buckets: Object.fromEntries(Object.entries(buckets).map(([k, v]) => [k, money(v)])),
      openItems: open.map((o) => ({ voucherId: o.voucherId, number: o.number, date: o.date, dueOn: o.dueOn, amount: money(o.amount), daysOverdue: Math.max(0, day(asOf) - day(o.dueOn)) })),
    });
  }
  rows.sort((a, b) => Number(b.balance) - Number(a.balance));
  return { asOf, kind, rows, total: money(rows.reduce((s, r) => s.plus(r.balance), dec(0))) };
}

/**
 * Interest on overdue receivables: each open bill past its due date earns simple interest at the
 * customer's rate (or the rate asked for) for the days it is late. A statement to send or to bill from.
 */
export async function overdueInterest(tx: Tx, companyId: string | undefined, asOf: string, defaultRate?: string) {
  const company = await resolveCompany(tx, companyId);
  const rec = await outstanding(tx, company.id, "receivable", asOf);
  const rates = await tx.execute<{ id: string; rate: string | null }>(sql`select id, interest_rate as rate from accounts where company_id = ${company.id} and interest_rate is not null`);
  const rateOf = new Map([...rates].map((r) => [r.id, r.rate]));
  const rows = [];
  for (const r of rec.rows) {
    const rate = rateOf.get(r.partyId) ?? defaultRate;
    if (!rate || !dec(rate).gt(0)) continue;
    const bills = r.openItems.filter((o) => o.daysOverdue > 0).map((o) => ({
      ...o, interest: money(dec(o.amount).times(rate).div(100).times(o.daysOverdue).div(365)),
    }));
    if (!bills.length) continue;
    rows.push({ partyId: r.partyId, name: r.name, phone: r.phone, rate: dec(rate).toFixed(2), overdue: money(bills.reduce((s, b) => s.plus(b.amount), dec(0))), interest: money(bills.reduce((s, b) => s.plus(b.interest), dec(0))), bills });
  }
  rows.sort((a, b) => Number(b.interest) - Number(a.interest));
  return { asOf, rows, total: money(rows.reduce((s, r) => s.plus(r.interest), dec(0))) };
}
