import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";
import { businessDate } from "@varchasv/domain";

let t: Awaited<ReturnType<typeof testApp>>;
let token = "";
let cookie = "";
let deviceId = "";
let cursor = "";
const id: Record<string, string> = {};

async function device(method: string, url: string, payload?: unknown) {
  const res = await t.app.inject({ method: method as "GET", url, headers: { authorization: `Bearer ${token}` }, payload: payload as object });
  return { status: res.statusCode, body: res.json() };
}
const web = (method: string, url: string, body?: unknown) => t.call(cookie, method, url, body);
const push = (ops: unknown[]) => device("POST", "/sync/push", { deviceId, ops });
/** Pulls until `found` sees what it's waiting for (the horizon can hold back a just-committed change). */
async function pullUntil(found: (b: Record<string, unknown[]>) => boolean) {
  // Other test files' open transactions hold the horizon back too, so give it time, not just retries.
  for (let i = 0; i < 120; i++) {
    const r = await device("GET", `/sync/pull?deviceId=${deviceId}&cursor=${cursor}`);
    cursor = r.body.cursor;
    if (found(r.body)) return r.body;
    await new Promise((ok) => setTimeout(ok, 50 * Math.min(i + 1, 5)));
  }
  throw new Error("change never arrived");
}
const thisMonth = businessDate();

beforeAll(async () => {
  t = await testApp();
  const s = await t.signup("hrsync", { gstin: "27AAPFU0939F1ZV" });
  cookie = s.cookie;
  token = (await t.call("", "POST", "/auth/login", { email: s.email, password: "correct horse battery", client: "app" })).body.token;
  deviceId = (await device("POST", "/devices", { name: "Front desk", platform: "android" })).body.id;
  id.emp = (await web("POST", "/employees", {
    name: "Meera Patil", gender: "female", joinedOn: "2026-01-01", workState: "27", bankAccount: "50100012345678", bankIfsc: "HDFC0001234",
    components: [{ code: "BASIC", name: "Basic", monthly: "12000", pfWage: true }, { code: "HRA", name: "HRA", monthly: "4000", hra: true }],
  })).body.id;
});
afterAll(() => t.close());

describe("HR on offline devices", () => {
  it("sends employees (without bank details) and leave types in the first pull", async () => {
    const r = await device("GET", `/sync/pull?deviceId=${deviceId}`);
    cursor = r.body.cursor;
    expect(r.body.employees).toEqual([expect.objectContaining({ id: id.emp, code: "E0001", name: "Meera Patil", status: "active" })]);
    expect(r.body.employees[0].bankAccountEnc).toBeUndefined();
    expect(r.body.leaveTypes.map((l: { code: string }) => l.code).sort()).toEqual(["CL", "EL", "LOP", "SL"]);
    for (const l of r.body.leaveTypes) id[l.code] = l.id;
    expect(r.body.attendanceWindow.employeeIds).toEqual([id.emp]);
  });

  // Change delivery waits for other open transactions (the sync horizon), and the other test files share this database, so this can be late: wait up to a minute rather than retry, because a retry would replay the pushed changes.
  it("takes attendance and leave marked offline, once", { timeout: 60_000 }, async () => {
    const leaveId = crypto.randomUUID();
    const ops = [
      { opId: crypto.randomUUID(), kind: "attendance.mark", payload: { employeeId: id.emp, date: thisMonth, status: "absent" } },
      { opId: crypto.randomUUID(), kind: "leave.request", payload: { id: leaveId, employeeId: id.emp, leaveTypeId: id.CL, fromDate: "2027-01-04", toDate: "2027-01-04", reason: "Doctor" } },
    ];
    const r = await push(ops);
    expect(r.body.results.map((x: { ok: boolean }) => x.ok)).toEqual([true, true]);
    expect((await push([ops[1]])).body.results[0]).toMatchObject({ ok: true, result: { id: leaveId } }); // replay: same request
    expect((await web("GET", `/leave-requests?employeeId=${id.emp}`)).body).toHaveLength(1);
    // The two changes commit separately, so a pull may bring one and the next the other: collect across pulls.
    const pulled: Record<string, unknown[]> = { attendance: [], leaveRequests: [] };
    await pullUntil((b) => { pulled.attendance!.push(...(b.attendance ?? [])); pulled.leaveRequests!.push(...(b.leaveRequests ?? [])); return pulled.attendance!.length > 0 && pulled.leaveRequests!.length > 0; });
    expect(pulled.attendance).toEqual([expect.objectContaining({ employeeId: id.emp, date: thisMonth, status: "absent" })]);
    expect(pulled.leaveRequests).toEqual([expect.objectContaining({ id: leaveId, status: "pending", days: "1.0" })]);
  });

  it("a day set back to present on the web reaches the device as a removal", { timeout: 60_000 }, async () => {
    await web("PUT", "/attendance", { entries: [{ employeeId: id.emp, date: thisMonth, status: "present" }] });
    const b = await pullUntil((x) => ((x.attendanceWindow as unknown as { employeeIds: string[] })?.employeeIds ?? []).includes(id.emp));
    expect(b.attendance).toEqual([]); // the device clears this employee's recent days and has none to add back
  });

  it("reports an offline change the server cannot accept", async () => {
    const bad = await push([{ opId: crypto.randomUUID(), kind: "attendance.mark", payload: { employeeId: id.emp, date: "2025-12-01", status: "absent" } }]);
    expect(bad.body.results[0]).toMatchObject({ ok: false, error: "not_employed_on_date" });
  });
});
