import { Suspense } from "react";
import { ReportDecimals } from "@/components/reports/ReportDecimals";
import { ReportsMenu } from "@/components/reports/ReportsMenu";
import { permissionOf } from "@/lib/modules-nav";
import { REPORTS_MENU } from "@/lib/reports-menu";
import { serverApi, type Me } from "@/lib/server-api";

/** Every report opens beside the report list, so moving between reports is one click and the list never disappears. */
export default async function ReportsLayout({ children }: { children: React.ReactNode }) {
  const me = await serverApi<Me>("/auth/me");
  const prefs = await serverApi<Record<string, string | boolean>>("/settings/preferences").catch(() => ({} as Record<string, string | boolean>));
  const decimals = Number(prefs["general.amountDecimals"] ?? 2);
  // An entry shows only if the person may open the screen behind it; the same permission the module menus use.
  const allowed = REPORTS_MENU.flatMap((g) => g.items).filter((e) => {
    const need = permissionOf(e.href) ?? (e.href.startsWith("/reports/list/") ? "reports.view" : undefined);
    return !need || me.permissions.includes(need);
  }).map((e) => e.href);
  return (
    <div className="grid gap-5 lg:grid-cols-[15.5rem_minmax(0,1fr)]">
      <aside className="min-w-0 overflow-hidden rounded-lg border border-border bg-surface print:hidden">
        <Suspense fallback={null}><ReportsMenu allowed={allowed} /></Suspense>
      </aside>
      <div className="min-w-0"><ReportDecimals value={decimals}>{children}</ReportDecimals></div>
    </div>
  );
}
