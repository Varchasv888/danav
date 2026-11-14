import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const today = businessDate();
const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const cancelWith = async (invoiceId: string, passcode?: string) => {
  const res = await t.app.inject({ method: "POST", url: `/sales-invoices/${invoiceId}/cancel`, headers: { cookie: c, ...(passcode ? { "x-passcode": passcode } : {}) }, payload: { reason: "Entered by mistake" } } as never);
  return { status: res.statusCode, body: res.json() as { error?: string } };
};

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("passcode", { gstin: "27AAPFU0939F1ZV" })).cookie as string;
  const groups = (await get("/accounts/groups")) as { id: string; key: string }[];
  id.shop = (await post("/accounts", { name: "Code Shop", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" })).body.id;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  id.shirt = (await post("/items", { name: "Code Shirt", hsn: "6205", gstRate: "5", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, saleRate: "500" })).body.id;
  await post("/stock-journals", { kind: "opening", lines: [{ itemId: id.shirt, warehouseId: id.main, qty: "50", rate: "300" }] });
});
afterAll(() => t.close());

const invoice = async () => (await post("/sales-invoices", { customerId: id.shop, date: today, lines: [{ itemId: id.shirt, qty: "1", rate: "500" }] })).body.id as string;

describe("passcode to cancel documents", () => {
  it("cannot be turned on before a passcode is set, and a passcode must be four to eight digits", async () => {
    expect((await t.call(c, "PUT", "/settings/preferences", { "security.passcodeOnCancel": true })).body.error).toBe("set_passcode_first");
    expect((await post("/auth/step-up", { password: "correct horse battery" })).status).toBe(200);
    expect((await t.call(c, "PUT", "/settings/passcode", { passcode: "12" })).status).toBe(400);
    expect((await t.call(c, "PUT", "/settings/passcode", { passcode: "4821" })).status).toBe(200);
    expect((await get("/settings/passcode")).set).toBe(true);
  });

  it("lets a cancel through when the setting is off", async () => {
    expect((await cancelWith(await invoice())).status).toBe(200);
  });

  it("asks for the passcode once the setting is on, refuses a wrong one, and accepts the right one", async () => {
    expect((await t.call(c, "PUT", "/settings/preferences", { "security.passcodeOnCancel": true })).status).toBe(200);
    const inv = await invoice();
    expect((await cancelWith(inv)).body.error).toBe("passcode_required");
    expect((await cancelWith(inv, "0000")).body.error).toBe("passcode_wrong");
    expect((await cancelWith(inv, "4821")).status).toBe(200);
  });

  it("locks after five wrong tries", async () => {
    const inv = await invoice();
    for (let i = 0; i < 5; i++) await cancelWith(inv, "1111");
    expect((await cancelWith(inv, "4821")).body.error).toBe("passcode_locked");
  });

  it("needs the current passcode to change it", async () => {
    await post("/auth/step-up", { password: "correct horse battery" });
    expect((await t.call(c, "PUT", "/settings/passcode", { passcode: "9999" })).body.error).toBe("passcode_wrong");
    expect((await t.call(c, "PUT", "/settings/passcode", { passcode: "9999", current: "4821" })).status).toBe(200);
  });
});
