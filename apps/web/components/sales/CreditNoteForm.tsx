"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { localName, todayIso } from "@/lib/format";
import { Alert, Button, Card, Field, Input } from "../ui";
import { useWorkDate } from "@/components/WorkingDate";
import { voucherKeys } from "@/lib/voucher-keys";

/** Credit note against an invoice: goods returned (same price) or a price reduction (credit per unit). */
export function CreditNoteForm({ invoiceId, lines }: { invoiceId: string; lines: { id: string; itemName: string; itemNameHi: string | null; max: string; rate: string }[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [goodsReturned, setGoodsReturned] = useState(true);
  const [inspect, setInspect] = useState(false);
  const [qty, setQty] = useState<Record<string, string>>({});
  const [rate, setRate] = useState<Record<string, string>>({});
  const [reason, setReason] = useState("");
  const workDate = useWorkDate();
  const [date, setDate] = useState(workDate);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const r = await api<{ id: string }>("/credit-notes", {
        body: {
          invoiceId, date, reason, goodsReturned, ...(goodsReturned && inspect ? { inspect: true } : {}),
          lines: Object.entries(qty).filter(([, q]) => Number(q) > 0).map(([invoiceLineId, q]) => ({ invoiceLineId, qty: q, ...(goodsReturned ? {} : { rate: rate[invoiceLineId] }) })),
        },
      });
      router.push(`/sales/credit-notes/${r.id}`);
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "generic";
      const key = [`sales.errors.${code}`, `purchase.errors.${code}`, `vouchers.errors.${code}`].find((k) => t.has(k));
      setError(key ? t(key) : t("auth.errors.generic"));
    }
  }

  if (!open) return <div className="mt-4"><Button variant="outline" onClick={() => setOpen(true)}>{t("sales.invoices.creditNote")}</Button></div>;
  return (
    <Card className="mt-6">
      <h2 className="font-semibold">{t("sales.creditNotes.new")}</h2>
      <form onKeyDown={voucherKeys} onSubmit={submit} className="mt-4 flex flex-col gap-4">
        {error ? <Alert>{error}</Alert> : null}
        <div role="radiogroup" className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2"><input type="radio" checked={goodsReturned} onChange={() => setGoodsReturned(true)} className="accent-[var(--primary)]" />{t("sales.creditNotes.goodsReturned")}</label>
          {goodsReturned ? <label className="flex items-center gap-2"><input type="checkbox" checked={inspect} onChange={(e) => setInspect(e.target.checked)} className="size-4 accent-[var(--primary)]" />{t("inspection.inspectFirst")}</label> : null}
          <label className="flex items-center gap-2"><input type="radio" checked={!goodsReturned} onChange={() => setGoodsReturned(false)} className="accent-[var(--primary)]" />{t("sales.creditNotes.priceReduction")}</label>
        </div>
        <table data-grid data-voucher className="w-full max-w-3xl text-sm">
          <thead className="text-left text-muted">
            <tr className="border-b border-border">
              <th className="py-2 pr-4 font-medium">{t("purchase.item")}</th>
              <th className="w-36 py-2 pr-4 text-right font-medium">{t("purchase.qty")}</th>
              {!goodsReturned ? <th className="w-40 py-2 text-right font-medium">{t("sales.creditNotes.creditRate")}</th> : null}
            </tr>
          </thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.id} className="border-b border-border">
                <td className="py-2 pr-4">{localName({ name: l.itemName, nameHi: l.itemNameHi }, locale)}</td>
                <td className="py-2 pr-4"><Input value={qty[l.id] ?? ""} onChange={(e) => setQty((q) => ({ ...q, [l.id]: e.target.value }))} inputMode="decimal" className="num text-right" placeholder={goodsReturned ? `≤ ${Number(l.max)}` : ""} aria-label={`${t("purchase.qty")} ${l.itemName}`} /></td>
                {!goodsReturned ? <td className="py-2"><Input value={rate[l.id] ?? ""} onChange={(e) => setRate((r) => ({ ...r, [l.id]: e.target.value }))} inputMode="decimal" className="num text-right" placeholder={`≤ ${Number(l.rate)}`} aria-label={`${t("sales.creditNotes.creditRate")} ${l.itemName}`} /></td> : null}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="grid max-w-3xl gap-4 md:grid-cols-[180px_1fr]">
          <Field label={t("common.date")} htmlFor="cn-date"><Input id="cn-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
          <Field label={t("sales.creditNotes.reason")} htmlFor="cn-reason"><Input id="cn-reason" value={reason} onChange={(e) => setReason(e.target.value)} required minLength={3} maxLength={300} /></Field>
        </div>
        <div className="flex gap-3">
          <Button type="submit">{t("sales.creditNotes.post")}<kbd>Ctrl+S</kbd></Button>
          <Button type="button" variant="ghost" data-cancel onClick={() => setOpen(false)}>{t("common.cancel")}<kbd>Esc</kbd></Button>
        </div>
      </form>
    </Card>
  );
}
