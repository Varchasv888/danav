import { sql } from "drizzle-orm";
import type { Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { resolveCompany } from "./accounting.js";

/**
 * Discounts given in a period, line by line: on tax invoices and on counter bills. Gross is quantity times rate (or price), so
 * the percentage is what the customer was actually offered. Cancelled documents are left out.
 */
export async function discountRegister(tx: Tx, from: string, to: string) {
  const company = await resolveCompany(tx);
  const cid = company.id;
  const rows = await tx.execute<{ date: string; number: string; channel: string; party: string | null; item: string; qty: string; gross: string; discount: string }>(sql`
    select s.date::text, s.number, 'invoice' as channel, s.customer_name as party, i.name as item, l.qty::text,
      (l.qty * l.rate)::text as gross, l.discount::text
    from sales_invoice_lines l join sales_invoices s on s.id = l.invoice_id join items i on i.id = l.item_id
    where s.company_id = ${cid} and s.status <> 'cancelled' and l.discount > 0 and s.date between ${from}::date and ${to}::date
    union all
    select b.date::text, b.number, 'counter', b.customer_name, i.name, l.qty::text, (l.qty * l.price)::text, l.discount::text
    from pos_bill_lines l join pos_bills b on b.id = l.bill_id join items i on i.id = l.item_id
    where b.company_id = ${cid} and b.status = 'paid' and l.discount > 0 and b.date between ${from}::date and ${to}::date
    order by 1 desc, 2 desc`);
  const lines = [...rows].map((r) => ({
    date: r.date, number: r.number, channel: r.channel, party: r.party, item: r.item, qty: dec(r.qty).toFixed(0), gross: money(r.gross), discount: money(r.discount),
    pct: dec(r.gross).gt(0) ? dec(r.discount).div(r.gross).times(100).toFixed(1) : "0.0",
  }));
  const gross = lines.reduce((s, l) => s.plus(l.gross), dec(0));
  const discount = lines.reduce((s, l) => s.plus(l.discount), dec(0));
  const byItem = new Map<string, { item: string; discount: ReturnType<typeof dec>; gross: ReturnType<typeof dec> }>();
  for (const l of lines) {
    const e = byItem.get(l.item) ?? { item: l.item, discount: dec(0), gross: dec(0) };
    e.discount = e.discount.plus(l.discount);
    e.gross = e.gross.plus(l.gross);
    byItem.set(l.item, e);
  }
  return {
    from, to, lines: lines.slice(0, 500), truncated: lines.length > 500, count: lines.length,
    totalGross: money(gross), totalDiscount: money(discount), averagePct: gross.gt(0) ? discount.div(gross).times(100).toFixed(1) : "0.0",
    byItem: [...byItem.values()].sort((a, b) => b.discount.comparedTo(a.discount)).slice(0, 20).map((e) => ({ item: e.item, discount: money(e.discount), gross: money(e.gross), pct: e.gross.gt(0) ? e.discount.div(e.gross).times(100).toFixed(1) : "0.0" })),
  };
}
