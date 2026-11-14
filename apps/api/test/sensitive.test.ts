import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

type Row = { kind: string; entity: string; user: string | null; after: Record<string, unknown> };
const feed = async (qs = "") => (await t.call(c, "GET", `/audit-log/sensitive${qs}`)).body as { rows: Row[] };

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("sensitive")).cookie;
  const groups: { id: string; key: string }[] = (await t.call(c, "GET", "/accounts/groups")).body;
  id.shop = (await t.call(c, "POST", "/accounts", { name: "Sensitive Shop", groupId: groups.find((g) => g.key === "sundry_creditors")!.id, stateCode: "27" })).body.id;
  await t.call(c, "PATCH", `/accounts/${id.shop}`, { bank: { accountNumber: "123456789012", ifsc: "HDFC0001234", branch: "Fort" } });
  await t.call(c, "PATCH", `/accounts/${id.shop}`, { creditLimit: "250000", creditDays: 45 });
  await t.call(c, "PATCH", `/accounts/${id.shop}`, { phone: "9820012345" });
});
afterAll(() => t.close());

describe("sensitive changes", () => {
  it("lists bank and credit changes, not ordinary edits, with the account number masked", async () => {
    const { rows } = await feed();
    const kinds = rows.map((r) => r.kind);
    expect(kinds).toEqual(expect.arrayContaining(["bank", "credit"]));
    const bank = rows.find((r) => r.kind === "bank")!;
    expect(JSON.stringify(bank.after)).not.toContain("123456789012");
    expect(JSON.stringify(bank.after)).toContain("9012");
    expect(bank.user).toMatch(/^Owner sensitive/);
    // The phone number edit is not sensitive.
    expect(rows.some((r) => JSON.stringify(r.after).includes("9820012345"))).toBe(false);
  });

  it("filters by kind and keeps businesses apart", async () => {
    expect((await feed("?kind=credit")).rows.every((r) => r.kind === "credit")).toBe(true);
    expect((await t.call(c, "GET", "/audit-log/sensitive?kind=nonsense")).status).toBe(400);
    const other = (await t.signup("sensitive-other")).cookie;
    const rows = ((await t.call(other, "GET", "/audit-log/sensitive")).body as { rows: Row[] }).rows;
    expect(rows.some((r) => r.kind === "bank")).toBe(false);
  });
});
