import "server-only";

/**
 * The API base URL for server-side fetches.
 *
 * In production this MUST be set via the API_URL environment variable
 * in your Vercel project (e.g. https://danav-api-gules.vercel.app).
 * In local dev it falls back to http://localhost:4100.
 *
 * Import this instead of reading process.env.API_URL directly, so the
 * production guard fires at build time rather than silently using localhost.
 */
if (!process.env.API_URL && process.env.NODE_ENV === "production") {
  throw new Error(
    "API_URL env var is not set. " +
    "Add it to your Vercel project: Settings > Environment Variables > API_URL = https://danav-api-gules.vercel.app"
  );
}

export const serverApiUrl: string = process.env.API_URL ?? "http://localhost:4100";
