"use client";

import { FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui";
import { downloadXlsxSheets, type SheetSpec } from "@/lib/xlsx-export";

/** Saves a return's tables as a formatted Excel workbook (a sheet per table), for the accountant's working papers and the file. */
export function DownloadXlsx({ filename, sheets, label, className }: { filename: string; sheets: SheetSpec[]; label: string; className?: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <Button className={className} variant="outline" disabled={busy} onClick={async () => { setBusy(true); try { await downloadXlsxSheets(filename, sheets); } finally { setBusy(false); } }}>
      <FileSpreadsheet className="size-4" aria-hidden />{label}
    </Button>
  );
}
