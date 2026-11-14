"use client";

import { EMPLOYEE_DOCUMENT_KINDS } from "@varchasv/domain";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { todayIso } from "@/lib/format";
import { Alert, Badge, Button, Card, Field, Input, Select } from "../ui";

export interface EmployeeDocument { id: string; kind: string; number: string | null; issuedOn: string | null; expiresOn: string | null; note: string | null }

/** Identity and compliance documents for one employee, with the ones about to lapse flagged. */
export function EmployeeDocuments({ employeeId, documents, canEdit }: { employeeId: string; documents: EmployeeDocument[]; canEdit: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  const today = todayIso();
  const daysLeft = (iso: string) => Math.round((Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);

  async function run(fn: () => Promise<unknown>) {
    setError(null);
    setBusy(true);
    try { await fn(); router.refresh(); return true; } catch (err) { setError(errorText(t, err, ["hr.errors"])); return false; } finally { setBusy(false); }
  }

  return (
    <Card>
      <h2 className="mb-1 font-semibold">{t("hr.documents.title")}</h2>
      <p className="mb-3 text-[0.9286rem] text-muted">{t("hr.documents.help")}</p>
      {error ? <div className="mb-3"><Alert>{error}</Alert></div> : null}
      {documents.length ? (
        <ul className="mb-4 divide-y divide-rule text-[0.9286rem]">
          {documents.map((d) => {
            const left = d.expiresOn ? daysLeft(d.expiresOn) : null;
            return (
              <li key={d.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2">
                <span className="w-44 font-medium">{t(`hr.documents.kinds.${d.kind}`)}</span>
                <span className="font-mono text-xs text-muted">{d.number}</span>
                <span className="text-muted">{d.expiresOn ? t("hr.documents.expires", { date: day(d.expiresOn) }) : t("hr.documents.noExpiry")}</span>
                {left !== null && left < 0 ? <Badge tone="danger">{t("hr.documents.expired")}</Badge> : left !== null && left <= 30 ? <Badge tone="warning">{t("hr.documents.daysLeft", { n: left })}</Badge> : null}
                {d.note ? <span className="text-xs text-muted">{d.note}</span> : null}
                {canEdit ? <button type="button" disabled={busy} onClick={() => void run(() => api(`/employees/${employeeId}/documents/${d.id}`, { method: "DELETE" }))} className="ml-auto text-xs text-danger hover:underline">{t("hr.documents.remove")}</button> : null}
              </li>
            );
          })}
        </ul>
      ) : <p className="mb-4 text-[0.9286rem] text-muted">{t("hr.documents.none")}</p>}
      {canEdit ? (
        <form method="post" className="flex flex-wrap items-end gap-3 border-t border-border pt-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const f = new FormData(form);
            const v = (k: string) => String(f.get(k) ?? "").trim() || null;
            if (await run(() => api(`/employees/${employeeId}/documents`, { body: { kind: v("kind"), number: v("number"), issuedOn: v("issuedOn"), expiresOn: v("expiresOn"), note: v("note") } }))) form.reset();
          }}>
          <Field label={t("hr.documents.kind")} htmlFor="ed-kind"><Select id="ed-kind" name="kind" className="w-48">{EMPLOYEE_DOCUMENT_KINDS.map((k) => <option key={k} value={k}>{t(`hr.documents.kinds.${k}`)}</option>)}</Select></Field>
          <Field label={t("hr.documents.number")} htmlFor="ed-no"><Input id="ed-no" name="number" maxLength={40} className="w-44 font-mono" autoComplete="off" /></Field>
          <Field label={t("hr.documents.issuedOn")} htmlFor="ed-iss"><Input id="ed-iss" name="issuedOn" type="date" /></Field>
          <Field label={t("hr.documents.expiresOnLabel")} htmlFor="ed-exp"><Input id="ed-exp" name="expiresOn" type="date" /></Field>
          <Button type="submit" disabled={busy}><Plus className="size-4" aria-hidden />{t("hr.documents.add")}</Button>
        </form>
      ) : null}
    </Card>
  );
}
