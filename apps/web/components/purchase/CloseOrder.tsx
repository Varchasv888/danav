"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/client-api";
import { Button } from "../ui";

export function CloseOrder({ id, path = "/purchase-orders", label }: { id: string; path?: string; label?: string }) {
  const t = useTranslations("purchase.orders");
  const router = useRouter();
  return (
    <Button variant="ghost" onClick={async () => { await api(`${path}/${id}/close`, { body: {} }); router.refresh(); }}>
      {label ?? t("close")}
    </Button>
  );
}
