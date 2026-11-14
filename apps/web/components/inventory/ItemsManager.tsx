"use client";

import { HsnOptions } from "../masters/HsnOptions";
import { Pencil, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { GST_RATES, formatIndian } from "@varchasv/domain";
import { ApiError, api } from "@/lib/client-api";
import { localName } from "@/lib/format";
import type { ItemOption } from "@/lib/masters";
import { Drawer } from "../Drawer";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

type Uom = { id: string; code: string; name: string; nameHi: string | null };
export type Item = ItemOption & { uomId: string; sku: string | null; barcode: string | null; saleRate: string; mrp: string | null; reorderLevel: string | null; reorderQty: string | null; leadTimeDays?: number; defaultQty?: string | null; shortCode?: string | null };

export function ItemsManager({ items, uoms, canCreate, canEdit }: { items: Item[]; uoms: Uom[]; canCreate: boolean; canEdit: boolean }) {
  const t = useTranslations();
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Item | "new" | null>(null);
  const [dirty, setDirty] = useState(false);
  const closeDrawer = () => { setEditing(null); setDirty(false); };
  const q = query.trim().toLowerCase();
  const visible = items.filter((i) => !q || i.name.toLowerCase().includes(q) || (i.nameHi ?? "").includes(q) || (i.hsn ?? "").includes(q) || (i.sku ?? "").toLowerCase().includes(q));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-60 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("common.search")} className="pl-9" aria-label={t("common.search")} />
        </div>
        {canCreate && !editing ? <Button onClick={() => setEditing("new")}><Plus className="size-4" aria-hidden />{t("items.new")}</Button> : null}
      </div>
      {editing ? (
        <Drawer title={editing === "new" ? t("items.new") : editing.name} subtitle={editing === "new" ? undefined : [editing.hsn, editing.sku].filter(Boolean).join(" · ") || undefined} dirty={dirty} onClose={closeDrawer}>
          <ItemForm key={editing === "new" ? "new" : editing.id} item={editing === "new" ? null : editing} uoms={uoms} onDirty={() => setDirty(true)} onDone={closeDrawer} />
        </Drawer>
      ) : null}
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("items.name")}</th>
                <th className="px-5 py-3 font-medium">{t("items.hsn")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("items.gstRate")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("items.purchaseRate")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("items.inStock")}</th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {visible.map((i) => (
                <tr key={i.id} className="border-b border-border last:border-0 hover:bg-surface-2/60">
                  <td className="px-5 py-2.5">
                    <Link href={`/inventory/items/${i.id}`} className="font-medium hover:text-primary hover:underline">{localName(i, locale)}</Link>
                    {i.kind === "service" ? <span className="ml-2 rounded bg-surface-2 px-1.5 text-xs text-muted">{t("items.service")}</span> : null}
                    {i.archived ? <span className="ml-2 text-xs text-muted">({t("common.archived")})</span> : null}
                    {i.sku ? <span className="block font-mono text-xs text-muted">{i.sku}</span> : null}
                  </td>
                  <td className="px-5 py-2.5 font-mono text-xs">{i.hsn}</td>
                  <td className="num px-5 py-2.5 text-right">{i.gstSlab ? <span title={t(`items.slab.${i.gstSlab}`)}>{t("items.byPrice")}</span> : `${Number(i.gstRate)}%`}</td>
                  <td className="num px-5 py-2.5 text-right">₹ {formatIndian(i.purchaseRate)}</td>
                  <td className="num px-5 py-2.5 text-right">{i.kind === "goods" ? `${Number(i.stockQty).toLocaleString("en-IN")} ${i.uom}` : "-"}</td>
                  <td className="pr-3 text-right">
                    {canEdit ? (
                      <button onClick={() => setEditing(i)} className="rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-text" title={t("common.edit")}>
                        <Pencil className="size-4" aria-hidden /><span className="sr-only">{t("common.edit")} {i.name}</span>
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
              {!visible.length ? <tr><td colSpan={6} className="px-5 py-8 text-center text-muted">{t("items.empty")}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function ItemForm({ item, uoms, onDirty, onDone }: { item: Item | null; uoms: Uom[]; onDirty: () => void; onDone: () => void }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [kind, setKind] = useState<"goods" | "service">(item?.kind ?? "goods");
  const [slab, setSlab] = useState<string>(item?.gstSlab ?? "");
  const [units, setUnits] = useState<{ uomId: string; factor: string }[]>(item?.units?.map((u) => ({ uomId: u.uomId, factor: String(Number(u.factor)) })) ?? []);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => ((f.get(k) as string | null) ?? "").trim();
    const opt = (k: string) => s(k) || null;
    const body = {
      name: s("name"), nameHi: opt("nameHi"), sku: opt("sku"), barcode: opt("barcode"), hsn: opt("hsn"), gstRate: slab ? "5" : s("gstRate"), uomId: s("uomId"),
      gstSlab: slab || null, slabPieces: slab ? Math.max(1, Number(f.get("slabPieces") || 1)) : 1,
      purchaseRate: s("purchaseRate") || "0", saleRate: s("saleRate") || "0", mrp: opt("mrp"),
      reorderLevel: opt("reorderLevel"), reorderQty: opt("reorderQty"), defaultQty: opt("defaultQty") ?? null, shortCode: opt("shortCode") ?? null, trackBatches: f.get("trackBatches") === "on", leadTimeDays: Number(f.get("leadTimeDays") || 0),
      ...(item ? { archived: f.get("archived") === "on" } : { kind }),
    };
    setError(null);
    try {
      const saved = item ? await api<{ id: string }>(`/items/${item.id}`, { method: "PATCH", body }) : await api<{ id: string }>("/items", { body });
      const keep = units.filter((u) => u.uomId && Number(u.factor) > 0);
      if (kind === "goods" && (keep.length || item?.units?.length)) await api(`/items/${item?.id ?? saved.id}/units`, { method: "PUT", body: { units: keep } });
      const wants = f.get("trackSerials") === "on";
      if (kind === "goods" && wants !== !!item?.trackSerials) await api(`/items/${item?.id ?? saved.id}/track-serials`, { method: "PUT", body: { value: wants } });
      onDone();
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? (err.issues?.[0]?.message ?? err.code) : "generic";
      setError(t.has(`items.errors.${code}`) ? t(`items.errors.${code}`) : t("auth.errors.generic"));
    }
  }

  return (
      <form onSubmit={save} onChange={onDirty} className="grid gap-4 sm:grid-cols-2">
        {error ? <div className="sm:col-span-2"><Alert>{error}</Alert></div> : null}
        <Field label={t("items.name")} htmlFor="it-name"><Input id="it-name" name="name" defaultValue={item?.name} required autoFocus /></Field>
        <Field label={t("items.kind")} htmlFor="it-kind">
          <Select id="it-kind" value={kind} onChange={(e) => setKind(e.target.value as "goods" | "service")} disabled={!!item}>
            <option value="goods">{t("items.goods")}</option>
            <option value="service">{t("items.service")}</option>
          </Select>
        </Field>
        <Field label={t("items.hsn")} htmlFor="it-hsn"><Input id="it-hsn" name="hsn" defaultValue={item?.hsn ?? ""} inputMode="numeric" maxLength={8} className="font-mono" list="it-hsn-list" /><HsnOptions id="it-hsn-list" /></Field>
        {kind === "goods" ? (
          <Field label={t("items.gstSlab")} htmlFor="it-slab" hint={slab ? t(`items.slab.${slab}`) : undefined}>
            <Select id="it-slab" value={slab} onChange={(e) => setSlab(e.target.value)}>
              <option value="">{t("items.slabNone")}</option>
              <option value="apparel">{t("items.slabApparel")}</option>
              <option value="footwear">{t("items.slabFootwear")}</option>
            </Select>
          </Field>
        ) : null}
        {slab && kind === "goods" ? (
          <Field label={t("items.slabPieces")} htmlFor="it-sp" hint={t("items.slabPiecesHint")}>
            <Input id="it-sp" name="slabPieces" defaultValue={item?.slabPieces ?? 1} inputMode="numeric" pattern="\d{1,3}" className="num" />
          </Field>
        ) : (
          <Field label={t("items.gstRate")} htmlFor="it-gst">
            <Select id="it-gst" name="gstRate" defaultValue={item ? String(Number(item.gstRate)) : "18"}>
              {GST_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
            </Select>
          </Field>
        )}
        <Field label={t("items.uom")} htmlFor="it-uom">
          <Select id="it-uom" name="uomId" defaultValue={item?.uomId ?? uoms.find((u) => u.code === (kind === "service" ? "OTH" : "NOS"))?.id}>
            {uoms.map((u) => <option key={u.id} value={u.id}>{u.code} - {localName(u, locale)}</option>)}
          </Select>
        </Field>
        <Field label={t("items.purchaseRate")} htmlFor="it-pr"><Input id="it-pr" name="purchaseRate" defaultValue={item && Number(item.purchaseRate) ? Number(item.purchaseRate) : ""} inputMode="decimal" className="num" /></Field>
        <Field label={t("items.saleRate")} htmlFor="it-sr"><Input id="it-sr" name="saleRate" defaultValue={item && Number(item.saleRate) ? Number(item.saleRate) : ""} inputMode="decimal" className="num" /></Field>
        <Field label={t("items.mrp")} htmlFor="it-mrp"><Input id="it-mrp" name="mrp" defaultValue={item?.mrp ? Number(item.mrp) : ""} inputMode="decimal" className="num" /></Field>
        <Field label={t("items.sku")} htmlFor="it-sku"><Input id="it-sku" name="sku" defaultValue={item?.sku ?? ""} maxLength={40} /></Field>
        <Field label={t("items.barcode")} htmlFor="it-bc"><Input id="it-bc" name="barcode" defaultValue={item?.barcode ?? ""} maxLength={40} /></Field>
        {kind === "goods" ? (
          <>
            <Field label={t("items.reorderLevel")} htmlFor="it-rl"><Input id="it-rl" name="reorderLevel" defaultValue={item?.reorderLevel ? Number(item.reorderLevel) : ""} inputMode="decimal" className="num" /></Field>
            <Field label={t("items.reorderQty")} htmlFor="it-rq"><Input id="it-rq" name="reorderQty" defaultValue={item?.reorderQty ? Number(item.reorderQty) : ""} inputMode="decimal" className="num" /></Field>
            <Field label={t("items.defaultQty")} htmlFor="it-dq" hint={t("items.defaultQtyHint")}><Input id="it-dq" name="defaultQty" defaultValue={item?.defaultQty ? Number(item.defaultQty) : ""} inputMode="decimal" className="num" /></Field>
            <Field label={t("items.shortCode")} htmlFor="it-sc" hint={t("items.shortCodeHint")}><Input id="it-sc" name="shortCode" defaultValue={item?.shortCode ?? ""} maxLength={12} pattern="[A-Za-z0-9]{1,12}" /></Field>
            <Field label={t("items.leadTimeDays")} htmlFor="it-lt"><Input id="it-lt" name="leadTimeDays" defaultValue={item?.leadTimeDays ?? 0} inputMode="numeric" pattern="\d{1,3}" className="num" /></Field>
          </>
        ) : null}
        <Field label={<>{t("accounts.nameHi")} <span className="font-normal text-muted">({t("common.optional")})</span></>} htmlFor="it-hi"><Input id="it-hi" name="nameHi" defaultValue={item?.nameHi ?? ""} lang="hi" /></Field>
        {kind === "goods" ? (
          <div className="flex flex-col gap-2 sm:col-span-2">
            <span className="text-[0.8125rem] font-medium">{t("items.otherUnits")} <span className="font-normal text-muted">({t("common.optional")})</span></span>
            {units.map((u, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted">1</span>
                <Select value={u.uomId} onChange={(e) => setUnits((l) => l.map((x, j) => (j === i ? { ...x, uomId: e.target.value } : x)))} className="w-28" aria-label={t("items.uom")}>
                  <option value="" />
                  {uoms.map((o) => <option key={o.id} value={o.id}>{o.code}</option>)}
                </Select>
                <span className="text-muted">=</span>
                <Input value={u.factor} onChange={(e) => setUnits((l) => l.map((x, j) => (j === i ? { ...x, factor: e.target.value } : x)))} inputMode="decimal" className="num w-24" aria-label={t("items.unitFactor")} />
                <span className="text-muted">{t("items.ofBaseUnit")}</span>
                <Button type="button" variant="ghost" className="h-8 px-2" onClick={() => setUnits((l) => l.filter((_, j) => j !== i))}>{t("common.remove")}</Button>
              </div>
            ))}
            <div><Button type="button" variant="ghost" className="-ml-3 h-8" onClick={() => setUnits((l) => [...l, { uomId: "", factor: "" }])}><Plus className="size-4" aria-hidden />{t("items.addUnit")}</Button></div>
          </div>
        ) : null}
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          {kind === "goods" ? (
            <>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="trackBatches" defaultChecked={item?.trackBatches} className="size-4 accent-[var(--primary)]" />{t("items.trackBatches")}</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="trackSerials" defaultChecked={item?.trackSerials} className="size-4 accent-[var(--primary)]" />{t("items.trackSerials")}</label>
            </>
          ) : null}
          {item ? <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="archived" defaultChecked={item.archived} className="size-4 accent-[var(--primary)]" />{t("common.archived")}</label> : null}
        </div>
        {item ? <ItemCodes itemId={item.id} /> : null}
        <div className="sticky bottom-0 -mx-5 -mb-4 flex gap-3 border-t border-border bg-surface px-5 py-3 sm:col-span-2">
          <Button type="submit">{t("common.save")}</Button>
          <Button type="button" variant="ghost" onClick={onDone}>{t("common.cancel")}</Button>
        </div>
      </form>
  );
}

interface Alias { id: string; code: string; kind: string; supplier: string | null }

/** Other codes this item answers to (a supplier's barcode, an old label). Scanning any of them finds the item; old documents are untouched. */
function ItemCodes({ itemId }: { itemId: string }) {
  const t = useTranslations();
  const [aliases, setAliases] = useState<Alias[]>([]);
  const [code, setCode] = useState("");
  const [kind, setKind] = useState("alternate");
  const [error, setError] = useState<string | null>(null);
  const load = () => api<Alias[]>(`/items/${itemId}/barcodes`).then(setAliases).catch(() => setAliases([]));
  useEffect(() => { void load(); }, [itemId]); // eslint-disable-line react-hooks/exhaustive-deps
  const add = async () => {
    setError(null);
    try { await api(`/items/${itemId}/barcodes`, { body: { code: code.trim(), kind } }); setCode(""); await load(); } catch (err) { setError(err instanceof ApiError ? (t.has(`items.codes.errors.${err.code}`) ? t(`items.codes.errors.${err.code}`) : err.code) : String(err)); }
  };
  const remove = async (id: string) => { try { await api(`/items/barcodes/${id}`, { method: "DELETE" }); await load(); } catch { /* shown again on reload */ } };
  return (
    <div className="flex flex-col gap-2 sm:col-span-2">
      <span className="text-[0.8125rem] font-medium">{t("items.codes.title")}</span>
      <p className="text-xs text-muted">{t("items.codes.help")}</p>
      {aliases.map((a) => (
        <div key={a.id} className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-mono">{a.code}</span><span className="text-muted">{t(`items.codes.kind.${a.kind}`)}</span>
          <Button type="button" variant="ghost" className="h-8 px-2" onClick={() => void remove(a.id)}>{t("common.remove")}</Button>
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-2">
        <Input value={code} onChange={(e) => setCode(e.target.value)} maxLength={40} className="w-48 font-mono" aria-label={t("items.codes.code")} />
        <Select value={kind} onChange={(e) => setKind(e.target.value)} className="w-40" aria-label={t("items.codes.kindLabel")}>
          <option value="alternate">{t("items.codes.kind.alternate")}</option><option value="supplier">{t("items.codes.kind.supplier")}</option>
        </Select>
        <Button type="button" variant="outline" disabled={!code.trim()} onClick={() => void add()}>{t("items.codes.add")}</Button>
      </div>
      {error ? <p role="alert" className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
