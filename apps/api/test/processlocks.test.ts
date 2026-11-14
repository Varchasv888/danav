import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const put = (url: string, body: unknown) => t.call(c, "PUT", url, body);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("proclock", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.cust = (await post("/accounts", { name: "Lock Customer", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  id.sup = (await post("/accounts", { name: "Lock Supplier", groupId: groups.find((g) => g.key === "sundry_creditors")!.id, stateCode: "27" })).body.id;
  id.item = (await post("/items", { name: "Lock Shirt", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, gstRate: "5", saleRate: "1000", purchaseRate: "400" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.item, warehouseId: id.main, qty: "50", rate: "400" }] });
  // Make a document of each kind so its series exists.
  await post("/sales-invoices", { customerId: id.cust, date: today, lines: [{ itemId: id.item, qty: "1", rate: "1000" }] });
});
afterAll(() => t.close());

describe("data lock by process", () => {
  it("lists the kinds of document made so far, none locked", async () => {
    const list = await get("/settings/process-locks");
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((l: { lockedUpTo: string | null }) => l.lockedUpTo === null)).toBe(true);
    expect(list.map((l: { docType: string }) => l.docType)).toContain("sales_invoice");
  });

  it("locks one kind of document up to a date and leaves the others alone", async () => {
    const date = `${today.slice(0, 7)}-01`;
    const locked = await put("/settings/process-locks", { docType: "sales_invoice", lockedUpTo: today });
    expect(locked.status).toBe(200);
    expect((await post("/sales-invoices", { customerId: id.cust, date, lines: [{ itemId: id.item, qty: "1", rate: "1000" }] })).body.error).toBe("process_locked");
    expect((await post("/sales-invoices", { customerId: id.cust, date: today, lines: [{ itemId: id.item, qty: "1", rate: "1000" }] })).body.error).toBe("process_locked");
    // Purchase bills are a different process: still open.
    expect((await post("/purchase-bills", { supplierId: id.sup, date: today, supplierInvoiceNo: "PL/1", supplierInvoiceDate: today, lines: [{ itemId: id.item, qty: "2", rate: "400" }] })).status).toBe(201);
    expect(((await get("/settings/process-locks")) as { docType: string; lockedUpTo: string | null }[]).find((l) => l.docType === "sales_invoice")!.lockedUpTo).toBe(today);
  });

  it("opens the process again", async () => {
    expect((await put("/settings/process-locks", { docType: "sales_invoice", lockedUpTo: null })).status).toBe(200);
    expect((await post("/sales-invoices", { customerId: id.cust, date: today, lines: [{ itemId: id.item, qty: "1", rate: "1000" }] })).status).toBe(201);
  });
});
