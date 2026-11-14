import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { itemByCode } from "./barcodes.js";
import { tables, type Tx } from "@varchasv/db";
import { businessDate, dec, money } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { documentNumber, postStockJournal, stockPositions } from "./inventory.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
export interface CountScope { brand?: string | undefined; category?: string | undefined; styleId?: string | undefined; season?: string | undefined; itemIds?: string[] | undefined }

const SERIES = { docType: "stock_count", name: "Stock counts", pattern: "SC/{FY}/{SEQ:4}" };
const today = () => businessDate();

/** Goods in scope: all goods, or those of one brand, category or design. */
async function goodsInScope(tx: Tx, companyId: string, scope: CountScope) {
  return tx.select({ id: tables.items.id }).from(tables.items).leftJoin(tables.styles, eq(tables.styles.id, tables.items.styleId))
    .where(and(
      eq(tables.items.companyId, companyId), eq(tables.items.kind, "goods"), eq(tables.items.archived, false),
      scope.styleId ? eq(tables.items.styleId, scope.styleId) : undefined,
      scope.brand ? sql`lower(${tables.styles.brand}) = ${scope.brand.toLowerCase()}` : undefined,
      scope.category ? sql`lower(${tables.styles.category}) = ${scope.category.toLowerCase()}` : undefined,
      scope.season ? sql`lower(${tables.styles.season}) = ${scope.season.toLowerCase()}` : undefined,
      scope.itemIds?.length ? inArray(tables.items.id, scope.itemIds) : undefined,
    ));
}

/**
 * Starts a count of one store: what the books hold of every item in scope right now (and its cost) is
 * kept, so the difference is worked out against the moment counting began. Count with the store closed,
 * or one section at a time.
 */
export async function startCount(tx: Tx, actor: Actor, input: { id?: string | undefined; warehouseId: string; name: string; scope?: CountScope | undefined; blind?: boolean | undefined; verifyOnly?: boolean | undefined }) {
  const company = await resolveCompany(tx);
  const [w] = await tx.select().from(tables.warehouses).where(eq(tables.warehouses.id, input.warehouseId));
  if (!w || w.companyId !== company.id) throw badRequest("unknown_warehouse");
  const scope = Object.fromEntries(Object.entries(input.scope ?? {}).filter(([, v]) => (Array.isArray(v) ? v.length : v))) as CountScope;
  const goods = await goodsInScope(tx, company.id, scope);
  if (!goods.length) throw badRequest("nothing_to_count");
  const date = today();
  const positions = await stockPositions(tx, company, date, { warehouseId: w.id, itemIds: goods.map((g) => g.id) });
  const number = await documentNumber(tx, actor, company, date, SERIES);
  const [count] = await tx.insert(tables.stockCounts).values({
    ...(input.id ? { id: input.id } : {}), tenantId: actor.tenantId, companyId: company.id, warehouseId: w.id, number, name: input.name.trim(), scope, blind: input.blind ?? true, verifyOnly: input.verifyOnly ?? false, createdBy: actor.userId,
  }).returning();
  const byItem = new Map(positions.map((p) => [p.itemId, p]));
  for (let i = 0; i < goods.length; i += 500) {
    await tx.insert(tables.stockCountLines).values(goods.slice(i, i + 500).map((g) => {
      const p = byItem.get(g.id);
      return { tenantId: actor.tenantId, countId: count!.id, itemId: g.id, expected: p ? dec(p.qty).toFixed(4) : "0", rate: p ? dec(p.rate).toFixed(4) : "0" };
    }));
  }
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "stock_count", entityId: count!.id, after: { number, store: w.name, items: goods.length }, ip: actor.ip });
  return count!;
}

async function loadCount(tx: Tx, id: string, lock = false) {
  const q = tx.select().from(tables.stockCounts).where(eq(tables.stockCounts.id, id));
  const [c] = lock ? await q.for("update") : await q;
  if (!c) throw notFound();
  return c;
}

/** One scan (or a typed quantity) for a barcode or SKU: adds to what was counted, or sets it. */
export async function scan(tx: Tx, id: string, input: { code: string; qty?: string | undefined; set?: boolean | undefined }) {
  const c = await loadCount(tx, id);
  if (c.status !== "counting") throw conflict("count_closed");
  const code = input.code.trim();
  const itemId = await itemByCode(tx, c.companyId, code);
  const [it] = itemId ? await tx.select({ id: tables.items.id, name: tables.items.name, barcode: tables.items.barcode, kind: tables.items.kind }).from(tables.items).where(eq(tables.items.id, itemId)) : [];
  if (!it || it.kind !== "goods") throw badRequest("unknown_barcode");
  const qty = dec(input.qty ?? "1");
  if (qty.lt(0) || (!input.set && qty.isZero())) throw badRequest("qty_must_be_positive");
  // A piece outside the count's scope (found on the wrong shelf) joins the count with what the books hold now.
  const [line] = await tx.select().from(tables.stockCountLines).where(and(eq(tables.stockCountLines.countId, id), eq(tables.stockCountLines.itemId, it.id))).for("update");
  let counted: string;
  if (line) {
    counted = (input.set ? qty : dec(line.counted).plus(qty)).toFixed(4);
    await tx.update(tables.stockCountLines).set({ counted }).where(eq(tables.stockCountLines.id, line.id));
  } else {
    const company = await resolveCompany(tx, c.companyId);
    const [p] = await stockPositions(tx, company, today(), { warehouseId: c.warehouseId, itemIds: [it.id] });
    counted = qty.toFixed(4);
    await tx.insert(tables.stockCountLines).values({ tenantId: c.tenantId, countId: id, itemId: it.id, expected: p ? dec(p.qty).toFixed(4) : "0", rate: p ? dec(p.rate).toFixed(4) : "0", counted });
  }
  return { itemId: it.id, name: it.name, barcode: it.barcode, counted, extra: !line };
}

/** Typed quantities for several items at once (a count sheet entered from paper). */
export async function setCounted(tx: Tx, id: string, lines: { itemId: string; counted: string }[]) {
  const c = await loadCount(tx, id);
  if (c.status !== "counting") throw conflict("count_closed");
  for (const l of lines) {
    if (dec(l.counted).lt(0)) throw badRequest("qty_must_be_positive");
    const r = await tx.update(tables.stockCountLines).set({ counted: dec(l.counted).toFixed(4) })
      .where(and(eq(tables.stockCountLines.countId, id), eq(tables.stockCountLines.itemId, l.itemId))).returning({ id: tables.stockCountLines.id });
    if (!r.length) throw badRequest("unknown_item");
  }
}

/** A count with its lines; what the books expected is hidden from counters on a blind count until it is submitted. */
export async function getCount(tx: Tx, id: string, canApprove: boolean) {
  const c = await loadCount(tx, id);
  const [w] = await tx.select({ name: tables.warehouses.name }).from(tables.warehouses).where(eq(tables.warehouses.id, c.warehouseId));
  const rows = await tx.select({ l: tables.stockCountLines, name: tables.items.name, barcode: tables.items.barcode, sku: tables.items.sku, color: tables.items.color, size: tables.items.size, design: tables.styles.code })
    .from(tables.stockCountLines).innerJoin(tables.items, eq(tables.items.id, tables.stockCountLines.itemId)).leftJoin(tables.styles, eq(tables.styles.id, tables.items.styleId))
    .where(eq(tables.stockCountLines.countId, id)).orderBy(asc(tables.styles.code), asc(tables.items.name));
  const showBooks = !c.blind || canApprove || c.status !== "counting";
  const lines = rows.map((r) => {
    const diff = dec(r.l.counted).minus(r.l.expected);
    return {
      itemId: r.l.itemId, name: r.name, barcode: r.barcode, sku: r.sku, design: r.design, color: r.color, size: r.size, counted: r.l.counted,
      ...(showBooks ? { expected: r.l.expected, diff: diff.toFixed(4), value: money(diff.times(r.l.rate)) } : {}),
    };
  });
  const sum = (f: (d: (typeof lines)[number]) => boolean) => money(lines.filter(f).reduce((s, l) => s.plus(l.value ?? 0), dec(0)));
  return {
    ...c, store: w?.name ?? "", showBooks, lines,
    totals: {
      items: lines.length, countedPieces: lines.reduce((s, l) => s.plus(l.counted), dec(0)).toFixed(0), counted: lines.filter((l) => dec(l.counted).gt(0)).length,
      ...(showBooks ? {
        expectedPieces: rows.reduce((s, r) => s.plus(r.l.expected), dec(0)).toFixed(0),
        short: sum((l) => dec(l.diff ?? 0).lt(0)), excess: sum((l) => dec(l.diff ?? 0).gt(0)), net: sum(() => true),
        differences: lines.filter((l) => !dec(l.diff ?? 0).isZero()).length,
      } : {}),
    },
  };
}

export async function listCounts(tx: Tx) {
  const company = await resolveCompany(tx);
  return tx.select({
    c: tables.stockCounts, store: tables.warehouses.name,
    items: sql<number>`(select count(*)::int from stock_count_lines l where l.count_id = ${tables.stockCounts.id})`,
    pieces: sql<string>`(select coalesce(sum(counted), 0)::text from stock_count_lines l where l.count_id = ${tables.stockCounts.id})`,
  }).from(tables.stockCounts).innerJoin(tables.warehouses, eq(tables.warehouses.id, tables.stockCounts.warehouseId))
    .where(eq(tables.stockCounts.companyId, company.id)).orderBy(desc(tables.stockCounts.createdAt)).limit(200);
}

/** Counting is finished: the books' figures and the differences become visible for approval. */
export async function submitCount(tx: Tx, actor: Actor, id: string) {
  const c = await loadCount(tx, id, true);
  if (c.status !== "counting") throw conflict("count_closed");
  await tx.update(tables.stockCounts).set({ status: "submitted", submittedAt: new Date(), submittedBy: actor.userId }).where(eq(tables.stockCounts.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "stock_count", entityId: id, after: { status: "submitted" }, ip: actor.ip });
}

/** Starts the count over: every line goes back to zero. Only while counting; the lines themselves stay. */
export async function resetCount(tx: Tx, actor: Actor, id: string) {
  const c = await loadCount(tx, id, true);
  if (c.status !== "counting") throw conflict("count_closed");
  const done = await tx.update(tables.stockCountLines).set({ counted: "0.0000" }).where(eq(tables.stockCountLines.countId, id)).returning({ id: tables.stockCountLines.id });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "stock_count", entityId: id, after: { reset: done.length }, ip: actor.ip });
  return { lines: done.length };
}

/** Back to counting (a recount of the shelves that looked wrong). */
export async function reopenCount(tx: Tx, actor: Actor, id: string) {
  const c = await loadCount(tx, id, true);
  if (c.status !== "submitted") throw conflict("count_not_submitted");
  await tx.update(tables.stockCounts).set({ status: "counting", submittedAt: null, submittedBy: null }).where(eq(tables.stockCounts.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "stock_count", entityId: id, after: { status: "counting" }, ip: actor.ip });
}

/**
 * Approval puts the books right: one stock adjustment with the pieces found (at their cost when
 * counting began) and the pieces missing. Someone who may approve inventory does this, with a reason
 * when anything differs.
 */
export async function approveCount(tx: Tx, actor: Actor, id: string, reason?: string) {
  const c = await loadCount(tx, id, true);
  if (c.status !== "submitted") throw conflict("count_not_submitted");
  const lines = await tx.select().from(tables.stockCountLines).where(eq(tables.stockCountLines.countId, id));
  const diffs = lines.map((l) => ({ l, diff: dec(l.counted).minus(l.expected) })).filter((x) => !x.diff.isZero());
  if (diffs.length && !reason?.trim()) throw badRequest("reason_required");
  let journalId: string | null = null;
  // A spot check records the difference and leaves the books as they are.
  if (diffs.length && !c.verifyOnly) {
    const { journal } = await postStockJournal(tx, actor, {
      companyId: c.companyId, kind: "adjustment", date: today(), narration: `Stock count ${c.number}: ${reason!.trim()}`,
      lines: diffs.map(({ l, diff }) => diff.gt(0)
        ? { itemId: l.itemId, warehouseId: c.warehouseId, qty: diff.toFixed(4), direction: "in" as const, ...(dec(l.rate).gt(0) ? { rate: dec(l.rate).toFixed(4) } : {}) }
        : { itemId: l.itemId, warehouseId: c.warehouseId, qty: diff.neg().toFixed(4), direction: "out" as const }),
    });
    journalId = journal.id;
  }
  await tx.update(tables.stockCounts).set({ status: "approved", approvedAt: new Date(), approvedBy: actor.userId, reason: reason?.trim() || null, journalId }).where(eq(tables.stockCounts.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "approve", entity: "stock_count", entityId: id, after: { differences: diffs.length, journalId, reason }, ip: actor.ip });
  return { journalId, differences: diffs.length };
}

export async function cancelCount(tx: Tx, actor: Actor, id: string) {
  const c = await loadCount(tx, id, true);
  if (c.status === "approved" || c.status === "cancelled") throw conflict("count_closed");
  await tx.update(tables.stockCounts).set({ status: "cancelled" }).where(eq(tables.stockCounts.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "stock_count", entityId: id, ip: actor.ip });
}

/** Brands, categories and designs to pick a count's scope from. */
export async function countScopes(tx: Tx) {
  const company = await resolveCompany(tx);
  const styles = await tx.select({ id: tables.styles.id, code: tables.styles.code, name: tables.styles.name, brand: tables.styles.brand, category: tables.styles.category })
    .from(tables.styles).where(and(eq(tables.styles.companyId, company.id), eq(tables.styles.archived, false))).orderBy(asc(tables.styles.code));
  const uniq = (xs: (string | null)[]) => [...new Set(xs.filter((x): x is string => !!x))].sort();
  return { brands: uniq(styles.map((s) => s.brand)), categories: uniq(styles.map((s) => s.category)), styles: styles.map(({ id, code, name }) => ({ id, code, name })) };
}

export interface ScanImport {
  /** Lines read, distinct codes, pieces counted, and the codes that were not an item. */
  lines: number; codes: number; pieces: string; matched: number; extra: number; unknown: { code: string; line: number }[]; skipped: { line: number; text: string }[];
}

/**
 * A handheld scanner's text file: one scan per line ("8901234567890") or a code and a quantity ("8901234567890,3"; comma,
 * semicolon, tab or space between). Repeated codes add up. "add" puts the file's quantities on top of what is counted;
 * "replace" sets the counted quantity of each code in the file and leaves other items alone. Codes that are not an item are
 * listed, not guessed at.
 */
export async function importScanFile(tx: Tx, id: string, text: string, mode: "add" | "replace") {
  const totals = new Map<string, { qty: ReturnType<typeof dec>; firstLine: number }>();
  const skipped: ScanImport["skipped"] = [];
  const rows = text.replace(/^﻿/, "").split(/\r?\n/);
  let lines = 0;
  rows.forEach((raw, n) => {
    const row = raw.trim();
    if (!row) return;
    lines += 1;
    const [code, q, ...rest] = row.split(/[,;\t ]+/);
    const qty = q === undefined ? dec(1) : /^\d+(\.\d{1,4})?$/.test(q) ? dec(q) : null;
    if (!code || code.length > 40 || qty === null || rest.length || qty.isZero()) { skipped.push({ line: n + 1, text: row.slice(0, 60) }); return; }
    const t = totals.get(code);
    if (t) t.qty = t.qty.plus(qty);
    else totals.set(code, { qty, firstLine: n + 1 });
  });
  if (totals.size > 5000) throw badRequest("too_many_codes");
  let pieces = dec(0);
  let matched = 0;
  let extra = 0;
  const unknown: ScanImport["unknown"] = [];
  for (const [code, t] of totals) {
    try {
      const r = await scan(tx, id, { code, qty: t.qty.toString(), set: mode === "replace" });
      matched += 1;
      pieces = pieces.plus(t.qty);
      if (r.extra) extra += 1;
    } catch (e) {
      if ((e as { code?: string }).code === "unknown_barcode") unknown.push({ code, line: t.firstLine });
      else throw e;
    }
  }
  return { lines, codes: totals.size, pieces: pieces.toString(), matched, extra, unknown: unknown.slice(0, 100), skipped: skipped.slice(0, 100) } satisfies ScanImport;
}


/**
 * How well the books match the shelves over a period: for each approved or submitted count, the pieces and value short and in excess, and how
 * accurate the books were (share of expected pieces that were right). Items found short in more than one count in the period are listed apart,
 * since repeated shortage is where theft or a process fault hides.
 */
export async function stockAudit(tx: Tx, from: string, to: string) {
  if (to < from) throw badRequest("invalid_dates");
  const company = await resolveCompany(tx);
  const counts = [...await tx.execute<{ id: string; number: string; name: string; status: string; verify_only: boolean; date: string; store: string; expected: string; abs_diff: string; short_qty: string; excess_qty: string; short_value: string; excess_value: string }>(sql`
    select c.id, c.number, c.name, c.status, c.verify_only, (coalesce(c.approved_at, c.submitted_at, c.created_at) at time zone 'Asia/Kolkata')::date::text as date, w.name as store,
      coalesce(sum(l.expected), 0)::text as expected, coalesce(sum(abs(l.counted - l.expected)), 0)::text as abs_diff,
      coalesce(sum(case when l.counted < l.expected then l.expected - l.counted end), 0)::text as short_qty,
      coalesce(sum(case when l.counted > l.expected then l.counted - l.expected end), 0)::text as excess_qty,
      coalesce(sum(case when l.counted < l.expected then (l.expected - l.counted) * l.rate end), 0)::text as short_value,
      coalesce(sum(case when l.counted > l.expected then (l.counted - l.expected) * l.rate end), 0)::text as excess_value
    from stock_counts c join stock_count_lines l on l.count_id = c.id join warehouses w on w.id = c.warehouse_id
    where c.company_id = ${company.id} and c.status in ('submitted', 'approved') and (coalesce(c.approved_at, c.submitted_at, c.created_at) at time zone 'Asia/Kolkata')::date between ${from}::date and ${to}::date
    group by c.id, w.name order by date, c.number`)];
  const repeat = [...await tx.execute<{ name: string; counts: number; short_qty: string; short_value: string }>(sql`
    select i.name, count(distinct c.id)::int as counts, sum(l.expected - l.counted)::text as short_qty, sum((l.expected - l.counted) * l.rate)::text as short_value
    from stock_count_lines l join stock_counts c on c.id = l.count_id join items i on i.id = l.item_id
    where c.company_id = ${company.id} and c.status in ('submitted', 'approved') and (coalesce(c.approved_at, c.submitted_at, c.created_at) at time zone 'Asia/Kolkata')::date between ${from}::date and ${to}::date and l.counted < l.expected
    group by i.id, i.name having count(distinct c.id) > 1 order by sum((l.expected - l.counted) * l.rate) desc limit 50`)];
  const rows = counts.map((c) => ({
    countId: c.id, number: c.number, name: c.name, store: c.store, date: c.date, status: c.status, spotCheck: c.verify_only,
    expectedPieces: dec(c.expected).toFixed(0), shortPieces: dec(c.short_qty).toFixed(0), excessPieces: dec(c.excess_qty).toFixed(0),
    shortValue: money(c.short_value), excessValue: money(c.excess_value), netValue: money(dec(c.excess_value).minus(c.short_value)),
    accuracyPct: dec(c.expected).gt(0) ? dec(c.expected).minus(c.abs_diff).div(c.expected).times(100).toDecimalPlaces(1).toFixed(1) : null,
  }));
  return {
    from, to, counts: rows,
    totals: { shortValue: money(rows.reduce((t, r) => t.plus(r.shortValue), dec(0))), excessValue: money(rows.reduce((t, r) => t.plus(r.excessValue), dec(0))), netValue: money(rows.reduce((t, r) => t.plus(r.netValue), dec(0))) },
    repeatedShortages: repeat.map((r) => ({ item: r.name, counts: r.counts, shortPieces: dec(r.short_qty).toFixed(0), shortValue: money(r.short_value) })),
  };
}
