/** RFC 4180 CSV: quoted fields, doubled quotes, commas and newlines inside quotes, CRLF. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const src = text.replace(/^﻿/, ""); // Excel adds a byte-order mark
  for (let i = 0; i < src.length; i++) {
    const ch = src[i]!;
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((c) => c.trim())) rows.push(row);
      row = [];
    } else field += ch;
  }
  row.push(field);
  if (row.some((c) => c.trim())) rows.push(row);
  return rows;
}

const COLUMNS: Record<"parties" | "items" | "opening", { header: string; key: string }[]> = {
  opening: [{ header: "name", key: "name" }, { header: "debit", key: "debit" }, { header: "credit", key: "credit" }],
  parties: [
    { header: "name", key: "name" }, { header: "type", key: "type" }, { header: "gstin", key: "gstin" }, { header: "state_code", key: "stateCode" },
    { header: "phone", key: "phone" }, { header: "email", key: "email" }, { header: "opening_balance", key: "openingBalance" }, { header: "credit_days", key: "creditDays" },
    { header: "address", key: "address" }, { header: "city", key: "city" }, { header: "pincode", key: "pincode" },
  ],
  items: [
    { header: "brand", key: "tileBrand" }, { header: "finish", key: "tileFinish" }, { header: "sku", key: "sku" }, { header: "size", key: "size" },
    { header: "name", key: "name" }, { header: "hsn", key: "hsn" }, { header: "gst_rate", key: "gstRate" }, { header: "unit", key: "unit" }, { header: "kind", key: "kind" },
    { header: "purchase_rate", key: "purchaseRate" }, { header: "sale_rate", key: "saleRate" }, { header: "opening_qty", key: "openingQty" }, { header: "opening_rate", key: "openingRate" },
  ],
};
/** Turns CSV rows into objects using the header row (case- and space-insensitive). */
export function toRecords(kind: "parties" | "items" | "opening", rows: string[][]) {
  const [header, ...body] = rows;
  if (!header) return [];
  const norm = header.map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  return body.map((r) => {
    const rec: Record<string, string> = {};
    for (const col of COLUMNS[kind]) {
      const aliases: Record<string, string[]> = kind === "items" ? { name: ["name", "product_name", "item_name"], unit: ["unit", "uom"], opening_qty: ["opening_qty", "quantity", "qty"] } : {};
      const idx = (aliases[col.header] ?? [col.header]).map((h) => norm.indexOf(h)).find((i) => i >= 0) ?? -1;
      const v = idx >= 0 ? (r[idx] ?? "").trim() : "";
      if (v) rec[col.key] = kind === "parties" && col.key === "type" ? v.toLowerCase() : kind === "items" && col.key === "kind" ? v.toLowerCase() : v;
    }
    if (kind === "items" && norm.includes("product_name") && !norm.includes("name") && rec.name) {
      const brand = (r[norm.indexOf("brand")] ?? "").trim();
      rec.name = [brand, rec.name, rec.size].filter(Boolean).join(" ");
    }
    return rec;
  });
}

