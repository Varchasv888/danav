/// Exact money arithmetic on whole numbers (BigInt, so it is the same on Android, Windows and the web), mirroring the server's Decimal rules:
/// half up rounding, amounts kept as strings with two decimals.
library;

final BigInt _ten = BigInt.from(10);

BigInt pow10(int n) => _ten.pow(n);

/// Parses "1234.5", "-0.05" or "12" into an integer with [scale] decimals; more digits than [scale] round half up (away from zero).
/// Throws a [FormatException] for anything that is not a plain decimal number.
BigInt parseScaled(String input, int scale) {
  final s = input.trim().replaceAll(',', '');
  final m = RegExp(r'^([+-]?)(\d*)(?:\.(\d*))?$').firstMatch(s);
  if (m == null || (m.group(2)!.isEmpty && (m.group(3) ?? '').isEmpty))
    throw FormatException('not a number: $input');
  final neg = m.group(1) == '-';
  final whole = m.group(2)!.isEmpty ? '0' : m.group(2)!;
  var frac = m.group(3) ?? '';
  var carry = BigInt.zero;
  if (frac.length > scale) {
    carry = int.parse(frac[scale]) >= 5 ? BigInt.one : BigInt.zero;
    frac = frac.substring(0, scale);
  } else {
    frac = frac.padRight(scale, '0');
  }
  final v = BigInt.parse(whole + frac) + carry;
  return neg ? -v : v;
}

/// n / d rounded half up (away from zero); d must be positive.
BigInt divRound(BigInt n, BigInt d) {
  final neg = n.isNegative;
  final a = n.abs();
  final q = a ~/ d;
  final r = a - q * d;
  final up = r * BigInt.two >= d ? q + BigInt.one : q;
  return neg ? -up : up;
}

/// Paise as "1234.50".
String paiseToString(BigInt paise) {
  final neg = paise.isNegative;
  final a = paise.abs();
  final s = a.toString().padLeft(3, '0');
  return '${neg ? '-' : ''}${s.substring(0, s.length - 2)}.${s.substring(s.length - 2)}';
}

BigInt paiseOf(String amount) => parseScaled(amount, 2);
