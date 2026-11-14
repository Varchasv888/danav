import { sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { eq, inArray } from "drizzle-orm";
import { resolveCompany } from "./accounting.js";
import { stockPositions } from "./inventory.js";

export type MovementClass = "fast" | "slow" | "none";

export interface MovementBands {
  /** Days looked back from the report date. */
  days: number;
  /** Pieces sold in those days from which an item counts as fast moving. */
  fastMin: number;
}

const dayNo = (iso: string) => Math.floor(Date.parse(`${iso}T00:00:00Z`) / 86_400_000);

/**
 * Which stock sells and which sits. For every item with stock in hand: pieces sold in the last `days` (sales
 * invoices and counter bills, less what came back), the day it last sold, and a class: fast (at least `fastMin`
 * sold), slow (some sold, fewer) or non-moving (none). Non-moving stock comes first, largest value first, since
 * that is what needs a decision. Garments by default; fabric and trims are used up in production, so `all` adds them.
 */
export async function stockMovement(tx: Tx, asOf: string, bands: MovementBands, all = false) {
  const company = await resolveCompany(tx);
  const from = new Date((dayNo(asOf) - bands.days + 1) * 86_400_000).toISOString().slice(0, 10);
  const moves = await tx.execute<{ item_id: string; sold: string; last_sold: string | null }>(sql`
    select l.item_id,
      coalesce(sum(case when l.source_type in ('sales_invoice', 'pos_bill') and l.date >= ${from}::date then l.qty_out
                        when l.source_type in ('credit_note', 'pos_return') and l.date >= ${from}::date then -l.qty_in else 0 end), 0)::text as sold,
      max(case when l.source_type in ('sales_invoice', 'pos_bill') and l.qty_out > 0 then l.date end)::text as last_sold
    from stock_ledger l join items i on i.id = l.item_id
    where l.company_id = ${company.id} and l.date <= ${asOf}::date and i.kind = 'goods' and not i.is_pack and not i.archived
      and (${all} or i.style_id is not null)
    group by l.item_id`);
  const sold = new Map([...moves].map((m) => [m.item_id, m]));
  const stock = new Map<string, { qty: ReturnType<typeof dec>; value: ReturnType<typeof dec> }>();
  for (const p of await stockPositions(tx, company, asOf)) {
    const s = stock.get(p.itemId) ?? { qty: dec(0), value: dec(0) };
    s.qty = s.qty.plus(p.qty);
    s.value = s.value.plus(p.value);
    stock.set(p.itemId, s);
  }
  const ids = [...stock.entries()].filter(([id, s]) => s.qty.gt(0) && sold.has(id)).map(([id]) => id);
  const items = ids.length
    ? await tx.select({ id: tables.items.id, name: tables.items.name, sku: tables.items.sku, styleCode: tables.styles.code }).from(tables.items)
      .leftJoin(tables.styles, eq(tables.styles.id, tables.items.styleId)).where(inArray(tables.items.id, ids))
    : [];
  const rows = items.map((i) => {
    const s = stock.get(i.id)!;
    const m = sold.get(i.id)!;
    const net = dec(m.sold);
    const cls: MovementClass = net.gte(bands.fastMin) ? "fast" : net.gt(0) ? "slow" : "none";
    return {
      itemId: i.id, name: i.name, sku: i.sku, styleCode: i.styleCode, stockQty: s.qty.toString(), stockValue: money(s.value),
      soldQty: net.lt(0) ? "0" : net.toString(), lastSold: m.last_sold, daysSinceSale: m.last_sold ? dayNo(asOf) - dayNo(m.last_sold) : null, class: cls,
    };
  });
  const order: Record<MovementClass, number> = { none: 0, slow: 1, fast: 2 };
  rows.sort((a, b) => order[a.class] - order[b.class] || Number(b.stockValue) - Number(a.stockValue));
  const summary = (["fast", "slow", "none"] as const).map((c) => {
    const rs = rows.filter((r) => r.class === c);
    return { class: c, items: rs.length, pieces: rs.reduce((t, r) => t.plus(r.stockQty), dec(0)).toString(), value: money(rs.reduce((t, r) => t.plus(r.stockValue), dec(0))) };
  });
  return { asOf, from, ...bands, summary, rows: rows.slice(0, 500), truncated: rows.length > 500 };
}
