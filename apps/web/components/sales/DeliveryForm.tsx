"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { localName, todayIso } from "@/lib/format";
import type { CustomerOption, ItemOption, WarehouseOption } from "@/lib/masters";
import { Alert, Button, Card, Field, Input, Select } from "../ui";
import { useWorkDate } from "@/components/WorkingDate";
import { voucherKeys } from "@/lib/voucher-keys";

export interface DeliveryDraftLine { itemId: string; qty: string; orderLineId?: string; deliveryOrderLineId?: string; maxQty?: string }
interface Line extends DeliveryDraftLine { key: number; batchNo: string; rate?: string }
let nextKey = 1;

export const CHALLAN_REASONS = ["supply", "approval", "job_work", "not_supply", "lots", "exhibition", "sample", "other"] as const;
const RATE = /^\d+(\.\d{1,4})?$/;

/**
 * Delivery challan (Rule 55): goods leave the warehouse without a tax invoice, for the reason chosen.
 * Each line carries its value (the item's sale rate unless changed), which the printed challan must show.
 */
/** On a phone each line is a card: the item takes the full width and the figures sit two to a row, each under its own label (the labels come from data-label). */
const M = "max-lg:block max-lg:py-0 max-lg:pr-0 max-lg:before:mb-1 max-lg:before:block max-lg:before:text-xs max-lg:before:text-muted max-lg:before:content-[attr(data-label)]";

export function DeliveryForm({ customers, items, warehouses, initial, reason: initialReason }: {
  customers: CustomerOption[]; items: ItemOption[]; warehouses: WarehouseOption[];
  initial?: { customerId: string; orderId?: string; orderNumber: string; fromDeliveryOrder?: boolean; lines: DeliveryDraftLine[] };
  reason?: string | undefined;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [customerId, setCustomerId] = useState(initial?.customerId ?? "");
  const [warehouseId, setWarehouseId] = useState(warehouses.find((w) => w.isDefault)?.id ?? warehouses[0]?.id ?? "");
  const workDate = useWorkDate();
  const [date, setDate] = useState(workDate);
  const [reason, setReason] = useState<string>(CHALLAN_REASONS.find((r) => r === initialReason) ?? "supply");
  const [transporter, setTransporter] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [lines, setLines] = useState<Line[]>(() => (initial?.lines.length ? initial.lines : [{ itemId: "", qty: "" }]).map((l) => ({ ...l, key: nextKey++, batchNo: "" })));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const update = (key: number, patch: Partial<Line>) => setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  const goods = items.filter((i) => i.kind === "goods" && !i.archived).sort((a, b) => localName(a, locale).localeCompare(localName(b, locale)));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ id: string }>("/delivery-notes", {
        body: {
          customerId, orderId: initial?.orderId, warehouseId, date, reason, transporter: transporter || undefined, vehicleNo: vehicleNo || undefined,
          lines: lines.filter((l) => l.itemId && Number(l.qty) > 0).map((l) => ({
            itemId: l.itemId, qty: l.qty, ...(l.orderLineId ? { orderLineId: l.orderLineId } : {}), ...(l.deliveryOrderLineId ? { deliveryOrderLineId: l.deliveryOrderLineId } : {}), ...(l.batchNo ? { batchNo: l.batchNo } : {}), ...(l.rate && RATE.test(l.rate) ? { rate: l.rate } : {}),
          })),
        },
      });
      router.push(`/sales/deliveries/${r.id}`);
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "generic";
      const key = [`sales.errors.${code}`, `sj.errors.${code}`, `vouchers.errors.${code}`].find((k) => t.has(k));
      setError(key ? t(key) : t("auth.errors.generic"));
      setBusy(false);
    }
  }

  return (
    <form onKeyDown={voucherKeys} onSubmit={submit} data-density="compact" className="flex flex-col gap-3 lg:min-h-0 lg:flex-1">
      <Card className="p-3 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
        {initial ? <p className="mb-4 text-sm text-muted">{t(initial.fromDeliveryOrder ? "deliveryOrders.fromDeliveryOrder" : "sales.deliveries.fromOrder", { number: initial.orderNumber })}</p> : null}
        <div className="grid gap-4 md:grid-cols-3">
          <Field label={t("sales.customer")} htmlFor="d-cust">
            <Select id="d-cust" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required disabled={!!initial}>
              <option value="">{t("sales.chooseCustomer")}</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{localName(c, locale)}</option>)}
            </Select>
          </Field>
          <Field label={t("stock.warehouse")} htmlFor="d-wh">
            <Select id="d-wh" value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)}>{warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</Select>
          </Field>
          <Field label={t("common.date")} htmlFor="d-date"><Input id="d-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
          <Field label={t("sales.deliveries.reason")} htmlFor="d-reason" hint={t(`sales.deliveries.reasonHints.${reason}`)}>
            <Select id="d-reason" value={reason} onChange={(e) => setReason(e.target.value)} disabled={!!initial}>
              {CHALLAN_REASONS.map((r) => <option key={r} value={r}>{t(`sales.deliveries.reasons.${r}`)}</option>)}
            </Select>
          </Field>
          <Field label={t("sales.deliveries.transporter")} htmlFor="d-tr"><Input id="d-tr" value={transporter} onChange={(e) => setTransporter(e.target.value)} maxLength={80} /></Field>
          <Field label={t("sales.deliveries.vehicleNo")} htmlFor="d-veh"><Input id="d-veh" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value.toUpperCase())} maxLength={16} className="font-mono" /></Field>
        </div>
        <div className="relative mt-2 min-h-0 overflow-auto lg:flex-1">
          <table data-grid data-voucher className="w-full text-sm max-lg:block lg:min-w-[640px]">
            <thead className="sticky top-0 z-10 bg-surface text-left text-muted max-lg:hidden">
              <tr className="border-b border-border">
                <th className="py-1 pr-3 font-medium">{t("purchase.item")}</th>
                <th className="w-36 py-1 pr-3 text-right font-medium">{t("purchase.qty")}</th>
                <th className="w-36 py-1 pr-3 text-right font-medium">{t("purchase.rate")}</th>
                <th className="w-40 py-1 pr-3 font-medium">{t("sj.batch")}</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="max-lg:block">
              {lines.map((l, i) => {
                const item = items.find((x) => x.id === l.itemId);
                return (
                  <tr key={l.key} className="border-b border-border max-lg:mb-3 max-lg:grid max-lg:grid-cols-2 max-lg:gap-x-3 max-lg:gap-y-2 max-lg:rounded-lg max-lg:border max-lg:p-3">
                    <td data-label={t("purchase.item")} className={`py-1 pr-3 max-lg:col-span-2 ${M}`}>
                      <Select value={l.itemId} disabled={!!l.orderLineId} onChange={(e) => update(l.key, { itemId: e.target.value })} aria-label={`${t("purchase.item")} ${i + 1}`}>
                        <option value="">{t("purchase.chooseItem")}</option>
                        {goods.map((it) => <option key={it.id} value={it.id}>{localName(it, locale)} ({Number(it.stockQty).toLocaleString("en-IN")} {it.uom})</option>)}
                      </Select>
                    </td>
                    <td data-label={t("purchase.qty")} className={`py-1 pr-3 ${M}`}>
                      <Input value={l.qty} onChange={(e) => update(l.key, { qty: e.target.value })} inputMode="decimal" className="num text-right" aria-label={t("purchase.qty")} />
                      {l.maxQty ? <span className="block pt-0.5 text-right text-xs text-muted">≤ {Number(l.maxQty).toLocaleString("en-IN")} {item?.uom}</span> : null}
                    </td>
                    <td data-label={t("purchase.rate")} className={`py-1 pr-3 ${M}`}>
                      <Input value={l.rate ?? ""} onChange={(e) => update(l.key, { rate: e.target.value })} inputMode="decimal" className="num text-right" placeholder={item?.saleRate ? String(Number(item.saleRate)) : ""} aria-label={t("purchase.rate")} />
                    </td>
                    <td data-label={t("sj.batch")} className={`py-1 pr-3 ${M}`}><Input value={l.batchNo} onChange={(e) => update(l.key, { batchNo: e.target.value })} maxLength={40} required={item?.trackBatches} aria-label={t("sj.batch")} /></td>
                    <td className="py-2 text-right max-lg:col-span-2 max-lg:flex max-lg:justify-end max-lg:py-0">
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
        {!initial ? <Button type="button" variant="ghost" onClick={() => setLines((ls) => [...ls, { key: nextKey++, itemId: "", qty: "", batchNo: "" }])} className="-ml-3 mt-2"><Plus className="size-4" aria-hidden />{t("vouchers.addLine")}</Button> : null}
      </Card>
      {error ? <Alert>{error}</Alert> : null}
      <div className="flex shrink-0 gap-3">
        <Button type="submit" disabled={busy || !customerId}>{t("sales.deliveries.new")}<kbd>Ctrl+S</kbd></Button>
        <Button type="button" variant="ghost" data-cancel onClick={() => router.back()}>{t("common.cancel")}<kbd>Esc</kbd></Button>
      </div>
    </form>
  );
}
