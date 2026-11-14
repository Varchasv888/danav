import { AlertTriangle, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { Button, Card, Input, PageHeader } from "@/components/ui";
import { fyStart, rupees, todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("checks"))("title") };
}

interface Row { key: string; date: string; params: Record<string, string>; href: string | null }
const MONEY = new Set(["amount", "rate", "cost"]);

export default async function ChecksPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const sp = await searchParams;
  const valid = (d?: string) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : undefined);
  const to = valid(sp.to) ?? todayIso();
  const from = valid(sp.from) ?? fyStart(to);
  const t = await getTranslations();
  const format = await getFormatter();
  const r = await serverApi<{ rows: Row[] }>(`/analytics/checks?from=${from}&to=${to}`);
  return (
    <>
      <PageHeader icon={ShieldAlert} print title={t("checks.title")} subtitle={t("checks.subtitle")}
        actions={(
          <form className="flex items-end gap-3">
            <Input type="date" name="from" defaultValue={from} aria-label={t("common.from")} className="w-44" />
            <Input type="date" name="to" defaultValue={to} aria-label={t("common.to")} className="w-44" />
            <Button type="submit" variant="outline">{t("common.apply")}</Button>
          </form>
        )} />
      <Card className="p-0">
        <ul className="divide-y divide-border">
          {r.rows.map((x, i) => {
            const params = Object.fromEntries(Object.entries(x.params).map(([k, v]) => [k, MONEY.has(k) ? rupees(v) : v]));
            const text = t(`checks.kinds.${x.key}`, params);
            return (
              <li key={i} className="flex items-start gap-3 px-5 py-3 text-sm">
                <AlertTriangle className={`mt-0.5 size-4 shrink-0 ${x.key.startsWith("cash") ? "text-danger" : "text-accent"}`} aria-hidden />
                <span className="w-28 shrink-0 text-muted">{format.dateTime(new Date(`${x.date}T00:00:00`), { dateStyle: "medium" })}</span>
                {x.href ? <Link href={x.href} className="hover:underline">{text}</Link> : <span>{text}</span>}
              </li>
            );
          })}
          {!r.rows.length ? <li className="px-5 py-10 text-center text-success">{t("checks.none")}</li> : null}
        </ul>
      </Card>
    </>
  );
}
