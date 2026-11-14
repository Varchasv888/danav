import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { businessDate } from "@varchasv/domain";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { openBills, postBillReceipt } from "../services/billreceipts.js";

const Money = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount"), z.number().nonnegative()]).transform(String);
const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Kind = z.enum(["receivable", "payable"]);

const Body = z.object({
  kind: Kind, partyId: z.uuid(), accountId: z.uuid(), date: IsoDate, amount: Money,
  allocations: z.array(z.object({ billVoucherId: z.uuid(), amount: Money })).max(200).default([]),
  narration: z.string().trim().max(300).optional(), reference: z.string().trim().max(60).optional(), clientId: z.uuid().optional(),
});

/** Bill-wise receipt and payment: pick the bills a customer's (or supplier's) money settles. */
export async function billReceiptRoutes(app: FastifyInstance, { db }: { db: Db }) {
  app.get("/bill-receipts/open", { preHandler: can("accounts.view") }, async (req) => {
    const q = z.object({ kind: Kind, partyId: z.uuid(), asOf: IsoDate.optional() }).parse(req.query);
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => openBills(tx, q.kind, q.partyId, q.asOf ?? businessDate()));
  });
  app.post("/bill-receipts", { preHandler: can("accounts.create") }, async (req, reply) => {
    const body = Body.parse(req.body);
    const auth = requireTenant(req);
    const out = await withTenant(db, auth.tenantId, (tx) => postBillReceipt(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, body));
    return reply.code(201).send(out);
  });
}
