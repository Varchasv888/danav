"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { fyStart, todayIso } from "@/lib/format";
import { Alert, Badge, Button, Card, Field, Input, Select } from "../ui";

export interface RunRow { id: string; kind: string; party: string | null; from: string; to: string; status: "open" | "closed"; exceptions: number }
interface Item { id: string; side: "ours" | "theirs"; ref: string; date: string; amount: string; description: string | null; status: "unmatched" | "matched" | "written_off"; groupId: string | null; rule: string | null; matchedBy: string | null; reasonCode: string | null; ownerId: string | null; owner: string | null; note: string | null; ageDays: number }
interface Detail {
  id: string; kind: string; party: string | null; from: string; to: string; status: "open" | "closed";
  totals: { ours: string; theirs: string; difference: string; unmatchedOurs: string; unmatchedTheirs: string; exceptions: number };
  ageing: { d0_30: number; d31_60: number; d61_90: number; over90: number };
  items: Item[]; events: { id: number; action: string; detail: Record<string, unknown>; by: string | null; at: string }[];
  writeoffs: { id: string; itemIds: string[]; amount: string; reasonCode: string; note: string | null; status: "pending" | "approved" | "rejected"; requestedBy: string | null }[];
}

const REASONS = ["timing", "missing_document", "wrong_amount", "duplicate", "disputed", "bank_charge", "other"] as const;
const NS = ["recon.errors", "hr.errors"];

/** Parses pasted statement lines: date, reference, amount, description (comma or tab separated). */
function parseStatement(text: string) {
  const rows: { date: string; ref: string; amount: string; description?: string }[] = [];
  for (const line of text.split(/\r?\n/)) {
    const cells = line.split(/[\t,]/).map((c) => c.trim());
    if (cells.length < 3 || !/^\d{4}-\d{2}-\d{2}$/.test(cells[0]!)) continue;
    const amount = cells[2]!.replace(/[^\d.-]/g, "");
    if (!/^-?\d+(\.\d{1,2})?$/.test(amount)) continue;
    rows.push({ date: cells[0]!, ref: cells[1]!, amount, ...(cells[3] ? { description: cells.slice(3).join(", ") } : {}) });
  }
  return rows;
}

/** Statements against the ledger: start a run, see what matched, work the exceptions, and write off differences with a second person's approval. */
export function Reconciliation({ runs, customers, suppliers, people, userId, canCreate, canApprove }: { runs: RunRow[]; customers: { id: string; name: string }[]; suppliers: { id: string; name: string }[]; people: { id: string; name: string }[]; userId: string; canCreate: boolean; canApprove: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [kind, setKind] = useState<"customer_statement" | "supplier_statement">("customer_statement");
  const [partyId, setPartyId] = useState("");
  const [from, setFrom] = useState(() => fyStart(todayIso()));
  const [to, setTo] = useState(() => todayIso());
  const [text, setText] = useState("");
  const [detail, setDetail] = useState<Detail | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });
  const fail = useCallback((err: unknown) => setError(errorText(t, err, NS)), [t]);
  const open = async (id: string) => { setError(null); setPicked([]); try { setDetail(await api<Detail>(`/recon/runs/${id}`)); } catch (err) { fail(err); } };
  const act = async (fn: () => Promise<unknown>) => { setBusy(true); setError(null); try { await fn(); if (detail) await open(detail.id); router.refresh(); } catch (err) { fail(err); } finally { setBusy(false); } };
  const rows = parseStatement(text);
  const parties = kind === "customer_statement" ? customers : suppliers;
  const exceptions = detail?.items.filter((i) => i.status === "unmatched") ?? [];
  const groups = new Map<string, Item[]>();
  for (const i of detail?.items ?? []) if (i.groupId) groups.set(i.groupId, [...(groups.get(i.groupId) ?? []), i]);

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      {!detail ? (
        <>
          {canCreate ? (
            <Card>
              <p className="mb-3 text-sm text-muted">{t("recon.help")}</p>
              <form method="post" className="flex flex-col gap-3" onSubmit={async (e) => { e.preventDefault(); setBusy(true); setError(null); try { const r = await api<Detail>("/recon/runs", { body: { kind, partyId, from, to, theirs: rows } }); setDetail(r); setText(""); router.refresh(); } catch (err) { fail(err); } finally { setBusy(false); } }}>
                <div className="flex flex-wrap items-end gap-3">
                  <Field label={t("recon.kind")} htmlFor="rc-kind"><Select id="rc-kind" value={kind} onChange={(e) => { setKind(e.target.value as typeof kind); setPartyId(""); }} className="w-48"><option value="customer_statement">{t("recon.customer")}</option><option value="supplier_statement">{t("recon.supplier")}</option></Select></Field>
                  <Field label={t("recon.party")} htmlFor="rc-party"><Select id="rc-party" value={partyId} onChange={(e) => setPartyId(e.target.value)} required className="w-64"><option value="" />{parties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select></Field>
                  <Field label={t("recon.from")} htmlFor="rc-from"><Input id="rc-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} required /></Field>
                  <Field label={t("recon.to")} htmlFor="rc-to"><Input id="rc-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} required /></Field>
                </div>
                <Field label={t("recon.paste")} htmlFor="rc-text" hint={t("recon.pasteHint")}><textarea id="rc-text" value={text} onChange={(e) => setText(e.target.value)} rows={6} className="w-full rounded-md border border-border bg-surface p-2 font-mono text-xs" placeholder="2026-10-02, INV-101, 5000, Goods" /></Field>
                <div className="flex items-center gap-3"><Button type="submit" disabled={busy || !partyId || !rows.length}>{t("recon.start")}</Button><span className="text-xs text-muted">{t("recon.rows", { n: rows.length })}</span></div>
              </form>
            </Card>
          ) : null}
          <Card className="p-0">
            <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("recon.runs")}</h2>
            {runs.length ? <ul>{runs.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-x-4 border-b border-rule px-4 py-2.5 text-sm last:border-0"><span className="font-medium">{r.party}</span><span className="text-muted">{t(`recon.${r.kind === "customer_statement" ? "customer" : "supplier"}`)}</span><span className="text-muted">{r.from} – {r.to}</span>
                <Badge tone={r.status === "closed" ? "success" : r.exceptions ? "warning" : "neutral"}>{r.status === "closed" ? t("recon.closed") : t("recon.exceptionsCount", { n: r.exceptions })}</Badge>
                <button type="button" className="ml-auto text-primary hover:underline" onClick={() => void open(r.id)}>{t("recon.open")}</button></li>
            ))}</ul> : <p className="px-4 py-6 text-center text-muted">{t("recon.none")}</p>}
          </Card>
        </>
      ) : (
        <>
          <Card>
            <div className="flex flex-wrap items-center gap-4">
              <button type="button" className="text-primary hover:underline" onClick={() => { setDetail(null); router.refresh(); }}>{t("recon.back")}</button>
              <h2 className="font-semibold">{detail.party}</h2><span className="text-muted">{detail.from} – {detail.to}</span>
              <Badge tone={detail.status === "closed" ? "success" : "warning"}>{detail.status === "closed" ? t("recon.closed") : t("recon.openStatus")}</Badge>
              {canApprove && detail.status === "open" ? <Button className="ml-auto" disabled={busy} onClick={() => act(() => api(`/recon/runs/${detail.id}/close`, { body: {} }))}>{t("recon.close")}</Button> : null}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-4">
              <div><p className="text-xs text-muted">{t("recon.oursTotal")}</p><p className="num font-semibold">{money(detail.totals.ours)}</p></div>
              <div><p className="text-xs text-muted">{t("recon.theirsTotal")}</p><p className="num font-semibold">{money(detail.totals.theirs)}</p></div>
              <div><p className="text-xs text-muted">{t("recon.difference")}</p><p className={`num font-semibold ${Number(detail.totals.difference) ? "text-warning" : "text-success"}`}>{money(detail.totals.difference)}</p></div>
              <div><p className="text-xs text-muted">{t("recon.ageing")}</p><p className="text-sm">{detail.ageing.d0_30} / {detail.ageing.d31_60} / {detail.ageing.d61_90} / {detail.ageing.over90}</p></div>
            </div>
          </Card>

          <Card className="p-0">
            <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-2"><h2 className="text-sm font-semibold">{t("recon.exceptions", { n: exceptions.length })}</h2>
              {canCreate && detail.status === "open" ? <>
                <Button variant="outline" disabled={busy || picked.length < 2} onClick={() => act(() => api(`/recon/runs/${detail.id}/match`, { body: { itemIds: picked } }))}>{t("recon.matchPicked")}</Button>
                <Button variant="outline" disabled={busy || !picked.length} onClick={() => { const reasonCode = window.prompt(t("recon.reasonPrompt"), "other"); const note = reasonCode ? window.prompt(t("recon.writeoffNote")) : null; if (reasonCode && note && note.trim().length >= 3) void act(() => api(`/recon/runs/${detail.id}/writeoffs`, { body: { itemIds: picked, reasonCode, note: note.trim() } })); }}>{t("recon.requestWriteoff")}</Button>
              </> : null}
            </div>
            {exceptions.length ? <ul>{exceptions.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-rule px-4 py-2 text-sm last:border-0">
                {canCreate && detail.status === "open" ? <input type="checkbox" checked={picked.includes(i.id)} onChange={(e) => setPicked(e.target.checked ? [...picked, i.id] : picked.filter((x) => x !== i.id))} aria-label={i.ref} /> : null}
                <Badge tone={i.side === "ours" ? "neutral" : "warning"}>{t(`recon.side.${i.side}`)}</Badge><span className="whitespace-nowrap text-muted">{i.date}</span><span className="font-mono text-xs">{i.ref}</span><span className="num font-medium">{money(i.amount)}</span><span className="text-xs text-muted">{t("recon.age", { n: i.ageDays })}</span>
                {canCreate && detail.status === "open" ? <>
                  <Select value={i.reasonCode ?? ""} onChange={(e) => void act(() => api(`/recon/items/${i.id}`, { method: "PATCH", body: { reasonCode: e.target.value || null } }))} className="w-44" aria-label={t("recon.reason")}><option value="">{t("recon.reason")}</option>{REASONS.map((r) => <option key={r} value={r}>{t(`recon.reasons.${r}`)}</option>)}</Select>
                  <Select value={i.ownerId ?? ""} onChange={(e) => void act(() => api(`/recon/items/${i.id}`, { method: "PATCH", body: { ownerId: e.target.value || null } }))} className="w-40" aria-label={t("recon.owner")}><option value="">{t("recon.owner")}</option>{people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select>
                </> : <span className="text-xs text-muted">{i.reasonCode ? t(`recon.reasons.${i.reasonCode}`) : ""} {i.owner ?? ""}</span>}
                {i.note ? <span className="text-xs text-muted">{i.note}</span> : null}
              </li>
            ))}</ul> : <p className="px-4 py-6 text-center text-muted">{t("recon.noExceptions")}</p>}
          </Card>

          {detail.writeoffs.length ? (
            <Card className="p-0">
              <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("recon.writeoffs")}</h2>
              <ul>{detail.writeoffs.map((w) => (
                <li key={w.id} className="flex flex-wrap items-center gap-x-4 border-b border-rule px-4 py-2 text-sm last:border-0"><span className="num font-medium">{money(w.amount)}</span><span>{t(`recon.reasons.${w.reasonCode}`)}</span><span className="text-muted">{w.note}</span><Badge tone={w.status === "pending" ? "warning" : w.status === "approved" ? "success" : "neutral"}>{t(`recon.wstatus.${w.status}`)}</Badge>
                  {w.status === "pending" && canApprove ? (w.requestedBy === userId ? <span className="ml-auto text-xs text-muted">{t("recon.ownRequest")}</span> : <span className="ml-auto flex gap-2"><Button disabled={busy} onClick={() => act(() => api(`/recon/writeoffs/${w.id}/decide`, { body: { decision: "approve" } }))}>{t("recon.approve")}</Button><Button variant="outline" disabled={busy} onClick={() => act(() => api(`/recon/writeoffs/${w.id}/decide`, { body: { decision: "reject" } }))}>{t("recon.reject")}</Button></span>) : null}</li>
              ))}</ul>
            </Card>
          ) : null}

          <Card className="p-0">
            <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("recon.matched")}</h2>
            <ul className="max-h-80 overflow-y-auto">{[...groups.entries()].map(([g, list]) => (
              <li key={g} className="flex flex-wrap items-center gap-x-3 border-b border-rule px-4 py-1.5 text-xs last:border-0">
                <Badge tone="success">{t(`recon.rules.${list[0]?.rule ?? "manual"}`)}</Badge>
                {list.map((i) => <span key={i.id} className="whitespace-nowrap">{t(`recon.side.${i.side}`)} {i.ref || i.date} {money(i.amount)}</span>)}
                {canCreate && detail.status === "open" ? <button type="button" disabled={busy} className="ml-auto text-primary hover:underline" onClick={() => act(() => api(`/recon/runs/${detail.id}/unmatch`, { body: { groupId: g } }))}>{t("recon.unmatch")}</button> : null}
              </li>
            ))}</ul>
          </Card>

          <Card className="p-0">
            <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("recon.history")}</h2>
            <ul className="max-h-60 overflow-y-auto">{detail.events.map((e) => <li key={e.id} className="border-b border-rule px-4 py-1.5 text-xs last:border-0">{format.dateTime(new Date(e.at), { dateStyle: "medium", timeStyle: "short" })} · {e.by} · {t(`recon.events.${e.action}`)}</li>)}</ul>
          </Card>
        </>
      )}
    </div>
  );
}
