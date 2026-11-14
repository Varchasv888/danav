import { desc, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { tables, withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { resolveCompany } from "../services/accounting.js";
import {
  expireGiftVouchers, giftVoucherByCode, issueGiftVouchers, listDraws, listGiftVouchers, runLuckyDraw, saveCard, saveCoupon, usableCard, usableCoupon,
} from "../services/vouchers.js";
import { businessDate } from "@varchasv/domain";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Money = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount"), z.number().nonnegative()]).transform(String);
const Pct = z.union([z.string().regex(/^\d{1,3}(\.\d{1,2})?$/, "invalid_percent"), z.number().min(0).max(100)]).transform(String);
const Phone = z.string().regex(/^[6-9]\d{9}$/, "invalid_phone");
const IdParam = z.object({ id: z.uuid() });
const today = () => businessDate();

const CouponBody = z.object({
  code: z.string().trim().min(3).max(20).regex(/^[A-Za-z0-9-]+$/, "invalid_code"), kind: z.enum(["percent", "amount"]), value: Money,
  maxDiscount: Money.nullish(), minBill: Money.nullish(), startsOn: IsoDate.nullish(), endsOn: IsoDate.nullish(),
  maxUses: z.number().int().min(1).max(1_000_000).nullish(), active: z.boolean().optional(),
});
const CardBody = z.object({
  number: z.string().trim().min(3).max(20).regex(/^[A-Za-z0-9-]+$/, "invalid_code"), holder: z.string().trim().min(1).max(80), phone: Phone.nullish(),
  pct: Pct, validUntil: IsoDate.nullish(), active: z.boolean().optional(),
});

/** Gift vouchers, coupons, discount cards and lucky draws (online counters). */
export async function voucherRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant>[2]>[0], a: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };

  app.get("/gift-vouchers", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ status: z.enum(["active", "used", "expired"]).optional() }).parse(req.query);
    return run(req, (tx) => listGiftVouchers(tx, q));
  });
  app.get("/gift-vouchers/:code", { preHandler: can("sales.view") }, async (req) => {
    const { code } = z.object({ code: z.string().trim().min(4).max(16) }).parse(req.params);
    return run(req, (tx) => giftVoucherByCode(tx, code));
  });
  app.post("/gift-vouchers", { preHandler: can("sales.create") }, async (req, reply) => {
    const body = z.object({
      value: Money, count: z.number().int().min(1).max(200), expiresOn: IsoDate, paidBy: z.enum(["cash", "upi", "card"]), date: IsoDate.optional(),
      customerPhone: Phone.optional(), customerName: z.string().trim().max(80).optional(),
    }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => issueGiftVouchers(tx, a, { ...body, date: body.date ?? today() })));
  });
  app.post("/gift-vouchers/expire", { preHandler: can("accounts.create") }, async (req) => {
    const { asOf } = z.object({ asOf: IsoDate.optional() }).parse(req.body ?? {});
    return run(req, (tx, a) => expireGiftVouchers(tx, a, asOf ?? today()));
  });

  app.get("/coupons", { preHandler: can("sales.view") }, async (req) => run(req, async (tx) => {
    const company = await resolveCompany(tx);
    return tx.select().from(tables.coupons).where(eq(tables.coupons.companyId, company.id)).orderBy(desc(tables.coupons.createdAt));
  }));
  app.post("/coupons", { preHandler: can("sales.edit") }, async (req, reply) => reply.code(201).send(await run(req, (tx, a) => saveCoupon(tx, a, CouponBody.parse(req.body)))));
  app.put("/coupons/:id", { preHandler: can("sales.edit") }, async (req) => run(req, (tx, a) => saveCoupon(tx, a, CouponBody.parse(req.body), IdParam.parse(req.params).id)));

  app.get("/discount-cards", { preHandler: can("sales.view") }, async (req) => run(req, async (tx) => {
    const company = await resolveCompany(tx);
    return tx.select().from(tables.discountCards).where(eq(tables.discountCards.companyId, company.id)).orderBy(tables.discountCards.holder);
  }));
  app.post("/discount-cards", { preHandler: can("sales.edit") }, async (req, reply) => reply.code(201).send(await run(req, (tx, a) => saveCard(tx, a, CardBody.parse(req.body)))));
  app.put("/discount-cards/:id", { preHandler: can("sales.edit") }, async (req) => run(req, (tx, a) => saveCard(tx, a, CardBody.parse(req.body), IdParam.parse(req.params).id)));

  /** What the counter needs to show a coupon or card discount before billing (the bill checks again). */
  app.get("/pos/promo", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ coupon: z.string().trim().min(1).max(20).optional(), card: z.string().trim().min(1).max(20).optional() }).parse(req.query);
    return run(req, async (tx) => {
      const company = await resolveCompany(tx);
      const coupon = q.coupon ? await usableCoupon(tx, company.id, q.coupon, today()) : null;
      const card = q.card ? await usableCard(tx, company.id, q.card, today()) : null;
      return {
        coupon: coupon ? { code: coupon.code, kind: coupon.kind, value: coupon.value, maxDiscount: coupon.maxDiscount, minBill: coupon.minBill } : null,
        card: card ? { number: card.number, holder: card.holder, pct: card.pct } : null,
      };
    });
  });

  app.get("/lucky-draws", { preHandler: can("sales.view") }, async (req) => run(req, (tx) => listDraws(tx)));
  app.post("/lucky-draws", { preHandler: can("sales.approve") }, async (req, reply) => {
    const body = z.object({ name: z.string().trim().min(1).max(80), fromDate: IsoDate, toDate: IsoDate, minBill: Money.optional(), winners: z.number().int().min(1).max(100) }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => runLuckyDraw(tx, a, body)));
  });
}
