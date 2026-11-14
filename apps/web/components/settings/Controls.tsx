"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { fyStart, todayIso } from "@/lib/format";
import { Alert, Badge, Button, Card, Field, Select } from "../ui";

interface Sod { pairs: string[]; checked: number; people: { userId: string; name: string; email: string; role: string; roleName: string; conflicts: string[] }[] }
interface Journals { checked: number; flagged: number; counts: Record<string, number>; items: { id: string; number: string; date: string; total: string; narration: string | null; by: string | null; enteredAt: string; flags: string[] }[] }
interface Related { parties: { id: string; name: string; debit: string; credit: string; vouchers: number }[]; totalDebit: string; totalCredit: string }
interface Member { userId: string; name: string; email: string; role: string; decision: "keep" | "change" | "remove" | null; note: string | null }
interface Reviews { overdue: boolean; daysSince: number | null; reviews: { id: string; startedAt: string; startedBy: string | null; completedAt: string | null; members: Member[] }[] }

const TABS = ["sod", "journals", "related", "access"] as const;
const NS = ["controls.errors", "hr.errors"];

/** Internal controls: conflicting rights, unusual journals, related-party dealings, and the periodic look at who has access. */
export function Controls({ parties, canEdit, canMark }: { parties: { id: string; name: string }[]; canEdit: boolean; canMark: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const [tab, setTab] = useState<(typeof TABS)[number]>("sod");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sod, setSod] = useState<Sod | null>(null);
  const [journals, setJournals] = useState<Journals | null>(null);
  const [related, setRelated] = useState<Related | null>(null);
  const [reviews, setReviews] = useState<Reviews | null>(null);
  const [partyId, setPartyId] = useState("");
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });
  const fail = useCallback((err: unknown) => setError(errorText(t, err, NS)), [t]);
  const load = useCallback(() => {
    setError(null);
    const to = todayIso();
    const from = fyStart(to);
    if (tab === "sod") api<Sod>("/controls/sod").then(setSod).catch(fail);
    if (tab === "journals") api<Journals>(`/controls/journals?from=${from}&to=${to}`).then(setJournals).catch(fail);
    if (tab === "related") api<Related>(`/controls/related-parties?from=${from}&to=${to}`).then(setRelated).catch(fail);
    if (tab === "access") api<Reviews>("/controls/access-reviews").then(setReviews).catch(fail);
  }, [tab, fail]);
  useEffect(() => { load(); }, [load]);
  const act = async (fn: () => Promise<unknown>) => { setBusy(true); setError(null); try { await fn(); load(); } catch (err) { fail(err); } finally { setBusy(false); } };
  const open = reviews?.reviews.find((r) => !r.completedAt) ?? null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="tablist">
        {TABS.map((k) => <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-lg border px-3 py-1.5 text-sm ${tab === k ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-surface-2"}`}>{t(`controls.tabs.${k}`)}</button>)}
      </div>
      {error ? <Alert>{error}</Alert> : null}

      {tab === "sod" && sod ? (
        <Card className="p-0">
          <p className="px-4 py-2 text-sm text-muted">{t("controls.sod.help", { n: sod.checked })}</p>
          {sod.people.length ? <ul>{sod.people.map((p) => (
            <li key={p.userId} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-rule px-4 py-2.5 text-sm"><span className="font-medium">{p.name}</span><span className="text-muted">{p.roleName}</span>{p.conflicts.map((c) => <Badge key={c} tone="warning">{t(`controls.sod.pairs.${c}`)}</Badge>)}</li>
          ))}</ul> : <p className="px-4 py-6 text-center text-muted">{t("controls.sod.none")}</p>}
        </Card>
      ) : null}

      {tab === "journals" && journals ? (
        <Card className="p-0">
          <p className="px-4 py-2 text-sm text-muted">{t("controls.journals.help", { checked: journals.checked, flagged: journals.flagged })}</p>
          <div className="flex flex-wrap gap-2 px-4 pb-2">{Object.entries(journals.counts).filter(([, n]) => n > 0).map(([k, n]) => <Badge key={k} tone="neutral">{t(`controls.journals.flags.${k}`)}: {n}</Badge>)}</div>
          {journals.items.length ? <ul>{journals.items.map((j) => (
            <li key={j.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-rule px-4 py-2 text-sm"><span className="font-mono text-xs">{j.number}</span><span className="text-muted">{j.date}</span><span className="num font-medium">{money(j.total)}</span><span className="text-muted">{j.by}</span>{j.flags.map((f) => <Badge key={f} tone="warning">{t(`controls.journals.flags.${f}`)}</Badge>)}{j.narration ? <span className="text-xs text-muted">{j.narration}</span> : null}</li>
          ))}</ul> : <p className="px-4 py-6 text-center text-muted">{t("controls.journals.none")}</p>}
        </Card>
      ) : null}

      {tab === "related" && related ? (
        <>
          {canMark ? (
            <Card>
              <div className="flex flex-wrap items-end gap-3">
                <Field label={t("controls.related.mark")} htmlFor="rp-party"><Select id="rp-party" value={partyId} onChange={(e) => setPartyId(e.target.value)} className="w-72"><option value="" />{parties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select></Field>
                <Button disabled={busy || !partyId} onClick={() => act(() => api(`/accounts/${partyId}/related-party`, { method: "PUT", body: { value: true } }).then(() => setPartyId("")))}>{t("controls.related.add")}</Button>
              </div>
              <p className="mt-2 text-xs text-muted">{t("controls.related.hint")}</p>
            </Card>
          ) : null}
          <Card className="p-0">
            {related.parties.length ? <ul>{related.parties.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-x-4 border-b border-rule px-4 py-2.5 text-sm last:border-0"><span className="font-medium">{p.name}</span><span className="text-muted">{t("controls.related.vouchers", { n: p.vouchers })}</span><span className="num ml-auto">{t("controls.related.debit")} {money(p.debit)}</span><span className="num">{t("controls.related.credit")} {money(p.credit)}</span>
                {canMark ? <button type="button" disabled={busy} className="text-primary hover:underline" onClick={() => act(() => api(`/accounts/${p.id}/related-party`, { method: "PUT", body: { value: false } }))}>{t("controls.related.remove")}</button> : null}</li>
            ))}</ul> : <p className="px-4 py-6 text-center text-muted">{t("controls.related.none")}</p>}
          </Card>
        </>
      ) : null}

      {tab === "access" && reviews ? (
        <>
          <Card>
            <div className="flex flex-wrap items-center gap-3">
              {reviews.overdue ? <Badge tone="danger">{reviews.daysSince === null ? t("controls.access.never") : t("controls.access.overdue", { n: reviews.daysSince })}</Badge> : <Badge tone="success">{t("controls.access.recent", { n: reviews.daysSince ?? 0 })}</Badge>}
              {canEdit && !open ? <Button disabled={busy} onClick={() => act(() => api("/controls/access-reviews", { body: {} }))}>{t("controls.access.start")}</Button> : null}
              {open && canEdit ? <Button disabled={busy || open.members.some((m) => !m.decision)} onClick={() => act(() => api(`/controls/access-reviews/${open.id}/complete`, { body: {} }))}>{t("controls.access.complete")}</Button> : null}
            </div>
          </Card>
          {open ? (
            <Card className="p-0">
              <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("controls.access.open")}</h2>
              <ul>{open.members.map((m) => (
                <li key={m.userId} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-rule px-4 py-2.5 text-sm last:border-0">
                  <span className="font-medium">{m.name}</span><span className="text-muted">{m.email}</span><span>{m.role}</span>
                  {m.decision ? <Badge tone={m.decision === "keep" ? "success" : "warning"}>{t(`controls.access.${m.decision}`)}</Badge> : null}{m.note ? <span className="text-xs text-muted">{m.note}</span> : null}
                  {canEdit ? <span className="ml-auto flex gap-3">{(["keep", "change", "remove"] as const).map((d) => <button key={d} type="button" disabled={busy} className="text-primary hover:underline" onClick={() => {
                    const note = d === "keep" ? "" : window.prompt(t("controls.access.notePrompt")) ?? "";
                    if (d !== "keep" && note.trim().length < 3) return;
                    void act(() => api(`/controls/access-reviews/${open.id}/decide`, { body: { userId: m.userId, decision: d, ...(note ? { note: note.trim() } : {}) } }));
                  }}>{t(`controls.access.${d}`)}</button>)}</span> : null}
                </li>
              ))}</ul>
            </Card>
          ) : null}
          {reviews.reviews.filter((r) => r.completedAt).slice(0, 5).map((r) => (
            <Card key={r.id} className="text-sm">{t("controls.access.done", { when: format.dateTime(new Date(r.completedAt!), { dateStyle: "medium" }), by: r.startedBy ?? "", n: r.members.filter((m) => m.decision !== "keep").length })}</Card>
          ))}
        </>
      ) : null}
    </div>
  );
}
