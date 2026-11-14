/**
 * The Settings screen as tabs on a rail: General, Transaction, Print, Taxes and GST, Messages, Party, Item, Service and Accounting. Each tab holds groups
 * of settings. A setting is either one that lives on this screen (a preference) or a link to the screen where it is kept, so nothing is shown that
 * does not work and nothing is kept in two places.
 */
export interface SettingsLink { href: string }
export interface SettingsGroup { key: string; links: SettingsLink[] }
export interface SettingsTab { key: string; groups: SettingsGroup[]; /** True when the tab also draws controls (print options, screen scale). */ controls?: "print" | "view" | "transaction" }

export const SETTINGS_TABS: SettingsTab[] = [
  { key: "general", controls: "view", groups: [
    { key: "business", links: [{ href: "/settings/company" }, { href: "/settings/financial-years" }, { href: "/settings/inventory" }, { href: "/settings/team" }, { href: "/settings/controls" }] },
    { key: "data", links: [{ href: "/settings/backup" }, { href: "/settings/audit-log" }, { href: "/settings/import" }, { href: "/settings/devices" }] },
  ] },
  { key: "transaction", controls: "transaction", groups: [
    { key: "numbering", links: [{ href: "/settings/number-series" }] },
    { key: "approvals", links: [{ href: "/settings/approvals" }, { href: "/settings/process-locks" }, { href: "/settings/dated-changes" }, { href: "/settings/sensitive-changes" }] },
    { key: "counter", links: [{ href: "/settings/pos" }, { href: "/settings/expenses" }] },
  ] },
  { key: "print", controls: "print", groups: [] },
  { key: "taxes", groups: [
    { key: "gst", links: [{ href: "/settings/gst" }, { href: "/masters/hsn" }, { href: "/gst/slab-exceptions" }] },
    { key: "deducted", links: [{ href: "/masters/tcs-tax" }, { href: "/accounts/tds" }] },
  ] },
  { key: "message", groups: [
    { key: "templates", links: [{ href: "/crm/templates" }, { href: "/crm/communications" }, { href: "/crm/messages" }] },
  ] },
  { key: "party", groups: [
    { key: "parties", links: [{ href: "/masters/customers" }, { href: "/masters/suppliers" }, { href: "/sales/price-lists" }] },
    { key: "loyalty", links: [{ href: "/pos/loyalty" }, { href: "/sales/commission-rules" }] },
  ] },
  { key: "item", groups: [
    { key: "items", links: [{ href: "/inventory/styles/setup" }, { href: "/inventory/items" }, { href: "/masters/hsn" }] },
    { key: "pricing", links: [{ href: "/inventory/margin-bands" }, { href: "/inventory/branch-prices" }, { href: "/inventory/stock-limits" }] },
  ] },
  { key: "service", groups: [
    { key: "aftersale", links: [{ href: "/sales/repairs" }, { href: "/sales/service-customers" }, { href: "/pos/alterations" }] },
  ] },
  { key: "accounting", groups: [
    { key: "books", links: [{ href: "/accounts/chart" }, { href: "/masters/ledger-parameters" }, { href: "/accounts/recurring" }] },
    { key: "period", links: [{ href: "/accounts/close" }, { href: "/settings/financial-years" }] },
  ] },
];

export const settingsTab = (key: string) => SETTINGS_TABS.find((t) => t.key === key);

/** The tab a settings-area screen belongs to, so the rail can mark it when that screen is open. */
export function tabOfPath(path: string): string | undefined {
  const direct = SETTINGS_TABS.find((t) => path === `/settings/${t.key}`);
  if (direct) return direct.key;
  return SETTINGS_TABS.find((t) => t.groups.some((g) => g.links.some((l) => path === l.href || path.startsWith(`${l.href}/`))))?.key;
}
