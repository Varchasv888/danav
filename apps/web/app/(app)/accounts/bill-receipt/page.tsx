import { ReceiptText } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BillReceiptForm, type OpenBills } from "@/components/accounts/BillReceiptForm";
import { PageHeader } from "@/components/ui";
import { cashBankAccounts, customers, suppliers } from "@/lib/masters";
import { serverApi } from "@/lib/server-api";

type Props = { searchParams: Promise<{ kind?: string; party?: string }> };

export async function generateMetadata({ searchParams }: Props) {
  const { kind } = await searchParams;
  return { title: (await getTranslations("billReceipt"))(kind === "payable" ? "titlePayable" : "titleReceivable") };
}

/** Bill-wise receipt from a customer, or payment to a supplier: choose the bills the money settles. */
export default async function BillReceiptPage({ searchParams }: Props) {
  const { kind: k, party } = await searchParams;
  const kind = k === "payable" ? "payable" : "receivable";
  const t = await getTranslations("billReceipt");
  const [parties, accounts] = await Promise.all([kind === "payable" ? suppliers() : customers(), cashBankAccounts()]);
  const partyId = parties.find((p) => p.id === party)?.id ?? "";
  const open = partyId ? await serverApi<OpenBills>(`/bill-receipts/open?kind=${kind}&partyId=${partyId}`) : null;
  return (
    <>
      <PageHeader icon={ReceiptText} title={t(kind === "payable" ? "titlePayable" : "titleReceivable")} subtitle={t(kind === "payable" ? "subtitlePayable" : "subtitleReceivable")} />
      <BillReceiptForm key={`${kind}-${partyId}`} kind={kind} parties={parties.map((p) => ({ id: p.id, name: p.name }))} accounts={accounts.map((a) => ({ id: a.id, name: a.name }))} partyId={partyId} open={open} />
    </>
  );
}
