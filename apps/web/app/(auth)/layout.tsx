import { getTranslations } from "next-intl/server";
import { LanguageList } from "@/components/LanguageList";
import { LanguageSwitch } from "@/components/LanguageSwitch";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations();
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <aside className="cover margin-rule hidden flex-col justify-between gap-12 px-12 py-10 lg:flex xl:px-16">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="wordmark text-lg font-semibold">{t("brand.full")}</span>
        </div>
        <div className="flex max-w-xl flex-col gap-10">
          <p className="text-[2.75rem] leading-[1.08] font-semibold tracking-tight text-balance [font-variation-settings:'wdth'_118]">{t("brand.tagline")}</p>
          <ul className="flex flex-col gap-1.5 text-[0.9375rem] text-muted">
            <li>{t("roadmap.accounts")}</li>
            <li>{t("roadmap.sales")}</li>
            <li>{t("roadmap.offline")}</li>
            <li>{t("roadmap.payroll")}</li>
          </ul>
        </div>
        <LanguageList label={t("common.language")} />
      </aside>
      <main className="flex flex-col px-4 py-6 sm:px-10">
        <div className="flex items-center justify-between lg:justify-end">
          <span className="flex items-center gap-2.5 font-semibold lg:hidden"><Logo /><span className="wordmark">{t("brand.name")}</span></span>
          <LanguageSwitch />
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">{children}</div>
      </main>
    </div>
  );
}

function Logo() {
  return <span aria-hidden className="grid size-9 place-items-center rounded-md bg-khata text-lg font-semibold text-white">व</span>;
}
