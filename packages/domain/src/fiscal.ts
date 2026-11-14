/** Indian financial year: 1 April to 31 March. Dates are ISO "YYYY-MM-DD" strings (no time zone games). */
export interface FiscalYear {
  startYear: number;
  start: string; // "2025-04-01"
  end: string; // "2026-03-31"
  label: string; // "2025-26"
  short: string; // "25-26"
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function fiscalYearFor(startYear: number): FiscalYear {
  const endYear = startYear + 1;
  const yy = (n: number) => String(n % 100).padStart(2, "0");
  return {
    startYear,
    start: `${startYear}-04-01`,
    end: `${endYear}-03-31`,
    label: `${startYear}-${yy(endYear)}`,
    short: `${yy(startYear)}-${yy(endYear)}`,
  };
}

export function fiscalYearOf(isoDate: string): FiscalYear {
  const m = ISO_DATE.exec(isoDate);
  if (!m) throw new Error(`expected YYYY-MM-DD, got ${isoDate}`);
  const year = Number(m[1]);
  const month = Number(m[2]);
  return fiscalYearFor(month >= 4 ? year : year - 1);
}

export function isInFiscalYear(isoDate: string, fy: FiscalYear): boolean {
  return isoDate >= fy.start && isoDate <= fy.end;
}
