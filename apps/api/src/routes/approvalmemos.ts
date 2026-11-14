import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { getMemo, issueMemo, listMemos, memoByNumber, returnFromMemo } from "../services/approvalmemos.js";

const Day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Qty = z.string().regex(/^\d+(\.\d{1,4})?$/, "invalid_quantity");

/** Goods out on approval: issue a memo, take pieces back, and find a memo to bill from the counter. */
export async function approvalMemoRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant<T>>[2]>[0], a: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };

  app.get("/approval-memos", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ status: z.enum(["open", "closed"]).optional() }).parse(req.query);
    return run(req, (tx) => listMemos(tx, q.status));
  });
  app.get("/approval-memos/by-number", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ number: z.string().trim().min(1).max(20) }).parse(req.query);
    return run(req, (tx) => memoByNumber(tx, q.number));
  });
  app.get("/approval-memos/:id", { preHandler: can("sales.view") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    return run(req, (tx) => getMemo(tx, id));
  });
  app.post("/approval-memos", { preHandler: can("sales.create") }, async (req, reply) => {
    const body = z.object({
      warehouseId: z.uuid(), date: Day, customerName: z.string().trim().min(1).max(80), customerPhone: z.string().regex(/^[6-9]\d{9}$/, "invalid_phone").optional(), dueBack: Day.optional(), note: z.string().trim().max(200).optional(),
      lines: z.array(z.object({ itemId: z.uuid(), qty: Qty, rate: z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount").optional() })).min(1).max(100),
    }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => issueMemo(tx, a, body)));
  });
  app.post("/approval-memos/:id/return", { preHandler: can("sales.edit") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ date: Day, lines: z.array(z.object({ lineId: z.uuid(), qty: Qty })).min(1).max(100) }).parse(req.body);
    await run(req, (tx, a) => returnFromMemo(tx, a, id, body));
    return { ok: true };
  });
}
