"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { localName } from "@/lib/format";
import type { SupplierOption } from "@/lib/masters";
import { Alert, Button, Card, Input, Select } from "../ui";

export interface MrpLine {
  itemId: string; name: string; nameHi: string | null; action: "make" | "buy"; qty: string; needBy: string; releaseBy: string;
  onHand: string; onOrder: string; supplierId: string | null; uom?: string;
}
const n = (v: string) => Number(v).toLocaleString("en-IN", { maximumFractionDigits: 4 });

export function MrpPlan({ date, lines, suppliers, canConvert }: { date: string; lines: MrpLine[]; suppliers: SupplierOption[]; canConvert: boolean }) {
  const t = useTranslations();
  const locale = useLocale();
  const format = useFormatter();
  const router = useRouter();
  const [rows, setRows] = useState(lines.map((l) => ({ ...l, qty: String(Number(l.qty)), supplierId: l.supplierId ?? "", pick: true })));
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (i: number, patch: Partial<(typeof rows)[number]>) => setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });

  async function convert() {
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ productionOrders: string[]; purchaseOrders: string[] }>("/mrp/convert", {
        body: { date, lines: rows.filter((x) => x.pick && Number(x.qty) > 0).map((x) => ({ itemId: x.itemId, qty: x.qty, action: x.action, needBy: x.needBy, ...(x.action === "buy" && x.supplierId ? { supplierId: x.supplierId } : {}) })) },
      });
      setDone(t("mfg.mrp.created", { orders: [...r.productionOrders, ...r.purchaseOrders].join(", ") }));
      router.refresh();
    } catch (err) { setError(errorText(t, err, ["mfg.errors", "purchase.errors"])); } finally { setBusy(false); }
  }

  if (!lines.length) return <Card><p className="py-6 text-center text-muted">{done ?? t("mfg.mrp.none")}</p></Card>;
  return (
    <div className="flex flex-col gap-4">
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="text-left text-muted"><tr className="border-b border-border">
              <th className="w-10 px-4 py-3" />
              <th className="px-3 py-3 font-medium">{t("mfg.orders.item")}</th>
              <th className="px-3 py-3 font-medium">{t("mfg.mrp.action")}</th>
              <th className="px-3 py-3 text-right font-medium">{t("mfg.mrp.onHand")}</th>
              <th className="px-3 py-3 text-right font-medium">{t("mfg.mrp.onOrder")}</th>
              <th className="w-32 px-3 py-3 text-right font-medium">{t("mfg.mrp.qty")}</th>
              <th className="px-3 py-3 font-medium">{t("mfg.mrp.releaseBy")}</th>
              <th className="px-3 py-3 font-medium">{t("mfg.mrp.needBy")}</th>
              <th className="px-3 py-3 font-medium">{t("mfg.mrp.supplier")}</th>
            </tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.itemId} className="border-b border-border last:border-0">
                  <td className="px-4 py-2"><input type="checkbox" checked={r.pick} onChange={(e) => set(i, { pick: e.target.checked })} className="size-4 accent-[var(--primary)]" aria-label={r.name} /></td>
                  <td className="px-3 py-2 font-medium">{localName(r, locale)}</td>
                  <td className="px-3 py-2"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.action === "make" ? "bg-primary-soft text-primary" : "bg-accent-soft text-accent"}`}>{t(`mfg.mrp.actions.${r.action}`)}</span></td>
                  <td className="num px-3 py-2 text-right">{n(r.onHand)}</td>
                  <td className="num px-3 py-2 text-right">{n(r.onOrder)}</td>
                  <td className="px-3 py-2"><Input value={r.qty} onChange={(e) => set(i, { qty: e.target.value })} inputMode="decimal" className="num text-right" aria-label={t("mfg.mrp.qty")} /></td>
                  <td className={`px-3 py-2 whitespace-nowrap ${r.releaseBy < date ? "text-danger" : ""}`}>{day(r.releaseBy < date ? date : r.releaseBy)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{day(r.needBy)}</td>
                  <td className="px-3 py-2">
                    {r.action === "buy" ? (
                      <Select value={r.supplierId} onChange={(e) => set(i, { supplierId: e.target.value })} aria-label={t("mfg.mrp.supplier")}>
                        <option value="">-</option>
                        {suppliers.map((s) => <option key={s.id} value={s.id}>{localName(s, locale)}</option>)}
                      </Select>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {error ? <Alert>{error}</Alert> : null}
      {done ? <p className="text-sm text-success">{done}</p> : null}
      {canConvert ? <div><Button onClick={convert} disabled={busy || !rows.some((r) => r.pick)}>{t("mfg.mrp.convert")}</Button></div> : null}
    </div>
  );
}
