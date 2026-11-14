import { getTranslations } from "next-intl/server";
import { DocList } from "@/components/purchase/DocList";

export async function generateMetadata() {
  return { title: (await getTranslations("purchase.orders"))("title") };
}

export default async function Page({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const { from, to } = await searchParams;
  return <DocList kind="orders" from={from} to={to} />;
}
