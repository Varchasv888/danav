import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { tables, withTenant } from "@varchasv/db";
import { businessDate } from "@varchasv/domain";
import { ensureChart } from "../src/services/accounting.js";
import { resolvePostingAccountId } from "../src/services/ledgerparameters.js";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let owner = "";
let tenantId = "";
let companyId = "";
let otherCompanyId = "";
let salesAccountId = "";
let alternativeSalesId = "";
let archivedSalesId = "";
let cashAccountId = "";
let otherCompanySalesId = "";
let customerId = "";
let itemId = "";

const get = (cookie: string, url: string) => t.call(cookie, "GET", url);
const putDefaults = (cookie: string, company: string, defaults: { key: string; accountId: string }[]) =>
  t.call(cookie, "PUT", `/accounts/ledger-parameters?companyId=${company}`, { defaults });

async function person(tag: string, permissions: string[]) {
  const role = (await t.call(owner, "POST", "/roles", { name: `Role ${tag}`, permissions })).body;
  const invite = await t.call(owner, "POST", "/invitations", { email: `${tag}-${t.run}@test.varchasv.in`, roleId: role.id });
  const token = invite.body.inviteUrl.split("/invite/")[1];
  return (await t.call("", "POST", "/invitations/accept", { token, name: `Person ${tag}`, password: "ledger-balanced-1" })).cookie as string;
}

beforeAll(async () => {
  t = await testApp();
  const signup = await t.signup("ledger-defaults", { gstin: "27AAPFU0939F1ZV" });
  expect(signup.status, JSON.stringify(signup.body)).toBe(201);
  owner = signup.cookie;
  tenantId = signup.body.tenantId;
  const companiesResponse = await get(owner, "/companies");
  expect(companiesResponse.status, JSON.stringify(companiesResponse.body)).toBe(200);
  const companies = companiesResponse.body as { id: string }[];
  companyId = companies[0]!.id;

  const groups = (await get(owner, `/accounts/groups?companyId=${companyId}`)).body as { id: string; key: string }[];
  const groupId = (key: string) => groups.find((group) => group.key === key)!.id;
  const accounts = (await get(owner, `/accounts?companyId=${companyId}`)).body as { id: string; key: string | null }[];
  salesAccountId = accounts.find((account) => account.key === "sales")!.id;
  cashAccountId = accounts.find((account) => account.key === "cash")!.id;

  alternativeSalesId = (await t.call(owner, "POST", `/accounts?companyId=${companyId}`, {
    name: "Alternative Sales Ledger", groupId: groupId("sales_accounts"),
  })).body.id;
  archivedSalesId = (await t.call(owner, "POST", `/accounts?companyId=${companyId}`, {
    name: "Archived Sales Ledger", groupId: groupId("sales_accounts"),
  })).body.id;
  await t.call(owner, "PATCH", `/accounts/${archivedSalesId}`, { archived: true });

  otherCompanyId = await withTenant(t.appDb.db, tenantId, async (tx) => {
    const [company] = await tx.insert(tables.companies).values({
      tenantId, name: `Secondary ${t.run}`, booksBeginOn: "2026-04-01",
    }).returning({ id: tables.companies.id });
    await ensureChart(tx, tenantId, company!.id);
    return company!.id;
  });
  const otherAccounts = (await get(owner, `/accounts?companyId=${otherCompanyId}`)).body as { id: string; key: string | null }[];
  otherCompanySalesId = otherAccounts.find((account) => account.key === "sales")!.id;

  customerId = (await t.call(owner, "POST", `/accounts?companyId=${companyId}`, {
    name: "Future Posting Customer", groupId: groupId("sundry_debtors"), stateCode: "27",
  })).body.id;
  const setup = (await get(owner, "/inventory/setup")).body;
  itemId = (await t.call(owner, "POST", "/items", {
    name: "Future Posting Shirt", hsn: "6205", gstRate: "5",
    uomId: setup.uoms.find((uom: { code: string }) => uom.code === "PCS").id,
    purchaseRate: "100", saleRate: "200",
  })).body.id;
  await t.call(owner, "POST", "/stock-journals", {
    kind: "opening", lines: [{ itemId, warehouseId: setup.warehouses[0].id, qty: "100", rate: "100" }],
  });
});

afterAll(() => t.close());

describe("ledger posting defaults", () => {
  it("seeds the company chart on first use before resolving a template ledger", async () => {
    const unseededCompanyId = await withTenant(t.appDb.db, tenantId, async (tx) => {
      const [company] = await tx.insert(tables.companies).values({
        tenantId, name: `Unseeded ${t.run}`, booksBeginOn: "2026-04-01",
      }).returning({ id: tables.companies.id });
      return company!.id;
    });
    const accountId = await withTenant(t.appDb.db, tenantId, (tx) => resolvePostingAccountId(tx, unseededCompanyId, "sales"));
    const account = await withTenant(t.appDb.db, tenantId, async (tx) => {
      const [row] = await tx.select({ key: tables.accounts.key }).from(tables.accounts).where(eq(tables.accounts.id, accountId));
      return row;
    });
    expect(account?.key).toBe("sales");
  });

  it("falls back to the template ledger and lists only compatible choices", async () => {
    const response = await get(owner, `/accounts/ledger-parameters?companyId=${companyId}`);
    expect(response.status).toBe(200);
    const role = response.body.roles.find((candidate: { key: string }) => candidate.key === "sales");
    expect(role).toMatchObject({
      key: "sales", currentAccountId: salesAccountId, templateAccountId: salesAccountId, isCustomized: false,
    });
    expect(role.compatibleAccounts.some((account: { id: string }) => account.id === alternativeSalesId)).toBe(true);
    expect(role.compatibleAccounts.some((account: { id: string }) => account.id === cashAccountId)).toBe(false);
    expect(response.body.companies.some((company: { id: string }) => company.id === otherCompanyId)).toBe(true);
    expect(response.body.roles.filter((candidate: { key: string }) => ["travel", "lodging", "staff_welfare", "stationery", "telephone", "courier"].includes(candidate.key))).toHaveLength(0);
    const secondary = await get(owner, `/accounts/ledger-parameters?companyId=${otherCompanyId}`);
    expect(secondary.body.companyId).toBe(otherCompanyId);
  });

  it("saves defaults only for the selected company", async () => {
    const groups = (await get(owner, `/accounts/groups?companyId=${otherCompanyId}`)).body as { id: string; key: string }[];
    const salesGroupId = groups.find((group) => group.key === "sales_accounts")!.id;
    const secondaryLedgerId = (await t.call(owner, "POST", `/accounts?companyId=${otherCompanyId}`, {
      name: "Secondary Company Sales Ledger", groupId: salesGroupId,
    })).body.id;
    const saved = await putDefaults(owner, otherCompanyId, [{ key: "sales", accountId: secondaryLedgerId }]);
    expect(saved.status).toBe(200);

    const primary = await get(owner, `/accounts/ledger-parameters?companyId=${companyId}`);
    const secondary = await get(owner, `/accounts/ledger-parameters?companyId=${otherCompanyId}`);
    expect(primary.body.roles.find((role: { key: string }) => role.key === "sales").currentAccountId).toBe(salesAccountId);
    expect(secondary.body.roles.find((role: { key: string }) => role.key === "sales").currentAccountId).toBe(secondaryLedgerId);
  });

  it("rejects archived and incompatible accounts", async () => {
    const archived = await putDefaults(owner, companyId, [{ key: "sales", accountId: archivedSalesId }]);
    expect([archived.status, archived.body.error]).toEqual([400, "account_archived"]);

    const incompatible = await putDefaults(owner, companyId, [{ key: "sales", accountId: cashAccountId }]);
    expect([incompatible.status, incompatible.body.error]).toEqual([400, "incompatible_account"]);
  });

  it("rejects an account from a different company", async () => {
    const response = await putDefaults(owner, companyId, [{ key: "sales", accountId: otherCompanySalesId }]);
    expect(response.status).toBe(400);
  });

  it("validates every row before writing any mapping", async () => {
    const response = await putDefaults(owner, companyId, [
      { key: "sales", accountId: alternativeSalesId },
      { key: "output_sgst", accountId: cashAccountId },
    ]);
    expect(response.status).toBe(400);

    const roles = (await get(owner, `/accounts/ledger-parameters?companyId=${companyId}`)).body.roles;
    expect(roles.find((role: { key: string }) => role.key === "sales").currentAccountId).toBe(salesAccountId);
  });

  it("requires accounts.edit to change defaults", async () => {
    const viewer = await person("ledger-viewer", ["accounts.view"]);
    const response = await putDefaults(viewer, companyId, [{ key: "sales", accountId: alternativeSalesId }]);
    expect(response.status).toBe(403);
  });

  it("uses a saved ledger on future sales postings without changing existing vouchers", async () => {
    const date = businessDate();
    const createInvoice = () => t.call(owner, "POST", "/sales-invoices", {
      customerId, date, lines: [{ itemId, qty: "1", rate: "200" }],
    });
    const earlier = await createInvoice();
    expect(earlier.status).toBe(201);
    const earlierVoucherId = await withTenant(t.appDb.db, tenantId, async (tx) => {
      const [invoice] = await tx.select({ voucherId: tables.salesInvoices.voucherId })
        .from(tables.salesInvoices).where(eq(tables.salesInvoices.id, earlier.body.id));
      return invoice!.voucherId;
    });
    const before = await get(owner, `/vouchers/${earlierVoucherId}`);

    const saved = await putDefaults(owner, companyId, [{ key: "sales", accountId: alternativeSalesId }]);
    expect(saved.status).toBe(200);
    const later = await createInvoice();
    expect(later.status).toBe(201);
    const laterVoucherId = await withTenant(t.appDb.db, tenantId, async (tx) => {
      const [invoice] = await tx.select({ voucherId: tables.salesInvoices.voucherId })
        .from(tables.salesInvoices).where(eq(tables.salesInvoices.id, later.body.id));
      return invoice!.voucherId;
    });

    const after = await get(owner, `/vouchers/${earlierVoucherId}`);
    const future = await get(owner, `/vouchers/${laterVoucherId}`);
    expect(after.body).toEqual(before.body);
    expect(future.body.lines.some((line: { accountId: string }) => line.accountId === alternativeSalesId)).toBe(true);
    expect((await get(owner, `/audit-log?limit=50`)).body.some((entry: { entity: string }) => entry.entity === "ledger_posting_defaults")).toBe(true);
  });
});
