import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ActivityForm, ActivityList, LeadForm, LeadStage, SendMessage, type Activity, type Lead, type Template } from "@/components/crm/Crm";
import { Card, PageHeader } from "@/components/ui";
import { rupees } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("crm.leads"))("title") };
}

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();
  const [lead, me, templates, messaging] = await Promise.all([
    serverApi<Lead & { owner: string | null; activities: Activity[] }>(`/crm/leads/${id}`), serverApi<Me>("/auth/me"), serverApi<Template[]>("/crm/templates"),
    serverApi<{ provider: string }>("/crm/messaging"),
  ]);
  const can = (p: string) => me.permissions.includes(p);
  return (
    <>
      <PageHeader title={lead.organisation || lead.name} subtitle={<><span className="font-mono">{lead.code}</span>{lead.organisation ? ` · ${lead.name}` : ""}{lead.phone ? ` · ${lead.phone}` : ""}{lead.value ? ` · ${rupees(lead.value)}` : ""}</>}
        actions={lead.customerId ? <Link href={`/crm/customers/${lead.customerId}`} className="text-sm text-primary hover:underline">{t("crm.customer.title")}</Link> : null} />
      <div className="flex flex-col gap-6">
        {can("crm.edit") ? <LeadStage lead={lead} /> : null}
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <Card className="flex flex-col gap-3">
            <h2 className="font-semibold">{t("crm.activities.title")}</h2>
            {can("crm.create") ? <ActivityForm leadId={lead.id} /> : null}
            <ActivityList items={lead.activities} />
          </Card>
          {can("crm.create") && lead.phone ? <SendMessage templates={templates} leadId={lead.id} defaults={[lead.name.split(" ")[0] ?? lead.name]} demo={messaging.provider === "demo"} /> : null}
        </div>
        {can("crm.edit") ? (
          <details>
            <summary className="cursor-pointer text-sm font-medium text-primary">{t("crm.leads.edit")}</summary>
            <div className="mt-3"><LeadForm lead={lead} /></div>
          </details>
        ) : null}
      </div>
    </>
  );
}
