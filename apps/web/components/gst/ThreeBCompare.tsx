"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { rupees } from "@/lib/format";
import { Alert, Button, Card, Input } from "../ui";

const HEADS = ["igst", "cgst", "sgst", "cess"] as const;
type Head = (typeof HEADS)[number];
interface Cell { erp: string; portal: string | null; final: string | null; diffPortal: string | null; diffFinal: string | null }
export interface CompareData {
  period: string; basis: string; updatedAt: string | null;
  rows: { line: string; status: "waiting" | "match" | "differs"; heads: Record<Head, Cell> }[];
  portal: Record<string, Partial<Record<Head, string>>>; final: Record<string, Partial<Record<Head, string>>>;
}

/**
 * GSTR-3B side by side: the ERP's figures, what the portal pre-filled and what was finally filed, per line and tax head.
 * The two typed columns are saved apart from the return's review, so recording them never reopens it.
 */
export function ThreeBCompare({ data, canEdit }: { data: CompareData; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [portal, setPortal] = useState(data.portal);
  const [final, setFinal] = useState(data.final);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const set = (col: "portal" | "final", line: string, head: Head, v: string) => {
    setSaved(false);
    const upd = (s: CompareData["portal"]) => ({ ...s, [line]: { ...s[line], [head]: v } });
    if (col === "portal") setPortal(upd); else setFinal(upd);
  };
  const clean = (s: CompareData["portal"]) => Object.fromEntries(Object.entries(s).map(([l, h]) => [l, Object.fromEntries(Object.entries(h).filter(([, v]) => v !== "" && v !== undefined))]));
  async function save() {
    setBusy(true); setError(null);
    try { await api("/gst/gstr3b/compare", { method: "PUT", body: { period: data.period, portal: clean(portal), final: clean(final) } }); setSaved(true); router.refresh(); }
    catch (err) { setError(errorText(t, err, ["gstmanual.errors"])); } finally { setBusy(false); }
  }
  const diff = (d: string | null) => (d === null ? "" : Number(d) === 0 ? t("gstcompare.same") : `${Number(d) > 0 ? "+" : "-"}${rupees(Math.abs(Number(d)))}`);

  return (
    <Card id="compare" className="scroll-mt-32 overflow-hidden p-0">
      <div className="border-b border-border px-4 py-3">
        <h2 className="font-semibold">{t("gstcompare.title")}</h2>
        <p className="mt-0.5 text-sm text-muted">{t("gstcompare.help")}</p>
      </div>
      {error ? <div className="px-4 pt-3"><Alert>{error}</Alert></div> : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="text-left text-muted">
            <tr className="border-b border-border">
              <th className="px-4 py-2 font-medium">{t("gstcompare.line")}</th>
              <th className="px-3 py-2 font-medium">{t("returns.head")}</th>
              <th className="px-3 py-2 text-right font-medium">{t("gstcompare.erp")}</th>
              <th className="px-3 py-2 text-right font-medium">{t("gstcompare.portal")}</th>
              <th className="px-3 py-2 text-right font-medium">{t("gstcompare.final")}</th>
              <th className="px-3 py-2 font-medium">{t("gstcompare.difference")}</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => HEADS.map((h, i) => {
              const c = r.heads[h];
              const dP = c.diffPortal, dF = c.diffFinal;
              const off = (dP !== null && Number(dP) !== 0) || (dF !== null && Number(dF) !== 0);
              return (
                <tr key={`${r.line}${h}`} className={clsx("border-b border-border", i === 0 && "border-t-2 border-t-border-strong")}>
                  <td className="px-4 py-1.5 align-top font-medium">
                    {i === 0 ? <>{t(`gstcompare.lines.${r.line}`)} <span className={clsx("ml-1 rounded px-1.5 text-xs font-normal", r.status === "differs" ? "bg-danger-soft text-danger" : r.status === "match" ? "bg-success-soft text-success" : "bg-surface-2 text-muted")}>{t(`gstcompare.status.${r.status}`)}</span></> : null}
                  </td>
                  <td className="px-3 py-1.5 text-muted">{h.toUpperCase()}</td>
                  <td className="num px-3 py-1.5 text-right">{rupees(c.erp)}</td>
                  <td className="px-3 py-1"><Input aria-label={`${t(`gstcompare.lines.${r.line}`)} ${h} ${t("gstcompare.portal")}`} value={portal[r.line]?.[h] ?? ""} onChange={(e) => set("portal", r.line, h, e.target.value)} disabled={!canEdit} inputMode="decimal" className="num ml-auto h-8 w-28 text-right" /></td>
                  <td className="px-3 py-1"><Input aria-label={`${t(`gstcompare.lines.${r.line}`)} ${h} ${t("gstcompare.final")}`} value={final[r.line]?.[h] ?? ""} onChange={(e) => set("final", r.line, h, e.target.value)} disabled={!canEdit} inputMode="decimal" className="num ml-auto h-8 w-28 text-right" /></td>
                  <td className={clsx("px-3 py-1.5 text-xs", off ? "text-danger" : "text-muted")}>
                    {[dP !== null ? `${t("gstcompare.portal")} ${diff(dP)}` : null, dF !== null ? `${t("gstcompare.final")} ${diff(dF)}` : null].filter(Boolean).join("  ")}
                  </td>
                </tr>
              );
            }))}
          </tbody>
        </table>
      </div>
      {canEdit ? (
        <div className="flex items-center gap-3 border-t border-border px-4 py-3">
          <Button onClick={save} disabled={busy}>{t("common.save")}</Button>
          {saved ? <span role="status" className="text-sm text-success">{t("gstcompare.saved")}</span> : null}
        </div>
      ) : null}
    </Card>
  );
}
