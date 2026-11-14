import { eq, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money, valueStock, type ValuationMethod } from "@varchasv/domain";
import { effectiveLedger } from "./inventory.js";
import { badRequest } from "../lib/errors.js";
import { profitAndLoss, resolveCompany } from "./accounting.js";

export const DIMENSIONS = ["style", "brand", "item", "size", "customer", "store", "channel"] as const;
export type Dimension = (typeof DIMENSIONS)[number];

/** How each figure was arrived at, so nobody mistakes an estimate for a booked number. */
export const BASIS = {
  grossSales: "direct", discounts: "direct", returns: "direct", netSales: "direct",
  costOfGoods: "estimated", grossMargin: "estimated", commission: "estimated", contribution: "estimated", overhead: "allocated", operatingProfit: "allocated",
} as const;

const GROUP: Record<Dimension, string> = {
  style: "coalesce(st.code || ' ' || st.name, i.name)", brand: "coalesce(st.brand, '-')", item: "i.name", size: "coalesce(i.size, '-')",
  customer: "coalesce(x.party, 'Counter customers')", store: "coalesce(x.store, '-')", channel: "x.channel",
};

const COSTED_SOURCES = new Set(["sales_invoice", "delivery_note", "credit_note", "pos_bill"]);

/** The cost per piece of each sale (and each return) for each item, from replaying the stock ledger. */
export async function actualUnitCosts(tx: Tx, company: { id: string; valuationMethod: string }) {
  const ledger = await effectiveLedger(tx, company.id);
  const groups = new Map<string, typeof ledger>();
  for (const r of ledger) {
    const k = `${r.itemId}|${r.warehouseId}`;
    const g = groups.get(k);
    if (g) g.push(r); else groups.set(k, [r]);
  }
  const per = new Map<string, { source_type: string; source_id: string; item_id: string; cost: ReturnType<typeof dec>; qty: ReturnType<typeof dec> }>();
  for (const g of groups.values()) {
    const v = valueStock(g.map((r) => ({ qtyIn: r.qtyIn, qtyOut: r.qtyOut, rate: r.rate })), company.valuationMethod as ValuationMethod);
    g.forEach((r, i) => {
      if (!COSTED_SOURCES.has(r.sourceType)) return;
      const q = dec(r.qtyOut).gt(0) ? dec(r.qtyOut) : dec(r.qtyIn);
      const key = `${r.sourceType}|${r.sourceId}|${r.itemId}`;
      const cur = per.get(key) ?? { source_type: r.sourceType, source_id: r.sourceId, item_id: r.itemId, cost: dec(0), qty: dec(0) };
      cur.cost = cur.cost.plus(dec(v.moves[i]!.valueChange).abs());
      cur.qty = cur.qty.plus(q);
      per.set(key, cur);
    });
  }
  return [...per.values()].filter((x) => x.qty.gt(0)).map((x) => ({ source_type: x.source_type, source_id: x.source_id, item_id: x.item_id, unit: x.cost.div(x.qty).toFixed(6) }));
}

/**
 * From gross sales to operating profit, in one column per figure. Sales, discounts and returns are read straight from the documents. Cost of goods uses each
 * item's standard cost (its purchase or making rate), commission uses the agent's rate on the invoice, and overhead is the period's operating expenses
 * spread by each row's share of net sales: those three are marked estimated or allocated. Freight and channel fees are not captured per sale yet.
 */
export async function profitability(tx: Tx, from: string, to: string, by: Dimension = "style", costing: "standard" | "actual" = "standard") {
  if (!(DIMENSIONS as readonly string[]).includes(by)) throw badRequest("invalid_dimension");
  const company = await resolveCompany(tx);
  const cid = company.id;
  // Stock values are not stored: the ledger is replayed with the company's valuation method, and each outgoing row's cost is read off the replay.
  const costJson = JSON.stringify(costing === "actual" ? await actualUnitCosts(tx, company) : []);
  const rows = await tx.execute<{ name: string; qty: string; gross: string; discount: string; returns: string; net: string; cogs: string; commission: string; costed: string }>(sql`
    with cost as (
      select source_type, source_id, item_id, unit from jsonb_to_recordset(${costJson}::jsonb) as c(source_type text, source_id uuid, item_id uuid, unit numeric)
    ), x as (
      select s.date, l.item_id, l.qty, l.taxable + l.discount as gross, l.discount, 0::numeric as ret, l.taxable as net, 'wholesale' as channel, br.name as store, s.customer_name as party, coalesce(s.agent_pct, 0) as agent_pct,
        case when l.delivery_line_id is not null then 'delivery_note' else 'sales_invoice' end as st,
        case when l.delivery_line_id is not null then (select dl.note_id from delivery_note_lines dl where dl.id = l.delivery_line_id) else s.id end as sid
      from sales_invoice_lines l join sales_invoices s on s.id = l.invoice_id left join branches br on br.id = s.branch_id
      where s.company_id = ${cid} and s.status <> 'cancelled' and s.date between ${from}::date and ${to}::date
      union all
      select n.date, l.item_id, -l.qty, 0, 0, l.taxable, -l.taxable, 'wholesale', br.name, s.customer_name, coalesce(s.agent_pct, 0), 'credit_note', n.id
      from credit_note_lines l join credit_notes n on n.id = l.note_id left join sales_invoices s on s.id = n.invoice_id left join branches br on br.id = s.branch_id
      where n.company_id = ${cid} and n.status <> 'cancelled' and n.date between ${from}::date and ${to}::date
      union all
      select b.date, l.item_id, l.qty, l.taxable + l.discount, l.discount, 0, l.taxable, case when b.source = 'device' then 'counterDevice' else 'counterWeb' end, w.name, null, 0, 'pos_bill', b.id
      from pos_bill_lines l join pos_bills b on b.id = l.bill_id join pos_terminals t on t.id = b.terminal_id join warehouses w on w.id = t.warehouse_id
      where b.company_id = ${cid} and b.status = 'paid' and b.date between ${from}::date and ${to}::date
      union all
      select b.date, l.item_id, -l.returned_qty, 0, 0, case when l.qty > 0 then l.taxable * l.returned_qty / l.qty else 0 end, -(case when l.qty > 0 then l.taxable * l.returned_qty / l.qty else 0 end),
        case when b.source = 'device' then 'counterDevice' else 'counterWeb' end, w.name, null, 0, null::text, null::uuid
      from pos_bill_lines l join pos_bills b on b.id = l.bill_id join pos_terminals t on t.id = b.terminal_id join warehouses w on w.id = t.warehouse_id
      where b.company_id = ${cid} and b.status = 'paid' and l.returned_qty > 0 and b.date between ${from}::date and ${to}::date
    )
    select ${sql.raw(GROUP[by])} as name,
      coalesce(sum(case when i.kind = 'goods' then x.qty else 0 end), 0)::text as qty,
      coalesce(sum(x.gross), 0)::text as gross, coalesce(sum(x.discount), 0)::text as discount, coalesce(sum(x.ret), 0)::text as returns, coalesce(sum(x.net), 0)::text as net,
      coalesce(sum(case when i.kind = 'goods' then x.qty * ${sql.raw(costing === "actual" ? "coalesce(c.unit, i.purchase_rate)" : "i.purchase_rate")} else 0 end), 0)::text as cogs,
      coalesce(sum(x.net * x.agent_pct / 100), 0)::text as commission,
      coalesce(sum(case when i.kind = 'goods' and c.unit is not null then x.net else 0 end), 0)::text as costed
    from x join items i on i.id = x.item_id left join styles st on st.id = i.style_id
      left join cost c on c.source_type = x.st and c.source_id = x.sid and c.item_id = x.item_id
    group by 1 order by sum(x.net) desc`);
  // Of the discounts, what customers paid for with loyalty points: the points redeemed on counter bills in the period at the current value of a point.
  const [pts] = await tx.execute<{ points: string }>(sql`select coalesce(sum(loyalty_redeemed), 0)::text as points from pos_bills where company_id = ${cid} and status = 'paid' and date between ${from}::date and ${to}::date`);
  const [setting] = await tx.select({ value: tables.posSettings.loyaltyPointValue }).from(tables.posSettings).where(eq(tables.posSettings.companyId, cid));
  const loyaltyFunded = money(dec(pts?.points ?? 0).times(setting?.value ?? "1"));
  const pl = await profitAndLoss(tx, cid, from, to);
  const overhead = pl.otherExpense.reduce((t, r) => t.plus(r.amount), dec(0));
  const list = [...rows];
  const totalNet = list.reduce((t, r) => t.plus(r.net), dec(0));
  const line = (r: { gross: string; discount: string; returns: string; net: string; cogs: string; commission: string }, oh: ReturnType<typeof dec>) => {
    const margin = dec(r.net).minus(r.cogs);
    const contribution = margin.minus(r.commission);
    return {
      grossSales: money(r.gross), discounts: money(r.discount), returns: money(r.returns), netSales: money(r.net), costOfGoods: money(r.cogs), grossMargin: money(margin),
      commission: money(r.commission), contribution: money(contribution), overhead: money(oh), operatingProfit: money(contribution.minus(oh)),
      marginPct: dec(r.net).gt(0) ? margin.div(r.net).times(100).toFixed(1) : null,
    };
  };
  const sum = (k: "gross" | "discount" | "returns" | "net" | "cogs" | "commission") => list.reduce((t, r) => t.plus(r[k]), dec(0)).toString();
  const costedAll = list.reduce((t, r) => t.plus(r.costed), dec(0));
  const coverage = (costed: string, net: string) => (dec(net).gt(0) ? Math.min(100, Number(dec(costed).div(net).times(100).toFixed(1))) : null);
  const coverageAll = coverage(costedAll.toString(), sum("net"));
  // Actual cost is read from the stock ledger (what the goods really cost when they left). It counts as booked only when all of the sales have it.
  const basis: Record<string, string> = { ...BASIS, costOfGoods: costing === "actual" && coverageAll !== null && coverageAll >= 99.9 ? "direct" : "estimated" };
  const total = line({ gross: sum("gross"), discount: sum("discount"), returns: sum("returns"), net: sum("net"), cogs: sum("cogs"), commission: sum("commission") }, overhead);
  return {
    from, to, by, costing, costCoverage: costing === "actual" ? coverageAll : null, basis, total, loyaltyFunded, notCaptured: ["freight", "channelFees", "wastage"],
    rows: list.slice(0, 200).map((r) => ({
      name: r.name, qty: dec(r.qty).toFixed(0), costCoverage: costing === "actual" ? coverage(r.costed, r.net) : null,
      ...line(r, totalNet.gt(0) ? overhead.times(r.net).div(totalNet) : dec(0)),
    })),
  };
}
