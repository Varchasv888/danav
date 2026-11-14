import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Tx } from "@varchasv/db";
vi.mock("../src/services/accounting.js", () => ({ resolveCompany: async () => ({ id: "company" }), ensureChart: vi.fn() }));
vi.mock("../src/services/inventory.js", () => ({ ensureInventory: vi.fn(), postStockJournal: vi.fn() }));
vi.mock("../src/lib/audit.js", () => ({ audit: vi.fn() }));
import { importItems } from "../src/services/importer.js";
import { postStockJournal } from "../src/services/inventory.js";

function transaction(existing: { name: string; sku: string | null }[] = []) {
  const data = [[{ id: "box", code: "BOX" }], [{ id: "warehouse" }], existing];
  const inserted: Record<string, unknown>[] = [];
  const tx = {
    select: () => ({ from: () => ({ where: async () => data.shift() }) }),
    insert: () => ({ values: (row: Record<string, unknown>) => { inserted.push(row); return { returning: async () => [{ id: "tile" }] }; } }),
  };
  return { tx: tx as unknown as Tx, inserted };
}
const actor = { tenantId: "tenant", userId: "user" };
const tile = { name: "Valenza Max Gold 4x2", sku: "VAL-MAX-GOLD-4X2", size: "4x2", tileBrand: "Valenza", tileFinish: "Glossy", unit: "Box", openingQty: "110", purchaseRate: "250", openingRate: "240" };
beforeEach(() => vi.clearAllMocks());
describe("box based tile import", () => {
  it("previews without inserting items or posting stock", async () => {
    const { tx, inserted } = transaction();
    const result = await importItems(tx, actor, [tile], true);
    expect(result.results[0]?.status).toBe("create");
    expect(inserted).toHaveLength(0);
    expect(postStockJournal).not.toHaveBeenCalled();
  });
  it("posts the exact box quantity and rate and saves tile metadata", async () => {
    const { tx, inserted } = transaction();
    await importItems(tx, actor, [tile], false);
    expect(inserted[0]).toMatchObject({ uomId: "box", tileBrand: "Valenza", tileFinish: "Glossy", size: "4x2", sku: tile.sku });
    expect(postStockJournal).toHaveBeenCalledWith(tx, actor, expect.objectContaining({ lines: [{ itemId: "tile", warehouseId: "warehouse", qty: "110", rate: "240" }] }));
  });
  it("skips existing SKUs and reports invalid rates before writes", async () => {
    const { tx, inserted } = transaction([{ name: "Renamed tile", sku: tile.sku }]);
    expect((await importItems(tx, actor, [tile], false)).results[0]?.status).toBe("exists");
    expect(inserted).toHaveLength(0);
    const other = transaction();
    expect((await importItems(other.tx, actor, [{ ...tile, purchaseRate: "invalid" }], false)).results[0]?.error).toBe("invalid_rate");
    expect(other.inserted).toHaveLength(0);
  });
});
