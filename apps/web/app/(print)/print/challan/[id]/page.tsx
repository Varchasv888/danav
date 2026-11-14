import { ChallanDocument, type ChallanData } from "@/components/print/ChallanDocument";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const d = await serverApi<ChallanData>(`/delivery-notes/${(await params).id}/print`);
  return { title: { absolute: `${d.invoice.number.replaceAll("/", "-")} ${d.invoice.customerName}` } };
}

export default async function PrintChallanPage({ params }: { params: Promise<{ id: string }> }) {
  const d = await serverApi<ChallanData>(`/delivery-notes/${(await params).id}/print?count=1`);
  return <ChallanDocument d={d} />;
}
