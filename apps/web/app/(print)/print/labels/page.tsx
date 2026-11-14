"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { LabelPages, type LabelJob } from "@/components/inventory/LabelSheet";

/** The label job saved by Inventory > Labels, laid out on its label stock; prints itself once drawn. */
export default function PrintLabelsPage() {
  const t = useTranslations("labels");
  const [job, setJob] = useState<LabelJob | null | undefined>(undefined);
  useEffect(() => {
    try { setJob(JSON.parse(localStorage.getItem("varchasv.labels.job") ?? "null") as LabelJob | null); } catch { setJob(null); }
  }, []);
  // ?preview=1 shows the sheets without opening the print dialog.
  useEffect(() => {
    if (!job || new URLSearchParams(location.search).has("preview")) return;
    const id = setTimeout(() => window.print(), 400);
    return () => clearTimeout(id);
  }, [job]);
  if (job === undefined) return null;
  if (!job || !job.items.length) return <p className="p-8 text-sm">{t("nothingToPrint")}</p>;
  return <LabelPages job={job} />;
}
