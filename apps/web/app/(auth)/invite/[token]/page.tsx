import { getTranslations } from "next-intl/server";
import { AcceptInvite } from "@/components/team/AcceptInvite";

const API_URL = process.env.API_URL ?? "http://localhost:4100";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const t = await getTranslations("invite");
  const res = await fetch(`${API_URL}/invitations/lookup/${encodeURIComponent(token)}`, { cache: "no-store" });
  if (!res.ok) return <p className="rounded-lg bg-danger-soft p-4 text-sm text-danger">{t("invalid")}</p>;
  const inv = (await res.json()) as { tenantName: string; email: string; roleName: string; hasAccount: boolean };
  return (
    <>
      <h1 className="text-[1.75rem] leading-tight font-semibold">{t("title", { business: inv.tenantName })}</h1>
      <p className="mt-1 text-sm text-muted">{t("subtitle", { email: inv.email, role: inv.roleName })}</p>
      <AcceptInvite token={token} hasAccount={inv.hasAccount} />
    </>
  );
}
