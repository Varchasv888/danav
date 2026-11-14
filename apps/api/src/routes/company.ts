import { and, asc, desc, eq, lt } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { tables, withTenant, type Db } from "@varchasv/db";
import { businessDate, checkSeriesPattern, fiscalYearFor, formatDocumentNumber, isValidStateCode, validateGstin } from "@varchasv/domain";
import { audit, diff } from "../lib/audit.js";
import { badRequest, notFound } from "../lib/errors.js";
import { can, requireTenant } from "../plugins/auth.js";
import { parsePatch } from "../lib/patch.js";
import { auditAnchor, verifyAudit } from "../services/auditchain.js";
import { encryptBackup, decryptBackup } from "../lib/backupcrypt.js";
import { businessExport, verifyBackup } from "../services/export.js";
import { requireStepUp } from "../lib/stepup.js";
import { restoreAsTestBusiness } from "../services/restore.js";
import { SENSITIVE_KINDS, sensitiveChanges } from "../services/sensitive.js";

const Pan = z.string().trim().toUpperCase().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "invalid_pan");
const Address = z.object({
  line1: z.string().max(200).optional(),
  line2: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "invalid_pincode").optional(),
});
const BranchBody = z.object({
  name: z.string().trim().min(1).max(100),
  stateCode: z.string().refine(isValidStateCode, "invalid_state"),
  gstin: z.string().trim().max(15).nullish(),
  address: Address.optional(),
});

function checkBranchGstin(gstin: string | null | undefined, stateCode: string) {
  if (!gstin) return null;
  const g = validateGstin(gstin);
  if (!g.valid) throw badRequest(`gstin_${g.error}`);
  if (g.stateCode !== stateCode) throw badRequest("gstin_state_mismatch");
  return g.gstin;
}

export async function companyRoutes(app: FastifyInstance, { db }: { db: Db }) {
  app.get("/companies", { preHandler: can("company.view") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, async (tx) => {
      const companies = await tx.select().from(tables.companies).orderBy(asc(tables.companies.createdAt));
      const branches = await tx.select().from(tables.branches).orderBy(desc(tables.branches.isHeadOffice), asc(tables.branches.name));
      return companies.map((c) => ({ ...c, branches: branches.filter((b) => b.companyId === c.id) }));
    });
  });

  app.patch("/companies/:id", { preHandler: can("company.edit") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({
      name: z.string().trim().min(2).max(150).optional(),
      legalName: z.string().trim().max(200).nullish(),
      pan: Pan.nullish(),
    }).parse(req.body);
    return withTenant(db, auth.tenantId, async (tx) => {
      const [current] = await tx.select().from(tables.companies).where(eq(tables.companies.id, id));
      if (!current) throw notFound();
      const d = diff(current, body);
      if (!d.changed) return current;
      const [updated] = await tx.update(tables.companies).set({ ...body, updatedAt: new Date() }).where(eq(tables.companies.id, id)).returning();
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "update", entity: "company", entityId: id, ...d, ip: req.ip });
      return updated;
    });
  });

  app.post("/companies/:id/branches", { preHandler: can("company.edit") }, async (req, reply) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = BranchBody.parse(req.body);
    const gstin = checkBranchGstin(body.gstin, body.stateCode);
    const branch = await withTenant(db, auth.tenantId, async (tx) => {
      const [company] = await tx.select({ id: tables.companies.id }).from(tables.companies).where(eq(tables.companies.id, id));
      if (!company) throw notFound();
      const [b] = await tx.insert(tables.branches).values({
        tenantId: auth.tenantId, companyId: id, name: body.name, stateCode: body.stateCode, gstin, address: body.address ?? {},
      }).returning();
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "create", entity: "branch", entityId: b!.id, after: b, ip: req.ip });
      return b;
    });
    return reply.code(201).send(branch);
  });

  app.patch("/branches/:id", { preHandler: can("company.edit") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = parsePatch(BranchBody.partial(), req.body);
    return withTenant(db, auth.tenantId, async (tx) => {
      const [current] = await tx.select().from(tables.branches).where(eq(tables.branches.id, id));
      if (!current) throw notFound();
      const stateCode = body.stateCode ?? current.stateCode;
      const patch = { ...body, gstin: body.gstin === undefined ? undefined : checkBranchGstin(body.gstin, stateCode) };
      if (patch.gstin === undefined && body.stateCode) checkBranchGstin(current.gstin, stateCode);
      const d = diff(current as Record<string, unknown>, patch);
      if (!d.changed) return current;
      const [updated] = await tx.update(tables.branches).set({ ...patch, updatedAt: new Date() }).where(eq(tables.branches.id, id)).returning();
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "update", entity: "branch", entityId: id, ...d, ip: req.ip });
      return updated;
    });
  });

  app.get("/fiscal-years", { preHandler: can("company.view") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => tx.select().from(tables.fiscalYears).orderBy(desc(tables.fiscalYears.startsOn)));
  });

  app.get("/number-series", { preHandler: can("settings.view") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, async (tx) => {
      const rows = await tx
        .select({ series: tables.numberSeries, fyLabel: tables.fiscalYears.label, fyStart: tables.fiscalYears.startsOn })
        .from(tables.numberSeries)
        .innerJoin(tables.fiscalYears, eq(tables.fiscalYears.id, tables.numberSeries.fiscalYearId))
        .orderBy(asc(tables.numberSeries.docType), asc(tables.numberSeries.name));
      return rows.map(({ series, fyLabel, fyStart }) => {
        const fy = fiscalYearFor(Number(fyStart.slice(0, 4)));
        return { ...series, fiscalYear: fyLabel, nextNumber: formatDocumentNumber(series.pattern, { fyShort: fy.short, fyLabel: fy.label, seq: series.nextSeq, device: "D1" }) };
      });
    });
  });

  app.patch("/number-series/:id", { preHandler: can("settings.edit") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({
      name: z.string().trim().min(1).max(100).optional(),
      pattern: z.string().trim().min(1).max(40).optional(),
      nextSeq: z.number().int().min(1).optional(),
    }).parse(req.body);
    if (body.pattern) {
      const problem = checkSeriesPattern(body.pattern);
      if (problem) throw badRequest(`series_${problem}`);
    }
    return withTenant(db, auth.tenantId, async (tx) => {
      const [current] = await tx.select().from(tables.numberSeries).where(eq(tables.numberSeries.id, id)).for("update");
      if (!current) throw notFound();
      // Numbers already issued must never repeat.
      if (body.nextSeq !== undefined && body.nextSeq < current.nextSeq) throw badRequest("series_cannot_go_back");
      const d = diff(current as Record<string, unknown>, body);
      if (!d.changed) return current;
      const [updated] = await tx.update(tables.numberSeries).set(body).where(eq(tables.numberSeries.id, id)).returning();
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "update", entity: "number_series", entityId: id, ...d, ip: req.ip });
      return updated;
    });
  });

  app.get("/audit-log", { preHandler: can("settings.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = z.object({ before: z.coerce.number().int().positive().optional(), limit: z.coerce.number().int().min(1).max(200).default(50) }).parse(req.query);
    return withTenant(db, auth.tenantId, async (tx) => {
      const rows = await tx
        .select({ log: tables.auditLog, userName: tables.users.name })
        .from(tables.auditLog)
        .leftJoin(tables.users, eq(tables.users.id, tables.auditLog.userId))
        .where(q.before ? and(lt(tables.auditLog.id, q.before)) : undefined)
        .orderBy(desc(tables.auditLog.id))
        .limit(q.limit);
      return rows.map((r) => ({ ...r.log, userName: r.userName }));
    });
  });

  // Seals new entries into the hash chain, then checks the whole chain. Anyone who can see the log may run it.
  app.post("/audit-log/verify", { preHandler: can("settings.view") }, async (req) => {
    const auth = requireTenant(req);
    const body = z.object({ anchor: z.object({ seq: z.number().int().positive(), hash: z.string().regex(/^[0-9a-f]{64}$/) }).optional() }).parse(req.body ?? {});
    return withTenant(db, auth.tenantId, (tx) => verifyAudit(tx, auth.tenantId, body.anchor));
  });
  // The latest hash, to keep outside the system (printed, emailed to yourself): a deleted last entry cannot be seen by the chain alone.
  app.get("/audit-log/anchor", { preHandler: can("settings.view") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => auditAnchor(tx, auth.tenantId));
  });

  // The whole business as a ZIP of CSV and JSON files: the owner's own copy of their data.
  app.get("/export/business.zip", { preHandler: can("company.export") }, async (req, reply) => {
    const auth = requireTenant(req);
    const out = await withTenant(db, auth.tenantId, async (tx) => {
      const [t] = await tx.select({ name: tables.tenants.name }).from(tables.tenants).where(eq(tables.tenants.id, auth.tenantId));
      const result = await businessExport(tx, t?.name ?? "Business");
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "export", entity: "business", after: { tables: result.tables, rows: result.rows }, ip: req.ip });
      return result;
    });
    return reply.header("content-type", "application/zip").header("content-disposition", `attachment; filename="${out.filename}"`).send(out.data);
  });

  // An encrypted copy for storing off-site: the export, locked with a passphrase only the owner knows.
  app.post("/export/business.vbk", { preHandler: can("company.export") }, async (req, reply) => {
    const { passphrase } = z.object({ passphrase: z.string().min(12).max(200) }).parse(req.body);
    const auth = requireTenant(req);
    const out = await withTenant(db, auth.tenantId, async (tx) => {
      const [t] = await tx.select({ name: tables.tenants.name }).from(tables.tenants).where(eq(tables.tenants.id, auth.tenantId));
      const result = await businessExport(tx, t?.name ?? "Business");
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "export", entity: "business_encrypted", after: { tables: result.tables, rows: result.rows }, ip: req.ip });
      return result;
    });
    return reply.header("content-type", "application/octet-stream").header("content-disposition", `attachment; filename="${out.filename.replace(/\.zip$/, ".vbk")}"`).send(encryptBackup(out.data, passphrase));
  });
  // The restore drill: open a saved backup with its passphrase and check it is whole. Changes nothing.
  app.post("/export/verify", { preHandler: can("company.export"), bodyLimit: 100 * 1024 * 1024 }, async (req) => {
    const body = z.object({ passphrase: z.string().min(1).max(200), dataBase64: z.string().min(1) }).parse(req.body);
    const auth = requireTenant(req);
    let check;
    try { check = verifyBackup((decryptBackup(Buffer.from(body.dataBase64, "base64"), body.passphrase))); } catch (err) { throw badRequest((err as Error).message === "not_a_backup" || (err as Error).message === "wrong_passphrase" ? (err as Error).message : "damaged_backup"); }
    await withTenant(db, auth.tenantId, (tx) => audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "verify", entity: "business_backup", after: { ok: check.ok, rows: check.rows }, ip: req.ip }));
    return check;
  });

  // A real restore drill: the backup becomes a new, separate business to look at, checked against the backup row by row. The original is never touched.
  app.post("/export/restore-test", { preHandler: can("company.export"), bodyLimit: 100 * 1024 * 1024 }, async (req) => {
    const body = z.object({ passphrase: z.string().min(1).max(200), dataBase64: z.string().min(1) }).parse(req.body);
    const auth = requireTenant(req);
    await requireStepUp(db, req);
    let archive: Buffer;
    try { archive = decryptBackup(Buffer.from(body.dataBase64, "base64"), body.passphrase); } catch (err) { throw badRequest((err as Error).message === "not_a_backup" || (err as Error).message === "wrong_passphrase" ? (err as Error).message : "not_a_backup"); }
    const report = await restoreAsTestBusiness(db, auth.user.id, archive);
    await withTenant(db, auth.tenantId, (tx) => audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "create", entity: "restore_test", after: { copy: report.tenantId, problems: report.problems.length }, ip: req.ip }));
    return report;
  });

  // Changes that can move money or open a door: bank details, credit terms, tax settings, permissions, period locks.
  app.get("/audit-log/sensitive", { preHandler: can("settings.view") }, async (req) => {
    const auth = requireTenant(req);
    const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
    const q = z.object({ from: day.optional(), to: day.optional(), kind: z.enum(SENSITIVE_KINDS).optional() }).parse(req.query);
    const to = q.to ?? businessDate();
    const from = q.from ?? new Date(Date.parse(`${to}T00:00:00Z`) - 30 * 86_400_000).toISOString().slice(0, 10);
    return withTenant(db, auth.tenantId, (tx) => sensitiveChanges(tx, from, to, q.kind));
  });
}
