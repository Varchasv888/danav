import { and, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { businessDate } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

export const LR_STATUS = ["booked", "in_transit", "delivered"] as const;
export type LrStatus = (typeof LR_STATUS)[number];

export interface LrInput {
  date?: string | undefined; transporter?: string | undefined; lrNumber?: string | undefined;
  invoiceId?: string | null | undefined; customerId?: string | null | undefined; destination?: string | null | undefined;
  packages?: number | undefined; weightKg?: string | null | undefined; freight?: string | undefined; freightBy?: "paid" | "to_pay" | undefined;
  status?: LrStatus | undefined; deliveredOn?: string | null | undefined; note?: string | null | undefined;
}

/** Consignments sent through transporters, newest first, with the invoice and customer they belong to. */
export async function listLr(tx: Tx, q: { from?: string | undefined; to?: string | undefined; status?: string | undefined; search?: string | undefined }) {
  const company = await resolveCompany(tx);
  const l = tables.lrEntries;
  const like = q.search ? `%${q.search.trim()}%` : null;
  return tx.select({
    id: l.id, date: l.date, transporter: l.transporter, lrNumber: l.lrNumber, destination: l.destination, packages: l.packages, weightKg: l.weightKg,
    freight: l.freight, freightBy: l.freightBy, status: l.status, deliveredOn: l.deliveredOn, note: l.note, invoiceId: l.invoiceId, customerId: l.customerId,
    invoiceNumber: tables.salesInvoices.number, customer: tables.accounts.name,
    daysOut: sql<number | null>`case when ${l.status} = 'delivered' then null else (${businessDate()}::date - ${l.date})::int end`,
  }).from(l)
    .leftJoin(tables.salesInvoices, eq(tables.salesInvoices.id, l.invoiceId))
    .leftJoin(tables.accounts, eq(tables.accounts.id, l.customerId))
    .where(and(
      eq(l.companyId, company.id),
      q.from ? gte(l.date, q.from) : undefined, q.to ? lte(l.date, q.to) : undefined,
      q.status ? eq(l.status, q.status) : undefined,
      like ? or(ilike(l.lrNumber, like), ilike(l.transporter, like), ilike(tables.accounts.name, like), ilike(tables.salesInvoices.number, like)) : undefined,
    ))
    .orderBy(desc(l.date), desc(l.createdAt)).limit(500);
}

export async function saveLr(tx: Tx, actor: Actor, input: LrInput, id?: string) {
  const company = await resolveCompany(tx);
  const l = tables.lrEntries;
  let customerId = input.customerId;
  if (input.invoiceId) {
    const [inv] = await tx.select({ customerId: tables.salesInvoices.customerId }).from(tables.salesInvoices)
      .where(and(eq(tables.salesInvoices.id, input.invoiceId), eq(tables.salesInvoices.companyId, company.id)));
    if (!inv) throw badRequest("unknown_invoice");
    customerId ??= inv.customerId;
  }
  if (customerId) {
    const [a] = await tx.select({ id: tables.accounts.id }).from(tables.accounts).where(and(eq(tables.accounts.id, customerId), eq(tables.accounts.companyId, company.id)));
    if (!a) throw badRequest("unknown_account");
  }
  if (input.deliveredOn && input.date && input.deliveredOn < input.date) throw badRequest("delivered_before_sent");
  const values = {
    ...(input.date !== undefined ? { date: input.date } : {}),
    ...(input.transporter !== undefined ? { transporter: input.transporter.trim() } : {}),
    ...(input.lrNumber !== undefined ? { lrNumber: input.lrNumber.trim() } : {}),
    ...(input.invoiceId !== undefined ? { invoiceId: input.invoiceId } : {}),
    ...(customerId !== undefined ? { customerId } : {}),
    ...(input.destination !== undefined ? { destination: input.destination || null } : {}),
    ...(input.packages !== undefined ? { packages: input.packages } : {}),
    ...(input.weightKg !== undefined ? { weightKg: input.weightKg || null } : {}),
    ...(input.freight !== undefined ? { freight: input.freight } : {}),
    ...(input.freightBy !== undefined ? { freightBy: input.freightBy } : {}),
    ...(input.status !== undefined ? { status: input.status, deliveredOn: input.status === "delivered" ? input.deliveredOn ?? businessDate() : null } : {}),
    ...(input.note !== undefined ? { note: input.note || null } : {}),
  };
  const taken = (e: { cause?: { code?: string } }): never => { if (e?.cause?.code === "23505") throw badRequest("lr_taken"); throw e; };
  const [row] = id
    ? await tx.update(l).set(values).where(and(eq(l.id, id), eq(l.companyId, company.id))).returning().catch(taken)
    : await tx.insert(l).values({ ...values, tenantId: actor.tenantId, companyId: company.id, createdBy: actor.userId, date: input.date!, transporter: input.transporter!.trim(), lrNumber: input.lrNumber!.trim() }).returning().catch(taken);
  if (!row) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: id ? "update" : "create", entity: "lr_entry", entityId: row.id, after: values, ip: actor.ip ?? null });
  return row;
}
