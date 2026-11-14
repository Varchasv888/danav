import { getTranslations } from "next-intl/server";
import { Close, type Checklist, type DayClose, type Snapshots } from "@/components/accounts/Close";
import { PageHeader } from "@/components/ui";
import { todayIso } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("close"))("title") };
}

export default async function ClosePage({ searchParams }: { searchParams: Promise<{ period?: string; date?: string }> }) {
  const sp = await searchParams;
  const t = await getTranslations("close");
  const today = todayIso();
  const period = sp.period ?? today.slice(0, 7);
  const date = sp.date ?? today;
  const [checklist, snaps, day, me] = await Promise.all([
    serverApi<Checklist>(`/close/checklist?period=${period}`), serverApi<Snapshots>(`/close/snapshots?period=${period}`),
    serverApi<DayClose>(`/pos/day-close?date=${date}`), serverApi<Me>("/auth/me"),
  ]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Close period={period} date={date} checklist={checklist} snapshots={snaps} day={day} canApprove={me.permissions.includes("accounts.approve")} canSignCash={me.permissions.includes("sales.approve")} />
    </>
  );
}
