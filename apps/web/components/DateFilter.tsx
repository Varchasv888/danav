import { getTranslations } from "next-intl/server";
import { Button, Input } from "./ui";

/** Plain GET form: the page is a server component that reads the dates from searchParams. */
export async function DateFilter({ from, to, asOf, extra }: { from?: string; to?: string; asOf?: string; extra?: Record<string, string> }) {
  const t = await getTranslations("common");
  return (
    <form className="flex flex-wrap items-end gap-3 print:hidden">
      {extra ? Object.entries(extra).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />) : null}
      {asOf !== undefined ? (
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">{t("asOf")}</span>
          <Input type="date" name="asOf" defaultValue={asOf} className="w-44" />
        </label>
      ) : (
        <>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted">{t("from")}</span>
            <Input type="date" name="from" defaultValue={from} className="w-44" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted">{t("to")}</span>
            <Input type="date" name="to" defaultValue={to} className="w-44" />
          </label>
        </>
      )}
      <Button type="submit" variant="outline">{t("apply")}</Button>
    </form>
  );
}
