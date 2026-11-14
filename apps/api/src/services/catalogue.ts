import { randomBytes } from "node:crypto";
import { and, asc, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money, normalizeIndianMobile } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, notFound } from "../lib/errors.js";
import { hashToken } from "../lib/session.js";
import { messenger, MessagingError } from "../integrations/messaging.js";
import { resolveCompany } from "./accounting.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
type Company = Awaited<ReturnType<typeof resolveCompany>>;

export const IMAGE_VIEWS = ["front", "back", "detail", "model", "other"] as const;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
/** Sales counted for "sold" on a tile: bills out, returns back. */
const SOLD_OUT = ["sales_invoice", "pos_bill"];
const SOLD_BACK = ["credit_note", "pos_return"];
/** What counts as goods coming in, for the "received between" filter. */
const INWARD = ["purchase_bill", "grn", "production_entry", "job_work"];
const MAX_SHARE_DAYS = 90;

async function loadStyle(tx: Tx, companyId: string, styleId: string) {
  const [s] = await tx.select().from(tables.styles).where(eq(tables.styles.id, styleId));
  if (!s || s.companyId !== companyId) throw badRequest("unknown_style");
  return s;
}

// ---- photos ---------------------------------------------------------------------------------------------

export async function listStyleImages(tx: Tx, styleId: string) {
  const company = await resolveCompany(tx);
  await loadStyle(tx, company.id, styleId);
  return tx.select().from(tables.styleImages)
    .where(and(eq(tables.styleImages.styleId, styleId), eq(tables.styleImages.archived, false)))
    .orderBy(asc(tables.styleImages.color), asc(tables.styleImages.sortOrder), asc(tables.styleImages.createdAt));
}

/**
 * Adds a photo (already uploaded as a full view and a thumbnail) to a style, for one colour or for all.
 * The same picture twice on one style and colour is refused.
 */
export async function addStyleImage(tx: Tx, actor: Actor, styleId: string, input: { fileId: string; thumbFileId: string; color?: string | null | undefined; view?: (typeof IMAGE_VIEWS)[number] | undefined }) {
  const company = await resolveCompany(tx);
  const style = await loadStyle(tx, company.id, styleId);
  const color = input.color?.trim() || null;
  if (color) {
    const [v] = await tx.select({ id: tables.items.id }).from(tables.items).where(and(eq(tables.items.styleId, style.id), eq(tables.items.color, color))).limit(1);
    if (!v) throw badRequest("unknown_color");
  }
  const fs = await tx.select({ id: tables.files.id, companyId: tables.files.companyId, contentType: tables.files.contentType, sha256: tables.files.sha256 })
    .from(tables.files).where(inArray(tables.files.id, [input.fileId, input.thumbFileId]));
  const full = fs.find((f) => f.id === input.fileId);
  const thumb = fs.find((f) => f.id === input.thumbFileId);
  if (!full || !thumb || full.companyId !== company.id || thumb.companyId !== company.id) throw badRequest("unknown_file");
  if (!IMAGE_TYPES.includes(full.contentType) || !IMAGE_TYPES.includes(thumb.contentType)) throw badRequest("file_type");
  const same = await tx.select({ id: tables.styleImages.id }).from(tables.styleImages)
    .innerJoin(tables.files, eq(tables.files.id, tables.styleImages.fileId))
    .where(and(eq(tables.styleImages.styleId, style.id), eq(tables.styleImages.archived, false), eq(tables.files.sha256, full.sha256),
      color ? eq(tables.styleImages.color, color) : isNull(tables.styleImages.color)));
  if (same.length) throw badRequest("duplicate_image");
  const [last] = await tx.select({ n: sql<number>`coalesce(max(${tables.styleImages.sortOrder}), -1)::int` }).from(tables.styleImages)
    .where(and(eq(tables.styleImages.styleId, style.id), eq(tables.styleImages.archived, false), color ? eq(tables.styleImages.color, color) : isNull(tables.styleImages.color)));
  const [row] = await tx.insert(tables.styleImages).values({
    tenantId: actor.tenantId, companyId: company.id, styleId: style.id, color, view: input.view ?? "front",
    fileId: full.id, thumbFileId: thumb.id, sortOrder: (last?.n ?? -1) + 1, createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "style_image", entityId: row!.id, after: { style: style.code, color, view: row!.view }, ip: actor.ip });
  return row!;
}

/** Changes a photo's view, makes it the first one shown, or takes it off (kept, archived). */
export async function updateStyleImage(tx: Tx, actor: Actor, id: string, input: { view?: (typeof IMAGE_VIEWS)[number] | undefined; first?: boolean | undefined; archived?: boolean | undefined }) {
  const company = await resolveCompany(tx);
  const [img] = await tx.select().from(tables.styleImages).where(eq(tables.styleImages.id, id));
  if (!img || img.companyId !== company.id) throw notFound();
  const patch: Partial<typeof tables.styleImages.$inferInsert> = {};
  if (input.view) patch.view = input.view;
  if (input.archived !== undefined) patch.archived = input.archived;
  if (input.first) {
    const [top] = await tx.select({ n: sql<number>`coalesce(min(${tables.styleImages.sortOrder}), 0)::int` }).from(tables.styleImages)
      .where(and(eq(tables.styleImages.styleId, img.styleId), eq(tables.styleImages.archived, false), img.color ? eq(tables.styleImages.color, img.color) : isNull(tables.styleImages.color)));
    patch.sortOrder = (top?.n ?? 0) - 1;
  }
  if (!Object.keys(patch).length) return img;
  const [row] = await tx.update(tables.styleImages).set(patch).where(eq(tables.styleImages.id, id)).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "style_image", entityId: id, before: { view: img.view, archived: img.archived, sortOrder: img.sortOrder }, after: patch, ip: actor.ip });
  return row!;
}

// ---- the catalogue ---------------------------------------------------------------------------------------

export interface CatalogueQuery {
  q?: string | undefined; brands?: string[] | undefined; categories?: string[] | undefined; seasons?: string[] | undefined; colors?: string[] | undefined;
  minRate?: string | undefined; maxRate?: string | undefined; inStock?: boolean | undefined; withImage?: boolean | undefined;
  receivedFrom?: string | undefined; receivedTo?: string | undefined; soldFrom?: string | undefined; soldTo?: string | undefined;
  partyId?: string | undefined; sort?: "newest" | "best" | "price_low" | "price_high" | "stock" | "code" | undefined;
  limit?: number | undefined; offset?: number | undefined;
}

export interface Tile {
  key: string; styleId: string; code: string; name: string; nameHi: string | null; brand: string | null; category: string | null; season: string | null;
  color: string | null; colorHex: string | null; image: { fileId: string; thumbFileId: string } | null; imageCount: number;
  rate: string; mrp: string | null; stock: string; sold: string;
  sizes: { itemId: string; size: string | null; barcode: string | null; rate: string; stock: string }[];
}

/** A party's rate for each item: fixed price-list rate, else the list's discount off the sale rate, else the sale rate. */
async function partyRates(tx: Tx, companyId: string, partyId: string | undefined) {
  if (!partyId) return null;
  const [party] = await tx.select().from(tables.accounts).where(eq(tables.accounts.id, partyId));
  if (!party || party.companyId !== companyId) throw badRequest("unknown_account");
  if (!party.priceListId) return null;
  const [list] = await tx.select().from(tables.priceLists).where(eq(tables.priceLists.id, party.priceListId));
  const fixed = await tx.select().from(tables.priceListItems).where(eq(tables.priceListItems.priceListId, party.priceListId));
  const byItem = new Map(fixed.map((f) => [f.itemId, f.rate]));
  return (item: { id: string; saleRate: string }) => money(byItem.get(item.id) ?? dec(item.saleRate).times(dec(1).minus(dec(list?.discountPct ?? 0).div(100))));
}

/** Tiles (one per style and colour) for the given styles, or for every live style when none are named. */
async function buildTiles(tx: Tx, company: Company, q: CatalogueQuery, only?: { styleId: string; color: string | null }[]) {
  const styleIds = only ? [...new Set(only.map((l) => l.styleId))] : null;
  if (styleIds && !styleIds.length) return [];
  const styles = await tx.select().from(tables.styles).where(and(eq(tables.styles.companyId, company.id), styleIds ? inArray(tables.styles.id, styleIds) : eq(tables.styles.archived, false)));
  if (!styles.length) return [];
  const ids = styles.map((s) => s.id);
  const variants = await tx.select().from(tables.items)
    .where(and(inArray(tables.items.styleId, ids), eq(tables.items.isPack, false), styleIds ? sql`true` : eq(tables.items.archived, false)))
    .orderBy(asc(tables.items.sizeOrder));
  if (!variants.length) return [];
  const itemIds = variants.map((v) => v.id);
  // Stock in our own stores (not goods at a job worker's or with a consignee) and billed sales in the window.
  const stockRows = await tx.execute<{ item_id: string; qty: string }>(sql`
    select l.item_id, sum(l.qty_in - l.qty_out)::text as qty from stock_ledger l join warehouses w on w.id = l.warehouse_id
    where l.company_id = ${company.id} and l.item_id in ${sql`(${sql.join(itemIds.map((i) => sql`${i}`), sql`, `)})`}
      and w.job_worker_id is null and w.consignee_id is null
    group by l.item_id`);
  const stock = new Map(stockRows.map((r) => [r.item_id, dec(r.qty)]));
  const soldFrom = q.soldFrom ?? "1900-01-01";
  const soldTo = q.soldTo ?? "2999-12-31";
  const soldRows = await tx.execute<{ item_id: string; qty: string }>(sql`
    select item_id, (sum(case when source_type in ${sql`(${sql.join(SOLD_OUT.map((t) => sql`${t}`), sql`, `)})`} then qty_out else 0 end)
      - sum(case when source_type in ${sql`(${sql.join(SOLD_BACK.map((t) => sql`${t}`), sql`, `)})`} then qty_in else 0 end))::text as qty
    from stock_ledger where company_id = ${company.id} and date between ${soldFrom}::date and ${soldTo}::date
      and item_id in ${sql`(${sql.join(itemIds.map((i) => sql`${i}`), sql`, `)})`}
    group by item_id`);
  const sold = new Map(soldRows.map((r) => [r.item_id, dec(r.qty)]));
  let received: Set<string> | null = null;
  if (q.receivedFrom || q.receivedTo) {
    const rows = await tx.execute<{ item_id: string }>(sql`
      select distinct item_id from stock_ledger where company_id = ${company.id} and qty_in > 0
        and source_type in ${sql`(${sql.join(INWARD.map((t) => sql`${t}`), sql`, `)})`}
        and date between ${q.receivedFrom ?? "1900-01-01"}::date and ${q.receivedTo ?? "2999-12-31"}::date
        and item_id in ${sql`(${sql.join(itemIds.map((i) => sql`${i}`), sql`, `)})`}`);
    received = new Set(rows.map((r) => r.item_id));
  }
  const images = await tx.select().from(tables.styleImages)
    .where(and(inArray(tables.styleImages.styleId, ids), eq(tables.styleImages.archived, false)))
    .orderBy(asc(tables.styleImages.sortOrder), asc(tables.styleImages.createdAt));
  const colorRows = await tx.select().from(tables.colors).where(eq(tables.colors.companyId, company.id));
  const hexOf = new Map(colorRows.map((c) => [c.name.toLowerCase(), c.hex]));
  const rateOf = await partyRates(tx, company.id, q.partyId);

  const tiles: Tile[] = [];
  for (const s of styles) {
    const groups = new Map<string, typeof variants>();
    for (const v of variants.filter((x) => x.styleId === s.id)) {
      const k = v.color ?? "";
      groups.set(k, [...(groups.get(k) ?? []), v]);
    }
    for (const [k, vs] of groups) {
      const color = k || null;
      if (only && !only.some((l) => l.styleId === s.id && (l.color ?? null) === color)) continue;
      if (received && !vs.some((v) => received!.has(v.id))) continue;
      const own = images.filter((i) => i.styleId === s.id && i.color === color);
      const shared = images.filter((i) => i.styleId === s.id && i.color === null);
      const pics = own.length ? own : shared;
      const sizes = vs.map((v) => ({ itemId: v.id, size: v.size, barcode: v.barcode, rate: rateOf ? rateOf(v) : money(v.saleRate), stock: (stock.get(v.id) ?? dec(0)).toString() }));
      const rates = sizes.map((x) => dec(x.rate));
      tiles.push({
        key: `${s.id}:${k}`, styleId: s.id, code: s.code, name: s.name, nameHi: s.nameHi, brand: s.brand, category: s.category, season: s.season,
        color, colorHex: color ? hexOf.get(color.toLowerCase()) ?? null : null,
        image: pics[0] ? { fileId: pics[0].fileId, thumbFileId: pics[0].thumbFileId } : null, imageCount: own.length + (color ? shared.length : 0),
        rate: money(rates.reduce((m, r) => (r.lt(m) ? r : m), rates[0]!)), mrp: s.mrp,
        stock: vs.reduce((t, v) => t.plus(stock.get(v.id) ?? 0), dec(0)).toString(),
        sold: vs.reduce((t, v) => t.plus(sold.get(v.id) ?? 0), dec(0)).toString(),
        sizes,
      });
    }
  }
  return tiles;
}

const has = (list: string[] | undefined, v: string | null) => !list?.length || (v !== null && list.some((x) => x.toLowerCase() === v.toLowerCase()));

/** The catalogue: tiles per style and colour with photo, rate (the party's, if one is chosen), stock and sales, plus filter counts. */
export async function catalogue(tx: Tx, q: CatalogueQuery) {
  const company = await resolveCompany(tx);
  const all = await buildTiles(tx, company, q);
  const term = q.q?.trim().toLowerCase();
  const textMatch = (t: Tile) => !term || [t.code, t.name, t.brand, t.category, t.color].some((x) => x?.toLowerCase().includes(term))
    || t.sizes.some((s) => s.barcode?.toLowerCase() === term);
  const base = all.filter((t) => textMatch(t)
    && (!q.inStock || dec(t.stock).gt(0)) && (!q.withImage || t.image)
    && (!q.minRate || dec(t.rate).gte(q.minRate)) && (!q.maxRate || dec(t.rate).lte(q.maxRate)));
  // Each filter's counts leave that filter itself out, so the other choices stay visible.
  const facet = (key: "brand" | "category" | "season" | "color", others: (t: Tile) => boolean) => {
    const counts = new Map<string, number>();
    for (const t of base.filter(others)) if (t[key]) counts.set(t[key]!, (counts.get(t[key]!) ?? 0) + 1);
    return [...counts].map(([value, count]) => ({ value, count })).sort((a, b) => a.value.localeCompare(b.value));
  };
  const byBrand = (t: Tile) => has(q.brands, t.brand);
  const byCategory = (t: Tile) => has(q.categories, t.category);
  const bySeason = (t: Tile) => has(q.seasons, t.season);
  const byColor = (t: Tile) => has(q.colors, t.color);
  const shown = base.filter((t) => byBrand(t) && byCategory(t) && bySeason(t) && byColor(t));
  const created = new Map((await tx.select({ id: tables.styles.id, at: tables.styles.createdAt }).from(tables.styles).where(eq(tables.styles.companyId, company.id))).map((r) => [r.id, r.at.getTime()]));
  const sorters: Record<NonNullable<CatalogueQuery["sort"]>, (a: Tile, b: Tile) => number> = {
    newest: (a, b) => (created.get(b.styleId) ?? 0) - (created.get(a.styleId) ?? 0) || a.code.localeCompare(b.code),
    best: (a, b) => dec(b.sold).cmp(a.sold) || a.code.localeCompare(b.code),
    price_low: (a, b) => dec(a.rate).cmp(b.rate),
    price_high: (a, b) => dec(b.rate).cmp(a.rate),
    stock: (a, b) => dec(b.stock).cmp(a.stock),
    code: (a, b) => a.code.localeCompare(b.code) || (a.color ?? "").localeCompare(b.color ?? ""),
  };
  shown.sort(sorters[q.sort ?? "code"]);
  const rates = base.map((t) => Number(t.rate));
  return {
    total: shown.length,
    tiles: shown.slice(q.offset ?? 0, (q.offset ?? 0) + (q.limit ?? 60)),
    facets: {
      brands: facet("brand", (t) => byCategory(t) && bySeason(t) && byColor(t)),
      categories: facet("category", (t) => byBrand(t) && bySeason(t) && byColor(t)),
      seasons: facet("season", (t) => byBrand(t) && byCategory(t) && byColor(t)),
      colors: facet("color", (t) => byBrand(t) && byCategory(t) && bySeason(t)),
      rate: { min: rates.length ? Math.floor(Math.min(...rates)) : 0, max: rates.length ? Math.ceil(Math.max(...rates)) : 0 },
    },
  };
}

// ---- selections ----------------------------------------------------------------------------------------

export interface SelectionInput {
  name: string; partyId?: string | null | undefined; lines: { styleId: string; color?: string | null | undefined }[];
  showPrices?: boolean | undefined; showStock?: boolean | undefined;
}

async function checkSelection(tx: Tx, company: Company, input: SelectionInput) {
  if (!input.lines.length) throw badRequest("no_lines");
  const lines = input.lines.map((l) => ({ styleId: l.styleId, color: l.color?.trim() || null }));
  const keys = lines.map((l) => `${l.styleId}:${l.color ?? ""}`);
  if (new Set(keys).size !== keys.length) throw badRequest("duplicate_line");
  const found = await tx.select({ id: tables.styles.id, companyId: tables.styles.companyId }).from(tables.styles).where(inArray(tables.styles.id, [...new Set(lines.map((l) => l.styleId))]));
  if (found.length !== new Set(lines.map((l) => l.styleId)).size || found.some((s) => s.companyId !== company.id)) throw badRequest("unknown_style");
  if (input.partyId) {
    const [p] = await tx.select({ companyId: tables.accounts.companyId }).from(tables.accounts).where(eq(tables.accounts.id, input.partyId));
    if (!p || p.companyId !== company.id) throw badRequest("unknown_account");
  }
  return lines;
}

export async function listSelections(tx: Tx) {
  const company = await resolveCompany(tx);
  const rows = await tx.select({ s: tables.catalogueSelections, party: tables.accounts.name }).from(tables.catalogueSelections)
    .leftJoin(tables.accounts, eq(tables.accounts.id, tables.catalogueSelections.partyId))
    .where(eq(tables.catalogueSelections.companyId, company.id)).orderBy(desc(tables.catalogueSelections.updatedAt));
  const now = Date.now();
  return rows.map(({ s, party }) => ({
    id: s.id, name: s.name, partyId: s.partyId, party, count: s.lines.length, showPrices: s.showPrices, showStock: s.showStock,
    sharedUntil: s.shareExpiresAt && s.shareExpiresAt.getTime() > now ? s.shareExpiresAt.toISOString() : null, updatedAt: s.updatedAt.toISOString(),
  }));
}

export async function saveSelection(tx: Tx, actor: Actor, input: SelectionInput, id?: string) {
  const company = await resolveCompany(tx);
  const lines = await checkSelection(tx, company, input);
  const values = { name: input.name.trim(), partyId: input.partyId ?? null, lines, showPrices: input.showPrices ?? true, showStock: input.showStock ?? false };
  if (id) {
    const [cur] = await tx.select().from(tables.catalogueSelections).where(eq(tables.catalogueSelections.id, id));
    if (!cur || cur.companyId !== company.id) throw notFound();
    const [row] = await tx.update(tables.catalogueSelections).set({ ...values, updatedAt: new Date() }).where(eq(tables.catalogueSelections.id, id)).returning();
    await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "catalogue_selection", entityId: id, before: { name: cur.name, count: cur.lines.length }, after: { name: row!.name, count: lines.length }, ip: actor.ip });
    return row!;
  }
  const [row] = await tx.insert(tables.catalogueSelections).values({ tenantId: actor.tenantId, companyId: company.id, ...values, createdBy: actor.userId }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "catalogue_selection", entityId: row!.id, after: { name: row!.name, count: lines.length }, ip: actor.ip });
  return row!;
}

export async function deleteSelection(tx: Tx, actor: Actor, id: string) {
  const company = await resolveCompany(tx);
  const [cur] = await tx.select().from(tables.catalogueSelections).where(eq(tables.catalogueSelections.id, id));
  if (!cur || cur.companyId !== company.id) throw notFound();
  await tx.delete(tables.catalogueSelections).where(eq(tables.catalogueSelections.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "delete", entity: "catalogue_selection", entityId: id, before: { name: cur.name, count: cur.lines.length }, ip: actor.ip });
}

/** A selection with its tiles, priced for its party. */
export async function getSelection(tx: Tx, id: string) {
  const company = await resolveCompany(tx);
  const [s] = await tx.select().from(tables.catalogueSelections).where(eq(tables.catalogueSelections.id, id));
  if (!s || s.companyId !== company.id) throw notFound();
  const [party] = s.partyId ? await tx.select({ id: tables.accounts.id, name: tables.accounts.name, phone: tables.accounts.phone }).from(tables.accounts).where(eq(tables.accounts.id, s.partyId)) : [];
  const tiles = await buildTiles(tx, company, { partyId: s.partyId ?? undefined }, s.lines);
  const order = new Map(s.lines.map((l, i) => [`${l.styleId}:${l.color ?? ""}`, i]));
  tiles.sort((a, b) => (order.get(a.key) ?? 0) - (order.get(b.key) ?? 0));
  return {
    id: s.id, name: s.name, party: party ?? null, showPrices: s.showPrices, showStock: s.showStock, company: { name: company.name },
    sharedUntil: s.shareExpiresAt && s.shareExpiresAt.getTime() > Date.now() ? s.shareExpiresAt.toISOString() : null, tiles,
  };
}

/**
 * Makes (or replaces) the link that opens this selection without signing in. Only the token's hash is
 * kept, so the link is shown once; a new one stops the old one working.
 */
export async function shareSelection(tx: Tx, actor: Actor, id: string, days: number, webOrigin: string) {
  const company = await resolveCompany(tx);
  const [s] = await tx.select().from(tables.catalogueSelections).where(eq(tables.catalogueSelections.id, id));
  if (!s || s.companyId !== company.id) throw notFound();
  if (!Number.isInteger(days) || days < 1 || days > MAX_SHARE_DAYS) throw badRequest("invalid_days");
  const token = randomBytes(24).toString("base64url");
  const expiresAt = new Date(Date.now() + days * 86_400_000);
  await tx.update(tables.catalogueSelections).set({ shareTokenHash: hashToken(token), shareExpiresAt: expiresAt }).where(eq(tables.catalogueSelections.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "share", entity: "catalogue_selection", entityId: id, after: { until: expiresAt.toISOString() }, ip: actor.ip });
  return { url: `${webOrigin.replace(/\/$/, "")}/c/${token}`, expiresAt: expiresAt.toISOString() };
}

export async function stopSharing(tx: Tx, actor: Actor, id: string) {
  const company = await resolveCompany(tx);
  const [s] = await tx.select().from(tables.catalogueSelections).where(eq(tables.catalogueSelections.id, id));
  if (!s || s.companyId !== company.id) throw notFound();
  await tx.update(tables.catalogueSelections).set({ shareTokenHash: null, shareExpiresAt: null }).where(eq(tables.catalogueSelections.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "unshare", entity: "catalogue_selection", entityId: id, ip: actor.ip });
}

/** Sends the selection's link on WhatsApp (the demo messenger records it until a provider is set). */
export async function sendSelection(tx: Tx, actor: Actor, id: string, input: { phone?: string | undefined; url: string }) {
  const company = await resolveCompany(tx);
  const sel = await getSelection(tx, id);
  const token = input.url.split("/c/")[1] ?? "";
  const [s] = await tx.select().from(tables.catalogueSelections).where(eq(tables.catalogueSelections.id, id));
  if (!token || s!.shareTokenHash !== hashToken(token) || !s!.shareExpiresAt || s!.shareExpiresAt.getTime() <= Date.now()) throw badRequest("share_link_stale");
  const to = normalizeIndianMobile(input.phone ?? sel.party?.phone ?? "");
  if (!to) throw badRequest("invalid_phone");
  const body = `${company.name}: ${sel.name}, ${sel.tiles.length} designs. ${input.url}`;
  let status: "sent" | "failed" = "sent";
  let providerId: string | null = null;
  let error: string | null = null;
  try {
    providerId = (await messenger.send({ to, body })).id;
  } catch (e) {
    status = "failed";
    error = e instanceof MessagingError ? e.code : "send_failed";
  }
  const [msg] = await tx.insert(tables.messages).values({
    tenantId: actor.tenantId, companyId: company.id, channel: "whatsapp", to, accountId: sel.party?.id ?? null, body, status, provider: messenger.name, providerId, error, createdBy: actor.userId,
  }).returning();
  if (status === "failed") throw badRequest(error ?? "send_failed");
  return { id: msg!.id, to, status, provider: messenger.name };
}

// ---- the shared page (no sign-in) -------------------------------------------------------------------------

/** What a shared link shows: names, photos and sizes, with prices and stock only when the sender chose so. */
export async function publicSelection(tx: Tx, selectionId: string) {
  const sel = await getSelection(tx, selectionId);
  return {
    company: sel.company.name, name: sel.name, party: sel.party?.name ?? null, until: sel.sharedUntil,
    tiles: sel.tiles.map((t) => ({
      key: t.key, code: t.code, name: t.name, brand: t.brand, color: t.color, colorHex: t.colorHex, image: t.image,
      rate: sel.showPrices ? t.rate : null, mrp: sel.showPrices ? t.mrp : null,
      sizes: t.sizes.map((x) => ({ size: x.size, ...(sel.showStock ? { inStock: dec(x.stock).gt(0) } : {}) })),
    })),
  };
}

/** A photo on a shared link: only files that belong to the styles in that selection. */
export async function publicImage(tx: Tx, selectionId: string, fileId: string) {
  const [s] = await tx.select().from(tables.catalogueSelections).where(eq(tables.catalogueSelections.id, selectionId));
  if (!s) throw notFound();
  const styleIds = [...new Set(s.lines.map((l) => l.styleId))];
  const [img] = await tx.select({ id: tables.styleImages.id }).from(tables.styleImages)
    .where(and(inArray(tables.styleImages.styleId, styleIds), eq(tables.styleImages.archived, false), sql`(${tables.styleImages.fileId} = ${fileId} or ${tables.styleImages.thumbFileId} = ${fileId})`)).limit(1);
  if (!img) throw notFound();
  const [f] = await tx.select().from(tables.files).where(eq(tables.files.id, fileId));
  if (!f) throw notFound();
  return f;
}
