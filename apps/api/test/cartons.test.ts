import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const invoice = (extra: Record<string, unknown> = {}) => post("/sales-invoices", { customerId: id.cust, date: "2026-10-05", lines: [{ itemId: id.shirt, qty: "2", rate: "500" }], ...extra });

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("cartons", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.shirt = (await post("/items", { name: "Carton Shirt", hsn: "6205", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, saleRate: "500" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "50", rate: "300" }] });
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.cust = (await post("/accounts", { name: "Carton Customer", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
});
afterAll(() => t.close());

describe("cartons on an invoice", () => {
  it("keeps the count and gives it to the print", async () => {
    const r = await invoice({ cartons: 4 });
    expect(r.status).toBe(201);
    expect(r.body.cartons).toBe(4);
    expect((await get(`/sales-invoices/${r.body.id}/print`)).invoice.cartons).toBe(4);
  });

  it("is optional, and must be a whole number of at least one", async () => {
    const plain = await invoice();
    expect(plain.status).toBe(201);
    expect(plain.body.cartons).toBeNull();
    expect((await invoice({ cartons: 0 })).status).toBe(400);
    expect((await invoice({ cartons: 1.5 })).status).toBe(400);
  });
});

describe("dispatch details on an invoice", () => {
  it("keeps the transporter, vehicle, lorry receipt and an e-way bill typed on it", async () => {
    const r = await invoice({ transporter: "Blue Dart", vehicleNo: "as01ab1234", lrNumber: "LR-4471", lrDate: "2026-10-05", ewbNo: "123456789012" });
    expect(r.status, JSON.stringify(r.body)).toBe(201);
    expect(r.body).toMatchObject({ transporter: "Blue Dart", vehicleNo: "AS01AB1234", lrNumber: "LR-4471", lrDate: "2026-10-05", ewbNo: "123456789012", ewbStatus: "active" });
  });
  it("leaves them empty when not given, and refuses a bad e-way bill or vehicle number", async () => {
    const plain = await invoice();
    expect(plain.body).toMatchObject({ transporter: null, vehicleNo: null, lrNumber: null, ewbNo: null, ewbStatus: "none" });
    expect((await invoice({ ewbNo: "12345" })).status).toBe(400);
    expect((await invoice({ vehicleNo: "!!" })).status).toBe(400);
  });
});

describe("what the invoice form shows before saving", () => {
  it("gives the number the next invoice will get, and moves on when one is saved", async () => {
    const before = await get("/sales-invoices/form-info?date=2026-10-05");
    expect(before.number).toMatch(/^INV\/26-27\/\d{5}$/);
    expect(before).toHaveProperty("bankDetails");
    expect(before).toHaveProperty("terms");
    const saved = await invoice();
    expect(saved.body.number).toBe(before.number);
    const after = await get("/sales-invoices/form-info?date=2026-10-05");
    expect(after.number).not.toBe(before.number);
  });
});

