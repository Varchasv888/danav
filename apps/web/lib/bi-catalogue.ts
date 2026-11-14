/**
 * What the Business Intelligence workspace offers today. Each section lists the screens that really answer its
 * questions and says honestly how much of it exists: "live" (the questions are answered from live data),
 * "partial" (some are) or "planned" (none yet). Nothing here is a number; the figures come from the API.
 */
export type BiStatus = "live" | "partial" | "planned";
export interface BiSection { id: string; status: BiStatus; links: string[] }

export const BI_SECTIONS: BiSection[] = [
  { id: "executive", status: "live", links: ["/insights", "/reports/cfo", "/reports/profitability", "/reports/store-results"] },
  { id: "sales", status: "live", links: ["/insights", "/reports/sales-register", "/reports/daily-sales", "/reports/discounts", "/reports/registers"] },
  { id: "finance", status: "partial", links: ["/reports/cfo", "/accounts/working-capital", "/reports/receivables", "/reports/payables", "/reports/cash-flow-statement"] },
  { id: "inventory", status: "partial", links: ["/reports/stock-ageing", "/reports/stock-movement", "/reports/colour-size", "/inventory/stock-finance", "/reports/registers"] },
  { id: "procurement", status: "partial", links: ["/reports/registers", "/reports/payables", "/reports/msme"] },
  { id: "retail", status: "partial", links: ["/reports/store-results", "/reports/daily-sales", "/pos/loyalty"] },
  { id: "production", status: "planned", links: [] },
  { id: "customer", status: "partial", links: ["/insights", "/reports/receivables", "/pos/loyalty"] },
  { id: "workforce", status: "partial", links: ["/hr/attendance-alerts", "/hr/statutory"] },
  { id: "compliance", status: "partial", links: ["/gst/workspace", "/gst/compliance", "/accounts/tds", "/reports/msme"] },
  { id: "studio", status: "planned", links: [] },
  { id: "explorer", status: "partial", links: ["/reports/builder"] },
  { id: "dictionary", status: "live", links: ["/bi/kpis"] },
  { id: "scheduled", status: "partial", links: ["/reports/saved"] },
  { id: "alerts", status: "partial", links: ["/reports/checks", "/reports/integrity"] },
];

/** The measures the live insights endpoint computes, with where the definition is in the source. */
export interface Kpi { id: string; unit: "rupees" | "count" | "percent"; grain: string; aggregation: string; source: string; permission: string; dimensions: string[] }
export const KPIS: Kpi[] = [
  { id: "sales", unit: "rupees", grain: "saleLine", aggregation: "sum", source: "apps/api/src/services/insights.ts:31", permission: "reports.view", dimensions: ["day", "month", "weekday", "hour", "salesman", "design", "brand", "customer", "tender"] },
  { id: "pieces", unit: "count", grain: "saleLine", aggregation: "sum", source: "apps/api/src/services/insights.ts:52", permission: "reports.view", dimensions: ["day", "weekday", "design", "brand", "salesman"] },
  { id: "bills", unit: "count", grain: "document", aggregation: "count", source: "apps/api/src/services/insights.ts:54", permission: "reports.view", dimensions: ["period"] },
  { id: "avgBill", unit: "rupees", grain: "period", aggregation: "ratio", source: "apps/api/src/services/insights.ts:66", permission: "reports.view", dimensions: ["period"] },
  { id: "avgRate", unit: "rupees", grain: "period", aggregation: "ratio", source: "apps/api/src/services/insights.ts:66", permission: "reports.view", dimensions: ["period"] },
  { id: "grossProfit", unit: "rupees", grain: "saleLine", aggregation: "sum", source: "apps/api/src/services/insights.ts:63", permission: "reports.view", dimensions: ["period"] },
  { id: "profitPct", unit: "percent", grain: "period", aggregation: "ratio", source: "apps/api/src/services/insights.ts:67", permission: "reports.view", dimensions: ["period"] },
  { id: "purchases", unit: "rupees", grain: "purchaseLine", aggregation: "sum", source: "apps/api/src/services/insights.ts:57", permission: "reports.view", dimensions: ["period"] },
  { id: "stockValue", unit: "rupees", grain: "itemAtDate", aggregation: "sum", source: "apps/api/src/services/insights.ts:86", permission: "reports.view", dimensions: ["asOfDate"] },
  { id: "receivable", unit: "rupees", grain: "partyAtDate", aggregation: "sum", source: "apps/api/src/services/insights.ts:91", permission: "reports.view", dimensions: ["asOfDate"] },
  { id: "payable", unit: "rupees", grain: "partyAtDate", aggregation: "sum", source: "apps/api/src/services/insights.ts:92", permission: "reports.view", dimensions: ["asOfDate"] },
  { id: "lastYear", unit: "count", grain: "period", aggregation: "comparison", source: "apps/api/src/services/insights.ts:14", permission: "reports.view", dimensions: ["period"] },
];
