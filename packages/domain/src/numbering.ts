/**
 * Document numbers. GST rule 46: an invoice number is at most 16 characters, unique within the
 * financial year, and may contain only letters, digits, '-' and '/'.
 *
 * A series pattern uses tokens: {FY} → "25-26", {FYL} → "2025-26", {DEV} → device code,
 * {SEQ:n} → sequence padded to n digits. Example: "INV/{FY}/{SEQ:4}" → "INV/25-26/0001".
 * Offline devices get their own series containing {DEV}, so two devices never collide.
 */
export const GST_DOC_NUMBER_MAX = 16;
const ALLOWED = /^[A-Za-z0-9/-]+$/;

export interface NumberParts {
  fyShort: string;
  fyLabel: string;
  seq: number;
  device?: string;
}

export function formatDocumentNumber(pattern: string, parts: NumberParts): string {
  if (!Number.isInteger(parts.seq) || parts.seq < 1) throw new Error("sequence must be a positive integer");
  return pattern.replace(/\{(FYL|FY|DEV|SEQ(?::(\d+))?)\}/g, (_m, token: string, pad?: string) => {
    if (token === "FY") return parts.fyShort;
    if (token === "FYL") return parts.fyLabel;
    if (token === "DEV") {
      if (!parts.device) throw new Error("pattern uses {DEV} but no device code was given");
      return parts.device;
    }
    return String(parts.seq).padStart(pad ? Number(pad) : 1, "0");
  });
}

export type NumberProblem = "empty" | "too_long" | "bad_chars";

export function checkGstDocumentNumber(num: string): NumberProblem | null {
  if (num.length === 0) return "empty";
  if (num.length > GST_DOC_NUMBER_MAX) return "too_long";
  if (!ALLOWED.test(num)) return "bad_chars";
  return null;
}

/**
 * Validate a pattern by rendering its longest likely number (sequence 99999 by default).
 * Returns the problem, or null if every number the series will issue is GST-valid.
 */
export function checkSeriesPattern(pattern: string, maxSeq = 99999, device = "Z9"): NumberProblem | null {
  if (!/\{SEQ(?::\d+)?\}/.test(pattern)) return "empty";
  return checkGstDocumentNumber(formatDocumentNumber(pattern, { fyShort: "25-26", fyLabel: "2025-26", seq: maxSeq, device }));
}
