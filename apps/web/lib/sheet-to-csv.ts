/**
 * Turns the first sheet of an Excel statement into CSV text, so banks that only give .xlsx go through the same reader as the ones that give CSV.
 * Dates held as real dates are written as dd/mm/yyyy, and every cell is quoted so commas in narrations and amounts survive.
 */
function cell(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (v instanceof Date) return `${String(v.getUTCDate()).padStart(2, "0")}/${String(v.getUTCMonth() + 1).padStart(2, "0")}/${v.getUTCFullYear()}`;
  if (typeof v === "object") {
    const o = v as { richText?: { text: string }[]; result?: unknown; text?: unknown };
    if (o.richText) return o.richText.map((r) => r.text).join("");
    if (o.result !== undefined) return cell(o.result);
    if (o.text !== undefined) return cell(o.text);
    return "";
  }
  return String(v);
}

export async function sheetToCsv(file: File): Promise<string> {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(await file.arrayBuffer());
  const ws = wb.worksheets[0];
  if (!ws) throw new Error("empty");
  const lines: string[] = [];
  ws.eachRow({ includeEmpty: true }, (row) => {
    const out: string[] = [];
    for (let i = 1; i <= ws.columnCount; i++) out.push(`"${cell(row.getCell(i).value).replace(/"/g, '""').trim()}"`);
    lines.push(out.join(","));
  });
  return lines.join("\n");
}
