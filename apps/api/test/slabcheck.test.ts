import { afterAll, beforeAll, describe, expect, it } from "vitest";
import postgres from "postgres";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

const OWNER_URL = process.env.DATABASE_OWNER_URL ?? "postgres://varchasv_owner:varchasv_owner_dev@localhost:5433/varchasv";
let t: Awaited<ReturnType<typeof testApp>>;
let owner: ReturnType<typeof postgres>;
let c: string;
let tenantId = "";
const id: Record<string, string> = {};
const today = businessDate();

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);

beforeAll(async () => {
  owner = postgres(OWNER_URL, { max: 1 });
  t = await testApp();
  const s = await t.signup("slabcheck", { gstin: "27AAPFU0939F1ZV" });
  c = s.cookie; tenantId = s.body.tenantId;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.cust = (await post("/accounts", { name: "Slab Customer", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  id.shirt = (await post("/items", { name: "Slab Shirt", hsn: "6205", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, gstRate: "5", gstSlab: "apparel", saleRate: "900", purchaseRate: "300" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "50", rate: "300" }] });
});
afterAll(async () => { await t.close(); await owner.end(); });

const range = () => `from=${today.slice(0, 4)}-01-01&to=${today}`;

describe("slab exception report", () => {
  it("finds nothing when every line was charged the rate its piece value calls for", async () => {
    expect((await post("/sales-invoices", { customerId: id.cust, date: today, lines: [{ itemId: id.shirt, qty: "2", rate: "900" }] })).status).toBe(201);
    expect((await post("/sales-invoices", { customerId: id.cust, date: today, lines: [{ itemId: id.shirt, qty: "1", rate: "3000" }] })).status).toBe(201);
    const r = await get(`/gst/work/slab-exceptions?${range()}`);
    expect(r.checked).toBe(2);
    expect(r.exceptions).toBe(0);
  });

  it("lists a line whose rate is wrong for its piece value, with the tax over or under", async () => {
    // A cheap piece wrongly taxed at the higher rate, as a manual edit or an old price list might do.
    await owner`update sales_invoice_lines set gst_rate = 18 where tenant_id = ${tenantId} and taxable < 2000`;
    const r = await get(`/gst/work/slab-exceptions?${range()}`);
    expect(r.exceptions).toBe(1);
    expect(r.rows[0]).toMatchObject({ item: "Slab Shirt", charged: "18.00", expected: "5.00", pieceValue: "900.00", taxDifference: "234.00" }); // 1,800 taxable x 13%
    expect(r.overCharged).toBe("234.00");
    expect(r.underCharged).toBe("0.00");
    expect((await t.call(c, "GET", `/gst/work/slab-exceptions?from=${today}&to=2020-01-01`)).status).toBe(400);
  });
});
