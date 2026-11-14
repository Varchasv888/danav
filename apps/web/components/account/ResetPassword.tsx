"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Alert, Button, Field, Input } from "@/components/ui";
import { ApiError, api } from "@/lib/client-api";

export function ResetPassword({ token }: { token: string }) {
  const t = useTranslations("auth");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<{ code: string; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (form.get("password") !== form.get("confirm")) return setError({ code: "passwords_differ", text: t("errors.passwords_differ") });
    setBusy(true);
    setError(null);
    try {
      await api("/auth/password/reset", { body: { token, password: form.get("password") } });
      setDone(true);
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "generic";
      setError({ code, text: t.has(`errors.${code}`) ? t(`errors.${code}`) : t("errors.generic") });
    }
    setBusy(false);
  }

  if (done) {
    return (
      <>
        <p role="status" className="mt-8 rounded-lg bg-success-soft p-4 text-sm text-success">{t("resetDone")}</p>
        <Link href="/login" className="mt-6 text-sm font-medium text-primary hover:underline">{t("login")}</Link>
      </>
    );
  }
  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
      {error ? <Alert>{error.text}</Alert> : null}
      {error?.code === "invalid_or_expired_link" ? (
        <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">{t("sendLink")}</Link>
      ) : null}
      <Field label={t("newPassword")} hint={t("passwordHint")} htmlFor="password">
        <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required autoFocus />
      </Field>
      <Field label={t("confirmPassword")} htmlFor="confirm">
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required />
      </Field>
      <Button type="submit" disabled={busy} className="mt-2">{t("setPassword")}</Button>
    </form>
  );
}
