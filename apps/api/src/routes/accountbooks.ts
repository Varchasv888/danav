import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { businessDate } from "@varchasv/domain";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { cfoView } from "../services/cfo.js";
import { stockMovement } from "../services/stockmovement.js";
import { integrityChecks } from "../services/integrity.js";
import { billAdjustments, cashBankExpense, cashBook, cashFlow, groupMonthSummary, rcmRegister } from "../services/accountbooks.js";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
/** The financial year (April to March) the date falls in, starting day. */
const fyStart = (iso: string) => (iso.slice(5) >= "04-01" ? `${iso.slice(0, 4)}-04-01` : `${Number(iso.slice(0, 4)) - 1}-04-01`);
const Range = z.object({ from: IsoDate.optional(), to: IsoDate.optional() }).transform((r) => {
  const to = r.to ?? businessDate();
  return { from: r.from ?? fyStart(to), to };
}).refine((r) => r.from <= r.to, "invalid_range");

/** Account books: cash and bank book, a group month by month, cash and bank expense, and cash flow. */
export async function accountBookRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant>[2]>[0]) => Promise<T>) => withTenant(db, requireTenant(req).tenantId, fn);

  app.get("/reports/cash-book", { preHandler: can("reports.view") }, async (req) => {
    const { kind } = z.object({ kind: z.enum(["cash", "bank"]) }).parse(req.query);
    const { from, to } = Range.parse(req.query);
    return run(req, (tx) => cashBook(tx, kind, from, to));
  });
  app.get("/reports/group-month", { preHandler: can("reports.view") }, async (req) => {
    const { groupId } = z.object({ groupId: z.uuid() }).parse(req.query);
    const { from, to } = Range.parse(req.query);
    return run(req, (tx) => groupMonthSummary(tx, groupId, from, to));
  });
  app.get("/reports/cash-bank-expense", { preHandler: can("reports.view") }, async (req) => {
    const { from, to } = Range.parse(req.query);
    return run(req, (tx) => cashBankExpense(tx, from, to));
  });
  app.get("/reports/cash-flow", { preHandler: can("reports.view") }, async (req) => {
    const { from, to } = Range.parse(req.query);
    return run(req, (tx) => cashFlow(tx, from, to));
  });
  app.get("/reports/rcm-register", { preHandler: can("reports.view") }, async (req) => {
    const { from, to } = Range.parse(req.query);
    return run(req, (tx) => rcmRegister(tx, from, to));
  });
  app.get("/reports/bill-adjustments", { preHandler: can("reports.view") }, async (req) => {
    const { from, to } = Range.parse(req.query);
    return run(req, (tx) => billAdjustments(tx, from, to));
  });
  // Do the books agree with themselves? Lists every difference with the records behind it.
  app.get("/reports/integrity", { preHandler: can("reports.view") }, async (req) => {
    const { asOf } = z.object({ asOf: IsoDate.optional() }).parse(req.query);
    return run(req, (tx) => integrityChecks(tx, asOf));
  });
  // The owner's view: revenue to net profit against last year, and the margin month by month.
  app.get("/reports/cfo", { preHandler: can("reports.view") }, async (req) => {
    const { from, to } = Range.parse(req.query);
    return run(req, (tx) => cfoView(tx, from, to));
  });
  // Which stock sells and which sits: fast, slow and non-moving, with bands the user sets.
  app.get("/reports/stock-movement", { preHandler: can("reports.view") }, async (req) => {
    const q = z.object({
      asOf: IsoDate.optional(), days: z.coerce.number().int().min(7).max(730).default(90), fastMin: z.coerce.number().min(1).max(100000).default(10), all: z.enum(["1", "0"]).optional(),
    }).parse(req.query);
    return run(req, (tx) => stockMovement(tx, q.asOf ?? businessDate(), { days: q.days, fastMin: q.fastMin }, q.all === "1"));
  });
}
