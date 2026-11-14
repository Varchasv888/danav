import { getTranslations } from "next-intl/server";
import { LogTime, TimeTable, type TimeRow } from "@/components/projects/Projects";
import { Button, Input, PageHeader, Select } from "@/components/ui";
import { todayIso } from "@/lib/format";
import { projectMasters } from "@/lib/projects";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("projects.time"))("title") };
}

const shift = (d: string, n: number) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

export default async function TimesheetsPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string; status?: string }> }) {
  const sp = await searchParams;
  const valid = (d?: string) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : undefined);
  const to = valid(sp.to) ?? todayIso();
  const from = valid(sp.from) ?? shift(to, -13);
  const status = ["submitted", "approved", "rejected", "billed"].includes(sp.status ?? "") ? sp.status : undefined;
  const t = await getTranslations();
  const [rows, projects, me, m] = await Promise.all([
    serverApi<TimeRow[]>(`/timesheets?from=${from}&to=${to}${status ? `&status=${status}` : ""}`),
    serverApi<{ id: string; code: string; name: string; billing: string; status: string }[]>("/projects"), serverApi<Me>("/auth/me"), projectMasters(),
  ]);
  const active = projects.filter((p) => p.status === "active");
  const tasks = (await Promise.all(active.slice(0, 30).map((p) => serverApi<{ tasks: { id: string; name: string; status: string }[] }>(`/projects/${p.id}`).then((d) => d.tasks.filter((x) => x.status !== "done").map((x) => ({ id: x.id, name: x.name, projectId: p.id })))))).flat();
  return (
    <>
      <PageHeader title={t("projects.time.title")} subtitle={t("projects.time.subtitle")} />
      <div className="flex flex-col gap-6">
        {me.permissions.includes("projects.create") && active.length ? <LogTime projects={active} people={m.people} tasks={tasks} /> : null}
        <form className="flex flex-wrap items-end gap-3">
          <Input type="date" name="from" defaultValue={from} aria-label={t("common.from")} className="w-44" />
          <Input type="date" name="to" defaultValue={to} aria-label={t("common.to")} className="w-44" />
          <Select name="status" defaultValue={status ?? ""} className="w-44" aria-label={t("projects.list.status")}>
            <option value="">{t("common.all")}</option>
            {(["submitted", "approved", "rejected", "billed"] as const).map((s) => <option key={s} value={s}>{t(`projects.time.statuses.${s}`)}</option>)}
          </Select>
          <Button type="submit" variant="outline">{t("common.apply")}</Button>
        </form>
        <TimeTable rows={rows} canApprove={me.permissions.includes("projects.approve")} canDelete={me.permissions.includes("projects.create")} showProject />
      </div>
    </>
  );
}
