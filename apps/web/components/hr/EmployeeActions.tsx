"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { rupees, todayIso } from "@/lib/format";
import { Alert, Button, Card, Field, Input } from "../ui";
import { SalaryEditor, newRow, toPayload, type ComponentRow } from "./SalaryEditor";

type Component = { code: string; name: string; monthly: string; pfWage?: boolean; hra?: boolean; esiExcluded?: boolean };

/** A new salary structure taking effect from a date (a raise or restructure). */
export function SalaryRevision({ employeeId, current }: { employeeId: string; current: Component[] }) {
  const t = useTranslations();
  const router = useRouter();
  const [rows, setRows] = useState<ComponentRow[]>(() => current.map((c) => newRow({ ...c, monthly: String(Number(c.monthly)) })));
  const [from, setFrom] = useState(todayIso().slice(0, 8) + "01");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    try {
      await api(`/employees/${employeeId}/salary`, { body: { effectiveFrom: from, components: toPayload(rows) } });
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(errorText(t, err, ["hr.errors"]));
    }
  }
  return (
    <form onSubmit={save} className="flex flex-col gap-3">
      <SalaryEditor rows={rows} onChange={setRows} />
      {error ? <Alert>{error}</Alert> : null}
      <div className="flex flex-wrap items-end gap-3">
        <Field label={t("hr.salary.effectiveFrom")} htmlFor="sal-from"><Input id="sal-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} required /></Field>
        <Button type="submit">{t("hr.salary.revise")}</Button>
        {saved ? <span className="pb-2 text-sm text-success">{t("hr.saved")}</span> : null}
      </div>
    </form>
  );
}

const DECL_FIELDS = ["rentPaid", "c80", "ccd1b", "d80", "homeLoanInterest", "otherDeductions", "otherIncome", "previousEmployerSalary", "previousEmployerTds"] as const;

export function TaxDeclarationForm({ employeeId, fy, values }: { employeeId: string; fy: string; values: Partial<Record<(typeof DECL_FIELDS)[number], string>> }) {
  const t = useTranslations();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    try {
      await api(`/employees/${employeeId}/tax-declaration`, { method: "PUT", body: { fy, ...Object.fromEntries(DECL_FIELDS.map((k) => [k, f[k] || "0"])) } });
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(errorText(t, err, ["hr.errors"]));
    }
  }
  return (
    <form onSubmit={save} className="flex flex-col gap-4">
      <p className="text-sm text-muted">{t("hr.declaration.hint")} <span className="font-medium text-text">{t("hr.declaration.fy")} {fy}</span></p>
      <div className="grid gap-4 md:grid-cols-3">
        {DECL_FIELDS.map((k) => (
          <Field key={k} label={t(`hr.declaration.${k}`)} htmlFor={`decl-${k}`}>
            <Input id={`decl-${k}`} name={k} defaultValue={values[k] && Number(values[k]) ? String(Number(values[k])) : ""} inputMode="decimal" pattern="\d+(\.\d{1,2})?" className="num" />
          </Field>
        ))}
      </div>
      {error ? <Alert>{error}</Alert> : null}
      <div className="flex items-center gap-3">
        <Button type="submit" variant="outline">{t("hr.declaration.save")}</Button>
        {saved ? <span className="text-sm text-success">{t("hr.saved")}</span> : null}
      </div>
    </form>
  );
}

interface Preview { wages: string; serviceYears: number; gratuity: { eligible: boolean; amount: string }; leaveDays: string; leaveEncashment: string }

/** Full and final: shows gratuity and leave encashment for the chosen last day, then settles. */
export function SettleForm({ employeeId }: { employeeId: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [leftOn, setLeftOn] = useState(todayIso());
  const [leaveDays, setLeaveDays] = useState("");
  const [other, setOther] = useState("");
  const [recoveries, setRecoveries] = useState("");
  const [remarks, setRemarks] = useState("");
  const [p, setP] = useState<Preview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams({ leftOn, ...(leaveDays ? { leaveDays } : {}) });
    api<Preview>(`/employees/${employeeId}/settlement?${q}`).then((r) => { setP(r); setError(null); }).catch((err) => { setP(null); setError(errorText(t, err, ["hr.errors"])); });
  }, [employeeId, leftOn, leaveDays, t]);

  const total = p ? Number(p.gratuity.amount) + Number(p.leaveEncashment) + (Number(other) || 0) - (Number(recoveries) || 0) : 0;
  async function settle(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api(`/employees/${employeeId}/settle`, { body: { leftOn, leaveDays: leaveDays || undefined, otherEarnings: other || undefined, recoveries: recoveries || undefined, remarks: remarks || undefined } });
      router.refresh();
    } catch (err) {
      setError(errorText(t, err, ["hr.errors"]));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Card>
      <h2 className="font-semibold">{t("hr.settle.title")}</h2>
      <p className="mt-1 text-sm text-muted">{t("hr.settle.hint")}</p>
      <form onSubmit={settle} className="mt-4 grid gap-4 md:grid-cols-3">
        <Field label={t("hr.settle.leftOn")} htmlFor="st-left"><Input id="st-left" type="date" value={leftOn} onChange={(e) => setLeftOn(e.target.value)} required /></Field>
        <Field label={t("hr.settle.leaveDays")} htmlFor="st-days"><Input id="st-days" value={leaveDays} placeholder={p?.leaveDays} onChange={(e) => setLeaveDays(e.target.value)} inputMode="decimal" pattern="\d+(\.5)?" className="num" /></Field>
        <Field label={t("hr.settle.otherEarnings")} htmlFor="st-other"><Input id="st-other" value={other} onChange={(e) => setOther(e.target.value)} inputMode="decimal" pattern="\d+(\.\d{1,2})?" className="num" /></Field>
        <Field label={t("hr.settle.recoveries")} htmlFor="st-rec"><Input id="st-rec" value={recoveries} onChange={(e) => setRecoveries(e.target.value)} inputMode="decimal" pattern="\d+(\.\d{1,2})?" className="num" /></Field>
        <div className="md:col-span-2"><Field label={t("hr.settle.remarks")} htmlFor="st-rem"><Input id="st-rem" value={remarks} onChange={(e) => setRemarks(e.target.value)} maxLength={300} /></Field></div>
        {p ? (
          <dl className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 text-sm md:col-span-3 md:max-w-md">
            <dt className="text-muted">{t("hr.settle.serviceYears")}</dt><dd className="num text-right">{p.serviceYears}</dd>
            <dt className="text-muted">{t("hr.settle.gratuity")}</dt><dd className="num text-right">{p.gratuity.eligible ? rupees(p.gratuity.amount) : t("hr.settle.notEligible")}</dd>
            <dt className="text-muted">{t("hr.settle.encashment")} ({p.leaveDays})</dt><dd className="num text-right">{rupees(p.leaveEncashment)}</dd>
            <dt className="border-t border-border pt-2 font-semibold">{t("hr.settle.total")}</dt><dd className="num border-t border-border pt-2 text-right font-semibold">{rupees(total.toFixed(2))}</dd>
          </dl>
        ) : null}
        {error ? <div className="md:col-span-3"><Alert>{error}</Alert></div> : null}
        <div className="md:col-span-3"><Button type="submit" variant="danger" disabled={busy || !p}>{t("hr.settle.confirm")}</Button></div>
      </form>
    </Card>
  );
}
