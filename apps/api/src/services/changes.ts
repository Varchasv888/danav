import { and, desc, eq } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { audit } from "../lib/audit.js";
import { conflict, forbidden, notFound } from "../lib/errors.js";
import { decryptSecret } from "../lib/secrets.js";
import { resolveCompany } from "./accounting.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

export async function approvalSettings(tx: Tx) {
  const company = await resolveCompany(tx);
  return { bankChange: company.bankChangeApproval };
}

export async function setApprovalSettings(tx: Tx, actor: Actor, input: { bankChange: boolean }) {
  const company = await resolveCompany(tx);
  await tx.update(tables.companies).set({ bankChangeApproval: input.bankChange }).where(eq(tables.companies.id, company.id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "approval_settings", entityId: company.id, before: { bankChange: company.bankChangeApproval }, after: input, ip: actor.ip });
  return { bankChange: input.bankChange };
}

/** JSON with keys in a fixed order, so two objects with the same values compare equal whatever order the database returned them in. */
const canonical = (v: unknown): string => JSON.stringify(v ?? null, (_k, x) => (x && typeof x === "object" && !Array.isArray(x) ? Object.fromEntries(Object.entries(x as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b))) : x));

/** Is a change to this party's bank details held for approval? True when the switch is on and the change is real. */
export async function holdsBankChange(tx: Tx, before: unknown, after: unknown) {
  const company = await resolveCompany(tx);
  return company.bankChangeApproval && canonical(before) !== canonical(after);
}

export async function requestBankChange(tx: Tx, actor: Actor, account: { id: string; name: string; bank: unknown }, bank: unknown) {
  const [row] = await tx.insert(tables.changeRequests).values({
    tenantId: actor.tenantId, kind: "account_bank", entityId: account.id, entityName: account.name, before: account.bank ?? null, after: bank ?? null, requestedBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "change_request", entityId: row!.id, after: { kind: "account_bank", account: account.name }, ip: actor.ip });
  return row!;
}

/** An employee's bank details as a change waiting for approval. The number is kept sealed; what the list shows is its last four digits. */
export async function holdsEmployeeBankChange(tx: Tx, employee: { bankName: string | null; bankIfsc: string | null; bankAccountEnc: string | null }, patch: { bankName?: string | undefined; bankIfsc?: string | undefined; bankAccount?: string | undefined }) {
  const company = await resolveCompany(tx);
  if (!company.bankChangeApproval) return false;
  const number = patch.bankAccount !== undefined && patch.bankAccount !== (employee.bankAccountEnc ? decryptSecret(employee.bankAccountEnc) : undefined);
  return number || (patch.bankName !== undefined && patch.bankName !== employee.bankName) || (patch.bankIfsc !== undefined && patch.bankIfsc !== employee.bankIfsc);
}

export async function requestEmployeeBankChange(
  tx: Tx, actor: Actor,
  employee: { id: string; name: string; bankName: string | null; bankIfsc: string | null; bankAccountLast4: string | null },
  next: { bankName?: string | undefined; bankIfsc?: string | undefined; bankAccountEnc?: string | undefined; bankAccountLast4?: string | undefined },
) {
  const shown = (b: { name: string | null; ifsc: string | null; last4: string | null }) => ({ accountNumber: b.last4 ?? undefined, ifsc: b.ifsc ?? undefined, branch: b.name ?? undefined });
  const after = {
    ...shown({ name: next.bankName ?? employee.bankName, ifsc: next.bankIfsc ?? employee.bankIfsc, last4: next.bankAccountLast4 ?? employee.bankAccountLast4 }),
    _apply: { ...(next.bankName !== undefined ? { bankName: next.bankName } : {}), ...(next.bankIfsc !== undefined ? { bankIfsc: next.bankIfsc } : {}), ...(next.bankAccountEnc ? { bankAccountEnc: next.bankAccountEnc, bankAccountLast4: next.bankAccountLast4 } : {}) },
  };
  const [row] = await tx.insert(tables.changeRequests).values({
    tenantId: actor.tenantId, kind: "employee_bank", entityId: employee.id, entityName: employee.name, before: shown({ name: employee.bankName, ifsc: employee.bankIfsc, last4: employee.bankAccountLast4 }), after, requestedBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "change_request", entityId: row!.id, after: { kind: "employee_bank", employee: employee.name }, ip: actor.ip });
  return row!;
}

export async function listChangeRequests(tx: Tx, status?: string) {
  return tx.select({ r: tables.changeRequests, requestedByName: tables.users.name }).from(tables.changeRequests)
    .leftJoin(tables.users, eq(tables.users.id, tables.changeRequests.requestedBy))
    .where(status ? eq(tables.changeRequests.status, status) : undefined).orderBy(desc(tables.changeRequests.createdAt)).limit(200)
    .then((rows) => rows.map((x) => {
      // The sealed account number kept for applying an employee change never leaves the server.
      const { _apply: _sealed, ...shownAfter } = (x.r.after ?? {}) as Record<string, unknown>;
      return { ...x.r, after: x.r.after ? shownAfter : x.r.after, requestedByName: x.requestedByName };
    }));
}

/** Approve (applying the change) or reject. The person who asked cannot decide their own request. */
export async function decideChange(tx: Tx, actor: Actor, id: string, input: { decision: "approve" | "reject"; note?: string | undefined }) {
  const [r] = await tx.select().from(tables.changeRequests).where(eq(tables.changeRequests.id, id)).for("update");
  if (!r) throw notFound();
  if (r.status !== "pending") throw conflict("request_already_decided");
  if (r.requestedBy === actor.userId) throw forbidden("cannot_approve_own_change");
  if (input.decision === "approve" && r.kind === "account_bank") {
    const [acc] = await tx.select().from(tables.accounts).where(eq(tables.accounts.id, r.entityId)).for("update");
    if (!acc) throw notFound();
    await tx.update(tables.accounts).set({ bank: r.after as never, updatedAt: new Date() }).where(and(eq(tables.accounts.id, r.entityId)));
    await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "account", entityId: r.entityId, before: { bank: acc.bank }, after: { bank: r.after, approvedRequest: r.id, requestedBy: r.requestedBy }, ip: actor.ip });
  }
  if (input.decision === "approve" && r.kind === "employee_bank") {
    const [emp] = await tx.select().from(tables.employees).where(eq(tables.employees.id, r.entityId)).for("update");
    if (!emp) throw notFound();
    const apply = ((r.after ?? {}) as { _apply?: Record<string, string> })._apply ?? {};
    await tx.update(tables.employees).set(apply).where(eq(tables.employees.id, r.entityId));
    await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "employee", entityId: r.entityId, before: { bankName: emp.bankName, bankIfsc: emp.bankIfsc, bankAccountLast4: emp.bankAccountLast4 }, after: { bankName: apply.bankName ?? emp.bankName, bankIfsc: apply.bankIfsc ?? emp.bankIfsc, bankAccountLast4: apply.bankAccountLast4 ?? emp.bankAccountLast4, approvedRequest: r.id, requestedBy: r.requestedBy }, ip: actor.ip });
  }
  const [row] = await tx.update(tables.changeRequests).set({ status: input.decision === "approve" ? "approved" : "rejected", decidedBy: actor.userId, decidedAt: new Date(), decisionNote: input.note ?? null }).where(eq(tables.changeRequests.id, id)).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "change_request", entityId: id, after: { decision: input.decision }, ip: actor.ip });
  return row!;
}
