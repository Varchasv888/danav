"use client";

import { Download } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import type { TcsSection } from "@varchasv/domain";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { todayIso } from "@/lib/format";
import type { TcsSectionSettingsResponse } from "./TcsSectionMaster";
import { Alert, Badge, Button, Card, Field, Input, Select } from "../ui";

interface Option { id: string; name: string }
interface Collection { id: string; customer: string; section: string; date: string; base: string; rate: string; tcs: string; challanId: string | null; status: string }
interface Challan { id: string; paidOn: string; amount: string; bsrCode: string; challanSerial: string; status: string }
interface Return27 { totals: { collected: string; deposited: string }; warnings: { code: string; detail: string }[]; collectees: { name: string; pan: string | null; section: string; date: string; amount: string; tcs: string }[]; files: { collectees: { filename: string; content: string }; challans: { filename: string; content: string } } }
interface Tracker { limit: string; totalShortfall: string; rows: { supplierId: string; supplier: string; pan: string | null; bills: number; purchases: string; overLimit: string; headroom: string; due: string; deducted: string; shortfall: string }[] }
interface TcsAccountOption { id: string; name: string; groupId: string; archived: boolean }
interface TcsAccountGroup { id: string; key: string | null; parentId: string | null }

const NS = ["tds.errors", "hr.errors"];
function save(f: { filename: string; content: string }) {
  const url = URL.createObjectURL(new Blob([f.content], { type: "text/csv" }));
  Object.assign(document.createElement("a"), { href: url, download: f.filename }).click();
  URL.revokeObjectURL(url);
}

/** Tax collected at source on sales: collect, deposit and the quarterly return (Form 27EQ). */
export function TcsPanel({ fy, sections, companyId, companies, payees, banks, canEdit }: { fy: string; sections: TcsSection[]; companyId: string; companies: { id: string; name: string }[]; payees: Option[]; banks: Option[]; canEdit: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const [list, setList] = useState<Collection[]>([]);
  const [challans, setChallans] = useState<Challan[]>([]);
  const [ret, setRet] = useState<Return27 | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState(companyId);
  const [activeSections, setActiveSections] = useState(sections);
  const [activePayees, setActivePayees] = useState(payees);
  const [activeBanks, setActiveBanks] = useState(banks);
  const [quarter, setQuarter] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [section, setSection] = useState(sections[0]?.code ?? "");
  const [date, setDate] = useState("");
  const [base, setBase] = useState("");
  const [preview, setPreview] = useState<{ rate: string; tcs: string } | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [bank, setBank] = useState("");
  const [bsr, setBsr] = useState("");
  const [serial, setSerial] = useState("");
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });
  useEffect(() => { setDate(todayIso()); }, []);

  const load = useCallback(async () => {
    try {
      setList(await api<Collection[]>(`/tcs/collections?fy=${fy}&companyId=${selectedCompanyId}`));
      setChallans(await api<Challan[]>(`/tds/challans?fy=${fy}&kind=tcs&companyId=${selectedCompanyId}`));
      setRet(await api<Return27>(`/tcs/27eq?fy=${fy}&quarter=${quarter}&companyId=${selectedCompanyId}`));
    } catch (err) { setError(errorText(t, err, NS)); }
  }, [fy, quarter, selectedCompanyId, t]);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    setPreview(null);
    if (!customerId || !section || !/^\d+(\.\d{1,2})?$/.test(base) || Number(base) <= 0) return;
    let live = true;
    api<{ rate: string; tcs: string }>(`/tcs/preview?${new URLSearchParams({ customerId, section, base, companyId: selectedCompanyId })}`).then((p) => { if (live) setPreview(p); }).catch(() => undefined);
    return () => { live = false; };
  }, [customerId, section, base, selectedCompanyId]);

  const switchCompany = async (nextCompanyId: string) => {
    setBusy(true);
    setError(null);
    try {
      const [settings, groups, accounts] = await Promise.all([
        api<TcsSectionSettingsResponse>(`/tcs/section-settings?companyId=${nextCompanyId}`),
        api<TcsAccountGroup[]>(`/accounts/groups?companyId=${nextCompanyId}`),
        api<TcsAccountOption[]>(`/accounts?companyId=${nextCompanyId}`),
      ]);
      const enabled = settings.sections.filter((candidate) => candidate.enabled).map(({ enabled: _enabled, ...candidate }) => candidate);
      const groupKey = (group: TcsAccountGroup) => group.key ?? groups.find((parent) => parent.id === group.parentId)?.key ?? "";
      const debtorGroups = new Set(groups.filter((group) => groupKey(group) === "sundry_debtors").map((group) => group.id));
      const bankGroups = new Set(groups.filter((group) => ["cash_in_hand", "bank_accounts", "bank_od"].includes(groupKey(group))).map((group) => group.id));
      const nextPayees = accounts.filter((account) => debtorGroups.has(account.groupId) && !account.archived).map(({ id, name }) => ({ id, name }));
      const nextBanks = accounts.filter((account) => bankGroups.has(account.groupId) && !account.archived).map(({ id, name }) => ({ id, name }));
      setSelectedCompanyId(nextCompanyId);
      setPicked([]);
      setActiveSections(enabled);
      setActivePayees(nextPayees);
      setActiveBanks(nextBanks);
      setSection(enabled[0]?.code ?? "");
      setCustomerId((current) => nextPayees.some((candidate) => candidate.id === current) ? current : "");
      setBank((current) => nextBanks.some((candidate) => candidate.id === current) ? current : "");
    } catch (err) { setError(errorText(t, err, NS)); }
    finally { setBusy(false); }
  };

  const call = async (fn: () => Promise<unknown>, done?: () => void) => {
    setBusy(true);
    setError(null);
    try { await fn(); done?.(); await load(); } catch (err) { setError(errorText(t, err, NS)); } finally { setBusy(false); }
  };
  const open = list.filter((c) => c.status === "posted" && !c.challanId && Number(c.tcs) > 0);
  const total = open.filter((c) => picked.includes(c.id)).reduce((s, c) => s + Number(c.tcs), 0);

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      <p className="text-sm text-muted">{t("tds.tcs.help")}</p>
      {companies.length > 1 ? (
        <div className="max-w-md">
          <label htmlFor="tcs-entry-company" className="mb-1 block text-sm font-medium">Company</label>
          <Select id="tcs-entry-company" value={selectedCompanyId} disabled={busy} onChange={(event) => void switchCompany(event.target.value)}>
            {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
          </Select>
        </div>
      ) : null}
      {canEdit && activeSections.length ? (
        <Card>
          <form method="post" className="flex flex-wrap items-end gap-4" onSubmit={(e) => { e.preventDefault(); void call(() => api(`/tcs/collections?companyId=${selectedCompanyId}`, { body: { customerId, section, date, base } }), () => setBase("")); }}>
            <Field label={t("tds.tcs.customer")} htmlFor="tc-cust"><Select id="tc-cust" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required className="w-64"><option value="" />{activePayees.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select></Field>
            <Field label={t("tds.section")} htmlFor="tc-sec"><Select id="tc-sec" value={section} onChange={(e) => setSection(e.target.value)} className="w-80">{activeSections.map((s) => <option key={s.code} value={s.code}>{s.code} {s.nature}</option>)}</Select></Field>
            <Field label={t("tds.date")} htmlFor="tc-d"><Input id="tc-d" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
            <Field label={t("tds.tcs.base")} htmlFor="tc-b"><Input id="tc-b" value={base} onChange={(e) => setBase(e.target.value)} inputMode="decimal" className="num w-36" required /></Field>
            <Button type="submit" disabled={busy || !customerId || !base}>{t("tds.tcs.collect")}</Button>
          </form>
          {preview ? <p role="status" className="mt-3 text-sm">{t("tds.tcs.preview", { tcs: money(preview.tcs), rate: Number(preview.rate) })}</p> : null}
        </Card>
      ) : null}
      {canEdit && !activeSections.length ? <p role="status" className="rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-muted">All TCS sections are disabled for this company. Enable a section in TCS Tax Master to enter a new collection.</p> : null}

      <Card className="p-0">
        <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("tds.tcs.collections")}</h2>
        {list.length ? (
          <ul>{list.map((c) => (
            <li key={c.id} className={`flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-rule px-4 py-2 text-sm last:border-0 ${c.status === "cancelled" ? "text-muted line-through" : ""}`}>
              {canEdit && open.some((o) => o.id === c.id) ? <input type="checkbox" checked={picked.includes(c.id)} onChange={(e) => setPicked(e.target.checked ? [...picked, c.id] : picked.filter((x) => x !== c.id))} aria-label={c.customer} /> : null}
              <span className="whitespace-nowrap">{c.date}</span><span className="font-medium">{c.customer}</span><span>{c.section}</span><span className="num">{money(c.base)}</span><span className="num font-medium">{money(c.tcs)}</span>
              {c.status === "cancelled" ? <Badge tone="neutral">{t("tds.cancelled")}</Badge> : c.challanId ? <Badge tone="success">{t("tds.deposited")}</Badge> : Number(c.tcs) > 0 ? <Badge tone="warning">{t("tds.notDeposited")}</Badge> : null}
              {canEdit && c.status === "posted" && !c.challanId ? <button type="button" disabled={busy} className="ml-auto text-primary hover:underline" onClick={() => { const reason = window.prompt(t("tds.cancelReason")); if (reason && reason.trim().length >= 3) void call(() => api(`/tcs/collections/${c.id}/cancel?companyId=${selectedCompanyId}`, { body: { reason: reason.trim() } })); }}>{t("tds.cancel")}</button> : null}
            </li>
          ))}</ul>
        ) : <p className="px-4 py-6 text-center text-muted">{t("tds.none")}</p>}
      </Card>

      {canEdit && open.length ? (
        <Card>
          <h2 className="mb-2 font-semibold">{t("tds.depositTitle")}</h2>
          <form method="post" className="flex flex-wrap items-end gap-4" onSubmit={(e) => { e.preventDefault(); void call(() => api("/tds/challans", { body: { kind: "tcs", companyId: selectedCompanyId, paidOn: todayIso(), amount: total.toFixed(2), accountId: bank, bsrCode: bsr, challanSerial: serial, deductionIds: picked } }), () => { setPicked([]); setBsr(""); setSerial(""); }); }}>
            <Field label={t("tds.bank")} htmlFor="tcd-bank"><Select id="tcd-bank" value={bank} onChange={(e) => setBank(e.target.value)} required className="w-56"><option value="" />{activeBanks.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</Select></Field>
            <Field label={t("tds.bsr")} htmlFor="tcd-bsr"><Input id="tcd-bsr" value={bsr} onChange={(e) => setBsr(e.target.value)} maxLength={7} pattern="\d{7}" className="num w-32" required /></Field>
            <Field label={t("tds.serial")} htmlFor="tcd-ser"><Input id="tcd-ser" value={serial} onChange={(e) => setSerial(e.target.value)} maxLength={8} pattern="\d{1,8}" className="num w-32" required /></Field>
            <span className="num pb-2 text-sm">{money(String(total))}</span>
            <Button type="submit" disabled={busy || !picked.length || !bank}>{t("tds.depositGo")}</Button>
          </form>
          <ul className="mt-2 text-xs text-muted">{challans.filter((c) => c.status === "posted").map((c) => <li key={c.id}>{c.paidOn} · {c.bsrCode}/{c.challanSerial} · {money(c.amount)}</li>)}</ul>
        </Card>
      ) : null}

      <Card>
        <div className="mb-3 flex flex-wrap items-end gap-4">
          <Field label={t("tds.quarter")} htmlFor="t27-q"><Select id="t27-q" value={String(quarter)} onChange={(e) => setQuarter(Number(e.target.value))} className="w-28">{[1, 2, 3, 4].map((q) => <option key={q} value={q}>Q{q}</option>)}</Select></Field>
          {ret ? <Button variant="outline" onClick={() => save(ret.files.collectees)} disabled={!ret.collectees.length}><Download className="size-4" aria-hidden />{t("tds.tcs.download")}</Button> : null}
        </div>
        {ret ? (
          <>
            <p className="text-sm">{t("tds.tcs.collected")}: <span className="num font-medium">{money(ret.totals.collected)}</span> · {t("tds.depositedTotal")}: <span className="num font-medium">{money(ret.totals.deposited)}</span></p>
            {ret.warnings.length ? <ul className="mt-2 list-disc pl-5 text-sm text-warning">{ret.warnings.map((w, i) => <li key={i}>{t(`tds.warn.${w.code}`, { detail: w.detail })}</li>)}</ul> : null}
          </>
        ) : null}
      </Card>
    </div>
  );
}

/** Each supplier's purchases against the Rs 50 lakh limit of section 194Q, with the tax due above it and what has been deducted. */
export function TrackerPanel({ fy }: { fy: string }) {
  const t = useTranslations();
  const format = useFormatter();
  const [data, setData] = useState<Tracker | null>(null);
  const [error, setError] = useState<string | null>(null);
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });
  useEffect(() => { api<Tracker>(`/tds/194q?fy=${fy}`).then(setData).catch((err) => setError(errorText(t, err, NS))); }, [fy, t]);
  return (
    <Card className="p-0">
      <p className="px-4 py-2 text-sm text-muted">{t("tds.tracker.help", { limit: data ? money(data.limit) : "" })}</p>
      {error ? <Alert>{error}</Alert> : null}
      {data?.rows.length ? (
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted"><tr className="border-y border-rule"><th className="px-4 py-1.5 font-medium">{t("tds.tracker.supplier")}</th><th className="px-4 py-1.5 text-right font-medium">{t("tds.tracker.purchases")}</th><th className="px-4 py-1.5 text-right font-medium">{t("tds.tracker.headroom")}</th><th className="px-4 py-1.5 text-right font-medium">{t("tds.tracker.over")}</th><th className="px-4 py-1.5 text-right font-medium">{t("tds.tracker.due")}</th><th className="px-4 py-1.5 text-right font-medium">{t("tds.tracker.deducted")}</th><th className="px-4 py-1.5 text-right font-medium">{t("tds.tracker.shortfall")}</th></tr></thead>
          <tbody>{data.rows.map((r) => (
            <tr key={r.supplierId} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{r.supplier}{r.pan ? null : <span className="ml-1 text-xs text-warning">no PAN</span>}</td><td className="num px-4 py-1.5 text-right">{money(r.purchases)}</td><td className="num px-4 py-1.5 text-right">{Number(r.headroom) ? money(r.headroom) : ""}</td><td className="num px-4 py-1.5 text-right">{Number(r.overLimit) ? money(r.overLimit) : ""}</td><td className="num px-4 py-1.5 text-right">{money(r.due)}</td><td className="num px-4 py-1.5 text-right">{money(r.deducted)}</td><td className={`num px-4 py-1.5 text-right ${Number(r.shortfall) ? "font-semibold text-danger" : ""}`}>{money(r.shortfall)}</td></tr>
          ))}</tbody>
        </table>
      ) : <p className="px-4 py-6 text-center text-muted">{t("tds.none")}</p>}
    </Card>
  );
}

/** Opens the printable certificate of tax deducted for one payee and quarter. */
export function CertificateBox({ fy, payees }: { fy: string; payees: Option[] }) {
  const t = useTranslations();
  const [payee, setPayee] = useState("");
  const [quarter, setQuarter] = useState(2);
  return (
    <Card>
      <h2 className="mb-2 font-semibold">{t("tds.cert.title")}</h2>
      <div className="flex flex-wrap items-end gap-4">
        <Field label={t("tds.payee")} htmlFor="ce-p"><Select id="ce-p" value={payee} onChange={(e) => setPayee(e.target.value)} className="w-64"><option value="" />{payees.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select></Field>
        <Field label={t("tds.quarter")} htmlFor="ce-q"><Select id="ce-q" value={String(quarter)} onChange={(e) => setQuarter(Number(e.target.value))} className="w-28">{[1, 2, 3, 4].map((q) => <option key={q} value={q}>Q{q}</option>)}</Select></Field>
        <a href={payee ? `/print/tds-certificate?deducteeId=${payee}&fy=${fy}&quarter=${quarter}` : undefined} target="_blank" rel="noreferrer" aria-disabled={!payee}
          className={`inline-flex h-9 items-center rounded-md border border-border px-4 text-sm font-semibold ${payee ? "text-primary hover:bg-surface-2" : "pointer-events-none text-muted"}`}>{t("tds.cert.open")}</a>
      </div>
    </Card>
  );
}

interface MapRow { legacySection: string; nature: string; newRef: string | null; paymentCode: string | null }

/** What each section is called under section 393 of the Income-tax Act, 2025: typed in, or pasted from the table the business follows. */
export function SectionMapPanel({ canEdit }: { canEdit: boolean }) {
  const t = useTranslations();
  const [rows, setRows] = useState<MapRow[]>([]);
  const [paste, setPaste] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const load = useCallback(() => { api<MapRow[]>("/tds/section-map").then(setRows).catch((err) => setError(errorText(t, err, NS))); }, [t]);
  useEffect(() => { load(); }, [load]);
  const act = async (fn: () => Promise<unknown>) => { setBusy(true); setError(null); try { await fn(); load(); } catch (err) { setError(errorText(t, err, NS)); } finally { setBusy(false); } };
  const edit = (r: MapRow, patch: Partial<MapRow>) => setRows(rows.map((x) => (x.legacySection === r.legacySection ? { ...x, ...patch } : x)));
  return (
    <Card className="p-4">
      <h2 className="text-sm font-medium">{t("tds.map.title")}</h2>
      <p className="mb-3 text-sm text-muted">{t("tds.map.help")}</p>
      {error ? <Alert>{error}</Alert> : null}
      <table className="mb-3 w-full text-sm">
        <thead className="text-left text-xs text-muted"><tr className="border-b border-rule"><th className="py-1.5 font-medium">{t("tds.map.legacy")}</th><th className="py-1.5 font-medium">{t("tds.map.newRef")}</th><th className="py-1.5 font-medium">{t("tds.map.code")}</th><th /></tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={r.legacySection} className="border-b border-rule last:border-0">
            <td className="py-1.5">{r.legacySection}<span className="ml-2 text-xs text-muted">{r.nature}</span></td>
            <td className="py-1.5 pr-2"><Input value={r.newRef ?? ""} disabled={!canEdit} onChange={(e) => edit(r, { newRef: e.target.value })} maxLength={40} /></td>
            <td className="py-1.5 pr-2"><Input value={r.paymentCode ?? ""} disabled={!canEdit} onChange={(e) => edit(r, { paymentCode: e.target.value })} maxLength={8} className="num w-24" /></td>
            <td className="py-1.5 text-right">{canEdit ? <Button variant="outline" disabled={busy || !r.newRef} onClick={() => act(() => api("/tds/section-map", { method: "PUT", body: { entries: [{ legacySection: r.legacySection, newRef: r.newRef, paymentCode: r.paymentCode || null }] } }))}>{t("tds.map.save")}</Button> : null}</td>
          </tr>
        ))}</tbody>
      </table>
      {canEdit ? (
        <>
          <Field label={t("tds.map.paste")} htmlFor="map-paste" hint={t("tds.map.pasteHint")}><textarea id="map-paste" value={paste} onChange={(e) => setPaste(e.target.value)} rows={4} className="w-full rounded-md border border-border bg-surface p-2 text-sm" /></Field>
          <Button className="mt-2" disabled={busy || !paste.trim()} onClick={() => act(async () => { await api("/tds/section-map", { method: "PUT", body: { text: paste } }); setPaste(""); })}>{t("tds.map.import")}</Button>
        </>
      ) : null}
    </Card>
  );
}
