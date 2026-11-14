import { createHash } from "node:crypto";
import { sql } from "drizzle-orm";
import { withTenant, type Db, type Tx } from "@varchasv/db";

/** A list as a Postgres array literal. */
const arr = (xs: (string | number)[]) => `{${xs.join(",")}}`;
const GENESIS = "0".repeat(64);
const BATCH = 2000;

type Row = {
  id: string; tenant_id: string; user_id: string | null; action: string; entity: string; entity_id: string | null;
  before: unknown; after: unknown; ip: string | null; at: string; chain_seq: string | null; prev_hash: string | null; hash: string | null;
};

/** Everything an entry says, in a fixed order, so the same entry always gives the same hash. */
export const entryHash = (prev: string, r: Row) =>
  createHash("sha256").update(JSON.stringify([prev, r.id, r.tenant_id, r.user_id, r.action, r.entity, r.entity_id, r.before, r.after, r.ip, r.at])).digest("hex");

/** Columns are cast to text for hashing, so every ORDER BY below names its table: a bare name would sort the text. */
const COLUMNS = sql`id::text, tenant_id::text, user_id::text, action, entity, entity_id, before, after, ip::text,
  to_char(at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS.US') as at, chain_seq::text, prev_hash, hash`;

/**
 * Chain every entry that is not yet chained to the one before it, oldest first. Entries are written without
 * waiting on each other; sealing, under a lock per business, fixes their order and links them. After that,
 * changing, removing or inserting an entry breaks every hash that follows.
 */
export async function sealAudit(tx: Tx, tenantId: string) {
  await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${tenantId}, 51))`);
  const [last] = await tx.execute<{ chain_seq: string; hash: string }>(sql`select chain_seq::text, hash from audit_log where hash is not null order by audit_log.chain_seq desc limit 1`);
  let seq = last ? Number(last.chain_seq) : 0;
  let prev = last?.hash ?? GENESIS;
  let sealed = 0;
  for (;;) {
    const rows = [...(await tx.execute<Row>(sql`select ${COLUMNS} from audit_log where hash is null order by audit_log.id limit ${BATCH}`))];
    if (!rows.length) break;
    const ids: string[] = [], seqs: number[] = [], prevs: string[] = [], hashes: string[] = [];
    for (const r of rows) {
      seq += 1;
      const hash = entryHash(prev, r);
      ids.push(r.id); seqs.push(seq); prevs.push(prev); hashes.push(hash);
      prev = hash;
    }
    const [done] = await tx.execute<{ n: number }>(sql`select seal_audit_entries(${arr(ids)}::bigint[], ${arr(seqs)}::bigint[], ${arr(prevs)}::text[], ${arr(hashes)}::text[]) as n`);
    if (Number(done?.n) !== rows.length) throw new Error("audit_seal_conflict");
    sealed += rows.length;
  }
  return sealed;
}

export interface AuditCheck {
  ok: boolean;
  /** Entries in the chain, and entries written since the last sealing (sealed on this check, so always 0 after it). */
  checked: number;
  sealedNow: number;
  broken?: { seq: number; id: string; reason: "gap" | "link" | "content" | "anchor" };
}

/** Seal what is new, then walk the whole chain and recompute every hash. */
export async function verifyAudit(tx: Tx, tenantId: string, anchor?: { seq: number; hash: string }): Promise<AuditCheck> {
  const sealedNow = await sealAudit(tx, tenantId);
  let expectedSeq = 1;
  let prev = GENESIS;
  let checked = 0;
  for (let from = 0; ; ) {
    const rows = [...(await tx.execute<Row>(sql`select ${COLUMNS} from audit_log where audit_log.chain_seq > ${from} order by audit_log.chain_seq limit ${BATCH}`))];
    if (!rows.length) break;
    for (const r of rows) {
      const seq = Number(r.chain_seq);
      const broken = (reason: "gap" | "link" | "content") => ({ ok: false, checked, sealedNow, broken: { seq, id: r.id, reason } }) as AuditCheck;
      if (seq !== expectedSeq) return broken("gap");
      if (r.prev_hash !== prev) return broken("link");
      if (r.hash !== entryHash(prev, r)) return broken("content");
      prev = r.hash!;
      expectedSeq += 1;
      checked += 1;
    }
    from = Number(rows[rows.length - 1]!.chain_seq);
  }
  // A saved copy of an earlier latest hash: the chain must still hold it at that position. A deleted tail would not break
  // the chain itself, but it removes the entry the copy points at.
  if (anchor && (anchor.seq > checked || (await entryHashAt(tx, anchor.seq)) !== anchor.hash)) return { ok: false, checked, sealedNow, broken: { seq: anchor.seq, id: "", reason: "anchor" } };
  return { ok: true, checked, sealedNow };
}

async function entryHashAt(tx: Tx, seq: number) {
  const [r] = await tx.execute<{ hash: string }>(sql`select hash from audit_log where audit_log.chain_seq = ${seq}`);
  return r?.hash ?? null;
}

/** The newest entry's position and hash: a value to keep somewhere the business owns, outside the database. */
export async function auditAnchor(tx: Tx, tenantId: string) {
  await sealAudit(tx, tenantId);
  const [r] = await tx.execute<{ seq: string; hash: string; at: string }>(sql`select chain_seq::text as seq, hash, at::text as at from audit_log where audit_log.chain_seq is not null order by audit_log.chain_seq desc limit 1`);
  return r ? { seq: Number(r.seq), hash: r.hash, at: r.at } : null;
}

/**
 * Seal businesses that have new entries (the scheduler calls this once a minute). A pass stops after its time budget,
 * so a backlog is worked through over several passes and never holds the database busy for long.
 */
export async function sealAllTenants(db: Db, budgetMs = 3000) {
  const started = Date.now();
  const tenants = await db.execute<{ tenant_id: string }>(sql`select tenant_id from tenants_with_unsealed_audit()`);
  let sealed = 0;
  for (const { tenant_id: tenantId } of tenants) {
    if (Date.now() - started > budgetMs) break;
    sealed += await withTenant(db, tenantId, (tx) => sealAudit(tx, tenantId));
  }
  return sealed;
}
