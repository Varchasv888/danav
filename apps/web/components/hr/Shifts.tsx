"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Card, Input } from "../ui";

export interface Shift { id: string; name: string; startTime: string; endTime: string; graceMinutes: number; fullDayMinutes: number; halfDayMinutes: number; isDefault: boolean }
type Draft = Omit<Shift, "id"> & { id?: string };
const blank: Draft = { name: "", startTime: "09:30", endTime: "18:30", graceMinutes: 10, fullDayMinutes: 480, halfDayMinutes: 240, isDefault: false };

/** Shifts that biometric punches are read against. */
export function Shifts({ shifts, canEdit }: { shifts: Shift[]; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [rows, setRows] = useState<Draft[]>(shifts);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<number | null>(null);
  const set = (i: number, patch: Partial<Draft>) => setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  async function save(i: number) {
    const { id, ...body } = rows[i]!;
    setError(null);
    try {
      const r = await api<Shift>(id ? `/shifts/${id}` : "/shifts", { method: id ? "PUT" : "POST", body });
      setRows(rows.map((x, j) => (j === i ? r : body.isDefault ? { ...x, isDefault: false } : x)));
      setSaved(i);
      router.refresh();
    } catch (err) {
      setError(errorText(t, err, ["payroll.errors", "hr.errors"]));
    }
  }
  const num = (i: number, k: "graceMinutes" | "fullDayMinutes" | "halfDayMinutes") => (
    <td className="px-2 py-1.5"><Input value={String(rows[i]![k])} onChange={(e) => set(i, { [k]: Number(e.target.value) || 0 })} inputMode="numeric" disabled={!canEdit} className="num w-20 text-right" aria-label={t(`hr.shifts.${k === "graceMinutes" ? "grace" : k === "fullDayMinutes" ? "fullDay" : "halfDay"}`)} /></td>
  );
  return (
    <Card className="max-w-4xl p-0">
      <h2 className="border-b border-border px-5 py-3 font-semibold">{t("hr.shifts.title")}</h2>
      {!rows.length ? <p className="px-5 pt-4 text-sm text-muted">{t("hr.shifts.none")}</p> : null}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {rows.length ? (
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                {(["name", "start", "end", "grace", "fullDay", "halfDay", "isDefault"] as const).map((k) => <th key={k} className="px-2 py-2 font-medium">{t(`hr.shifts.${k}`)}</th>)}
                <th />
              </tr>
            </thead>
          ) : null}
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id ?? `new-${i}`} className="border-b border-border last:border-0">
                <td className="px-2 py-1.5"><Input value={r.name} onChange={(e) => set(i, { name: e.target.value })} maxLength={40} disabled={!canEdit} aria-label={t("hr.shifts.name")} /></td>
                <td className="px-2 py-1.5"><Input type="time" value={r.startTime} onChange={(e) => set(i, { startTime: e.target.value })} disabled={!canEdit} aria-label={t("hr.shifts.start")} /></td>
                <td className="px-2 py-1.5"><Input type="time" value={r.endTime} onChange={(e) => set(i, { endTime: e.target.value })} disabled={!canEdit} aria-label={t("hr.shifts.end")} /></td>
                {num(i, "graceMinutes")}{num(i, "fullDayMinutes")}{num(i, "halfDayMinutes")}
                <td className="px-2 py-1.5 text-center"><input type="checkbox" checked={r.isDefault} onChange={(e) => set(i, { isDefault: e.target.checked })} disabled={!canEdit} className="size-4 accent-[var(--primary)]" aria-label={t("hr.shifts.isDefault")} /></td>
                <td className="px-2 py-1.5 whitespace-nowrap">
                  {canEdit ? <Button variant="outline" className="h-8 px-3" onClick={() => save(i)} disabled={!r.name.trim()}>{t("hr.shifts.save")}</Button> : null}
                  {saved === i ? <span className="ml-2 text-xs text-success">{t("common.saved")}</span> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {canEdit ? <div className="px-5 py-3"><Button variant="ghost" className="-ml-3" onClick={() => setRows([...rows, { ...blank }])}>{t("hr.shifts.add")}</Button></div> : null}
      {error ? <div className="px-5 pb-4"><Alert>{error}</Alert></div> : null}
    </Card>
  );
}
