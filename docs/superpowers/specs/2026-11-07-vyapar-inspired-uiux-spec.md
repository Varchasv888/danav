# Varchasv ERP feature-screen redesign

Date: 7 November 2026

## Intent

Use the 119 supplied Vyapar screenshots as a feature-by-feature reference for Varchasv's navigation, registers, reports, accounting/GST screens, transaction entry, POS, print setup, and document formats. On login, land on a useful, information-rich analytics dashboard. Rework screen composition and interaction patterns across the existing feature set while retaining Varchasv's domain model, authorization, routes, and identity.

## Direction

- Use a persistent dark, compact left navigation rail with grouped feature links and contextual second-level navigation where a feature has a long report/settings list.
- Use a light main workspace, compact business/date/action header, clear page title/action row, filter region, and full-width working area.
- Make registers dense and scannable: period/company filters, export/print actions, table summary, transaction/detail view where appropriate, strong numeric alignment, and explicit empty/loading/error states.
- Make data-entry screens task-focused: document header, keyboard-friendly item grid, totals/payment panel, and a stable save/share/print action area.
- Dashboard first: show only figures available from Varchasv APIs, with sales, cash/bank, receivables/payables, profit, stock, approvals, and actionable exceptions. Every KPI drills into its source screen. Do not invent values or imply missing data is zero.
- Use Varchasv brand tokens and assets. Add very subtle glass treatment to overlays and selected dashboard surfaces, and restrained raised/inset shadows to a few cards and controls. Keep forms and dense reports opaque, high-contrast, and readable. Neumorphism/glass never carries information by itself or replaces focus, border, or status cues.
- Keep English-only UI and print labels. Do not copy Vyapar's logo, mascot, icons, licensed fonts, or marketing copy. Do not expose premium upsells or reproduce premium-only workflows.

## Reference coverage from `vyapar uiux.rar`

| Screenshot group | Features/patterns observed |
|---|---|
| 365–395 | Report navigation, trial balance, balance sheet, P&L, GST return/report tables, chart of accounts, journal entry, account statement |
| 396–409 | Item import, Tally import, bulk updates, close books, cash/bank, cheque, loan account views |
| 410–429 | Purchase bill/order, payment-out, expense, sale invoice, quotation/proforma, payment-in, sales order, delivery challan, debit/credit note registers and forms |
| 430–434 | Counter POS, item master, party/account views, WhatsApp connection |
| 435–458 | GST and finance report filters, summaries, detail/transaction views, empty states and report exports |
| 459–474 | Transaction settings and regular/thermal print-template selection, preview, layout/color controls, field visibility, paper size/orientation |
| 475–480, 482 | GST/tax settings, transaction messages, party/item settings, accounting settings |
| 481, 483 | Premium service reminders and multi-currency upsell. Excluded from replication. |

These screenshots establish visible structure and labels only. They do not prove a statutory calculation, accounting posting, or export schema. Preserve existing Varchasv accounting/GST computation and posting rules in this UI pass; change screen flows and visible interaction behavior, and log any business-rule discrepancy instead of silently inferring it from a screenshot.

## Scope

- Shared token and component update, app shell/navigation, app landing, dashboards, register/report layouts, transaction forms, accounting/GST pages and settings, print preview/settings, and feature-route adoption.
- Keep route paths, permissions, APIs, persisted records, ledger defaults, statutory formulas, posting order, export schema, and existing document math stable unless a purely presentational adapter is needed.
- No backend or database migration. No premium workflows. No test additions or test runs in this implementation pass; the user will handle testing in later phases.
- No pixel-perfect claim: viewport-matched screenshot measurements and golden output files are not supplied. Use supplied screenshots for structure and relative emphasis, record assumptions, and leave exact tolerance validation for the later test phase.

## Feature navigation and coverage

- The feature rail is the source of screen discovery on desktop; the phone sheets use the same module catalogue.
- The dark primary rail contains Home, Masters, Inventory, Purchase, Sales, Transactions, Accounting, GST, CRM, Financial planning, Tax and compliance, People, Analytics, Administration, Reports, and Utilities. Reports and Utilities are distinct sections. Varchasv-only Manufacturing and Projects remain available after the requested list. Clicking a primary section changes the adjacent subsection/feature list; choosing a working feature opens its screen in the main workspace. Missing screens stay disabled and marked Soon.
- Features in the supplied A–F register that do not have a corresponding screen are shown as disabled, muted “Soon” entries with their feature ID. They do not navigate to a placeholder page or imply that the backend feature exists.
- The F1 items 71–109 and the open F2 follow-ups are represented in the feature catalogue. As implementations land, their disabled entry should be replaced by the live screen in the same module.
- Print preference editing remains a recorded gap because Varchasv has no persisted print-template preference model. Existing invoice, proforma, challan and receipt formats retain their current data and output behavior in this UI-only pass.

## Acceptance for this implementation pass

- After sign-in, `/dashboard` is the default landing and uses live Varchasv figures, not fabricated demo values.
- The shared shell provides visible, permission-aware access to existing screens and remains usable on desktop/tablet/phone.
- GST/accounting screens represented in the references use a consistent filter → summary/detail → export/print interaction pattern; existing GST and accounting calculations remain intact.
- Transaction entry retains existing APIs and calculations while making party/document metadata, item entry, totals, and actions clear and consistent.
- Existing print previews continue to use their supported paper sizes and current document data. Saved regular/thermal template configuration is marked Soon until a persisted print-preference model exists; no fake settings screen is introduced.
- Glass and raised shadows remain subtle and do not reduce table, form, status, or keyboard-focus contrast.
- Tests are deferred as explicitly requested; this pass must not be described as QA-approved.
