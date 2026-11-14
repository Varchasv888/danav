import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { businessDate } from "@varchasv/domain";
import { testApp } from "./helpers.js";

// The closing-stock journal is off unless ENABLE_STOCK_CLOSE_JOURNAL=true (it makes the statements stale between closes).
let t: Awaited<ReturnType<typeof testApp>>;
let owner: string;

beforeAll(async () => { delete process.env.ENABLE_STOCK_CLOSE_JOURNAL; t = await testApp(); owner = (await t.signup("stockclosedisabled")).cookie; });
afterAll(() => t.close());

describe("closing-stock journal switch", () => {
  it("is refused while switched off and the report says so", async () => {
    const report = await t.call(owner, "GET", `/reports/stock-ledger-reconciliation?asOf=${businessDate()}`);
    expect(report.body).toMatchObject({ postingEnabled: false });
    const post = await t.call(owner, "POST", "/inventory/stock-ledger-reconciliations", { asOf: businessDate(), reason: "should not post", landedCostsBooked: true });
    expect(post.status).toBe(409);
    expect(post.body.error).toBe("stock_close_disabled");
  });
});
