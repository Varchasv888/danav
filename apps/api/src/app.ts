import { randomUUID } from "node:crypto";
import { requestContext } from "./lib/requestcontext.js";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import { ZodError } from "zod";
import type { Db } from "@varchasv/db";
import { env } from "./env.js";
import { HttpError } from "./lib/errors.js";
import { LogMailer, type Mailer } from "./lib/mailer.js";
import { SESSION_COOKIE, loadSession } from "./lib/session.js";
import { getSessionLocalRole } from "./lib/local-auth.js";
import { guardPermissions } from "./plugins/auth.js";
import { accountingRoutes } from "./routes/accounting.js";
import { assetRoutes } from "./routes/assets.js";
import { bankingRoutes } from "./routes/banking.js";
import { crmRoutes } from "./routes/crm.js";
import { cronRoutes } from "./routes/cron.js";
import { insightRoutes } from "./routes/insights.js";
import { expenseRoutes } from "./routes/expenses.js";
import { projectRoutes } from "./routes/projects.js";
import { authRoutes } from "./routes/auth.js";
import { companyRoutes } from "./routes/company.js";
import { inventoryRoutes } from "./routes/inventory.js";
import { packingBoxRoutes } from "./routes/packingboxes.js";
import { purchasingRoutes } from "./routes/purchasing.js";
import { gstRoutes } from "./routes/gst.js";
import { hrRoutes } from "./routes/hr.js";
import { manufacturingRoutes } from "./routes/manufacturing.js";
import { posRoutes } from "./routes/pos.js";
import { salesRoutes } from "./routes/sales.js";
import { passcodeGuard } from "./plugins/passcodeguard.js";
import { storeScopeGuard } from "./plugins/storescope.js";
import { approvalMemoRoutes } from "./routes/approvalmemos.js";
import { commWebhookRoutes } from "./routes/commwebhooks.js";
import { branchPriceRoutes } from "./routes/branchprices.js";
import { serialRoutes } from "./routes/serials.js";
import { priceListRoutes } from "./routes/pricelists.js";
import { commissionRoutes } from "./routes/commission.js";
import { voucherRoutes } from "./routes/vouchers.js";
import { alterationRoutes } from "./routes/alterations.js";
import { tailoringRoutes } from "./routes/tailoring.js";
import { consignmentRoutes } from "./routes/consignment.js";
import { catalogueRoutes } from "./routes/catalogue.js";
import { sharingRoutes } from "./routes/sharing.js";
import { stockCountRoutes } from "./routes/stockcount.js";
import { styleRoutes } from "./routes/styles.js";
import { lookupRoutes } from "./routes/lookups.js";
import { stockLimitRoutes } from "./routes/stocklimits.js";
import { billReceiptRoutes } from "./routes/billreceipts.js";
import { gstJvRoutes } from "./routes/gstjv.js";
import { deliveryOrderRoutes } from "./routes/deliveryorders.js";
import { rateUpdateRoutes } from "./routes/rateupdate.js";
import { transferRoutes } from "./routes/transfers.js";
import { loyaltyRoutes } from "./routes/loyalty.js";
import { salesmanCommissionRoutes } from "./routes/salesmancomm.js";
import { chatRoutes } from "./routes/chat.js";
import { changeRoutes } from "./routes/changes.js";
import { offlineRoutes } from "./routes/offline.js";
import { iclockRoutes } from "./routes/iclock.js";
import { backupRoutes } from "./routes/backups.js";
import { cashFlowRoutes } from "./routes/cashflow.js";
import { closeRoutes } from "./routes/close.js";
import { gstWorkRoutes } from "./routes/gstwork.js";
import { lossRoutes } from "./routes/losses.js";
import { controlsRoutes } from "./routes/controls.js";
import { preferenceRoutes } from "./routes/preferences.js";
import { profitabilityRoutes } from "./routes/profitability.js";
import { reconRoutes } from "./routes/recon.js";
import { scenarioRoutes } from "./routes/scenarios.js";
import { exportRoutes } from "./routes/exports.js";
import { commsRoutes } from "./routes/comms.js";
import { distributionRoutes } from "./routes/distribution.js";
import { marginBandRoutes } from "./routes/marginbands.js";
import { relabelRoutes } from "./routes/relabel.js";
import { processLockRoutes } from "./routes/processlocks.js";
import { stockResetRoutes } from "./routes/stockreset.js";
import { retailReportRoutes } from "./routes/retailreports.js";
import { stockFinanceRoutes } from "./routes/stockfinance.js";
import { workingCapRoutes } from "./routes/workingcap.js";
import { mergeRoutes } from "./routes/merge.js";
import { scheduledChangeRoutes } from "./routes/scheduledchanges.js";
import { tdsRoutes } from "./routes/tds.js";
import { yearEndRoutes } from "./routes/yearend.js";
import { repairRoutes } from "./routes/repairs.js";
import { userActivityRoutes } from "./routes/useractivity.js";
import { msmeRoutes } from "./routes/msme.js";
import { dailySalesRoutes } from "./routes/dailysales.js";
import { discountRoutes } from "./routes/discounts.js";
import { orderRegisterRoutes } from "./routes/orderregister.js";
import { lrRoutes } from "./routes/lr.js";
import { hsnRoutes } from "./routes/hsn.js";
import { noteRoutes } from "./routes/notes.js";
import { accountBookRoutes } from "./routes/accountbooks.js";
import { syncRoutes } from "./routes/sync.js";
import { teamRoutes } from "./routes/team.js";
import { toolRoutes } from "./routes/tools.js";

declare module "fastify" {
  interface FastifyInstance {
    routeTable: RouteInfo[];
  }
}

export interface AppOptions {
  db: Db;
  logger?: boolean | object;
  /** Off in tests; route-level limits only apply when the plugin is registered. */
  rateLimits?: boolean;
  mailer?: Mailer;
}

export interface RouteInfo {
  method: string;
  url: string;
  /** Any one of these grants access; empty means the handler does its own check (or the route is public). */
  permissions: string[];
}

export async function buildApp({ db, logger = true, rateLimits = true, mailer }: AppOptions) {
  // Every request gets an id: the caller's x-request-id when it is a sensible token, else a new one. It is returned in
  // the response, written in the log, and stored on each audit entry the request makes.
  const app = Fastify({ logger, trustProxy: true, genReqId: (req) => { const h = req.headers["x-request-id"]; return typeof h === "string" && /^[\w.-]{8,64}$/.test(h) ? h : randomUUID(); } });
  app.addHook("onRequest", (req, reply, done) => { reply.header("x-request-id", req.id); requestContext.run({ requestId: req.id }, done); });
  const mail = mailer ?? new LogMailer((m) => app.log.info(m));
  const routes: RouteInfo[] = [];
  app.decorate("routeTable", routes);
  app.addHook("onRoute", (r) => {
    for (const method of [r.method].flat()) {
      if (method === "HEAD") continue;
      routes.push({ method, url: r.url, permissions: guardPermissions(r.preHandler) });
    }
  });

  await app.register(helmet, { contentSecurityPolicy: false });
  // WEB_ORIGIN may be a comma-separated list; each entry is trimmed.
  const allowedOrigins = env.WEB_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean);
  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.some((o) => o === origin || origin.endsWith(".vercel.app"))) {
        cb(null, true);
      } else {
        cb(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
  });
  await app.register(cookie);
  if (rateLimits) {
    // A ceiling on every route, per signed-in session (or per IP before sign-in). Sign-in, sign-up,
    // password and invitation routes set tighter limits of their own.
    await app.register(rateLimit, {
      global: true, max: env.RATE_LIMIT_PER_MINUTE, timeWindow: "1 minute",
      keyGenerator: (req) => req.cookies?.[SESSION_COOKIE] ?? req.headers.authorization ?? req.ip,
    });
  }

  app.decorateRequest("auth", null);
  app.addHook("onRequest", async (req) => {
    // Browsers send the session cookie; the offline app sends the same token as a bearer header.
    const bearer = req.headers.authorization?.match(/^Bearer\s+(\S+)$/i)?.[1];
    const token = req.cookies[SESSION_COOKIE] ?? bearer;
    const auth = token ? await loadSession(db, token) : null;
    if (auth) {
      // Populate localRole from DB (set during local-login; null for regular users).
      auth.localRole = await getSessionLocalRole(db, auth.sessionHash);
    }
    req.auth = auth;
  });

  // People limited to some stores can only name those stores.
  app.addHook("preHandler", storeScopeGuard(db));
  // When the business asked for a passcode to cancel documents, one place checks it for all of them.
  app.addHook("preHandler", passcodeGuard(db));

  app.setErrorHandler((err, req, reply) => {
    if (err instanceof ZodError) {
      return reply.code(400).send({ error: "validation", issues: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })) });
    }
    if (err instanceof HttpError) return reply.code(err.status).send({ error: err.code });
    const status = (err as { statusCode?: number }).statusCode;
    if (status && status < 500) return reply.code(status).send({ error: (err as Error).message });
    req.log.error(err);
    return reply.code(500).send({ error: "internal" });
  });

  app.get("/health", async () => ({ ok: true }));
  await app.register(authRoutes, { db, mailer: mail });
  await app.register(companyRoutes, { db });
  await app.register(teamRoutes, { db, mailer: mail });
  await app.register(accountingRoutes, { db });
  await app.register(syncRoutes, { db });
  await app.register(inventoryRoutes, { db });
  await app.register(packingBoxRoutes, { db });
  await app.register(styleRoutes, { db });
  await app.register(lookupRoutes, { db });
  await app.register(stockLimitRoutes, { db });
  await app.register(billReceiptRoutes, { db });
  await app.register(gstJvRoutes, { db });
  await app.register(deliveryOrderRoutes, { db });
  await app.register(rateUpdateRoutes, { db });
  await app.register(transferRoutes, { db });
  await app.register(loyaltyRoutes, { db });
  await app.register(salesmanCommissionRoutes, { db });
  await app.register(chatRoutes, { db });
  await app.register(changeRoutes, { db });
  await app.register(offlineRoutes);
  await app.register(iclockRoutes, { db });
  await app.register(mergeRoutes, { db });
  await app.register(lossRoutes, { db });
  await app.register(workingCapRoutes, { db });
  await app.register(branchPriceRoutes, { db });
  await app.register(approvalMemoRoutes, { db });
  await app.register(commWebhookRoutes, { db });
  await app.register(serialRoutes, { db });
  await app.register(stockFinanceRoutes, { db });
  await app.register(profitabilityRoutes, { db });
  await app.register(preferenceRoutes, { db });
  await app.register(controlsRoutes, { db });
  await app.register(reconRoutes, { db });
  await app.register(scenarioRoutes, { db });
  await app.register(exportRoutes, { db });
  await app.register(commsRoutes, { db, mailer: mail });
  await app.register(distributionRoutes, { db });
  await app.register(marginBandRoutes, { db });
  await app.register(relabelRoutes, { db });
  await app.register(processLockRoutes, { db });
  await app.register(stockResetRoutes, { db });
  await app.register(retailReportRoutes, { db });
  await app.register(gstWorkRoutes, { db });
  await app.register(cashFlowRoutes, { db });
  await app.register(closeRoutes, { db });
  await app.register(backupRoutes, { db, mailer: mail });
  await app.register(tdsRoutes, { db });
  await app.register(scheduledChangeRoutes, { db });
  await app.register(yearEndRoutes, { db });
  await app.register(repairRoutes, { db });
  await app.register(userActivityRoutes, { db });
  await app.register(msmeRoutes, { db });
  await app.register(dailySalesRoutes, { db });
  await app.register(discountRoutes, { db });
  await app.register(orderRegisterRoutes, { db });
  await app.register(lrRoutes, { db });
  await app.register(hsnRoutes, { db });
  await app.register(noteRoutes, { db });
  await app.register(accountBookRoutes, { db });
  await app.register(priceListRoutes, { db });
  await app.register(commissionRoutes, { db });
  await app.register(voucherRoutes, { db });
  await app.register(alterationRoutes, { db });
  await app.register(tailoringRoutes, { db });
  await app.register(consignmentRoutes, { db });
  await app.register(catalogueRoutes, { db });
  await app.register(sharingRoutes, { db });
  await app.register(stockCountRoutes, { db });
  await app.register(purchasingRoutes, { db });
  await app.register(salesRoutes, { db });
  await app.register(gstRoutes, { db });
  await app.register(hrRoutes, { db, mailer: mail });
  await app.register(manufacturingRoutes, { db });
  await app.register(posRoutes, { db });
  await app.register(bankingRoutes, { db });
  await app.register(assetRoutes, { db });
  await app.register(expenseRoutes, { db });
  await app.register(projectRoutes, { db });
  await app.register(crmRoutes, { db });
  await app.register(insightRoutes, { db, mailer: mail });
  await app.register(toolRoutes);
  await app.register(cronRoutes, { db, mailer: mail });
  return app;
}
