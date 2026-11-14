"use client";

import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { rupees, todayIso } from "@/lib/format";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export interface RankedQuote {
  id: string; supplier: string; supplierId: string; rate: string; extraCost: string; landed: string; minQty: string | null; leadDays: number | null;
  validUntil: string | null; quotedOn: string; note: string | null; expired: boolean; cheapest: boolean; overCheapestPct: string | null; vsLastPaidPct: string | null;
}
export interface QuoteData { itemId: string; lastPaid: { rate: string; supplier: string; date: string } | null; quotes: RankedQuote[] }

/** Quotes for one item side by side, cheapest landed cost first, with the last price paid for it and a form to record another quote. */
export function QuoteBoard({ data, suppliers, canEdit }: { data: QuoteData; suppliers: { id: string; name: string }[]; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => String(f.get(k) ?? "").trim();
    setBusy(true); setError(null);
    try {
      await api("/purchase/quotes", { body: {
        itemId: data.itemId, supplierId: s("supplierId"), rate: s("rate"), quotedOn: s("quotedOn") || todayIso(),
        ...(s("extraCost") ? { extraCost: s("extraCost") } : {}), ...(s("minQty") ? { minQty: s("minQty") } : {}), ...(s("leadDays") ? { leadDays: Number(s("leadDays")) } : {}),
        ...(s("validUntil") ? { validUntil: s("validUntil") } : {}), ...(s("note") ? { note: s("note") } : {}),
      } });
      setOpen(false); router.refresh();
    } catch (err) { setError(errorText(t, err, ["quotes.errors", "purchase.errors"])); } finally { setBusy(false); }
  }
  async function archive(id: string) {
    setBusy(true); setError(null);
    try { await api(`/purchase/quotes/${id}/archive`, { body: {} }); router.refresh(); } catch (err) { setError(errorText(t, err, ["quotes.errors"])); } finally { setBusy(false); }
  }
  const pct = (v: string | null) => (v === null ? "-" : Number(v) === 0 ? "-" : `${Number(v) > 0 ? "+" : ""}${v}%`);

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm">
          {data.lastPaid ? t("quotes.lastPaid", { rate: rupees(data.lastPaid.rate), supplier: data.lastPaid.supplier, date: data.lastPaid.date }) : t("quotes.neverBought")}
        </p>
        {canEdit ? <Button variant="outline" onClick={() => setOpen((v) => !v)}>{open ? t("common.cancel") : t("quotes.add")}</Button> : null}
      </Card>
      {error ? <Alert>{error}</Alert> : null}
      {open ? (
        <Card>
          <form onSubmit={add} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label={t("quotes.supplier")} htmlFor="q-sup"><Select id="q-sup" name="supplierId" required defaultValue=""><option value="" disabled>-</option>{suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></Field>
            <Field label={t("quotes.rate")} htmlFor="q-rate" hint={t("quotes.rateHint")}><Input id="q-rate" name="rate" inputMode="decimal" required className="num" /></Field>
            <Field label={t("quotes.extra")} htmlFor="q-extra" hint={t("quotes.extraHint")}><Input id="q-extra" name="extraCost" inputMode="decimal" className="num" /></Field>
            <Field label={t("quotes.minQty")} htmlFor="q-min"><Input id="q-min" name="minQty" inputMode="decimal" className="num" /></Field>
            <Field label={t("quotes.lead")} htmlFor="q-lead"><Input id="q-lead" name="leadDays" inputMode="numeric" className="num" /></Field>
            <Field label={t("quotes.quotedOn")} htmlFor="q-on"><Input id="q-on" name="quotedOn" type="date" defaultValue={todayIso()} required /></Field>
            <Field label={t("quotes.validUntil")} htmlFor="q-valid"><Input id="q-valid" name="validUntil" type="date" /></Field>
            <Field label={t("quotes.note")} htmlFor="q-note"><Input id="q-note" name="note" maxLength={200} /></Field>
            <div className="flex items-end"><Button type="submit" disabled={busy}>{t("common.save")}</Button></div>
          </form>
        </Card>
      ) : null}
      <Card className="overflow-hidden p-0">
        {data.quotes.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="text-left text-muted">
                <tr className="border-b border-border">
                  <th className="px-4 py-2 font-medium">{t("quotes.supplier")}</th>
                  <th className="px-3 py-2 text-right font-medium">{t("quotes.rate")}</th>
                  <th className="px-3 py-2 text-right font-medium">{t("quotes.extra")}</th>
                  <th className="px-3 py-2 text-right font-medium">{t("quotes.landed")}</th>
                  <th className="px-3 py-2 text-right font-medium">{t("quotes.overCheapest")}</th>
                  <th className="px-3 py-2 text-right font-medium">{t("quotes.vsLast")}</th>
                  <th className="px-3 py-2 text-right font-medium">{t("quotes.lead")}</th>
                  <th className="px-3 py-2 font-medium">{t("quotes.validUntil")}</th>
                  <th className="w-28" />
                </tr>
              </thead>
              <tbody>
                {data.quotes.map((q) => (
                  <tr key={q.id} className={clsx("border-b border-border last:border-0", q.expired && "text-faint")}>
                    <td className="px-4 py-2 font-medium">
                      {q.supplier}
                      {q.cheapest ? <span className="ml-2 rounded bg-success-soft px-1.5 text-xs font-normal text-success">{t("quotes.cheapest")}</span> : null}
                      {q.expired ? <span className="ml-2 rounded bg-surface-2 px-1.5 text-xs font-normal text-muted">{t("quotes.expired")}</span> : null}
                      {q.note ? <span className="block text-xs font-normal text-muted">{q.note}</span> : null}
                    </td>
                    <td className="num px-3 py-2 text-right">{rupees(q.rate)}</td>
                    <td className="num px-3 py-2 text-right">{Number(q.extraCost) ? rupees(q.extraCost) : "-"}</td>
                    <td className="num px-3 py-2 text-right font-semibold">{rupees(q.landed)}</td>
                    <td className="num px-3 py-2 text-right">{pct(q.overCheapestPct)}</td>
                    <td className={clsx("num px-3 py-2 text-right", q.vsLastPaidPct !== null && Number(q.vsLastPaidPct) < 0 && "text-success", q.vsLastPaidPct !== null && Number(q.vsLastPaidPct) > 0 && "text-danger")}>{pct(q.vsLastPaidPct)}</td>
                    <td className="num px-3 py-2 text-right">{q.leadDays ?? "-"}</td>
                    <td className="px-3 py-2">{q.validUntil ?? "-"}</td>
                    <td className="whitespace-nowrap pr-3 text-right">{canEdit && !q.expired ? <Link href={`/purchase/orders/new?supplierId=${q.supplierId}&itemId=${data.itemId}&rate=${q.rate}${q.minQty ? `&qty=${q.minQty}` : ""}`} className="mr-2 rounded px-2 py-1 text-xs font-medium text-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-primary">{t("quotes.order")}</Link> : null}{canEdit ? <button type="button" onClick={() => void archive(q.id)} disabled={busy} className="rounded px-2 py-1 text-xs text-muted hover:bg-surface-2 hover:text-text focus-visible:outline-2 focus-visible:outline-primary">{t("quotes.remove")}</button> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="px-4 py-6 text-sm text-muted">{t("quotes.none")}</p>}
      </Card>
      <p className="text-xs text-muted">{t("quotes.note2")}</p>
    </div>
  );
}
