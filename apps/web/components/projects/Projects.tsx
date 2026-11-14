"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { statusTone } from "@/lib/project-status";
import { localName, rupees, todayIso } from "@/lib/format";
import { StatusBadge } from "../StatusBadge";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export const PRJ_NS = ["projects.errors", "sales.errors", "vouchers.errors"];
type Opt = { id: string; name: string; nameHi?: string | null };
export type Person = { id: string; code: string; name: string };
export interface ProjectData {
  id?: string; name: string; customerId: string | null; status: string; billing: string; contractValue: string | null; budgetCost: string | null;
  budgetHours: string | null; billRate: string | null; billingItemId: string | null; startOn: string | null; endOn: string | null; notes: string | null;
}
export interface TimeRow { id: string; date: string; employee: string; code: string; project: string; projectCode: string; task: string | null; hours: string; billable: boolean; note: string | null; status: string; costRate: string; billRate: string }

export function ProjectForm({ project, customers, services }: { project?: ProjectData; customers: Opt[]; services: Opt[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [billing, setBilling] = useState(project?.billing ?? "fixed");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const n = (v: string | null | undefined) => (v && Number(v) ? String(Number(v)) : "");
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => String(f.get(k) ?? "").trim() || null;
    setBusy(true);
    setError(null);
    try {
      const body = {
        name: s("name"), customerId: s("customerId"), billing, status: s("status") ?? undefined, contractValue: s("contractValue"), budgetCost: s("budgetCost"),
        budgetHours: s("budgetHours"), billRate: billing === "time_material" ? s("billRate") : null, billingItemId: s("billingItemId"), startOn: s("startOn"), endOn: s("endOn"), notes: s("notes"),
      };
      const p = await api<{ id: string }>(project?.id ? `/projects/${project.id}` : "/projects", { method: project?.id ? "PUT" : "POST", body });
      if (project?.id) { setBusy(false); router.refresh(); } else router.push(`/projects/${p.id}`);
    } catch (err) { setError(errorText(t, err, PRJ_NS)); setBusy(false); }
  }
  return (
    <Card>
      <form onSubmit={save} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="md:col-span-2"><Field label={t("projects.list.name")} htmlFor="pj-name"><Input id="pj-name" name="name" defaultValue={project?.name} required minLength={2} maxLength={120} /></Field></div>
        <Field label={t("projects.list.customer")} htmlFor="pj-cust">
          <Select id="pj-cust" name="customerId" defaultValue={project?.customerId ?? ""}><option value="">-</option>{customers.map((c) => <option key={c.id} value={c.id}>{localName({ name: c.name, nameHi: c.nameHi ?? null }, locale)}</option>)}</Select>
        </Field>
        <Field label={t("projects.list.billing")} htmlFor="pj-bill">
          <Select id="pj-bill" value={billing} onChange={(e) => setBilling(e.target.value)}>{(["fixed", "time_material", "non_billable"] as const).map((b) => <option key={b} value={b}>{t(`projects.list.billings.${b}`)}</option>)}</Select>
        </Field>
        {billing === "fixed" ? <Field label={t("projects.form.contractValue")} htmlFor="pj-cv"><Input id="pj-cv" name="contractValue" defaultValue={n(project?.contractValue)} inputMode="decimal" className="num" /></Field> : null}
        {billing === "time_material" ? <Field label={t("projects.form.billRate")} htmlFor="pj-br"><Input id="pj-br" name="billRate" defaultValue={n(project?.billRate)} inputMode="decimal" className="num" /></Field> : null}
        {billing !== "non_billable" ? (
          <Field label={t("projects.form.billingItem")} htmlFor="pj-item">
            <Select id="pj-item" name="billingItemId" defaultValue={project?.billingItemId ?? ""}><option value="">-</option>{services.map((s) => <option key={s.id} value={s.id}>{localName({ name: s.name, nameHi: s.nameHi ?? null }, locale)}</option>)}</Select>
          </Field>
        ) : null}
        <Field label={t("projects.form.budgetCost")} htmlFor="pj-bc"><Input id="pj-bc" name="budgetCost" defaultValue={n(project?.budgetCost)} inputMode="decimal" className="num" /></Field>
        <Field label={t("projects.form.budgetHours")} htmlFor="pj-bh"><Input id="pj-bh" name="budgetHours" defaultValue={n(project?.budgetHours)} inputMode="decimal" className="num" /></Field>
        <Field label={t("projects.form.startOn")} htmlFor="pj-s"><Input id="pj-s" name="startOn" type="date" defaultValue={project?.startOn ?? ""} /></Field>
        <Field label={t("projects.form.endOn")} htmlFor="pj-e"><Input id="pj-e" name="endOn" type="date" defaultValue={project?.endOn ?? ""} /></Field>
        {project?.id ? (
          <Field label={t("projects.list.status")} htmlFor="pj-st">
            <Select id="pj-st" name="status" defaultValue={project.status}>{(["active", "on_hold", "completed", "cancelled"] as const).map((s) => <option key={s} value={s}>{t(`projects.list.statuses.${s}`)}</option>)}</Select>
          </Field>
        ) : null}
        <div className="md:col-span-2 xl:col-span-4"><Field label={t("projects.form.notes")} htmlFor="pj-notes"><Input id="pj-notes" name="notes" defaultValue={project?.notes ?? ""} maxLength={1000} /></Field></div>
        {error ? <div className="md:col-span-2 xl:col-span-4"><Alert>{error}</Alert></div> : null}
        <div className="md:col-span-2 xl:col-span-4"><Button type="submit" disabled={busy}>{t("projects.form.save")}</Button></div>
      </form>
    </Card>
  );
}

interface Task { id: string; name: string; status: "todo" | "doing" | "done"; assigneeId: string | null; assignee: string | null; estimatedHours: string | null; logged: string; dueOn: string | null }

export function TasksPanel({ projectId, tasks, people, canEdit }: { projectId: string; tasks: Task[]; people: Person[]; canEdit: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const call = async (method: string, path: string, body?: unknown) => {
    setError(null);
    try { await api(`/projects/${projectId}/tasks${path}`, { method, ...(body ? { body } : {}) }); router.refresh(); } catch (err) { setError(errorText(t, err, PRJ_NS)); }
  };
  return (
    <Card className="flex flex-col gap-3">
      <h2 className="font-semibold">{t("projects.detail.tasks")}</h2>
      <ul className="divide-y divide-border text-sm">
        {tasks.map((x) => (
          <li key={x.id} className="flex flex-wrap items-center gap-3 py-2">
            <Select value={x.status} disabled={!canEdit} className="h-8 w-36" aria-label={t("projects.list.status")}
              onChange={(e) => call("PUT", `/${x.id}`, { name: x.name, status: e.target.value, assigneeId: x.assigneeId, estimatedHours: x.estimatedHours, dueOn: x.dueOn })}>
              {(["todo", "doing", "done"] as const).map((s) => <option key={s} value={s}>{t(`projects.detail.taskStatuses.${s}`)}</option>)}
            </Select>
            <span className={`flex-1 ${x.status === "done" ? "text-muted line-through" : ""}`}>{x.name}</span>
            <span className="text-muted">{x.assignee ?? ""}</span>
            <span className="num w-24 text-right">{Number(x.logged)}{x.estimatedHours ? ` / ${Number(x.estimatedHours)}` : ""} h</span>
            {x.dueOn ? <span className="text-xs text-muted">{format.dateTime(new Date(`${x.dueOn}T00:00:00`), { dateStyle: "medium" })}</span> : null}
            {canEdit ? <button type="button" onClick={() => call("DELETE", `/${x.id}`)} className="rounded-md p-1 text-muted hover:text-danger" title={t("projects.detail.remove")}><Trash2 className="size-4" aria-hidden /></button> : null}
          </li>
        ))}
      </ul>
      {canEdit ? (
        <form className="grid gap-3 md:grid-cols-[1fr_200px_110px_160px_auto]" onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const s = (k: string) => String(f.get(k) ?? "").trim() || null;
          void call("POST", "", { name: s("name"), assigneeId: s("assigneeId"), estimatedHours: s("est"), dueOn: s("due") }).then(() => (e.target as HTMLFormElement).reset());
        }}>
          <Input name="name" placeholder={t("projects.detail.task")} aria-label={t("projects.detail.task")} required minLength={2} maxLength={120} />
          <Select name="assigneeId" aria-label={t("projects.detail.assignee")}><option value="">{t("projects.detail.assignee")}</option>{people.map((p) => <option key={p.id} value={p.id}>{p.code} {p.name}</option>)}</Select>
          <Input name="est" placeholder={t("projects.detail.estimate")} aria-label={t("projects.detail.estimate")} inputMode="decimal" className="num" />
          <Input name="due" type="date" aria-label={t("projects.detail.due")} />
          <Button type="submit" variant="outline"><Plus className="size-4" aria-hidden />{t("projects.detail.addTask")}</Button>
        </form>
      ) : null}
      {error ? <Alert>{error}</Alert> : null}
    </Card>
  );
}

export function MembersPanel({ projectId, members, people, canEdit }: { projectId: string; members: { employeeId: string; name: string; code: string; billRate: string | null }[]; people: Person[]; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  return (
    <Card className="flex flex-col gap-3">
      <h2 className="font-semibold">{t("projects.detail.members")}</h2>
      <ul className="divide-y divide-border text-sm">
        {members.map((m) => (
          <li key={m.employeeId} className="flex items-center gap-3 py-2">
            <span className="flex-1"><span className="font-mono text-xs text-muted">{m.code}</span> {m.name}</span>
            <span className="num">{m.billRate ? `${rupees(m.billRate)}/h` : "-"}</span>
            {canEdit ? <button type="button" className="rounded-md p-1 text-muted hover:text-danger" title={t("projects.detail.remove")} onClick={async () => { await api(`/projects/${projectId}/members/${m.employeeId}`, { method: "DELETE" }); router.refresh(); }}><Trash2 className="size-4" aria-hidden /></button> : null}
          </li>
        ))}
      </ul>
      {canEdit ? (
        <form className="flex flex-wrap items-end gap-3" onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          setError(null);
          try { await api(`/projects/${projectId}/members`, { method: "PUT", body: { employeeId: f.get("employeeId"), billRate: String(f.get("rate") || "") || null } }); router.refresh(); } catch (err) { setError(errorText(t, err, PRJ_NS)); }
        }}>
          <Field label={t("projects.detail.member")} htmlFor="pm-e"><Select id="pm-e" name="employeeId" required className="w-60">{people.map((p) => <option key={p.id} value={p.id}>{p.code} {p.name}</option>)}</Select></Field>
          <Field label={t("projects.detail.memberRate")} htmlFor="pm-r"><Input id="pm-r" name="rate" inputMode="decimal" className="num w-32" /></Field>
          <Button type="submit" variant="outline">{t("projects.detail.addMember")}</Button>
        </form>
      ) : null}
      {error ? <Alert>{error}</Alert> : null}
    </Card>
  );
}

interface Milestone { id: string; name: string; amount: string; dueOn: string | null; status: string; invoice: string | null; invoiceId: string | null }

export function MilestonesPanel({ projectId, milestones, canEdit, canBill }: { projectId: string; milestones: Milestone[]; canEdit: boolean; canBill: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <Card className="flex flex-col gap-3">
      <h2 className="font-semibold">{t("projects.detail.milestones")}</h2>
      <ul className="divide-y divide-border text-sm">
        {milestones.map((m) => (
          <li key={m.id} className="flex flex-wrap items-center gap-3 py-2">
            <span className="flex-1">{m.name}{m.dueOn ? <span className="ml-2 text-xs text-muted">{format.dateTime(new Date(`${m.dueOn}T00:00:00`), { dateStyle: "medium" })}</span> : null}</span>
            <span className="num">{rupees(m.amount)}</span>
            {m.status === "billed" ? (
              <a href={`/sales/invoices/${m.invoiceId}`} className="text-primary hover:underline">{t("projects.detail.billed", { number: m.invoice ?? "" })}</a>
            ) : (
              <>
                {canBill ? <Button className="h-8 px-3 text-xs" onClick={async () => {
                  setError(null);
                  try { const r = await api<{ number: string }>(`/projects/${projectId}/milestones/${m.id}/bill`, { body: { date: todayIso() } }); setMsg(t("projects.detail.invoiced", { number: r.number })); router.refresh(); } catch (err) { setError(errorText(t, err, PRJ_NS)); }
                }}>{t("projects.detail.bill")}</Button> : null}
                {canEdit ? <button type="button" className="rounded-md p-1 text-muted hover:text-danger" title={t("projects.detail.remove")} onClick={async () => { await api(`/projects/${projectId}/milestones/${m.id}`, { method: "DELETE" }); router.refresh(); }}><Trash2 className="size-4" aria-hidden /></button> : null}
              </>
            )}
          </li>
        ))}
      </ul>
      {canEdit ? (
        <form className="grid gap-3 md:grid-cols-[1fr_150px_160px_auto]" onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          setError(null);
          try { await api(`/projects/${projectId}/milestones`, { body: { name: f.get("name"), amount: f.get("amount"), dueOn: String(f.get("due") || "") || null } }); (e.target as HTMLFormElement).reset(); router.refresh(); } catch (err) { setError(errorText(t, err, PRJ_NS)); }
        }}>
          <Input name="name" placeholder={t("projects.detail.milestone")} aria-label={t("projects.detail.milestone")} required minLength={2} maxLength={120} />
          <Input name="amount" placeholder={t("projects.detail.amount")} aria-label={t("projects.detail.amount")} required inputMode="decimal" className="num" />
          <Input name="due" type="date" aria-label={t("projects.detail.due")} />
          <Button type="submit" variant="outline"><Plus className="size-4" aria-hidden />{t("projects.detail.addMilestone")}</Button>
        </form>
      ) : null}
      {msg ? <p className="text-sm text-success">{msg}</p> : null}
      {error ? <Alert>{error}</Alert> : null}
    </Card>
  );
}

/** Time entries with approval (and deletion while not yet approved). */
export function TimeTable({ rows, canApprove, canDelete, showProject }: { rows: TimeRow[]; canApprove: boolean; canDelete: boolean; showProject?: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [picked, setPicked] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const decide = async (decision: "approved" | "rejected") => {
    setError(null);
    try { await api("/timesheets/decide", { body: { ids: picked, decision } }); setPicked([]); router.refresh(); } catch (err) { setError(errorText(t, err, PRJ_NS)); }
  };
  const open = rows.filter((r) => r.status === "submitted");
  const total = rows.filter((r) => r.status !== "rejected").reduce((s, r) => s + Number(r.hours), 0);
  return (
    <div className="flex flex-col gap-3">
      {canApprove && open.length ? (
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={picked.length === open.length} onChange={(e) => setPicked(e.target.checked ? open.map((r) => r.id) : [])} className="size-4 accent-[var(--primary)]" />{t("projects.time.selected", { count: picked.length })}</label>
          <Button className="h-8 px-3 text-xs" disabled={!picked.length} onClick={() => decide("approved")}>{t("projects.time.approve")}</Button>
          <Button variant="outline" className="h-8 px-3 text-xs text-danger" disabled={!picked.length} onClick={() => decide("rejected")}>{t("projects.time.reject")}</Button>
        </div>
      ) : null}
      {error ? <Alert>{error}</Alert> : null}
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-muted"><tr className="border-b border-border">
              <th className="w-10 px-4 py-2" />
              <th className="px-3 py-2 font-medium">{t("projects.time.date")}</th>
              <th className="px-3 py-2 font-medium">{t("projects.time.employee")}</th>
              {showProject ? <th className="px-3 py-2 font-medium">{t("projects.time.project")}</th> : null}
              <th className="px-3 py-2 font-medium">{t("projects.time.task")}</th>
              <th className="px-3 py-2 text-right font-medium">{t("projects.time.hours")}</th>
              <th className="px-3 py-2 text-right font-medium">{t("projects.time.billRate")}</th>
              <th className="px-3 py-2 font-medium">{t("projects.list.status")}</th>
              <th className="w-10" />
            </tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-2">{canApprove && r.status === "submitted" ? <input type="checkbox" checked={picked.includes(r.id)} onChange={(e) => setPicked(e.target.checked ? [...picked, r.id] : picked.filter((p) => p !== r.id))} className="size-4 accent-[var(--primary)]" aria-label={r.employee} /> : null}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{format.dateTime(new Date(`${r.date}T00:00:00`), { dateStyle: "medium" })}</td>
                  <td className="px-3 py-2">{r.employee}</td>
                  {showProject ? <td className="px-3 py-2"><span className="font-mono text-xs text-muted">{r.projectCode}</span> {r.project}</td> : null}
                  <td className="px-3 py-2">{r.task ?? ""}{r.note ? <span className="block text-xs text-muted">{r.note}</span> : null}</td>
                  <td className="num px-3 py-2 text-right">{Number(r.hours)}</td>
                  <td className="num px-3 py-2 text-right">{r.billable ? rupees(r.billRate) : "-"}</td>
                  <td className="px-3 py-2"><StatusBadge status={statusTone(r.status)} label={t(`projects.time.statuses.${r.status}`)} /></td>
                  <td className="px-2 py-2">{canDelete && (r.status === "submitted" || r.status === "rejected") ? <button type="button" className="rounded-md p-1 text-muted hover:text-danger" title={t("projects.time.delete")} onClick={async () => { await api(`/timesheets/${r.id}`, { method: "DELETE" }); router.refresh(); }}><Trash2 className="size-4" aria-hidden /></button> : null}</td>
                </tr>
              ))}
              {rows.length ? <tr className="font-semibold"><td colSpan={showProject ? 5 : 4} className="px-3 py-2">{t("projects.time.total")}</td><td className="num px-3 py-2 text-right">{total}</td><td colSpan={3} /></tr>
                : <tr><td colSpan={9} className="px-5 py-8 text-center text-muted">{t("projects.time.none")}</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export function LogTime({ projects, people, tasks, projectId: fixedProject }: { projects: { id: string; code: string; name: string; billing: string }[]; people: Person[]; tasks: { id: string; projectId: string; name: string }[]; projectId?: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [projectId, setProject] = useState(fixedProject ?? projects[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const billable = projects.find((p) => p.id === projectId)?.billing === "time_material";
  return (
    <Card>
      <form className="grid gap-3 md:grid-cols-3 xl:grid-cols-7" onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setError(null);
        try {
          await api("/timesheets", { body: { projectId, employeeId: f.get("employeeId"), taskId: String(f.get("taskId") || "") || null, date: f.get("date"), hours: f.get("hours"), billable: f.get("billable") === "on", note: String(f.get("note") || "") || undefined } });
          (e.target as HTMLFormElement).querySelector<HTMLInputElement>("[name=hours]")!.value = "";
          router.refresh();
        } catch (err) { setError(errorText(t, err, PRJ_NS)); }
      }}>
        <Field label={t("projects.time.employee")} htmlFor="lt-e"><Select id="lt-e" name="employeeId" required>{people.map((p) => <option key={p.id} value={p.id}>{p.code} {p.name}</option>)}</Select></Field>
        {!fixedProject ? (
          <Field label={t("projects.time.project")} htmlFor="lt-p"><Select id="lt-p" value={projectId} onChange={(e) => setProject(e.target.value)} required>{projects.map((p) => <option key={p.id} value={p.id}>{p.code} {p.name}</option>)}</Select></Field>
        ) : null}
        <Field label={t("projects.time.task")} htmlFor="lt-t"><Select id="lt-t" name="taskId"><option value="">-</option>{tasks.filter((x) => x.projectId === projectId).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</Select></Field>
        <Field label={t("projects.time.date")} htmlFor="lt-d"><Input id="lt-d" name="date" type="date" defaultValue={todayIso()} required /></Field>
        <Field label={t("projects.time.hours")} htmlFor="lt-h"><Input id="lt-h" name="hours" inputMode="decimal" className="num" required /></Field>
        <Field label={t("projects.time.note")} htmlFor="lt-n"><Input id="lt-n" name="note" maxLength={200} /></Field>
        <div className="flex items-end gap-3">
          {billable ? <label className="flex items-center gap-2 pb-2 text-sm"><input type="checkbox" name="billable" defaultChecked className="size-4 accent-[var(--primary)]" />{t("projects.time.billable")}</label> : null}
          <Button type="submit" disabled={!projectId}>{t("projects.time.save")}</Button>
        </div>
        {error ? <div className="md:col-span-3 xl:col-span-7"><Alert>{error}</Alert></div> : null}
      </form>
    </Card>
  );
}

export function BillTime({ projectId }: { projectId: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [upTo, setUpTo] = useState(todayIso());
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div className="flex flex-wrap items-end gap-3">
      <Field label={t("projects.detail.billUpTo")} htmlFor="bt-u"><Input id="bt-u" type="date" value={upTo} onChange={(e) => setUpTo(e.target.value)} /></Field>
      <Button onClick={async () => {
        setError(null);
        try { const r = await api<{ number: string }>(`/projects/${projectId}/bill-time`, { body: { date: todayIso(), upTo } }); setMsg(t("projects.detail.invoiced", { number: r.number })); router.refresh(); } catch (err) { setError(errorText(t, err, PRJ_NS)); }
      }}>{t("projects.detail.billTime")}</Button>
      {msg ? <span className="text-sm text-success">{msg}</span> : null}
      {error ? <Alert>{error}</Alert> : null}
    </div>
  );
}
