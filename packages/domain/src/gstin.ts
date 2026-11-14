import { isValidStateCode } from "./states.js";

const CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// 2 state digits, 10-char PAN, entity number, 'Z' (default), checksum.
const SHAPE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z][A-Z0-9][0-9A-Z]$/;

/** GSTN's mod-36 check character over the first 14 characters. */
export function gstinCheckChar(first14: string): string {
  let total = 0;
  for (let i = 0; i < 14; i++) {
    const value = CHARSET.indexOf(first14[i]!);
    if (value < 0) throw new Error(`invalid GSTIN character: ${first14[i]}`);
    const product = value * (i % 2 === 0 ? 1 : 2);
    total += Math.floor(product / 36) + (product % 36);
  }
  return CHARSET[(36 - (total % 36)) % 36]!;
}

export type GstinError = "length" | "format" | "state" | "checksum";

export function validateGstin(raw: string): { valid: true; gstin: string; stateCode: string; pan: string } | { valid: false; error: GstinError } {
  const gstin = raw.trim().toUpperCase();
  if (gstin.length !== 15) return { valid: false, error: "length" };
  if (!SHAPE.test(gstin)) return { valid: false, error: "format" };
  const stateCode = gstin.slice(0, 2);
  if (!isValidStateCode(stateCode)) return { valid: false, error: "state" };
  if (gstinCheckChar(gstin.slice(0, 14)) !== gstin[14]) return { valid: false, error: "checksum" };
  return { valid: true, gstin, stateCode, pan: gstin.slice(2, 12) };
}
