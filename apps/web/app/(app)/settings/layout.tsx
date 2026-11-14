import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { SettingsRail, type RailHit } from "@/components/settings/SettingsRail";
import { menuLabelText } from "@/lib/menu";
import { nameOf, permissionOf, tidyLabel } from "@/lib/modules-nav";
import { SETTINGS_TABS } from "@/lib/settings-tabs";
import { serverApi, type Me } from "@/lib/server-api";

/** Every settings screen opens beside the tabs, so moving between them is one click and the search covers them all. */
export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations();
  const me = await serverApi<Me>("/auth/me");
  const hits: RailHit[] = [];
  for (const tab of SETTINGS_TABS) {
    for (const g of tab.groups) {
      for (const l of g.links) {
        const need = permissionOf(l.href);
        const label = nameOf(l.href);
        if (!label || (need && !me.permissions.includes(need))) continue;
        if (!hits.some((h) => h.href === l.href)) hits.push({ href: l.href, label: tidyLabel(menuLabelText(label, t)), tab: tab.key });
      }
    }
  }
  return (
    <div className="grid gap-5 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <aside className="min-w-0 print:hidden"><Suspense fallback={null}><SettingsRail hits={hits} /></Suspense></aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
