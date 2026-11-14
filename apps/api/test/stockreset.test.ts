import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown = {}) => t.call(c, "POST", url, body);
const qty = async (itemId: string, warehouseId: string) => Number(((await get(`/reports/stock-summary?asOf=${today}&warehouseId=${warehouseId}`)).rows as { itemId: string; qty: string }[]).find((r) => r.itemId === itemId)?.qty ?? 0);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("stockreset", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.other = (await post("/warehouses", { name: "Other store" })).body.id;
  const pcs = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  id.red = (await post("/colors", { name: "Red" })).body.id;
  const style = async (code: string, brand: string) => {
    const s = (await post("/styles", { code, name: `Style ${code}`, uomId: pcs, colorIds: [id.red], sizes: ["M"], saleRate: "500", brand })).body;
    return ((await get(`/styles/${s.id}`)).variants as { id: string }[])[0]!.id;
  };
  id.a = await style("SR-A", "Varsha");
  id.b = await style("SR-B", "Other");
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.a, warehouseId: id.main, qty: "10", rate: "300" }, { itemId: id.b, warehouseId: id.main, qty: "7", rate: "300" }, { itemId: id.a, warehouseId: id.other, qty: "4", rate: "300" }] });
  id.term = (await post("/pos/terminals", { name: "Counter" })).body.id;
  await post("/pos/sessions", { terminalId: id.term, openingCash: "0" });
  await post("/pos/bills", { terminalId: id.term, lines: [{ itemId: id.a, qty: "2" }], payments: [{ mode: "cash", amount: "1000" }] });
});
afterAll(() => t.close());

describe("reset physical stock", () => {
  it("needs the password again, a reason and a scope", async () => {
    const body = { warehouseId: id.main, reason: "Counting from scratch", scope: { brand: "Varsha" } };
    expect((await post("/inventory/reset-stock", body)).status).toBe(403);
    expect((await post("/auth/step-up", { password: "correct horse battery" })).status).toBe(200);
    expect((await post("/inventory/reset-stock", { ...body, scope: {} })).body.error).toBe("scope_required");
    expect((await post("/inventory/reset-stock", { ...body, reason: "no" })).status).toBe(400);
  });

  it("brings the chosen goods in one store to zero and leaves everything else", async () => {
    const r = await post("/inventory/reset-stock", { warehouseId: id.main, reason: "Counting from scratch", scope: { brand: "Varsha" } });
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ items: 1, pieces: "8" }); // 10 less the 2 sold
    expect(await qty(id.a, id.main)).toBe(0);
    expect(await qty(id.b, id.main)).toBe(7);   // another brand
    expect(await qty(id.a, id.other)).toBe(4);  // another store
    expect((await post("/inventory/reset-stock", { warehouseId: id.main, reason: "Again", scope: { brand: "Varsha" } })).body).toMatchObject({ items: 0, journalId: null });
  });
});

describe("stock posting check", () => {
  it("lists documents whose stock movement does not match their lines, and finds none on a clean book", async () => {
    const r = await get("/reports/stock-posting-check");
    expect(r.checked).toBeGreaterThan(0);
    expect(r.differing).toBe(0);
  });
});
