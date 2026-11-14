"use client";

import clsx from "clsx";
import { ImageOff, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { rupees } from "@/lib/format";
import { fileUrl } from "@/lib/images";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export interface Tile {
  key: string; styleId: string; code: string; name: string; brand: string | null; category: string | null; season: string | null;
  color: string | null; colorHex: string | null; image: { fileId: string; thumbFileId: string } | null; imageCount: number;
  rate: string; mrp: string | null; stock: string; sold: string;
  sizes: { itemId: string; size: string | null; barcode: string | null; rate: string; stock: string }[];
}
type Facet = { value: string; count: number };
export interface CatalogueData {
  total: number; tiles: Tile[];
  facets: { brands: Facet[]; categories: Facet[]; seasons: Facet[]; colors: Facet[]; rate: { min: number; max: number } };
}
export interface SelectionRow { id: string; name: string; party: string | null; count: number; sharedUntil: string | null; updatedAt: string }
type Params = Record<string, string | string[] | undefined>;
type CartLine = { styleId: string; color: string | null; label: string };

const PAGE = 60;
const CART_KEY = "varchasv.catalogue.cart";
const SIZE_KEY = "varchasv.catalogue.tile";
const many = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : []);

/** The image catalogue: filters on the left, tiles of each design and colour, and a cart that saves as a selection. */
export function Catalogue({ data, params, parties, selections, canCreate }: {
  data: CatalogueData; params: Params; parties: { id: string; name: string }[]; selections: SelectionRow[]; canCreate: boolean;
}) {
  const t = useTranslations();
  const router = useRouter();
  const path = usePathname();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [tile, setTile] = useState(200);
  const [cartOpen, setCartOpen] = useState(false);
  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem(CART_KEY) ?? "[]") as CartLine[]);
      const w = Number(localStorage.getItem(SIZE_KEY));
      if (w >= 150 && w <= 320) setTile(w);
    } catch { /* storage blocked: start empty */ }
  }, []);
  const keep = (next: CartLine[]) => {
    setCart(next);
    try { localStorage.setItem(CART_KEY, JSON.stringify(next)); } catch { /* not kept between visits */ }
  };
  const inCart = (x: Tile) => cart.some((c) => c.styleId === x.styleId && c.color === x.color);
  const toggle = (x: Tile) => keep(inCart(x) ? cart.filter((c) => !(c.styleId === x.styleId && c.color === x.color)) : [...cart, { styleId: x.styleId, color: x.color, label: `${x.code} ${x.color ?? ""}`.trim() }]);

  // Every filter lives in the address, so a filtered view can be bookmarked or sent to a colleague.
  const go = (patch: Params) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...params, offset: undefined, ...patch })) for (const x of many(v)) next.append(k, x);
    router.push(`${path}?${next.toString()}`);
  };
  const flip = (key: string, value: string) => {
    const now = many(params[key]);
    go({ [key]: now.includes(value) ? now.filter((x) => x !== value) : [...now, value] });
  };
  const offset = Number(params.offset ?? 0) || 0;

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      <Filters data={data} params={params} parties={parties} go={go} flip={flip} />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium">{t("catalogue.records", { n: data.total })}</span>
          <span className="flex-1" />
          <label className="flex items-center gap-2 text-sm text-muted">
            {t("catalogue.tileSize")}
            <input type="range" min={150} max={320} step={10} value={tile} onChange={(e) => { setTile(Number(e.target.value)); try { localStorage.setItem(SIZE_KEY, e.target.value); } catch { /* fine */ } }} className="w-28 accent-[var(--color-primary)]" />
          </label>
          <Select value={String(params.sort ?? "code")} onChange={(e) => go({ sort: e.target.value })} className="w-44" aria-label={t("catalogue.sort")}>
            {(["code", "newest", "best", "price_low", "price_high", "stock"] as const).map((s) => <option key={s} value={s}>{t(`catalogue.sorts.${s}`)}</option>)}
          </Select>
          <Button variant={cart.length ? "primary" : "outline"} onClick={() => setCartOpen(!cartOpen)}><ShoppingBag className="size-4" aria-hidden />{t("catalogue.cart", { n: cart.length })}</Button>
        </div>
        {cartOpen ? <Cart cart={cart} keep={keep} partyId={typeof params.partyId === "string" ? params.partyId : ""} parties={parties} canCreate={canCreate} onClose={() => setCartOpen(false)} /> : null}

        <ul className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${tile}px, 1fr))` }}>
          {data.tiles.map((x) => (
            <li key={x.key} className={clsx("flex flex-col overflow-hidden rounded-lg border bg-surface", inCart(x) ? "border-primary ring-2 ring-primary/30" : "border-border")}>
              <Link href={`/inventory/styles/${x.styleId}`} className="relative block bg-surface-2">
                {x.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={fileUrl(x.image.thumbFileId)} alt={`${x.name} ${x.color ?? ""}`} className="aspect-[3/4] w-full object-cover" loading="lazy" />
                ) : (
                  <span className="flex aspect-[3/4] w-full items-center justify-center text-muted"><ImageOff className="size-8" aria-hidden /><span className="sr-only">{t("catalogue.noPhoto")}</span></span>
                )}
                {x.imageCount > 1 ? <span className="absolute right-2 bottom-2 rounded bg-black/60 px-1.5 text-xs text-white">{x.imageCount}</span> : null}
              </Link>
              <div className="flex flex-1 flex-col gap-1 px-3 py-2 text-sm">
                <span className="truncate font-medium" title={`${x.code} ${x.name}`}><span className="font-mono text-xs text-muted">{x.code}</span> {x.name}</span>
                <span className="flex items-center gap-1.5 text-muted">
                  {x.colorHex ? <span aria-hidden className="inline-block size-3 rounded-full border border-black/10" style={{ background: x.colorHex }} /> : null}
                  {x.color ?? t("catalogue.allColours")}{x.brand ? ` · ${x.brand}` : ""}
                </span>
                <span className="flex flex-wrap items-baseline gap-x-3">
                  <span className="num font-semibold">{rupees(x.rate)}</span>
                  <span className={clsx("text-xs", Number(x.stock) > 0 ? "text-success" : "text-muted")}>{t("catalogue.stock", { n: Number(x.stock) })}</span>
                  <span className="text-xs text-muted">{t("catalogue.sold", { n: Number(x.sold) })}</span>
                </span>
                <span className="flex flex-wrap gap-1 text-xs">
                  {x.sizes.map((s) => <span key={s.itemId} className={clsx("rounded border px-1", Number(s.stock) > 0 ? "border-border" : "border-transparent text-muted line-through")} title={s.barcode ?? undefined}>{s.size ?? "-"}</span>)}
                </span>
                <span className="flex-1" />
                <button type="button" onClick={() => toggle(x)} className={clsx("mt-1 self-start rounded-md px-2 py-1 text-xs font-medium", inCart(x) ? "bg-primary-soft text-primary" : "text-primary hover:bg-primary-soft")}>
                  {inCart(x) ? t("catalogue.added") : t("catalogue.add")}
                </button>
              </div>
            </li>
          ))}
        </ul>
        {!data.tiles.length ? <Card className="py-10 text-center text-sm text-muted">{t("catalogue.none")}</Card> : null}
        {data.total > PAGE ? (
          <div className="flex items-center justify-center gap-3 text-sm">
            <Button variant="outline" disabled={offset === 0} onClick={() => go({ offset: String(Math.max(0, offset - PAGE)) })}>{t("catalogue.previous")}</Button>
            <span className="text-muted">{t("catalogue.showing", { from: offset + 1, to: Math.min(data.total, offset + PAGE), total: data.total })}</span>
            <Button variant="outline" disabled={offset + PAGE >= data.total} onClick={() => go({ offset: String(offset + PAGE) })}>{t("catalogue.next")}</Button>
          </div>
        ) : null}

        <Card className="p-0">
          <h2 className="border-b border-border px-5 py-3 font-semibold">{t("catalogue.selections")}</h2>
          <ul className="divide-y divide-border text-sm">
            {selections.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5">
                <Link href={`/inventory/catalogue/${s.id}`} className="font-medium text-primary hover:underline">{s.name}</Link>
                <span className="text-muted">{[s.party, t("catalogue.designs", { n: s.count }), s.sharedUntil ? t("catalogue.sharedBadge") : null].filter(Boolean).join(" · ")}</span>
              </li>
            ))}
            {!selections.length ? <li className="px-5 py-4 text-muted">{t("catalogue.noSelections")}</li> : null}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Filters({ data, params, parties, go, flip }: {
  data: CatalogueData; params: Params; parties: { id: string; name: string }[]; go: (p: Params) => void; flip: (k: string, v: string) => void;
}) {
  const t = useTranslations();
  const [q, setQ] = useState(String(params.q ?? ""));
  const [min, setMin] = useState(String(params.minRate ?? ""));
  const [max, setMax] = useState(String(params.maxRate ?? ""));
  const [from, setFrom] = useState(String(params.receivedFrom ?? ""));
  const [to, setTo] = useState(String(params.receivedTo ?? ""));
  const group = (key: "brand" | "category" | "season" | "color", label: string, list: Facet[]) => list.length ? (
    <details open={key === "brand" || many(params[key]).length > 0} className="border-t border-border pt-2">
      <summary className="cursor-pointer text-sm font-medium">{label}</summary>
      <ul className="mt-1 max-h-48 overflow-y-auto pr-1 text-sm">
        {list.map((f) => (
          <li key={f.value}>
            <label className="flex items-center gap-2 py-0.5">
              <input type="checkbox" checked={many(params[key]).includes(f.value)} onChange={() => flip(key, f.value)} className="accent-[var(--color-primary)]" />
              <span className="flex-1 truncate">{f.value}</span><span className="num text-xs text-muted">{f.count}</span>
            </label>
          </li>
        ))}
      </ul>
    </details>
  ) : null;
  const active = ["q", "brand", "category", "season", "color", "minRate", "maxRate", "inStock", "withImage", "receivedFrom", "receivedTo"].some((k) => many(params[k]).length);
  return (
    <Card className="flex w-full flex-col gap-3 lg:sticky lg:top-4 lg:w-64 lg:shrink-0">
      <form onSubmit={(e) => { e.preventDefault(); go({ q: q.trim() || undefined }); }} className="relative">
        <Search className="pointer-events-none absolute top-2.5 left-2.5 size-4 text-muted" aria-hidden />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("catalogue.search")} aria-label={t("catalogue.search")} className="pl-8" />
      </form>
      <Field label={t("catalogue.priceFor")} htmlFor="cat-party">
        <Select id="cat-party" value={String(params.partyId ?? "")} onChange={(e) => go({ partyId: e.target.value || undefined })}>
          <option value="">{t("catalogue.saleRate")}</option>
          {parties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </Select>
      </Field>
      <div className="flex flex-col gap-1 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={params.inStock === "true"} onChange={(e) => go({ inStock: e.target.checked ? "true" : undefined })} className="accent-[var(--color-primary)]" />{t("catalogue.inStockOnly")}</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={params.withImage === "true"} onChange={(e) => go({ withImage: e.target.checked ? "true" : undefined })} className="accent-[var(--color-primary)]" />{t("catalogue.withPhotoOnly")}</label>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); go({ minRate: min || undefined, maxRate: max || undefined, receivedFrom: from || undefined, receivedTo: to || undefined }); }} className="flex flex-col gap-2 border-t border-border pt-2">
        <span className="text-sm font-medium">{t("catalogue.rate")}</span>
        <div className="flex items-center gap-2">
          <Input value={min} onChange={(e) => setMin(e.target.value)} inputMode="decimal" className="num" placeholder={String(data.facets.rate.min)} aria-label={t("catalogue.rateFrom")} />
          <span className="text-muted">-</span>
          <Input value={max} onChange={(e) => setMax(e.target.value)} inputMode="decimal" className="num" placeholder={String(data.facets.rate.max)} aria-label={t("catalogue.rateTo")} />
        </div>
        <span className="text-sm font-medium">{t("catalogue.received")}</span>
        <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label={t("catalogue.receivedFrom")} />
        <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} aria-label={t("catalogue.receivedTo")} />
        <Button type="submit" variant="outline">{t("catalogue.apply")}</Button>
      </form>
      {group("brand", t("catalogue.brand"), data.facets.brands)}
      {group("category", t("catalogue.category"), data.facets.categories)}
      {group("season", t("catalogue.season"), data.facets.seasons)}
      {group("color", t("styles.color"), data.facets.colors)}
      {active ? <Button variant="ghost" onClick={() => go({ q: undefined, brand: undefined, category: undefined, season: undefined, color: undefined, minRate: undefined, maxRate: undefined, inStock: undefined, withImage: undefined, receivedFrom: undefined, receivedTo: undefined })}><X className="size-4" aria-hidden />{t("catalogue.clear")}</Button> : null}
    </Card>
  );
}

function Cart({ cart, keep, partyId, parties, canCreate, onClose }: {
  cart: CartLine[]; keep: (c: CartLine[]) => void; partyId: string; parties: { id: string; name: string }[]; canCreate: boolean; onClose: () => void;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [name, setName] = useState("");
  const [party, setParty] = useState(partyId);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      const partyName = parties.find((p) => p.id === party)?.name;
      const r = await api<{ id: string }>("/catalogue/selections", { body: {
        name: name.trim() || (partyName ? t("catalogue.defaultName", { party: partyName }) : t("catalogue.untitled")), partyId: party || null,
        lines: cart.map(({ styleId, color }) => ({ styleId, color })),
      } });
      keep([]);
      onClose();
      router.push(`/inventory/catalogue/${r.id}`);
    } catch (err) {
      const code = err instanceof ApiError ? (err.issues?.[0]?.message ?? err.code) : "generic";
      setError(t.has(`catalogue.errors.${code}`) ? t(`catalogue.errors.${code}`) : t("auth.errors.generic"));
      setBusy(false);
    }
  };
  return (
    <Card className="flex flex-col gap-3">
      <h2 className="font-semibold">{t("catalogue.cartTitle")}</h2>
      {error ? <Alert>{error}</Alert> : null}
      {cart.length ? (
        <ul className="flex flex-wrap gap-2 text-sm">
          {cart.map((c) => (
            <li key={`${c.styleId}:${c.color}`} className="flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5">
              {c.label}
              <button type="button" onClick={() => keep(cart.filter((x) => x !== c))} className="text-muted hover:text-danger" title={t("common.remove")}><X className="size-3.5" aria-hidden /><span className="sr-only">{t("common.remove")}</span></button>
            </li>
          ))}
        </ul>
      ) : <p className="text-sm text-muted">{t("catalogue.cartEmpty")}</p>}
      {canCreate && cart.length ? (
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Field label={t("catalogue.selectionName")} htmlFor="sel-name"><Input id="sel-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} /></Field>
          <Field label={t("catalogue.forParty")} htmlFor="sel-party">
            <Select id="sel-party" value={party} onChange={(e) => setParty(e.target.value)}>
              <option value="">{t("catalogue.anyone")}</option>
              {parties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          </Field>
          <div className="flex gap-2">
            <Button disabled={busy} onClick={save}>{t("catalogue.saveSelection")}</Button>
            <Button variant="ghost" onClick={() => keep([])}>{t("catalogue.emptyCart")}</Button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
