import { getFormatter, getTranslations } from "next-intl/server";
import { VerifyAudit } from "@/components/settings/VerifyAudit";
import { Card, PageHeader } from "@/components/ui";
import { serverApi } from "@/lib/server-api";

interface Entry { id: number; action: string; entity: string; entityId: string | null; before: unknown; after: Record<string, unknown> | null; at: string; userName: string | null }

export async function generateMetadata() {
  return { title: (await getTranslations("audit"))("title") };
}

export default async function AuditLogPage() {
  const t = await getTranslations("audit");
  const format = await getFormatter();
  const entries = await serverApi<Entry[]>("/audit-log?limit=100");
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <VerifyAudit />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="py-2 pr-4 font-medium">{t("when")}</th>
                <th className="py-2 pr-4 font-medium">{t("who")}</th>
                <th className="py-2 pr-4 font-medium">{t("what")}</th>
                <th className="py-2 font-medium">{t("details")}</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-b border-border align-top last:border-0">
                  <td className="py-2.5 pr-4 whitespace-nowrap">{format.dateTime(new Date(e.at), { dateStyle: "medium", timeStyle: "short" })}</td>
                  <td className="py-2.5 pr-4">{e.userName ?? "-"}</td>
                  <td className="py-2.5 pr-4">{t.has(`actions.${e.action}`) ? t(`actions.${e.action}`) : e.action} · {e.entity}</td>
                  <td className="py-2.5 font-mono text-xs break-all text-muted">{e.after ? JSON.stringify(e.after) : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
