/** Document lists show at most this many rows (the API's cap); older ones are reached with dates. */
export const LIST_LIMIT = 500;

const ISO = /^\d{4}-\d{2}-\d{2}$/;

/** `?from=…&to=…` for a list request, keeping only well-formed dates. */
export function range(from?: string, to?: string) {
  const q = new URLSearchParams();
  if (from && ISO.test(from)) q.set("from", from);
  if (to && ISO.test(to)) q.set("to", to);
  const s = q.toString();
  return s ? `?${s}` : "";
}
