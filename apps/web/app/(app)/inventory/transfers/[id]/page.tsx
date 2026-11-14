import { Truck } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { TransferReceive } from "@/components/inventory/TransferReceive";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

interface Transfer {
  id: string; number: string; date: string; from: string; to: string; status: "in_transit" | "received" | "cancelled"; receivedOn: string | null; transporter: string | null; vehicleNo: string | null; narration: string | null;
  lines: { id: string; name: string; qty: string; receivedQty: string; shortQty: string }[];
}

export default async function TransferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations("transfers");
  const format = await getFormatter();
  const [tr, me] = await Promise.all([serverApi<Transfer>(`/stock-transfers/${id}`), serverApi<Me>("/auth/me")]);
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  const n = (v: string) => Number(v).toLocaleString("en-IN");
  return (
    <>
      <PageHeader
        icon={Truck} title={`${t("title")} ${tr.number}`}
        subtitle={[`${tr.from} to ${tr.to}`, day(tr.date), tr.transporter, tr.vehicleNo].filter(Boolean).join(", ")}
        actions={<StatusBadge status={tr.status === "in_transit" ? "partial" : tr.status === "received" ? "closed" : "cancelled"} label={t(`status.${tr.status}`)} />}
      />
      {tr.status === "in_transit" ? (
        <TransferReceive id={tr.id} lines={tr.lines} canReceive={me.permissions.includes("inventory.create")} canCancel={me.permissions.includes("inventory.cancel")} />
      ) : (
        <Card className="p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-muted"><tr className="border-b border-border"><th className="px-5 py-3 font-medium">{t("item")}</th><th className="px-5 py-3 text-right font-medium">{t("sent")}</th><th className="px-5 py-3 text-right font-medium">{t("received")}</th><th className="px-5 py-3 text-right font-medium">{t("short")}</th></tr></thead>
            <tbody>{tr.lines.map((l) => (
              <tr key={l.id} className="border-b border-border last:border-0"><td className="px-5 py-2.5 font-medium">{l.name}</td><td className="num px-5 py-2.5 text-right">{n(l.qty)}</td><td className="num px-5 py-2.5 text-right">{tr.status === "received" ? n(l.receivedQty) : ""}</td><td className="num px-5 py-2.5 text-right">{tr.status === "received" ? n(l.shortQty) : ""}</td></tr>
            ))}</tbody>
          </table>
          {tr.receivedOn ? <p className="border-t border-border px-5 py-2 text-xs text-muted">{t("receivedOn", { date: day(tr.receivedOn) })}</p> : null}
        </Card>
      )}
    </>
  );
}
