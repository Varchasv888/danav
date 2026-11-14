import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();
const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("proofs", { gstin: "27AAPFU0939F1ZV" })).cookie as string;
  const groups = (await get("/accounts/groups")) as { id: string; key: string }[];
  id.shop = (await post("/accounts", { name: "Proof Shop", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.shirt = (await post("/items", { name: "Proof Shirt", hsn: "6205", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, saleRate: "500" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "100", rate: "300" }] });
});
afterAll(() => t.close());

const challan = async (qty: string) => {
  const r = await post("/delivery-notes", { customerId: id.shop, date: today, warehouseId: id.main, lines: [{ itemId: id.shirt, qty }] });
  expect(r.status, JSON.stringify(r.body)).toBe(201);
  const doc = await get(`/delivery-notes/${r.body.id}`);
  return { id: r.body.id as string, lineId: doc.lines[0].id as string };
};

describe("proof of delivery", () => {
  it("records a clean delivery with no claim", async () => {
    const n = await challan("10");
    expect((await get(`/delivery-notes/${n.id}/proof`)).proof).toBeNull();
    const r = await post(`/delivery-notes/${n.id}/proof`, { receivedOn: today, receivedBy: "Ramesh, shop owner", lines: [] });
    expect(r.status, JSON.stringify(r.body)).toBe(201);
    expect(r.body).toMatchObject({ discrepancy: false, state: "none", receivedBy: "Ramesh, shop owner" });
    expect((await post(`/delivery-notes/${n.id}/proof`, { receivedOn: today, receivedBy: "Again", lines: [] })).body.error).toBe("proof_exists");
  });

  it("short and damaged goods open a claim with an owner and a deadline a week out, until it is closed", async () => {
    const n = await challan("20");
    expect((await post(`/delivery-notes/${n.id}/proof`, { receivedOn: today, receivedBy: "Sita", lines: [{ noteLineId: n.lineId, short: "15", damaged: "6" }] })).body.error).toBe("more_than_delivered");
    expect((await post(`/delivery-notes/${n.id}/proof`, { receivedOn: "2099-01-01", receivedBy: "Sita", lines: [] })).body.error).toBe("received_in_future");
    const r = await post(`/delivery-notes/${n.id}/proof`, { receivedOn: today, receivedBy: "Sita", lines: [{ noteLineId: n.lineId, short: "2", damaged: "1" }] });
    expect(r.status, JSON.stringify(r.body)).toBe(201);
    expect(r.body).toMatchObject({ discrepancy: true, claimStatus: "open", state: "open" });
    expect(r.body.lines[0]).toMatchObject({ short: "2.0000", damaged: "1.0000", delivered: "20.0000" });
    const rep = await get("/reports/delivery-proofs");
    expect(rep.claims.map((x: { noteId: string }) => x.noteId)).toContain(n.id);
    expect((await post(`/delivery-proofs/${r.body.id}/close`, { status: "settled", note: "" })).status).toBe(400);
    expect((await post(`/delivery-proofs/${r.body.id}/close`, { status: "settled", note: "Credit note raised" })).status).toBe(200);
    expect((await post(`/delivery-proofs/${r.body.id}/close`, { status: "waived", note: "Again" })).body.error).toBe("claim_closed");
    expect((await get("/reports/delivery-proofs")).claims.map((x: { noteId: string }) => x.noteId)).not.toContain(n.id);
  });

  it("keeps other businesses out", async () => {
    const other = (await t.signup("proofs-other")).cookie;
    const n = await challan("1");
    expect((await t.call(other, "POST", `/delivery-notes/${n.id}/proof`, { receivedOn: today, receivedBy: "Nobody", lines: [] })).status).toBe(404);
  });
});
