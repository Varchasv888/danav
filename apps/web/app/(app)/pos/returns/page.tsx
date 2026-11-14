import { getTranslations } from "next-intl/server";
import { ReturnForm, ReturnsList, type ReturnBill, type ReturnsReport } from "@/components/pos/Returns";
import type { Terminal } from "@/components/pos/Billing";
import { Alert, Button, Input, PageHeader } from "@/components/ui";
import { todayIso } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("posReturns"))("title") };
}

/** Returns and exchanges: find the bill, take the goods back, and see the day's returns. */
export default async function ReturnsPage({ searchParams }: { searchParams: Promise<{ bill?: string; date?: string }> }) {
  const { bill: number, date: raw } = await searchParams;
  const date = raw && /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : todayIso();
  const t = await getTranslations("posReturns");
  const [report, terminals, me] = await Promise.all([
    serverApi<ReturnsReport>(`/pos/returns?from=${date}&to=${date}`), serverApi<Terminal[]>("/pos/terminals"), serverApi<Me>("/auth/me"),
  ]);
  let bill: ReturnBill | null = null;
  let missing = false;
  if (number && /^[\w/-]{3,16}$/.test(number)) {
    try { bill = await serverApi<ReturnBill>(`/pos/bills/lookup?number=${encodeURIComponent(number)}`); } catch { missing = true; }
  }
  const counters = terminals.filter((x) => !x.archived && !x.deviceId).map((x) => ({ id: x.id, code: x.code, name: x.name, open: !!x.openSession }));
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="flex flex-col gap-6">
        {me.permissions.includes("sales.create") ? (
          <form className="flex flex-wrap items-end gap-3">
            <Input name="bill" defaultValue={number ?? ""} placeholder={t("billNumber")} aria-label={t("billNumber")} className="w-56 font-mono uppercase" required />
            <Button type="submit" variant="outline">{t("find")}</Button>
          </form>
        ) : null}
        {missing ? <Alert>{t("notFound")}</Alert> : null}
        {bill ? <ReturnForm key={bill.id} bill={bill} terminals={counters} /> : null}
        <form className="flex items-end gap-3">
          <Input type="date" name="date" defaultValue={date} aria-label={t("date")} className="w-44" />
          <Button type="submit" variant="outline">{t("show")}</Button>
        </form>
        <ReturnsList report={report} />
      </div>
    </>
  );
}
