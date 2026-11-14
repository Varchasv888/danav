"use client";

import { Lock, LockOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { Alert, Button, Card, Input } from "../ui";

export interface FiscalYear { id: string; label: string; startsOn: string; endsOn: string; lockedUpTo: string | null; closed: boolean }

export function FiscalYearLocks({ years, canLock }: { years: FiscalYear[]; canLock: boolean }) {
  const t = useTranslations("fy");
  const format = useFormatter();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [dates, setDates] = useState<Record<string, string>>({});
  const d = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });

  async function setLock(id: string, lockedUpTo: string | null) {
    setError(null);
    try {
      await api(`/fiscal-years/${id}`, { method: "PATCH", body: { lockedUpTo } });
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "generic";
      setError(t.has(`errors.${code}`) ? t(`errors.${code}`) : code);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      <Card className="p-0">
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr className="border-b border-border">
              <th className="px-5 py-3 font-medium">{t("year")}</th>
              <th className="px-5 py-3 font-medium">{t("period")}</th>
              <th className="px-5 py-3 font-medium">{t("lockedUpTo")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {years.map((y) => (
              <tr key={y.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium">{y.label}</td>
                <td className="px-5 py-3 text-muted">{d(y.startsOn)} – {d(y.endsOn)}</td>
                <td className="px-5 py-3">
                  {y.lockedUpTo ? (
                    <span className="inline-flex items-center gap-1.5 text-accent"><Lock className="size-4" aria-hidden />{d(y.lockedUpTo)}</span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-muted"><LockOpen className="size-4" aria-hidden />{t("open")}</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  {canLock ? (
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Input type="date" min={y.startsOn} max={y.endsOn} value={dates[y.id] ?? y.lockedUpTo ?? ""} onChange={(e) => setDates((s) => ({ ...s, [y.id]: e.target.value }))} className="w-44" aria-label={`${t("lockedUpTo")} ${y.label}`} />
                      <Button variant="outline" disabled={!(dates[y.id] ?? y.lockedUpTo)} onClick={() => setLock(y.id, dates[y.id] ?? y.lockedUpTo)}>{t("lock")}</Button>
                      {y.lockedUpTo ? <Button variant="ghost" onClick={() => setLock(y.id, null)}>{t("unlock")}</Button> : null}
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
