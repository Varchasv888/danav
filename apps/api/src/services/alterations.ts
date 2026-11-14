import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money, type PosPayment, businessDate } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { cancelVoucher, postVoucher, resolveCompany } from "./accounting.js";
import { resolvePostingAccountId } from "./ledgerparameters.js";
import { documentNumber, ensureInventory } from "./inventory.js";
import { createBill } from "./pos.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
type Company = Awaited<ReturnType<typeof resolveCompany>>;

const SERIES = { docType: "alteration", name: "Alteration slips", pattern: "ALT/{FY}/{SEQ:5}" };
/** The service the charges are billed under (its HSN and GST rate can be changed on the item). */
const CHARGE_ITEM = { name: "Alteration and tailoring charges", hsn: "998821", gstRate: "5" };

// ---- masters ------------------------------------------------------------------------------------------

export interface KarigarInput {
  name: string; phone?: string | null | undefined; accountId?: string | null | undefined; employeeId?: string | null | undefined; active?: boolean | undefined;
  /** An outside karigar without a ledger gets one under Sundry Creditors. */
  outside?: boolean | undefined;
}

export async function saveKarigar(tx: Tx, actor: Actor, input: KarigarInput, id?: string) {
  const company = await resolveCompany(tx);
  if (input.accountId) {
    const [a] = await tx.select({ companyId: tables.accounts.companyId }).from(tables.accounts).where(eq(tables.accounts.id, input.accountId));
    if (!a || a.companyId !== company.id) throw badRequest("unknown_account");
  }
  if (input.employeeId) {
    const [e] = await tx.select({ companyId: tables.employees.companyId }).from(tables.employees).where(eq(tables.employees.id, input.employeeId));
    if (!e || e.companyId !== company.id) throw badRequest("unknown_employee");
  }
  let accountId = input.accountId ?? null;
  if (input.outside && !accountId) {
    const [g] = await tx.select({ id: tables.accountGroups.id }).from(tables.accountGroups).where(and(eq(tables.accountGroups.companyId, company.id), eq(tables.accountGroups.key, "sundry_creditors")));
    const [a] = await tx.insert(tables.accounts).values({ tenantId: actor.tenantId, companyId: company.id, groupId: g!.id, name: `${input.name.trim()} (karigar)`, phone: input.phone ?? null })
      .returning().catch((e) => {
        if (e?.cause?.code === "23505") throw badRequest("name_taken");
        throw e;
      });
    accountId = a!.id;
  }
  const values = { name: input.name.trim(), phone: input.phone ?? null, accountId, employeeId: input.employeeId ?? null, ...(input.active !== undefined ? { active: input.active } : {}) };
  const [row] = await (id
    ? tx.update(tables.karigars).set(values).where(and(eq(tables.karigars.id, id), eq(tables.karigars.companyId, company.id))).returning()
    : tx.insert(tables.karigars).values({ tenantId: actor.tenantId, companyId: company.id, ...values }).returning()
  ).catch((e) => {
    if (e?.cause?.code === "23505") throw badRequest("name_taken");
    throw e;
  });
  if (!row) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: id ? "update" : "create", entity: "karigar", entityId: row.id, after: { name: row.name }, ip: actor.ip });
  return row;
}

export interface AlterationTypeInput { name: string; kind: "alteration" | "repair"; charge: string; labour: string; active?: boolean | undefined }

export async function saveAlterationType(tx: Tx, actor: Actor, input: AlterationTypeInput, id?: string) {
  const company = await resolveCompany(tx);
  const values = { name: input.name.trim(), kind: input.kind, charge: money(input.charge), labour: money(input.labour), ...(input.active !== undefined ? { active: input.active } : {}) };
  const [row] = await (id
    ? tx.update(tables.alterationTypes).set(values).where(and(eq(tables.alterationTypes.id, id), eq(tables.alterationTypes.companyId, company.id))).returning()
    : tx.insert(tables.alterationTypes).values({ tenantId: actor.tenantId, companyId: company.id, ...values }).returning()
  ).catch((e) => {
    if (e?.cause?.code === "23505") throw badRequest("name_taken");
    throw e;
  });
  if (!row) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: id ? "update" : "create", entity: "alteration_type", entityId: row.id, after: { name: row.name, charge: row.charge, labour: row.labour }, ip: actor.ip });
  return row;
}

// ---- slips --------------------------------------------------------------------------------------------

export interface AlterationInput {
  date: string; billId?: string | undefined; customerName?: string | undefined; customerPhone?: string | undefined;
  lines: { typeId: string; garment: string; qty: number; notes?: string | undefined }[];
  complimentary?: boolean | undefined; trialOn?: string | undefined; deliveryOn: string; notes?: string | undefined;
}

export async function createAlteration(tx: Tx, actor: Actor, input: AlterationInput) {
  const company = await resolveCompany(tx);
  if (input.deliveryOn < input.date) throw badRequest("delivery_before_date");
  if (input.trialOn && (input.trialOn < input.date || input.trialOn > input.deliveryOn)) throw badRequest("trial_out_of_range");
  let bill: typeof tables.posBills.$inferSelect | undefined;
  if (input.billId) {
    [bill] = await tx.select().from(tables.posBills).where(eq(tables.posBills.id, input.billId));
    if (!bill || bill.companyId !== company.id) throw badRequest("unknown_bill");
  }
  const types = await tx.select().from(tables.alterationTypes).where(and(eq(tables.alterationTypes.companyId, company.id), inArray(tables.alterationTypes.id, [...new Set(input.lines.map((l) => l.typeId))])));
  const lines = input.lines.map((l) => {
    const ty = types.find((x) => x.id === l.typeId);
    if (!ty || !ty.active) throw badRequest("unknown_alteration_type");
    return { typeId: ty.id, name: ty.name, garment: l.garment.trim(), qty: l.qty, charge: money(dec(ty.charge).times(l.qty)), labour: money(dec(ty.labour).times(l.qty)), ...(l.notes ? { notes: l.notes } : {}) };
  });
  const number = await documentNumber(tx, actor, company, input.date, SERIES);
  const [row] = await tx.insert(tables.alterations).values({
    tenantId: actor.tenantId, companyId: company.id, number, date: input.date, billId: bill?.id ?? null,
    customerName: input.customerName ?? bill?.customerName ?? null, customerPhone: input.customerPhone ?? bill?.customerPhone ?? null,
    lines, charge: money(lines.reduce((s, l) => s.plus(l.charge), dec(0))), labour: money(lines.reduce((s, l) => s.plus(l.labour), dec(0))),
    complimentary: !!input.complimentary, trialOn: input.trialOn ?? null, deliveryOn: input.deliveryOn, notes: input.notes ?? null, createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "alteration", entityId: row!.id, after: { number, charge: row!.charge }, ip: actor.ip });
  return row!;
}

async function load(tx: Tx, id: string) {
  const [a] = await tx.select().from(tables.alterations).where(eq(tables.alterations.id, id)).for("update");
  if (!a) throw notFound();
  return a;
}

/** Garments handed to a karigar. */
export async function issueAlteration(tx: Tx, actor: Actor, id: string, input: { karigarId: string; date: string }) {
  const a = await load(tx, id);
  if (a.status !== "received") throw conflict("not_received");
  const [k] = await tx.select().from(tables.karigars).where(eq(tables.karigars.id, input.karigarId));
  if (!k || k.companyId !== a.companyId || !k.active) throw badRequest("unknown_karigar");
  if (input.date < a.date) throw badRequest("date_before_slip");
  const [row] = await tx.update(tables.alterations).set({ status: "with_karigar", karigarId: k.id, issuedOn: input.date }).where(eq(tables.alterations.id, id)).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "alteration", entityId: id, after: { status: "with_karigar", karigar: k.name }, ip: actor.ip });
  return row!;
}

/** Work back from the karigar: an outside karigar is credited the labour. */
export async function receiveAlteration(tx: Tx, actor: Actor, id: string, input: { date: string }) {
  const a = await load(tx, id);
  if (a.status !== "with_karigar") throw conflict("not_with_karigar");
  if (input.date < (a.issuedOn ?? a.date)) throw badRequest("date_before_issue");
  const [k] = await tx.select().from(tables.karigars).where(eq(tables.karigars.id, a.karigarId!));
  let labourVoucherId: string | null = null;
  if (k?.accountId && dec(a.labour).gt(0)) labourVoucherId = await postKarigarLabour(tx, actor, a.companyId, k.accountId, a.labour, input.date, `Alteration labour ${a.number} (${k.name})`);
  const [row] = await tx.update(tables.alterations).set({ status: "ready", readyOn: input.date, labourVoucherId }).where(eq(tables.alterations.id, id)).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "alteration", entityId: id, after: { status: "ready" }, ip: actor.ip });
  return row!;
}

/** A service item to bill charges under, created the first time it is needed (found again by name). */
export async function ensureServiceItem(tx: Tx, company: Company, spec: { name: string; hsn: string; gstRate: string }) {
  const [hit] = await tx.select({ id: tables.items.id }).from(tables.items).where(and(eq(tables.items.companyId, company.id), sql`lower(${tables.items.name}) = ${spec.name.toLowerCase()}`));
  if (hit) return hit.id;
  await ensureInventory(tx, company.tenantId, company.id);
  const [uom] = await tx.select({ id: tables.uoms.id }).from(tables.uoms).where(and(eq(tables.uoms.companyId, company.id), eq(tables.uoms.code, "OTH")));
  const [it] = await tx.insert(tables.items).values({
    tenantId: company.tenantId, companyId: company.id, name: spec.name, kind: "service", hsn: spec.hsn, gstRate: spec.gstRate, uomId: uom!.id,
  }).returning();
  return it!.id;
}

/** Labour for an outside karigar: alteration and tailoring labour debited, the karigar's ledger credited. */
export async function postKarigarLabour(tx: Tx, actor: Actor, companyId: string, karigarAccountId: string, amount: string, date: string, narration: string) {
  const expenseAccountId = await resolvePostingAccountId(tx, companyId, "alteration_labour");
  return (await postVoucher(tx, actor, { companyId, type: "journal", date, narration, lines: [{ accountId: expenseAccountId, debit: amount }, { accountId: karigarAccountId, credit: amount }] })).voucher.id;
}

/** Handed back to the customer; the charge (unless free) is collected on a counter bill. */
export async function deliverAlteration(tx: Tx, actor: Actor, id: string, input: { terminalId?: string | undefined; payments?: PosPayment[] | undefined }) {
  const a = await load(tx, id);
  if (a.status !== "ready") throw conflict("not_ready");
  let deliveryBillId: string | null = null;
  if (!a.complimentary && dec(a.charge).gt(0)) {
    if (!input.terminalId) throw badRequest("terminal_required");
    const company = await resolveCompany(tx, a.companyId);
    const itemId = await ensureServiceItem(tx, company, CHARGE_ITEM);
    const r = await createBill(tx, actor, {
      terminalId: input.terminalId, lines: [{ itemId, qty: "1", price: a.charge }], payments: input.payments ?? [],
      ...(a.customerPhone ? { customerPhone: a.customerPhone } : {}), ...(a.customerName ? { customerName: a.customerName } : {}),
    });
    deliveryBillId = r.bill.id;
  }
  const today = businessDate();
  const [row] = await tx.update(tables.alterations).set({ status: "delivered", deliveredOn: today, deliveryBillId }).where(eq(tables.alterations.id, id)).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "alteration", entityId: id, after: { status: "delivered", bill: deliveryBillId }, ip: actor.ip });
  return row!;
}

export async function cancelAlteration(tx: Tx, actor: Actor, id: string, reason: string) {
  const a = await load(tx, id);
  if (a.status === "delivered" || a.status === "cancelled") throw conflict("cannot_cancel");
  if (a.labourVoucherId) await cancelVoucher(tx, actor, a.labourVoucherId, reason);
  await tx.update(tables.alterations).set({ status: "cancelled", notes: [a.notes, `Cancelled: ${reason}`].filter(Boolean).join("\n") }).where(eq(tables.alterations.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "alteration", entityId: id, after: { reason }, ip: actor.ip });
}

/** Slips with the karigar's name; open ones first, with overdue marked. */
export async function listAlterations(tx: Tx, q: { status?: string | undefined; karigarId?: string | undefined; from?: string | undefined; to?: string | undefined }) {
  const company = await resolveCompany(tx);
  const today = businessDate();
  const rows = await tx.select({ a: tables.alterations, karigar: tables.karigars.name, billNumber: tables.posBills.number }).from(tables.alterations)
    .leftJoin(tables.karigars, eq(tables.karigars.id, tables.alterations.karigarId))
    .leftJoin(tables.posBills, eq(tables.posBills.id, tables.alterations.billId))
    .where(and(
      eq(tables.alterations.companyId, company.id),
      q.status === "open" ? inArray(tables.alterations.status, ["received", "with_karigar", "ready"]) : q.status ? eq(tables.alterations.status, q.status) : undefined,
      q.karigarId ? eq(tables.alterations.karigarId, q.karigarId) : undefined,
      q.from ? gte(tables.alterations.date, q.from) : undefined, q.to ? lte(tables.alterations.date, q.to) : undefined,
    )).orderBy(tables.alterations.deliveryOn, desc(tables.alterations.createdAt)).limit(500);
  const open = (s: string) => s === "received" || s === "with_karigar" || s === "ready";
  return rows.map((r) => ({ ...r.a, karigar: r.karigar, billNumber: r.billNumber, overdue: open(r.a.status) && r.a.deliveryOn < today, trialToday: open(r.a.status) && r.a.trialOn === today }));
}

/** Labour by karigar for work that came back in a period. */
export async function labourReport(tx: Tx, from: string, to: string) {
  const company = await resolveCompany(tx);
  const rows = await tx.select({ karigar: tables.karigars.name, outside: sql<boolean>`${tables.karigars.accountId} is not null`, labour: tables.alterations.labour, lines: tables.alterations.lines })
    .from(tables.alterations).innerJoin(tables.karigars, eq(tables.karigars.id, tables.alterations.karigarId))
    .where(and(eq(tables.alterations.companyId, company.id), inArray(tables.alterations.status, ["ready", "delivered"]), gte(tables.alterations.readyOn, from), lte(tables.alterations.readyOn, to)));
  const by = new Map<string, { karigar: string; outside: boolean; slips: number; pieces: number; labour: ReturnType<typeof dec> }>();
  for (const r of rows) {
    const cur = by.get(r.karigar) ?? { karigar: r.karigar, outside: r.outside, slips: 0, pieces: 0, labour: dec(0) };
    cur.slips += 1;
    cur.pieces += r.lines.reduce((n, l) => n + l.qty, 0);
    cur.labour = cur.labour.plus(r.labour);
    by.set(r.karigar, cur);
  }
  return { from, to, rows: [...by.values()].map((r) => ({ ...r, labour: money(r.labour) })).sort((a, b) => Number(b.labour) - Number(a.labour)) };
}
