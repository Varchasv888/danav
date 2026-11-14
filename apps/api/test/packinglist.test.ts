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
  c = (await t.signup("packinglist", { gstin: "27AAPFU0939F1ZV" })).cookie as string;
  const groups = (await get("/accounts/groups")) as { id: string; key: string }[];
  id.shop = (await post("/accounts", { name: "Pack Shop", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  const uom = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.m = (await post("/items", { name: "Pack Shirt M", hsn: "6205", gstRate: "5", uomId: uom, saleRate: "500" })).body.id;
  id.l = (await post("/items", { name: "Pack Shirt L", hsn: "6205", gstRate: "5", uomId: uom, saleRate: "500" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.m, warehouseId: id.main, qty: "100", rate: "300" }, { itemId: id.l, warehouseId: id.main, qty: "100", rate: "300" }] });
  const challan = await post("/delivery-notes", { customerId: id.shop, date: today, warehouseId: id.main, lines: [{ itemId: id.m, qty: "30" }, { itemId: id.l, qty: "20" }] });
  expect(challan.status, JSON.stringify(challan.body)).toBe(201);
  id.note = challan.body.id;
});
afterAll(() => t.close());

const packedBox = async (lines: { itemId: string; qty: string }[]) => {
  const box = await post("/packing-boxes", {});
  expect(box.status).toBe(201);
  const r = await post(`/packing-boxes/${box.body.id}/repack`, { lines });
  expect(r.status, JSON.stringify(r.body)).toBe(200);
  return box.body.id as string;
};

describe("packing list of a challan", () => {
  it("lists cartons against the challan and says what is short or extra until they agree", async () => {
    const b1 = await packedBox([{ itemId: id.m, qty: "30" }]);
    const b2 = await packedBox([{ itemId: id.l, qty: "15" }]);
    const first = await post(`/delivery-notes/${id.note}/packing-list`, { boxIds: [b1, b2] });
    expect(first.status, JSON.stringify(first.body)).toBe(200);
    expect(first.body.comparison).toMatchObject({ complete: false, problems: 1, boxCount: 2, packedPieces: "45.0000" });
    expect(first.body.comparison.rows.find((r: { itemId: string }) => r.itemId === id.l)).toMatchObject({ state: "short", difference: "-5.0000" });
    const b3 = await packedBox([{ itemId: id.l, qty: "5" }]);
    const done = await post(`/delivery-notes/${id.note}/packing-list`, { boxIds: [b3] });
    expect(done.body.comparison).toMatchObject({ complete: true, problems: 0, boxCount: 3 });
    expect((await get(`/delivery-notes/${id.note}/packing-list`)).boxes).toHaveLength(3);
  });

  it("keeps a carton on one challan, and a listed carton cannot be reopened until it is taken off", async () => {
    const list = await get(`/delivery-notes/${id.note}/packing-list`);
    const boxId = list.boxes[0].id as string;
    expect((await post(`/packing-boxes/${boxId}/reopen`, { reason: "Count again" })).body.error).toBe("packing_box_on_challan");
    const other = await post("/delivery-notes", { customerId: id.shop, date: today, warehouseId: id.main, lines: [{ itemId: id.m, qty: "1" }] });
    expect((await post(`/delivery-notes/${other.body.id}/packing-list`, { boxIds: [boxId] })).body.error).toBe("packing_box_on_other_challan");
    const removed = await post(`/delivery-notes/${id.note}/packing-list/${boxId}/remove`, {});
    expect(removed.status).toBe(200);
    expect(removed.body.comparison.complete).toBe(false);
    expect(removed.body.availableBoxes.map((b: { id: string }) => b.id)).toContain(boxId);
    expect((await post(`/packing-boxes/${boxId}/reopen`, { reason: "Count again" })).status).toBe(200);
  });

  it("refuses an open carton and another business's carton", async () => {
    const open = await post("/packing-boxes", {});
    expect((await post(`/delivery-notes/${id.note}/packing-list`, { boxIds: [open.body.id] })).body.error).toBe("packing_box_not_packed");
    const other = (await t.signup("packinglist-other")).cookie as string;
    expect((await t.call(other, "GET", `/delivery-notes/${id.note}/packing-list`)).status).toBe(404);
  });
});
