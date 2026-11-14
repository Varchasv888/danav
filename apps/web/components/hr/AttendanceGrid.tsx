"use client";

import clsx from "clsx";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { localName } from "@/lib/format";
import { Alert, Button, Card, Field, Input } from "../ui";
import { intlLocale } from "@varchasv/i18n/locales";

interface Day { status: string; leave: string | null; half: boolean; in?: string | null; out?: string | null; late?: boolean }
export interface Month {
  period: string; start: string; end: string; weeklyOffs: number[]; holidays: { date: string; name: string }[]; locked: boolean;
  employees: { id: string; code: string; name: string; nameHi: string | null; joinedOn: string; leftOn: string | null; weeklyOffs?: number[]; offChanges?: Record<string, string>; days: Record<string, Day>; lopDays: number; lateDays?: number }[];
}

const NEXT: Record<string, "absent" | "half_day" | "present"> = { present: "absent", absent: "half_day", half_day: "present" };
const TONE: Record<string, string> = {
  present: "bg-surface hover:bg-surface-2 text-muted",
  absent: "bg-danger-soft text-danger font-semibold",
  half_day: "bg-accent-soft text-accent font-semibold",
  leave: "bg-primary-soft text-primary font-semibold",
  off: "bg-surface-2 text-muted/60",
  out: "bg-transparent text-muted/30",
};

/** Employees × days. Click a working day to cycle present → absent → half day. */
export function AttendanceGrid({ month, canEdit }: { month: Month; canEdit: boolean }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const days: string[] = [];
  for (let d = new Date(`${month.start}T00:00:00Z`); d.toISOString().slice(0, 10) <= month.end; d.setUTCDate(d.getUTCDate() + 1)) days.push(d.toISOString().slice(0, 10));
  const holidays = new Map(month.holidays.map((h) => [h.date, h.name]));
  const wd = (iso: string) => new Date(`${iso}T00:00:00Z`).getUTCDay();
  const weekdayShort = (iso: string) => new Intl.DateTimeFormat(intlLocale(locale), { weekday: "narrow", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));

  async function mark(employeeId: string, date: string, current: string) {
    const status = NEXT[current] ?? "absent";
    const key = `${employeeId}|${date}`;
    setOverrides((o) => ({ ...o, [key]: status }));
    setError(null);
    try {
      await api("/attendance", { method: "PUT", body: { entries: [{ employeeId, date, status }] } });
      router.refresh();
    } catch (err) {
      setOverrides((o) => ({ ...o, [key]: current }));
      setError(errorText(t, err, ["hr.errors"]));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {month.locked ? <Alert>{t("hr.attendance.locked")}</Alert> : null}
      {error ? <Alert>{error}</Alert> : null}
      <div className="flex flex-wrap gap-3 text-xs">
        {(["absent", "half_day", "leave"] as const).map((k) => <span key={k} className={clsx("rounded px-2 py-0.5", TONE[k])}>{t(`hr.attendance.legend.${k}`)}</span>)}
        <span className={clsx("rounded px-2 py-0.5", TONE.off)}>{t("hr.attendance.legend.weekOff")} / {t("hr.attendance.legend.holiday")}</span>
        <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5"><span className="size-1.5 rounded-full bg-accent" />{t("hr.attendance.legend.late")}</span>
      </div>
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="sticky left-0 z-10 min-w-48 bg-surface px-3 py-2 text-left font-medium text-muted">{t("hr.name")}</th>
                {days.map((d) => (
                  <th key={d} title={holidays.get(d)} className={clsx("w-8 px-0.5 py-1 text-center font-medium", month.weeklyOffs.includes(wd(d)) || holidays.has(d) ? "text-muted/60" : "text-muted")}>
                    <span className="block">{Number(d.slice(8))}</span><span className="block text-[10px]">{weekdayShort(d)}</span>
                  </th>
                ))}
                <th className="px-3 py-2 text-right font-medium text-muted">{t("hr.attendance.lop")}</th>
              </tr>
            </thead>
            <tbody>
              {month.employees.map((e) => (
                <tr key={e.id} className="border-b border-border last:border-0">
                  <td className="sticky left-0 z-10 bg-surface px-3 py-1.5 text-sm"><span className="font-mono text-xs text-muted">{e.code}</span> {localName(e, locale)}</td>
                  {days.map((d) => {
                    const out = d < e.joinedOn || (!!e.leftOn && d > e.leftOn);
                    const change = e.offChanges?.[d];
                    const off = holidays.has(d) || (change === "worked" ? false : change === "off" ? true : (e.weeklyOffs ?? month.weeklyOffs).includes(wd(d)));
                    const rec = e.days[d];
                    const status = overrides[`${e.id}|${d}`] ?? rec?.status ?? "present";
                    const tone = out ? "out" : rec?.status === "leave" ? "leave" : off && status === "present" ? "off" : status;
                    const label = out ? "" : rec?.status === "leave" ? (rec.leave ?? "L") : status === "absent" ? "A" : status === "half_day" ? "½" : off ? "·" : "";
                    const clickable = canEdit && !month.locked && !out && rec?.status !== "leave";
                    return (
                      <td key={d} className="p-0.5">
                        <button type="button" disabled={!clickable} onClick={() => mark(e.id, d, status)}
                          title={[d, holidays.get(d), rec?.in ? `${rec.in}–${rec.out ?? ""}` : null, rec?.late ? t("hr.attendance.legend.late") : null].filter(Boolean).join(" · ")}
                          className={clsx("relative h-7 w-7 rounded text-[11px]", TONE[tone], !clickable && "cursor-default")}>
                          {label}
                          {rec?.late ? <span aria-hidden className="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-accent" /> : null}
                        </button>
                      </td>
                    );
                  })}
                  <td className="num px-3 py-1.5 text-right text-sm font-semibold">{e.lopDays || ""}{e.lateDays ? <span className="block text-[10px] font-normal text-accent">{e.lateDays} {t("hr.punches.late")}</span> : null}</td>
                </tr>
              ))}
              {!month.employees.length ? <tr><td colSpan={days.length + 2} className="px-5 py-10 text-center text-sm text-muted">{t("hr.attendance.noEmployees")}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export function Holidays({ holidays, canEdit }: { holidays: { id: string; date: string; name: string }[]; canEdit: boolean }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fmt = new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric", month: "short", weekday: "short", timeZone: "UTC" });
  const run = async (fn: () => Promise<unknown>) => {
    setError(null);
    try { await fn(); router.refresh(); } catch (err) { setError(errorText(t, err, ["hr.errors"])); }
  };
  return (
    <Card>
      <h2 className="mb-3 font-semibold">{t("hr.attendance.holidays")}</h2>
      <ul className="divide-y divide-border text-sm">
        {holidays.map((h) => (
          <li key={h.id} className="flex items-center justify-between py-1.5">
            <span><span className="inline-block w-32 text-muted">{fmt.format(new Date(`${h.date}T00:00:00Z`))}</span>{h.name}</span>
            {canEdit ? <button type="button" onClick={() => run(() => api(`/holidays/${h.id}`, { method: "DELETE" }))} className="rounded p-1.5 text-muted hover:text-danger" title={t("common.remove")}><Trash2 className="size-4" aria-hidden /></button> : null}
          </li>
        ))}
      </ul>
      {canEdit ? (
        <form className="mt-3 flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); void run(async () => { await api("/holidays", { body: { date, name } }); setDate(""); setName(""); }); }}>
          <Field label={t("common.date")} htmlFor="hol-date"><Input id="hol-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
          <Field label={t("hr.attendance.holidayName")} htmlFor="hol-name"><Input id="hol-name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={80} /></Field>
          <Button type="submit" variant="outline">{t("hr.attendance.addHoliday")}</Button>
        </form>
      ) : null}
      {error ? <div className="mt-3"><Alert>{error}</Alert></div> : null}
    </Card>
  );
}

export interface OffChange { id: string; employeeId: string; code: string; name: string; date: string; kind: "worked" | "off"; note: string | null }

/** Record that someone came in on their week off, or was given a day off in place of a working day. */
export function WeekOffChanges({ employees, changes, canEdit, locked }: { employees: Month["employees"]; changes: OffChange[]; canEdit: boolean; locked: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [kind, setKind] = useState<"worked" | "off">("worked");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function call(fn: () => Promise<unknown>, done?: () => void) {
    setBusy(true);
    setError(null);
    try { await fn(); done?.(); router.refresh(); } catch (err) { setError(errorText(t, err, ["hr.errors"])); } finally { setBusy(false); }
  }
  const add = (e: React.FormEvent) => { e.preventDefault(); void call(() => api("/hr/week-off-changes", { body: { employeeId, date, kind, note: note.trim() || null } }), () => { setDate(""); setNote(""); }); };
  return (
    <Card>
      <h2 className="mb-1 font-semibold">{t("hr.weekOff.title")}</h2>
      <p className="mb-3 text-sm text-muted">{t("hr.weekOff.help")}</p>
      {error ? <Alert>{error}</Alert> : null}
      {canEdit && !locked ? (
        <form onSubmit={add} method="post" className="mb-4 flex flex-wrap items-end gap-3">
          <Field label={t("hr.weekOff.employee")} htmlFor="wo-emp">
            <select id="wo-emp" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required className="h-10 rounded-md border border-border bg-surface px-3 text-sm">
              <option value="" />
              {employees.map((e) => <option key={e.id} value={e.id}>{e.code} {e.name}</option>)}
            </select>
          </Field>
          <Field label={t("hr.weekOff.date")} htmlFor="wo-date"><Input id="wo-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
          <Field label={t("hr.weekOff.kind")} htmlFor="wo-kind">
            <select id="wo-kind" value={kind} onChange={(e) => setKind(e.target.value as "worked" | "off")} className="h-10 rounded-md border border-border bg-surface px-3 text-sm">
              <option value="worked">{t("hr.weekOff.worked")}</option>
              <option value="off">{t("hr.weekOff.off")}</option>
            </select>
          </Field>
          <Field label={t("hr.weekOff.note")} htmlFor="wo-note"><Input id="wo-note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} /></Field>
          <Button type="submit" disabled={busy || !employeeId || !date}>{t("hr.weekOff.add")}</Button>
        </form>
      ) : null}
      {changes.length ? (
        <ul className="divide-y divide-border text-sm">
          {changes.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2">
              <span className="whitespace-nowrap">{c.date}</span>
              <span><span className="font-mono text-xs text-muted">{c.code}</span> {c.name}</span>
              <span className="text-muted">{c.kind === "worked" ? t("hr.weekOff.kindWorked") : t("hr.weekOff.kindOff")}</span>
              {c.note ? <span className="text-muted">{c.note}</span> : null}
              {canEdit && !locked ? <button type="button" disabled={busy} onClick={() => call(() => api(`/hr/week-off-changes/${c.id}`, { method: "DELETE" }))} className="ml-auto text-primary hover:underline">{t("hr.weekOff.remove")}</button> : null}
            </li>
          ))}
        </ul>
      ) : <p className="text-sm text-muted">{t("hr.weekOff.none")}</p>}
    </Card>
  );
}
