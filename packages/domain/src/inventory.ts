import { dec, money, round2, type Dec, type DecimalInput } from "./money.js";

/**
 * Stock valuation. Entries for one item in one warehouse are replayed in (date, seq) order.
 *
 * - Incoming entries carry their own cost rate (purchase rate, opening rate, transfer-in rate).
 * - Outgoing entries are valued by the method: moving average, or FIFO layers.
 * - An outgoing entry that takes the whole remaining quantity takes the whole remaining value,
 *   so rounding never leaves a few paise of "ghost" value on zero stock.
 * - Stock may go negative (Tally allows it, with a warning). Outgoing quantity beyond what is on hand
 *   is valued at the last known rate. The next receipt restarts valuation at its own rate.
 *
 * Quantities are kept to 4 decimals, values to 2 (paise).
 */
export type ValuationMethod = "fifo" | "average";

export interface StockMove {
  qtyIn?: DecimalInput;
  qtyOut?: DecimalInput;
  /** Cost per unit of an incoming entry. Ignored for outgoing entries. */
  rate?: DecimalInput;
}

export interface ValuedMove {
  /** Value added (+) or removed (−) by this entry. */
  valueChange: string;
  /** Rate the entry was valued at (incoming: its own rate; outgoing: average or blended FIFO rate). */
  rate: string;
  balanceQty: string;
  balanceValue: string;
}

const qty4 = (v: DecimalInput) => dec(v).toDecimalPlaces(4);
const q = (v: Dec) => v.toFixed(4);

export function valueStock(moves: StockMove[], method: ValuationMethod): { moves: ValuedMove[]; qty: string; value: string } {
  let balQty = dec(0);
  let balValue = dec(0);
  let lastRate = dec(0);
  let layers: { qty: Dec; rate: Dec }[] = []; // FIFO only, oldest first
  const out: ValuedMove[] = [];

  for (const m of moves) {
    const inQ = qty4(m.qtyIn ?? 0);
    const outQ = qty4(m.qtyOut ?? 0);
    if (inQ.isNegative() || outQ.isNegative()) throw new Error("quantities must not be negative");
    if (!inQ.isZero() && !outQ.isZero()) throw new Error("an entry is either incoming or outgoing");

    if (!inQ.isZero()) {
      const rate = dec(m.rate ?? 0);
      const before = balValue;
      if (balQty.lte(0)) {
        // Restart after zero or negative stock: what's left on hand is valued at this receipt's rate.
        const newQty = balQty.plus(inQ);
        balValue = newQty.gt(0) ? round2(newQty.times(rate)) : dec(0);
        layers = newQty.gt(0) ? [{ qty: newQty, rate }] : [];
        balQty = newQty;
      } else {
        balQty = balQty.plus(inQ);
        balValue = balValue.plus(round2(inQ.times(rate)));
        layers.push({ qty: inQ, rate });
      }
      lastRate = rate;
      // The change is new minus old value: after negative stock it includes re-valuing the shortfall.
      out.push({ valueChange: money(balValue.minus(before)), rate: money(rate), balanceQty: q(balQty), balanceValue: money(balValue) });
      continue;
    }

    // Outgoing.
    let removed: Dec;
    const available = balQty.gt(0) ? balQty : dec(0);
    const fromStock = outQ.lte(available) ? outQ : available;
    const shortfall = outQ.minus(fromStock);

    if (fromStock.equals(available) && available.gt(0)) {
      removed = balValue; // takes everything that's left
      layers = [];
    } else if (method === "average") {
      removed = available.isZero() ? dec(0) : round2(balValue.div(balQty).times(fromStock));
    } else {
      removed = dec(0);
      let need = fromStock;
      while (need.gt(0) && layers.length) {
        const layer = layers[0]!;
        const take = layer.qty.lte(need) ? layer.qty : need;
        removed = removed.plus(take.times(layer.rate));
        layer.qty = layer.qty.minus(take);
        need = need.minus(take);
        if (layer.qty.isZero()) layers.shift();
      }
      removed = round2(removed);
    }
    if (available.gt(0)) lastRate = balValue.div(balQty);
    removed = removed.plus(round2(shortfall.times(lastRate)));

    balQty = balQty.minus(outQ);
    balValue = balValue.minus(removed);
    const rate = outQ.isZero() ? dec(0) : removed.div(outQ);
    out.push({ valueChange: money(removed.neg()), rate: money(rate), balanceQty: q(balQty), balanceValue: money(balValue) });
  }
  return { moves: out, qty: q(balQty), value: money(balValue) };
}

/** GST Unique Quantity Codes most small businesses need (e-invoice and GSTR-1 HSN summary use these). */
export const UQC = [
  { code: "NOS", name: "Numbers", nameHi: "संख्या", decimals: 0 },
  { code: "PCS", name: "Pieces", nameHi: "पीस", decimals: 0 },
  { code: "BOX", name: "Box", nameHi: "डिब्बा", decimals: 0 },
  { code: "PAC", name: "Packs", nameHi: "पैकेट", decimals: 0 },
  { code: "BTL", name: "Bottles", nameHi: "बोतल", decimals: 0 },
  { code: "DOZ", name: "Dozens", nameHi: "दर्जन", decimals: 0 },
  { code: "KGS", name: "Kilograms", nameHi: "किलोग्राम", decimals: 3 },
  { code: "GMS", name: "Grams", nameHi: "ग्राम", decimals: 0 },
  { code: "QTL", name: "Quintal", nameHi: "क्विंटल", decimals: 3 },
  { code: "TON", name: "Tonnes", nameHi: "टन", decimals: 3 },
  { code: "LTR", name: "Litres", nameHi: "लीटर", decimals: 3 },
  { code: "MLT", name: "Millilitres", nameHi: "मिलीलीटर", decimals: 0 },
  { code: "MTR", name: "Metres", nameHi: "मीटर", decimals: 2 },
  { code: "SQF", name: "Square feet", nameHi: "वर्ग फुट", decimals: 2 },
  { code: "BAG", name: "Bags", nameHi: "बोरी", decimals: 0 },
  { code: "SET", name: "Sets", nameHi: "सेट", decimals: 0 },
  { code: "OTH", name: "Others", nameHi: "अन्य", decimals: 2 },
] as const;

/** HSN (goods) is 4–8 digits; SAC (services) is 6 digits starting with 99. */
export function checkHsn(code: string, kind: "goods" | "service"): "invalid" | null {
  const c = code.trim();
  if (kind === "service") return /^99\d{4}$/.test(c) ? null : "invalid";
  return /^\d{4}(\d{2}(\d{2})?)?$/.test(c) ? null : "invalid";
}
