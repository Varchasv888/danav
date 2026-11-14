"use client";

import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Input } from "../ui";

/**
 * Shown on a purchase order that is above the company's limit. Until someone with the approve right accepts it, nothing can be
 * received or billed on it. A rejection needs a reason and cancels the order.
 */
export function OrderApproval({ orderId, status, note, canDecide }: { orderId: string; status: "pending" | "rejected"; note: string | null; canDecide: boolean }) {
  const t = useTranslations("poApproval");
  const root = useTranslations();
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(decision: "approve" | "reject") {
    setBusy(true); setError(null);
    try { await api(`/purchase-orders/${orderId}/decide`, { body: { decision, note: reason || undefined } }); router.refresh(); }
    catch (err) { setError(errorText(root, err, ["poApproval.errors"])); } finally { setBusy(false); }
  }

  return (
    <section role="status" className="mb-4 rounded-lg border border-accent/40 bg-accent-soft px-4 py-3">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{t(status === "pending" ? "waitingTitle" : "rejectedTitle")}</p>
          <p className="mt-0.5 text-[0.9286rem] text-muted">{status === "pending" ? t("waitingHelp") : (note ? t("rejectedWhy", { note }) : t("rejectedHelp"))}</p>
          {error ? <div className="mt-2"><Alert>{error}</Alert></div> : null}
          {status === "pending" && canDecide ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {rejecting ? (
                <>
                  <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t("reason")} aria-label={t("reason")} maxLength={200} className="h-9 w-72 max-w-full" autoFocus />
                  <Button variant="danger" onClick={() => void decide("reject")} disabled={busy || reason.trim().length < 3}>{t("reject")}</Button>
                  <Button variant="ghost" onClick={() => setRejecting(false)}>{t("back")}</Button>
                </>
              ) : (
                <>
                  <Button onClick={() => void decide("approve")} disabled={busy}>{t("approve")}</Button>
                  <Button variant="outline" onClick={() => setRejecting(true)} disabled={busy}>{t("rejectAsk")}</Button>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
