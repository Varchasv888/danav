"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { GST_RATES, GST_STATES } from "@varchasv/domain";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { rupees } from "@/lib/format";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export interface Amendment {
  id: string; kind: "b2b" | "cdn" | "b2cs"; ctin: string | null; originalNumber: string | null; originalDate: string | null; originalPeriod: string | null;
  number: string | null; docDate: string | null; noteType: string | null; pos: string; intra: boolean; value: string; reason: string;
  lines: { rate: string; taxable: string; igst: string; cgst: string; sgst: string; cess: string }[];
}

/**
 * Corrections to supplies reported in an earlier GSTR-1. Each is reported in this period's return, in the B2BA, CDNRA or
 * B2CSA table, against the original it replaces. The tax is worked from the rate so the heads cannot disagree with it.
 */
export function Amendments({ period, rows, canEdit, locked }: { period: string; rows: Amendment[]; canEdit: boolean; locked: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<"b2b" | "cdn" | "b2cs">("b2b");
  const [intra, setIntra] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => String(f.get(k) ?? "").trim();
    const taxable = Number(s("taxable")) || 0, rate = Number(s("rate"));
    const tax = Math.round(taxable * rate) / 100;
    const half = Math.round(tax * 50) / 100;
    setBusy(true); setError(null);
    try {
      await api("/gst/amendments", { body: {
        kind, period, reason: s("reason"), pos: s("pos"), intra,
        ...(kind !== "b2cs" ? { ctin: s("ctin"), originalNumber: s("originalNumber"), originalDate: s("originalDate"), number: s("number"), docDate: s("docDate") } : { originalPeriod: s("originalPeriod") }),
        ...(kind === "cdn" ? { noteType: s("noteType") || "C" } : {}),
        lines: [{ rate: String(rate), taxable: taxable.toFixed(2), igst: intra ? "0" : tax.toFixed(2), cgst: intra ? half.toFixed(2) : "0", sgst: intra ? half.toFixed(2) : "0", cess: "0" }],
      } });
      setOpen(false); router.refresh();
    } catch (err) { setError(errorText(t, err, ["gstamend.errors"])); } finally { setBusy(false); }
  }
  async function remove(id: string) {
    setBusy(true); setError(null);
    try { await api(`/gst/amendments/${id}`, { method: "DELETE" }); router.refresh(); } catch (err) { setError(errorText(t, err, ["gstamend.errors"])); } finally { setBusy(false); }
  }

  return (
    <Card id="amendments" className="scroll-mt-32 overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <h2 className="font-semibold">{t("gstamend.title")}</h2>
          <p className="mt-0.5 text-sm text-muted">{t("gstamend.help")}</p>
        </div>
        {canEdit && !locked ? <Button variant="outline" onClick={() => setOpen((v) => !v)}>{open ? t("common.cancel") : t("gstamend.add")}</Button> : null}
      </div>
      {error ? <div className="px-4 pt-3"><Alert>{error}</Alert></div> : null}
      {open ? (
        <form onSubmit={add} className="grid gap-3 border-b border-border bg-surface-3 px-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label={t("gstamend.kind")} htmlFor="am-kind">
            <Select id="am-kind" value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
              <option value="b2b">{t("gstamend.kinds.b2b")}</option><option value="cdn">{t("gstamend.kinds.cdn")}</option><option value="b2cs">{t("gstamend.kinds.b2cs")}</option>
            </Select>
          </Field>
          {kind !== "b2cs" ? (
            <>
              <Field label={t("auth.gstin")} htmlFor="am-ctin"><Input id="am-ctin" name="ctin" maxLength={15} required className="uppercase" /></Field>
              {kind === "cdn" ? <Field label={t("gstamend.noteType")} htmlFor="am-nt"><Select id="am-nt" name="noteType"><option value="C">{t("gstamend.credit")}</option><option value="D">{t("gstamend.debit")}</option></Select></Field> : null}
              <Field label={t("gstamend.originalNumber")} htmlFor="am-on"><Input id="am-on" name="originalNumber" required /></Field>
              <Field label={t("gstamend.originalDate")} htmlFor="am-od"><Input id="am-od" name="originalDate" type="date" required /></Field>
              <Field label={t("gstamend.number")} htmlFor="am-n"><Input id="am-n" name="number" required /></Field>
              <Field label={t("gstamend.date")} htmlFor="am-d"><Input id="am-d" name="docDate" type="date" required /></Field>
            </>
          ) : (
            <Field label={t("gstamend.originalPeriod")} htmlFor="am-op" hint={t("gstamend.originalPeriodHint")}><Input id="am-op" name="originalPeriod" placeholder="082026" maxLength={6} inputMode="numeric" required /></Field>
          )}
          <Field label={t("gstmanual.pos")} htmlFor="am-pos">
            <Select id="am-pos" name="pos" defaultValue="18">{GST_STATES.map((s) => <option key={s.code} value={s.code}>{s.code} {s.name}</option>)}</Select>
          </Field>
          <Field label={t("gstamend.supply")} htmlFor="am-sup">
            <Select id="am-sup" value={intra ? "intra" : "inter"} onChange={(e) => setIntra(e.target.value === "intra")}><option value="intra">{t("gstamend.intra")}</option><option value="inter">{t("gstamend.inter")}</option></Select>
          </Field>
          <Field label={t("gstamend.rate")} htmlFor="am-rate">
            <Select id="am-rate" name="rate" defaultValue="5">{GST_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}</Select>
          </Field>
          <Field label={t("gstamend.taxable")} htmlFor="am-tx" hint={t("gstamend.taxableHint")}><Input id="am-tx" name="taxable" inputMode="decimal" required className="num" /></Field>
          <div className="sm:col-span-2"><Field label={t("gstamend.reason")} htmlFor="am-why"><Input id="am-why" name="reason" required minLength={3} maxLength={200} /></Field></div>
          <div className="flex items-end"><Button type="submit" disabled={busy}>{t("common.save")}</Button></div>
        </form>
      ) : null}
      {rows.length ? (
        <ul className="divide-y divide-border text-sm">
          {rows.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5">
              <span className="w-24 shrink-0 font-medium">{t(`gstamend.kinds.${a.kind}`)}</span>
              <span className="min-w-0 flex-1">
                {a.kind === "b2cs" ? `${t("gstamend.originalPeriod")} ${a.originalPeriod}` : `${a.ctin}  ${a.originalNumber} → ${a.number}`}
                <span className="block text-muted">{a.reason}</span>
              </span>
              <span className="num">{rupees(a.lines.reduce((s, l) => s + Number(l.taxable), 0))}</span>
              {canEdit && !locked ? (
                <button type="button" onClick={() => void remove(a.id)} disabled={busy} aria-label={t("common.remove")} className="grid size-8 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-danger focus-visible:outline-2 focus-visible:outline-primary">
                  <Trash2 className="size-4" aria-hidden />
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : <p className="px-4 py-4 text-sm text-muted">{t("gstamend.none")}</p>}
    </Card>
  );
}
