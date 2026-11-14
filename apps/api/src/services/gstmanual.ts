import { createHash } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { businessDate, taxPeriod } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { gstr1, gstr3b, type Manual3b } from "./returns.js";

/**
 * The manual-filing workpaper: for a business whose accountant files GST on the portal by hand. It holds what the books cannot
 * know (imports, reversals under rules, interest, late fee), a prepared / reviewed / filed status, and the ARN, filing date and
 * evidence once the return is filed. It records a filing done elsewhere. It never submits anything to the portal, and the
 * statuses say so: "filed" means "the accountant filed it on the portal and recorded it here".
 */
export type ManualReturn = "GSTR1" | "GSTR3B";
export type WorkpaperStatus = "prepared" | "reviewed" | "filed";
interface Actor { tenantId: string; userId: string; ip?: string | undefined }

const hashOf = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");
const ARN = /^[A-Z0-9]{15}$/;

/** The figures the accountant would key into the portal, and their hash (used to notice later changes in the books). */
async function figures(tx: Tx, companyId: string, returnType: ManualReturn, period: string, manual: Manual3b) {
  if (returnType === "GSTR1") {
    const r = await gstr1(tx, companyId, period);
    return { hash: hashOf(r.json), summary: r.summary as unknown as Record<string, unknown> };
  }
  const r = await gstr3b(tx, companyId, period, manual);
  return { hash: hashOf({ json: r.json, manual }), summary: { liability: r.liability, netItc: r["4"].netItc, setOff: r.setOff } as Record<string, unknown> };
}

export async function getWorkpaper(tx: Tx, returnType: ManualReturn, period: string, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const [row] = await tx.select().from(tables.gstWorkpapers).where(and(
    eq(tables.gstWorkpapers.companyId, company.id), eq(tables.gstWorkpapers.returnType, returnType), eq(tables.gstWorkpapers.period, period)));
  const manual = (row?.manual ?? {}) as Manual3b;
  const now = await figures(tx, company.id, returnType, period, manual);
  const evidence = row?.evidenceFileIds?.length
    ? await tx.select({ id: tables.files.id, name: tables.files.name, size: tables.files.size, contentType: tables.files.contentType }).from(tables.files).where(inArray(tables.files.id, row.evidenceFileIds))
    : [];
  return {
    companyId: company.id, returnType, period,
    status: (row?.status ?? "prepared") as WorkpaperStatus,
    manual, notes: row?.notes ?? null,
    reviewedAt: row?.reviewedAt ?? null, reviewedBy: row?.reviewedBy ?? null,
    arn: row?.arn ?? null, filedOn: row?.filedOn ?? null, filedBy: row?.filedBy ?? null,
    evidence,
    updatedAt: row?.updatedAt ?? null,
    /** True when the books now produce different figures from the ones reviewed or filed. */
    changedSinceReview: !!row?.figuresHash && row.figuresHash !== now.hash,
    figuresHash: now.hash,
  };
}

const AMOUNT = /^\d+(\.\d{1,2})?$/;
/** Keeps only known manual keys with valid rupee amounts, so nothing odd is stored or hashed. */
export function cleanManual(input: Record<string, unknown>): Manual3b {
  const out: Record<string, unknown> = {};
  const amt = (v: unknown) => (typeof v === "string" && AMOUNT.test(v.trim()) ? v.trim() : undefined);
  const heads = (v: unknown) => {
    if (!v || typeof v !== "object") return undefined;
    const o: Record<string, string> = {};
    for (const k of ["igst", "cgst", "sgst", "cess"]) { const a = amt((v as Record<string, unknown>)[k]); if (a && Number(a) !== 0) o[k] = a; }
    return Object.keys(o).length ? o : undefined;
  };
  for (const k of ["importGoods", "importServices", "isd", "reversalRules", "ineligibleRule", "ineligibleOther", "interest", "lateFee"]) {
    const h = heads(input[k]); if (h) out[k] = h;
  }
  for (const k of ["nonGstOutward", "exemptInwardInter", "exemptInwardIntra", "nonGstInwardInter", "nonGstInwardIntra"]) {
    const a = amt(input[k]); if (a && Number(a) !== 0) out[k] = a;
  }
  return out as Manual3b;
}

/** Saves the typed figures and notes. A filed workpaper is read-only until it is reopened; changing a reviewed one sends it back to prepared. */
export async function saveWorkpaper(tx: Tx, actor: Actor, b: { returnType: ManualReturn; period: string; manual: Record<string, unknown>; notes?: string | null | undefined; companyId?: string | undefined }) {
  const company = await resolveCompany(tx, b.companyId);
  const [row] = await tx.select().from(tables.gstWorkpapers).where(and(
    eq(tables.gstWorkpapers.companyId, company.id), eq(tables.gstWorkpapers.returnType, b.returnType), eq(tables.gstWorkpapers.period, b.period))).for("update");
  if (row?.status === "filed") throw conflict("workpaper_filed_reopen_first");
  const manual = b.returnType === "GSTR3B" ? cleanManual(b.manual) : {};
  const notes = b.notes?.trim() ? b.notes.trim().slice(0, 2000) : null;
  const values = { manual: manual as Record<string, unknown>, notes, updatedBy: actor.userId, updatedAt: new Date(), status: "prepared" as const, reviewedBy: null, reviewedAt: null, figuresHash: null };
  const [saved] = await tx.insert(tables.gstWorkpapers).values({ tenantId: actor.tenantId, companyId: company.id, returnType: b.returnType, period: b.period, ...values })
    .onConflictDoUpdate({ target: [tables.gstWorkpapers.companyId, tables.gstWorkpapers.returnType, tables.gstWorkpapers.period], set: values }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: row ? "update" : "create", entity: "gst_workpaper", entityId: saved!.id, after: { returnType: b.returnType, period: b.period, manual }, ip: actor.ip });
  return getWorkpaper(tx, b.returnType, b.period, company.id);
}

export interface Move { returnType: ManualReturn; period: string; to: "reviewed" | "filed" | "prepared"; arn?: string | undefined; filedOn?: string | undefined; evidenceFileIds?: string[] | undefined; reason?: string | undefined; companyId?: string | undefined }

/**
 * prepared -> reviewed -> filed, and back to prepared with a reason. Reviewing stores the hash of the figures; marking filed
 * needs a valid ARN and a filing date after the period ended, and refuses when the books changed after the review.
 */
export async function moveWorkpaper(tx: Tx, actor: Actor, m: Move) {
  const company = await resolveCompany(tx, m.companyId);
  const [row] = await tx.select().from(tables.gstWorkpapers).where(and(
    eq(tables.gstWorkpapers.companyId, company.id), eq(tables.gstWorkpapers.returnType, m.returnType), eq(tables.gstWorkpapers.period, m.period))).for("update");
  const status = (row?.status ?? "prepared") as WorkpaperStatus;
  const now = await figures(tx, company.id, m.returnType, m.period, (row?.manual ?? {}) as Manual3b);

  if (m.to === "reviewed") {
    if (status === "filed") throw conflict("workpaper_filed_reopen_first");
    const values = { status: "reviewed", reviewedBy: actor.userId, reviewedAt: new Date(), figuresHash: now.hash, updatedBy: actor.userId, updatedAt: new Date() };
    await tx.insert(tables.gstWorkpapers).values({ tenantId: actor.tenantId, companyId: company.id, returnType: m.returnType, period: m.period, ...values })
      .onConflictDoUpdate({ target: [tables.gstWorkpapers.companyId, tables.gstWorkpapers.returnType, tables.gstWorkpapers.period], set: values });
  } else if (m.to === "filed") {
    if (status !== "reviewed" || !row) throw conflict("review_first");
    if (row.figuresHash !== now.hash) throw conflict("books_changed_since_review");
    const arn = (m.arn ?? "").trim().toUpperCase();
    if (!ARN.test(arn)) throw badRequest("invalid_arn");
    const { to } = taxPeriod(m.period);
    const nextDay = new Date(`${to}T00:00:00Z`); nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    if (!m.filedOn || m.filedOn < nextDay.toISOString().slice(0, 10)) throw badRequest("filed_on_before_period_end");
    if (m.filedOn > businessDate()) throw badRequest("filed_on_in_future");
    const ids = [...new Set(m.evidenceFileIds ?? [])];
    if (ids.length) {
      const found = await tx.select({ id: tables.files.id }).from(tables.files).where(and(eq(tables.files.companyId, company.id), inArray(tables.files.id, ids)));
      if (found.length !== ids.length) throw badRequest("evidence_file_not_found");
    }
    await tx.update(tables.gstWorkpapers).set({ status: "filed", arn, filedOn: m.filedOn, filedBy: actor.userId, evidenceFileIds: ids, updatedBy: actor.userId, updatedAt: new Date() })
      .where(eq(tables.gstWorkpapers.id, row.id));
  } else {
    if (status === "prepared") return getWorkpaper(tx, m.returnType, m.period, company.id);
    if (!m.reason?.trim()) throw badRequest("reason_required");
    await tx.update(tables.gstWorkpapers).set({ status: "prepared", reviewedBy: null, reviewedAt: null, figuresHash: null, arn: null, filedOn: null, filedBy: null, updatedBy: actor.userId, updatedAt: new Date() })
      .where(eq(tables.gstWorkpapers.id, row!.id));
  }
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "gst_workpaper", entityId: row?.id ?? company.id, after: { returnType: m.returnType, period: m.period, from: status, to: m.to, arn: m.to === "filed" ? m.arn : undefined, reason: m.reason }, ip: actor.ip });
  return getWorkpaper(tx, m.returnType, m.period, company.id);
}
