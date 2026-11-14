import { redirect } from "next/navigation";
import { BusinessSwitcher } from "@/components/BusinessSwitcher";
import { serverApi, type Me } from "@/lib/server-api";

export default async function ChooseBusiness() {
  const me = await serverApi<Me>("/auth/me");
  if (me.tenantId) redirect("/dashboard");
  return (
    <section className="flex flex-col gap-5">
      <h1 className="text-2xl font-semibold">Choose your business</h1>
      <p>You are signed in as {me.user.name}. Select an existing business or add your business to continue.</p>
      <BusinessSwitcher current={null} tenants={me.tenants} />
      <p className="text-sm text-muted">If your existing business is missing, ask its owner to invite this account. Create a business only when starting new books.</p>
    </section>
  );
}
