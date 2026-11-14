import { z } from "zod";

const Env = z.object({
  DATABASE_URL: z.string().default("postgres://varchasv_app:varchasv_app_dev@localhost:5433/varchasv"),
  API_PORT: z.coerce.number().default(4100),
  // Comma-separated list of allowed web origins, e.g. "https://yourapp.vercel.app,https://yourapp.com"
  WEB_ORIGIN: z.string().default("http://localhost:3100"),
  SESSION_TTL_DAYS: z.coerce.number().default(30),
  NODE_ENV: z.string().default("development"),
  // 32 random bytes, base64. Encrypts stored secrets (GST portal sessions). Required in production.
  SECRETS_KEY: z.string().optional(),
  // Send email over SMTP, e.g. smtps://user:pass@smtp.example.com:465. Without it, emails go to the log.
  SMTP_URL: z.string().optional(),
  MAIL_FROM: z.string().default("Varchasv ERP <no-reply@varchasv.in>"),
  // Session cookies need HTTPS when true; defaults to on in production. Set false only to test over plain HTTP.
  COOKIE_SECURE: z.enum(["true", "false"]).optional(),
  // Requests per minute per session (or per IP when signed out) on routes without a limit of their own.
  RATE_LIMIT_PER_MINUTE: z.coerce.number().int().positive().default(600),
  // Database connections per API process. Keep it small on serverless hosts, where many instances run.
  DB_POOL_MAX: z.coerce.number().int().positive().default(10),
  // Lets a scheduler (Vercel Cron) call GET /cron/reports with "Authorization: Bearer <CRON_SECRET>".
  CRON_SECRET: z.string().min(16).optional(),
});

// Hosts that inject their own DATABASE_URL (as the database owner, e.g. the Vercel–Neon integration)
// get the app's restricted role through APP_DATABASE_URL instead.
export const env = Env.parse({ ...process.env, DATABASE_URL: process.env.APP_DATABASE_URL || process.env.DATABASE_URL });
export const isProd = env.NODE_ENV === "production";
export const secureCookies = env.COOKIE_SECURE ? env.COOKIE_SECURE === "true" : isProd;
// SECRETS_KEY encrypts stored GST portal sessions. It is optional when only local-auth is used
// and no GST portal integration is active, but should be set for any real deployment.
if (isProd && !env.SECRETS_KEY) {
  console.warn("Warning: SECRETS_KEY is not set. GST portal session encryption will be unavailable.");
}
