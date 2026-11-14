import { TaxDocument } from "@/components/print/TaxDocument";
import { sampleInvoice } from "@/lib/print-samples";
import { serverApi } from "@/lib/server-api";

/** The sample invoice shown beside the Print settings: the real document component with made-up figures and the business's saved choices. */
export default async function SampleInvoice() {
  const prefs = await serverApi<Record<string, boolean | string>>("/settings/preferences").catch(() => undefined);
  return <TaxDocument d={sampleInvoice()} kind="invoice" prefs={prefs} preview />;
}
