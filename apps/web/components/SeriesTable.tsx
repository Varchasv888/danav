"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { checkSeriesPattern } from "@varchasv/domain";
import { ApiError, api } from "@/lib/client-api";
import { Alert, Button, Card, Input } from "./ui";

export interface Series { id: string; docType: string; name: string; pattern: string; nextSeq: number; nextNumber: string; fiscalYear: string }

export function SeriesTable({ series, canEdit }: { series: Series[]; canEdit: boolean }) {
  const t = useTranslations("series");
  const tc = useTranslations("common");
  const router = useRouter();
  const [editing, setEditing] = useState<string | null>(null);
  const [pattern, setPattern] = useState("");
  const [error, setError] = useState<string | null>(null);

  const problem = editing ? checkSeriesPattern(pattern) : null;

  async function save(id: string) {
    setError(null);
    try {
      await api(`/number-series/${id}`, { method: "PATCH", body: { pattern } });
      setEditing(null);
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "generic";
      setError(t.has(`errors.${code}`) ? t(`errors.${code}`) : code);
    }
  }

  return (
    <Card>
      <p className="mb-4 font-mono text-xs text-muted">{t("tokens")}</p>
      {error ? <div className="mb-4"><Alert>{error}</Alert></div> : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-muted">
            <tr className="border-b border-border">
              <th className="py-2 pr-4 font-medium">{t("docType")}</th>
              <th className="py-2 pr-4 font-medium">{t("pattern")}</th>
              <th className="py-2 pr-4 font-medium">{t("next")}</th>
              <th className="py-2 pr-4 font-medium">{t("fy")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {series.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0">
                <td className="py-2.5 pr-4">{t.has(`types.${s.docType}`) ? t(`types.${s.docType}`) : s.name}</td>
                <td className="py-2.5 pr-4 font-mono">
                  {editing === s.id ? (
                    <div className="flex flex-col gap-1">
                      <Input value={pattern} onChange={(e) => setPattern(e.target.value)} aria-invalid={!!problem} className="font-mono" maxLength={40} autoFocus />
                      {problem ? <span className="font-sans text-xs text-danger">{t(`errors.series_${problem}`)}</span> : null}
                    </div>
                  ) : s.pattern}
                </td>
                <td className="py-2.5 pr-4 font-mono">{s.nextNumber}</td>
                <td className="py-2.5 pr-4">{s.fiscalYear}</td>
                <td className="py-2.5 text-right whitespace-nowrap">
                  {canEdit && editing !== s.id ? <Button variant="ghost" onClick={() => { setEditing(s.id); setPattern(s.pattern); setError(null); }}>{tc("edit")}</Button> : null}
                  {editing === s.id ? (
                    <span className="inline-flex gap-2">
                      <Button onClick={() => save(s.id)} disabled={!!problem}>{tc("save")}</Button>
                      <Button variant="ghost" onClick={() => setEditing(null)}>{tc("cancel")}</Button>
                    </span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
