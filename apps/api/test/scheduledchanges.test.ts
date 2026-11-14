import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { runDueScheduledChanges } from "../src/services/scheduledchanges.js";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const plus = (days: number) => new Date(Date.now() + 330 * 60_000 + days * 86_400_000).toISOString().slice(0, 10);
const item = async () => ((await get("/items")) as { id: string; gstRate: string; saleRate: string }[]).find((i) => i.id === id.item)!;
const shop = async () => ((await get("/accounts")) as { id: string; creditLimit: string | null; creditDays: number | null }[]).find((a) => a.id === id.shop)!;
const schedule = (body: Record<string, unknown>) => post("/config/changes", { entity: "item", entityId: id.item, effectiveFrom: plus(2), ...body });

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("sched")).cookie;
  const setup = await get("/inventory/setup");
  id.item = (await post("/items", { name: "Rate Change Shirt", hsn: "6205", gstRate: "12", uomId: setup.uoms.find((u: { code: string }) => u.code === "PCS").id, saleRate: "1000" })).body.id;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  id.shop = (await post("/accounts", { name: "Terms Shop", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27", creditLimit: "10000", creditDays: 15 })).body.id;
});
afterAll(() => t.close());

describe("changes dated ahead", () => {
  it("lists what can be scheduled and refuses the rest", async () => {
    expect((await get("/config/fields")).item).toContain("gstRate");
    expect((await schedule({ field: "name", value: "x" })).body.error).toBe("field_not_schedulable");
    expect((await schedule({ field: "gstRate", value: "abc" })).body.error).toBe("invalid_value");
    expect((await schedule({ field: "gstRate", value: "150" })).body.error).toBe("invalid_value");
    expect((await schedule({ field: "gstRate", value: null })).body.error).toBe("value_required");
    expect((await schedule({ field: "gstRate", value: "5", effectiveFrom: plus(0) })).body.error).toBe("date_not_future");
  });

  it("keeps the old value until the day, then changes it and keeps the history", async () => {
    const a = await schedule({ field: "gstRate", value: "5", note: "Rate cut" });
    expect(a.status).toBe(201);
    const b = await schedule({ field: "saleRate", value: "1100" });
    expect(b.status).toBe(201);
    expect((await schedule({ field: "gstRate", value: "18" })).body.error).toBe("change_already_scheduled");
    expect(await item()).toMatchObject({ gstRate: "12.00", saleRate: "1000.0000" });
    // Today and tomorrow: nothing due yet.
    expect(await runDueScheduledChanges(t.appDb.db, new Date(Date.now() + 86_400_000))).toBe(0);
    expect(await item()).toMatchObject({ gstRate: "12.00" });
    // Two days on: both apply.
    expect(await runDueScheduledChanges(t.appDb.db, new Date(Date.now() + 3 * 86_400_000))).toBeGreaterThanOrEqual(2);
    expect(await item()).toMatchObject({ gstRate: "5.00", saleRate: "1100.0000" });
    const history = (await get(`/config/changes?entityId=${id.item}`)) as { field: string; status: string; previous: string | null }[];
    expect(history.map((h) => [h.field, h.status, h.previous]).sort()).toEqual([["gstRate", "applied", "12.00"], ["saleRate", "applied", "1000.0000"]]);
    // A repeat run changes nothing.
    expect(await runDueScheduledChanges(t.appDb.db, new Date(Date.now() + 3 * 86_400_000))).toBe(0);
  });

  it("a cancelled change never applies, and credit terms can be dated too", async () => {
    const x = await post("/config/changes", { entity: "account", entityId: id.shop, field: "creditDays", value: "30", effectiveFrom: plus(2) });
    const y = await post("/config/changes", { entity: "account", entityId: id.shop, field: "creditLimit", value: "50000", effectiveFrom: plus(2) });
    expect((await post(`/config/changes/${x.body.id}/cancel`, {})).status).toBe(200);
    expect((await post(`/config/changes/${x.body.id}/cancel`, {})).body.error).toBe("change_not_pending");
    await runDueScheduledChanges(t.appDb.db, new Date(Date.now() + 3 * 86_400_000));
    expect(await shop()).toMatchObject({ creditDays: 15, creditLimit: "50000.00" });
    expect(y.status).toBe(201);
  });

  it("shows up in the audit trail and is private to the business", async () => {
    const trail = (await get("/audit-log?limit=50")) as { entity: string; after: { scheduledChange?: string } | null }[];
    expect(trail.some((a) => a.entity === "item" && a.after?.scheduledChange)).toBe(true);
    const other = (await t.signup("sched-other")).cookie;
    expect((await t.call(other, "GET", "/config/changes")).body).toEqual([]);
    expect((await t.call(other, "POST", "/config/changes", { entity: "item", entityId: id.item, field: "gstRate", value: "5", effectiveFrom: plus(2) })).status).toBe(404);
  });
});

describe("dating a role's permissions and a numbering series", () => {
  const roles = async () => (await get("/roles")) as { id: string; key: string; name: string; permissions: string[] }[];
  const series = async () => (await get("/number-series")) as { id: string; docType: string; pattern: string }[];

  it("a role's whole set of permissions starts on a day, and the owner role cannot be dated", async () => {
    const role = (await post("/roles", { name: "Dated clerk", permissions: ["sales.view", "sales.create", "sales.edit"] })).body.id as string;
    const set = (permissions: string[], over: Record<string, unknown> = {}) => post("/config/changes", { entity: "role", entityId: role, field: "permissions", value: JSON.stringify(permissions), effectiveFrom: plus(2), ...over });
    expect((await set(["sales.view", "not.a.permission"])).body.error).toBe("invalid_value");
    expect((await set([])).body.error).toBe("invalid_value");
    const owner = (await roles()).find((r) => r.key === "owner")!;
    expect((await post("/config/changes", { entity: "role", entityId: owner.id, field: "permissions", value: JSON.stringify(["sales.view"]), effectiveFrom: plus(2) })).body.error).toBe("owner_role_fixed");
    expect((await set(["sales.view"])).status).toBe(201);
    expect((await roles()).find((r) => r.id === role)!.permissions).toContain("sales.create"); // not yet
    await runDueScheduledChanges(t.appDb.db, new Date(Date.now() + 3 * 86_400_000));
    expect((await roles()).find((r) => r.id === role)!.permissions).toEqual(["sales.view"]);
    const history = (await get(`/config/changes?entityId=${role}`)) as { status: string; previous: string | null }[];
    expect(history[0]).toMatchObject({ status: "applied" });
    expect(JSON.parse(history[0]!.previous!)).toEqual(["sales.create", "sales.edit", "sales.view"]);
  });

  it("a numbering series changes its pattern on a day, refusing one that would break GST's limits", async () => {
    const s = (await series()).find((x) => x.docType === "sales_invoice")!;
    const set = (pattern: string) => post("/config/changes", { entity: "number_series", entityId: s.id, field: "pattern", value: pattern, effectiveFrom: plus(2) });
    expect((await set("no sequence here")).body.error).toBe("invalid_value");
    expect((await set("INVOICE-NUMBER-WAY-TOO-LONG/{FY}/{SEQ:5}")).body.error).toBe("invalid_value");
    expect((await set("INV/{FY}/{SEQ:5}")).status).toBe(201);
    expect((await series()).find((x) => x.id === s.id)!.pattern).toBe(s.pattern);
    await runDueScheduledChanges(t.appDb.db, new Date(Date.now() + 3 * 86_400_000));
    expect((await series()).find((x) => x.id === s.id)!.pattern).toBe("INV/{FY}/{SEQ:5}");
  });
});

describe("dating rights cannot go past your own", () => {
  it("refuses to date a right the person scheduling does not hold themselves", async () => {
    const manager = (await post("/roles", { name: "Rights manager", permissions: ["users.view", "users.edit", "settings.view", "sales.view"] })).body.id as string;
    const inv = await post("/invitations", { email: `rm-${t.run}@test.varchasv.in`, roleId: manager });
    const mine = (await t.call("", "POST", "/invitations/accept", { token: inv.body.inviteUrl.split("/invite/")[1], name: "Rights Manager", password: "ledger-balanced-1" })).cookie as string;
    const target = (await post("/roles", { name: "Target role", permissions: ["sales.view"] })).body.id as string;
    const date = (perms: string[]) => t.call(mine, "POST", "/config/changes", { entity: "role", entityId: target, field: "permissions", value: JSON.stringify(perms), effectiveFrom: plus(3) });
    expect((await date(["sales.view", "accounts.edit"])).body.error).toBe("permission_escalation");
    expect((await date(["sales.view"])).status).toBe(201);
  });
});
