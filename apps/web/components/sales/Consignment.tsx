"use client";

import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { localName, rupees, todayIso } from "@/lib/format";
import { ConsigneeTerms } from "./ConsigneeTerms";
import { Alert, Button, Card, Field, Input, Select } from "../ui";
import { useWorkDate } from "@/components/WorkingDate";

export interface Consignee { customerId: string; name: string; pieces: string; value: string; sold: string; ageing: number }
export interface Reconciliation {
  customerId: string; name: string; asOf: string;
  terms: { settlementDays: number; discrepancyOwner: string | null }; discrepancies: number; settlementDue: string | null; settlementOverdue: boolean;
  rows: { itemId: string; name: string; sent: string; returned: string; sold: string; held: string; difference: string; value: string; oldestSent: string | null; invoiceBy: string | null; ageDays: number; overdue: boolean }[];
  totals: { held: string; sold: string; value: string };
  moves: { id: string; kind: "send" | "return" | "sale"; number: string; date: string; value: string; pieces: string; invoiceId: string | null }[];
}
type Choice = { id: string; name: string; nameHi: string | null };
type Kind = "send" | "return" | "sales";

function useRun() {
  const t = useTranslations();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const run = async (fn: () => Promise<unknown>, after?: () => void) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      after?.();
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? (err.issues?.[0]?.message ?? err.code) : "generic";
      const key = [`consignment.errors.${code}`, `sales.errors.${code}`, `items.errors.${code}`].find((k) => t.has(k));
      setError(key ? t(key) : t("auth.errors.generic"));
    }
    setBusy(false);
  };
  return { error, busy, run };
}

/** Goods out with consignees: who holds what, and the forms to send, take back and bill. */
export function Consignment({ consignees, customers, items, detail, canCreate }: {
  consignees: Consignee[]; customers: Choice[]; items: Choice[]; detail: Reconciliation | null; canCreate: boolean;
}) {
  const t = useTranslations();
  const [form, setForm] = useState<Kind | null>(null);
  return (
    <div className="flex flex-col gap-6">
      {canCreate ? (
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setForm(form === "send" ? null : "send")}><Plus className="size-4" aria-hidden />{t("consignment.send")}</Button>
          {detail ? <Button variant="outline" onClick={() => setForm(form === "sales" ? null : "sales")}>{t("consignment.billSales")}</Button> : null}
          {detail ? <Button variant="outline" onClick={() => setForm(form === "return" ? null : "return")}>{t("consignment.takeBack")}</Button> : null}
        </div>
      ) : null}
      {form ? (
        <MoveForm key={form} kind={form} customers={customers} defaultCustomer={detail?.customerId}
          items={form === "send" ? items : (detail?.rows ?? []).filter((r) => Number(r.held) > 0).map((r) => ({ id: r.itemId, name: r.name, nameHi: null, held: r.held }))}
          onDone={() => setForm(null)} />
      ) : null}

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("consignment.consignee")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("consignment.held")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("consignment.valueAtCost")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("consignment.sold")}</th>
                <th className="px-5 py-3 font-medium">{t("consignment.ageing")}</th>
              </tr>
            </thead>
            <tbody>
              {consignees.map((c) => (
                <tr key={c.customerId} className={`border-b border-border last:border-0 ${detail?.customerId === c.customerId ? "bg-primary-soft" : ""}`}>
                  <td className="px-5 py-2.5"><Link href={`/sales/consignment?customer=${c.customerId}`} className="font-medium text-primary hover:underline">{c.name}</Link></td>
                  <td className="num px-5 py-2.5 text-right">{Number(c.pieces)}</td>
                  <td className="num px-5 py-2.5 text-right">{rupees(c.value)}</td>
                  <td className="num px-5 py-2.5 text-right">{Number(c.sold)}</td>
                  <td className="px-5 py-2.5">{c.ageing ? <span className="text-danger">{t("consignment.itemsAgeing", { n: c.ageing })}</span> : <span className="text-muted">{t("consignment.fine")}</span>}</td>
                </tr>
              ))}
              {!consignees.length ? <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">{t("consignment.none")}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
      {detail ? <Detail detail={detail} canCreate={canCreate} /> : null}
    </div>
  );
}

function Detail({ detail, canCreate }: { detail: Reconciliation; canCreate: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const d = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  const { error, busy, run } = useRun();
  const [counted, setCounted] = useState<Record<string, string>>({});
  const short = detail.rows.map((r) => ({ r, short: counted[r.itemId] !== undefined && counted[r.itemId] !== "" ? Number(r.held) - Number(counted[r.itemId]) : 0 })).filter((x) => x.short > 0);
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-semibold">{t("consignment.reconcileTitle", { name: detail.name })}</h2>
      <p className="text-sm text-muted">{t("consignment.reconcileHint")}</p>
      <ConsigneeTerms customerId={detail.customerId} settlementDays={detail.terms.settlementDays} owner={detail.terms.discrepancyOwner} due={detail.settlementDue} overdue={detail.settlementOverdue} discrepancies={detail.discrepancies} canEdit={canCreate} statementFrequency={(detail.terms as { statementFrequency?: "weekly" | "monthly" | null }).statementFrequency ?? null} statementEmail={(detail.terms as { statementEmail?: string | null }).statementEmail ?? null} />
      {error ? <Alert>{error}</Alert> : null}
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-4 py-3 font-medium">{t("schemes.item")}</th>
                <th className="px-4 py-3 text-right font-medium">{t("consignment.sent")}</th>
                <th className="px-4 py-3 text-right font-medium">{t("consignment.returned")}</th>
                <th className="px-4 py-3 text-right font-medium">{t("consignment.sold")}</th>
                <th className="px-4 py-3 text-right font-medium">{t("consignment.held")}</th>
                <th className="w-28 px-4 py-3 font-medium">{t("consignment.counted")}</th>
                <th className="px-4 py-3 font-medium">{t("consignment.invoiceBy")}</th>
              </tr>
            </thead>
            <tbody>
              {detail.rows.map((r) => (
                <tr key={r.itemId} className="border-b border-border last:border-0">
                  <td className="px-4 py-2">{r.name}{Number(r.difference) ? <span className="ml-2 text-xs text-danger">{t("consignment.mismatch", { n: r.difference })}</span> : null}</td>
                  <td className="num px-4 py-2 text-right">{Number(r.sent)}</td>
                  <td className="num px-4 py-2 text-right">{Number(r.returned)}</td>
                  <td className="num px-4 py-2 text-right">{Number(r.sold)}</td>
                  <td className="num px-4 py-2 text-right font-medium">{Number(r.held)}</td>
                  <td className="px-4 py-2">
                    {Number(r.held) > 0 ? <Input value={counted[r.itemId] ?? ""} onChange={(e) => setCounted({ ...counted, [r.itemId]: e.target.value })} inputMode="decimal" className="num h-8" aria-label={t("consignment.counted")} /> : null}
                  </td>
                  <td className={`px-4 py-2 ${r.overdue ? "font-medium text-danger" : "text-muted"}`}>{r.invoiceBy && Number(r.held) > 0 ? d(r.invoiceBy) : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {short.length && canCreate ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm">{t("consignment.shortage", { n: short.reduce((s, x) => s + x.short, 0) })}</span>
          <Button variant="outline" disabled={busy} onClick={() => run(() => api("/consignment/sales", {
            body: { customerId: detail.customerId, narration: t("consignment.shortageNarration"), lines: short.map((x) => ({ itemId: x.r.itemId, qty: String(x.short) })) },
          }), () => setCounted({}))}>{t("consignment.billShortage")}</Button>
        </div>
      ) : null}
      <h3 className="mt-2 font-medium">{t("consignment.register")}</h3>
      <ul className="divide-y divide-border rounded-lg border border-border text-sm">
        {detail.moves.map((m) => (
          <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2">
            <span>
              {m.invoiceId ? <Link href={`/sales/invoices/${m.invoiceId}`} className="font-mono text-primary hover:underline">{m.number}</Link> : <span className="font-mono">{m.number}</span>}
              <span className="ml-2 text-muted">{t(`consignment.kinds.${m.kind}`)} · {d(m.date)}</span>
            </span>
            <span className="num">{Number(m.pieces)} · {rupees(m.value)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MoveForm({ kind, customers, defaultCustomer, items, onDone }: {
  kind: Kind; customers: Choice[]; defaultCustomer: string | undefined; items: (Choice & { held?: string })[]; onDone: () => void;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const { error, busy, run } = useRun();
  const [customerId, setCustomerId] = useState(defaultCustomer ?? customers[0]?.id ?? "");
  const workDate = useWorkDate();
  const [date, setDate] = useState(workDate);
  const [lines, setLines] = useState([{ itemId: items[0]?.id ?? "", qty: "", rate: "" }]);
  const set = (i: number, patch: Partial<(typeof lines)[number]>) => setLines(lines.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  const path = { send: "/consignment/send", return: "/consignment/return", sales: "/consignment/sales" }[kind];
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="font-semibold">{t(`consignment.forms.${kind}`)}</h2>
      <p className="text-sm text-muted">{t(`consignment.formHints.${kind}`)}</p>
      {error ? <Alert>{error}</Alert> : null}
      <div className="grid gap-4 md:grid-cols-3">
        <Field label={t("consignment.consignee")} htmlFor="cs-cust">
          <Select id="cs-cust" value={customerId} onChange={(e) => setCustomerId(e.target.value)} disabled={kind !== "send"}>
            {customers.map((c) => <option key={c.id} value={c.id}>{localName(c, locale)}</option>)}
          </Select>
        </Field>
        <Field label={t("common.date")} htmlFor="cs-date"><Input id="cs-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
      </div>
      {lines.map((l, i) => (
        <div key={i} className="grid grid-cols-[2fr_90px_110px_auto] gap-2">
          <Select value={l.itemId} onChange={(e) => set(i, { itemId: e.target.value })} aria-label={t("schemes.item")}>
            {items.map((it) => <option key={it.id} value={it.id}>{localName(it, locale)}{it.held ? ` (${Number(it.held)})` : ""}</option>)}
          </Select>
          <Input value={l.qty} onChange={(e) => set(i, { qty: e.target.value })} inputMode="decimal" className="num" placeholder={t("schemes.qty")} aria-label={t("schemes.qty")} />
          {kind === "return" ? <span /> : <Input value={l.rate} onChange={(e) => set(i, { rate: e.target.value })} inputMode="decimal" className="num" placeholder={t("consignment.agreedRate")} aria-label={t("consignment.agreedRate")} />}
          <button type="button" onClick={() => setLines(lines.filter((_, j) => j !== i))} disabled={lines.length === 1} className="rounded-md p-2 text-muted hover:text-danger disabled:opacity-40" title={t("common.remove")}>
            <Trash2 className="size-4" aria-hidden /><span className="sr-only">{t("common.remove")}</span>
          </button>
        </div>
      ))}
      <div className="flex flex-wrap gap-3">
        <Button variant="ghost" className="-ml-3" onClick={() => setLines([...lines, { itemId: items[0]?.id ?? "", qty: "", rate: "" }])}><Plus className="size-4" aria-hidden />{t("consignment.addLine")}</Button>
        <span className="flex-1" />
        <Button disabled={busy || !customerId || !lines.some((l) => Number(l.qty) > 0)} onClick={() => run(() => api(path, {
          body: { customerId, date, lines: lines.filter((l) => l.itemId && Number(l.qty) > 0).map((l) => ({ itemId: l.itemId, qty: l.qty, ...(l.rate ? { rate: l.rate } : {}) })) },
        }), onDone)}>{t(`consignment.save.${kind}`)}</Button>
        <Button variant="ghost" onClick={onDone}>{t("common.cancel")}</Button>
      </div>
    </Card>
  );
}
