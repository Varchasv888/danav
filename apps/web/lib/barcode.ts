/**
 * EAN-13 as bar modules (true = black), 95 wide: guard, six left digits (L or G code by the first
 * digit), centre guard, six right digits (R code), guard. Returns null for anything that is not a valid
 * 13-digit EAN with the right check digit, so the label prints the code as text instead.
 */
const L = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];
const G = ["0100111", "0110011", "0011011", "0100001", "0011101", "0111001", "0000101", "0010001", "0001001", "0010111"];
const R = ["1110010", "1100110", "1101100", "1000010", "1011100", "1001110", "1010000", "1000100", "1001000", "1110100"];
const PARITY = ["LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG", "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL"];

export function eanCheckDigit(first12: string) {
  const sum = first12.split("").reduce((s, d, i) => s + Number(d) * (i % 2 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10;
}

export function ean13Modules(code: string): boolean[] | null {
  if (!/^\d{13}$/.test(code) || eanCheckDigit(code.slice(0, 12)) !== Number(code[12])) return null;
  const d = code.split("").map(Number);
  const parity = PARITY[d[0]!]!;
  let bits = "101";
  for (let i = 1; i <= 6; i++) bits += (parity[i - 1] === "L" ? L : G)[d[i]!]!;
  bits += "01010";
  for (let i = 7; i <= 12; i++) bits += R[d[i]!]!;
  bits += "101";
  return bits.split("").map((b) => b === "1");
}
