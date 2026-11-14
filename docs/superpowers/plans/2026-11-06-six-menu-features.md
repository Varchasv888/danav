# Six Menu Destinations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Fixed Barcode, Ledger Parameter, TCS Tax Master, Re-pack Box, Re-open Box, and TCS Report into complete, permission-checked workflows.

**Architecture:** Reuse the existing barcode and Form 27EQ services. Add company-scoped settings for ledger posting defaults and TCS section applicability, plus tenant-isolated packing-box records with immutable event history. Add web pages and menu routes for each destination; box operations never write stock or accounting entries.

**Tech Stack:** Next.js 16, React 19, Fastify 5, Drizzle ORM, PostgreSQL with RLS, Vitest, `@varchasv/domain`, and `@varchasv/i18n`.

**Spec:** `docs/superpowers/specs/2026-11-06-six-menu-features-design.md`

## Global Constraints

- Money and quantity math uses the existing Decimal helpers; do not use floating point for accounting values.
- Every new tenant-owned table has `tenant_id`, `company_id`, RLS, a `tenant_isolation` policy, grant to `varchasv_app`, and a `TENANT_TABLES` entry.
- Every write is permission checked and audited; cross-tenant and cross-company IDs are rejected.
- Ledger mappings affect future postings only. Historical vouchers are not edited or reposted.
- TCS statutory rates remain sourced from `TCS_SECTIONS`; company settings only enable or disable sections.
- Box lines identify an existing variant-level goods item and a positive quantity. Repack/reopen changes packaging records only and writes no stock or accounting rows.
- Keep new user-facing copy in English only; do not add or update locale files for these destinations, per the owner's 2026-11-06 clarification.
- For each behavior change, write a focused failing test, run it to confirm the expected failure, implement the smallest change, and rerun it.

## Review Focus

1. A company A mapping or box ID must never be readable or writable from company B or another tenant.
2. An archived or incompatible ledger must be rejected without partially updating mappings.
3. Disabling a TCS section must not remove or alter existing collections, and statutory rates must not be editable.
4. Empty box contents, zero/negative quantities, and invalid packed/open transitions must fail without changing the saved snapshot.
5. Concurrent barcode assignment must not replace existing codes or issue duplicates.

---

### Task 1: Fixed Barcode destination

**Files:**
- Modify: `apps/web/lib/menu.tsx`
- Modify: `apps/web/lib/modules-nav.ts`
- Create: `apps/web/app/(app)/inventory/fixed-barcode/page.tsx`
- Create: `apps/web/components/inventory/FixedBarcode.tsx`
- Modify: `apps/web/app/(app)/inventory/labels/page.tsx` (accept selected item IDs for printing)
- Test: `apps/web/test/menu-destinations.test.ts` (existing barcode API coverage remains in `apps/api/test/itemcodes.test.ts`)
- Modify: `packages/i18n/messages/*.json`

**Interfaces:**
- Consume `GET /items`, `POST /items/barcodes/generate`, and the existing label print model.
- The page lists active goods without a barcode, supports search and selection, previews selected count, assigns only the selected IDs, and provides a print action after codes are assigned.
- Existing item codes remain unchanged; code assignment remains in the existing API service.

- [x] **Step 1: Write a failing navigation test** in `apps/web/test/menu-destinations.test.ts` asserting `MODULE_HREFS` contains `/inventory/fixed-barcode`.
- [x] **Step 2: Run the test** with `cd apps/web; npx vitest run test/menu-destinations.test.ts`; expected: it fails because the destination is not registered.
- [x] **Step 3: Implement the focused page and print handoff** using the existing barcode API; do not add a second barcode generator.
- [x] **Step 4: Run the navigation test and existing barcode API tests** with `cd apps/web; npx vitest run test/menu-destinations.test.ts` and `cd apps/api; npx vitest run test/itemcodes.test.ts`; then confirm selected codes print without horizontal overflow at 375px in the browser.
- [x] **Step 5: Connect the tile** to `/inventory/fixed-barcode` and add the route to the Inventory menu column.
- [x] **Step 6: Commit the Fixed Barcode destination** with its focused tests and translations.

### Task 2: Ledger Posting Defaults

**Files:**
- Modify: `packages/db/src/schema.ts`, `packages/db/src/index.ts`, and `packages/db/migrations/meta/*`
- Create: `packages/db/migrations/0129_ledger_posting_defaults.sql`
- Create: `apps/api/src/services/ledgerparameters.ts`
- Modify: `apps/api/src/routes/accounting.ts`, `apps/api/src/services/accounting.ts`, and automatic-posting services that currently look up accounts by template key
- Create: `apps/api/test/ledgerparameters.test.ts`
- Create: `apps/web/app/(app)/masters/ledger-parameters/page.tsx`
- Create: `apps/web/components/accounts/LedgerParameters.tsx`
- Modify: `apps/web/lib/menu.tsx` and `apps/web/lib/modules-nav.ts`

**Interfaces:**
- Add `resolvePostingAccountId(tx: Tx, companyId: string, roleKey: string): Promise<string>`; it resolves a company mapping first and falls back to the existing template account.
- Add `GET /accounts/ledger-parameters` returning supported posting roles, current ledger IDs, and compatible account choices.
- Add `PUT /accounts/ledger-parameters` accepting `{ defaults: { key: string; accountId: string }[] }`; validate the full batch before writing, then audit it atomically.
- Supported roles are limited to template account keys used by automatic posting services. A target account must belong to the same company, be non-archived, and use the template role's account group.

- [x] **Step 1: Write failing service/API tests** for fallback defaults, a saved mapping used by a later sales posting, incompatible/archived accounts, permission denial, cross-company rejection, atomic batch failure, and unchanged existing vouchers.
- [x] **Step 2: Run the focused tests** with `cd apps/api; npx vitest run test/ledgerparameters.test.ts`; the missing route/service and resolver behavior failed as expected.
- [x] **Step 3: Add the RLS-protected mapping table and migration**, then implement `resolvePostingAccountId`, list/save services, and permission-checked routes.
- [x] **Step 4: Rewire automatic-posting account lookups** to resolve through the helper while retaining template fallback behavior. TCS collection posting is wired in Task 3.
- [x] **Step 5: Run the focused tests** and confirm a newly posted transaction uses the selected ledger while pre-existing vouchers remain unchanged.
- [x] **Step 6: Build the English-only Ledger Posting Defaults page** with grouped roles, current account, compatible account selector, review-before-save, and save/discard states.
- [x] **Step 7a: Link Ledger Parameter under Masters** and verify view/edit enforcement through API permission tests.
- [ ] **Step 7b: Verify view/edit roles in the browser.** The local browser connection timed out; retry when the app server is reachable.
- [x] **Step 8: Commit Ledger Posting Defaults** with the focused tests and migration. Commit `2337348` is pushed to `origin/codex/ledger-posting-defaults`.

### Task 3: TCS Tax Master and TCS Report

**Files:**
- Modify: `packages/db/src/schema.ts`, `packages/db/src/index.ts`, and `packages/db/migrations/meta/*`
- Create: `packages/db/migrations/0130_tcs_section_settings.sql`
- Modify: `apps/api/src/services/tcs.ts` and `apps/api/src/routes/tds.ts`
- Create: `apps/api/test/tcssectionsettings.test.ts`
- Create: `apps/web/app/(app)/masters/tcs-tax/page.tsx`
- Create: `apps/web/components/accounts/TcsSectionMaster.tsx`
- Create: `apps/web/app/(app)/reports/tcs/page.tsx`
- Create: `apps/web/components/accounts/TcsReport.tsx`
- Modify: `apps/web/components/accounts/TdsExtras.tsx`, `apps/web/lib/menu.tsx`, and `apps/web/lib/modules-nav.ts`

**Interfaces:**
- Add company-scoped section preference storage for each `TCS_SECTIONS` code; an unset preference defaults to enabled to preserve current behavior.
- Add `GET /tcs/section-settings` returning each statutory section with `enabled`; add `PUT /tcs/section-settings` accepting the complete `{ enabledSections: string[] }` list and auditing the change.
- Keep `GET /tcs/sections` as the enabled section list consumed by collection entry.
- Consume Task 2's `resolvePostingAccountId(tx, companyId, "tcs_payable")` when posting TCS collections so the Ledger Posting Default applies to future TCS vouchers.
- The report page reads existing `/tcs/27eq?fy=...&quarter=...`; do not duplicate return calculations or CSV generation.

- [x] **Step 1: Write failing settings tests** for defaults, enable/disable, rate immutability, tenant and company isolation, permission denial, existing collections surviving a disable, and TCS posting-default integration.
- [x] **Step 2: Run `cd apps/api; npx vitest run test/tcssectionsettings.test.ts`** and confirm the new endpoint behavior fails before implementation.
- [x] **Step 3: Add the RLS-protected settings table and service/routes**, deriving all rates and section labels from `TCS_SECTIONS`.
- [x] **Step 4: Run the focused settings tests** and confirm the TCS collection form receives only enabled sections.
- [x] **Step 5: Add the English-only TCS Tax Master page** with read-only statutory rates and audited company applicability toggles.
- [x] **Step 6: Add the standalone English-only TCS Report page** with FY/quarter selectors, collection/challan totals, warnings, and existing CSV downloads.
- [x] **Step 7a: Link TCS Tax Master under Masters and TCS Report under Finance reports; verify API permissions and menu routes.**
- [ ] **Step 7b: Verify both screens at 375px and with view/edit roles in the browser.** Retry when the local browser can reach the app server.
- [x] **Step 8: Commit TCS Tax Master and TCS Report** with the focused tests and migration. Commit `b15206f` is pushed to `origin/codex/ledger-posting-defaults`.

### Task 4: Re-pack Box and Re-open Box records

**Files:**
- Modify: `packages/db/src/schema.ts`, `packages/db/src/index.ts`, and `packages/db/migrations/meta/*`
- Create: `packages/db/migrations/0131_packing_boxes.sql`
- Create: `apps/api/src/services/packingboxes.ts`
- Create: `apps/api/src/routes/packingboxes.ts`
- Modify: `apps/api/src/app.ts`
- Create: `apps/api/test/packingboxes.test.ts`
- Create: `apps/web/app/(app)/inventory/repack-box/page.tsx`
- Create: `apps/web/app/(app)/inventory/reopen-box/page.tsx`
- Create: `apps/web/components/inventory/PackingBoxes.tsx`
- Create: `apps/web/app/(print)/print/box-label/[id]/page.tsx`
- Modify: `apps/web/lib/menu.tsx` and `apps/web/lib/modules-nav.ts`

**Interfaces:**
- Add `packing_boxes` (company, code, status, timestamps), `packing_box_lines` (box, item, positive quantity), and append-only `packing_box_events` (actor, operation, per-box sequence, reason, before/after contents, timestamp), all tenant scoped with RLS. Sequence is assigned while holding the parent box lock so history order is stable under concurrent requests.
- Add `GET /packing-boxes/companies` (inventory-view permission, minimal company fields for inventory pages and labels), `GET /packing-boxes`, `GET /packing-boxes/:id`, `POST /packing-boxes`, `POST /packing-boxes/:id/repack`, and `POST /packing-boxes/:id/reopen`.
- `repack` requires an open box and a non-empty list of active goods item IDs with positive quantities, atomically replaces lines, records before/after history, and marks the box packed. `reopen` requires a packed box and a reason of at least three characters, changes status to open, and records history.
- Generate stable human-readable box codes using the existing company number-series conventions. Label output shows business, box code, status, and variant item/quantity contents.
- No box endpoint writes `stock_ledger`, vouchers, invoices, or stock quantities.

- [x] **Step 1: Write failing service/API tests** for create, pack/repack, reopen, invalid state transitions, invalid line quantities/items, audit history, tenant/company isolation, and no stock-ledger/on-hand change.
- [x] **Step 2: Run `cd apps/api; npx vitest run test/packingboxes.test.ts`** and confirm the new record/workflow behavior fails before implementation.
- [x] **Step 3: Add RLS tables and the number-series-backed service/routes**, writing operation history in the same transaction as content changes.
- [x] **Step 4: Run the focused tests** and verify stock position and ledger row counts are unchanged before and after create, repack, and reopen.
- [x] **Step 5: Add create/repack/reopen screens and printable box labels**, using variant search and quantity entry.
- [x] **Step 6a: Link both actions under Transaction > Other and Inventory > Stock; verify menu route coverage.**
- [ ] **Step 6b: Verify the complete flow at 375px with authorized and read-only roles in the browser.** Attempted; the local app returns 500 at `/` because the Next/Turbopack CSS worker exits before connection. Inventory-only permission coverage passes in API tests; retry the visual flow when the server starts cleanly.
- [ ] **Step 7: Commit Re-pack Box and Re-open Box** with the focused tests and migration.

### Task 5: Whole feature verification and documentation

**Files:**
- Modify: `docs/product-status-inventory.md`
- Modify: `docs/distributor-brief-mapping.md`
- Modify: `docs/BUILD_LOG.md`
- Update: `graphify-out/` through Graphify's updater

- [x] **Step 1: Run focused API tests** for barcode, ledger defaults, TCS section settings, and packing boxes; record the exact results (6, 8, 6, and 5 tests passed, respectively).
- [ ] **Step 2: Run the repository test suite, database migration/build checks, API and web typechecks/builds, and `npm run i18n:check`.**
- [ ] **Step 3: Exercise all six routes in the browser** at desktop and 375px widths; check permissions, saved records, print output, labels, and no console errors.
- [ ] **Step 4: Run `graphify update .`** after code changes and verify the new routes, services, and tables appear in graph queries.
- [ ] **Step 5: Update the status inventory and distributor mapping**, and append the build-log entry with tests, verified behavior, limitations, and the next roadmap gate.
- [ ] **Step 6: Review the final diff, commit the feature changes, and push the authorized branch.**
