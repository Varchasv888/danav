import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const put = (url: string, body: unknown) => t.call(c, "PUT", url, body);
const tb = async (accountId: string, asOf = "2027-03-31") => ((await get(`/reports/trial-balance?asOf=${asOf}`)).rows as { accountId: string; dr: string; cr: string }[]).find((r) => r.accountId === accountId) ?? { dr: "0.00", cr: "0.00" };
const keys = async () => { for (const a of await get("/accounts") as { id: string; key: string | null }[]) if (a.key) id[a.key] = a.id; };

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("assets", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  const group = (k: string) => groups.find((g) => g.key === k)!.id;
  id.bank = (await post("/accounts", { name: "HDFC Current", groupId: group("bank_accounts"), openingBalance: "2000000" })).body.id;
  id.croma = (await post("/accounts", { name: "Croma Retail", groupId: group("sundry_creditors"), stateCode: "27", gstin: "27AAPFU0939F1ZV" })).body.id;
});
afterAll(() => t.close());

describe("classes and register", () => {
  it("creates classes from the Schedule II presets or by hand, each with its own ledgers", async () => {
    const computers = await post("/assets/classes", { preset: "computers" });
    expect(computers.body).toMatchObject({ name: "Computers & laptops", lifeYears: "3.00", residualPct: "5.00", itBlock: "computers", itRate: "40.00", method: "slm" });
    id.computers = computers.body.id;
    id.vehicles = (await post("/assets/classes", { name: "Cars", method: "wdv", lifeYears: "8", residualPct: "5", itBlock: "plant_machinery", itRate: "15" })).body.id;
    expect((await post("/assets/classes", { preset: "computers" })).body.error).toBe("class_exists");
    const names = (await get("/accounts") as { name: string }[]).map((a) => a.name);
    expect(names).toEqual(expect.arrayContaining(["Computers & laptops", "Accumulated Depreciation - Computers & laptops", "Cars", "Accumulated Depreciation - Cars"]));
  });

  it("buys a laptop on credit (input GST claimed, not capitalised) and registers a car brought forward", async () => {
    const laptop = await post("/assets", {
      classId: id.computers, name: "Dell Latitude 5450", purchaseDate: "2026-10-01", cost: "60000", acquisition: "supplier", accountId: id.croma, gstRate: "18", invoiceRef: "CR/8812",
    });
    expect(laptop.body).toMatchObject({ code: "FA-00001", putToUseOn: "2026-10-01", cost: "60000.00" });
    id.laptop = laptop.body.id;
    await keys();
    expect((await tb(id.input_cgst!)).dr).toBe("5400.00");
    expect((await tb(id.croma!)).cr).toBe("70800.00");
    id.car = (await post("/assets", {
      classId: id.vehicles, name: "Honda City", purchaseDate: "2025-04-01", cost: "800000", acquisition: "opening", openingAccumulated: "249875.18", location: "Pune",
    })).body.id;
    expect((await post("/assets", { classId: id.vehicles, name: "Bike", purchaseDate: "2026-10-01", cost: "90000", acquisition: "paid" })).body.error).toBe("account_required");
    const list = await get("/assets");
    expect(list.map((a: { code: string; bookValue: string }) => `${a.code}:${a.bookValue}`)).toEqual(["FA-00001:60000.00", "FA-00002:550124.82"]);
  });
});

describe("depreciation", () => {
  it("charges the first half-year: the car on its written down value, the laptop not yet in use", async () => {
    const p = await get("/assets/depreciation/preview?from=2026-04-01&to=2026-09-30");
    // 5,50,124.82 × 31.2344% × 183 / 365
    expect(p).toMatchObject({ total: "86149.47", lines: [expect.objectContaining({ code: "FA-00002", amount: "86149.47", days: 183 })] });
    const run = await post("/assets/depreciation", { from: "2026-04-01", to: "2026-09-30" });
    expect(run.body).toMatchObject({ number: "DEP/26-27/00001", total: "86149.47" });
    id.run1 = run.body.id;
    expect((await post("/assets/depreciation", { from: "2026-04-01", to: "2026-09-30" })).body.error).toBe("nothing_to_depreciate");
    expect((await get("/assets/depreciation/preview?from=2026-10-01&to=2027-04-30")).error).toBe("period_crosses_year");
    expect((await tb(id.depreciation!)).dr).toBe("86149.47");
  });

  it("sells the car: depreciation to the sale date first, then profit on sale", async () => {
    const r = await post(`/assets/${id.car}/dispose`, { date: "2026-12-31", saleValue: "450000", accountId: id.bank });
    // Oct–Dec 92 days: 43,310.12; accumulated 2,49,875.18 + 86,149.47 + 43,310.12
    expect(r.body).toMatchObject({ number: "FAD/26-27/00001", accumulated: "379334.77", bookValue: "420665.23", profit: "29334.77" });
    await keys();
    expect((await tb(id.profit_on_sale_of_assets!)).cr).toBe("29334.77");
    const car = await get(`/assets/${id.car}`);
    expect(car).toMatchObject({ status: "disposed", saleValue: "450000.00", bookValue: "0.00", history: [expect.objectContaining({ amount: "86149.47" }), expect.objectContaining({ amount: "43310.12", days: 92 })] });
    expect((await post(`/assets/${id.car}/dispose`, { date: "2027-01-31", saleValue: "1" , accountId: id.bank })).body.error).toBe("already_disposed");
  });

  it("charges the laptop for the second half-year and keeps runs in order", async () => {
    const run = await post("/assets/depreciation", { from: "2026-10-01", to: "2027-03-31" });
    expect(run.body).toMatchObject({ total: "9473.97" }); // 57,000 ÷ 3 × 182 / 365; the sold car is left out
    expect((await post(`/assets/depreciation/runs/${id.run1}/cancel`, { reason: "Wrong period" })).body.error).toBe("later_run_exists"); // the sale charged the car after it
    await post(`/assets/depreciation/runs/${run.body.id}/cancel`, { reason: "Redo at year end" });
    expect((await get("/assets")).find((a: { code: string }) => a.code === "FA-00001").bookValue).toBe("60000.00");
    await post("/assets/depreciation", { from: "2026-10-01", to: "2027-03-31" });
  });
});

describe("income tax", () => {
  it("works out block depreciation: a laptop used 182 days gets the full 40%, the car's block ceases", async () => {
    await put("/assets/income-tax/openings", { fy: "2026-27", block: "plant_machinery", rate: "15", openingWdv: "600000" });
    const s = await get("/assets/income-tax?fy=2026-27");
    expect(s.rows).toEqual([
      expect.objectContaining({ block: "computers", openingWdv: "0.00", additionsFullRate: "60000.00", depreciation: "24000.00", closingWdv: "36000.00" }),
      expect.objectContaining({ block: "plant_machinery", openingWdv: "600000.00", sales: "450000.00", depreciation: "0.00", shortTermLoss: "150000.00" }),
    ]);
    const next = await get("/assets/income-tax?fy=2027-28");
    expect(next.rows).toEqual([expect.objectContaining({ block: "computers", openingWdv: "36000.00", depreciation: "14400.00" })]);
  });
});
