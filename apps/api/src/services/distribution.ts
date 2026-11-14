import { eq, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { businessDate, dec, money } from "@varchasv/domain";
import { badRequest } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { stockPositions } from "./inventory.js";
import { dispatchTransfer } from "./transfers.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

const dayNo = (iso: string) => Math.floor(Date.parse(`${iso}T00:00:00Z`) / 86_400_000);
const pct = (a: ReturnType<typeof dec>, b: ReturnType<typeof dec>) => (b.gt(0) ? a.div(b).times(100).toFixed(1) : null);

/** Warehouses that are stores or godowns of the business itself: not in transit, not on hold, not with a job worker or a consignee. */
async function ownStores(tx: Tx, companyId: string) {
  return tx.select({ id: tables.warehouses.id, name: tables.warehouses.name, branchId: tables.warehouses.branchId }).from(tables.warehouses)
    .where(sql`${tables.warehouses.companyId} = ${companyId} and not ${tables.warehouses.archived} and not ${tables.warehouses.inTransit} and not ${tables.warehouses.qualityHold}
      and ${tables.warehouses.jobWorkerId} is null and ${tables.warehouses.consigneeId} is null`);
}

/** Pieces and value sold per warehouse in a period, net of returns, from invoices (by the warehouse on the line) and counter bills (by the terminal's warehouse). */
function salesByWarehouse(companyId: string, from: string, to: string) {
  return sql`
    select l.warehouse_id, l.item_id, l.qty as qty, l.taxable as amount, s.id as doc
    from sales_invoice_lines l join sales_invoices s on s.id = l.invoice_id
    where s.company_id = ${companyId} and s.status <> 'cancelled' and l.warehouse_id is not null and s.date between ${from}::date and ${to}::date
    union all
    select t.warehouse_id, l.item_id, l.qty - l.returned_qty, case when l.qty > 0 then l.taxable * (l.qty - l.returned_qty) / l.qty else 0 end, b.id
    from pos_bill_lines l join pos_bills b on b.id = l.bill_id join pos_terminals t on t.id = b.terminal_id
    where b.company_id = ${companyId} and b.status = 'paid' and b.date between ${from}::date and ${to}::date`;
}

/**
 * Head office and each branch side by side: sales, pieces, bills, average bill, stock held and value, and the days that stock would last at the
 * pace of the period. The share columns show how the business splits between its places.
 */
export async function branchComparison(tx: Tx, from: string, to: string) {
  if (to < from) throw badRequest("invalid_dates");
  const company = await resolveCompany(tx);
  const days = Math.max(1, dayNo(to) - dayNo(from) + 1);
  const stores = await ownStores(tx, company.id);
  const branches = await tx.select({ id: tables.branches.id, name: tables.branches.name, head: tables.branches.isHeadOffice }).from(tables.branches).where(eq(tables.branches.companyId, company.id));
  const sold = [...await tx.execute<{ warehouse_id: string; pieces: string; amount: string; bills: number }>(sql`
    with x as (${salesByWarehouse(company.id, from, to)})
    select x.warehouse_id, coalesce(sum(case when i.kind = 'goods' then x.qty else 0 end), 0)::text as pieces, coalesce(sum(x.amount), 0)::text as amount, count(distinct x.doc)::int as bills
    from x join items i on i.id = x.item_id group by x.warehouse_id`)];
  const positions = await stockPositions(tx, company, to);
  const stock = new Map<string, { qty: ReturnType<typeof dec>; value: ReturnType<typeof dec> }>();
  for (const p of positions) {
    const s = stock.get(p.warehouseId) ?? { qty: dec(0), value: dec(0) };
    s.qty = s.qty.plus(p.qty); s.value = s.value.plus(dec(p.qty).times(p.rate));
    stock.set(p.warehouseId, s);
  }
  const rows = stores.map((w) => {
    const s = sold.find((x) => x.warehouse_id === w.id);
    const st = stock.get(w.id) ?? { qty: dec(0), value: dec(0) };
    const amount = dec(s?.amount ?? 0), pieces = dec(s?.pieces ?? 0);
    const b = branches.find((x) => x.id === w.branchId);
    return {
      warehouseId: w.id, store: w.name, branch: b?.name ?? null, headOffice: !!b?.head, sales: amount, pieces, bills: s?.bills ?? 0,
      avgBill: s?.bills ? amount.div(s.bills) : dec(0), stockPieces: st.qty, stockValue: st.value,
      coverDays: pieces.gt(0) ? st.qty.div(pieces.div(days)) : null,
    };
  });
  const tot = (k: "sales" | "pieces" | "stockPieces" | "stockValue") => rows.reduce((t, r) => t.plus(r[k]), dec(0));
  const ts = tot("sales"), tv = tot("stockValue");
  return {
    from, to, days,
    rows: rows.sort((a, b) => b.sales.comparedTo(a.sales)).map((r) => ({
      warehouseId: r.warehouseId, store: r.store, branch: r.branch, headOffice: r.headOffice, sales: money(r.sales), salesSharePct: pct(r.sales, ts), pieces: r.pieces.toFixed(0), bills: r.bills,
      avgBill: money(r.avgBill), stockPieces: r.stockPieces.toFixed(0), stockValue: money(r.stockValue), stockSharePct: pct(r.stockValue, tv), coverDays: r.coverDays ? r.coverDays.toFixed(0) : null,
    })),
    totals: { sales: money(ts), pieces: tot("pieces").toFixed(0), stockPieces: tot("stockPieces").toFixed(0), stockValue: money(tv) },
  };
}

export type AllocationMode = "demand" | "ratio" | "fixed";
export interface AllocationInput {
  fromWarehouseId: string;
  mode: AllocationMode;
  /** What to send: each item and how many pieces there are to share out. */
  items: { itemId: string; qty: string }[];
  /** Demand: days of sales to look at. */
  days?: number | undefined;
  /** Ratio: a weight per destination. Fixed: pieces per destination for each item. */
  weights?: { warehouseId: string; weight: string }[] | undefined;
  fixed?: { warehouseId: string; qty: string }[] | undefined;
  /** Keep a destination out of the share-out (a store that is closed, or already full). */
  exclude?: string[] | undefined;
}

/** Splits `total` whole pieces over weights, giving the leftover pieces to the largest remainders so the parts always add up. */
export function splitPieces(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (!(total > 0) || !(sum > 0)) return weights.map(() => 0);
  const exact = weights.map((w) => (w / sum) * total);
  const base = exact.map(Math.floor);
  let left = total - base.reduce((a, b) => a + b, 0);
  const order = exact.map((e, i) => ({ i, r: e - Math.floor(e) })).sort((a, b) => b.r - a.r || a.i - b.i);
  for (const o of order) { if (left <= 0) break; base[o.i]!++; left--; }
  return base;
}

/**
 * A proposal for sharing new stock between stores: by what each store sold of the item lately (demand), by a ratio you set, or a fixed number
 * of pieces per store. Nothing moves until the proposal is accepted.
 */
export async function proposeAllocation(tx: Tx, input: AllocationInput) {
  const company = await resolveCompany(tx);
  const stores = (await ownStores(tx, company.id)).filter((w) => w.id !== input.fromWarehouseId && !(input.exclude ?? []).includes(w.id));
  if (!stores.length) throw badRequest("no_destinations");
  if (!input.items.length) throw badRequest("no_lines");
  for (const i of input.items) if (!dec(i.qty).gt(0) || !dec(i.qty).isInteger()) throw badRequest("qty_must_be_whole");
  const today = businessDate();
  const days = input.days ?? 30;
  const from = new Date((dayNo(today) - days + 1) * 86_400_000).toISOString().slice(0, 10);
  const demand = input.mode === "demand"
    ? [...await tx.execute<{ warehouse_id: string; item_id: string; qty: string }>(sql`
        with x as (${salesByWarehouse(company.id, from, today)}) select warehouse_id, item_id, sum(qty)::text as qty from x group by warehouse_id, item_id`)]
    : [];
  const proposal = input.items.map((it) => {
    const total = Number(it.qty);
    let shares: number[];
    if (input.mode === "fixed") {
      shares = stores.map((w) => Number(input.fixed?.find((f) => f.warehouseId === w.id)?.qty ?? 0));
    } else if (input.mode === "ratio") {
      shares = splitPieces(total, stores.map((w) => Number(input.weights?.find((x) => x.warehouseId === w.id)?.weight ?? 0)));
    } else {
      const w = stores.map((s) => Math.max(0, Number(demand.find((d) => d.warehouse_id === s.id && d.item_id === it.itemId)?.qty ?? 0)));
      // With no sales anywhere, share evenly rather than send nothing.
      shares = splitPieces(total, w.every((x) => x === 0) ? w.map(() => 1) : w);
    }
    return { itemId: it.itemId, total, perStore: stores.map((w, i) => ({ warehouseId: w.id, store: w.name, qty: shares[i]! })) };
  });
  return { fromWarehouseId: input.fromWarehouseId, mode: input.mode, days, proposal };
}

/** Accepts a proposal: one transfer to each store that gets something, sent in transit and received at the other end as usual. */
export async function dispatchAllocation(tx: Tx, actor: Actor, input: AllocationInput & { date: string }) {
  const p = await proposeAllocation(tx, input);
  const byStore = new Map<string, { itemId: string; qty: string }[]>();
  for (const it of p.proposal) for (const s of it.perStore) if (s.qty > 0) byStore.set(s.warehouseId, [...(byStore.get(s.warehouseId) ?? []), { itemId: it.itemId, qty: String(s.qty) }]);
  const out = [];
  for (const [warehouseId, lines] of byStore) {
    const r = await dispatchTransfer(tx, actor, { fromWarehouseId: input.fromWarehouseId, toWarehouseId: warehouseId, date: input.date, lines });
    out.push({ transferId: r.transfer.id, number: r.transfer.number, toWarehouseId: warehouseId, lines: lines.length, warnings: r.warnings });
  }
  return { transfers: out };
}

