import { and, eq, lt } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { tables, withTenant, type Db, type Tx } from "@varchasv/db";
import { businessDate, dec, money } from "@varchasv/domain";
import { resolveCompany } from "./accounting.js";
import { autoEmit } from "./comms.js";
import { outstanding } from "./returns.js";

interface Actor { tenantId: string; userId: string | null; ip?: string | undefined }

const weekOf = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`);
  const start = Date.UTC(d.getUTCFullYear(), 0, 1);
  return `${d.getUTCFullYear()}-W${Math.floor((d.getTime() - start) / (7 * 86_400_000))}`;
};

/**
 * The messages a business wants sent on a schedule: a reminder to each customer with bills past their due date (at most one a week each), and to each
 * customer holding goods on approval past the date they were due back (once for the memo). Each only goes if the business switched it on.
 */
export async function sendDueReminders(tx: Tx, actor: Actor, today = businessDate()) {
  const company = await resolveCompany(tx);
  let payment = 0, approval = 0;
  const open = await outstanding(tx, company.id, "receivable", today);
  for (const p of open.rows) {
    const overdue = p.openItems.filter((o) => o.daysOverdue > 0).reduce((t, o) => t.plus(o.amount), dec(0));
    if (!overdue.gt(0)) continue;
    await autoEmit(tx, actor, "payment_reminders", { event: "payment_reminder", accountId: p.partyId, params: { name: p.name, shop: company.name, amount: money(overdue) }, dedupeKey: `remind:${p.partyId}:${weekOf(today)}`, channels: ["whatsapp", "sms"] });
    payment += 1;
  }
  const memos = await tx.select().from(tables.approvalMemos).where(and(eq(tables.approvalMemos.companyId, company.id), eq(tables.approvalMemos.status, "open"), lt(tables.approvalMemos.dueBack, today)));
  for (const m of memos) {
    if (!m.customerPhone) continue;
    await autoEmit(tx, actor, "approval_due", { event: "approval_due", phone: m.customerPhone, params: { name: m.customerName, shop: company.name, number: m.number, date: m.dueBack! }, dedupeKey: `approval:${m.id}`, channels: ["whatsapp", "sms"] });
    approval += 1;
  }
  return { paymentReminders: payment, approvalReminders: approval };
}

/** The scheduled run: every business that has either reminder switched on. */
export async function runDueReminders(db: Db, today = businessDate()) {
  const tenants = [...await db.execute<{ tenant_id: string }>(sql`select comm_reminder_tenants() as tenant_id`)];
  let total = 0;
  for (const { tenant_id } of tenants) {
    const r = await withTenant(db, tenant_id, (tx) => sendDueReminders(tx, { tenantId: tenant_id, userId: null }, today));
    total += r.paymentReminders + r.approvalReminders;
  }
  return total;
}
