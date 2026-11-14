import { QuotationDetail } from "@/components/sales/QuotationDetail";

export default async function ProformaPage({ params }: { params: Promise<{ id: string }> }) {
  return <QuotationDetail id={(await params).id} kind="proformas" />;
}
