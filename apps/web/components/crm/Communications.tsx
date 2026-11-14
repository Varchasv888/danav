"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { todayIso } from "@/lib/format";
import { Alert, Badge, Button, Card, Field, Input, Select } from "../ui";

interface Msg { id: string; event: string; channel: string; to: string; status: string; body: string; error: string | null; attempts: number; cost: string; createdAt: string }
interface Tpl { id: string; event: string; channel: string; language: string; subject: string | null; body: string; category: string }
interface Consent { id: string; contact: string; channel: string; marketingOptIn: boolean; optedOut: boolean; source: string | null }
interface Report { channels: { channel: string; queued: number; sent: number; delivered: number; failed: number; skipped: number; cost: string; deliveredPct: string | null }[]; totalCost: string }
interface Settings { costWhatsappUtility: string; costWhatsappMarketing: string; costSms: string; costEmail: string; costPush: string; ownerPhone: string | null; ownerEmail: string | null; autoEvents?: string[]; maxAttempts: number }
interface Meta { channels: string[]; events: string[] }

const TABS = ["log", "send", "templates", "consent", "settings"] as const;
const AUTO = ["invoice_issued", "payment_received", "order_dispatched", "payroll_paid", "credit_exception", "payment_reminders", "approval_due"] as const;
type Tab = (typeof TABS)[number];
const TONE: Record<string, "success" | "warning" | "danger" | "neutral"> = { delivered: "success", sent: "success", queued: "warning", failed: "danger", skipped: "neutral" };
const NS = ["comms.errors", "crm.errors"];

/** Every message the business sends, in one place: what went, what is waiting, what it cost, who said no, and the wording by language. */
export function Communications({ canEdit }: { canEdit: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const [tab, setTab] = useState<Tab>("log");
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [status, setStatus] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [tpls, setTpls] = useState<Tpl[]>([]);
  const [edit, setEdit] = useState<{ event: string; channel: string; language: string; subject: string; body: string } | null>(null);
  const [consents, setConsents] = useState<Consent[]>([]);
  const [consent, setConsent] = useState({ contact: "", channel: "whatsapp", marketingOptIn: true });
  const [settings, setSettings] = useState<Settings | null>(null);
  const [send, setSend] = useState({ event: "payment_reminder", phone: "", email: "", params: "name=, amount=" });
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });

  const fail = useCallback((err: unknown) => setError(errorText(t, err, NS)), [t]);
  useEffect(() => { api<Meta>("/comms/meta").then(setMeta).catch(fail); }, [fail]);
  const load = useCallback(() => {
    setError(null);
    if (tab === "log") {
      api<Msg[]>(`/comms/outbox${status ? `?status=${status}` : ""}`).then(setMsgs).catch(fail);
      api<Report>(`/comms/report?from=${todayIso().slice(0, 7)}-01&to=${todayIso()}`).then(setReport).catch(fail);
    }
    if (tab === "templates") api<Tpl[]>("/comms/templates").then(setTpls).catch(fail);
    if (tab === "consent") api<Consent[]>("/comms/consents").then(setConsents).catch(fail);
    if (tab === "settings") api<Settings>("/comms/settings").then(setSettings).catch(fail);
  }, [tab, status, fail]);
  useEffect(() => { load(); }, [load]);
  const act = async (fn: () => Promise<unknown>, done?: string) => { setBusy(true); setError(null); setNote(null); try { await fn(); if (done) setNote(done); load(); } catch (err) { fail(err); } finally { setBusy(false); } };
  const parseParams = (v: string) => Object.fromEntries(v.split(",").map((p) => p.split("=").map((x) => x.trim())).filter(([k]) => k).map(([k, ...r]) => [k!, r.join("=")]));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="tablist">
        {TABS.map((k) => <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-lg border px-3 py-1.5 text-sm ${tab === k ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-surface-2"}`}>{t(`comms.tabs.${k}`)}</button>)}
      </div>
      {error ? <Alert>{error}</Alert> : null}
      {note ? <p className="text-sm text-success" role="status">{note}</p> : null}

      {tab === "log" ? (
        <>
          {report ? (
            <Card className="p-0">
              <p className="px-4 py-2 text-sm text-muted">{t("comms.reportHelp", { cost: money(report.totalCost) })}</p>
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-muted"><tr className="border-y border-rule"><th className="px-4 py-1.5 font-medium">{t("comms.channel")}</th>{["queued", "sent", "delivered", "failed", "skipped"].map((s) => <th key={s} className="px-4 py-1.5 text-right font-medium">{t(`comms.statuses.${s}`)}</th>)}<th className="px-4 py-1.5 text-right font-medium">{t("comms.deliveredPct")}</th><th className="px-4 py-1.5 text-right font-medium">{t("comms.cost")}</th></tr></thead>
                <tbody>{report.channels.map((c) => <tr key={c.channel} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{t(`comms.channels.${c.channel}`)}</td>{([c.queued, c.sent, c.delivered, c.failed, c.skipped]).map((n, i) => <td key={i} className="num px-4 py-1.5 text-right">{n || ""}</td>)}<td className="num px-4 py-1.5 text-right">{c.deliveredPct ? `${c.deliveredPct}%` : ""}</td><td className="num px-4 py-1.5 text-right">{money(c.cost)}</td></tr>)}</tbody>
              </table>
            </Card>
          ) : null}
          <div className="flex flex-wrap items-end gap-3">
            <Field label={t("comms.statusFilter")}><Select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">{t("comms.all")}</option>{["queued", "sent", "delivered", "failed", "skipped"].map((s) => <option key={s} value={s}>{t(`comms.statuses.${s}`)}</option>)}</Select></Field>
            {canEdit ? <Button type="button" variant="outline" disabled={busy} onClick={() => act(() => api("/comms/process", { method: "POST", body: {} }), t("comms.processed"))}>{t("comms.sendNow")}</Button> : null}
          </div>
          <Card className="overflow-x-auto p-0">
            {msgs.length === 0 ? <p className="p-4 text-sm text-muted">{t("comms.empty")}</p> : (
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-muted"><tr className="border-y border-rule"><th className="px-4 py-1.5 font-medium">{t("comms.when")}</th><th className="px-4 py-1.5 font-medium">{t("comms.event")}</th><th className="px-4 py-1.5 font-medium">{t("comms.channel")}</th><th className="px-4 py-1.5 font-medium">{t("comms.to")}</th><th className="px-4 py-1.5 font-medium">{t("comms.message")}</th><th className="px-4 py-1.5 font-medium">{t("comms.status")}</th></tr></thead>
                <tbody>{msgs.map((m) => (
                  <tr key={m.id} className="border-b border-rule align-top last:border-0">
                    <td className="px-4 py-1.5 whitespace-nowrap">{new Date(m.createdAt).toLocaleString("en-IN")}</td><td className="px-4 py-1.5">{t(`comms.events.${m.event}`)}</td><td className="px-4 py-1.5">{t(`comms.channels.${m.channel}`)}</td><td className="px-4 py-1.5">{m.to}</td>
                    <td className="max-w-md px-4 py-1.5">{m.body}</td>
                    <td className="px-4 py-1.5"><Badge tone={TONE[m.status] ?? "neutral"}>{t(`comms.statuses.${m.status}`)}</Badge>{m.error ? <div className="text-xs text-muted">{t.has(`comms.reasons.${m.error}`) ? t(`comms.reasons.${m.error}`) : m.error}</div> : null}{m.attempts > 1 ? <div className="text-xs text-muted">{t("comms.attempts", { n: m.attempts })}</div> : null}</td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </Card>
        </>
      ) : null}

      {tab === "send" && meta ? (
        <Card className="p-4">
          <p className="text-sm text-muted">{t("comms.sendHelp")}</p>
          <form className="mt-3 grid gap-3 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); act(() => api("/comms/send", { method: "POST", body: { event: send.event, ...(send.phone ? { phone: send.phone } : {}), ...(send.email ? { email: send.email } : {}), params: parseParams(send.params) } }), t("comms.queuedNote")); }}>
            <Field label={t("comms.event")}><Select value={send.event} onChange={(e) => setSend({ ...send, event: e.target.value })}>{meta.events.map((x) => <option key={x} value={x}>{t(`comms.events.${x}`)}</option>)}</Select></Field>
            <Field label={t("comms.phone")}><Input inputMode="numeric" value={send.phone} onChange={(e) => setSend({ ...send, phone: e.target.value })} maxLength={10} /></Field>
            <Field label={t("comms.email")}><Input type="email" value={send.email} onChange={(e) => setSend({ ...send, email: e.target.value })} /></Field>
            <Field label={t("comms.params")} hint={t("comms.paramsHint")}><Input value={send.params} onChange={(e) => setSend({ ...send, params: e.target.value })} /></Field>
            <div className="sm:col-span-2"><Button type="submit" disabled={busy || !canEdit}>{t("comms.queue")}</Button></div>
          </form>
        </Card>
      ) : null}

      {tab === "templates" ? (
        <Card className="p-0">
          <p className="px-4 py-2 text-sm text-muted">{t("comms.templatesHelp")}</p>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted"><tr className="border-y border-rule"><th className="px-4 py-1.5 font-medium">{t("comms.event")}</th><th className="px-4 py-1.5 font-medium">{t("comms.channel")}</th><th className="px-4 py-1.5 font-medium">{t("comms.language")}</th><th className="px-4 py-1.5 font-medium">{t("comms.message")}</th><th /></tr></thead>
            <tbody>{tpls.map((x) => (
              <tr key={x.id} className="border-b border-rule align-top last:border-0">
                <td className="px-4 py-1.5">{t(`comms.events.${x.event}`)}{x.category !== "utility" ? <div className="text-xs text-muted">{t(`comms.categories.${x.category}`)}</div> : null}</td><td className="px-4 py-1.5">{t(`comms.channels.${x.channel}`)}</td><td className="px-4 py-1.5">{x.language}</td><td className="max-w-lg px-4 py-1.5">{x.subject ? <div className="font-medium">{x.subject}</div> : null}{x.body}</td>
                <td className="px-4 py-1.5 text-right">{canEdit ? <button type="button" className="text-xs text-primary" onClick={() => setEdit({ event: x.event, channel: x.channel, language: x.language, subject: x.subject ?? "", body: x.body })}>{t("comms.edit")}</button> : null}</td>
              </tr>
            ))}</tbody>
          </table>
          {canEdit ? (
            <form className="grid gap-3 border-t border-rule p-4 sm:grid-cols-4" onSubmit={(e) => { e.preventDefault(); if (edit) act(async () => { await api("/comms/templates", { method: "PUT", body: { event: edit.event, channel: edit.channel, language: edit.language, subject: edit.subject || null, body: edit.body } }); setEdit(null); }); }}>
              <Field label={t("comms.event")}><Select value={edit?.event ?? ""} onChange={(e) => setEdit({ ...(edit ?? { channel: "whatsapp", language: "en", subject: "", body: "" }), event: e.target.value })}><option value="">-</option>{(meta?.events ?? []).map((x) => <option key={x} value={x}>{t(`comms.events.${x}`)}</option>)}</Select></Field>
              <Field label={t("comms.channel")}><Select value={edit?.channel ?? "whatsapp"} onChange={(e) => setEdit({ ...(edit ?? { event: "", language: "en", subject: "", body: "" }), channel: e.target.value })}>{(meta?.channels ?? []).map((x) => <option key={x} value={x}>{t(`comms.channels.${x}`)}</option>)}</Select></Field>
              <Field label={t("comms.language")} hint={t("comms.languageHint")}><Input value={edit?.language ?? "en"} onChange={(e) => setEdit({ ...(edit ?? { event: "", channel: "whatsapp", subject: "", body: "" }), language: e.target.value })} maxLength={5} /></Field>
              <Field label={t("comms.subject")}><Input value={edit?.subject ?? ""} onChange={(e) => setEdit({ ...(edit ?? { event: "", channel: "whatsapp", language: "en", body: "" }), subject: e.target.value })} maxLength={120} /></Field>
              <div className="sm:col-span-4"><Field label={t("comms.message")} hint={t("comms.placeholdersHint")}><Input value={edit?.body ?? ""} onChange={(e) => setEdit({ ...(edit ?? { event: "", channel: "whatsapp", language: "en", subject: "" }), body: e.target.value })} maxLength={1024} /></Field></div>
              <div className="sm:col-span-4"><Button type="submit" disabled={busy || !edit?.event || !edit?.body}>{t("comms.saveTemplate")}</Button></div>
            </form>
          ) : null}
        </Card>
      ) : null}

      {tab === "consent" ? (
        <Card className="p-0">
          <p className="px-4 py-2 text-sm text-muted">{t("comms.consentHelp")}</p>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted"><tr className="border-y border-rule"><th className="px-4 py-1.5 font-medium">{t("comms.contact")}</th><th className="px-4 py-1.5 font-medium">{t("comms.channel")}</th><th className="px-4 py-1.5 font-medium">{t("comms.marketing")}</th><th className="px-4 py-1.5 font-medium">{t("comms.optedOut")}</th></tr></thead>
            <tbody>{consents.map((c) => <tr key={c.id} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{c.contact}</td><td className="px-4 py-1.5">{t(`comms.channels.${c.channel}`)}</td><td className="px-4 py-1.5">{c.marketingOptIn ? t("comms.yes") : ""}</td><td className="px-4 py-1.5">{c.optedOut ? <Badge tone="danger">{t("comms.optedOut")}</Badge> : ""}</td></tr>)}</tbody>
          </table>
          {canEdit ? (
            <form className="flex flex-wrap items-end gap-3 border-t border-rule p-4" onSubmit={(e) => { e.preventDefault(); act(async () => { await api("/comms/consents", { method: "PUT", body: { contact: consent.contact, channel: consent.channel, marketingOptIn: consent.marketingOptIn, optedOut: false, source: "staff" } }); setConsent({ ...consent, contact: "" }); }); }}>
              <Field label={t("comms.contact")}><Input value={consent.contact} onChange={(e) => setConsent({ ...consent, contact: e.target.value })} required /></Field>
              <Field label={t("comms.channel")}><Select value={consent.channel} onChange={(e) => setConsent({ ...consent, channel: e.target.value })}>{(meta?.channels ?? []).map((x) => <option key={x} value={x}>{t(`comms.channels.${x}`)}</option>)}</Select></Field>
              <label className="flex items-center gap-2 pb-2 text-sm"><input type="checkbox" checked={consent.marketingOptIn} onChange={(e) => setConsent({ ...consent, marketingOptIn: e.target.checked })} />{t("comms.agreesMarketing")}</label>
              <Button type="submit" disabled={busy}>{t("comms.saveConsent")}</Button>
              <Button type="button" variant="outline" disabled={busy || !consent.contact} onClick={() => act(async () => { await api("/comms/opt-out", { method: "POST", body: { contact: consent.contact } }); setConsent({ ...consent, contact: "" }); })}>{t("comms.recordStop")}</Button>
            </form>
          ) : null}
        </Card>
      ) : null}

      {tab === "settings" && settings ? (
        <Card className="p-4">
          <p className="text-sm text-muted">{t("comms.settingsHelp")}</p>
          <form className="mt-3 grid gap-3 sm:grid-cols-3" onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); const v = (k: string) => String(f.get(k) ?? "").trim(); act(() => api("/comms/settings", { method: "PUT", body: { costWhatsappUtility: v("costWhatsappUtility") || "0", costWhatsappMarketing: v("costWhatsappMarketing") || "0", costSms: v("costSms") || "0", costEmail: v("costEmail") || "0", costPush: v("costPush") || "0", ownerPhone: v("ownerPhone") || null, ownerEmail: v("ownerEmail") || null, maxAttempts: Number(v("maxAttempts") || 3), autoEvents: AUTO.filter((k) => f.get(`auto_${k}`) === "on") } }), t("comms.saved")); }}>
            {(["costWhatsappUtility", "costWhatsappMarketing", "costSms", "costEmail", "costPush"] as const).map((k) => <Field key={k} label={t(`comms.settings.${k}`)}><Input name={k} defaultValue={Number(settings[k])} inputMode="decimal" className="num" disabled={!canEdit} /></Field>)}
            <Field label={t("comms.settings.ownerPhone")}><Input name="ownerPhone" defaultValue={settings.ownerPhone ?? ""} inputMode="numeric" maxLength={10} disabled={!canEdit} /></Field>
            <Field label={t("comms.settings.ownerEmail")}><Input name="ownerEmail" type="email" defaultValue={settings.ownerEmail ?? ""} disabled={!canEdit} /></Field>
            <Field label={t("comms.settings.maxAttempts")}><Input name="maxAttempts" defaultValue={settings.maxAttempts} inputMode="numeric" className="num" disabled={!canEdit} /></Field>
            <fieldset className="sm:col-span-3">
              <legend className="mb-1 text-sm font-medium">{t("comms.auto.title")}</legend>
              <p className="mb-2 text-sm text-muted">{t("comms.auto.help")}</p>
              <div className="grid gap-1 sm:grid-cols-2">
                {AUTO.map((k) => <label key={k} className="flex items-center gap-2 text-sm"><input type="checkbox" name={`auto_${k}`} defaultChecked={settings.autoEvents?.includes(k)} disabled={!canEdit} className="accent-[var(--primary)]" />{t(`comms.auto.${k}`)}</label>)}
              </div>
            </fieldset>
            {canEdit ? <div className="sm:col-span-3"><Button type="submit" disabled={busy}>{t("comms.save")}</Button></div> : null}
          </form>
        </Card>
      ) : null}
    </div>
  );
}
