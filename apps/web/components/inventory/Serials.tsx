"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Badge, Button, Card, Field, Input, Select } from "../ui";

interface Option { id: string; name: string }
interface Row { id: string; serial: string; status: string; store: string | null; receivedOn: string | null; soldOn: string | null; soldBill: string | null }
interface Found { item: string; serial: string; status: string; store: string | null; receivedOn: string | null; soldOn: string | null; soldBill: string | null }

const NS = ["serials.errors"];

/** Pieces tracked by serial number: look one up, list an item's pieces, enter serials by hand, and see where stock and serials disagree. */
export function Serials({ stores, items, check, canCreate }: { stores: Option[]; items: Option[]; check: { itemId: string; item: string; stock: string; serials: number; gap: string }[]; canCreate: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [lookup, setLookup] = useState("");
  const [found, setFound] = useState<Found[] | null>(null);
  const [itemId, setItemId] = useState(items[0]?.id ?? "");
  const [status, setStatus] = useState("in_stock");
  const [rows, setRows] = useState<Row[]>([]);
  const [store, setStore] = useState(stores[0]?.id ?? "");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fail = useCallback((err: unknown) => setError(errorText(t, err, NS)), [t]);

  const load = useCallback(() => {
    if (!itemId) return;
    api<Row[]>(`/serials?itemId=${itemId}&status=${status}`).then(setRows).catch(fail);
  }, [itemId, status, fail]);
  useEffect(() => { load(); }, [load]);

  async function find(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setFound(null);
    try { setFound(await api<Found[]>(`/serials/lookup?serial=${encodeURIComponent(lookup.trim())}`)); } catch (err) { fail(err); }
  }
  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      await api("/serials", { body: { itemId, warehouseId: store, serials: text.split(/[\s,;]+/).filter(Boolean) } });
      setText(""); load(); router.refresh();
    } catch (err) { fail(err); } finally { setBusy(false); }
  }

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      <Card className="p-4">
        <form onSubmit={find} className="flex flex-wrap items-end gap-3">
          <Field label={t("serials.lookup")} htmlFor="sr-find"><Input id="sr-find" value={lookup} onChange={(e) => setLookup(e.target.value)} maxLength={40} className="num w-64" /></Field>
          <Button type="submit" variant="outline" disabled={!lookup.trim()}>{t("serials.find")}</Button>
        </form>
        {found ? (
          <ul className="mt-3 text-sm">{found.map((f) => (
            <li key={f.serial + f.item} className="border-b border-rule py-1.5">{f.item}: <span className="num font-medium">{f.serial}</span> <Badge tone={f.status === "in_stock" ? "success" : "neutral"}>{t(`serials.s.${f.status}`)}</Badge>
              <span className="ml-2 text-muted">{[f.store, f.receivedOn ? t("serials.in", { date: f.receivedOn }) : null, f.soldBill ? t("serials.soldOn", { bill: f.soldBill, date: f.soldOn ?? "" }) : null].filter(Boolean).join(", ")}</span></li>
          ))}</ul>
        ) : null}
      </Card>

      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-3">
          <Field label={t("serials.item")} htmlFor="sr-item"><Select id="sr-item" value={itemId} onChange={(e) => setItemId(e.target.value)}>{items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}</Select></Field>
          <Field label={t("serials.show")} htmlFor="sr-status"><Select id="sr-status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="in_stock">{t("serials.s.in_stock")}</option><option value="sold">{t("serials.s.sold")}</option></Select></Field>
        </div>
        {items.length ? (
          <table className="mt-3 w-full text-sm">
            <thead className="text-left text-xs text-muted"><tr className="border-b border-rule"><th className="py-1.5 font-medium">{t("serials.serial")}</th><th className="py-1.5 font-medium">{t("serials.store")}</th><th className="py-1.5 font-medium">{t("serials.received")}</th><th className="py-1.5 font-medium">{t("serials.sold")}</th></tr></thead>
            <tbody>{rows.map((r) => <tr key={r.id} className="border-b border-rule last:border-0"><td className="num py-1.5">{r.serial}</td><td className="py-1.5">{r.store ?? "-"}</td><td className="py-1.5">{r.receivedOn ?? "-"}</td><td className="py-1.5">{r.soldBill ? `${r.soldBill} ${r.soldOn ?? ""}` : "-"}</td></tr>)}</tbody>
          </table>
        ) : <p className="mt-3 text-sm text-muted">{t("serials.noItems")}</p>}
        {canCreate && items.length ? (
          <form onSubmit={add} className="mt-4 grid gap-3 sm:grid-cols-3">
            <Field label={t("serials.store")} htmlFor="sr-store"><Select id="sr-store" value={store} onChange={(e) => setStore(e.target.value)}>{stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></Field>
            <div className="sm:col-span-2"><Field label={t("serials.enter")} htmlFor="sr-text" hint={t("serials.enterHint")}><textarea id="sr-text" value={text} onChange={(e) => setText(e.target.value)} rows={3} className="num w-full rounded-md border border-border bg-surface p-2 text-sm" /></Field></div>
            <div><Button type="submit" disabled={busy || !text.trim()}>{t("serials.add")}</Button></div>
          </form>
        ) : null}
      </Card>

      {check.length ? (
        <Card className="p-0">
          <h2 className="px-4 pt-3 text-sm font-medium">{t("serials.checkTitle")}</h2>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted"><tr className="border-b border-rule"><th className="px-4 py-1.5 font-medium">{t("serials.item")}</th><th className="px-4 py-1.5 text-right font-medium">{t("serials.stock")}</th><th className="px-4 py-1.5 text-right font-medium">{t("serials.withSerial")}</th><th className="px-4 py-1.5 text-right font-medium">{t("serials.gap")}</th></tr></thead>
            <tbody>{check.map((c) => <tr key={c.itemId} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{c.item}</td><td className="num px-4 py-1.5 text-right">{c.stock}</td><td className="num px-4 py-1.5 text-right">{c.serials}</td><td className={`num px-4 py-1.5 text-right ${c.gap === "0" ? "" : "text-danger"}`}>{c.gap}</td></tr>)}</tbody>
          </table>
        </Card>
      ) : null}
    </div>
  );
}
