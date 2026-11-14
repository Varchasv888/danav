import { and, eq } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, notFound } from "../lib/errors.js";
import { accountBalances, resolveCompany } from "./accounting.js";
import { branchComparison } from "./distribution.js";
import { profitability } from "./profitability.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

export type AllocationBasis = "sales" | "stock" | "equal" | "fixed";

/**
 * Splits `total` over weights to the paisa, giving the leftover paise to the largest remainders so the parts always add up to the total.
 * All-zero weights share evenly rather than lose the money.
 */
export function spreadMoney(total: string, weights: string[]): string[] {
  if (!weights.length) return [];
  const w = weights.map((x) => dec(x));
  const sum = w.reduce((t, x) => t.plus(x), dec(0));
  const use = sum.isZero() ? w.map(() => dec(1)) : w;
  const useSum = use.reduce((t, x) => t.plus(x), dec(0));
  const cents = dec(total).times(100).round();
  const exact = use.map((x) => cents.times(x).div(useSum));
  const floors = exact.map((x) => x.floor());
  let left = cents.minus(floors.reduce((t, x) => t.plus(x), dec(0))).toNumber();
  const order = exact.map((x, i) => ({ i, r: x.minus(floors[i]!) })).sort((a, b) => b.r.comparedTo(a.r));
  const out = floors.map((x) => x);
  for (const o of order) { if (left <= 0) break; out[o.i] = out[o.i]!.plus(1); left--; }
  return out.map((x) => x.div(100).toFixed(2));
}

export async function setAllocationRule(tx: Tx, actor: Actor, input: { accountId: string; basis: AllocationBasis; shares?: Record<string, string> | undefined }) {
  const company = await resolveCompany(tx);
  const rows = await accountBalances(tx, company.id, null, "9999-12-31");
  const acct = rows.find((r) => r.accountId === input.accountId);
  if (!acct) throw notFound();
  if (acct.nature !== "expense") throw badRequest("not_an_expense_account");
  if (input.basis === "fixed") {
    const total = Object.values(input.shares ?? {}).reduce((t, v) => t.plus(v), dec(0));
    if (!total.eq(100)) throw badRequest("shares_must_total_100");
  }
  const shares = input.basis === "fixed" ? input.shares ?? {} : null;
  await tx.insert(tables.expenseAllocationRules).values({ tenantId: actor.tenantId, companyId: company.id, accountId: input.accountId, basis: input.basis, shares, updatedBy: actor.userId })
    .onConflictDoUpdate({ target: [tables.expenseAllocationRules.companyId, tables.expenseAllocationRules.accountId], set: { basis: input.basis, shares, updatedBy: actor.userId, updatedAt: new Date() } });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "expense_allocation_rule", entityId: input.accountId, after: { basis: input.basis }, ip: actor.ip });
}

export async function removeAllocationRule(tx: Tx, actor: Actor, accountId: string) {
  const company = await resolveCompany(tx);
  await tx.delete(tables.expenseAllocationRules).where(and(eq(tables.expenseAllocationRules.companyId, company.id), eq(tables.expenseAllocationRules.accountId, accountId)));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "delete", entity: "expense_allocation_rule", entityId: accountId, ip: actor.ip });
}

/**
 * The period's expenses spread over the stores by each account's rule, beside each store's sales and gross margin, so a store's result carries its
 * share of rent, salaries and the rest. Expenses with no rule are listed as unallocated rather than guessed at.
 */
export async function storeResults(tx: Tx, from: string, to: string) {
  if (to < from) throw badRequest("invalid_dates");
  const company = await resolveCompany(tx);
  const cmp = await branchComparison(tx, from, to);
  const stores = cmp.rows;
  const rules = await tx.select().from(tables.expenseAllocationRules).where(eq(tables.expenseAllocationRules.companyId, company.id));
  const balances = (await accountBalances(tx, company.id, from, to)).filter((r) => r.nature === "expense");
  const margin = await profitability(tx, from, to, "store");
  const perStore = new Map(stores.map((s) => [s.warehouseId, { sales: s.sales, expenses: dec(0), lines: [] as { account: string; amount: string }[] }]));
  const unallocated: { account: string; amount: string }[] = [];
  let allocatedTotal = dec(0);
  for (const b of balances) {
    const amount = dec(b.debit).minus(b.credit);
    if (amount.isZero()) continue;
    const rule = rules.find((r) => r.accountId === b.accountId);
    if (!rule || !stores.length) { unallocated.push({ account: b.name, amount: money(amount) }); continue; }
    const weights = stores.map((s) => rule.basis === "sales" ? s.sales : rule.basis === "stock" ? s.stockValue : rule.basis === "equal" ? "1" : (rule.shares?.[s.warehouseId] ?? "0"));
    const parts = spreadMoney(amount.toFixed(2), weights);
    stores.forEach((s, i) => {
      const cur = perStore.get(s.warehouseId)!;
      cur.expenses = cur.expenses.plus(parts[i]!);
      cur.lines.push({ account: b.name, amount: parts[i]! });
    });
    allocatedTotal = allocatedTotal.plus(amount);
  }
  const rows = stores.map((s) => {
    const cur = perStore.get(s.warehouseId)!;
    const m = margin.rows.find((r: { name: string }) => r.name === s.store);
    const gm = m ? dec(m.grossMargin) : null;
    return { warehouseId: s.warehouseId, store: s.store, sales: s.sales, grossMargin: gm ? money(gm) : null, expenses: money(cur.expenses), result: gm ? money(gm.minus(cur.expenses)) : null, lines: cur.lines };
  });
  return {
    from, to, rows, accounts: balances.map((b) => ({ id: b.accountId, name: b.name })), allocated: money(allocatedTotal), unallocated, unallocatedTotal: money(unallocated.reduce((t, u) => t.plus(u.amount), dec(0))),
    rules: rules.map((r) => ({ accountId: r.accountId, account: balances.find((b) => b.accountId === r.accountId)?.name ?? "", basis: r.basis, shares: r.shares })),
  };
}
