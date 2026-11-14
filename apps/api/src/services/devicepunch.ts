import { and, eq, inArray, sql } from "drizzle-orm";
import { tables, withTenant, type Db, type Tx } from "@varchasv/db";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { readPunches } from "./hr-ops.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

export interface ParsedPunch { pin: string; date: string; time: string; status: string | null; verify: string | null }

/** A second punch counts as clocking out only when it is at least this long after the first. */
const MIN_STAY_MINUTES = 30;
const DEFAULT_SHIFT = { startTime: "09:30", graceMinutes: 10, fullDayMinutes: 480, halfDayMinutes: 240 };
const mins = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));

/**
 * The machine's attendance log: one punch per line, `PIN <tab> 2026-11-03 09:12:44 <tab> status <tab> verify ...`. Lines that do not
 * look like a punch are skipped, so a machine that adds columns or sends a heading never breaks the batch.
 */
export function parseAttLog(body: string): ParsedPunch[] {
  const out: ParsedPunch[] = [];
  for (const raw of body.split(/\r?\n/)) {
    const m = /^\s*(?:ATTLOG\s+)?(\S+)\s+(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})(?:\s+(\S+))?(?:\s+(\S+))?/.exec(raw);
    if (m) out.push({ pin: m[1]!.slice(0, 24), date: m[2]!, time: m[3]!, status: m[4] ?? null, verify: m[5] ?? null });
  }
  return out;
}

/** Which business and machine a serial number belongs to; nothing for an unknown or switched-off machine. */
export async function deviceBySerial(db: Db, serial: string) {
  const rows = await db.execute<{ id: string; tenant_id: string; active: boolean }>(sql`select id, tenant_id, active from attendance_device_by_serial(${serial})`);
  const r = [...rows][0];
  return r && r.active ? { id: r.id, tenantId: r.tenant_id } : null;
}

const digits = (s: string) => s.replace(/\D/g, "").replace(/^0+/, "");

/** Applies the day's punches of one machine number to the matching employee's attendance. */
async function applyDay(tx: Tx, tenantId: string, pin: string, date: string) {
  const company = await resolveCompany(tx);
  const emps = await tx.select().from(tables.employees).where(eq(tables.employees.companyId, company.id));
  const exact = emps.filter((e) => e.punchPin === pin);
  const byCode = emps.filter((e) => !e.punchPin && digits(e.code) !== "" && digits(e.code) === digits(pin));
  const found = exact.length ? exact : byCode;
  // Two people sharing a number cannot be told apart: apply to neither rather than guess.
  if (found.length !== 1) return { matched: false as const };
  const e = found[0]!;
  const punches = await tx.select({ id: tables.attendancePunches.id, time: tables.attendancePunches.punchTime }).from(tables.attendancePunches)
    .where(and(eq(tables.attendancePunches.pin, pin), eq(tables.attendancePunches.punchDate, date))).orderBy(tables.attendancePunches.punchTime);
  if (!punches.length) return { matched: false as const };
  await tx.update(tables.attendancePunches).set({ employeeId: e.id }).where(inArray(tables.attendancePunches.id, punches.map((p) => p.id)));
  if (date < e.joinedOn || (e.leftOn && date > e.leftOn)) return { matched: true as const, applied: false };
  const [run] = await tx.select({ id: tables.payrollRuns.id }).from(tables.payrollRuns).where(and(
    eq(tables.payrollRuns.companyId, company.id), eq(tables.payrollRuns.period, date.slice(0, 7)), inArray(tables.payrollRuns.status, ["finalized", "paid"]))).limit(1);
  if (run) return { matched: true as const, applied: false };
  const [existing] = await tx.select().from(tables.attendance).where(and(eq(tables.attendance.employeeId, e.id), eq(tables.attendance.date, date)));
  // A day someone marked by hand, or put on leave, is theirs to change; the machine only fills and refreshes its own entries.
  if (existing && (existing.leaveRequestId || existing.source !== "device")) return { matched: true as const, applied: false };
  const shifts = await tx.select().from(tables.shifts).where(eq(tables.shifts.companyId, company.id));
  const shift = shifts.find((s) => s.id === e.shiftId) ?? shifts.find((s) => s.isDefault) ?? DEFAULT_SHIFT;
  const first = punches[0]!.time.slice(0, 5);
  const last = punches[punches.length - 1]!.time.slice(0, 5);
  const out = mins(last) - mins(first) >= MIN_STAY_MINUTES;
  const read = out ? readPunches(shift, first, last) : null;
  const values = out
    ? { status: read!.status, inTime: first, outTime: last, workedMinutes: read!.worked, late: read!.late, source: "device" as const, note: null }
    // One punch so far: present and in, with the late mark from that punch; nothing is decided about the day until they clock out.
    : { status: "present", inTime: first, outTime: null, workedMinutes: null, late: mins(first) > mins(shift.startTime) + shift.graceMinutes, source: "device" as const, note: null };
  if (existing) await tx.update(tables.attendance).set(values).where(eq(tables.attendance.id, existing.id));
  else await tx.insert(tables.attendance).values({ tenantId, employeeId: e.id, date, ...values });
  return { matched: true as const, applied: true };
}

export interface IngestResult { known: boolean; received: number; stored: number; applied: number; unmatched: number }

/**
 * A batch of punches pushed by a machine. They are kept as sent (a repeat is ignored), then each affected person-day is worked out again
 * from all of that day's punches. A machine that is not registered, or has been switched off, is told nothing and stores nothing.
 */
export async function ingestPunches(db: Db, serial: string, ip: string, body: string, stamp?: string | undefined): Promise<IngestResult> {
  const device = await deviceBySerial(db, serial);
  if (!device) return { known: false, received: 0, stored: 0, applied: 0, unmatched: 0 };
  const parsed = parseAttLog(body).slice(0, 5000);
  return withTenant(db, device.tenantId, async (tx) => {
    let stored = 0;
    const days = new Map<string, { pin: string; date: string }>();
    for (const p of parsed) {
      const ins = await tx.insert(tables.attendancePunches).values({ tenantId: device.tenantId, deviceId: device.id, pin: p.pin, punchDate: p.date, punchTime: p.time, status: p.status, verify: p.verify })
        .onConflictDoNothing().returning({ id: tables.attendancePunches.id });
      if (ins.length) { stored += 1; days.set(`${p.pin}|${p.date}`, { pin: p.pin, date: p.date }); }
    }
    let applied = 0;
    let unmatched = 0;
    for (const d of days.values()) {
      const r = await applyDay(tx, device.tenantId, d.pin, d.date);
      if (!r.matched) unmatched += 1; else if (r.applied) applied += 1;
    }
    await tx.update(tables.attendanceDevices).set({ lastSeenAt: new Date(), lastIp: ip.slice(0, 45), ...(stamp ? { lastStamp: stamp.slice(0, 20) } : {}) }).where(eq(tables.attendanceDevices.id, device.id));
    return { known: true, received: parsed.length, stored, applied, unmatched };
  });
}

/** A machine reaching out without punches (its handshake or a poll): note that it is alive. Returns its saved stamp. */
export async function deviceSeen(db: Db, serial: string, ip: string) {
  const device = await deviceBySerial(db, serial);
  if (!device) return null;
  return withTenant(db, device.tenantId, async (tx) => {
    const [d] = await tx.update(tables.attendanceDevices).set({ lastSeenAt: new Date(), lastIp: ip.slice(0, 45) }).where(eq(tables.attendanceDevices.id, device.id)).returning();
    return { lastStamp: d?.lastStamp ?? null };
  });
}

// ---- management (signed-in) ---------------------------------------------------------------------

export async function listDevices(tx: Tx) {
  const devices = await tx.select().from(tables.attendanceDevices).orderBy(tables.attendanceDevices.name);
  const counts = await tx.select({ deviceId: tables.attendancePunches.deviceId, n: sql<number>`count(*)::int`, unmatched: sql<number>`count(*) filter (where ${tables.attendancePunches.employeeId} is null)::int`, last: sql<string>`max(${tables.attendancePunches.punchDate} || ' ' || ${tables.attendancePunches.punchTime})` })
    .from(tables.attendancePunches).groupBy(tables.attendancePunches.deviceId);
  return devices.map((d) => { const c = counts.find((x) => x.deviceId === d.id); return { ...d, punches: c?.n ?? 0, unmatched: c?.unmatched ?? 0, lastPunch: c?.last ?? null }; });
}

export async function registerDevice(tx: Tx, actor: Actor, input: { name: string; serial: string }) {
  const serial = input.serial.trim().toUpperCase();
  if (!/^[A-Z0-9_.-]{4,40}$/.test(serial)) throw badRequest("invalid_serial");
  const taken = await tx.execute<{ id: string }>(sql`select id from attendance_device_by_serial(${serial})`);
  if ([...taken].length) throw conflict("serial_in_use");
  const [row] = await tx.insert(tables.attendanceDevices).values({ tenantId: actor.tenantId, name: input.name, serial }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "attendance_device", entityId: row!.id, after: { name: input.name, serial }, ip: actor.ip });
  return row!;
}

export async function updateDevice(tx: Tx, actor: Actor, id: string, patch: { name?: string | undefined; active?: boolean | undefined }) {
  const [row] = await tx.update(tables.attendanceDevices).set({ ...(patch.name !== undefined ? { name: patch.name } : {}), ...(patch.active !== undefined ? { active: patch.active } : {}) }).where(eq(tables.attendanceDevices.id, id)).returning();
  if (!row) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "attendance_device", entityId: id, after: patch, ip: actor.ip });
  return row;
}

export async function deleteDevice(tx: Tx, actor: Actor, id: string) {
  const gone = await tx.delete(tables.attendanceDevices).where(eq(tables.attendanceDevices.id, id)).returning({ id: tables.attendanceDevices.id });
  if (!gone.length) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "delete", entity: "attendance_device", entityId: id, ip: actor.ip });
}

/** After machine numbers are mapped to people, apply the punches that had no match yet. */
export async function reprocessUnmatched(tx: Tx, actor: Actor) {
  const rows = await tx.select({ pin: tables.attendancePunches.pin, date: tables.attendancePunches.punchDate }).from(tables.attendancePunches)
    .where(sql`${tables.attendancePunches.employeeId} is null`).groupBy(tables.attendancePunches.pin, tables.attendancePunches.punchDate).limit(2000);
  let applied = 0;
  for (const r of rows) if ((await applyDay(tx, actor.tenantId, r.pin, r.date)).matched) applied += 1;
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "attendance_punches", entityId: null, after: { reprocessed: applied }, ip: actor.ip });
  return { checked: rows.length, matched: applied };
}

/** The most recent punches with the person each was matched to, for checking a machine is feeding the system. */
export async function recentPunches(tx: Tx, limit = 50) {
  const rows = await tx.select({ p: tables.attendancePunches, device: tables.attendanceDevices.name, employee: tables.employees.name })
    .from(tables.attendancePunches).innerJoin(tables.attendanceDevices, eq(tables.attendanceDevices.id, tables.attendancePunches.deviceId))
    .leftJoin(tables.employees, eq(tables.employees.id, tables.attendancePunches.employeeId))
    .orderBy(sql`${tables.attendancePunches.punchDate} desc, ${tables.attendancePunches.punchTime} desc`).limit(limit);
  return rows.map((r) => ({ id: r.p.id, device: r.device, pin: r.p.pin, date: r.p.punchDate, time: r.p.punchTime, employee: r.employee }));
}
