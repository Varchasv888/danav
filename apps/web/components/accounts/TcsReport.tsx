"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { api } from "@/lib/client-api";
import { rupees } from "@/lib/format";
import { Alert, Button, Card, Field, Select } from "../ui";

interface TcsReturn {
  fy: string;
  quarter: number;
  from: string;
  to: string;
  tan: string | null;
  collector: string;
  challans: { id: string; paidOn: string; amount: string; bsrCode: string; challanSerial: string }[];
  collectees: { name: string; pan: string | null; section: string; date: string; amount: string; rate: string; tcs: string; bsrCode: string | null; challanSerial: string | null; depositedOn: string | null }[];
  totals: { collected: string; deposited: string };
  warnings: { code: string; detail: string }[];
  files: { collectees: { filename: string; content: string }; challans: { filename: string; content: string } };
}

function saveCsv(file: { filename: string; content: string }) {
  const url = URL.createObjectURL(new Blob([file.content], { type: "text/csv" }));
  Object.assign(document.createElement("a"), { href: url, download: file.filename }).click();
  URL.revokeObjectURL(url);
}

function warningText(warning: { code: string; detail: string }) {
  if (warning.code === "tan_missing") return "Collector TAN is missing from company payroll settings.";
  if (warning.code === "pan_missing") return `PAN is missing for ${warning.detail}.`;
  if (warning.code === "deposit_mismatch") return `Collected and deposited totals differ (${warning.detail}).`;
  return warning.detail || warning.code;
}

export function TcsReport({ initial }: { initial: TcsReturn }) {
  const [fy, setFy] = useState(initial.fy);
  const [quarter, setQuarter] = useState(initial.quarter);
  const [report, setReport] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const startYear = Number(initial.fy.slice(0, 4));
  const years = Array.from({ length: 6 }, (_, offset) => {
    const year = startYear - offset;
    return `${year}-${String(year + 1).slice(-2)}`;
  });

  useEffect(() => {
    let live = true;
    setBusy(true);
    setError("");
    api<TcsReturn>(`/tcs/27eq?fy=${fy}&quarter=${quarter}`)
      .then((next) => { if (live) setReport(next); })
      .catch(() => { if (live) setError("The TCS report could not be loaded. Please try again."); })
      .finally(() => { if (live) setBusy(false); });
    return () => { live = false; };
  }, [fy, quarter]);

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      <div className="flex flex-wrap items-end gap-3 print:hidden">
        <Field label="Financial year" htmlFor="tcs-report-fy">
          <Select id="tcs-report-fy" value={fy} disabled={busy} onChange={(event) => setFy(event.target.value)} className="w-36">
            {years.map((year) => <option key={year} value={year}>{year}</option>)}
          </Select>
        </Field>
        <Field label="Quarter" htmlFor="tcs-report-quarter">
          <Select id="tcs-report-quarter" value={String(quarter)} disabled={busy} onChange={(event) => setQuarter(Number(event.target.value))} className="w-28">
            {[1, 2, 3, 4].map((value) => <option key={value} value={value}>Q{value}</option>)}
          </Select>
        </Field>
        <Button variant="outline" disabled={busy} onClick={() => window.print()}>Print</Button>
      </div>
      <p className="text-sm text-muted">Form 27EQ · {report.collector} · {report.from} to {report.to} · TAN {report.tan || "not recorded"}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-border bg-surface p-3"><div className="text-xs text-muted">Collected</div><div className="num mt-1 text-2xl font-semibold">{rupees(report.totals.collected)}</div></div>
        <div className="rounded-md border border-border bg-surface p-3"><div className="text-xs text-muted">Deposited through challans</div><div className="num mt-1 text-2xl font-semibold">{rupees(report.totals.deposited)}</div></div>
      </div>
      {report.warnings.length ? (
        <Card className="border-warning/40 bg-warning-soft">
          <h2 className="mb-2 font-semibold">Review before filing</h2>
          <ul className="list-inside list-disc space-y-1 text-sm">{report.warnings.map((warning, index) => <li key={`${warning.code}-${index}`}>{warningText(warning)}</li>)}</ul>
        </Card>
      ) : <p role="status" className="rounded-md border border-success/30 bg-success-soft px-3 py-2 text-sm text-success">Collected and deposited totals match. No report warnings.</p>}

      <Card className="p-0">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
          <h2 className="font-semibold">Collections ({report.collectees.length})</h2>
          <Button variant="outline" disabled={!report.collectees.length} onClick={() => saveCsv(report.files.collectees)}><Download className="size-4" aria-hidden />Download collections CSV</Button>
        </div>
        {report.collectees.length ? (
          <ul className="divide-y divide-rule">
            {report.collectees.map((row, index) => (
              <li key={`${row.date}-${row.name}-${index}`} className="flex flex-wrap items-start gap-x-5 gap-y-1 px-4 py-3 text-sm">
                <div className="min-w-48 flex-1"><div className="font-medium">{row.name}</div><div className="text-xs text-muted">{row.date} · PAN {row.pan || "missing"} · {row.section}</div></div>
                <div className="text-xs text-muted">Base {rupees(row.amount)} · {row.rate}%</div>
                <div className="num font-semibold">TCS {rupees(row.tcs)}</div>
                {row.challanSerial ? <div className="text-xs text-muted">Deposited {row.depositedOn} · {row.bsrCode}/{row.challanSerial}</div> : <div className="text-xs text-warning">No challan linked</div>}
              </li>
            ))}
          </ul>
        ) : <p className="px-4 py-8 text-center text-sm text-muted">No TCS collections in this period.</p>}
      </Card>
      <Card className="p-0">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
          <h2 className="font-semibold">Challan deposits ({report.challans.length})</h2>
          <Button variant="outline" disabled={!report.challans.length} onClick={() => saveCsv(report.files.challans)}><Download className="size-4" aria-hidden />Download challans CSV</Button>
        </div>
        {report.challans.length ? (
          <ul className="divide-y divide-rule">
            {report.challans.map((row) => <li key={row.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm"><span>{row.paidOn}</span><span className="font-mono text-xs">{row.bsrCode}/{row.challanSerial}</span><span className="num ml-auto font-semibold">{rupees(row.amount)}</span></li>)}
          </ul>
        ) : <p className="px-4 py-8 text-center text-sm text-muted">No TCS challan deposits in this period.</p>}
      </Card>
    </div>
  );
}
