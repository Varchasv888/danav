import { existsSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";
import { MASTER_SHORTCUTS, MODULE_HREFS, MODULE_TABS, tidyLabel } from "../lib/modules-nav";

test("fixed barcode is reachable from a module menu", () => {
  expect(MODULE_HREFS.has("/inventory/fixed-barcode")).toBe(true);
});

test("ledger posting defaults are reachable from a module menu", () => {
  expect(MODULE_HREFS.has("/masters/ledger-parameters")).toBe(true);
});

test("TCS Tax Master and TCS Report are reachable from module menus", () => {
  expect(MODULE_HREFS.has("/masters/tcs-tax")).toBe(true);
  expect(MODULE_HREFS.has("/reports/tcs")).toBe(true);
});

test("Re-pack Box and Re-open Box are reachable from Inventory transaction menus", () => {
  expect(MODULE_HREFS.has("/inventory/repack-box")).toBe(true);
  expect(MODULE_HREFS.has("/inventory/reopen-box")).toBe(true);
});

test("stock-to-ledger reconciliation is reachable from Inventory reports", () => {
  expect(MODULE_HREFS.has("/reports/stock-ledger-reconciliation")).toBe(true);
});

test("English-only feature labels bypass locale catalog lookup", () => {
  const paths = ["/inventory/fixed-barcode", "/masters/ledger-parameters", "/masters/tcs-tax", "/inventory/repack-box", "/inventory/reopen-box", "/reports/tcs"];
  const labels = MODULE_TABS.flatMap((tab) => tab.columns.flatMap((column) => column.items))
    .filter((item) => paths.includes(item.href ?? "")).map((item) => item.label);
  expect(labels).toHaveLength(paths.length);
  expect(labels.every((label) => label.startsWith("en:"))).toBe(true);
});

test("the menu has the twelve sections, in order, and no hidden or folded section", () => {
  expect(MODULE_TABS.map((tab) => tab.key)).toEqual(["workspace", "masters", "inventory", "procurement", "sales", "accounting", "gst", "crm", "finance", "admin", "reports", "utilities"]);
});

test("no entry is greyed out and no screen appears twice", () => {
  const items = MODULE_TABS.flatMap((tab) => tab.columns.flatMap((column) => column.items));
  expect(items.some((item) => item.soon || !item.href)).toBe(false);
  // The only screens listed twice are the everyday masters, which Masters repeats from their working section.
  const hrefs = items.map((item) => item.href).filter((h) => !MASTER_SHORTCUTS.includes(h ?? ""));
  expect(new Set(hrefs).size).toBe(hrefs.length);
  for (const h of MASTER_SHORTCUTS) {
    const where = MODULE_TABS.filter((tab) => tab.columns.some((c) => c.items.some((i) => i.href === h))).map((tab) => tab.key);
    expect(where, h).toContain("masters");
    expect(where.length, h).toBeLessThanOrEqual(2);
  }
});

test("every Create new entry opens a screen that exists", () => {
  const app = join(__dirname, "..", "app", "(app)");
  for (const tab of MODULE_TABS) for (const entry of tab.create) {
    const route = entry.href.split("?")[0]!;
    expect(existsSync(join(app, ...route.split("/").filter(Boolean), "page.tsx")), `${route} has no page`).toBe(true);
  }
});

test("labels lose the wholesale tags and hold their acronyms", () => {
  expect(tidyLabel("Sales Order (Wh)")).toBe("Sales order");
  expect(tidyLabel("Delivery Order (D.O)")).toBe("Delivery order");
  expect(tidyLabel("GST Compliance")).toBe("GST compliance");
  expect(tidyLabel("OutStanding Receivable")).toBe("Outstanding receivable");
});

test("Create new shortcut keys are the real ones and not reused", () => {
  const keys = MODULE_TABS.flatMap((tab) => tab.create.map((entry) => entry.key)).filter(Boolean);
  expect(new Set(keys).size).toBe(keys.length);
  expect(keys.sort()).toEqual(["F4", "F5", "F6", "F7", "F8", "F9"]);
});
