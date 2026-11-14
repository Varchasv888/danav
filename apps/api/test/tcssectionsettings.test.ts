import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { tables, withTenant } from "@varchasv/db";
import { TCS_SECTIONS } from "@varchasv/domain";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let owner = "";
let tenantId = "";
let companyId = "";
let secondaryCompanyId = "";
let customerId = "";
let defaultPayableId = "";
let alternativePayableId = "";
let cashAccountId = "";

const codes = TCS_SECTIONS.map((section) => section.code);
const get = (cookie: string, url: string) => t.call(cookie, "GET", url);
const putSettings = (cookie: string, company: string, enabledSections: string[], extra: Record<string, unknown> = {}) =>
  t.call(cookie, "PUT", `/tcs/section-settings?companyId=${company}`, { enabledSections, ...extra });

async function person(tag: string, permissions: string[]) {
  const role = (await t.call(owner, "POST", "/roles", { name: `Role ${tag}`, permissions })).body;
  const invite = await t.call(owner, "POST", "/invitations", { email: `${tag}-${t.run}@test.varchasv.in`, roleId: role.id });
  const token = invite.body.inviteUrl.split("/invite/")[1];
  return (await t.call("", "POST", "/invitations/accept", { token, name: `Person ${tag}`, password: "tcs-settings-safe-1" })).cookie as string;
}

beforeAll(async () => {
  t = await testApp();
  const signup = await t.signup("tcs-settings", { gstin: "27AAPFU0939F1ZV" });
  expect(signup.status, JSON.stringify(signup.body)).toBe(201);
  owner = signup.cookie;
  tenantId = signup.body.tenantId;
  companyId = ((await get(owner, "/companies")).body as { id: string }[])[0]!.id;

  const groups = (await get(owner, `/accounts/groups?companyId=${companyId}`)).body as { id: string; key: string }[];
  const groupId = (key: string) => groups.find((group) => group.key === key)!.id;
  const accounts = (await get(owner, `/accounts?companyId=${companyId}`)).body as { id: string; key: string | null; groupId: string }[];
  defaultPayableId = accounts.find((account) => account.key === "tcs_payable")!.id;
  cashAccountId = accounts.find((account) => account.key === "cash")!.id;
  alternativePayableId = (await t.call(owner, "POST", `/accounts?companyId=${companyId}`, {
    name: "Alternative TCS Payable", groupId: accounts.find((account) => account.id === defaultPayableId)!.groupId,
  })).body.id;
  customerId = (await t.call(owner, "POST", `/accounts?companyId=${companyId}`, {
    name: "TCS Test Customer", groupId: groupId("sundry_debtors"), stateCode: "27", pan: "AAACS1234E",
  })).body.id;

  secondaryCompanyId = await withTenant(t.appDb.db, tenantId, async (tx) => {
    const [company] = await tx.insert(tables.companies).values({
      tenantId, name: `Secondary TCS ${t.run}`, booksBeginOn: "2026-04-01",
    }).returning({ id: tables.companies.id });
    return company!.id;
  });
});

afterAll(() => t.close());

describe("TCS section settings", () => {
  it("defaults every statutory section to enabled without changing its legal values", async () => {
    const response = await get(owner, `/tcs/section-settings?companyId=${companyId}`);
    expect(response.status).toBe(200);
    expect(response.body.sections).toHaveLength(TCS_SECTIONS.length);
    expect(response.body.sections).toEqual(TCS_SECTIONS.map((section) => ({ ...section, enabled: true })));
    expect((await get(owner, "/tcs/sections")).body.map((section: { code: string }) => section.code)).toEqual(codes);
  });

  it("allows an authorized company to enable and disable sections and rejects statutory rate edits", async () => {
    const enabled = codes.filter((code) => code !== codes[0]);
    const saved = await putSettings(owner, companyId, enabled);
    expect(saved.status).toBe(200);
    expect(saved.body.enabledSections).toEqual(enabled);
    expect((await get(owner, "/tcs/sections")).body.map((section: { code: string }) => section.code)).toEqual(enabled);

    const rateEdit = await putSettings(owner, companyId, codes, { rates: { [codes[0]!]: "99" } });
    expect(rateEdit.status).toBe(400);
    const after = await get(owner, `/tcs/section-settings?companyId=${companyId}`);
    expect(after.body.sections.find((section: { code: string }) => section.code === codes[0])).toMatchObject({
      rate: TCS_SECTIONS[0]!.rate, noPanRate: TCS_SECTIONS[0]!.noPanRate,
    });
  });

  it("keeps section preferences isolated by company and tenant", async () => {
    const enabled = codes.filter((code) => code !== codes[0]);
    const saved = await putSettings(owner, companyId, enabled);
    expect(saved.status).toBe(200);
    const secondaryCompany = await get(owner, `/tcs/section-settings?companyId=${secondaryCompanyId}`);
    expect(secondaryCompany.body.sections.map((section: { code: string; enabled: boolean }) => section.enabled)).toEqual(codes.map(() => true));
    expect((await get(owner, `/tcs/sections?companyId=${companyId}`)).body.map((section: { code: string }) => section.code)).toEqual(enabled);
    expect((await get(owner, `/tcs/sections?companyId=${secondaryCompanyId}`)).body.map((section: { code: string }) => section.code)).toEqual(codes);

    const secondaryGroups = (await get(owner, `/accounts/groups?companyId=${secondaryCompanyId}`)).body as { id: string; key: string }[];
    const secondaryCustomerId = (await t.call(owner, "POST", `/accounts?companyId=${secondaryCompanyId}`, {
      name: "Secondary TCS Customer", groupId: secondaryGroups.find((group) => group.key === "sundry_debtors")!.id, stateCode: "27", pan: "AAACS1234E",
    })).body.id;
    const secondaryCollection = await t.call(owner, "POST", `/tcs/collections?companyId=${secondaryCompanyId}`, {
      customerId: secondaryCustomerId, section: codes[1], date: "2026-11-10", base: "100000",
    });
    expect(secondaryCollection.status).toBe(201);
    expect((await get(owner, `/tcs/collections?companyId=${secondaryCompanyId}`)).body.some((row: { id: string }) => row.id === secondaryCollection.body.id)).toBe(true);
    expect((await get(owner, `/tcs/collections?companyId=${companyId}`)).body.some((row: { id: string }) => row.id === secondaryCollection.body.id)).toBe(false);
    const wrongCompanyCustomer = await t.call(owner, "POST", `/tcs/collections?companyId=${secondaryCompanyId}`, {
      customerId, section: codes[1], date: "2026-11-10", base: "100000",
    });
    expect([wrongCompanyCustomer.status, wrongCompanyCustomer.body.error]).toEqual([400, "account_company_mismatch"]);

    const otherOwner = (await t.signup(`tcs-other-${t.run}`)).cookie;
    const otherCompanyId = ((await get(otherOwner, "/companies")).body as { id: string }[])[0]!.id;
    const otherSaved = await putSettings(otherOwner, otherCompanyId, codes.filter((code) => code !== codes[0]));
    expect(otherSaved.status).toBe(200);
    expect((await get(owner, `/tcs/section-settings?companyId=${companyId}`)).body.sections[0].enabled).toBe(false);
    expect((await get(otherOwner, `/tcs/section-settings?companyId=${otherCompanyId}`)).body.sections[0].enabled).toBe(false);
    expect((await get(owner, `/tcs/section-settings?companyId=${otherCompanyId}`)).status).toBe(404);
  });

  it("requires accounts.edit to change applicability", async () => {
    const viewer = await person("tcs-viewer", ["accounts.view"]);
    expect((await get(viewer, `/tcs/section-settings?companyId=${companyId}`)).status).toBe(200);
    expect((await putSettings(viewer, companyId, codes.filter((code) => code !== codes[0]))).status).toBe(403);
  });

  it("hides a disabled section from new collection entry but preserves existing collections and reports", async () => {
    const reset = await putSettings(owner, companyId, codes);
    expect(reset.status).toBe(200);
    const created = await t.call(owner, "POST", "/tcs/collections", {
      customerId, section: codes[0], date: "2026-11-10", base: "200000",
    });
    expect(created.status).toBe(201);

    const saved = await putSettings(owner, companyId, codes.filter((code) => code !== codes[0]));
    expect(saved.status).toBe(200);
    expect((await get(owner, "/tcs/sections")).body.map((section: { code: string }) => section.code)).not.toContain(codes[0]);
    const blocked = await t.call(owner, "POST", "/tcs/collections", {
      customerId, section: codes[0], date: "2026-11-11", base: "200000",
    });
    expect([blocked.status, blocked.body.error]).toEqual([400, "section_disabled"]);

    const deposit = await t.call(owner, "POST", "/tds/challans", {
      kind: "tcs", companyId, paidOn: "2026-11-12", amount: created.body.tcs, accountId: cashAccountId,
      bsrCode: "0510308", challanSerial: "000004", deductionIds: [created.body.id],
    });
    expect(deposit.status).toBe(201);
    const collections = await get(owner, "/tcs/collections?fy=2026-27");
    expect(collections.body.some((collection: { id: string }) => collection.id === created.body.id)).toBe(true);
    const report = await get(owner, "/tcs/27eq?fy=2026-27&quarter=3");
    expect(report.body.collectees.some((collection: { section: string }) => collection.section === codes[0])).toBe(true);
    expect(report.body.totals.deposited).toBe(created.body.tcs);
  });

  it("uses a changed TCS payable ledger only for future collections", async () => {
    const reset = await putSettings(owner, companyId, codes);
    expect(reset.status).toBe(200);
    const earlier = await t.call(owner, "POST", "/tcs/collections", {
      customerId, section: codes[0], date: "2026-11-12", base: "100000",
    });
    expect(earlier.status).toBe(201);
    const earlierVoucherId = await withTenant(t.appDb.db, tenantId, async (tx) => {
      const [row] = await tx.select({ voucherId: tables.tcsCollections.voucherId })
        .from(tables.tcsCollections).where(eq(tables.tcsCollections.id, earlier.body.id));
      return row!.voucherId!;
    });
    const before = await get(owner, `/vouchers/${earlierVoucherId}`);

    const saved = await t.call(owner, "PUT", `/accounts/ledger-parameters?companyId=${companyId}`, {
      defaults: [{ key: "tcs_payable", accountId: alternativePayableId }],
    });
    expect(saved.status).toBe(200);
    const later = await t.call(owner, "POST", "/tcs/collections", {
      customerId, section: codes[0], date: "2026-11-13", base: "100000",
    });
    expect(later.status).toBe(201);
    const laterVoucherId = await withTenant(t.appDb.db, tenantId, async (tx) => {
      const [row] = await tx.select({ voucherId: tables.tcsCollections.voucherId })
        .from(tables.tcsCollections).where(eq(tables.tcsCollections.id, later.body.id));
      return row!.voucherId!;
    });
    expect((await get(owner, `/vouchers/${earlierVoucherId}`)).body).toEqual(before.body);
    expect((await get(owner, `/vouchers/${laterVoucherId}`)).body.lines.some((line: { accountId: string }) => line.accountId === alternativePayableId)).toBe(true);
    const challan = await t.call(owner, "POST", "/tds/challans", {
      kind: "tcs", companyId, paidOn: "2026-11-14", amount: later.body.tcs, accountId: cashAccountId,
      bsrCode: "0510308", challanSerial: "000003", deductionIds: [later.body.id],
    });
    expect(challan.status).toBe(201);
    const challanVoucherId = await withTenant(t.appDb.db, tenantId, async (tx) => {
      const [row] = await tx.select({ voucherId: tables.tdsChallans.voucherId })
        .from(tables.tdsChallans).where(eq(tables.tdsChallans.id, challan.body.id));
      return row!.voucherId!;
    });
    expect((await get(owner, `/vouchers/${challanVoucherId}`)).body.lines.some((line: { accountId: string }) => line.accountId === alternativePayableId)).toBe(true);
    expect((await get(owner, "/audit-log?limit=50")).body.some((entry: { entity: string }) => entry.entity === "tcs_section_settings")).toBe(true);
    expect(defaultPayableId).not.toBe(alternativePayableId);
  });
});
