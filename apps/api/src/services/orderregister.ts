import { sql } from "drizzle-orm";
import type { Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { resolveCompany } from "./accounting.js";

/**
 * Sales orders still to be fulfilled: for each open order what was ordered, what has gone out (the larger of delivered and
 * invoiced, since an order can be served either way), what is pending and its value, and whether the promised date has passed.
 */
export async function salesOrderRegister(tx: Tx, asOf: string) {
  const company = await resolveCompany(tx);
  const rows = await tx.execute<{ id: string; number: string; date: string; deliver_by: string | null; status: string; customer: string; ordered: string; served: string; pending: string; pending_value: string }>(sql`
    select o.id::text, o.number, o.date::text, o.deliver_by::text, o.status, a.name as customer,
      sum(l.qty)::text as ordered, sum(greatest(l.delivered_qty, l.invoiced_qty))::text as served,
      sum(greatest(l.qty - greatest(l.delivered_qty, l.invoiced_qty), 0))::text as pending,
      sum(greatest(l.qty - greatest(l.delivered_qty, l.invoiced_qty), 0) * l.rate)::text as pending_value
    from sales_orders o join sales_order_lines l on l.order_id = o.id join accounts a on a.id = o.customer_id
    where o.company_id = ${company.id} and o.status in ('open', 'partial') and o.date <= ${asOf}::date
    group by o.id, o.number, o.date, o.deliver_by, o.status, a.name
    having sum(greatest(l.qty - greatest(l.delivered_qty, l.invoiced_qty), 0)) > 0
    order by (o.deliver_by is null), o.deliver_by, o.date`);
  const orders = [...rows].map((r) => ({
    id: r.id, number: r.number, date: r.date, deliverBy: r.deliver_by, status: r.status, customer: r.customer,
    ordered: dec(r.ordered).toFixed(0), served: dec(r.served).toFixed(0), pending: dec(r.pending).toFixed(0), pendingValue: money(r.pending_value),
    overdue: !!r.deliver_by && r.deliver_by < asOf,
  }));
  return {
    asOf, orders, count: orders.length, overdue: orders.filter((o) => o.overdue).length,
    pendingPieces: orders.reduce((s, o) => s + Number(o.pending), 0), pendingValue: money(orders.reduce((s, o) => s.plus(o.pendingValue), dec(0))),
  };
}
