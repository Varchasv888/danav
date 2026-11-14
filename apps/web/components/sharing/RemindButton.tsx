"use client";

import { BellRing, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Button } from "../ui";

type Result = { sent: { partyId: string; status: string }[]; skipped: { partyId: string; name: string; reason: string }[] };

/**
 * Payment reminders on WhatsApp, each with a link to the customer's statement: for one customer, or for
 * everyone with overdue bills. Says how many went and who has no mobile to send to.
 */
export function RemindButton({ accountId, asOf, compact = false }: { accountId?: string; asOf: string; compact?: boolean }) {
  const t = useTranslations();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const remind = async () => {
    if (!accountId && !window.confirm(t("share.remindAllConfirm"))) return;
    setBusy(true);
    setError(null);
    try {
      setResult(await api<Result>("/reminders/payments", { body: accountId ? { accountIds: [accountId], date: asOf } : { overdueOnly: true, date: asOf } }));
    } catch (err) {
      setError(errorText(t, err, ["share.errors"]));
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    const sent = result.sent.filter((s) => s.status === "sent").length;
    const noPhone = result.skipped.filter((s) => s.reason === "no_phone");
    if (accountId) {
      const why = result.skipped[0]?.reason;
      return <span className={`text-xs ${sent ? "text-success" : "text-danger"}`}>{sent ? t("share.reminded") : t(`share.errors.${why === "no_phone" ? "invalid_phone" : why === "nothing_outstanding" ? "nothing_outstanding" : "send_failed"}`)}</span>;
    }
    return (
      <span className="flex max-w-md flex-col text-sm">
        <span className="inline-flex items-center gap-1.5 text-success"><CheckCircle2 className="size-4" aria-hidden />{t("share.remindedAll", { n: sent })}</span>
        {noPhone.length ? <span className="text-xs text-muted">{t("share.noPhone", { names: noPhone.map((s) => s.name).join(", ") })}</span> : null}
      </span>
    );
  }
  return (
    <span className="inline-flex flex-col">
      {compact ? (
        <button type="button" onClick={remind} disabled={busy} className="inline-flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-50">
          <BellRing className="size-3.5" aria-hidden />{t("share.remind")}
        </button>
      ) : (
        <Button variant="outline" onClick={remind} disabled={busy}><BellRing className="size-4" aria-hidden />{t("share.remindAll")}</Button>
      )}
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </span>
  );
}
