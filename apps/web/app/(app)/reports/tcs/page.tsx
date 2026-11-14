import { FileText } from "lucide-react";
import { TcsReport } from "@/components/accounts/TcsReport";
import { PageHeader } from "@/components/ui";
import { todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";
import { fiscalYearOf, tdsQuarter } from "@varchasv/domain";

interface TcsReturn {
  fy: string;
  quarter: number;
  from: string;
  to: string;
  tan: string | null;
  collector: string;
  challans: { id: string; paidOn: string; amount: string; bsrCode: string; challanSerial: string }[];
  collectees: { name: string; pan: string | null; section: string; date: string; amount: string; rate: string; tcs: string; bsrCode: string | null; challanSerial: string | null; depositedOn: string | null }[];
  totals: { collected: string; deposited: string };
  warnings: { code: string; detail: string }[];
  files: { collectees: { filename: string; content: string }; challans: { filename: string; content: string } };
}

export const metadata = { title: "TCS Report" };

export default async function TcsReportPage() {
  const today = todayIso();
  const fy = fiscalYearOf(today).label;
  const quarter = tdsQuarter(today);
  const report = await serverApi<TcsReturn>(`/tcs/27eq?fy=${fy}&quarter=${quarter}`);
  return (
    <>
      <PageHeader icon={FileText} title="TCS Report" subtitle="Form 27EQ collections, challan deposits, totals, warnings, and CSV downloads." print />
      <TcsReport initial={report} />
    </>
  );
}
