import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const act = (repairId: string, body: Record<string, unknown>) => post(`/repairs/${repairId}/act`, body);
const tb = async (key: string) => ((await get("/reports/trial-balance?asOf=2027-03-31")).rows as { accountId: string; dr: string; cr: string }[]).find((r) => r.accountId === id[key]) ?? { dr: "0.00", cr: "0.00" };

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("servicedesk", { gstin: "27AAPFU0939F1ZV" })).cookie;
});
afterAll(() => t.close());

const toReady = async (over: Record<string, unknown>, charge: string) => {
  const r = await post("/repairs", { receivedOn: "2026-10-01", customerName: "Anil Rao", customerPhone: "9822211100", itemDescription: "Leather bag", ...over });
  for (const step of [{ action: "estimate", estimate: charge }, { action: "approve" }, { action: "start" }, { action: "ready", finalCharge: charge }]) await act(r.body.id, step);
  return r.body.id as string;
};

describe("GST on a repair", () => {
  it("splits a paid repair into income and tax, half and half, at delivery", async () => {
    const r = await toReady({ deposit: "200" }, "1180");
    const done = await act(r, { action: "deliver", date: "2026-10-06", gstRate: "18" });
    expect(done.status).toBe(200);
    expect((await get(`/repairs/${r}`))).toMatchObject({ gstRate: "18.00", gstAmount: "180.00", status: "delivered" });
    for (const a of await get("/accounts") as { id: string; key: string | null }[]) if (a.key) id[a.key] = a.id;
    expect((await tb("repair_income")).cr).toBe("1000.00");
    expect((await tb("output_cgst")).cr).toBe("90.00");
    expect((await tb("output_sgst")).cr).toBe("90.00");
  });

  it("charges no tax on a repair under warranty, and refuses a silly rate", async () => {
    const w = await toReady({ warranty: true }, "0");
    expect((await act(w, { action: "deliver", date: "2026-10-07", gstRate: "18" })).status).toBe(200);
    expect((await get(`/repairs/${w}`)).gstAmount).toBe("0.00");
    const p = await toReady({}, "500");
    expect((await act(p, { action: "deliver", date: "2026-10-07", gstRate: "40" })).status).toBe(400);
  });
});

describe("inquiry log", () => {
  it("records a question with a follow-up day, shows what is due, and closes it with what came of it", async () => {
    const a = await post("/inquiries", { date: "2026-10-01", customerName: "Meena", customerPhone: "9811122233", kind: "tailoring", note: "Wants a blouse stitched by Diwali", followUpOn: "2026-10-05" });
    expect(a.status).toBe(201);
    expect((await post("/inquiries", { date: "2026-10-05", customerName: "X", kind: "other", note: "Test note", followUpOn: "2026-10-01" })).status).toBe(400);
    const list = await get("/inquiries?status=open");
    expect(list).toHaveLength(1);
    expect(list[0].due).toBe(true); // the follow-up day has come
    expect((await post(`/inquiries/${a.body.id}/close`, { status: "closed" })).body.error).toBe("outcome_required");
    expect((await post(`/inquiries/${a.body.id}/close`, { status: "closed", outcome: "Booked elsewhere" })).status).toBe(200);
    expect((await post(`/inquiries/${a.body.id}/close`, { status: "closed", outcome: "Again" })).status).toBe(409);
    expect(await get("/inquiries?status=open")).toHaveLength(0);
  });
});

describe("service-desk customers", () => {
  it("shows what each customer has paid up front, what is held for them and what is still to collect", async () => {
    const r = await toReady({ customerName: "Latha Iyer", customerPhone: "9833344455", deposit: "300" }, "900");
    void r;
    const open = await post("/repairs", { receivedOn: "2026-10-09", customerName: "Latha Iyer", customerPhone: "9833344455", itemDescription: "Watch strap", deposit: "100" });
    expect(open.status).toBe(201);
    const l = (await get("/reports/service-customers")).customers.find((x: { phone: string }) => x.phone === "9833344455");
    expect(l).toMatchObject({ name: "Latha Iyer", open: 2, held: "400.00", due: "600.00" });
    expect(l.jobs).toHaveLength(2);
  });
});

describe("telling the customer", () => {
  it("queues a message when a repair is ready and when it is handed back, once each", async () => {
    const r = await toReady({ customerName: "Notify Me", customerPhone: "9877700011" }, "400");
    const before = ((await get("/comms/outbox")) as { to: string }[]).filter((m) => m.to === "919877700011").length;
    expect(before).toBe(2); // ready: WhatsApp and SMS
    await act(r, { action: "deliver", date: "2026-10-08", gstRate: "0" });
    const after = ((await get("/comms/outbox")) as { to: string; body: string }[]).filter((m) => m.to === "919877700011");
    expect(after).toHaveLength(4);
    expect(after.some((m) => m.body.includes("ready to collect"))).toBe(true);
    expect(after.some((m) => m.body.includes("delivered"))).toBe(true);
  });
});
