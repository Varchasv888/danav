import { getTranslations } from "next-intl/server";
import { DocList } from "@/components/purchase/DocList";

export async function generateMetadata() {
  return { title: (await getTranslations("purchase.receipts"))("title") };
}

export default async function Page({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const { from, to } = await searchParams;
  return <DocList kind="receipts" from={from} to={to} />;
}
