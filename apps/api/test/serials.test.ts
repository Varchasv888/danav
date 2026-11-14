import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const sell = (serials?: string[], qty = "1") => post("/pos/bills", { terminalId: id.till, lines: [{ itemId: id.phone, qty, ...(serials ? { serials } : {}) }], payments: [{ mode: "cash", amount: String(Number(qty) * 12000) }] });

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("serials", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.sup = (await post("/accounts", { name: "Phone Distributor", groupId: groups.find((g) => g.key === "sundry_creditors")!.id, stateCode: "27" })).body.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.other = (await post("/warehouses", { name: "Other Store" })).body.id;
  id.phone = (await post("/items", { name: "Phone X", uomId: setup.uoms[0].id, gstRate: "18", saleRate: "12000", purchaseRate: "9000", mrp: "12000" })).body.id;
  await t.call(c, "PUT", "/pos/settings", { pricesIncludeTax: true });
  id.till = (await post("/pos/terminals", { name: "Counter", warehouseId: id.main })).body.id;
  await post("/pos/sessions", { terminalId: id.till, openingCash: "0" });
});
afterAll(() => t.close());

const receive = (serials?: string[], qty = "3") => post("/goods-receipts", { supplierId: id.sup, date: today, lines: [{ itemId: id.phone, qty, rate: "9000", ...(serials ? { serials } : {}) }] });

describe("pieces tracked by serial number", () => {
  it("only asks for serials once the item is switched over, then wants one for each piece received", async () => {
    expect((await receive()).status).toBe(201); // not tracked yet: 3 pieces in with no serials
    expect((await t.call(c, "PUT", `/items/${id.phone}/track-serials`, { value: true })).status).toBe(200);
    expect((await receive()).body.error).toBe("serials_required");
    expect((await receive(["S1", "S2"])).body.error).toBe("serials_count_mismatch");
    expect((await receive(["S1", "s1", "S3"])).body.error).toBe("duplicate_serial");
    const ok = await receive(["sn-100", "sn-101", "sn-102"]);
    expect(ok.status).toBe(201);
    id.receipt = ok.body.id;
    expect(await get(`/serials?itemId=${id.phone}`)).toHaveLength(3);
    expect((await receive(["SN-100", "SN-103", "SN-104"])).body.error).toBe("serial_exists");
    // The three untracked pieces received first have no serials: the check shows the gap.
    expect((await get("/serials/check")).items[0]).toMatchObject({ item: "Phone X", stock: "6", serials: 3, gap: "3" });
    expect((await t.call(c, "PUT", `/items/${id.phone}/track-serials`, { value: false })).body.error).toBe("serials_in_stock");
  });

  it("sells named pieces from the right store, and refuses a missing, unknown or already sold serial", async () => {
    expect((await sell()).body.error).toBe("serials_required");
    expect((await sell(["SN-100", "SN-101"])).body.error).toBe("serials_count_mismatch");
    expect((await sell(["NOPE"])).body.error).toBe("serial_unknown");
    const a = await sell(["sn-100"]);
    expect(a.status).toBe(201);
    id.bill = a.body.id;
    expect((await get(`/pos/bills/${a.body.id}`)).lines[0].serials).toEqual(["SN-100"]);
    expect((await sell(["SN-100"])).body.error).toBe("serial_not_in_stock");
    expect((await get("/serials/lookup?serial=SN-100"))[0]).toMatchObject({ status: "sold", item: "Phone X", soldBill: expect.any(String) });
    // A piece held in another store cannot be sold at this counter.
    await post("/serials", { itemId: id.phone, warehouseId: id.other, serials: ["SN-200"] });
    expect((await sell(["SN-200"])).body.error).toBe("serial_in_other_store");
  });

  it("puts a voided bill's pieces back, and a returned piece comes back by name", async () => {
    await post(`/pos/bills/${id.bill}/void`, { reason: "Customer changed mind" });
    expect((await get("/serials/lookup?serial=SN-100"))[0].status).toBe("in_stock");
    const b = await sell(["SN-101"]);
    expect(b.status).toBe(201);
    const line = (await get(`/pos/bills/${b.body.id}`)).lines[0];
    const ret = await post("/pos/returns", { billId: b.body.id, terminalId: id.till, refundMode: "cash", lines: [{ lineId: line.id, qty: "1", reason: "defect", grade: "A" }] });
    expect(ret.status).toBe(201);
    expect((await get("/serials/lookup?serial=SN-101"))[0].status).toBe("in_stock");
  });

  it("will not cancel a receipt whose pieces have been sold, but takes back an untouched one", async () => {
    await sell(["SN-102"]);
    expect((await post(`/goods-receipts/${id.receipt}/cancel`, { reason: "Entered twice" })).body.error).toBe("serials_sold");
    const fresh = await receive(["SN-300", "SN-301", "SN-302"]);
    expect((await post(`/goods-receipts/${fresh.body.id}/cancel`, { reason: "Wrong lot" })).status).toBe(200);
    expect((await t.call(c, "GET", "/serials/lookup?serial=SN-300")).status).toBe(404);
  });
});
