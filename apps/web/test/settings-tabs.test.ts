import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { labelOf } from "../lib/modules-nav";
import { SETTINGS_TABS, settingsTab, tabOfPath } from "../lib/settings-tabs";

describe("settings tabs", () => {
  const root = join(__dirname, "..", "app", "(app)");
  const links = SETTINGS_TABS.flatMap((t) => t.groups.flatMap((g) => g.links.map((l) => l.href)));

  it("sends every link to a screen that exists and has a name in the menus", () => {
    for (const href of links) {
      expect(existsSync(join(root, ...href.split("/").filter(Boolean), "page.tsx")), href).toBe(true);
      expect(labelOf(href), href).toBeTruthy();
    }
  });
  it("has each tab once, in order, and finds a tab by name", () => {
    expect(SETTINGS_TABS.map((t) => t.key)).toEqual(["general", "transaction", "print", "taxes", "message", "party", "item", "service", "accounting"]);
    expect(settingsTab("print")?.controls).toBe("print");
    expect(settingsTab("nothing")).toBeUndefined();
  });
  it("names the tab a settings screen belongs to", () => {
    expect(tabOfPath("/settings/print")).toBe("print");
    expect(tabOfPath("/settings/number-series")).toBe("transaction");
    expect(tabOfPath("/settings/gst")).toBe("taxes");
    expect(tabOfPath("/inventory/stock-limits")).toBe("item");
  });
});
