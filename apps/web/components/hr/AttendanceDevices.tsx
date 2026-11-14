"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Badge, Button, Card, Field, Input } from "../ui";

export interface Device { id: string; name: string; serial: string; active: boolean; lastSeenAt: string | null; lastIp: string | null; punches: number; unmatched: number; lastPunch: string | null }
export interface PunchRow { id: string; device: string; pin: string; date: string; time: string; employee: string | null }

/** Register a machine, point it at this server, and watch its punches arrive. */
export function AttendanceDevices({ devices, punches, canEdit }: { devices: Device[]; punches: PunchRow[]; canEdit: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [name, setName] = useState("");
  const [serial, setSerial] = useState("");
  const [host, setHost] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { setHost(window.location.hostname); }, []);

  async function call(fn: () => Promise<unknown>, done?: () => void) {
    setBusy(true);
    setError(null);
    setNote(null);
    try { await fn(); done?.(); router.refresh(); } catch (err) { setError(errorText(t, err, ["devices.errors"])); } finally { setBusy(false); }
  }
  const add = (e: React.FormEvent) => { e.preventDefault(); void call(() => api("/attendance/devices", { body: { name, serial } }), () => { setName(""); setSerial(""); }); };
  const seen = (iso: string | null) => (iso ? format.dateTime(new Date(iso), { dateStyle: "medium", timeStyle: "short" }) : t("devices.never"));

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      <Card>
        <h2 className="mb-2 font-semibold">{t("devices.howTitle")}</h2>
        <ol className="list-decimal space-y-1 pl-5 text-[0.9286rem]">
          <li>{t("devices.step1")}</li>
          <li>{t("devices.step2", { host: host || "your-server" })}</li>
          <li>{t("devices.step3")}</li>
        </ol>
        <p className="mt-2 text-xs text-muted">{t("devices.note")}</p>
      </Card>
      {canEdit ? (
        <form onSubmit={add} method="post" className="flex flex-wrap items-end gap-3 rounded-md border border-border bg-surface p-4">
          <Field label={t("devices.name")} htmlFor="ad-name"><Input id="ad-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder={t("devices.namePlaceholder")} required /></Field>
          <Field label={t("devices.serial")} htmlFor="ad-serial"><Input id="ad-serial" value={serial} onChange={(e) => setSerial(e.target.value.toUpperCase())} maxLength={40} className="w-60 font-mono" required /></Field>
          <Button type="submit" disabled={busy || !name || serial.length < 4}>{t("devices.add")}</Button>
        </form>
      ) : null}
      <Card className="p-0">
        <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("devices.machines")}</h2>
        {devices.length ? (
          <ul>
            {devices.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-rule px-4 py-2.5 text-[0.9286rem] last:border-0">
                <span className="font-medium">{d.name}</span><span className="font-mono text-xs text-muted">{d.serial}</span>
                <Badge tone={d.active ? "success" : "neutral"}>{d.active ? t("devices.on") : t("devices.off")}</Badge>
                <span className="text-muted">{t("devices.lastSeen", { when: seen(d.lastSeenAt) })}</span>
                <span className="text-muted">{t("devices.punchCount", { n: d.punches })}</span>
                {d.unmatched ? <Badge tone="warning">{t("devices.unmatched", { n: d.unmatched })}</Badge> : null}
                {canEdit ? (
                  <span className="ml-auto flex items-center gap-2">
                    <button type="button" disabled={busy} onClick={() => call(() => api(`/attendance/devices/${d.id}`, { method: "PATCH", body: { active: !d.active } }))} className="text-primary hover:underline">{d.active ? t("devices.switchOff") : t("devices.switchOn")}</button>
                    <button type="button" aria-label={t("devices.remove")} disabled={busy} onClick={() => { if (window.confirm(t("devices.removeConfirm"))) void call(() => api(`/attendance/devices/${d.id}`, { method: "DELETE" })); }} className="inline-flex size-7 items-center justify-center rounded-md text-muted hover:bg-surface-2"><Trash2 className="size-4" aria-hidden /></button>
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        ) : <p className="px-4 py-6 text-center text-muted">{t("devices.none")}</p>}
      </Card>
      <Card className="p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <h2 className="text-sm font-semibold">{t("devices.recent")}</h2>
          {canEdit ? <Button type="button" variant="outline" disabled={busy} onClick={() => call(async () => { const r = await api<{ matched: number }>("/attendance/punches/reprocess", { body: {} }); setNote(t("devices.reprocessed", { n: r.matched })); })}>{t("devices.reprocess")}</Button> : null}
        </div>
        {note ? <p role="status" className="px-4 pt-2 text-xs text-success">{note}</p> : null}
        {punches.length ? (
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted"><tr className="border-b border-rule"><th className="px-4 py-1.5 font-medium">{t("devices.when")}</th><th className="px-4 py-1.5 font-medium">{t("devices.machine")}</th><th className="px-4 py-1.5 font-medium">{t("devices.pin")}</th><th className="px-4 py-1.5 font-medium">{t("devices.person")}</th></tr></thead>
            <tbody>{punches.map((p) => <tr key={p.id} className="border-b border-rule last:border-0"><td className="px-4 py-1.5 whitespace-nowrap">{p.date} {p.time}</td><td className="px-4 py-1.5">{p.device}</td><td className="px-4 py-1.5 font-mono text-xs">{p.pin}</td><td className="px-4 py-1.5">{p.employee ?? <span className="text-warning">{t("devices.notMatched")}</span>}</td></tr>)}</tbody>
          </table>
        ) : <p className="px-4 py-6 text-center text-muted">{t("devices.noPunches")}</p>}
      </Card>
    </div>
  );
}
