import { and, asc, desc, eq, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { businessDate, dec, money } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { outstanding } from "./returns.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

const MM = (period: string) => `${period.slice(5, 7)}${period.slice(0, 4)}`; // YYYY-MM to MMYYYY
const pad = (n: number) => String(n).padStart(2, "0");
const addMonths = (period: string, n: number) => {
  const d = new Date(Date.UTC(Number(period.slice(0, 4)), Number(period.slice(5, 7)) - 1 + n, 1));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
};
const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);

export async function gstWorkSettings(tx: Tx) {
  const company = await resolveCompany(tx);
  const [s] = await tx.select().from(tables.gstSettings).where(eq(tables.gstSettings.companyId, company.id));
  return { qrmp: s?.qrmp ?? false, einvoiceEnabled: s?.einvoiceEnabled ?? false, approvalRequired: s?.approvalRequired ?? false };
}

export async function setApprovalRequired(tx: Tx, actor: Actor, approvalRequired: boolean) {
  const company = await resolveCompany(tx);
  await tx.insert(tables.gstSettings).values({ companyId: company.id, tenantId: actor.tenantId, approvalRequired }).onConflictDoUpdate({ target: tables.gstSettings.companyId, set: { approvalRequired } });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "gst_settings", entityId: company.id, after: { approvalRequired }, ip: actor.ip });
}

export async function setQrmp(tx: Tx, actor: Actor, qrmp: boolean) {
  const company = await resolveCompany(tx);
  await tx.insert(tables.gstSettings).values({ companyId: company.id, tenantId: actor.tenantId, qrmp }).onConflictDoUpdate({ target: tables.gstSettings.companyId, set: { qrmp } });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "gst_settings", entityId: company.id, after: { qrmp }, ip: actor.ip });
}

// ---- filing calendar ------------------------------------------------------------------------------------

export interface CalendarItem { returnType: string; period: string; label: string; dueOn: string; status: "filed" | "uploaded" | "overdue" | "due" | "upcoming"; arn: string | null; daysLeft: number }

/**
 * The returns coming due, month by month, with where each one stands. GSTR-1 is due on the 11th (or the 13th after a quarter under the quarterly
 * scheme), GSTR-3B on the 20th (the 22nd under it) and the annual return on 31 December. Nothing shows as filed without an acknowledgement
 * number from a filing that went through.
 */
export async function filingCalendar(tx: Tx, today = businessDate(), months = 6) {
  const company = await resolveCompany(tx);
  const { qrmp } = await gstWorkSettings(tx);
  const filings = await tx.select().from(tables.gstFilings).where(eq(tables.gstFilings.companyId, company.id));
  const items: CalendarItem[] = [];
  const stateOf = (type: string, period: string, dueOn: string): Pick<CalendarItem, "status" | "arn" | "daysLeft"> => {
    const f = filings.find((x) => x.returnType === type && x.period === MM(period));
    const daysLeft = daysBetween(today, dueOn);
    if (f?.status === "filed" && f.arn) return { status: "filed", arn: f.arn, daysLeft };
    if (f?.status === "uploaded") return { status: daysLeft < 0 ? "overdue" : "uploaded", arn: null, daysLeft };
    return { status: daysLeft < 0 ? "overdue" : daysLeft <= 7 ? "due" : "upcoming", arn: null, daysLeft };
  };
  const thisMonth = today.slice(0, 7);
  // Returns for the months from three back (still open if unfiled) to the coming ones.
  for (let k = -3; k < months; k++) {
    const period = addMonths(thisMonth, k - 1); // return period; the due date falls in the next month
    const next = addMonths(period, 1);
    const quarterEnd = [3, 6, 9, 12].includes(Number(period.slice(5, 7)));
    if (!qrmp || quarterEnd) {
      const due = `${next}-${qrmp ? "13" : "11"}`;
      items.push({ returnType: "GSTR1", period, label: qrmp ? "GSTR-1 (quarter)" : "GSTR-1", dueOn: due, ...stateOf("GSTR1", period, due) });
    }
    const due3b = `${next}-${qrmp ? "22" : "20"}`;
    items.push({ returnType: "GSTR3B", period, label: "GSTR-3B", dueOn: due3b, ...stateOf("GSTR3B", period, due3b) });
  }
  // The annual return for the last finished financial year.
  const fyEnd = Number(today.slice(5, 7)) >= 4 ? Number(today.slice(0, 4)) : Number(today.slice(0, 4)) - 1;
  const annualDue = `${fyEnd}-12-31`;
  items.push({ returnType: "GSTR9", period: `${fyEnd - 1}-03`, label: `GSTR-9 (${fyEnd - 1}-${String(fyEnd).slice(2)})`, dueOn: annualDue, ...stateOf("GSTR9", `${fyEnd - 1}-03`, annualDue) });
  items.sort((a, b) => a.dueOn.localeCompare(b.dueOn) || a.label.localeCompare(b.label));
  return { today, qrmp, items, overdue: items.filter((i) => i.status === "overdue").length };
}

// ---- GSTR-2B ----------------------------------------------------------------------------------------------

const norm = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/^0+/, "");
const toIso = (d: string) => (/^\d{2}-\d{2}-\d{4}$/.test(d) ? `${d.slice(6)}-${d.slice(3, 5)}-${d.slice(0, 2)}` : d);
const num = (v: unknown) => (v === undefined || v === null || v === "" ? "0" : String(v));

interface RawItem { txval?: unknown; igst?: unknown; cgst?: unknown; sgst?: unknown; cess?: unknown }
interface RawDoc extends RawItem { inum?: string; ntnum?: string; typ?: string; dt?: string; items?: RawItem[]; itcavl?: string; rsn?: string }
interface Parsed { ctin: string; name: string | null; kind: "invoice" | "note"; docNo: string; docDate: string; taxable: string; igst: string; cgst: string; sgst: string; cess: string; itc: boolean; reason: string | null; filed1?: boolean | null; filed3b?: boolean | null }

/** A document's amounts: the portal's newer files carry them per rate in `items`, older ones on the document itself. */
function amountsOf(d: RawDoc) {
  const parts: RawItem[] = Array.isArray(d.items) && d.items.length ? d.items : [d];
  const sum = (k: keyof RawItem) => parts.reduce((t, x) => t.plus(num(x[k])), dec(0)).toFixed(2);
  return { taxable: sum("txval"), igst: sum("igst"), cgst: sum("cgst"), sgst: sum("sgst"), cess: sum("cess") };
}

/**
 * Reads a GSTR-2B JSON as downloaded from the portal: B2B invoices and their amendments, credit and debit notes, and ISD credit, with whether the credit is
 * available. A debit note from a supplier adds to the credit like an invoice, a credit note takes it away. Imports of goods (bills of entry) carry no
 * supplier GSTIN, so they are counted and totalled, not matched to bills. `reported` is the portal's own ITC summary when the file has one, so the parsed
 * totals can be checked against it. Written from the portal's published layout; run against sample files, not yet against one downloaded by the business.
 */
export function parse2B(json: unknown): {
  period: string | null; gstin: string | null; docs: Parsed[];
  imports: { count: number; igst: string; cess: string };
  reported: { igst: string; cgst: string; sgst: string; cess: string } | null;
} {
  const root = (json as { data?: Record<string, unknown> })?.data ?? (json as Record<string, unknown>);
  if (!root || typeof root !== "object") throw badRequest("not_a_gstr2b");
  const doc = (root.docdata as Record<string, unknown> | undefined) ?? root;
  if (!doc.b2b && !doc.cdnr && !doc.b2ba && !doc.cdnra && !doc.isd && !doc.impg) throw badRequest("not_a_gstr2b");
  const docs: Parsed[] = [];
  const read = (list: unknown, key: "inv" | "nt", amended = false) => {
    for (const sup of (Array.isArray(list) ? list : []) as { ctin?: string; trdnm?: string; inv?: RawDoc[]; nt?: RawDoc[] }[]) {
      if (!sup.ctin) continue;
      for (const d of (sup[key] ?? []) as RawDoc[]) {
        const no = d.inum ?? d.ntnum;
        if (!no || !d.dt) continue;
        const isNote = key === "nt";
        const debit = isNote && String(d.typ ?? "").toUpperCase().startsWith("D");
        const reason = d.rsn || (debit ? "Debit note" : amended ? "Amended document" : null);
        docs.push({ ctin: sup.ctin.toUpperCase(), name: sup.trdnm ?? null, kind: isNote && !debit ? "note" : "invoice", docNo: no, docDate: toIso(d.dt), ...amountsOf(d), itc: (d.itcavl ?? "Y") !== "N", reason });
      }
    }
  };
  read(doc.b2b, "inv"); read(doc.b2ba, "inv", true);
  read(doc.cdnr, "nt"); read(doc.cdnra, "nt", true);
  // Credit passed on by an Input Service Distributor.
  for (const sup of (Array.isArray(doc.isd) ? doc.isd : []) as { ctin?: string; trdnm?: string; doclist?: { docnum?: string; docdt?: string; doctyp?: string; itcelg?: string; igst?: unknown; cgst?: unknown; sgst?: unknown; cess?: unknown }[] }[]) {
    if (!sup.ctin) continue;
    for (const d of sup.doclist ?? []) {
      if (!d.docnum || !d.docdt) continue;
      const credit = String(d.doctyp ?? "").toUpperCase().startsWith("C");
      docs.push({ ctin: sup.ctin.toUpperCase(), name: sup.trdnm ?? null, kind: credit ? "note" : "invoice", docNo: d.docnum, docDate: toIso(d.docdt), taxable: "0.00", igst: dec(num(d.igst)).toFixed(2), cgst: dec(num(d.cgst)).toFixed(2), sgst: dec(num(d.sgst)).toFixed(2), cess: dec(num(d.cess)).toFixed(2), itc: (d.itcelg ?? "Y") !== "N", reason: "ISD credit" });
    }
  }
  const boe = (Array.isArray(doc.impg) ? doc.impg : []) as { iamt?: unknown; csamt?: unknown }[];
  const imports = { count: boe.length, igst: boe.reduce((t, x) => t.plus(num(x.iamt)), dec(0)).toFixed(2), cess: boe.reduce((t, x) => t.plus(num(x.csamt)), dec(0)).toFixed(2) };
  // The portal's own total of credit available, when the file carries one.
  const nonrev = ((root.itcsumm as { itcavl?: { nonrevsup?: { igst?: unknown; cgst?: unknown; sgst?: unknown; cess?: unknown } } } | undefined)?.itcavl?.nonrevsup);
  const reported = nonrev ? { igst: dec(num(nonrev.igst)).toFixed(2), cgst: dec(num(nonrev.cgst)).toFixed(2), sgst: dec(num(nonrev.sgst)).toFixed(2), cess: dec(num(nonrev.cess)).toFixed(2) } : null;
  const rtnprd = (root.rtnprd as string | undefined) ?? null;
  return { period: rtnprd && /^\d{6}$/.test(rtnprd) ? rtnprd : null, gstin: (root.gstin as string | undefined) ?? null, docs, imports, reported };
}

interface Raw2AItem { itm_det?: { txval?: unknown; iamt?: unknown; camt?: unknown; samt?: unknown; csamt?: unknown } }
interface Raw2ADoc { inum?: string; idt?: string; nt_num?: string; nt_dt?: string; ntty?: string; itms?: Raw2AItem[] }

/**
 * Reads a GSTR-2A JSON as downloaded from the portal. Unlike 2B it is live: it lists what each supplier has filed so far, and says per supplier
 * whether their GSTR-1 (cfs) and GSTR-3B (cfs3b) have been filed, which is what Rule 37A turns on.
 */
export function parse2A(json: unknown): { period: string | null; gstin: string | null; docs: Parsed[] } {
  const root = (json as { data?: Record<string, unknown> })?.data ?? (json as Record<string, unknown>);
  if (!root || typeof root !== "object") throw badRequest("not_a_gstr2a");
  const docs: Parsed[] = [];
  const yes = (v: unknown) => (v === undefined || v === null || v === "" ? null : String(v).toUpperCase() === "Y");
  const sum = (items: Raw2AItem[] | undefined, k: "txval" | "iamt" | "camt" | "samt" | "csamt") => (items ?? []).reduce((t, i) => t.plus(num(i.itm_det?.[k])), dec(0)).toFixed(2);
  const read = (list: unknown, kind: Parsed["kind"], key: "inv" | "nt") => {
    for (const sup of (Array.isArray(list) ? list : []) as { ctin?: string; trdnm?: string; cfs?: string; cfs3b?: string; inv?: Raw2ADoc[]; nt?: Raw2ADoc[] }[]) {
      if (!sup.ctin) continue;
      for (const d of (sup[key] ?? []) as Raw2ADoc[]) {
        const no = d.inum ?? d.nt_num;
        const dt = d.idt ?? d.nt_dt;
        if (!no || !dt) continue;
        docs.push({ ctin: sup.ctin.toUpperCase(), name: sup.trdnm ?? null, kind, docNo: no, docDate: toIso(dt), taxable: sum(d.itms, "txval"), igst: sum(d.itms, "iamt"), cgst: sum(d.itms, "camt"), sgst: sum(d.itms, "samt"), cess: sum(d.itms, "csamt"), itc: true, reason: null, filed1: yes(sup.cfs), filed3b: yes(sup.cfs3b) });
      }
    }
  };
  read(root.b2b, "invoice", "inv");
  read(root.cdn, "note", "nt");
  const fp = (root.fp as string | undefined) ?? (root.rtnprd as string | undefined) ?? null;
  return { period: fp && /^\d{6}$/.test(fp) ? fp : null, gstin: (root.gstin as string | undefined) ?? null, docs };
}

const TOL = dec("1");

/** Loads a statement for a return period (replacing an earlier load), then matches every row to a purchase bill by supplier GSTIN and invoice number. */
export async function import2B(tx: Tx, actor: Actor, json: unknown, periodOverride?: string | undefined, source: "2b" | "2a" = "2b") {
  const company = await resolveCompany(tx);
  const parsed = source === "2a" ? parse2A(json) : parse2B(json);
  const period = periodOverride ?? parsed.period;
  if (!period || !/^\d{6}$/.test(period)) throw badRequest("period_required");
  if (!parsed.docs.length) throw badRequest("empty_statement");
  await tx.delete(tables.gstr2bImports).where(and(eq(tables.gstr2bImports.companyId, company.id), eq(tables.gstr2bImports.period, period), eq(tables.gstr2bImports.source, source)));
  const [imp] = await tx.insert(tables.gstr2bImports).values({ tenantId: actor.tenantId, companyId: company.id, period, gstin: parsed.gstin, rows: parsed.docs.length, source, importedBy: actor.userId }).returning();
  await tx.insert(tables.gstr2bRows).values(parsed.docs.map((d) => ({
    tenantId: actor.tenantId, importId: imp!.id, ctin: d.ctin, supplierName: d.name, kind: d.kind, docNo: d.docNo.slice(0, 40), docDate: d.docDate, taxable: money(d.taxable), igst: money(d.igst), cgst: money(d.cgst),
    sgst: money(d.sgst), cess: money(d.cess), itcAvailable: d.itc, reason: d.reason?.slice(0, 120) ?? null, supplierFiled1: d.filed1 ?? null, supplierFiled3b: d.filed3b ?? null,
  })));
  const summary = await rematch(tx, imp!.id);
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "gstr2b_import", entityId: imp!.id, after: { source, period, rows: parsed.docs.length, ...summary }, ip: actor.ip });
  // For a 2B file: bills of entry (imports of goods) found but not matched to bills, and the file's own total of credit against what was read.
  const extra = source === "2b" ? (() => {
    const p = parsed as ReturnType<typeof parse2B>;
    const read = { igst: dec(0), cgst: dec(0), sgst: dec(0), cess: dec(0) };
    for (const d of p.docs.filter((x) => x.itc)) {
      const sg = d.kind === "invoice" ? 1 : -1;
      for (const k of ["igst", "cgst", "sgst", "cess"] as const) read[k] = read[k].plus(dec(d[k]).times(sg));
    }
    const readStr = Object.fromEntries(Object.entries(read).map(([k, v]) => [k, v.toFixed(2)])) as Record<"igst" | "cgst" | "sgst" | "cess", string>;
    const agrees = p.reported ? (["igst", "cgst", "sgst", "cess"] as const).every((k) => dec(readStr[k]).minus(p.reported![k]).abs().lte(TOL)) : null;
    return { importsOfGoods: p.imports, creditRead: readStr, creditReportedByPortal: p.reported, agreesWithPortalTotal: agrees };
  })() : {};
  return { importId: imp!.id, period, ...summary, ...extra };
}

/** Matches each statement row to a bill: same supplier GSTIN and the same invoice number once punctuation and leading zeros are ignored. */
async function rematch(tx: Tx, importId: string) {
  const company = await resolveCompany(tx);
  const rows = await tx.select().from(tables.gstr2bRows).where(eq(tables.gstr2bRows.importId, importId));
  const bills = await tx.select({ b: tables.purchaseBills, gstin: tables.accounts.gstin }).from(tables.purchaseBills)
    .innerJoin(tables.accounts, eq(tables.accounts.id, tables.purchaseBills.supplierId)).where(and(eq(tables.purchaseBills.companyId, company.id), eq(tables.purchaseBills.status, "posted")));
  const byKey = new Map(bills.filter((x) => x.gstin).map((x) => [`${x.gstin}|${norm(x.b.supplierInvoiceNo)}`, x.b]));
  let matched = 0; let diffs = 0; let unmatched = 0;
  for (const r of rows) {
    const bill = byKey.get(`${r.ctin}|${norm(r.docNo)}`);
    if (!bill) {
      await tx.update(tables.gstr2bRows).set({ billId: null, match: "unmatched", diff: null }).where(eq(tables.gstr2bRows.id, r.id));
      unmatched += 1;
      continue;
    }
    const d: Record<string, string> = {};
    for (const f of ["taxable", "igst", "cgst", "sgst", "cess"] as const) {
      const delta = dec(r[f]).minus(bill[f]);
      if (delta.abs().gt(TOL)) d[f] = money(delta);
    }
    const ok = Object.keys(d).length === 0;
    await tx.update(tables.gstr2bRows).set({ billId: bill.id, match: ok ? "matched" : "amount_diff", diff: ok ? null : d }).where(eq(tables.gstr2bRows.id, r.id));
    if (ok) matched += 1; else diffs += 1;
  }
  return { matched, amountDiff: diffs, unmatched };
}

export async function list2BImports(tx: Tx, source: "2b" | "2a" = "2b") {
  const company = await resolveCompany(tx);
  return tx.select().from(tables.gstr2bImports).where(and(eq(tables.gstr2bImports.companyId, company.id), eq(tables.gstr2bImports.source, source))).orderBy(desc(tables.gstr2bImports.importedAt));
}

/**
 * The reconciliation for a period: statement rows against the books (matched, different amounts, in the statement but not booked), the bills
 * booked for the month that the statement does not show (credit at risk), and the credit the statement itself marks as not available.
 */
export async function reconcile2B(tx: Tx, period: string, source: "2b" | "2a" = "2b") {
  const company = await resolveCompany(tx);
  const [imp] = await tx.select().from(tables.gstr2bImports).where(and(eq(tables.gstr2bImports.companyId, company.id), eq(tables.gstr2bImports.period, period), eq(tables.gstr2bImports.source, source)));
  if (!imp) throw notFound("no_statement");
  const rows = await tx.select().from(tables.gstr2bRows).where(eq(tables.gstr2bRows.importId, imp.id)).orderBy(asc(tables.gstr2bRows.ctin), asc(tables.gstr2bRows.docDate));
  const taxOf = (r: { igst: string; cgst: string; sgst: string; cess: string }) => dec(r.igst).plus(r.cgst).plus(r.sgst).plus(r.cess);
  const seen = new Set(rows.map((r) => r.billId).filter(Boolean));
  const start = `${period.slice(2)}-${period.slice(0, 2)}-01`;
  const end = new Date(Date.UTC(Number(period.slice(2)), Number(period.slice(0, 2)), 0)).toISOString().slice(0, 10);
  const booked = await tx.select({ b: tables.purchaseBills, name: tables.accounts.name, gstin: tables.accounts.gstin }).from(tables.purchaseBills)
    .innerJoin(tables.accounts, eq(tables.accounts.id, tables.purchaseBills.supplierId))
    .where(and(eq(tables.purchaseBills.companyId, company.id), eq(tables.purchaseBills.status, "posted"), sql`${tables.purchaseBills.date} between ${start}::date and ${end}::date`));
  const missing = booked.filter((x) => x.gstin && !seen.has(x.b.id) && !x.b.reverseCharge && taxOf(x.b).gt(0));
  const row = (r: (typeof rows)[number]) => ({ id: r.id, ctin: r.ctin, supplier: r.supplierName, kind: r.kind, docNo: r.docNo, docDate: r.docDate, taxable: r.taxable, tax: money(taxOf(r)), itcAvailable: r.itcAvailable, reason: r.reason, match: r.match, diff: r.diff, decision: r.decision, decisionNote: r.decisionNote });
  const claimable = rows.filter((r) => r.itcAvailable && r.match === "matched").reduce((t, r) => t.plus(taxOf(r)), dec(0));
  return {
    period, importedAt: imp.importedAt.toISOString(),
    totals: {
      statementRows: rows.length, matched: rows.filter((r) => r.match === "matched").length, amountDiff: rows.filter((r) => r.match === "amount_diff").length,
      notBooked: rows.filter((r) => r.match === "unmatched").length, notInStatement: missing.length,
      creditClaimable: money(claimable), creditNotAvailable: money(rows.filter((r) => !r.itcAvailable).reduce((t, r) => t.plus(taxOf(r)), dec(0))),
      creditAtRisk: money(missing.reduce((t, x) => t.plus(taxOf(x.b)), dec(0))),
    },
    exceptions: rows.filter((r) => r.match !== "matched").map(row),
    ineligible: rows.filter((r) => !r.itcAvailable).map(row),
    notInStatement: missing.map((x) => ({ billId: x.b.id, number: x.b.number, supplier: x.name, gstin: x.gstin, invoiceNo: x.b.supplierInvoiceNo, date: x.b.date, tax: money(taxOf(x.b)) })),
  };
}

/** Records what was decided about a statement row that does not match: accepted as it is, or queried with the supplier. */
export async function decide2B(tx: Tx, actor: Actor, rowId: string, decision: "accepted" | "queried", note: string) {
  if (!note.trim()) throw badRequest("note_required");
  const [r] = await tx.update(tables.gstr2bRows).set({ decision, decisionNote: note.trim(), decidedBy: actor.userId }).where(eq(tables.gstr2bRows.id, rowId)).returning();
  if (!r) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "gstr2b_row", entityId: rowId, after: { decision, doc: r.docNo, note: note.trim() }, ip: actor.ip });
}

// ---- e-invoice reporting window and Rule 37 -------------------------------------------------------------

/**
 * Invoices that should have an e-invoice but do not yet. A business with turnover over Rs 10 crore must report within 30 days of the invoice
 * date, after which the invoice cannot be reported at all, so the list is sorted by days left.
 */
export async function einvoiceAlerts(tx: Tx, today = businessDate()) {
  const company = await resolveCompany(tx);
  const { einvoiceEnabled } = await gstWorkSettings(tx);
  if (!einvoiceEnabled) return { enabled: false, items: [] as { number: string; date: string; customer: string; status: string; daysLeft: number; total: string }[], expired: 0 };
  const rows = await tx.select({ si: tables.salesInvoices, customer: tables.accounts.name }).from(tables.salesInvoices).innerJoin(tables.accounts, eq(tables.accounts.id, tables.salesInvoices.customerId))
    .where(and(eq(tables.salesInvoices.companyId, company.id), eq(tables.salesInvoices.status, "posted"), sql`${tables.salesInvoices.einvoiceStatus} in ('pending', 'failed')`)).orderBy(asc(tables.salesInvoices.date));
  const items = rows.map((r) => ({ number: r.si.number, date: r.si.date, customer: r.customer, status: r.si.einvoiceStatus, daysLeft: 30 - daysBetween(r.si.date, today), total: r.si.total }));
  return { enabled: true, items, expired: items.filter((i) => i.daysLeft < 0).length };
}

/**
 * Rule 37: credit taken on a purchase must be paid back with interest if the supplier is not paid within 180 days of the invoice date.
 * Lists bills still unpaid past 120 days (a warning) and past 180 days (reversal due), with the tax on the unpaid part.
 */
export async function rule37(tx: Tx, asOf = businessDate()) {
  const company = await resolveCompany(tx);
  const open = await outstanding(tx, company.id, "payable", asOf);
  const bills = await tx.select({ b: tables.purchaseBills, name: tables.accounts.name }).from(tables.purchaseBills).innerJoin(tables.accounts, eq(tables.accounts.id, tables.purchaseBills.supplierId))
    .where(and(eq(tables.purchaseBills.companyId, company.id), eq(tables.purchaseBills.status, "posted")));
  const byNumber = new Map(bills.map((x) => [x.b.number, x]));
  const out: { billId: string; number: string; supplier: string; invoiceDate: string; ageDays: number; unpaid: string; creditAtStake: string; state: "reverse" | "warning" }[] = [];
  for (const party of open.rows) {
    for (const o of party.openItems) {
      const bill = byNumber.get(o.number);
      if (!bill || bill.b.reverseCharge) continue;
      const tax = dec(bill.b.igst).plus(bill.b.cgst).plus(bill.b.sgst).plus(bill.b.utgst).plus(bill.b.cess);
      if (!tax.gt(0) || !dec(bill.b.total).gt(0)) continue;
      const age = daysBetween(bill.b.supplierInvoiceDate, asOf);
      if (age <= 120) continue;
      out.push({ billId: bill.b.id, number: bill.b.number, supplier: bill.name, invoiceDate: bill.b.supplierInvoiceDate, ageDays: age, unpaid: money(o.amount), creditAtStake: money(tax.times(o.amount).div(bill.b.total)), state: age > 180 ? "reverse" : "warning" });
    }
  }
  out.sort((a, b) => b.ageDays - a.ageDays);
  return { asOf, items: out, reverseTotal: money(out.filter((x) => x.state === "reverse").reduce((t, x) => t.plus(x.creditAtStake), dec(0))) };
}

// ---- GSTR-2A against the books and against 2B ------------------------------------------------------------

/**
 * A period's 2A beside its 2B: documents suppliers have reported that the fixed statement does not show yet (they will usually come in a later
 * month's 2B), documents in 2B that 2A lacks, differing amounts, and the suppliers whose GSTR-3B is not filed, where the credit is at risk.
 */
export async function compare2Ato2B(tx: Tx, period: string) {
  const company = await resolveCompany(tx);
  const load = async (source: "2a" | "2b") => {
    const [imp] = await tx.select().from(tables.gstr2bImports).where(and(eq(tables.gstr2bImports.companyId, company.id), eq(tables.gstr2bImports.period, period), eq(tables.gstr2bImports.source, source)));
    if (!imp) throw notFound(source === "2a" ? "no_statement_2a" : "no_statement");
    return tx.select().from(tables.gstr2bRows).where(eq(tables.gstr2bRows.importId, imp.id));
  };
  const a = await load("2a");
  const b = await load("2b");
  const key = (r: { ctin: string; docNo: string }) => `${r.ctin}|${norm(r.docNo)}`;
  const bMap = new Map(b.map((r) => [key(r), r]));
  const aMap = new Map(a.map((r) => [key(r), r]));
  const tax = (r: { igst: string; cgst: string; sgst: string; cess: string }) => dec(r.igst).plus(r.cgst).plus(r.sgst).plus(r.cess);
  const pick = (r: (typeof a)[number]) => ({ ctin: r.ctin, supplier: r.supplierName, docNo: r.docNo, docDate: r.docDate, taxable: r.taxable, tax: money(tax(r)) });
  const onlyIn2A = a.filter((r) => !bMap.has(key(r)));
  const onlyIn2B = b.filter((r) => !aMap.has(key(r)));
  const differ = a.filter((r) => { const o = bMap.get(key(r)); return o && (dec(o.taxable).minus(r.taxable).abs().gt(TOL) || tax(o).minus(tax(r)).abs().gt(TOL)); })
    .map((r) => ({ ...pick(r), tax2B: money(tax(bMap.get(key(r))!)) }));
  const notFiled = new Map<string, { ctin: string; supplier: string | null; docs: number; tax: ReturnType<typeof dec> }>();
  for (const r of a.filter((x) => x.supplierFiled3b === false)) {
    const cur = notFiled.get(r.ctin) ?? { ctin: r.ctin, supplier: r.supplierName, docs: 0, tax: dec(0) };
    cur.docs += 1; cur.tax = cur.tax.plus(tax(r));
    notFiled.set(r.ctin, cur);
  }
  return {
    period,
    totals: { in2A: a.length, in2B: b.length, onlyIn2A: onlyIn2A.length, onlyIn2B: onlyIn2B.length, amountDiff: differ.length, suppliersNotFiled3b: notFiled.size },
    onlyIn2A: onlyIn2A.map(pick), onlyIn2B: onlyIn2B.map(pick), amountDiff: differ,
    suppliersNotFiled3b: [...notFiled.values()].map((x) => ({ ctin: x.ctin, supplier: x.supplier, docs: x.docs, tax: money(x.tax) })),
  };
}

// ---- Rule 37A and recording reversals -------------------------------------------------------------------

/**
 * Rule 37A: credit taken on a financial year's purchases is given back if the supplier had still not paid the tax (filed GSTR-3B) by 30 September
 * after the year ends, and may be taken again once they do. Read from 2A: a bill whose supplier is shown as not filed, or that 2A never shows,
 * is a candidate. Before the cut-off date they are a watch list; after it they are due. Bills already reversed are marked.
 */
export async function rule37A(tx: Tx, fyStart: number, asOf = businessDate()) {
  const company = await resolveCompany(tx);
  const from = `${fyStart}-04-01`, to = `${fyStart + 1}-03-31`;
  const cutoff = `${fyStart + 1}-09-30`;
  const bills = await tx.select({ b: tables.purchaseBills, name: tables.accounts.name, gstin: tables.accounts.gstin }).from(tables.purchaseBills)
    .innerJoin(tables.accounts, eq(tables.accounts.id, tables.purchaseBills.supplierId))
    .where(and(eq(tables.purchaseBills.companyId, company.id), eq(tables.purchaseBills.status, "posted"), sql`${tables.purchaseBills.date} between ${from}::date and ${to}::date`));
  const rows = await tx.select({ r: tables.gstr2bRows }).from(tables.gstr2bRows).innerJoin(tables.gstr2bImports, eq(tables.gstr2bImports.id, tables.gstr2bRows.importId))
    .where(and(eq(tables.gstr2bImports.companyId, company.id), eq(tables.gstr2bImports.source, "2a")));
  const byBill = new Map<string, boolean | null>();
  for (const { r } of rows) {
    if (!r.billId || r.supplierFiled3b === null) continue;
    byBill.set(r.billId, (byBill.get(r.billId) ?? false) || r.supplierFiled3b);
  }
  const reversals = await tx.select().from(tables.itcReversals).where(and(eq(tables.itcReversals.companyId, company.id), eq(tables.itcReversals.rule, "37A")));
  const done = new Map(reversals.map((x) => [x.billId, x]));
  const items = [];
  for (const x of bills) {
    const tax = dec(x.b.igst).plus(x.b.cgst).plus(x.b.sgst).plus(x.b.utgst).plus(x.b.cess);
    if (!x.gstin || x.b.reverseCharge || !tax.gt(0)) continue;
    const filed = byBill.get(x.b.id);
    if (filed === true && !done.has(x.b.id)) continue;
    const rev = done.get(x.b.id);
    items.push({
      billId: x.b.id, number: x.b.number, supplier: x.name, gstin: x.gstin, invoiceNo: x.b.supplierInvoiceNo, date: x.b.date, tax: money(tax),
      heads: { igst: x.b.igst, cgst: x.b.cgst, sgst: x.b.sgst, cess: x.b.cess },
      supplierStatus: filed === undefined ? "not_in_2a" : filed ? "filed" : "not_filed",
      reversed: rev ? { id: rev.id, on: rev.reversedOn, reclaimedOn: rev.reclaimedOn } : null,
    });
  }
  const pending = items.filter((i) => !i.reversed && i.supplierStatus !== "filed");
  return {
    fy: `${fyStart}-${String(fyStart + 1).slice(2)}`, cutoff, due: asOf > cutoff, items,
    totals: { atRisk: money(pending.reduce((t, i) => t.plus(i.tax), dec(0))), reversed: money(items.filter((i) => i.reversed && !i.reversed.reclaimedOn).reduce((t, i) => t.plus(i.tax), dec(0))) },
  };
}

/** Records credit given back for a bill and posts it (a GST journal from input credit to the chosen expense account), once per bill and rule. */
export async function reverseItc(tx: Tx, actor: Actor, input: { rule: "37" | "37A"; billId: string; date: string; counterAccountId: string; note?: string | null | undefined }) {
  const company = await resolveCompany(tx);
  const [bill] = await tx.select().from(tables.purchaseBills).where(and(eq(tables.purchaseBills.id, input.billId), eq(tables.purchaseBills.companyId, company.id)));
  if (!bill) throw notFound();
  const [exists] = await tx.select({ id: tables.itcReversals.id }).from(tables.itcReversals).where(and(eq(tables.itcReversals.billId, bill.id), eq(tables.itcReversals.rule, input.rule)));
  if (exists) throw conflict("already_reversed");
  const heads = { igst: bill.igst, cgst: bill.cgst, sgst: dec(bill.sgst).plus(bill.utgst).toFixed(2), cess: bill.cess };
  const { postGstJv } = await import("./gstjv.js");
  const amounts: Record<string, string> = {};
  for (const [k, v] of Object.entries(heads)) if (dec(v).gt(0)) amounts[k] = v;
  if (!Object.keys(amounts).length) throw badRequest("no_tax_to_reverse");
  const { voucher } = await postGstJv(tx, actor, { kind: "itc_reverse", date: input.date, amounts, counterAccountId: input.counterAccountId, narration: `Rule ${input.rule} reversal for ${bill.number}` });
  const [row] = await tx.insert(tables.itcReversals).values({
    tenantId: actor.tenantId, companyId: company.id, rule: input.rule, billId: bill.id, igst: heads.igst, cgst: heads.cgst, sgst: heads.sgst, cess: heads.cess,
    reversedOn: input.date, voucherId: voucher.id, note: input.note ?? null, createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "itc_reversal", entityId: row!.id, after: { rule: input.rule, bill: bill.number }, ip: actor.ip });
  return row!;
}

/** The supplier has paid: credit taken back is claimed again with a second GST journal. */
export async function reclaimItc(tx: Tx, actor: Actor, id: string, input: { date: string; counterAccountId: string }) {
  const [r] = await tx.select().from(tables.itcReversals).where(eq(tables.itcReversals.id, id)).for("update");
  if (!r) throw notFound();
  if (r.reclaimedOn) throw conflict("already_reclaimed");
  const { postGstJv } = await import("./gstjv.js");
  const amounts: Record<string, string> = {};
  for (const k of ["igst", "cgst", "sgst", "cess"] as const) if (dec(r[k]).gt(0)) amounts[k] = r[k];
  const { voucher } = await postGstJv(tx, actor, { kind: "itc_claim", date: input.date, amounts, counterAccountId: input.counterAccountId, narration: "Credit claimed again after the supplier paid" });
  await tx.update(tables.itcReversals).set({ reclaimedOn: input.date, reclaimVoucherId: voucher.id }).where(eq(tables.itcReversals.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "itc_reversal", entityId: id, after: { reclaimedOn: input.date }, ip: actor.ip });
}

export async function listItcReversals(tx: Tx) {
  const company = await resolveCompany(tx);
  return tx.select({ r: tables.itcReversals, number: tables.purchaseBills.number }).from(tables.itcReversals).innerJoin(tables.purchaseBills, eq(tables.purchaseBills.id, tables.itcReversals.billId))
    .where(eq(tables.itcReversals.companyId, company.id)).orderBy(desc(tables.itcReversals.reversedOn)).then((rows) => rows.map((x) => ({ ...x.r, billNumber: x.number })));
}
