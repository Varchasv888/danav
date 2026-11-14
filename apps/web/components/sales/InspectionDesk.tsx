"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Card, Input, Select } from "../ui";

export interface Inspection {
  id: string; sourceType: string; sourceNumber: string; customer: string | null; item: string; color: string | null; size: string | null; godown: string;
  qty: string; restocked: string; writtenOff: string; remaining: string; status: "pending" | "done"; note: string | null;
}
const q = (v: string) => Number(v).toLocaleString("en-IN", { maximumFractionDigits: 3 });

/** Goods that came back and are waiting in Quality hold: for each line, how many go back on the shelf and how many are written off. */
export function InspectionDesk({ rows, godowns, canEdit }: { rows: Inspection[]; godowns: { id: string; name: string }[]; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, { restock: string; writeOff: string; to: string; reason: string }>>({});
  const get = (id: string) => draft[id] ?? { restock: "", writeOff: "", to: "", reason: "damaged" };
  const set = (id: string, k: "restock" | "writeOff" | "to" | "reason", v: string) => setDraft((d) => ({ ...d, [id]: { ...get(id), [k]: v } }));

  async function decide(r: Inspection) {
    const d = get(r.id);
    setBusy(r.id); setError(null);
    try {
      await api(`/return-inspections/${r.id}/decide`, { body: { ...(d.restock ? { restock: d.restock } : {}), ...(d.writeOff ? { writeOff: d.writeOff, reason: d.reason } : {}), ...(d.to ? { restockTo: d.to } : {}) } });
      setDraft((x) => { const n = { ...x }; delete n[r.id]; return n; }); router.refresh();
    } catch (err) { setError(errorText(t, err, ["inspection.errors"])); } finally { setBusy(null); }
  }
  const pending = rows.filter((r) => r.status === "pending");
  const done = rows.filter((r) => r.status === "done");

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      <Card className="overflow-hidden p-0">
        <h2 className="border-b border-border px-4 py-3 font-semibold">{t("inspection.waiting")}</h2>
        {pending.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="text-left text-muted">
                <tr className="border-b border-border">
                  <th className="px-4 py-2 font-medium">{t("inspection.item")}</th><th className="px-3 py-2 font-medium">{t("inspection.from")}</th>
                  <th className="px-3 py-2 text-right font-medium">{t("inspection.back")}</th><th className="px-3 py-2 text-right font-medium">{t("inspection.left")}</th>
                  {canEdit ? <><th className="px-3 py-2 font-medium">{t("inspection.restock")}</th><th className="px-3 py-2 font-medium">{t("inspection.writeOff")}</th><th className="w-24" /></> : null}
                </tr>
              </thead>
              <tbody>
                {pending.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0 align-top">
                    <td className="px-4 py-2 font-medium">{r.item}</td>
                    <td className="px-3 py-2">{r.sourceNumber}{r.customer ? <span className="block text-xs text-muted">{r.customer}</span> : null}</td>
                    <td className="num px-3 py-2 text-right">{q(r.qty)}</td>
                    <td className="num px-3 py-2 text-right font-medium">{q(r.remaining)}</td>
                    {canEdit ? (
                      <>
                        <td className="px-3 py-2">
                          <Input inputMode="decimal" value={get(r.id).restock} onChange={(e) => set(r.id, "restock", e.target.value)} aria-label={`${t("inspection.restock")} ${r.item}`} className="num h-8 w-20 text-right" />
                          {godowns.length > 1 ? <Select value={get(r.id).to} onChange={(e) => set(r.id, "to", e.target.value)} aria-label={t("inspection.restockTo")} className="mt-1 h-8 w-36"><option value="">{t("inspection.defaultGodown")}</option>{godowns.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</Select> : null}
                        </td>
                        <td className="px-3 py-2">
                          <Input inputMode="decimal" value={get(r.id).writeOff} onChange={(e) => set(r.id, "writeOff", e.target.value)} aria-label={`${t("inspection.writeOff")} ${r.item}`} className="num h-8 w-20 text-right" />
                          <Select value={get(r.id).reason} onChange={(e) => set(r.id, "reason", e.target.value)} aria-label={t("inspection.reason")} className="mt-1 h-8 w-36">{(["damaged", "lost", "other"] as const).map((k) => <option key={k} value={k}>{t(`inspection.reasons.${k}`)}</option>)}</Select>
                        </td>
                        <td className="px-3 py-2 text-right"><Button variant="outline" onClick={() => void decide(r)} disabled={busy === r.id || (!get(r.id).restock && !get(r.id).writeOff)}>{t("inspection.decide")}</Button></td>
                      </>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="px-4 py-4 text-sm text-muted">{t("inspection.none")}</p>}
      </Card>
      {done.length ? (
        <Card className="overflow-hidden p-0">
          <h2 className="border-b border-border px-4 py-3 font-semibold">{t("inspection.finished")}</h2>
          <ul className="divide-y divide-border text-sm">
            {done.slice(-20).reverse().map((r) => (
              <li key={r.id} className={clsx("flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2")}>
                <span className="font-medium">{r.item}</span><span className="text-muted">{r.sourceNumber}</span>
                <span className="num ml-auto">{t("inspection.result", { restocked: q(r.restocked), writtenOff: q(r.writtenOff) })}</span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
      <p className="text-xs text-muted">{t("inspection.note")}</p>
    </div>
  );
}
