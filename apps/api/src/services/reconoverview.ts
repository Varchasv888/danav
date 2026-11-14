import { and, eq, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { bankRow, compareFigures, dec, overallState, waitingRow, type ReconRow } from "@varchasv/domain";
import { accountBalances, resolveCompany } from "./accounting.js";
import { stockSummary } from "./inventory.js";
import { gstr3b, outstanding } from "./returns.js";

/** The tax period (MMYYYY) of the month before a date: the latest return whose statement should already exist. */
function previousPeriod(asOf: string) {
  let y = Number(asOf.slice(0, 4)), m = Number(asOf.slice(5, 7)) - 1;
  if (m === 0) { m = 12; y -= 1; }
  return `${String(m).padStart(2, "0")}${y}`;
}

/**
 * One list of the places the books must agree with something else, each with its two figures and the difference:
 * customer ledger against the receivables report, supplier ledger against the payables report, stock register against the
 * stock ledger, bank statement lines not yet matched, and GST credit in the books against the GSTR-2B statement. Reads only.
 */
export async function reconciliationOverview(tx: Tx, asOf: string, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const balances = await accountBalances(tx, company.id, null, asOf);
  const ledger = (group: string) => balances.filter((b) => b.groupKey === group).reduce((s, b) => s.plus(b.closing), dec(0));

  const [receivables, payables, stock] = await Promise.all([
    outstanding(tx, company.id, "receivable", asOf), outstanding(tx, company.id, "payable", asOf), stockSummary(tx, company, asOf),
  ]);
  const customers = compareFigures("customers", ledger("sundry_debtors"), receivables.total);
  const suppliers = compareFigures("suppliers", ledger("sundry_creditors").neg(), payables.total);
  const stockRow = compareFigures("stock", stock.totalValue, ledger("stock_in_hand"));

  const [bank] = await tx.select({
    accounts: sql<number>`count(distinct ${tables.bankLines.accountId})::int`,
    unmatched: sql<number>`count(*) filter (where ${tables.bankLines.status} = 'unmatched')::int`,
  }).from(tables.bankLines).where(and(eq(tables.bankLines.companyId, company.id), sql`${tables.bankLines.date} <= ${asOf}::date`));

  const period = previousPeriod(asOf);
  const g = await gstr3b(tx, company.id, period);
  const cmp = g.comparison as { imported: boolean; itcPer2b?: Record<"igst" | "cgst" | "sgst" | "cess", string>; itcPerBooks?: Record<"igst" | "cgst" | "sgst" | "cess", string>; inBooksNotIn2b?: { count: number } };
  const total = (h: Record<string, string>) => (["igst", "cgst", "sgst", "cess"] as const).reduce((s, k) => s.plus(h[k]!), dec(0));
  const gstRow: ReconRow = cmp.imported ? compareFigures("gst", total(cmp.itcPerBooks!), total(cmp.itcPer2b!), 0) : waitingRow("gst");

  const rows: ReconRow[] = [customers, suppliers, stockRow, bankRow(bank?.unmatched ?? 0, bank?.accounts ?? 0), gstRow];
  return { asOf, gstPeriod: period, state: overallState(rows), rows };
}
