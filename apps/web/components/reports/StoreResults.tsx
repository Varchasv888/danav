"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

interface Data {
  rows: { warehouseId: string; store: string; sales: string; grossMargin: string | null; expenses: string; result: string | null; lines: { account: string; amount: string }[] }[];
  accounts: { id: string; name: string }[];
  allocated: string; unallocated: { account: string; amount: string }[]; unallocatedTotal: string;
  rules: { accountId: string; account: string; basis: string; shares: Record<string, string> | null }[];
}

/** Each store's sales, gross margin, share of the expenses and what is left, with the rule that spreads each expense. */
export function StoreResults({ data, from, to, canEdit }: { data: Data; from: string; to: string; canEdit: boolean }) {
  const t = useTranslations("storeResults");
  const tx = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });
  const [accountId, setAccountId] = useState(data.accounts[0]?.id ?? "");
  const [basis, setBasis] = useState("sales");
  const [shares, setShares] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      await api(`/finance/allocation-rules/${accountId}`, { method: "PUT", body: { basis, ...(basis === "fixed" ? { shares } : {}) } });
      router.refresh();
    } catch (err) { setError(errorText(tx, err, ["storeResults.errors"])); } finally { setBusy(false); }
  }
  async function remove(id: string) {
    setBusy(true); setError(null);
    try { await api(`/finance/allocation-rules/${id}`, { method: "DELETE" }); router.refresh(); } catch (err) { setError(errorText(tx, err, ["storeResults.errors"])); } finally { setBusy(false); }
  }

  return (
    <div className="flex flex-col gap-4">
      <form method="get" className="flex flex-wrap items-end gap-3">
        <Field label={t("from")}><Input type="date" name="from" defaultValue={from} /></Field>
        <Field label={t("to")}><Input type="date" name="to" defaultValue={to} /></Field>
        <Button type="submit" variant="outline">{t("show")}</Button>
      </form>
      {error ? <Alert>{error}</Alert> : null}
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted"><tr className="border-b border-rule"><th className="px-4 py-1.5 font-medium">{t("store")}</th><th className="px-4 py-1.5 text-right font-medium">{t("sales")}</th><th className="px-4 py-1.5 text-right font-medium">{t("margin")}</th><th className="px-4 py-1.5 text-right font-medium">{t("expenses")}</th><th className="px-4 py-1.5 text-right font-medium">{t("result")}</th></tr></thead>
          <tbody>{data.rows.map((r) => (
            <tr key={r.warehouseId} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{r.store}</td><td className="num px-4 py-1.5 text-right">{money(r.sales)}</td><td className="num px-4 py-1.5 text-right">{r.grossMargin ? money(r.grossMargin) : "-"}</td><td className="num px-4 py-1.5 text-right">{money(r.expenses)}</td><td className="num px-4 py-1.5 text-right font-medium">{r.result ? money(r.result) : "-"}</td></tr>
          ))}</tbody>
        </table>
      </Card>
      {data.unallocated.length ? <Card className="p-4 text-sm"><p className="mb-1 font-medium">{t("unallocated", { total: money(data.unallocatedTotal) })}</p><p className="text-muted">{data.unallocated.map((u) => `${u.account} ${money(u.amount)}`).join(", ")}</p></Card> : null}
      <Card className="p-4">
        <h2 className="mb-2 text-sm font-medium">{t("rules")}</h2>
        {data.rules.length ? <ul className="mb-3 text-sm">{data.rules.map((r) => <li key={r.accountId} className="flex items-center justify-between border-b border-rule py-1">{r.account}: {t(`basis.${r.basis}`)}{canEdit ? <Button variant="ghost" disabled={busy} onClick={() => remove(r.accountId)}>{t("remove")}</Button> : null}</li>)}</ul> : <p className="mb-3 text-sm text-muted">{t("noRules")}</p>}
        {canEdit ? (
          <form onSubmit={save} className="grid gap-3 sm:grid-cols-3">
            <Field label={t("account")}><Select value={accountId} onChange={(e) => setAccountId(e.target.value)}>{data.accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</Select></Field>
            <Field label={t("spreadBy")}><Select value={basis} onChange={(e) => setBasis(e.target.value)}><option value="sales">{t("basis.sales")}</option><option value="stock">{t("basis.stock")}</option><option value="equal">{t("basis.equal")}</option><option value="fixed">{t("basis.fixed")}</option></Select></Field>
            <div className="flex items-end"><Button type="submit" disabled={busy || !accountId}>{t("save")}</Button></div>
            {basis === "fixed" ? data.rows.map((r) => <Field key={r.warehouseId} label={`${r.store} %`}><Input value={shares[r.warehouseId] ?? ""} onChange={(e) => setShares({ ...shares, [r.warehouseId]: e.target.value })} inputMode="decimal" className="num" /></Field>) : null}
          </form>
        ) : null}
      </Card>
    </div>
  );
}
