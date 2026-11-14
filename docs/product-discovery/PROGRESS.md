# Discovery progress index

Updated 4 November 2026. Every module and every document is listed so nothing is skipped silently.

## Documents

| File | State | Basis |
|---|---|---|
| 00 Executive summary | complete | Generated from the model; narrative written by hand |
| 01 Module hierarchy | complete | Route files, features, menu tree |
| 02 Feature catalog | complete | 268 features |
| 03 Screen catalog | complete | 229 screens, 18 print pages, device screens, Soon tiles |
| 04 Workflow catalog | complete | 20 workflows, 18 lifecycles |
| 05 Master data catalog | complete | 10 master groups; every column listed |
| 06 Data and API map | complete | 197 tables, 749 routes |
| 07 Roles and permission matrix | complete | Catalogue, 8 roles, guards, step-up, public, unguarded |
| 08 Reports and analytics | complete | Screens, routes, dashboards, prints, exports |
| 09 Offline and sync | complete | Rules, protocol, storage, connectors |
| 10 Implementation status | complete | Features, Soon tiles, plan items |
| 11 UI/UX audit | complete (static only) | Visual pass not done |
| 12 Gaps and opportunities | complete | Facts and inference separated |
| 13 Open questions | complete | 31 questions |

## Modules covered

| Module | Features | Routes | Screens | Tables | Status counts |
|---|---|---|---|---|---|
| FIN Accounting and Finance | 36 | 60 | 80 | 21 | Fully 36 |
| TAX GST, TDS and Statutory Compliance | 21 | 73 | 14 | 16 | Fully 17, Partially 1, Demo 2, Backend 1 |
| BNK Banking | 5 | 28 | 5 | 10 | Fully 4, Partially 1 |
| SAL Sales and Wholesale | 32 | 85 | 52 | 27 | Fully 27, Partially 1, Backend 3, Demo 1 |
| POS Counter, Retail and Service Desk | 32 | 92 | 19 | 23 | Fully 30, Backend 2 |
| PUR Purchasing | 6 | 18 | 8 | 7 | Fully 6 |
| INV Inventory and Masters of Stock | 30 | 90 | 75 | 24 | Fully 28, Partially 2 |
| MFG Manufacturing and Job Work | 5 | 22 | 8 | 7 | Fully 5 |
| HR People, Attendance and Payroll | 20 | 79 | 17 | 16 | Fully 17, Partially 1, Backend 2 |
| EXP Expenses | 3 | 18 | 10 | 3 | Fully 3 |
| PRJ Projects and Timesheets | 2 | 19 | 4 | 5 | Fully 2 |
| CRM CRM and Communications | 21 | 36 | 8 | 7 | Partially 2, Fully 12, Backend 6, Demo 1 |
| AST Fixed Assets | 1 | 14 | 5 | 5 | Fully 1 |
| RPT Reports and Analytics | 16 | 25 | 15 | 1 | Fully 16 |
| AI Assistant, Chat and Notes | 2 | 8 | 2 | 1 | Fully 2 |
| SEC Security, Settings and Administration | 30 | 73 | 165 | 24 | Fully 21, Backend 9 |
| SYN Offline Sync | 6 | 9 | 2 | 0 | Backend 3, Fully 3 |

## Coverage checks run [F]

- All 749 routes assigned to a feature: yes (749 assigned).
- All 229 screens catalogued: yes.
- All 197 tables listed with columns: yes.
- Screens with no matching feature: `/print/labels`, `/` (redirect and client-only print page; noted in file 03).
- Tiles in the menu catalogued: {len(MENU)} of {len(MENU)}.
- Modules in the plan not found in code: see file 10 section C (NOT IMPLEMENTED).

## Method

Scripts (kept outside the repository) extracted routes (`apps/api/src/routes`), schema (`packages/db/src/schema.ts`, migrations), screens and components (`apps/web`), services' source comments, tests (`apps/api/test`, `packages/domain/test`, `apps/varchasv/test`), device app structure and the plan document into JSON, joined them by route path, then rendered these Markdown files. Narrative sections (workflows, summary, audit, questions) were written by hand against that evidence. Feature IDs are assigned in route-file order within each module in this baseline.

## Known limits

Static analysis only; no screen was opened in a browser and no test was run for this exercise (the test counts are of test cases found in source). Route-to-test and route-to-screen matching is by path string, so dynamically built paths can be missed.
