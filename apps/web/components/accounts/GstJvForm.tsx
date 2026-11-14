"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { GST_HEADS, GST_JV_KINDS, SETOFF_ALLOWED, type GstHead, type GstJvKind } from "@varchasv/domain";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { todayIso } from "@/lib/format";
import { Alert, Button, Field, Input, Select } from "../ui";
import { useWorkDate } from "@/components/WorkingDate";

interface Pair { liability: GstHead; credit: GstHead; amount: string }
const AMOUNT = /^\d*\.?\d{0,2}$/;
const blankPair = (): Pair => ({ liability: "igst", credit: "igst", amount: "" });

/** A journal voucher that moves only GST: pay tax out of credit, reverse or claim credit, raise or cut liability. */
export function GstJvForm({ accounts }: { accounts: { id: string; name: string }[] }) {
  const t = useTranslations();
  const router = useRouter();
  const [kind, setKind] = useState<GstJvKind>("setoff");
  const workDate = useWorkDate();
  const [date, setDate] = useState(workDate);
  const [pairs, setPairs] = useState<Pair[]>([blankPair()]);
  const [amounts, setAmounts] = useState<Record<GstHead, string>>({ cgst: "", sgst: "", igst: "", cess: "" });
  const [counter, setCounter] = useState("");
  const [narration, setNarration] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // New per entry, so a double-click or a retry never posts it twice.
  const [clientId, setClientId] = useState(() => crypto.randomUUID());

  const setPair = (i: number, patch: Partial<Pair>) => setPairs((ps) => ps.map((p, j) => {
    if (j !== i) return p;
    const next = { ...p, ...patch };
    // Changing the liability may leave a credit that cannot pay it; fall back to the same head.
    if (!SETOFF_ALLOWED[next.credit].includes(next.liability)) next.credit = next.liability;
    return next;
  }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const body = kind === "setoff"
        ? { kind, date, pairs: pairs.filter((p) => Number(p.amount) > 0), narration: narration || undefined, clientId }
        : { kind, date, amounts: Object.fromEntries(GST_HEADS.filter((h) => Number(amounts[h]) > 0).map((h) => [h, amounts[h]])), counterAccountId: counter || undefined, narration: narration || undefined, clientId };
      const v = await api<{ number: string }>("/gst-jv", { method: "POST", body });
      setDone(v.number);
      setPairs([blankPair()]);
      setAmounts({ cgst: "", sgst: "", igst: "", cess: "" });
      setNarration("");
      setClientId(crypto.randomUUID());
      router.refresh();
    } catch (err) { setError(errorText(t, err, ["gstjv.errors", "vouchers.errors"])); } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} method="post" className="flex max-w-3xl flex-col gap-4 rounded-md border border-border bg-surface p-4">
      {error ? <Alert>{error}</Alert> : null}
      {done ? <div role="status" className="rounded-md border border-success/30 bg-success-soft px-3 py-2 text-[0.9286rem] text-success">{t("gstjv.posted", { number: done })}</div> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t("gstjv.kind")} htmlFor="gj-kind">
          <Select id="gj-kind" value={kind} onChange={(e) => { setKind(e.target.value as GstJvKind); setDone(null); }}>
            {GST_JV_KINDS.map((k) => <option key={k} value={k}>{t(`gstjv.kinds.${k}`)}</option>)}
          </Select>
        </Field>
        <Field label={t("common.date")} htmlFor="gj-date"><Input id="gj-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
      </div>
      <p className="text-xs text-muted">{t(`gstjv.help.${kind}`)}</p>

      {kind === "setoff" ? (
        <div className="flex flex-col gap-2">
          {pairs.map((p, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_8rem_2rem] items-end gap-2">
              <Field label={t("gstjv.pay")} htmlFor={`gj-l${i}`}>
                <Select id={`gj-l${i}`} value={p.liability} onChange={(e) => setPair(i, { liability: e.target.value as GstHead })}>
                  {GST_HEADS.map((h) => <option key={h} value={h}>{t(`gstjv.head.${h}`)}</option>)}
                </Select>
              </Field>
              <Field label={t("gstjv.using")} htmlFor={`gj-c${i}`}>
                <Select id={`gj-c${i}`} value={p.credit} onChange={(e) => setPair(i, { credit: e.target.value as GstHead })}>
                  {GST_HEADS.filter((h) => SETOFF_ALLOWED[h].includes(p.liability)).map((h) => <option key={h} value={h}>{t(`gstjv.head.${h}`)}</option>)}
                </Select>
              </Field>
              <Field label={t("gstjv.amount")} htmlFor={`gj-a${i}`}>
                <Input id={`gj-a${i}`} inputMode="decimal" value={p.amount} onChange={(e) => AMOUNT.test(e.target.value) && setPair(i, { amount: e.target.value })} className="num text-right" />
              </Field>
              <button type="button" aria-label={t("gstjv.removeRow")} disabled={pairs.length === 1} onClick={() => setPairs((ps) => ps.filter((_, j) => j !== i))} className="mb-1 inline-flex size-8 items-center justify-center rounded-md text-muted hover:bg-surface-2 disabled:opacity-40"><Trash2 className="size-4" aria-hidden /></button>
            </div>
          ))}
          <div><Button type="button" variant="outline" onClick={() => setPairs((ps) => [...ps, blankPair()])}><Plus className="size-4" aria-hidden />{t("gstjv.addRow")}</Button></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {GST_HEADS.map((h) => (
              <Field key={h} label={t(`gstjv.head.${h}`)} htmlFor={`gj-${h}`}>
                <Input id={`gj-${h}`} inputMode="decimal" value={amounts[h]} onChange={(e) => AMOUNT.test(e.target.value) && setAmounts((a) => ({ ...a, [h]: e.target.value }))} className="num text-right" />
              </Field>
            ))}
          </div>
          <Field label={t("gstjv.counter")} htmlFor="gj-counter">
            <Select id="gj-counter" value={counter} onChange={(e) => setCounter(e.target.value)} required>
              <option value="">{t("gstjv.chooseCounter")}</option>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </Select>
          </Field>
        </>
      )}

      <Field label={t("common.narration")} htmlFor="gj-narr"><Input id="gj-narr" value={narration} onChange={(e) => setNarration(e.target.value)} maxLength={300} /></Field>
      <div><Button type="submit" disabled={busy}>{busy ? t("common.saving") : t("gstjv.post")}</Button></div>
    </form>
  );
}
