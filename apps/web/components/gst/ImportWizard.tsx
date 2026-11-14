"use client";

import clsx from "clsx";
import { Download, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { Alert, Button, Card } from "../ui";

type Kind = "parties" | "items" | "opening" | "tally";
interface RowResult { row: number; name: string; status: "create" | "update" | "exists" | "error"; error?: string }

import { parseCsv, toRecords } from "@/lib/import-csv";
export { parseCsv } from "@/lib/import-csv";
const SAMPLES = {
  opening: "name,debit,credit\nSharma Stores,12500,\nGupta Suppliers,,8000\nCash,4500,\n",
  parties: "name,type,gstin,state_code,phone,email,opening_balance,credit_days,address,city,pincode\nSharma Stores,customer,27AAPFU0939F1ZV,,9876543210,,12500,30,12 Market Road,Pune,411001\nGupta Suppliers,supplier,,09,,,8000,,,,\n",
  items: "SKU,Brand,Product_Name,Size,Finish,UOM,Quantity,purchase_rate,sale_rate,opening_rate,gst_rate\nVAL-MAX-GOLD-4X2,Valenza,Max Gold,4x2,Glossy,Box,110,,,,\n",
};


export function ImportWizard() {
  const t = useTranslations();
  const [kind, setKind] = useState<Kind>("items");
  const [payload, setPayload] = useState<unknown>(null);
  const [results, setResults] = useState<RowResult[] | null>(null);
  const [done, setDone] = useState(false);
  const [totals, setTotals] = useState<{ debit: string; credit: string; difference: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const reset = (k: Kind) => { setKind(k); setPayload(null); setResults(null); setTotals(null); setDone(false); setError(null); };

  async function send(dryRun: boolean, body = payload) {
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ results?: RowResult[]; ledgers?: RowResult[]; items?: RowResult[]; totals?: { debit: string; credit: string; difference: string } }>(`/import/${kind}`, { body: { ...(body as object), dryRun } });
      setResults(r.results ?? [...(r.ledgers ?? []), ...(r.items ?? [])]);
      setTotals(r.totals ?? null);
      if (!dryRun) setDone(true);
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "generic";
      setError(code === "validation" ? t("auth.errors.validation") : t.has(`import.${code}`) ? t(`import.${code}`) : code);
    } finally {
      setBusy(false);
    }
  }

  async function onFile(file: File) {
    setResults(null);
    setTotals(null);
    setPayload(null);
    setError(null);
    try {
    const text = await file.text();
    const body = kind === "tally" ? { xml: text } : { rows: toRecords(kind, parseCsv(text)) };
    if ("rows" in body && (!body.rows?.length || body.rows.some((r) => !r.name))) {
      setError("The CSV must contain data rows and a name column (Product_Name is also accepted for items).");
      return;
    }
    setPayload(body);
    setDone(false);
    await send(true, body);
    } catch {
      setError("Could not read this file. Please choose a valid CSV or Tally XML file.");
    }
  }

  const creatable = results?.filter((r) => r.status === "create" || r.status === "update").length ?? 0;
  const blocked = !!results?.some((r) => r.status === "error") && kind === "opening";
  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <div role="tablist" className="flex flex-wrap gap-2">
        {(["parties", "items", "opening", "tally"] as const).map((k) => (
          <button key={k} type="button" role="tab" aria-selected={kind === k} onClick={() => reset(k)}
            className={clsx("rounded-lg border px-4 py-2 text-sm font-medium", kind === k ? "border-primary bg-primary-soft text-primary" : "border-border bg-surface hover:bg-surface-2")}>
            {t(`import.${k}`)}
          </button>
        ))}
      </div>
      <Card>
        {kind === "items" ? <p className="mb-4 text-sm text-muted">Inventory CSV columns Product_Name, UOM and Quantity are supported. Quantity becomes opening stock. Brand and Size are included in the product name; Brand, SKU, Size and Finish are also saved separately. All quantities and prices are per box. Missing prices and opening values default to 0; missing GST rates default to 18%. Review your tax rates and stock valuation before importing.</p> : null}
        {kind === "tally" ? <p className="mb-4 text-sm text-muted">{t("import.tallyHint")}</p> : (
          <button type="button" className="mb-4 inline-flex items-center gap-2 text-sm text-primary hover:underline" onClick={() => {
            const url = URL.createObjectURL(new Blob([SAMPLES[kind]], { type: "text/csv" }));
            Object.assign(document.createElement("a"), { href: url, download: `varchasv-${kind}.csv` }).click();
            URL.revokeObjectURL(url);
          }}>
            <Download className="size-4" aria-hidden />{t("import.template")}
          </button>
        )}
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-8 text-sm text-muted hover:bg-surface-2">
          <Upload className="size-5" aria-hidden />{t("import.choose")}
          <input type="file" accept={kind === "tally" ? ".xml" : ".csv"} className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }} />
        </label>
      </Card>
      {error ? <Alert>{error}</Alert> : null}
      {results ? (
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm">{done ? <span className="text-success">{t("import.done")}</span> : null}</span>
            {!done && creatable ? <Button disabled={busy || blocked} onClick={() => send(false)}>{t("import.commit", { count: creatable })}</Button> : null}
          </div>
          {totals ? <p className={clsx("border-b border-border px-4 py-2 text-sm", Number(totals.difference) === 0 ? "text-success" : "text-danger")}>{t("import.controlTotals", { debit: totals.debit, credit: totals.credit })} {Number(totals.difference) === 0 ? t("import.balanced") : t("import.difference", { amount: totals.difference })}</p> : null}
          <div className="max-h-[480px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-surface text-left text-muted">
                <tr className="border-b border-border">
                  <th className="px-4 py-2 font-medium">{t("import.row")}</th>
                  <th className="px-4 py-2 font-medium">{t("accounts.name")}</th>
                  <th className="px-4 py-2 font-medium">{t("import.status")}</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={`${r.row}-${i}`} className="border-b border-border last:border-0">
                    <td className="num px-4 py-1.5">{r.row}</td>
                    <td className="px-4 py-1.5">{r.name}</td>
                    <td className={clsx("px-4 py-1.5", r.status === "error" ? "text-danger" : r.status === "exists" ? "text-muted" : "text-success")}>
                      {r.status === "error"
                        ? ([`auth.errors.${r.error}`, `items.errors.${r.error}`, `accounts.errors.${r.error}`].find((k) => t.has(k)) ? t([`auth.errors.${r.error}`, `items.errors.${r.error}`, `accounts.errors.${r.error}`].find((k) => t.has(k))!) : r.error)
                        : t(`import.${r.status}`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
