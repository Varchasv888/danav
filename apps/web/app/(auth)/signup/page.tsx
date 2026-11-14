"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { GST_STATES, validateGstin, devanagari } from "@varchasv/domain";
import { PasswordInput } from "@/components/PasswordInput";
import { Alert, Button, Field, Input, Select } from "@/components/ui";
import { ApiError, api } from "@/lib/client-api";

const INDUSTRIES = ["apparel", "general", "trading", "manufacturing", "retail", "services"] as const;

export default function SignupPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [stateCode, setStateCode] = useState("27");
  const [gstin, setGstin] = useState("");

  const errorText = (code: string) => (t.has(`auth.errors.${code}`) ? t(`auth.errors.${code}`) : t("auth.errors.generic"));

  // Checked locally as the user types, with the same rules the server applies.
  const gstinProblem = (() => {
    if (!gstin.trim()) return null;
    const g = validateGstin(gstin);
    if (!g.valid) return gstin.trim().length < 15 ? null : errorText(`gstin_${g.error}`);
    return g.stateCode !== stateCode ? errorText("gstin_state_mismatch") : null;
  })();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (gstinProblem) return;
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    setFieldErrors({});
    try {
      await api("/auth/signup", {
        body: {
          name: f.get("name"), email: f.get("email"), password: f.get("password"), businessName: f.get("businessName"),
          stateCode, gstin: gstin.trim() || undefined, industry: f.get("industry"), locale,
        },
      });
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.issues) {
        setFieldErrors(Object.fromEntries(err.issues.map((i) => [i.path, i.message])));
        setError(errorText("validation"));
      } else setError(errorText(err instanceof ApiError ? err.code : "generic"));
      setBusy(false);
    }
  }

  return (
    <>
      <h1 className="text-[1.75rem] leading-tight font-semibold">{t("auth.signupTitle")}</h1>
      <p className="mt-1 text-sm text-muted">{t("auth.signupSubtitle")}</p>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        {error ? <Alert>{error}</Alert> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("auth.name")} htmlFor="name" error={fieldErrors.name}>
            <Input id="name" name="name" autoComplete="name" required minLength={2} />
          </Field>
          <Field label={t("auth.email")} htmlFor="email" error={fieldErrors.email}>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </Field>
        </div>
        <Field label={t("auth.password")} htmlFor="password" hint={t("auth.passwordHint")} error={fieldErrors.password}>
          <PasswordInput id="password" name="password" autoComplete="new-password" required minLength={8} />
        </Field>
        <Field label={t("auth.businessName")} htmlFor="businessName" error={fieldErrors.businessName}>
          <Input id="businessName" name="businessName" autoComplete="organization" required minLength={2} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("auth.state")} htmlFor="state">
            <Select id="state" value={stateCode} onChange={(e) => setStateCode(e.target.value)}>
              {GST_STATES.filter((s) => s.code !== "96").map((s) => (
                <option key={s.code} value={s.code}>{s.code} · {devanagari(locale) ? s.nameHi : s.name}</option>
              ))}
            </Select>
          </Field>
          <Field label={t("auth.industry")} htmlFor="industry">
            <Select id="industry" name="industry" defaultValue="apparel">
              {INDUSTRIES.map((i) => <option key={i} value={i}>{t(`industry.${i}`)}</option>)}
            </Select>
          </Field>
        </div>
        <Field label={<>{t("auth.gstin")} <span className="font-normal text-muted">({t("common.optional")})</span></>} htmlFor="gstin" hint={t("auth.gstinHint")} error={gstinProblem}>
          <Input id="gstin" value={gstin} onChange={(e) => setGstin(e.target.value.toUpperCase())} maxLength={15} placeholder="27AAPFU0939F1ZV" aria-invalid={!!gstinProblem} className="uppercase tracking-wider" />
        </Field>
        <Button type="submit" disabled={busy || !!gstinProblem} className="mt-2">{t("auth.signup")}</Button>
      </form>
      <p className="mt-6 text-sm text-muted">
        {t("auth.haveAccount")} <Link href="/login" className="font-medium text-primary hover:underline">{t("auth.signInInstead")}</Link>
      </p>
    </>
  );
}
