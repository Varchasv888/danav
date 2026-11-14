import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("gstr9", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.mill = (await post("/accounts", { name: "Bengaluru Mills", groupId: groups.find((g) => g.key === "sundry_creditors")!.id, gstin: "29AAGCB7383J1Z4", stateCode: "29" })).body.id;
  id.shop = (await post("/accounts", { name: "Pune Shop", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  const setup = await get("/inventory/setup");
  id.cloth = (await post("/items", { name: "Poplin", hsn: "5208", gstRate: "5", uomId: setup.uoms[0].id, saleRate: "300" })).body.id;
});
afterAll(() => t.close());

describe("GSTR-9 working", () => {
  it("adds the year's returns up and takes Table 8A from the statement or the books as asked", async () => {
    expect((await post("/purchase-bills", { supplierId: id.mill, date: "2026-10-05", supplierInvoiceNo: "A/1", supplierInvoiceDate: "2026-10-05", lines: [{ itemId: id.cloth, qty: "10", rate: "1000" }] })).status).toBe(201); // 500 IGST
    expect((await post("/purchase-bills", { supplierId: id.mill, date: "2026-11-05", supplierInvoiceNo: "A/2", supplierInvoiceDate: "2026-11-05", lines: [{ itemId: id.cloth, qty: "10", rate: "2000" }] })).status).toBe(201); // 1000 IGST
    expect((await post("/gst/work/2b", { json: { data: { gstin: "27AAPFU0939F1ZV", rtnprd: "102026", docdata: { b2b: [{ ctin: "29AAGCB7383J1Z4", inv: [{ inum: "A/1", dt: "05-10-2026", txval: 10000, igst: 500, itcavl: "Y" }] }] } } } })).status).toBe(201);
    const inv = await post("/sales-invoices", { customerId: id.shop, date: "2026-10-10", lines: [{ itemId: id.cloth, qty: "10", rate: "500" }] });
    expect(inv.status, JSON.stringify(inv.body)).toBe(201);

    const two = await get("/gst/work/gstr9?fy=2026&basis=2b");
    expect(two.fy).toBe("2026-27");
    expect(two.dueOn).toBe("2027-12-31");
    expect(two.months).toHaveLength(12);
    expect(two.tables.table4.taxable).toBe("5000.00");
    expect(two.tables.table8.basis).toBe("2b");
    expect(two.tables.table8.a.igst).toBe("500.00"); // only A/1 is in the imported statement
    expect(two.tables.table8.perBooks.igst).toBe("1500.00");
    expect(two.tables.table8.gapBetweenBases.igst).toBe("-1000.00");
    expect(two.tables.table8.monthsWithout2b).toHaveLength(11);
    expect(two.needsAccountant).toContain("table8ABasis");

    const books = await get("/gst/work/gstr9?fy=2026&basis=books");
    expect(books.tables.table8.a.igst).toBe("1500.00");
    expect(books.tables.table8.d.igst).toBe("0.00"); // credit availed is the books figure
  });

  it("refuses a year out of range or a basis it does not know", async () => {
    expect((await t.call(c, "GET", "/gst/work/gstr9?fy=1999")).status).toBe(400);
    expect((await t.call(c, "GET", "/gst/work/gstr9?fy=2026&basis=guess")).status).toBe(400);
  });
});
