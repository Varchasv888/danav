import { describe, expect, it } from "vitest";
import { loyaltyEarningShare } from "../src/index.js";

const lines = [
  { amount: "600", discounted: false, brand: "Varsha", category: "Shirts" },
  { amount: "300", discounted: true, brand: "Other", category: "Shirts" },
  { amount: "100", discounted: false, brand: "Other", category: "Socks" },
];

describe("loyaltyEarningShare", () => {
  it("is 1 when nothing is excluded", () => expect(loyaltyEarningShare(lines, {}).toString()).toBe("1"));
  it("leaves out discounted lines only when asked", () => expect(loyaltyEarningShare(lines, { discountedItems: true }).toFixed(2)).toBe("0.70"));
  it("gives nothing on a bill with any discount when the whole bill is excluded", () => expect(loyaltyEarningShare(lines, { discountedBills: true }).toString()).toBe("0"));
  it("leaves out brands and categories without regard to case", () => {
    expect(loyaltyEarningShare(lines, { brands: ["varsha"] }).toFixed(2)).toBe("0.40");
    expect(loyaltyEarningShare(lines, { categories: [" SOCKS "] }).toFixed(2)).toBe("0.90");
  });
  it("adds the exclusions together without counting a line twice", () => expect(loyaltyEarningShare(lines, { discountedItems: true, categories: ["shirts"], brands: ["other"] }).toString()).toBe("0"));
  it("is 0 for an empty or zero bill", () => { expect(loyaltyEarningShare([], {}).toString()).toBe("0"); expect(loyaltyEarningShare([{ amount: "0", discounted: false }], {}).toString()).toBe("0"); });
});
