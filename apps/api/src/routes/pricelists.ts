import { and, asc, eq, inArray, sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { tables, withTenant, type Db } from "@varchasv/db";
import { dec, businessDate } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, notFound } from "../lib/errors.js";
import { can, requireTenant } from "../plugins/auth.js";
import { resolveCompany } from "../services/accounting.js";
import { overdueInterest } from "../services/returns.js";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Rate = z.union([z.string().regex(/^\d+(\.\d{1,4})?$/, "invalid_rate"), z.number().nonnegative()]).transform(String);
const Pct = z.union([z.string().regex(/^\d{1,2}(\.\d{1,2})?$/, "invalid_percent"), z.number().min(0).max(99.99)]).transform(String);
const IdParam = z.object({ id: z.uuid() });
const ListBody = z.object({
  name: z.string().trim().min(1).max(60), discountPct: Pct.optional(), archived: z.boolean().optional(),
  items: z.array(z.object({ itemId: z.uuid(), rate: Rate })).max(5000).optional(),
});

/** Party price lists, and the interest statement on overdue receivables. */
export async function priceListRoutes(app: FastifyInstance, { db }: { db: Db }) {
  app.get("/price-lists", { preHandler: can("sales.view") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx);
      return tx.select({
        list: tables.priceLists,
        items: sql<number>`(select count(*)::int from price_list_items i where i.price_list_id = price_lists.id)`,
        customers: sql<number>`(select count(*)::int from accounts a where a.price_list_id = price_lists.id)`,
      }).from(tables.priceLists).where(eq(tables.priceLists.companyId, company.id)).orderBy(asc(tables.priceLists.name))
        .then((rows) => rows.map((r) => ({ ...r.list, items: r.items, customers: r.customers })));
    });
  });

  /** A list with its fixed item rates. */
  app.get("/price-lists/:id", { preHandler: can("sales.view") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = IdParam.parse(req.params);
    return withTenant(db, auth.tenantId, async (tx) => {
      const [list] = await tx.select().from(tables.priceLists).where(eq(tables.priceLists.id, id));
      if (!list) throw notFound();
      const items = await tx.select({ itemId: tables.priceListItems.itemId, rate: tables.priceListItems.rate, name: tables.items.name, saleRate: tables.items.saleRate })
        .from(tables.priceListItems).innerJoin(tables.items, eq(tables.items.id, tables.priceListItems.itemId))
        .where(eq(tables.priceListItems.priceListId, id)).orderBy(asc(tables.items.name));
      return { ...list, items };
    });
  });

  /**
   * The rate every item sells at on this list: its fixed rate, else its sale rate less the list's
   * discount. The sales screens fill rates from this when the customer is on the list.
   */
  app.get("/price-lists/:id/rates", { preHandler: can("sales.view") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = IdParam.parse(req.params);
    return withTenant(db, auth.tenantId, async (tx) => {
      const [list] = await tx.select().from(tables.priceLists).where(eq(tables.priceLists.id, id));
      if (!list) throw notFound();
      const fixed = new Map((await tx.select().from(tables.priceListItems).where(eq(tables.priceListItems.priceListId, id))).map((r) => [r.itemId, r.rate]));
      const items = await tx.select({ id: tables.items.id, saleRate: tables.items.saleRate }).from(tables.items).where(and(eq(tables.items.companyId, list.companyId), eq(tables.items.archived, false)));
      const off = dec(1).minus(dec(list.discountPct).div(100));
      return Object.fromEntries(items.map((i) => [i.id, String(Number(fixed.get(i.id) ?? dec(i.saleRate).times(off).toDecimalPlaces(2).toFixed(2)))]));
    });
  });

  const save = (tenantId: string, userId: string, ip: string, id: string | null, body: z.infer<typeof ListBody>) =>
    withTenant(db, tenantId, async (tx) => {
      const company = await resolveCompany(tx);
      if (body.items?.length) {
        const ids = [...new Set(body.items.map((i) => i.itemId))];
        if (ids.length !== body.items.length) throw badRequest("duplicate_item");
        const found = await tx.select({ id: tables.items.id }).from(tables.items).where(and(inArray(tables.items.id, ids), eq(tables.items.companyId, company.id)));
        if (found.length !== ids.length) throw badRequest("unknown_item");
      }
      const values = { name: body.name, discountPct: body.discountPct ?? "0", ...(body.archived !== undefined ? { archived: body.archived } : {}) };
      const [list] = await (id
        ? tx.update(tables.priceLists).set(values).where(eq(tables.priceLists.id, id)).returning()
        : tx.insert(tables.priceLists).values({ tenantId, companyId: company.id, ...values }).returning()
      ).catch((e) => {
        if (e?.cause?.code === "23505") throw badRequest("price_list_name_taken");
        throw e;
      });
      if (!list) throw notFound();
      if (body.items) {
        await tx.delete(tables.priceListItems).where(eq(tables.priceListItems.priceListId, list.id));
        if (body.items.length) await tx.insert(tables.priceListItems).values(body.items.map((i) => ({ tenantId, priceListId: list.id, itemId: i.itemId, rate: dec(i.rate).toFixed(4) })));
      }
      await audit(tx, { tenantId, userId, action: id ? "update" : "create", entity: "price_list", entityId: list.id, after: { name: list.name, discountPct: list.discountPct, items: body.items?.length }, ip });
      return list;
    });
  app.post("/price-lists", { preHandler: can("sales.edit") }, async (req, reply) => {
    const auth = requireTenant(req);
    return reply.code(201).send(await save(auth.tenantId, auth.user.id, req.ip, null, ListBody.parse(req.body)));
  });
  app.put("/price-lists/:id", { preHandler: can("sales.edit") }, async (req) => {
    const auth = requireTenant(req);
    return save(auth.tenantId, auth.user.id, req.ip, IdParam.parse(req.params).id, ListBody.parse(req.body));
  });

  app.get("/reports/interest", { preHandler: can("reports.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = z.object({ asOf: IsoDate.optional(), rate: Pct.optional(), companyId: z.uuid().optional() }).parse(req.query);
    return withTenant(db, auth.tenantId, (tx) => overdueInterest(tx, q.companyId, q.asOf ?? businessDate(), q.rate));
  });
}
