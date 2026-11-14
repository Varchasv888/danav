import { and, asc, eq, inArray } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { ACCOUNT_TEMPLATE, GROUP_TEMPLATE } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, notFound } from "../lib/errors.js";
import { ensureChart, ensureTemplateAccounts } from "./accounting.js";

/** Template ledgers currently used by automatic posting. Keep this list in sync with posting services. */
export const POSTING_ACCOUNT_KEYS = [
  "sales", "sales_returns", "purchases", "purchase_returns",
  "output_cgst", "output_sgst", "output_utgst", "output_igst", "output_cess",
  "input_cgst", "input_sgst", "input_utgst", "input_igst", "input_cess", "round_off",
  "cash", "upi_clearing", "card_clearing", "cash_short_excess", "gift_vouchers", "vouchers_written_back",
  "tcs_payable", "tds_payable",
  "salaries", "employer_contributions", "gratuity_leave", "salary_payable", "pf_payable", "esi_payable", "lwf_payable", "pt_payable", "salary_advances", "stipend",
  "reimbursements_payable",
  "gateway_charges", "brokerage", "depreciation", "profit_on_sale_of_assets", "loss_on_sale_of_assets",
  "alteration_labour", "stock_writedown", "stock_provision", "recon_differences", "repair_deposits", "repair_income",
] as const;

export type PostingAccountKey = (typeof POSTING_ACCOUNT_KEYS)[number];
const roleKeys = new Set<string>(POSTING_ACCOUNT_KEYS);
const accountTemplate = new Map(ACCOUNT_TEMPLATE.map((account) => [account.key, account]));

export function isPostingAccountKey(key: string): key is PostingAccountKey {
  return roleKeys.has(key);
}

/** Resolve saved company mapping first, otherwise use the standard template account. */
export async function resolvePostingAccountId(tx: Tx, companyId: string, roleKey: string): Promise<string> {
  const resolved = await resolvePostingAccountIds(tx, companyId, [roleKey]);
  return resolved[roleKey]!;
}

/** Batch variant keeps posting services from issuing one database round trip per ledger line. */
export async function resolvePostingAccountIds(tx: Tx, companyId: string, requestedKeys: readonly string[]) {
  const keys = [...new Set(requestedKeys)];
  if (keys.some((key) => !isPostingAccountKey(key))) throw badRequest("unsupported_posting_role");
  if (!keys.length) return {} as Record<string, string>;

  const [company] = await tx.select({ tenantId: tables.companies.tenantId }).from(tables.companies).where(eq(tables.companies.id, companyId));
  if (!company) throw notFound("company_not_found");
  await ensureChart(tx, company.tenantId, companyId);
  await ensureTemplateAccounts(tx, company.tenantId, companyId, keys);

  const templates = await tx.select({ id: tables.accounts.id, key: tables.accounts.key, groupId: tables.accounts.groupId })
    .from(tables.accounts).where(and(eq(tables.accounts.companyId, companyId), inArray(tables.accounts.key, keys)));
  const templateByKey = new Map(templates.map((row) => [row.key!, row]));
  const mappings = await tx.select({ roleKey: tables.ledgerPostingDefaults.roleKey, accountId: tables.ledgerPostingDefaults.accountId })
    .from(tables.ledgerPostingDefaults).where(and(eq(tables.ledgerPostingDefaults.companyId, companyId), inArray(tables.ledgerPostingDefaults.roleKey, keys)));
  const mappedIds = mappings.map((row) => row.accountId);
  const mappedAccounts = mappedIds.length
    ? await tx.select({ id: tables.accounts.id, companyId: tables.accounts.companyId, groupId: tables.accounts.groupId, archived: tables.accounts.archived, mergedIntoId: tables.accounts.mergedIntoId })
      .from(tables.accounts).where(inArray(tables.accounts.id, mappedIds))
    : [];
  const mappingByKey = new Map(mappings.map((row) => [row.roleKey, row.accountId]));
  const mappedById = new Map(mappedAccounts.map((row) => [row.id, row]));

  return Object.fromEntries(keys.map((key) => {
    const template = templateByKey.get(key);
    if (!template) throw new Error(`template account ${key} missing after ensure`);
    const mappedId = mappingByKey.get(key);
    const mapped = mappedId ? mappedById.get(mappedId) : undefined;
    const valid = mapped && mapped.companyId === companyId && mapped.groupId === template.groupId && !mapped.archived && !mapped.mergedIntoId;
    return [key, valid ? mapped.id : template.id];
  })) as Record<string, string>;
}

export async function listLedgerParameters(tx: Tx, companyId?: string) {
  const companies = await tx.select({ id: tables.companies.id, tenantId: tables.companies.tenantId, name: tables.companies.name })
    .from(tables.companies).orderBy(asc(tables.companies.createdAt));
  const company = companyId ? companies.find((candidate) => candidate.id === companyId) : companies[0];
  if (!company) throw notFound("company_not_found");

  await ensureChart(tx, company.tenantId, company.id);
  await ensureTemplateAccounts(tx, company.tenantId, company.id, [...POSTING_ACCOUNT_KEYS]);
  const templates = await tx.select({ id: tables.accounts.id, key: tables.accounts.key, name: tables.accounts.name, groupId: tables.accounts.groupId })
    .from(tables.accounts).where(and(eq(tables.accounts.companyId, company.id), inArray(tables.accounts.key, [...POSTING_ACCOUNT_KEYS])));
  const currentIds = await resolvePostingAccountIds(tx, company.id, POSTING_ACCOUNT_KEYS);
  const currentIdSet = [...new Set(Object.values(currentIds))];
  const currentRows = await tx.select({ id: tables.accounts.id, name: tables.accounts.name }).from(tables.accounts).where(inArray(tables.accounts.id, currentIdSet));
  const choices = await tx.select({ id: tables.accounts.id, name: tables.accounts.name, key: tables.accounts.key, groupId: tables.accounts.groupId, system: tables.accounts.system, mergedIntoId: tables.accounts.mergedIntoId })
    .from(tables.accounts).where(and(eq(tables.accounts.companyId, company.id), eq(tables.accounts.archived, false)));
  const groupById = new Map((await tx.select({ id: tables.accountGroups.id, key: tables.accountGroups.key, name: tables.accountGroups.name })
    .from(tables.accountGroups).where(eq(tables.accountGroups.companyId, company.id))).map((group) => [group.id, group]));

  return {
    companyId: company.id,
    companies: companies.map(({ id, name }) => ({ id, name })),
    roles: POSTING_ACCOUNT_KEYS.map((key) => {
      const template = templates.find((row) => row.key === key)!;
      const templateInfo = accountTemplate.get(key)!;
      const group = groupById.get(template.groupId)!;
      const groupTemplate = GROUP_TEMPLATE.find((candidate) => candidate.key === templateInfo.group)!;
      const currentAccountId = currentIds[key]!;
      const current = currentRows.find((row) => row.id === currentAccountId)!;
      return {
        key, groupKey: group.key, groupName: groupTemplate.name,
        currentAccountId, currentAccountName: current.name,
        templateAccountId: template.id, templateAccountName: template.name,
        isCustomized: currentAccountId !== template.id,
        compatibleAccounts: choices.filter((choice) => choice.groupId === group.id && !choice.mergedIntoId)
          .map(({ id, name, key: accountKey, system }) => ({ id, name, key: accountKey, system })),
      };
    }),
  };
}

export async function saveLedgerParameters(
  tx: Tx,
  actor: { tenantId: string; userId: string; ip?: string | undefined },
  companyId: string | undefined,
  defaults: { key: string; accountId: string }[],
) {
  const company = (await tx.select().from(tables.companies).where(companyId ? eq(tables.companies.id, companyId) : undefined)
    .orderBy(tables.companies.createdAt).limit(1))[0];
  if (!company) throw notFound("company_not_found");
  await ensureChart(tx, company.tenantId, company.id);

  const keys = defaults.map((row) => row.key);
  if (keys.some((key) => !isPostingAccountKey(key))) throw badRequest("unsupported_posting_role");
  if (new Set(keys).size !== keys.length) throw badRequest("duplicate_posting_role");
  await ensureTemplateAccounts(tx, company.tenantId, company.id, keys);
  const templates = await tx.select({ key: tables.accounts.key, groupId: tables.accounts.groupId, id: tables.accounts.id })
    .from(tables.accounts).where(and(eq(tables.accounts.companyId, company.id), inArray(tables.accounts.key, keys)));
  const templateByKey = new Map(templates.map((row) => [row.key!, row]));
  const targets = defaults.length
    ? await tx.select({ id: tables.accounts.id, companyId: tables.accounts.companyId, groupId: tables.accounts.groupId, archived: tables.accounts.archived, mergedIntoId: tables.accounts.mergedIntoId })
      .from(tables.accounts).where(inArray(tables.accounts.id, defaults.map((row) => row.accountId)))
    : [];
  const targetById = new Map(targets.map((row) => [row.id, row]));

  // Validate the whole request before any row is written.
  for (const row of defaults) {
    const template = templateByKey.get(row.key);
    const target = targetById.get(row.accountId);
    if (!template || !target) throw badRequest("unknown_account");
    if (target.companyId !== company.id) throw badRequest("account_company_mismatch");
    if (target.archived || target.mergedIntoId) throw badRequest("account_archived");
    if (target.groupId !== template.groupId) throw badRequest("incompatible_account");
  }

  const oldMappings = defaults.length
    ? await tx.select({ roleKey: tables.ledgerPostingDefaults.roleKey, accountId: tables.ledgerPostingDefaults.accountId })
      .from(tables.ledgerPostingDefaults).where(and(eq(tables.ledgerPostingDefaults.companyId, company.id), inArray(tables.ledgerPostingDefaults.roleKey, keys)))
    : [];
  const oldByKey = new Map(oldMappings.map((row) => [row.roleKey, row.accountId]));
  const changed: { key: string; before: string | null; after: string | null }[] = [];
  for (const row of defaults) {
    const template = templateByKey.get(row.key)!;
    const previous = oldByKey.get(row.key) ?? null;
    const next = row.accountId === template.id ? null : row.accountId;
    if (previous === next) continue;
    changed.push({ key: row.key, before: previous, after: next });
    if (next === null) {
      await tx.delete(tables.ledgerPostingDefaults).where(and(eq(tables.ledgerPostingDefaults.companyId, company.id), eq(tables.ledgerPostingDefaults.roleKey, row.key)));
    } else {
      await tx.insert(tables.ledgerPostingDefaults).values({ tenantId: actor.tenantId, companyId: company.id, roleKey: row.key, accountId: next })
        .onConflictDoUpdate({ target: [tables.ledgerPostingDefaults.companyId, tables.ledgerPostingDefaults.roleKey], set: { accountId: next, updatedAt: new Date() } });
    }
  }
  if (changed.length) await audit(tx, {
    tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "ledger_posting_defaults", entityId: company.id,
    before: changed.map(({ key, before }) => ({ key, accountId: before })), after: changed.map(({ key, after }) => ({ key, accountId: after })), ip: actor.ip,
  });
  return { updated: changed.length };
}
