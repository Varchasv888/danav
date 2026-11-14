"use client";

import { createContext, useContext } from "react";

const Ctx = createContext(2);

/** The number of decimal places the business chose for amounts, for the report lists inside it. */
export function ReportDecimals({ value, children }: { value: number; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useReportDecimals = () => useContext(Ctx);
