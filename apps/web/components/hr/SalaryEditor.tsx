"use client";

import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { rupees } from "@/lib/format";
import { Button, Input } from "../ui";

export interface ComponentRow { key: number; code: string; name: string; monthly: string; pfWage?: boolean; hra?: boolean; esiExcluded?: boolean }
let nextKey = 1;
export const newRow = (r: Omit<ComponentRow, "key">): ComponentRow => ({ ...r, key: nextKey++ });

/** Basic 50%, HRA 20%, special allowance for the rest: a structure that meets the 50% wage rule. */
export const defaultRows = (t: (k: string) => string) => [
  newRow({ code: "BASIC", name: t("hr.salary.defaults.basic"), monthly: "", pfWage: true }),
  newRow({ code: "HRA", name: t("hr.salary.defaults.hra"), monthly: "", hra: true }),
  newRow({ code: "SPECIAL", name: t("hr.salary.defaults.special"), monthly: "" }),
];

export const toPayload = (rows: ComponentRow[]) => rows.filter((r) => r.code.trim() && r.monthly !== "").map(({ key: _k, ...r }) => ({
  code: r.code.trim().toUpperCase(), name: r.name.trim() || r.code, monthly: r.monthly, pfWage: !!r.pfWage, hra: !!r.hra, esiExcluded: !!r.esiExcluded,
}));

/** Rows of salary components with the flags that decide PF, HRA exemption and ESI. */
export function SalaryEditor({ rows, onChange }: { rows: ComponentRow[]; onChange: (rows: ComponentRow[]) => void }) {
  const t = useTranslations();
  const set = (key: number, patch: Partial<ComponentRow>) => onChange(rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const gross = rows.reduce((s, r) => s + (Number(r.monthly) || 0), 0);
  const flag = (r: ComponentRow, k: "pfWage" | "hra" | "esiExcluded") => (
    <td className="px-2 py-1.5 text-center"><input type="checkbox" checked={!!r[k]} onChange={(e) => set(r.key, { [k]: e.target.checked })} className="size-4 accent-[var(--primary)]" aria-label={t(`hr.salary.${k}`)} /></td>
  );
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="text-left text-muted">
          <tr className="border-b border-border">
            <th className="w-28 px-2 py-2 font-medium">Code</th>
            <th className="px-2 py-2 font-medium">{t("hr.salary.component")}</th>
            <th className="w-36 px-2 py-2 text-right font-medium">{t("hr.salary.monthly")}</th>
            <th className="w-28 px-2 py-2 text-center font-medium">{t("hr.salary.pfWage")}</th>
            <th className="w-20 px-2 py-2 text-center font-medium">{t("hr.salary.hra")}</th>
            <th className="w-28 px-2 py-2 text-center font-medium">{t("hr.salary.esiExcluded")}</th>
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-b border-border">
              <td className="px-2 py-1.5"><Input value={r.code} onChange={(e) => set(r.key, { code: e.target.value.toUpperCase() })} maxLength={12} className="font-mono uppercase" aria-label="Code" /></td>
              <td className="px-2 py-1.5"><Input value={r.name} onChange={(e) => set(r.key, { name: e.target.value })} maxLength={40} aria-label={t("hr.salary.component")} /></td>
              <td className="px-2 py-1.5"><Input value={r.monthly} onChange={(e) => set(r.key, { monthly: e.target.value })} inputMode="decimal" pattern="\d+(\.\d{1,2})?" className="num text-right" aria-label={t("hr.salary.monthly")} /></td>
              {flag(r, "pfWage")}{flag(r, "hra")}{flag(r, "esiExcluded")}
              <td className="py-1.5 text-right">
                {rows.length > 1 ? (
                  <button type="button" onClick={() => onChange(rows.filter((x) => x.key !== r.key))} className="rounded-md p-2 text-muted hover:bg-surface-2 hover:text-danger" title={t("common.remove")}>
                    <Trash2 className="size-4" aria-hidden /><span className="sr-only">{t("common.remove")}</span>
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 flex items-center justify-between">
        <Button type="button" variant="ghost" className="-ml-3" onClick={() => onChange([...rows, newRow({ code: "", name: "", monthly: "" })])}><Plus className="size-4" aria-hidden />{t("hr.salary.add")}</Button>
        <p className="text-sm"><span className="text-muted">{t("hr.salary.gross")}:</span> <span className="num font-semibold">{rupees(gross.toFixed(2))}</span>
          <span className="ml-3 text-muted">{t("hr.salary.annual")}:</span> <span className="num">{rupees((gross * 12).toFixed(2))}</span></p>
      </div>
    </div>
  );
}
