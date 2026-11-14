import { ClipboardCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { DataTable, type Column, type Row } from "@/components/data/DataTable";
import { PageHeader } from "@/components/ui";
import { serverApi } from "@/lib/server-api";

interface PickRow { id: string; number: string; status: string; orderNumber: string; customer: string; createdAt: string; exceptions: number }

export async function generateMetadata() {
  return { title: (await getTranslations("picking"))("title") };
}

/** The walks through the bins for orders, newest first. A list is made from the order page, once stock is set aside. */
export default async function PickListsPage() {
  const t = await getTranslations();
  const rows = await serverApi<PickRow[]>("/pick-lists");
  const columns: Column[] = [
    { key: "number", label: t("picking.number"), type: "link" }, { key: "date", label: t("common.date"), type: "date" }, { key: "order", label: t("picking.order") },
    { key: "customer", label: t("picking.customer") }, { key: "status", label: t("picking.status"), type: "status" }, { key: "exceptions", label: t("picking.exceptionsShort"), type: "count" },
  ];
  const data: Row[] = rows.map((r) => ({
    id: r.id, href: `/inventory/pick-lists/${r.id}`, number: r.number, date: r.createdAt.slice(0, 10), order: r.orderNumber, customer: r.customer,
    status: { label: t(`picking.statuses.${r.status}`), tone: r.status === "done" ? "success" : r.status === "open" ? "info" : "neutral" }, exceptions: r.exceptions,
  }));
  return (
    <>
      <PageHeader icon={ClipboardCheck} title={t("picking.title")} subtitle={t("picking.subtitle")} />
      <DataTable id="pick-lists" title={t("picking.title")} columns={columns} rows={data} empty={{ title: t("picking.empty"), hint: t("picking.emptyHint") }} />
    </>
  );
}
