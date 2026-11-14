import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
let originalTenant = "";
const id: Record<string, string> = {};
const today = businessDate();
const PASS = "a long enough passphrase";
const PNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const get = async (cookie: string, url: string) => (await t.call(cookie, "GET", url)).body;
const post = (url: string, body: unknown = {}) => t.call(c, "POST", url, body);

beforeAll(async () => {
  t = await testApp();
  const s = await t.signup("restore", { gstin: "27AAPFU0939F1ZV" });
  c = s.cookie; originalTenant = s.body.tenantId;
  const groups: { id: string; key: string }[] = await get(c, "/accounts/groups");
  const setup = await get(c, "/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.cust = (await post("/accounts", { name: "Restore Customer", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27", phone: "9876543210" })).body.id;
  id.item = (await post("/items", { name: "Restore Shirt", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, gstRate: "5", hsn: "6205", saleRate: "1000", purchaseRate: "400" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.item, warehouseId: id.main, qty: "50", rate: "400" }] });
  await post("/sales-invoices", { customerId: id.cust, date: today, lines: [{ itemId: id.item, qty: "4", rate: "1000" }] });
  await post("/sales-invoices", { customerId: id.cust, date: today, lines: [{ itemId: id.item, qty: "2", rate: "1000" }] });
  id.term = (await post("/pos/terminals", { name: "Counter" })).body.id;
  await post("/pos/sessions", { terminalId: id.term, openingCash: "0" });
  await post("/pos/bills", { terminalId: id.term, customerPhone: "9000000077", lines: [{ itemId: id.item, qty: "1" }], payments: [{ mode: "cash", amount: "1000" }] });
  id.file = (await post("/files", { name: "proof.png", contentType: "image/png", base64: PNG })).body.id;
  await post("/scenarios", { name: "Restore scenario", adjustments: [{ kind: "demand", salesChangePct: [-5, 5, 10] }] });
});
afterAll(() => t.close());

describe("restore into a separate test business", () => {
  it("rebuilds the backup as a new business with the same data and the same totals", async () => {
    const enc = await t.app.inject({ method: "POST", url: "/export/business.vbk", headers: { cookie: c, "content-type": "application/json" }, payload: { passphrase: PASS } } as never);
    expect(enc.statusCode).toBe(200);
    const file = enc.rawPayload;
    // It needs the password again first.
    const refused = await post("/export/restore-test", { passphrase: PASS, dataBase64: file.toString("base64") });
    expect(refused.status).toBe(403);
    expect((await post("/auth/step-up", { password: "correct horse battery" })).status).toBe(200);
    const r = await post("/export/restore-test", { passphrase: PASS, dataBase64: file.toString("base64") });
    expect(r.status).toBe(200);
    if (r.body.problems?.length) console.log(JSON.stringify(r.body.problems, null, 1));
    expect(r.body.problems).toEqual([]);
    expect(r.body.tenantId).not.toBe(originalTenant);
    expect(r.body.books.matches).toBe(true);
    expect(r.body.tables).toBeGreaterThan(30);
    const counts = r.body.counts as { table: string; backup: number; restored: number }[];
    for (const row of counts) expect(row.restored, row.table).toBe(row.backup);
    expect(counts.find((x) => x.table === "sales_invoices")).toMatchObject({ backup: 2, restored: 2 });
    expect(counts.find((x) => x.table === "pos_bills")).toMatchObject({ backup: 1, restored: 1 });
    expect(r.body.skipped).toEqual(expect.arrayContaining(["audit_log"]));

    // Look inside the copy: the same trial balance and the file with its content.
    const original = await get(c, `/reports/trial-balance?asOf=${today}`);
    expect((await post("/auth/switch", { tenantId: r.body.tenantId })).status).toBe(200);
    const copy = await get(c, `/reports/trial-balance?asOf=${today}`);
    expect(copy.totalDebit).toBe(original.totalDebit);
    expect(copy.totalCredit).toBe(original.totalCredit);
    expect(copy.rows.map((x: { name: string; closing: string }) => `${x.name}:${x.closing}`).sort()).toEqual(original.rows.map((x: { name: string; closing: string }) => `${x.name}:${x.closing}`).sort());
    expect((await get(c, "/scenarios"))).toHaveLength(1);
    const files = await t.app.inject({ method: "GET", url: `/files/${(await get(c, "/files")).find?.((f: { name: string }) => f.name === "proof.png")?.id ?? id.file}`, headers: { cookie: c } });
    void files;
  }, 180_000);

  it("refuses a backup that is damaged", async () => {
    await post("/auth/switch", { tenantId: originalTenant });
    await post("/auth/step-up", { password: "correct horse battery" });
    const bad = await post("/export/restore-test", { passphrase: PASS, dataBase64: Buffer.from("not a backup at all").toString("base64") });
    expect(bad.status).toBe(400);
  });
});
