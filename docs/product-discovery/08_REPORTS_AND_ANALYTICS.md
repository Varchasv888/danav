# 08 Reports and analytics

All report-like screens, report API routes, the report builder, saved reports, print outputs and exports. Facts from `apps/web/app`, `apps/api/src/routes` and `apps/web/components/reports`.

## A. Report screens [F]

| Screen | Title | What it shows (screen subtitle) | Features | Print | Export | File |
|---|---|---|---|---|---|---|
| `/insights` | Business insights | Sales, profit, stock and money for any period, against the same period last year. | RPT-001 |  |  | `(app)/insights/page.tsx` |
| `/reports/balance-sheet` | - | - | FIN-016 |  |  | `(app)/reports/balance-sheet/page.tsx` |
| `/reports/books` | Account books | Cash and bank movements, a group month by month, what was spent from cash and bank, and where the money came f | FIN-001, FIN-002, FIN-003 |  |  | `(app)/reports/books/page.tsx` |
| `/reports/builder` | Report builder | Group and total sales, purchases, expenses, ledger entries or time any way you need; save it, or have it email | RPT-005, RPT-006 |  | yes | `(app)/reports/builder/page.tsx` |
| `/reports/cash-flow-statement` | Cash flow | Where the cash came from and where it went, from profit to the change in cash and bank. | FIN-019 |  |  | `(app)/reports/cash-flow-statement/page.tsx` |
| `/reports/cfo` | Owner's view | From sales to profit for the period, against the same period last year. Profit before and after tax are the sa | FIN-008 |  |  | `(app)/reports/cfo/page.tsx` |
| `/reports/checks` | Checks | Entries worth a second look before your CA sees them: cash limits under the Income-tax Act, possible duplicate | RPT-001 |  |  | `(app)/reports/checks/page.tsx` |
| `/reports/colour-size` | - | - | FIN-010, FIN-011, SEC-013 |  | yes | `(app)/reports/colour-size/page.tsx` |
| `/reports/consignment-sales` | Shop-in-shop sales | Goods billed from consignment stock, grouped the way you ask. | SAL-013 |  |  | `(app)/reports/consignment-sales/page.tsx` |
| `/reports/daily-sales` | Daily sales | One day of selling: sales net of returns, bills, what moved through cash and the bank, and the best sellers. | POS-007 |  |  | `(app)/reports/daily-sales/page.tsx` |
| `/reports/discounts` | Discount register | Every discounted line on invoices and counter bills in the period, and which items are discounted most. | POS-008 |  |  | `(app)/reports/discounts/page.tsx` |
| `/reports/integrity` | Integrity check | Do your books agree with themselves? Each check compares two things that must match and lists any difference w | FIN-007 |  |  | `(app)/reports/integrity/page.tsx` |
| `/reports/interest` | Interest on overdue | Simple interest on each bill for the days it is past due, at the customer's rate. | SAL-019 |  |  | `(app)/reports/interest/page.tsx` |
| `/reports/ledger/[id]` | - | - | FIN-017 |  |  | `(app)/reports/ledger/[id]/page.tsx` |
| `/reports/msme` | MSME payments | What is owed to micro and small suppliers, bill by bill. A bill unpaid after {days} days of acceptance cannot  | TAX-012 |  |  | `(app)/reports/msme/page.tsx` |
| `/reports/payables` | - | - | SEC-004, SAL-030 |  |  | `(app)/reports/payables/page.tsx` |
| `/reports/profit-loss` | - | - | FIN-015 |  |  | `(app)/reports/profit-loss/page.tsx` |
| `/reports/profitability` | Profitability | From gross sales to operating profit, with each figure marked as booked, estimated or shared out. | RPT-009 |  |  | `(app)/reports/profitability/page.tsx` |
| `/reports/receivables` | - | - | SEC-004, SAL-030 |  |  | `(app)/reports/receivables/page.tsx` |
| `/reports/registers` | Registers and ratios | Daily and monthly registers, this year against last, profit by design, brand or party, stock cover, vendors an | RPT-010, RPT-011, RPT-012 |  |  | `(app)/reports/registers/page.tsx` |
| `/reports/sales-order-register` | Sales order register | Sales orders still to be fulfilled, with what is pending and its value. Orders past their promised date come f | SAL-017 |  |  | `(app)/reports/sales-order-register/page.tsx` |
| `/reports/sales-register` | - | - | RPT-004 |  | yes | `(app)/reports/sales-register/page.tsx` |
| `/reports/saved` | Report builder | Group and total sales, purchases, expenses, ledger entries or time any way you need; save it, or have it email | SEC-004, RPT-005, RPT-006 |  | yes | `(app)/reports/saved/page.tsx` |
| `/reports/stock-ageing` | - | - | RPT-003 |  | yes | `(app)/reports/stock-ageing/page.tsx` |
| `/reports/stock-movement` | Fast and slow movers | What sold in the last {days} days. Fast means {fastMin} or more pieces; slow means some sold, fewer than that; | FIN-009 |  |  | `(app)/reports/stock-movement/page.tsx` |
| `/reports/stock-posting-check` | Stock posting check | Every sale should have taken exactly its pieces out of stock. This lists the ones that did not. | INV-026 |  |  | `(app)/reports/stock-posting-check/page.tsx` |
| `/reports/store-results` | Store results | Each store with its sales, gross margin and share of the expenses. | SEC-004, FIN-027, FIN-028 |  |  | `(app)/reports/store-results/page.tsx` |
| `/reports/trial-balance` | - | - | FIN-014 |  |  | `(app)/reports/trial-balance/page.tsx` |
| `/reports/user-activity` | User activity | Who signed in and what they made, changed and cancelled, from the audit trail. | SEC-030 |  |  | `(app)/reports/user-activity/page.tsx` |
| `/reports/year-end` | Year-end check | What to settle before a financial year is closed and locked. Nothing here changes your books. | FIN-035, FIN-036 |  |  | `(app)/reports/year-end/page.tsx` |

## B. Report API routes [F]

| Method | Path | Feature | Guard |
|---|---|---|---|
| GET | `/reports/cash-book` | FIN-001 | reports.view |
| GET | `/reports/group-month` | FIN-002 | reports.view |
| GET | `/reports/cash-bank-expense` | FIN-003 | reports.view |
| GET | `/reports/cash-flow` | FIN-004 | reports.view |
| GET | `/reports/rcm-register` | FIN-005 | reports.view |
| GET | `/reports/bill-adjustments` | FIN-006 | reports.view |
| GET | `/reports/integrity` | FIN-007 | reports.view |
| GET | `/reports/cfo` | FIN-008 | reports.view |
| GET | `/reports/stock-movement` | FIN-009 | reports.view |
| GET | `/reports/trial-balance` | FIN-014 | reports.view |
| GET | `/reports/profit-loss` | FIN-015 | reports.view |
| GET | `/reports/balance-sheet` | FIN-016 | reports.view |
| GET | `/reports/ledger/:accountId` | FIN-017 | reports.view |
| GET | `/reports/cash-flow-statement` | FIN-019 | reports.view |
| GET | `/reports/agent-commission` | SAL-007 | special.seeAgentCommission |
| GET | `/reports/salesman` | SAL-009 | sales.view |
| GET | `/reports/salesman-year` | SAL-010 | sales.view |
| GET | `/comms/report` | CRM-013 | crm.view |
| GET | `/reports/consignment-sales` | SAL-013 | sales.view |
| GET | `/cron/reports` | SEC-021 | - |
| GET | `/reports/daily-sales` | POS-007 | reports.view |
| GET | `/reports/discounts` | POS-008 | reports.view |
| GET | `/reports/branch-comparison` | INV-001 | reports.view |
| GET | `/reports/travel-claims` | EXP-003 | expenses.view |
| GET | `/reports/${kind}s` | TAX-008 | reports.view |
| GET | `/payroll-runs/:id/register` | HR-008 | payroll.export |
| GET | `/analytics/dashboard` | RPT-001 | reports.view |
| GET | `/analytics/insights` | RPT-001 | reports.view |
| GET | `/analytics/checks` | RPT-001 | reports.view |
| GET | `/reports/colour-size` | RPT-002 | inventory.view, reports.view |
| GET | `/reports/stock-ageing` | RPT-003 | inventory.view, reports.view |
| GET | `/reports/sales-register` | RPT-004 | sales.view, reports.view |
| GET | `/reports/builder/datasets` | RPT-005 | - |
| POST | `/reports/builder/run` | RPT-005 | - |
| POST | `/reports/builder/csv` | RPT-005 | reports.export |
| POST | `/reports/builder/email` | RPT-005 | reports.export |
| GET | `/reports/saved` | RPT-006 | reports.view |
| POST | `/reports/saved` | RPT-006 | reports.export |
| PUT | `/reports/saved/:id` | RPT-006 | reports.export |
| DELETE | `/reports/saved/:id` | RPT-006 | reports.export |
| GET | `/reports/stock-summary` | INV-009 | inventory.view |
| GET | `/reports/item-ledger/:itemId` | INV-010 | inventory.view |
| GET | `/reports/reorder` | INV-011 | inventory.view |
| GET | `/reports/stock-losses` | INV-014 | inventory.view |
| GET | `/loyalty/report` | POS-009 | sales.view |
| GET | `/reports/msme` | TAX-012 | accounts.view |
| GET | `/reports/sales-order-register` | SAL-017 | sales.view |
| GET | `/reports/interest` | SAL-019 | reports.view |
| GET | `/reports/profitability` | RPT-009 | reports.view |
| GET | `/reports/supplier-claims` | PUR-006 | purchase.view |
| GET | `/reports/service-customers` | POS-024 | sales.view |
| GET | `/reports/register` | RPT-010 | reports.view |
| GET | `/reports/year-comparison` | RPT-011 | reports.view |
| GET | `/reports/sales-vs-purchases` | RPT-012 | reports.view |
| GET | `/reports/profit-by` | RPT-013 | reports.view |
| GET | `/reports/stock-ratios` | RPT-014 | reports.view |
| GET | `/reports/vendor-analysis` | RPT-015 | reports.view |
| GET | `/reports/purchase-backlog` | RPT-016 | reports.view |
| GET | `/salesman-commission/report` | SAL-028 | payroll.view |
| GET | `/reports/stock-audit` | INV-023 | inventory.view |
| GET | `/reports/stock-posting-check` | INV-026 | reports.view |
| GET | `/reports/user-activity` | SEC-030 | settings.view |
| GET | `/reports/year-end` | FIN-035 | reports.view |
| GET | `/reports/carry-forward` | FIN-036 | reports.view |

## C. Dashboards and analytics [F]

| Screen | Content |
|---|---|
| `/my-menu`, `/launcher` | Pinned tiles (My Menu, per user) and every entry/screen/report in one launcher; the star pins a tile. |
| `/insights` | Business insights: sales, profit, stock and money for any period against the same period last year (period presets). |
| `/reports/cfo` | Owner's view: revenue, cost of goods, gross profit and margin, against last year. |
| `/reports/registers` | Daily and monthly registers, this year against last, profit by design, brand or party, stock cover, vendors and what is still to come. |
| `/assistant` | Ask about sales, dues, profit, stock or GST; reads the books and never changes them. Rule based with optional model call (`ASSISTANT_MODEL`, `ANTHROPIC_API_KEY`). |
| `/reports/builder`, `/reports/saved` | Group and total sales, purchases, expenses, ledger entries or time any way you need; save it or have it emailed (scheduled by `due_saved_reports`). |

Analytics routes `/analytics/*`: `GET /analytics/dashboard`, `GET /analytics/insights`, `GET /analytics/checks`

## D. Print outputs [F]

| Output | Route pattern |
|---|---|
|  | /print/box-label/[id] |
|  | /print/catalogue/[id] |
|  | /print/challan/[id] |
|  | /print/cheque/[id] |
|  | /print/count-sheet/[id] |
|  | /print/envelope/[id] |
|  | /print/eway-bill/[id] |
|  | /print/form16/[id] |
|  | /print/invoice/[id] |
|  | /print/labels |
|  | /print/packing-slip/[id] |
|  | /print/parcel-labels/[id] |
|  | /print/payslip/[id] |
|  | /print/quotation/[id] |
|  | /print/receipt/[id] |
|  | /print/tds-certificate |
|  | /print/transfer-slip/[id] |
|  | /print/vouchers |

Labels: tags with barcode, MRP and size on label rolls, A4 sheets (several grid presets, A4 is the default) or hang tags (`/inventory/labels`, `/print/labels`, plan R18). E-way bill print page: `/print/eway-bill/[id]`.

## E. Exports and sharing [F]

| Method | Path | Feature |
|---|---|---|
| GET | `/export/business.zip` | SEC-018 |
| POST | `/export/business.vbk` | SEC-018 |
| POST | `/export/verify` | SEC-018 |
| POST | `/export/restore-test` | SEC-018 |
| GET | `/exports/shipments` | TAX-001 |
| PUT | `/exports/shipments/:invoiceId` | TAX-001 |
| GET | `/exports/rates` | TAX-001 |
| POST | `/exports/rates` | TAX-001 |
| DELETE | `/exports/rates/:id` | TAX-001 |
| GET | `/exports/incentive` | TAX-001 |
| GET | `/exports/scrips` | TAX-001 |
| POST | `/exports/scrips` | TAX-001 |
| POST | `/exports/scrips/:id/use` | TAX-001 |
| GET | `/exports/inverted-duty` | TAX-001 |

Documents are shared as tokenised public links (`/public/documents/:token`, `/public/catalogue/:token`) that expire. Screens that offer a download or print are flagged `export` / `print` in file 03.

## F. Report gaps recorded in the plan [F]

- **R4** (marked in progress): a graph on stock ageing.
- **R5** (marked in progress): vertical view, ledger views by previous year, pending transactions.
- **R24** (marked in progress): PDF and WhatsApp delivery, a filter panel on every attribute.
- **R25** (marked in progress): interest and tax lines (no such accounts in the standard chart).
- **R15** (marked in progress): drill from the other panels.
- **U3** (marked in progress): see plan
