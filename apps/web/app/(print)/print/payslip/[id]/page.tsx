import { getTranslations } from "next-intl/server";
import { amountInWords, findState, formatIndian, wordsLang } from "@varchasv/domain";
import { PrintButton } from "@/components/sales/PrintButton";
import { serverApi } from "@/lib/server-api";
import { intlLocale } from "@varchasv/i18n/locales";

interface Detail {
  paidDays: string; earnings: { code: string; name: string; monthly: string; earned: string }[]; gross: string;
  pf: { employee: string; eps: string; employerEpf: string; edli: string; admin: string }; esi: { employee: string; employer: string };
  pt: string; lwf: { employee: string; employer: string }; tds: string; otherDeductions: { name: string; amount: string }[];
  totalDeductions: string; netPay: string; employerContributions: string;
  tax: { regime: string; annualSalary: string; taxableIncome: string; annualTax: string; deductedSoFar: string; estimatedMonths?: number };
  employee: { code: string; name: string; nameHi: string | null; designation: string | null; department: string | null; joinedOn: string; pan: string | null; uan: string | null; esiNumber: string | null; bankName: string | null; bankAccountLast4: string | null; paymentMode: string };
}
interface Slip {
  id: string; lopDays: string; detail: Detail; run: { period: string; status: string };
  company: { name: string; legalName: string | null }; branch: { address: { line1?: string; city?: string; pincode?: string }; stateCode: string } | null;
}

const monthLabel = (period: string, locale: string) => new Date(`${period}-01T00:00:00Z`).toLocaleString(intlLocale(locale), { month: "long", year: "numeric", timeZone: "UTC" });

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const s = await serverApi<Slip>(`/payslips/${(await params).id}`);
  return { title: { absolute: `Payslip ${s.run.period} ${s.detail.employee.code} ${s.detail.employee.name}` } };
}

/** A4 payslip with labels in English and the company's second print language (Hindi by default): earnings, deductions, net pay in words, employer contributions and the TDS working. */
export default async function PayslipPrint({ params }: { params: Promise<{ id: string }> }) {
  const s = await serverApi<Slip>(`/payslips/${(await params).id}`);
  const en = await getTranslations({ locale: "en" });
  const { language: second } = await serverApi<{ language: string }>("/print-language");
  const hi = await getTranslations({ locale: second });
  const L = (k: string, v?: Record<string, string>) => `${en(k, v)} / ${hi(k, v)}`;
  const d = s.detail;
  const e = d.employee;
  const money = (v: string) => formatIndian(v);
  const nz = (v: string) => Number(v) !== 0;
  const deductions: [string, string][] = [
    ["payroll.slip.pfEmployee", d.pf.employee], ["payroll.slip.esiEmployee", d.esi.employee], ["payroll.slip.pt", d.pt], ["payroll.slip.lwf", d.lwf.employee], ["payroll.slip.tds", d.tds],
  ];
  const employer: [string, string][] = [
    ["payroll.slip.eps", d.pf.eps], ["payroll.slip.epf", d.pf.employerEpf], ["payroll.slip.edli", d.pf.edli], ["payroll.slip.admin", d.pf.admin], ["payroll.slip.esiEmployer", d.esi.employer], ["payroll.slip.lwf", d.lwf.employer],
  ];
  const th = "border border-black/60 px-2 py-1 text-left font-semibold";
  const td = "border border-black/60 px-2 py-1";
  const num = `${td} text-right tabular-nums`;
  const addr = s.branch?.address;

  return (
    <main className="mx-auto max-w-[210mm] p-[10mm] text-[11px] leading-snug print:p-0">
      <style>{`@page { size: A4; margin: 10mm } @media print { .no-print { display: none } }`}</style>
      <div className="no-print mb-4 flex justify-end"><PrintButton /></div>
      {s.run.status === "draft" ? <p className="mb-2 border-2 border-amber-700 p-1 text-center font-bold text-amber-700">DRAFT</p> : null}
      <header className="border-b-2 border-black pb-3 text-center">
        <h1 className="text-lg font-bold">{s.company.legalName ?? s.company.name}</h1>
        {addr ? <p>{[addr.line1, addr.city, addr.pincode].filter(Boolean).join(", ")}{s.branch ? `, ${findState(s.branch.stateCode)?.name ?? ""}` : ""}</p> : null}
        <p className="mt-1 text-sm font-semibold">{en("payroll.slip.for", { month: monthLabel(s.run.period, "en") })} / {hi("payroll.slip.for", { month: monthLabel(s.run.period, second) })}</p>
      </header>

      <table className="mt-3 w-full">
        <tbody>
          <tr><td className="w-1/4 font-semibold">{L("hr.name")}</td><td>{e.name}{e.nameHi ? ` / ${e.nameHi}` : ""}</td><td className="w-1/4 font-semibold">{L("hr.code")}</td><td className="font-mono">{e.code}</td></tr>
          <tr><td className="font-semibold">{L("hr.designation")}</td><td>{[e.designation, e.department].filter(Boolean).join(", ")}</td><td className="font-semibold">{L("hr.joinedOn")}</td><td>{e.joinedOn}</td></tr>
          <tr><td className="font-semibold">{L("hr.pan")}</td><td className="font-mono">{e.pan ?? "-"}</td><td className="font-semibold">{L("hr.uan")}</td><td className="font-mono">{e.uan ?? "-"}</td></tr>
          <tr><td className="font-semibold">{L("payroll.cols.paidDays")}</td><td>{Number(d.paidDays)}</td><td className="font-semibold">{L("payroll.cols.lop")}</td><td>{Number(s.lopDays)}</td></tr>
          <tr><td className="font-semibold">{L("hr.paymentMode")}</td><td>{en(`hr.paymentModes.${e.paymentMode}`)}{e.bankAccountLast4 ? ` · ${e.bankName ?? ""} ••••${e.bankAccountLast4}` : ""}</td><td className="font-semibold">{e.esiNumber ? L("hr.esiNumber") : ""}</td><td className="font-mono">{e.esiNumber ?? ""}</td></tr>
        </tbody>
      </table>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <table className="w-full self-start border-collapse">
          <thead><tr><th className={th}>{L("payroll.slip.earnings")}</th><th className={`${th} text-right`}>{en("hr.salary.monthly")}</th><th className={`${th} text-right`}>₹</th></tr></thead>
          <tbody>
            {d.earnings.map((x) => <tr key={x.code}><td className={td}>{x.name}</td><td className={num}>{money(x.monthly)}</td><td className={num}>{money(x.earned)}</td></tr>)}
            <tr className="font-semibold"><td className={td} colSpan={2}>{L("payroll.cols.gross")}</td><td className={num}>{money(d.gross)}</td></tr>
          </tbody>
        </table>
        <table className="w-full self-start border-collapse">
          <thead><tr><th className={th}>{L("payroll.slip.deductions")}</th><th className={`${th} text-right`}>₹</th></tr></thead>
          <tbody>
            {deductions.filter(([, v]) => nz(v)).map(([k, v]) => <tr key={k}><td className={td}>{L(k)}</td><td className={num}>{money(v)}</td></tr>)}
            {d.otherDeductions.map((o) => <tr key={o.name}><td className={td}>{o.name}</td><td className={num}>{money(o.amount)}</td></tr>)}
            <tr className="font-semibold"><td className={td}>{L("common.total")}</td><td className={num}>{money(d.totalDeductions)}</td></tr>
          </tbody>
        </table>
      </div>

      <section className="mt-4 border-2 border-black p-2">
        <p className="text-base font-bold">{L("payroll.slip.netPay")}: ₹ {money(d.netPay)}</p>
        <p>{amountInWords(d.netPay, "en")}</p>
        {wordsLang(second) !== "en" ? <p>{amountInWords(d.netPay, wordsLang(second))}</p> : null}
      </section>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <table className="w-full self-start border-collapse">
          <thead><tr><th className={th} colSpan={2}>{L("payroll.slip.employer")}</th></tr></thead>
          <tbody>
            {employer.filter(([, v]) => nz(v)).map(([k, v]) => <tr key={k}><td className={td}>{en(k)}</td><td className={num}>{money(v)}</td></tr>)}
            <tr className="font-semibold"><td className={td}>{en("common.total")}</td><td className={num}>{money(d.employerContributions)}</td></tr>
          </tbody>
        </table>
        <table className="w-full self-start border-collapse">
          <thead><tr><th className={th} colSpan={2}>{L("payroll.slip.tax")} · {en(`hr.regimes.${d.tax.regime}`)}</th></tr></thead>
          <tbody>
            <tr><td className={td}>{en("payroll.slip.annualSalary")}</td><td className={num}>{money(d.tax.annualSalary)}</td></tr>
            <tr><td className={td}>{en("payroll.slip.taxableIncome")}</td><td className={num}>{money(d.tax.taxableIncome)}</td></tr>
            <tr><td className={td}>{en("payroll.slip.annualTax")}</td><td className={num}>{money(d.tax.annualTax)}</td></tr>
            <tr><td className={td}>{en("payroll.slip.deductedSoFar")}</td><td className={num}>{money(d.tax.deductedSoFar)}</td></tr>
          </tbody>
        </table>
      </div>
      {d.tax.estimatedMonths ? <p className="mt-2 text-[9px] text-black/70">{en("payroll.slip.estimated", { count: d.tax.estimatedMonths })}</p> : null}
      <p className="mt-6 text-center text-[9px] text-black/60">{en("payroll.slip.computerGenerated")}</p>
    </main>
  );
}
