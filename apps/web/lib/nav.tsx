
import {
  Briefcase, FileChartColumn, Library, Palette, Grid2x2Plus, LayoutGrid, ScanBarcode, ArrowDownToLine, ArrowLeftRight, ArrowUpFromLine, Banknote, BarChart3, BookOpen, Boxes, Building2, CalendarCheck, CalendarClock, CalendarClock as Scheduled, CalendarRange, ClipboardList, Contact, CreditCard, Factory, FileBadge, Handshake, FileCheck2, FileClock, FileText, Filter, FolderKanban, Gift, HandCoins, Hash, Hourglass, Images, IndianRupee, Landmark, Layers, LayoutDashboard, ListTree, MessageSquareText, Monitor, NotebookPen, Package, PackageCheck, Percent, PhoneCall, Plane, Plus, Receipt, ReceiptText, Repeat, Ruler, Scale, Scissors, ScrollText, Send, Settings2, ShieldAlert, Shirt, ShoppingCart, Sparkles, Store, Table2, Tags, Target, TicketPercent, Timer, TrendingDown, TrendingUp, Truck, Undo2, Upload, UserCog, Users, Wallet, Warehouse,
} from "lucide-react";
import type { useTranslations } from "next-intl";

export interface NavItem {
  href: string;
  key: string;
  icon: typeof LayoutDashboard;
  phase?: number; // not built yet: shown disabled with "coming in phase N"
  permission?: string;
}

/**
 * The whole menu: 13 sections in the order a garment business works. Each screen appears once; the
 * Reports and Masters hubs group screens that also live in their working section.
 */
export const SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: "workspace",
    items: [
      { href: "/my-menu", key: "myMenu", icon: LayoutGrid }, { href: "/launcher", key: "allActions", icon: Grid2x2Plus },
      { href: "/dashboard", key: "dashboard", icon: LayoutDashboard }, { href: "/insights", key: "insights", icon: BarChart3, permission: "reports.view" },
      { href: "/assistant", key: "assistant", icon: Sparkles },
    ],
  },
  {
    title: "crm",
    items: [
      { href: "/crm/leads", key: "leads", icon: Contact, permission: "crm.view" },
      { href: "/crm/activities", key: "followUps", icon: PhoneCall, permission: "crm.view" },
      { href: "/crm/messages", key: "messageLog", icon: Send, permission: "crm.view" },
    ],
  },
  {
    title: "salesPos",
    items: [
      { href: "/pos/billing", key: "posBilling", icon: Store, permission: "sales.create" },
      { href: "/pos/bills", key: "posBills", icon: ScrollText, permission: "sales.view" },
      { href: "/pos/returns", key: "posReturns", icon: Undo2, permission: "sales.view" },
      { href: "/pos/alterations", key: "alterations", icon: Scissors, permission: "sales.view" },
      { href: "/pos/tailoring", key: "tailoring", icon: Ruler, permission: "sales.view" },
      { href: "/sales/quotations", key: "quotations", icon: FileText, permission: "sales.view" },
      { href: "/sales/proformas", key: "proformas", icon: FileBadge, permission: "sales.view" },
      { href: "/sales/orders", key: "salesOrders", icon: ClipboardList, permission: "sales.view" },
      { href: "/sales/deliveries", key: "deliveryNotes", icon: Truck, permission: "sales.view" },
      { href: "/sales/approvals", key: "approvals", icon: Hourglass, permission: "sales.view" },
      { href: "/sales/consignment", key: "consignment", icon: Briefcase, permission: "sales.view" },
      { href: "/sales/invoices", key: "salesInvoices", icon: Receipt, permission: "sales.view" },
      { href: "/sales/credit-notes", key: "creditNotes", icon: Undo2, permission: "sales.view" },
    ],
  },
  {
    title: "promotions",
    items: [
      { href: "/pos/schemes", key: "schemes", icon: TicketPercent, permission: "sales.view" },
      { href: "/pos/vouchers", key: "vouchers", icon: Gift, permission: "sales.view" },
      { href: "/sales/price-lists", key: "priceLists", icon: Tags, permission: "sales.view" },
      { href: "/sales/commission", key: "agents", icon: Handshake, permission: "sales.view" },
      { href: "/sales/targets", key: "targets", icon: Target, permission: "sales.view" },
    ],
  },
  {
    title: "purchase",
    items: [
      { href: "/purchase/orders", key: "purchaseOrders", icon: ClipboardList, permission: "purchase.view" },
      { href: "/purchase/receipts", key: "goodsReceipts", icon: PackageCheck, permission: "purchase.view" },
      { href: "/purchase/bills", key: "purchaseBills", icon: ShoppingCart, permission: "purchase.view" },
      { href: "/purchase/returns", key: "purchaseReturns", icon: Undo2, permission: "purchase.view" },
    ],
  },
  {
    title: "inventory",
    items: [
      { href: "/inventory/stock", key: "stock", icon: Warehouse, permission: "inventory.view" },
      { href: "/inventory/styles", key: "styles", icon: Shirt, permission: "inventory.view" },
      { href: "/inventory/items", key: "items", icon: Package, permission: "inventory.view" },
      { href: "/inventory/catalogue", key: "catalogue", icon: Images, permission: "inventory.view" },
      { href: "/inventory/labels", key: "labels", icon: Tags, permission: "inventory.view" },
      { href: "/inventory/journals", key: "stockJournals", icon: ArrowLeftRight, permission: "inventory.view" },
      { href: "/inventory/counts", key: "stockCounts", icon: ScanBarcode, permission: "inventory.view" },
    ],
  },
  {
    title: "manufacturing",
    items: [
      { href: "/manufacturing/boms", key: "boms", icon: Layers, permission: "inventory.view" },
      { href: "/manufacturing/orders", key: "production", icon: Factory, permission: "inventory.view" },
      { href: "/manufacturing/mrp", key: "mrp", icon: CalendarClock, permission: "inventory.view" },
      { href: "/manufacturing/job-work", key: "jobWork", icon: Send, permission: "inventory.view" },
    ],
  },
  {
    title: "finance",
    items: [
      { href: "/accounts/vouchers", key: "vouchers", icon: BookOpen, permission: "accounts.view" },
      { href: "/accounts/chart", key: "chart", icon: ListTree, permission: "accounts.view" },
      { href: "/gst/returns", key: "gstReturns", icon: Landmark, permission: "gst.view" },
      { href: "/banking", key: "bankAccounts", icon: Banknote, permission: "banking.view" },
      { href: "/banking/settlements", key: "settlements", icon: CreditCard, permission: "banking.view" },
      { href: "/banking/rules", key: "bankRules", icon: Filter, permission: "banking.view" },
    ],
  },
  {
    title: "operations",
    items: [
      { href: "/expenses", key: "expenseClaims", icon: ReceiptText, permission: "expenses.view" },
      { href: "/projects", key: "projectList", icon: FolderKanban, permission: "projects.view" },
      { href: "/projects/timesheets", key: "timesheets", icon: Timer, permission: "projects.view" },
      { href: "/assets", key: "assetRegister", icon: Monitor, permission: "assets.view" },
      { href: "/assets/depreciation", key: "depreciation", icon: TrendingDown, permission: "assets.view" },
      { href: "/assets/income-tax", key: "itDepreciation", icon: Percent, permission: "assets.view" },
    ],
  },
  {
    title: "hr",
    items: [
      { href: "/hr/employees", key: "employees", icon: Users, permission: "hr.view" },
      { href: "/hr/attendance", key: "attendance", icon: CalendarCheck, permission: "hr.view" },
      { href: "/hr/leave", key: "leave", icon: Plane, permission: "hr.view" },
      { href: "/hr/payroll", key: "payroll", icon: IndianRupee, permission: "payroll.view" },
      { href: "/hr/statutory", key: "statutory", icon: Landmark, permission: "payroll.view" },
    ],
  },
  {
    title: "reports",
    items: [
      { href: "/reports", key: "reportsHub", icon: FileChartColumn, permission: "reports.view" },
      { href: "/reports/sales-register", key: "salesRegister", icon: ReceiptText, permission: "reports.view" },
      { href: "/reports/colour-size", key: "colourSize", icon: Shirt, permission: "reports.view" },
      { href: "/reports/stock-ageing", key: "stockAgeing", icon: Hourglass, permission: "reports.view" },
      { href: "/reports/receivables", key: "receivables", icon: HandCoins, permission: "reports.view" },
      { href: "/reports/interest", key: "interest", icon: Percent, permission: "reports.view" },
      { href: "/reports/payables", key: "payables", icon: Wallet, permission: "reports.view" },
      { href: "/reports/trial-balance", key: "trialBalance", icon: Scale, permission: "reports.view" },
      { href: "/reports/profit-loss", key: "profitLoss", icon: TrendingUp, permission: "reports.view" },
      { href: "/reports/balance-sheet", key: "balanceSheet", icon: BarChart3, permission: "reports.view" },
      { href: "/reports/builder", key: "reportBuilder", icon: Table2 },
      { href: "/reports/saved", key: "savedReports", icon: Scheduled, permission: "reports.view" },
      { href: "/reports/checks", key: "checks", icon: ShieldAlert, permission: "reports.view" },
    ],
  },
  {
    title: "masters",
    items: [
      { href: "/masters", key: "mastersHub", icon: Library, permission: "inventory.view" },
      { href: "/inventory/styles/setup", key: "sizesColours", icon: Palette, permission: "inventory.view" },
    ],
  },
  {
    title: "settings",
    items: [
      { href: "/settings/company", key: "company", icon: Building2, permission: "company.view" },
      { href: "/settings/team", key: "team", icon: UserCog, permission: "users.view" },
      { href: "/settings/financial-years", key: "financialYears", icon: CalendarRange, permission: "company.view" },
      { href: "/settings/gst", key: "gstSettings", icon: FileCheck2, permission: "gst.view" },
      { href: "/settings/inventory", key: "inventory", icon: Boxes, permission: "inventory.view" },
      { href: "/settings/payroll", key: "payrollSettings", icon: IndianRupee, permission: "payroll.view" },
      { href: "/settings/pos", key: "posSettings", icon: Settings2, permission: "sales.view" },
      { href: "/settings/expenses", key: "expenseCategories", icon: Tags, permission: "expenses.view" },
      { href: "/crm/templates", key: "messageTemplates", icon: MessageSquareText, permission: "crm.view" },
      { href: "/settings/import", key: "import", icon: Upload, permission: "accounts.create" },
      { href: "/settings/number-series", key: "numberSeries", icon: Hash, permission: "settings.view" },
      { href: "/settings/audit-log", key: "auditLog", icon: FileClock, permission: "settings.view" },
    ],
  },
];

export const ALL_HREFS = SECTIONS.flatMap((s) => s.items.map((i) => i.href));

/** Starting an entry, with Tally's function keys. */
export const CREATE: { href: string; key?: string; label: (t: ReturnType<typeof useTranslations>) => string; icon: typeof Plus; permission: string }[] = [
  { href: "/sales/invoices/new", key: "F8", label: (t) => t("sales.invoices.new"), icon: Receipt, permission: "sales.create" },
  { href: "/purchase/bills/new", key: "F9", label: (t) => t("purchase.bills.new"), icon: ShoppingCart, permission: "purchase.create" },
  { href: "/purchase/receipts/new", label: (t) => t("purchase.receipts.new"), icon: PackageCheck, permission: "purchase.create" },
  { href: "/accounts/vouchers/new?type=receipt", key: "F6", label: (t) => t("shell.newVoucher", { type: t("vouchers.types.receipt") }), icon: ArrowDownToLine, permission: "accounts.create" },
  { href: "/accounts/vouchers/new?type=payment", key: "F5", label: (t) => t("shell.newVoucher", { type: t("vouchers.types.payment") }), icon: ArrowUpFromLine, permission: "accounts.create" },
  { href: "/accounts/vouchers/new?type=contra", key: "F4", label: (t) => t("shell.newVoucher", { type: t("vouchers.types.contra") }), icon: Repeat, permission: "accounts.create" },
  { href: "/accounts/vouchers/new?type=journal", key: "F7", label: (t) => t("shell.newVoucher", { type: t("vouchers.types.journal") }), icon: NotebookPen, permission: "accounts.create" },
];

/** The sidebar's bands: sections grouped the way a garment business thinks about its work. */
export const BANDS: { key: string; sections: string[] }[] = [
  { key: "workspace", sections: ["workspace"] },
  { key: "commerce", sections: ["crm", "salesPos", "promotions"] },
  { key: "supply", sections: ["purchase", "inventory"] },
  { key: "production", sections: ["manufacturing", "operations"] },
  { key: "money", sections: ["finance", "hr"] },
  { key: "insight", sections: ["reports"] },
  { key: "admin", sections: ["masters", "settings"] },
];

/** Each section's icon, shown beside its name and alone when the sidebar is folded. */
export const SECTION_ICONS: Record<string, typeof Plus> = {
  workspace: LayoutGrid, crm: Contact, salesPos: Store, promotions: TicketPercent, purchase: ShoppingCart, inventory: Warehouse,
  manufacturing: Factory, operations: FolderKanban, finance: Landmark, hr: Users, reports: FileChartColumn, masters: Library, settings: Settings2,
};
