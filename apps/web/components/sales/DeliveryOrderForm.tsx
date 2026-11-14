"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { localName, todayIso } from "@/lib/format";
import type { CustomerOption, ItemOption } from "@/lib/masters";
import { Alert, Button, Card, Field, Input, Select } from "../ui";
import { useWorkDate } from "@/components/WorkingDate";

interface Line { key: number; itemId: string; qty: string; orderLineId?: string; maxQty?: string }
let nextKey = 1;

/** A delivery order: pick the customer and the goods to send. From a sales order the lines are fixed to what is left to deliver. */
export function DeliveryOrderForm({ customers, items, initial }: {
  customers: CustomerOption[]; items: ItemOption[];
  initial?: { customerId: string; orderId: string; orderNumber: string; lines: { itemId: string; qty: string; maxQty: string; orderLineId: string }[] };
}) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [customerId, setCustomerId] = useState(initial?.customerId ?? "");
  const workDate = useWorkDate();
  const [date, setDate] = useState(workDate);
  const [deliverBy, setDeliverBy] = useState("");
  const [transporter, setTransporter] = useState("");
  const [narration, setNarration] = useState("");
  const [lines, setLines] = useState<Line[]>(() => (initial?.lines.length ? initial.lines : [{ itemId: "", qty: "" }]).map((l) => ({ ...l, key: nextKey++ })));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const update = (key: number, patch: Partial<Line>) => setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  const goods = items.filter((i) => i.kind === "goods" && !i.archived).sort((a, b) => localName(a, locale).localeCompare(localName(b, locale)));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ id: string }>("/delivery-orders", {
        body: {
          customerId, orderId: initial?.orderId, date, deliverBy: deliverBy || undefined, transporter: transporter || undefined, narration: narration || undefined,
          lines: lines.filter((l) => l.itemId && Number(l.qty) > 0).map((l) => ({ itemId: l.itemId, qty: l.qty, ...(l.orderLineId ? { orderLineId: l.orderLineId } : {}) })),
        },
      });
      router.push(`/sales/delivery-orders/${r.id}`);
      router.refresh();
    } catch (err) { setError(errorText(t, err, ["deliveryOrders.errors", "sales.errors", "sj.errors"])); } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} method="post" data-density="compact" className="flex flex-col gap-3 lg:min-h-0 lg:flex-1">
      {error ? <Alert>{error}</Alert> : null}
      <Card>
        {initial ? <p className="mb-4 text-sm text-muted">{t("deliveryOrders.fromOrder", { number: initial.orderNumber })}</p> : null}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label={t("sales.customer")} htmlFor="do-cust">
            <Select id="do-cust" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required disabled={!!initial}>
              <option value="">{t("sales.chooseCustomer")}</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{localName(c, locale)}</option>)}
            </Select>
          </Field>
          <Field label={t("common.date")} htmlFor="do-date"><Input id="do-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
          <Field label={t("deliveryOrders.deliverBy")} htmlFor="do-by"><Input id="do-by" type="date" value={deliverBy} onChange={(e) => setDeliverBy(e.target.value)} /></Field>
          <Field label={t("deliveryOrders.transporter")} htmlFor="do-tr"><Input id="do-tr" value={transporter} onChange={(e) => setTransporter(e.target.value)} maxLength={80} /></Field>
        </div>
      </Card>
      <Card className="relative p-0 lg:min-h-0 lg:flex-1 lg:overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-surface text-left text-muted"><tr className="border-b border-border"><th className="px-4 py-1 font-medium">{t("deliveryOrders.item")}</th><th className="w-32 px-4 py-1 text-right font-medium">{t("deliveryOrders.qty")}</th><th className="w-10" /></tr></thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.key} className="border-b border-border last:border-0">
                <td className="px-4 py-1">
                  <Select aria-label={t("deliveryOrders.item")} value={l.itemId} onChange={(e) => update(l.key, { itemId: e.target.value })} disabled={!!l.orderLineId}>
                    <option value="">{t("deliveryOrders.chooseItem")}</option>
                    {goods.map((i) => <option key={i.id} value={i.id}>{localName(i, locale)}</option>)}
                  </Select>
                </td>
                <td className="px-4 py-1">
                  <Input aria-label={t("deliveryOrders.qty")} inputMode="decimal" value={l.qty} max={l.maxQty} onChange={(e) => /^\d*\.?\d{0,4}$/.test(e.target.value) && update(l.key, { qty: l.maxQty && Number(e.target.value) > Number(l.maxQty) ? l.maxQty : e.target.value })} className="num text-right" />
                </td>
                <td className="px-2">
                  {!initial ? <button type="button" aria-label={t("deliveryOrders.removeLine")} disabled={lines.length === 1} onClick={() => setLines((ls) => ls.filter((x) => x.key !== l.key))} className="inline-flex size-8 items-center justify-center rounded-md text-muted hover:bg-surface-2 disabled:opacity-40"><Trash2 className="size-4" aria-hidden /></button> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!initial ? <div className="p-3"><Button type="button" variant="ghost" onClick={() => setLines((ls) => [...ls, { key: nextKey++, itemId: "", qty: "" }])}><Plus className="size-4" aria-hidden />{t("vouchers.addLine")}</Button></div> : null}
      </Card>
      <Card><Field label={t("common.narration")} htmlFor="do-narr"><Input id="do-narr" value={narration} onChange={(e) => setNarration(e.target.value)} maxLength={300} /></Field></Card>
      <div className="shrink-0"><Button type="submit" disabled={busy || !customerId}>{busy ? t("common.saving") : t("deliveryOrders.save")}</Button></div>
    </form>
  );
}
