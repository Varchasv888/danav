"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Badge, Button, Field, Input } from "../ui";

/** When this consignee is due to settle, how many days they get, and who follows up differences. */
export function ConsigneeTerms({ customerId, settlementDays, owner, due, overdue, discrepancies, canEdit, statementFrequency = null, statementEmail = null }: {
  customerId: string; settlementDays: number; owner: string | null; due: string | null; overdue: boolean; discrepancies: number; canEdit: boolean;
  statementFrequency?: "weekly" | "monthly" | null; statementEmail?: string | null;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [days, setDays] = useState(String(settlementDays));
  const [who, setWho] = useState(owner ?? "");
  const [freq, setFreq] = useState<string>(statementFrequency ?? "");
  const [email, setEmail] = useState(statementEmail ?? "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try { await api(`/consignees/${customerId}/terms`, { method: "PUT", body: { settlementDays: Number(days), discrepancyOwner: who || null, statementFrequency: freq || null, statementEmail: email.trim() || null } }); router.refresh(); } catch (err) { setError(errorText(t, err, ["consignment.errors"])); } finally { setBusy(false); }
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-surface p-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="font-medium">{t("consignment.settlement")}</span>
        {due ? <span>{t("consignment.dueOn", { date: format.dateTime(new Date(`${due}T00:00:00`), { dateStyle: "medium" }) })}</span> : <span className="text-muted">{t("consignment.nothingOut")}</span>}
        {overdue ? <Badge tone="danger">{t("consignment.settlementLate")}</Badge> : null}
        {discrepancies ? <Badge tone="warning">{t("consignment.differences", { n: discrepancies })}</Badge> : null}
        {owner ? <span className="text-muted">{t("consignment.followedBy", { name: owner })}</span> : null}
      </div>
      {canEdit ? (
        <form onSubmit={save} method="post" className="flex flex-wrap items-end gap-3">
          <Field label={t("consignment.days")} htmlFor="ct-days"><Input id="ct-days" inputMode="numeric" value={days} onChange={(e) => setDays(e.target.value.replace(/\D/g, "").slice(0, 3))} className="num w-24 text-right" /></Field>
          <Field label={t("consignment.owner")} htmlFor="ct-owner"><Input id="ct-owner" value={who} onChange={(e) => setWho(e.target.value)} maxLength={80} className="w-60" /></Field>
          <Field label={t("consignment.statementFrequency")} htmlFor="ct-freq"><select id="ct-freq" value={freq} onChange={(e) => setFreq(e.target.value)} className="h-9 rounded-md border border-border bg-surface px-2 text-sm"><option value="">{t("consignment.statementNone")}</option><option value="weekly">{t("consignment.statementWeekly")}</option><option value="monthly">{t("consignment.statementMonthly")}</option></select></Field>
          {freq ? <Field label={t("consignment.statementEmail")} htmlFor="ct-email"><Input id="ct-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-64" /></Field> : null}
          <Button type="submit" variant="outline" disabled={busy || !days}>{t("common.save")}</Button>
        </form>
      ) : null}
      {error ? <Alert>{error}</Alert> : null}
    </div>
  );
}
