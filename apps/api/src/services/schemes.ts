import { and, eq, inArray, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money, type Scheme, type SchemeKind } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

type Attrs = Record<string, string[]>;
export interface SchemeScope {
  itemIds?: string[] | undefined; styleIds?: string[] | undefined; brands?: string[] | undefined; categories?: string[] | undefined; attrs?: Attrs | undefined;
  exclude?: { itemIds?: string[] | undefined; styleIds?: string[] | undefined; brands?: string[] | undefined; categories?: string[] | undefined; attrs?: Attrs | undefined } | undefined;
}

export interface SchemeInput {
  name: string; kind: SchemeKind; startsOn?: string | null | undefined; endsOn?: string | null | undefined; active?: boolean | undefined;
  scope?: SchemeScope | undefined; pct?: string | null | undefined; amount?: string | null | undefined; minValue?: string | null | undefined;
  buy?: number | null | undefined; get?: number | null | undefined; slabs?: { from: string; pct: string }[] | null | undefined;
  comboPrice?: string | null | undefined; comboItems?: { itemId: string; qty: number }[] | null | undefined;
  confirmBeforeApply?: boolean | undefined; allowWithGiftVouchers?: boolean | undefined; allowWithCustomerDiscount?: boolean | undefined; allowReturns?: boolean | undefined;
  applyOnDiscounted?: boolean | undefined; inclusiveOfTax?: boolean | undefined; commissionBasis?: "net" | "list" | "none" | undefined;
  priority?: number | null | undefined; weekdays?: number[] | null | undefined; fromTime?: string | null | undefined; toTime?: string | null | undefined; branchIds?: string[] | null | undefined;
}

/** The branch a counter belongs to, by its warehouse (none when the warehouse is not tied to a branch). */
export async function branchOfWarehouse(tx: Tx, warehouseId: string): Promise<string | null> {
  const [w] = await tx.select({ branchId: tables.warehouses.branchId }).from(tables.warehouses).where(eq(tables.warehouses.id, warehouseId));
  return w?.branchId ?? null;
}

/** What each kind needs; anything else it carries is dropped. */
function normalise(input: SchemeInput) {
  const k = input.kind;
  if (input.startsOn && input.endsOn && input.endsOn < input.startsOn) throw badRequest("ends_before_start");
  if (!!input.fromTime !== !!input.toTime) throw badRequest("hours_need_both");
  if (input.fromTime && input.fromTime === input.toTime) throw badRequest("hours_empty");
  if (input.weekdays?.some((d) => !Number.isInteger(d) || d < 0 || d > 6)) throw badRequest("invalid_weekday");
  const need = (ok: boolean) => { if (!ok) throw badRequest("scheme_incomplete"); };
  const pct = input.pct ? dec(input.pct) : null;
  if (k === "percent") need(!!pct && pct.gt(0) && pct.lte(100));
  if (k === "amount_off") need(!!input.amount && dec(input.amount).gt(0));
  if (k === "qty_slab" || k === "value_slab") need(!!input.slabs?.length && input.slabs.every((s) => dec(s.pct).gt(0) && dec(s.pct).lte(100)));
  if (k === "buy_get") need(!!input.buy && input.buy >= 1 && !!input.get && input.get >= 1 && (!pct || (pct.gt(0) && pct.lte(100))));
  if (k === "combo") need(!!input.comboPrice && dec(input.comboPrice).gt(0) && (input.comboItems?.length ?? 0) >= 1);
  if (input.slabs && new Set(input.slabs.map((s) => dec(s.from).toString())).size !== input.slabs.length) throw badRequest("duplicate_slab");
  const uniq = (xs: string[] | undefined) => [...new Set((xs ?? []).map((x) => x.trim()).filter(Boolean))];
  const attrsOf = (a: Attrs | undefined) => Object.fromEntries(Object.entries(a ?? {}).map(([n, v]) => [n.trim(), uniq(v)] as const).filter(([n, v]) => n && v.length));
  const part = (sc: SchemeScope | undefined) => ({
    ...(sc?.itemIds?.length ? { itemIds: [...new Set(sc.itemIds)] } : {}),
    ...(sc?.styleIds?.length ? { styleIds: [...new Set(sc.styleIds)] } : {}),
    ...(uniq(sc?.brands).length ? { brands: uniq(sc?.brands) } : {}),
    ...(uniq(sc?.categories).length ? { categories: uniq(sc?.categories) } : {}),
    ...(Object.keys(attrsOf(sc?.attrs)).length ? { attrs: attrsOf(sc?.attrs) } : {}),
  });
  const excl = part(input.scope?.exclude);
  const scope = k === "combo" ? {} : { ...part(input.scope), ...(Object.keys(excl).length ? { exclude: excl } : {}) };
  return {
    name: input.name.trim(), kind: k, startsOn: input.startsOn ?? null, endsOn: input.endsOn ?? null, scope,
    confirmBeforeApply: input.confirmBeforeApply ?? false, allowWithGiftVouchers: input.allowWithGiftVouchers ?? true, allowWithCustomerDiscount: input.allowWithCustomerDiscount ?? true, allowReturns: input.allowReturns ?? true,
    applyOnDiscounted: input.applyOnDiscounted ?? false, inclusiveOfTax: input.inclusiveOfTax ?? false, commissionBasis: input.commissionBasis ?? "net",
    // Every day and all day are stored as nothing, so an offer with no limits looks the same however it was entered.
    priority: input.priority ?? null,
    weekdays: input.weekdays?.length && new Set(input.weekdays).size < 7 ? [...new Set(input.weekdays)].sort() : null,
    fromTime: input.fromTime || null, toTime: input.toTime || null, branchIds: input.branchIds?.length ? [...new Set(input.branchIds)] : null,
    pct: k === "percent" || k === "buy_get" ? (pct ? pct.toFixed(2) : k === "buy_get" ? "100.00" : null) : null,
    amount: k === "amount_off" ? money(input.amount!) : null,
    minValue: (k === "percent" || k === "amount_off") && input.minValue && dec(input.minValue).gt(0) ? money(input.minValue) : null,
    buy: k === "buy_get" ? input.buy! : null, get: k === "buy_get" ? input.get! : null,
    slabs: k === "qty_slab" || k === "value_slab" ? [...input.slabs!].sort((a, b) => dec(a.from).cmp(b.from)).map((s) => ({ from: dec(s.from).toString(), pct: dec(s.pct).toFixed(2) })) : null,
    comboPrice: k === "combo" ? money(input.comboPrice!) : null,
    comboItems: k === "combo" ? input.comboItems! : null,
  };
}

/** Every item id a scheme names must belong to the company (and every style). */
async function checkRefs(tx: Tx, companyId: string, v: ReturnType<typeof normalise>) {
  const itemIds = [...(v.scope.itemIds ?? []), ...(v.scope.exclude?.itemIds ?? []), ...(v.comboItems ?? []).map((c) => c.itemId)];
  if (itemIds.length) {
    const found = await tx.select({ id: tables.items.id }).from(tables.items).where(and(inArray(tables.items.id, [...new Set(itemIds)]), eq(tables.items.companyId, companyId)));
    if (found.length !== new Set(itemIds).size) throw badRequest("unknown_item");
  }
  const styleIds = [...new Set([...(v.scope.styleIds ?? []), ...(v.scope.exclude?.styleIds ?? [])])];
  if (styleIds.length) {
    const found = await tx.select({ id: tables.styles.id }).from(tables.styles).where(and(inArray(tables.styles.id, styleIds), eq(tables.styles.companyId, companyId)));
    if (found.length !== styleIds.length) throw badRequest("unknown_style");
  }
}

export async function saveScheme(tx: Tx, actor: Actor, input: SchemeInput, id?: string) {
  const company = await resolveCompany(tx);
  const v = normalise(input);
  await checkRefs(tx, company.id, v);
  const values = { ...v, ...(input.active !== undefined ? { active: input.active } : {}) };
  const [row] = await (id
    ? tx.update(tables.schemes).set({ ...values, updatedAt: new Date() }).where(and(eq(tables.schemes.id, id), eq(tables.schemes.companyId, company.id))).returning()
    : tx.insert(tables.schemes).values({ tenantId: actor.tenantId, companyId: company.id, ...values }).returning()
  ).catch((e) => {
    if (e?.cause?.code === "23505") throw badRequest("scheme_name_taken");
    throw e;
  });
  if (!row) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: id ? "update" : "create", entity: "scheme", entityId: row.id, after: { name: row.name, kind: row.kind, active: row.active }, ip: actor.ip });
  return row;
}

export async function listSchemes(tx: Tx, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  return tx.select().from(tables.schemes).where(eq(tables.schemes.companyId, company.id)).orderBy(sql`${tables.schemes.active} desc`, tables.schemes.name);
}

/**
 * Switched-on schemes with their scope turned into item ids, for the counter (web and devices).
 * Brands and categories come from the item's style and match ignoring case.
 */
export async function resolvedSchemes(tx: Tx, companyId: string, branchId?: string | null): Promise<Scheme[]> {
  // With a branch given (null for a counter tied to none), a scheme limited to other branches is left out; with none given every scheme comes back and carries its branch list for the screen to filter.
  const rows = (await tx.select().from(tables.schemes).where(and(eq(tables.schemes.companyId, companyId), eq(tables.schemes.active, true))))
    .filter((r) => branchId === undefined || !r.branchIds?.length || (!!branchId && r.branchIds.includes(branchId)));
  if (!rows.length) return [];
  const lists = (sc: typeof rows[number]["scope"]) => [sc, sc.exclude ?? {}];
  const needsItems = rows.some((r) => lists(r.scope).some((sc) => sc.styleIds?.length || sc.brands?.length || sc.categories?.length || Object.keys(sc.attrs ?? {}).length));
  const items = needsItems
    ? await tx.select({ id: tables.items.id, styleId: tables.items.styleId, brand: tables.styles.brand, category: tables.styles.category, attributes: tables.styles.attributes })
      .from(tables.items).leftJoin(tables.styles, eq(tables.styles.id, tables.items.styleId))
      .where(and(eq(tables.items.companyId, companyId), eq(tables.items.archived, false)))
    : [];
  const low = (v: string | null | undefined) => (v ?? "").trim().toLowerCase();
  type Item = (typeof items)[number];
  /** Items matched by one list: any of its items, styles, brands, categories or attribute values. */
  const matches = (sc: { itemIds?: string[] | undefined; styleIds?: string[] | undefined; brands?: string[] | undefined; categories?: string[] | undefined; attrs?: Record<string, string[]> | undefined } | undefined) => {
    const set = new Set<string>(sc?.itemIds ?? []);
    if (!sc) return set;
    const brands = new Set((sc.brands ?? []).map(low));
    const cats = new Set((sc.categories ?? []).map(low));
    const attrs = Object.entries(sc.attrs ?? {}).map(([n, v]) => [low(n), new Set(v.map(low))] as const);
    const hasAttr = (it: Item) => attrs.some(([n, vals]) => Object.entries(it.attributes ?? {}).some(([k, v]) => low(k) === n && vals.has(low(v))));
    for (const it of items) {
      if ((it.styleId && sc.styleIds?.includes(it.styleId)) || (it.brand && brands.has(low(it.brand))) || (it.category && cats.has(low(it.category))) || hasAttr(it)) set.add(it.id);
    }
    return set;
  };
  return rows.map((r) => {
    const sc = r.scope;
    const any = !!(sc.itemIds?.length || sc.styleIds?.length || sc.brands?.length || sc.categories?.length || Object.keys(sc.attrs ?? {}).length);
    const out = matches(sc.exclude);
    // Everything except the left-out items when only exclusions are given; otherwise what the lists cover, less the left-out items.
    let itemIds: string[] | null = null;
    if (any) itemIds = [...matches(sc)].filter((x) => !out.has(x));
    else if (out.size) itemIds = items.map((it) => it.id).filter((x) => !out.has(x));
    return {
      id: r.id, name: r.name, kind: r.kind as SchemeKind, startsOn: r.startsOn, endsOn: r.endsOn, weekdays: r.weekdays, priority: r.priority, fromTime: r.fromTime, toTime: r.toTime, branchIds: r.branchIds, itemIds,
      confirmBeforeApply: r.confirmBeforeApply, allowWithGiftVouchers: r.allowWithGiftVouchers, allowWithCustomerDiscount: r.allowWithCustomerDiscount, allowReturns: r.allowReturns,
      applyOnDiscounted: r.applyOnDiscounted, inclusiveOfTax: r.inclusiveOfTax, commissionBasis: r.commissionBasis as "net" | "list" | "none",
      pct: r.pct, amount: r.amount, minValue: r.minValue, buy: r.buy, get: r.get, slabs: r.slabs, comboPrice: r.comboPrice, comboItems: r.comboItems,
    };
  });
}
