"use client";

import { Check, MessageCircle, Plus, Trophy, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { GST_STATES } from "@varchasv/domain";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export const CRM_NS = ["crm.errors", "accounts.errors"];
export const STAGES = ["new", "contacted", "qualified", "proposal", "won", "lost"] as const;
export const SOURCES = ["walk_in", "referral", "website", "indiamart", "justdial", "whatsapp", "trade_fair", "other"] as const;
export interface Lead {
  id: string; code: string; name: string; organisation: string | null; phone: string | null; email: string | null; gstin: string | null; stateCode: string | null;
  city: string | null; source: string; stage: string; value: string | null; expectedClose: string | null; ownerId: string | null; customerId: string | null;
  lostReason: string | null; notes: string | null;
}
export interface Activity { id: string; kind: string; subject: string; dueAt: string | null; doneAt: string | null; notes: string | null; owner: string | null; lead: string | null; leadCode: string | null; leadId: string | null; account: string | null; accountId: string | null }
export interface Template { id: string; name: string; body: string; category: string; language: string; providerName: string | null; archived: boolean; params: number[] }

export function LeadForm({ lead }: { lead?: Lead }) {
  const t = useTranslations();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => String(f.get(k) ?? "").trim() || null;
    setBusy(true);
    setError(null);
    try {
      const body = {
        name: s("name"), organisation: s("organisation"), phone: s("phone"), email: s("email"), gstin: s("gstin")?.toUpperCase() ?? null, stateCode: s("stateCode"),
        city: s("city"), source: s("source") ?? undefined, value: s("value"), expectedClose: s("expectedClose"), notes: s("notes"),
      };
      const r = await api<{ id: string }>(lead ? `/crm/leads/${lead.id}` : "/crm/leads", { method: lead ? "PUT" : "POST", body });
      if (lead) { setBusy(false); router.refresh(); } else router.push(`/crm/leads/${r.id}`);
    } catch (err) { setError(errorText(t, err, CRM_NS)); setBusy(false); }
  }
  return (
    <Card>
      <form onSubmit={save} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label={t("crm.leads.name")} htmlFor="ld-n"><Input id="ld-n" name="name" defaultValue={lead?.name} required minLength={2} maxLength={120} /></Field>
        <Field label={t("crm.leads.organisation")} htmlFor="ld-o"><Input id="ld-o" name="organisation" defaultValue={lead?.organisation ?? ""} maxLength={160} /></Field>
        <Field label={t("crm.leads.phone")} htmlFor="ld-p"><Input id="ld-p" name="phone" defaultValue={lead?.phone ?? ""} inputMode="tel" maxLength={20} /></Field>
        <Field label={t("crm.leads.email")} htmlFor="ld-e"><Input id="ld-e" name="email" type="email" defaultValue={lead?.email ?? ""} maxLength={120} /></Field>
        <Field label={t("crm.leads.source")} htmlFor="ld-s"><Select id="ld-s" name="source" defaultValue={lead?.source ?? "other"}>{SOURCES.map((s) => <option key={s} value={s}>{t(`crm.leads.sources.${s}`)}</option>)}</Select></Field>
        <Field label={t("crm.leads.value")} htmlFor="ld-v"><Input id="ld-v" name="value" defaultValue={lead?.value ? String(Number(lead.value)) : ""} inputMode="decimal" className="num" /></Field>
        <Field label={t("crm.leads.expectedClose")} htmlFor="ld-ec"><Input id="ld-ec" name="expectedClose" type="date" defaultValue={lead?.expectedClose ?? ""} /></Field>
        <Field label={t("crm.leads.city")} htmlFor="ld-c"><Input id="ld-c" name="city" defaultValue={lead?.city ?? ""} maxLength={80} /></Field>
        <Field label={t("crm.leads.gstin")} htmlFor="ld-g"><Input id="ld-g" name="gstin" defaultValue={lead?.gstin ?? ""} maxLength={15} className="font-mono uppercase" /></Field>
        <Field label={t("crm.leads.state")} htmlFor="ld-st">
          <Select id="ld-st" name="stateCode" defaultValue={lead?.stateCode ?? ""}><option value="">-</option>{GST_STATES.map((s) => <option key={s.code} value={s.code}>{s.code} · {s.name}</option>)}</Select>
        </Field>
        <div className="md:col-span-2"><Field label={t("crm.leads.notes")} htmlFor="ld-nt"><Input id="ld-nt" name="notes" defaultValue={lead?.notes ?? ""} maxLength={2000} /></Field></div>
        {error ? <div className="md:col-span-2 xl:col-span-4"><Alert>{error}</Alert></div> : null}
        <div className="md:col-span-2 xl:col-span-4"><Button type="submit" disabled={busy}>{t("crm.leads.save")}</Button></div>
      </form>
    </Card>
  );
}

export function LeadStage({ lead }: { lead: Lead }) {
  const t = useTranslations();
  const router = useRouter();
  const [lost, setLost] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const call = async (path: string, body: unknown) => {
    setError(null);
    try { await api(`/crm/leads/${lead.id}/${path}`, { body }); setLost(false); router.refresh(); } catch (err) { setError(errorText(t, err, CRM_NS)); }
  };
  const open = lead.stage !== "won" && lead.stage !== "lost";
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-1">
        {STAGES.filter((s) => s !== "won" && s !== "lost").map((s, i) => (
          <button key={s} type="button" disabled={!open} onClick={() => call("stage", { stage: s })}
            className={`rounded-full px-3 py-1 text-sm ${lead.stage === s ? "bg-primary text-on-primary" : STAGES.indexOf(lead.stage as never) > i && open ? "bg-primary-soft text-primary" : "bg-surface-2"} disabled:opacity-60`}>
            {t(`crm.leads.stages.${s}`)}
          </button>
        ))}
        {!open ? <span className={`ml-2 rounded-full px-3 py-1 text-sm font-semibold ${lead.stage === "won" ? "bg-surface-2 text-success" : "bg-danger-soft text-danger"}`}>{t(`crm.leads.stages.${lead.stage}`)}</span> : null}
      </div>
      {open ? (
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => call("convert", {})}><Trophy className="size-4" aria-hidden />{t("crm.leads.convert")}</Button>
          <Button variant="outline" className="text-danger" onClick={() => setLost(true)}><X className="size-4" aria-hidden />{t("crm.leads.lost")}</Button>
        </div>
      ) : null}
      {lost ? (
        <form className="flex max-w-xl gap-3" onSubmit={(e) => { e.preventDefault(); void call("stage", { stage: "lost", lostReason: new FormData(e.currentTarget).get("reason") }); }}>
          <Input name="reason" placeholder={t("crm.leads.lostReason")} aria-label={t("crm.leads.lostReason")} required maxLength={300} autoFocus />
          <Button type="submit" variant="danger">{t("crm.leads.lost")}</Button>
        </form>
      ) : null}
      {lead.stage === "lost" && lead.lostReason ? <p className="text-sm text-muted">{lead.lostReason}</p> : null}
      {error ? <Alert>{error}</Alert> : null}
    </Card>
  );
}

const KINDS = ["call", "meeting", "task", "note", "email"] as const;

export function ActivityForm({ leadId, accountId }: { leadId?: string; accountId?: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [kind, setKind] = useState<string>("call");
  const [error, setError] = useState<string | null>(null);
  return (
    <form className="grid gap-3 md:grid-cols-[130px_1fr_200px_auto]" onSubmit={async (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const f = new FormData(form);
      const due = String(f.get("due") || "");
      setError(null);
      try {
        await api("/crm/activities", { body: { leadId, accountId, kind, subject: f.get("subject"), dueAt: due ? new Date(due).toISOString() : null, notes: String(f.get("notes") || "") || null } });
        form.reset();
        router.refresh();
      } catch (err) { setError(errorText(t, err, CRM_NS)); }
    }}>
      <Select value={kind} onChange={(e) => setKind(e.target.value)} aria-label={t("crm.activities.kind")}>{KINDS.map((k) => <option key={k} value={k}>{t(`crm.activities.kinds.${k}`)}</option>)}</Select>
      <Input name="subject" placeholder={t("crm.activities.subject")} aria-label={t("crm.activities.subject")} required minLength={2} maxLength={200} />
      {kind !== "note" ? <Input name="due" type="datetime-local" aria-label={t("crm.activities.due")} /> : <span />}
      <Button type="submit" variant="outline"><Plus className="size-4" aria-hidden />{t("crm.activities.add")}</Button>
      <div className="md:col-span-4"><Input name="notes" placeholder={t("crm.activities.notes")} aria-label={t("crm.activities.notes")} maxLength={2000} /></div>
      {error ? <div className="md:col-span-4"><Alert>{error}</Alert></div> : null}
    </form>
  );
}

export function ActivityList({ items, showWho }: { items: Activity[]; showWho?: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const now = Date.now();
  if (!items.length) return <p className="py-4 text-center text-sm text-muted">{t("crm.activities.none")}</p>;
  return (
    <ul className="divide-y divide-border text-sm">
      {items.map((a) => {
        const late = !a.doneAt && a.dueAt && new Date(a.dueAt).getTime() < now;
        return (
          <li key={a.id} className="flex items-start gap-3 py-2">
            {a.kind !== "note" && a.kind !== "whatsapp" ? (
              <button type="button" title={a.doneAt ? t("crm.activities.reopen") : t("crm.activities.done")} onClick={async () => { await api(`/crm/activities/${a.id}/done`, { body: { done: !a.doneAt } }); router.refresh(); }}
                className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border ${a.doneAt ? "border-success bg-success text-white" : "border-border"}`}>{a.doneAt ? <Check className="size-3" aria-hidden /> : null}</button>
            ) : <MessageCircle className="mt-0.5 size-5 shrink-0 text-muted" aria-hidden />}
            <div className="min-w-0 flex-1">
              <div className={a.doneAt && a.kind !== "note" && a.kind !== "whatsapp" ? "text-muted line-through" : ""}>
                <span className="mr-2 rounded bg-surface-2 px-1.5 text-xs text-muted">{t(`crm.activities.kinds.${a.kind}`)}</span>{a.subject}
              </div>
              {a.notes ? <div className="text-xs whitespace-pre-wrap text-muted">{a.notes}</div> : null}
              {showWho && (a.lead || a.account) ? (
                <a href={a.leadId ? `/crm/leads/${a.leadId}` : `/crm/customers/${a.accountId}`} className="text-xs text-primary hover:underline">{a.leadCode ? `${a.leadCode} ` : ""}{a.lead ?? a.account}</a>
              ) : null}
            </div>
            <div className={`shrink-0 text-right text-xs ${late ? "font-semibold text-danger" : "text-muted"}`}>
              {a.dueAt ? format.dateTime(new Date(a.dueAt), { dateStyle: "medium", timeStyle: "short" }) : a.doneAt ? format.dateTime(new Date(a.doneAt), { dateStyle: "medium" }) : ""}
              {late ? <div>{t("crm.activities.late")}</div> : null}
              {a.owner ? <div>{a.owner}</div> : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function SendMessage({ templates, leadId, accountId, defaults, demo }: { templates: Template[]; leadId?: string; accountId?: string; defaults: string[]; demo: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const live = templates.filter((x) => !x.archived);
  const [templateId, setTemplateId] = useState(live[0]?.id ?? "");
  const tpl = live.find((x) => x.id === templateId);
  const [params, setParams] = useState<string[]>(defaults);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const preview = tpl ? tpl.body.replace(/\{\{(\d+)\}\}/g, (_m, n: string) => params[Number(n) - 1] || `{{${n}}}`) : "";
  return (
    <Card className="flex flex-col gap-3">
      <h2 className="flex items-center gap-2 font-semibold"><MessageCircle className="size-4 text-success" aria-hidden />{t("crm.messages.send")}</h2>
      {demo ? <p className="text-xs text-muted">{t("crm.messages.demo")}</p> : null}
      <Field label={t("crm.messages.template")} htmlFor="sm-t">
        <Select id="sm-t" value={templateId} onChange={(e) => setTemplateId(e.target.value)}>{live.map((x) => <option key={x.id} value={x.id}>{x.name.replace(/_/g, " ")}</option>)}</Select>
      </Field>
      {tpl?.params.map((n) => (
        <Field key={n} label={`{{${n}}}`} htmlFor={`sm-p-${n}`}>
          <Input id={`sm-p-${n}`} value={params[n - 1] ?? ""} onChange={(e) => { const p = [...params]; p[n - 1] = e.target.value; setParams(p); }} maxLength={300} />
        </Field>
      ))}
      {tpl ? <p className="rounded-lg bg-surface-2 p-3 text-sm whitespace-pre-wrap">{preview}</p> : null}
      <div className="flex items-center gap-3">
        <Button disabled={!tpl} onClick={async () => {
          setError(null);
          setMsg(null);
          try {
            const r = await api<{ to: string; status: string; error: string | null }>("/crm/messages", { body: { templateId, params: tpl!.params.map((n) => params[n - 1] ?? ""), leadId, accountId } });
            setMsg(r.status === "sent" ? t("crm.messages.sent", { to: `+${r.to}` }) : t("crm.messages.failed", { error: r.error ?? "" }));
            router.refresh();
          } catch (err) { setError(errorText(t, err, CRM_NS)); }
        }}>{t("crm.messages.send")}</Button>
        {msg ? <span className="text-sm text-success">{msg}</span> : null}
      </div>
      {error ? <Alert>{error}</Alert> : null}
    </Card>
  );
}

export function RemindButton({ accountId, date }: { accountId: string; date: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" onClick={async () => {
        try { const r = await api<{ to: string }>(`/crm/customers/${accountId}/remind?date=${date}`, { body: {} }); setMsg(t("crm.messages.sent", { to: `+${r.to}` })); router.refresh(); } catch (err) { setMsg(errorText(t, err, CRM_NS)); }
      }}><MessageCircle className="size-4" aria-hidden />{t("crm.messages.remind")}</Button>
      {msg ? <span className="text-sm text-muted">{msg}</span> : null}
    </div>
  );
}

export function TemplatesEditor({ templates, canEdit }: { templates: Template[]; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [rows, setRows] = useState<(Omit<Template, "id" | "params"> & { id?: string })[]>(templates);
  const [error, setError] = useState<string | null>(null);
  const set = (i: number, patch: Partial<(typeof rows)[number]>) => setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const save = async (i: number) => {
    const { id, ...body } = rows[i]!;
    setError(null);
    try { await api(id ? `/crm/templates/${id}` : "/crm/templates", { method: id ? "PUT" : "POST", body }); router.refresh(); } catch (err) { setError(errorText(t, err, CRM_NS)); }
  };
  return (
    <Card className="flex flex-col gap-4">
      {rows.map((r, i) => (
        <div key={r.id ?? `new-${i}`} className="grid gap-3 border-b border-border pb-4 last:border-0 md:grid-cols-4">
          <Field label={t("crm.templates.name")} htmlFor={`mt-n-${i}`}><Input id={`mt-n-${i}`} value={r.name} onChange={(e) => set(i, { name: e.target.value })} maxLength={60} className="font-mono" disabled={!canEdit} /></Field>
          <Field label={t("crm.templates.category")} htmlFor={`mt-c-${i}`}>
            <Select id={`mt-c-${i}`} value={r.category} onChange={(e) => set(i, { category: e.target.value })} disabled={!canEdit}>{(["utility", "marketing"] as const).map((c) => <option key={c} value={c}>{t(`crm.templates.categories.${c}`)}</option>)}</Select>
          </Field>
          <Field label={t("crm.templates.providerName")} htmlFor={`mt-p-${i}`}><Input id={`mt-p-${i}`} value={r.providerName ?? ""} onChange={(e) => set(i, { providerName: e.target.value || null })} maxLength={80} disabled={!canEdit} /></Field>
          <label className="flex items-center gap-2 self-end pb-2 text-sm"><input type="checkbox" checked={r.archived} onChange={(e) => set(i, { archived: e.target.checked })} disabled={!canEdit || !r.id} className="size-4 accent-[var(--primary)]" />{t("common.archived")}</label>
          <div className="md:col-span-4">
            <Field label={t("crm.templates.body")} htmlFor={`mt-b-${i}`}>
              <textarea id={`mt-b-${i}`} value={r.body} onChange={(e) => set(i, { body: e.target.value })} maxLength={1024} rows={3} disabled={!canEdit}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring" />
            </Field>
          </div>
          {canEdit ? <div><Button variant="outline" onClick={() => save(i)} disabled={!/^[a-z0-9_]{3,60}$/.test(r.name) || r.body.length < 5}>{t("crm.templates.save")}</Button></div> : null}
        </div>
      ))}
      {canEdit ? <div><Button variant="ghost" className="-ml-3" onClick={() => setRows([...rows, { name: "", body: "", category: "utility", language: "en", providerName: null, archived: false }])}><Plus className="size-4" aria-hidden />{t("crm.templates.add")}</Button></div> : null}
      {error ? <Alert>{error}</Alert> : null}
    </Card>
  );
}
