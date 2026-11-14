import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { businessDate } from "@varchasv/domain";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { listMembers, loyaltyReport, updateMember, upcomingCelebrations } from "../services/loyalty.js";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Phone = z.string().regex(/^[6-9]\d{9}$/, "invalid_phone");

/** Loyalty members, the dates to wish them on, and the points report. */
export async function loyaltyRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const who = (req: Parameters<typeof requireTenant>[0]) => { const auth = requireTenant(req); return { auth, actor: { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip } }; };

  app.get("/loyalty/members", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ search: z.string().trim().max(40).optional() }).parse(req.query);
    const { auth } = who(req);
    return withTenant(db, auth.tenantId, (tx) => listMembers(tx, q));
  });
  app.patch("/loyalty/members/:phone", { preHandler: can("sales.edit") }, async (req) => {
    const { phone } = z.object({ phone: Phone }).parse(req.params);
    const body = z.object({ name: z.string().trim().max(80).nullish(), birthday: IsoDate.nullish(), anniversary: IsoDate.nullish() }).parse(req.body);
    const { auth, actor } = who(req);
    return withTenant(db, auth.tenantId, (tx) => updateMember(tx, actor, phone, body));
  });
  app.get("/loyalty/upcoming", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ days: z.coerce.number().int().min(1).max(365).default(14), today: IsoDate.optional() }).parse(req.query);
    const { auth } = who(req);
    return withTenant(db, auth.tenantId, (tx) => upcomingCelebrations(tx, q.today ?? businessDate(), q.days));
  });
  app.get("/loyalty/report", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ from: IsoDate, to: IsoDate }).parse(req.query);
    const { auth } = who(req);
    return withTenant(db, auth.tenantId, (tx) => loyaltyReport(tx, q.from, q.to));
  });
}
