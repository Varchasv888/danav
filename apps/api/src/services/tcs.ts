import { and, asc, desc, eq, gte, lte } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, fiscalYearFor, money, tcsOn, tcsSection } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { cancelVoucher, postVoucher, resolveCompany } from "./accounting.js";
import { payrollSettings } from "./hr.js";
import { assertParty } from "./tds.js";
import { resolvePostingAccountId } from "./ledgerparameters.js";
import { assertTcsSectionEnabled } from "./tcssections.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

export async function previewCollection(tx: Tx, input: { customerId: string; section: string; base: string; rate?: string | null | undefined }, companyId?: string) {
  const sec = tcsSection(input.section);
  if (!sec) throw badRequest("unknown_section");
  const company = await resolveCompany(tx, companyId);
  await assertTcsSectionEnabled(tx, company.id, sec.code);
  if (!dec(input.base).gt(0)) throw badRequest("invalid_amount");
  const customer = await assertParty(tx, input.customerId);
  if (customer.companyId !== company.id) throw badRequest("account_company_mismatch");
  return { section: sec.code, ...tcsOn(sec, { base: input.base, hasPan: !!customer.pan, rateOverride: input.rate ?? null }) };
}

/** Tax collected from a customer on a sale: Dr the customer (they owe it on top of the bill), Cr TCS payable. */
export async function recordCollection(tx: Tx, actor: Actor, input: { customerId: string; section: string; date: string; base: string; rate?: string | null | undefined; note?: string | null | undefined }, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const p = await previewCollection(tx, input, company.id);
  const customer = await assertParty(tx, input.customerId);
  let voucherId: string | null = null;
  if (dec(p.tcs).gt(0)) {
    const payableId = await resolvePostingAccountId(tx, company.id, "tcs_payable");
    const { voucher } = await postVoucher(tx, actor, {
      companyId: company.id, type: "journal", date: input.date, reference: `TCS ${p.section}`,
      narration: `TCS ${p.section} at ${Number(p.rate)}% from ${customer.name}${input.note ? ` (${input.note})` : ""}`,
      lines: [{ accountId: input.customerId, debit: p.tcs }, { accountId: payableId, credit: p.tcs }],
    });
    voucherId = voucher.id;
  }
  const [row] = await tx.insert(tables.tcsCollections).values({
    tenantId: actor.tenantId, companyId: company.id, customerId: input.customerId, section: p.section, date: input.date, base: money(input.base), rate: p.rate, tcs: p.tcs,
    noPan: p.noPan, voucherId, note: input.note ?? null, createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "tcs_collection", entityId: row!.id, after: { section: p.section, base: row!.base, tcs: row!.tcs }, ip: actor.ip });
  return row!;
}

export async function cancelCollection(tx: Tx, actor: Actor, id: string, reason: string, companyId?: string) {
  const [c] = await tx.select().from(tables.tcsCollections).where(and(eq(tables.tcsCollections.id, id), companyId ? eq(tables.tcsCollections.companyId, companyId) : undefined)).for("update");
  if (!c) throw notFound();
  if (c.status === "cancelled") throw conflict("already_cancelled");
  if (c.challanId) throw conflict("tds_deposited");
  if (c.voucherId) await cancelVoucher(tx, actor, c.voucherId, reason);
  await tx.update(tables.tcsCollections).set({ status: "cancelled" }).where(eq(tables.tcsCollections.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "tcs_collection", entityId: id, after: { reason }, ip: actor.ip });
}

export async function listCollections(tx: Tx, fy?: string | undefined, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const range = fy ? fiscalYearFor(Number(fy.slice(0, 4))) : null;
  const rows = await tx.select({ c: tables.tcsCollections, name: tables.accounts.name, pan: tables.accounts.pan }).from(tables.tcsCollections)
    .innerJoin(tables.accounts, eq(tables.accounts.id, tables.tcsCollections.customerId))
    .where(and(eq(tables.tcsCollections.companyId, company.id), range ? gte(tables.tcsCollections.date, range.start) : undefined, range ? lte(tables.tcsCollections.date, range.end) : undefined)).orderBy(desc(tables.tcsCollections.date), desc(tables.tcsCollections.createdAt));
  return rows.map((r) => ({ id: r.c.id, customerId: r.c.customerId, customer: r.name, pan: r.pan, section: r.c.section, date: r.c.date, base: r.c.base, rate: r.c.rate, tcs: r.c.tcs, noPan: r.c.noPan, challanId: r.c.challanId, status: r.c.status, note: r.c.note }));
}

const quarterRange = (fy: string, quarter: number) => {
  const year = fiscalYearFor(Number(fy.slice(0, 4)));
  const startMonth = 4 + (quarter - 1) * 3;
  const m = (x: number) => ((x - 1) % 12) + 1;
  const first = `${m(startMonth) >= 4 ? year.startYear : year.startYear + 1}-${String(m(startMonth)).padStart(2, "0")}-01`;
  const lastMonth = m(startMonth + 2);
  const last = new Date(Date.UTC(lastMonth >= 4 ? year.startYear : year.startYear + 1, lastMonth, 0)).toISOString().slice(0, 10);
  return { first, last };
};

/** The quarterly return on tax collected at source (Form 27EQ): the collections by customer and the challans they were deposited under. */
export async function form27eq(tx: Tx, fy: string, quarter: 1 | 2 | 3 | 4, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const settings = await payrollSettings(tx, company.id);
  const { first, last } = quarterRange(fy, quarter);
  const rows = await tx.select({ c: tables.tcsCollections, name: tables.accounts.name, pan: tables.accounts.pan }).from(tables.tcsCollections)
    .innerJoin(tables.accounts, eq(tables.accounts.id, tables.tcsCollections.customerId))
    .where(and(eq(tables.tcsCollections.companyId, company.id), eq(tables.tcsCollections.status, "posted"), gte(tables.tcsCollections.date, first), lte(tables.tcsCollections.date, last))).orderBy(asc(tables.tcsCollections.date));
  const challans = await tx.select().from(tables.tdsChallans).where(and(eq(tables.tdsChallans.companyId, company.id), eq(tables.tdsChallans.kind, "tcs"), eq(tables.tdsChallans.status, "posted"), gte(tables.tdsChallans.paidOn, first), lte(tables.tdsChallans.paidOn, last))).orderBy(asc(tables.tdsChallans.paidOn));
  const of = (id: string | null) => challans.find((c) => c.id === id) ?? null;
  const collectees = rows.filter((r) => dec(r.c.tcs).gt(0)).map((r) => ({ name: r.name, pan: r.pan, section: r.c.section, date: r.c.date, amount: r.c.base, rate: r.c.rate, tcs: r.c.tcs, bsrCode: of(r.c.challanId)?.bsrCode ?? null, challanSerial: of(r.c.challanId)?.challanSerial ?? null, depositedOn: of(r.c.challanId)?.paidOn ?? null }));
  const warnings: { code: string; detail: string }[] = [];
  if (!settings.tan) warnings.push({ code: "tan_missing", detail: "" });
  for (const d of collectees) if (!d.pan) warnings.push({ code: "pan_missing", detail: d.name });
  const collected = collectees.reduce((t, d) => t.plus(d.tcs), dec(0));
  const deposited = challans.reduce((t, c) => t.plus(c.amount), dec(0));
  if (!collected.eq(deposited)) warnings.push({ code: "deposit_mismatch", detail: `${money(collected)} / ${money(deposited)}` });
  return {
    companyId: company.id, fy, quarter, from: first, to: last, tan: settings.tan, collector: company.legalName ?? company.name,
    challans: challans.map((c) => ({ id: c.id, paidOn: c.paidOn, amount: c.amount, bsrCode: c.bsrCode, challanSerial: c.challanSerial })),
    collectees, totals: { collected: money(collected), deposited: money(deposited) }, warnings,
  };
}

const csvLine = (cells: (string | number | null | undefined)[]) => cells.map((c) => {
  const v = String(c ?? "");
  return /[",\n]/.test(v) ? `"${v.replaceAll('"', '""')}"` : v;
}).join(",");

export function form27eqCsv(r: Awaited<ReturnType<typeof form27eq>>) {
  return {
    collectees: { filename: `27EQ_${r.fy}_Q${r.quarter}_collectees.csv`, content: [csvLine(["Buyer PAN", "Buyer name", "Section", "Date of collection", "Amount", "Rate %", "TCS", "BSR code", "Challan serial", "Date of deposit"]),
      ...r.collectees.map((d) => csvLine([d.pan, d.name, d.section, d.date, d.amount, d.rate, d.tcs, d.bsrCode, d.challanSerial, d.depositedOn]))].join("\n") },
    challans: { filename: `27EQ_${r.fy}_Q${r.quarter}_challans.csv`, content: [csvLine(["BSR code", "Challan serial", "Date of deposit", "Amount"]), ...r.challans.map((c) => csvLine([c.bsrCode, c.challanSerial, c.paidOn, c.amount]))].join("\n") },
  };
}
