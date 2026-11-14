import { asc, eq } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { bandFor, dec, priceFromBand } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
export interface BandInput { fromRate: string; markupPct: string; markdown1Pct: string; markdown2Pct: string }

export async function listBands(tx: Tx) {
  const company = await resolveCompany(tx);
  return tx.select().from(tables.marginBands).where(eq(tables.marginBands.companyId, company.id)).orderBy(asc(tables.marginBands.fromRate));
}

/** Replaces the whole table of bands. Each starts at a cost, marks up from there, and has two mark-downs from the MRP (the second at least the first). */
export async function replaceBands(tx: Tx, actor: Actor, bands: BandInput[]) {
  const company = await resolveCompany(tx);
  if (bands.length > 20) throw badRequest("too_many_bands");
  const froms = bands.map((b) => dec(b.fromRate).toFixed(2));
  if (new Set(froms).size !== froms.length) throw badRequest("duplicate_band");
  for (const b of bands) {
    if (dec(b.fromRate).lt(0) || dec(b.markupPct).lt(0) || dec(b.markupPct).gt(1000)) throw badRequest("invalid_band");
    const m1 = dec(b.markdown1Pct), m2 = dec(b.markdown2Pct);
    if (m1.lt(0) || m2.lt(0) || m2.gt(90)) throw badRequest("invalid_band");
    if (m2.lt(m1)) throw badRequest("second_markdown_smaller");
  }
  await tx.delete(tables.marginBands).where(eq(tables.marginBands.companyId, company.id));
  if (bands.length) await tx.insert(tables.marginBands).values(bands.map((b) => ({ tenantId: actor.tenantId, companyId: company.id, fromRate: dec(b.fromRate).toFixed(2), markupPct: dec(b.markupPct).toFixed(2), markdown1Pct: dec(b.markdown1Pct).toFixed(2), markdown2Pct: dec(b.markdown2Pct).toFixed(2) })));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "margin_bands", entityId: company.id, after: { bands: bands.length }, ip: actor.ip });
  return listBands(tx);
}

/** The MRP and the two sale rates a cost gets from the bands (null when no band starts at or below it). */
export async function priceByBands(tx: Tx, cost: string) {
  const band = bandFor(await listBands(tx), cost);
  return band ? { band: { fromRate: band.fromRate, markupPct: band.markupPct }, ...priceFromBand(band, cost) } : null;
}
