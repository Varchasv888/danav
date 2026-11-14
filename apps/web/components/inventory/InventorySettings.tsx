"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import type { WarehouseOption } from "@/lib/masters";
import { Alert, Button, Card, Field, Input } from "../ui";

export function InventorySettings({ setup, canChangeMethod, canAddWarehouse }: { setup: { warehouses: WarehouseOption[]; valuationMethod: string; valuationMethodLocked: boolean }; canChangeMethod: boolean; canAddWarehouse: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");

  const run = async (fn: () => Promise<unknown>) => {
    setError(null);
    try {
      await fn();
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError && err.code === "warehouse_name_taken" ? t("inventorySettings.nameTaken") : err instanceof ApiError && err.code === "valuation_method_locked" ? "The valuation method cannot be changed after stock transactions have been posted." : t("auth.errors.generic"));
    }
  };

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      {error ? <Alert>{error}</Alert> : null}
      <Card>
        <h2 className="font-semibold">{t("inventorySettings.valuation")}</h2>
        <p className="mt-1 text-sm text-muted">{setup.valuationMethodLocked ? "This method is locked because stock transactions already exist. Changing it would restate historical inventory values." : t("inventorySettings.valuationHint")}</p>
        <div role="radiogroup" className="mt-4 flex flex-wrap gap-3">
          {(["average", "fifo"] as const).map((m) => (
            <label key={m} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm ${setup.valuationMethod === m ? "border-primary bg-primary-soft" : "border-border"}`}>
              <input type="radio" name="method" checked={setup.valuationMethod === m} disabled={!canChangeMethod || setup.valuationMethodLocked}
                onChange={() => run(() => api("/inventory/valuation-method", { method: "PATCH", body: { method: m } }))} className="accent-[var(--primary)]" />
              <span className="first-letter:uppercase">{m === "fifo" ? t("stock.methodFifo") : t("stock.methodAverage")}</span>
            </label>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="font-semibold">{t("inventorySettings.warehouses")}</h2>
        <ul className="mt-3 divide-y divide-border text-sm">
          {setup.warehouses.map((w) => (
            <li key={w.id} className="flex items-center justify-between py-2">
              <span>{w.name}</span>
              {w.isDefault ? <span className="rounded bg-primary-soft px-2 py-0.5 text-xs text-primary">{t("inventorySettings.default")}</span> : null}
            </li>
          ))}
        </ul>
        {canAddWarehouse ? (
          <form className="mt-4 flex items-end gap-3" onSubmit={(e) => { e.preventDefault(); run(async () => { await api("/warehouses", { body: { name } }); setName(""); }); }}>
            <div className="flex-1"><Field label={t("inventorySettings.warehouseName")} htmlFor="wh-name"><Input id="wh-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} /></Field></div>
            <Button type="submit" variant="outline">{t("inventorySettings.addWarehouse")}</Button>
          </form>
        ) : null}
      </Card>
    </div>
  );
}
