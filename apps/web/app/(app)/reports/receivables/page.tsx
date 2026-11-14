import { getTranslations } from "next-intl/server";
import { Outstanding } from "@/components/reports/Outstanding";

export async function generateMetadata() {
  return { title: (await getTranslations("nav"))("receivables") };
}

export default async function Page({ searchParams }: { searchParams: Promise<{ asOf?: string }> }) {
  const { asOf } = await searchParams;
  return <Outstanding kind="receivables" {...(asOf ? { asOf } : {})} />;
}
