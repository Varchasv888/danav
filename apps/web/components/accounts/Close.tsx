"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Badge, Button, Card, Input } from "../ui";

export interface CheckItem { key: string; severity: "error" | "warn"; group: string; count: number; amount: string | null; items: { ref: string; detail: string }[]; signed: { by: string | null; at: string; note: string | null } | null; clear: boolean }
export interface Checklist { period: string; ready: boolean; open: number; closed: { at: string; reopened: boolean } | null; items: CheckItem[] }
export interface Snapshots { snapshots: { id: string; kind: string; version: number; takenAt: string; takenBy: string | null }[]; restatements: { kind: string; from: number; to: number; changes: { field: string; was: string; now: string }[] }[] }
export interface DayClose { date: string; open: number; needSignOff: number; totalDifference: string; sessions: { id: string; terminal: string; status: string; closedBy: string | null; expectedCash: string | null; countedCash: string | null; difference: string | null; needsSignOff: boolean; signNote: string | null }[] }

const GROUPS = ["documents", "reconcile", "cutoff", "books"] as const;
const NS = ["close.errors", "hr.errors"];

/** The month-end checklist and the saved reports, and each day's point-of-sale close. */
export function Close({ period, date, checklist, snapshots, day, canApprove, canSignCash }: { period: string; date: string; checklist: Checklist; snapshots: Snapshots; day: DayClose; canApprove: boolean; canSignCash: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const money = (v: string | null) => format.number(Number(v ?? 0), { style: "currency", currency: "INR" });
  const call = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try { await fn(); router.refresh(); } catch (err) { setError(errorText(t, err, NS)); } finally { setBusy(false); }
  };
  const ask = (key: string, fn: (note: string) => Promise<unknown>) => {
    const note = window.prompt(t(key));
    if (note && note.trim().length >= 3) void call(() => fn(note.trim()));
  };

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}

      <Card>
        <form className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm">{t("close.month")}<Input name="period" type="month" defaultValue={period} className="w-44" /></label>
          <Button type="submit" variant="outline">{t("common.apply")}</Button>
          <span className="ml-auto flex items-center gap-2 text-sm">
            {checklist.closed && !checklist.closed.reopened ? <Badge tone="success">{t("close.closedOn", { when: format.dateTime(new Date(checklist.closed.at), { dateStyle: "medium" }) })}</Badge>
              : checklist.closed?.reopened ? <Badge tone="warning">{t("close.reopened")}</Badge>
              : checklist.ready ? <Badge tone="success">{t("close.ready")}</Badge> : <Badge tone="warning">{t("close.openCount", { n: checklist.open })}</Badge>}
          </span>
        </form>
      </Card>

      {GROUPS.map((g) => (
        <Card key={g} className="p-0">
          <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t(`close.groups.${g}`)}</h2>
          <ul>
            {checklist.items.filter((i) => i.group === g).map((i) => (
              <li key={i.key} className="border-b border-rule px-4 py-2.5 text-sm last:border-0">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="font-medium">{t(`close.checks.${i.key}`)}</span>
                  {i.count === 0 ? <Badge tone="success">{t("close.clear")}</Badge> : i.signed ? <Badge tone="neutral">{t("close.signedOff")}</Badge> : <Badge tone={i.severity === "error" ? "danger" : "warning"}>{t("close.count", { n: i.count })}</Badge>}
                  {i.amount ? <span className="num text-muted">{money(i.amount)}</span> : null}
                  {i.signed ? <span className="text-xs text-muted">{i.signed.by}: {i.signed.note}</span> : null}
                  {canApprove && i.count > 0 && !(checklist.closed && !checklist.closed.reopened) ? (
                    i.signed ? <button type="button" disabled={busy} onClick={() => call(() => api(`/close/signoff?period=${period}&key=${i.key}`, { method: "DELETE" }))} className="ml-auto text-primary hover:underline">{t("close.unsign")}</button>
                      : <button type="button" disabled={busy} onClick={() => ask("close.notePrompt", (note) => api("/close/signoff", { body: { period, key: i.key, note } }))} className="ml-auto text-primary hover:underline">{t("close.signOff")}</button>
                  ) : null}
                </div>
                {i.count > 0 ? <ul className="mt-1 list-disc pl-5 text-xs text-muted">{i.items.map((x, k) => <li key={k}>{x.ref} {x.detail}</li>)}</ul> : null}
              </li>
            ))}
          </ul>
        </Card>
      ))}

      {canApprove ? (
        <Card>
          <div className="flex flex-wrap items-center gap-3">
            {!checklist.closed || checklist.closed.reopened ? <Button disabled={busy || !checklist.ready} onClick={() => call(() => api("/close/month", { body: { period } }))}>{t("close.closeMonth")}</Button>
              : <Button variant="outline" disabled={busy} onClick={() => ask("close.reopenPrompt", (reason) => api("/close/reopen", { body: { period, reason } }))}>{t("close.reopen")}</Button>}
            <span className="text-xs text-muted">{t("close.closeHelp")}</span>
          </div>
        </Card>
      ) : null}

      {snapshots.snapshots.length ? (
        <Card className="p-0">
          <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("close.saved")}</h2>
          <ul>{snapshots.snapshots.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-x-4 border-b border-rule px-4 py-2 text-sm last:border-0">
              <span className="font-medium">{t(`close.kinds.${s.kind}`)}</span><span className="text-muted">{t("close.version", { n: s.version })}</span>
              <span className="text-muted">{format.dateTime(new Date(s.takenAt), { dateStyle: "medium", timeStyle: "short" })} {s.takenBy ?? ""}</span>
            </li>
          ))}</ul>
          {snapshots.restatements.map((r) => (
            <div key={r.kind} className="border-t border-border bg-warning-soft px-4 py-2 text-sm">
              <strong>{t("close.restated", { kind: t(`close.kinds.${r.kind}`), from: r.from, to: r.to })}</strong>
              <ul className="list-disc pl-5">{r.changes.map((c) => <li key={c.field}>{c.field}: {money(c.was)} to {money(c.now)}</li>)}</ul>
            </div>
          ))}
        </Card>
      ) : null}

      <Card className="p-0">
        <form className="flex flex-wrap items-end gap-3 border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">{t("close.dayTitle")}</h2>
          <input type="hidden" name="period" value={period} />
          <Input name="date" type="date" defaultValue={date} className="w-44" aria-label={t("close.day")} />
          <Button type="submit" variant="outline">{t("common.apply")}</Button>
          <span className="ml-auto text-sm text-muted">{t("close.dayTotals", { open: day.open, sign: day.needSignOff })} · {money(day.totalDifference)}</span>
        </form>
        {day.sessions.length ? (
          <ul>{day.sessions.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-rule px-4 py-2.5 text-sm last:border-0">
              <span className="font-medium">{s.terminal}</span>
              <Badge tone={s.status === "open" ? "warning" : "neutral"}>{t(`close.shift.${s.status}`)}</Badge>
              {s.status === "closed" ? <span className="num text-muted">{money(s.expectedCash)} / {money(s.countedCash)}</span> : null}
              {s.difference && Number(s.difference) !== 0 ? <span className={Number(s.difference) < 0 ? "num text-danger" : "num text-warning"}>{money(s.difference)}</span> : null}
              {s.signNote ? <span className="text-xs text-muted">{s.signNote}</span> : null}
              {s.needsSignOff && canSignCash ? <button type="button" disabled={busy} onClick={() => ask("close.cashPrompt", (note) => api(`/pos/sessions/${s.id}/sign-variance`, { body: { note } }))} className="ml-auto text-primary hover:underline">{t("close.signCash")}</button> : null}
            </li>
          ))}</ul>
        ) : <p className="px-4 py-6 text-center text-muted">{t("close.noShifts")}</p>}
      </Card>
    </div>
  );
}
