"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { GST_STATES, amountInWords, computeInvoiceTax, formatIndian, wordsLang, devanagari } from "@varchasv/domain";
import { Card, Field, Input, Select } from "./ui";

/** Runs the shared domain rules in the browser, identical to the API and the offline app. */
export function GstCalculator({ defaultState }: { defaultState: string }) {
  const t = useTranslations();
  const locale = useLocale();
  const [from, setFrom] = useState(defaultState);
  const [to, setTo] = useState(defaultState);
  const [qty, setQty] = useState("1");
  const [rate, setRate] = useState("1000");
  const [gstRate, setGstRate] = useState("18");

  const result = useMemo(() => {
    try {
      return computeInvoiceTax([{ qty, rate, gstRate }], { supplierState: from, placeOfSupply: to });
    } catch {
      return null;
    }
  }, [from, to, qty, rate, gstRate]);

  const states = GST_STATES.map((s) => <option key={s.code} value={s.code}>{s.code} · {devanagari(locale) ? s.nameHi : s.name}</option>);
  const row = (label: string, value: string, strong = false) => (
    <div className={`flex justify-between py-1.5 ${strong ? "border-t border-border pt-3 text-base font-semibold" : "text-sm"}`}>
      <dt className={strong ? "" : "text-muted"}>{label}</dt>
      <dd className="num">₹ {formatIndian(value)}</dd>
    </div>
  );

  return (
    <Card>
      <h2 className="font-semibold">{t("dashboard.calcTitle")}</h2>
      <p className="text-sm text-muted">{t("dashboard.calcSubtitle")}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label={t("calc.from")} htmlFor="calc-from"><Select id="calc-from" value={from} onChange={(e) => setFrom(e.target.value)}>{states}</Select></Field>
        <Field label={t("calc.to")} htmlFor="calc-to"><Select id="calc-to" value={to} onChange={(e) => setTo(e.target.value)}>{states}</Select></Field>
        <div className="grid grid-cols-[1fr_1.4fr_1fr] gap-3 sm:col-span-2">
          <Field label={t("calc.qty")} htmlFor="calc-qty"><Input id="calc-qty" inputMode="decimal" value={qty} onChange={(e) => setQty(e.target.value)} className="num" /></Field>
          <Field label={t("calc.rate")} htmlFor="calc-rate"><Input id="calc-rate" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className="num" /></Field>
          <Field label={t("calc.gstRate")} htmlFor="calc-gst">
            <Select id="calc-gst" value={gstRate} onChange={(e) => setGstRate(e.target.value)}>
              {["0", "3", "5", "18", "40"].map((r) => <option key={r} value={r}>{r}%</option>)}
            </Select>
          </Field>
        </div>
      </div>
      {result ? (
        <dl className="mt-5 rounded-lg bg-surface-2 px-4 py-3">
          {row(t("calc.taxable"), result.taxableValue)}
          {result.supplyKind === "intra" ? (
            <>
              {row(t("calc.cgst"), result.cgst)}
              {result.utgst !== "0.00" ? row(t("calc.utgst"), result.utgst) : row(t("calc.sgst"), result.sgst)}
            </>
          ) : row(t("calc.igst"), result.igst)}
          {result.roundOff !== "0.00" ? row(t("calc.roundOff"), result.roundOff) : null}
          {row(t("calc.total"), result.grandTotal, true)}
          <p className="pt-2 text-xs text-muted">{t("calc.inWords")}: {amountInWords(result.grandTotal, wordsLang(locale))}</p>
        </dl>
      ) : null}
    </Card>
  );
}
