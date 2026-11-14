import type { FastifyInstance } from "fastify";
import type { Db } from "@varchasv/db";
import { handleSms, handleWhatsApp, signatureOk } from "../services/commwebhooks.js";

/**
 * Where messaging providers call back, with no login: the provider proves it is the provider by signing the exact bytes it sends with a secret
 * shared in settings (WHATSAPP_APP_SECRET, SMS_WEBHOOK_SECRET). With no secret set the endpoint refuses everything, so an unconfigured install
 * cannot be written to. What a call can do is narrow: mark a message it was given an id for as delivered or failed, or opt a number out.
 */
export async function commWebhookRoutes(app: FastifyInstance, { db }: { db: Db }) {
  // Keep the raw text: the signature is over the bytes as sent, not over our parse of them.
  app.addContentTypeParser("application/json", { parseAs: "string", bodyLimit: 1024 * 1024 }, (_req, body, done) => done(null, body));
  const cfg = { config: { rateLimit: { max: 600, timeWindow: "1 minute" } } };

  // The one-time handshake when the callback address is registered with Meta.
  app.get("/webhooks/whatsapp", cfg, async (req, reply) => {
    const q = req.query as Record<string, string | undefined>;
    const token = process.env.WHATSAPP_VERIFY_TOKEN;
    if (token && q["hub.mode"] === "subscribe" && q["hub.verify_token"] === token && q["hub.challenge"]) return reply.type("text/plain").send(q["hub.challenge"]);
    return reply.code(403).send({ error: "forbidden" });
  });

  app.post("/webhooks/whatsapp", cfg, async (req, reply) => {
    const raw = typeof req.body === "string" ? req.body : "";
    if (!process.env.WHATSAPP_APP_SECRET) return reply.code(503).send({ error: "webhook_not_configured" });
    if (!signatureOk(process.env.WHATSAPP_APP_SECRET, raw, req.headers["x-hub-signature-256"] as string | undefined)) return reply.code(401).send({ error: "bad_signature" });
    let payload: unknown;
    try { payload = JSON.parse(raw); } catch { return reply.code(400).send({ error: "invalid_json" }); }
    return handleWhatsApp(db, payload);
  });

  app.post("/webhooks/sms", cfg, async (req, reply) => {
    const raw = typeof req.body === "string" ? req.body : "";
    if (!process.env.SMS_WEBHOOK_SECRET) return reply.code(503).send({ error: "webhook_not_configured" });
    if (!signatureOk(process.env.SMS_WEBHOOK_SECRET, raw, req.headers["x-signature"] as string | undefined)) return reply.code(401).send({ error: "bad_signature" });
    let payload: unknown;
    try { payload = JSON.parse(raw); } catch { return reply.code(400).send({ error: "invalid_json" }); }
    return handleSms(db, payload);
  });
}
