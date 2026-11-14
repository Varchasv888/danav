"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { Alert, Button, Field, Input } from "./ui";

/** "Cancel with a reason" for any posted document (the API keeps it, marked cancelled, with reversals). */
export function CancelDocument({ path, label }: { path: string; label: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function cancel(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api(path, { body: { reason } });
      setOpen(false);
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "generic";
      const key = [`purchase.errors.${code}`, `vouchers.errors.${code}`, `sj.errors.${code}`, `payroll.errors.${code}`, `sales.errors.${code}`, `mfg.errors.${code}`, `pos.errors.${code}`, `assets.errors.${code}`, `expenses.errors.${code}`, `projects.errors.${code}`, `banking.errors.${code}`].find((k) => t.has(k));
      setError(key ? t(key) : t("auth.errors.generic"));
    }
  }

  if (!open) return <div className="mt-4"><Button variant="outline" onClick={() => setOpen(true)} className="text-danger">{label}</Button></div>;
  return (
    <form onSubmit={cancel} className="mt-4 flex max-w-xl flex-col gap-3">
      {error ? <Alert>{error}</Alert> : null}
      <Field label={t("vouchers.cancelReason")} htmlFor="cancel-reason">
        <Input id="cancel-reason" value={reason} onChange={(e) => setReason(e.target.value)} required minLength={3} maxLength={300} autoFocus />
      </Field>
      <div className="flex gap-3">
        <Button type="submit" variant="danger">{label}</Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>{t("common.close")}</Button>
      </div>
    </form>
  );
}
