import { and, asc, desc, eq, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { businessDate, dec, money } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

const addMonths = (iso: string, n: number) => { const d = new Date(`${iso}T00:00:00Z`); d.setUTCMonth(d.getUTCMonth() + n); return d.toISOString().slice(0, 10); };
const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);
/** The bank must receive the money, and the certificate is due, within nine months of the shipment (RBI rule for most exporters). */
export const REALISATION_MONTHS = 9;

// ---- shipments and realisation -------------------------------------------------------------------------------

interface InvoiceRow { id: string; number: string; date: string; customer_name: string; supply_kind: string; taxable: string; total: string; status: string; sb_id: string | null }

/** Every export or SEZ invoice with its shipping bill and bank realisation certificate, and how long is left to bring the money in. */
export async function shipments(tx: Tx, asOf = businessDate()) {
  const company = await resolveCompany(tx);
  const rows = [...await tx.execute<InvoiceRow & Record<string, string | null>>(sql`
    select i.id, i.number, i.date::text, i.customer_name, i.supply_kind, i.taxable::text, i.total::text, i.status, e.id as sb_id,
           e.shipping_bill_no, e.shipping_bill_date::text, e.port_code, e.fob_value::text, e.currency, e.brc_no, e.brc_date::text, e.realised_amount::text, e.note
    from sales_invoices i left join export_shipments e on e.invoice_id = i.id
    where i.company_id = ${company.id} and i.status = 'posted' and i.supply_kind in ('export', 'sez')
    order by i.date desc, i.number desc`)];
  return rows.map((r) => {
    const shipped = r.shipping_bill_date ?? r.date;
    const dueBy = addMonths(shipped!, REALISATION_MONTHS);
    const invoiceValue = dec(r.total!);
    const realised = dec(r.realised_amount ?? 0);
    const pending = invoiceValue.minus(realised);
    const done = pending.lte(0.5) && !!r.brc_no;
    const left = daysBetween(asOf, dueBy);
    const status = done ? "realised" : left < 0 ? "overdue" : left <= 30 ? "due_soon" : "open";
    return {
      invoiceId: r.id, number: r.number, date: r.date, customer: r.customer_name, kind: r.supply_kind, taxable: r.taxable, invoiceValue: money(invoiceValue),
      shippingBillNo: r.shipping_bill_no ?? null, shippingBillDate: r.shipping_bill_date ?? null, portCode: r.port_code ?? null, fobValue: r.fob_value ?? null, currency: r.currency ?? null,
      brcNo: r.brc_no ?? null, brcDate: r.brc_date ?? null, realised: money(realised), pending: money(pending.gt(0) ? pending : 0), dueBy, daysLeft: done ? null : left, status, note: r.note ?? null,
    };
  });
}

export interface ShipmentInput {
  shippingBillNo?: string | null | undefined; shippingBillDate?: string | null | undefined; portCode?: string | null | undefined; fobValue?: string | null | undefined; currency?: string | undefined;
  brcNo?: string | null | undefined; brcDate?: string | null | undefined; realisedAmount?: string | undefined; note?: string | null | undefined;
}

/** Records or corrects the shipping bill and realisation details of an export invoice. */
export async function saveShipment(tx: Tx, actor: Actor, invoiceId: string, input: ShipmentInput) {
  const company = await resolveCompany(tx);
  const [inv] = await tx.select({ id: tables.salesInvoices.id, kind: tables.salesInvoices.supplyKind, number: tables.salesInvoices.number, total: tables.salesInvoices.total })
    .from(tables.salesInvoices).where(and(eq(tables.salesInvoices.id, invoiceId), eq(tables.salesInvoices.companyId, company.id))).limit(1);
  if (!inv) throw notFound();
  if (inv.kind !== "export" && inv.kind !== "sez") throw badRequest("not_an_export");
  const realised = dec(input.realisedAmount ?? 0);
  if (realised.lt(0) || realised.gt(dec(inv.total).times(1.1))) throw badRequest("realised_too_high");
  if (input.brcDate && input.shippingBillDate && input.brcDate < input.shippingBillDate) throw badRequest("brc_before_shipment");
  const values = {
    shippingBillNo: input.shippingBillNo ?? null, shippingBillDate: input.shippingBillDate ?? null, portCode: input.portCode ?? null, fobValue: input.fobValue ?? null,
    currency: (input.currency ?? "USD").toUpperCase(), brcNo: input.brcNo ?? null, brcDate: input.brcDate ?? null, realisedAmount: money(realised), note: input.note ?? null,
  };
  const [row] = await tx.insert(tables.exportShipments).values({ tenantId: actor.tenantId, companyId: company.id, invoiceId, ...values })
    .onConflictDoUpdate({ target: tables.exportShipments.invoiceId, set: values }).returning({ id: tables.exportShipments.id });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "export_shipment", entityId: row!.id, after: { invoice: inv.number, ...values }, ip: actor.ip });
  return row!;
}

// ---- incentive rates and the amount a shipment earns ------------------------------------------------------

export const SCHEMES = ["rodtep", "rosctl"] as const;
const checkScheme = (s: string) => { if (!(SCHEMES as readonly string[]).includes(s)) throw badRequest("invalid_scheme"); };

export async function listRates(tx: Tx) {
  const company = await resolveCompany(tx);
  return tx.select().from(tables.incentiveRates).where(eq(tables.incentiveRates.companyId, company.id)).orderBy(asc(tables.incentiveRates.scheme), asc(tables.incentiveRates.hsnPrefix), desc(tables.incentiveRates.effectiveFrom));
}

/** Rates are typed in from the government notification; none are built in, so nothing out of date can creep in. */
export async function addRate(tx: Tx, actor: Actor, input: { scheme: string; hsnPrefix: string; ratePct: string; effectiveFrom: string; effectiveTo?: string | null | undefined }) {
  checkScheme(input.scheme);
  if (input.effectiveTo && input.effectiveTo < input.effectiveFrom) throw badRequest("invalid_dates");
  const company = await resolveCompany(tx);
  // A new rate for the same heading closes any open one that was running at its start.
  const prior = await tx.select().from(tables.incentiveRates).where(and(eq(tables.incentiveRates.companyId, company.id), eq(tables.incentiveRates.scheme, input.scheme), eq(tables.incentiveRates.hsnPrefix, input.hsnPrefix)));
  if (prior.some((p) => p.effectiveFrom <= (input.effectiveTo ?? "9999-12-31") && (p.effectiveTo ?? "9999-12-31") >= input.effectiveFrom)) throw conflict("rate_overlaps");
  const [row] = await tx.insert(tables.incentiveRates).values({ tenantId: actor.tenantId, companyId: company.id, scheme: input.scheme, hsnPrefix: input.hsnPrefix, ratePct: input.ratePct, effectiveFrom: input.effectiveFrom, effectiveTo: input.effectiveTo ?? null }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "incentive_rate", entityId: row!.id, after: input, ip: actor.ip });
  return row!;
}

export async function deleteRate(tx: Tx, actor: Actor, id: string) {
  const gone = await tx.delete(tables.incentiveRates).where(eq(tables.incentiveRates.id, id)).returning();
  if (!gone.length) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "delete", entity: "incentive_rate", entityId: id, before: gone[0], ip: actor.ip });
}

type Rate = typeof tables.incentiveRates.$inferSelect;
/** The rate in force on a date for a tariff code: the longest matching heading wins. */
export function rateFor(rates: Rate[], scheme: string, hsn: string | null, on: string): Rate | null {
  if (!hsn) return null;
  const hits = rates.filter((r) => r.scheme === scheme && hsn.startsWith(r.hsnPrefix) && r.effectiveFrom <= on && (!r.effectiveTo || r.effectiveTo >= on));
  return hits.sort((a, b) => b.hsnPrefix.length - a.hsnPrefix.length)[0] ?? null;
}

/**
 * What each shipment earns under a scheme: the value of each line (what the invoice says, in rupees) times the rate in force on the shipping bill date.
 * Lines with no rate entered are listed, so a gap shows as a gap and not as zero.
 */
export async function incentiveWorking(tx: Tx, scheme: string, from?: string, to?: string) {
  checkScheme(scheme);
  const company = await resolveCompany(tx);
  const rates = await listRates(tx);
  const lines = [...await tx.execute<{ invoice_id: string; number: string; on: string; hsn: string | null; item: string; taxable: string }>(sql`
    select i.id as invoice_id, i.number, coalesce(e.shipping_bill_date, i.date)::text as on, it.hsn, it.name as item, l.taxable::text
    from sales_invoices i join sales_invoice_lines l on l.invoice_id = i.id join items it on it.id = l.item_id left join export_shipments e on e.invoice_id = i.id
    where i.company_id = ${company.id} and i.status = 'posted' and i.supply_kind = 'export'
      and (${from ?? null}::date is null or coalesce(e.shipping_bill_date, i.date) >= ${from ?? null}::date) and (${to ?? null}::date is null or coalesce(e.shipping_bill_date, i.date) <= ${to ?? null}::date)
    order by i.date, i.number, l.line_no`)];
  const byInvoice = new Map<string, { invoiceId: string; number: string; on: string; value: ReturnType<typeof dec>; earned: ReturnType<typeof dec>; missing: string[] }>();
  for (const l of lines) {
    const row = byInvoice.get(l.invoice_id) ?? { invoiceId: l.invoice_id, number: l.number, on: l.on, value: dec(0), earned: dec(0), missing: [] };
    const rate = rateFor(rates, scheme, l.hsn, l.on);
    row.value = row.value.plus(l.taxable);
    if (rate) row.earned = row.earned.plus(dec(l.taxable).times(rate.ratePct).div(100));
    else row.missing.push(l.hsn ? `${l.item} (${l.hsn})` : `${l.item} (no HSN)`);
    byInvoice.set(l.invoice_id, row);
  }
  const rows = [...byInvoice.values()].map((r) => ({ invoiceId: r.invoiceId, number: r.number, shippedOn: r.on, value: money(r.value), earned: money(r.earned), missingRate: [...new Set(r.missing)] }));
  return { scheme, total: money(rows.reduce((t, r) => t.plus(r.earned), dec(0))), uncovered: rows.filter((r) => r.missingRate.length).length, rows };
}

// ---- scrips ------------------------------------------------------------------------------------------------------

export async function listScrips(tx: Tx, asOf = businessDate()) {
  const company = await resolveCompany(tx);
  const rows = [...await tx.execute<{ id: string; scheme: string; number: string; issued_on: string; valid_until: string | null; amount: string; used: string }>(sql`
    select s.id, s.scheme, s.number, s.issued_on::text, s.valid_until::text, s.amount::text, coalesce((select sum(u.amount) from scrip_uses u where u.scrip_id = s.id), 0)::text as used
    from duty_scrips s where s.company_id = ${company.id} order by s.issued_on desc, s.number`)];
  const scrips = rows.map((r) => {
    const balance = dec(r.amount).minus(r.used);
    const expired = !!r.valid_until && r.valid_until < asOf;
    return { id: r.id, scheme: r.scheme, number: r.number, issuedOn: r.issued_on, validUntil: r.valid_until, amount: r.amount, used: money(r.used), balance: money(balance), expired, lapsing: expired ? money(balance.gt(0) ? balance : 0) : "0.00" };
  });
  const usable = scrips.filter((s) => !s.expired).reduce((t, s) => t.plus(s.balance), dec(0));
  const lapsed = scrips.reduce((t, s) => t.plus(s.lapsing), dec(0));
  return { usable: money(usable), lapsed: money(lapsed), scrips };
}

export async function addScrip(tx: Tx, actor: Actor, input: { scheme: string; number: string; issuedOn: string; validUntil?: string | null | undefined; amount: string }) {
  checkScheme(input.scheme);
  if (dec(input.amount).lte(0)) throw badRequest("invalid_amount");
  if (input.validUntil && input.validUntil < input.issuedOn) throw badRequest("invalid_dates");
  const company = await resolveCompany(tx);
  const [dup] = await tx.select({ id: tables.dutyScrips.id }).from(tables.dutyScrips).where(and(eq(tables.dutyScrips.companyId, company.id), eq(tables.dutyScrips.scheme, input.scheme), eq(tables.dutyScrips.number, input.number))).limit(1);
  if (dup) throw conflict("scrip_exists");
  const [row] = await tx.insert(tables.dutyScrips).values({ tenantId: actor.tenantId, companyId: company.id, scheme: input.scheme, number: input.number, issuedOn: input.issuedOn, validUntil: input.validUntil ?? null, amount: money(input.amount) }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "duty_scrip", entityId: row!.id, after: { scheme: input.scheme, number: input.number, amount: input.amount }, ip: actor.ip });
  return row!;
}

/** Uses part of a scrip against duty or sells it on; refuses more than the balance, or use after it lapsed. */
export async function useScrip(tx: Tx, actor: Actor, scripId: string, input: { usedOn: string; amount: string; purpose?: string | null | undefined }) {
  const [scrip] = await tx.select().from(tables.dutyScrips).where(eq(tables.dutyScrips.id, scripId)).for("update").limit(1);
  if (!scrip) throw notFound();
  const amount = dec(input.amount);
  if (amount.lte(0)) throw badRequest("invalid_amount");
  if (input.usedOn < scrip.issuedOn) throw badRequest("used_before_issue");
  if (scrip.validUntil && input.usedOn > scrip.validUntil) throw badRequest("scrip_expired");
  const [{ used }] = [...await tx.execute<{ used: string }>(sql`select coalesce(sum(amount), 0)::text as used from scrip_uses where scrip_id = ${scripId}`)] as [{ used: string }];
  if (dec(used).plus(amount).gt(scrip.amount)) throw badRequest("scrip_balance_low");
  const [row] = await tx.insert(tables.scripUses).values({ tenantId: actor.tenantId, scripId, usedOn: input.usedOn, amount: money(amount), purpose: input.purpose ?? null }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "scrip_use", entityId: row!.id, after: { scrip: scrip.number, amount: money(amount) }, ip: actor.ip });
  return row!;
}

// ---- inverted duty refund working -------------------------------------------------------------------------

/**
 * Refund of tax paid on inputs when inputs are taxed higher than the finished goods (Rule 89(5)):
 *   refund = (turnover of the inverted-rate supply x net ITC / adjusted total turnover) - tax payable on that supply.
 * Net ITC is the tax on goods bought at a rate above the output rate. This is a working to check against the return, not a filed claim.
 */
export async function invertedDutyRefund(tx: Tx, input: { from: string; to: string; outputRate: number }) {
  if (input.to < input.from) throw badRequest("invalid_dates");
  if (!(input.outputRate >= 0 && input.outputRate < 40)) throw badRequest("invalid_rate");
  const company = await resolveCompany(tx);
  const [out] = [...await tx.execute<{ inverted: string; payable: string; total: string }>(sql`
    select coalesce(sum(case when l.gst_rate = ${input.outputRate} and i.supply_kind not in ('export', 'sez') then l.taxable end), 0)::text as inverted,
           coalesce(sum(case when l.gst_rate = ${input.outputRate} and i.supply_kind not in ('export', 'sez') then l.cgst + l.sgst + l.utgst + l.igst end), 0)::text as payable,
           coalesce(sum(l.taxable), 0)::text as total
    from sales_invoices i join sales_invoice_lines l on l.invoice_id = i.id
    where i.company_id = ${company.id} and i.status = 'posted' and i.date between ${input.from}::date and ${input.to}::date`)] as [{ inverted: string; payable: string; total: string }];
  const [inp] = [...await tx.execute<{ itc: string; spent: string }>(sql`
    select coalesce(sum(l.cgst + l.sgst + l.utgst + l.igst), 0)::text as itc, coalesce(sum(l.taxable), 0)::text as spent
    from purchase_bills b join purchase_bill_lines l on l.bill_id = b.id
    where b.company_id = ${company.id} and b.status = 'posted' and b.reverse_charge = false and l.gst_rate > ${input.outputRate} and b.date between ${input.from}::date and ${input.to}::date`)] as [{ itc: string; spent: string }];
  const inverted = dec(out.inverted);
  const adjusted = dec(out.total);
  const netItc = dec(inp.itc);
  const share = adjusted.gt(0) ? inverted.times(netItc).div(adjusted) : dec(0);
  const refund = share.minus(out.payable);
  return {
    from: input.from, to: input.to, outputRate: input.outputRate,
    invertedTurnover: money(inverted), adjustedTurnover: money(adjusted), netItc: money(netItc), inputsBought: money(inp.spent),
    itcShare: money(share), taxPayableOnInverted: money(out.payable), refund: money(refund.gt(0) ? refund : 0),
    note: refund.gt(0) ? "claimable" : "none",
  };
}
