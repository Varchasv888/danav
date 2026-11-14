"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Card, Field, Input } from "../ui";

/** The value above which a purchase order waits for approval. Empty means no limit. */
export function PurchaseLimit({ limit, canEdit }: { limit: string | null; canEdit: boolean }) {
  const t = useTranslations("poApproval");
  const root = useTranslations();
  const router = useRouter();
  const [value, setValue] = useState(limit && Number(limit) > 0 ? String(Number(limit)) : "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null); setSaved(false);
    try { await api("/settings/purchase-approval", { method: "PUT", body: { limit: value.trim() === "" ? null : value.trim() } }); setSaved(true); router.refresh(); }
    catch (err) { setError(errorText(root, err, ["poApproval.errors"])); } finally { setBusy(false); }
  }
  return (
    <Card>
      <form onSubmit={save} className="flex flex-col gap-3">
        <div>
          <h2 className="font-semibold">{t("limitTitle")}</h2>
          <p className="mt-0.5 text-sm text-muted">{t("limitHelp")}</p>
        </div>
        {error ? <Alert>{error}</Alert> : null}
        <div className="flex flex-wrap items-end gap-3">
          <Field label={t("limitLabel")} htmlFor="po-limit" hint={t("limitHint")}>
            <Input id="po-limit" value={value} onChange={(e) => { setValue(e.target.value); setSaved(false); }} inputMode="decimal" disabled={!canEdit} className="num w-48" />
          </Field>
          {canEdit ? <Button type="submit" disabled={busy}>{t("save")}</Button> : null}
          {saved ? <span role="status" className="pb-2 text-sm text-success">{t("saved")}</span> : null}
        </div>
      </form>
    </Card>
  );
}
