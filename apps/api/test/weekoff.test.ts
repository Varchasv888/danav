import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const person = async (name: string, extra: Record<string, unknown> = {}) =>
  (await post("/employees", { name, gender: "female", joinedOn: "2026-01-01", workState: "27", components: [{ code: "BASIC", name: "Basic", monthly: "15000", pfWage: true }], ...extra })).body as { id: string };
const dayOf = async (employeeId: string, period: string) => (await get(`/attendance?period=${period}`)).employees.find((e: { id: string }) => e.id === employeeId);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("weekoff")).cookie;
  id.sunday = (await person("Follows Business")).id;
  id.friday = (await person("Friday Off", { weeklyOffs: [5] })).id;
  id.casual = (await t.call(c, "GET", "/leave-types")).body.find((x: { code: string }) => x.code === "CL").id;
});
afterAll(() => t.close());

// 2026-11-01 is a Sunday; 2026-11-06 is a Friday.
describe("week off per employee", () => {
  it("follows the business setting until a person has their own", async () => {
    const m = await get("/attendance?period=2026-11");
    expect(m.weeklyOffs).toEqual([0]);
    expect((await dayOf(id.sunday, "2026-11")).weeklyOffs).toEqual([0]);
    expect((await dayOf(id.friday, "2026-11")).weeklyOffs).toEqual([5]);
    expect((await post("/employees", { name: "Too Many", gender: "male", joinedOn: "2026-01-01", workState: "27", weeklyOffs: [0, 1, 2, 3] })).status).toBe(400);
  });

  it("counts leave days against each person's own off days", async () => {
    // Mon 2 Nov to Sun 8 Nov: the business has Sunday off (6 working days); the Friday person has Friday off (6 working days, Sunday worked).
    const a = await post("/leave-requests", { employeeId: id.sunday, leaveTypeId: id.casual, fromDate: "2026-11-02", toDate: "2026-11-08" });
    expect(Number(a.body.days)).toBe(6);
    const b = await post("/leave-requests", { employeeId: id.friday, leaveTypeId: id.casual, fromDate: "2026-11-06", toDate: "2026-11-08" });
    // Fri off, Sat and Sun worked.
    expect(Number(b.body.days)).toBe(2);
  });

  it("cancels an off day when the person comes in, or gives a day off in its place", async () => {
    expect((await post("/hr/week-off-changes", { employeeId: id.friday, date: "2026-11-10", kind: "worked" })).body.error).toBe("not_a_week_off");
    expect((await post("/hr/week-off-changes", { employeeId: id.friday, date: "2026-11-13", kind: "off" })).body.error).toBe("already_a_week_off");
    const worked = await post("/hr/week-off-changes", { employeeId: id.friday, date: "2026-11-13", kind: "worked", note: "Stock count" });
    expect(worked.status).toBe(201);
    const off = await post("/hr/week-off-changes", { employeeId: id.friday, date: "2026-11-14", kind: "off" });
    expect(off.status).toBe(201);
    expect((await dayOf(id.friday, "2026-11")).offChanges).toEqual({ "2026-11-13": "worked", "2026-11-14": "off" });
    // Leave over those two days: the 13th now counts as a working day, the 14th does not.
    const l = await post("/leave-requests", { employeeId: id.friday, leaveTypeId: id.casual, fromDate: "2026-11-13", toDate: "2026-11-14" });
    expect(Number(l.body.days)).toBe(1);
    const list = await get("/hr/week-off-changes?period=2026-11");
    expect(list.map((x: { date: string }) => x.date)).toEqual(["2026-11-14", "2026-11-13"]);
    expect((await t.call(c, "DELETE", `/hr/week-off-changes/${list[0].id}`)).status).toBe(200);
    expect((await get("/hr/week-off-changes?period=2026-11")).length).toBe(1);
  });

  it("does not flag an absence on the person's own week off", async () => {
    await t.call(c, "PUT", "/attendance", { entries: [{ employeeId: id.friday, date: "2026-11-20", status: "absent" }, { employeeId: id.sunday, date: "2026-11-20", status: "absent" }] });
    const a = (await get("/hr/attendance-alerts?date=2026-11-20")).alerts as { employeeId: string }[];
    // 20 Nov 2026 is a Friday: the Friday person is on their week off.
    expect(a.map((x) => x.employeeId)).toEqual([id.sunday]);
  });

  it("is private to the business", async () => {
    const other = (await t.signup("weekoff-other")).cookie;
    expect((await t.call(other, "GET", "/hr/week-off-changes")).body).toEqual([]);
    const list = await get("/hr/week-off-changes");
    expect((await t.call(other, "DELETE", `/hr/week-off-changes/${list[0].id}`)).status).toBe(404);
  });
});
