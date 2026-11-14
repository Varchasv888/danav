"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { todayIso } from "@/lib/format";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

interface Option { id: string; name: string }
interface Branch { rows: { warehouseId: string; store: string; branch: string | null; headOffice: boolean; sales: string; salesSharePct: string | null; pieces: string; bills: number; avgBill: string; stockPieces: string; stockValue: string; stockSharePct: string | null; coverDays: string | null }[]; totals: { sales: string; pieces: string; stockPieces: string; stockValue: string } }
interface Proposal { proposal: { itemId: string; total: number; perStore: { warehouseId: string; store: string; qty: number }[] }[] }

const NS = ["distribution.errors", "transfers.errors"];

/** Stores side by side, and a share-out of new stock between them by demand, ratio or fixed numbers. */
export function Distribution({ warehouses, items, canCreate }: { warehouses: Option[]; items: Option[]; canCreate: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [source, setSource] = useState(warehouses[0]?.id ?? "");
  const [mode, setMode] = useState<"demand" | "ratio" | "fixed">("demand");
  const [days, setDays] = useState("30");
  const [itemId, setItemId] = useState("");
  const [qty, setQty] = useState("");
  const [weights, setWeights] = useState<Record<string, string>>({});
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [done, setDone] = useState<{ number: string; transferId: string }[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });
  useEffect(() => { const d = todayIso(); setTo(d); setFrom(`${d.slice(0, 7)}-01`); }, []);

  const fail = useCallback((err: unknown) => setError(errorText(t, err, NS)), [t]);
  useEffect(() => { if (from && to) api<Branch>(`/reports/branch-comparison?from=${from}&to=${to}`).then(setBranch).catch(fail); }, [from, to, fail]);

  const body = () => ({
    fromWarehouseId: source, mode, items: [{ itemId, qty }], days: Number(days) || 30,
    ...(mode === "ratio" ? { weights: Object.entries(weights).filter(([, w]) => Number(w) > 0).map(([warehouseId, weight]) => ({ warehouseId, weight })) } : {}),
    ...(mode === "fixed" ? { fixed: Object.entries(weights).filter(([, w]) => Number(w) > 0).map(([warehouseId, w]) => ({ warehouseId, qty: w })) } : {}),
  });
  const propose = async () => { setBusy(true); setError(null); setDone(null); try { setProposal(await api<Proposal>("/allocations/propose", { method: "POST", body: body() })); } catch (err) { fail(err); } finally { setBusy(false); } };
  const dispatch = async () => { setBusy(true); setError(null); try { const r = await api<{ transfers: { number: string; transferId: string }[] }>("/allocations/dispatch", { method: "POST", body: { ...body(), date: todayIso() } }); setDone(r.transfers); setProposal(null); } catch (err) { fail(err); } finally { setBusy(false); } };

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      <div className="flex flex-wrap items-end gap-3">
        <Field label={t("distribution.from")}><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></Field>
        <Field label={t("distribution.to")}><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></Field>
      </div>
      <Card className="overflow-x-auto p-0">
        <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("distribution.compare")}</h2>
        {branch && branch.rows.length ? (
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted"><tr className="border-b border-rule"><th className="px-4 py-1.5 font-medium">{t("distribution.store")}</th><th className="px-4 py-1.5 text-right font-medium">{t("distribution.sales")}</th><th className="px-4 py-1.5 text-right font-medium">{t("distribution.share")}</th><th className="px-4 py-1.5 text-right font-medium">{t("distribution.pieces")}</th><th className="px-4 py-1.5 text-right font-medium">{t("distribution.bills")}</th><th className="px-4 py-1.5 text-right font-medium">{t("distribution.avgBill")}</th><th className="px-4 py-1.5 text-right font-medium">{t("distribution.stock")}</th><th className="px-4 py-1.5 text-right font-medium">{t("distribution.stockValue")}</th><th className="px-4 py-1.5 text-right font-medium">{t("distribution.cover")}</th></tr></thead>
            <tbody>{branch.rows.map((r) => (
              <tr key={r.warehouseId} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{r.store}{r.headOffice ? <span className="ml-2 text-xs text-muted">{t("distribution.headOffice")}</span> : null}</td><td className="num px-4 py-1.5 text-right">{money(r.sales)}</td><td className="num px-4 py-1.5 text-right">{r.salesSharePct ? `${r.salesSharePct}%` : ""}</td><td className="num px-4 py-1.5 text-right">{r.pieces}</td><td className="num px-4 py-1.5 text-right">{r.bills}</td><td className="num px-4 py-1.5 text-right">{money(r.avgBill)}</td><td className="num px-4 py-1.5 text-right">{r.stockPieces}</td><td className="num px-4 py-1.5 text-right">{money(r.stockValue)}</td><td className="num px-4 py-1.5 text-right">{r.coverDays ?? ""}</td></tr>
            ))}</tbody>
            <tfoot><tr className="border-t border-rule font-medium"><td className="px-4 py-1.5">{t("distribution.total")}</td><td className="num px-4 py-1.5 text-right">{money(branch.totals.sales)}</td><td /><td className="num px-4 py-1.5 text-right">{branch.totals.pieces}</td><td colSpan={2} /><td className="num px-4 py-1.5 text-right">{branch.totals.stockPieces}</td><td className="num px-4 py-1.5 text-right">{money(branch.totals.stockValue)}</td><td /></tr></tfoot>
          </table>
        ) : <p className="p-4 text-sm text-muted">{t("distribution.empty")}</p>}
      </Card>

      {canCreate ? (
        <Card className="p-4">
          <h2 className="text-sm font-semibold">{t("distribution.shareOut")}</h2>
          <p className="mt-1 text-sm text-muted">{t("distribution.shareOutHelp")}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-4">
            <Field label={t("distribution.fromStore")}><Select value={source} onChange={(e) => setSource(e.target.value)}>{warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</Select></Field>
            <Field label={t("distribution.item")}><Select value={itemId} onChange={(e) => setItemId(e.target.value)}><option value="">-</option>{items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}</Select></Field>
            <Field label={t("distribution.pieces")}><Input inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value.replace(/\D/g, ""))} /></Field>
            <Field label={t("distribution.by")}><Select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}><option value="demand">{t("distribution.byDemand")}</option><option value="ratio">{t("distribution.byRatio")}</option><option value="fixed">{t("distribution.byFixed")}</option></Select></Field>
            {mode === "demand" ? <Field label={t("distribution.daysLooked")}><Input inputMode="numeric" value={days} onChange={(e) => setDays(e.target.value)} /></Field> : null}
            {mode !== "demand" ? warehouses.filter((w) => w.id !== source).map((w) => <Field key={w.id} label={`${w.name} (${mode === "ratio" ? t("distribution.weight") : t("distribution.piecesEach")})`}><Input inputMode="decimal" value={weights[w.id] ?? ""} onChange={(e) => setWeights({ ...weights, [w.id]: e.target.value })} /></Field>) : null}
          </div>
          <div className="mt-3 flex gap-2"><Button type="button" disabled={busy || !itemId || !qty} onClick={propose}>{t("distribution.propose")}</Button></div>
          {proposal ? (
            <div className="mt-3">
              <table className="w-full max-w-md text-sm"><tbody>{proposal.proposal[0]!.perStore.map((s) => <tr key={s.warehouseId} className="border-b border-rule"><td className="py-1">{s.store}</td><td className="num py-1 text-right">{s.qty}</td></tr>)}</tbody></table>
              <Button type="button" className="mt-2" disabled={busy} onClick={dispatch}>{t("distribution.dispatch")}</Button>
            </div>
          ) : null}
          {done ? <p className="mt-3 text-sm text-success" role="status">{t("distribution.sent")} {done.map((d) => <a key={d.transferId} href={`/print/transfer-slip/${d.transferId}`} target="_blank" rel="noreferrer" className="ml-2 underline">{d.number}</a>)}</p> : null}
        </Card>
      ) : null}
    </div>
  );
}
