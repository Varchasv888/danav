import { and, eq, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { businessDate, dec, money } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, notFound } from "../lib/errors.js";
import { postVoucher, resolveCompany } from "./accounting.js";
import { postStockJournal, stockPositions } from "./inventory.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

/** The party side an account belongs to (customers sit under Sundry Debtors, suppliers under Sundry Creditors), or null for any other account. */
async function partySide(tx: Tx, accountId: string): Promise<"debtors" | "creditors" | null> {
  const [r] = await tx.execute<{ key: string | null; parent: string | null }>(sql`
    select g.key, (select p.key from account_groups p where p.id = g.parent_id) as parent
    from accounts a join account_groups g on g.id = a.group_id where a.id = ${accountId}`);
  if (r?.key === "sundry_debtors" || r?.parent === "sundry_debtors") return "debtors";
  if (r?.key === "sundry_creditors" || r?.parent === "sundry_creditors") return "creditors";
  return null;
}

/**
 * Merges a duplicate customer or supplier into the one to keep. The books are append-only, so history stays on the duplicate; what moves is
 * the money (its closing balance goes across on a journal voucher, so the kept party shows the full position), the contact details the kept
 * party was missing, and the future (the duplicate is closed to new documents and points at the one it was merged into).
 */
export async function mergeParties(tx: Tx, actor: Actor, sourceId: string, targetId: string) {
  if (sourceId === targetId) throw badRequest("merge_same");
  const [source] = await tx.select().from(tables.accounts).where(eq(tables.accounts.id, sourceId)).for("update");
  const [target] = await tx.select().from(tables.accounts).where(eq(tables.accounts.id, targetId)).for("update");
  if (!source || !target) throw notFound();
  if (source.companyId !== target.companyId) throw badRequest("merge_other_company");
  if (source.mergedIntoId) throw badRequest("already_merged");
  if (target.archived || target.mergedIntoId) throw badRequest("merge_target_closed");
  const side = await partySide(tx, sourceId);
  if (!side || side !== (await partySide(tx, targetId))) throw badRequest("merge_party_kind");

  const [row] = await tx.execute<{ bal: string }>(sql`
    select ${source.openingBalance}::numeric + coalesce(sum(debit - credit), 0) as bal from gl_entries where account_id = ${sourceId}`);
  const balance = dec(row!.bal);
  let voucherId: string | null = null;
  if (!balance.isZero()) {
    const amount = balance.abs().toFixed(2);
    const debit = balance.gt(0); // the duplicate owes us (or we hold a debit): move it across the same way
    const { voucher } = await postVoucher(tx, actor, {
      companyId: source.companyId, type: "journal", date: businessDate(), reference: "Merge",
      narration: `Balance of ${source.name} moved to ${target.name} (duplicate merged)`,
      lines: debit
        ? [{ accountId: targetId, debit: amount }, { accountId: sourceId, credit: amount }]
        : [{ accountId: sourceId, debit: amount }, { accountId: targetId, credit: amount }],
    });
    voucherId = voucher.id;
  }

  // Details the kept party is missing come from the duplicate.
  const fill = <K extends "gstin" | "stateCode" | "pan" | "phone" | "email" | "address" | "creditLimit" | "creditDays" | "udyamNumber" | "msmeClass">(k: K) => (target[k] ? {} : source[k] ? { [k]: source[k] } : {});
  const gaps = {
    ...fill("gstin"), ...fill("stateCode"), ...fill("pan"), ...fill("phone"), ...fill("email"), ...fill("address"),
    ...fill("creditLimit"), ...fill("creditDays"), ...fill("udyamNumber"), ...fill("msmeClass"),
  };
  // A GSTIN may belong to one account only, so it leaves the duplicate before the kept party takes it.
  if ("gstin" in gaps) await tx.update(tables.accounts).set({ gstin: null }).where(eq(tables.accounts.id, sourceId));
  if (Object.keys(gaps).length) await tx.update(tables.accounts).set(gaps).where(eq(tables.accounts.id, targetId));
  await tx.update(tables.accounts).set({ archived: true, mergedIntoId: targetId }).where(eq(tables.accounts.id, sourceId));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "account", entityId: sourceId, after: { mergedInto: target.name, balanceMoved: money(balance), filled: Object.keys(gaps) }, ip: actor.ip });
  return { sourceId, targetId, balanceMoved: money(balance), voucherId, filled: Object.keys(gaps) };
}

/**
 * Merges a duplicate item into the one to keep: its stock moves across at its own cost on a stock journal, its barcode goes to the kept
 * item when that has none, and the duplicate is closed to new documents.
 */
export async function mergeItems(tx: Tx, actor: Actor, sourceId: string, targetId: string) {
  if (sourceId === targetId) throw badRequest("merge_same");
  const [source] = await tx.select().from(tables.items).where(eq(tables.items.id, sourceId)).for("update");
  const [target] = await tx.select().from(tables.items).where(eq(tables.items.id, targetId)).for("update");
  if (!source || !target) throw notFound();
  if (source.companyId !== target.companyId) throw badRequest("merge_other_company");
  if (source.mergedIntoId) throw badRequest("already_merged");
  if (target.archived || target.mergedIntoId) throw badRequest("merge_target_closed");
  if (source.kind !== target.kind || source.uomId !== target.uomId) throw badRequest("merge_item_kind");
  if (source.isPack || target.isPack) throw badRequest("merge_item_pack");
  if (source.trackBatches || target.trackBatches) throw badRequest("merge_item_batches");

  const company = await resolveCompany(tx, source.companyId);
  const positions = (await stockPositions(tx, company, "9999-12-31", { itemIds: [sourceId] })).filter((p) => !dec(p.qty).isZero());
  if (positions.some((p) => dec(p.qty).lt(0))) throw badRequest("merge_negative_stock");
  let journalId: string | null = null;
  if (positions.length) {
    const { journal } = await postStockJournal(tx, actor, {
      companyId: company.id, kind: "adjustment", date: businessDate(), narration: `${source.name} merged into ${target.name}`,
      lines: positions.flatMap((p) => {
        const rate = dec(p.value).div(p.qty).toFixed(4);
        return [
          { itemId: sourceId, warehouseId: p.warehouseId, qty: p.qty, direction: "out" as const },
          { itemId: targetId, warehouseId: p.warehouseId, qty: p.qty, direction: "in" as const, rate },
        ];
      }),
    });
    journalId = journal.id;
  }
  const moved: string[] = [];
  const set: Record<string, unknown> = { archived: true, mergedIntoId: targetId };
  // The duplicate's codes keep working: its barcode becomes the kept item's barcode if that has none, else an alias; codes it answered to move across.
  if (source.barcode) {
    await tx.update(tables.items).set({ barcode: null }).where(eq(tables.items.id, sourceId));
    if (!target.barcode) await tx.update(tables.items).set({ barcode: source.barcode }).where(eq(tables.items.id, targetId));
    else await tx.insert(tables.itemBarcodes).values({ tenantId: actor.tenantId, companyId: source.companyId, itemId: targetId, code: source.barcode, kind: "merged" }).onConflictDoNothing();
    moved.push("barcode");
  }
  await tx.update(tables.itemBarcodes).set({ itemId: targetId }).where(eq(tables.itemBarcodes.itemId, sourceId));
  await tx.update(tables.items).set(set).where(eq(tables.items.id, sourceId));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "item", entityId: sourceId, after: { mergedInto: target.name, stockMoved: positions.length, moved }, ip: actor.ip });
  return { sourceId, targetId, stockLines: positions.length, journalId, moved };
}
