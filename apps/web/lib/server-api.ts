import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.API_URL ?? "http://localhost:4100";

/** Server-side call to the API, forwarding the user's session cookie. Redirects to /login on 401. */
export async function serverApi<T>(path: string): Promise<T> {
  const cookieHeader = (await cookies()).toString();
  const res = await fetch(`${API_URL}${path}`, { headers: { cookie: cookieHeader }, cache: "no-store" });
  if (res.status === 401) redirect("/login");
  if (!res.ok) throw new Error(`API ${path} failed with ${res.status}`);
  return res.json() as Promise<T>;
}

export interface Me {
  user: { id: string; email: string; name: string; locale: string };
  tenantId: string | null;
  role: string | null;
  permissions: string[];
  tenants: { tenantId: string; name: string; role: string }[];
  /** "master" (year-round access) or "staff" (today only); null for regular DB users. */
  localRole: "master" | "staff" | null;
}
