# 07 Roles and permission matrix

Source: `packages/domain/src/permissions.ts` (catalogue and system roles), route guards in `apps/api/src/routes`, `plugins/storescope.ts`, and screen checks in `apps/web`. All facts unless marked.

## Permission catalogue

A permission is `<module>.<action>`. 16 modules x 10 actions = 160 grid permissions, plus 7 special rights = 167 in total.

- Modules: `company`, `users`, `accounts`, `sales`, `purchase`, `inventory`, `gst`, `hr`, `payroll`, `reports`, `settings`, `banking`, `assets`, `expenses`, `projects`, `crm`
- Actions: `view`, `create`, `edit`, `submit`, `cancel`, `delete`, `export`, `approve`, `print`, `reprint`
- Special rights (single powers outside the grid): `special.changeDate`, `special.futureDate`, `special.sellBelowCost`, `special.seeAgentCommission`, `special.importData`, `special.approveBankChange`, `special.changeSaleRate`

## System roles (seeded for every business)

Each business gets these eight roles and may create its own (`/roles`).

| Module | owner | admin | accountant | sales | purchase | storekeeper | hr | viewer |
|---|---|---|---|---|---|---|---|---|
| company | all | view, create, edit, submit, cancel, export, approve, print, reprint | view | view | view | view | view | view |
| users | all | all | - | - | - | - | - | view |
| accounts | all | all | all | - | - | - | - | view |
| sales | all | all | view, create, edit, submit, export, print | view, create, edit, submit, export, print, reprint | - | view | - | view |
| purchase | all | all | view, create, edit, submit, export, print | - | view, create, edit, submit, export, print | view | - | view |
| inventory | all | all | view | view | view | view, create, edit, submit, export, print | - | view |
| gst | all | all | all | - | - | - | - | view |
| hr | all | all | - | - | - | - | all | view |
| payroll | all | all | - | - | - | - | view, create, edit, submit, export, print | view |
| reports | all | all | view, export | view | view | - | - | view |
| settings | all | all | - | - | - | - | - | view |
| banking | all | all | all | - | - | - | - | view |
| assets | all | all | all | - | - | - | - | view |
| expenses | all | all | view, create, edit, submit, export, approve, print | - | - | - | view, create, edit, submit, export, print | view |
| projects | all | all | view | view, create, edit, submit, export, print | - | - | - | view |
| crm | all | all | view | view, create, edit, submit, export, print | - | - | - | view |
| special | changeDate, futureDate, sellBelowCost, seeAgentCommission, importData, approveBankChange, changeSaleRate | changeDate, futureDate, sellBelowCost, seeAgentCommission, importData, approveBankChange, changeSaleRate | changeDate, futureDate, seeAgentCommission, importData, changeSaleRate | changeSaleRate | changeDate | - | - | - |

Notes: `owner` has every permission; `admin` has all except `company.delete`. `viewer` has `view` on every module. [F]

## Where each permission is enforced (API routes) [F]

| Permission | Routes guarded | Features (sample) |
|---|---|---|
| company.view | 2 | SEC-013, SEC-015 |
| company.edit | 3 | SEC-013, SEC-014 |
| company.export | 7 | SEC-010, SEC-018 |
| users.view | 8 | SEC-019, SEC-024, SEC-025, SEC-026, SYN-002, SYN-003 (+1 more) |
| users.create | 2 | SEC-025 |
| users.edit | 9 | SEC-019, SEC-024, SEC-026, SYN-003, SYN-004 |
| users.delete | 1 | SEC-024 |
| accounts.view | 23 | BNK-005, FIN-010, FIN-011, FIN-012, FIN-018, FIN-034 (+12 more) |
| accounts.create | 24 | BNK-005, FIN-011, FIN-012, FIN-018, FIN-028, FIN-032 (+9 more) |
| accounts.edit | 6 | FIN-011, INV-016, SEC-020, TAX-016, TAX-017, TAX-021 |
| accounts.cancel | 2 | FIN-012, SAL-008 |
| accounts.approve | 7 | BNK-005, FIN-013, FIN-020 |
| sales.view | 76 | EXP-001, FIN-021, INV-012, POS-001, POS-002, POS-003 (+47 more) |
| sales.create | 45 | EXP-001, INV-012, POS-003, POS-004, POS-014, POS-015 (+18 more) |
| sales.edit | 28 | INV-012, POS-001, POS-002, POS-004, POS-005, POS-009 (+12 more) |
| sales.cancel | 8 | POS-003, POS-015, POS-027, SAL-015, SAL-021, SAL-022 (+2 more) |
| sales.approve | 3 | FIN-022, POS-032, SAL-011 |
| purchase.view | 8 | EXP-001, PUR-001, PUR-002, PUR-003, PUR-004, PUR-005 (+1 more) |
| purchase.create | 8 | EXP-001, MFG-004, PUR-001, PUR-002, PUR-004, PUR-005 (+1 more) |
| purchase.edit | 1 | PUR-001 |
| purchase.cancel | 4 | PUR-001, PUR-002, PUR-004, PUR-005 |
| purchase.approve | 1 | PUR-002 |
| inventory.view | 53 | EXP-001, FIN-024, FIN-025, INV-002, INV-003, INV-004 (+28 more) |
| inventory.create | 29 | INV-002, INV-003, INV-006, INV-007, INV-008, INV-012 (+11 more) |
| inventory.edit | 27 | EXP-001, FIN-025, INV-003, INV-007, INV-012, INV-017 (+13 more) |
| inventory.cancel | 5 | INV-008, INV-022, INV-030, MFG-003, MFG-005 |
| inventory.approve | 8 | FIN-025, INV-005, INV-013, INV-015, INV-018, INV-022 (+1 more) |
| gst.view | 26 | MFG-005, TAX-001, TAX-002, TAX-004, TAX-005, TAX-006 (+2 more) |
| gst.edit | 2 | TAX-002, TAX-003 |
| gst.submit | 20 | SAL-025, SAL-027, TAX-001, TAX-006, TAX-007, TAX-011 |
| gst.cancel | 2 | SAL-025, SAL-027 |
| gst.approve | 3 | TAX-007, TAX-011 |
| hr.view | 18 | HR-001, HR-002, HR-003, HR-004, HR-005, HR-006 (+6 more) |
| hr.create | 3 | HR-001, HR-006, INV-012 |
| hr.edit | 21 | HR-001, HR-002, HR-003, HR-004, HR-006, HR-016 (+2 more) |
| hr.approve | 1 | HR-006 |
| payroll.view | 16 | HR-001, HR-007, HR-008, HR-009, HR-011, HR-012 (+4 more) |
| payroll.create | 5 | HR-001, HR-008, HR-014 |
| payroll.edit | 8 | HR-001, HR-007, HR-008, SAL-028 |
| payroll.submit | 3 | HR-008, HR-017 |
| payroll.cancel | 5 | HR-008, HR-011, HR-014, HR-015, HR-017 |
| payroll.export | 2 | HR-008 |
| payroll.approve | 3 | HR-001, HR-008, HR-012 |
| reports.view | 59 | FIN-001, FIN-002, FIN-003, FIN-004, FIN-005, FIN-006 (+43 more) |
| reports.export | 5 | RPT-005, RPT-006 |
| settings.view | 13 | SEC-011, SEC-012, SEC-016, SEC-017, SEC-022, SEC-023 (+1 more) |
| settings.edit | 3 | SEC-011, SEC-016, SEC-022 |
| banking.view | 6 | BNK-001, BNK-003, BNK-004 |
| banking.create | 5 | BNK-001, BNK-002, BNK-004 |
| banking.edit | 8 | BNK-001, BNK-002, BNK-003 |
| assets.view | 7 | AST-001 |
| assets.create | 1 | AST-001 |
| assets.edit | 3 | AST-001 |
| assets.submit | 2 | AST-001 |
| assets.cancel | 1 | AST-001 |
| expenses.view | 7 | EXP-001, EXP-002, EXP-003 |
| expenses.create | 3 | EXP-001, EXP-002 |
| expenses.edit | 1 | EXP-002 |
| expenses.submit | 1 | EXP-002 |
| expenses.cancel | 1 | EXP-002 |
| expenses.approve | 5 | EXP-002 |
| projects.view | 4 | PRJ-001, PRJ-002 |
| projects.create | 3 | PRJ-001, PRJ-002 |
| projects.edit | 9 | PRJ-001 |
| projects.approve | 1 | PRJ-002 |
| crm.view | 14 | CRM-001, CRM-002, CRM-003, CRM-005, CRM-012, CRM-013 (+7 more) |
| crm.create | 5 | CRM-015, CRM-017, CRM-020, CRM-021, SAL-030 |
| crm.edit | 16 | CRM-002, CRM-003, CRM-004, CRM-005, CRM-006, CRM-007 (+7 more) |
| special.seeAgentCommission | 1 | SAL-007 |
| special.importData | 3 | TAX-009 |
| special.approveBankChange | 1 | SEC-012 |

Permissions defined but not used by any route guard (96): `company.create`, `company.submit`, `company.cancel`, `company.delete`, `company.approve`, `company.print`, `company.reprint`, `users.submit`, `users.cancel`, `users.export`, `users.approve`, `users.print`, `users.reprint`, `accounts.submit`, `accounts.delete`, `accounts.export`, `accounts.print`, `accounts.reprint`, `sales.submit`, `sales.delete`, `sales.export`, `sales.print`, `sales.reprint`, `purchase.submit`, `purchase.delete`, `purchase.export`, `purchase.print`, `purchase.reprint`, `inventory.submit`, `inventory.delete`, `inventory.export`, `inventory.print`, `inventory.reprint`, `gst.create`, `gst.delete`, `gst.export`, `gst.print`, `gst.reprint`, `hr.submit`, `hr.cancel`, `hr.delete`, `hr.export`, `hr.print`, `hr.reprint`, `payroll.delete`, `payroll.print`, `payroll.reprint`, `reports.create`, `reports.edit`, `reports.submit`, `reports.cancel`, `reports.delete`, `reports.approve`, `reports.print`, `reports.reprint`, `settings.create`, `settings.submit`, `settings.cancel`, `settings.delete`, `settings.export`, `settings.approve`, `settings.print`, `settings.reprint`, `banking.submit`, `banking.cancel`, `banking.delete`, `banking.export`, `banking.approve`, `banking.print`, `banking.reprint`, `assets.delete`, `assets.export`, `assets.approve`, `assets.print`, `assets.reprint`, `expenses.delete`, `expenses.export`, `expenses.print`, `expenses.reprint`, `projects.submit`, `projects.cancel`, `projects.delete`, `projects.export`, `projects.print`, `projects.reprint`, `crm.submit`, `crm.cancel`, `crm.delete`, `crm.export`, `crm.approve`, `crm.print`, `crm.reprint`, `special.changeDate`, `special.futureDate`, `special.sellBelowCost`, `special.changeSaleRate`. [F] Some may be enforced inside services or screens only; see below. Not enforcing them on the API would make them cosmetic.

## Where permissions are checked in screens [F]

| Permission | Screens that check it |
|---|---|
| accounts.approve | 3 |
| accounts.cancel | 1 |
| accounts.create | 8 |
| accounts.edit | 4 |
| accounts.view | 1 |
| assets.cancel | 1 |
| assets.create | 1 |
| assets.edit | 2 |
| assets.submit | 2 |
| banking.create | 2 |
| banking.edit | 2 |
| company.edit | 1 |
| company.export | 1 |
| company.view | 1 |
| crm.create | 5 |
| crm.edit | 3 |
| expenses.approve | 2 |
| expenses.cancel | 1 |
| expenses.create | 1 |
| expenses.edit | 1 |
| gst.approve | 2 |
| gst.cancel | 2 |
| gst.edit | 1 |
| gst.submit | 6 |
| hr.approve | 1 |
| hr.create | 2 |
| hr.edit | 5 |
| inventory.approve | 6 |
| inventory.cancel | 4 |
| inventory.create | 18 |
| inventory.edit | 10 |
| inventory.view | 1 |
| payroll.approve | 4 |
| payroll.cancel | 3 |
| payroll.create | 4 |
| payroll.edit | 5 |
| payroll.export | 2 |
| payroll.submit | 3 |
| payroll.view | 1 |
| projects.approve | 2 |
| projects.create | 3 |
| projects.edit | 1 |
| projects.view | 2 |
| purchase.approve | 1 |
| purchase.cancel | 4 |
| purchase.create | 8 |
| purchase.edit | 1 |
| reports.export | 1 |
| sales.approve | 4 |
| sales.cancel | 8 |
| sales.create | 25 |
| sales.edit | 14 |
| sales.view | 1 |
| settings.edit | 4 |
| special.approveBankChange | 1 |
| users.create | 1 |
| users.delete | 1 |
| users.edit | 4 |
| users.view | 2 |

The menu itself hides tiles by permission (`perm` on each tile in `apps/web/lib/menu.tsx`). A hidden tile is not a security control; the API guard is. [I]

## Step-up routes (password confirmation required) [F]

| Method | Path | Feature | Guard |
|---|---|---|---|
| POST | `/close/reopen` | FIN-020 | accounts.approve |
| POST | `/export/restore-test` | SEC-018 | company.export |
| POST | `/finance/writedowns/:id/decide` | FIN-025 | inventory.approve |
| POST | `/inventory/reset-stock` | INV-025 | inventory.approve |
| POST | `/devices/:id/revoke` | SYN-004 | users.edit |

## Public routes [F]

Declared in `apps/api/src/lib/public-routes.ts`; `test/security.test.ts` asserts every other route answers 401 to an anonymous caller.

| Method | Path | Why public [I] |
|---|---|---|
| POST | `/auth/signup` | sign-in/invitation/reset/token link/device push |
| POST | `/auth/login` | sign-in/invitation/reset/token link/device push |
| POST | `/auth/logout` | sign-in/invitation/reset/token link/device push |
| POST | `/auth/password/forgot` | sign-in/invitation/reset/token link/device push |
| POST | `/auth/password/reset` | sign-in/invitation/reset/token link/device push |
| GET | `/public/catalogue/:token` | sign-in/invitation/reset/token link/device push |
| GET | `/public/catalogue/:token/files/:fileId` | sign-in/invitation/reset/token link/device push |
| GET | `/webhooks/whatsapp` | sign-in/invitation/reset/token link/device push |
| POST | `/webhooks/whatsapp` | sign-in/invitation/reset/token link/device push |
| POST | `/webhooks/sms` | sign-in/invitation/reset/token link/device push |
| GET | `/iclock/cdata` | sign-in/invitation/reset/token link/device push |
| POST | `/iclock/cdata` | sign-in/invitation/reset/token link/device push |
| GET | `/iclock/getrequest` | sign-in/invitation/reset/token link/device push |
| POST | `/iclock/devicecmd` | sign-in/invitation/reset/token link/device push |
| GET | `/public/documents/:token` | sign-in/invitation/reset/token link/device push |
| GET | `/invitations/lookup/:token` | sign-in/invitation/reset/token link/device push |
| POST | `/invitations/accept` | sign-in/invitation/reset/token link/device push |
| GET | `/meta/states` | sign-in/invitation/reset/token link/device push |
| POST | `/tools/gstin` | sign-in/invitation/reset/token link/device push |
| POST | `/tools/gst` | sign-in/invitation/reset/token link/device push |

## Routes with no parsed permission guard [F, review needed]

Authenticated but without a `can/canAny/canAll` expression the extractor could read. They may use a custom check inside the handler (own-record routes, `me`, cron secret, device serial). Review each.

| Method | Path | Feature | File:line |
|---|---|---|---|
| GET | `/auth/me` | SEC-004 | apps/api/src/routes/auth.ts:91 |
| PATCH | `/auth/me` | SEC-004 | apps/api/src/routes/auth.ts:126 |
| GET | `/me/menu` | SEC-005 | apps/api/src/routes/auth.ts:104 |
| PUT | `/me/menu` | SEC-005 | apps/api/src/routes/auth.ts:109 |
| POST | `/auth/switch` | SEC-006 | apps/api/src/routes/auth.ts:117 |
| POST | `/auth/unlock` | SEC-007 | apps/api/src/routes/auth.ts:134 |
| POST | `/auth/step-up` | SEC-008 | apps/api/src/routes/auth.ts:143 |
| POST | `/auth/password` | SEC-009 | apps/api/src/routes/auth.ts:153 |
| GET | `/chat/people` | AI-001 | apps/api/src/routes/chat.ts:11 |
| GET | `/chat/unread` | AI-001 | apps/api/src/routes/chat.ts:12 |
| GET | `/chat/:userId` | AI-001 | apps/api/src/routes/chat.ts:13 |
| POST | `/chat/:userId` | AI-001 | apps/api/src/routes/chat.ts:19 |
| GET | `/cron/reports` | SEC-021 | apps/api/src/routes/cron.ts:21 |
| GET | `/cron/backups` | SEC-021 | apps/api/src/routes/cron.ts:25 |
| GET | `/cron/comms` | SEC-021 | apps/api/src/routes/cron.ts:29 |
| GET | `/cron/reminders` | SEC-021 | apps/api/src/routes/cron.ts:33 |
| GET | `/cron/statements` | SEC-021 | apps/api/src/routes/cron.ts:37 |
| GET | `/cron/changes` | SEC-021 | apps/api/src/routes/cron.ts:41 |
| GET | `/cron/audit-seal` | SEC-021 | apps/api/src/routes/cron.ts:45 |
| GET | `/reports/builder/datasets` | RPT-005 | apps/api/src/routes/insights.ts:74 |
| POST | `/reports/builder/run` | RPT-005 | apps/api/src/routes/insights.ts:75 |
| GET | `/assistant/tools` | RPT-007 | apps/api/src/routes/insights.ts:103 |
| POST | `/assistant/ask` | RPT-007 | apps/api/src/routes/insights.ts:104 |
| GET | `/notes` | AI-002 | apps/api/src/routes/notes.ts:19 |
| POST | `/notes` | AI-002 | apps/api/src/routes/notes.ts:27 |
| PATCH | `/notes/:id` | AI-002 | apps/api/src/routes/notes.ts:33 |
| DELETE | `/notes/:id` | AI-002 | apps/api/src/routes/notes.ts:44 |
| GET | `/sync/offline-rules` | SYN-001 | apps/api/src/routes/offline.ts:7 |
| POST | `/tenants` | SEC-027 | apps/api/src/routes/team.ts:295 |

Routes with a guard expression that names no `module.action` permission (1): the guard is custom (for example a role check or the cron secret).

| Method | Path | Guard expression (truncated) |
|---|---|---|
| POST | `/quotations/:id/${action}` | can(perm) |

## Store (warehouse) scope [F]

A membership may carry `warehouse_scope` (list of stores). `storeScopeGuard` (`apps/api/src/plugins/storescope.ts`) inspects the body and query of every request for `warehouseId`, `fromWarehouseId`, `toWarehouseId` and for a terminal's store, and answers forbidden for a store outside the scope. Lists are cut to the person's stores where built (`routes/inventory.ts`, `routes/team.ts`, `lib/session.ts` reference `warehouseScope`). `routes/sync.ts` does not reference it, so whether a store-scoped member's device pull is limited to their stores is not established (file 13, Q-31). Branch scope (as opposed to store) and scope by account group are not built (plan R19 'Left').

## Segregation of duties and approvals [F]

`/settings/controls` reports people who hold both do and approve rights and journals that look unusual. Second-person approvals: stock losses above a threshold, expense claims, loans, payroll-related changes, bank detail changes (`special.approveBankChange`), settings changes (`/settings/approvals`), reconciliation write-offs, stock count approval, large stock write-downs. Approval thresholds by amount and field-level masking are not built (plan D10 'Left').

## Role home on the device [F]

`apps/varchasv/lib/domain/role_home.dart` selects the sections shown to cashier, manager, warehouse, buyer, accountant and owner roles from permissions; the offline rules live in `OFFLINE_ACTIONS`.
