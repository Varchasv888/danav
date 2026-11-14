import { and, asc, eq, ilike, inArray, isNull, or, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { ensureInventory, stockPositions } from "./inventory.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
type Company = Awaited<ReturnType<typeof resolveCompany>>;

/** Size scales and colours a garment business starts with; it can rename, add or archive them. */
const DEFAULT_SCALES: { name: string; sizes: string[] }[] = [
  { name: "Garments (XS to 3XL)", sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"] },
  { name: "Waist (28 to 42)", sizes: ["28", "30", "32", "34", "36", "38", "40", "42"] },
  { name: "Kids (age)", sizes: ["0-1Y", "1-2Y", "2-3Y", "3-4Y", "4-5Y", "5-6Y", "6-7Y", "7-8Y", "9-10Y", "11-12Y", "13-14Y"] },
  { name: "Footwear (UK)", sizes: ["5", "6", "7", "8", "9", "10", "11"] },
  { name: "Free size", sizes: ["FS"] },
];
const DEFAULT_COLORS: { name: string; code: string; hex: string }[] = [
  { name: "Black", code: "BLK", hex: "#1b1b1b" }, { name: "White", code: "WHT", hex: "#f7f7f5" }, { name: "Navy", code: "NVY", hex: "#1f2a52" },
  { name: "Blue", code: "BLU", hex: "#2f62c4" }, { name: "Sky blue", code: "SKY", hex: "#8cc4ec" }, { name: "Red", code: "RED", hex: "#c62f2f" },
  { name: "Maroon", code: "MRN", hex: "#6e1b2b" }, { name: "Pink", code: "PNK", hex: "#e889ad" }, { name: "Green", code: "GRN", hex: "#2f7a45" },
  { name: "Olive", code: "OLV", hex: "#6b6a35" }, { name: "Yellow", code: "YLW", hex: "#e8c032" }, { name: "Mustard", code: "MST", hex: "#c99a22" },
  { name: "Grey", code: "GRY", hex: "#8a8d93" }, { name: "Beige", code: "BEG", hex: "#d8c7a6" }, { name: "Brown", code: "BRN", hex: "#6c4a30" },
  { name: "Multi", code: "MLT", hex: "#9b7fd1" },
];

export async function ensureApparel(tx: Tx, company: Company) {
  await ensureInventory(tx, company.tenantId, company.id);
  const [anyScale] = await tx.select({ id: tables.sizeScales.id }).from(tables.sizeScales).where(eq(tables.sizeScales.companyId, company.id)).limit(1);
  // Two requests may seed at once (a page loads scales and colours together): the second one skips.
  if (!anyScale) await tx.insert(tables.sizeScales).values(DEFAULT_SCALES.map((s) => ({ tenantId: company.tenantId, companyId: company.id, ...s }))).onConflictDoNothing();
  const [anyColor] = await tx.select({ id: tables.colors.id }).from(tables.colors).where(eq(tables.colors.companyId, company.id)).limit(1);
  if (!anyColor) await tx.insert(tables.colors).values(DEFAULT_COLORS.map((c) => ({ tenantId: company.tenantId, companyId: company.id, ...c }))).onConflictDoNothing();
}

// ---- barcodes ---------------------------------------------------------------------------------------

/** EAN-13 check digit for 12 digits. */
export function ean13(base12: string) {
  const sum = [...base12].reduce((s, d, i) => s + Number(d) * (i % 2 ? 3 : 1), 0);
  return `${base12}${(10 - (sum % 10)) % 10}`;
}

/**
 * In-store barcodes (EAN-13 starting with 2, which GS1 keeps for a business's own use): the next
 * number after the highest one this company has issued.
 */
async function nextBarcodes(tx: Tx, companyId: string, count: number) {
  const [r] = await tx.execute<{ max: string | null }>(sql`
    select max(substring(barcode from 2 for 11)) as max from items
    where company_id = ${companyId} and barcode ~ '^2[0-9]{12}$'`);
  let n = Number(r?.max ?? 0);
  return Array.from({ length: count }, () => ean13(`2${String(++n).padStart(11, "0")}`));
}

/**
 * Gives in-store barcodes to goods that have none (listed items, or every one): EAN-13 starting with 2, the next numbers after the highest
 * issued. Items that already have a barcode are left alone, so a printed code never changes.
 */
export async function generateBarcodes(tx: Tx, actor: Actor, itemIds?: string[]) {
  const company = await resolveCompany(tx);
  const rows = await tx.select({ id: tables.items.id }).from(tables.items)
    .where(and(eq(tables.items.companyId, company.id), eq(tables.items.kind, "goods"), eq(tables.items.archived, false), isNull(tables.items.barcode), itemIds?.length ? inArray(tables.items.id, itemIds) : undefined))
    .orderBy(asc(tables.items.createdAt)).limit(5000);
  if (!rows.length) return { assigned: 0 };
  const codes = await nextBarcodes(tx, company.id, rows.length);
  for (let i = 0; i < rows.length; i++) await tx.update(tables.items).set({ barcode: codes[i]! }).where(eq(tables.items.id, rows[i]!.id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "item_barcodes", entityId: company.id, after: { assigned: rows.length, first: codes[0], last: codes[codes.length - 1] }, ip: actor.ip });
  return { assigned: rows.length, first: codes[0]!, last: codes[codes.length - 1]! };
}

const skuPart = (s: string) => s.trim().toUpperCase().replace(/\s+/g, "").replace(/[^A-Z0-9-]/g, "");

// ---- masters ----------------------------------------------------------------------------------------

export async function listScales(tx: Tx) {
  const company = await resolveCompany(tx);
  await ensureApparel(tx, company);
  return tx.select().from(tables.sizeScales).where(eq(tables.sizeScales.companyId, company.id)).orderBy(asc(tables.sizeScales.createdAt));
}

export async function saveScale(tx: Tx, actor: Actor, input: { id?: string | undefined; name: string; sizes: string[]; archived?: boolean | undefined }) {
  const company = await resolveCompany(tx);
  const sizes = [...new Set(input.sizes.map((s) => s.trim()).filter(Boolean))];
  if (!sizes.length) throw badRequest("sizes_required");
  const values = { name: input.name.trim(), sizes, ...(input.archived !== undefined ? { archived: input.archived } : {}) };
  const [row] = input.id
    ? await tx.update(tables.sizeScales).set(values).where(and(eq(tables.sizeScales.id, input.id), eq(tables.sizeScales.companyId, company.id))).returning()
    : await tx.insert(tables.sizeScales).values({ tenantId: actor.tenantId, companyId: company.id, ...values }).returning()
      .catch((e) => { if (e?.cause?.code === "23505") throw badRequest("scale_name_taken"); throw e; });
  if (!row) throw notFound();
  return row;
}

export async function listColors(tx: Tx) {
  const company = await resolveCompany(tx);
  await ensureApparel(tx, company);
  return tx.select().from(tables.colors).where(eq(tables.colors.companyId, company.id)).orderBy(asc(tables.colors.name));
}

export async function saveColor(tx: Tx, actor: Actor, input: { id?: string | undefined; name: string; code?: string | undefined; hex?: string | null | undefined; archived?: boolean | undefined }) {
  const company = await resolveCompany(tx);
  const code = skuPart(input.code || input.name.slice(0, 3)).slice(0, 8);
  if (!code) throw badRequest("color_code_required");
  const values = { name: input.name.trim(), code, ...(input.hex !== undefined ? { hex: input.hex } : {}), ...(input.archived !== undefined ? { archived: input.archived } : {}) };
  const [row] = input.id
    ? await tx.update(tables.colors).set(values).where(and(eq(tables.colors.id, input.id), eq(tables.colors.companyId, company.id))).returning()
      .catch((e) => { if (e?.cause?.code === "23505") throw badRequest("color_taken"); throw e; })
    : await tx.insert(tables.colors).values({ tenantId: actor.tenantId, companyId: company.id, ...values }).returning()
      .catch((e) => { if (e?.cause?.code === "23505") throw badRequest("color_taken"); throw e; });
  if (!row) throw notFound();
  return row;
}

// ---- styles and variants ----------------------------------------------------------------------------

export interface StyleInput {
  code: string; name: string; nameHi?: string | null | undefined; brand?: string | null | undefined; category?: string | null | undefined;
  season?: string | null | undefined; collection?: string | null | undefined; hsn?: string | null | undefined;
  gstRate?: string | undefined; gstSlab?: string | null | undefined; uomId: string; purchaseRate?: string | undefined; saleRate?: string | undefined;
  mrp?: string | null | undefined; sizeScaleId?: string | null | undefined; fits?: string[] | null | undefined; imageFileId?: string | null | undefined;
  attributes?: Record<string, string> | undefined;
}

export interface VariantSpec {
  colorIds: string[];
  sizes: string[];
  fits?: string[] | undefined;
  /** Prices by size where they differ (bigger sizes often cost more). */
  sizePrices?: Record<string, { saleRate?: string | undefined; purchaseRate?: string | undefined; mrp?: string | undefined }> | undefined;
}

export async function createStyle(tx: Tx, actor: Actor, input: StyleInput & VariantSpec) {
  const company = await resolveCompany(tx);
  await ensureApparel(tx, company);
  const [uom] = await tx.select().from(tables.uoms).where(and(eq(tables.uoms.id, input.uomId), eq(tables.uoms.companyId, company.id)));
  if (!uom) throw badRequest("unknown_uom");
  const { colorIds, sizes, fits, sizePrices, ...fields } = input;
  const [style] = await tx.insert(tables.styles).values({
    tenantId: actor.tenantId, companyId: company.id, ...fields, code: fields.code.trim(), name: fields.name.trim(),
    fits: fits?.length ? fits : null, gstRate: fields.gstRate ?? "5", purchaseRate: fields.purchaseRate ?? "0", saleRate: fields.saleRate ?? "0",
  }).returning().catch((e) => { if (e?.cause?.code === "23505") throw badRequest("style_code_taken"); throw e; });
  const variants = await addVariants(tx, actor, style!.id, { colorIds, sizes, fits, sizePrices });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "style", entityId: style!.id, after: { code: style!.code, name: style!.name, variants: variants.length }, ip: actor.ip });
  return { ...style!, variants };
}

/** Adds colour-size (and fit) variants a style doesn't have yet; existing ones are left alone. */
export async function addVariants(tx: Tx, actor: Actor, styleId: string, spec: VariantSpec) {
  const company = await resolveCompany(tx);
  const [style] = await tx.select().from(tables.styles).where(and(eq(tables.styles.id, styleId), eq(tables.styles.companyId, company.id)));
  if (!style) throw notFound();
  if (!spec.colorIds.length || !spec.sizes.length) throw badRequest("colors_and_sizes_required");
  const colorRows = await tx.select().from(tables.colors).where(and(eq(tables.colors.companyId, company.id), inArray(tables.colors.id, spec.colorIds)));
  if (colorRows.length !== new Set(spec.colorIds).size) throw badRequest("unknown_color");
  const scale = style.sizeScaleId ? (await tx.select().from(tables.sizeScales).where(eq(tables.sizeScales.id, style.sizeScaleId)))[0] : undefined;
  // The scale's order; sizes not on a scale keep the order they were typed in, after the scale's.
  const order = (size: string) => { const i = scale?.sizes.indexOf(size) ?? -1; return i >= 0 ? i : 500 + spec.sizes.indexOf(size); };
  const fits = spec.fits?.length ? spec.fits : style.fits?.length ? style.fits : [null];
  const existing = await tx.select({ color: tables.items.color, size: tables.items.size, fit: tables.items.fit }).from(tables.items).where(eq(tables.items.styleId, style.id));
  const has = new Set(existing.map((e) => `${e.color}|${e.size}|${e.fit ?? ""}`));

  const wanted: { color: typeof colorRows[number]; size: string; fit: string | null }[] = [];
  for (const colorId of spec.colorIds) {
    const color = colorRows.find((c) => c.id === colorId)!;
    for (const size of spec.sizes.map((s) => s.trim()).filter(Boolean)) {
      for (const fit of fits) if (!has.has(`${color.name}|${size}|${fit ?? ""}`)) wanted.push({ color, size, fit });
    }
  }
  if (!wanted.length) return [];
  const barcodes = await nextBarcodes(tx, company.id, wanted.length);
  const taken = new Set((await tx.select({ name: tables.items.name }).from(tables.items).where(and(
    eq(tables.items.companyId, company.id), inArray(sql`lower(${tables.items.name})`, wanted.map((w) => variantName(style.name, w.color.name, w.size, w.fit).toLowerCase())),
  ))).map((r) => r.name.toLowerCase()));
  const rows = wanted.map((w, i) => {
    const base = variantName(style.name, w.color.name, w.size, w.fit);
    const price = spec.sizePrices?.[w.size];
    return {
      tenantId: actor.tenantId, companyId: company.id, styleId: style.id, color: w.color.name, size: w.size, fit: w.fit, sizeOrder: order(w.size),
      // Another item may already use the plain name; the design number keeps variants unique.
      name: taken.has(base.toLowerCase()) ? `${base} (${style.code})` : base,
      nameHi: style.nameHi ? variantName(style.nameHi, w.color.name, w.size, w.fit) : null,
      sku: [skuPart(style.code), w.color.code, skuPart(w.size), w.fit ? skuPart(w.fit) : null].filter(Boolean).join("-").slice(0, 40),
      barcode: barcodes[i]!, kind: "goods", hsn: style.hsn, gstRate: style.gstRate, gstSlab: style.gstSlab, uomId: style.uomId,
      purchaseRate: price?.purchaseRate ?? style.purchaseRate, saleRate: price?.saleRate ?? style.saleRate, mrp: price?.mrp ?? style.mrp,
    };
  });
  return tx.insert(tables.items).values(rows).returning()
    .catch((e) => { if (e?.cause?.code === "23505") throw badRequest(String(e?.cause?.constraint_name).includes("sku") ? "sku_taken" : "item_name_taken"); throw e; });
}

const variantName = (name: string, color: string, size: string, fit: string | null) => [name, color, fit, size].filter(Boolean).join(" ");

export async function updateStyle(tx: Tx, actor: Actor, id: string, input: Partial<StyleInput> & { archived?: boolean | undefined; applyPrices?: boolean | undefined }) {
  const company = await resolveCompany(tx);
  const [current] = await tx.select().from(tables.styles).where(and(eq(tables.styles.id, id), eq(tables.styles.companyId, company.id))).for("update");
  if (!current) throw notFound();
  const { applyPrices, ...fields } = input;
  const [row] = await tx.update(tables.styles).set({ ...fields, updatedAt: new Date() }).where(eq(tables.styles.id, id)).returning()
    .catch((e) => { if (e?.cause?.code === "23505") throw badRequest("style_code_taken"); throw e; });
  // Tax and unit always follow the style; prices only when asked, since sizes may be priced apart.
  const shared: Record<string, unknown> = {};
  for (const k of ["hsn", "gstRate", "gstSlab", "uomId", "archived"] as const) if (k in fields) shared[k] = fields[k];
  if (applyPrices) for (const k of ["purchaseRate", "saleRate", "mrp"] as const) if (k in fields) shared[k] = fields[k];
  if (Object.keys(shared).length) await tx.update(tables.items).set({ ...shared, updatedAt: new Date() }).where(eq(tables.items.styleId, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "style", entityId: id, before: { code: current.code }, after: fields, ip: actor.ip });
  return row!;
}

export async function listStyles(tx: Tx, q: { search?: string | undefined; season?: string | undefined; brand?: string | undefined; category?: string | undefined; attr?: string | undefined }) {
  const [attrKind, ...attrRest] = q.attr?.split(":") ?? [];
  const company = await resolveCompany(tx);
  const like = q.search ? `%${q.search.trim()}%` : null;
  const styles = await tx.select().from(tables.styles).where(and(
    eq(tables.styles.companyId, company.id),
    like ? or(ilike(tables.styles.code, like), ilike(tables.styles.name, like), ilike(tables.styles.brand, like)) : undefined,
    q.season ? eq(tables.styles.season, q.season) : undefined,
    q.brand ? eq(tables.styles.brand, q.brand) : undefined,
    q.category ? eq(tables.styles.category, q.category) : undefined,
    attrKind ? sql`${tables.styles.attributes} ->> ${attrKind} = ${attrRest.join(":")}` : undefined,
  )).orderBy(asc(tables.styles.code)).limit(500);
  if (!styles.length) return [];
  const variants = await tx.select({ id: tables.items.id, styleId: tables.items.styleId, color: tables.items.color, isPack: tables.items.isPack })
    .from(tables.items).where(inArray(tables.items.styleId, styles.map((s) => s.id)));
  const positions = await stockPositions(tx, company, "9999-12-31", { itemIds: variants.filter((v) => !v.isPack).map((v) => v.id) });
  return styles.map((s) => {
    const mine = variants.filter((v) => v.styleId === s.id && !v.isPack);
    const ids = new Set(mine.map((v) => v.id));
    return {
      ...s, variants: mine.length, colors: [...new Set(mine.map((v) => v.color))].length,
      stockQty: dec(positions.filter((p) => ids.has(p.itemId)).reduce((t, p) => t.plus(p.qty), dec(0))).toString(),
    };
  });
}

/** A style with its variants and the colour-by-size stock grid (all warehouses, or one). */
export async function getStyle(tx: Tx, id: string, warehouseId?: string) {
  const company = await resolveCompany(tx);
  const [style] = await tx.select().from(tables.styles).where(and(eq(tables.styles.id, id), eq(tables.styles.companyId, company.id)));
  if (!style) throw notFound();
  const variants = await tx.select().from(tables.items).where(eq(tables.items.styleId, id)).orderBy(asc(tables.items.color), asc(tables.items.sizeOrder), asc(tables.items.fit));
  const singles = variants.filter((v) => !v.isPack);
  const positions = singles.length ? await stockPositions(tx, company, "9999-12-31", { itemIds: singles.map((v) => v.id), ...(warehouseId ? { warehouseId } : {}) }) : [];
  const stockOf = (itemId: string) => positions.filter((p) => p.itemId === itemId).reduce((t, p) => t.plus(p.qty), dec(0));
  const sizes = [...new Map(singles.map((v) => [v.size!, v.sizeOrder])).entries()].sort((a, b) => a[1] - b[1]).map(([s]) => s);
  const colors = [...new Set(singles.map((v) => v.color!))];
  const fits = [...new Set(singles.map((v) => v.fit))];
  const packs = variants.filter((v) => v.isPack);
  const packLines = packs.length ? await tx.select().from(tables.itemPackLines).where(inArray(tables.itemPackLines.packItemId, packs.map((p) => p.id))) : [];
  return {
    ...style, sizes, colors, fits,
    variants: singles.map((v) => ({ ...v, stockQty: stockOf(v.id).toString() })),
    packs: packs.map((p) => ({ ...p, lines: packLines.filter((l) => l.packItemId === p.id).map((l) => ({ itemId: l.itemId, qty: l.qty })) })),
  };
}

// ---- sets (ratio packs) -----------------------------------------------------------------------------

/**
 * A set of one colour in a size ratio (S 1, M 2, L 2, XL 1) sold as one unit. It is billed as one line
 * and moves stock as its pieces; for GST by price it counts as that many pieces unless told otherwise.
 */
export async function createPack(tx: Tx, actor: Actor, styleId: string, input: { colorId: string; ratio: Record<string, number>; fit?: string | null | undefined; asOnePiece?: boolean | undefined; saleRate?: string | undefined }) {
  const company = await resolveCompany(tx);
  const style = await getStyle(tx, styleId);
  const [color] = await tx.select().from(tables.colors).where(and(eq(tables.colors.id, input.colorId), eq(tables.colors.companyId, company.id)));
  if (!color) throw badRequest("unknown_color");
  const entries = Object.entries(input.ratio).filter(([, q]) => q > 0);
  if (!entries.length) throw badRequest("ratio_required");
  const components = entries.map(([size, qty]) => {
    const v = style.variants.find((x) => x.color === color.name && x.size === size && (x.fit ?? null) === (input.fit ?? x.fit ?? null));
    if (!v) throw badRequest("variant_missing");
    return { v, qty };
  });
  const pieces = components.reduce((s, c) => s + c.qty, 0);
  const label = entries.map(([s, q]) => `${s}${q}`).join("-");
  const sum = (k: "saleRate" | "purchaseRate") => money(components.reduce((t, c) => t.plus(dec(c.v[k]).times(c.qty)), dec(0)));
  const [barcode] = await nextBarcodes(tx, company.id, 1);
  const [pack] = await tx.insert(tables.items).values({
    tenantId: actor.tenantId, companyId: company.id, styleId, color: color.name, size: `Set ${label}`, fit: input.fit ?? null, sizeOrder: 1000, isPack: true,
    name: `${style.name} ${color.name} set ${label}`, sku: [skuPart(style.code), color.code, `SET${pieces}`, skuPart(label)].join("-").slice(0, 40),
    barcode: barcode!, kind: "goods", hsn: style.hsn, gstRate: style.gstRate, gstSlab: style.gstSlab, slabPieces: input.asOnePiece ? 1 : pieces,
    uomId: style.uomId, purchaseRate: sum("purchaseRate"), saleRate: input.saleRate ?? sum("saleRate"),
  }).returning().catch((e) => { if (e?.cause?.code === "23505") throw conflict("pack_exists"); throw e; });
  await tx.insert(tables.itemPackLines).values(components.map((c) => ({ tenantId: actor.tenantId, packItemId: pack!.id, itemId: c.v.id, qty: String(c.qty) })));
  return pack!;
}
