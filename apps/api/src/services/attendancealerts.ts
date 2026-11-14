import { and, eq, gte, isNull, lte, or } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { resolveCompany } from "./accounting.js";
import { workingDates } from "./hr.js";

export interface AttendanceAlert { employeeId: string; code: string; name: string; kind: "absent" | "late"; inTime?: string | null }

/**
 * Who to look into on a day: employees marked absent and those who came in late. A day with no entry means present (that is
 * how attendance is kept), so nobody is flagged for it. People on approved leave, and days that are weekly offs or holidays, raise nothing.
 */
export async function attendanceAlerts(tx: Tx, date: string) {
  const company = await resolveCompany(tx);
  const working = (await workingDates(tx, company.id, date, date)).length > 0;
  const staff = await tx.select({ id: tables.employees.id, code: tables.employees.code, name: tables.employees.name }).from(tables.employees)
    .where(and(eq(tables.employees.companyId, company.id), eq(tables.employees.status, "active"), lte(tables.employees.joinedOn, date), or(isNull(tables.employees.leftOn), gte(tables.employees.leftOn, date))));
  const rows = await tx.select().from(tables.attendance).where(eq(tables.attendance.date, date));
  const byEmployee = new Map(rows.map((r) => [r.employeeId, r]));
  const alerts: AttendanceAlert[] = [];
  for (const e of staff) {
    const a = byEmployee.get(e.id);
    if (!a) continue;
    // Each person's own week off, a day given off, and holidays raise nothing.
    if (!(await workingDates(tx, company.id, date, date, e.id)).length) continue;
    if (a.status === "absent") alerts.push({ employeeId: e.id, code: e.code, name: e.name, kind: "absent" });
    else if (a.late) alerts.push({ employeeId: e.id, code: e.code, name: e.name, kind: "late", inTime: a.inTime });
  }
  const count = (k: AttendanceAlert["kind"]) => alerts.filter((a) => a.kind === k).length;
  return { date, workingDay: working, staff: staff.length, absent: count("absent"), late: count("late"), alerts };
}
