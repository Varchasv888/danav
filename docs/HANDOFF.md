# Handoff: read this first

Two AI tools (Claude Code and Codex) and one owner work on this repository, taking turns. This file is the shared memory. `docs/BUILD_LOG.md` is the baton passed between turns. Read both before changing anything, and update `BUILD_LOG.md` before you stop.

## 1. What this project is

Varchasv ERP Systems at `E:\varchasverp`: a multi-tenant ERP for Indian small businesses, now being shaped for one apparel distributor in Guwahati (large godown, retailers across Assam and nearby states, an accountant who files GST by hand on the portal).

| Part | Where | Notes |
|---|---|---|
| API | `apps/api` | Fastify, zod, one route file per area, business logic in `src/services` |
| Web | `apps/web` | Next.js, port 3100 |
| Device app | `apps/varchasv` | Flutter, offline first |
| Database | `packages/db` | PostgreSQL, drizzle-kit migrations, row level security on every tenant table |
| Shared rules | `packages/domain`, `packages/i18n` | GST rules, money, 12 language files |
| Docs | `docs/` | See section 2 |

GitHub: `https://github.com/kaalvakraa/varchasvesp.git`, branch `main`.

## 2. Which document answers which question

| Question | Document |
|---|---|
| What should we build, in what order, with what exit gates? | `docs/roadmap-and-build-schedule.md` (the plan; follow it) |
| What exists today, partly or not at all? | `docs/product-status-inventory.md` (dated 6 Nov 2026; update after each accepted milestone) |
| How do the distributor requirements map to the code, with acceptance criteria and the GST checklist? | `docs/distributor-brief-mapping.md` |
| What was found by the 6 Nov audit? | `docs/distributor-brief-mapping.md`, section 1, "Audit run" |
| What has changed since the baseline, and what is the next step? | `docs/BUILD_LOG.md` |
| Rules for working here | this file |
| Original product pack (static review, 4 Nov) | `docs/product-discovery/` |
| Original apparel plan | `docs/apparel-plan.md` |

If documents disagree: the roadmap wins on order and scope; `BUILD_LOG.md` wins on what changed most recently; the code wins over every document on what exists.

## 3. State at handoff (6 November 2026)

This is the original handoff snapshot. For current progress and verification, read the newest entry in `docs/BUILD_LOG.md`.

- `main` is at `3c9f571` ("Add GST manual-filing pack and distributor brief mapping"), pushed to origin.
- Uncommitted when this file was written: `docs/product-status-inventory.md`, edits to `docs/distributor-brief-mapping.md`, `docs/roadmap-and-build-schedule.md`, `docs/HANDOFF.md`, `docs/BUILD_LOG.md`, `docs/prompts/`, an added `gst_workpapers` entry in `TENANT_TABLES` (`packages/db/src/schema.ts`), the `AGENTS.md` pointer, and the untracked `docs/migration/`. `apps/web/tsconfig.tsbuildinfo` shows as modified; ignore it. Run `git status` for the truth.
- Roadmap position: **Phase 0 (product readiness) has not started.** Nothing from phases 1 to 8 is built.
- Local database: Postgres in Docker on port 5433. Migration `0127_gst_workpapers.sql` is applied locally. Other machines must run `npm run db:migrate`.

### Built on 6 November (the GST manual-filing pack)

| What | Where |
|---|---|
| Table `gst_workpapers` (typed figures, status, review hash, ARN, filing date, proof file ids) | `packages/db/src/schema.ts`, `packages/db/migrations/0127_gst_workpapers.sql` |
| GSTR-3B builder: tables 3.2, 4 (imports, ISD, reversals, reclaim, ineligible, net, shortfall), 5, 5.1, and ITC against GSTR-2B comparison | `apps/api/src/services/returns.ts` (`gstr3b`) |
| Workpaper service: save, prepared, reviewed, filed, reopen; ARN and date checks; figure hash | `apps/api/src/services/gstmanual.ts` |
| Routes `GET /gst/workpaper`, `PUT /gst/workpaper`, `POST /gst/workpaper/status` | `apps/api/src/routes/gst.ts` |
| Filing record screen | `apps/web/components/gst/ManualFiling.tsx`, `apps/web/app/(app)/gst/returns/page.tsx` |
| GSTR-1 Excel for the GSTN offline tool | `apps/web/lib/gstr1-offline.ts` |
| GSTR-2B Excel reader with preview | `apps/web/lib/gstr2b-xlsx.ts`, `apps/web/components/gst/GstWorkspace.tsx` |
| Ten tests | `apps/api/test/gstmanual.test.ts` |

**Not proven, do not claim otherwise:** the GSTR-1 workbook has not been loaded in the current GSTN offline tool; the new 3B JSON keys (3.2, 5, 5.1) and the 4(D) labels are not checked against the portal; reclaimed credit sits in 4(A)(5) pending the accountant; the 2B Excel reader has only seen a workbook made by hand. Nothing has been accepted by GSTN. Filing is manual: Varchasv prepares and records, the accountant files on the portal, and no screen may imply Varchasv filed a return.

### Known open issues

1. Three API tests failed in an earlier full run and passed alone: `test/scheduledchanges.test.ts` and the report-email case in `test/insights-crm.test.ts`. They passed in the latest full run, but the earlier intermittent cause is still unknown.
2. An audit had found 18 repeated routes across the seven main menu tabs. A current static check covered 187 active menu destinations: none is duplicated, and each maps to a Next.js page. `/pos/billing` appears once under Sales plus the launchpad shortcut.
3. Six menu entries noted in the earlier audit have no screen (fixed barcode, ledger parameter, TCS tax master, re-pack box, re-open box, TCS report). They are disabled `Soon` entries with no link, not broken destinations. The owner still needs to decide whether to build or remove them.
4. Books use the trading-account method: closing stock is computed at report time (`stockOn` in `apps/api/src/services/accounting.ts`) and is not posted to a stock account. Margin reports (`apps/api/src/services/profitability.ts`) cost goods at the item master `purchase_rate`, not lot cost. Treat today's margin as an estimate.
5. The GST portal connection and file actions remain simulator-only. They appear only in explicitly selected provider mode, which is labeled demo-only and sends nothing to GSTN. Manual mode hides the connection and filing controls. The exported files still require review in the current GSTN tool and by the accountant.

## 4. How to run things

| Task | Command |
|---|---|
| Install | `npm install` at the repo root (Node 24 or newer) |
| Database up | `npm run db:up` |
| Apply migrations | `npm run db:migrate` |
| Seed the demo business | `npm run demo:seed` |
| API dev server | `npm run dev -w @varchasv/api` (port 4100) |
| Web dev server | `npm run dev -w @varchasv/web` (port 3100) |
| API tests | `cd apps/api && npx vitest run` (all) or `npx vitest run test/<file>.test.ts` |
| Typecheck | `cd apps/api && npx tsc --noEmit`, `cd apps/web && npx tsc --noEmit` |
| After a schema change | `cd packages/db && npm run build` (the API imports the built output), then `npm run migrate` |
| Add English strings | write `{"en": {...}}` to a temp file, then `cd packages/i18n && node scripts/merge-en.cjs <file>` |
| Refresh the code graph | `graphify update .` (and `graphify query "<question>"` before grepping) |

Local test login (throwaway, local database only): `ux-review4@varchasv.test` / `UxReview2026`, business "UxReviewFour", with 270 sales invoices. Never reuse it anywhere else.

## 5. Conventions

**Code**
- Money and quantities are strings with Decimal arithmetic (`dec`, `money` from `@varchasv/domain`). Never use floating point for amounts.
- Every tenant table has `tenant_id`, row level security (`ENABLE ROW LEVEL SECURITY`, policy `tenant_isolation` using `app_tenant()`), and a grant to `varchasv_app`. After `drizzle-kit generate`, append that block by hand; copy it from the end of `packages/db/migrations/0127_gst_workpapers.sql`. Add the table to `TENANT_TABLES` in `schema.ts`.
- `gl_entries`, `stock_ledger` and `audit_log` are insert-only. Corrections are new rows.
- Write actions call `audit(...)` (`apps/api/src/lib/audit.ts`). Routes use `can("permission")` and `withTenant`.
- Errors are short codes (`badRequest("code")`, `conflict("code")`); the web side maps each code to a translated message.
- Tests use `testApp()` from `apps/api/test/helpers.ts` (`signup`, `call`). Add a test with every behaviour change, including the failure and correction paths.
- Web: server components fetch with `serverApi`; client components use `api` from `lib/client-api.ts`. UI pieces are in `components/ui.tsx`. Tables must become labelled cards on a phone; check 375px width.
- Use demo adapters (a working simulator behind one interface) for paid or external services, and mark them as simulated.

**Product**
- Varchasv is the source of truth for stock, price, credit, orders, reservations and exceptions. AI and WhatsApp only read and draft; every number shown to a person comes from a permission-checked query.
- Label figures actual, allocated, estimated or accountant-entered. Never show incomplete cost as profit.
- Converted files are staged, previewed and reconciled; a person approves; nothing posts silently.
- Do not say a feature is done because its screen or route exists. See section 6.

**Writing (the owner's standing rules)**
- No em dashes anywhere: not in code, strings, documents or replies. Use a comma, colon or full stop.
- Documents use one text size.
- Strings are English first through `merge-en.cjs`; other languages get placeholders listed in `packages/i18n/messages/NEEDS-TRANSLATION.txt`.

**Owner's standing decisions**
- Do not commit or push unless the owner says so. "Push" means commit then push.
- Ledger redesign and the choice of navigation bar design are deferred.
- G-Retail migration is paused until the owner brings a demo SQL Server backup. Do not read or print report files that may hold database credentials.
- Deletions on the hosted demo need the owner.
- Use demo data only; never record real customer data.
- No GSP: GST is filed manually by the accountant.

## 6. When is something done

A feature counts as done only when all of these are true (from the roadmap, section 12):
1. The user can complete the business action from the intended screen and role.
2. Stock, accounting and audit history change as expected.
3. Failure, partial completion, cancellation and correction paths behave as defined.
4. It has been run with realistic records, and a test covers it.
5. External services are visibly live, unavailable or simulated.
6. Reports label actual, allocated, estimated or accountant-entered figures.

Status words used in the inventory: **made** (route, screen and test), **partly built**, **still to build**. When you finish something, move it in `docs/product-status-inventory.md` only if it meets the list above, and say in `BUILD_LOG.md` what was and was not verified.

## 7. Turn-taking between tools

At the start of a turn:
1. Read this file, then the newest entries of `docs/BUILD_LOG.md`.
2. Run `git status` and `git log --oneline -10`. Anything uncommitted that `BUILD_LOG.md` does not explain was written by someone else: read the diff before building on it.
3. Run the tests for the area you will touch, so you know the starting state.
4. Say which roadmap phase and item you are taking, and which exit gate it serves.

At the end of a turn, append an entry to `docs/BUILD_LOG.md` using the template at its top: what changed, files, tests run and results, what is unverified, decisions made, and the exact next step. If you changed behaviour, update the inventory and the mapping document in the same turn.

Work on one roadmap item at a time. Do not start a phase whose earlier exit gate is open unless the owner says so. If the working tree holds someone else's unfinished work in the same files, stop and tell the owner instead of overwriting it.
