import { getTranslations } from "next-intl/server";
import { GstWorkspace, type Calendar, type EInvoiceAlerts, type Imports, type Rule37 } from "@/components/gst/GstWorkspace";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("gstwork"))("title") };
}

export default async function GstWorkspacePage() {
  const t = await getTranslations("gstwork");
  const [calendar, imports, alerts, rule, me] = await Promise.all([
    serverApi<Calendar>("/gst/work/calendar"), serverApi<Imports>("/gst/work/2b"), serverApi<EInvoiceAlerts>("/gst/work/einvoice-alerts").catch(() => null), serverApi<Rule37>("/gst/work/rule37"), serverApi<Me>("/auth/me"),
  ]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <GstWorkspace calendar={calendar} imports={imports} alerts={alerts} rule={rule} canSubmit={me.permissions.includes("gst.submit")} />
    </>
  );
}
