"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { localName } from "@/lib/format";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export interface PriceList { id: string; name: string; discountPct: string; archived: boolean; items: number; customers: number }
interface ItemChoice { id: string; name: string; nameHi: string | null; saleRate?: string; archived: boolean }

const RATE = /^\d+(\.\d{1,4})?$/;

/** Party price lists: a discount off the sale rate plus fixed rates for chosen items. */
export function PriceLists({ lists, items, canEdit }: { lists: PriceList[]; items: ItemChoice[]; canEdit: boolean }) {
  const t = useTranslations();
  const [editing, setEditing] = useState<PriceList | "new" | null>(null);
  return (
    <div className="flex flex-col gap-4">
      {canEdit && !editing ? <div><Button onClick={() => setEditing("new")}><Plus className="size-4" aria-hidden />{t("priceLists.new")}</Button></div> : null}
      {editing ? <ListForm key={editing === "new" ? "new" : editing.id} list={editing === "new" ? null : editing} items={items} onDone={() => setEditing(null)} /> : null}
      <Card className="p-0">
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr className="border-b border-border">
              <th className="px-5 py-3 font-medium">{t("priceLists.name")}</th>
              <th className="px-5 py-3 text-right font-medium">{t("priceLists.discountPct")}</th>
              <th className="px-5 py-3 text-right font-medium">{t("priceLists.fixedRates")}</th>
              <th className="px-5 py-3 text-right font-medium">{t("priceLists.customers")}</th>
              <th className="w-12" />
            </tr>
          </thead>
          <tbody>
            {lists.map((l) => (
              <tr key={l.id} className={`border-b border-border last:border-0 ${l.archived ? "text-muted" : ""}`}>
                <td className="px-5 py-2.5 font-medium">{l.name}{l.archived ? <span className="ml-2 text-xs">({t("common.archived")})</span> : null}</td>
                <td className="num px-5 py-2.5 text-right">{Number(l.discountPct) ? `${Number(l.discountPct)}%` : ""}</td>
                <td className="num px-5 py-2.5 text-right">{l.items || ""}</td>
                <td className="num px-5 py-2.5 text-right">{l.customers || ""}</td>
                <td className="px-3 py-2.5 text-right">
                  {canEdit ? (
                    <button type="button" onClick={() => setEditing(l)} className="rounded-md p-2 text-muted hover:bg-surface-2 hover:text-text" title={t("common.edit")}>
                      <Pencil className="size-4" aria-hidden /><span className="sr-only">{t("common.edit")}</span>
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
            {!lists.length ? <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">{t("priceLists.empty")}</td></tr> : null}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function ListForm({ list, items, onDone }: { list: PriceList | null; items: ItemChoice[]; onDone: () => void }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [name, setName] = useState(list?.name ?? "");
  const [discount, setDiscount] = useState(list ? String(Number(list.discountPct)) : "");
  const [archived, setArchived] = useState(list?.archived ?? false);
  const [rows, setRows] = useState<{ itemId: string; rate: string }[] | null>(list ? null : []);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const sorted = [...items].filter((i) => !i.archived).sort((a, b) => localName(a, locale).localeCompare(localName(b, locale)));

  // Fixed rates load once when an existing list is opened.
  if (rows === null && list) {
    api<{ items: { itemId: string; rate: string }[] }>(`/price-lists/${list.id}`)
      .then((d) => setRows(d.items.map((i) => ({ itemId: i.itemId, rate: String(Number(i.rate)) }))))
      .catch(() => setRows([]));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const body = { name, discountPct: discount || "0", archived, items: (rows ?? []).filter((r) => r.itemId && RATE.test(r.rate)) };
      if (list) await api(`/price-lists/${list.id}`, { method: "PUT", body });
      else await api("/price-lists", { body });
      onDone();
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? (err.issues?.[0]?.message ?? err.code) : "generic";
      const key = [`priceLists.errors.${code}`, `items.errors.${code}`].find((k) => t.has(k));
      setError(key ? t(key) : t("auth.errors.generic"));
    } finally {
      setBusy(false);
    }
  }

  const discounted = (itemId: string) => {
    const it = items.find((i) => i.id === itemId);
    return it?.saleRate ? String(Math.round(Number(it.saleRate) * (1 - Number(discount || 0) / 100) * 100) / 100) : "";
  };

  return (
    <Card>
      <form onSubmit={save} className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label={t("priceLists.name")} htmlFor="pl-name"><Input id="pl-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={60} /></Field>
          <Field label={t("priceLists.discountPct")} htmlFor="pl-disc" hint={t("priceLists.discountHint")}>
            <Input id="pl-disc" value={discount} onChange={(e) => setDiscount(e.target.value)} inputMode="decimal" maxLength={5} className="num" />
          </Field>
          {list ? <label className="flex items-center gap-2 self-end pb-2 text-sm"><input type="checkbox" checked={archived} onChange={(e) => setArchived(e.target.checked)} className="size-4 accent-[var(--primary)]" />{t("common.archived")}</label> : null}
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">{t("priceLists.fixedRates")}</p>
          {rows === null ? <p className="text-sm text-muted">…</p> : (
            <table className="w-full max-w-2xl text-sm">
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-1.5 pr-3">
                      <Select value={r.itemId} onChange={(e) => setRows((rs) => rs!.map((x, j) => (j === i ? { ...x, itemId: e.target.value } : x)))} aria-label={t("purchase.item")}>
                        <option value="">{t("purchase.chooseItem")}</option>
                        {sorted.map((it) => <option key={it.id} value={it.id}>{localName(it, locale)}</option>)}
                      </Select>
                    </td>
                    <td className="w-36 py-1.5 pr-3">
                      <Input value={r.rate} onChange={(e) => setRows((rs) => rs!.map((x, j) => (j === i ? { ...x, rate: e.target.value } : x)))} placeholder={discounted(r.itemId)} inputMode="decimal" className="num text-right" aria-label={t("purchase.rate")} />
                    </td>
                    <td className="w-10 py-1.5 text-right">
                      <button type="button" onClick={() => setRows((rs) => rs!.filter((_, j) => j !== i))} className="rounded-md p-2 text-muted hover:bg-surface-2 hover:text-danger" title={t("common.remove")}>
                        <Trash2 className="size-4" aria-hidden /><span className="sr-only">{t("common.remove")}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Button type="button" variant="ghost" className="-ml-3 mt-1" onClick={() => setRows((rs) => [...(rs ?? []), { itemId: "", rate: "" }])}><Plus className="size-4" aria-hidden />{t("priceLists.addRate")}</Button>
        </div>
        {error ? <Alert>{error}</Alert> : null}
        <div className="flex gap-3">
          <Button type="submit" disabled={busy || !name}>{t("common.save")}</Button>
          <Button type="button" variant="ghost" onClick={onDone}>{t("common.cancel")}</Button>
        </div>
      </form>
    </Card>
  );
}
