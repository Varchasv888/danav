import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};
const barcode: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const importFile = (text: string, mode?: "add" | "replace") => post(`/stock-counts/${id.count}/import-scans`, { text, ...(mode ? { mode } : {}) });
const counted = async (key: string) => Number(((await get(`/stock-counts/${id.count}`)).lines as { itemId: string; counted: string }[]).find((l) => l.itemId === id[key])?.counted ?? NaN);

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("scanfile")).cookie;
  const setup = await get("/inventory/setup");
  id.main = setup.warehouses[0].id;
  const uom = setup.uoms.find((u: { code: string }) => u.code === "PCS").id;
  const lines: { itemId: string; warehouseId: string; qty: string; rate: string }[] = [];
  for (const [key, name] of [["a", "Scan Shirt A"], ["b", "Scan Shirt B"], ["c", "Scan Shirt C"]] as const) {
    const r = (await post("/items", { name, uomId: uom, saleRate: "500", barcode: `89000000${key === "a" ? "1" : key === "b" ? "2" : "3"}` })).body;
    id[key] = r.id;
    barcode[key] = r.barcode;
    lines.push({ itemId: r.id, warehouseId: id.main, qty: "10", rate: "300" });
  }
  await post("/stock-journals", { kind: "opening", lines });
  id.count = (await post("/stock-counts", { warehouseId: id.main, name: "Scanner night" })).body.id;
});
afterAll(() => t.close());

describe("scanner file import into a count", () => {
  it("adds up repeated scans and quantities, and says what it could not use", async () => {
    const file = [barcode.a, barcode.a, barcode.a, `${barcode.b},4`, `${barcode.b};2`, "", "0000000000000", "bad line with words", `${barcode.c}\t0`].join("\r\n");
    const r = await importFile(file);
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ lines: 8, codes: 3, matched: 2, pieces: "9" });
    expect(r.body.unknown).toEqual([{ code: "0000000000000", line: 7 }]);
    expect(r.body.skipped.map((s: { line: number }) => s.line)).toEqual([8, 9]);
    expect(await counted("a")).toBe(3);
    expect(await counted("b")).toBe(6);
    expect(await counted("c")).toBe(0); // a zero-quantity line is skipped, so it stays at its starting zero
  });

  it("add puts a second file on top; replace sets only the codes in the file", async () => {
    await importFile(`${barcode.a},2`, "add");
    expect(await counted("a")).toBe(5);
    await importFile(`${barcode.a},1`, "replace");
    expect(await counted("a")).toBe(1);
    expect(await counted("b")).toBe(6);
  });

  it("resets every line to zero while counting", async () => {
    expect(await counted("a")).toBe(1);
    const r = await post(`/stock-counts/${id.count}/reset`, {});
    expect(r.body).toEqual({ lines: 3 });
    expect(await counted("a")).toBe(0);
    expect(await counted("b")).toBe(0);
  });

  it("refuses a closed count and keeps businesses apart", async () => {
    await post(`/stock-counts/${id.count}/submit`, {});
    expect((await importFile(`${barcode.a}`)).body.error).toBe("count_closed");
    expect((await post(`/stock-counts/${id.count}/reset`, {})).body.error).toBe("count_closed");
    const other = (await t.signup("scanfile-other")).cookie;
    expect((await t.call(other, "POST", `/stock-counts/${id.count}/import-scans`, { text: barcode.a })).status).toBe(404);
  });
});
