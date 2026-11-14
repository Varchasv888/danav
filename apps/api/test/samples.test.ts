import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const stock = async () => Number(((await get(`/reports/stock-summary?asOf=${today}`)).rows as { itemId: string; qty: string }[]).find((r) => r.itemId === id.shirt)!.qty);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("samples", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.buyer = (await post("/accounts", { name: "Sample Buyer", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.shirt = (await post("/items", { name: "Sample Shirt", hsn: "6205", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, saleRate: "700" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "20", rate: "400" }] });
});
afterAll(() => t.close());

describe("sample issue and receipt", () => {
  it("sends samples out without tax, takes them off the shelf and lists them as pending", async () => {
    const r = await post("/delivery-notes", { customerId: id.buyer, date: today, reason: "sample", lines: [{ itemId: id.shirt, qty: "5" }] });
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({ reason: "sample", total: "3500.00" });
    expect(Number(r.body.cgst) + Number(r.body.sgst) + Number(r.body.igst)).toBe(0);
    expect(await stock()).toBe(15);
    id.note = r.body.id;
    const [p] = await get("/samples/pending");
    expect(p).toMatchObject({ number: r.body.number, customerName: "Sample Buyer", pieces: "5.0000", daysOut: 0 });
  });

  it("takes samples back in part, then in full, and the list empties", async () => {
    const note = await get(`/delivery-notes/${id.note}`);
    const lineId = note.lines[0].id;
    expect((await post(`/delivery-notes/${id.note}/returns`, { date: today, lines: [{ lineId, qty: "2" }] })).status).toBe(201);
    expect(await stock()).toBe(17);
    expect((await get("/samples/pending"))[0].pieces).toBe("3.0000");
    await post(`/delivery-notes/${id.note}/returns`, { date: today, lines: [{ lineId, qty: "3" }] });
    expect(await stock()).toBe(20);
    expect(await get("/samples/pending")).toEqual([]);
  });

  it("keeps samples out of the approvals list and businesses apart", async () => {
    await post("/delivery-notes", { customerId: id.buyer, date: today, reason: "sample", lines: [{ itemId: id.shirt, qty: "1" }] });
    expect(await get("/approvals/pending")).toEqual([]);
    const other = (await t.signup("samples-other")).cookie;
    expect((await t.call(other, "GET", "/samples/pending")).body).toEqual([]);
  });
});
