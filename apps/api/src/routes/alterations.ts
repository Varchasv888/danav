import { asc, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { tables, withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { resolveCompany } from "../services/accounting.js";
import {
  cancelAlteration, createAlteration, deliverAlteration, issueAlteration, labourReport, listAlterations, receiveAlteration, saveAlterationType, saveKarigar,
} from "../services/alterations.js";
import { Payment } from "./pos.js";
import { businessDate } from "@varchasv/domain";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Money = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount"), z.number().nonnegative()]).transform(String);
const Phone = z.string().regex(/^[6-9]\d{9}$/, "invalid_phone");
const IdParam = z.object({ id: z.uuid() });
const today = () => businessDate();

/** Alterations and repairs: karigars, what can be done, and the slips that go through the workroom. */
export async function alterationRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant>[2]>[0], a: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };

  const Karigar = z.object({ name: z.string().trim().min(1).max(80), phone: Phone.nullish(), accountId: z.uuid().nullish(), employeeId: z.uuid().nullish(), active: z.boolean().optional(), outside: z.boolean().optional() });
  app.get("/karigars", { preHandler: can("sales.view") }, async (req) => run(req, async (tx) => {
    const company = await resolveCompany(tx);
    return tx.select().from(tables.karigars).where(eq(tables.karigars.companyId, company.id)).orderBy(asc(tables.karigars.name));
  }));
  app.post("/karigars", { preHandler: can("sales.edit") }, async (req, reply) => reply.code(201).send(await run(req, (tx, a) => saveKarigar(tx, a, Karigar.parse(req.body)))));
  app.put("/karigars/:id", { preHandler: can("sales.edit") }, async (req) => run(req, (tx, a) => saveKarigar(tx, a, Karigar.parse(req.body), IdParam.parse(req.params).id)));

  const Type = z.object({ name: z.string().trim().min(1).max(60), kind: z.enum(["alteration", "repair"]), charge: Money, labour: Money, active: z.boolean().optional() });
  app.get("/alteration-types", { preHandler: can("sales.view") }, async (req) => run(req, async (tx) => {
    const company = await resolveCompany(tx);
    return tx.select().from(tables.alterationTypes).where(eq(tables.alterationTypes.companyId, company.id)).orderBy(asc(tables.alterationTypes.kind), asc(tables.alterationTypes.name));
  }));
  app.post("/alteration-types", { preHandler: can("sales.edit") }, async (req, reply) => reply.code(201).send(await run(req, (tx, a) => saveAlterationType(tx, a, Type.parse(req.body)))));
  app.put("/alteration-types/:id", { preHandler: can("sales.edit") }, async (req) => run(req, (tx, a) => saveAlterationType(tx, a, Type.parse(req.body), IdParam.parse(req.params).id)));

  app.get("/alterations", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ status: z.enum(["open", "received", "with_karigar", "ready", "delivered", "cancelled"]).optional(), karigarId: z.uuid().optional(), from: IsoDate.optional(), to: IsoDate.optional() }).parse(req.query);
    return run(req, (tx) => listAlterations(tx, q));
  });
  app.get("/alterations/labour", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ from: IsoDate, to: IsoDate }).parse(req.query);
    return run(req, (tx) => labourReport(tx, q.from, q.to));
  });
  app.post("/alterations", { preHandler: can("sales.create") }, async (req, reply) => {
    const body = z.object({
      date: IsoDate.optional(), billId: z.uuid().optional(), customerName: z.string().trim().max(80).optional(), customerPhone: Phone.optional(),
      lines: z.array(z.object({ typeId: z.uuid(), garment: z.string().trim().min(1).max(80), qty: z.number().int().min(1).max(50), notes: z.string().trim().max(200).optional() })).min(1).max(30),
      complimentary: z.boolean().optional(), trialOn: IsoDate.optional(), deliveryOn: IsoDate, notes: z.string().trim().max(300).optional(),
    }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => createAlteration(tx, a, { ...body, date: body.date ?? today() })));
  });
  app.post("/alterations/:id/issue", { preHandler: can("sales.create") }, async (req) => {
    const body = z.object({ karigarId: z.uuid(), date: IsoDate.optional() }).parse(req.body);
    return run(req, (tx, a) => issueAlteration(tx, a, IdParam.parse(req.params).id, { karigarId: body.karigarId, date: body.date ?? today() }));
  });
  app.post("/alterations/:id/receive", { preHandler: can("sales.create") }, async (req) => {
    const body = z.object({ date: IsoDate.optional() }).parse(req.body ?? {});
    return run(req, (tx, a) => receiveAlteration(tx, a, IdParam.parse(req.params).id, { date: body.date ?? today() }));
  });
  app.post("/alterations/:id/deliver", { preHandler: can("sales.create") }, async (req) => {
    const body = z.object({ terminalId: z.uuid().optional(), payments: z.array(Payment).max(6).optional() }).parse(req.body ?? {});
    return run(req, (tx, a) => deliverAlteration(tx, a, IdParam.parse(req.params).id, body));
  });
  app.post("/alterations/:id/cancel", { preHandler: can("sales.cancel") }, async (req) => {
    const { reason } = z.object({ reason: z.string().trim().min(3).max(200) }).parse(req.body);
    await run(req, (tx, a) => cancelAlteration(tx, a, IdParam.parse(req.params).id, reason));
    return { ok: true };
  });
}
