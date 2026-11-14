"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

interface Option { id: string; name: string }

/** Brings a store's stock (all of it, or one brand, category or design) to zero so it can be counted from scratch. Asks for the password again. */
export function ResetStock({ warehouses, brands, categories, styles }: { warehouses: Option[]; brands: string[]; categories: string[]; styles: Option[] }) {
  const t = useTranslations();
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id ?? "");
  const [by, setBy] = useState<"all" | "brand" | "category" | "styleId">("all");
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  const [sure, setSure] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ items: number; pieces: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const options = by === "brand" ? brands.map((b) => ({ id: b, name: b })) : by === "category" ? categories.map((b) => ({ id: b, name: b })) : by === "styleId" ? styles : [];

  async function go(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null); setDone(null);
    try {
      setDone(await api<{ items: number; pieces: string }>("/inventory/reset-stock", { body: { warehouseId, reason, scope: by === "all" ? { all: true } : { [by]: value } } }));
      setSure(false);
    } catch (err) { setError(errorText(t, err, ["resetStock.errors"])); } finally { setBusy(false); }
  }

  return (
    <Card className="max-w-2xl p-4">
      <p className="mb-3 text-sm text-muted">{t("resetStock.help")}</p>
      {error ? <Alert>{error}</Alert> : null}
      {done ? <p className="mb-3 text-sm text-success" role="status">{t("resetStock.done", { items: done.items, pieces: done.pieces })}</p> : null}
      <form onSubmit={go} className="grid gap-3 sm:grid-cols-2">
        <Field label={t("resetStock.store")}><Select value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)}>{warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</Select></Field>
        <Field label={t("resetStock.which")}><Select value={by} onChange={(e) => { setBy(e.target.value as typeof by); setValue(""); }}><option value="all">{t("resetStock.all")}</option><option value="brand">{t("resetStock.brand")}</option><option value="category">{t("resetStock.category")}</option><option value="styleId">{t("resetStock.design")}</option></Select></Field>
        {by !== "all" ? <Field label={t("resetStock.pick")}><Select value={value} onChange={(e) => setValue(e.target.value)}><option value="">-</option>{options.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</Select></Field> : null}
        <div className="sm:col-span-2"><Field label={t("resetStock.reason")}><Input value={reason} onChange={(e) => setReason(e.target.value)} minLength={5} maxLength={200} required /></Field></div>
        <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={sure} onChange={(e) => setSure(e.target.checked)} />{t("resetStock.sure")}</label>
        <div className="sm:col-span-2"><Button type="submit" variant="danger" disabled={busy || !sure || (by !== "all" && !value) || reason.trim().length < 5}>{t("resetStock.go")}</Button></div>
      </form>
    </Card>
  );
}
