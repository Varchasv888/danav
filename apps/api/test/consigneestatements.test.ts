import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { runDueConsigneeStatements } from "../src/services/consignment.js";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const put = (url: string, body: unknown) => t.call(c, "PUT", url, body);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("conststmt", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.red = (await post("/colors", { name: "Red" })).body.id;
  const style = async (code: string, brand: string, mrp: string) => {
    const s = (await post("/styles", { code, name: `Style ${code}`, uomId: pcs, colorIds: [id.red], sizes: ["M"], saleRate: mrp, mrp, brand, gstRate: "5" })).body;
    return ((await get(`/styles/${s.id}`)).variants as { id: string }[])[0]!.id;
  };
  id.a = await style("CS-A", "Varsha", "1000");
  id.b = await style("CS-B", "Other", "2000");
  await post("/stock-journals", { kind: "opening", lines: [id.a, id.b].map((itemId) => ({ itemId, warehouseId: id.main, qty: "50", rate: "400" })) });
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.mall = (await post("/accounts", { name: "Mall Counter", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  id.hub = (await post("/accounts", { name: "Hub Counter", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  for (const store of [id.mall, id.hub]) await post("/consignment/send", { customerId: store, date: "2026-09-01", lines: [{ itemId: id.a, qty: "10", rate: "900" }, { itemId: id.b, qty: "5", rate: "1800" }] });
  await post("/consignment/sales", { customerId: id.mall, date: "2026-09-10", lines: [{ itemId: id.a, qty: "4", rate: "900" }, { itemId: id.b, qty: "1", rate: "1400" }] });
  await post("/consignment/sales", { customerId: id.hub, date: "2026-10-05", lines: [{ itemId: id.a, qty: "2", rate: "1000" }] });
  await post("/consignment/return", { customerId: id.hub, date: "2026-10-06", lines: [{ itemId: id.b, qty: "1", rate: "1800" }] });
});
afterAll(() => t.close());

const report = async (by: string) => get(`/reports/consignment-sales?from=2026-09-01&to=2026-10-31&by=${by}`);

describe("shop-in-shop sales reports", () => {
  it("groups by month, consignee, brand and item", async () => {
    const m = await report("month");
    expect(m.rows.map((r: { name: string; pieces: string }) => [r.name, r.pieces])).toEqual([["2026-09", "5"], ["2026-10", "2"]]);
    expect(m.totals).toMatchObject({ pieces: "7", value: "7000.00", returned: "1" }); // 4x900 + 1x1400 + 2x1000
    expect((await report("consignee")).rows.map((r: { name: string }) => r.name)).toEqual(["Hub Counter", "Mall Counter"]);
    expect((await report("brand")).rows.find((r: { name: string }) => r.name === "Varsha")).toMatchObject({ pieces: "6", value: "5600.00" });
    expect((await report("item")).rows).toHaveLength(2);
  });

  it("groups by how far below MRP the billed rate was", async () => {
    const d = await report("discount");
    const by = Object.fromEntries(d.rows.map((r: { name: string; pieces: string }) => [r.name, r.pieces]));
    expect(by).toMatchObject({ "10 to 20%": "4", "No discount": "2", "30% and over": "1" }); // 900 on 1000 is 10% off, 1000 on 1000 none, 1400 on 2000 is 30% off
  });

  it("refuses a reversed period", async () => {
    expect((await t.call(c, "GET", "/reports/consignment-sales?from=2026-10-31&to=2026-09-01&by=date")).status).toBe(400);
  });
});

describe("scheduled statements to the consignee", () => {
  it("needs an email address, then emails the statement when it is due and not again until the next turn", async () => {
    expect((await put(`/consignees/${id.mall}/terms`, { settlementDays: 30, statementFrequency: "weekly" })).body.error).toBe("statement_needs_email");
    expect((await put(`/consignees/${id.mall}/terms`, { settlementDays: 30, statementFrequency: "weekly", statementEmail: "Mall@Example.test" })).status).toBe(200);
    const first = await runDueConsigneeStatements(t.appDb.db, t.mailer, new Date("2026-11-03T05:00:00Z"));
    expect(first).toBeGreaterThanOrEqual(1);
    const mail = t.mailer.sent.find((m) => m.to === "mall@example.test");
    expect(mail?.subject).toContain("Stock and sales statement");
    expect(mail?.text).toContain("Mall Counter");
    expect(mail?.text).toMatch(/sold 4/);
    const before = t.mailer.sent.length;
    await runDueConsigneeStatements(t.appDb.db, t.mailer, new Date("2026-11-05T05:00:00Z")); // two days later: not due
    expect(t.mailer.sent.filter((m) => m.to === "mall@example.test")).toHaveLength(before ? 1 : 0);
    await runDueConsigneeStatements(t.appDb.db, t.mailer, new Date("2026-11-11T05:00:00Z")); // a week on
    expect(t.mailer.sent.filter((m) => m.to === "mall@example.test")).toHaveLength(2);
  });
});
