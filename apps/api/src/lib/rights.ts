import { and, eq, inArray } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { businessDate, dec } from "@varchasv/domain";
import { forbidden } from "./errors.js";

type Holder = { permissions: Set<string> };

/**
 * A document dated before today needs the right to change the date; one dated after today needs the right to
 * future-date it. Entering today's date needs neither, so counters and day-to-day entry are not slowed down.
 */
export function assertDateRight(auth: Holder, date: string, today = businessDate()) {
  if (date < today && !auth.permissions.has("special.changeDate")) throw forbidden("needs_change_date");
  if (date > today && !auth.permissions.has("special.futureDate")) throw forbidden("needs_future_date");
}

/** Selling a line for less than the item cost (its purchase rate) needs the right to sell below cost. */
export async function assertNotBelowCost(tx: Tx, auth: Holder, lines: { itemId: string; qty: string | number; rate?: string | number | undefined; discount?: string | number | undefined }[]) {
  if (auth.permissions.has("special.sellBelowCost")) return;
  const priced = lines.filter((l) => l.rate !== undefined && dec(l.qty).gt(0));
  if (!priced.length) return;
  const items = await tx.select({ id: tables.items.id, cost: tables.items.purchaseRate }).from(tables.items).where(inArray(tables.items.id, priced.map((l) => l.itemId)));
  const cost = new Map(items.map((i) => [i.id, dec(i.cost)]));
  for (const l of priced) {
    const c = cost.get(l.itemId);
    if (!c || !c.gt(0)) continue;
    const net = dec(l.rate!).times(l.qty).minus(l.discount ?? 0).div(l.qty);
    if (net.lt(c)) throw forbidden("needs_sell_below_cost");
  }
}

/**
 * Printing a document the first time needs the module's print right; printing it again needs the reprint right, so a copy of a bill cannot be
 * made at will. Each print is counted, with who made the latest.
 */
export async function recordPrint(tx: Tx, auth: Holder & { tenantId: string; user: { id: string } }, module: string, docType: string, docId: string) {
  const [row] = await tx.select().from(tables.docPrints).where(and(eq(tables.docPrints.docType, docType), eq(tables.docPrints.docId, docId)));
  const needed = row && row.count > 0 ? `${module}.reprint` : `${module}.print`;
  if (!auth.permissions.has(needed)) throw forbidden(row && row.count > 0 ? "needs_reprint_right" : "needs_print_right");
  if (row) await tx.update(tables.docPrints).set({ count: row.count + 1, lastAt: new Date(), lastBy: auth.user.id }).where(eq(tables.docPrints.id, row.id));
  else await tx.insert(tables.docPrints).values({ tenantId: auth.tenantId, docType, docId, count: 1, lastBy: auth.user.id });
}
