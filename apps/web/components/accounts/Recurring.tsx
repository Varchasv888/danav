"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { rupees, todayIso } from "@/lib/format";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export interface Template {
  id: string; name: string; type: string; narration: string | null; frequency: string; dayOfMonth: number; nextOn: string; endsOn: string | null; lastRunOn: string | null; active: boolean;
  lines: { accountId: string; debit?: string; credit?: string }[];
}

/** Entries that repeat: pick the two ledgers, the amount and how often. Due ones are posted as ordinary vouchers when "Post due entries" is pressed. */
export function Recurring({ rows, accounts, canEdit }: { rows: Template[]; accounts: { id: string; name: string }[]; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ posted: number; failed: { name: string; date: string; error: string }[] } | null>(null);
  const name = (id: string) => accounts.find((a) => a.id === id)?.name ?? "";

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => String(f.get(k) ?? "").trim();
    setBusy(true); setError(null);
    try {
      await api("/recurring-vouchers", { body: {
        name: s("name"), type: s("type"), frequency: s("frequency"), dayOfMonth: Number(s("day")), startOn: s("startOn"), ...(s("endsOn") ? { endsOn: s("endsOn") } : {}),
        ...(s("narration") ? { narration: s("narration") } : {}),
        lines: [{ accountId: s("debit"), debit: s("amount") }, { accountId: s("credit"), credit: s("amount") }],
      } });
      setOpen(false); router.refresh();
    } catch (err) { setError(errorText(t, err, ["recurring.errors", "vouchers.errors"])); } finally { setBusy(false); }
  }
  async function run() {
    setBusy(true); setError(null);
    try {
      const r = await api<{ posted: unknown[]; failed: { name: string; date: string; error: string }[] }>("/recurring-vouchers/run", { body: {} });
      setResult({ posted: r.posted.length, failed: r.failed }); router.refresh();
    } catch (err) { setError(errorText(t, err, ["recurring.errors"])); } finally { setBusy(false); }
  }
  async function toggle(id: string, active: boolean) {
    setBusy(true); setError(null);
    try { await api(`/recurring-vouchers/${id}/active`, { body: { active } }); router.refresh(); } catch (err) { setError(errorText(t, err, ["recurring.errors"])); } finally { setBusy(false); }
  }
  const due = rows.filter((r) => r.active && r.nextOn <= todayIso()).length;

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm">{due ? t("recurring.dueCount", { count: due }) : t("recurring.nothingDue")}</p>
        {canEdit ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => void run()} disabled={busy || !due}>{t("recurring.run")}</Button>
            <Button onClick={() => setOpen((v) => !v)}>{open ? t("common.cancel") : t("recurring.add")}</Button>
          </div>
        ) : null}
      </Card>
      {error ? <Alert>{error}</Alert> : null}
      {result ? (
        <Card>
          <p role="status" className="text-sm">{t("recurring.posted", { count: result.posted })}</p>
          {result.failed.length ? <ul className="mt-2 text-sm text-danger">{result.failed.map((f) => <li key={f.name + f.date}>{t("recurring.failedOne", { name: f.name, date: f.date, error: f.error })}</li>)}</ul> : null}
        </Card>
      ) : null}
      {open ? (
        <Card>
          <form onSubmit={add} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label={t("recurring.name")} htmlFor="rc-name"><Input id="rc-name" name="name" required maxLength={80} /></Field>
            <Field label={t("recurring.type")} htmlFor="rc-type"><Select id="rc-type" name="type" defaultValue="journal"><option value="journal">{t("recurring.types.journal")}</option><option value="payment">{t("recurring.types.payment")}</option></Select></Field>
            <Field label={t("recurring.debit")} htmlFor="rc-dr"><Select id="rc-dr" name="debit" required defaultValue=""><option value="" disabled>-</option>{accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</Select></Field>
            <Field label={t("recurring.credit")} htmlFor="rc-cr"><Select id="rc-cr" name="credit" required defaultValue=""><option value="" disabled>-</option>{accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</Select></Field>
            <Field label={t("recurring.amount")} htmlFor="rc-amt"><Input id="rc-amt" name="amount" inputMode="decimal" required className="num" /></Field>
            <Field label={t("recurring.frequency")} htmlFor="rc-freq"><Select id="rc-freq" name="frequency" defaultValue="monthly"><option value="monthly">{t("recurring.freq.monthly")}</option><option value="quarterly">{t("recurring.freq.quarterly")}</option><option value="yearly">{t("recurring.freq.yearly")}</option></Select></Field>
            <Field label={t("recurring.day")} htmlFor="rc-day" hint={t("recurring.dayHint")}><Input id="rc-day" name="day" inputMode="numeric" defaultValue="1" required className="num" /></Field>
            <Field label={t("recurring.startOn")} htmlFor="rc-start"><Input id="rc-start" name="startOn" type="date" defaultValue={todayIso()} required /></Field>
            <Field label={t("recurring.endsOn")} htmlFor="rc-end"><Input id="rc-end" name="endsOn" type="date" /></Field>
            <div className="sm:col-span-2"><Field label={t("recurring.narration")} htmlFor="rc-nar"><Input id="rc-nar" name="narration" maxLength={200} /></Field></div>
            <div className="flex items-end"><Button type="submit" disabled={busy}>{t("common.save")}</Button></div>
          </form>
        </Card>
      ) : null}
      <Card className="overflow-hidden p-0">
        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="text-left text-muted">
                <tr className="border-b border-border">
                  <th className="px-4 py-2 font-medium">{t("recurring.name")}</th><th className="px-3 py-2 font-medium">{t("recurring.entry")}</th>
                  <th className="px-3 py-2 font-medium">{t("recurring.frequency")}</th><th className="px-3 py-2 font-medium">{t("recurring.next")}</th><th className="w-24" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const dr = r.lines.find((l) => l.debit), cr = r.lines.find((l) => l.credit);
                  return (
                    <tr key={r.id} className={`border-b border-border last:border-0 ${r.active ? "" : "text-faint"}`}>
                      <td className="px-4 py-2 font-medium">{r.name}{!r.active ? <span className="ml-2 text-xs font-normal">({t("recurring.off")})</span> : null}</td>
                      <td className="px-3 py-2">{dr ? name(dr.accountId) : ""} → {cr ? name(cr.accountId) : ""} <span className="num">{dr?.debit ? rupees(dr.debit) : ""}</span></td>
                      <td className="px-3 py-2">{t(`recurring.freq.${r.frequency}`)}, {t("recurring.onDay", { day: r.dayOfMonth })}</td>
                      <td className="px-3 py-2">{r.active ? r.nextOn : "-"}{r.endsOn ? <span className="text-xs text-muted"> ({t("recurring.until", { date: r.endsOn })})</span> : null}</td>
                      <td className="pr-3 text-right">{canEdit ? <button type="button" onClick={() => void toggle(r.id, !r.active)} disabled={busy} className="rounded px-2 py-1 text-xs text-muted hover:bg-surface-2 hover:text-text focus-visible:outline-2 focus-visible:outline-primary">{r.active ? t("recurring.stop") : t("recurring.resume")}</button> : null}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : <p className="px-4 py-6 text-sm text-muted">{t("recurring.none")}</p>}
      </Card>
      <p className="text-xs text-muted">{t("recurring.note")}</p>
    </div>
  );
}
