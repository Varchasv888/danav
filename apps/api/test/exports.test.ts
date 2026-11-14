import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const year = new Date().getUTCFullYear();
const d = (md: string) => `${year}-${md}`;

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("exports", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  const group = (k: string) => groups.find((g) => g.key === k)!.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.local = (await post("/accounts", { name: "Local Retailer", groupId: group("sundry_debtors"), stateCode: "27" })).body.id;
  id.abroad = (await post("/accounts", { name: "Overseas Buyer", groupId: group("sundry_debtors"), stateCode: "96" })).body.id;
  id.mill = (await post("/accounts", { name: "Surat Mills", groupId: group("sundry_creditors"), gstin: "24AAACC1206D1ZM", stateCode: "24" })).body.id;
  id.garment = (await post("/items", { name: "Export Garment", hsn: "620520", gstRate: "5", uomId: pcs, saleRate: "1000" })).body.id;
  id.fabric = (await post("/items", { name: "Export Fabric", hsn: "5208", gstRate: "12", uomId: pcs, purchaseRate: "100" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.garment, warehouseId: id.main, qty: "100", rate: "400" }] });
  await post("/purchase-bills", { supplierId: id.mill, date: d("04-10"), supplierInvoiceNo: "SM/1", supplierInvoiceDate: d("04-10"), lines: [{ itemId: id.fabric, qty: "100", rate: "100" }] });
  await post("/sales-invoices", { customerId: id.local, date: d("04-12"), lines: [{ itemId: id.garment, qty: "10", rate: "1000" }] });
  const exp = await post("/sales-invoices", { customerId: id.abroad, date: d("04-15"), supply: { export: true, lut: true }, lines: [{ itemId: id.garment, qty: "10", rate: "1000" }] });
  id.exportInv = exp.body.id;
});
afterAll(() => t.close());

describe("export shipments", () => {
  it("lists export invoices only, with nine months to bring the money in", async () => {
    const rows = await get("/exports/shipments");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ invoiceId: id.exportInv, status: "open", realised: "0.00" });
    expect(rows[0].dueBy).toBe(`${year}-${"01-15"}`.replace(String(year), String(year + 1)));
  });

  it("records the shipping bill and the realisation, and refuses a local invoice", async () => {
    const saved = await t.call(c, "PUT", `/exports/shipments/${id.exportInv}`, { shippingBillNo: "7712345", shippingBillDate: d("04-16"), portCode: "INNSA1", currency: "USD", brcNo: "BRC/1", brcDate: d("06-20"), realisedAmount: "10000" });
    expect(saved.status).toBe(200);
    const row = (await get("/exports/shipments"))[0];
    expect(row).toMatchObject({ shippingBillNo: "7712345", status: "realised", pending: "0.00" });
    const local = (await get("/sales-invoices?limit=5")) as { id: string; supplyKind?: string }[] | { rows: { id: string }[] };
    const localId = (Array.isArray(local) ? local : local.rows).find((r) => r.id !== id.exportInv)?.id;
    if (localId) expect((await t.call(c, "PUT", `/exports/shipments/${localId}`, { shippingBillNo: "1" })).status).toBe(400);
    expect((await t.call(c, "PUT", `/exports/shipments/${id.exportInv}`, { shippingBillDate: d("04-16"), brcDate: d("04-01") })).status).toBe(400);
  });

  it("marks an unrealised shipment overdue once nine months have passed", async () => {
    await t.call(c, "PUT", `/exports/shipments/${id.exportInv}`, { shippingBillNo: "7712345", shippingBillDate: `${year - 2}-01-10`, realisedAmount: "2000" });
    const row = (await get("/exports/shipments"))[0];
    expect(row.status).toBe("overdue");
    expect(row.pending).toBe("8000.00");
  });
});

describe("incentive rates and scrips", () => {
  it("works out the incentive from the rate in force on the shipping bill date, and shows a missing rate", async () => {
    await t.call(c, "PUT", `/exports/shipments/${id.exportInv}`, { shippingBillNo: "7712345", shippingBillDate: d("04-16"), realisedAmount: "10000", brcNo: "B" });
    const before = await get("/exports/incentive?scheme=rodtep");
    expect(before.total).toBe("0.00");
    expect(before.uncovered).toBe(1);
    expect((await post("/exports/rates", { scheme: "rodtep", hsnPrefix: "6205", ratePct: "1.5", effectiveFrom: d("01-01") })).status).toBe(201);
    expect((await post("/exports/rates", { scheme: "rodtep", hsnPrefix: "62", ratePct: "0.5", effectiveFrom: d("01-01") })).status).toBe(201);
    expect((await post("/exports/rates", { scheme: "rodtep", hsnPrefix: "62", ratePct: "0.6", effectiveFrom: d("03-01") })).status).toBe(409);
    const after = await get("/exports/incentive?scheme=rodtep");
    expect(after.uncovered).toBe(0);
    expect(after.total).toBe("150.00"); // longest heading 6205 at 1.5% of 10,000
  });

  it("keeps a scrip ledger that refuses over-use and use after expiry", async () => {
    const scrip = await post("/exports/scrips", { scheme: "rodtep", number: "SC-1", issuedOn: d("05-01"), validUntil: d("12-31"), amount: "1000" });
    expect(scrip.status).toBe(201);
    expect((await post("/exports/scrips", { scheme: "rodtep", number: "SC-1", issuedOn: d("05-01"), amount: "1" })).status).toBe(409);
    expect((await post(`/exports/scrips/${scrip.body.id}/use`, { usedOn: d("06-01"), amount: "400", purpose: "Duty on import" })).status).toBe(201);
    expect((await post(`/exports/scrips/${scrip.body.id}/use`, { usedOn: d("06-02"), amount: "700" })).status).toBe(400);
    expect((await post(`/exports/scrips/${scrip.body.id}/use`, { usedOn: `${year + 1}-01-02`, amount: "100" })).status).toBe(400);
    const ledger = await get("/exports/scrips");
    expect(ledger.scrips[0]).toMatchObject({ used: "400.00", balance: "600.00", expired: false });
    expect(ledger.usable).toBe("600.00");
  });

  it("deletes a rate", async () => {
    const rates = await get("/exports/rates");
    expect((await t.call(c, "DELETE", `/exports/rates/${rates[0].id}`)).status).toBe(200);
    expect(await get("/exports/rates")).toHaveLength(1);
  });
});

describe("inverted duty refund working", () => {
  it("compares the share of input credit with the tax paid on the lower-rated sales", async () => {
    const r = await get(`/exports/inverted-duty?from=${d("04-01")}&to=${d("04-30")}&outputRate=5`);
    // Local sales 10,000 at 5% (tax 500); total turnover includes the export, 20,000; input credit 1,200.
    expect(r).toMatchObject({ invertedTurnover: "10000.00", adjustedTurnover: "20000.00", netItc: "1200.00", itcShare: "600.00", taxPayableOnInverted: "500.00", refund: "100.00" });
  });

  it("shows no refund when the inputs are not taxed higher", async () => {
    const r = await get(`/exports/inverted-duty?from=${d("04-01")}&to=${d("04-30")}&outputRate=12`);
    expect(r.refund).toBe("0.00");
    expect((await t.call(c, "GET", `/exports/inverted-duty?from=${d("04-30")}&to=${d("04-01")}&outputRate=5`)).status).toBe(400);
  });
});
