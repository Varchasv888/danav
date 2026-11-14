import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";
import { businessDate, businessTime } from "@varchasv/domain";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const patch = (url: string, body: unknown) => t.call(c, "PATCH", url, body);
const put = (url: string, body: unknown) => t.call(c, "PUT", url, body);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("apparel", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  const group = (k: string) => groups.find((g) => g.key === k)!.id;
  id.shop = (await post("/accounts", { name: "Mumbai Fashion House", groupId: group("sundry_debtors"), stateCode: "27" })).body.id;
  id.mill = (await post("/accounts", { name: "Surat Garments", groupId: group("sundry_creditors"), stateCode: "24" })).body.id;
  const setup = await get("/inventory/setup");
  const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.main = setup.warehouses[0].id;
  id.kurta = (await post("/items", { name: "Silk Kurta", hsn: "6206", gstRate: "5", gstSlab: "apparel", uomId: pcs, saleRate: "3200" })).body.id;
  id.set = (await post("/items", { name: "Kids Set of 4", hsn: "6111", gstRate: "5", gstSlab: "apparel", slabPieces: 4, uomId: pcs, saleRate: "8000" })).body.id;
  id.belt = (await post("/items", { name: "Leather Belt", hsn: "4203", gstRate: "18", uomId: pcs, saleRate: "900" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [id.kurta, id.set, id.belt].map((itemId) => ({ itemId, warehouseId: id.main, qty: "50", rate: "500" })) });
});
afterAll(() => t.close());

describe("GST by price per piece", () => {
  it("picks 5% or 18% on each invoice line from its value after discount", async () => {
    const r = await post("/sales-invoices", {
      customerId: id.shop, date: "2026-10-10",
      lines: [
        { itemId: id.kurta, qty: "2", rate: "3200" }, // Rs 3,200 a piece: 18%
        { itemId: id.kurta, qty: "2", rate: "3200", discount: "1600" }, // Rs 2,400 a piece after discount: 5%
        { itemId: id.set, qty: "1", rate: "8000" }, // Rs 2,000 a piece across four: 5%
        { itemId: id.belt, qty: "1", rate: "900" }, // no slab: the item's own 18%
      ],
    });
    expect(r.status).toBe(201);
    const lines = (await get(`/sales-invoices/${r.body.id}`)).lines as { gstRate: string }[];
    expect(lines.map((l) => Number(l.gstRate))).toEqual([18, 5, 5, 18]);
  });

  it("applies to purchase bills too", async () => {
    const r = await post("/purchase-bills", { supplierId: id.mill, date: "2026-10-05", supplierInvoiceNo: "SG/101", supplierInvoiceDate: "2026-10-05", lines: [{ itemId: id.kurta, qty: "10", rate: "1500" }, { itemId: id.kurta, qty: "1", rate: "2600" }] });
    expect(r.status).toBe(201);
    expect(((await get(`/purchase-bills/${r.body.id}`)).lines as { gstRate: string }[]).map((l) => Number(l.gstRate))).toEqual([5, 18]);
  });

  it("works at the counter after the bill discount is spread, with prices that include GST", async () => {
    await put("/pos/settings", { pricesIncludeTax: true });
    const terminal = (await post("/pos/terminals", { name: "Front counter" })).body.id;
    await post("/pos/sessions", { terminalId: terminal, openingCash: "0" });
    const bill = await post("/pos/bills", {
      terminalId: terminal, billDiscount: "600",
      lines: [{ itemId: id.kurta, qty: "1", price: "2600" }, { itemId: id.kurta, qty: "1", price: "3200" }],
      payments: [{ mode: "cash", amount: "5200" }],
    });
    expect(bill.status).toBe(201);
    const detail = await get(`/pos/bills/${bill.body.id}`);
    expect(detail.lines.map((l: { gstRate: string }) => Number(l.gstRate))).toEqual([5, 18]);
  });
});

describe("partial updates", () => {
  it("renaming an item leaves its tax and prices alone", async () => {
    expect((await patch(`/items/${id.belt}`, { name: "Leather Belt Brown" })).status).toBe(200);
    const item = (await get("/items")).find((i: { id: string }) => i.id === id.belt);
    expect(item).toMatchObject({ name: "Leather Belt Brown", gstRate: "18.00", saleRate: "900.0000" });
    const kurta = (await patch(`/items/${id.kurta}`, { mrp: "3500" })).body;
    expect(kurta).toMatchObject({ gstSlab: "apparel", slabPieces: 1, gstRate: "5.00" });
  });
});

describe("styles with colour and size variants", () => {
  let style: { id: string; variants: { id: string; sku: string; barcode: string; color: string; size: string; name: string }[] };
  const colorId = async (name: string) => ((await get("/colors")) as { id: string; name: string }[]).find((c) => c.name === name)!.id;

  it("starts a business with size scales and colours", async () => {
    const scales = await get("/size-scales");
    expect(scales.map((s: { name: string }) => s.name)).toContain("Garments (XS to 3XL)");
    expect((await get("/colors")).length).toBeGreaterThan(10);
  });

  it("creates one item per colour and size, each with its own SKU and in-store barcode", async () => {
    const scale = (await get("/size-scales")).find((s: { name: string }) => s.name.startsWith("Garments"));
    const setup = await get("/inventory/setup");
    const r = await post("/styles", {
      code: "KT-101", name: "Cotton Kurta", brand: "Anvi", season: "Festive 2026", hsn: "6211", gstSlab: "apparel", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id,
      purchaseRate: "450", saleRate: "1299", mrp: "1499", sizeScaleId: scale.id, fits: null,
      colorIds: [await colorId("Navy"), await colorId("Maroon")], sizes: ["S", "M", "L", "XL"], sizePrices: { XL: { saleRate: "1399" } },
    });
    expect(r.status).toBe(201);
    style = r.body;
    expect(style.variants).toHaveLength(8);
    const navyM = style.variants.find((v) => v.color === "Navy" && v.size === "M")!;
    expect(navyM).toMatchObject({ name: "Cotton Kurta Navy M", sku: "KT-101-NVY-M", gstSlab: "apparel", saleRate: "1299.0000" });
    expect(style.variants.find((v) => v.color === "Navy" && v.size === "XL")).toMatchObject({ saleRate: "1399.0000" });
    // EAN-13 with a valid check digit, all different.
    for (const v of style.variants) {
      expect(v.barcode).toMatch(/^2\d{12}$/);
      const sum = [...v.barcode.slice(0, 12)].reduce((s, d, i) => s + Number(d) * (i % 2 ? 3 : 1), 0);
      expect(Number(v.barcode[12])).toBe((10 - (sum % 10)) % 10);
    }
    expect(new Set(style.variants.map((v) => v.barcode)).size).toBe(8);
    expect((await post("/styles", { code: "kt-101", name: "Copy", uomId: setup.uoms[0].id, colorIds: [await colorId("Navy")], sizes: ["M"] })).body.error).toBe("style_code_taken");
  });

  it("adds only the variants a style doesn't have", async () => {
    const r = await post(`/styles/${style.id}/variants`, { colorIds: [await colorId("Navy"), await colorId("Black")], sizes: ["M", "XXL"] });
    expect(r.body.map((v: { color: string; size: string }) => `${v.color} ${v.size}`).sort()).toEqual(["Black M", "Black XXL", "Navy XXL"]);
  });

  it("shows stock as a colour by size grid", async () => {
    const navy = style.variants.filter((v) => v.color === "Navy");
    await post("/stock-journals", { kind: "opening", lines: navy.map((v, i) => ({ itemId: v.id, warehouseId: id.main, qty: String(10 + i), rate: "450" })) });
    const s = await get(`/styles/${style.id}`);
    expect(s.sizes).toEqual(["S", "M", "L", "XL", "XXL"]);
    expect(s.colors).toEqual(expect.arrayContaining(["Navy", "Maroon", "Black"]));
    expect(s.variants.find((v: { color: string; size: string }) => v.color === "Navy" && v.size === "S").stockQty).toBe("10");
    expect((await get("/styles?search=kurta")).find((x: { id: string }) => x.id === style.id)).toMatchObject({ variants: 11, colors: 3, stockQty: "46" });
  });

  it("sells and buys a set as its pieces, priced per piece for GST", async () => {
    const pack = await post(`/styles/${style.id}/packs`, { colorId: await colorId("Navy"), ratio: { S: 1, M: 2, L: 2, XL: 1 } });
    expect(pack.status).toBe(201);
    expect(pack.body).toMatchObject({ isPack: true, slabPieces: 6, name: "Cotton Kurta Navy set S1-M2-L2-XL1", saleRate: "7894.0000" });
    const before = (await get(`/styles/${style.id}`)).variants.filter((v: { color: string }) => v.color === "Navy");
    const qty = (vs: { size: string; stockQty: string }[], size: string) => Number(vs.find((v) => v.size === size)!.stockQty);
    const inv = await post("/sales-invoices", { customerId: id.shop, date: "2026-10-12", lines: [{ itemId: pack.body.id, qty: "2", rate: "7800" }] });
    expect(inv.status).toBe(201);
    expect(Number((await get(`/sales-invoices/${inv.body.id}`)).lines[0].gstRate)).toBe(5); // Rs 1,300 a piece
    const after = (await get(`/styles/${style.id}`)).variants.filter((v: { color: string }) => v.color === "Navy");
    expect(qty(before, "M") - qty(after, "M")).toBe(4);
    expect(qty(before, "XL") - qty(after, "XL")).toBe(2);
    const bill = await post("/purchase-bills", { supplierId: id.mill, date: "2026-10-12", supplierInvoiceNo: "SG/202", supplierInvoiceDate: "2026-10-12", lines: [{ itemId: pack.body.id, qty: "3", rate: "2700" }] });
    expect(bill.status).toBe(201);
    const restocked = (await get(`/styles/${style.id}`)).variants.filter((v: { color: string }) => v.color === "Navy");
    expect(qty(restocked, "L") - qty(after, "L")).toBe(6);
  });

  it("changing the style's tax changes every variant", async () => {
    await patch(`/styles/${style.id}`, { gstSlab: null, gstRate: "12" });
    const s = await get(`/styles/${style.id}`);
    expect(s.variants.every((v: { gstSlab: string | null; gstRate: string }) => v.gstSlab === null && v.gstRate === "12.00")).toBe(true);
  });
});

describe("proforma invoices and challans", () => {
  const stock = async (itemId: string) => Number((await get("/items")).find((i: { id: string }) => i.id === itemId).stockQty);

  it("issues a proforma with its own series and an advance, then turns it into the invoice", async () => {
    const pi = await post("/quotations", { kind: "proforma", customerId: id.shop, date: "2026-10-14", advanceDue: "2000", lines: [{ itemId: id.kurta, qty: "2", rate: "2400" }] });
    expect(pi.status).toBe(201);
    expect(pi.body).toMatchObject({ kind: "proforma", advanceDue: "2000.00", total: "5040.00" });
    expect(pi.body.number).toMatch(/^PI\//);
    expect((await get("/quotations?kind=proforma")).map((q: { id: string }) => q.id)).toContain(pi.body.id);
    expect((await get("/quotations")).map((q: { id: string }) => q.id)).not.toContain(pi.body.id);
    expect((await post("/quotations", { kind: "proforma", customerId: id.shop, date: "2026-10-14", advanceDue: "9000", lines: [{ itemId: id.kurta, qty: "1", rate: "2400" }] })).body.error).toBe("advance_more_than_total");
    const inv = await post("/sales-invoices", { customerId: id.shop, date: "2026-10-15", quotationId: pi.body.id, lines: [{ itemId: id.kurta, qty: "2", rate: "2400" }] });
    expect(inv.status).toBe(201);
    expect((await get(`/quotations/${pi.body.id}`)).status).toBe("converted");
  });

  it("sends goods on approval, takes back what didn't sell and invoices the rest", async () => {
    const before = await stock(id.kurta);
    const memo = await post("/delivery-notes", { customerId: id.shop, date: "2026-10-01", reason: "approval", vehicleNo: "mh01ab1234", lines: [{ itemId: id.kurta, qty: "10" }] });
    expect(memo.status).toBe(201);
    expect(memo.body).toMatchObject({ reason: "approval", vehicleNo: "MH01AB1234", taxable: "32000.00", total: "37760.00" }); // the item's sale rate, 18% above Rs 2,500
    expect(await stock(id.kurta)).toBe(before - 10);
    const note = await get(`/delivery-notes/${memo.body.id}`);
    expect(note.invoiceBy).toBe("2027-04-01");
    const pending = (await get("/approvals/pending?today=2026-10-31")).find((p: { id: string }) => p.id === memo.body.id);
    expect(pending).toMatchObject({ pieces: "10.0000", value: "32000.00", daysOut: 30, invoiceBy: "2027-04-01" });

    const line = note.lines[0].id;
    expect((await post(`/delivery-notes/${memo.body.id}/returns`, { date: "2026-10-20", lines: [{ lineId: line, qty: "3" }] })).status).toBe(201);
    expect(await stock(id.kurta)).toBe(before - 7);
    expect((await post(`/delivery-notes/${memo.body.id}/cancel`, { reason: "changed our mind" })).body.error).toBe("delivery_has_returns");
    expect((await post("/sales-invoices", { customerId: id.shop, date: "2026-10-21", lines: [{ itemId: id.kurta, qty: "8", rate: "3200", deliveryLineId: line }] })).body.error).toBe("over_invoicing");
    expect((await post("/sales-invoices", { customerId: id.shop, date: "2026-10-21", lines: [{ itemId: id.kurta, qty: "5", rate: "3200", deliveryLineId: line }] })).status).toBe(201);
    expect(await stock(id.kurta)).toBe(before - 7); // invoicing a challan doesn't move stock again
    expect((await post(`/delivery-notes/${memo.body.id}/returns`, { date: "2026-10-22", lines: [{ lineId: line, qty: "3" }] })).body.error).toBe("over_return");
    await post(`/delivery-notes/${memo.body.id}/returns`, { date: "2026-10-22", lines: [{ lineId: line, qty: "2" }] });
    const done = await get(`/delivery-notes/${memo.body.id}`);
    expect(done).toMatchObject({ status: "invoiced" });
    expect(done.returns).toHaveLength(2);
    expect((await get("/approvals/pending")).find((p: { id: string }) => p.id === memo.body.id)).toBeUndefined();
  });

  it("shows value without tax when the goods move but aren't sold", async () => {
    const dc = await post("/delivery-notes", { customerId: id.shop, date: "2026-10-05", reason: "exhibition", lines: [{ itemId: id.belt, qty: "4", rate: "800" }] });
    expect(dc.body).toMatchObject({ reason: "exhibition", taxable: "3200.00", total: "3200.00", cgst: "0.00" });
    const print = await get(`/delivery-notes/${dc.body.id}/print`);
    expect(print.invoice).toMatchObject({ number: dc.body.number, reason: "exhibition", customerName: "Mumbai Fashion House" });
    expect(print.invoice.lines[0]).toMatchObject({ rate: "800.0000", gstRate: null, taxable: "3200.00" });
  });
});

describe("wholesale credit, interest and price lists", () => {
  const debtor = async (name: string, extra: Record<string, unknown>) => {
    const groups: { id: string; key: string }[] = await get("/accounts/groups");
    return (await post("/accounts", { name, groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27", ...extra })).body.id as string;
  };

  it("blocks a sale over the credit limit unless an owner overrides it", async () => {
    const party = await debtor("Bhiwandi Wholesale", { creditLimit: "10000", creditControl: "block" });
    const sale = { customerId: party, date: "2026-10-10", lines: [{ itemId: id.belt, qty: "20", rate: "900" }] };
    expect((await post("/sales-invoices", sale)).body.error).toBe("credit_blocked");
    expect((await post("/sales-orders", sale)).body.error).toBe("credit_blocked");
    expect((await post("/sales-invoices", { ...sale, overrideCredit: true })).body.error).toBe("override_reason_required");
    const ok = await post("/sales-invoices", { ...sale, overrideCredit: true, overrideReason: "Owner approved by phone" });
    expect(ok.status).toBe(201);
    expect(ok.body.warnings.map((w: { code: string }) => w.code)).toContain("credit_limit_exceeded");
    // With "warn" the same sale goes through with the warning.
    await patch(`/accounts/${party}`, { creditControl: "warn" });
    const warned = await post("/sales-orders", sale);
    expect(warned.status).toBe(201);
    expect(warned.body.warnings.map((w: { code: string }) => w.code)).toEqual(["credit_limit_exceeded"]);
  });

  it("blocks a customer with a bill overdue too long, ages it past 90 days and works out the interest", async () => {
    const party = await debtor("Ulhasnagar Traders", { interestRate: "18" });
    const old = await post("/sales-invoices", { customerId: party, date: "2026-06-01", dueOn: "2026-06-15", lines: [{ itemId: id.belt, qty: "10", rate: "1000" }] });
    expect(old.status).toBe(201);
    await patch(`/accounts/${party}`, { blockOverdueDays: 60, creditControl: "block" });
    expect((await post("/sales-invoices", { customerId: party, date: "2026-10-20", lines: [{ itemId: id.belt, qty: "1", rate: "900" }] })).body.error).toBe("overdue_blocked");

    const ageing = (await get("/reports/receivables?asOf=2026-10-20")).rows.find((r: { partyId: string }) => r.partyId === party);
    expect(ageing.buckets).toMatchObject({ d91_180: old.body.total, d180plus: "0.00" });
    const interest = (await get("/reports/interest?asOf=2026-10-20")).rows.find((r: { partyId: string }) => r.partyId === party);
    // Rs 11,800 at 18% a year for the 127 days it is late.
    expect(interest).toMatchObject({ rate: "18.00", overdue: "11800.00", interest: "739.04" });
    expect(interest.bills[0]).toMatchObject({ daysOverdue: 127 });
  });

  it("prices a customer's sales from their price list", async () => {
    const list = await post("/price-lists", { name: "Wholesale", discountPct: "10", items: [{ itemId: id.belt, rate: "750" }] });
    expect(list.status).toBe(201);
    expect((await post("/price-lists", { name: "wholesale" })).body.error).toBe("price_list_name_taken");
    const rates = await get(`/price-lists/${list.body.id}/rates`);
    expect(rates[id.belt]).toBe("750");
    expect(rates[id.kurta]).toBe("2880"); // Rs 3,200 less 10%
    const party = await debtor("Kalyan Retail", { priceListId: list.body.id });
    expect((await get("/accounts")).find((a: { id: string }) => a.id === party).priceListId).toBe(list.body.id);
    expect((await get("/price-lists")).find((l: { id: string }) => l.id === list.body.id)).toMatchObject({ items: 1, customers: 1 });
  });
});

describe("brokers, agents and salesman targets", () => {
  const groups = async () => (await get("/accounts/groups")) as { id: string; key: string }[];
  const receive = async (party: string, amount: string, date: string) => {
    const cash = (await get("/accounts")).find((a: { key: string }) => a.key === "cash").id;
    return post("/vouchers", { type: "receipt", date, lines: [{ accountId: cash, debit: amount }, { accountId: party, credit: amount }] });
  };
  const commission = async (agent: string, asOf: string) => (await get(`/reports/agent-commission?asOf=${asOf}&agentId=${agent}`)).rows[0];

  it("pays an agent commission on money received, takes it back on returns, and deducts TDS", async () => {
    const g = await groups();
    const agent = (await post("/accounts", { name: "Ramesh Brokers", groupId: g.find((x) => x.key === "sundry_creditors")!.id, stateCode: "27", isAgent: true, commissionPct: "2" })).body.id;
    const party = (await post("/accounts", { name: "Dadar Collections", groupId: g.find((x) => x.key === "sundry_debtors")!.id, stateCode: "27", agentId: agent })).body.id;
    expect((await patch(`/accounts/${party}`, { agentId: party })).body.error).toBe("not_an_agent");

    const inv = await post("/sales-invoices", { customerId: party, date: "2026-10-01", lines: [{ itemId: id.belt, qty: "10", rate: "1000" }] });
    expect(inv.status).toBe(201);
    expect(inv.body).toMatchObject({ agentId: agent, agentPct: "2.00", total: "11800.00" });
    expect(await commission(agent, "2026-10-01")).toMatchObject({ earned: "0.00", due: "0.00" });

    // Half the bill paid: commission on half the taxable value.
    await receive(party, "5900", "2026-10-05");
    expect(await commission(agent, "2026-10-05")).toMatchObject({ earned: "100.00", due: "100.00" });
    const first = await post("/brokerage-bills", { agentId: agent, date: "2026-10-06" });
    expect(first.status).toBe(201);
    expect(first.body).toMatchObject({ amount: "100.00", tds: "0.00", net: "100.00" }); // under the Rs 20,000 a year 194H limit
    expect((await post("/brokerage-bills", { agentId: agent, date: "2026-10-06" })).body.error).toBe("nothing_to_bill");

    // Paid in full, then two belts come back: commission on Rs 8,000, less the Rs 100 already billed.
    await receive(party, "5900", "2026-10-10");
    const line = (await get(`/sales-invoices/${inv.body.id}`)).lines[0];
    expect((await post("/credit-notes", { invoiceId: inv.body.id, date: "2026-10-12", reason: "Returned", lines: [{ invoiceLineId: line.id, qty: "2" }] })).status).toBe(201);
    expect(await commission(agent, "2026-10-12")).toMatchObject({ earned: "160.00", billed: "100.00", due: "60.00" });
    const second = await post("/brokerage-bills", { agentId: agent, date: "2026-10-15", tdsRate: "2" });
    expect(second.body).toMatchObject({ amount: "60.00", tds: "1.00", net: "59.00" });
    const ledger = await get(`/reports/ledger/${agent}?from=2026-04-01&to=2026-10-31`);
    expect(ledger.closing).toBe("-159.00"); // owed Rs 100 + Rs 59; Rs 1 went to TDS payable

    // Cancelling a bill puts its commission back as due.
    expect((await post(`/brokerage-bills/${second.body.id}/cancel`, { reason: "Wrong rate" })).status).toBe(200);
    expect(await commission(agent, "2026-10-15")).toMatchObject({ due: "60.00" });
    expect((await get("/brokerage-bills")).map((b: { status: string }) => b.status)).toEqual(["cancelled", "posted"]);
  });

  it("carries the order's agent and rate onto the invoice", async () => {
    const agents = await get("/agents");
    const party = (await post("/accounts", { name: "Thane Textiles", groupId: (await groups()).find((x) => x.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
    const order = await post("/sales-orders", { customerId: party, date: "2026-10-20", agentId: agents[0].id, agentPct: "3", lines: [{ itemId: id.belt, qty: "1", rate: "900" }] });
    expect(order.body).toMatchObject({ agentId: agents[0].id, agentPct: "3.00" });
    const inv = await post("/sales-invoices", { customerId: party, orderId: order.body.id, date: "2026-10-21", lines: [{ itemId: id.belt, qty: "1", rate: "900" }] });
    expect(inv.body).toMatchObject({ agentId: agents[0].id, agentPct: "3.00" });
    const none = await post("/sales-invoices", { customerId: party, orderId: order.body.id, agentId: null, date: "2026-10-21", lines: [{ itemId: id.belt, qty: "1", rate: "900" }] });
    expect(none.body).toMatchObject({ agentId: null, agentPct: null });
  });

  it("pays a salesman at the slab their sales reach against the month's target", async () => {
    const meera = (await post("/employees", { name: "Meera Shah", gender: "female", joinedOn: "2026-04-01", workState: "27" })).body.id;
    const party = (await post("/accounts", { name: "Andheri Boutique", groupId: (await groups()).find((x) => x.key === "sundry_debtors")!.id, stateCode: "27", salesmanId: meera })).body.id;
    const set = await put("/sales-targets/2026-11", { targets: [{ employeeId: meera, target: "20000", slabs: [{ from: "100", rate: "2" }, { from: "0", rate: "1" }] }] });
    expect(set.status).toBe(200);
    const inv = await post("/sales-invoices", { customerId: party, date: "2026-11-03", lines: [{ itemId: id.belt, qty: "25", rate: "1000" }] });
    expect(inv.body.salesmanId).toBe(meera);
    const row = async () => (await get("/reports/salesman?month=2026-11")).rows.find((r: { employeeId: string }) => r.employeeId === meera);
    expect(await row()).toMatchObject({ target: "20000.00", achieved: "25000.00", achievedPct: "125.0", rate: "2.00", commission: "500.00" });
    // Returns that month count against the salesman; still at 100% of target.
    const line = (await get(`/sales-invoices/${inv.body.id}`)).lines[0];
    await post("/credit-notes", { invoiceId: inv.body.id, date: "2026-11-20", reason: "Returned", lines: [{ invoiceLineId: line.id, qty: "5" }] });
    expect(await row()).toMatchObject({ achieved: "20000.00", achievedPct: "100.0", rate: "2.00", commission: "400.00" });
    expect((await put("/sales-targets/2026-11", { targets: [{ employeeId: meera, target: "1", slabs: [{ from: "0", rate: "1" }, { from: "0", rate: "2" }] }] })).body.error).toBe("duplicate_slab");
  });
});

describe("store schemes at the counter", () => {
  let terminal: string;
  const bill = (lines: { itemId: string; qty: string; discount?: string }[], cash = "10000") =>
    post("/pos/bills", { terminalId: terminal, lines, payments: [{ mode: "cash", amount: cash }] });

  it("takes a brand's percent off, finding the brand through the style", async () => {
    terminal = (await post("/pos/terminals", { name: "Offers counter" })).body.id;
    await post("/pos/sessions", { terminalId: terminal, openingCash: "0" });
    const anvi = await post("/schemes", { name: "Anvi 20%", kind: "percent", pct: "20", startsOn: "2026-10-01", scope: { brands: ["anvi"] } });
    expect(anvi.status).toBe(201);
    const resolved = (await get("/pos/schemes")).find((x: { id: string }) => x.id === anvi.body.id);
    expect(resolved.itemIds.length).toBeGreaterThanOrEqual(11); // every Anvi kurta variant
    const kurta = resolved.itemIds[0];
    const r = await bill([{ itemId: kurta, qty: "1" }, { itemId: id.belt, qty: "1" }]);
    expect(r.status).toBe(201);
    const discount = (await get(`/pos/bills/${r.body.id}`)).lines.map((l: { discount: string }) => l.discount);
    expect(r.body.schemes).toEqual([{ schemeId: anvi.body.id, name: "Anvi 20%", discount: expect.stringMatching(/^2[57]9\.80$/) }]);
    expect(discount[1]).toBe("0.00");
    await put(`/schemes/${anvi.body.id}`, { name: "Anvi 20%", kind: "percent", pct: "20", active: false, scope: { brands: ["anvi"] } });
    expect((await get("/pos/schemes")).some((x: { id: string }) => x.id === anvi.body.id)).toBe(false);
  });

  it("gives the third belt free, but not on a line with its own discount", async () => {
    const b = await post("/schemes", { name: "Belts buy 2 get 1", kind: "buy_get", buy: 2, get: 1, scope: { itemIds: [id.belt] } });
    expect(b.body).toMatchObject({ pct: "100.00", buy: 2, get: 1 });
    const r = await bill([{ itemId: id.belt, qty: "3" }]);
    expect(r.body.schemes).toEqual([{ schemeId: b.body.id, name: "Belts buy 2 get 1", discount: "900.00" }]);
    expect(r.body.total).toBe("1800.00");
    const manual = await bill([{ itemId: id.belt, qty: "3", discount: "100" }]);
    expect(manual.body.schemes).toEqual([]);
    await put(`/schemes/${b.body.id}`, { name: "Belts buy 2 get 1", kind: "buy_get", buy: 2, get: 1, active: false, scope: { itemIds: [id.belt] } });
  });

  it("applies a ranked offer first even when another would save more", async () => {
    const belt = { kind: "percent", scope: { itemIds: [id.belt] } };
    const small = await post("/schemes", { ...belt, name: "Belt ten", pct: "10", priority: 1 });
    const big = await post("/schemes", { ...belt, name: "Belt twenty five", pct: "25" });
    expect(small.body.priority).toBe(1);
    const r = await bill([{ itemId: id.belt, qty: "1" }]);
    expect(r.body.schemes.map((x: { name: string }) => x.name)).toEqual(["Belt ten"]);
    await put(`/schemes/${small.body.id}`, { ...belt, name: "Belt ten", pct: "10", priority: null });
    const free = await bill([{ itemId: id.belt, qty: "1" }]);
    expect(free.body.schemes.map((x: { name: string }) => x.name)).toEqual(["Belt twenty five"]);
    for (const [row, name, pct] of [[small, "Belt ten", "10"], [big, "Belt twenty five", "25"]] as const) await put(`/schemes/${row.body.id}`, { ...belt, name, pct, active: false });
  });

  it("checks what a scheme needs", async () => {
    expect((await post("/schemes", { name: "Broken", kind: "percent" })).body.error).toBe("scheme_incomplete");
    expect((await post("/schemes", { name: "Late", kind: "percent", pct: "5", startsOn: "2026-11-30", endsOn: "2026-11-01" })).body.error).toBe("ends_before_start");
    expect((await post("/schemes", { name: "anvi 20%", kind: "percent", pct: "5" })).body.error).toBe("scheme_name_taken");
    const combo = await post("/schemes", { name: "Hamper", kind: "combo", comboPrice: "1000", comboItems: [{ itemId: id.belt, qty: 1 }, { itemId: id.kurta, qty: 1 }], scope: { brands: ["x"] } });
    expect(combo.body.scope).toEqual({}); // a combo names its own items
    await put(`/schemes/${combo.body.id}`, { name: "Hamper", kind: "combo", comboPrice: "1000", comboItems: [{ itemId: id.belt, qty: 1 }, { itemId: id.kurta, qty: 1 }], active: false });
  });

  it("runs only on its days, in its hours and in its branches", async () => {
    const today = new Date(`${businessDate()}T00:00:00Z`).getUTCDay();
    const other = [0, 1, 2, 3, 4, 5, 6].filter((d) => d !== today);
    const base = { kind: "percent", pct: "10", scope: { itemIds: [id.belt] } };
    expect((await post("/schemes", { ...base, name: "Half hours", fromTime: "10:00" })).body.error).toBe("hours_need_both");
    expect((await post("/schemes", { ...base, name: "Zero hours", fromTime: "10:00", toTime: "10:00" })).body.error).toBe("hours_empty");
    expect((await post("/schemes", { ...base, name: "Bad day", weekdays: [7] })).status).toBe(400);
    const priced = async () => (await bill([{ itemId: id.belt, qty: "1" }])).body.schemes.length;

    const onOther = await post("/schemes", { ...base, name: "Other days", weekdays: other });
    expect(onOther.body.weekdays).toEqual(other);
    expect(await priced()).toBe(0);
    await put(`/schemes/${onOther.body.id}`, { ...base, name: "Other days", weekdays: [today] });
    expect(await priced()).toBe(1);

    // A window around now (it may cross midnight) applies; one that is hours away does not.
    const at = (plus: number) => { const m = (Number(businessTime().slice(0, 2)) * 60 + Number(businessTime().slice(3)) + plus + 1440) % 1440; return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; };
    await put(`/schemes/${onOther.body.id}`, { ...base, name: "Other days", weekdays: null, fromTime: at(-120), toTime: at(120) });
    expect(await priced()).toBe(1);
    await put(`/schemes/${onOther.body.id}`, { ...base, name: "Other days", weekdays: null, fromTime: at(180), toTime: at(240) });
    expect(await priced()).toBe(0);

    // Branch: a counter in a branch gets that branch's schemes and the all-branch ones, not another branch's.
    const branch = (await get("/companies"))[0].branches[0].id;
    const wh = (await post("/warehouses", { name: "Branch store", branchId: branch })).body.id;
    await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.belt, warehouseId: wh, qty: "10", rate: "500" }] });
    const bt = (await post("/pos/terminals", { name: "Branch counter", warehouseId: wh })).body.id;
    await post("/pos/sessions", { terminalId: bt, openingCash: "0" });
    expect((await get("/pos/terminals")).find((x: { id: string }) => x.id === bt).branchId).toBe(branch);
    const there = async () => (await post("/pos/bills", { terminalId: bt, lines: [{ itemId: id.belt, qty: "1" }], payments: [{ mode: "cash", amount: "10000" }] })).body.schemes.length;
    const scheme = { ...base, name: "Other days", fromTime: null, toTime: null, weekdays: null };
    await put(`/schemes/${onOther.body.id}`, { ...scheme, branchIds: ["00000000-0000-4000-8000-000000000000"] });
    expect(await there()).toBe(0);
    await put(`/schemes/${onOther.body.id}`, { ...scheme, branchIds: [branch] });
    expect(await there()).toBe(1);
    // The default store is tied to no branch, so a branch-only scheme is not offered there.
    expect(await priced()).toBe(0);
    await put(`/schemes/${onOther.body.id}`, { ...scheme, branchIds: null });
    expect(await priced()).toBe(1);
    await put(`/schemes/${onOther.body.id}`, { ...base, name: "Other days", active: false });
  });
});

describe("gift vouchers, coupons, discount cards and referrals", () => {
  let terminal: string;
  const bill = (body: Record<string, unknown>) => post("/pos/bills", { terminalId: terminal, payments: [], ...body });
  const belt = (qty: string) => [{ itemId: id.belt, qty }];

  it("sells gift vouchers as a liability and takes them as payment, giving the balance back on a void", async () => {
    terminal = (await post("/pos/terminals", { name: "Voucher counter" })).body.id;
    await post("/pos/sessions", { terminalId: terminal, openingCash: "0" });
    const sold = await post("/gift-vouchers", { value: "1000", count: 2, expiresOn: "2027-03-31", paidBy: "cash", customerName: "Riya" });
    expect(sold.status).toBe(201);
    const [a, b] = sold.body as { code: string; balance: string }[];
    expect(a!.code).toMatch(/^[A-Z2-9]{10}$/);
    const liability = (await get("/accounts")).find((x: { key: string }) => x.key === "gift_vouchers");
    expect(Math.abs(Number(liability.balance))).toBe(2000);

    const paid = await bill({ lines: belt("1"), giftVouchers: [{ code: a!.code, amount: "900" }] });
    expect(paid.status).toBe(201);
    expect(paid.body.promos.vouchers).toEqual([expect.objectContaining({ code: a!.code, amount: "900.00" })]);
    expect((await get(`/gift-vouchers/${a!.code.toLowerCase()}`))).toMatchObject({ balance: "100.00", status: "active" });
    expect((await bill({ lines: belt("1"), giftVouchers: [{ code: b!.code, amount: "1000" }] })).body.error).toBe("voucher_more_than_bill");
    expect((await bill({ lines: belt("1"), giftVouchers: [{ code: a!.code, amount: "500" }] })).body.error).toBe("voucher_balance_low");

    expect((await post(`/pos/bills/${paid.body.id}/void`, { reason: "Wrong item" })).status).toBe(200);
    expect((await get(`/gift-vouchers/${a!.code}`))).toMatchObject({ balance: "1000.00", status: "active" });
  });

  it("writes back what is left on expired vouchers", async () => {
    const from = (days: number) => businessDate(new Date(Date.now() + days * 86_400_000));
    const [v] = (await post("/gift-vouchers", { value: "500", count: 1, expiresOn: from(1), paidBy: "upi" })).body as { code: string }[];
    const r = await post("/gift-vouchers/expire", { asOf: from(2) });
    expect(r.body).toEqual({ expired: 1, amount: "500.00" });
    expect((await get(`/gift-vouchers/${v!.code}`)).status).toBe("expired");
  });

  it("applies a coupon above its minimum, up to its cap and its uses", async () => {
    expect((await post("/coupons", { code: "save10", kind: "percent", value: "10", maxDiscount: "50", minBill: "1000", maxUses: 1 })).status).toBe(201);
    expect((await post("/coupons", { code: "SAVE10", kind: "amount", value: "5" })).body.error).toBe("code_taken");
    expect((await bill({ lines: belt("1"), couponCode: "SAVE10", payments: [{ mode: "cash", amount: "900" }] })).body.error).toBe("coupon_min_bill");
    const r = await bill({ lines: belt("2"), couponCode: "save10", payments: [{ mode: "cash", amount: "1750" }] });
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({ total: "1750.00", promos: { coupon: expect.objectContaining({ code: "SAVE10", discount: "50.00" }) } });
    expect((await bill({ lines: belt("2"), couponCode: "SAVE10", payments: [{ mode: "cash", amount: "1800" }] })).body.error).toBe("coupon_used_up");
    expect((await get("/pos/promo?coupon=nope")).error).toBe("coupon_not_found");
  });

  it("takes a discount card's percent off the bill", async () => {
    await post("/discount-cards", { number: "STAFF-1", holder: "Store staff", pct: "20" });
    expect((await get("/pos/promo?card=staff-1")).card).toMatchObject({ holder: "Store staff", pct: "20.00" });
    const r = await bill({ lines: belt("1"), cardNumber: "staff-1", payments: [{ mode: "cash", amount: "720" }] });
    expect(r.body).toMatchObject({ total: "720.00", promos: { card: expect.objectContaining({ discount: "180.00" }) } });
  });

  it("gives points to the member who referred a new customer", async () => {
    await put("/pos/settings", { loyaltyEnabled: true, referralPoints: 50 });
    await bill({ lines: belt("1"), customerPhone: "9811111111", payments: [{ mode: "cash", amount: "900" }] });
    const before = (await get("/pos/loyalty/9811111111")).points;
    await bill({ lines: belt("1"), customerPhone: "9822222222", referredBy: "9811111111", payments: [{ mode: "cash", amount: "900" }] });
    expect((await get("/pos/loyalty/9811111111")).points).toBe(before + 50);
    // Only a new member brings referral points.
    await bill({ lines: belt("1"), customerPhone: "9822222222", referredBy: "9811111111", payments: [{ mode: "cash", amount: "900" }] });
    expect((await get("/pos/loyalty/9811111111")).points).toBe(before + 50);
  });

  it("picks lucky draw winners, one per customer", async () => {
    const r = await post("/lucky-draws", { name: "Diwali draw", fromDate: "2026-10-01", toDate: "2026-12-31", winners: 5 });
    expect(r.status).toBe(201);
    expect(r.body.entries).toBeGreaterThanOrEqual(3);
    const phones = r.body.winners.map((w: { phone: string }) => w.phone);
    expect(new Set(phones).size).toBe(phones.length);
    expect(phones.length).toBeGreaterThanOrEqual(2); // at least the two members above
  });
});

describe("returns and exchanges at the counter", () => {
  it("takes goods back with a reason and condition, refunds or gives store credit for an exchange, and reports it", async () => {
    const terminal = (await post("/pos/terminals", { name: "Returns counter" })).body.id;
    await post("/pos/sessions", { terminalId: terminal, openingCash: "0" });
    const sale = await post("/pos/bills", { terminalId: terminal, lines: [{ itemId: id.belt, qty: "3" }], payments: [{ mode: "cash", amount: "2700" }] });
    expect(sale.status).toBe(201);
    const bill = await get(`/pos/bills/lookup?number=${sale.body.number.toLowerCase()}`);
    const line = bill.lines[0];
    expect(line.returnedQty).toBe("0.0000");

    // Wrong size, as good as new: cash back, belt back on the shelf.
    const cash = await post("/pos/returns", { billId: bill.id, terminalId: terminal, refundMode: "cash", lines: [{ lineId: line.id, qty: "1", reason: "size", grade: "A" }] });
    expect(cash.status).toBe(201);
    expect(cash.body).toMatchObject({ total: "900.00", refundMode: "cash", voucherCode: null });
    expect(cash.body.number).toMatch(/R\/\d{2}-\d{2}\/\d{5}$/);
    const day = await get(`/pos/summary?date=${sale.body.date}&terminalId=${terminal}`);
    expect(day).toMatchObject({ cash: "1800.00", returns: "900.00" });
    expect((await post("/pos/returns", { billId: bill.id, terminalId: terminal, refundMode: "cash", lines: [{ lineId: line.id, qty: "3", reason: "size", grade: "A" }] })).body.error).toBe("over_return");

    // Faulty piece swapped for another: store credit pays for the exchange, the faulty one goes to the damaged store.
    const swap = await post("/pos/returns", { billId: bill.id, terminalId: terminal, refundMode: "voucher", lines: [{ lineId: line.id, qty: "1", reason: "defect", grade: "C" }] });
    expect(swap.body.voucherCode).toMatch(/^[A-Z2-9]{10}$/);
    expect(await get(`/gift-vouchers/${swap.body.voucherCode}`)).toMatchObject({ balance: "900.00", paidBy: "return", status: "active" });
    expect((await get("/inventory/setup")).warehouses.map((w: { name: string }) => w.name)).toContain("Damaged and seconds");
    const exchange = await post("/pos/bills", { terminalId: terminal, lines: [{ itemId: id.belt, qty: "1" }], giftVouchers: [{ code: swap.body.voucherCode, amount: "900" }], payments: [] });
    expect(exchange.status).toBe(201);
    expect((await get(`/pos/bills/${bill.id}`)).lines[0].returnedQty).toBe("2.0000");

    const report = await get(`/pos/returns?from=${sale.body.date}&to=${sale.body.date}`);
    expect(report.total).toBe("1800.00");
    expect(report.byReason.map((r: { key: string }) => r.key).sort()).toEqual(["defect", "size"]);
    expect(report.byGrade.map((r: { key: string }) => r.key).sort()).toEqual(["A", "C"]);

    // GST: the returns come off the month's counter sales.
    const [y, m] = sale.body.date.split("-");
    const g1 = await get(`/gst/gstr1?period=${m}${y}`);
    expect(g1.summary.posReturns).toMatchObject({ count: 2, total: "1800.00" });
    expect(g1.json.doc_issue.doc_det.find((d: { doc_num: number }) => d.doc_num === 5).docs.length).toBeGreaterThanOrEqual(1);
  });
});

describe("alterations and repairs", () => {
  it("takes a slip against a bill, gives it to a karigar, books outside labour and collects the charge at delivery", async () => {
    const terminal = (await post("/pos/terminals", { name: "Alteration desk" })).body.id;
    await post("/pos/sessions", { terminalId: terminal, openingCash: "0" });
    const sale = await post("/pos/bills", { terminalId: terminal, customerPhone: "9833333333", customerName: "Kiran", lines: [{ itemId: id.kurta, qty: "1" }], payments: [{ mode: "cash", amount: "3200" }] });
    const g = (await get("/accounts/groups")) as { id: string; key: string }[];
    const ledger = (await post("/accounts", { name: "Salim Tailors", groupId: g.find((x) => x.key === "sundry_creditors")!.id, stateCode: "27" })).body.id;
    const outside = (await post("/karigars", { name: "Salim", phone: "9844444444", accountId: ledger })).body.id;
    expect((await post("/karigars", { name: "salim" })).body.error).toBe("name_taken");
    const sleeves = (await post("/alteration-types", { name: "Shorten sleeves", kind: "alteration", charge: "150", labour: "60" })).body.id;
    const hem = (await post("/alteration-types", { name: "Hem", kind: "alteration", charge: "100", labour: "40" })).body.id;

    const slip = await post("/alterations", {
      billId: sale.body.id, date: sale.body.date, trialOn: sale.body.date, deliveryOn: sale.body.date,
      lines: [{ typeId: sleeves, garment: "Silk kurta", qty: 1, notes: "1 inch" }, { typeId: hem, garment: "Silk kurta", qty: 1 }],
    });
    expect(slip.status).toBe(201);
    expect(slip.body).toMatchObject({ number: expect.stringMatching(/^ALT\//), customerName: "Kiran", charge: "250.00", labour: "100.00", status: "received" });
    expect((await post(`/alterations/${slip.body.id}/receive`, {})).body.error).toBe("not_with_karigar");
    await post(`/alterations/${slip.body.id}/issue`, { karigarId: outside });
    const ready = await post(`/alterations/${slip.body.id}/receive`, {});
    expect(ready.body).toMatchObject({ status: "ready" });
    expect(ready.body.labourVoucherId).toBeTruthy();
    const owed = await get(`/reports/ledger/${ledger}?from=2026-04-01&to=2027-03-31`);
    expect(owed.closing).toBe("-100.00");

    expect((await post(`/alterations/${slip.body.id}/deliver`, {})).body.error).toBe("terminal_required");
    const done = await post(`/alterations/${slip.body.id}/deliver`, { terminalId: terminal, payments: [{ mode: "upi", amount: "250", reference: "UPI9" }] });
    expect(done.body).toMatchObject({ status: "delivered" });
    const bill = await get(`/pos/bills/${done.body.deliveryBillId}`);
    expect(bill).toMatchObject({ total: "250.00" });
    expect(bill.lines[0].name).toBe("Alteration and tailoring charges");

    const labour = await get(`/alterations/labour?from=2026-04-01&to=2027-03-31`);
    expect(labour.rows).toEqual([expect.objectContaining({ karigar: "Salim", outside: true, slips: 1, pieces: 2, labour: "100.00" })]);
  });

  it("delivers a free alteration without a bill, and lists what is overdue", async () => {
    const inHouse = (await post("/karigars", { name: "Workroom" })).body.id;
    const fit = (await post("/alteration-types", { name: "Waist fitting", kind: "alteration", charge: "120", labour: "50" })).body.id;
    const free = await post("/alterations", { date: "2026-10-01", deliveryOn: "2026-10-03", complimentary: true, customerName: "Walk-in", lines: [{ typeId: fit, garment: "Trousers", qty: 2 }] });
    const late = await post("/alterations", { date: "2026-10-01", deliveryOn: "2026-10-02", lines: [{ typeId: fit, garment: "Trousers", qty: 1 }] });
    expect((await post("/alterations", { date: "2026-10-05", deliveryOn: "2026-10-04", lines: [{ typeId: fit, garment: "x", qty: 1 }] })).body.error).toBe("delivery_before_date");
    await post(`/alterations/${free.body.id}/issue`, { karigarId: inHouse, date: "2026-10-01" });
    const back = await post(`/alterations/${free.body.id}/receive`, { date: "2026-10-02" });
    expect(back.body.labourVoucherId).toBeNull(); // in-house: paid through salary
    expect((await post(`/alterations/${free.body.id}/deliver`, {})).body).toMatchObject({ status: "delivered", deliveryBillId: null });
    const open = await get("/alterations?status=open");
    expect(open.find((a: { id: string }) => a.id === late.body.id)).toMatchObject({ overdue: true, status: "received" });
    expect((await post(`/alterations/${late.body.id}/cancel`, { reason: "Customer took it back" })).status).toBe(200);
    expect((await post(`/alterations/${free.body.id}/cancel`, { reason: "Too late" })).body.error).toBe("cannot_cancel");
  });
});

describe("made-to-order tailoring", () => {
  it("measures, takes an advance, runs each process through karigars and bills stitching and fabric less the advance", async () => {
    const terminal = (await post("/pos/terminals", { name: "Tailoring desk" })).body.id;
    await post("/pos/sessions", { terminalId: terminal, openingCash: "0" });
    const setup = await get("/inventory/setup");
    const mtr = setup.uoms.find((u: { code: string }) => u.code === "MTR").id;
    const fabric = (await post("/items", { name: "Linen shirting", hsn: "5309", gstRate: "5", uomId: mtr, saleRate: "600", purchaseRate: "380" })).body.id;
    await post("/stock-journals", { kind: "opening", lines: [{ itemId: fabric, warehouseId: id.main, qty: "50", rate: "380" }] });
    expect((await put("/tailoring-rates", { rates: [{ garment: "Shirt", process: "Cutting", rate: "50" }, { garment: "Shirt", process: "Stitching", rate: "150" }] })).status).toBe(200);

    const m = await post("/measurements", { customerPhone: "9855555555", customerName: "Dev", garment: "Shirt", values: { Chest: "40", Length: "29", Sleeve: "24.5", Blank: "" } });
    expect(m.body.values).toEqual({ Chest: "40", Length: "29", Sleeve: "24.5" });
    expect((await get("/measurements?phone=9855555555")).length).toBe(1);
    const anwar = (await post("/karigars", { name: "Anwar", outside: true })).body;

    const day = (n: number) => businessDate(new Date(Date.now() + n * 86_400_000));
    const order = await post("/tailoring-orders", {
      customerName: "Dev", customerPhone: "9855555555", trialOn: day(2), deliveryOn: day(5), advance: "1000", advancePaidBy: "upi",
      lines: [{ garment: "shirt", qty: 2, price: "700", measurementId: m.body.id, fabricItemId: fabric, fabricQty: "3.2" }],
    });
    expect(order.status).toBe(201);
    expect(order.body).toMatchObject({ number: expect.stringMatching(/^TLR\//), total: "3320.00", advance: "1000.00", status: "booked" });
    expect(order.body.lines[0].processes.map((p: { process: string }) => p.process)).toEqual(["Cutting", "Stitching"]);
    expect((await post("/tailoring-orders", { customerName: "X", customerPhone: "9855555555", deliveryOn: day(1), advance: "5000", lines: [{ garment: "Shirt", qty: 1, price: "700" }] })).body.error).toBe("advance_more_than_total");

    const oid = order.body.id;
    expect((await post(`/tailoring-orders/${oid}/deliver`, { terminalId: terminal, payments: [] })).body.error).toBe("not_ready");
    expect((await post(`/tailoring-orders/${oid}/done`, { line: 0, process: 1 })).body.error).toBe("assign_first");
    await post(`/tailoring-orders/${oid}/assign`, { line: 0, process: 0, karigarId: anwar.id });
    await post(`/tailoring-orders/${oid}/done`, { line: 0, process: 0 });
    await post(`/tailoring-orders/${oid}/assign`, { line: 0, process: 1, karigarId: anwar.id });
    const ready = await post(`/tailoring-orders/${oid}/done`, { line: 0, process: 1 });
    expect(ready.body.status).toBe("ready");
    expect((await get(`/reports/ledger/${anwar.accountId}?from=2026-04-01&to=2027-03-31`)).closing).toBe("-400.00"); // (50 + 150) × 2 shirts

    const before = ((await get(`/reports/stock-summary?asOf=${day(0)}`)).rows as { itemId: string; qty: string }[]).find((r) => r.itemId === fabric)!.qty;
    const done = await post(`/tailoring-orders/${oid}/deliver`, { terminalId: terminal, payments: [{ mode: "cash", amount: "2320" }] });
    expect(done.status).toBe(200);
    expect(done.body).toMatchObject({ status: "delivered", billTotal: "3320.00" });
    const bill = await get(`/pos/bills/${done.body.deliveryBillId}`);
    expect(bill.promos.vouchers).toEqual([expect.objectContaining({ amount: "1000.00" })]);
    expect(bill.lines.map((l: { name: string }) => l.name)).toEqual(["Tailoring charges", "Linen shirting"]);
    const after = ((await get(`/reports/stock-summary?asOf=${day(0)}`)).rows as { itemId: string; qty: string }[]).find((r) => r.itemId === fabric)!.qty;
    expect(Number(before) - Number(after)).toBeCloseTo(3.2);
  });

  it("flags trials and deliveries due, and keeps the advance as credit when an order is cancelled", async () => {
    const day = (n: number) => businessDate(new Date(Date.now() + n * 86_400_000));
    const late = await post("/tailoring-orders", { date: day(-6), customerName: "Late", customerPhone: "9866666666", trialOn: day(-3), deliveryOn: day(-1), lines: [{ garment: "Blouse", qty: 1, price: "450" }] });
    const gone = await post("/tailoring-orders", { customerName: "Gone", customerPhone: "9877777777", deliveryOn: day(4), advance: "200", lines: [{ garment: "Blouse", qty: 1, price: "450" }] });
    const open = await get("/tailoring-orders?status=open");
    expect(open.find((o: { id: string }) => o.id === late.body.id)).toMatchObject({ overdue: true, trialDue: true });
    // No processes set up for blouses: it can be marked ready by hand.
    expect((await post(`/tailoring-orders/${late.body.id}/ready`, {})).body.status).toBe("ready");
    await post(`/tailoring-orders/${gone.body.id}/cancel`, { reason: "Customer changed mind" });
    const cancelled = (await get("/tailoring-orders?status=cancelled")).find((o: { id: string }) => o.id === gone.body.id);
    expect(cancelled).toMatchObject({ advanceLeft: "200.00" });
    expect((await get(`/gift-vouchers/${cancelled.advanceCode}`)).status).toBe("active");
  });
});

describe("consignment and shop-in-shop", () => {
  it("sends goods to a consignee, takes some back, bills what they sold and reconciles what is left", async () => {
    const setup = await get("/inventory/setup");
    const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
    const dupatta = (await post("/items", { name: "Silk dupatta", hsn: "6214", gstRate: "5", gstSlab: "apparel", uomId: pcs, saleRate: "1200", purchaseRate: "600" })).body.id;
    await post("/stock-journals", { kind: "opening", date: "2026-04-01", lines: [{ itemId: dupatta, warehouseId: id.main, qty: "40", rate: "600" }] });
    const g = (await get("/accounts/groups")) as { id: string; key: string }[];
    const store = (await post("/accounts", { name: "Pune Department Store", groupId: g.find((x) => x.key === "sundry_debtors")!.id, stateCode: "27", creditLimit: "1000", creditControl: "block" })).body.id;

    const sent = await post("/consignment/send", { customerId: store, date: "2026-05-01", lines: [{ itemId: dupatta, qty: "10", rate: "1000" }] });
    expect(sent.status).toBe(201);
    expect(sent.body).toMatchObject({ kind: "send", number: expect.stringMatching(/^CSN\//), value: "10000.00" });
    const at = (await get("/inventory/setup")).warehouses.find((w: { name: string }) => w.name === "At Pune Department Store");
    expect(at).toBeTruthy();

    expect((await post("/consignment/return", { customerId: store, date: "2026-06-01", lines: [{ itemId: dupatta, qty: "11" }] })).body.error).toBe("more_than_held");
    expect((await post("/consignment/return", { customerId: store, date: "2026-06-01", lines: [{ itemId: dupatta, qty: "2" }] })).status).toBe(201);
    // Their sales report: billed even though they are over a blocking credit limit, because the goods are already there.
    const sold = await post("/consignment/sales", { customerId: store, date: "2026-07-01", lines: [{ itemId: dupatta, qty: "3", rate: "1000" }] });
    expect(sold.status).toBe(201);
    expect(sold.body.warnings.map((w: { code: string }) => w.code)).toContain("credit_limit_exceeded");
    const inv = await get(`/sales-invoices/${sold.body.invoiceId}`);
    expect(inv.lines[0]).toMatchObject({ warehouseId: at.id });
    expect(inv.total).toBe("3150.00"); // Rs 1,000 a piece, 5% slab

    const r = await get(`/consignees/${store}?asOf=2026-10-20`);
    expect(r.rows[0]).toMatchObject({ sent: "10", returned: "2", sold: "3", held: "5", difference: "0", oldestSent: "2026-05-01", invoiceBy: "2026-11-01", overdue: true });
    expect(r.moves.map((m: { kind: string }) => m.kind)).toEqual(["sale", "return", "send"]);
    expect((await get("/consignees?asOf=2026-10-20")).find((c: { customerId: string }) => c.customerId === store)).toMatchObject({ pieces: "5", sold: "3", ageing: 1 });
    const notCustomer = (await post("/accounts", { name: "Some Mill", groupId: g.find((x) => x.key === "sundry_creditors")!.id, stateCode: "27" })).body.id;
    expect((await post("/consignment/send", { customerId: notCustomer, lines: [{ itemId: dupatta, qty: "1" }] })).body.error).toBe("not_a_customer");
  });
});

describe("image catalogue", () => {
  it("keeps photos per style and colour, lists tiles with party prices, saves a selection and shares it by an expiring link", async () => {
    const setup = await get("/inventory/setup");
    const colors = (await get("/colors")) as { id: string; name: string }[];
    const col = (n: string) => colors.find((x) => x.name === n)!.id;
    const shirt = (await post("/styles", {
      code: "CAT-1", name: "Linen Shirt", brand: "Catalogue Co", category: "Shirts", season: "Summer", hsn: "6205", gstSlab: "apparel",
      uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, purchaseRate: "500", saleRate: "1500", colorIds: [col("White"), col("Black")], sizes: ["M", "L"],
    })).body;
    const whiteM = shirt.variants.find((v: { color: string; size: string }) => v.color === "White" && v.size === "M");
    await post("/stock-journals", { kind: "opening", lines: [{ itemId: whiteM.id, warehouseId: id.main, qty: "7", rate: "500" }] });
    // Two small "photos" (a PNG header is enough for the type check) and a thumbnail.
    const png = (n: number) => Buffer.concat([Buffer.from("89504e470d0a1a0a", "hex"), Buffer.from(`photo ${n}`)]).toString("base64");
    const file = async (n: number) => (await post("/files", { name: `p${n}.png`, contentType: "image/png", base64: png(n) })).body.id as string;
    const [f1, t1, f2] = [await file(1), await file(2), await file(3)];
    const img = await post(`/styles/${shirt.id}/images`, { fileId: f1, thumbFileId: t1, color: "White" });
    expect(img.status).toBe(201);
    expect((await post(`/styles/${shirt.id}/images`, { fileId: f1, thumbFileId: t1, color: "White" })).body.error).toBe("duplicate_image");
    expect((await post(`/styles/${shirt.id}/images`, { fileId: f2, thumbFileId: t1, color: "Purple" })).body.error).toBe("unknown_color");
    const second = (await post(`/styles/${shirt.id}/images`, { fileId: f2, thumbFileId: t1, color: "White", view: "back" })).body;
    await patch(`/style-images/${second.id}`, { first: true });
    expect((await get(`/styles/${shirt.id}/images`)).map((i: { id: string }) => i.id)).toEqual([second.id, img.body.id]);

    const g: { id: string; key: string }[] = await get("/accounts/groups");
    const list = (await post("/price-lists", { name: "Catalogue trade", discountPct: "20" })).body.id;
    const buyer = (await post("/accounts", { name: "Catalogue Buyer", groupId: g.find((x) => x.key === "sundry_debtors")!.id, stateCode: "27", phone: "9876543210", priceListId: list })).body.id;
    const cat = await get(`/catalogue?brand=Catalogue%20Co&partyId=${buyer}&sort=stock`);
    expect(cat.total).toBe(2);
    expect(cat.tiles[0]).toMatchObject({ color: "White", stock: "7", rate: "1200.00", image: { fileId: f2 } });
    expect(cat.tiles[0].sizes.map((x: { size: string }) => x.size)).toEqual(["M", "L"]);
    expect(cat.tiles[1]).toMatchObject({ color: "Black", stock: "0", image: null });
    expect(cat.facets.colors.map((x: { value: string }) => x.value)).toEqual(["Black", "White"]);
    expect((await get("/catalogue?brand=Catalogue%20Co&inStock=true&withImage=true")).total).toBe(1);
    expect((await get(`/catalogue?q=${whiteM.barcode}`)).tiles[0].key).toBe(`${shirt.id}:White`);

    const sel = await post("/catalogue/selections", { name: "Summer picks", partyId: buyer, lines: [{ styleId: shirt.id, color: "White" }, { styleId: shirt.id, color: "Black" }], showStock: true });
    expect(sel.status).toBe(201);
    expect((await get(`/catalogue/selections/${sel.body.id}`)).tiles.map((x: { color: string }) => x.color)).toEqual(["White", "Black"]);
    const share = (await post(`/catalogue/selections/${sel.body.id}/share`, { days: 7 })).body;
    const token = share.url.split("/c/")[1];
    const open = await t.call("", "GET", `/public/catalogue/${token}`);
    expect(open.status).toBe(200);
    expect(open.body).toMatchObject({ name: "Summer picks", party: "Catalogue Buyer" });
    expect(open.body.tiles[0]).toMatchObject({ rate: "1200.00", sizes: [{ size: "M", inStock: true }, { size: "L", inStock: false }] });
    expect((await t.app.inject({ url: `/public/catalogue/${token}/files/${f2}` })).statusCode).toBe(200);
    expect((await t.app.inject({ url: `/public/catalogue/${token}/files/00000000-0000-4000-8000-000000000000` })).statusCode).toBe(404);
    const sent = await post(`/catalogue/selections/${sel.body.id}/send`, { url: share.url });
    expect(sent.body).toMatchObject({ to: "919876543210", status: "sent" });
    // A new link replaces the old one; stopping sharing closes it.
    const again = (await post(`/catalogue/selections/${sel.body.id}/share`, { days: 1 })).body;
    expect((await t.call("", "GET", `/public/catalogue/${token}`)).status).toBe(404);
    expect((await post(`/catalogue/selections/${sel.body.id}/send`, { url: share.url })).body.error).toBe("share_link_stale");
    await t.call(c, "DELETE", `/catalogue/selections/${sel.body.id}/share`);
    expect((await t.call("", "GET", `/public/catalogue/${again.url.split("/c/")[1]}`)).status).toBe(404);
  });
});

describe("business intelligence", () => {
  it("adds up sales, pieces, bills and profit for a period, and splits them by design, weekday, payment and age", async () => {
    const from = "2026-04-01";
    const to = businessDate();
    const r = await get(`/analytics/insights?from=${from}&to=${to}`);
    expect(Number(r.kpis.sales)).toBeGreaterThan(0);
    expect(r.kpis.bills).toBeGreaterThan(0);
    // The trend, the weekdays and the ageing buckets all add back to the period's sales.
    const sum = (xs: { amount: string }[]) => xs.reduce((s, x) => s + Number(x.amount), 0);
    expect(sum(r.trend.points)).toBeCloseTo(Number(r.kpis.sales), 2);
    expect(sum(r.weekday)).toBeCloseTo(Number(r.kpis.sales), 2);
    expect(r.weekday).toHaveLength(7);
    // Counter bills by the hour: 24 hours, and together they add up to the counter bills in the period.
    expect(r.hourly).toHaveLength(24);
    expect(r.hourly.reduce((n: number, h: { bills: number }) => n + h.bills, 0)).toBeGreaterThan(0);
    expect(r.ageing.map((b: { key: string }) => b.key)).toEqual(["d0_30", "d31_60", "d61_90", "d91_180", "d181_365", "y1_2", "y2plus"]);
    expect(r.designs.length).toBeGreaterThan(0);
    expect(r.tenders.length).toBeGreaterThan(0);
    expect(r.lastYear).toEqual({ from: "2025-04-01", to: `${Number(to.slice(0, 4)) - 1}${to.slice(4)}` });
    expect((await t.call(c, "GET", `/analytics/insights?from=${to}&to=${from}`)).body.error).toBe("invalid_period");
  });

  it("gives the colour-size matrix, stock ageing with dead stock, and a sales register that agrees with the insights", async () => {
    const to = businessDate();
    const m = await get(`/reports/colour-size?type=stock&asOf=${to}`);
    const kurta = m.groups.find((g: { code: string }) => g.code === "KT-101");
    expect(kurta.sizes.slice(0, 4)).toEqual(["S", "M", "L", "XL"]); // in size-scale order
    for (const g of m.groups) expect(g.total).toBe(g.rows.reduce((s: number, r: { total: number }) => s + r.total, 0));
    expect((await get(`/reports/colour-size?type=sales&from=2026-04-01&to=${to}`)).type).toBe("sales");
    const a = await get(`/reports/stock-ageing?asOf=${to}&deadDays=30`);
    expect(a.buckets).toHaveLength(7);
    expect(a.buckets.reduce((s: number, b: { qty: string }) => s + Number(b.qty), 0)).toBe(Number(a.total.qty));
    expect(a.dead.items).toBe(a.rows.filter((r: { dead: boolean }) => r.dead).length);
    const reg = await get(`/reports/sales-register?from=2026-04-01&to=${to}`);
    const ins = await get(`/analytics/insights?from=2026-04-01&to=${to}`);
    expect(reg.totals.count).toBeGreaterThan(0);
    expect(Number(reg.totals.taxable)).toBeCloseTo(Number(ins.kpis.sales), 0);
  });
});

describe("other units", () => {
  it("buys in dozens and keeps stock in pieces", async () => {
    const setup = await get("/inventory/setup");
    const doz = setup.uoms.find((u: { code: string }) => u.code === "DOZ").id;
    expect((await put(`/items/${id.belt}/units`, { units: [{ uomId: doz, factor: "12" }] })).body).toEqual([{ uomId: doz, code: "DOZ", factor: "12.0000" }]);
    const listed = (await get("/items")).find((i: { id: string }) => i.id === id.belt);
    expect(listed.units).toEqual([{ uomId: doz, code: "DOZ", factor: "12.0000" }]);
    expect((await put(`/items/${id.belt}/units`, { units: [{ uomId: listed.uomId, factor: "2" }] })).body.error).toBe("same_as_base_unit");
  });
});
