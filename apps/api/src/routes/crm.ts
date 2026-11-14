import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { LEAD_SOURCES, LEAD_STAGES, businessDate } from "@varchasv/domain";
import { messenger } from "../integrations/messaging.js";
import { can, requireTenant } from "../plugins/auth.js";
import {
  addActivity, completeActivity, convertLead, createLead, customer360, flatActivity, getLead, listActivities, listLeads, listTemplates, pipeline, remindOutstanding,
  saveTemplate, sendMessage, setStage, updateLead,
} from "../services/crm.js";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Money = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount"), z.number().nonnegative()]).transform(String);
const IdParam = z.object({ id: z.uuid() });
const today = () => businessDate();

export async function crmRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const actor = (auth: { tenantId: string; user: { id: string } }, ip: string) => ({ tenantId: auth.tenantId, userId: auth.user.id, ip });
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant>[2]>[0], a: ReturnType<typeof actor>) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, actor(auth, req.ip)));
  };
  const ok = { ok: true };

  const Lead = z.object({
    name: z.string().trim().min(2).max(120), organisation: z.string().trim().max(160).nullish(), phone: z.string().trim().max(20).nullish(),
    email: z.email().nullish(), gstin: z.string().trim().max(15).nullish(), stateCode: z.string().regex(/^\d{2}$/).nullish(), city: z.string().trim().max(80).nullish(),
    source: z.enum(LEAD_SOURCES).optional(), stage: z.enum(LEAD_STAGES).optional(), value: Money.nullish(), expectedClose: IsoDate.nullish(),
    ownerId: z.uuid().nullish(), notes: z.string().max(2000).nullish(),
  });
  app.get("/crm/leads", { preHandler: can("crm.view") }, async (req) => {
    const q = z.object({ stage: z.enum(LEAD_STAGES).optional(), ownerId: z.uuid().optional(), q: z.string().max(80).optional() }).parse(req.query);
    return run(req, async (tx) => (await listLeads(tx, q)).map((r) => ({ ...r.l, owner: r.owner, nextFollowUp: r.nextFollowUp })));
  });
  app.get("/crm/pipeline", { preHandler: can("crm.view") }, async (req) => run(req, (tx) => pipeline(tx)));
  app.get("/crm/leads/:id", { preHandler: can("crm.view") }, async (req) => run(req, (tx) => getLead(tx, IdParam.parse(req.params).id)));
  app.post("/crm/leads", { preHandler: can("crm.create") }, async (req, reply) => reply.code(201).send(await run(req, (tx, a) => createLead(tx, a, Lead.parse(req.body)))));
  app.put("/crm/leads/:id", { preHandler: can("crm.edit") }, async (req) => run(req, (tx, a) => updateLead(tx, a, IdParam.parse(req.params).id, Lead.parse(req.body))));
  app.post("/crm/leads/:id/stage", { preHandler: can("crm.edit") }, async (req) => {
    const body = z.object({ stage: z.enum(LEAD_STAGES), lostReason: z.string().trim().max(300).optional() }).parse(req.body);
    await run(req, (tx, a) => setStage(tx, a, IdParam.parse(req.params).id, body.stage, body.lostReason));
    return ok;
  });
  app.post("/crm/leads/:id/convert", { preHandler: can("crm.edit") }, async (req) => {
    const body = z.object({ accountId: z.uuid().optional() }).parse(req.body ?? {});
    return run(req, (tx, a) => convertLead(tx, a, IdParam.parse(req.params).id, body));
  });

  const Activity = z.object({
    leadId: z.uuid().optional(), accountId: z.uuid().optional(), kind: z.enum(["call", "meeting", "task", "note", "whatsapp", "email"]),
    subject: z.string().trim().min(2).max(200), dueAt: z.iso.datetime({ offset: true }).nullish(), done: z.boolean().optional(), ownerId: z.uuid().nullish(), notes: z.string().max(2000).nullish(),
  });
  app.get("/crm/activities", { preHandler: can("crm.view") }, async (req) => {
    const q = z.object({ leadId: z.uuid().optional(), accountId: z.uuid().optional(), ownerId: z.uuid().optional(), open: z.coerce.boolean().optional(), dueBy: z.iso.datetime({ offset: true }).optional() }).parse(req.query);
    return run(req, async (tx) => (await listActivities(tx, q)).map(flatActivity));
  });
  app.post("/crm/activities", { preHandler: can("crm.create") }, async (req, reply) => reply.code(201).send(await run(req, (tx, a) => addActivity(tx, a, Activity.parse(req.body)))));
  app.post("/crm/activities/:id/done", { preHandler: can("crm.edit") }, async (req) => {
    const { done } = z.object({ done: z.boolean().default(true) }).parse(req.body ?? {});
    return run(req, (tx) => completeActivity(tx, IdParam.parse(req.params).id, done));
  });

  app.get("/crm/templates", { preHandler: can("crm.view") }, async (req) => run(req, (tx) => listTemplates(tx)));
  app.get("/crm/messaging", { preHandler: can("crm.view") }, async () => ({ provider: messenger.name }));
  const Template = z.object({
    name: z.string().trim().regex(/^[a-z0-9_]{3,60}$/, "invalid_template_name"), body: z.string().min(5).max(1024), category: z.enum(["utility", "marketing"]).optional(),
    language: z.string().max(5).optional(), providerName: z.string().trim().max(80).nullish(), archived: z.boolean().optional(),
  });
  app.post("/crm/templates", { preHandler: can("crm.edit") }, async (req, reply) => reply.code(201).send(await run(req, (tx, a) => saveTemplate(tx, a, Template.parse(req.body)))));
  app.put("/crm/templates/:id", { preHandler: can("crm.edit") }, async (req) => run(req, (tx, a) => saveTemplate(tx, a, Template.parse(req.body), IdParam.parse(req.params).id)));
  app.post("/crm/messages", { preHandler: can("crm.create") }, async (req, reply) => {
    const body = z.object({ templateId: z.uuid(), params: z.array(z.string().max(300)).max(10), leadId: z.uuid().optional(), accountId: z.uuid().optional(), phone: z.string().max(20).optional() }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => sendMessage(tx, a, body)));
  });
  const AsOf = z.object({ date: IsoDate.default(today) });
  app.post("/crm/customers/:id/remind", { preHandler: can("crm.create") }, async (req, reply) => {
    const { date } = AsOf.parse(req.query);
    return reply.code(201).send(await run(req, (tx, a) => remindOutstanding(tx, a, IdParam.parse(req.params).id, date)));
  });
  app.get("/crm/customers/:id", { preHandler: can("crm.view") }, async (req) => {
    const { date } = AsOf.parse(req.query);
    return run(req, (tx) => customer360(tx, IdParam.parse(req.params).id, date));
  });
}
