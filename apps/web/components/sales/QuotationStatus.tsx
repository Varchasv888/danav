"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { Alert, Button } from "../ui";

/** Record the customer's answer to a quotation. */
export function QuotationStatus({ id, canAccept }: { id: string; canAccept: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const set = async (action: "accept" | "decline") => {
    setError(null);
    try {
      await api(`/quotations/${id}/${action}`, { body: {} });
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "generic";
      setError(t.has(`sales.errors.${code}`) ? t(`sales.errors.${code}`) : t("auth.errors.generic"));
    }
  };
  return (
    <>
      {canAccept ? <Button variant="outline" onClick={() => set("accept")}>{t("sales.quotations.accept")}</Button> : null}
      <Button variant="ghost" onClick={() => set("decline")}>{t("sales.quotations.decline")}</Button>
      {error ? <div className="w-full"><Alert>{error}</Alert></div> : null}
    </>
  );
}
