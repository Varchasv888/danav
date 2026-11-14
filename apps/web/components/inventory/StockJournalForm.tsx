"use client";

import clsx from "clsx";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { localName, todayIso } from "@/lib/format";
import type { ItemOption, WarehouseOption } from "@/lib/masters";
import { StyleGridPicker } from "./StyleGridPicker";
import { Alert, Button, Card, Field, Input, Select } from "../ui";
import { useWorkDate } from "@/components/WorkingDate";

type Kind = "opening" | "adjustment" | "transfer" | "issue";
interface Line { key: number; itemId: string; warehouseId: string; toWarehouseId: string; qty: string; direction: "in" | "out"; rate: string; batchNo: string; expiry: string }
let nextKey = 1;

export function StockJournalForm({ items, warehouses }: { items: ItemOption[]; warehouses: WarehouseOption[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const defaultWh = warehouses.find((w) => w.isDefault)?.id ?? warehouses[0]?.id ?? "";
  const blank = (): Line => ({ key: nextKey++, itemId: "", warehouseId: defaultWh, toWarehouseId: "", qty: "", direction: "out", rate: "", batchNo: "", expiry: "" });
  const [kind, setKind] = useState<Kind>("adjustment");
  const workDate = useWorkDate();
  const [date, setDate] = useState(workDate);
  const [narration, setNarration] = useState("");
  const [lines, setLines] = useState<Line[]>([blank()]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const update = (key: number, patch: Partial<Line>) => setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  const sorted = [...items].sort((a, b) => localName(a, locale).localeCompare(localName(b, locale)));
  const needsRate = (l: Line) => kind === "opening" || (kind === "adjustment" && l.direction === "in");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api("/stock-journals", {
        body: {
          kind, date: kind === "opening" ? undefined : date, narration: narration || undefined,
          lines: lines.filter((l) => l.itemId && l.qty).map((l) => ({
            itemId: l.itemId, warehouseId: l.warehouseId, qty: l.qty,
            ...(kind === "transfer" ? { toWarehouseId: l.toWarehouseId } : {}),
            ...(kind === "adjustment" ? { direction: l.direction } : {}),
            ...(needsRate(l) && l.rate ? { rate: l.rate } : {}),
            ...(l.batchNo ? { batchNo: l.batchNo } : {}), ...(l.expiry ? { expiry: l.expiry } : {}),
          })),
        },
      });
      router.push("/inventory/journals");
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "generic";
      const key = [`sj.errors.${code}`, `vouchers.errors.${code}`].find((k) => t.has(k));
      setError(key ? t(key) : t("auth.errors.generic"));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} data-density="compact" className="flex flex-col gap-3 lg:min-h-0 lg:flex-1">
      <div role="tablist" className="flex flex-wrap gap-2">
        {(["adjustment", "transfer", "issue", "opening"] as const).map((k) => (
          <button key={k} type="button" role="tab" aria-selected={kind === k} onClick={() => setKind(k)}
            className={clsx("max-w-64 rounded-lg border px-4 py-2 text-left", kind === k ? "border-primary bg-primary-soft" : "border-border bg-surface hover:bg-surface-2")}>
            <span className={clsx("block text-sm font-semibold", kind === k && "text-primary")}>{t(`sj.kinds.${k}`)}</span>
            <span className="block text-xs text-muted">{t(`sj.kindHints.${k}`)}</span>
          </button>
        ))}
      </div>
      <Card className="p-3 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
        <div className="grid gap-4 md:grid-cols-[180px_1fr]">
          {kind !== "opening" ? <Field label={t("common.date")} htmlFor="sj-date"><Input id="sj-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field> : <div />}
          <Field label={t("common.narration")} htmlFor="sj-narr"><Input id="sj-narr" value={narration} onChange={(e) => setNarration(e.target.value)} maxLength={300} /></Field>
        </div>
        <div className="relative mt-2 min-h-0 overflow-auto lg:flex-1">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="sticky top-0 z-10 bg-surface text-left text-muted">
              <tr className="border-b border-border">
                <th className="py-1 pr-3 font-medium">{t("purchase.item")}</th>
                <th className="w-48 py-1 pr-3 font-medium">{t("stock.warehouse")}</th>
                {kind === "transfer" ? <th className="w-48 py-1 pr-3 font-medium">{t("sj.toWarehouse")}</th> : null}
                {kind === "adjustment" ? <th className="w-36 py-1 pr-3 font-medium">{t("sj.direction")}</th> : null}
                <th className="w-32 py-1 pr-3 text-right font-medium">{t("stock.qty")}</th>
                {kind === "opening" || kind === "adjustment" ? <th className="w-32 py-1 pr-3 text-right font-medium">{t("stock.rate")}</th> : null}
                <th className="w-32 py-1 pr-3 font-medium">{t("sj.batch")}</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => {
                const item = items.find((x) => x.id === l.itemId);
                return (
                  <tr key={l.key} className="border-b border-border">
                    <td className="py-1 pr-3">
                      <Select value={l.itemId} onChange={(e) => update(l.key, { itemId: e.target.value, rate: l.rate || (items.find((x) => x.id === e.target.value)?.purchaseRate ?? "") })} aria-label={`${t("purchase.item")} ${i + 1}`}>
                        <option value="">{t("purchase.chooseItem")}</option>
                        {sorted.map((it) => <option key={it.id} value={it.id}>{localName(it, locale)} ({Number(it.stockQty).toLocaleString("en-IN")} {it.uom})</option>)}
                      </Select>
                    </td>
                    <td className="py-1 pr-3">
                      <Select value={l.warehouseId} onChange={(e) => update(l.key, { warehouseId: e.target.value })} aria-label={t("stock.warehouse")}>
                        {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                      </Select>
                    </td>
                    {kind === "transfer" ? (
                      <td className="py-1 pr-3">
                        <Select value={l.toWarehouseId} onChange={(e) => update(l.key, { toWarehouseId: e.target.value })} aria-label={t("sj.toWarehouse")} required>
                          <option value="">-</option>
                          {warehouses.filter((w) => w.id !== l.warehouseId).map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                        </Select>
                      </td>
                    ) : null}
                    {kind === "adjustment" ? (
                      <td className="py-1 pr-3">
                        <Select value={l.direction} onChange={(e) => update(l.key, { direction: e.target.value as "in" | "out" })} aria-label={t("sj.direction")}>
                          <option value="out">{t("sj.remove")}</option>
                          <option value="in">{t("sj.add")}</option>
                        </Select>
                      </td>
                    ) : null}
                    <td className="py-1 pr-3"><Input value={l.qty} onChange={(e) => update(l.key, { qty: e.target.value })} inputMode="decimal" className="num text-right" aria-label={t("stock.qty")} required={!!l.itemId} /></td>
                    {kind === "opening" || kind === "adjustment" ? (
                      <td className="py-1 pr-3">
                        {needsRate(l) ? <Input value={l.rate} onChange={(e) => update(l.key, { rate: e.target.value })} inputMode="decimal" className="num text-right" aria-label={t("stock.rate")} required={kind === "opening" && !!l.itemId} /> : null}
                      </td>
                    ) : null}
                    <td className="py-1 pr-3">
                      {item?.trackBatches ? <Input value={l.batchNo} onChange={(e) => update(l.key, { batchNo: e.target.value })} maxLength={40} aria-label={t("sj.batch")} required /> : null}
                    </td>
                    <td className="py-2 text-right">
                      {lines.length > 1 ? (
                        <button type="button" onClick={() => setLines((ls) => ls.filter((x) => x.key !== l.key))} className="rounded-md p-2 text-muted hover:bg-surface-2 hover:text-danger" title={t("common.remove")}>
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
          <Button type="button" variant="ghost" onClick={() => setLines((ls) => [...ls, blank()])} className="mt-2"><Plus className="size-4" aria-hidden />{t("vouchers.addLine")}</Button>
          <StyleGridPicker kind="stock" onAdd={(add) => setLines((ls) => [...ls.filter((x) => x.itemId), ...add.map((a) => ({ ...blank(), itemId: a.itemId, qty: a.qty, rate: a.rate }))])} />
        </div>
      </Card>
      {error ? <Alert>{error}</Alert> : null}
      <div className="flex shrink-0 gap-3">
        <Button type="submit" disabled={busy}>{t("sj.post")}</Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>{t("common.cancel")}</Button>
      </div>
    </form>
  );
}
