import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { asc } from "drizzle-orm";
import { tables, withTenant, type Db } from "@varchasv/db";
import { can, canAny, requireTenant } from "../plugins/auth.js";
import {
  approveClaim, cancelClaim, claimTotals, createClaim, getClaim, listCategories, listClaims, payClaim, readReceipt, rejectClaim, saveCategory, submitClaim, travelRegister, updateClaim,
} from "../services/expenses.js";
import { FILE_TYPES, getFile, saveFile } from "../services/files.js";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Money = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount"), z.number().nonnegative()]).transform(String);
const Pct = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_pct"), z.number().min(0).max(100)]).transform(String);
const IdParam = z.object({ id: z.uuid() });
const Reason = z.object({ reason: z.string().trim().min(3).max(300) });

export async function expenseRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const actor = (auth: { tenantId: string; user: { id: string } }, ip: string) => ({ tenantId: auth.tenantId, userId: auth.user.id, ip });
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant>[2]>[0], a: ReturnType<typeof actor>) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, actor(auth, req.ip)));
  };
  const ok = { ok: true };

  // ---- receipts (files) ------------------------------------------------------------------------
  app.post("/files", { preHandler: canAny("expenses.create", "purchase.create", "sales.create", "inventory.edit"), bodyLimit: 8 * 1024 * 1024 }, async (req, reply) => {
    const body = z.object({ name: z.string().trim().min(1).max(200), contentType: z.enum(FILE_TYPES), base64: z.string().min(4) }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => saveFile(tx, a, body)));
  });
  app.get("/files/:id", { preHandler: canAny("expenses.view", "purchase.view", "sales.view", "inventory.view") }, async (req, reply) => {
    const f = await run(req, (tx) => getFile(tx, IdParam.parse(req.params).id));
    return reply.header("content-type", f.contentType).header("content-disposition", `inline; filename="${encodeURIComponent(f.name)}"`)
      .header("cache-control", "private, max-age=3600").send(f.data);
  });
  app.post("/files/:id/read", { preHandler: can("expenses.create") }, async (req) => run(req, (tx) => readReceipt(tx, IdParam.parse(req.params).id)));

  // Who can claim or log time (without needing HR access).
  app.get("/expenses/people", { preHandler: can("expenses.view") }, async (req) => run(req, async (tx) => {
    const rows = await tx.select({ id: tables.employees.id, code: tables.employees.code, name: tables.employees.name, nameHi: tables.employees.nameHi, status: tables.employees.status }).from(tables.employees).orderBy(asc(tables.employees.code));
    return rows;
  }));

  // ---- categories ------------------------------------------------------------------------------------
  const Category = z.object({
    name: z.string().trim().min(2).max(60), nameHi: z.string().trim().max(60).nullish(), accountId: z.uuid(), blockedCredit: z.boolean().optional(),
    limitPerClaim: Money.nullish(), receiptRequiredAbove: Money.nullish(), archived: z.boolean().optional(), perKmRate: Money.nullish(), dailyAllowance: Money.nullish(),
  });
  app.get("/expenses/categories", { preHandler: can("expenses.view") }, async (req) => run(req, async (tx) => (await listCategories(tx)).map((r) => ({ ...r.c, account: r.account }))));
  app.post("/expenses/categories", { preHandler: can("expenses.approve") }, async (req, reply) => reply.code(201).send(await run(req, (tx, a) => saveCategory(tx, a, Category.parse(req.body)))));
  app.put("/expenses/categories/:id", { preHandler: can("expenses.approve") }, async (req) => run(req, (tx, a) => saveCategory(tx, a, Category.parse(req.body), IdParam.parse(req.params).id)));

  app.get("/reports/travel-claims", { preHandler: can("expenses.view") }, async (req) => {
    const q = z.object({ from: IsoDate, to: IsoDate }).parse(req.query);
    return run(req, (tx) => travelRegister(tx, q.from, q.to));
  });

  // ---- claims ----------------------------------------------------------------------------------------
  const Claim = z.object({
    employeeId: z.uuid(), date: IsoDate, title: z.string().trim().min(3).max(120), projectId: z.uuid().optional(), submit: z.boolean().optional(),
    lines: z.array(z.object({
      date: IsoDate, categoryId: z.uuid(), description: z.string().trim().max(300).optional(), amount: Money.optional(), gstRate: Pct.optional(),
      travel: z.object({ from: z.string().trim().min(1).max(60), to: z.string().trim().max(60), km: z.string().regex(/^\d+(\.\d)?$/).optional(), days: z.number().int().min(0).max(60).optional() }).optional(),
      vendorName: z.string().trim().max(100).optional(), vendorGstin: z.string().trim().length(15).optional(), invoiceNo: z.string().trim().max(30).optional(),
      projectId: z.uuid().optional(), fileId: z.uuid().optional(),
    })).min(1).max(100),
  });
  app.get("/expenses/claims", { preHandler: can("expenses.view") }, async (req) => {
    const q = z.object({ status: z.enum(["draft", "submitted", "approved", "rejected", "paid", "cancelled"]).optional(), employeeId: z.uuid().optional() }).parse(req.query);
    return run(req, async (tx) => (await listClaims(tx, q)).map((r) => ({ ...r.c, employee: r.employee, employeeCode: r.employeeCode })));
  });
  app.get("/expenses/totals", { preHandler: can("expenses.view") }, async (req) => run(req, (tx) => claimTotals(tx)));
  app.get("/expenses/claims/:id", { preHandler: can("expenses.view") }, async (req) => run(req, (tx) => getClaim(tx, IdParam.parse(req.params).id)));
  app.post("/expenses/claims", { preHandler: can("expenses.create") }, async (req, reply) => reply.code(201).send(await run(req, (tx, a) => createClaim(tx, a, Claim.parse(req.body)))));
  app.put("/expenses/claims/:id", { preHandler: can("expenses.edit") }, async (req) => run(req, (tx, a) => updateClaim(tx, a, IdParam.parse(req.params).id, Claim.parse(req.body))));
  app.post("/expenses/claims/:id/submit", { preHandler: can("expenses.submit") }, async (req) => { await run(req, (tx, a) => submitClaim(tx, a, IdParam.parse(req.params).id)); return ok; });
  app.post("/expenses/claims/:id/approve", { preHandler: can("expenses.approve") }, async (req) => { await run(req, (tx, a) => approveClaim(tx, a, IdParam.parse(req.params).id)); return ok; });
  app.post("/expenses/claims/:id/reject", { preHandler: can("expenses.approve") }, async (req) => {
    const { reason } = Reason.parse(req.body);
    await run(req, (tx, a) => rejectClaim(tx, a, IdParam.parse(req.params).id, reason));
    return ok;
  });
  app.post("/expenses/claims/:id/pay", { preHandler: can("expenses.approve") }, async (req) => {
    const body = z.object({ date: IsoDate, accountId: z.uuid() }).parse(req.body);
    const v = await run(req, (tx, a) => payClaim(tx, a, IdParam.parse(req.params).id, body));
    return { number: v.number };
  });
  app.post("/expenses/claims/:id/cancel", { preHandler: can("expenses.cancel") }, async (req) => {
    const { reason } = Reason.parse(req.body);
    await run(req, (tx, a) => cancelClaim(tx, a, IdParam.parse(req.params).id, reason));
    return ok;
  });
}
