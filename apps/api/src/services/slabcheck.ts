import { sql } from "drizzle-orm";
import type { Tx } from "@varchasv/db";
import { dec, isGstSlab, money, slabRate } from "@varchasv/domain";
import { badRequest } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";

/**
 * Garments and footwear pay GST by the value of each piece. This lists the sales (invoices and counter bills) where the rate charged on a
 * line is not the rate its piece value calls for on that day, with the tax that is over or under. The test is on the value after discount and
 * before tax. Nothing is changed; each line listed is one to correct before the return is filed.
 */
export async function slabExceptions(tx: Tx, from: string, to: string) {
  if (to < from) throw badRequest("invalid_dates");
  const company = await resolveCompany(tx);
  const rows = [...await tx.execute<{ kind: string; id: string; number: string; date: string; item: string; slab: string; pieces: number; qty: string; taxable: string; rate: string }>(sql`
    select 'invoice' as kind, s.id, s.number, s.date::text, i.name as item, i.gst_slab as slab, i.slab_pieces as pieces, l.qty::text, l.taxable::text, l.gst_rate::text as rate
    from sales_invoice_lines l join sales_invoices s on s.id = l.invoice_id join items i on i.id = l.item_id
    where s.company_id = ${company.id} and s.status = 'posted' and i.gst_slab is not null and s.date between ${from}::date and ${to}::date
    union all
    select 'counter', b.id, b.number, b.date::text, i.name, i.gst_slab, i.slab_pieces, l.qty::text, l.taxable::text, l.gst_rate::text
    from pos_bill_lines l join pos_bills b on b.id = l.bill_id join items i on i.id = l.item_id
    where b.company_id = ${company.id} and b.status = 'paid' and i.gst_slab is not null and b.date between ${from}::date and ${to}::date
    order by 4, 3`)];
  const out: { kind: string; id: string; number: string; date: string; item: string; pieceValue: string; charged: string; expected: string; taxDifference: string }[] = [];
  for (const r of rows) {
    if (!isGstSlab(r.slab) || !dec(r.qty).gt(0)) continue;
    // The value of one piece (a set sold as one counts as its pieces), after discount and before tax.
    const piece = dec(r.taxable).div(dec(r.qty).times(r.pieces || 1));
    const expected = slabRate(r.slab, r.date, piece);
    if (dec(expected).eq(r.rate)) continue;
    out.push({ kind: r.kind, id: r.id, number: r.number, date: r.date, item: r.item, pieceValue: money(piece), charged: dec(r.rate).toFixed(2), expected: dec(expected).toFixed(2), taxDifference: money(dec(r.taxable).times(dec(r.rate).minus(expected)).div(100)) });
  }
  return {
    from, to, checked: rows.length, exceptions: out.length,
    overCharged: money(out.reduce((t, r) => (dec(r.taxDifference).gt(0) ? t.plus(r.taxDifference) : t), dec(0))),
    underCharged: money(out.reduce((t, r) => (dec(r.taxDifference).lt(0) ? t.plus(dec(r.taxDifference).neg()) : t), dec(0))),
    rows: out.slice(0, 300),
  };
}
