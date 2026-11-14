import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { parseAttLog } from "../src/services/devicepunch.js";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
let SN = "";

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
/** What the machine sends: plain text, no login. */
const machine = (method: "GET" | "POST", url: string, payload?: string) => t.app.inject({ method, url, headers: { "content-type": "text/plain" }, ...(payload !== undefined ? { payload } : {}) } as never);
const push = (log: string, sn = SN) => machine("POST", `/iclock/cdata?SN=${sn}&table=ATTLOG&Stamp=9${Date.now() % 1000}`, log);
const attendanceOf = async (employeeId: string, date: string) => {
  const r = await get(`/attendance?period=${date.slice(0, 7)}`);
  const e = (r.employees as { id: string; days: Record<string, { status: string; in: string | null; out: string | null; late: boolean }> }[]).find((x) => x.id === employeeId);
  const d = e?.days[date];
  return d ? { status: d.status, inTime: d.in, outTime: d.out, late: d.late } : undefined;
};
const person = async (name: string, extra: Record<string, unknown> = {}) => (await post("/employees", { name, gender: "female", joinedOn: "2026-01-01", workState: "27", components: [{ code: "BASIC", name: "Basic", monthly: "15000", pfWage: true }], ...extra })).body as { id: string; code: string };

beforeAll(async () => {
  t = await testApp();
  SN = `SN${t.run}`.slice(0, 30).toUpperCase();
  c = (await t.signup("iclock")).cookie;
  const a = await person("Asha Punch");
  const b = await person("Bina Pin", { punchPin: "77" });
  id.a = a.id; id.b = b.id; id.aCode = a.code;
  expect(Number(a.code.replace(/\D/g, ""))).toBe(1);
  id.late = (await person("Late Pin Nine")).id;
  await post("/shifts", { name: "Day", startTime: "09:30", endTime: "18:00", graceMinutes: 10, fullDayMinutes: 480, halfDayMinutes: 240, isDefault: true });
});
afterAll(() => t.close());

describe("attendance machine (ADMS push)", () => {
  it("reads punch lines, skipping anything that is not one", () => {
    expect(parseAttLog("1\t2026-10-14 09:05:00\t0\t1\t0\n\nheader line\n77 2026-10-14 18:00:01 1 15\nATTLOG 5\t2026-10-14 08:00:00")).toEqual([
      { pin: "1", date: "2026-10-14", time: "09:05:00", status: "0", verify: "1" },
      { pin: "77", date: "2026-10-14", time: "18:00:01", status: "1", verify: "15" },
      { pin: "5", date: "2026-10-14", time: "08:00:00", status: null, verify: null },
    ]);
  });

  it("an unregistered machine stores nothing, whatever it sends", async () => {
    const r = await push("1\t2026-10-14 09:05:00\t0\t1", "UNKNOWNSN99");
    expect(r.statusCode).toBe(200);
    expect(r.body).toBe("OK: 0");
    expect(await get("/attendance/punches")).toEqual([]);
  });

  it("a registered machine says hello and is told its settings", async () => {
    expect((await post("/attendance/devices", { name: "Front gate", serial: SN })).status).toBe(201);
    const hello = await machine("GET", `/iclock/cdata?SN=${SN}&options=all`);
    expect(hello.statusCode).toBe(200);
    expect(hello.body).toContain(`GET OPTION FROM: ${SN}`);
    expect(hello.body).toContain("TimeZone=330");
    const list = await get("/attendance/devices");
    expect(list[0]).toMatchObject({ name: "Front gate", serial: SN });
    expect(list[0].lastSeenAt).toBeTruthy();
  });

  it("matches the machine number to the employee code or the saved punch number, and reads the day", async () => {
    const r = await push("1\t2026-10-14 09:05:00\t0\t1\n77\t2026-10-14 09:50:00\t0\t1\n9\t2026-10-14 09:00:00\t0\t1");
    expect(r.body).toBe("OK: 3");
    // One punch so far: present, in at that time, nothing decided about the day yet.
    expect(await attendanceOf(id.a, "2026-10-14")).toMatchObject({ status: "present", inTime: "09:05", outTime: null, late: false });
    const bina = await attendanceOf(id.b, "2026-10-14");
    expect(bina).toMatchObject({ status: "present", inTime: "09:50", late: true });
    expect((await get("/attendance/punches")).filter((p: { employee: string | null }) => p.employee).length).toBe(2);
  });

  it("works the day out from the first and last punch when the person clocks out", async () => {
    await push("77\t2026-10-14 18:05:00\t1\t1\n1\t2026-10-14 13:00:00\t1\t1");
    expect(await attendanceOf(id.b, "2026-10-14")).toMatchObject({ status: "present", inTime: "09:50", outTime: "18:05", late: true });
    // A second punch minutes after the first is a double tap, not clocking out.
    await push("77\t2026-10-15 09:00:00\t0\t1\n77\t2026-10-15 09:03:00\t0\t1");
    expect(await attendanceOf(id.b, "2026-10-15")).toMatchObject({ outTime: null });
  });

  it("a repeat is ignored, and a half day reads as one", async () => {
    expect((await push("77\t2026-10-14 18:05:00\t1\t1")).body).toBe("OK: 0");
    await push("77\t2026-10-16 09:30:00\t0\t1\n77\t2026-10-16 14:00:00\t1\t1");
    expect(await attendanceOf(id.b, "2026-10-16")).toMatchObject({ status: "half_day" });
  });

  it("never overrides a day somebody marked by hand", async () => {
    await t.call(c, "PUT", "/attendance", { entries: [{ employeeId: id.b, date: "2026-10-17", status: "absent" }] });
    await push("77\t2026-10-17 09:30:00\t0\t1\n77\t2026-10-17 18:00:00\t1\t1");
    expect(await attendanceOf(id.b, "2026-10-17")).toMatchObject({ status: "absent" });
  });

  it("holds punches for a number nobody owns, then applies them once the person is mapped", async () => {
    expect((await get("/attendance/punches")).some((p: { pin: string; employee: string | null }) => p.pin === "9" && p.employee === null)).toBe(true);
    await t.call(c, "PATCH", `/employees/${id.late}`, { punchPin: "9" });
    expect((await post("/attendance/punches/reprocess", {})).body).toMatchObject({ matched: 1 });
    expect((await get("/attendance/punches")).find((p: { pin: string }) => p.pin === "9").employee).toBe("Late Pin Nine");
  });

  it("a switched-off machine stores nothing, and a serial belongs to one business", async () => {
    const dev = (await get("/attendance/devices"))[0];
    await t.call(c, "PATCH", `/attendance/devices/${dev.id}`, { active: false });
    expect((await push("77\t2026-10-20 09:00:00\t0\t1")).body).toBe("OK: 0");
    const other = (await t.signup("iclock-other")).cookie;
    expect((await t.call(other, "POST", "/attendance/devices", { name: "Copy", serial: SN })).status).toBe(409);
    expect((await t.call(other, "GET", "/attendance/devices")).body).toEqual([]);
    expect((await t.call(other, "GET", "/attendance/punches")).body).toEqual([]);
    expect((await t.call(other, "PATCH", `/attendance/devices/${dev.id}`, { active: true })).status).toBe(404);
    expect((await t.call(c, "POST", "/attendance/devices", { name: "Bad", serial: "x" })).status).toBe(400);
  });
});
