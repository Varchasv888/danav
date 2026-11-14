"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { todayIso } from "@/lib/format";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

interface Item { id: string; name: string; color: string | null; size: string | null; mrp: string | null; saleRate: string }
interface Past { id: string; number: string; date: string; reason: string; changes: { itemId: string; before: Record<string, unknown>; after: Record<string, unknown> }[] }
interface Row { itemId: string; name: string; color: string; size: string; mrp: string; saleRate: string }
const NS = ["relabel.errors"];
const blank = (): Row => ({ itemId: "", name: "", color: "", size: "", mrp: "", saleRate: "" });

/** Rename or re-price existing items on one voucher. Fill only what changes; the old values are kept and the barcodes stay. */
export function Relabel({ items, past }: { items: Item[]; past: Past[] }) {
  const t = useTranslations();
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([blank()]);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (i: number, patch: Partial<Row>) => setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null); setDone(null);
    try {
      const changes = rows.filter((r) => r.itemId).map((r) => {
        const it = items.find((x) => x.id === r.itemId)!;
        return {
          itemId: r.itemId, ...(r.name.trim() && r.name.trim() !== it.name ? { name: r.name.trim() } : {}), ...(r.color.trim() ? { color: r.color.trim() } : {}), ...(r.size.trim() ? { size: r.size.trim() } : {}),
          ...(r.mrp ? { mrp: r.mrp } : {}), ...(r.saleRate ? { saleRate: r.saleRate } : {}),
        };
      });
      const r = await api<{ number: string }>("/relabels", { body: { date: todayIso(), reason, changes } });
      setDone(r.number); setRows([blank()]); setReason(""); router.refresh();
    } catch (err) { setError(errorText(t, err, NS)); } finally { setBusy(false); }
  }

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      {done ? <p className="text-sm text-success" role="status">{t("relabel.done", { number: done })} <a href="/inventory/labels" className="underline">{t("relabel.printLabels")}</a></p> : null}
      <Card className="p-4">
        <p className="mb-3 text-sm text-muted">{t("relabel.help")}</p>
        <form onSubmit={submit} className="flex flex-col gap-3">
          {rows.map((r, i) => {
            const it = items.find((x) => x.id === r.itemId);
            return (
              <div key={i} className="grid items-end gap-2 sm:grid-cols-[2fr_repeat(5,1fr)_auto]">
                <Field label={t("relabel.item")}><Select value={r.itemId} onChange={(e) => set(i, { itemId: e.target.value })}><option value="">-</option>{items.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</Select></Field>
                <Field label={t("relabel.name")}><Input value={r.name} placeholder={it?.name ?? ""} onChange={(e) => set(i, { name: e.target.value })} /></Field>
                <Field label={t("relabel.colour")}><Input value={r.color} placeholder={it?.color ?? ""} onChange={(e) => set(i, { color: e.target.value })} /></Field>
                <Field label={t("relabel.size")}><Input value={r.size} placeholder={it?.size ?? ""} onChange={(e) => set(i, { size: e.target.value })} /></Field>
                <Field label={t("relabel.mrp")}><Input inputMode="decimal" className="num" value={r.mrp} placeholder={it?.mrp ? String(Number(it.mrp)) : ""} onChange={(e) => set(i, { mrp: e.target.value.replace(/[^\d.]/g, "") })} /></Field>
                <Field label={t("relabel.saleRate")}><Input inputMode="decimal" className="num" value={r.saleRate} placeholder={it ? String(Number(it.saleRate)) : ""} onChange={(e) => set(i, { saleRate: e.target.value.replace(/[^\d.]/g, "") })} /></Field>
                {rows.length > 1 ? <button type="button" aria-label={t("relabel.remove")} onClick={() => setRows(rows.filter((_, j) => j !== i))} className="inline-flex size-9 items-center justify-center rounded-md text-muted hover:bg-surface-2"><Trash2 className="size-4" aria-hidden /></button> : <span />}
              </div>
            );
          })}
          <Button type="button" variant="ghost" className="-ml-3 w-fit" onClick={() => setRows([...rows, blank()])}><Plus className="size-4" aria-hidden />{t("relabel.addItem")}</Button>
          <Field label={t("relabel.reason")}><Input value={reason} onChange={(e) => setReason(e.target.value)} maxLength={200} required minLength={3} /></Field>
          <div><Button type="submit" disabled={busy || !rows.some((r) => r.itemId)}>{t("relabel.save")}</Button></div>
        </form>
      </Card>
      {past.length ? (
        <Card className="p-0">
          <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("relabel.history")}</h2>
          <table className="w-full text-sm"><tbody>{past.map((p) => <tr key={p.id} className="border-b border-rule last:border-0"><td className="px-4 py-1.5 font-mono">{p.number}</td><td className="px-4 py-1.5">{p.date}</td><td className="px-4 py-1.5">{p.reason}</td><td className="num px-4 py-1.5 text-right text-muted">{t("relabel.items", { n: p.changes.length })}</td></tr>)}</tbody></table>
        </Card>
      ) : null}
    </div>
  );
}
