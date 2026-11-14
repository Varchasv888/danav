"use client";

import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { parseLineImport, type ImportableItem } from "@varchasv/domain";
import { Alert } from "../ui";

/** Reads a CSV or text file of item codes and quantities and hands the matching lines to the bill; what could not be used is listed. */
export function ImportLinesButton({ items, onAdd }: { items: ImportableItem[]; onAdd: (lines: { itemId: string; qty: string; rate?: string }[]) => void }) {
  const t = useTranslations("sales");
  const [note, setNote] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);

  async function pick(file: File | undefined) {
    if (!file) return;
    setNote(null);
    setProblem(null);
    if (file.size > 1_000_000) return setProblem(t("importTooBig"));
    const r = parseLineImport(await file.text(), items);
    if (r.lines.length) onAdd(r.lines);
    setNote(t("importDone", { n: r.lines.length }));
    const bits = [
      r.unknown.length ? t("importUnknown", { n: r.unknown.length, list: r.unknown.slice(0, 6).map((u) => `${u.code} (${u.line})`).join(", ") }) : "",
      r.bad.length ? t("importBad", { n: r.bad.length, list: r.bad.slice(0, 6).map((b) => b.line).join(", ") }) : "",
    ].filter(Boolean);
    if (bits.length) setProblem(bits.join(" "));
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="mt-2 inline-flex h-9 cursor-pointer items-center gap-2 rounded-md px-3 text-[0.9286rem] font-medium text-primary hover:bg-primary-soft">
        <Upload className="size-4" aria-hidden />{t("importLines")}
        <input type="file" accept=".csv,.txt,text/plain,text/csv" className="sr-only" onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = ""; }} />
      </label>
      {note ? <p role="status" className="px-3 text-xs text-success">{note}</p> : null}
      {problem ? <div className="px-3"><Alert>{problem}</Alert></div> : null}
    </div>
  );
}
