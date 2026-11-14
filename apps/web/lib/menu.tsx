import {
  Activity, PackageX, Fingerprint, ArrowDownToLine, ArrowLeftRight, Banknote, BarChart3, Barcode, BookOpen, Boxes, Briefcase, Building2, CalendarCheck, CalendarClock, CalendarDays, CalendarOff,
  CalendarRange, CalendarX, ClipboardCheck, ClipboardList, Coins, Contact, CreditCard, Database, DatabaseBackup, Download, Factory, FileBadge, FileCheck2, FileClock,
  FileSpreadsheet, FileText, Filter, FolderKanban, Gift, Globe, Hammer, HandCoins, Handshake, Hash, Hourglass, IdCard, Images, IndianRupee, Landmark, Layers, LayoutDashboard,
  LayoutGrid, ListChecks, ListTree, Lock, Mail, MapPin, Merge, MessageSquareText, MessagesSquare, Monitor, NotebookPen, Package, PackageCheck, PackageOpen, Palette,
  Percent, PhoneCall, Plane, Printer, Receipt, ReceiptText, RefreshCcw, Repeat, RotateCcw, Ruler, Scale, ScanBarcode, ScanSearch, Scissors, ScrollText, Send, Settings2,
  Shirt, ShieldAlert, ShieldCheck, Wrench, ShoppingCart, Smartphone, Sparkles, Store, Table2, Tag, Tags, Target, TicketPercent, Timer, TrendingDown, TrendingUp, Truck, Undo2, Upload, UserCog,
  UserPlus, Users, Wallet, Warehouse, Gauge, Rabbit,
} from "lucide-react";

type Icon = typeof Package;
/**
 * One menu entry. `href` opens an existing screen; without it the entry is on the build list and shows
 * greyed with "Soon". `label` is a translation key (nav.* where our name already matches, menu.i.* for
 * the rest).
 */
export interface MenuItem { label: string; icon: Icon; href?: string; permission?: string; key?: string }
export interface MenuGroup { key: string; items: MenuItem[] }
export interface MenuHeading { key: string; letter: string; tone: string; groups: MenuGroup[] }

const i = (label: string, icon: Icon, href?: string, permission?: string, key?: string): MenuItem => ({ label, icon, ...(href ? { href } : {}), ...(permission ? { permission } : {}), ...(key ? { key } : {}) });
export const menuLabelText = <T extends (key: string) => string>(label: string, translate: T) => label.startsWith("en:") ? label.slice(3) : translate(label);
const m = (k: string) => `menu.i.${k}`;

/** The menu bar, heading by heading, group by group, in the order the user's G-Retail shows them. */
export const MENU: MenuHeading[] = [
  {
    key: "masters", letter: "M", tone: "#16a34a",
    groups: [
      { key: "account", items: [
        i(m("accountMaster"), Contact, "/accounts/chart", "accounts.view"), i(m("bankMaster"), Landmark, "/banking", "banking.view"),
        i(m("openingBalance"), Scale, "/accounts/chart", "accounts.view"), i(m("balanceSheetGroup"), ListTree, "/accounts/chart", "accounts.view"),
        i(m("accountGroup"), Users, "/accounts/chart", "accounts.view"), i(m("accountCategory"), Layers, "/masters/lists/accountCategory", "sales.view"), i(m("transporterMaster"), Truck, "/masters/lists/transporterMaster", "sales.view"), i(m("regionMaster"), MapPin, "/masters/lists/regionMaster", "sales.view"),
        i(m("customerSubCategory"), Layers, "/masters/lists/customerSubCategory", "sales.view"), i(m("remarksMaster"), NotebookPen, "/masters/lists/remarksMaster", "sales.view"), i(m("companyMaster"), Building2, "/settings/company", "company.view"),
        i(m("countryMaster"), Globe, "/masters/lists/countryMaster", "sales.view"), i("nav.priceLists", Tags, "/sales/price-lists", "sales.view"), i("nav.assetRegister", Monitor, "/assets", "assets.view"),
        i("nav.expenseCategories", Tag, "/settings/expenses", "expenses.view"),
      ] },
      { key: "stock", items: [
        i(m("departmentMaster"), Building2, "/masters/lists/departmentMaster", "inventory.view"), i(m("manufactureCompany"), Factory, "/masters/lists/manufactureCompany", "inventory.view"), i(m("brandMaster"), Tag, "/masters/lists/brandMaster", "inventory.view"), i(m("productMaster"), Package, "/masters/lists/productMaster", "inventory.view"),
        i(m("styleMaster"), Shirt, "/inventory/styles", "inventory.view"), i(m("itemGroup"), Boxes, "/masters/lists/itemGroup", "inventory.view"), i(m("itemMaster"), Package, "/inventory/items", "inventory.view"),
        i(m("designMaster"), Scissors, "/inventory/styles", "inventory.view"), i(m("colorMaster"), Palette, "/inventory/styles/setup", "inventory.view"),
        i(m("sizeGroupMaster"), Ruler, "/inventory/styles/setup", "inventory.view"), i(m("sizeMaster"), Ruler, "/inventory/styles/setup", "inventory.view"),
        i(m("fabric"), Layers, "/masters/lists/fabric", "inventory.view"), i(m("sleeves"), Shirt, "/masters/lists/sleeves", "inventory.view"), i(m("neck"), Shirt, "/masters/lists/neck", "inventory.view"), i(m("fit"), Ruler, "/masters/lists/fit", "inventory.view"), i(m("season"), CalendarRange, "/masters/lists/season", "inventory.view"), i(m("styleAttr"), Shirt, "/masters/lists/styleAttr", "inventory.view"), i(m("gender"), Users, "/masters/lists/gender", "inventory.view"),
        i(m("typeMaster"), Tag, "/masters/lists/typeMaster", "inventory.view"), i(m("subCategory9"), Tag, "/masters/lists/subCategory9", "inventory.view"), i(m("subCategory10"), Tag, "/masters/lists/subCategory10", "inventory.view"), i(m("materialMaster"), Layers, "/masters/lists/materialMaster", "inventory.view"), i("en:Fixed Barcode", Barcode, "/inventory/fixed-barcode", "inventory.view"),
        i(m("minMaxStock"), TrendingUp, "/inventory/stock-limits", "inventory.view"), i(m("openingStock"), PackageOpen, "/inventory/journals/new", "inventory.create"), i(m("seasonMaster"), CalendarDays, "/masters/lists/seasonMaster", "inventory.view"),
        i(m("processMaster"), Hammer, "/masters/lists/processMaster", "inventory.view"), i(m("orderType"), ClipboardList, "/masters/lists/orderType", "sales.view"), i("nav.boms", Layers, "/manufacturing/boms", "inventory.view"),
        i(m("warehouses"), Warehouse, "/settings/inventory", "inventory.view"),
      ] },
      { key: "parameters", items: [
        i(m("dayBookMaster"), BookOpen, "/settings/number-series", "settings.view"), i("en:Ledger Posting Defaults", Settings2, "/masters/ledger-parameters", "accounts.view"), i(m("salesmanMaster"), UserCog, "/hr/employees", "hr.view"),
        i(m("taxMaster"), Percent, "/settings/gst", "gst.view"), i(m("tdsMaster"), FileText, "/accounts/tds", "accounts.view"), i("en:TCS Tax Master", FileText, "/masters/tcs-tax", "accounts.view"),
        i(m("financeYearMaster"), CalendarRange, "/settings/financial-years", "company.view"), i(m("hsnCodeMaster"), Hash, "/masters/hsn", "inventory.view"), i(m("salesReturnReason"), Undo2, "/masters/lists/salesReturnReason", "sales.view"),
        i("nav.posSettings", Store, "/settings/pos", "sales.view"), i("nav.messageTemplates", MessageSquareText, "/crm/templates", "crm.view"),
      ] },
      { key: "promotion", items: [
        i(m("salesmanCommTarget"), Target, "/sales/targets", "sales.view"), i(m("commissionRules"), Percent, "/sales/commission-rules", "payroll.view"), i(m("itemDiscountSetup"), TicketPercent, "/pos/schemes", "sales.view"),
        i(m("promoMaster"), Gift, "/pos/vouchers", "sales.view"), i(m("sisSetup"), Briefcase, "/sales/consignment", "sales.view"),
        i(m("itemCommissionSetup"), Handshake, "/sales/commission", "sales.view"), i(m("sourceMaster"), Send, "/masters/lists/sourceMaster", "sales.view"),
      ] },
    ],
  },
  {
    key: "transaction", letter: "T", tone: "#ea580c",
    groups: [
      { key: "sales", items: [
        i(m("salesOrderWh"), ClipboardList, "/sales/orders", "sales.view"), i(m("whSalesOrderCancel"), CalendarX, "/sales/orders", "sales.view"),
        i(m("deliveryOrder"), Truck, "/sales/delivery-orders", "sales.view"), i(m("deliveryChallan"), Truck, "/sales/deliveries", "sales.view"), i(m("salesBillWh"), Receipt, "/sales/invoices", "sales.view", "F8"),
        i(m("deliveryChallanReturnWh"), Undo2, "/sales/deliveries", "sales.view"), i(m("creditNoteWh"), Undo2, "/sales/credit-notes", "sales.view"),
        i(m("advanceReceipt"), ArrowDownToLine, "/accounts/vouchers/new?type=receipt", "accounts.create"), i("nav.posBilling", Store, "/pos/billing", "sales.create"),
        i("nav.posBills", ScrollText, "/pos/bills", "sales.view"), i("nav.posReturns", RotateCcw, "/pos/returns", "sales.view"),
        i("nav.proformas", FileBadge, "/sales/proformas", "sales.view"), i("nav.approvals", Hourglass, "/sales/approvals", "sales.view"),
        i("nav.alterations", Scissors, "/pos/alterations", "sales.view"), i("nav.tailoring", Ruler, "/pos/tailoring", "sales.view"),
      ] },
      { key: "accounting", items: [
        i(m("cashPayRec"), Banknote, "/accounts/vouchers/new?type=receipt", "accounts.create", "F6"), i(m("bankPayRec"), Landmark, "/accounts/vouchers/new?type=payment", "accounts.create", "F5"),
        i(m("billWiseReceipt"), ReceiptText, "/accounts/bill-receipt", "accounts.create"), i(m("cardReceipt"), CreditCard, "/banking/settlements", "banking.view"),
        i(m("journalVoucher"), NotebookPen, "/accounts/vouchers/new?type=journal", "accounts.create", "F7"), i(m("contraVoucher"), Repeat, "/accounts/vouchers/new?type=contra", "accounts.create", "F4"),
        i("nav.vouchers", BookOpen, "/accounts/vouchers", "accounts.view"), i("nav.expenseClaims", ReceiptText, "/expenses", "expenses.view"), i(m("travelRegister"), ReceiptText, "/expenses/travel", "expenses.view"),
      ] },
      { key: "purchase", items: [
        i(m("purchaseOrder"), ClipboardList, "/purchase/orders", "purchase.view"), i(m("inwardChallan"), PackageCheck, "/purchase/receipts", "purchase.view"), i(m("receivingDesk"), PackageCheck, "/purchase/receiving", "purchase.view"),
        i(m("purchase"), ShoppingCart, "/purchase/bills", "purchase.view", "F9"), i(m("goodsReturn"), Undo2, "/purchase/returns", "purchase.view"),
        i(m("debitNote"), FileText, "/purchase/returns", "purchase.view"), i(m("gstJv"), FileSpreadsheet, "/accounts/gst-jv", "accounts.create"),
      ] },
      { key: "jobwork", items: [
        i(m("jobIssue"), Send, "/manufacturing/job-work", "inventory.view"), i(m("jobReceipt"), PackageCheck, "/manufacturing/job-work", "inventory.view"),
        i(m("jobWorkIssue"), Send, "/manufacturing/job-work", "inventory.view"), i(m("jobWorkReceipt"), PackageCheck, "/manufacturing/job-work", "inventory.view"),
        i("nav.production", Factory, "/manufacturing/orders", "inventory.view"), i("nav.mrp", CalendarClock, "/manufacturing/mrp", "inventory.view"),
      ] },
      { key: "other", items: [
        i(m("stockAdjustment"), ArrowLeftRight, "/inventory/journals", "inventory.view"), i(m("stockTransfer"), Truck, "/inventory/transfers", "inventory.view"), i(m("branchDistribution"), Truck, "/inventory/distribution", "inventory.view"), i(m("marginBands"), Scale, "/inventory/margin-bands", "inventory.view"), i(m("relabel"), Scale, "/inventory/relabel", "inventory.view"), i(m("inquiryLog"), MessagesSquare, "/sales/inquiries", "sales.view"), i(m("consignmentSales"), Package, "/reports/consignment-sales", "sales.view"), i(m("serviceCustomers"), Users, "/sales/service-customers", "sales.view"), i(m("sampleIssue"), Package, "/sales/deliveries/new?reason=sample", "sales.create"), i(m("sampleReceive"), PackageCheck, "/sales/samples", "sales.view"), i(m("serviceDesk"), Wrench, "/sales/repairs", "sales.view"),
        i(m("quotation"), FileText, "/sales/quotations", "sales.view"), i(m("lrTransportEntry"), Truck, "/sales/lr", "sales.view"), i(m("eWayBill"), Truck, "/sales/invoices", "sales.view"),
        i("en:Re-pack Box", Boxes, "/inventory/repack-box", "inventory.view"), i("en:Re-open Box", PackageOpen, "/inventory/reopen-box", "inventory.view"), i("nav.stockCounts", ScanBarcode, "/inventory/counts", "inventory.view"), i(m("stockAudit"), ScanBarcode, "/inventory/counts/audit", "inventory.view"), i(m("processLocks"), ScanBarcode, "/settings/process-locks", "settings.view"),
        i("nav.projectList", FolderKanban, "/projects", "projects.view"), i("nav.timesheets", Timer, "/projects/timesheets", "projects.view"),
      ] },
    ],
  },
  {
    key: "reports", letter: "R", tone: "#c026d3",
    groups: [
      { key: "salesReports", items: [
        i("nav.salesRegister", ReceiptText, "/reports/sales-register", "reports.view"), i("nav.colourSize", Shirt, "/reports/colour-size", "reports.view"),
        i("nav.insights", BarChart3, "/insights", "reports.view"), i("nav.cfoView", Gauge, "/reports/cfo", "reports.view"), i("nav.dashboard", LayoutDashboard, "/dashboard"),
      ] },
      { key: "stockReports", items: [
        i("nav.stock", Warehouse, "/inventory/stock", "inventory.view"), i("en:Stock cost coverage", PackageCheck, "/reports/stock-cost-coverage", "inventory.view"), i("en:Stock-to-ledger tie-out", Scale, "/reports/stock-ledger-reconciliation", "inventory.view"), i("nav.stockAgeing", Hourglass, "/reports/stock-ageing", "reports.view"), i(m("ownerRegisters"), TrendingUp, "/reports/registers", "reports.view"), i("nav.stockMovement", Rabbit, "/reports/stock-movement", "reports.view"),
        i("nav.catalogue", Images, "/inventory/catalogue", "inventory.view"),
      ] },
      { key: "customReports", items: [
        i("nav.reportsHub", LayoutGrid, "/reports", "reports.view"), i("nav.reportBuilder", Table2, "/reports/builder"), i("nav.savedReports", CalendarClock, "/reports/saved", "reports.view"),
        i("nav.checks", ShieldAlert, "/reports/checks", "reports.view"), i("nav.integrity", ScanSearch, "/reports/integrity", "reports.view"),
      ] },
    ],
  },
  {
    key: "accountReports", letter: "E", tone: "#dc2626",
    groups: [
      { key: "accountReportsGroup", items: [
        i(m("ledgerReport"), BookOpen, "/accounts/chart", "accounts.view"), i(m("dailySales"), CalendarDays, "/reports/daily-sales", "reports.view"), i(m("discountRegister"), TicketPercent, "/reports/discounts", "reports.view"), i(m("salesOrderRegister"), ClipboardList, "/reports/sales-order-register", "sales.view"), i(m("cashBookReport"), Wallet, "/reports/books?view=cash", "reports.view"), i(m("bankReport"), Landmark, "/reports/books?view=bank", "reports.view"),
        i(m("bankReconciliation"), RefreshCcw, "/banking", "banking.view"), i(m("groupMonthSummary"), CalendarDays, "/reports/books?view=group", "reports.view"), i(m("cashBankExpense"), Coins, "/reports/books?view=expense", "reports.view"),
        i(m("cashFlowReportGroup"), TrendingUp, "/reports/books?view=flow", "reports.view"), i(m("billToBillAdjustment"), ListChecks, "/reports/books?view=adjust", "reports.view"), i(m("reconciliation"), ListChecks, "/accounts/reconciliation", "accounts.view"), i(m("msmeReport"), FileText, "/reports/msme", "accounts.view"),
        i("nav.trialBalance", Scale, "/reports/trial-balance", "reports.view"),
      ] },
      { key: "finalReportGroup", items: [
        i(m("outstandingPayable"), Wallet, "/reports/payables", "reports.view"), i(m("outstandingReceivable"), HandCoins, "/reports/receivables", "reports.view"),
        i(m("debtorsList"), Users, "/reports/receivables", "reports.view"), i(m("creditorList"), Users, "/reports/payables", "reports.view"),
        i(m("interestReport"), Percent, "/reports/interest", "reports.view"), i(m("depreciationAssetReport"), TrendingDown, "/assets/depreciation", "assets.view"),
        i(m("journalVoucherReport"), NotebookPen, "/accounts/vouchers", "accounts.view"), i(m("gstReport"), Landmark, "/gst/returns", "gst.view"), i(m("gstWorkspace"), Landmark, "/gst/workspace", "gst.view"), i(m("slabCheck"), Landmark, "/gst/slab-exceptions", "gst.view"), i(m("gstCompliance"), Landmark, "/gst/compliance", "gst.view"), i(m("storeResults"), TrendingUp, "/reports/store-results", "reports.view"), i(m("branchPrices"), Landmark, "/inventory/branch-prices", "sales.view"), i(m("serials"), Landmark, "/inventory/serials", "inventory.view"), i(m("approvalMemos"), Landmark, "/sales/approval-memos", "sales.view"), i(m("exports"), Landmark, "/gst/exports", "gst.view"), i(m("workingCapital"), Landmark, "/accounts/working-capital", "reports.view"), i(m("scenarios"), TrendingUp, "/accounts/scenarios", "reports.view"),
        i(m("tdsReport"), FileText, "/accounts/tds", "accounts.view"), i(m("tdsForm26q"), FileText, "/accounts/tds", "reports.view"), i(m("finalReport"), TrendingUp, "/reports/profit-loss", "reports.view"), i(m("profitability"), TrendingUp, "/reports/profitability", "reports.view"),
        i("nav.balanceSheet", BarChart3, "/reports/balance-sheet", "reports.view"), i(m("rcmRegister"), FileCheck2, "/reports/books?view=rcm", "reports.view"), i("en:TCS Report", FileText, "/reports/tcs", "reports.view"),
        i("nav.itDepreciation", Percent, "/assets/income-tax", "assets.view"),
      ] },
    ],
  },
  {
    key: "payroll", letter: "Y", tone: "#2878d0",
    groups: [
      { key: "masterGroup", items: [
        i(m("employee"), Users, "/hr/employees", "hr.view"), i(m("employeeKyc"), IdCard, "/hr/documents", "hr.view"), i(m("salaryDeduction"), IndianRupee), i(m("weekOff"), CalendarOff),
        i(m("weekOffCancel"), CalendarX), i(m("holidays"), Plane, "/hr/attendance", "hr.view"), i(m("designation"), IdCard, "/masters/lists/designation", "hr.view"), i(m("employeeDepartment"), Building2, "/masters/lists/employeeDepartment", "hr.view"),
        i(m("shiftMaster"), Timer, "/hr/attendance", "hr.view"),
      ] },
      { key: "payrollTransactionGroup", items: [
        i(m("dailyAttendance"), CalendarCheck, "/hr/attendance", "hr.view"), i(m("leaveApplication"), Plane, "/hr/leave", "hr.view"),
        i(m("advanceSalary"), Wallet, "/hr/employees", "hr.view"), i(m("loanIssue"), HandCoins, "/hr/employees", "hr.view"), i(m("loanReceipt"), ArrowDownToLine, "/hr/employees", "payroll.create"),
        i(m("monthlySalary"), IndianRupee, "/hr/payroll", "payroll.view"), i(m("stipend"), Coins), i(m("salaryPayment"), Banknote, "/hr/payroll", "payroll.view"),
        i(m("stipendPayment"), Banknote, "/hr/stipends", "payroll.view"), i(m("attendanceAlerts"), CalendarX, "/hr/attendance-alerts", "hr.view"), i(m("attendanceMachines"), Fingerprint, "/hr/attendance-devices", "hr.view"), i(m("incentive"), Target), i(m("otherDeduction"), IndianRupee), i(m("advanceLoanRequest"), UserPlus, "/hr/loan-requests", "payroll.view"),
      ] },
      { key: "reportGroup", items: [
        i(m("monthlyAttendanceRegister"), CalendarDays, "/hr/attendance", "hr.view"), i(m("dayWiseAttendanceRegister"), CalendarCheck, "/hr/attendance", "hr.view"),
        i(m("salarySlipRegister"), ReceiptText, "/hr/payroll", "payroll.view"), i(m("ptReport"), FileText, "/hr/statutory", "payroll.view"),
        i(m("leaveReport"), Plane, "/hr/leave", "hr.view"), i(m("menuLogSessionReport"), FileClock),
      ] },
      { key: "utilityGroup", items: [
        i(m("payrollParameter"), Settings2, "/settings/payroll", "payroll.view"), i(m("deviceSettings"), Smartphone, "/hr/attendance", "hr.view"),
      ] },
    ],
  },
  {
    key: "utility", letter: "U", tone: "#7c3aed",
    groups: [
      { key: "barcodeGroup", items: [
        i(m("barcodePrint"), Printer, "/inventory/labels", "inventory.view"), i(m("barcodeSearch"), ScanSearch, "/inventory/barcode-search", "inventory.view"), i(m("barcodeDesignImage"), Images, "/inventory/catalogue", "inventory.view"),
        i(m("rateUpdation"), RefreshCcw, "/inventory/rate-update", "inventory.edit"), i(m("imageCatalogue"), Images, "/inventory/catalogue", "inventory.view"), i(m("salesDiscountMaster"), TicketPercent, "/pos/schemes", "sales.view"), i(m("loyaltyMembers"), Gift, "/pos/loyalty", "sales.view"),
        i(m("salesDiscountDesignWise"), TicketPercent, "/pos/schemes", "sales.view"), i(m("salesmanCommission"), Handshake, "/sales/commission", "sales.view"),
        i(m("dayClose"), CalendarX, "/accounts/close", "reports.view"), i(m("monthEndClose"), CalendarCheck, "/accounts/close", "reports.view"),
      ] },
      { key: "extraUtility", items: [
        i(m("sms"), MessagesSquare, "/crm/communications", "crm.view"), i(m("email"), Mail, "/crm/communications", "crm.view"), i(m("bulkMessenger"), Send, "/crm/messages", "crm.view"), i(m("logHistoryReport"), FileClock, "/settings/audit-log", "settings.view"),
        i(m("outstandingAdj"), Scale), i(m("resetPhysicalStock"), RotateCcw, "/inventory/reset-stock", "inventory.approve"), i(m("stockPostingCheck"), RotateCcw, "/reports/stock-posting-check", "reports.view"), i(m("stockLosses"), PackageX, "/inventory/losses", "inventory.view"), i(m("stockFinance"), PackageX, "/inventory/stock-finance", "inventory.view"), i(m("physicalStockVerification"), ClipboardCheck, "/inventory/counts", "inventory.view"),
        i(m("merge"), Merge, "/masters/merge", "accounts.edit"), i(m("salesStockLedgerDiff"), Filter), i(m("noteReport"), NotebookPen), i(m("eInvoiceUpload"), Upload, "/sales/invoices", "sales.view"),
        i(m("eWayBillUpload"), Upload, "/sales/invoices", "sales.view"), i(m("autoOutstandingReminder"), CalendarClock, "/reports/receivables", "reports.view"),
      ] },
      { key: "userManagement", items: [
        i(m("users"), Users, "/settings/team", "users.view"), i(m("userGroup"), UserCog, "/settings/team", "users.view"), i(m("currentDateSetting"), CalendarDays), i(m("sensitiveChanges"), ShieldAlert, "/settings/sensitive-changes", "settings.view"), i(m("datedChanges"), CalendarClock, "/settings/dated-changes", "settings.view"), i(m("internalControls"), ShieldAlert, "/settings/controls", "users.view"), i(m("approvals"), ShieldCheck, "/settings/approvals", "settings.view"), i(m("userActivity"), Activity, "/reports/user-activity", "settings.view"),
        i(m("dataLockTillDate"), Lock, "/settings/financial-years", "company.view"), i(m("myDevices"), Smartphone, "/settings/devices", "users.view"),
      ] },
      { key: "softwareUtility", items: [
        i(m("ledgerStockPosting"), Database), i(m("reportType"), FileSpreadsheet), i(m("userParameter"), Settings2, "/account"), i(m("balanceTransfer"), ArrowLeftRight, "/reports/year-end", "reports.view"), i(m("yearEndCheck"), CalendarCheck, "/reports/year-end", "reports.view"),
        i(m("databaseBackup"), DatabaseBackup, "/settings/backup", "company.export"), i(m("softwareUpdate"), Download), i(m("dbUpdates"), Database), i(m("scheduleBackup"), CalendarClock),
        i(m("exportVouchersPdf"), FileText), i("nav.import", Upload, "/settings/import", "accounts.create"), i("nav.allActions", LayoutGrid, "/launcher"),
      ] },
    ],
  },
  {
    key: "chat", letter: "Q", tone: "#9333ea",
    groups: [
      { key: "chatGroup", items: [
        i("nav.assistant", Sparkles, "/assistant"), i(m("chat"), MessagesSquare, "/chat"), i("nav.messageLog", MessagesSquare, "/crm/messages", "crm.view"), i(m("communications"), MessagesSquare, "/crm/communications", "crm.view"), i("nav.leads", Contact, "/crm/leads", "crm.view"),
        i("nav.followUps", PhoneCall, "/crm/activities", "crm.view"),
      ] },
    ],
  },
];

/** Every entry that opens a screen, with its heading and group (search, tabs and the menu share it). */
export const MENU_LINKS = MENU.flatMap((h) => h.groups.flatMap((g) => g.items.filter((x) => x.href).map((x) => ({ ...x, heading: h.key, group: g.key }))));
