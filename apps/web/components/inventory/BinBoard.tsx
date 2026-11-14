"use client";

import { Archive } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export interface BinData {
  warehouse: { id: string; name: string };
  bins: { id: string; code: string; note: string | null; items: { itemId: string; item: string; qty: string }[] }[];
  unplaced: { itemId: string; item: string; qty: string }[];
  drift: { itemId: string; item: string; assigned: string; inStock: string; over: string }[];
}
const q = (v: string) => Number(v).toLocaleString("en-IN", { maximumFractionDigits: 3 });

/** Where pieces sit in one godown: the bins and what is in each, stock not yet put in a bin, and anything shelved beyond the stock. */
export function BinBoard({ data, canEdit }: { data: BinData; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moving, setMoving] = useState<{ binId: string; itemId: string } | null>(null);

  async function call(path: string, body: Record<string, unknown>) {
    setBusy(true); setError(null);
    try { await api(path, { body }); router.refresh(); return true; } catch (err) { setError(errorText(t, err, ["bins.errors"])); return false; } finally { setBusy(false); }
  }
  const field = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      {data.drift.length ? (
        <Card className="border-danger/40 bg-danger-soft">
          <h2 className="font-semibold text-danger">{t("bins.driftTitle")}</h2>
          <ul className="mt-1 text-sm">{data.drift.map((d) => <li key={d.itemId}>{t("bins.driftOne", { item: d.item, assigned: q(d.assigned), stock: q(d.inStock) })}</li>)}</ul>
        </Card>
      ) : null}
      {canEdit ? (
        <Card>
          <div className="grid gap-4 lg:grid-cols-2">
            <form className="flex flex-wrap items-end gap-3" onSubmit={async (e) => { e.preventDefault(); const f = new FormData(e.currentTarget); const form = e.currentTarget; if (await call("/bins", { warehouseId: data.warehouse.id, code: field(f, "code"), ...(field(f, "note") ? { note: field(f, "note") } : {}) })) form.reset(); }}>
              <Field label={t("bins.code")} htmlFor="bin-code" hint={t("bins.codeHint")}><Input id="bin-code" name="code" required maxLength={20} className="w-36 uppercase" /></Field>
              <Field label={t("bins.note")} htmlFor="bin-note"><Input id="bin-note" name="note" maxLength={80} className="w-48" /></Field>
              <Button type="submit" disabled={busy}>{t("bins.add")}</Button>
            </form>
            <form className="flex flex-wrap items-end gap-3" onSubmit={async (e) => { e.preventDefault(); const f = new FormData(e.currentTarget); const form = e.currentTarget; if (await call("/bins/put-away", { binId: field(f, "binId"), itemId: field(f, "itemId"), qty: field(f, "qty") })) form.reset(); }}>
              <Field label={t("bins.bin")} htmlFor="pa-bin"><Select id="pa-bin" name="binId" required defaultValue=""><option value="" disabled>-</option>{data.bins.map((b) => <option key={b.id} value={b.id}>{b.code}</option>)}</Select></Field>
              <Field label={t("bins.item")} htmlFor="pa-item"><Select id="pa-item" name="itemId" required defaultValue=""><option value="" disabled>-</option>{data.unplaced.map((u) => <option key={u.itemId} value={u.itemId}>{u.item} ({q(u.qty)})</option>)}</Select></Field>
              <Field label={t("bins.qty")} htmlFor="pa-qty"><Input id="pa-qty" name="qty" inputMode="decimal" required className="num w-24" /></Field>
              <Button type="submit" variant="outline" disabled={busy || !data.bins.length || !data.unplaced.length}>{t("bins.putAway")}</Button>
            </form>
          </div>
        </Card>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {data.bins.map((b) => (
          <Card key={b.id} className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div><h2 className="font-mono text-base font-semibold">{b.code}</h2>{b.note ? <p className="text-xs text-muted">{b.note}</p> : null}</div>
              {canEdit && !b.items.length ? (
                <button type="button" onClick={() => void call(`/bins/${b.id}/archive`, {})} disabled={busy} aria-label={`${t("bins.archive")} ${b.code}`} className="grid size-8 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-text focus-visible:outline-2 focus-visible:outline-primary"><Archive className="size-4" aria-hidden /></button>
              ) : null}
            </div>
            {b.items.length ? (
              <ul className="flex flex-col text-sm">
                {b.items.map((i) => (
                  <li key={i.itemId} className="border-t border-rule py-1.5 first:border-0">
                    <div className="flex items-center justify-between gap-2"><span className="min-w-0 truncate">{i.item}</span><span className="num font-medium">{q(i.qty)}</span></div>
                    {canEdit && data.bins.length > 1 ? (
                      moving?.binId === b.id && moving.itemId === i.itemId ? (
                        <form className="mt-1 flex flex-wrap items-center gap-2" onSubmit={async (e) => { e.preventDefault(); const f = new FormData(e.currentTarget); if (await call("/bins/move", { fromBinId: b.id, toBinId: field(f, "to"), itemId: i.itemId, qty: field(f, "qty") })) setMoving(null); }}>
                          <Select name="to" required defaultValue="" aria-label={t("bins.moveTo")} className="h-8 w-28"><option value="" disabled>{t("bins.moveTo")}</option>{data.bins.filter((x) => x.id !== b.id).map((x) => <option key={x.id} value={x.id}>{x.code}</option>)}</Select>
                          <Input name="qty" inputMode="decimal" required defaultValue={String(Number(i.qty))} aria-label={t("bins.qty")} className="num h-8 w-20" />
                          <Button type="submit" variant="outline" className="h-8" disabled={busy}>{t("bins.move")}</Button>
                          <Button type="button" variant="ghost" className="h-8" onClick={() => setMoving(null)}>{t("common.cancel")}</Button>
                        </form>
                      ) : <button type="button" onClick={() => setMoving({ binId: b.id, itemId: i.itemId })} className="text-xs text-primary hover:underline">{t("bins.move")}</button>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted">{t("bins.empty")}</p>}
          </Card>
        ))}
        {!data.bins.length ? <p className="text-sm text-muted">{t("bins.none")}</p> : null}
      </div>
      <Card>
        <h2 className="font-semibold">{t("bins.unplacedTitle")}</h2>
        {data.unplaced.length ? (
          <ul className="mt-2 grid gap-x-6 text-sm sm:grid-cols-2">{data.unplaced.map((u) => <li key={u.itemId} className="flex justify-between border-b border-rule py-1.5"><span className="truncate">{u.item}</span><span className="num">{q(u.qty)}</span></li>)}</ul>
        ) : <p className="mt-1 text-sm text-muted">{t("bins.allPlaced")}</p>}
      </Card>
    </div>
  );
}
