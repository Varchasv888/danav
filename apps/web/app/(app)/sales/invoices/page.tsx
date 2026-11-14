import { getTranslations } from "next-intl/server";
import { SalesList } from "@/components/sales/SalesList";

export async function generateMetadata() {
  return { title: (await getTranslations("sales.invoices"))("title") };
}

export default async function Page({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const { from, to } = await searchParams;
  return <SalesList kind="invoices" from={from} to={to} />;
}
