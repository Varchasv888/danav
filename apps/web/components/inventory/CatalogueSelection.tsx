"use client";

import { Copy, FileSpreadsheet, ImageOff, Link2, Printer, Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { rupees, todayIso } from "@/lib/format";
import { fileUrl } from "@/lib/images";
import { Alert, Button, Card, Field, Input, Select } from "../ui";
import type { Tile } from "./Catalogue";

export interface SelectionDetail {
  id: string; name: string; party: { id: string; name: string; phone: string | null } | null; showPrices: boolean; showStock: boolean;
  sharedUntil: string | null; tiles: Tile[];
}

/** Excel opens a UTF-8 CSV with a byte-order mark; cells that look like formulas are made plain text. */
function csv(rows: (string | number | null)[][]) {
  const cell = (v: string | number | null) => {
    let s = v === null ? "" : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return `﻿${rows.map((r) => r.map(cell).join(",")).join("\r\n")}`;
}

export function CatalogueSelection({ sel, canCreate }: { sel: SelectionDetail; canCreate: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [days, setDays] = useState("30");
  const [link, setLink] = useState<string | null>(null);
  const [phone, setPhone] = useState(sel.party?.phone ?? "");
  const [qty, setQty] = useState<Record<string, string>>({});
  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      await fn();
    } catch (err) {
      const code = err instanceof ApiError ? (err.issues?.[0]?.message ?? err.code) : "generic";
      const key = [`catalogue.errors.${code}`, `sales.errors.${code}`].find((k) => t.has(k));
      setError(key ? t(key) : t("auth.errors.generic"));
    }
    setBusy(false);
  };
  const save = (patch: Partial<{ lines: { styleId: string; color: string | null }[]; showPrices: boolean; showStock: boolean }>) => run(async () => {
    await api(`/catalogue/selections/${sel.id}`, { method: "PUT", body: {
      name: sel.name, partyId: sel.party?.id ?? null, showPrices: sel.showPrices, showStock: sel.showStock,
      lines: sel.tiles.map((x) => ({ styleId: x.styleId, color: x.color })), ...patch,
    } });
    router.refresh();
  });
  const exportExcel = () => {
    const rows: (string | number | null)[][] = [[t("catalogue.cols.code"), t("catalogue.cols.name"), t("styles.color"), t("catalogue.brand"), t("catalogue.cols.size"), t("items.barcode"), t("catalogue.cols.rate"), t("catalogue.cols.mrp"), t("catalogue.cols.stock")]];
    for (const x of sel.tiles) for (const s of x.sizes) rows.push([x.code, x.name, x.color, x.brand, s.size, s.barcode, s.rate, x.mrp, s.stock]);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv(rows)], { type: "text/csv;charset=utf-8" }));
    a.download = `${sel.name.replace(/[^\w-]+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const orderLines = sel.tiles.flatMap((x) => x.sizes.filter((s) => Number(qty[s.itemId]) > 0).map((s) => ({ itemId: s.itemId, qty: qty[s.itemId]!, rate: s.rate })));
  const orderValue = orderLines.reduce((v, l) => v + Number(l.qty) * Number(l.rate), 0);

  return (
    <div className="flex flex-col gap-6">
      {error ? <Alert>{error}</Alert> : null}
      {note ? <p className="rounded-lg bg-success-soft px-4 py-2 text-sm text-success">{note}</p> : null}
      <div className="flex flex-wrap gap-3">
        <Link href={`/print/catalogue/${sel.id}`} target="_blank" className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3.5 text-sm font-medium hover:bg-surface-2"><Printer className="size-4" aria-hidden />{t("catalogue.printPdf")}</Link>
        <Button variant="outline" onClick={exportExcel}><FileSpreadsheet className="size-4" aria-hidden />{t("catalogue.exportExcel")}</Button>
        {canCreate ? (
          <>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={sel.showPrices} disabled={busy} onChange={(e) => save({ showPrices: e.target.checked })} className="accent-[var(--color-primary)]" />{t("catalogue.showPrices")}</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={sel.showStock} disabled={busy} onChange={(e) => save({ showStock: e.target.checked })} className="accent-[var(--color-primary)]" />{t("catalogue.showStock")}</label>
            <span className="flex-1" />
            <Button variant="ghost" disabled={busy} onClick={() => { if (window.confirm(t("catalogue.deleteConfirm"))) void run(async () => { await api(`/catalogue/selections/${sel.id}`, { method: "DELETE" }); router.push("/inventory/catalogue"); }); }}><Trash2 className="size-4" aria-hidden />{t("catalogue.delete")}</Button>
          </>
        ) : null}
      </div>

      {canCreate ? (
        <Card className="flex flex-col gap-3">
          <h2 className="font-semibold">{t("catalogue.shareTitle")}</h2>
          <p className="text-sm text-muted">{sel.sharedUntil ? t("catalogue.sharedUntil", { date: format.dateTime(new Date(sel.sharedUntil), { dateStyle: "medium" }) }) : t("catalogue.shareHint")}</p>
          <div className="flex flex-wrap items-end gap-3">
            <Field label={t("catalogue.linkWorksFor")} htmlFor="sh-days">
              <Select id="sh-days" value={days} onChange={(e) => setDays(e.target.value)} className="w-36">
                {["7", "30", "90"].map((d) => <option key={d} value={d}>{t("catalogue.days", { n: Number(d) })}</option>)}
              </Select>
            </Field>
            <Button disabled={busy} onClick={() => run(async () => { const r = await api<{ url: string }>(`/catalogue/selections/${sel.id}/share`, { body: { days: Number(days) } }); setLink(r.url); router.refresh(); })}>
              <Link2 className="size-4" aria-hidden />{sel.sharedUntil ? t("catalogue.newLink") : t("catalogue.makeLink")}
            </Button>
            {sel.sharedUntil ? <Button variant="ghost" disabled={busy} onClick={() => run(async () => { await api(`/catalogue/selections/${sel.id}/share`, { method: "DELETE" }); setLink(null); router.refresh(); })}>{t("catalogue.stopSharing")}</Button> : null}
          </div>
          {link ? (
            <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Input value={link} readOnly className="min-w-0 flex-1 font-mono text-xs" aria-label={t("catalogue.link")} onFocus={(e) => e.target.select()} />
                <Button variant="outline" onClick={() => { void navigator.clipboard?.writeText(link); setNote(t("catalogue.copied")); }}><Copy className="size-4" aria-hidden />{t("catalogue.copy")}</Button>
              </div>
              <div className="flex flex-wrap items-end gap-2">
                <Field label={t("catalogue.whatsappTo")} htmlFor="sh-phone"><Input id="sh-phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" className="w-44" placeholder="98XXXXXXXX" /></Field>
                <Button disabled={busy || !phone.trim()} onClick={() => run(async () => { const r = await api<{ to: string; provider: string }>(`/catalogue/selections/${sel.id}/send`, { body: { url: link, phone } }); setNote(t(r.provider === "demo" ? "catalogue.sentDemo" : "catalogue.sent", { to: r.to })); })}>
                  <Send className="size-4" aria-hidden />{t("catalogue.sendWhatsapp")}
                </Button>
              </div>
            </div>
          ) : null}
        </Card>
      ) : null}

      <Card className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
          <h2 className="font-semibold">{t("catalogue.designs", { n: sel.tiles.length })}</h2>
          {canCreate && sel.party ? <span className="text-sm text-muted">{t("catalogue.orderHint", { party: sel.party.name })}</span> : null}
        </div>
        <ul className="divide-y divide-border">
          {sel.tiles.map((x) => (
            <li key={x.key} className="flex flex-wrap gap-4 px-5 py-3">
              <Link href={`/inventory/styles/${x.styleId}`} className="block w-20 shrink-0 overflow-hidden rounded-md border border-border bg-surface-2">
                {x.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={fileUrl(x.image.thumbFileId)} alt={`${x.name} ${x.color ?? ""}`} className="aspect-[3/4] w-full object-cover" loading="lazy" />
                ) : <span className="flex aspect-[3/4] items-center justify-center text-muted"><ImageOff className="size-6" aria-hidden /></span>}
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm">
                <span className="font-medium"><span className="font-mono text-xs text-muted">{x.code}</span> {x.name}</span>
                <span className="text-muted">{[x.color, x.brand, x.category].filter(Boolean).join(" · ")}</span>
                <span><span className="num font-semibold">{rupees(x.rate)}</span>{x.mrp ? <span className="ml-2 text-xs text-muted">{t("catalogue.mrp", { v: rupees(x.mrp) })}</span> : null}<span className="ml-3 text-xs text-muted">{t("catalogue.stock", { n: Number(x.stock) })}</span></span>
                {canCreate && sel.party ? (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {x.sizes.map((s) => (
                      <label key={s.itemId} className="flex flex-col items-center text-xs text-muted">
                        {s.size ?? "-"}
                        <Input value={qty[s.itemId] ?? ""} onChange={(e) => setQty({ ...qty, [s.itemId]: e.target.value.replace(/[^\d]/g, "") })} inputMode="numeric" className="num h-8 w-14 text-center" aria-label={`${x.code} ${x.color ?? ""} ${s.size ?? ""}`} />
                      </label>
                    ))}
                  </div>
                ) : null}
              </div>
              {canCreate && sel.tiles.length > 1 ? (
                <button type="button" disabled={busy} onClick={() => save({ lines: sel.tiles.filter((y) => y.key !== x.key).map((y) => ({ styleId: y.styleId, color: y.color })) })} className="self-start rounded p-1 text-muted hover:text-danger" title={t("common.remove")}>
                  <Trash2 className="size-4" aria-hidden /><span className="sr-only">{t("common.remove")}</span>
                </button>
              ) : null}
            </li>
          ))}
        </ul>
        {canCreate && sel.party && orderLines.length ? (
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border px-5 py-3">
            <span className="text-sm">{t("catalogue.orderTotal", { pieces: orderLines.reduce((n, l) => n + Number(l.qty), 0), value: rupees(orderValue.toFixed(2)) })}</span>
            <Button disabled={busy} onClick={() => run(async () => {
              const r = await api<{ id: string }>("/sales-orders", { body: { customerId: sel.party!.id, date: todayIso(), narration: t("catalogue.orderNarration", { name: sel.name }), lines: orderLines } });
              router.push(`/sales/orders/${r.id}`);
            })}>{t("catalogue.makeOrder")}</Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
