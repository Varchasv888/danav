import { cookies } from "next/headers";
import { Shell } from "@/components/Shell";
import { ScreenScaleApplier } from "@/components/settings/ScreenScale";
import { NumericFocus } from "@/components/NumericFocus";
import { ToastProvider } from "@/components/Toast";
import { WorkingDateProvider } from "@/components/WorkingDate";
import { todayIso } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";
import { WORKING_DATE_COOKIE } from "@/lib/working-date";

/**
 * The working date a person chose, if they may: an earlier day needs the right to change the date, a later one the right to use a future date.
 * The server checks every document's date again, so this only decides what forms start with.
 */
function workingDate(raw: string | undefined, today: string, permissions: string[]) {
  if (!raw || !/^\d{4}-\d{2}-\d{2}$/.test(raw) || raw === today) return null;
  if (raw < today) return permissions.includes("special.changeDate") ? raw : null;
  return permissions.includes("special.futureDate") ? raw : null;
}

// Every page under (app) requires a session; serverApi redirects to /login on 401.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const me = await serverApi<Me>("/auth/me");
  const today = todayIso();
  const chosen = workingDate((await cookies()).get(WORKING_DATE_COOKIE)?.value, today, me.permissions);
  return (
    <ToastProvider><WorkingDateProvider date={chosen} today={today} canSet={me.permissions.includes("special.changeDate") || me.permissions.includes("special.futureDate")}>
      <ScreenScaleApplier />
      <NumericFocus />
      <Shell userName={me.user.name} tenantId={me.tenantId} tenants={me.tenants} permissions={me.permissions}>
        {children}
      </Shell>
    </WorkingDateProvider></ToastProvider>
  );
}
