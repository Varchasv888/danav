import { and, asc, eq, inArray, isNull } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { resolveCompany } from "./accounting.js";
import { AGE_BUCKETS, saleLines } from "./insights.js";
import { stockPositions } from "./inventory.js";

const dayNo = (iso: string) => Date.parse(`${iso}T00:00:00Z`) / 86_400_000;

/** Stores that hold our own stock for sale (not goods lying with a job worker or a consignee). */
async function ownStores(tx: Tx, companyId: string) {
  const rows = await tx.select({ id: tables.warehouses.id }).from(tables.warehouses)
    .where(and(eq(tables.warehouses.companyId, companyId), isNull(tables.warehouses.jobWorkerId), isNull(tables.warehouses.consigneeId)));
  return new Set(rows.map((r) => r.id));
}

export interface MatrixQuery {
  type: "stock" | "sales"; asOf: string; from: string; to: string; warehouseId?: string | undefined;
  brand?: string | undefined; category?: string | undefined; season?: string | undefined; q?: string | undefined;
}

/**
 * The colour-size matrix: for each design, a row per colour (with its photo) and a column per size, with
 * stock as of a date or pieces sold in a period, and totals both ways.
 */
export async function colourSizeMatrix(tx: Tx, query: MatrixQuery) {
  const company = await resolveCompany(tx);
  const styles = (await tx.select().from(tables.styles).where(and(eq(tables.styles.companyId, company.id), eq(tables.styles.archived, false))).orderBy(asc(tables.styles.code)))
    .filter((s) => (!query.brand || s.brand === query.brand) && (!query.category || s.category === query.category) && (!query.season || s.season === query.season)
      && (!query.q || `${s.code} ${s.name}`.toLowerCase().includes(query.q.toLowerCase())));
  if (!styles.length) return { type: query.type, groups: [], total: "0", brands: [], categories: [], seasons: [] };
  const variants = await tx.select().from(tables.items)
    .where(and(inArray(tables.items.styleId, styles.map((s) => s.id)), eq(tables.items.isPack, false))).orderBy(asc(tables.items.sizeOrder));
  const qty = new Map<string, number>();
  if (query.type === "stock") {
    const own = await ownStores(tx, company.id);
    for (const p of await stockPositions(tx, company, query.asOf, { itemIds: variants.map((v) => v.id), ...(query.warehouseId ? { warehouseId: query.warehouseId } : {}) })) {
      if (!query.warehouseId && !own.has(p.warehouseId)) continue;
      qty.set(p.itemId, (qty.get(p.itemId) ?? 0) + Number(p.qty));
    }
  } else {
    const rows = await tx.execute<{ item_id: string; qty: string }>(sql`
      with x as (${saleLines(company.id, query.from, query.to)}) select item_id, sum(qty)::text as qty from x group by item_id`);
    for (const r of rows) qty.set(r.item_id, Number(r.qty));
  }
  const images = await tx.select().from(tables.styleImages)
    .where(and(inArray(tables.styleImages.styleId, styles.map((s) => s.id)), eq(tables.styleImages.archived, false))).orderBy(asc(tables.styleImages.sortOrder));
  const hex = new Map((await tx.select().from(tables.colors).where(eq(tables.colors.companyId, company.id))).map((c) => [c.name.toLowerCase(), c.hex]));
  let grand = 0;
  const groups = styles.map((s) => {
    const vs = variants.filter((v) => v.styleId === s.id);
    const sizes = [...new Map(vs.map((v) => [v.size ?? "", v.sizeOrder])).entries()].sort((a, b) => a[1] - b[1]).map(([k]) => k);
    const colors = [...new Set(vs.map((v) => v.color ?? ""))];
    const rows = colors.map((c) => {
      const cells: Record<string, number> = {};
      for (const v of vs.filter((x) => (x.color ?? "") === c)) cells[v.size ?? ""] = (cells[v.size ?? ""] ?? 0) + (qty.get(v.id) ?? 0);
      const img = images.find((i) => i.styleId === s.id && i.color === c) ?? images.find((i) => i.styleId === s.id && i.color === null);
      return { color: c, hex: hex.get(c.toLowerCase()) ?? null, thumbFileId: img?.thumbFileId ?? null, fileId: img?.fileId ?? null, cells, total: Object.values(cells).reduce((a, b) => a + b, 0) };
    }).filter((r) => r.total !== 0);
    const sizeTotals = Object.fromEntries(sizes.map((z) => [z, rows.reduce((t, r) => t + (r.cells[z] ?? 0), 0)]));
    const total = rows.reduce((t, r) => t + r.total, 0);
    grand += total;
    return { styleId: s.id, code: s.code, name: s.name, brand: s.brand, category: s.category, mrp: s.mrp, sizes, rows, sizeTotals, total };
  }).filter((g) => g.rows.length);
  const all = await tx.select({ brand: tables.styles.brand, category: tables.styles.category, season: tables.styles.season }).from(tables.styles).where(eq(tables.styles.companyId, company.id));
  const uniq = (xs: (string | null)[]) => [...new Set(xs.filter((x): x is string => !!x))].sort();
  return { type: query.type, groups, total: String(grand), brands: uniq(all.map((x) => x.brand)), categories: uniq(all.map((x) => x.category)), seasons: uniq(all.map((x) => x.season)) };
}

/**
 * Stock ageing as of a date, first in first out: what is left of each receipt, by how long it has been in
 * stock, valued at the item's stock rate; and dead stock, goods with no sale for the given number of days.
 */
export async function stockAgeing(tx: Tx, asOf: string, deadDays: number, all = false) {
  const company = await resolveCompany(tx);
  const moves = await tx.execute<{ item_id: string; date: string; net: string }>(sql`
    select l.item_id, l.date::text as date, sum(l.qty_in - l.qty_out)::text as net
    from stock_ledger l join items i on i.id = l.item_id
    where l.company_id = ${company.id} and l.date <= ${asOf}::date and i.kind = 'goods' and not i.is_pack
      -- Garments by default: fabric and trims are used up in production, so they are never 'unsold'.
      and (${all} or i.style_id is not null)
    group by l.item_id, l.date, l.source_type, l.source_id having sum(l.qty_in - l.qty_out) <> 0
    order by l.item_id, l.date, sum(l.qty_in - l.qty_out) desc`);
  const lastSale = new Map([...await tx.execute<{ item_id: string; d: string }>(sql`
    select item_id, max(date)::text as d from stock_ledger
    where company_id = ${company.id} and date <= ${asOf}::date and qty_out > 0 and source_type in ('sales_invoice', 'pos_bill')
    group by item_id`)].map((r) => [r.item_id, r.d]));
  const positions = await stockPositions(tx, company, asOf);
  const rate = new Map<string, { qty: number; value: number }>();
  for (const p of positions) {
    const r = rate.get(p.itemId) ?? { qty: 0, value: 0 };
    r.qty += Number(p.qty);
    r.value += Number(p.value);
    rate.set(p.itemId, r);
  }
  const lots = new Map<string, { day: number; qty: number }[]>();
  for (const m of moves) {
    const list = lots.get(m.item_id) ?? [];
    lots.set(m.item_id, list);
    let net = Number(m.net);
    if (net > 0) { list.push({ day: dayNo(m.date), qty: net }); continue; }
    net = -net;
    while (net > 1e-9 && list.length) {
      const take = Math.min(list[0]!.qty, net);
      list[0]!.qty -= take;
      net -= take;
      if (list[0]!.qty <= 1e-9) list.shift();
    }
  }
  const ids = [...lots.keys()].filter((k) => lots.get(k)!.some((l) => l.qty > 1e-9));
  const items = ids.length ? await tx.select({ i: tables.items, style: tables.styles }).from(tables.items).leftJoin(tables.styles, eq(tables.styles.id, tables.items.styleId)).where(inArray(tables.items.id, ids)) : [];
  const today = dayNo(asOf);
  const totals = AGE_BUCKETS.map((b) => ({ key: b.key, qty: 0, value: 0 }));
  const bucketOf = (age: number) => AGE_BUCKETS.findIndex((b) => b.upTo === null || age <= b.upTo);
  const rows = items.map(({ i, style }) => {
    const left = lots.get(i.id)!.filter((l) => l.qty > 1e-9);
    const q = left.reduce((t, l) => t + l.qty, 0);
    const r = rate.get(i.id);
    const unit = r && r.qty > 0 ? r.value / r.qty : Number(i.purchaseRate);
    const buckets = AGE_BUCKETS.map(() => 0);
    for (const l of left) buckets[bucketOf(today - l.day)]! += l.qty;
    buckets.forEach((b, k) => { totals[k]!.qty += b; totals[k]!.value += b * unit; });
    const sold = lastSale.get(i.id) ?? null;
    const idle = sold ? today - dayNo(sold) : today - Math.min(...left.map((l) => l.day));
    return {
      itemId: i.id, name: i.name, styleId: i.styleId, design: style?.code ?? null, brand: style?.brand ?? null, color: i.color, size: i.size,
      qty: q.toFixed(0), value: money(q * unit), buckets: buckets.map((b) => b.toFixed(0)),
      oldestDays: today - Math.min(...left.map((l) => l.day)), lastSold: sold, idleDays: idle, dead: idle > deadDays,
    };
  }).filter((r) => Number(r.qty) > 0).sort((a, b) => Number(b.value) * b.oldestDays - Number(a.value) * a.oldestDays);
  const dead = rows.filter((r) => r.dead);
  return {
    asOf, deadDays, all,
    buckets: totals.map((b) => ({ key: b.key, qty: b.qty.toFixed(0), value: money(b.value) })),
    total: { qty: rows.reduce((t, r) => t + Number(r.qty), 0).toFixed(0), value: money(rows.reduce((t, r) => t + Number(r.value), 0)) },
    dead: { items: dead.length, qty: dead.reduce((t, r) => t + Number(r.qty), 0).toFixed(0), value: money(dead.reduce((t, r) => t + Number(r.value), 0)) },
    rows: rows.slice(0, 500),
  };
}

/**
 * The sales register for a period: every invoice and counter bill (and their returns, as minus rows) with
 * pieces, gross, discount, taxable value, GST, total and how it was paid.
 */
export async function salesRegister(tx: Tx, from: string, to: string) {
  const company = await resolveCompany(tx);
  const id = company.id;
  const rows = await tx.execute<{
    kind: string; doc_id: string; number: string; date: string; party: string | null; pieces: string; gross: string; discount: string;
    taxable: string; tax: string; total: string; cash: string; upi: string; card: string; credit: string; status: string;
  }>(sql`
    select 'invoice' as kind, s.id as doc_id, s.number, s.date::text, s.customer_name as party,
      coalesce((select sum(l.qty) from sales_invoice_lines l join items i on i.id = l.item_id where l.invoice_id = s.id and i.kind = 'goods'), 0)::text as pieces,
      coalesce((select sum(l.qty * l.rate) from sales_invoice_lines l where l.invoice_id = s.id), 0)::text as gross,
      coalesce((select sum(l.discount) from sales_invoice_lines l where l.invoice_id = s.id), 0)::text as discount,
      s.taxable::text, (s.cgst + s.sgst + s.utgst + s.igst + s.cess)::text as tax, s.total::text,
      '0' as cash, '0' as upi, '0' as card, s.total::text as credit, s.status
    from sales_invoices s where s.company_id = ${id} and s.date between ${from}::date and ${to}::date
    union all
    select 'bill', b.id, b.number, b.date::text, coalesce(b.customer_name, b.customer_phone),
      coalesce((select sum(l.qty) from pos_bill_lines l where l.bill_id = b.id), 0)::text,
      coalesce((select sum(l.qty * l.price) from pos_bill_lines l where l.bill_id = b.id), 0)::text,
      b.discount::text, b.taxable::text, (b.cgst + b.sgst + b.cess)::text, b.total::text,
      (coalesce((select sum((p->>'amount')::numeric) from jsonb_array_elements(b.payments) p where p->>'mode' = 'cash'), 0) - b.change)::text,
      coalesce((select sum((p->>'amount')::numeric) from jsonb_array_elements(b.payments) p where p->>'mode' = 'upi'), 0)::text,
      coalesce((select sum((p->>'amount')::numeric) from jsonb_array_elements(b.payments) p where p->>'mode' = 'card'), 0)::text,
      coalesce((select sum((p->>'amount')::numeric) from jsonb_array_elements(b.payments) p where p->>'mode' = 'credit'), 0)::text,
      b.status
    from pos_bills b where b.company_id = ${id} and b.date between ${from}::date and ${to}::date
    union all
    select 'credit_note', n.id, n.number, n.date::text, s.customer_name,
      (-coalesce((select sum(l.qty) from credit_note_lines l where l.note_id = n.id), 0))::text, (-n.taxable)::text, '0',
      (-n.taxable)::text, (-(n.cgst + n.sgst + n.utgst + n.igst + n.cess))::text, (-n.total)::text, '0', '0', '0', (-n.total)::text, n.status
    from credit_notes n left join sales_invoices s on s.id = n.invoice_id where n.company_id = ${id} and n.date between ${from}::date and ${to}::date
    union all
    select 'counter_return', r.id, r.number, r.date::text, coalesce(b.customer_name, b.customer_phone),
      (-coalesce((select sum((x->>'qty')::numeric) from jsonb_array_elements(r.lines) x), 0))::text, (-r.taxable)::text, '0',
      (-r.taxable)::text, (-(r.cgst + r.sgst + r.cess))::text, (-r.total)::text,
      case when r.refund_mode = 'cash' then (-r.total)::text else '0' end, case when r.refund_mode = 'upi' then (-r.total)::text else '0' end,
      case when r.refund_mode = 'card' then (-r.total)::text else '0' end, '0', 'paid'
    from pos_returns r join pos_bills b on b.id = r.bill_id where r.company_id = ${id} and r.date between ${from}::date and ${to}::date
    order by 4, 3`);
  const live = [...rows].filter((r) => r.status !== "cancelled" && r.status !== "void");
  const sum = (k: "pieces" | "gross" | "discount" | "taxable" | "tax" | "total" | "cash" | "upi" | "card" | "credit") => money(live.reduce((t, r) => t.plus(r[k] ?? 0), dec(0)));
  return {
    from, to,
    rows: [...rows].map((r) => ({
      kind: r.kind, id: r.doc_id, number: r.number, date: r.date, party: r.party, pieces: dec(r.pieces).toFixed(0), gross: money(r.gross), discount: money(r.discount),
      taxable: money(r.taxable), tax: money(r.tax), total: money(r.total), cash: money(r.cash), upi: money(r.upi), card: money(r.card), credit: money(r.credit),
      cancelled: r.status === "cancelled" || r.status === "void",
    })),
    totals: { count: live.length, pieces: dec(sum("pieces")).toFixed(0), gross: sum("gross"), discount: sum("discount"), taxable: sum("taxable"), tax: sum("tax"), total: sum("total"), cash: sum("cash"), upi: sum("upi"), card: sum("card"), credit: sum("credit") },
  };
}
