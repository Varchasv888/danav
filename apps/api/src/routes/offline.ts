import type { FastifyInstance } from "fastify";
import { OFFLINE_ACTIONS } from "@varchasv/domain";
import { requireTenant } from "../plugins/auth.js";

/** What the offline app may do, per action, so the app and the screens say the same thing. */
export async function offlineRoutes(app: FastifyInstance) {
  app.get("/sync/offline-rules", async (req) => {
    requireTenant(req);
    return Object.entries(OFFLINE_ACTIONS).map(([action, v]) => ({ action, ...v }));
  });
}
