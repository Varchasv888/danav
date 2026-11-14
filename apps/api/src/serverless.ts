import type { IncomingMessage, ServerResponse } from "node:http";
import { createRuntime } from "./runtime.js";

// Built once per function instance and reused by every request it serves.
const ready = createRuntime().then(async (r) => {
  await r.app.ready();
  return r.app;
});

/** Node request handler for serverless hosts (Vercel): hands the raw request to Fastify. */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const app = await ready;
  app.server.emit("request", req, res);
}
