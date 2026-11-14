import { getTranslations } from "next-intl/server";
import { formatIndian } from "@varchasv/domain";
import { ReceiptView, type Receipt } from "@/components/pos/ReceiptView";
import { TaxDocument, type PrintData } from "@/components/print/TaxDocument";
import { PrintButton } from "@/components/sales/PrintButton";

import { serverApiUrl as API_URL } from "@/lib/server-api-url";

interface Statement {
  asOf: string; company: { name: string; gstin: string | null; address: { line1?: string; line2?: string; city?: string; pincode?: string } | null };
  bankDetails: string | null; customer: { name: string; gstin: string | null }; balance: string; advance: string; overdue: string;
  openItems: { number: string; date: string; dueOn: string; amount: string; daysOverdue: number }[];
}
type Shared = { kind: "pos_bill"; bill: Receipt } | ({ kind: "invoice" } & PrintData) | { kind: "statement"; statement: Statement };

async function load(token: string): Promise<Shared | null> {
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) return null;
  const res = await fetch(`${API_URL}/public/documents/${token}`, { cache: "no-store" });
  return res.ok ? ((await res.json()) as Shared) : null;
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }) {
  const s = await load((await params).token);
  const t = await getTranslations("share");
  const title = !s ? t("expiredTitle")
    : s.kind === "pos_bill" ? `${s.bill.number} · ${s.bill.company.name}`
      : s.kind === "invoice" ? `${s.invoice.number} · ${s.company.legalName ?? s.company.name}`
        : `${t("statement")} · ${s.statement.company.name}`;
  return { title: { absolute: title }, robots: { index: false } };
}

const date = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/** A customer's statement of open bills, as sent with a payment reminder. */
async function StatementView({ s }: { s: Statement }) {
  const t = await getTranslations("share");
  const addr = s.company.address;
  return (
    <main className="mx-auto max-w-2xl bg-white p-6 text-sm text-black print:p-0">
      <style>{`@media print { .no-print { display: none } }`}</style>
      <div className="no-print mb-4 flex justify-end"><PrintButton /></div>
      <header className="border-b border-black/20 pb-3">
        <p className="text-lg font-bold">{s.company.name}</p>
        {addr ? <p>{[addr.line1, addr.line2, addr.city, addr.pincode].filter(Boolean).join(", ")}</p> : null}
        {s.company.gstin ? <p>GSTIN {s.company.gstin}</p> : null}
      </header>
      <section className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-base font-semibold">{t("statementFor", { name: s.customer.name })}</h1>
          <p className="text-black/60">{t("asOf", { date: date(s.asOf) })}</p>
        </div>
        <div className="text-right">
          <p className="text-black/60">{t("balance")}</p>
          <p className="text-2xl font-bold tabular-nums">₹{formatIndian(s.balance)}</p>
          {Number(s.overdue) ? <p className="font-medium text-red-700">{t("overdue", { amount: formatIndian(s.overdue) })}</p> : null}
        </div>
      </section>
      <table className="mt-4 w-full">
        <thead className="border-b border-black/20 text-left text-black/60">
          <tr><th className="py-1.5 font-medium">{t("bill")}</th><th className="font-medium">{t("date")}</th><th className="font-medium">{t("due")}</th><th className="text-right font-medium">{t("late")}</th><th className="text-right font-medium">{t("amount")}</th></tr>
        </thead>
        <tbody>
          {s.openItems.map((o, i) => (
            <tr key={i} className="border-b border-black/10">
              <td className="py-1.5">{o.number}</td><td>{date(o.date)}</td><td>{date(o.dueOn)}</td>
              <td className={`text-right tabular-nums ${o.daysOverdue ? "text-red-700" : ""}`}>{o.daysOverdue ? t("days", { n: o.daysOverdue }) : t("notDue")}</td>
              <td className="text-right tabular-nums">{formatIndian(o.amount)}</td>
            </tr>
          ))}
          {!s.openItems.length ? <tr><td colSpan={5} className="py-6 text-center text-black/60">{t("nothingOpen")}</td></tr> : null}
        </tbody>
      </table>
      {Number(s.advance) ? <p className="mt-2 text-right">{t("advance", { amount: formatIndian(s.advance) })}</p> : null}
      {s.bankDetails ? <section className="mt-6"><p className="font-semibold">{t("payTo")}</p><p className="whitespace-pre-line">{s.bankDetails}</p></section> : null}
      <p className="mt-6 text-black/60">{t("statementNote")}</p>
    </main>
  );
}

/** A bill, invoice or statement sent on WhatsApp: opens without signing in while the link is live. */
export default async function SharedDocumentPage({ params }: { params: Promise<{ token: string }> }) {
  const s = await load((await params).token);
  if (!s) {
    const t = await getTranslations("share");
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-2 px-6 text-center">
        <h1 className="text-xl font-semibold">{t("expiredTitle")}</h1>
        <p className="text-muted">{t("expired")}</p>
      </main>
    );
  }
  return (
    <div className="min-h-dvh bg-white text-black">
      {s.kind === "pos_bill" ? <ReceiptView r={s.bill} picker={false} /> : s.kind === "invoice" ? <TaxDocument d={s} kind="invoice" /> : <StatementView s={s.statement} />}
    </div>
  );
}
