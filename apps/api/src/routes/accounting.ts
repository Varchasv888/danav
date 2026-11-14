import { assertDateRight } from "../lib/rights.js";
import { holdsBankChange, requestBankChange } from "../services/changes.js";
import { and, asc, desc, eq, gte, lte, sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { tables, withTenant, type Db, type Tx } from "@varchasv/db";
import { VOUCHER_TYPES, isValidStateCode, money, validateGstin, businessDate } from "@varchasv/domain";
import { audit, diff } from "../lib/audit.js";
import { badRequest, notFound } from "../lib/errors.js";
import { can, requireTenant } from "../plugins/auth.js";
import { parsePatch } from "../lib/patch.js";
import {
  accountBalances, balanceSheet, cancelVoucher, ensureChart, ledgerStatement, postVoucher, profitAndLoss, resolveCompany, trialBalance,
} from "../services/accounting.js";
import { listLedgerParameters, saveLedgerParameters } from "../services/ledgerparameters.js";
import { reconciliationOverview } from "../services/reconoverview.js";
import { createRecurring, listRecurring, runDueRecurring, setRecurringActive } from "../services/recurring.js";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Amount = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount"), z.number().nonnegative()]).transform((v) => money(v));
const SignedAmount = z.union([z.string().regex(/^-?\d+(\.\d{1,2})?$/, "invalid_amount"), z.number()]).transform((v) => money(v));
const CompanyQuery = z.object({ companyId: z.uuid().optional() });
const today = () => businessDate();

const AccountBody = z.object({
  name: z.string().trim().min(1).max(120),
  nameHi: z.string().trim().max(120).nullish(),
  groupId: z.uuid(),
  code: z.string().trim().max(20).nullish(),
  openingBalance: SignedAmount.optional(),
  gstin: z.string().trim().max(15).nullish(),
  stateCode: z.string().refine(isValidStateCode, "invalid_state").nullish(),
  pan: z.string().trim().toUpperCase().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "invalid_pan").nullish(),
  udyamNumber: z.string().trim().toUpperCase().regex(/^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/, "invalid_udyam").nullish(),
  msmeClass: z.enum(["micro", "small", "medium"]).nullish(),
  phone: z.string().trim().max(15).nullish(),
  email: z.email().nullish(),
  bank: z.object({ accountNumber: z.string().max(30).optional(), ifsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "invalid_ifsc").optional(), branch: z.string().max(100).optional() }).nullish(),
  address: z.object({
    line1: z.string().trim().max(200).optional(), line2: z.string().trim().max(200).optional(), city: z.string().trim().max(100).optional(),
    pincode: z.string().regex(/^[1-9][0-9]{5}$/, "invalid_pincode").optional(),
  }).nullish(),
  creditLimit: z.union([z.string().regex(/^\d+(\.\d{1,2})?$/), z.number().nonnegative()]).transform(String).nullish(),
  creditDays: z.number().int().min(0).max(365).nullish(),
  creditControl: z.enum(["warn", "block"]).optional(),
  blockOverdueDays: z.number().int().min(1).max(3650).nullish(),
  interestRate: z.union([z.string().regex(/^\d{1,2}(\.\d{1,2})?$/, "invalid_percent"), z.number().min(0).max(99.99)]).transform(String).nullish(),
  priceListId: z.uuid().nullish(),
  isAgent: z.boolean().optional(),
  commissionPct: z.union([z.string().regex(/^\d{1,2}(\.\d{1,2})?$/, "invalid_percent"), z.number().min(0).max(99.99)]).transform(String).nullish(),
  agentId: z.uuid().nullish(),
  salesmanId: z.uuid().nullish(),
});

/** A customer's default agent must be one of this company's agents, and the salesman one of its employees. */
async function checkSalesPeople(tx: Tx, companyId: string, body: { agentId?: string | null | undefined; salesmanId?: string | null | undefined }) {
  if (body.agentId) {
    const [a] = await tx.select({ companyId: tables.accounts.companyId, isAgent: tables.accounts.isAgent }).from(tables.accounts).where(eq(tables.accounts.id, body.agentId));
    if (!a || a.companyId !== companyId || !a.isAgent) throw badRequest("not_an_agent");
  }
  if (body.salesmanId) {
    const [e] = await tx.select({ companyId: tables.employees.companyId }).from(tables.employees).where(eq(tables.employees.id, body.salesmanId));
    if (!e || e.companyId !== companyId) throw badRequest("unknown_salesman");
  }
}

function checkPartyGstin(body: { gstin?: string | null | undefined; stateCode?: string | null | undefined }) {
  if (!body.gstin) return {};
  const g = validateGstin(body.gstin);
  if (!g.valid) throw badRequest(`gstin_${g.error}`);
  if (body.stateCode && body.stateCode !== g.stateCode) throw badRequest("gstin_state_mismatch");
  return { gstin: g.gstin, stateCode: g.stateCode, pan: g.pan };
}

export async function accountingRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const actor = (auth: { tenantId: string; user: { id: string } }, ip: string) => ({ tenantId: auth.tenantId, userId: auth.user.id, ip });

  // ---- chart of accounts ---------------------------------------------------------------------

  app.get("/accounts/groups", { preHandler: can("accounts.view") }, async (req) => {
    const auth = requireTenant(req);
    const { companyId } = CompanyQuery.parse(req.query);
    return withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx, companyId);
      await ensureChart(tx, auth.tenantId, company.id);
      return tx.select().from(tables.accountGroups).where(eq(tables.accountGroups.companyId, company.id)).orderBy(asc(tables.accountGroups.name));
    });
  });

  app.get("/accounts", { preHandler: can("accounts.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = CompanyQuery.extend({ asOf: IsoDate.optional() }).parse(req.query);
    return withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx, q.companyId);
      await ensureChart(tx, auth.tenantId, company.id);
      const balances = await accountBalances(tx, company.id, null, q.asOf ?? "9999-12-31");
      const accts = await tx.select().from(tables.accounts).where(eq(tables.accounts.companyId, company.id));
      const byId = new Map(balances.map((b) => [b.accountId, b]));
      return accts
        .map((a) => ({ ...a, groupName: byId.get(a.id)?.groupName, groupNameHi: byId.get(a.id)?.groupNameHi, nature: byId.get(a.id)?.nature, balance: byId.get(a.id)?.closing ?? "0.00" }))
        .sort((x, y) => x.name.localeCompare(y.name));
    });
  });

  app.get("/accounts/ledger-parameters", { preHandler: can("accounts.view") }, async (req) => {
    const auth = requireTenant(req);
    const { companyId } = CompanyQuery.parse(req.query);
    return withTenant(db, auth.tenantId, (tx) => listLedgerParameters(tx, companyId));
  });

  app.put("/accounts/ledger-parameters", { preHandler: can("accounts.edit") }, async (req) => {
    const auth = requireTenant(req);
    const { companyId } = CompanyQuery.parse(req.query);
    const body = z.object({ defaults: z.array(z.object({ key: z.string().trim().min(1).max(40), accountId: z.uuid() })).max(100) }).parse(req.body);
    return withTenant(db, auth.tenantId, (tx) => saveLedgerParameters(tx, actor(auth, req.ip), companyId, body.defaults));
  });

  app.post("/accounts", { preHandler: can("accounts.create") }, async (req, reply) => {
    const auth = requireTenant(req);
    const { companyId } = CompanyQuery.parse(req.query);
    const body = AccountBody.parse(req.body);
    const party = checkPartyGstin(body);
    const account = await withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx, companyId);
      await ensureChart(tx, auth.tenantId, company.id);
      const [group] = await tx.select().from(tables.accountGroups).where(and(eq(tables.accountGroups.id, body.groupId), eq(tables.accountGroups.companyId, company.id)));
      if (!group) throw badRequest("unknown_group");
      await checkSalesPeople(tx, company.id, body);
      const [a] = await tx.insert(tables.accounts).values({
        tenantId: auth.tenantId, companyId: company.id, groupId: group.id, name: body.name, nameHi: body.nameHi ?? null, code: body.code ?? null,
        openingBalance: body.openingBalance ?? "0", stateCode: body.stateCode ?? null, phone: body.phone ?? null, email: body.email ?? null,
        bank: body.bank ?? null, gstin: body.gstin ?? null, pan: body.pan ?? null, udyamNumber: body.udyamNumber ?? null, msmeClass: body.msmeClass ?? null, address: body.address ?? null,
        creditLimit: body.creditLimit ?? null, creditDays: body.creditDays ?? null, creditControl: body.creditControl ?? "warn",
        blockOverdueDays: body.blockOverdueDays ?? null, interestRate: body.interestRate ?? null, priceListId: body.priceListId ?? null,
        isAgent: body.isAgent ?? false, commissionPct: body.commissionPct ?? null, agentId: body.agentId ?? null, salesmanId: body.salesmanId ?? null, ...party,
      }).returning().catch((e) => {
        if (e?.cause?.code === "23505") throw badRequest("account_name_taken");
        throw e;
      });
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "create", entity: "account", entityId: a!.id, after: { name: a!.name, group: group.name }, ip: req.ip });
      return a;
    });
    return reply.code(201).send(account);
  });

  app.patch("/accounts/:id", { preHandler: can("accounts.edit") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = parsePatch(AccountBody.partial().extend({ archived: z.boolean().optional() }), req.body);
    const party = checkPartyGstin(body);
    return withTenant(db, auth.tenantId, async (tx) => {
      const [current] = await tx.select().from(tables.accounts).where(eq(tables.accounts.id, id)).for("update");
      if (!current) throw notFound();
      if (current.system && body.groupId && body.groupId !== current.groupId) throw badRequest("system_account_group");
      if (body.groupId) {
        const [group] = await tx.select().from(tables.accountGroups).where(and(eq(tables.accountGroups.id, body.groupId), eq(tables.accountGroups.companyId, current.companyId)));
        if (!group) throw badRequest("unknown_group");
      }
      await checkSalesPeople(tx, current.companyId, body);
      if (body.agentId && body.agentId === id) throw badRequest("not_an_agent");
      const patch: Record<string, unknown> = { ...body, ...party };
      // Bank details can be held for a second person's approval; the rest of the change goes through now.
      let held: { id: string } | null = null;
      if ("bank" in patch && !auth.permissions.has("special.approveBankChange") && (await holdsBankChange(tx, current.bank, patch.bank))) {
        held = await requestBankChange(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, { id, name: current.name, bank: current.bank }, patch.bank);
        delete patch.bank;
      }
      const d = diff(current as Record<string, unknown>, patch);
      if (!d.changed) return held ? { ...current, pendingApproval: held.id } : current;
      const [updated] = await tx.update(tables.accounts).set({ ...patch, updatedAt: new Date() }).where(eq(tables.accounts.id, id)).returning();
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "update", entity: "account", entityId: id, ...d, ip: req.ip });
      return held ? { ...updated, pendingApproval: held.id } : updated;
    });
  });

  // ---- vouchers ------------------------------------------------------------------------------

  app.get("/vouchers", { preHandler: can("accounts.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = CompanyQuery.extend({
      type: z.enum(VOUCHER_TYPES).optional(), from: IsoDate.optional(), to: IsoDate.optional(),
      limit: z.coerce.number().int().min(1).max(500).default(100),
    }).parse(req.query);
    return withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx, q.companyId);
      return tx
        .select({
          voucher: tables.vouchers,
          accounts: sql<string>`(select string_agg(a.name, ', ' order by l.line_no) from voucher_lines l join accounts a on a.id = l.account_id where l.voucher_id = vouchers.id)`,
        })
        .from(tables.vouchers)
        .where(and(
          eq(tables.vouchers.companyId, company.id),
          q.type ? eq(tables.vouchers.type, q.type) : undefined,
          q.from ? gte(tables.vouchers.date, q.from) : undefined,
          q.to ? lte(tables.vouchers.date, q.to) : undefined,
        ))
        .orderBy(desc(tables.vouchers.date), desc(tables.vouchers.createdAt))
        .limit(q.limit)
        .then((rows) => rows.map((r) => ({ ...r.voucher, accounts: r.accounts })));
    });
  });

  app.get("/vouchers/:id", { preHandler: can("accounts.view") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    return withTenant(db, auth.tenantId, async (tx) => {
      const [v] = await tx.select().from(tables.vouchers).where(eq(tables.vouchers.id, id));
      if (!v) throw notFound();
      const lines = await tx
        .select({ line: tables.voucherLines, accountName: tables.accounts.name, accountNameHi: tables.accounts.nameHi })
        .from(tables.voucherLines)
        .innerJoin(tables.accounts, eq(tables.accounts.id, tables.voucherLines.accountId))
        .where(eq(tables.voucherLines.voucherId, id))
        .orderBy(asc(tables.voucherLines.lineNo));
      return { ...v, lines: lines.map((l) => ({ ...l.line, accountName: l.accountName, accountNameHi: l.accountNameHi })) };
    });
  });

  app.post("/vouchers", { preHandler: can("accounts.create") }, async (req, reply) => {
    const auth = requireTenant(req);
    const body = z.object({
      companyId: z.uuid().optional(),
      type: z.enum(VOUCHER_TYPES),
      date: IsoDate,
      narration: z.string().trim().max(500).optional(),
      reference: z.string().trim().max(60).optional(),
      clientId: z.uuid().optional(),
      lines: z.array(z.object({
        accountId: z.uuid(), debit: Amount.optional(), credit: Amount.optional(), narration: z.string().max(200).optional(),
      })).min(2).max(200),
    }).parse(req.body);
    assertDateRight(auth, body.date);
    const result = await withTenant(db, auth.tenantId, (tx) => postVoucher(tx, actor(auth, req.ip), body));
    return reply.code(result.replayed ? 200 : 201).send(result.voucher);
  });

  app.post("/vouchers/:id/cancel", { preHandler: can("accounts.cancel") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const { reason } = z.object({ reason: z.string().trim().min(3).max(300) }).parse(req.body);
    await withTenant(db, auth.tenantId, (tx) => cancelVoucher(tx, actor(auth, req.ip), id, reason));
    return { ok: true };
  });

  // ---- period locks --------------------------------------------------------------------------

  app.patch("/fiscal-years/:id", { preHandler: can("accounts.approve") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ lockedUpTo: IsoDate.nullable() }).parse(req.body);
    return withTenant(db, auth.tenantId, async (tx) => {
      const [fy] = await tx.select().from(tables.fiscalYears).where(eq(tables.fiscalYears.id, id)).for("update");
      if (!fy) throw notFound();
      if (body.lockedUpTo && (body.lockedUpTo < fy.startsOn || body.lockedUpTo > fy.endsOn)) throw badRequest("lock_outside_year");
      const [updated] = await tx.update(tables.fiscalYears).set({ lockedUpTo: body.lockedUpTo }).where(eq(tables.fiscalYears.id, id)).returning();
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "update", entity: "fiscal_year", entityId: id, before: { lockedUpTo: fy.lockedUpTo }, after: body, ip: req.ip });
      return updated;
    });
  });

  // ---- reports -------------------------------------------------------------------------------

  app.get("/reports/trial-balance", { preHandler: can("reports.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = CompanyQuery.extend({ asOf: IsoDate.default(today) }).parse(req.query);
    return withTenant(db, auth.tenantId, async (tx) => trialBalance(tx, (await resolveCompany(tx, q.companyId)).id, q.asOf));
  });

  app.get("/reports/profit-loss", { preHandler: can("reports.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = CompanyQuery.extend({ from: IsoDate.optional(), to: IsoDate.default(today) }).parse(req.query);
    return withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx, q.companyId);
      const from = q.from ?? (q.to >= company.booksBeginOn ? `${q.to.slice(5) >= "04-01" ? q.to.slice(0, 4) : Number(q.to.slice(0, 4)) - 1}-04-01` : company.booksBeginOn);
      return profitAndLoss(tx, company.id, from, q.to);
    });
  });

  app.get("/reports/balance-sheet", { preHandler: can("reports.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = CompanyQuery.extend({ asOf: IsoDate.default(today) }).parse(req.query);
    return withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx, q.companyId);
      return balanceSheet(tx, company.id, company.booksBeginOn, q.asOf);
    });
  });

  app.get("/reports/ledger/:accountId", { preHandler: can("reports.view") }, async (req) => {
    const auth = requireTenant(req);
    const { accountId } = z.object({ accountId: z.uuid() }).parse(req.params);
    const q = z.object({ from: IsoDate, to: IsoDate }).parse(req.query);
    return withTenant(db, auth.tenantId, (tx) => ledgerStatement(tx, accountId, q.from, q.to));
  });

  /** Where the books must agree with something else, each area with its two figures and the difference. */
  app.get("/accounts/reconciliation-overview", { preHandler: can("accounts.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = CompanyQuery.extend({ asOf: IsoDate.default(today) }).parse(req.query);
    return withTenant(db, auth.tenantId, (tx) => reconciliationOverview(tx, q.asOf, q.companyId));
  });

  // ---- recurring entries ---------------------------------------------------------------------

  app.get("/recurring-vouchers", { preHandler: can("accounts.view") }, async (req) => {
    const auth = requireTenant(req);
    const { companyId } = CompanyQuery.parse(req.query);
    return withTenant(db, auth.tenantId, (tx) => listRecurring(tx, companyId));
  });
  app.post("/recurring-vouchers", { preHandler: can("accounts.create") }, async (req, reply) => {
    const auth = requireTenant(req);
    const b = z.object({
      name: z.string().trim().min(2).max(80), type: z.enum(["journal", "payment", "receipt", "contra"]), narration: z.string().max(200).optional(),
      frequency: z.enum(["monthly", "quarterly", "yearly"]), dayOfMonth: z.number().int().min(1).max(31), startOn: IsoDate, endsOn: IsoDate.optional(),
      lines: z.array(z.object({ accountId: z.uuid(), debit: Amount.optional(), credit: Amount.optional() })).min(2).max(20), companyId: z.uuid().optional(),
    }).parse(req.body);
    return reply.code(201).send(await withTenant(db, auth.tenantId, (tx) => createRecurring(tx, actor(auth, req.ip), b)));
  });
  app.post("/recurring-vouchers/:id/active", { preHandler: can("accounts.edit") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const { active } = z.object({ active: z.boolean() }).parse(req.body);
    await withTenant(db, auth.tenantId, (tx) => setRecurringActive(tx, actor(auth, req.ip), id, active));
    return { ok: true };
  });
  app.post("/recurring-vouchers/run", { preHandler: can("accounts.create") }, async (req) => {
    const auth = requireTenant(req);
    const { companyId } = CompanyQuery.parse(req.body ?? {});
    return withTenant(db, auth.tenantId, (tx) => runDueRecurring(tx, actor(auth, req.ip), today(), companyId));
  });
}
