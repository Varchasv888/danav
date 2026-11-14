import { and, asc, desc, eq, inArray, lte, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import {
  ASSET_CLASS_PRESETS, DepreciationError, addDaysIso, bookDepreciation, dec, disposalResult, fiscalYearOf, itBlockDepreciation, money, validateGstin,
} from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { cancelVoucher, postVoucher, resolveCompany } from "./accounting.js";
import { resolvePostingAccountIds } from "./ledgerparameters.js";
import { documentNumber } from "./inventory.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
type Company = Awaited<ReturnType<typeof resolveCompany>>;
type AssetClass = typeof tables.assetClasses.$inferSelect;

const ASSET_ACCOUNTS = ["depreciation", "profit_on_sale_of_assets", "loss_on_sale_of_assets", "input_cgst", "input_sgst", "input_igst", "output_cgst", "output_sgst", "output_igst"];
const DEP_SERIES = { docType: "depreciation", name: "Depreciation", pattern: "DEP/{FY}/{SEQ:5}" };
const PURCHASE_SERIES = { docType: "asset_purchase", name: "Asset purchases", pattern: "FAP/{FY}/{SEQ:5}" };
const DISPOSAL_SERIES = { docType: "asset_disposal", name: "Asset disposals", pattern: "FAD/{FY}/{SEQ:5}" };
const depErr = (e: unknown): never => { throw badRequest(e instanceof DepreciationError ? e.code : "invalid_depreciation"); };

async function keyAccounts(tx: Tx, company: Company) {
  return resolvePostingAccountIds(tx, company.id, ASSET_ACCOUNTS);
}

async function homeState(tx: Tx, companyId: string) {
  const [b] = await tx.select({ stateCode: tables.branches.stateCode }).from(tables.branches).where(and(eq(tables.branches.companyId, companyId), eq(tables.branches.isHeadOffice, true)));
  return b?.stateCode ?? null;
}

/** A ledger under Fixed Assets, created if missing (asset cost, and its accumulated depreciation). */
async function fixedAssetLedger(tx: Tx, company: Company, name: string) {
  const [existing] = await tx.select().from(tables.accounts).where(and(eq(tables.accounts.companyId, company.id), eq(tables.accounts.name, name)));
  if (existing) return existing.id;
  const [group] = await tx.select().from(tables.accountGroups).where(and(eq(tables.accountGroups.companyId, company.id), eq(tables.accountGroups.key, "fixed_assets")));
  const [row] = await tx.insert(tables.accounts).values({ tenantId: company.tenantId, companyId: company.id, groupId: group!.id, name }).returning();
  return row!.id;
}

// ---- classes ------------------------------------------------------------------------------------------

export async function listClasses(tx: Tx) {
  const company = await resolveCompany(tx);
  return tx.select().from(tables.assetClasses).where(eq(tables.assetClasses.companyId, company.id)).orderBy(asc(tables.assetClasses.name));
}

export interface ClassInput {
  preset?: string | undefined; name?: string | undefined; nameHi?: string | null | undefined; method?: "slm" | "wdv" | undefined;
  lifeYears?: string | undefined; residualPct?: string | undefined; itBlock?: string | undefined; itRate?: string | undefined;
}

export async function createClass(tx: Tx, actor: Actor, input: ClassInput) {
  const company = await resolveCompany(tx);
  const p = input.preset ? ASSET_CLASS_PRESETS.find((x) => x.key === input.preset) : undefined;
  if (input.preset && !p) throw badRequest("unknown_preset");
  const name = input.name?.trim() || p?.name;
  const lifeYears = input.lifeYears ?? (p ? String(p.lifeYears) : undefined);
  const itBlock = input.itBlock ?? p?.itBlock;
  const itRate = input.itRate ?? (p ? String(p.itRate) : undefined);
  if (!name || !lifeYears || !itBlock || !itRate) throw badRequest("class_incomplete");
  if (!dec(lifeYears).gt(0)) throw badRequest("invalid_life");
  const residualPct = input.residualPct ?? "5";
  if (input.method === "wdv" && !dec(residualPct).gt(0)) throw badRequest("invalid_residual");
  const [dup] = await tx.select().from(tables.assetClasses).where(and(eq(tables.assetClasses.companyId, company.id), eq(tables.assetClasses.name, name)));
  if (dup) throw conflict("class_exists");
  const assetAccountId = await fixedAssetLedger(tx, company, name);
  const accumulatedAccountId = await fixedAssetLedger(tx, company, `Accumulated Depreciation - ${name}`.slice(0, 120));
  const [row] = await tx.insert(tables.assetClasses).values({
    tenantId: actor.tenantId, companyId: company.id, name, nameHi: input.nameHi ?? p?.nameHi ?? null, method: input.method ?? "slm",
    lifeYears, residualPct, itBlock, itRate, assetAccountId, accumulatedAccountId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "asset_class", entityId: row!.id, after: { name, lifeYears, itRate }, ip: actor.ip });
  return row!;
}

export async function updateClass(tx: Tx, actor: Actor, id: string, input: { method?: "slm" | "wdv" | undefined; lifeYears?: string | undefined; residualPct?: string | undefined; itRate?: string | undefined; archived?: boolean | undefined }) {
  const [c] = await tx.select().from(tables.assetClasses).where(eq(tables.assetClasses.id, id));
  if (!c) throw notFound();
  const [row] = await tx.update(tables.assetClasses).set({
    ...(input.method ? { method: input.method } : {}), ...(input.lifeYears ? { lifeYears: input.lifeYears } : {}),
    ...(input.residualPct ? { residualPct: input.residualPct } : {}), ...(input.itRate ? { itRate: input.itRate } : {}),
    ...(input.archived !== undefined ? { archived: input.archived } : {}),
  }).where(eq(tables.assetClasses.id, id)).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "asset_class", entityId: id, before: c, after: row, ip: actor.ip });
  return row!;
}

// ---- assets --------------------------------------------------------------------------------------------

export interface AssetInput {
  classId: string; name: string; purchaseDate: string; putToUseOn?: string | undefined; cost: string;
  /** How it came in: bought on credit from a supplier, paid from cash/bank, or already in the books before Varchasv. */
  acquisition: "supplier" | "paid" | "opening";
  accountId?: string | undefined; gstRate?: string | undefined; supplierGstin?: string | undefined;
  openingAccumulated?: string | undefined; location?: string | undefined; serialNo?: string | undefined; custodianId?: string | undefined;
  invoiceRef?: string | undefined; notes?: string | undefined;
}

async function nextCode(tx: Tx, companyId: string) {
  const [r] = await tx.execute<{ n: number }>(sql`select coalesce(max(nullif(regexp_replace(code, '\\D', '', 'g'), '')::int), 0)::int + 1 as n from assets where company_id = ${companyId}`);
  return `FA-${String(r!.n).padStart(5, "0")}`;
}

/**
 * Adds an asset to the register. Bought now, it posts Dr the class's asset ledger (and input GST if
 * the credit is taken; it then isn't part of the depreciable cost), Cr the supplier or the cash/bank
 * ledger. Brought forward, it is only registered: the ledgers already carry it.
 */
export async function addAsset(tx: Tx, actor: Actor, input: AssetInput) {
  const company = await resolveCompany(tx);
  const [cls] = await tx.select().from(tables.assetClasses).where(eq(tables.assetClasses.id, input.classId));
  if (!cls || cls.companyId !== company.id) throw badRequest("unknown_class");
  if (cls.archived) throw badRequest("class_archived");
  if (!dec(input.cost).gt(0)) throw badRequest("invalid_cost");
  const putToUseOn = input.putToUseOn ?? input.purchaseDate;
  if (putToUseOn < input.purchaseDate) throw badRequest("used_before_bought");
  let voucherId: string | null = null;
  let supplierId: string | null = null;
  if (input.acquisition !== "opening") {
    if (!input.accountId) throw badRequest("account_required");
    const [acct] = await tx.select({ a: tables.accounts, key: tables.accountGroups.key, parentKey: sql<string | null>`(select g2.key from account_groups g2 where g2.id = ${tables.accountGroups.parentId})` })
      .from(tables.accounts).innerJoin(tables.accountGroups, eq(tables.accountGroups.id, tables.accounts.groupId)).where(eq(tables.accounts.id, input.accountId));
    if (!acct || acct.a.companyId !== company.id) throw badRequest("unknown_account");
    const k = [acct.key, acct.parentKey];
    if (input.acquisition === "supplier" && !k.includes("sundry_creditors")) throw badRequest("not_a_supplier");
    if (input.acquisition === "paid" && !k.some((x) => ["cash_in_hand", "bank_accounts", "bank_od"].includes(x ?? ""))) throw badRequest("not_cash_or_bank");
    if (input.acquisition === "supplier") supplierId = acct.a.id;
    const keys = await keyAccounts(tx, company);
    const rate = dec(input.gstRate ?? 0);
    const gstin = input.supplierGstin ?? acct.a.gstin ?? null;
    if (rate.gt(0) && (!gstin || !validateGstin(gstin).valid)) throw badRequest("supplier_gstin_required");
    const taxLines: { accountId: string; debit: string }[] = [];
    let tax = dec(0);
    if (rate.gt(0)) {
      tax = dec(money(dec(input.cost).times(rate).div(100)));
      if (gstin!.slice(0, 2) === (await homeState(tx, company.id))) {
        const half = money(tax.div(2));
        taxLines.push({ accountId: keys.input_cgst!, debit: half }, { accountId: keys.input_sgst!, debit: money(tax.minus(half)) });
      } else taxLines.push({ accountId: keys.input_igst!, debit: money(tax) });
    }
    const number = await documentNumber(tx, actor, company, input.purchaseDate, PURCHASE_SERIES);
    const { voucher } = await postVoucher(tx, actor, {
      companyId: company.id, type: "asset_purchase", documentNumber: number, date: input.purchaseDate, reference: input.invoiceRef,
      narration: `Asset bought: ${input.name}`,
      lines: [{ accountId: cls.assetAccountId, debit: money(input.cost) }, ...taxLines, { accountId: input.accountId, credit: money(dec(input.cost).plus(tax)) }],
    });
    voucherId = voucher.id;
  }
  const [row] = await tx.insert(tables.assets).values({
    tenantId: actor.tenantId, companyId: company.id, code: await nextCode(tx, company.id), name: input.name.trim(), classId: cls.id,
    purchaseDate: input.purchaseDate, putToUseOn, cost: money(input.cost), openingAccumulated: money(input.acquisition === "opening" ? input.openingAccumulated ?? 0 : 0),
    location: input.location ?? null, serialNo: input.serialNo ?? null, custodianId: input.custodianId ?? null, supplierId, invoiceRef: input.invoiceRef ?? null,
    voucherId, notes: input.notes ?? null, createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "asset", entityId: row!.id, after: { code: row!.code, name: row!.name, cost: row!.cost }, ip: actor.ip });
  return row!;
}

/** Depreciation posted so far per asset (in runs not cancelled), and the last day it covers. */
async function charged(tx: Tx, assetIds: string[], before?: string) {
  if (!assetIds.length) return new Map<string, { total: string; to: string | null }>();
  const rows = await tx.execute<{ asset_id: string; total: string; to: string | null }>(sql`
    select e.asset_id, sum(e.amount)::text as total, max(r.to_date)::text as "to" from depreciation_entries e join depreciation_runs r on r.id = e.run_id
    where r.status = 'posted' and e.asset_id in (${sql.join(assetIds.map((id) => sql`${id}::uuid`), sql`, `)}) ${before ? sql`and r.to_date < ${before}::date` : sql``}
    group by e.asset_id`);
  return new Map([...rows].map((r) => [r.asset_id, { total: r.total, to: r.to }]));
}

export async function listAssets(tx: Tx) {
  const company = await resolveCompany(tx);
  const rows = await tx.select({ a: tables.assets, className: tables.assetClasses.name, custodian: tables.employees.name }).from(tables.assets)
    .innerJoin(tables.assetClasses, eq(tables.assetClasses.id, tables.assets.classId)).leftJoin(tables.employees, eq(tables.employees.id, tables.assets.custodianId))
    .where(eq(tables.assets.companyId, company.id)).orderBy(asc(tables.assets.code));
  const dep = await charged(tx, rows.map((r) => r.a.id));
  return rows.map((r) => {
    const accumulated = dec(r.a.openingAccumulated).plus(dep.get(r.a.id)?.total ?? 0);
    return { ...r.a, className: r.className, custodian: r.custodian, accumulated: money(accumulated), bookValue: r.a.status === "disposed" ? "0.00" : money(dec(r.a.cost).minus(accumulated)), depreciatedTo: dep.get(r.a.id)?.to ?? null };
  });
}

export async function getAsset(tx: Tx, id: string) {
  const [row] = await tx.select({ a: tables.assets, cls: tables.assetClasses }).from(tables.assets).innerJoin(tables.assetClasses, eq(tables.assetClasses.id, tables.assets.classId)).where(eq(tables.assets.id, id));
  if (!row) throw notFound();
  const history = await tx.select({ e: tables.depreciationEntries, r: tables.depreciationRuns, number: tables.vouchers.number }).from(tables.depreciationEntries)
    .innerJoin(tables.depreciationRuns, eq(tables.depreciationRuns.id, tables.depreciationEntries.runId)).leftJoin(tables.vouchers, eq(tables.vouchers.id, tables.depreciationRuns.voucherId))
    .where(and(eq(tables.depreciationEntries.assetId, id), eq(tables.depreciationRuns.status, "posted"))).orderBy(asc(tables.depreciationRuns.fromDate));
  const accumulated = history.reduce((s, h) => s.plus(h.e.amount), dec(row.a.openingAccumulated));
  const vouchers = await tx.select({ id: tables.vouchers.id, number: tables.vouchers.number }).from(tables.vouchers)
    .where(inArray(tables.vouchers.id, [row.a.voucherId, row.a.disposalVoucherId].filter((x): x is string => !!x).concat(["00000000-0000-0000-0000-000000000000"])));
  return {
    ...row.a, class: row.cls, accumulated: money(accumulated), bookValue: row.a.status === "disposed" ? "0.00" : money(dec(row.a.cost).minus(accumulated)),
    history: history.map((h) => ({ from: h.r.fromDate, to: h.r.toDate, amount: h.e.amount, days: h.e.days, voucher: h.number })),
    purchaseVoucher: vouchers.find((v) => v.id === row.a.voucherId)?.number ?? null, disposalVoucher: vouchers.find((v) => v.id === row.a.disposalVoucherId)?.number ?? null,
  };
}

// ---- depreciation runs ----------------------------------------------------------------------------------

/** Book depreciation for a period within one financial year, per asset, from where each asset was last depreciated. */
export async function previewDepreciation(tx: Tx, from: string, to: string, only?: { assetIds: string[]; disposalDate?: string }) {
  const company = await resolveCompany(tx);
  const fy = fiscalYearOf(from);
  if (to < from || to > fy.end) throw badRequest("period_crosses_year");
  const rows = await tx.select({ a: tables.assets, cls: tables.assetClasses }).from(tables.assets).innerJoin(tables.assetClasses, eq(tables.assetClasses.id, tables.assets.classId))
    .where(and(eq(tables.assets.companyId, company.id), only ? inArray(tables.assets.id, only.assetIds) : eq(tables.assets.status, "active"), lte(tables.assets.putToUseOn, to)));
  const all = await charged(tx, rows.map((r) => r.a.id));
  const beforeYear = await charged(tx, rows.map((r) => r.a.id), fy.start);
  const lines = [];
  for (const { a, cls } of rows) {
    const done = all.get(a.id);
    const start = done?.to && done.to >= from ? addDaysIso(done.to, 1) : from;
    if (start > to) continue;
    let d;
    try {
      d = bookDepreciation(
        { cost: a.cost, method: cls.method as "slm" | "wdv", lifeYears: cls.lifeYears, residualPct: cls.residualPct, putToUseOn: a.putToUseOn, disposedOn: only?.disposalDate ?? a.disposedOn },
        { fyStart: fy.start, fyEnd: fy.end, from: start, to },
        dec(a.openingAccumulated).plus(beforeYear.get(a.id)?.total ?? 0), dec(a.openingAccumulated).plus(done?.total ?? 0),
      );
    } catch (e) { depErr(e); }
    if (dec(d!.amount).gt(0)) lines.push({ assetId: a.id, code: a.code, name: a.name, classId: cls.id, className: cls.name, accumulatedAccountId: cls.accumulatedAccountId, from: start, amount: d!.amount, days: d!.days });
  }
  return { from, to, lines, total: money(lines.reduce((s, l) => s.plus(l.amount), dec(0))) };
}

/** Posts depreciation: Dr Depreciation, Cr each class's accumulated depreciation. */
export async function postDepreciation(tx: Tx, actor: Actor, from: string, to: string, only?: { assetIds: string[]; disposalDate?: string }) {
  const company = await resolveCompany(tx);
  const p = await previewDepreciation(tx, from, to, only);
  if (!p.lines.length) {
    if (only) return null;
    throw badRequest("nothing_to_depreciate");
  }
  const keys = await keyAccounts(tx, company);
  const byClass = new Map<string, ReturnType<typeof dec>>();
  for (const l of p.lines) byClass.set(l.accumulatedAccountId, (byClass.get(l.accumulatedAccountId) ?? dec(0)).plus(l.amount));
  const number = await documentNumber(tx, actor, company, to, DEP_SERIES);
  const { voucher } = await postVoucher(tx, actor, {
    companyId: company.id, type: "depreciation", documentNumber: number, date: to, narration: `Depreciation ${from} to ${to}`,
    lines: [{ accountId: keys.depreciation!, debit: p.total }, ...[...byClass.entries()].map(([accountId, v]) => ({ accountId, credit: money(v) }))],
  });
  const [run] = await tx.insert(tables.depreciationRuns).values({ tenantId: actor.tenantId, companyId: company.id, fromDate: from, toDate: to, total: p.total, voucherId: voucher.id, createdBy: actor.userId }).returning();
  await tx.insert(tables.depreciationEntries).values(p.lines.map((l) => ({ tenantId: actor.tenantId, runId: run!.id, assetId: l.assetId, amount: l.amount, days: l.days })));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "depreciation_run", entityId: run!.id, after: { from, to, total: p.total, assets: p.lines.length }, ip: actor.ip });
  return { ...run!, number };
}

export async function listRuns(tx: Tx) {
  const company = await resolveCompany(tx);
  return tx.select({ r: tables.depreciationRuns, number: tables.vouchers.number, assets: sql<number>`(select count(*)::int from depreciation_entries e where e.run_id = ${tables.depreciationRuns.id})` })
    .from(tables.depreciationRuns).leftJoin(tables.vouchers, eq(tables.vouchers.id, tables.depreciationRuns.voucherId))
    .where(eq(tables.depreciationRuns.companyId, company.id)).orderBy(desc(tables.depreciationRuns.toDate), desc(tables.depreciationRuns.createdAt));
}

/** Cancels a run; only the latest run of each of its assets can go (later ones build on it). */
export async function cancelRun(tx: Tx, actor: Actor, id: string, reason: string) {
  const [run] = await tx.select().from(tables.depreciationRuns).where(eq(tables.depreciationRuns.id, id)).for("update");
  if (!run) throw notFound();
  if (run.status !== "posted") throw conflict("already_cancelled");
  const [later] = await tx.execute<{ n: number }>(sql`
    select count(*)::int as n from depreciation_entries e join depreciation_runs r on r.id = e.run_id
    where r.status = 'posted' and r.id <> ${id} and r.to_date > ${run.toDate}::date and e.asset_id in (select asset_id from depreciation_entries where run_id = ${id})`);
  if (later!.n > 0) throw conflict("later_run_exists");
  const [disposed] = await tx.execute<{ n: number }>(sql`select count(*)::int as n from assets where status = 'disposed' and id in (select asset_id from depreciation_entries where run_id = ${id})`);
  if (disposed!.n > 0) throw conflict("asset_disposed");
  if (run.voucherId) await cancelVoucher(tx, actor, run.voucherId, reason);
  await tx.update(tables.depreciationRuns).set({ status: "cancelled" }).where(eq(tables.depreciationRuns.id, id));
}

// ---- disposal --------------------------------------------------------------------------------------------

/**
 * Sells or scraps an asset: depreciation is first charged up to the sale date, then Dr what was
 * received (cash, bank or the buyer) and accumulated depreciation, Cr the asset at cost and output GST
 * on the sale, with the difference to profit or loss on sale of assets.
 */
export async function disposeAsset(tx: Tx, actor: Actor, id: string, input: { date: string; saleValue: string; accountId?: string | undefined; gstRate?: string | undefined; buyerStateCode?: string | undefined; notes?: string | undefined }) {
  const company = await resolveCompany(tx);
  const [a] = await tx.select().from(tables.assets).where(eq(tables.assets.id, id)).for("update");
  if (!a) throw notFound();
  if (a.status === "disposed") throw conflict("already_disposed");
  if (input.date < a.putToUseOn) throw badRequest("sold_before_use");
  const [cls] = await tx.select().from(tables.assetClasses).where(eq(tables.assetClasses.id, a.classId)) as AssetClass[];
  const sale = dec(input.saleValue);
  if (sale.gt(0) && !input.accountId) throw badRequest("account_required");
  const fy = fiscalYearOf(input.date);
  const before = (await charged(tx, [a.id])).get(a.id)?.to;
  if (before && before > input.date) throw conflict("depreciated_past_sale");
  // Depreciation up to the day of sale.
  await postDepreciation(tx, actor, fy.start, input.date, { assetIds: [a.id], disposalDate: input.date });
  const dep = await charged(tx, [a.id]);
  const accumulated = dec(a.openingAccumulated).plus(dep.get(a.id)?.total ?? 0);
  const result = disposalResult(a.cost, accumulated, sale);
  const keys = await keyAccounts(tx, company);
  const rate = dec(input.gstRate ?? 0);
  const tax = rate.gt(0) ? dec(money(sale.times(rate).div(100))) : dec(0);
  const taxLines: { accountId: string; credit: string }[] = [];
  if (tax.gt(0)) {
    const home = await homeState(tx, company.id);
    if (!input.buyerStateCode || input.buyerStateCode === home) {
      const half = money(tax.div(2));
      taxLines.push({ accountId: keys.output_cgst!, credit: half }, { accountId: keys.output_sgst!, credit: money(tax.minus(half)) });
    } else taxLines.push({ accountId: keys.output_igst!, credit: money(tax) });
  }
  const profit = dec(result.profit);
  const lines = [
    ...(sale.gt(0) ? [{ accountId: input.accountId!, debit: money(sale.plus(tax)) }] : []),
    ...(accumulated.gt(0) ? [{ accountId: cls!.accumulatedAccountId, debit: money(accumulated) }] : []),
    { accountId: cls!.assetAccountId, credit: money(a.cost) },
    ...taxLines,
    ...(profit.gt(0) ? [{ accountId: keys.profit_on_sale_of_assets!, credit: money(profit) }] : profit.lt(0) ? [{ accountId: keys.loss_on_sale_of_assets!, debit: money(profit.neg()) }] : []),
  ];
  const number = await documentNumber(tx, actor, company, input.date, DISPOSAL_SERIES);
  const { voucher } = await postVoucher(tx, actor, {
    companyId: company.id, type: "asset_disposal", documentNumber: number, date: input.date, narration: input.notes ?? `${sale.gt(0) ? "Sale" : "Scrapping"} of ${a.code} ${a.name}`, lines,
  });
  await tx.update(tables.assets).set({ status: "disposed", disposedOn: input.date, saleValue: money(sale), disposalVoucherId: voucher.id }).where(eq(tables.assets.id, a.id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "asset", entityId: a.id, after: { disposedOn: input.date, saleValue: money(sale), profit: result.profit }, ip: actor.ip });
  return { number, accumulated: money(accumulated), ...result };
}

// ---- income-tax schedule -----------------------------------------------------------------------------------

export async function saveBlockOpening(tx: Tx, actor: Actor, input: { fy: string; block: string; rate: string; openingWdv: string }) {
  const company = await resolveCompany(tx);
  await tx.insert(tables.itBlockOpenings).values({ tenantId: actor.tenantId, companyId: company.id, ...input, openingWdv: money(input.openingWdv) })
    .onConflictDoUpdate({ target: [tables.itBlockOpenings.companyId, tables.itBlockOpenings.fy, tables.itBlockOpenings.block], set: { rate: input.rate, openingWdv: money(input.openingWdv) } });
}

/**
 * Depreciation as per the Income-tax Act for a year, block by block (tax audit report, clause 18).
 * A block's opening WDV is the one entered for that year, else last year's closing (worked out back
 * to the year the books began).
 */
export async function itSchedule(tx: Tx, fyLabel: string) {
  const company = await resolveCompany(tx);
  const startYear = Number(fyLabel.slice(0, 4));
  const firstYear = fiscalYearOf(company.booksBeginOn).startYear;
  const [classes, assetRows, openings] = await Promise.all([
    tx.select().from(tables.assetClasses).where(eq(tables.assetClasses.companyId, company.id)),
    tx.select().from(tables.assets).where(eq(tables.assets.companyId, company.id)),
    tx.select().from(tables.itBlockOpenings).where(eq(tables.itBlockOpenings.companyId, company.id)),
  ]);
  const classKey = (c: AssetClass) => `${c.itBlock}|${dec(c.itRate).toFixed(2)}`;
  const blocks = new Set<string>();
  for (const c of classes) blocks.add(classKey(c));
  for (const o of openings) blocks.add(`${o.block}|${dec(o.rate).toFixed(2)}`);
  const yearOf = (y: number) => ({ start: `${y}-04-01`, end: `${y + 1}-03-31`, label: `${y}-${String((y + 1) % 100).padStart(2, "0")}` });
  const compute = (key: string, y: number): ReturnType<typeof itBlockDepreciation> & { block: string; rate: string } => {
    const [block, rate] = key.split("|") as [string, string];
    const fy = yearOf(y);
    const inBlock = assetRows.filter((a) => { const c = classes.find((x) => x.id === a.classId); return c && classKey(c) === key; });
    const entered = openings.find((o) => o.fy === fy.label && o.block === block && dec(o.rate).eq(rate));
    const opening = entered ? entered.openingWdv : y > firstYear ? compute(key, y - 1).closingWdv : "0";
    const additions = inBlock.filter((a) => a.purchaseDate >= fy.start && a.purchaseDate <= fy.end && dec(a.openingAccumulated).isZero()).map((a) => ({ cost: a.cost, putToUseOn: a.putToUseOn }));
    const sales = inBlock.filter((a) => a.disposedOn && a.disposedOn >= fy.start && a.disposedOn <= fy.end).map((a) => a.saleValue ?? "0");
    const left = inBlock.filter((a) => a.purchaseDate <= fy.end && !(a.disposedOn && a.disposedOn <= fy.end));
    const r = itBlockDepreciation({ rate, openingWdv: opening, additions, sales, blockCeases: inBlock.length > 0 && left.length === 0 && sales.length > 0 }, fy.end);
    return { ...r, block, rate };
  };
  const rows = [...blocks].sort().map((k) => compute(k, startYear)).filter((r) => !(dec(r.openingWdv).isZero() && dec(r.additionsFullRate).isZero() && dec(r.additionsHalfRate).isZero() && dec(r.sales).isZero()));
  const t = (k: "openingWdv" | "additionsFullRate" | "additionsHalfRate" | "sales" | "depreciation" | "closingWdv" | "shortTermGain" | "shortTermLoss") => money(rows.reduce((s, r) => s.plus(r[k]), dec(0)));
  return {
    fy: fyLabel, rows,
    totals: { openingWdv: t("openingWdv"), additionsFullRate: t("additionsFullRate"), additionsHalfRate: t("additionsHalfRate"), sales: t("sales"), depreciation: t("depreciation"), closingWdv: t("closingWdv"), shortTermGain: t("shortTermGain"), shortTermLoss: t("shortTermLoss") },
  };
}
