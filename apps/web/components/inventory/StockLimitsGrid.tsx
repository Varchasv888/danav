"use client";

import clsx from "clsx";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Badge, Button, Input, Select } from "../ui";

export interface LimitRow { id: string; name: string; sku: string | null; size: string | null; color: string | null; qty: string; minQty: string; maxQty: string; below: boolean }

const trim = (v: string) => (v.includes(".") ? v.replace(/\.?0+$/, "") : v);

/**
 * Minimum and maximum stock per item for one warehouse, edited like a sheet: type in the cells, Save
 * sends only the rows that changed. Items under their minimum are flagged so the buyer sees what to order.
 */
export function StockLimitsGrid({ warehouses, warehouseId, rows, canEdit }: {
  warehouses: { id: string; name: string }[]; warehouseId: string; rows: LimitRow[]; canEdit: boolean;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [edits, setEdits] = useState<Record<string, { min: string; max: string }>>({});
  const [q, setQ] = useState("");
  const [onlyBelow, setOnlyBelow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [savedCount, setSavedCount] = useState<number | null>(null);

  const val = (r: LimitRow) => edits[r.id] ?? { min: trim(r.minQty), max: trim(r.maxQty) };
  const isBelow = (r: LimitRow) => { const v = val(r); return Number(v.min) > 0 && Number(r.qty) < Number(v.min); };
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter((r) => (!s || `${r.name} ${r.sku ?? ""}`.toLowerCase().includes(s)) && (!onlyBelow || isBelow(r)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, q, onlyBelow, edits]);
  const belowCount = rows.filter(isBelow).length;
  const dirty = Object.keys(edits).length;

  function set(r: LimitRow, key: "min" | "max", v: string) {
    if (!/^\d*\.?\d{0,4}$/.test(v)) return;
    const next = { ...val(r), [key]: v };
    setSavedCount(null);
    setEdits((e) => {
      const copy = { ...e };
      if (next.min === trim(r.minQty) && next.max === trim(r.maxQty)) delete copy[r.id]; else copy[r.id] = next;
      return copy;
    });
  }

  async function save() {
    setError(null);
    setBusy(true);
    try {
      const payload = Object.entries(edits).map(([itemId, v]) => ({ itemId, minQty: v.min || "0", maxQty: v.max || "0" }));
      const r = await api<{ saved: number }>(`/stock-limits/${warehouseId}`, { method: "PUT", body: { rows: payload } });
      setEdits({});
      setSavedCount(r.saved);
      router.refresh();
    } catch (err) { setError(errorText(t, err, ["limits.errors"])); } finally { setBusy(false); }
  }

  return (
    <div className="rounded-md border border-border bg-surface">
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-3 py-2">
        <label className="flex items-center gap-2 text-[0.9286rem] text-muted">
          {t("limits.warehouse")}
          <Select value={warehouseId} onChange={(e) => router.push(`/inventory/stock-limits?warehouse=${e.target.value}`)} className="h-8 w-52">
            {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </Select>
        </label>
        <label className="relative min-w-48 flex-1 sm:max-w-64">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-faint" aria-hidden />
          <span className="sr-only">{t("common.search")}</span>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("common.search")} className="h-8 pl-8" />
        </label>
        <label className="flex items-center gap-1.5 text-[0.9286rem] text-muted">
          <input type="checkbox" checked={onlyBelow} onChange={(e) => setOnlyBelow(e.target.checked)} className="size-3.5" />
          {t("limits.onlyBelow", { n: belowCount })}
        </label>
        {canEdit ? (
          <div className="ml-auto flex items-center gap-3">
            {savedCount !== null ? <span className="text-[0.9286rem] text-success">{t("limits.saved", { n: savedCount })}</span> : null}
            <Button type="button" onClick={save} disabled={busy || !dirty} className="h-8">{dirty ? t("limits.saveN", { n: dirty }) : t("common.save")}</Button>
          </div>
        ) : null}
      </div>

      {error ? <div className="px-3 pt-3"><Alert>{error}</Alert></div> : null}

      <div className="overflow-x-auto">
        <table className="w-full text-[0.9286rem]">
          <thead>
            <tr className="border-b border-border bg-surface-2 text-left text-xs font-semibold text-muted">
              <th className="px-3 py-1.5">{t("limits.item")}</th>
              <th className="px-3 py-1.5 text-right">{t("limits.inStock")}</th>
              <th className="w-28 px-3 py-1.5 text-right">{t("limits.min")}</th>
              <th className="w-28 px-3 py-1.5 text-right">{t("limits.max")}</th>
              <th className="w-32 px-3 py-1.5 text-right">{t("limits.toOrder")}</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => {
              const v = val(r);
              const below = isBelow(r);
              const toOrder = Number(v.max) > 0 && Number(r.qty) < Number(v.max) && below ? Number(v.max) - Number(r.qty) : 0;
              return (
                <tr key={r.id} className={clsx("border-b border-rule last:border-0", edits[r.id] && "bg-accent-soft/40")}>
                  <td className="px-3 py-1.5">
                    <span className="font-medium">{r.name}</span>
                    {r.sku ? <span className="ml-2 font-mono text-xs text-muted">{r.sku}</span> : null}
                    {below ? <Badge tone="danger" className="ml-2">{t("limits.below")}</Badge> : null}
                  </td>
                  <td className={clsx("num px-3 py-1.5 text-right", below && "font-semibold text-danger")}>{trim(r.qty)}</td>
                  <td className="px-3 py-1">
                    {canEdit ? <Input inputMode="decimal" value={v.min} onChange={(e) => set(r, "min", e.target.value)} aria-label={`${r.name}: ${t("limits.min")}`} className="num h-8 text-right" />
                      : <span className="num block text-right">{v.min}</span>}
                  </td>
                  <td className="px-3 py-1">
                    {canEdit ? <Input inputMode="decimal" value={v.max} onChange={(e) => set(r, "max", e.target.value)} aria-label={`${r.name}: ${t("limits.max")}`} className="num h-8 text-right" />
                      : <span className="num block text-right">{v.max}</span>}
                  </td>
                  <td className="num px-3 py-1.5 text-right text-muted">{toOrder ? trim(String(toOrder)) : ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!shown.length ? <p className="px-3 py-8 text-center text-muted">{rows.length ? t("limits.noMatch") : t("limits.empty")}</p> : null}
      </div>
    </div>
  );
}
