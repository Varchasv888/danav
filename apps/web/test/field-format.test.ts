import { describe, expect, it } from "vitest";
import { cleanAmount, finishAmount, formatDateText, groupTyping, monthGrid, parseDateText } from "../lib/field-format";

describe("amounts", () => {
  it("cleans a pasted amount and groups digits the Indian way while typing", () => {
    expect(cleanAmount("₹ 12,500.00")).toBe("12500.00");
    expect(cleanAmount("Rs. 1,234,567.891")).toBe("1234567.89");
    expect(cleanAmount("0012.5")).toBe("12.5");
    expect(cleanAmount("-45", { negative: true })).toBe("-45");
    expect(cleanAmount("-45")).toBe("45");
    expect(cleanAmount("12.5", { decimals: 0 })).toBe("12");
    expect(groupTyping("1234567.5")).toBe("12,34,567.5");
    expect(groupTyping("999")).toBe("999");
    expect(groupTyping("1000")).toBe("1,000");
    expect(groupTyping("12.")).toBe("12.");
    expect(groupTyping(".5")).toBe("0.5");
    expect(groupTyping("-100000")).toBe("-1,00,000");
  });
  it("finishes the amount with its decimals, or nothing", () => {
    expect(finishAmount("12500")).toBe("12500.00");
    expect(finishAmount("12.5", 3)).toBe("12.500");
    expect(finishAmount("")).toBe("");
    expect(finishAmount("-")).toBe("");
  });
});

describe("dates typed the quick way", () => {
  const today = "2026-11-11";
  it("reads shortcuts", () => {
    expect(parseDateText("t", today)).toBe("2026-11-11");
    expect(parseDateText("y", today)).toBe("2026-11-10");
    expect(parseDateText("+3", today)).toBe("2026-11-14");
    expect(parseDateText("-11", today)).toBe("2026-10-31");
    expect(parseDateText("e", today)).toBe("2026-11-30");
  });
  it("reads digits with or without separators, and month names", () => {
    expect(parseDateText("05", today)).toBe("2026-11-05");
    expect(parseDateText("0512", today)).toBe("2026-12-05");
    expect(parseDateText("05/12", today)).toBe("2026-12-05");
    expect(parseDateText("051226", today)).toBe("2026-12-05");
    expect(parseDateText("5-12-25", today)).toBe("2025-12-05");
    expect(parseDateText("05122027", today)).toBe("2027-12-05");
    expect(parseDateText("5 dec", today)).toBe("2026-12-05");
    expect(parseDateText("5 Dec 2027", today)).toBe("2027-12-05");
    expect(parseDateText("2026-02-28", today)).toBe("2026-02-28");
  });
  it("refuses what is not a date", () => {
    expect(parseDateText("31/02", today)).toBeNull();
    expect(parseDateText("hello", today)).toBeNull();
    expect(parseDateText("", today)).toBeNull();
    expect(parseDateText("1313", today)).toBeNull();
  });
  it("shows a date as 11 Nov 2026 and lays out a month", () => {
    expect(formatDateText("2026-11-01")).toBe("1 Nov 2026");
    expect(monthGrid(2026, 2)).toEqual({ days: 28, first: 0 });
    expect(monthGrid(2026, 11).days).toBe(30);
  });
});

import { isZeroAmount, numberOnBlur, numberOnFocus } from "../lib/field-format";

describe("zero clears on focus", () => {
  it("recognises zero in its many forms, and nothing else", () => {
    for (const z of ["0", "0.00", "00", "0.", ".00", "₹ 0.00", "-0", "0,000.0"]) expect(isZeroAmount(z), z).toBe(true);
    for (const n of ["", " ", "5", "0.01", "10", "100", "-1", "0.5"]) expect(isZeroAmount(n), n).toBe(false);
  });
  it("empties a zero on focus and selects any other value", () => {
    expect(numberOnFocus("0")).toEqual({ text: "", select: false });
    expect(numberOnFocus("0.00")).toEqual({ text: "", select: false });
    expect(numberOnFocus("1,250.50")).toEqual({ text: "1,250.50", select: true });
    expect(numberOnFocus("")).toEqual({ text: "", select: true });
  });
  it("on leaving, an empty required box goes back to zero in its format and an optional one stays empty", () => {
    expect(numberOnBlur("", { required: true, decimals: 2 })).toBe("0.00");
    expect(numberOnBlur("", { required: true })).toBe("0");
    expect(numberOnBlur("", { decimals: 2 })).toBe("");
    expect(numberOnBlur("   ", { required: true, decimals: 2 })).toBe("0.00");
    expect(numberOnBlur("12.5", { required: true, decimals: 2 })).toBe("12.5");
  });
});
