import { and, eq, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { businessDate, dec } from "@varchasv/domain";
import { badRequest } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { postStockJournal, stockPositions } from "./inventory.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

export interface ResetScope { brand?: string | undefined; category?: string | undefined; styleId?: string | undefined; all?: boolean | undefined }

/**
 * Brings the books' stock of a store (or of one brand, category or design in it) to zero with one stock adjustment, for when the shelves are
 * to be counted from scratch or a store is closed. What was held (and what was negative) is on the journal with the reason, so nothing is lost.
 */
export async function resetPhysicalStock(tx: Tx, actor: Actor, input: { warehouseId: string; scope: ResetScope; reason: string; date?: string | undefined }) {
  const company = await resolveCompany(tx);
  const s = input.scope;
  if (!s.all && !s.brand && !s.category && !s.styleId) throw badRequest("scope_required");
  const [w] = await tx.select({ id: tables.warehouses.id, companyId: tables.warehouses.companyId }).from(tables.warehouses).where(eq(tables.warehouses.id, input.warehouseId));
  if (!w || w.companyId !== company.id) throw badRequest("unknown_warehouse");
  const items = await tx.select({ id: tables.items.id }).from(tables.items).leftJoin(tables.styles, eq(tables.styles.id, tables.items.styleId))
    .where(and(eq(tables.items.companyId, company.id), eq(tables.items.kind, "goods"),
      s.brand ? eq(tables.styles.brand, s.brand) : undefined, s.category ? eq(tables.styles.category, s.category) : undefined, s.styleId ? eq(tables.items.styleId, s.styleId) : undefined));
  if (!items.length) throw badRequest("nothing_to_reset");
  const date = input.date ?? businessDate();
  const positions = await stockPositions(tx, company, date, { warehouseId: w.id, itemIds: items.map((i) => i.id) });
  const lines = positions.filter((p) => !dec(p.qty).isZero()).map((p) => (dec(p.qty).gt(0)
    ? { itemId: p.itemId, warehouseId: w.id, qty: dec(p.qty).toFixed(4), direction: "out" as const }
    : { itemId: p.itemId, warehouseId: w.id, qty: dec(p.qty).neg().toFixed(4), direction: "in" as const, ...(dec(p.rate).gt(0) ? { rate: dec(p.rate).toFixed(4) } : {}) }));
  if (!lines.length) return { items: 0, journalId: null as string | null, pieces: "0" };
  const { journal } = await postStockJournal(tx, actor, { companyId: company.id, kind: "adjustment", date, narration: `Stock reset: ${input.reason.trim()}`, lines });
  const pieces = positions.reduce((t, p) => t.plus(dec(p.qty).abs()), dec(0));
  return { items: lines.length, journalId: journal.id, pieces: pieces.toFixed(0) };
}


/**
 * Documents whose stock movement does not match their lines: a posted sales invoice or counter bill should have taken out exactly its pieces
 * (net of any reversal). Nothing is changed; each one listed is a document to look at, and a missing movement can be put right by a stock adjustment.
 */
export async function stockPostingCheck(tx: Tx) {
  const company = await resolveCompany(tx);
  const rows = [...await tx.execute<{ kind: string; id: string; number: string; date: string; expected: string; moved: string }>(sql`
    select 'sales_invoice' as kind, s.id, s.number, s.date::text, coalesce(sum(l.qty) filter (where i.kind = 'goods'), 0)::text as expected,
      coalesce((select sum(m.qty_out - m.qty_in) from stock_ledger m where m.source_type = 'sales_invoice' and m.source_id = s.id), 0)::text as moved
    from sales_invoices s join sales_invoice_lines l on l.invoice_id = s.id join items i on i.id = l.item_id
    where s.company_id = ${company.id} and s.status = 'posted' and not exists (select 1 from sales_invoice_lines x where x.invoice_id = s.id and x.delivery_line_id is not null)
    group by s.id
    union all
    select 'pos_bill', b.id, b.number, b.date::text, coalesce(sum(l.qty) filter (where i.kind = 'goods'), 0)::text,
      coalesce((select sum(m.qty_out - m.qty_in) from stock_ledger m where m.source_type = 'pos_bill' and m.source_id = b.id), 0)::text
    from pos_bills b join pos_bill_lines l on l.bill_id = b.id join items i on i.id = l.item_id
    where b.company_id = ${company.id} and b.status = 'paid' group by b.id`)];
  const off = rows.filter((r) => !dec(r.expected).eq(r.moved));
  return { checked: rows.length, differing: off.length, documents: off.slice(0, 200).map((r) => ({ kind: r.kind, id: r.id, number: r.number, date: r.date, expected: dec(r.expected).toFixed(0), moved: dec(r.moved).toFixed(0) })) };
}
