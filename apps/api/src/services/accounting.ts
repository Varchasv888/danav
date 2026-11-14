import { and, asc, desc, eq, gte, inArray, isNull, lte, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import {
  ACCOUNT_TEMPLATE, CASH_BANK_GROUPS, GROUP_TEMPLATE, checkGstDocumentNumber, dec, fiscalYearFor, fiscalYearOf, formatDocumentNumber, money, sum,
  VOUCHER_TYPES, validateVoucher, type VoucherType,
} from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { dayBefore, stockValue } from "./inventory.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";

export const SERIES_FOR: Record<VoucherType, { docType: string; name: string; pattern: string }> = {
  journal: { docType: "journal", name: "Journal vouchers", pattern: "JV/{FY}/{SEQ:5}" },
  payment: { docType: "payment", name: "Payments", pattern: "PAY/{FY}/{SEQ:5}" },
  receipt: { docType: "receipt", name: "Receipts", pattern: "RCT/{FY}/{SEQ:5}" },
  contra: { docType: "contra", name: "Contra vouchers", pattern: "CV/{FY}/{SEQ:5}" },
};

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

/** The company a request works on: the one asked for, or the tenant's first. */
export async function resolveCompany(tx: Tx, companyId?: string) {
  const rows = await tx
    .select()
    .from(tables.companies)
    .where(companyId ? eq(tables.companies.id, companyId) : undefined)
    .orderBy(asc(tables.companies.createdAt))
    .limit(1);
  if (!rows[0]) throw notFound("company_not_found");
  return rows[0];
}

/** Seeds the Tally-style chart of accounts for a company if it has none yet. */
export async function ensureChart(tx: Tx, tenantId: string, companyId: string) {
  const [existing] = await tx.select({ id: tables.accountGroups.id }).from(tables.accountGroups).where(eq(tables.accountGroups.companyId, companyId)).limit(1);
  if (existing) return;
  const ids = new Map<string, string>();
  // Parents come before children in the template, so one pass is enough.
  for (const g of GROUP_TEMPLATE) {
    const [row] = await tx.insert(tables.accountGroups).values({
      tenantId, companyId, key: g.key, name: g.name, nameHi: g.nameHi, nature: g.nature, pl: g.pl ?? null,
      parentId: g.parent ? ids.get(g.parent)! : null, system: true,
    }).returning({ id: tables.accountGroups.id });
    ids.set(g.key, row!.id);
  }
  await tx.insert(tables.accounts).values(ACCOUNT_TEMPLATE.map((a) => ({
    tenantId, companyId, groupId: ids.get(a.group)!, key: a.key, name: a.name, nameHi: a.nameHi, system: true,
  })));
}

/**
 * Adds template ledgers a company doesn't have yet (by key), for businesses created before a module
 * that needs them (e.g. payroll's statutory payables) existed.
 */
export async function ensureTemplateAccounts(tx: Tx, tenantId: string, companyId: string, keys: string[]) {
  const have = await tx.select({ key: tables.accounts.key }).from(tables.accounts).where(and(eq(tables.accounts.companyId, companyId), inArray(tables.accounts.key, keys)));
  const missing = ACCOUNT_TEMPLATE.filter((a) => keys.includes(a.key) && !have.some((h) => h.key === a.key));
  if (!missing.length) return;
  const groups = await tx.select({ id: tables.accountGroups.id, key: tables.accountGroups.key }).from(tables.accountGroups).where(eq(tables.accountGroups.companyId, companyId));
  await tx.insert(tables.accounts).values(missing.map((a) => ({
    tenantId, companyId, groupId: groups.find((g) => g.key === a.group)!.id, key: a.key, name: a.name, nameHi: a.nameHi, system: true,
  }))).onConflictDoNothing(); // another request may have added them a moment ago
}

/**
 * The fiscal year a date falls in. A date in a later year than any existing one opens that year
 * (with the same number-series patterns), as Indian businesses roll over on 1 April.
 */
export async function fiscalYearForDate(tx: Tx, tenantId: string, company: { id: string; booksBeginOn: string }, isoDate: string) {
  if (isoDate < company.booksBeginOn) throw badRequest("before_books_begin");
  const target = fiscalYearOf(isoDate);
  const [fy] = await tx.select().from(tables.fiscalYears)
    .where(and(eq(tables.fiscalYears.companyId, company.id), eq(tables.fiscalYears.label, target.label)));
  if (fy) return fy;

  const [latest] = await tx.select().from(tables.fiscalYears).where(eq(tables.fiscalYears.companyId, company.id)).orderBy(desc(tables.fiscalYears.startsOn)).limit(1);
  const [created] = await tx.insert(tables.fiscalYears).values({ tenantId, companyId: company.id, label: target.label, startsOn: target.start, endsOn: target.end }).returning();
  if (latest) {
    const prevSeries = await tx.select().from(tables.numberSeries).where(and(eq(tables.numberSeries.fiscalYearId, latest.id), isNull(tables.numberSeries.deviceId)));
    if (prevSeries.length) {
      await tx.insert(tables.numberSeries).values(prevSeries.map((s) => ({
        tenantId, companyId: company.id, branchId: s.branchId, fiscalYearId: created!.id, docType: s.docType, name: s.name, pattern: s.pattern, isDefault: s.isDefault,
      })));
    }
  }
  return created!;
}

export function assertPeriodOpen(fy: { closed: boolean; lockedUpTo: string | null }, isoDate: string) {
  if (fy.closed) throw conflict("period_closed");
  if (fy.lockedUpTo && isoDate <= fy.lockedUpTo) throw conflict("period_locked");
}

/** The number the next document of a series will get, without taking it (another user may take it first). */
export async function peekNumber(tx: Tx, companyId: string, fy: { id: string; startsOn: string }, series: { docType: string; pattern: string }) {
  const [row] = await tx.execute<{ pattern: string; seq: number }>(sql`
    select pattern, next_seq as seq from number_series
    where company_id = ${companyId} and fiscal_year_id = ${fy.id} and doc_type = ${series.docType} and device_id is null
    order by is_default desc, created_at limit 1`);
  const f = fiscalYearFor(Number(fy.startsOn.slice(0, 4)));
  return formatDocumentNumber(row?.pattern ?? series.pattern, { fyShort: f.short, fyLabel: f.label, seq: Number(row?.seq ?? 1) });
}

/** Takes the next number from the default series (row-locked, so concurrent posts never share a number). */
export async function allocateNumber(tx: Tx, tenantId: string, companyId: string, fy: { id: string; startsOn: string }, series: { docType: string; name: string; pattern: string }) {
  const take = () => tx.execute<{ pattern: string; seq: number }>(sql`
    update number_series set next_seq = next_seq + 1
    where id = (
      select id from number_series
      where company_id = ${companyId} and fiscal_year_id = ${fy.id} and doc_type = ${series.docType} and device_id is null
      order by is_default desc, created_at limit 1
      for update
    )
    returning pattern, next_seq - 1 as seq`);
  let [row] = await take();
  if (!row) {
    await tx.insert(tables.numberSeries).values({ tenantId, companyId, fiscalYearId: fy.id, isDefault: true, ...series });
    [row] = await take();
  }
  const f = fiscalYearFor(Number(fy.startsOn.slice(0, 4)));
  return formatDocumentNumber(row!.pattern, { fyShort: f.short, fyLabel: f.label, seq: Number(row!.seq) });
}

/** Vouchers generated by documents (a purchase bill, a debit note); never entered by hand. */
export type DocumentVoucherType = "purchase" | "debit_note" | "sales" | "credit_note" | "gateway_settlement" | "asset_purchase" | "depreciation" | "asset_disposal" | "expense_claim" | "brokerage" | "gift_voucher" | "repair";

export interface VoucherInput {
  companyId?: string | undefined;
  type: VoucherType | DocumentVoucherType;
  /** Document vouchers carry the document's own number (e.g. PB/26-27/00001). */
  documentNumber?: string | undefined;
  date: string;
  narration?: string | undefined;
  reference?: string | undefined;
  clientId?: string | undefined;
  lines: { accountId: string; debit?: string | undefined; credit?: string | undefined; narration?: string | undefined }[];
  /** Offline devices: the voucher id, and the number (and its sequence) the device already printed. */
  id?: string | undefined;
  device?: { id: string; number: string; seq: number } | undefined;
}

/** Device-series patterns: one letter per voucher type, then the device code. "PA1/26-27/00001" is 15 characters. */
export const DEVICE_SERIES: Record<VoucherType, { docType: string; name: string; pattern: string }> = {
  journal: { docType: "journal", name: "Journal (device)", pattern: "J{DEV}/{FY}/{SEQ:5}" },
  payment: { docType: "payment", name: "Payments (device)", pattern: "P{DEV}/{FY}/{SEQ:5}" },
  receipt: { docType: "receipt", name: "Receipts (device)", pattern: "R{DEV}/{FY}/{SEQ:5}" },
  contra: { docType: "contra", name: "Contra (device)", pattern: "C{DEV}/{FY}/{SEQ:5}" },
};

/** Keeps the device's series on the server at least one past the highest number the device used. */
async function recordDeviceNumber(tx: Tx, tenantId: string, companyId: string, fy: { id: string }, type: VoucherType, deviceId: string, seq: number) {
  const s = DEVICE_SERIES[type];
  const updated = await tx.update(tables.numberSeries)
    .set({ nextSeq: sql`greatest(${tables.numberSeries.nextSeq}, ${seq + 1})` })
    .where(and(eq(tables.numberSeries.companyId, companyId), eq(tables.numberSeries.fiscalYearId, fy.id), eq(tables.numberSeries.docType, s.docType), eq(tables.numberSeries.deviceId, deviceId)))
    .returning({ id: tables.numberSeries.id });
  if (!updated.length) {
    await tx.insert(tables.numberSeries).values({ tenantId, companyId, fiscalYearId: fy.id, deviceId, docType: s.docType, name: s.name, pattern: s.pattern, nextSeq: seq + 1 });
  }
}

export async function postVoucher(tx: Tx, actor: Actor, input: VoucherInput) {
  const clientId = input.clientId ?? input.id;
  if (clientId) {
    const [dup] = await tx.select().from(tables.vouchers).where(eq(tables.vouchers.clientId, clientId));
    if (dup) return { voucher: dup, replayed: true };
  }
  const company = await resolveCompany(tx, input.companyId);
  const accountIds = [...new Set(input.lines.map((l) => l.accountId))];
  const accts = await tx
    .select({ id: tables.accounts.id, archived: tables.accounts.archived, companyId: tables.accounts.companyId, groupKey: tables.accountGroups.key, parentKey: sql<string | null>`(select g2.key from account_groups g2 where g2.id = ${tables.accountGroups.parentId})` })
    .from(tables.accounts)
    .innerJoin(tables.accountGroups, eq(tables.accountGroups.id, tables.accounts.groupId))
    .where(inArray(tables.accounts.id, accountIds));
  const byId = new Map(accts.map((a) => [a.id, a]));
  for (const id of accountIds) {
    const a = byId.get(id);
    if (!a || a.companyId !== company.id) throw badRequest("unknown_account");
    if (a.archived) throw badRequest("account_archived");
  }
  const isCashBank = (id: string) => {
    const a = byId.get(id)!;
    return (CASH_BANK_GROUPS as readonly string[]).includes(a.groupKey ?? "") || (CASH_BANK_GROUPS as readonly string[]).includes(a.parentKey ?? "");
  };
  const lines = input.lines.map((l) => ({ ...l, debit: l.debit ? money(l.debit) : undefined, credit: l.credit ? money(l.credit) : undefined, cashOrBank: isCashBank(l.accountId) }));
  const manualType = (VOUCHER_TYPES as readonly string[]).includes(input.type) ? (input.type as VoucherType) : null;
  // Document vouchers only need to balance; the type-specific cash/bank rules are for manual vouchers.
  const errors = validateVoucher(manualType ?? "journal", lines);
  if (errors.length) throw badRequest(errors[0]!.code);

  const fy = await fiscalYearForDate(tx, actor.tenantId, company, input.date);
  assertPeriodOpen(fy, input.date);
  let number: string;
  if (input.documentNumber) {
    number = input.documentNumber;
  } else if (!manualType) {
    throw new Error(`document voucher ${input.type} needs its document number`);
  } else if (input.device) {
    // The device printed this number offline from its own series; it must still be GST-valid and unique.
    if (checkGstDocumentNumber(input.device.number)) throw badRequest("invalid_number");
    number = input.device.number;
    await recordDeviceNumber(tx, actor.tenantId, company.id, fy, manualType, input.device.id, input.device.seq);
  } else {
    number = await allocateNumber(tx, actor.tenantId, company.id, fy, SERIES_FOR[manualType]);
  }
  const total = money(sum(lines.map((l) => l.debit ?? 0)));

  const [voucher] = await tx.insert(tables.vouchers).values({
    ...(input.id ? { id: input.id } : {}),
    tenantId: actor.tenantId, companyId: company.id, fiscalYearId: fy.id, type: input.type, number, date: input.date,
    narration: input.narration ?? null, reference: input.reference ?? null, total, clientId: clientId ?? null, createdBy: actor.userId,
    deviceId: input.device?.id ?? null,
  }).returning().catch((e) => {
    if (e?.cause?.code === "23505") throw conflict("duplicate_number");
    throw e;
  });
  await tx.insert(tables.voucherLines).values(lines.map((l, i) => ({
    tenantId: actor.tenantId, voucherId: voucher!.id, lineNo: i + 1, accountId: l.accountId,
    debit: l.debit ?? "0", credit: l.credit ?? "0", narration: l.narration ?? null,
  })));
  await tx.insert(tables.glEntries).values(lines.map((l) => ({
    tenantId: actor.tenantId, companyId: company.id, voucherId: voucher!.id, accountId: l.accountId, date: input.date,
    debit: l.debit ?? "0", credit: l.credit ?? "0",
  })));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "voucher", entityId: voucher!.id, after: { type: input.type, number, date: input.date, total }, ip: actor.ip });
  return { voucher: voucher!, replayed: false };
}

/** Cancelling never deletes: the voucher is marked cancelled and reversing ledger rows are posted. */
export async function cancelVoucher(tx: Tx, actor: Actor, voucherId: string, reason: string) {
  const [v] = await tx.select().from(tables.vouchers).where(eq(tables.vouchers.id, voucherId)).for("update");
  if (!v) throw notFound();
  if (v.status === "cancelled") throw conflict("already_cancelled");
  const [fy] = await tx.select().from(tables.fiscalYears).where(eq(tables.fiscalYears.id, v.fiscalYearId));
  assertPeriodOpen(fy!, v.date);
  const entries = await tx.select().from(tables.glEntries).where(and(eq(tables.glEntries.voucherId, v.id), eq(tables.glEntries.isReversal, false)));
  await tx.insert(tables.glEntries).values(entries.map((e) => ({
    tenantId: e.tenantId, companyId: e.companyId, voucherId: e.voucherId, accountId: e.accountId, date: e.date,
    debit: e.credit, credit: e.debit, isReversal: true,
  })));
  await tx.update(tables.vouchers).set({ status: "cancelled", cancelledAt: new Date(), cancelledBy: actor.userId, cancelReason: reason }).where(eq(tables.vouchers.id, v.id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "voucher", entityId: v.id, before: { status: "posted" }, after: { status: "cancelled", reason }, ip: actor.ip });
}

// ---- Reports ------------------------------------------------------------------------------------

export interface BalanceRow {
  accountId: string;
  name: string;
  nameHi: string | null;
  groupId: string;
  groupName: string;
  groupNameHi: string | null;
  groupKey: string;
  accountKey: string | null;
  nature: string;
  pl: string | null;
  opening: string;
  debit: string;
  credit: string;
  closing: string; // positive = Dr, negative = Cr
}

/** Balance of every account: opening (books-begin balance + movements before `from`) and movements in [from, to]. */
export async function accountBalances(tx: Tx, companyId: string, from: string | null, to: string): Promise<BalanceRow[]> {
  const rows = await tx.execute<{
    account_id: string; name: string; name_hi: string | null; group_id: string; group_name: string; group_name_hi: string | null;
    account_key: string | null; nature: string; pl: string | null; group_key: string; opening: string; debit: string; credit: string;
  }>(sql`
    select a.id as account_id, a.name, a.name_hi, g.id as group_id, g.name as group_name, g.name_hi as group_name_hi,
           a.key as account_key, g.nature, coalesce(g.pl, pg.pl) as pl, g.key as group_key,
           a.opening_balance + coalesce(sum(e.debit - e.credit) filter (where ${from}::date is not null and e.date < ${from}::date), 0) as opening,
           coalesce(sum(e.debit) filter (where ${from}::date is null or e.date >= ${from}::date), 0) as debit,
           coalesce(sum(e.credit) filter (where ${from}::date is null or e.date >= ${from}::date), 0) as credit
    from accounts a
    join account_groups g on g.id = a.group_id
    left join account_groups pg on pg.id = g.parent_id
    left join gl_entries e on e.account_id = a.id and e.date <= ${to}::date
    where a.company_id = ${companyId}
    group by a.id, g.id, pg.pl
    order by g.name, a.name`);
  return rows.map((r) => ({
    accountId: r.account_id, name: r.name, nameHi: r.name_hi, groupId: r.group_id, groupName: r.group_name, groupNameHi: r.group_name_hi,
    nature: r.nature, pl: r.pl, groupKey: r.group_key, accountKey: r.account_key,
    opening: money(r.opening), debit: money(r.debit), credit: money(r.credit),
    closing: money(dec(r.opening).plus(r.debit).minus(r.credit)),
  }));
}

/** Stock value on a date, for the company's valuation method (0 when there's no inventory). */
async function stockOn(tx: Tx, companyId: string, isoDate: string) {
  const company = await resolveCompany(tx, companyId);
  return dec(await stockValue(tx, company, isoDate));
}

export async function trialBalance(tx: Tx, companyId: string, asOf: string) {
  const company = await resolveCompany(tx, companyId);
  const rows = (await accountBalances(tx, companyId, null, asOf)).filter((r) => !dec(r.closing).isZero());
  // Opening stock (items' opening balances) is a debit, as in Tally's trial balance.
  const openingStock = await stockOn(tx, companyId, dayBefore(company.booksBeginOn));
  const stockLedgerValue = sum(rows.filter((r) => r.groupKey === "stock_in_hand").map((r) => r.closing));
  const [closeMarker] = await tx.execute<{ posted: boolean }>(sql`
    select exists (
      select 1 from vouchers v
      join voucher_lines vl on vl.voucher_id = v.id
      join accounts a on a.id = vl.account_id
      where v.company_id = ${companyId} and v.type = 'journal' and v.status = 'posted'
        and v.date <= ${asOf}::date and a.key = 'stock_change'
    ) as posted`);
  const trialBalanceOpeningStock = closeMarker?.posted && dec(stockLedgerValue).eq(await stockOn(tx, companyId, asOf)) ? "0.00" : openingStock;
  const totalDr = sum(rows.filter((r) => dec(r.closing).gt(0)).map((r) => r.closing)).plus(trialBalanceOpeningStock);
  const totalCr = sum(rows.filter((r) => dec(r.closing).lt(0)).map((r) => dec(r.closing).neg()));
  return {
    asOf,
    rows: rows.map((r) => ({ ...r, dr: dec(r.closing).gt(0) ? r.closing : "0.00", cr: dec(r.closing).lt(0) ? money(dec(r.closing).neg()) : "0.00" })),
    openingStock: money(trialBalanceOpeningStock),
    totalDebit: money(totalDr),
    totalCredit: money(totalCr),
    /** Non-zero only when opening balances were entered unevenly (Tally shows this too). */
    openingDifference: money(totalDr.minus(totalCr)),
  };
}

export async function profitAndLoss(tx: Tx, companyId: string, from: string, to: string) {
  // Periodic inventory, as in Tally: gross profit = sales − purchases − opening stock + closing stock.
  const openingStock = await stockOn(tx, companyId, dayBefore(from));
  const closingStock = await stockOn(tx, companyId, to);
  const rows = (await accountBalances(tx, companyId, from, to)).filter((r) => r.nature === "income" || r.nature === "expense");
  // Period movement only: income is credit-normal, expense debit-normal.
  const amount = (r: BalanceRow) => (r.nature === "income" ? dec(r.credit).minus(r.debit) : dec(r.debit).minus(r.credit));
  const pick = (nature: string, pl: string) => rows.filter((r) => r.nature === nature && r.pl === pl && !amount(r).isZero()).map((r) => ({ ...r, amount: money(amount(r)) }));
  const tradingIncome = pick("income", "trading");
  const tradingExpense = pick("expense", "trading");
  const otherIncome = pick("income", "operating");
  const otherExpense = pick("expense", "operating");
  const hasStockChangePosting = rows.some((r) => r.accountKey === "stock_change" && !amount(r).isZero());
  const openingLedgerStock = hasStockChangePosting
    ? sum((await accountBalances(tx, companyId, null, dayBefore(from))).filter((r) => r.groupKey === "stock_in_hand").map((r) => r.closing))
    : dec(0);
  const total = (xs: { amount: string }[]) => sum(xs.map((x) => x.amount));
  const grossProfit = total(tradingIncome).minus(total(tradingExpense))
    .minus(openingStock)
    .plus(hasStockChangePosting ? openingLedgerStock : closingStock);
  const netProfit = grossProfit.plus(total(otherIncome)).minus(total(otherExpense));
  return {
    from, to, tradingIncome, tradingExpense, otherIncome, otherExpense,
    openingStock: money(openingStock), closingStock: money(hasStockChangePosting ? 0 : closingStock),
    grossProfit: money(grossProfit), netProfit: money(netProfit),
  };
}

export async function balanceSheet(tx: Tx, companyId: string, booksBeginOn: string, asOf: string) {
  const all = await accountBalances(tx, companyId, null, asOf);
  const closing = (r: BalanceRow) => dec(r.closing);
  const side = (natures: string[], sign: 1 | -1) =>
    all.filter((r) => natures.includes(r.nature) && !closing(r).isZero()).map((r) => ({ ...r, amount: money(closing(r).times(sign)) }));
  let assets = side(["asset"], 1);
  const liabilities = side(["liability", "equity"], -1);
  // Until year-end closing entries exist, profit since books began is carried as one line.
  const pl = await profitAndLoss(tx, companyId, booksBeginOn, asOf);
  const registerStock = await stockOn(tx, companyId, asOf);
  const ledgerStock = sum(all.filter((r) => r.groupKey === "stock_in_hand").map((r) => r.closing));
  const stockIsInLedger = dec(ledgerStock).eq(registerStock);
  if (!stockIsInLedger) assets = assets.filter((r) => r.groupKey !== "stock_in_hand");
  const closingStock = stockIsInLedger ? dec(0) : dec(pl.closingStock);
  const totalAssets = sum(assets.map((a) => a.amount)).plus(closingStock);
  const totalLiabilities = sum(liabilities.map((l) => l.amount)).plus(pl.netProfit);
  return {
    asOf, assets, liabilities, profitAndLoss: pl.netProfit, closingStock: money(stockIsInLedger ? 0 : registerStock),
    totalAssets: money(totalAssets), totalLiabilities: money(totalLiabilities),
    difference: money(totalAssets.minus(totalLiabilities)),
  };
}

export async function ledgerStatement(tx: Tx, accountId: string, from: string, to: string) {
  const [acct] = await tx.select().from(tables.accounts).where(eq(tables.accounts.id, accountId));
  if (!acct) throw notFound();
  const [before] = await tx.execute<{ bal: string }>(sql`
    select ${acct.openingBalance}::numeric + coalesce(sum(debit - credit), 0) as bal
    from gl_entries where account_id = ${accountId} and date < ${from}::date`);
  const entries = await tx
    .select({
      id: tables.glEntries.id, date: tables.glEntries.date, debit: tables.glEntries.debit, credit: tables.glEntries.credit, isReversal: tables.glEntries.isReversal,
      voucherId: tables.vouchers.id, number: tables.vouchers.number, type: tables.vouchers.type, narration: tables.vouchers.narration,
      counterparts: sql<string>`(select string_agg(distinct a2.name, ', ') from voucher_lines l2 join accounts a2 on a2.id = l2.account_id where l2.voucher_id = ${tables.vouchers.id} and l2.account_id <> ${accountId})`,
    })
    .from(tables.glEntries)
    .innerJoin(tables.vouchers, eq(tables.vouchers.id, tables.glEntries.voucherId))
    .where(and(eq(tables.glEntries.accountId, accountId), gte(tables.glEntries.date, from), lte(tables.glEntries.date, to)))
    .orderBy(asc(tables.glEntries.date), asc(tables.glEntries.id));
  let running = dec(before!.bal);
  const opening = money(running);
  const rows = entries.map((e) => {
    running = running.plus(e.debit).minus(e.credit);
    return { ...e, balance: money(running) };
  });
  return { account: acct, from, to, opening, rows, closing: money(running) };
}
