"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { localName, todayIso } from "@/lib/format";
import { Alert, Button, Card, Field, Input } from "../ui";
import { useWorkDate } from "@/components/WorkingDate";
import { voucherKeys } from "@/lib/voucher-keys";

/** Debit note against a bill: pick quantities to send back; price and GST follow the bill. */
export function ReturnForm({ billId, lines, shortage = false }: { billId: string; lines: { id: string; itemName: string; itemNameHi: string | null; max: string }[]; shortage?: boolean }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState<Record<string, string>>({});
  const [reason, setReason] = useState("");
  const workDate = useWorkDate();
  const [date, setDate] = useState(workDate);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const r = await api<{ id: string }>("/purchase-returns", {
        body: { billId, date, reason, ...(shortage ? { shortage: true } : {}), lines: Object.entries(qty).filter(([, q]) => Number(q) > 0).map(([billLineId, q]) => ({ billLineId, qty: q })) },
      });
      router.push(`/purchase/returns/${r.id}`);
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "generic";
      const key = [`purchase.errors.${code}`, `vouchers.errors.${code}`].find((k) => t.has(k));
      setError(key ? t(key) : t("auth.errors.generic"));
    }
  }

  if (!open) return <div className="mt-4"><Button variant="outline" onClick={() => setOpen(true)}>{t(shortage ? "purchase.returns.shortageButton" : "purchase.bills.return")}</Button></div>;
  return (
    <Card className="mt-6">
      <h2 className="font-semibold">{t(shortage ? "purchase.returns.shortageTitle" : "purchase.returns.new")}</h2>
      {shortage ? <p className="mt-1 max-w-2xl text-sm text-muted">{t("purchase.returns.shortageHelp")}</p> : null}
      <form onKeyDown={voucherKeys} onSubmit={submit} className="mt-4 flex flex-col gap-4">
        {error ? <Alert>{error}</Alert> : null}
        <table data-grid data-voucher className="w-full max-w-2xl text-sm">
          <tbody>
            {lines.map((l) => (
              <tr key={l.id} className="border-b border-border">
                <td className="py-2 pr-4">{localName({ name: l.itemName, nameHi: l.itemNameHi }, locale)}</td>
                <td className="w-40 py-2">
                  <Input value={qty[l.id] ?? ""} onChange={(e) => setQty((q) => ({ ...q, [l.id]: e.target.value }))} inputMode="decimal" className="num text-right" placeholder={`≤ ${Number(l.max)}`} aria-label={`${t("purchase.qty")} ${l.itemName}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="grid max-w-2xl gap-4 md:grid-cols-[180px_1fr]">
          <Field label={t("common.date")} htmlFor="ret-date"><Input id="ret-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
          <Field label={t("purchase.returns.reason")} htmlFor="ret-reason"><Input id="ret-reason" value={reason} onChange={(e) => setReason(e.target.value)} required minLength={3} maxLength={300} /></Field>
        </div>
        <div className="flex gap-3">
          <Button type="submit">{t("purchase.returns.post")}<kbd>Ctrl+S</kbd></Button>
          <Button type="button" variant="ghost" data-cancel onClick={() => setOpen(false)}>{t("common.cancel")}<kbd>Esc</kbd></Button>
        </div>
      </form>
    </Card>
  );
}
