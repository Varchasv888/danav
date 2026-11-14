/**
 * Routes anyone may call without signing in: sign-in itself, invitations and password resets by
 * one-time token, and stateless helpers that touch no business data. Every other route must answer
 * 401 to an anonymous caller (test/security.test.ts checks all of them).
 */
export const PUBLIC_ROUTES = new Set([
  "GET /health",
  "POST /auth/signup",
  "POST /auth/login",
  "POST /auth/local-login",
  "POST /auth/logout",
  "POST /auth/password/forgot",
  "POST /auth/password/reset",
  "GET /invitations/lookup/:token",
  "POST /invitations/accept",
  "GET /meta/states",
  "POST /tools/gstin",
  "POST /tools/gst",
  // A shared catalogue: read-only, by an unguessable token that expires (services/catalogue.ts).
  "GET /public/catalogue/:token",
  "GET /public/catalogue/:token/files/:fileId",
  // A bill, invoice or statement sent on WhatsApp: read-only, by an unguessable token that expires (services/sharing.ts).
  "GET /public/documents/:token",
  // An attendance machine pushing punches (ZKTeco ADMS protocol). It carries no login: the serial number of a registered machine says which
  // business it belongs to, an unknown serial stores nothing, and only punches for people the business has enrolled change any attendance.
  "GET /iclock/cdata",
  "POST /iclock/cdata",
  "GET /iclock/getrequest",
  "POST /iclock/devicecmd",
  // A messaging provider calling back with delivery receipts and STOP replies. Each call is signed with a shared secret (services/commwebhooks.ts);
  // with no secret configured the endpoints refuse everything, and a valid call can only mark a known message delivered or failed, or opt a number out.
  "GET /webhooks/whatsapp",
  "POST /webhooks/whatsapp",
  "POST /webhooks/sms",
]);
