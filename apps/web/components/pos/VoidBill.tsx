"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Button, Input } from "../ui";
import { POS_NS } from "./Checkout";

export function VoidBill({ id }: { id: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  if (!open) return <button type="button" onClick={() => setOpen(true)} className="text-xs text-danger hover:underline">{t("pos.bills.void")}</button>;
  return (
    <form className="flex flex-col items-end gap-1" onSubmit={async (e) => {
      e.preventDefault();
      setError(null);
      try { await api(`/pos/bills/${id}/void`, { body: { reason } }); router.refresh(); } catch (err) { setError(errorText(t, err, POS_NS)); }
    }}>
      <div className="flex gap-2">
        <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t("pos.bills.reason")} aria-label={t("pos.bills.reason")} minLength={3} maxLength={300} required className="h-8 w-44 text-xs" autoFocus />
        <Button type="submit" variant="danger" className="h-8 px-3 text-xs">{t("pos.bills.void")}</Button>
      </div>
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </form>
  );
}
