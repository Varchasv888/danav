import { getFormatter, getTranslations } from "next-intl/server";
import { BillTime, LogTime, MembersPanel, MilestonesPanel, ProjectForm, TasksPanel, TimeTable, type ProjectData, type TimeRow } from "@/components/projects/Projects";
import { statusTone } from "@/lib/project-status";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, PageHeader } from "@/components/ui";
import { rupees } from "@/lib/format";
import { projectMasters } from "@/lib/projects";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("projects.list"))("title") };
}

interface Project extends ProjectData {
  id: string; code: string; customer: string | null;
  summary: { revenue: string; labour: string; expenses: string; purchases: string; cost: string; margin: string; marginPct: string | null; hours: string; billableHours: string; unbilled: string; budgetUsedPct: string | null; hoursUsedPct: string | null };
  tasks: { id: string; name: string; status: "todo" | "doing" | "done"; assigneeId: string | null; assignee: string | null; estimatedHours: string | null; logged: string; dueOn: string | null }[];
  milestones: { id: string; name: string; amount: string; dueOn: string | null; status: string; invoice: string | null; invoiceId: string | null }[];
  members: { employeeId: string; name: string; code: string; billRate: string | null }[];
  invoices: { id: string; number: string; date: string; taxable: string; total: string; status: string }[];
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();
  const format = await getFormatter();
  const [p, me, time, m] = await Promise.all([serverApi<Project>(`/projects/${id}`), serverApi<Me>("/auth/me"), serverApi<TimeRow[]>(`/timesheets?projectId=${id}`), projectMasters()]);
  const can = (x: string) => me.permissions.includes(x);
  const s = p.summary;
  const stat = (label: string, value: string, sub?: string | null) => (
    <Card><div className="text-sm text-muted">{label}</div><div className="num text-2xl font-semibold">{value}</div>{sub ? <div className="text-xs text-muted">{sub}</div> : null}</Card>
  );
  return (
    <>
      <PageHeader title={p.name} subtitle={<><span className="font-mono">{p.code}</span>{p.customer ? ` · ${p.customer}` : ""} · {t(`projects.list.billings.${p.billing}`)}</>}
        actions={<StatusBadge status={statusTone(p.status)} label={t(`projects.list.statuses.${p.status}`)} />} />
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stat(t("projects.list.revenue"), rupees(s.revenue), p.contractValue ? `/ ${rupees(p.contractValue)}` : null)}
          {stat(t("projects.list.cost"), rupees(s.cost), s.budgetUsedPct ? t("projects.detail.budgetUsed", { pct: s.budgetUsedPct }) : null)}
          {stat(t("projects.list.margin"), rupees(s.margin), s.marginPct ? t("projects.detail.marginPct", { pct: s.marginPct }) : null)}
          {stat(t("projects.list.hours"), String(Number(s.hours)), s.hoursUsedPct ? t("projects.detail.hoursUsed", { pct: s.hoursUsedPct }) : null)}
        </div>
        <Card>
          <dl className="grid gap-3 text-sm sm:grid-cols-4">
            <div><dt className="text-muted">{t("projects.detail.labour")}</dt><dd className="num">{rupees(s.labour)}</dd></div>
            <div><dt className="text-muted">{t("projects.detail.expenses")}</dt><dd className="num">{rupees(s.expenses)}</dd></div>
            <div><dt className="text-muted">{t("projects.detail.purchases")}</dt><dd className="num">{rupees(s.purchases)}</dd></div>
            <div><dt className="text-muted">{t("projects.detail.unbilled")}</dt><dd className="num">{rupees(s.unbilled)}</dd></div>
          </dl>
        </Card>
        <div className="grid gap-6 xl:grid-cols-2">
          <TasksPanel projectId={id} tasks={p.tasks} people={m.people} canEdit={can("projects.edit")} />
          {p.billing === "fixed" ? <MilestonesPanel projectId={id} milestones={p.milestones} canEdit={can("projects.edit")} canBill={can("sales.create")} />
            : p.billing === "time_material" ? <MembersPanel projectId={id} members={p.members} people={m.people} canEdit={can("projects.edit")} /> : null}
        </div>
        <section className="flex flex-col gap-3">
          <h2 className="font-semibold">{t("projects.detail.time")}</h2>
          {can("projects.create") && p.status === "active" ? <LogTime projects={[{ id, code: p.code, name: p.name, billing: p.billing }]} people={m.people} tasks={p.tasks.map((x) => ({ id: x.id, projectId: id, name: x.name }))} projectId={id} /> : null}
          <TimeTable rows={time} canApprove={can("projects.approve")} canDelete={can("projects.create")} />
          {p.billing === "time_material" && can("sales.create") ? <BillTime projectId={id} /> : null}
        </section>
        {p.invoices.length ? (
          <Card className="p-0">
            <div className="border-b border-border px-5 py-3 font-semibold">{t("projects.detail.invoices")}</div>
            <ul className="divide-y divide-border text-sm">
              {p.invoices.map((i) => (
                <li key={i.id} className="flex items-center gap-4 px-5 py-2">
                  <a href={`/sales/invoices/${i.id}`} className="font-mono text-primary hover:underline">{i.number}</a>
                  <span className="text-muted">{format.dateTime(new Date(`${i.date}T00:00:00`), { dateStyle: "medium" })}</span>
                  <span className="num ml-auto">{rupees(i.total)}</span>
                  {i.status === "cancelled" ? <StatusBadge status="cancelled" label={t("purchase.statuses.cancelled")} /> : null}
                </li>
              ))}
            </ul>
          </Card>
        ) : null}
        {can("projects.edit") ? (
          <details>
            <summary className="cursor-pointer text-sm font-medium text-primary">{t("projects.detail.edit")}</summary>
            <div className="mt-3"><ProjectForm project={p} customers={m.customers} services={m.services} /></div>
          </details>
        ) : null}
      </div>
    </>
  );
}
