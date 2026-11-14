"use client";

import { Banknote, ChevronDown, CreditCard, LayoutGrid, Lock, Plus, QrCode, ScanLine, Trash2, User } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { applySchemes, businessTime, schemesAllowed, loyaltyRedeemable, posBill, promoDiscounts, settlePayments, type CouponRule, type PayMode, type Scheme } from "@varchasv/domain";
import { ApiError, api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { localName, rupees, todayIso } from "@/lib/format";
import type { Exchange } from "./Exchange";
import { Alert, Button, Field, Input, Select } from "../ui";

export const POS_NS = ["pos.errors", "pos.promo.errors", "pos.counter.errors", "sales.errors", "items.errors", "serials.errors", "memos.errors"];

export interface PosItem {
  id: string; name: string; nameHi: string | null; kind: "goods" | "service"; archived: boolean; uom: string;
  saleRate: string; gstRate: string; cessRate: string; barcode: string | null; sku: string | null; gstSlab?: string | null; slabPieces?: number; trackSerials?: boolean;
  styleId?: string | null; color?: string | null; size?: string | null; aliases?: string[]; defaultQty?: string | null; shortCode?: string | null;
}
export interface PosSettings {
  pricesIncludeTax: boolean;
  loyaltyEnabled: boolean; loyaltySlabs?: { from: string; per100: number }[] | null; loyaltyMinRedeem?: number; loyaltyValidityDays?: number | null; helperSharePct?: string; loyaltyExcludeDiscountedBills?: boolean; loyaltyExcludeDiscountedItems?: boolean; loyaltyExcludeBrands?: string[] | null; loyaltyExcludeCategories?: string[] | null; loyaltyPointsPer100: number; loyaltyPointValue: string; loyaltyMaxRedeemPct: string; receiptFooter: string | null; referralPoints?: number;
  /** Switched-on store schemes, resolved to item ids (the server applies the same ones). */
  schemes?: Scheme[];
  allowRateChange?: boolean; maxLineDiscountPct?: string | null; maxBillDiscountPct?: string | null; requireSalesman?: boolean; autoSendBill?: boolean;
}
/** A cart line: the item, quantity, and optionally a changed rate, a line discount and who sold it. */
export interface CartLine { itemId: string; qty: string; price?: string | undefined; discount?: string | undefined; salesmanId?: string | undefined; /** Serial numbers of the pieces, one per piece, for items tracked by serial. */ serials?: string | undefined }
export interface Bill {
  id: string; number: string; total: string; change: string; loyaltyEarned: number; customerPhone?: string | null; autoSent?: string | null;
  exchange?: { number: string; credit: string; used: string; left: string; voucherCode: string | null } | null;
}
export type Salesman = { id: string; code: string; name: string };
type Customer = { id: string; name: string; nameHi: string | null };
type History = { name: string | null; points: number; visits: number; spent: string; returned: string; lastVisit: string | null; top: { name: string; qty: string }[]; recent: { id: string; number: string; date: string; total: string }[] };

/**
 * The scan line: an exact barcode or SKU adds on Enter, else the first name match. Typing shows the
 * matches under the box; the full item grid is a fold-out for touch counters.
 */
export function ItemSearch({ items, onAdd, children }: { items: PosItem[]; onAdd: (id: string) => void; children?: React.ReactNode }) {
  const t = useTranslations();
  const locale = useLocale();
  const [q, setQ] = useState("");
  const [browse, setBrowse] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const active = items.filter((i) => !i.archived);
  const s = q.trim().toLowerCase();
  const matches = s ? active.filter((i) => i.name.toLowerCase().includes(s) || (i.nameHi ?? "").includes(s) || i.barcode === s || (i.aliases ?? []).includes(s) || (i.sku ?? "").toLowerCase() === s || (i.shortCode ?? "").toLowerCase() === s) : active;
  const add = (id: string) => { onAdd(id); setQ(""); ref.current?.focus(); };
  useEffect(() => { try { setBrowse(localStorage.getItem("varchasv.pos.browse") === "1"); } catch { /* storage unavailable */ } }, []);
  const toggleBrowse = () => setBrowse((b) => { try { localStorage.setItem("varchasv.pos.browse", b ? "0" : "1"); } catch { /* storage unavailable */ } return !b; });
  const tile = (i: PosItem) => (
    <button key={i.id} type="button" onClick={() => add(i.id)} className="flex min-h-14 flex-col items-start justify-between rounded-md border border-border bg-surface p-2 text-left text-[0.9286rem] hover:border-primary hover:bg-primary-soft">
      <span className="line-clamp-2 font-medium">{localName(i, locale)}</span>
      <span className="num text-muted">{rupees(i.saleRate)}</span>
    </button>
  );
  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <ScanLine className="pointer-events-none absolute top-1/2 left-3 size-[1.1rem] -translate-y-1/2 text-primary" aria-hidden />
        <Input ref={ref} id="pos-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("pos.billing.search")} aria-label={t("pos.billing.search")} className="h-11 pr-14 pl-10 text-[1rem]" autoFocus autoComplete="off"
          onKeyDown={(e) => {
            if (e.key === "Escape") { setQ(""); return; }
            if (e.key !== "Enter") return;
            e.preventDefault();
            const exact = active.find((i) => i.barcode === q.trim() || (i.aliases ?? []).includes(q.trim()) || (i.sku && i.sku.toLowerCase() === s) || (i.shortCode && i.shortCode.toLowerCase() === s));
            const hit = exact ?? matches[0];
            if (hit) add(hit.id);
          }} />
        <kbd className="absolute top-1/2 right-3 -translate-y-1/2">F2</kbd>
        {s ? (
          <div className="absolute inset-x-0 top-full z-20 mt-1 max-h-80 overflow-y-auto rounded-lg border border-border-strong bg-surface p-1.5 shadow-card">
            {matches.length ? <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">{matches.slice(0, 30).map(tile)}</div> : <p className="px-2 py-3 text-sm text-muted">{t("launcher.noMatch")}</p>}
          </div>
        ) : null}
      </div>
      {children}
      <div className="rounded-lg border border-border">
        <button type="button" onClick={toggleBrowse} aria-expanded={browse} className="flex w-full items-center justify-between px-3 py-2 text-left text-[0.9286rem] font-semibold hover:bg-surface-3">
          <span className="flex items-center gap-2"><LayoutGrid className="size-4 text-muted" aria-hidden />{t("pos.counter.browse")}</span>
          <ChevronDown className={`size-4 text-muted transition-transform ${browse ? "" : "-rotate-90"}`} aria-hidden />
        </button>
        {browse ? <div className="grid max-h-[40vh] grid-cols-2 gap-1.5 overflow-y-auto border-t border-border p-2 sm:grid-cols-3 2xl:grid-cols-4">{active.slice(0, 120).map(tile)}</div> : null}
      </div>
    </div>
  );
}

/** On a phone each bill line is a card: the item on its own line, then quantity (big plus and minus), amount, rate and discount, each under its label. */
const M = "max-lg:block max-lg:p-0 max-lg:before:mb-1 max-lg:before:block max-lg:before:text-xs max-lg:before:text-muted max-lg:before:content-[attr(data-label)]";

/** The bill grid: one dense row per line with quantity, rate (locked unless allowed), discount and who sold it. */
export function CartTable({ lines, items, onChange, salesmen, rateEditable }: {
  lines: CartLine[]; items: PosItem[]; onChange: (l: CartLine[]) => void; salesmen: Salesman[]; rateEditable: boolean;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const set = (i: number, patch: Partial<CartLine>) => onChange(lines.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  if (!lines.length) return <p className="py-10 text-center text-sm text-muted">{t("pos.billing.empty")}</p>;
  const pieces = lines.reduce((n, l) => n + Number(l.qty || 0), 0);
  const gross = lines.reduce((n, l) => n + Number(l.qty || 0) * Number(l.price ?? items.find((x) => x.id === l.itemId)?.saleRate ?? 0), 0);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[0.9286rem] max-lg:block lg:min-w-[640px]">
        <thead className="max-lg:hidden">
          <tr className="border-b border-border-strong text-left">
            <th className="w-7 px-2 py-1.5">#</th>
            <th className="px-2 py-1.5">{t("pos.counter.item")}</th>
            <th className="w-28 px-2 py-1.5 text-center">{t("pos.billing.qty")}</th>
            <th className="w-24 px-2 py-1.5 text-right">{t("pos.counter.rate")}</th>
            <th className="w-20 px-2 py-1.5 text-right">{t("pos.counter.disc")}</th>
            <th className="w-32 px-2 py-1.5">{t("pos.counter.salesman")}</th>
            <th className="w-24 px-2 py-1.5 text-right">{t("pos.billing.amount")}</th>
            <th className="w-8" />
          </tr>
        </thead>
        <tbody className="max-lg:block">
          {lines.map((l, i) => {
            const it = items.find((x) => x.id === l.itemId);
            const rate = Number(l.price ?? it?.saleRate ?? 0);
            const amount = Number(l.qty || 0) * rate - Number(l.discount || 0);
            return (
              <tr key={`${l.itemId}-${i}`} className="border-b border-rule align-middle max-lg:grid max-lg:grid-cols-2 max-lg:gap-x-3 max-lg:gap-y-2 max-lg:p-3">
                <td className="num px-2 py-1.5 text-muted max-lg:hidden">{String(i + 1).padStart(2, "0")}</td>
                <td className="px-2 py-1.5 max-lg:col-span-2 max-lg:p-0">
                  <span className="block truncate font-semibold">{it ? localName(it, locale) : ""}</span>
                  <span className="flex flex-wrap items-center gap-1.5 text-[0.8571rem] text-muted">
                    {it?.barcode ? <span className="num">{it.barcode}</span> : null}
                    {it?.trackSerials ? <Input value={l.serials ?? ""} onChange={(e) => set(i, { serials: e.target.value || undefined })} placeholder={t("pos.counter.serials")} aria-label={t("pos.counter.serials")} className="num h-6 w-56 text-[0.8571rem]" /> : null}
                    {it?.color || it?.size ? <span className="rounded-[3px] border border-border bg-surface-3 px-1 font-semibold text-text">{[it.color, it.size].filter(Boolean).join(" · ")}</span> : null}
                    <span className="num">{Number(it?.gstRate ?? 0)}%</span>
                  </span>
                </td>
                <td data-label={t("pos.billing.qty")} className={`px-2 py-1.5 max-lg:order-1 ${M}`}>
                  <div className="flex items-center justify-center max-lg:justify-start">
                    <button type="button" className="grid size-7 place-items-center rounded-l-md border border-border hover:bg-surface-2 max-lg:size-11" onClick={() => (Number(l.qty) <= 1 ? onChange(lines.filter((_, j) => j !== i)) : set(i, { qty: String(Number(l.qty) - 1) }))} aria-label="−">−</button>
                    <Input value={l.qty} onChange={(e) => set(i, { qty: e.target.value })} inputMode="decimal" className="num h-7 w-11 rounded-none border-x-0 px-1 text-center max-lg:h-11 max-lg:w-14" aria-label={t("pos.billing.qty")} />
                    <button type="button" className="grid size-7 place-items-center rounded-r-md border border-border hover:bg-surface-2 max-lg:size-11" onClick={() => set(i, { qty: String(Number(l.qty) + 1) })} aria-label="+">+</button>
                  </div>
                </td>
                <td data-label={t("pos.counter.rate")} className={`px-2 py-1.5 max-lg:order-3 ${M}`}>
                  <div className="relative">
                    <Input value={l.price ?? ""} onChange={(e) => set(i, { price: e.target.value || undefined })} placeholder={String(Number(it?.saleRate ?? 0))} inputMode="decimal" className="num h-7 pr-6 text-right max-lg:h-11" aria-label={t("pos.counter.rate")} disabled={!rateEditable} />
                    {!rateEditable ? <Lock className="pointer-events-none absolute top-1.5 right-1.5 size-3.5 text-muted" aria-label={t("pos.counter.rateLocked")} /> : null}
                  </div>
                </td>
                <td data-label={t("pos.counter.disc")} className={`px-2 py-1.5 max-lg:order-4 ${M}`}><Input value={l.discount ?? ""} onChange={(e) => set(i, { discount: e.target.value || undefined })} placeholder="0" inputMode="decimal" className="num h-7 text-right max-lg:h-11" aria-label={t("pos.counter.lineDiscount")} /></td>
                <td data-label={t("pos.counter.salesman")} className={`px-2 py-1.5 max-lg:order-5 max-lg:col-span-2 ${M}`}>
                  <Select value={l.salesmanId ?? ""} onChange={(e) => set(i, { salesmanId: e.target.value || undefined })} className="h-7 px-1.5 text-[0.8571rem] max-lg:h-11 max-lg:text-[1rem]" aria-label={t("pos.counter.salesman")}>
                    <option value="">{t("pos.counter.noSalesman")}</option>
                    {salesmen.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </Select>
                </td>
                <td data-label={t("pos.billing.amount")} className={`num px-2 py-1.5 text-right font-semibold max-lg:order-2 max-lg:text-right max-lg:text-[1.15rem] ${M}`}>{rupees(amount)}</td>
                <td className="px-1 py-1.5 max-lg:order-last max-lg:col-span-2 max-lg:flex max-lg:justify-end max-lg:p-0"><button type="button" onClick={() => onChange(lines.filter((_, j) => j !== i))} className="rounded-md p-1 text-muted hover:text-danger max-lg:grid max-lg:size-11 max-lg:place-items-center" title={t("common.remove")}><Trash2 className="size-4" aria-hidden /></button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="flex flex-wrap gap-x-5 border-t border-border bg-surface-3 px-2 py-1.5 text-[0.8571rem] text-muted">
        <span>{t("pos.counter.piecesInBill", { n: pieces })}</span>
        <span>{t("pos.counter.grossAtRate", { v: rupees(gross.toFixed(2)) })}</span>
      </p>
    </div>
  );
}

/** Adds an item to the cart: one piece, or the item's default quantity (a pack of six sold as six) each time. */
export const addToCart = (lines: CartLine[], itemId: string, salesmanId?: string, by = 1) => {
  const i = lines.findIndex((l) => l.itemId === itemId && !l.price && !l.discount && (l.salesmanId ?? "") === (salesmanId ?? ""));
  return i >= 0 ? lines.map((l, j) => (j === i ? { ...l, qty: String(Number(l.qty) + by) } : l)) : [...lines, { itemId, qty: String(by), ...(salesmanId ? { salesmanId } : {}) }];
};

/** Which counter limits a cart breaks (the server checks the same; an approver can let it through with a reason). */
export function limitsBroken(lines: CartLine[], items: PosItem[], billDiscount: string, s: PosSettings) {
  const out: ("rate" | "line_discount" | "bill_discount")[] = [];
  let net = 0;
  for (const l of lines) {
    const it = items.find((x) => x.id === l.itemId);
    if (!it) continue;
    const price = Number(l.price ?? it.saleRate);
    const gross = price * Number(l.qty || 0);
    net += gross - Number(l.discount || 0);
    if (l.price !== undefined && price !== Number(it.saleRate) && !s.allowRateChange && !out.includes("rate")) out.push("rate");
    if (s.maxLineDiscountPct != null && gross > 0 && (Number(l.discount || 0) / gross) * 100 > Number(s.maxLineDiscountPct) && !out.includes("line_discount")) out.push("line_discount");
  }
  if (s.maxBillDiscountPct != null && net > 0 && (Number(billDiscount || 0) / net) * 100 > Number(s.maxBillDiscountPct)) out.push("bill_discount");
  return out;
}

/**
 * Totals, customer, loyalty and split payment for a bill. It works the bill out with the same
 * domain function the server uses, then sends the bill; the server's figures are the ones kept.
 * Keys: F6 customer, F7 discount, F8 cash, F9 UPI, F10 card (the full amount), Ctrl+Enter or Enter in an amount pays.
 */
export function Checkout({ lines, items, settings, customers, submit, onDone, voucherCode: initialVoucher, canOverride = false, initialPhone, initialName, exchange = null }: {
  lines: CartLine[]; items: PosItem[]; settings: PosSettings; customers: Customer[]; voucherCode?: string | undefined;
  submit: (body: Record<string, unknown>) => Promise<Bill>; onDone: (b: Bill) => void; canOverride?: boolean;
  initialPhone?: string | undefined; initialName?: string | undefined;
  /** Goods coming back on this bill: their credit pays first. */
  exchange?: Exchange | null;
}) {
  // One id for this bill: pressing pay twice, or retrying after a lost reply, gives back the same bill instead of making a second.
  const attempt = useRef<string>(crypto.randomUUID());
  const t = useTranslations();
  const locale = useLocale();
  const format = useFormatter();
  const [discount, setDiscount] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState(initialName ?? "");
  const [balance, setBalance] = useState<number | null>(null);
  const [history, setHistory] = useState<History | null>(null);
  const [redeem, setRedeem] = useState("");
  const [accountId, setAccountId] = useState("");
  const [payments, setPayments] = useState<{ mode: PayMode; amount: string; reference: string }[]>([{ mode: "cash", amount: "", reference: "" }]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState("");
  // Coupon, discount card and gift vouchers (checked with the server as they are entered; the bill checks again).
  const [couponCode, setCouponCode] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [coupon, setCoupon] = useState<(CouponRule & { code: string }) | null>(null);
  const [card, setCard] = useState<{ number: string; holder: string; pct: string } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [voucherCode, setVoucherCode] = useState(initialVoucher ?? "");
  const [vouchers, setVouchers] = useState<{ code: string; amount: string; balance: string }[]>([]);
  const [referredBy, setReferredBy] = useState("");
  const rule = { slabs: settings.loyaltySlabs, minRedeem: settings.loyaltyMinRedeem, pointsPer100: settings.loyaltyPointsPer100, pointValue: settings.loyaltyPointValue, maxRedeemPct: settings.loyaltyMaxRedeemPct };

  const billed = lines.filter((l) => Number(l.qty) > 0).map((l) => ({ l, it: items.find((i) => i.id === l.itemId)! })).filter((x) => x.it);
  // Same as the server: schemes only on lines without a discount of their own.
  const [confirmed, setConfirmed] = useState<string[]>([]);
  const schemeLines = billed.map(({ l, it }) => ({ itemId: it.id, qty: l.qty, price: l.price ?? it.saleRate, discount: l.discount ?? "0", taxRate: it.gstRate }));
  const allSchemes = settings.schemes ?? [];
  const offers = applySchemes(schemeLines, schemesAllowed(allSchemes, { giftVouchers: vouchers.length > 0, customerDiscount: !!(card || coupon), confirmed }), todayIso(), businessTime(), { pricesIncludeTax: settings.pricesIncludeTax });
  // Offers that wait for the cashier's yes, shown only when they would take something off this bill.
  const askFirst = allSchemes.filter((x) => x.confirmBeforeApply && schemesAllowed([x], { giftVouchers: vouchers.length > 0, customerDiscount: !!(card || coupon), confirmed: [x.id] }).length && applySchemes(schemeLines, [x], todayIso(), businessTime(), { pricesIncludeTax: settings.pricesIncludeTax }).applied.length);
  const priced = billed.map(({ l, it }, i) => ({
    qty: l.qty, price: l.price ?? it.saleRate, gstRate: it.gstRate, cessRate: it.cessRate, gstSlab: it.gstSlab, slabPieces: it.slabPieces,
    discount: Number(offers.discounts[i]) > 0 ? String(Number(offers.discounts[i]) + Number(l.discount ?? 0)) : (l.discount ?? "0"),
  }));
  const opts = { inclusive: settings.pricesIncludeTax, date: todayIso() };
  const calc = useMemo(() => {
    try {
      // Same order as the server: card and coupon on the bill after schemes and the bill discount, then points.
      let off = { card: "0.00", coupon: "0.00" };
      let promoErr: string | null = null;
      if (card || coupon) {
        const pre = posBill(priced, { ...opts, billDiscount: discount || "0" });
        try { off = promoDiscounts(pre.total, card, coupon); } catch (e) { promoErr = (e as Error).message; }
      }
      const promoTotal = Number(off.card) + Number(off.coupon);
      const before = posBill(priced, { ...opts, billDiscount: (Number(discount || 0) + promoTotal).toFixed(2) });
      const can = balance ? loyaltyRedeemable(balance, before.total, rule) : { points: 0, value: "0.00" };
      const pts = Math.min(Number(redeem || 0), can.points);
      const bill = posBill(priced, { ...opts, billDiscount: (Number(discount || 0) + promoTotal + pts * Number(settings.loyaltyPointValue)).toFixed(2) });
      return { bill, can, pts, off, promoErr, err: null as string | null };
    } catch (e) { return { bill: null, can: { points: 0, value: "0.00" }, pts: 0, off: { card: "0.00", coupon: "0.00" }, promoErr: null, err: (e as Error).message }; }
  }, [JSON.stringify(priced), discount, balance, redeem, coupon, card]); // eslint-disable-line react-hooks/exhaustive-deps

  const broken = limitsBroken(lines, items, discount, settings);
  const needsReason = broken.length > 0;
  const total = calc.bill?.total ?? "0";
  const vTotal = vouchers.reduce((s, v) => s + Number(v.amount), 0);
  // The exchange credit pays first (as the server applies it); credit beyond the bill stays as store credit.
  const exUsed = exchange ? Math.min(Number(exchange.credit), Number(total)) : 0;
  const toPay = Math.max(0, Number(total) - exUsed - vTotal);
  const paid = payments.reduce((s, p) => s + Number(p.amount || 0), 0);
  let settle: { change: string } | null = null;
  try {
    if (vTotal + exUsed > Number(total) + 0.001) throw new Error("voucher_more_than_bill");
    settle = settlePayments(toPay.toFixed(2), payments.filter((p) => Number(p.amount) > 0).map((p) => ({ mode: p.mode, amount: p.amount })));
  } catch { settle = null; }
  const canPay = !busy && !!calc.bill && !!settle && (!needsReason || (canOverride && reason.trim().length >= 3));

  const promoText = (err: unknown) => {
    const code = err instanceof ApiError ? err.code : typeof err === "string" ? err : "generic";
    return t.has(`pos.promo.errors.${code}`) ? t(`pos.promo.errors.${code}`) : t("auth.errors.generic");
  };
  async function checkPromo(kind: "coupon" | "card") {
    const v = (kind === "coupon" ? couponCode : cardNumber).trim();
    setPromoError(null);
    if (!v) { if (kind === "coupon") setCoupon(null); else setCard(null); return; }
    try {
      const r = await api<{ coupon: (CouponRule & { code: string }) | null; card: { number: string; holder: string; pct: string } | null }>(`/pos/promo?${kind}=${encodeURIComponent(v)}`);
      if (kind === "coupon") setCoupon(r.coupon); else setCard(r.card);
    } catch (err) {
      if (kind === "coupon") setCoupon(null); else setCard(null);
      setPromoError(promoText(err));
    }
  }
  async function addVoucher() {
    const code = voucherCode.trim().toUpperCase();
    setPromoError(null);
    if (!code || vouchers.some((v) => v.code === code)) return;
    try {
      const v = await api<{ code: string; balance: string; status: string; expiresOn: string }>(`/gift-vouchers/${encodeURIComponent(code)}`);
      if (v.status !== "active" || v.expiresOn < todayIso()) { setPromoError(promoText("voucher_not_usable")); return; }
      const amount = Math.min(Number(v.balance), Math.max(0, Number(total) - exUsed - vTotal));
      if (amount <= 0) return;
      setVouchers([...vouchers, { code: v.code, balance: v.balance, amount: amount.toFixed(2) }]);
      setVoucherCode("");
    } catch (err) { setPromoError(promoText(err instanceof ApiError && err.status === 404 ? "voucher_not_found" : err)); }
  }

  async function lookup(v: string) {
    setPhone(v);
    setBalance(null);
    setHistory(null);
    if (!/^[6-9]\d{9}$/.test(v)) return;
    try {
      const h = await api<History>(`/pos/customers/${v}`);
      setHistory(h);
      if (settings.loyaltyEnabled && (h.visits > 0 || h.points > 0)) setBalance(h.points);
      if (h.name) setName((n) => n || h.name!);
    } catch { /* unknown customer: they join on this bill */ }
  }
  useEffect(() => { if (initialPhone) void lookup(initialPhone); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function pay() {
    if (!canPay) return;
    setBusy(true);
    setError(null);
    try {
      const body = {
        payments: payments.filter((p) => Number(p.amount) > 0).map((p) => ({ mode: p.mode, amount: p.amount, ...(p.reference ? { reference: p.reference } : {}) })),
        ...(Number(discount) ? { billDiscount: discount } : {}),
        ...(phone ? { customerPhone: phone } : {}), ...(name ? { customerName: name } : {}), ...(calc.pts ? { redeemPoints: calc.pts } : {}),
        ...(accountId ? { customerAccountId: accountId } : {}),
        ...(coupon ? { couponCode: coupon.code } : {}), ...(card ? { cardNumber: card.number } : {}),
        ...(vouchers.length ? { giftVouchers: vouchers.map((v) => ({ code: v.code, amount: v.amount })) } : {}),
        ...(referredBy.length === 10 && balance === null ? { referredBy } : {}),
        ...(exchange ? { exchange: { billId: exchange.billId, lines: exchange.lines.map((l) => ({ lineId: l.lineId, qty: l.qty, reason: l.reason, grade: l.grade })) } } : {}),
        ...(needsReason && reason.trim() ? { overrideReason: reason.trim() } : {}),
      };
      onDone(await submit({ ...body, id: attempt.current, ...(confirmed.length ? { confirmedSchemes: confirmed } : {}) }));
    } catch (err) { setError(errorText(t, err, POS_NS)); } finally { setBusy(false); }
  }
  // Function keys: one tender takes the whole amount; F6 and F7 jump to the customer and discount.
  const payAll = (mode: PayMode) => setPayments([{ mode, amount: toPay.toFixed(2), reference: "" }]);
  const keys = useRef({ payAll, pay });
  keys.current = { payAll, pay };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (k === "F6" || k === "F7") { e.preventDefault(); document.getElementById(k === "F6" ? "co-phone" : "co-disc")?.focus(); }
      else if (k === "F8" || k === "F9" || k === "F10") { e.preventDefault(); keys.current.payAll(k === "F8" ? "cash" : k === "F9" ? "upi" : "card"); }
      else if (k === "Enter" && e.ctrlKey) { e.preventDefault(); void keys.current.pay(); }
    };
    window.addEventListener("keydown", onKey, true); // capture: before the app-wide shortcuts
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  const row = (label: string, v: string, tone = "") => (
    <div className={`flex justify-between gap-3 text-[0.9286rem] ${tone}`}><span className={tone ? "" : "text-muted"}>{label}</span><span className="num">{v}</span></div>
  );
  const box = "rounded-lg border border-border bg-surface p-3";
  const head = (label: string, extra?: React.ReactNode) => (
    <div className="mb-2 flex items-center justify-between gap-2"><h3 className="text-[0.8571rem] font-semibold tracking-wide text-muted uppercase">{label}</h3>{extra}</div>
  );
  const b = calc.bill;
  const tender = (mode: PayMode, Icon: typeof Banknote, key: string) => (
    <button type="button" onClick={() => payAll(mode)} disabled={!b}
      className={`flex h-9 items-center justify-center gap-1.5 rounded-md border px-2 text-[0.9286rem] font-semibold ${payments.length === 1 && payments[0]!.mode === mode && Number(payments[0]!.amount) > 0 ? "border-primary bg-primary-soft text-primary" : "border-border bg-surface hover:bg-surface-3"} disabled:opacity-50`}>
      <Icon className="size-4" aria-hidden />{t(`pos.billing.modes.${mode}`)}<kbd>{key}</kbd>
    </button>
  );
  return (
    <div className="flex flex-col gap-3">
      <section className={box} aria-label={t("pos.billing.customer")}>
        {head(t("pos.billing.customer"), <kbd>F6</kbd>)}
        <div className="grid gap-2 sm:grid-cols-2">
          <Field label={t("pos.billing.customer")} htmlFor="co-phone" hint={balance !== null ? t("pos.billing.points", { points: balance }) : undefined}>
            <div className="relative">
              <User className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
              <Input id="co-phone" value={phone} onChange={(e) => void lookup(e.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="tel" className="num pl-8" />
            </div>
          </Field>
          {phone.length === 10 ? <Field label={t("pos.billing.customerName")} htmlFor="co-name"><Input id="co-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} /></Field> : null}
          {settings.loyaltyEnabled && settings.referralPoints && phone.length === 10 && balance === null ? (
            <Field label={t("pos.promo.referredBy")} htmlFor="co-ref" hint={t("pos.promo.referredHint", { points: settings.referralPoints })}>
              <Input id="co-ref" value={referredBy} onChange={(e) => setReferredBy(e.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="tel" className="num" />
            </Field>
          ) : null}
        </div>
        {history && history.visits > 0 ? (
          <div className="mt-2 rounded-md border border-border bg-surface-3 p-2 text-[0.8571rem]">
            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
              <span className="font-semibold">{history.name ?? phone}</span>
              <span>{t("pos.counter.visits", { n: history.visits })}</span>
              <span>{t("pos.counter.spent", { v: rupees(history.spent) })}</span>
              {Number(history.returned) > 0 ? <span className="text-muted">{t("pos.counter.returned", { v: rupees(history.returned) })}</span> : null}
              {history.lastVisit ? <span className="text-muted">{t("pos.counter.lastVisit", { date: format.dateTime(new Date(`${history.lastVisit}T00:00:00`), { dateStyle: "medium" }) })}</span> : null}
            </div>
            {history.top.length ? <p className="mt-0.5 text-muted">{t("pos.counter.buys")}: {history.top.map((x) => `${x.name} (${x.qty})`).join(", ")}</p> : null}
          </div>
        ) : history ? <p className="mt-1.5 text-xs text-muted">{t("pos.counter.newCustomer")}</p> : null}
      </section>

      <section className={box} aria-label={t("pos.counter.offers")}>
        {head(t("pos.counter.offers"), <kbd>F7</kbd>)}
        <div className="grid gap-2 sm:grid-cols-2">
          <Field label={t("pos.billing.discount")} htmlFor="co-disc"><Input id="co-disc" value={discount} onChange={(e) => setDiscount(e.target.value)} inputMode="decimal" className="num" /></Field>
          <Field label={t("pos.promo.coupon")} htmlFor="co-coupon" hint={coupon ? t("pos.promo.couponOk", { off: coupon.kind === "percent" ? `${Number(coupon.value)}%` : rupees(String(coupon.value)) }) : undefined}>
            <Input id="co-coupon" value={couponCode} onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); if (coupon) setCoupon(null); }} onBlur={() => void checkPromo("coupon")}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void checkPromo("coupon"); } }} maxLength={20} className="uppercase" />
          </Field>
          <Field label={t("pos.promo.card")} htmlFor="co-card" hint={card ? `${card.holder} · ${Number(card.pct)}%` : undefined}>
            <Input id="co-card" value={cardNumber} onChange={(e) => { setCardNumber(e.target.value.toUpperCase()); if (card) setCard(null); }} onBlur={() => void checkPromo("card")}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void checkPromo("card"); } }} maxLength={20} className="uppercase" />
          </Field>
          {calc.can.points > 0 ? (
            <Field label={t("pos.billing.redeem")} htmlFor="co-redeem" hint={t("pos.billing.redeemable", { points: calc.can.points, value: calc.can.value })}>
              <Input id="co-redeem" value={redeem} onChange={(e) => setRedeem(e.target.value.replace(/\D/g, ""))} inputMode="numeric" className="num" />
            </Field>
          ) : null}
        </div>
        {promoError || calc.promoErr ? <div className="mt-2"><Alert>{promoError ?? promoText(calc.promoErr)}</Alert></div> : null}
      </section>

      {b ? (
        <section className={box} aria-label={t("pos.counter.breakdown")}>
          {head(t("pos.counter.breakdown"))}
          <div className="flex flex-col gap-1">
            {row(t("pos.billing.taxable"), rupees(b.taxable))}
            {Number(b.cgst) ? row("CGST", rupees(b.cgst)) : null}
            {Number(b.sgst) ? row("SGST", rupees(b.sgst)) : null}
            {Number(b.cess) ? row("Cess", rupees(b.cess)) : null}
            {offers.applied.map((o) => <div key={o.schemeId}>{row(o.name, `− ${rupees(o.discount)}`, "text-success")}</div>)}
            {askFirst.map((x) => (
              <label key={x.id} className="flex items-center gap-2 rounded-md border border-border px-2 py-1 text-sm">
                <input type="checkbox" checked={confirmed.includes(x.id)} onChange={(e) => setConfirmed(e.target.checked ? [...confirmed, x.id] : confirmed.filter((c) => c !== x.id))} />
                {t("pos.billing.applyOffer", { name: x.name })}
              </label>
            ))}
            {Number(calc.off.card) ? row(t("pos.promo.cardOff"), `− ${rupees(calc.off.card)}`, "text-success") : null}
            {Number(calc.off.coupon) ? row(t("pos.promo.couponOff", { code: coupon?.code ?? "" }), `− ${rupees(calc.off.coupon)}`, "text-success") : null}
            {Number(b.discount) - Number(calc.off.card) - Number(calc.off.coupon) > 0.004 ? row(t("pos.billing.discount"), `− ${rupees(Number(b.discount) - Number(calc.off.card) - Number(calc.off.coupon))}`, "text-success") : null}
            {Number(b.roundOff) ? row(t("pos.billing.roundOff"), b.roundOff) : null}
          </div>
          <div className="mt-2.5 flex items-center justify-between rounded-md bg-navy px-3 py-2.5 text-white">
            <span className="text-[0.8571rem] leading-tight font-semibold">{t("pos.billing.total")}<span className="block text-[0.7857rem] font-normal text-white/70">{t("pos.counter.inclGst")}</span></span>
            <span className="num text-[1.6rem] font-bold tracking-tight">{rupees(b.total)}</span>
          </div>
          {exchange || vouchers.length ? (
            <div className="mt-2 flex flex-col gap-1">
              {exchange ? row(t("exchange.creditUsed", { number: exchange.number }), `− ${rupees(exUsed)}`) : null}
              {exchange && Number(exchange.credit) > exUsed + 0.004 ? <p className="text-xs text-accent">{t("exchange.creditLeft", { amount: rupees(Number(exchange.credit) - exUsed) })}</p> : null}
              {vouchers.map((v) => (
                <div key={v.code} className="flex items-center justify-between text-[0.9286rem] text-muted">
                  <span>{t("pos.promo.voucher", { code: v.code })}</span>
                  <span className="flex items-center gap-2"><span className="num">− {rupees(v.amount)}</span>
                    <button type="button" onClick={() => setVouchers(vouchers.filter((x) => x.code !== v.code))} className="text-muted hover:text-danger" title={t("common.remove")}><Trash2 className="size-3.5" aria-hidden /></button>
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-[1.05rem] font-bold"><span>{t("pos.promo.toPay")}</span><span className="num">{rupees(toPay)}</span></div>
            </div>
          ) : null}
        </section>
      ) : calc.err && lines.length ? <Alert>{t.has(`pos.errors.${calc.err}`) ? t(`pos.errors.${calc.err}`) : t("auth.errors.generic")}</Alert> : null}

      {needsReason ? (
        canOverride ? (
          <Field label={t("pos.counter.approvalReason")} htmlFor="co-reason" hint={broken.map((k) => t(`pos.counter.broken.${k}`)).join(" · ")}>
            <Input id="co-reason" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={200} />
          </Field>
        ) : <Alert>{t("pos.counter.needsApprover")}: {broken.map((k) => t(`pos.counter.broken.${k}`)).join(", ")}</Alert>
      ) : null}

      <section className={box} aria-label={t("pos.billing.payments")}>
        {head(t("pos.billing.payments"))}
        <div className="mb-2 grid grid-cols-3 gap-1.5">
          {tender("cash", Banknote, "F8")}
          {tender("upi", QrCode, "F9")}
          {tender("card", CreditCard, "F10")}
        </div>
        <div className="flex flex-col gap-2">
          {payments.map((p, i) => (
            <div key={i} className="grid grid-cols-[96px_1fr_1fr_auto] items-center gap-1.5">
              <Select value={p.mode} onChange={(e) => setPayments(payments.map((x, j) => (j === i ? { ...x, mode: e.target.value as PayMode } : x)))} aria-label={t("pos.billing.payments")}>
                {(["cash", "upi", "card", "credit"] as const).map((m) => <option key={m} value={m}>{t(`pos.billing.modes.${m}`)}</option>)}
              </Select>
              <Input value={p.amount} onChange={(e) => setPayments(payments.map((x, j) => (j === i ? { ...x, amount: e.target.value } : x)))} placeholder={b ? String(toPay - paid + Number(p.amount || 0)) : ""} inputMode="decimal" className="num text-right" aria-label={t("pos.billing.amount")}
                onFocus={() => { if (!p.amount && b) setPayments(payments.map((x, j) => (j === i ? { ...x, amount: String(Math.max(0, toPay - paid)) } : x))); }}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void pay(); } }} />
              <Input value={p.reference} onChange={(e) => setPayments(payments.map((x, j) => (j === i ? { ...x, reference: e.target.value } : x)))} placeholder={t("pos.billing.reference")} maxLength={40} disabled={p.mode === "cash"} />
              {payments.length > 1 ? <button type="button" onClick={() => setPayments(payments.filter((_, j) => j !== i))} className="rounded-md p-1.5 text-muted hover:text-danger" title={t("common.remove")}><Trash2 className="size-4" aria-hidden /></button> : <span />}
            </div>
          ))}
          {payments.some((p) => p.mode === "credit") ? (
            <Select value={accountId} onChange={(e) => setAccountId(e.target.value)} aria-label={t("sales.customer")}>
              <option value="">{t("sales.customer")}</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{localName(c, locale)}</option>)}
            </Select>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            {payments.length < 6 ? <Button type="button" variant="ghost" className="-ml-2 h-8" onClick={() => setPayments([...payments, { mode: "upi", amount: "", reference: "" }])}><Plus className="size-4" aria-hidden />{t("pos.billing.addPayment")}</Button> : null}
            <div className="ml-auto flex gap-1.5">
              <Input value={voucherCode} onChange={(e) => setVoucherCode(e.target.value.toUpperCase())} placeholder={t("pos.promo.voucherCode")} aria-label={t("pos.promo.voucherCode")} maxLength={16} className="h-8 w-36 uppercase"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void addVoucher(); } }} />
              <Button type="button" variant="outline" className="h-8" onClick={() => void addVoucher()} disabled={!voucherCode.trim() || !b}>{t("pos.promo.useVoucher")}</Button>
            </div>
          </div>
          {b && paid > 0 ? (
            settle && Number(settle.change) > 0 ? (
              <div className="flex items-center justify-between rounded-md bg-teal px-3 py-2 text-white"><span className="font-semibold">{t("pos.billing.change")}</span><span className="num text-[1.25rem] font-bold">{rupees(settle.change)}</span></div>
            ) : !settle && paid < toPay ? <p className="text-[0.9286rem] font-semibold text-danger">{t("pos.billing.due")}: <span className="num">{rupees(toPay - paid)}</span></p> : null
          ) : null}
        </div>
      </section>
      {error ? <Alert>{error}</Alert> : null}
      <Button onClick={pay} disabled={!canPay} className="h-12 justify-between px-4 text-[1.05rem]">
        <span>{t("pos.billing.pay")}{b ? ` · ${rupees(b.total)}` : ""}</span><kbd className="!border-white/30 !bg-white/15 !text-white">Ctrl Enter</kbd>
      </Button>
    </div>
  );
}
