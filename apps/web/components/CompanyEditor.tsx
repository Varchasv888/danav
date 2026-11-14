"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { GST_STATES, findState, devanagari } from "@varchasv/domain";
import { ApiError, api } from "@/lib/client-api";
import { Alert, Button, Card, Field, Input, Select } from "./ui";

export interface Branch { id: string; name: string; gstin: string | null; stateCode: string; isHeadOffice: boolean; address: { city?: string; pincode?: string } }
export interface Company { id: string; name: string; legalName: string | null; pan: string | null; booksBeginOn: string; branches: Branch[] }

export function CompanyEditor({ company, canEdit }: { company: Company; canEdit: boolean }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const errorText = (err: unknown) => {
    const code = err instanceof ApiError ? err.code : "generic";
    return t.has(`auth.errors.${code}`) ? t(`auth.errors.${code}`) : t("auth.errors.generic");
  };

  async function saveCompany(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setStatus("saving");
    setError(null);
    try {
      await api(`/companies/${company.id}`, {
        method: "PATCH",
        body: { name: f.get("name"), legalName: f.get("legalName") || null, pan: f.get("pan") || null },
      });
      setStatus("saved");
      router.refresh();
    } catch (err) {
      setError(errorText(err));
      setStatus("idle");
    }
  }

  async function addBranch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setError(null);
    try {
      await api(`/companies/${company.id}/branches`, {
        body: {
          name: f.get("branchName"), stateCode: f.get("stateCode"), gstin: (f.get("gstin") as string) || null,
          address: { city: (f.get("city") as string) || undefined, pincode: (f.get("pincode") as string) || undefined },
        },
      });
      setAdding(false);
      router.refresh();
    } catch (err) {
      setError(errorText(err));
    }
  }

  const stateName = (code: string) => {
    const s = findState(code);
    return s ? (devanagari(locale) ? s.nameHi : s.name) : code;
  };

  return (
    <div className="flex flex-col gap-6">
      {error ? <Alert>{error}</Alert> : null}
      <Card>
        <form onSubmit={saveCompany} className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          <Field label={t("company.name")} htmlFor="name"><Input id="name" name="name" defaultValue={company.name} required disabled={!canEdit} /></Field>
          <Field label={t("company.legalName")} htmlFor="legalName"><Input id="legalName" name="legalName" defaultValue={company.legalName ?? ""} disabled={!canEdit} /></Field>
          <Field label={t("company.pan")} htmlFor="pan"><Input id="pan" name="pan" defaultValue={company.pan ?? ""} maxLength={10} pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]" className="uppercase tracking-wider" disabled={!canEdit} /></Field>
          <Field label={t("company.booksBegin")} htmlFor="books"><Input id="books" value={company.booksBeginOn} disabled readOnly /></Field>
          {canEdit ? (
            <div className="flex items-center gap-3 md:col-span-2 2xl:col-span-4">
              <Button type="submit" disabled={status === "saving"}>{status === "saving" ? t("common.saving") : t("common.save")}</Button>
              {status === "saved" ? <span className="text-sm text-success">{t("common.saved")}</span> : null}
            </div>
          ) : null}
        </form>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{t("company.branches")}</h2>
          {canEdit && !adding ? <Button variant="outline" onClick={() => setAdding(true)}><Plus className="size-4" aria-hidden />{t("company.addBranch")}</Button> : null}
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="py-2 pr-4 font-medium">{t("company.branchName")}</th>
                <th className="py-2 pr-4 font-medium">{t("auth.gstin")}</th>
                <th className="py-2 pr-4 font-medium">{t("auth.state")}</th>
                <th className="py-2 font-medium">{t("company.city")}</th>
              </tr>
            </thead>
            <tbody>
              {company.branches.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="py-2.5 pr-4">
                    {b.name}
                    {b.isHeadOffice ? <span className="ml-2 rounded bg-primary-soft px-1.5 py-0.5 text-xs text-primary">{t("company.headOffice")}</span> : null}
                  </td>
                  <td className="py-2.5 pr-4 font-mono tracking-wide">{b.gstin ?? <span className="font-sans text-muted">{t("company.unregistered")}</span>}</td>
                  <td className="py-2.5 pr-4">{stateName(b.stateCode)}</td>
                  <td className="py-2.5">{b.address.city ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {adding ? (
          <form onSubmit={addBranch} className="mt-5 grid gap-4 border-t border-border pt-5 md:grid-cols-2 2xl:grid-cols-5">
            <Field label={t("company.branchName")} htmlFor="branchName"><Input id="branchName" name="branchName" required /></Field>
            <Field label={t("auth.state")} htmlFor="stateCode">
              <Select id="stateCode" name="stateCode" defaultValue={company.branches[0]?.stateCode ?? "27"}>
                {GST_STATES.filter((s) => s.code !== "96").map((s) => <option key={s.code} value={s.code}>{s.code} · {devanagari(locale) ? s.nameHi : s.name}</option>)}
              </Select>
            </Field>
            <Field label={t("auth.gstin")} htmlFor="gstin"><Input id="gstin" name="gstin" maxLength={15} className="uppercase tracking-wider" /></Field>
            <Field label={t("company.city")} htmlFor="city"><Input id="city" name="city" /></Field>
            <Field label={t("company.pincode")} htmlFor="pincode"><Input id="pincode" name="pincode" inputMode="numeric" maxLength={6} pattern="[1-9][0-9]{5}" /></Field>
            <div className="flex gap-3 md:col-span-2 2xl:col-span-5">
              <Button type="submit">{t("common.add")}</Button>
              <Button type="button" variant="ghost" onClick={() => setAdding(false)}>{t("common.cancel")}</Button>
            </div>
          </form>
        ) : null}
      </Card>
    </div>
  );
}
