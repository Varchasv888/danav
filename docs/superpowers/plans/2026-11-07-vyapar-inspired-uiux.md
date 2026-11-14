# Varchasv UI/UX replication implementation plan

> **For agentic workers:** Implement inline in this worktree from the approved screenshot-derived spec. Tests are expressly deferred by the user for a later phase.

**Goal:** Apply the supplied feature-screen reference across Varchasv's shared shell, dashboard, registers, reports, transaction screens, accounting/GST workspaces, and print/document settings.

**Architecture:** Retain the current Next.js App Router, APIs, domain calculations, routes, permission checks, and database. Build on the existing design tokens and shared components; create or refine common screen patterns, then adopt them in the relevant feature groups. Use existing dashboard and accounting/GST data sources only.

**Tech Stack:** Next.js 16.3.7 App Router, React, TypeScript, Tailwind CSS 4, next-intl (English copy for this pass), Lucide icons, existing domain/API packages.

**Spec:** `docs/superpowers/specs/2026-11-07-vyapar-inspired-uiux-spec.md`; visual evidence: 119 PNG screenshots in the user-supplied RAR.

## Global Constraints

- Preserve route paths, server/API contracts, permissions, accounting ledgers/postings, tax calculations, and export schemas.
- Use Varchasv branding and existing semantic tokens. No Vyapar logo, mascot, icon set, font, or promotional copy.
- English only. Do not build premium-only features.
- Keep glass and soft shadows subtle; dense data surfaces remain opaque, high-contrast, and keyboard-visible.
- Do not add or run tests in this pass. The user explicitly deferred testing.
- Stage only intended project source/docs. Do not commit the installed recovery binary or extracted reference screenshots.

## Review Focus

- Permission-filtered navigation still reaches all existing menu routes; keep current authorization filtering intact.
- Missing API values render as unavailable/empty, never as fabricated zero values.
- GST/accounting report filters and view toggles do not mutate calculations or export schemas.
- Print preview settings affect only presentation and do not alter document totals or tax fields.
- Responsive shell keeps the main action and primary information visible without horizontal viewport overflow.

---

### Task 1: Reference coverage and token foundation

**Files:** `apps/web/app/globals.css`, `docs/ui-ux-redesign/01_DESIGN_TOKENS.md`, `docs/ui-ux-redesign/PROGRESS.md`, this spec.

- [x] Add semantic tokens for subtle raised surfaces, inset controls, glass overlays, and dashboard accents using the existing Varchasv palette.
- [x] Apply no global glass layer; use opaque surfaces for tables/forms and keep focus/border/status tokens visible.
- [x] Record the user screenshot groups and exclusions in the redesign documentation.

### Task 2: Shared app shell and first screen

**Files:** `apps/web/components/Shell.tsx`, `MobileNav.tsx`, `TabStrip.tsx`, `MegaMenu.tsx`, `lib/nav.tsx`, landing/login redirect pages.

- [x] Reshape the shared shell into a compact header, dark top-level section rail, adjacent light subsection/feature list, and main feature workspace while preserving tenant switching, working date, theme, permission filtering, search, create, lock, and logout behavior.
- [x] Set the default post-login/home destination to `/dashboard`; retain direct routes and browser history.
- [x] Ensure the same feature map is available on mobile through the existing mobile navigation pattern.

### Task 3: Analytics-first dashboard

**Files:** `apps/web/app/(app)/dashboard/page.tsx`, dashboard chart/shared dashboard components, English message file if keys change.

- [x] Recompose existing live dashboard data into a KPI strip, sales/profit summary, cash/receivable/payable summary, inventory/approval exceptions, and top entities.
- [x] Add period/scope controls only when their selected scope exists in the API; do not fake unavailable branch data.
- [x] Link each summary to its source register/report.

### Task 4: Shared register, report, and empty-state pattern

**Files:** `components/data/DataTable.tsx`, `components/ui.tsx`, report components/routes, loading/empty/error states.

- [x] Standardize title/actions, period/company filters, view controls, export/print actions, table density, total strip, and empty-state placement using existing shared and route-specific components.
- [x] Apply the shared presentation to GST, finance, inventory, sales, purchase, and account-report screens represented in the reference archive.
- [x] Preserve each route's server-provided data and filter semantics.

### Task 5: Accounting and GST workspaces

**Files:** `components/accounts/*`, `components/gst/*`, account/GST report routes, relevant shared report components.

- [x] Align chart of accounts, journal entry, trial balance, balance sheet, P&L, day book/account statements, GSTR-1/3B/2B, HSN, GST settings, and error views to the reference's filter/summary/detail flow using shared patterns; add custom summary/detail presentation where supported.
- [x] Add visible summary/transaction mode and classification/error chips only where existing data supports them.
- [x] Preserve domain posting/tax functions, ledger mappings, and JSON/XLSX contract.

### Task 6: Transaction entry and POS

**Files:** `components/sales/SalesForm.tsx`, purchase forms, voucher forms, POS screens/receipt, transaction register routes.

- [x] Standardize document metadata, party/item selection, line grid, totals/payment panel, notes, and sticky save/print/share actions across Sales, Purchase, vouchers, and POS.
- [x] Match reference keyboard/action discoverability where Varchasv already supports the corresponding action; do not claim unsupported shortcuts.
- [x] Keep current validations and service/API calls.

### Task 7: Print setup and document preview

**Files:** `components/print/PrintSetup.tsx`, `TaxDocument.tsx`, `ChallanDocument.tsx`, invoice/quotation/challan print routes, POS `ReceiptView.tsx`.

- [x] Keep currently supported paper-size previews available; mark saved regular/thermal template, paper/orientation, color, and field-visibility settings as Soon because there is no persisted print-preference model.
- [x] Do not introduce a fake settings form; retain the existing document preview and print actions.
- [x] Preserve English-only copy, current tax calculations, document data, and print dimensions.

### Task 8: Feature adoption, progress record, and commit/push

**Files:** relevant remaining existing module screen components; `docs/ui-ux-redesign/PROGRESS.md`; this spec/plan.

- [ ] Ensure the redesigned shared shell and patterns cover all existing routes from the screenshot-represented feature groups.
- [ ] Record unimplemented screens, unavailable API fields, and presentation assumptions as gaps; do not silently omit them.
- [ ] Review staged files to exclude screenshots, local Wakaru files, unrelated untracked material, and demo business data.
- [ ] Commit the completed UI/UX changes and push the feature branch, as authorized.
