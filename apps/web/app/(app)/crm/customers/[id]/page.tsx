import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { ActivityForm, ActivityList, RemindButton, SendMessage, type Activity, type Template } from "@/components/crm/Crm";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, PageHeader } from "@/components/ui";
import { rupees, todayIso } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("crm.customer"))("title") };
}

interface View {
  account: { id: string; name: string; phone: string | null; email: string | null; gstin: string | null; isCustomer: boolean; creditLimit: string | null };
  lead: { id: string; code: string; source: string } | null;
  salesThisYear: string; salesLastYear: string; balance: string;
  buckets: Record<string, string> | null;
  openItems: { number: string; date: string; dueOn: string; amount: string; daysOverdue: number }[];
  invoices: { id: string; number: string; date: string; total: string; status: string }[];
  receipts: { id: string; number: string; date: string; amount: string }[];
  orders: { id: string; number: string; date: string; status: string }[];
  quotations: { id: string; number: string; date: string; status: string; total: string }[];
  activities: Activity[];
}

export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();
  const format = await getFormatter();
  const date = todayIso();
  const [v, me, templates, messaging] = await Promise.all([
    serverApi<View>(`/crm/customers/${id}?date=${date}`), serverApi<Me>("/auth/me"), serverApi<Template[]>("/crm/templates"), serverApi<{ provider: string }>("/crm/messaging"),
  ]);
  const can = (p: string) => me.permissions.includes(p);
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  const list = <T,>(title: string, rows: T[], render: (r: T) => React.ReactNode) => (
    <Card className="flex flex-col gap-2">
      <h2 className="font-semibold">{title}</h2>
      {rows.length ? <ul className="divide-y divide-border text-sm">{rows.map(render)}</ul> : <p className="text-sm text-muted">-</p>}
    </Card>
  );
  return (
    <>
      <PageHeader title={v.account.name} subtitle={[v.account.phone, v.account.email, v.account.gstin].filter(Boolean).join(" · ")}
        actions={v.lead ? <Link href={`/crm/leads/${v.lead.id}`} className="text-sm text-primary hover:underline">{t("crm.customer.fromLead", { code: v.lead.code, source: t(`crm.leads.sources.${v.lead.source}`) })}</Link> : null} />
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card><div className="text-sm text-muted">{t("crm.customer.balance")}</div><div className={`num text-2xl font-semibold ${Number(v.balance) > 0 ? "" : "text-success"}`}>{rupees(v.balance)}</div></Card>
          <Card><div className="text-sm text-muted">{t("crm.customer.salesThisYear")}</div><div className="num text-2xl font-semibold">{rupees(v.salesThisYear)}</div><div className="text-xs text-muted">{t("crm.customer.salesLastYear")}: {rupees(v.salesLastYear)}</div></Card>
          <Card className="flex flex-col justify-center gap-2">
            {can("crm.create") && Number(v.balance) > 0 && v.account.phone ? <RemindButton accountId={id} date={date} /> : null}
            <Link href={`/reports/ledger/${id}`} className="text-sm text-primary hover:underline">{t("crm.customer.ledger")}</Link>
          </Card>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          {list(t("crm.customer.openItems"), v.openItems, (o) => (
            <li key={o.number} className="flex justify-between py-1.5"><span><span className="font-mono">{o.number}</span> <span className="text-muted">{day(o.date)}</span></span>
              <span className={`num ${o.daysOverdue > 0 ? "text-danger" : ""}`}>{rupees(o.amount)}{o.daysOverdue > 0 ? ` · ${o.daysOverdue}d` : ""}</span></li>
          ))}
          {list(t("crm.customer.invoices"), v.invoices, (i) => (
            <li key={i.id} className="flex justify-between py-1.5"><Link href={`/sales/invoices/${i.id}`} className="font-mono text-primary hover:underline">{i.number}</Link><span className="text-muted">{day(i.date)}</span>
              <span className="num">{i.status === "cancelled" ? <StatusBadge status="cancelled" label={t("purchase.statuses.cancelled")} /> : rupees(i.total)}</span></li>
          ))}
          {list(t("crm.customer.receipts"), v.receipts, (r) => (
            <li key={r.id} className="flex justify-between py-1.5"><Link href={`/accounts/vouchers/${r.id}`} className="font-mono text-primary hover:underline">{r.number}</Link><span className="text-muted">{day(r.date)}</span><span className="num">{rupees(r.amount)}</span></li>
          ))}
          {list(t("crm.customer.orders"), [...v.quotations.map((q) => ({ ...q, kind: "quotations" })), ...v.orders.map((o) => ({ ...o, total: "", kind: "orders" }))], (o) => (
            <li key={o.id} className="flex justify-between py-1.5"><Link href={`/sales/${o.kind}/${o.id}`} className="font-mono text-primary hover:underline">{o.number}</Link><span className="text-muted">{day(o.date)}</span><span className="num">{o.total ? rupees(o.total) : ""}</span></li>
          ))}
          <Card className="flex flex-col gap-3">
            <h2 className="font-semibold">{t("crm.customer.activities")}</h2>
            {can("crm.create") ? <ActivityForm accountId={id} /> : null}
            <ActivityList items={v.activities} />
          </Card>
          {can("crm.create") && v.account.phone ? <SendMessage templates={templates} accountId={id} defaults={[v.account.name]} demo={messaging.provider === "demo"} /> : null}
        </div>
      </div>
    </>
  );
}
