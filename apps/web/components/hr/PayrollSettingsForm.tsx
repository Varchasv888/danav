"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Card, Field, Input, Select } from "../ui";
import { intlLocale } from "@varchasv/i18n/locales";

export interface PayrollSettings {
  tan: string | null; pfEstablishmentCode: string | null; esiEmployerCode: string | null; labourCodeWages: boolean; weeklyOffs: number[];
  lwfEmployee: string; lwfEmployer: string; lwfMonths: number[]; encashmentDivisor: number;
}

export function PayrollSettingsForm({ settings, canEdit }: { settings: PayrollSettings; canEdit: boolean }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [offs, setOffs] = useState<number[]>(settings.weeklyOffs);
  const [months, setMonths] = useState<number[]>(settings.lwfMonths);
  const [status, setStatus] = useState<"idle" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);
  const loc = intlLocale(locale);
  const dayName = (d: number) => new Intl.DateTimeFormat(loc, { weekday: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2023, 0, 1 + d))); // 1 Jan 2023 was a Sunday
  const monthName = (m: number) => new Intl.DateTimeFormat(loc, { month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2023, m - 1, 1)));
  const toggle = (list: number[], v: number) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v].sort((a, b) => a - b));

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    try {
      await api("/payroll/settings", {
        method: "PUT",
        body: {
          tan: f.tan || null, pfEstablishmentCode: f.pf || null, esiEmployerCode: f.esi || null, labourCodeWages: f.labourCode === "on", weeklyOffs: offs,
          lwfEmployee: f.lwfEmployee || "0", lwfEmployer: f.lwfEmployer || "0", lwfMonths: months, encashmentDivisor: Number(f.divisor),
        },
      });
      setStatus("saved");
      router.refresh();
    } catch (err) {
      setError(errorText(t, err, ["payroll.errors"]));
    }
  }
  const chip = (on: boolean) => `rounded-lg border px-3 py-1.5 text-sm ${on ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-surface-2"}`;
  return (
    <Card className="max-w-3xl">
      <form onSubmit={save} className="flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label={t("payroll.settings.tan")} htmlFor="ps-tan"><Input id="ps-tan" name="tan" defaultValue={settings.tan ?? ""} maxLength={10} pattern="[A-Za-z]{4}\d{5}[A-Za-z]" disabled={!canEdit} className="font-mono uppercase" /></Field>
          <Field label={t("payroll.settings.pfCode")} htmlFor="ps-pf"><Input id="ps-pf" name="pf" defaultValue={settings.pfEstablishmentCode ?? ""} maxLength={22} disabled={!canEdit} className="font-mono uppercase" /></Field>
          <Field label={t("payroll.settings.esiCode")} htmlFor="ps-esi"><Input id="ps-esi" name="esi" defaultValue={settings.esiEmployerCode ?? ""} maxLength={17} disabled={!canEdit} className="font-mono" /></Field>
        </div>
        <label className="flex items-start gap-3">
          <input type="checkbox" name="labourCode" defaultChecked={settings.labourCodeWages} disabled={!canEdit} className="mt-1 size-4 accent-[var(--primary)]" />
          <span><span className="font-medium">{t("payroll.settings.labourCode")}</span><span className="block text-sm text-muted">{t("payroll.settings.labourCodeHint")}</span></span>
        </label>
        <fieldset>
          <legend className="mb-2 text-sm font-medium">{t("payroll.settings.weeklyOffs")}</legend>
          <div className="flex flex-wrap gap-2">{[0, 1, 2, 3, 4, 5, 6].map((d) => <button key={d} type="button" disabled={!canEdit} onClick={() => setOffs(toggle(offs, d))} className={chip(offs.includes(d))} aria-pressed={offs.includes(d)}>{dayName(d)}</button>)}</div>
        </fieldset>
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 text-sm font-medium">{t("payroll.settings.lwf")}</legend>
          <div className="grid max-w-md gap-4 sm:grid-cols-2">
            <Field label={t("payroll.settings.lwfEmployee")} htmlFor="ps-lwfe"><Input id="ps-lwfe" name="lwfEmployee" defaultValue={Number(settings.lwfEmployee) || ""} inputMode="decimal" disabled={!canEdit} className="num" /></Field>
            <Field label={t("payroll.settings.lwfEmployer")} htmlFor="ps-lwfr"><Input id="ps-lwfr" name="lwfEmployer" defaultValue={Number(settings.lwfEmployer) || ""} inputMode="decimal" disabled={!canEdit} className="num" /></Field>
          </div>
          <p className="text-sm text-muted">{t("payroll.settings.lwfMonths")}</p>
          <div className="flex flex-wrap gap-2">{Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <button key={m} type="button" disabled={!canEdit} onClick={() => setMonths(toggle(months, m))} className={chip(months.includes(m))} aria-pressed={months.includes(m)}>{monthName(m)}</button>)}</div>
        </fieldset>
        <div className="max-w-xs">
          <Field label={t("payroll.settings.encashment")} htmlFor="ps-div">
            <Select id="ps-div" name="divisor" defaultValue={String(settings.encashmentDivisor)} disabled={!canEdit}>{[30, 26].map((n) => <option key={n} value={n}>{t("payroll.settings.divisor", { n })}</option>)}</Select>
          </Field>
        </div>
        {error ? <Alert>{error}</Alert> : null}
        {canEdit ? <div className="flex items-center gap-3"><Button type="submit">{t("payroll.settings.save")}</Button>{status === "saved" ? <span className="text-sm text-success">{t("common.saved")}</span> : null}</div> : null}
      </form>
    </Card>
  );
}
