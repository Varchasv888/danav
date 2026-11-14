import { TaxDocument, printTitle, type PrintData } from "@/components/print/TaxDocument";
import { serverApi } from "@/lib/server-api";

/** What the business chose on the Settings screen; the defaults if it cannot be read. */
const loadPrefs = () => serverApi<Record<string, boolean | string>>("/settings/preferences").catch(() => undefined);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return printTitle(await serverApi<PrintData>(`/quotations/${(await params).id}/print`));
}

export default async function PrintQuotationPage({ params }: { params: Promise<{ id: string }> }) {
  const d = await serverApi<PrintData>(`/quotations/${(await params).id}/print?count=1`);
  return <TaxDocument d={d} kind={d.invoice.kind === "proforma" ? "proforma" : "quotation"} prefs={await loadPrefs()} />;
}
