import { QuotationDetail } from "@/components/sales/QuotationDetail";

export default async function QuotationPage({ params }: { params: Promise<{ id: string }> }) {
  return <QuotationDetail id={(await params).id} kind="quotations" />;
}
