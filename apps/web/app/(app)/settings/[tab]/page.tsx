import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PasscodeSettings } from "@/components/settings/PasscodeSettings";
import { PrefControls } from "@/components/settings/PrefControls";
import { PrintWorkspace } from "@/components/settings/PrintWorkspace";
import { ScreenScale } from "@/components/settings/ScreenScale";
import { Card, PageHeader } from "@/components/ui";
import { menuLabelText } from "@/lib/menu";
import { nameOf, permissionOf, tidyLabel } from "@/lib/modules-nav";
import { settingsTab } from "@/lib/settings-tabs";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params;
  const t = await getTranslations("settingsUi");
  return { title: settingsTab(tab) ? t(`tab.${tab}`) : t("title") };
}

/** One tab of the Settings screen: the settings that live here as controls, and the rest as links to the screens where they are kept. */
export default async function SettingsTabPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab: key } = await params;
  const tab = settingsTab(key);
  if (!tab) notFound();
  const t = await getTranslations();
  const me = await serverApi<Me>("/auth/me");
  const canEdit = me.permissions.includes("settings.edit");
  const prefs = tab.controls === "print" || tab.controls === "transaction" || tab.controls === "view" ? await serverApi<Record<string, boolean | string>>("/settings/preferences") : null;
  const passcodeSet = tab.controls === "transaction" && me.permissions.includes("settings.view") ? (await serverApi<{ set: boolean }>("/settings/passcode").catch(() => ({ set: false }))).set : false;
  const groups = tab.groups.map((g) => ({
    key: g.key,
    links: g.links.map((l) => ({ href: l.href, label: nameOf(l.href), need: permissionOf(l.href) }))
      .filter((l) => l.label && (!l.need || me.permissions.includes(l.need))).map((l) => ({ href: l.href, text: tidyLabel(menuLabelText(l.label!, t)) })),
  })).filter((g) => g.links.length);

  return (
    <>
      <PageHeader title={t(`settingsUi.tab.${tab.key}`)} subtitle={t(`settingsUi.hint.${tab.key}`)} />
      {tab.controls === "print" && prefs ? <PrintWorkspace initial={prefs} canEdit={canEdit} /> : null}
      {tab.controls === "transaction" && prefs ? <><PrefControls tab="transaction" initial={prefs} canEdit={canEdit} /><PasscodeSettings isSet={passcodeSet} canEdit={canEdit} /></> : null}
      {tab.controls === "view" ? <>{prefs ? <PrefControls tab="general" initial={prefs} canEdit={canEdit} /> : null}<ScreenScale /></> : null}
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {groups.map((g) => (
          <Card key={g.key} className="p-0">
            <h2 className="border-b border-border px-4 py-3 text-[1rem] font-semibold">{t(`settingsUi.group.${g.key}`)}</h2>
            <ul>
              {g.links.map((l) => (
                <li key={l.href} className="border-b border-rule last:border-0">
                  <Link href={l.href} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-primary">
                    {l.text}<ChevronRight className="size-4 shrink-0 text-muted" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
