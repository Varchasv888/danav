import { desc, eq, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { SCENARIO_KINDS, businessDate, dec, money, runScenario, type Adjustment, type Baseline } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { accountBalances, profitAndLoss, resolveCompany } from "./accounting.js";
import { stockValue } from "./inventory.js";
import { outstanding } from "./returns.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

const shiftYear = (iso: string, by: number) => { const d = new Date(`${iso}T00:00:00Z`); d.setUTCFullYear(d.getUTCFullYear() + by); return d.toISOString().slice(0, 10); };
const clampDays = (v: number) => Math.max(0, Math.min(365, Math.round(v)));

/** The starting point for a what-if: the last twelve months of sales, cost of goods and running costs, how many days money is tied up, and cash now. */
export async function scenarioBaseline(tx: Tx, today = businessDate()): Promise<Baseline & { from: string; to: string }> {
  const company = await resolveCompany(tx);
  const from = shiftYear(today, -1);
  const pl = await profitAndLoss(tx, company.id, from, today);
  const sales = pl.tradingIncome.reduce((t, r) => t.plus(r.amount), dec(0));
  const cogs = sales.minus(pl.grossProfit);
  const opex = pl.otherExpense.reduce((t, r) => t.plus(r.amount), dec(0)).minus(pl.otherIncome.reduce((t, r) => t.plus(r.amount), dec(0)));
  const rec = dec((await outstanding(tx, company.id, "receivable", today)).total);
  const pay = dec((await outstanding(tx, company.id, "payable", today)).total);
  const stock = dec(await stockValue(tx, company, today));
  const keys = await tx.execute<{ id: string }>(sql`select a.id from accounts a join account_groups g on g.id = a.group_id where a.company_id = ${company.id} and g.key in ('cash_in_hand', 'bank_accounts')`);
  const cashIds = new Set([...keys].map((k) => k.id));
  const cash = (await accountBalances(tx, company.id, null, today)).filter((r) => cashIds.has(r.accountId)).reduce((t, r) => t.plus(r.closing), dec(0));
  return {
    from, to: today, sales: money(sales), costOfGoods: money(cogs.gt(0) ? cogs : 0), operatingCost: money(opex.gt(0) ? opex : 0), cash: money(cash),
    receivableDays: sales.gt(0) ? clampDays(rec.div(sales).times(365).toNumber()) : 0,
    payableDays: cogs.gt(0) ? clampDays(pay.div(cogs).times(365).toNumber()) : 0,
    stockDays: cogs.gt(0) ? clampDays(stock.div(cogs).times(365).toNumber()) : 0,
  };
}

function check(adjustments: Adjustment[]) {
  if (!adjustments.length || adjustments.length > 20) throw badRequest("invalid_adjustments");
  for (const a of adjustments) if (!(SCENARIO_KINDS as readonly string[]).includes(a.kind)) throw badRequest("invalid_adjustments");
}

/** Works out the three cases for a set of changes against the books' baseline (or one given), without saving anything. */
export async function previewScenario(tx: Tx, adjustments: Adjustment[], baseline?: Baseline) {
  check(adjustments);
  const base = baseline ?? (await scenarioBaseline(tx));
  return { inputs: base, ...runScenario(base, adjustments) };
}

export async function saveScenario(tx: Tx, actor: Actor, input: { name: string; adjustments: Adjustment[]; note?: string | null | undefined }) {
  check(input.adjustments);
  const company = await resolveCompany(tx);
  const baseline = await scenarioBaseline(tx);
  const [dup] = await tx.select({ id: tables.scenarios.id }).from(tables.scenarios).where(sql`${tables.scenarios.companyId} = ${company.id} and lower(${tables.scenarios.name}) = lower(${input.name})`).limit(1);
  if (dup) throw conflict("scenario_name_taken");
  const [row] = await tx.insert(tables.scenarios).values({ tenantId: actor.tenantId, companyId: company.id, name: input.name, adjustments: input.adjustments, baseline, note: input.note ?? null, createdBy: actor.userId }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "scenario", entityId: row!.id, after: { name: input.name, changes: input.adjustments.length }, ip: actor.ip });
  return row!;
}

export async function listScenarios(tx: Tx) {
  const company = await resolveCompany(tx);
  const rows = await tx.select().from(tables.scenarios).where(eq(tables.scenarios.companyId, company.id)).orderBy(desc(tables.scenarios.createdAt));
  return rows.map((r) => ({ id: r.id, name: r.name, note: r.note, createdAt: r.createdAt.toISOString(), adjustments: r.adjustments as Adjustment[], result: runScenario(r.baseline as Baseline, r.adjustments as Adjustment[]) }));
}

export async function deleteScenario(tx: Tx, actor: Actor, id: string) {
  const gone = await tx.delete(tables.scenarios).where(eq(tables.scenarios.id, id)).returning({ name: tables.scenarios.name });
  if (!gone.length) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "delete", entity: "scenario", entityId: id, before: { name: gone[0]!.name }, ip: actor.ip });
}
