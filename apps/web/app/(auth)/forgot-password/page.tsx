"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Alert, Button, Field, Input } from "@/components/ui";
import { ApiError, api } from "@/lib/client-api";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email"));
    setBusy(true);
    setError(null);
    try {
      await api("/auth/password/forgot", { body: { email } });
      setSentTo(email);
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "generic";
      setError(t.has(`errors.${code}`) ? t(`errors.${code}`) : t("errors.generic"));
    }
    setBusy(false);
  }

  return (
    <>
      <h1 className="text-[1.75rem] leading-tight font-semibold">{t("forgotTitle")}</h1>
      <p className="mt-1 text-sm text-muted">{t("forgotSubtitle")}</p>
      {sentTo ? (
        <p role="status" className="mt-8 rounded-lg bg-success-soft p-4 text-sm text-success">{t("forgotSent", { email: sentTo })}</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
          {error ? <Alert>{error}</Alert> : null}
          <Field label={t("email")} htmlFor="email">
            <Input id="email" name="email" type="email" autoComplete="email" required autoFocus />
          </Field>
          <Button type="submit" disabled={busy} className="mt-2">{t("sendLink")}</Button>
        </form>
      )}
      <p className="mt-6 text-sm"><Link href="/login" className="font-medium text-primary hover:underline">{t("backToLogin")}</Link></p>
    </>
  );
}
