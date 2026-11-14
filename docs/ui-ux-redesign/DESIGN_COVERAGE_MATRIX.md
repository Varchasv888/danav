# Design coverage matrix

Every feature and every screen from the discovery baseline appears here; none is dropped. Columns: design specification (written), design status, **implementation status** (the feature's working state from the discovery, `docs/product-discovery/10_IMPLEMENTATION_STATUS.md`), redesign status (whether this screen has been rebuilt to the new design), visual QA, functional QA, dependencies.

Summary: 268 features specified; 229 screens listed; 15 BI sections specified. Redesign built so far: global shell, tokens, shared DataTable with states and Excel export (six sales registers), chart kit, BI home with trend and ranking, KPI dictionary, GST returns Excel workings, show-password, unsaved-work signal on the voucher form. All other screens inherit the new shell and tokens only. Visual QA means looked at in a browser; functional QA means exercised after the change; both are mostly **not done** and are marked so.

## A. Features

| Feature | Routes | Name | Specification | Design status | Implementation status (discovery) | Redesign | Visual QA | Functional QA | Dependencies |
|---|---|---|---|---|---|---|---|---|---|
| FIN-001 | /reports/cash-book | Reports: cash book | [spec](modules/finance/FIN-001.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-002 | /reports/group-month | Reports: group month | [spec](modules/finance/FIN-002.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-003 | /reports/cash-bank-expense | Reports: cash bank expense | [spec](modules/finance/FIN-003.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-004 | /reports/cash-flow | Reports: cash flow | [spec](modules/finance/FIN-004.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-005 | /reports/rcm-register | Reports: rcm register | [spec](modules/finance/FIN-005.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-006 | /reports/bill-adjustments | Reports: bill adjustments | [spec](modules/finance/FIN-006.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-007 | /reports/integrity | Reports: integrity | [spec](modules/finance/FIN-007.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-008 | /reports/cfo | Reports: cfo | [spec](modules/finance/FIN-008.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-009 | /reports/stock-movement | Reports: stock movement | [spec](modules/finance/FIN-009.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-010 | /accounts/groups | Accounts: groups | [spec](modules/finance/FIN-010.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-011 | /accounts, /accounts/:id ... | Accounts (accounting) | [spec](modules/finance/FIN-011.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-012 | /vouchers, /vouchers/:id ... | Vouchers | [spec](modules/finance/FIN-012.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-013 | /fiscal-years/:id | Fiscal years (accounting) | [spec](modules/finance/FIN-013.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-014 | /reports/trial-balance | Reports: trial balance | [spec](modules/finance/FIN-014.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-015 | /reports/profit-loss | Reports: profit loss | [spec](modules/finance/FIN-015.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-016 | /reports/balance-sheet | Reports: balance sheet | [spec](modules/finance/FIN-016.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-017 | /reports/ledger/:accountId | Reports: ledger | [spec](modules/finance/FIN-017.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-001 | /karigars, /karigars/:id ... | Karigars | [spec](modules/pos/POS-001.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-002 | /alteration-types, /alteration-types/:id ... | Alteration types | [spec](modules/pos/POS-002.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-003 | /alterations, /alterations/:id/cancel ... | Alterations | [spec](modules/pos/POS-003.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-004 | /approval-memos, /approval-memos/:id ... | Approval memos | [spec](modules/pos/POS-004.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| AST-001 | /assets, /assets/:id ... | Assets | [spec](modules/assets/AST-001.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SEC-001 | /auth/signup | Auth: signup | [spec](modules/administration/SEC-001.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SEC-002 | /auth/login | Auth: login | [spec](modules/administration/SEC-002.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SEC-003 | /auth/logout | Auth: logout | [spec](modules/administration/SEC-003.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen; no automated test |
| SEC-004 | /auth/me | Auth: me | [spec](modules/administration/SEC-004.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SEC-005 | /me/menu | Me: menu | [spec](modules/administration/SEC-005.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SEC-006 | /auth/switch | Auth: switch | [spec](modules/administration/SEC-006.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen |
| SEC-007 | /auth/unlock | Auth: unlock | [spec](modules/administration/SEC-007.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen |
| SEC-008 | /auth/step-up | Auth: step up | [spec](modules/administration/SEC-008.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen |
| SEC-009 | /auth/password, /auth/password/forgot ... | Auth: password | [spec](modules/administration/SEC-009.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SEC-010 | /backups, /backups/run ... | Backups | [spec](modules/administration/SEC-010.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| BNK-001 | /banking/accounts, /banking/accounts/:id/apply-rules ... | Banking: accounts | [spec](modules/banking/BNK-001.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| BNK-002 | /banking/lines/:id/create, /banking/lines/:id/ignore ... | Banking: lines | [spec](modules/banking/BNK-002.md) | specified | PARTIALLY IMPLEMENTED | not started | not done | not done | no automated test |
| BNK-003 | /banking/rules, /banking/rules/:id ... | Banking: rules | [spec](modules/banking/BNK-003.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| BNK-004 | /banking/settlements | Banking: settlements | [spec](modules/banking/BNK-004.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-018 | /bill-receipts, /bill-receipts/open | Bill receipts | [spec](modules/finance/FIN-018.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-005 | /branch-prices, /branch-prices/:id ... | Branch prices | [spec](modules/pos/POS-005.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-006 | /pos/branch-prices | Pos: branch prices | [spec](modules/pos/POS-006.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-019 | /reports/cash-flow-statement | Reports: cash flow statement | [spec](modules/finance/FIN-019.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-001 | /styles/:id/images | Styles (catalogue) | [spec](modules/sales/SAL-001.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-002 | /style-images/:id | Style images | [spec](modules/sales/SAL-002.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-003 | /catalogue, /catalogue/selections ... | Catalogue | [spec](modules/sales/SAL-003.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-004 | /public/catalogue/:token, /public/catalogue/:token/files/:fileId | Public (catalogue) | [spec](modules/sales/SAL-004.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SEC-011 | /settings/approvals | Settings: approvals | [spec](modules/administration/SEC-011.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SEC-012 | /change-requests, /change-requests/:id/decide | Change requests | [spec](modules/administration/SEC-012.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| AI-001 | /chat/:userId, /chat/people ... | Chat | [spec](modules/assistant/AI-001.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-020 | /close/checklist, /close/month ... | Close | [spec](modules/finance/FIN-020.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-021 | /pos/day-close | Pos: day close | [spec](modules/finance/FIN-021.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-022 | /pos/sessions/:id/sign-variance | Pos: sessions (close) | [spec](modules/finance/FIN-022.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-005 | /agents | Agents | [spec](modules/sales/SAL-005.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-006 | /salesmen | Salesmen | [spec](modules/sales/SAL-006.md) | specified | PARTIALLY IMPLEMENTED | not started | not done | not done | no automated test |
| SAL-007 | /reports/agent-commission | Reports: agent commission | [spec](modules/sales/SAL-007.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-008 | /brokerage-bills, /brokerage-bills/:id ... | Brokerage bills | [spec](modules/sales/SAL-008.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-009 | /reports/salesman | Reports: salesman | [spec](modules/sales/SAL-009.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-010 | /reports/salesman-year | Reports: salesman year | [spec](modules/sales/SAL-010.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-011 | /sales-targets/:month | Sales targets | [spec](modules/sales/SAL-011.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| CRM-001 | /comms/meta | Comms: meta | [spec](modules/crm/CRM-001.md) | specified | PARTIALLY IMPLEMENTED | not started | not done | not done | no automated test |
| CRM-002 | /comms/templates | Comms: templates | [spec](modules/crm/CRM-002.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| CRM-003 | /comms/settings | Comms: settings | [spec](modules/crm/CRM-003.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| CRM-004 | /comms/reminders | Comms: reminders | [spec](modules/crm/CRM-004.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen |
| CRM-005 | /comms/consents | Comms: consents | [spec](modules/crm/CRM-005.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| CRM-006 | /comms/opt-out | Comms: opt out | [spec](modules/crm/CRM-006.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| CRM-007 | /comms/send | Comms: send | [spec](modules/crm/CRM-007.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| CRM-008 | /comms/queue | Comms: queue | [spec](modules/crm/CRM-008.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen |
| CRM-009 | /comms/broadcast | Comms: broadcast | [spec](modules/crm/CRM-009.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen |
| CRM-010 | /comms/process | Comms: process | [spec](modules/crm/CRM-010.md) | specified | DEMO / PLACEHOLDER | not started | not done | not done | simulator behind it |
| CRM-011 | /comms/receipts | Comms: receipts | [spec](modules/crm/CRM-011.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen |
| CRM-012 | /comms/outbox | Comms: outbox | [spec](modules/crm/CRM-012.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen |
| CRM-013 | /comms/report | Comms: report | [spec](modules/crm/CRM-013.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| CRM-014 | /webhooks/sms, /webhooks/whatsapp ... | Webhooks | [spec](modules/crm/CRM-014.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen |
| SEC-013 | /companies, /companies/:id ... | Companies | [spec](modules/administration/SEC-013.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SEC-014 | /branches/:id | Branches | [spec](modules/administration/SEC-014.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen; no automated test |
| SEC-015 | /fiscal-years | Fiscal years (company) | [spec](modules/administration/SEC-015.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SEC-016 | /number-series, /number-series/:id | Number series | [spec](modules/administration/SEC-016.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SEC-017 | /audit-log, /audit-log/anchor ... | Audit log | [spec](modules/administration/SEC-017.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SEC-018 | /export/business.vbk, /export/business.zip ... | Export | [spec](modules/administration/SEC-018.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-012 | /consignees, /consignees/:customerId ... | Consignees | [spec](modules/sales/SAL-012.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-013 | /reports/consignment-sales | Reports: consignment sales | [spec](modules/sales/SAL-013.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-014 | /consignment/return, /consignment/sales ... | Consignment | [spec](modules/sales/SAL-014.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SEC-019 | /controls/access-reviews, /controls/access-reviews/:id/complete ... | Controls | [spec](modules/administration/SEC-019.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SEC-020 | /accounts/:id/related-party | Accounts (controls) | [spec](modules/administration/SEC-020.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| CRM-015 | /crm/leads, /crm/leads/:id ... | Crm: leads | [spec](modules/crm/CRM-015.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| CRM-016 | /crm/pipeline | Crm: pipeline | [spec](modules/crm/CRM-016.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| CRM-017 | /crm/activities, /crm/activities/:id/done ... | Crm: activities | [spec](modules/crm/CRM-017.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| CRM-018 | /crm/templates, /crm/templates/:id ... | Crm: templates | [spec](modules/crm/CRM-018.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| CRM-019 | /crm/messaging | Crm: messaging | [spec](modules/crm/CRM-019.md) | specified | PARTIALLY IMPLEMENTED | not started | not done | not done | no automated test |
| CRM-020 | /crm/messages | Crm: messages | [spec](modules/crm/CRM-020.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| CRM-021 | /crm/customers/:id, /crm/customers/:id/remind | Crm: customers | [spec](modules/crm/CRM-021.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SEC-021 | /cron/audit-seal, /cron/backups ... | Cron | [spec](modules/administration/SEC-021.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen; no automated test |
| POS-007 | /reports/daily-sales | Reports: daily sales | [spec](modules/pos/POS-007.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-015 | /delivery-orders, /delivery-orders/:id ... | Delivery orders | [spec](modules/sales/SAL-015.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-008 | /reports/discounts | Reports: discounts | [spec](modules/pos/POS-008.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-001 | /reports/branch-comparison | Reports: branch comparison | [spec](modules/inventory/INV-001.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-002 | /allocations/dispatch, /allocations/propose | Allocations | [spec](modules/inventory/INV-002.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| EXP-001 | /files, /files/:id ... | Files | [spec](modules/expenses/EXP-001.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| EXP-002 | /expenses/categories, /expenses/categories/:id ... | Expenses | [spec](modules/expenses/EXP-002.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| EXP-003 | /reports/travel-claims | Reports: travel claims | [spec](modules/expenses/EXP-003.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| TAX-001 | /exports/incentive, /exports/inverted-duty ... | Exports | [spec](modules/tax/TAX-001.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| TAX-002 | /gst/settings | Gst: settings | [spec](modules/tax/TAX-002.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| TAX-003 | /print-language | Print language | [spec](modules/tax/TAX-003.md) | specified | PARTIALLY IMPLEMENTED | not started | not done | not done | no automated test |
| TAX-004 | /gst/gstr1 | Gst: gstr1 | [spec](modules/tax/TAX-004.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| TAX-005 | /gst/gstr3b | Gst: gstr3b | [spec](modules/tax/TAX-005.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| TAX-006 | /gst/portal, /gst/portal/connect ... | Gst: portal | [spec](modules/tax/TAX-006.md) | specified | DEMO / PLACEHOLDER | not started | not done | not done | simulator behind it |
| TAX-007 | /gst/filings, /gst/filings/file ... | Gst: filings | [spec](modules/tax/TAX-007.md) | specified | DEMO / PLACEHOLDER | not started | not done | not done | simulator behind it |
| TAX-008 | /reports/${kind}s | GST reports by kind (templated route) | [spec](modules/tax/TAX-008.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen; no automated test |
| TAX-009 | /import/items, /import/parties ... | Import | [spec](modules/tax/TAX-009.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| TAX-010 | /gst-jv, /gst-jv/position | Gst jv | [spec](modules/tax/TAX-010.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| TAX-011 | /gst/work/2a, /gst/work/2a/:period ... | Gst: work | [spec](modules/tax/TAX-011.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| HR-001 | /employees, /employees/:id ... | Employees | [spec](modules/hr/HR-001.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| HR-002 | /holidays, /holidays/:id ... | Holidays | [spec](modules/hr/HR-002.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| HR-003 | /attendance, /attendance/import ... | Attendance (hr) | [spec](modules/hr/HR-003.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| HR-004 | /hr/week-off-changes, /hr/week-off-changes/:id ... | Hr: week off changes | [spec](modules/hr/HR-004.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| HR-005 | /leave-types | Leave types | [spec](modules/hr/HR-005.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| HR-006 | /leave-requests, /leave-requests/:id/${action} ... | Leave requests | [spec](modules/hr/HR-006.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| HR-007 | /payroll/settings | Payroll | [spec](modules/hr/HR-007.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| HR-008 | /payroll-runs, /payroll-runs/:id ... | Payroll runs | [spec](modules/hr/HR-008.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| HR-009 | /payslips/:id | Payslips | [spec](modules/hr/HR-009.md) | specified | PARTIALLY IMPLEMENTED | not started | not done | not done | no automated test |
| HR-010 | /hr/attendance-alerts | Hr: attendance alerts | [spec](modules/hr/HR-010.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| HR-011 | /stipends, /stipends/:id/cancel | Stipends | [spec](modules/hr/HR-011.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| HR-012 | /loan-requests, /loan-requests/:id/decide | Loan requests | [spec](modules/hr/HR-012.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| HR-013 | /hr/documents/expiring | Hr: documents | [spec](modules/hr/HR-013.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| HR-014 | /loans/:id/cancel, /loans/:id/receipts ... | Loans | [spec](modules/hr/HR-014.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| HR-015 | /loan-receipts/:id/cancel | Loan receipts | [spec](modules/hr/HR-015.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen; no automated test |
| HR-016 | /shifts, /shifts/:id ... | Shifts | [spec](modules/hr/HR-016.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| HR-017 | /statutory/dues, /statutory/payments ... | Statutory | [spec](modules/hr/HR-017.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| HR-018 | /tds/24q | Tds: 24q | [spec](modules/hr/HR-018.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-003 | /hsn, /hsn/:id ... | Hsn | [spec](modules/inventory/INV-003.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| HR-019 | /iclock/cdata, /iclock/devicecmd ... | Iclock | [spec](modules/hr/HR-019.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen |
| HR-020 | /attendance/devices, /attendance/devices/:id ... | Attendance (iclock) | [spec](modules/hr/HR-020.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| RPT-001 | /analytics/checks, /analytics/dashboard ... | Analytics | [spec](modules/reports/RPT-001.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| RPT-002 | /reports/colour-size | Reports: colour size | [spec](modules/reports/RPT-002.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| RPT-003 | /reports/stock-ageing | Reports: stock ageing | [spec](modules/reports/RPT-003.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| RPT-004 | /reports/sales-register | Reports: sales register | [spec](modules/reports/RPT-004.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| RPT-005 | /reports/builder/csv, /reports/builder/datasets ... | Reports: builder | [spec](modules/reports/RPT-005.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| RPT-006 | /reports/saved, /reports/saved/:id ... | Reports: saved | [spec](modules/reports/RPT-006.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| RPT-007 | /assistant/ask, /assistant/tools | Assistant | [spec](modules/reports/RPT-007.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| RPT-008 | /purchase-bills/read | Purchase bills (insights) | [spec](modules/reports/RPT-008.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-004 | /inventory/setup | Inventory: setup | [spec](modules/inventory/INV-004.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-005 | /inventory/valuation-method | Inventory: valuation method | [spec](modules/inventory/INV-005.md) | specified | PARTIALLY IMPLEMENTED | not started | not done | not done | no automated test |
| INV-006 | /warehouses | Warehouses | [spec](modules/inventory/INV-006.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-007 | /items, /items/:id ... | Items (inventory) | [spec](modules/inventory/INV-007.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-008 | /stock-journals, /stock-journals/:id ... | Stock journals | [spec](modules/inventory/INV-008.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-009 | /reports/stock-summary | Reports: stock summary | [spec](modules/inventory/INV-009.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-010 | /reports/item-ledger/:itemId | Reports: item ledger | [spec](modules/inventory/INV-010.md) | specified | PARTIALLY IMPLEMENTED | not started | not done | not done | no automated test |
| INV-011 | /reports/reorder | Reports: reorder | [spec](modules/inventory/INV-011.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-012 | /lookups, /lookups/:kind ... | Lookups | [spec](modules/inventory/INV-012.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-013 | /stock-losses, /stock-losses/:id/decide ... | Stock losses | [spec](modules/inventory/INV-013.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-014 | /reports/stock-losses | Reports: stock losses | [spec](modules/inventory/INV-014.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-009 | /loyalty/members, /loyalty/members/:phone ... | Loyalty | [spec](modules/pos/POS-009.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-016 | /lr-entries, /lr-entries/:id ... | Lr entries | [spec](modules/sales/SAL-016.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen |
| MFG-001 | /work-centres, /work-centres/:id ... | Work centres | [spec](modules/manufacturing/MFG-001.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| MFG-002 | /boms, /boms/:id ... | Boms | [spec](modules/manufacturing/MFG-002.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| MFG-003 | /production-orders, /production-orders/:id ... | Production orders | [spec](modules/manufacturing/MFG-003.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| MFG-004 | /mrp, /mrp/convert | Mrp | [spec](modules/manufacturing/MFG-004.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| MFG-005 | /job-work, /job-work/:id/cancel ... | Job work | [spec](modules/manufacturing/MFG-005.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-015 | /margin-bands, /margin-bands/price ... | Margin bands | [spec](modules/inventory/INV-015.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-016 | /accounts/:id/merge | Accounts (merge) | [spec](modules/inventory/INV-016.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-017 | /items/:id/merge | Items (merge) | [spec](modules/inventory/INV-017.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| TAX-012 | /reports/msme | Reports: msme | [spec](modules/tax/TAX-012.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| AI-002 | /notes, /notes/:id ... | Notes | [spec](modules/assistant/AI-002.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SYN-001 | /sync/offline-rules | Sync: offline rules | [spec](modules/sync/SYN-001.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen |
| SAL-017 | /reports/sales-order-register | Reports: sales order register | [spec](modules/sales/SAL-017.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-010 | /schemes, /schemes/:id ... | Schemes | [spec](modules/pos/POS-010.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-011 | /pos/schemes | Pos: schemes | [spec](modules/pos/POS-011.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-012 | /pos/settings | Pos: settings | [spec](modules/pos/POS-012.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-013 | /pos/terminals, /pos/terminals/:id ... | Pos: terminals | [spec](modules/pos/POS-013.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-014 | /pos/sessions, /pos/sessions/:id ... | Pos: sessions (pos) | [spec](modules/pos/POS-014.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-015 | /pos/bills, /pos/bills/:id ... | Pos: bills | [spec](modules/pos/POS-015.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-016 | /pos/returns | Pos: returns | [spec](modules/pos/POS-016.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-017 | /pos/summary | Pos: summary | [spec](modules/pos/POS-017.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-018 | /pos/held, /pos/held/:id/resume ... | Pos: held | [spec](modules/pos/POS-018.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-019 | /pos/salesmen | Pos: salesmen | [spec](modules/pos/POS-019.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-020 | /pos/customers/:phone | Pos: customers | [spec](modules/pos/POS-020.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-021 | /pos/loyalty/:phone | Pos: loyalty | [spec](modules/pos/POS-021.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen |
| SAL-018 | /price-lists, /price-lists/:id ... | Price lists | [spec](modules/sales/SAL-018.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-019 | /reports/interest | Reports: interest | [spec](modules/sales/SAL-019.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SEC-022 | /settings/process-locks | Settings: process locks | [spec](modules/administration/SEC-022.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| RPT-009 | /reports/profitability | Reports: profitability | [spec](modules/reports/RPT-009.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| PRJ-001 | /projects, /projects/:id ... | Projects | [spec](modules/projects/PRJ-001.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| PRJ-002 | /timesheets, /timesheets/:id ... | Timesheets | [spec](modules/projects/PRJ-002.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| PUR-001 | /purchase-orders, /purchase-orders/:id ... | Purchase orders | [spec](modules/procurement/PUR-001.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| PUR-002 | /goods-receipts, /goods-receipts/:id ... | Goods receipts | [spec](modules/procurement/PUR-002.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| PUR-003 | /items/:id/purchase-history | Items (purchasing) | [spec](modules/procurement/PUR-003.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| PUR-004 | /purchase-bills, /purchase-bills/:id ... | Purchase bills (purchasing) | [spec](modules/procurement/PUR-004.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| PUR-005 | /purchase-returns, /purchase-returns/:id ... | Purchase returns | [spec](modules/procurement/PUR-005.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| PUR-006 | /reports/supplier-claims | Reports: supplier claims | [spec](modules/procurement/PUR-006.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-018 | /inventory/rate-update, /inventory/rate-update/request ... | Inventory: rate update | [spec](modules/inventory/INV-018.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| BNK-005 | /recon/items/:id, /recon/runs ... | Recon | [spec](modules/banking/BNK-005.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-019 | /relabels, /relabels/:id ... | Relabels | [spec](modules/inventory/INV-019.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-022 | /repairs, /repairs/:id ... | Repairs | [spec](modules/pos/POS-022.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-023 | /inquiries, /inquiries/:id/close ... | Inquiries | [spec](modules/pos/POS-023.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-024 | /reports/service-customers | Reports: service customers | [spec](modules/pos/POS-024.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| RPT-010 | /reports/register | Reports: register | [spec](modules/reports/RPT-010.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| RPT-011 | /reports/year-comparison | Reports: year comparison | [spec](modules/reports/RPT-011.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| RPT-012 | /reports/sales-vs-purchases | Reports: sales vs purchases | [spec](modules/reports/RPT-012.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| RPT-013 | /reports/profit-by | Reports: profit by | [spec](modules/reports/RPT-013.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| RPT-014 | /reports/stock-ratios | Reports: stock ratios | [spec](modules/reports/RPT-014.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| RPT-015 | /reports/vendor-analysis | Reports: vendor analysis | [spec](modules/reports/RPT-015.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| RPT-016 | /reports/purchase-backlog | Reports: purchase backlog | [spec](modules/reports/RPT-016.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-020 | /quotations, /quotations/:id ... | Quotations | [spec](modules/sales/SAL-020.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-021 | /sales-orders, /sales-orders/:id ... | Sales orders | [spec](modules/sales/SAL-021.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-022 | /delivery-notes, /delivery-notes/:id ... | Delivery notes | [spec](modules/sales/SAL-022.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-023 | /approvals/pending | Approvals | [spec](modules/sales/SAL-023.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-024 | /samples/pending | Samples | [spec](modules/sales/SAL-024.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-025 | /sales-invoices, /sales-invoices/:id ... | Sales invoices (sales) | [spec](modules/sales/SAL-025.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-026 | /credit-notes, /credit-notes/:id ... | Credit notes | [spec](modules/sales/SAL-026.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-027 | /${path}/:id/einvoice, /${path}/:id/einvoice/cancel | E-invoice generate and cancel (invoices and credit notes, templated route) | [spec](modules/sales/SAL-027.md) | specified | DEMO / PLACEHOLDER | not started | not done | not done | simulator behind it; no automated test |
| SAL-028 | /salesman-commission/report, /salesman-commission/rules ... | Salesman commission | [spec](modules/sales/SAL-028.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-023 | /scenarios, /scenarios/:id ... | Scenarios | [spec](modules/finance/FIN-023.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SEC-023 | /config/changes, /config/changes/:id/cancel ... | Config | [spec](modules/administration/SEC-023.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-020 | /items/:id/track-serials | Items (serials) | [spec](modules/inventory/INV-020.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-021 | /serials, /serials/check ... | Serials | [spec](modules/inventory/INV-021.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-029 | /sales-invoices/:id/send | Sales invoices (sharing) | [spec](modules/sales/SAL-029.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen |
| SAL-030 | /reminders/payments | Reminders | [spec](modules/sales/SAL-030.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SAL-031 | /messages | Messages | [spec](modules/sales/SAL-031.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen |
| SAL-032 | /public/documents/:token | Public (sharing) | [spec](modules/sales/SAL-032.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-022 | /stock-counts, /stock-counts/:id ... | Stock counts | [spec](modules/inventory/INV-022.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-023 | /reports/stock-audit | Reports: stock audit | [spec](modules/inventory/INV-023.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-024 | /finance/stock-review | Finance: stock review | [spec](modules/finance/FIN-024.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-025 | /finance/writedowns, /finance/writedowns/:id/decide ... | Finance: writedowns | [spec](modules/finance/FIN-025.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-026 | /finance/cost-centres | Finance: cost centres | [spec](modules/finance/FIN-026.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-027 | /finance/store-results | Finance: store results | [spec](modules/finance/FIN-027.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-028 | /finance/allocation-rules/:accountId | Finance: allocation rules | [spec](modules/finance/FIN-028.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-024 | /stock-limits, /stock-limits/:warehouseId | Stock limits | [spec](modules/inventory/INV-024.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-025 | /inventory/reset-stock | Inventory: reset stock | [spec](modules/inventory/INV-025.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-026 | /reports/stock-posting-check | Reports: stock posting check | [spec](modules/inventory/INV-026.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-027 | /size-scales, /size-scales/:id ... | Size scales | [spec](modules/inventory/INV-027.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-028 | /colors, /colors/:id ... | Colors | [spec](modules/inventory/INV-028.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| INV-029 | /styles, /styles/:id ... | Styles (styles) | [spec](modules/inventory/INV-029.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SYN-002 | /sync/status | Sync: status | [spec](modules/sync/SYN-002.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SYN-003 | /sync/rejections, /sync/rejections/:id/resolve | Sync: rejections | [spec](modules/sync/SYN-003.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SYN-004 | /devices, /devices/:id/revoke ... | Devices | [spec](modules/sync/SYN-004.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SYN-005 | /sync/pull | Sync: pull | [spec](modules/sync/SYN-005.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen |
| SYN-006 | /sync/push | Sync: push | [spec](modules/sync/SYN-006.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen |
| POS-025 | /measurements, /measurements/:id ... | Measurements | [spec](modules/pos/POS-025.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-026 | /tailoring-rates | Tailoring rates | [spec](modules/pos/POS-026.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-027 | /tailoring-orders, /tailoring-orders/:id/assign ... | Tailoring orders | [spec](modules/pos/POS-027.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| TAX-013 | /tds/section-map, /tds/section-map/:section ... | Tds: section map | [spec](modules/tax/TAX-013.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| TAX-014 | /tds/sections | Tds: sections | [spec](modules/tax/TAX-014.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| TAX-015 | /tds/preview | Tds: preview | [spec](modules/tax/TAX-015.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| TAX-016 | /tds/deductions, /tds/deductions/:id/cancel ... | Tds: deductions | [spec](modules/tax/TAX-016.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| TAX-017 | /tds/challans, /tds/challans/:id/cancel ... | Tds: challans | [spec](modules/tax/TAX-017.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| TAX-018 | /tds/26q | Tds: 26q | [spec](modules/tax/TAX-018.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| TAX-019 | /tds/certificate | Tds: certificate | [spec](modules/tax/TAX-019.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| TAX-020 | /tds/194q | Tds: 194q | [spec](modules/tax/TAX-020.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| TAX-021 | /tcs/27eq, /tcs/collections ... | Tcs | [spec](modules/tax/TAX-021.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SEC-024 | /members, /members/:id ... | Members | [spec](modules/administration/SEC-024.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SEC-025 | /invitations, /invitations/:id ... | Invitations | [spec](modules/administration/SEC-025.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SEC-026 | /roles, /roles/:id ... | Roles | [spec](modules/administration/SEC-026.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SEC-027 | /tenants | Tenants | [spec](modules/administration/SEC-027.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen |
| SEC-028 | /meta/states | Meta | [spec](modules/administration/SEC-028.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen; no automated test |
| SEC-029 | /tools/gst, /tools/gstin | Tools | [spec](modules/administration/SEC-029.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen |
| INV-030 | /stock-transfers, /stock-transfers/:id ... | Stock transfers | [spec](modules/inventory/INV-030.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| SEC-030 | /reports/user-activity | Reports: user activity | [spec](modules/administration/SEC-030.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-028 | /gift-vouchers, /gift-vouchers/:code ... | Gift vouchers | [spec](modules/pos/POS-028.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-029 | /coupons, /coupons/:id ... | Coupons | [spec](modules/pos/POS-029.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-030 | /discount-cards, /discount-cards/:id ... | Discount cards | [spec](modules/pos/POS-030.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| POS-031 | /pos/promo | Pos: promo | [spec](modules/pos/POS-031.md) | specified | BACKEND ONLY | not started | not done | not done | needs a screen |
| POS-032 | /lucky-draws | Lucky draws | [spec](modules/pos/POS-032.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-029 | /finance/credit-exposure | Finance: credit exposure | [spec](modules/finance/FIN-029.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-030 | /finance/supplier-calendar | Finance: supplier calendar | [spec](modules/finance/FIN-030.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-031 | /finance/cash-forecast | Finance: cash forecast | [spec](modules/finance/FIN-031.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-032 | /finance/commitments, /finance/commitments/:id/stop ... | Finance: commitments | [spec](modules/finance/FIN-032.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-033 | /finance/drawing-power | Finance: drawing power | [spec](modules/finance/FIN-033.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-034 | /finance/cheques, /finance/cheques/:id/settle ... | Finance: cheques | [spec](modules/finance/FIN-034.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-035 | /reports/year-end | Reports: year end | [spec](modules/finance/FIN-035.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |
| FIN-036 | /reports/carry-forward | Reports: carry forward | [spec](modules/finance/FIN-036.md) | specified | FULLY IMPLEMENTED | not started | not done | not done | - |

## B. Screens

| Screen | Title | Features | Specification | Redesign | Visual QA | Functional QA |
|---|---|---|---|---|---|---|
| `/account` | My account | SEC-004, SEC-009 | per-feature spec | shell and tokens only | not done | not done |
| `/accounts/bill-receipt` | - | FIN-010, FIN-011, FIN-018 | per-feature spec | shell and tokens only | not done | not done |
| `/accounts/chart` | Chart of accounts | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/accounts/close` | Close the books | SEC-004, FIN-020, FIN-021 | per-feature spec | shell and tokens only | not done | not done |
| `/accounts/gst-jv` | GST journal voucher | FIN-010, FIN-011, SAL-005 | per-feature spec | shell and tokens only | not done | not done |
| `/accounts/reconciliation` | Reconciliation | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/accounts/scenarios` | What-if planning | FIN-023 | per-feature spec | shell and tokens only | not done | not done |
| `/accounts/tds` | TDS on payments | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/accounts/vouchers/[id]` | - | FIN-012, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/accounts/vouchers/new` | Vouchers | FIN-010, FIN-011, FIN-012 | per-feature spec | rebuilt: unsaved-work signal wired | looked at | not done |
| `/accounts/vouchers` | Vouchers | FIN-012, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/accounts/working-capital` | Working capital | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/assets/[id]` | Fixed assets | FIN-010, FIN-011, AST-001 | per-feature spec | shell and tokens only | not done | not done |
| `/assets/depreciation` | Depreciation | AST-001, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/assets/income-tax` | Income-tax depreciation | AST-001, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/assets/new` | Fixed assets | AST-001, HR-001 | per-feature spec | shell and tokens only | not done | not done |
| `/assets` | Fixed assets | AST-001, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/assistant` | Assistant | RPT-007 | per-feature spec | shell and tokens only | not done | not done |
| `/banking/[id]` | - | SEC-004, BNK-001, BNK-002 | per-feature spec | shell and tokens only | not done | not done |
| `/banking` | Banks | BNK-001 | per-feature spec | shell and tokens only | not done | not done |
| `/banking/rules` | Bank rules | SEC-004, BNK-001, BNK-002 | per-feature spec | shell and tokens only | not done | not done |
| `/banking/settlements` | Gateway settlements | SEC-004, BNK-001, BNK-002 | per-feature spec | shell and tokens only | not done | not done |
| `/chat` | Chat | AI-001 | per-feature spec | shell and tokens only | not done | not done |
| `/crm/activities` | Follow-ups | CRM-015, CRM-017, CRM-020 | per-feature spec | shell and tokens only | not done | not done |
| `/crm/communications` | Communication centre | SEC-004, CRM-001, CRM-002 | per-feature spec | shell and tokens only | not done | not done |
| `/crm/customers/[id]` | Customer | SEC-004, CRM-015, CRM-017 | per-feature spec | shell and tokens only | not done | not done |
| `/crm/leads/[id]` | Leads | SEC-004, CRM-015, CRM-017 | per-feature spec | shell and tokens only | not done | not done |
| `/crm/leads/new` | Leads | CRM-015, CRM-017, CRM-020 | per-feature spec | shell and tokens only | not done | not done |
| `/crm/leads` | Leads | SEC-004, CRM-015, CRM-016 | per-feature spec | shell and tokens only | not done | not done |
| `/crm/messages` | - | CRM-019 | per-feature spec | shell and tokens only | not done | not done |
| `/crm/templates` | Message templates | SEC-004, CRM-015, CRM-017 | per-feature spec | shell and tokens only | not done | not done |
| `/dashboard` | - | SEC-004, SEC-013, RPT-001 | per-feature spec | shell and tokens only | not done | not done |
| `/expenses/[id]/edit` | Expense claim | SEC-004, EXP-001, EXP-002 | per-feature spec | shell and tokens only | not done | not done |
| `/expenses/[id]` | Expense claim | SEC-004, EXP-001, EXP-002 | per-feature spec | shell and tokens only | not done | not done |
| `/expenses/new` | Expense claims | SEC-004, EXP-001, EXP-002 | per-feature spec | shell and tokens only | not done | not done |
| `/expenses` | Expense claims | SEC-004, EXP-002 | per-feature spec | shell and tokens only | not done | not done |
| `/expenses/travel` | Travel claims | EXP-003 | per-feature spec | shell and tokens only | not done | not done |
| `/gst/compliance` | GST compliance | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/gst/exports` | Exports | SEC-004, TAX-001 | per-feature spec | shell and tokens only | not done | not done |
| `/gst/returns` | GST returns | SEC-004, TAX-004, TAX-005 | per-feature spec | rebuilt: Excel workings | not done | not done |
| `/gst/slab-exceptions` | GST slab exceptions | TAX-011 | per-feature spec | shell and tokens only | not done | not done |
| `/gst/workspace` | GST workspace | SEC-004, TAX-011 | per-feature spec | shell and tokens only | not done | not done |
| `/hr/attendance-alerts` | Absent and late | HR-010 | per-feature spec | shell and tokens only | not done | not done |
| `/hr/attendance-devices` | Attendance machines | SEC-004, HR-020 | per-feature spec | shell and tokens only | not done | not done |
| `/hr/attendance` | Attendance | SEC-004, TAX-009, HR-002 | per-feature spec | shell and tokens only | not done | not done |
| `/hr/documents` | Documents and KYC | HR-013 | per-feature spec | shell and tokens only | not done | not done |
| `/hr/employees/[id]` | - | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/hr/employees/new` | Employees | FIN-010, FIN-011, SEC-013 | per-feature spec | shell and tokens only | not done | not done |
| `/hr/employees` | Employees | SEC-004, HR-001 | per-feature spec | shell and tokens only | not done | not done |
| `/hr/leave` | Leave | SEC-004, HR-001, HR-005 | per-feature spec | shell and tokens only | not done | not done |
| `/hr/loan-requests` | Advance and loan requests | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/hr/payroll/[id]` | - | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/hr/payroll` | Payroll | SEC-004, HR-008 | per-feature spec | shell and tokens only | not done | not done |
| `/hr/statutory` | Statutory dues & TDS | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/hr/stipends` | Stipend | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/insights` | Business insights | RPT-001 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/barcode-search` | Barcode search | FIN-010, FIN-011, SEC-013 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/branch-prices` | Store prices | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/catalogue/[id]` | Image catalogue | SEC-004, SAL-003, SAL-021 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/catalogue` | Image catalogue | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/counts/[id]` | Stock counts | SEC-004, INV-022 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/counts/audit` | Stock audit | INV-023 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/counts` | Stock counts | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/distribution` | Branches and share-out | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/items/[id]` | - | FIN-010, FIN-011, SEC-013 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/items` | Items | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/journals/[id]` | - | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/journals/new` | Stock journals | FIN-010, FIN-011, SEC-013 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/journals` | Stock journals | SEC-004, INV-008 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/labels` | Barcode and price labels | SEC-013, INV-007, INV-029 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/losses` | Stock losses and damage | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/margin-bands` | Mark-up bands | SEC-004, INV-015 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/rate-update` | Rate updation | SEC-004, INV-018, INV-029 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/relabel` | Re-labelling | FIN-010, FIN-011, SEC-013 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/reset-stock` | Reset physical stock | INV-004, INV-025, INV-029 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/serials` | Serial numbers | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/stock-finance` | Stock finance | SEC-004, FIN-024, FIN-025 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/stock-limits` | Minimum and maximum stock | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/stock` | Stock summary | FIN-010, FIN-011, SEC-013 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/styles/[id]` | Styles | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/styles` | Styles | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | looked at | not done |
| `/inventory/styles/setup` | Styles | SEC-004, SAL-001, SAL-002 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/transfers/[id]` | Stock transfer | SEC-004, INV-030 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/transfers/new` | Stock transfer | FIN-010, FIN-011, SEC-013 | per-feature spec | shell and tokens only | not done | not done |
| `/inventory/transfers` | Stock transfer | SEC-004, INV-030 | per-feature spec | shell and tokens only | not done | not done |
| `/launcher` | All actions | SEC-004, SEC-005 | per-feature spec | shell and tokens only | not done | not done |
| `/manufacturing/boms/[id]` | Bills of materials | SEC-004, MFG-002 | per-feature spec | shell and tokens only | not done | not done |
| `/manufacturing/boms/new` | Bills of materials | FIN-010, FIN-011, SEC-013 | per-feature spec | shell and tokens only | not done | not done |
| `/manufacturing/boms` | Bills of materials | SEC-004, MFG-001, MFG-002 | per-feature spec | shell and tokens only | not done | not done |
| `/manufacturing/job-work` | Job work | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/manufacturing/mrp` | Material planning (MRP) | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/manufacturing/orders/[id]` | Production orders | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/manufacturing/orders/new` | Production orders | FIN-010, FIN-011, SEC-013 | per-feature spec | shell and tokens only | not done | not done |
| `/manufacturing/orders` | Production orders | SEC-004, MFG-003 | per-feature spec | shell and tokens only | not done | not done |
| `/masters/hsn` | HSN and SAC codes | SEC-004, INV-003 | per-feature spec | shell and tokens only | not done | not done |
| `/masters/lists/[kind]` | - | SEC-004, INV-012 | per-feature spec | shell and tokens only | not done | not done |
| `/masters/merge` | Merge duplicates | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/masters` | - | SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/my-menu` | All actions | SEC-004, SEC-005, RPT-001 | per-feature spec | shell and tokens only | looked at | not done |
| `/pos/alterations` | Alterations and repairs | POS-001, POS-002, POS-003 | per-feature spec | shell and tokens only | not done | not done |
| `/pos/billing` | Billing | POS-004, SEC-004, POS-006 | per-feature spec | shell and tokens only | not done | not done |
| `/pos/bills` | POS bills | SEC-004, POS-015, POS-017 | per-feature spec | shell and tokens only | not done | not done |
| `/pos/loyalty` | Loyalty members | SEC-004, POS-009 | per-feature spec | shell and tokens only | not done | not done |
| `/pos/returns` | Returns and exchanges | SEC-004, POS-006, SAL-001 | per-feature spec | shell and tokens only | not done | not done |
| `/pos/schemes` | Schemes and offers | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/pos/tailoring` | Made-to-order tailoring | FIN-010, FIN-011, POS-001 | per-feature spec | shell and tokens only | not done | not done |
| `/pos/vouchers` | Vouchers and coupons | SEC-004, POS-028, POS-029 | per-feature spec | shell and tokens only | not done | not done |
| `/projects/[id]` | Projects | SEC-004, PRJ-001, PRJ-002 | per-feature spec | shell and tokens only | not done | not done |
| `/projects/new` | Projects | PRJ-001, PRJ-002 | per-feature spec | shell and tokens only | not done | not done |
| `/projects` | Projects | SEC-004, PRJ-001 | per-feature spec | shell and tokens only | not done | not done |
| `/projects/timesheets` | Timesheets | SEC-004, PRJ-001, PRJ-002 | per-feature spec | shell and tokens only | not done | not done |
| `/purchase/bills/[id]` | - | SEC-004, RPT-008, PUR-004 | per-feature spec | shell and tokens only | not done | not done |
| `/purchase/bills/new` | Purchase bills | FIN-010, FIN-011, SEC-013 | per-feature spec | shell and tokens only | not done | not done |
| `/purchase/bills` | Purchase bills | SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/purchase/orders/[id]` | - | SEC-004, PUR-001 | per-feature spec | shell and tokens only | not done | not done |
| `/purchase/orders/new` | Purchase orders | FIN-010, FIN-011, SEC-013 | per-feature spec | shell and tokens only | not done | not done |
| `/purchase/orders` | Purchase orders | SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/purchase/receipts/[id]` | - | SEC-004, PUR-002 | per-feature spec | shell and tokens only | not done | not done |
| `/purchase/receipts/new` | Inward challans | FIN-010, FIN-011, SAL-001 | per-feature spec | shell and tokens only | not done | not done |
| `/purchase/receipts` | Inward challans | SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/purchase/receiving` | Receiving and inspection | SEC-004, PUR-002, PUR-006 | per-feature spec | shell and tokens only | not done | not done |
| `/purchase/returns/[id]` | - | SEC-004, PUR-005 | per-feature spec | shell and tokens only | not done | not done |
| `/purchase/returns` | Purchase returns | SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/balance-sheet` | - | FIN-016 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/books` | Account books | FIN-001, FIN-002, FIN-003 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/builder` | Report builder | RPT-005, RPT-006 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/cash-flow-statement` | Cash flow | FIN-019 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/cfo` | Owner's view | FIN-008 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/checks` | Checks | RPT-001 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/colour-size` | - | FIN-010, FIN-011, SEC-013 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/consignment-sales` | Shop-in-shop sales | SAL-013 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/daily-sales` | Daily sales | POS-007 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/discounts` | Discount register | POS-008 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/integrity` | Integrity check | FIN-007 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/interest` | Interest on overdue | SAL-019 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/ledger/[id]` | - | FIN-017 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/msme` | MSME payments | TAX-012 | per-feature spec | shell and tokens only | not done | not done |
| `/reports` | - | SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/payables` | - | SEC-004, SAL-030 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/profit-loss` | - | FIN-015 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/profitability` | Profitability | RPT-009 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/receivables` | - | SEC-004, SAL-030 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/registers` | Registers and ratios | RPT-010, RPT-011, RPT-012 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/sales-order-register` | Sales order register | SAL-017 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/sales-register` | - | RPT-004 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/saved` | Report builder | SEC-004, RPT-005, RPT-006 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/stock-ageing` | - | RPT-003 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/stock-movement` | Fast and slow movers | FIN-009 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/stock-posting-check` | Stock posting check | INV-026 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/store-results` | Store results | SEC-004, FIN-027, FIN-028 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/trial-balance` | - | FIN-014 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/user-activity` | User activity | SEC-030 | per-feature spec | shell and tokens only | not done | not done |
| `/reports/year-end` | Year-end check | FIN-035, FIN-036 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/approval-memos` | Goods on approval | FIN-010, FIN-011, POS-004 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/approvals` | Goods on approval | SEC-004, SAL-023 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/commission-rules` | Salesman commission rules | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/commission` | Brokers and agents | SEC-004, SAL-007, SAL-008 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/consignment` | Consignment and shop-in-shop | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/credit-notes/[id]` | - | SEC-004, SAL-026 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/credit-notes` | Credit notes | SEC-004 | per-feature spec | rebuilt: DataTable | not done | not done |
| `/sales/deliveries/[id]` | - | SEC-004, SAL-022 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/deliveries/new` | Delivery challans | FIN-010, FIN-011, SEC-013 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/deliveries` | Delivery challans | SEC-004 | per-feature spec | rebuilt: DataTable | not done | not done |
| `/sales/delivery-orders/[id]` | Delivery orders | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/delivery-orders/new` | Delivery orders | FIN-010, FIN-011, SEC-013 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/delivery-orders` | Delivery orders | SEC-004, SAL-015 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/inquiries` | Inquiry log | SEC-004, POS-023 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/invoices/[id]` | - | SEC-004, SAL-025, SAL-026 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/invoices/new` | Sales invoices | FIN-010, FIN-011, SAL-005 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/invoices` | Sales invoices | SEC-004 | per-feature spec | rebuilt: DataTable | looked at | not done |
| `/sales/lr` | LR and transport entry | SEC-004, INV-012, SAL-025 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/orders/[id]` | - | SEC-004, SAL-021 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/orders/new` | Sales orders | FIN-010, FIN-011, SAL-005 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/orders` | Sales orders | SEC-004 | per-feature spec | rebuilt: DataTable | not done | not done |
| `/sales/price-lists` | Price lists | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/proformas/[id]` | - | SEC-004, SAL-020 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/proformas/new` | Proforma invoices | FIN-010, FIN-011, SAL-005 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/proformas` | Proforma invoices | SEC-004 | per-feature spec | rebuilt: DataTable | not done | not done |
| `/sales/quotations/[id]` | - | SEC-004, SAL-020 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/quotations/new` | Quotations | FIN-010, FIN-011, SAL-005 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/quotations` | Quotations | SEC-004 | per-feature spec | rebuilt: DataTable | not done | not done |
| `/sales/repairs` | Service desk | SEC-004, POS-022 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/samples` | Samples out | SEC-004, SAL-024 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/service-customers` | Repair and tailoring customers | POS-024 | per-feature spec | shell and tokens only | not done | not done |
| `/sales/targets` | Salesman targets | SEC-004, SAL-006, SAL-009 | per-feature spec | shell and tokens only | not done | not done |
| `/settings/approvals` | Approvals | SEC-004, SEC-011, SEC-012 | per-feature spec | shell and tokens only | not done | not done |
| `/settings/audit-log` | Audit trail | SEC-017 | per-feature spec | shell and tokens only | not done | not done |
| `/settings/backup` | Backup and export | SEC-004, SEC-010, SEC-018 | per-feature spec | shell and tokens only | not done | not done |
| `/settings/company` | Company & branches | SEC-004, SEC-013 | per-feature spec | shell and tokens only | not done | not done |
| `/settings/controls` | Internal controls | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/settings/dated-changes` | Dated changes | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/settings/devices` | Devices and sync | SEC-004, SYN-002, SYN-003 | per-feature spec | shell and tokens only | not done | not done |
| `/settings/expenses` | Expense categories | SEC-004, EXP-001, EXP-002 | per-feature spec | shell and tokens only | not done | not done |
| `/settings/financial-years` | Financial years | FIN-013, SEC-004, SEC-015 | per-feature spec | shell and tokens only | not done | not done |
| `/settings/gst` | GST & invoicing | SEC-004, TAX-002 | per-feature spec | shell and tokens only | not done | not done |
| `/settings/import` | Import data | TAX-009 | per-feature spec | shell and tokens only | not done | not done |
| `/settings/inventory` | Inventory settings | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/settings/number-series` | Number series | SEC-004, SEC-016 | per-feature spec | shell and tokens only | not done | not done |
| `/settings/payroll` | Payroll settings | SEC-004, HR-007, HR-016 | per-feature spec | shell and tokens only | not done | not done |
| `/settings/pos` | Counter settings | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/settings/process-locks` | Lock by document kind | SEC-004, SEC-022 | per-feature spec | shell and tokens only | not done | not done |
| `/settings/sensitive-changes` | Sensitive changes | SEC-017 | per-feature spec | shell and tokens only | not done | not done |
| `/settings/team` | Team & roles | FIN-010, FIN-011, SEC-004 | per-feature spec | shell and tokens only | not done | not done |
| `/forgot-password` | - | SEC-009 | per-feature spec | shell and tokens only | not done | not done |
| `/invite/[token]` | Join {business} | SEC-025 | per-feature spec | shell and tokens only | not done | not done |
| `/login` | - | SEC-002 | per-feature spec | rebuilt: show-password toggle | looked at | not done |
| `/reset-password/[token]` | - | SEC-009 | per-feature spec | shell and tokens only | not done | not done |
| `/signup` | - | SEC-001 | per-feature spec | rebuilt: show-password toggle | not done | not done |
| `/print/box-label/[id]` | - | SAL-025 | per-feature spec | shell and tokens only | not done | not done |
| `/print/catalogue/[id]` | - | SAL-003, SAL-021 | per-feature spec | shell and tokens only | not done | not done |
| `/print/challan/[id]` | - | SAL-022 | per-feature spec | shell and tokens only | not done | not done |
| `/print/cheque/[id]` | - | FIN-012 | per-feature spec | shell and tokens only | not done | not done |
| `/print/count-sheet/[id]` | Count sheet | INV-022 | per-feature spec | shell and tokens only | not done | not done |
| `/print/envelope/[id]` | - | FIN-010, FIN-011 | per-feature spec | shell and tokens only | not done | not done |
| `/print/eway-bill/[id]` | E-way bill | SAL-025 | per-feature spec | shell and tokens only | not done | not done |
| `/print/form16/[id]` | - | TAX-003, HR-001 | per-feature spec | shell and tokens only | not done | not done |
| `/print/invoice/[id]` | - | SAL-025 | per-feature spec | shell and tokens only | not done | not done |
| `/print/labels` | - | - | not covered by a feature spec | shell and tokens only | not done | not done |
| `/print/packing-slip/[id]` | Packing slip | SAL-025 | per-feature spec | shell and tokens only | not done | not done |
| `/print/parcel-labels/[id]` | - | SAL-025 | per-feature spec | shell and tokens only | not done | not done |
| `/print/payslip/[id]` | - | TAX-003, HR-009 | per-feature spec | shell and tokens only | not done | not done |
| `/print/quotation/[id]` | - | SAL-020 | per-feature spec | shell and tokens only | not done | not done |
| `/print/receipt/[id]` | - | POS-015 | per-feature spec | shell and tokens only | not done | not done |
| `/print/tds-certificate` | Certificate of tax deducted at source | TAX-019 | per-feature spec | shell and tokens only | not done | not done |
| `/print/transfer-slip/[id]` | Transfer slip | INV-030 | per-feature spec | shell and tokens only | not done | not done |
| `/print/vouchers` | Vouchers | FIN-012 | per-feature spec | shell and tokens only | not done | not done |
| `/b/[token]` | - | SAL-032 | per-feature spec | shell and tokens only | not done | not done |
| `/c/[token]` | Image catalogue | SAL-004 | per-feature spec | shell and tokens only | not done | not done |
| `/` | - | - | not covered by a feature spec | shell and tokens only | not done | not done |

## C. Business intelligence (proposed IDs)

| ID | Route | Name | Specification | Design status | Implementation | Redesign | Visual QA | Functional QA | Dependencies |
|---|---|---|---|---|---|---|---|---|---|
| BI-001 | - | Executive Intelligence | [spec](business-intelligence/BI-001-executive-dashboard.md) | specified | partly via existing screens | not started | not done | not done | see spec |
| BI-002 | - | Sales Intelligence | [spec](business-intelligence/BI-002-sales-intelligence.md) | specified | partly via existing screens | not started | not done | not done | see spec |
| BI-003 | - | Finance Intelligence | [spec](business-intelligence/BI-003-finance-intelligence.md) | specified | partly via existing screens | not started | not done | not done | see spec |
| BI-004 | - | Inventory Intelligence | [spec](business-intelligence/BI-004-inventory-intelligence.md) | specified | partly via existing screens | not started | not done | not done | see spec |
| BI-005 | - | Procurement Intelligence | [spec](business-intelligence/BI-005-procurement-intelligence.md) | specified | partly via existing screens | not started | not done | not done | see spec |
| BI-006 | - | Retail Intelligence | [spec](business-intelligence/BI-006-retail-intelligence.md) | specified | partly via existing screens | not started | not done | not done | see spec |
| BI-007 | - | Production Intelligence | [spec](business-intelligence/BI-007-production-intelligence.md) | specified | not built | not started | not done | not done | see spec |
| BI-008 | - | Customer Intelligence | [spec](business-intelligence/BI-008-customer-intelligence.md) | specified | partly via existing screens | not started | not done | not done | see spec |
| BI-009 | - | Workforce Intelligence | [spec](business-intelligence/BI-009-workforce-intelligence.md) | specified | partly via existing screens | not started | not done | not done | see spec |
| BI-010 | - | Compliance Intelligence | [spec](business-intelligence/BI-010-compliance-intelligence.md) | specified | partly via existing screens | not started | not done | not done | see spec |
| BI-011 | - | Dashboard Studio | [spec](business-intelligence/BI-011-dashboard-studio.md) | specified | not built | not started | not done | not done | see spec |
| BI-012 | - | Report Explorer | [spec](business-intelligence/BI-012-report-explorer.md) | specified | partly via existing screens | not started | not done | not done | see spec |
| BI-013 | - | KPI Dictionary | [spec](business-intelligence/BI-013-kpi-dictionary.md) | specified | built: /bi, /bi/kpis | home and dictionary built | partial | not done | see spec |
| BI-014 | - | Scheduled Insights | [spec](business-intelligence/BI-014-scheduled-insights.md) | specified | partly via existing screens | not started | not done | not done | see spec |
| BI-015 | - | Alerts and Anomalies | [spec](business-intelligence/BI-015-alerts-and-anomalies.md) | specified | partly via existing screens | not started | not done | not done | see spec |
