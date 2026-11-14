"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { StatusBadge } from "../StatusBadge";
import { Alert, Button, Card, Field, Input } from "../ui";

export interface ChangeRequest {
  id: string; kind: string; entityName: string; before: Bank | null; after: Bank | null; status: "pending" | "approved" | "rejected";
  requestedBy: string | null; requestedByName: string | null; decisionNote: string | null; createdAt: string;
}
interface Bank { accountNumber?: string; ifsc?: string; branch?: string }

/** Account numbers are shown by their last four digits only. */
const mask = (b: Bank | null) => (b ? [b.accountNumber ? `•••• ${b.accountNumber.slice(-4)}` : null, b.ifsc, b.branch].filter(Boolean).join(", ") : "");

/** The approval switch and the queue of changes waiting for a decision. */
export function Approvals({ bankChange, requests, userId, canSwitch, canDecide }: { bankChange: boolean; requests: ChangeRequest[]; userId: string; canSwitch: boolean; canDecide: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const pending = requests.filter((r) => r.status === "pending");
  const decided = requests.filter((r) => r.status !== "pending");

  async function call(fn: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    try { await fn(); setNote(""); router.refresh(); } catch (err) { setError(errorText(t, err, ["approvals.errors"])); } finally { setBusy(false); }
  }

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      <Card>
        <label className="flex items-start gap-3 text-[0.9286rem]">
          <input type="checkbox" className="mt-1 size-4" checked={bankChange} disabled={!canSwitch || busy} onChange={(e) => call(() => api("/settings/approvals", { method: "PUT", body: { bankChange: e.target.checked } }))} />
          <span><span className="font-medium">{t("approvals.bankSwitch")}</span><span className="block text-xs text-muted">{t("approvals.bankHelp")}</span></span>
        </label>
      </Card>
      <Card className="p-0">
        <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("approvals.waiting")}</h2>
        {pending.length ? (
          <ul>
            {pending.map((r) => (
              <li key={r.id} className="border-b border-rule px-4 py-3 text-sm last:border-0">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="font-medium">{r.entityName}</span>
                  <span className="font-mono text-xs">{mask(r.before) || t("approvals.none")} <span className="text-muted">{t("approvals.to")}</span> {mask(r.after) || t("approvals.none")}</span>
                  <span className="text-muted">{t("approvals.askedBy", { name: r.requestedByName ?? "" })}, {format.dateTime(new Date(r.createdAt), { dateStyle: "medium" })}</span>
                </div>
                {canDecide ? (
                  r.requestedBy === userId ? <p className="mt-1 text-xs text-muted">{t("approvals.ownRequest")}</p> : (
                    <div className="mt-2 flex flex-wrap items-end gap-2">
                      <Field label={t("approvals.note")} htmlFor={`ap-${r.id}`}><Input id={`ap-${r.id}`} value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} className="w-64" /></Field>
                      <Button type="button" disabled={busy} onClick={() => call(() => api(`/change-requests/${r.id}/decide`, { body: { decision: "approve", note: note || undefined } }))}>{t("approvals.approve")}</Button>
                      <Button type="button" variant="outline" disabled={busy} onClick={() => call(() => api(`/change-requests/${r.id}/decide`, { body: { decision: "reject", note: note || undefined } }))}>{t("approvals.reject")}</Button>
                    </div>
                  )
                ) : null}
              </li>
            ))}
          </ul>
        ) : <p className="px-4 py-6 text-center text-muted">{t("approvals.nonePending")}</p>}
      </Card>
      {decided.length ? (
        <Card className="p-0">
          <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("approvals.history")}</h2>
          <ul>
            {decided.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-rule px-4 py-2 text-sm last:border-0">
                <span className="font-medium">{r.entityName}</span><span className="font-mono text-xs">{mask(r.after)}</span>
                <StatusBadge status={r.status === "approved" ? "closed" : "cancelled"} label={t(`approvals.status.${r.status}`)} />
                {r.decisionNote ? <span className="text-xs text-muted">{r.decisionNote}</span> : null}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
