import { AlertTriangle, CheckCircle2, Circle, Info, Sparkles } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { GstCalculator } from "@/components/GstCalculator";
import { HomeShortcuts } from "@/components/launcher/HomeShortcuts";
import { PageHeader } from "@/components/ui";
import { rupees, todayIso } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

interface Company { id: string; pan: string | null; legalName: string | null; branches: { gstin: string | null; stateCode: string }[] }
interface Dashboard {
  sales?: { today: string; yesterday: string; mtd: string; lastMonthToDate: string; daily: { date: string; amount: string }[]; topCustomers: { id: string; name: string; amount: string }[]; topItems: { id: string; name: string; qty: string; amount: string }[] };
  money?: { cashBank: { id: string; name: string; balance: string }[]; receivables: { total: string; overdue: string }; payables: { total: string; dueIn7Days: string }; topDebtors: { id: string; name: string; balance: string }[] };
  profit?: { income: string; expenses: string; grossProfit: string; netProfit: string };
  stock?: { value: string; belowReorder: number };
  approvals: { claims?: number; timesheets?: number; leave?: number };
  crm?: { openLeads: number; followUpsDue: number; pipeline: string; weighted: string };
  alerts: { key: string; level: "info" | "warning" | "danger"; params: Record<string, string | number>; href: string }[];
}

/** ₹ in a lighter weight than the digits, so the eye lands on the amount. */
function Amount({ value, className = "" }: { value: string; className?: string }) {
  const negative = Number(value) < 0;
  const text = rupees(value.replace(/^-/, "")).replace(/^₹\s?/, "");
  return (
    <span className={`num whitespace-nowrap ${negative ? "text-danger" : ""} ${className}`}>
      {negative ? "−" : ""}<span className="mr-0.5 font-normal opacity-55">₹</span>{text}
    </span>
  );
}

/** The last 30 days of sales; today is the inked bar. */
function SalesChart({ days, label, formatDay }: { days: { date: string; amount: string }[]; label: string; formatDay: (d: string) => string }) {
  const max = Math.max(1, ...days.map((d) => Number(d.amount)));
  const w = days.length * 12;
  return (
    <figure className="flex flex-col gap-2">
      <svg viewBox={`0 0 ${w} 100`} className="h-40 w-full" role="img" aria-label={label} preserveAspectRatio="none">
        {[25, 50, 75].map((y) => <line key={y} x1={0} x2={w} y1={y} y2={y} className="stroke-rule" strokeWidth={0.6} vectorEffect="non-scaling-stroke" />)}
        <line x1={0} x2={w} y1={99.5} y2={99.5} className="stroke-border" strokeWidth={1} vectorEffect="non-scaling-stroke" />
        {days.map((d, i) => {
          const h = (Number(d.amount) / max) * 92;
          const today = i === days.length - 1;
          return (
            <rect key={d.date} x={i * 12 + 2} y={100 - Math.max(h, 0.8)} width={8} height={Math.max(h, 0.8)} rx={1.5}
              className={today ? "fill-khata" : Number(d.amount) > 0 ? "fill-primary/70" : "fill-border"}>
              <title>{`${formatDay(d.date)}: ${rupees(d.amount)}`}</title>
            </rect>
          );
        })}
      </svg>
      <figcaption className="flex justify-between text-xs text-muted">
        <span>{formatDay(days[0]!.date)}</span>
        <span>{formatDay(days[Math.floor(days.length / 2)]!.date)}</span>
        <span>{formatDay(days[days.length - 1]!.date)}</span>
      </figcaption>
    </figure>
  );
}

export async function generateMetadata() {
  return { title: (await getTranslations("nav"))("dashboard") };
}

export default async function Dashboard() {
  const t = await getTranslations();
  const format = await getFormatter();
  const [me, companies, d, pins] = await Promise.all([
    serverApi<Me>("/auth/me"), serverApi<Company[]>("/companies"), serverApi<Dashboard>(`/analytics/dashboard?date=${todayIso()}`),
    serverApi<{ items: string[] | null }>("/me/menu"),
  ]);
  const business = me.tenants.find((x) => x.tenantId === me.tenantId)?.name ?? "";
  const company = companies[0];
  const setup = [
    { done: !!company?.pan && !!company?.legalName, label: t("dashboard.setupCompany"), href: "/settings/company" },
    { done: !!company && company.branches.every((b) => b.gstin), label: t("dashboard.setupBranch"), href: "/settings/company" },
  ];
  const formatDay = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { day: "numeric", month: "short" });
  const cashTotal = d.money ? d.money.cashBank.reduce((s, c) => s + Number(c.balance), 0).toFixed(2) : "0";

  // The statement line: where the money is, in the order an owner reads it.
  const statement = [
    ...(d.money ? [
      { label: t("dashboard.k.cashBank"), value: cashTotal, note: t("dashboard.accounts", { count: d.money.cashBank.length }), href: d.money.cashBank.length === 1 ? `/reports/ledger/${d.money.cashBank[0]!.id}` : "/banking" },
      { label: t("dashboard.k.receivables"), value: d.money.receivables.total, note: Number(d.money.receivables.overdue) ? t("dashboard.k.overdue", { amount: rupees(d.money.receivables.overdue) }) : null, alarm: Number(d.money.receivables.overdue) > 0, href: "/reports/receivables" },
      { label: t("dashboard.k.payables"), value: d.money.payables.total, note: Number(d.money.payables.dueIn7Days) ? t("dashboard.k.dueSoon", { amount: rupees(d.money.payables.dueIn7Days) }) : null, href: "/reports/payables" },
    ] : []),
    ...(d.profit ? [{ label: t("dashboard.k.profit"), value: d.profit.netProfit, note: t("dashboard.k.grossProfit", { amount: rupees(d.profit.grossProfit) }), href: "/reports/profit-loss" }] : []),
  ];
  const secondary = [
    ...(d.stock ? [{ label: t("dashboard.k.stockValue"), value: d.stock.value, note: d.stock.belowReorder ? t("dashboard.k.lowStock", { count: d.stock.belowReorder }) : null, href: "/inventory/stock" }] : []),
    ...(d.crm ? [{ label: t("dashboard.k.pipeline"), value: d.crm.pipeline, note: t("dashboard.k.weighted", { amount: rupees(d.crm.weighted), count: d.crm.openLeads }), href: "/crm/leads" }] : []),
  ];
  const tiles: { label: string; value: string; note: string | null; href: string; alarm?: boolean }[] = [
    ...(d.sales ? [
      { label: t("dashboard.k.salesToday"), value: d.sales.today, note: t("dashboard.k.yesterday", { amount: rupees(d.sales.yesterday) }), href: "/reports/sales-register" },
      { label: t("dashboard.k.salesMonth"), value: d.sales.mtd, note: t("dashboard.k.vsLastMonth", { amount: rupees(d.sales.lastMonthToDate) }), href: "/reports/sales-register" },
    ] : []),
    ...statement.map((s) => ({ label: s.label, value: s.value, note: s.note, href: s.href, alarm: "alarm" in s ? !!s.alarm : false })),
    ...secondary,
  ];
  const waiting = [
    ...(d.approvals.claims ? [{ label: t("dashboard.k.claims"), n: d.approvals.claims, href: "/expenses?status=submitted" }] : []),
    ...(d.approvals.timesheets ? [{ label: t("dashboard.k.timesheets"), n: d.approvals.timesheets, href: "/projects/timesheets?status=submitted" }] : []),
    ...(d.approvals.leave ? [{ label: t("dashboard.k.leave"), n: d.approvals.leave, href: "/hr/leave" }] : []),
  ];
  const icon = {
    danger: <AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />,
    warning: <AlertTriangle className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />,
    info: <Info className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />,
  };
  const order = { danger: 0, warning: 1, info: 2 };
  const alerts = [...d.alerts].sort((a, b) => order[a.level] - order[b.level]);

  const list = (title: string, rows: { key: string; name: string; href?: string; extra?: string; amount: string }[]) => (
    <section key={title} className="flex flex-col p-5">
      <h2 className="mb-2 text-[0.9375rem] font-semibold">{title}</h2>
      <ol className="flex flex-col text-sm">
        {rows.map((r) => (
          <li key={r.key} className="flex items-baseline gap-3 border-b border-rule py-2 last:border-0">
            <span className="min-w-0 flex-1 truncate">
              {r.href ? <Link href={r.href} className="hover:underline">{r.name}</Link> : r.name}
              {r.extra ? <span className="num ml-1.5 text-muted">{r.extra}</span> : null}
            </span>
            <Amount value={r.amount} />
          </li>
        ))}
      </ol>
    </section>
  );

  const lists = [
    d.sales?.topCustomers.length ? list(t("dashboard.k.topCustomers"), d.sales.topCustomers.map((c) => ({ key: c.id, name: c.name, href: `/crm/customers/${c.id}`, amount: c.amount }))) : null,
    d.sales?.topItems.length ? list(t("dashboard.k.topItems"), d.sales.topItems.map((c) => ({ key: c.id, name: c.name, extra: `× ${Number(c.qty)}`, amount: c.amount }))) : null,
    d.money?.topDebtors.length ? list(t("dashboard.k.topDebtors"), d.money.topDebtors.map((c) => ({ key: c.id, name: c.name, href: `/crm/customers/${c.id}`, amount: c.balance }))) : null,
  ].filter(Boolean);

  return (
    <>
      <PageHeader
        title={t("dashboard.greeting", { name: me.user.name.split(" ")[0] ?? "" })}
        subtitle={t("dashboard.subtitle", { business })}
        actions={
          <Link href="/assistant" className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3.5 text-sm font-medium hover:border-primary/35">
            <Sparkles className="size-4" aria-hidden />{t("dashboard.k.ask")}
          </Link>
        }
      />

      <div className="flex flex-col gap-4">
        <HomeShortcuts permissions={me.permissions} menu={pins.items} />
        {setup.some((s) => !s.done) ? (
          <section className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-accent/40 bg-accent-soft px-5 py-3.5">
            <h2 className="font-semibold">{t("dashboard.setupTitle")}</h2>
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {setup.map((s) => (
                <li key={s.label}>
                  <Link href={s.href} className="flex items-center gap-2 text-sm hover:underline">
                    {s.done ? <CheckCircle2 className="size-4 text-success" aria-hidden /> : <Circle className="size-4 text-muted" aria-hidden />}
                    <span className={s.done ? "text-muted line-through" : ""}>{s.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {tiles.length ? (
          <section aria-label={t("dashboard.position")} className="grid grid-cols-[repeat(auto-fill,minmax(12.5rem,1fr))] gap-2.5">
            {tiles.map((s) => (
              <Link key={s.label} href={s.href} className="group surface-raised flex flex-col gap-1 rounded-xl border border-border/80 bg-surface px-4 py-3.5 transition-transform hover:-translate-y-0.5 hover:border-primary/50">
                <span className="text-[0.8571rem] font-semibold tracking-wide text-muted uppercase group-hover:text-text">{s.label}</span>
                <Amount value={s.value} className="text-[1.5rem] leading-tight font-bold tracking-tight" />
                <span className={`truncate text-[0.8571rem] ${s.alarm ? "font-semibold text-danger" : "text-muted"}`}>{s.note ?? " "}</span>
              </Link>
            ))}
          </section>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          {d.sales ? (
            <section className="surface-raised rounded-xl border border-border/80 bg-surface p-4">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
                <div>
                  <h2 className="text-[0.9375rem] font-semibold">{t("dashboard.k.salesTrend")}</h2>
                  <p className="text-sm text-muted">{t("dashboard.k.vsLastMonth", { amount: rupees(d.sales.lastMonthToDate) })}</p>
                </div>
                <dl className="flex gap-6 text-right">
                  <div><dt className="text-xs text-muted">{t("dashboard.k.salesMonth")}</dt><dd><Amount value={d.sales.mtd} className="text-lg font-semibold" /></dd></div>
                  <div><dt className="text-xs text-muted">{t("dashboard.k.salesToday")}</dt><dd><Amount value={d.sales.today} className="text-lg font-semibold" /></dd></div>
                </dl>
              </div>
              <SalesChart days={d.sales.daily} label={t("dashboard.k.salesTrend")} formatDay={formatDay} />
            </section>
          ) : null}

          <section className="glass-panel flex flex-col rounded-xl p-4">
            <h2 className="mb-3 text-[0.9375rem] font-semibold">{t("home.needsAttention")}</h2>
            {alerts.length ? (
              <ul className="flex flex-col text-sm">
                {alerts.map((a, i) => (
                  <li key={`${a.key}-${i}`} className="border-b border-rule last:border-0">
                    <Link href={a.href} className="-mx-2 flex items-start gap-2.5 rounded-md px-2 py-2 hover:bg-surface-2">
                      {icon[a.level]}
                      <span>{t(`alerts.${a.key}`, Object.fromEntries(Object.entries(a.params).map(([k, v]) => [k, k === "amount" ? rupees(String(v)) : v])))}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <p className="flex items-center gap-2 text-sm text-success"><CheckCircle2 className="size-4" aria-hidden />{t("dashboard.k.noAlerts")}</p>}
            {waiting.length ? (
              <div className="mt-auto pt-4">
                <h3 className="mb-1.5 text-sm font-medium text-muted">{t("dashboard.k.approvals")}</h3>
                <ul className="flex flex-wrap gap-2">
                  {waiting.map((w) => (
                    <li key={w.href}>
                      <Link href={w.href} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm hover:border-primary/40">
                        <span className="num font-semibold">{w.n}</span>{w.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        </div>

        {lists.length ? (
          <div className="grid overflow-hidden rounded-lg border border-border bg-surface md:grid-cols-2 xl:grid-cols-3 [&>*]:border-rule max-md:[&>*+*]:border-t md:[&>*:nth-child(even)]:border-l xl:[&>*:nth-child(even)]:border-l-0 xl:[&>*+*]:border-l">
            {lists}
          </div>
        ) : null}

        <GstCalculator defaultState={company?.branches[0]?.stateCode ?? "27"} />
      </div>
    </>
  );
}
