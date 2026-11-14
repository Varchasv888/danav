"use client";

import { Check, EyeOff, Search, Undo2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { localName, rupees } from "@/lib/format";
import { sheetToCsv } from "@/lib/sheet-to-csv";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export const BANK_NS = ["banking.errors", "vouchers.errors", "accounts.errors"];
export type Ledger = { id: string; name: string; nameHi: string | null };
interface Entry { id: string; date: string; number: string; amount: string; direction: "in" | "out"; party: string | null; reference: string | null }
export interface BankLine {
  id: string; date: string; description: string; reference: string | null; debit: string; credit: string; balance: string | null; status: string; matchedBy: string | null;
  suggestion: (Entry & { score: number; reasons: string[] }) | null;
  rule: { id: string; accountId: string; account: string } | null;
  vouchers: { id: string; number: string; date: string; type: string; amount: string }[];
}

interface Imported {
  added: number; duplicates: number; matched: number;
  check: { checkable: boolean; opening: string | null; closing: string | null; breaks: { date: string; description: string; expected: string; found: string; difference: string }[] };
  continuity: { previousDate: string; previousBalance: string; opening: string; agrees: boolean } | null;
}
/** What the statement says about itself: whether it adds up line by line, and whether it starts where the last one ended. */
function statementNotes(r: Imported, t: ReturnType<typeof useTranslations>): { tone: "ok" | "bad" | "info"; text: string }[] {
  const out: { tone: "ok" | "bad" | "info"; text: string }[] = [];
  if (!r.check.checkable) out.push({ tone: "info", text: t("banking.check.none") });
  else if (!r.check.breaks.length) out.push({ tone: "ok", text: t("banking.check.adds", { opening: rupees(r.check.opening!), closing: rupees(r.check.closing!) }) });
  else for (const b of r.check.breaks.slice(0, 5)) out.push({ tone: "bad", text: t("banking.check.break", { date: b.date, description: b.description, expected: rupees(b.expected), found: rupees(b.found) }) });
  if (r.continuity) out.push(r.continuity.agrees ? { tone: "ok", text: t("banking.check.continues", { date: r.continuity.previousDate }) } : { tone: "bad", text: t("banking.check.gap", { date: r.continuity.previousDate, previous: rupees(r.continuity.previousBalance), opening: rupees(r.continuity.opening) }) });
  return out;
}

const readText = (f: File) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = rej; r.readAsText(f); });

export function ImportStatement({ accountId }: { accountId: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checks, setChecks] = useState<{ tone: "ok" | "bad" | "info"; text: string }[]>([]);
  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setBusy(true);
    setError(null);
    setMsg(null);
    setChecks([]);
    try {
      const csv = /\.xlsx$/i.test(f.name) ? await sheetToCsv(f) : await readText(f);
      const r = await api<Imported>(`/banking/accounts/${accountId}/statements`, { body: { fileName: f.name, csv } });
      setMsg(t("banking.import.done", { added: r.added, duplicates: r.duplicates, matched: r.matched }));
      setChecks(statementNotes(r, t));
      router.refresh();
    } catch (err) { setError(errorText(t, err, BANK_NS)); } finally { setBusy(false); }
  }
  return (
    <Card className="flex flex-col gap-3">
      <h2 className="font-semibold">{t("banking.import.title")}</h2>
      <p className="text-sm text-muted">{t("banking.import.hint")}</p>
      <label className={`inline-flex h-10 w-fit cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover ${busy ? "pointer-events-none opacity-60" : ""}`}>
        <Upload className="size-4" aria-hidden />{t("banking.import.file")}
        <input type="file" accept=".csv,text/csv,.xlsx" className="sr-only" onChange={upload} />
      </label>
      {msg ? <p className="text-sm text-success">{msg}</p> : null}
      {checks.map((c, i) => <p key={i} className={`text-sm ${c.tone === "ok" ? "text-success" : c.tone === "bad" ? "text-danger" : "text-muted"}`}>{c.text}</p>)}
      {error ? <Alert>{error}</Alert> : null}
    </Card>
  );
}

export function FeedPanel({ accountId, status, fetchedTo, canEdit }: { accountId: string; status: string | null; fetchedTo: string | null; canEdit: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const call = async (what: "connect" | "fetch" | "disconnect") => {
    setError(null);
    setMsg(null);
    try {
      const r = await api<{ added?: number; matched?: number }>(`/banking/accounts/${accountId}/feed/${what}`, { body: {} });
      if (what === "fetch") setMsg(t("banking.feed.done", { added: r.added ?? 0, matched: r.matched ?? 0 }));
      router.refresh();
    } catch (err) { setError(errorText(t, err, BANK_NS)); }
  };
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">{t("banking.feed.title")}</h2>
        {status ? <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status === "active" ? "bg-primary-soft text-primary" : "bg-surface-2 text-muted"}`}>{t(`banking.feed.statuses.${status}`)}</span> : null}
      </div>
      <p className="text-sm text-muted">{t("banking.feed.hint")}</p>
      {fetchedTo ? <p className="text-sm">{t("banking.feed.fetched", { date: format.dateTime(new Date(`${fetchedTo}T00:00:00`), { dateStyle: "medium" }) })}</p> : null}
      {canEdit ? (
        <div className="flex flex-wrap gap-2">
          {status === "active" ? (
            <>
              <Button onClick={() => call("fetch")}>{t("banking.feed.fetch")}</Button>
              <Button variant="ghost" onClick={() => call("disconnect")}>{t("banking.feed.disconnect")}</Button>
            </>
          ) : <Button variant="outline" onClick={() => call("connect")}>{t("banking.feed.connect")}</Button>}
        </div>
      ) : null}
      {msg ? <p className="text-sm text-success">{msg}</p> : null}
      {error ? <Alert>{error}</Alert> : null}
    </Card>
  );
}

function Amount({ l }: { l: Pick<BankLine, "debit" | "credit"> }) {
  return Number(l.credit) > 0 ? <span className="num text-success">+{rupees(l.credit)}</span> : <span className="num">−{rupees(l.debit)}</span>;
}

/** Statement lines with what to do for each: accept the suggested entry, post one, find one by hand, or ignore. */
export function LinesTable({ accountId, lines, ledgers, tab, canEdit }: { accountId: string; lines: BankLine[]; ledgers: Ledger[]; tab: string; canEdit: boolean }) {
  const t = useTranslations();
  const locale = useLocale();
  const format = useFormatter();
  const router = useRouter();
  const [open, setOpen] = useState<{ id: string; mode: "create" | "find" } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  const act = async (path: string, body: unknown = {}) => {
    setError(null);
    try { await api(path, { body }); setOpen(null); router.refresh(); } catch (err) { setError(errorText(t, err, BANK_NS)); }
  };
  const anyRule = lines.some((l) => l.rule);
  return (
    <div className="flex flex-col gap-3">
      {tab === "open" && anyRule && canEdit ? (
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={async () => {
            setError(null);
            try { const r = await api<{ posted: number }>(`/banking/accounts/${accountId}/apply-rules`, { body: {} }); setMsg(t("banking.lines.rulesDone", { count: r.posted })); router.refresh(); } catch (err) { setError(errorText(t, err, BANK_NS)); }
          }}>{t("banking.lines.applyRules")}</Button>
          {msg ? <span className="text-sm text-success">{msg}</span> : null}
        </div>
      ) : null}
      {error ? <Alert>{error}</Alert> : null}
      <Card className="p-0">
        <ul className="divide-y divide-border">
          {lines.map((l) => (
            <li key={l.id} className="flex flex-col gap-2 px-5 py-3 text-sm">
              <div className="flex flex-wrap items-start gap-x-4 gap-y-1">
                <span className="w-24 shrink-0 text-muted">{day(l.date)}</span>
                <span className="min-w-0 flex-1 break-words">{l.description}{l.reference ? <span className="ml-2 font-mono text-xs text-muted">{l.reference}</span> : null}</span>
                <span className="w-32 text-right"><Amount l={l} /></span>
              </div>
              {tab === "open" ? (
                <div className="flex flex-wrap items-center gap-2 pl-0 sm:pl-28">
                  {l.suggestion ? (
                    <span className="flex flex-wrap items-center gap-2 rounded-lg bg-primary-soft px-2.5 py-1">
                      <span className="text-muted">{t("banking.lines.suggestion")}</span>
                      <span className="font-mono">{l.suggestion.number}</span>
                      <span>{day(l.suggestion.date)}</span>
                      {l.suggestion.party ? <span>{l.suggestion.party}</span> : null}
                      <span className="text-xs text-muted">({l.suggestion.reasons.map((r) => t(`banking.lines.reasons.${r}`)).join(", ")})</span>
                      {canEdit ? <Button className="h-7 px-2 text-xs" onClick={() => act(`/banking/lines/${l.id}/match`, { voucherIds: [l.suggestion!.id] })}><Check className="size-3.5" aria-hidden />{t("banking.lines.accept")}</Button> : null}
                    </span>
                  ) : null}
                  {l.rule ? <span className="rounded-lg bg-accent-soft px-2.5 py-1 text-accent">{t("banking.lines.rule", { account: l.rule.account })}</span> : null}
                  {canEdit ? (
                    <>
                      <Button variant="ghost" className="h-7 px-2 text-xs" onClick={() => setOpen({ id: l.id, mode: "create" })}>{t("banking.lines.create")}</Button>
                      <Button variant="ghost" className="h-7 px-2 text-xs" onClick={() => setOpen({ id: l.id, mode: "find" })}><Search className="size-3.5" aria-hidden />{t("banking.lines.byHand")}</Button>
                      <Button variant="ghost" className="h-7 px-2 text-xs text-muted" onClick={() => act(`/banking/lines/${l.id}/ignore`)}><EyeOff className="size-3.5" aria-hidden />{t("banking.lines.ignore")}</Button>
                    </>
                  ) : null}
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2 pl-0 sm:pl-28">
                  {l.vouchers.map((v) => <a key={v.id} href={`/accounts/vouchers/${v.id}`} className="font-mono text-primary hover:underline">{v.number}</a>)}
                  {canEdit ? <Button variant="ghost" className="h-7 px-2 text-xs" onClick={() => act(`/banking/lines/${l.id}/unmatch`)}><Undo2 className="size-3.5" aria-hidden />{tab === "ignored" ? t("banking.lines.restore") : t("banking.lines.unmatch")}</Button> : null}
                </div>
              )}
              {open?.id === l.id && open.mode === "create" ? <CreateEntry line={l} ledgers={ledgers.filter((x) => x.id !== accountId)} locale={locale} onDone={() => { setOpen(null); router.refresh(); }} /> : null}
              {open?.id === l.id && open.mode === "find" ? <FindEntries accountId={accountId} line={l} onDone={() => { setOpen(null); router.refresh(); }} /> : null}
            </li>
          ))}
          {!lines.length ? <li className="px-5 py-10 text-center text-muted">{t("banking.lines.none")}</li> : null}
        </ul>
      </Card>
    </div>
  );
}

function CreateEntry({ line, ledgers, locale, onDone }: { line: BankLine; ledgers: Ledger[]; locale: string; onDone: () => void }) {
  const t = useTranslations();
  const [accountId, setAccountId] = useState(line.rule?.accountId ?? "");
  const [narration, setNarration] = useState(line.description.slice(0, 200));
  const [error, setError] = useState<string | null>(null);
  return (
    <form className="grid gap-3 rounded-lg border border-border p-3 sm:ml-28 md:grid-cols-[1fr_1fr_auto]" onSubmit={async (e) => {
      e.preventDefault();
      setError(null);
      try { await api(`/banking/lines/${line.id}/create`, { body: { accountId, narration } }); onDone(); } catch (err) { setError(errorText(t, err, BANK_NS)); }
    }}>
      <Field label={t("banking.lines.account")} htmlFor={`ce-a-${line.id}`}>
        <Select id={`ce-a-${line.id}`} value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
          <option value="">-</option>
          {ledgers.map((a) => <option key={a.id} value={a.id}>{localName(a, locale)}</option>)}
        </Select>
      </Field>
      <Field label={t("banking.lines.narration")} htmlFor={`ce-n-${line.id}`}><Input id={`ce-n-${line.id}`} value={narration} onChange={(e) => setNarration(e.target.value)} maxLength={200} /></Field>
      <div className="flex items-end"><Button type="submit" disabled={!accountId}>{t("banking.lines.create")}</Button></div>
      {error ? <div className="md:col-span-3"><Alert>{error}</Alert></div> : null}
    </form>
  );
}

const shift = (d: string, n: number) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

function FindEntries({ accountId, line, onDone }: { accountId: string; line: BankLine; onDone: () => void }) {
  const t = useTranslations();
  const format = useFormatter();
  const inflow = Number(line.credit) > 0;
  const amount = inflow ? line.credit : line.debit;
  const [from, to] = [shift(line.date, -60), shift(line.date, 15)];
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    api<Entry[]>(`/banking/accounts/${accountId}/open-entries?from=${from}&to=${to}`)
      .then((r) => setEntries(r.filter((e) => e.direction === (inflow ? "in" : "out"))))
      .catch((err) => { setEntries([]); setError(errorText(t, err, BANK_NS)); });
  }, [accountId, from, to, inflow]); // eslint-disable-line react-hooks/exhaustive-deps
  if (entries === null) return null;
  const total = entries.filter((e) => picked.includes(e.id)).reduce((s, e) => s + Number(e.amount), 0);
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:ml-28">
      <p className="text-xs text-muted">{t("banking.lines.entries", { from: day(from), to: day(to) })}</p>
      <ul className="max-h-64 overflow-y-auto">
        {entries.map((e) => (
          <li key={e.id}>
            <label className="flex items-center gap-3 py-1">
              <input type="checkbox" checked={picked.includes(e.id)} onChange={(x) => setPicked(x.target.checked ? [...picked, e.id] : picked.filter((p) => p !== e.id))} className="size-4 accent-[var(--primary)]" />
              <span className="w-24 text-muted">{day(e.date)}</span><span className="font-mono">{e.number}</span><span className="flex-1 truncate">{e.party}</span><span className="num">{rupees(e.amount)}</span>
            </label>
          </li>
        ))}
        {!entries.length ? <li className="py-2 text-muted">{t("banking.lines.none")}</li> : null}
      </ul>
      <div className="flex items-center gap-3">
        <span className={`text-sm ${total.toFixed(2) === Number(amount).toFixed(2) ? "text-success" : "text-muted"}`}>{t("banking.lines.selectedTotal", { total: rupees(total), amount: rupees(amount) })}</span>
        <Button disabled={!picked.length} onClick={async () => {
          setError(null);
          try { await api(`/banking/lines/${line.id}/match`, { body: { voucherIds: picked } }); onDone(); } catch (err) { setError(errorText(t, err, BANK_NS)); }
        }}>{t("banking.lines.matchSelected")}</Button>
      </div>
      {error ? <Alert>{error}</Alert> : null}
    </div>
  );
}

export function BankProfileForm({ accountId, profile, canEdit }: { accountId: string; profile: { bankName: string | null; accountLast4: string | null; ifsc: string | null } | null; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  return (
    <Card>
      <form className="grid gap-3 md:grid-cols-4" onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const s = (k: string) => String(f.get(k) ?? "").trim() || null;
        setError(null);
        try { await api(`/banking/accounts/${accountId}/profile`, { method: "PUT", body: { bankName: s("bankName"), accountLast4: s("last4"), ifsc: s("ifsc") } }); setSaved(true); router.refresh(); } catch (err) { setError(errorText(t, err, BANK_NS)); }
      }}>
        <Field label={t("banking.profile.bankName")} htmlFor="bp-name"><Input id="bp-name" name="bankName" defaultValue={profile?.bankName ?? ""} maxLength={80} disabled={!canEdit} /></Field>
        <Field label={t("banking.profile.last4")} htmlFor="bp-l4"><Input id="bp-l4" name="last4" defaultValue={profile?.accountLast4 ?? ""} inputMode="numeric" pattern="\d{4}" maxLength={4} className="num" disabled={!canEdit} /></Field>
        <Field label={t("banking.profile.ifsc")} htmlFor="bp-ifsc"><Input id="bp-ifsc" name="ifsc" defaultValue={profile?.ifsc ?? ""} maxLength={11} className="font-mono uppercase" disabled={!canEdit} /></Field>
        {canEdit ? <div className="flex items-end gap-3"><Button type="submit" variant="outline">{t("banking.profile.save")}</Button>{saved ? <span className="text-sm text-success">{t("common.saved")}</span> : null}</div> : null}
        {error ? <div className="md:col-span-4"><Alert>{error}</Alert></div> : null}
      </form>
    </Card>
  );
}
