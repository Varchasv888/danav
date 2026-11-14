import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { businessDate } from "@varchasv/domain";
import { demoPush, demoSms } from "../integrations/channels.js";
import { messenger } from "../integrations/messaging.js";
import type { Mailer } from "../lib/mailer.js";
import { can, requireTenant } from "../plugins/auth.js";
import { sendDueReminders } from "../services/commreminders.js";
import {
  AUTO_EVENTS, CHANNELS, EVENTS, broadcast, commReport, commSettings, emitEvent, listConsents, listOutbox, listTemplates, processOutbox, queueMessage, recordOptOut, recordReceipt,
  saveCommSettings, saveTemplate, setConsent, type Senders,
} from "../services/comms.js";

const Channel = z.enum(CHANNELS);
const Event = z.enum(EVENTS);
const Iso = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const Params = z.record(z.string().max(40), z.string().max(500));
const Cost = z.string().regex(/^\d{1,5}(\.\d{1,2})?$/);

/** The one place messages go through: templates by language, consent, an outbox with retries, delivery status and cost. */
export async function commsRoutes(app: FastifyInstance, { db, mailer }: { db: Db; mailer: Mailer }) {
  const senders: Senders = { whatsapp: messenger, sms: demoSms, push: demoPush, email: mailer };
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant<T>>[2]>[0], a: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };
  const view = { preHandler: can("crm.view") };
  const edit = { preHandler: can("crm.edit") };

  app.get("/comms/meta", view, async () => ({ channels: CHANNELS, events: EVENTS }));
  app.get("/comms/templates", view, async (req) => run(req, (tx) => listTemplates(tx)));
  app.put("/comms/templates", edit, async (req) => {
    const b = z.object({ event: Event, channel: Channel, language: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/), subject: z.string().max(120).nullish(), body: z.string().min(1).max(1024), archived: z.boolean().optional() }).parse(req.body);
    return run(req, (tx, a) => saveTemplate(tx, a, b));
  });

  app.get("/comms/settings", view, async (req) => run(req, (tx) => commSettings(tx)));
  app.put("/comms/settings", edit, async (req) => {
    const b = z.object({
      costWhatsappUtility: Cost.optional(), costWhatsappMarketing: Cost.optional(), costSms: Cost.optional(), costEmail: Cost.optional(), costPush: Cost.optional(),
      ownerPhone: z.string().regex(/^[6-9]\d{9}$/).nullish(), ownerEmail: z.email().nullish(), maxAttempts: z.number().int().min(1).max(10).optional(),
      autoEvents: z.array(z.enum(AUTO_EVENTS)).max(10).optional(),
    }).parse(req.body);
    return run(req, (tx, a) => saveCommSettings(tx, a, b));
  });

  app.post("/comms/reminders", edit, async (req) => run(req, (tx, a) => sendDueReminders(tx, a)));
  app.get("/comms/consents", view, async (req) => run(req, (tx) => listConsents(tx)));
  app.put("/comms/consents", edit, async (req) => {
    const b = z.object({ contact: z.string().min(5).max(120), channel: Channel, marketingOptIn: z.boolean().optional(), optedOut: z.boolean().optional(), source: z.string().max(30).optional() }).parse(req.body);
    return run(req, (tx, a) => setConsent(tx, a, b));
  });
  app.post("/comms/opt-out", edit, async (req) => {
    const b = z.object({ contact: z.string().min(5).max(120) }).parse(req.body);
    return run(req, (tx, a) => recordOptOut(tx, a, b.contact));
  });

  app.post("/comms/send", edit, async (req, reply) => {
    const b = z.object({
      event: Event, params: Params, accountId: z.uuid().optional(), phone: z.string().optional(), email: z.string().optional(), channels: z.array(Channel).optional(),
      language: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/).optional(), dedupeKey: z.string().max(100).optional(),
    }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => emitEvent(tx, a, b)));
  });
  app.post("/comms/queue", edit, async (req, reply) => {
    const b = z.object({ event: Event, channel: Channel, to: z.string().min(3).max(120), params: Params, language: z.string().optional(), accountId: z.uuid().optional(), dedupeKey: z.string().max(100).optional() }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => queueMessage(tx, a, b)));
  });
  app.post("/comms/broadcast", edit, async (req) => {
    const b = z.object({ channel: Channel, campaign: z.string().trim().min(2).max(60), params: Params, accountIds: z.array(z.uuid()).min(1).max(2000), language: z.string().optional() }).parse(req.body);
    return run(req, (tx, a) => broadcast(tx, a, b));
  });
  app.post("/comms/process", edit, async (req) => run(req, (tx) => processOutbox(tx, senders)));
  app.post("/comms/receipts", edit, async (req) => {
    const b = z.object({ providerId: z.string().min(3).max(120), status: z.enum(["delivered", "failed"]), error: z.string().max(200).optional() }).parse(req.body);
    return run(req, (tx) => recordReceipt(tx, b.providerId, b.status, b.error));
  });

  app.get("/comms/outbox", view, async (req) => {
    const q = z.object({ status: z.enum(["queued", "sent", "delivered", "failed", "skipped"]).optional(), channel: Channel.optional(), limit: z.coerce.number().int().min(1).max(500).optional() }).parse(req.query);
    return run(req, (tx) => listOutbox(tx, q));
  });
  app.get("/comms/report", view, async (req) => {
    const q = z.object({ from: Iso.default(() => `${businessDate().slice(0, 7)}-01`), to: Iso.default(businessDate) }).parse(req.query);
    return run(req, (tx) => commReport(tx, q.from, q.to));
  });
}
