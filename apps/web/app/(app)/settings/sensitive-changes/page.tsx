import clsx from "clsx";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { Badge, Button, Card, Field, Input, PageHeader, Select } from "@/components/ui";
import { fyStart, todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

const KINDS = ["bank", "credit", "tax", "permissions", "period", "payroll", "override", "device"] as const;
interface Row { id: string; at: string; user: string | null; entity: string; action: string; kind: (typeof KINDS)[number]; before: Record<string, unknown> | null; after: Record<string, unknown> | null }
type Props = { searchParams: Promise<{ from?: string; to?: string; kind?: string }> };

export async function generateMetadata() {
  return { title: (await getTranslations("sensitive"))("title") };
}

/** What changed that could move money or open a door, who changed it and when, newest first. */
export default async function SensitiveChangesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const valid = (d?: string) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : undefined);
  const to = valid(sp.to) ?? todayIso();
  const from = valid(sp.from) ?? new Date(Date.parse(`${to}T00:00:00Z`) - 30 * 86_400_000).toISOString().slice(0, 10);
  const kind = KINDS.find((k) => k === sp.kind);
  const t = await getTranslations("sensitive");
  const ta = await getTranslations("audit");
  const tc = await getTranslations("common");
  const format = await getFormatter();
  const { rows } = await serverApi<{ rows: Row[] }>(`/audit-log/sensitive?from=${from}&to=${to}${kind ? `&kind=${kind}` : ""}`);
  const tone = (k: Row["kind"]) => (k === "bank" || k === "override" ? "danger" : k === "permissions" || k === "credit" ? "warning" : "info");
  return (
    <>
      <PageHeader icon={ShieldAlert} title={t("title")} subtitle={t("subtitle")} print />
      <form method="get" className="mb-4 flex flex-wrap items-end gap-3 print:hidden">
        <Field label={tc("from")} htmlFor="sc-from"><Input id="sc-from" type="date" name="from" defaultValue={from} /></Field>
        <Field label={tc("to")} htmlFor="sc-to"><Input id="sc-to" type="date" name="to" defaultValue={to} /></Field>
        <Field label={ta("what")} htmlFor="sc-kind">
          <Select id="sc-kind" name="kind" defaultValue={kind ?? ""} className="w-52"><option value="">{t("all")}</option>{KINDS.map((k) => <option key={k} value={k}>{t(`kind.${k}`)}</option>)}</Select>
        </Field>
        <Button type="submit" variant="outline">{t("show")}</Button>
      </form>
      <Card className="p-0">
        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-[0.9286rem]">
              <thead><tr className="border-b border-border bg-surface-2 text-left text-xs font-semibold text-muted"><th className="px-3 py-1.5">{ta("when")}</th><th className="px-3 py-1.5">{ta("who")}</th><th className="px-3 py-1.5">{ta("what")}</th><th className="px-3 py-1.5">{ta("details")}</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-rule align-top last:border-0">
                    <td className="px-3 py-2 whitespace-nowrap">{format.dateTime(new Date(r.at), { dateStyle: "medium", timeStyle: "short" })}</td>
                    <td className="px-3 py-2">{r.user ?? "-"}</td>
                    <td className="px-3 py-2"><Badge tone={tone(r.kind)}>{t(`kind.${r.kind}`)}</Badge><div className="mt-1 text-xs text-muted">{ta.has(`actions.${r.action}`) ? ta(`actions.${r.action}`) : r.action} · {r.entity}</div></td>
                    <td className="px-3 py-2 font-mono text-xs break-all text-muted">
                      {r.before && Object.keys(r.before).length ? <div className={clsx("text-faint line-through")}>{JSON.stringify(r.before)}</div> : null}
                      {r.after ? <div>{JSON.stringify(r.after)}</div> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="px-4 py-8 text-center text-muted">{t("none")}</p>}
      </Card>
      <p className="mt-3 text-[0.8571rem] text-muted print:hidden"><Link href="/settings/audit-log" className="font-semibold text-primary hover:underline">{ta("title")}</Link></p>
    </>
  );
}
