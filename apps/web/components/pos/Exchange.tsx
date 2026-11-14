"use client";

import { ArrowLeftRight, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { returnCredit } from "@varchasv/domain";
import { ApiError, api } from "@/lib/client-api";
import { rupees } from "@/lib/format";
import { Alert, Button, Input, Select } from "../ui";

const REASONS = ["size", "colour", "defect", "damaged", "not_liked", "other"] as const;
const GRADES = ["A", "B", "C"] as const;

interface SoldLine { id: string; name: string; qty: string; returnedQty: string; taxable: string; cgst: string; sgst: string; cess: string }
interface SoldBill { id: string; number: string; status: string; lines: SoldLine[] }
export interface ExchangeLine { lineId: string; name: string; qty: string; reason: (typeof REASONS)[number]; grade: (typeof GRADES)[number] }
export interface Exchange { billId: string; number: string; lines: ExchangeLine[]; credit: string }

/**
 * Goods coming back on this bill (F5): find the old bill, pick what comes back, and its credit pays for
 * the new pieces. The credit is worked out by the same rule the server uses.
 */
export function ExchangePanel({ value, onChange }: { value: Exchange | null; onChange: (e: Exchange | null) => void }) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState("");
  const [bill, setBill] = useState<SoldBill | null>(null);
  const [rows, setRows] = useState<Record<string, { qty: string; reason: ExchangeLine["reason"]; grade: ExchangeLine["grade"] }>>({});
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "F5") return;
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => input.current?.focus());
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  const find = async () => {
    setError(null);
    setBill(null);
    try {
      const b = await api<SoldBill>(`/pos/bills/lookup?number=${encodeURIComponent(number.trim())}`);
      if (b.status !== "paid") { setError(t("posReturns.errors.bill_void")); return; }
      setBill(b);
      setRows(Object.fromEntries(b.lines.map((l) => [l.id, { qty: "", reason: "size" as const, grade: "A" as const }])));
    } catch (err) { setError(err instanceof ApiError && err.status === 404 ? t("posReturns.notFound") : t("auth.errors.generic")); }
  };
  const left = (l: SoldLine) => Number(l.qty) - Number(l.returnedQty);
  const chosen = bill ? bill.lines.filter((l) => Number(rows[l.id]?.qty) > 0 && Number(rows[l.id]!.qty) <= left(l)) : [];
  const credit = chosen.length ? returnCredit(chosen.map((l) => ({ line: l, qty: rows[l.id]!.qty }))).refund : "0.00";
  const take = () => {
    if (!bill || !chosen.length) return;
    onChange({ billId: bill.id, number: bill.number, credit, lines: chosen.map((l) => ({ lineId: l.id, name: l.name, ...rows[l.id]! })) });
    setOpen(false);
    setBill(null);
    setNumber("");
  };

  if (value && !open) {
    const pieces = value.lines.reduce((s, l) => s + Number(l.qty), 0);
    return (
      <div className="flex items-center gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm">
        <ArrowLeftRight className="size-4 shrink-0 text-amber-600" aria-hidden />
        <span className="min-w-0 flex-1">{t("exchange.taking", { pieces, number: value.number })}</span>
        <span className="num font-semibold">− {rupees(value.credit)}</span>
        <button type="button" onClick={() => onChange(null)} className="rounded p-1 text-muted hover:text-danger" title={t("common.remove")}><X className="size-4" aria-hidden /><span className="sr-only">{t("common.remove")}</span></button>
      </div>
    );
  }
  if (!open) {
    return (
      <button type="button" onClick={() => { setOpen(true); requestAnimationFrame(() => input.current?.focus()); }}
        className="inline-flex items-center gap-2 self-start rounded-lg border border-dashed border-border px-3 py-1.5 text-sm text-muted hover:border-primary/40 hover:text-text">
        <ArrowLeftRight className="size-4" aria-hidden />{t("exchange.open")}<kbd className="rounded border border-border px-1 text-xs">F5</kbd>
      </button>
    );
  }
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-border bg-surface-2/50 p-3" aria-label={t("exchange.title")}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{t("exchange.title")}</h3>
        <button type="button" onClick={() => { setOpen(false); setBill(null); }} className="rounded p-1 text-muted hover:text-text" aria-label={t("common.close")}><X className="size-4" /></button>
      </div>
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); void find(); }}>
        <Input ref={input} value={number} onChange={(e) => setNumber(e.target.value.toUpperCase())} placeholder={t("posReturns.billNumber")} aria-label={t("posReturns.billNumber")} className="font-mono" />
        <Button type="submit" variant="outline" disabled={!number.trim()}><Search className="size-4" aria-hidden />{t("posReturns.find")}</Button>
      </form>
      {error ? <Alert>{error}</Alert> : null}
      {bill ? (
        <>
          <ul className="flex flex-col gap-2 text-sm">
            {bill.lines.map((l) => (
              <li key={l.id} className="grid grid-cols-[1fr_64px] gap-2 border-b border-border pb-2 last:border-0">
                <span className="min-w-0">{l.name}<span className="block text-xs text-muted">{t("posReturns.canReturn")}: {left(l)}</span></span>
                <Input value={rows[l.id]?.qty ?? ""} onChange={(e) => setRows({ ...rows, [l.id]: { ...rows[l.id]!, qty: e.target.value.replace(/[^\d.]/g, "") } })} inputMode="decimal" placeholder="0"
                  className="num h-8" disabled={left(l) <= 0} aria-label={t("posReturns.qty")} aria-invalid={Number(rows[l.id]?.qty) > left(l)} />
                {Number(rows[l.id]?.qty) > 0 ? (
                  <div className="col-span-2 grid grid-cols-2 gap-2">
                    <Select value={rows[l.id]!.reason} onChange={(e) => setRows({ ...rows, [l.id]: { ...rows[l.id]!, reason: e.target.value as ExchangeLine["reason"] } })} className="h-8 text-xs" aria-label={t("posReturns.reason")}>
                      {REASONS.map((r) => <option key={r} value={r}>{t(`posReturns.reasons.${r}`)}</option>)}
                    </Select>
                    <Select value={rows[l.id]!.grade} onChange={(e) => setRows({ ...rows, [l.id]: { ...rows[l.id]!, grade: e.target.value as ExchangeLine["grade"] } })} className="h-8 text-xs" aria-label={t("posReturns.condition")}>
                      {GRADES.map((g) => <option key={g} value={g}>{t(`posReturns.grades.${g}`)}</option>)}
                    </Select>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted">{t("exchange.credit")}: <span className="num font-semibold text-text">{rupees(credit)}</span></span>
            <Button onClick={take} disabled={!chosen.length}>{t("exchange.add")}</Button>
          </div>
        </>
      ) : null}
    </section>
  );
}
