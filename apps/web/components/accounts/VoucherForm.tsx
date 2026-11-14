"use client";

import clsx from "clsx";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { dec, formatIndian, sum, validateVoucher, type VoucherType } from "@varchasv/domain";
import { ApiError, api } from "@/lib/client-api";
import { localName, todayIso } from "@/lib/format";
import { Alert, Button, Card, Field, Input, Select } from "../ui";
import { useWorkDate } from "@/components/WorkingDate";
import { useWorkspaceDirty } from "@/lib/workspace-dirty";

export interface AccountOption { id: string; name: string; nameHi: string | null; groupName: string; groupNameHi: string | null; cashOrBank: boolean; balance: string }
interface Line { key: number; accountId: string; debit: string; credit: string }

const TYPES: VoucherType[] = ["payment", "receipt", "contra", "journal"];
const AMOUNT = /^\d+(\.\d{1,2})?$/;
let nextKey = 1;
const blank = (): Line => ({ key: nextKey++, accountId: "", debit: "", credit: "" });

export function VoucherForm({ accounts, initialType }: { accounts: AccountOption[]; initialType: VoucherType }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [type, setType] = useState<VoucherType>(initialType);
  const workDate = useWorkDate();
  const [date, setDate] = useState(workDate);
  const [narration, setNarration] = useState("");
  const [reference, setReference] = useState("");
  const [lines, setLines] = useState<Line[]>([blank(), blank()]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // Generated once per form, so a double-click or a retry never posts the voucher twice.
  const [clientId] = useState(() => crypto.randomUUID());

  const byId = useMemo(() => new Map(accounts.map((a) => [a.id, a])), [accounts]);
  const sorted = useMemo(() => [...accounts].sort((a, b) => localName(a, locale).localeCompare(localName(b, locale))), [accounts, locale]);
  const amount = (v: string) => (AMOUNT.test(v) ? v : "0");
  const totalDr = sum(lines.map((l) => amount(l.debit)));
  const totalCr = sum(lines.map((l) => amount(l.credit)));
  const difference = totalDr.minus(totalCr);

  const filled = lines.filter((l) => l.accountId && (dec(amount(l.debit)).gt(0) || dec(amount(l.credit)).gt(0)));
  // A voucher with anything typed in it is unsaved work: the workspace tab shows a dot and asks before closing.
  useWorkspaceDirty(filled.length > 0 || narration.trim() !== "" || reference.trim() !== "");
  const problems = validateVoucher(type, filled.map((l) => ({
    accountId: l.accountId, debit: amount(l.debit), credit: amount(l.credit), cashOrBank: byId.get(l.accountId)?.cashOrBank ?? false,
  })));
  // Tally-style warning (not a block): cash or bank that would go negative after this voucher.
  const negatives = [...new Set(filled.map((l) => l.accountId))]
    .map((id) => byId.get(id)!)
    .filter((a) => a.cashOrBank)
    .map((a) => {
      const after = filled.filter((l) => l.accountId === a.id).reduce((b, l) => b.plus(amount(l.debit)).minus(amount(l.credit)), dec(a.balance));
      return { a, after };
    })
    .filter((x) => x.after.isNegative());
  const errorText = (code: string) => (t.has(`vouchers.errors.${code}`) ? t(`vouchers.errors.${code}`) : t("auth.errors.generic"));

  const update = (key: number, patch: Partial<Line>) => setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)));

  /** Typing on one side clears the other, and the next empty line is pre-filled with the balancing amount. */
  function setAmount(key: number, side: "debit" | "credit", value: string) {
    update(key, side === "debit" ? { debit: value, credit: "" } : { credit: value, debit: "" });
  }
  function addLine() {
    const diff = difference;
    const line = blank();
    if (!diff.isZero()) {
      if (diff.gt(0)) line.credit = diff.toFixed(2);
      else line.debit = diff.neg().toFixed(2);
    }
    setLines((ls) => [...ls, line]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (problems.length) {
      setError(errorText(problems[0]!.code));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const v = await api<{ id: string }>("/vouchers", {
        body: {
          type, date, clientId, narration: narration || undefined, reference: reference || undefined,
          lines: filled.map((l) => ({ accountId: l.accountId, debit: AMOUNT.test(l.debit) ? l.debit : undefined, credit: AMOUNT.test(l.credit) ? l.credit : undefined })),
        },
      });
      router.push(`/accounts/vouchers/${v.id}`);
      router.refresh();
    } catch (err) {
      setError(errorText(err instanceof ApiError ? err.code : "generic"));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} data-density="compact" className="flex flex-col gap-3 lg:min-h-0 lg:flex-1">
      <div role="tablist" aria-label="Voucher type" className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {TYPES.map((x) => (
          <button key={x} type="button" role="tab" aria-selected={type === x} onClick={() => setType(x)}
            className={clsx("surface-raised rounded-xl border px-4 py-2.5 text-left transition-colors", type === x ? "border-primary/50 bg-primary-soft" : "border-border bg-surface hover:bg-surface-2")}>
            <span className={clsx("block text-sm font-semibold", type === x && "text-primary")}>{t(`vouchers.types.${x}`)}</span>
            <span className="block text-xs text-muted">{t(`vouchers.typeHints.${x}`)}</span>
          </button>
        ))}
      </div>

      <Card className="p-3 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
        <div className="grid gap-4 md:grid-cols-[180px_1fr_200px]">
          <Field label={t("common.date")} htmlFor="v-date"><Input id="v-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
          <Field label={t("common.narration")} htmlFor="v-narr"><Input id="v-narr" value={narration} onChange={(e) => setNarration(e.target.value)} maxLength={500} /></Field>
          <Field label={t("vouchers.reference")} htmlFor="v-ref"><Input id="v-ref" value={reference} onChange={(e) => setReference(e.target.value)} maxLength={60} /></Field>
        </div>

        <div className="mt-5 grid gap-2 rounded-xl bg-surface-2/70 p-3 sm:grid-cols-3">
          <div><p className="text-xs font-medium text-muted">{t("common.debit")}</p><p className="num mt-0.5 text-lg font-semibold">₹ {formatIndian(totalDr)}</p></div>
          <div><p className="text-xs font-medium text-muted">{t("common.credit")}</p><p className="num mt-0.5 text-lg font-semibold">₹ {formatIndian(totalCr)}</p></div>
          <div><p className="text-xs font-medium text-muted">{difference.isZero() ? "Balanced" : t("vouchers.difference")}</p><p className={clsx("num mt-0.5 text-lg font-semibold", !difference.isZero() && "text-danger")}>₹ {formatIndian(difference.abs())}</p></div>
        </div>

        <div className="relative mt-2 min-h-0 overflow-auto lg:flex-1">
          <table className="w-full min-w-[680px] text-sm">
            <thead className="sticky top-0 z-10 bg-surface text-left text-muted">
              <tr className="sticky top-0 border-b border-border bg-surface-2/90">
                <th className="py-1 pr-3 font-medium">{t("vouchers.account")}</th>
                <th className="w-44 py-1 pr-3 text-right font-medium">{t("common.debit")}</th>
                <th className="w-44 py-1 pr-3 text-right font-medium">{t("common.credit")}</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={l.key} className="border-b border-border">
                  <td className="py-1 pr-3">
                    <Select value={l.accountId} onChange={(e) => update(l.key, { accountId: e.target.value })} aria-label={`${t("vouchers.account")} ${i + 1}`}>
                      <option value="">{t("vouchers.chooseAccount")}</option>
                      {sorted.map((a) => <option key={a.id} value={a.id}>{localName(a, locale)} - {localName({ name: a.groupName, nameHi: a.groupNameHi }, locale)}</option>)}
                    </Select>
                  </td>
                  <td className="py-1 pr-3">
                    <Input value={l.debit} onChange={(e) => setAmount(l.key, "debit", e.target.value)} inputMode="decimal" className="num text-right" aria-label={`${t("common.debit")} ${i + 1}`} aria-invalid={!!l.debit && !AMOUNT.test(l.debit)} />
                  </td>
                  <td className="py-1 pr-3">
                    <Input value={l.credit} onChange={(e) => setAmount(l.key, "credit", e.target.value)} inputMode="decimal" className="num text-right" aria-label={`${t("common.credit")} ${i + 1}`} aria-invalid={!!l.credit && !AMOUNT.test(l.credit)} />
                  </td>
                  <td className="py-2 text-right">
                    {lines.length > 2 ? (
                      <button type="button" onClick={() => setLines((ls) => ls.filter((x) => x.key !== l.key))} className="rounded-md p-2 text-muted hover:bg-surface-2 hover:text-danger" title={t("common.remove")}>
                        <Trash2 className="size-4" aria-hidden /><span className="sr-only">{t("common.remove")}</span>
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold">
                <td className="py-3 pr-3">
                  <Button type="button" variant="ghost" onClick={addLine} className="-ml-3"><Plus className="size-4" aria-hidden />{t("vouchers.addLine")}</Button>
                </td>
                <td className="num py-3 pr-3 text-right">₹ {formatIndian(totalDr)}</td>
                <td className="num py-3 pr-3 text-right">₹ {formatIndian(totalCr)}</td>
                <td />
              </tr>
              {!difference.isZero() ? (
                <tr><td colSpan={4} className="pb-2 text-right text-sm text-danger">{t("vouchers.difference")}: ₹ {formatIndian(difference.abs())}</td></tr>
              ) : null}
            </tfoot>
          </table>
        </div>
      </Card>

      {negatives.map(({ a, after }) => (
        <p key={a.id} role="status" className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-text">
          ⚠ {t("vouchers.negativeWarning", { account: localName(a, locale), amount: `−₹ ${formatIndian(after.abs())}` })}
        </p>
      ))}
      {error ? <Alert>{error}</Alert> : null}
      <div className="sticky bottom-2 z-10 -mx-1 flex flex-wrap gap-3 rounded-xl border border-border bg-surface/95 p-2 shadow-overlay backdrop-blur-xl print:hidden">
        <Button type="submit" disabled={busy || filled.length < 2}>{t("vouchers.post")}</Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>{t("common.cancel")}</Button>
      </div>
    </form>
  );
}
