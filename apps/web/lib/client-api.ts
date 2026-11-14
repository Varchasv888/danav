/** Browser-side API calls go through the same-origin /api rewrite (see next.config.ts). */
export class ApiError extends Error {
  constructor(public status: number, public code: string, public issues?: { path: string; message: string }[]) {
    super(code);
  }
}

/** Asks the person to type their password again; set by the step-up dialog in the app frame. Resolves with the password, or null if they cancel. */
let askPassword: (() => Promise<string | null>) | null = null;
export const setPasswordAsker = (fn: (() => Promise<string | null>) | null) => { askPassword = fn; };

/** Asks for the business passcode when cancelling a document needs it; set by the passcode box in the app frame. Resolves with the code, or null if they cancel. */
let askPasscode: ((wrong: boolean) => Promise<string | null>) | null = null;
export const setPasscodeAsker = (fn: ((wrong: boolean) => Promise<string | null>) | null) => { askPasscode = fn; };

export async function api<T = unknown>(path: string, init: { method?: string; body?: unknown } = {}, retried = false, passcode?: string): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method: init.method ?? (init.body ? "POST" : "GET"),
    headers: { ...(init.body ? { "content-type": "application/json" } : {}), ...(passcode ? { "x-passcode": passcode } : {}) },
    body: init.body ? JSON.stringify(init.body) : undefined,
    credentials: "same-origin",
  });
  const data = await res.json().catch(() => ({}));
  // A high-risk action asks for the password once; with it confirmed, the same request is sent again.
  if (res.status === 403 && data.error === "step_up_required" && !retried && askPassword) {
    const password = await askPassword();
    if (password) {
      await api("/auth/step-up", { body: { password } }, true);
      return api<T>(path, init, true);
    }
  }
  // Cancelling a document can need the business passcode; with it typed, the same request is sent again.
  if (res.status === 403 && (data.error === "passcode_required" || data.error === "passcode_wrong") && askPasscode) {
    const code = await askPasscode(data.error === "passcode_wrong");
    if (code) return api<T>(path, init, retried, code);
  }
  if (!res.ok) throw new ApiError(res.status, data.error ?? "generic", data.issues);
  return data as T;
}
