# 02 Feature catalog

268 features, each a group of routes in one route file that share a path prefix (for example all `/sales-invoices` routes). A feature is the unit that carries a status in file 10. Sub-features are the individual routes (method and path); the first ten are shown and the complete list is in file 06.

Per entry: **Source comment** is the first sentence(s) of the service function or file comment [F]; where there is none the purpose is inferred from the name [I]. **Screens** lists web screens whose code calls the feature's routes (a lookup call from many screens is counted, not listed). **Device** lists paths the Flutter app also calls.


## FIN Accounting and Finance

### FIN-001 Reports: cash book

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Cash and bank movements, a group month by month, what was spent from cash and bank, and where the money came from and went. (screen text of `/reports/books`)
- **Routes (1) [F]**: `GET /reports/cash-book`
- **Defined in**: `apps/api/src/routes/accountbooks.ts:23`
- **Permissions**: `reports.view`
- **Services**: `accountbooks`
- **Tables touched (by the services used)**: -
- **Screens**: `/reports/books`
- **Device app**: -
- **Tests**: `accountbooks.test.ts`

### FIN-002 Reports: group month

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Cash and bank movements, a group month by month, what was spent from cash and bank, and where the money came from and went. (screen text of `/reports/books`)
- **Routes (1) [F]**: `GET /reports/group-month`
- **Defined in**: `apps/api/src/routes/accountbooks.ts:28`
- **Permissions**: `reports.view`
- **Services**: `accountbooks`
- **Tables touched (by the services used)**: -
- **Screens**: `/reports/books`
- **Device app**: -
- **Tests**: `accountbooks.test.ts`

### FIN-003 Reports: cash bank expense

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Cash and bank movements, a group month by month, what was spent from cash and bank, and where the money came from and went. (screen text of `/reports/books`)
- **Routes (1) [F]**: `GET /reports/cash-bank-expense`
- **Defined in**: `apps/api/src/routes/accountbooks.ts:33`
- **Permissions**: `reports.view`
- **Services**: `accountbooks`
- **Tables touched (by the services used)**: -
- **Screens**: `/reports/books`
- **Device app**: -
- **Tests**: `accountbooks.test.ts`

### FIN-004 Reports: cash flow

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Cash and bank movements, a group month by month, what was spent from cash and bank, and where the money came from and went. (screen text of `/reports/books`)
- **Routes (1) [F]**: `GET /reports/cash-flow`
- **Defined in**: `apps/api/src/routes/accountbooks.ts:37`
- **Permissions**: `reports.view`
- **Services**: `accountbooks`
- **Tables touched (by the services used)**: -
- **Screens**: `/reports/books`
- **Device app**: -
- **Tests**: `accountbooks.test.ts`

### FIN-005 Reports: rcm register

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Cash and bank movements, a group month by month, what was spent from cash and bank, and where the money came from and went. (screen text of `/reports/books`)
- **Routes (1) [F]**: `GET /reports/rcm-register`
- **Defined in**: `apps/api/src/routes/accountbooks.ts:41`
- **Permissions**: `reports.view`
- **Services**: `accountbooks`
- **Tables touched (by the services used)**: -
- **Screens**: `/reports/books`
- **Device app**: -
- **Tests**: `billreceipts.test.ts`

### FIN-006 Reports: bill adjustments

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Cash and bank movements, a group month by month, what was spent from cash and bank, and where the money came from and went. (screen text of `/reports/books`)
- **Routes (1) [F]**: `GET /reports/bill-adjustments`
- **Defined in**: `apps/api/src/routes/accountbooks.ts:45`
- **Permissions**: `reports.view`
- **Services**: `accountbooks`
- **Tables touched (by the services used)**: -
- **Screens**: `/reports/books`
- **Device app**: -
- **Tests**: `billreceipts.test.ts`

### FIN-007 Reports: integrity

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Do your books agree with themselves? Each check compares two things that must match and lists any difference with the records behind it. (screen text of `/reports/integrity`)
- **Routes (1) [F]**: `GET /reports/integrity`
- **Defined in**: `apps/api/src/routes/accountbooks.ts:50`
- **Permissions**: `reports.view`
- **Services**: `integrity`
- **Tables touched (by the services used)**: -
- **Screens**: `/reports/integrity`
- **Device app**: -
- **Tests**: `integrity.test.ts`, `repairs.test.ts`

### FIN-008 Reports: cfo

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: From sales to profit for the period, against the same period last year. Profit before and after tax are the same here unless your books record income tax. (screen text of `/reports/cfo`)
- **Routes (1) [F]**: `GET /reports/cfo`
- **Defined in**: `apps/api/src/routes/accountbooks.ts:55`
- **Permissions**: `reports.view`
- **Services**: `cfo`
- **Tables touched (by the services used)**: -
- **Screens**: `/reports/cfo`
- **Device app**: -
- **Tests**: `cfo.test.ts`

### FIN-009 Reports: stock movement

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Which stock sells and which sits. For every item with stock in hand: pieces sold in the last `days` (sales invoices and counter bills, less what came back), the day it last sold, and a class: fast (at least `fastMin` sold), slow (some sold, fewer) or non-moving (none). Non-moving stock comes first, largest value first, since that is what needs a decision. Garments by default; fabric and trims are used up in productio
- **Routes (1) [F]**: `GET /reports/stock-movement`
- **Defined in**: `apps/api/src/routes/accountbooks.ts:60`
- **Permissions**: `reports.view`
- **Services**: `stockmovement`
- **Tables touched (by the services used)**: items, styles
- **Screens**: `/reports/stock-movement`
- **Device app**: -
- **Tests**: `stockmovement.test.ts`

### FIN-010 Accounts: groups

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Ledgers grouped the way your accountant expects. Customers go under Sundry Debtors, suppliers under Sundry Creditors. (screen text of `/accounts/chart`)
- **Routes (1) [F]**: `GET /accounts/groups`
- **Defined in**: `apps/api/src/routes/accounting.ts:77`
- **Permissions**: `accounts.view`
- **Services**: `accounting`
- **Tables touched (by the services used)**: account_groups, accounts, companies, fiscal_years, gl_entries, number_series, voucher_lines, vouchers
- **Screens**: `/accounts/bill-receipt`, `/accounts/chart`, `/accounts/gst-jv`, `/accounts/reconciliation`, `/accounts/tds`, `/accounts/vouchers/new` (+56 more) (62 screens call it)
- **Device app**: -
- **Tests**: `accountbooks.test.ts`, `accounting.test.ts`, `apparel.test.ts`, `assets.test.ts`, `auditchain.test.ts` (+59 more)

### FIN-011 Accounts (accounting)

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Ledgers grouped the way your accountant expects. Customers go under Sundry Debtors, suppliers under Sundry Creditors. (screen text of `/accounts/chart`)
- **Routes (3) [F]**: `GET /accounts`; `POST /accounts`; `PATCH /accounts/:id`
- **Defined in**: `apps/api/src/routes/accounting.ts:87`
- **Permissions**: `accounts.create`, `accounts.edit`, `accounts.view`
- **Services**: `accounting`, `changes`
- **Tables touched (by the services used)**: accounts, companies, account_groups, fiscal_years, gl_entries, number_series, voucher_lines, vouchers, change_requests, employees (+1 more)
- **Screens**: `/accounts/bill-receipt`, `/accounts/chart`, `/accounts/gst-jv`, `/accounts/reconciliation`, `/accounts/tds`, `/accounts/vouchers/new` (+56 more) (62 screens call it)
- **Device app**: -
- **Tests**: `accountbooks.test.ts`, `accounting.test.ts`, `apparel.test.ts`, `assets.test.ts`, `auditchain.test.ts` (+70 more)

### FIN-012 Vouchers

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Every entry in your books. Posted vouchers are never edited: cancel and re-enter instead. (screen text of `/accounts/vouchers/new`)
- **Routes (4) [F]**: `GET /vouchers`; `GET /vouchers/:id`; `POST /vouchers`; `POST /vouchers/:id/cancel`
- **Defined in**: `apps/api/src/routes/accounting.ts:162`
- **Permissions**: `accounts.cancel`, `accounts.create`, `accounts.view`
- **Services**: `accounting`
- **Tables touched (by the services used)**: account_groups, accounts, companies, fiscal_years, gl_entries, number_series, voucher_lines, vouchers
- **Screens**: `/accounts/vouchers/[id]`, `/accounts/vouchers/new`, `/accounts/vouchers`, `/print/cheque/[id]`, `/print/vouchers`
- **Device app**: -
- **Tests**: `accountbooks.test.ts`, `accounting.test.ts`, `apparel.test.ts`, `backups.test.ts`, `banking.test.ts` (+18 more)

### FIN-013 Fiscal years (accounting)

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Lock a period once its books are final: for example after filing GST returns. Nobody can post or cancel entries on or before the lock date. (screen text of `/settings/financial-years`)
- **Routes (1) [F]**: `PATCH /fiscal-years/:id`
- **Defined in**: `apps/api/src/routes/accounting.ts:232`
- **Permissions**: `accounts.approve`
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: `/settings/financial-years`
- **Device app**: -
- **Tests**: `accounting.test.ts`

### FIN-014 Reports: trial balance

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: The company a request works on: the one asked for, or the tenant's first.
- **Routes (1) [F]**: `GET /reports/trial-balance`
- **Defined in**: `apps/api/src/routes/accounting.ts:248`
- **Permissions**: `reports.view`
- **Services**: `accounting`
- **Tables touched (by the services used)**: account_groups, accounts, companies, fiscal_years, gl_entries, number_series, voucher_lines, vouchers
- **Screens**: `/reports/trial-balance`
- **Device app**: -
- **Tests**: `accounting.test.ts`, `assets.test.ts`, `banking.test.ts`, `expenses-projects.test.ts`, `loanreceipts.test.ts` (+8 more)

### FIN-015 Reports: profit loss

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: From gross sales to operating profit, with each figure marked as booked, estimated or shared out. (screen text of `/reports/profitability`)
- **Routes (1) [F]**: `GET /reports/profit-loss`
- **Defined in**: `apps/api/src/routes/accounting.ts:254`
- **Permissions**: `reports.view`
- **Services**: `accounting`
- **Tables touched (by the services used)**: account_groups, accounts, companies, fiscal_years, gl_entries, number_series, voucher_lines, vouchers
- **Screens**: `/reports/profit-loss`
- **Device app**: -
- **Tests**: `accounting.test.ts`, `purchasing.test.ts`

### FIN-016 Reports: balance sheet

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: The company a request works on: the one asked for, or the tenant's first.
- **Routes (1) [F]**: `GET /reports/balance-sheet`
- **Defined in**: `apps/api/src/routes/accounting.ts:264`
- **Permissions**: `reports.view`
- **Services**: `accounting`
- **Tables touched (by the services used)**: account_groups, accounts, companies, fiscal_years, gl_entries, number_series, voucher_lines, vouchers
- **Screens**: `/reports/balance-sheet`
- **Device app**: -
- **Tests**: `accounting.test.ts`, `purchasing.test.ts`

### FIN-017 Reports: ledger

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: The company a request works on: the one asked for, or the tenant's first.
- **Routes (1) [F]**: `GET /reports/ledger/:accountId`
- **Defined in**: `apps/api/src/routes/accounting.ts:273`
- **Permissions**: `reports.view`
- **Services**: `accounting`
- **Tables touched (by the services used)**: account_groups, accounts, companies, fiscal_years, gl_entries, number_series, voucher_lines, vouchers
- **Screens**: `/reports/ledger/[id]`
- **Device app**: -
- **Tests**: `accounting.test.ts`, `apparel.test.ts`, `recon.test.ts`, `workingcap.test.ts`

### FIN-018 Bill receipts

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Goods that arrived (GRN). Stock goes up on receipt; the bill comes later. (screen text of `/purchase/receipts`)
- **Routes (2) [F]**: `GET /bill-receipts/open`; `POST /bill-receipts`
- **Defined in**: `apps/api/src/routes/billreceipts.ts:20`
- **Permissions**: `accounts.create`, `accounts.view`
- **Services**: `billreceipts`
- **Tables touched (by the services used)**: accounts, bill_allocations
- **Screens**: `/accounts/bill-receipt`
- **Device app**: -
- **Tests**: `billreceipts.test.ts`, `commwiring.test.ts`

### FIN-019 Reports: cash flow statement

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Where the cash came from and where it went, from profit to the change in cash and bank. (screen text of `/reports/cash-flow-statement`)
- **Routes (1) [F]**: `GET /reports/cash-flow-statement`
- **Defined in**: `apps/api/src/routes/cashflow.ts:8`
- **Permissions**: `reports.view`
- **Services**: `cashflow`
- **Tables touched (by the services used)**: -
- **Screens**: `/reports/cash-flow-statement`
- **Device app**: -
- **Tests**: `cashflow.test.ts`

### FIN-020 Close

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Check what is still open before a month ends, sign off what you accept, save the month's reports, and settle each day's counter cash. (screen text of `/accounts/close`)
- **Routes (7) [F]**: `GET /close/checklist`; `POST /close/signoff`; `DELETE /close/signoff`; `POST /close/month`; `POST /close/reopen`; `GET /close/snapshots`; `GET /close/snapshots/:id`
- **Defined in**: `apps/api/src/routes/close.ts:18`
- **Permissions**: `accounts.approve`, `reports.view`; step-up required on 1 route(s)
- **Services**: `close`
- **Tables touched (by the services used)**: close_signoffs, month_closes, pos_sessions, pos_terminals, report_snapshots, users
- **Screens**: `/accounts/close`
- **Device app**: -
- **Tests**: `close.test.ts`

### FIN-021 Pos: day close

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Check what is still open before a month ends, sign off what you accept, save the month's reports, and settle each day's counter cash. (screen text of `/accounts/close`)
- **Routes (1) [F]**: `GET /pos/day-close`
- **Defined in**: `apps/api/src/routes/close.ts:51`
- **Permissions**: `sales.view`
- **Services**: `close`
- **Tables touched (by the services used)**: close_signoffs, month_closes, pos_sessions, pos_terminals, report_snapshots, users
- **Screens**: `/accounts/close`
- **Device app**: -
- **Tests**: `close.test.ts`

### FIN-022 Pos: sessions (close)

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Check what is still open before a month ends, sign off what you accept, save the month's reports, and settle each day's counter cash. (screen text of `/accounts/close`)
- **Routes (1) [F]**: `POST /pos/sessions/:id/sign-variance`
- **Defined in**: `apps/api/src/routes/close.ts:55`
- **Permissions**: `sales.approve`
- **Services**: `close`
- **Tables touched (by the services used)**: close_signoffs, month_closes, pos_sessions, pos_terminals, report_snapshots, users
- **Screens**: `/accounts/close`
- **Device app**: -
- **Tests**: `close.test.ts`

### FIN-023 Scenarios

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Try a hire, a new shop, a price change or a loan against the last twelve months of your books, and see the year ahead as a worst, expected and best case. (screen text of `/accounts/scenarios`)
- **Routes (6) [F]**: `GET /scenarios/kinds`; `GET /scenarios/baseline`; `POST /scenarios/preview`; `GET /scenarios`; `POST /scenarios`; `DELETE /scenarios/:id`
- **Defined in**: `apps/api/src/routes/scenarios.ts:29`
- **Permissions**: `reports.view`
- **Services**: `scenarios`
- **Tables touched (by the services used)**: scenarios
- **Screens**: `/accounts/scenarios`
- **Device app**: -
- **Tests**: `crosstenant.test.ts`, `restoretest.test.ts`, `scenarios.test.ts`

### FIN-024 Finance: stock review

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Slow stock that may be worth less than it cost, the provision it needs with a second person's approval, and stock and sales by store, GSTIN and channel. (screen text of `/inventory/stock-finance`)
- **Routes (1) [F]**: `GET /finance/stock-review`
- **Defined in**: `apps/api/src/routes/stockfinance.ts:20`
- **Permissions**: `inventory.view`
- **Services**: `stockfinance`
- **Tables touched (by the services used)**: accounts, branches, items, stock_writedowns, users, warehouses
- **Screens**: `/inventory/stock-finance`
- **Device app**: -
- **Tests**: `stockfinance.test.ts`

### FIN-025 Finance: writedowns

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Slow stock that may be worth less than it cost, the provision it needs with a second person's approval, and stock and sales by store, GSTIN and channel. (screen text of `/inventory/stock-finance`)
- **Routes (3) [F]**: `GET /finance/writedowns`; `POST /finance/writedowns`; `POST /finance/writedowns/:id/decide`
- **Defined in**: `apps/api/src/routes/stockfinance.ts:25`
- **Permissions**: `inventory.approve`, `inventory.edit`, `inventory.view`; step-up required on 1 route(s)
- **Services**: `stockfinance`
- **Tables touched (by the services used)**: accounts, branches, items, stock_writedowns, users, warehouses
- **Screens**: `/inventory/stock-finance`
- **Device app**: -
- **Tests**: `stockfinance.test.ts`

### FIN-026 Finance: cost centres

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Slow stock that may be worth less than it cost, the provision it needs with a second person's approval, and stock and sales by store, GSTIN and channel. (screen text of `/inventory/stock-finance`)
- **Routes (1) [F]**: `GET /finance/cost-centres`
- **Defined in**: `apps/api/src/routes/stockfinance.ts:36`
- **Permissions**: `reports.view`
- **Services**: `stockfinance`
- **Tables touched (by the services used)**: accounts, branches, items, stock_writedowns, users, warehouses
- **Screens**: `/inventory/stock-finance`
- **Device app**: -
- **Tests**: `stockfinance.test.ts`

### FIN-027 Finance: store results

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Each store with its sales, gross margin and share of the expenses. (screen text of `/reports/store-results`)
- **Routes (1) [F]**: `GET /finance/store-results`
- **Defined in**: `apps/api/src/routes/stockfinance.ts:40`
- **Permissions**: `reports.view`
- **Services**: `expensealloc`
- **Tables touched (by the services used)**: expense_allocation_rules
- **Screens**: `/reports/store-results`
- **Device app**: -
- **Tests**: `commitments.test.ts`

### FIN-028 Finance: allocation rules

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Each store with its sales, gross margin and share of the expenses. (screen text of `/reports/store-results`)
- **Routes (2) [F]**: `PUT /finance/allocation-rules/:accountId`; `DELETE /finance/allocation-rules/:accountId`
- **Defined in**: `apps/api/src/routes/stockfinance.ts:44`
- **Permissions**: `accounts.create`
- **Services**: `expensealloc`
- **Tables touched (by the services used)**: expense_allocation_rules
- **Screens**: `/reports/store-results`
- **Device app**: -
- **Tests**: `commitments.test.ts`

### FIN-029 Finance: credit exposure

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: What customers could owe you, when suppliers must be paid, cheques still to clear, where cash is heading, and the statement a bank asks for. (screen text of `/accounts/working-capital`)
- **Routes (1) [F]**: `GET /finance/credit-exposure`
- **Defined in**: `apps/api/src/routes/workingcap.ts:17`
- **Permissions**: `reports.view`
- **Services**: `workingcap`
- **Tables touched (by the services used)**: accounts, cash_commitments, payroll_runs, post_dated_cheques
- **Screens**: `/accounts/working-capital`
- **Device app**: -
- **Tests**: `workingcap.test.ts`

### FIN-030 Finance: supplier calendar

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: What customers could owe you, when suppliers must be paid, cheques still to clear, where cash is heading, and the statement a bank asks for. (screen text of `/accounts/working-capital`)
- **Routes (1) [F]**: `GET /finance/supplier-calendar`
- **Defined in**: `apps/api/src/routes/workingcap.ts:18`
- **Permissions**: `reports.view`
- **Services**: `workingcap`
- **Tables touched (by the services used)**: accounts, cash_commitments, payroll_runs, post_dated_cheques
- **Screens**: `/accounts/working-capital`
- **Device app**: -
- **Tests**: `workingcap.test.ts`

### FIN-031 Finance: cash forecast

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: What customers could owe you, when suppliers must be paid, cheques still to clear, where cash is heading, and the statement a bank asks for. (screen text of `/accounts/working-capital`)
- **Routes (1) [F]**: `GET /finance/cash-forecast`
- **Defined in**: `apps/api/src/routes/workingcap.ts:19`
- **Permissions**: `reports.view`
- **Services**: `workingcap`
- **Tables touched (by the services used)**: accounts, cash_commitments, payroll_runs, post_dated_cheques
- **Screens**: `/accounts/working-capital`
- **Device app**: -
- **Tests**: `commitments.test.ts`, `workingcap.test.ts`

### FIN-032 Finance: commitments

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: What customers could owe you, when suppliers must be paid, cheques still to clear, where cash is heading, and the statement a bank asks for. (screen text of `/accounts/working-capital`)
- **Routes (3) [F]**: `GET /finance/commitments`; `POST /finance/commitments`; `POST /finance/commitments/:id/stop`
- **Defined in**: `apps/api/src/routes/workingcap.ts:23`
- **Permissions**: `accounts.create`, `reports.view`
- **Services**: `workingcap`
- **Tables touched (by the services used)**: accounts, cash_commitments, payroll_runs, post_dated_cheques
- **Screens**: `/accounts/working-capital`
- **Device app**: -
- **Tests**: `commitments.test.ts`

### FIN-033 Finance: drawing power

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: What customers could owe you, when suppliers must be paid, cheques still to clear, where cash is heading, and the statement a bank asks for. (screen text of `/accounts/working-capital`)
- **Routes (1) [F]**: `GET /finance/drawing-power`
- **Defined in**: `apps/api/src/routes/workingcap.ts:36`
- **Permissions**: `reports.view`
- **Services**: `workingcap`
- **Tables touched (by the services used)**: accounts, cash_commitments, payroll_runs, post_dated_cheques
- **Screens**: `/accounts/working-capital`
- **Device app**: -
- **Tests**: `workingcap.test.ts`

### FIN-034 Finance: cheques

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: What customers could owe you, when suppliers must be paid, cheques still to clear, where cash is heading, and the statement a bank asks for. (screen text of `/accounts/working-capital`)
- **Routes (3) [F]**: `GET /finance/cheques`; `POST /finance/cheques`; `POST /finance/cheques/:id/settle`
- **Defined in**: `apps/api/src/routes/workingcap.ts:41`
- **Permissions**: `accounts.create`, `accounts.view`
- **Services**: `workingcap`
- **Tables touched (by the services used)**: accounts, cash_commitments, payroll_runs, post_dated_cheques
- **Screens**: `/accounts/working-capital`
- **Device app**: -
- **Tests**: `workingcap.test.ts`

### FIN-035 Reports: year end

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: What to settle before a financial year is closed and locked. Nothing here changes your books. (screen text of `/reports/year-end`)
- **Routes (1) [F]**: `GET /reports/year-end`
- **Defined in**: `apps/api/src/routes/yearend.ts:9`
- **Permissions**: `reports.view`
- **Services**: `yearend`
- **Tables touched (by the services used)**: -
- **Screens**: `/reports/year-end`
- **Device app**: -
- **Tests**: `yearend.test.ts`

### FIN-036 Reports: carry forward

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: What to settle before a financial year is closed and locked. Nothing here changes your books. (screen text of `/reports/year-end`)
- **Routes (1) [F]**: `GET /reports/carry-forward`
- **Defined in**: `apps/api/src/routes/yearend.ts:14`
- **Permissions**: `reports.view`
- **Services**: `yearend`
- **Tables touched (by the services used)**: -
- **Screens**: `/reports/year-end`
- **Device app**: -
- **Tests**: `yearend.test.ts`


## TAX GST, TDS and Statutory Compliance

### TAX-001 Exports

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Shipping bills and bank realisation, duty-credit scrips with their rates, and the refund when inputs are taxed higher than the goods. (screen text of `/gst/exports`)
- **Routes (10) [F]**: `GET /exports/shipments`; `PUT /exports/shipments/:invoiceId`; `GET /exports/rates`; `POST /exports/rates`; `DELETE /exports/rates/:id`; `GET /exports/incentive`; `GET /exports/scrips`; `POST /exports/scrips`; `POST /exports/scrips/:id/use`; `GET /exports/inverted-duty`
- **Defined in**: `apps/api/src/routes/exports.ts:18`
- **Permissions**: `gst.submit`, `gst.view`
- **Services**: `exports`
- **Tables touched (by the services used)**: duty_scrips, export_shipments, incentive_rates, sales_invoices, scrip_uses
- **Screens**: `/gst/exports`
- **Device app**: -
- **Tests**: `exports.test.ts`

### TAX-002 Gst: settings

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Pricing, loyalty points, discount limits and counters. (screen text of `/settings/pos`)
- **Routes (2) [F]**: `GET /gst/settings`; `PUT /gst/settings`
- **Defined in**: `apps/api/src/routes/gst.ts:22`
- **Permissions**: `gst.edit`, `gst.view`
- **Services**: `accounting`
- **Tables touched (by the services used)**: account_groups, accounts, companies, fiscal_years, gl_entries, number_series, voucher_lines, vouchers
- **Screens**: `/settings/gst`
- **Device app**: -
- **Tests**: `sales.test.ts`

### TAX-003 Print language

- **Status**: PARTIALLY IMPLEMENTED (file 10)
- **Source comment [F]**: The company a request works on: the one asked for, or the tenant's first.
- **Routes (1) [F]**: `GET /print-language`
- **Defined in**: `apps/api/src/routes/gst.ts:32`
- **Permissions**: `gst.edit`
- **Services**: `accounting`
- **Tables touched (by the services used)**: account_groups, accounts, companies, fiscal_years, gl_entries, number_series, voucher_lines, vouchers
- **Screens**: `/print/form16/[id]`, `/print/payslip/[id]`
- **Device app**: -
- **Tests**: none matched

### TAX-004 Gst: gstr1

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: GSTR-1 and GSTR-3B from your invoices and bills. File them here, or download the JSON for the GST portal's offline tool. (screen text of `/gst/returns`)
- **Routes (1) [F]**: `GET /gst/gstr1`
- **Defined in**: `apps/api/src/routes/gst.ts:58`
- **Permissions**: `gst.view`
- **Services**: `returns`
- **Tables touched (by the services used)**: bill_allocations, branches, credit_note_lines, credit_notes, items, pos_bill_lines, pos_bills, pos_returns, sales_invoice_lines, sales_invoices (+1 more)
- **Screens**: `/gst/returns`
- **Device app**: -
- **Tests**: `apparel.test.ts`, `pos.test.ts`, `sales.test.ts`

### TAX-005 Gst: gstr3b

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: GSTR-1 and GSTR-3B from your invoices and bills. File them here, or download the JSON for the GST portal's offline tool. (screen text of `/gst/returns`)
- **Routes (1) [F]**: `GET /gst/gstr3b`
- **Defined in**: `apps/api/src/routes/gst.ts:64`
- **Permissions**: `gst.view`
- **Services**: `returns`
- **Tables touched (by the services used)**: bill_allocations, branches, credit_note_lines, credit_notes, items, pos_bill_lines, pos_bills, pos_returns, sales_invoice_lines, sales_invoices (+1 more)
- **Screens**: `/gst/returns`
- **Device app**: -
- **Tests**: `sales.test.ts`

### TAX-006 Gst: portal

- **Status**: DEMO / PLACEHOLDER (file 10)
- **Source comment [F]**: GSTR-1 and GSTR-3B from your invoices and bills. File them here, or download the JSON for the GST portal's offline tool. (screen text of `/gst/returns`)
- **Routes (4) [F]**: `GET /gst/portal`; `POST /gst/portal/otp`; `POST /gst/portal/connect`; `POST /gst/portal/disconnect`
- **Defined in**: `apps/api/src/routes/gst.ts:76`
- **Permissions**: `gst.submit`, `gst.view`
- **Services**: `filing`
- **Tables touched (by the services used)**: branches, gst_filings, gst_return_approvals, gst_sessions, gst_settings
- **Screens**: `/gst/returns`
- **Device app**: -
- **Tests**: `gstwork2.test.ts`, `sales.test.ts`

### TAX-007 Gst: filings

- **Status**: DEMO / PLACEHOLDER (file 10)
- **Source comment [F]**: GSTR-1 and GSTR-3B from your invoices and bills. File them here, or download the JSON for the GST portal's offline tool. (screen text of `/gst/returns`)
- **Routes (4) [F]**: `GET /gst/filings`; `POST /gst/filings/upload`; `POST /gst/filings/otp`; `POST /gst/filings/file`
- **Defined in**: `apps/api/src/routes/gst.ts:97`
- **Permissions**: `gst.approve`, `gst.submit`, `gst.view`
- **Services**: `filing`
- **Tables touched (by the services used)**: branches, gst_filings, gst_return_approvals, gst_sessions, gst_settings
- **Screens**: `/gst/returns`
- **Device app**: -
- **Tests**: `gstwork2.test.ts`, `sales.test.ts`

### TAX-008 GST reports by kind (templated route)

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: Outstanding by party with ageing. Payments and credit notes settle the oldest bills first (FIFO), which is how most small businesses (and Tally's "on account") work without bill-by-bill matching.
- **Routes (1) [F]**: `GET /reports/${kind}s`
- **Defined in**: `apps/api/src/routes/gst.ts:120`
- **Permissions**: `reports.view`
- **Services**: `returns`
- **Tables touched (by the services used)**: bill_allocations, branches, credit_note_lines, credit_notes, items, pos_bill_lines, pos_bills, pos_returns, sales_invoice_lines, sales_invoices (+1 more)
- **Screens**: none found
- **Device app**: -
- **Tests**: none matched

### TAX-009 Import

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Bring customers, suppliers and items across from a spreadsheet or from Tally. (screen text of `/settings/import`)
- **Routes (3) [F]**: `POST /import/parties`; `POST /import/items`; `POST /import/tally`
- **Defined in**: `apps/api/src/routes/gst.ts:129`
- **Permissions**: `accounts.create`, `inventory.create`, `special.importData`
- **Services**: `importer`
- **Tables touched (by the services used)**: account_groups, accounts, items, uoms, warehouses
- **Screens**: `/hr/attendance`, `/settings/import`
- **Device app**: -
- **Tests**: `rights.test.ts`, `sales.test.ts`

### TAX-010 Gst jv

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Adjust GST on its own: pay tax out of credit, reverse or claim credit, or raise or cut tax payable. No goods or party bill is involved. (screen text of `/accounts/gst-jv`)
- **Routes (2) [F]**: `GET /gst-jv/position`; `POST /gst-jv`
- **Defined in**: `apps/api/src/routes/gstjv.ts:22`
- **Permissions**: `accounts.create`, `accounts.view`
- **Services**: `gstjv`
- **Tables touched (by the services used)**: -
- **Screens**: `/accounts/gst-jv`
- **Device app**: -
- **Tests**: `gstjv.test.ts`

### TAX-011 Gst: work

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Supplier statements, credit to give back, the annual working and sign-off before a return goes up. (screen text of `/gst/compliance`)
- **Routes (23) [F]**: `GET /gst/work/settings`; `PUT /gst/work/settings`; `GET /gst/work/calendar`; `GET /gst/work/einvoice-alerts`; `GET /gst/work/slab-exceptions`; `GET /gst/work/rule37`; `GET /gst/work/2b`; `POST /gst/work/2b`; `GET /gst/work/2b/:period`; `POST /gst/work/2b/rows/:id/decide`; +13 more
- **Defined in**: `apps/api/src/routes/gstwork.ts:18`
- **Permissions**: `gst.approve`, `gst.submit`, `gst.view`
- **Services**: `filing`, `gstannual`, `gstwork`, `slabcheck`
- **Tables touched (by the services used)**: gst_filings, gst_settings, accounts, gstr2b_imports, gstr2b_rows, itc_reversals, purchase_bills, sales_invoices, branches, gst_return_approvals (+1 more)
- **Screens**: `/gst/compliance`, `/gst/slab-exceptions`, `/gst/workspace`
- **Device app**: -
- **Tests**: `gstwork.test.ts`, `gstwork2.test.ts`, `slabcheck.test.ts`

### TAX-012 Reports: msme

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: What the business owes its micro and small suppliers, bill by bill, and how much of it has gone past 45 days. Suppliers are those marked with an MSME class. Medium enterprises are shown too but are not under the 45 day rule.
- **Routes (1) [F]**: `GET /reports/msme`
- **Defined in**: `apps/api/src/routes/msme.ts:10`
- **Permissions**: `accounts.view`
- **Services**: `msme`
- **Tables touched (by the services used)**: accounts
- **Screens**: `/reports/msme`
- **Device app**: -
- **Tests**: `msme.test.ts`

### TAX-013 Tds: section map

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Tax held back from contractors, professionals, rent, commission and interest, and the quarterly return (Form 26Q). (screen text of `/accounts/tds`)
- **Routes (3) [F]**: `GET /tds/section-map`; `PUT /tds/section-map`; `DELETE /tds/section-map/:section`
- **Defined in**: `apps/api/src/routes/tds.ts:22`
- **Permissions**: `accounts.create`, `accounts.view`
- **Services**: `tds`
- **Tables touched (by the services used)**: accounts, branches, brokerage_bills, tcs_collections, tds_challans, tds_deductions, tds_section_map
- **Screens**: `/accounts/tds`
- **Device app**: -
- **Tests**: `tds.test.ts`

### TAX-014 Tds: sections

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Tax held back from contractors, professionals, rent, commission and interest, and the quarterly return (Form 26Q). (screen text of `/accounts/tds`)
- **Routes (1) [F]**: `GET /tds/sections`
- **Defined in**: `apps/api/src/routes/tds.ts:35`
- **Permissions**: `accounts.view`
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: `/accounts/tds`
- **Device app**: -
- **Tests**: `tds.test.ts`

### TAX-015 Tds: preview

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Tax held back from contractors, professionals, rent, commission and interest, and the quarterly return (Form 26Q). (screen text of `/accounts/tds`)
- **Routes (1) [F]**: `GET /tds/preview`
- **Defined in**: `apps/api/src/routes/tds.ts:37`
- **Permissions**: `accounts.view`
- **Services**: `tds`
- **Tables touched (by the services used)**: accounts, branches, brokerage_bills, tcs_collections, tds_challans, tds_deductions, tds_section_map
- **Screens**: `/accounts/tds`
- **Device app**: -
- **Tests**: `tds.test.ts`

### TAX-016 Tds: deductions

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Tax held back from contractors, professionals, rent, commission and interest, and the quarterly return (Form 26Q). (screen text of `/accounts/tds`)
- **Routes (3) [F]**: `GET /tds/deductions`; `POST /tds/deductions`; `POST /tds/deductions/:id/cancel`
- **Defined in**: `apps/api/src/routes/tds.ts:41`
- **Permissions**: `accounts.create`, `accounts.edit`, `accounts.view`
- **Services**: `tds`
- **Tables touched (by the services used)**: accounts, branches, brokerage_bills, tcs_collections, tds_challans, tds_deductions, tds_section_map
- **Screens**: `/accounts/tds`
- **Device app**: -
- **Tests**: `tds.test.ts`

### TAX-017 Tds: challans

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Tax held back from contractors, professionals, rent, commission and interest, and the quarterly return (Form 26Q). (screen text of `/accounts/tds`)
- **Routes (3) [F]**: `GET /tds/challans`; `POST /tds/challans`; `POST /tds/challans/:id/cancel`
- **Defined in**: `apps/api/src/routes/tds.ts:56`
- **Permissions**: `accounts.create`, `accounts.edit`, `accounts.view`
- **Services**: `tds`
- **Tables touched (by the services used)**: accounts, branches, brokerage_bills, tcs_collections, tds_challans, tds_deductions, tds_section_map
- **Screens**: `/accounts/tds`
- **Device app**: -
- **Tests**: `tds.test.ts`

### TAX-018 Tds: 26q

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Tax held back from contractors, professionals, rent, commission and interest, and the quarterly return (Form 26Q). (screen text of `/accounts/tds`)
- **Routes (1) [F]**: `GET /tds/26q`
- **Defined in**: `apps/api/src/routes/tds.ts:71`
- **Permissions**: `reports.view`
- **Services**: `tds`
- **Tables touched (by the services used)**: accounts, branches, brokerage_bills, tcs_collections, tds_challans, tds_deductions, tds_section_map
- **Screens**: `/accounts/tds`
- **Device app**: -
- **Tests**: `tds.test.ts`

### TAX-019 Tds: certificate

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: What a certificate of tax deducted (Form 16A) says for one payee in one quarter: who deducted, who it was deducted from, each payment with the tax and the challan it was deposited under. Part A comes from the TRACES portal in law; this is the working copy the deductor signs and hands over.
- **Routes (1) [F]**: `GET /tds/certificate`
- **Defined in**: `apps/api/src/routes/tds.ts:80`
- **Permissions**: `reports.view`
- **Services**: `tds`
- **Tables touched (by the services used)**: accounts, branches, brokerage_bills, tcs_collections, tds_challans, tds_deductions, tds_section_map
- **Screens**: `/print/tds-certificate`
- **Device app**: -
- **Tests**: `tds.test.ts`

### TAX-020 Tds: 194q

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Tax held back from contractors, professionals, rent, commission and interest, and the quarterly return (Form 26Q). (screen text of `/accounts/tds`)
- **Routes (1) [F]**: `GET /tds/194q`
- **Defined in**: `apps/api/src/routes/tds.ts:84`
- **Permissions**: `reports.view`
- **Services**: `tds`
- **Tables touched (by the services used)**: accounts, branches, brokerage_bills, tcs_collections, tds_challans, tds_deductions, tds_section_map
- **Screens**: `/accounts/tds`
- **Device app**: -
- **Tests**: `tds.test.ts`

### TAX-021 Tcs

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Tax held back from contractors, professionals, rent, commission and interest, and the quarterly return (Form 26Q). (screen text of `/accounts/tds`)
- **Routes (6) [F]**: `GET /tcs/sections`; `GET /tcs/preview`; `GET /tcs/collections`; `POST /tcs/collections`; `POST /tcs/collections/:id/cancel`; `GET /tcs/27eq`
- **Defined in**: `apps/api/src/routes/tds.ts:90`
- **Permissions**: `accounts.create`, `accounts.edit`, `accounts.view`, `reports.view`
- **Services**: `tcs`
- **Tables touched (by the services used)**: accounts, tcs_collections, tds_challans
- **Screens**: `/accounts/tds`
- **Device app**: -
- **Tests**: `tds.test.ts`


## BNK Banking

### BNK-001 Banking: accounts

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Match your bank statements with the books. (screen text of `/banking`)
- **Routes (10) [F]**: `GET /banking/accounts`; `PUT /banking/accounts/:id/profile`; `POST /banking/accounts/:id/statements`; `POST /banking/accounts/:id/feed/connect`; `POST /banking/accounts/:id/feed/disconnect`; `POST /banking/accounts/:id/feed/fetch`; `GET /banking/accounts/:id/lines`; `GET /banking/accounts/:id/open-entries`; `POST /banking/accounts/:id/apply-rules`; `GET /banking/accounts/:id/reconciliation`
- **Defined in**: `apps/api/src/routes/banking.ts:23`
- **Permissions**: `banking.create`, `banking.edit`, `banking.view`
- **Services**: `banking`
- **Tables touched (by the services used)**: account_groups, accounts, bank_lines, bank_matches, bank_profiles, bank_rules, bank_statements, gateway_settlements, vouchers
- **Screens**: `/banking/[id]`, `/banking`, `/banking/rules`, `/banking/settlements`
- **Device app**: -
- **Tests**: `banking.test.ts`

### BNK-002 Banking: lines

- **Status**: PARTIALLY IMPLEMENTED (file 10)
- **Source comment [F]**: Statement lines with these words are posted to a ledger in one click (bank charges, interest, standing orders). (screen text of `/banking/rules`)
- **Routes (4) [F]**: `POST /banking/lines/:id/match`; `POST /banking/lines/:id/unmatch`; `POST /banking/lines/:id/ignore`; `POST /banking/lines/:id/create`
- **Defined in**: `apps/api/src/routes/banking.ts:53`
- **Permissions**: `banking.create`, `banking.edit`
- **Services**: `banking`
- **Tables touched (by the services used)**: account_groups, accounts, bank_lines, bank_matches, bank_profiles, bank_rules, bank_statements, gateway_settlements, vouchers
- **Screens**: `/banking/[id]`, `/banking/rules`, `/banking/settlements`
- **Device app**: -
- **Tests**: none matched

### BNK-003 Banking: rules

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Statement lines with these words are posted to a ledger in one click (bank charges, interest, standing orders). (screen text of `/banking/rules`)
- **Routes (3) [F]**: `GET /banking/rules`; `POST /banking/rules`; `PUT /banking/rules/:id`
- **Defined in**: `apps/api/src/routes/banking.ts:70`
- **Permissions**: `banking.edit`, `banking.view`
- **Services**: `banking`
- **Tables touched (by the services used)**: account_groups, accounts, bank_lines, bank_matches, bank_profiles, bank_rules, bank_statements, gateway_settlements, vouchers
- **Screens**: `/banking/rules`
- **Device app**: -
- **Tests**: `banking.test.ts`

### BNK-004 Banking: settlements

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Payouts from Razorpay, PhonePe, Paytm and others: collections less refunds, fees and GST on fees, landing in the bank as one credit. (screen text of `/banking/settlements`)
- **Routes (2) [F]**: `GET /banking/settlements`; `POST /banking/settlements`
- **Defined in**: `apps/api/src/routes/banking.ts:74`
- **Permissions**: `banking.create`, `banking.view`
- **Services**: `banking`
- **Tables touched (by the services used)**: account_groups, accounts, bank_lines, bank_matches, bank_profiles, bank_rules, bank_statements, gateway_settlements, vouchers
- **Screens**: `/banking/rules`, `/banking/settlements`
- **Device app**: -
- **Tests**: `banking.test.ts`

### BNK-005 Recon

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Check a customer's or supplier's statement against your ledger. Matching is done by rules; what does not match becomes an exception with a reason, an owner and a history. (screen text of `/accounts/reconciliation`)
- **Routes (9) [F]**: `GET /recon/runs`; `GET /recon/runs/:id`; `POST /recon/runs`; `POST /recon/runs/:id/match`; `POST /recon/runs/:id/unmatch`; `PATCH /recon/items/:id`; `POST /recon/runs/:id/writeoffs`; `POST /recon/writeoffs/:id/decide`; `POST /recon/runs/:id/close`
- **Defined in**: `apps/api/src/routes/recon.ts:17`
- **Permissions**: `accounts.approve`, `accounts.create`, `accounts.view`
- **Services**: `recon`
- **Tables touched (by the services used)**: accounts, recon_events, recon_items, recon_runs, recon_writeoffs, users
- **Screens**: `/accounts/reconciliation`
- **Device app**: -
- **Tests**: `recon.test.ts`


## SAL Sales and Wholesale

### SAL-001 Styles (catalogue)

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Designs sold in colours and sizes. Each colour and size is its own item, with its own barcode and stock. (screen text of `/inventory/styles/[id]`)
- **Routes (2) [F]**: `GET /styles/:id/images`; `POST /styles/:id/images`
- **Defined in**: `apps/api/src/routes/catalogue.ts:34`
- **Permissions**: `inventory.edit`, `inventory.view`, `sales.view`
- **Services**: `catalogue`
- **Tables touched (by the services used)**: accounts, catalogue_selections, colors, files, items, messages, price_list_items, price_lists, style_images, styles
- **Screens**: `/inventory/styles/[id]`, `/inventory/styles`, `/inventory/styles/setup`, `/pos/alterations`, `/pos/billing`, `/pos/returns` (+3 more) (9 screens call it)
- **Device app**: -
- **Tests**: `apparel.test.ts`

### SAL-002 Style images

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Designs sold in colours and sizes. Each colour and size is its own item, with its own barcode and stock. (screen text of `/inventory/styles/[id]`)
- **Routes (1) [F]**: `PATCH /style-images/:id`
- **Defined in**: `apps/api/src/routes/catalogue.ts:39`
- **Permissions**: `inventory.edit`
- **Services**: `catalogue`
- **Tables touched (by the services used)**: accounts, catalogue_selections, colors, files, items, messages, price_list_items, price_lists, style_images, styles
- **Screens**: `/inventory/styles/[id]`, `/inventory/styles`, `/inventory/styles/setup`
- **Device app**: -
- **Tests**: `apparel.test.ts`

### SAL-003 Catalogue

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Every design and colour with its photo, rate, stock and sales. Pick designs for a party, then print, export or share them. (screen text of `/inventory/catalogue/[id]`)
- **Routes (9) [F]**: `GET /catalogue`; `GET /catalogue/selections`; `GET /catalogue/selections/:id`; `POST /catalogue/selections`; `PUT /catalogue/selections/:id`; `DELETE /catalogue/selections/:id`; `POST /catalogue/selections/:id/share`; `DELETE /catalogue/selections/:id/share`; `POST /catalogue/selections/:id/send`
- **Defined in**: `apps/api/src/routes/catalogue.ts:44`
- **Permissions**: `inventory.view`, `sales.create`, `sales.view`
- **Services**: `catalogue`
- **Tables touched (by the services used)**: accounts, catalogue_selections, colors, files, items, messages, price_list_items, price_lists, style_images, styles
- **Screens**: `/inventory/catalogue/[id]`, `/inventory/catalogue`, `/print/catalogue/[id]`
- **Device app**: -
- **Tests**: `apparel.test.ts`

### SAL-004 Public (catalogue)

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Every design and colour with its photo, rate, stock and sales. Pick designs for a party, then print, export or share them. (screen text of `/c/[token]`)
- **Routes (2) [F]**: `GET /public/catalogue/:token`; `GET /public/catalogue/:token/files/:fileId`
- **Defined in**: `apps/api/src/routes/catalogue.ts:83`
- **Permissions**: none declared (public)
- **Services**: `catalogue`
- **Tables touched (by the services used)**: accounts, catalogue_selections, colors, files, items, messages, price_list_items, price_lists, style_images, styles
- **Screens**: `/c/[token]`
- **Device app**: -
- **Tests**: `apparel.test.ts`

### SAL-005 Agents

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Ledgers grouped the way your accountant expects. Customers go under Sundry Debtors, suppliers under Sundry Creditors. (screen text of `/accounts/chart`)
- **Routes (1) [F]**: `GET /agents`
- **Defined in**: `apps/api/src/routes/commission.ts:23`
- **Permissions**: `sales.view`
- **Services**: `accounting`
- **Tables touched (by the services used)**: account_groups, accounts, companies, fiscal_years, gl_entries, number_series, voucher_lines, vouchers
- **Screens**: `/accounts/chart`, `/accounts/gst-jv`, `/accounts/vouchers/new`, `/reports/books`, `/sales/invoices/new`, `/sales/orders/new` (+2 more) (8 screens call it)
- **Device app**: -
- **Tests**: `apparel.test.ts`

### SAL-006 Salesmen

- **Status**: PARTIALLY IMPLEMENTED (file 10)
- **Source comment [F]**: Ledgers grouped the way your accountant expects. Customers go under Sundry Debtors, suppliers under Sundry Creditors. (screen text of `/accounts/chart`)
- **Routes (1) [F]**: `GET /salesmen`
- **Defined in**: `apps/api/src/routes/commission.ts:33`
- **Permissions**: `sales.view`
- **Services**: `accounting`
- **Tables touched (by the services used)**: account_groups, accounts, companies, fiscal_years, gl_entries, number_series, voucher_lines, vouchers
- **Screens**: `/accounts/chart`, `/accounts/gst-jv`, `/accounts/vouchers/new`, `/reports/books`, `/sales/invoices/new`, `/sales/orders/new` (+3 more) (9 screens call it)
- **Device app**: -
- **Tests**: none matched

### SAL-007 Reports: agent commission

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Commission on money received from the customers each agent brought. Goods returned take it back. (screen text of `/sales/commission`)
- **Routes (1) [F]**: `GET /reports/agent-commission`
- **Defined in**: `apps/api/src/routes/commission.ts:42`
- **Permissions**: `special.seeAgentCommission`
- **Services**: `commission`
- **Tables touched (by the services used)**: accounts, brokerage_bills, employees, sales_invoices, sales_targets
- **Screens**: `/sales/commission`
- **Device app**: -
- **Tests**: `apparel.test.ts`, `rights.test.ts`

### SAL-008 Brokerage bills

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Commission on money received from the customers each agent brought. Goods returned take it back. (screen text of `/sales/commission`)
- **Routes (4) [F]**: `GET /brokerage-bills`; `GET /brokerage-bills/:id`; `POST /brokerage-bills`; `POST /brokerage-bills/:id/cancel`
- **Defined in**: `apps/api/src/routes/commission.ts:48`
- **Permissions**: `accounts.cancel`, `accounts.create`, `accounts.view`
- **Services**: `commission`
- **Tables touched (by the services used)**: accounts, brokerage_bills, employees, sales_invoices, sales_targets
- **Screens**: `/sales/commission`
- **Device app**: -
- **Tests**: `apparel.test.ts`

### SAL-009 Reports: salesman

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Monthly targets with commission slabs, against each salesman's invoiced sales less returns. (screen text of `/sales/targets`)
- **Routes (1) [F]**: `GET /reports/salesman`
- **Defined in**: `apps/api/src/routes/commission.ts:76`
- **Permissions**: `sales.view`
- **Services**: `commission`
- **Tables touched (by the services used)**: accounts, brokerage_bills, employees, sales_invoices, sales_targets
- **Screens**: `/sales/targets`
- **Device app**: -
- **Tests**: `apparel.test.ts`

### SAL-010 Reports: salesman year

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Monthly targets with commission slabs, against each salesman's invoiced sales less returns. (screen text of `/sales/targets`)
- **Routes (1) [F]**: `GET /reports/salesman-year`
- **Defined in**: `apps/api/src/routes/commission.ts:81`
- **Permissions**: `sales.view`
- **Services**: `commission`
- **Tables touched (by the services used)**: accounts, brokerage_bills, employees, sales_invoices, sales_targets
- **Screens**: `/sales/targets`
- **Device app**: -
- **Tests**: `helpercomm.test.ts`

### SAL-011 Sales targets

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Monthly targets with commission slabs, against each salesman's invoiced sales less returns. (screen text of `/sales/targets`)
- **Routes (1) [F]**: `PUT /sales-targets/:month`
- **Defined in**: `apps/api/src/routes/commission.ts:86`
- **Permissions**: `sales.approve`
- **Services**: `commission`
- **Tables touched (by the services used)**: accounts, brokerage_bills, employees, sales_invoices, sales_targets
- **Screens**: `/sales/targets`
- **Device app**: -
- **Tests**: `apparel.test.ts`, `helpercomm.test.ts`

### SAL-012 Consignees

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Goods kept at other stores stay yours until they sell. Send stock, take it back, and bill what their sales report says was sold. (screen text of `/sales/consignment`)
- **Routes (4) [F]**: `GET /consignees`; `GET /consignees/:customerId`; `GET /consignees/:customerId/terms`; `PUT /consignees/:customerId/terms`
- **Defined in**: `apps/api/src/routes/consignment.ts:22`
- **Permissions**: `sales.edit`, `sales.view`
- **Services**: `consignment`
- **Tables touched (by the services used)**: account_groups, accounts, consignee_terms, consignment_moves, items, price_list_items, price_lists, warehouses
- **Screens**: `/sales/consignment`
- **Device app**: -
- **Tests**: `apparel.test.ts`, `consigneestatements.test.ts`, `consigneeterms.test.ts`

### SAL-013 Reports: consignment sales

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Goods billed from consignment stock, grouped the way you ask. (screen text of `/reports/consignment-sales`)
- **Routes (1) [F]**: `GET /reports/consignment-sales`
- **Defined in**: `apps/api/src/routes/consignment.ts:40`
- **Permissions**: `sales.view`
- **Services**: `consignment`
- **Tables touched (by the services used)**: account_groups, accounts, consignee_terms, consignment_moves, items, price_list_items, price_lists, warehouses
- **Screens**: `/reports/consignment-sales`
- **Device app**: -
- **Tests**: `consigneestatements.test.ts`

### SAL-014 Consignment

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Goods kept at other stores stay yours until they sell. Send stock, take it back, and bill what their sales report says was sold. (screen text of `/sales/consignment`)
- **Routes (3) [F]**: `POST /consignment/send`; `POST /consignment/return`; `POST /consignment/sales`
- **Defined in**: `apps/api/src/routes/consignment.ts:44`
- **Permissions**: `sales.create`
- **Services**: `consignment`
- **Tables touched (by the services used)**: account_groups, accounts, consignee_terms, consignment_moves, items, price_list_items, price_lists, warehouses
- **Screens**: `/sales/consignment`
- **Device app**: -
- **Tests**: `apparel.test.ts`, `consigneestatements.test.ts`, `consigneeterms.test.ts`

### SAL-015 Delivery orders

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Tell the warehouse what to send. No stock moves until a challan is made against the order. (screen text of `/sales/delivery-orders/[id]`)
- **Routes (5) [F]**: `GET /delivery-orders`; `GET /delivery-orders/:id`; `POST /delivery-orders`; `POST /delivery-orders/:id/close`; `POST /delivery-orders/:id/cancel`
- **Defined in**: `apps/api/src/routes/deliveryorders.ts:22`
- **Permissions**: `sales.cancel`, `sales.create`, `sales.view`
- **Services**: `deliveryorders`
- **Tables touched (by the services used)**: accounts, delivery_note_lines, delivery_notes, delivery_order_lines, delivery_orders, sales_order_lines, sales_orders
- **Screens**: `/sales/deliveries/new`, `/sales/delivery-orders/[id]`, `/sales/delivery-orders/new`, `/sales/delivery-orders`
- **Device app**: -
- **Tests**: `deliveryorders.test.ts`, `lifecycle.test.ts`, `yearend.test.ts`

### SAL-016 Lr entries

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: Consignments sent through transporters, newest first, with the invoice and customer they belong to.
- **Routes (3) [F]**: `GET /lr-entries`; `POST /lr-entries`; `PATCH /lr-entries/:id`
- **Defined in**: `apps/api/src/routes/lr.ts:24`
- **Permissions**: `sales.create`, `sales.edit`, `sales.view`
- **Services**: `lr`
- **Tables touched (by the services used)**: accounts, lr_entries, sales_invoices
- **Screens**: none found
- **Device app**: -
- **Tests**: `lr.test.ts`

### SAL-017 Reports: sales order register

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Sales orders still to be fulfilled, with what is pending and its value. Orders past their promised date come first. (screen text of `/reports/sales-order-register`)
- **Routes (1) [F]**: `GET /reports/sales-order-register`
- **Defined in**: `apps/api/src/routes/orderregister.ts:10`
- **Permissions**: `sales.view`
- **Services**: `orderregister`
- **Tables touched (by the services used)**: -
- **Screens**: `/reports/sales-order-register`
- **Device app**: -
- **Tests**: `orderregister.test.ts`

### SAL-018 Price lists

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Wholesale, distributor or retailer rates. A customer on a list gets its rates on new orders and invoices. (screen text of `/sales/price-lists`)
- **Routes (5) [F]**: `GET /price-lists`; `GET /price-lists/:id`; `GET /price-lists/:id/rates`; `POST /price-lists`; `PUT /price-lists/:id`
- **Defined in**: `apps/api/src/routes/pricelists.ts:23`
- **Permissions**: `sales.edit`, `sales.view`
- **Services**: `accounting`
- **Tables touched (by the services used)**: account_groups, accounts, companies, fiscal_years, gl_entries, number_series, voucher_lines, vouchers
- **Screens**: `/accounts/chart`, `/accounts/gst-jv`, `/accounts/vouchers/new`, `/reports/books`, `/sales/invoices/new`, `/sales/orders/new` (+3 more) (9 screens call it)
- **Device app**: -
- **Tests**: `apparel.test.ts`

### SAL-019 Reports: interest

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Simple interest on each bill for the days it is past due, at the customer's rate. (screen text of `/reports/interest`)
- **Routes (1) [F]**: `GET /reports/interest`
- **Defined in**: `apps/api/src/routes/pricelists.ts:101`
- **Permissions**: `reports.view`
- **Services**: `returns`
- **Tables touched (by the services used)**: bill_allocations, branches, credit_note_lines, credit_notes, items, pos_bill_lines, pos_bills, pos_returns, sales_invoice_lines, sales_invoices (+1 more)
- **Screens**: `/reports/interest`
- **Device app**: -
- **Tests**: `apparel.test.ts`

### SAL-020 Quotations

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Price quotes for customers. No stock or accounts effect until converted. (screen text of `/sales/quotations`)
- **Routes (4) [F]**: `GET /quotations/:id`; `GET /quotations/:id/print`; `POST /quotations`; `POST /quotations/:id/${action}`
- **Defined in**: `apps/api/src/routes/sales.ts:86`
- **Permissions**: `sales.create`, `sales.view`
- **Services**: `accounting`, `sales`
- **Tables touched (by the services used)**: account_groups, accounts, branches, credit_note_lines, credit_notes, delivery_note_lines, delivery_notes, delivery_returns, employees, gst_settings (+19 more)
- **Screens**: `/sales/proformas/[id]`, `/sales/quotations/[id]`, `/print/quotation/[id]`
- **Device app**: -
- **Tests**: `apparel.test.ts`, `sales.test.ts`

### SAL-021 Sales orders

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Tell the warehouse what to send. No stock moves until a challan is made against the order. (screen text of `/sales/delivery-orders/new`)
- **Routes (4) [F]**: `GET /sales-orders/:id`; `POST /sales-orders`; `POST /sales-orders/:id/close`; `POST /sales-orders/:id/cancel`
- **Defined in**: `apps/api/src/routes/sales.ts:87`
- **Permissions**: `sales.cancel`, `sales.create`, `sales.edit`, `sales.view`
- **Services**: `sales`
- **Tables touched (by the services used)**: account_groups, accounts, branches, credit_note_lines, credit_notes, delivery_note_lines, delivery_notes, delivery_returns, employees, gst_settings (+13 more)
- **Screens**: `/inventory/catalogue/[id]`, `/sales/deliveries/new`, `/sales/delivery-orders/new`, `/sales/invoices/new`, `/sales/orders/[id]`, `/print/catalogue/[id]`
- **Device app**: -
- **Tests**: `apparel.test.ts`, `deliveryorders.test.ts`, `lifecycle.test.ts`, `manufacturing.test.ts`, `orderregister.test.ts` (+4 more)

### SAL-022 Delivery notes

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Goods sent out before (or without) an invoice. Stock goes down on delivery. (screen text of `/sales/deliveries/new`)
- **Routes (5) [F]**: `GET /delivery-notes/:id`; `GET /delivery-notes/:id/print`; `POST /delivery-notes`; `POST /delivery-notes/:id/returns`; `POST /delivery-notes/:id/cancel`
- **Defined in**: `apps/api/src/routes/sales.ts:88`
- **Permissions**: `sales.cancel`, `sales.create`, `sales.view`
- **Services**: `accounting`, `sales`
- **Tables touched (by the services used)**: account_groups, accounts, branches, credit_note_lines, credit_notes, delivery_note_lines, delivery_notes, delivery_returns, employees, gst_settings (+19 more)
- **Screens**: `/sales/deliveries/[id]`, `/sales/deliveries/new`, `/sales/invoices/new`, `/print/challan/[id]`
- **Device app**: -
- **Tests**: `apparel.test.ts`, `commwiring.test.ts`, `deliveryorders.test.ts`, `lifecycle.test.ts`, `orderregister.test.ts` (+2 more)

### SAL-023 Approvals

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Approval memos with goods still with the customer. Take back what didn't sell; invoice the rest within six months. (screen text of `/sales/approvals`)
- **Routes (1) [F]**: `GET /approvals/pending`
- **Defined in**: `apps/api/src/routes/sales.ts:96`
- **Permissions**: `sales.view`
- **Services**: `accounting`, `sales`
- **Tables touched (by the services used)**: account_groups, accounts, branches, companies, credit_note_lines, credit_notes, delivery_note_lines, delivery_notes, delivery_returns, employees (+19 more)
- **Screens**: `/sales/approvals`
- **Device app**: -
- **Tests**: `apparel.test.ts`, `samples.test.ts`

### SAL-024 Samples

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Samples sent to parties and not yet back. They are not a sale and carry no tax. Take back what is not kept. (screen text of `/sales/samples`)
- **Routes (1) [F]**: `GET /samples/pending`
- **Defined in**: `apps/api/src/routes/sales.ts:102`
- **Permissions**: `sales.view`
- **Services**: `accounting`, `sales`
- **Tables touched (by the services used)**: account_groups, accounts, branches, companies, credit_note_lines, credit_notes, delivery_note_lines, delivery_notes, delivery_returns, employees (+19 more)
- **Screens**: `/sales/samples`
- **Device app**: -
- **Tests**: `samples.test.ts`

### SAL-025 Sales invoices (sales)

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Tax invoices. Each one posts to sales, output GST and the customer's account. (screen text of `/sales/invoices`)
- **Routes (9) [F]**: `GET /sales-invoices/:id/early-discount`; `GET /sales-invoices/:id`; `GET /sales-invoices/:id/print`; `POST /sales-invoices`; `POST /sales-invoices/:id/cancel`; `POST /sales-invoices/:id/eway-bill`; `POST /sales-invoices/:id/eway-bill/vehicle`; `POST /sales-invoices/:id/eway-bill/extend`; `POST /sales-invoices/:id/eway-bill/cancel`
- **Defined in**: `apps/api/src/routes/sales.ts:129`
- **Permissions**: `gst.cancel`, `gst.submit`, `sales.cancel`, `sales.create`, `sales.view`
- **Services**: `sales`, `sharing`
- **Tables touched (by the services used)**: accounts, branches, gst_settings, items, sales_invoice_lines, sales_invoices, uoms, account_groups, credit_note_lines, credit_notes (+18 more)
- **Screens**: `/sales/invoices/[id]`, `/sales/lr`, `/print/box-label/[id]`, `/print/eway-bill/[id]`, `/print/invoice/[id]`, `/print/packing-slip/[id]` (+1 more) (7 screens call it)
- **Device app**: -
- **Tests**: `apparel.test.ts`, `billreceipts.test.ts`, `cartons.test.ts`, `cfo.test.ts`, `commwiring.test.ts` (+24 more)

### SAL-026 Credit notes

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Sales returns and price reductions after sale. (screen text of `/sales/credit-notes`)
- **Routes (3) [F]**: `GET /credit-notes/:id`; `POST /credit-notes`; `POST /credit-notes/:id/cancel`
- **Defined in**: `apps/api/src/routes/sales.ts:135`
- **Permissions**: `sales.cancel`, `sales.create`, `sales.view`
- **Services**: `sales`
- **Tables touched (by the services used)**: account_groups, accounts, branches, credit_note_lines, credit_notes, delivery_note_lines, delivery_notes, delivery_returns, employees, gst_settings (+13 more)
- **Screens**: `/sales/credit-notes/[id]`, `/sales/invoices/[id]`
- **Device app**: -
- **Tests**: `apparel.test.ts`, `sales.test.ts`

### SAL-027 E-invoice generate and cancel (invoices and credit notes, templated route)

- **Status**: DEMO / PLACEHOLDER (file 10)
- **Source comment [F]**: The customer must be a ledger under Sundry Debtors (or a sub-group of it).
- **Routes (2) [F]**: `POST /${path}/:id/einvoice`; `POST /${path}/:id/einvoice/cancel`
- **Defined in**: `apps/api/src/routes/sales.ts:272`
- **Permissions**: `gst.cancel`, `gst.submit`
- **Services**: `sales`
- **Tables touched (by the services used)**: account_groups, accounts, branches, credit_note_lines, credit_notes, delivery_note_lines, delivery_notes, delivery_returns, employees, gst_settings (+13 more)
- **Screens**: none found
- **Device app**: -
- **Tests**: none matched

### SAL-028 Salesman commission

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Commission by item, brand, category or MRP range. For each sale the most specific matching rule decides the percentage. (screen text of `/sales/commission-rules`)
- **Routes (5) [F]**: `GET /salesman-commission/rules`; `POST /salesman-commission/rules`; `PUT /salesman-commission/rules/:id`; `DELETE /salesman-commission/rules/:id`; `GET /salesman-commission/report`
- **Defined in**: `apps/api/src/routes/salesmancomm.ts:18`
- **Permissions**: `payroll.edit`, `payroll.view`
- **Services**: `salesmancomm`
- **Tables touched (by the services used)**: items, salesman_commission_rules
- **Screens**: `/sales/commission-rules`
- **Device app**: -
- **Tests**: `helpercomm.test.ts`, `salesmancomm.test.ts`, `schemeflags.test.ts`

### SAL-029 Sales invoices (sharing)

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: Tax invoices. Each one posts to sales, output GST and the customer's account. (screen text of `/sales/invoices`)
- **Routes (1) [F]**: `POST /sales-invoices/:id/send`
- **Defined in**: `apps/api/src/routes/sharing.ts:23`
- **Permissions**: `sales.create`
- **Services**: `sharing`
- **Tables touched (by the services used)**: accounts, branches, gst_settings, items, message_templates, messages, pos_bills, sales_invoice_lines, sales_invoices, shared_documents (+2 more)
- **Screens**: none found
- **Device app**: -
- **Tests**: `whatsapp.test.ts`

### SAL-030 Reminders

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Payment reminders with a link to each customer's statement: to the customers asked for, or to every customer with something outstanding (only those with overdue bills when `overdueOnly`). Customers without a mobile number are skipped and listed so someone can call them.
- **Routes (1) [F]**: `POST /reminders/payments`
- **Defined in**: `apps/api/src/routes/sharing.ts:27`
- **Permissions**: `crm.create`
- **Services**: `sharing`
- **Tables touched (by the services used)**: accounts, branches, gst_settings, items, message_templates, messages, pos_bills, sales_invoice_lines, sales_invoices, shared_documents (+2 more)
- **Screens**: `/reports/payables`, `/reports/receivables`
- **Device app**: -
- **Tests**: `whatsapp.test.ts`

### SAL-031 Messages

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: The message log: what went out, to whom, and whether it was delivered to the provider.
- **Routes (1) [F]**: `GET /messages`
- **Defined in**: `apps/api/src/routes/sharing.ts:31`
- **Permissions**: `crm.view`
- **Services**: `sharing`
- **Tables touched (by the services used)**: accounts, branches, gst_settings, items, message_templates, messages, pos_bills, sales_invoice_lines, sales_invoices, shared_documents (+2 more)
- **Screens**: none found
- **Device app**: -
- **Tests**: `whatsapp.test.ts`

### SAL-032 Public (sharing)

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: The document behind a shared link, as the customer may see it (nothing about who billed or approved).
- **Routes (1) [F]**: `GET /public/documents/:token`
- **Defined in**: `apps/api/src/routes/sharing.ts:41`
- **Permissions**: none declared (public)
- **Services**: `sharing`
- **Tables touched (by the services used)**: accounts, branches, gst_settings, items, message_templates, messages, pos_bills, sales_invoice_lines, sales_invoices, shared_documents (+2 more)
- **Screens**: `/b/[token]`
- **Device app**: -
- **Tests**: `whatsapp.test.ts`


## POS Counter, Retail and Service Desk

### POS-001 Karigars

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Take garments in for fitting, give them to a karigar, and hand them back on the promised day. (screen text of `/pos/alterations`)
- **Routes (3) [F]**: `GET /karigars`; `POST /karigars`; `PUT /karigars/:id`
- **Defined in**: `apps/api/src/routes/alterations.ts:27`
- **Permissions**: `sales.edit`, `sales.view`
- **Services**: `accounting`, `alterations`
- **Tables touched (by the services used)**: account_groups, accounts, alteration_types, alterations, employees, items, karigars, pos_bills, uoms, companies (+5 more)
- **Screens**: `/pos/alterations`, `/pos/tailoring`
- **Device app**: -
- **Tests**: `apparel.test.ts`

### POS-002 Alteration types

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Take garments in for fitting, give them to a karigar, and hand them back on the promised day. (screen text of `/pos/alterations`)
- **Routes (3) [F]**: `GET /alteration-types`; `POST /alteration-types`; `PUT /alteration-types/:id`
- **Defined in**: `apps/api/src/routes/alterations.ts:35`
- **Permissions**: `sales.edit`, `sales.view`
- **Services**: `accounting`, `alterations`
- **Tables touched (by the services used)**: account_groups, accounts, alteration_types, alterations, employees, items, karigars, pos_bills, uoms, companies (+5 more)
- **Screens**: `/pos/alterations`
- **Device app**: -
- **Tests**: `apparel.test.ts`

### POS-003 Alterations

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Take garments in for fitting, give them to a karigar, and hand them back on the promised day. (screen text of `/pos/alterations`)
- **Routes (7) [F]**: `GET /alterations`; `GET /alterations/labour`; `POST /alterations`; `POST /alterations/:id/issue`; `POST /alterations/:id/receive`; `POST /alterations/:id/deliver`; `POST /alterations/:id/cancel`
- **Defined in**: `apps/api/src/routes/alterations.ts:42`
- **Permissions**: `sales.cancel`, `sales.create`, `sales.view`
- **Services**: `alterations`
- **Tables touched (by the services used)**: account_groups, accounts, alteration_types, alterations, employees, items, karigars, pos_bills, uoms
- **Screens**: `/pos/alterations`
- **Device app**: -
- **Tests**: `apparel.test.ts`

### POS-004 Approval memos

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Pieces a customer has taken to try or show. They stay on the books until billed or brought back. (screen text of `/sales/approval-memos`)
- **Routes (5) [F]**: `GET /approval-memos`; `GET /approval-memos/by-number`; `GET /approval-memos/:id`; `POST /approval-memos`; `POST /approval-memos/:id/return`
- **Defined in**: `apps/api/src/routes/approvalmemos.ts:17`
- **Permissions**: `sales.create`, `sales.edit`, `sales.view`
- **Services**: `approvalmemos`
- **Tables touched (by the services used)**: approval_memo_lines, approval_memos, items, warehouses
- **Screens**: `/pos/billing`, `/sales/approval-memos`
- **Device app**: -
- **Tests**: `approvalmemos.test.ts`, `commwiring.test.ts`

### POS-005 Branch prices

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Each store can sell an item at its own rate over the usual one. Items with no entry sell at the usual rate. (screen text of `/inventory/branch-prices`)
- **Routes (5) [F]**: `GET /branch-prices`; `POST /branch-prices`; `POST /branch-prices/import`; `POST /branch-prices/copy`; `DELETE /branch-prices/:id`
- **Defined in**: `apps/api/src/routes/branchprices.ts:19`
- **Permissions**: `sales.edit`, `sales.view`
- **Services**: `branchprices`
- **Tables touched (by the services used)**: branch_prices, items, warehouses
- **Screens**: `/inventory/branch-prices`
- **Device app**: -
- **Tests**: `branchprices.test.ts`

### POS-006 Pos: branch prices

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Take garments in for fitting, give them to a karigar, and hand them back on the promised day. (screen text of `/pos/alterations`)
- **Routes (1) [F]**: `GET /pos/branch-prices`
- **Defined in**: `apps/api/src/routes/branchprices.ts:44`
- **Permissions**: `sales.view`
- **Services**: `branchprices`
- **Tables touched (by the services used)**: branch_prices, items, warehouses
- **Screens**: `/pos/alterations`, `/pos/billing`, `/pos/returns`, `/pos/tailoring`, `/settings/pos`
- **Device app**: -
- **Tests**: `branchprices.test.ts`

### POS-007 Reports: daily sales

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: One day of selling: sales net of returns, bills, what moved through cash and the bank, and the best sellers. (screen text of `/reports/daily-sales`)
- **Routes (1) [F]**: `GET /reports/daily-sales`
- **Defined in**: `apps/api/src/routes/dailysales.ts:10`
- **Permissions**: `reports.view`
- **Services**: `dailysales`
- **Tables touched (by the services used)**: -
- **Screens**: `/reports/daily-sales`
- **Device app**: -
- **Tests**: `dailysales.test.ts`

### POS-008 Reports: discounts

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Every discounted line on invoices and counter bills in the period, and which items are discounted most. (screen text of `/reports/discounts`)
- **Routes (1) [F]**: `GET /reports/discounts`
- **Defined in**: `apps/api/src/routes/discounts.ts:12`
- **Permissions**: `reports.view`
- **Services**: `discounts`
- **Tables touched (by the services used)**: -
- **Screens**: `/reports/discounts`
- **Device app**: -
- **Tests**: `discounts.test.ts`

### POS-009 Loyalty

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: The points the shop owes, who to wish this fortnight, and each member's birthday and anniversary. (screen text of `/pos/loyalty`)
- **Routes (4) [F]**: `GET /loyalty/members`; `PATCH /loyalty/members/:phone`; `GET /loyalty/upcoming`; `GET /loyalty/report`
- **Defined in**: `apps/api/src/routes/loyalty.ts:15`
- **Permissions**: `sales.edit`, `sales.view`
- **Services**: `loyalty`
- **Tables touched (by the services used)**: loyalty_members, pos_bills
- **Screens**: `/pos/loyalty`
- **Device app**: -
- **Tests**: `loyalty.test.ts`, `loyaltyvalidity.test.ts`

### POS-010 Schemes

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Offers the counter applies on its own: percent off, amount off, buy X get Y, slabs and combos. (screen text of `/pos/schemes`)
- **Routes (3) [F]**: `GET /schemes`; `POST /schemes`; `PUT /schemes/:id`
- **Defined in**: `apps/api/src/routes/pos.ts:61`
- **Permissions**: `sales.edit`, `sales.view`
- **Services**: `schemes`
- **Tables touched (by the services used)**: items, schemes, styles, warehouses
- **Screens**: `/pos/schemes`
- **Device app**: -
- **Tests**: `apparel.test.ts`, `schemeflags.test.ts`, `schemelists.test.ts`

### POS-011 Pos: schemes

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Offers the counter applies on its own: percent off, amount off, buy X get Y, slabs and combos. (screen text of `/pos/schemes`)
- **Routes (1) [F]**: `GET /pos/schemes`
- **Defined in**: `apps/api/src/routes/pos.ts:62`
- **Permissions**: `sales.view`
- **Services**: `accounting`, `schemes`
- **Tables touched (by the services used)**: account_groups, accounts, companies, fiscal_years, gl_entries, items, number_series, schemes, styles, voucher_lines (+2 more)
- **Screens**: `/pos/billing`
- **Device app**: -
- **Tests**: `apparel.test.ts`, `schemelists.test.ts`

### POS-012 Pos: settings

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Pricing, loyalty points, discount limits and counters. (screen text of `/settings/pos`)
- **Routes (2) [F]**: `GET /pos/settings`; `PUT /pos/settings`
- **Defined in**: `apps/api/src/routes/pos.ts:72`
- **Permissions**: `sales.edit`, `sales.view`
- **Services**: `accounting`, `pos`
- **Tables touched (by the services used)**: account_groups, accounts, branches, coupons, devices, employees, gift_vouchers, items, loyalty_members, pos_bill_lines (+15 more)
- **Screens**: `/pos/billing`, `/settings/pos`
- **Device app**: -
- **Tests**: `apparel.test.ts`, `approvalmemos.test.ts`, `branchprices.test.ts`, `commitments.test.ts`, `dailysales.test.ts` (+12 more)

### POS-013 Pos: terminals

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Take garments in for fitting, give them to a karigar, and hand them back on the promised day. (screen text of `/pos/alterations`)
- **Routes (3) [F]**: `GET /pos/terminals`; `POST /pos/terminals`; `PUT /pos/terminals/:id`
- **Defined in**: `apps/api/src/routes/pos.ts:88`
- **Permissions**: `sales.edit`, `sales.view`
- **Services**: `pos`
- **Tables touched (by the services used)**: account_groups, accounts, branches, coupons, devices, employees, gift_vouchers, items, loyalty_members, pos_bill_lines (+9 more)
- **Screens**: `/pos/alterations`, `/pos/billing`, `/pos/returns`, `/pos/tailoring`, `/settings/pos`
- **Device app**: -
- **Tests**: `apparel.test.ts`, `approvalmemos.test.ts`, `branchprices.test.ts`, `close.test.ts`, `commitments.test.ts` (+20 more)

### POS-014 Pos: sessions (pos)

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Check what is still open before a month ends, sign off what you accept, save the month's reports, and settle each day's counter cash. (screen text of `/accounts/close`)
- **Routes (3) [F]**: `POST /pos/sessions`; `GET /pos/sessions/:id`; `POST /pos/sessions/:id/close`
- **Defined in**: `apps/api/src/routes/pos.ts:93`
- **Permissions**: `sales.create`, `sales.view`
- **Services**: `pos`
- **Tables touched (by the services used)**: account_groups, accounts, branches, coupons, devices, employees, gift_vouchers, items, loyalty_members, pos_bill_lines (+9 more)
- **Screens**: `/accounts/close`, `/pos/alterations`, `/pos/billing`, `/pos/returns`, `/pos/tailoring`, `/settings/pos`
- **Device app**: -
- **Tests**: `apparel.test.ts`, `approvalmemos.test.ts`, `branchprices.test.ts`, `close.test.ts`, `commitments.test.ts` (+20 more)

### POS-015 Pos: bills

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Bills from all counters for a day. (screen text of `/pos/bills`)
- **Routes (6) [F]**: `GET /pos/bills`; `GET /pos/bills/lookup`; `GET /pos/bills/:id`; `POST /pos/bills`; `POST /pos/bills/:id/send`; `POST /pos/bills/:id/void`
- **Defined in**: `apps/api/src/routes/pos.ts:103`
- **Permissions**: `sales.cancel`, `sales.create`, `sales.view`
- **Services**: `pos`, `sharing`
- **Tables touched (by the services used)**: accounts, branches, items, pos_bills, account_groups, coupons, devices, employees, gift_vouchers, loyalty_members (+17 more)
- **Screens**: `/pos/alterations`, `/pos/billing`, `/pos/bills`, `/pos/returns`, `/pos/tailoring`, `/settings/pos` (+1 more) (7 screens call it)
- **Device app**: -
- **Tests**: `apparel.test.ts`, `approvalmemos.test.ts`, `branchprices.test.ts`, `commitments.test.ts`, `dailysales.test.ts` (+19 more)

### POS-016 Pos: returns

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Take goods back against a bill. For a size or colour swap, give store credit and bill the new piece with it. (screen text of `/pos/returns`)
- **Routes (2) [F]**: `POST /pos/returns`; `GET /pos/returns`
- **Defined in**: `apps/api/src/routes/pos.ts:112`
- **Permissions**: `sales.create`, `sales.view`
- **Services**: `pos`
- **Tables touched (by the services used)**: account_groups, accounts, branches, coupons, devices, employees, gift_vouchers, items, loyalty_members, pos_bill_lines (+9 more)
- **Screens**: `/pos/returns`
- **Device app**: -
- **Tests**: `apparel.test.ts`, `helpercomm.test.ts`, `salesmancomm.test.ts`, `schemelists.test.ts`, `serials.test.ts`

### POS-017 Pos: summary

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Every entry, screen and report in one place. The star pins a tile to My Menu. (screen text of `/my-menu`)
- **Routes (1) [F]**: `GET /pos/summary`
- **Defined in**: `apps/api/src/routes/pos.ts:149`
- **Permissions**: `sales.view`
- **Services**: `pos`
- **Tables touched (by the services used)**: account_groups, accounts, branches, coupons, devices, employees, gift_vouchers, items, loyalty_members, pos_bill_lines (+9 more)
- **Screens**: `/my-menu`, `/pos/bills`
- **Device app**: `/pos/summary`
- **Tests**: `apparel.test.ts`, `pos.test.ts`

### POS-018 Pos: held

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Take garments in for fitting, give them to a karigar, and hand them back on the promised day. (screen text of `/pos/alterations`)
- **Routes (3) [F]**: `GET /pos/held`; `POST /pos/held`; `POST /pos/held/:id/resume`
- **Defined in**: `apps/api/src/routes/pos.ts:154`
- **Permissions**: `sales.create`, `sales.view`
- **Services**: `pos`
- **Tables touched (by the services used)**: account_groups, accounts, branches, coupons, devices, employees, gift_vouchers, items, loyalty_members, pos_bill_lines (+9 more)
- **Screens**: `/pos/alterations`, `/pos/billing`, `/pos/returns`, `/pos/tailoring`, `/settings/pos`
- **Device app**: -
- **Tests**: `pos.test.ts`

### POS-019 Pos: salesmen

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Staff who can be named as the salesman on a counter bill.
- **Routes (1) [F]**: `GET /pos/salesmen`
- **Defined in**: `apps/api/src/routes/pos.ts:163`
- **Permissions**: `sales.view`
- **Services**: `pos`
- **Tables touched (by the services used)**: account_groups, accounts, branches, coupons, devices, employees, gift_vouchers, items, loyalty_members, pos_bill_lines (+9 more)
- **Screens**: `/pos/billing`
- **Device app**: -
- **Tests**: `pos.test.ts`

### POS-020 Pos: customers

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Take garments in for fitting, give them to a karigar, and hand them back on the promised day. (screen text of `/pos/alterations`)
- **Routes (1) [F]**: `GET /pos/customers/:phone`
- **Defined in**: `apps/api/src/routes/pos.ts:164`
- **Permissions**: `sales.view`
- **Services**: `pos`
- **Tables touched (by the services used)**: account_groups, accounts, branches, coupons, devices, employees, gift_vouchers, items, loyalty_members, pos_bill_lines (+9 more)
- **Screens**: `/pos/alterations`, `/pos/billing`, `/pos/bills`, `/pos/returns`, `/pos/tailoring`, `/settings/pos`
- **Device app**: -
- **Tests**: `pos.test.ts`

### POS-021 Pos: loyalty

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: The points the shop owes, who to wish this fortnight, and each member's birthday and anniversary. (screen text of `/pos/loyalty`)
- **Routes (1) [F]**: `GET /pos/loyalty/:phone`
- **Defined in**: `apps/api/src/routes/pos.ts:168`
- **Permissions**: `sales.view`
- **Services**: `pos`
- **Tables touched (by the services used)**: account_groups, accounts, branches, coupons, devices, employees, gift_vouchers, items, loyalty_members, pos_bill_lines (+9 more)
- **Screens**: none found
- **Device app**: -
- **Tests**: `apparel.test.ts`, `loyaltyvalidity.test.ts`, `pos.test.ts`

### POS-022 Repairs

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Repairs from intake to hand-back: diagnosis, estimate, approval, the bench and delivery. Deposits and charges are tracked here and are not posted to the books. (screen text of `/sales/repairs`)
- **Routes (6) [F]**: `GET /repairs`; `GET /repairs/from-sale`; `GET /repairs/open`; `GET /repairs/:id`; `POST /repairs`; `POST /repairs/:id/act`
- **Defined in**: `apps/api/src/routes/repairs.ts:28`
- **Permissions**: `sales.create`, `sales.edit`, `sales.view`
- **Services**: `repairs`
- **Tables touched (by the services used)**: accounts, branches, inquiries, items, pos_bill_lines, pos_bills, repair_jobs, sales_invoice_lines, sales_invoices, sales_order_lines (+2 more)
- **Screens**: `/sales/repairs`
- **Device app**: -
- **Tests**: `repairs.test.ts`, `repairsource.test.ts`, `servicedesk.test.ts`

### POS-023 Inquiries

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Questions asked at the counter that may turn into work, each with a day to follow up. (screen text of `/sales/inquiries`)
- **Routes (3) [F]**: `GET /inquiries`; `POST /inquiries`; `POST /inquiries/:id/close`
- **Defined in**: `apps/api/src/routes/repairs.ts:57`
- **Permissions**: `sales.create`, `sales.edit`, `sales.view`
- **Services**: `repairs`
- **Tables touched (by the services used)**: accounts, branches, inquiries, items, pos_bill_lines, pos_bills, repair_jobs, sales_invoice_lines, sales_invoices, sales_order_lines (+2 more)
- **Screens**: `/sales/inquiries`
- **Device app**: -
- **Tests**: `servicedesk.test.ts`

### POS-024 Reports: service customers

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: What each customer paid up front and still sits with you, and what is left to collect on work that is ready. (screen text of `/sales/service-customers`)
- **Routes (1) [F]**: `GET /reports/service-customers`
- **Defined in**: `apps/api/src/routes/repairs.ts:72`
- **Permissions**: `sales.view`
- **Services**: `repairs`
- **Tables touched (by the services used)**: accounts, branches, inquiries, items, pos_bill_lines, pos_bills, repair_jobs, sales_invoice_lines, sales_invoices, sales_order_lines (+2 more)
- **Screens**: `/sales/service-customers`
- **Device app**: -
- **Tests**: `servicedesk.test.ts`

### POS-025 Measurements

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Measurements, an advance, each process through a karigar, and the tailoring bill at delivery. (screen text of `/pos/tailoring`)
- **Routes (3) [F]**: `GET /measurements`; `POST /measurements`; `PUT /measurements/:id`
- **Defined in**: `apps/api/src/routes/tailoring.ts:30`
- **Permissions**: `sales.create`, `sales.view`
- **Services**: `tailoring`
- **Tables touched (by the services used)**: files, gift_vouchers, items, karigars, measurements, tailoring_orders, tailoring_rates
- **Screens**: `/pos/tailoring`
- **Device app**: -
- **Tests**: `apparel.test.ts`

### POS-026 Tailoring rates

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Measurements, an advance, each process through a karigar, and the tailoring bill at delivery. (screen text of `/pos/tailoring`)
- **Routes (2) [F]**: `GET /tailoring-rates`; `PUT /tailoring-rates`
- **Defined in**: `apps/api/src/routes/tailoring.ts:37`
- **Permissions**: `sales.edit`, `sales.view`
- **Services**: `tailoring`
- **Tables touched (by the services used)**: files, gift_vouchers, items, karigars, measurements, tailoring_orders, tailoring_rates
- **Screens**: `/pos/tailoring`
- **Device app**: -
- **Tests**: `apparel.test.ts`

### POS-027 Tailoring orders

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Measurements, an advance, each process through a karigar, and the tailoring bill at delivery. (screen text of `/pos/tailoring`)
- **Routes (7) [F]**: `GET /tailoring-orders`; `POST /tailoring-orders`; `POST /tailoring-orders/:id/assign`; `POST /tailoring-orders/:id/done`; `POST /tailoring-orders/:id/ready`; `POST /tailoring-orders/:id/deliver`; `POST /tailoring-orders/:id/cancel`
- **Defined in**: `apps/api/src/routes/tailoring.ts:43`
- **Permissions**: `sales.cancel`, `sales.create`, `sales.view`
- **Services**: `tailoring`
- **Tables touched (by the services used)**: files, gift_vouchers, items, karigars, measurements, tailoring_orders, tailoring_rates
- **Screens**: `/pos/tailoring`
- **Device app**: -
- **Tests**: `apparel.test.ts`

### POS-028 Gift vouchers

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Gift vouchers, coupon codes, discount cards and lucky draws for the counter. (screen text of `/pos/vouchers`)
- **Routes (4) [F]**: `GET /gift-vouchers`; `GET /gift-vouchers/:code`; `POST /gift-vouchers`; `POST /gift-vouchers/expire`
- **Defined in**: `apps/api/src/routes/vouchers.ts:36`
- **Permissions**: `accounts.create`, `sales.create`, `sales.view`
- **Services**: `vouchers`
- **Tables touched (by the services used)**: accounts, coupons, discount_cards, gift_voucher_redemptions, gift_vouchers, lucky_draws, pos_bills
- **Screens**: `/pos/alterations`, `/pos/billing`, `/pos/bills`, `/pos/returns`, `/pos/tailoring`, `/pos/vouchers` (+1 more) (7 screens call it)
- **Device app**: -
- **Tests**: `apparel.test.ts`

### POS-029 Coupons

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Gift vouchers, coupon codes, discount cards and lucky draws for the counter. (screen text of `/pos/vouchers`)
- **Routes (3) [F]**: `GET /coupons`; `POST /coupons`; `PUT /coupons/:id`
- **Defined in**: `apps/api/src/routes/vouchers.ts:56`
- **Permissions**: `sales.edit`, `sales.view`
- **Services**: `accounting`, `vouchers`
- **Tables touched (by the services used)**: accounts, coupons, discount_cards, gift_voucher_redemptions, gift_vouchers, lucky_draws, pos_bills, account_groups, companies, fiscal_years (+4 more)
- **Screens**: `/pos/vouchers`
- **Device app**: -
- **Tests**: `apparel.test.ts`, `schemelists.test.ts`

### POS-030 Discount cards

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Gift vouchers, coupon codes, discount cards and lucky draws for the counter. (screen text of `/pos/vouchers`)
- **Routes (3) [F]**: `GET /discount-cards`; `POST /discount-cards`; `PUT /discount-cards/:id`
- **Defined in**: `apps/api/src/routes/vouchers.ts:63`
- **Permissions**: `sales.edit`, `sales.view`
- **Services**: `accounting`, `vouchers`
- **Tables touched (by the services used)**: accounts, coupons, discount_cards, gift_voucher_redemptions, gift_vouchers, lucky_draws, pos_bills, account_groups, companies, fiscal_years (+4 more)
- **Screens**: `/pos/vouchers`
- **Device app**: -
- **Tests**: `apparel.test.ts`

### POS-031 Pos: promo

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: The company a request works on: the one asked for, or the tenant's first. A coupon that can be used on a bill dated `date` (row-locked when billing, so uses can't run over).
- **Routes (1) [F]**: `GET /pos/promo`
- **Defined in**: `apps/api/src/routes/vouchers.ts:71`
- **Permissions**: `sales.view`
- **Services**: `accounting`, `vouchers`
- **Tables touched (by the services used)**: account_groups, accounts, companies, coupons, discount_cards, fiscal_years, gift_voucher_redemptions, gift_vouchers, gl_entries, lucky_draws (+4 more)
- **Screens**: none found
- **Device app**: -
- **Tests**: `apparel.test.ts`

### POS-032 Lucky draws

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Gift vouchers, coupon codes, discount cards and lucky draws for the counter. (screen text of `/pos/vouchers`)
- **Routes (2) [F]**: `GET /lucky-draws`; `POST /lucky-draws`
- **Defined in**: `apps/api/src/routes/vouchers.ts:84`
- **Permissions**: `sales.approve`, `sales.view`
- **Services**: `vouchers`
- **Tables touched (by the services used)**: accounts, coupons, discount_cards, gift_voucher_redemptions, gift_vouchers, lucky_draws, pos_bills
- **Screens**: `/pos/vouchers`
- **Device app**: -
- **Tests**: `apparel.test.ts`


## PUR Purchasing

### PUR-001 Purchase orders

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: What you've ordered from suppliers and how much has arrived. (screen text of `/purchase/orders/new`)
- **Routes (4) [F]**: `GET /purchase-orders/:id`; `POST /purchase-orders`; `POST /purchase-orders/:id/close`; `POST /purchase-orders/:id/cancel`
- **Defined in**: `apps/api/src/routes/purchasing.ts:64`
- **Permissions**: `purchase.cancel`, `purchase.create`, `purchase.edit`, `purchase.view`
- **Services**: `purchasing`
- **Tables touched (by the services used)**: account_groups, accounts, branches, goods_receipt_lines, goods_receipts, items, projects, purchase_bill_lines, purchase_bills, purchase_order_lines (+4 more)
- **Screens**: `/purchase/bills/new`, `/purchase/orders/[id]`, `/purchase/orders/new`, `/purchase/receipts/new`
- **Device app**: -
- **Tests**: `purchasing.test.ts`, `receiving.test.ts`, `retailreports.test.ts`

### PUR-002 Goods receipts

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Goods that arrived (GRN). Stock goes up on receipt; the bill comes later. (screen text of `/purchase/receipts/new`)
- **Routes (6) [F]**: `GET /goods-receipts/:id`; `POST /goods-receipts`; `GET /goods-receipts/holds`; `POST /goods-receipts/:id/release-hold`; `POST /goods-receipts/:id/return`; `POST /goods-receipts/:id/cancel`
- **Defined in**: `apps/api/src/routes/purchasing.ts:66`
- **Permissions**: `purchase.approve`, `purchase.cancel`, `purchase.create`, `purchase.view`
- **Services**: `purchasing`
- **Tables touched (by the services used)**: account_groups, accounts, branches, goods_receipt_lines, goods_receipts, items, projects, purchase_bill_lines, purchase_bills, purchase_order_lines (+4 more)
- **Screens**: `/purchase/bills/new`, `/purchase/receipts/[id]`, `/purchase/receipts/new`, `/purchase/receiving`
- **Device app**: -
- **Tests**: `demo-pack.test.ts`, `itemcodes.test.ts`, `lifecycle.test.ts`, `purchasing.test.ts`, `receiving.test.ts` (+2 more)

### PUR-003 Items (purchasing)

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Goods that arrived (GRN). Stock goes up on receipt; the bill comes later. (screen text of `/purchase/receipts/new`)
- **Routes (1) [F]**: `GET /items/:id/purchase-history`
- **Defined in**: `apps/api/src/routes/purchasing.ts:68`
- **Permissions**: `purchase.view`
- **Services**: `purchasing`
- **Tables touched (by the services used)**: account_groups, accounts, branches, goods_receipt_lines, goods_receipts, items, projects, purchase_bill_lines, purchase_bills, purchase_order_lines (+4 more)
- **Screens**: `/purchase/receipts/new`
- **Device app**: -
- **Tests**: `demo-pack.test.ts`

### PUR-004 Purchase bills (purchasing)

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Supplier invoices. Each one posts to purchases, input GST and the supplier's account. (screen text of `/purchase/bills/new`)
- **Routes (3) [F]**: `GET /purchase-bills/:id`; `POST /purchase-bills`; `POST /purchase-bills/:id/cancel`
- **Defined in**: `apps/api/src/routes/purchasing.ts:72`
- **Permissions**: `purchase.cancel`, `purchase.create`, `purchase.view`
- **Services**: `purchasing`
- **Tables touched (by the services used)**: account_groups, accounts, branches, goods_receipt_lines, goods_receipts, items, projects, purchase_bill_lines, purchase_bills, purchase_order_lines (+4 more)
- **Screens**: `/purchase/bills/[id]`, `/purchase/bills/new`, `/purchase/orders/new`
- **Device app**: -
- **Tests**: `apparel.test.ts`, `billreceipts.test.ts`, `exports.test.ts`, `gstwork.test.ts`, `gstwork2.test.ts` (+8 more)

### PUR-005 Purchase returns

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: GSTR-1 and GSTR-3B from your invoices and bills. File them here, or download the JSON for the GST portal's offline tool. (screen text of `/gst/returns`)
- **Routes (3) [F]**: `GET /purchase-returns/:id`; `POST /purchase-returns`; `POST /purchase-returns/:id/cancel`
- **Defined in**: `apps/api/src/routes/purchasing.ts:74`
- **Permissions**: `purchase.cancel`, `purchase.create`, `purchase.view`
- **Services**: `purchasing`
- **Tables touched (by the services used)**: account_groups, accounts, branches, goods_receipt_lines, goods_receipts, items, projects, purchase_bill_lines, purchase_bills, purchase_order_lines (+4 more)
- **Screens**: `/purchase/bills/[id]`, `/purchase/returns/[id]`
- **Device app**: -
- **Tests**: `purchasing.test.ts`

### PUR-006 Reports: supplier claims

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Goods waiting to be passed, and what suppliers owe for goods that came short, damaged or went back. (screen text of `/purchase/receiving`)
- **Routes (1) [F]**: `GET /reports/supplier-claims`
- **Defined in**: `apps/api/src/routes/purchasing.ts:119`
- **Permissions**: `purchase.view`
- **Services**: `purchasing`
- **Tables touched (by the services used)**: account_groups, accounts, branches, goods_receipt_lines, goods_receipts, items, projects, purchase_bill_lines, purchase_bills, purchase_order_lines (+4 more)
- **Screens**: `/purchase/receiving`
- **Device app**: -
- **Tests**: `receiving.test.ts`


## INV Inventory and Masters of Stock

### INV-001 Reports: branch comparison

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Stores side by side, and new stock shared between them by demand, ratio or fixed numbers. (screen text of `/inventory/distribution`)
- **Routes (1) [F]**: `GET /reports/branch-comparison`
- **Defined in**: `apps/api/src/routes/distribution.ts:22`
- **Permissions**: `reports.view`
- **Services**: `distribution`
- **Tables touched (by the services used)**: branches, warehouses
- **Screens**: `/inventory/distribution`
- **Device app**: -
- **Tests**: `distribution.test.ts`

### INV-002 Allocations

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Stores side by side, and new stock shared between them by demand, ratio or fixed numbers. (screen text of `/inventory/distribution`)
- **Routes (2) [F]**: `POST /allocations/propose`; `POST /allocations/dispatch`
- **Defined in**: `apps/api/src/routes/distribution.ts:26`
- **Permissions**: `inventory.create`, `inventory.view`
- **Services**: `distribution`
- **Tables touched (by the services used)**: branches, warehouses
- **Screens**: `/inventory/distribution`
- **Device app**: -
- **Tests**: `distribution.test.ts`

### INV-003 Hsn

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Goods you stock and services you buy or sell, with HSN/SAC and GST rate. (screen text of `/inventory/items`)
- **Routes (4) [F]**: `GET /hsn`; `POST /hsn`; `PATCH /hsn/:id`; `POST /hsn/seed-standard`
- **Defined in**: `apps/api/src/routes/hsn.ts:18`
- **Permissions**: `inventory.create`, `inventory.edit`, `inventory.view`
- **Services**: `hsn`
- **Tables touched (by the services used)**: hsn_codes
- **Screens**: `/inventory/items`, `/inventory/styles/[id]`, `/inventory/styles`, `/inventory/styles/setup`, `/masters/hsn`
- **Device app**: -
- **Tests**: `hsn.test.ts`

### INV-004 Inventory: setup

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Check a customer's or supplier's statement against your ledger. Matching is done by rules; what does not match becomes an exception with a reason, an owner and a history. (screen text of `/accounts/reconciliation`)
- **Routes (1) [F]**: `GET /inventory/setup`
- **Defined in**: `apps/api/src/routes/inventory.ts:52`
- **Permissions**: `inventory.view`
- **Services**: `accounting`, `inventory`
- **Tables touched (by the services used)**: account_groups, accounts, companies, fiscal_years, gl_entries, item_pack_lines, item_units, items, number_series, stock_journal_lines (+6 more)
- **Screens**: `/accounts/bill-receipt`, `/accounts/reconciliation`, `/accounts/tds`, `/accounts/working-capital`, `/assets/[id]`, `/hr/employees/[id]` (+51 more) (57 screens call it)
- **Device app**: -
- **Tests**: `apparel.test.ts`, `approvalmemos.test.ts`, `barcodes.test.ts`, `billreceipts.test.ts`, `branchprices.test.ts` (+65 more)

### INV-005 Inventory: valuation method

- **Status**: PARTIALLY IMPLEMENTED (file 10)
- **Source comment [F]**: The company a request works on: the one asked for, or the tenant's first.
- **Routes (1) [F]**: `PATCH /inventory/valuation-method`
- **Defined in**: `apps/api/src/routes/inventory.ts:66`
- **Permissions**: `inventory.approve`
- **Services**: `accounting`
- **Tables touched (by the services used)**: account_groups, accounts, companies, fiscal_years, gl_entries, number_series, voucher_lines, vouchers
- **Screens**: `/settings/inventory`
- **Device app**: -
- **Tests**: none matched

### INV-006 Warehouses

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: The company a request works on: the one asked for, or the tenant's first. Default units (GST UQC) and a "Main store" warehouse for a company that has none.
- **Routes (1) [F]**: `POST /warehouses`
- **Defined in**: `apps/api/src/routes/inventory.ts:77`
- **Permissions**: `inventory.create`
- **Services**: `accounting`, `inventory`
- **Tables touched (by the services used)**: account_groups, accounts, companies, fiscal_years, gl_entries, item_pack_lines, item_units, items, number_series, stock_journal_lines (+6 more)
- **Screens**: `/settings/inventory`
- **Device app**: -
- **Tests**: `apparel.test.ts`, `approvalmemos.test.ts`, `auditanchor.test.ts`, `branchprices.test.ts`, `commitments.test.ts` (+8 more)

### INV-007 Items (inventory)

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Goods you stock and services you buy or sell, with HSN/SAC and GST rate. (screen text of `/inventory/items`)
- **Routes (10) [F]**: `GET /items`; `POST /items/barcodes/generate`; `GET /items/:id/barcodes`; `POST /items/:id/barcodes`; `DELETE /items/barcodes/:id`; `GET /items/by-code`; `PUT /items/:id/units`; `GET /items/:id`; `POST /items`; `PATCH /items/:id`
- **Defined in**: `apps/api/src/routes/inventory.ts:93`
- **Permissions**: `inventory.create`, `inventory.edit`, `inventory.view`
- **Services**: `accounting`, `barcodes`, `inventory`, `styles`
- **Tables touched (by the services used)**: items, accounts, item_pack_lines, uoms, account_groups, companies, fiscal_years, gl_entries, item_units, number_series (+10 more)
- **Screens**: `/accounts/bill-receipt`, `/accounts/reconciliation`, `/accounts/tds`, `/accounts/working-capital`, `/assets/[id]`, `/hr/employees/[id]` (+52 more) (58 screens call it)
- **Device app**: -
- **Tests**: `apparel.test.ts`, `approvalmemos.test.ts`, `barcodes.test.ts`, `billreceipts.test.ts`, `branchprices.test.ts` (+56 more)

### INV-008 Stock journals

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Opening stock, physical-count adjustments, transfers between warehouses, and consumption. (screen text of `/inventory/journals/new`)
- **Routes (4) [F]**: `GET /stock-journals`; `GET /stock-journals/:id`; `POST /stock-journals`; `POST /stock-journals/:id/cancel`
- **Defined in**: `apps/api/src/routes/inventory.ts:205`
- **Permissions**: `inventory.cancel`, `inventory.create`, `inventory.view`
- **Services**: `accounting`, `inventory`
- **Tables touched (by the services used)**: item_pack_lines, item_units, items, stock_journal_lines, stock_journals, stock_ledger, uoms, warehouses, account_groups, accounts (+6 more)
- **Screens**: `/inventory/journals/[id]`, `/inventory/journals/new`, `/inventory/journals`
- **Device app**: -
- **Tests**: `apparel.test.ts`, `approvalmemos.test.ts`, `billreceipts.test.ts`, `branchprices.test.ts`, `cartons.test.ts` (+52 more)

### INV-009 Reports: stock summary

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: The company a request works on: the one asked for, or the tenant's first. Default units (GST UQC) and a "Main store" warehouse for a company that has none.
- **Routes (1) [F]**: `GET /reports/stock-summary`
- **Defined in**: `apps/api/src/routes/inventory.ts:257`
- **Permissions**: `inventory.view`
- **Services**: `accounting`, `inventory`
- **Tables touched (by the services used)**: account_groups, accounts, companies, fiscal_years, gl_entries, item_pack_lines, item_units, items, number_series, stock_journal_lines (+6 more)
- **Screens**: `/inventory/stock`
- **Device app**: `/reports/stock-summary`
- **Tests**: `apparel.test.ts`, `approvalmemos.test.ts`, `demo-pack.test.ts`, `distribution.test.ts`, `losses.test.ts` (+12 more)

### INV-010 Reports: item ledger

- **Status**: PARTIALLY IMPLEMENTED (file 10)
- **Source comment [F]**: The company a request works on: the one asked for, or the tenant's first. Movements of one item with running quantity and value (all warehouses merged, each valued on its own).
- **Routes (1) [F]**: `GET /reports/item-ledger/:itemId`
- **Defined in**: `apps/api/src/routes/inventory.ts:265`
- **Permissions**: `inventory.view`
- **Services**: `accounting`, `inventory`
- **Tables touched (by the services used)**: account_groups, accounts, companies, fiscal_years, gl_entries, item_pack_lines, item_units, items, number_series, stock_journal_lines (+6 more)
- **Screens**: `/inventory/items/[id]`
- **Device app**: -
- **Tests**: none matched

### INV-011 Reports: reorder

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: The company a request works on: the one asked for, or the tenant's first. Default units (GST UQC) and a "Main store" warehouse for a company that has none.
- **Routes (1) [F]**: `GET /reports/reorder`
- **Defined in**: `apps/api/src/routes/inventory.ts:276`
- **Permissions**: `inventory.view`
- **Services**: `accounting`, `inventory`
- **Tables touched (by the services used)**: account_groups, accounts, companies, fiscal_years, gl_entries, item_pack_lines, item_units, items, number_series, stock_journal_lines (+6 more)
- **Screens**: `/inventory/stock`
- **Device app**: -
- **Tests**: `purchasing.test.ts`

### INV-012 Lookups

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Your team, their pay and statutory details. (screen text of `/hr/employees/new`)
- **Routes (4) [F]**: `GET /lookups`; `GET /lookups/:kind`; `POST /lookups/:kind`; `PATCH /lookups/:kind/:id`
- **Defined in**: `apps/api/src/routes/lookups.ts:26`
- **Permissions**: `hr.create`, `hr.edit`, `hr.view`, `inventory.create`, `inventory.edit`, `inventory.view`, `sales.create`, `sales.edit`, `sales.view`
- **Services**: `lookups`
- **Tables touched (by the services used)**: lookups
- **Screens**: `/hr/employees/[id]`, `/hr/employees/new`, `/inventory/styles/[id]`, `/inventory/styles`, `/inventory/styles/setup`, `/masters/lists/[kind]` (+1 more) (7 screens call it)
- **Device app**: -
- **Tests**: `lookups.test.ts`

### INV-013 Stock losses

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Write off stock that is damaged, lost, stolen or expired, with the reason and a photo. A big loss waits for a second person to approve it. (screen text of `/inventory/losses`)
- **Routes (5) [F]**: `GET /stock-losses`; `POST /stock-losses`; `POST /stock-losses/:id/decide`; `GET /stock-losses/settings`; `PUT /stock-losses/settings`
- **Defined in**: `apps/api/src/routes/losses.ts:16`
- **Permissions**: `inventory.approve`, `inventory.create`, `inventory.view`
- **Services**: `losses`
- **Tables touched (by the services used)**: companies, files, items, stock_losses, users, warehouses
- **Screens**: `/inventory/losses`
- **Device app**: -
- **Tests**: `losses.test.ts`

### INV-014 Reports: stock losses

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Write off stock that is damaged, lost, stolen or expired, with the reason and a photo. A big loss waits for a second person to approve it. (screen text of `/inventory/losses`)
- **Routes (1) [F]**: `GET /reports/stock-losses`
- **Defined in**: `apps/api/src/routes/losses.ts:38`
- **Permissions**: `inventory.view`
- **Services**: `losses`
- **Tables touched (by the services used)**: companies, files, items, stock_losses, users, warehouses
- **Screens**: `/inventory/losses`
- **Device app**: -
- **Tests**: `losses.test.ts`

### INV-015 Margin bands

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: From each cost upward, the MRP and the two sale rates come off a band. Receipts fill them in for you. (screen text of `/inventory/margin-bands`)
- **Routes (3) [F]**: `GET /margin-bands`; `PUT /margin-bands`; `GET /margin-bands/price`
- **Defined in**: `apps/api/src/routes/marginbands.ts:11`
- **Permissions**: `inventory.approve`, `inventory.view`
- **Services**: `marginbands`
- **Tables touched (by the services used)**: margin_bands
- **Screens**: `/inventory/margin-bands`, `/purchase/receipts/new`
- **Device app**: -
- **Tests**: `itemcodes.test.ts`

### INV-016 Accounts (merge)

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Fold a duplicate customer, supplier or item into the one you want to keep. History stays where it was; the balance or stock moves across. (screen text of `/masters/merge`)
- **Routes (1) [F]**: `POST /accounts/:id/merge`
- **Defined in**: `apps/api/src/routes/merge.ts:11`
- **Permissions**: `accounts.edit`
- **Services**: `merge`
- **Tables touched (by the services used)**: accounts, item_barcodes, items
- **Screens**: `/masters/merge`
- **Device app**: -
- **Tests**: `merge.test.ts`

### INV-017 Items (merge)

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Fold a duplicate customer, supplier or item into the one you want to keep. History stays where it was; the balance or stock moves across. (screen text of `/masters/merge`)
- **Routes (1) [F]**: `POST /items/:id/merge`
- **Defined in**: `apps/api/src/routes/merge.ts:17`
- **Permissions**: `inventory.edit`
- **Services**: `merge`
- **Tables touched (by the services used)**: accounts, item_barcodes, items
- **Screens**: `/masters/merge`
- **Device app**: -
- **Tests**: `barcodes.test.ts`

### INV-018 Inventory: rate update

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Change sale rate, MRP or purchase rate for a group of items at once. Preview first; nothing changes until you apply. (screen text of `/inventory/rate-update`)
- **Routes (4) [F]**: `POST /inventory/rate-update`; `POST /inventory/rate-update/request`; `GET /inventory/rate-update/requests`; `POST /inventory/rate-update/requests/:id/decide`
- **Defined in**: `apps/api/src/routes/rateupdate.ts:20`
- **Permissions**: `inventory.approve`, `inventory.edit`, `inventory.view`
- **Services**: `rateupdate`
- **Tables touched (by the services used)**: items, rate_update_requests, styles
- **Screens**: `/inventory/rate-update`
- **Device app**: -
- **Tests**: `rateapproval.test.ts`, `rateupdate.test.ts`

### INV-019 Relabels

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Rename or re-price items already in stock on one voucher; the old values are kept and the barcodes stay the same. (screen text of `/inventory/relabel`)
- **Routes (3) [F]**: `GET /relabels`; `GET /relabels/:id`; `POST /relabels`
- **Defined in**: `apps/api/src/routes/relabel.ts:13`
- **Permissions**: `inventory.edit`, `inventory.view`
- **Services**: `relabel`
- **Tables touched (by the services used)**: items, relabels
- **Screens**: `/inventory/relabel`
- **Device app**: -
- **Tests**: `relabel.test.ts`

### INV-020 Items (serials)

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Goods you stock and services you buy or sell, with HSN/SAC and GST rate. (screen text of `/inventory/items`)
- **Routes (1) [F]**: `PUT /items/:id/track-serials`
- **Defined in**: `apps/api/src/routes/serials.ts:15`
- **Permissions**: `inventory.edit`
- **Services**: `serials`
- **Tables touched (by the services used)**: item_serials, items, pos_bills, warehouses
- **Screens**: `/inventory/items`
- **Device app**: -
- **Tests**: `serials.test.ts`

### INV-021 Serials

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Pieces that carry their own number: where each one is, when it came in and the bill it left on. (screen text of `/inventory/serials`)
- **Routes (4) [F]**: `GET /serials`; `POST /serials`; `GET /serials/lookup`; `GET /serials/check`
- **Defined in**: `apps/api/src/routes/serials.ts:21`
- **Permissions**: `inventory.create`, `inventory.view`
- **Services**: `serials`
- **Tables touched (by the services used)**: item_serials, items, pos_bills, warehouses
- **Screens**: `/inventory/serials`
- **Device app**: -
- **Tests**: `serials.test.ts`

### INV-022 Stock counts

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Count a store by scanning barcodes. An approver sees the differences and their value, and approving puts the books right. (screen text of `/inventory/counts/[id]`)
- **Routes (12) [F]**: `GET /stock-counts`; `GET /stock-counts/scopes`; `POST /stock-counts`; `GET /stock-counts/:id`; `POST /stock-counts/:id/scan`; `POST /stock-counts/:id/import-scans`; `PUT /stock-counts/:id/lines`; `POST /stock-counts/:id/reset`; `POST /stock-counts/:id/submit`; `POST /stock-counts/:id/reopen`; +2 more
- **Defined in**: `apps/api/src/routes/stockcount.ts:17`
- **Permissions**: `inventory.approve`, `inventory.cancel`, `inventory.create`, `inventory.edit`, `inventory.view`
- **Services**: `stockcount`
- **Tables touched (by the services used)**: items, stock_count_lines, stock_counts, styles, warehouses
- **Screens**: `/inventory/counts/[id]`, `/inventory/counts`, `/print/count-sheet/[id]`
- **Device app**: -
- **Tests**: `demo-pack.test.ts`, `lifecycle.test.ts`, `scanimport.test.ts`, `stockaudit.test.ts`, `syncstockcount.test.ts` (+1 more)

### INV-023 Reports: stock audit

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: How well the books matched the shelves in each count, and what is found short again and again. (screen text of `/inventory/counts/audit`)
- **Routes (1) [F]**: `GET /reports/stock-audit`
- **Defined in**: `apps/api/src/routes/stockcount.ts:18`
- **Permissions**: `inventory.view`
- **Services**: `stockcount`
- **Tables touched (by the services used)**: items, stock_count_lines, stock_counts, styles, warehouses
- **Screens**: `/inventory/counts/audit`
- **Device app**: -
- **Tests**: `stockaudit.test.ts`

### INV-024 Stock limits

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Set how little and how much of each item a warehouse should hold. Items under their minimum are flagged so you know what to order. (screen text of `/inventory/stock-limits`)
- **Routes (2) [F]**: `GET /stock-limits`; `PUT /stock-limits/:warehouseId`
- **Defined in**: `apps/api/src/routes/stocklimits.ts:13`
- **Permissions**: `inventory.edit`, `inventory.view`
- **Services**: `stocklimits`
- **Tables touched (by the services used)**: items, stock_limits, warehouses
- **Screens**: `/inventory/stock-limits`
- **Device app**: -
- **Tests**: `stocklimits.test.ts`

### INV-025 Inventory: reset stock

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Bring a store's stock to zero so it can be counted from scratch. (screen text of `/inventory/reset-stock`)
- **Routes (1) [F]**: `POST /inventory/reset-stock`
- **Defined in**: `apps/api/src/routes/stockreset.ts:10`
- **Permissions**: `inventory.approve`; step-up required on 1 route(s)
- **Services**: `stockreset`
- **Tables touched (by the services used)**: items, styles, warehouses
- **Screens**: `/inventory/reset-stock`
- **Device app**: -
- **Tests**: `stockreset.test.ts`

### INV-026 Reports: stock posting check

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Every sale should have taken exactly its pieces out of stock. This lists the ones that did not. (screen text of `/reports/stock-posting-check`)
- **Routes (1) [F]**: `GET /reports/stock-posting-check`
- **Defined in**: `apps/api/src/routes/stockreset.ts:19`
- **Permissions**: `reports.view`
- **Services**: `stockreset`
- **Tables touched (by the services used)**: items, styles, warehouses
- **Screens**: `/reports/stock-posting-check`
- **Device app**: -
- **Tests**: `stockreset.test.ts`

### INV-027 Size scales

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Designs sold in colours and sizes. Each colour and size is its own item, with its own barcode and stock. (screen text of `/inventory/styles/[id]`)
- **Routes (3) [F]**: `GET /size-scales`; `POST /size-scales`; `PATCH /size-scales/:id`
- **Defined in**: `apps/api/src/routes/styles.ts:38`
- **Permissions**: `inventory.create`, `inventory.edit`, `inventory.view`
- **Services**: `styles`
- **Tables touched (by the services used)**: colors, item_pack_lines, items, size_scales, styles, uoms
- **Screens**: `/inventory/styles/[id]`, `/inventory/styles`, `/inventory/styles/setup`
- **Device app**: -
- **Tests**: `apparel.test.ts`

### INV-028 Colors

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Designs sold in colours and sizes. Each colour and size is its own item, with its own barcode and stock. (screen text of `/inventory/styles/[id]`)
- **Routes (3) [F]**: `GET /colors`; `POST /colors`; `PATCH /colors/:id`
- **Defined in**: `apps/api/src/routes/styles.ts:43`
- **Permissions**: `inventory.create`, `inventory.edit`, `inventory.view`
- **Services**: `styles`
- **Tables touched (by the services used)**: colors, item_pack_lines, items, size_scales, styles, uoms
- **Screens**: `/inventory/styles/[id]`, `/inventory/styles`, `/inventory/styles/setup`
- **Device app**: -
- **Tests**: `apparel.test.ts`, `consigneestatements.test.ts`, `helpercomm.test.ts`, `rateapproval.test.ts`, `rateupdate.test.ts` (+6 more)

### INV-029 Styles (styles)

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Designs sold in colours and sizes. Each colour and size is its own item, with its own barcode and stock. (screen text of `/inventory/styles/[id]`)
- **Routes (7) [F]**: `GET /styles`; `GET /styles/:id`; `POST /styles`; `PATCH /styles/:id`; `POST /styles/:id/variants`; `PUT /styles/:id/units`; `POST /styles/:id/packs`
- **Defined in**: `apps/api/src/routes/styles.ts:49`
- **Permissions**: `inventory.create`, `inventory.edit`, `inventory.view`
- **Services**: `inventory`, `styles`
- **Tables touched (by the services used)**: colors, item_pack_lines, items, size_scales, styles, uoms, item_units, stock_journal_lines, stock_journals, stock_ledger (+1 more)
- **Screens**: `/inventory/journals/new`, `/inventory/labels`, `/inventory/rate-update`, `/inventory/reset-stock`, `/inventory/styles/[id]`, `/inventory/styles` (+14 more) (20 screens call it)
- **Device app**: -
- **Tests**: `apparel.test.ts`, `consigneestatements.test.ts`, `helpercomm.test.ts`, `rateapproval.test.ts`, `rateupdate.test.ts` (+6 more)

### INV-030 Stock transfers

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Stock sent between warehouses. It leaves the source now and shows as in transit until the other side counts it in. (screen text of `/inventory/transfers/[id]`)
- **Routes (6) [F]**: `GET /stock-transfers`; `GET /stock-transfers/in-transit`; `GET /stock-transfers/:id`; `POST /stock-transfers`; `POST /stock-transfers/:id/receive`; `POST /stock-transfers/:id/cancel`
- **Defined in**: `apps/api/src/routes/transfers.ts:16`
- **Permissions**: `inventory.cancel`, `inventory.create`, `inventory.view`
- **Services**: `transfers`
- **Tables touched (by the services used)**: items, stock_ledger, stock_transfer_lines, stock_transfers, warehouses
- **Screens**: `/inventory/transfers/[id]`, `/inventory/transfers/new`, `/inventory/transfers`, `/print/transfer-slip/[id]`
- **Device app**: -
- **Tests**: `approvalmemos.test.ts`, `distribution.test.ts`, `lifecycle.test.ts`, `storescope.test.ts`, `transfers.test.ts`


## MFG Manufacturing and Job Work

### MFG-001 Work centres

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: What goes into each item you make, with wastage, work-centre time and overheads. (screen text of `/manufacturing/boms/new`)
- **Routes (3) [F]**: `GET /work-centres`; `POST /work-centres`; `PUT /work-centres/:id`
- **Defined in**: `apps/api/src/routes/manufacturing.ts:29`
- **Permissions**: `inventory.edit`, `inventory.view`
- **Services**: `manufacturing`
- **Tables touched (by the services used)**: bom_lines, bom_operations, boms, items, production_entries, production_orders, uoms, warehouses, work_centres
- **Screens**: `/manufacturing/boms/new`, `/manufacturing/boms`
- **Device app**: -
- **Tests**: `manufacturing.test.ts`

### MFG-002 Boms

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: What goes into each item you make, with wastage, work-centre time and overheads. (screen text of `/manufacturing/boms/[id]`)
- **Routes (5) [F]**: `GET /boms`; `GET /boms/:id`; `POST /boms`; `POST /boms/:id/default`; `POST /boms/:id/archive`
- **Defined in**: `apps/api/src/routes/manufacturing.ts:33`
- **Permissions**: `inventory.create`, `inventory.edit`, `inventory.view`
- **Services**: `manufacturing`
- **Tables touched (by the services used)**: bom_lines, bom_operations, boms, items, production_entries, production_orders, uoms, warehouses, work_centres
- **Screens**: `/manufacturing/boms/[id]`, `/manufacturing/boms/new`, `/manufacturing/boms`, `/manufacturing/orders/new`
- **Device app**: -
- **Tests**: `manufacturing.test.ts`

### MFG-003 Production orders

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Plan, release and complete production. Materials leave stock and output comes in at cost. (screen text of `/manufacturing/orders/[id]`)
- **Routes (7) [F]**: `GET /production-orders`; `GET /production-orders/:id`; `POST /production-orders`; `POST /production-orders/:id/release`; `POST /production-orders/:id/issue`; `POST /production-orders/:id/complete`; `POST /production-orders/:id/cancel`
- **Defined in**: `apps/api/src/routes/manufacturing.ts:47`
- **Permissions**: `inventory.cancel`, `inventory.create`, `inventory.edit`, `inventory.view`
- **Services**: `manufacturing`
- **Tables touched (by the services used)**: bom_lines, bom_operations, boms, items, production_entries, production_orders, uoms, warehouses, work_centres
- **Screens**: `/manufacturing/orders/[id]`, `/manufacturing/orders/new`, `/manufacturing/orders`
- **Device app**: -
- **Tests**: `manufacturing.test.ts`

### MFG-004 Mrp

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: What to make and buy to meet open sales orders and reorder levels, net of stock and what's already on order. (screen text of `/manufacturing/mrp`)
- **Routes (2) [F]**: `GET /mrp`; `POST /mrp/convert`
- **Defined in**: `apps/api/src/routes/manufacturing.ts:72`
- **Permissions**: `inventory.view`, `purchase.create`
- **Services**: `manufacturing`
- **Tables touched (by the services used)**: bom_lines, bom_operations, boms, items, production_entries, production_orders, uoms, warehouses, work_centres
- **Screens**: `/manufacturing/mrp`
- **Device app**: -
- **Tests**: `manufacturing.test.ts`

### MFG-005 Job work

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Goods sent to job workers on a challan and received back processed. Inputs must return within a year (capital goods three). (screen text of `/manufacturing/job-work`)
- **Routes (5) [F]**: `GET /job-work`; `POST /job-work/send`; `POST /job-work/receive`; `POST /job-work/:id/cancel`; `GET /job-work/itc04`
- **Defined in**: `apps/api/src/routes/manufacturing.ts:85`
- **Permissions**: `gst.view`, `inventory.cancel`, `inventory.create`, `inventory.view`
- **Services**: `jobwork`
- **Tables touched (by the services used)**: account_groups, accounts, items, job_work_challans, uoms, warehouses
- **Screens**: `/manufacturing/job-work`
- **Device app**: -
- **Tests**: `manufacturing.test.ts`


## HR People, Attendance and Payroll

### HR-001 Employees

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Your team, their pay and statutory details. (screen text of `/hr/employees`)
- **Routes (24) [F]**: `GET /employees`; `GET /employees/:id`; `POST /employees`; `PATCH /employees/:id`; `POST /employees/:id/salary`; `GET /employees/:id/tax-declaration`; `PUT /employees/:id/tax-declaration`; `GET /employees/:id/payslips`; `GET /employees/:id/leave-balances`; `PUT /employees/:id/leave-openings`; +14 more
- **Defined in**: `apps/api/src/routes/hr.ts:59`
- **Permissions**: `hr.create`, `hr.edit`, `hr.view`, `payroll.approve`, `payroll.create`, `payroll.edit`, `payroll.view`
- **Services**: `hr`, `payroll`, `statutory`
- **Tables touched (by the services used)**: employees, payroll_runs, payroll_settings, accounts, attendance, holidays, leave_openings, leave_requests, leave_types, salary_structures (+7 more)
- **Screens**: `/assets/new`, `/hr/employees/[id]`, `/hr/employees`, `/hr/leave`, `/hr/loan-requests`, `/hr/statutory` (+2 more) (8 screens call it)
- **Device app**: -
- **Tests**: `apparel.test.ts`, `attendancealerts.test.ts`, `empbankapproval.test.ts`, `employeedocs.test.ts`, `expenses-projects.test.ts` (+16 more)

### HR-002 Holidays

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Unmarked working days count as present. Click a day to mark it absent, then half day, then present again. (screen text of `/hr/attendance`)
- **Routes (3) [F]**: `GET /holidays`; `POST /holidays`; `DELETE /holidays/:id`
- **Defined in**: `apps/api/src/routes/hr.ts:105`
- **Permissions**: `hr.edit`, `hr.view`
- **Services**: `hr`
- **Tables touched (by the services used)**: accounts, attendance, employees, holidays, leave_openings, leave_requests, leave_types, payroll_runs, payroll_settings, salary_structures (+3 more)
- **Screens**: `/hr/attendance`
- **Device app**: -
- **Tests**: `payroll.test.ts`

### HR-003 Attendance (hr)

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Unmarked working days count as present. Click a day to mark it absent, then half day, then present again. (screen text of `/hr/attendance`)
- **Routes (3) [F]**: `GET /attendance`; `PUT /attendance`; `POST /attendance/import`
- **Defined in**: `apps/api/src/routes/hr.ts:118`
- **Permissions**: `hr.edit`, `hr.view`
- **Services**: `hr`
- **Tables touched (by the services used)**: accounts, attendance, employees, holidays, leave_openings, leave_requests, leave_types, payroll_runs, payroll_settings, salary_structures (+3 more)
- **Screens**: `/hr/attendance`
- **Device app**: -
- **Tests**: `attendancealerts.test.ts`, `iclock.test.ts`, `payroll-extra.test.ts`, `payroll.test.ts`, `sync-hr.test.ts` (+1 more)

### HR-004 Hr: week off changes

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Unmarked working days count as present. Click a day to mark it absent, then half day, then present again. (screen text of `/hr/attendance`)
- **Routes (3) [F]**: `GET /hr/week-off-changes`; `POST /hr/week-off-changes`; `DELETE /hr/week-off-changes/:id`
- **Defined in**: `apps/api/src/routes/hr.ts:128`
- **Permissions**: `hr.edit`, `hr.view`
- **Services**: `hr`
- **Tables touched (by the services used)**: accounts, attendance, employees, holidays, leave_openings, leave_requests, leave_types, payroll_runs, payroll_settings, salary_structures (+3 more)
- **Screens**: `/hr/attendance`
- **Device app**: -
- **Tests**: `weekoff.test.ts`

### HR-005 Leave types

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Requests, approvals and balances. (screen text of `/hr/leave`)
- **Routes (1) [F]**: `GET /leave-types`
- **Defined in**: `apps/api/src/routes/hr.ts:143`
- **Permissions**: `hr.view`
- **Services**: `hr`
- **Tables touched (by the services used)**: accounts, attendance, employees, holidays, leave_openings, leave_requests, leave_types, payroll_runs, payroll_settings, salary_structures (+3 more)
- **Screens**: `/hr/leave`
- **Device app**: -
- **Tests**: `payroll.test.ts`, `weekoff.test.ts`

### HR-006 Leave requests

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Requests, approvals and balances. (screen text of `/hr/leave`)
- **Routes (4) [F]**: `GET /leave-requests`; `POST /leave-requests`; `POST /leave-requests/:id/${action}`; `POST /leave-requests/:id/cancel`
- **Defined in**: `apps/api/src/routes/hr.ts:144`
- **Permissions**: `hr.approve`, `hr.create`, `hr.edit`, `hr.view`
- **Services**: `hr`
- **Tables touched (by the services used)**: accounts, attendance, employees, holidays, leave_openings, leave_requests, leave_types, payroll_runs, payroll_settings, salary_structures (+3 more)
- **Screens**: `/hr/leave`
- **Device app**: -
- **Tests**: `payroll.test.ts`, `sync-hr.test.ts`, `weekoff.test.ts`

### HR-007 Payroll

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Registration codes, weekly offs and state levies. (screen text of `/settings/payroll`)
- **Routes (2) [F]**: `GET /payroll/settings`; `PUT /payroll/settings`
- **Defined in**: `apps/api/src/routes/hr.ts:164`
- **Permissions**: `payroll.edit`, `payroll.view`
- **Services**: `accounting`, `hr`, `payroll`
- **Tables touched (by the services used)**: employees, payroll_runs, payroll_settings, account_groups, accounts, attendance, companies, fiscal_years, gl_entries, holidays (+13 more)
- **Screens**: `/settings/payroll`
- **Device app**: -
- **Tests**: `payroll-extra.test.ts`

### HR-008 Payroll runs

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Monthly salary with PF, ESI, professional tax and TDS worked out, posted to your books. (screen text of `/hr/payroll`)
- **Routes (11) [F]**: `GET /payroll-runs`; `GET /payroll-runs/:id`; `POST /payroll-runs`; `POST /payroll-runs/:id/refresh`; `PATCH /payroll-runs/:id/payslips/:payslipId`; `POST /payroll-runs/:id/finalize`; `POST /payroll-runs/:id/pay`; `POST /payroll-runs/:id/cancel`; `GET /payroll-runs/:id/${name}`; `GET /payroll-runs/:id/register`; +1 more
- **Defined in**: `apps/api/src/routes/hr.ts:176`
- **Permissions**: `payroll.approve`, `payroll.cancel`, `payroll.create`, `payroll.edit`, `payroll.export`, `payroll.submit`, `payroll.view`
- **Services**: `payroll`, `statutory`
- **Tables touched (by the services used)**: branches, employees, payroll_runs, payslips, employee_loans, payroll_settings, statutory_payments
- **Screens**: `/hr/payroll/[id]`, `/hr/payroll`
- **Device app**: -
- **Tests**: `payroll-extra.test.ts`, `payroll.test.ts`

### HR-009 Payslips

- **Status**: PARTIALLY IMPLEMENTED (file 10)
- **Source comment [F]**: Age on the last day of the financial year (decides senior-citizen slabs in the old regime).
- **Routes (1) [F]**: `GET /payslips/:id`
- **Defined in**: `apps/api/src/routes/hr.ts:206`
- **Permissions**: `payroll.view`
- **Services**: `payroll`
- **Tables touched (by the services used)**: branches, employee_loans, employees, payroll_runs, payroll_settings, payslips
- **Screens**: `/print/payslip/[id]`
- **Device app**: -
- **Tests**: none matched

### HR-010 Hr: attendance alerts

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Who was marked absent or came in late on a day. A day with no entry counts as present. (screen text of `/hr/attendance-alerts`)
- **Routes (1) [F]**: `GET /hr/attendance-alerts`
- **Defined in**: `apps/api/src/routes/hr.ts:230`
- **Permissions**: `hr.view`
- **Services**: `attendancealerts`
- **Tables touched (by the services used)**: attendance, employees
- **Screens**: `/hr/attendance-alerts`
- **Device app**: -
- **Tests**: `attendancealerts.test.ts`, `weekoff.test.ts`

### HR-011 Stipends

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Pay a trainee or apprentice a monthly stipend. One payment per person per month, with no PF or ESI. (screen text of `/hr/stipends`)
- **Routes (2) [F]**: `GET /stipends`; `POST /stipends/:id/cancel`
- **Defined in**: `apps/api/src/routes/hr.ts:235`
- **Permissions**: `payroll.cancel`, `payroll.view`
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: `/hr/stipends`
- **Device app**: -
- **Tests**: `lifecycle.test.ts`, `stipend.test.ts`

### HR-012 Loan requests

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Ask for an advance or loan on an employee's behalf. Nothing is paid until someone with approval rights approves it. (screen text of `/hr/loan-requests`)
- **Routes (2) [F]**: `GET /loan-requests`; `POST /loan-requests/:id/decide`
- **Defined in**: `apps/api/src/routes/hr.ts:249`
- **Permissions**: `payroll.approve`, `payroll.view`
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: `/hr/loan-requests`
- **Device app**: -
- **Tests**: `lifecycle.test.ts`, `loanrequests.test.ts`

### HR-013 Hr: documents

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: (none). [I] Purpose inferred from path: hr documents
- **Routes (1) [F]**: `GET /hr/documents/expiring`
- **Defined in**: `apps/api/src/routes/hr.ts:279`
- **Permissions**: `hr.view`
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: `/hr/documents`
- **Device app**: -
- **Tests**: `employeedocs.test.ts`

### HR-014 Loans

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: (none). [I] Purpose inferred from path: loans
- **Routes (3) [F]**: `GET /loans/:id/receipts`; `POST /loans/:id/receipts`; `POST /loans/:id/cancel`
- **Defined in**: `apps/api/src/routes/hr.ts:284`
- **Permissions**: `payroll.cancel`, `payroll.create`, `payroll.view`
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: `/hr/employees/[id]`
- **Device app**: -
- **Tests**: `loanreceipts.test.ts`

### HR-015 Loan receipts

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: Goods that arrived (GRN). Stock goes up on receipt; the bill comes later. (screen text of `/purchase/receipts`)
- **Routes (1) [F]**: `POST /loan-receipts/:id/cancel`
- **Defined in**: `apps/api/src/routes/hr.ts:289`
- **Permissions**: `payroll.cancel`
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: none found
- **Device app**: -
- **Tests**: none matched

### HR-016 Shifts

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Your team, their pay and statutory details. (screen text of `/hr/employees/new`)
- **Routes (3) [F]**: `GET /shifts`; `POST /shifts`; `PUT /shifts/:id`
- **Defined in**: `apps/api/src/routes/hr.ts:306`
- **Permissions**: `hr.edit`, `hr.view`
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: `/hr/employees/[id]`, `/hr/employees/new`, `/settings/payroll`
- **Device app**: -
- **Tests**: `attendancealerts.test.ts`, `iclock.test.ts`, `payroll-extra.test.ts`

### HR-017 Statutory

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: PF, ESI, professional tax, LWF and TDS from final payroll, what's been paid, the quarterly TDS return and Form 16. (screen text of `/hr/statutory`)
- **Routes (3) [F]**: `GET /statutory/dues`; `POST /statutory/payments`; `POST /statutory/payments/:id/cancel`
- **Defined in**: `apps/api/src/routes/hr.ts:324`
- **Permissions**: `payroll.cancel`, `payroll.submit`, `payroll.view`
- **Services**: `statutory`
- **Tables touched (by the services used)**: branches, employees, payroll_runs, payslips, statutory_payments
- **Screens**: `/hr/statutory`
- **Device app**: -
- **Tests**: `payroll-extra.test.ts`

### HR-018 Tds: 24q

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: PF, ESI, professional tax, LWF and TDS from final payroll, what's been paid, the quarterly TDS return and Form 16. (screen text of `/hr/statutory`)
- **Routes (1) [F]**: `GET /tds/24q`
- **Defined in**: `apps/api/src/routes/hr.ts:340`
- **Permissions**: `payroll.view`
- **Services**: `statutory`
- **Tables touched (by the services used)**: branches, employees, payroll_runs, payslips, statutory_payments
- **Screens**: `/hr/statutory`
- **Device app**: -
- **Tests**: `payroll-extra.test.ts`

### HR-019 Iclock

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: A batch of punches pushed by a machine. They are kept as sent (a repeat is ignored), then each affected person-day is worked out again from all of that day's punches. A machine that is not registered, or has been switched off, is told nothing and stores nothing.
- **Routes (4) [F]**: `GET /iclock/cdata`; `POST /iclock/cdata`; `GET /iclock/getrequest`; `POST /iclock/devicecmd`
- **Defined in**: `apps/api/src/routes/iclock.ts:23`
- **Permissions**: `hr.view`
- **Services**: `devicepunch`
- **Tables touched (by the services used)**: attendance, attendance_devices, attendance_punches, employees, payroll_runs, shifts
- **Screens**: none found
- **Device app**: -
- **Tests**: `iclock.test.ts`

### HR-020 Attendance (iclock)

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Fingerprint, face or card machines that send their punches here on their own. No file to export or import. (screen text of `/hr/attendance-devices`)
- **Routes (6) [F]**: `GET /attendance/devices`; `POST /attendance/devices`; `PATCH /attendance/devices/:id`; `DELETE /attendance/devices/:id`; `GET /attendance/punches`; `POST /attendance/punches/reprocess`
- **Defined in**: `apps/api/src/routes/iclock.ts:53`
- **Permissions**: `hr.edit`, `hr.view`
- **Services**: `devicepunch`
- **Tables touched (by the services used)**: attendance, attendance_devices, attendance_punches, employees, payroll_runs, shifts
- **Screens**: `/hr/attendance-devices`
- **Device app**: -
- **Tests**: `iclock.test.ts`


## EXP Expenses

### EXP-001 Files

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Staff claim what they spent; approving books it (with GST credit where allowed) and paying settles it. (screen text of `/expenses/new`)
- **Routes (3) [F]**: `POST /files`; `GET /files/:id`; `POST /files/:id/read`
- **Defined in**: `apps/api/src/routes/expenses.ts:26`
- **Permissions**: `expenses.create`, `expenses.view`, `inventory.edit`, `inventory.view`, `purchase.create`, `purchase.view`, `sales.create`, `sales.view`
- **Services**: `expenses`, `files`
- **Tables touched (by the services used)**: files, account_groups, accounts, branches, employees, expense_categories, expense_claims, expense_lines, projects, vouchers
- **Screens**: `/expenses/[id]/edit`, `/expenses/[id]`, `/expenses/new`, `/inventory/losses`, `/pos/tailoring`, `/purchase/bills/new` (+2 more) (8 screens call it)
- **Device app**: `/files`
- **Tests**: `apparel.test.ts`, `crosstenant.test.ts`, `expenses-projects.test.ts`, `insights-crm.test.ts`, `restoretest.test.ts`

### EXP-002 Expenses

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Staff claim what they spent; approving books it (with GST credit where allowed) and paying settles it. (screen text of `/expenses/new`)
- **Routes (14) [F]**: `GET /expenses/people`; `GET /expenses/categories`; `POST /expenses/categories`; `PUT /expenses/categories/:id`; `GET /expenses/claims`; `GET /expenses/totals`; `GET /expenses/claims/:id`; `POST /expenses/claims`; `PUT /expenses/claims/:id`; `POST /expenses/claims/:id/submit`; +4 more
- **Defined in**: `apps/api/src/routes/expenses.ts:38`
- **Permissions**: `expenses.approve`, `expenses.cancel`, `expenses.create`, `expenses.edit`, `expenses.submit`, `expenses.view`
- **Services**: `expenses`
- **Tables touched (by the services used)**: account_groups, accounts, branches, employees, expense_categories, expense_claims, expense_lines, files, projects, vouchers
- **Screens**: `/expenses/[id]/edit`, `/expenses/[id]`, `/expenses/new`, `/expenses`, `/settings/expenses`
- **Device app**: `/expenses/claims`
- **Tests**: `expenses-projects.test.ts`, `travelclaims.test.ts`

### EXP-003 Reports: travel claims

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Trips claimed by each person: how many, how far and what was paid. Each trip sits on an ordinary expense claim. (screen text of `/expenses/travel`)
- **Routes (1) [F]**: `GET /reports/travel-claims`
- **Defined in**: `apps/api/src/routes/expenses.ts:52`
- **Permissions**: `expenses.view`
- **Services**: `expenses`
- **Tables touched (by the services used)**: account_groups, accounts, branches, employees, expense_categories, expense_claims, expense_lines, files, projects, vouchers
- **Screens**: `/expenses/travel`
- **Device app**: -
- **Tests**: `travelclaims.test.ts`


## PRJ Projects and Timesheets

### PRJ-001 Projects

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Tasks, time, costs and billing for each job. (screen text of `/projects/[id]`)
- **Routes (15) [F]**: `GET /projects`; `GET /projects/:id`; `POST /projects`; `PUT /projects/:id`; `POST /projects/:id/tasks`; `PUT /projects/:id/tasks/:childId`; `DELETE /projects/:id/tasks/:childId`; `PUT /projects/:id/members`; `DELETE /projects/:id/members/:childId`; `POST /projects/:id/milestones`; +5 more
- **Defined in**: `apps/api/src/routes/projects.ts:32`
- **Permissions**: `projects.create`, `projects.edit`, `projects.view`, `sales.create`
- **Services**: `projects`
- **Tables touched (by the services used)**: account_groups, accounts, employees, items, project_members, project_milestones, project_tasks, projects, salary_structures, sales_invoices (+1 more)
- **Screens**: `/projects/[id]`, `/projects/new`, `/projects`, `/projects/timesheets`
- **Device app**: -
- **Tests**: `expenses-projects.test.ts`

### PRJ-002 Timesheets

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Log hours against projects; approved billable hours can be invoiced. (screen text of `/projects/timesheets`)
- **Routes (4) [F]**: `GET /timesheets`; `POST /timesheets`; `DELETE /timesheets/:id`; `POST /timesheets/decide`
- **Defined in**: `apps/api/src/routes/projects.ts:93`
- **Permissions**: `projects.approve`, `projects.create`, `projects.view`
- **Services**: `projects`
- **Tables touched (by the services used)**: account_groups, accounts, employees, items, project_members, project_milestones, project_tasks, projects, salary_structures, sales_invoices (+1 more)
- **Screens**: `/projects/[id]`, `/projects/new`, `/projects/timesheets`
- **Device app**: `/timesheets`, `/timesheets/decide`
- **Tests**: `expenses-projects.test.ts`


## CRM CRM and Communications

### CRM-001 Comms: meta

- **Status**: PARTIALLY IMPLEMENTED (file 10)
- **Source comment [F]**: Every message the business sends, in one place: wording by language, who agreed to hear from you, what is waiting, what went, what it cost. (screen text of `/crm/communications`)
- **Routes (1) [F]**: `GET /comms/meta`
- **Defined in**: `apps/api/src/routes/comms.ts:31`
- **Permissions**: `crm.view`
- **Services**: `comms`
- **Tables touched (by the services used)**: accounts, comm_consents, comm_outbox, comm_settings, comm_templates
- **Screens**: `/crm/communications`
- **Device app**: -
- **Tests**: none matched

### CRM-002 Comms: templates

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Every message the business sends, in one place: wording by language, who agreed to hear from you, what is waiting, what went, what it cost. (screen text of `/crm/communications`)
- **Routes (2) [F]**: `GET /comms/templates`; `PUT /comms/templates`
- **Defined in**: `apps/api/src/routes/comms.ts:32`
- **Permissions**: `crm.edit`, `crm.view`
- **Services**: `comms`
- **Tables touched (by the services used)**: accounts, comm_consents, comm_outbox, comm_settings, comm_templates
- **Screens**: `/crm/communications`
- **Device app**: -
- **Tests**: `comms.test.ts`

### CRM-003 Comms: settings

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Every message the business sends, in one place: wording by language, who agreed to hear from you, what is waiting, what went, what it cost. (screen text of `/crm/communications`)
- **Routes (2) [F]**: `GET /comms/settings`; `PUT /comms/settings`
- **Defined in**: `apps/api/src/routes/comms.ts:38`
- **Permissions**: `crm.edit`, `crm.view`
- **Services**: `comms`
- **Tables touched (by the services used)**: accounts, comm_consents, comm_outbox, comm_settings, comm_templates
- **Screens**: `/crm/communications`
- **Device app**: -
- **Tests**: `comms.test.ts`, `commwiring.test.ts`

### CRM-004 Comms: reminders

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: The messages a business wants sent on a schedule: a reminder to each customer with bills past their due date (at most one a week each), and to each customer holding goods on approval past the date they were due back (once for the memo). Each only goes if the business switched it on.
- **Routes (1) [F]**: `POST /comms/reminders`
- **Defined in**: `apps/api/src/routes/comms.ts:48`
- **Permissions**: `crm.edit`
- **Services**: `commreminders`
- **Tables touched (by the services used)**: approval_memos
- **Screens**: none found
- **Device app**: -
- **Tests**: `commwiring.test.ts`

### CRM-005 Comms: consents

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Every message the business sends, in one place: wording by language, who agreed to hear from you, what is waiting, what went, what it cost. (screen text of `/crm/communications`)
- **Routes (2) [F]**: `GET /comms/consents`; `PUT /comms/consents`
- **Defined in**: `apps/api/src/routes/comms.ts:49`
- **Permissions**: `crm.edit`, `crm.view`
- **Services**: `comms`
- **Tables touched (by the services used)**: accounts, comm_consents, comm_outbox, comm_settings, comm_templates
- **Screens**: `/crm/communications`
- **Device app**: -
- **Tests**: `comms.test.ts`, `commwiring.test.ts`

### CRM-006 Comms: opt out

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Every message the business sends, in one place: wording by language, who agreed to hear from you, what is waiting, what went, what it cost. (screen text of `/crm/communications`)
- **Routes (1) [F]**: `POST /comms/opt-out`
- **Defined in**: `apps/api/src/routes/comms.ts:54`
- **Permissions**: `crm.edit`
- **Services**: `comms`
- **Tables touched (by the services used)**: accounts, comm_consents, comm_outbox, comm_settings, comm_templates
- **Screens**: `/crm/communications`
- **Device app**: -
- **Tests**: `comms.test.ts`

### CRM-007 Comms: send

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Every message the business sends, in one place: wording by language, who agreed to hear from you, what is waiting, what went, what it cost. (screen text of `/crm/communications`)
- **Routes (1) [F]**: `POST /comms/send`
- **Defined in**: `apps/api/src/routes/comms.ts:59`
- **Permissions**: `crm.edit`
- **Services**: `comms`
- **Tables touched (by the services used)**: accounts, comm_consents, comm_outbox, comm_settings, comm_templates
- **Screens**: `/crm/communications`
- **Device app**: `/comms/send`
- **Tests**: `comms.test.ts`

### CRM-008 Comms: queue

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: Puts one message in the outbox: wording in the requested language (English if there is none), consent checked, and a dedupe key so the same event for the same person never queues twice. A message that may not go is kept as "skipped" with the reason, so the log shows why.
- **Routes (1) [F]**: `POST /comms/queue`
- **Defined in**: `apps/api/src/routes/comms.ts:66`
- **Permissions**: `crm.edit`
- **Services**: `comms`
- **Tables touched (by the services used)**: accounts, comm_consents, comm_outbox, comm_settings, comm_templates
- **Screens**: none found
- **Device app**: -
- **Tests**: `comms.test.ts`, `crosstenant.test.ts`

### CRM-009 Comms: broadcast

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: A campaign: the promo wording to every customer who said yes to marketing on the channel; the rest are counted and left alone.
- **Routes (1) [F]**: `POST /comms/broadcast`
- **Defined in**: `apps/api/src/routes/comms.ts:70`
- **Permissions**: `crm.edit`
- **Services**: `comms`
- **Tables touched (by the services used)**: accounts, comm_consents, comm_outbox, comm_settings, comm_templates
- **Screens**: none found
- **Device app**: -
- **Tests**: `comms.test.ts`

### CRM-010 Comms: process

- **Status**: DEMO / PLACEHOLDER (file 10)
- **Source comment [F]**: Every message the business sends, in one place: wording by language, who agreed to hear from you, what is waiting, what went, what it cost. (screen text of `/crm/communications`)
- **Routes (1) [F]**: `POST /comms/process`
- **Defined in**: `apps/api/src/routes/comms.ts:74`
- **Permissions**: `crm.edit`
- **Services**: `comms`
- **Tables touched (by the services used)**: accounts, comm_consents, comm_outbox, comm_settings, comm_templates
- **Screens**: `/crm/communications`
- **Device app**: -
- **Tests**: `comms.test.ts`, `commwiring.test.ts`

### CRM-011 Comms: receipts

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: Goods that arrived (GRN). Stock goes up on receipt; the bill comes later. (screen text of `/purchase/receipts`)
- **Routes (1) [F]**: `POST /comms/receipts`
- **Defined in**: `apps/api/src/routes/comms.ts:75`
- **Permissions**: `crm.edit`
- **Services**: `comms`
- **Tables touched (by the services used)**: accounts, comm_consents, comm_outbox, comm_settings, comm_templates
- **Screens**: none found
- **Device app**: -
- **Tests**: `comms.test.ts`

### CRM-012 Comms: outbox

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: The events the business can send for, and who they usually go to.
- **Routes (1) [F]**: `GET /comms/outbox`
- **Defined in**: `apps/api/src/routes/comms.ts:80`
- **Permissions**: `crm.view`
- **Services**: `comms`
- **Tables touched (by the services used)**: accounts, comm_consents, comm_outbox, comm_settings, comm_templates
- **Screens**: none found
- **Device app**: -
- **Tests**: `commwiring.test.ts`, `crosstenant.test.ts`, `servicedesk.test.ts`

### CRM-013 Comms: report

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Every message the business sends, in one place: wording by language, who agreed to hear from you, what is waiting, what went, what it cost. (screen text of `/crm/communications`)
- **Routes (1) [F]**: `GET /comms/report`
- **Defined in**: `apps/api/src/routes/comms.ts:84`
- **Permissions**: `crm.view`
- **Services**: `comms`
- **Tables touched (by the services used)**: accounts, comm_consents, comm_outbox, comm_settings, comm_templates
- **Screens**: `/crm/communications`
- **Device app**: -
- **Tests**: `comms.test.ts`

### CRM-014 Webhooks

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: A signature the provider put on the exact bytes it sent: HMAC-SHA256 with the shared secret, as hex (with or without a "sha256=" prefix).
- **Routes (3) [F]**: `GET /webhooks/whatsapp`; `POST /webhooks/whatsapp`; `POST /webhooks/sms`
- **Defined in**: `apps/api/src/routes/commwebhooks.ts:16`
- **Permissions**: none declared (public)
- **Services**: `commwebhooks`
- **Tables touched (by the services used)**: -
- **Screens**: none found
- **Device app**: -
- **Tests**: `commwiring.test.ts`

### CRM-015 Crm: leads

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Prospects from first enquiry to order. (screen text of `/crm/leads/[id]`)
- **Routes (6) [F]**: `GET /crm/leads`; `GET /crm/leads/:id`; `POST /crm/leads`; `PUT /crm/leads/:id`; `POST /crm/leads/:id/stage`; `POST /crm/leads/:id/convert`
- **Defined in**: `apps/api/src/routes/crm.ts:31`
- **Permissions**: `crm.create`, `crm.edit`, `crm.view`
- **Services**: `crm`
- **Tables touched (by the services used)**: account_groups, accounts, crm_activities, crm_leads, message_templates, messages, quotations, sales_invoices, sales_orders, users
- **Screens**: `/crm/activities`, `/crm/customers/[id]`, `/crm/leads/[id]`, `/crm/leads/new`, `/crm/leads`, `/crm/templates`
- **Device app**: -
- **Tests**: `insights-crm.test.ts`

### CRM-016 Crm: pipeline

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Prospects from first enquiry to order. (screen text of `/crm/leads`)
- **Routes (1) [F]**: `GET /crm/pipeline`
- **Defined in**: `apps/api/src/routes/crm.ts:35`
- **Permissions**: `crm.view`
- **Services**: `crm`
- **Tables touched (by the services used)**: account_groups, accounts, crm_activities, crm_leads, message_templates, messages, quotations, sales_invoices, sales_orders, users
- **Screens**: `/crm/leads`
- **Device app**: -
- **Tests**: `insights-crm.test.ts`

### CRM-017 Crm: activities

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Calls, meetings and tasks, the earliest due first. (screen text of `/crm/activities`)
- **Routes (3) [F]**: `GET /crm/activities`; `POST /crm/activities`; `POST /crm/activities/:id/done`
- **Defined in**: `apps/api/src/routes/crm.ts:53`
- **Permissions**: `crm.create`, `crm.edit`, `crm.view`
- **Services**: `crm`
- **Tables touched (by the services used)**: account_groups, accounts, crm_activities, crm_leads, message_templates, messages, quotations, sales_invoices, sales_orders, users
- **Screens**: `/crm/activities`, `/crm/customers/[id]`, `/crm/leads/[id]`, `/crm/leads/new`, `/crm/templates`
- **Device app**: -
- **Tests**: `insights-crm.test.ts`

### CRM-018 Crm: templates

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: WhatsApp messages with numbered blanks for names, amounts and dates. To message a customer first, the template must be approved by Meta; enter its approved name. (screen text of `/crm/templates`)
- **Routes (3) [F]**: `GET /crm/templates`; `POST /crm/templates`; `PUT /crm/templates/:id`
- **Defined in**: `apps/api/src/routes/crm.ts:63`
- **Permissions**: `crm.edit`, `crm.view`
- **Services**: `crm`
- **Tables touched (by the services used)**: account_groups, accounts, crm_activities, crm_leads, message_templates, messages, quotations, sales_invoices, sales_orders, users
- **Screens**: `/crm/customers/[id]`, `/crm/leads/[id]`, `/crm/templates`
- **Device app**: -
- **Tests**: `insights-crm.test.ts`

### CRM-019 Crm: messaging

- **Status**: PARTIALLY IMPLEMENTED (file 10)
- **Source comment [F]**: Prospects from first enquiry to order. (screen text of `/crm/leads/[id]`)
- **Routes (1) [F]**: `GET /crm/messaging`
- **Defined in**: `apps/api/src/routes/crm.ts:64`
- **Permissions**: `crm.view`
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: `/crm/customers/[id]`, `/crm/leads/[id]`, `/crm/messages`, `/crm/templates`
- **Device app**: -
- **Tests**: none matched

### CRM-020 Crm: messages

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Calls, meetings and tasks, the earliest due first. (screen text of `/crm/activities`)
- **Routes (1) [F]**: `POST /crm/messages`
- **Defined in**: `apps/api/src/routes/crm.ts:71`
- **Permissions**: `crm.create`
- **Services**: `crm`
- **Tables touched (by the services used)**: account_groups, accounts, crm_activities, crm_leads, message_templates, messages, quotations, sales_invoices, sales_orders, users
- **Screens**: `/crm/activities`, `/crm/customers/[id]`, `/crm/leads/[id]`, `/crm/leads/new`, `/crm/templates`
- **Device app**: -
- **Tests**: `insights-crm.test.ts`

### CRM-021 Crm: customers

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: What each customer paid up front and still sits with you, and what is left to collect on work that is ready. (screen text of `/sales/service-customers`)
- **Routes (2) [F]**: `POST /crm/customers/:id/remind`; `GET /crm/customers/:id`
- **Defined in**: `apps/api/src/routes/crm.ts:76`
- **Permissions**: `crm.create`, `crm.view`
- **Services**: `crm`
- **Tables touched (by the services used)**: account_groups, accounts, crm_activities, crm_leads, message_templates, messages, quotations, sales_invoices, sales_orders, users
- **Screens**: `/crm/activities`, `/crm/customers/[id]`, `/crm/leads/[id]`, `/crm/leads/new`, `/crm/templates`
- **Device app**: -
- **Tests**: `insights-crm.test.ts`, `whatsapp.test.ts`


## AST Fixed Assets

### AST-001 Assets

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Register, depreciation as per the Companies Act, and the income-tax block schedule. (screen text of `/assets/[id]`)
- **Routes (14) [F]**: `GET /assets/presets`; `GET /assets/classes`; `POST /assets/classes`; `PATCH /assets/classes/:id`; `GET /assets`; `GET /assets/:id`; `POST /assets`; `POST /assets/:id/dispose`; `GET /assets/depreciation/runs`; `GET /assets/depreciation/preview`; +4 more
- **Defined in**: `apps/api/src/routes/assets.ts:25`
- **Permissions**: `assets.cancel`, `assets.create`, `assets.edit`, `assets.submit`, `assets.view`
- **Services**: `assets`
- **Tables touched (by the services used)**: account_groups, accounts, asset_classes, assets, branches, depreciation_entries, depreciation_runs, employees, it_block_openings, vouchers
- **Screens**: `/assets/[id]`, `/assets/depreciation`, `/assets/income-tax`, `/assets/new`, `/assets`
- **Device app**: -
- **Tests**: `assets.test.ts`


## RPT Reports and Analytics

### RPT-001 Analytics

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Sales, profit, stock and money for any period, against the same period last year. (screen text of `/insights`)
- **Routes (3) [F]**: `GET /analytics/dashboard`; `GET /analytics/insights`; `GET /analytics/checks`
- **Defined in**: `apps/api/src/routes/insights.ts:36`
- **Permissions**: `reports.view`
- **Services**: `analytics`, `insights`
- **Tables touched (by the services used)**: -
- **Screens**: `/dashboard`, `/insights`, `/my-menu`, `/reports/checks`
- **Device app**: `/analytics/dashboard`
- **Tests**: `apparel.test.ts`, `insights-crm.test.ts`

### RPT-002 Reports: colour size

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: The colour-size matrix: for each design, a row per colour (with its photo) and a column per size, with stock as of a date or pieces sold in a period, and totals both ways.
- **Routes (1) [F]**: `GET /reports/colour-size`
- **Defined in**: `apps/api/src/routes/insights.ts:48`
- **Permissions**: `inventory.view`, `reports.view`
- **Services**: `ownerreports`
- **Tables touched (by the services used)**: colors, items, style_images, styles, warehouses
- **Screens**: `/reports/colour-size`
- **Device app**: -
- **Tests**: `apparel.test.ts`

### RPT-003 Reports: stock ageing

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Stock ageing as of a date, first in first out: what is left of each receipt, by how long it has been in stock, valued at the item's stock rate; and dead stock, goods with no sale for the given number of days.
- **Routes (1) [F]**: `GET /reports/stock-ageing`
- **Defined in**: `apps/api/src/routes/insights.ts:57`
- **Permissions**: `inventory.view`, `reports.view`
- **Services**: `ownerreports`
- **Tables touched (by the services used)**: colors, items, style_images, styles, warehouses
- **Screens**: `/reports/stock-ageing`
- **Device app**: -
- **Tests**: `apparel.test.ts`

### RPT-004 Reports: sales register

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Daily and monthly registers, this year against last, profit by design, brand or party, stock cover, vendors and what is still to come. (screen text of `/reports/registers`)
- **Routes (1) [F]**: `GET /reports/sales-register`
- **Defined in**: `apps/api/src/routes/insights.ts:61`
- **Permissions**: `reports.view`, `sales.view`
- **Services**: `ownerreports`
- **Tables touched (by the services used)**: colors, items, style_images, styles, warehouses
- **Screens**: `/reports/sales-register`
- **Device app**: -
- **Tests**: `apparel.test.ts`

### RPT-005 Reports: builder

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Group and total sales, purchases, expenses, ledger entries or time any way you need; save it, or have it emailed. (screen text of `/reports/builder`)
- **Routes (4) [F]**: `GET /reports/builder/datasets`; `POST /reports/builder/run`; `POST /reports/builder/csv`; `POST /reports/builder/email`
- **Defined in**: `apps/api/src/routes/insights.ts:74`
- **Permissions**: `reports.export`
- **Services**: `reportbuilder`
- **Tables touched (by the services used)**: saved_reports
- **Screens**: `/reports/builder`, `/reports/saved`
- **Device app**: -
- **Tests**: `insights-crm.test.ts`

### RPT-006 Reports: saved

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Group and total sales, purchases, expenses, ledger entries or time any way you need; save it, or have it emailed. (screen text of `/reports/saved`)
- **Routes (4) [F]**: `GET /reports/saved`; `POST /reports/saved`; `PUT /reports/saved/:id`; `DELETE /reports/saved/:id`
- **Defined in**: `apps/api/src/routes/insights.ts:97`
- **Permissions**: `reports.export`, `reports.view`
- **Services**: `reportbuilder`
- **Tables touched (by the services used)**: saved_reports
- **Screens**: `/reports/builder`, `/reports/saved`
- **Device app**: -
- **Tests**: `crosstenant.test.ts`, `insights-crm.test.ts`

### RPT-007 Assistant

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Ask about sales, dues, profit, stock or GST. It reads your books; it never changes them. (screen text of `/assistant`)
- **Routes (2) [F]**: `GET /assistant/tools`; `POST /assistant/ask`
- **Defined in**: `apps/api/src/routes/insights.ts:103`
- **Permissions**: none declared (see file 07)
- **Services**: `assistant`
- **Tables touched (by the services used)**: accounts
- **Screens**: `/assistant`
- **Device app**: -
- **Tests**: `insights-crm.test.ts`

### RPT-008 Purchase bills (insights)

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Supplier invoices. Each one posts to purchases, input GST and the supplier's account. (screen text of `/purchase/bills/new`)
- **Routes (1) [F]**: `POST /purchase-bills/read`
- **Defined in**: `apps/api/src/routes/insights.ts:114`
- **Permissions**: `purchase.create`
- **Services**: `billreader`
- **Tables touched (by the services used)**: accounts, items
- **Screens**: `/purchase/bills/[id]`, `/purchase/bills/new`, `/purchase/orders/new`
- **Device app**: -
- **Tests**: `insights-crm.test.ts`

### RPT-009 Reports: profitability

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: From gross sales to operating profit, with each figure marked as booked, estimated or shared out. (screen text of `/reports/profitability`)
- **Routes (1) [F]**: `GET /reports/profitability`
- **Defined in**: `apps/api/src/routes/profitability.ts:11`
- **Permissions**: `reports.view`
- **Services**: `profitability`
- **Tables touched (by the services used)**: pos_settings
- **Screens**: `/reports/profitability`
- **Device app**: -
- **Tests**: `profitability.test.ts`

### RPT-010 Reports: register

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Daily and monthly registers, this year against last, profit by design, brand or party, stock cover, vendors and what is still to come. (screen text of `/reports/registers`)
- **Routes (1) [F]**: `GET /reports/register`
- **Defined in**: `apps/api/src/routes/retailreports.ts:17`
- **Permissions**: `reports.view`
- **Services**: `retailreports`
- **Tables touched (by the services used)**: -
- **Screens**: `/reports/registers`
- **Device app**: -
- **Tests**: `retailreports.test.ts`

### RPT-011 Reports: year comparison

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Daily and monthly registers, this year against last, profit by design, brand or party, stock cover, vendors and what is still to come. (screen text of `/reports/registers`)
- **Routes (1) [F]**: `GET /reports/year-comparison`
- **Defined in**: `apps/api/src/routes/retailreports.ts:21`
- **Permissions**: `reports.view`
- **Services**: `retailreports`
- **Tables touched (by the services used)**: -
- **Screens**: `/reports/registers`
- **Device app**: -
- **Tests**: `retailreports.test.ts`

### RPT-012 Reports: sales vs purchases

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Daily and monthly registers, this year against last, profit by design, brand or party, stock cover, vendors and what is still to come. (screen text of `/reports/registers`)
- **Routes (1) [F]**: `GET /reports/sales-vs-purchases`
- **Defined in**: `apps/api/src/routes/retailreports.ts:25`
- **Permissions**: `reports.view`
- **Services**: `retailreports`
- **Tables touched (by the services used)**: -
- **Screens**: `/reports/registers`
- **Device app**: -
- **Tests**: `retailreports.test.ts`

### RPT-013 Reports: profit by

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Daily and monthly registers, this year against last, profit by design, brand or party, stock cover, vendors and what is still to come. (screen text of `/reports/registers`)
- **Routes (1) [F]**: `GET /reports/profit-by`
- **Defined in**: `apps/api/src/routes/retailreports.ts:29`
- **Permissions**: `reports.view`
- **Services**: `retailreports`
- **Tables touched (by the services used)**: -
- **Screens**: `/reports/registers`
- **Device app**: -
- **Tests**: `retailreports.test.ts`

### RPT-014 Reports: stock ratios

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Daily and monthly registers, this year against last, profit by design, brand or party, stock cover, vendors and what is still to come. (screen text of `/reports/registers`)
- **Routes (1) [F]**: `GET /reports/stock-ratios`
- **Defined in**: `apps/api/src/routes/retailreports.ts:33`
- **Permissions**: `reports.view`
- **Services**: `retailreports`
- **Tables touched (by the services used)**: -
- **Screens**: `/reports/registers`
- **Device app**: -
- **Tests**: `retailreports.test.ts`

### RPT-015 Reports: vendor analysis

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Daily and monthly registers, this year against last, profit by design, brand or party, stock cover, vendors and what is still to come. (screen text of `/reports/registers`)
- **Routes (1) [F]**: `GET /reports/vendor-analysis`
- **Defined in**: `apps/api/src/routes/retailreports.ts:37`
- **Permissions**: `reports.view`
- **Services**: `retailreports`
- **Tables touched (by the services used)**: -
- **Screens**: `/reports/registers`
- **Device app**: -
- **Tests**: `retailreports.test.ts`

### RPT-016 Reports: purchase backlog

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Daily and monthly registers, this year against last, profit by design, brand or party, stock cover, vendors and what is still to come. (screen text of `/reports/registers`)
- **Routes (1) [F]**: `GET /reports/purchase-backlog`
- **Defined in**: `apps/api/src/routes/retailreports.ts:41`
- **Permissions**: `reports.view`
- **Services**: `retailreports`
- **Tables touched (by the services used)**: -
- **Screens**: `/reports/registers`
- **Device app**: -
- **Tests**: `retailreports.test.ts`


## AI Assistant, Chat and Notes

### AI-001 Chat

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Messages with the other people in this business. Only you and the other person can read a conversation. (screen text of `/chat`)
- **Routes (4) [F]**: `GET /chat/people`; `GET /chat/unread`; `GET /chat/:userId`; `POST /chat/:userId`
- **Defined in**: `apps/api/src/routes/chat.ts:11`
- **Permissions**: none declared (see file 07)
- **Services**: `chat`
- **Tables touched (by the services used)**: chat_messages, memberships, roles, users
- **Screens**: `/chat`
- **Device app**: -
- **Tests**: `chat.test.ts`

### AI-002 Notes

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Every entry, screen and report in one place. The star pins a tile to My Menu. (screen text of `/my-menu`)
- **Routes (4) [F]**: `GET /notes`; `POST /notes`; `PATCH /notes/:id`; `DELETE /notes/:id`
- **Defined in**: `apps/api/src/routes/notes.ts:19`
- **Permissions**: none declared (see file 07)
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: `/my-menu`
- **Device app**: -
- **Tests**: `notes.test.ts`


## SEC Security, Settings and Administration

### SEC-001 Auth: signup

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: New user + their first business, in one transaction.
- **Routes (1) [F]**: `POST /auth/signup`
- **Defined in**: `apps/api/src/routes/auth.ts:49`
- **Permissions**: none declared (public)
- **Services**: `onboarding`
- **Tables touched (by the services used)**: branches, companies, fiscal_years, memberships, number_series, roles, tenants, users
- **Screens**: `/signup`
- **Device app**: -
- **Tests**: `api.test.ts`

### SEC-002 Auth: login

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: (none). [I] Purpose inferred from path: auth login
- **Routes (1) [F]**: `POST /auth/login`
- **Defined in**: `apps/api/src/routes/auth.ts:64`
- **Permissions**: none declared (public)
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: `/login`
- **Device app**: `/auth/login`
- **Tests**: `api.test.ts`, `pos.test.ts`, `security.test.ts`, `sync-hr.test.ts`, `sync.test.ts` (+2 more)

### SEC-003 Auth: logout

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: (none). [I] Purpose inferred from path: auth logout
- **Routes (1) [F]**: `POST /auth/logout`
- **Defined in**: `apps/api/src/routes/auth.ts:85`
- **Permissions**: none declared (public)
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: none found
- **Device app**: `/auth/logout`
- **Tests**: none matched

### SEC-004 Auth: me

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Your name and password, used for every business you belong to. (screen text of `/account`)
- **Routes (2) [F]**: `GET /auth/me`; `PATCH /auth/me`
- **Defined in**: `apps/api/src/routes/auth.ts:91`
- **Permissions**: none declared (see file 07)
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: `/account`, `/accounts/chart`, `/accounts/close`, `/accounts/reconciliation`, `/accounts/tds`, `/accounts/vouchers/[id]` (+130 more) (136 screens call it)
- **Device app**: `/auth/me`
- **Tests**: `api.test.ts`, `auditanchor.test.ts`, `backups.test.ts`, `chat.test.ts`, `insights-crm.test.ts` (+5 more)

### SEC-005 Me: menu

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Every entry, screen and report in one place. The star pins a tile to My Menu. (screen text of `/my-menu`)
- **Routes (2) [F]**: `GET /me/menu`; `PUT /me/menu`
- **Defined in**: `apps/api/src/routes/auth.ts:104`
- **Permissions**: none declared (see file 07)
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: `/launcher`, `/my-menu`
- **Device app**: -
- **Tests**: `demo-pack.test.ts`

### SEC-006 Auth: switch

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: (none). [I] Purpose inferred from path: auth switch
- **Routes (1) [F]**: `POST /auth/switch`
- **Defined in**: `apps/api/src/routes/auth.ts:117`
- **Permissions**: none declared (see file 07)
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: none found
- **Device app**: -
- **Tests**: `restoretest.test.ts`, `team.test.ts`

### SEC-007 Auth: unlock

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: (none). [I] Purpose inferred from path: auth unlock
- **Routes (1) [F]**: `POST /auth/unlock`
- **Defined in**: `apps/api/src/routes/auth.ts:134`
- **Permissions**: none declared (see file 07)
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: none found
- **Device app**: -
- **Tests**: `unlock.test.ts`

### SEC-008 Auth: step up

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: (none). [I] Purpose inferred from path: auth step up
- **Routes (1) [F]**: `POST /auth/step-up`
- **Defined in**: `apps/api/src/routes/auth.ts:143`
- **Permissions**: none declared (see file 07)
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: none found
- **Device app**: -
- **Tests**: `close.test.ts`, `restoretest.test.ts`, `stockfinance.test.ts`, `stockreset.test.ts`, `sync.test.ts` (+1 more)

### SEC-009 Auth: password

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: (none). [I] Purpose inferred from path: auth password
- **Routes (3) [F]**: `POST /auth/password`; `POST /auth/password/forgot`; `POST /auth/password/reset`
- **Defined in**: `apps/api/src/routes/auth.ts:153`
- **Permissions**: none declared (public)
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: `/account`, `/forgot-password`, `/reset-password/[token]`
- **Device app**: -
- **Tests**: `security.test.ts`

### SEC-010 Backups

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Your data is yours. Download all of it, any time, in files you can open without Varchasv. (screen text of `/settings/backup`)
- **Routes (3) [F]**: `GET /backups`; `PUT /backups`; `POST /backups/run`
- **Defined in**: `apps/api/src/routes/backups.ts:10`
- **Permissions**: `company.export`
- **Services**: `backups`
- **Tables touched (by the services used)**: backup_runs, backup_settings, tenants
- **Screens**: `/settings/backup`
- **Device app**: -
- **Tests**: `backups.test.ts`

### SEC-011 Settings: approvals

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Changes that wait for a second person before they take effect. (screen text of `/settings/approvals`)
- **Routes (2) [F]**: `GET /settings/approvals`; `PUT /settings/approvals`
- **Defined in**: `apps/api/src/routes/changes.ts:11`
- **Permissions**: `settings.edit`, `settings.view`
- **Services**: `changes`
- **Tables touched (by the services used)**: accounts, change_requests, companies, employees, users
- **Screens**: `/settings/approvals`
- **Device app**: -
- **Tests**: `bankapproval.test.ts`, `empbankapproval.test.ts`

### SEC-012 Change requests

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Changes that wait for a second person before they take effect. (screen text of `/settings/approvals`)
- **Routes (2) [F]**: `GET /change-requests`; `POST /change-requests/:id/decide`
- **Defined in**: `apps/api/src/routes/changes.ts:17`
- **Permissions**: `settings.view`, `special.approveBankChange`
- **Services**: `changes`
- **Tables touched (by the services used)**: accounts, change_requests, companies, employees, users
- **Screens**: `/settings/approvals`
- **Device app**: -
- **Tests**: `bankapproval.test.ts`, `empbankapproval.test.ts`

### SEC-013 Companies

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Check a customer's or supplier's statement against your ledger. Matching is done by rules; what does not match becomes an exception with a reason, an owner and a history. (screen text of `/accounts/reconciliation`)
- **Routes (3) [F]**: `GET /companies`; `PATCH /companies/:id`; `POST /companies/:id/branches`
- **Defined in**: `apps/api/src/routes/company.ts:40`
- **Permissions**: `company.edit`, `company.view`
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: `/accounts/bill-receipt`, `/accounts/reconciliation`, `/accounts/tds`, `/accounts/working-capital`, `/assets/[id]`, `/dashboard` (+53 more) (59 screens call it)
- **Device app**: -
- **Tests**: `api.test.ts`, `apparel.test.ts`, `sales.test.ts`, `team.test.ts`

### SEC-014 Branches

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: (none). [I] Purpose inferred from path: branches
- **Routes (1) [F]**: `PATCH /branches/:id`
- **Defined in**: `apps/api/src/routes/company.ts:85`
- **Permissions**: `company.edit`
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: none found
- **Device app**: -
- **Tests**: none matched

### SEC-015 Fiscal years (company)

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Lock a period once its books are final: for example after filing GST returns. Nobody can post or cancel entries on or before the lock date. (screen text of `/settings/financial-years`)
- **Routes (1) [F]**: `GET /fiscal-years`
- **Defined in**: `apps/api/src/routes/company.ts:103`
- **Permissions**: `company.view`
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: `/settings/financial-years`
- **Device app**: -
- **Tests**: `accounting.test.ts`, `api.test.ts`, `purchasing.test.ts`

### SEC-016 Number series

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: How invoices and vouchers are numbered. GST allows at most 16 characters: letters, digits, - and /. (screen text of `/settings/number-series`)
- **Routes (2) [F]**: `GET /number-series`; `PATCH /number-series/:id`
- **Defined in**: `apps/api/src/routes/company.ts:108`
- **Permissions**: `settings.edit`, `settings.view`
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: `/settings/dated-changes`, `/settings/number-series`
- **Device app**: -
- **Tests**: `api.test.ts`, `scheduledchanges.test.ts`

### SEC-017 Audit log

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Every change, who made it and when. Entries can't be edited or deleted. (screen text of `/settings/audit-log`)
- **Routes (4) [F]**: `GET /audit-log`; `POST /audit-log/verify`; `GET /audit-log/anchor`; `GET /audit-log/sensitive`
- **Defined in**: `apps/api/src/routes/company.ts:148`
- **Permissions**: `settings.view`
- **Services**: `auditchain`, `sensitive`
- **Tables touched (by the services used)**: -
- **Screens**: `/settings/audit-log`, `/settings/sensitive-changes`
- **Device app**: -
- **Tests**: `api.test.ts`, `auditanchor.test.ts`, `auditchain.test.ts`, `bankapproval.test.ts`, `requestid.test.ts` (+3 more)

### SEC-018 Export

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Your data is yours. Download all of it, any time, in files you can open without Varchasv. (screen text of `/settings/backup`)
- **Routes (4) [F]**: `GET /export/business.zip`; `POST /export/business.vbk`; `POST /export/verify`; `POST /export/restore-test`
- **Defined in**: `apps/api/src/routes/company.ts:176`
- **Permissions**: `company.export`; step-up required on 1 route(s)
- **Services**: `export`, `restore`
- **Tables touched (by the services used)**: length, reduce, memberships, tenants
- **Screens**: `/settings/backup`
- **Device app**: -
- **Tests**: `backupcrypt.test.ts`, `crosstenant.test.ts`, `export.test.ts`, `restoretest.test.ts`

### SEC-019 Controls

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Who can both do and approve, journals that look unusual, dealings with related parties, and a regular look at who has access. (screen text of `/settings/controls`)
- **Routes (7) [F]**: `GET /controls/sod`; `GET /controls/journals`; `GET /controls/related-parties`; `GET /controls/access-reviews`; `POST /controls/access-reviews`; `POST /controls/access-reviews/:id/decide`; `POST /controls/access-reviews/:id/complete`
- **Defined in**: `apps/api/src/routes/controls.ts:16`
- **Permissions**: `reports.view`, `users.edit`, `users.view`
- **Services**: `controls`
- **Tables touched (by the services used)**: access_reviews, accounts, memberships, roles, users
- **Screens**: `/settings/controls`
- **Device app**: -
- **Tests**: `controls.test.ts`

### SEC-020 Accounts (controls)

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Who can both do and approve, journals that look unusual, dealings with related parties, and a regular look at who has access. (screen text of `/settings/controls`)
- **Routes (1) [F]**: `PUT /accounts/:id/related-party`
- **Defined in**: `apps/api/src/routes/controls.ts:25`
- **Permissions**: `accounts.edit`
- **Services**: `controls`
- **Tables touched (by the services used)**: access_reviews, accounts, memberships, roles, users
- **Screens**: `/settings/controls`
- **Device app**: -
- **Tests**: `controls.test.ts`

### SEC-021 Cron

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: Seal businesses that have new entries (the scheduler calls this once a minute). A pass stops after its time budget, so a backlog is worked through over several passes and never holds the database busy for long. Runs every backup that has come due; one business failing does not stop the others.
- **Routes (7) [F]**: `GET /cron/reports`; `GET /cron/backups`; `GET /cron/comms`; `GET /cron/reminders`; `GET /cron/statements`; `GET /cron/changes`; `GET /cron/audit-seal`
- **Defined in**: `apps/api/src/routes/cron.ts:21`
- **Permissions**: none declared (see file 07)
- **Services**: `auditchain`, `backups`, `commreminders`, `comms`, `consignment`, `reportbuilder`, `scheduledchanges`
- **Tables touched (by the services used)**: accounts, items, saved_reports, backup_runs, backup_settings, tenants, comm_consents, comm_outbox, comm_settings, comm_templates (+10 more)
- **Screens**: none found
- **Device app**: -
- **Tests**: none matched

### SEC-022 Settings: process locks

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Close one kind of document up to a date without locking the whole period. (screen text of `/settings/process-locks`)
- **Routes (2) [F]**: `GET /settings/process-locks`; `PUT /settings/process-locks`
- **Defined in**: `apps/api/src/routes/processlocks.ts:9`
- **Permissions**: `settings.edit`, `settings.view`
- **Services**: `processlocks`
- **Tables touched (by the services used)**: process_locks
- **Screens**: `/settings/process-locks`
- **Device app**: -
- **Tests**: `processlocks.test.ts`

### SEC-023 Config

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Set a GST rate, a price or credit terms to change on a chosen day. The old value stays until then, and what changed is kept here. (screen text of `/settings/dated-changes`)
- **Routes (4) [F]**: `GET /config/fields`; `GET /config/changes`; `POST /config/changes`; `POST /config/changes/:id/cancel`
- **Defined in**: `apps/api/src/routes/scheduledchanges.ts:13`
- **Permissions**: `settings.view`
- **Services**: `scheduledchanges`
- **Tables touched (by the services used)**: accounts, items, number_series, roles, scheduled_changes
- **Screens**: `/settings/dated-changes`
- **Device app**: -
- **Tests**: `scheduledchanges.test.ts`

### SEC-024 Members

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Check a customer's or supplier's statement against your ledger. Matching is done by rules; what does not match becomes an exception with a reason, an owner and a history. (screen text of `/accounts/reconciliation`)
- **Routes (3) [F]**: `GET /members`; `PATCH /members/:id`; `DELETE /members/:id`
- **Defined in**: `apps/api/src/routes/team.ts:34`
- **Permissions**: `users.delete`, `users.edit`, `users.view`
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: `/accounts/reconciliation`, `/settings/team`
- **Device app**: -
- **Tests**: `storescope.test.ts`, `team.test.ts`

### SEC-025 Invitations

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Who can use this business and what each person can do. (screen text of `/settings/team`)
- **Routes (5) [F]**: `GET /invitations`; `POST /invitations`; `DELETE /invitations/:id`; `GET /invitations/lookup/:token`; `POST /invitations/accept`
- **Defined in**: `apps/api/src/routes/team.ts:119`
- **Permissions**: `users.create`, `users.view`
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: `/settings/team`, `/invite/[token]`
- **Device app**: -
- **Tests**: `bankapproval.test.ts`, `chat.test.ts`, `close.test.ts`, `controls.test.ts`, `empbankapproval.test.ts` (+13 more)

### SEC-026 Roles

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Set a GST rate, a price or credit terms to change on a chosen day. The old value stays until then, and what changed is kept here. (screen text of `/settings/dated-changes`)
- **Routes (4) [F]**: `GET /roles`; `POST /roles`; `PATCH /roles/:id`; `DELETE /roles/:id`
- **Defined in**: `apps/api/src/routes/team.ts:237`
- **Permissions**: `users.edit`, `users.view`
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: `/settings/dated-changes`, `/settings/team`
- **Device app**: -
- **Tests**: `bankapproval.test.ts`, `chat.test.ts`, `close.test.ts`, `controls.test.ts`, `empbankapproval.test.ts` (+13 more)

### SEC-027 Tenants

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: A ready-to-use business for an existing user, inside the caller's transaction: tenant, system roles, owner membership, company, head-office branch, current financial year and default number series. Leaves `app.tenant_id` set to the new tenant for the rest of the transaction.
- **Routes (1) [F]**: `POST /tenants`
- **Defined in**: `apps/api/src/routes/team.ts:295`
- **Permissions**: none declared (see file 07)
- **Services**: `onboarding`
- **Tables touched (by the services used)**: branches, companies, fiscal_years, memberships, number_series, roles, tenants, users
- **Screens**: none found
- **Device app**: -
- **Tests**: `team.test.ts`

### SEC-028 Meta

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: (none). [I] Purpose inferred from path: meta
- **Routes (1) [F]**: `GET /meta/states`
- **Defined in**: `apps/api/src/routes/tools.ts:9`
- **Permissions**: none declared (public)
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: none found
- **Device app**: -
- **Tests**: none matched

### SEC-029 Tools

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: (none). [I] Purpose inferred from path: tools
- **Routes (2) [F]**: `POST /tools/gstin`; `POST /tools/gst`
- **Defined in**: `apps/api/src/routes/tools.ts:11`
- **Permissions**: none declared (public)
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: none found
- **Device app**: -
- **Tests**: `api.test.ts`

### SEC-030 Reports: user activity

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: Who signed in and what they made, changed and cancelled, from the audit trail. (screen text of `/reports/user-activity`)
- **Routes (1) [F]**: `GET /reports/user-activity`
- **Defined in**: `apps/api/src/routes/useractivity.ts:12`
- **Permissions**: `settings.view`
- **Services**: `useractivity`
- **Tables touched (by the services used)**: -
- **Screens**: `/reports/user-activity`
- **Device app**: -
- **Tests**: `useractivity.test.ts`


## SYN Offline Sync

### SYN-001 Sync: offline rules

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: Statement lines with these words are posted to a ledger in one click (bank charges, interest, standing orders). (screen text of `/banking/rules`)
- **Routes (1) [F]**: `GET /sync/offline-rules`
- **Defined in**: `apps/api/src/routes/offline.ts:7`
- **Permissions**: none declared (see file 07)
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: none found
- **Device app**: `/sync/offline-rules`
- **Tests**: `offlinerules.test.ts`

### SYN-002 Sync: status

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: The phones and computers that work offline for this business, when each last synced, and anything the server refused. (screen text of `/settings/devices`)
- **Routes (1) [F]**: `GET /sync/status`
- **Defined in**: `apps/api/src/routes/sync.ts:341`
- **Permissions**: `users.view`
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: `/settings/devices`
- **Device app**: -
- **Tests**: `syncqueue.test.ts`

### SYN-003 Sync: rejections

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: The phones and computers that work offline for this business, when each last synced, and anything the server refused. (screen text of `/settings/devices`)
- **Routes (2) [F]**: `GET /sync/rejections`; `POST /sync/rejections/:id/resolve`
- **Defined in**: `apps/api/src/routes/sync.ts:350`
- **Permissions**: `users.edit`, `users.view`
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: `/settings/devices`
- **Device app**: -
- **Tests**: `syncqueue.test.ts`

### SYN-004 Devices

- **Status**: FULLY IMPLEMENTED (file 10)
- **Source comment [F]**: The phones and computers that work offline for this business, when each last synced, and anything the server refused. (screen text of `/settings/devices`)
- **Routes (3) [F]**: `POST /devices`; `GET /devices`; `POST /devices/:id/revoke`
- **Defined in**: `apps/api/src/routes/sync.ts:377`
- **Permissions**: `accounts.view`, `users.edit`, `users.view`; step-up required on 1 route(s)
- **Services**: `accounting`
- **Tables touched (by the services used)**: account_groups, accounts, companies, fiscal_years, gl_entries, number_series, voucher_lines, vouchers
- **Screens**: `/settings/devices`, `/settings/pos`
- **Device app**: `/devices`
- **Tests**: `pos.test.ts`, `sync-hr.test.ts`, `sync.test.ts`, `syncqueue.test.ts`, `syncstockcount.test.ts`

### SYN-005 Sync: pull

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: (none). [I] Purpose inferred from path: sync pull
- **Routes (1) [F]**: `GET /sync/pull`
- **Defined in**: `apps/api/src/routes/sync.ts:428`
- **Permissions**: `accounts.view`
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: none found
- **Device app**: `/sync/pull`
- **Tests**: `pos.test.ts`, `sync-hr.test.ts`, `sync.test.ts`, `syncqueue.test.ts`

### SYN-006 Sync: push

- **Status**: BACKEND ONLY (file 10)
- **Source comment [F]**: (none). [I] Purpose inferred from path: sync push
- **Routes (1) [F]**: `POST /sync/push`
- **Defined in**: `apps/api/src/routes/sync.ts:449`
- **Permissions**: `accounts.view`
- **Services**: (logic inline in the route file)
- **Tables touched (by the services used)**: -
- **Screens**: none found
- **Device app**: `/sync/push`
- **Tests**: `pos.test.ts`, `sync-hr.test.ts`, `sync.test.ts`, `syncqueue.test.ts`, `syncstockcount.test.ts`
