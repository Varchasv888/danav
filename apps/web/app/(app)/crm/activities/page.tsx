import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ActivityList, type Activity } from "@/components/crm/Crm";
import { Card, PageHeader } from "@/components/ui";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("crm.activities"))("title") };
}

export default async function FollowUpsPage({ searchParams }: { searchParams: Promise<{ all?: string }> }) {
  const all = (await searchParams).all === "1";
  const t = await getTranslations();
  const items = await serverApi<Activity[]>(`/crm/activities${all ? "" : "?open=true"}`);
  return (
    <>
      <PageHeader title={t("crm.activities.title")} subtitle={t("crm.activities.subtitle")} />
      <nav className="mb-4 flex gap-2">
        <Link href="?" className={`rounded-full px-3 py-1 text-sm ${!all ? "bg-primary text-on-primary" : "bg-surface-2"}`}>{t("crm.activities.open")}</Link>
        <Link href="?all=1" className={`rounded-full px-3 py-1 text-sm ${all ? "bg-primary text-on-primary" : "bg-surface-2"}`}>{t("crm.activities.all")}</Link>
      </nav>
      <Card><ActivityList items={items} showWho /></Card>
    </>
  );
}
