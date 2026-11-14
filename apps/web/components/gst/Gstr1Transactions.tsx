"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui";
import { rupees } from "@/lib/format";
import type { Gstr1Json } from "@/lib/gstr1-offline";

interface TransactionRow {
  id: string;
  section: string;
  document: string;
  date: string;
  partyOrPlace: string;
  amount: number;
}

type Summary = Record<"B2B" | "B2CL" | "B2CS" | "EXP" | "creditNotes", { count: number; taxable: string; tax: string }> & { cancelledInvoices: number };

function rowsFromReturn(data: Gstr1Json): TransactionRow[] {
  const rows: TransactionRow[] = [];
  for (const group of data.b2b ?? []) for (const doc of group.inv) rows.push({ id: `b2b-${group.ctin}-${doc.inum ?? rows.length}`, section: "B2B", document: doc.inum ?? "-", date: doc.idt ?? "-", partyOrPlace: group.ctin, amount: doc.val });
  for (const group of data.b2cl ?? []) for (const doc of group.inv) rows.push({ id: `b2cl-${group.pos}-${doc.inum ?? rows.length}`, section: "B2CL", document: doc.inum ?? "-", date: doc.idt ?? "-", partyOrPlace: group.pos, amount: doc.val });
  for (const [index, record] of (data.b2cs ?? []).entries()) rows.push({ id: `b2cs-${index}`, section: "B2CS", document: "Consolidated supply", date: "-", partyOrPlace: record.pos, amount: record.txval });
  for (const group of data.exp ?? []) for (const doc of group.inv) rows.push({ id: `exp-${group.exp_typ}-${doc.inum ?? rows.length}`, section: "Export", document: doc.inum ?? "-", date: doc.idt ?? "-", partyOrPlace: group.exp_typ, amount: doc.val });
  for (const group of data.cdnr ?? []) for (const note of group.nt) rows.push({ id: `cdnr-${group.ctin}-${note.nt_num ?? rows.length}`, section: "Credit/debit note", document: note.nt_num ?? "-", date: note.nt_dt ?? "-", partyOrPlace: group.ctin, amount: note.val });
  for (const [index, note] of (data.cdnur ?? []).entries()) rows.push({ id: `cdnur-${note.nt_num ?? index}`, section: "Unregistered note", document: note.nt_num ?? "-", date: note.nt_dt ?? "-", partyOrPlace: note.pos ?? "-", amount: note.val });
  return rows;
}

export function Gstr1Transactions({ data, summary, labels }: { data: Gstr1Json; summary: Summary; labels: { section: string; count: string; taxable: string; tax: string; cancelled: string } }) {
  const [view, setView] = useState<"summary" | "transactions">("summary");
  const [category, setCategory] = useState("All sections");
  const [query, setQuery] = useState("");
  const rows = useMemo(() => rowsFromReturn(data), [data]);
  const categories = ["All sections", ...new Set(rows.map((row) => row.section))];
  const visible = rows.filter((row) => {
    const matchesCategory = category === "All sections" || row.section === category;
    const search = query.trim().toLowerCase();
    const matchesQuery = !search || [row.section, row.document, row.date, row.partyOrPlace].some((value) => value.toLowerCase().includes(search));
    return matchesCategory && matchesQuery;
  });

  return (
    <section aria-labelledby="gstr1-transactions-title" className="border-t border-border">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div>
          <h3 id="gstr1-transactions-title" className="font-semibold">GSTR-1 details</h3>
          <p className="text-xs text-muted">Switch between return totals and the source documents.</p>
        </div>
        <div role="group" aria-label="GSTR-1 view" className="flex rounded-lg border border-border bg-surface-2 p-1">
          {(["summary", "transactions"] as const).map((mode) => (
            <button key={mode} type="button" aria-pressed={view === mode} onClick={() => setView(mode)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize ${view === mode ? "bg-surface text-primary shadow-raised" : "text-muted hover:text-text"}`}>
              {mode === "summary" ? "Summary" : "Transactions"}
            </button>
          ))}
        </div>
      </div>
      {view === "summary" ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-surface-2/80 text-left text-xs font-semibold text-muted"><tr className="border-y border-border"><th className="px-4 py-2.5">{labels.section}</th><th className="px-4 py-2.5 text-right">{labels.count}</th><th className="px-4 py-2.5 text-right">{labels.taxable}</th><th className="px-4 py-2.5 text-right">{labels.tax}</th></tr></thead>
            <tbody>
              {([ ["B2B", "B2B"], ["B2CL", "B2CL"], ["B2CS", "B2CS"], ["EXP", "EXP"], ["creditNotes", "Credit and debit notes"] ] as const).map(([key, name]) => (
                <tr key={key} className="border-b border-rule hover:bg-surface-2/50"><td className="px-4 py-2.5 font-medium">{name}</td><td className="num px-4 py-2.5 text-right">{summary[key].count}</td><td className="num px-4 py-2.5 text-right">{rupees(summary[key].taxable)}</td><td className="num px-4 py-2.5 text-right">{rupees(summary[key].tax)}</td></tr>
              ))}
              <tr><td colSpan={4} className="px-4 py-2 text-xs text-muted">{labels.cancelled}: {summary.cancelledInvoices}</td></tr>
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-3">
            <div className="flex gap-2 overflow-x-auto" aria-label="Filter by GSTR-1 section">
        {categories.map((item) => (
          <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item}
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${category === item ? "border-primary bg-primary-soft text-primary" : "border-border bg-surface text-muted hover:border-primary/40"}`}>
            {item}{item === "All sections" ? ` (${rows.length})` : ` (${rows.filter((row) => row.section === item).length})`}
          </button>
        ))}
            </div>
            <Input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full sm:w-64" placeholder="Search document or party" aria-label="Search GSTR-1 transactions" />
          </div>
      <div className="max-h-[28rem] overflow-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="sticky top-0 z-10 bg-surface-2/95 text-left text-xs font-semibold text-muted backdrop-blur">
            <tr className="border-y border-border">
              <th className="px-4 py-2.5">Section</th><th className="px-4 py-2.5">Document</th><th className="px-4 py-2.5">Date</th><th className="px-4 py-2.5">GSTIN / place</th><th className="px-4 py-2.5 text-right">Invoice / taxable amount</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id} className="border-b border-rule last:border-0 hover:bg-surface-2/50">
                <td className="px-4 py-2.5"><span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">{row.section}</span></td>
                <td className="px-4 py-2.5 font-medium">{row.document}</td><td className="px-4 py-2.5 text-muted">{row.date}</td><td className="px-4 py-2.5 font-mono text-xs">{row.partyOrPlace}</td>
                <td className="num whitespace-nowrap px-4 py-2.5 text-right">{rupees(row.amount)}</td>
              </tr>
            ))}
            {!visible.length ? <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted">No GSTR-1 transactions match this view.</td></tr> : null}
          </tbody>
          {visible.length ? <tfoot className="sticky bottom-0 bg-surface text-sm font-semibold"><tr className="border-t border-border-strong"><td colSpan={5} className="px-4 py-2.5">Showing {visible.length} rows</td></tr></tfoot> : null}
        </table>
      </div>
        </>
      )}
    </section>
  );
}
