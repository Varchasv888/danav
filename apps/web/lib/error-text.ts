import { ApiError } from "./client-api";

type T = { (key: string): string; has(key: string): boolean };

/** The translated message for an API error, looked up in the given namespaces (e.g. "hr.errors"). */
export function errorText(t: T, err: unknown, namespaces: string[]) {
  const code = err instanceof ApiError ? (err.issues?.[0]?.message ?? err.code) : "generic";
  const key = [...namespaces, "auth.errors"].map((n) => `${n}.${code}`).find((k) => t.has(k));
  return key ? t(key) : t("auth.errors.generic");
}
