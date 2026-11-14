import { and, asc, eq, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { monthAttendance, workingDates } from "./hr.js";
import { saleLines } from "./insights.js";
import { posSettings } from "./pos.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

export const RULE_KINDS = ["all", "brand", "category", "item", "mrp_range", "margin", "age"] as const;
type Kind = (typeof RULE_KINDS)[number];
/** The more specific a rule, the earlier it wins. */
const SPECIFICITY: Record<Kind, number> = { item: 0, brand: 1, category: 2, margin: 3, age: 3, mrp_range: 4, all: 5 };

export interface RuleInput {
  name: string; kind: Kind; match?: string | null | undefined; itemId?: string | null | undefined; mrpFrom?: string | null | undefined; mrpTo?: string | null | undefined; bandFrom?: string | null | undefined; bandTo?: string | null | undefined;
  ratePct: string; active?: boolean | undefined;
}

function check(i: RuleInput) {
  if (!dec(i.ratePct).gte(0) || dec(i.ratePct).gt(100)) throw badRequest("invalid_rate");
  if ((i.kind === "brand" || i.kind === "category") && !i.match?.trim()) throw badRequest("match_required");
  if (i.kind === "item" && !i.itemId) throw badRequest("item_required");
  if (i.kind === "mrp_range") {
    if (i.mrpFrom == null && i.mrpTo == null) throw badRequest("range_required");
    if (i.mrpFrom != null && i.mrpTo != null && dec(i.mrpFrom).gt(i.mrpTo)) throw badRequest("range_reversed");
  }
  if (i.kind === "margin" || i.kind === "age") {
    if (i.bandFrom == null && i.bandTo == null) throw badRequest("range_required");
    if (i.bandFrom != null && i.bandTo != null && dec(i.bandFrom).gt(i.bandTo)) throw badRequest("range_reversed");
  }
}

const fields = (i: RuleInput) => ({
  name: i.name, kind: i.kind, match: i.kind === "brand" || i.kind === "category" ? i.match!.trim() : null, itemId: i.kind === "item" ? i.itemId! : null,
  mrpFrom: i.kind === "mrp_range" && i.mrpFrom != null ? money(i.mrpFrom) : null, mrpTo: i.kind === "mrp_range" && i.mrpTo != null ? money(i.mrpTo) : null,
  bandFrom: (i.kind === "margin" || i.kind === "age") && i.bandFrom != null ? dec(i.bandFrom).toFixed(2) : null, bandTo: (i.kind === "margin" || i.kind === "age") && i.bandTo != null ? dec(i.bandTo).toFixed(2) : null,
  ratePct: dec(i.ratePct).toFixed(2), active: i.active ?? true,
});

export async function listRules(tx: Tx) {
  const company = await resolveCompany(tx);
  return tx.select().from(tables.salesmanCommissionRules).where(eq(tables.salesmanCommissionRules.companyId, company.id)).orderBy(asc(tables.salesmanCommissionRules.createdAt));
}

export async function saveRule(tx: Tx, actor: Actor, input: RuleInput, id?: string) {
  const company = await resolveCompany(tx);
  check(input);
  if (input.itemId) {
    const [it] = await tx.select({ companyId: tables.items.companyId }).from(tables.items).where(eq(tables.items.id, input.itemId));
    if (!it || it.companyId !== company.id) throw badRequest("unknown_item");
  }
  const [row] = id
    ? await tx.update(tables.salesmanCommissionRules).set(fields(input)).where(and(eq(tables.salesmanCommissionRules.id, id), eq(tables.salesmanCommissionRules.companyId, company.id))).returning()
    : await tx.insert(tables.salesmanCommissionRules).values({ tenantId: actor.tenantId, companyId: company.id, ...fields(input) }).returning();
  if (!row) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: id ? "update" : "create", entity: "salesman_commission_rule", entityId: row.id, after: { name: row.name, kind: row.kind, ratePct: row.ratePct }, ip: actor.ip });
  return row;
}

export async function deleteRule(tx: Tx, actor: Actor, id: string) {
  const company = await resolveCompany(tx);
  const gone = await tx.delete(tables.salesmanCommissionRules).where(and(eq(tables.salesmanCommissionRules.id, id), eq(tables.salesmanCommissionRules.companyId, company.id))).returning({ id: tables.salesmanCommissionRules.id });
  if (!gone.length) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "delete", entity: "salesman_commission_rule", entityId: id, ip: actor.ip });
}

type Rule = typeof tables.salesmanCommissionRules.$inferSelect;
interface Sold { itemId: string; brand: string | null; category: string | null; mrp: string | null; marginPct?: number | null; ageDays?: number | null }

/** The rule that applies to a sold item: the most specific match; among equals the higher rate. */
export function ruleFor(rules: Rule[], s: Sold) {
  const hits = rules.filter((r) => r.active && (
    r.kind === "all" || (r.kind === "item" && r.itemId === s.itemId) || (r.kind === "brand" && r.match?.toLowerCase() === s.brand?.toLowerCase())
    || (r.kind === "category" && r.match?.toLowerCase() === s.category?.toLowerCase())
    || (r.kind === "margin" && s.marginPct != null && (r.bandFrom === null || s.marginPct >= Number(r.bandFrom)) && (r.bandTo === null || s.marginPct <= Number(r.bandTo)))
    || (r.kind === "age" && s.ageDays != null && (r.bandFrom === null || s.ageDays >= Number(r.bandFrom)) && (r.bandTo === null || s.ageDays <= Number(r.bandTo)))
    || (r.kind === "mrp_range" && s.mrp !== null && (r.mrpFrom === null || dec(s.mrp).gte(r.mrpFrom)) && (r.mrpTo === null || dec(s.mrp).lte(r.mrpTo)))
  ));
  return hits.sort((a, b) => SPECIFICITY[a.kind as Kind] - SPECIFICITY[b.kind as Kind] || Number(b.ratePct) - Number(a.ratePct))[0];
}

/**
 * Each salesman's sales for a month (taxable value, net of returns and credit notes) and the commission the rules give on them.
 * Sales with no salesman are left out; sales no rule covers earn nothing and are counted apart. A line that names a helper splits its
 * commission: the helper's share (a setting) goes to the helper and the rest stays with the salesman, so the total never exceeds what the
 * rule gives. Margin rules look at the margin on standard cost the salesman earned on the item; age rules at the days since the item first came in.
 */
export async function commissionReport(tx: Tx, month: string) {
  const company = await resolveCompany(tx);
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw badRequest("invalid_period");
  const [y, m] = month.split("-").map(Number) as [number, number];
  const from = `${month}-01`;
  const to = new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
  const rules = await tx.select().from(tables.salesmanCommissionRules).where(and(eq(tables.salesmanCommissionRules.companyId, company.id), eq(tables.salesmanCommissionRules.active, true)));
  const share = dec((await posSettings(tx, company.id)).helperSharePct).div(100);
  const rows = await tx.execute<{ salesman_id: string; helper_id: string | null; item_id: string; amount: string; comm_amount: string; qty: string; cost: string; first_in: string | null; brand: string | null; category: string | null; mrp: string | null; name: string; helper_name: string | null }>(sql`
    with x as (${saleLines(company.id, from, to)})
    select x.salesman_id, x.helper_id, x.item_id, sum(x.amount)::text as amount, sum(x.comm_amount)::text as comm_amount, sum(x.qty)::text as qty, i.purchase_rate::text as cost,
      (select min(sl.date) from stock_ledger sl where sl.item_id = x.item_id and sl.qty_in > 0)::text as first_in,
      st.brand, st.category, coalesce(i.mrp, st.mrp)::text as mrp, e.name, h.name as helper_name
    from x join items i on i.id = x.item_id left join styles st on st.id = i.style_id join employees e on e.id = x.salesman_id left join employees h on h.id = x.helper_id
    where x.salesman_id is not null group by x.salesman_id, x.helper_id, x.item_id, i.purchase_rate, st.brand, st.category, i.mrp, st.mrp, e.name, h.name`);
  const monthEnd = Date.parse(`${to}T00:00:00Z`);
  type Acc = { salesmanId: string; name: string; sales: ReturnType<typeof dec>; commission: ReturnType<typeof dec>; sharedAway: ReturnType<typeof dec>; uncovered: ReturnType<typeof dec>; byRule: Map<string, { name: string; sales: ReturnType<typeof dec>; commission: ReturnType<typeof dec> }> };
  const by = new Map<string, Acc>();
  const helpers = new Map<string, { employeeId: string; name: string; sales: ReturnType<typeof dec>; commission: ReturnType<typeof dec> }>();
  for (const r of rows) {
    const e = by.get(r.salesman_id) ?? { salesmanId: r.salesman_id, name: r.name, sales: dec(0), commission: dec(0), sharedAway: dec(0), uncovered: dec(0), byRule: new Map() };
    by.set(r.salesman_id, e);
    const amount = dec(r.amount);
    e.sales = e.sales.plus(amount);
    const marginPct = amount.gt(0) ? amount.minus(dec(r.qty).times(r.cost)).div(amount).times(100).toNumber() : null;
    const ageDays = r.first_in ? Math.max(0, Math.round((monthEnd - Date.parse(`${r.first_in}T00:00:00Z`)) / 86_400_000)) : null;
    const rule = ruleFor(rules, { itemId: r.item_id, brand: r.brand, category: r.category, mrp: r.mrp, marginPct, ageDays });
    if (!rule) { e.uncovered = e.uncovered.plus(amount); continue; }
    const earned = dec(r.comm_amount).times(rule.ratePct).div(100);
    const toHelper = r.helper_id ? earned.times(share) : dec(0);
    e.commission = e.commission.plus(earned.minus(toHelper));
    e.sharedAway = e.sharedAway.plus(toHelper);
    const b = e.byRule.get(rule.id) ?? { name: rule.name, sales: dec(0), commission: dec(0) };
    b.sales = b.sales.plus(amount);
    b.commission = b.commission.plus(earned);
    e.byRule.set(rule.id, b);
    if (r.helper_id) {
      const h = helpers.get(r.helper_id) ?? { employeeId: r.helper_id, name: r.helper_name ?? "", sales: dec(0), commission: dec(0) };
      h.sales = h.sales.plus(amount);
      h.commission = h.commission.plus(toHelper);
      helpers.set(r.helper_id, h);
    }
  }
  // Helper attendance: working days in the month and the days they were away without pay.
  const attendance = helpers.size ? await monthAttendance(tx, month, company.id) : null;
  const helperRows = [];
  for (const h of helpers.values()) {
    const a = attendance?.employees.find((x) => x.id === h.employeeId);
    const working = (await workingDates(tx, company.id, from, to, h.employeeId)).length;
    const lop = a?.lopDays ?? 0;
    helperRows.push({ employeeId: h.employeeId, name: h.name, sales: money(h.sales), commission: money(h.commission), workingDays: working, lossOfPayDays: lop, daysWorked: Math.max(working - lop, 0) });
  }
  const salesmen = [...by.values()].sort((a, b) => b.commission.comparedTo(a.commission));
  return {
    month, from, to, helperSharePct: share.times(100).toFixed(2),
    salesmen: salesmen.map((e) => ({
      salesmanId: e.salesmanId, name: e.name, sales: money(e.sales), commission: money(e.commission), sharedWithHelpers: money(e.sharedAway), uncovered: money(e.uncovered),
      rules: [...e.byRule.values()].map((b) => ({ name: b.name, sales: money(b.sales), commission: money(b.commission) })),
    })),
    helpers: helperRows.sort((a, b) => Number(b.commission) - Number(a.commission)),
    totalCommission: money([...by.values()].reduce((s, e) => s.plus(e.commission).plus(e.sharedAway), dec(0))),
  };
}
