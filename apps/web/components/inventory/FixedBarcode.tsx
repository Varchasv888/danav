"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { Button, Card, Field, Input } from "../ui";

const PRINT_SELECTION = "varchasv.fixedBarcode.printIds";

type GoodsItem = { id: string; name: string; sku: string | null; barcode: string | null };

/** Assign codes only to the selected active goods, then hand those items to the existing label screen. */
export function FixedBarcode({ items }: { items: GoodsItem[] }) {
  const t = useTranslations("fixedBarcode");
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [assignedIds, setAssignedIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const unbarcoded = items.filter((item) => !item.barcode);
  const query = search.trim().toLocaleLowerCase();
  const visible = query
    ? unbarcoded.filter((item) => item.name.toLocaleLowerCase().includes(query) || (item.sku ?? "").toLocaleLowerCase().includes(query))
    : unbarcoded;
  const visibleIds = visible.map((item) => item.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
  const selectionAssigned = selectedIds.length > 0 && selectedIds.length === assignedIds.length && selectedIds.every((id) => assignedIds.includes(id));
  const printReady = selectionAssigned && selectedIds.every((id) => items.some((item) => item.id === id && item.barcode));

  const changeSelection = (update: (current: string[]) => string[]) => {
    setSelectedIds(update);
    setAssignedIds([]);
    setMessage("");
    setError("");
  };

  const assign = async () => {
    if (!selectedIds.length || busy) return;
    const ids = [...selectedIds];
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await api<{ assigned: number }>("/items/barcodes/generate", { body: { itemIds: ids } });
      setAssignedIds(ids);
      setMessage(t("assigned", { count: result.assigned }));
      router.refresh();
    } catch {
      setError(t("failed"));
    } finally {
      setBusy(false);
    }
  };

  const continueToLabels = () => {
    if (!printReady) return;
    sessionStorage.setItem(PRINT_SELECTION, JSON.stringify(selectedIds));
    router.push("/inventory/labels?fixedBarcode=1");
  };

  return (
    <div className="grid gap-4">
      <Card className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Field label={t("search")} htmlFor="fixed-barcode-search">
              <Input id="fixed-barcode-search" value={search} onChange={(event) => setSearch(event.target.value)} autoComplete="off" className="w-full" />
            </Field>
          </div>
          <p className="text-sm text-muted" aria-live="polite">{t("selected", { count: selectedIds.length })}</p>
        </div>

        {visible.length ? (
          <>
            <label className="flex min-h-10 items-center gap-2 text-sm text-muted">
              <input type="checkbox" checked={allVisibleSelected} disabled={busy} onChange={() => changeSelection((current) =>
                allVisibleSelected ? current.filter((id) => !visibleIds.includes(id)) : [...new Set([...current, ...visibleIds])],
              )} />
              {t("selectVisible")}
            </label>
            <ul className="grid gap-2 sm:grid-cols-2">
              {visible.map((item) => (
                <li key={item.id}>
                  <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2 hover:bg-surface-2">
                    <input type="checkbox" checked={selectedIds.includes(item.id)} disabled={busy} aria-label={t("selectItem", { name: item.name })}
                      onChange={() => changeSelection((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{item.name}</span>
                      <span className="block truncate font-mono text-xs text-muted">{item.sku || "-"}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </>
        ) : <p className="py-6 text-center text-sm text-muted">{query ? t("noResults") : t("empty")}</p>}
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="button" onClick={assign} disabled={!selectedIds.length || busy} className="min-h-11">
          {busy ? t("assigning") : t("assign")}
        </Button>
        <Button type="button" variant="outline" onClick={continueToLabels} disabled={!printReady} className="min-h-11">
          {t("print")}
        </Button>
        {message ? <p role="status" className="text-sm text-success">{message}</p> : null}
        {error ? <p role="alert" className="text-sm text-danger">{error}</p> : null}
      </div>
    </div>
  );
}