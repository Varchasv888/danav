import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("openimport")).cookie as string;
  const groups = (await get("/accounts/groups")) as { id: string; key: string }[];
  await post("/accounts", { name: "Open Shop", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" });
  await post("/accounts", { name: "Open Mill", groupId: groups.find((g) => g.key === "sundry_creditors")!.id, stateCode: "27" });
});
afterAll(() => t.close());

describe("opening balances import", () => {
  const rows = [{ name: "Open Shop", debit: "12,500" }, { name: "Open Mill", credit: "8000" }, { name: "Cash", debit: "4500" }];

  it("shows each row and the control totals on a dry run, and writes nothing", async () => {
    const r = await post("/import/opening-balances", { rows, dryRun: true });
    expect(r.status, JSON.stringify(r.body)).toBe(200);
    expect(r.body.results.map((x: { status: string }) => x.status)).toEqual(["update", "update", "update"]);
    expect(r.body.totals).toEqual({ debit: "17000.00", credit: "8000.00", difference: "9000.00" });
    const shop = ((await get("/accounts")) as { name: string; openingBalance: string }[]).find((a) => a.name === "Open Shop");
    expect(Number(shop?.openingBalance ?? 0)).toBe(0);
  });

  it("sets debits as positive and credits as negative when committed", async () => {
    const r = await post("/import/opening-balances", { rows, dryRun: false });
    expect(r.status, JSON.stringify(r.body)).toBe(200);
    const list = (await get("/accounts")) as { name: string; openingBalance: string }[];
    expect(Number(list.find((a) => a.name === "Open Shop")!.openingBalance)).toBe(12500);
    expect(Number(list.find((a) => a.name === "Open Mill")!.openingBalance)).toBe(-8000);
  });

  it("flags an unknown ledger, a row with both sides, a repeated ledger and a missing amount, and refuses to commit with errors", async () => {
    const bad = [{ name: "Nobody" , debit: "1" }, { name: "Open Shop", debit: "1", credit: "1" }, { name: "Open Mill", debit: "5" }, { name: "open mill", debit: "5" }, { name: "Cash" }];
    const dry = await post("/import/opening-balances", { rows: bad, dryRun: true });
    expect(dry.body.results.map((x: { error?: string }) => x.error)).toEqual(["account_not_found", "one_side_only", undefined, "duplicate_row", "amount_required"]);
    expect((await post("/import/opening-balances", { rows: bad, dryRun: false })).body.error).toBe("fix_errors_first");
  });
});
