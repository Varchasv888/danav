"use client";

import { Download } from "lucide-react";
import { Button } from "../ui";

/** Saves the return exactly as the GST portal / offline tool expects it. */
export function DownloadJson({ data, filename, label }: { data: unknown; filename: string; label: string }) {
  return (
    <Button variant="outline" onClick={() => {
      const url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: "application/json" }));
      const a = Object.assign(document.createElement("a"), { href: url, download: filename });
      a.click();
      URL.revokeObjectURL(url);
    }}>
      <Download className="size-4" aria-hidden />{label}
    </Button>
  );
}
