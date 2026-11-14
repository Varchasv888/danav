"use client";

import clsx from "clsx";
import { Download, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { Alert, Button, Card } from "../ui";

type Kind = "parties" | "items" | "opening" | "tally";
interface RowResult { row: number; name: string; status: "create" | "update" | "exists" | "error"; error?: string }

/** RFC 4180 CSV: quoted fields, doubled quotes, commas and newlines inside quotes, CRLF. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const src = text.replace(/^﻿/, ""); // Excel adds a byte-order mark
  for (let i = 0; i < src.length; i++) {
    const ch = src[i]!;
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((c) => c.trim())) rows.push(row);
      row = [];
    } else field += ch;
  }
  row.push(field);
  if (row.some((c) => c.trim())) rows.push(row);
  return rows;
}

const COLUMNS: Record<"parties" | "items" | "opening", { header: string; key: string }[]> = {
  opening: [{ header: "name", key: "name" }, { header: "debit", key: "debit" }, { header: "credit", key: "credit" }],
  parties: [
    { header: "name", key: "name" }, { header: "type", key: "type" }, { header: "gstin", key: "gstin" }, { header: "state_code", key: "stateCode" },
    { header: "phone", key: "phone" }, { header: "email", key: "email" }, { header: "opening_balance", key: "openingBalance" }, { header: "credit_days", key: "creditDays" },
    { header: "address", key: "address" }, { header: "city", key: "city" }, { header: "pincode", key: "pincode" },
  ],
  items: [
    { header: "name", key: "name" }, { header: "hsn", key: "hsn" }, { header: "gst_rate", key: "gstRate" }, { header: "unit", key: "unit" }, { header: "kind", key: "kind" },
    { header: "purchase_rate", key: "purchaseRate" }, { header: "sale_rate", key: "saleRate" }, { header: "opening_qty", key: "openingQty" }, { header: "opening_rate", key: "openingRate" },
  ],
};
const SAMPLES = {
  opening: "name,debit,credit\nSharma Stores,12500,\nGupta Suppliers,,8000\nCash,4500,\n",
  parties: "name,type,gstin,state_code,phone,email,opening_balance,credit_days,address,city,pincode\nSharma Stores,customer,27AAPFU0939F1ZV,,9876543210,,12500,30,12 Market Road,Pune,411001\nGupta Suppliers,supplier,,09,,,8000,,,,\n",
  items: "name,hsn,gst_rate,unit,kind,purchase_rate,sale_rate,opening_qty,opening_rate\nBasmati Rice 5kg,1006,5,bag,goods,420,520,40,400\nDelivery charges,996812,18,,service,,50,,\n",
};

/** Turns CSV rows into objects using the header row (case- and space-insensitive). */
function toRecords(kind: "parties" | "items" | "opening", rows: string[][]) {
  const [header, ...body] = rows;
  if (!header) return [];
  const norm = header.map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  return body.map((r) => {
    const rec: Record<string, string> = {};
    for (const col of COLUMNS[kind]) {
      const idx = norm.indexOf(col.header);
      const v = idx >= 0 ? (r[idx] ?? "").trim() : "";
      if (v) rec[col.key] = kind === "parties" && col.key === "type" ? v.toLowerCase() : kind === "items" && col.key === "kind" ? v.toLowerCase() : v;
    }
    return rec;
  });
}

export function ImportWizard() {
  const t = useTranslations();
  const [kind, setKind] = useState<Kind>("parties");
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
    const text = await file.text();
    const body = kind === "tally" ? { xml: text } : { rows: toRecords(kind, parseCsv(text)) };
    setPayload(body);
    setDone(false);
    await send(true, body);
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
