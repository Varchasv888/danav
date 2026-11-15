"use client";

import { AlertCircle, CheckCircle2, Plus, SlidersHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { GST_RATES, GST_STATES, amountInWords, computeInvoiceTax, dec, lineGstRate, validateGstin, wordsLang, devanagari } from "@varchasv/domain";
import { ApiError, api } from "@/lib/client-api";
import { localName, rupees, todayIso } from "@/lib/format";
import type { CustomerOption, ItemOption, WarehouseOption } from "@/lib/masters";
import { Drawer } from "../Drawer";
import { StyleGridPicker } from "../inventory/StyleGridPicker";
import { useToast } from "../Toast";
import { ImportLinesButton } from "./ImportLinesButton";
import { Combobox, DateField, MoneyField, NumberField, type ComboOption } from "../fields";
import { Alert, Button, Field, Input, Select, cn } from "../ui";
import { useWorkDate } from "@/components/WorkingDate";

export interface SalesDraftLine {
  itemId: string; qty: string; rate: string; discount?: string; gstRate?: string;
  /** Entered in another unit (a dozen = 12): quantity and rate are converted to the item's own unit. */
  per?: { code: string; factor: string };
  deliveryLineId?: string; orderLineId?: string; warehouseId?: string; locked?: boolean;
}
/** `discPct` is the discount as the person types it (a percentage); `discount` is the amount that came with a draft and is shown as a percentage until it is edited. */
interface Line extends SalesDraftLine { key: number; discPct?: string }
let nextKey = 1;
const QTY = /^\d+(\.\d{1,4})?$/;
const PCT = /^\d{1,3}(\.\d{1,2})?$/;

const plusDays = (iso: string, days: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + days * 86_400_000).toISOString().slice(0, 10);
const PATH = { quotation: "quotations", proforma: "proformas", order: "orders", invoice: "invoices" } as const;
const ENDPOINT = { quotation: "/quotations", proforma: "/quotations", order: "/sales-orders", invoice: "/sales-invoices" } as const;

/** A figure that rolls into place when it changes instead of flashing. */
function Ticker({ v }: { v: string }) {
  return <span key={v} className="inline-block animate-count-up motion-reduce:animate-none">{v}</span>;
}

const th = "border border-border bg-surface-3 px-2 py-1.5 text-xs font-semibold tracking-wide text-text-secondary uppercase";
const td = "border border-border p-0 align-middle max-lg:block max-lg:border-0 max-lg:before:mb-0.5 max-lg:before:block max-lg:before:px-1 max-lg:before:text-xs max-lg:before:text-muted max-lg:before:content-[attr(data-label)]";
const cellInput = "h-9 w-full rounded-none border-0 bg-transparent px-2 text-sm";

/**
 * Quotation, sales order, proforma or sales invoice, laid out as an accounting voucher: a header strip (type, number, date, due date, place of supply, rate basis), the party
 * with what they owe, a ruled line grid worked from the keyboard, the narration and totals, and a sticky action bar. Dispatch, sales team and terms live in a drawer
 * (F12). Place of supply is the customer's state unless changed; exports go to "96". The same computeInvoiceTax the server uses produces the preview.
 */
export function SalesForm({ mode, customers, items, warehouses, homeState, initial }: {
  mode: "quotation" | "proforma" | "order" | "invoice"; customers: CustomerOption[]; items: ItemOption[]; warehouses: WarehouseOption[]; homeState: string;
  initial?: {
    customerId?: string; orderId?: string; quotationId?: string; lines?: SalesDraftLine[];
    agentId?: string | null; agentPct?: string | null; salesmanId?: string | null;
    supply?: { placeOfSupply?: string; export?: boolean; sez?: boolean; lut?: boolean };
  };
}) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();
  const [customerId, setCustomerId] = useState(initial?.customerId ?? "");
  const [customerList, setCustomerList] = useState(customers);
  const [newCustomerOpen, setNewCustomerOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerGstin, setNewCustomerGstin] = useState("");
  const [newCustomerState, setNewCustomerState] = useState("");
  const [customerSaving, setCustomerSaving] = useState(false);
  const [customerError, setCustomerError] = useState("");
  const [canCreateCustomer, setCanCreateCustomer] = useState(false);
  useEffect(() => {
    if (mode !== "invoice") return;
    api<{ id: string; key: string | null }[]>("/accounts/groups")
      .then((groups) => { setDebtorGroupId(groups.find((g) => g.key === "sundry_debtors")?.id ?? ""); setCanCreateCustomer(true); })
      .catch(() => setCanCreateCustomer(false));
  }, [mode]);
  const [debtorGroupId, setDebtorGroupId] = useState("");
  async function createCustomer() {
    if (!debtorGroupId || !newCustomerName.trim() || customerSaving) return;
    setCustomerSaving(true);
    setCustomerError("");
    try {
      const created = await api<CustomerOption>("/accounts", { body: {
        name: newCustomerName.trim(), groupId: debtorGroupId,
        ...(newCustomerPhone.trim() ? { phone: newCustomerPhone.trim() } : {}),
        ...(newCustomerGstin.trim() ? { gstin: newCustomerGstin.trim().toUpperCase() } : {}),
        ...(newCustomerState ? { stateCode: newCustomerState } : {}),
      } });
      setCustomerList((list) => [...list, created]);
      setCustomerId(created.id);
      setPos("");
      setNewCustomerOpen(false);
      setNewCustomerName(""); setNewCustomerPhone(""); setNewCustomerGstin(""); setNewCustomerState("");
    } catch (err) {
      setCustomerError(err instanceof ApiError ? (err.issues?.[0]?.message ?? err.code) : "Unable to create customer. Check your permissions and details.");
    } finally { setCustomerSaving(false); }
  }
  const customer = customerList.find((c) => c.id === customerId);
  const [pos, setPos] = useState<string>(initial?.supply?.export ? "" : initial?.supply?.placeOfSupply ?? "");
  const [exportSale, setExportSale] = useState(!!initial?.supply?.export);
  const [sez, setSez] = useState(!!initial?.supply?.sez);
  const [lut, setLut] = useState(!!initial?.supply?.lut);
  const workDate = useWorkDate();
  const [date, setDate] = useState(workDate);
  const [dueOn, setDueOn] = useState("");
  const [validUntil, setValidUntil] = useState(plusDays(todayIso(), 15));
  const [narration, setNarration] = useState("");
  const [cartons, setCartons] = useState("");
  const [special, setSpecial] = useState("");
  const [cash, setCash] = useState("");
  const [earlyPct, setEarlyPct] = useState("");
  const [earlyDays, setEarlyDays] = useState("");
  const [basis, setBasis] = useState<"wholesale" | "mrp">("wholesale");
  const [advanceDue, setAdvanceDue] = useState("");
  const [transporter, setTransporter] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [lrNumber, setLrNumber] = useState("");
  const [lrDate, setLrDate] = useState("");
  const [ewbNo, setEwbNo] = useState("");
  const [dispatchWh, setDispatchWh] = useState("");
  const [ship, setShip] = useState(false);
  const [shipLine, setShipLine] = useState("");
  const [shipCity, setShipCity] = useState("");
  const [shipPin, setShipPin] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [balance, setBalance] = useState<{ balance: string; overdue: string; advance: string } | null>(null);
  // The number the invoice will get and the bank details and terms printed on it, shown before saving.
  const [info, setInfo] = useState<{ number: string; bankDetails: string | null; terms: string | null } | null>(null);
  const quoteLike = mode === "quotation" || mode === "proforma";
  const [lines, setLines] = useState<Line[]>(() => (initial?.lines?.length ? initial.lines : [{ itemId: "", qty: "", rate: "" }]).map((l) => ({ ...l, key: nextKey++ })));
  const [error, setError] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [busy, setBusy] = useState(false);
  // A customer on a price list gets its rates for the items added from now on.
  const [listRates, setListRates] = useState<Record<string, string>>({});
  // Orders and invoices record who brought the sale; the customer's (or the order's) people fill in.
  const people = mode === "order" || mode === "invoice";
  const [agentId, setAgentId] = useState(initial?.orderId ? (initial.agentId ?? "") : (initial?.agentId ?? customer?.agentId ?? ""));
  const [agentPct, setAgentPct] = useState(initial?.agentPct ? String(Number(initial.agentPct)) : "");
  const [salesmanId, setSalesmanId] = useState(initial?.orderId ? (initial.salesmanId ?? "") : (initial?.salesmanId ?? customer?.salesmanId ?? ""));
  const [agents, setAgents] = useState<{ id: string; name: string; commissionPct: string | null; archived: boolean }[]>([]);
  const [salesmen, setSalesmen] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => {
    if (!people) return;
    api<typeof agents>("/agents").then(setAgents).catch(() => setAgents([]));
    api<typeof salesmen>("/salesmen").then(setSalesmen).catch(() => setSalesmen([]));
  }, [people]);
  useEffect(() => {
    if (mode !== "invoice" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
    api<typeof info>(`/sales-invoices/form-info?date=${date}`).then(setInfo).catch(() => setInfo(null));
  }, [mode, date]);
  useEffect(() => {
    if (!customerId) { setBalance(null); return; }
    api<{ balance: string; overdue: string; advance: string }>(`/customers/${customerId}/balance`).then(setBalance).catch(() => setBalance(null));
  }, [customerId]);
  const chooseCustomer = (id: string) => {
    const c = customerList.find((x) => x.id === id);
    setCustomerId(id);
    setPos("");
    setAgentId(c?.agentId ?? "");
    setAgentPct("");
    setSalesmanId(c?.salesmanId ?? "");
  };
  useEffect(() => {
    const id = customer?.priceListId;
    if (!id) { setListRates({}); return; }
    api<Record<string, string>>(`/price-lists/${id}/rates`).then(setListRates).catch(() => setListRates({}));
  }, [customer?.priceListId]);

  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const sorted = useMemo(() => [...items].filter((i) => !i.archived).sort((a, b) => localName(a, locale).localeCompare(localName(b, locale))), [items, locale]);
  const update = (key: number, patch: Partial<Line>) => setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  const placeOfSupply = exportSale ? "96" : pos || customer?.stateCode || homeState;
  const eff = (l: Line) => (l.per && QTY.test(l.qty) && QTY.test(l.rate)
    ? { qty: dec(l.qty).times(l.per.factor).toString(), rate: dec(l.rate).div(l.per.factor).toDecimalPlaces(4).toString() }
    : { qty: l.qty, rate: l.rate });
  const gross = (l: Line) => (QTY.test(l.qty) && QTY.test(l.rate) ? dec(l.qty).times(l.rate) : dec(0));
  /** The discount amount the tax and the server work from: the typed percentage of the line's value, or the amount a draft came with. */
  const discAmt = (l: Line): string => (l.discPct !== undefined ? (PCT.test(l.discPct) ? gross(l).times(l.discPct).div(100).toDecimalPlaces(2).toString() : "") : l.discount ?? "");
  /** What the Disc % cell shows. */
  const discShown = (l: Line): string => (l.discPct !== undefined ? l.discPct : l.discount && gross(l).gt(0) ? dec(l.discount).div(gross(l)).times(100).toDecimalPlaces(2).toString() : "");
  // The rate shown is the one the server will use: the line's own if changed, else the item's, which for
  // apparel and footwear depends on the price per piece after discount.
  const gstOf = (l: Line) => {
    if (l.gstRate) return l.gstRate;
    const it = byId.get(l.itemId);
    if (!it) return "0";
    if (!QTY.test(l.qty) || !Number(l.qty) || !QTY.test(l.rate) || (discAmt(l) && !QTY.test(discAmt(l)))) return it.gstRate;
    return lineGstRate(it, { ...eff(l), discount: discAmt(l) || "0" }, date);
  };
  const valid = lines.filter((l) => l.itemId && QTY.test(l.qty) && Number(l.qty) > 0 && QTY.test(l.rate) && (l.discPct === undefined || l.discPct === "" || PCT.test(l.discPct)));
  const tax = useMemo(() => {
    try {
      return computeInvoiceTax(valid.map((l) => ({ ...eff(l), discount: discAmt(l) || "0", gstRate: gstOf(l) })), { supplierState: homeState, placeOfSupply, sez, lut: (exportSale || sez) && lut });
    } catch {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(valid), placeOfSupply, homeState, sez, lut, exportSale, date]);

  type Then = "view" | "print" | "new";
  function submit(e: React.FormEvent) {
    e.preventDefault();
    void send(false, "view");
  }

  async function send(overrideCredit: boolean, then: Then) {
    let reason = "";
    if (overrideCredit) {
      reason = (window.prompt(t("sales.overrideReasonPrompt")) ?? "").trim();
      if (reason.length < 3) return;
    }
    if (busy || (mode !== "invoice" && !customerId) || !valid.length) return;
    // A window opened now, while the click still counts, can be pointed at the print page once the invoice exists.
    const printWin = then === "print" ? window.open("about:blank", "_blank") : null;
    setBusy(true);
    setError(null);
    setBlocked(false);
    const supply = { ...(pos && !exportSale ? { placeOfSupply: pos } : {}), ...(exportSale ? { export: true } : {}), ...(sez ? { sez: true } : {}), ...((exportSale || sez) && lut ? { lut: true } : {}) };
    const payloadLines = valid.map((l) => {
      const d = discAmt(l);
      return {
        itemId: l.itemId, ...eff(l), ...(l.gstRate ? { gstRate: String(Number(l.gstRate)) } : {}), ...(d && Number(d) > 0 ? { discount: d } : {}),
        ...(mode === "invoice" && l.deliveryLineId ? { deliveryLineId: l.deliveryLineId } : {}),
        ...(mode === "invoice" && l.orderLineId && !l.deliveryLineId ? { orderLineId: l.orderLineId } : {}),
        ...(mode === "invoice" && !l.deliveryLineId && (l.warehouseId || dispatchWh) ? { warehouseId: l.warehouseId || dispatchWh } : {}),
      };
    });
    const shipping = ship && shipLine.trim() ? { shippingAddress: { line1: shipLine.trim(), ...(shipCity.trim() ? { city: shipCity.trim() } : {}), ...(/^[1-9]\d{5}$/.test(shipPin) ? { pincode: shipPin } : {}) } } : {};
    try {
      const doc = await api<{ id: string; number?: string; warnings?: { code: string; lineNo?: number; detail?: string }[] }>(ENDPOINT[mode], {
        body: {
          ...(customerId ? { customerId } : {}), date, supply, narration: narration || undefined, lines: payloadLines, ...(overrideCredit ? { overrideCredit: true, overrideReason: reason } : {}),
          ...(quoteLike ? { validUntil } : { quotationId: initial?.quotationId }),
          ...(mode === "proforma" ? { kind: "proforma", advanceDue: advanceDue || undefined } : {}),
          ...(mode === "invoice" ? { dueOn: dueOn || undefined, orderId: initial?.orderId, ...(Number(cartons) > 0 ? { cartons: Number(cartons) } : {}), ...shipping,
            ...(transporter.trim() ? { transporter: transporter.trim() } : {}), ...(vehicleNo.trim() ? { vehicleNo: vehicleNo.trim() } : {}),
            ...(lrNumber.trim() ? { lrNumber: lrNumber.trim() } : {}), ...(lrDate ? { lrDate } : {}), ...(/^\d{12}$/.test(ewbNo) ? { ewbNo } : {}),
            ...(Number(special) > 0 || Number(cash) > 0 ? { discounts: { ...(Number(special) > 0 ? { special } : {}), ...(Number(cash) > 0 ? { cash } : {}) } } : {}),
            ...(Number(earlyPct) > 0 && Number(earlyDays) > 0 ? { earlyPay: { pct: earlyPct, days: Number(earlyDays) } } : {}) } : {}),
          ...(people ? { agentId: agentId || null, salesmanId: salesmanId || null, ...(agentId && agentPct ? { agentPct } : {}) } : {}),
        },
      });
      const w = `?saved=1${doc.warnings?.length ? `&w=${encodeURIComponent(JSON.stringify(doc.warnings))}` : ""}`;
      if (then === "print" && printWin) printWin.location.href = `/print/invoice/${doc.id}`;
      if (then === "new") {
        toast({ title: t("sales.savedToast", { doc: doc.number ?? t(`sales.voucher.${mode}`) }), action: { label: t("sales.openIt"), href: `/sales/${PATH[mode]}/${doc.id}` } });
        router.push(`/sales/${PATH[mode]}/new?n=${Date.now()}`);
        setBusy(false);
      } else {
        router.push(`/sales/${PATH[mode]}/${doc.id}${w}`);
      }
      router.refresh();
    } catch (err) {
      printWin?.close();
      const code = err instanceof ApiError ? (err.issues?.[0]?.message ?? err.code) : "generic";
      const key = [`sales.errors.${code}`, `purchase.errors.${code}`, `vouchers.errors.${code}`, `items.errors.${code}`].find((k) => t.has(k));
      setError(key ? t(key) : t("auth.errors.generic"));
      setBlocked(code === "credit_blocked" || code === "overdue_blocked");
      setBusy(false);
    }
  }

  const defaultWh = warehouses.find((w) => w.isDefault)?.id ?? warehouses[0]?.id;
  const customerOptions = useMemo<ComboOption[]>(() => customerList.map((c) => ({ value: c.id, label: localName(c, locale), ...(c.gstin ? { sub: c.gstin } : {}) })), [customerList, locale]);
  const itemOptions = useMemo<ComboOption[]>(() => sorted.map((it) => ({
    value: it.id, label: localName(it, locale), ...([it.size, it.color].filter(Boolean).length ? { sub: [it.size, it.color].filter(Boolean).join(" / ") } : {}),
    ...(it.kind === "goods" ? { right: `${Number(it.stockQty).toLocaleString("en-IN")} ${it.uom}` } : {}),
  })), [sorted, locale]);
  // The line grid works from the keyboard: Enter moves across the cells and, on the last cell of the last line, adds a line.
  const grid = useRef<HTMLTableElement>(null);
  const [fresh, setFresh] = useState<number | null>(null);
  // Focus is asked for here and given once the new state is on screen (no timers, so it never lags).
  const wantFocus = useRef<{ key: number; nth: number } | null>(null);
  useEffect(() => {
    const w = wantFocus.current;
    if (!w) return;
    wantFocus.current = null;
    grid.current?.querySelectorAll<HTMLElement>(`tr[data-key="${w.key}"] input`)[w.nth]?.focus();
  });
  const controls = () => [...(grid.current?.querySelectorAll<HTMLElement>("tbody input:not([disabled]), tbody select:not([disabled]):not([data-enter-skip])") ?? [])];
  function addLine(focus = false) {
    const key = nextKey++;
    setLines((ls) => [...ls, { key, itemId: "", qty: "", rate: "" }]);
    setFresh(key);
    if (focus) wantFocus.current = { key, nth: 0 };
  }
  function removeLine(key: number) {
    setLines((ls) => (ls.length > 1 ? ls.filter((x) => x.key !== key) : ls));
  }
  function gridKey(e: React.KeyboardEvent) {
    if (e.key !== "Enter" || e.shiftKey || e.ctrlKey || e.metaKey) return;
    const el = e.target as HTMLElement;
    if (!(el instanceof HTMLInputElement || el instanceof HTMLSelectElement) || (el.getAttribute("role") === "combobox" && el.getAttribute("aria-expanded") === "true")) return;
    e.preventDefault();
    const all = controls();
    const at = all.indexOf(el);
    if (at < all.length - 1) all[at + 1]!.focus(); else addLine(true);
  }
  const dirty = !!customerId || lines.some((l) => l.itemId);
  function cancel() {
    if (!dirty || window.confirm(t("drawer.discard"))) router.back();
  }
  /** The voucher's shortcut keys: Ctrl+S saves, Ctrl+Enter saves and starts another, Ctrl+P saves and prints, F3 adds a line, F12 opens dispatch and terms, Ctrl+Delete removes the line, Esc cancels. */
  function onKey(e: React.KeyboardEvent<HTMLFormElement>) {
    if (drawer) return;
    const mod = e.ctrlKey || e.metaKey;
    const k = e.key;
    const target = e.target as HTMLElement;
    if (mod && k.toLowerCase() === "s") { e.preventDefault(); void send(false, "view"); }
    else if (mod && k === "Enter" && mode === "invoice") { e.preventDefault(); void send(false, "new"); }
    else if (mod && k.toLowerCase() === "p" && mode === "invoice") { e.preventDefault(); void send(false, "print"); }
    else if (k === "F3") { e.preventDefault(); addLine(true); }
    else if (k === "F12" && showDrawer) { e.preventDefault(); setDrawer(true); }
    else if (mod && k === "Delete") { const row = target.closest("tr[data-key]"); if (row) { e.preventDefault(); removeLine(Number(row.getAttribute("data-key"))); } }
    else if (k === "Escape" && !(target.getAttribute("role") === "combobox" && target.getAttribute("aria-expanded") === "true")) { e.preventDefault(); cancel(); }
  }

  const stateName = (code: string) => { const s = GST_STATES.find((x) => x.code === code); return s ? `${code} · ${devanagari(locale) ? s.nameHi : s.name}` : code; };
  const showDrawer = people;
  const setCount = [agentId, salesmanId, agentPct, transporter, vehicleNo, lrNumber, lrDate, ewbNo, cartons, dispatchWh, special, cash, earlyPct].filter(Boolean).length;
  const gstin = customer?.gstin ? validateGstin(customer.gstin) : null;
  const overdue = balance ? Number(balance.overdue) > 0 : false;
  const addr = customer?.address ? [customer.address.line1, customer.address.line2, customer.address.city, customer.address.pincode].filter(Boolean).join(", ") : "";
  const intra = tax ? dec(tax.igst).isZero() : true;

  return (
    <form onSubmit={submit} onKeyDown={onKey} data-density="compact" className="flex flex-col gap-2 lg:min-h-0 lg:flex-1">
      <p className="text-xs text-muted">For tile products, enter quantities in boxes and rates per box. The selected product unit is used for stock and billing; tile dimensions do not change quantities.</p>
      <div className="flex min-h-0 flex-col rounded-lg border border-border bg-surface shadow-[0_1px_3px_0_rgb(15_23_42/0.06)] lg:flex-1">
        {/* Header strip: what this is, its number, the dates, the place of supply and the rate basis. */}
        <div className="grid shrink-0 grid-cols-2 items-end gap-x-3 gap-y-2 border-b border-border bg-surface-3 px-3 py-2 md:grid-cols-4 xl:grid-cols-[1.1fr_1fr_1fr_1.4fr_1fr_auto_auto]">
          <div>
            <p className="text-sm leading-5 font-semibold">{t(`sales.voucher.${mode}`)}</p>
            <p className="font-mono text-xs leading-4 text-muted" title={info ? t("sales.numberMayChange") : undefined}>{info?.number ?? t("sales.numberOnSave")}</p>
          </div>
          <Field label={t("common.date")} htmlFor="s-date"><DateField id="s-date" value={date} onValueChange={setDate} today={workDate} /></Field>
          {mode === "invoice" ? (
            <Field label={t("sales.invoices.dueOn")} htmlFor="s-due"><DateField id="s-due" value={dueOn} onValueChange={setDueOn} today={workDate} placeholder={customer?.creditDays ? `+${customer.creditDays}` : ""} /></Field>
          ) : quoteLike ? (
            <Field label={t("sales.quotations.validUntil")} htmlFor="s-valid"><DateField id="s-valid" value={validUntil} onValueChange={setValidUntil} today={workDate} /></Field>
          ) : <div />}
          <Field label={t("sales.placeOfSupply")} htmlFor="s-pos">
            <Select id="s-pos" value={placeOfSupply} onChange={(e) => setPos(e.target.value)} disabled={exportSale}>
              {GST_STATES.filter((s) => s.code !== "96").map((s) => <option key={s.code} value={s.code}>{stateName(s.code)}</option>)}
              {exportSale ? <option value="96">{stateName("96")}</option> : null}
            </Select>
          </Field>
          <Field label={t("sales.rateBasis")} htmlFor="s-basis">
            <Select id="s-basis" value={basis} onChange={(e) => {
              const next = e.target.value as "wholesale" | "mrp";
              setBasis(next);
              // Re-price the lines already on the bill: the item's MRP, or back to its list or sale rate.
              setLines((ls) => ls.map((l) => {
                const it = byId.get(l.itemId) as (ItemOption & { saleRate?: string }) | undefined;
                if (!it) return l;
                const wholesale = listRates[l.itemId] || (it.saleRate && Number(it.saleRate) ? String(Number(it.saleRate)) : "");
                return { ...l, rate: next === "mrp" && it.mrp ? String(Number(it.mrp)) : wholesale };
              }));
            }}>
              <option value="wholesale">{t("sales.basisWholesale")}</option>
              <option value="mrp">{t("sales.basisMrp")}</option>
            </Select>
          </Field>
          <div className="flex items-center gap-3 pb-2 text-sm">
            <label className="flex cursor-pointer items-center gap-1.5"><input type="checkbox" checked={exportSale} onChange={(e) => { setExportSale(e.target.checked); if (e.target.checked) setSez(false); }} className="size-4 accent-[var(--primary)]" />{t("sales.export")}</label>
            <label className="flex cursor-pointer items-center gap-1.5"><input type="checkbox" checked={sez} onChange={(e) => { setSez(e.target.checked); if (e.target.checked) setExportSale(false); }} className="size-4 accent-[var(--primary)]" />{t("sales.sez")}</label>
            {exportSale || sez ? <label className="flex cursor-pointer items-center gap-1.5"><input type="checkbox" checked={lut} onChange={(e) => setLut(e.target.checked)} className="size-4 accent-[var(--primary)]" />{t("sales.lut")}</label> : null}
          </div>
          {showDrawer ? (
            <Button type="button" variant="outline" size="sm" onClick={() => setDrawer(true)} className="self-end">
              <SlidersHorizontal className="size-4" aria-hidden />{t("sales.dispatchTerms")}<kbd>F12</kbd>
              {setCount ? <span className="rounded-full bg-primary-soft px-1.5 text-xs font-semibold text-primary">{t("sales.nSet", { count: setCount })}</span> : null}
            </Button>
          ) : <div />}
        </div>

        {/* Party block: the customer, what they owe, their address and where the goods go. */}
        <div className="grid shrink-0 grid-cols-1 gap-x-4 gap-y-2 border-b border-border px-3 py-2 md:grid-cols-[minmax(16rem,1.2fr)_1.4fr_1.2fr]">
          <Field label={t("sales.customer")} htmlFor="s-customer">
            {mode === "invoice" && !initial?.customerId ? (
              <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-muted">No customer selected = Walk-in Retail Customer</span>
                <button type="button" onClick={() => setNewCustomerOpen((open) => !open)} className="font-semibold text-primary hover:underline">
                  <Plus className="mr-1 inline size-3" />New customer
                </button>
              </div>
            ) : null}
            <Combobox id="s-customer" value={customerId} onValueChange={(v) => chooseCustomer(v)} options={customerOptions} placeholder={mode === "invoice" ? "Walk-in Retail Customer (optional)" : t("sales.chooseCustomer")} disabled={!!initial?.customerId}
              labels={{ empty: t("common.nothingFound"), clear: t("common.clear") }} />
            {mode === "invoice" && newCustomerOpen ? (
              <div className="mt-2 rounded-lg border border-border bg-surface-2 p-3">
                <p className="mb-2 text-sm font-semibold">Create customer during billing</p>
                <div className="grid gap-2">
                  <Input value={newCustomerName} onChange={(e) => setNewCustomerName(e.target.value)} placeholder="Customer name *" aria-label="Customer name" maxLength={120} />
                  <Input value={newCustomerPhone} onChange={(e) => setNewCustomerPhone(e.target.value)} placeholder="Mobile number (optional)" aria-label="Customer mobile" maxLength={15} />
                  <Input value={newCustomerGstin} onChange={(e) => setNewCustomerGstin(e.target.value)} placeholder="GSTIN (optional)" aria-label="Customer GSTIN" maxLength={15} />
                  <Select aria-label="Customer state" value={newCustomerState} onChange={(e) => setNewCustomerState(e.target.value)}>
                    <option value="">Use default state</option>
                    {GST_STATES.map((state) => <option key={state.code} value={state.code}>{state.name}</option>)}
                  </Select>
                  {customerError ? <p role="alert" className="text-xs text-danger">{customerError}</p> : null}
                  {!canCreateCustomer ? <p className="text-xs text-muted">Customer creation needs Accounts access.</p> : null}
                  <div className="flex gap-2">
                    <Button type="button" size="sm" disabled={customerSaving || !debtorGroupId || !newCustomerName.trim()} onClick={() => void createCustomer()}> {customerSaving ? "Saving..." : "Save customer"}</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => setNewCustomerOpen(false)}>Cancel</Button>
                  </div>
                </div>
              </div>
            ) : null}
          </Field>
          <div className="min-w-0 self-end pb-0.5 text-sm">
            {customer ? (
              <>
                <div className="mb-1 flex flex-wrap items-center gap-1.5">
                  {balance ? (
                    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold tabular-nums",
                      overdue ? "border-danger/30 bg-danger-soft text-danger" : "border-border bg-surface-2 text-text-secondary")}>
                      {overdue ? <AlertCircle className="size-3" aria-hidden /> : null}
                      {Number(balance.balance) > 0 ? t("sales.owes", { amount: rupees(balance.balance) }) : t("sales.nothingDue")}
                      {overdue ? ` · ${t("sales.overdueAmount", { amount: rupees(balance.overdue) })}` : ""}
                    </span>
                  ) : null}
                  {customer.gstin ? (
                    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold", gstin?.valid ? "border-success/30 bg-success-soft text-success" : "border-danger/30 bg-danger-soft text-danger")}>
                      {gstin?.valid ? <CheckCircle2 className="size-3" aria-hidden /> : <AlertCircle className="size-3" aria-hidden />}{customer.gstin}
                    </span>
                  ) : <span className="text-xs text-muted">{t("sales.unregistered")}</span>}
                </div>
                <p className="truncate text-[13px] leading-[18px] text-muted" title={addr}>{addr || t("sales.noAddress")}</p>
              </>
            ) : <p className="text-[13px] text-muted">{t("sales.pickCustomer")}</p>}
          </div>
          <div className="self-end text-sm">
            <label className="flex cursor-pointer items-center gap-2 pb-1"><input type="checkbox" checked={ship} onChange={(e) => setShip(e.target.checked)} className="size-4 accent-[var(--primary)]" />{t("sales.shipElsewhere")}</label>
            {ship ? (
              <div className="grid grid-cols-[1fr_6rem_5.5rem] gap-1.5">
                <Input value={shipLine} onChange={(e) => setShipLine(e.target.value)} placeholder={t("sales.shipLine")} aria-label={t("sales.shipLine")} maxLength={200} />
                <Input value={shipCity} onChange={(e) => setShipCity(e.target.value)} placeholder={t("sales.shipCity")} aria-label={t("sales.shipCity")} maxLength={100} />
                <Input value={shipPin} onChange={(e) => setShipPin(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder={t("sales.shipPin")} aria-label={t("sales.shipPin")} inputMode="numeric" />
              </div>
            ) : <p className="text-[13px] text-muted">{t("sales.shipSame")}</p>}
          </div>
        </div>
        {mode === "proforma" ? (
          <div className="flex shrink-0 items-end gap-3 border-b border-border px-3 py-2">
            <Field label={t("sales.proformas.advanceDue")} htmlFor="s-adv" hint={t("sales.proformas.advanceHint")}><MoneyField id="s-adv" value={advanceDue} onValueChange={setAdvanceDue} className="w-40" /></Field>
          </div>
        ) : null}

        {/* The ruled line grid. */}
        <div className="relative min-h-0 overflow-auto px-3 pt-2 lg:flex-1">
          <table ref={grid} data-grid data-no-stack suppressHydrationWarning onKeyDown={gridKey} className="w-full border-collapse text-sm max-lg:block lg:min-w-[980px]">
            <thead className="sticky top-0 z-10 max-lg:hidden">
              <tr>
                <th className={cn(th, "w-10 text-center")}>#</th>
                <th className={cn(th, "text-left")}>{t("purchase.item")}</th>
                <th className={cn(th, "w-24 text-left")}>{t("sales.colHsn")}</th>
                <th className={cn(th, "w-24 text-right")}>{t("purchase.qty")}</th>
                <th className={cn(th, "w-20 text-left")}>{t("sales.colUnit")}</th>
                <th className={cn(th, "w-28 text-right")}>{t("purchase.rate")}</th>
                <th className={cn(th, "w-20 text-right")}>{t("sales.colDiscPct")}</th>
                <th className={cn(th, "w-32 text-right")}>{t("sales.colTaxable")}</th>
                <th className={cn(th, "w-24 text-left")}>{t("purchase.gst")}</th>
                <th className={cn(th, "w-32 text-right")}>{t("purchase.amount")}</th>
                <th className="w-9" />
              </tr>
            </thead>
            <tbody className="max-lg:block">
              {lines.map((l, i) => {
                const item = byId.get(l.itemId);
                const lineTax = tax?.lines[valid.indexOf(l)];
                return (
                  <tr key={l.key} data-key={l.key} suppressHydrationWarning className={cn("hover:bg-surface-3 max-lg:mb-3 max-lg:grid max-lg:grid-cols-2 max-lg:gap-x-2 max-lg:gap-y-1 max-lg:rounded-lg max-lg:border max-lg:border-border max-lg:p-2", fresh === l.key && "animate-row-enter motion-reduce:animate-none")}>
                    <td className={cn(td, "text-center text-xs text-muted tabular-nums max-lg:hidden")}>{i + 1}</td>
                    <td className={cn(td, "max-lg:col-span-2")} data-label={t("purchase.item")}>
                      <Combobox value={l.itemId} disabled={l.locked} aria-label={`${t("purchase.item")} ${i + 1}`} options={itemOptions} placeholder={t("purchase.chooseItem")} className={cellInput}
                        labels={{ empty: t("common.nothingFound"), clear: t("common.clear") }}
                        onValueChange={(v) => {
                          const it = byId.get(v) as (ItemOption & { saleRate?: string }) | undefined;
                          update(l.key, { itemId: v, rate: l.rate || (basis === "mrp" && it?.mrp ? String(Number(it.mrp)) : "") || listRates[v] || (it?.saleRate && Number(it.saleRate) ? String(Number(it.saleRate)) : ""), gstRate: undefined, per: undefined });
                          // After an item is chosen the next stop is its quantity.
                          if (v) wantFocus.current = { key: l.key, nth: 1 };
                        }} />
                    </td>
                    <td className={cn(td, "px-2 font-mono text-xs text-muted max-lg:hidden")}>{item?.hsn ?? ""}</td>
                    <td className={td} data-label={t("purchase.qty")}><NumberField value={l.qty} onValueChange={(v) => update(l.key, { qty: v })} decimals={4} aria-label={t("purchase.qty")} aria-invalid={!!l.qty && !QTY.test(l.qty)} className={cellInput} /></td>
                    <td className={cn(td, "px-2 text-xs text-muted max-lg:hidden")}>
                      {item?.units?.length ? (
                        <select value={l.per?.code ?? ""} onChange={(e) => { const u = item.units!.find((x) => x.code === e.target.value); update(l.key, { per: u ? { code: u.code, factor: u.factor } : undefined }); }}
                          data-enter-skip className="h-9 w-full bg-transparent text-xs" aria-label={t("items.uom")}>
                          <option value="">{item.uom}</option>
                          {item.units.map((u) => <option key={u.code} value={u.code}>{u.code} ({Number(u.factor)} {item.uom})</option>)}
                        </select>
                      ) : item?.uom ?? ""}
                    </td>
                    <td className={td} data-label={t("purchase.rate")}><MoneyField value={l.rate} onValueChange={(v) => update(l.key, { rate: v })} currency={false} aria-label={t("purchase.rate")} className={cellInput} /></td>
                    <td className={td} data-label={t("sales.colDiscPct")}><NumberField value={discShown(l)} onValueChange={(v) => update(l.key, { discPct: v })} decimals={2} aria-label={t("sales.colDiscPct")} className={cellInput} /></td>
                    <td className={cn(td, "px-2 text-right tabular-nums max-lg:hidden")}>{lineTax ? rupees(lineTax.taxableValue) : ""}</td>
                    <td className={td} data-label={t("purchase.gst")}>
                      <Select value={String(Number(gstOf(l)))} onChange={(e) => update(l.key, { gstRate: e.target.value })} aria-label={t("purchase.gst")} className={cn(cellInput, "pr-6")}>
                        {GST_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
                      </Select>
                    </td>
                    <td className={cn(td, "px-2 text-right font-medium tabular-nums max-lg:text-left")} data-label={t("purchase.amount")}>{lineTax ? rupees(lineTax.total) : ""}</td>
                    <td className="text-center max-lg:col-span-2 max-lg:text-right">
                      {lines.length > 1 ? (
                        <button type="button" onClick={() => removeLine(l.key)} className="grid size-8 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-danger" title={`${t("common.remove")} (Ctrl+Del)`}>
                          <Trash2 className="size-4" aria-hidden /><span className="sr-only">{t("common.remove")}</span>
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-1 border-t border-border px-2 py-1">
          <Button type="button" variant="ghost" size="sm" onClick={() => addLine(true)}><Plus className="size-4" aria-hidden />{t("vouchers.addLine")}<kbd>F3</kbd></Button>
          <ImportLinesButton items={items} onAdd={(add) => setLines((ls) => [...ls.filter((x) => x.itemId), ...add.map((a) => {
            const it = byId.get(a.itemId);
            const rate = a.rate ?? ((basis === "mrp" && it?.mrp ? String(Number(it.mrp)) : "") || listRates[a.itemId] || (it?.saleRate && Number(it.saleRate) ? String(Number(it.saleRate)) : ""));
            return { key: nextKey++, itemId: a.itemId, qty: a.qty, rate };
          })])} />
          <StyleGridPicker kind="sale" onAdd={(add) => setLines((ls) => [...ls.filter((x) => x.itemId), ...add.map((a) => ({ ...a, key: nextKey++ }))])} />
        </div>

        {/* Footer: the narration on the left, the totals on the right. */}
        <div className="grid shrink-0 gap-x-6 gap-y-2 border-t border-border bg-surface-3 px-3 py-2 md:grid-cols-[1fr_auto]">
          <div className="min-w-0">
            <label htmlFor="s-narr" className="flex items-baseline justify-between text-sm leading-5 font-medium text-text-secondary">{t("common.narration")}<span className="text-xs font-normal text-muted tabular-nums">{t("sales.narrationCount", { n: narration.length })}</span></label>
            <Input id="s-narr" value={narration} onChange={(e) => setNarration(e.target.value)} maxLength={300} className="mt-1" />
            {mode === "invoice" && (info?.bankDetails || info?.terms) ? (
              <dl className="mt-1.5 grid gap-x-4 gap-y-0.5 text-xs text-muted md:grid-cols-2">
                {info.bankDetails ? <div><dt className="font-medium text-text-secondary">{t("print.bank")}</dt><dd className="whitespace-pre-line">{info.bankDetails}</dd></div> : null}
                {info.terms ? <div><dt className="font-medium text-text-secondary">{t("print.terms")}</dt><dd className="line-clamp-3 whitespace-pre-line" title={info.terms}>{info.terms}</dd></div> : null}
              </dl>
            ) : null}
          </div>
          {tax ? (
            <div className="flex flex-col items-end">
              <dl className="flex flex-wrap items-baseline justify-end gap-x-5 gap-y-0.5 text-sm">
                <div className="flex items-baseline gap-1.5"><dt className="text-muted">{t("purchase.taxable")}</dt><dd className="tabular-nums"><Ticker v={rupees(tax.taxableValue)} /></dd></div>
                {(intra ? ["cgst", "sgst", "utgst", "cess"] : ["igst", "cess"] as const).filter((k) => !dec(tax[k as "cgst"]).isZero()).map((k) => (
                  <div key={k} className="flex items-baseline gap-1.5"><dt className="text-muted">{t(`calc.${k}`)}</dt><dd className="tabular-nums"><Ticker v={rupees(tax[k as "cgst"])} /></dd></div>
                ))}
                {!dec(tax.roundOff).isZero() ? <div className="flex items-baseline gap-1.5"><dt className="text-muted">{t("calc.roundOff")}</dt><dd className="tabular-nums">{rupees(tax.roundOff)}</dd></div> : null}
              </dl>
              <p className="flex items-baseline gap-2"><span className="text-sm font-semibold text-text-secondary">{t("purchase.total")}</span><span className="text-[1.75rem] leading-9 font-bold tabular-nums"><Ticker v={rupees(tax.grandTotal)} /></span></p>
              <p className="text-xs text-muted">{amountInWords(tax.grandTotal, wordsLang(locale))}</p>
            </div>
          ) : <div />}
        </div>
      </div>

      {error ? (
        <Alert>
          {error}
          {blocked ? <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => void send(true, "view")} className="ml-3">{t("sales.overrideCredit")}</Button> : null}
        </Alert>
      ) : null}

      {/* Sticky action bar. */}
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 max-lg:sticky max-lg:bottom-[calc(3.5rem+env(safe-area-inset-bottom))] max-lg:z-30 max-lg:-mx-4 max-lg:border-t max-lg:border-border-strong max-lg:bg-surface max-lg:px-4 max-lg:py-2.5">
        <Button type="button" variant="ghost" onClick={cancel}>{t("common.cancel")}<kbd>Esc</kbd></Button>
        {mode === "invoice" ? <Button type="button" variant="outline" disabled={busy || (mode !== "invoice" && !customerId) || !valid.length} onClick={() => void send(false, "print")}>{t("sales.saveAndPrint")}<kbd>Ctrl+P</kbd></Button> : null}
        {mode === "invoice" ? <Button type="button" variant="outline" disabled={busy || (mode !== "invoice" && !customerId) || !valid.length} onClick={() => void send(false, "new")}>{t("sales.saveAndNew")}<kbd>Ctrl+Enter</kbd></Button> : null}
        <Button type="submit" loading={busy} disabled={(mode !== "invoice" && !customerId) || !valid.length}>{mode === "quotation" ? t("sales.quotations.save") : mode === "proforma" ? t("sales.proformas.save") : mode === "order" ? t("sales.orders.new") : t("sales.invoices.post")}<kbd>Ctrl+S</kbd></Button>
      </div>

      {drawer ? (
        <Drawer title={t("sales.dispatchTerms")} subtitle={setCount ? t("sales.nSet", { count: setCount }) : undefined} onClose={() => setDrawer(false)}>
          <div className="flex flex-col gap-6">
            {people ? (
              <section className="flex flex-col gap-3" aria-label={t("sales.drawerTeam")}>
                <h3 className="text-sm font-semibold">{t("sales.drawerTeam")}</h3>
                <Field label={t("agents.agent")} htmlFor="d-agent">
                  <Select id="d-agent" value={agentId} onChange={(e) => { setAgentId(e.target.value); setAgentPct(""); }}>
                    <option value="">{t("agents.noAgent")}</option>
                    {agents.filter((a) => !a.archived || a.id === agentId).map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </Select>
                </Field>
                {agentId ? (
                  <Field label={t("agents.commissionPct")} htmlFor="d-agent-pct">
                    <NumberField id="d-agent-pct" value={agentPct} onValueChange={setAgentPct} decimals={2} maxLength={5}
                      placeholder={(() => { const a = agents.find((x) => x.id === agentId); return a?.commissionPct ? String(Number(a.commissionPct)) : "0"; })()} />
                  </Field>
                ) : null}
                <Field label={t("agents.salesman")} htmlFor="d-salesman">
                  <Select id="d-salesman" value={salesmanId} onChange={(e) => setSalesmanId(e.target.value)}>
                    <option value="">{t("agents.noSalesman")}</option>
                    {salesmen.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </Select>
                </Field>
              </section>
            ) : null}
            {mode === "invoice" ? (
              <>
                <section className="flex flex-col gap-3" aria-label={t("sales.drawerDispatch")}>
                  <h3 className="text-sm font-semibold">{t("sales.drawerDispatch")}</h3>
                  <Field label={t("sales.transporter")} htmlFor="d-tr"><Input id="d-tr" value={transporter} onChange={(e) => setTransporter(e.target.value)} maxLength={80} /></Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={t("sales.vehicleNo")} htmlFor="d-veh"><Input id="d-veh" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value.toUpperCase())} maxLength={15} /></Field>
                    <Field label={t("sales.ewbNo")} htmlFor="d-ewb" hint={t("sales.ewbHint")}><Input id="d-ewb" value={ewbNo} onChange={(e) => setEwbNo(e.target.value.replace(/\D/g, "").slice(0, 12))} inputMode="numeric" aria-invalid={!!ewbNo && ewbNo.length !== 12} /></Field>
                    <Field label={t("sales.lrNumber")} htmlFor="d-lr"><Input id="d-lr" value={lrNumber} onChange={(e) => setLrNumber(e.target.value)} maxLength={30} /></Field>
                    <Field label={t("sales.lrDate")} htmlFor="d-lrd"><DateField id="d-lrd" value={lrDate} onValueChange={setLrDate} today={workDate} /></Field>
                    <Field label={t("sales.cartons")} htmlFor="d-cartons"><NumberField id="d-cartons" value={cartons} onValueChange={setCartons} maxLength={6} /></Field>
                    <Field label={t("sales.dispatchFrom")} htmlFor="d-wh">
                      <Select id="d-wh" value={dispatchWh} onChange={(e) => setDispatchWh(e.target.value)}>
                        <option value="">{t("sales.defaultGodown")}{defaultWh ? ` (${warehouses.find((w) => w.id === defaultWh)?.name ?? ""})` : ""}</option>
                        {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                      </Select>
                    </Field>
                  </div>
                </section>
                <section className="flex flex-col gap-3" aria-label={t("sales.drawerTerms")}>
                  <h3 className="text-sm font-semibold">{t("sales.drawerTerms")}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={t("sales.specialDiscount")} htmlFor="d-spec" hint={t("sales.billDiscountHint")}><NumberField id="d-spec" value={special} onValueChange={setSpecial} decimals={2} maxLength={5} /></Field>
                    <Field label={t("sales.cashDiscount")} htmlFor="d-cash"><NumberField id="d-cash" value={cash} onValueChange={setCash} decimals={2} maxLength={5} /></Field>
                  </div>
                  <Field label={t("sales.earlyPay")} htmlFor="d-early" hint={t("sales.earlyPayHint")}>
                    <span className="flex items-center gap-2">
                      <NumberField id="d-early" value={earlyPct} onValueChange={setEarlyPct} decimals={2} maxLength={5} className="w-24" aria-label={t("sales.earlyPayPct")} /><span className="text-sm text-muted">%</span>
                      <NumberField value={earlyDays} onValueChange={setEarlyDays} maxLength={3} className="w-20" aria-label={t("sales.earlyPayDays")} /><span className="text-sm text-muted">{t("sales.days")}</span>
                    </span>
                  </Field>
                </section>
              </>
            ) : null}
            <div className="flex justify-end"><Button type="button" onClick={() => setDrawer(false)}>{t("sales.drawerDone")}</Button></div>
          </div>
        </Drawer>
      ) : null}
    </form>
  );
}
