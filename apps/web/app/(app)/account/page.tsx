import { getTranslations } from "next-intl/server";
import { PasswordForm, ProfileForm } from "@/components/account/AccountForms";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("account"))("title") };
}

export default async function AccountPage() {
  const t = await getTranslations("account");
  const me = await serverApi<Me>("/auth/me");
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="flex flex-col gap-6">
        <ProfileForm name={me.user.name} email={me.user.email} />
        <PasswordForm />
      </div>
    </>
  );
}
