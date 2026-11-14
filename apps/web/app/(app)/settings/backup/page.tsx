import { DatabaseBackup, Download } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { EncryptedBackup } from "@/components/settings/EncryptedBackup";
import { ScheduledBackups, type BackupState } from "@/components/settings/ScheduledBackups";
import { Card, PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("backup"))("title") };
}

/** The owner's own copy of everything: one download, open formats, nothing locked in. */
export default async function BackupPage() {
  const t = await getTranslations("backup");
  const me = await serverApi<Me>("/auth/me");
  const canExport = me.permissions.includes("company.export");
  const schedule = canExport ? await serverApi<BackupState>("/backups") : null;
  return (
    <>
      <PageHeader icon={DatabaseBackup} title={t("title")} subtitle={t("subtitle")} />
      <Card className="flex max-w-2xl flex-col gap-4">
        <div>
          <h2 className="mb-2 font-semibold">{t("what")}</h2>
          <ul className="list-disc space-y-1 pl-5 text-[0.9286rem]">
            <li>{t("item1")}</li>
            <li>{t("item2")}</li>
            <li>{t("item3")}</li>
          </ul>
          <p className="mt-3 text-[0.9286rem] text-muted">{t("leftOut")}</p>
          <p className="mt-1 text-[0.9286rem] text-muted">{t("keep")}</p>
        </div>
        {canExport ? (
          <div className="flex flex-wrap items-center gap-3">
            <a href="/api/export/business.zip" download className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-[0.9286rem] font-semibold text-white hover:bg-primary-hover">
              <Download className="size-4" aria-hidden />{t("download")}
            </a>
            <span className="text-[0.8571rem] text-muted">{t("slow")}</span>
          </div>
        ) : null}
        {canExport ? <EncryptedBackup /> : null}
        {schedule ? <ScheduledBackups state={schedule} /> : null}
        <p className="border-t border-border pt-3 text-[0.9286rem]"><Link href="/settings/audit-log" className="font-semibold text-primary hover:underline">{t("auditLink")}</Link></p>
      </Card>
    </>
  );
}
