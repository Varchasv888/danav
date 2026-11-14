import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const ledger = async (accountId: string) => get(`/reports/ledger/${accountId}?from=2026-01-01&to=2027-12-31`);
const stockOf = async (itemId: string) => (await get("/reports/stock-summary")).rows.find((r: { itemId: string }) => r.itemId === itemId);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("merge")).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  const group = (k: string) => groups.find((g) => g.key === k)!.id;
  id.keep = (await post("/accounts", { name: "Ravi Textiles", groupId: group("sundry_debtors"), stateCode: "27" })).body.id;
  id.dup = (await post("/accounts", { name: "Ravi Textile", groupId: group("sundry_debtors"), stateCode: "27", phone: "9820012345", openingBalance: "5000" })).body.id;
  id.supplier = (await post("/accounts", { name: "Some Supplier", groupId: group("sundry_creditors"), stateCode: "27" })).body.id;
  const setup = await get("/inventory/setup");
  const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  const kg = setup.uoms.find((u: { code: string }) => u.code === "KGS")?.id ?? setup.uoms.find((u: { code: string }) => u.code !== "PCS").id;
  id.main = setup.warehouses[0].id;
  id.itemKeep = (await post("/items", { name: "Cotton Shirt", hsn: "6205", gstRate: "5", uomId: pcs, saleRate: "800" })).body.id;
  id.itemDup = (await post("/items", { name: "Cotton Shirt (old)", hsn: "6205", gstRate: "5", uomId: pcs, saleRate: "800", barcode: "8901234" })).body.id;
  id.itemKg = (await post("/items", { name: "Cotton Yarn", hsn: "5205", gstRate: "5", uomId: kg, saleRate: "300" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.itemKeep, warehouseId: id.main, qty: "10", rate: "400" }, { itemId: id.itemDup, warehouseId: id.main, qty: "6", rate: "500" }] });
});
afterAll(() => t.close());

describe("merging duplicate masters", () => {
  it("moves a duplicate party's balance and missing details to the one kept, and closes the duplicate", async () => {
    expect((await ledger(id.dup)).closing).toBe("5000.00");
    const r = await post(`/accounts/${id.dup}/merge`, { intoId: id.keep });
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ balanceMoved: "5000.00", filled: expect.arrayContaining(["phone"]) });
    expect((await ledger(id.keep)).closing).toBe("5000.00");
    expect((await ledger(id.dup)).closing).toBe("0.00");
    const accounts: { id: string; archived: boolean; mergedIntoId: string | null; phone: string | null }[] = await get("/accounts");
    expect(accounts.find((a) => a.id === id.dup)).toMatchObject({ archived: true, mergedIntoId: id.keep });
    expect(accounts.find((a) => a.id === id.keep)?.phone).toBe("9820012345");
  });

  it("refuses what would be wrong", async () => {
    expect((await post(`/accounts/${id.keep}/merge`, { intoId: id.keep })).body.error).toBe("merge_same");
    expect((await post(`/accounts/${id.dup}/merge`, { intoId: id.keep })).body.error).toBe("already_merged");
    expect((await post(`/accounts/${id.keep}/merge`, { intoId: id.dup })).body.error).toBe("merge_target_closed");
    expect((await post(`/accounts/${id.supplier}/merge`, { intoId: id.keep })).body.error).toBe("merge_party_kind");
    // The closed duplicate takes no new vouchers.
    expect((await post("/vouchers", { type: "journal", date: "2026-11-03", lines: [{ accountId: id.dup, debit: "10" }, { accountId: id.keep, credit: "10" }] })).body.error).toBe("account_archived");
  });

  it("moves an item's stock at its own cost, and its barcode", async () => {
    expect((await post(`/items/${id.itemKg}/merge`, { intoId: id.itemKeep })).body.error).toBe("merge_item_kind");
    const r = await post(`/items/${id.itemDup}/merge`, { intoId: id.itemKeep });
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ stockLines: 1, moved: ["barcode"] });
    expect(Number((await stockOf(id.itemKeep)).qty)).toBe(16);
    // 10 at 400 plus 6 at 500 = 7000.
    expect(Number((await stockOf(id.itemKeep)).value)).toBe(7000);
    expect(Number((await stockOf(id.itemDup)).qty)).toBe(0);
    const items: { id: string; archived: boolean; mergedIntoId: string | null; barcode: string | null }[] = await get("/items");
    expect(items.find((i) => i.id === id.itemDup)).toMatchObject({ archived: true, mergedIntoId: id.itemKeep, barcode: null });
    expect(items.find((i) => i.id === id.itemKeep)?.barcode).toBe("8901234");
    expect((await post(`/items/${id.itemDup}/merge`, { intoId: id.itemKeep })).body.error).toBe("already_merged");
  });

  it("is private to the business", async () => {
    const other = (await t.signup("merge-other")).cookie;
    expect((await t.call(other, "POST", `/accounts/${id.keep}/merge`, { intoId: id.keep })).status).toBe(400);
    expect((await t.call(other, "POST", `/accounts/${id.supplier}/merge`, { intoId: id.keep })).status).toBe(404);
  });
});
