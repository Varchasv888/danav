import { and, asc, desc, eq, notInArray, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { awaitingProof, businessDate, claimDeadline, claimState, dec, hasDiscrepancy, proofProblems, CLAIM_DAYS } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

export interface ProofBody {
  receivedOn: string; receivedBy: string; fileId?: string | undefined; note?: string | undefined; claimOwnerId?: string | undefined; claimDays?: number | undefined;
  lines: { noteLineId: string; short?: string | undefined; damaged?: string | undefined }[];
}

/**
 * Records that a challan reached the buyer: who received it, when, a photo or signed copy, and what came short or damaged.
 * Short or damaged goods open a claim with an owner and a deadline.
 */
export async function recordProof(tx: Tx, actor: Actor, noteId: string, b: ProofBody) {
  const [note] = await tx.select().from(tables.deliveryNotes).where(eq(tables.deliveryNotes.id, noteId)).for("update");
  if (!note) throw notFound();
  if (note.status === "cancelled") throw conflict("note_cancelled");
  const [dup] = await tx.select({ id: tables.deliveryProofs.id }).from(tables.deliveryProofs).where(eq(tables.deliveryProofs.noteId, noteId));
  if (dup) throw conflict("proof_exists");
  if (b.receivedOn < note.date) throw badRequest("received_before_dispatch");
  if (b.receivedOn > businessDate()) throw badRequest("received_in_future");
  const noteLines = await tx.select().from(tables.deliveryNoteLines).where(eq(tables.deliveryNoteLines.noteId, noteId));
  const wanted = b.lines.map((l) => {
    const nl = noteLines.find((x) => x.id === l.noteLineId);
    if (!nl) throw badRequest("unknown_note_line");
    return { noteLineId: l.noteLineId, qty: nl.qty, short: l.short ?? "0", damaged: l.damaged ?? "0" };
  });
  const problems = proofProblems(wanted);
  if (problems.length) throw badRequest(problems[0]!);
  if (b.fileId) {
    const [f] = await tx.select({ id: tables.files.id }).from(tables.files).where(and(eq(tables.files.id, b.fileId), eq(tables.files.companyId, note.companyId)));
    if (!f) throw badRequest("evidence_file_not_found");
  }
  const discrepancy = hasDiscrepancy(wanted);
  const [proof] = await tx.insert(tables.deliveryProofs).values({
    tenantId: actor.tenantId, companyId: note.companyId, noteId, receivedOn: b.receivedOn, receivedBy: b.receivedBy.trim(), fileId: b.fileId ?? null, note: b.note?.trim() || null,
    discrepancy, claimOwnerId: discrepancy ? (b.claimOwnerId ?? actor.userId) : null, claimDeadline: discrepancy ? claimDeadline(b.receivedOn, b.claimDays ?? CLAIM_DAYS) : null,
    claimStatus: discrepancy ? "open" : "settled", createdBy: actor.userId,
  }).returning();
  const flagged = wanted.filter((l) => dec(l.short).gt(0) || dec(l.damaged).gt(0));
  if (flagged.length) await tx.insert(tables.deliveryProofLines).values(flagged.map((l) => ({ tenantId: actor.tenantId, proofId: proof!.id, noteLineId: l.noteLineId, shortQty: dec(l.short).toFixed(4), damagedQty: dec(l.damaged).toFixed(4) })));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "delivery_proof", entityId: proof!.id, after: { note: note.number, receivedBy: b.receivedBy, discrepancy }, ip: actor.ip });
  return getProof(tx, noteId);
}

/** The proof for a challan with its short and damaged lines and where the claim stands today; null when none is recorded. */
export async function getProof(tx: Tx, noteId: string) {
  const [p] = await tx.select({ proof: tables.deliveryProofs, owner: tables.users.name, file: tables.files.name })
    .from(tables.deliveryProofs).leftJoin(tables.users, eq(tables.users.id, tables.deliveryProofs.claimOwnerId)).leftJoin(tables.files, eq(tables.files.id, tables.deliveryProofs.fileId))
    .where(eq(tables.deliveryProofs.noteId, noteId));
  if (!p) return null;
  const lines = await tx.select({ line: tables.deliveryProofLines, item: tables.items.name, qty: tables.deliveryNoteLines.qty })
    .from(tables.deliveryProofLines).innerJoin(tables.deliveryNoteLines, eq(tables.deliveryNoteLines.id, tables.deliveryProofLines.noteLineId))
    .innerJoin(tables.items, eq(tables.items.id, tables.deliveryNoteLines.itemId)).where(eq(tables.deliveryProofLines.proofId, p.proof.id));
  return {
    id: p.proof.id, noteId, receivedOn: p.proof.receivedOn, receivedBy: p.proof.receivedBy, note: p.proof.note, fileId: p.proof.fileId, fileName: p.file,
    discrepancy: p.proof.discrepancy, claimOwner: p.owner, claimOwnerId: p.proof.claimOwnerId, claimDeadline: p.proof.claimDeadline, claimStatus: p.proof.claimStatus, claimNote: p.proof.claimNote,
    state: claimState({ discrepancy: p.proof.discrepancy, status: p.proof.claimStatus as "open", deadline: p.proof.claimDeadline, today: businessDate() }),
    lines: lines.map((l) => ({ lineId: l.line.id, item: l.item, delivered: dec(l.qty).toFixed(4), short: dec(l.line.shortQty).toFixed(4), damaged: dec(l.line.damagedQty).toFixed(4) })),
  };
}

/** Closes a claim as settled (the buyer was credited or the goods replaced) or waived (written off), with a note. */
export async function closeClaim(tx: Tx, actor: Actor, proofId: string, status: "settled" | "waived", note: string) {
  const [p] = await tx.select().from(tables.deliveryProofs).where(eq(tables.deliveryProofs.id, proofId)).for("update");
  if (!p) throw notFound();
  if (!p.discrepancy) throw conflict("no_claim");
  if (p.claimStatus !== "open") throw conflict("claim_closed");
  if (!note.trim()) throw badRequest("note_required");
  await tx.update(tables.deliveryProofs).set({ claimStatus: status, claimNote: note.trim().slice(0, 300), claimClosedAt: new Date() }).where(eq(tables.deliveryProofs.id, proofId));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "delivery_proof", entityId: proofId, after: { claim: status, note }, ip: actor.ip });
}

/** Claims still open (most urgent first) and challans sent more than a few days ago with no proof recorded. */
export async function deliveryExceptions(tx: Tx, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const today = businessDate();
  const claims = await tx.select({ proof: tables.deliveryProofs, note: tables.deliveryNotes.number, customer: tables.accounts.name, owner: tables.users.name })
    .from(tables.deliveryProofs).innerJoin(tables.deliveryNotes, eq(tables.deliveryNotes.id, tables.deliveryProofs.noteId))
    .innerJoin(tables.accounts, eq(tables.accounts.id, tables.deliveryNotes.customerId)).leftJoin(tables.users, eq(tables.users.id, tables.deliveryProofs.claimOwnerId))
    .where(and(eq(tables.deliveryProofs.companyId, company.id), eq(tables.deliveryProofs.discrepancy, true), eq(tables.deliveryProofs.claimStatus, "open")))
    .orderBy(asc(tables.deliveryProofs.claimDeadline));
  const withProof = (await tx.select({ n: tables.deliveryProofs.noteId }).from(tables.deliveryProofs).where(eq(tables.deliveryProofs.companyId, company.id))).map((r) => r.n);
  const sent = await tx.select({ id: tables.deliveryNotes.id, number: tables.deliveryNotes.number, date: tables.deliveryNotes.date, customer: tables.accounts.name, transporter: tables.deliveryNotes.transporter })
    .from(tables.deliveryNotes).innerJoin(tables.accounts, eq(tables.accounts.id, tables.deliveryNotes.customerId))
    .where(and(eq(tables.deliveryNotes.companyId, company.id), eq(tables.deliveryNotes.reason, "supply"), sql`${tables.deliveryNotes.status} <> 'cancelled'`,
      sql`${tables.deliveryNotes.date} >= (${today}::date - 120)`, withProof.length ? notInArray(tables.deliveryNotes.id, withProof) : undefined))
    .orderBy(desc(tables.deliveryNotes.date)).limit(300);
  return {
    claims: claims.map((c) => ({
      proofId: c.proof.id, noteId: c.proof.noteId, note: c.note, customer: c.customer, owner: c.owner, receivedOn: c.proof.receivedOn, deadline: c.proof.claimDeadline,
      state: claimState({ discrepancy: true, status: "open", deadline: c.proof.claimDeadline, today }),
    })),
    awaitingProof: sent.filter((n) => awaitingProof(n.date, today)).map((n) => ({ noteId: n.id, number: n.number, date: n.date, customer: n.customer, transporter: n.transporter })),
  };
}
