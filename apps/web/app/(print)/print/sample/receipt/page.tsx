import { ReceiptView } from "@/components/pos/ReceiptView";
import { sampleReceipt } from "@/lib/print-samples";
import { serverApi } from "@/lib/server-api";

/** The sample counter receipt shown beside the Thermal printer settings. */
export default async function SampleReceipt() {
  const prefs = await serverApi<Record<string, boolean | string>>("/settings/preferences").catch(() => undefined);
  return <ReceiptView r={sampleReceipt()} picker={false} preview prefs={prefs} paper={String(prefs?.["thermal.size"] ?? "68") as never} />;
}
