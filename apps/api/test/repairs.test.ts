import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { LIFECYCLES, canMove } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const intake = (over: Record<string, unknown> = {}) => post("/repairs", { receivedOn: "2026-10-01", customerName: "Anil Rao", customerPhone: "9822211100", itemDescription: "Leather belt, buckle broken", complaint: "Buckle snapped", ...over });
const act = (repairId: string, body: Record<string, unknown>) => post(`/repairs/${repairId}/act`, body);
const status = async (repairId: string) => (await get(`/repairs/${repairId}`)).status as string;

beforeAll(async () => { t = await testApp(); c = (await t.signup("repairs")).cookie; });
afterAll(() => t.close());

describe("service desk repairs", () => {
  it("takes a repair in with a number and follows the path to delivery", async () => {
    const r = await intake();
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({ status: "received", warranty: false, deposit: "0.00" });
    expect(r.body.number).toMatch(/^RP\//);
    id.a = r.body.id;
    const path: string[] = [await status(id.a)];
    for (const step of [
      { action: "estimate", estimate: "450", diagnosis: "Replace buckle and re-stitch" }, { action: "approve" }, { action: "start" },
      { action: "ready", spares: [{ name: "Brass buckle", qty: "1", cost: "120" }] }, { action: "deliver", date: "2026-10-06" },
    ]) { expect((await act(id.a, step)).status).toBe(200); path.push(await status(id.a)); }
    expect(path).toEqual(["received", "estimated", "approved", "in_repair", "ready", "delivered"]);
    for (let i = 1; i < path.length; i++) expect(canMove("repairJob", path[i - 1]!, path[i]!)).toBe(true);
    expect(await get(`/repairs/${id.a}`)).toMatchObject({ estimate: "450.00", finalCharge: "450.00", deliveredOn: "2026-10-06", diagnosis: "Replace buckle and re-stitch", spares: [{ name: "Brass buckle", qty: "1", cost: "120" }] });
  });

  it("will not skip a step: no work before an approved estimate, no delivery before ready", async () => {
    const r = (await intake()).body.id as string;
    expect((await act(r, { action: "start" })).body.error).toBe("repair_cannot_move");
    expect((await act(r, { action: "approve" })).body.error).toBe("repair_cannot_move");
    expect((await act(r, { action: "deliver", date: "2026-10-05" })).body.error).toBe("repair_cannot_move");
    await act(r, { action: "estimate", estimate: "200" });
    expect((await act(r, { action: "ready" })).body.error).toBe("repair_cannot_move");
  });

  it("a declined estimate ends the job with its reason; a delivered one cannot be cancelled", async () => {
    const r = (await intake()).body.id as string;
    await act(r, { action: "estimate", estimate: "900" });
    expect((await act(r, { action: "decline", reason: "Too costly" })).body).toMatchObject({ status: "declined", reason: "Too costly" });
    expect((await act(r, { action: "approve" })).body.error).toBe("repair_cannot_move");
    expect((await act(id.a, { action: "cancel", reason: "Changed mind" })).body.error).toBe("repair_cannot_move");
    expect((await act(r, { action: "cancel", reason: "x" })).status).toBe(400);
  });

  it("a warranty repair goes straight to the bench and costs the customer nothing", async () => {
    const w = (await intake({ warranty: true, itemDescription: "Watch, bought last month" })).body.id as string;
    expect((await act(w, { action: "estimate", estimate: "100" })).body.error).toBe("warranty_needs_no_estimate");
    expect((await act(w, { action: "start", diagnosis: "Faulty movement" })).status).toBe(200);
    const done = await act(w, { action: "ready", finalCharge: "999" });
    expect(done.body).toMatchObject({ status: "ready", finalCharge: "0.00" });
  });

  it("lists and searches repairs, and shows what is still open and late", async () => {
    const late = (await intake({ receivedOn: "2026-09-01", promisedOn: "2026-09-10", customerName: "Late Customer" })).body.id as string;
    expect((await get("/repairs?search=late%20customer")).map((x: { id: string }) => x.id)).toEqual([late]);
    expect((await get("/repairs?status=delivered")).map((x: { id: string }) => x.id)).toEqual([id.a]);
    const open = (await get("/repairs/open")) as { id: string; overdue: boolean; waitingDays: number }[];
    expect(open.find((x) => x.id === late)).toMatchObject({ overdue: true });
    expect(open.find((x) => x.id === id.a)).toBeUndefined();
    expect(open[0]!.waitingDays).toBeGreaterThanOrEqual(open.at(-1)!.waitingDays);
  });

  it("checks the phone and keeps businesses apart", async () => {
    expect((await intake({ customerPhone: "123" })).status).toBe(400);
    const other = (await t.signup("repairs-other")).cookie;
    expect((await t.call(other, "GET", "/repairs")).body).toEqual([]);
    expect((await t.call(other, "POST", `/repairs/${id.a}/act`, { action: "approve" })).status).toBe(404);
    expect(Object.keys(LIFECYCLES.repairJob)).toContain("in_repair");
  });
});

describe("repair money in the books", () => {
  // A fresh business, so the balances start from nothing.
  beforeAll(async () => { c = (await t.signup("repairs-money")).cookie; });
  const balance = async (key: string) => {
    const accounts = (await get("/accounts")) as { key: string | null; balance: string }[];
    return accounts.find((a) => a.key === key)?.balance ?? "0.00";
  };

  it("holds a deposit as a liability, then books the charge as income when delivered", async () => {
    const r = await intake({ deposit: "300" });
    expect(await balance("cash")).toBe("300.00");
    expect(await balance("repair_deposits")).toBe("-300.00");
    expect((await act(r.body.id, { action: "estimate", estimate: "500" })).status).toBe(200);
    await act(r.body.id, { action: "approve" });
    await act(r.body.id, { action: "start" });
    await act(r.body.id, { action: "ready" });
    expect((await act(r.body.id, { action: "deliver", date: "2026-10-05" })).status).toBe(200);
    // 500 charged: 300 came from the deposit, 200 in cash.
    expect(await balance("repair_deposits")).toBe("0.00");
    expect(await balance("repair_income")).toBe("-500.00");
    expect(await balance("cash")).toBe("500.00");
    expect(((await get("/reports/integrity")) as { ok: boolean }).ok).toBe(true);
  });

  it("hands a deposit back when the repair is declined or costs less than the deposit", async () => {
    const before = Number(await balance("cash"));
    const d = await intake({ deposit: "200" });
    await act(d.body.id, { action: "estimate", estimate: "900" });
    await act(d.body.id, { action: "decline", reason: "Too dear" });
    expect(Number(await balance("cash"))).toBe(before);
    expect(await balance("repair_deposits")).toBe("0.00");
    const small = await intake({ deposit: "400" });
    await act(small.body.id, { action: "estimate", estimate: "150" });
    await act(small.body.id, { action: "approve" });
    await act(small.body.id, { action: "start" });
    await act(small.body.id, { action: "ready" });
    await act(small.body.id, { action: "deliver", date: "2026-10-06" });
    // 150 income, 250 of the deposit given back.
    expect(await balance("repair_income")).toBe("-650.00");
    expect(Number(await balance("cash"))).toBe(before + 150);
    expect(await balance("repair_deposits")).toBe("0.00");
  });

  it("a warranty repair with no charge books no income", async () => {
    const w = await intake({ warranty: true });
    await act(w.body.id, { action: "start" });
    await act(w.body.id, { action: "ready" });
    await act(w.body.id, { action: "deliver", date: "2026-10-07" });
    expect(await balance("repair_income")).toBe("-650.00");
  });
});
