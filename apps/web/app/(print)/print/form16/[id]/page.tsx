import { getTranslations } from "next-intl/server";
import { findState, formatIndian } from "@varchasv/domain";
import { PrintButton } from "@/components/sales/PrintButton";
import { serverApi } from "@/lib/server-api";

interface Form16 {
  fy: string; assessmentYear: string;
  employer: { name: string; pan: string | null; tan: string | null; address: { line1?: string; city?: string; pincode?: string } | null; stateCode: string | null };
  employee: { code: string; name: string; pan: string | null; designation: string | null; regime: string; from: string; to: string };
  components: { code: string; name: string; amount: string }[]; gross: string; previousEmployerSalary: string;
  hraExempt: string; standardDeduction: string; professionalTax: string; houseProperty: string; chapterVIA: string; taxableIncome: string;
  tax: string; rebate: string; surcharge: string; cess: string; total: string;
  quarters: { quarter: number; salary: string; tds: string; challans: { bsrCode: string | null; challanSerial: string | null; paidOn: string; amount: string }[] }[];
  tdsDeducted: string; taxPayableOrRefund: string; missingMonths: string[];
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ fy?: string }> }) {
  const f = await serverApi<Form16>(`/employees/${(await params).id}/form16?fy=${(await searchParams).fy}`);
  return { title: { absolute: `Form16 ${f.fy} ${f.employee.code} ${f.employee.name}` } };
}

/** Form 16 Part B, with labels in English and the company's second print language. Part A comes from TRACES. */
export default async function Form16Print({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ fy?: string }> }) {
  const f = await serverApi<Form16>(`/employees/${(await params).id}/form16?fy=${(await searchParams).fy}`);
  const en = await getTranslations({ locale: "en" });
  const { language: second } = await serverApi<{ language: string }>("/print-language");
  const hi = await getTranslations({ locale: second });
  const L = (k: string) => `${en(k)} / ${hi(k)}`;
  const m = (v: string) => formatIndian(v);
  const td = "border border-black/60 px-2 py-1";
  const num = `${td} text-right tabular-nums`;
  const row = (label: string, v: string, strong = false) => <tr className={strong ? "font-semibold" : ""}><td className={td}>{label}</td><td className={num}>{m(v)}</td></tr>;
  const a = f.employer.address;
  return (
    <main className="mx-auto max-w-[210mm] p-[10mm] text-[11px] leading-snug print:p-0">
      <style>{`@page { size: A4; margin: 10mm } @media print { .no-print { display: none } }`}</style>
      <div className="no-print mb-4 flex justify-end"><PrintButton /></div>
      <header className="border-b-2 border-black pb-2 text-center">
        <h1 className="text-lg font-bold">{L("form16.title")}</h1>
        <p>{en("form16.subtitle")}</p>
        <p className="mt-1 font-semibold">{L("form16.ay")}: {f.assessmentYear} · FY {f.fy}</p>
      </header>

      <table className="mt-3 w-full border-collapse">
        <tbody>
          <tr>
            <td className={`${td} w-1/2 align-top`}>
              <p className="font-semibold">{L("form16.employer")}</p>
              <p className="font-bold">{f.employer.name}</p>
              {a ? <p>{[a.line1, a.city, a.pincode].filter(Boolean).join(", ")}{f.employer.stateCode ? `, ${findState(f.employer.stateCode)?.name ?? ""}` : ""}</p> : null}
              <p>{en("form16.tan")}: <span className="font-mono">{f.employer.tan ?? "-"}</span> · {en("form16.pan")}: <span className="font-mono">{f.employer.pan ?? "-"}</span></p>
            </td>
            <td className={`${td} align-top`}>
              <p className="font-semibold">{L("form16.employee")}</p>
              <p className="font-bold">{f.employee.name} <span className="font-mono font-normal">({f.employee.code})</span></p>
              {f.employee.designation ? <p>{f.employee.designation}</p> : null}
              <p>{en("form16.pan")}: <span className="font-mono">{f.employee.pan ?? "-"}</span></p>
              <p>{en("form16.period")}: {f.employee.from} – {f.employee.to} · {en("form16.regime")}: {en(`hr.regimes.${f.employee.regime}`)}</p>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="mt-3 w-full border-collapse">
        <tbody>
          <tr><td className={`${td} font-semibold`} colSpan={2}>1. {L("form16.salary")}</td></tr>
          {f.components.map((c) => row(`   ${c.name}`, c.amount))}
          {row(L("form16.gross"), f.gross, true)}
          {Number(f.previousEmployerSalary) ? row(en("form16.previous"), f.previousEmployerSalary) : null}
          <tr><td className={`${td} font-semibold`} colSpan={2}>2. {L("form16.exemptions")}</td></tr>
          {Number(f.hraExempt) ? row(`   ${en("form16.hraExempt")}`, f.hraExempt) : null}
          {row(`   ${en("form16.standardDeduction")}`, f.standardDeduction)}
          {Number(f.professionalTax) ? row(`   ${en("form16.pt")}`, f.professionalTax) : null}
          {Number(f.houseProperty) ? row(`3. ${en("form16.houseProperty")}`, f.houseProperty) : null}
          {row(`4. ${L("form16.chapterVIA")}`, f.chapterVIA)}
          {row(`5. ${L("form16.taxableIncome")}`, f.taxableIncome, true)}
          {row(`6. ${en("form16.tax")}`, f.tax)}
          {Number(f.rebate) ? row(`   ${en("form16.rebate")}`, f.rebate) : null}
          {Number(f.surcharge) ? row(`   ${en("form16.surcharge")}`, f.surcharge) : null}
          {row(`   ${en("form16.cess")}`, f.cess)}
          {row(`7. ${L("form16.total")}`, f.total, true)}
          {row(`8. ${L("form16.tdsDeducted")}`, f.tdsDeducted)}
          {row(`9. ${L("form16.balance")}`, f.taxPayableOrRefund, true)}
        </tbody>
      </table>

      <table className="mt-3 w-full border-collapse">
        <thead>
          <tr><th className={`${td} text-left`} colSpan={4}>{L("form16.tdsQuarterly")}</th></tr>
          <tr><th className={`${td} text-left`}>{en("form16.quarter")}</th><th className={`${td} text-right`}>{en("form16.salary")}</th><th className={`${td} text-right`}>TDS</th><th className={`${td} text-left`}>{en("form16.challans")}</th></tr>
        </thead>
        <tbody>
          {f.quarters.map((q) => (
            <tr key={q.quarter}>
              <td className={td}>Q{q.quarter}</td><td className={num}>{m(q.salary)}</td><td className={num}>{m(q.tds)}</td>
              <td className={td}>{q.challans.map((c) => `${c.bsrCode ?? ""} · ${c.paidOn} · ${c.challanSerial ?? ""}`).join("; ") || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {f.missingMonths.length ? <p className="no-print mt-3 border-2 border-amber-700 p-2 font-semibold text-amber-800">{en("form16.missing", { months: f.missingMonths.join(", ") })}</p> : null}
      <p className="mt-4">{en("form16.verification")}</p>
      <p>{hi("form16.verification")}</p>
      <div className="mt-10 flex justify-between">
        <p className="italic">{en("form16.partA")}</p>
        <p className="border-t border-black pt-1">{L("form16.signature")}</p>
      </div>
    </main>
  );
}
