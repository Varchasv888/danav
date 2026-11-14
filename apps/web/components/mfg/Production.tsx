"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { localName, todayIso } from "@/lib/format";
import type { ItemOption } from "@/lib/masters";
import { CancelDocument } from "../CancelDocument";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

const NS = ["mfg.errors", "purchase.errors", "sj.errors"];
const sorted = (items: ItemOption[], locale: string) => [...items].filter((i) => i.kind === "goods" && !i.archived).sort((a, b) => localName(a, locale).localeCompare(localName(b, locale)));

export function ProductionOrderForm({ items, bomItemIds }: { items: ItemOption[]; bomItemIds: string[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const makeable = sorted(items, locale).filter((i) => bomItemIds.includes(i.id));
  const [itemId, setItemId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      const o = await api<{ id: string }>("/production-orders", {
        body: { itemId, qty: String(f.get("qty")), date: String(f.get("date")), notes: String(f.get("notes") || "") || undefined, release: f.get("release") === "on" },
      });
      router.push(`/manufacturing/orders/${o.id}`);
    } catch (err) {
      setError(errorText(t, err, NS));
      setBusy(false);
    }
  }
  return (
    <Card>
      <form onSubmit={save} className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <Field label={t("mfg.orders.item")} htmlFor="po-item">
            <Select id="po-item" value={itemId} onChange={(e) => setItemId(e.target.value)} required>
              <option value="">-</option>
              {makeable.map((i) => <option key={i.id} value={i.id}>{localName(i, locale)}</option>)}
            </Select>
          </Field>
        </div>
        <Field label={t("mfg.orders.qty")} htmlFor="po-qty" hint={items.find((i) => i.id === itemId)?.uom}><Input id="po-qty" name="qty" required inputMode="decimal" className="num" /></Field>
        <Field label={t("mfg.orders.date")} htmlFor="po-date"><Input id="po-date" name="date" type="date" defaultValue={todayIso()} required /></Field>
        <div className="md:col-span-4"><Field label={t("mfg.boms.notes")} htmlFor="po-notes"><Input id="po-notes" name="notes" maxLength={300} /></Field></div>
        <label className="flex items-center gap-2 text-sm md:col-span-4"><input type="checkbox" name="release" defaultChecked className="size-4 accent-[var(--primary)]" />{t("mfg.orders.releaseNow")}</label>
        {error ? <div className="md:col-span-4"><Alert>{error}</Alert></div> : null}
        <div className="md:col-span-4"><Button type="submit" disabled={busy || !itemId}>{t("mfg.orders.save")}</Button></div>
      </form>
    </Card>
  );
}

/** Release, record output, issue extra material and cancel, for one production order. */
export function ProductionActions({ id, status, remaining, uom, items, canCancel }: { id: string; status: string; remaining: string; uom: string; items: ItemOption[]; canCancel: boolean }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [mode, setMode] = useState<"complete" | "issue" | null>(null);
  const [lines, setLines] = useState([{ key: 1, itemId: "", qty: "" }]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const call = async (path: string, body: unknown) => {
    setBusy(true);
    setError(null);
    try {
      await api(`/production-orders/${id}/${path}`, { body });
      setMode(null);
      setLines([{ key: 1, itemId: "", qty: "" }]);
      router.refresh();
    } catch (err) { setError(errorText(t, err, NS)); } finally { setBusy(false); }
  };

  if (status === "completed" || status === "cancelled") return null;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        {status === "planned" ? <Button onClick={() => call("release", {})} disabled={busy}>{t("mfg.orders.release")}</Button> : null}
        {status === "released" ? (
          <>
            <Button onClick={() => setMode("complete")}>{t("mfg.orders.complete")}</Button>
            <Button variant="outline" onClick={() => setMode("issue")}>{t("mfg.orders.issue")}</Button>
          </>
        ) : null}
      </div>
      {mode === "complete" ? (
        <Card>
          <form className="grid gap-4 md:grid-cols-4" onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            void call("complete", { date: f.get("date"), goodQty: f.get("goodQty"), rejectedQty: f.get("rejectedQty") || undefined, close: f.get("close") === "on", notes: f.get("notes") || undefined });
          }}>
            <Field label={t("mfg.orders.date")} htmlFor="pc-date"><Input id="pc-date" name="date" type="date" defaultValue={todayIso()} required /></Field>
            <Field label={t("mfg.orders.goodQty")} htmlFor="pc-good" hint={uom}><Input id="pc-good" name="goodQty" defaultValue={Number(remaining) > 0 ? Number(remaining) : ""} required inputMode="decimal" className="num" autoFocus /></Field>
            <Field label={t("mfg.orders.rejectedQty")} htmlFor="pc-rej"><Input id="pc-rej" name="rejectedQty" inputMode="decimal" className="num" /></Field>
            <Field label={t("mfg.boms.notes")} htmlFor="pc-notes"><Input id="pc-notes" name="notes" maxLength={300} /></Field>
            <label className="flex items-center gap-2 text-sm md:col-span-4"><input type="checkbox" name="close" className="size-4 accent-[var(--primary)]" />{t("mfg.orders.close")}</label>
            <div className="flex gap-3 md:col-span-4">
              <Button type="submit" disabled={busy}>{t("mfg.orders.complete")}</Button>
              <Button type="button" variant="ghost" onClick={() => setMode(null)}>{t("common.cancel")}</Button>
            </div>
          </form>
        </Card>
      ) : null}
      {mode === "issue" ? (
        <Card>
          <form className="flex flex-col gap-3" onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            void call("issue", { date: f.get("date"), lines: lines.filter((l) => l.itemId && l.qty).map(({ itemId, qty }) => ({ itemId, qty })) });
          }}>
            <div className="w-48"><Field label={t("mfg.orders.date")} htmlFor="pi-date"><Input id="pi-date" name="date" type="date" defaultValue={todayIso()} required /></Field></div>
            {lines.map((l) => (
              <div key={l.key} className="grid items-end gap-3 md:grid-cols-[1fr_160px_auto]">
                <Select value={l.itemId} onChange={(e) => setLines(lines.map((x) => (x.key === l.key ? { ...x, itemId: e.target.value } : x)))} aria-label={t("mfg.boms.component")}>
                  <option value="">-</option>
                  {sorted(items, locale).map((i) => <option key={i.id} value={i.id}>{localName(i, locale)} ({Number(i.stockQty).toLocaleString("en-IN")} {i.uom})</option>)}
                </Select>
                <Input value={l.qty} onChange={(e) => setLines(lines.map((x) => (x.key === l.key ? { ...x, qty: e.target.value } : x)))} inputMode="decimal" className="num text-right" aria-label={t("mfg.boms.qty")} />
                {lines.length > 1 ? <button type="button" onClick={() => setLines(lines.filter((x) => x.key !== l.key))} className="rounded-md p-2 text-muted hover:text-danger" title={t("common.remove")}><Trash2 className="size-4" aria-hidden /></button> : <span />}
              </div>
            ))}
            <div className="flex gap-3">
              <Button type="button" variant="ghost" className="-ml-3" onClick={() => setLines([...lines, { key: Math.max(...lines.map((x) => x.key)) + 1, itemId: "", qty: "" }])}><Plus className="size-4" aria-hidden />{t("mfg.boms.addLine")}</Button>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={busy}>{t("mfg.orders.issue")}</Button>
              <Button type="button" variant="ghost" onClick={() => setMode(null)}>{t("common.cancel")}</Button>
            </div>
          </form>
        </Card>
      ) : null}
      {error ? <Alert>{error}</Alert> : null}
      {canCancel ? <CancelDocument path={`/production-orders/${id}/cancel`} label={t("mfg.orders.cancel")} /> : null}
    </div>
  );
}
