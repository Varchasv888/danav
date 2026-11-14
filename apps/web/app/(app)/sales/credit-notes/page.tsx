import { getTranslations } from "next-intl/server";
import { SalesList } from "@/components/sales/SalesList";

export async function generateMetadata() {
  return { title: (await getTranslations("sales.creditNotes"))("title") };
}

export default async function Page({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const { from, to } = await searchParams;
  return <SalesList kind="creditNotes" from={from} to={to} />;
}
