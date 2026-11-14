import { randomInt } from "node:crypto";
import { and, desc, eq, gte, inArray, isNotNull, lte, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money, type CouponRule } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, notFound } from "../lib/errors.js";
import { postVoucher, resolveCompany } from "./accounting.js";
import { resolvePostingAccountIds } from "./ledgerparameters.js";
import { documentNumber } from "./inventory.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
type Company = Awaited<ReturnType<typeof resolveCompany>>;

const GV_SERIES = { docType: "gift_voucher", name: "Gift vouchers sold", pattern: "GV/{FY}/{SEQ:5}" };
const PAID_BY = { cash: "cash", upi: "upi_clearing", card: "card_clearing" } as const;
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I
const newCode = () => Array.from({ length: 10 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");

/** A fresh code no other voucher of the company has. */
export async function newVoucherCode(tx: Tx, companyId: string) {
  for (;;) {
    const code = newCode();
    const [hit] = await tx.select({ id: tables.giftVouchers.id }).from(tables.giftVouchers).where(and(eq(tables.giftVouchers.companyId, companyId), eq(tables.giftVouchers.code, code)));
    if (!hit) return code;
  }
}

export async function keyed(tx: Tx, company: Company, keys: string[]) {
  return resolvePostingAccountIds(tx, company.id, keys);
}

// ---- Gift vouchers --------------------------------------------------------------------------------

export interface IssueInput { value: string; count: number; expiresOn: string; paidBy: keyof typeof PAID_BY; date: string; customerPhone?: string | undefined; customerName?: string | undefined }

/** Sells gift vouchers: one posting for the lot (money in, liability up), each with its own code. */
export async function issueGiftVouchers(tx: Tx, actor: Actor, input: IssueInput) {
  const company = await resolveCompany(tx);
  if (input.expiresOn <= input.date) throw badRequest("expiry_before_issue");
  if (!dec(input.value).gt(0)) throw badRequest("invalid_amount");
  const total = dec(input.value).times(input.count);
  const acc = await keyed(tx, company, ["gift_vouchers", PAID_BY[input.paidBy]]);
  const number = await documentNumber(tx, actor, company, input.date, GV_SERIES);
  const { voucher } = await postVoucher(tx, actor, {
    companyId: company.id, type: "gift_voucher", documentNumber: number, date: input.date,
    narration: `${input.count} gift voucher(s) of ${money(input.value)}${input.customerName ? ` for ${input.customerName}` : ""}`,
    lines: [{ accountId: acc[PAID_BY[input.paidBy]]!, debit: money(total) }, { accountId: acc.gift_vouchers!, credit: money(total) }],
  });
  const taken = new Set((await tx.select({ code: tables.giftVouchers.code }).from(tables.giftVouchers).where(eq(tables.giftVouchers.companyId, company.id))).map((r) => r.code));
  const codes: string[] = [];
  while (codes.length < input.count) {
    const c = newCode();
    if (!taken.has(c)) { taken.add(c); codes.push(c); }
  }
  const rows = await tx.insert(tables.giftVouchers).values(codes.map((code) => ({
    tenantId: actor.tenantId, companyId: company.id, code, value: money(input.value), balance: money(input.value), issuedOn: input.date, expiresOn: input.expiresOn,
    paidBy: input.paidBy, customerPhone: input.customerPhone ?? null, customerName: input.customerName ?? null, voucherId: voucher.id, createdBy: actor.userId,
  }))).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "gift_voucher", entityId: voucher.id, after: { number, count: input.count, value: money(input.value) }, ip: actor.ip });
  return rows;
}

export async function listGiftVouchers(tx: Tx, q: { status?: string | undefined }) {
  const company = await resolveCompany(tx);
  return tx.select().from(tables.giftVouchers)
    .where(and(eq(tables.giftVouchers.companyId, company.id), q.status ? eq(tables.giftVouchers.status, q.status) : undefined))
    .orderBy(desc(tables.giftVouchers.createdAt)).limit(500);
}

/** A voucher by its code, with what it was spent on. */
export async function giftVoucherByCode(tx: Tx, code: string) {
  const company = await resolveCompany(tx);
  const [v] = await tx.select().from(tables.giftVouchers).where(and(eq(tables.giftVouchers.companyId, company.id), eq(tables.giftVouchers.code, code.trim().toUpperCase())));
  if (!v) throw notFound();
  const used = await tx.select({ date: tables.giftVoucherRedemptions.date, amount: tables.giftVoucherRedemptions.amount, number: tables.posBills.number, reversed: tables.giftVoucherRedemptions.reversed })
    .from(tables.giftVoucherRedemptions).innerJoin(tables.posBills, eq(tables.posBills.id, tables.giftVoucherRedemptions.billId))
    .where(eq(tables.giftVoucherRedemptions.giftVoucherId, v.id)).orderBy(tables.giftVoucherRedemptions.createdAt);
  return { ...v, used };
}

/** Writes back what is left on vouchers past their expiry: one journal for the lot. */
export async function expireGiftVouchers(tx: Tx, actor: Actor, asOf: string) {
  const company = await resolveCompany(tx);
  const due = await tx.select().from(tables.giftVouchers)
    .where(and(eq(tables.giftVouchers.companyId, company.id), eq(tables.giftVouchers.status, "active"), sql`${tables.giftVouchers.expiresOn} < ${asOf}::date`)).for("update");
  if (!due.length) return { expired: 0, amount: "0.00" };
  const amount = due.reduce((s, v) => s.plus(v.balance), dec(0));
  let voucherId: string | null = null;
  if (amount.gt(0)) {
    const acc = await keyed(tx, company, ["gift_vouchers", "vouchers_written_back"]);
    const { voucher } = await postVoucher(tx, actor, {
      companyId: company.id, type: "journal", date: asOf, narration: `Unredeemed gift vouchers written back (${due.length})`,
      lines: [{ accountId: acc.gift_vouchers!, debit: money(amount) }, { accountId: acc.vouchers_written_back!, credit: money(amount) }],
    });
    voucherId = voucher.id;
  }
  await tx.update(tables.giftVouchers).set({ status: "expired", expiryVoucherId: voucherId }).where(inArray(tables.giftVouchers.id, due.map((v) => v.id)));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "gift_voucher", entityId: company.id, after: { expired: due.length, amount: money(amount) }, ip: actor.ip });
  return { expired: due.length, amount: money(amount) };
}

// ---- Coupons and discount cards -----------------------------------------------------------------

export interface CouponInput {
  code: string; kind: "percent" | "amount"; value: string; maxDiscount?: string | null | undefined; minBill?: string | null | undefined;
  startsOn?: string | null | undefined; endsOn?: string | null | undefined; maxUses?: number | null | undefined; active?: boolean | undefined;
}

export async function saveCoupon(tx: Tx, actor: Actor, input: CouponInput, id?: string) {
  const company = await resolveCompany(tx);
  if (input.kind === "percent" && (!dec(input.value).gt(0) || dec(input.value).gt(100))) throw badRequest("invalid_percent");
  if (!dec(input.value).gt(0)) throw badRequest("invalid_amount");
  if (input.startsOn && input.endsOn && input.endsOn < input.startsOn) throw badRequest("ends_before_start");
  const values = {
    code: input.code.trim().toUpperCase(), kind: input.kind, value: dec(input.value).toFixed(2),
    maxDiscount: input.kind === "percent" && input.maxDiscount ? money(input.maxDiscount) : null, minBill: input.minBill ? money(input.minBill) : null,
    startsOn: input.startsOn ?? null, endsOn: input.endsOn ?? null, maxUses: input.maxUses ?? null, ...(input.active !== undefined ? { active: input.active } : {}),
  };
  const [row] = await (id
    ? tx.update(tables.coupons).set(values).where(and(eq(tables.coupons.id, id), eq(tables.coupons.companyId, company.id))).returning()
    : tx.insert(tables.coupons).values({ tenantId: actor.tenantId, companyId: company.id, ...values }).returning()
  ).catch((e) => {
    if (e?.cause?.code === "23505") throw badRequest("code_taken");
    throw e;
  });
  if (!row) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: id ? "update" : "create", entity: "coupon", entityId: row.id, after: { code: row.code, value: row.value }, ip: actor.ip });
  return row;
}

export interface CardInput { number: string; holder: string; phone?: string | null | undefined; pct: string; validUntil?: string | null | undefined; active?: boolean | undefined }

export async function saveCard(tx: Tx, actor: Actor, input: CardInput, id?: string) {
  const company = await resolveCompany(tx);
  if (!dec(input.pct).gt(0) || dec(input.pct).gt(100)) throw badRequest("invalid_percent");
  const values = {
    number: input.number.trim().toUpperCase(), holder: input.holder.trim(), phone: input.phone ?? null, pct: dec(input.pct).toFixed(2),
    validUntil: input.validUntil ?? null, ...(input.active !== undefined ? { active: input.active } : {}),
  };
  const [row] = await (id
    ? tx.update(tables.discountCards).set(values).where(and(eq(tables.discountCards.id, id), eq(tables.discountCards.companyId, company.id))).returning()
    : tx.insert(tables.discountCards).values({ tenantId: actor.tenantId, companyId: company.id, ...values }).returning()
  ).catch((e) => {
    if (e?.cause?.code === "23505") throw badRequest("code_taken");
    throw e;
  });
  if (!row) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: id ? "update" : "create", entity: "discount_card", entityId: row.id, after: { number: row.number, pct: row.pct }, ip: actor.ip });
  return row;
}

/** A coupon that can be used on a bill dated `date` (row-locked when billing, so uses can't run over). */
export async function usableCoupon(tx: Tx, companyId: string, code: string, date: string, lock = false) {
  const q = tx.select().from(tables.coupons).where(and(eq(tables.coupons.companyId, companyId), sql`upper(${tables.coupons.code}) = ${code.trim().toUpperCase()}`));
  const [c] = lock ? await q.for("update") : await q;
  if (!c || !c.active) throw badRequest("coupon_not_found");
  if ((c.startsOn && date < c.startsOn) || (c.endsOn && date > c.endsOn)) throw badRequest("coupon_not_valid_today");
  if (c.maxUses !== null && c.used >= c.maxUses) throw badRequest("coupon_used_up");
  return c;
}

export async function usableCard(tx: Tx, companyId: string, number: string, date: string) {
  const [c] = await tx.select().from(tables.discountCards).where(and(eq(tables.discountCards.companyId, companyId), sql`upper(${tables.discountCards.number}) = ${number.trim().toUpperCase()}`));
  if (!c || !c.active) throw badRequest("card_not_found");
  if (c.validUntil && date > c.validUntil) throw badRequest("card_expired");
  return c;
}

export const couponRule = (c: typeof tables.coupons.$inferSelect): CouponRule => ({ kind: c.kind as "percent" | "amount", value: c.value, maxDiscount: c.maxDiscount, minBill: c.minBill });

/** Gift vouchers offered as payment on a bill: active, in date, enough balance; rows locked. */
export async function takeGiftVouchers(tx: Tx, companyId: string, use: { code: string; amount: string }[], date: string) {
  const out: { row: typeof tables.giftVouchers.$inferSelect; amount: string }[] = [];
  for (const u of use) {
    const [v] = await tx.select().from(tables.giftVouchers).where(and(eq(tables.giftVouchers.companyId, companyId), eq(tables.giftVouchers.code, u.code.trim().toUpperCase()))).for("update");
    if (!v) throw badRequest("voucher_not_found");
    if (out.some((o) => o.row.id === v.id)) throw badRequest("voucher_twice");
    if (v.status !== "active" || date > v.expiresOn) throw badRequest("voucher_not_usable");
    if (!dec(u.amount).gt(0) || dec(u.amount).gt(v.balance)) throw badRequest("voucher_balance_low");
    out.push({ row: v, amount: money(u.amount) });
  }
  return out;
}

export async function recordRedemptions(tx: Tx, tenantId: string, billId: string, date: string, used: { row: typeof tables.giftVouchers.$inferSelect; amount: string }[]) {
  for (const u of used) {
    const left = dec(u.row.balance).minus(u.amount);
    await tx.update(tables.giftVouchers).set({ balance: money(left), status: left.isZero() ? "used" : "active" }).where(eq(tables.giftVouchers.id, u.row.id));
    await tx.insert(tables.giftVoucherRedemptions).values({ tenantId, giftVoucherId: u.row.id, billId, date, amount: u.amount });
  }
}

/** Voiding a bill gives back voucher balances and the coupon's use. */
export async function undoPromos(tx: Tx, bill: typeof tables.posBills.$inferSelect) {
  const reds = await tx.select().from(tables.giftVoucherRedemptions).where(and(eq(tables.giftVoucherRedemptions.billId, bill.id), eq(tables.giftVoucherRedemptions.reversed, false)));
  for (const r of reds) {
    await tx.update(tables.giftVouchers).set({ balance: sql`${tables.giftVouchers.balance} + ${r.amount}`, status: sql`case when ${tables.giftVouchers.status} = 'used' then 'active' else ${tables.giftVouchers.status} end` })
      .where(eq(tables.giftVouchers.id, r.giftVoucherId));
    await tx.update(tables.giftVoucherRedemptions).set({ reversed: true }).where(eq(tables.giftVoucherRedemptions.id, r.id));
  }
  if (bill.promos.coupon) await tx.update(tables.coupons).set({ used: sql`greatest(${tables.coupons.used} - 1, 0)` }).where(eq(tables.coupons.id, bill.promos.coupon.id));
}

// ---- Lucky draw ---------------------------------------------------------------------------------

/**
 * Picks winners at random among the period's paid bills with a customer mobile (each bill is one entry,
 * so regular customers have better odds), one prize per mobile number.
 */
export async function runLuckyDraw(tx: Tx, actor: Actor, input: { name: string; fromDate: string; toDate: string; minBill?: string | undefined; winners: number }) {
  const company = await resolveCompany(tx);
  if (input.toDate < input.fromDate) throw badRequest("ends_before_start");
  const bills = await tx.select({ id: tables.posBills.id, number: tables.posBills.number, date: tables.posBills.date, phone: tables.posBills.customerPhone, name: tables.posBills.customerName, total: tables.posBills.total })
    .from(tables.posBills).where(and(
      eq(tables.posBills.companyId, company.id), eq(tables.posBills.status, "paid"), isNotNull(tables.posBills.customerPhone),
      gte(tables.posBills.date, input.fromDate), lte(tables.posBills.date, input.toDate),
      input.minBill ? sql`${tables.posBills.total} >= ${input.minBill}` : undefined,
    ));
  if (!bills.length) throw badRequest("no_entries");
  const pool = [...bills];
  const winners: typeof bills = [];
  while (winners.length < input.winners && pool.length) {
    const pick = pool[randomInt(pool.length)]!;
    winners.push(pick);
    for (let i = pool.length - 1; i >= 0; i--) if (pool[i]!.phone === pick.phone) pool.splice(i, 1);
  }
  const [row] = await tx.insert(tables.luckyDraws).values({
    tenantId: actor.tenantId, companyId: company.id, name: input.name.trim(), fromDate: input.fromDate, toDate: input.toDate, minBill: input.minBill ? money(input.minBill) : null,
    entries: bills.length, winners: winners.map((w) => ({ billId: w.id, number: w.number, date: w.date, phone: w.phone!, name: w.name, total: w.total })), createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "lucky_draw", entityId: row!.id, after: { name: row!.name, entries: bills.length, winners: winners.length }, ip: actor.ip });
  return row!;
}

export async function listDraws(tx: Tx) {
  const company = await resolveCompany(tx);
  return tx.select().from(tables.luckyDraws).where(eq(tables.luckyDraws.companyId, company.id)).orderBy(desc(tables.luckyDraws.createdAt)).limit(100);
}

