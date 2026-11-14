"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Alert, Button, Card, Field, Input } from "@/components/ui";
import { ApiError, api } from "@/lib/client-api";

function useSubmit() {
  const t = useTranslations("auth");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const run = async (fn: () => Promise<string>) => {
    setBusy(true);
    setError(null);
    setDone(null);
    try {
      setDone(await fn());
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "generic";
      setError(t.has(`errors.${code}`) ? t(`errors.${code}`) : t("errors.generic"));
    }
    setBusy(false);
  };
  return { error, setError, done, busy, run };
}

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const t = useTranslations();
  const router = useRouter();
  const s = useSubmit();
  return (
    <Card className="p-5">
      <h2 className="font-semibold">{t("account.profile")}</h2>
      <form
        className="mt-4 flex max-w-md flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const value = String(new FormData(e.currentTarget).get("name"));
          s.run(async () => {
            await api("/auth/me", { method: "PATCH", body: { name: value } });
            router.refresh();
            return t("account.saved");
          });
        }}
      >
        {s.error ? <Alert>{s.error}</Alert> : null}
        <Field label={t("auth.email")}><Input value={email} readOnly disabled /></Field>
        <Field label={t("auth.name")} htmlFor="name"><Input id="name" name="name" defaultValue={name} minLength={2} maxLength={100} required /></Field>
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={s.busy}>{t("account.save")}</Button>
          {s.done ? <span role="status" className="text-sm text-success">{s.done}</span> : null}
        </div>
      </form>
    </Card>
  );
}

export function PasswordForm() {
  const t = useTranslations();
  const s = useSubmit();
  return (
    <Card className="p-5">
      <h2 className="font-semibold">{t("account.passwordTitle")}</h2>
      <form
        className="mt-4 flex max-w-md flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const data = new FormData(form);
          if (data.get("next") !== data.get("confirm")) return s.setError(t("auth.errors.passwords_differ"));
          s.run(async () => {
            await api("/auth/password", { body: { current: data.get("current"), next: data.get("next") } });
            form.reset();
            return t("account.passwordChanged");
          });
        }}
      >
        {s.error ? <Alert>{s.error}</Alert> : null}
        <Field label={t("account.currentPassword")} htmlFor="current"><Input id="current" name="current" type="password" autoComplete="current-password" required /></Field>
        <Field label={t("auth.newPassword")} hint={t("auth.passwordHint")} htmlFor="next"><Input id="next" name="next" type="password" autoComplete="new-password" minLength={8} required /></Field>
        <Field label={t("auth.confirmPassword")} htmlFor="confirm"><Input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required /></Field>
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={s.busy}>{t("account.passwordTitle")}</Button>
          {s.done ? <span role="status" className="text-sm text-success">{s.done}</span> : null}
        </div>
      </form>
    </Card>
  );
}
