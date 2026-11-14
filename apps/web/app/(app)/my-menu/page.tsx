import { AlertTriangle, Banknote, BellRing, CheckCircle2, CreditCard, Info, QrCode, Wallet } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { MyMenu } from "@/components/launcher/MyMenu";
import { MyNotes, type Note } from "@/components/launcher/MyNotes";
import { PageHeader } from "@/components/ui";
import { rupees, todayIso } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

interface Dashboard {
  sales?: { today: string; yesterday: string };
  money?: { receivables: { total: string; overdue: string }; payables: { total: string; dueIn7Days: string } };
  alerts: { key: string; level: "info" | "warning" | "danger"; params: Record<string, string | number>; href: string }[];
}
interface Counter { bills: number; total: string; cash: string; upi: string; card: string; returns: string }

export async function generateMetadata() {
  return { title: (await getTranslations("launcher"))("myMenu") };
}

/** Home: the user's own tiles, and a rail of today's money and what is waiting. Every figure links to its page. */
export default async function MyMenuPage() {
  const t = await getTranslations();
  const today = todayIso();
  const me = await serverApi<Me>("/auth/me");
  const canSales = me.permissions.includes("sales.view");
  const [menu, d, counter, notes] = await Promise.all([
    serverApi<{ items: string[] | null }>("/me/menu"), serverApi<Dashboard>(`/analytics/dashboard?date=${today}`),
    canSales ? serverApi<Counter>(`/pos/summary?date=${today}`).catch(() => null) : Promise.resolve(null),
    serverApi<Note[]>("/notes").catch(() => [] as Note[]),
  ]);
  const order = { danger: 0, warning: 1, info: 2 };
  const alerts = [...d.alerts].sort((a, b) => order[a.level] - order[b.level]).slice(0, 6);
  const icon = {
    danger: <AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />,
    warning: <AlertTriangle className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />,
    info: <Info className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />,
  };
  const row = (Icon: typeof Wallet, label: string, value: string, href: string, tone = "") => (
    <Link href={href} className="flex items-center gap-2.5 rounded-md border border-border bg-surface-3 px-2.5 py-2 hover:border-primary/50 hover:bg-primary-soft">
      <Icon className={`size-4 shrink-0 ${tone || "text-muted"}`} aria-hidden />
      <span className="flex-1 text-[0.9286rem]">{label}</span>
      <span className={`num font-semibold ${tone}`}>{rupees(value)}</span>
    </Link>
  );
  const sales = d.sales ? Number(d.sales.today) : null;
  const yesterday = d.sales ? Number(d.sales.yesterday) : 0;
  const change = sales !== null && yesterday > 0 ? ((sales - yesterday) / yesterday) * 100 : null;

  return (
    <>
      <PageHeader title={t("launcher.myMenu")} subtitle={t("launcher.myMenuSubtitle", { name: me.user.name.split(" ")[0] ?? "" })} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <MyMenu permissions={me.permissions} menu={menu.items} />
        <aside className="flex flex-col gap-4" aria-label={t("launcher.waiting")}>
          {d.sales || d.money ? (
            <section className="rounded-lg border border-border bg-surface p-4" aria-labelledby="mm-money">
              <h2 id="mm-money" className="mb-3 text-[1rem] font-semibold">{t("launcher.money")}</h2>
              {sales !== null ? (
                <Link href="/reports/sales-register" className="mb-3 block rounded-md border border-border bg-surface-3 p-3 hover:border-primary/50">
                  <span className="text-[0.8571rem] text-muted">{t("launcher.salesToday")}</span>
                  <span className="num mt-0.5 block text-[1.7rem] leading-tight font-bold tracking-tight">{rupees(d.sales!.today)}</span>
                  <span className="mt-1 flex flex-wrap gap-x-4 text-[0.8571rem] text-muted">
                    {change !== null ? <span className={change >= 0 ? "text-success" : "text-danger"}>{t("launcher.vsYesterday", { pct: `${change >= 0 ? "+" : ""}${change.toFixed(1)}` })}</span> : null}
                    {counter ? <span>{t("launcher.counterBills", { n: counter.bills })}</span> : null}
                  </span>
                </Link>
              ) : null}
              <div className="flex flex-col gap-1.5">
                {counter && Number(counter.cash) ? row(Banknote, t("launcher.cashToday"), counter.cash, "/pos/bills") : null}
                {counter && Number(counter.upi) ? row(QrCode, t("launcher.upiToday"), counter.upi, "/pos/bills") : null}
                {counter && Number(counter.card) ? row(CreditCard, t("launcher.cardToday"), counter.card, "/pos/bills") : null}
                {d.money && Number(d.money.receivables.overdue) ? row(BellRing, t("launcher.overdueToCollect"), d.money.receivables.overdue, "/reports/receivables", "text-danger") : null}
                {d.money ? row(Wallet, t("launcher.toCollect"), d.money.receivables.total, "/reports/receivables") : null}
                {d.money ? row(Wallet, t("launcher.toPay"), d.money.payables.total, "/reports/payables") : null}
              </div>
            </section>
          ) : null}
          <section className="rounded-lg border border-border bg-surface p-4" aria-labelledby="mm-wait">
            <h2 id="mm-wait" className="mb-2 flex items-center gap-2 text-[1rem] font-semibold">
              {t("launcher.waiting")}
              {alerts.length ? <span className="grid size-5 place-items-center rounded-full bg-danger text-[0.7857rem] font-bold text-white">{alerts.length}</span> : null}
            </h2>
            {alerts.length ? (
              <ul className="flex flex-col gap-1.5 text-[0.9286rem]">
                {alerts.map((a, i) => (
                  <li key={`${a.key}-${i}`}>
                    <Link href={a.href} className="flex items-start gap-2.5 rounded-md border border-border bg-surface-3 px-2.5 py-2 hover:border-primary/50 hover:bg-primary-soft">
                      {icon[a.level]}
                      <span>{t(`alerts.${a.key}`, Object.fromEntries(Object.entries(a.params).map(([k, v]) => [k, k === "amount" ? rupees(String(v)) : v])))}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <p className="flex items-center gap-2 text-sm text-success"><CheckCircle2 className="size-4" aria-hidden />{t("dashboard.k.noAlerts")}</p>}
            <Link href="/dashboard" className="mt-3 inline-block text-[0.9286rem] font-medium text-primary hover:underline">{t("launcher.fullDashboard")}</Link>
          </section>
          <MyNotes notes={notes} />
        </aside>
      </div>
    </>
  );
}
