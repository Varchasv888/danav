import { describe, expect, it } from "vitest";
import { amountInWordsIntl, cleanPreferences, resolvePreferences, rollWidth } from "../src/index.js";

describe("print preferences", () => {
  it("reads layouts and rolls saved by the first version as the layouts they stand for", () => {
    expect(cleanPreferences({ "print.theme": "clean", "thermal.theme": "compact", "thermal.paper": "80" })).toEqual({ "print.theme": "gst1", "thermal.theme": "theme2", "thermal.size": "68" });
    expect(cleanPreferences({ "thermal.paper": "58" })).toEqual({ "thermal.size": "58" });
  });

  it("keeps text and whole numbers within their limits, and refuses a logo that is not a picture", () => {
    expect(cleanPreferences({ "print.phoneText": " 98765 43210 ", "print.addressText": "x".repeat(201) })).toEqual({ "print.phoneText": "98765 43210" });
    expect(cleanPreferences({ "thermal.copies": "3", "thermal.extraLines": 2, "thermal.chars": "10" })).toEqual({ "thermal.copies": "3", "thermal.extraLines": "2" });
    expect(cleanPreferences({ "print.logo": "https://example.com/a.png" })).toEqual({});
    expect(cleanPreferences({ "print.logo": "data:image/png;base64,iVBORw0KGgo=" })).toEqual({ "print.logo": "data:image/png;base64,iVBORw0KGgo=" });
  });

  it("gives every option a default and keeps the shared option names on both printers", () => {
    const pf = resolvePreferences({});
    expect(pf["print.theme"]).toBe("tally");
    expect(pf["thermal.theme"]).toBe("theme1");
    for (const n of ["showSno", "showHsn", "showMrp", "showTotalQty", "amountDecimal", "amountGrouping", "wordsStyle"]) {
      expect(pf).toHaveProperty(`print.${n}`);
      expect(pf).toHaveProperty(`thermal.${n}`);
    }
  });

  it("works out the printable width of a roll", () => {
    expect(rollWidth("58", "48").mm).toBe(48);
    expect(rollWidth("68", "48").mm).toBe(68);
    expect(rollWidth("custom", "40").mm).toBe(56);
  });

  it("spells an amount in the international system", () => {
    expect(amountInWordsIntl("1234567.50")).toBe("Rupees One Million Two Hundred Thirty-Four Thousand Five Hundred Sixty-Seven and Fifty Paise Only");
    expect(amountInWordsIntl("0")).toBe("Rupees Zero Only");
  });
});
