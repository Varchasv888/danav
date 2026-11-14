"use client";

import { Download, ImageOff, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { downloadCsv } from "@/lib/csv";
import { rupees } from "@/lib/format";
import { fileUrl } from "@/lib/images";
import { Button, Card, Input, Select } from "../ui";

type Params = Record<string, string | undefined>;
const useGo = (params: Params) => {
  const router = useRouter();
  const path = usePathname();
  return (patch: Params) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...params, ...patch })) if (v) q.set(k, v);
    router.push(`${path}?${q.toString()}`);
  };
};
const n = (v: string | number) => Number(v).toLocaleString("en-IN");

// ---- colour-size matrix ---------------------------------------------------------------------------------

export interface Matrix {
  type: "stock" | "sales"; total: string; brands: string[]; categories: string[]; seasons: string[];
  groups: {
    styleId: string; code: string; name: string; brand: string | null; category: string | null; mrp: string | null; sizes: string[]; total: number;
    sizeTotals: Record<string, number>; rows: { color: string; hex: string | null; thumbFileId: string | null; fileId: string | null; cells: Record<string, number>; total: number }[];
  }[];
}

/** Designs as colour-by-size grids with a photo per colour; stock as of a date or pieces sold in a period. */
export function ColourSize({ data, params, stores }: { data: Matrix; params: Params; stores: { id: string; name: string }[] }) {
  const t = useTranslations("ownerReports");
  const go = useGo(params);
  const [q, setQ] = useState(params.q ?? "");
  const [zoom, setZoom] = useState<string | null>(null);
  const sales = data.type === "sales";
  const exportCsv = () => {
    const rows: (string | number | null)[][] = [[t("design"), t("name"), t("brand"), t("colour"), t("size"), sales ? t("sold") : t("stock")]];
    for (const g of data.groups) for (const r of g.rows) for (const z of g.sizes) if (r.cells[z]) rows.push([g.code, g.name, g.brand, r.color, z, r.cells[z]!]);
    downloadCsv(`colour-size-${data.type}`, rows);
  };
  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-wrap items-end gap-3">
        <Select value={data.type} onChange={(e) => go({ type: e.target.value })} className="w-36" aria-label={t("reportType")}>
          <option value="stock">{t("stock")}</option><option value="sales">{t("sales")}</option>
        </Select>
        {sales ? (
          <>
            <Input type="date" defaultValue={params.from} onChange={(e) => go({ from: e.target.value })} className="w-40" aria-label={t("from")} />
            <Input type="date" defaultValue={params.to} onChange={(e) => go({ to: e.target.value })} className="w-40" aria-label={t("to")} />
          </>
        ) : (
          <>
            <Input type="date" defaultValue={params.asOf} onChange={(e) => go({ asOf: e.target.value })} className="w-40" aria-label={t("asOf")} />
            <Select value={params.warehouseId ?? ""} onChange={(e) => go({ warehouseId: e.target.value || undefined })} className="w-48" aria-label={t("store")}>
              <option value="">{t("allStores")}</option>
              {stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </>
        )}
        <Select value={params.brand ?? ""} onChange={(e) => go({ brand: e.target.value || undefined })} className="w-40" aria-label={t("brand")}>
          <option value="">{t("allBrands")}</option>{data.brands.map((b) => <option key={b}>{b}</option>)}
        </Select>
        <Select value={params.category ?? ""} onChange={(e) => go({ category: e.target.value || undefined })} className="w-40" aria-label={t("category")}>
          <option value="">{t("allCategories")}</option>{data.categories.map((b) => <option key={b}>{b}</option>)}
        </Select>
        <form onSubmit={(e) => { e.preventDefault(); go({ q: q.trim() || undefined }); }} className="relative">
          <Search className="pointer-events-none absolute top-2.5 left-2.5 size-4 text-muted" aria-hidden />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchDesign")} aria-label={t("searchDesign")} className="w-48 pl-8" />
        </form>
        <span className="flex-1" />
        <span className="text-sm">{t(sales ? "totalSold" : "totalStock", { n: n(data.total) })}</span>
        <Button variant="outline" onClick={exportCsv}><Download className="size-4" aria-hidden />{t("excel")}</Button>
      </Card>
      {data.groups.map((g) => (
        <Card key={g.styleId} className="p-0">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border px-5 py-3">
            <Link href={`/inventory/styles/${g.styleId}`} className="font-semibold hover:text-primary"><span className="font-mono text-xs text-muted">{g.code}</span> {g.name}</Link>
            <span className="text-sm text-muted">{[g.brand, g.category, g.mrp ? t("mrp", { v: rupees(g.mrp) }) : null].filter(Boolean).join(" · ")}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="w-14 px-3 py-2" /><th className="px-3 py-2 text-left font-medium">{t("colour")}</th>
                  {g.sizes.map((z) => <th key={z} className="num min-w-14 px-2 py-2 text-right font-medium">{z}</th>)}
                  <th className="num px-4 py-2 text-right font-medium">{t("total")}</th>
                </tr>
              </thead>
              <tbody>
                {g.rows.map((r) => (
                  <tr key={r.color} className="border-b border-border">
                    <td className="relative px-3 py-1.5" onMouseEnter={() => setZoom(`${g.styleId}:${r.color}`)} onMouseLeave={() => setZoom(null)}>
                      {r.thumbFileId ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={fileUrl(r.thumbFileId)} alt={`${g.name} ${r.color}`} className="h-12 w-9 rounded object-cover" loading="lazy" />
                          {zoom === `${g.styleId}:${r.color}` && r.fileId ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={fileUrl(r.fileId)} alt="" className="absolute top-0 left-14 z-20 h-64 w-48 rounded-md border border-border object-cover shadow-lg" />
                          ) : null}
                        </>
                      ) : <ImageOff className="size-5 text-muted" aria-label={t("noPhoto")} />}
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap">{r.hex ? <span aria-hidden className="mr-2 inline-block size-3 rounded-full border border-black/10 align-middle" style={{ background: r.hex }} /> : null}{r.color}</td>
                    {g.sizes.map((z) => {
                      const v = r.cells[z] ?? 0;
                      return <td key={z} className={`num px-2 py-1.5 text-right ${v === 0 ? "text-muted" : v < 0 ? "text-danger" : ""}`}>{v === 0 ? "·" : n(v)}</td>;
                    })}
                    <td className="num px-4 py-1.5 text-right font-medium">{n(r.total)}</td>
                  </tr>
                ))}
                <tr className="font-medium">
                  <td /><td className="px-3 py-2">{t("total")}</td>
                  {g.sizes.map((z) => <td key={z} className="num px-2 py-2 text-right">{n(g.sizeTotals[z] ?? 0)}</td>)}
                  <td className="num px-4 py-2 text-right">{n(g.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      ))}
      {!data.groups.length ? <Card className="py-10 text-center text-sm text-muted">{t("nothing")}</Card> : null}
    </div>
  );
}

// ---- stock ageing and dead stock --------------------------------------------------------------------------

export interface Ageing {
  asOf: string; deadDays: number; all: boolean; buckets: { key: string; qty: string; value: string }[]; total: { qty: string; value: string };
  dead: { items: number; qty: string; value: string };
  rows: { itemId: string; name: string; styleId: string | null; design: string | null; brand: string | null; color: string | null; size: string | null; qty: string; value: string; buckets: string[]; oldestDays: number; lastSold: string | null; idleDays: number; dead: boolean }[];
}

/** What is in stock by age (first in first out) and what has not sold for a while. */
export function StockAgeing({ data, params }: { data: Ageing; params: Params }) {
  const t = useTranslations("ownerReports");
  const ti = useTranslations("insights");
  const format = useFormatter();
  const go = useGo(params);
  const [onlyDead, setOnlyDead] = useState(params.dead === "1");
  const rows = onlyDead ? data.rows.filter((r) => r.dead) : data.rows;
  const max = Math.max(...data.buckets.map((b) => Number(b.value)), 1);
  const exportCsv = () => downloadCsv(`stock-ageing-${data.asOf}`, [
    [t("design"), t("item"), t("colour"), t("size"), t("stock"), t("value"), ...data.buckets.map((b) => ti(`ages.${b.key}`)), t("lastSold"), t("idleDays")],
    ...rows.map((r) => [r.design, r.name, r.color, r.size, r.qty, r.value, ...r.buckets, r.lastSold, r.idleDays]),
  ]);
  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-wrap items-end gap-3">
        <Input type="date" defaultValue={data.asOf} onChange={(e) => go({ asOf: e.target.value })} className="w-40" aria-label={t("asOf")} />
        <Select value={String(data.deadDays)} onChange={(e) => go({ deadDays: e.target.value })} className="w-56" aria-label={t("deadAfter")}>
          {[30, 60, 90, 180, 365].map((d) => <option key={d} value={d}>{t("deadAfterDays", { n: d })}</option>)}
        </Select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.all} onChange={(e) => go({ all: e.target.checked ? "1" : undefined })} className="accent-[var(--color-primary)]" />{t("withMaterials")}</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={onlyDead} onChange={(e) => setOnlyDead(e.target.checked)} className="accent-[var(--color-primary)]" />{t("onlyDead")}</label>
        <span className="flex-1" />
        <Button variant="outline" onClick={exportCsv}><Download className="size-4" aria-hidden />{t("excel")}</Button>
      </Card>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="flex flex-col gap-2">
          <h2 className="font-semibold">{t("byAge", { v: rupees(data.total.value), n: n(data.total.qty) })}</h2>
          {data.buckets.map((b) => (
            <div key={b.key} className="grid grid-cols-[120px_1fr_150px] items-center gap-3 text-sm" title={`${ti(`ages.${b.key}`)}: ${rupees(b.value)}`}>
              <span className="text-muted">{ti(`ages.${b.key}`)}</span>
              <div className="h-2.5 rounded-full bg-surface-2"><div className="h-2.5 rounded-full bg-primary" style={{ width: `${(Number(b.value) / max) * 100}%` }} /></div>
              <span className="num text-right">{rupees(b.value)} <span className="text-xs text-muted">{n(b.qty)}</span></span>
            </div>
          ))}
        </Card>
        <Card className="flex flex-col gap-1">
          <span className="text-sm text-muted">{t("deadTitle", { n: data.deadDays })}</span>
          <span className="num text-2xl font-semibold text-danger">{rupees(data.dead.value)}</span>
          <span className="text-sm">{t("deadDetail", { items: data.dead.items, qty: n(data.dead.qty) })}</span>
          <span className="text-xs text-muted">{t("deadHint")}</span>
        </Card>
      </div>
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-4 py-2 font-medium">{t("item")}</th>
                <th className="num px-3 py-2 text-right font-medium">{t("stock")}</th><th className="num px-3 py-2 text-right font-medium">{t("value")}</th>
                {data.buckets.map((b) => <th key={b.key} className="num px-2 py-2 text-right text-xs font-medium">{ti(`ages.${b.key}`)}</th>)}
                <th className="px-3 py-2 font-medium">{t("lastSold")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.itemId} className="border-b border-border last:border-0">
                  <td className="px-4 py-1.5">
                    {r.styleId ? <Link href={`/inventory/styles/${r.styleId}`} className="hover:text-primary">{r.name}</Link> : r.name}
                    {r.dead ? <span className="ml-2 rounded bg-danger-soft px-1.5 py-0.5 text-xs text-danger">{t("dead")}</span> : null}
                  </td>
                  <td className="num px-3 py-1.5 text-right">{n(r.qty)}</td>
                  <td className="num px-3 py-1.5 text-right">{rupees(r.value)}</td>
                  {r.buckets.map((b, i) => <td key={i} className={`num px-2 py-1.5 text-right ${Number(b) ? "" : "text-muted"}`}>{Number(b) ? n(b) : "·"}</td>)}
                  <td className="px-3 py-1.5 text-muted">{r.lastSold ? t("idle", { date: format.dateTime(new Date(`${r.lastSold}T00:00:00`), { dateStyle: "medium" }), n: r.idleDays }) : t("neverSold")}</td>
                </tr>
              ))}
              {!rows.length ? <tr><td colSpan={10} className="px-4 py-8 text-center text-muted">{t("nothing")}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ---- sales register ---------------------------------------------------------------------------------------

export interface Register {
  from: string; to: string;
  rows: { kind: string; id: string; number: string; date: string; party: string | null; pieces: string; gross: string; discount: string; taxable: string; tax: string; total: string; cash: string; upi: string; card: string; credit: string; cancelled: boolean }[];
  totals: { count: number; pieces: string; gross: string; discount: string; taxable: string; tax: string; total: string; cash: string; upi: string; card: string; credit: string };
}
const COLS = ["pieces", "gross", "discount", "taxable", "tax", "total", "cash", "upi", "card", "credit"] as const;

/** Every bill and invoice in a period, like a day book for sales, with totals and the payment split. */
export function SalesRegister({ data }: { data: Register }) {
  const t = useTranslations("ownerReports");
  const format = useFormatter();
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("");
  const s = q.trim().toLowerCase();
  const rows = data.rows.filter((r) => (!kind || r.kind === kind) && (!s || r.number.toLowerCase().includes(s) || (r.party ?? "").toLowerCase().includes(s)));
  const href = (r: Register["rows"][number]) =>
    r.kind === "invoice" ? `/sales/invoices/${r.id}` : r.kind === "bill" ? `/print/receipt/${r.id}` : r.kind === "credit_note" ? `/sales/credit-notes/${r.id}` : null;
  const cell = (k: (typeof COLS)[number], v: string) => (k === "pieces" ? n(v) : Number(v) ? rupees(v) : "·");
  const exportCsv = () => downloadCsv(`sales-register-${data.from}-${data.to}`, [
    [t("date"), t("number"), t("kind"), t("party"), ...COLS.map((c) => t(`cols.${c}`))],
    ...rows.map((r) => [r.date, r.number, t(`kinds.${r.kind}`), r.party, ...COLS.map((c) => r[c])]),
  ]);
  const bills = data.totals.count;
  const kpis: [string, string][] = [
    [t("cols.total"), rupees(data.totals.total)], [t("cols.pieces"), n(data.totals.pieces)], [t("cols.discount"), rupees(data.totals.discount)],
    [t("cols.tax"), rupees(data.totals.tax)], [t("avgBill"), bills ? rupees((Number(data.totals.total) / bills).toFixed(2)) : "·"],
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-5">
        {kpis.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border bg-surface px-3.5 py-3">
            <p className="text-[0.8571rem] font-semibold tracking-wide text-muted uppercase">{label}</p>
            <p className="num mt-0.5 text-[1.4rem] font-bold tracking-tight">{value}</p>
          </div>
        ))}
      </div>
      <Card className="flex flex-wrap items-end gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-2.5 left-2.5 size-4 text-muted" aria-hidden />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchRegister")} aria-label={t("searchRegister")} className="w-60 pl-8" />
        </div>
        <Select value={kind} onChange={(e) => setKind(e.target.value)} className="w-48" aria-label={t("kind")}>
          <option value="">{t("allKinds")}</option>
          {["invoice", "bill", "credit_note", "counter_return"].map((k) => <option key={k} value={k}>{t(`kinds.${k}`)}</option>)}
        </Select>
        <span className="flex-1" />
        <span className="text-sm">{t("documents", { n: data.totals.count })}</span>
        <Button variant="outline" onClick={exportCsv}><Download className="size-4" aria-hidden />{t("excel")}</Button>
      </Card>
      <Card className="p-0">
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full min-w-[1200px] text-sm">
            <thead className="sticky top-0 bg-surface text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-3 py-2 font-medium">{t("date")}</th><th className="px-3 py-2 font-medium">{t("number")}</th><th className="px-3 py-2 font-medium">{t("party")}</th>
                {COLS.map((c) => <th key={c} className="num px-3 py-2 text-right font-medium">{t(`cols.${c}`)}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const link = href(r);
                return (
                  <tr key={`${r.kind}:${r.id}`} className={`border-b border-border ${r.cancelled ? "text-muted line-through" : Number(r.discount) > 0 ? "bg-primary-soft/40" : ""}`}>
                    <td className="px-3 py-1.5 whitespace-nowrap">{format.dateTime(new Date(`${r.date}T00:00:00`), { day: "numeric", month: "short", year: "2-digit" })}</td>
                    <td className="px-3 py-1.5 font-mono text-xs whitespace-nowrap">{link ? <Link href={link} className="text-primary hover:underline">{r.number}</Link> : r.number}<span className="ml-1 font-sans text-muted">{r.kind !== "invoice" && r.kind !== "bill" ? `· ${t(`kinds.${r.kind}`)}` : ""}</span></td>
                    <td className="max-w-48 truncate px-3 py-1.5">{r.party ?? ""}</td>
                    {COLS.map((c) => <td key={c} className={`num px-3 py-1.5 text-right ${Number(r[c]) < 0 ? "text-danger" : ""}`}>{cell(c, r[c])}</td>)}
                  </tr>
                );
              })}
              {!rows.length ? <tr><td colSpan={13} className="px-4 py-8 text-center text-muted">{t("nothing")}</td></tr> : null}
            </tbody>
            <tfoot className="sticky bottom-0 bg-surface-2 font-semibold">
              <tr><td className="px-3 py-2" colSpan={3}>{t("total")}</td>{COLS.map((c) => <td key={c} className="num px-3 py-2 text-right">{cell(c, data.totals[c])}</td>)}</tr>
            </tfoot>
          </table>
        </div>
      </Card>
      <p className="text-xs text-muted">{t("registerHint")}</p>
    </div>
  );
}
