# 01 Module hierarchy

Two views of the same product: the **code** view (module, route file, feature) and the **navigation** view (menu section, group, tile). Both are facts read from the repository: route files from `apps/api/src/routes`, the menu from `apps/web/lib/menu.tsx`.

## A. Code view [F]

### FIN Accounting and Finance

Books of account, vouchers, bill-wise settlement, period close, year end, planning and working capital. [I: description written for this document]

| Route file | Routes | Features |
|---|---|---|
| `apps/api/src/routes/accountbooks.ts` | 9 | FIN-001 Reports: cash book; FIN-002 Reports: group month; FIN-003 Reports: cash bank expense; FIN-004 Reports: cash flow; FIN-005 Reports: rcm register; FIN-006 Reports: bill adjustments; FIN-007 Reports: integrity; FIN-008 Reports: cfo (+1 more) |
| `apps/api/src/routes/accounting.ts` | 13 | FIN-010 Accounts: groups; FIN-011 Accounts (accounting); FIN-012 Vouchers; FIN-013 Fiscal years (accounting); FIN-014 Reports: trial balance; FIN-015 Reports: profit loss; FIN-016 Reports: balance sheet; FIN-017 Reports: ledger |
| `apps/api/src/routes/billreceipts.ts` | 2 | FIN-018 Bill receipts |
| `apps/api/src/routes/cashflow.ts` | 1 | FIN-019 Reports: cash flow statement |
| `apps/api/src/routes/close.ts` | 9 | FIN-020 Close; FIN-021 Pos: day close; FIN-022 Pos: sessions (close) |
| `apps/api/src/routes/scenarios.ts` | 6 | FIN-023 Scenarios |
| `apps/api/src/routes/stockfinance.ts` | 8 | FIN-024 Finance: stock review; FIN-025 Finance: writedowns; FIN-026 Finance: cost centres; FIN-027 Finance: store results; FIN-028 Finance: allocation rules |
| `apps/api/src/routes/workingcap.ts` | 10 | FIN-029 Finance: credit exposure; FIN-030 Finance: supplier calendar; FIN-031 Finance: cash forecast; FIN-032 Finance: commitments; FIN-033 Finance: drawing power; FIN-034 Finance: cheques |
| `apps/api/src/routes/yearend.ts` | 2 | FIN-035 Reports: year end; FIN-036 Reports: carry forward |

Services used: `accountbooks`, `accounting`, `billreceipts`, `cashflow`, `cfo`, `changes`, `close`, `expensealloc`, `integrity`, `scenarios`, `stockfinance`, `stockmovement`, `workingcap`, `yearend`

### TAX GST, TDS and Statutory Compliance

GST returns, e-invoice, e-way bill, reconciliation, TDS and TCS, MSME and export incentives. [I: description written for this document]

| Route file | Routes | Features |
|---|---|---|
| `apps/api/src/routes/exports.ts` | 10 | TAX-001 Exports |
| `apps/api/src/routes/gst.ts` | 17 | TAX-002 Gst: settings; TAX-003 Print language; TAX-004 Gst: gstr1; TAX-005 Gst: gstr3b; TAX-006 Gst: portal; TAX-007 Gst: filings; TAX-008 GST reports by kind (templated route); TAX-009 Import |
| `apps/api/src/routes/gstjv.ts` | 2 | TAX-010 Gst jv |
| `apps/api/src/routes/gstwork.ts` | 23 | TAX-011 Gst: work |
| `apps/api/src/routes/msme.ts` | 1 | TAX-012 Reports: msme |
| `apps/api/src/routes/tds.ts` | 20 | TAX-013 Tds: section map; TAX-014 Tds: sections; TAX-015 Tds: preview; TAX-016 Tds: deductions; TAX-017 Tds: challans; TAX-018 Tds: 26q; TAX-019 Tds: certificate; TAX-020 Tds: 194q (+1 more) |

Services used: `accounting`, `exports`, `filing`, `gstannual`, `gstjv`, `gstwork`, `importer`, `msme`, `returns`, `slabcheck`, `tcs`, `tds`

### BNK Banking

Bank accounts, statement import, matching and reconciliation, cheques and bank approvals. [I: description written for this document]

| Route file | Routes | Features |
|---|---|---|
| `apps/api/src/routes/banking.ts` | 19 | BNK-001 Banking: accounts; BNK-002 Banking: lines; BNK-003 Banking: rules; BNK-004 Banking: settlements |
| `apps/api/src/routes/recon.ts` | 9 | BNK-005 Recon |

Services used: `banking`, `recon`

### SAL Sales and Wholesale

Quotations, orders, challans, invoices, credit notes, consignment, price lists, commission and transport. [I: description written for this document]

| Route file | Routes | Features |
|---|---|---|
| `apps/api/src/routes/catalogue.ts` | 14 | SAL-001 Styles (catalogue); SAL-002 Style images; SAL-003 Catalogue; SAL-004 Public (catalogue) |
| `apps/api/src/routes/commission.ts` | 10 | SAL-005 Agents; SAL-006 Salesmen; SAL-007 Reports: agent commission; SAL-008 Brokerage bills; SAL-009 Reports: salesman; SAL-010 Reports: salesman year; SAL-011 Sales targets |
| `apps/api/src/routes/consignment.ts` | 8 | SAL-012 Consignees; SAL-013 Reports: consignment sales; SAL-014 Consignment |
| `apps/api/src/routes/deliveryorders.ts` | 5 | SAL-015 Delivery orders |
| `apps/api/src/routes/lr.ts` | 3 | SAL-016 Lr entries |
| `apps/api/src/routes/orderregister.ts` | 1 | SAL-017 Reports: sales order register |
| `apps/api/src/routes/pricelists.ts` | 6 | SAL-018 Price lists; SAL-019 Reports: interest |
| `apps/api/src/routes/sales.ts` | 29 | SAL-020 Quotations; SAL-021 Sales orders; SAL-022 Delivery notes; SAL-023 Approvals; SAL-024 Samples; SAL-025 Sales invoices (sales); SAL-026 Credit notes; SAL-027 E-invoice generate and cancel (invoices and credit notes, templated route) |
| `apps/api/src/routes/salesmancomm.ts` | 5 | SAL-028 Salesman commission |
| `apps/api/src/routes/sharing.ts` | 4 | SAL-029 Sales invoices (sharing); SAL-030 Reminders; SAL-031 Messages; SAL-032 Public (sharing) |

Services used: `accounting`, `catalogue`, `commission`, `consignment`, `deliveryorders`, `lr`, `orderregister`, `returns`, `sales`, `salesmancomm`, `sharing`

### POS Counter, Retail and Service Desk

Point of sale, promotions, loyalty, store prices, approval memos, repairs, tailoring and alterations. [I: description written for this document]

| Route file | Routes | Features |
|---|---|---|
| `apps/api/src/routes/alterations.ts` | 13 | POS-001 Karigars; POS-002 Alteration types; POS-003 Alterations |
| `apps/api/src/routes/approvalmemos.ts` | 5 | POS-004 Approval memos |
| `apps/api/src/routes/branchprices.ts` | 6 | POS-005 Branch prices; POS-006 Pos: branch prices |
| `apps/api/src/routes/dailysales.ts` | 1 | POS-007 Reports: daily sales |
| `apps/api/src/routes/discounts.ts` | 1 | POS-008 Reports: discounts |
| `apps/api/src/routes/loyalty.ts` | 4 | POS-009 Loyalty |
| `apps/api/src/routes/pos.ts` | 27 | POS-010 Schemes; POS-011 Pos: schemes; POS-012 Pos: settings; POS-013 Pos: terminals; POS-014 Pos: sessions (pos); POS-015 Pos: bills; POS-016 Pos: returns; POS-017 Pos: summary (+4 more) |
| `apps/api/src/routes/repairs.ts` | 10 | POS-022 Repairs; POS-023 Inquiries; POS-024 Reports: service customers |
| `apps/api/src/routes/tailoring.ts` | 12 | POS-025 Measurements; POS-026 Tailoring rates; POS-027 Tailoring orders |
| `apps/api/src/routes/vouchers.ts` | 13 | POS-028 Gift vouchers; POS-029 Coupons; POS-030 Discount cards; POS-031 Pos: promo; POS-032 Lucky draws |

Services used: `accounting`, `alterations`, `approvalmemos`, `branchprices`, `dailysales`, `discounts`, `loyalty`, `pos`, `repairs`, `schemes`, `sharing`, `tailoring`, `vouchers`

### PUR Purchasing

Purchase orders, inward challans (goods receipts), purchase bills and returns, bill reading. [I: description written for this document]

| Route file | Routes | Features |
|---|---|---|
| `apps/api/src/routes/purchasing.ts` | 18 | PUR-001 Purchase orders; PUR-002 Goods receipts; PUR-003 Items (purchasing); PUR-004 Purchase bills (purchasing); PUR-005 Purchase returns; PUR-006 Reports: supplier claims |

Services used: `purchasing`

### INV Inventory and Masters of Stock

Items, styles, stock, transfers, counts, serials, losses, labels, rate and margin controls. [I: description written for this document]

| Route file | Routes | Features |
|---|---|---|
| `apps/api/src/routes/distribution.ts` | 3 | INV-001 Reports: branch comparison; INV-002 Allocations |
| `apps/api/src/routes/hsn.ts` | 4 | INV-003 Hsn |
| `apps/api/src/routes/inventory.ts` | 20 | INV-004 Inventory: setup; INV-005 Inventory: valuation method; INV-006 Warehouses; INV-007 Items (inventory); INV-008 Stock journals; INV-009 Reports: stock summary; INV-010 Reports: item ledger; INV-011 Reports: reorder |
| `apps/api/src/routes/lookups.ts` | 4 | INV-012 Lookups |
| `apps/api/src/routes/losses.ts` | 6 | INV-013 Stock losses; INV-014 Reports: stock losses |
| `apps/api/src/routes/marginbands.ts` | 3 | INV-015 Margin bands |
| `apps/api/src/routes/merge.ts` | 2 | INV-016 Accounts (merge); INV-017 Items (merge) |
| `apps/api/src/routes/rateupdate.ts` | 4 | INV-018 Inventory: rate update |
| `apps/api/src/routes/relabel.ts` | 3 | INV-019 Relabels |
| `apps/api/src/routes/serials.ts` | 5 | INV-020 Items (serials); INV-021 Serials |
| `apps/api/src/routes/stockcount.ts` | 13 | INV-022 Stock counts; INV-023 Reports: stock audit |
| `apps/api/src/routes/stocklimits.ts` | 2 | INV-024 Stock limits |
| `apps/api/src/routes/stockreset.ts` | 2 | INV-025 Inventory: reset stock; INV-026 Reports: stock posting check |
| `apps/api/src/routes/styles.ts` | 13 | INV-027 Size scales; INV-028 Colors; INV-029 Styles (styles) |
| `apps/api/src/routes/transfers.ts` | 6 | INV-030 Stock transfers |

Services used: `accounting`, `barcodes`, `distribution`, `hsn`, `inventory`, `lookups`, `losses`, `marginbands`, `merge`, `rateupdate`, `relabel`, `serials`, `stockcount`, `stocklimits`, `stockreset`, `styles`, `transfers`

### MFG Manufacturing and Job Work

Bills of material, production, work centres and job work challans. [I: description written for this document]

| Route file | Routes | Features |
|---|---|---|
| `apps/api/src/routes/manufacturing.ts` | 22 | MFG-001 Work centres; MFG-002 Boms; MFG-003 Production orders; MFG-004 Mrp; MFG-005 Job work |

Services used: `jobwork`, `manufacturing`

### HR People, Attendance and Payroll

Employees, leave, attendance, devices, payroll, statutory payments, loans and settlements. [I: description written for this document]

| Route file | Routes | Features |
|---|---|---|
| `apps/api/src/routes/hr.ts` | 69 | HR-001 Employees; HR-002 Holidays; HR-003 Attendance (hr); HR-004 Hr: week off changes; HR-005 Leave types; HR-006 Leave requests; HR-007 Payroll; HR-008 Payroll runs (+10 more) |
| `apps/api/src/routes/iclock.ts` | 10 | HR-019 Iclock; HR-020 Attendance (iclock) |

Services used: `accounting`, `attendancealerts`, `devicepunch`, `hr`, `payroll`, `statutory`

### EXP Expenses

Expense claims, categories, approval, travel and reimbursement. [I: description written for this document]

| Route file | Routes | Features |
|---|---|---|
| `apps/api/src/routes/expenses.ts` | 18 | EXP-001 Files; EXP-002 Expenses; EXP-003 Reports: travel claims |

Services used: `expenses`, `files`

### PRJ Projects and Timesheets

Projects, tasks, milestones, members and timesheets. [I: description written for this document]

| Route file | Routes | Features |
|---|---|---|
| `apps/api/src/routes/projects.ts` | 19 | PRJ-001 Projects; PRJ-002 Timesheets |

Services used: `projects`

### CRM CRM and Communications

Leads, activities, message templates, the outbox, consent, reminders and provider webhooks. [I: description written for this document]

| Route file | Routes | Features |
|---|---|---|
| `apps/api/src/routes/comms.ts` | 16 | CRM-001 Comms: meta; CRM-002 Comms: templates; CRM-003 Comms: settings; CRM-004 Comms: reminders; CRM-005 Comms: consents; CRM-006 Comms: opt out; CRM-007 Comms: send; CRM-008 Comms: queue (+5 more) |
| `apps/api/src/routes/commwebhooks.ts` | 3 | CRM-014 Webhooks |
| `apps/api/src/routes/crm.ts` | 17 | CRM-015 Crm: leads; CRM-016 Crm: pipeline; CRM-017 Crm: activities; CRM-018 Crm: templates; CRM-019 Crm: messaging; CRM-020 Crm: messages; CRM-021 Crm: customers |

Services used: `commreminders`, `comms`, `commwebhooks`, `crm`

### AST Fixed Assets

Asset classes, register, depreciation and disposal. [I: description written for this document]

| Route file | Routes | Features |
|---|---|---|
| `apps/api/src/routes/assets.ts` | 14 | AST-001 Assets |

Services used: `assets`

### RPT Reports and Analytics

Dashboards, the report builder, profitability, retail reports and insights. [I: description written for this document]

| Route file | Routes | Features |
|---|---|---|
| `apps/api/src/routes/insights.ts` | 17 | RPT-001 Analytics; RPT-002 Reports: colour size; RPT-003 Reports: stock ageing; RPT-004 Reports: sales register; RPT-005 Reports: builder; RPT-006 Reports: saved; RPT-007 Assistant; RPT-008 Purchase bills (insights) |
| `apps/api/src/routes/profitability.ts` | 1 | RPT-009 Reports: profitability |
| `apps/api/src/routes/retailreports.ts` | 7 | RPT-010 Reports: register; RPT-011 Reports: year comparison; RPT-012 Reports: sales vs purchases; RPT-013 Reports: profit by; RPT-014 Reports: stock ratios; RPT-015 Reports: vendor analysis; RPT-016 Reports: purchase backlog |

Services used: `analytics`, `assistant`, `billreader`, `insights`, `ownerreports`, `profitability`, `reportbuilder`, `retailreports`

### AI Assistant, Chat and Notes

The business assistant, in-app chat and personal notes. [I: description written for this document]

| Route file | Routes | Features |
|---|---|---|
| `apps/api/src/routes/chat.ts` | 4 | AI-001 Chat |
| `apps/api/src/routes/notes.ts` | 4 | AI-002 Notes |

Services used: `chat`

### SEC Security, Settings and Administration

Sign-in, team, roles, devices, company setup, locks, dated changes, backups, audit and controls. [I: description written for this document]

| Route file | Routes | Features |
|---|---|---|
| `apps/api/src/routes/auth.ts` | 13 | SEC-001 Auth: signup; SEC-002 Auth: login; SEC-003 Auth: logout; SEC-004 Auth: me; SEC-005 Me: menu; SEC-006 Auth: switch; SEC-007 Auth: unlock; SEC-008 Auth: step up (+1 more) |
| `apps/api/src/routes/backups.ts` | 3 | SEC-010 Backups |
| `apps/api/src/routes/changes.ts` | 4 | SEC-011 Settings: approvals; SEC-012 Change requests |
| `apps/api/src/routes/company.ts` | 15 | SEC-013 Companies; SEC-014 Branches; SEC-015 Fiscal years (company); SEC-016 Number series; SEC-017 Audit log; SEC-018 Export |
| `apps/api/src/routes/controls.ts` | 8 | SEC-019 Controls; SEC-020 Accounts (controls) |
| `apps/api/src/routes/cron.ts` | 7 | SEC-021 Cron |
| `apps/api/src/routes/processlocks.ts` | 2 | SEC-022 Settings: process locks |
| `apps/api/src/routes/scheduledchanges.ts` | 4 | SEC-023 Config |
| `apps/api/src/routes/team.ts` | 13 | SEC-024 Members; SEC-025 Invitations; SEC-026 Roles; SEC-027 Tenants |
| `apps/api/src/routes/tools.ts` | 3 | SEC-028 Meta; SEC-029 Tools |
| `apps/api/src/routes/useractivity.ts` | 1 | SEC-030 Reports: user activity |

Services used: `auditchain`, `backups`, `changes`, `commreminders`, `comms`, `consignment`, `controls`, `export`, `onboarding`, `processlocks`, `reportbuilder`, `restore`, `scheduledchanges`, `sensitive`, `useractivity`

### SYN Offline Sync

Device registration, push and pull, offline rules and refused-operation queue. [I: description written for this document]

| Route file | Routes | Features |
|---|---|---|
| `apps/api/src/routes/offline.ts` | 1 | SYN-001 Sync: offline rules |
| `apps/api/src/routes/sync.ts` | 8 | SYN-002 Sync: status; SYN-003 Sync: rejections; SYN-004 Devices; SYN-005 Sync: pull; SYN-006 Sync: push |

Services used: `accounting`


## B. Navigation view [F]

The sidebar launcher has 7 sections (letters in brackets are the keyboard shortcuts) and 262 tiles. A tile with no link is shown as "Soon".

### Masters [M] (63 tiles, 3 Soon)

**Account**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| Account Master | `/accounts/chart` | accounts.view | FIN-010, FIN-011, SEC-004 (+3 more) |
| Bank Master | `/banking` | banking.view | BNK-001 |
| Opening Balance | `/accounts/chart` | accounts.view | FIN-010, FIN-011, SEC-004 (+3 more) |
| Balance Sheet Group | `/accounts/chart` | accounts.view | FIN-010, FIN-011, SEC-004 (+3 more) |
| Account Group | `/accounts/chart` | accounts.view | FIN-010, FIN-011, SEC-004 (+3 more) |
| Account Category | `/masters/lists/accountCategory` | sales.view |  |
| Transporter Master | `/masters/lists/transporterMaster` | sales.view |  |
| Region Master | `/masters/lists/regionMaster` | sales.view |  |
| Customer Sub Category | `/masters/lists/customerSubCategory` | sales.view |  |
| Remarks Master | `/masters/lists/remarksMaster` | sales.view |  |
| Company Master | `/settings/company` | company.view | SEC-004, SEC-013 |
| Country Master | `/masters/lists/countryMaster` | sales.view |  |
| nav.priceLists | `/sales/price-lists` | sales.view | FIN-010, FIN-011, SEC-004 (+4 more) |
| nav.assetRegister | `/assets` | assets.view | AST-001, SEC-004 |
| nav.expenseCategories | `/settings/expenses` | expenses.view | SEC-004, EXP-001, EXP-002 |

**Stock**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| Department Master | `/masters/lists/departmentMaster` | inventory.view |  |
| Manufacture Company | `/masters/lists/manufactureCompany` | inventory.view |  |
| Brand Master | `/masters/lists/brandMaster` | inventory.view |  |
| Product Master | `/masters/lists/productMaster` | inventory.view |  |
| Style Master | `/inventory/styles` | inventory.view | FIN-010, FIN-011, SEC-004 (+10 more) |
| Item Group | `/masters/lists/itemGroup` | inventory.view |  |
| Item Master | `/inventory/items` | inventory.view | FIN-010, FIN-011, SEC-004 (+5 more) |
| Design Master | `/inventory/styles` | inventory.view | FIN-010, FIN-011, SEC-004 (+10 more) |
| Color Master | `/inventory/styles/setup` | inventory.view | SEC-004, SAL-001, SAL-002 (+5 more) |
| Size Group Master | `/inventory/styles/setup` | inventory.view | SEC-004, SAL-001, SAL-002 (+5 more) |
| Size Master | `/inventory/styles/setup` | inventory.view | SEC-004, SAL-001, SAL-002 (+5 more) |
| Fabric | `/masters/lists/fabric` | inventory.view |  |
| Sleeves | `/masters/lists/sleeves` | inventory.view |  |
| Neck | `/masters/lists/neck` | inventory.view |  |
| Fit | `/masters/lists/fit` | inventory.view |  |
| Season | `/masters/lists/season` | inventory.view |  |
| Style | `/masters/lists/styleAttr` | inventory.view |  |
| Gender | `/masters/lists/gender` | inventory.view |  |
| Type Master | `/masters/lists/typeMaster` | inventory.view |  |
| Sub Category 9 | `/masters/lists/subCategory9` | inventory.view |  |
| Sub Category 10 | `/masters/lists/subCategory10` | inventory.view |  |
| Material Master | `/masters/lists/materialMaster` | inventory.view |  |
| Fixed Barcode | Soon (no screen) | - |  |
| Min Max Stock Define | `/inventory/stock-limits` | inventory.view | FIN-010, FIN-011, SEC-004 (+4 more) |
| Opening Stock | `/inventory/journals/new` | inventory.create | FIN-010, FIN-011, SEC-013 (+4 more) |
| Season Master | `/masters/lists/seasonMaster` | inventory.view |  |
| Process Master | `/masters/lists/processMaster` | inventory.view |  |
| Order Type | `/masters/lists/orderType` | sales.view |  |
| nav.boms | `/manufacturing/boms` | inventory.view | SEC-004, MFG-001, MFG-002 |
| Godowns and Stores | `/settings/inventory` | inventory.view | FIN-010, FIN-011, SEC-004 (+5 more) |

**Parameters**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| DayBook Master | `/settings/number-series` | settings.view | SEC-004, SEC-016 |
| Ledger Parameter | Soon (no screen) | - |  |
| Salesman Master | `/hr/employees` | hr.view | SEC-004, HR-001 |
| Tax Master | `/settings/gst` | gst.view | SEC-004, TAX-002 |
| TDS Master | `/accounts/tds` | accounts.view | FIN-010, FIN-011, SEC-004 (+11 more) |
| TCS Tax Master | Soon (no screen) | - |  |
| Finance Year Master | `/settings/financial-years` | company.view | FIN-013, SEC-004, SEC-015 |
| HSN Code Master | `/masters/hsn` | inventory.view | SEC-004, INV-003 |
| Sales Return Reason | `/masters/lists/salesReturnReason` | sales.view |  |
| nav.posSettings | `/settings/pos` | sales.view | FIN-010, FIN-011, SEC-004 (+14 more) |
| nav.messageTemplates | `/crm/templates` | crm.view | SEC-004, CRM-015, CRM-017 (+4 more) |

**Promotion Master**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| Salesman Comm Target | `/sales/targets` | sales.view | SEC-004, SAL-006, SAL-009 (+2 more) |
| Commission Rules | `/sales/commission-rules` | payroll.view | FIN-010, FIN-011, SEC-004 (+4 more) |
| Item Discount SetUp | `/pos/schemes` | sales.view | FIN-010, FIN-011, SEC-004 (+5 more) |
| Promo Master | `/pos/vouchers` | sales.view | SEC-004, POS-028, POS-029 (+2 more) |
| SIS Setup | `/sales/consignment` | sales.view | FIN-010, FIN-011, SEC-004 (+5 more) |
| Item Commission SetUp | `/sales/commission` | sales.view | SEC-004, SAL-007, SAL-008 |
| Source Master | `/masters/lists/sourceMaster` | sales.view |  |

### Transaction [T] (58 tiles, 2 Soon)

**Sales Transaction**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| Sales Order (Wh) | `/sales/orders` | sales.view | SEC-004 |
| WhSales Order Cancel | `/sales/orders` | sales.view | SEC-004 |
| Delivery Order (D.O) | `/sales/delivery-orders` | sales.view | SEC-004, SAL-015 |
| Delivery Challan | `/sales/deliveries` | sales.view | SEC-004 |
| Sales Bill (Wh) | `/sales/invoices` | sales.view | SEC-004 |
| Delivery Challan Return (Wh) | `/sales/deliveries` | sales.view | SEC-004 |
| Credit Note (Wh) | `/sales/credit-notes` | sales.view | SEC-004 |
| Advance Receipt | `/accounts/vouchers/new?type=receipt` | accounts.create | FIN-010, FIN-011, FIN-012 (+3 more) |
| nav.posBilling | `/pos/billing` | sales.create | POS-004, SEC-004, POS-006 (+12 more) |
| nav.posBills | `/pos/bills` | sales.view | SEC-004, POS-015, POS-017 (+2 more) |
| nav.posReturns | `/pos/returns` | sales.view | SEC-004, POS-006, SAL-001 (+8 more) |
| nav.proformas | `/sales/proformas` | sales.view | SEC-004 |
| nav.approvals | `/sales/approvals` | sales.view | SEC-004, SAL-023 |
| nav.alterations | `/pos/alterations` | sales.view | POS-001, POS-002, POS-003 (+10 more) |
| nav.tailoring | `/pos/tailoring` | sales.view | FIN-010, FIN-011, POS-001 (+17 more) |

**Accounting Transaction**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| Cash Pay/Rec | `/accounts/vouchers/new?type=receipt` | accounts.create | FIN-010, FIN-011, FIN-012 (+3 more) |
| Bank Pay/Rec | `/accounts/vouchers/new?type=payment` | accounts.create | FIN-010, FIN-011, FIN-012 (+3 more) |
| Bill Wise Receipt | `/accounts/bill-receipt` | accounts.create | FIN-010, FIN-011, FIN-018 (+3 more) |
| Card Receipt | `/banking/settlements` | banking.view | SEC-004, BNK-001, BNK-002 (+1 more) |
| Journal Voucher | `/accounts/vouchers/new?type=journal` | accounts.create | FIN-010, FIN-011, FIN-012 (+3 more) |
| Contra Voucher | `/accounts/vouchers/new?type=contra` | accounts.create | FIN-010, FIN-011, FIN-012 (+3 more) |
| nav.vouchers | `/accounts/vouchers` | accounts.view | FIN-012, SEC-004 |
| nav.expenseClaims | `/expenses` | expenses.view | SEC-004, EXP-002 |
| Travel claims | `/expenses/travel` | expenses.view | EXP-003 |

**Purchase Transaction**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| Purchase Order | `/purchase/orders` | purchase.view | SEC-004 |
| Inward Challan | `/purchase/receipts` | purchase.view | SEC-004 |
| Receiving and inspection | `/purchase/receiving` | purchase.view | SEC-004, PUR-002, PUR-006 |
| Purchase | `/purchase/bills` | purchase.view | SEC-004 |
| Goods Return | `/purchase/returns` | purchase.view | SEC-004 |
| Debit Note | `/purchase/returns` | purchase.view | SEC-004 |
| GST JV | `/accounts/gst-jv` | accounts.create | FIN-010, FIN-011, SAL-005 (+3 more) |

**Jobwork Transaction**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| Job Issue | `/manufacturing/job-work` | inventory.view | FIN-010, FIN-011, SEC-004 (+4 more) |
| Job Receipt | `/manufacturing/job-work` | inventory.view | FIN-010, FIN-011, SEC-004 (+4 more) |
| JobWork Issue | `/manufacturing/job-work` | inventory.view | FIN-010, FIN-011, SEC-004 (+4 more) |
| JobWork Receipt | `/manufacturing/job-work` | inventory.view | FIN-010, FIN-011, SEC-004 (+4 more) |
| nav.production | `/manufacturing/orders` | inventory.view | SEC-004, MFG-003 |
| nav.mrp | `/manufacturing/mrp` | inventory.view | FIN-010, FIN-011, SEC-004 (+4 more) |

**Other Transaction**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| Stock Adjustment | `/inventory/journals` | inventory.view | SEC-004, INV-008 |
| Stock Transfer | `/inventory/transfers` | inventory.view | SEC-004, INV-030 |
| Branches and share-out | `/inventory/distribution` | inventory.view | FIN-010, FIN-011, SEC-004 (+5 more) |
| Mark-up bands | `/inventory/margin-bands` | inventory.view | SEC-004, INV-015 |
| Re-labelling | `/inventory/relabel` | inventory.view | FIN-010, FIN-011, SEC-013 (+3 more) |
| Inquiry log | `/sales/inquiries` | sales.view | SEC-004, POS-023 |
| Shop-in-shop sales | `/reports/consignment-sales` | sales.view | SAL-013 |
| Repair and tailoring customers | `/sales/service-customers` | sales.view | POS-024 |
| Sample Issue | `/sales/deliveries/new?reason=sample` | sales.create | FIN-010, FIN-011, SEC-013 (+5 more) |
| Sample Receive | `/sales/samples` | sales.view | SEC-004, SAL-024 |
| Service Desk | `/sales/repairs` | sales.view | SEC-004, POS-022 |
| Quotation | `/sales/quotations` | sales.view | SEC-004 |
| LR/Transport Entry | `/sales/lr` | sales.view | SEC-004, INV-012, SAL-025 |
| E-Way Bill | `/sales/invoices` | sales.view | SEC-004 |
| RePacking Box | Soon (no screen) | - |  |
| ReOpen Box | Soon (no screen) | - |  |
| nav.stockCounts | `/inventory/counts` | inventory.view | FIN-010, FIN-011, SEC-004 (+4 more) |
| Stock audit report | `/inventory/counts/audit` | inventory.view | INV-023 |
| Lock by document kind | `/settings/process-locks` | settings.view | SEC-004, SEC-022 |
| nav.projectList | `/projects` | projects.view | SEC-004, PRJ-001 |
| nav.timesheets | `/projects/timesheets` | projects.view | SEC-004, PRJ-001, PRJ-002 |

### Reports [R] (15 tiles, 0 Soon)

**Sales Reports**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| nav.salesRegister | `/reports/sales-register` | reports.view | RPT-004 |
| nav.colourSize | `/reports/colour-size` | reports.view | FIN-010, FIN-011, SEC-013 (+3 more) |
| nav.insights | `/insights` | reports.view | RPT-001 |
| nav.cfoView | `/reports/cfo` | reports.view | FIN-008 |
| nav.dashboard | `/dashboard` | - | SEC-004, SEC-013, RPT-001 |

**Stock Reports**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| nav.stock | `/inventory/stock` | inventory.view | FIN-010, FIN-011, SEC-013 (+4 more) |
| nav.stockAgeing | `/reports/stock-ageing` | reports.view | RPT-003 |
| Registers and ratios | `/reports/registers` | reports.view | RPT-010, RPT-011, RPT-012 (+4 more) |
| nav.stockMovement | `/reports/stock-movement` | reports.view | FIN-009 |
| nav.catalogue | `/inventory/catalogue` | inventory.view | FIN-010, FIN-011, SEC-004 (+4 more) |

**Custom Reports and Checks**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| nav.reportsHub | `/reports` | reports.view | SEC-004 |
| nav.reportBuilder | `/reports/builder` | - | RPT-005, RPT-006 |
| nav.savedReports | `/reports/saved` | reports.view | SEC-004, RPT-005, RPT-006 |
| nav.checks | `/reports/checks` | reports.view | RPT-001 |
| nav.integrity | `/reports/integrity` | reports.view | FIN-007 |

### Account Reports [E] (40 tiles, 1 Soon)

**Account Reports Group**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| Ledger Report | `/accounts/chart` | accounts.view | FIN-010, FIN-011, SEC-004 (+3 more) |
| Daily Sales | `/reports/daily-sales` | reports.view | POS-007 |
| Discount Register | `/reports/discounts` | reports.view | POS-008 |
| Sales Order Register | `/reports/sales-order-register` | sales.view | SAL-017 |
| Cash Book Report | `/reports/books?view=cash` | reports.view | FIN-001, FIN-002, FIN-003 (+8 more) |
| Bank Report | `/reports/books?view=bank` | reports.view | FIN-001, FIN-002, FIN-003 (+8 more) |
| Bank Reconciliation | `/banking` | banking.view | BNK-001 |
| Group/Month Summary | `/reports/books?view=group` | reports.view | FIN-001, FIN-002, FIN-003 (+8 more) |
| Cash Bank Expense | `/reports/books?view=expense` | reports.view | FIN-001, FIN-002, FIN-003 (+8 more) |
| Cash Flow Report Group | `/reports/books?view=flow` | reports.view | FIN-001, FIN-002, FIN-003 (+8 more) |
| Bill To Bill Adjustment | `/reports/books?view=adjust` | reports.view | FIN-001, FIN-002, FIN-003 (+8 more) |
| Reconciliation | `/accounts/reconciliation` | accounts.view | FIN-010, FIN-011, SEC-004 (+5 more) |
| MSME Report | `/reports/msme` | accounts.view | TAX-012 |
| nav.trialBalance | `/reports/trial-balance` | reports.view | FIN-014 |

**Final Report Group**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| OutStanding Payable | `/reports/payables` | reports.view | SEC-004, SAL-030 |
| OutStanding Receivable | `/reports/receivables` | reports.view | SEC-004, SAL-030 |
| Debtors List | `/reports/receivables` | reports.view | SEC-004, SAL-030 |
| Creditor List | `/reports/payables` | reports.view | SEC-004, SAL-030 |
| Interest Report | `/reports/interest` | reports.view | SAL-019 |
| Depreciation Asset Report | `/assets/depreciation` | assets.view | AST-001, SEC-004 |
| Journal Voucher Report | `/accounts/vouchers` | accounts.view | FIN-012, SEC-004 |
| GST Report | `/gst/returns` | gst.view | SEC-004, TAX-004, TAX-005 (+2 more) |
| GST Workspace | `/gst/workspace` | gst.view | SEC-004, TAX-011 |
| GST slab exceptions | `/gst/slab-exceptions` | gst.view | TAX-011 |
| GST compliance | `/gst/compliance` | gst.view | FIN-010, FIN-011, SEC-004 (+1 more) |
| Store results | `/reports/store-results` | reports.view | SEC-004, FIN-027, FIN-028 |
| Store prices | `/inventory/branch-prices` | sales.view | FIN-010, FIN-011, SEC-004 (+4 more) |
| Serial numbers | `/inventory/serials` | inventory.view | FIN-010, FIN-011, SEC-004 (+4 more) |
| Goods on approval | `/sales/approval-memos` | sales.view | FIN-010, FIN-011, POS-004 (+4 more) |
| Exports | `/gst/exports` | gst.view | SEC-004, TAX-001 |
| Working Capital | `/accounts/working-capital` | reports.view | FIN-010, FIN-011, SEC-004 (+9 more) |
| What-if planning | `/accounts/scenarios` | reports.view | FIN-023 |
| TDS Report | `/accounts/tds` | accounts.view | FIN-010, FIN-011, SEC-004 (+11 more) |
| TDS Form26Q | `/accounts/tds` | reports.view | FIN-010, FIN-011, SEC-004 (+11 more) |
| Final Report | `/reports/profit-loss` | reports.view | FIN-015 |
| Profitability | `/reports/profitability` | reports.view | RPT-009 |
| nav.balanceSheet | `/reports/balance-sheet` | reports.view | FIN-016 |
| RCM Register | `/reports/books?view=rcm` | reports.view | FIN-001, FIN-002, FIN-003 (+8 more) |
| TCS Report | Soon (no screen) | - |  |
| nav.itDepreciation | `/assets/income-tax` | assets.view | AST-001, SEC-004 |

### Payroll [Y] (31 tiles, 7 Soon)

**Master Group**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| Employee | `/hr/employees` | hr.view | SEC-004, HR-001 |
| Employee KYC Update | `/hr/documents` | hr.view | HR-013 |
| Salary Deduction | Soon (no screen) | - |  |
| Week Off | Soon (no screen) | - |  |
| Week Off Cancel | Soon (no screen) | - |  |
| Holidays | `/hr/attendance` | hr.view | SEC-004, TAX-009, HR-002 (+2 more) |
| Designation | `/masters/lists/designation` | hr.view |  |
| Department | `/masters/lists/employeeDepartment` | hr.view |  |
| Shift Master | `/hr/attendance` | hr.view | SEC-004, TAX-009, HR-002 (+2 more) |

**Payroll Transaction Group**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| Daily Attendance | `/hr/attendance` | hr.view | SEC-004, TAX-009, HR-002 (+2 more) |
| Leave Application | `/hr/leave` | hr.view | SEC-004, HR-001, HR-005 (+1 more) |
| Advance Salary (Upad) | `/hr/employees` | hr.view | SEC-004, HR-001 |
| Loan Issue | `/hr/employees` | hr.view | SEC-004, HR-001 |
| Loan Receipt | `/hr/employees` | payroll.create | SEC-004, HR-001 |
| Monthly Salary | `/hr/payroll` | payroll.view | SEC-004, HR-008 |
| Stipend | Soon (no screen) | - |  |
| Salary Payment | `/hr/payroll` | payroll.view | SEC-004, HR-008 |
| Stipend Payment | `/hr/stipends` | payroll.view | FIN-010, FIN-011, SEC-004 (+5 more) |
| Absent and Late | `/hr/attendance-alerts` | hr.view | HR-010 |
| Attendance Machines | `/hr/attendance-devices` | hr.view | SEC-004, HR-020 |
| Incentive | Soon (no screen) | - |  |
| Other Deduction | Soon (no screen) | - |  |
| Advance And Loan Request | `/hr/loan-requests` | payroll.view | FIN-010, FIN-011, SEC-004 (+5 more) |

**Report Group**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| Monthly Attendance Register | `/hr/attendance` | hr.view | SEC-004, TAX-009, HR-002 (+2 more) |
| Day Wise Attendance Register | `/hr/attendance` | hr.view | SEC-004, TAX-009, HR-002 (+2 more) |
| SalarySlip Register Report | `/hr/payroll` | payroll.view | SEC-004, HR-008 |
| PT Report | `/hr/statutory` | payroll.view | FIN-010, FIN-011, SEC-004 (+6 more) |
| Leave Report | `/hr/leave` | hr.view | SEC-004, HR-001, HR-005 (+1 more) |
| Menu Log Session Report | Soon (no screen) | - |  |

**Utility Group**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| PayRoll Parameter | `/settings/payroll` | payroll.view | SEC-004, HR-007, HR-016 |
| Device Settings | `/hr/attendance` | hr.view | SEC-004, TAX-009, HR-002 (+2 more) |

### Utility [U] (49 tiles, 10 Soon)

**Barcode Group**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| Barcode Print | `/inventory/labels` | inventory.view | SEC-013, INV-007, INV-029 |
| Barcode Search | `/inventory/barcode-search` | inventory.view | FIN-010, FIN-011, SEC-013 (+2 more) |
| Barcode/Design Image | `/inventory/catalogue` | inventory.view | FIN-010, FIN-011, SEC-004 (+4 more) |
| Rate Updation | `/inventory/rate-update` | inventory.edit | SEC-004, INV-018, INV-029 |
| Image Catalogue | `/inventory/catalogue` | inventory.view | FIN-010, FIN-011, SEC-004 (+4 more) |
| Sales Discount Master | `/pos/schemes` | sales.view | FIN-010, FIN-011, SEC-004 (+5 more) |
| Loyalty Members | `/pos/loyalty` | sales.view | SEC-004, POS-009 |
| Sales Discount Design Wise | `/pos/schemes` | sales.view | FIN-010, FIN-011, SEC-004 (+5 more) |
| Salesman Commission | `/sales/commission` | sales.view | SEC-004, SAL-007, SAL-008 |
| Day Close | `/accounts/close` | reports.view | SEC-004, FIN-020, FIN-021 (+2 more) |
| Month-End Close | `/accounts/close` | reports.view | SEC-004, FIN-020, FIN-021 (+2 more) |

**Extra Utility**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| SMS | `/crm/communications` | crm.view | SEC-004, CRM-001, CRM-002 (+6 more) |
| Email | `/crm/communications` | crm.view | SEC-004, CRM-001, CRM-002 (+6 more) |
| Bulk Messenger | `/crm/messages` | crm.view | CRM-019 |
| Log History Report | `/settings/audit-log` | settings.view | SEC-017 |
| Out Standing Adj | Soon (no screen) | - |  |
| Reset Physical Stock | `/inventory/reset-stock` | inventory.approve | INV-004, INV-025, INV-029 |
| Stock posting check | `/reports/stock-posting-check` | reports.view | INV-026 |
| Stock Losses | `/inventory/losses` | inventory.view | FIN-010, FIN-011, SEC-004 (+6 more) |
| Stock Finance | `/inventory/stock-finance` | inventory.view | SEC-004, FIN-024, FIN-025 (+1 more) |
| Physical Stock Verification | `/inventory/counts` | inventory.view | FIN-010, FIN-011, SEC-004 (+4 more) |
| Merge | `/masters/merge` | accounts.edit | FIN-010, FIN-011, SEC-004 (+5 more) |
| Sales Stock Ledger Diff | Soon (no screen) | - |  |
| Note Report | Soon (no screen) | - |  |
| E-Invoice Upload | `/sales/invoices` | sales.view | SEC-004 |
| E-WayBill Upload | `/sales/invoices` | sales.view | SEC-004 |
| Auto Outstanding Reminder | `/reports/receivables` | reports.view | SEC-004, SAL-030 |

**User Management**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| Users | `/settings/team` | users.view | FIN-010, FIN-011, SEC-004 (+6 more) |
| User Group | `/settings/team` | users.view | FIN-010, FIN-011, SEC-004 (+6 more) |
| Current Date Setting | Soon (no screen) | - |  |
| Sensitive changes | `/settings/sensitive-changes` | settings.view | SEC-017 |
| Dated Changes | `/settings/dated-changes` | settings.view | FIN-010, FIN-011, SEC-004 (+6 more) |
| Internal Controls | `/settings/controls` | users.view | FIN-010, FIN-011, SEC-004 (+5 more) |
| Approvals | `/settings/approvals` | settings.view | SEC-004, SEC-011, SEC-012 |
| User Activity | `/reports/user-activity` | settings.view | SEC-030 |
| Data Lock Till Date | `/settings/financial-years` | company.view | FIN-013, SEC-004, SEC-015 |
| My Devices | `/settings/devices` | users.view | SEC-004, SYN-002, SYN-003 (+1 more) |

**Software Utility**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| Ledger And Stock Posting | Soon (no screen) | - |  |
| Report Type | Soon (no screen) | - |  |
| User Parameter | `/account` | - | SEC-004, SEC-009 |
| Balance Transfer | `/reports/year-end` | reports.view | FIN-035, FIN-036 |
| Year-End Check | `/reports/year-end` | reports.view | FIN-035, FIN-036 |
| Database Backup | `/settings/backup` | company.export | SEC-004, SEC-010, SEC-018 |
| Software Update | Soon (no screen) | - |  |
| DB Updates | Soon (no screen) | - |  |
| Schedule Backup | Soon (no screen) | - |  |
| Export Vouchers to PDF | Soon (no screen) | - |  |
| nav.import | `/settings/import` | accounts.create | TAX-009 |
| nav.allActions | `/launcher` | - | SEC-004, SEC-005 |

### Chat [Q] (6 tiles, 0 Soon)

**Chat and Customers**

| Tile | Opens | Permission | Features behind it |
|---|---|---|---|
| nav.assistant | `/assistant` | - | RPT-007 |
| Chat | `/chat` | - | AI-001 |
| nav.messageLog | `/crm/messages` | crm.view | CRM-019 |
| Communication centre | `/crm/communications` | crm.view | SEC-004, CRM-001, CRM-002 (+6 more) |
| nav.leads | `/crm/leads` | crm.view | SEC-004, CRM-015, CRM-016 |
| nav.followUps | `/crm/activities` | crm.view | CRM-015, CRM-017, CRM-020 (+1 more) |
