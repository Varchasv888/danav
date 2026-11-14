/**
 * The sub-menu on the left of every Reports screen: reports in named groups, each pointing at a real screen. A group or entry appears only
 * when the person may open it (the permission comes from the module menus, so the two never disagree).
 */
export interface ReportEntry { key: string; href: string; /** Query values that must match for the entry to count as the open one. */ match?: Record<string, string> }
export interface ReportGroup { key: string; items: ReportEntry[] }

export const REPORTS_MENU: ReportGroup[] = [
  { key: "transactions", items: [
    { key: "sale", href: "/reports/sales-register" },
    { key: "purchase", href: "/reports/transactions?type=purchase", match: { type: "purchase" } },
    { key: "dayBook", href: "/reports/day-book" },
    { key: "allTransactions", href: "/reports/transactions" },
    { key: "profitLoss", href: "/reports/profit-loss" },
    { key: "billProfit", href: "/reports/bill-profit" },
    { key: "cashFlow", href: "/reports/cash-flow-statement" },
    { key: "bankStatement", href: "/reports/list/bankStatement" },
    { key: "trialBalance", href: "/reports/trial-balance" },
    { key: "balanceSheet", href: "/reports/balance-sheet" },
    { key: "bookRegisters", href: "/reports/books" },
  ] },
  { key: "party", items: [
    { key: "partyStatement", href: "/reports/list/partyStatement" },
    { key: "allParties", href: "/reports/list/allParties" },
    { key: "partyByItem", href: "/reports/list/partyByItem" },
    { key: "saleByParty", href: "/reports/list/saleByParty" },
    { key: "saleByGroup", href: "/reports/list/saleByGroup" },
    { key: "discountReport", href: "/reports/list/discountReport" },
    { key: "likelyDue", href: "/reports/list/likelyDue" },
    { key: "receivables", href: "/reports/receivables" },
    { key: "payables", href: "/reports/payables" },
    { key: "partyProfit", href: "/reports/profitability?by=customer", match: { by: "customer" } },
    { key: "interest", href: "/reports/interest" },
  ] },
  { key: "gst", items: [
    { key: "returns", href: "/gst/returns" },
    { key: "statements", href: "/gst/workspace" },
    { key: "annual", href: "/gst/compliance" },
    { key: "hsnSummary", href: "/reports/list/hsnSummary" },
    { key: "sacSummary", href: "/reports/list/sacSummary" },
    { key: "gstRate", href: "/reports/gst-rate" },
  ] },
  { key: "stock", items: [
    { key: "stockSummary", href: "/inventory/stock" },
    { key: "lowStock", href: "/reports/list/lowStock" },
    { key: "stockDetail", href: "/reports/list/stockDetail" },
    { key: "saleByCategory", href: "/reports/list/saleByCategory" },
    { key: "stockByCategory", href: "/reports/list/stockByCategory" },
    { key: "itemDetail", href: "/reports/list/itemDetail" },
    { key: "itemDiscount", href: "/reports/list/itemDiscount" },
    { key: "abcClass", href: "/reports/list/abcClass" },
    { key: "itemProfit", href: "/reports/profitability?by=item", match: { by: "item" } },
    { key: "styleProfit", href: "/reports/profitability" },
    { key: "stockAgeing", href: "/reports/stock-ageing" },
    { key: "stockMovement", href: "/reports/stock-movement" },
    { key: "colourSize", href: "/reports/colour-size" },
    { key: "discounts", href: "/reports/discounts" },
  ] },
  { key: "taxes", items: [
    { key: "tcs", href: "/reports/tcs" },
    { key: "tds", href: "/accounts/tds" },
    { key: "msme", href: "/reports/msme" },
  ] },
  { key: "expenses", items: [
    { key: "expenseCategory", href: "/reports/list/expenseCategory" },
    { key: "expenseItem", href: "/reports/list/expenseItem" },
  ] },
  { key: "orders", items: [
    { key: "saleOrders", href: "/reports/sales-order-register" },
    { key: "saleOrderItems", href: "/reports/list/saleOrderItems" },
    { key: "backorders", href: "/sales/backorders" },
  ] },
  { key: "loans", items: [
    { key: "loanStatement", href: "/reports/list/loanStatement" },
  ] },
  { key: "owner", items: [
    { key: "cfo", href: "/reports/cfo" },
    { key: "yearEnd", href: "/reports/year-end" },
    { key: "integrity", href: "/reports/integrity" },
    { key: "all", href: "/reports" },
  ] },
];

/** The path of an entry without its query. */
export const entryPath = (e: ReportEntry) => e.href.split("?")[0]!;

/** Whether an entry is the open one: same path, and any query values it names agree. Of several entries on one path the most specific wins. */
export function activeEntry(path: string, query: URLSearchParams): ReportEntry | undefined {
  const all = REPORTS_MENU.flatMap((g) => g.items).filter((e) => entryPath(e) === path);
  const hit = all.filter((e) => Object.entries(e.match ?? {}).every(([k, v]) => query.get(k) === v));
  return hit.sort((a, b) => Object.keys(b.match ?? {}).length - Object.keys(a.match ?? {}).length)[0];
}
