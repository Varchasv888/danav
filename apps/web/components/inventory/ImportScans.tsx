"use client";

import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Select } from "../ui";

interface Result { lines: number; codes: number; pieces: string; matched: number; extra: number; unknown: { code: string; line: number }[]; skipped: { line: number; text: string }[] }

/** Counts a handheld scanner's text file into this count: one scan or "code,quantity" per line. */
export function ImportScans({ countId }: { countId: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [mode, setMode] = useState<"add" | "replace">("add");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function pick(file: File | undefined) {
    if (!file) return;
    setError(null);
    setResult(null);
    if (file.size > 2_000_000) return setError(t("counts.import.tooBig"));
    setBusy(true);
    try {
      setResult(await api<Result>(`/stock-counts/${countId}/import-scans`, { body: { text: await file.text(), mode } }));
      router.refresh();
    } catch (err) { setError(errorText(t, err, ["counts.errors", "sj.errors"])); } finally { setBusy(false); }
  }

  return (
    <details className="rounded-md border border-border bg-surface-2/50 px-3 py-2 text-[0.9286rem]">
      <summary className="cursor-pointer font-medium">{t("counts.import.title")}</summary>
      <p className="mt-2 text-xs text-muted">{t("counts.import.help")}</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <Select aria-label={t("counts.import.mode")} value={mode} onChange={(e) => setMode(e.target.value as "add" | "replace")} className="h-8 w-60">
          <option value="add">{t("counts.import.add")}</option>
          <option value="replace">{t("counts.import.replace")}</option>
        </Select>
        <label className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-md border border-border bg-surface px-3 font-semibold text-primary hover:bg-primary-soft">
          <Upload className="size-4" aria-hidden />{busy ? t("counts.import.reading") : t("counts.import.choose")}
          <input type="file" accept=".txt,.csv,text/plain" className="sr-only" disabled={busy} onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = ""; }} />
        </label>
      </div>
      {error ? <div className="mt-2"><Alert>{error}</Alert></div> : null}
      {result ? (
        <div role="status" className="mt-2 flex flex-col gap-1">
          <p className="font-semibold text-success">{t("counts.import.done", { matched: result.matched, pieces: Number(result.pieces).toLocaleString("en-IN") })}</p>
          {result.extra ? <p className="text-xs text-muted">{t("counts.import.extra", { n: result.extra })}</p> : null}
          {result.unknown.length ? <p className="text-xs text-danger">{t("counts.import.unknown", { n: result.unknown.length, list: result.unknown.slice(0, 8).map((u) => `${u.code} (${u.line})`).join(", ") })}</p> : null}
          {result.skipped.length ? <p className="text-xs text-danger">{t("counts.import.skipped", { n: result.skipped.length, list: result.skipped.slice(0, 8).map((s) => s.line).join(", ") })}</p> : null}
        </div>
      ) : null}
    </details>
  );
}
