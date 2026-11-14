import { and, desc, eq, inArray } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { businessDate, canMove, dec, findState, money } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { postVoucher, resolveCompany } from "./accounting.js";
import { resolvePostingAccountIds } from "./ledgerparameters.js";
import { emitEvent } from "./comms.js";
import { documentNumber } from "./inventory.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

const SERIES = { docType: "repair_job", name: "Repair jobs", pattern: "RP/{FY}/{SEQ:5}" };
export type Spare = { name: string; qty: string; cost: string };

/** The accounts a repair posts to: where money lands (cash unless a bank is named), the deposits held for customers, and the income. */
async function repairAccounts(tx: Tx, actor: Actor, companyId: string, paidInto?: string | undefined) {
  const by = await resolvePostingAccountIds(tx, companyId, ["cash", "repair_deposits", "repair_income", "output_cgst", "output_sgst", "output_utgst"]);
  if (paidInto) {
    const [a] = await tx.select({ id: tables.accounts.id }).from(tables.accounts).where(and(eq(tables.accounts.id, paidInto), eq(tables.accounts.companyId, companyId)));
    if (!a) throw badRequest("unknown_account");
  }
  return { money: paidInto ?? by.cash!, deposits: by.repair_deposits!, income: by.repair_income!, cgst: by.output_cgst!, sgst: by.output_sgst!, utgst: by.output_utgst! };
}

export interface RepairInput {
  receivedOn: string; customerName: string; customerPhone?: string | undefined; itemDescription: string; complaint?: string | undefined; warranty?: boolean | undefined;
  deposit?: string | undefined; promisedOn?: string | undefined;
  /** Cash or bank account the deposit was taken into (cash when empty). */
  paidInto?: string | undefined;
  /** The sale this comes from (an order, an invoice or a counter bill): its customer and goods fill in whatever was left blank. */
  source?: { kind: "order" | "invoice" | "bill"; id: string } | undefined;
}

/** Takes a repair in at the desk. */
export async function createRepair(tx: Tx, actor: Actor, input: RepairInput) {
  const company = await resolveCompany(tx);
  const sale = input.source ? await saleById(tx, company.id, input.source.kind, input.source.id) : null;
  if (input.source && !sale) throw notFound("unknown_sale");
  if (input.deposit && dec(input.deposit).isNegative()) throw badRequest("invalid_amount");
  const number = await documentNumber(tx, actor, company, input.receivedOn, SERIES);
  const [row] = await tx.insert(tables.repairJobs).values({
    tenantId: actor.tenantId, companyId: company.id, number, receivedOn: input.receivedOn, customerName: input.customerName, customerPhone: input.customerPhone ?? null,
    itemDescription: input.itemDescription, complaint: input.complaint ?? null, sourceKind: sale?.kind ?? null, sourceId: sale?.id ?? null, sourceNumber: sale?.number ?? null, warranty: input.warranty ?? false, deposit: money(input.deposit ?? "0"), promisedOn: input.promisedOn ?? null, createdBy: actor.userId,
  }).returning();
  // A deposit is money held for the customer: Dr cash or bank, Cr Repair deposits (a liability until the job is delivered or cancelled).
  if (dec(input.deposit ?? 0).gt(0)) {
    const acc = await repairAccounts(tx, actor, company.id, input.paidInto);
    const { voucher } = await postVoucher(tx, actor, {
      companyId: company.id, type: "repair", documentNumber: `${number}/D`, date: input.receivedOn, narration: `Deposit for repair ${number} (${input.customerName})`,
      lines: [{ accountId: acc.money, debit: money(input.deposit!) }, { accountId: acc.deposits, credit: money(input.deposit!) }],
    });
    await tx.update(tables.repairJobs).set({ depositVoucherId: voucher.id }).where(eq(tables.repairJobs.id, row!.id));
  }
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "repair_job", entityId: row!.id, after: { number, customer: input.customerName }, ip: actor.ip });
  return row!;
}

export type RepairAction =
  | { action: "estimate"; estimate: string; diagnosis?: string | undefined }
  | { action: "approve" }
  | { action: "decline"; reason: string }
  | { action: "start"; diagnosis?: string | undefined }
  | { action: "ready"; finalCharge?: string | undefined; spares?: Spare[] | undefined }
  | { action: "deliver"; date: string; paidInto?: string | undefined; gstRate?: string | undefined }
  | { action: "cancel"; reason: string };

const TARGET: Record<RepairAction["action"], string> = { estimate: "estimated", approve: "approved", decline: "declined", start: "in_repair", ready: "ready", deliver: "delivered", cancel: "cancelled" };

/** Moves a repair along its written path (see the repairJob lifecycle); anything else is refused. */
export async function actOnRepair(tx: Tx, actor: Actor, id: string, input: RepairAction) {
  const [r] = await tx.select().from(tables.repairJobs).where(eq(tables.repairJobs.id, id)).for("update");
  if (!r) throw notFound();
  const to = TARGET[input.action];
  // A repair under warranty needs no estimate and goes straight to the bench; any other waits for an approved estimate.
  const allowed = canMove("repairJob", r.status, to) && !(input.action === "start" && r.status === "received" && !r.warranty);
  if (!allowed) throw conflict("repair_cannot_move");
  const set: Partial<typeof tables.repairJobs.$inferInsert> = { status: to };
  if (input.action === "estimate") {
    if (r.warranty) throw badRequest("warranty_needs_no_estimate");
    if (!dec(input.estimate).gte(0)) throw badRequest("invalid_amount");
    set.estimate = money(input.estimate);
    if (input.diagnosis !== undefined) set.diagnosis = input.diagnosis;
  }
  if (input.action === "start" && input.diagnosis !== undefined) set.diagnosis = input.diagnosis;
  if (input.action === "decline" || input.action === "cancel") set.reason = input.reason;
  if (input.action === "ready") {
    if (input.spares) {
      for (const s of input.spares) if (!dec(s.qty).gt(0) || dec(s.cost).isNegative()) throw badRequest("invalid_spare");
      set.spares = input.spares;
    }
    // Under warranty the customer pays nothing; otherwise the charge defaults to the approved estimate.
    set.finalCharge = r.warranty ? "0.00" : money(input.finalCharge ?? r.estimate ?? "0");
  }
  if (input.action === "deliver") {
    if (input.date < r.receivedOn) throw badRequest("delivered_before_received");
    set.deliveredOn = input.date;
  }
  const deposit = dec(r.deposit);
  // Delivery books the charge as income, uses the deposit against it and takes (or hands back) the difference.
  if (input.action === "deliver") {
    const charge = dec(r.finalCharge ?? 0);
    if (charge.gt(0) || deposit.gt(0)) {
      const acc = await repairAccounts(tx, actor, r.companyId, input.paidInto);
      const lines: { accountId: string; debit?: string; credit?: string }[] = [];
      if (deposit.gt(0)) lines.push({ accountId: acc.deposits, debit: money(deposit) });
      if (charge.gt(deposit)) lines.push({ accountId: acc.money, debit: money(charge.minus(deposit)) });
      // The charge is what the customer pays. A paid repair carries GST inside it (a warranty repair, with no charge, carries none): the income is the
      // value before tax and the tax goes to the output tax accounts, half and half.
      const rate = r.warranty ? dec(0) : dec(input.gstRate ?? r.gstRate ?? 0);
      if (rate.lt(0) || rate.gt(28)) throw badRequest("invalid_gst_rate");
      const tax = charge.gt(0) && rate.gt(0) ? dec(money(charge.minus(charge.times(100).div(rate.plus(100))))) : dec(0);
      if (charge.gt(0)) lines.push({ accountId: acc.income, credit: money(charge.minus(tax)) });
      if (tax.gt(0)) {
        const [branch] = await tx.select({ stateCode: tables.branches.stateCode }).from(tables.branches).where(and(eq(tables.branches.companyId, r.companyId), eq(tables.branches.isHeadOffice, true)));
        const half = dec(money(tax.div(2)));
        lines.push({ accountId: acc.cgst, credit: money(half) }, { accountId: findState(branch?.stateCode ?? "")?.ut ? acc.utgst : acc.sgst, credit: money(tax.minus(half)) });
      }
      set.gstRate = rate.toFixed(2);
      set.gstAmount = money(tax);
      if (deposit.gt(charge)) lines.push({ accountId: acc.money, credit: money(deposit.minus(charge)) });
      const { voucher } = await postVoucher(tx, actor, { companyId: r.companyId, type: "repair", documentNumber: `${r.number}/S`, date: input.date, narration: `Repair ${r.number} delivered to ${r.customerName}`, lines });
      set.settleVoucherId = voucher.id;
    }
  }
  // A repair declined or cancelled gives the deposit back.
  if ((input.action === "decline" || input.action === "cancel") && deposit.gt(0)) {
    const acc = await repairAccounts(tx, actor, r.companyId);
    const { voucher } = await postVoucher(tx, actor, {
      companyId: r.companyId, type: "repair", documentNumber: `${r.number}/R`, date: businessDate() > r.receivedOn ? businessDate() : r.receivedOn, narration: `Deposit returned for repair ${r.number}`,
      lines: [{ accountId: acc.deposits, debit: money(deposit) }, { accountId: acc.money, credit: money(deposit) }],
    });
    set.settleVoucherId = voucher.id;
  }
  const [row] = await tx.update(tables.repairJobs).set(set).where(eq(tables.repairJobs.id, id)).returning();
  // Tell the customer when the job is ready or handed back (queued, so it goes at the next send; a customer with no mobile is simply not messaged).
  if ((to === "ready" || to === "delivered") && r.customerPhone) {
    await tx.transaction(async (sp) => {
      await emitEvent(sp, actor, { event: "repair_status", phone: r.customerPhone!, params: { name: r.customerName, number: r.number, status: to === "ready" ? "ready to collect" : "delivered" }, dedupeKey: `repair:${r.id}:${to}`, channels: ["whatsapp", "sms"] });
    }).catch(() => undefined);
  }
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "repair_job", entityId: id, before: { status: r.status }, after: { status: to }, ip: actor.ip });
  return row!;
}

export async function listRepairs(tx: Tx, q: { status?: string | undefined; search?: string | undefined; sourceId?: string | undefined }) {
  const company = await resolveCompany(tx);
  const rows = await tx.select().from(tables.repairJobs).where(and(eq(tables.repairJobs.companyId, company.id), q.status ? eq(tables.repairJobs.status, q.status) : undefined, q.sourceId ? eq(tables.repairJobs.sourceId, q.sourceId) : undefined))
    .orderBy(desc(tables.repairJobs.receivedOn), desc(tables.repairJobs.createdAt)).limit(300);
  const term = q.search?.trim().toLowerCase();
  return term ? rows.filter((r) => [r.number, r.customerName, r.customerPhone ?? "", r.itemDescription].some((x) => x.toLowerCase().includes(term))) : rows;
}

export async function getRepair(tx: Tx, id: string) {
  const [r] = await tx.select().from(tables.repairJobs).where(eq(tables.repairJobs.id, id));
  if (!r) throw notFound();
  return r;
}

/** Repairs not yet delivered, with how many days they have waited and whether the promised date has passed. */
export async function openRepairs(tx: Tx, today: string) {
  const company = await resolveCompany(tx);
  const rows = await tx.select().from(tables.repairJobs).where(eq(tables.repairJobs.companyId, company.id));
  return rows.filter((r) => !["delivered", "declined", "cancelled"].includes(r.status)).map((r) => ({
    id: r.id, number: r.number, customerName: r.customerName, status: r.status, receivedOn: r.receivedOn, promisedOn: r.promisedOn,
    waitingDays: Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${r.receivedOn}T00:00:00Z`)) / 86_400_000), overdue: !!r.promisedOn && r.promisedOn < today,
  })).sort((a, b) => b.waitingDays - a.waitingDays);
}


// ---- inquiry log --------------------------------------------------------------------------------------------

export const INQUIRY_KINDS = ["repair", "tailoring", "product", "order", "other"] as const;

export async function addInquiry(tx: Tx, actor: Actor, input: { date: string; customerName: string; customerPhone?: string | null | undefined; kind: (typeof INQUIRY_KINDS)[number]; note: string; followUpOn?: string | null | undefined }) {
  const company = await resolveCompany(tx);
  if (input.followUpOn && input.followUpOn < input.date) throw badRequest("follow_up_before_inquiry");
  const [row] = await tx.insert(tables.inquiries).values({
    tenantId: actor.tenantId, companyId: company.id, date: input.date, customerName: input.customerName.trim(), customerPhone: input.customerPhone ?? null, kind: input.kind,
    note: input.note.trim(), followUpOn: input.followUpOn ?? null, createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "inquiry", entityId: row!.id, after: { kind: input.kind }, ip: actor.ip });
  return row!;
}

/** Closes an inquiry with what came of it, or marks it as turned into a repair job. */
export async function closeInquiry(tx: Tx, actor: Actor, id: string, input: { status: "closed" | "converted"; outcome?: string | undefined; repairId?: string | undefined }) {
  const [i] = await tx.select().from(tables.inquiries).where(eq(tables.inquiries.id, id)).for("update");
  if (!i) throw notFound();
  if (i.status !== "open") throw conflict("inquiry_closed");
  if (input.status === "closed" && !input.outcome?.trim()) throw badRequest("outcome_required");
  if (input.repairId) {
    const [r] = await tx.select({ id: tables.repairJobs.id }).from(tables.repairJobs).where(eq(tables.repairJobs.id, input.repairId));
    if (!r) throw badRequest("unknown_repair");
  }
  const [row] = await tx.update(tables.inquiries).set({ status: input.status, outcome: input.outcome?.trim() || null, repairId: input.repairId ?? null }).where(eq(tables.inquiries.id, id)).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "inquiry", entityId: id, after: { status: input.status }, ip: actor.ip });
  return row!;
}

/** Open inquiries first, with the ones whose follow-up day has come at the top. */
export async function listInquiries(tx: Tx, today: string, status?: string) {
  const company = await resolveCompany(tx);
  const rows = await tx.select().from(tables.inquiries).where(and(eq(tables.inquiries.companyId, company.id), status ? eq(tables.inquiries.status, status) : undefined))
    .orderBy(desc(tables.inquiries.date)).limit(500);
  const out = rows.map((r) => ({ ...r, due: r.status === "open" && !!r.followUpOn && r.followUpOn <= today }));
  return out.sort((a, b) => Number(b.due) - Number(a.due) || (a.status === "open" ? 0 : 1) - (b.status === "open" ? 0 : 1));
}

// ---- repair and tailoring customers ---------------------------------------------------------------------------

/**
 * Each service-desk customer (by phone): repairs and tailoring orders, what they paid up front and still sits with us as a liability, what they were
 * charged on delivery, and what is still to collect on work that is ready. A deposit or advance is never income until the work is delivered.
 */
export async function serviceCustomers(tx: Tx) {
  const company = await resolveCompany(tx);
  const repairs = await tx.select().from(tables.repairJobs).where(eq(tables.repairJobs.companyId, company.id));
  const orders = await tx.select().from(tables.tailoringOrders).where(eq(tables.tailoringOrders.companyId, company.id));
  const by = new Map<string, { phone: string; name: string; jobs: { kind: "repair" | "tailoring"; number: string; date: string; status: string; amount: string; held: string; due: string }[] }>();
  const slot = (phone: string | null, name: string) => {
    const key = phone || `name:${name.toLowerCase()}`;
    const e = by.get(key) ?? { phone: phone ?? "", name, jobs: [] };
    by.set(key, e);
    return e;
  };
  for (const r of repairs) {
    const live = !["delivered", "declined", "cancelled"].includes(r.status);
    const charge = dec(r.finalCharge ?? r.estimate ?? 0);
    slot(r.customerPhone, r.customerName).jobs.push({
      kind: "repair", number: r.number, date: r.receivedOn, status: r.status, amount: money(r.status === "delivered" ? (r.finalCharge ?? 0) : charge),
      held: money(live ? r.deposit : 0), due: money(r.status === "ready" && !r.warranty ? dec(r.finalCharge ?? 0).minus(r.deposit).gt(0) ? dec(r.finalCharge ?? 0).minus(r.deposit) : 0 : 0),
    });
  }
  for (const o of orders) {
    const live = o.status !== "delivered" && o.status !== "cancelled";
    slot(o.customerPhone, o.customerName).jobs.push({
      kind: "tailoring", number: o.number, date: o.date, status: o.status, amount: money(o.total), held: money(live ? o.advance : 0),
      due: money(o.status === "ready" ? dec(o.total).minus(o.advance) : 0),
    });
  }
  const rows = [...by.values()].map((e) => ({
    ...e, jobs: e.jobs.sort((a, b) => b.date.localeCompare(a.date)),
    held: money(e.jobs.reduce((t, j) => t.plus(j.held), dec(0))), due: money(e.jobs.reduce((t, j) => t.plus(j.due), dec(0))),
    open: e.jobs.filter((j) => !["delivered", "declined", "cancelled"].includes(j.status)).length,
  })).sort((a, b) => Number(b.due) + Number(b.held) - (Number(a.due) + Number(a.held)) || a.name.localeCompare(b.name));
  return { customers: rows, totalHeld: money(rows.reduce((t, r) => t.plus(r.held), dec(0))), totalDue: money(rows.reduce((t, r) => t.plus(r.due), dec(0))) };
}

// ---- repairs that come from a sale --------------------------------------------------------------------

export interface SaleForRepair { kind: "order" | "invoice" | "bill"; id: string; number: string; date: string; customerName: string; customerPhone: string | null; items: string[] }

async function saleLines(tx: Tx, kind: SaleForRepair["kind"], id: string) {
  const names = kind === "order"
    ? await tx.select({ n: tables.items.name }).from(tables.salesOrderLines).innerJoin(tables.items, eq(tables.items.id, tables.salesOrderLines.itemId)).where(eq(tables.salesOrderLines.orderId, id))
    : kind === "invoice"
      ? await tx.select({ n: tables.items.name }).from(tables.salesInvoiceLines).innerJoin(tables.items, eq(tables.items.id, tables.salesInvoiceLines.itemId)).where(eq(tables.salesInvoiceLines.invoiceId, id))
      : await tx.select({ n: tables.posBillLines.name }).from(tables.posBillLines).where(eq(tables.posBillLines.billId, id));
  return [...new Set(names.map((x) => x.n))];
}

async function saleById(tx: Tx, companyId: string, kind: SaleForRepair["kind"], id: string): Promise<SaleForRepair | null> {
  if (kind === "bill") {
    const [b] = await tx.select().from(tables.posBills).where(and(eq(tables.posBills.id, id), eq(tables.posBills.companyId, companyId)));
    return b ? { kind, id: b.id, number: b.number, date: b.date, customerName: b.customerName ?? "", customerPhone: b.customerPhone ?? null, items: await saleLines(tx, kind, b.id) } : null;
  }
  const t = kind === "order" ? tables.salesOrders : tables.salesInvoices;
  const [d] = await tx.select({ id: t.id, number: t.number, date: t.date, name: tables.accounts.name, phone: tables.accounts.phone }).from(t)
    .innerJoin(tables.accounts, eq(tables.accounts.id, t.customerId)).where(and(eq(t.id, id), eq(t.companyId, companyId)));
  return d ? { kind, id: d.id, number: d.number, date: d.date, customerName: d.name, customerPhone: d.phone?.replace(/\D/g, "").slice(-10) ?? null, items: await saleLines(tx, kind, d.id) } : null;
}

/** Finds a sale by its document number (order, invoice or counter bill) so a repair can start from it with the customer and goods filled in. */
export async function findSaleForRepair(tx: Tx, number: string): Promise<SaleForRepair> {
  const company = await resolveCompany(tx);
  const n = number.trim();
  if (!n) throw badRequest("number_required");
  for (const [kind, table] of [["order", tables.salesOrders], ["invoice", tables.salesInvoices], ["bill", tables.posBills]] as const) {
    const [row] = await tx.select({ id: table.id }).from(table).where(and(eq(table.companyId, company.id), eq(table.number, n)));
    if (row) return (await saleById(tx, company.id, kind, row.id))!;
  }
  throw notFound("unknown_sale");
}
