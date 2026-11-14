import { getFormatter, getTranslations } from "next-intl/server";
import { Card, PageHeader } from "@/components/ui";
import { serverApi } from "@/lib/server-api";

interface Data {
  totalHeld: string; totalDue: string;
  customers: { phone: string; name: string; open: number; held: string; due: string; jobs: { kind: string; number: string; date: string; status: string; amount: string; held: string; due: string }[] }[];
}

export async function generateMetadata() {
  return { title: (await getTranslations("serviceCustomers"))("title") };
}

/** Repair and tailoring customers: what they paid up front (held for them, not income yet) and what is still to collect. */
export default async function ServiceCustomersPage() {
  const t = await getTranslations("serviceCustomers");
  const format = await getFormatter();
  const d = await serverApi<Data>("/reports/service-customers");
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Card className="mb-4 p-4 text-sm"><span>{t("held")}: <span className="num font-semibold">{money(d.totalHeld)}</span></span><span className="ml-6">{t("due")}: <span className="num font-semibold">{money(d.totalDue)}</span></span></Card>
      {d.customers.length === 0 ? <Card className="p-4 text-sm text-muted">{t("empty")}</Card> : d.customers.map((c) => (
        <Card key={c.phone || c.name} className="mb-3 p-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2"><span className="font-medium">{c.name} <span className="text-xs text-muted">{c.phone}</span></span><span className="num text-sm">{t("held")} {money(c.held)} · {t("due")} {money(c.due)}</span></div>
          <table className="w-full text-sm"><tbody>{c.jobs.map((j) => <tr key={j.number} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{j.number}<span className="ml-2 text-xs text-muted">{t(`kinds.${j.kind}`)}</span></td><td className="px-4 py-1.5">{j.date}</td><td className="px-4 py-1.5">{j.status}</td><td className="num px-4 py-1.5 text-right">{money(j.amount)}</td><td className="num px-4 py-1.5 text-right text-muted">{Number(j.held) ? money(j.held) : ""}</td><td className="num px-4 py-1.5 text-right">{Number(j.due) ? money(j.due) : ""}</td></tr>)}</tbody></table>
        </Card>
      ))}
    </>
  );
}
