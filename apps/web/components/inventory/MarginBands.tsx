"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { bandFor, priceFromBand } from "@varchasv/domain";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Card, Field, Input } from "../ui";

interface Row { fromRate: string; markupPct: string; markdown1Pct: string; markdown2Pct: string }
const NS = ["bands.errors"];
const num = (v: string) => (/^\d*\.?\d{0,2}$/.test(v) ? v : null);

/** Mark-up by purchase rate: from each cost upward, the MRP and the two sale rates come off the band. Receipts fill them in from here. */
export function MarginBands({ initial, canEdit }: { initial: Row[]; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(initial.map((r) => ({ fromRate: String(Number(r.fromRate)), markupPct: String(Number(r.markupPct)), markdown1Pct: String(Number(r.markdown1Pct)), markdown2Pct: String(Number(r.markdown2Pct)) })));
  const [cost, setCost] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (i: number, k: keyof Row, v: string) => { const n = num(v); if (n !== null) setRows(rows.map((r, j) => (j === i ? { ...r, [k]: n } : r))); setSaved(false); };
  const valid = rows.filter((r) => r.fromRate !== "" && r.markupPct !== "");
  const band = cost && valid.length ? bandFor(valid.map((r) => ({ fromRate: r.fromRate, markupPct: r.markupPct, markdown1Pct: r.markdown1Pct || "0", markdown2Pct: r.markdown2Pct || "0" })), cost) : null;
  const price = band ? priceFromBand(band, cost) : null;

  async function save() {
    setBusy(true); setError(null);
    try { await api("/margin-bands", { method: "PUT", body: { bands: valid.map((r) => ({ fromRate: r.fromRate, markupPct: r.markupPct, markdown1Pct: r.markdown1Pct || "0", markdown2Pct: r.markdown2Pct || "0" })) } }); setSaved(true); router.refresh(); }
    catch (err) { setError(errorText(t, err, NS)); } finally { setBusy(false); }
  }

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      <Card className="p-4">
        <p className="mb-3 text-sm text-muted">{t("bands.help")}</p>
        <div className="flex flex-col gap-2">
          {rows.map((r, i) => (
            <div key={i} className="grid items-end gap-3 sm:grid-cols-[repeat(4,1fr)_auto]">
              <Field label={t("bands.from")}><Input inputMode="decimal" className="num" value={r.fromRate} onChange={(e) => set(i, "fromRate", e.target.value)} disabled={!canEdit} /></Field>
              <Field label={t("bands.markup")}><Input inputMode="decimal" className="num" value={r.markupPct} onChange={(e) => set(i, "markupPct", e.target.value)} disabled={!canEdit} /></Field>
              <Field label={t("bands.markdown1")}><Input inputMode="decimal" className="num" value={r.markdown1Pct} onChange={(e) => set(i, "markdown1Pct", e.target.value)} disabled={!canEdit} /></Field>
              <Field label={t("bands.markdown2")}><Input inputMode="decimal" className="num" value={r.markdown2Pct} onChange={(e) => set(i, "markdown2Pct", e.target.value)} disabled={!canEdit} /></Field>
              {canEdit ? <button type="button" aria-label={t("bands.remove")} onClick={() => setRows(rows.filter((_, j) => j !== i))} className="inline-flex size-9 items-center justify-center rounded-md text-muted hover:bg-surface-2"><Trash2 className="size-4" aria-hidden /></button> : null}
            </div>
          ))}
        </div>
        {canEdit ? (
          <div className="mt-3 flex gap-2">
            <Button type="button" variant="ghost" className="-ml-3" onClick={() => setRows([...rows, { fromRate: "", markupPct: "", markdown1Pct: "", markdown2Pct: "" }])}><Plus className="size-4" aria-hidden />{t("bands.add")}</Button>
            <Button type="button" disabled={busy} onClick={save}>{t("bands.save")}</Button>
            {saved ? <span className="self-center text-sm text-success" role="status">{t("bands.saved")}</span> : null}
          </div>
        ) : null}
      </Card>
      <Card className="p-4">
        <Field label={t("bands.tryCost")}><Input inputMode="decimal" className="num w-40" value={cost} onChange={(e) => { const n = num(e.target.value); if (n !== null) setCost(n); }} /></Field>
        {price ? <p className="mt-2 text-sm">{t("bands.result", { mrp: Number(price.mrp), sale1: Number(price.sale1), sale2: Number(price.sale2) })}</p> : cost ? <p className="mt-2 text-sm text-muted">{t("bands.noBand")}</p> : null}
      </Card>
    </div>
  );
}
