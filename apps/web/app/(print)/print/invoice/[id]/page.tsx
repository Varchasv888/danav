import { redirect } from "next/navigation";
import { TaxDocument, printTitle, type PrintData } from "@/components/print/TaxDocument";
import { serverApi } from "@/lib/server-api";

/** What the business chose on the Settings screen; the defaults if it cannot be read. */
const loadPrefs = () => serverApi<Record<string, boolean | string>>("/settings/preferences").catch(() => undefined);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return printTitle(await serverApi<PrintData>(`/sales-invoices/${(await params).id}/print`));
}

export default async function PrintInvoicePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ as?: string }> }) {
  const id = (await params).id;
  const prefs = await loadPrefs();
  // The printer chosen as the default in Settings: an invoice goes to the roll printer first unless the regular page was asked for.
  if (prefs?.["print.defaultPrinter"] === "thermal" && (await searchParams).as !== "regular") redirect(`/print/invoice/${id}/thermal`);
  const d = await serverApi<PrintData>(`/sales-invoices/${id}/print?count=1`);
  return <TaxDocument d={d} kind="invoice" prefs={prefs} />;
}
