"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ACTIONS, MODULES } from "@varchasv/domain";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Badge, Button, Card, Field, Input, Select } from "../ui";

export type Kind = "item" | "account" | "role" | "number_series";
export interface Change { id: string; entity: Kind; entityId: string; entityName: string; field: string; value: string | null; previous: string | null; effectiveFrom: string; status: "pending" | "applied" | "cancelled" | "failed"; note: string | null; error: string | null }
interface Option { id: string; name: string }
interface RoleOption extends Option { permissions: string[] }
interface SeriesOption extends Option { pattern: string }

const NS = ["dated.errors"];
const safeCount = (v: string | null) => { try { const l = JSON.parse(v ?? "[]"); return Array.isArray(l) ? l.length : 0; } catch { return 0; } };
const TONE = { pending: "warning", applied: "success", cancelled: "neutral", failed: "danger" } as const;

/** Set a rate or term to change on a date, and see what is waiting and what already changed. */
export function DatedChanges({ changes, fields, items, parties, canItem, canParty, roles = [], series = [] }: { changes: Change[]; fields: Record<Kind, string[]>; items: Option[]; parties: Option[]; canItem: boolean; canParty: boolean; roles?: RoleOption[]; series?: SeriesOption[] }) {
  const t = useTranslations();
  const router = useRouter();
  const kinds: Kind[] = [...(canItem ? (["item"] as const) : []), ...(canParty ? (["account"] as const) : []), ...(roles.length ? (["role"] as const) : []), ...(series.length ? (["number_series"] as const) : [])];
  const [entity, setEntity] = useState<Kind>(kinds[0] ?? "item");
  const [perms, setPerms] = useState<Set<string>>(new Set());
  const [entityId, setEntityId] = useState("");
  const [field, setField] = useState(fields[entity][0] ?? "");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const records: Option[] = entity === "item" ? items : entity === "account" ? parties : entity === "role" ? roles : series;
  const known = entity === "role" ? new Set(roles.find((r) => r.id === entityId)?.permissions ?? []) : null;
  const label = (f: string) => t(`dated.fields.${f}`);
  const pending = changes.filter((c) => c.status === "pending");
  const past = changes.filter((c) => c.status !== "pending");

  async function call(fn: () => Promise<unknown>, done?: () => void) {
    setBusy(true);
    setError(null);
    try { await fn(); done?.(); router.refresh(); } catch (err) { setError(errorText(t, err, NS)); } finally { setBusy(false); }
  }
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void call(() => api("/config/changes", { body: { entity, entityId, field, value: entity === "role" ? JSON.stringify([...perms]) : value.trim() === "" ? null : value.trim(), effectiveFrom: date, note: note.trim() || null } }), () => { setValue(""); setNote(""); });
  };
  const row = (c: Change) => (
    <li key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-rule px-4 py-2 text-sm last:border-0">
      <span className="whitespace-nowrap">{c.effectiveFrom}</span>
      <span className="font-medium">{c.entityName}</span>
      <span>{label(c.field)}: <span className="num font-medium">{c.field === "permissions" ? t("dated.rights", { n: safeCount(c.value) }) : c.value ?? "-"}</span>{c.previous !== null && c.status === "applied" && c.field !== "permissions" ? <span className="ml-1 text-muted">({t("dated.from", { previous: c.previous })})</span> : null}</span>
      <Badge tone={TONE[c.status]}>{t(`dated.status.${c.status}`)}</Badge>
      {c.note ? <span className="text-muted">{c.note}</span> : null}
      {c.error ? <span className="text-danger">{c.error}</span> : null}
      {c.status === "pending" ? <button type="button" disabled={busy} onClick={() => call(() => api(`/config/changes/${c.id}/cancel`, { body: {} }))} className="ml-auto text-primary hover:underline">{t("dated.cancel")}</button> : null}
    </li>
  );

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      {kinds.length ? (
        <Card>
          <form onSubmit={submit} method="post" className="flex flex-wrap items-end gap-4">
            <Field label={t("dated.kind")} htmlFor="dc-kind">
              <Select id="dc-kind" value={entity} onChange={(e) => { const k = e.target.value as Kind; setEntity(k); setEntityId(""); setField(fields[k][0] ?? ""); setValue(""); }} className="w-56">
                {kinds.map((k) => <option key={k} value={k}>{t(`dated.${k}`)}</option>)}
              </Select>
            </Field>
            <Field label={t("dated.record")} htmlFor="dc-rec"><Select id="dc-rec" value={entityId} onChange={(e) => { setEntityId(e.target.value); const r = roles.find((x) => x.id === e.target.value); if (entity === "role") setPerms(new Set(r?.permissions ?? [])); const sr = series.find((x) => x.id === e.target.value); if (entity === "number_series") setValue(sr?.pattern ?? ""); }} required className="w-64"><option value="" />{records.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</Select></Field>
            <Field label={t("dated.field")} htmlFor="dc-field"><Select id="dc-field" value={field} onChange={(e) => setField(e.target.value)} className="w-48">{fields[entity].map((f) => <option key={f} value={f}>{label(f)}</option>)}</Select></Field>
            {entity === "role" ? null : <Field label={t("dated.value")} htmlFor="dc-value" hint={entity === "number_series" ? t("dated.patternHint") : t("dated.valueEmpty")}><Input id="dc-value" value={value} onChange={(e) => setValue(e.target.value)} inputMode={entity === "number_series" ? "text" : "decimal"} maxLength={entity === "number_series" ? 40 : undefined} className={entity === "number_series" ? "font-mono w-64" : "num w-32"} /></Field>}
            <Field label={t("dated.date")} htmlFor="dc-date"><Input id="dc-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
            <Field label={t("dated.note")} htmlFor="dc-note"><Input id="dc-note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} className="w-56" /></Field>
            <Button type="submit" disabled={busy || !entityId || !date || (entity === "role" && !perms.size)}>{t("dated.schedule")}</Button>
          </form>
          {entity === "role" && entityId ? (
            <div className="mt-4 overflow-x-auto">
              <p className="mb-1 text-sm text-muted">{t("dated.permsHelp")}</p>
              <table className="text-sm">
                <thead><tr><th className="pr-4 text-left font-medium" />{ACTIONS.map((a) => <th key={a} className="px-2 text-xs font-medium text-muted">{a}</th>)}</tr></thead>
                <tbody>{MODULES.map((m) => (
                  <tr key={m}><td className="pr-4 py-0.5">{m}</td>{ACTIONS.map((a) => {
                    const p = `${m}.${a}`;
                    const on = perms.has(p);
                    return <td key={a} className="px-2 text-center"><input type="checkbox" checked={on} onChange={() => { const n = new Set(perms); if (on) n.delete(p); else n.add(p); setPerms(n); }} className={`accent-[var(--primary)] ${known?.has(p) !== on ? "outline outline-1 outline-primary" : ""}`} aria-label={p} /></td>;
                  })}</tr>
                ))}</tbody>
              </table>
            </div>
          ) : null}
        </Card>
      ) : null}
      <Card className="p-0">
        <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("dated.pending")}</h2>
        {pending.length ? <ul>{pending.map(row)}</ul> : <p className="px-4 py-6 text-center text-muted">{t("dated.none")}</p>}
      </Card>
      {past.length ? (
        <Card className="p-0">
          <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("dated.history")}</h2>
          <ul>{past.map(row)}</ul>
        </Card>
      ) : null}
    </div>
  );
}
