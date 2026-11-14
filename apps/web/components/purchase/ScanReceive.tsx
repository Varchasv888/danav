"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { todayIso } from "@/lib/format";
import { Alert, Button, Card, Input } from "../ui";

interface Check {
  order: { id: string; number: string; supplierId: string };
  rows: { lineId: string; itemId: string; item: string; rate: string; open: string; counted: string; difference: string; state: "complete" | "short" | "over" }[];
  notOnOrder: { itemId: string; item: string; qty: string }[];
  unknown: { code: string; qty: string }[];
  problems: number; allIn: boolean;
}

/**
 * Receiving at the gate: scan each piece (or type a code and a count), see at once what is short or over against the order, then make the goods receipt
 * from the counts. Counts are kept on this screen until the receipt is made.
 */
export function ScanReceive({ orderId }: { orderId: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [scans, setScans] = useState<{ code: string; qty: number }[]>([]);
  const [check, setCheck] = useState<Check | null>(null);
  const [code, setCode] = useState("");
  const [qty, setQty] = useState("1");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const box = useRef<HTMLInputElement>(null);
  useEffect(() => { box.current?.focus(); void recheck([]); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function recheck(next: { code: string; qty: number }[]) {
    setError(null);
    try { setCheck(await api<Check>(`/purchase-orders/${orderId}/receiving-check`, { body: { scans: next } })); setScans(next); }
    catch (err) { setError(errorText(t, err, ["scanReceive.errors", "purchase.errors"])); }
  }
  async function add(e: React.FormEvent) {
    e.preventDefault();
    const c = code.trim(), n = Number(qty);
    if (!c || !(n > 0)) return;
    setBusy(true);
    await recheck([...scans, { code: c, qty: n }]);
    setBusy(false); setCode(""); setQty("1"); box.current?.focus();
  }
  async function make() {
    if (!check) return;
    setBusy(true); setError(null);
    try {
      const lines = check.rows.filter((r) => Number(r.counted) > 0).map((r) => ({ itemId: r.itemId, qty: String(Number(r.counted)), rate: r.rate, orderLineId: r.lineId }));
      const r = await api<{ id: string }>("/goods-receipts", { body: { supplierId: check.order.supplierId, orderId, date: todayIso(), lines } });
      router.push(`/purchase/receipts/${r.id}`);
    } catch (err) { setError(errorText(t, err, ["scanReceive.errors", "purchase.errors", "inventory.errors"])); setBusy(false); }
  }
  if (!check) return error ? <Alert>{error}</Alert> : <p className="text-sm text-muted">{t("common.loading")}</p>;
  const n = (v: string) => String(Number(v));
  const counted = check.rows.reduce((s, r) => s + Number(r.counted), 0);

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4">
        <form onSubmit={add} className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm"><span className="text-muted">{t("scanReceive.code")}</span>
            <Input ref={box} value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" className="w-64 font-mono" aria-label={t("scanReceive.code")} /></label>
          <label className="flex flex-col gap-1 text-sm"><span className="text-muted">{t("scanReceive.qty")}</span>
            <Input value={qty} onChange={(e) => setQty(e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" className="num w-20" aria-label={t("scanReceive.qty")} /></label>
          <Button type="submit" disabled={busy || !code.trim()}>{t("scanReceive.add")}</Button>
          {scans.length ? <Button type="button" variant="ghost" onClick={() => void recheck([])}>{t("scanReceive.clear")}</Button> : null}
        </form>
      </Card>
      {error ? <Alert>{error}</Alert> : null}
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="text-left text-muted"><tr className="border-b border-border">
            <th className="px-4 py-2 font-medium">{t("scanReceive.item")}</th><th className="px-3 py-2 text-right font-medium">{t("scanReceive.open")}</th>
            <th className="px-3 py-2 text-right font-medium">{t("scanReceive.counted")}</th><th className="px-4 py-2 text-right font-medium">{t("scanReceive.check")}</th></tr></thead>
          <tbody>{check.rows.map((r) => (
            <tr key={r.lineId} className="border-b border-rule last:border-0">
              <td className="px-4 py-2">{r.item}</td><td className="num px-3 py-2 text-right">{n(r.open)}</td><td className="num px-3 py-2 text-right font-medium">{n(r.counted)}</td>
              <td className={clsx("px-4 py-2 text-right", r.state === "complete" ? "text-success" : "text-danger")}>{r.state === "complete" ? t("scanReceive.complete") : t(`scanReceive.${r.state}`, { n: n(String(Math.abs(Number(r.difference)))) })}</td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
      {check.notOnOrder.length ? <p className="text-sm text-danger">{t("scanReceive.notOnOrder", { items: check.notOnOrder.map((x) => `${x.item} (${n(x.qty)})`).join(", ") })}</p> : null}
      {check.unknown.length ? <p className="text-sm text-danger">{t("scanReceive.unknown", { codes: check.unknown.map((x) => x.code).join(", ") })}</p> : null}
      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={busy || counted <= 0} onClick={() => void make()}>{t("scanReceive.make")}</Button>
        {counted > 0 && !check.allIn ? <span className="text-sm text-muted">{t("scanReceive.partial")}</span> : null}
      </div>
    </div>
  );
}
