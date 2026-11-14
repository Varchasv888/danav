"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { localName, rupees } from "@/lib/format";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

type Kind = "percent" | "amount_off" | "qty_slab" | "value_slab" | "buy_get" | "combo";
const KINDS: Kind[] = ["percent", "amount_off", "qty_slab", "value_slab", "buy_get", "combo"];

export interface SchemeRow {
  id: string; name: string; kind: Kind; startsOn: string | null; endsOn: string | null; active: boolean;
  priority?: number | null; weekdays?: number[] | null; fromTime?: string | null; toTime?: string | null; branchIds?: string[] | null;
  scope: { itemIds?: string[]; styleIds?: string[]; brands?: string[]; categories?: string[]; attrs?: Record<string, string[]>; exclude?: { brands?: string[]; categories?: string[]; attrs?: Record<string, string[]> } };
  confirmBeforeApply?: boolean; allowWithGiftVouchers?: boolean; allowWithCustomerDiscount?: boolean; allowReturns?: boolean; applyOnDiscounted?: boolean; inclusiveOfTax?: boolean; commissionBasis?: string;
  pct: string | null; amount: string | null; minValue: string | null; buy: number | null; get: number | null;
  slabs: { from: string; pct: string }[] | null; comboPrice: string | null; comboItems: { itemId: string; qty: number }[] | null;
}
interface ItemChoice { id: string; name: string; nameHi: string | null; archived: boolean }
interface BranchChoice { id: string; name: string }
interface StyleChoice { id: string; code: string; name: string }

const SLABS = /^\s*\d+(\.\d{1,2})?\s*:\s*\d{1,3}(\.\d{1,2})?\s*(,\s*\d+(\.\d{1,2})?\s*:\s*\d{1,3}(\.\d{1,2})?\s*)*$/;
const AMOUNT = /^\d+(\.\d{1,2})?$/;
const list = (v: string) => v.split(",").map((x) => x.trim()).filter(Boolean);
/** "fabric:Cotton, fabric:Linen, fit:Slim" into { fabric: [Cotton, Linen], fit: [Slim] }. */
const parseAttrs = (v: string) => { const out: Record<string, string[]> = {}; for (const p of list(v)) { const [k, ...rest] = p.split(":"); const val = rest.join(":").trim(); if (k?.trim() && val) (out[k.trim()] ??= []).push(val); } return out; };
const attrText = (a?: Record<string, string[]>) => Object.entries(a ?? {}).flatMap(([k, v]) => v.map((x) => `${k}:${x}`)).join(", ");

/** Store schemes: what each offer gives, on which items, and when. */
export function Schemes({ schemes, items, styles, branches = [], canEdit }: { schemes: SchemeRow[]; items: ItemChoice[]; styles: StyleChoice[]; branches?: BranchChoice[]; canEdit: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const [editing, setEditing] = useState<SchemeRow | "new" | null>(null);
  const d = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  const summary = (s: SchemeRow) => {
    switch (s.kind) {
      case "percent": return t("schemes.sum.percent", { pct: Number(s.pct) }) + (s.minValue ? ` · ${t("schemes.sum.min", { amount: rupees(s.minValue) })}` : "");
      case "amount_off": return t("schemes.sum.amountOff", { amount: rupees(s.amount ?? 0) }) + (s.minValue ? ` · ${t("schemes.sum.min", { amount: rupees(s.minValue) })}` : "");
      case "qty_slab": return (s.slabs ?? []).map((x) => t("schemes.sum.qtySlab", { from: Number(x.from), pct: Number(x.pct) })).join(", ");
      case "value_slab": return (s.slabs ?? []).map((x) => t("schemes.sum.valueSlab", { from: rupees(x.from), pct: Number(x.pct) })).join(", ");
      case "buy_get": return Number(s.pct) === 100 ? t("schemes.sum.buyGetFree", { buy: s.buy ?? 0, get: s.get ?? 0 }) : t("schemes.sum.buyGetOff", { buy: s.buy ?? 0, get: s.get ?? 0, pct: Number(s.pct) });
      case "combo": return t("schemes.sum.combo", { n: (s.comboItems ?? []).reduce((n, c) => n + c.qty, 0), price: rupees(s.comboPrice ?? 0) });
    }
  };
  const scopeText = (s: SchemeRow) => {
    if (s.kind === "combo") return (s.comboItems ?? []).map((c) => `${c.qty} × ${items.find((i) => i.id === c.itemId)?.name ?? ""}`).join(", ");
    const parts = [
      ...(s.scope.brands ?? []), ...(s.scope.categories ?? []),
      ...(s.scope.styleIds ?? []).map((id) => styles.find((x) => x.id === id)?.code ?? ""),
      ...(s.scope.itemIds ?? []).map((id) => items.find((x) => x.id === id)?.name ?? ""),
    ].filter(Boolean);
    return parts.length ? parts.join(", ") : t("schemes.everything");
  };
  return (
    <div className="flex flex-col gap-4">
      {canEdit && !editing ? <div><Button onClick={() => setEditing("new")}><Plus className="size-4" aria-hidden />{t("schemes.new")}</Button></div> : null}
      {editing ? <SchemeForm key={editing === "new" ? "new" : editing.id} scheme={editing === "new" ? null : editing} items={items} styles={styles} branches={branches} onDone={() => setEditing(null)} /> : null}
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("schemes.name")}</th>
                <th className="px-5 py-3 font-medium">{t("schemes.offer")}</th>
                <th className="px-5 py-3 font-medium">{t("schemes.on")}</th>
                <th className="px-5 py-3 font-medium">{t("schemes.dates")}</th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {schemes.map((s) => (
                <tr key={s.id} className={`border-b border-border align-top last:border-0 ${s.active ? "" : "text-muted"}`}>
                  <td className="px-5 py-2.5 font-medium">{s.name}{s.active ? null : <span className="ml-2 text-xs font-normal">({t("schemes.off")})</span>}</td>
                  <td className="px-5 py-2.5">{summary(s)}</td>
                  <td className="px-5 py-2.5 text-muted">{scopeText(s)}</td>
                  <td className="px-5 py-2.5 whitespace-nowrap text-muted">
                    {s.startsOn || s.endsOn ? t("schemes.range", { from: s.startsOn ? d(s.startsOn) : t("schemes.now"), to: s.endsOn ? d(s.endsOn) : t("schemes.noEnd") }) : t("schemes.always")}
                    {s.weekdays?.length ? <div>{t("schemes.onDays", { days: [1, 2, 3, 4, 5, 6, 0].filter((x) => s.weekdays!.includes(x)).map((x) => t(`schemes.day.d${x}`)).join(", ") })}</div> : null}
                    {s.fromTime && s.toTime ? <div>{t("schemes.between", { from: s.fromTime, to: s.toTime })}</div> : null}
                    {s.priority ? <div>{t("schemes.rank", { n: s.priority })}</div> : null}
                    {s.branchIds?.length ? <div>{t("schemes.atBranches", { n: s.branchIds.length })}</div> : null}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    {canEdit ? (
                      <button type="button" onClick={() => setEditing(s)} className="rounded-md p-2 text-muted hover:bg-surface-2 hover:text-text" title={t("common.edit")}>
                        <Pencil className="size-4" aria-hidden /><span className="sr-only">{t("common.edit")}</span>
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
              {!schemes.length ? <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">{t("schemes.empty")}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
      <p className="text-xs text-muted">{t("schemes.rules")}</p>
    </div>
  );
}

function SchemeForm({ scheme, items, styles, branches, onDone }: { scheme: SchemeRow | null; items: ItemChoice[]; styles: StyleChoice[]; branches: BranchChoice[]; onDone: () => void }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [kind, setKind] = useState<Kind>(scheme?.kind ?? "percent");
  const [itemIds, setItemIds] = useState<string[]>(scheme?.scope.itemIds ?? []);
  const [styleIds, setStyleIds] = useState<string[]>(scheme?.scope.styleIds ?? []);
  const [weekdays, setWeekdays] = useState<number[]>(scheme?.weekdays ?? []);
  const [branchIds, setBranchIds] = useState<string[]>(scheme?.branchIds ?? []);
  const [combo, setCombo] = useState<{ itemId: string; qty: string }[]>((scheme?.comboItems ?? []).map((c) => ({ itemId: c.itemId, qty: String(c.qty) })));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const sorted = [...items].filter((i) => !i.archived).sort((a, b) => localName(a, locale).localeCompare(localName(b, locale)));
  const n = (v: string | null | undefined) => (v ? String(Number(v)) : "");

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => ((f.get(k) as string | null) ?? "").trim();
    const slabs = s("slabs");
    if ((kind === "qty_slab" || kind === "value_slab") && !SLABS.test(slabs)) { setError(t("schemes.errors.slabs")); return; }
    for (const k of ["pct", "amount", "minValue", "comboPrice"]) if (s(k) && !AMOUNT.test(s(k))) { setError(t("schemes.errors.number")); return; }
    const body = {
      name: s("name"), kind, startsOn: s("startsOn") || null, endsOn: s("endsOn") || null, active: f.get("active") === "on",
      priority: s("priority") ? Number(s("priority")) : null,
      weekdays: weekdays.length && weekdays.length < 7 ? weekdays : null, fromTime: s("fromTime") || null, toTime: s("toTime") || null, branchIds: branchIds.length ? branchIds : null,
      scope: kind === "combo" ? {} : { itemIds, styleIds, brands: list(s("brands")), categories: list(s("categories")), attrs: parseAttrs(s("attrs")), exclude: { brands: list(s("xBrands")), categories: list(s("xCategories")), attrs: parseAttrs(s("xAttrs")) } },
      confirmBeforeApply: f.get("confirmBeforeApply") === "on", allowWithGiftVouchers: f.get("allowWithGiftVouchers") === "on", allowWithCustomerDiscount: f.get("allowWithCustomerDiscount") === "on", allowReturns: f.get("allowReturns") === "on", applyOnDiscounted: f.get("applyOnDiscounted") === "on", inclusiveOfTax: f.get("inclusiveOfTax") === "on", commissionBasis: s("commissionBasis") || "net",
      pct: s("pct") || null, amount: s("amount") || null, minValue: s("minValue") || null,
      buy: s("buy") ? Number(s("buy")) : null, get: s("get") ? Number(s("get")) : null,
      slabs: kind === "qty_slab" || kind === "value_slab" ? slabs.split(",").map((p) => { const [from, pct] = p.split(":").map((x) => x.trim()); return { from: from!, pct: pct! }; }) : null,
      comboPrice: s("comboPrice") || null,
      comboItems: kind === "combo" ? combo.filter((c) => c.itemId && Number(c.qty) >= 1).map((c) => ({ itemId: c.itemId, qty: Math.floor(Number(c.qty)) })) : null,
    };
    setBusy(true);
    setError(null);
    try {
      if (scheme) await api(`/schemes/${scheme.id}`, { method: "PUT", body });
      else await api("/schemes", { body });
      onDone();
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? (err.issues?.[0]?.message ?? err.code) : "generic";
      setError(t.has(`schemes.errors.${code}`) ? t(`schemes.errors.${code}`) : t("auth.errors.generic"));
      setBusy(false);
    }
  }

  const chips = (ids: string[], label: (id: string) => string, remove: (id: string) => void) => (
    <div className="flex flex-wrap gap-1.5">
      {ids.map((id) => (
        <span key={id} className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs">
          {label(id)}
          <button type="button" onClick={() => remove(id)} className="text-muted hover:text-danger" title={t("common.remove")}><X className="size-3" aria-hidden /><span className="sr-only">{t("common.remove")}</span></button>
        </span>
      ))}
    </div>
  );

  return (
    <Card>
      <form onSubmit={save} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {error ? <div className="md:col-span-2 xl:col-span-4"><Alert>{error}</Alert></div> : null}
        <Field label={t("schemes.name")} htmlFor="sc-name"><Input id="sc-name" name="name" defaultValue={scheme?.name} required maxLength={60} autoFocus /></Field>
        <Field label={t("schemes.kind")} htmlFor="sc-kind" hint={t(`schemes.kindHint.${kind}`)}>
          <Select id="sc-kind" value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
            {KINDS.map((k) => <option key={k} value={k}>{t(`schemes.kinds.${k}`)}</option>)}
          </Select>
        </Field>
        <Field label={t("schemes.startsOn")} htmlFor="sc-from"><Input id="sc-from" name="startsOn" type="date" defaultValue={scheme?.startsOn ?? ""} /></Field>
        <Field label={t("schemes.endsOn")} htmlFor="sc-to"><Input id="sc-to" name="endsOn" type="date" defaultValue={scheme?.endsOn ?? ""} /></Field>
        <Field label={t("schemes.hoursFrom")} htmlFor="sc-hf" hint={t("schemes.hoursHint")}><Input id="sc-hf" name="fromTime" type="time" defaultValue={scheme?.fromTime ?? ""} /></Field>
        <Field label={t("schemes.hoursTo")} htmlFor="sc-ht"><Input id="sc-ht" name="toTime" type="time" defaultValue={scheme?.toTime ?? ""} /></Field>
        <Field label={t("schemes.priority")} htmlFor="sc-prio" hint={t("schemes.priorityHint")}><Input id="sc-prio" name="priority" type="number" min={1} max={999} defaultValue={scheme?.priority ?? ""} className="num w-28" /></Field>
        <fieldset className="sm:col-span-2">
          <legend className="mb-1 text-sm font-medium">{t("schemes.days")}</legend>
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4, 5, 6, 0].map((d) => (
              <label key={d} className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={weekdays.includes(d)} onChange={(e) => setWeekdays(e.target.checked ? [...weekdays, d] : weekdays.filter((x) => x !== d))} />{t(`schemes.day.d${d}`)}</label>
            ))}
          </div>
          <p className="mt-1 text-xs text-muted">{t("schemes.daysHint")}</p>
        </fieldset>
        {branches.length > 1 ? (
          <fieldset className="sm:col-span-2">
            <legend className="mb-1 text-sm font-medium">{t("schemes.branches")}</legend>
            <div className="flex flex-wrap gap-3">
              {branches.map((b) => (
                <label key={b.id} className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={branchIds.includes(b.id)} onChange={(e) => setBranchIds(e.target.checked ? [...branchIds, b.id] : branchIds.filter((x) => x !== b.id))} />{b.name}</label>
              ))}
            </div>
            <p className="mt-1 text-xs text-muted">{t("schemes.branchesHint")}</p>
          </fieldset>
        ) : null}

        {kind === "percent" || kind === "buy_get" ? (
          <Field label={kind === "buy_get" ? t("schemes.offPct") : t("schemes.pct")} htmlFor="sc-pct" hint={kind === "buy_get" ? t("schemes.offPctHint") : undefined}>
            <Input id="sc-pct" name="pct" defaultValue={n(scheme?.pct) || (kind === "buy_get" ? "100" : "")} inputMode="decimal" className="num" required={kind === "percent"} />
          </Field>
        ) : null}
        {kind === "amount_off" ? <Field label={t("schemes.amount")} htmlFor="sc-amt"><Input id="sc-amt" name="amount" defaultValue={n(scheme?.amount)} inputMode="decimal" className="num" required /></Field> : null}
        {kind === "percent" || kind === "amount_off" ? (
          <Field label={t("schemes.minValue")} htmlFor="sc-min"><Input id="sc-min" name="minValue" defaultValue={n(scheme?.minValue)} inputMode="decimal" className="num" /></Field>
        ) : null}
        {kind === "buy_get" ? (
          <>
            <Field label={t("schemes.buy")} htmlFor="sc-buy"><Input id="sc-buy" name="buy" type="number" min={1} max={50} defaultValue={scheme?.buy ?? 2} required className="num" /></Field>
            <Field label={t("schemes.get")} htmlFor="sc-get"><Input id="sc-get" name="get" type="number" min={1} max={50} defaultValue={scheme?.get ?? 1} required className="num" /></Field>
          </>
        ) : null}
        {kind === "qty_slab" || kind === "value_slab" ? (
          <div className="md:col-span-2">
            <Field label={t("schemes.slabs")} htmlFor="sc-slabs" hint={t(kind === "qty_slab" ? "schemes.qtySlabsHint" : "schemes.valueSlabsHint")}>
              <Input id="sc-slabs" name="slabs" defaultValue={(scheme?.slabs ?? []).map((s) => `${Number(s.from)}:${Number(s.pct)}`).join(", ")} placeholder={kind === "qty_slab" ? "3:10, 5:20" : "2000:5, 5000:10"} className="num" required />
            </Field>
          </div>
        ) : null}
        {kind === "combo" ? (
          <>
            <Field label={t("schemes.comboPrice")} htmlFor="sc-cp"><Input id="sc-cp" name="comboPrice" defaultValue={n(scheme?.comboPrice)} inputMode="decimal" className="num" required /></Field>
            <div className="flex flex-col gap-2 md:col-span-2 xl:col-span-3">
              <span className="text-sm font-medium">{t("schemes.comboItems")}</span>
              {combo.map((c, i) => (
                <div key={i} className="flex gap-2">
                  <Select value={c.itemId} onChange={(e) => setCombo((cs) => cs.map((x, k) => (k === i ? { ...x, itemId: e.target.value } : x)))} aria-label={t("schemes.item")}>
                    <option value="">{t("purchase.chooseItem")}</option>
                    {sorted.map((it) => <option key={it.id} value={it.id}>{localName(it, locale)}</option>)}
                  </Select>
                  <Input value={c.qty} onChange={(e) => setCombo((cs) => cs.map((x, k) => (k === i ? { ...x, qty: e.target.value } : x)))} inputMode="numeric" className="num w-20" aria-label={t("schemes.qty")} />
                  <button type="button" onClick={() => setCombo((cs) => cs.filter((_, k) => k !== i))} className="rounded-md p-2 text-muted hover:text-danger" title={t("common.remove")}>
                    <Trash2 className="size-4" aria-hidden /><span className="sr-only">{t("common.remove")}</span>
                  </button>
                </div>
              ))}
              <div><Button type="button" variant="outline" onClick={() => setCombo((cs) => [...cs, { itemId: "", qty: "1" }])}><Plus className="size-4" aria-hidden />{t("schemes.addItem")}</Button></div>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3 md:col-span-2 xl:col-span-4">
            <p className="text-sm text-muted">{t("schemes.scopeHint")}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label={t("schemes.brands")} htmlFor="sc-brands"><Input id="sc-brands" name="brands" defaultValue={(scheme?.scope.brands ?? []).join(", ")} placeholder={t("schemes.commaHint")} /></Field>
              <Field label={t("schemes.categories")} htmlFor="sc-cats"><Input id="sc-cats" name="categories" defaultValue={(scheme?.scope.categories ?? []).join(", ")} placeholder={t("schemes.commaHint")} /></Field>
              {styles.length ? (
                <div className="flex flex-col gap-2">
                  <Field label={t("schemes.styles")} htmlFor="sc-style">
                    <Select id="sc-style" value="" onChange={(e) => { const v = e.target.value; if (v && !styleIds.includes(v)) setStyleIds([...styleIds, v]); }}>
                      <option value="">{t("schemes.addStyle")}</option>
                      {styles.filter((s) => !styleIds.includes(s.id)).map((s) => <option key={s.id} value={s.id}>{s.code} · {s.name}</option>)}
                    </Select>
                  </Field>
                  {chips(styleIds, (id) => styles.find((s) => s.id === id)?.code ?? id, (id) => setStyleIds(styleIds.filter((x) => x !== id)))}
                </div>
              ) : null}
              <div className="flex flex-col gap-2">
                <Field label={t("schemes.items")} htmlFor="sc-item">
                  <Select id="sc-item" value="" onChange={(e) => { const v = e.target.value; if (v && !itemIds.includes(v)) setItemIds([...itemIds, v]); }}>
                    <option value="">{t("schemes.addItem")}</option>
                    {sorted.filter((i) => !itemIds.includes(i.id)).map((i) => <option key={i.id} value={i.id}>{localName(i, locale)}</option>)}
                  </Select>
                </Field>
                {chips(itemIds, (id) => items.find((i) => i.id === id)?.name ?? id, (id) => setItemIds(itemIds.filter((x) => x !== id)))}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label={t("schemes.attrs")} htmlFor="sc-attrs" hint={t("schemes.attrsHint")}><Input id="sc-attrs" name="attrs" defaultValue={attrText(scheme?.scope.attrs)} /></Field>
              <Field label={t("schemes.xBrands")} htmlFor="sc-xb"><Input id="sc-xb" name="xBrands" defaultValue={(scheme?.scope.exclude?.brands ?? []).join(", ")} placeholder={t("schemes.commaHint")} /></Field>
              <Field label={t("schemes.xCategories")} htmlFor="sc-xc"><Input id="sc-xc" name="xCategories" defaultValue={(scheme?.scope.exclude?.categories ?? []).join(", ")} placeholder={t("schemes.commaHint")} /></Field>
              <Field label={t("schemes.xAttrs")} htmlFor="sc-xa" hint={t("schemes.attrsHint")}><Input id="sc-xa" name="xAttrs" defaultValue={attrText(scheme?.scope.exclude?.attrs)} /></Field>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-1 md:col-span-2 xl:col-span-4">
          <p className="text-sm font-medium">{t("schemes.rulesTitle")}</p>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="confirmBeforeApply" defaultChecked={scheme?.confirmBeforeApply ?? false} className="size-4 accent-[var(--primary)]" />{t("schemes.confirmBeforeApply")}</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="allowWithGiftVouchers" defaultChecked={scheme?.allowWithGiftVouchers ?? true} className="size-4 accent-[var(--primary)]" />{t("schemes.allowWithGiftVouchers")}</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="allowWithCustomerDiscount" defaultChecked={scheme?.allowWithCustomerDiscount ?? true} className="size-4 accent-[var(--primary)]" />{t("schemes.allowWithCustomerDiscount")}</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="allowReturns" defaultChecked={scheme?.allowReturns ?? true} className="size-4 accent-[var(--primary)]" />{t("schemes.allowReturns")}</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="applyOnDiscounted" defaultChecked={scheme?.applyOnDiscounted ?? false} className="size-4 accent-[var(--primary)]" />{t("schemes.applyOnDiscounted")}</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="inclusiveOfTax" defaultChecked={scheme?.inclusiveOfTax ?? false} className="size-4 accent-[var(--primary)]" />{t("schemes.inclusiveOfTax")}</label>
          <label className="flex items-center gap-2 text-sm">{t("schemes.commissionBasis")}<select name="commissionBasis" defaultValue={scheme?.commissionBasis ?? "net"} className="h-8 rounded-md border border-border bg-surface px-2"><option value="net">{t("schemes.basis.net")}</option><option value="list">{t("schemes.basis.list")}</option><option value="none">{t("schemes.basis.none")}</option></select></label>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:col-span-2 xl:col-span-4">
          <Button type="submit" disabled={busy}>{t("common.save")}</Button>
          <Button type="button" variant="ghost" onClick={onDone}>{t("common.cancel")}</Button>
          <label className="ml-auto flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked={scheme?.active ?? true} className="size-4 accent-[var(--primary)]" />
            {t("schemes.active")}
          </label>
        </div>
      </form>
    </Card>
  );
}
