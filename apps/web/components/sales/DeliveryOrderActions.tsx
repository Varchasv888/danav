"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button } from "../ui";

/** Close a delivery order that will not be sent in full, or cancel one nothing has gone out against. */
export function DeliveryOrderActions({ id, canClose, canCancel }: { id: string; canClose: boolean; canCancel: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function act(what: "close" | "cancel") {
    setBusy(true);
    setError(null);
    try {
      await api(`/delivery-orders/${id}/${what}`, { body: {} });
      router.refresh();
    } catch (err) { setError(errorText(t, err, ["deliveryOrders.errors"])); } finally { setBusy(false); }
  }

  return (
    <>
      {canClose ? <Button type="button" variant="outline" disabled={busy} onClick={() => act("close")}>{t("deliveryOrders.close")}</Button> : null}
      {canCancel ? <Button type="button" variant="outline" disabled={busy} onClick={() => act("cancel")}>{t("deliveryOrders.cancel")}</Button> : null}
      {error ? <div className="w-full"><Alert>{error}</Alert></div> : null}
    </>
  );
}
