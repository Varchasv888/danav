"use client";

import clsx from "clsx";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { GST_RATES } from "@varchasv/domain";
import { ApiError, api } from "@/lib/client-api";
import { rupees } from "@/lib/format";
import { fileUrl } from "@/lib/images";
import { Alert, Button, Card, Field, Input, Select } from "../ui";
import { HsnOptions } from "../masters/HsnOptions";
import { LookupOptions } from "../masters/LookupOptions";
import { StyleAttributes, readAttributes } from "./StyleAttributes";
import { StylePhotos, type StyleImage } from "./StylePhotos";

export interface Scale { id: string; name: string; sizes: string[]; archived: boolean }
export interface Color { id: string; name: string; code: string; hex: string | null; archived: boolean }
export interface StyleRow {
  id: string; code: string; name: string; brand: string | null; category: string | null; season: string | null; collection: string | null;
  saleRate: string; mrp: string | null; variants: number; colors: number; stockQty: string; archived: boolean;
}
export interface Variant {
  id: string; name: string; sku: string | null; barcode: string | null; color: string; size: string; fit: string | null;
  saleRate: string; purchaseRate: string; mrp: string | null; stockQty: string; archived: boolean;
}
export interface StyleDetail extends Omit<StyleRow, "variants" | "colors" | "stockQty"> {
  nameHi: string | null; hsn: string | null; gstRate: string; gstSlab: string | null; uomId: string; purchaseRate: string; sizeScaleId: string | null;
  sizes: string[]; colors: string[]; fits: (string | null)[]; variants: Variant[]; attributes: Record<string, string>;
  packs: { id: string; name: string; color: string; size: string; saleRate: string; slabPieces: number; barcode: string | null; lines: { itemId: string; qty: string }[] }[];
}
type Uom = { id: string; code: string; name: string };

const errorText = (t: ReturnType<typeof useTranslations>, err: unknown) => {
  const code = err instanceof ApiError ? (err.issues?.[0]?.message ?? err.code) : "generic";
  return t.has(`styles.errors.${code}`) ? t(`styles.errors.${code}`) : t.has(`items.errors.${code}`) ? t(`items.errors.${code}`) : t("auth.errors.generic");
};

// ---- list -------------------------------------------------------------------------------------------

export function StylesList({ styles, scales, colors, uoms, canCreate }: { styles: StyleRow[]; scales: Scale[]; colors: Color[]; uoms: Uom[]; canCreate: boolean }) {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const q = query.trim().toLowerCase();
  const visible = styles.filter((s) => !q || [s.code, s.name, s.brand, s.season, s.category].some((x) => (x ?? "").toLowerCase().includes(q)));
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-60 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("styles.searchStyles")} className="pl-9" aria-label={t("styles.searchStyles")} />
        </div>
        {canCreate && !adding ? <Button onClick={() => setAdding(true)}><Plus className="size-4" aria-hidden />{t("styles.new")}</Button> : null}
      </div>
      {adding ? <StyleForm scales={scales.filter((s) => !s.archived)} colors={colors.filter((c) => !c.archived)} uoms={uoms} onDone={() => setAdding(false)} /> : null}
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="text-left">
              <tr className="border-b border-border">
                <th className="px-5 py-3">{t("styles.code")}</th>
                <th className="px-5 py-3">{t("styles.name")}</th>
                <th className="px-5 py-3">{t("styles.brand")}</th>
                <th className="px-5 py-3">{t("styles.season")}</th>
                <th className="px-5 py-3 text-right">{t("styles.colors")}</th>
                <th className="px-5 py-3 text-right">{t("styles.variants")}</th>
                <th className="px-5 py-3 text-right">{t("styles.saleRate")}</th>
                <th className="px-5 py-3 text-right">{t("items.inStock")}</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-surface-2/60">
                  <td className="px-5 py-2.5 font-mono text-xs"><Link href={`/inventory/styles/${s.id}`} className="text-primary hover:underline">{s.code}</Link></td>
                  <td className="px-5 py-2.5"><Link href={`/inventory/styles/${s.id}`} className="font-medium hover:underline">{s.name}</Link>{s.archived ? <span className="ml-2 text-xs text-muted">({t("common.archived")})</span> : null}</td>
                  <td className="px-5 py-2.5">{s.brand ?? ""}</td>
                  <td className="px-5 py-2.5">{s.season ?? ""}</td>
                  <td className="num px-5 py-2.5 text-right">{s.colors}</td>
                  <td className="num px-5 py-2.5 text-right">{s.variants}</td>
                  <td className="num px-5 py-2.5 text-right">{rupees(s.saleRate)}</td>
                  <td className="num px-5 py-2.5 text-right">{Number(s.stockQty).toLocaleString("en-IN")}</td>
                </tr>
              ))}
              {!visible.length ? <tr><td colSpan={8} className="px-5 py-10 text-center text-muted">{styles.length ? t("styles.noMatch") : t("styles.empty")}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ---- new style ----------------------------------------------------------------------------------------

function ColorChips({ colors, selected, toggle }: { colors: Color[]; selected: string[]; toggle: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {colors.map((c) => {
        const on = selected.includes(c.id);
        return (
          <button key={c.id} type="button" aria-pressed={on} onClick={() => toggle(c.id)}
            className={clsx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm", on ? "border-primary bg-primary-soft text-primary" : "border-border hover:border-primary/40")}>
            <span aria-hidden className="size-3 rounded-full border border-black/10" style={{ background: c.hex ?? "transparent" }} />{c.name}
          </button>
        );
      })}
    </div>
  );
}

function SizeChips({ sizes, selected, toggle }: { sizes: string[]; selected: string[]; toggle: (s: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {sizes.map((s) => {
        const on = selected.includes(s);
        return (
          <button key={s} type="button" aria-pressed={on} onClick={() => toggle(s)}
            className={clsx("num min-w-10 rounded-md border px-2.5 py-1 text-sm", on ? "border-primary bg-primary-soft font-medium text-primary" : "border-border hover:border-primary/40")}>{s}</button>
        );
      })}
    </div>
  );
}

const toggleIn = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

function StyleForm({ scales, colors, uoms, onDone }: { scales: Scale[]; colors: Color[]; uoms: Uom[]; onDone: () => void }) {
  const t = useTranslations();
  const router = useRouter();
  const [scaleId, setScaleId] = useState(scales[0]?.id ?? "");
  const scale = scales.find((s) => s.id === scaleId);
  const [sizes, setSizes] = useState<string[]>(scale?.sizes.slice(1, 5) ?? []);
  const [colorIds, setColorIds] = useState<string[]>([]);
  const [slab, setSlab] = useState("apparel");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => ((f.get(k) as string | null) ?? "").trim();
    if (!colorIds.length || !sizes.length) return setError(t("styles.errors.colors_and_sizes_required"));
    setBusy(true);
    setError(null);
    try {
      const created = await api<{ id: string }>("/styles", {
        body: {
          code: s("code"), name: s("name"), brand: s("brand") || null, category: s("category") || null, season: s("season") || null, collection: s("collection") || null,
          hsn: s("hsn") || null, gstSlab: slab || null, gstRate: slab ? "5" : s("gstRate"), uomId: s("uomId"),
          purchaseRate: s("purchaseRate") || "0", saleRate: s("saleRate") || "0", mrp: s("mrp") || null, sizeScaleId: scaleId || null,
          fits: s("fits") ? s("fits").split(",").map((x) => x.trim()).filter(Boolean) : null, attributes: readAttributes(f),
          colorIds, sizes: (scale?.sizes ?? sizes).filter((x) => sizes.includes(x)),
        },
      });
      router.push(`/inventory/styles/${created.id}`);
      router.refresh();
    } catch (err) {
      setError(errorText(t, err));
      setBusy(false);
    }
  }

  const pcs = uoms.find((u) => u.code === "PCS") ?? uoms[0];
  return (
    <Card>
      <form onSubmit={save} className="flex flex-col gap-5">
        {error ? <Alert>{error}</Alert> : null}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label={t("styles.code")} htmlFor="st-code" hint={t("styles.codeHint")}><Input id="st-code" name="code" required maxLength={30} autoFocus className="font-mono" /></Field>
          <Field label={t("styles.name")} htmlFor="st-name"><Input id="st-name" name="name" required maxLength={120} /></Field>
          <Field label={t("styles.brand")} htmlFor="st-brand"><Input id="st-brand" name="brand" maxLength={60} list="lk-brand" /><LookupOptions id="lk-brand" kind="brandMaster" /></Field>
          <Field label={t("styles.category")} htmlFor="st-cat"><Input id="st-cat" name="category" maxLength={60} list="lk-cat" /><LookupOptions id="lk-cat" kind="itemGroup" /></Field>
          <Field label={t("styles.season")} htmlFor="st-season"><Input id="st-season" name="season" maxLength={40} placeholder={t("styles.seasonExample")} list="lk-season" /><LookupOptions id="lk-season" kind="season" /></Field>
          <Field label={t("styles.collection")} htmlFor="st-coll"><Input id="st-coll" name="collection" maxLength={60} /></Field>
          <StyleAttributes prefix="st-attr" />
          <Field label={t("items.hsn")} htmlFor="st-hsn"><Input id="st-hsn" name="hsn" inputMode="numeric" maxLength={8} className="font-mono" list="st-hsn-list" /><HsnOptions id="st-hsn-list" /></Field>
          <Field label={t("items.gstSlab")} htmlFor="st-slab" hint={slab ? t(`items.slab.${slab}`) : undefined}>
            <Select id="st-slab" value={slab} onChange={(e) => setSlab(e.target.value)}>
              <option value="apparel">{t("items.slabApparel")}</option>
              <option value="footwear">{t("items.slabFootwear")}</option>
              <option value="">{t("items.slabNone")}</option>
            </Select>
          </Field>
          {!slab ? (
            <Field label={t("items.gstRate")} htmlFor="st-gst">
              <Select id="st-gst" name="gstRate" defaultValue="5">{GST_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}</Select>
            </Field>
          ) : null}
          <Field label={t("items.uom")} htmlFor="st-uom">
            <Select id="st-uom" name="uomId" defaultValue={pcs?.id}>{uoms.map((u) => <option key={u.id} value={u.id}>{u.code}</option>)}</Select>
          </Field>
          <Field label={t("items.purchaseRate")} htmlFor="st-pr"><Input id="st-pr" name="purchaseRate" inputMode="decimal" className="num" /></Field>
          <Field label={t("items.saleRate")} htmlFor="st-sr"><Input id="st-sr" name="saleRate" inputMode="decimal" className="num" /></Field>
          <Field label={t("items.mrp")} htmlFor="st-mrp"><Input id="st-mrp" name="mrp" inputMode="decimal" className="num" /></Field>
        </div>
        <div className="grid gap-4 md:grid-cols-[16rem_minmax(0,1fr)]">
          <Field label={t("styles.sizeScale")} htmlFor="st-scale">
            <Select id="st-scale" value={scaleId} onChange={(e) => { setScaleId(e.target.value); setSizes(scales.find((s) => s.id === e.target.value)?.sizes ?? []); }}>
              {scales.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </Field>
          <Field label={t("styles.sizes")}><SizeChips sizes={scale?.sizes ?? []} selected={sizes} toggle={(s) => setSizes((l) => toggleIn(l, s))} /></Field>
        </div>
        <Field label={t("styles.colors")}><ColorChips colors={colors} selected={colorIds} toggle={(id) => setColorIds((l) => toggleIn(l, id))} /></Field>
        <Field label={<>{t("styles.fits")} <span className="font-normal text-muted">({t("common.optional")})</span></>} htmlFor="st-fits" hint={t("styles.fitsHint")}>
          <Input id="st-fits" name="fits" placeholder={t("styles.fitsExample")} className="max-w-md" />
        </Field>
        <p className="text-sm text-muted">{t("styles.willCreate", { count: colorIds.length * sizes.length })}</p>
        <div className="flex gap-3">
          <Button type="submit" disabled={busy}>{t("styles.create")}</Button>
          <Button type="button" variant="ghost" onClick={onDone}>{t("common.cancel")}</Button>
        </div>
      </form>
    </Card>
  );
}

// ---- one style ----------------------------------------------------------------------------------------

export function StyleView({ style, colors, scales, warehouses, warehouseId, canEdit, images }: {
  style: StyleDetail; colors: Color[]; scales: Scale[]; warehouses: { id: string; name: string }[]; warehouseId: string | null; canEdit: boolean; images: StyleImage[];
}) {
  const t = useTranslations();
  const router = useRouter();
  const rows = useMemo(() => {
    const out: { color: string; fit: string | null }[] = [];
    for (const color of style.colors) for (const fit of style.fits.length ? style.fits : [null]) {
      if (style.variants.some((v) => v.color === color && v.fit === fit)) out.push({ color, fit });
    }
    return out;
  }, [style]);
  const cell = (color: string, fit: string | null, size: string) => style.variants.find((v) => v.color === color && v.fit === fit && v.size === size);
  const sizeTotal = (size: string) => style.variants.filter((v) => v.size === size).reduce((s, v) => s + Number(v.stockQty), 0);
  const rowTotal = (color: string, fit: string | null) => style.variants.filter((v) => v.color === color && v.fit === fit).reduce((s, v) => s + Number(v.stockQty), 0);
  const total = style.variants.reduce((s, v) => s + Number(v.stockQty), 0);
  const swatch = (name: string) => colors.find((c) => c.name === name)?.hex ?? "transparent";
  // The first photo of a colour (or of the whole style) beside its row in the grid.
  const photo = (color: string) => images.find((i) => i.color === color) ?? images.find((i) => i.color === null);

  const live = style.variants.filter((v) => !v.archived);
  const rates = live.map((v) => Number(v.saleRate)).filter((n) => n > 0);
  const costAt = style.variants.reduce((s2, v) => s2 + Math.max(0, Number(v.stockQty)) * Number(v.purchaseRate || style.purchaseRate || 0), 0);
  const minRate = rates.length ? Math.min(...rates) : 0;
  const maxRate = rates.length ? Math.max(...rates) : 0;
  const markup = Number(style.purchaseRate) > 0 && minRate > 0 ? (minRate / Number(style.purchaseRate) - 1) * 100 : null;
  const fact = (label: string, value: React.ReactNode) => (
    <div className="min-w-0"><dt className="text-[0.8571rem] text-muted">{label}</dt><dd className="truncate rounded-[3px] bg-surface-3 px-1.5 py-1 font-semibold">{value || "-"}</dd></div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-[1.3fr_1.2fr_1fr]">
        <Card className="p-3">
          <h2 className="mb-2.5 flex items-center justify-between gap-2 text-[0.8571rem] font-semibold tracking-wide text-muted uppercase">
            {t("styles.summary.taxonomy")}
            {style.hsn ? <span className="rounded-[3px] border border-border bg-surface-3 px-1.5 text-[0.7857rem] text-text normal-case">HSN {style.hsn} · {Number(style.gstRate)}%</span> : null}
          </h2>
          <dl className="grid grid-cols-2 gap-2 text-[0.9286rem] sm:grid-cols-3">
            {fact(t("styles.summary.code"), <span className="num">{style.code}</span>)}
            <div className="col-span-1 sm:col-span-2">{fact(t("styles.summary.name"), style.name)}</div>
            {fact(t("styles.summary.brand"), style.brand)}
            {fact(t("styles.summary.category"), style.category)}
            {fact(t("styles.summary.season"), style.season)}
            {fact(t("styles.summary.collection"), style.collection)}
            {fact(t("styles.summary.sizes"), style.sizes.join(", "))}
            {fact(t("styles.summary.colours"), String(style.colors.length))}
          </dl>
        </Card>
        <Card className="p-3">
          <h2 className="mb-2.5 flex items-center justify-between gap-2 text-[0.8571rem] font-semibold tracking-wide text-muted uppercase">
            {t("styles.summary.pricing")}
            {markup !== null ? <span className="rounded-[3px] bg-teal-soft px-1.5 text-[0.7857rem] font-bold text-teal normal-case">{t("styles.summary.markup", { pct: Math.round(markup) })}</span> : null}
          </h2>
          <dl className="grid grid-cols-2 gap-2 text-[0.9286rem]">
            {fact(t("styles.summary.cost"), <span className="num">{rupees(style.purchaseRate)}</span>)}
            {fact(t("styles.summary.saleRate"), <span className="num">{minRate === maxRate ? rupees(String(minRate)) : t("styles.summary.range", { from: rupees(String(minRate)), to: rupees(String(maxRate)) })}</span>)}
            {fact(t("styles.summary.pieces"), <span className="num">{total.toLocaleString("en-IN")}</span>)}
            {fact(t("styles.summary.skus"), <span className="num">{live.length}</span>)}
          </dl>
          <div className="mt-2.5 flex items-baseline justify-between rounded-md bg-primary-soft px-3 py-2">
            <span className="text-[0.8571rem] font-semibold text-muted">{t("styles.summary.valueAtCost")}</span>
            <span className="num text-[1.4rem] font-bold">{rupees(costAt.toFixed(2))}</span>
          </div>
        </Card>
        <Card className="p-3">
          <h2 className="mb-2.5 flex items-center justify-between gap-2 text-[0.8571rem] font-semibold tracking-wide text-muted uppercase">
            {t("styles.summary.media")}<span className="text-[0.7857rem] normal-case">{t("styles.summary.photos", { n: images.length })}</span>
          </h2>
          {images.length ? (
            <div className="grid grid-cols-2 gap-2">
              {images.slice(0, 2).map((i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i.id} src={fileUrl(i.thumbFileId)} alt={i.color ?? style.name} className="aspect-[4/5] max-h-44 w-full rounded-md border border-border object-cover" />
              ))}
            </div>
          ) : <p className="text-[0.9286rem] text-muted">{t("styles.summary.noPhotos")}</p>}
          <a href="#photos" className="mt-2 inline-block text-[0.9286rem] font-semibold text-primary hover:underline">{t("styles.summary.managePhotos")}</a>
        </Card>
      </div>

      <Card className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2.5">
          <h2 className="flex items-center gap-2 font-semibold">{t("styles.stockGrid")}<span className="rounded-[3px] bg-navy px-1.5 text-[0.7857rem] font-bold text-white">{live.length}</span></h2>
          <Select value={warehouseId ?? ""} onChange={(e) => router.push(`/inventory/styles/${style.id}${e.target.value ? `?warehouseId=${e.target.value}` : ""}`)} className="w-56" aria-label={t("stock.warehouse")}>
            <option value="">{t("styles.allWarehouses")}</option>
            {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </Select>
        </div>
        <div className="overflow-x-auto px-3 py-3">
          <table className="text-[0.9286rem]">
            <thead>
              <tr>
                <th className="py-2 pr-6 text-left">{t("styles.color")}</th>
                {style.sizes.map((s) => <th key={s} className="num min-w-16 px-2 py-2 text-right">{s}</th>)}
                <th className="num min-w-20 px-2 py-2 text-right">{t("common.total")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.color}|${r.fit}`} className="border-t">
                  <td className="py-2 pr-6 whitespace-nowrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {photo(r.color) ? <img src={fileUrl(photo(r.color)!.thumbFileId)} alt="" className="mr-2 inline-block h-10 w-8 rounded object-cover align-middle" loading="lazy" /> : null}
                    <span aria-hidden className="mr-2 inline-block size-3 rounded-full border border-black/10 align-middle" style={{ background: swatch(r.color) }} />{r.color}{r.fit ? <span className="text-muted"> · {r.fit}</span> : null}
                  </td>
                  {style.sizes.map((s) => {
                    const v = cell(r.color, r.fit, s);
                    const n = v ? Number(v.stockQty) : null;
                    return (
                      <td key={s} className="px-1 py-1.5 align-top" title={v ? `${v.sku ?? ""} ${v.barcode ?? ""}` : undefined}>
                        {v ? (
                          <Link href={`/inventory/items/${v.id}`} className={clsx("block min-w-[5.5rem] rounded-md border px-2 py-1 hover:border-primary", n! <= 0 ? "border-danger/30 bg-danger-soft" : "border-border bg-surface")}>
                            <span className="num block truncate text-[0.7143rem] text-muted">{v.barcode ?? v.sku ?? ""}</span>
                            <span className={clsx("num block text-right text-[1.05rem] font-bold", n! < 0 ? "text-danger" : n === 0 ? "text-danger" : "")}>{n!.toLocaleString("en-IN")}</span>
                          </Link>
                        ) : <span className="block text-center text-muted">·</span>}
                      </td>
                    );
                  })}
                  <td className="num px-2 py-2 text-right font-medium">{rowTotal(r.color, r.fit).toLocaleString("en-IN")}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-border font-medium">
                <td className="py-2 pr-6">{t("common.total")}</td>
                {style.sizes.map((s) => <td key={s} className="num px-2 py-2 text-right">{sizeTotal(s).toLocaleString("en-IN")}</td>)}
                <td className="num px-2 py-2 text-right">{total.toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <div id="photos" className="scroll-mt-20" />
      <StylePhotos styleId={style.id} colors={style.colors} images={images} canEdit={canEdit} />

      <div className="grid gap-6 xl:grid-cols-2">
        {canEdit ? <StyleEdit style={style} /> : null}
        {canEdit ? <AddVariants style={style} colors={colors.filter((c) => !c.archived)} scales={scales} /> : null}
        {canEdit ? <NewPack style={style} colors={colors} /> : null}
        <Card className="p-0">
          <h2 className="border-b border-border px-5 py-3 font-semibold">{t("styles.sets")}</h2>
          <ul className="px-5 py-2 text-sm">
            {style.packs.map((p) => (
              <li key={p.id} className="flex items-baseline justify-between gap-3 border-b border-rule py-2 last:border-0">
                <span>{p.name}<span className="ml-2 font-mono text-xs text-muted">{p.barcode}</span></span>
                <span className="num">{rupees(p.saleRate)}</span>
              </li>
            ))}
            {!style.packs.length ? <li className="py-3 text-muted">{t("styles.noSets")}</li> : null}
          </ul>
        </Card>
      </div>

      <Card className="p-0">
        <h2 className="border-b border-border px-5 py-3 font-semibold">{t("styles.variants")}</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="text-left">
              <tr className="border-b border-border">
                <th className="px-5 py-2.5">{t("items.name")}</th><th className="px-5 py-2.5">{t("items.sku")}</th><th className="px-5 py-2.5">{t("items.barcode")}</th>
                <th className="px-5 py-2.5 text-right">{t("items.purchaseRate")}</th><th className="px-5 py-2.5 text-right">{t("items.saleRate")}</th><th className="px-5 py-2.5 text-right">{t("items.inStock")}</th>
              </tr>
            </thead>
            <tbody>
              {style.variants.map((v) => (
                <tr key={v.id} className="border-b last:border-0">
                  <td className="px-5 py-2"><Link href={`/inventory/items/${v.id}`} className="hover:underline">{v.name}</Link></td>
                  <td className="px-5 py-2 font-mono text-xs">{v.sku}</td>
                  <td className="px-5 py-2 font-mono text-xs">{v.barcode}</td>
                  <td className="num px-5 py-2 text-right">{rupees(v.purchaseRate)}</td>
                  <td className="num px-5 py-2 text-right">{rupees(v.saleRate)}</td>
                  <td className="num px-5 py-2 text-right">{Number(v.stockQty).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StyleEdit({ style }: { style: StyleDetail }) {
  const t = useTranslations();
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => ((f.get(k) as string | null) ?? "").trim();
    setError(null);
    try {
      await api(`/styles/${style.id}`, {
        method: "PATCH",
        body: {
          name: s("name"), brand: s("brand") || null, season: s("season") || null, category: s("category") || null,
          purchaseRate: s("purchaseRate") || "0", saleRate: s("saleRate") || "0", mrp: s("mrp") || null,
          applyPrices: f.get("applyPrices") === "on", archived: f.get("archived") === "on", attributes: readAttributes(f),
        },
      });
      setMsg(t("common.saved"));
      router.refresh();
    } catch (err) { setError(errorText(t, err)); }
  }
  return (
    <Card>
      <h2 className="mb-3 font-semibold">{t("styles.details")}</h2>
      <form onSubmit={save} className="grid gap-3 sm:grid-cols-2">
        {error ? <div className="sm:col-span-2"><Alert>{error}</Alert></div> : null}
        <Field label={t("styles.name")} htmlFor="se-name"><Input id="se-name" name="name" defaultValue={style.name} required /></Field>
        <Field label={t("styles.brand")} htmlFor="se-brand"><Input id="se-brand" name="brand" defaultValue={style.brand ?? ""} list="lke-brand" /><LookupOptions id="lke-brand" kind="brandMaster" /></Field>
        <Field label={t("styles.season")} htmlFor="se-season"><Input id="se-season" name="season" defaultValue={style.season ?? ""} list="lke-season" /><LookupOptions id="lke-season" kind="season" /></Field>
        <Field label={t("styles.category")} htmlFor="se-cat"><Input id="se-cat" name="category" defaultValue={style.category ?? ""} list="lke-cat" /><LookupOptions id="lke-cat" kind="itemGroup" /></Field>
        <StyleAttributes prefix="se-attr" values={style.attributes} />
        <Field label={t("items.purchaseRate")} htmlFor="se-pr"><Input id="se-pr" name="purchaseRate" defaultValue={Number(style.purchaseRate) || ""} inputMode="decimal" className="num" /></Field>
        <Field label={t("items.saleRate")} htmlFor="se-sr"><Input id="se-sr" name="saleRate" defaultValue={Number(style.saleRate) || ""} inputMode="decimal" className="num" /></Field>
        <Field label={t("items.mrp")} htmlFor="se-mrp"><Input id="se-mrp" name="mrp" defaultValue={style.mrp ? Number(style.mrp) : ""} inputMode="decimal" className="num" /></Field>
        <div className="flex flex-col justify-end gap-2 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" name="applyPrices" className="size-4 accent-[var(--primary)]" />{t("styles.applyPrices")}</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="archived" defaultChecked={style.archived} className="size-4 accent-[var(--primary)]" />{t("common.archived")}</label>
        </div>
        <div className="flex items-center gap-3 sm:col-span-2"><Button type="submit">{t("common.save")}</Button>{msg ? <span className="text-sm text-success">{msg}</span> : null}</div>
      </form>
    </Card>
  );
}

function AddVariants({ style, colors, scales }: { style: StyleDetail; colors: Color[]; scales: Scale[] }) {
  const t = useTranslations();
  const router = useRouter();
  const scaleSizes = scales.find((s) => s.id === style.sizeScaleId)?.sizes ?? style.sizes;
  const [colorIds, setColorIds] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>(style.sizes);
  const [error, setError] = useState<string | null>(null);
  async function add() {
    setError(null);
    try {
      await api(`/styles/${style.id}/variants`, { body: { colorIds: colorIds.length ? colorIds : colors.filter((c) => style.colors.includes(c.name)).map((c) => c.id), sizes } });
      setColorIds([]);
      router.refresh();
    } catch (err) { setError(errorText(t, err)); }
  }
  return (
    <Card>
      <h2 className="mb-1 font-semibold">{t("styles.addVariants")}</h2>
      <p className="mb-3 text-sm text-muted">{t("styles.addVariantsHint")}</p>
      {error ? <Alert>{error}</Alert> : null}
      <div className="flex flex-col gap-3">
        <SizeChips sizes={scaleSizes} selected={sizes} toggle={(s) => setSizes((l) => toggleIn(l, s))} />
        <ColorChips colors={colors} selected={colorIds} toggle={(id) => setColorIds((l) => toggleIn(l, id))} />
        <div><Button type="button" variant="outline" onClick={add} disabled={!sizes.length}>{t("styles.addVariants")}</Button></div>
      </div>
    </Card>
  );
}

function NewPack({ style, colors }: { style: StyleDetail; colors: Color[] }) {
  const t = useTranslations();
  const router = useRouter();
  const available = colors.filter((c) => style.colors.includes(c.name));
  const [colorId, setColorId] = useState(available[0]?.id ?? "");
  const [ratio, setRatio] = useState<Record<string, string>>({});
  const [asOne, setAsOne] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pieces = Object.values(ratio).reduce((s, v) => s + (Number(v) || 0), 0);
  async function create() {
    setError(null);
    try {
      await api(`/styles/${style.id}/packs`, { body: { colorId, ratio: Object.fromEntries(Object.entries(ratio).map(([k, v]) => [k, Number(v) || 0])), asOnePiece: asOne } });
      setRatio({});
      router.refresh();
    } catch (err) { setError(errorText(t, err)); }
  }
  return (
    <Card>
      <h2 className="mb-1 font-semibold">{t("styles.newSet")}</h2>
      <p className="mb-3 text-sm text-muted">{t("styles.newSetHint")}</p>
      {error ? <Alert>{error}</Alert> : null}
      <div className="flex flex-col gap-3">
        <Select value={colorId} onChange={(e) => setColorId(e.target.value)} className="max-w-xs" aria-label={t("styles.color")}>
          {available.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
        <div className="flex flex-wrap gap-2">
          {style.sizes.map((s) => (
            <label key={s} className="flex flex-col items-center gap-1 text-xs">
              <span className="font-medium">{s}</span>
              <Input value={ratio[s] ?? ""} onChange={(e) => setRatio((r) => ({ ...r, [s]: e.target.value }))} inputMode="numeric" className="num h-8 w-14 px-2 text-center" aria-label={`${t("styles.ratio")} ${s}`} />
            </label>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm" title={t("items.slabPiecesHint")}>
          <input type="checkbox" checked={asOne} onChange={(e) => setAsOne(e.target.checked)} className="size-4 accent-[var(--primary)]" />{t("styles.setAsOnePiece")}
        </label>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={create} disabled={!colorId || !pieces}>{t("styles.createSet", { count: pieces })}</Button>
        </div>
      </div>
    </Card>
  );
}

// ---- sizes and colours --------------------------------------------------------------------------------

export function SizesColors({ scales, colors, canEdit }: { scales: Scale[]; colors: Color[]; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  async function call(path: string, body: unknown, method = "POST") {
    setError(null);
    try { await api(path, { method, body }); router.refresh(); return true; } catch (err) { setError(errorText(t, err)); return false; }
  }
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {error ? <div className="xl:col-span-2"><Alert>{error}</Alert></div> : null}
      <Card className="p-0">
        <h2 className="border-b border-border px-5 py-3 font-semibold">{t("styles.sizeScales")}</h2>
        <ul className="px-5 py-2">
          {scales.map((s) => (
            <li key={s.id} className="flex flex-col gap-1 border-b border-rule py-3 last:border-0">
              {canEdit ? (
                <form className="flex flex-wrap items-center gap-2" onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  void call(`/size-scales/${s.id}`, { name: f.get("name"), sizes: String(f.get("sizes")).split(",").map((x) => x.trim()).filter(Boolean), archived: f.get("archived") === "on" }, "PATCH");
                }}>
                  <Input name="name" defaultValue={s.name} className="w-48" aria-label={t("styles.scaleName")} />
                  <Input name="sizes" defaultValue={s.sizes.join(", ")} className="min-w-56 flex-1" aria-label={t("styles.sizes")} />
                  <label className="flex items-center gap-1.5 text-xs text-muted"><input type="checkbox" name="archived" defaultChecked={s.archived} className="size-3.5" />{t("common.archived")}</label>
                  <Button type="submit" variant="outline" className="h-8">{t("common.save")}</Button>
                </form>
              ) : <span>{s.name}: <span className="text-muted">{s.sizes.join(", ")}</span></span>}
            </li>
          ))}
        </ul>
        {canEdit ? (
          <form className="flex flex-wrap items-center gap-2 border-t border-border px-5 py-3" onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const f = new FormData(form);
            if (await call("/size-scales", { name: f.get("name"), sizes: String(f.get("sizes")).split(",").map((x) => x.trim()).filter(Boolean) })) form.reset();
          }}>
            <Input name="name" required placeholder={t("styles.scaleName")} className="w-48" aria-label={t("styles.scaleName")} />
            <Input name="sizes" required placeholder={t("styles.sizesExample")} className="min-w-56 flex-1" aria-label={t("styles.sizes")} />
            <Button type="submit" className="h-8"><Plus className="size-4" aria-hidden />{t("common.add")}</Button>
          </form>
        ) : null}
      </Card>
      <Card className="p-0">
        <h2 className="border-b border-border px-5 py-3 font-semibold">{t("styles.colors")}</h2>
        <ul className="grid gap-x-6 px-5 py-2 sm:grid-cols-2">
          {colors.map((c) => (
            <li key={c.id} className={clsx("flex items-center gap-2.5 border-b border-rule py-2 text-sm", c.archived && "opacity-50")}>
              <span aria-hidden className="size-4 rounded-full border border-black/10" style={{ background: c.hex ?? "transparent" }} />
              <span className="flex-1">{c.name}</span>
              <span className="font-mono text-xs text-muted">{c.code}</span>
              {canEdit ? <button type="button" className="text-xs text-muted hover:text-text" onClick={() => void call(`/colors/${c.id}`, { name: c.name, archived: !c.archived }, "PATCH")}>{c.archived ? t("styles.restore") : t("styles.archive")}</button> : null}
            </li>
          ))}
        </ul>
        {canEdit ? (
          <form className="flex flex-wrap items-center gap-2 border-t border-border px-5 py-3" onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const f = new FormData(form);
            if (await call("/colors", { name: f.get("name"), code: f.get("code") || undefined, hex: f.get("hex") })) form.reset();
          }}>
            <Input name="name" required placeholder={t("styles.colorName")} className="w-40" aria-label={t("styles.colorName")} />
            <Input name="code" maxLength={8} placeholder={t("styles.colorCode")} className="w-24 font-mono" aria-label={t("styles.colorCode")} />
            <input name="hex" type="color" defaultValue="#888888" className="h-8 w-10 cursor-pointer rounded border border-border bg-surface" aria-label={t("styles.swatch")} />
            <Button type="submit" className="h-8"><Plus className="size-4" aria-hidden />{t("common.add")}</Button>
          </form>
        ) : null}
      </Card>
    </div>
  );
}
