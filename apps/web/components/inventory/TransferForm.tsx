"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { localName, todayIso } from "@/lib/format";
import type { ItemOption, WarehouseOption } from "@/lib/masters";
import { Alert, Button, Card, Field, Input, Select } from "../ui";
import { useWorkDate } from "@/components/WorkingDate";

interface Line { key: number; itemId: string; qty: string }
let nextKey = 1;

/** Send stock to another warehouse. It leaves the source now and shows as in transit until the other side receives it. */
export function TransferForm({ warehouses, items }: { warehouses: WarehouseOption[]; items: ItemOption[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [from, setFrom] = useState(warehouses.find((w) => w.isDefault)?.id ?? warehouses[0]?.id ?? "");
  const [to, setTo] = useState("");
  const workDate = useWorkDate();
  const [date, setDate] = useState(workDate);
  const [transporter, setTransporter] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [lines, setLines] = useState<Line[]>([{ key: nextKey++, itemId: "", qty: "" }]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const goods = items.filter((i) => i.kind === "goods" && !i.archived).sort((a, b) => localName(a, locale).localeCompare(localName(b, locale)));
  const update = (key: number, patch: Partial<Line>) => setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ id: string }>("/stock-transfers", {
        body: { fromWarehouseId: from, toWarehouseId: to, date, transporter: transporter || undefined, vehicleNo: vehicleNo || undefined, lines: lines.filter((l) => l.itemId && Number(l.qty) > 0).map((l) => ({ itemId: l.itemId, qty: l.qty })) },
      });
      router.push(`/inventory/transfers/${r.id}`);
      router.refresh();
    } catch (err) { setError(errorText(t, err, ["transfers.errors", "sj.errors"])); } finally { setBusy(false); }
  }

  const wh = (id: string, value: string, set: (v: string) => void, label: string) => (
    <Field label={label} htmlFor={id}>
      <Select id={id} value={value} onChange={(e) => set(e.target.value)} required>
        <option value="">{t("transfers.chooseWarehouse")}</option>
        {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
      </Select>
    </Field>
  );

  return (
    <form onSubmit={submit} method="post" data-density="compact" className="flex flex-col gap-3 lg:min-h-0 lg:flex-1">
      {error ? <Alert>{error}</Alert> : null}
      <Card>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {wh("tr-from", from, setFrom, t("transfers.from"))}
          {wh("tr-to", to, setTo, t("transfers.to"))}
          <Field label={t("common.date")} htmlFor="tr-date"><Input id="tr-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
          <Field label={t("transfers.transporter")} htmlFor="tr-tp"><Input id="tr-tp" value={transporter} onChange={(e) => setTransporter(e.target.value)} maxLength={80} /></Field>
          <Field label={t("transfers.vehicle")} htmlFor="tr-veh"><Input id="tr-veh" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} maxLength={16} /></Field>
        </div>
      </Card>
      <Card className="relative p-0 lg:min-h-0 lg:flex-1 lg:overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-surface text-left text-muted"><tr className="border-b border-border"><th className="px-4 py-1 font-medium">{t("transfers.item")}</th><th className="w-32 px-4 py-1 text-right font-medium">{t("transfers.qty")}</th><th className="w-10" /></tr></thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.key} className="border-b border-border last:border-0">
                <td className="px-4 py-1"><Select aria-label={t("transfers.item")} value={l.itemId} onChange={(e) => update(l.key, { itemId: e.target.value })}><option value="">{t("transfers.chooseItem")}</option>{goods.map((i) => <option key={i.id} value={i.id}>{localName(i, locale)}</option>)}</Select></td>
                <td className="px-4 py-1"><Input aria-label={t("transfers.qty")} inputMode="decimal" value={l.qty} onChange={(e) => /^\d*\.?\d{0,4}$/.test(e.target.value) && update(l.key, { qty: e.target.value })} className="num text-right" /></td>
                <td className="px-2"><button type="button" aria-label={t("transfers.removeLine")} disabled={lines.length === 1} onClick={() => setLines((ls) => ls.filter((x) => x.key !== l.key))} className="inline-flex size-8 items-center justify-center rounded-md text-muted hover:bg-surface-2 disabled:opacity-40"><Trash2 className="size-4" aria-hidden /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3"><Button type="button" variant="ghost" onClick={() => setLines((ls) => [...ls, { key: nextKey++, itemId: "", qty: "" }])}><Plus className="size-4" aria-hidden />{t("vouchers.addLine")}</Button></div>
      </Card>
      <div className="shrink-0"><Button type="submit" disabled={busy || !from || !to}>{busy ? t("common.saving") : t("transfers.send")}</Button></div>
    </form>
  );
}
