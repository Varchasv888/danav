import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("recurring")).cookie as string;
  const accounts = (await get("/accounts")) as { id: string; key: string | null; name: string }[];
  const groups = (await get("/accounts/groups")) as { id: string; key: string }[];
  id.rent = (await post("/accounts", { name: "Shop rent", groupId: groups.find((g) => g.key === "indirect_expenses")?.id ?? groups[0]!.id })).body.id;
  id.landlord = (await post("/accounts", { name: "Landlord", groupId: groups.find((g) => g.key === "sundry_creditors")!.id })).body.id;
  void accounts;
});
afterAll(() => t.close());

describe("recurring entries", () => {
  it("rejects an entry that does not balance and one that ends before it starts", async () => {
    const base = { name: "Rent", type: "journal", frequency: "monthly", dayOfMonth: 5, startOn: "2026-06-01" };
    expect((await post("/recurring-vouchers", { ...base, lines: [{ accountId: id.rent, debit: "1000" }, { accountId: id.landlord, credit: "900" }] })).body.error).toBe("voucher_not_balanced");
    expect((await post("/recurring-vouchers", { ...base, endsOn: "2026-05-01", lines: [{ accountId: id.rent, debit: "1000" }, { accountId: id.landlord, credit: "1000" }] })).body.error).toBe("ends_before_start");
  });

  it("posts each due month once, catches up, and never posts the same date twice", async () => {
    const made = await post("/recurring-vouchers", { name: "Rent", type: "journal", frequency: "monthly", dayOfMonth: 5, startOn: "2026-06-01", endsOn: "2026-08-31",
      lines: [{ accountId: id.rent, debit: "12000" }, { accountId: id.landlord, credit: "12000" }] });
    expect(made.status, JSON.stringify(made.body)).toBe(201);
    expect(made.body.nextOn).toBe("2026-06-05");
    const first = (await post("/recurring-vouchers/run", {})).body;
    expect(first.failed).toEqual([]);
    expect(first.posted.map((p: { date: string }) => p.date)).toEqual(["2026-06-05", "2026-07-05", "2026-08-05"]);
    const again = (await post("/recurring-vouchers/run", {})).body;
    expect(again.posted).toEqual([]);
    const list = (await get("/recurring-vouchers")) as { nextOn: string; active: boolean; lastRunOn: string }[];
    expect(list[0]).toMatchObject({ lastRunOn: "2026-08-05", active: false }); // ended: the next date is past the end date
  });
});
