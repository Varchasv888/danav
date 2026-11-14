# Product status inventory: what is made, partly built and still to build

Compiled on 6 November 2026 from the product discovery pack (file 10, implementation status, baseline 4 November), the audit run described in `distributor-brief-mapping.md`, and the work done on 6 November. Nothing here is a promise of a date.

How to read the status words:
- **Made**: routes, a screen and an automated test exist (the pack's FULLY IMPLEMENTED). This does not mean complete against a real customer's needs.
- **Partly built**: some of the path exists. This includes routes and a screen with no test, backend-only features with no screen, demo adapters (a simulator stands in for the real service), and plan items with a stated list of work left.
- **Still to build**: nothing found in the code, or documented as not started.

Limits: the pack was a static review. Statuses come from routes, screens and tests, not from running the product, except for the 146-screen smoke test of the seven main modules on 6 November (all loaded without errors).

## 1. Totals

| Status | Features |
|---|---|
| FULLY IMPLEMENTED | 230 |
| BACKEND ONLY | 26 |
| PARTIALLY IMPLEMENTED | 8 |
| DEMO / PLACEHOLDER | 4 |
| Total features | 268 |

Plan items (`docs/apparel-plan.md`): PARTIALLY IMPLEMENTED 55, NOT IMPLEMENTED 40, FULLY IMPLEMENTED 15 (total 110). Menu tiles without a screen: 23.

## 2. By module

| Module | Made | Partly (no test) | Backend only | Demo | Total |
|---|---|---|---|---|---|
| FIN Accounting and Finance | 36 | 0 | 0 | 0 | 36 |
| TAX GST, TDS and Statutory Compliance | 17 | 1 | 1 | 2 | 21 |
| BNK Banking | 4 | 1 | 0 | 0 | 5 |
| SAL Sales and Wholesale | 27 | 1 | 3 | 1 | 32 |
| POS Counter, Retail and Service Desk | 30 | 0 | 2 | 0 | 32 |
| PUR Purchasing | 6 | 0 | 0 | 0 | 6 |
| INV Inventory and Masters of Stock | 28 | 2 | 0 | 0 | 30 |
| MFG Manufacturing and Job Work | 5 | 0 | 0 | 0 | 5 |
| HR People, Attendance and Payroll | 17 | 1 | 2 | 0 | 20 |
| EXP Expenses | 3 | 0 | 0 | 0 | 3 |
| PRJ Projects and Timesheets | 2 | 0 | 0 | 0 | 2 |
| CRM CRM and Communications | 12 | 2 | 6 | 1 | 21 |
| AST Fixed Assets | 1 | 0 | 0 | 0 | 1 |
| RPT Reports and Analytics | 16 | 0 | 0 | 0 | 16 |
| AI Assistant, Chat and Notes | 2 | 0 | 0 | 0 | 2 |
| SEC Security, Settings and Administration | 21 | 0 | 9 | 0 | 30 |
| SYN Offline Sync | 3 | 0 | 3 | 0 | 6 |

## 3. Features made (230), by module

Each name is the pack's own feature label. A route group is one feature.

### FIN Accounting and Finance (36 of 36)

Reports: cash book; Reports: group month; Reports: cash bank expense; Reports: cash flow; Reports: rcm register; Reports: bill adjustments; Reports: integrity; Reports: cfo; Reports: stock movement; Accounts: groups; Accounts (accounting); Vouchers; Fiscal years (accounting); Reports: trial balance; Reports: profit loss; Reports: balance sheet; Reports: ledger; Bill receipts; Reports: cash flow statement; Close; Pos: day close; Pos: sessions (close); Scenarios; Finance: stock review; Finance: writedowns; Finance: cost centres; Finance: store results; Finance: allocation rules; Finance: credit exposure; Finance: supplier calendar; Finance: cash forecast; Finance: commitments; Finance: drawing power; Finance: cheques; Reports: year end; Reports: carry forward.

### TAX GST, TDS and Statutory Compliance (17 of 21)

Exports; Gst: settings; Gst: gstr1; Gst: gstr3b; Import; Gst jv; Gst: work; Reports: msme; Tds: section map; Tds: sections; Tds: preview; Tds: deductions; Tds: challans; Tds: 26q; Tds: certificate; Tds: 194q; Tcs.

### BNK Banking (4 of 5)

Banking: accounts; Banking: rules; Banking: settlements; Recon.

### SAL Sales and Wholesale (27 of 32)

Styles (catalogue); Style images; Catalogue; Public (catalogue); Agents; Reports: agent commission; Brokerage bills; Reports: salesman; Reports: salesman year; Sales targets; Consignees; Reports: consignment sales; Consignment; Delivery orders; Reports: sales order register; Price lists; Reports: interest; Quotations; Sales orders; Delivery notes; Approvals; Samples; Sales invoices (sales); Credit notes; Salesman commission; Reminders; Public (sharing).

### POS Counter, Retail and Service Desk (30 of 32)

Karigars; Alteration types; Alterations; Approval memos; Branch prices; Pos: branch prices; Reports: daily sales; Reports: discounts; Loyalty; Schemes; Pos: schemes; Pos: settings; Pos: terminals; Pos: sessions (pos); Pos: bills; Pos: returns; Pos: summary; Pos: held; Pos: salesmen; Pos: customers; Repairs; Inquiries; Reports: service customers; Measurements; Tailoring rates; Tailoring orders; Gift vouchers; Coupons; Discount cards; Lucky draws.

### PUR Purchasing (6 of 6)

Purchase orders; Goods receipts; Items (purchasing); Purchase bills (purchasing); Purchase returns; Reports: supplier claims.

### INV Inventory and Masters of Stock (28 of 30)

Reports: branch comparison; Allocations; Hsn; Inventory: setup; Warehouses; Items (inventory); Stock journals; Reports: stock summary; Reports: reorder; Lookups; Stock losses; Reports: stock losses; Margin bands; Accounts (merge); Items (merge); Inventory: rate update; Relabels; Items (serials); Serials; Stock counts; Reports: stock audit; Stock limits; Inventory: reset stock; Reports: stock posting check; Size scales; Colors; Styles (styles); Stock transfers.

### MFG Manufacturing and Job Work (5 of 5)

Work centres; Boms; Production orders; Mrp; Job work.

### HR People, Attendance and Payroll (17 of 20)

Employees; Holidays; Attendance (hr); Hr: week off changes; Leave types; Leave requests; Payroll; Payroll runs; Hr: attendance alerts; Stipends; Loan requests; Hr: documents; Loans; Shifts; Statutory; Tds: 24q; Attendance (iclock).

### EXP Expenses (3 of 3)

Files; Expenses; Reports: travel claims.

### PRJ Projects and Timesheets (2 of 2)

Projects; Timesheets.

### CRM CRM and Communications (12 of 21)

Comms: templates; Comms: settings; Comms: consents; Comms: opt out; Comms: send; Comms: report; Crm: leads; Crm: pipeline; Crm: activities; Crm: templates; Crm: messages; Crm: customers.

### AST Fixed Assets (1 of 1)

Assets.

### RPT Reports and Analytics (16 of 16)

Analytics; Reports: colour size; Reports: stock ageing; Reports: sales register; Reports: builder; Reports: saved; Assistant; Purchase bills (insights); Reports: profitability; Reports: register; Reports: year comparison; Reports: sales vs purchases; Reports: profit by; Reports: stock ratios; Reports: vendor analysis; Reports: purchase backlog.

### AI Assistant, Chat and Notes (2 of 2)

Chat; Notes.

### SEC Security, Settings and Administration (21 of 30)

Auth: signup; Auth: login; Auth: me; Me: menu; Auth: password; Backups; Settings: approvals; Change requests; Companies; Fiscal years (company); Number series; Audit log; Export; Controls; Accounts (controls); Settings: process locks; Config; Members; Invitations; Roles; Reports: user activity.

### SYN Offline Sync (3 of 6)

Sync: status; Sync: rejections; Devices.

## 4. Features partly built, backend only, or demo

### TAX GST, TDS and Statutory Compliance

| ID | Feature | Status | What is missing |
|---|---|---|---|
| TAX-003 | Print language | PARTIALLY IMPLEMENTED | Routes and a screen exist but no automated test calls the routes, so the full path is not verified. |
| TAX-006 | Gst: portal | DEMO / PLACEHOLDER | Backed by a simulator or demo adapter until a provider is connected (see integrations in 09_OFFLINE_AND_SYNC and 12_GAPS). |
| TAX-007 | Gst: filings | DEMO / PLACEHOLDER | Backed by a simulator or demo adapter until a provider is connected (see integrations in 09_OFFLINE_AND_SYNC and 12_GAPS). |
| TAX-008 | GST reports by kind (templated route) | BACKEND ONLY | Routes exist; no web screen calls them and no test was matched (may be used by the device app, a cron job or another route). |

### BNK Banking

| ID | Feature | Status | What is missing |
|---|---|---|---|
| BNK-002 | Banking: lines | PARTIALLY IMPLEMENTED | Routes and a screen exist but no automated test calls the routes, so the full path is not verified. |

### SAL Sales and Wholesale

| ID | Feature | Status | What is missing |
|---|---|---|---|
| SAL-006 | Salesmen | PARTIALLY IMPLEMENTED | Routes and a screen exist but no automated test calls the routes, so the full path is not verified. |
| SAL-016 | Lr entries | BACKEND ONLY | Routes are tested but no screen in the web app calls them (it may be used by the device app or be API only). |
| SAL-027 | E-invoice generate and cancel (invoices and credit notes, templated route) | DEMO / PLACEHOLDER | Backed by a simulator or demo adapter until a provider is connected (see integrations in 09_OFFLINE_AND_SYNC and 12_GAPS). |
| SAL-029 | Sales invoices (sharing) | BACKEND ONLY | Routes are tested but no screen in the web app calls them (it may be used by the device app or be API only). |
| SAL-031 | Messages | BACKEND ONLY | Routes are tested but no screen in the web app calls them (it may be used by the device app or be API only). |

### POS Counter, Retail and Service Desk

| ID | Feature | Status | What is missing |
|---|---|---|---|
| POS-021 | Pos: loyalty | BACKEND ONLY | Routes are tested but no screen in the web app calls them (it may be used by the device app or be API only). |
| POS-031 | Pos: promo | BACKEND ONLY | Routes are tested but no screen in the web app calls them (it may be used by the device app or be API only). |

### INV Inventory and Masters of Stock

| ID | Feature | Status | What is missing |
|---|---|---|---|
| INV-005 | Inventory: valuation method | PARTIALLY IMPLEMENTED | Routes and a screen exist but no automated test calls the routes, so the full path is not verified. |
| INV-010 | Reports: item ledger | PARTIALLY IMPLEMENTED | Routes and a screen exist but no automated test calls the routes, so the full path is not verified. |

### HR People, Attendance and Payroll

| ID | Feature | Status | What is missing |
|---|---|---|---|
| HR-009 | Payslips | PARTIALLY IMPLEMENTED | Routes and a screen exist but no automated test calls the routes, so the full path is not verified. |
| HR-015 | Loan receipts | BACKEND ONLY | Routes exist; no web screen calls them and no test was matched (may be used by the device app, a cron job or another route). |
| HR-019 | Iclock | BACKEND ONLY | Routes are tested but no screen in the web app calls them (it may be used by the device app or be API only). |

### CRM CRM and Communications

| ID | Feature | Status | What is missing |
|---|---|---|---|
| CRM-001 | Comms: meta | PARTIALLY IMPLEMENTED | Routes and a screen exist but no automated test calls the routes, so the full path is not verified. |
| CRM-004 | Comms: reminders | BACKEND ONLY | Routes are tested but no screen in the web app calls them (it may be used by the device app or be API only). |
| CRM-008 | Comms: queue | BACKEND ONLY | Routes are tested but no screen in the web app calls them (it may be used by the device app or be API only). |
| CRM-009 | Comms: broadcast | BACKEND ONLY | Routes are tested but no screen in the web app calls them (it may be used by the device app or be API only). |
| CRM-010 | Comms: process | DEMO / PLACEHOLDER | Backed by a simulator or demo adapter until a provider is connected (see integrations in 09_OFFLINE_AND_SYNC and 12_GAPS). |
| CRM-011 | Comms: receipts | BACKEND ONLY | Routes are tested but no screen in the web app calls them (it may be used by the device app or be API only). |
| CRM-012 | Comms: outbox | BACKEND ONLY | Routes are tested but no screen in the web app calls them (it may be used by the device app or be API only). |
| CRM-014 | Webhooks | BACKEND ONLY | Routes are tested but no screen in the web app calls them (it may be used by the device app or be API only). |
| CRM-019 | Crm: messaging | PARTIALLY IMPLEMENTED | Routes and a screen exist but no automated test calls the routes, so the full path is not verified. |

### SEC Security, Settings and Administration

| ID | Feature | Status | What is missing |
|---|---|---|---|
| SEC-003 | Auth: logout | BACKEND ONLY | Routes exist; no web screen calls them and no test was matched (may be used by the device app, a cron job or another route). |
| SEC-006 | Auth: switch | BACKEND ONLY | Routes are tested but no screen in the web app calls them (it may be used by the device app or be API only). |
| SEC-007 | Auth: unlock | BACKEND ONLY | Routes are tested but no screen in the web app calls them (it may be used by the device app or be API only). |
| SEC-008 | Auth: step up | BACKEND ONLY | Routes are tested but no screen in the web app calls them (it may be used by the device app or be API only). |
| SEC-014 | Branches | BACKEND ONLY | Routes exist; no web screen calls them and no test was matched (may be used by the device app, a cron job or another route). |
| SEC-021 | Cron | BACKEND ONLY | Routes exist; no web screen calls them and no test was matched (may be used by the device app, a cron job or another route). |
| SEC-027 | Tenants | BACKEND ONLY | Routes are tested but no screen in the web app calls them (it may be used by the device app or be API only). |
| SEC-028 | Meta | BACKEND ONLY | Routes exist; no web screen calls them and no test was matched (may be used by the device app, a cron job or another route). |
| SEC-029 | Tools | BACKEND ONLY | Routes are tested but no screen in the web app calls them (it may be used by the device app or be API only). |

### SYN Offline Sync

| ID | Feature | Status | What is missing |
|---|---|---|---|
| SYN-001 | Sync: offline rules | BACKEND ONLY | Routes are tested but no screen in the web app calls them (it may be used by the device app or be API only). |
| SYN-005 | Sync: pull | BACKEND ONLY | Routes are tested but no screen in the web app calls them (it may be used by the device app or be API only). |
| SYN-006 | Sync: push | BACKEND ONLY | Routes are tested but no screen in the web app calls them (it may be used by the device app or be API only). |

## 5. Menu tiles still without a destination

| Tile | Status | Note |
|---|---|---|
| Payroll > Salary Deduction | UI ONLY | Tile has no link; other deductions are typed on each payslip (plan R28 update). Built elsewhere: /payroll-runs (api) |
| Payroll > Week Off | UI ONLY | Tile has no link; week-off changes exist as /hr/week-off-changes routes. Built elsewhere: /hr/week-off-changes (api) |
| Payroll > Week Off Cancel | UI ONLY | Tile has no link; cancelling a week off is part of the week-off-changes routes [I]. Built elsewhere: /hr/week-off-changes (api) |
| Payroll > Stipend | UI ONLY | Tile has no link but the feature exists at /hr/stipends. Built elsewhere: /hr/stipends (screen) |
| Payroll > Incentive | UI ONLY | Tile has no link; incentive is typed on each payslip (plan R28 update). Built elsewhere: /payroll-runs (api) |
| Payroll > Other Deduction | UI ONLY | Tile has no link; typed on each payslip (plan R28 update). Built elsewhere: /payroll-runs (api) |
| Payroll > Menu Log Session Report | UI ONLY | Tile has no link; sign-ins by person are in /reports/user-activity (plan R28 update). Built elsewhere: /reports/user-activity (screen) |
| Utility > Out Standing Adj | UI ONLY | Tile has no link; the nearest built screens are bill-wise receipts and /reports/bills adjustments [I]. Built elsewhere: /reports/books (screen) |
| Utility > Sales Stock Ledger Diff | UI ONLY | Tile has no link; the stock posting check exists at /reports/stock-posting-check (plan R29 update). Built elsewhere: /reports/stock-posting-check (screen) |
| Utility > Note Report | UI ONLY | Tile has no link; personal notes exist at /notes but there is no note report [I]. Built elsewhere: /notes (api) |
| Utility > Current Date Setting | UI ONLY | Tile has no link; the working date is set from the top bar (plan R21 update). |
| Utility > Ledger And Stock Posting | NOT IMPLEMENTED | No re-posting of ledger and stock from documents; plan R29 'Left: re-posting the ledger from documents'. |
| Utility > Report Type | UNKNOWN | Tile has no link and the plan gives no detail beyond 'report types'. |
| Utility > Software Update | NOT IMPLEMENTED | Not applicable to a hosted service [I]; no screen. |
| Utility > DB Updates | NOT IMPLEMENTED | Not applicable to a hosted service [I]; no screen. |
| Utility > Schedule Backup | UI ONLY | Tile has no link; scheduled backups exist (/backups, /settings/backup). Built elsewhere: /settings/backup (screen) |
| Utility > Export Vouchers to PDF | UI ONLY | Tile has no link; voucher printing exists at /print/vouchers. Built elsewhere: /print/vouchers (screen) |

## 6. Plan items

### 6.1 Made (15)

| ID | Item | Evidence or what is left |
|---|---|---|
| A1 | GST rate by price: slab presets (apparel and footwear, effective-dated: before 22 Sep 2025 | Plan marks done. Corroborated by code search: gst_slab in apps/api/src/services/slabcheck.ts; slab_pieces in apps/api/src/services/slabcheck.ts. |
| A2 | Styles: style master (design no., brand, category, season, collection), colour library, si | Plan marks done. Corroborated by code search: size_scales in packages/db/src/schema.ts; style_images in packages/db/src/schema.ts; styles in apps/api/src/app.ts. |
| A3 | Sets and ratio packs: a pack item made of SKUs in a ratio, billed as one line, stock moved | Plan marks done. Corroborated by code search: item_pack_lines in packages/db/src/schema.ts. |
| A4 | Alternate units: buy in dozens or boxes, sell in pieces. Item units with factors (per item | Plan marks done. Corroborated by code search: item_units in packages/db/src/schema.ts. |
| A5 | Documents: proforma invoice (own PI series, advance requested, converts to order or invoic | Plan marks done. Corroborated by code search: proforma in apps/api/src/routes/sales.ts; Rule 55 in apps/api/src/services/sales.ts. |
| A6 | Wholesale credit: per customer "warn" or "block" when over the credit limit or with a bill | Plan marks done. Corroborated by code search: credit_limit in apps/api/src/services/sales.ts; creditLimit in apps/api/src/routes/accounting.ts. |
| A7 | Brokers and agents: any party ledger can be a broker or agent with a commission rate; cust | Plan marks done. Corroborated by code search: brokerage_bills in apps/api/src/services/commission.ts; agent in apps/api/src/routes/accounting.ts. |
| B1 | Schemes at the counter: percent off (with a minimum), amount off, quantity and value slabs | Plan marks done. Corroborated by code search: schemes in apps/api/src/routes/pos.ts. |
| B2 | Gift vouchers sold with their own codes (money held as a liability, no GST until spent on | Plan marks done. Corroborated by code search: gift_vouchers in apps/api/src/services/integrity.ts. |
| B3 | Returns and exchanges at the counter: lines back against a bill (up to what is left) with | Plan marks done. Corroborated by code search: pos_returns in apps/api/src/services/gstannual.ts. |
| B4 | Alterations and repairs: karigars (in-house, or outside with their own ledger), types with | Plan marks done. Corroborated by code search: karigars in apps/api/src/routes/alterations.ts; alterations in apps/api/src/app.ts. |
| B5 | Made-to-order tailoring: measurement cards per customer and garment (inches, with a photo) | Plan marks done. Corroborated by code search: tailoring_orders in packages/db/src/schema.ts; measurements in apps/api/src/routes/tailoring.ts. |
| B6 | Shop-in-shop and consignment: each consignee customer gets its own store ("At <name>"), so | Plan marks done. Corroborated by code search: consignment_moves in apps/api/src/services/consignment.ts; consignee_terms in apps/api/src/services/consignment.ts. |
| Books | from a past date and two years of demo history: a business can start its books on a past d | Plan marks done. Corroborated by code search: booksFrom in apps/api/src/routes/auth.ts; books_from in apps/api/src/services/onboarding.ts. |
| B7 | Image catalogue: photos per style and colour (front, back, detail, on model, other), shrun | Plan marks done. Corroborated by code search: style_images in packages/db/src/schema.ts. |

### 6.2 Partly built, with what is left (55)

| ID | Item | Evidence or what is left |
|---|---|---|
| B8 | Counter extras. Done (30 Oct 2026, demo-first): held bills shared by every counter, salesm | Plan marks in progress. Left: see plan text |
| S1 | Canonical IDs and states. Done 3 Nov 2026: the written lifecycles of nine kinds of documen | Plan marks in progress. Left: item and variant, production order and posting states are written but only the first five are driven in the test. |
| S2 | Integrity checks. Done 2 Nov 2026: Integrity page (/reports/integrity) with ten checks: vo | Plan marks in progress. Left: consignment stores against the ledger. Corroborated: /reports/integrity. |
| S3 | Tenant safety. Done 3 Nov 2026: a database test that every table with a tenant_id has row | Plan marks in progress. Left: branch and warehouse scope on permissions. |
| S4 | Backups the business owns. Done 2 Nov 2026: per-business export (/settings/backup, GET /ex | Plan marks in progress. Left: a true restore into a separate test business (needs every id remapped). Corroborated: /cron/backups, /export/restore-test, /settings/backup. |
| S5 | Tamper-evident audit. Done 2 Nov 2026: entries are sealed into a per-business hash chain ( | Plan marks in progress. Left: see plan text |
| S6 | Sensitive-change controls. Done 2 Nov 2026: a Sensitive changes page (/settings/sensitive- | Plan marks in progress. Left: tax slabs (they are law, held in the shared package). Corroborated: /config/changes, /cron/changes, /settings/approvals, /settings/dated-changes, /settings/sensitive-changes. |
| S7 | Offline declared per action. Done 3 Nov 2026: every action is declared allowed, read only | Plan marks in progress. Left: local data protection (an encrypted on-device database) and a conflict screen on the device itself that offers edit-and-resend. Corroborated: /settings/devices, /sync/offline-rules. |
| R1 | Counter and billing. Done (30 Oct 2026, demo-first): an exchange on one bill (F5): the old | Plan marks in progress. Left: approval memo, order, advance and token picked from the bill header; sale and return lines in one grid beyond the exchange. |
| R2 | Product identity and receiving. Done (30 Oct 2026, demo-first): the goods receipt is now t | Plan marks in progress. Left: optional serial or unique-piece IDs. Corroborated: /purchase/receiving. |
| R3 | Stock counts and losses. Done (30 Oct 2026, demo-first): counts of a store, a brand, a cat | Plan marks in progress. Left: counts by location (needs bins, phase W). Corroborated: /inventory/counts/audit:, /inventory/losses, /print/count-sheet. |
| R4 | Stock and sales reports. Done (30 Oct 2026, demo-first): colour-size matrix of stock or sa | Plan marks in progress. Left: a graph on stock ageing. Corroborated: /reports/registers. |
| R5 | Accounting report parity. Done: compare to last year on profit and loss. Compare to last y | Plan marks in progress. Left: vertical view, ledger views by previous year, pending transactions. Corroborated: /reports/cash-flow-statement. |
| R6 | Chain stores. Done 3 Nov 2026: stock transfer with an in-transit stage (/inventory/transfe | Plan marks in progress. Left: branch price lists. Corroborated: /inventory/distribution, /inventory/transfers, /print/transfer-slip. |
| R7 | Loyalty and membership. Done 3 Nov 2026 (English only): /pos/loyalty with members and sear | Plan marks in progress. Left: the other earning and redeeming rules (validity days, exclusions), which the offline app shares and needs the same change for. Corroborated: /pos/loyalty. |
| R8 | Salesman pack. Done 3 Nov 2026 (English only): commission rules by item, brand, category, | Plan marks in progress. Left: margin and stock-ageing bands, helper attribution and helper commission, helper attendance, chart. Corroborated: /sales/commission-rules, /sales/targets. |
| R9 | Service desk. Done 3 Nov 2026 (English only): repairs from intake to hand-back (/sales/rep | Plan marks in progress. Left: sales order repairing. Corroborated: /sales/repairs. |
| R10 | Shop-in-shop extras. Done 3 Nov 2026 (English only): settlement terms per consignee (days | Plan marks in progress. Left: reports by salesperson and branch (consignment bills carry neither), invoicing across our branches. Corroborated: /cron/statements, /reports/consignment-sales. |
| R11 | Utilities. Done 3 Nov 2026 (English only): user activity report with KPI tiles (/reports/u | Plan marks in progress. Left: none of the original list. Corroborated: /print/cheque, /print/envelope, /print/parcel-labels. |
| R12 | Payroll extras. Done 3 Nov 2026 (English only): performance reviews on the employee page ( | Plan marks in progress. Left: travel claims linked to expense claims. Corroborated: /expenses/travel, /hr/attendance-alerts, /hr/attendance-devices, /iclock/cdata. |
| R13 | Communication centre. Done (30 Oct 2026, demo-first): WhatsApp for counter bills (sent by | Plan marks in progress. Left: the other flows (bill, payroll, daily sales to owner) raising their events, and provider webhooks. Corroborated: /crm/communications. |
| R14 | Mobile parity (Flutter app). Done 3 Nov 2026: the app shows only the sections the signed-i | Plan marks in progress. Left: stock audit by scan, counter slip and token, the reports, customer profile, image capture, cash and bank entry. |
| R15 | Business intelligence home. Done (30 Oct 2026, demo-first): Business insights page with pe | Plan marks in progress. Left: drill from the other panels. |
| R16 | Wholesale billing extras. Cartons or bales on the invoice and its print, a packing slip (/ | Plan marks in progress. Left: the rest. Corroborated: /accounts/gst-jv, /print/packing-slip, /sales/delivery-orders. |
| R17 | Item attributes and small masters. Done 2 Nov 2026: the small masters (R26 lists) and ten | Plan marks in progress. Left: attributes on purchase lines and on labels. Corroborated: /inventory/margin-bands. |
| R18 | Label printing extras. Done 3 Nov 2026 (English only): copies per label, labels already us | Plan marks in progress. Left: none of the original list. Corroborated: /print/box-label. |
| R19 | Fine-grained permissions. Done 2 Nov 2026: special rights as permissions (special.changeDa | Plan marks in progress. Left: rights on dashboard widgets and mobile screens, a role limited to chosen account groups, audit columns on every listing. |
| R20 | Promotion rules. Done 3 Nov 2026: schemes run on chosen days of the week, within hours (ov | Plan marks in progress. Left: apply on items already discounted, apply when editing a bill, inclusive of tax, salesman commission basis per promotion. |
| R21 | Workspace. Done 2 Nov 2026: private notes and reminders with an optional date on the home | Plan marks in progress. Left: current working date. Corroborated: /chat, /notes. |
| R22 | Stock count and year-end utilities. Done 2 Nov 2026: import a handheld scanner text file i | Plan marks in progress. Left: re-post ledger and stock from documents. Corroborated: /print/vouchers, /reports/carry-forward, /reports/year-end. |
| R23 | Payroll extras from GRetail. Done 2 Nov 2026: employee documents and KYC with expiry (card | Plan marks in progress. Left: see plan text Corroborated: /hr/documents. |
| R24 | Report extras. Done 2 Nov 2026: fast, slow and non-moving stock analysis with a changeable | Plan marks in progress. Left: PDF and WhatsApp delivery, a filter panel on every attribute. Corroborated: /reports/discounts, /reports/sales-order-register, /reports/stock-movement. |
| R25 | Dashboards. Done 2 Nov 2026: Owner's view (/reports/cfo): revenue, cost of goods, gross pr | Plan marks in progress. Left: interest and tax lines (no such accounts in the standard chart). Corroborated: /reports/cfo, /reports/daily-sales. |
| R26 | Menu masters (Soon tiles under Masters, 29 Oct 2026). Done 30 Oct 2026: 26 simple lists on | Plan marks in progress. Left: ledger parameters, TDS and TCS masters as editable lists (the rates live in the shared domain package). Corroborated: /inventory/stock-limits, /masters/hsn. |
| R27 | Menu transactions (Soon tiles under Transaction). Done 2 Nov 2026: bill-wise receipt and p | Plan marks in progress. Left: delivery order, GST journal voucher, sample issue and receive, LR and transport entry, repacking a box and reopening a box. Corroborated: /accounts/bill-receipt, /sales/lr, /sales/samples. |
| R28 | Menu account and payroll reports (Soon tiles; extends R23 and R24). Done 2 Nov 2026: cash | Plan marks in progress. Left: TCS report as a salary-style register is not needed (TCS has its own report). Corroborated: /accounts/tds, /reports/books, /reports/msme. |
| R29 | Menu utilities. Done 3 Nov 2026: rate updation (/inventory/rate-update): by brand, categor | Plan marks in progress. Left: the rest. Corroborated: /inventory/barcode-search, /inventory/rate-update. |
| W4 | Counting: cycle counts by value, velocity, risk or ABC class, blind counts. | Blind counts exist (apps/api/src/services/stockcount.ts:102); cycle counts by value, velocity, risk or ABC class were not found. |
| C6 | Quality: incoming, in-process and final inspection; defect codes, severity, operation, sup | Goods on hold wait for inspection and are passed or rejected (services/purchasing.ts:514); defect codes, in-process and final inspection were not found. |
| C8 | Dispatch: transporter, LR number and date, bale or carton packing list, delivery memo, ded | Transport/LR entry (lr_entries, /sales/lr), cartons on the invoice and a packing slip print exist (plan R16, R27); bale/carton packing list and deductions ledger as specified were not found. |
| D1 | Left: moving bank, gateway, marketplace, GST portal, payroll-to-bank, POS tenders, job-wor | Plan marks in progress. Left: moving bank, gateway, marketplace, GST portal, payroll-to-bank, POS tenders, job-worker and consignment matching onto this engine (each has its own screen today), evidence upload on the screen. Corroborated: /accounts/reconciliation. |
| D2 | Close management. Done 3 Nov 2026 (/accounts/close, English only): a month-end checklist o | Plan marks in progress. Left: month-end by entity and owner, and snapshots of other reports. Corroborated: /accounts/close. |
| D3 | Left: the new section 393 numbering with a map from the legacy codes (needs the official t | Plan marks in progress. Left: the new section 393 numbering (needs the official table). Corroborated: /accounts/tds. |
| D4 | Left: GSTR-2A comparison, Rule 37A, GSTR-9C and GSTR-4 summaries, slab exception report, a | Plan marks in progress. Left: GSTR-2A comparison, Rule 37A, GSTR-9C and GSTR-4 summaries, slab exception report, and an approval workflow around each return. Corroborated: /gst/workspace. |
| D5 | Left: loans and capex in the forecast, per-bank formats of the statement. Original wording | Plan marks in progress. Left: loans and capex in the forecast, per-bank formats of the statement. Corroborated: /accounts/working-capital. |
| D6 | Left: per-branch expense allocation to centres. Original wording: Stock finance: stock age | Plan marks in progress. Left: per-branch expense allocation to centres. Corroborated: /inventory/stock-finance. |
| D7 | Left: freight, channel fees and wastage per sale, production and job-work cost (needs Phas | Plan marks in progress. Left: freight, channel fees and wastage per sale, production and job-work cost (needs Phase C), loyalty-funded offers separately. Corroborated: /reports/profitability. |
| D8 | Left: month-by-month view, a factory-specific change with machine capacity. Original wordi | Plan marks in progress. Left: month-by-month view, a factory-specific change with machine capacity. Corroborated: /accounts/scenarios. |
| D9 | Left: posting the incentive to the books when a scrip is credited, drawback, advance autho | Plan marks in progress. Left: posting the incentive to the books when a scrip is credited, drawback, advance authorisation tracking, foreign currency invoices. Corroborated: /gst/exports. |
| D10 | Left: approval thresholds by document type and amount that hold a document until approved, | Plan marks in progress. Left: approval thresholds by document type and amount that hold a document until approved, and masking and export rights per field. Corroborated: /settings/controls. |
| N1 | Integration framework: versioned API with scoped API keys and rate limits; signed webhooks | Rate limiting is on (@fastify/rate-limit, app.ts) and provider webhooks are verified inbound; scoped API keys, versioned public API and outbound signed webhooks were not found. |
| I5 | Anomaly flags: stock adjustments, repeated returns, consumption and wastage, discount over | An anomalies list exists (services/analytics.ts:222, shown on insights); the specific flags (stock adjustments, repeated returns, consumption, discount overrides) are only partly covered [I]. |
| U1 | Transaction launcher, "My Menu" favourites grid per user, and home rail (UI direction abov | Plan marks in progress. Left: see plan text |
| U2 | Document screens rebuilt to the single-screen pattern (sales bill, inward challan, purchas | Plan marks in progress. Left: see plan text |
| U3 | Report shell: filter row, totals footer, export and email, compare to last year, chart swi | Plan marks in progress. Left: see plan text |

### 6.3 Not started (40)

| ID | Item | Evidence or what is left |
|---|---|---|
| O1 | Availability service: physical on hand, available to sell, available to promise by date, r | Searched 5 terms (available to promise, availableToPromise, available_to_promise, reservation, reservedQty) across API, web, db schema, domain and device sources: no matches. |
| O2 | Order lifecycle: one timeline per order (quotation or cart to payment, allocation, dispatc | Searched 2 terms (orderTimeline, order timeline) across API, web, db schema, domain and device sources: no matches. |
| O3 | Fulfilment sourcing: ship from warehouse or store, click and collect, reserve in store, sh | Searched 5 terms (click and collect, clickAndCollect, click_and_collect, ship from store, sourcing rule) across API, web, db schema, domain and device sources: no matches. |
| O4 | Returns engine: return against the original line across stores and channels; eligibility b | Searched 4 terms (returnEligibility, return window, returns engine, return_window) across API, web, db schema, domain and device sources: no matches. |
| W1 | Locations: zones, racks, shelves and bins with capacity; stock at company, site, warehouse | No bin/rack/zone model; matches for 'shelf' are code comments. |
| W2 | Inbound: receiving against PO with discrepancy capture and quality inspection; put-away ru | Searched 4 terms (putaway, put-away, put_away, quality inspection) across API, web, db schema, domain and device sources: no matches. |
| W3 | Outbound: directed picking (single, batch, cluster, wave), pick verification by barcode or | Searched 4 terms (pick list, picklist, wave pick, directed picking) across API, web, db schema, domain and device sources: no matches. |
| W5 | Carriers: courier adapters behind one shipment interface (demo until keys are set), rate s | Searched 4 terms (rate shopping, carrier adapter, courier adapter, shipment interface) across API, web, db schema, domain and device sources: no matches. |
| C1 | Fabric and trims: roll ID, dye lot, shade group, width, GSM, grade, supplier, receiving in | Searched 7 terms (dye lot, dyeLot, dye_lot, shade group, roll id, rollId) across API, web, db schema, domain and device sources: no matches. |
| C2 | Job work depth: process routes, challan from one job worker to the next, partial receipts | Searched 3 terms (process route, process_route, processRoute) across API, web, db schema, domain and device sources: no matches. |
| C3 | Product engineering: versioned tech packs, BOMs, size specifications, grading and construc | Searched 4 terms (tech pack, techpack, tech_pack, grading rule) across API, web, db schema, domain and device sources: no matches. |
| C4 | Cut to pack: size-wise BOM lines, cut order (ratio and plies), lay record, QR bundle ticke | Searched 6 terms (cut order, cutOrder, cut_order, lay record, bundle ticket, bundleTicket) across API, web, db schema, domain and device sources: no matches. |
| C5 | Planning: production orders pegged to demand, season and delivery date; material and capac | Searched 4 terms (capacity plan, capacityCheck, demand peg, pegging) across API, web, db schema, domain and device sources: no matches. |
| C7 | Actual costing: cost per production order and per style and size (material at the valuatio | Searched 4 terms (actual cost, actualCost, actual_cost, cost per production) across API, web, db schema, domain and device sources: no matches. |
| M1 | Collection lifecycle: season calendar with drop, launch, core, carryover, markdown and dis | Searched 4 terms (season calendar, seasonCalendar, collection lifecycle, drop date) across API, web, db schema, domain and device sources: no matches. |
| M2 | Assortment and size curves: size-curve profiles by category, region, channel and store clu | 'sizeCurve' is a heading label on the receipt form, not a size-curve profile model. |
| M3 | Open-to-buy: budget by season, category, brand, store cluster and month; opening stock, pl | Searched 4 terms (open-to-buy, open to buy, openToBuy, open_to_buy) across API, web, db schema, domain and device sources: no matches. |
| M4 | Promotion and price policy engine: rules by company, channel, store, segment, brand, categ | Searched 3 terms (policy engine, price policy, pricePolicy) across API, web, db schema, domain and device sources: no matches. |
| M5 | Replenishment and allocation: transfer against purchase against markdown compared on the s | Searched 1 terms (replenishment) across API, web, db schema, domain and device sources: no matches. |
| M6 | End of season: markdown runs, pre-book allocation, EOSS planning. | Searched 5 terms (markdown run, markdownRun, EOSS, end of season, end-of-season) across API, web, db schema, domain and device sources: no matches. |
| N2 | Operations: background-job dashboard and queue lag alerts, structured logs with correlatio | No job dashboard, queue-lag alerts or correlation ids found (Fastify's logger is on but is not the item). |
| N3 | Marketplaces: settlement import (Myntra, Ajio, Amazon, Flipkart mappings), per-order match | Searched 5 terms (Myntra, Ajio, Flipkart, Amazon, marketplace) across API, web, db schema, domain and device sources: no matches. |
| N4 | Web stores: Shopify and WooCommerce connectors through one channel layer (catalogue, price | Searched 2 terms (Shopify, WooCommerce) across API, web, db schema, domain and device sources: no matches. |
| N5 | Customer 360 and clienteling: one customer identity with duplicate detection and merge; pu | Customer 360 appears only in a route comment; no customer identity merge or clienteling view found (a merge of duplicate masters exists under /masters/merge). |
| N6 | Wholesale buyer portal: party catalogue and prices, colour-size matrix ordering, ratio pac | Searched 2 terms (buyer portal, buyerPortal) across API, web, db schema, domain and device sources: no matches. |
| N7 | Supplier and job-worker workspace: RFQs and quote comparison, POs and delivery schedules, | Searched 3 terms (RFQ, ASN, supplier portal) across API, web, db schema, domain and device sources: no matches. |
| N8 | Franchise and multi-brand: central or local authority for prices, purchases, expenses and | Searched 1 terms (franchise) across API, web, db schema, domain and device sources: no matches. |
| N9 | SaaS layer: plans and subscription billing (Razorpay, demo until keys are set), usage limi | A tenant is documented as 'one subscription' (schema.ts:9) but there are no plans, billing or usage limits. |
| N10 | Workflow builder and control tower: a prioritised work queue replacing passive tiles (orde | Searched 3 terms (control tower, workflow builder, work queue) across API, web, db schema, domain and device sources: no matches. |
| I1 | Demand forecast by style, colour, size, store and channel: seasonal baselines and intermit | Only a cash forecast exists (services/workingcap.ts, plan D5); demand forecasting by style, colour, size and store was not found. |
| I2 | Size-curve and replenishment recommendations from stockout-adjusted demand. | Searched 2 terms (replenishment recommend, size-curve recommend) across API, web, db schema, domain and device sources: no matches. |
| I3 | Markdown scenarios with expected sell-through, revenue and margin ranges. | Searched 2 terms (markdown scenario, markdownScenario) across API, web, db schema, domain and device sources: no matches. |
| I4 | Production scheduling optimisation where data supports it; bottleneck and lateness risk. | Searched 2 terms (scheduling optim, bottleneck) across API, web, db schema, domain and device sources: no matches. |
| I6 | Supplier reliability and material yield risk scores. | Searched 3 terms (reliability score, yield risk, supplier score) across API, web, db schema, domain and device sources: no matches. |
| I7 | Governance: beat a simple baseline before rollout, evaluation by category, store and size, | Searched 2 terms (model version, baseline model) across API, web, db schema, domain and device sources: no matches. |
| T1 | Material provenance: fibre composition and recycled content, certificates with scope, issu | Searched 4 terms (provenance, fibre composition, fiber composition, recycled content) across API, web, db schema, domain and device sources: no matches. |
| T2 | Genealogy report: finished SKU to batch, bundle, roll, dye lot, supplier and quality recor | Searched 1 terms (genealogy) across API, web, db schema, domain and device sources: no matches. |
| T3 | Circularity records: cutting utilisation, waste by reason and destination, repair, resale, | Searched 2 terms (circularity, waste by reason) across API, web, db schema, domain and device sources: no matches. |
| T4 | Product QR page with approved, versioned information and export evidence packs per market | Searched 3 terms (product QR, productQr, digital product passport) across API, web, db schema, domain and device sources: no matches. |
| U4 | Scorecard on the product itself: median checkout time, scan-to-stock accuracy, sync failur | Searched 3 terms (median checkout, checkout time, scan-to-stock) across API, web, db schema, domain and device sources: no matches. |

## 7. Built since the baseline (6 November 2026)

### Partly built, not yet accepted
- The web mega-menu assigns repeated screen routes to one home tab, prioritizing the owning module. `/pos/billing` is listed under Sales only. A synthetic owner browser session confirmed one menu entry plus a launchpad shortcut; a sample sale, other roles and staff review remain open.
- GST filing method is stored per company and defaults to `manual`. Manual mode hides the portal connection and filing actions. The optional provider mode is visibly labeled as a simulator and demo-only. API tests and both browser modes pass; accountant review of the exports and owner acceptance remain open.

These changes do not alter the original pack feature counts. Phase 0 is not accepted yet.

### Made and tested
- GST workpaper table `gst_workpapers` with migration 0127 and row level security.
- GSTR-3B: table 3.2 (inter-state supplies to unregistered buyers by place of supply, net of credit notes); table 4 with imports, ISD, reversals under rules 37 and 37A, credit claimed again, ineligible credit, net credit and a cash shortfall flag; table 5; table 5.1.
- Typed figures an accountant enters (imports, ISD, reversals under rules, ineligible credit, interest, late fee, non-GST outward, exempt and non-GST inward), validated and stored per period.
- ITC per purchase bills compared with the imported GSTR-2B (per 2B, per books, in books not in 2B, in 2B not in books, queried, accepted, no ITC).
- Manual filing record for GSTR-1 and GSTR-3B: prepared, reviewed, filed; review hash; ARN and filing date checks; proof files; reopen with a reason; refused when the books change after review.
- API: `GET /gst/workpaper`, `PUT /gst/workpaper`, `POST /gst/workpaper/status`; `/gst/gstr3b` reads the typed figures.
- Eleven tests in `gstmanual.test.ts`, including the manual filing method default and validation.

### Built, not proven against the real tool
- GSTR-1 Excel with sheets b2b, b2cl, b2cs, cdnr, cdnur, exp, hsn(b2b), hsn(b2c), docs for the GST offline tool. It is input to that tool, not an upload file. Not yet loaded in the current tool.
- New JSON keys for 3.2, 5 and 5.1 in the 3B download. Not checked against the current portal.
- GSTR-2B Excel reader (B2B and B2B-CDNR sheets, rate rows added up, debit notes skipped and counted) with a preview and a month choice. Run only on a workbook made by hand.
- Placement of reclaimed credit in 4(A)(5) and the 4(D) labels: to be confirmed by the accountant.

### Found by the 6 November audit
- 18 screens appear under two of the seven main menu tabs.
- The integrity page shows two raw translation keys (strings nested under `integrity.checks.*` but looked up under `integrity.*`).
- The pack is partly stale: `/sales/lr` has a screen; a pasted-lines customer and supplier statement reconciliation exists.

## 8. Still to build from the distributor brief (not in the plan above)

Status for each is **not started** unless marked.

**Navigation and truthfulness**
- One billing destination: partly built; route ownership is in place, but staff acceptance and a complete sale path are open.
- Fewer module headers and role work queues: not started.
- Company setting "filing method: manual" hiding the simulator GSP card: partly built; manual is the default and the simulator is explicit demo-only.

**Retailer cycle part 1: need to reservation**
- Availability by style, colour, size and date (on hand, held, reserved, incoming by date). Same as plan item O1.
- Reservations with rules for confirm, change, cancel, partial pick, short pick, dispatch, credit hold.
- Backorders with dates, shortage list, substitute suggestion.
- Credit exposure and override reason inside the order.
- Order timeline (plan item O2).
- Colour-size order grid on the order form (to be checked).
- Promise log for WhatsApp and phone promises.

**Retailer cycle part 2: pick to delivery**
- Bins and locations (W1); pick list from reservations (W3); scan verify; wrong, missing and extra item flags.
- Carton contents tied to picked scans; packing list; dispatch status.
- Freight billed against freight recorded per LR.
- Proof of delivery; short and damaged goods with evidence, owner and claim deadline.

**Retailer cycle part 3: invoice to margin**
- Ordered, dispatched, invoiced quantities with unbilled dispatch and billed-not-dispatched lists.
- Return inspection with restock, hold or write-off.
- Claims raised against recovered with time-bar dates.
- Margin bridge labelled actual, allocated or estimated, with the share of sales that has no lot cost or freight.
- Invoice timing decision (at dispatch or after delivery).

**Supplier cycle**
- Supplier terms and lead-time profile; purchase recommendation with reasons and cash needed; quote comparison with estimated landed cost.
- PO approval limits; PO confirmation, partial shipment, expected against actual arrival, late alerts.
- Scan receiving against the PO with shortage, excess, substitution, damage and hold.
- Ordered, received and billed match with rate and tax differences; freight and direct costs into lot cost; debit note per shortage.
- Payments against expected cash; disputed bills; supplier statement file import.
- Supplier scorecard (on time, in full, lead-time spread, damage, claims, landed cost against quote).

**Stock and cost foundation**
- **Implemented in code (7 November):** research-based periodic stock valuation defaults, valuation-method lock after stock activity, documented receipt landed charges, stock cost-coverage reporting, stock-register-to-Stock-in-Hand tie-out, and a reviewed, audited closing-stock journal. Shared receipt charges support direct, weight, volume, net-value, or unit allocation; recoverable GST is excluded from capitalized cost and each allocation is retained with its source and audit entry.
- **Remaining product work:** lot-level costing for margin reports, full reservation and date/location availability rules, and a complete free/reserved/held/in-transit/on-hand/incoming identity check. Open sales-order quantities are currently a company-wide visibility figure only; they do not reserve stock or allocate by warehouse/date. These retailer-cycle rules remain in later phases.
- **Live-books safeguard:** the documented method is a product default, not an entity-specific accounting opinion. A qualified accountant should review the entity's applicable framework, opening balances, and close policy before live financial statements rely on the figures.

**Accounting**
- One reconciliation workbench across bank, GST, gateway, supplier, customer, stock and POS settlements (plan item D1).
- BRS verified with real statements; exception queue with owner, due date, age; proposed vouchers for bank charges and interest; BRS PDF and Excel; analytics on old items.
- Import and conversion studio with saved bank mappings and a staging area; document inbox for purchase invoices, bank statements, summary BRS, supplier statements, GSTR-2B and Tally files.
- Close cockpit with item owners and reviewer sign-off; CA workpaper export.
- Journal templates, recurring entries, accruals and prepayments; loans and capex in the cash forecast.
- Anomaly checks and scenario analysis.
- Fix the integrity page text.

**GST**
- Side by side ERP, portal pre-filled and accountant's final figure on 3B.
- ITC driven by GSTR-2B row decisions.
- Table 3.1.1; composition and UIN split in 3.2; table 6.1 liability breakup and ledger balances; interest recompute.
- GSTR-1 debit notes, amendments and GSTR-1A; GSTR-2B sections beyond B2B and credit notes, IMS.
- Acceptance of the GSTR-1 workbook by the current offline tool; a real GSTR-2B Excel and JSON; accountant sign-off of the 3B figures against the portal for one period.

**WhatsApp and AI**
- Provider-neutral services: promise lookup by variant and date, price and credit checks, draft order from structured lines; event outbox mapped to templates; consent registry per message category.
- Order intake from text, voice and handwritten lists; availability replies with ETA and substitutes; reorder nudges worded "likely due".
- Dispatch and proof-of-delivery messages with discrepancy capture from photos; due-date reminders; read-only balance questions; promise-to-pay capture; collection priority.
- Supplier PO, confirmation and shortage messages; reading supplier challans and bills.
- Owner digest and approvals by reply; plain-language margin explanations.
- Mulltiply connection, once their integration documents answer whether a custom ERP can be connected.

## 9. Open housekeeping

- Ledger redesign (deferred); choice of one of five navigation bar designs (deferred); phone layouts for the other editors and the POS.
- Translations for the new English-only strings (see `packages/i18n/messages/NEEDS-TRANSLATION.txt`).
- G-Retail connector and importers, blocked until the owner brings the demo database backup; `docs/migration/` is still untracked.
- Three tests failed in the full run and pass alone (scheduled changes; insights and CRM email).

## 10. Phase 0 and Phase F status update (6 November 2026)

- All six approved Phase 0 menu destinations are implemented in English. Focused checks and the full suite pass. Fixed Barcode is the only destination browser-checked (1/6); the other five browser checks remain pending because the local CSS worker crashes.
- Phase 0 is not complete: staff sample sale/purchase acceptance and accountant review of GST exports against real files and the current GSTN offline tool are still required. Phase A inventory work proceeds on the documented research-based defaults; entity-specific review remains a release check when an accountant is available.
- The separate F pipeline has 76 entries (IDs 71–146): 39 F1 never started and 37 F2 started with work remaining. It is future backlog, outside this Phase 0 slice; unnumbered references still need mapping to `docs/apparel-plan.md`. English only.
- Phase 1 valuation policy has a documented research-based product default; implementation does not wait for CA availability. An accountant should review company-specific framework and opening balances before live financial close.

## 11. Phase 1 stock and cost foundation status (7 November 2026)

- **Code implementation and verification are complete for this foundation slice.** The Indian inventory valuation and audit-control research is documented in `docs/india-inventory-valuation-practice.md`. The app retains its periodic purchase-ledger model, defaults interchangeable goods to moving weighted average, keeps FIFO as a company choice, and excludes recoverable GST from capitalized cost.
- Receipt costing accepts documented shared inward charges with a source document, gross amount, recoverable GST, allocation basis (direct, weight, volume, net value, or units), and per-line allocations. The API verifies the net total against allocations, includes accepted allocations in stock valuation, and records the source and allocation in the audit trail. The supplier freight bill remains a separate accounting document.
- The foundation also includes a valuation-method lock after stock activity, stock cost-coverage report, periodic stock-register-to-Stock-in-Hand tie-out, and approval-gated audited closing-stock journal with opening-balance checks. Existing count variance, quality-hold, and transfer-in-transit records remain in place. Today's stock summary shows company-wide open-order commitment quantity for visibility; it does not reserve or allocate by warehouse or promised date, and historical reports do not mix in current commitments.
- **Phase boundary:** warehouse/date reservation allocation and conflict rules remain in the later retailer-order phase. Lot-cost margin bridge, the full stock identity check, and entity-specific policy/opening-balance review are also remaining work or release safeguards; this status does not claim the entire retailer roadmap or live accounting sign-off is complete. Phase 0 remains a separate open acceptance gate.
- Verification on 7 November: migration `0134_receipt_landed_charge_allocations.sql` applied locally; full API suite passed (125 files, 702 tests) with four Vitest workers; the other root test tasks passed (including 305 domain tests and the i18n catalog check, 6,686 keys across 12 locales); the web menu test passed (6 tests); all five workspace typechecks and the production build passed. The six approved menu destinations rendered at 375px and 1536px with document widths matching the viewport. The browser's screen lock prevented save-flow and role-specific UI interaction checks; API permission tests remain the evidence for those controls. No staff acceptance or CA review of a live entity has been performed.
