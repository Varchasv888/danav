"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { GST_RATES, amountInWords, computeInvoiceTax, dec, lineGstRate, findState, wordsLang, devanagari } from "@varchasv/domain";
import { ApiError, api } from "@/lib/client-api";
import { localName, rupees, todayIso } from "@/lib/format";
import type { ItemOption, SupplierOption, WarehouseOption } from "@/lib/masters";
import { StyleGridPicker } from "../inventory/StyleGridPicker";
import { Alert, Button, Card, Field, Input, Select } from "../ui";
import { ReadBill, type ReadBillResult } from "./ReadBill";
import { useWorkDate } from "@/components/WorkingDate";
import { voucherKeys } from "@/lib/voucher-keys";

export interface DraftLine {
  itemId: string; qty: string; rate: string; discount?: string; gstRate?: string;
  /** Entered in another unit (a dozen = 12): quantity and rate are converted to the item's own unit. */
  per?: { code: string; factor: string };
  receiptLineId?: string; orderLineId?: string; warehouseId?: string; batchNo?: string;
  /** Linked to an order or receipt line: the item can't be changed, only quantity and price. */
  locked?: boolean;
}
interface Line extends DraftLine { key: number }
let nextKey = 1;

const QTY = /^\d+(\.\d{1,4})?$/;
const AMT = /^\d+(\.\d{1,4})?$/;

/** Purchase order or purchase bill, with a live GST preview using the same rules as the server. */
/** On a phone each line is a card: the item takes the full width and the figures sit two to a row, each under its own label (the labels come from data-label). */
const M = "max-lg:block max-lg:py-0 max-lg:pr-0 max-lg:before:mb-1 max-lg:before:block max-lg:before:text-xs max-lg:before:text-muted max-lg:before:content-[attr(data-label)]";

export function PurchaseForm({
  mode, suppliers, items, warehouses, homeState, initial,
}: {
  mode: "order" | "bill";
  suppliers: SupplierOption[];
  items: ItemOption[];
  warehouses: WarehouseOption[];
  homeState: string;
  initial?: { supplierId?: string; orderId?: string; lines?: DraftLine[]; reference?: string };
}) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [supplierId, setSupplierId] = useState(initial?.supplierId ?? "");
  const workDate = useWorkDate();
  const [date, setDate] = useState(workDate);
  const [expectedOn, setExpectedOn] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(todayIso());
  const [dueOn, setDueOn] = useState("");
  const [reverseCharge, setReverseCharge] = useState(false);
  const [narration, setNarration] = useState("");
  const [lines, setLines] = useState<Line[]>(() => (initial?.lines?.length ? initial.lines : [{ itemId: "", qty: "", rate: "" }]).map((l) => ({ ...l, key: nextKey++ })));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const supplier = suppliers.find((s) => s.id === supplierId);
  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const sortedItems = useMemo(() => [...items].filter((i) => !i.archived).sort((a, b) => localName(a, locale).localeCompare(localName(b, locale))), [items, locale]);
  const update = (key: number, patch: Partial<Line>) => setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)));

  const valid = lines.filter((l) => l.itemId && QTY.test(l.qty) && Number(l.qty) > 0 && AMT.test(l.rate) && (!l.discount || AMT.test(l.discount)));
  const eff = (l: Line) => (l.per && QTY.test(l.qty) && QTY.test(l.rate)
    ? { qty: dec(l.qty).times(l.per.factor).toString(), rate: dec(l.rate).div(l.per.factor).toDecimalPlaces(4).toString() }
    : { qty: l.qty, rate: l.rate });
  // The rate shown is the one the server will use: the line's own if changed, else the item's, which for
  // apparel and footwear depends on the price per piece after discount.
  const gstOf = (l: Line) => {
    if (l.gstRate) return l.gstRate;
    const it = byId.get(l.itemId);
    if (!it) return "0";
    if (!QTY.test(l.qty) || !Number(l.qty) || !QTY.test(l.rate) || (l.discount && !QTY.test(l.discount))) return it.gstRate;
    return lineGstRate(it, { ...eff(l), discount: l.discount || "0" }, date);
  };
  const tax = useMemo(() => {
    try {
      return computeInvoiceTax(valid.map((l) => ({ ...eff(l), discount: l.discount || "0", gstRate: gstOf(l) })), {
        supplierState: supplier?.stateCode ?? homeState, placeOfSupply: homeState, reverseCharge: mode === "bill" && reverseCharge,
      });
    } catch {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(valid), supplier?.stateCode, homeState, reverseCharge, date]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const payloadLines = valid.map((l) => ({
      itemId: l.itemId, ...eff(l), ...(l.gstRate ? { gstRate: String(Number(l.gstRate)) } : {}),
      ...(l.discount ? { discount: l.discount } : {}),
      ...(mode === "bill" && l.receiptLineId ? { receiptLineId: l.receiptLineId } : {}),
      ...(mode === "bill" && l.orderLineId && !l.receiptLineId ? { orderLineId: l.orderLineId } : {}),
      ...(mode === "bill" && !l.receiptLineId && l.warehouseId ? { warehouseId: l.warehouseId } : {}),
      ...(mode === "bill" && l.batchNo ? { batchNo: l.batchNo } : {}),
    }));
    try {
      const doc = mode === "order"
        ? await api<{ id: string }>("/purchase-orders", { body: { supplierId, date, expectedOn: expectedOn || undefined, narration: narration || undefined, lines: payloadLines } })
        : await api<{ id: string; warnings: { code: string; lineNo?: number }[] }>("/purchase-bills", {
          body: {
            supplierId, date, supplierInvoiceNo: invoiceNo.trim(), supplierInvoiceDate: invoiceDate, dueOn: dueOn || undefined,
            reverseCharge, orderId: initial?.orderId, narration: narration || undefined, lines: payloadLines,
          },
        });
      router.push(`/purchase/${mode === "order" ? "orders" : "bills"}/${doc.id}?saved=1`);
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? (err.issues?.[0]?.message ?? err.code) : "generic";
      const key = [`purchase.errors.${code}`, `vouchers.errors.${code}`, `items.errors.${code}`].find((k) => t.has(k));
      setError(key ? t(key) : t("auth.errors.generic"));
      setBusy(false);
    }
  }

  const defaultWh = warehouses.find((w) => w.isDefault)?.id ?? warehouses[0]?.id;
  const supplyNote = supplier ? `${findState(supplier.stateCode ?? homeState)?.[devanagari(locale) ? "nameHi" : "name"] ?? ""} → ${findState(homeState)?.[devanagari(locale) ? "nameHi" : "name"] ?? ""}` : "";

  const applyRead = (r: ReadBillResult) => {
    if (r.supplierId) setSupplierId(r.supplierId);
    if (r.fields?.invoiceNo) setInvoiceNo(r.fields.invoiceNo.slice(0, 16));
    if (r.fields?.date) setInvoiceDate(r.fields.date);
    const read = r.lines.map((l) => ({
      itemId: l.itemId ?? "", qty: l.qty ?? "", rate: l.rate ?? "", ...(l.gstRate ? { gstRate: l.gstRate } : {}), key: nextKey++,
    }));
    if (read.length) setLines(read);
  };

  return (
    <form onKeyDown={voucherKeys} onSubmit={submit} data-density="compact" className="flex flex-col gap-3 lg:min-h-0 lg:flex-1">
      <p className="text-xs text-muted">For tile products, enter quantities in boxes and rates per box. The selected product unit is used for stock and billing; tile dimensions do not change quantities.</p>
      {mode === "bill" && !initial ? <ReadBill onRead={applyRead} /> : null}
      <Card className="p-3 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label={t("purchase.supplier")} htmlFor="p-supplier" hint={supplier?.gstin ?? supplyNote}>
            <Select id="p-supplier" value={supplierId} onChange={(e) => setSupplierId(e.target.value)} required disabled={!!initial?.supplierId}>
              <option value="">{t("purchase.chooseSupplier")}</option>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{localName(s, locale)}</option>)}
            </Select>
          </Field>
          {mode === "bill" ? (
            <>
              <Field label={t("purchase.bills.invoiceNo")} htmlFor="p-inv"><Input id="p-inv" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} required maxLength={16} className="font-mono" /></Field>
              <Field label={t("purchase.bills.invoiceDate")} htmlFor="p-invd"><Input id="p-invd" type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} required /></Field>
              <Field label={t("purchase.bills.postingDate")} htmlFor="p-date"><Input id="p-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
              <Field label={t("purchase.bills.dueOn")} htmlFor="p-due"><Input id="p-due" type="date" value={dueOn} onChange={(e) => setDueOn(e.target.value)} /></Field>
            </>
          ) : (
            <>
              <Field label={t("common.date")} htmlFor="p-date"><Input id="p-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
              <Field label={t("purchase.orders.expectedOn")} htmlFor="p-exp"><Input id="p-exp" type="date" value={expectedOn} onChange={(e) => setExpectedOn(e.target.value)} /></Field>
            </>
          )}
          <div className="md:col-span-2 xl:col-span-3"><Field label={t("common.narration")} htmlFor="p-narr"><Input id="p-narr" value={narration} onChange={(e) => setNarration(e.target.value)} maxLength={300} /></Field></div>
          {mode === "bill" ? (
            <label className="flex items-center gap-2 self-end pb-2 text-sm"><input type="checkbox" checked={reverseCharge} onChange={(e) => setReverseCharge(e.target.checked)} className="size-4 accent-[var(--primary)]" />{t("purchase.bills.reverseCharge")}</label>
          ) : null}
        </div>

        <div className="relative mt-2 min-h-0 overflow-auto lg:flex-1">
          <table data-grid data-voucher className="w-full text-sm max-lg:block lg:min-w-[900px]">
            <thead className="sticky top-0 z-10 bg-surface text-left text-muted max-lg:hidden">
              <tr className="border-b border-border">
                <th className="py-1 pr-3 font-medium">{t("purchase.item")}</th>
                <th className="w-28 py-1 pr-3 text-right font-medium">{t("purchase.qty")}</th>
                <th className="w-32 py-1 pr-3 text-right font-medium">{t("purchase.rate")}</th>
                <th className="w-28 py-1 pr-3 text-right font-medium">{t("purchase.discount")}</th>
                <th className="w-24 py-1 pr-3 font-medium">{t("purchase.gst")}</th>
                {mode === "bill" ? <th className="w-40 py-1 pr-3 font-medium">{t("stock.warehouse")}</th> : null}
                <th className="w-32 py-1 pr-3 text-right font-medium">{t("purchase.amount")}</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="max-lg:block">
              {lines.map((l, i) => {
                const item = byId.get(l.itemId);
                const lineTax = tax?.lines[valid.indexOf(l)];
                return (
                  <tr key={l.key} className="border-b border-border align-top max-lg:mb-3 max-lg:grid max-lg:grid-cols-2 max-lg:gap-x-3 max-lg:gap-y-2 max-lg:rounded-lg max-lg:border max-lg:p-3">
                    <td data-label={t("purchase.item")} className={`py-1 pr-3 max-lg:col-span-2 ${M}`}>
                      <Select value={l.itemId} disabled={l.locked} aria-label={`${t("purchase.item")} ${i + 1}`}
                        onChange={(e) => { const it = byId.get(e.target.value); update(l.key, { itemId: e.target.value, rate: l.rate || (it && Number(it.purchaseRate) ? String(Number(it.purchaseRate)) : ""), gstRate: undefined, per: undefined }); }}>
                        <option value="">{t("purchase.chooseItem")}</option>
                        {sortedItems.map((it) => <option key={it.id} value={it.id}>{localName(it, locale)}{it.hsn ? ` · ${it.hsn}` : ""}</option>)}
                      </Select>
                      {item?.trackBatches && mode === "bill" && !l.receiptLineId ? (
                        <Input value={l.batchNo ?? ""} onChange={(e) => update(l.key, { batchNo: e.target.value })} placeholder={t("sj.batch")} maxLength={40} className="mt-1 h-8" required />
                      ) : null}
                    </td>
                    <td data-label={t("purchase.qty")} className={`py-1 pr-3 ${M}`}><Input value={l.qty} onChange={(e) => update(l.key, { qty: e.target.value })} inputMode="decimal" className="num text-right" aria-label={t("purchase.qty")} aria-invalid={!!l.qty && !QTY.test(l.qty)} />{item?.units?.length ? (
                      <select value={l.per?.code ?? ""} onChange={(e) => { const u = item.units!.find((x) => x.code === e.target.value); update(l.key, { per: u ? { code: u.code, factor: u.factor } : undefined }); }}
                        className="mt-0.5 block w-full bg-transparent text-right text-xs text-muted" aria-label={t("items.uom")}>
                        <option value="">{item.uom}</option>
                        {item.units.map((u) => <option key={u.code} value={u.code}>{u.code} ({Number(u.factor)} {item.uom})</option>)}
                      </select>
                    ) : item ? <span className="block pt-0.5 text-right text-xs text-muted">{item.uom}</span> : null}</td>
                    <td data-label={t("purchase.rate")} className={`py-1 pr-3 ${M}`}><Input value={l.rate} onChange={(e) => update(l.key, { rate: e.target.value })} inputMode="decimal" className="num text-right" aria-label={t("purchase.rate")} aria-invalid={!!l.rate && !AMT.test(l.rate)} /></td>
                    <td data-label={t("purchase.discount")} className={`py-1 pr-3 ${M}`}><Input value={l.discount ?? ""} onChange={(e) => update(l.key, { discount: e.target.value })} inputMode="decimal" className="num text-right" aria-label={t("purchase.discount")} /></td>
                    <td data-label={t("purchase.gst")} className={`py-1 pr-3 ${M}`}>
                      <Select value={String(Number(gstOf(l)))} onChange={(e) => update(l.key, { gstRate: e.target.value })} aria-label={t("purchase.gst")}>
                        {GST_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
                      </Select>
                    </td>
                    {mode === "bill" ? (
                      <td data-label={t("stock.warehouse")} className={`py-1 pr-3 ${M}`}>
                        {item?.kind === "goods" && !l.receiptLineId ? (
                          <Select value={l.warehouseId ?? defaultWh} onChange={(e) => update(l.key, { warehouseId: e.target.value })} aria-label={t("stock.warehouse")}>
                            {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                          </Select>
                        ) : <span className="block pt-2 text-xs text-muted">{l.receiptLineId ? t("purchase.statuses.received") : "-"}</span>}
                      </td>
                    ) : null}
                    <td data-label={t("purchase.amount")} className={`num py-1 pr-3 pt-4 text-right max-lg:pt-0 max-lg:text-left ${M}`}>{lineTax ? rupees(lineTax.total) : ""}</td>
                    <td className="py-2 text-right max-lg:flex max-lg:items-end max-lg:justify-end max-lg:py-0">
                      {lines.length > 1 ? (
                        <button type="button" onClick={() => setLines((ls) => ls.filter((x) => x.key !== l.key))} className="grid size-9 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-danger max-lg:size-11" title={t("common.remove")}>
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
        <div className="-ml-3 flex flex-wrap items-start gap-1">
          <Button type="button" variant="ghost" onClick={() => setLines((ls) => [...ls, { key: nextKey++, itemId: "", qty: "", rate: "" }])} className="mt-2"><Plus className="size-4" aria-hidden />{t("vouchers.addLine")}</Button>
          <StyleGridPicker kind="purchase" onAdd={(add) => setLines((ls) => [...ls.filter((x) => x.itemId), ...add.map((a) => ({ ...a, key: nextKey++ }))])} />
        </div>

        {tax ? (
          <dl className="mt-2 ml-auto grid max-w-sm grid-cols-[1fr_auto] gap-x-6 gap-y-1 text-sm">
            <dt className="text-muted">{t("purchase.taxable")}</dt><dd className="num text-right">{rupees(tax.taxableValue)}</dd>
            {(["cgst", "sgst", "utgst", "igst", "cess"] as const).filter((k) => !dec(tax[k]).isZero()).map((k) => (
              <div key={k} className="contents"><dt className="text-muted">{t(`calc.${k}`)}{mode === "bill" && reverseCharge ? " · RCM" : ""}</dt><dd className="num text-right">{rupees(tax[k])}</dd></div>
            ))}
            {!dec(tax.roundOff).isZero() ? <><dt className="text-muted">{t("calc.roundOff")}</dt><dd className="num text-right">{rupees(tax.roundOff)}</dd></> : null}
            <dt className="border-t border-border pt-2 font-semibold">{t("purchase.total")}</dt><dd className="num border-t border-border pt-2 text-right font-semibold">{rupees(tax.grandTotal)}</dd>
            <dd className="col-span-2 text-xs text-muted">{amountInWords(tax.grandTotal, wordsLang(locale))}</dd>
          </dl>
        ) : null}
      </Card>
      {error ? <Alert>{error}</Alert> : null}
      <div className="sticky bottom-2 z-20 -mx-1 flex flex-wrap gap-3 rounded-xl border border-border bg-surface/95 p-2 shadow-overlay backdrop-blur-xl print:hidden max-lg:bottom-[calc(3.5rem+env(safe-area-inset-bottom))]">
        <Button type="submit" disabled={busy || !supplierId || !valid.length}>{mode === "order" ? t("purchase.orders.new") : t("purchase.bills.post")}<kbd>Ctrl+S</kbd></Button>
        <Button type="button" variant="ghost" data-cancel onClick={() => router.back()}>{t("common.cancel")}<kbd>Esc</kbd></Button>
      </div>
    </form>
  );
}
