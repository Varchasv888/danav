"use client";

import clsx from "clsx";
import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Card, Field, Select } from "../ui";

interface Heads { igst: string; cgst: string; sgst: string; cess: string }
interface Tables {
  table4: Heads & { taxable: string; totalTax: string };
  table5: { zeroRated: Heads & { taxable: string }; nilExempt: string };
  reverseCharge: Heads & { taxable: string };
  table6: { availed: Heads; totalTax: string };
  table7: { reversed: Heads; totalTax: string };
  table8: { basis: "2b" | "books"; a: Heads; per2b: Heads; perBooks: Heads; gapBetweenBases: Heads; b: Heads; c: Heads; d: Heads; monthsWithout2b: string[]; dNote: string };
  table9: { payable: Heads; paidInCash: Heads; paidByCredit: Heads };
}
interface Working { fy: string; from: string; to: string; basis: "2b" | "books"; dueOn: string; tables: Tables; notCaptured: string[]; needsAccountant: string[] }

const HEADS = ["igst", "cgst", "sgst", "cess"] as const;

/**
 * The annual return GSTR-9 worked from the twelve months. Table 8A, the credit the statements say was available, can be taken from the GSTR-2B
 * statements or from the purchase books; the accountant picks the basis and both figures stay on screen so the gap is not hidden.
 */
export function Gstr9Panel({ fy }: { fy: string }) {
  const t = useTranslations();
  const format = useFormatter();
  const [basis, setBasis] = useState<"2b" | "books">("2b");
  const [data, setData] = useState<Working | null>(null);
  const [error, setError] = useState<string | null>(null);
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });

  const load = useCallback(() => {
    if (fy.length !== 4) return;
    setError(null);
    api<Working>(`/gst/work/gstr9?fy=${fy}&basis=${basis}`).then(setData).catch((e) => { setData(null); setError(errorText(t, e, ["gstwork.errors", "gstCompliance.errors"])); });
  }, [fy, basis, t]);
  useEffect(() => { load(); }, [load]);

  const head = (label: string) => (
    <thead className="text-left text-muted"><tr className="border-b border-border">
      <th className="px-4 py-2 font-medium">{label}</th>
      {HEADS.map((h) => <th key={h} className="px-3 py-2 text-right font-medium">{t(`gstr9.head.${h}`)}</th>)}
    </tr></thead>
  );
  const row = (label: string, v: Heads, strong = false) => (
    <tr className={clsx("border-b border-rule last:border-0", strong && "font-medium")}>
      <td className="px-4 py-1.5">{label}</td>
      {HEADS.map((h) => <td key={h} className="num px-3 py-1.5 text-right">{money(v[h])}</td>)}
    </tr>
  );

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      {data ? (
        <>
          <Card className="flex flex-wrap items-end justify-between gap-4 p-4">
            <div>
              <h2 className="text-sm font-medium">{t("gstr9.title", { fy: data.fy })}</h2>
              <p className="text-sm text-muted">{t("gstr9.due", { date: data.dueOn })}</p>
            </div>
            <Field label={t("gstr9.basis")} htmlFor="g9-basis" hint={t("gstr9.basisHint")}>
              <Select id="g9-basis" value={basis} onChange={(e) => setBasis(e.target.value as "2b" | "books")}>
                <option value="2b">{t("gstr9.basis2b")}</option>
                <option value="books">{t("gstr9.basisBooks")}</option>
              </Select>
            </Field>
          </Card>
          <p className="rounded-md border border-accent/30 bg-accent-soft px-3 py-2 text-sm text-accent">{t("gstr9.accountant")}</p>
          <Card className="overflow-x-auto p-0">
            <table className="w-full min-w-[640px] text-sm">
              {head(t("gstr9.t4"))}
              <tbody>
                <tr className="border-b border-rule"><td className="px-4 py-1.5">{t("gstr9.taxable")}</td><td colSpan={4} className="num px-3 py-1.5 text-right">{money(data.tables.table4.taxable)}</td></tr>
                {row(t("gstr9.tax"), data.tables.table4)}
                <tr className="border-b border-rule"><td className="px-4 py-1.5">{t("gstr9.zeroRated")}</td><td colSpan={4} className="num px-3 py-1.5 text-right">{money(data.tables.table5.zeroRated.taxable)}</td></tr>
                <tr className="border-b border-rule"><td className="px-4 py-1.5">{t("gstr9.nilExempt")}</td><td colSpan={4} className="num px-3 py-1.5 text-right">{money(data.tables.table5.nilExempt)}</td></tr>
                <tr><td className="px-4 py-1.5">{t("gstr9.rcm")}</td><td colSpan={4} className="num px-3 py-1.5 text-right">{money(data.tables.reverseCharge.taxable)}</td></tr>
              </tbody>
              {head(t("gstr9.t6"))}
              <tbody>{row(t("gstr9.availed"), data.tables.table6.availed)}{row(t("gstr9.reversed"), data.tables.table7.reversed)}</tbody>
              {head(t("gstr9.t8"))}
              <tbody>
                {row(t("gstr9.eightA", { basis: t(data.tables.table8.basis === "2b" ? "gstr9.basis2b" : "gstr9.basisBooks") }), data.tables.table8.a, true)}
                {row(t("gstr9.per2b"), data.tables.table8.per2b)}
                {row(t("gstr9.perBooks"), data.tables.table8.perBooks)}
                {row(t("gstr9.eightB"), data.tables.table8.b)}
                {row(t("gstr9.eightD"), data.tables.table8.d, true)}
              </tbody>
              {head(t("gstr9.t9"))}
              <tbody>{row(t("gstr9.payable"), data.tables.table9.payable)}{row(t("gstr9.byCredit"), data.tables.table9.paidByCredit)}{row(t("gstr9.inCash"), data.tables.table9.paidInCash)}</tbody>
            </table>
          </Card>
          <p className="text-sm text-muted">{t(`gstr9.dNote.${data.tables.table8.dNote}`)}</p>
          {data.tables.table8.monthsWithout2b.length ? <p className="rounded-md border border-accent/30 bg-accent-soft px-3 py-2 text-sm text-accent">{t("gstr9.missing2b", { count: data.tables.table8.monthsWithout2b.length })}</p> : null}
          <p className="text-xs text-muted">{t("gstr9.notBuilt", { items: data.notCaptured.map((k) => t(`gstr9.nc.${k}`)).join(", ") })}</p>
        </>
      ) : null}
    </div>
  );
}
