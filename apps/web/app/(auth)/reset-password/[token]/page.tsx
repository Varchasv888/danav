import { getTranslations } from "next-intl/server";
import { ResetPassword } from "@/components/account/ResetPassword";

export async function generateMetadata() {
  return { title: (await getTranslations("auth"))("resetTitle") };
}

export default async function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const t = await getTranslations("auth");
  return (
    <>
      <h1 className="text-[1.75rem] leading-tight font-semibold">{t("resetTitle")}</h1>
      <ResetPassword token={token} />
    </>
  );
}
