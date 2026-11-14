"use client";

import { Paperclip, Plus, ScanText, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { localName, rupees, todayIso } from "@/lib/format";
import { CancelDocument } from "../CancelDocument";
import { Alert, Button, Card, Field, Input, Select } from "../ui";
import { devanagari } from "@varchasv/domain";

export const EXP_NS = ["expenses.errors", "vouchers.errors"];
export interface Category { id: string; name: string; nameHi: string | null; accountId: string; account: string; blockedCredit: boolean; limitPerClaim: string | null; receiptRequiredAbove: string | null; archived: boolean; perKmRate?: string | null; dailyAllowance?: string | null }
type Opt = { id: string; name: string; nameHi?: string | null };
interface Line { key: number; date: string; categoryId: string; description: string; amount: string; gstRate: string; vendorName: string; vendorGstin: string; invoiceNo: string; fileId: string; fileName: string; tripFrom: string; tripTo: string; km: string; days: string }
export interface ClaimDraft { id?: string; employeeId: string; date: string; title: string; projectId: string | null; lines: Omit<Line, "key">[] }

const blank = (key: number, date: string): Line => ({ key, date, categoryId: "", description: "", amount: "", gstRate: "0", vendorName: "", vendorGstin: "", invoiceNo: "", fileId: "", fileName: "", tripFrom: "", tripTo: "", km: "", days: "" });
const toBase64 = (f: File) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1] ?? ""); r.onerror = rej; r.readAsDataURL(f); });

export function ClaimForm({ employees, categories, projects, draft }: { employees: { id: string; code: string; name: string }[]; categories: Category[]; projects: Opt[]; draft?: ClaimDraft }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [employeeId, setEmployee] = useState(draft?.employeeId ?? "");
  const [date, setDate] = useState(draft?.date ?? todayIso());
  const [title, setTitle] = useState(draft?.title ?? "");
  const [projectId, setProject] = useState(draft?.projectId ?? "");
  const [lines, setLines] = useState<Line[]>(draft?.lines.length ? draft.lines.map((l, i) => ({ ...l, key: i + 1 })) : [blank(1, todayIso())]);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const active = categories.filter((c) => !c.archived);
  const set = (key: number, patch: Partial<Line>) => setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)));

  async function attach(key: number, file: File) {
    setError(null);
    try {
      const contentType = file.type === "image/jpg" ? "image/jpeg" : file.type;
      const f = await api<{ id: string; name: string }>("/files", { body: { name: file.name, contentType, base64: await toBase64(file) } });
      set(key, { fileId: f.id, fileName: f.name });
    } catch (err) { setError(errorText(t, err, EXP_NS)); }
  }
  async function read(key: number, fileId: string) {
    setNotes((n) => ({ ...n, [key]: t("expenses.form.reading") }));
    try {
      const r = await api<{ reader: string; fields: { vendorName: string | null; vendorGstin: string | null; invoiceNo: string | null; date: string | null; total: string | null; gstRate: string | null } | null; categoryId: string | null }>(`/files/${fileId}/read`, { body: {} });
      if (!r.fields) { setNotes((n) => ({ ...n, [key]: r.reader === "demo" ? t("expenses.form.readDemo") : t("expenses.form.readNone") })); return; }
      const f = r.fields;
      set(key, {
        ...(f.date ? { date: f.date } : {}), ...(f.total ? { amount: f.total } : {}), ...(f.gstRate ? { gstRate: f.gstRate } : {}), ...(f.vendorName ? { vendorName: f.vendorName } : {}),
        ...(f.vendorGstin ? { vendorGstin: f.vendorGstin } : {}), ...(f.invoiceNo ? { invoiceNo: f.invoiceNo } : {}), ...(r.categoryId ? { categoryId: r.categoryId } : {}),
      });
      setNotes((n) => ({ ...n, [key]: t("expenses.form.readDone") }));
    } catch (err) { setNotes((n) => ({ ...n, [key]: errorText(t, err, EXP_NS) })); }
  }
  async function save(submit: boolean) {
    setBusy(true);
    setError(null);
    const opt = (v: string) => v.trim() || undefined;
    const tripPay = (l: Line) => { const c = active.find((x) => x.id === l.categoryId); return c && (c.perKmRate || c.dailyAllowance) && l.tripFrom.trim() ? Number(l.km || 0) * Number(c.perKmRate || 0) + Number(l.days || 0) * Number(c.dailyAllowance || 0) : null; };
    const body = {
      employeeId, date, title, projectId: projectId || undefined, submit,
      lines: lines.filter((l) => l.categoryId && (l.amount || tripPay(l) !== null)).map((l) => ({
        date: l.date, categoryId: l.categoryId, ...(tripPay(l) === null ? { amount: l.amount } : {}), ...(l.tripFrom.trim() ? { travel: { from: l.tripFrom.trim(), to: l.tripTo.trim(), ...(l.km ? { km: l.km } : {}), ...(l.days ? { days: Number(l.days) } : {}) } } : {}), description: opt(l.description), gstRate: l.gstRate || undefined,
        vendorName: opt(l.vendorName), vendorGstin: opt(l.vendorGstin)?.toUpperCase(), invoiceNo: opt(l.invoiceNo), fileId: l.fileId || undefined,
      })),
    };
    try {
      const c = await api<{ id: string }>(draft?.id ? `/expenses/claims/${draft.id}` : "/expenses/claims", { method: draft?.id ? "PUT" : "POST", body });
      router.push(`/expenses/${c.id}`);
    } catch (err) { setError(errorText(t, err, EXP_NS)); setBusy(false); }
  }
  const policyPay = (l: Line) => { const c = active.find((x) => x.id === l.categoryId); return c && (c.perKmRate || c.dailyAllowance) && l.tripFrom.trim() ? Number(l.km || 0) * Number(c.perKmRate || 0) + Number(l.days || 0) * Number(c.dailyAllowance || 0) : null; };
  const total = lines.reduce((s, l) => s + (policyPay(l) ?? Number(l.amount || 0)), 0);
  return (
    <div className="flex flex-col gap-6">
      <Card className="grid gap-4 md:grid-cols-4">
        <Field label={t("expenses.claims.employee")} htmlFor="ec-emp">
          <Select id="ec-emp" value={employeeId} onChange={(e) => setEmployee(e.target.value)} required>
            <option value="">-</option>{employees.map((e) => <option key={e.id} value={e.id}>{e.code} {e.name}</option>)}
          </Select>
        </Field>
        <Field label={t("expenses.claims.date")} htmlFor="ec-date"><Input id="ec-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label={t("expenses.claims.claimTitle")} htmlFor="ec-title"><Input id="ec-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} /></Field>
        <Field label={t("expenses.form.project")} htmlFor="ec-proj">
          <Select id="ec-proj" value={projectId} onChange={(e) => setProject(e.target.value)}><option value="">-</option>{projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select>
        </Field>
      </Card>
      <Card className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between"><h2 className="font-semibold">{t("expenses.form.lines")}</h2><span className="num text-lg font-semibold">{rupees(total)}</span></div>
        <p className="text-xs text-muted">{t("expenses.form.itcHint")}</p>
        {lines.map((l) => {
          const cat = active.find((c) => c.id === l.categoryId);
          return (
            <div key={l.key} className="grid gap-3 rounded-lg border border-border p-3 md:grid-cols-4 xl:grid-cols-8">
              <Field label={t("expenses.claims.date")} htmlFor={`el-d-${l.key}`}><Input id={`el-d-${l.key}`} type="date" value={l.date} onChange={(e) => set(l.key, { date: e.target.value })} /></Field>
              <div className="xl:col-span-2">
                <Field label={t("expenses.form.category")} htmlFor={`el-c-${l.key}`} hint={cat?.blockedCredit ? t("expenses.categories.blocked") : undefined}>
                  <Select id={`el-c-${l.key}`} value={l.categoryId} onChange={(e) => set(l.key, { categoryId: e.target.value })}>
                    <option value="">-</option>{active.map((c) => <option key={c.id} value={c.id}>{localName(c, locale)}</option>)}
                  </Select>
                </Field>
              </div>
              {cat && (cat.perKmRate || cat.dailyAllowance) ? (
                <div className="grid gap-3 md:col-span-4 md:grid-cols-4 xl:col-span-8">
                  <Field label={t("expenses.form.tripFrom")} htmlFor={`el-tf-${l.key}`}><Input id={`el-tf-${l.key}`} value={l.tripFrom} onChange={(e) => set(l.key, { tripFrom: e.target.value })} maxLength={60} /></Field>
                  <Field label={t("expenses.form.tripTo")} htmlFor={`el-tt-${l.key}`}><Input id={`el-tt-${l.key}`} value={l.tripTo} onChange={(e) => set(l.key, { tripTo: e.target.value })} maxLength={60} /></Field>
                  <Field label={t("expenses.form.km")} htmlFor={`el-km-${l.key}`}><Input id={`el-km-${l.key}`} value={l.km} onChange={(e) => set(l.key, { km: e.target.value.replace(/[^\d.]/g, "") })} inputMode="decimal" className="num" /></Field>
                  <Field label={t("expenses.form.days")} htmlFor={`el-dy-${l.key}`}><Input id={`el-dy-${l.key}`} value={l.days} onChange={(e) => set(l.key, { days: e.target.value.replace(/\D/g, "") })} inputMode="numeric" className="num" /></Field>
                  {policyPay(l) !== null ? <p className="text-sm text-muted md:col-span-4">{t("expenses.form.policyPay", { km: Number(cat.perKmRate ?? 0), allowance: Number(cat.dailyAllowance ?? 0), amount: policyPay(l)! })}</p> : null}
                </div>
              ) : null}
              <Field label={t("expenses.form.amount")} htmlFor={`el-a-${l.key}`}><Input id={`el-a-${l.key}`} value={l.amount} onChange={(e) => set(l.key, { amount: e.target.value })} inputMode="decimal" className="num" /></Field>
              <Field label={t("expenses.form.gstRate")} htmlFor={`el-g-${l.key}`}>
                <Select id={`el-g-${l.key}`} value={l.gstRate} onChange={(e) => set(l.key, { gstRate: e.target.value })}>{["0", "5", "12", "18", "28"].map((r) => <option key={r} value={r}>{r}%</option>)}</Select>
              </Field>
              <div className="xl:col-span-3"><Field label={t("expenses.form.description")} htmlFor={`el-x-${l.key}`}><Input id={`el-x-${l.key}`} value={l.description} onChange={(e) => set(l.key, { description: e.target.value })} maxLength={300} /></Field></div>
              <div className="md:col-span-2"><Field label={t("expenses.form.vendor")} htmlFor={`el-v-${l.key}`}><Input id={`el-v-${l.key}`} value={l.vendorName} onChange={(e) => set(l.key, { vendorName: e.target.value })} maxLength={100} /></Field></div>
              <div className="md:col-span-2"><Field label={t("expenses.form.vendorGstin")} htmlFor={`el-vg-${l.key}`}><Input id={`el-vg-${l.key}`} value={l.vendorGstin} onChange={(e) => set(l.key, { vendorGstin: e.target.value })} maxLength={15} className="font-mono uppercase" /></Field></div>
              <Field label={t("expenses.form.invoiceNo")} htmlFor={`el-i-${l.key}`}><Input id={`el-i-${l.key}`} value={l.invoiceNo} onChange={(e) => set(l.key, { invoiceNo: e.target.value })} maxLength={30} /></Field>
              <div className="flex flex-wrap items-end gap-2 md:col-span-3">
                <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-border px-3 text-sm hover:bg-surface-2">
                  <Paperclip className="size-4" aria-hidden />{l.fileName || t("expenses.form.upload")}
                  <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) void attach(l.key, f); }} />
                </label>
                {l.fileId ? <Button type="button" variant="ghost" onClick={() => read(l.key, l.fileId)}><ScanText className="size-4" aria-hidden />{t("expenses.form.read")}</Button> : null}
                {lines.length > 1 ? <button type="button" onClick={() => setLines(lines.filter((x) => x.key !== l.key))} className="rounded-md p-2 text-muted hover:text-danger" title={t("common.remove")}><Trash2 className="size-4" aria-hidden /></button> : null}
              </div>
              {notes[l.key] ? <p className="text-xs text-muted md:col-span-4 xl:col-span-8">{notes[l.key]}</p> : null}
            </div>
          );
        })}
        <div><Button type="button" variant="ghost" className="-ml-3" onClick={() => setLines([...lines, blank(Math.max(...lines.map((x) => x.key)) + 1, lines[lines.length - 1]?.date ?? date)])}><Plus className="size-4" aria-hidden />{t("expenses.form.addLine")}</Button></div>
      </Card>
      {error ? <Alert>{error}</Alert> : null}
      <div className="flex gap-3">
        <Button onClick={() => save(true)} disabled={busy || !employeeId || title.trim().length < 3}>{t("expenses.form.submit")}</Button>
        <Button variant="outline" onClick={() => save(false)} disabled={busy || !employeeId || title.trim().length < 3}>{t("expenses.form.saveDraft")}</Button>
      </div>
    </div>
  );
}

export function ClaimActions({ id, status, canEdit, canApprove, canCancel, payFrom }: { id: string; status: string; canEdit: boolean; canApprove: boolean; canCancel: boolean; payFrom: Opt[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [mode, setMode] = useState<"reject" | "pay" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const call = async (path: string, body: unknown = {}) => {
    setError(null);
    try { await api(`/expenses/claims/${id}/${path}`, { body }); setMode(null); router.refresh(); } catch (err) { setError(errorText(t, err, EXP_NS)); }
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {(status === "draft" || status === "rejected") && canEdit ? (
          <>
            <a href={`/expenses/${id}/edit`} className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-surface-2">{t("expenses.detail.edit")}</a>
            <Button onClick={() => call("submit")}>{t("expenses.detail.submit")}</Button>
          </>
        ) : null}
        {status === "submitted" && canApprove ? (
          <>
            <Button onClick={() => call("approve")}>{t("expenses.detail.approve")}</Button>
            <Button variant="outline" className="text-danger" onClick={() => setMode("reject")}>{t("expenses.detail.reject")}</Button>
          </>
        ) : null}
        {status === "approved" && canApprove ? <Button onClick={() => setMode("pay")}>{t("expenses.detail.pay")}</Button> : null}
      </div>
      {mode === "reject" ? (
        <form className="flex max-w-xl gap-3" onSubmit={(e) => { e.preventDefault(); void call("reject", { reason: new FormData(e.currentTarget).get("reason") }); }}>
          <Input name="reason" placeholder={t("expenses.detail.reason")} aria-label={t("expenses.detail.reason")} required minLength={3} maxLength={300} autoFocus />
          <Button type="submit" variant="danger">{t("expenses.detail.reject")}</Button>
        </form>
      ) : null}
      {mode === "pay" ? (
        <form className="flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); void call("pay", { date: f.get("date"), accountId: f.get("accountId") }); }}>
          <Field label={t("expenses.detail.payFrom")} htmlFor="cp-a"><Select id="cp-a" name="accountId" required className="w-60">{payFrom.map((a) => <option key={a.id} value={a.id}>{localName({ name: a.name, nameHi: a.nameHi ?? null }, locale)}</option>)}</Select></Field>
          <Field label={t("expenses.detail.paidOn")} htmlFor="cp-d"><Input id="cp-d" name="date" type="date" defaultValue={todayIso()} required /></Field>
          <Button type="submit">{t("expenses.detail.pay")}</Button>
        </form>
      ) : null}
      {error ? <Alert>{error}</Alert> : null}
      {canCancel && status !== "paid" && status !== "cancelled" ? <CancelDocument path={`/expenses/claims/${id}/cancel`} label={t("expenses.detail.cancel")} /> : null}
    </div>
  );
}

export function CategoriesEditor({ categories, accounts, canEdit }: { categories: Category[]; accounts: Opt[]; canEdit: boolean }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [rows, setRows] = useState<(Omit<Category, "id" | "account"> & { id?: string })[]>(categories);
  const [error, setError] = useState<string | null>(null);
  const set = (i: number, patch: Partial<(typeof rows)[number]>) => setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const save = async (i: number) => {
    const { id, ...r } = rows[i]!;
    setError(null);
    try {
      await api(id ? `/expenses/categories/${id}` : "/expenses/categories", { method: id ? "PUT" : "POST", body: { ...r, limitPerClaim: r.limitPerClaim || null, receiptRequiredAbove: r.receiptRequiredAbove || null, perKmRate: r.perKmRate || null, dailyAllowance: r.dailyAllowance || null } });
      router.refresh();
    } catch (err) { setError(errorText(t, err, EXP_NS)); }
  };
  return (
    <Card className="flex flex-col gap-3">
      {rows.map((r, i) => (
        <div key={r.id ?? `new-${i}`} className="grid items-end gap-3 md:grid-cols-[1.2fr_1.2fr_auto_130px_130px_100px_100px_auto_auto]">
          <Field label={t("expenses.categories.name")} htmlFor={`xc-n-${i}`}><Input id={`xc-n-${i}`} value={devanagari(locale) && r.nameHi ? r.nameHi : r.name} onChange={(e) => set(i, devanagari(locale) && r.nameHi ? { nameHi: e.target.value } : { name: e.target.value })} maxLength={60} disabled={!canEdit} /></Field>
          <Field label={t("expenses.categories.account")} htmlFor={`xc-a-${i}`}>
            <Select id={`xc-a-${i}`} value={r.accountId} onChange={(e) => set(i, { accountId: e.target.value })} disabled={!canEdit}>
              <option value="">-</option>{accounts.map((a) => <option key={a.id} value={a.id}>{localName({ name: a.name, nameHi: a.nameHi ?? null }, locale)}</option>)}
            </Select>
          </Field>
          <label className="flex items-center gap-2 pb-2 text-sm whitespace-nowrap"><input type="checkbox" checked={r.blockedCredit} onChange={(e) => set(i, { blockedCredit: e.target.checked })} disabled={!canEdit} className="size-4 accent-[var(--primary)]" />{t("expenses.categories.blocked")}</label>
          <Field label={t("expenses.categories.limit")} htmlFor={`xc-l-${i}`}><Input id={`xc-l-${i}`} value={r.limitPerClaim ? String(Number(r.limitPerClaim)) : ""} onChange={(e) => set(i, { limitPerClaim: e.target.value || null })} inputMode="decimal" className="num" disabled={!canEdit} /></Field>
          <Field label={t("expenses.categories.receiptAbove")} htmlFor={`xc-r-${i}`}><Input id={`xc-r-${i}`} value={r.receiptRequiredAbove ? String(Number(r.receiptRequiredAbove)) : ""} onChange={(e) => set(i, { receiptRequiredAbove: e.target.value || null })} inputMode="decimal" className="num" disabled={!canEdit} /></Field>
          <Field label={t("expenses.categories.perKm")} htmlFor={`xc-pk-${i}`}><Input id={`xc-pk-${i}`} value={r.perKmRate ? String(Number(r.perKmRate)) : ""} onChange={(e) => set(i, { perKmRate: e.target.value || null })} inputMode="decimal" className="num" disabled={!canEdit} /></Field>
          <Field label={t("expenses.categories.perDay")} htmlFor={`xc-pd-${i}`}><Input id={`xc-pd-${i}`} value={r.dailyAllowance ? String(Number(r.dailyAllowance)) : ""} onChange={(e) => set(i, { dailyAllowance: e.target.value || null })} inputMode="decimal" className="num" disabled={!canEdit} /></Field>
          <label className="flex items-center gap-2 pb-2 text-sm"><input type="checkbox" checked={r.archived} onChange={(e) => set(i, { archived: e.target.checked })} disabled={!canEdit || !r.id} className="size-4 accent-[var(--primary)]" />{t("common.archived")}</label>
          {canEdit ? <Button variant="outline" onClick={() => save(i)} disabled={r.name.trim().length < 2 || !r.accountId}>{t("expenses.categories.save")}</Button> : <span />}
        </div>
      ))}
      {canEdit ? <div><Button variant="ghost" className="-ml-3" onClick={() => setRows([...rows, { name: "", nameHi: null, accountId: "", blockedCredit: false, limitPerClaim: null, receiptRequiredAbove: null, archived: false }])}><Plus className="size-4" aria-hidden />{t("expenses.categories.add")}</Button></div> : null}
      {error ? <Alert>{error}</Alert> : null}
    </Card>
  );
}
