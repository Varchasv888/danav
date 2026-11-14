"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { rupees } from "@/lib/format";
import { Alert, Button, Card, Input, Select } from "../ui";

export interface SalesmanRow {
  employeeId: string; name: string; code: string; target: string | null; slabs: { from: string; rate: string }[];
  invoices: number; sales: string; returns: string; achieved: string; achievedPct: string | null; rate: string; commission: string;
}
type Draft = { key: number; employeeId: string; target: string; slabs: string };

let nextKey = 1;
const AMOUNT = /^\d+(\.\d{1,2})?$/;
/** Slabs typed as "0:1, 100:2" (from % of target : commission %). */
const SLABS = /^\s*(\d{1,3}(\.\d{1,2})?\s*:\s*\d{1,2}(\.\d{1,2})?\s*)(,\s*\d{1,3}(\.\d{1,2})?\s*:\s*\d{1,2}(\.\d{1,2})?\s*)*$/;
const slabText = (slabs: { from: string; rate: string }[]) => slabs.map((s) => `${Number(s.from)}:${Number(s.rate)}`).join(", ");
const parseSlabs = (text: string) => (text.trim() ? text.split(",").map((p) => { const [from, rate] = p.split(":").map((x) => x.trim()); return { from: from!, rate: rate! }; }) : []);
const shiftMonth = (month: string, by: number) => {
  const [y, m] = month.split("-").map(Number) as [number, number];
  const d = new Date(Date.UTC(y, m - 1 + by, 1));
  return d.toISOString().slice(0, 7);
};

/** A month's targets and slabs per salesman, with what each one sold and earned. */
export function SalesTargets({ month, rows, total, salesmen, canEdit }: { month: string; rows: SalesmanRow[]; total: string; salesmen: { id: string; name: string; code: string }[]; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const fromRows = (rs: SalesmanRow[]) => rs.filter((r) => r.target).map((r) => ({ key: nextKey++, employeeId: r.employeeId, target: String(Number(r.target)), slabs: slabText(r.slabs) }));
  const [drafts, setDrafts] = useState<Draft[]>(() => fromRows(rows));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const update = (key: number, patch: Partial<Draft>) => setDrafts((ds) => ds.map((d) => (d.key === key ? { ...d, ...patch } : d)));

  async function copyLastMonth() {
    const prev = await api<{ rows: SalesmanRow[] }>(`/reports/salesman?month=${shiftMonth(month, -1)}`);
    setDrafts(fromRows(prev.rows));
  }
  async function save() {
    const bad = drafts.find((d) => !d.employeeId || !AMOUNT.test(d.target) || (d.slabs.trim() && !SLABS.test(d.slabs)));
    if (bad) { setError(t("targets.errors.invalid")); return; }
    setBusy(true);
    setError(null);
    try {
      await api(`/sales-targets/${month}`, { method: "PUT", body: { targets: drafts.map((d) => ({ employeeId: d.employeeId, target: d.target, slabs: parseSlabs(d.slabs) })) } });
      setEditing(false);
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? (err.issues?.[0]?.message ?? err.code) : "generic";
      setError(t.has(`targets.errors.${code}`) ? t(`targets.errors.${code}`) : t("auth.errors.generic"));
    }
    setBusy(false);
  }

  const label = new Date(`${month}-01T00:00:00`).toLocaleDateString(undefined, { month: "long", year: "numeric" });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={() => router.push(`/sales/targets?month=${shiftMonth(month, -1)}`)} aria-label={t("targets.previous")}>‹</Button>
        <span className="min-w-36 text-center font-semibold">{label}</span>
        <Button variant="outline" onClick={() => router.push(`/sales/targets?month=${shiftMonth(month, 1)}`)} aria-label={t("targets.next")}>›</Button>
        {canEdit && !editing ? <Button className="ml-auto" onClick={() => setEditing(true)}>{t("targets.edit")}</Button> : null}
      </div>

      {editing ? (
        <Card>
          <div className="flex flex-col gap-3">
            {error ? <Alert>{error}</Alert> : null}
            <p className="text-sm text-muted">{t("targets.slabsHint")}</p>
            {drafts.map((d) => (
              <div key={d.key} className="grid gap-3 md:grid-cols-[2fr_1fr_2fr_auto]">
                <Select value={d.employeeId} onChange={(e) => update(d.key, { employeeId: e.target.value })} aria-label={t("agents.salesman")}>
                  <option value="">{t("targets.chooseSalesman")}</option>
                  {salesmen.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.code})</option>)}
                </Select>
                <Input value={d.target} onChange={(e) => update(d.key, { target: e.target.value })} inputMode="decimal" className="num" placeholder={t("targets.target")} aria-label={t("targets.target")} />
                <Input value={d.slabs} onChange={(e) => update(d.key, { slabs: e.target.value })} placeholder="0:1, 100:2" aria-label={t("targets.slabs")} className="num" />
                <button type="button" onClick={() => setDrafts((ds) => ds.filter((x) => x.key !== d.key))} className="rounded-md p-2 text-muted hover:bg-surface-2 hover:text-danger" title={t("common.remove")}>
                  <Trash2 className="size-4" aria-hidden /><span className="sr-only">{t("common.remove")}</span>
                </button>
              </div>
            ))}
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => setDrafts((ds) => [...ds, { key: nextKey++, employeeId: "", target: "", slabs: ds.at(-1)?.slabs ?? "" }])}>
                <Plus className="size-4" aria-hidden />{t("targets.add")}
              </Button>
              <Button variant="ghost" onClick={copyLastMonth}>{t("targets.copyLast")}</Button>
              <span className="flex-1" />
              <Button onClick={save} disabled={busy}>{t("common.save")}</Button>
              <Button variant="ghost" onClick={() => { setEditing(false); setDrafts(fromRows(rows)); setError(null); }}>{t("common.cancel")}</Button>
            </div>
          </div>
        </Card>
      ) : null}

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("agents.salesman")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("targets.target")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("targets.achieved")}</th>
                <th className="px-5 py-3 font-medium">{t("targets.progress")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("targets.rate")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("agents.commission")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const pct = r.achievedPct ? Number(r.achievedPct) : null;
                return (
                  <tr key={r.employeeId} className="border-b border-border last:border-0">
                    <td className="px-5 py-2.5">
                      <span className="font-medium">{r.name}</span>
                      <span className="block text-xs text-muted">{t("targets.invoices", { n: r.invoices })}{Number(r.returns) ? ` · ${t("targets.returns", { amount: rupees(r.returns) })}` : ""}</span>
                    </td>
                    <td className="num px-5 py-2.5 text-right">{r.target ? rupees(r.target) : <span className="text-muted">{t("targets.noTarget")}</span>}</td>
                    <td className="num px-5 py-2.5 text-right">{rupees(r.achieved)}</td>
                    <td className="px-5 py-2.5">
                      {pct !== null ? (
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-28 overflow-hidden rounded-full bg-surface-2">
                            <div className={`h-full rounded-full ${pct >= 100 ? "bg-success" : "bg-primary"}`} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
                          </div>
                          <span className="num text-xs">{pct}%</span>
                        </div>
                      ) : null}
                    </td>
                    <td className="num px-5 py-2.5 text-right">{Number(r.rate) ? `${Number(r.rate)}%` : ""}</td>
                    <td className="num px-5 py-2.5 text-right font-semibold">{rupees(r.commission)}</td>
                  </tr>
                );
              })}
              {!rows.length ? <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">{t("targets.empty")}</td></tr> : null}
            </tbody>
            {rows.length ? (
              <tfoot>
                <tr className="border-t-2 border-border font-semibold">
                  <td className="px-5 py-3" colSpan={5}>{t("common.total")}</td>
                  <td className="num px-5 py-3 text-right">{rupees(total)}</td>
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      </Card>
      <p className="text-xs text-muted">{t("targets.note")}</p>
    </div>
  );
}
