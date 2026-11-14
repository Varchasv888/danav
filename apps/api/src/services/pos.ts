import { and, asc, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import {
  businessDate, businessTime,   applySchemes, dec, promoDiscounts, schemesAllowed, loyaltyEarningShare, findState, fiscalYearOf, loyaltyEarned, loyaltyRedeemable, money, posBill, returnCredit, settlePayments, type Dec, type LoyaltyRule, type PosPayment,
} from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { assertPeriodOpen, cancelVoucher, fiscalYearForDate, postVoucher, resolveCompany } from "./accounting.js";
import { resolvePostingAccountIds } from "./ledgerparameters.js";
import { billFromMemo } from "./approvalmemos.js";
import { activeRates } from "./branchprices.js";
import { normalizeSerials, restoreBillSerials, returnSerials, sellSerials } from "./serials.js";
import { assertGstr1Open } from "./filing.js";
import { currentRate, documentNumber, ensureInventory, explodePacks, postMoves, reverseMoves, type Move } from "./inventory.js";
import { saleMoves } from "./manufacturing.js";
import { addLot, lapsedNotRemoved, reverseBill, settleLapsed, spendPoints } from "./loyaltylots.js";
import { branchOfWarehouse, resolvedSchemes } from "./schemes.js";
import { couponRule, newVoucherCode, recordRedemptions, takeGiftVouchers, undoPromos, usableCard, usableCoupon } from "./vouchers.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
type Company = Awaited<ReturnType<typeof resolveCompany>>;
type Terminal = typeof tables.posTerminals.$inferSelect;

const POS_ACCOUNTS = ["cash", "upi_clearing", "card_clearing", "gift_vouchers", "sales", "sales_returns", "output_cgst", "output_sgst", "output_utgst", "output_cess", "round_off", "cash_short_excess"];
const posError = (e: unknown): never => { throw badRequest(e instanceof Error ? e.message : "invalid_bill"); };
const today = () => businessDate();

export const terminalSeries = (t: Pick<Terminal, "code">) => ({ docType: `pos_${t.code}`, name: `POS bills ${t.code}`, pattern: `${t.code}/{FY}/{SEQ:5}` });

async function accounts(tx: Tx, company: Company) {
  return resolvePostingAccountIds(tx, company.id, POS_ACCOUNTS);
}

// ---- settings and terminals ---------------------------------------------------------------------------

export async function posSettings(tx: Tx, companyId: string) {
  const [s] = await tx.select().from(tables.posSettings).where(eq(tables.posSettings.companyId, companyId));
  return s ?? {
    companyId, pricesIncludeTax: true, loyaltyEnabled: false,
    loyaltyPointsPer100: 1, loyaltySlabs: null as { from: string; per100: number }[] | null, loyaltyMinRedeem: 0, loyaltyValidityDays: null as number | null, helperSharePct: "30.00", loyaltyExcludeDiscountedBills: false, loyaltyExcludeDiscountedItems: false, loyaltyExcludeBrands: null as string[] | null, loyaltyExcludeCategories: null as string[] | null, loyaltyPointValue: "1.00", loyaltyMaxRedeemPct: "20.00", referralPoints: 0, receiptFooter: null,
    allowRateChange: true, maxLineDiscountPct: null as string | null, maxBillDiscountPct: null as string | null, requireSalesman: false, autoSendBill: false,
  };
}

export async function savePosSettings(tx: Tx, actor: Actor, input: Partial<Omit<typeof tables.posSettings.$inferInsert, "companyId" | "tenantId">>) {
  const company = await resolveCompany(tx);
  const { companyId: _c, ...current } = await posSettings(tx, company.id) as typeof tables.posSettings.$inferSelect;
  const values = { ...current, ...input, tenantId: actor.tenantId };
  const [row] = await tx.insert(tables.posSettings).values({ companyId: company.id, ...values })
    .onConflictDoUpdate({ target: tables.posSettings.companyId, set: values }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "pos_settings", entityId: company.id, after: input, ip: actor.ip });
  return row!;
}

export async function listTerminals(tx: Tx, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const rows = await tx.select({ t: tables.posTerminals, warehouse: tables.warehouses.name, branchId: tables.warehouses.branchId, device: tables.devices.name }).from(tables.posTerminals)
    .innerJoin(tables.warehouses, eq(tables.warehouses.id, tables.posTerminals.warehouseId))
    .leftJoin(tables.devices, eq(tables.devices.id, tables.posTerminals.deviceId))
    .where(eq(tables.posTerminals.companyId, company.id)).orderBy(asc(tables.posTerminals.code));
  const open = rows.length ? await tx.select().from(tables.posSessions).where(and(inArray(tables.posSessions.terminalId, rows.map((r) => r.t.id)), eq(tables.posSessions.status, "open"))) : [];
  return rows.map((r) => ({ ...r.t, warehouse: r.warehouse, branchId: r.branchId, device: r.device, openSession: open.find((s) => s.terminalId === r.t.id) ?? null }));
}

export async function saveTerminal(tx: Tx, actor: Actor, input: { name: string; warehouseId?: string | undefined; deviceId?: string | null | undefined; archived?: boolean | undefined }, id?: string) {
  const company = await resolveCompany(tx);
  await ensureInventory(tx, actor.tenantId, company.id);
  if (input.warehouseId) {
    const [w] = await tx.select().from(tables.warehouses).where(eq(tables.warehouses.id, input.warehouseId));
    if (!w || w.companyId !== company.id) throw badRequest("unknown_warehouse");
  }
  if (input.deviceId) {
    const [d] = await tx.select().from(tables.devices).where(eq(tables.devices.id, input.deviceId));
    if (!d || d.revokedAt) throw badRequest("unknown_device");
  }
  if (id) {
    const [row] = await tx.update(tables.posTerminals).set({ name: input.name, ...(input.warehouseId ? { warehouseId: input.warehouseId } : {}), ...(input.deviceId !== undefined ? { deviceId: input.deviceId } : {}), archived: !!input.archived })
      .where(and(eq(tables.posTerminals.id, id), eq(tables.posTerminals.companyId, company.id))).returning();
    if (!row) throw notFound();
    return row;
  }
  const [{ n }] = (await tx.execute<{ n: number }>(sql`select count(*)::int as n from pos_terminals where company_id = ${company.id}`)) as unknown as [{ n: number }];
  const [wh] = await tx.select().from(tables.warehouses).where(and(eq(tables.warehouses.companyId, company.id), eq(tables.warehouses.isDefault, true)));
  const [row] = await tx.insert(tables.posTerminals).values({
    tenantId: actor.tenantId, companyId: company.id, code: `T${n + 1}`, name: input.name, warehouseId: input.warehouseId ?? wh!.id, deviceId: input.deviceId ?? null,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "pos_terminal", entityId: row!.id, after: { code: row!.code, name: input.name }, ip: actor.ip });
  return row!;
}

// ---- sessions ---------------------------------------------------------------------------------------------

async function loadTerminal(tx: Tx, id: string) {
  const [t] = await tx.select().from(tables.posTerminals).where(eq(tables.posTerminals.id, id));
  if (!t) throw badRequest("unknown_terminal");
  if (t.archived) throw conflict("terminal_archived");
  return t;
}

export async function openSession(tx: Tx, actor: Actor, terminalId: string, openingCash: string) {
  const t = await loadTerminal(tx, terminalId);
  if (t.deviceId) throw conflict("device_terminal");
  const [open] = await tx.select({ id: tables.posSessions.id }).from(tables.posSessions).where(and(eq(tables.posSessions.terminalId, terminalId), eq(tables.posSessions.status, "open")));
  if (open) throw conflict("session_already_open");
  const [s] = await tx.insert(tables.posSessions).values({ tenantId: actor.tenantId, terminalId, openedBy: actor.userId, openingCash: money(openingCash) }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "pos_session", entityId: s!.id, after: { terminal: t.code, openingCash: s!.openingCash }, ip: actor.ip });
  return s!;
}

async function sessionTotals(tx: Tx, sessionId: string) {
  const bills = await tx.select().from(tables.posBills).where(and(eq(tables.posBills.sessionId, sessionId), eq(tables.posBills.status, "paid")));
  const by = (mode: string) => bills.reduce((s, b) => s.plus(b.payments.filter((p) => p.mode === mode).reduce((t, p) => t.plus(p.amount), dec(0))), dec(0));
  const change = bills.reduce((s, b) => s.plus(b.change), dec(0));
  // Refunds for goods returned during the shift leave the drawer (or go back on UPI or card).
  const rets = await tx.select({ mode: tables.posReturns.refundMode, total: tables.posReturns.total }).from(tables.posReturns).where(eq(tables.posReturns.sessionId, sessionId));
  const refund = (mode: string) => rets.filter((r) => r.mode === mode).reduce((s, r) => s.plus(r.total), dec(0));
  return {
    bills: String(bills.length), total: money(bills.reduce((s, b) => s.plus(b.total), dec(0))),
    cash: money(by("cash").minus(change).minus(refund("cash"))), upi: money(by("upi").minus(refund("upi"))), card: money(by("card").minus(refund("card"))), credit: money(by("credit")),
    returns: money(rets.reduce((s, r) => s.plus(r.total), dec(0))),
  };
}

/**
 * Closing a shift: cash expected = opening float + cash taken (less change given). The counted cash
 * is compared, and any shortage or excess is posted to Cash Short / Excess.
 */
export async function closeSession(tx: Tx, actor: Actor, sessionId: string, countedCash: string) {
  const [s] = await tx.select().from(tables.posSessions).where(eq(tables.posSessions.id, sessionId)).for("update");
  if (!s) throw notFound();
  if (s.status !== "open") throw conflict("session_closed");
  const t = await loadTerminal(tx, s.terminalId);
  const totals = await sessionTotals(tx, sessionId);
  const expected = dec(s.openingCash).plus(totals.cash);
  const diff = dec(countedCash).minus(expected);
  let voucherId: string | null = null;
  if (!diff.isZero()) {
    const company = await resolveCompany(tx, t.companyId);
    const acc = await accounts(tx, company);
    const amt = money(diff.abs());
    const lines = diff.lt(0)
      ? [{ accountId: acc.cash_short_excess!, debit: amt }, { accountId: acc.cash!, credit: amt }]
      : [{ accountId: acc.cash!, debit: amt }, { accountId: acc.cash_short_excess!, credit: amt }];
    voucherId = (await postVoucher(tx, actor, { companyId: company.id, type: "journal", date: today(), narration: `Cash ${diff.lt(0) ? "short" : "excess"} at ${t.code} ${t.name}`, lines })).voucher.id;
  }
  const [row] = await tx.update(tables.posSessions).set({
    status: "closed", closedBy: actor.userId, closedAt: new Date(), expectedCash: money(expected), countedCash: money(countedCash), difference: money(diff), totals, voucherId,
  }).where(eq(tables.posSessions.id, sessionId)).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "pos_session", entityId: sessionId, after: { expected: money(expected), counted: money(countedCash) }, ip: actor.ip });
  return row!;
}

export async function getSession(tx: Tx, id: string) {
  const [s] = await tx.select().from(tables.posSessions).where(eq(tables.posSessions.id, id));
  if (!s) throw notFound();
  return { ...s, live: s.status === "open" ? await sessionTotals(tx, id) : s.totals };
}

// ---- bills ------------------------------------------------------------------------------------------------

export interface BillInput {
  id?: string | undefined; terminalId: string; sessionId?: string | undefined; date?: string | undefined;
  lines: { itemId: string; qty: string; price?: string | undefined; discount?: string | undefined; salesmanId?: string | undefined; helperId?: string | undefined; serials?: string[] | undefined }[];
  billDiscount?: string | undefined; redeemPoints?: number | undefined;
  /** The salesman for lines that name none. */
  salesmanId?: string | undefined;
  helperId?: string | undefined;
  /** Why a rate change or a discount over the counter limit is allowed (only someone who may approve sales can). */
  overrideReason?: string | undefined; canOverride?: boolean | undefined;
  customerPhone?: string | undefined; customerName?: string | undefined; customerAccountId?: string | undefined;
  /** The moment a device billed the customer (ISO); the server's own clock is used when it is missing or not believable. */
  billedAt?: string | undefined;
  payments: PosPayment[];
  /** Schemes a device already took off its lines (the server applies schemes only to lines without a discount). */
  schemes?: { schemeId: string; name: string; discount: string }[] | undefined;
  /** Offers that need the cashier's yes and got it. */
  confirmedSchemes?: string[] | undefined;
  /** Whether the person may change a rate at the counter (false lets only an approver, with a reason, do it). */
  canChangeRate?: boolean | undefined;
  /** Online counters only: a coupon code, a discount card, gift vouchers paying part of the bill, and who referred a new member. */
  couponCode?: string | undefined; cardNumber?: string | undefined; giftVouchers?: { code: string; amount: string }[] | undefined; referredBy?: string | undefined;
  /** Online counters only: goods brought back on this same bill. Their credit pays for the new lines first; any left stays as store credit. */
  exchange?: { billId: string; lines: ReturnInput["lines"] } | undefined;
  /** Online counters only: an approval memo whose goods are being billed. The pieces on the bill come off the memo. */
  memoId?: string | undefined;
  /** Offline devices: the number the device printed, and its totals to check against. */
  number?: string | undefined; deviceTotal?: string | undefined; deviceId?: string | undefined;
}

/**
 * A retail bill: tax taken out of (or added to) the prices, bill discount and loyalty points as a price
 * reduction, payment check, then one sales voucher per bill
 * (Dr cash / UPI / card / customer; Cr Sales and output GST) and the goods
 * leaving the terminal's warehouse. Points are earned on what was paid.
 */
/** A device's own clock is trusted only if it is not in the future and not older than a month; otherwise the bill is timed when it arrives. */
function believableTime(iso: string | undefined) {
  if (!iso) return new Date();
  const t = Date.parse(iso);
  const now = Date.now();
  return Number.isFinite(t) && t <= now + 5 * 60_000 && t >= now - 31 * 86_400_000 ? new Date(t) : new Date();
}

export async function createBill(tx: Tx, actor: Actor, input: BillInput) {
  if (input.id) {
    const [again] = await tx.select().from(tables.posBills).where(eq(tables.posBills.id, input.id));
    if (again) return { bill: again, warnings: [], replayed: true };
  }
  const t = await loadTerminal(tx, input.terminalId);
  const company = await resolveCompany(tx, t.companyId);
  const settings = await posSettings(tx, company.id);
  const date = input.date ?? today();
  let sessionId: string | null = null;
  if (t.deviceId) {
    if (!input.deviceId || input.deviceId !== t.deviceId) throw badRequest("terminal_on_other_device");
    if (!input.number) throw badRequest("number_required");
  } else {
    const [s] = await tx.select().from(tables.posSessions).where(and(eq(tables.posSessions.terminalId, t.id), eq(tables.posSessions.status, "open")));
    if (!s || (input.sessionId && input.sessionId !== s.id)) throw conflict("session_not_open");
    sessionId = s.id;
  }
  await assertGstr1Open(tx, company.id, date);
  assertPeriodOpen(await fiscalYearForDate(tx, actor.tenantId, company, date), date);
  if (!input.lines.length) throw badRequest("no_lines");
  const its = await tx.select().from(tables.items).where(inArray(tables.items.id, [...new Set(input.lines.map((l) => l.itemId))]));
  // The store's own rates, over the item's usual one (a device bill has no time of day, so hour-limited rates are left out).
  const storeRates = await activeRates(tx, company.id, t.warehouseId, date, t.deviceId ? undefined : businessTime());
  const lines = input.lines.map((l) => {
    const it = its.find((i) => i.id === l.itemId);
    if (!it || it.companyId !== company.id) throw badRequest("unknown_item");
    if (it.archived) throw badRequest("item_archived");
    if (!dec(l.qty).gt(0)) throw badRequest("qty_must_be_positive");
    const rate = storeRates.get(it.id) ?? it.saleRate;
    const serials = it.trackSerials ? normalizeSerials(l.serials) : null;
    if (it.trackSerials && !t.deviceId && !serials!.length) throw badRequest("serials_required");
    return { it, rate, serials, qty: l.qty, price: l.price ?? money(rate), discount: l.discount ?? "0", gstRate: it.gstRate, cessRate: it.cessRate };
  });
  // Counter controls (web counters; an offline device has already printed its bill).
  const overrides: { kind: "rate" | "line_discount" | "bill_discount"; lineNo?: number; reason: string }[] = [];
  const allow = (kind: (typeof overrides)[number]["kind"], code: string, lineNo?: number) => {
    const reason = input.overrideReason?.trim();
    if (!input.canOverride || !reason) throw badRequest(code);
    overrides.push({ kind, ...(lineNo ? { lineNo } : {}), reason });
  };
  if (!t.deviceId) {
    lines.forEach((l, i) => {
      if (input.lines[i]!.price !== undefined && !dec(l.price).eq(l.rate) && (!settings.allowRateChange || input.canChangeRate === false)) allow("rate", "rate_locked", i + 1);
      const gross = dec(l.price).times(l.qty);
      if (settings.maxLineDiscountPct !== null && gross.gt(0) && dec(l.discount).div(gross).times(100).gt(settings.maxLineDiscountPct)) allow("line_discount", "discount_over_limit", i + 1);
    });
    if (input.billDiscount && dec(input.billDiscount).gt(0) && settings.maxBillDiscountPct !== null) {
      const net = lines.reduce((v, l) => v.plus(dec(l.price).times(l.qty)).minus(l.discount), dec(0));
      if (net.gt(0) && dec(input.billDiscount).div(net).times(100).gt(settings.maxBillDiscountPct)) allow("bill_discount", "bill_discount_over_limit");
    }
  }
  // Who sold each line: its own salesman, else the bill's.
  const salesmen = input.lines.map((l) => l.salesmanId ?? input.salesmanId ?? null);
  // Who helped on each line: its own helper, else the bill's. A helper is never also the salesman of the same line.
  const helpers = input.lines.map((l, i) => l.helperId ?? input.helperId ?? null);
  if (helpers.some((h, i) => h && h === salesmen[i])) throw badRequest("helper_is_salesman");
  const named = [...new Set([...salesmen, ...helpers].filter((x): x is string => !!x))];
  if (named.length) {
    const found = await tx.select({ id: tables.employees.id, companyId: tables.employees.companyId, status: tables.employees.status }).from(tables.employees).where(inArray(tables.employees.id, named));
    if (found.length !== named.length || found.some((e) => e.companyId !== company.id || e.status !== "active")) throw badRequest("unknown_salesman");
  }
  if (settings.requireSalesman && !t.deviceId && salesmen.some((x) => !x)) throw badRequest("salesman_required");

  // Store schemes on the lines without a discount of their own.
  const resolved = await resolvedSchemes(tx, company.id, await branchOfWarehouse(tx, t.warehouseId));
  const usable = t.deviceId ? resolved.filter((x) => !x.confirmBeforeApply) : schemesAllowed(resolved, { giftVouchers: !!input.giftVouchers?.length, customerDiscount: !!(input.couponCode || input.cardNumber), confirmed: input.confirmedSchemes ?? [] });
  const offers = applySchemes(lines.map((l) => ({ itemId: l.it.id, qty: l.qty, price: l.price, discount: l.discount, taxRate: l.gstRate })), usable, date, t.deviceId ? undefined : businessTime(), { pricesIncludeTax: settings.pricesIncludeTax });
  // An offer on a line that already had a discount adds to it.
  lines.forEach((l, i) => { if (dec(offers.discounts[i]!).gt(0)) l.discount = money(dec(l.discount).plus(offers.discounts[i]!)); });
  const schemesApplied = [...(input.schemes ?? []).map((s) => ({ schemeId: s.schemeId, name: s.name, discount: money(s.discount) })), ...offers.applied.map((a) => (resolved.find((x) => x.id === a.schemeId)?.allowReturns === false ? { ...a, noReturns: true } : a))];
  const opts = { inclusive: settings.pricesIncludeTax, billDiscount: input.billDiscount ?? "0", date };
  const priced = lines.map((l) => ({ qty: l.qty, price: l.price, gstRate: l.gstRate, cessRate: l.cessRate, discount: l.discount, gstSlab: l.it.gstSlab, slabPieces: l.it.slabPieces }));

  // Discount card, then coupon: price reductions on the bill (after schemes and any bill discount).
  const promos: typeof tables.posBills.$inferInsert["promos"] = {};
  if (input.couponCode || input.cardNumber) {
    if (t.deviceId) throw badRequest("online_only");
    const coupon = input.couponCode ? await usableCoupon(tx, company.id, input.couponCode, date, true) : null;
    const card = input.cardNumber ? await usableCard(tx, company.id, input.cardNumber, date) : null;
    let pre;
    try { pre = posBill(priced, opts); } catch (e) { posError(e); }
    let off;
    try { off = promoDiscounts(pre!.total, card ? { pct: card.pct } : null, coupon ? couponRule(coupon) : null); } catch (e) { throw badRequest((e as Error).message); }
    opts.billDiscount = money(dec(opts.billDiscount).plus(off.card).plus(off.coupon));
    if (card) promos.card = { id: card.id, number: card.number, discount: off.card };
    if (coupon) promos.coupon = { id: coupon.id, code: coupon.code, discount: off.coupon };
  }

  // Loyalty: points redeemed are a price reduction; points are earned on the amount paid.
  const rule: LoyaltyRule = { pointsPer100: settings.loyaltyPointsPer100, pointValue: settings.loyaltyPointValue, maxRedeemPct: settings.loyaltyMaxRedeemPct, slabs: settings.loyaltySlabs, minRedeem: settings.loyaltyMinRedeem };
  let member: typeof tables.loyaltyMembers.$inferSelect | undefined;
  if (input.customerPhone && !/^[6-9]\d{9}$/.test(input.customerPhone)) throw badRequest("invalid_phone");
  if (settings.loyaltyEnabled && input.customerPhone) {
    [member] = await tx.select().from(tables.loyaltyMembers).where(and(eq(tables.loyaltyMembers.companyId, company.id), eq(tables.loyaltyMembers.phone, input.customerPhone))).for("update");
    if (member) { const gone = await settleLapsed(tx, member.id, date); if (gone) member = { ...member, points: Math.max(member.points - gone, 0) }; }
    if (!member) {
      // A new member's referrer (an existing member) earns the referral points.
      let referredBy: string | null = null;
      if (input.referredBy && input.referredBy !== input.customerPhone && settings.referralPoints > 0) {
        const [ref] = await tx.update(tables.loyaltyMembers).set({ points: sql`${tables.loyaltyMembers.points} + ${settings.referralPoints}`, lifetimePoints: sql`${tables.loyaltyMembers.lifetimePoints} + ${settings.referralPoints}` })
          .where(and(eq(tables.loyaltyMembers.companyId, company.id), eq(tables.loyaltyMembers.phone, input.referredBy))).returning({ phone: tables.loyaltyMembers.phone });
        referredBy = ref?.phone ?? null;
      }
      [member] = await tx.insert(tables.loyaltyMembers).values({ tenantId: actor.tenantId, companyId: company.id, phone: input.customerPhone, name: input.customerName ?? null, referredBy }).returning();
    }
  }
  let redeemValue = "0";
  const redeem = input.redeemPoints ?? 0;
  if (redeem > 0) {
    if (!member) throw badRequest("loyalty_not_available");
    let before;
    try { before = posBill(priced, opts); } catch (e) { posError(e); }
    const allowed = loyaltyRedeemable(member.points, before!.total, rule);
    if (redeem > allowed.points) throw badRequest("too_many_points");
    redeemValue = money(dec(rule.pointValue).times(redeem));
  }
  let bill;
  try { bill = posBill(priced, { ...opts, billDiscount: money(dec(opts.billDiscount).plus(redeemValue)) }); } catch (e) { posError(e); }
  const b = bill!;
  // An exchange: the goods come back as a credit note whose store credit pays for this bill first.
  let exchange: Awaited<ReturnType<typeof createPosReturn>> | null = null;
  if (input.exchange) {
    if (t.deviceId) throw badRequest("online_only");
    exchange = await createPosReturn(tx, actor, { billId: input.exchange.billId, terminalId: t.id, lines: input.exchange.lines, refundMode: "voucher" });
  }
  const exchangeUsed = exchange ? money(dec(exchange.total).lt(b.total) ? exchange.total : b.total) : "0.00";
  const vouchersIn = [...(exchange && dec(exchangeUsed).gt(0) ? [{ code: exchange.voucherCode!, amount: exchangeUsed }] : []), ...(input.giftVouchers ?? [])];
  // Gift vouchers pay first; the rest is settled in cash, UPI, card or on account.
  if (input.giftVouchers?.length && t.deviceId) throw badRequest("online_only");
  const gvs = vouchersIn.length ? await takeGiftVouchers(tx, company.id, vouchersIn, date) : [];
  const gvTotal = gvs.reduce((s, g) => s.plus(g.amount), dec(0));
  if (gvTotal.gt(b.total)) throw badRequest("voucher_more_than_bill");
  if (gvs.length) promos.vouchers = gvs.map((g) => ({ id: g.row.id, code: g.row.code, amount: g.amount }));
  let pay;
  try { pay = settlePayments(dec(b.total).minus(gvTotal), input.payments); } catch (e) { posError(e); }
  if (dec(pay!.credit).gt(0)) {
    if (!input.customerAccountId) throw badRequest("customer_required_for_credit");
    const [cust] = await tx.select({ a: tables.accounts, key: tables.accountGroups.key }).from(tables.accounts)
      .innerJoin(tables.accountGroups, eq(tables.accountGroups.id, tables.accounts.groupId)).where(eq(tables.accounts.id, input.customerAccountId));
    if (!cust || cust.a.companyId !== company.id || cust.key !== "sundry_debtors") throw badRequest("not_a_customer");
  }
  const mismatch = input.deviceTotal && !dec(input.deviceTotal).eq(b.total) ? { deviceTotal: input.deviceTotal, serverTotal: b.total } : null;

  // Number: the terminal's series, or the one the device printed.
  let number: string;
  if (t.deviceId) {
    const fy = fiscalYearOf(date);
    if (!input.number!.startsWith(`${t.code}/${fy.short}/`)) throw badRequest("invalid_bill_number");
    number = input.number!;
    const [dup] = await tx.select({ id: tables.posBills.id }).from(tables.posBills).where(and(eq(tables.posBills.companyId, company.id), eq(tables.posBills.number, number)));
    if (dup) throw conflict("bill_number_taken");
  } else {
    number = await documentNumber(tx, actor, company, date, terminalSeries(t));
  }

  const acc = await accounts(tx, company);
  const [branch] = await tx.select().from(tables.branches).where(and(eq(tables.branches.companyId, company.id), eq(tables.branches.isHeadOffice, true)));
  const ut = !!findState(branch!.stateCode)?.ut;
  const vLines: { accountId: string; debit?: string; credit?: string }[] = [];
  for (const [mode, key] of [["cash", "cash"], ["upi", "upi_clearing"], ["card", "card_clearing"]] as const) {
    if (dec(pay![mode]).gt(0)) vLines.push({ accountId: acc[key]!, debit: pay![mode] });
  }
  if (dec(pay!.credit).gt(0)) vLines.push({ accountId: input.customerAccountId!, debit: pay!.credit });
  if (gvTotal.gt(0)) vLines.push({ accountId: acc.gift_vouchers!, debit: money(gvTotal) });
  vLines.push({ accountId: acc.sales!, credit: b.taxable });
  if (dec(b.cgst).gt(0)) vLines.push({ accountId: acc.output_cgst!, credit: b.cgst }, { accountId: acc[ut ? "output_utgst" : "output_sgst"]!, credit: b.sgst });
  if (dec(b.cess).gt(0)) vLines.push({ accountId: acc.output_cess!, credit: b.cess });
  const ro = dec(b.roundOff);
  if (!ro.isZero()) vLines.push(ro.gt(0) ? { accountId: acc.round_off!, credit: money(ro) } : { accountId: acc.round_off!, debit: money(ro.abs()) });
  const { voucher } = await postVoucher(tx, actor, { companyId: company.id, type: "sales", documentNumber: number, date, narration: `POS ${t.code}${input.customerName ? ` · ${input.customerName}` : ""}`, lines: vLines });

  const styleIds = [...new Set(lines.map((l) => l.it.styleId).filter((x): x is string => !!x))];
  const styleOf = new Map((member && styleIds.length ? await tx.select({ id: tables.styles.id, brand: tables.styles.brand, category: tables.styles.category }).from(tables.styles).where(inArray(tables.styles.id, styleIds)) : []).map((r) => [r.id, r]));
  const share = member ? loyaltyEarningShare(lines.map((l, i) => ({ amount: b.lines[i]!.total, discounted: dec(l.discount).gt(0), brand: styleOf.get(l.it.styleId ?? "")?.brand ?? null, category: styleOf.get(l.it.styleId ?? "")?.category ?? null })), { discountedBills: settings.loyaltyExcludeDiscountedBills && (dec(b.discount).gt(0) || lines.some((l) => dec(l.discount).gt(0)) || schemesApplied.length > 0), discountedItems: settings.loyaltyExcludeDiscountedItems, brands: settings.loyaltyExcludeBrands, categories: settings.loyaltyExcludeCategories }) : dec(1);
  const earned = member ? loyaltyEarned(dec(b.total).minus(pay!.credit).minus(gvTotal).times(share), rule) : 0;
  const [row] = await tx.insert(tables.posBills).values({
    ...(input.id ? { id: input.id } : {}), tenantId: actor.tenantId, companyId: company.id, terminalId: t.id, sessionId, number, date,
    customerPhone: input.customerPhone ?? null, customerName: input.customerName ?? null, customerAccountId: input.customerAccountId ?? null,
    pricesIncludeTax: settings.pricesIncludeTax, taxable: b.taxable, cgst: b.cgst, sgst: b.sgst, cess: b.cess, discount: b.discount,
    roundOff: b.roundOff, total: b.total, payments: input.payments.map((p) => ({ mode: p.mode, amount: money(p.amount), ...(p.reference ? { reference: p.reference } : {}) })),
    change: pay!.change, taxByRate: b.taxByRate, schemes: schemesApplied, promos, loyaltyEarned: earned, loyaltyRedeemed: redeem, voucherId: voucher.id,
    source: t.deviceId ? "device" : "web", billedAt: believableTime(input.billedAt), mismatch, overrides, returnId: exchange?.id ?? null, createdBy: actor.userId,
  }).returning();
  // Commission follows the offers that touched a line: on the price before the offer ("list"), or on nothing ("none"). The default is the price paid.
  const commissionAdj = (i: number) => {
    const taken = offers.byLine[i] ?? [];
    const basisOf = (id: string) => resolved.find((x) => x.id === id)?.commissionBasis ?? "net";
    const taxable = dec(b.lines[i]!.taxable);
    if (taken.some((x) => basisOf(x.schemeId) === "none")) return money(taxable.neg());
    const list = taken.filter((x) => basisOf(x.schemeId) === "list").reduce((t, x) => t.plus(x.discount), dec(0));
    const paidGross = dec(lines[i]!.price).times(lines[i]!.qty).minus(lines[i]!.discount);
    return list.gt(0) && paidGross.gt(0) ? money(list.times(taxable).div(paidGross)) : "0.00";
  };
  await tx.insert(tables.posBillLines).values(lines.map((l, i) => ({
    tenantId: actor.tenantId, billId: row!.id, lineNo: i + 1, itemId: l.it.id, name: l.it.name, hsn: l.it.hsn, qty: dec(l.qty).toFixed(4), price: money(l.price),
    gstRate: b.lines[i]!.gstRate, cessRate: l.cessRate, discount: b.lines[i]!.discount, taxable: b.lines[i]!.taxable, cgst: b.lines[i]!.cgst, sgst: b.lines[i]!.sgst, cess: b.lines[i]!.cess, total: b.lines[i]!.total,
    salesmanId: salesmen[i], helperId: helpers[i], commissionAdj: commissionAdj(i), serials: lines[i]!.serials,
  })));
  // Pieces tracked by serial leave stock by name: each must be in this store, and the count must match the quantity.
  for (const l of lines) if (l.serials?.length) await sellSerials(tx, { itemId: l.it.id, warehouseId: t.warehouseId, qty: l.qty, serials: l.serials, billId: row!.id, date });
  // Goods billed from an approval memo come back to the store first; the bill then sells them from there.
  if (input.memoId) {
    if (t.deviceId) throw badRequest("online_only");
    const byItem = new Map<string, ReturnType<typeof dec>>();
    for (const l of lines) if (l.it.kind === "goods") byItem.set(l.it.id, (byItem.get(l.it.id) ?? dec(0)).plus(l.qty));
    await billFromMemo(tx, actor, input.memoId, t.warehouseId, date, [...byItem].map(([itemId, qty]) => ({ itemId, qty: qty.toFixed(4) })));
  }
  const moves = await saleMoves(tx, company.id, lines.filter((l) => l.it.kind === "goods").map((l) => ({ itemId: l.it.id, qty: dec(l.qty).toFixed(4), warehouseId: t.warehouseId })), date);
  const { warnings } = await postMoves(tx, company, "pos_bill", row!.id, moves);
  if (gvs.length) await recordRedemptions(tx, actor.tenantId, row!.id, date, gvs);
  if (promos.coupon) await tx.update(tables.coupons).set({ used: sql`${tables.coupons.used} + 1` }).where(eq(tables.coupons.id, promos.coupon.id));
  if (member) {
    await tx.update(tables.loyaltyMembers).set({ points: member.points - redeem + earned, lifetimePoints: member.lifetimePoints + earned, ...(input.customerName && !member.name ? { name: input.customerName } : {}) })
      .where(eq(tables.loyaltyMembers.id, member.id));
    if (redeem > 0) await spendPoints(tx, member.id, redeem);
    await addLot(tx, { tenantId: actor.tenantId, memberId: member.id, billId: row!.id, points: earned, on: date, validityDays: settings.loyaltyValidityDays });
  }
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "pos_bill", entityId: row!.id, after: { number, total: b.total, ...(mismatch ? { mismatch } : {}), ...(overrides.length ? { overrides } : {}) }, ip: actor.ip });
  return {
    bill: row!, warnings: warnings.map((w) => ({ code: "negative_stock", detail: w.itemId })), replayed: false,
    exchange: exchange ? { returnId: exchange.id, number: exchange.number, credit: exchange.total, used: exchangeUsed, left: money(dec(exchange.total).minus(exchangeUsed)), voucherCode: exchange.voucherCode } : null,
  };
}

/** Voiding a bill (same day, before its shift is closed): reverses the voucher, stock and points. */
export async function voidBill(tx: Tx, actor: Actor, id: string, reason: string) {
  const [b] = await tx.select().from(tables.posBills).where(eq(tables.posBills.id, id)).for("update");
  if (!b) throw notFound();
  if (b.status === "void") throw conflict("already_cancelled");
  if (b.date !== today()) throw conflict("void_same_day_only");
  if (b.sessionId) {
    const [s] = await tx.select().from(tables.posSessions).where(eq(tables.posSessions.id, b.sessionId));
    if (s?.status !== "open") throw conflict("session_closed");
  }
  await assertGstr1Open(tx, b.companyId, b.date);
  if (b.voucherId) await cancelVoucher(tx, actor, b.voucherId, reason);
  await reverseMoves(tx, "pos_bill", id);
  await restoreBillSerials(tx, id);
  await undoPromos(tx, b);
  if (b.customerPhone && (b.loyaltyEarned || b.loyaltyRedeemed)) {
    await tx.update(tables.loyaltyMembers).set({
      points: sql`${tables.loyaltyMembers.points} - ${b.loyaltyEarned} + ${b.loyaltyRedeemed}`, lifetimePoints: sql`${tables.loyaltyMembers.lifetimePoints} - ${b.loyaltyEarned}`,
    }).where(and(eq(tables.loyaltyMembers.companyId, b.companyId), eq(tables.loyaltyMembers.phone, b.customerPhone)));
    const [m] = await tx.select({ id: tables.loyaltyMembers.id }).from(tables.loyaltyMembers).where(and(eq(tables.loyaltyMembers.companyId, b.companyId), eq(tables.loyaltyMembers.phone, b.customerPhone)));
    if (m) await reverseBill(tx, { tenantId: actor.tenantId, memberId: m.id, billId: id, earned: b.loyaltyEarned, redeemed: b.loyaltyRedeemed, on: today(), validityDays: (await posSettings(tx, b.companyId)).loyaltyValidityDays });
  }
  await tx.update(tables.posBills).set({ status: "void", voidReason: reason }).where(eq(tables.posBills.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "pos_bill", entityId: id, after: { reason }, ip: actor.ip });
}

export async function listBills(tx: Tx, q: { date?: string | undefined; terminalId?: string | undefined; sessionId?: string | undefined }, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  return tx.select().from(tables.posBills).where(and(
    eq(tables.posBills.companyId, company.id), q.date ? eq(tables.posBills.date, q.date) : undefined,
    q.terminalId ? eq(tables.posBills.terminalId, q.terminalId) : undefined, q.sessionId ? eq(tables.posBills.sessionId, q.sessionId) : undefined,
  )).orderBy(desc(tables.posBills.createdAt)).limit(500);
}

export async function getBill(tx: Tx, id: string) {
  const [b] = await tx.select().from(tables.posBills).where(eq(tables.posBills.id, id));
  if (!b) throw notFound();
  const rawLines = await tx.select({ line: tables.posBillLines, uom: tables.uoms.code, mrp: tables.items.mrp, size: tables.items.size, colour: tables.items.color, model: tables.styles.code }).from(tables.posBillLines)
    .innerJoin(tables.items, eq(tables.items.id, tables.posBillLines.itemId)).innerJoin(tables.uoms, eq(tables.uoms.id, tables.items.uomId)).leftJoin(tables.styles, eq(tables.styles.id, tables.items.styleId))
    .where(eq(tables.posBillLines.billId, id)).orderBy(asc(tables.posBillLines.lineNo));
  const lines = rawLines.map((r) => ({ ...r.line, uom: r.uom, mrp: r.mrp, size: r.size, colour: r.colour, model: r.model }));
  const company = await resolveCompany(tx, b.companyId);
  const [branch] = await tx.select().from(tables.branches).where(and(eq(tables.branches.companyId, company.id), eq(tables.branches.isHeadOffice, true)));
  const [terminal] = await tx.select().from(tables.posTerminals).where(eq(tables.posTerminals.id, b.terminalId));
  const settings = await posSettings(tx, company.id);
  const [ret] = b.returnId ? await tx.select().from(tables.posReturns).where(eq(tables.posReturns.id, b.returnId)) : [];
  const [credit] = ret?.giftVoucherId ? await tx.select({ code: tables.giftVouchers.code, balance: tables.giftVouchers.balance }).from(tables.giftVouchers).where(eq(tables.giftVouchers.id, ret.giftVoucherId)) : [];
  const [original] = ret ? await tx.select({ number: tables.posBills.number }).from(tables.posBills).where(eq(tables.posBills.id, ret.billId)) : [];
  const member = b.customerPhone ? (await tx.select().from(tables.loyaltyMembers).where(and(eq(tables.loyaltyMembers.companyId, company.id), eq(tables.loyaltyMembers.phone, b.customerPhone))))[0] : undefined;
  return {
    ...b, lines, terminal: terminal ? { code: terminal.code, name: terminal.name } : null, footer: settings.receiptFooter,
    company: { name: company.legalName ?? company.name }, branch: branch ? { gstin: branch.gstin, address: branch.address, stateCode: branch.stateCode } : null,
    loyaltyBalance: member?.points ?? null,
    exchange: ret ? {
      number: ret.number, against: original?.number ?? null, total: ret.total,
      lines: ret.lines.map((l) => ({ name: l.name, qty: l.qty, total: l.total, reason: l.reason })),
      creditCode: credit && dec(credit.balance).gt(0) ? credit.code : null, creditLeft: credit?.balance ?? "0.00",
    } : null,
  };
}

export async function loyaltyMember(tx: Tx, phone: string, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const [m] = await tx.select().from(tables.loyaltyMembers).where(and(eq(tables.loyaltyMembers.companyId, company.id), eq(tables.loyaltyMembers.phone, phone)));
  if (!m) return null;
  // Points that have lapsed are not the member's to spend, even before they are taken off the balance.
  return { ...m, points: Math.max(m.points - await lapsedNotRemoved(tx, m.id, today()), 0) };
}

/** A day's sales at the counters: bills, takings by mode, tax by rate and the best sellers. */
export async function dailySummary(tx: Tx, date: string, terminalId?: string, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const bills = await tx.select().from(tables.posBills).where(and(eq(tables.posBills.companyId, company.id), eq(tables.posBills.date, date), terminalId ? eq(tables.posBills.terminalId, terminalId) : undefined));
  const paid = bills.filter((b) => b.status === "paid");
  const rets = await tx.select({ mode: tables.posReturns.refundMode, total: tables.posReturns.total }).from(tables.posReturns)
    .where(and(eq(tables.posReturns.companyId, company.id), eq(tables.posReturns.date, date), terminalId ? eq(tables.posReturns.terminalId, terminalId) : undefined));
  const refunded = (m: string) => rets.filter((r) => r.mode === m).reduce((s, r) => s.plus(r.total), dec(0));
  const byMode = (m: string) => money(paid.reduce((s, b) => s.plus(b.payments.filter((p) => p.mode === m).reduce((t, p) => t.plus(p.amount), dec(0))), dec(0))
    .minus(m === "cash" ? paid.reduce((s, b) => s.plus(b.change), dec(0)) : 0).minus(refunded(m)));
  const rates = new Map<string, { taxable: ReturnType<typeof dec>; tax: ReturnType<typeof dec> }>();
  for (const b of paid) for (const r of b.taxByRate) {
    const cur = rates.get(r.rate) ?? { taxable: dec(0), tax: dec(0) };
    rates.set(r.rate, { taxable: cur.taxable.plus(r.taxable), tax: cur.tax.plus(r.cgst).plus(r.sgst).plus(r.cess) });
  }
  const top = paid.length ? await tx.execute<{ name: string; qty: string; amount: string }>(sql`
    select l.name, sum(l.qty)::text as qty, sum(l.total)::text as amount from pos_bill_lines l
    where l.bill_id in (${sql.join(paid.map((b) => sql`${b.id}::uuid`), sql`, `)}) group by l.name order by sum(l.total) desc limit 10`) : [];
  return {
    date, bills: paid.length, voided: bills.length - paid.length, total: money(paid.reduce((s, b) => s.plus(b.total), dec(0))),
    discount: money(paid.reduce((s, b) => s.plus(b.discount), dec(0))), returns: money(rets.reduce((s, r) => s.plus(r.total), dec(0))),
    cash: byMode("cash"), upi: byMode("upi"), card: byMode("card"), credit: byMode("credit"),
    taxByRate: [...rates.entries()].sort((a, b) => Number(a[0]) - Number(b[0])).map(([rate, v]) => ({ rate, taxable: money(v.taxable), tax: money(v.tax) })),
    topItems: [...top].map((t) => ({ name: t.name, qty: dec(t.qty).toString(), amount: money(t.amount) })),
  };
}

// ---- Returns and exchanges at the counter --------------------------------------------------------

export const RETURN_REASONS = ["size", "colour", "defect", "damaged", "not_liked", "other"] as const;
export const RETURN_GRADES = ["A", "B", "C"] as const;
export const returnSeries = (t: Pick<Terminal, "code">) => ({ docType: `pos_return_${t.code}`, name: `POS returns ${t.code}`, pattern: `${t.code}R/{FY}/{SEQ:5}` });
const DAMAGED_STORE = "Damaged and seconds";

export interface ReturnInput {
  billId: string; terminalId: string;
  lines: { lineId: string; qty: string; reason: (typeof RETURN_REASONS)[number]; grade: (typeof RETURN_GRADES)[number]; serials?: string[] | undefined }[];
  /** voucher: store credit as a gift voucher, which then pays for the exchange. */
  refundMode: "cash" | "upi" | "card" | "voucher";
}

async function damagedStore(tx: Tx, company: Company) {
  const [w] = await tx.select().from(tables.warehouses).where(and(eq(tables.warehouses.companyId, company.id), sql`lower(${tables.warehouses.name}) = ${DAMAGED_STORE.toLowerCase()}`));
  if (w) return w.id;
  const [n] = await tx.insert(tables.warehouses).values({ tenantId: company.tenantId, companyId: company.id, name: DAMAGED_STORE }).returning();
  return n!.id;
}

/**
 * Goods back against a bill: a B2C credit note at the bill's own prices and tax (a share of each line),
 * refunded to the nearest rupee in cash, UPI or card, or as store credit. Condition A goes back to the
 * counter's store at the cost it left at; B and C go to the damaged and seconds store.
 */
export async function createPosReturn(tx: Tx, actor: Actor, input: ReturnInput) {
  const [bill] = await tx.select().from(tables.posBills).where(eq(tables.posBills.id, input.billId)).for("update");
  if (!bill) throw notFound();
  if (bill.status !== "paid") throw conflict("bill_void");
  const t = await loadTerminal(tx, input.terminalId);
  if (t.companyId !== bill.companyId) throw badRequest("unknown_terminal");
  if (t.deviceId) throw badRequest("online_only");
  const [session] = await tx.select().from(tables.posSessions).where(and(eq(tables.posSessions.terminalId, t.id), eq(tables.posSessions.status, "open")));
  if (!session) throw conflict("session_not_open");
  const company = await resolveCompany(tx, bill.companyId);
  const date = today();
  await assertGstr1Open(tx, company.id, date);
  assertPeriodOpen(await fiscalYearForDate(tx, actor.tenantId, company, date), date);

  const billLines = await tx.select().from(tables.posBillLines).where(eq(tables.posBillLines.billId, bill.id)).for("update");
  const back = input.lines.filter((l) => dec(l.qty).gt(0));
  if (!back.length) throw badRequest("no_lines");
  if (new Set(back.map((l) => l.lineId)).size !== back.length) throw badRequest("duplicate_line");
  const its = await tx.select().from(tables.items).where(inArray(tables.items.id, [...new Set(billLines.map((l) => l.itemId))]));
  const picked = back.map((r) => {
    const l = billLines.find((x) => x.id === r.lineId);
    if (!l) throw badRequest("unknown_bill_line");
    if (dec(r.qty).gt(dec(l.qty).minus(l.returnedQty))) throw badRequest("over_return");
    // Goods bought on an offer marked "no returns" cannot be returned for credit.
    if (dec(l.discount).gt(0) && bill.schemes.some((x) => x.noReturns)) throw badRequest("offer_no_return");
    return { r, l };
  });
  // The returned share of what each line was charged (its discounts and the bill's spread into it).
  const credit = returnCredit(picked.map(({ r, l }) => ({ line: l, qty: r.qty })));
  const lines = picked.map(({ r, l }, i) => ({
    line: l, item: its.find((x) => x.id === l.itemId)!, grade: r.grade,
    row: { billLineId: l.id, itemId: l.itemId, name: l.name, hsn: l.hsn, qty: dec(r.qty).toFixed(4), gstRate: l.gstRate, reason: r.reason, grade: r.grade, ...credit.parts[i]! },
  }));
  const sum = (k: "taxable" | "cgst" | "sgst" | "cess") => dec(credit[k]);
  const refund = dec(credit.refund);
  const roundOff = dec(credit.roundOff);

  const number = await documentNumber(tx, actor, company, date, returnSeries(t));
  const acc = await accounts(tx, company);
  const [branch] = await tx.select().from(tables.branches).where(and(eq(tables.branches.companyId, company.id), eq(tables.branches.isHeadOffice, true)));
  const ut = !!findState(branch!.stateCode)?.ut;
  const refundAcc = { cash: acc.cash!, upi: acc.upi_clearing!, card: acc.card_clearing!, voucher: acc.gift_vouchers! }[input.refundMode];
  const vLines: { accountId: string; debit?: string; credit?: string }[] = [{ accountId: acc.sales_returns!, debit: money(sum("taxable")) }];
  if (sum("cgst").gt(0)) vLines.push({ accountId: acc.output_cgst!, debit: money(sum("cgst")) }, { accountId: acc[ut ? "output_utgst" : "output_sgst"]!, debit: money(sum("sgst")) });
  if (sum("cess").gt(0)) vLines.push({ accountId: acc.output_cess!, debit: money(sum("cess")) });
  if (!roundOff.isZero()) vLines.push(roundOff.gt(0) ? { accountId: acc.round_off!, debit: money(roundOff) } : { accountId: acc.round_off!, credit: money(roundOff.abs()) });
  vLines.push({ accountId: refundAcc, credit: money(refund) });
  const { voucher } = await postVoucher(tx, actor, { companyId: company.id, type: "credit_note", documentNumber: number, date, narration: `Return against ${bill.number}`, lines: vLines });

  let giftVoucherId: string | null = null;
  let voucherCode: string | null = null;
  if (input.refundMode === "voucher") {
    voucherCode = await newVoucherCode(tx, company.id);
    const expires = new Date(`${date}T00:00:00Z`);
    expires.setUTCFullYear(expires.getUTCFullYear() + 1);
    const [gv] = await tx.insert(tables.giftVouchers).values({
      tenantId: actor.tenantId, companyId: company.id, code: voucherCode, value: money(refund), balance: money(refund), issuedOn: date, expiresOn: expires.toISOString().slice(0, 10),
      paidBy: "return", customerPhone: bill.customerPhone, customerName: bill.customerName, voucherId: voucher.id, createdBy: actor.userId,
    }).returning();
    giftVoucherId = gv!.id;
  }
  const [ret] = await tx.insert(tables.posReturns).values({
    tenantId: actor.tenantId, companyId: company.id, terminalId: t.id, sessionId: session.id, billId: bill.id, number, date, lines: lines.map((l) => l.row),
    taxable: money(sum("taxable")), cgst: money(sum("cgst")), sgst: money(sum("sgst")), cess: money(sum("cess")), roundOff: money(roundOff), total: money(refund),
    refundMode: input.refundMode, giftVoucherId, voucherId: voucher.id, createdBy: actor.userId,
  }).returning();

  // Stock back: good pieces to the counter's store, the rest to the damaged and seconds store, at the cost they left at.
  const damaged = lines.some((l) => l.grade !== "A" && l.item.kind === "goods") ? await damagedStore(tx, company) : null;
  const moves = await explodePacks(tx, lines.filter((l) => l.item.kind === "goods")
    .map((l): Move => ({ itemId: l.item.id, warehouseId: l.grade === "A" ? t.warehouseId : damaged!, date, qtyIn: l.row.qty })));
  for (const m of moves) {
    const [out] = await tx.select({ rate: tables.stockLedger.rate }).from(tables.stockLedger)
      .where(and(eq(tables.stockLedger.sourceType, "pos_bill"), eq(tables.stockLedger.sourceId, bill.id), eq(tables.stockLedger.itemId, m.itemId))).limit(1);
    m.rate = out?.rate ?? (await currentRate(tx, company, m.itemId, t.warehouseId, date));
  }
  await postMoves(tx, company, "pos_return", ret!.id, moves);
  for (const { r, l } of picked) {
    const item = its.find((x) => x.id === l.itemId)!;
    if (item.trackSerials) await returnSerials(tx, { billId: bill.id, itemId: item.id, qty: r.qty, named: r.serials, warehouseId: r.grade === "A" ? t.warehouseId : damaged! });
  }
  for (const l of lines) await tx.update(tables.posBillLines).set({ returnedQty: sql`${tables.posBillLines.returnedQty} + ${l.row.qty}` }).where(eq(tables.posBillLines.id, l.line.id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "pos_return", entityId: ret!.id, after: { number, bill: bill.number, total: ret!.total, refundMode: input.refundMode }, ip: actor.ip });
  return { ...ret!, voucherCode };
}

/** A bill by its printed number, with how much of each line can still come back. */
export async function billByNumber(tx: Tx, number: string, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const [b] = await tx.select({ id: tables.posBills.id }).from(tables.posBills).where(and(eq(tables.posBills.companyId, company.id), sql`upper(${tables.posBills.number}) = ${number.trim().toUpperCase()}`));
  if (!b) throw notFound();
  return getBill(tx, b.id);
}

/** Returns over a period, with counts by reason and condition. */
export async function listReturns(tx: Tx, q: { from: string; to: string }, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const rows = await tx.select({ r: tables.posReturns, bill: tables.posBills.number }).from(tables.posReturns)
    .innerJoin(tables.posBills, eq(tables.posBills.id, tables.posReturns.billId))
    .where(and(eq(tables.posReturns.companyId, company.id), gte(tables.posReturns.date, q.from), sql`${tables.posReturns.date} <= ${q.to}::date`))
    .orderBy(desc(tables.posReturns.createdAt));
  const tally = (k: "reason" | "grade") => {
    const m = new Map<string, { qty: Dec; value: Dec }>();
    for (const { r } of rows) for (const l of r.lines) {
      const cur = m.get(l[k]) ?? { qty: dec(0), value: dec(0) };
      m.set(l[k], { qty: cur.qty.plus(l.qty), value: cur.value.plus(l.total) });
    }
    return [...m.entries()].map(([key, v]) => ({ key, qty: v.qty.toString(), value: money(v.value) })).sort((a, b) => Number(b.value) - Number(a.value));
  };
  return {
    from: q.from, to: q.to, total: money(rows.reduce((s, x) => s.plus(x.r.total), dec(0))),
    byReason: tally("reason"), byGrade: tally("grade"),
    returns: rows.map((x) => ({ ...x.r, billNumber: x.bill })),
  };
}

// ---- held bills, salesmen and customer history at the counter ---------------------------------------------

export interface HeldInput {
  terminalId: string; label?: string | undefined; customerPhone?: string | undefined; customerName?: string | undefined;
  lines: { itemId: string; qty: string; price?: string | undefined; discount?: string | undefined; salesmanId?: string | undefined }[];
}

/** Parks a bill while the customer keeps choosing; any counter of the business can pick it up. */
export async function holdBill(tx: Tx, actor: Actor, input: HeldInput) {
  const t = await loadTerminal(tx, input.terminalId);
  if (!input.lines.length) throw badRequest("no_lines");
  const its = await tx.select({ id: tables.items.id, companyId: tables.items.companyId }).from(tables.items).where(inArray(tables.items.id, [...new Set(input.lines.map((l) => l.itemId))]));
  if (its.length !== new Set(input.lines.map((l) => l.itemId)).size || its.some((i) => i.companyId !== t.companyId)) throw badRequest("unknown_item");
  const lines = input.lines.map((l) => ({ itemId: l.itemId, qty: l.qty, ...(l.price ? { price: l.price } : {}), ...(l.discount ? { discount: l.discount } : {}), ...(l.salesmanId ? { salesmanId: l.salesmanId } : {}) }));
  const [row] = await tx.insert(tables.posHeldBills).values({
    tenantId: actor.tenantId, companyId: t.companyId, terminalId: t.id, label: input.label?.trim() || null,
    customerPhone: input.customerPhone ?? null, customerName: input.customerName ?? null, lines, createdBy: actor.userId,
  }).returning();
  return row!;
}

export async function listHeld(tx: Tx) {
  const company = await resolveCompany(tx);
  const rows = await tx.select({ h: tables.posHeldBills, code: tables.posTerminals.code }).from(tables.posHeldBills)
    .innerJoin(tables.posTerminals, eq(tables.posTerminals.id, tables.posHeldBills.terminalId))
    .where(eq(tables.posHeldBills.companyId, company.id)).orderBy(asc(tables.posHeldBills.createdAt));
  return rows.map(({ h, code }) => ({ ...h, terminal: code, pieces: h.lines.reduce((n, l) => n + Number(l.qty), 0) }));
}

/** Takes a held bill back to the counter (it is removed from the held list). */
export async function resumeHeld(tx: Tx, id: string) {
  const company = await resolveCompany(tx);
  const [h] = await tx.select().from(tables.posHeldBills).where(eq(tables.posHeldBills.id, id)).for("update");
  if (!h || h.companyId !== company.id) throw notFound("held_bill_gone");
  await tx.delete(tables.posHeldBills).where(eq(tables.posHeldBills.id, id));
  return h;
}

/** Staff who can be named as the salesman on a counter bill. */
export async function counterSalesmen(tx: Tx) {
  const company = await resolveCompany(tx);
  return tx.select({ id: tables.employees.id, code: tables.employees.code, name: tables.employees.name, department: tables.employees.department })
    .from(tables.employees).where(and(eq(tables.employees.companyId, company.id), eq(tables.employees.status, "active"))).orderBy(asc(tables.employees.name));
}

/** What the counter shows when a customer's mobile is entered: visits, spend net of returns, what they buy, last bills. */
export async function customerHistory(tx: Tx, phone: string) {
  const company = await resolveCompany(tx);
  const bills = await tx.select({ id: tables.posBills.id, number: tables.posBills.number, date: tables.posBills.date, total: tables.posBills.total, name: tables.posBills.customerName })
    .from(tables.posBills).where(and(eq(tables.posBills.companyId, company.id), eq(tables.posBills.customerPhone, phone), eq(tables.posBills.status, "paid")))
    .orderBy(desc(tables.posBills.date), desc(tables.posBills.createdAt));
  const member = await loyaltyMember(tx, phone, company.id);
  if (!bills.length) return { phone, name: member?.name ?? null, points: member?.points ?? 0, visits: 0, spent: "0.00", returned: "0.00", lastVisit: null, top: [], recent: [] };
  const ids = bills.map((b) => b.id);
  const [ret] = await tx.select({ total: sql<string>`coalesce(sum(${tables.posReturns.total}), 0)::text` }).from(tables.posReturns).where(inArray(tables.posReturns.billId, ids));
  const top = await tx.select({ name: tables.posBillLines.name, qty: sql<string>`sum(${tables.posBillLines.qty} - ${tables.posBillLines.returnedQty})::text` })
    .from(tables.posBillLines).where(inArray(tables.posBillLines.billId, ids)).groupBy(tables.posBillLines.name)
    .orderBy(desc(sql`sum(${tables.posBillLines.qty} - ${tables.posBillLines.returnedQty})`)).limit(5);
  const spent = bills.reduce((v, b) => v.plus(b.total), dec(0));
  return {
    phone, name: member?.name ?? bills.find((b) => b.name)?.name ?? null, points: member?.points ?? 0,
    visits: bills.length, spent: money(spent), returned: money(ret?.total ?? 0), lastVisit: bills[0]!.date,
    top: top.filter((x) => Number(x.qty) > 0).map((x) => ({ name: x.name, qty: dec(x.qty).toString() })),
    recent: bills.slice(0, 5).map(({ id, number, date, total }) => ({ id, number, date, total })),
  };
}
