/**
 * Real Excel files from a register. The workbook is built the way an accountant expects to receive one: Arial throughout,
 * a title and a note on what the rows are, a header row that stays in view and filters, dates as dates, money as numbers
 * (negatives in brackets, zero as a dash), and a total row written as a SUBTOTAL formula so it follows the filter.
 * exceljs is loaded only when someone presses Export, so it costs nothing on a screen that never exports.
 */
export type XlsxType = "text" | "date" | "money" | "count";
export interface XlsxColumn { label: string; type: XlsxType; width?: number }
export type XlsxCell = string | number | null;

const MONEY = '#,##0.00;(#,##0.00);"-"';
const COUNT = '#,##0;(#,##0);"-"';
const DATE = "dd-mmm-yyyy";

export interface SheetSpec { title: string; note?: string; columns: XlsxColumn[]; rows: XlsxCell[][]; totalLabel?: string }
function addSheet(wb: import("exceljs").Workbook, opts: SheetSpec) {
  const ws = wb.addWorksheet(opts.title.slice(0, 31));
  const font = { name: "Arial", size: 10 };
  const last = opts.columns.length;

  ws.getCell("A1").value = opts.title;
  ws.getCell("A1").font = { name: "Arial", size: 14, bold: true };
  if (opts.note) { ws.getCell("A2").value = opts.note; ws.getCell("A2").font = { ...font, color: { argb: "FF586579" } }; }

  const headRow = 4;
  const head = ws.getRow(headRow);
  opts.columns.forEach((c, i) => {
    const cell = head.getCell(i + 1);
    cell.value = c.label;
    cell.font = { ...font, bold: true };
    cell.alignment = { horizontal: c.type === "money" || c.type === "count" ? "right" : "left", vertical: "middle" };
    cell.border = { bottom: { style: "thin", color: { argb: "FF172B4D" } } };
  });
  head.height = 20;

  opts.rows.forEach((r, ri) => {
    const row = ws.getRow(headRow + 1 + ri);
    opts.columns.forEach((c, i) => {
      const v = r[i];
      const cell = row.getCell(i + 1);
      cell.font = font;
      if (v === null || v === undefined || v === "") return;
      if (c.type === "money" || c.type === "count") { cell.value = Number(v); cell.numFmt = c.type === "money" ? MONEY : COUNT; cell.alignment = { horizontal: "right" }; }
      else if (c.type === "date") { cell.value = new Date(`${v}T00:00:00Z`); cell.numFmt = DATE; cell.alignment = { horizontal: "left" }; }
      else cell.value = String(v);
    });
  });

  const first = headRow + 1;
  const end = headRow + opts.rows.length;
  if (opts.totalLabel) {
    const totalRow = ws.getRow(end + 2);
    totalRow.getCell(1).value = opts.totalLabel;
    totalRow.getCell(1).font = { ...font, bold: true };
    opts.columns.forEach((c, i) => {
      if (c.type !== "money" && c.type !== "count") return;
      const col = ws.getColumn(i + 1).letter;
      // SUBTOTAL(109) ignores rows hidden by a filter, so the total always matches what is on screen in Excel.
      const result = opts.rows.reduce((s, r) => s + (Number(r[i]) || 0), 0);
      const cell = totalRow.getCell(i + 1);
      cell.value = opts.rows.length ? { formula: `SUBTOTAL(109,${col}${first}:${col}${end})`, result } : 0;
      cell.numFmt = c.type === "money" ? MONEY : COUNT;
      cell.font = { ...font, bold: true };
      cell.alignment = { horizontal: "right" };
      cell.border = { top: { style: "thin", color: { argb: "FF172B4D" } } };
    });
  }

  opts.columns.forEach((c, i) => {
    const longest = Math.max(c.label.length, ...opts.rows.slice(0, 200).map((r) => String(r[i] ?? "").length));
    ws.getColumn(i + 1).width = c.width ?? Math.min(Math.max(c.type === "date" ? 13 : c.type === "money" ? 15 : 12, longest + 2), 48);
  });
  ws.views = [{ state: "frozen", ySplit: headRow, xSplit: 0 }];
  if (opts.rows.length) ws.autoFilter = { from: { row: headRow, column: 1 }, to: { row: end, column: last } };
  ws.pageSetup = { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0, paperSize: 9 };
  ws.headerFooter.oddFooter = "&L&A&RPage &P of &N";
}

/** One workbook, one sheet per spec: a register, or a return with its tables side by side. */
export async function downloadXlsxSheets(name: string, sheets: SheetSpec[]) {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  wb.creator = "Varchasv ERP";
  wb.created = new Date();
  for (const sh of sheets) addSheet(wb, sh);
  const buf = await wb.xlsx.writeBuffer();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
  a.download = `${name.replace(/[^\w-]+/g, "-")}.xlsx`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function downloadXlsx(opts: { name: string; title: string; note?: string; columns: XlsxColumn[]; rows: XlsxCell[][]; totalLabel: string }) {
  await downloadXlsxSheets(opts.name, [{ title: opts.title, note: opts.note, columns: opts.columns, rows: opts.rows, totalLabel: opts.totalLabel }]);
}
