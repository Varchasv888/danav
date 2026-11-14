import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { deleteDevice, deviceSeen, ingestPunches, listDevices, recentPunches, registerDevice, reprocessUnmatched, updateDevice } from "../services/devicepunch.js";

const Sn = z.string().regex(/^[A-Za-z0-9_.-]{4,40}$/);
const IdParam = z.object({ id: z.uuid() });

/**
 * The machine side of attendance: the ZKTeco "ADMS" push protocol (also spoken by eSSL, BioMax, Realtime and many others). The machine is set to
 * use this server as its cloud server; it says hello, then posts its punch log as plain text. Replies are the short plain-text answers the
 * machines expect. Nothing here needs a login: see PUBLIC_ROUTES for why that is safe.
 */
export async function iclockRoutes(app: FastifyInstance, { db }: { db: Db }) {
  // Machines post their log as text/plain (or with no type at all), which the JSON parser would refuse.
  app.addContentTypeParser("*", { parseAs: "string", bodyLimit: 2 * 1024 * 1024 }, (_req, body, done) => done(null, body));
  app.addContentTypeParser("text/plain", { parseAs: "string", bodyLimit: 2 * 1024 * 1024 }, (_req, body, done) => done(null, body));
  const text = (reply: { header: (k: string, v: string) => unknown; send: (b: string) => unknown }, body: string) => { reply.header("content-type", "text/plain; charset=utf-8"); return reply.send(body); };
  const cfg = { config: { rateLimit: { max: 600, timeWindow: "1 minute" } } };

  // The first thing a machine does at start-up and on each reconnect: ask for its settings.
  app.get("/iclock/cdata", cfg, async (req, reply) => {
    const q = z.object({ SN: Sn }).safeParse(req.query);
    if (!q.success) return text(reply.code(400), "ERROR");
    const seen = await deviceSeen(db, q.data.SN, req.ip);
    if (!seen) return text(reply, "OK"); // unknown machine: nothing to configure, nothing stored
    return text(reply, [
      `GET OPTION FROM: ${q.data.SN}`, `ATTLOGStamp=${seen.lastStamp ?? "None"}`, "OPERLOGStamp=9999", "ATTPHOTOStamp=None", "ErrorDelay=30", "Delay=10",
      "TransTimes=00:00;14:05", "TransInterval=1", "TransFlag=TransData AttLog", "TimeZone=330", "Realtime=1", "Encrypt=None", "",
    ].join("\n"));
  });

  // The punches themselves. Other tables the machine offers (operator log, photos) are accepted and ignored.
  app.post("/iclock/cdata", cfg, async (req, reply) => {
    const q = z.object({ SN: Sn, table: z.string().max(20).optional(), Stamp: z.string().max(20).optional() }).safeParse(req.query);
    if (!q.success) return text(reply.code(400), "ERROR");
    const body = typeof req.body === "string" ? req.body : "";
    if (q.data.table && q.data.table.toUpperCase() !== "ATTLOG") return text(reply, "OK");
    const r = await ingestPunches(db, q.data.SN, req.ip, body, q.data.Stamp);
    return text(reply, `OK: ${r.stored}`);
  });

  app.get("/iclock/getrequest", cfg, async (req, reply) => {
    const q = z.object({ SN: Sn }).safeParse(req.query);
    if (q.success) await deviceSeen(db, q.data.SN, req.ip);
    return text(reply, "OK");
  });
  app.post("/iclock/devicecmd", cfg, async (_req, reply) => text(reply, "OK"));

  // ---- the business's side: register machines, see what they sent -----------------------------------
  const who = (req: Parameters<typeof requireTenant>[0]) => { const auth = requireTenant(req); return { auth, actor: { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip } }; };
  app.get("/attendance/devices", { preHandler: can("hr.view") }, async (req) => { const { auth } = who(req); return withTenant(db, auth.tenantId, (tx) => listDevices(tx)); });
  app.post("/attendance/devices", { preHandler: can("hr.edit") }, async (req, reply) => {
    const body = z.object({ name: z.string().trim().min(2).max(60), serial: z.string().trim().min(4).max(40) }).parse(req.body);
    const { auth, actor } = who(req);
    return reply.code(201).send(await withTenant(db, auth.tenantId, (tx) => registerDevice(tx, actor, body)));
  });
  app.patch("/attendance/devices/:id", { preHandler: can("hr.edit") }, async (req) => {
    const body = z.object({ name: z.string().trim().min(2).max(60).optional(), active: z.boolean().optional() }).parse(req.body);
    const { auth, actor } = who(req);
    return withTenant(db, auth.tenantId, (tx) => updateDevice(tx, actor, IdParam.parse(req.params).id, body));
  });
  app.delete("/attendance/devices/:id", { preHandler: can("hr.edit") }, async (req) => {
    const { auth, actor } = who(req);
    await withTenant(db, auth.tenantId, (tx) => deleteDevice(tx, actor, IdParam.parse(req.params).id));
    return { ok: true };
  });
  app.get("/attendance/punches", { preHandler: can("hr.view") }, async (req) => { const { auth } = who(req); return withTenant(db, auth.tenantId, (tx) => recentPunches(tx)); });
  app.post("/attendance/punches/reprocess", { preHandler: can("hr.edit") }, async (req) => { const { auth, actor } = who(req); return withTenant(db, auth.tenantId, (tx) => reprocessUnmatched(tx, actor)); });
}
