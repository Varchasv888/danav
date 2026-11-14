import { and, asc, eq } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { amendmentProblems, cleanCompareFigures, compare3b, money, dec, type AmendmentLine, type CompareFigures, type CompareLine, type ItcHeads } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { gstr3b } from "./returns.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

// ---- GSTR-1 amendments ---------------------------------------------------------------------------

export interface AmendmentBody {
  kind: "b2b" | "cdn" | "b2cs"; period: string; ctin?: string | null | undefined; originalNumber?: string | null | undefined; originalDate?: string | null | undefined;
  originalPeriod?: string | null | undefined; number?: string | null | undefined; docDate?: string | null | undefined; noteType?: string | null | undefined;
  pos: string; intra: boolean; reverseCharge?: boolean | undefined; invoiceType?: string | null | undefined; value?: string | undefined; lines: AmendmentLine[]; reason: string; companyId?: string | undefined;
}

export async function listAmendments(tx: Tx, period: string, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  return tx.select().from(tables.gstr1Amendments).where(and(eq(tables.gstr1Amendments.companyId, company.id), eq(tables.gstr1Amendments.period, period)))
    .orderBy(asc(tables.gstr1Amendments.createdAt));
}

/** Records a correction to an earlier return's supply, to be reported in `period`. Refused with the first problem found. */
export async function addAmendment(tx: Tx, actor: Actor, b: AmendmentBody) {
  const problems = amendmentProblems(b);
  if (problems.length) throw badRequest(problems[0]!);
  const company = await resolveCompany(tx, b.companyId);
  const value = b.value && dec(b.value).gt(0) ? money(b.value) : money(b.lines.reduce((s, l) => s.plus(l.taxable).plus(l.igst).plus(l.cgst).plus(l.sgst).plus(l.cess), dec(0)));
  const [row] = await tx.insert(tables.gstr1Amendments).values({
    tenantId: actor.tenantId, companyId: company.id, period: b.period, kind: b.kind, ctin: b.kind === "b2cs" ? null : b.ctin!.toUpperCase(),
    originalNumber: b.originalNumber?.trim() || null, originalDate: b.originalDate || null, originalPeriod: b.originalPeriod || null,
    number: b.number?.trim() || null, docDate: b.docDate || null, noteType: b.kind === "cdn" ? b.noteType! : null,
    pos: b.pos, intra: b.intra, reverseCharge: !!b.reverseCharge, invoiceType: b.kind === "b2cs" ? null : (b.invoiceType || "R"), value,
    lines: b.lines.map((l) => ({ rate: String(Number(l.rate)), taxable: money(l.taxable), igst: money(l.igst), cgst: money(l.cgst), sgst: money(l.sgst), cess: money(l.cess) })),
    reason: b.reason.trim(), createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "gstr1_amendment", entityId: row!.id, after: { kind: b.kind, period: b.period, original: b.originalNumber ?? b.originalPeriod, reason: b.reason }, ip: actor.ip });
  return row!;
}

export async function deleteAmendment(tx: Tx, actor: Actor, id: string) {
  const [row] = await tx.select().from(tables.gstr1Amendments).where(eq(tables.gstr1Amendments.id, id));
  if (!row) throw notFound();
  // A filed return must not change: once its workpaper is filed the amendment stays as filed.
  const [wp] = await tx.select({ status: tables.gstWorkpapers.status }).from(tables.gstWorkpapers).where(and(
    eq(tables.gstWorkpapers.companyId, row.companyId), eq(tables.gstWorkpapers.returnType, "GSTR1"), eq(tables.gstWorkpapers.period, row.period)));
  if (wp?.status === "filed") throw conflict("workpaper_filed_reopen_first");
  await tx.delete(tables.gstr1Amendments).where(eq(tables.gstr1Amendments.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "delete", entity: "gstr1_amendment", entityId: id, after: { period: row.period }, ip: actor.ip });
}

// ---- GSTR-3B side by side -------------------------------------------------------------------------

/** The ERP's figures for the five compared lines, the portal and final figures typed in, and the differences. */
export async function threeBCompare(tx: Tx, period: string, basis: "books" | "2b", companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const [wp] = await tx.select({ manual: tables.gstWorkpapers.manual }).from(tables.gstWorkpapers).where(and(
    eq(tables.gstWorkpapers.companyId, company.id), eq(tables.gstWorkpapers.returnType, "GSTR3B"), eq(tables.gstWorkpapers.period, period)));
  const r = await gstr3b(tx, company.id, period, (wp?.manual ?? {}) as Parameters<typeof gstr3b>[3], basis);
  const heads = (x: { igst: string; cgst: string; sgst: string; cess: string }): ItcHeads => ({ igst: money(x.igst), cgst: money(x.cgst), sgst: money(x.sgst), cess: money(x.cess) });
  const cash = Object.fromEntries((["igst", "cgst", "sgst", "cess"] as const).map((h) => [h, money(dec(r.setOff.cashPayable[h]).plus(r.setOff.reverseChargeCash[h]))])) as unknown as ItcHeads;
  const erp: Record<CompareLine, ItcHeads> = {
    outwardTax: heads(r["3.1"].a_taxable), itcAvailable: heads(r["4"].available), itcReversed: heads(r["4"].reversed), itcNet: heads(r["4"].netItc), cashPayable: cash,
  };
  const [saved] = await tx.select().from(tables.gstCompareFigures).where(and(eq(tables.gstCompareFigures.companyId, company.id), eq(tables.gstCompareFigures.period, period)));
  const portal = (saved?.portal ?? {}) as CompareFigures, final = (saved?.final ?? {}) as CompareFigures;
  return { period, basis, rows: compare3b(erp, portal, final), portal, final, updatedAt: saved?.updatedAt ?? null };
}

export async function saveThreeBCompare(tx: Tx, actor: Actor, b: { period: string; portal: unknown; final: unknown; companyId?: string | undefined }) {
  const company = await resolveCompany(tx, b.companyId);
  const values = { portal: cleanCompareFigures(b.portal) as Record<string, Record<string, string>>, final: cleanCompareFigures(b.final) as Record<string, Record<string, string>>, updatedBy: actor.userId, updatedAt: new Date() };
  await tx.insert(tables.gstCompareFigures).values({ tenantId: actor.tenantId, companyId: company.id, period: b.period, ...values })
    .onConflictDoUpdate({ target: [tables.gstCompareFigures.companyId, tables.gstCompareFigures.period], set: values });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "gst_compare_figures", entityId: company.id, after: { period: b.period }, ip: actor.ip });
  return threeBCompare(tx, b.period, "books", company.id);
}
