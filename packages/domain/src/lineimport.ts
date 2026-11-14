/**
 * Bill lines from a text or CSV file: one line per item, `code,qty` or `code,qty,rate`, where code is a barcode, SKU or the exact item
 * name. Commas, semicolons and tabs all separate columns; a first row that is a heading is skipped; blank lines are ignored.
 * Repeats of the same item add up. Lines that cannot be used are reported with their line number, never guessed at.
 */
export interface ImportableItem { id: string; name: string; barcode?: string | null | undefined; sku?: string | null | undefined }

export interface LineImportResult {
  lines: { itemId: string; qty: string; rate?: string }[];
  unknown: { line: number; code: string }[];
  bad: { line: number; text: string }[];
}

const NUMBER = /^\d+(\.\d{1,4})?$/;

export function parseLineImport(text: string, items: ImportableItem[]): LineImportResult {
  const byCode = new Map<string, string>();
  for (const i of items) {
    for (const k of [i.barcode, i.sku, i.name]) if (k && !byCode.has(k.trim().toLowerCase())) byCode.set(k.trim().toLowerCase(), i.id);
  }
  const out = new Map<string, { itemId: string; qty: number; rate?: string }>();
  const unknown: LineImportResult["unknown"] = [];
  const bad: LineImportResult["bad"] = [];
  text.split(/\r?\n/).forEach((raw, idx) => {
    const line = idx + 1;
    const row = raw.trim();
    if (!row) return;
    // A quoted item name may contain a comma, so read quoted cells first.
    const cells = (row.match(/"([^"]*)"|[^,;\t]+/g) ?? []).map((c) => c.replace(/^"|"$/g, "").trim()).filter((c, i, a) => c !== "" || i < a.length);
    const [code = "", qtyText = "", rateText = ""] = cells;
    if (idx === 0 && !NUMBER.test(qtyText) && /^(code|barcode|sku|item|name)/i.test(code)) return; // heading row
    if (!NUMBER.test(qtyText) || Number(qtyText) <= 0 || (rateText && !NUMBER.test(rateText))) { bad.push({ line, text: row.slice(0, 60) }); return; }
    const itemId = byCode.get(code.toLowerCase());
    if (!itemId) { unknown.push({ line, code }); return; }
    const prev = out.get(itemId);
    if (prev) { prev.qty += Number(qtyText); if (rateText) prev.rate = rateText; } else out.set(itemId, { itemId, qty: Number(qtyText), ...(rateText ? { rate: rateText } : {}) });
  });
  return { lines: [...out.values()].map((v) => ({ itemId: v.itemId, qty: String(Math.round(v.qty * 10000) / 10000), ...(v.rate ? { rate: v.rate } : {}) })), unknown, bad };
}
