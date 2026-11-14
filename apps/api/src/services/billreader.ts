import { and, eq, ilike } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { receiptReader } from "../integrations/receipts.js";
import { resolveCompany } from "./accounting.js";
import { getFile } from "./files.js";

/**
 * Reads a supplier's bill (photo or PDF) into a draft for the purchase bill form: the supplier is found
 * by GSTIN and each line's item by HSN or name. Nothing is posted; the user checks and saves the form.
 */
export async function readPurchaseBill(tx: Tx, fileId: string) {
  const company = await resolveCompany(tx);
  const f = await getFile(tx, fileId);
  let fields = null;
  try { fields = await receiptReader.readBill({ data: f.data, contentType: f.contentType }); } catch { fields = null; }
  if (!fields) return { reader: receiptReader.name, fields: null, supplierId: null, lines: [] };
  const [supplier] = fields.vendorGstin
    ? await tx.select({ id: tables.accounts.id }).from(tables.accounts).where(and(eq(tables.accounts.companyId, company.id), eq(tables.accounts.gstin, fields.vendorGstin)))
    : [];
  const items = await tx.select({ id: tables.items.id, name: tables.items.name, hsn: tables.items.hsn }).from(tables.items)
    .where(and(eq(tables.items.companyId, company.id), eq(tables.items.archived, false)));
  const lines = [];
  for (const l of fields.lines) {
    const word = l.description.split(/\s+/).find((w) => w.length >= 4);
    const byName = items.find((i) => i.name.toLowerCase() === l.description.toLowerCase())
      ?? (word ? (await tx.select({ id: tables.items.id }).from(tables.items).where(and(eq(tables.items.companyId, company.id), eq(tables.items.archived, false), ilike(tables.items.name, `%${word.replace(/[%_\\]/g, "\\$&")}%`))).limit(1))[0] : undefined);
    const byHsn = l.hsn ? items.filter((i) => i.hsn === l.hsn) : [];
    lines.push({ ...l, itemId: byName?.id ?? (byHsn.length === 1 ? byHsn[0]!.id : null) });
  }
  return { reader: receiptReader.name, fields, supplierId: supplier?.id ?? null, lines };
}
