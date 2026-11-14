"use client";

import { Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { TcsSection, TdsSection } from "@varchasv/domain";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { todayIso } from "@/lib/format";
import { Alert, Badge, Button, Card, Field, Input, Select } from "../ui";
import { CertificateBox, SectionMapPanel, TcsPanel, TrackerPanel } from "./TdsExtras";

export interface Deduction { id: string; deducteeId: string; deductee: string; pan: string | null; section: string; date: string; base: string; taxableBase: string; rate: string; tds: string; noPan: boolean; challanId: string | null; status: string; note: string | null }
export interface Challan { id: string; paidOn: string; amount: string; bsrCode: string; challanSerial: string; status: string }
interface Option { id: string; name: string }
interface Preview { rate: string; taxableBase: string; tds: string; noPan: boolean }
interface Return26Q {
  totals: { deducted: string; deposited: string }; warnings: { code: string; detail: string }[];
  deductees: { name: string; pan: string | null; section: string; date: string; amountPaid: string; tds: string; bsrCode: string | null }[];
  files: { deductees: { filename: string; content: string }; challans: { filename: string; content: string } };
}

const TABS = ["deduct", "challans", "return", "tcs", "tracker", "sections"] as const;
type Tab = (typeof TABS)[number];
const NS = ["tds.errors", "hr.errors"];

function save(f: { filename: string; content: string }) {
  const url = URL.createObjectURL(new Blob([f.content], { type: "text/csv" }));
  Object.assign(document.createElement("a"), { href: url, download: f.filename }).click();
  URL.revokeObjectURL(url);
}

type Call = (fn: () => Promise<unknown>, done?: () => void) => Promise<void>;

/** Tax held back from payments other than salary: deduct, deposit, and the quarterly return. */
export function Tds({ fy, sections, tcsSections, tcsCompanyId, companies, tcsPayees, deductions, challans, banks, payees, canEdit }: { fy: string; sections: TdsSection[]; tcsSections: TcsSection[]; tcsCompanyId: string; companies: { id: string; name: string }[]; tcsPayees: Option[]; deductions: Deduction[]; challans: Challan[]; banks: Option[]; payees: Option[]; canEdit: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("deduct");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });
  const call: Call = async (fn, done) => {
    setBusy(true);
    setError(null);
    try { await fn(); done?.(); router.refresh(); } catch (err) { setError(errorText(t, err, NS)); } finally { setBusy(false); }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2" role="tablist">
        {TABS.map((k) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => { setTab(k); setError(null); }}
            className={`rounded-lg border px-3 py-1.5 text-sm ${tab === k ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-surface-2"}`}>{t(`tds.tabs.${k}`)}</button>
        ))}
        <form className="ml-auto flex items-center gap-2">
          <label htmlFor="tds-fy" className="text-sm text-muted">{t("tds.year")}</label>
          <Input id="tds-fy" name="fy" defaultValue={fy} pattern="\d{4}-\d{2}" className="w-24" />
          <Button type="submit" variant="outline">{t("common.apply")}</Button>
        </form>
      </div>
      {error ? <Alert>{error}</Alert> : null}
      {tab === "deduct" ? <Deduct sections={sections} payees={payees} canEdit={canEdit} busy={busy} call={call} /> : null}
      {tab === "deduct" ? <DeductionList deductions={deductions} canEdit={canEdit} busy={busy} call={call} money={money} /> : null}
      {tab === "challans" ? <Deposit deductions={deductions} challans={challans} banks={banks} canEdit={canEdit} busy={busy} call={call} money={money} /> : null}
      {tab === "return" ? <Return fy={fy} money={money} /> : null}
      {tab === "return" ? <CertificateBox fy={fy} payees={payees} /> : null}
      {tab === "tcs" ? <TcsPanel fy={fy} sections={tcsSections} companyId={tcsCompanyId} companies={companies} payees={tcsPayees} banks={banks} canEdit={canEdit} /> : null}
      {tab === "tracker" ? <TrackerPanel fy={fy} /> : null}
      {tab === "sections" ? <Sections sections={sections} /> : null}
      {tab === "sections" ? <SectionMapPanel canEdit={canEdit} /> : null}
    </div>
  );
}

function Deduct({ sections, payees, canEdit, busy, call }: { sections: TdsSection[]; payees: Option[]; canEdit: boolean; busy: boolean; call: Call }) {
  const t = useTranslations();
  const format = useFormatter();
  const [deducteeId, setDeducteeId] = useState("");
  const [section, setSection] = useState(sections[0]?.code ?? "");
  const [date, setDate] = useState("");
  const [base, setBase] = useState("");
  const [rate, setRate] = useState("");
  const [note, setNote] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  useEffect(() => { setDate(todayIso()); }, []);
  useEffect(() => {
    setPreview(null);
    if (!deducteeId || !section || !date || !/^\d+(\.\d{1,2})?$/.test(base) || Number(base) <= 0 || (rate && !/^\d{1,2}(\.\d{1,2})?$/.test(rate))) return;
    const q = new URLSearchParams({ deducteeId, section, date, base, ...(rate ? { rate } : {}) });
    let live = true;
    api<Preview>(`/tds/preview?${q}`).then((p) => { if (live) setPreview(p); }).catch(() => { if (live) setPreview(null); });
    return () => { live = false; };
  }, [deducteeId, section, date, base, rate]);
  if (!canEdit) return null;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void call(() => api("/tds/deductions", { body: { deducteeId, section, date, base, rate: rate || null, note: note.trim() || null } }), () => { setBase(""); setRate(""); setNote(""); });
  };
  const cur = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });
  return (
    <Card>
      <form onSubmit={submit} method="post" className="flex flex-wrap items-end gap-4">
        <Field label={t("tds.payee")} htmlFor="td-payee"><Select id="td-payee" value={deducteeId} onChange={(e) => setDeducteeId(e.target.value)} required className="w-64"><option value="" />{payees.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select></Field>
        <Field label={t("tds.section")} htmlFor="td-sec"><Select id="td-sec" value={section} onChange={(e) => setSection(e.target.value)} className="w-72">{sections.map((s) => <option key={s.code} value={s.code}>{s.code} {s.nature}</option>)}</Select></Field>
        <Field label={t("tds.date")} htmlFor="td-date"><Input id="td-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
        <Field label={t("tds.amount")} htmlFor="td-base"><Input id="td-base" value={base} onChange={(e) => setBase(e.target.value)} inputMode="decimal" className="num w-36" required /></Field>
        <Field label={t("tds.rate")} htmlFor="td-rate"><Input id="td-rate" value={rate} onChange={(e) => setRate(e.target.value)} inputMode="decimal" className="num w-28" /></Field>
        <Field label={t("tds.note")} htmlFor="td-note"><Input id="td-note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} className="w-56" /></Field>
        <Button type="submit" disabled={busy || !deducteeId || !base}>{t("tds.deduct")}</Button>
      </form>
      {preview ? (
        <p role="status" className="mt-3 text-sm">
          {Number(preview.tds) > 0 ? t("tds.preview", { tds: cur(preview.tds), rate: Number(preview.rate), taxable: cur(preview.taxableBase) }) : t("tds.previewNone")}
          {preview.noPan ? <span className="ml-2 text-warning">{t("tds.noPanWarn")}</span> : null}
        </p>
      ) : null}
    </Card>
  );
}

function DeductionList({ deductions, canEdit, busy, call, money }: { deductions: Deduction[]; canEdit: boolean; busy: boolean; call: Call; money: (v: string) => string }) {
  const t = useTranslations();
  const cancel = (path: string) => {
    const reason = window.prompt(t("tds.cancelReason"));
    if (reason && reason.trim().length >= 3) void call(() => api(path, { body: { reason: reason.trim() } }));
  };
  return (
    <Card className="p-0">
      <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("tds.deductions")}</h2>
      {deductions.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted">
              <tr className="border-b border-rule">
                <th className="px-4 py-1.5 font-medium">{t("tds.date")}</th><th className="px-4 py-1.5 font-medium">{t("tds.payeeCol")}</th><th className="px-4 py-1.5 font-medium">{t("tds.section")}</th>
                <th className="px-4 py-1.5 text-right font-medium">{t("tds.baseCol")}</th><th className="px-4 py-1.5 text-right font-medium">{t("tds.rateCol")}</th><th className="px-4 py-1.5 text-right font-medium">{t("tds.tdsCol")}</th>
                <th className="px-4 py-1.5 font-medium">{t("tds.statusCol")}</th><th />
              </tr>
            </thead>
            <tbody>
              {deductions.map((d) => (
                <tr key={d.id} className={`border-b border-rule last:border-0 ${d.status === "cancelled" ? "text-muted line-through" : ""}`}>
                  <td className="px-4 py-1.5 whitespace-nowrap">{d.date}</td>
                  <td className="px-4 py-1.5">{d.deductee}</td>
                  <td className="px-4 py-1.5">{d.section}</td>
                  <td className="num px-4 py-1.5 text-right">{money(d.base)}</td>
                  <td className="num px-4 py-1.5 text-right">{Number(d.rate)}%</td>
                  <td className="num px-4 py-1.5 text-right font-medium">{money(d.tds)}</td>
                  <td className="px-4 py-1.5">
                    {d.status === "cancelled" ? <Badge tone="neutral">{t("tds.cancelled")}</Badge> : d.challanId ? <Badge tone="success">{t("tds.deposited")}</Badge> : Number(d.tds) > 0 ? <Badge tone="warning">{t("tds.notDeposited")}</Badge> : null}
                  </td>
                  <td className="px-4 py-1.5 text-right">
                    {canEdit && d.status === "posted" && !d.challanId ? <button type="button" disabled={busy} onClick={() => cancel(`/tds/deductions/${d.id}/cancel`)} className="text-primary hover:underline">{t("tds.cancel")}</button> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="px-4 py-6 text-center text-muted">{t("tds.none")}</p>}
    </Card>
  );
}

function Deposit({ deductions, challans, banks, canEdit, busy, call, money }: { deductions: Deduction[]; challans: Challan[]; banks: Option[]; canEdit: boolean; busy: boolean; call: Call; money: (v: string) => string }) {
  const t = useTranslations();
  const open = deductions.filter((d) => d.status === "posted" && !d.challanId && Number(d.tds) > 0);
  const [picked, setPicked] = useState<string[]>([]);
  const [paidOn, setPaidOn] = useState("");
  const [accountId, setAccountId] = useState("");
  const [bsr, setBsr] = useState("");
  const [serial, setSerial] = useState("");
  const [amount, setAmount] = useState("");
  useEffect(() => { setPaidOn(todayIso()); }, []);
  const total = open.filter((d) => picked.includes(d.id)).reduce((s, d) => s + Number(d.tds), 0);
  useEffect(() => { setAmount(total ? total.toFixed(2) : ""); }, [total]);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void call(() => api("/tds/challans", { body: { paidOn, amount, accountId, bsrCode: bsr, challanSerial: serial, deductionIds: picked } }), () => { setPicked([]); setBsr(""); setSerial(""); });
  };
  const cancel = (id: string) => {
    const reason = window.prompt(t("tds.cancelReason"));
    if (reason && reason.trim().length >= 3) void call(() => api(`/tds/challans/${id}/cancel`, { body: { reason: reason.trim() } }));
  };
  return (
    <>
      {canEdit ? (
        <Card>
          <h2 className="mb-2 font-semibold">{t("tds.depositTitle")}</h2>
          {open.length ? (
            <fieldset className="mb-4">
              <legend className="mb-1 text-sm text-muted">{t("tds.pick")}</legend>
              <ul className="max-h-56 overflow-y-auto text-sm">
                {open.map((d) => (
                  <li key={d.id}>
                    <label className="flex items-center gap-2 py-0.5">
                      <input type="checkbox" checked={picked.includes(d.id)} onChange={(e) => setPicked(e.target.checked ? [...picked, d.id] : picked.filter((x) => x !== d.id))} />
                      {d.date} {d.deductee} {d.section}<span className="num ml-auto">{money(d.tds)}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
          ) : <p className="mb-4 text-sm text-muted">{t("tds.none")}</p>}
          <form onSubmit={submit} method="post" className="flex flex-wrap items-end gap-4">
            <Field label={t("tds.paidOn")} htmlFor="tc-date"><Input id="tc-date" type="date" value={paidOn} onChange={(e) => setPaidOn(e.target.value)} required /></Field>
            <Field label={t("tds.bank")} htmlFor="tc-bank"><Select id="tc-bank" value={accountId} onChange={(e) => setAccountId(e.target.value)} required className="w-56"><option value="" />{banks.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</Select></Field>
            <Field label={t("tds.bsr")} htmlFor="tc-bsr"><Input id="tc-bsr" value={bsr} onChange={(e) => setBsr(e.target.value)} inputMode="numeric" maxLength={7} pattern="\d{7}" className="num w-32" required /></Field>
            <Field label={t("tds.serial")} htmlFor="tc-serial"><Input id="tc-serial" value={serial} onChange={(e) => setSerial(e.target.value)} inputMode="numeric" maxLength={8} pattern="\d{1,8}" className="num w-32" required /></Field>
            <Field label={t("tds.challanAmount")} htmlFor="tc-amt"><Input id="tc-amt" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" className="num w-36" required /></Field>
            <Button type="submit" disabled={busy || !accountId || !bsr || !serial || !amount}>{t("tds.depositGo")}</Button>
          </form>
        </Card>
      ) : null}
      <Card className="p-0">
        <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("tds.challansTitle")}</h2>
        {challans.length ? (
          <ul>
            {challans.map((c) => (
              <li key={c.id} className={`flex flex-wrap items-center gap-x-4 border-b border-rule px-4 py-2 text-sm last:border-0 ${c.status === "cancelled" ? "text-muted line-through" : ""}`}>
                <span>{c.paidOn}</span><span className="font-mono text-xs text-muted">{c.bsrCode} / {c.challanSerial}</span><span className="num font-medium">{money(c.amount)}</span>
                {canEdit && c.status === "posted" ? <button type="button" disabled={busy} onClick={() => cancel(c.id)} className="ml-auto text-primary hover:underline">{t("tds.cancel")}</button> : null}
              </li>
            ))}
          </ul>
        ) : <p className="px-4 py-6 text-center text-muted">{t("tds.none")}</p>}
      </Card>
    </>
  );
}

function Return({ fy, money }: { fy: string; money: (v: string) => string }) {
  const t = useTranslations();
  const [quarter, setQuarter] = useState(2);
  const [r, setR] = useState<Return26Q | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    setError(null);
    api<Return26Q>(`/tds/26q?fy=${fy}&quarter=${quarter}`).then((x) => { if (live) setR(x); }).catch((err) => { if (live) setError(errorText(t, err, NS)); });
    return () => { live = false; };
  }, [fy, quarter, t]);
  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-end gap-4">
        <Field label={t("tds.quarter")} htmlFor="tr-q"><Select id="tr-q" value={String(quarter)} onChange={(e) => setQuarter(Number(e.target.value))} className="w-28">{[1, 2, 3, 4].map((q) => <option key={q} value={q}>Q{q}</option>)}</Select></Field>
        {r ? <Button variant="outline" onClick={() => save(r.files.deductees)} disabled={!r.deductees.length}><Download className="size-4" aria-hidden />{t("tds.download")}</Button> : null}
        {r ? <Button variant="outline" onClick={() => save(r.files.challans)} disabled={Number(r.totals.deposited) === 0}><Download className="size-4" aria-hidden />{t("tds.downloadChallans")}</Button> : null}
      </div>
      {error ? <Alert>{error}</Alert> : null}
      {r ? (
        <>
          <p className="mb-2 text-sm">{t("tds.deducted")}: <span className="num font-medium">{money(r.totals.deducted)}</span> · {t("tds.depositedTotal")}: <span className="num font-medium">{money(r.totals.deposited)}</span></p>
          {r.warnings.length ? <ul className="mb-3 list-disc pl-5 text-sm text-warning">{r.warnings.map((w, i) => <li key={i}>{t(`tds.warn.${w.code}`, { detail: w.detail })}</li>)}</ul> : null}
          {r.deductees.length ? (
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted">
                <tr className="border-b border-rule">
                  <th className="py-1.5 font-medium">{t("tds.payeeCol")}</th><th className="py-1.5 font-medium">PAN</th><th className="py-1.5 font-medium">{t("tds.section")}</th><th className="py-1.5 font-medium">{t("tds.date")}</th>
                  <th className="py-1.5 text-right font-medium">{t("tds.baseCol")}</th><th className="py-1.5 text-right font-medium">{t("tds.tdsCol")}</th>
                </tr>
              </thead>
              <tbody>
                {r.deductees.map((d, i) => (
                  <tr key={i} className="border-b border-rule last:border-0">
                    <td className="py-1.5">{d.name}</td><td className="py-1.5 font-mono text-xs">{d.pan ?? ""}</td><td className="py-1.5">{d.section}</td><td className="py-1.5">{d.date}</td>
                    <td className="num py-1.5 text-right">{money(d.amountPaid)}</td><td className="num py-1.5 text-right">{money(d.tds)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="text-sm text-muted">{t("tds.none")}</p>}
          <p className="mt-3 text-xs text-muted">{t("tds.hint")}</p>
        </>
      ) : null}
    </Card>
  );
}

function Sections({ sections }: { sections: TdsSection[] }) {
  const t = useTranslations();
  const format = useFormatter();
  const n = (v: string) => format.number(Number(v));
  return (
    <Card className="p-0">
      <p className="px-4 py-2 text-sm text-muted">{t("tds.sectionsHelp")}</p>
      <table className="w-full text-sm">
        <thead className="text-left text-xs text-muted">
          <tr className="border-y border-rule">
            <th className="px-4 py-1.5 font-medium">{t("tds.section")}</th><th className="px-4 py-1.5 font-medium">{t("tds.natureCol")}</th>
            <th className="px-4 py-1.5 text-right font-medium">{t("tds.individualCol")}</th><th className="px-4 py-1.5 text-right font-medium">{t("tds.otherCol")}</th>
            <th className="px-4 py-1.5 text-right font-medium">{t("tds.singleCol")}</th><th className="px-4 py-1.5 text-right font-medium">{t("tds.annualCol")}</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((s) => (
            <tr key={s.code} className="border-b border-rule last:border-0">
              <td className="px-4 py-1.5 font-medium">{s.code}</td>
              <td className="px-4 py-1.5">{s.nature}{s.excessOnly ? <span className="block text-xs text-muted">{t("tds.excess")}</span> : null}</td>
              <td className="num px-4 py-1.5 text-right">{Number(s.rateIndividual)}</td><td className="num px-4 py-1.5 text-right">{Number(s.rateOther)}</td>
              <td className="num px-4 py-1.5 text-right">{Number(s.singleLimit) ? n(s.singleLimit) : ""}</td><td className="num px-4 py-1.5 text-right">{n(s.annualLimit)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
