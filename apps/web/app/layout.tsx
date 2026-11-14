import type { Metadata } from "next";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/anek-bangla/wdth.css";
import "@fontsource-variable/anek-devanagari/wdth.css";
import "@fontsource-variable/anek-gujarati/wdth.css";
import "@fontsource-variable/anek-gurmukhi/wdth.css";
import "@fontsource-variable/anek-kannada/wdth.css";
import "@fontsource-variable/anek-malayalam/wdth.css";
import "@fontsource-variable/anek-odia/wdth.css";
import "@fontsource-variable/anek-tamil/wdth.css";
import "@fontsource-variable/anek-telugu/wdth.css";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("brand");
  return { title: { default: t("full"), template: `%s · ${t("name")}` }, description: t("tagline") };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  // The chosen theme is a cookie, applied on the server, so the first paint is already right
  // (no inline script needed). No cookie = follow the operating system via prefers-color-scheme.
  const saved = (await cookies()).get("vtheme")?.value;
  const theme = saved === "light" || saved === "dark" ? saved : undefined;
  return (
    <html lang={locale} data-theme={theme} suppressHydrationWarning>
      <body className="min-h-dvh font-sans antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
