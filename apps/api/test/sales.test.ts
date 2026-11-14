import { createHash } from "node:crypto";
import { sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { SIMULATOR_OTP } from "../src/integrations/gsp.js";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const stockQty = async (itemId: string) => ((await get("/reports/stock-summary?asOf=2026-09-30")).rows as { itemId: string; qty: string }[]).find((r) => r.itemId === itemId)!.qty;
const balance = async (accountId: string) => ((await get("/reports/trial-balance?asOf=2026-09-30")).rows as { accountId: string; dr: string; cr: string }[]).find((r) => r.accountId === accountId) ?? { dr: "0.00", cr: "0.00" };

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("seller", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const companies = await get("/companies");
  await t.call(c, "PATCH", `/branches/${companies[0].branches[0].id}`, { address: { line1: "12 Market Road", city: "Pune", pincode: "411001" } });
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  const debtors = groups.find((g) => g.key === "sundry_debtors")!.id;
  id.karnataka = (await post("/accounts", {
    name: "Karnataka Distributors", groupId: debtors, gstin: "29AAGCB7383J1Z4", creditLimit: "10000", creditDays: 30,
    address: { line1: "5 MG Road", city: "Bengaluru", pincode: "560001" },
  })).body.id;
  id.walkin = (await post("/accounts", { name: "Walk-in Customer", groupId: debtors, stateCode: "27" })).body.id;
  id.delhi = (await post("/accounts", { name: "Delhi Retail", groupId: debtors, stateCode: "07" })).body.id;
  id.noPin = (await post("/accounts", { name: "No Pincode Traders", groupId: debtors, gstin: "04AABCT1332L1ZM" })).body.id;
  for (const a of await get("/accounts") as { id: string; key: string | null }[]) if (a.key) id[a.key] = a.id;
  const setup = await get("/inventory/setup");
  const uom = (code: string) => setup.uoms.find((u: { code: string }) => u.code === code).id;
  id.main = setup.warehouses[0].id;
  id.rice = (await post("/items", { name: "Rice 25kg", hsn: "1006", gstRate: "5", uomId: uom("BAG"), saleRate: "520" })).body.id;
  id.consult = (await post("/items", { name: "Consulting", kind: "service", hsn: "998311", gstRate: "18", uomId: uom("OTH") })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.rice, warehouseId: id.main, qty: "100", rate: "400" }] });
});
afterAll(() => t.close());

describe("order → delivery → invoice", () => {
  let order: { id: string };
  let deliveryLineId = "";
  let invoice: { id: string };

  it("takes a sales order at the customer's place of supply (IGST)", async () => {
    const r = await post("/sales-orders", { customerId: id.karnataka, date: "2026-09-05", lines: [{ itemId: id.rice, qty: "50", rate: "520" }] });
    expect(r.status).toBe(201);
    order = r.body;
    expect(r.body).toMatchObject({ number: "SO/26-27/00001", supplyKind: "inter", placeOfSupply: "29", igst: "1300.00", total: "27300.00" });
    const stock = await get(`/reports/stock-summary?asOf=${businessDate()}&includeCommitments=true`);
    // 100 in stock, 50 promised on this order, nothing on hold or on order from suppliers: 50 are free to promise.
    expect(stock.rows.find((row: { itemId: string }) => row.itemId === id.rice)).toMatchObject({ qty: "100.0000", openOrderCommitmentQty: "50.0000", heldQty: "0.0000", incomingQty: "0.0000", availableQty: "50.0000", oversold: false });
    const withoutCommitments = await get(`/reports/stock-summary?asOf=${businessDate()}&includeCommitments=false`);
    expect(withoutCommitments.rows.find((row: { itemId: string }) => row.itemId === id.rice).openOrderCommitmentQty).toBeUndefined();
    const historical = await t.call(c, "GET", "/reports/stock-summary?asOf=2026-11-06&includeCommitments=true");
    expect(historical).toMatchObject({ status: 400, body: { error: "commitments_current_only" } });
  });

  it("delivers part of it on a challan: stock goes out, over-delivery is refused", async () => {
    const lines = (await get(`/sales-orders/${order.id}`)).lines;
    const r = await post("/delivery-notes", { customerId: id.karnataka, orderId: order.id, date: "2026-09-06", lines: [{ itemId: id.rice, qty: "30", orderLineId: lines[0].id }] });
    expect(r.body.number).toBe("DC/26-27/00001");
    deliveryLineId = (await get(`/delivery-notes/${r.body.id}`)).lines[0].id;
    expect(await stockQty(id.rice)).toBe("70.0000");
    expect((await post("/delivery-notes", { customerId: id.karnataka, orderId: order.id, date: "2026-09-06", lines: [{ itemId: id.rice, qty: "21", orderLineId: lines[0].id }] })).body.error).toBe("over_delivery");
    expect((await get(`/sales-orders/${order.id}`)).status).toBe("partial");
    const stock = await get(`/reports/stock-summary?asOf=${businessDate()}&includeCommitments=true`);
    expect(stock.rows.find((row: { itemId: string }) => row.itemId === id.rice)).toMatchObject({ openOrderCommitmentQty: "20.0000" });
  });

  it("invoices the delivery plus a service, posts sales and output IGST, and warns about the credit limit", async () => {
    const r = await post("/sales-invoices", { customerId: id.karnataka, date: "2026-09-10", lines: [
      { itemId: id.rice, qty: "30", rate: "520", deliveryLineId }, { itemId: id.consult, qty: "1", rate: "2000" },
    ] });
    expect(r.status).toBe(201);
    invoice = r.body;
    expect(r.body).toMatchObject({ number: "INV/26-27/00001", taxable: "17600.00", igst: "1140.00", total: "18740.00", dueOn: "2026-10-10", customerGstin: "29AAGCB7383J1Z4", einvoiceStatus: "not_required" });
    expect(r.body.warnings.map((w: { code: string }) => w.code)).toContain("credit_limit_exceeded");
    expect(await stockQty(id.rice)).toBe("70.0000"); // already went out on the challan
    expect((await balance(id.karnataka)).dr).toBe("18740.00");
    expect((await balance(id.sales)).cr).toBe("17600.00");
    expect((await balance(id.output_igst)).cr).toBe("1140.00");
    expect((await get("/delivery-notes"))[0].status).toBe("invoiced");
  });

  it("sells locally (CGST+SGST, B2CS) and to an unregistered buyer in another state above ₹1 lakh (B2CL)", async () => {
    const local = await post("/sales-invoices", { customerId: id.walkin, date: "2026-09-12", lines: [{ itemId: id.rice, qty: "2", rate: "520" }] });
    expect(local.body).toMatchObject({ supplyKind: "intra", cgst: "26.00", sgst: "26.00", total: "1092.00" });
    id.localInvoice = local.body.id;
    const big = await post("/sales-invoices", { customerId: id.delhi, date: "2026-09-14", lines: [{ itemId: id.rice, qty: "60", rate: "1800" }] });
    expect(big.body).toMatchObject({ supplyKind: "inter", taxable: "108000.00", igst: "5400.00", total: "113400.00" });
    expect(await stockQty(id.rice)).toBe("8.0000");
  });

  it("takes goods back on a credit note, and gives a price reduction without stock", async () => {
    const lines = (await get(`/sales-invoices/${invoice.id}`)).lines;
    const riceLine = lines.find((l: { itemId: string }) => l.itemId === id.rice);
    expect((await post("/credit-notes", { invoiceId: invoice.id, date: "2026-09-16", reason: "Damaged", lines: [{ invoiceLineId: riceLine.id, qty: "31" }] })).body.error).toBe("over_return");
    const cn = await post("/credit-notes", { invoiceId: invoice.id, date: "2026-09-16", reason: "Damaged bags", lines: [{ invoiceLineId: riceLine.id, qty: "5" }] });
    expect(cn.body).toMatchObject({ number: "CN/26-27/00001", taxable: "2600.00", igst: "130.00", total: "2730.00" });
    expect(await stockQty(id.rice)).toBe("13.0000");
    const localLines = (await get(`/sales-invoices/${id.localInvoice}`)).lines;
    const discount = await post("/credit-notes", { invoiceId: id.localInvoice, date: "2026-09-17", reason: "Rate difference", goodsReturned: false, lines: [{ invoiceLineId: localLines[0].id, qty: "2", rate: "20" }] });
    expect(discount.body).toMatchObject({ taxable: "40.00", cgst: "1.00", sgst: "1.00", total: "42.00" });
    expect(await stockQty(id.rice)).toBe("13.0000");
    expect((await post(`/sales-invoices/${invoice.id}/cancel`, { reason: "Test" })).body.error).toBe("invoice_has_credit_notes");
  });
});

describe("GST returns", () => {
  it("builds GSTR-1 in the portal's JSON format", async () => {
    const r = await get("/gst/gstr1?period=092026");
    const j = r.json;
    expect(j.gstin).toBe("27AAPFU0939F1ZV");
    expect(j.fp).toBe("092026");
    expect(j.b2b).toHaveLength(1);
    expect(j.b2b[0].ctin).toBe("29AAGCB7383J1Z4");
    expect(j.b2b[0].inv[0]).toMatchObject({ inum: "INV/26-27/00001", idt: "10-09-2026", val: 18740, pos: "29", rchrg: "N", inv_typ: "R" });
    expect(j.b2b[0].inv[0].itms).toEqual([
      { num: 1, itm_det: { txval: 15600, rt: 5, iamt: 780, csamt: 0 } },
      { num: 2, itm_det: { txval: 2000, rt: 18, iamt: 360, csamt: 0 } },
    ]);
    expect(j.b2cl).toEqual([{ pos: "07", inv: [{ inum: "INV/26-27/00003", idt: "14-09-2026", val: 113400, itms: [{ num: 1, itm_det: { txval: 108000, rt: 5, iamt: 5400, csamt: 0 } }] }] }]);
    // The walk-in sale less its price-reduction credit note.
    expect(j.b2cs).toEqual([{ sply_ty: "INTRA", pos: "27", typ: "OE", rt: 5, txval: 1000, camt: 25, samt: 25, csamt: 0 }]);
    expect(j.cdnr[0]).toMatchObject({ ctin: "29AAGCB7383J1Z4" });
    expect(j.cdnr[0].nt[0]).toMatchObject({ ntty: "C", nt_num: "CN/26-27/00001", val: 2730 });
    expect(j.hsn.hsn_b2b.find((h: { hsn_sc: string }) => h.hsn_sc === "1006")).toMatchObject({ uqc: "BAG", qty: 25, txval: 13000, iamt: 650 });
    expect(j.doc_issue.doc_det[0].docs[0]).toMatchObject({ from: "INV/26-27/00001", to: "INV/26-27/00003", totnum: 3, cancel: 0, net_issue: 3 });
    expect(r.summary.B2B.count).toBe(1);
  });

  it("builds GSTR-3B with outward tax net of credit notes", async () => {
    const r = await get("/gst/gstr3b?period=092026");
    // 17,600 + 1,040 + 1,08,000 − 2,600 − 40
    expect(r["3.1"].a_taxable).toMatchObject({ taxable: "124000.00", igst: "6410.00", cgst: "25.00", sgst: "25.00" });
    expect(r.setOff.cashPayable).toEqual({ igst: "6410.00", cgst: "25.00", sgst: "25.00", cess: "0.00" }); // no purchases, so no credit
  });
});

describe("e-invoice and e-way bill", () => {
  let inv: { id: string; number: string };

  it("marks B2B invoices for e-invoicing once enabled, and B2C ones not", async () => {
    await t.call(c, "PUT", "/gst/settings", { einvoiceEnabled: true, bilingualPrint: true });
    const b2b = await post("/sales-invoices", { customerId: id.karnataka, date: "2026-09-20", lines: [{ itemId: id.rice, qty: "1", rate: "520" }] });
    expect(b2b.body.einvoiceStatus).toBe("pending");
    inv = b2b.body;
    const b2c = await post("/sales-invoices", { customerId: id.walkin, date: "2026-09-20", lines: [{ itemId: id.rice, qty: "1", rate: "520" }] });
    expect(b2c.body.einvoiceStatus).toBe("not_required");
  });

  it("generates the IRN the way the IRP does, once", async () => {
    const r = await post(`/sales-invoices/${inv.id}/einvoice`, {});
    expect(r.status).toBe(200);
    const expected = createHash("sha256").update(`27AAPFU0939F1ZV2026-27INV${inv.number}`).digest("hex");
    expect(r.body.irn).toBe(expected);
    expect(r.body.ackNo).toMatch(/^\d{14,15}$/);
    expect(r.body.payload).toMatchObject({ Version: "1.1", TranDtls: { SupTyp: "B2B" }, DocDtls: { Typ: "INV", No: inv.number, Dt: "20/09/2026" }, ValDtls: { AssVal: 520, IgstVal: 26, TotInvVal: 546 } });
    expect((await post(`/sales-invoices/${inv.id}/einvoice`, {})).body.error).toBe("irn_already_generated");
    expect((await get(`/sales-invoices/${inv.id}`)).einvoiceStatus).toBe("generated");
  });

  it("won't send an invoice the IRP would reject", async () => {
    const r = await post("/sales-invoices", { customerId: id.noPin, date: "2026-09-21", lines: [{ itemId: id.rice, qty: "1", rate: "520" }] });
    expect((await post(`/sales-invoices/${r.body.id}/einvoice`, {})).body.error).toBe("einvoice_invalid_pincode");
  });

  it("generates an e-way bill valid for one day per 200 km", async () => {
    expect((await post(`/sales-invoices/${inv.id}/eway-bill`, { vehicleNo: "12345", distanceKm: 450 })).status).toBe(400);
    const r = await post(`/sales-invoices/${inv.id}/eway-bill`, { vehicleNo: "MH12AB1234", distanceKm: 450 });
    expect(r.body.ewbNo).toMatch(/^\d{12}$/);
    const days = (Date.parse(r.body.validUpto) - Date.parse(r.body.ewbDate)) / 86_400_000;
    expect(days).toBeGreaterThan(2); // 450 km → 3 days, ending at midnight
    expect(days).toBeLessThanOrEqual(4);
  });

  it("an invoice is cancelled only after its e-way bill and then its IRN", async () => {
    expect((await post(`/sales-invoices/${inv.id}/cancel`, { reason: "Wrong rate" })).body.error).toBe("cancel_ewb_first");
    expect((await post(`/sales-invoices/${inv.id}/einvoice/cancel`, { reason: "2", remark: "Data entry mistake" })).body.error).toBe("cancel_ewb_first");
    expect((await post(`/sales-invoices/${inv.id}/eway-bill/cancel`, { reason: "3", remark: "Data entry mistake" })).status).toBe(200);
    expect((await post(`/sales-invoices/${inv.id}/cancel`, { reason: "Wrong rate" })).body.error).toBe("cancel_irn_first");
    expect((await post(`/sales-invoices/${inv.id}/einvoice/cancel`, { reason: "2", remark: "Data entry mistake" })).status).toBe(200);
    expect((await post(`/sales-invoices/${inv.id}/cancel`, { reason: "Wrong rate" })).status).toBe(200);
  });
});

describe("receivables", () => {
  it("ages what customers owe, settling receipts against the oldest bills", async () => {
    await post("/vouchers", { type: "receipt", date: "2026-09-25", lines: [{ accountId: id.cash, debit: "10000" }, { accountId: id.karnataka, credit: "10000" }] });
    const r = await get("/reports/receivables?asOf=2026-09-30");
    const k = r.rows.find((x: { partyId: string }) => x.partyId === id.karnataka);
    expect(k.balance).toBe("6010.00"); // 18,740 − 2,730 credit note − 10,000 received
    expect(k.openItems).toEqual([expect.objectContaining({ number: "INV/26-27/00001", amount: "6010.00", dueOn: "2026-10-10" })]);
    expect(k.buckets.notDue).toBe("6010.00");
  });
});

describe("import", () => {
  it("imports parties from a sheet: dry run first, then for real", async () => {
    const rows = [
      { name: "Sharma Stores", type: "customer", gstin: "27AAPFU0939F1ZV", openingBalance: "₹12,500", creditDays: "15" },
      { name: "Gupta Suppliers", type: "supplier", stateCode: "09", openingBalance: "8000" },
      { name: "Bad GSTIN Co", type: "customer", gstin: "27AAPFU0939F1ZW" },
      { name: "karnataka distributors", type: "customer" },
    ];
    const dry = await post("/import/parties", { rows, dryRun: true });
    expect(dry.body.results.map((r: { status: string; error?: string }) => r.error ?? r.status)).toEqual(["create", "create", "gstin_checksum", "exists"]);
    await post("/import/parties", { rows, dryRun: false });
    const accounts: { name: string; openingBalance: string; stateCode: string | null }[] = await get("/accounts");
    expect(accounts.find((a) => a.name === "Sharma Stores")).toMatchObject({ openingBalance: "12500.00", stateCode: "27" });
    expect(accounts.find((a) => a.name === "Gupta Suppliers")!.openingBalance).toBe("-8000.00");
  });

  it("imports items with opening stock", async () => {
    const r = await post("/import/items", { dryRun: false, rows: [
      { name: "Sugar 1kg", hsn: "1701", gstRate: "5%", unit: "Kg", purchaseRate: "42", openingQty: "50", openingRate: "40" },
      { name: "Bad Unit", unit: "furlongs" },
    ] });
    expect(r.body.results.map((x: { status: string; error?: string }) => x.error ?? x.status)).toEqual(["create", "unknown_unit"]);
    const s = await get("/reports/stock-summary?asOf=2026-09-30");
    expect(s.rows.find((x: { name: string }) => x.name === "Sugar 1kg")).toMatchObject({ qty: "50.0000", value: "2000.00" });
  });

  it("imports ledgers and stock items from a Tally XML export", async () => {
    const xml = `<ENVELOPE><HEADER><TALLYREQUEST>Import Data</TALLYREQUEST></HEADER><BODY><IMPORTDATA><REQUESTDATA>
      <TALLYMESSAGE xmlns:UDF="TallyUDF"><LEDGER NAME="Mehta Traders" RESERVEDNAME=""><PARENT>Sundry Debtors</PARENT><OPENINGBALANCE>-5000.00</OPENINGBALANCE><PARTYGSTIN>29AAGCB7383J1Z4</PARTYGSTIN><PINCODE>560002</PINCODE></LEDGER></TALLYMESSAGE>
      <TALLYMESSAGE><LEDGER NAME="Electricity Charges"><PARENT>Indirect Expenses</PARENT><OPENINGBALANCE>0</OPENINGBALANCE></LEDGER></TALLYMESSAGE>
      <TALLYMESSAGE><LEDGER NAME="Mystery"><PARENT>Some Custom Group</PARENT></LEDGER></TALLYMESSAGE>
      <TALLYMESSAGE><STOCKITEM NAME="Toor Dal"><BASEUNITS>Kg</BASEUNITS><OPENINGBALANCE> 20 Kg</OPENINGBALANCE><OPENINGRATE>110.00/Kg</OPENINGRATE>
        <GSTDETAILS.LIST><HSNCODE>0713</HSNCODE><STATEWISEDETAILS.LIST><RATEDETAILS.LIST><GSTRATEDUTYHEAD>IGST</GSTRATEDUTYHEAD><GSTRATE>5</GSTRATE></RATEDETAILS.LIST></STATEWISEDETAILS.LIST></GSTDETAILS.LIST></STOCKITEM></TALLYMESSAGE>
      </REQUESTDATA></IMPORTDATA></BODY></ENVELOPE>`;
    const dry = await post("/import/tally", { xml, dryRun: true });
    expect(dry.body.ledgers.map((l: { name: string; status: string; error?: string }) => `${l.name}:${l.error ?? l.status}`)).toEqual(["Mehta Traders:create", "Electricity Charges:create", "Mystery:unknown_group"]);
    expect(dry.body.items[0]).toMatchObject({ name: "Toor Dal", status: "create" });
    await post("/import/tally", { xml, dryRun: false });
    const mehta = (await get("/accounts") as { name: string; openingBalance: string; gstin: string | null }[]).find((a) => a.name === "Mehta Traders");
    expect(mehta).toMatchObject({ openingBalance: "5000.00", gstin: "29AAGCB7383J1Z4" }); // Tally's −5000 is a debit
    const dal = (await get("/items") as { name: string; hsn: string; gstRate: string; stockQty: string }[]).find((i) => i.name === "Toor Dal");
    expect(dal).toMatchObject({ hsn: "0713", gstRate: "5.00", stockQty: "20.0000" });
  });
});

describe("quotations", () => {
  const lines = [{ itemId: "", qty: "10", rate: "500" }];
  beforeAll(() => { lines[0]!.itemId = id.rice!; });

  it("quotes without touching stock or accounts, then becomes an order once", async () => {
    const stockBefore = await stockQty(id.rice!);
    const q = await post("/quotations", { customerId: id.karnataka, date: "2026-09-22", lines });
    expect(q.status).toBe(201);
    expect(q.body).toMatchObject({ number: "QT/26-27/00001", validUntil: "2026-10-07", status: "open", igst: "250.00", total: "5250.00" });
    expect(await stockQty(id.rice!)).toBe(stockBefore);
    expect((await post("/quotations", { customerId: id.karnataka, date: "2026-09-22", validUntil: "2026-09-21", lines })).body.error).toBe("valid_until_before_date");

    expect((await post("/sales-orders", { customerId: id.walkin, quotationId: q.body.id, date: "2026-09-23", lines })).body.error).toBe("quotation_customer_mismatch");
    const order = await post("/sales-orders", { customerId: id.karnataka, quotationId: q.body.id, date: "2026-09-23", lines });
    expect(order.status).toBe(201);
    expect(await get(`/quotations/${q.body.id}`)).toMatchObject({ status: "converted", convertedKind: "order", convertedId: order.body.id });
    expect((await post("/sales-invoices", { customerId: id.karnataka, quotationId: q.body.id, date: "2026-09-23", lines })).body.error).toBe("quotation_not_open");
    expect((await post(`/quotations/${q.body.id}/decline`, {})).body.error).toBe("quotation_converted");

    // Cancelling the order frees the quotation to be converted again, this time straight to an invoice.
    await post(`/sales-orders/${order.body.id}/cancel`, {});
    expect((await get(`/quotations/${q.body.id}`)).status).toBe("accepted");
    const inv = await post("/sales-invoices", { customerId: id.karnataka, quotationId: q.body.id, date: "2026-09-23", lines });
    expect(inv.status).toBe(201);
    expect(await get(`/quotations/${q.body.id}`)).toMatchObject({ status: "converted", convertedKind: "invoice", convertedId: inv.body.id });
  });

  it("can be declined or cancelled while open", async () => {
    const q = await post("/quotations", { customerId: id.walkin, date: "2026-09-24", validUntil: "2026-09-30", lines });
    expect((await post(`/quotations/${q.body.id}/decline`, {})).status).toBe(200);
    expect((await post(`/quotations/${q.body.id}/cancel`, {})).status).toBe(200);
    expect((await post(`/quotations/${q.body.id}/accept`, {})).body.error).toBe("already_cancelled");
    expect((await get("/quotations")).length).toBe(2);
  });
});

describe("e-way bill after generation", () => {
  let invId = "";
  const ewbAt = (field: "ewb_valid_upto" | "ewb_date", interval: string) =>
    t.ownerDb.db.execute(sql`update sales_invoices set ${sql.raw(field)} = now() + ${interval}::interval where id = ${invId}`);

  it("moves the goods to another vehicle, and extends only near expiry", async () => {
    invId = (await post("/sales-invoices", { customerId: id.karnataka, date: "2026-09-24", lines: [{ itemId: id.rice, qty: "1", rate: "520" }] })).body.id;
    expect((await post(`/sales-invoices/${invId}/eway-bill/vehicle`, { vehicleNo: "MH14CD5678", fromPlace: "Kolhapur", reason: "1", remark: "Breakdown" })).body.error).toBe("no_active_ewb");
    await post(`/sales-invoices/${invId}/eway-bill`, { vehicleNo: "MH12AB1234", distanceKm: 900 });

    expect((await post(`/sales-invoices/${invId}/eway-bill/vehicle`, { vehicleNo: "MH14CD5678", fromPlace: "Kolhapur", reason: "1", remark: "Truck broke down" })).status).toBe(200);
    expect((await get(`/sales-invoices/${invId}`)).vehicleNo).toBe("MH14CD5678");

    const ext = { fromPlace: "Belagavi", fromPincode: "590001", remainingKm: 300, reason: "4", remark: "Transshipment delay" };
    expect((await post(`/sales-invoices/${invId}/eway-bill/extend`, ext)).body.error).toBe("ewb_extension_window"); // days before expiry
    await ewbAt("ewb_valid_upto", "2 hours"); // the journey ran long: now within 8 hours of expiry
    const e = await post(`/sales-invoices/${invId}/eway-bill/extend`, ext);
    expect(e.status).toBe(200);
    const days = (Date.parse(e.body.validUpto) - Date.now()) / 86_400_000;
    expect(days).toBeGreaterThan(1); // 300 km → 2 more days, ending at midnight
    expect(days).toBeLessThanOrEqual(3);
  });

  it("must be cancelled before the invoice, within 24 hours; a new one can then be made", async () => {
    expect((await post(`/sales-invoices/${invId}/cancel`, { reason: "Order cancelled" })).body.error).toBe("cancel_ewb_first");
    expect((await post(`/sales-invoices/${invId}/eway-bill/cancel`, { reason: "2", remark: "Order cancelled" })).status).toBe(200);
    expect((await get(`/sales-invoices/${invId}`)).ewbStatus).toBe("cancelled");
    expect((await post(`/sales-invoices/${invId}/eway-bill`, { vehicleNo: "MH12AB1234", distanceKm: 100 })).status).toBe(200);
    await ewbAt("ewb_date", "-25 hours");
    expect((await post(`/sales-invoices/${invId}/eway-bill/cancel`, { reason: "2", remark: "Order cancelled" })).body.error).toBe("ewb_cancel_window_passed");
  });
});

describe("filing GST returns through the provider", () => {
  const gstr1Sept = { returnType: "GSTR1", period: "092026" };

  it("needs a GST portal session (username + OTP) first", async () => {
    expect((await post("/gst/filings/upload", gstr1Sept)).body.error).toBe("gst_session_required");
    expect((await get("/gst/portal")).connected).toBe(false);
    expect((await post("/gst/portal/otp", { username: "seller.gst" })).status).toBe(200);
    expect((await post("/gst/portal/connect", { username: "seller.gst", otp: "123456" })).body.error).toBe("invalid_otp");
    expect((await post("/gst/portal/connect", { username: "seller.gst", otp: SIMULATOR_OTP })).status).toBe(200);
    expect(await get("/gst/portal")).toMatchObject({ connected: true, username: "seller.gst", gstin: "27AAPFU0939F1ZV", provider: "simulator" });
    // The portal token is stored encrypted.
    const [row] = await t.ownerDb.db.execute<{ token_enc: string }>(sql`select token_enc from gst_sessions where username = 'seller.gst' order by expires_at desc limit 1`);
    expect(row!.token_enc).toMatch(/^v1\./);
  });

  it("files GSTR-1 only as uploaded, then locks the month", async () => {
    expect((await post("/gst/filings/otp", gstr1Sept)).body.error).toBe("upload_first");
    expect((await post("/gst/filings/upload", gstr1Sept)).body).toMatchObject({ status: "uploaded", returnType: "GSTR1", period: "092026" });
    const late = await post("/sales-invoices", { customerId: id.walkin, date: "2026-09-29", lines: [{ itemId: id.rice, qty: "1", rate: "520" }] });
    expect(late.status).toBe(201);
    expect((await post("/gst/filings/otp", gstr1Sept)).status).toBe(200);
    expect((await post("/gst/filings/file", { ...gstr1Sept, otp: SIMULATOR_OTP })).body.error).toBe("books_changed_since_upload");

    await post("/gst/filings/upload", gstr1Sept);
    expect((await post("/gst/filings/file", { ...gstr1Sept, otp: "000000" })).body.error).toBe("invalid_otp");
    const filed = await post("/gst/filings/file", { ...gstr1Sept, otp: SIMULATOR_OTP });
    expect(filed.body).toMatchObject({ status: "filed", returnType: "GSTR1" });
    expect(filed.body.arn).toMatch(/^AA270926\d{6}[A-Z]$/);

    expect((await post("/sales-invoices", { customerId: id.walkin, date: "2026-09-30", lines: [{ itemId: id.rice, qty: "1", rate: "520" }] })).body.error).toBe("gstr1_filed_for_period");
    expect((await post(`/sales-invoices/${late.body.id}/cancel`, { reason: "Mistake" })).body.error).toBe("gstr1_filed_for_period");
    const lateLine = (await get(`/sales-invoices/${late.body.id}`)).lines[0].id;
    expect((await post("/credit-notes", { invoiceId: late.body.id, date: "2026-09-30", reason: "Return", lines: [{ invoiceLineId: lateLine, qty: "1" }] })).body.error).toBe("gstr1_filed_for_period");
    expect((await post("/gst/filings/upload", gstr1Sept)).body.error).toBe("return_already_filed");
  });

  it("uploads GSTR-3B in the portal's format and files it", async () => {
    const r = await get("/gst/gstr3b?period=092026");
    expect(r.json).toMatchObject({ gstin: "27AAPFU0939F1ZV", ret_period: "092026", sup_details: { osup_nongst: { txval: 0 } } });
    expect(r.json.itc_elg.itc_avl.map((x: { ty: string }) => x.ty)).toEqual(["IMPG", "IMPS", "ISRC", "ISD", "OTH"]);
    await post("/gst/filings/upload", { returnType: "GSTR3B", period: "092026" });
    const filed = await post("/gst/filings/file", { returnType: "GSTR3B", period: "092026", otp: SIMULATOR_OTP });
    expect(filed.body.status).toBe("filed");
    expect((await get("/gst/filings")).map((f: { returnType: string; status: string }) => `${f.returnType}:${f.status}`).sort()).toEqual(["GSTR1:filed", "GSTR3B:filed"]);
  });
});

describe("document lists", () => {
  it("filters by date in the query, so older documents stay reachable past the row cap", async () => {
    const all = (await get("/sales-invoices")) as { id: string; date: string }[];
    expect(all.length).toBeGreaterThan(1);
    const oldest = all.reduce((a, b) => (a.date <= b.date ? a : b));
    const day = (await get(`/sales-invoices?from=${oldest.date}&to=${oldest.date}`)) as { id: string; date: string }[];
    expect(day.map((d) => d.id)).toContain(oldest.id);
    expect(day.every((d) => d.date === oldest.date)).toBe(true);
    const bills = await t.call(c, "GET", `/purchase-bills?from=2020-01-01&to=2020-01-31`);
    expect(bills).toMatchObject({ status: 200, body: [] });
  });
});
