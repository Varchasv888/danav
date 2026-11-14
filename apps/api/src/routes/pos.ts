import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { inScope } from "../plugins/storescope.js";
import { can, requireTenant } from "../plugins/auth.js";
import {
  closeSession, createBill, dailySummary, getBill, getSession, listBills, listTerminals,
  loyaltyMember, openSession, posSettings, savePosSettings, saveTerminal, voidBill,
  billByNumber, createPosReturn, listReturns, RETURN_GRADES, RETURN_REASONS,
  counterSalesmen, customerHistory, holdBill, listHeld, resumeHeld,
} from "../services/pos.js";
import { resolveCompany } from "../services/accounting.js";
import { autoSendsBill, sendBill } from "../services/sharing.js";
import { env } from "../env.js";
import { listSchemes, resolvedSchemes, saveScheme } from "../services/schemes.js";
import { SCHEME_KINDS, businessDate } from "@varchasv/domain";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Qty = z.union([z.string().regex(/^\d+(\.\d{1,4})?$/, "invalid_qty"), z.number().positive()]).transform(String);
const Money = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount"), z.number().nonnegative()]).transform(String);
const Pct = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_pct"), z.number().min(0).max(100)]).transform(String);
const IdParam = z.object({ id: z.uuid() });
const Phone = z.string().regex(/^[6-9]\d{9}$/, "invalid_phone");
const SendTo = z.object({ phone: Phone.optional() });
export const Payment = z.object({ mode: z.enum(["cash", "upi", "card", "credit"]), amount: Money, reference: z.string().trim().max(40).optional() });
export const BillFields = z.object({
  billDiscount: Money.optional(), redeemPoints: z.number().int().min(0).optional(),
  customerPhone: Phone.optional(), customerName: z.string().trim().max(80).optional(), customerAccountId: z.uuid().optional(),
  // Empty when gift vouchers pay the whole bill.
  payments: z.array(Payment).max(6),
  couponCode: z.string().trim().min(1).max(20).optional(), cardNumber: z.string().trim().min(1).max(20).optional(), referredBy: Phone.optional(),
  giftVouchers: z.array(z.object({ code: z.string().trim().min(4).max(16), amount: Money })).max(5).optional(),
  salesmanId: z.uuid().optional(), helperId: z.uuid().optional(), overrideReason: z.string().trim().min(3).max(200).optional(),
});
export const BillLine = z.object({ itemId: z.uuid(), qty: Qty, price: Money.optional(), discount: Money.optional(), salesmanId: z.uuid().optional(), helperId: z.uuid().optional(), serials: z.array(z.string().trim().min(1).max(40)).max(500).optional() });

export async function posRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const actor = (auth: { tenantId: string; user: { id: string } }, ip: string) => ({ tenantId: auth.tenantId, userId: auth.user.id, ip });
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant>[2]>[0], a: ReturnType<typeof actor>) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, actor(auth, req.ip)));
  };

  const SchemeScopeBody = z.object({
    itemIds: z.array(z.uuid()).max(2000).optional(), styleIds: z.array(z.uuid()).max(500).optional(),
    brands: z.array(z.string().trim().max(60)).max(50).optional(), categories: z.array(z.string().trim().max(60)).max(50).optional(),
    attrs: z.record(z.string().trim().min(1).max(40), z.array(z.string().trim().min(1).max(60)).max(50)).optional(),
  });
  // Store schemes: the list to manage, and the switched-on ones resolved to item ids for the counter.
  const SchemeBody = z.object({
    name: z.string().trim().min(1).max(60), kind: z.enum(SCHEME_KINDS), startsOn: IsoDate.nullish(), endsOn: IsoDate.nullish(), active: z.boolean().optional(),
    priority: z.number().int().min(1).max(999).nullish(), weekdays: z.array(z.number().int().min(0).max(6)).max(7).nullish(), fromTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "invalid_time").nullish(), toTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "invalid_time").nullish(), branchIds: z.array(z.uuid()).max(50).nullish(),
    scope: SchemeScopeBody.extend({ exclude: SchemeScopeBody.optional() }).optional(),
    confirmBeforeApply: z.boolean().optional(), allowWithGiftVouchers: z.boolean().optional(), allowWithCustomerDiscount: z.boolean().optional(), allowReturns: z.boolean().optional(),
    applyOnDiscounted: z.boolean().optional(), inclusiveOfTax: z.boolean().optional(), commissionBasis: z.enum(["net", "list", "none"]).optional(),
    pct: Pct.nullish(), amount: Money.nullish(), minValue: Money.nullish(),
    buy: z.number().int().min(1).max(50).nullish(), get: z.number().int().min(1).max(50).nullish(),
    slabs: z.array(z.object({ from: Money, pct: Pct })).max(10).nullish(),
    comboPrice: Money.nullish(), comboItems: z.array(z.object({ itemId: z.uuid(), qty: z.number().int().min(1).max(100) })).max(20).nullish(),
  });
  app.get("/schemes", { preHandler: can("sales.view") }, async (req) => run(req, (tx) => listSchemes(tx)));
  app.get("/pos/schemes", { preHandler: can("sales.view") }, async (req) => run(req, async (tx) => resolvedSchemes(tx, (await resolveCompany(tx)).id)));
  app.post("/schemes", { preHandler: can("sales.edit") }, async (req, reply) => {
    const body = SchemeBody.parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => saveScheme(tx, a, body)));
  });
  app.put("/schemes/:id", { preHandler: can("sales.edit") }, async (req) => {
    const body = SchemeBody.parse(req.body);
    return run(req, (tx, a) => saveScheme(tx, a, body, IdParam.parse(req.params).id));
  });

  app.get("/pos/settings", { preHandler: can("sales.view") }, async (req) => run(req, async (tx) => posSettings(tx, (await resolveCompany(tx)).id)));
  app.put("/pos/settings", { preHandler: can("sales.edit") }, async (req) => {
    const body = z.object({
      pricesIncludeTax: z.boolean().optional(),
      loyaltyEnabled: z.boolean().optional(), loyaltyPointsPer100: z.number().int().min(0).max(100).optional(), loyaltyPointValue: Money.optional(),
      loyaltySlabs: z.array(z.object({ from: Money, per100: z.number().int().min(0).max(100) })).max(8).nullable().optional(), loyaltyMinRedeem: z.number().int().min(0).max(1000000).optional(),
      loyaltyValidityDays: z.number().int().min(1).max(3650).nullable().optional(), helperSharePct: Pct.optional(), loyaltyExcludeDiscountedBills: z.boolean().optional(), loyaltyExcludeDiscountedItems: z.boolean().optional(),
      loyaltyExcludeBrands: z.array(z.string().trim().min(1).max(60)).max(50).nullable().optional(), loyaltyExcludeCategories: z.array(z.string().trim().min(1).max(60)).max(50).nullable().optional(),
      loyaltyMaxRedeemPct: Pct.optional(), referralPoints: z.number().int().min(0).max(100000).optional(), receiptFooter: z.string().max(300).nullable().optional(),
      allowRateChange: z.boolean().optional(), maxLineDiscountPct: Pct.nullable().optional(), maxBillDiscountPct: Pct.nullable().optional(), requireSalesman: z.boolean().optional(),
      autoSendBill: z.boolean().optional(),
    }).parse(req.body);
    return run(req, (tx, a) => savePosSettings(tx, a, body));
  });

  const Terminal = z.object({ name: z.string().trim().min(2).max(60), warehouseId: z.uuid().optional(), deviceId: z.uuid().nullable().optional(), archived: z.boolean().optional() });
  app.get("/pos/terminals", { preHandler: can("sales.view") }, async (req) => inScope(req, await run(req, (tx) => listTerminals(tx)), (t) => t.warehouseId));
  app.post("/pos/terminals", { preHandler: can("sales.edit") }, async (req, reply) => reply.code(201).send(await run(req, (tx, a) => saveTerminal(tx, a, Terminal.parse(req.body)))));
  app.put("/pos/terminals/:id", { preHandler: can("sales.edit") }, async (req) => run(req, (tx, a) => saveTerminal(tx, a, Terminal.parse(req.body), IdParam.parse(req.params).id)));


  app.post("/pos/sessions", { preHandler: can("sales.create") }, async (req, reply) => {
    const body = z.object({ terminalId: z.uuid(), openingCash: Money.default("0") }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => openSession(tx, a, body.terminalId, body.openingCash)));
  });
  app.get("/pos/sessions/:id", { preHandler: can("sales.view") }, async (req) => run(req, (tx) => getSession(tx, IdParam.parse(req.params).id)));
  app.post("/pos/sessions/:id/close", { preHandler: can("sales.create") }, async (req) => {
    const { countedCash } = z.object({ countedCash: Money }).parse(req.body);
    return run(req, (tx, a) => closeSession(tx, a, IdParam.parse(req.params).id, countedCash));
  });

  app.get("/pos/bills", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ date: IsoDate.optional(), terminalId: z.uuid().optional(), sessionId: z.uuid().optional() }).parse(req.query);
    return run(req, (tx) => listBills(tx, q));
  });
  app.get("/pos/bills/lookup", { preHandler: can("sales.view") }, async (req) => {
    const { number } = z.object({ number: z.string().trim().min(3).max(16) }).parse(req.query);
    return run(req, (tx) => billByNumber(tx, number));
  });
  // Returns and exchanges: goods back against a bill, refunded or given as store credit.
  app.post("/pos/returns", { preHandler: can("sales.create") }, async (req, reply) => {
    const body = z.object({
      billId: z.uuid(), terminalId: z.uuid(), refundMode: z.enum(["cash", "upi", "card", "voucher"]),
      lines: z.array(z.object({ lineId: z.uuid(), qty: Qty, reason: z.enum(RETURN_REASONS), grade: z.enum(RETURN_GRADES), serials: z.array(z.string().trim().min(1).max(40)).max(500).optional() })).min(1).max(300),
    }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => createPosReturn(tx, a, body)));
  });
  app.get("/pos/returns", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ from: IsoDate.optional(), to: IsoDate.optional() }).parse(req.query);
    const today = businessDate();
    return run(req, (tx) => listReturns(tx, { from: q.from ?? today, to: q.to ?? today }));
  });
  app.get("/pos/bills/:id", { preHandler: can("sales.view") }, async (req) => run(req, (tx) => getBill(tx, IdParam.parse(req.params).id)));
  app.post("/pos/bills", { preHandler: can("sales.create") }, async (req, reply) => {
    const body = BillFields.extend({
      terminalId: z.uuid(), lines: z.array(BillLine).min(1).max(300), id: z.uuid().optional(), memoId: z.uuid().optional(), confirmedSchemes: z.array(z.uuid()).max(20).optional(),
      exchange: z.object({ billId: z.uuid(), lines: z.array(z.object({ lineId: z.uuid(), qty: Qty, reason: z.enum(RETURN_REASONS), grade: z.enum(RETURN_GRADES) })).min(1).max(100) }).optional(),
    }).parse(req.body);
    // Only someone who may approve sales can let a rate change or an over-limit discount through.
    const canOverride = requireTenant(req).permissions.has("sales.approve");
    const r = await run(req, (tx, a) => createBill(tx, a, { ...body, canOverride, canChangeRate: requireTenant(req).permissions.has("special.changeSaleRate") }));
    // The bill is saved whatever happens here: a failed send shows in the message log and can be retried.
    let autoSent: string | null = null;
    if (!r.replayed) {
      autoSent = await run(req, async (tx, a) => ((await autoSendsBill(tx, r.bill.id)) ? (await sendBill(tx, a, r.bill.id, env.WEB_ORIGIN)).status : null)).catch(() => "failed");
    }
    return reply.code(201).send({ ...r.bill, warnings: r.warnings, autoSent, exchange: r.exchange ?? null });
  });
  app.post("/pos/bills/:id/send", { preHandler: can("sales.create") }, async (req, reply) => {
    const { phone } = SendTo.parse(req.body ?? {});
    return reply.code(201).send(await run(req, (tx, a) => sendBill(tx, a, IdParam.parse(req.params).id, env.WEB_ORIGIN, phone)));
  });
  app.post("/pos/bills/:id/void", { preHandler: can("sales.cancel") }, async (req) => {
    const { reason } = z.object({ reason: z.string().trim().min(3).max(300) }).parse(req.body);
    await run(req, (tx, a) => voidBill(tx, a, IdParam.parse(req.params).id, reason));
    return { ok: true };
  });
  app.get("/pos/summary", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ date: IsoDate, terminalId: z.uuid().optional() }).parse(req.query);
    return run(req, (tx) => dailySummary(tx, q.date, q.terminalId));
  });
  // Held bills: parked while the customer keeps choosing, picked up again on any counter.
  app.get("/pos/held", { preHandler: can("sales.view") }, async (req) => run(req, (tx) => listHeld(tx)));
  app.post("/pos/held", { preHandler: can("sales.create") }, async (req, reply) => {
    const body = z.object({
      terminalId: z.uuid(), label: z.string().trim().max(60).optional(), customerPhone: Phone.optional(), customerName: z.string().trim().max(80).optional(),
      lines: z.array(BillLine).min(1).max(300),
    }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => holdBill(tx, a, body)));
  });
  app.post("/pos/held/:id/resume", { preHandler: can("sales.create") }, async (req) => run(req, (tx) => resumeHeld(tx, IdParam.parse(req.params).id)));
  app.get("/pos/salesmen", { preHandler: can("sales.view") }, async (req) => run(req, (tx) => counterSalesmen(tx)));
  app.get("/pos/customers/:phone", { preHandler: can("sales.view") }, async (req) => {
    const { phone } = z.object({ phone: Phone }).parse(req.params);
    return run(req, (tx) => customerHistory(tx, phone));
  });
  app.get("/pos/loyalty/:phone", { preHandler: can("sales.view") }, async (req) => {
    const { phone } = z.object({ phone: Phone }).parse(req.params);
    return run(req, async (tx) => (await loyaltyMember(tx, phone)) ?? { phone, points: 0, name: null });
  });
}
