import { Decimal } from "decimal.js";

/**
 * All money and quantity arithmetic goes through Decimal — never JS numbers.
 * Amounts cross API and fixture boundaries as strings ("1234.50") so no precision is lost.
 */
export const D = Decimal.clone({ precision: 40, rounding: Decimal.ROUND_HALF_UP });
export type Dec = InstanceType<typeof D>;
export type DecimalInput = string | number | Dec;

export const dec = (v: DecimalInput): Dec => new D(v);

/** Round to paise (2 dp), half-up, which is how GST amounts are rounded on invoices. */
export const round2 = (v: DecimalInput): Dec => dec(v).toDecimalPlaces(2, D.ROUND_HALF_UP);

/** Canonical string form for storage and fixtures: always two decimals. */
export const money = (v: DecimalInput): string => round2(v).toFixed(2);

export const sum = (values: DecimalInput[]): Dec => values.reduce<Dec>((acc, v) => acc.plus(v), dec(0));

/** Round a total to the nearest rupee and return the round-off adjustment (can be negative). */
export function roundOffToRupee(total: DecimalInput): { rounded: string; roundOff: string } {
  const t = round2(total);
  const rounded = t.toDecimalPlaces(0, D.ROUND_HALF_UP);
  return { rounded: rounded.toFixed(2), roundOff: rounded.minus(t).toFixed(2) };
}
