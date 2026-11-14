"use client";

import { Plus, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { localName } from "@/lib/format";
import { Alert, Button, Card, Field, Input, Select } from "../ui";
import { BANK_NS, type Ledger } from "./Reconcile";

export interface Rule { id: string; contains: string; direction: "in" | "out" | "any"; accountId: string; account: string; narration: string | null; priority: number; archived: boolean }

export function RulesEditor({ rules, ledgers, canEdit }: { rules: Rule[]; ledgers: Ledger[]; canEdit: boolean }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [rows, setRows] = useState<(Omit<Rule, "id" | "account"> & { id?: string })[]>(rules);
  const [error, setError] = useState<string | null>(null);
  const set = (i: number, patch: Partial<(typeof rows)[number]>) => setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const save = async (i: number) => {
    const { id, ...body } = rows[i]!;
    setError(null);
    try { await api(id ? `/banking/rules/${id}` : "/banking/rules", { method: id ? "PUT" : "POST", body }); router.refresh(); } catch (err) { setError(errorText(t, err, BANK_NS)); }
  };
  return (
    <Card className="flex flex-col gap-3">
      {rows.map((r, i) => (
        <div key={r.id ?? `new-${i}`} className="grid items-end gap-3 md:grid-cols-[1.2fr_120px_1.2fr_1fr_90px_auto_auto]">
          <Field label={t("banking.rules.contains")} htmlFor={`br-c-${i}`}><Input id={`br-c-${i}`} value={r.contains} onChange={(e) => set(i, { contains: e.target.value })} maxLength={80} disabled={!canEdit} /></Field>
          <Field label={t("banking.rules.direction")} htmlFor={`br-d-${i}`}>
            <Select id={`br-d-${i}`} value={r.direction} onChange={(e) => set(i, { direction: e.target.value as Rule["direction"] })} disabled={!canEdit}>
              {(["out", "in", "any"] as const).map((d) => <option key={d} value={d}>{t(`banking.rules.directions.${d}`)}</option>)}
            </Select>
          </Field>
          <Field label={t("banking.rules.account")} htmlFor={`br-a-${i}`}>
            <Select id={`br-a-${i}`} value={r.accountId} onChange={(e) => set(i, { accountId: e.target.value })} disabled={!canEdit}>
              <option value="">-</option>
              {ledgers.map((a) => <option key={a.id} value={a.id}>{localName(a, locale)}</option>)}
            </Select>
          </Field>
          <Field label={t("banking.rules.narration")} htmlFor={`br-n-${i}`}><Input id={`br-n-${i}`} value={r.narration ?? ""} onChange={(e) => set(i, { narration: e.target.value || null })} maxLength={120} disabled={!canEdit} /></Field>
          <Field label={t("banking.rules.priority")} htmlFor={`br-p-${i}`}><Input id={`br-p-${i}`} value={String(r.priority)} onChange={(e) => set(i, { priority: Number(e.target.value.replace(/\D/g, "") || 0) })} inputMode="numeric" className="num" disabled={!canEdit} /></Field>
          <label className="flex items-center gap-2 pb-2 text-sm"><input type="checkbox" checked={r.archived} onChange={(e) => set(i, { archived: e.target.checked })} disabled={!canEdit || !r.id} className="size-4 accent-[var(--primary)]" />{t("common.archived")}</label>
          {canEdit ? <Button variant="outline" onClick={() => save(i)} disabled={r.contains.trim().length < 2 || !r.accountId}>{t("banking.rules.save")}</Button> : <span />}
        </div>
      ))}
      {canEdit ? <div><Button variant="ghost" className="-ml-3" onClick={() => setRows([...rows, { contains: "", direction: "out", accountId: "", narration: null, priority: 10, archived: false }])}><Plus className="size-4" aria-hidden />{t("banking.rules.add")}</Button></div> : null}
      {error ? <Alert>{error}</Alert> : null}
    </Card>
  );
}

export function SettlementImport({ banks, clearing }: { banks: Ledger[]; clearing: Ledger[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [provider, setProvider] = useState("Razorpay");
  const [bankAccountId, setBank] = useState(banks[0]?.id ?? "");
  const [clearingAccountId, setClearing] = useState(clearing[0]?.id ?? "");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setError(null);
    setMsg(null);
    try {
      const csv = await f.text();
      const r = await api<{ posted: unknown[]; skipped: number; matched: number }>("/banking/settlements", { body: { provider, csv, bankAccountId, clearingAccountId } });
      setMsg(t("banking.settlements.done", { posted: r.posted.length, skipped: r.skipped, matched: r.matched }));
      router.refresh();
    } catch (err) { setError(errorText(t, err, BANK_NS)); }
  }
  return (
    <Card className="grid gap-4 md:grid-cols-4">
      <Field label={t("banking.settlements.provider")} htmlFor="st-p">
        <Input id="st-p" value={provider} onChange={(e) => setProvider(e.target.value)} list="st-providers" maxLength={20} />
        <datalist id="st-providers">{["Razorpay", "PhonePe", "Paytm", "Cashfree", "PayU", "Pine Labs"].map((p) => <option key={p} value={p} />)}</datalist>
      </Field>
      <Field label={t("banking.settlements.bank")} htmlFor="st-b">
        <Select id="st-b" value={bankAccountId} onChange={(e) => setBank(e.target.value)}>{banks.map((a) => <option key={a.id} value={a.id}>{localName(a, locale)}</option>)}</Select>
      </Field>
      <Field label={t("banking.settlements.clearing")} htmlFor="st-c">
        <Select id="st-c" value={clearingAccountId} onChange={(e) => setClearing(e.target.value)}>{clearing.map((a) => <option key={a.id} value={a.id}>{localName(a, locale)}</option>)}</Select>
      </Field>
      <div className="flex items-end">
        <label className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover ${!bankAccountId || !clearingAccountId ? "pointer-events-none opacity-60" : ""}`}>
          <Upload className="size-4" aria-hidden />{t("banking.settlements.file")}
          <input type="file" accept=".csv,text/csv" className="sr-only" onChange={upload} />
        </label>
      </div>
      {msg ? <p className="text-sm text-success md:col-span-4">{msg}</p> : null}
      {error ? <div className="md:col-span-4"><Alert>{error}</Alert></div> : null}
    </Card>
  );
}
