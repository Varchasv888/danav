import { Scale } from "lucide-react";
import { businessDate } from "@varchasv/domain";
import { Badge, Button, Card, Field, Input, PageHeader } from "@/components/ui";
import { serverApi } from "@/lib/server-api";
import { StockLedgerClose } from "@/components/inventory/StockLedgerClose";

interface Tieout {
  asOf: string;
  accountingMethod: "periodic";
  valuationMethod: string;
  stockSubledgerValue: string;
  stockInHandLedgerValue: string;
  difference: string;
  status: "reconciled" | "review_required";
  stockInHandAccounts: { accountId: string; name: string; balance: string }[];
  recentReconciliations: { id: string; number: string; date: string; narration: string | null; status: string; total: string }[];
  note: string;
  postingEnabled: boolean;
}
interface CurrentUser { permissions: string[] }

const rupees = (amount: string) => `₹${Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default async function StockLedgerReconciliationPage({ searchParams }: { searchParams: Promise<{ asOf?: string }> }) {
  const query = await searchParams;
  const asOf = query.asOf && /^\d{4}-\d{2}-\d{2}$/.test(query.asOf) ? query.asOf : businessDate();
  const data = await serverApi<Tieout>(`/reports/stock-ledger-reconciliation?asOf=${asOf}`);
  const me = await serverApi<CurrentUser>("/auth/me");

  return <>
    <PageHeader icon={Scale} print title="Stock-to-ledger tie-out" subtitle={`Periodic inventory valuation as of ${data.asOf}.`} />
    <form method="get" className="mb-4 flex flex-wrap items-end gap-3 print:hidden">
      <Field label="As of date" htmlFor="tieout-as-of"><Input id="tieout-as-of" name="asOf" type="date" defaultValue={asOf} className="w-44" /></Field>
      <Button type="submit" variant="outline">Show report</Button>
    </form>
    <div className="mb-4 grid gap-3 sm:grid-cols-3">
      <Card className="p-4"><p className="text-sm text-muted">Stock register value</p><p className="num mt-1 text-2xl font-semibold">{rupees(data.stockSubledgerValue)}</p></Card>
      <Card className="p-4"><p className="text-sm text-muted">Stock-in-Hand ledger balance</p><p className="num mt-1 text-2xl font-semibold">{rupees(data.stockInHandLedgerValue)}</p></Card>
      <Card className="p-4"><p className="text-sm text-muted">Difference to review</p><p className="num mt-1 text-2xl font-semibold">{rupees(data.difference)}</p><Badge tone={data.status === "reconciled" ? "success" : "warning"}>{data.status === "reconciled" ? "Reconciled" : "Review required"}</Badge></Card>
    </div>
    {data.postingEnabled
      ? <StockLedgerClose asOf={asOf} canPost={me.permissions.includes("inventory.approve")} />
      : <Card className="mb-4 p-4"><h2 className="font-semibold">Closing-stock journal is switched off</h2><p className="mt-1 text-sm text-muted">This report compares the stock register with the ledger. Posting a closing-stock journal stays off until your accountant has approved the stock policy, because it changes how the profit and loss and balance sheet read stock between closes.</p></Card>}
    <Card className="mb-4 p-4"><h2 className="font-semibold">Periodic inventory method</h2><p className="mt-1 text-sm text-muted">The valued stock register supplies closing stock to the financial statements. Compare it with the Stock-in-Hand ledger and review the difference before close. Posting is a separate approved action with a required reason.</p><p className="mt-2 text-sm">Valuation formula: <span className="font-medium">{data.valuationMethod}</span></p></Card>
    <Card className="p-0">
      <h2 className="px-4 py-3 font-semibold">Stock-in-Hand ledgers</h2>
      {data.stockInHandAccounts.length ? <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-sm"><thead><tr className="border-y border-border bg-surface-2 text-left text-xs text-muted"><th className="px-4 py-2">Ledger</th><th className="px-4 py-2 text-right">Balance</th></tr></thead><tbody>{data.stockInHandAccounts.map((account) => <tr key={account.accountId} className="border-b border-rule"><td className="px-4 py-2">{account.name}</td><td className="num px-4 py-2 text-right">{rupees(account.balance)}</td></tr>)}</tbody></table></div> : <p className="px-4 pb-4 text-sm text-muted">No ledger is currently classified under Stock-in-Hand.</p>}
      <p className="px-4 py-3 text-xs text-muted">{data.note}</p>
    </Card>
    <Card className="mt-4 p-0">
      <h2 className="px-4 py-3 font-semibold">Closing-stock journal history</h2>
      {data.recentReconciliations.length ? <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-sm"><thead><tr className="border-y border-border bg-surface-2 text-left text-xs text-muted"><th className="px-4 py-2">Date</th><th className="px-4 py-2">Journal</th><th className="px-4 py-2">Review reason</th><th className="px-4 py-2">Status</th><th className="px-4 py-2 text-right">Amount</th></tr></thead><tbody>{data.recentReconciliations.map((journal) => <tr key={journal.id} className="border-b border-rule"><td className="px-4 py-2">{journal.date}</td><td className="px-4 py-2 font-mono">{journal.number}</td><td className="px-4 py-2">{journal.narration}</td><td className="px-4 py-2">{journal.status}</td><td className="num px-4 py-2 text-right">{rupees(journal.total)}</td></tr>)}</tbody></table></div> : <p className="px-4 pb-4 text-sm text-muted">No closing-stock journals have been posted.</p>}
    </Card>
  </>;
}
