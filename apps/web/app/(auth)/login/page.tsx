"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { PasswordInput } from "@/components/PasswordInput";
import { Alert, Button, Field, Input } from "@/components/ui";
import { ApiError, api } from "@/lib/client-api";

/**
 * Login page – two-user local system.
 *
 * Master login : master@store.local  /  Master@2024
 * Staff  login : staff@store.local   /  Staff@2024
 *
 * Staff can only sign in while the master is logged in on the server.
 */
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
      <p className="mt-1 text-sm text-muted">Enter your login ID and password to continue.</p>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        {error ? <Alert>{error}</Alert> : null}
        <Field label="Login ID" htmlFor="email">
          <Input id="email" name="email" type="email" autoComplete="email" required autoFocus placeholder="master@store.local" />
        </Field>
        <Field label="Password" htmlFor="password">
          <PasswordInput id="password" name="password" autoComplete="current-password" required />
        </Field>
        <Button type="submit" disabled={busy} className="mt-2">Sign in</Button>
      </form>
      <div className="mt-6 rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm text-muted">
        <p className="font-medium text-text mb-1">Login accounts</p>
        <p><span className="font-mono">master@store.local</span> — full year-round access</p>
        <p className="mt-0.5"><span className="font-mono">staff@store.local</span> — today's data only; requires master to be signed in</p>
      </div>
    </>
  );
}
