import { and, asc, eq, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { businessDate, dec, money } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { accountBalances, postVoucher, resolveCompany } from "./accounting.js";
import { stockValue } from "./inventory.js";
import { outstanding } from "./returns.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

const day = (iso: string) => Date.parse(`${iso}T00:00:00Z`) / 86_400_000;
const addDays = (iso: string, n: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

// ---- credit exposure ---------------------------------------------------------------------------------------

/**
 * What each customer could owe us: the bills they owe, less receipts not yet set against a bill, plus orders accepted but not yet invoiced,
 * against their credit limit. Sorted by how far over the limit they are.
 */
export async function creditExposure(tx: Tx, asOf = businessDate()) {
  const company = await resolveCompany(tx);
  const rec = await outstanding(tx, company.id, "receivable", asOf);
  const orders = await tx.execute<{ customer_id: string; pending: string }>(sql`
    select o.customer_id, sum(o.total * (1 - least(1, coalesce(l.invoiced, 0) / nullif(l.qty, 0))))::text as pending
    from sales_orders o
    join (select order_id, sum(qty) as qty, sum(invoiced_qty) as invoiced from sales_order_lines group by order_id) l on l.order_id = o.id
    where o.company_id = ${company.id} and o.status in ('open', 'partial', 'delivered') group by o.customer_id`);
  const limits = await tx.execute<{ id: string; name: string; credit_limit: string | null }>(sql`select id, name, credit_limit::text from accounts where company_id = ${company.id} and credit_limit is not null`);
  const pending = new Map([...orders].map((o) => [o.customer_id, dec(o.pending)]));
  const limitOf = new Map([...limits].map((l) => [l.id, l]));
  const ids = new Set<string>([...rec.rows.map((r) => r.partyId), ...pending.keys()]);
  const rows = [...ids].map((id) => {
    const r = rec.rows.find((x) => x.partyId === id);
    const owed = dec(r?.balance ?? 0);
    const advance = dec(r?.advance ?? 0);
    const overdue = r ? dec(r.balance).minus((r.buckets.notDue ?? "0")) : dec(0);
    const open = pending.get(id) ?? dec(0);
    const exposure = owed.minus(advance).plus(open);
    const limit = limitOf.get(id)?.credit_limit ?? null;
    return {
      partyId: id, name: r?.name ?? limitOf.get(id)?.name ?? "", owed: money(owed), overdue: money(overdue.gt(0) ? overdue : 0), unappliedReceipts: money(advance), pendingOrders: money(open), exposure: money(exposure),
      limit: limit ? money(limit) : null, headroom: limit ? money(dec(limit).minus(exposure)) : null, over: limit ? exposure.gt(limit) : false,
    };
  }).filter((r) => Number(r.exposure) !== 0 || Number(r.owed) !== 0);
  rows.sort((a, b) => Number(a.headroom ?? 1e15) - Number(b.headroom ?? 1e15));
  return { asOf, rows, totalExposure: money(rows.reduce((t, r) => t.plus(r.exposure), dec(0))), overLimit: rows.filter((r) => r.over).length };
}

// ---- supplier due dates -----------------------------------------------------------------------------------

/** What is owed to suppliers, by the week it falls due, with overdue bills first. */
export async function supplierDueCalendar(tx: Tx, asOf = businessDate(), weeks = 8) {
  const company = await resolveCompany(tx);
  const pay = await outstanding(tx, company.id, "payable", asOf);
  const bills = pay.rows.flatMap((r) => r.openItems.map((o) => ({ supplier: r.name, number: o.number, dueOn: o.dueOn, amount: o.amount, overdue: o.daysOverdue > 0 })));
  const buckets = [{ label: "overdue", from: null as string | null, to: null as string | null, total: dec(0), bills: [] as typeof bills }];
  for (let w = 0; w < weeks; w++) buckets.push({ label: `w${w + 1}`, from: addDays(asOf, w * 7), to: addDays(asOf, w * 7 + 6), total: dec(0), bills: [] });
  buckets.push({ label: "later", from: null, to: null, total: dec(0), bills: [] });
  for (const b of bills) {
    const k = b.dueOn < asOf ? 0 : Math.min(weeks + 1, 1 + Math.floor((day(b.dueOn) - day(asOf)) / 7));
    buckets[k]!.total = buckets[k]!.total.plus(b.amount);
    buckets[k]!.bills.push(b);
  }
  return { asOf, buckets: buckets.map((b) => ({ label: b.label, from: b.from, to: b.to, total: money(b.total), bills: b.bills.sort((x, y) => x.dueOn.localeCompare(y.dueOn)).slice(0, 25) })), total: pay.total };
}

// ---- cheques ----------------------------------------------------------------------------------------------------

export async function addCheque(tx: Tx, actor: Actor, input: { direction: "received" | "issued"; partyId: string; bankAccountId: string; chequeNo: string; drawnOn?: string | null | undefined; chequeDate: string; amount: string; note?: string | null | undefined }) {
  const company = await resolveCompany(tx);
  if (!dec(input.amount).gt(0)) throw badRequest("invalid_amount");
  const found = await tx.select({ id: tables.accounts.id }).from(tables.accounts).where(and(eq(tables.accounts.companyId, company.id), sql`${tables.accounts.id} in (${input.partyId}, ${input.bankAccountId})`));
  if (found.length !== 2) throw badRequest("unknown_account");
  const [dup] = await tx.select({ id: tables.postDatedCheques.id }).from(tables.postDatedCheques).where(and(eq(tables.postDatedCheques.companyId, company.id), eq(tables.postDatedCheques.partyId, input.partyId), eq(tables.postDatedCheques.chequeNo, input.chequeNo), sql`${tables.postDatedCheques.status} <> 'cancelled'`)).limit(1);
  if (dup) throw conflict("cheque_already_recorded");
  const [row] = await tx.insert(tables.postDatedCheques).values({ tenantId: actor.tenantId, companyId: company.id, direction: input.direction, partyId: input.partyId, bankAccountId: input.bankAccountId, chequeNo: input.chequeNo, drawnOn: input.drawnOn ?? null, chequeDate: input.chequeDate, amount: money(input.amount), note: input.note ?? null, createdBy: actor.userId }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "post_dated_cheque", entityId: row!.id, after: { direction: input.direction, chequeNo: input.chequeNo, amount: row!.amount, chequeDate: input.chequeDate }, ip: actor.ip });
  return row!;
}

export async function listCheques(tx: Tx, status?: string) {
  const company = await resolveCompany(tx);
  const rows = await tx.select({ c: tables.postDatedCheques, party: tables.accounts.name }).from(tables.postDatedCheques).innerJoin(tables.accounts, eq(tables.accounts.id, tables.postDatedCheques.partyId))
    .where(and(eq(tables.postDatedCheques.companyId, company.id), status ? eq(tables.postDatedCheques.status, status) : undefined)).orderBy(asc(tables.postDatedCheques.chequeDate));
  return rows.map((r) => ({ id: r.c.id, direction: r.c.direction, party: r.party, partyId: r.c.partyId, bankAccountId: r.c.bankAccountId, chequeNo: r.c.chequeNo, drawnOn: r.c.drawnOn, chequeDate: r.c.chequeDate, amount: r.c.amount, status: r.c.status, note: r.c.note, settledOn: r.c.settledOn }));
}

/** A cheque clears (the money moves in the books), bounces (nothing posts, the customer still owes) or is cancelled. */
export async function settleCheque(tx: Tx, actor: Actor, id: string, outcome: "cleared" | "bounced" | "cancelled", date: string) {
  const [c] = await tx.select().from(tables.postDatedCheques).where(eq(tables.postDatedCheques.id, id)).for("update");
  if (!c) throw notFound();
  if (c.status !== "pending") throw conflict("cheque_not_pending");
  let voucherId: string | null = null;
  if (outcome === "cleared") {
    const lines = c.direction === "received"
      ? [{ accountId: c.bankAccountId, debit: c.amount }, { accountId: c.partyId, credit: c.amount }]
      : [{ accountId: c.partyId, debit: c.amount }, { accountId: c.bankAccountId, credit: c.amount }];
    voucherId = (await postVoucher(tx, actor, { companyId: c.companyId, type: c.direction === "received" ? "receipt" : "payment", date, reference: `Cheque ${c.chequeNo}`, narration: `Cheque ${c.chequeNo} ${c.direction === "received" ? "received" : "issued"} cleared`, lines })).voucher.id;
  }
  await tx.update(tables.postDatedCheques).set({ status: outcome, settledOn: date, voucherId }).where(eq(tables.postDatedCheques.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "post_dated_cheque", entityId: id, after: { outcome, chequeNo: c.chequeNo }, ip: actor.ip });
}

// ---- loans and capital purchases ---------------------------------------------------------------------------

/** The dates a commitment falls due inside a window: its first date, then the same day each month until its end date if it repeats. */
export function commitmentDates(c: { firstDate: string; repeat: string; until: string | null }, from: string, to: string): string[] {
  const out: string[] = [];
  const [y, m, d] = c.firstDate.split("-").map(Number) as [number, number, number];
  for (let i = 0; i < 600; i++) {
    if (i > 0 && c.repeat !== "monthly") break;
    const total = (m - 1) + i;
    const yy = y + Math.floor(total / 12), mm = (total % 12) + 1;
    const last = new Date(Date.UTC(yy, mm, 0)).getUTCDate();
    const date = `${yy}-${String(mm).padStart(2, "0")}-${String(Math.min(d, last)).padStart(2, "0")}`;
    if (date > to) break;
    if (c.until && date > c.until) break;
    if (date >= from) out.push(date);
  }
  return out;
}

export interface CommitmentInput { kind: "loan" | "capex" | "other"; direction: "out" | "in"; name: string; amount: string; firstDate: string; repeat: "once" | "monthly"; until?: string | null | undefined; note?: string | null | undefined }

export async function addCommitment(tx: Tx, actor: Actor, input: CommitmentInput) {
  const company = await resolveCompany(tx);
  if (!dec(input.amount).gt(0)) throw badRequest("invalid_amount");
  if (input.repeat === "once" && input.until) throw badRequest("until_needs_repeat");
  if (input.until && input.until < input.firstDate) throw badRequest("until_before_start");
  const [row] = await tx.insert(tables.cashCommitments).values({ tenantId: actor.tenantId, companyId: company.id, ...input, until: input.until ?? null, note: input.note ?? null, createdBy: actor.userId }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "cash_commitment", entityId: row!.id, after: { name: input.name, amount: input.amount }, ip: actor.ip });
  return row!;
}

export async function listCommitments(tx: Tx) {
  const company = await resolveCompany(tx);
  return tx.select().from(tables.cashCommitments).where(eq(tables.cashCommitments.companyId, company.id)).orderBy(asc(tables.cashCommitments.firstDate));
}

export async function stopCommitment(tx: Tx, actor: Actor, id: string) {
  const [c] = await tx.select().from(tables.cashCommitments).where(eq(tables.cashCommitments.id, id));
  if (!c) throw notFound();
  await tx.update(tables.cashCommitments).set({ active: false }).where(eq(tables.cashCommitments.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "cash_commitment", entityId: id, after: { active: false }, ip: actor.ip });
}

// ---- cash forecast ----------------------------------------------------------------------------------------------

/**
 * Weekly cash for the next weeks from what is already known: bills falling due from customers and to suppliers, post-dated cheques on their dates,
 * and payroll each month at the last run's net pay. Overdue receivables are counted at a share the owner chooses (they are not all coming);
 * overdue payables are assumed paid in the first week. It shows the lowest point so a shortfall is seen early.
 */
export async function cashForecast(tx: Tx, asOf = businessDate(), weeks = 8, collectOverduePct = 50) {
  const company = await resolveCompany(tx);
  const rows = await accountBalances(tx, company.id, null, asOf);
  const keys = await tx.execute<{ id: string; key: string | null; parent: string | null }>(sql`select a.id, g.key, pg.key as parent from accounts a join account_groups g on g.id = a.group_id left join account_groups pg on pg.id = g.parent_id where a.company_id = ${company.id}`);
  const cashIds = new Set([...keys].filter((k) => k.key === "cash_in_hand" || k.key === "bank_accounts").map((k) => k.id));
  const opening = rows.filter((r) => cashIds.has(r.accountId)).reduce((t, r) => t.plus(r.closing), dec(0));
  const rec = await outstanding(tx, company.id, "receivable", asOf);
  const pay = await outstanding(tx, company.id, "payable", asOf);
  const cheques = await tx.select().from(tables.postDatedCheques).where(and(eq(tables.postDatedCheques.companyId, company.id), eq(tables.postDatedCheques.status, "pending")));
  const [lastRun] = await tx.select({ net: tables.payrollRuns.netPay }).from(tables.payrollRuns).where(and(eq(tables.payrollRuns.companyId, company.id), sql`${tables.payrollRuns.status} in ('finalized', 'paid')`)).orderBy(sql`${tables.payrollRuns.period} desc`).limit(1);

  const slots = Array.from({ length: weeks }, (_, w) => ({ from: addDays(asOf, w * 7), to: addDays(asOf, w * 7 + 6), collections: dec(0), payments: dec(0), cheques: dec(0), payroll: dec(0), commitments: dec(0) }));
  const slotOf = (date: string) => (date < asOf ? 0 : Math.floor((day(date) - day(asOf)) / 7));
  const pct = dec(collectOverduePct).div(100);
  for (const p of rec.rows) for (const o of p.openItems) {
    const k = slotOf(o.dueOn);
    if (k >= weeks) continue;
    slots[k]!.collections = slots[k]!.collections.plus(o.daysOverdue > 0 ? dec(o.amount).times(pct) : o.amount);
  }
  for (const p of pay.rows) for (const o of p.openItems) {
    const k = slotOf(o.dueOn);
    if (k >= weeks) continue;
    slots[k]!.payments = slots[k]!.payments.plus(o.amount);
  }
  for (const c of cheques) {
    const k = slotOf(c.chequeDate);
    if (k >= weeks) continue;
    slots[k]!.cheques = slots[k]!.cheques.plus(c.direction === "received" ? c.amount : dec(c.amount).neg());
  }
  const commits = await tx.select().from(tables.cashCommitments).where(and(eq(tables.cashCommitments.companyId, company.id), eq(tables.cashCommitments.active, true)));
  for (const c of commits) {
    for (const date of commitmentDates(c, asOf, addDays(asOf, weeks * 7 - 1))) {
      const k = slotOf(date);
      if (k >= weeks) continue;
      slots[k]!.commitments = slots[k]!.commitments.plus(c.direction === "in" ? c.amount : dec(c.amount).neg());
    }
  }
  if (lastRun && dec(lastRun.net).gt(0)) {
    for (let w = 0; w < weeks; w++) {
      // Salary is paid early in the month: count it in the week that holds the 1st.
      for (let d = 0; d < 7; d++) if (addDays(asOf, w * 7 + d).endsWith("-01")) slots[w]!.payroll = dec(lastRun.net).neg();
    }
  }
  let running = opening;
  let lowest = { week: 0, balance: opening };
  const out = slots.map((s, i) => {
    const net = s.collections.minus(s.payments).plus(s.cheques).plus(s.payroll).plus(s.commitments);
    running = running.plus(net);
    if (running.lt(lowest.balance)) lowest = { week: i + 1, balance: running };
    return { week: i + 1, from: s.from, to: s.to, collections: money(s.collections), payments: money(s.payments), cheques: money(s.cheques), payroll: money(s.payroll), commitments: money(s.commitments), net: money(net), closing: money(running) };
  });
  return { asOf, openingCash: money(opening), collectOverduePct, weeks: out, lowest: { week: lowest.week, balance: money(lowest.balance) }, shortfall: lowest.balance.lt(0) };
}

// ---- bank stock statement ------------------------------------------------------------------------------------

/**
 * The statement a bank asks for against a cash credit limit: stock at cost, receivables under 90 days, less what is owed to suppliers for
 * goods, less the bank's margin, against the sanctioned limit and what is drawn. The margin and limit are the bank's; they are entered here.
 */
export async function drawingPower(tx: Tx, asOf = businessDate(), marginPct = "25", sanctioned = "0") {
  const company = await resolveCompany(tx);
  const stock = dec(await stockValue(tx, company, asOf));
  const rec = await outstanding(tx, company.id, "receivable", asOf);
  const pay = await outstanding(tx, company.id, "payable", asOf);
  let young = dec(0);
  let old = dec(0);
  for (const p of rec.rows) for (const o of p.openItems) (day(asOf) - day(o.date) < 90 ? (young = young.plus(o.amount)) : (old = old.plus(o.amount)));
  const creditors = dec(pay.total);
  const base = stock.plus(young).minus(creditors);
  const margin = dec(marginPct);
  const dp = base.gt(0) ? base.times(dec(100).minus(margin)).div(100) : dec(0);
  const rows = await accountBalances(tx, company.id, null, asOf);
  const keys = await tx.execute<{ id: string }>(sql`select a.id from accounts a join account_groups g on g.id = a.group_id where a.company_id = ${company.id} and g.key = 'bank_od'`);
  const odIds = new Set([...keys].map((k) => k.id));
  const drawn = rows.filter((r) => odIds.has(r.accountId)).reduce((t, r) => t.plus(dec(r.closing).neg()), dec(0));
  const allowed = dec(sanctioned).gt(0) && dp.gt(sanctioned) ? dec(sanctioned) : dp;
  return {
    asOf, marginPct: margin.toFixed(2), sanctioned: money(sanctioned), stock: money(stock), receivablesUnder90: money(young), receivablesOver90: money(old), creditors: money(creditors),
    base: money(base), drawingPower: money(dp), allowed: money(allowed), drawn: money(drawn), available: money(allowed.minus(drawn)), overDrawn: drawn.gt(allowed),
  };
}
