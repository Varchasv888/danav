import { BarChart3, Boxes, Briefcase, Contact, FileCheck2, FilePlus2, Landmark, LayoutGrid, Library, Settings2, ShoppingCart, Store, Truck, Users, Wrench } from "lucide-react";
import { MENU } from "./menu";
import { SECTIONS } from "./nav";

/**
 * The module navigation shared by desktop and mobile: twelve sections, each with a "Create new" list and named groups.
 * Existing screens come from MENU and SECTIONS; this file assigns each one to a section and a group, once. Entries
 * without a screen are not shown. Transactions is not a section: its entries live in the module they belong to.
 * Manufacturing and Projects are hidden for now (their screens stay reachable through search).
 */
type Icon = typeof Store;
export interface ModItem { href?: string; label: string; icon: Icon; permission?: string; key?: string; soon?: boolean }
export interface ModColumn { key: string; items: ModItem[] }
export interface CreateItem { href: string; label: string; icon: Icon; permission: string; key?: string }
export interface ModTab { key: string; letter: string; icon: Icon; columns: ModColumn[]; create: CreateItem[] }

interface Found { label: string; icon: Icon; permission?: string; key?: string }
const found = new Map<string, Found>();
const base = (h: string) => h.split("?")[0]!;
for (const h of MENU) for (const g of h.groups) for (const it of g.items) if (it.href && !found.has(base(it.href))) found.set(base(it.href), { label: it.label, icon: it.icon, permission: it.permission, key: it.key });
for (const s of SECTIONS) for (const it of s.items) if (!found.has(base(it.href))) found.set(base(it.href), { label: `nav.${it.key}`, icon: it.icon as Icon, permission: it.permission });

/** [tab, column, hrefs]. The order here is the order on screen. */
const RULES: [string, string, string[]][] = [
  ["workspace", "start", ["/my-menu", "/launcher", "/dashboard", "/insights", "/assistant"]],
  ["workspace", "people", ["/chat", "/account"]],

  ["masters", "orgFinance", ["/settings/company", "/settings/financial-years", "/accounts/chart", "/masters/ledger-parameters", "/masters/tcs-tax", "/banking", "/settings/number-series", "/settings/expenses",
    "/masters/lists/accountCategory", "/masters/lists/regionMaster", "/masters/lists/countryMaster", "/masters/lists/customerSubCategory", "/masters/lists/remarksMaster", "/masters/lists/transporterMaster"]],
  ["masters", "product", ["/inventory/styles", "/inventory/items", "/inventory/styles/setup", "/masters/hsn", "/inventory/margin-bands", "/inventory/stock-limits", "/settings/inventory",
    "/masters/lists/departmentMaster", "/masters/lists/manufactureCompany", "/masters/lists/brandMaster", "/masters/lists/productMaster", "/masters/lists/itemGroup", "/masters/lists/fabric",
    "/masters/lists/sleeves", "/masters/lists/neck", "/masters/lists/fit", "/masters/lists/season", "/masters/lists/seasonMaster", "/masters/lists/styleAttr", "/masters/lists/gender",
    "/masters/lists/typeMaster", "/masters/lists/subCategory9", "/masters/lists/subCategory10", "/masters/lists/materialMaster", "/masters/lists/processMaster"]],
  ["masters", "salesCustomer", ["/sales/price-lists", "/pos/schemes", "/pos/vouchers", "/sales/targets", "/sales/commission-rules", "/settings/pos", "/crm/templates",
    "/masters/lists/orderType", "/masters/lists/salesReturnReason", "/masters/lists/sourceMaster"]],
  ["masters", "peopleMasters", ["/hr/employees", "/hr/documents", "/masters/lists/designation", "/masters/lists/employeeDepartment"]],
  ["masters", "tools", ["/masters", "/masters/merge", "/settings/import"]],

  ["transactions", "sales", ["/sales/invoices/new", "/sales/deliveries/new", "/pos/billing"]],
  ["transactions", "purchase", ["/purchase/bills/new", "/purchase/receipts/new", "/purchase/receiving"]],
  ["transactions", "accounts", ["/accounts/vouchers/new", "/accounts/bill-receipt", "/accounts/gst-jv"]],
  ["transactions", "stock", ["/inventory/journals/new", "/inventory/transfers", "/inventory/relabel", "/inventory/rate-update"]],

  ["sales", "operations", ["/sales/quotations", "/sales/proformas", "/sales/orders", "/sales/backorders", "/sales/delivery-proofs", "/sales/return-inspection", "/sales/delivery-orders", "/sales/deliveries", "/sales/invoices", "/sales/credit-notes",
    "/sales/approvals", "/sales/approval-memos", "/sales/samples", "/sales/consignment", "/sales/lr"]],
  ["sales", "counter", ["/pos/billing", "/pos/bills", "/pos/returns", "/pos/alterations", "/pos/tailoring", "/sales/repairs", "/sales/inquiries", "/sales/service-customers"]],
  ["sales", "commercial", ["/pos/schemes", "/pos/vouchers", "/pos/loyalty", "/sales/price-lists", "/inventory/branch-prices", "/sales/targets", "/sales/commission-rules", "/sales/commission"]],
  ["sales", "reports", ["/reports/sales-register", "/reports/daily-sales", "/reports/discounts", "/reports/receivables", "/reports/interest", "/reports/sales-order-register", "/reports/consignment-sales"]],

  ["procurement", "documents", ["/purchase/orders", "/purchase/receipts", "/purchase/receiving", "/purchase/bills", "/purchase/returns"]],
  ["procurement", "suppliers", ["/purchase/quotes", "/purchase/supplier-scorecard"]],
  ["procurement", "reports", ["/reports/payables"]],

  ["inventory", "stock", ["/inventory/stock", "/inventory/bins", "/inventory/pick-lists", "/inventory/styles", "/inventory/items", "/inventory/journals", "/inventory/transfers", "/inventory/distribution", "/inventory/serials", "/inventory/repack-box", "/inventory/reopen-box"]],
  ["inventory", "counting", ["/inventory/counts", "/inventory/counts/audit", "/inventory/losses", "/inventory/reset-stock"]],
  ["inventory", "catalogue", ["/inventory/catalogue", "/inventory/labels", "/inventory/fixed-barcode", "/inventory/barcode-search", "/inventory/relabel", "/inventory/rate-update", "/inventory/margin-bands", "/inventory/stock-limits"]],
  ["inventory", "reports", ["/inventory/stock-finance", "/reports/stock-cost-coverage", "/reports/stock-ledger-reconciliation", "/reports/stock-ageing", "/reports/stock-movement", "/reports/stock-posting-check", "/reports/colour-size"]],

  ["manufacturing", "planning", ["/manufacturing/boms", "/manufacturing/mrp", "/manufacturing/orders", "/manufacturing/job-work"]],

  ["accounting", "books", ["/accounts/vouchers", "/accounts/chart", "/accounts/bill-receipt", "/accounts/recurring", "/accounts/reconciliation-overview", "/reports/books", "/reports/transactions", "/reports/day-book", "/reports/bill-profit", "/reports/gst-rate", "/reports/trial-balance", "/reports/profit-loss", "/reports/balance-sheet", "/reports/cash-flow-statement", "/reports/tcs"]],
  ["accounting", "banking", ["/banking", "/banking/settlements", "/banking/rules", "/accounts/reconciliation"]],
  ["finance", "planning", ["/accounts/working-capital", "/accounts/scenarios", "/reports/cfo"]],
  ["finance", "period", ["/accounts/close", "/reports/year-end", "/reports/integrity", "/reports/checks"]],
  ["finance", "assetsExpenses", ["/assets", "/assets/depreciation", "/assets/income-tax", "/expenses", "/expenses/travel"]],

  ["gst", "returns", ["/gst/workspace", "/gst/returns", "/gst/compliance", "/gst/exports", "/gst/slab-exceptions", "/settings/gst"]],
  ["compliance", "tax", ["/accounts/tds", "/reports/msme"]],

  ["people", "workforce", ["/hr/employees", "/hr/documents", "/hr/attendance", "/hr/attendance-alerts", "/hr/attendance-devices", "/hr/leave"]],
  ["people", "payroll", ["/hr/payroll", "/hr/statutory", "/hr/stipends", "/hr/loan-requests", "/settings/payroll"]],

  ["analytics", "bi", ["/bi", "/bi/kpis"]],

  ["admin", "access", ["/settings", "/settings/team", "/settings/approvals", "/settings/sensitive-changes", "/settings/controls", "/settings/process-locks", "/settings/dated-changes"]],
  ["admin", "records", ["/settings/audit-log", "/reports/user-activity", "/settings/devices", "/settings/backup", "/settings/import"]],

  ["crm", "relationships", ["/crm/leads", "/crm/activities", "/crm/communications", "/crm/messages", "/crm/templates"]],
  ["projects", "delivery", ["/projects", "/projects/timesheets"]],
];

/** Screens added after the menus were written; they have no entry in MENU or SECTIONS yet. */
const EXTRA: Record<string, Found> = {
  "/bi": { label: "mega.item.bi", icon: BarChart3, permission: "reports.view" },
  "/bi/kpis": { label: "mega.item.kpis", icon: Library, permission: "reports.view" },
  "/reports/cash-flow-statement": { label: "mega.item.cashFlowStatement", icon: BarChart3, permission: "reports.view" },
  "/purchase/supplier-scorecard": { label: "en:Supplier scorecard", icon: Truck, permission: "purchase.view" },
  "/sales/return-inspection": { label: "en:Return inspection", icon: Store, permission: "sales.view" },
  "/sales/delivery-proofs": { label: "en:Delivery proofs", icon: Store, permission: "sales.view" },
  "/inventory/bins": { label: "en:Bins", icon: Boxes, permission: "inventory.view" },
  "/inventory/pick-lists": { label: "en:Pick lists", icon: Boxes, permission: "inventory.view" },
  "/sales/backorders": { label: "en:Backorders", icon: Store, permission: "sales.view" },
  "/accounts/recurring": { label: "en:Recurring entries", icon: Landmark, permission: "accounts.view" },
  "/accounts/reconciliation-overview": { label: "en:Reconciliation overview", icon: Landmark, permission: "accounts.view" },
  "/purchase/quotes": { label: "en:Quote comparison", icon: Library, permission: "purchase.view" },
  "/masters/customers": { label: "en:Customers", icon: Users, permission: "accounts.view" },
  "/masters/suppliers": { label: "en:Suppliers", icon: Truck, permission: "accounts.view" },
  "/reports/transactions": { label: "en:All transactions", icon: BarChart3, permission: "reports.view" },
  "/reports/day-book": { label: "en:Day book", icon: BarChart3, permission: "reports.view" },
  "/reports/bill-profit": { label: "en:Bill wise profit", icon: BarChart3, permission: "reports.view" },
  "/reports/gst-rate": { label: "en:GST rate report", icon: BarChart3, permission: "reports.view" },
  "/settings": { label: "en:Settings", icon: Library, permission: "settings.view" },
};

/**
 * The masters people look for first. They also stay in their working section (items in Inventory, the chart of accounts in
 * Accounting), so Masters lists them a second time, in a group of its own. The only screens that appear twice.
 */
export const MASTER_SHORTCUTS = ["/masters/customers", "/masters/suppliers", "/inventory/items", "/inventory/styles", "/accounts/chart", "/hr/employees", "/sales/price-lists"];
for (const [h, f] of Object.entries(EXTRA)) if (!found.has(h)) found.set(h, f);

/** Routes get one home. A screen's specific tab wins over shared setup and transaction shortcuts. */
const HOME_TAB_PRIORITY: Record<string, number> = {
  sales: 0, procurement: 1, inventory: 2, manufacturing: 3, accounting: 4, gst: 5, finance: 6, compliance: 7, people: 8,
  crm: 9, projects: 10, analytics: 11, admin: 12, reports: 13, utilities: 14, workspace: 15, masters: 16, transactions: 17,
};

export const TAB_ICONS: Record<string, Icon> = {
  workspace: LayoutGrid, masters: Library, inventory: Boxes, procurement: ShoppingCart, sales: Store, accounting: Landmark,
  gst: FileCheck2, crm: Contact, finance: Briefcase, admin: Settings2, reports: BarChart3, utilities: Wrench,
};
export const MODULE_TITLES: Record<string, string> = {
  workspace: "Home", masters: "Masters", inventory: "Inventory", procurement: "Purchase", sales: "Sales", accounting: "Accounting",
  gst: "GST", crm: "CRM", finance: "Financial planning", admin: "Administration", reports: "Reports", utilities: "Utilities",
};
export const moduleTitle = (key: string) => MODULE_TITLES[key] ?? key;
/** The rail is narrow, so two long names are shortened there; the panel and tooltip carry the full name. */
const RAIL_TITLES: Record<string, string> = { finance: "Planning", admin: "Admin" };
export const railTitle = (key: string) => RAIL_TITLES[key] ?? moduleTitle(key);
const LETTERS: Record<string, string> = { workspace: "H", masters: "M", inventory: "I", procurement: "P", sales: "S", accounting: "A", gst: "G", crm: "C", finance: "F", admin: "D", reports: "R", utilities: "U" };
const ORDER = ["inventory", "procurement", "sales", "accounting", "reports", "utilities"];

/** Sections folded into another one (a name) or hidden for now (null). */
const FOLDED: Record<string, string | null> = { compliance: "accounting", people: "admin", analytics: "finance", manufacturing: null, projects: null };
/** Where the old Transactions entries go, by their old group: [section, group]. */
const TRANSACTION_HOME: Record<string, [string, string]> = { sales: ["sales", "operations"], purchase: ["procurement", "documents"], accounts: ["accounting", "books"], stock: ["inventory", "stock"] };
/** Entry screens: shown under "Create new" of their section, never as list items. */
const CREATE_ONLY = new Set(["/accounts/vouchers/new", "/inventory/journals/new", "/sales/deliveries/new", "/sales/invoices/new", "/purchase/bills/new", "/purchase/receipts/new", "/pos/billing"]);
/** Reports sit in one section, grouped by the module they came from. */
export const REPORT_GROUP: Record<string, string> = { sales: "sales", procurement: "purchases", inventory: "stock", accounting: "books", finance: "planning", gst: "tax", admin: "records" };
const COLUMN_ORDER: Record<string, string[]> = {
  workspace: ["start", "people"], masters: ["main", "orgFinance", "product", "salesCustomer", "peopleMasters", "tools"], inventory: ["stock", "counting", "catalogue", "reports"],
  procurement: ["documents", "suppliers"], sales: ["operations", "counter", "commercial"], accounting: ["books", "banking", "tax"], gst: ["returns"], crm: ["relationships"],
  finance: ["planning", "bi", "period", "assetsExpenses"], admin: ["access", "records", "workforce", "payroll"],
  reports: ["sales", "purchases", "stock", "books", "planning", "tax", "records", "other"], utilities: ["records", "orgFinance", "other"],
};

/** The key of a group's heading, and of a section's one-line description, in the message catalogue. */
export const groupTitleKey = (tab: string, column: string) => `navmenu.group.${tab}.${column}`;
export const hintKey = (tab: string) => `navmenu.hint.${tab}`;
/** The heading of a group, in the current language; a group without a catalogue entry gets its key spelled out. */
export function groupLabel(t: { (key: string): string; has(key: string): boolean }, tab: string, column: string): string {
  return t.has(groupTitleKey(tab, column)) ? t(groupTitleKey(tab, column)) : column.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (x) => x.toUpperCase());
}

const create = (href: string, label: string, permission: string, key?: string): CreateItem => ({ href, label: `navmenu.create.${label}`, icon: FilePlus2, permission, ...(key ? { key } : {}) });
/** The entry screens of each section. Shortcut keys are real: the same ones the New menu uses. */
const CREATE_BY_TAB: Record<string, CreateItem[]> = {
  sales: [
    create("/sales/invoices/new", "salesInvoice", "sales.create", "F8"), create("/pos/billing", "counterBill", "sales.create"), create("/sales/orders/new", "salesOrder", "sales.create"),
    create("/sales/quotations/new", "quotation", "sales.create"), create("/sales/deliveries/new", "deliveryChallan", "sales.create"), create("/sales/delivery-orders/new", "deliveryOrder", "sales.create"),
    create("/sales/proformas/new", "proforma", "sales.create"), create("/accounts/vouchers/new?type=receipt", "receipt", "accounts.create", "F6"),
  ],
  procurement: [create("/purchase/bills/new", "purchaseBill", "purchase.create", "F9"), create("/purchase/orders/new", "purchaseOrder", "purchase.create"), create("/purchase/receipts/new", "inwardChallan", "purchase.create")],
  inventory: [create("/inventory/journals/new", "stockAdjustment", "inventory.create"), create("/inventory/transfers/new", "stockTransfer", "inventory.create")],
  accounting: [create("/accounts/vouchers/new?type=payment", "payment", "accounts.create", "F5"), create("/accounts/vouchers/new?type=contra", "contra", "accounts.create", "F4"), create("/accounts/vouchers/new?type=journal", "journal", "accounts.create", "F7")],
  crm: [create("/crm/leads/new", "lead", "crm.create")],
  finance: [create("/expenses/new", "expenseClaim", "expenses.create"), create("/assets/new", "asset", "accounts.create")],
  admin: [create("/hr/employees/new", "employee", "hr.create")],
};

/** Plain English names for entries whose catalogue text is a G-Retail leftover. Everything else goes through tidyLabel. */
const NAMES: Record<string, string> = {
  "/my-menu": "My menu", "/launcher": "All actions", "/account": "My account",
  "/accounts/chart": "Chart of accounts", "/sales/price-lists": "Price lists", "/hr/employees": "Employees",
  "/settings/company": "Company", "/settings/financial-years": "Financial years", "/masters/hsn": "HSN codes", "/settings/inventory": "Godowns and stores",
  "/sales/quotations": "Quotations", "/sales/orders": "Sales orders", "/sales/delivery-orders": "Delivery orders", "/sales/deliveries": "Delivery challans", "/sales/invoices": "Sales invoices", "/sales/credit-notes": "Credit notes",
  "/sales/approvals": "Goods on approval", "/sales/approval-memos": "Approval memos", "/sales/samples": "Samples", "/sales/consignment": "Shop-in-shop setup", "/sales/lr": "LR and transport",
  "/pos/bills": "Counter bills", "/pos/returns": "Returns and exchanges", "/sales/targets": "Salesman targets", "/sales/commission-rules": "Commission rules", "/sales/commission": "Agent and broker commission",
  "/pos/schemes": "Schemes and offers", "/pos/vouchers": "Vouchers and coupons",
  "/purchase/bills": "Purchase bills", "/purchase/returns": "Purchase returns", "/purchase/receipts": "Inward challans", "/purchase/orders": "Purchase orders", "/purchase/receiving": "Receiving and inspection",
  "/inventory/journals": "Stock adjustments", "/inventory/transfers": "Stock transfers", "/inventory/labels": "Barcode labels", "/inventory/relabel": "Re-labelling", "/inventory/rate-update": "Rate updation",
  "/inventory/stock-limits": "Minimum and maximum stock", "/inventory/counts/audit": "Stock audit", "/inventory/stock": "Stock summary",
  "/accounts/vouchers": "Vouchers", "/banking/settlements": "Card and gateway settlements", "/accounts/bill-receipt": "Bill-wise receipt",
  "/settings/gst": "GST settings", "/gst/returns": "GST returns", "/accounts/gst-jv": "GST journal voucher", "/inventory/styles/setup": "Sizes and colours", "/inventory/styles": "Styles", "/inventory/items": "Items", "/assets/depreciation": "Depreciation", "/accounts/close": "Close the books", "/settings/team": "Users", "/settings/audit-log": "Audit log", "/settings/controls": "Internal controls",
  "/reports/receivables": "Receivables", "/reports/payables": "Payables", "/reports/books": "Cash book", "/reports/profit-loss": "Profit and loss", "/reports/cfo": "Owner's view", "/reports/year-end": "Year-end check",
  "/reports/user-activity": "User activity", "/settings/devices": "My devices", "/settings/backup": "Database backup", "/settings/import": "Import data", "/settings/number-series": "Number series",
};

/** Words kept as they are when a title-case catalogue label is turned into sentence case. */
const KEEP = new Set(["GST", "GSTR", "TDS", "TCS", "HSN", "LR", "SMS", "KPI", "PT", "MSME", "BI", "EAN", "UPI", "QR", "POS", "ITC", "GSTIN", "SKU", "SIS", "ERP", "WhatsApp", "FY"]);
/** Sentence case for catalogue labels written in title case, with the "(Wh)" and "(D.O)" tags dropped. */
export function tidyLabel(text: string): string {
  const cleaned = text.replace(/\s*\((?:wh|d\.o)\)/gi, "").replace(/OutStanding/g, "Outstanding").replace(/SetUp/g, "Setup").replace(/PayRoll/g, "Payroll").replace(/\s+/g, " ").trim();
  return cleaned.split(" ").map((word, i) => {
    if (i === 0 || KEEP.has(word) || !/^[A-Z][a-z]+$/.test(word)) return word;
    return word.toLowerCase();
  }).join(" ");
}

function build(): ModTab[] {
  const tabs = new Map<string, Map<string, ModItem[]>>(ORDER.map((k) => [k, new Map()]));
  const placed = new Set<string>();
  const put = (tab: string, col: string, item: ModItem) => {
    const cols = tabs.get(tab);
    if (!cols) return;
    if (!cols.has(col)) cols.set(col, []);
    const arr = cols.get(col)!;
    if (!arr.some((x) => x.href === item.href)) arr.push(item);
  };
  const itemOf = (route: string, h: string, f: Found): ModItem => ({ href: h, label: NAMES[route] ? `en:${NAMES[route]}` : f.label, icon: f.icon, permission: f.permission, key: f.key });
  const orderedRules = [...RULES].sort(([a], [b]) => (HOME_TAB_PRIORITY[a] ?? 99) - (HOME_TAB_PRIORITY[b] ?? 99));
  for (const [tab, col, hrefs] of orderedRules) {
    for (const h of hrefs) {
      const route = base(h);
      const f = found.get(route);
      if (!f || placed.has(route)) continue;
      placed.add(route);
      if (CREATE_ONLY.has(route)) continue;
      let dest = tab, column = col;
      if (tab === "transactions") {
        [dest, column] = route === "/accounts/gst-jv" ? ["gst", "returns"] : (TRANSACTION_HOME[col] ?? ["utilities", "other"]);
      } else if (tab in FOLDED) {
        const to = FOLDED[tab];
        if (to === null) continue;
        dest = to!;
      }
      if (route.startsWith("/reports")) { column = REPORT_GROUP[dest] ?? "other"; dest = "reports"; }
      else if (["/settings/backup", "/settings/import", "/settings/devices", "/settings/number-series"].includes(route)) dest = "utilities";
      put(dest, column, itemOf(route, h, f));
    }
  }
  for (const h of MASTER_SHORTCUTS) { const f = found.get(h); if (f) put("masters", "main", itemOf(h, h, f)); }
  // A screen no rule placed goes to its report or utility home, so nothing is lost. Hidden sections' screens stay hidden.
  for (const [h, f] of found) {
    if (placed.has(h) || CREATE_ONLY.has(h) || h.startsWith("/manufacturing") || h.startsWith("/projects") || (h.startsWith("/masters/") && MASTER_SHORTCUTS.includes(h))) continue;
    put(h.startsWith("/reports") ? "reports" : "utilities", "other", itemOf(h, h, f));
  }
  return ORDER.map((key) => {
    const order = COLUMN_ORDER[key] ?? [];
    const rank = (c: string) => { const i = order.indexOf(c); return i < 0 ? 99 : i; };
    return {
      key, letter: LETTERS[key]!, icon: TAB_ICONS[key]!, create: CREATE_BY_TAB[key] ?? [],
      columns: [...tabs.get(key)!.entries()].sort(([a], [b]) => rank(a) - rank(b)).map(([ck, items]) => ({ key: ck, items })),
    };
  });
}

export const MODULE_TABS: ModTab[] = build();
/** Every href the module menus reach, for coverage checks. */
export const MODULE_HREFS = new Set(MODULE_TABS.flatMap((t) => [...t.columns.flatMap((c) => c.items.map((i) => i.href)), ...t.create.map((c) => c.href)].filter(Boolean) as string[]));
export const ALL_MENU_HREFS = [...found.keys()];

/** The translation key of the label an existing screen carries in the menus (undefined for a screen with none). */
export const labelOf = (href: string): string | undefined => found.get(href)?.label;

/** The permission a screen needs, as the module menus know it (undefined when the menus do not list it). */
export const permissionOf = (href: string): string | undefined => found.get(base(href))?.permission;

/** The name the module menus show for a screen (plain English where the catalogue text is a leftover), for screens that list others by name. */
export const nameOf = (href: string): string | undefined =>
  MODULE_TABS.flatMap((t) => t.columns.flatMap((c) => c.items)).find((i) => i.href && base(i.href) === href)?.label ?? found.get(href)?.label;
