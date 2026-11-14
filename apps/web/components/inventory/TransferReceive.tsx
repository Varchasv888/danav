"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { todayIso } from "@/lib/format";
import { Alert, Button, Card, Field, Input } from "../ui";
import { useWorkDate } from "@/components/WorkingDate";

/** The receiving side counts what arrived; anything less than was sent is recorded as a shortage. */
export function TransferReceive({ id, lines, canReceive, canCancel }: { id: string; lines: { id: string; name: string; qty: string }[]; canReceive: boolean; canCancel: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const workDate = useWorkDate();
  const [date, setDate] = useState(workDate);
  const [got, setGot] = useState<Record<string, string>>(() => Object.fromEntries(lines.map((l) => [l.id, String(Number(l.qty))])));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const n = (v: string) => Number(v).toLocaleString("en-IN");
  const short = lines.reduce((s, l) => s + Math.max(0, Number(l.qty) - Number(got[l.id] || 0)), 0);

  async function receive(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api(`/stock-transfers/${id}/receive`, { body: { date, lines: lines.map((l) => ({ lineId: l.id, received: got[l.id] || "0" })) } });
      router.refresh();
    } catch (err) { setError(errorText(t, err, ["transfers.errors"])); } finally { setBusy(false); }
  }
  async function cancel() {
    setBusy(true);
    setError(null);
    try { await api(`/stock-transfers/${id}/cancel`, { body: { reason: "Called back" } }); router.refresh(); } catch (err) { setError(errorText(t, err, ["transfers.errors"])); } finally { setBusy(false); }
  }

  return (
    <form onSubmit={receive} method="post" className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      <Card className="p-0">
        <table className="w-full text-sm">
          <thead className="text-left text-muted"><tr className="border-b border-border"><th className="px-5 py-3 font-medium">{t("transfers.item")}</th><th className="px-5 py-3 text-right font-medium">{t("transfers.sent")}</th><th className="w-40 px-5 py-3 text-right font-medium">{t("transfers.received")}</th></tr></thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.id} className="border-b border-border last:border-0">
                <td className="px-5 py-2.5 font-medium">{l.name}</td><td className="num px-5 py-2.5 text-right">{n(l.qty)}</td>
                <td className="px-5 py-2"><Input aria-label={t("transfers.received")} inputMode="decimal" disabled={!canReceive} value={got[l.id] ?? ""} onChange={(e) => /^\d*\.?\d{0,4}$/.test(e.target.value) && setGot((g) => ({ ...g, [l.id]: e.target.value }))} className="num text-right" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {short > 0 ? <p role="status" className="text-sm font-semibold text-danger">{t("transfers.shortNote", { n: short.toLocaleString("en-IN") })}</p> : null}
      <div className="flex flex-wrap items-end gap-3">
        {canReceive ? <Field label={t("transfers.receivedOnLabel")} htmlFor="tr-rdate"><Input id="tr-rdate" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-44" /></Field> : null}
        {canReceive ? <Button type="submit" disabled={busy}>{t("transfers.receive")}</Button> : null}
        {canCancel ? <Button type="button" variant="outline" disabled={busy} onClick={cancel}>{t("transfers.callBack")}</Button> : null}
      </div>
    </form>
  );
}
