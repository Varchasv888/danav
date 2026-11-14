"use client";

import { ImportScans } from "./ImportScans";
import { CheckCircle2, RotateCcw, ScanBarcode, Send, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { rupees } from "@/lib/format";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

const NS = ["counts.errors", "sj.errors"];

/** Start a count: which store, what part of it, and whether counters see the book figures. */
export function StartCount({ warehouses, scopes }: {
  warehouses: { id: string; name: string }[]; scopes: { brands: string[]; categories: string[]; styles: { id: string; code: string; name: string }[] };
}) {
  const t = useTranslations();
  const router = useRouter();
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id ?? "");
  const [name, setName] = useState("");
  const [by, setBy] = useState<"all" | "brand" | "category" | "styleId">("all");
  const [value, setValue] = useState("");
  const [blind, setBlind] = useState(true);
  const [spot, setSpot] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const options = by === "brand" ? scopes.brands.map((b) => [b, b]) : by === "category" ? scopes.categories.map((c) => [c, c]) : by === "styleId" ? scopes.styles.map((s) => [s.id, `${s.code} ${s.name}`]) : [];

  async function start(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const label = by === "all" ? t("counts.wholeStore") : options.find(([v]) => v === value)?.[1] ?? value;
      const r = await api<{ id: string }>("/stock-counts", { body: { warehouseId, name: name.trim() || label, blind, ...(spot ? { verifyOnly: true } : {}), ...(by !== "all" && value ? { scope: { [by]: value } } : {}) } });
      router.push(`/inventory/counts/${r.id}`);
    } catch (err) { setError(errorText(t, err, NS)); setBusy(false); }
  }
  return (
    <Card>
      <form onSubmit={start} className="grid gap-4 md:grid-cols-2 xl:grid-cols-5 xl:items-end">
        <Field label={t("stock.warehouse")} htmlFor="sc-wh">
          <Select id="sc-wh" value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)}>{warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</Select>
        </Field>
        <Field label={t("counts.what")} htmlFor="sc-by">
          <Select id="sc-by" value={by} onChange={(e) => { setBy(e.target.value as typeof by); setValue(""); }}>
            {(["all", "brand", "category", "styleId"] as const).map((k) => <option key={k} value={k}>{t(`counts.by.${k}`)}</option>)}
          </Select>
        </Field>
        {by !== "all" ? (
          <Field label={t(`counts.by.${by}`)} htmlFor="sc-val">
            <Select id="sc-val" value={value} onChange={(e) => setValue(e.target.value)} required>
              <option value="" />{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </Select>
          </Field>
        ) : null}
        <Field label={t("counts.name")} htmlFor="sc-name"><Input id="sc-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder={t("counts.namePlaceholder")} /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={spot} onChange={(e) => setSpot(e.target.checked)} className="size-4 accent-[var(--primary)]" />{t("counts.spotCheck")}</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={blind} onChange={(e) => setBlind(e.target.checked)} className="size-4 accent-[var(--primary)]" />{t("counts.blind")}</label>
        <div className="flex items-center gap-3 md:col-span-2 xl:col-span-5">
          <Button type="submit" disabled={busy || !warehouseId}><ScanBarcode className="size-4" aria-hidden />{t("counts.start")}</Button>
          {error ? <span className="text-sm text-danger">{error}</span> : null}
        </div>
      </form>
    </Card>
  );
}

interface CountLine { itemId: string; name: string; barcode: string | null; sku: string | null; design: string | null; color: string | null; size: string | null; counted: string; expected?: string; diff?: string; value?: string }
export interface CountView {
  id: string; number: string; name: string; store: string; status: "counting" | "submitted" | "approved" | "cancelled"; blind: boolean; showBooks: boolean; reason: string | null; journalId: string | null;
  lines: CountLine[];
  totals: { items: number; countedPieces: string; counted: number; expectedPieces?: string; short?: string; excess?: string; net?: string; differences?: number };
}

/**
 * Counting a store: scan each piece (or type "5*barcode" for five), see the running count, then
 * submit. An approver sees the differences and their value and approves them into the books.
 */
export function CountScreen({ count, canApprove, canEdit }: { count: CountView; canApprove: boolean; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [scans, setScans] = useState<{ name: string; counted: string; extra: boolean; at: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState("");
  const [onlyDiff, setOnlyDiff] = useState(true);
  const [counts, setCounts] = useState<Record<string, string>>(() => Object.fromEntries(count.lines.map((l) => [l.itemId, l.counted])));
  const input = useRef<HTMLInputElement>(null);
  const counting = count.status === "counting";
  useEffect(() => { if (counting) input.current?.focus(); }, [counting]);

  async function scan(e: React.FormEvent) {
    e.preventDefault();
    const raw = code.trim();
    if (!raw) return;
    const m = /^(\d+(?:\.\d+)?)\s*[*x]\s*(.+)$/i.exec(raw);
    setCode("");
    setError(null);
    try {
      const r = await api<{ itemId: string; name: string; counted: string; extra: boolean }>(`/stock-counts/${count.id}/scan`, { body: { code: m ? m[2]! : raw, ...(m ? { qty: m[1] } : {}) } });
      setCounts((c) => ({ ...c, [r.itemId]: r.counted }));
      setScans((s) => [{ name: r.name, counted: r.counted, extra: r.extra, at: Date.now() }, ...s].slice(0, 8));
      if (r.extra) router.refresh();
    } catch (err) { setError(`${raw}: ${errorText(t, err, NS)}`); }
    input.current?.focus();
  }
  const act = async (path: string, body: unknown = {}) => {
    setBusy(true);
    setError(null);
    try { await api(`/stock-counts/${count.id}/${path}`, { body }); router.refresh(); } catch (err) { setError(errorText(t, err, NS)); } finally { setBusy(false); }
  };
  const saveTyped = async (itemId: string, v: string) => {
    if (!/^\d+(\.\d{1,4})?$/.test(v) || v === count.lines.find((l) => l.itemId === itemId)?.counted) return;
    try { await api(`/stock-counts/${count.id}/lines`, { method: "PUT", body: { lines: [{ itemId, counted: v }] } }); } catch (err) { setError(errorText(t, err, NS)); }
  };
  const pieces = Object.values(counts).reduce((s, v) => s + (Number(v) || 0), 0);
  const shown = count.showBooks && onlyDiff && !counting ? count.lines.filter((l) => Number(l.diff) !== 0) : count.lines;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm"><a href={`/print/count-sheet/${count.id}`} target="_blank" rel="noreferrer" className="text-primary underline">{t("counts.printSheet")}</a></p>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {counting ? (
          <Card className="flex flex-col gap-3">
            <form onSubmit={scan} className="flex gap-2">
              <div className="relative flex-1">
                <ScanBarcode className="pointer-events-none absolute top-3 left-3 size-5 text-muted" aria-hidden />
                <Input ref={input} value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("counts.scanHere")} aria-label={t("counts.scanHere")} className="h-11 pl-10 font-mono text-base" autoComplete="off" />
              </div>
              <Button type="submit" className="h-11">{t("counts.add")}</Button>
            </form>
            <p className="text-xs text-muted">{t("counts.scanHint")}</p>
            {canEdit ? <ImportScans countId={count.id} /> : null}
            {error ? <Alert>{error}</Alert> : null}
            <ul className="flex flex-col gap-1 text-sm">
              {scans.map((s) => (
                <li key={s.at} className="flex items-center justify-between rounded-md bg-surface-2/60 px-3 py-1.5">
                  <span>{s.name}{s.extra ? <span className="ml-2 text-xs text-amber-600">{t("counts.outOfScope")}</span> : null}</span>
                  <span className="num font-semibold">{Number(s.counted)}</span>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <Card className="flex flex-col gap-2">
            <p className="flex items-center gap-2 font-semibold">
              {count.status === "approved" ? <CheckCircle2 className="size-5 text-success" aria-hidden /> : null}
              {t(`counts.status.${count.status}`)}
            </p>
            {count.reason ? <p className="text-sm text-muted">{count.reason}</p> : null}
            {count.journalId ? <a href={`/inventory/journals/${count.journalId}`} className="text-sm text-primary hover:underline">{t("counts.journal")} →</a> : null}
            {error ? <Alert>{error}</Alert> : null}
          </Card>
        )}
        <Card className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between"><span className="text-muted">{t("counts.piecesCounted")}</span><span className="num text-lg font-semibold">{pieces.toLocaleString("en-IN")}</span></div>
          <div className="flex justify-between"><span className="text-muted">{t("counts.itemsCounted")}</span><span className="num">{Object.values(counts).filter((v) => Number(v) > 0).length} / {count.totals.items}</span></div>
          {count.showBooks && count.totals.expectedPieces !== undefined ? (
            <>
              <div className="flex justify-between"><span className="text-muted">{t("counts.inBooks")}</span><span className="num">{Number(count.totals.expectedPieces).toLocaleString("en-IN")}</span></div>
              {!counting ? (
                <>
                  <div className="flex justify-between"><span className="text-muted">{t("counts.short")}</span><span className="num text-danger">{rupees(count.totals.short!)}</span></div>
                  <div className="flex justify-between"><span className="text-muted">{t("counts.excess")}</span><span className="num">{rupees(count.totals.excess!)}</span></div>
                  <div className="flex justify-between border-t border-border pt-2 font-semibold"><span>{t("counts.net")}</span><span className="num">{rupees(count.totals.net!)}</span></div>
                </>
              ) : null}
            </>
          ) : <p className="text-xs text-muted">{t("counts.blindNote")}</p>}
          {counting && canEdit ? <Button onClick={() => act("submit")} disabled={busy} className="mt-2"><Send className="size-4" aria-hidden />{t("counts.submit")}</Button> : null}
          {counting && canEdit ? <Button variant="outline" onClick={() => { if (window.confirm(t("counts.resetConfirm"))) void act("reset"); }} disabled={busy} className="mt-2"><RotateCcw className="size-4" aria-hidden />{t("counts.reset")}</Button> : null}
          {count.status === "submitted" && canApprove ? (
            <div className="mt-2 flex flex-col gap-2">
              {count.totals.differences ? <Field label={t("counts.reason")} htmlFor="sc-reason"><Input id="sc-reason" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} /></Field> : null}
              <Button onClick={() => act("approve", reason.trim() ? { reason: reason.trim() } : {})} disabled={busy || (!!count.totals.differences && reason.trim().length < 3)}>
                <CheckCircle2 className="size-4" aria-hidden />{count.totals.differences ? t("counts.approveAdjust", { n: count.totals.differences }) : t("counts.approveNone")}
              </Button>
              <Button variant="outline" onClick={() => act("reopen")} disabled={busy}><RotateCcw className="size-4" aria-hidden />{t("counts.recount")}</Button>
            </div>
          ) : count.status === "submitted" ? <p className="text-xs text-muted">{t("counts.waitingApproval")}</p> : null}
          {(counting || count.status === "submitted") && canApprove ? <Button variant="ghost" onClick={() => { if (window.confirm(t("counts.cancelConfirm"))) void act("cancel"); }} disabled={busy}><X className="size-4" aria-hidden />{t("counts.cancel")}</Button> : null}
        </Card>
      </div>
      <Card className="p-0">
        {count.showBooks && !counting ? (
          <label className="flex items-center gap-2 border-b border-border px-4 py-2 text-sm"><input type="checkbox" checked={onlyDiff} onChange={(e) => setOnlyDiff(e.target.checked)} className="size-4 accent-[var(--primary)]" />{t("counts.onlyDiff")}</label>
        ) : null}
        <div className="max-h-[60vh] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-surface text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-4 py-2 font-medium">{t("counts.item")}</th>
                <th className="px-3 py-2 font-medium">{t("labels.barcode")}</th>
                {count.showBooks ? <th className="px-3 py-2 text-right font-medium">{t("counts.inBooks")}</th> : null}
                <th className="w-28 px-3 py-2 text-right font-medium">{t("counts.counted")}</th>
                {count.showBooks ? <th className="px-3 py-2 text-right font-medium">{t("counts.diff")}</th> : null}
                {count.showBooks ? <th className="px-4 py-2 text-right font-medium">{t("counts.value")}</th> : null}
              </tr>
            </thead>
            <tbody>
              {shown.map((l) => {
                const diff = Number(l.diff ?? 0);
                return (
                  <tr key={l.itemId} className="border-b border-border last:border-0">
                    <td className="px-4 py-1.5">{l.name}</td>
                    <td className="px-3 py-1.5 font-mono text-xs text-muted">{l.barcode ?? l.sku ?? ""}</td>
                    {count.showBooks ? <td className="num px-3 py-1.5 text-right">{Number(l.expected)}</td> : null}
                    <td className="px-3 py-1">
                      {counting ? (
                        <Input value={counts[l.itemId] === "0.0000" ? "" : String(Number(counts[l.itemId] ?? 0) || "")} placeholder="0" inputMode="decimal" className="num h-8 text-right"
                          onChange={(e) => setCounts({ ...counts, [l.itemId]: e.target.value.replace(/[^\d.]/g, "") })} onBlur={(e) => void saveTyped(l.itemId, e.target.value || "0")} aria-label={`${t("counts.counted")} ${l.name}`} />
                      ) : <span className="num block text-right">{Number(l.counted)}</span>}
                    </td>
                    {count.showBooks ? <td className={`num px-3 py-1.5 text-right ${diff < 0 ? "text-danger" : diff > 0 ? "text-success" : "text-muted"}`}>{diff > 0 ? `+${diff}` : diff}</td> : null}
                    {count.showBooks ? <td className="num px-4 py-1.5 text-right">{Number(l.value) ? rupees(l.value!) : ""}</td> : null}
                  </tr>
                );
              })}
              {!shown.length ? <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">{t("counts.noDiff")}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
