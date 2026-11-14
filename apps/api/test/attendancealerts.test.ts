import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const mark = (employeeId: string, date: string, status: string) => t.call(c, "PUT", "/attendance", { entries: [{ employeeId, date, status }] });
const alerts = async (date: string) => (await get(`/hr/attendance-alerts?date=${date}`)) as { workingDay: boolean; staff: number; absent: number; late: number; alerts: { employeeId: string; kind: string }[] };
const person = async (name: string) => (await post("/employees", { name, gender: "female", joinedOn: "2026-01-01", workState: "27", components: [{ code: "BASIC", name: "Basic", monthly: "15000", pfWage: true }] })).body.id as string;

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("attalerts")).cookie;
  id.a = await person("Asha Present");
  id.b = await person("Bina Absent");
  id.c = await person("Chitra Unmarked");
  id.d = await person("Divya Late");
});
afterAll(() => t.close());

describe("attendance alerts", () => {
  it("on a working day with nothing marked, everyone is taken as present and nobody is flagged", async () => {
    const r = await alerts("2026-10-14"); // a Wednesday
    expect(r).toMatchObject({ workingDay: true, staff: 4, absent: 0, late: 0, alerts: [] });
  });

  it("flags the absent and the late, and says nothing about people present on time", async () => {
    await mark(id.a, "2026-10-14", "present");
    await mark(id.b, "2026-10-14", "absent");
    await mark(id.d, "2026-10-14", "present");
    // A late arrival is recorded from the punch against the shift, as a punch file import does it.
    const shift = await post("/shifts", { name: "Day", startTime: "09:30", endTime: "18:00", graceMinutes: 10, fullDayMinutes: 480, halfDayMinutes: 240, isDefault: true });
    expect(shift.status).toBe(201);
    const code = ((await get("/employees")) as { id: string; code: string }[]).find((e) => e.id === id.d)!.code;
    expect((await post("/attendance/import", { dryRun: false, rows: [{ code, date: "2026-10-14", in: "10:15", out: "18:05" }] })).status).toBe(200);
    const r = await alerts("2026-10-14");
    const kinds = Object.fromEntries(r.alerts.map((x) => [x.employeeId, x.kind]));
    expect(kinds[id.b]).toBe("absent");
    expect(kinds[id.c]).toBeUndefined();
    expect(kinds[id.d]).toBe("late");
    expect(kinds[id.a]).toBeUndefined();
    expect(r).toMatchObject({ absent: 1, late: 1 });
  });

  it("a weekly off raises nothing, and people not yet joined are not counted", async () => {
    expect(await alerts("2026-10-18")).toMatchObject({ workingDay: false, absent: 0, late: 0, alerts: [] }); // a Sunday
    expect((await alerts("2025-12-01")).staff).toBe(0);
  });

  it("keeps businesses apart, and refuses a bad date", async () => {
    const other = (await t.signup("attalerts-other")).cookie;
    expect((await t.call(other, "GET", "/hr/attendance-alerts?date=2026-10-14")).body.staff).toBe(0);
    expect((await t.call(c, "GET", "/hr/attendance-alerts?date=bad")).status).toBe(400);
  });
});
