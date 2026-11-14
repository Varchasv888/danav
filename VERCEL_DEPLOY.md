# Vercel Deployment Guide

This monorepo deploys as **two separate Vercel projects** — one for the API and one for the web app.
Both must be deployed; the web app calls the API at runtime.

---

## Prerequisites

- A [Vercel account](https://vercel.com)
- A PostgreSQL database — **[Neon](https://neon.tech)** is recommended (free tier works).
  After creating a Neon database, note the two connection strings:
  - **Owner URL** (for running migrations): `DATABASE_OWNER_URL`
  - **App URL** (RLS-enforced, for the API): `DATABASE_URL`

---

## Step 1 — Run database migrations

Migrations must be run once before first deployment.

```bash
# From the repo root:
DATABASE_OWNER_URL="postgres://owner_user:pass@host/dbname" npm run db:migrate
```

If using Neon, use the **owner** role connection string here.
Your Neon dashboard shows both roles under "Connection details".

---

## Step 2 — Deploy the API project

1. Go to [vercel.com/new](https://vercel.com/new) → **Import Git Repository** → select this repo.
2. Vercel will ask "which project?" — set the **Root Directory** to `apps/api`.
3. Vercel auto-detects `vercel.json`; click **Deploy** once to get the URL (it will fail without env vars — that's fine).
4. Under **Project Settings → Environment Variables**, add:

| Variable | Value | Notes |
|---|---|---|
| `DATABASE_URL` | `postgres://app_user:pass@host/dbname` | App role (RLS enforced) |
| `WEB_ORIGIN` | *(leave blank for now — fill after Step 3)* | Your web app URL |
| `SESSION_TTL_DAYS` | `30` | Session length in days |
| `SECRETS_KEY` | *(generate below)* | Optional but recommended |
| `NODE_ENV` | `production` | |

**Generate SECRETS_KEY:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

5. After saving env vars, **Redeploy** the API project.
6. Copy the final API URL, e.g. `https://varchasv-api.vercel.app`.

---

## Step 3 — Deploy the Web project

1. Go to [vercel.com/new](https://vercel.com/new) → **Import Git Repository** → same repo.
2. Set **Root Directory** to `apps/web`.
3. Click **Deploy** once to get the URL (may fail without env vars).
4. Under **Project Settings → Environment Variables**, add:

| Variable | Value | Notes |
|---|---|---|
| `API_URL` | `https://varchasv-api.vercel.app` | The API URL from Step 2 |
| `NODE_ENV` | `production` | |

5. **Redeploy** the web project.
6. Copy the final web URL, e.g. `https://varchasv-web.vercel.app`.

---

## Step 4 — Connect them together

1. Go back to the **API project** on Vercel.
2. Under **Environment Variables**, set `WEB_ORIGIN` to your web URL:
   `https://varchasv-web.vercel.app`
3. **Redeploy** the API once more.

Both projects are now connected. Visit your web URL to sign in.

---

## Login credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Master** | `master@store.local` | `Master@2024` | Full year-round data |
| **Staff** | `staff@store.local` | `Staff@2024` | Today's data only; master must be signed in |

> **Staff login rule:** Staff can only sign in while the master account has an active session in the database. If the master logs out, staff cannot log in again until the master signs in first.

---

## Environment Variables Reference

### API project (`apps/api`)

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string (app role, RLS enforced) |
| `WEB_ORIGIN` | ✅ Yes | Web app URL for CORS (comma-separated for multiple) |
| `NODE_ENV` | ✅ Yes | Set to `production` |
| `SESSION_TTL_DAYS` | No | Default: `30` |
| `SECRETS_KEY` | Recommended | 32-byte base64 key for GST session encryption |
| `SMTP_URL` | No | e.g. `smtps://user:pass@smtp.example.com:465` |
| `MAIL_FROM` | No | Default: `Varchasv ERP <no-reply@varchasv.in>` |
| `CRON_SECRET` | No | Secret for Vercel Cron scheduled reports |

### Web project (`apps/web`)

| Variable | Required | Description |
|---|---|---|
| `API_URL` | ✅ Yes | API project URL |
| `NODE_ENV` | ✅ Yes | Set to `production` |

---

## Troubleshooting

**"Staff login unavailable"** — The master account must be signed in first. Sign in as master, then staff can log in.

**API returns 500 on first request** — The `local_role` column migration runs automatically on first API boot. If the first request fails, retry; subsequent requests will succeed.

**CORS errors** — Make sure `WEB_ORIGIN` in the API project exactly matches your web app URL (no trailing slash).

**Build fails: "Cannot find module"** — Make sure `installCommand` runs from the monorepo root (`cd ../.. && npm ci`). Vercel's root directory setting must be `apps/api` or `apps/web`, not the repo root.
