import { describe, expect, it } from "vitest";
import { bankRow, compareFigures, overallState, waitingRow } from "../src/index.js";

describe("reconciliation overview", () => {
  it("two figures that agree within a rupee are ok, and anything else differs by the exact amount", () => {
    expect(compareFigures("customers", "125000.00", "125000.50")).toMatchObject({ state: "ok", difference: "-0.50" });
    expect(compareFigures("suppliers", "90000", "88000")).toMatchObject({ state: "differs", difference: "2000.00", left: "90000.00", right: "88000.00" });
  });

  it("bank has no second figure: it is ok only when no statement line is left unmatched", () => {
    expect(bankRow(0, 2)).toMatchObject({ state: "ok", open: 0 });
    expect(bankRow(7, 2)).toMatchObject({ state: "differs", open: 7 });
    expect(bankRow(0, 0).state).toBe("waiting");
  });

  it("the overall state is the worst of the areas that could be compared", () => {
    const ok = compareFigures("stock", "10", "10");
    expect(overallState([ok, waitingRow("gst")])).toBe("ok");
    expect(overallState([ok, compareFigures("customers", "10", "50")])).toBe("differs");
    expect(overallState([waitingRow("gst"), waitingRow("bank")])).toBe("waiting");
  });
});
