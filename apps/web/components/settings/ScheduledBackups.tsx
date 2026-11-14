"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Badge, Button, Field, Input, Select } from "../ui";

export interface BackupRun { id: string; startedAt: string; trigger: string; status: string; filename: string | null; bytes: number | null; sentTo: string[]; error: string | null }
export interface BackupState {
  enabled: boolean; frequency: "daily" | "weekly"; hour: number; weekday: number; recipients: string[]; hasPassphrase: boolean;
  nextRunAt: string | null; lastOkAt: string | null; lastError: string | null; overdue: boolean; runs: BackupRun[];
}

const NS = ["backup.schedule.errors", "backup.errors"];

/** The schedule for emailed, locked backups, a button to run one now, and how recent ones went. */
export function ScheduledBackups({ state }: { state: BackupState }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [enabled, setEnabled] = useState(state.enabled);
  const [frequency, setFrequency] = useState(state.frequency);
  const [hour, setHour] = useState(state.hour);
  const [weekday, setWeekday] = useState(state.weekday);
  const [recipients, setRecipients] = useState(state.recipients.join(", "));
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const when = (iso: string | null) => (iso ? format.dateTime(new Date(iso), { dateStyle: "medium", timeStyle: "short" }) : t("backup.schedule.never"));
  const why = (code: string | null) => (code ? (t.has(`backup.schedule.errors.${code}`) ? t(`backup.schedule.errors.${code}`) : code) : "");

  async function call(fn: () => Promise<void>) {
    setBusy(true);
    setError(null);
    setNote(null);
    try { await fn(); router.refresh(); } catch (err) { setError(errorText(t, err, NS)); } finally { setBusy(false); }
  }
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    void call(async () => {
      await api("/backups", { method: "PUT", body: { enabled, frequency, hour, weekday, recipients: recipients.split(",").map((r) => r.trim()).filter(Boolean), ...(passphrase ? { passphrase } : {}) } });
      setPassphrase("");
      setNote(t("backup.schedule.saved"));
    });
  };
  const runNow = () => call(async () => {
    const r = await api<{ ok: boolean; error: string | null }>("/backups/run", { body: {} });
    if (r.ok) setNote(t("backup.schedule.ranOk")); else setError(why(r.error));
  });

  return (
    <section className="flex flex-col gap-3 border-t border-border pt-4">
      <h2 className="font-semibold">{t("backup.schedule.title")}</h2>
      <p className="text-[0.9286rem] text-muted">{t("backup.schedule.help")}</p>
      {state.overdue ? <Alert>{t("backup.schedule.overdue")}</Alert> : null}
      {error ? <Alert>{error}</Alert> : null}
      {note ? <p role="status" className="text-sm text-success">{note}</p> : null}
      <form onSubmit={save} method="post" className="flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />{t("backup.schedule.enabled")}</label>
        <div className="flex flex-wrap items-end gap-4">
          <Field label={t("backup.schedule.frequency")} htmlFor="bk-freq">
            <Select id="bk-freq" value={frequency} onChange={(e) => setFrequency(e.target.value as "daily" | "weekly")} className="w-36">
              <option value="daily">{t("backup.schedule.daily")}</option><option value="weekly">{t("backup.schedule.weekly")}</option>
            </Select>
          </Field>
          {frequency === "weekly" ? (
            <Field label={t("backup.schedule.weekday")} htmlFor="bk-day">
              <Select id="bk-day" value={String(weekday)} onChange={(e) => setWeekday(Number(e.target.value))} className="w-36">
                {[1, 2, 3, 4, 5, 6, 0].map((d) => <option key={d} value={d}>{t(`schemes.day.d${d}`)}</option>)}
              </Select>
            </Field>
          ) : null}
          <Field label={t("backup.schedule.hour")} htmlFor="bk-hour">
            <Select id="bk-hour" value={String(hour)} onChange={(e) => setHour(Number(e.target.value))} className="w-28">
              {Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{String(h).padStart(2, "0")}:00</option>)}
            </Select>
          </Field>
        </div>
        <Field label={t("backup.schedule.recipients")} htmlFor="bk-to"><Input id="bk-to" value={recipients} onChange={(e) => setRecipients(e.target.value)} maxLength={400} /></Field>
        <Field label={t("backup.schedule.passphrase")} htmlFor="bk-pass" hint={state.hasPassphrase ? t("backup.schedule.passphraseSet") : t("backup.schedule.passphraseHint")}>
          <Input id="bk-pass" type="password" autoComplete="new-password" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} maxLength={200} />
        </Field>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={busy}>{t("backup.schedule.save")}</Button>
          <Button type="button" variant="outline" disabled={busy || !state.hasPassphrase || !state.recipients.length} onClick={runNow}>{busy ? t("backup.schedule.running") : t("backup.schedule.runNow")}</Button>
          <span className="text-sm text-muted">{state.enabled ? t("backup.schedule.next", { when: when(state.nextRunAt) }) : null} {t("backup.schedule.lastOk", { when: when(state.lastOkAt) })}</span>
        </div>
      </form>
      <div>
        <h3 className="mb-1 text-sm font-semibold">{t("backup.schedule.history")}</h3>
        {state.runs.length ? (
          <ul className="divide-y divide-border text-sm">
            {state.runs.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-1.5">
                <span className="whitespace-nowrap">{when(r.startedAt)}</span>
                <Badge tone={r.status === "ok" ? "success" : "danger"}>{r.status === "ok" ? t("backup.schedule.ok") : t("backup.schedule.failed")}</Badge>
                <span className="text-muted">{r.trigger === "manual" ? t("backup.schedule.manual") : t("backup.schedule.scheduled")}</span>
                {r.bytes ? <span className="text-muted">{t("backup.schedule.sizeKb", { n: Math.round(r.bytes / 1024) })}</span> : null}
                {r.status === "ok" && r.sentTo.length ? <span className="text-muted">{t("backup.schedule.sentTo", { who: r.sentTo.join(", ") })}</span> : null}
                {r.error ? <span className="text-danger">{why(r.error)}</span> : null}
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted">{t("backup.schedule.none")}</p>}
      </div>
    </section>
  );
}
