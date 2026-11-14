import { and, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { tables, withTenant, type Db } from "@varchasv/db";
import { READY_LOCALES } from "@varchasv/i18n/locales";
import { audit } from "../lib/audit.js";
import { can, canAll, requireTenant } from "../plugins/auth.js";
import { resolveCompany } from "../services/accounting.js";
import { connectPortal, disconnectPortal, fileReturn, listFilings, portalStatus, requestFilingOtp, requestPortalOtp, uploadReturn } from "../services/filing.js";
import { importItems, importOpeningBalances, importParties, importTally } from "../services/importer.js";
import { getWorkpaper, moveWorkpaper, saveWorkpaper } from "../services/gstmanual.js";
import { gstr1, gstr3b, outstanding, type Manual3b } from "../services/returns.js";
import { businessDate, isReturnTimeBarred, returnDueDate, returnTimeBarDate } from "@varchasv/domain";
import { conflict } from "../lib/errors.js";
import { addAmendment, deleteAmendment, listAmendments, saveThreeBCompare, threeBCompare } from "../services/gstamend.js";

/** When a return was due, the last day it can still be filed (three years on), and whether that day has passed. */
const timeBar = (kind: "GSTR1" | "GSTR3B", period: string) => ({
  dueDate: returnDueDate(kind, period), lastDay: returnTimeBarDate(kind, period), barred: isReturnTimeBarred(kind, period, businessDate()),
});
const assertFilable = (kind: "GSTR1" | "GSTR3B", period: string) => { if (timeBar(kind, period).barred) throw conflict("return_time_barred"); };

const Period = z.string().regex(/^(0[1-9]|1[0-2])\d{4}$/, "invalid_period");
const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const today = () => businessDate();
const Opt = z.string().trim().max(200).optional();
const Amt = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount"), z.number().nonnegative()]).transform(String);

export async function gstRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const actor = (auth: { tenantId: string; user: { id: string } }, ip: string) => ({ tenantId: auth.tenantId, userId: auth.user.id, ip });

  app.get("/gst/settings", { preHandler: can("gst.view") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx);
      const [s] = await tx.select().from(tables.gstSettings).where(eq(tables.gstSettings.companyId, company.id));
      return s ?? { companyId: company.id, filingMethod: "manual", einvoiceEnabled: false, ewayBillThreshold: "50000", bilingualPrint: true, printLanguage: "hi", invoiceTerms: null, bankDetails: null };
    });
  });

  // Any member may read it: payslips and Form 16 print in the same second language as invoices.
  app.get("/print-language", async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx);
      const [s] = await tx.select({ language: tables.gstSettings.printLanguage }).from(tables.gstSettings).where(eq(tables.gstSettings.companyId, company.id));
      return { language: s?.language ?? "hi" };
    });
  });

  app.put("/gst/settings", { preHandler: can("gst.edit") }, async (req) => {
    const auth = requireTenant(req);
    const body = z.object({
      filingMethod: z.enum(["manual", "provider"]).default("manual"),
      einvoiceEnabled: z.boolean(), ewayBillThreshold: z.string().regex(/^\d+(\.\d{1,2})?$/).default("50000"), bilingualPrint: z.boolean(),
      printLanguage: z.string().refine((l) => l !== "en" && READY_LOCALES.includes(l), "unsupported_locale").default("hi"),
      invoiceTerms: z.string().max(1000).nullish(), bankDetails: z.string().max(500).nullish(),
    }).parse(req.body);
    return withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx);
      const values = { ...body, invoiceTerms: body.invoiceTerms ?? null, bankDetails: body.bankDetails ?? null };
      const [row] = await tx.insert(tables.gstSettings).values({ companyId: company.id, tenantId: auth.tenantId, ...values })
        .onConflictDoUpdate({ target: tables.gstSettings.companyId, set: values }).returning();
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "update", entity: "gst_settings", entityId: company.id, after: values, ip: req.ip });
      return row;
    });
  });

  app.get("/gst/gstr1", { preHandler: can("gst.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = z.object({ period: Period, companyId: z.uuid().optional() }).parse(req.query);
    return withTenant(db, auth.tenantId, async (tx) => ({ ...(await gstr1(tx, q.companyId, q.period)), timeBar: timeBar("GSTR1", q.period) }));
  });

  app.get("/gst/gstr3b", { preHandler: can("gst.view") }, async (req) => {
    const auth = requireTenant(req);
    // basis=2b takes the input credit from the imported GSTR-2B statement (Rule 36(4)); the default takes it from the books.
    const q = z.object({ period: Period, companyId: z.uuid().optional(), basis: z.enum(["books", "2b"]).default("books") }).parse(req.query);
    // The accountant's typed figures for the period (imports, reversals under rules, interest, late fee) are part of the return.
    return withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx, q.companyId);
      const [wp] = await tx.select({ manual: tables.gstWorkpapers.manual }).from(tables.gstWorkpapers).where(and(
        eq(tables.gstWorkpapers.companyId, company.id), eq(tables.gstWorkpapers.returnType, "GSTR3B"), eq(tables.gstWorkpapers.period, q.period)));
      return { ...(await gstr3b(tx, company.id, q.period, (wp?.manual ?? {}) as Manual3b, q.basis)), timeBar: timeBar("GSTR3B", q.period) };
    });
  });

  // ---- amendments to earlier GSTR-1 supplies, and GSTR-3B side by side ------------------------------------

  const Line = z.object({ rate: z.string().max(6), taxable: Amt, igst: Amt.default("0"), cgst: Amt.default("0"), sgst: Amt.default("0"), cess: Amt.default("0") });
  app.get("/gst/amendments", { preHandler: can("gst.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = z.object({ period: Period, companyId: z.uuid().optional() }).parse(req.query);
    return withTenant(db, auth.tenantId, (tx) => listAmendments(tx, q.period, q.companyId));
  });
  app.post("/gst/amendments", { preHandler: can("gst.submit") }, async (req, reply) => {
    const auth = requireTenant(req);
    const b = z.object({
      kind: z.enum(["b2b", "cdn", "b2cs"]), period: Period, ctin: z.string().max(15).nullish(), originalNumber: z.string().max(40).nullish(), originalDate: IsoDate.nullish(),
      originalPeriod: Period.nullish(), number: z.string().max(40).nullish(), docDate: IsoDate.nullish(), noteType: z.enum(["C", "D"]).nullish(),
      pos: z.string().regex(/^\d{2}$/), intra: z.boolean(), reverseCharge: z.boolean().optional(), invoiceType: z.enum(["R", "SEWP", "SEWOP"]).nullish(),
      value: Amt.optional(), lines: z.array(Line).min(1).max(20), reason: z.string().trim().min(3).max(200), companyId: z.uuid().optional(),
    }).parse(req.body);
    // An amendment cannot change a return that is already filed, so refuse one for a filed period.
    const row = await withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx, b.companyId);
      const [wp] = await tx.select({ status: tables.gstWorkpapers.status }).from(tables.gstWorkpapers).where(and(
        eq(tables.gstWorkpapers.companyId, company.id), eq(tables.gstWorkpapers.returnType, "GSTR1"), eq(tables.gstWorkpapers.period, b.period)));
      if (wp?.status === "filed") throw conflict("workpaper_filed_reopen_first");
      return addAmendment(tx, actor(auth, req.ip), b);
    });
    return reply.code(201).send(row);
  });
  app.delete("/gst/amendments/:id", { preHandler: can("gst.submit") }, async (req, reply) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    await withTenant(db, auth.tenantId, (tx) => deleteAmendment(tx, actor(auth, req.ip), id));
    return reply.code(204).send();
  });
  app.get("/gst/gstr3b/compare", { preHandler: can("gst.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = z.object({ period: Period, basis: z.enum(["books", "2b"]).default("books"), companyId: z.uuid().optional() }).parse(req.query);
    return withTenant(db, auth.tenantId, (tx) => threeBCompare(tx, q.period, q.basis, q.companyId));
  });
  app.put("/gst/gstr3b/compare", { preHandler: can("gst.submit") }, async (req) => {
    const auth = requireTenant(req);
    const b = z.object({ period: Period, portal: z.record(z.string(), z.unknown()).default({}), final: z.record(z.string(), z.unknown()).default({}), companyId: z.uuid().optional() }).parse(req.body);
    return withTenant(db, auth.tenantId, (tx) => saveThreeBCompare(tx, actor(auth, req.ip), b));
  });

  // ---- manual filing: the accountant files on the portal and records it here ----------------------------

  const ManualType = z.enum(["GSTR1", "GSTR3B"]);
  app.get("/gst/workpaper", { preHandler: can("gst.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = z.object({ returnType: ManualType, period: Period, companyId: z.uuid().optional() }).parse(req.query);
    return withTenant(db, auth.tenantId, (tx) => getWorkpaper(tx, q.returnType, q.period, q.companyId));
  });
  app.put("/gst/workpaper", { preHandler: can("gst.submit") }, async (req) => {
    const auth = requireTenant(req);
    const b = z.object({ returnType: ManualType, period: Period, manual: z.record(z.string(), z.unknown()).default({}), notes: z.string().max(2000).nullish(), companyId: z.uuid().optional() }).parse(req.body);
    return withTenant(db, auth.tenantId, (tx) => saveWorkpaper(tx, actor(auth, req.ip), b));
  });
  // Reviewing, recording a filing and reopening carry the sign-off, so they need the approve right.
  app.post("/gst/workpaper/status", { preHandler: can("gst.approve") }, async (req) => {
    const auth = requireTenant(req);
    const b = z.object({
      returnType: ManualType, period: Period, to: z.enum(["prepared", "reviewed", "filed"]), arn: z.string().max(20).optional(), filedOn: IsoDate.optional(),
      evidenceFileIds: z.array(z.uuid()).max(10).optional(), reason: z.string().max(300).optional(), companyId: z.uuid().optional(),
    }).parse(req.body);
    if (b.to === "filed") assertFilable(b.returnType, b.period);
    return withTenant(db, auth.tenantId, (tx) => moveWorkpaper(tx, actor(auth, req.ip), b));
  });

  // ---- filing through the GST provider -----------------------------------------------------------

  const ReturnBody = z.object({ returnType: z.enum(["GSTR1", "GSTR3B"]), period: Period });
  const Otp = z.string().regex(/^\d{6}$/, "invalid_otp");
  const Username = z.string().trim().min(3).max(60);

  app.get("/gst/portal", { preHandler: can("gst.view") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => portalStatus(tx));
  });
  app.post("/gst/portal/otp", { preHandler: can("gst.submit") }, async (req) => {
    const auth = requireTenant(req);
    const { username } = z.object({ username: Username }).parse(req.body);
    await withTenant(db, auth.tenantId, (tx) => requestPortalOtp(tx, username));
    return { ok: true };
  });
  app.post("/gst/portal/connect", { preHandler: can("gst.submit") }, async (req) => {
    const auth = requireTenant(req);
    const { username, otp } = z.object({ username: Username, otp: Otp }).parse(req.body);
    return withTenant(db, auth.tenantId, (tx) => connectPortal(tx, actor(auth, req.ip), username, otp));
  });
  app.post("/gst/portal/disconnect", { preHandler: can("gst.submit") }, async (req) => {
    const auth = requireTenant(req);
    await withTenant(db, auth.tenantId, (tx) => disconnectPortal(tx, actor(auth, req.ip)));
    return { ok: true };
  });

  app.get("/gst/filings", { preHandler: can("gst.view") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => listFilings(tx));
  });
  app.post("/gst/filings/upload", { preHandler: can("gst.submit") }, async (req) => {
    const auth = requireTenant(req);
    const b = ReturnBody.parse(req.body);
    assertFilable(b.returnType, b.period);
    return withTenant(db, auth.tenantId, (tx) => uploadReturn(tx, actor(auth, req.ip), b.returnType, b.period));
  });
  // Filing is signed on the business's behalf, so it needs the approve permission.
  app.post("/gst/filings/otp", { preHandler: can("gst.approve") }, async (req) => {
    const auth = requireTenant(req);
    const b = ReturnBody.parse(req.body);
    await withTenant(db, auth.tenantId, (tx) => requestFilingOtp(tx, b.returnType, b.period));
    return { ok: true };
  });
  app.post("/gst/filings/file", { preHandler: can("gst.approve") }, async (req) => {
    const auth = requireTenant(req);
    const b = ReturnBody.extend({ otp: Otp }).parse(req.body);
    assertFilable(b.returnType, b.period);
    return withTenant(db, auth.tenantId, (tx) => fileReturn(tx, actor(auth, req.ip), b.returnType, b.period, b.otp));
  });

  for (const kind of ["receivable", "payable"] as const) {
    app.get(`/reports/${kind}s`, { preHandler: can("reports.view") }, async (req) => {
      const auth = requireTenant(req);
      const q = z.object({ asOf: IsoDate.default(today), companyId: z.uuid().optional() }).parse(req.query);
      return withTenant(db, auth.tenantId, (tx) => outstanding(tx, q.companyId, kind, q.asOf));
    });
  }

  // ---- import -------------------------------------------------------------------------------

  /** Opening balances from a sheet: ledger name with a debit or a credit. A dry run shows each row and the control totals. */
  app.post("/import/opening-balances", { preHandler: canAll("accounts.edit", "special.importData"), bodyLimit: 5 * 1024 * 1024 }, async (req) => {
    const auth = requireTenant(req);
    const body = z.object({
      dryRun: z.boolean().default(true),
      rows: z.array(z.object({ name: z.string().max(150), debit: Opt, credit: Opt })).min(1).max(20000),
    }).parse(req.body);
    return withTenant(db, auth.tenantId, (tx) => importOpeningBalances(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, body.rows, body.dryRun));
  });
  app.post("/import/parties", { preHandler: canAll("accounts.create", "special.importData"), bodyLimit: 10 * 1024 * 1024 }, async (req) => {
    const auth = requireTenant(req);
    const body = z.object({
      dryRun: z.boolean().default(true),
      rows: z.array(z.object({
        name: z.string().max(150), type: z.enum(["customer", "supplier"]), gstin: Opt, stateCode: Opt, phone: Opt, email: Opt,
        openingBalance: Opt, creditDays: Opt, address: Opt, city: Opt, pincode: Opt,
      })).min(1).max(20000),
    }).parse(req.body);
    return withTenant(db, auth.tenantId, (tx) => importParties(tx, actor(auth, req.ip), body.rows, body.dryRun));
  });

  app.post("/import/items", { preHandler: canAll("inventory.create", "special.importData"), bodyLimit: 10 * 1024 * 1024 }, async (req) => {
    const auth = requireTenant(req);
    const body = z.object({
      dryRun: z.boolean().default(true),
      rows: z.array(z.object({
        name: z.string().max(150), hsn: Opt, gstRate: Opt, unit: Opt, kind: z.enum(["goods", "service"]).optional(),
        purchaseRate: Opt, saleRate: Opt, openingQty: Opt, openingRate: Opt,
      })).min(1).max(20000),
    }).parse(req.body);
    return withTenant(db, auth.tenantId, (tx) => importItems(tx, actor(auth, req.ip), body.rows, body.dryRun));
  });

  app.post("/import/tally", { preHandler: canAll("accounts.create", "special.importData"), bodyLimit: 30 * 1024 * 1024 }, async (req) => {
    const auth = requireTenant(req);
    const body = z.object({ dryRun: z.boolean().default(true), xml: z.string().min(20) }).parse(req.body);
    return withTenant(db, auth.tenantId, (tx) => importTally(tx, actor(auth, req.ip), body.xml, body.dryRun));
  });
}
