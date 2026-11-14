import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();

const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const list = async (qs = "") => (await t.call(c, "GET", `/lr-entries${qs}`)).body as { id: string; lrNumber: string; status: string; customer: string | null; invoiceNumber: string | null; deliveredOn: string | null; daysOut: number | null }[];

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("lr", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = (await t.call(c, "GET", "/accounts/groups")).body;
  id.shop = (await post("/accounts", { name: "LR Shop", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  const setup = (await t.call(c, "GET", "/inventory/setup")).body;
  id.main = setup.warehouses[0].id;
  id.shirt = (await post("/items", { name: "LR Shirt", hsn: "6205", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, saleRate: "700" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "20", rate: "400" }] });
  id.invoice = (await post("/sales-invoices", { customerId: id.shop, date: today, lines: [{ itemId: id.shirt, qty: "2", rate: "700" }] })).body.id;
});
afterAll(() => t.close());

describe("LR and transport entries", () => {
  it("records a consignment against an invoice and takes the customer from it", async () => {
    const r = await post("/lr-entries", { date: today, transporter: "VRL Logistics", lrNumber: "VRL-1001", invoiceId: id.invoice, destination: "Pune", packages: 3, freight: "450", freightBy: "to_pay" });
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({ status: "booked", packages: 3, freight: "450.00", freightBy: "to_pay", customerId: id.shop });
    const [row] = await list();
    expect(row).toMatchObject({ lrNumber: "VRL-1001", customer: "LR Shop", status: "booked", daysOut: 0 });
    expect(row!.invoiceNumber).toMatch(/^INV\//);
    id.lr = r.body.id;
  });

  it("refuses the same LR number twice for one transporter, whatever the case", async () => {
    const dup = await post("/lr-entries", { date: today, transporter: "vrl logistics", lrNumber: "VRL-1001" });
    expect([dup.status, dup.body.error]).toEqual([400, "lr_taken"]);
    expect((await post("/lr-entries", { date: today, transporter: "Other Carriers", lrNumber: "VRL-1001" })).status).toBe(201);
  });

  it("marks it delivered with a date, and filters by status", async () => {
    const r = await t.call(c, "PATCH", `/lr-entries/${id.lr}`, { status: "delivered" });
    expect(r.body).toMatchObject({ status: "delivered", deliveredOn: today });
    expect((await list("?status=delivered")).map((x) => x.lrNumber)).toEqual(["VRL-1001"]);
    expect((await list("?status=booked")).length).toBe(1); // the other transporter's entry
    expect((await list("?search=VRL-1001")).length).toBe(2);
    const back = await t.call(c, "PATCH", `/lr-entries/${id.lr}`, { status: "in_transit" });
    expect(back.body.deliveredOn).toBeNull();
  });

  it("will not attach another business's invoice, and keeps businesses apart", async () => {
    const other = (await t.signup("lr-other")).cookie;
    const r = await t.call(other, "POST", "/lr-entries", { date: today, transporter: "X", lrNumber: "1", invoiceId: id.invoice });
    expect([r.status, r.body.error]).toEqual([400, "unknown_invoice"]);
    expect((await t.call(other, "GET", "/lr-entries")).body).toEqual([]);
    expect((await t.call(other, "PATCH", `/lr-entries/${id.lr}`, { status: "delivered" })).status).toBe(404);
  });
});
