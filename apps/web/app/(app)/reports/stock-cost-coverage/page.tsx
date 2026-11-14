import { PackageCheck } from "lucide-react";
import { businessDate } from "@varchasv/domain";
import { Badge, Button, Card, Field, Input, PageHeader, Select } from "@/components/ui";
import { serverApi } from "@/lib/server-api";

interface Warehouse { id: string; name: string }
interface Setup { warehouses: Warehouse[] }
interface Coverage {
  asOf: string;
  method: string;
  summary: {
    positivePositions: number;
    positionsWithZeroValue: number;
    zeroValueQty: string;
    positionsWithoutPositiveValue: number;
    qtyWithoutPositiveValue: string;
    positivePositionValue: string;
  };
  rows: {
    itemId: string; name: string; sku: string | null; uom: string;
    warehouseId: string; warehouse: string; qty: string; value: string; rate: string;
    costStatus: "valued" | "zero_value" | "negative_value";
  }[];
}

const rupees = (amount: string) => `₹${Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default async function StockCostCoveragePage({ searchParams }: { searchParams: Promise<{ asOf?: string; warehouseId?: string }> }) {
  const query = await searchParams;
  const asOf = query.asOf && /^\d{4}-\d{2}-\d{2}$/.test(query.asOf) ? query.asOf : businessDate();
  const setup = await serverApi<Setup>("/inventory/setup");
  const warehouseId = setup.warehouses.length === 1 ? setup.warehouses[0]!.id : query.warehouseId;
  const params = new URLSearchParams({ asOf });
  if (warehouseId) params.set("warehouseId", warehouseId);
  const data = await serverApi<Coverage>(`/reports/stock-cost-coverage?${params.toString()}`);
  const statusLabel = (status: Coverage["rows"][number]["costStatus"]) => status === "valued" ? "Carrying value present" : status === "zero_value" ? "Zero carrying value" : "Negative carrying value";

  return (
    <>
      <PageHeader icon={PackageCheck} print title="Stock cost coverage" subtitle={`Positive on-hand positions under the company’s ${data.method} valuation method. Zero value is a review flag and can be intentional.`} />
      <form method="get" className="mb-4 flex flex-wrap items-end gap-3 print:hidden">
        <Field label="As of date" htmlFor="coverage-as-of"><Input id="coverage-as-of" name="asOf" type="date" defaultValue={asOf} className="w-44" /></Field>
        {setup.warehouses.length > 1 ? <Field label="Warehouse" htmlFor="coverage-warehouse"><Select id="coverage-warehouse" name="warehouseId" defaultValue={warehouseId ?? ""} className="min-w-52"><option value="">All warehouses</option>{setup.warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}</Select></Field> : null}
        <Button type="submit" variant="outline">Show report</Button>
      </form>
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Card className="p-4"><p className="text-sm text-muted">Positive stock positions</p><p className="num mt-1 text-2xl font-semibold">{data.summary.positivePositions}</p></Card>
        <Card className="p-4"><p className="text-sm text-muted">Positions with zero carrying value</p><p className="num mt-1 text-2xl font-semibold">{data.summary.positionsWithZeroValue}</p><p className="mt-1 text-sm text-muted">{Number(data.summary.zeroValueQty).toLocaleString("en-IN")} units</p></Card>
        <Card className="p-4"><p className="text-sm text-muted">Value of positive stock positions</p><p className="num mt-1 text-2xl font-semibold">{rupees(data.summary.positivePositionValue)}</p><p className="mt-1 text-sm text-muted">As of {data.asOf}</p></Card>
      </div>
      <Card className="p-0">
        {data.rows.length ? <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead><tr className="border-b border-border bg-surface-2 text-left text-xs font-semibold text-muted"><th className="px-4 py-2">Item</th><th className="px-4 py-2">Warehouse</th><th className="px-4 py-2">Cost status</th><th className="px-4 py-2 text-right">Quantity</th><th className="px-4 py-2 text-right">Carrying value</th><th className="px-4 py-2 text-right">Average rate</th></tr></thead>
            <tbody>{data.rows.map((row) => <tr key={`${row.itemId}:${row.warehouseId}`} className="border-b border-rule last:border-0">
              <td className="px-4 py-2"><span className="font-medium">{row.name}</span>{row.sku ? <span className="ml-2 font-mono text-xs text-muted">{row.sku}</span> : null}<span className="ml-2 text-xs text-muted">{row.uom}</span></td>
              <td className="px-4 py-2">{row.warehouse}</td>
              <td className="px-4 py-2"><Badge tone={row.costStatus === "valued" ? "success" : "warning"}>{statusLabel(row.costStatus)}</Badge></td>
              <td className="num px-4 py-2 text-right">{Number(row.qty).toLocaleString("en-IN")}</td>
              <td className="num px-4 py-2 text-right">{rupees(row.value)}</td>
              <td className="num px-4 py-2 text-right">{rupees(row.rate)}</td>
            </tr>)}</tbody>
          </table>
        </div> : <p className="px-4 py-8 text-center text-muted">No positive stock positions on this date.</p>}
      </Card>
    </>
  );
}
