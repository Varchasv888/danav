import { and, asc, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, fiscalYearFor, fiscalYearOf, money, tdsOn, tdsQuarter, tdsSection, TDS_SECTIONS, type TdsResult } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { cancelVoucher, postVoucher, resolveCompany } from "./accounting.js";
import { resolvePostingAccountId } from "./ledgerparameters.js";
import { payrollSettings } from "./hr.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

/** Customers and suppliers: the accounts a payment can be made to with tax held back. */
export async function assertParty(tx: Tx, accountId: string) {
  const [a] = await tx.select().from(tables.accounts).where(eq(tables.accounts.id, accountId));
  if (!a) throw badRequest("unknown_account");
  if (a.archived) throw badRequest("account_archived");
  const [g] = await tx.execute<{ key: string | null; parent: string | null }>(sql`
    select g.key, (select p.key from account_groups p where p.id = g.parent_id) as parent from account_groups g where g.id = ${a.groupId}`);
  const party = ["sundry_debtors", "sundry_creditors"];
  if (!(party.includes(g?.key ?? "") || party.includes(g?.parent ?? ""))) throw badRequest("not_a_party");
  return a;
}

/** A PAN's fourth letter says who holds it: P is an individual, H a Hindu undivided family. */
const isIndividual = (pan: string | null) => !!pan && (pan[3] === "P" || pan[3] === "H");

/** What tax a payment would attract, given what the payee was already paid this year under the section. */
export async function previewDeduction(tx: Tx, input: { deducteeId: string; section: string; date: string; base: string; rate?: string | null | undefined }): Promise<TdsResult & { priorBase: string; section: string; individual: boolean }> {
  const sec = tdsSection(input.section);
  if (!sec) throw badRequest("unknown_section");
  if (!dec(input.base).gt(0)) throw badRequest("invalid_amount");
  const payee = await assertParty(tx, input.deducteeId);
  const fy = fiscalYearOf(input.date);
  const [prior] = await tx.select({ base: sql<string>`coalesce(sum(${tables.tdsDeductions.base}), 0)`, taxed: sql<string>`coalesce(sum(${tables.tdsDeductions.taxableBase}), 0)` }).from(tables.tdsDeductions)
    .where(and(eq(tables.tdsDeductions.deducteeId, payee.id), eq(tables.tdsDeductions.section, sec.code), eq(tables.tdsDeductions.status, "posted"), gte(tables.tdsDeductions.date, fy.start), lte(tables.tdsDeductions.date, fy.end)));
  const individual = isIndividual(payee.pan);
  const r = tdsOn(sec, { base: input.base, priorBase: prior!.base, priorTaxedBase: prior!.taxed, individual, hasPan: !!payee.pan, rateOverride: input.rate ?? null });
  return { ...r, priorBase: money(prior!.base), section: sec.code, individual };
}

/**
 * Holds tax back from a payment: Dr the payee (so less is owed to them), Cr TDS payable. The row stays on record even when no tax is due
 * yet, because it counts toward the payee's yearly limit.
 */
export async function recordDeduction(tx: Tx, actor: Actor, input: { deducteeId: string; section: string; date: string; base: string; rate?: string | null | undefined; note?: string | null | undefined }) {
  const company = await resolveCompany(tx);
  const p = await previewDeduction(tx, input);
  let voucherId: string | null = null;
  if (dec(p.tds).gt(0)) {
    const payableAccountId = await resolvePostingAccountId(tx, company.id, "tds_payable");
    const payee = await assertParty(tx, input.deducteeId);
    const { voucher } = await postVoucher(tx, actor, {
      companyId: company.id, type: "journal", date: input.date, reference: `TDS ${p.section}`,
      narration: `TDS ${p.section} at ${Number(p.rate)}% on ${payee.name}${input.note ? ` (${input.note})` : ""}`,
      lines: [{ accountId: input.deducteeId, debit: p.tds }, { accountId: payableAccountId, credit: p.tds }],
    });
    voucherId = voucher.id;
  }
  const [row] = await tx.insert(tables.tdsDeductions).values({
    tenantId: actor.tenantId, companyId: company.id, deducteeId: input.deducteeId, section: p.section, date: input.date, base: money(input.base), taxableBase: p.taxableBase,
    rate: p.rate, tds: p.tds, noPan: p.noPan, voucherId, note: input.note ?? null, createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "tds_deduction", entityId: row!.id, after: { section: p.section, base: row!.base, tds: row!.tds }, ip: actor.ip });
  return row!;
}

export async function cancelDeduction(tx: Tx, actor: Actor, id: string, reason: string) {
  const [d] = await tx.select().from(tables.tdsDeductions).where(eq(tables.tdsDeductions.id, id)).for("update");
  if (!d) throw notFound();
  if (d.status === "cancelled") throw conflict("already_cancelled");
  if (d.challanId) throw conflict("tds_deposited");
  if (d.voucherId) await cancelVoucher(tx, actor, d.voucherId, reason);
  await tx.update(tables.tdsDeductions).set({ status: "cancelled" }).where(eq(tables.tdsDeductions.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "tds_deduction", entityId: id, after: { reason }, ip: actor.ip });
}

export async function listDeductions(tx: Tx, filter: { fy?: string | undefined; quarter?: number | undefined } = {}) {
  const fy = filter.fy ? fiscalYearFor(Number(filter.fy.slice(0, 4))) : null;
  const rows = await tx.select({ d: tables.tdsDeductions, name: tables.accounts.name, pan: tables.accounts.pan }).from(tables.tdsDeductions)
    .innerJoin(tables.accounts, eq(tables.accounts.id, tables.tdsDeductions.deducteeId))
    .where(fy ? and(gte(tables.tdsDeductions.date, fy.start), lte(tables.tdsDeductions.date, fy.end)) : undefined)
    .orderBy(desc(tables.tdsDeductions.date), desc(tables.tdsDeductions.createdAt));
  return rows.filter((r) => !filter.quarter || tdsQuarter(r.d.date) === filter.quarter)
    .map((r) => ({ id: r.d.id, deducteeId: r.d.deducteeId, deductee: r.name, pan: r.pan, section: r.d.section, date: r.d.date, base: r.d.base, taxableBase: r.d.taxableBase, rate: r.d.rate, tds: r.d.tds, noPan: r.d.noPan, challanId: r.d.challanId, status: r.d.status, note: r.d.note }));
}

// ---- challans -------------------------------------------------------------------------------------------

/** Tax deposited: Dr TDS payable, Cr the bank. The deductions named are filed under this challan. */
export async function recordChallan(tx: Tx, actor: Actor, input: { paidOn: string; amount: string; accountId: string; bsrCode: string; challanSerial: string; deductionIds?: string[] | undefined; kind?: "tds" | "tcs" | undefined; companyId?: string | undefined }) {
  const kind = input.kind ?? "tds";
  if (!dec(input.amount).gt(0)) throw badRequest("invalid_amount");
  if (!/^\d{7}$/.test(input.bsrCode) || !/^\d{1,8}$/.test(input.challanSerial)) throw badRequest("challan_details_required");
  const company = await resolveCompany(tx, input.companyId);
  const payableKey = kind === "tcs" ? "tcs_payable" : "tds_payable";
  const payableAccountId = await resolvePostingAccountId(tx, company.id, payableKey);
  const ids = input.deductionIds ?? [];
  if (ids.length) {
    const table = kind === "tcs" ? tables.tcsCollections : tables.tdsDeductions;
    const linked = await tx.select({ id: table.id, challanId: table.challanId, status: table.status, companyId: table.companyId })
      .from(table).where(inArray(table.id, ids));
    if (linked.length !== ids.length || linked.some((d) => d.companyId !== company.id || d.status !== "posted" || d.challanId)) throw badRequest("unknown_deduction");
  }
  const { voucher } = await postVoucher(tx, actor, {
    companyId: company.id, type: "payment", date: input.paidOn, reference: `${kind.toUpperCase()} challan ${input.challanSerial}`,
    narration: `${kind.toUpperCase()} deposited (BSR ${input.bsrCode}, challan ${input.challanSerial})`,
    lines: [{ accountId: payableAccountId, debit: money(input.amount) }, { accountId: input.accountId, credit: money(input.amount) }],
  });
  const [row] = await tx.insert(tables.tdsChallans).values({
    tenantId: actor.tenantId, companyId: company.id, paidOn: input.paidOn, amount: money(input.amount), accountId: input.accountId, bsrCode: input.bsrCode, challanSerial: input.challanSerial, kind,
    voucherId: voucher.id, createdBy: actor.userId,
  }).returning();
  if (ids.length) {
    if (kind === "tcs") await tx.update(tables.tcsCollections).set({ challanId: row!.id }).where(inArray(tables.tcsCollections.id, ids));
    else await tx.update(tables.tdsDeductions).set({ challanId: row!.id }).where(inArray(tables.tdsDeductions.id, ids));
  }
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "tds_challan", entityId: row!.id, after: { amount: row!.amount, bsr: input.bsrCode, deductions: ids.length }, ip: actor.ip });
  return row!;
}

export async function cancelChallan(tx: Tx, actor: Actor, id: string, reason: string) {
  const [c] = await tx.select().from(tables.tdsChallans).where(eq(tables.tdsChallans.id, id)).for("update");
  if (!c) throw notFound();
  if (c.status === "cancelled") throw conflict("already_cancelled");
  if (c.voucherId) await cancelVoucher(tx, actor, c.voucherId, reason);
  await tx.update(tables.tdsDeductions).set({ challanId: null }).where(eq(tables.tdsDeductions.challanId, id));
  await tx.update(tables.tcsCollections).set({ challanId: null }).where(eq(tables.tcsCollections.challanId, id));
  await tx.update(tables.tdsChallans).set({ status: "cancelled" }).where(eq(tables.tdsChallans.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "tds_challan", entityId: id, after: { reason }, ip: actor.ip });
}

export async function listChallans(tx: Tx, fy?: string | undefined, kind: "tds" | "tcs" = "tds", companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const range = fy ? fiscalYearFor(Number(fy.slice(0, 4))) : null;
  const where = and(eq(tables.tdsChallans.companyId, company.id), eq(tables.tdsChallans.kind, kind), range ? gte(tables.tdsChallans.paidOn, range.start) : undefined, range ? lte(tables.tdsChallans.paidOn, range.end) : undefined);
  return tx.select().from(tables.tdsChallans).where(where).orderBy(desc(tables.tdsChallans.paidOn));
}

// ---- Form 26Q ---------------------------------------------------------------------------------------------

/**
 * The quarterly return for tax deducted on payments other than salary: the challans and, under each, the payees and what was deducted.
 * Agent commission TDS (194H) from brokerage bills is included. Exported for the NSDL Return Preparation Utility, which makes the file for TIN-NSDL.
 */
export async function form26q(tx: Tx, fy: string, quarter: 1 | 2 | 3 | 4, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const settings = await payrollSettings(tx, company.id);
  const year = fiscalYearFor(Number(fy.slice(0, 4)));
  const startMonth = 4 + (quarter - 1) * 3;
  const month = (m: number) => ((m - 1) % 12) + 1;
  const first = `${month(startMonth) >= 4 ? year.startYear : year.startYear + 1}-${String(month(startMonth)).padStart(2, "0")}-01`;
  const lastMonth = month(startMonth + 2);
  const lastYear = lastMonth >= 4 ? year.startYear : year.startYear + 1;
  const last = new Date(Date.UTC(lastYear, lastMonth, 0)).toISOString().slice(0, 10);

  const own = await tx.select({ d: tables.tdsDeductions, name: tables.accounts.name, pan: tables.accounts.pan }).from(tables.tdsDeductions)
    .innerJoin(tables.accounts, eq(tables.accounts.id, tables.tdsDeductions.deducteeId))
    .where(and(eq(tables.tdsDeductions.companyId, company.id), eq(tables.tdsDeductions.status, "posted"), gte(tables.tdsDeductions.date, first), lte(tables.tdsDeductions.date, last)))
    .orderBy(asc(tables.tdsDeductions.date));
  const commission = await tx.select({ b: tables.brokerageBills, name: tables.accounts.name, pan: tables.accounts.pan }).from(tables.brokerageBills)
    .innerJoin(tables.accounts, eq(tables.accounts.id, tables.brokerageBills.agentId))
    .where(and(eq(tables.brokerageBills.companyId, company.id), eq(tables.brokerageBills.status, "posted"), gte(tables.brokerageBills.date, first), lte(tables.brokerageBills.date, last)));
  const challans = await tx.select().from(tables.tdsChallans).where(and(eq(tables.tdsChallans.companyId, company.id), eq(tables.tdsChallans.kind, "tds"), eq(tables.tdsChallans.status, "posted"), gte(tables.tdsChallans.paidOn, first), lte(tables.tdsChallans.paidOn, last)))
    .orderBy(asc(tables.tdsChallans.paidOn));
  const challanOf = (id: string | null) => challans.find((c) => c.id === id) ?? null;

  const deductees = [
    ...own.map((r) => ({ source: "tds" as const, name: r.name, pan: r.pan, section: r.d.section, date: r.d.date, amountPaid: r.d.base, taxableBase: r.d.taxableBase, rate: r.d.rate, tds: r.d.tds,
      bsrCode: challanOf(r.d.challanId)?.bsrCode ?? null, challanSerial: challanOf(r.d.challanId)?.challanSerial ?? null, depositedOn: challanOf(r.d.challanId)?.paidOn ?? null })),
    ...commission.filter((r) => dec(r.b.tds).gt(0)).map((r) => ({ source: "commission" as const, name: r.name, pan: r.pan, section: "194H", date: r.b.date, amountPaid: r.b.amount, taxableBase: r.b.amount, rate: r.b.tdsRate, tds: r.b.tds,
      bsrCode: null, challanSerial: null, depositedOn: null })),
  ].filter((d) => dec(d.tds).gt(0));

  const refs = new Map((await sectionMap(tx)).map((m) => [m.legacySection, m]));
  for (const d of deductees) Object.assign(d, { newRef: refs.get(d.section)?.newRef ?? null, paymentCode: refs.get(d.section)?.paymentCode ?? null });
  const warnings: { code: string; detail: string }[] = [];
  if (!settings.tan) warnings.push({ code: "tan_missing", detail: "" });
  for (const d of deductees) if (!d.pan) warnings.push({ code: "pan_missing", detail: d.name });
  const deducted = deductees.reduce((t, d) => t.plus(d.tds), dec(0));
  const deposited = challans.reduce((t, c) => t.plus(c.amount), dec(0));
  if (!deducted.eq(deposited)) warnings.push({ code: "deposit_mismatch", detail: `${money(deducted)} / ${money(deposited)}` });
  return {
    fy, quarter, from: first, to: last, tan: settings.tan, deductor: company.legalName ?? company.name, pan: company.pan,
    challans: challans.map((c) => ({ id: c.id, paidOn: c.paidOn, amount: c.amount, bsrCode: c.bsrCode, challanSerial: c.challanSerial })),
    deductees: deductees as ((typeof deductees)[number] & { newRef: string | null; paymentCode: string | null })[], totals: { deducted: money(deducted), deposited: money(deposited) }, warnings,
  };
}

const csvLine = (cells: (string | number | null | undefined)[]) => cells.map((c) => {
  const v = String(c ?? "");
  return /[",\n]/.test(v) ? `"${v.replaceAll('"', '""')}"` : v;
}).join(",");

export function form26qCsv(r: Awaited<ReturnType<typeof form26q>>) {
  const rows = [
    csvLine(["Deductee PAN", "Deductee name", "Section", "Section 393 reference", "Payment code", "Date of payment", "Amount paid", "Amount taxed", "Rate %", "TDS", "BSR code", "Challan serial", "Date of deposit"]),
    ...r.deductees.map((d) => csvLine([d.pan, d.name, d.section, d.newRef, d.paymentCode, d.date, d.amountPaid, d.taxableBase, d.rate, d.tds, d.bsrCode, d.challanSerial, d.depositedOn])),
  ].join("\n");
  const challans = [
    csvLine(["BSR code", "Challan serial", "Date of deposit", "Amount"]),
    ...r.challans.map((c) => csvLine([c.bsrCode, c.challanSerial, c.paidOn, c.amount])),
  ].join("\n");
  return { deductees: { filename: `26Q_${r.fy}_Q${r.quarter}_deductees.csv`, content: rows }, challans: { filename: `26Q_${r.fy}_Q${r.quarter}_challans.csv`, content: challans } };
}

// ---- certificate (Form 16A) and the 194Q tracker ---------------------------------------------------------

/**
 * What a certificate of tax deducted (Form 16A) says for one payee in one quarter: who deducted, who it was deducted from, each payment with the
 * tax and the challan it was deposited under. Part A comes from the TRACES portal in law; this is the working copy the deductor signs and hands over.
 */
export async function certificate(tx: Tx, deducteeId: string, fy: string, quarter: 1 | 2 | 3 | 4) {
  const company = await resolveCompany(tx);
  const settings = await payrollSettings(tx, company.id);
  const [payee] = await tx.select().from(tables.accounts).where(eq(tables.accounts.id, deducteeId));
  if (!payee) throw notFound();
  const year = fiscalYearFor(Number(fy.slice(0, 4)));
  const rows = await tx.select({ d: tables.tdsDeductions, c: tables.tdsChallans }).from(tables.tdsDeductions).leftJoin(tables.tdsChallans, eq(tables.tdsChallans.id, tables.tdsDeductions.challanId))
    .where(and(eq(tables.tdsDeductions.deducteeId, deducteeId), eq(tables.tdsDeductions.status, "posted"), gte(tables.tdsDeductions.date, year.start), lte(tables.tdsDeductions.date, year.end)))
    .orderBy(tables.tdsDeductions.date);
  const mine = rows.filter((r) => tdsQuarter(r.d.date) === quarter && dec(r.d.tds).gt(0));
  if (!mine.length) throw badRequest("no_deductions");
  const [branch] = await tx.select().from(tables.branches).where(and(eq(tables.branches.companyId, company.id), eq(tables.branches.isHeadOffice, true)));
  const refs = new Map((await sectionMap(tx)).map((m) => [m.legacySection, m]));
  const paid = mine.reduce((t, r) => t.plus(r.d.base), dec(0));
  const tax = mine.reduce((t, r) => t.plus(r.d.tds), dec(0));
  return {
    fy, assessmentYear: `${year.startYear + 1}-${String((year.startYear + 2) % 100).padStart(2, "0")}`, quarter,
    number: `16A/${fy}/Q${quarter}/${(payee.code ?? payee.id.slice(0, 6)).toUpperCase()}`,
    deductor: { name: company.legalName ?? company.name, pan: company.pan, tan: settings.tan, address: branch?.address ?? null },
    deductee: { name: payee.name, pan: payee.pan, address: payee.address ?? null },
    rows: mine.map((r) => ({ newRef: refs.get(r.d.section)?.newRef ?? null, paymentCode: refs.get(r.d.section)?.paymentCode ?? null, date: r.d.date, section: r.d.section, amountPaid: r.d.base, tds: r.d.tds, rate: r.d.rate, bsrCode: r.c?.bsrCode ?? null, challanSerial: r.c?.challanSerial ?? null, depositedOn: r.c?.paidOn ?? null })),
    totals: { paid: money(paid), tds: money(tax) },
    undeposited: mine.filter((r) => !r.c).length,
  };
}

/**
 * Section 194Q: a buyer with turnover over Rs 10 crore deducts 0.1% on purchases from one seller above Rs 50 lakh in the year. For each
 * supplier: purchases so far from the bills, the part over the limit, the tax due on it, and what has actually been deducted.
 */
export async function tracker194Q(tx: Tx, fy: string) {
  const company = await resolveCompany(tx);
  const year = fiscalYearFor(Number(fy.slice(0, 4)));
  const sec = tdsSection("194Q")!;
  const rows = await tx.execute<{ supplier_id: string; name: string; pan: string | null; purchases: string; bills: number }>(sql`
    select b.supplier_id, a.name, a.pan, sum(b.taxable)::text as purchases, count(*)::int as bills
    from purchase_bills b join accounts a on a.id = b.supplier_id
    where b.company_id = ${company.id} and b.status = 'posted' and b.date between ${year.start}::date and ${year.end}::date
    group by b.supplier_id, a.name, a.pan order by sum(b.taxable) desc`);
  const done = await tx.select({ id: tables.tdsDeductions.deducteeId, tds: sql<string>`sum(${tables.tdsDeductions.tds})` }).from(tables.tdsDeductions)
    .where(and(eq(tables.tdsDeductions.section, "194Q"), eq(tables.tdsDeductions.status, "posted"), gte(tables.tdsDeductions.date, year.start), lte(tables.tdsDeductions.date, year.end))).groupBy(tables.tdsDeductions.deducteeId);
  const limit = dec(sec.annualLimit);
  const list = [...rows].map((r) => {
    const over = dec(r.purchases).minus(limit);
    const taxable = over.gt(0) ? over : dec(0);
    const due = tdsOn(sec, { base: taxable, individual: false, hasPan: !!r.pan }).tds;
    const deducted = done.find((d) => d.id === r.supplier_id)?.tds ?? "0";
    return { supplierId: r.supplier_id, supplier: r.name, pan: r.pan, bills: r.bills, purchases: money(r.purchases), overLimit: money(taxable), headroom: money(over.lt(0) ? over.neg() : 0), due, deducted: money(deducted), shortfall: money(dec(due).minus(deducted).gt(0) ? dec(due).minus(deducted) : 0) };
  });
  return { fy, limit: money(limit), rate: sec.rateOther, rows: list, totalShortfall: money(list.reduce((t, r) => t.plus(r.shortfall), dec(0))) };
}

// ---- section 393 numbering --------------------------------------------------------------------------

/**
 * The Income-tax Act, 2025 renumbers TDS under section 393 (tables, with payment codes). The official mapping is the business's to enter or paste
 * from the table it follows, so nothing here is assumed: every section the software knows is listed with whatever reference has been set.
 */
export async function sectionMap(tx: Tx) {
  const company = await resolveCompany(tx);
  const rows = await tx.select().from(tables.tdsSectionMap).where(eq(tables.tdsSectionMap.companyId, company.id));
  const by = new Map(rows.map((r) => [r.legacySection, r]));
  return TDS_SECTIONS.map((s) => ({ legacySection: s.code, nature: s.nature, newRef: by.get(s.code)?.newRef ?? null, paymentCode: by.get(s.code)?.paymentCode ?? null, note: by.get(s.code)?.note ?? null }));
}

export interface SectionMapEntry { legacySection: string; newRef: string; paymentCode?: string | null | undefined; note?: string | null | undefined }

export async function setSectionMap(tx: Tx, actor: Actor, entries: SectionMapEntry[]) {
  const company = await resolveCompany(tx);
  const known = new Set(TDS_SECTIONS.map((s) => s.code));
  for (const e of entries) if (!known.has(e.legacySection)) throw badRequest("unknown_section");
  for (const e of entries) {
    const values = { newRef: e.newRef.trim(), paymentCode: e.paymentCode?.trim() || null, note: e.note?.trim() || null, updatedBy: actor.userId, updatedAt: new Date() };
    await tx.insert(tables.tdsSectionMap).values({ tenantId: actor.tenantId, companyId: company.id, legacySection: e.legacySection, ...values })
      .onConflictDoUpdate({ target: [tables.tdsSectionMap.companyId, tables.tdsSectionMap.legacySection], set: values });
  }
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "tds_section_map", entityId: company.id, after: { sections: entries.map((e) => e.legacySection) }, ip: actor.ip });
}

export async function clearSectionMap(tx: Tx, actor: Actor, legacySection: string) {
  const company = await resolveCompany(tx);
  await tx.delete(tables.tdsSectionMap).where(and(eq(tables.tdsSectionMap.companyId, company.id), eq(tables.tdsSectionMap.legacySection, legacySection)));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "delete", entity: "tds_section_map", entityId: legacySection, ip: actor.ip });
}

/** Reads pasted text, one section per line: legacy section, new reference, optional payment code, separated by tabs, commas or semicolons. */
export function parseSectionMap(text: string): SectionMapEntry[] {
  const out: SectionMapEntry[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const cells = line.split(/	|;|,/).map((c) => c.trim().replace(/^"|"$/g, ""));
    if (cells.length < 2 || !cells[0] || !cells[1]) throw badRequest("bad_map_line");
    out.push({ legacySection: cells[0], newRef: cells[1], paymentCode: cells[2] || null });
  }
  if (!out.length) throw badRequest("empty_map");
  return out;
}
