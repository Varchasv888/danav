"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { todayIso } from "@/lib/format";
import { Alert, Button, Field, Input } from "../ui";
import { useWorkDate } from "@/components/WorkingDate";

const QTY = /^\d+(\.\d{1,4})?$/;

/** Goods coming back on a challan (unsold pieces on approval, or back from an exhibition): stock returns to the warehouse. */
export function ReturnGoods({ noteId, date: challanDate, lines }: { noteId: string; date: string; lines: { id: string; name: string; open: string }[] }) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const workDate = useWorkDate();
  const [date, setDate] = useState(workDate);
  const [qty, setQty] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const chosen = lines.filter((l) => QTY.test(qty[l.id] ?? "") && Number(qty[l.id]) > 0);

  const [inspect, setInspect] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api(`/delivery-notes/${noteId}/returns`, { body: { date, ...(inspect ? { inspect: true } : {}), lines: chosen.map((l) => ({ lineId: l.id, qty: qty[l.id] })) } });
      setOpen(false);
      setQty({});
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "generic";
      const key = [`sales.errors.${code}`, `vouchers.errors.${code}`].find((k) => t.has(k));
      setError(key ? t(key) : t("auth.errors.generic"));
    } finally {
      setBusy(false);
    }
  }

  if (!open) return <div className="mt-4"><Button variant="outline" onClick={() => setOpen(true)}>{t("sales.deliveries.takeBack")}</Button></div>;
  return (
    <form onSubmit={submit} className="mt-4 flex max-w-2xl flex-col gap-3 rounded-xl border border-border p-4">
      <p className="text-sm font-medium">{t("sales.deliveries.takeBack")}</p>
      <Field label={t("common.date")} htmlFor="ret-date"><Input id="ret-date" type="date" value={date} min={challanDate} onChange={(e) => setDate(e.target.value)} required className="max-w-48" /></Field>
      <table className="w-full text-sm">
        <thead className="text-left text-muted">
          <tr className="border-b border-border">
            <th className="py-2 pr-3 font-medium">{t("purchase.item")}</th>
            <th className="w-28 py-2 pr-3 text-right font-medium">{t("sales.deliveries.stillOut")}</th>
            <th className="w-32 py-2 text-right font-medium">{t("sales.deliveries.cameBack")}</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l) => (
            <tr key={l.id} className="border-b border-border last:border-0">
              <td className="py-2 pr-3">{l.name}</td>
              <td className="num py-2 pr-3 text-right">{Number(l.open).toLocaleString("en-IN")}</td>
              <td className="py-2">
                <Input value={qty[l.id] ?? ""} onChange={(e) => setQty((q) => ({ ...q, [l.id]: e.target.value }))} inputMode="decimal" className="num text-right" aria-label={`${t("sales.deliveries.cameBack")} ${l.name}`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error ? <Alert>{error}</Alert> : null}
      <div className="flex gap-3">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={inspect} onChange={(e) => setInspect(e.target.checked)} className="size-4 accent-[var(--primary)]" />{t("inspection.inspectFirst")}</label>
        <Button type="submit" disabled={busy || !chosen.length}>{t("sales.deliveries.saveReturn")}</Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>{t("common.close")}</Button>
      </div>
    </form>
  );
}
