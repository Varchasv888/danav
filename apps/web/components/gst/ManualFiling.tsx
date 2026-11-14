"use client";

import { CheckCircle2, Paperclip } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { todayIso } from "@/lib/format";
import { Alert, Badge, Button, Card, Field, Input } from "../ui";

export interface Workpaper {
  returnType: "GSTR1" | "GSTR3B"; period: string; status: "prepared" | "reviewed" | "filed";
  manual: Record<string, unknown>; notes: string | null; reviewedAt: string | null; arn: string | null; filedOn: string | null;
  evidence: { id: string; name: string; size: number }[]; changedSinceReview: boolean; updatedAt: string | null;
}
type Heads = Partial<Record<"igst" | "cgst" | "sgst" | "cess", string>>;
const NS = ["gstmanual.errors", "filing.errors"];
const HEAD_ROWS: { key: string; heads: ("igst" | "cgst" | "sgst" | "cess")[] }[] = [
  { key: "importGoods", heads: ["igst", "cess"] }, { key: "importServices", heads: ["igst", "cess"] }, { key: "isd", heads: ["igst", "cgst", "sgst", "cess"] },
  { key: "reversalRules", heads: ["igst", "cgst", "sgst", "cess"] }, { key: "ineligibleRule", heads: ["igst", "cgst", "sgst", "cess"] }, { key: "ineligibleOther", heads: ["igst", "cgst", "sgst", "cess"] },
  { key: "interest", heads: ["igst", "cgst", "sgst", "cess"] }, { key: "lateFee", heads: ["cgst", "sgst"] },
];
const AMOUNT_ROWS = ["nonGstOutward", "exemptInwardInter", "exemptInwardIntra", "nonGstInwardInter", "nonGstInwardIntra"] as const;
const toBase64 = (f: File) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1] ?? ""); r.onerror = rej; r.readAsDataURL(f); });
const TONE = { prepared: "neutral", reviewed: "info", filed: "success" } as const;

/**
 * The manual-filing record for one return. The accountant files on the GST portal by hand; this keeps the figures that the books
 * cannot know (3B only), who reviewed, and, once filed, the ARN, the filing date and the proof. It never sends anything to the portal.
 */
export function ManualFiling({ wp, canPrepare, canSign }: { wp: Workpaper; canPrepare: boolean; canSign: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const is3b = wp.returnType === "GSTR3B";
  const idPrefix = is3b ? "wp-3b" : "wp-1";
  const locked = wp.status === "filed";
  const [manual, setManual] = useState<Record<string, Heads | string>>(wp.manual as Record<string, Heads | string>);
  const [notes, setNotes] = useState(wp.notes ?? "");
  const [arn, setArn] = useState("");
  const [filedOn, setFiledOn] = useState(todayIso());
  const [files, setFiles] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const base = { returnType: wp.returnType, period: wp.period };
  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true); setError(null);
    try { await fn(); router.refresh(); } catch (err) { setError(errorText(t, err, NS)); } finally { setBusy(false); }
  };
  const setHead = (key: string, head: string, value: string) => setManual((m) => ({ ...m, [key]: { ...(typeof m[key] === "object" ? (m[key] as Heads) : {}), [head]: value } }));
  const headValue = (key: string, head: string) => { const v = manual[key]; return typeof v === "object" && v ? ((v as Heads)[head as "igst"] ?? "") : ""; };
  const when = (iso: string) => format.dateTime(new Date(iso), { dateStyle: "medium" });

  const save = () => run(() => api("/gst/workpaper", { method: "PUT", body: { ...base, manual, notes } }));
  const move = (to: "reviewed" | "prepared", reason?: string) => run(() => api("/gst/workpaper/status", { body: { ...base, to, ...(reason ? { reason } : {}) } }));
  const reopen = () => { const reason = window.prompt(t("gstmanual.reopenPrompt")); if (reason && reason.trim()) void move("prepared", reason.trim()); };
  const record = () => run(async () => {
    await api("/gst/workpaper/status", { body: { ...base, to: "filed", arn, filedOn, evidenceFileIds: files.map((f) => f.id) } });
    setArn(""); setFiles([]);
  });
  async function attach(list: FileList | null) {
    if (!list) return;
    setError(null);
    try {
      for (const f of Array.from(list)) {
        const r = await api<{ id: string; name: string }>("/files", { body: { name: f.name, contentType: f.type === "image/jpg" ? "image/jpeg" : f.type, base64: await toBase64(f) } });
        setFiles((x) => [...x, { id: r.id, name: r.name }]);
      }
    } catch (err) { setError(errorText(t, err, NS)); }
  }

  return (
    <Card className="p-0">
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
        <h2 className="font-semibold">{t("gstmanual.title", { type: is3b ? "GSTR-3B" : "GSTR-1" })}</h2>
        <Badge tone={TONE[wp.status]}>{t(`gstmanual.status.${wp.status}`)}</Badge>
        <p className="basis-full text-sm text-muted">{t("gstmanual.note")}</p>
      </div>
      <div className="flex flex-col gap-4 px-4 py-4">
        {wp.changedSinceReview && wp.status !== "prepared" ? <Alert>{t("gstmanual.changed")}</Alert> : null}

        {is3b ? (
          <details open={wp.status === "prepared"}>
            <summary className="cursor-pointer text-sm font-semibold">{t("gstmanual.entries")}</summary>
            <p className="mt-1 mb-3 text-sm text-muted">{t("gstmanual.entriesHint")}</p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="text-left text-muted"><tr className="border-b border-border"><th className="px-2 py-1.5 font-medium" />{(["igst", "cgst", "sgst", "cess"] as const).map((h) => <th key={h} className="px-2 py-1.5 text-right font-medium">{h.toUpperCase()}</th>)}</tr></thead>
                <tbody>
                  {HEAD_ROWS.map((r) => (
                    <tr key={r.key} className="border-b border-border">
                      <td className="px-2 py-1.5">{t(`gstmanual.rows.${r.key}`)}</td>
                      {(["igst", "cgst", "sgst", "cess"] as const).map((h) => (
                        <td key={h} className="px-2 py-1">
                          {r.heads.includes(h) ? <Input aria-label={`${t(`gstmanual.rows.${r.key}`)} ${h.toUpperCase()}`} value={headValue(r.key, h)} onChange={(e) => setHead(r.key, h, e.target.value)} disabled={locked || !canPrepare} inputMode="decimal" className="num h-9 w-28 text-right" /> : null}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {AMOUNT_ROWS.map((k) => (
                <Field key={k} label={t(`gstmanual.rows.${k}`)} htmlFor={`${idPrefix}-${k}`}>
                  <Input id={`${idPrefix}-${k}`} value={typeof manual[k] === "string" ? (manual[k] as string) : ""} onChange={(e) => setManual((m) => ({ ...m, [k]: e.target.value }))} disabled={locked || !canPrepare} inputMode="decimal" className="num text-right" />
                </Field>
              ))}
            </div>
          </details>
        ) : null}

        <Field label={t("gstmanual.notes")} htmlFor={`${idPrefix}-notes`}>
          <textarea id={`${idPrefix}-notes`} value={notes} onChange={(e) => setNotes(e.target.value)} disabled={locked || !canPrepare} maxLength={2000} rows={2}
            className="w-full rounded-md border border-border-input bg-surface px-3 py-2 text-[0.9286rem] text-text focus:border-ring focus:outline-none disabled:opacity-60" />
        </Field>
        {!locked && canPrepare ? <div><Button variant="outline" disabled={busy} onClick={save}>{t("gstmanual.save")}</Button></div> : null}

        {wp.status === "prepared" && canSign ? (
          <div className="border-t border-border pt-4"><Button disabled={busy} onClick={() => move("reviewed")}>{t("gstmanual.markReviewed")}</Button><p className="mt-1 text-xs text-muted">{t("gstmanual.reviewHint")}</p></div>
        ) : null}

        {wp.status === "reviewed" ? (
          <div className="flex flex-col gap-3 border-t border-border pt-4">
            <p className="text-sm text-muted">{wp.reviewedAt ? t("gstmanual.reviewedOn", { date: when(wp.reviewedAt) }) : null}</p>
            {canSign ? (
              <>
                <p className="text-sm">{t("gstmanual.recordHint")}</p>
                <div className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
                  <Field label={t("gstmanual.arn")} htmlFor={`${idPrefix}-arn`} hint={t("gstmanual.arnHint")}><Input id={`${idPrefix}-arn`} value={arn} onChange={(e) => setArn(e.target.value.toUpperCase())} maxLength={15} className="font-mono" autoComplete="off" /></Field>
                  <Field label={t("gstmanual.filedOn")} htmlFor={`${idPrefix}-date`}><Input id={`${idPrefix}-date`} type="date" value={filedOn} max={todayIso()} onChange={(e) => setFiledOn(e.target.value)} /></Field>
                </div>
                <Field label={t("gstmanual.evidence")} htmlFor={`${idPrefix}-evidence`} hint={t("gstmanual.evidenceHint")}>
                  <input id={`${idPrefix}-evidence`} type="file" multiple accept="application/pdf,image/png,image/jpeg" onChange={(e) => { void attach(e.target.files); e.target.value = ""; }} className="text-sm" />
                </Field>
                {files.length ? <ul className="text-sm text-muted">{files.map((f) => <li key={f.id} className="flex items-center gap-1.5"><Paperclip className="size-3.5" aria-hidden />{f.name}</li>)}</ul> : null}
                <div className="flex flex-wrap gap-2">
                  <Button disabled={busy || !arn || !filedOn} onClick={record}>{t("gstmanual.recordFiled")}</Button>
                  <Button variant="ghost" disabled={busy} onClick={reopen}>{t("gstmanual.reopen")}</Button>
                </div>
              </>
            ) : null}
          </div>
        ) : null}

        {locked ? (
          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <p className="flex items-center gap-1.5 text-sm text-success"><CheckCircle2 className="size-4" aria-hidden />{t("gstmanual.filedLine", { date: wp.filedOn ? when(`${wp.filedOn}T00:00:00`) : "" })} · {t("filing.arn")} <span className="font-mono">{wp.arn}</span></p>
            {wp.evidence.length ? <ul className="text-sm">{wp.evidence.map((f) => <li key={f.id}><a href={`/api/files/${f.id}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline"><Paperclip className="size-3.5" aria-hidden />{f.name}</a></li>)}</ul> : <p className="text-sm text-muted">{t("gstmanual.noEvidence")}</p>}
            {canSign ? <div><Button variant="ghost" disabled={busy} onClick={reopen}>{t("gstmanual.reopen")}</Button></div> : null}
          </div>
        ) : null}
        {error ? <Alert>{error}</Alert> : null}
      </div>
    </Card>
  );
}
