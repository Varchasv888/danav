"use client";

import clsx from "clsx";
import { Download, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { parseCsv } from "../gst/ImportWizard";
import { Alert, Button, Card } from "../ui";

interface Result { row: number; code: string; date: string; status?: string; worked?: number; late?: boolean; error?: string }
const SAMPLE = "code,date,in,out\nE0001,2026-09-01,09:02,18:15\nE0001,2026-09-02,09:41,14:05\n";

/** Biometric export in, dry run shown, then imported. Columns: code, date, in, out. */
export function PunchImport() {
  const t = useTranslations();
  const router = useRouter();
  const [rows, setRows] = useState<{ code: string; date: string; in: string; out: string }[] | null>(null);
  const [results, setResults] = useState<Result[] | null>(null);
  const [done, setDone] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function send(dryRun: boolean, body = rows) {
    if (!body) return;
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ results: Result[]; imported: number }>("/attendance/import", { body: { rows: body, dryRun } });
      setResults(r.results);
      if (!dryRun) { setDone(r.imported); router.refresh(); }
    } catch (err) {
      setError(errorText(t, err, ["hr.errors", "payroll.errors"]));
    } finally {
      setBusy(false);
    }
  }
  async function onFile(file: File) {
    const [header, ...body] = parseCsv(await file.text());
    const cols = (header ?? []).map((h) => h.trim().toLowerCase());
    const at = (r: string[], name: string) => (r[cols.indexOf(name)] ?? "").trim();
    const parsed = body.map((r) => ({ code: at(r, "code"), date: at(r, "date"), in: at(r, "in"), out: at(r, "out") }));
    setRows(parsed);
    setDone(null);
    await send(true, parsed);
  }
  const ok = results?.filter((r) => !r.error).length ?? 0;
  const hm = (m?: number) => (m === undefined ? "" : `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`);

  return (
    <Card>
      <h2 className="font-semibold">{t("hr.punches.title")}</h2>
      <p className="mt-1 text-sm text-muted">{t("hr.punches.hint")}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-2">
          <Upload className="size-4" aria-hidden />{t("hr.punches.choose")}
          <input type="file" accept=".csv" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) void onFile(f); e.target.value = ""; }} />
        </label>
        <button type="button" className="inline-flex items-center gap-2 text-sm text-primary hover:underline" onClick={() => {
          const url = URL.createObjectURL(new Blob([SAMPLE], { type: "text/csv" }));
          Object.assign(document.createElement("a"), { href: url, download: "punches.csv" }).click();
          URL.revokeObjectURL(url);
        }}><Download className="size-4" aria-hidden />{t("hr.punches.template")}</button>
        {results && done === null && ok ? <Button disabled={busy} onClick={() => send(false)}>{t("hr.punches.import", { count: ok })}</Button> : null}
        {done !== null ? <span className="text-sm text-success">{t("hr.punches.done", { count: done })}</span> : null}
      </div>
      {error ? <div className="mt-3"><Alert>{error}</Alert></div> : null}
      {results ? (
        <div className="mt-4 max-h-80 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-surface text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-3 py-2 font-medium">{t("hr.punches.row")}</th><th className="px-3 py-2 font-medium">{t("hr.punches.code")}</th>
                <th className="px-3 py-2 font-medium">{t("hr.punches.date")}</th><th className="px-3 py-2 text-right font-medium">{t("hr.punches.worked")}</th>
                <th className="px-3 py-2 font-medium">{t("hr.punches.status")}</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.row} className="border-b border-border last:border-0">
                  <td className="num px-3 py-1.5">{r.row}</td><td className="px-3 py-1.5 font-mono">{r.code}</td><td className="px-3 py-1.5">{r.date}</td>
                  <td className="num px-3 py-1.5 text-right">{hm(r.worked)}</td>
                  <td className={clsx("px-3 py-1.5", r.error ? "text-danger" : r.status === "absent" ? "text-danger" : r.status === "half_day" ? "text-accent" : "text-success")}>
                    {r.error ? (t.has(`hr.errors.${r.error}`) ? t(`hr.errors.${r.error}`) : t.has(`payroll.errors.${r.error}`) ? t(`payroll.errors.${r.error}`) : r.error)
                      : `${t(`hr.attendance.legend.${r.status}`)}${r.late ? ` · ${t("hr.punches.late")}` : ""}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </Card>
  );
}
