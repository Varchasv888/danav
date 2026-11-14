import { and, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { tables, withTenant, type Db } from "@varchasv/db";
import { notFound } from "../lib/errors.js";
import { can, requireTenant } from "../plugins/auth.js";
import { resolveCompany } from "../services/accounting.js";
import {
  agentCommission, cancelBrokerageBill, createBrokerageBill, listBrokerageBills, salesmanReport, salesmanYear, setSalesTargets,
} from "../services/commission.js";
import { businessDate } from "@varchasv/domain";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "invalid_month");
const Pct = z.union([z.string().regex(/^\d{1,3}(\.\d{1,2})?$/, "invalid_percent"), z.number().min(0).max(999.99)]).transform(String);
const Amount = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount"), z.number().nonnegative()]).transform(String);
const IdParam = z.object({ id: z.uuid() });
const actor = (auth: ReturnType<typeof requireTenant>, ip: string) => ({ tenantId: auth.tenantId, userId: auth.user.id, ip });
const today = () => businessDate();

/** Brokers and agents (commission on money received, brokerage bills) and salesman targets. */
export async function commissionRoutes(app: FastifyInstance, { db }: { db: Db }) {
  app.get("/agents", { preHandler: can("sales.view") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx);
      return tx.select({ id: tables.accounts.id, name: tables.accounts.name, nameHi: tables.accounts.nameHi, commissionPct: tables.accounts.commissionPct, archived: tables.accounts.archived })
        .from(tables.accounts).where(and(eq(tables.accounts.companyId, company.id), eq(tables.accounts.isAgent, true))).orderBy(tables.accounts.name);
    });
  });

  /** Employees to pick as salesman (name only, so sales staff need no HR access). */
  app.get("/salesmen", { preHandler: can("sales.view") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx);
      return tx.select({ id: tables.employees.id, name: tables.employees.name, code: tables.employees.code }).from(tables.employees)
        .where(and(eq(tables.employees.companyId, company.id), eq(tables.employees.status, "active"))).orderBy(tables.employees.name);
    });
  });

  app.get("/reports/agent-commission", { preHandler: can("special.seeAgentCommission") }, async (req) => {
    const auth = requireTenant(req);
    const q = z.object({ asOf: IsoDate.optional(), agentId: z.uuid().optional(), companyId: z.uuid().optional() }).parse(req.query);
    return withTenant(db, auth.tenantId, (tx) => agentCommission(tx, q.companyId, q.asOf ?? today(), q.agentId));
  });

  app.get("/brokerage-bills", { preHandler: can("accounts.view") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => listBrokerageBills(tx));
  });
  app.get("/brokerage-bills/:id", { preHandler: can("accounts.view") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = IdParam.parse(req.params);
    return withTenant(db, auth.tenantId, async (tx) => {
      const [row] = await tx.select({ bill: tables.brokerageBills, agent: tables.accounts.name, pan: tables.accounts.pan }).from(tables.brokerageBills)
        .innerJoin(tables.accounts, eq(tables.accounts.id, tables.brokerageBills.agentId)).where(eq(tables.brokerageBills.id, id));
      if (!row) throw notFound();
      return { ...row.bill, agent: row.agent, pan: row.pan };
    });
  });
  app.post("/brokerage-bills", { preHandler: can("accounts.create") }, async (req, reply) => {
    const auth = requireTenant(req);
    const body = z.object({
      companyId: z.uuid().optional(), agentId: z.uuid(), date: IsoDate, tdsRate: Pct.optional(), narration: z.string().max(300).optional(),
    }).parse(req.body);
    return reply.code(201).send(await withTenant(db, auth.tenantId, (tx) => createBrokerageBill(tx, actor(auth, req.ip), body)));
  });
  app.post("/brokerage-bills/:id/cancel", { preHandler: can("accounts.cancel") }, async (req) => {
    const auth = requireTenant(req);
    const { reason } = z.object({ reason: z.string().trim().min(3).max(200) }).parse(req.body);
    await withTenant(db, auth.tenantId, (tx) => cancelBrokerageBill(tx, actor(auth, req.ip), IdParam.parse(req.params).id, reason));
    return { ok: true };
  });

  app.get("/reports/salesman", { preHandler: can("sales.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = z.object({ month: Month.optional(), companyId: z.uuid().optional() }).parse(req.query);
    return withTenant(db, auth.tenantId, (tx) => salesmanReport(tx, q.companyId, q.month ?? today().slice(0, 7)));
  });
  app.get("/reports/salesman-year", { preHandler: can("sales.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = z.object({ year: z.coerce.number().int().min(2000).max(2100).default(() => Number(today().slice(0, 4))), companyId: z.uuid().optional() }).parse(req.query);
    return withTenant(db, auth.tenantId, (tx) => salesmanYear(tx, q.companyId, q.year));
  });
  app.put("/sales-targets/:month", { preHandler: can("sales.approve") }, async (req) => {
    const auth = requireTenant(req);
    const { month } = z.object({ month: Month }).parse(req.params);
    const body = z.object({
      companyId: z.uuid().optional(),
      targets: z.array(z.object({
        employeeId: z.uuid(), target: Amount,
        slabs: z.array(z.object({ from: Pct, rate: Pct })).max(10),
      })).max(500),
    }).parse(req.body);
    return withTenant(db, auth.tenantId, (tx) => setSalesTargets(tx, actor(auth, req.ip), body.companyId, month, body.targets));
  });
}
