"use client";

import { LookupOptions } from "../masters/LookupOptions";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { GST_STATES, devanagari } from "@varchasv/domain";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Card, Field, Input, Select } from "../ui";
import { SalaryEditor, defaultRows, toPayload, type ComponentRow } from "./SalaryEditor";

export interface EmployeeData {
  id: string; code: string; name: string; nameHi: string | null; gender: string; dob: string | null; joinedOn: string; fixedTerm: boolean;
  department: string | null; designation: string | null; workState: string; phone: string | null; email: string | null; address: { line1?: string; city?: string; pincode?: string } | null;
  pan: string | null; aadhaarLast4: string | null; uan: string | null; esiNumber: string | null; pfMember: boolean; epsEligible: boolean; pfOnActualWages: boolean; disabled: boolean;
  taxRegime: string; metro: boolean; paymentMode: string; bankName: string | null; bankIfsc: string | null; bankAccountLast4: string | null; status: string;
  shiftId: string | null;
  punchPin?: string | null;
  weeklyOffs?: number[] | null;
}

/** New employee (with a salary structure) or edit an existing one's details. */
export function EmployeeForm({ employee, homeState, shifts = [] }: { employee?: EmployeeData; homeState: string; shifts?: { id: string; name: string; startTime: string; endTime: string }[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [rows, setRows] = useState<ComponentRow[]>(() => defaultRows(t));
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [ownOffs, setOwnOffs] = useState<number[] | null>(employee?.weeklyOffs ?? null);
  const [busy, setBusy] = useState(false);
  const e = employee;

  async function submit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(false);
    const f = Object.fromEntries(new FormData(ev.currentTarget)) as Record<string, string>;
    const opt = (k: string) => (f[k]?.trim() ? f[k]!.trim() : undefined);
    const bool = (k: string) => f[k] === "on";
    const body = {
      code: opt("code"), name: f.name, nameHi: opt("nameHi"), gender: f.gender, dob: opt("dob"), joinedOn: f.joinedOn, fixedTerm: bool("fixedTerm"),
      department: opt("department"), designation: opt("designation"), workState: f.workState, phone: opt("phone"), email: opt("email"),
      address: opt("line1") || opt("city") || opt("pincode") ? { line1: opt("line1"), city: opt("city"), pincode: opt("pincode") } : undefined,
      pan: opt("pan"), aadhaarLast4: opt("aadhaarLast4"), uan: opt("uan"), esiNumber: opt("esiNumber"),
      pfMember: bool("pfMember"), epsEligible: bool("epsEligible"), pfOnActualWages: bool("pfOnActualWages"), disabled: bool("disabled"),
      taxRegime: f.taxRegime, metro: bool("metro"), shiftId: f.shiftId || null, punchPin: opt("punchPin") ?? null, weeklyOffs: ownOffs && ownOffs.length ? ownOffs : null, paymentMode: f.paymentMode, bankName: opt("bankName"), bankIfsc: opt("bankIfsc"), bankAccount: opt("bankAccount"),
      ...(e ? {} : { components: toPayload(rows) }),
    };
    try {
      const r = await api<{ id: string }>(e ? `/employees/${e.id}` : "/employees", { method: e ? "PATCH" : "POST", body });
      if (e) { setSaved(true); router.refresh(); } else router.push(`/hr/employees/${r.id}`);
    } catch (err) {
      setError(errorText(t, err, ["hr.errors"]));
    } finally {
      setBusy(false);
    }
  }

  const check = (name: string, label: string, def: boolean) => (
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" name={name} defaultChecked={def} className="size-4 accent-[var(--primary)]" />{label}</label>
  );
  const grid = "grid gap-4 md:grid-cols-2 xl:grid-cols-4";
  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <Card>
        <h2 className="mb-4 font-semibold">{t("hr.sections.personal")}</h2>
        <div className={grid}>
          <Field label={t("hr.name")} htmlFor="e-name"><Input id="e-name" name="name" defaultValue={e?.name} required minLength={2} maxLength={100} /></Field>
          <Field label={t("hr.nameHi")} htmlFor="e-namehi"><Input id="e-namehi" name="nameHi" defaultValue={e?.nameHi ?? ""} maxLength={100} lang="hi" /></Field>
          <Field label={t("hr.gender")} htmlFor="e-gender">
            <Select id="e-gender" name="gender" defaultValue={e?.gender ?? "male"}>{["male", "female", "other"].map((g) => <option key={g} value={g}>{t(`hr.genders.${g}`)}</option>)}</Select>
          </Field>
          <Field label={t("hr.dob")} htmlFor="e-dob"><Input id="e-dob" name="dob" type="date" defaultValue={e?.dob ?? ""} /></Field>
          <Field label={t("hr.phone")} htmlFor="e-phone"><Input id="e-phone" name="phone" defaultValue={e?.phone ?? ""} inputMode="tel" pattern="[6-9]\d{9}" maxLength={10} /></Field>
          <Field label={t("hr.email")} htmlFor="e-email"><Input id="e-email" name="email" type="email" defaultValue={e?.email ?? ""} /></Field>
          <Field label={t("hr.address")} htmlFor="e-line1"><Input id="e-line1" name="line1" defaultValue={e?.address?.line1 ?? ""} maxLength={200} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("hr.city")} htmlFor="e-city"><Input id="e-city" name="city" defaultValue={e?.address?.city ?? ""} maxLength={80} /></Field>
            <Field label={t("hr.pincode")} htmlFor="e-pin"><Input id="e-pin" name="pincode" defaultValue={e?.address?.pincode ?? ""} inputMode="numeric" pattern="[1-9]\d{5}" className="num" /></Field>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold">{t("hr.sections.job")}</h2>
        <div className={grid}>
          <Field label={t("hr.code")} htmlFor="e-code" hint={e ? undefined : t("hr.codeHint")}><Input id="e-code" name="code" defaultValue={e?.code ?? ""} maxLength={20} className="font-mono uppercase" /></Field>
          <Field label={t("hr.joinedOn")} htmlFor="e-join"><Input id="e-join" name="joinedOn" type="date" defaultValue={e?.joinedOn} required /></Field>
          <Field label={t("hr.designation")} htmlFor="e-desig"><Input id="e-desig" name="designation" defaultValue={e?.designation ?? ""} maxLength={60} list="lk-desig" /><LookupOptions id="lk-desig" kind="designation" /></Field>
          <Field label={t("hr.department")} htmlFor="e-dept"><Input id="e-dept" name="department" defaultValue={e?.department ?? ""} maxLength={60} list="lk-dept" /><LookupOptions id="lk-dept" kind="employeeDepartment" /></Field>
          <Field label={t("hr.workState")} htmlFor="e-state" hint={t("hr.workStateHint")}>
            <Select id="e-state" name="workState" defaultValue={e?.workState ?? homeState}>
              {GST_STATES.filter((s) => s.code !== "96" && s.code !== "97").map((s) => <option key={s.code} value={s.code}>{devanagari(locale) ? s.nameHi : s.name}</option>)}
            </Select>
          </Field>
          <Field label={t("hr.punchPin")} htmlFor="e-pin" hint={t("hr.punchPinHint")}><Input id="e-pin" name="punchPin" defaultValue={e?.punchPin ?? ""} maxLength={24} pattern="[A-Za-z0-9]{1,24}" className="font-mono" /></Field>
          <fieldset className="sm:col-span-2">
            <legend className="mb-1 text-sm font-medium">{t("hr.weeklyOffs")}</legend>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={ownOffs === null} onChange={(ev) => setOwnOffs(ev.target.checked ? null : [])} />{t("hr.weeklyOffsSame")}</label>
              {ownOffs ? [1, 2, 3, 4, 5, 6, 0].map((d) => (
                <label key={d} className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={ownOffs.includes(d)} onChange={(ev) => setOwnOffs(ev.target.checked ? [...ownOffs, d].slice(0, 3) : ownOffs.filter((x) => x !== d))} />{t(`schemes.day.d${d}`)}</label>
              )) : null}
            </div>
            <p className="mt-1 text-xs text-muted">{t("hr.weeklyOffsHint")}</p>
          </fieldset>
          <Field label={t("hr.shifts.shift")} htmlFor="e-shift">
            <Select id="e-shift" name="shiftId" defaultValue={e?.shiftId ?? ""}>
              <option value="">{t("hr.shifts.noShift")}</option>
              {shifts.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.startTime}–{s.endTime}</option>)}
            </Select>
          </Field>
          <div className="flex items-end pb-2">{check("fixedTerm", t("hr.fixedTerm"), e?.fixedTerm ?? false)}</div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold">{t("hr.sections.statutory")}</h2>
        <div className={grid}>
          <Field label={t("hr.pan")} htmlFor="e-pan"><Input id="e-pan" name="pan" defaultValue={e?.pan ?? ""} maxLength={10} pattern="[A-Za-z]{5}\d{4}[A-Za-z]" className="font-mono uppercase" /></Field>
          <Field label={t("hr.aadhaarLast4")} htmlFor="e-aad"><Input id="e-aad" name="aadhaarLast4" defaultValue={e?.aadhaarLast4 ?? ""} inputMode="numeric" pattern="\d{4}" maxLength={4} className="num" /></Field>
          <Field label={t("hr.uan")} htmlFor="e-uan"><Input id="e-uan" name="uan" defaultValue={e?.uan ?? ""} inputMode="numeric" pattern="\d{12}" maxLength={12} className="num" /></Field>
          <Field label={t("hr.esiNumber")} htmlFor="e-esi"><Input id="e-esi" name="esiNumber" defaultValue={e?.esiNumber ?? ""} inputMode="numeric" pattern="\d{10,17}" maxLength={17} className="num" /></Field>
          <Field label={t("hr.taxRegime")} htmlFor="e-regime">
            <Select id="e-regime" name="taxRegime" defaultValue={e?.taxRegime ?? "new"}>{["new", "old"].map((r) => <option key={r} value={r}>{t(`hr.regimes.${r}`)}</option>)}</Select>
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {check("pfMember", t("hr.pfMember"), e?.pfMember ?? true)}
          {check("epsEligible", t("hr.epsEligible"), e?.epsEligible ?? true)}
          {check("pfOnActualWages", t("hr.pfOnActual"), e?.pfOnActualWages ?? false)}
          {check("disabled", t("hr.disabled"), e?.disabled ?? false)}
          {check("metro", t("hr.metro"), e?.metro ?? false)}
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold">{t("hr.sections.bank")}</h2>
        <div className={grid}>
          <Field label={t("hr.paymentMode")} htmlFor="e-pay">
            <Select id="e-pay" name="paymentMode" defaultValue={e?.paymentMode ?? "bank"}>{["bank", "cash", "cheque"].map((m) => <option key={m} value={m}>{t(`hr.paymentModes.${m}`)}</option>)}</Select>
          </Field>
          <Field label={t("hr.bankName")} htmlFor="e-bank"><Input id="e-bank" name="bankName" defaultValue={e?.bankName ?? ""} maxLength={80} /></Field>
          <Field label={t("hr.bankIfsc")} htmlFor="e-ifsc"><Input id="e-ifsc" name="bankIfsc" defaultValue={e?.bankIfsc ?? ""} maxLength={11} pattern="[A-Za-z]{4}0[A-Za-z0-9]{6}" className="font-mono uppercase" /></Field>
          <Field label={t("hr.bankAccount")} htmlFor="e-acct" hint={e?.bankAccountLast4 ? t("hr.bankAccountHint", { last4: e.bankAccountLast4 }) : undefined}>
            <Input id="e-acct" name="bankAccount" inputMode="numeric" pattern="\d{6,18}" maxLength={18} autoComplete="off" className="num" />
          </Field>
        </div>
      </Card>

      {e ? null : (
        <Card>
          <h2 className="mb-2 font-semibold">{t("hr.sections.salary")}</h2>
          <SalaryEditor rows={rows} onChange={setRows} />
        </Card>
      )}

      {error ? <Alert>{error}</Alert> : null}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={busy}>{e ? t("hr.save") : t("hr.create")}</Button>
        {saved ? <span className="text-sm text-success">{t("hr.saved")}</span> : null}
      </div>
    </form>
  );
}
