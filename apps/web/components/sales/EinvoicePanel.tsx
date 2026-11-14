"use client";

import { FileCheck2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { Alert, Button, Card, Field, Input, Select } from "../ui";
import { EwayBillCard } from "./EwayBillCard";

export interface EinvoiceState {
  id: string; status: string; einvoiceStatus: string; irn: string | null; ackNo: string | null; ackDate: string | null; einvoiceError?: string | null;
  ewbStatus?: string; ewbNo?: string | null; ewbDate?: string | null; ewbValidUpto?: string | null; vehicleNo?: string | null;
}

/** e-Invoice (IRN) and e-way bill actions for one invoice, or the IRN alone for a credit note (path "/credit-notes"). */
export function EinvoicePanel({ invoice: inv, canSubmit, canCancel, hasGoods, path = "/sales-invoices" }: { invoice: EinvoiceState; canSubmit: boolean; canCancel: boolean; hasGoods: boolean; path?: string }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState<"1" | "2" | "3" | "4">("2");
  const [remark, setRemark] = useState("");
  const posted = inv.status === "posted";

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      setCancelling(false);
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? (err.issues?.[0]?.message ?? err.code) : "generic";
      const key = [`einvoice.errors.${code}`, `ewb.errors.${code}`, `sales.errors.${code}`].find((k) => t.has(k));
      setError(key ? t(key) : t("auth.errors.generic"));
    } finally {
      setBusy(false);
    }
  };
  const when = (iso?: string | null) => (iso ? format.dateTime(new Date(iso), { dateStyle: "medium", timeStyle: "short" }) : "");

  if (inv.einvoiceStatus === "not_required" && !(hasGoods && posted)) return null;
  return (
    <div className="mt-6 grid gap-4 xl:grid-cols-2">
      {error ? <div className="xl:col-span-2"><Alert>{error}</Alert></div> : null}
      {inv.einvoiceStatus !== "not_required" ? (
        <Card>
          <h2 className="flex items-center gap-2 font-semibold"><FileCheck2 className="size-4 text-primary" aria-hidden />{t("einvoice.title")} · {t(`einvoice.status.${inv.einvoiceStatus}`)}</h2>
          {inv.irn ? (
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              <dt className="text-muted">{t("einvoice.irn")}</dt><dd className="font-mono text-xs break-all">{inv.irn}</dd>
              <dt className="text-muted">{t("einvoice.ackNo")}</dt><dd className="font-mono">{inv.ackNo}</dd>
              <dt className="text-muted">{t("einvoice.ackDate")}</dt><dd>{when(inv.ackDate)}</dd>
            </dl>
          ) : null}
          {inv.einvoiceError ? <p className="mt-2 text-sm text-danger">{inv.einvoiceError}</p> : null}
          <p className="mt-3 text-xs text-muted">{t("einvoice.simulator")}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {posted && canSubmit && (inv.einvoiceStatus === "pending" || inv.einvoiceStatus === "failed") ? (
              <Button disabled={busy} onClick={() => run(() => api(`${path}/${inv.id}/einvoice`, { body: {} }))}>{t("einvoice.generate")}</Button>
            ) : null}
            {inv.einvoiceStatus === "generated" && canCancel && !cancelling ? <Button variant="outline" className="text-danger" onClick={() => setCancelling(true)}>{t("einvoice.cancel")}</Button> : null}
          </div>
          {cancelling ? (
            <form className="mt-4 flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); run(() => api(`${path}/${inv.id}/einvoice/cancel`, { body: { reason, remark } })); }}>
              <p className="text-xs text-muted">{t("einvoice.cancelHint")}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label={t("vouchers.cancelReason")} htmlFor="irn-reason">
                  <Select id="irn-reason" value={reason} onChange={(e) => setReason(e.target.value as typeof reason)}>
                    {(["1", "2", "3", "4"] as const).map((r) => <option key={r} value={r}>{t(`einvoice.reasons.${r}`)}</option>)}
                  </Select>
                </Field>
                <Field label={t("einvoice.remark")} htmlFor="irn-remark"><Input id="irn-remark" value={remark} onChange={(e) => setRemark(e.target.value)} required minLength={3} maxLength={100} /></Field>
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="danger" disabled={busy}>{t("einvoice.cancel")}</Button>
                <Button type="button" variant="ghost" onClick={() => setCancelling(false)}>{t("common.close")}</Button>
              </div>
            </form>
          ) : null}
        </Card>
      ) : null}
      {hasGoods && posted ? <EwayBillCard inv={inv} canSubmit={canSubmit} canCancel={canCancel} /> : null}
    </div>
  );
}
