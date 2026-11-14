import { createHash } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { gstPeriodOf } from "@varchasv/domain";
import { SIMULATOR_OTP, gsp, type GstReturnType, type PortalSession } from "../integrations/gsp.js";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, forbidden, notFound } from "../lib/errors.js";
import { decryptSecret, encryptSecret } from "../lib/secrets.js";
import { resolveCompany } from "./accounting.js";
import { gstr1, gstr3b } from "./returns.js";

/**
 * Filing GSTR-1 and GSTR-3B through the GST provider, the way the portal's API works:
 * 1. connect: the taxpayer's GST portal username + OTP gives a session of about 6 hours;
 * 2. upload: the return JSON is saved on the portal (it can be uploaded again until filed);
 * 3. file: signed with an EVC, an OTP sent to the authorised signatory, and the portal returns an ARN.
 * Filing refuses if the books changed after the upload, and a filed GSTR-1 locks its period.
 */

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

async function headOffice(tx: Tx, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const [branch] = await tx.select().from(tables.branches).where(and(eq(tables.branches.companyId, company.id), eq(tables.branches.isHeadOffice, true)));
  if (!branch?.gstin) throw badRequest("branch_gstin_required");
  return { company, gstin: branch.gstin };
}

// ---- portal session ------------------------------------------------------------------------------

export async function portalStatus(tx: Tx, companyId?: string) {
  const { company, gstin } = await headOffice(tx, companyId);
  const [s] = await tx.select().from(tables.gstSessions).where(eq(tables.gstSessions.companyId, company.id));
  const live = !!s && s.gstin === gstin && s.expiresAt.getTime() > Date.now();
  // In test mode the screen shows the simulator's fixed OTP, as the GST sandbox documents its own.
  const testOtp = gsp().name === "simulator" ? SIMULATOR_OTP : undefined;
  return { gstin, provider: gsp().name, testOtp, connected: live, username: s?.username ?? null, expiresAt: live ? s!.expiresAt : null };
}

export async function requestPortalOtp(tx: Tx, username: string, companyId?: string) {
  const { gstin } = await headOffice(tx, companyId);
  await gsp().requestPortalOtp({ gstin, username });
}

export async function connectPortal(tx: Tx, actor: Actor, username: string, otp: string, companyId?: string) {
  const { company, gstin } = await headOffice(tx, companyId);
  const r = await gsp().authenticatePortal({ gstin, username, otp });
  const values = { gstin, username, tokenEnc: encryptSecret(r.token), expiresAt: r.expiresAt, createdBy: actor.userId };
  await tx.insert(tables.gstSessions).values({ companyId: company.id, tenantId: actor.tenantId, ...values })
    .onConflictDoUpdate({ target: tables.gstSessions.companyId, set: values });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "gst_session", entityId: company.id, after: { gstin, username, expiresAt: r.expiresAt }, ip: actor.ip });
  return { expiresAt: r.expiresAt };
}

export async function disconnectPortal(tx: Tx, actor: Actor, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  await tx.delete(tables.gstSessions).where(eq(tables.gstSessions.companyId, company.id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "delete", entity: "gst_session", entityId: company.id, ip: actor.ip });
}

async function session(tx: Tx, companyId: string, gstin: string): Promise<PortalSession> {
  const [s] = await tx.select().from(tables.gstSessions).where(eq(tables.gstSessions.companyId, companyId));
  if (!s || s.gstin !== gstin || s.expiresAt.getTime() <= Date.now()) throw conflict("gst_session_required");
  return { gstin, username: s.username, token: decryptSecret(s.tokenEnc) };
}

// ---- returns -------------------------------------------------------------------------------------

/** The return exactly as it would be uploaded now, with a hash to spot later changes. */
async function prepare(tx: Tx, companyId: string, returnType: GstReturnType, period: string) {
  if (returnType === "GSTR1") {
    const r = await gstr1(tx, companyId, period);
    return { payload: r.json, summary: r.summary as unknown as Record<string, unknown> };
  }
  const r = await gstr3b(tx, companyId, period);
  return { payload: r.json, summary: { liability: r.liability, setOff: r.setOff } as Record<string, unknown> };
}
const hashOf = (payload: unknown) => createHash("sha256").update(JSON.stringify(payload)).digest("hex");

async function filingRow(tx: Tx, companyId: string, gstin: string, returnType: GstReturnType, period: string) {
  const [f] = await tx.select().from(tables.gstFilings).where(and(
    eq(tables.gstFilings.companyId, companyId), eq(tables.gstFilings.gstin, gstin), eq(tables.gstFilings.returnType, returnType), eq(tables.gstFilings.period, period),
  )).for("update");
  return f;
}

export async function listFilings(tx: Tx, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  return tx.select().from(tables.gstFilings).where(eq(tables.gstFilings.companyId, company.id)).orderBy(desc(tables.gstFilings.period), tables.gstFilings.returnType);
}

export async function uploadReturn(tx: Tx, actor: Actor, returnType: GstReturnType, period: string, companyId?: string) {
  const { company, gstin } = await headOffice(tx, companyId);
  await assertApproved(tx, company.id, returnType, period);
  const existing = await filingRow(tx, company.id, gstin, returnType, period);
  if (existing?.status === "filed") throw conflict("return_already_filed");
  const s = await session(tx, company.id, gstin);
  const { payload, summary } = await prepare(tx, company.id, returnType, period);
  const r = await gsp().saveReturn({ ...s, returnType, period, payload });
  const values = { status: "uploaded", payloadHash: hashOf(payload), summary, referenceId: r.referenceId, uploadedAt: new Date(), provider: gsp().name };
  const [row] = existing
    ? await tx.update(tables.gstFilings).set(values).where(eq(tables.gstFilings.id, existing.id)).returning()
    : await tx.insert(tables.gstFilings).values({ tenantId: actor.tenantId, companyId: company.id, gstin, returnType, period, ...values }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "gst_filing", entityId: row!.id, after: { returnType, period, referenceId: r.referenceId }, ip: actor.ip });
  return row!;
}

/** Sends the EVC OTP to the authorised signatory (identified by the business PAN). */
export async function requestFilingOtp(tx: Tx, returnType: GstReturnType, period: string, companyId?: string) {
  const { company, gstin } = await headOffice(tx, companyId);
  const f = await filingRow(tx, company.id, gstin, returnType, period);
  if (!f || f.status !== "uploaded") throw conflict("upload_first");
  if (!company.pan) throw badRequest("company_pan_required");
  await gsp().requestEvcOtp({ ...(await session(tx, company.id, gstin)), pan: company.pan, returnType, period });
}

export async function fileReturn(tx: Tx, actor: Actor, returnType: GstReturnType, period: string, otp: string, companyId?: string) {
  const { company, gstin } = await headOffice(tx, companyId);
  const f = await filingRow(tx, company.id, gstin, returnType, period);
  if (!f || f.status === "filed") throw conflict(f ? "return_already_filed" : "upload_first");
  if (!company.pan) throw badRequest("company_pan_required");
  // What's filed must be what was uploaded: a change since then means uploading again first.
  const { payload } = await prepare(tx, company.id, returnType, period);
  if (hashOf(payload) !== f.payloadHash) throw conflict("books_changed_since_upload");
  const r = await gsp().fileReturn({ ...(await session(tx, company.id, gstin)), pan: company.pan, returnType, period, otp });
  const [row] = await tx.update(tables.gstFilings).set({ status: "filed", arn: r.arn, filedAt: r.filedAt, filedBy: actor.userId }).where(eq(tables.gstFilings.id, f.id)).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "gst_filing", entityId: f.id, after: { returnType, period, arn: r.arn }, ip: actor.ip });
  return row!;
}

/**
 * Once GSTR-1 for a month is filed, its invoices and credit notes are final: changes go into a later
 * month (a credit note, or an amendment on the portal), never back into the filed one.
 */
export async function assertGstr1Open(tx: Tx, companyId: string, date: string) {
  const [f] = await tx.select({ id: tables.gstFilings.id }).from(tables.gstFilings).where(and(
    eq(tables.gstFilings.companyId, companyId), eq(tables.gstFilings.returnType, "GSTR1"), eq(tables.gstFilings.period, gstPeriodOf(date)), eq(tables.gstFilings.status, "filed"),
  )).limit(1);
  if (f) throw conflict("gstr1_filed_for_period");
}

// ---- approval before upload -----------------------------------------------------------------------

/**
 * When the business has switched the approval step on, a return can only be uploaded after a second person with the approve right has signed off
 * the figures, and only while the books still produce exactly those figures. Any change after the approval asks for a fresh one.
 */
async function assertApproved(tx: Tx, companyId: string, returnType: GstReturnType, period: string) {
  const [settings] = await tx.select({ on: tables.gstSettings.approvalRequired }).from(tables.gstSettings).where(eq(tables.gstSettings.companyId, companyId));
  if (!settings?.on) return;
  const [a] = await tx.select().from(tables.gstReturnApprovals).where(and(eq(tables.gstReturnApprovals.companyId, companyId), eq(tables.gstReturnApprovals.returnType, returnType), eq(tables.gstReturnApprovals.period, period)));
  if (!a || a.status !== "approved") throw conflict("approval_required");
  const { payload } = await prepare(tx, companyId, returnType, period);
  if (hashOf(payload) !== a.payloadHash) throw conflict("books_changed_since_approval");
}

/** Puts a return in front of an approver, with the figures as they are now. Asking again after a change replaces the earlier request. */
export async function requestApproval(tx: Tx, actor: Actor, returnType: GstReturnType, period: string, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const [filed] = await tx.select({ s: tables.gstFilings.status }).from(tables.gstFilings).where(and(eq(tables.gstFilings.companyId, company.id), eq(tables.gstFilings.returnType, returnType), eq(tables.gstFilings.period, period)));
  if (filed?.s === "filed") throw conflict("return_already_filed");
  const { payload, summary } = await prepare(tx, company.id, returnType, period);
  const values = { status: "requested", payloadHash: hashOf(payload), summary, requestedBy: actor.userId, requestedAt: new Date(), decidedBy: null, decidedAt: null, note: null };
  const [row] = await tx.insert(tables.gstReturnApprovals).values({ tenantId: actor.tenantId, companyId: company.id, returnType, period, ...values })
    .onConflictDoUpdate({ target: [tables.gstReturnApprovals.companyId, tables.gstReturnApprovals.returnType, tables.gstReturnApprovals.period], set: values }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "gst_return_approval", entityId: row!.id, after: { returnType, period }, ip: actor.ip });
  return row!;
}

export async function decideApproval(tx: Tx, actor: Actor, id: string, decision: "approve" | "reject", note: string) {
  const [a] = await tx.select().from(tables.gstReturnApprovals).where(eq(tables.gstReturnApprovals.id, id)).for("update");
  if (!a) throw notFound();
  if (a.status !== "requested") throw conflict("already_decided");
  if (a.requestedBy === actor.userId) throw forbidden("cannot_approve_own_return");
  if (decision === "reject" && !note.trim()) throw badRequest("note_required");
  if (decision === "approve") {
    const { payload } = await prepare(tx, a.companyId, a.returnType as GstReturnType, a.period);
    if (hashOf(payload) !== a.payloadHash) throw conflict("books_changed_since_request");
  }
  await tx.update(tables.gstReturnApprovals).set({ status: decision === "approve" ? "approved" : "rejected", decidedBy: actor.userId, decidedAt: new Date(), note: note.trim() || null }).where(eq(tables.gstReturnApprovals.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "gst_return_approval", entityId: id, after: { decision, returnType: a.returnType, period: a.period }, ip: actor.ip });
}

export async function listApprovals(tx: Tx, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  return tx.select().from(tables.gstReturnApprovals).where(eq(tables.gstReturnApprovals.companyId, company.id)).orderBy(desc(tables.gstReturnApprovals.requestedAt));
}
