import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { Card, PageHeader } from "@/components/ui";
import { serverApi } from "@/lib/server-api";

type Message = {
  id: string; to: string; body: string; status: "sent" | "failed"; error: string | null; provider: string; createdAt: string;
  accountId: string | null; account: string | null; template: string | null; sentBy: string | null;
};

export async function generateMetadata() {
  return { title: (await getTranslations("share"))("logTitle") };
}

/** Every WhatsApp message the business sent: bills, invoices, reminders and CRM messages, newest first. */
export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const filter = status === "sent" || status === "failed" ? status : undefined;
  const t = await getTranslations();
  const format = await getFormatter();
  const [log, messaging] = await Promise.all([
    serverApi<{ counts: { sent: number; failed: number }; messages: Message[] }>(`/messages${filter ? `?status=${filter}` : ""}`),
    serverApi<{ provider: string }>("/crm/messaging"),
  ]);
  const tab = (key: "all" | "sent" | "failed", n?: number) => {
    const active = (key === "all" && !filter) || key === filter;
    return (
      <Link href={key === "all" ? "/crm/messages" : `/crm/messages?status=${key}`} aria-current={active ? "page" : undefined}
        className={`rounded-lg px-3 py-1.5 text-sm ${active ? "bg-primary text-on-primary" : "border border-border hover:bg-surface-2"}`}>
        {t(`share.filter.${key}`)}{n !== undefined ? <span className="num ml-1.5 opacity-80">{n}</span> : null}
      </Link>
    );
  };

  return (
    <>
      <PageHeader title={t("share.logTitle")} subtitle={t("share.logSubtitle")} />
      {messaging.provider === "demo" ? <p className="mb-4 text-sm text-muted">{t("crm.messages.demo")}</p> : null}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {tab("all")}{tab("sent", log.counts.sent)}{tab("failed", log.counts.failed)}
        <span className="ml-auto text-xs text-muted">{t("share.thisMonth")}</span>
      </div>
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-4 py-2.5 font-medium">{t("share.when")}</th>
                <th className="px-3 py-2.5 font-medium">{t("share.toCol")}</th>
                <th className="px-3 py-2.5 font-medium">{t("share.kind")}</th>
                <th className="px-3 py-2.5 font-medium">{t("share.message")}</th>
                <th className="px-3 py-2.5 font-medium">{t("share.status")}</th>
              </tr>
            </thead>
            <tbody>
              {log.messages.map((m) => (
                <tr key={m.id} className="border-b border-border align-top last:border-0">
                  <td className="px-4 py-2 whitespace-nowrap text-muted">{format.dateTime(new Date(m.createdAt), { dateStyle: "medium", timeStyle: "short" })}</td>
                  <td className="px-3 py-2">
                    {m.accountId && m.account ? <Link href={`/crm/customers/${m.accountId}`} className="font-medium hover:text-primary hover:underline">{m.account}</Link> : null}
                    <span className="num block text-xs text-muted">+{m.to}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{m.template ? t.has(`share.kinds.${m.template}`) ? t(`share.kinds.${m.template}`) : m.template.replace(/_/g, " ") : "-"}</td>
                  <td className="max-w-md px-3 py-2"><p className="line-clamp-2 break-words" title={m.body}>{m.body}</p>{m.sentBy ? <span className="text-xs text-muted">{t("share.by", { name: m.sentBy })}</span> : null}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${m.status === "sent" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>{t(`share.filter.${m.status}`)}</span>
                    {m.error ? <span className="mt-1 block text-xs text-danger">{t.has(`share.errors.${m.error}`) ? t(`share.errors.${m.error}`) : m.error}</span> : null}
                  </td>
                </tr>
              ))}
              {!log.messages.length ? <tr><td colSpan={5} className="px-4 py-10 text-center text-muted">{t("share.none")}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
