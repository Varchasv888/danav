# 00 Executive summary

Varchasv ERP product discovery. Baseline date: 4 November 2026. Repository: `E:\varchasverp` (commit history up to `e2f015e`, local). This is a read-only discovery: no application code or configuration was changed to produce it.

## How to read this set

Fourteen numbered files plus [PROGRESS.md](PROGRESS.md). Every feature has a stable ID of the form `MOD-NNN` (for example `SAL-025`). The same ID is used in files 01, 02, 03, 06, 07, 08, 10 and 12. IDs are assigned once in this baseline, in route-file order inside each module; a feature added later gets the next free number and an ID is never reused.

Evidence labels used throughout:

- **[F] Fact**: read directly from a repository file (route registration, schema, page, test, comment). The file and line or symbol is cited.
- **[I] Inference**: a conclusion drawn from facts (for example the purpose of a feature from its route names). Always marked.
- **[Q] Question**: something the repository cannot answer; collected in file 13.

What this discovery could not do: it did not run the application, so no screen was looked at in a browser and no runtime behaviour was exercised. Statuses are derived from static evidence (routes, screens, tests) plus the plan document, and the rules are written in file 10. Visual quality, performance and real-device behaviour are therefore out of scope and are flagged where they matter.

## Product at a glance [F]

Varchasv ERP is a multi-tenant ERP for Indian small and mid-size businesses, built first for apparel, footwear and general retail and wholesale. It is one monorepo with three clients of one API.

| Part | What it is | Size (counted) |
|---|---|---|
| API | Fastify + zod, one route file per area, services hold the business logic | 749 routes in 80 route files; 100 service files (18,975 lines) |
| Web app | Next.js app (grouped sidebar launcher, keyboard-first screens, print pages) | 229 screens (9,948 lines in page files); 18 print pages; 262 menu tiles |
| Device app | Flutter, offline first, encrypted local database, outbox sync | 57 Dart files (6,828 lines); 20 local tables; 9 offline operation kinds |
| Database | PostgreSQL with row level security on every tenant table | 197 tables, 2643 columns, 127 migrations, 198 names under RLS |
| Shared rules | TypeScript domain package with a Dart port and shared fixtures | 33 domain modules; 18 written lifecycles |
| Languages | Message files | 12 files (en complete; others partial, see file 11) |
| Tests | API, domain and device tests | 663 API tests in 119 files; 56 domain tests; 86 Dart tests |

## Modules [F]

| Code | Module | Features | Routes | Screens calling it | Tables |
|---|---|---|---|---|---|
| FIN | Accounting and Finance | 36 | 60 | 80 | 21 |
| TAX | GST, TDS and Statutory Compliance | 21 | 73 | 14 | 16 |
| BNK | Banking | 5 | 28 | 5 | 10 |
| SAL | Sales and Wholesale | 32 | 85 | 52 | 27 |
| POS | Counter, Retail and Service Desk | 32 | 92 | 19 | 23 |
| PUR | Purchasing | 6 | 18 | 8 | 7 |
| INV | Inventory and Masters of Stock | 30 | 90 | 75 | 24 |
| MFG | Manufacturing and Job Work | 5 | 22 | 8 | 7 |
| HR | People, Attendance and Payroll | 20 | 79 | 17 | 16 |
| EXP | Expenses | 3 | 18 | 10 | 3 |
| PRJ | Projects and Timesheets | 2 | 19 | 4 | 5 |
| CRM | CRM and Communications | 21 | 36 | 8 | 7 |
| AST | Fixed Assets | 1 | 14 | 5 | 5 |
| RPT | Reports and Analytics | 16 | 25 | 15 | 1 |
| AI | Assistant, Chat and Notes | 2 | 8 | 2 | 1 |
| SEC | Security, Settings and Administration | 30 | 73 | 165 | 24 |
| SYN | Offline Sync | 6 | 9 | 2 | 0 |

Module boundaries are a documentation device. The code is organised by route file and service file, not by these 17 codes; file 01 shows how route files map to modules, and a table is assigned to the module whose services touch it most (file 06).

## Implementation status [F, derived by rule in file 10]

| Status | Features |
|---|---|
| FULLY IMPLEMENTED | 230 |
| PARTIALLY IMPLEMENTED | 8 |
| UI ONLY | 0 |
| BACKEND ONLY | 26 |
| DEMO / PLACEHOLDER | 4 |
| DOCUMENTED ONLY | 0 |
| NOT IMPLEMENTED | 0 |
| UNKNOWN | 0 |

By module (first five statuses; the last three are used for plan items in file 10):

| Module | FULLY IMPLEMENTED | PARTIALLY IMPLEMENTED | UI ONLY | BACKEND ONLY | DEMO / PLACEHOLDER |
|---|---|---|---|---|---|
| FIN | 36 | 0 | 0 | 0 | 0 |
| TAX | 17 | 1 | 0 | 1 | 2 |
| BNK | 4 | 1 | 0 | 0 | 0 |
| SAL | 27 | 1 | 0 | 3 | 1 |
| POS | 30 | 0 | 0 | 2 | 0 |
| PUR | 6 | 0 | 0 | 0 | 0 |
| INV | 28 | 2 | 0 | 0 | 0 |
| MFG | 5 | 0 | 0 | 0 | 0 |
| HR | 17 | 1 | 0 | 2 | 0 |
| EXP | 3 | 0 | 0 | 0 | 0 |
| PRJ | 2 | 0 | 0 | 0 | 0 |
| CRM | 12 | 2 | 0 | 6 | 1 |
| AST | 1 | 0 | 0 | 0 | 0 |
| RPT | 16 | 0 | 0 | 0 | 0 |
| AI | 2 | 0 | 0 | 0 | 0 |
| SEC | 21 | 0 | 0 | 9 | 0 |
| SYN | 3 | 0 | 0 | 3 | 0 |

The large "fully implemented" count means: the feature has routes, at least one screen that calls them, and at least one automated test that calls them. It does not mean the feature is complete against a real customer's needs; file 12 lists the gaps.

## What stands out [F unless marked]

1. **Breadth is high and consistent.** 233 of 268 features have all three of route, screen and test. The accounting spine (vouchers, bill settlement, trial balance, P&L, balance sheet, GST, TDS, bank reconciliation, period close and year end) is present end to end.
2. **Data integrity is treated as a first-class feature.** Append-only ledgers (`gl_entries, recon_events, relabels, report_snapshots, stock_ledger, sync_changes`) enforced by grants, a tamper-evident audit chain, a voucher balance trigger (`gl_voucher_balanced`), ten integrity checks on `/reports/integrity`, row level security on every tenant table (a test asserts every `tenant_id` table has it; `users`, `sessions` and `password_resets` are the only schema tables without it, see file 06).
3. **Offline is designed per action, not assumed.** `OFFLINE_ACTIONS` in `packages/domain/src/offline.ts` declares each action allowed, read-only or online-only; a test asserts every sync operation kind is declared. The device database is encrypted (SQLCipher) and refused changes are shown to the user.
4. **Every outside service is behind an adapter and is a demo today.** GST portal (GSP), bank feed, SMS and push, WhatsApp and receipt reading have simulator or demo implementations. Only WhatsApp Cloud and Claude receipt reading have real implementations switched on by environment variables. See files 09 and 12.
5. **The menu promises more than the product has built.** 23 of 262 menu tiles are marked "Soon" and have no screen (file 11). Several of them are covered indirectly by other screens (file 10 lists which).
6. **Language coverage is English first.** English is complete; the other eleven message files carry far fewer keys (file 11). This is a decision recorded in the plan (strings are English only from 3 November 2026, translated later).
7. **Authorisation is by permission, with two extra layers.** 700 of 749 routes carry an explicit `can/canAny/canAll` guard; 20 are public by design (`apps/api/src/lib/public-routes.ts`); 29 have no parsed guard (listed in file 07 for review). 5 routes require step-up authentication. Store scope (`plugins/storescope.ts`) limits a member to chosen warehouses.
8. **Product is not yet ready for unattended production use** [I]: all external connectors are demo, the AI assistant is rule based plus optional model call, there is no job queue (an in-process 60 second scheduler plus cron endpoints), and the architecture questions in file 13 (single region, edge gateway) are open.

## Where the product is thin [F, then I]

- Phase C (apparel manufacturing depth: fabric rolls, cut orders, bundle tickets, quality, actual costing), Phase O/W (order availability and warehouse management), Phase M (merchandising), Phase N (network and channels), Phase I (intelligence) and Phase T (traceability) are **documented in the plan but not built**; file 10 records which were checked for absence by searching the code.
- Reconciliation exists as separate engines per area (bank, GST, gateway, job worker, consignment). One workbench exists (`/accounts/reconciliation`) but the others have not been moved onto it (plan item D1).
- Reports are many and fixed. The report builder and saved layouts exist but the "saved layout, column chooser, filter on every attribute" parity item (R24) is partial.

## Document index

| File | Contents |
|---|---|
| [01_MODULE_HIERARCHY.md](01_MODULE_HIERARCHY.md) | Modules, route files, features, and the navigation tree of the app |
| [02_FEATURE_CATALOG.md](02_FEATURE_CATALOG.md) | All 268 features with routes, permissions, services, tables, screens and tests |
| [03_SCREEN_CATALOG.md](03_SCREEN_CATALOG.md) | All 229 web screens, 18 print pages, the device app screens and the menu tiles |
| [04_WORKFLOW_CATALOG.md](04_WORKFLOW_CATALOG.md) | End to end workflows with Mermaid diagrams and the written lifecycles |
| [05_MASTER_DATA_CATALOG.md](05_MASTER_DATA_CATALOG.md) | Masters, their fields, where they are maintained and who uses them |
| [06_DATA_AND_API_MAP.md](06_DATA_AND_API_MAP.md) | All 197 tables and all 749 API routes |
| [07_ROLES_AND_PERMISSION_MATRIX.md](07_ROLES_AND_PERMISSION_MATRIX.md) | Permission grid, system roles, special rights, step-up, store scope |
| [08_REPORTS_AND_ANALYTICS.md](08_REPORTS_AND_ANALYTICS.md) | Every report, dashboard, register and print output |
| [09_OFFLINE_AND_SYNC.md](09_OFFLINE_AND_SYNC.md) | Offline rules, sync protocol, device storage, connectors |
| [10_IMPLEMENTATION_STATUS.md](10_IMPLEMENTATION_STATUS.md) | One status and its evidence for every feature and plan item |
| [11_UI_UX_AUDIT.md](11_UI_UX_AUDIT.md) | Static audit of navigation, screens, accessibility, language |
| [12_GAPS_AND_FUTURE_OPPORTUNITIES.md](12_GAPS_AND_FUTURE_OPPORTUNITIES.md) | Gaps, risks and opportunities, facts separated from inference |
| [13_OPEN_QUESTIONS.md](13_OPEN_QUESTIONS.md) | What the repository cannot answer |
