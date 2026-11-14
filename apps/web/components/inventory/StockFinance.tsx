"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { fyStart, todayIso } from "@/lib/format";
import { Alert, Badge, Button, Card, Field, Input } from "../ui";

interface Line { itemId: string; name: string; qty: string; cost: string; nrv: string; ageProvision: string; nrvShortfall: string; writedown: string }
interface Review { defaults: Record<string, number>; bands: Record<string, number>; required: string; stockCost: string; lines: Line[] }
interface Writedown { id: string; number: string; asOf: string; required: string; held: string; change: string; status: "pending" | "approved" | "rejected"; requestedBy: string | null; requestedByName: string | null; lineCount: number; note: string | null }
interface Centres { stores: { store: string; branch: string | null; gstin: string | null; qty: string; value: string }[]; sales: { channel: string; store: string | null; branch: string | null; bills: number; sales: string }[]; byGstin: { gstin: string; branch: string; stock: string; sales: string }[] }

const BANDS = ["d91_180", "d181_365", "y1_2", "y2plus"] as const;
const TABS = ["review", "proposals", "centres"] as const;
const NS = ["stockfin.errors", "hr.errors"];

/** Slow and overvalued stock: the provision it needs, proposals a second person approves, and where the stock and sales sit by store, GSTIN and channel. */
export function StockFinance({ userId, canPropose, canApprove }: { userId: string; canPropose: boolean; canApprove: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const [tab, setTab] = useState<(typeof TABS)[number]>("review");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [bands, setBands] = useState<Record<string, string>>({ d91_180: "10", d181_365: "25", y1_2: "50", y2plus: "75" });
  const [cost, setCost] = useState("10");
  const [review, setReview] = useState<Review | null>(null);
  const [list, setList] = useState<Writedown[]>([]);
  const [centres, setCentres] = useState<Centres | null>(null);
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });
  const fail = useCallback((err: unknown) => setError(errorText(t, err, NS)), [t]);
  const bandBody = () => Object.fromEntries(BANDS.map((b) => [b, Number(bands[b] ?? 0)]));

  const load = useCallback(() => {
    setError(null);
    const today = todayIso();
    if (tab === "review") api<Review>(`/finance/stock-review?asOf=${today}&sellingCostPct=${cost}&bands=${encodeURIComponent(JSON.stringify(Object.fromEntries(BANDS.map((b) => [b, Number(bands[b] ?? 0)]))))}`).then(setReview).catch(fail);
    if (tab === "proposals") api<Writedown[]>("/finance/writedowns").then(setList).catch(fail);
    if (tab === "centres") api<Centres>(`/finance/cost-centres?asOf=${today}&from=${fyStart(today)}&to=${today}`).then(setCentres).catch(fail);
  }, [tab, bands, cost, fail]);
  useEffect(() => { load(); }, [load]);
  const act = async (fn: () => Promise<unknown>, after?: () => void) => { setBusy(true); setError(null); try { await fn(); after?.(); load(); } catch (err) { fail(err); } finally { setBusy(false); } };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="tablist">
        {TABS.map((k) => <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-lg border px-3 py-1.5 text-sm ${tab === k ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-surface-2"}`}>{t(`stockfin.tabs.${k}`)}</button>)}
      </div>
      {error ? <Alert>{error}</Alert> : null}

      {tab === "review" ? (
        <>
          <Card>
            <p className="mb-3 text-sm text-muted">{t("stockfin.review.help")}</p>
            <div className="flex flex-wrap items-end gap-4">
              {BANDS.map((b) => <Field key={b} label={t(`stockfin.bands.${b}`)} htmlFor={`sf-${b}`}><Input id={`sf-${b}`} value={bands[b] ?? ""} onChange={(e) => setBands({ ...bands, [b]: e.target.value.replace(/[^\d.]/g, "") })} inputMode="decimal" className="num w-20" /></Field>)}
              <Field label={t("stockfin.review.sellingCost")} htmlFor="sf-cost"><Input id="sf-cost" value={cost} onChange={(e) => setCost(e.target.value.replace(/[^\d.]/g, ""))} inputMode="decimal" className="num w-20" /></Field>
              {canPropose && review ? <Button disabled={busy || !review.lines.length} onClick={() => act(() => api("/finance/writedowns", { body: { asOf: todayIso(), bands: bandBody(), sellingCostPct: cost } }), () => setTab("proposals"))}>{t("stockfin.review.propose")}</Button> : null}
            </div>
          </Card>
          {review ? (
            <Card className="p-0">
              <div className="flex flex-wrap gap-6 border-b border-border px-4 py-2 text-sm"><span>{t("stockfin.review.stock")}: <span className="num font-medium">{money(review.stockCost)}</span></span><span>{t("stockfin.review.required")}: <span className="num font-semibold">{money(review.required)}</span></span></div>
              {review.lines.length ? (
                <table className="w-full text-sm">
                  <thead className="text-left text-xs text-muted"><tr className="border-b border-rule"><th className="px-4 py-1.5 font-medium">{t("stockfin.item")}</th><th className="px-4 py-1.5 text-right font-medium">{t("stockfin.qty")}</th><th className="px-4 py-1.5 text-right font-medium">{t("stockfin.cost")}</th><th className="px-4 py-1.5 text-right font-medium">{t("stockfin.review.age")}</th><th className="px-4 py-1.5 text-right font-medium">{t("stockfin.review.nrv")}</th><th className="px-4 py-1.5 text-right font-medium">{t("stockfin.review.writedown")}</th></tr></thead>
                  <tbody>{review.lines.slice(0, 100).map((l) => (
                    <tr key={l.itemId} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{l.name}</td><td className="num px-4 py-1.5 text-right">{l.qty}</td><td className="num px-4 py-1.5 text-right">{money(l.cost)}</td><td className="num px-4 py-1.5 text-right">{money(l.ageProvision)}</td><td className="num px-4 py-1.5 text-right">{Number(l.nrvShortfall) ? money(l.nrvShortfall) : ""}</td><td className="num px-4 py-1.5 text-right font-medium">{money(l.writedown)}</td></tr>
                  ))}</tbody>
                </table>
              ) : <p className="px-4 py-6 text-center text-muted">{t("stockfin.review.none")}</p>}
            </Card>
          ) : null}
        </>
      ) : null}

      {tab === "proposals" ? (
        <Card className="p-0">
          {list.length ? <ul>{list.map((w) => (
            <li key={w.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-rule px-4 py-2.5 text-sm last:border-0">
              <span className="font-mono text-xs">{w.number}</span><span className="text-muted">{w.asOf}</span>
              <span>{t("stockfin.proposals.required")} <span className="num font-medium">{money(w.required)}</span></span><span>{t("stockfin.proposals.held")} <span className="num">{money(w.held)}</span></span>
              <span>{t("stockfin.proposals.change")} <span className={`num font-semibold ${Number(w.change) < 0 ? "text-success" : ""}`}>{money(w.change)}</span></span>
              <Badge tone={w.status === "pending" ? "warning" : w.status === "approved" ? "success" : "neutral"}>{t(`stockfin.status.${w.status}`)}</Badge>
              {w.status === "pending" && canApprove ? (w.requestedBy === userId ? <span className="ml-auto text-xs text-muted">{t("stockfin.proposals.own")}</span> : (
                <span className="ml-auto flex gap-2"><Button disabled={busy} onClick={() => act(() => api(`/finance/writedowns/${w.id}/decide`, { body: { decision: "approve" } }))}>{t("stockfin.proposals.approve")}</Button><Button variant="outline" disabled={busy} onClick={() => act(() => api(`/finance/writedowns/${w.id}/decide`, { body: { decision: "reject" } }))}>{t("stockfin.proposals.reject")}</Button></span>
              )) : null}
            </li>
          ))}</ul> : <p className="px-4 py-6 text-center text-muted">{t("stockfin.proposals.none")}</p>}
        </Card>
      ) : null}

      {tab === "centres" && centres ? (
        <>
          <Card className="p-0">
            <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("stockfin.centres.stores")}</h2>
            <ul>{centres.stores.map((s, i) => <li key={i} className="flex flex-wrap items-center gap-x-4 border-b border-rule px-4 py-2 text-sm last:border-0"><span className="font-medium">{s.store}</span><span className="text-muted">{s.branch ?? ""} {s.gstin ?? ""}</span><span className="num ml-auto">{s.qty}</span><span className="num font-medium">{money(s.value)}</span></li>)}</ul>
          </Card>
          <Card className="p-0">
            <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("stockfin.centres.sales")}</h2>
            {centres.sales.length ? <ul>{centres.sales.map((s, i) => <li key={i} className="flex flex-wrap items-center gap-x-4 border-b border-rule px-4 py-2 text-sm last:border-0"><Badge tone="neutral">{t(`stockfin.channels.${s.channel}`)}</Badge><span className="font-medium">{s.store ?? s.branch ?? "-"}</span><span className="text-muted">{t("stockfin.centres.bills", { n: s.bills })}</span><span className="num ml-auto font-medium">{money(s.sales)}</span></li>)}</ul> : <p className="px-4 py-6 text-center text-muted">{t("stockfin.review.none")}</p>}
          </Card>
          <Card className="p-0">
            <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("stockfin.centres.gstin")}</h2>
            <ul>{centres.byGstin.map((g, i) => <li key={i} className="flex flex-wrap items-center gap-x-4 border-b border-rule px-4 py-2 text-sm last:border-0"><span className="font-medium">{g.branch}</span><span className="font-mono text-xs text-muted">{g.gstin}</span><span className="ml-auto">{t("stockfin.centres.stock")} <span className="num">{money(g.stock)}</span></span><span>{t("stockfin.centres.salesLabel")} <span className="num font-medium">{money(g.sales)}</span></span></li>)}</ul>
          </Card>
        </>
      ) : null}
    </div>
  );
}
