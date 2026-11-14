"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { Alert, Button, Field, Input } from "../ui";

export function AcceptInvite({ token, hasAccount }: { token: string; hasAccount: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function accept(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      await api("/invitations/accept", { body: { token, name: f.get("name") || undefined, password: f.get("password") } });
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "generic";
      if (code === "invite_invalid") setError(t("invite.invalid"));
      else setError(t.has(`auth.errors.${code}`) ? t(`auth.errors.${code}`) : t("auth.errors.generic"));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={accept} className="mt-8 flex flex-col gap-4">
      <p className="text-sm">{hasAccount ? t("invite.signInToAccept") : t("invite.createAccount")}</p>
      {error ? <Alert>{error}</Alert> : null}
      {!hasAccount ? <Field label={t("auth.name")} htmlFor="inv-name"><Input id="inv-name" name="name" required minLength={2} autoComplete="name" /></Field> : null}
      <Field label={t("auth.password")} htmlFor="inv-password" hint={hasAccount ? undefined : t("auth.passwordHint")}>
        <Input id="inv-password" name="password" type="password" required minLength={hasAccount ? 1 : 8} autoComplete={hasAccount ? "current-password" : "new-password"} />
      </Field>
      <Button type="submit" disabled={busy}>{t("invite.accept")}</Button>
    </form>
  );
}
