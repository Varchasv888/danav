"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { rupees } from "@/lib/format";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

interface Row { itemId: string; name: string; old: string; new: string; aboveMrp: boolean }
interface Result { field: string; matched: number; changed: number; aboveMrp: number; applied: boolean; rows: Row[]; valuation?: { before: string; after: string; change: string } }
export interface RateRequest { id: string; status: string; summary: { field: string; changed: number; valuation: { change: string } }; input: { scope: Record<string, unknown>; mode: string; value: string }; decisionNote: string | null; createdAt: string }
const FIELDS = ["saleRate", "mrp", "purchaseRate"] as const;
const MODES = ["percent", "amount", "set"] as const;
const ROUNDS = ["none", "1", "5", "10", "ends9"] as const;

/** Pick who is affected and how the rate changes, look at the preview, then apply. */
export function RateUpdate({ brands, categories, seasons, styles, canApprove = false, requests = [] }: { brands: string[]; categories: string[]; seasons: string[]; styles: { id: string; label: string }[]; canApprove?: boolean; requests?: RateRequest[] }) {
  const t = useTranslations();
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [season, setSeason] = useState("");
  const [styleId, setStyleId] = useState("");
  const [all, setAll] = useState(false);
  const [field, setField] = useState<(typeof FIELDS)[number]>("saleRate");
  const [mode, setMode] = useState<(typeof MODES)[number]>("percent");
  const [value, setValue] = useState("");
  const [round, setRound] = useState<(typeof ROUNDS)[number]>("none");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const scope = { ...(brand ? { brand } : {}), ...(category ? { category } : {}), ...(season ? { season } : {}), ...(styleId ? { styleId } : {}), ...(all ? { all: true } : {}) };
  const ready = Object.keys(scope).length > 0 && /^-?\d+(\.\d{1,2})?$/.test(value);

  async function ask() {
    setBusy(true); setError(null); setNote(null);
    try { await api("/inventory/rate-update/request", { body: { scope, field, mode, value, round } }); setNote(t("rateUpdate.asked")); router.refresh(); } catch (err) { setError(errorText(t, err, ["rateUpdate.errors"])); } finally { setBusy(false); }
  }
  async function decide(id: string, decision: "approve" | "reject") {
    const why = decision === "reject" ? window.prompt(t("rateUpdate.rejectWhy")) : undefined;
    if (decision === "reject" && !why) return;
    setBusy(true); setError(null);
    try { await api(`/inventory/rate-update/requests/${id}/decide`, { body: { decision, ...(why ? { note: why } : {}) } }); router.refresh(); } catch (err) { setError(errorText(t, err, ["rateUpdate.errors"])); } finally { setBusy(false); }
  }
  async function run(preview: boolean) {
    setBusy(true);
    setError(null);
    try {
      setResult(await api<Result>("/inventory/rate-update", { body: { scope, field, mode, value, round, preview } }));
      if (!preview) router.refresh();
    } catch (err) { setError(errorText(t, err, ["rateUpdate.errors"])); } finally { setBusy(false); }
  }
  const pick = (label: string, id: string, v: string, set: (s: string) => void, options: string[]) => (
    <Field label={label} htmlFor={id}>
      <Select id={id} value={v} onChange={(e) => { set(e.target.value); setResult(null); }}>
        <option value="">{t("rateUpdate.any")}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </Select>
    </Field>
  );

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      <Card>
        <h2 className="mb-3 text-sm font-semibold">{t("rateUpdate.who")}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pick(t("rateUpdate.brand"), "ru-brand", brand, setBrand, brands)}
          {pick(t("rateUpdate.category"), "ru-cat", category, setCategory, categories)}
          {pick(t("rateUpdate.season"), "ru-season", season, setSeason, seasons)}
          <Field label={t("rateUpdate.style")} htmlFor="ru-style">
            <Select id="ru-style" value={styleId} onChange={(e) => { setStyleId(e.target.value); setResult(null); }}>
              <option value="">{t("rateUpdate.any")}</option>
              {styles.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </Select>
          </Field>
        </div>
        <label className="mt-3 flex items-center gap-2 text-[0.9286rem]"><input type="checkbox" checked={all} onChange={(e) => { setAll(e.target.checked); setResult(null); }} className="size-4" />{t("rateUpdate.everything")}</label>
      </Card>
      <Card>
        <h2 className="mb-3 text-sm font-semibold">{t("rateUpdate.how")}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label={t("rateUpdate.field")} htmlFor="ru-field"><Select id="ru-field" value={field} onChange={(e) => { setField(e.target.value as typeof field); setResult(null); }}>{FIELDS.map((f) => <option key={f} value={f}>{t(`rateUpdate.fields.${f}`)}</option>)}</Select></Field>
          <Field label={t("rateUpdate.mode")} htmlFor="ru-mode"><Select id="ru-mode" value={mode} onChange={(e) => { setMode(e.target.value as typeof mode); setResult(null); }}>{MODES.map((m) => <option key={m} value={m}>{t(`rateUpdate.modes.${m}`)}</option>)}</Select></Field>
          <Field label={t(`rateUpdate.value.${mode}`)} htmlFor="ru-value"><Input id="ru-value" inputMode="decimal" value={value} onChange={(e) => { if (/^-?\d*\.?\d{0,2}$/.test(e.target.value)) { setValue(e.target.value); setResult(null); } }} className="num text-right" /></Field>
          <Field label={t("rateUpdate.round")} htmlFor="ru-round"><Select id="ru-round" value={round} onChange={(e) => { setRound(e.target.value as typeof round); setResult(null); }}>{ROUNDS.map((r) => <option key={r} value={r}>{t(`rateUpdate.rounds.${r}`)}</option>)}</Select></Field>
        </div>
        <div className="mt-4 flex gap-3">
          <Button type="button" variant="outline" disabled={busy || !ready} onClick={() => run(true)}>{t("rateUpdate.preview")}</Button>
          {canApprove
            ? <Button type="button" disabled={busy || !ready || !result || result.applied || result.changed === 0 || result.aboveMrp > 0} onClick={() => run(false)}>{t("rateUpdate.apply")}</Button>
            : <Button type="button" disabled={busy || !ready || !result || result.changed === 0 || result.aboveMrp > 0} onClick={ask}>{t("rateUpdate.askApproval")}</Button>}
        </div>
      </Card>
      {result ? (
        <Card className="p-0">
          <p role="status" className="border-b border-border px-4 py-2 text-sm font-semibold">
            {result.applied ? t("rateUpdate.applied", { n: result.changed }) : t("rateUpdate.summary", { matched: result.matched, changed: result.changed })}
            {result.aboveMrp ? <span className="ml-3 font-normal text-danger">{t("rateUpdate.aboveMrp", { n: result.aboveMrp })}</span> : null}
          </p>
          {result.valuation ? <p className="border-b border-border px-4 py-2 text-sm">{t("rateUpdate.valuation", { before: rupees(result.valuation.before), after: rupees(result.valuation.after), change: rupees(result.valuation.change) })}</p> : null}
          <div className="max-h-96 overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted"><tr className="border-b border-border"><th className="px-4 py-2 font-medium">{t("rateUpdate.item")}</th><th className="px-4 py-2 text-right font-medium">{t("rateUpdate.was")}</th><th className="px-4 py-2 text-right font-medium">{t("rateUpdate.now")}</th></tr></thead>
              <tbody>
                {result.rows.map((r) => (
                  <tr key={r.itemId} className="border-b border-border last:border-0">
                    <td className="px-4 py-1.5">{r.name}</td>
                    <td className="num px-4 py-1.5 text-right">{rupees(r.old)}</td>
                    <td className={`num px-4 py-1.5 text-right font-semibold ${r.aboveMrp ? "text-danger" : ""}`}>{rupees(r.new)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}
      {note ? <p className="text-sm text-success" role="status">{note}</p> : null}
      {requests.length ? (
        <Card className="p-0">
          <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("rateUpdate.requests")}</h2>
          <table className="w-full text-sm"><tbody>{requests.map((r) => (
            <tr key={r.id} className="border-b border-rule last:border-0">
              <td className="px-4 py-1.5">{t(`rateUpdate.fields.${r.summary.field}`)} {r.input.mode === "percent" ? `${r.input.value}%` : r.input.value}<div className="text-xs text-muted">{JSON.stringify(r.input.scope)}</div></td>
              <td className="num px-4 py-1.5 text-right">{t("rateUpdate.items", { n: r.summary.changed })}</td>
              <td className="num px-4 py-1.5 text-right">{rupees(r.summary.valuation.change)}</td>
              <td className="px-4 py-1.5">{t(`rateUpdate.statuses.${r.status}`)}{r.decisionNote ? <div className="text-xs text-muted">{r.decisionNote}</div> : null}</td>
              <td className="px-4 py-1.5 text-right">{canApprove && r.status === "pending" ? <span className="flex justify-end gap-2"><Button type="button" disabled={busy} onClick={() => decide(r.id, "approve")}>{t("rateUpdate.approve")}</Button><Button type="button" variant="outline" disabled={busy} onClick={() => decide(r.id, "reject")}>{t("rateUpdate.reject")}</Button></span> : null}</td>
            </tr>
          ))}</tbody></table>
        </Card>
      ) : null}
    </div>
  );
}
