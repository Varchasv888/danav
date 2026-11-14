import { and, asc, desc, eq, gte, inArray, lte, ne, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { createSalesInvoice } from "./sales.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
type Project = typeof tables.projects.$inferSelect;

/** Hours in a working month (26 days of 8 hours), for an employee's cost per hour from salary. */
export const HOURS_PER_MONTH = 208;

// ---- projects -----------------------------------------------------------------------------------------

export interface ProjectInput {
  name: string; customerId?: string | null | undefined; status?: "active" | "on_hold" | "completed" | "cancelled" | undefined;
  billing?: "fixed" | "time_material" | "non_billable" | undefined; contractValue?: string | null | undefined; budgetCost?: string | null | undefined;
  budgetHours?: string | null | undefined; billRate?: string | null | undefined; billingItemId?: string | null | undefined;
  startOn?: string | null | undefined; endOn?: string | null | undefined; notes?: string | null | undefined;
}

async function checkRefs(tx: Tx, companyId: string, input: ProjectInput) {
  if (input.customerId) {
    const [c] = await tx.select({ a: tables.accounts, key: tables.accountGroups.key, parentKey: sql<string | null>`(select g2.key from account_groups g2 where g2.id = ${tables.accountGroups.parentId})` })
      .from(tables.accounts).innerJoin(tables.accountGroups, eq(tables.accountGroups.id, tables.accounts.groupId)).where(eq(tables.accounts.id, input.customerId));
    if (!c || c.a.companyId !== companyId || (c.key !== "sundry_debtors" && c.parentKey !== "sundry_debtors")) throw badRequest("not_a_customer");
  }
  if (input.billingItemId) {
    const [i] = await tx.select().from(tables.items).where(eq(tables.items.id, input.billingItemId));
    if (!i || i.companyId !== companyId) throw badRequest("unknown_item");
  }
  if (input.startOn && input.endOn && input.endOn < input.startOn) throw badRequest("ends_before_start");
}

const projectValues = (input: ProjectInput) => ({
  name: input.name.trim(), customerId: input.customerId ?? null, billing: input.billing ?? "fixed",
  contractValue: input.contractValue ?? null, budgetCost: input.budgetCost ?? null, budgetHours: input.budgetHours ?? null, billRate: input.billRate ?? null,
  billingItemId: input.billingItemId ?? null, startOn: input.startOn ?? null, endOn: input.endOn ?? null, notes: input.notes ?? null,
  ...(input.status ? { status: input.status } : {}),
});

export async function createProject(tx: Tx, actor: Actor, input: ProjectInput) {
  const company = await resolveCompany(tx);
  await checkRefs(tx, company.id, input);
  const [r] = await tx.execute<{ n: number }>(sql`select coalesce(max(nullif(regexp_replace(code, '\\D', '', 'g'), '')::int), 0)::int + 1 as n from projects where company_id = ${company.id}`);
  const [row] = await tx.insert(tables.projects).values({
    tenantId: actor.tenantId, companyId: company.id, code: `PRJ-${String(r!.n).padStart(4, "0")}`, ...projectValues(input), createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "project", entityId: row!.id, after: { code: row!.code, name: row!.name }, ip: actor.ip });
  return row!;
}

export async function updateProject(tx: Tx, actor: Actor, id: string, input: ProjectInput) {
  const company = await resolveCompany(tx);
  const p = await loadProject(tx, id);
  await checkRefs(tx, company.id, input);
  const [row] = await tx.update(tables.projects).set(projectValues(input)).where(eq(tables.projects.id, id)).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "project", entityId: id, before: { status: p.status }, after: { status: row!.status, name: row!.name }, ip: actor.ip });
  return row!;
}

async function loadProject(tx: Tx, id: string) {
  const [p] = await tx.select().from(tables.projects).where(eq(tables.projects.id, id));
  if (!p) throw notFound();
  return p;
}

/**
 * Job costing for a project: revenue is the taxable value of its invoices (less credit notes on
 * them); costs are logged hours at each person's cost rate, approved expense claims charged to it,
 * and purchase bills booked against it.
 */
async function financials(tx: Tx, projectIds: string[]) {
  const map = new Map<string, { revenue: string; labour: string; expenses: string; purchases: string; hours: string; billableHours: string; unbilled: string }>();
  if (!projectIds.length) return map;
  const ids = sql.join(projectIds.map((id) => sql`${id}::uuid`), sql`, `);
  const rows = await tx.execute<{ id: string; revenue: string; labour: string; expenses: string; purchases: string; hours: string; billable_hours: string; unbilled: string }>(sql`
    select p.id,
      coalesce((select sum(i.taxable) from sales_invoices i where i.project_id = p.id and i.status <> 'cancelled'), 0)
        - coalesce((select sum(c.taxable) from credit_notes c join sales_invoices i on i.id = c.invoice_id where i.project_id = p.id and c.status <> 'cancelled'), 0) as revenue,
      coalesce((select sum(t.hours * t.cost_rate) from timesheets t where t.project_id = p.id and t.status <> 'rejected'), 0) as labour,
      coalesce((select sum(l.taxable) from expense_lines l join expense_claims c on c.id = l.claim_id
        where coalesce(l.project_id, c.project_id) = p.id and c.status in ('approved', 'paid')), 0) as expenses,
      coalesce((select sum(b.taxable) from purchase_bills b where b.project_id = p.id and b.status <> 'cancelled'), 0) as purchases,
      coalesce((select sum(t.hours) from timesheets t where t.project_id = p.id and t.status <> 'rejected'), 0) as hours,
      coalesce((select sum(t.hours) from timesheets t where t.project_id = p.id and t.billable and t.status <> 'rejected'), 0) as billable_hours,
      coalesce((select sum(t.hours * t.bill_rate) from timesheets t where t.project_id = p.id and t.billable and t.status in ('submitted', 'approved')), 0) as unbilled
    from projects p where p.id in (${ids})`);
  for (const r of rows) {
    map.set(r.id, { revenue: money(r.revenue), labour: money(r.labour), expenses: money(r.expenses), purchases: money(r.purchases), hours: dec(r.hours).toFixed(2), billableHours: dec(r.billable_hours).toFixed(2), unbilled: money(r.unbilled) });
  }
  return map;
}

const summarise = (p: Project, f: { revenue: string; labour: string; expenses: string; purchases: string; hours: string; billableHours: string; unbilled: string }) => {
  const cost = dec(f.labour).plus(f.expenses).plus(f.purchases);
  const margin = dec(f.revenue).minus(cost);
  return {
    ...f, cost: money(cost), margin: money(margin), marginPct: dec(f.revenue).gt(0) ? margin.div(f.revenue).times(100).toFixed(1) : null,
    budgetUsedPct: p.budgetCost && dec(p.budgetCost).gt(0) ? cost.div(p.budgetCost).times(100).toFixed(1) : null,
    hoursUsedPct: p.budgetHours && dec(p.budgetHours).gt(0) ? dec(f.hours).div(p.budgetHours).times(100).toFixed(1) : null,
  };
};

export async function listProjects(tx: Tx) {
  const company = await resolveCompany(tx);
  const rows = await tx.select({ p: tables.projects, customer: tables.accounts.name }).from(tables.projects).leftJoin(tables.accounts, eq(tables.accounts.id, tables.projects.customerId))
    .where(eq(tables.projects.companyId, company.id)).orderBy(desc(tables.projects.createdAt));
  const fin = await financials(tx, rows.map((r) => r.p.id));
  return rows.map((r) => ({ ...r.p, customer: r.customer, summary: summarise(r.p, fin.get(r.p.id)!) }));
}

export async function getProject(tx: Tx, id: string) {
  const p = await loadProject(tx, id);
  const [customer] = p.customerId ? await tx.select({ name: tables.accounts.name }).from(tables.accounts).where(eq(tables.accounts.id, p.customerId)) : [];
  const [tasks, milestones, members, invoices] = await Promise.all([
    tx.select({ t: tables.projectTasks, assignee: tables.employees.name, logged: sql<string>`(select coalesce(sum(hours), 0)::text from timesheets s where s.task_id = ${tables.projectTasks.id} and s.status <> 'rejected')` })
      .from(tables.projectTasks).leftJoin(tables.employees, eq(tables.employees.id, tables.projectTasks.assigneeId))
      .where(eq(tables.projectTasks.projectId, id)).orderBy(asc(tables.projectTasks.sortOrder), asc(tables.projectTasks.createdAt)),
    tx.select({ m: tables.projectMilestones, invoice: tables.salesInvoices.number }).from(tables.projectMilestones).leftJoin(tables.salesInvoices, eq(tables.salesInvoices.id, tables.projectMilestones.invoiceId))
      .where(eq(tables.projectMilestones.projectId, id)).orderBy(asc(tables.projectMilestones.sortOrder), asc(tables.projectMilestones.dueOn)),
    tx.select({ m: tables.projectMembers, name: tables.employees.name, code: tables.employees.code }).from(tables.projectMembers).innerJoin(tables.employees, eq(tables.employees.id, tables.projectMembers.employeeId))
      .where(eq(tables.projectMembers.projectId, id)).orderBy(asc(tables.employees.code)),
    tx.select({ id: tables.salesInvoices.id, number: tables.salesInvoices.number, date: tables.salesInvoices.date, taxable: tables.salesInvoices.taxable, total: tables.salesInvoices.total, status: tables.salesInvoices.status })
      .from(tables.salesInvoices).where(eq(tables.salesInvoices.projectId, id)).orderBy(desc(tables.salesInvoices.date)),
  ]);
  const fin = await financials(tx, [id]);
  return {
    ...p, customer: customer?.name ?? null, summary: summarise(p, fin.get(id)!),
    tasks: tasks.map((t) => ({ ...t.t, assignee: t.assignee, logged: dec(t.logged).toFixed(2) })),
    milestones: milestones.map((m) => ({ ...m.m, invoice: m.invoice })),
    members: members.map((m) => ({ ...m.m, name: m.name, code: m.code })),
    invoices,
  };
}

// ---- tasks, members, milestones ------------------------------------------------------------------------------

export async function saveTask(tx: Tx, actor: Actor, projectId: string, input: { name: string; status?: "todo" | "doing" | "done" | undefined; assigneeId?: string | null | undefined; estimatedHours?: string | null | undefined; dueOn?: string | null | undefined; sortOrder?: number | undefined }, id?: string) {
  await loadProject(tx, projectId);
  const values = {
    name: input.name.trim(), ...(input.status ? { status: input.status } : {}), assigneeId: input.assigneeId ?? null, estimatedHours: input.estimatedHours ?? null,
    dueOn: input.dueOn ?? null, ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
  };
  if (id) {
    const [row] = await tx.update(tables.projectTasks).set(values).where(and(eq(tables.projectTasks.id, id), eq(tables.projectTasks.projectId, projectId))).returning();
    if (!row) throw notFound();
    return row;
  }
  const [row] = await tx.insert(tables.projectTasks).values({ tenantId: actor.tenantId, projectId, ...values }).returning();
  return row!;
}

export async function deleteTask(tx: Tx, projectId: string, id: string) {
  await tx.delete(tables.projectTasks).where(and(eq(tables.projectTasks.id, id), eq(tables.projectTasks.projectId, projectId)));
}

export async function saveMember(tx: Tx, actor: Actor, projectId: string, input: { employeeId: string; billRate?: string | null | undefined }) {
  const p = await loadProject(tx, projectId);
  const [e] = await tx.select().from(tables.employees).where(eq(tables.employees.id, input.employeeId));
  if (!e || e.companyId !== p.companyId) throw badRequest("unknown_employee");
  await tx.insert(tables.projectMembers).values({ tenantId: actor.tenantId, projectId, employeeId: input.employeeId, billRate: input.billRate ?? null })
    .onConflictDoUpdate({ target: [tables.projectMembers.projectId, tables.projectMembers.employeeId], set: { billRate: input.billRate ?? null } });
}

export async function removeMember(tx: Tx, projectId: string, employeeId: string) {
  await tx.delete(tables.projectMembers).where(and(eq(tables.projectMembers.projectId, projectId), eq(tables.projectMembers.employeeId, employeeId)));
}

export async function saveMilestone(tx: Tx, actor: Actor, projectId: string, input: { name: string; amount: string; dueOn?: string | null | undefined; sortOrder?: number | undefined }, id?: string) {
  await loadProject(tx, projectId);
  if (!dec(input.amount).gt(0)) throw badRequest("invalid_amount");
  const values = { name: input.name.trim(), amount: money(input.amount), dueOn: input.dueOn ?? null, ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}) };
  if (id) {
    const [m] = await tx.select().from(tables.projectMilestones).where(and(eq(tables.projectMilestones.id, id), eq(tables.projectMilestones.projectId, projectId)));
    if (!m) throw notFound();
    if (m.status === "billed") throw conflict("milestone_billed");
    const [row] = await tx.update(tables.projectMilestones).set(values).where(eq(tables.projectMilestones.id, id)).returning();
    return row!;
  }
  const [row] = await tx.insert(tables.projectMilestones).values({ tenantId: actor.tenantId, projectId, ...values }).returning();
  return row!;
}

export async function deleteMilestone(tx: Tx, projectId: string, id: string) {
  const [m] = await tx.select().from(tables.projectMilestones).where(and(eq(tables.projectMilestones.id, id), eq(tables.projectMilestones.projectId, projectId)));
  if (!m) throw notFound();
  if (m.status === "billed") throw conflict("milestone_billed");
  await tx.delete(tables.projectMilestones).where(eq(tables.projectMilestones.id, id));
}

function billable(p: Project) {
  if (!p.customerId) throw badRequest("project_customer_required");
  if (!p.billingItemId) throw badRequest("billing_item_required");
  return { customerId: p.customerId, itemId: p.billingItemId };
}

/** Raises a sales invoice for a milestone (the project's billing item, at the milestone amount). */
export async function billMilestone(tx: Tx, actor: Actor, projectId: string, id: string, input: { date: string }) {
  const p = await loadProject(tx, projectId);
  const b = billable(p);
  const [m] = await tx.select().from(tables.projectMilestones).where(and(eq(tables.projectMilestones.id, id), eq(tables.projectMilestones.projectId, projectId))).for("update");
  if (!m) throw notFound();
  if (m.status === "billed") throw conflict("milestone_billed");
  const r = await createSalesInvoice(tx, actor, {
    customerId: b.customerId, date: input.date, projectId, narration: `${p.code} ${p.name}: ${m.name}`,
    lines: [{ itemId: b.itemId, qty: "1", rate: m.amount, description: `${p.name} — ${m.name}` }],
  });
  await tx.update(tables.projectMilestones).set({ status: "billed", invoiceId: r.invoice.id }).where(eq(tables.projectMilestones.id, id));
  return r;
}

// ---- timesheets -----------------------------------------------------------------------------------------------

/** An employee's cost per hour: set on the employee, else monthly gross salary ÷ 208 hours. */
export async function costRate(tx: Tx, employeeId: string, date: string) {
  const [e] = await tx.select().from(tables.employees).where(eq(tables.employees.id, employeeId));
  if (!e) throw badRequest("unknown_employee");
  if (e.costPerHour) return { employee: e, rate: money(e.costPerHour) };
  const [s] = await tx.select().from(tables.salaryStructures).where(and(eq(tables.salaryStructures.employeeId, employeeId), lte(tables.salaryStructures.effectiveFrom, date)))
    .orderBy(desc(tables.salaryStructures.effectiveFrom)).limit(1);
  const gross = (s?.components ?? []).reduce((t, c) => t.plus(c.monthly), dec(0));
  return { employee: e, rate: money(gross.div(HOURS_PER_MONTH)) };
}

export interface TimeInput { projectId: string; taskId?: string | null | undefined; employeeId: string; date: string; hours: string; billable?: boolean | undefined; note?: string | undefined }

export async function logTime(tx: Tx, actor: Actor, input: TimeInput) {
  const p = await loadProject(tx, input.projectId);
  if (p.status !== "active") throw conflict("project_not_active");
  const hours = dec(input.hours);
  if (!hours.gt(0) || hours.gt(24)) throw badRequest("invalid_hours");
  const { employee, rate } = await costRate(tx, input.employeeId, input.date);
  if (employee.companyId !== p.companyId) throw badRequest("unknown_employee");
  if (input.date < employee.joinedOn || (employee.leftOn && input.date > employee.leftOn)) throw badRequest("not_employed_on_date");
  if (input.taskId) {
    const [t] = await tx.select().from(tables.projectTasks).where(eq(tables.projectTasks.id, input.taskId));
    if (!t || t.projectId !== p.id) throw badRequest("unknown_task");
  }
  const [day] = await tx.execute<{ h: string }>(sql`select coalesce(sum(hours), 0)::text as h from timesheets where employee_id = ${input.employeeId} and date = ${input.date}::date and status <> 'rejected'`);
  if (dec(day!.h).plus(hours).gt(24)) throw badRequest("too_many_hours");
  const isBillable = p.billing === "time_material" && (input.billable ?? true);
  const [member] = await tx.select().from(tables.projectMembers).where(and(eq(tables.projectMembers.projectId, p.id), eq(tables.projectMembers.employeeId, input.employeeId)));
  const billRate = isBillable ? money(member?.billRate ?? p.billRate ?? 0) : "0.00";
  const [row] = await tx.insert(tables.timesheets).values({
    tenantId: actor.tenantId, companyId: p.companyId, projectId: p.id, taskId: input.taskId ?? null, employeeId: input.employeeId, date: input.date,
    hours: hours.toFixed(2), billable: isBillable, note: input.note ?? null, costRate: rate, billRate, createdBy: actor.userId,
  }).returning();
  return row!;
}

export async function deleteTime(tx: Tx, actor: Actor, id: string) {
  const [t] = await tx.select().from(tables.timesheets).where(eq(tables.timesheets.id, id));
  if (!t) throw notFound();
  if (t.status === "billed" || t.status === "approved") throw conflict("timesheet_locked");
  await tx.delete(tables.timesheets).where(eq(tables.timesheets.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "delete", entity: "timesheet", entityId: id, before: { date: t.date, hours: t.hours }, ip: actor.ip });
}

export async function decideTime(tx: Tx, actor: Actor, ids: string[], decision: "approved" | "rejected") {
  const rows = await tx.select().from(tables.timesheets).where(inArray(tables.timesheets.id, ids));
  if (rows.length !== new Set(ids).size) throw notFound();
  if (rows.some((r) => r.status !== "submitted")) throw conflict("timesheet_locked");
  await tx.update(tables.timesheets).set({ status: decision, approvedBy: actor.userId }).where(inArray(tables.timesheets.id, ids));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: decision === "approved" ? "approve" : "update", entity: "timesheet", entityId: ids[0]!, after: { count: ids.length, status: decision }, ip: actor.ip });
}

export async function listTime(tx: Tx, q: { projectId?: string | undefined; employeeId?: string | undefined; from?: string | undefined; to?: string | undefined; status?: string | undefined }) {
  const company = await resolveCompany(tx);
  return tx.select({ t: tables.timesheets, employee: tables.employees.name, code: tables.employees.code, project: tables.projects.name, projectCode: tables.projects.code, task: tables.projectTasks.name })
    .from(tables.timesheets).innerJoin(tables.employees, eq(tables.employees.id, tables.timesheets.employeeId)).innerJoin(tables.projects, eq(tables.projects.id, tables.timesheets.projectId))
    .leftJoin(tables.projectTasks, eq(tables.projectTasks.id, tables.timesheets.taskId))
    .where(and(
      eq(tables.timesheets.companyId, company.id), q.projectId ? eq(tables.timesheets.projectId, q.projectId) : undefined, q.employeeId ? eq(tables.timesheets.employeeId, q.employeeId) : undefined,
      q.from ? gte(tables.timesheets.date, q.from) : undefined, q.to ? lte(tables.timesheets.date, q.to) : undefined, q.status ? eq(tables.timesheets.status, q.status) : undefined,
    )).orderBy(desc(tables.timesheets.date), asc(tables.employees.code)).limit(1000);
}

/** Invoices approved billable hours up to a date: one line per person and rate, hours × bill rate. */
export async function billTime(tx: Tx, actor: Actor, projectId: string, input: { date: string; upTo: string }) {
  const p = await loadProject(tx, projectId);
  const b = billable(p);
  if (p.billing !== "time_material") throw badRequest("not_time_and_material");
  const rows = await tx.select({ t: tables.timesheets, name: tables.employees.name }).from(tables.timesheets).innerJoin(tables.employees, eq(tables.employees.id, tables.timesheets.employeeId))
    .where(and(eq(tables.timesheets.projectId, projectId), eq(tables.timesheets.status, "approved"), eq(tables.timesheets.billable, true), lte(tables.timesheets.date, input.upTo), ne(tables.timesheets.billRate, "0")))
    .for("update");
  if (!rows.length) throw badRequest("nothing_to_bill");
  const groups = new Map<string, { name: string; rate: string; hours: ReturnType<typeof dec> }>();
  for (const r of rows) {
    const k = `${r.t.employeeId}|${r.t.billRate}`;
    const g = groups.get(k) ?? { name: r.name, rate: r.t.billRate, hours: dec(0) };
    g.hours = g.hours.plus(r.t.hours);
    groups.set(k, g);
  }
  const res = await createSalesInvoice(tx, actor, {
    customerId: b.customerId, date: input.date, projectId, narration: `${p.code} ${p.name}: time to ${input.upTo}`,
    lines: [...groups.values()].map((g) => ({ itemId: b.itemId, qty: g.hours.toFixed(2), rate: g.rate, description: `${p.name} — ${g.name}, ${g.hours.toFixed(2)} h` })),
  });
  await tx.update(tables.timesheets).set({ status: "billed", invoiceId: res.invoice.id }).where(inArray(tables.timesheets.id, rows.map((r) => r.t.id)));
  return res;
}

