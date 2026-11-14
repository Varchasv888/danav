/** Excel opens a UTF-8 CSV with a byte-order mark; cells that look like formulas are made plain text. */
export function toCsv(rows: (string | number | null | undefined)[][]) {
  const cell = (v: string | number | null | undefined) => {
    let s = v === null || v === undefined ? "" : String(v);
    if (/^[=+\-@\t\r]/.test(s) && !/^-?\d+(\.\d+)?$/.test(s)) s = `'${s}`;
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return `﻿${rows.map((r) => r.map(cell).join(",")).join("\r\n")}`;
}

/** Saves rows as a CSV file from the browser. */
export function downloadCsv(name: string, rows: (string | number | null | undefined)[][]) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" }));
  a.download = `${name.replace(/[^\w-]+/g, "-")}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}
