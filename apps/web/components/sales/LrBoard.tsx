"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { rupees, todayIso } from "@/lib/format";
import { Alert, Badge, Button, Field, Input, Select } from "../ui";

export interface LrRow {
  id: string; date: string; transporter: string; lrNumber: string; destination: string | null; packages: number; weightKg: string | null; freight: string; freightBy: "paid" | "to_pay";
  status: "booked" | "in_transit" | "delivered"; deliveredOn: string | null; note: string | null; invoiceNumber: string | null; customer: string | null; daysOut: number | null;
}
const STATUS = ["booked", "in_transit", "delivered"] as const;

/** Add a consignment on the top form, change its status in the row, filter by status or search. */
export function LrBoard({ rows, invoices, transporters, status, q, canCreate, canEdit }: {
  rows: LrRow[]; invoices: { id: string; label: string }[]; transporters: string[]; status: string; q: string; canCreate: boolean; canEdit: boolean;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function send(path: string, method: "POST" | "PATCH", body: Record<string, unknown>) {
    setError(null);
    setBusy(true);
    try { await api(path, { method, body }); router.refresh(); return true; } catch (err) { setError(errorText(t, err, ["lr.errors"])); return false; } finally { setBusy(false); }
  }
  const tone = (s: LrRow["status"]) => (s === "delivered" ? "success" : s === "in_transit" ? "info" : "warning");

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      {canCreate ? (
        <form className="grid gap-3 rounded-md border border-border bg-surface p-3 sm:grid-cols-2 lg:grid-cols-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const f = new FormData(form);
            const v = (k: string) => String(f.get(k) ?? "").trim();
            const ok = await send("/lr-entries", "POST", {
              date: v("date"), transporter: v("transporter"), lrNumber: v("lrNumber"), invoiceId: v("invoiceId") || null, destination: v("destination") || null,
              packages: Number(v("packages")) || 1, weightKg: v("weightKg") || null, freight: v("freight") || "0", freightBy: v("freightBy") || "paid",
            });
            if (ok) form.reset();
          }}>
          <Field label={t("common.date")} htmlFor="lr-date"><Input id="lr-date" type="date" name="date" defaultValue={todayIso()} required /></Field>
          <Field label={t("lr.transporter")} htmlFor="lr-tr"><Input id="lr-tr" name="transporter" required maxLength={80} list="lr-transporters" /><datalist id="lr-transporters">{transporters.map((n) => <option key={n} value={n} />)}</datalist></Field>
          <Field label={t("lr.lrNumber")} htmlFor="lr-no"><Input id="lr-no" name="lrNumber" required maxLength={30} className="font-mono" /></Field>
          <Field label={t("lr.invoice")} htmlFor="lr-inv">
            <Select id="lr-inv" name="invoiceId" defaultValue=""><option value="">{t("lr.noInvoice")}</option>{invoices.map((i) => <option key={i.id} value={i.id}>{i.label}</option>)}</Select>
          </Field>
          <Field label={t("lr.destination")} htmlFor="lr-dest"><Input id="lr-dest" name="destination" maxLength={120} /></Field>
          <Field label={t("lr.packages")} htmlFor="lr-pk"><Input id="lr-pk" name="packages" inputMode="numeric" defaultValue="1" className="num text-right" /></Field>
          <Field label={t("lr.weight")} htmlFor="lr-wt"><Input id="lr-wt" name="weightKg" inputMode="decimal" className="num text-right" /></Field>
          <Field label={t("lr.freight")} htmlFor="lr-fr">
            <div className="flex gap-2"><Input id="lr-fr" name="freight" inputMode="decimal" className="num text-right" /><Select name="freightBy" defaultValue="paid" aria-label={t("lr.freightBy")} className="w-36"><option value="paid">{t("lr.paid")}</option><option value="to_pay">{t("lr.toPay")}</option></Select></div>
          </Field>
          <div className="sm:col-span-2 lg:col-span-4"><Button type="submit" disabled={busy}><Plus className="size-4" aria-hidden />{t("lr.add")}</Button></div>
        </form>
      ) : null}

      <form method="get" className="flex flex-wrap items-end gap-3 print:hidden">
        <Field label={t("lr.status")} htmlFor="lr-st"><Select id="lr-st" name="status" defaultValue={status} className="w-44"><option value="">{t("lr.allStatuses")}</option>{STATUS.map((s) => <option key={s} value={s}>{t(`lr.statuses.${s}`)}</option>)}</Select></Field>
        <Field label={t("common.search")} htmlFor="lr-q"><Input id="lr-q" name="q" defaultValue={q} className="w-56" /></Field>
        <Button type="submit" variant="outline">{t("books.show")}</Button>
      </form>

      <div className="overflow-x-auto rounded-md border border-border bg-surface">
        {rows.length ? (
          <table className="w-full min-w-[820px] text-[0.9286rem]">
            <thead><tr className="border-b border-border bg-surface-2 text-left text-xs font-semibold text-muted">
              <th className="px-3 py-1.5">{t("common.date")}</th><th className="px-3 py-1.5">{t("lr.transporter")}</th><th className="px-3 py-1.5">{t("lr.lrNumber")}</th>
              <th className="px-3 py-1.5">{t("lr.invoice")}</th><th className="px-3 py-1.5 text-right">{t("lr.packages")}</th><th className="px-3 py-1.5 text-right">{t("lr.freight")}</th><th className="px-3 py-1.5">{t("lr.status")}</th>
            </tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-rule align-top last:border-0">
                  <td className="px-3 py-2 whitespace-nowrap">{day(r.date)}</td>
                  <td className="px-3 py-2 font-medium">{r.transporter}{r.destination ? <div className="text-xs font-normal text-muted">{r.destination}</div> : null}</td>
                  <td className="px-3 py-2 font-mono text-xs">{r.lrNumber}</td>
                  <td className="px-3 py-2">{r.invoiceNumber ? <span className="font-mono text-xs">{r.invoiceNumber}</span> : null}{r.customer ? <div className="text-xs text-muted">{r.customer}</div> : null}</td>
                  <td className="num px-3 py-2 text-right">{r.packages}</td>
                  <td className="num px-3 py-2 text-right">{rupees(r.freight)}<div className="text-xs text-muted">{t(r.freightBy === "to_pay" ? "lr.toPay" : "lr.paid")}</div></td>
                  <td className="px-3 py-2">
                    {canEdit ? (
                      <Select aria-label={t("lr.status")} value={r.status} disabled={busy} onChange={(e) => void send(`/lr-entries/${r.id}`, "PATCH", { status: e.target.value })} className="h-8 w-36">
                        {STATUS.map((s) => <option key={s} value={s}>{t(`lr.statuses.${s}`)}</option>)}
                      </Select>
                    ) : <Badge tone={tone(r.status)}>{t(`lr.statuses.${r.status}`)}</Badge>}
                    <div className="mt-1 text-xs text-muted">{r.status === "delivered" && r.deliveredOn ? t("lr.deliveredOn", { date: day(r.deliveredOn) }) : r.daysOut !== null ? t("lr.daysOut", { n: r.daysOut }) : ""}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="px-4 py-8 text-center text-muted">{t("lr.empty")}</p>}
      </div>
    </div>
  );
}
