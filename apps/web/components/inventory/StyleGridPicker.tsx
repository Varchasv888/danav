"use client";

import { Grid3x3, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/client-api";
import { Button, Input } from "../ui";

interface StyleRow { id: string; code: string; name: string; brand: string | null; variants: number }
interface Variant { id: string; color: string; size: string; fit: string | null; saleRate: string; purchaseRate: string; stockQty: string; archived: boolean }
interface StyleDetail { id: string; code: string; name: string; sizes: string[]; colors: string[]; fits: (string | null)[]; variants: Variant[] }

export interface GridLine { itemId: string; qty: string; rate: string }

const QTY = /^\d+(\.\d{1,4})?$/;

/**
 * Entry by size: pick a style, type quantities into its colour-by-size grid, and each filled cell
 * becomes a line (the variant's sale or purchase rate filled in). Used on sales, purchase and stock forms.
 */
export function StyleGridPicker({ kind, onAdd }: { kind: "sale" | "purchase" | "stock"; onAdd: (lines: GridLine[]) => void }) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [list, setList] = useState<StyleRow[]>([]);
  const [style, setStyle] = useState<StyleDetail | null>(null);
  const [qty, setQty] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open || style) return;
    const handle = setTimeout(() => {
      api<StyleRow[]>(`/styles${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ""}`).then(setList).catch(() => setList([]));
    }, 200);
    return () => clearTimeout(handle);
  }, [open, search, style]);

  const rows = useMemo(() => {
    if (!style) return [];
    const out: { color: string; fit: string | null }[] = [];
    for (const color of style.colors) for (const fit of style.fits.length ? style.fits : [null]) {
      if (style.variants.some((v) => v.color === color && v.fit === fit)) out.push({ color, fit });
    }
    return out;
  }, [style]);
  const cell = (color: string, fit: string | null, size: string) => style?.variants.find((v) => v.color === color && v.fit === fit && v.size === size && !v.archived);

  const filled = Object.entries(qty).filter(([, q]) => QTY.test(q) && Number(q) > 0);
  const total = filled.reduce((s, [, q]) => s + Number(q), 0);

  function add() {
    if (!style) return;
    onAdd(filled.map(([itemId, q]) => {
      const v = style.variants.find((x) => x.id === itemId)!;
      const rate = kind === "purchase" || kind === "stock" ? v.purchaseRate : v.saleRate;
      return { itemId, qty: q, rate: Number(rate) ? String(Number(rate)) : "" };
    }));
    close();
  }
  function close() {
    setOpen(false);
    setStyle(null);
    setQty({});
    setSearch("");
  }

  if (!open) {
    return (
      <Button type="button" variant="ghost" onClick={() => setOpen(true)} className="mt-2">
        <Grid3x3 className="size-4" aria-hidden />{t("styles.addBySize")}
      </Button>
    );
  }

  return (
    <section className="mt-3 rounded-xl border border-border bg-surface-2/50 p-4" aria-label={t("styles.addBySize")}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-semibold">{style ? `${style.code} ${style.name}` : t("styles.chooseStyle")}</h3>
        <button type="button" onClick={close} className="rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-text" aria-label={t("common.close")}><X className="size-4" /></button>
      </div>
      {!style ? (
        <>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("styles.searchStyles")} autoFocus aria-label={t("styles.searchStyles")} />
          <ul className="mt-2 max-h-64 overflow-y-auto">
            {list.map((s) => (
              <li key={s.id}>
                <button type="button" onClick={() => api<StyleDetail>(`/styles/${s.id}`).then(setStyle)} className="flex w-full items-baseline gap-3 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-surface">
                  <span className="font-mono text-xs text-muted">{s.code}</span>
                  <span className="flex-1">{s.name}</span>
                  {s.brand ? <span className="text-xs text-muted">{s.brand}</span> : null}
                </button>
              </li>
            ))}
            {!list.length ? <li className="px-2.5 py-4 text-sm text-muted">{t("styles.noStyles")}</li> : null}
          </ul>
        </>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="text-sm">
              <thead>
                <tr>
                  <th className="py-1.5 pr-4 text-left font-medium">{t("styles.color")}</th>
                  {style.sizes.map((s) => <th key={s} className="min-w-16 px-1 py-1.5 text-center font-medium">{s}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={`${r.color}|${r.fit}`}>
                    <td className="py-1 pr-4 whitespace-nowrap">{r.color}{r.fit ? <span className="text-muted"> · {r.fit}</span> : null}</td>
                    {style.sizes.map((s) => {
                      const v = cell(r.color, r.fit, s);
                      return (
                        <td key={s} className="px-1 py-1 align-top">
                          {v ? (
                            <>
                              <Input value={qty[v.id] ?? ""} onChange={(e) => setQty((q) => ({ ...q, [v.id]: e.target.value }))} inputMode="decimal"
                                className="num h-8 w-16 px-2 text-center" aria-label={`${r.color} ${s}`} aria-invalid={!!qty[v.id] && !QTY.test(qty[v.id]!)} />
                              {kind !== "purchase" ? <span className="block text-center text-[0.6875rem] text-muted">{Number(v.stockQty)}</span> : null}
                            </>
                          ) : <span className="block text-center text-muted">·</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button type="button" onClick={add} disabled={!filled.length}>{t("styles.addPieces", { count: total })}</Button>
            <Button type="button" variant="ghost" onClick={() => { setStyle(null); setQty({}); }}>{t("styles.otherStyle")}</Button>
            {kind !== "purchase" ? <span className="text-xs text-muted">{t("styles.stockUnder")}</span> : null}
          </div>
        </>
      )}
    </section>
  );
}
