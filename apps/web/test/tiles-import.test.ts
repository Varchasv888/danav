import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { parseCsv, toRecords } from "../lib/import-csv";

describe("tiles inventory CSV", () => {
  it("maps every product in the supplied 28-row inventory", () => {
    const csv = readFileSync(new URL("./fixtures/tiles-inventory.csv", import.meta.url), "utf8");
    const rows = toRecords("items", parseCsv(csv));
    expect(rows).toHaveLength(28);
    expect(new Set(rows.map((r) => r.name)).size).toBe(28);
    expect(rows.every((r) => r.sku && r.tileBrand && r.size && r.unit === "Box" && /^\d+$/.test(r.openingQty!))).toBe(true);
  });
  it("preserves tile identity and imports quantities as boxes without area conversion", () => {
    const [row] = toRecords("items", parseCsv("\uFEFFSKU,Brand,Product_Name,Size,Finish,UOM,Quantity\r\nVAL-MAX-GOLD-4X2,Valenza,Max Gold,4x2,Glossy,Box,110\r\n"));
    expect(row).toMatchObject({ name: "Valenza Max Gold 4x2", tileBrand: "Valenza", tileFinish: "Glossy", size: "4x2", sku: "VAL-MAX-GOLD-4X2", unit: "Box", openingQty: "110" });
  });
  it("keeps different sizes separate and accepts the original import template", () => {
    const rows = toRecords("items", parseCsv("Brand,Product_Name,Size,UOM,Quantity\nValenza,Max Gold,4x2,Box,110\nValenza,Max Gold,2x2,Box,5"));
    expect(new Set(rows.map((r) => r.name)).size).toBe(2);
    expect(toRecords("items", parseCsv('name,unit,opening_qty\n"Tile, ivory",BOX,4'))[0]).toMatchObject({ name: "Tile, ivory", unit: "BOX", openingQty: "4" });
  });
});
