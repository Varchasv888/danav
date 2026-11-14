import { and, desc, eq, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { businessDate, dec, money } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, forbidden, notFound } from "../lib/errors.js";
import { accountBalances, postVoucher, resolveCompany } from "./accounting.js";
import { resolvePostingAccountIds } from "./ledgerparameters.js";
import { stockPositions } from "./inventory.js";
import { AGE_BUCKETS } from "./insights.js";
import { stockAgeing } from "./ownerreports.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

/** Provision % by how long the stock has sat, unless the owner sets others: nothing for the first three months. */
export const DEFAULT_BANDS: Record<string, number> = { d0_30: 0, d31_60: 0, d61_90: 0, d91_180: 10, d181_365: 25, y1_2: 50, y2plus: 75 };

/**
 * Stock that may be worth less than it cost. For each item, the larger of two measures: the age provision (each age band's share of its cost)
 * and the net realisable value shortfall (cost less what it could sell for after selling costs, where that is lower).
 */
export async function reviewStock(tx: Tx, asOf: string, bands: Record<string, number> = DEFAULT_BANDS, sellingCostPct = "10") {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOf)) throw badRequest("invalid_date");
  const age = await stockAgeing(tx, asOf, 90, true);
  const ids = age.rows.map((r) => r.itemId);
  const rates = ids.length ? await tx.select({ id: tables.items.id, sale: tables.items.saleRate }).from(tables.items).where(sql`${tables.items.id} in ${ids}`) : [];
  const saleOf = new Map(rates.map((r) => [r.id, dec(r.sale)]));
  const lines = age.rows.map((r) => {
    const qty = dec(r.qty);
    const unit = qty.gt(0) ? dec(r.value).div(qty) : dec(0);
    const ageProvision = AGE_BUCKETS.reduce((t, b, k) => t.plus(dec(r.buckets[k] ?? 0).times(unit).times(bands[b.key] ?? 0).div(100)), dec(0));
    const sale = saleOf.get(r.itemId) ?? dec(0);
    const nrvUnit = sale.times(dec(100).minus(sellingCostPct)).div(100);
    const shortfall = sale.gt(0) && nrvUnit.lt(unit) ? unit.minus(nrvUnit).times(qty) : dec(0);
    const writedown = ageProvision.gt(shortfall) ? ageProvision : shortfall;
    return { itemId: r.itemId, name: r.name, qty: r.qty, cost: money(r.value), nrv: money(sale.gt(0) ? nrvUnit.times(qty) : r.value), ageProvision: money(ageProvision), nrvShortfall: money(shortfall), writedown: money(writedown) };
  }).filter((l) => dec(l.writedown).gt(0)).sort((a, b) => Number(b.writedown) - Number(a.writedown));
  const required = lines.reduce((t, l) => t.plus(l.writedown), dec(0));
  return { asOf, bands, sellingCostPct, lines, required: money(required), stockCost: age.total.value };
}

async function provisionAccounts(tx: Tx, actor: Actor, companyId: string) {
  return resolvePostingAccountIds(tx, companyId, ["stock_writedown", "stock_provision"]);
}

/** The provision held now: the credit balance on the provision account. */
async function heldProvision(tx: Tx, companyId: string, asOf: string, id: string) {
  const bal = (await accountBalances(tx, companyId, null, asOf)).find((r) => r.accountId === id);
  return bal ? dec(bal.closing).neg() : dec(0);
}

/** Puts a review forward for approval, with the entry it would make: the extra provision needed, or the part to release. */
export async function proposeWritedown(tx: Tx, actor: Actor, input: { asOf: string; bands?: Record<string, number> | undefined; sellingCostPct?: string | undefined; note?: string | null | undefined }) {
  const company = await resolveCompany(tx);
  const bands = { ...DEFAULT_BANDS, ...(input.bands ?? {}) };
  for (const v of Object.values(bands)) if (!Number.isFinite(v) || v < 0 || v > 100) throw badRequest("invalid_percent");
  const review = await reviewStock(tx, input.asOf, bands, input.sellingCostPct ?? "10");
  const acc = await provisionAccounts(tx, actor, company.id);
  const held = await heldProvision(tx, company.id, input.asOf, acc.stock_provision!);
  const change = dec(review.required).minus(held);
  const [n] = await tx.select({ n: sql<number>`count(*)::int` }).from(tables.stockWritedowns).where(eq(tables.stockWritedowns.companyId, company.id));
  const number = `SW/${input.asOf.slice(0, 4)}/${String((n?.n ?? 0) + 1).padStart(4, "0")}`;
  const [row] = await tx.insert(tables.stockWritedowns).values({
    tenantId: actor.tenantId, companyId: company.id, number, asOf: input.asOf, basis: { bands, sellingCostPct: review.sellingCostPct }, lines: review.lines, required: review.required, held: money(held), change: money(change),
    note: input.note ?? null, requestedBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "stock_writedown", entityId: row!.id, after: { number, required: review.required, held: money(held), change: money(change) }, ip: actor.ip });
  return row!;
}

export async function decideWritedown(tx: Tx, actor: Actor, id: string, input: { decision: "approve" | "reject"; date?: string | undefined }) {
  const [w] = await tx.select().from(tables.stockWritedowns).where(eq(tables.stockWritedowns.id, id)).for("update");
  if (!w) throw notFound();
  if (w.status !== "pending") throw conflict("writedown_already_decided");
  if (w.requestedBy === actor.userId) throw forbidden("cannot_approve_own_writedown");
  let voucherId: string | null = null;
  if (input.decision === "approve" && !dec(w.change).isZero()) {
    const acc = await provisionAccounts(tx, actor, w.companyId);
    const amount = money(dec(w.change).abs());
    const grow = dec(w.change).gt(0);
    voucherId = (await postVoucher(tx, actor, {
      companyId: w.companyId, type: "journal", date: input.date ?? businessDate(), reference: w.number,
      narration: `${grow ? "Provision for" : "Release of provision for"} stock write-down ${w.number} (as of ${w.asOf})`,
      lines: grow ? [{ accountId: acc.stock_writedown!, debit: amount }, { accountId: acc.stock_provision!, credit: amount }] : [{ accountId: acc.stock_provision!, debit: amount }, { accountId: acc.stock_writedown!, credit: amount }],
    })).voucher.id;
  }
  const [row] = await tx.update(tables.stockWritedowns).set({ status: input.decision === "approve" ? "approved" : "rejected", decidedBy: actor.userId, decidedAt: new Date(), voucherId }).where(eq(tables.stockWritedowns.id, id)).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "stock_writedown", entityId: id, after: { decision: input.decision, number: w.number, change: w.change }, ip: actor.ip });
  return row!;
}

export async function listWritedowns(tx: Tx) {
  const company = await resolveCompany(tx);
  const rows = await tx.select({ w: tables.stockWritedowns, by: tables.users.name }).from(tables.stockWritedowns).leftJoin(tables.users, eq(tables.users.id, tables.stockWritedowns.requestedBy))
    .where(eq(tables.stockWritedowns.companyId, company.id)).orderBy(desc(tables.stockWritedowns.createdAt));
  return rows.map((r) => ({ ...r.w, lines: r.w.lines.slice(0, 50), lineCount: r.w.lines.length, requestedByName: r.by }));
}

// ---- cost centres: store, branch (GSTIN) and channel ----------------------------------------------------------

/**
 * Where the stock sits and where the sales came from, by store, by GSTIN and by channel (counter on the web, counter on a device, wholesale
 * invoices). These are the cost centres a head office compares; stock is valued at cost at the date and sales are net of tax for the period.
 */
export async function costCentres(tx: Tx, asOf: string, from: string, to: string) {
  const company = await resolveCompany(tx);
  const whs = await tx.select({ w: tables.warehouses, branch: tables.branches.name, gstin: tables.branches.gstin }).from(tables.warehouses).leftJoin(tables.branches, eq(tables.branches.id, tables.warehouses.branchId)).where(eq(tables.warehouses.companyId, company.id));
  const positions = await stockPositions(tx, company, asOf);
  const stock = whs.map(({ w, branch, gstin }) => {
    const mine = positions.filter((p) => p.warehouseId === w.id);
    return { warehouse: w.name, branch, gstin, qty: mine.reduce((t, p) => t.plus(p.qty), dec(0)).toString(), value: mine.reduce((t, p) => t.plus(p.value), dec(0)).toString() };
  }).filter((x) => !dec(x.value).isZero() || !dec(x.qty).isZero()).sort((a, b) => Number(b.value) - Number(a.value));
  const counter = await tx.execute<{ channel: string; store: string | null; branch: string | null; gstin: string | null; bills: number; sales: string }>(sql`
    select b.source as channel, w.name as store, br.name as branch, br.gstin, count(*)::int as bills, sum(b.taxable)::text as sales
    from pos_bills b join pos_terminals t on t.id = b.terminal_id join warehouses w on w.id = t.warehouse_id left join branches br on br.id = w.branch_id
    where b.company_id = ${company.id} and b.status = 'paid' and b.date between ${from}::date and ${to}::date group by b.source, w.name, br.name, br.gstin`);
  const wholesale = await tx.execute<{ branch: string | null; gstin: string | null; bills: number; sales: string }>(sql`
    select br.name as branch, br.gstin, count(*)::int as bills, sum(i.taxable)::text as sales
    from sales_invoices i left join branches br on br.id = i.branch_id
    where i.company_id = ${company.id} and i.status = 'posted' and i.date between ${from}::date and ${to}::date group by br.name, br.gstin`);
  const sales = [
    ...[...counter].map((r) => ({ channel: r.channel === "device" ? "counterDevice" : "counterWeb", store: r.store, branch: r.branch, gstin: r.gstin, bills: r.bills, sales: money(r.sales) })),
    ...[...wholesale].map((r) => ({ channel: "wholesale", store: null as string | null, branch: r.branch, gstin: r.gstin, bills: r.bills, sales: money(r.sales) })),
  ].sort((a, b) => Number(b.sales) - Number(a.sales));
  const byGstin = new Map<string, { gstin: string; branch: string; stock: ReturnType<typeof dec>; sales: ReturnType<typeof dec> }>();
  const bucket = (gstin: string | null, branch: string | null) => {
    const key = gstin ?? branch ?? "-";
    const cur = byGstin.get(key) ?? { gstin: gstin ?? "", branch: branch ?? "-", stock: dec(0), sales: dec(0) };
    byGstin.set(key, cur);
    return cur;
  };
  for (const s of stock) { const b = bucket(s.gstin, s.branch); b.stock = b.stock.plus(s.value); }
  for (const s of sales) { const b = bucket(s.gstin, s.branch); b.sales = b.sales.plus(s.sales); }
  return {
    asOf, from, to,
    stores: [...stock].map((s) => ({ store: s.warehouse, branch: s.branch, gstin: s.gstin, qty: dec(s.qty).toFixed(0), value: money(s.value) })),
    sales, byGstin: [...byGstin.values()].map((g) => ({ gstin: g.gstin, branch: g.branch, stock: money(g.stock), sales: money(g.sales) })),
  };
}
