import { and, asc, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money, type Dec } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest } from "../lib/errors.js";
import { withTenant, type Db } from "@varchasv/db";
import type { Mailer } from "../lib/mailer.js";
import { resolveCompany } from "./accounting.js";
import { documentNumber, ensureInventory, postStockJournal, stockSummary } from "./inventory.js";
import { approvalInvoiceBy, createSalesInvoice } from "./sales.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
type Company = Awaited<ReturnType<typeof resolveCompany>>;

const SEND = { docType: "consignment_send", name: "Consignment challans", pattern: "CSN/{FY}/{SEQ:5}" };
const BACK = { docType: "consignment_return", name: "Consignment returns", pattern: "CSR/{FY}/{SEQ:5}" };
/** Flag goods still unsold this many days after they went (GST wants the invoice within six months). */
const AGE_ALERT_DAYS = 150;

async function consignee(tx: Tx, companyId: string, customerId: string) {
  const [row] = await tx.select({ a: tables.accounts, g: tables.accountGroups.key, p: sql<string | null>`(select g2.key from account_groups g2 where g2.id = ${tables.accountGroups.parentId})` })
    .from(tables.accounts).innerJoin(tables.accountGroups, eq(tables.accountGroups.id, tables.accounts.groupId)).where(eq(tables.accounts.id, customerId));
  if (!row || row.a.companyId !== companyId || (row.g !== "sundry_debtors" && row.p !== "sundry_debtors")) throw badRequest("not_a_customer");
  return row.a;
}

/** The consignee's location: our stock held at their premises (made the first time goods go there). */
export async function consigneeStore(tx: Tx, company: Company, customer: { id: string; name: string }, create = true) {
  const [w] = await tx.select().from(tables.warehouses).where(and(eq(tables.warehouses.companyId, company.id), eq(tables.warehouses.consigneeId, customer.id)));
  if (w || !create) return w?.id ?? null;
  await ensureInventory(tx, company.tenantId, company.id);
  const [n] = await tx.insert(tables.warehouses).values({ tenantId: company.tenantId, companyId: company.id, name: `At ${customer.name}`.slice(0, 120), consigneeId: customer.id }).returning();
  return n!.id;
}

async function defaultStore(tx: Tx, companyId: string) {
  const [w] = await tx.select({ id: tables.warehouses.id }).from(tables.warehouses)
    .where(and(eq(tables.warehouses.companyId, companyId), eq(tables.warehouses.archived, false), sql`${tables.warehouses.jobWorkerId} is null and ${tables.warehouses.consigneeId} is null`))
    .orderBy(desc(tables.warehouses.isDefault), asc(tables.warehouses.createdAt)).limit(1);
  return w!.id;
}

/** What is held at the consignee's location, by item. */
async function held(tx: Tx, company: Company, storeId: string | null, asOf: string) {
  if (!storeId) return new Map<string, Dec>();
  const s = await stockSummary(tx, company, asOf, storeId);
  return new Map(s.rows.filter((r) => dec(r.qty).gt(0)).map((r) => [r.itemId, dec(r.qty)]));
}

async function named(tx: Tx, companyId: string, lines: { itemId: string; qty: string; rate?: string | undefined }[], customer: { priceListId: string | null }) {
  if (!lines.length) throw badRequest("no_lines");
  const ids = [...new Set(lines.map((l) => l.itemId))];
  if (ids.length !== lines.length) throw badRequest("duplicate_item");
  const its = await tx.select().from(tables.items).where(inArray(tables.items.id, ids));
  const fixed = customer.priceListId ? await tx.select().from(tables.priceListItems).where(eq(tables.priceListItems.priceListId, customer.priceListId)) : [];
  const [list] = customer.priceListId ? await tx.select().from(tables.priceLists).where(eq(tables.priceLists.id, customer.priceListId)) : [];
  return lines.map((l) => {
    const it = its.find((i) => i.id === l.itemId);
    if (!it || it.companyId !== companyId || it.kind !== "goods") throw badRequest("unknown_item");
    if (!dec(l.qty).gt(0)) throw badRequest("qty_must_be_positive");
    // The agreed rate: given, else the customer's price list, else the sale rate.
    const listed = fixed.find((f) => f.itemId === it.id)?.rate ?? (list ? dec(it.saleRate).times(dec(1).minus(dec(list.discountPct).div(100))).toFixed(2) : null);
    return { itemId: it.id, name: it.name, qty: dec(l.qty).toFixed(4), rate: money(l.rate ?? listed ?? it.saleRate) };
  });
}

export interface MoveInput { customerId: string; date: string; warehouseId?: string | undefined; narration?: string | undefined; lines: { itemId: string; qty: string; rate?: string | undefined }[] }

/** Goods to the consignee on a delivery challan: moved to their location, still in our stock. */
export async function sendConsignment(tx: Tx, actor: Actor, input: MoveInput) {
  const company = await resolveCompany(tx);
  const customer = await consignee(tx, company.id, input.customerId);
  const lines = await named(tx, company.id, input.lines, customer);
  const store = (await consigneeStore(tx, company, customer))!;
  const from = input.warehouseId ?? await defaultStore(tx, company.id);
  const sj = await postStockJournal(tx, actor, {
    companyId: company.id, kind: "transfer", date: input.date, narration: `Consignment to ${customer.name}`,
    lines: lines.map((l) => ({ itemId: l.itemId, warehouseId: from, toWarehouseId: store, qty: l.qty })),
  });
  const number = await documentNumber(tx, actor, company, input.date, SEND);
  const [row] = await tx.insert(tables.consignmentMoves).values({
    tenantId: actor.tenantId, companyId: company.id, customerId: customer.id, kind: "send", number, date: input.date, lines,
    value: money(lines.reduce((s, l) => s.plus(dec(l.qty).times(l.rate)), dec(0))), stockJournalId: sj.journal.id, narration: input.narration ?? null, createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "consignment", entityId: row!.id, after: { number, customer: customer.name, value: row!.value }, ip: actor.ip });
  return row!;
}

/** Unsold goods taken back from the consignee. */
export async function returnConsignment(tx: Tx, actor: Actor, input: MoveInput) {
  const company = await resolveCompany(tx);
  const customer = await consignee(tx, company.id, input.customerId);
  const store = await consigneeStore(tx, company, customer, false);
  const lines = await named(tx, company.id, input.lines, customer);
  const have = await held(tx, company, store, input.date);
  for (const l of lines) if (dec(l.qty).gt(have.get(l.itemId) ?? 0)) throw badRequest("more_than_held");
  const to = input.warehouseId ?? await defaultStore(tx, company.id);
  const sj = await postStockJournal(tx, actor, {
    companyId: company.id, kind: "transfer", date: input.date, narration: `Consignment back from ${customer.name}`,
    lines: lines.map((l) => ({ itemId: l.itemId, warehouseId: store!, toWarehouseId: to, qty: l.qty })),
  });
  const number = await documentNumber(tx, actor, company, input.date, BACK);
  const [row] = await tx.insert(tables.consignmentMoves).values({
    tenantId: actor.tenantId, companyId: company.id, customerId: customer.id, kind: "return", number, date: input.date, lines,
    value: money(lines.reduce((s, l) => s.plus(dec(l.qty).times(l.rate)), dec(0))), stockJournalId: sj.journal.id, narration: input.narration ?? null, createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "consignment_return", entityId: row!.id, after: { number, customer: customer.name }, ip: actor.ip });
  return row!;
}

/**
 * The consignee's sales report: a tax invoice for what they sold, the goods leaving their location.
 * Goods already with them are billed even over a credit block (with a warning).
 */
export async function billConsignmentSales(tx: Tx, actor: Actor, input: MoveInput) {
  const company = await resolveCompany(tx);
  const customer = await consignee(tx, company.id, input.customerId);
  const store = await consigneeStore(tx, company, customer, false);
  const lines = await named(tx, company.id, input.lines, customer);
  const have = await held(tx, company, store, input.date);
  for (const l of lines) if (dec(l.qty).gt(have.get(l.itemId) ?? 0)) throw badRequest("more_than_held");
  const { invoice, warnings } = await createSalesInvoice(tx, actor, {
    companyId: company.id, customerId: customer.id, date: input.date, overrideCredit: "warn",
    narration: input.narration ?? `Consignment sales reported by ${customer.name}`,
    lines: lines.map((l) => ({ itemId: l.itemId, qty: l.qty, rate: l.rate, discount: "0", warehouseId: store! })),
  });
  const [row] = await tx.insert(tables.consignmentMoves).values({
    tenantId: actor.tenantId, companyId: company.id, customerId: customer.id, kind: "sale", number: invoice.number, date: input.date, lines,
    value: invoice.taxable, invoiceId: invoice.id, narration: input.narration ?? null, createdBy: actor.userId,
  }).returning();
  return { ...row!, invoiceTotal: invoice.total, warnings };
}

/** Consignees with stock out, its value at cost, and how much is getting old. */
export async function listConsignees(tx: Tx, asOf: string) {
  const company = await resolveCompany(tx);
  const stores = await tx.select({ w: tables.warehouses, name: tables.accounts.name }).from(tables.warehouses)
    .innerJoin(tables.accounts, eq(tables.accounts.id, tables.warehouses.consigneeId))
    .where(and(eq(tables.warehouses.companyId, company.id), isNotNull(tables.warehouses.consigneeId)));
  const out = [];
  for (const s of stores) {
    const r = await reconcile(tx, s.w.consigneeId!, asOf);
    out.push({ customerId: s.w.consigneeId!, name: s.name, warehouseId: s.w.id, pieces: r.totals.held, value: r.totals.value, sold: r.totals.sold, ageing: r.rows.filter((x) => x.overdue).length, discrepancies: r.discrepancies, owner: r.terms.discrepancyOwner, settlementDue: r.settlementDue, settlementOverdue: r.settlementOverdue });
  }
  return out.sort((a, b) => Number(b.value) - Number(a.value));
}

/**
 * Item by item: sent, taken back, sold, held at the consignee (from stock) and any difference; the
 * oldest unsold send date (first in, first out) with the six-month invoice-by date.
 */
export async function reconcile(tx: Tx, customerId: string, asOf: string) {
  const company = await resolveCompany(tx);
  const customer = await consignee(tx, company.id, customerId);
  const store = await consigneeStore(tx, company, customer, false);
  const moves = await tx.select().from(tables.consignmentMoves)
    .where(and(eq(tables.consignmentMoves.companyId, company.id), eq(tables.consignmentMoves.customerId, customer.id), sql`${tables.consignmentMoves.date} <= ${asOf}::date`))
    .orderBy(asc(tables.consignmentMoves.date), asc(tables.consignmentMoves.createdAt));
  const have = await held(tx, company, store, asOf);
  const stock = store ? await stockSummary(tx, company, asOf, store) : { rows: [] as { itemId: string; value: string }[] };
  const items = new Map<string, { itemId: string; name: string; sent: Dec; returned: Dec; sold: Dec; sends: { date: string; qty: Dec }[] }>();
  for (const m of moves) for (const l of m.lines) {
    const cur = items.get(l.itemId) ?? { itemId: l.itemId, name: l.name, sent: dec(0), returned: dec(0), sold: dec(0), sends: [] };
    if (m.kind === "send") { cur.sent = cur.sent.plus(l.qty); cur.sends.push({ date: m.date, qty: dec(l.qty) }); }
    else if (m.kind === "return") cur.returned = cur.returned.plus(l.qty);
    else cur.sold = cur.sold.plus(l.qty);
    items.set(l.itemId, cur);
  }
  const day = (iso: string) => Date.parse(`${iso}T00:00:00Z`) / 86_400_000;
  const rows = [...items.values()].map((i) => {
    const h = have.get(i.itemId) ?? dec(0);
    // The oldest pieces still out: what went first is taken to have come back or sold first.
    let gone = i.returned.plus(i.sold);
    let oldest: string | null = null;
    for (const s of i.sends) {
      if (gone.gte(s.qty)) { gone = gone.minus(s.qty); continue; }
      oldest = s.date;
      break;
    }
    const age = oldest ? day(asOf) - day(oldest) : 0;
    return {
      itemId: i.itemId, name: i.name, sent: i.sent.toString(), returned: i.returned.toString(), sold: i.sold.toString(), held: h.toString(),
      difference: i.sent.minus(i.returned).minus(i.sold).minus(h).toString(),
      value: stock.rows.find((r) => r.itemId === i.itemId)?.value ?? "0.00",
      oldestSent: oldest, invoiceBy: oldest ? approvalInvoiceBy(oldest) : null, ageDays: age, overdue: !!oldest && age > AGE_ALERT_DAYS,
    };
  }).sort((a, b) => b.ageDays - a.ageDays);
  const sum = (k: "held" | "sold") => rows.reduce((s, r) => s.plus(r[k]), dec(0)).toString();
  const terms = await getTerms(tx, customer.id);
  // Settlement is expected this many days after the oldest goods still out went; past that date it is overdue.
  const oldestOut = rows.map((r) => r.oldestSent).filter((d): d is string => !!d).sort()[0] ?? null;
  const settlementDue = oldestOut ? new Date((day(oldestOut) + terms.settlementDays) * 86_400_000).toISOString().slice(0, 10) : null;
  return {
    customerId: customer.id, name: customer.name, asOf, rows,
    terms, discrepancies: rows.filter((r) => Number(r.difference) !== 0).length, settlementDue, settlementOverdue: !!settlementDue && settlementDue < asOf,
    totals: { held: sum("held"), sold: sum("sold"), value: money(rows.reduce((s, r) => s.plus(r.value), dec(0))) },
    moves: moves.slice().reverse().map((m) => ({ id: m.id, kind: m.kind, number: m.number, date: m.date, value: m.value, pieces: m.lines.reduce((s, l) => s.plus(l.qty), dec(0)).toString(), invoiceId: m.invoiceId })),
  };
}


// ---- settlement terms ------------------------------------------------------------------------------

export interface TermsInput { settlementDays: number; discrepancyOwner?: string | null | undefined; statementFrequency?: "weekly" | "monthly" | null | undefined; statementEmail?: string | null | undefined }

export async function getTerms(tx: Tx, customerId: string) {
  const company = await resolveCompany(tx);
  const customer = await consignee(tx, company.id, customerId);
  const [t] = await tx.select().from(tables.consigneeTerms).where(and(eq(tables.consigneeTerms.companyId, company.id), eq(tables.consigneeTerms.customerId, customer.id)));
  return { customerId: customer.id, settlementDays: t?.settlementDays ?? 30, discrepancyOwner: t?.discrepancyOwner ?? null, statementFrequency: t?.statementFrequency ?? null, statementEmail: t?.statementEmail ?? null, statementLastSent: t?.statementLastSent ?? null };
}

export async function saveTerms(tx: Tx, actor: Actor, customerId: string, input: TermsInput) {
  const company = await resolveCompany(tx);
  const customer = await consignee(tx, company.id, customerId);
  if (!Number.isInteger(input.settlementDays) || input.settlementDays < 1 || input.settlementDays > 365) throw badRequest("invalid_days");
  if (input.statementFrequency && !input.statementEmail?.trim()) throw badRequest("statement_needs_email");
  const values = { settlementDays: input.settlementDays, discrepancyOwner: input.discrepancyOwner?.trim() || null, statementFrequency: input.statementFrequency ?? null, statementEmail: input.statementEmail?.trim().toLowerCase() || null, updatedAt: new Date() };
  await tx.insert(tables.consigneeTerms).values({ tenantId: actor.tenantId, companyId: company.id, customerId: customer.id, ...values })
    .onConflictDoUpdate({ target: [tables.consigneeTerms.companyId, tables.consigneeTerms.customerId], set: values });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "consignee_terms", entityId: customer.id, after: { settlementDays: input.settlementDays, owner: values.discrepancyOwner }, ip: actor.ip });
  return getTerms(tx, customerId);
}


// ---- statements by email --------------------------------------------------------------------------------------

/** The statement a consignee receives: what we sent, what they sold and returned, what is still with them, what does not tally, and when settlement is due. */
export function statementText(r: Awaited<ReturnType<typeof reconcile>>, shop: string, from: string, to: string) {
  const lines = [
    `${shop}: stock and sales statement for ${r.name}`, `Period ${from} to ${to}; stock position as on ${r.asOf}.`, "",
    ...r.rows.map((x) => `${x.name}: sent ${Number(x.sent)}, returned ${Number(x.returned)}, sold ${Number(x.sold)}, with you ${Number(x.held)}${Number(x.difference) !== 0 ? `, DIFFERENCE ${Number(x.difference)}` : ""}`),
    "", `Sold in total: ${Number(r.totals.sold)} pieces. Still with you: ${Number(r.totals.held)} pieces, worth Rs ${r.totals.value}.`,
  ];
  if (r.discrepancies) lines.push(`${r.discrepancies} item${r.discrepancies === 1 ? "" : "s"} do not tally; please check your count${r.terms.discrepancyOwner ? ` (${r.terms.discrepancyOwner} follows up)` : ""}.`);
  if (r.settlementDue) lines.push(`Settlement is due by ${r.settlementDue}${r.settlementOverdue ? " and is overdue" : ""}.`);
  return lines.join("\n");
}

const gapDays = (f: string) => (f === "weekly" ? 7 : 30);

/** Sends the statement to every consignee whose turn has come (a week or a month after the last one), then notes the day. */
export async function runDueConsigneeStatements(db: Db, mailer: Mailer, now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  const tenants = await db.execute<{ tenant_id: string }>(sql`select tenant_id from due_consignee_tenants(${today}::date)`);
  let sent = 0;
  for (const { tenant_id } of tenants) {
    sent += await withTenant(db, tenant_id, async (tx) => {
      const company = await resolveCompany(tx);
      const due = await tx.select().from(tables.consigneeTerms).where(and(eq(tables.consigneeTerms.companyId, company.id), isNotNull(tables.consigneeTerms.statementFrequency), isNotNull(tables.consigneeTerms.statementEmail)));
      let n = 0;
      for (const t of due) {
        const gap = gapDays(t.statementFrequency!);
        if (t.statementLastSent && Date.parse(`${today}T00:00:00Z`) - Date.parse(`${t.statementLastSent}T00:00:00Z`) < gap * 86_400_000) continue;
        const from = new Date(Date.parse(`${today}T00:00:00Z`) - gap * 86_400_000).toISOString().slice(0, 10);
        const r = await reconcile(tx, t.customerId, today);
        await mailer.send({ to: t.statementEmail!, subject: `Stock and sales statement: ${company.legalName ?? company.name}`, text: statementText(r, company.legalName ?? company.name, from, today) });
        await tx.update(tables.consigneeTerms).set({ statementLastSent: today }).where(eq(tables.consigneeTerms.id, t.id));
        n++;
      }
      return n;
    });
  }
  return sent;
}

// ---- shop-in-shop sales by date, item, brand, category, consignee or discount ----------------------------------------

export const CONSIGNMENT_DIMS = ["date", "month", "item", "brand", "category", "consignee", "discount"] as const;
export type ConsignmentDim = (typeof CONSIGNMENT_DIMS)[number];

/** Goods billed from consignment stock in a period, grouped as asked. Discount is how far below MRP the billed rate was, in bands of ten per cent. */
export async function consignmentSales(tx: Tx, from: string, to: string, by: ConsignmentDim) {
  if (to < from) throw badRequest("invalid_dates");
  const company = await resolveCompany(tx);
  const key = by === "date" ? sql`m.date::text` : by === "month" ? sql`to_char(m.date, 'YYYY-MM')` : by === "item" ? sql`coalesce(i.name, x.name)` : by === "brand" ? sql`coalesce(st.brand, 'No brand')`
    : by === "category" ? sql`coalesce(st.category, 'No category')` : by === "consignee" ? sql`a.name`
      : sql`case when coalesce(i.mrp, 0) <= 0 then 'No MRP' when x.rate >= i.mrp then 'No discount' when (i.mrp - x.rate) / i.mrp * 100 < 10 then 'Under 10%' when (i.mrp - x.rate) / i.mrp * 100 < 20 then '10 to 20%' when (i.mrp - x.rate) / i.mrp * 100 < 30 then '20 to 30%' else '30% and over' end`;
  const rows = [...await tx.execute<{ name: string; pieces: string; value: string; returned: string }>(sql`
    with x as (select m.id, m.date, m.customer_id, m.kind, (l->>'itemId')::uuid as item_id, l->>'name' as name, (l->>'qty')::numeric as qty, (l->>'rate')::numeric as rate
      from consignment_moves m, jsonb_array_elements(m.lines) l where m.company_id = ${company.id} and m.kind in ('sale', 'return') and m.date between ${from}::date and ${to}::date)
    select ${key} as name, coalesce(sum(case when x.kind = 'sale' then x.qty end), 0)::text as pieces, coalesce(sum(case when x.kind = 'sale' then x.qty * x.rate end), 0)::text as value,
      coalesce(sum(case when x.kind = 'return' then x.qty end), 0)::text as returned
    from x join consignment_moves m on m.id = x.id join accounts a on a.id = x.customer_id left join items i on i.id = x.item_id left join styles st on st.id = i.style_id
    group by 1 order by 1`)];
  const out = rows.map((r) => ({ name: r.name, pieces: dec(r.pieces).toFixed(0), value: money(r.value), returned: dec(r.returned).toFixed(0) }));
  return { from, to, by, rows: out, totals: { pieces: out.reduce((t, r) => t.plus(r.pieces), dec(0)).toFixed(0), value: money(out.reduce((t, r) => t.plus(r.value), dec(0))), returned: out.reduce((t, r) => t.plus(r.returned), dec(0)).toFixed(0) } };
}
