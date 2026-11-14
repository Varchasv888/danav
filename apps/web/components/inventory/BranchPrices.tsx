"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

interface Store { id: string; name: string }
interface Item { id: string; name: string; sku: string | null; saleRate: string }
interface Row { id: string; item: string; sku: string | null; usualRate: string; saleRate: string; startsOn: string | null; endsOn: string | null; fromTime: string | null; toTime: string | null; note: string | null }

const NS = ["branchPrices.errors"];

/** A store's own selling rates: typed one by one, pasted from a sheet by code, or copied from another store. */
export function BranchPrices({ stores, items, canEdit }: { stores: Store[]; items: Item[]; canEdit: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const [store, setStore] = useState(stores[0]?.id ?? "");
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({ itemId: items[0]?.id ?? "", saleRate: "", startsOn: "", endsOn: "", fromTime: "", toTime: "" });
  const [paste, setPaste] = useState("");
  const [copyFrom, setCopyFrom] = useState("");
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });

  const load = useCallback(() => {
    if (!store) return;
    api<Row[]>(`/branch-prices?warehouseId=${store}`).then(setRows).catch((err) => setError(errorText(t, err, NS)));
  }, [store, t]);
  useEffect(() => { load(); }, [load]);
  const act = async (fn: () => Promise<unknown>) => { setBusy(true); setError(null); try { await fn(); load(); } catch (err) { setError(errorText(t, err, NS)); } finally { setBusy(false); } };
  const val = (v: string) => (v ? v : null);

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-wrap items-end gap-4 p-4">
        <Field label={t("branchPrices.store")} htmlFor="bp-store"><Select id="bp-store" value={store} onChange={(e) => setStore(e.target.value)}>{stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></Field>
        {canEdit ? (
          <>
            <Field label={t("branchPrices.copyFrom")} htmlFor="bp-copy"><Select id="bp-copy" value={copyFrom} onChange={(e) => setCopyFrom(e.target.value)}><option value="">-</option>{stores.filter((s) => s.id !== store).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></Field>
            <Button variant="outline" disabled={busy || !copyFrom} onClick={() => act(async () => { await api("/branch-prices/copy", { body: { fromWarehouseId: copyFrom, toWarehouseId: store } }); setCopyFrom(""); })}>{t("branchPrices.copy")}</Button>
          </>
        ) : null}
      </Card>
      {error ? <Alert>{error}</Alert> : null}
      {canEdit ? (
        <Card className="p-4">
          <form className="grid gap-3 sm:grid-cols-3" onSubmit={(e) => { e.preventDefault(); void act(async () => { await api("/branch-prices", { body: { warehouseId: store, entries: [{ itemId: f.itemId, saleRate: f.saleRate, startsOn: val(f.startsOn), endsOn: val(f.endsOn), fromTime: val(f.fromTime), toTime: val(f.toTime) }] } }); setF({ ...f, saleRate: "" }); }); }}>
            <Field label={t("branchPrices.item")}><Select value={f.itemId} onChange={(e) => setF({ ...f, itemId: e.target.value })}>{items.map((i) => <option key={i.id} value={i.id}>{i.name}{i.sku ? ` (${i.sku})` : ""} - {money(i.saleRate)}</option>)}</Select></Field>
            <Field label={t("branchPrices.rate")}><Input value={f.saleRate} onChange={(e) => setF({ ...f, saleRate: e.target.value })} inputMode="decimal" className="num" required /></Field>
            <div />
            <Field label={t("branchPrices.from")}><Input type="date" value={f.startsOn} onChange={(e) => setF({ ...f, startsOn: e.target.value })} /></Field>
            <Field label={t("branchPrices.to")}><Input type="date" value={f.endsOn} onChange={(e) => setF({ ...f, endsOn: e.target.value })} /></Field>
            <div />
            <Field label={t("branchPrices.fromTime")}><Input type="time" value={f.fromTime} onChange={(e) => setF({ ...f, fromTime: e.target.value })} /></Field>
            <Field label={t("branchPrices.toTime")}><Input type="time" value={f.toTime} onChange={(e) => setF({ ...f, toTime: e.target.value })} /></Field>
            <div className="flex items-end"><Button type="submit" disabled={busy || !f.itemId}>{t("branchPrices.add")}</Button></div>
          </form>
          <div className="mt-4">
            <Field label={t("branchPrices.paste")} htmlFor="bp-paste" hint={t("branchPrices.pasteHint")}><textarea id="bp-paste" value={paste} onChange={(e) => setPaste(e.target.value)} rows={3} className="w-full rounded-md border border-border bg-surface p-2 text-sm" /></Field>
            <Button className="mt-2" variant="outline" disabled={busy || !paste.trim()} onClick={() => act(async () => { await api("/branch-prices/import", { body: { warehouseId: store, text: paste, startsOn: val(f.startsOn), endsOn: val(f.endsOn) } }); setPaste(""); })}>{t("branchPrices.import")}</Button>
          </div>
        </Card>
      ) : null}
      <Card className="p-0">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted"><tr className="border-b border-rule"><th className="px-4 py-1.5 font-medium">{t("branchPrices.item")}</th><th className="px-4 py-1.5 text-right font-medium">{t("branchPrices.usual")}</th><th className="px-4 py-1.5 text-right font-medium">{t("branchPrices.rate")}</th><th className="px-4 py-1.5 font-medium">{t("branchPrices.when")}</th><th /></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.id} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{r.item}{r.sku ? <span className="ml-2 text-xs text-muted">{r.sku}</span> : null}</td><td className="num px-4 py-1.5 text-right text-muted">{money(r.usualRate)}</td><td className="num px-4 py-1.5 text-right font-medium">{money(r.saleRate)}</td>
              <td className="px-4 py-1.5 text-xs text-muted">{[r.startsOn || r.endsOn ? `${r.startsOn ?? ""} - ${r.endsOn ?? ""}` : null, r.fromTime ? `${r.fromTime}-${r.toTime}` : null, r.note].filter(Boolean).join(", ") || t("branchPrices.always")}</td>
              <td className="px-4 py-1.5 text-right">{canEdit ? <Button variant="ghost" disabled={busy} onClick={() => act(() => api(`/branch-prices/${r.id}`, { method: "DELETE" }))}>{t("branchPrices.remove")}</Button> : null}</td></tr>
          ))}</tbody>
        </table>
        {rows.length ? null : <p className="px-4 py-3 text-sm text-muted">{t("branchPrices.none")}</p>}
      </Card>
    </div>
  );
}
