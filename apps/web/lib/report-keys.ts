/** The list reports that share one page, by the key in their address. */
export const REPORT_KEYS = ["partyStatement", "allParties", "partyByItem", "saleByParty", "saleByGroup", "hsnSummary", "sacSummary", "lowStock", "stockDetail", "itemDetail", "itemDiscount", "expenseCategory", "expenseItem", "saleOrderItems", "loanStatement", "abcClass", "likelyDue", "saleByCategory", "stockByCategory", "discountReport", "bankStatement"] as const;
export type ReportKey = (typeof REPORT_KEYS)[number];
