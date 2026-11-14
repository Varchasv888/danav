import { describe, expect, it } from "vitest";
import { parseLineImport } from "../src/lineimport.js";

const items = [
  { id: "a", name: "Cotton Shirt, Navy M", barcode: "8901", sku: "CS-NV-M" },
  { id: "b", name: "Belt", barcode: "8902", sku: null },
];

describe("line import", () => {
  it("matches by barcode, SKU or name and adds repeats up", () => {
    const r = parseLineImport("8901,2\nCS-NV-M,3,450\nbelt;1\n", items);
    expect(r.lines).toEqual([{ itemId: "a", qty: "5", rate: "450" }, { itemId: "b", qty: "1" }]);
    expect(r.unknown).toEqual([]);
    expect(r.bad).toEqual([]);
  });

  it("reads tabs, quoted names with a comma, blank lines and a heading row", () => {
    const r = parseLineImport('code,qty,rate\r\n\r\n"Cotton Shirt, Navy M",4,500\r\n8902\t2\r\n', items);
    expect(r.lines).toEqual([{ itemId: "a", qty: "4", rate: "500" }, { itemId: "b", qty: "2" }]);
  });

  it("reports unknown codes and unusable lines by line number without guessing", () => {
    const r = parseLineImport("9999,1\n8901,zero\n8902,0\n8901\n8902,2,abc\n8902,2", items);
    expect(r.unknown).toEqual([{ line: 1, code: "9999" }]);
    expect(r.bad.map((b) => b.line)).toEqual([2, 3, 4, 5]);
    expect(r.lines).toEqual([{ itemId: "b", qty: "2" }]);
  });

  it("an empty file gives nothing", () => {
    expect(parseLineImport("", items)).toEqual({ lines: [], unknown: [], bad: [] });
  });
});
