# UI/UX redesign progress index

Updated 7 November 2026.

## Vyapar-inspired UI pass (implementation complete; validation deferred)

The user supplied 119 feature screenshots and authorized an implementation pass for Varchasv's UI, formats, and screen structure. The scope includes Accounting and GST screens and their visible workflows. Existing tax calculations, ledger postings, APIs, permissions, and export contracts remain the authoritative behavior; this pass does not infer accounting rules from screenshots. UI testing is deferred to the later test phase as requested.

The screenshots cover the full application, not only GST. The primary dark rail lists Home, Masters, Inventory, Purchase, Sales, Transactions, Accounting, GST, CRM, Financial planning, Tax and compliance, People, Analytics, Administration, Reports, and Utilities. Selecting a section shows its subsection headings and feature links in the adjacent light panel; choosing a working feature opens its view in the main workspace. Manufacturing and Projects remain at the end as Varchasv-specific modules. Reports and Utilities own their distinct routes. Any roadmap capability without a corresponding working screen is shown as a disabled, muted **Soon** entry; it is not linked to a fake page. The supplied F1/F2 IDs stay in those labels so the user can trace them to the pipeline.

| Area | Current implementation | Remaining before this pass is complete |
|---|---|---|
| Tokens and shared controls | Dark rail tokens, subtle raised/inset/glass treatments, rounded shared controls, opaque cards, consistent headings, form fields, buttons, tables and report surfaces are in place across the existing feature screens | None for this implementation pass |
| Shell and landing | Desktop uses a dark top-level rail, adjacent light subsection/feature panel, then the selected content view; permission filtering and disabled Soon entries remain; `/dashboard` is Home | Validate desktop, tablet, and phone navigation during the later testing phase |
| Dashboard | Existing live KPIs, sales trend, cash/receivables/payables, profit, stock, CRM pipeline, approvals and alerts lead the home screen and link to source screens; no invented figures are introduced | Validate during the later testing phase |
| Registers and reports | Register grids have compact numbered rows, sortable and individually filterable columns, global search, Excel export and print action; sales date filters sit above the grid; route-specific data, totals and export schemas are intact | Validate representative screens, print output, and filter combinations during the later testing phase |
| Accounting | Chart of accounts has a category rail, counts and search; voucher entry has type tabs, balance strip and anchored action area; accounting reports use the shared page/table/control treatment. Posting and calculation behavior is unchanged. | Validate during the later testing phase; follow-up capabilities stay marked Soon |
| GST | Returns has period overview cards, section shortcuts and a GSTR-1 summary/transaction switch with category/search filters, sourced from the existing return JSON; other GST routes use the shared screen treatment. Statutory calculations and filing/export behavior are unchanged. | Validate during the later testing phase; parked GST capabilities stay marked Soon |
| Transactions, POS and print | Shared controls/cards cover transaction screens; Sales entry has phone-aware field pairs and sticky actions; Purchase entry has anchored actions; POS has its item workspace and checkout panel. Existing invoice/proforma/challan/receipt data and export formats are preserved. | Validate during the later testing phase; saved regular/thermal print settings are marked Soon because no persisted print-preference model exists |
| Tests | Deferred | User will handle test phase later; this pass is not QA-approved |

The historical phase table below describes the redesign before this new screenshot-driven pass. It is not evidence that this pass is complete.

## Phases

| Phase | State | Evidence |
|---|---|---|
| 0 Discovery validation | done | `00_DESIGN_STRATEGY.md`; routes, screens and menu checked against source; duplicates and gaps recorded |
| 1 Design system | partly | tokens, contrast fixes, elevation, glass, validated chart palette (`01_DESIGN_TOKENS.md`); DataTable, states and chart kit built; FilterBar, ObjectHeader, Editor, combobox, task inbox not yet (`06_SHARED_COMPONENTS.md`) |
| 2 Global shell | partly | module tabs with mega menu and workspace tabs built and checked; header selectors, notifications and role homes not built (`02_APPLICATION_SHELL.md`) |
| 3 Screen framework | started | DataTable and states built and used on six registers; FilterBar, ObjectHeader, Editor, combobox not built |
| 4 Benchmark modules | started | Sales registers on DataTable; GST returns Excel workings. Not started: Inventory style master, Finance ledger, POS, Procurement, Sales editors |
| 5 Remaining modules | not started | |
| 6 Business intelligence | started | `/bi` home with period presets, live headline figures, trend line and brand ranking; `/bi/kpis` dictionary (12 measures); dashboards, studio, explorer not built |
| 7 Responsive and mobile | started | phone bottom bar and module sheets, registers as cards, phone control sizes and 16px fields, paired short fields and a sticky action bar on the sales form, tablet header fix, chart sizing; most editors and POS not yet adapted |
| 8 QA | not started | no automated tests exist for the web UI; `tsc --noEmit` passes |

## Counts

- Feature specifications written: 268 of 268.
- Screens listed in the matrix: 229 of 229.
- BI specifications written: 15 of 15.
- Screens rebuilt to the new design: 2 new (`/bi`, `/bi/kpis`), 6 sales registers on DataTable, GST returns with Excel workings; shell and tokens apply to all.

## Code changed (apps/web and packages/i18n)

New: `components/MegaMenu.tsx`, `components/PasswordInput.tsx`, `components/data/DataTable.tsx`, `components/data/states.tsx`, `components/charts/Charts.tsx`, `components/gst/DownloadXlsx.tsx`, `lib/modules-nav.ts`, `lib/workspace-dirty.ts`, `lib/bi-catalogue.ts`, `lib/xlsx-export.ts`, `app/(app)/bi/page.tsx`, `app/(app)/bi/kpis/page.tsx`, `loading.tsx` in six sales register folders, `app/(app)/sales/error.tsx`. Dependency added: `exceljs` (loaded only when someone exports).
New: `components/MobileNav.tsx`. Changed: `components/sales/SalesForm.tsx` (phone field pairs, sticky action bar), `components/MegaMenu.tsx` (opens on click, not hover), `components/TabStrip.tsx` (clips its own overflow), `components/sales/SalesList.tsx`, `app/(app)/gst/returns/page.tsx`, `apps/api/scripts/seed-demo.ts` (credit overrides now carry a reason, as the API requires), `components/Shell.tsx`, `components/TabStrip.tsx`, `components/ui.tsx`, `components/accounts/VoucherForm.tsx`, `components/insights/Insights.tsx` (moved `compactRupees` to `lib/format.ts`), `lib/nav.tsx` (dropped an unneeded `"use client"` so server pages can read it), `lib/format.ts`, `app/globals.css`, login and sign-up pages, and the message files (English plus placeholders in the other languages, listed in `NEEDS-TRANSLATION.txt`).
`components/MenuBar.tsx` is no longer used; it is left in place.

## Backend dependencies recorded

Record search endpoint; scope selector (company, branch, store) in the session; notification and task aggregate; layout store for dashboards; BI measures beyond the 12 defined; footfall and floor-area data for retail measures; stage and rejection data for production analytics.

## Checks run

`tsc --noEmit` on `apps/web`: clean. Menu coverage script: 187 of 187 existing screens reachable, 0 lost. Browser checks (1440px): module menu opens by click, hover, Alt+M and closes with Esc; tabs add, pin and show the unsaved dot; BI home renders live data with the trend chart; sign-in renders; show-password toggles the field type; the invoices register (270 rows) sorts, searches, totals, remembers its view and exports; both GST workbooks generate. The exported Excel was opened with openpyxl: Arial, frozen header, filter, real dates, bracketed negatives, SUBTOTAL totals with cached values. Impeccable's design detector over the changed files: no findings.
Not run: any automated test suite, an accessibility scan, 1280, 768 or 375 px layouts, dark mode screenshots, the device app, a LibreOffice recalculation of the workbooks (its helper needs a Unix socket and cannot run on this Windows machine; cached values were checked instead).
