import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const day = (offset: number) => businessDate(new Date(Date.now() + offset * 86_400_000));

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("kyc", { gstin: "27AAPFU0939F1ZV" })).cookie;
  id.emp = (await post("/employees", { name: "Driver Dinesh", gender: "male", joinedOn: "2026-09-01", workState: "27", components: [{ code: "BASIC", name: "Basic", monthly: "15000", pfWage: true }] })).body.id;
});
afterAll(() => t.close());

describe("employee documents", () => {
  it("keeps a document with its expiry and shows only the last digits of its number", async () => {
    // Blank boxes on the form arrive as null.
    const r = await post(`/employees/${id.emp}/documents`, { kind: "drivingLicence", number: "MH1420110062821", issuedOn: "2021-01-10", expiresOn: day(10), note: null });
    expect(r.status).toBe(201);
    expect(r.body.number).toBe("********2821");
    expect(r.body.number).not.toContain("MH14");
    id.licence = r.body.id;
    await post(`/employees/${id.emp}/documents`, { kind: "aadhaar", number: "123456789012" });
    const list = (await get(`/employees/${id.emp}/documents`)) as { kind: string; number: string | null }[];
    expect(list.map((d) => d.kind).sort()).toEqual(["aadhaar", "drivingLicence"]);
    expect(JSON.stringify(list)).not.toContain("123456789012");
  });

  it("keeps the stored number when an edit leaves it blank, and refuses an expiry before issue", async () => {
    const r = await t.call(c, "PATCH", `/employees/${id.emp}/documents/${id.licence}`, { kind: "drivingLicence", expiresOn: day(100) });
    expect(r.body).toMatchObject({ number: "********2821", expiresOn: day(100) });
    const bad = await t.call(c, "PATCH", `/employees/${id.emp}/documents/${id.licence}`, { kind: "drivingLicence", issuedOn: "2026-01-10", expiresOn: "2025-01-10" });
    expect(bad.body.error).toBe("expiry_before_issue");
    await t.call(c, "PATCH", `/employees/${id.emp}/documents/${id.licence}`, { kind: "drivingLicence", expiresOn: day(10) });
  });

  it("lists what lapses soon, soonest first, with days left, and drops what is further away", async () => {
    await post(`/employees/${id.emp}/documents`, { kind: "medicalFitness", expiresOn: day(-3) });
    await post(`/employees/${id.emp}/documents`, { kind: "passport", expiresOn: day(400) });
    const soon = (await get("/hr/documents/expiring?days=30")) as { kind: string; daysLeft: number; employee: string }[];
    expect(soon.map((d) => [d.kind, d.daysLeft])).toEqual([["medicalFitness", -3], ["drivingLicence", 10]]);
    expect(soon[0]!.employee).toBe("Driver Dinesh");
    expect(((await get("/hr/documents/expiring?days=500")) as unknown[]).length).toBe(3);
  });

  it("removes a document and keeps businesses apart", async () => {
    expect((await t.call(c, "DELETE", `/employees/${id.emp}/documents/${id.licence}`)).status).toBe(200);
    expect(((await get(`/employees/${id.emp}/documents`)) as { kind: string }[]).some((d) => d.kind === "drivingLicence")).toBe(false);
    const other = (await t.signup("kyc-other")).cookie;
    expect((await t.call(other, "GET", `/employees/${id.emp}/documents`)).body).toEqual([]);
    expect((await t.call(other, "POST", `/employees/${id.emp}/documents`, { kind: "pan" })).status).toBe(404);
    expect((await t.call(other, "GET", "/hr/documents/expiring")).body).toEqual([]);
  });
});
