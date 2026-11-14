import { and, desc, eq, sql, type SQL } from "drizzle-orm";
import { tables, withTenant, type Db, type ReportConfig, type Tx } from "@varchasv/db";
import { PERIOD_PRESETS, ScheduleError, checkSchedule, dec, money, nextRun, presetPeriod, reportPeriod, toCsv, type Frequency, type PeriodPreset, businessDate } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, notFound } from "../lib/errors.js";
import type { Mailer } from "../lib/mailer.js";
import { resolveCompany } from "./accounting.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

/**
 * Report builder: pick a dataset, group by some of its dimensions and total some of its measures over
 * a period. Only names from these lists reach SQL; values are always bound parameters.
 */
interface Dataset {
  permission: string;
  /** A subquery with the columns the dimensions and measures use; $company, $from, $to are bound. */
  source: (companyId: string, from: string, to: string) => SQL;
  dims: Record<string, { label: string; expr: string; id?: string }>;
  measures: Record<string, string>;
}

const month = (col: string) => `to_char(${col}, 'YYYY-MM')`;
export const DATASETS: Record<string, Dataset> = {
  sales: {
    permission: "sales.view",
    source: (c, f, t) => sql`(
      select s.date, s.customer_id, s.customer_name, l.item_id, i.name as item, coalesce(i.hsn, '') as hsn, s.place_of_supply as state, s.id as doc,
        l.qty, l.taxable, (l.cgst + l.sgst + l.utgst + l.igst + l.cess) as tax, l.total
      from sales_invoice_lines l join sales_invoices s on s.id = l.invoice_id join items i on i.id = l.item_id
      where s.company_id = ${c} and s.status <> 'cancelled' and s.date between ${f}::date and ${t}::date
      union all
      select b.date, null, 'POS', l.item_id, l.name, coalesce(l.hsn, ''), '', b.id, l.qty, l.taxable, (l.cgst + l.sgst + l.cess), l.total
      from pos_bill_lines l join pos_bills b on b.id = l.bill_id where b.company_id = ${c} and b.status = 'paid' and b.date between ${f}::date and ${t}::date
    )`,
    dims: {
      month: { label: "month", expr: month("date") }, day: { label: "day", expr: "date::text" },
      customer: { label: "customer", expr: "customer_name", id: "customer_id" }, item: { label: "item", expr: "item", id: "item_id" },
      hsn: { label: "hsn", expr: "hsn" }, state: { label: "state", expr: "state" },
    },
    measures: { qty: "sum(qty)", taxable: "sum(taxable)", tax: "sum(tax)", total: "sum(total)", documents: "count(distinct doc)" },
  },
  purchases: {
    permission: "purchase.view",
    source: (c, f, t) => sql`(
      select b.date, b.supplier_id, a.name as supplier, l.item_id, i.name as item, coalesce(i.hsn, '') as hsn, b.id as doc,
        l.qty, l.taxable, (l.cgst + l.sgst + l.utgst + l.igst + l.cess) as tax, l.total
      from purchase_bill_lines l join purchase_bills b on b.id = l.bill_id join items i on i.id = l.item_id join accounts a on a.id = b.supplier_id
      where b.company_id = ${c} and b.status <> 'cancelled' and b.date between ${f}::date and ${t}::date
    )`,
    dims: {
      month: { label: "month", expr: month("date") }, supplier: { label: "supplier", expr: "supplier", id: "supplier_id" },
      item: { label: "item", expr: "item", id: "item_id" }, hsn: { label: "hsn", expr: "hsn" },
    },
    measures: { qty: "sum(qty)", taxable: "sum(taxable)", tax: "sum(tax)", total: "sum(total)", documents: "count(distinct doc)" },
  },
  expenses: {
    permission: "expenses.view",
    source: (c, f, t) => sql`(
      select l.date, ec.name as category, l.category_id, e.name as employee, c.employee_id, coalesce(p.name, '') as project, coalesce(l.project_id, c.project_id) as project_id,
        l.amount, (l.cgst + l.sgst + l.igst) as itc, c.id as doc
      from expense_lines l join expense_claims c on c.id = l.claim_id join expense_categories ec on ec.id = l.category_id join employees e on e.id = c.employee_id
      left join projects p on p.id = coalesce(l.project_id, c.project_id)
      where c.company_id = ${c} and c.status in ('approved', 'paid') and l.date between ${f}::date and ${t}::date
    )`,
    dims: {
      month: { label: "month", expr: month("date") }, category: { label: "category", expr: "category", id: "category_id" },
      employee: { label: "employee", expr: "employee", id: "employee_id" }, project: { label: "project", expr: "project", id: "project_id" },
    },
    measures: { amount: "sum(amount)", itc: "sum(itc)", documents: "count(distinct doc)" },
  },
  ledger: {
    permission: "reports.view",
    source: (c, f, t) => sql`(
      select e.date, a.name as account, e.account_id, g.name as grp, v.type, e.debit, e.credit, v.id as doc
      from gl_entries e join accounts a on a.id = e.account_id join account_groups g on g.id = a.group_id join vouchers v on v.id = e.voucher_id
      where e.company_id = ${c} and e.date between ${f}::date and ${t}::date
    )`,
    dims: {
      month: { label: "month", expr: month("date") }, account: { label: "account", expr: "account", id: "account_id" },
      group: { label: "group", expr: "grp" }, type: { label: "type", expr: "type" },
    },
    measures: { debit: "sum(debit)", credit: "sum(credit)", net: "sum(debit - credit)", documents: "count(distinct doc)" },
  },
  time: {
    permission: "projects.view",
    source: (c, f, t) => sql`(
      select s.date, p.name as project, s.project_id, e.name as employee, s.employee_id, s.hours, s.hours * s.cost_rate as cost,
        case when s.billable then s.hours * s.bill_rate else 0 end as billable_value
      from timesheets s join projects p on p.id = s.project_id join employees e on e.id = s.employee_id
      where s.company_id = ${c} and s.status <> 'rejected' and s.date between ${f}::date and ${t}::date
    )`,
    dims: {
      month: { label: "month", expr: month("date") }, project: { label: "project", expr: "project", id: "project_id" },
      employee: { label: "employee", expr: "employee", id: "employee_id" },
    },
    measures: { hours: "sum(hours)", cost: "sum(cost)", billableValue: "sum(billable_value)" },
  },
};

export function describeDatasets(perms: Set<string>) {
  return Object.entries(DATASETS).filter(([, d]) => perms.has(d.permission)).map(([key, d]) => ({ key, dims: Object.keys(d.dims), measures: Object.keys(d.measures) }));
}

function resolvePeriod(p: ReportConfig["period"], today: string) {
  if (p.preset === "custom") {
    if (!p.from || !p.to || p.from > p.to) throw badRequest("invalid_period");
    return { from: p.from, to: p.to };
  }
  if (!(PERIOD_PRESETS as readonly string[]).includes(p.preset)) throw badRequest("invalid_period");
  return presetPeriod(p.preset as PeriodPreset, today);
}

/** Runs a report. `period` overrides the saved one (scheduled runs cover the previous day/week/month). */
export async function runReport(tx: Tx, perms: Set<string>, config: ReportConfig, today: string, period?: { from: string; to: string }) {
  const d = DATASETS[config.dataset];
  if (!d) throw badRequest("unknown_dataset");
  if (!perms.has(d.permission)) throw badRequest("missing_permission");
  if (!config.measures.length || config.measures.some((m) => !d.measures[m])) throw badRequest("unknown_measure");
  if (config.groupBy.length > 3 || config.groupBy.some((g) => !d.dims[g])) throw badRequest("unknown_dimension");
  const company = await resolveCompany(tx);
  const { from, to } = period ?? resolvePeriod(config.period, today);
  const where: SQL[] = [];
  for (const [dim, value] of Object.entries(config.filters ?? {})) {
    const col = d.dims[dim]?.id;
    if (!col) throw badRequest("unknown_filter");
    where.push(sql`${sql.raw(col)} = ${value}`);
  }
  const dimCols = config.groupBy.map((g, i) => sql.raw(`${d.dims[g]!.expr} as d${i}`));
  const measureCols = config.measures.map((m, i) => sql.raw(`coalesce(${d.measures[m]}, 0)::text as m${i}`));
  const groupSql = config.groupBy.length ? sql` group by ${sql.join(config.groupBy.map((_g, i) => sql.raw(String(i + 1))), sql`, `)} order by ${sql.join(config.groupBy.map((_g, i) => sql.raw(String(i + 1))), sql`, `)}` : sql``;
  const rows = await tx.execute<Record<string, string>>(sql`
    select ${sql.join([...dimCols, ...measureCols], sql`, `)} from ${d.source(company.id, from, to)} src
    ${where.length ? sql`where ${sql.join(where, sql` and `)}` : sql``}${groupSql} limit 5000`);
  const isCount = (m: string) => m === "documents";
  const fmt = (m: string, v: string) => (isCount(m) ? String(Number(v)) : m === "qty" || m === "hours" ? dec(v).toString() : money(v));
  const out = [...rows].map((r) => [...config.groupBy.map((_g, i) => r[`d${i}`] ?? ""), ...config.measures.map((m, i) => fmt(m, r[`m${i}`] ?? "0"))]);
  const totals = config.measures.map((m, i) => (isCount(m) ? null : fmt(m, out.reduce((s, r) => s.plus(r[config.groupBy.length + i] ?? 0), dec(0)).toString())));
  const all = [...config.groupBy, ...config.measures];
  // A saved layout picks and orders the columns; totals sit under their measures (a dimension column has none).
  const chosen = config.layout?.columns?.length ? config.layout.columns : null;
  if (chosen) {
    if (new Set(chosen).size !== chosen.length || chosen.some((c) => !all.includes(c))) throw badRequest("invalid_layout");
    const at = chosen.map((c) => all.indexOf(c));
    const totalOf = (idx: number) => (idx < config.groupBy.length ? null : totals[idx - config.groupBy.length] ?? null);
    return { from, to, columns: chosen, rows: out.map((r) => at.map((i) => r[i] ?? "")), totals: at.map(totalOf), dimensions: chosen.filter((c) => config.groupBy.includes(c)).length };
  }
  return { from, to, columns: all, rows: out, totals, dimensions: config.groupBy.length };
}

export function reportCsv(name: string, r: Awaited<ReturnType<typeof runReport>>) {
  // The totals row lines up under its columns: a label first, then each column's total (blank where there is none).
  const cells = r.columns.map((_c, i) => (i < r.dimensions ? "" : r.totals[i - r.dimensions] ?? r.totals[i] ?? ""));
  return toCsv([[name, `${r.from} to ${r.to}`], r.columns, ...r.rows, ["Total", ...cells.slice(1)]]);
}

/** Sends a report to up to five addresses now, as a CSV that opens in Excel. */
export async function emailReport(tx: Tx, perms: Set<string>, mailer: Mailer, input: { name: string; config: ReportConfig; to: string[] }, today: string) {
  if (!input.to.length || input.to.length > 5) throw badRequest("invalid_recipients");
  const result = await runReport(tx, perms, input.config, today);
  const csv = reportCsv(input.name, result);
  for (const to of input.to) {
    await mailer.send({
      to, subject: `${input.name}: ${result.from} to ${result.to}`, text: `${input.name}\n${result.from} to ${result.to}\n${result.rows.length} rows attached.\n\n— Varchasv ERP`,
      attachments: [{ filename: `${input.name.replace(/[^\w-]+/g, "-")}-${result.to}.csv`, contentType: "text/csv", content: csv }],
    });
  }
  return { sent: input.to.length, rows: result.rows.length };
}

// ---- saved and scheduled ---------------------------------------------------------------------------------

export interface SaveInput {
  name: string; config: ReportConfig;
  schedule?: { frequency: Frequency; hour: number; weekday?: number | undefined; day?: number | undefined; recipients: string[] } | null | undefined;
}

export async function saveReport(tx: Tx, actor: Actor, perms: Set<string>, input: SaveInput, id?: string, now = new Date()) {
  const company = await resolveCompany(tx);
  await runReport(tx, perms, input.config, businessDate(now)); // checks the definition
  let schedule = {};
  if (input.schedule) {
    try { checkSchedule(input.schedule); } catch (e) { throw badRequest(e instanceof ScheduleError ? e.code : "invalid_schedule"); }
    if (!input.schedule.recipients.length) throw badRequest("recipients_required");
    schedule = {
      frequency: input.schedule.frequency, hour: input.schedule.hour, weekday: input.schedule.weekday ?? null, day: input.schedule.day ?? null,
      recipients: input.schedule.recipients, nextRunAt: nextRun(input.schedule, now), lastError: null,
    };
  } else schedule = { frequency: null, hour: null, weekday: null, day: null, recipients: [], nextRunAt: null };
  const values = { name: input.name.trim(), config: input.config, ...schedule };
  let row;
  if (id) {
    [row] = await tx.update(tables.savedReports).set(values).where(eq(tables.savedReports.id, id)).returning();
    if (!row) throw notFound();
  } else {
    [row] = await tx.insert(tables.savedReports).values({ tenantId: actor.tenantId, companyId: company.id, createdBy: actor.userId, ...values }).returning();
  }
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: id ? "update" : "create", entity: "saved_report", entityId: row!.id, after: { name: row!.name, frequency: row!.frequency }, ip: actor.ip });
  return row!;
}

export async function listReports(tx: Tx) {
  const company = await resolveCompany(tx);
  return tx.select().from(tables.savedReports).where(eq(tables.savedReports.companyId, company.id)).orderBy(desc(tables.savedReports.createdAt));
}

export async function deleteReport(tx: Tx, actor: Actor, id: string) {
  await tx.delete(tables.savedReports).where(eq(tables.savedReports.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "delete", entity: "saved_report", entityId: id, ip: actor.ip });
}

/**
 * Sends every scheduled report that is due, each as a CSV to its recipients, with the rights of the
 * user who saved it. Called every minute by the server (and directly by tests).
 */
export async function runDueReports(db: Db, mailer: Mailer, now = new Date()) {
  const due = await db.execute<{ tenant_id: string; report_id: string }>(sql`select tenant_id, report_id from due_saved_reports(${now.toISOString()}::timestamptz)`);
  let sent = 0;
  for (const { tenant_id: tenantId, report_id: id } of due) {
    await withTenant(db, tenantId, async (tx) => {
      const [r] = await tx.select().from(tables.savedReports).where(eq(tables.savedReports.id, id)).for("update");
      if (!r?.frequency || !r.nextRunAt || r.nextRunAt > now) return;
      const schedule = { frequency: r.frequency as Frequency, hour: r.hour ?? 0, weekday: r.weekday ?? undefined, day: r.day ?? undefined };
      let error: string | null = null;
      try {
        const [owner] = r.createdBy ? await tx.execute<{ permissions: string[] }>(sql`
          select ro.permissions from memberships m join roles ro on ro.id = m.role_id where m.user_id = ${r.createdBy} and m.tenant_id = ${tenantId} and m.status = 'active'`) : [];
        if (!owner) throw new Error("owner_gone");
        const result = await runReport(tx, new Set(owner.permissions), r.config, businessDate(now), reportPeriod(schedule, now));
        const csv = reportCsv(r.name, result);
        for (const to of r.recipients) {
          await mailer.send({
            to, subject: `${r.name}: ${result.from} to ${result.to}`,
            text: `${r.name}\n${result.from} to ${result.to}\n${result.rows.length} rows attached.\n\n— Varchasv ERP`,
            attachments: [{ filename: `${r.name.replace(/[^\w-]+/g, "-")}-${result.to}.csv`, contentType: "text/csv", content: csv }],
          });
        }
        sent++;
      } catch (e) {
        error = (e as { code?: string }).code ?? (e as Error).message;
      }
      await tx.update(tables.savedReports).set({ lastRunAt: now, lastError: error, nextRunAt: nextRun(schedule, now) }).where(and(eq(tables.savedReports.id, id)));
    });
  }
  return sent;
}
