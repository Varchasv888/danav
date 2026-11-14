"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { Alert, Button, Field, Input } from "../ui";

export function CancelVoucher({ id }: { id: string }) {
  const t = useTranslations("vouchers");
  const tc = useTranslations("common");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function cancel(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api(`/vouchers/${id}/cancel`, { body: { reason } });
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "generic";
      setError(t.has(`errors.${code}`) ? t(`errors.${code}`) : code);
    }
  }

  if (!open) return <div className="mt-4"><Button variant="outline" onClick={() => setOpen(true)} className="text-danger">{t("cancel")}</Button></div>;
  return (
    <form onSubmit={cancel} className="mt-4 flex max-w-xl flex-col gap-3">
      {error ? <Alert>{error}</Alert> : null}
      <Field label={t("cancelReason")} htmlFor="cancel-reason">
        <Input id="cancel-reason" value={reason} onChange={(e) => setReason(e.target.value)} required minLength={3} maxLength={300} autoFocus />
      </Field>
      <div className="flex gap-3">
        <Button type="submit" variant="danger">{t("cancel")}</Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>{tc("close")}</Button>
      </div>
    </form>
  );
}
