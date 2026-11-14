"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Card, Input } from "../ui";

interface Lock { docType: string; name: string; lockedUpTo: string | null }

/** Lock one kind of document up to a date, apart from locking the whole period. */
export function ProcessLocks({ locks, canEdit }: { locks: Lock[]; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [dates, setDates] = useState<Record<string, string>>(Object.fromEntries(locks.map((l) => [l.docType, l.lockedUpTo ?? ""])));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const save = async (docType: string, lockedUpTo: string | null) => {
    setBusy(true); setError(null);
    try { await api("/settings/process-locks", { method: "PUT", body: { docType, lockedUpTo } }); router.refresh(); } catch (err) { setError(errorText(t, err, ["processLocks.errors"])); } finally { setBusy(false); }
  };
  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      <Card className="p-0">
        <p className="px-4 py-2 text-sm text-muted">{t("processLocks.help")}</p>
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted"><tr className="border-y border-rule"><th className="px-4 py-1.5 font-medium">{t("processLocks.kind")}</th><th className="px-4 py-1.5 font-medium">{t("processLocks.lockedUpTo")}</th><th /></tr></thead>
          <tbody>{locks.map((l) => (
            <tr key={l.docType} className="border-b border-rule last:border-0">
              <td className="px-4 py-1.5">{l.name}</td>
              <td className="px-4 py-1.5"><Input type="date" value={dates[l.docType] ?? ""} onChange={(e) => setDates({ ...dates, [l.docType]: e.target.value })} disabled={!canEdit} className="w-44" /></td>
              <td className="px-4 py-1.5 text-right">{canEdit ? <span className="flex justify-end gap-2"><Button type="button" variant="outline" disabled={busy || !dates[l.docType]} onClick={() => save(l.docType, dates[l.docType]!)}>{t("processLocks.lock")}</Button>{l.lockedUpTo ? <Button type="button" variant="ghost" disabled={busy} onClick={() => save(l.docType, null)}>{t("processLocks.open")}</Button> : null}</span> : null}</td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
}
