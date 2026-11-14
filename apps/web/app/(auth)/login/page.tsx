"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { PasswordInput } from "@/components/PasswordInput";
import { Alert, Button, Field, Input } from "@/components/ui";
import { ApiError, api } from "@/lib/client-api";

/** Sign-in form for local accounts. */
export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");
    setBusy(true);
    setError(null);
    try {
      await api("/auth/local-login", { body: { email, password } });
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "generic";
      const msg =
        code === "staff_requires_master_online"
          ? "Staff login is unavailable — the master account must be signed in first."
          : code === "invalid_credentials"
          ? "Incorrect login ID or password."
          : t.has(`errors.${code}`) ? t(`errors.${code}`) : t("errors.generic");
      setError(msg);
      setBusy(false);
    }
  }

  return (
    <>
      <h1 className="text-[1.75rem] leading-tight font-semibold">Sign in</h1>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        {error ? <Alert>{error}</Alert> : null}
        <Field label="Login ID" htmlFor="email">
          <Input id="email" name="email" type="email" autoComplete="email" required autoFocus />
        </Field>
        <Field label="Password" htmlFor="password">
          <PasswordInput id="password" name="password" autoComplete="current-password" required />
        </Field>
        <Button type="submit" disabled={busy} className="mt-2">Sign in</Button>
      </form>
    </>
  );
}
