"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { localName } from "@/lib/format";
import { StatusBadge } from "../StatusBadge";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export interface LeaveRequest {
  id: string; employeeId: string; employeeName: string; employeeCode: string; typeCode: string; typeName: string; typeNameHi: string | null;
  fromDate: string; toDate: string; halfDay: boolean; days: string; reason: string | null; status: string;
}
interface Option { id: string; code: string; name: string; nameHi: string | null }

export function LeaveForm({ employees, types }: { employees: Option[]; types: Option[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [half, setHalf] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setBusy(true);
    setError(null);
    try {
      await api("/leave-requests", { body: { employeeId: f.employeeId, leaveTypeId: f.leaveTypeId, fromDate: from, toDate: half ? from : to, halfDay: half, reason: f.reason || undefined } });
      form.reset(); setFrom(""); setTo(""); setHalf(false);
      router.refresh();
    } catch (err) {
      setError(errorText(t, err, ["hr.errors"]));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Card>
      <h2 className="mb-4 font-semibold">{t("hr.leave.new")}</h2>
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <div className="xl:col-span-2">
          <Field label={t("hr.leave.employee")} htmlFor="lv-emp">
            <Select id="lv-emp" name="employeeId" required defaultValue="">
              <option value="" disabled>-</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.code} · {localName(e, locale)}</option>)}
            </Select>
          </Field>
        </div>
        <Field label={t("hr.leave.type")} htmlFor="lv-type">
          <Select id="lv-type" name="leaveTypeId" required>{types.map((ty) => <option key={ty.id} value={ty.id}>{localName(ty, locale)}</option>)}</Select>
        </Field>
        <Field label={t("hr.leave.from")} htmlFor="lv-from"><Input id="lv-from" type="date" value={from} onChange={(e) => { setFrom(e.target.value); if (!to || to < e.target.value) setTo(e.target.value); }} required /></Field>
        <Field label={t("hr.leave.to")} htmlFor="lv-to"><Input id="lv-to" type="date" value={half ? from : to} min={from} onChange={(e) => setTo(e.target.value)} disabled={half} required /></Field>
        <label className="flex items-end gap-2 pb-2 text-sm"><input type="checkbox" checked={half} onChange={(e) => setHalf(e.target.checked)} className="size-4 accent-[var(--primary)]" />{t("hr.leave.halfDay")}</label>
        <div className="md:col-span-2 xl:col-span-5"><Field label={t("hr.leave.reason")} htmlFor="lv-reason"><Input id="lv-reason" name="reason" maxLength={300} /></Field></div>
        <div className="flex items-end"><Button type="submit" disabled={busy}>{t("hr.leave.submit")}</Button></div>
      </form>
      {error ? <div className="mt-3"><Alert>{error}</Alert></div> : null}
    </Card>
  );
}

const TONE: Record<string, string> = { pending: "partial", approved: "posted", rejected: "cancelled", cancelled: "closed" };

export function LeaveTable({ rows, canApprove, canEdit, title }: { rows: LeaveRequest[]; canApprove: boolean; canEdit: boolean; title: string }) {
  const t = useTranslations();
  const locale = useLocale();
  const format = useFormatter();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const act = async (id: string, action: "approve" | "reject" | "cancel") => {
    setError(null);
    try { await api(`/leave-requests/${id}/${action}`, { body: {} }); router.refresh(); } catch (err) { setError(errorText(t, err, ["hr.errors"])); }
  };
  const d = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { day: "numeric", month: "short" });
  return (
    <Card className="p-0">
      <h2 className="border-b border-border px-5 py-3 font-semibold">{title}</h2>
      {error ? <div className="px-5 pt-3"><Alert>{error}</Alert></div> : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="px-5 py-2.5"><span className="font-mono text-xs text-muted">{r.employeeCode}</span> {r.employeeName}</td>
                <td className="px-5 py-2.5">{localName({ name: r.typeName, nameHi: r.typeNameHi }, locale)}</td>
                <td className="px-5 py-2.5 whitespace-nowrap">{d(r.fromDate)}{r.toDate !== r.fromDate ? ` – ${d(r.toDate)}` : ""}{r.halfDay ? ` · ${t("hr.leave.halfDay")}` : ""}</td>
                <td className="num px-5 py-2.5 text-right">{Number(r.days)} {t("hr.leave.days")}</td>
                <td className="max-w-64 truncate px-5 py-2.5 text-muted">{r.reason}</td>
                <td className="px-5 py-2.5"><StatusBadge status={TONE[r.status] ?? r.status} label={t(`hr.leave.statuses.${r.status}`)} /></td>
                <td className="px-5 py-2.5 text-right whitespace-nowrap">
                  {r.status === "pending" && canApprove ? (
                    <>
                      <Button variant="outline" className="h-8 px-3" onClick={() => act(r.id, "approve")}>{t("hr.leave.approve")}</Button>
                      <Button variant="ghost" className="ml-1 h-8 px-3" onClick={() => act(r.id, "reject")}>{t("hr.leave.reject")}</Button>
                    </>
                  ) : null}
                  {(r.status === "approved" || (r.status === "pending" && !canApprove)) && canEdit ? <Button variant="ghost" className="h-8 px-3 text-danger" onClick={() => act(r.id, "cancel")}>{t("hr.leave.cancel")}</Button> : null}
                </td>
              </tr>
            ))}
            {!rows.length ? <tr><td className="px-5 py-8 text-center text-muted">{t("hr.leave.none")}</td></tr> : null}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
